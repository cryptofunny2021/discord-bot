import { proxy, snapshot } from 'valtio/vanilla'

import coingecko from './coingecko.js'
import dexscreener from './dexscreener.js'
import { round } from './helpers.js'
import magic from './magic.js'
import pairs from './pairs.js'

const state = proxy({
  change24h: '',
  lastBuyPrice: '',
  pairId: '',
  price: '',
  timestamp: 0,
  tokenId: '',
})

async function fetch() {
  try {
    const pair = snapshot(pairs).pairs.find(
      (pair) => pair.name === 'MAGIC-ANIMA'
    )
    const { priceRaw } = snapshot(magic)

    if (!pair) {
      return
    }

    state.pairId = pair.id
    state.tokenId = pair.token1.id

    const info = snapshot(dexscreener).tokens.find(
      (info) => info.id.toLowerCase() === pair.id.toLowerCase()
    )

    if (info) {
      state.lastBuyPrice = info.priceUsd
    }

    const data = snapshot(coingecko).tokens.find(
      (item) => item.id.toLowerCase() === state.tokenId.toLowerCase()
    )

    if (data) {
      state.change24h = data.change24h
    }

    state.price = round(parseFloat(pair.token1.derivedETH) * priceRaw)
    state.timestamp = Date.now()
  } catch (error) {
    if (error instanceof Error) {
      console.log(`Error fetching ANIMA price\n${error.stack}`)
    }
  }
}

const { timestamp } = snapshot(state)

// Refresh every 5 seconds
if (timestamp === 0) {
  fetch()
  setInterval(fetch, 5_000)
}

export default state
