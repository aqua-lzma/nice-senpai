const update_dabs = require("./_update_dabs.js")

module.exports = {
    title: "Check your self",
    desc: "Check how many dabs you or someone else has.\n" +
          "Shows your level and how many daily rolls you have.\n" +
          "*Check yourself before you wreck yourself.*",
    alias: ["info", "check", "dabs"],
    syntax: "`{prefix}{prefix}` Shows your info.\n" +
            "`{prefix}{prefix} @person` shows the persons info. *Actually not really.*",
    owner_only: false,
    affect_config: false,
    action: function(message, config) {
        // TODO: Check other people
        user = update_dabs(message, config)
        message.guild.fetchMember(message.author)
        .then(guildMember => {
            message.channel.send("", {embed: {
                author: {
                    name: guildMember.displayName,
                    icon_url: guildMember.user.avatarURL
                },
                color: guildMember.displayColor,
                fields: [
                    { inline: true, name: "Dabs", value: String(user.dabs) },
                    { inline: true, name: "Highest held dabs", value: String(user.dab_record) },
                    { inline: true, name: "Level", value: String(user.level) },
                    { inline: true, name: "Daily rolls left", value: String(user.daily_rolls) },
                ]
            }})
        })
    }
}
