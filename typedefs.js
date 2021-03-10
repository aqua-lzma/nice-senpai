// Up to date as of 2021-03-10

/**
 * [ApplicationCommand](https://discord.com/developers/docs/interactions/slash-commands#applicationcommand):
 * An application command is the base "command" model that belongs to an application. This is what you are creating when you `POST` a new command.
 * - A command, or each individual subcommand, can have a maximum of 10 options
 * @typedef {object} ApplicationCommand
 * @property {string?} id - Unique id of the command
 * @property {string?} application_id - Unique id of the parent application
 * @property {string} name - 1-32 character name matching `^[\w-]{1,32}$`
 * @property {string} description - 1-100 character description
 * @property {[ApplicationCommandOption]} [options] - The parameters for the command
*/

/**
 * [ApplicationCommandOption](https://discord.com/developers/docs/interactions/slash-commands#applicationcommandoption)
 * - You can specify a maximum of 10 `choices` per option
 * @typedef {object} ApplicationCommandOption
 * @property {number} type - value of [ApplicationCommandOptionType](https://discord.com/developers/docs/interactions/slash-commands#applicationcommandoptiontype)
 * @property {string} name - 1-32 character name matching `^[\w-]{1,32}$`
 * @property {string} description - 1-100 character description
 * @property {boolean} [required] - If the parameter is required or optional -- default `false`
 * @property {[ApplicationCommandOptionChoice]} [choices] - choices for `string` and `int` types for the user to pick from
 * @property {[ApplicationCommandOption]} [options] - If the option is a subcommand or subcommand group type, this nested options will be the parameters
 */

/**
 * [ApplicationCommandOptionChoice](https://discord.com/developers/docs/interactions/slash-commands#applicationcommandoptionchoice)
 * - If you specify `choices` for an option, they are the only valid values for a user to pick
 * @typedef {object} ApplicationCommandOptionChoice
 * @property {string} name - 1-100 character choice name
 * @property {string | number} value - Value of the choice, up to 100 characters if string
 */

/**
 * [User Object](https://discord.com/developers/docs/resources/user#user-object)
 * @typedef {object} User
 * @property {string} id - the user's id
 * @property {string} username - the user's username, not unique across the platform
 * @property {string} discriminator - the user's 4-digit discord-tag
 * @property {string?} avatar - the user's [avatar hash](https://discord.com/developers/docs/reference#image-formatting)
 * @property {boolean} [bot] - whether the user belongs to an OAuth2 application
 * @property {boolean} [system] - whether the user is an Official Discord System user (part of the urgent message system)
 * @property {boolean} [mfa_enabled] - whether the user has two factor enabled on their account
 * @property {string} [locale] - the user's chosen language option
 * @property {boolean} [verified] - whether the email on this account has been verified
 * @property {string?} [email] - the user's email
 * @property {integer} [flags] - the [flags](https://discord.com/developers/docs/resources/user#user-object-user-flags) on a user's account
 * @property {number} [premium_type] - the [type of Nitro subscription](https://discord.com/developers/docs/resources/user#user-object-premium-types) on a user's account
 * @property {number} [public_flags] - the public [flags](https://discord.com/developers/docs/resources/user#user-object-user-flags) on a user's account
 */

/**
 * [Guild Member Object](https://discord.com/developers/docs/resources/guild#guild-member-object)
 * - The field `user` won't be included in the member object attached to `MESSAGE_CREATE` and `MESSAGE_UPDATE` gateway events.
 * - In `GUILD_` events, `pending` will always be included as true or false. In non `GUILD_` events which can only be triggered by non-`pending` users, `pending` will not be included.
 * @typedef {object} GuildMember
 * @property {User} [user] - the user this guild member represents
 * @property {string?} [nick] - this users guild nickname
 * @property {[string]} roles - array of [role](https://discord.com/developers/docs/topics/permissions#role-object) object ids
 * @property {string} joined_at - ISO8601 timestamp when the user joined the guild
 * @property {string?} [premium_since] - ISO8601 timestamp when the user started [boosting](https://support.discord.com/hc/en-us/articles/360028038352-Server-Boosting-) the guild
 * @property {boolean} deaf - whether the user is deafened in voice channels
 * @property {boolean} mute - whether the user is muted in voice channels
 * @property {boolean} [pending] - whether the user has not yet passed the guild's [Membership Screening](https://discord.com/developers/docs/resources/guild#membership-screening-object) requirements
 * @property {string} [permissions] - total permissions of the member in the channel, including overrides, returned when in the interaction object
 */

/**
 * [Interaction](https://discord.com/developers/docs/interactions/slash-commands#interaction):
 * An interaction is the base "thing" that is sent when a user invokes a command, and is the same for Slash Commands and other future interaction types.
 * @typedef {object} Interaction
 * @property {string} id - ID of the interaction
 * @property {number} type - The [type](https://discord.com/developers/docs/interactions/slash-commands#interaction-interactiontype) of interaction
 * - Ping: `1`
 * - ApplicationCommand: `2`
 * @property {ApplicationCommandInteractionData} [data] - The command data payload
 * - This is always present on `ApplicationCommand` interaction types. It is optional for future-proofing against new interaction types
 * @property {string} guild_id - The guild it was sent from
 * @property {string} channel_id - The channel it was sent from
 * @property {GuildMember} [member] - Guild member data for the invoking user, including permissions
 * - Member is sent when the command is invoked in a guild, and `user` is sent when invoked in a DM
 * @property {User} [user] - User object for the invoking user, if invoked in a DM
 * @property {string} token - A continuation token for responding to the interaction
 * @property {number} version - Read-only property, always `1`
 */

/**
 * [ApplicationCommandInteractionData](https://discord.com/developers/docs/interactions/slash-commands#interaction-applicationcommandinteractiondata)
 * @typedef {object} ApplicationCommandInteractionData
 * @property {string} id - The ID of the invoked command
 * @property {string} name - The name of the invoked command
 * @property {[ApplicationCommandInteractionDataOption]} [options] The params + values from the user
 */

/**
 * [ApplicationCommandInteractionDataOption](https://discord.com/developers/docs/interactions/slash-commands#interaction-applicationcommandinteractiondataoption):
 * All options have names, and an option can either be a parameter and input value--in which case `value` will be set--or it can denote a subcommand or group--in which case it will contain a top-level key and another array of `options`.
 * - `value` and `options` are mutually exclusive.
 * @typedef {object} ApplicationCommandInteractionDataOption
 * @property {string} name - The name of the parameter
 * @property {string | number | boolean} [value] - The `ApplicationCommandOptionType` value of the pair
 * @property {[ApplicationCommandInteractionDataOption]} [options] - Present if this option is a group or subcommand
 */

/**
 * [InteractionResponse](https://discord.com/developers/docs/interactions/slash-commands#interaction-response):
 * After receiving an interaction, you must respond to acknowledge it. You can choose to respond with a message immediately using type `4`, or you can choose to send a deferred response with type `5`. If choosing a deferred response, the user will see a loading state for the interaction, and you'll have up to 15 minutes to edit the original deferred response using [Edit Original Interaction Response](https://discord.com/developers/docs/interactions/slash-commands#edit-original-interaction-response).
 * - A defered response tells the user "Bot name is thinking"
 * - Interaction responses can also be public—everyone can see it—or "ephemeral"—only the invoking user can see it. That is determined by setting flags to 64 on the [InteractionApplicationCommandCallbackData](https://discord.com/developers/docs/interactions/slash-commands#InteractionApplicationCommandCallbackData).
 * - Interaction response types `2` and `3` have been deprecated
 * @typedef {object} InteractionResponse
 * @property {number} type - the [type](https://discord.com/developers/docs/interactions/slash-commands#interaction-response-interactionresponsetype) of response
 * @property {InteractionApplicationCommandCallbackData} [data] - an optional response message
 */

/**
 * [InteractionApplicationCommandCallbackData](https://discord.com/developers/docs/interactions/slash-commands#interaction-response-interactionapplicationcommandcallbackdata)
 * - Not all message fields are currently supported
 * @typedef {object} InteractionApplicationCommandCallbackData
 * @property {boolean} [tts] - Is the response TTS
 * @property {string} [content] - Message content
 * @property {[object]} [embeds] - Supports up to 10 [embeds](https://discord.com/developers/docs/resources/channel#embed-object)
 * @property {object} [allowed_mentions] - [Allowed mentions](https://discord.com/developers/docs/resources/channel#allowed-mentions-object) object
 * @property {number} [flags] - Set to `64` to make your response ephemeral
 */
