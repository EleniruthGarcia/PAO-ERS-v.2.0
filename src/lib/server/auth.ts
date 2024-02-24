import prisma from "$lib/server/prisma";
import type { RequestEvent } from "@sveltejs/kit";

export const authenticateUser = async (event: RequestEvent) => {
    const session = event.cookies.get('session');
    if (!session) return null;

    const user = await prisma.user.findUnique({
        where: { userAuthToken: session },
        select: {
            username: true,
            role: true,
        },
    });
    if (!user) return null;

    return {
        name: user.username,
        role: user.role,
    };
}