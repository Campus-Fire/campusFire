import { ObjectId } from 'mongodb';
import { eventProvider } from '../indexes/providers.index';
import { CreateEventInput, Event, GetAllEventsInput } from '../schema/types/schema';

const eventResolver = {
  Query: {
    getEvent: async (eventId: ObjectId): Promise<Event | null> => {
      return eventProvider.getEventById(eventId);
    },

    getAllEvents: async (input: GetAllEventsInput): Promise<Event[]> => {
      return eventProvider.getAllEvents(input.profileId);
    },
  },
  Mutation: {
    createEvent: async (input: CreateEventInput): Promise<ObjectId> => {
      return eventProvider.createEvent(input);
    },
  },
};

export { eventResolver };
