import type { PageServerLoad, Actions } from "./$types.js";
import { fail, redirect } from "@sveltejs/kit";

import { lucia, prisma } from "$lib/server";
import { Argon2id } from "oslo/password";

import { formSchema } from "./schema";
import { zod } from "sveltekit-superforms/adapters";
import { superValidate } from "sveltekit-superforms";

export const load: PageServerLoad = async () => {
    return {
        form: await superValidate(zod(formSchema)),
    };
};

export const actions: Actions = {
    default: async (event) => {
        const form = await superValidate(event, zod(formSchema));
        if (!form.valid) {
            return fail(400, {
                form,
            });
        }

        const { username, password } = form.data;

        const existingUser = await prisma.user.findUnique({
            where: {
                username,
            },
        });

        if (!existingUser) {
            return fail(400, {
                message: "Invalid username or password",
            });
        }

        const validPassword = await new Argon2id().verify(existingUser.hashedPassword, password);
        if (!validPassword) {
            return fail(400, {
                message: "Invalid username or password",
            });
        }

        const session = await lucia.createSession(existingUser.id, {});
        const sessionCookie = lucia.createSessionCookie(session.id);
        event.cookies.set(sessionCookie.name, sessionCookie.value, {
            path: ".",
            ...sessionCookie.attributes,
        });

        redirect(302, "/");
    },
};