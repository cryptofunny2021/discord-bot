import { format } from 'date-fns'
import { ChannelType } from 'discord.js'
import { gotScraping } from 'got-scraping'
import { GraphQLClient } from 'graphql-request'
import { proxy, snapshot } from 'valtio/vanilla'

import { getSdk } from '../../generated/marketplace.graphql.js'
import client from './client.js'
import { round } from './helpers.js'
import magic from './magic.js'
import * as server from './server.js'

const sdk = getSdk(new GraphQLClient(`${process.env.MARKETPLACE_URL}`))

const state = proxy({
  listing: '',
})

async function fetch() {
  try {
    const { sales } = await sdk.getLatestSales({
      collection: '0x09cae384c6626102abe47ff50588a1dbe8432174',
    })
    const { eth, priceRaw } = snapshot(magic)

    const { listing } = snapshot(state)
    const [{ id }] = sales

    state.listing = id

    // First run, now we have a starting listing
    if (listing === '') {
      return
    }

    const index = sales.findIndex(sale => sale.id === listing)

    if (index < 1) {
      return
    }

    await client.guilds.fetch()

    const guild = client.guilds.cache.get(server.TOADSTOOLZ)

    // Sales bot channel
    const channel = guild?.channels.cache.get('978879710329184286')

    if (channel?.type === ChannelType.GuildText) {
      await channel.send({
        embeds: await Promise.all(
          sales.slice(0, index).map(async (sale) => {
            const magicPrice = sale.pricePerItem / 1e18
            const metadata = await gotScraping(
              `https://trove-api.treasure.lol/collection/arb/toadstoolz/${sale.token.tokenId}`
            ).json<{
              image: { height: number; uri: string; width: number }
              rarity: { rank: number }
            }>()

            return {
              title: `SOLD`,
              description: `Toadstoolz #${sale.token.tokenId} (Rarity Rank: **#${metadata.rarity.rank}**)`,
              color: 0xbefadb,
              fields: [
                {
                  inline: true,
                  name: 'MAGIC',
                  value: magicPrice.toLocaleString(),
                },
                {
                  inline: true,
                  name: 'USD',
                  value: round(magicPrice * priceRaw, 2),
                },
                {
                  inline: true,
                  name: 'ETH',
                  value: `Ξ${(magicPrice * eth).toLocaleString()}`,
                },
              ],
              image: {
                url: `https://res.cloudinary.com/treasure-trove/image/fetch/f_auto,w_320,h_320/${metadata.image.uri}`,
              },
              footer: {
                text: `Powered by Trove • ${format(
                  sale.timestamp * 1000,
                  'MM/dd/yyyy hh:mm aa'
                )}`,
                icon_url:
                  'https://treasure.lol/build/_assets/logomark-NIMHKTG3.png',
              },
            }
          })
        ),
      })
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log(`Error fetching Toadstoolz sales\n${error.stack}`)
    }
  }
}

export function listen() {
  fetch()

  // Refresh every 30 seconds
  setInterval(fetch, 30_000)
}
