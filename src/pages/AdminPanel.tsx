import React, { useState } from 'react';
import { Plus, Edit, Trash2, Calendar, Code, Users, Settings, Save, X } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState('events');
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
    avatar: null
  });

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
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1'
    });
    setShowCreateUser(false);
  };

  const addExample = () => {
    setNewProblem({
      ...newProblem,
      examples: [...newProblem.examples, { input: '', output: '', explanation: '' }]
    });
  };

  const addConstraint = () => {
    setNewProblem({
      ...newProblem,
      constraints: [...newProblem.constraints, '']
    });
  };

  const addTestCase = () => {
    setNewProblem({
      ...newProblem,
      testCases: [...newProblem.testCases, { input: '', expectedOutput: '' }]
    });
  };

  const handleAddProblemToEvent = () => {
    setNewEvent(prev => ({
      ...prev,
      problems: [...prev.problems, { problemId: '', points: 10 }]
    }));
  };

  const handleRemoveProblemFromEvent = (index: number) => {
    setNewEvent(prev => ({
      ...prev,
      problems: prev.problems.filter((_, i) => i !== index)
    }));
  };

  const handleEventProblemChange = (index: number, field: 'problemId' | 'points', value: string) => {
    const updatedProblems = [...newEvent.problems];
    if (field === 'points') {
      updatedProblems[index][field] = parseInt(value) || 0;
    } else {
      updatedProblems[index][field] = value;
    }
    setNewEvent(prev => ({ ...prev, problems: updatedProblems }));
  };

  const tabs = [
    { id: 'problems', label: 'Problems', icon: Code },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
        <p className="text-gray-600 mt-2">Manage problems, events, users, and system settings</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
          {/* Problems Tab */}
          {activeTab === 'problems' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Manage Problems</h2>
                <button
                  onClick={() => setShowCreateProblem(true)}
                  className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create Problem</span>
                </button>
              </div>

              {showCreateProblem && (
                <div className="mb-6 p-6 bg-gray-50 rounded-lg border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Problem</h3>
                  <form onSubmit={handleCreateProblem} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                          type="text"
                          value={newProblem.title}
                          onChange={(e) => setNewProblem({...newProblem, title: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <input
                          type="text"
                          value={newProblem.category}
                          onChange={(e) => setNewProblem({...newProblem, category: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                        <select
                          value={newProblem.difficulty}
                          onChange={(e) => setNewProblem({...newProblem, difficulty: e.target.value as 'Easy' | 'Medium' | 'Hard'})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                        >
                          <option value="Easy">Easy</option>
                          <option value="Medium">Medium</option>
                          <option value="Hard">Hard</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Points</label>
                        <input
                          type="number"
                          value={newProblem.points}
                          onChange={(e) => setNewProblem({...newProblem, points: parseInt(e.target.value)})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                          min="1"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        value={newProblem.description}
                        onChange={(e) => setNewProblem({...newProblem, description: e.target.value})}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Code Template</label>
                      <textarea
                        value={newProblem.template}
                        onChange={(e) => setNewProblem({...newProblem, template: e.target.value})}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 font-mono"
                        required
                      />
                    </div>

                    {/* Examples */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700">Examples</label>
                        <button
                          type="button"
                          onClick={addExample}
                          className="text-orange-600 hover:text-orange-700 text-sm"
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
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
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
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
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
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                          />
                        </div>
                      ))}
                    </div>

                    {/* Test Cases */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700">Test Cases</label>
                        <button
                          type="button"
                          onClick={addTestCase}
                          className="text-orange-600 hover:text-orange-700 text-sm"
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
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
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
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
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
                        className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="space-y-4">
                {problems.map((problem) => (
                  <div key={problem.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{problem.title}</h3>
                      <p className="text-sm text-gray-600">{problem.category} • {problem.difficulty} • {problem.points} points</p>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => setEditingProblem(problem.id)}
                        className="p-2 text-gray-600 hover:text-orange-600"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => deleteProblem(problem.id)}
                        className="p-2 text-gray-600 hover:text-red-600"
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
                <h2 className="text-xl font-semibold text-gray-900">Manage Events</h2>
                <button
                  onClick={() => setShowCreateEvent(true)}
                  className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create Event</span>
                </button>
              </div>

              {showCreateEvent && (
                <div className="mb-6 p-6 bg-gray-50 rounded-lg border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Event</h3>
                  <form onSubmit={handleCreateEvent} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input
                        type="text"
                        value={newEvent.title}
                        onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        value={newEvent.description}
                        onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700">Problems</label>
                        <button type="button" onClick={handleAddProblemToEvent} className="text-orange-600 hover:text-orange-700 text-sm">
                          + Add Problem
                        </button>
                      </div>
                      <div className="space-y-3">
                        {newEvent.problems.map((p, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <select
                              value={p.problemId}
                              onChange={(e) => handleEventProblemChange(index, 'problemId', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
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
                              onChange={(e) => handleEventProblemChange(index, 'points', e.target.value)}
                              className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                              required
                            />
                            <button type="button" onClick={() => handleRemoveProblemFromEvent(index)} className="p-2 text-gray-500 hover:text-red-600">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Completion Bonus</label>
                      <input
                        type="number"
                        value={newEvent.completionBonus}
                        onChange={(e) => setNewEvent({...newEvent, completionBonus: parseInt(e.target.value) || 0})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Registration End</label>
                        <input
                          type="datetime-local"
                          value={newEvent.registrationEndTime}
                          onChange={(e) => setNewEvent({...newEvent, registrationEndTime: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                        <input
                          type="datetime-local"
                          value={newEvent.startTime}
                          onChange={(e) => setNewEvent({...newEvent, startTime: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                        <input
                          type="datetime-local"
                          value={newEvent.endTime}
                          onChange={(e) => setNewEvent({...newEvent, endTime: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
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
                        className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="space-y-4">
                {events.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{event.title}</h3>
                      <p className="text-sm text-gray-600">{event.description}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {event.startTime.toLocaleString()} • {event.registeredUsers.length} registered • {event.problems.length} problems
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        event.status === 'registration' ? 'bg-blue-100 text-blue-800' :
                        event.status === 'active' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {event.status}
                      </span>
                      <button 
                        onClick={() => setEditingEvent(event.id)}
                        className="p-2 text-gray-600 hover:text-orange-600"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => deleteEvent(event.id)}
                        className="p-2 text-gray-600 hover:text-red-600"
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
                <h2 className="text-xl font-semibold text-gray-900">Manage Users</h2>
                <button
                  onClick={() => setShowCreateUser(true)}
                  className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create User</span>
                </button>
              </div>

              {showCreateUser && (
                <div className="mb-6 p-6 bg-gray-50 rounded-lg border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New User</h3>
                  <form onSubmit={handleCreateUser} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input
                          type="text"
                          value={newUser.name}
                          onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                          type="email"
                          value={newUser.email}
                          onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                      <select
                        value={newUser.role}
                        onChange={(e) => setNewUser({...newUser, role: e.target.value as 'user' | 'admin'})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Avatar URL</label>
                      <input
                        type="url"
                        value={newUser.avatar || ''}
                        onChange={(e) => setNewUser({...newUser, avatar: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
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
                        className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
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
                        <h3 className="font-semibold text-gray-900">{user.name}</h3>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <p className="text-sm text-gray-500">{user.points} points • {user.problemsSolved} problems solved</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role}
                      </span>
                      <button 
                        onClick={() => setEditingUser(user.id)}
                        className="p-2 text-gray-600 hover:text-orange-600"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => deleteUser(user.id)}
                        className="p-2 text-gray-600 hover:text-red-600"
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
              <h2 className="text-xl font-semibold text-gray-900 mb-6">System Settings</h2>
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Platform Statistics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{problems.length}</div>
                      <div className="text-sm text-gray-600">Total Problems</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{events.length}</div>
                      <div className="text-sm text-gray-600">Total Events</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{users.length}</div>
                      <div className="text-sm text-gray-600">Total Users</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{categories.length}</div>
                      <div className="text-sm text-gray-600">Categories</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Data Management</h3>
                  <div className="space-y-4">
                    <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors">
                      Clear All Data
                    </button>
                    <p className="text-sm text-gray-600">
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
