/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import {
  makeSchema,
  // queryComplexityPlugin,
  // fieldAuthorizePlugin,
  // declarativeWrappingPlugin,
} from 'nexus';
import { SchemaConfig } from 'nexus/dist/core.js';
import { join } from 'path';

/**
 * GraphQL Context.
 *{@link Config.context }
 */
export interface Context {
  /**
   * Path to a module that contains the exported context type.
   *
   * @example
   * If the context type is defined in `./api/context.ts`:
   * ```
   * module: join(__dirname, 'api/context.ts'),
   * ```
   * @see {@link nexus/dist/builder.d.ts#BuilderConfigInput.contextType}
   */
  module: string;
  /**
   * The name of a type exported from the module specified in
   * `module`, to use as the context type.
   *
   * @example
   * ```
   * name: 'GraphQLContext',
   * ```
   * @see {@link nexus/dist/builder.d.ts#BuilderConfigInput.contextType}
   */
  name: string;
}

/**
 * Configuration for {@link generateSchema}.
 */
export interface Config {
  /**
   * The GraphQL types defined using Nexus.
   *
   * @remarks
   * It's typed as `any` for simplicity of developer experience by
   * Nexus.
   *
   * @see {@link https://nexusjs.org/docs/api/make-schema}
   * @see {@link nexus/dist/builder.d.ts#SchemaConfig.types}
   */
  types: any;
  /**
   * Path to a module that contains the exported source types of
   * the API.
   *
   * @example
   * If the source types are defined in `./nexus/sourceTypes.ts`:
   * ```
   * sourceTypesPath: join(__dirname, 'nexus/sourceTypes.ts'),
   * ```
   * @see {@link https://nexusjs.org/docs/guides/source-types}
   * @see {@link nexus/dist/builder.d.ts#BuilderConfigInput.sourceTypes}
   */
  sourceTypes: string;
  /**
   * TypeScript type of the GraphQL context.
   */
  contextType: Context;
  /**
   * A path to a directory where the generated types and GraphQL
   * schema will be located.
   *
   * @example
   * ```
   * outputDir: join(__dirname, 'nexus/generated/'),
   * ```
   *
   * @see {@link nexus/dist/builder.d.ts#BuilderConfigInput.outputs}
   */
  outputDir: string;
  /**
   * Nexus configuration.
   * This option can be used to override the default configuration.
   *
   * @see {@link https://nexusjs.org/docs/api/make-schema}
   */
  config?: Partial<SchemaConfig>;
}

/**
 * Generates a GraphQL schema using {@link https://nexusjs.org/ | Nexus}.
 */
export default function generateSchema({
  types,
  contextType,
  sourceTypes,
  outputDir,
  config,
}: Config) {
  return makeSchema({
    types,
    shouldExitAfterGenerateArtifacts: process.argv.includes('--nexus-generate'),
    shouldGenerateArtifacts: true,
    // all fields are non nullable by default
    nonNullDefaults: { output: true, input: true },
    outputs: {
      typegen: join(outputDir, 'types.gen.ts'),
      schema: join(outputDir, 'schema.gen.graphql'),
    },
    contextType: {
      alias: 'ctx',
      export: contextType.name,
      module: contextType.module,
    },
    sourceTypes: {
      modules: [
        {
          module: sourceTypes,
          alias: 'sourceTypes',
        },
      ],
    },
    plugins: [
      // declarativeWrappingPlugin(),
      // fieldAuthorizePlugin(),
      // queryComplexityPlugin(),
    ],
    ...config,
  });
}
