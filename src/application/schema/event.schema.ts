import { gql } from 'apollo-server-express';

const typeDefs = gql`
  enum Category {
    ON_CAMPUS
    OFF_CAMPUS
    CASUAL
    FORMAL
    CLUB
    SOCIAL_NIGHT
    VOLUNTEERING
    CONFERENCE
    SPORTS
    FESTIVAL
    RECURRING
  }

  type Event {
    id: ObjectID!
    ownerId: ObjectID!
    name: String!
    startDate: Date!
    endDate: Date!
    city: String!
    province: String!
    country: String!
    description: String!
    isVerified: Boolean
    isUserUploaded: Boolean!
    meetUpLocation: String!
    isDeleted: Boolean
    attendance: [Profile!]
    cost: Float!
    category: Category!
  }

  # Todo: Add pagination, filtering, and sorting
  # by things like city, or country

  input CreateEventInput {
    name: String!
    startDate: Date!
    endDate: Date!
    city: String!
    province: String!
    country: String!
    description: String!
    isVerified: Boolean
    isUserUploaded: Boolean!
    meetUpLocation: String!
    cost: Float!
    category: Category!
  }

  input UpdateEventDetailsInput {
    eventId: ObjectID!
    name: String
    startDate: Date
    endDate: Date
    city: String
    province: String
    country: String
    description: String
    meetUpLocation: String
    cost: Float
    category: Category
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
    getAllEvents: [Event!]
    getEvent(eventId: String!): Event
    getCategories: [Category!]!
    getPersonalEvents(participantId: String!): [Event!]
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
