# fastifyjs-supabase-auth

Authenticate Supabase users in your Fastify app using their JWT access tokens — without repeating boilerplate logic.

> 🔒 Note: Supabase does not currently support JWKS-based (public key) verification. This plugin only supports static secret-based verification via `SUPABASE_JWT_SECRET`.

## Features
- ✅ Verifies Supabase JWT tokens with a shared secret
- ✅ Attaches decoded JWT payload to `request.user`
- ✅ Optional `onVerify` callback to transform or validate token
- ✅ Supports custom token extractors
- ✅ Type-safe and lightweight
- ✅ Route prefix based authentication
- ✅ Flexible route-level authentication configuration

## Projects Using This Package

- [Yayınlıyor](https://www.yayinliyor.com/) - A new book writing & reading platform from Türkiye.

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

### Route Prefix Based Authentication

```ts
import Fastify from 'fastify';
import fastifySupabaseAuth from 'fastifyjs-supabase-auth';

const app = Fastify();

// Register the Supabase auth plugin for protected routes only
const protectedRoutes = app.register(async (fastify) => {
  await fastify.register(fastifySupabaseAuth, {
    supabaseJwtSecret: process.env.SUPABASE_JWT_SECRET!,
    unauthorizedResponse: true
  });

  // All routes under this prefix will require authentication
  fastify.get('/profile', async (req, reply) => {
    return { user: req.user };
  });

  fastify.put('/profile', async (req, reply) => {
    return { message: 'Profile updated' };
  });
}, { prefix: '/api/auth' });

// Public routes (no auth required)
app.post('/api/auth/register', async (req, reply) => {
  return { message: 'Registration endpoint' };
});

app.post('/api/auth/login', async (req, reply) => {
  return { message: 'Login endpoint' };
});
```

### Route-Level Authentication

```ts
import Fastify from 'fastify';
import fastifySupabaseAuth from 'fastifyjs-supabase-auth';

const app = Fastify();

// Register the auth plugin
app.register(fastifySupabaseAuth, {
  supabaseJwtSecret: process.env.SUPABASE_JWT_SECRET!,
  unauthorizedResponse: true
});

// Protected route using onRequest hook
app.get('/protected', {
  onRequest: [app.authenticate]
}, async (req, reply) => {
  return { user: req.user };
});

// Public route
app.get('/public', async (req, reply) => {
  return { message: 'This is a public endpoint' };
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

## Route Configuration

### Route Prefix Based Authentication
- Use Fastify's route prefix feature to group protected routes
- All routes under the prefix will require authentication
- Routes outside the prefix will be public by default

### Route-Level Authentication
- Routes without the authenticate hook will be public

## License

MIT
