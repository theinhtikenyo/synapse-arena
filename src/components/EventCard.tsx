import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Event } from '../contexts/EventContext';
import { useAuth } from '../contexts/AuthContext';
import Timer from './Timer';
import { Calendar, Clock, Users, Check, ArrowRight, BarChart2 } from 'lucide-react';

interface EventCardProps {
  event: Event;
  onRegister: (eventId: string) => void;
}

function EventCard({ event, onRegister }: EventCardProps) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const isRegistered = user ? event.registeredUsers.includes(user.id) : false;

  const getStatusInfo = () => {
    switch (event.status) {
      case 'registration':
        return {
          label: 'Registration Open',
          color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
          timerLabel: 'Registration closes in:',
          timerTarget: event.registrationEndTime,
        };
      case 'active':
        return {
          label: 'Active',
          color: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
          timerLabel: 'Event ends in:',
          timerTarget: event.endTime,
        };
      case 'completed':
        return {
          label: 'Completed',
          color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
          timerLabel: 'Event ended on:',
          timerTarget: event.endTime,
        };
    }
  };

  const statusInfo = getStatusInfo();

  const handleJoin = () => {
    navigate(`/events/${event.id}/problems`);
  };

  const renderActionButton = () => {
    switch (event.status) {
      case 'registration':
        if (isRegistered) {
          return (
            <div className="flex items-center space-x-2 text-green-600 dark:text-green-400 font-medium">
              <Check className="h-5 w-5" />
              <span>Registered</span>
            </div>
          );
        }
        return (
          <button
            onClick={() => onRegister(event.id)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md font-medium flex items-center space-x-2 transition-colors"
          >
            <span>Register Now</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        );
      case 'active':
        if (isRegistered) {
          return (
            <button
              onClick={handleJoin}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md font-medium flex items-center space-x-2 transition-colors"
            >
              <span>Join Event</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          );
        }
        return (
          <div className="text-sm text-gray-500 dark:text-gray-400">Registration closed</div>
        );
      case 'completed':
        return (
          <Link
            to={`/events/${event.id}/results`}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md font-medium flex items-center space-x-2 transition-colors"
          >
            <BarChart2 className="h-4 w-4" />
            <span>View Results</span>
          </Link>
        );
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex flex-col justify-between transition-shadow hover:shadow-md">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{event.title}</h3>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
            {statusInfo.label}
          </span>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm leading-relaxed">{event.description}</p>
        
        <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>

        <div className="space-y-3 text-sm">
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <Clock className="h-4 w-4 mr-2 text-orange-500" />
            <span>{statusInfo.timerLabel}</span>
            {event.status !== 'completed' ? (
              <Timer targetTime={statusInfo.timerTarget} className="ml-auto" showIcon={false} />
            ) : (
              <span className="ml-auto font-medium text-gray-700 dark:text-gray-300">{new Date(statusInfo.timerTarget).toLocaleDateString()}</span>
            )}
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <Calendar className="h-4 w-4 mr-2 text-orange-500" />
            <span>Event Duration:</span>
            <span className="ml-auto font-medium text-gray-700 dark:text-gray-300">
              {new Date(event.startTime).toLocaleDateString()} - {new Date(event.endTime).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <Users className="h-4 w-4 mr-2 text-orange-500" />
            <span>Participants:</span>
            <span className="ml-auto font-medium text-gray-700 dark:text-gray-300">{event.registeredUsers.length}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        {renderActionButton()}
      </div>
    </div>
  );
}

export default EventCard;
