/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import env from 'env-var';

export const NODE_ENV = env.get('NODE_ENV').default('development').asString();
export const LOG_LEVEL = env.get('LOG_LEVEL').default('info').asString();
