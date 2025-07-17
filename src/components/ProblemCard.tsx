import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { Problem } from '../contexts/ProblemContext';

interface ProblemCardProps {
  problem: Problem;
}

function ProblemCard({ problem }: ProblemCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
      case 'Hard': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // Check if problem is solved
  const solvedProblems = JSON.parse(localStorage.getItem('solved-problems') || '[]');
  const isSolved = solvedProblems.includes(problem.id);

  return (
    <Link to={`/problem/${problem.id}`} className="block group">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:border-orange-500 transition-colors duration-300">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors flex items-center space-x-2">
            <span>{problem.title}</span>
            {isSolved && <CheckCircle className="h-5 w-5 text-green-500" />}
          </h3>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(problem.difficulty)}`}>
            {problem.difficulty}
          </span>
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {problem.description || 'No description available'}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
              {problem.category}
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-400">
              {problem.points} pts
            </span>
          </div>
          <span className="text-sm text-orange-600 dark:text-orange-400 font-medium group-hover:text-orange-700 dark:group-hover:text-orange-300">
            {isSolved ? 'Solved ✓' : 'Solve →'}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default ProblemCard;
