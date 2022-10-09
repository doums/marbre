/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import { ApolloServerPlugin } from 'apollo-server-plugin-base';
import { Logger } from 'pino';
import log from '../../logger/index.js';

interface Context {
  log: Logger;
}

const loggerPlugin: ApolloServerPlugin<Context> = {
  async serverWillStart() {
    if (!process.argv.includes('--nexus-generate')) {
      log.info('[Apollo] server starting up');
    }
    return {
      async drainServer() {
        log.warn('[Apollo] server shuts down');
      },
    };
  },

  async requestDidStart(requestContext) {
    const {
      context: { log },
      request: { query, operationName, variables },
    } = requestContext;
    let message = `[Apollo] received a graphql request\n`;
    if (operationName) {
      message += `operationName: "${operationName}"\n`;
    }
    if (variables) {
      message += `variables:\n${JSON.stringify(variables)}\n\n`;
    }
    log.info(
      `${message}${
        operationName && operationName === 'IntrospectionQuery' ? '' : query
      }`
    );

    return {
      didEncounterErrors: async ({ errors }) => {
        errors.forEach((error) => {
          log.error(`[Apollo] ${error}\n\nSTACK:\n${error.stack}`);
        });
      },
    };
  },
};

export default loggerPlugin;
