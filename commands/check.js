const update_dabs = require("./_update_dabs.js")

module.exports = {
    title: "Check your self",
    desc: "Check how many dabs you have, your level and how many daily rolls you have.\n" +
          "*Check yourself before you wreck yourself.*",
    alias: ["me", "checkme", "dabs"],
    owner_only: false,
    affect_config: false,
    action: function(message, config) {
        user = update_dabs(message, config)
        message.guild.fetchMember(message.author)
        .then(guildMember => {
            console.log(guildMember)
            message.channel.send("", {embed: {
                author: {
                    name: guildMember.displayName,
                    icon_url: guildMember.user.avatarURL
                },
                color: guildMember.displayColor,
                fields: [
                    { inline: true, name: "Dabs", value: user.dabs },
                    { inline: true, name: "Highest held dabs", value: user.dab_record },
                    { inline: true, name: "Level", value: user.level },
                    { inline: true, name: "Daily rolls left", value: user.daily_rolls },
                ]
            }})
        })
    }
}