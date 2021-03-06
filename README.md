# Nice-Senpai

[![Node.js CI](https://github.com/aqua-lzma/Nice-Senpai/actions/workflows/node.js.yml/badge.svg)](https://github.com/aqua-lzma/Nice-Senpai/actions/workflows/node.js.yml)

nice bot
does dabs and stuff...

Server invite links: (You need **administrator** permission in the server to invite bots.)

- [Nice-Senpai](https://discord.com/oauth2/authorize?client_id=259661803657625610&scope=bot&permissions=52288)
- [Ebil-Senpai](https://discord.com/api/oauth2/authorize?client_id=359315691825922049&permissions=0&scope=applications.commands%20bot) (Development Version)

## Installation / Contribution

### Main project

```
git clone https://github.com/aqua-lzma/nice-senpai
cd nice-senpai
npm i
cp config.json.example config.json
```

### Populating `config.json`-`token`:

1. Go to [Discord Devlopers Portal](https://discord.com/developers/applications)
2. **New application** (button in top right) (name can be anything)
3. **Settings** -> **Bot**: **Add Bot**
4. **Click to Reveal Token**: This is the `token` for `config.json`
5. **Priviliged Gateway Intents**: Tick ``Presence intent` and `Server members intent`
6. **Settings** -> **OAuth2**: In **Scopes** tick `bot` and `applications.commands`
7. Go to the generated URL and invite the bot to a server

### Populating `config.json`-`testGuild`:

1. In `config.json` change `testMode` to `true` unless you want to wait an hour for command struct changes to go live
2. For this to work you need set `testGuild` to a guild ID

#### To easily copy guild IDs:
1. In Discord:
2. **User settings** -> **Appearance** -> **Advanced**: Tick `Developer Mode`
3. *Right click a guild*: `Copy ID`

### Populating `config.json`-`imgurAPIKey` (optional):

1. Create a new imgur client [here](https://api.imgur.com/oauth2/addclient)
2. **Application name:** can be anything (put `nice-senpai`)
3. **Authorization type:** `OAauth 2 authorization without a callback URL`
4. **Email:** *your email*
5. **Client ID**: This is the `imgurAPIKey` for `config.json`

### Running the bot

```
node senpai.js
```

### Merging changes

1. Fork this repo
2. Make a pull request to merge with your fork

*Stop asking me to make you a contributor.*
