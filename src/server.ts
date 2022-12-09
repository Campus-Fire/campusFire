import { makeExecutableSchema } from '@graphql-tools/schema';
import { ApolloServer } from 'apollo-server';

import { resolvers } from './application/indexes/resolver';
import { typeDefs } from './application/schema';

const PORT = 4001;

const createApp = async (): Promise<void> => {
  const server = new ApolloServer({
    schema: makeExecutableSchema({ typeDefs, resolvers }),
    introspection: true,
    context: (ctx) => {
      return ctx;
    },
  });

  server.listen({ port: PORT });
  console.log(`Server running at http://localhost:${PORT}${server.graphqlPath}`);
};

createApp();
