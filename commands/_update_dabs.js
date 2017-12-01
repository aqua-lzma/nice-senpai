module.exports = function update_dabs(message, config, amount) {
    user = config.users[message.author.id]
    if (user === undefined) {
        user = config.users[message.author.id] = {
            dabs: 100,
            dab_record: 100,
            level: 1,
            daily_rolls: 0,
            daily_claim: -1,
        }
        message.reply("not found in database, 100 free dabs!")
    }
    if (user.daily_claim != new Date().getDay()) {
        user.daily_claim = new Date().getDay()
        user.daily_rolls += Math.floor(10 * (Math.log(user.level) / Math.log(5))) + 1
        message.channel.send(`${message.author} has new daily rolls!`)
    }
    return user
}