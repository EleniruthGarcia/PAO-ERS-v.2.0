import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fetchClient() {
  const client = await prisma.client.findUnique({
    where: {
      id: 1,
    },
  });

  console.log('Client:', client);
}

fetchClient()
  .catch((error) => {
    console.error('Error fetching client:', error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
