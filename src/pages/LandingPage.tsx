import React from 'react';
import { Link } from 'react-router-dom';
import { Code, Calendar, Trophy, Users, Clock, ArrowRight, Play } from 'lucide-react';
import { useEvent } from '../contexts/EventContext';
import { useProblem } from '../contexts/ProblemContext';
import Timer from '../components/Timer';

function LandingPage() {
  const { events } = useEvent();
  const { problems } = useProblem();

  const upcomingEvents = events.filter(e => e.status === 'registration' || e.status === 'active').slice(0, 3);
  const featuredProblems = problems.slice(0, 6);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-orange-900">
      {/* Header */}
      <header className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <Code className="h-8 w-8 text-orange-500" />
              <span className="text-xl font-bold text-white">Coding Area</span>
            </div>
            
            <Link 
              to="/login"
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md font-medium transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Competitive
            <span className="text-orange-500"> Coding</span>
            <br />
            Redefined
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Join live coding competitions, solve challenging problems, and compete with developers worldwide. 
            Experience the thrill of timed challenges and climb the leaderboard.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/login"
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-md font-semibold text-lg transition-colors flex items-center justify-center space-x-2"
            >
              <Play className="h-5 w-5" />
              <span>Start Competing</span>
            </Link>
            <button className="border border-gray-400 text-gray-300 hover:text-white hover:border-white px-8 py-3 rounded-md font-semibold text-lg transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-black bg-opacity-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-orange-500">{problems.length}</div>
              <div className="text-gray-300">Problems</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-500">{events.length}</div>
              <div className="text-gray-300">Events</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-500">24/7</div>
              <div className="text-gray-300">Available</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-500">Real-time</div>
              <div className="text-gray-300">Scoring</div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Upcoming Events</h2>
              <p className="text-gray-300">Join live coding competitions and compete with others</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-orange-500 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-2">{event.title}</h3>
                      <p className="text-gray-400 mb-3">{event.description}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      event.status === 'registration' ? 'bg-blue-900 text-blue-300' : 'bg-green-900 text-green-300'
                    }`}>
                      {event.status === 'registration' ? 'Open' : 'Live'}
                    </span>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {event.status === 'registration' ? 'Registration ends: ' : 'Event ends: '}
                      </span>
                    </div>
                    
                    <Timer 
                      targetTime={event.status === 'registration' ? event.registrationEndTime : event.endTime}
                      className="text-lg"
                    />
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{event.registeredUsers.length} registered</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Trophy className="h-4 w-4" />
                        <span>{Object.keys(event.submissions).length} submissions</span>
                      </div>
                    </div>
                  </div>

                  <Link
                    to="/login"
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md font-medium transition-colors flex items-center justify-center space-x-2"
                  >
                    <span>Join Event</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Practice Problems */}
      {featuredProblems.length > 0 && (
        <section className="py-16 bg-black bg-opacity-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Practice Problems</h2>
              <p className="text-gray-300">Sharpen your skills with our curated problem set</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProblems.map((problem) => (
                <div key={problem.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-orange-500 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-white group-hover:text-orange-400 transition-colors">
                      {problem.title}
                    </h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      problem.difficulty === 'Easy' ? 'bg-green-900 text-green-300' :
                      problem.difficulty === 'Medium' ? 'bg-yellow-900 text-yellow-300' :
                      'bg-red-900 text-red-300'
                    }`}>
                      {problem.difficulty}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                    {problem.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-300">
                      {problem.category}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="text-orange-500 font-bold">{problem.points} pts</span>
                      <Link
                        to="/login"
                        className="text-sm text-orange-400 hover:text-orange-300 font-medium flex items-center space-x-1"
                      >
                        <span>Solve</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <Link
                to="/login"
                className="inline-flex items-center space-x-2 text-orange-400 hover:text-orange-300 font-medium"
              >
                <span>View all problems</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Why Choose Coding Area?</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-orange-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Real-time Competition</h3>
              <p className="text-gray-400">Experience the thrill of live coding competitions with real-time scoring and leaderboards.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-orange-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Code className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">JavaScript Runtime</h3>
              <p className="text-gray-400">Test your solutions with real JavaScript execution and comprehensive test cases.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-orange-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Competitive Scoring</h3>
              <p className="text-gray-400">Earn points based on correctness and speed. Faster solutions get higher scores.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-orange-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Competing?</h2>
          <p className="text-xl text-orange-100 mb-8">Join thousands of developers improving their skills through competition.</p>
          <Link 
            to="/login"
            className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-3 rounded-md font-semibold text-lg transition-colors inline-flex items-center space-x-2"
          >
            <span>Get Started Now</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
