import { FastifyRequest } from 'fastify';
import { JwtPayload } from 'jsonwebtoken';

export interface SupabaseAuthPluginOptions {
    /** Your Supabase project's JWT secret */
    supabaseJwtSecret?: string;

    /** Optional: JWKS URL for public key validation */
    supabaseJWKSUrl?: string;

    /** Optional: Token extractor function */
    extractor?: (req: FastifyRequest) => string | null;

    /** Optional: If true, return 401 on invalid token */
    unauthorizedResponse?: boolean;

    /** Optional: Transform decoded payload into user object */
    onVerify?: (decoded: JwtPayload | string) => Promise<any>;
}

export interface JWTPayload extends JwtPayload {
    email?: string;
    sub?: string;
    role?: string;
    [key: string]: any;
}