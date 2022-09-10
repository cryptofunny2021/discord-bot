import { NotBot } from '@discordx/utilities'
import { ButtonInteraction, GuildMemberRoleManager } from 'discord.js'
import { ButtonComponent, Discord, Guard } from 'discordx'

import { InChannel } from '../lib/guards.js'

@Discord()
export class LetMeIn {
  @ButtonComponent({ id: 'let-me-in-btn' })
  @Guard(NotBot, InChannel('931630282581344266'))
  async letmein(interaction: ButtonInteraction) {
    const guild = interaction.guild

    try {
      // Pull roles into cache
      await guild?.roles.fetch()

      // Enjooooyor role
      const role = guild?.roles.cache.find(
        (role) => role.id === '931629584112295997'
      )

      if (role) {
        // Add it
        const roles = interaction.member?.roles

        if (roles instanceof GuildMemberRoleManager) {
          roles.add(role)
        }
      }

      await interaction.reply({ content: 'Welcome.', ephemeral: true })
    } catch (error) {
      console.log('let-me-in-btn Error:', error)
    }
  }
}
