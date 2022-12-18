import { gql } from 'apollo-server';

const typeDefs = gql`
  enum Gender {
    MALE
    FEMALE
    OTHER
  }

  enum Interest {
    TRAVELLING
    EXERCISE
    GYM
    SPORTS
    RUNNING
    FOOTBALL
    HOCKEY
    SOCCER
    THEATRE
    NETFLIX
    MOVIES
    DANCING
    COOKING
    OUTDOORS
    HIKING
    TREKKING
    SKIING
    POLITICS
    PETS
    PHOTOGRAPHY
    ART
    MUSIC
    RAP
    ROCK
    POP
    INDI
    GARDENING
    STUDYING
    CODING
  }
`;

export { typeDefs };
