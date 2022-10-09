/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
  PluginDefinition,
} from 'apollo-server-core';
import {
  ApolloServer,
  Config as ApolloServerConfig,
  FastifyContext,
} from 'apollo-server-fastify';
import { FastifyInstance } from 'fastify';
import { GraphQLSchema } from 'graphql';
import { Logger } from 'pino';
import { loggerPlugin, fastifyAppClosePlugin } from './plugins/index.js';

/**
 * Configuration for {@link createApolloServer}.
 */
export interface Config {
  /**
   * Apollo Server configuration.
   * This option can be used to override the default configuration.
   *
   * @see{@link https://www.apollographql.com/docs/apollo-server/api/apollo-server/#options}
   */
  config?: Partial<ApolloServerConfig>;
  /**
   * Properties to add to the context of GraphQL resolvers.
   */
  context?: object | ((context: FastifyContext) => object);
  /**
   * The executable GraphQL schema.
   */
  schema: GraphQLSchema;
  /**
   * A logger instance.
   */
  logger: Logger;
  /**
   * Fastify app instance.
   */
  fastify: FastifyInstance;
  /**
   * Additional Apollo plugins.
   *
   * @defaultValue
   * ```
   * [
   *   loggerPlugin,
   *   fastifyAppClosePlugin(fastify),
   *   ApolloServerPluginDrainHttpServer({ httpServer: fastify.server }),
   *   ApolloServerPluginLandingPageLocalDefault({ embed: true }),
   * ]
   * ```
   */
  plugins?: PluginDefinition[];
}

/**
 * Creates an Apollo Server instance.
 * @see {@link https://www.apollographql.com/docs/apollo-server/}
 */
export default function createApolloServer({
  config,
  schema,
  context,
  logger,
  fastify,
  plugins = [],
}: Config) {
  const typeDefs = (config?.typeDefs as string[]) || [];
  return new ApolloServer({
    typeDefs,
    // nexus generated schema
    schema,
    context: (ctx) => {
      if (context) {
        return typeof context === 'object'
          ? {
              log: logger,
              ...context,
            }
          : context(ctx);
      }
      return {
        log: logger,
        ...ctx,
      };
    },
    /* In case of "Internal Server Error", omit the message to
     * avoid passing sensitive or irrelevant data to the client.
     * see https://www.apollographql.com/docs/apollo-server/data/errors/#masking-and-logging-errors */
    formatError(err) {
      if (err.extensions?.code === 'INTERNAL_SERVER_ERROR') {
        return new Error('Internal server error');
      }
      return err;
    },
    introspection: true,
    plugins: [
      loggerPlugin,
      fastifyAppClosePlugin(fastify),
      ApolloServerPluginDrainHttpServer({ httpServer: fastify.server }),
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
      ...plugins,
    ],
    ...config,
  });
}
