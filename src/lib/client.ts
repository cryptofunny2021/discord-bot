import { GatewayIntentBits, IntentsBitField } from 'discord.js'
import { Client } from 'discordx'

export default new Client({
  simpleCommand: {
    prefix: '!',
  },
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    IntentsBitField.Flags.MessageContent,
  ],
})
