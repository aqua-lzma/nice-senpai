const update_dabs = require("./_update_dabs.js")

module.exports = {
    title: "Bet roll",
    desc: "Bet dabs on a roll between 0 and 100 inclusive." +
            "```\n" +
            "0-65  : No money back\n" +
            "66-89 : Double what you bet\n" +
            "90-99 : 3.5 times what you bet\n" +
            "100   : Ten times your bet!\n" +
            "```",
    alias: ["betroll", "broll", "brool", "bro", "br"],
    syntax: "`{prefix}betroll <number>` where number equals how much you want to bet.\n" +
            "`{prefix}betroll all` bet all of your dabs *(madman)*.",
    owner_only: false,
    affect_config: true,
    action: function(message, config) {
        user = update_dabs(message.author, config)
        content = message.content.toLowerCase().split(" ")[1]
        bonus = 1
        if (content === "all") {
            amount = user.dabs
            bonus = 2
        } else {
            amount = Number(content)
            if (amount === NaN || Math.floor(amount) != amount || amount < 0)
                return message.channel.send("Invalid amount.")
            if (amount > user.dabs) {
                return message.channel.send("You don't have enough dabs.")
            }
        }

        user.dabs -= amount
        number = Math.floor(Math.random() * 101)
        if (number < 66) {
            suffix = "no dabs."
            winnings = 0
        } else if (number < 90) {
            winnings = amount * 2 * bonus
            suffix = `${winnings} dabs! ${config.dab_emoji}`
        } else if (number < 100) {
            winnings = Math.floor(amount * 3.5 * bonus)
            suffix = `${winnings} dabs for getting above 90! ${config.dab_emoji}`
        } else if (number == 100) {
            winnings = amount * 10 * bonus
            suffix = `${winnings} dabs! PERFECT ROLL! ${config.dab_emoji}`
        } else
            suffix = "Something went wrong."
        user.dabs += winnings
        message.channel.send(`You rolled ${number} and won ${suffix}`)
    }
}
