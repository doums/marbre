## Marbre

A GraphQL server with pure Code-First approach out of the box.

Stack:

- [Typescript](https://www.typescriptlang.org/)
- [Fastify](https://www.fastify.io/)
- [Apollo Server](https://www.apollographql.com/docs/apollo-server/)
- [Nexus](https://nexusjs.org/docs/)

The server is built using a simple Fastify application and Apollo
server is consumed as a middleware in order to keep the maximum
flexibility.

The GraphQL layer embraces the "[code
first](https://www.prisma.io/blog/introducing-graphql-nexus-code-first-graphql-server-development-ll6s1yy5cxl5)"
approach using Nexus.

### Features

- code first approach
- strong type-safety
- declarative configuration
- flexibility, you have access to the Fastify app
- configuration fully documented (TSDoc)

### Usage

```typescript
import { join } from 'path';
import { v4 as uuid } from 'uuid';
import Marbre from 'marbre';
import { context } from './api';
import { PORT } from './env';
import * as types from './graphql';

const marbre = new Marbre({
  types,
  context,
  contextType: {
    module: join(__dirname, 'api/context.ts'),
    name: 'GqlContext',
  },
  sourceTypes: join(__dirname, 'api/sourceTypes.ts'),
  outputDir: join(__dirname, 'api/generated/'),
  port: PORT,
  fastify: {
    genReqId: () => uuid(),
  },
});

(async () => {
  await marbre.start();
})();
```

### License

Mozilla Public License v2.0
