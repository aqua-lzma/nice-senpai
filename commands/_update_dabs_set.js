module.exports = function update_dabs_set(member, config, amount=0, field="dabs") {
    user = config.users[member.id]
    if (user === undefined) {
        user = config.users[member.id] = {
            dabs: 100,
            dab_record: 100,
            level: 1,
            daily_rolls: 0,
            daily_claim: -1,
        }
        // TOCONSIDER : Announce that user has free dabs
    }
    if (user.daily_claim != new Date().getDay()) {
        user.daily_claim = new Date().getDay()
        user.daily_rolls += Math.floor(10 * (Math.log(user.level) / Math.log(5))) + 1
        // TOCONSIDER : Announce that user has drools
    }
    if (user.dabs > user.dab_record) user.dab_record = user.dabs
    amount[field] = amount
    return user
}
