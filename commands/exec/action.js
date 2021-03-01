/**
 * @module template-action Response generator for `template` command
 */
// eslint-disable-next-line no-unused-vars
import { Client } from 'discord.js'
import '../../typedefs.js'

/**
 * Enum for InteractionResponseType values.
 * @readonly
 * @enum {number}
 */
const CommandOptionType = {
  Pong: 1, // ACK a Ping
  Acknowledge: 2, // ACK a command without sending a message, eating the user's input
  ChannelMessage: 3, // respond with a message, eating the user's input
  ChannelMessageWithSource: 4, // respond with a message, showing the user's input
  AcknowledgeWithSource: 5 // ACK a command without sending a message, showing the user's input
}

/**
 * Respond to command trigger
 * @param {Client} client - bot client
 * @param {Interaction} interaction - interaction that triggered the command
 * @returns {InteractionResponse} interaction to send back
 */
export default async function (client, interaction) {
  return {
    type: CommandOptionType.AcknowledgeWithSource
  }
}

/*
const update_dabs = require("./_update_dabs.js")

function circularJSON(key, value) {
    if (typeof value === 'object' && value !== null) {
        if (cache.indexOf(value) !== -1) {
            return;
        }
        cache.push(value);
    }
    return value;
}

module.exports = {
    title: "Evaluate",
    desc: "Evaluate JS code. **OWNER ONLY**",
    alias: ["eval", "exec"],
    syntax: "`{prefix}eval code` where code is the JS cod you want to run.\n" +
            "`{prefix}eval ```[js] multiline code``` ` For multiline code. " +
            "[js] is optional for syntax highlighting.",
    owner_only: true,
    affect_config: true,
    action: function(message, config) {
        code = message.content.slice(6)
        if (code.startsWith("```") && code.endsWith("```")) {
            code = code.slice(0,-3)
            if (code.startsWith("```js"))
                code = code.slice(5)
            else
                code = code.slice(3)
            code = code.trim()
        }
        try {
            output = eval(`(function() {
                output = ""
                function print() {
                    output += Array.prototype.slice.call(arguments, 0)
                    .map(item => {
                        if (item.toString() == "[object Object]") {
                            cache = []
                            return JSON.stringify(item, circularJSON)
                        }
                        return item.toString()
                    })
                }
                ${code};
                return output
            })()`)
            output = String(output).trim()
            if (output === "")
                message.channel.send("No output")
            else
                message.channel.send(output.split("\n").map(item => `\`${item}\``).join("\n"))
        }
        catch (e) {
            message.channel.send(e.toString())
        }
    }
}
*/
