const update_dabs = require("./_update_dabs.js")

module.exports = {
    title: "Bet flip",
    desc: "Bet dabs on a coin flip and win one and a half times what you bet if you win.",
    alias: ["betflip", "bflip", "blip", "bf"],
    syntax: "`{prefix}betflip number heads|tails` where number equals how much you want to bet.\n" +
            "`{prefix}betflip tails|heads number` this also works.\n" +
            "`{prefix}betflip all heads|tails` bet all your dabs *(madman)*.\n" +
            "You can use `h` or `t` as shorthand for heads/tails.",
    owner_only: false,
    affect_config: true,
    action: function(message, config) {
        user = update_dabs(message, config)
        content = message.content.toLowerCase().split(" ")
        bonus = 1
        if (content[1] === "all"){
            amount = user.dabs
            choice = content[2]
            bonus = 2
        } else if (content[2] === "all") {
            amount = user.dabs
            choice = content[1]
            bonus = 2
        } else {
            amount = Number(content[1])
            choice = content[2]
            if (amount === NaN || Math.floor(amount) != amount || amount < 0) {
                amount = Number(content[2])
                choice = content[1]
                if (amount === NaN || Math.floor(amount) != amount || amount < 0)
                    return message.channel.send("Invalid amount.")
            }
            if (amount > user.dabs)
                return message.channel.send("You don't have enough dabs.")
        }
        if (choice === undefined || (!choice.startsWith("h") && !choice.startsWith("t")))
            return message.channel.send("Invalid choice.")

        user.dabs -= amount
        result = Math.floor(Math.random() * 2)
        title = "Coin flip: "
        coin = "https://raw.githubusercontent.com/aqua-rar/Nice-Senpai/master/makotocoin"
        if (result === 1) {
            title += "heads"
            coin += "head.png"
            success = choice.startsWith("h")
        } else {
            title += "tails"
            coin += "tails.png"
            success = choice.startsWith("t")
        }
        text = "You win no dabs."
        if (success) {
            winnings = Math.floor(amount * 1.5 * bonus)
            user.dabs += winnings
            text = `You win ${winnings} dabs! ${config.dab_emoji}`
        }
        message.channel.send((new Discord.RichEmbed({ title: title, description: text })).setImage(coin))
    }
}