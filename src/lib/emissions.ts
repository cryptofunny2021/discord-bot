import { gotScraping } from 'got-scraping'
import { GraphQLClient } from 'graphql-request'
import { proxy, snapshot } from 'valtio/vanilla'

import { getSdk } from '../../generated/hasura.graphql.js'
import { pluralize } from './helpers.js'

const state = proxy({
  data: [] as Array<Record<'name' | 'value', string>>,
  timestamp: 0,
})

const client = getSdk(
  new GraphQLClient(`${process.env.HASURA_URL}`, {
    headers: {
      'x-hasura-admin-secret': `${process.env.HASURA_API_KEY}`,
    },
  })
)

const percent = Intl.NumberFormat('en-US', {
  maximumFractionDigits: 2,
  style: 'percent',
})

async function fetch() {
  try {
    const data = await gotScraping('https://api.treasure.lol/mines').json<
      Array<{
        address: string
        name: string
        emissionsShare: number
        emissionsPerSecond: number
      }>
    >()

    const extractors = await client.getHarvesterExtractorBoosts()
    const boosts = extractors.harvester_extractor_active.reduce<
      Record<string, { boost: number; staked: number }>
    >((acc, item) => {
      if (!item.name || !item.boost) {
        return acc
      }

      acc[item.name] ??= { boost: 0, staked: 0 }
      acc[item.name].boost += item.boost
      acc[item.name].staked++

      return acc
    }, {})

    state.data = data
      .map((item) => {
        if (item.address === '0xa0a89db1c899c49f98e6326b764bafcf167fc2ce') {
          return { ...item, name: 'Atlas Void' }
        }

        return item
      })
      .filter((item) => Boolean(item.name))
      .map((item) => {
        const boost = boosts[item.name]

        return {
          name: item.name,
          value: [
            `${percent.format(item.emissionsShare)} for ${Math.round(
              item.emissionsPerSecond * 86_400
            ).toLocaleString()} MAGIC/day`,
            boost
              ? `${boost.staked} extractor${pluralize(boost.staked)} for ${
                  boost.boost
                }%`
              : null,
          ]
            .filter(Boolean)
            .join('\n'),
        }
      })

    state.timestamp = Date.now()
  } catch (error) {
    if (error instanceof Error) {
      console.log(`Error fetching emissions\n${error.stack}`)
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
