import { Argon2id } from "oslo/password";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    await prisma.user.upsert({
        where: { username: 'admin' },
        update: {},
        create: {
            id: 'admin',
            username: 'admin',
            hashedPassword: await new Argon2id().hash('admin1234'),
        }
    });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });