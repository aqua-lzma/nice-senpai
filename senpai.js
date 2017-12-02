// -------------------------
const Discord       = require("discord.js")
const fs            = require("fs")
const commands      = require("./commands.js")
var config          = require("./config.json")
var client          = new Discord.Client()
// -------------------------

client.login(config.token)

client.on("ready", function() {
    console.log("hi")
})

// -------------------------

client.on("message", function(message) {
    if (
        message.author.id === client.user.id
        || !message.guild
        || config.ignore.server.indexOf(message.guild.id) >= 0
        || config.ignore.channel.indexOf(message.channel.id) >= 0
        || config.ignore.user.indexOf(message.author.id) >= 0
    ) return

    let prefix = config.command_prefix
    if (config.server_prefix[message.guild.id])
        prefix = config.server_prefix[message.guild.id]
    if (message.content.startsWith(prefix)) {
        var input = message.content.split(" ")[0].slice(1).toLowerCase()
        if (message.content === prefix + prefix) input = "me"
        for(command of commands) {
            if (command.alias.indexOf(input) >= 0) {
                if (command.owner_only && message.author.id !== config.owner_id) return
                command.action(message, config)
                if (command.affect_config)
                    fs.writeFile("./config.json", JSON.stringify(config, null, 4))
                return
            }
        }
    }
})
