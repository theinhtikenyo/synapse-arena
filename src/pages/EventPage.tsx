import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useEvent } from '../contexts/EventContext';
import EventCard from '../components/EventCard';

function EventPage() {
  const { user } = useAuth();
  const { events, registerForEvent } = useEvent();

  const handleRegister = (eventId: string) => {
    if (user) {
      registerForEvent(eventId, user.id);
    }
  };

  const upcomingEvents = events.filter(e => e.status === 'registration' || e.status === 'active');
  const completedEvents = events.filter(e => e.status === 'completed');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Coding Events</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Join live coding competitions and compete with other developers</p>
      </div>

      {/* Upcoming Events */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Upcoming Events</h2>
        {upcomingEvents.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {upcomingEvents.map(event => (
              <EventCard
                key={event.id}
                event={event}
                onRegister={handleRegister}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400">No upcoming events at the moment.</p>
          </div>
        )}
      </div>

      {/* Completed Events */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Past Events</h2>
        {completedEvents.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {completedEvents.map(event => (
              <EventCard
                key={event.id}
                event={event}
                onRegister={handleRegister}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400">No completed events to display.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default EventPage;
