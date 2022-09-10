import { formatDistanceToNow } from 'date-fns'
import { Discord, SimpleCommand, SimpleCommandMessage } from 'discordx'

const now = Date.now()

@Discord()
export class Uptime {
  @SimpleCommand()
  async uptime(command: SimpleCommandMessage) {
    try {
      await command.message.channel.send({
        embeds: [
          {
            title: 'Uptime',
            description: formatDistanceToNow(now),
            color: 0x663399,
          },
        ],
      })
    } catch (error) {
      console.log('!uptime Error: ', error)
    }
  }
}
