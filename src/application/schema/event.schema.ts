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

  type Query {
    getAllEvents: [Event!]
    getEvent(eventId: String!): Event
  }

  type Mutation {
    updateEventDetails(eventId: ObjectID): Event!
    updateVerification(eventId: ObjectID): Boolean!
    updateAttendance(eventId: ObjectID): [Event!]
  }
`;

export { typeDefs };
