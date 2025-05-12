import 'dotenv/config';
import Fastify from 'fastify';
import fastifySupabaseAuth from '../src';
import jwt from 'jsonwebtoken';

const app = Fastify({ logger: true });

app.register(fastifySupabaseAuth, {
  supabaseJwtSecret: process.env.SUPABASE_JWT_SECRET!,
  unauthorizedResponse: true,
});

app.get('/me', async (req, reply) => {
  if (!req.user) {
    return reply.status(401).send({ message: 'Unauthorized' });
  }
  return { user: req.user };
});

app.listen({ port: 3000 }, (err) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  console.log('Server running on http://localhost:3000');
});