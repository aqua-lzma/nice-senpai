const update_dabs = require("./_update_dabs.js")

module.exports = {
    title: "Daily roll",
    desc: "Claim your daily rolls and win dabs if you roll dubs.\n" +
          "```\n" +
          "singles    : 1      dab\n" +
          "doubles    : 22     dabs\n" +
          "triples    : 333    dabs\n" +
          "quadruples : 5555   dabs\n" +
          "quintuples : 77777  dabs\n" +
          "sextuples  : 999999 dabs\n" +
          "```\n" +
          "Your level increases overall winnings.\n" +
          "*Try not to drool over yourself.* 🤤",
    alias: ["dailyroll", "droll", "drool", "dr"],
    syntax: "`{prefix}droll [filter]` roll once.\n" +
            "`{prefix}droll number [filter]` roll number amount of times.\n" +
            "`{prefix}drool all [filter]` roll all you can and get it over with.\n" +
            "`[filter]` is optional, it filters which results to show (default to dubs and above).\n" +
            "Available filters: `singles`: show all rolls, `dubs`: show all dubs and above,\n" +
            "`trips`: show trips and above, `quads`: show all quads and above.\n" +
            "Anything higher and you wont be seeing any rolls cmon be realistic.",
    owner_only: false,
    affect_config: true,
    action: function(message, config) {
        user = update_dabs(message, config)
        filters = ["singles", "dubs", "trips", "quads", "quints", "sexts"]
        content = message.content.toLowerCase().split(" ")
        filter = 1
        amount = 1
        if (content.length === 2) {
            if (filters.indexOf(content[1]) >= 0)
                filter = filters.indexOf(content[1])
            else if (content[1] === "all")
                amount = user.daily_rolls
            else
                amount = Number(content[1])
        } else if (content.length >= 2) {
            if (content[1] === "all")
                amount = user.daily_rolls
            else
                amount = Number(content[1])
            filter = filters.indexOf(content[2])
        }
        if (content[1] === "all" && amount === 0)
            return message.channel.send("No dabs, try tomorrow.")
        if (amount > user.daily_rolls)
            return message.channel.send("Not enough rolls left.")
        if (amount === NaN || Math.floor(amount) != amount || amount <= 0)
            return message.channel.send("Invalid input.")
        if (filter === -1)
            return message.channel.send("Invalid filter.")
        full_rolls = []
        for (i=0; i<amount; i++) {
            num = Math.floor(Math.random() * 1000001)
            if (num === 0 || num === 1000000) {
                full_rolls.push([num.toString(), 6])
                continue
            }
            roll = ("000000" + num).slice(-6)
            win = 0
            for (c=5; c>0; c--) {
                if (roll[c] === roll[c-1]) win += 1
                else break
            }
            full_rolls.push([roll, win])
        }
        filtered = full_rolls.filter(item => item[1] >= filter)
        while (filtered.length === 0) {
            message.channel.send(
                "Nothing to display.\n" +
                `Give a lower filter (\`${filters.join("`, `")}\`).\n` +
                "Or reply `no` to simply collect your dabs."
            )
            message.channel.awaitMessages(
                msg => {
                    if (msg.author != message.author)
                        return false
                    if (filters.indexOf(msg.content.toLowerCase()) >= 0)
                        return true
                    if (msg.content.toLowerCase() === "no")
                        return true
                }, { maxMatches: 1, time: 10000 })
                .then(collected => {
                    if (collected.content.toLowerCase() == "no")
                        filter = false
                    else
                        filter = filters.indexOf(collected.content.toLowerCase())
                })
                .catch(collected => {
                    message.channel.send("Response timed out, defaulting to `no`.")
                })
            if (filtered === false) {
                break
            }
            filtered = full_rolls.filter(item => item[1] >= filter)
        }
        text_out = ""
        map_text = (item) => {
            text_out += item[0]
                .split("0").join(":zero:") .split("1").join(":one:")
                .split("2").join(":two:")  .split("3").join(":three:")
                .split("4").join(":four:") .split("5").join(":five:")
                .split("6").join(":six:")  .split("7").join(":seven:")
                .split("8").join(":eight:").split("9").join(":nine:")
            text_out += " "
            text_out += [
                "",
                "*dubs*",
                "**trips**",
                "**QUADS**",
                "***QUINTUPLES***",
                "***S E X T U P L E S***",
                "**L E G E N D A R Y   R O L L**"
            ][item[1]]
            text_out += "\n"
        }
        filtered.map(map_text)
        while (text_out.length > 2048) {
            //tell them to filter better
        }
    }
}