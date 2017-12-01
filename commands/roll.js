module.exports = {
    title: "Roll",
    desc: "Roll a number between 0 and 100 inclusive. Announces dubs.",
    alias: ["roll", "r"],
    owner_only: false,
    affect_config: false,
    action: function(message, config) {
        number = Math.floor(Math.random() * 101).toString().padStart(2, "0")
        out = `You rolled ${number}`
        out += (number.substr(-2, 1) === number.substr(-1))?"\nNice dubs!":""
        message.channel.send(out)
    }
}