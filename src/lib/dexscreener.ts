import { gotScraping } from 'got-scraping'
import { proxy, snapshot } from 'valtio/vanilla'

import { round } from './helpers.js'
import pairsState from './pairs.js'
import { queue } from './queue.js'

const state = proxy<{
  tokens: Array<{
    id: string
    priceUsd: string
  }>
  timestamp: number
}>({
  tokens: [],
  timestamp: 0,
})

async function fetch() {
  try {
    const { pairs } = snapshot(pairsState)

    state.tokens = await Promise.all(
      [
        { id: '0xb7e50106a5bd3cf21af210a755f9c8740890a8c9', name: '' },
        ...pairs,
      ].map((pair) =>
        queue.add(async () => {
          console.log('~> Fetching DexScreener for', pair.id)

          try {
            const {
              logs: [info],
            } = await gotScraping(
              `https://io.dexscreener.com/dex/log/amm/uniswap/all/arbitrum/${pair.id}`
            ).json<{
              logs: Array<{
                amount0: string
                amount1: string
                blockNumber: number
                blockTimestamp: number
                logIndex: number
                logType: 'swap'
                maker: string
                priceUsd: string
                txnHash: string
                txnType: 'buy' | 'sell'
                volumeUsd: string
              }>
            }>()

            const priceUsd = pair.name.includes('GFLY')
              ? round(parseFloat(info.volumeUsd) / parseFloat(info.amount1))
              : round(parseFloat(info.priceUsd))

            return { id: pair.id, priceUsd }
          } catch (error) {
            if (error instanceof Error) {
              const message = error.message.includes(
                'Unexpected token < in JSON'
              )
                ? 'Invalid JSON (Likely access denied)'
                : error.stack

              console.log('~> Error from DexScreener', message)
            }

            return { id: pair.id, priceUsd: '' }
          }
        })
      )
    )

    state.timestamp = Date.now()
  } catch (error) {
    if (error instanceof Error) {
      console.log(`Error fetching DexScreener\n${error.stack}`)
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
