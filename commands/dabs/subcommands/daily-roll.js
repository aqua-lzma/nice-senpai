/**
 * @module template-action Response generator for template command
 */
import { Client } from 'discord.js'
import '../../../typedefs.js'

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

}

function rolls_to_string(rolls) {
    text_out = ""
    for (let item of rolls) {
        text_out += item[0]
            .split("0").join(":zero:") .split("1").join(":one:")
            .split("2").join(":two:")  .split("3").join(":three:")
            .split("4").join(":four:") .split("5").join(":five:")
            .split("6").join(":six:")  .split("7").join(":seven:")
            .split("8").join(":eight:").split("9").join(":nine:")
        text_out += " "
        text_out += [
            "",
            "*dubs*",
            "**trips**",
            "**QUADS**",
            "***QUINTUPLES***",
            "***S E X T U P L E S***",
            "**L E G E N D A R Y   R O L L**"
        ][item[1]]
        text_out += "\n"
    }
    return text_out
}

let oldStuff = {
    title: "Daily roll",
    desc: "Claim your daily rolls and win dabs if you roll dubs.\n" +
          "```\n" +
          "singles    : 1      dab\n" +
          "doubles    : 22     dabs\n" +
          "triples    : 333    dabs\n" +
          "quadruples : 5555   dabs\n" +
          "quintuples : 77777  dabs\n" +
          "sextuples  : 999999 dabs\n" +
          "```\n" +
          "Your level increases overall winnings.\n" +
          "*Try not to drool over yourself.* 🤤",
    alias: ["dailyroll", "droll", "drool", "dr"],
    syntax: "`{prefix}droll` roll once.\n" +
            "`{prefix}droll <number>` roll number amount of times.\n" +
            "`{prefix}drool all` roll all you can and get it over with.\n",
    owner_only: false,
    affect_config: true,
    action: function(message, config) {
        user = update_dabs(message.author, config)

        content = message.content.toLowerCase().split(" ")
        amount = 1
        // Decoding input
        if (content.length >= 2) {
            if (content[1] === "all")
                amount = user.daily_rolls
            else
                amount = Number(content[1])
        }
        if (content[1] === "all" && amount === 0)
            return message.channel.send("No dabs left, try tomorrow.")
        if (amount > user.daily_rolls)
            return message.channel.send("Not enough rolls left.")
        if (amount === NaN || Math.floor(amount) != amount || amount <= 0)
            return message.channel.send("Invalid input.")
        user.daily_rolls -= amount

        // Do rolls
        full_rolls = []
        win_dict = { "0": 0, "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0 }
        for (i=0; i<amount; i++) {
            num = Math.floor(Math.random() * 1000001)
            if (num === 0 || num === 1000000) {
                full_rolls.push([num.toString(), 6])
                continue
            }
            roll = ("000000" + num).slice(-6)
            win = 0
            for (c=5; c>0; c--) {
                if (roll[c] === roll[c-1]) win += 1
                else break
            }
            full_rolls.push([roll, win])
            win_dict[String(win)] += 1
        }

        // Filter until fits in message
        filter = 0
        filtered = full_rolls.slice()
        text_out = rolls_to_string(filtered)
        while (text_out.length >= 1300) {
            filter += 1
            if (filter > 6) {
                text_out = "Something went wrong."
                break
            }
            filtered = full_rolls.filter(item => item[1] >= filter)
            text_out = rolls_to_string(filtered)
        }

        winnings = 0
        for (let roll of full_rolls) {
            winnings += [1,22,333,5555,77777,999999][roll[1]]
        }
        winnings = Math.floor(
            winnings *
            (Math.floor(5 * (Math.log(user.level) / Math.log(2.5))) + 1)
        )
        user.dabs += winnings

        embed = {
            author: { name:"Daily rolls" },
            description: text_out,
            fields: []
        }
        if (filter > 0) {
            strings = ["Singles", "Doubles", "Triples", "Quadruples", "Quintuples", "Sextuples"]
            totals = ""
            for (let key in win_dict) {
                val = win_dict[key]
                if (val == 0) continue
                totals += strings[key]
                totals += ": " + String(val) + "\n"
            }
            totals += `*Only showing rolls above ${strings[filter].toLowerCase()}*`
            embed.fields.push({ name: "Overview:", value: totals })
        }
        embed.fields.push({ name: "Total dabs won:", value: String(winnings) })
        message.guild.fetchMember(message.author)
        .then(guildMember => {
            embed.author.icon_url = guildMember.user.avatarURL
            embed.color = guildMember.displayColor
            message.channel.send("", {embed: embed})
        })
    }
}
