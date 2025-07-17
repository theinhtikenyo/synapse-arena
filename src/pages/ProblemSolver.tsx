import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, RotateCcw, CheckCircle, Trophy } from 'lucide-react';
import { useProblem } from '../contexts/ProblemContext';
import { useAuth } from '../contexts/AuthContext';
import { useEvent } from '../contexts/EventContext';

function ProblemSolver() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProblemById, runTests } = useProblem();
  const { user, addPoints, incrementProblemsSolved } = useAuth();
  const { events, submitSolution } = useEvent();
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const problem = getProblemById(id || '');

  useEffect(() => {
    if (problem) {
      setCode(problem.template);
      const solvedProblems = JSON.parse(localStorage.getItem('solved-problems') || '[]');
      setHasSubmitted(solvedProblems.includes(problem.id));
    }
  }, [problem]);

  if (!problem) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Problem not found</h1>
          <button
            onClick={() => navigate('/problems')}
            className="mt-4 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md"
          >
            Back to Problems
          </button>
        </div>
      </div>
    );
  }

  const handleRun = async () => {
    setIsRunning(true);
    setOutput('Running tests...');
    
    try {
      const result = await runTests(problem.id, code);
      setTestResults(result.results);
      setOutput(result.output);
      
      if (!result.passed) {
        setIsRunning(false);
        return;
      }

      // Passed all tests
      const activeEvent = events.find(e => 
        e.status === 'active' && 
        user && 
        e.registeredUsers.includes(user.id) &&
        e.problems.some(p => p.problemId === problem.id)
      );

      if (activeEvent) {
        // Event context
        const hasSubmittedForEvent = user && activeEvent.submissions[user.id]?.[problem.id];
        if (hasSubmittedForEvent) {
          setOutput("You have already submitted a solution for this problem in the event.");
        } else {
          // New event submission
          const eventProblem = activeEvent.problems.find(p => p.problemId === problem.id)!;
          const score = result.results.filter(r => r.passed).length;
          
          const { allProblemsSolved } = await submitSolution(activeEvent.id, user!.id, problem.id, code, score);
          
          addPoints(eventProblem.points); // Use event-specific points

          if (allProblemsSolved) {
            addPoints(activeEvent.completionBonus);
            setOutput(`All event problems solved! You earned a bonus of ${activeEvent.completionBonus} points!`);
          }

          if (!hasSubmitted) {
            incrementProblemsSolved();
            const solvedProblems = JSON.parse(localStorage.getItem('solved-problems') || '[]');
            solvedProblems.push(problem.id);
            localStorage.setItem('solved-problems', JSON.stringify(solvedProblems));
            setHasSubmitted(true);
          }
          
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 5000);
        }
      } else {
        // Standard context
        if (hasSubmitted) {
          setOutput("You have already solved this problem.");
        } else {
          // New standard submission
          addPoints(problem.points);
          incrementProblemsSolved();
          
          const solvedProblems = JSON.parse(localStorage.getItem('solved-problems') || '[]');
          solvedProblems.push(problem.id);
          localStorage.setItem('solved-problems', JSON.stringify(solvedProblems));
          setHasSubmitted(true);
          
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 5000);
        }
      }

    } catch (error: any) {
      setOutput(`Error: ${error.message}`);
    }
    
    setIsRunning(false);
  };

  const handleReset = () => {
    setCode(problem.template);
    setOutput('');
    setTestResults([]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4 text-center">
            <div className="mb-4">
              <Trophy className="h-16 w-16 text-yellow-500 mx-auto" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Congratulations!</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              You've successfully solved "{problem.title}" and earned {problem.points} points!
            </p>
            <button
              onClick={() => setShowSuccess(false)}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md font-medium"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-screen">
        {/* Problem Description */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{problem.title}</h1>
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                problem.difficulty === 'Easy' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' :
                problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300' :
                'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
              }`}>
                {problem.difficulty}
              </span>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300">
                {problem.points} points
              </span>
              {hasSubmitted && (
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">
                  ✓ Solved
                </span>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Description</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{problem.description}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Examples</h3>
              <div className="space-y-4">
                {problem.examples.map((example, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Example {index + 1}:</p>
                    <div className="space-y-2">
                      <p className="text-sm"><strong>Input:</strong> <code className="bg-gray-200 dark:bg-gray-600 px-1 rounded font-mono">{example.input}</code></p>
                      <p className="text-sm"><strong>Output:</strong> <code className="bg-gray-200 dark:bg-gray-600 px-1 rounded font-mono">{example.output}</code></p>
                      {example.explanation && (
                        <p className="text-sm"><strong>Explanation:</strong> {example.explanation}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Constraints</h3>
              <ul className="list-disc list-inside space-y-1">
                {problem.constraints.map((constraint, index) => (
                  <li key={index} className="text-sm text-gray-700 dark:text-gray-300">{constraint}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Code Editor */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Code Editor</h2>
            <div className="flex space-x-2">
              <button
                onClick={handleReset}
                className="flex items-center space-x-1 px-3 py-1 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:border-gray-600 dark:hover:bg-gray-700"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Reset</span>
              </button>
              <button
                onClick={handleRun}
                disabled={isRunning}
                className="flex items-center space-x-1 px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-md disabled:opacity-50"
              >
                <Play className="h-4 w-4" />
                <span>{isRunning ? 'Running...' : 'Run Tests'}</span>
              </button>
            </div>
          </div>

          <div className="flex-1 flex flex-col space-y-4">
            <div className="flex-1">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-full p-4 border border-gray-300 rounded-md font-mono text-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 resize-none dark:bg-gray-900 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-orange-500"
                placeholder="Write your solution here..."
                style={{ fontFamily: 'JetBrains Mono, Consolas, Monaco, monospace' }}
              />
            </div>

            {/* Output */}
            <div className="h-32 border border-gray-300 dark:border-gray-600 rounded-md p-4 bg-gray-50 dark:bg-gray-900">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Output</h3>
              <pre className="text-sm text-gray-900 dark:text-gray-300 font-mono whitespace-pre-wrap overflow-y-auto h-20">
                {output || 'Click "Run Tests" to see the output...'}
              </pre>
            </div>

            {/* Test Results */}
            {testResults.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Test Results</h3>
                <div className="flex flex-wrap gap-2">
                  {testResults.map((result, index) => (
                    <div
                      key={index}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        result.passed ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
                      }`}
                    >
                      Test {index + 1}: {result.passed ? 'PASSED' : 'FAILED'}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProblemSolver;
