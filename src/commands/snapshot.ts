import * as user from "../lib/user.js";
import { Contract } from "ethers";
import { Discord, SimpleCommand, SimpleCommandMessage } from "discordx";
import {
  cars,
  gym,
  land,
  rocket,
  school,
  smolbodies,
  smolbrains,
} from "../lib/contracts.js";
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
      cars: {
        owners: -1,
        total: 8_878,
        url: "",
      },
      land: {
        owners: -1,
        total: 4_216,
        url: "",
      },
      rocket: {
        owners: -1,
        staked: -1,
        total: 13_422,
        url: "",
      },
      status: "",
      tries: 0,
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
        const { bodies, brains, cars, land, rocket, status } = snapshot(state);

        await info.edit({
          embeds: [
            {
              title: "Snapshot Status",
              color: 0xbb33ff,
              fields: [
                { name: "Working on", value: status },
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
                  name: "Smol Rocket",
                  value: `${rocket.total}`,
                },
                {
                  inline: true,
                  name: "Stakers",
                  value: `${rocket.staked}`,
                },
                {
                  inline: true,
                  name: "Owners",
                  value: `${rocket.owners}`,
                },
                {
                  inline: true,
                  name: "Smol Land",
                  value: `${land.total}`,
                },
                {
                  inline: true,
                  name: "Owners",
                  value: `${land.owners}`,
                },
                {
                  inline: true,
                  name: "\u200b",
                  value: "\u200b",
                },
                {
                  inline: true,
                  name: "Smol Cars",
                  value: `${cars.total}`,
                },
                {
                  inline: true,
                  name: "Owners",
                  value: `${cars.owners}`,
                },
                {
                  inline: true,
                  name: "\u200b",
                  value: "\u200b",
                },
                {
                  inline: true,
                  name: "CSVs",
                  value: [
                    [bodies.url, "Smol Bodies"],
                    [brains.url, "Smol Brains"],
                    [land.url, "Smol Land"],
                    [cars.url, "Smol Cars"],
                    [rocket.url, "Smol Rocket"],
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
      key: "bodies" | "brains" | "cars" | "land" | "rocket",
      nft: Contract,
      staking: Contract | null,
      method: string
    ) {
      const stakerStatus = new Map<number, boolean>();

      state.status = key.slice(0, 1).toUpperCase().concat(key.slice(1));

      try {
        const {
          [key]: { total },
        } = snapshot(state);

        const stakedTokens = [];

        if (staking) {
          state.tries = Math.ceil(total / 750) * 2;

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

              // @ts-ignore-error
              state[key].staked = stakerStatus.size;

              state.tries--;
            }

            if (state.tries === 0) {
              throw new Error("Reran out of tries");
            }
          } while (stakerStatus.size !== total);

          for (const [token, status] of stakerStatus.entries()) {
            if (status) {
              stakedTokens.push(token);
            }
          }

          // @ts-ignore-error
          state[key].staked = stakedTokens.length;
        } else {
          Array(total)
            .fill(0)
            .map((_, index) => index)
            .forEach((token) => {
              stakedTokens.push(token);
            });
        }

        const stakerOwners = new Map<number, string>();

        state.tries = Math.ceil(stakedTokens.length / 750) * 2;

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
            state.tries--;
          }

          if (state.tries === 0) {
            throw new Error("Reran out of tries");
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
      await query("land", land, null, "");
      await query("cars", cars, null, "");
      await query("rocket", rocket, rocket, "boardedBeforeDeadline");
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
