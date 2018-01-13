//Updates a user property given by key by <amount>
module.exports = function update_dabs(member, config, amount, key="dabs") {
    user = config.users[member.id]
    if (user === undefined) {
        user = config.users[member.id] = {
            dabs: 100,
            dab_record: 100,
            level: 1,
            daily_rolls: 0,
            daily_claim: -1,
        }
        message.channel.send(member.username + "not in database. " + user.dabs
            + "free dabs!")
    }
    if (user.daily_claim != new Date().getDay()) {
        user.daily_claim = new Date().getDay()
        user.daily_rolls += Math.floor(10 * (Math.log(user.level) / Math.log(5))) + 1
        // TOCONSIDER : Announce that user has drools
    }

    if (amount === undefined) {
    } else {
        user[key] += amount
    }

    if (user.dabs > user.dab_record) user.dab_record = user.dabs
    return user
}
