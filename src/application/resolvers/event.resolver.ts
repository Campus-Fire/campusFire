import { ObjectId } from 'mongodb';

import checkAuth from '../../helpers/check-auth';
import { eventProvider, profileProvider, accountProvider } from '../indexes/providers.index';
import {
  MutationCreateEventArgs,
  Event,
  MutationUpdateEventDetailsArgs,
  MutationUpdateVerificationArgs,
  MutationUpdateAttendanceArgs,
  MutationDeleteEventArgs,
  QueryGetEventArgs,
} from '../schema/types/schema';
import { Root, UserContext } from '../schema/types/types';

const eventResolver = {
  Query: {
    getEvent: async (_: Root, args: QueryGetEventArgs): Promise<Event | null> => {
      return eventProvider.getEventById(new ObjectId(args.eventId));
    },

    getAllEvents: async (_: Root, __: any, context: UserContext): Promise<Event[]> => {
      const session = checkAuth(context);
      const { id } = session.user;

      return eventProvider.getAllEvents(new ObjectId(id));
    },

    getCategories: (): string[] => {
      return eventProvider.getCategories();
    },

    getPersonalEvents: async (_: Root, participantId: String, context: UserContext): Promise<Event[]> => {
      const session = checkAuth(context);
      const { id } = session.user;

      const events = await eventProvider.getAllPersonalEvents(new ObjectId(id));

      // add email to each event
      // TODO: Separate logic into another query; this is messy
      const eventsWithOwnerEmail = await Promise.all(
        events.map(async (event) => {
          const email = (await accountProvider.getAccountById(event.ownerId.toString())).email;
          return {
            ...event,
            ownerEmail: email,
          };
        })
      );

      return eventsWithOwnerEmail;
    },

    getProfilesAttendingEvent: async (_: Root, args: QueryGetEventArgs): Promise<ObjectId[]> => {
      return eventProvider.getProfilesAttendingEvent(new ObjectId(args.eventId));
    },
  },
  Mutation: {
    createEvent: async (_: Root, args: MutationCreateEventArgs, context: UserContext): Promise<ObjectId> => {
      const session = checkAuth(context);
      const { id } = session.user;
      const userProfile = await profileProvider.getProfile(id);

      const attendance = [userProfile];
      return eventProvider.createEvent(attendance, new ObjectId(id), args.input);
    },

    updateEventDetails: async (
      _: Root,
      args: MutationUpdateEventDetailsArgs,
      context: UserContext
    ): Promise<Boolean> => {
      const session = checkAuth(context);
      const { id } = session.user;

      const input = { ownerId: new ObjectId(id), ...args.input };

      return eventProvider.updateEventDetails(input);
    },

    updateVerification: async (_: Root, args: MutationUpdateVerificationArgs): Promise<Boolean> => {
      return eventProvider.updateVerification(args.input);
    },

    updateAttendance: async (_: Root, args: MutationUpdateAttendanceArgs): Promise<Boolean> => {
      const userProfile = await profileProvider.getProfile(args.input.profileId);
      const updateAttendanceInput = {
        userProfile,
        ...args.input,
      };

      return eventProvider.updateAttendance(updateAttendanceInput);
    },

    deleteEvent: async (_: Root, args: MutationDeleteEventArgs, context: UserContext): Promise<Boolean> => {
      const session = checkAuth(context);
      const { id } = session.user;

      return eventProvider.deleteEvent(new ObjectId(id), new ObjectId(args.eventId));
    },
  },
};

export { eventResolver };
