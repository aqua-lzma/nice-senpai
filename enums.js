/**
 * Enum for [InteractionResponseType](https://discord.com/developers/docs/interactions/slash-commands#interaction-response-interactionresponsetype) values.
 * - `Pong` - ACK a Ping
 * - `Acknowledge` - **DEPRECATED** ACK a command without sending a message, eating the user's input
 * - `ChannelMessage` - **DEPRECATED** respond with a message, eating the user's input
 * - `ChannelMessageWithSource` - Respond to an interaction with a message
 * - `DeferredChannelMessageWithSource` - ACK an interaction and edit to a response later, the user sees a loading state
 * @readonly
 * @enum {number}
 */
export const InteractionResponseType = {
  Pong: 1,
  Acknowledge: 2,
  ChannelMessage: 3,
  ChannelMessageWithSource: 4,
  DeferredChannelMessageWithSource: 5
}

/**
 * Enum for [ApplicationCommandOptionType](https://discord.com/developers/docs/interactions/slash-commands#applicationcommandoptiontype) values.
 * @readonly
 * @enum {number}
 */
export const ApplicationCommandOptionType = {
  SUB_COMMAND: 1,
  SUB_COMMAND_GROUP: 2,
  STRING: 3,
  INTEGER: 4,
  BOOLEAN: 5,
  USER: 6,
  CHANNEL: 7,
  ROLE: 8
}
