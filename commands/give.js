const update_dabs = require("./_update_dabs.js")

module.exports = {
    title: "Give",
    desc: "I was gonna do it eventually lole... @everyone or @here will end\n"
    + "the command prematurely.",
    syntax: "`{prefix}{prefix}give <amount> [mentions...]`",
    alias: ["give"],
    owner_only: false,
    affect_config: false,
    action: function(message, config) {
        amount = message.content.split(" ")[1]
        if (amount === NaN) {
            message.channel.send("Enter a proper amount")
            return
        }
        sender = update_dabs(message, config)
        receivers = message.mentions.users
        console.log("Size = " + receivers.size)
        for (receiver of receivers) {
            update_dabs(message, config, amount, receiver)
            update_dabs(message, config, amount * -1)
        }
        amount *= receivers.size
        message.channel.send("Gave a total of " + amount + "dabs to " +
            receivers.size + "users.")
    }
}
