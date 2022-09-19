import { ChannelType } from 'discord.js'
import { GraphQLClient } from 'graphql-request'
import { proxy, snapshot } from 'valtio/vanilla'

import { getSdk } from '../../generated/hasura.graphql.js'
import client from './client.js'
import { pluralize } from './helpers.js'
import * as server from './server.js'

const images: Record<string, string> = {
  Small:
    'https://djmahssgw62sw.cloudfront.net/arb/0xf3d00a2559d84de7ac093443bcaada5f4ee4165c/0x9d6eee7525f367f63d990b4eaaafb7944e03b13a31d164b622ed77be568f89b1/image.jpg',
  Medium:
    'https://djmahssgw62sw.cloudfront.net/arb/0xf3d00a2559d84de7ac093443bcaada5f4ee4165c/0xcc3168156020f3da4f95b1c8425d74750653ad027b7f667c2f910f0a4261405b/image.jpg',
  Large:
    'https://djmahssgw62sw.cloudfront.net/arb/0xf3d00a2559d84de7ac093443bcaada5f4ee4165c/0x5b60b96397c08eabe74933cf60e3ebe708b985dafab06e9d1b3aeb21d5dce2e4/image.jpg',
}

const state = proxy({
  blockNumber: 0,
})

const hasura = getSdk(
  new GraphQLClient(`${process.env.HASURA_URL}`, {
    headers: {
      'x-hasura-user-id': `${process.env.HASURA_API_KEY}`,
      'x-hasura-role': 'tressy',
    },
  })
)

async function fetch() {
  try {
    const { harvester_extractor: data } = await hasura.getHarvesterExtractors({
      blockNumber: state.blockNumber,
    })

    if (!data[0]) {
      return
    }

    const { blockNumber } = snapshot(state)
    const [{ size, ...item }] = data

    state.blockNumber = item.block_number

    // First run, now we have a starting block number
    if (blockNumber === 0) {
      return
    }

    // Group by Harvester, then build description of each
    const fields = data.reduce<Record<string, Record<string, number>>>(
      (acc, item) => {
        if (!item.name || !item.size || !item.staked) {
          throw new Error('No name')
        }

        acc[item.name] ??= {}
        acc[item.name][item.size] ??= 0
        acc[item.name][item.size] += item.staked

        return acc
      },
      {}
    )

    await client.guilds.fetch()

    const guild = client.guilds.cache.get(server.TREASURE)

    // Tressy
    const channel = guild?.channels.cache.get('1020605524028440676')

    if (channel?.type === ChannelType.GuildText) {
      await channel.send({
        embeds: [
          {
            title: `Extractor${pluralize(data.length)} Deployed`,
            description: '',
            color: 0xdd524d,
            fields: Object.entries(fields).map(([name, item]) => ({
              name,
              value: Object.entries(item)
                .sort(([, left], [, right]) => right - left)
                .map(
                  ([size, quantity]) =>
                    `${quantity} ${size} Extractor${pluralize(quantity)}`
                )
                .join(', '),
            })),
            thumbnail: {
              url: images[size ?? 'Small'],
              height: 64,
              width: 64,
            },
            footer: {
              text: 'Powered by Honeycomb',
              icon_url: 'https://i.postimg.cc/K8c8tX1D/honeycomb.png',
            },
          },
        ],
      })
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log(`Error fetching extractors\n${error.stack}`)
    }
  }
}

export function listen() {
  fetch()

  // Refresh every 30 seconds
  setInterval(fetch, 30_000)
}
