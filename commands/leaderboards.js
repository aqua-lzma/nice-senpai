const update_dabs = require("./_update_dabs.js")

module.exports = {
    title: "Leaderboards",
    desc: "Show server members with the **largest** dab collections.\n" +
          "Or alternatively show members with the highest ever held dabs.\n" +
          "*They probably already gambled them away*",
    syntax: "`{prefix}lb` show regular leaderboards for current server.\n" +
            "`{prefix}lb <highest | record>` show record leaderboards.",
    alias: ["lb", "leaderboards"],
    owner_only: false,
    affect_config: false,
    action: function(message, config) {
        content = message.content.toLowerCase().split(" ")
        dabs = true
        if ((content.length >= 2) && (content[1] == "highest" || content[1] == "record"))
            dabs = false

        table = [["User", (dabs?"Dabs held":"Dab record")]]
        // https://youtu.be/WBupia9oidU
        // Promises
        promises = []
        // You knew you'd never keep!
        for (user in config.users) {
            promises.push(message.guild.fetchMember(user))
        }
        // Why do I believe
        Promise.all(promises).then(users => {
            for (user of users) {
                value = (dabs?config.users[user.id].dabs:config.users[user.id].dab_record)
                table.push([user.displayName, String(value)])
            }

            table = table.sort((a, b) => b[1] - a[1])
            table = table.slice(0, 10)
            widths = [0, 0]
            for (i of table) {
                if (i[0].length > widths[0]) widths[0] = i[0].length
                if (i[1].length > widths[1]) widths[1] = i[1].length
            }
            for (i of table) {
                i[0] = i[0].padEnd(widths[0], " ")
                i[1] = i[1].padEnd(widths[1], " ")
            }

            lines = ["".padEnd(widths[0], "━"), "".padEnd(widths[1], "━"),]
            top_str = "┏" + lines[0] + "┳" + lines[1] + "┓\n"
            mid_str = "┣" + lines[0] + "╋" + lines[1] + "┫\n"
            bot_str = "┗" + lines[0] + "┻" + lines[1] + "┛"

            row_strs = []
            for (i of table)
                row_strs.push("┃" + i[0] + "┃" + i[1] + "┃\n")
            output = top_str + row_strs.join(mid_str) + bot_str

            message.channel.send("```" + output + "```")
        })
    }
}
