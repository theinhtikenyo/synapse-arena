import React from 'react';
import { Link } from 'react-router-dom';
import { Code, Calendar, Trophy, Users, Clock, TrendingUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useEvent } from '../contexts/EventContext';
import { useProblem } from '../contexts/ProblemContext';

function Dashboard() {
  const { user } = useAuth();
  const { events } = useEvent();
  const { problems, categories } = useProblem();

  const upcomingEvents = events.filter(e => e.status === 'registration' || e.status === 'active').slice(0, 3);
  const recentProblems = problems.slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back, {user?.name}!</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Ready to tackle some coding challenges?</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <Code className="h-8 w-8 text-orange-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Problems Solved</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{user?.problemsSolved || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <Trophy className="h-8 w-8 text-yellow-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Points Earned</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{user?.points || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Available Events</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{upcomingEvents.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Available Problems</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{problems.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Events */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Upcoming Events</h2>
            <Link to="/events" className="text-orange-600 hover:text-orange-700 font-medium dark:text-orange-400 dark:hover:text-orange-300">
              View all →
            </Link>
          </div>
          
          <div className="space-y-4">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{event.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{event.description}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="h-4 w-4" />
                        <span>{event.startTime.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                        <Users className="h-4 w-4" />
                        <span>{event.registeredUsers.length} registered</span>
                      </div>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    event.status === 'registration' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300' : 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                  }`}>
                    {event.status === 'registration' ? 'Open' : 'Live'}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                <p>No upcoming events</p>
              </div>
            )}
          </div>
        </div>

        {/* Problem Categories */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Problem Categories</h2>
            <Link to="/problems" className="text-orange-600 hover:text-orange-700 font-medium dark:text-orange-400 dark:hover:text-orange-300">
              Browse all →
            </Link>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {categories.length > 0 ? (
              categories.map((category) => {
                const categoryProblems = problems.filter(p => p.category === category);
                return (
                  <Link
                    key={category}
                    to={`/problems?category=${category}`}
                    className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:border-orange-200 dark:hover:border-orange-500/50 border border-transparent transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{category}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{categoryProblems.length} problems</p>
                      </div>
                      <Code className="h-5 w-5 text-orange-500" />
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="col-span-2 text-center py-8 text-gray-500 dark:text-gray-400">
                <Code className="h-12 w-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                <p>No problem categories available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Problems */}
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Practice Problems</h2>
          <Link to="/problems" className="text-orange-600 hover:text-orange-700 font-medium dark:text-orange-400 dark:hover:text-orange-300">
            View all →
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recentProblems.length > 0 ? (
            recentProblems.map((problem) => (
              <Link
                key={problem.id}
                to={`/problem/${problem.id}`}
                className="block p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:border-orange-200 dark:hover:border-orange-500/50 border border-transparent transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{problem.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{problem.description}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200">
                        {problem.category}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        problem.difficulty === 'Easy' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' :
                        problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300' :
                        'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
                      }`}>
                        {problem.difficulty}
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-400">
                        {problem.points} pts
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-2 text-center py-8 text-gray-500 dark:text-gray-400">
              <Code className="h-12 w-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <p>No problems available. Ask an admin to add some!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
