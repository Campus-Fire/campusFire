import { makeExecutableSchema } from '@graphql-tools/schema';
import { ApolloServerPluginDrainHttpServer, ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { ApolloServer, ExpressContext } from 'apollo-server-express';
import express from 'express';
import { PubSub } from 'graphql-subscriptions';
import { useServer } from 'graphql-ws/lib/use/ws';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import config from '../config';
import { resolvers } from './application/indexes/resolvers.index';
import { typeDefs } from './application/schema/index';
import { UserContext } from './application/schema/types/types';
import { getSessionUser } from './helpers/token-helper';

const createApp = async (): Promise<void> => {
  // Create an Express app and HTTP server.
  const app = express();
  const httpServer = createServer(app);

  // Create the schema.
  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  // Create our WebSocket server using the HTTP server we just set up.
  const webSocketServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
  });

  // User Context params
  const pubsub = new PubSub();

  // Get User Context with each request
  const getGraphQLContext = async (ctx: ExpressContext): Promise<UserContext> => {
    try {
      const { req } = ctx;
      const { id, email } = getSessionUser(req.headers.authorization);

      return {
        pubsub: pubsub,
        session: { user: { id, email } },
      };
    } catch (err) {
      return { pubsub: pubsub, session: null };
    }
  };

  // Get Subscription Context with each request
  const getSubscriptionContext = async (ctx: any): Promise<UserContext> => {
    try {
      const { connectionParams } = ctx;
      const { id, email } = getSessionUser(connectionParams.Authorization);

      return {
        pubsub: pubsub,
        session: { user: { id, email } },
      };
    } catch (err) {
      console.error(err);

      return { pubsub: pubsub, session: null };
    }
  };

  // Hand in the schema so WebSocketServer can start listening.
  const serverCleanup = useServer(
    {
      schema,
      context: (ctx) => {
        return getSubscriptionContext(ctx);
      },
    },
    webSocketServer
  );

  // Set up ApolloServer.
  const apolloServer = new ApolloServer({
    schema,
    plugins: [
      // Proper shutdown for the HTTP server.
      ApolloServerPluginDrainHttpServer({
        httpServer,
      }),

      // Proper shutdown for the WebSocket server.
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
      ApolloServerPluginLandingPageLocalDefault({
        embed: true,
      }),
    ],
    introspection: true,
    context: (ctx) => {
      return getGraphQLContext(ctx);
    },
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  httpServer.listen(config.GRAPHQL_PORT, () => {
    console.log(`Server running at http://localhost:${config.GRAPHQL_PORT}${apolloServer.graphqlPath}`);
  });
};

createApp();
