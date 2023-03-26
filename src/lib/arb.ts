import { GraphQLClient } from 'graphql-request'
import { proxy, snapshot } from 'valtio/vanilla'

import { getSdk } from '../../generated/sushi.graphql.js'
import dexscreener from './dexscreener.js'
import { round } from './helpers.js'

const state = proxy({
  change24h: '',
  lastBuyPrice: '',
  pairId: '0xa8328bf492ba1b77ad6381b3f7567d942b000baf',
  price: '',
  timestamp: 0,
  tokenId: '',
})

const sushi = getSdk(new GraphQLClient(`${process.env.SUSHI_URL}`))

async function fetch() {
  try {
    const info = snapshot(dexscreener).tokens.find(
      (info) => info.id.toLowerCase() === state.pairId.toLowerCase()
    )

    if (info) {
      state.lastBuyPrice = round(Number(info.priceUsd.slice(1)))
    }

    const data = await sushi.getArbPrice()

    state.price = data.pair ? round(Number(data.pair.token1Price)) : ''

    state.timestamp = Date.now()
  } catch (error) {
    if (error instanceof Error) {
      console.log(`Error fetching ARB price\n${error.stack}`)
    }
  }
}

const { timestamp } = snapshot(state)

// Refresh every 30 seconds
if (timestamp === 0) {
  fetch()
  setInterval(fetch, 30_000)
}

export default state
