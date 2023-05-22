import { ObjectId } from 'mongodb';
import { eventProvider } from '../indexes/providers.index';
import { Event } from '../schema/types/schema';

const eventResolver = {
  Query: {
    getEvent: async (eventId: ObjectId): Promise<Event | null> => {
      return eventProvider.getEventById(eventId);
    },

    getAllEvents: async (): Promise<Event[]> => {
      return eventProvider.getAllEvents();
    },
  },
};

export { eventResolver };
