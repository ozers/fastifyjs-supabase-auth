import { FastifyPluginCallback } from 'fastify';
import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken';
import fp from 'fastify-plugin';
import { SupabaseAuthPluginOptions } from './types';

// Authenticated user information
// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare module 'fastify' {
  interface FastifyRequest {
    user?: JwtPayload | string;
  }
}

const defaultExtractor = (req: any): string | null => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  return authHeader.slice(7); // Remove 'Bearer '
};

const supabaseAuthPlugin: FastifyPluginCallback<SupabaseAuthPluginOptions> = (fastify, options, done) => {
  const {
    supabaseJwtSecret,
    extractor = defaultExtractor,
    unauthorizedResponse = false,
    onVerify,
  } = options;

  fastify.addHook('onRequest', async (request, reply) => {
    const token = extractor(request);
    if (!token) {
      if (unauthorizedResponse) reply.code(401).send({ message: 'Unauthorized' });
      return;
    }

    try {
      const decoded = await new Promise<JwtPayload | string>((resolve, reject) => {
        const verifyCallback = (err: VerifyErrors | null, decoded: JwtPayload | string | undefined) => {
          if (err || !decoded) return reject(err);
          resolve(decoded);
        };

        if (supabaseJwtSecret) {
          jwt.verify(token, supabaseJwtSecret, verifyCallback);
        } else {
          reject(new Error('supabaseJwtSecret is required.'));
        }
      });

      request.user = onVerify ? await onVerify(decoded) : decoded;
    } catch (err) {
      request.log.debug('JWT verification failed');
      if (unauthorizedResponse) reply.code(401).send({ message: 'Unauthorized' });
    }
  });

  done();
};

export default fp(supabaseAuthPlugin, {
  name: 'fastifyjs-supabase-auth',
});
