import { TextChannel } from 'discord.js'
import { Discord, SimpleCommand, SimpleCommandMessage } from 'discordx'

import client from '../lib/client.js'
import * as server from '../lib/server.js'
import * as user from '../lib/user.js'

function getRandom(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min)
}

@Discord()
export class WL {
  @SimpleCommand()
  async wl(command: SimpleCommandMessage) {
    if (!server.isEnjoyor(command.message.guildId)) {
      return
    }

    if (!user.isAdmin(command.message.member?.user.id)) {
      return
    }

    // Only in admin-bot-spam channel
    if (command.message.channelId !== '925856832625442906') {
      return
    }

    try {
      const answer = getRandom(1, 9)
      const max = getRandom(50, 101)

      await command.message.channel.send({
        embeds: [
          {
            title: 'Whitelist Status',
            color: 0xcceedd,
            fields: [
              { inline: true, name: 'Max Spots', value: `${max}` },
              { inline: true, name: 'Number', value: `${answer}` },
            ],
          },
        ],
      })

      // Reactions channel
      const channel = client.channels.cache.get(
        '925877130762539058'
      ) as TextChannel

      const message = await channel?.send({
        embeds: [
          {
            title: 'Choose 1 through 8.',
            description:
              'Choose wisely as your first choice, is your only choice.',
            color: 0xcceedd,
          },
        ],
      })

      const choices = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣']

      const first = new Map<string, string>()

      const collector = message.createReactionCollector({
        filter: (reaction, user) =>
          choices[answer - 1] === reaction.emoji.name &&
          !user.bot &&
          user.id !== message.author.id &&
          !first.has(user.id),
        max,
        time: 60_000,
      })

      const all = message.createReactionCollector({
        filter: (_, user) => !user.bot && user.id !== message.author.id,
      })

      // Keep track of the first choice
      all.on('collect', (reaction, user) => {
        if (!first.has(user.id)) {
          first.set(user.id, `${reaction.emoji.name}`)
        }
      })

      for await (const choice of choices) {
        await message.react(choice)
      }

      if (!collector.checkEnd()) {
        await new Promise((resolve) => collector.on('end', resolve))
      }

      all.stop()

      const [users] = message.reactions.cache
        .map((reaction) => reaction.users.cache.filter((user) => !user.bot))
        .flat()

      if (users.size > 0) {
        try {
          await message.edit({
            embeds: [
              {
                title: 'Choose 1 through 8.',
                description:
                  'Choose wisely as your first choice, is your only choice.',
                color: 0xcceedd,
                fields: [
                  { name: 'Correct Number', value: choices[answer - 1] },
                  {
                    name: 'Winners',
                    value: users.map((user) => user.username).join(', '),
                  },
                ],
              },
            ],
          })
        } catch (error) {
          console.log('Error editing embed:', error)
        }
      }

      // Add `Next` role
      const role = command.message.guild?.roles.cache.find(
        (role) => role.id === '925836438648533072'
      )

      for await (const [userId] of users) {
        const member = command.message.guild?.members.cache.find(
          (member) => member.user.id === userId
        )

        if (role) {
          await member?.roles.add(role)
        }
      }
    } catch (error) {
      console.log('!wl Error: ', error)
    }
  }
}
