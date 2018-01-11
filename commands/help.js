module.exports = {
    title: "Help",
    desc: "Display all commands or show more info about a specified one.\n" +
          "If you encounter any issues please create an issue on:\n" +
          "https://github.com/aqua-rar/Nice-Senpai\n" +
          "Or contact @aqua\\\\\\スケルトン#9099",
    syntax: "`{prefix}help` to show this and a list of available commands.\n" +
            "`{prefix}help command` shows more information about specified command.",
    alias: ["help", "halp", "h", "imdumbplshelpme"],
    owner_only: false,
    affect_config: false,
    action: function(message, config) {
        prefix = config.command_prefix
        if (config.server_prefix[message.guild.id])
            prefix = config.server_prefix[message.guild.id]
        content = message.content.toLowerCase().split(" ")
        content = (content.length === 1)?"help":content[1]

        for (let cmd of require("../commands.js")) {
            // Mmm that recursion
            if (cmd.alias.indexOf(content) >= 0){
                embed = {
                    title: cmd.title,
                    fields: [
                        { name: "Description", value: cmd.desc },
                        { name: "Aliases", value: `\`${prefix}${cmd.alias.join(`\`, \`${prefix}`)}\`` }
                    ]
                }
                if (cmd.syntax)
                    embed.fields.push({ name: "Syntax", value: cmd.syntax.split("{prefix}").join(prefix) })
                if (content === "help") {
                    available = ""
                    for (let cmd2 of require("../commands.js"))
                        if (!cmd2.owner_only)
                            available += `\`${prefix}${cmd2.alias[0]}\` `
                    embed.fields.push({name: "Available commands", value: available})
                }
                message.channel.send("", { embed: embed })
                return
            }
        }
        message.channel.send("Command not found")
    }
}
