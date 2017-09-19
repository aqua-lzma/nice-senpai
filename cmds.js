function update_dabs(message, config, amount) {
    if (config.users[message.author.id] === undefined) {

    }
}

module.exports = [
    {
        title: "Help",
        desc: "Display all commands or show more info about a specified one.",
        syntax: "`{prefix}help` to show this and a list of available commands." +
                "`{prefix}help command` shows more information about specified command.",
        alias: ["help", "halp", "h", "imdumbplshelpme"],
        owner_only: false,
        affect_config: false,
        action: function(message, config) {
            prefix = config.command_prefix
            if (config.server_prefix[message.guild.id])
                prefix = config.server_prefix[message.guild.id]
            content = message.content.split(" ")
            if (content.length === 1){
                
                out = `Type \`${prefix}help command_name\` or \`${prefix}h command_name\` to get info about a command.`
                out += "\nAvailable commands are:\n`"
                for (let cmd of module.exports)
                    out += "    " + cmd.alias[0]
                out += "`"
            } else {
                out = "Command not found."
                for (let cmd of module.exports) {
                    if (cmd.alias.indexOf(content[1]) >= 0){
                        out = cmd.name + ":\n" + cmd.help + `\nAliases: \`${prefix}` + cmd.alias.join(`\`, \`${prefix}`) + "`"
                        break
                    }
                }
            }
            message.channel.send(out)
        }
    },
    {
        name: "Roll",
        alias: ["roll", "r"],
        help: "Roll a number between 0 and 100 inclusive. Announces dubs.",
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
        alias: ["betroll", "broll", "brool", "bro", "br"],
        help: "Bet dabs on a roll between 0 and 100 inclusive." +
              "```0-65  : No money back\n" +
                 "66-89 : Double what you bet\n" +
                 "90-99 : 3.5 times what you bet\n" +
                 "100   : Ten times your bet!```",
        syntax: "`{prefix}betroll number` where number equals how much you want to bet.",
        owner_only: false,
        affect_config: true,
        action: function(message, config) {
            content = message.content.split(" ")
            if (content.length < 1)
                return message.reply("Invalid syntax,")
            if (!update_dabs(message, )) {}
        }
    }
]


