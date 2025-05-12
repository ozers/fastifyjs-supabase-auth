# fastifyjs-supabase-auth

Authenticate Supabase users in your Fastify app using their JWT access tokens — without repeating boilerplate logic.

> 🔒 Note: Supabase does not currently support JWKS-based (public key) verification. This plugin only supports static secret-based verification via `SUPABASE_JWT_SECRET`.

## Features
- ✅ Verifies Supabase JWT tokens with a shared secret
- ✅ Attaches decoded JWT payload to `request.user`
- ✅ Optional `onVerify` callback to transform or validate token
- ✅ Supports custom token extractors
- ✅ Type-safe and lightweight


## Why use this plugin?

Manually authenticating Supabase JWTs in Fastify means repeating the same logic across routes: header parsing, verification, error handling, and payload attachment.

This plugin simplifies all of that into a clean Fastify hook — making your codebase safer, DRYer, and easier to maintain.

## Installation

```bash
npm install fastifyjs-supabase-auth jsonwebtoken fastify-plugin
# or
yarn add fastifyjs-supabase-auth jsonwebtoken fastify-plugin
```

## Usage

```ts
import Fastify from 'fastify';
import fastifySupabaseAuth from 'fastifyjs-supabase-auth';

const app = Fastify();

app.register(fastifySupabaseAuth, {
  supabaseJwtSecret: process.env.SUPABASE_JWT_SECRET!,
  unauthorizedResponse: true, // optional
});

app.get('/me', async (req, reply) => {
  if (!req.user) {
    return reply.status(401).send({ message: 'Unauthorized' });
  }
  return { user: req.user };
});
```

_See [`examples/example.ts`](examples/example.ts) for a full working demo._

## Options

| Name                   | Type                             | Description                                               |
|------------------------|----------------------------------|-----------------------------------------------------------|
| `supabaseJwtSecret`    | `string`                         | Required. Supabase JWT secret                             |
| `extractor`            | `(req) => string \| null`         | Optional. Function to extract JWT from request            |
| `unauthorizedResponse`| `boolean`                         | Optional. Responds with 401 if token is missing/invalid   |
| `onVerify`             | `(decoded) => Promise<any>`      | Optional. Called with decoded payload before assignment   |

## License

MIT
