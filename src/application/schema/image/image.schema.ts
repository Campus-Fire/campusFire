import { gql } from 'apollo-server';

const typeDefs = gql`
  type Image {
    id: ObjectID!
    userId: ObjectID!
    src: String!
    isPrimary: Boolean!
    addedAt: Date!
  }

  type Mutation {
    uploadSingleImage(input: UploadSingleImageInput!): String!
    uploadMultipleImages(input: UploadMultpleImagesInput!): [String!]!
    setPrimaryImage(input: ImageInput!): String!
  }

  input ImageInput {
    imgId: ObjectID!
  }

  input UploadSingleImageInput {
    imgSrc: String!
  }

  input UploadMultpleImagesInput {
    imgSources: [String!]!
  }
`;

export { typeDefs };
