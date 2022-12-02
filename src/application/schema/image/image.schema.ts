import { gql } from 'apollo-server';

const typeDefs = gql`
  type Image {
    id: ObjectID!
    src: String!
  }

  type Mutation {
    uploadImage(input: UploadImageInput!): String!
  }

  input UploadImageInput {
    imgSrc: String!
  }
`;

export { typeDefs };
