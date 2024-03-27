import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { PrismaClient } = require('@prisma/client');

import { Lucia } from 'lucia';
import { PrismaAdapter } from '@lucia-auth/adapter-prisma';
import { dev } from '$app/environment';

export const prisma = new PrismaClient();
export const lucia = new Lucia(new PrismaAdapter(prisma.session, prisma.user), {
    sessionCookie: {
        attributes: {
            secure: !dev
        }
    },
    getUserAttributes: (attributes) => {
        return {
            username: attributes.username,
        };
    }
});

declare module 'lucia' {
    interface Register {
        Lucia: typeof lucia;
        DatabaseUserAttributes: DatabaseUserAttributes;
    }
}

interface DatabaseUserAttributes {
    username: string;
}