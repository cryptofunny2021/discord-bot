import client from "@prisma/client";

const prisma = new client.PrismaClient();

async function main() {
  const version = await prisma.version.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
    },
  });

  console.log({ version });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
