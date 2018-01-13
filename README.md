# Nice-Senpai
nice bot

## Node Rewrite
### Dab bot
- [x] : $$
- [x] : give 
- [x] : leaderboards
- [x] : bet roll
- [x] : bet flip
- [x] : drool
- [x] : level
- [ ] : random dabs
### Voice
- [ ] : play
- [ ] : queue
- [ ] : np
- [ ] : pause
- [ ] : resume
- [ ] : skip
- [ ] : clear
- [ ] : pldump
- [ ] : set <avatar|name|nick>
- [ ] : search
- [ ] : restart
### Other stuff
- [x] : exec
- [ ] : shitposting "^ interesting" and "hmm"
- [ ] : nice-chess (we miss you saucy)
- [ ] : google image search (hi)
#### Note:
>Unticked means not yet (fully) implemented.

## Testing / developing for the js version
Requirements:
- node.js ( i think 8 or above )
- a nice attitude

How to:
1. Install node.js v8+ im pretty sure ( and therefore also npm )
1. Choose wher you want to test the bote
1. `npm install discord.js` thats the only req
1. Clone the `senpai.js` `cmds.js` and `config.json` files ( .py files are
   legacy )
1. You need a bot token to test with
1. To get a bot go to https://discordapp.com/developers/applications/me
1. Make a new bot ( or make use an existing one ( wait if you already have a
   bot why do you need this guide ))
1. Add a name and whatnot
1. Get the bot token and put the full string into the token field in
   `config.json`
1. Copy the bot id marked client id *not the token* into the client id field
   here: https://discordapi.com/permissions.html
1. *dubs, nice*
1. You don't need to bother ticking perms just invite it to your server (you
   gotta sign in and authenticate and what not)
1. It's super helpful to go in your discord settings -> appearance and enable
   developer mode
1. Copy your id by right clicking your profile picture and put it in the owner
   id field in `config.json`
1. At this point the bot should be workable, either run it with `node
   senpai.js` or if you're cool and use VS Code like me just press F5 while on
   the `senpai.js` file ( nice for debugging )
1. make sure to have fun
>if the program halts in vs code, make it continue running and it will show you
>the async discord error in the debug output
