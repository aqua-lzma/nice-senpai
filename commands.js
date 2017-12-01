const fs =   require("fs")
const path = require("path")

var exports = []

for (let command of fs.readdirSync("./commands")) {
    if (!command.startsWith("_")) {
        exports.push(require(`./commands/${command}`))
    }
}

module.exports = exports
