import { Discord, SimpleCommand, SimpleCommandMessage } from 'discordx'
import { BigNumber } from 'ethers'

import { gym, school, smolbodies, smolbrains } from '../lib/contracts.js'
import * as server from '../lib/server.js'

const percent = Intl.NumberFormat('en-US', {
  maximumFractionDigits: 2,
  style: 'percent',
})

async function smolbodiesStaked() {
  const total: BigNumber = await smolbodies.totalSupply()
  const staked: BigNumber = await gym.smolBodiesSupply()

  return percent.format(staked.toNumber() / total.toNumber())
}

async function smolbrainsStaked() {
  const total: BigNumber = await smolbrains.totalSupply()
  const staked: BigNumber = await school.smolBrainSupply()

  return percent.format(staked.toNumber() / total.toNumber())
}

@Discord()
export class Staked {
  @SimpleCommand()
  async staked(command: SimpleCommandMessage) {
    if (
      ![server.isSmolBodies, server.isSmolBrains].some((check) =>
        check(command.message.guildId)
      )
    ) {
      return
    }

    const message = command.message
    const [, argument] = message.content.split(' ')

    await message.channel.sendTyping()

    try {
      const fields = await Promise.all(
        [
          ['Smol Bodies', smolbodiesStaked] as const,
          ['Smol Brains', smolbrainsStaked] as const,
        ]
          .filter(([item]) => {
            switch (argument) {
              case 'all':
              case 'both':
                return true
              case 'bodies':
                return item === 'Smol Bodies'
              case 'brains':
                return item === 'Smol Brains'
              default: {
                const isSmolBodiesServer = server.isSmolBodies(
                  message.guild?.id
                )
                const isSmolBrainsServer = server.isSmolBrains(
                  message.guild?.id
                )

                return (
                  (item === 'Smol Bodies' && isSmolBodiesServer) ||
                  (item === 'Smol Brains' && isSmolBrainsServer)
                )
              }
            }
          })
          .map(async ([name, value]) => ({
            inline: true,
            name,
            value: await value(),
          }))
      )

      command.message.channel.send({
        embeds: [
          {
            title: 'Staking Stats',
            description: '',
            color: 0x7e22ce,
            fields,
          },
        ],
      })
    } catch (error) {
      console.log(error)

      await command.message.channel.send('Error fetching information.')
    }
  }
}
