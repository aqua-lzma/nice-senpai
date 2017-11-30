const Discord = require("discord.js");
const fs      = require("fs");
const request = require("request");

function update_dabs(message, config, amount) {
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
    if (user.daily_claim !== new Date().getDay()) {
        //user.daily_claim = new Date().getDay()
        user.daily_rolls += Math.floor(10 * (Math.log(user.level) / Math.log(5))) + 1
        message.channel.send(`${message.author} has new daily rolls!`)
    }
    return user
}

function circularJSON(key, value) {
    if (typeof value === 'object' && value !== null) {
        if (cache.indexOf(value) !== -1) {
            return;
        }
        cache.push(value);
    }
    return value;
}

module.exports = [
    {
        title: "Help",
        desc: "Display all commands or show more info about a specified one.",
        syntax: "`{prefix}help` to show this and a list of available commands.\n" +
                "`{prefix}help command` shows more information about specified command.",
        alias: ["help", "halp", "h", "imdumbplshelpme"],
        owner_only: false,
        affect_config: false,
        action: function(message, config) {
            prefix = config.command_prefix
            if (config.server_prefix[message.guild.id])
                prefix = config.server_prefix[message.guild.id]
            content = message.content.toLowerCase().split(" ")
            content = (content.length === 1)?"help":content[1]
            for (let cmd of module.exports) {
                if (cmd.alias.indexOf(content) >= 0){
                    embed = {
                        title: cmd.title,
                        fields: [
                            { name: "Description", value: cmd.desc },
                            { name: "Aliases", value: `\`${prefix}${cmd.alias.join(`\`, \`${prefix}`)}\`` }
                        ]
                    }
                    if (cmd.syntax)
                        embed.fields.push({ name: "Syntax", value: cmd.syntax.split("{prefix}").join(prefix) })
                    if (content === "help") {
                        available = ""
                        for (let cmd2 of module.exports)
                                if (cmd2.owner_only)
                                    continue
                            available += `\`${prefix}${cmd2.alias[0]}\` `
                        embed.fields.push({name: "Available commands", value: available})
                    }
                    message.channel.send("", { embed: embed })
                    return
                }
            }
            message.channel.send("Command not found")
        }
    },
    {
        title: "Roll",
        desc: "Roll a number between 0 and 100 inclusive. Announces dubs.",
        alias: ["roll", "r"],
        owner_only: false,
        affect_config: false,
        action: function(message, config) {
            number = Math.floor(Math.random() * 101).toString().padStart(2, "0")
            out = `You rolled ${number}`
            out += (number.substr(-2, 1) === number.substr(-1))?"\nNice dubs!":""
            message.channel.send(out)
        }
    },
    {
        title: "Check your self",
        desc: "Check how many dabs you have, your level and how many daily rolls you have.\n" +
              "*Check yourself before you wreck yourself.*",
        alias: ["me", "checkme", "dabs"],
        owner_only: false,
        affect_config: false,
        action: function(message, config) {
            user = update_dabs(message, config)
            message.guild.fetchMember(message.author)
            .then(guildMember => {
                console.log(guildMember)
                message.channel.send("", {embed: {
                    author: {
                        name: guildMember.displayName,
                        icon_url: guildMember.user.avatarURL
                    },
                    color: guildMember.displayColor,
                    fields: [
                        { inline: true, name: "Dabs", value: user.dabs },
                        { inline: true, name: "Highest held dabs", value: user.dab_record },
                        { inline: true, name: "Level", value: user.level },
                        { inline: true, name: "Daily rolls left", value: user.daily_rolls },
                    ]
                }})
            })
        }
    },
    {
        title: "Bet roll",
        desc: "Bet dabs on a roll between 0 and 100 inclusive." +
              "```\n" +
              "0-65  : No money back\n" +
              "66-89 : Double what you bet\n" +
              "90-99 : 3.5 times what you bet\n" +
              "100   : Ten times your bet!\n" +
              "```",
        alias: ["betroll", "broll", "brool", "bro", "br"],
        syntax: "`{prefix}betroll number` where number equals how much you want to bet.\n" +
                "`{prefix}betroll all` bet all of your dabs *(madman)*.",
        owner_only: false,
        affect_config: true,
        action: function(message, config) {
            user = update_dabs(message, config)
            content = message.content.toLowerCase().split(" ")[1]
            bonus = 1
            if (content === "all") {
                amount = user.dabs
                bonus = 2
            } else {
                amount = Number(content)
                if (amount === NaN || Math.floor(amount) != amount || amount < 0)
                    return message.channel.send("Invalid amount.")
                if (amount > user.dabs) {
                    return message.channel.send("You don't have enough dabs.")
                }
            }

            user.dabs -= amount
            number = Math.floor(Math.random() * 101)
            if (number < 66) {
                suffix = "no dabs."
                winnings = 0
            } else if (number < 90) {
                winnings = amount * 2 * bonus
                suffix = `${winnings} dabs! ${config.dab_emoji}`
            } else if (number < 100) {
                winnings = Math.floor(amount * 3.5 * bonus)
                suffix = `${winnings} dabs for getting above 90! ${config.dab_emoji}`
            } else if (number == 100) {
                winnings = amount * 10 * bonus
                suffix = `${winnings} dabs! PERFECT ROLL! ${config.dab_emoji}`
            } else
                suffix = "Something went wrong."
            user.dabs += winnings
            message.channel.send(`You rolled ${number} and won ${suffix}`)
        }
    },
    {
        title: "Bet flip",
        desc: "Bet dabs on a coin flip and win one and a half times what you bet if you win.",
        alias: ["betflip", "bflip", "blip", "bf"],
        syntax: "`{prefix}betflip number heads|tails` where number equals how much you want to bet.\n" +
                "`{prefix}betflip tails|heads number` this also works.\n" +
                "`{prefix}betflip all heads|tails` bet all your dabs *(madman)*.\n" +
                "You can use `h` or `t` as shorthand for heads/tails.",
        owner_only: false,
        affect_config: true,
        action: function(message, config) {
            user = update_dabs(message, config)
            content = message.content.toLowerCase().split(" ")
            bonus = 1
            if (content[1] === "all"){
                amount = user.dabs
                choice = content[2]
                bonus = 2
            } else if (content[2] === "all") {
                amount = user.dabs
                choice = content[1]
                bonus = 2
            } else {
                amount = Number(content[1])
                choice = content[2]
                if (amount === NaN || Math.floor(amount) != amount || amount < 0) {
                    amount = Number(content[2])
                    choice = content[1]
                    if (amount === NaN || Math.floor(amount) != amount || amount < 0)
                        return message.channel.send("Invalid amount.")
                }
                if (amount > user.dabs)
                    return message.channel.send("You don't have enough dabs.")
            }
            if (choice === undefined || (!choice.startsWith("h") && !choice.startsWith("t")))
                return message.channel.send("Invalid choice.")

            user.dabs -= amount
            result = Math.floor(Math.random() * 2)
            title = "Coin flip: "
            coin = "https://raw.githubusercontent.com/aqua-rar/Nice-Senpai/master/makotocoin"
            if (result === 1) {
                title += "heads"
                coin += "head.png"
                success = choice.startsWith("h")
            } else {
                title += "tails"
                coin += "tails.png"
                success = choice.startsWith("t")
            }
            text = "You win no dabs."
            if (success) {
                winnings = Math.floor(amount * 1.5 * bonus)
                user.dabs += winnings
                text = `You win ${winnings} dabs! ${config.dab_emoji}`
            }
            message.channel.send((new Discord.RichEmbed({ title: title, description: text })).setImage(coin))
        }
    },
    {
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
    },
    {
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
    },
    {
      title         : "Play",
      desc          : "Add a song to the :fire: Radio queue.",
      alias         : ["play","p"],
      syntax        : "`{prefix}play <url | search query>`" +
                      "List of supported urls: https://rg3.github.io/youtube-dl/supportedsites.html",
      owner_only    : false,
      affect_config : true,
      action        : function(message, config){

        query = {
          content:message.content.split(" ").slice(1).join(" "),
          requester:message
        };

        if(query.content.indexOf("http://") > -1){
            query.type = "url";

            if(query.content[0].indexOf("youtube.com") > -1){
                query.content = query.content[0].split("&")[0];
                query.type    = "yt";
            };
        } else {
          if(query.content.length === 11){
            if (!getTitle(query.content)){
              query.type = "string";
          } else {
              query.content = `http://www.youtube.com/watch?v=${query.content}`
              query.type = "yt";
          };
        };

        function getTitle(ytid){
          request(`https://www.googleapis.com/youtube/v3/videos?id=${id}&key=${config["ytapikey"]}&fields=items(snippet(title))&part=snippet`,
            function(error, response, body) {
              var json = JSON.parse(body);
              if(json.items[0]){
                  return json.items[0].snippet.title
              } else {
                  return false;
              }
          });
        }

        function do_the_thing_uhhhh_the_thingamajig(){
          console.log(config["queue"]["vChan"])
          vChan = config["queue"][0]["vChan"];
          vChan.join().then(connection => {
            song = ytdl(config["queue"][0]["url"], {
                filter:"audioonly"
            });
            dispatcher = connection.playStream(song);

            message.channel.send(`<@${config["queue"][0]["message"].author.id}>, your song **${config["queue"][0]["title"]}** is now playing in **${vChan.name}**!`)

            dispatcher.on('end', function() {
              config["queue"].shift();

              if(config["queue"].length > 0){
                setTimeout(function(){
                  do_the_thing_uhhhh_the_thingamajig();
                },500);
              } else {
                config["queue"][0]["message"].channel.send("Queue's empty! Play your own songs with **-play <search query | url>**.")
              };
            });
          });
        };

        if ( message.member.voiceChannel )  {

            if ( config["queue"].length === 0 ){
              config["queue"].push("__") //placeholder
            };

            if ( config["queue"].length > 0 || config["Playing"] ){
              console.log("happened")
              config["queue"].push(query);
              title = null;

              if (query.type === "yt"){
                title = getTitle(query.content.split('?v=')[0]);

              } else if(query.type === "url") {
                title = query.content.split('/')[query.content.split('/').length-1];

              } else {
                request(`https://www.googleapis.com/youtube/v3/search?part=id&type=video&q=${encodeURIComponent(query)}&key=${config["ytapikey"]}`,
                  function(error, response, body) {

                    var json = JSON.parse(body);
                    if (json.items[0]) {
                      title          = getTitle(json.items[0].id.videoId);
                      query.content = `https://www.youtube.com/watch?v=${json.items[0].id.videoId}`;
                    };
                });
              };

              if(title){
                message.channel.send(`Enqueued **${title} to be played. Position in queue: ${config["queue"].indexOf(query)+1}`);
                var content = {
                  "url":query.content,
                  "title":title,
                  "message":message,
                  "skips":[]
                }
                console.log(content);
                config["queue"].push(content);
              } else {
                message.channel.send("You want to play THAT? Hahaha, gross!"); // shh, dont tell anyone we didn't get any results from searching youtube
              };

              if (config["queue"].length === 2 && config["queue"][0] === "__"){

                config["Playing"] = true;
                do_the_thing_uhhhh_the_thingamajig();

              };

          };

        };
      }
    }}
]
