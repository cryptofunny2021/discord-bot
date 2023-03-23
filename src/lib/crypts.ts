import { GraphQLClient } from 'graphql-request'
import { proxy, snapshot } from 'valtio/vanilla'

import { getSdk } from '../../generated/hasura.graphql.js'

const state = proxy({
  data: [] as Array<Record<'name' | 'value', string>>,
  timestamp: 0,
})

const hasura = getSdk(
  new GraphQLClient(`${process.env.HASURA_URL}`, {
    headers: {
      'x-hasura-admin-secret': `${process.env.HASURA_API_KEY}`,
    },
  })
)

async function fetch() {
  try {
    const data = await hasura.getCurrentCorruptionCrypt()
    const crypt = data.corruption_crypt.at(0)

    if (!crypt) {
      return
    }

    const { needed, round, reached, start_timestamp } = crypt

    state.data = [
      ['Round', `${round}`],
      ['Started', `<t:${new Date(start_timestamp).getTime() / 1000}:R>`],
      ['Reached', `${reached}/${needed}`],
    ].map(([name, value]) => ({
      name,
      inline: true,
      value,
    }))

    state.timestamp = Date.now()
  } catch (error) {
    if (error instanceof Error) {
      console.log(`Error fetching crypts\n${error.stack}`)
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
