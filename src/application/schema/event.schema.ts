import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type Event {
    id: ObjectID!
    ownerId: ObjectID!
    name: String!
    date: Date!
    city: String!
    province: String!
    country: String!
    description: String!
    isVerified: Boolean
    isUserUploaded: Boolean!
    meetUpLocation: String!
    isDeleted: Boolean
    attendance: [Profile!]
  }

  # Todo: Add pagination, filtering, and sorting
  # by things like city, or country
  input GetAllEventsInput {
    profileId: ObjectID!
  }

  input CreateEventInput {
    name: String!
    date: Date!
    city: String!
    province: String!
    country: String!
    description: String!
    isVerified: Boolean
    isUserUploaded: Boolean!
    meetUpLocation: String!
  }

  input UpdateEventDetailsInput {
    eventId: ObjectID!
    name: String
    date: Date
    city: String
    province: String
    country: String
    description: String
    meetUpLocation: String
  }

  input UpdateVerificationInput {
    eventId: ObjectID!
    isVerified: Boolean!
  }

  input UpdateAttendanceInput {
    eventId: ObjectID!
    profileId: ObjectID!
    isAttending: Boolean!
  }

  type Query {
    getAllEvents(input: GetAllEventsInput!): [Event!]
    getEvent(eventId: String!): Event
  }

  type Mutation {
    createEvent(input: CreateEventInput!): ObjectID!
    updateEventDetails(input: UpdateEventDetailsInput!): Event!
    updateVerification(input: UpdateVerificationInput!): Boolean!
    updateAttendance(input: UpdateAttendanceInput!): Event!
    deleteEvent(eventId: ObjectID): Boolean!
  }
`;

export { typeDefs };
