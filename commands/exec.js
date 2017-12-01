const update_dabs = require("./_update_dabs.js")

function circularJSON(key, value) {
    if (typeof value === 'object' && value !== null) {
        if (cache.indexOf(value) !== -1) {
            return;
        }
        cache.push(value);
    }
    return value;
}

module.exports = {
    title: "Evaluate",
    desc: "Evaluate JS code. **OWNER ONLY**",
    alias: ["eval", "exec"],
    syntax: "`{prefix}eval code` where code is the JS cod you want to run.\n" +
            "`{prefix}eval ```[js] multiline code``` ` For multiline code. " +
            "[js] is optional for syntax highlighting.",
    owner_only: true,
    affect_config: true,
    action: function(message, config) {
        code = message.content.slice(6)
        if (code.startsWith("```") && code.endsWith("```")) {
            code = code.slice(0,-3)
            if (code.startsWith("```js"))
                code = code.slice(5)
            else
                code = code.slice(3)
            code = code.trim()
        }
        try {
            output = eval(`(function() {
                output = ""
                function print() {
                    output += Array.prototype.slice.call(arguments, 0)
                    .map(item => {
                        if (item.toString() == "[object Object]") {
                            cache = []
                            return JSON.stringify(item, circularJSON)
                        }
                        return item.toString()
                    })
                }
                ${code};
                return output
            })()`)
            output = String(output).trim()
            if (output === "")
                message.channel.send("No output")
            else
                message.channel.send(output.split("\n").map(item => `\`${item}\``).join("\n"))
        }
        catch (e) {
            message.channel.send(e.toString())
        }
    }
}