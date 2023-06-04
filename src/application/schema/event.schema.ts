import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type Event {
    id: ObjectID!
    name: String!
    date: Date!
    city: String!
    province: String!
    country: String!
    description: String!
    isVerified: Boolean
    isUserUploaded: Boolean!
    meetUpLocation: String!
    attendance: [Profile!]
  }

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

  type Query {
    getAllEvents(input: GetAllEventsInput!): [Event!]
    getEvent(eventId: String!): Event
  }

  type Mutation {
    createEvent(input: CreateEventInput!): ObjectID!
    updateEventDetails(eventId: ObjectID): Event!
    updateVerification(eventId: ObjectID): Boolean!
    updateAttendance(eventId: ObjectID): [Event!]
  }
`;

export { typeDefs };
