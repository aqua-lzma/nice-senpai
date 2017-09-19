function update_dabs(message, config, amount) {
    user = config.users[message.author.id]
    if (user === undefined) {
        user = config.users[message.author.id] = {
            dabs: 100,
            dab_record: 100,
            level: 1,
            daily_rolls: 0,
            daily_claim: -1,
        }
    }
    if (user.daily_claim !== new Date().getDay()) {
        message.send("Your daily rolls reset!")
    }
}

function error_reply(message, config) {
    prefix = config.command_prefix
    if (config.server_prefix[message.guild.id])
        prefix = config.server_prefix[message.guild.id]
    message.channel.send(`Invalid syntax, get some \`${prefix}help\`.`)
}

module.exports = [
    {
        title: "Help",
        desc: "Display all commands or show more info about a specified one.",
        syntax: "`{prefix}help` to show this and a list of available commands.\n" +
                "`{prefix}help command` shows more information about specified command.",
        alias: ["help", "halp", "h", "imdumbplshelpme"],
        owner_only: false,
        affect_config: false,
        action: function(message, config) {
            prefix = config.command_prefix
            if (config.server_prefix[message.guild.id])
                prefix = config.server_prefix[message.guild.id]
            content = message.content.split(" ")
            content = (content.length === 1)?"help":content[1]
            for (let cmd of module.exports) {
                if (cmd.alias.indexOf(content) >= 0){
                    embed = {
                        title: cmd.title,
                        fields: [
                            {name: "Description", value: cmd.desc},
                            {name: "Aliases", value: `\`${prefix}${cmd.alias.join(`\`, \`${prefix}`)}\``}
                        ]
                    }
                    if (cmd.syntax)
                        embed.fields.push({name: "Syntax", value: cmd.syntax.split("{prefix}").join(prefix)})
                    if (content === "help") {
                        available = ""
                        for (let cmd2 of module.exports)
                            available += `\`${prefix}${cmd2.alias[0]}\` `
                        embed.fields.push({name: "Available commands", value: available})
                    }
                    message.channel.send("", {embed: embed})
                    return
                }
            }
            message.channel.send("Command not found")
        }
    },
    {
        title: "Roll",
        desc: "Roll a number between 0 and 100 inclusive. Announces dubs.",
        alias: ["roll", "r"],
        owner_only: false,
        affect_config: false,
        action: function(message, config) {
            number = Math.floor(Math.random() * 101).toString().padStart(2, "0")
            out = `You rolled ${number}`
            out += (number.substr(-2, 1) === number.substr(-1))?"\nNice dubs!":""
            message.channel.send(out)
        }
    },
    {
        title: "Bet roll",
        desc: "Bet dabs on a roll between 0 and 100 inclusive." +
              "```0-65  : No money back\n" +
                 "66-89 : Double what you bet\n" +
                 "90-99 : 3.5 times what you bet\n" +
                 "100   : Ten times your bet!```",
        alias: ["betroll", "broll", "brool", "bro", "br"],
        syntax: "`{prefix}betroll number` where number equals how much you want to bet.\n" +
                "`{prefix}betroll all` bet all of your dabs *(madman)*.",
        owner_only: false,
        affect_config: true,
        action: function(message, config) {
            content = message.content.split(" ")
            if (content.length < 1)
                return error_reply(message, config)
            if (content[1] === "all") {
                update_dabs(message, config)
                amount = config.users[message.author.id]["dabs"]
            }
            amount = Math.floor(Number(content[1]))
            if (!(amount >= 0))
                return error_reply(message, config)
            if (content[1] == "all")

            if (!update_dabs(message, )) {}
        }
    }
]


