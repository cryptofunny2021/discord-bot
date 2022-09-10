import fetch from 'cross-fetch'
import { Discord, SimpleCommand, SimpleCommandMessage } from 'discordx'
import { GraphQLClient } from 'graphql-request'
import { proxy, snapshot, subscribe } from 'valtio/vanilla'

import { getSdk } from '../../generated/snapshot.graphql.js'
import * as user from '../lib/user.js'

function chunk<T>(arr: T[], size: number) {
  return arr.reduce<T[][]>((chunks, value, index) => {
    index % size ? chunks[chunks.length - 1].push(value) : chunks.push([value])

    return chunks
  }, [])
}

async function wait() {
  return new Promise((resolve) => setTimeout(resolve, 7_500))
}

const client = getSdk(new GraphQLClient(`${process.env.SNAPSHOT_URL}`))

@Discord()
export class Snapshot {
  @SimpleCommand()
  async snapshot(command: SimpleCommandMessage) {
    if (!user.isAdmin(command.message.member?.user.id)) {
      return
    }

    const state = proxy({
      bodies: {
        fetched: 0,
        total: 6_666,
        url: '',
      },
      brains: {
        fetched: 0,
        total: 13_422,
        url: '',
      },
      cars: {
        fetched: 0,
        total: 9_130,
        url: '',
      },
      extra_life: {
        fetched: 0,
        total: 32,
        url: '',
      },
      land: {
        fetched: 0,
        total: 4_220,
        url: '',
      },
      rocket: {
        fetched: 0,
        total: 13_422,
        url: '',
      },
      status: '',
    })

    const message = command.message
    const spacer = { inline: true, name: '\u200b', value: '\u200b' }

    const info = await message.channel.send({
      embeds: [
        {
          title: 'Snapshot Status',
          description: 'Warming up...',
          color: 0xbb33ff,
        },
      ],
    })

    await message.channel.sendTyping()

    try {
      subscribe(state, async () => {
        const { bodies, brains, cars, extra_life, land, rocket, status } =
          snapshot(state)

        await info.edit({
          embeds: [
            {
              title: 'Snapshot Status',
              color: 0xbb33ff,
              fields: [
                status === 'done'
                  ? { name: 'Complete', value: '\u200b' }
                  : { name: `Working on ${status}`, value: '\u200b' },
                ...(
                  [
                    ['Smol Brains', brains],
                    ['Smol Land', land],
                    ['Smol Bodies', bodies],
                    ['Smol Cars', cars],
                    ['Smol Rocket', rocket],
                    ['Extra Life', extra_life],
                  ] as const
                )
                  .map(([name, data]) => [
                    {
                      inline: true,
                      name,
                      value: `${data.fetched}/${data.total}`,
                    },
                    {
                      inline: true,
                      name: 'CSV',
                      value: data.url
                        ? `[Download](${data.url})`
                        : 'Not available',
                    },
                    spacer,
                  ])
                  .flat(),
              ],
            },
          ],
        })
      })
    } catch (error) {
      console.log('Edit embed error:', error)
    }

    let count = 0
    let id_gt: string | undefined

    async function query<T extends (res: string[]) => Promise<void>>(
      key: 'bodies' | 'brains' | 'cars' | 'extra_life' | 'land' | 'rocket',
      get: T
    ) {
      let results: string[] = []

      id_gt = undefined

      state.status = key
        .slice(0, 1)
        .toUpperCase()
        .concat(key.slice(1))
        .replace(/_(.)/, (_, letter) => ` ${letter}`.toUpperCase())

      try {
        do {
          await message.channel.sendTyping()
          await get(results)

          state[key].fetched += count
        } while (count === 1_000)

        const url = `https://filebin.net/smols-${Date.now()}/${key}.csv`

        await fetch(url, {
          body: Object.entries(
            results.reduce<Record<string, number>>((acc, wallet) => {
              acc[wallet] ??= 0
              acc[wallet]++

              return acc
            }, {})
          )
            .sort(([, left], [, right]) => right - left)
            .map((item) => item.join(','))
            .join('\n'),
          method: 'post',
        })

        state[key].url = url
      } catch (error) {
        console.log('Query error:', error)

        await info.edit({
          embeds: [
            {
              title: 'Snapshot Status',
              description: 'Error fetching information.',
              color: 0xbb33ff,
            },
          ],
        })
      }
    }

    try {
      await query('brains', async (results) => {
        const data = await client.getTokenSnapshot({
          where: {
            collection: '0x6325439389e0797ab35752b4f43a14c004f22a9c',
            staked: true,
            id_gt,
          },
        })

        count = 0

        data.tokens.forEach((token) => {
          id_gt = token.id

          token.owners.forEach((owner) => {
            results.push(owner.user.id)

            count++
          })
        })
      })

      await query('land', async (results) => {
        const data = await client.getTokenSnapshot({
          where: {
            collection: '0xd666d1cc3102cd03e07794a61e5f4333b4239f53',
            id_gt,
          },
        })

        count = 0

        data.tokens.forEach((token) => {
          id_gt = token.id

          token.owners.forEach((owner) => {
            results.push(owner.user.id)

            count++
          })
        })
      })

      await query('cars', async (results) => {
        const data = await client.getTokenSnapshot({
          where: {
            collection: '0xb16966dad2b5a5282b99846b23dcdf8c47b6132c',
            id_gt,
          },
        })

        count = 0

        data.tokens.forEach((token) => {
          id_gt = token.id

          token.owners.forEach((owner) => {
            results.push(owner.user.id)

            count++
          })
        })
      })

      await query('bodies', async (results) => {
        const data = await client.getTokenSnapshot({
          where: {
            collection: '0x17dacad7975960833f374622fad08b90ed67d1b5',
            staked: true,
            id_gt,
          },
        })

        count = 0

        data.tokens.forEach((token) => {
          id_gt = token.id

          token.owners.forEach((owner) => {
            results.push(owner.user.id)

            count++
          })
        })
      })

      await query('rocket', async (results) => {
        const data = await client.getRocketSnapshot({
          where: { beforeDeadline: true, id_gt },
        })

        count = 0

        data.boardeds.forEach((boarded) => {
          id_gt = boarded.id

          boarded.token.owners.forEach((owner) => {
            results.push(owner.user.id)

            count++
          })
        })
      })

      await query('extra_life', async (results) => {
        const data = await client.getTokenSnapshot({
          where: {
            collection: '0x21e1969884d477afd2afd4ad668864a0eebd644c',
            id_gt,
          },
        })

        count = 0

        data.tokens.forEach((token) => {
          id_gt = token.id

          token.owners.forEach((owner) => {
            results.push(owner.user.id)

            count++
          })
        })
      })

      state.status = 'done'
    } catch (error) {
      console.log('!snapshot error:', error)

      await info.edit({
        embeds: [
          {
            title: 'Snapshot Status',
            description: 'Error fetching information.',
            color: 0xbb33ff,
          },
        ],
      })
    }
  }
}
