const update_dabs = require("./_update_dabs.js")

// decrease user dabs by amount
// if amount is "all", decrease dabs to zero
// returns amount decreased if dabs updated successfully
// returns negative number deficit if not enough dabs to pay
module.exports = function pay_dabs(member, config, amount) {
    user = update_dabs(member, config)
    if (amount == "all") {
        amount = user.dabs
    }
    if (amount < 0){
        console.log("WARNING: amount is negative (" + amount + ")")
        console.log("pay_dabs will INCREASE the user's dabs!")
    }
    if (user.dabs < amount){
        return user.dabs - amount
    }
    update_dabs(member, config, amount * -1)
    return amount
}
