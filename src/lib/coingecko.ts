import { formatDistanceToNowStrict, parseISO } from 'date-fns'
import { gotScraping } from 'got-scraping'
import { proxy, snapshot } from 'valtio/vanilla'

import { round } from './helpers.js'
import pairsState from './pairs.js'
import { queue } from './queue.js'

type USD<T> = { usd: T }

const state = proxy<{
  tokens: Array<{
    id: string
    ath: string
    ath_date: string
    change24h: string
    high_24h: string
    low_24h: string
  }>
  timestamp: number
}>({
  tokens: [],
  timestamp: 0,
})

async function fetch() {
  queue.add(async () => {
    try {
      const { pairs } = snapshot(pairsState)

      const tokens = pairs
        .map((pair) => [pair.token0.id, pair.token1.id])
        .flat()
        .filter((token, index, tokens) => tokens.indexOf(token) === index)

      queue.add(async () => {
        state.tokens = await Promise.all(
          tokens.map(async (id) => {
            console.log('~> Fetching CoinGecko for', id)

            const { market_data: data } = await gotScraping(
              `https://api.coingecko.com/api/v3/coins/arbitrum-one/contract/${id}`
            ).json<{
              market_data?: {
                ath: USD<number>
                ath_date: USD<string>
                low_24h: USD<number>
                high_24h: USD<number>
                price_change_percentage_24h: number
              }
            }>()

            if (!data) {
              return {
                id,
                ath: '',
                ath_date: '',
                high_24h: '',
                low_24h: '',
                change24h: '',
              }
            }

            return {
              id,
              ath: data.ath.usd ? round(data.ath.usd) : '',
              ath_date: data.ath_date.usd
                ? formatDistanceToNowStrict(parseISO(data.ath_date.usd), {
                    addSuffix: true,
                  })
                : '',
              high_24h: data.high_24h.usd ? round(data.high_24h.usd) : '',
              low_24h: data.low_24h.usd ? round(data.low_24h.usd) : '',
              change24h: data.price_change_percentage_24h
                ? `${data.price_change_percentage_24h.toPrecision(3)}%`
                : '',
            }
          })
        )

        state.timestamp = Date.now()
      })
    } catch (error) {
      if (error instanceof Error) {
        console.log(`Error fetching pairs\n${error.stack}`)
      }
    }
  })
}

const { timestamp } = snapshot(state)

// Refresh every 15 seconds
if (timestamp === 0) {
  fetch()
  setInterval(fetch, 15_000)
}

export default state
