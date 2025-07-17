import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import { useProblem } from '../contexts/ProblemContext';
import { useEvent } from '../contexts/EventContext';
import ProblemCard from '../components/ProblemCard';

function ProblemList() {
  const { problems, categories: allCategories } = useProblem();
  const { events } = useEvent();
  const { eventId } = useParams<{ eventId: string }>();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');

  const { event, problemsForEvent } = useMemo(() => {
    if (!eventId) {
      return { event: undefined, problemsForEvent: problems };
    }
    const currentEvent = events.find(e => e.id === eventId);
    if (!currentEvent) {
      return { event: undefined, problemsForEvent: [] };
    }
    const eventProblemIds = currentEvent.problems.map(p => p.problemId);
    const eventProblems = problems.filter(p => eventProblemIds.includes(p.id));
    return { event: currentEvent, problemsForEvent: eventProblems };
  }, [eventId, events, problems]);

  const filteredProblems = useMemo(() => {
    return problemsForEvent.filter(problem => {
      const matchesSearch = (problem.title ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (problem.description ?? '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || problem.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'All' || problem.difficulty === selectedDifficulty;
      
      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [problemsForEvent, searchTerm, selectedCategory, selectedDifficulty]);

  const categories = useMemo(() => {
    if (eventId) {
      const eventCategories = new Set(problemsForEvent.map(p => p.category).filter(Boolean));
      return Array.from(eventCategories);
    }
    return allCategories;
  }, [eventId, problemsForEvent, allCategories]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        {event ? (
          <>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Event Problems: {event.title}</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Solve the problems for this event to climb the leaderboard.</p>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Problems</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Practice coding problems and improve your skills</p>
          </>
        )}
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search problems..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            />
          </div>
          
          <div className="flex space-x-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="All">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>
      </div>

      {/* Problem Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{problemsForEvent.length}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Problems</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{filteredProblems.length}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Filtered Results</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{categories.length}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Categories</p>
          </div>
        </div>
      </div>

      {/* Problems Grid */}
      {filteredProblems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProblems.map(problem => (
            <ProblemCard key={problem.id} problem={problem} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Filter className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            {problemsForEvent.length === 0 
              ? "No problems available for this event." 
              : "No problems found matching your criteria."
            }
          </p>
        </div>
      )}
    </div>
  );
}

export default ProblemList;
