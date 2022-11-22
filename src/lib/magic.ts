import { gotScraping } from 'got-scraping'
import { proxy, snapshot } from 'valtio/vanilla'

import coingecko from './coingecko.js'
import dexscreener from './dexscreener.js'
import { round } from './helpers.js'

const state = proxy({
  ath: '',
  ath_date: '',
  change24h: '',
  eth: 0,
  high_24h: '',
  lastBuyPrice: '',
  low_24h: '',
  pairId: '0xb7e50106a5bd3cf21af210a755f9c8740890a8c9',
  price: '',
  priceRaw: 0,
  timestamp: 0,
  tokenId: '0x539bde0d7dbd336b79148aa742883198bbf60342',
})

async function fetch() {
  console.log('~> Fetching MAGIC from Treasure')

  try {
    const { magicEth, magicUsd } = await gotScraping(
      'https://api.treasure.lol/magic/price'
    ).json<{
      ethUsd: number
      magicEth: number
      magicUsd: number
    }>()

    state.price = round(magicUsd)
    state.priceRaw = magicUsd
    state.eth = magicEth

    const info = snapshot(dexscreener).tokens.find(
      (info) => info.id.toLowerCase() === state.pairId
    )

    if (info) {
      state.lastBuyPrice = info.priceUsd
    }

    const data = snapshot(coingecko).tokens.find(
      (info) => info.id === state.tokenId
    )

    if (data) {
      state.ath = data.ath
      state.ath_date = data.ath_date
      state.high_24h = data.high_24h
      state.low_24h = data.low_24h
      state.change24h = data.change24h
    }

    state.timestamp = Date.now()
  } catch (error) {
    if (error instanceof Error) {
      console.log(`Error fetching MAGIC price\n${error.stack}`)
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
