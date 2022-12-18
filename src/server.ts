import { makeExecutableSchema } from '@graphql-tools/schema';
import { ApolloServer } from 'apollo-server';
import config from '../config';

import { resolvers } from './application/indexes/resolver';
import { typeDefs } from './application/schema';

const createApp = async (): Promise<void> => {
  const server = new ApolloServer({
    schema: makeExecutableSchema({ typeDefs, resolvers }),
    introspection: true,
    context: (ctx) => {
      return ctx;
    },
  });

  server.listen({ port: config.GRAPHQL_PORT });
  console.log(`Server running at http://localhost:${config.GRAPHQL_PORT}${server.graphqlPath}`);
};

createApp();
