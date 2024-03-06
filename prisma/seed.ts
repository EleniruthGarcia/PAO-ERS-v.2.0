import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
	await prisma.user.upsert({
		where: { username: 'admin' },
		update: {},
		create: {
			username: 'admin',
			passwordHash: await bcrypt.hash('admin', 10),
			userAuthToken: crypto.randomUUID(),
			role: 'admin'
		}
	});
	await prisma.client.upsert({
		where: { id: 1 },
		update: {
			id: 1,
			firstName: 'John',
			middleName: 'Doe',
			lastName: 'Smith',
			nameSuffix: 'III',
			age: 25,
			sex: 'Male',
			address: '1234 Main St.'
		},
		create: {
			id: 1,
			firstName: 'John',
			middleName: 'Doe',
			lastName: 'Smith',
			age: 25,
			sex: 'Male',
			address: '1234 Main St.'
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
