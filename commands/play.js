const request = require("request")
const ytdl    = require("ytdl-core")

module.exports = {
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