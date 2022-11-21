import { GraphQLClient } from 'graphql-request'
import { proxy, snapshot } from 'valtio/vanilla'

import { getSdk } from '../../generated/magicswap.graphql.js'

type Token = {
  derivedETH: string
  id: string
  name: string
}

const sdk = getSdk(new GraphQLClient(`${process.env.MAGICSWAP_URL}`))

const state = proxy<{
  pairs: Array<{
    id: string
    lastBuyPrice?: string
    name: string
    token0: Token
    token1: Token
  }>
  timestamp: number
}>({
  pairs: [],
  timestamp: 0,
})

async function fetch() {
  console.log('~> Fetching pairs from MagicSwap')

  try {
    const { pairs } = await sdk.getPairs()

    state.pairs = pairs
    state.timestamp = Date.now()
  } catch (error) {
    if (error instanceof Error) {
      console.log(`Error fetching pairs\n${error.stack}`)
    }
  }
}

const { timestamp } = snapshot(state)

// Refresh every 15 seconds
if (timestamp === 0) {
  fetch()
  setInterval(fetch, 15_000)
}

export default state
