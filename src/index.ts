import { dirname, importx } from '@discordx/importer'
import { Events, Interaction, Message } from 'discord.js'
import 'dotenv/config'
import 'reflect-metadata'
import { snapshot, subscribe } from 'valtio/vanilla'

import client from './lib/client.js'
import { croak } from './lib/croak.js'
import * as extractors from './lib/extractors.js'
import { message } from './lib/letmein-message.js'
import magic from './lib/magic.js'
import * as toadstoolz from './lib/toadstoolz.js'

process.on('uncaughtException', (error) => {
  console.log(`Caught exception: ${error}`)
})

client.once(Events.ClientReady, async () => {
  await client.initApplicationCommands()

  message()

  subscribe(magic, () => {
    const { price } = snapshot(magic)

    client.user?.setPresence({
      activities: [{ name: `$MAGIC: ${price}`, type: 3 }],
    })
  })

  extractors.listen()
  toadstoolz.listen()

  console.log('~> Bot started!')
})

client.on(Events.InteractionCreate, (interaction: Interaction) => {
  client.executeInteraction(interaction)
})

client.on(Events.MessageCreate, (message: Message) => {
  client.executeCommand(message)

  croak(message)
})

async function run() {
  await importx(
    dirname(import.meta.url) + '/{commands,interactions}/**/*.{js,ts}'
  )

  if (!process.env.BOT_TOKEN) {
    throw Error('Could not find BOT_TOKEN in your environment')
  }

  client.login(process.env.BOT_TOKEN)
}

run()
