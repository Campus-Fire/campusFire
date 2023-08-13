import { ObjectId } from 'mongodb';

import checkAuth from '../../helpers/check-auth';
import { eventProvider, profileProvider } from '../indexes/providers.index';
import { Category } from '../models/event.model';
import {
  MutationCreateEventArgs,
  Event,
  MutationUpdateEventDetailsArgs,
  MutationUpdateVerificationArgs,
  MutationUpdateAttendanceArgs,
} from '../schema/types/schema';
import { Root, UserContext } from '../schema/types/types';

const eventResolver = {
  Query: {
    getEvent: async (eventId: ObjectId): Promise<Event | null> => {
      return eventProvider.getEventById(eventId);
    },

    getAllEvents: async (context: UserContext): Promise<Event[]> => {
      const session = checkAuth(context);
      const { id } = session.user;

      return eventProvider.getAllEvents(id);
    },

    getCategories: (context: UserContext): Record<string, Category> => {
      checkAuth(context);

      return eventProvider.getCategories();
    },

    getPersonalEvents: (_: Root, participantId: String, context: UserContext): Promise<Event[]> => {
      const session = checkAuth(context);
      const { id } = session.user;

      return eventProvider.getAllPersonalEvents(id);
    },
  },
  Mutation: {
    createEvent: async (_: Root, args: MutationCreateEventArgs, context: UserContext): Promise<ObjectId> => {
      const session = checkAuth(context);
      const { id } = session.user;
      const userProfile = await profileProvider.getProfile(id);

      const input = { id, ...args.input, attendance: [userProfile], ownerId: id, isDeleted: false };

      return eventProvider.createEvent(input);
    },

    updateEventDetails: async (
      _: Root,
      args: MutationUpdateEventDetailsArgs,
      context: UserContext
    ): Promise<Boolean> => {
      const session = checkAuth(context);
      const { id } = session.user;

      const input = { ownerId: id, ...args.input };

      return eventProvider.updateEventDetails(input);
    },

    updateVerification: async (args: MutationUpdateVerificationArgs): Promise<Boolean> => {
      return eventProvider.updateVerification(args.input);
    },

    updateAttendance: async (args: MutationUpdateAttendanceArgs): Promise<Boolean> => {
      const userProfile = await profileProvider.getProfile(args.input.profileId);
      const updateAttendanceInput = {
        userProfile,
        ...args.input,
      };

      return eventProvider.updateAttendance(updateAttendanceInput);
    },

    deleteEvent: async (context: UserContext): Promise<Boolean> => {
      const session = checkAuth(context);
      const { id } = session.user;

      return eventProvider.deleteEvent(id);
    },
  },
};

export { eventResolver };
