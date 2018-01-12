module.exports = {
    title: "Give",
    desc: "Complain to @March#7572 for this not being implemented yet.",
    syntax: "`TODO`",
    alias: ["give"],
    owner_only: false,
    affect_config: false,
    action: function(message, config) {
        message.channel.send("Try `$help give`.")
    }
}
