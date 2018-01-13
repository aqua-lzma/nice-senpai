const update_dabs = require("./_update_dabs.js")
const pay_dabs = require("./_pay_dabs.js")
const get_dabs = require("./_get_dabs.js")
// tell me if this is a bad thing to do
const Discord       = require("discord.js")

module.exports = {
    title: "Bet flip",
    desc: "Bet dabs on a coin flip and win one and a half times what you bet if you win.",
    alias: ["betflip", "bflip", "blip", "bf"],
    syntax: "`{prefix}betflip <number> <heads | tails>` where number equals how much you want to bet.\n" +
            "`{prefix}betflip <tails | heads> <number>` this also works.\n" +
            "`{prefix}betflip all <heads | tails>` bet all your dabs *(madman)*.\n" +
            "You can use `h` or `t` as shorthand for heads/tails.",
    owner_only: false,
    affect_config: true,
    action: function(message, config) {
        content = message.content.toLowerCase().split(" ")
        bonus = 1
        if (content.length !== 3){
            message.channel.send("Needs 2 arguments. Check $help betflip for" +
                " more details.")
            return 1
        }

        if (content[1].startsWith("h") || content[1].startsWith("t")){
            choice = content[1]
            amount = content[2]
            if (content[2] === "all")
                bonus = 2
        } else if (content[2].startsWith("h") || content[2].startsWith("t")){
            choice = content[2]
            amount = content[1]
            if (content[1] === "all")
                bonus = 2
        } else {
            message.channel.send("Missing h[eads] or t[ails]. Check $help " + 
                "betflip for more details.")
        }
        if (amount === NaN && bonus != 2) {
            message.channel.send("Invalid amount. Input a number or `all`")
            return amount
        }

        paid_dabs = pay_dabs(message.author, config, amount)
        if (paid_dabs < 0){
            message.channel.send("Not enough dabs to bet.")
            return paid_dabs
        }
        result = Math.floor(Math.random() * 2)
        title = "Coin flip: "
        coin = "http://localhost:80/resources/makotocoin"
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
            winnings = Math.floor(paid_dabs * 1.5 * bonus)
            get_dabs(message.author, config, winnings)
            text = `You win ${winnings} dabs! ${config.dab_emoji}`
        }
        message_embed = new Discord.RichEmbed({ title: title, description: text })
        console.log(typeof(message_embed))
        message_embed.setImage(coin)
        message.channel.send("", message_embed)
    }
}
