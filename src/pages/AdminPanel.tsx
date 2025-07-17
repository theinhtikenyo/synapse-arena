import React, { useState } from 'react';
import { Plus, Edit, Trash2, Calendar, Code, Users, Settings, Save, X, Trophy } from 'lucide-react';
import { useProblem } from '../contexts/ProblemContext';
import { useEvent } from '../contexts/EventContext';
import { useAuth } from '../contexts/AuthContext';

// Function to generate initials from name
const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
};

function AdminPanel() {
  const { problems, createProblem, updateProblem, deleteProblem, categories } = useProblem();
  const { events, createEvent, updateEvent, deleteEvent } = useEvent();
  const { users, createUser, updateUser, deleteUser } = useAuth();
  const [activeTab, setActiveTab] = useState('leaderboard');
  const [showCreateProblem, setShowCreateProblem] = useState(false);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [editingProblem, setEditingProblem] = useState<string | null>(null);
  const [editingEvent, setEditingEvent] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<string | null>(null);

  const [newProblem, setNewProblem] = useState({
    title: '',
    difficulty: 'Easy' as const,
    category: '',
    description: '',
    template: 'function solution() {\n    // Your code here\n}',
    examples: [{ input: '', output: '', explanation: '' }],
    constraints: [''],
    testCases: [{ input: '', expectedOutput: '' }],
    points: 10
  });

  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    problems: [{ problemId: '', points: 10 }],
    completionBonus: 50,
    registrationEndTime: '',
    startTime: '',
    endTime: ''
  });

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'user' as const,
    avatar: ''
  });

  // Edit states
  const [editProblemData, setEditProblemData] = useState<any>(null);
  const [editEventData, setEditEventData] = useState<any>(null);
  const [editUserData, setEditUserData] = useState<any>(null);

  const handleCreateProblem = (e: React.FormEvent) => {
    e.preventDefault();
    createProblem(newProblem);
    setNewProblem({
      title: '',
      difficulty: 'Easy',
      category: '',
      description: '',
      template: 'function solution() {\n    // Your code here\n}',
      examples: [{ input: '', output: '', explanation: '' }],
      constraints: [''],
      testCases: [{ input: '', expectedOutput: '' }],
      points: 10
    });
    setShowCreateProblem(false);
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEvent.problems.some(p => !p.problemId)) {
      alert("Please select a problem for each entry.");
      return;
    }
    createEvent({
      ...newEvent,
      registrationEndTime: new Date(newEvent.registrationEndTime),
      startTime: new Date(newEvent.startTime),
      endTime: new Date(newEvent.endTime),
    });
    setNewEvent({
      title: '',
      description: '',
      problems: [{ problemId: '', points: 10 }],
      completionBonus: 50,
      registrationEndTime: '',
      startTime: '',
      endTime: ''
    });
    setShowCreateEvent(false);
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    createUser(newUser);
    setNewUser({
      name: '',
      email: '',
      role: 'user',
      avatar: ''
    });
    setShowCreateUser(false);
  };

  // Edit handlers
  const handleEditProblem = (problem: any) => {
    setEditProblemData({
      ...problem,
      examples: problem.examples || [{ input: '', output: '', explanation: '' }],
      constraints: problem.constraints || [''],
      testCases: problem.testCases || [{ input: '', expectedOutput: '' }]
    });
    setEditingProblem(problem.id);
  };

  const handleSaveProblem = (e: React.FormEvent) => {
    e.preventDefault();
    if (editProblemData) {
      updateProblem(editingProblem!, editProblemData);
      setEditingProblem(null);
      setEditProblemData(null);
    }
  };

  const handleEditEvent = (event: any) => {
    setEditEventData({
      ...event,
      registrationEndTime: new Date(event.registrationEndTime).toISOString().slice(0, 16),
      startTime: new Date(event.startTime).toISOString().slice(0, 16),
      endTime: new Date(event.endTime).toISOString().slice(0, 16),
      problems: event.problems || [{ problemId: '', points: 10 }]
    });
    setEditingEvent(event.id);
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (editEventData) {
      updateEvent(editingEvent!, {
        ...editEventData,
        registrationEndTime: new Date(editEventData.registrationEndTime),
        startTime: new Date(editEventData.startTime),
        endTime: new Date(editEventData.endTime),
      });
      setEditingEvent(null);
      setEditEventData(null);
    }
  };

  const handleEditUser = (user: any) => {
    setEditUserData({ ...user });
    setEditingUser(user.id);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (editUserData) {
      updateUser(editingUser!, editUserData);
      setEditingUser(null);
      setEditUserData(null);
    }
  };

  const addExample = (isEdit = false) => {
    if (isEdit && editProblemData) {
      setEditProblemData({
        ...editProblemData,
        examples: [...editProblemData.examples, { input: '', output: '', explanation: '' }]
      });
    } else {
      setNewProblem({
        ...newProblem,
        examples: [...newProblem.examples, { input: '', output: '', explanation: '' }]
      });
    }
  };

  const addConstraint = (isEdit = false) => {
    if (isEdit && editProblemData) {
      setEditProblemData({
        ...editProblemData,
        constraints: [...editProblemData.constraints, '']
      });
    } else {
      setNewProblem({
        ...newProblem,
        constraints: [...newProblem.constraints, '']
      });
    }
  };

  const addTestCase = (isEdit = false) => {
    if (isEdit && editProblemData) {
      setEditProblemData({
        ...editProblemData,
        testCases: [...editProblemData.testCases, { input: '', expectedOutput: '' }]
      });
    } else {
      setNewProblem({
        ...newProblem,
        testCases: [...newProblem.testCases, { input: '', expectedOutput: '' }]
      });
    }
  };

  const handleAddProblemToEvent = (isEdit = false) => {
    if (isEdit && editEventData) {
      setEditEventData(prev => ({
        ...prev,
        problems: [...prev.problems, { problemId: '', points: 10 }]
      }));
    } else {
      setNewEvent(prev => ({
        ...prev,
        problems: [...prev.problems, { problemId: '', points: 10 }]
      }));
    }
  };

  const handleRemoveProblemFromEvent = (index: number, isEdit = false) => {
    if (isEdit && editEventData) {
      setEditEventData(prev => ({
        ...prev,
        problems: prev.problems.filter((_, i) => i !== index)
      }));
    } else {
      setNewEvent(prev => ({
        ...prev,
        problems: prev.problems.filter((_, i) => i !== index)
      }));
    }
  };

  const handleEventProblemChange = (index: number, field: 'problemId' | 'points', value: string, isEdit = false) => {
    if (isEdit && editEventData) {
      const updatedProblems = [...editEventData.problems];
      if (field === 'points') {
        updatedProblems[index][field] = parseInt(value) || 0;
      } else {
        updatedProblems[index][field] = value;
      }
      setEditEventData(prev => ({ ...prev, problems: updatedProblems }));
    } else {
      const updatedProblems = [...newEvent.problems];
      if (field === 'points') {
        updatedProblems[index][field] = parseInt(value) || 0;
      } else {
        updatedProblems[index][field] = value;
      }
      setNewEvent(prev => ({ ...prev, problems: updatedProblems }));
    }
  };

  const tabs = [
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'problems', label: 'Problems', icon: Code },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  function LeaderboardTab() {
    // Sort users by points in descending order
    const sortedUsers = [...users]
      .sort((a, b) => b.points - a.points)
      .map((user, index) => ({ ...user, rank: index + 1 }));

    const getRankIcon = (rank: number) => {
      switch (rank) {
        case 1: return <Trophy className="h-6 w-6 text-yellow-400" />;
        case 2: return <span className="text-lg font-bold text-gray-400">2</span>;
        case 3: return <span className="text-lg font-bold text-orange-500">3</span>;
        default: return <span className="text-lg font-bold text-gray-600 dark:text-gray-400">#{rank}</span>;
      }
    };

    return (
      <div>
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Global Leaderboard</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Overall user rankings based on points earned</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Rankings ({sortedUsers.length} users)</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rank</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Points</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Problems Solved</th>
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
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-bold text-orange-600 dark:text-orange-400">{user.points.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900 dark:text-white">{user.problemsSolved}</span>
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Manage problems, events, users, and system settings</p>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Leaderboard Tab */}
          {activeTab === 'leaderboard' && <LeaderboardTab />}

          {/* Problems Tab */}
          {activeTab === 'problems' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Manage Problems</h2>
                <button
                  onClick={() => setShowCreateProblem(true)}
                  className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create Problem</span>
                </button>
              </div>

              {showCreateProblem && (
                <div className="mb-6 p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Create New Problem</h3>
                  <form onSubmit={handleCreateProblem} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                        <input
                          type="text"
                          value={newProblem.title}
                          onChange={(e) => setNewProblem({...newProblem, title: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                        <input
                          type="text"
                          value={newProblem.category}
                          onChange={(e) => setNewProblem({...newProblem, category: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Difficulty</label>
                        <select
                          value={newProblem.difficulty}
                          onChange={(e) => setNewProblem({...newProblem, difficulty: e.target.value as 'Easy' | 'Medium' | 'Hard'})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                        >
                          <option value="Easy">Easy</option>
                          <option value="Medium">Medium</option>
                          <option value="Hard">Hard</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Points</label>
                        <input
                          type="number"
                          value={newProblem.points}
                          onChange={(e) => setNewProblem({...newProblem, points: parseInt(e.target.value)})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                          min="1"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                      <textarea
                        value={newProblem.description}
                        onChange={(e) => setNewProblem({...newProblem, description: e.target.value})}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Code Template</label>
                      <textarea
                        value={newProblem.template}
                        onChange={(e) => setNewProblem({...newProblem, template: e.target.value})}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 font-mono dark:bg-gray-700 dark:text-white"
                        required
                      />
                    </div>

                    {/* Examples */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Examples</label>
                        <button
                          type="button"
                          onClick={() => addExample(false)}
                          className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 text-sm"
                        >
                          + Add Example
                        </button>
                      </div>
                      {newProblem.examples.map((example, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
                          <input
                            type="text"
                            placeholder="Input"
                            value={example.input}
                            onChange={(e) => {
                              const examples = [...newProblem.examples];
                              examples[index].input = e.target.value;
                              setNewProblem({...newProblem, examples});
                            }}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                          />
                          <input
                            type="text"
                            placeholder="Output"
                            value={example.output}
                            onChange={(e) => {
                              const examples = [...newProblem.examples];
                              examples[index].output = e.target.value;
                              setNewProblem({...newProblem, examples});
                            }}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                          />
                          <input
                            type="text"
                            placeholder="Explanation (optional)"
                            value={example.explanation}
                            onChange={(e) => {
                              const examples = [...newProblem.examples];
                              examples[index].explanation = e.target.value;
                              setNewProblem({...newProblem, examples});
                            }}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                      ))}
                    </div>

                    {/* Test Cases */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Test Cases</label>
                        <button
                          type="button"
                          onClick={() => addTestCase(false)}
                          className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 text-sm"
                        >
                          + Add Test Case
                        </button>
                      </div>
                      {newProblem.testCases.map((testCase, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                          <input
                            type="text"
                            placeholder="Input"
                            value={testCase.input}
                            onChange={(e) => {
                              const testCases = [...newProblem.testCases];
                              testCases[index].input = e.target.value;
                              setNewProblem({...newProblem, testCases});
                            }}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                          />
                          <input
                            type="text"
                            placeholder="Expected Output"
                            value={testCase.expectedOutput}
                            onChange={(e) => {
                              const testCases = [...newProblem.testCases];
                              testCases[index].expectedOutput = e.target.value;
                              setNewProblem({...newProblem, testCases});
                            }}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex space-x-3">
                      <button
                        type="submit"
                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md transition-colors"
                      >
                        Create Problem
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowCreateProblem(false)}
                        className="bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-md transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Edit Problem Form */}
              {editingProblem && editProblemData && (
                <div className="mb-6 p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Edit Problem</h3>
                  <form onSubmit={handleSaveProblem} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                        <input
                          type="text"
                          value={editProblemData.title}
                          onChange={(e) => setEditProblemData({...editProblemData, title: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                        <input
                          type="text"
                          value={editProblemData.category}
                          onChange={(e) => setEditProblemData({...editProblemData, category: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Difficulty</label>
                        <select
                          value={editProblemData.difficulty}
                          onChange={(e) => setEditProblemData({...editProblemData, difficulty: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                        >
                          <option value="Easy">Easy</option>
                          <option value="Medium">Medium</option>
                          <option value="Hard">Hard</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Points</label>
                        <input
                          type="number"
                          value={editProblemData.points}
                          onChange={(e) => setEditProblemData({...editProblemData, points: parseInt(e.target.value)})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                          min="1"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                      <textarea
                        value={editProblemData.description}
                        onChange={(e) => setEditProblemData({...editProblemData, description: e.target.value})}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Code Template</label>
                      <textarea
                        value={editProblemData.template}
                        onChange={(e) => setEditProblemData({...editProblemData, template: e.target.value})}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 font-mono dark:bg-gray-700 dark:text-white"
                        required
                      />
                    </div>

                    {/* Examples */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Examples</label>
                        <button
                          type="button"
                          onClick={() => addExample(true)}
                          className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 text-sm"
                        >
                          + Add Example
                        </button>
                      </div>
                      {editProblemData.examples.map((example: any, index: number) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
                          <input
                            type="text"
                            placeholder="Input"
                            value={example.input}
                            onChange={(e) => {
                              const examples = [...editProblemData.examples];
                              examples[index].input = e.target.value;
                              setEditProblemData({...editProblemData, examples});
                            }}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                          />
                          <input
                            type="text"
                            placeholder="Output"
                            value={example.output}
                            onChange={(e) => {
                              const examples = [...editProblemData.examples];
                              examples[index].output = e.target.value;
                              setEditProblemData({...editProblemData, examples});
                            }}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                          />
                          <input
                            type="text"
                            placeholder="Explanation (optional)"
                            value={example.explanation || ''}
                            onChange={(e) => {
                              const examples = [...editProblemData.examples];
                              examples[index].explanation = e.target.value;
                              setEditProblemData({...editProblemData, examples});
                            }}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                      ))}
                    </div>

                    {/* Test Cases */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Test Cases</label>
                        <button
                          type="button"
                          onClick={() => addTestCase(true)}
                          className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 text-sm"
                        >
                          + Add Test Case
                        </button>
                      </div>
                      {editProblemData.testCases.map((testCase: any, index: number) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                          <input
                            type="text"
                            placeholder="Input"
                            value={testCase.input}
                            onChange={(e) => {
                              const testCases = [...editProblemData.testCases];
                              testCases[index].input = e.target.value;
                              setEditProblemData({...editProblemData, testCases});
                            }}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                          />
                          <input
                            type="text"
                            placeholder="Expected Output"
                            value={testCase.expectedOutput}
                            onChange={(e) => {
                              const testCases = [...editProblemData.testCases];
                              testCases[index].expectedOutput = e.target.value;
                              setEditProblemData({...editProblemData, testCases});
                            }}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex space-x-3">
                      <button
                        type="submit"
                        className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors"
                      >
                        <Save className="h-4 w-4" />
                        <span>Save Changes</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingProblem(null);
                          setEditProblemData(null);
                        }}
                        className="flex items-center space-x-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-md transition-colors"
                      >
                        <X className="h-4 w-4" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="space-y-4">
                {problems.map((problem) => (
                  <div key={problem.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{problem.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{problem.category} • {problem.difficulty} • {problem.points} points</p>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleEditProblem(problem)}
                        className="p-2 text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => deleteProblem(problem.id)}
                        className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Events Tab */}
          {activeTab === 'events' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Manage Events</h2>
                <button
                  onClick={() => setShowCreateEvent(true)}
                  className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create Event</span>
                </button>
              </div>

              {showCreateEvent && (
                <div className="mb-6 p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Create New Event</h3>
                  <form onSubmit={handleCreateEvent} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                      <input
                        type="text"
                        value={newEvent.title}
                        onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                      <textarea
                        value={newEvent.description}
                        onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                        required
                      />
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Problems</label>
                        <button type="button" onClick={() => handleAddProblemToEvent(false)} className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 text-sm">
                          + Add Problem
                        </button>
                      </div>
                      <div className="space-y-3">
                        {newEvent.problems.map((p, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <select
                              value={p.problemId}
                              onChange={(e) => handleEventProblemChange(index, 'problemId', e.target.value, false)}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                              required
                            >
                              <option value="">Select a problem</option>
                              {problems.map((problem) => (
                                <option key={problem.id} value={problem.id}>{problem.title}</option>
                              ))}
                            </select>
                            <input
                              type="number"
                              placeholder="Points"
                              value={p.points}
                              onChange={(e) => handleEventProblemChange(index, 'points', e.target.value, false)}
                              className="w-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                              required
                            />
                            <button type="button" onClick={() => handleRemoveProblemFromEvent(index, false)} className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Completion Bonus</label>
                      <input
                        type="number"
                        value={newEvent.completionBonus}
                        onChange={(e) => setNewEvent({...newEvent, completionBonus: parseInt(e.target.value) || 0})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Registration End</label>
                        <input
                          type="datetime-local"
                          value={newEvent.registrationEndTime}
                          onChange={(e) => setNewEvent({...newEvent, registrationEndTime: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Time</label>
                        <input
                          type="datetime-local"
                          value={newEvent.startTime}
                          onChange={(e) => setNewEvent({...newEvent, startTime: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Time</label>
                        <input
                          type="datetime-local"
                          value={newEvent.endTime}
                          onChange={(e) => setNewEvent({...newEvent, endTime: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="flex space-x-3">
                      <button
                        type="submit"
                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md transition-colors"
                      >
                        Create Event
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowCreateEvent(false)}
                        className="bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-md transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Edit Event Form */}
              {editingEvent && editEventData && (
                <div className="mb-6 p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Edit Event</h3>
                  <form onSubmit={handleSaveEvent} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                      <input
                        type="text"
                        value={editEventData.title}
                        onChange={(e) => setEditEventData({...editEventData, title: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                      <textarea
                        value={editEventData.description}
                        onChange={(e) => setEditEventData({...editEventData, description: e.target.value})}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                        required
                      />
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Problems</label>
                        <button type="button" onClick={() => handleAddProblemToEvent(true)} className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 text-sm">
                          + Add Problem
                        </button>
                      </div>
                      <div className="space-y-3">
                        {editEventData.problems.map((p: any, index: number) => (
                          <div key={index} className="flex items-center space-x-2">
                            <select
                              value={p.problemId}
                              onChange={(e) => handleEventProblemChange(index, 'problemId', e.target.value, true)}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                              required
                            >
                              <option value="">Select a problem</option>
                              {problems.map((problem) => (
                                <option key={problem.id} value={problem.id}>{problem.title}</option>
                              ))}
                            </select>
                            <input
                              type="number"
                              placeholder="Points"
                              value={p.points}
                              onChange={(e) => handleEventProblemChange(index, 'points', e.target.value, true)}
                              className="w-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                              required
                            />
                            <button type="button" onClick={() => handleRemoveProblemFromEvent(index, true)} className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Completion Bonus</label>
                      <input
                        type="number"
                        value={editEventData.completionBonus}
                        onChange={(e) => setEditEventData({...editEventData, completionBonus: parseInt(e.target.value) || 0})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Registration End</label>
                        <input
                          type="datetime-local"
                          value={editEventData.registrationEndTime}
                          onChange={(e) => setEditEventData({...editEventData, registrationEndTime: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Time</label>
                        <input
                          type="datetime-local"
                          value={editEventData.startTime}
                          onChange={(e) => setEditEventData({...editEventData, startTime: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Time</label>
                        <input
                          type="datetime-local"
                          value={editEventData.endTime}
                          onChange={(e) => setEditEventData({...editEventData, endTime: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="flex space-x-3">
                      <button
                        type="submit"
                        className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors"
                      >
                        <Save className="h-4 w-4" />
                        <span>Save Changes</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingEvent(null);
                          setEditEventData(null);
                        }}
                        className="flex items-center space-x-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-md transition-colors"
                      >
                        <X className="h-4 w-4" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="space-y-4">
                {events.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{event.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{event.description}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                        {event.startTime.toLocaleString()} • {event.registeredUsers.length} registered • {event.problems.length} problems
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        event.status === 'registration' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300' :
                        event.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                        {event.status}
                      </span>
                      <button 
                        onClick={() => handleEditEvent(event)}
                        className="p-2 text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => deleteEvent(event.id)}
                        className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Manage Users</h2>
                <button
                  onClick={() => setShowCreateUser(true)}
                  className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create User</span>
                </button>
              </div>

              {showCreateUser && (
                <div className="mb-6 p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Create New User</h3>
                  <form onSubmit={handleCreateUser} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                        <input
                          type="text"
                          value={newUser.name}
                          onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                        <input
                          type="email"
                          value={newUser.email}
                          onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
                      <select
                        value={newUser.role}
                        onChange={(e) => setNewUser({...newUser, role: e.target.value as 'user' | 'admin'})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Avatar URL</label>
                      <input
                        type="url"
                        value={newUser.avatar || ''}
                        onChange={(e) => setNewUser({...newUser, avatar: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    
                    <div className="flex space-x-3">
                      <button
                        type="submit"
                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md transition-colors"
                      >
                        Create User
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowCreateUser(false)}
                        className="bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-md transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Edit User Form */}
              {editingUser && editUserData && (
                <div className="mb-6 p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Edit User</h3>
                  <form onSubmit={handleSaveUser} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                        <input
                          type="text"
                          value={editUserData.name}
                          onChange={(e) => setEditUserData({...editUserData, name: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                        <input
                          type="email"
                          value={editUserData.email}
                          onChange={(e) => setEditUserData({...editUserData, email: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
                        <select
                          value={editUserData.role}
                          onChange={(e) => setEditUserData({...editUserData, role: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Points</label>
                        <input
                          type="number"
                          value={editUserData.points}
                          onChange={(e) => setEditUserData({...editUserData, points: parseInt(e.target.value) || 0})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Avatar URL</label>
                      <input
                        type="url"
                        value={editUserData.avatar || ''}
                        onChange={(e) => setEditUserData({...editUserData, avatar: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    
                    <div className="flex space-x-3">
                      <button
                        type="submit"
                        className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors"
                      >
                        <Save className="h-4 w-4" />
                        <span>Save Changes</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingUser(null);
                          setEditUserData(null);
                        }}
                        className="flex items-center space-x-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-md transition-colors"
                      >
                        <X className="h-4 w-4" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      {user.avatar ? (
                        <img 
                          src={user.avatar} 
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center">
                          <span className="text-white font-bold">
                            {getInitials(user.name)}
                          </span>
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{user.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-500">{user.points} points • {user.problemsSolved} problems solved</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                        {user.role}
                      </span>
                      <button 
                        onClick={() => handleEditUser(user)}
                        className="p-2 text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => deleteUser(user.id)}
                        className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">System Settings</h2>
              <div className="space-y-6">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Platform Statistics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{problems.length}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Total Problems</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{events.length}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Total Events</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{users.length}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Total Users</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{categories.length}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Categories</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Data Management</h3>
                  <div className="space-y-4">
                    <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors">
                      Clear All Data
                    </button>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      This will permanently delete all problems, events, and user data. This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;