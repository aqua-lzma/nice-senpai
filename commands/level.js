update_dabs = require("./_update_dabs.js")

function get_max(level, dabs) {
    cost = Math.floor((level * level * 0.1) + 10)
    count = 0
    while (cost < dabs) {
        count++
        cost += Math.floor((((level + count) ** 2) * 0.1) + 10)
    }
    return count
}

function get_cost(level, count) {
    cost = 0
    for(i=0; i<count; i++)
        cost += Math.floor((((level + i) ** 2) * 0.1) + 10)
    return cost
}

module.exports = {
    title: "Level",
    desc: "Use your dabs to increase your level so you can get more dabs so you can get more levels!",
    syntax: "",
    alias: ["level", "lvl"],
    owner_only: false,
    affect_config: true,
    action: function(message, config) {
        user = update_dabs(message, config)

        content = message.content.split(" ")
        if (content.length >= 2) {
            if (content[1] === "all") {
                amount = get_max(user.level, user.dabs)
                if (amount == 0)
                    return message.channel.send("You don't have enough dabs to even level up once.")
            } else {
                amount = Number(content[1])
                if (amount === NaN || Math.floor(amount) != amount || amount < 0)
                    return message.channel.send("Invalid amount.")
            }
        } else
            amount = 1

        cost = get_cost(user.level, amount)
        output = `Leveling up ${(amount==1?"once":`${amount} times`)} will cost you ${cost} dabs.\n`
        if (cost > user.dabs)
            return message.channel.send(output + "You can't afford this.")

        message.channel.send(output + "Proceed? `y/n`")
        message.channel.awaitMessages(
            m => {
                return (
                    m.content.toLowerCase().startsWith("y") ||
                    m.content.toLowerCase().startsWith("n")
                ) && (
                    m.author.id == message.author.id
                )
            },
            { time: 10000, maxMatches: 1 }
        )
        .then(response => {
            if (response.first().content.toLowerCase().startsWith("y")) {
                user.level += amount
                user.dabs -= cost
                message.channel.send(`You are now level ${user.level}!`)
            }
        })
        .catch(
            response => {
                message.channel.send("timeout")
            }
        )
    }
}
