request = require("request")

module.exports = {
    title: "Search image",
    desc: "Search googlel for an image, will be a random one from the top 100 results.\n" +
          "*NotSoBot eat your heart out.*",
    syntax: "`{prefix}im <image query>` where query is what you want to search for.",
    alias: ["im", "image", "i"],
    owner_only: false,
    affect_config: false,
    action: function(message, config) {
        query = message.content.split(" ").slice(1).join(" ")
        if (query == "") return message.channel.send("Cannot search blank query.")
        req = {
            url: `https://www.google.co.uk/search?q=${query}&tbm=isch`,
            headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:60.0) Gecko/20100101 Firefox/60.0" }
        }
        console.log(req.url)
        request.get(req, (err, res, body) => {
            if (err) message.channel.send(`Error:\`\`\`\n${String(err)}\`\`\``)
            images = body.match(/(?<="ou":")[^"]*(?=")/g)
            console.log(images)
            image = images[Math.floor(Math.random() * images.length)]
            console.log(image)
            message.channel.send("", {embed: {
                title: query,
                description: image,
                image: { url: image }
            }})
        })
    }
}
