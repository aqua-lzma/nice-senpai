moment = require("moment-timezone")

zones = moment.tz.names().map(item => item.toLowerCase().split("/"))

module.exports = {
    title: "Timezone",
    desc: "Try to see the time in a specified place.\n" +
          "Cities work best, so brush up on your capital cities!",
    syntax: "`{prefix}tz <name of place>` Specify a continent or city to show time for.",
    alias: ["tz", "timezone"],
    owner_only: false,
    affect_config: false,
    action: function(message, config) {
        content = message.content.toLowerCase().split(" ")
        search = (content.length == 1?"gmt":content[1])

        matches = []
        for (zone of zones)
            if (zone.indexOf(search) >= 0)
                matches.push(zone.join("/"))

        outputs = {}
        date = new Date()
        for (match of matches) {
            tz = moment.tz(date, match)
            time = tz.format("ddd, DD MMM YYYY HH:mm:ss Z z")
            if (outputs[time] == undefined)
                outputs[time] = [match]
            else
                outputs[time].push(match)
        }

        embed = { title: `Timezone: ${search}` }
        if (Object.keys(outputs).length == 0)
            embed.description = "No results."
        else if (Object.keys(outputs).length > 10)
            embed.description = "Too many results"
        else {
            embed.fields = []
            for (time in outputs) {
                field = {
                    name: outputs[time].slice(0,3).join(", "),
                    value: `\`${time}\``
                }
                if (outputs[time].length > 3)
                    field.name += ` [and ${outputs[time].length - 3} more]`
                embed.fields.push(field)
            }
        }
        message.channel.send("", {embed: embed})
    }
}
