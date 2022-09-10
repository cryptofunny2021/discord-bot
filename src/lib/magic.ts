import { formatDistanceToNowStrict, parseISO } from 'date-fns'
import { gotScraping } from 'got-scraping'
import { proxy, snapshot } from 'valtio/vanilla'

import { queue } from './queue.js'

type USD<T> = { usd: T }

const state = proxy({
  ath: '',
  ath_date: '',
  change24h: '',
  high_24h: '',
  low_24h: '',
  price: '',
  timestamp: 0,
})

const round = Intl.NumberFormat('en-US', {
  currency: 'USD',
  maximumFractionDigits: 5,
  style: 'currency',
})

async function fetch() {
  queue.add(async () => {
    try {
      const {
        tradingHistory: [info],
      } = await gotScraping(
        'https://io.dexscreener.com/u/trading-history/recent/arbitrum/0xB7E50106A5bd3Cf21AF210A755F9C8740890A8c9'
      ).json<{
        tradingHistory: Array<{
          blockNumber: number
          blockTimestamp: number
          txnHash: string
          logIndex: number
          type: 'buy' | 'sell'
          priceUsd: string
          volumeUsd: string
          amount0: string
          amount1: string
        }>
      }>()

      state.price = `$${info.priceUsd}`

      const { market_data: data } = await gotScraping(
        'https://api.coingecko.com/api/v3/coins/arbitrum-one/contract/0x539bde0d7dbd336b79148aa742883198bbf60342'
      ).json<{
        market_data: {
          ath: USD<number>
          ath_date: USD<string>
          low_24h: USD<number>
          high_24h: USD<number>
          price_change_percentage_24h: number
        }
      }>()

      state.ath = round.format(data.ath.usd)
      state.ath_date = formatDistanceToNowStrict(parseISO(data.ath_date.usd), {
        addSuffix: true,
      })
      state.high_24h = round.format(data.high_24h.usd)
      state.low_24h = round.format(data.low_24h.usd)
      state.change24h = `${data.price_change_percentage_24h.toPrecision(3)}%`

      state.timestamp = Date.now()
    } catch (error) {
      if (error instanceof Error) {
        console.log(`Error fetching MAGIC price\n${error.stack}`)
      }
    }
  })
}

const { timestamp } = snapshot(state)

// Refresh every 30 seconds
if (timestamp === 0) {
  fetch()
  setInterval(fetch, 30_000)
}

export default state
