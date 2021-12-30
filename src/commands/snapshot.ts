import * as user from "../lib/user.js";
import { Contract } from "ethers";
import { Discord, SimpleCommand, SimpleCommandMessage } from "discordx";
import { gym, school, smolbodies, smolbrains } from "../lib/contracts.js";
import { proxy, snapshot, subscribe } from "valtio/vanilla";
import fetch from "cross-fetch";

function chunk<T>(arr: T[], size: number) {
  return arr.reduce<T[][]>((chunks, value, index) => {
    index % size ? chunks[chunks.length - 1].push(value) : chunks.push([value]);

    return chunks;
  }, []);
}

async function wait() {
  return new Promise((resolve) => setTimeout(resolve, 7_500));
}

@Discord()
abstract class Snapshot {
  @SimpleCommand("snapshot")
  async snapshot(command: SimpleCommandMessage) {
    if (!user.isAdmin(command.message.member?.user.id)) {
      return;
    }

    const state = proxy({
      bodies: {
        owners: -1,
        staked: -1,
        total: 6_666,
        url: "",
      },
      brains: {
        owners: -1,
        staked: -1,
        total: 13_422,
        url: "",
      },
    });

    const message = command.message;
    const spacer = { inline: true, name: "\u200b", value: "\u200b" };

    const info = await message.channel.send({
      embeds: [
        {
          title: "Snapshot Status",
          description: "Warming up...",
          color: 0xbb33ff,
        },
      ],
    });

    await message.channel.sendTyping();

    try {
      subscribe(state, async () => {
        const { bodies, brains } = snapshot(state);

        await info.edit({
          embeds: [
            {
              title: "Snapshot Status",
              color: 0xbb33ff,
              fields: [
                {
                  inline: true,
                  name: "Smol Brains",
                  value: `${brains.total}`,
                },
                {
                  inline: true,
                  name: "Stakers",
                  value: `${brains.staked}`,
                },
                {
                  inline: true,
                  name: "Owners",
                  value: `${brains.owners}`,
                },
                {
                  inline: true,
                  name: "Smol Bodies",
                  value: `${bodies.total}`,
                },
                {
                  inline: true,
                  name: "Stakers",
                  value: `${bodies.staked}`,
                },
                {
                  inline: true,
                  name: "Owners",
                  value: `${bodies.owners}`,
                },
                {
                  inline: true,
                  name: "CSVs",
                  value: [
                    [bodies.url, "Smol Bodies"],
                    [brains.url, "Smol Brains"],
                  ]
                    .filter(([url]) => Boolean(url))
                    .reduce((acc, [url, title]) => {
                      return `${acc} [${title}](${url})`;
                    }, ""),
                },
              ].map((item) => {
                if (item.value !== "" && item.value !== "-1") {
                  return item;
                }

                return spacer;
              }),
            },
          ],
        });
      });
    } catch (error) {
      console.log("Edit embed error:", error);
    }

    async function query(
      key: "bodies" | "brains",
      nft: Contract,
      staking: Contract,
      method: string
    ) {
      const stakerStatus = new Map<number, boolean>();

      try {
        const {
          [key]: { total },
        } = snapshot(state);

        do {
          const chunks = chunk(
            Array(total)
              .fill(0)
              .map((_, index) => index)
              .filter((item) => !stakerStatus.has(item)),
            750
          );

          for await (const data of chunks) {
            await wait();
            await message.channel.sendTyping();

            await Promise.all(
              data.map(async (tokenId) => {
                try {
                  const status: boolean = await staking[method](tokenId);

                  stakerStatus.set(tokenId, status);
                } catch {}
              })
            );

            state[key].staked = stakerStatus.size;
          }
        } while (stakerStatus.size !== total);

        const stakedTokens = [];

        for (const [token, status] of stakerStatus.entries()) {
          if (status) {
            stakedTokens.push(token);
          }
        }

        state[key].staked = stakedTokens.length;

        const stakerOwners = new Map<number, string>();

        do {
          const chunks = chunk(
            stakedTokens.filter((item) => !stakerOwners.has(item)),
            750
          );

          for await (const data of chunks) {
            await wait();
            await message.channel.sendTyping();

            await Promise.all(
              data.map(async (tokenId) => {
                try {
                  const owner: string = await nft.ownerOf(tokenId);

                  stakerOwners.set(tokenId, owner);
                } catch {}
              })
            );

            state[key].owners = stakerOwners.size;
          }
        } while (stakerOwners.size !== stakedTokens.length);

        const url = `https://filebin.net/smols-${Date.now()}/${key}.csv`;

        await fetch(url, {
          body: Object.entries(
            Array.from(stakerOwners).reduce<Record<string, number>>(
              (acc, [, wallet]) => {
                acc[wallet] ??= 0;
                acc[wallet]++;

                return acc;
              },
              {}
            )
          )
            .sort(([, left], [, right]) => right - left)
            .map((item) => item.join(","))
            .join("\n"),
          method: "post",
        });

        state[key].url = url;
      } catch (error) {
        console.log("Query error:", error);

        await info.edit({
          embeds: [
            {
              title: "Snapshot Status",
              description: "Error fetching information.",
              color: 0xbb33ff,
            },
          ],
        });
      }
    }

    try {
      await query("brains", smolbrains, school, "isAtSchool");
      await query("bodies", smolbodies, gym, "isAtGym");
    } catch (error) {
      console.log("!snapshot error:", error);

      await info.edit({
        embeds: [
          {
            title: "Snapshot Status",
            description: "Error fetching information.",
            color: 0xbb33ff,
          },
        ],
      });
    }
  }
}
