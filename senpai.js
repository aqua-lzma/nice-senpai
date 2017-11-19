const Discord = require("discord.js")
const fs = require("fs")
const cmds = require("./cmds.js")
var config = require("./config.json")
var client = new Discord.Client()

client.login(config.token)

client.on("ready", function() {
    console.log("hi")
})

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
        for(cmd of cmds) {
            if (cmd.alias.indexOf(input) >= 0) {
                if (cmd.owner_only && message.author.id !== config.owner_id) return
                cmd.action(message, config)
                if (cmd.affect_config){
                    fs.writeFile("./config.json", JSON.stringify(config, null, 4))
                }
                return
            }
        }
    }
})
