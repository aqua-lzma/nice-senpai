const update_dabs = require("./_update_dabs.js")

module.exports = {
    title: "Bet dubs",
    desc: "Bet dabs on a roll for dubs up to sextuples." +
            "```\n" +
            "No dubs : No money back.\n" +
            "Dubs    : Double what you bet.\n" +
            "Trips   : 20 times your bet!\n" +
            "Quads   : 200 times your bet!\n" +
            "Quints  : 2,000 times your bet!\n" +
            "Sexts   : 20,000 times your bet, wow!\n" +
            "```",
    alias: ["dubroll", "rolldubs", "dubrool", "dubr"],
    syntax: "`{prefix}dubroll <number>` where number equals how much you want to bet.\n" +
            "`{prefix}dubroll all` bet all of your dabs *(madman)*.",
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
        number = Math.floor(Math.random() * 1000001)
        roll = ("000000" + number).slice(-6)
        win = 0
        for (c = 5; c > 0; c--) {
            if (roll[c] === roll[c-1]) win += 1
            else break
        }
        if (win == 0) {
            suffix = "no dabs."
            winnings = 0
        } else if (win == 1) {
            winnings = amount * 2 * bonus
            suffix = `${winnings} dabs! *Dubs!* ${config.dab_emoji}`
        } else if (win == 2) {
            winnings = amount * 20 * bonus
            suffix = `${winnings} dabs! **Trips!** ${config.dab_emoji}`
        } else if (win == 3) {
            winnings = amount * 200 * bonus
            suffix = `${winnings} dabs! **QUADS!** ${config.dab_emoji}`
        } else if (win == 4) {
            winnings = amount * 2000 * bonus
            suffix = `${winnings} dabs! ***QUINTUPLES*** ${config.dab_emoji}`
        } else if (win == 5) {
            winnings = amount * 20000 * bonus
            suffix = `${winnings} dabs! ***S E X T U P L E S*** ${config.dab_emoji}`
        } else
            suffix = "Something went wrong."
        user.dabs += winnings
        message.channel.send(`You rolled \`${roll}\` and won ${suffix}`)
    }
}
