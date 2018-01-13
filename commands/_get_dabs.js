const update_dabs = require("./_update_dabs.js")

// decrease user dabs by amount
// no return value
module.exports = function pay_dabs(member, config, amount) {
    if (amount < 0){
        console.log("WARNING: amount is negative (" + amount + ")")
        console.log("get_dabs will DECREASE the user's dabs!")
    }
    update_dabs(member, config, Number(amount))
}
