const update_dabs = require("./_update_dabs.js")
const pay_dabs = require("./_pay_dabs.js")
const get_dabs = require("./_get_dabs.js")

module.exports = {
    title: "Give",
    desc: "Give <amount> dabs each to each user mentioned. @everyone or @here"
    + " will cancel the transfer",
    syntax: "`{prefix}give <amount> [mentions...]`",
    alias: ["give"],
    owner_only: false,
    affect_config: false,
    action: function(message, config) {
        amount = message.content.split(" ")[1]
        if (amount === NaN || Number(amount) <= 0) {
            message.channel.send("Invalid amount. Input a positive number " + 
                "or `all`")
            return -1
        }
        receivers = message.mentions.users
        if (receivers.size === 0){
            message.channel.send("Mention at least one user. Do not use @here" +
                "because it will make your dabs infinite")
            return -1
        }
        console.log("Size = " + receivers.size)
        for (receiver of receivers.values()) {
            console.log(receiver)
            pay_dabs(message.author, config, amount)
            get_dabs(receiver, config, amount)
        }
        total_amount = amount * receivers.size
        message.channel.send("Gave a total of " + total_amount + "dabs to " +
            receivers.size + "users.")
        return amount
    }
}
