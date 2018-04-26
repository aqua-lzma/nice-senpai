request = require("request")

module.exports = {
    title: "Search image",
    desc: "Search googlel for an image, will be a random one from the top 100 results.\n" +
          "*NotSoBot eat your heart out.*",
    syntax: "`{prefix}im <image query>` where query is what you want to search for.",
    alias: ["i", "im", "img", "imag", "image"],
    owner_only: false,
    affect_config: false,
    action: function(message, config) {
        query = message.content.split(" ").slice(1).join(" ")
        if (query == "") return message.channel.send("Cannot search blank query.")
        req = {
            url: `https://www.google.co.uk/search?q=${query}&tbm=isch`,
            headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:60.0) Gecko/20100101 Firefox/60.0" }
        }
        request.get(req, (err, res, body) => {
            if (err) return message.channel.send(`Error:\`\`\`\n${String(err)}\`\`\``)
            images = body.match(/(?<="ou":")[^"]*(?=")/g)
            index = 0

            function awaitReactions(response) {
                response.react("◀")
                .then(() => response.react("▶")
                .then(() => response.react("🔀")
                .then(() => {
                    response.createReactionCollector(
                        (reaction, user) => ["◀", "▶", "🔀"].indexOf(reaction.emoji.name) >= 0 && user.id == message.author.id,
                        { max: 1, time: 30000 }
                    ).on("collect", reaction => {
                        if (reaction.emoji.name == "◀") index--
                        else if (reaction.emoji.name == "▶") index++
                        else if (reaction.emoji.name == "🔀") index = Math.floor(Math.random() * images.length)
                        index = ((index % 100) + 100) % 100
                        response.edit("", {embed: {
                            title: query + `: ${index}`,
                            description: images[index],
                            image: { url: images[index] }
                        }})
                        response.clearReactions().then(awaitReactions)
                    }).on("end", (collected, reason) => {
                        if (reason != "limit") response.clearReactions()
                    })
                })))
            }

            message.channel.send("", {embed: {
                title: query + `: ${index}`,
                description: images[index],
                image: { url: images[index] }
            }})
            .then(awaitReactions)
        })
    }
}
