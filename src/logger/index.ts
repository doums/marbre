/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import { pino, LoggerOptions } from 'pino';
import { NODE_ENV, LOG_LEVEL } from '../env/index.js';

const options: LoggerOptions = {
  level: LOG_LEVEL,
  formatters: {
    // in production print the label instead of the numeric value
    // of the level
    level: (label) => ({ level: label }),
  },
};

// pretty print in dev environment
if (NODE_ENV === 'development') {
  options.transport = {
    target: 'pino-pretty',
    options: {
      colorize: true,
      ignore: 'pid,hostname',
      translateTime: 'HH:MM:ss Z',
    },
  };
}

const logger = pino(options);

export { options };

export default logger;
