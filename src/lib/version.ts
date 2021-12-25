import { readPackage } from "read-pkg";
import client from "@prisma/client";

const prisma = new client.PrismaClient();

export default async function version() {
  try {
    await prisma.$connect();

    const item = await prisma.version.findFirst();

    if (item) {
      const pkg = await readPackage();
      const [version] = pkg.version.split(".").map(Number);

      console.log("Db:", item.id);
      console.log("Current:", version);

      if (item.id !== version) {
        await prisma.version.update({
          data: { id: { increment: 1 } },
          where: item,
        });

        console.log("New version detected.");
      }
    }
  } catch (error) {
    console.log("Version check error:", error);
  } finally {
    await prisma.$disconnect();
  }
}
