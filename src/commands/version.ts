import client from "@prisma/client";
import { Discord, SimpleCommand, SimpleCommandMessage } from "discordx";

const prisma = new client.PrismaClient();

@Discord()
abstract class Version {
  @SimpleCommand("version")
  async version(command: SimpleCommandMessage) {
    try {
      await prisma.$connect();

      const item = await prisma.version.findFirst();

      if (item) {
        await command.message.channel.send({
          embeds: [
            {
              title: "Version",
              description: `${item.id}`,
              color: 0x663399,
            },
          ],
        });
      }
    } catch (error) {
      console.log("!version Error: ", error);
    } finally {
      await prisma.$disconnect();
    }
  }
}
