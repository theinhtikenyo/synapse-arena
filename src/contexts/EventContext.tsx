import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, Timestamp, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './AuthContext';

export interface EventProblem {
  problemId: string;
  points: number;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  registrationEndTime: Date;
  startTime: Date;
  endTime: Date;
  problems: EventProblem[];
  completionBonus: number;
  status: 'registration' | 'active' | 'completed';
  registeredUsers: string[];
  submissions: { 
    [userId: string]: { 
      [problemId: string]: { 
        code: string; 
        timestamp: Date; 
        score: number;
      } 
    } 
  };
}

interface EventContextType {
  events: Event[];
  currentEvent: Event | null;
  registerForEvent: (eventId: string, userId:string) => Promise<void>;
  submitSolution: (eventId: string, userId: string, problemId: string, code: string, score: number) => Promise<{ allProblemsSolved: boolean }>;
  createEvent: (event: Omit<Event, 'id' | 'registeredUsers' | 'submissions' | 'status'>) => Promise<void>;
  updateEvent: (id: string, event: Partial<Event>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  fetchEvents: () => Promise<void>;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export function EventProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<Event[]>([]);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const { user } = useAuth();

  const fetchEvents = async () => {
    try {
      const eventsCollection = collection(db, 'events');
      const eventsSnapshot = await getDocs(eventsCollection);
      const eventsList = eventsSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          registrationEndTime: data.registrationEndTime.toDate(),
          startTime: data.startTime.toDate(),
          endTime: data.endTime.toDate(),
          submissions: data.submissions || {},
          problems: data.problems || [],
          completionBonus: data.completionBonus || 0,
        };
      }) as Event[];
      setEvents(eventsList);
      setCurrentEvent(eventsList[0] || null);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchEvents();
    }
  }, [user]);

  useEffect(() => {
    const interval = setInterval(() => {
      setEvents(prev => prev.map(event => {
        const now = new Date();
        let newStatus = event.status;
        
        if (now > event.endTime) {
          newStatus = 'completed';
        } else if (now > event.startTime) {
          newStatus = 'active';
        } else if (now < event.registrationEndTime) {
          newStatus = 'registration';
        }
        
        return { ...event, status: newStatus };
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const registerForEvent = async (eventId: string, userId: string) => {
    try {
      const event = events.find(e => e.id === eventId);
      if (event) {
        const updatedRegisteredUsers = [...event.registeredUsers, userId];
        await updateDoc(doc(db, 'events', eventId), {
          registeredUsers: updatedRegisteredUsers
        });
        await fetchEvents();
      }
    } catch (error) {
      console.error('Error registering for event:', error);
      throw error;
    }
  };

  const submitSolution = async (eventId: string, userId: string, problemId: string, code: string, score: number): Promise<{ allProblemsSolved: boolean }> => {
    try {
      const eventRef = doc(db, 'events', eventId);
      const eventDoc = await getDoc(eventRef);
      if (!eventDoc.exists()) {
        throw new Error("Event not found");
      }

      const eventData = eventDoc.data() as Omit<Event, 'id'>;
      
      const newSubmission = { code, timestamp: new Date(), score };
      const updatedSubmissions = {
        ...eventData.submissions,
        [userId]: {
          ...(eventData.submissions[userId] || {}),
          [problemId]: newSubmission
        }
      };

      await updateDoc(eventRef, {
        submissions: updatedSubmissions
      });

      const userSubmissions = updatedSubmissions[userId];
      const allProblemsSolved = eventData.problems.every(p => userSubmissions[p.problemId]);

      await fetchEvents();
      
      return { allProblemsSolved };

    } catch (error) {
      console.error('Error submitting solution:', error);
      throw error;
    }
  };

  const createEvent = async (eventData: Omit<Event, 'id' | 'registeredUsers' | 'submissions' | 'status'>) => {
    try {
      await addDoc(collection(db, 'events'), {
        ...eventData,
        status: 'registration',
        registrationEndTime: Timestamp.fromDate(eventData.registrationEndTime),
        startTime: Timestamp.fromDate(eventData.startTime),
        endTime: Timestamp.fromDate(eventData.endTime),
        registeredUsers: [],
        submissions: {}
      });
      await fetchEvents();
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  };

  const updateEvent = async (id: string, updates: Partial<Event>) => {
    try {
      const updateData: any = { ...updates };
      
      if (updates.registrationEndTime) {
        updateData.registrationEndTime = Timestamp.fromDate(updates.registrationEndTime);
      }
      if (updates.startTime) {
        updateData.startTime = Timestamp.fromDate(updates.startTime);
      }
      if (updates.endTime) {
        updateData.endTime = Timestamp.fromDate(updates.endTime);
      }
      
      await updateDoc(doc(db, 'events', id), updateData);
      await fetchEvents();
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'events', id));
      await fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  };

  return (
    <EventContext.Provider value={{ 
      events, 
      currentEvent, 
      registerForEvent, 
      submitSolution, 
      createEvent, 
      updateEvent, 
      deleteEvent,
      fetchEvents
    }}>
      {children}
    </EventContext.Provider>
  );
}

export function useEvent() {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvent must be used within an EventProvider');
  }
  return context;
}
