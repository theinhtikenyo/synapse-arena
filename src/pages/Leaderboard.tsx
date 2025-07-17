import React, { useState } from 'react';
import { Trophy, Medal, Award, TrendingUp, Calendar } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// Function to generate initials from name
const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
};

function Leaderboard() {
  const { users } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('all');

  // Sort users by points in descending order
  const sortedUsers = [...users]
    .sort((a, b) => b.points - a.points)
    .map((user, index) => ({ ...user, rank: index + 1 }));

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="h-6 w-6 text-yellow-400" />;
      case 2: return <Medal className="h-6 w-6 text-gray-400" />;
      case 3: return <Award className="h-6 w-6 text-orange-500" />;
      default: return <span className="text-lg font-bold text-gray-600 dark:text-gray-400">#{rank}</span>;
    }
  };

  const getRankBackground = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200 dark:from-yellow-900/20 dark:to-yellow-800/20 dark:border-yellow-500/30';
      case 2: return 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200 dark:from-gray-700/20 dark:to-gray-600/20 dark:border-gray-500/30';
      case 3: return 'bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200 dark:from-orange-900/20 dark:to-orange-800/20 dark:border-orange-500/30';
      default: return 'bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700';
    }
  };

  if (sortedUsers.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Leaderboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">See how you rank against other developers</p>
        </div>
        
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <Trophy className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">No users found. Start solving problems to appear on the leaderboard!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Leaderboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">See how you rank against other developers</p>
      </div>

      {/* Filter Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Calendar className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Time Period:</span>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="all">All Time</option>
              <option value="month">This Month</option>
              <option value="week">This Week</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <TrendingUp className="h-4 w-4" />
            <span>Updated in real-time</span>
          </div>
        </div>
      </div>

      {/* Top 3 Podium */}
      {sortedUsers.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {sortedUsers.slice(0, 3).map((user) => (
            <div key={user.rank} className={`rounded-lg border p-6 ${getRankBackground(user.rank)}`}>
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  {getRankIcon(user.rank)}
                </div>
                {user.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.name}
                    className="w-16 h-16 rounded-full mx-auto mb-4 object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">
                      {getInitials(user.name)}
                    </span>
                  </div>
                )}
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{user.name}</h3>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400 mt-2">{user.points.toLocaleString()}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">points</p>
                
                <div className="mt-4 grid grid-cols-1 gap-2 text-sm">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{user.problemsSolved}</p>
                    <p className="text-gray-600 dark:text-gray-400">Problems Solved</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Full Leaderboard */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Full Rankings</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Points</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Problems Solved</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {sortedUsers.map((user) => (
                <tr key={user.rank} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getRankIcon(user.rank)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {user.avatar ? (
                        <img 
                          src={user.avatar} 
                          alt={user.name}
                          className="w-8 h-8 rounded-full mr-3 object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center mr-3">
                          <span className="text-white font-bold text-sm">
                            {getInitials(user.name)}
                          </span>
                        </div>
                      )}
                      <div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</span>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-bold text-orange-600 dark:text-orange-400">{user.points.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900 dark:text-white">{user.problemsSolved}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;
