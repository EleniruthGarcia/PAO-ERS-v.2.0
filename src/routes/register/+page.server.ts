import prisma from '$lib/server/prisma'
import bcrypt from 'bcrypt'

import { fail, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'

enum Roles {
    ADMIN = 'ADMIN',
    USER = 'USER',
    LAWYER = 'LAWYER',
}

export const load: PageServerLoad = async () => {
    // todo
}

export const actions = {
    default: async ({ request, cookies }) => {
        const data = await request.formData()
        const username = data.get('username')
        const password = data.get('password')

        if (
            typeof username !== 'string' ||
            typeof password !== 'string' ||
            !username ||
            !password
        ) {
            return fail(400, { invalid: true })
        }

        const user = await prisma.user.findUnique({
            where: { username },
        })

        if (user) {
            return fail(400, { user: true })
        }

        const userAuthToken = crypto.randomUUID()

        await prisma.user.create({
            data: {
                username,
                passwordHash: await bcrypt.hash(password, 10),
                userAuthToken,
                role: { connect: { name: Roles.USER } },
            },
        })

        cookies.set('session', userAuthToken, {
            path: '/',
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 30,
        })


        redirect(302, '/')
    }
} satisfies Actions;