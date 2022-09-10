import { formatDistanceToNow } from 'date-fns'
import { Discord, SimpleCommand, SimpleCommandMessage } from 'discordx'
import { BigNumber, ethers } from 'ethers'
import { GraphQLClient } from 'graphql-request'

import { getSdk } from '../../generated/marketplace.graphql.js'
import * as school from '../abis/school.js'
import * as smolbrain from '../abis/smolbrain.js'

const percent = Intl.NumberFormat('en-US', {
  maximumFractionDigits: 2,
  style: 'percent',
})

const round = Intl.NumberFormat('en-US', {
  maximumFractionDigits: 2,
})

const client = getSdk(new GraphQLClient(`${process.env.MARKETPLACE_URL}`))

const provider = new ethers.providers.JsonRpcProvider(
  'https://arb-mainnet.g.alchemy.com/v2/koj2zAjEWZz5nhLYsdQEEls8UZCEpPRd'
)

const contract = new ethers.Contract(
  '0x6325439389e0797ab35752b4f43a14c004f22a9c',
  smolbrain.abi,
  provider
)

const contract2 = new ethers.Contract(
  '0x602e50ed10a90d324b35930ec0f8e5d3b28cd509',
  school.abi,
  provider
)

const shorten = (value: string = '') =>
  `${value.slice(0, 6)}...${value.slice(-4)}`

@Discord()
export class Smol {
  @SimpleCommand()
  async smol(command: SimpleCommandMessage) {
    // Disabled everywhere for now
    if (1 + 1 === 2) {
      return
    }

    const message = command.message
    const channel = message.guild?.channels.resolve(message.channelId)

    if (!channel?.name.includes('bot-spam')) {
      return
    }

    const tokenId = message.content.replace(/[^\d]+/, '')

    if (!tokenId) {
      return
    }

    await message.channel.sendTyping()

    try {
      const smol = await client.GetSmolDetails({ tokenId })

      // @ts-ignore
      // const { network, deployments } = hre;
      // const { deploy, read, execute } = deployments;
      // const { deployer } = await getNamedAccounts();

      // const brain: BigInt = await read("SmolBrain", "brainz", tokenId);
      // const earned: BigInt = await read("School", "iqEarned", tokenId);

      const brain: BigNumber = await contract.brainz(tokenId)
      const earned: BigNumber = await contract2.iqEarned(tokenId)

      if (!smol.collection) {
        throw new Error('No collection')
      }

      const [token] = smol.collection.tokens

      // const rank = {
      //   name: "Rank",
      //   value: `${
      //     token.rank
      //   } out of ${smol.collection.last[0].rank?.toLocaleString()}\n\u200b`,
      // };

      const attributes =
        token.metadata?.attributes?.map(
          ({ attribute: { name, percentage, value } }) => ({
            inline: true,
            name,
            value:
              name === 'IQ'
                ? round.format(
                    Number(ethers.utils.formatUnits(brain.add(earned)))
                  )
                : `${value[0].toUpperCase()}${value.slice(1)} (${percent.format(
                    percentage
                  )})`,
          })
        ) ?? []

      const owner = {
        inline: true,
        name: '\n\u200b\nOwner',
        value: shorten(token.owner?.id),
      }

      const [listing] = token.listings ?? []

      const listings = listing
        ? [
            {
              inline: true,
              name: '\n\u200b\nListed',
              value: `${(listing.pricePerItem / 1e18).toLocaleString()} $MAGIC`,
            },
            {
              inline: true,
              name: '\n\u200b\nExpires',
              value: formatDistanceToNow(Number(listing.expires)),
            },
          ]
        : [
            { inline: true, name: '\n\u200b\nListed', value: 'No' },
            { inline: true, name: '\n\u200b\n', value: '\u200b' },
          ]

      command.message.channel.send({
        embeds: [
          {
            title: `Smol Brains #${tokenId}\n\u200b`,
            description: '',
            url: `https://marketplace.treasure.lol/collection/${smol.collection.id}/${token.tokenId}`,
            color: 0x7e22ce,
            fields: [...attributes, owner, ...listings],
            image: {
              url:
                token.metadata?.image.replace(
                  'ipfs://',
                  'https://treasure-marketplace.mypinata.cloud/ipfs/'
                ) ?? '',
              height: 0,
              width: 0,
            },
          },
        ],
      })
    } catch (error) {
      console.log(error)

      await command.message.channel.send('Error fetching information.')
    }
  }
}
