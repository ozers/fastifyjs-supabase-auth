import Fastify from 'fastify';
import jwt from 'jsonwebtoken';
import plugin from '../src';
import { expect } from 'chai';
import {JWTPayload} from "../src/types";

const SECRET = 'test-secret';
const VALID_TOKEN = jwt.sign({ sub: '123', email: 'test@example.com' }, SECRET, { expiresIn: '1h' });

const build = (options = {}) => {
    const app = Fastify();
    app.register(plugin, {
        supabaseJwtSecret: SECRET,
        ...options,
    });
    app.get('/test', async (req, reply) => {
        return req.user || {};
    });
    return app;
};

describe('fastifyjs-supabase-auth plugin', () => {
    it('should attach decoded user on valid token', async () => {
        const app = build();
        const response = await app.inject({
            method: 'GET',
            url: '/test',
            headers: {
                Authorization: `Bearer ${VALID_TOKEN}`,
            },
        });

        expect(response.statusCode).to.equal(200);
        const body = JSON.parse(response.body);
        expect(body.email).to.equal('test@example.com');
    });

    it('should not attach user on missing token', async () => {
        const app = build();
        const response = await app.inject({ method: 'GET', url: '/test' });
        expect(response.statusCode).to.equal(200);
        const body = JSON.parse(response.body);
        expect(body).to.deep.equal({});
    });

    it('should return 401 on missing token when unauthorizedResponse is true', async () => {
        const app = build({ unauthorizedResponse: true });
        const response = await app.inject({ method: 'GET', url: '/test' });
        expect(response.statusCode).to.equal(401);
    });

    it('should apply onVerify transform to decoded token', async () => {
        const app = build({
            onVerify: async (decoded: JWTPayload) => {
                return { id: decoded.sub, email: (decoded as any).email, role: 'user' };
            },
        });
        const response = await app.inject({
            method: 'GET',
            url: '/test',
            headers: {
                Authorization: `Bearer ${VALID_TOKEN}`,
            },
        });

        expect(response.statusCode).to.equal(200);
        const body = JSON.parse(response.body);
        expect(body).to.include({ email: 'test@example.com', role: 'user' });
    });

    it('should return 401 on invalid token when unauthorizedResponse is true', async () => {
        const app = build({ unauthorizedResponse: true });
        const response = await app.inject({
            method: 'GET',
            url: '/test',
            headers: { Authorization: 'Bearer invalid.token.here' },
        });
        expect(response.statusCode).to.equal(401);
    });
});
