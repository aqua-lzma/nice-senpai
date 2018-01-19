module.exports = {
    title: "Give",
    desc: "Give mentioned users <amount> dabs. Positive amounts only.",
    syntax: "`{prefix}give <amount> [user-mentions ...]",
    alias: ["give"],
    owner_only: false,
    affect_config: false,
    action: function(message, config) {
        message_words = message.content.split(" ")

        for (word of message_words) {
            if (!Number.isNaN(Number(word)))
                amount = Number(word)
        }

        if (amount === undefined)
            return message.channel.send("Specify an amount. No dabs given.")
        if (amount <= 0 || (Number.isInteger == false))
            return message.channel.send("Specify a valid amount. No dabs given.")

        sender = message.author
        receivers = message.mentions.users
        user = update_dabs(sender, config)
        total_amount = amount * receivers.size
        if (user.dabs < total_amount)
            return message.channel.send("Not enough dabs to give. No dabs given.")

        for (receiver of receivers.values()) {
            update_dabs(sender, config, -1 * amount)
            update_dabs(receiver, config, amount)
        }

        message.channel.send("Sent " + total_amount + " dabs to " + 
            receivers.size + " users")
    }
}
