import { ObjectId } from 'mongodb';
import checkAuth from 'src/helpers/check-auth';
import { eventProvider, profileProvider } from '../indexes/providers.index';
import {
  MutationCreateEventArgs,
  Event,
  MutationUpdateEventDetailsArgs,
  MutationUpdateVerificationArgs,
  MutationUpdateAttendanceArgs,
  QueryGetAllEventsArgs,
} from '../schema/types/schema';
import { Root, UserContext } from '../schema/types/types';

const eventResolver = {
  Query: {
    getEvent: async (context: UserContext): Promise<Event | null> => {
      const session = checkAuth(context);
      const { id } = session.user;

      return eventProvider.getEventById(id);
    },

    getAllEvents: async (_: Root, args: QueryGetAllEventsArgs, context: UserContext): Promise<Event[]> => {
      const session = checkAuth(context);
      const { id } = session.user;

      return eventProvider.getAllEvents(id);
    },
  },
  Mutation: {
    createEvent: async (_: Root, args: MutationCreateEventArgs, context: UserContext): Promise<ObjectId> => {
      const session = checkAuth(context);
      const { id } = session.user;
      const userProfile = await profileProvider.getProfile(id);

      const input = { id, ...args.input, attendance: [userProfile], ownerId: id };

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
