# Nice-Senpai

[![Node.js CI](https://github.com/aqua-lzma/Nice-Senpai/actions/workflows/node.js.yml/badge.svg)](https://github.com/aqua-lzma/Nice-Senpai/actions/workflows/node.js.yml)

nice bot
does dabs and stuff...

Server invite links: (You need **administrator** permission in the server to invite bots.)

- [Nice-Senpai](https://discord.com/oauth2/authorize?client_id=259661803657625610&scope=bot&permissions=52288)
- [Ebil-Senpai](https://discord.com/api/oauth2/authorize?client_id=359315691825922049&permissions=0&scope=applications.commands%20bot) (Development Version)

## Installation / Contribution

### Setting up a bot user

1. Go to [Discord devlopers portal](https://discord.com/developers/applications).
2. Make a new application (button in top right).
3. Create a bot user (bot settings in the tab on the right).
4. Make sure `Requires OAuth2 Code Grant` is disabled and the two `Privileged Gateway Intents` are enabled.
5. Make a invite link by going to the OAuth2 tab on the left. Enable `bot` and `applications.commands` scopes. Go to the generated link.
6. Invite the bot to whatever server you're testing on.
7. Get the token from the bot tab

### Running the bot

```
git clone https://github.com/aqua-lzma/nice-senpai
cd nice-senpai
npm i
cp config.json.example config.json
```
Put the bot token in the `token` field in `config.json`
```
node senpai.js
```

### Merging changes

1. Fork this repo.
2. Make a pull request to merge with your fork.

*Stop asking me to make you a contributor.*
