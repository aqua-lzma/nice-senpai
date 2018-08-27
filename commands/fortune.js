module.exports = {
  title: 'Fortune',
  desc: [
    '[s4s] Rule #1: You must check your #fortune in order to post on this board.',
    '*Note: Moderators must check their #fortune as well.*'
  ].join('\n'),
  syntax: '`{prefix}fortune`',
  alias: ['fortune'],
  owner_only: false,
  affect_config: false,
  action: (message, config) => {
    let output
    if (Math.floor(Math.random() * 100) === 0) { // Rare replies
      output = [
        {color: 0x2600D0, title: 'Your fortune: le ebin dubs xDDDDDDDDDDDD'},
        {color: 0x2A56FB, title: 'Your fortune: you gon\' get some dick'},
        {color: 0xE941E3, title: 'Your fortune: ayy lmao'},
        {color: 0xFF0000, title: 'Your fortune: (YOU ARE BANNED)'},
        {color: 0x68923A, title: 'Your fortune: Get Shrekt'},
        {color: 0x8C8C8C, title: 'Your fortune: YOU JUST LOST THE GAME'}
      ][Math.floor(Math.random() * 6)]
    } else {
      output = [
        {color: 0xF51C6A, title: 'Your fortune: Reply hazy, try again'},
        {color: 0xFD4D32, title: 'Your fortune: Excellent Luck'},
        {color: 0xE7890C, title: 'Your fortune: Good Luck'},
        {color: 0xBAC200, title: 'Your fortune: Average Luck'},
        {color: 0x7FEC11, title: 'Your fortune: Bad Luck'},
        {color: 0x43FD3B, title: 'Your fortune: Good news will come to you by mail'},
        {color: 0x16F174, title: 'Your fortune: （　´_ゝ`）ﾌｰﾝ '},
        {color: 0x00CBB0, title: 'Your fortune: ｷﾀ━━━━━━(ﾟ∀ﾟ)━━━━━━ !!!!'},
        {color: 0x0893E1, title: 'Your fortune: You will meet a dark handsome stranger'},
        {color: 0x2A56FB, title: 'Your fortune: Better not tell you now'},
        {color: 0x6023F8, title: 'Your fortune: Outlook good'},
        {color: 0x9D05DA, title: 'Your fortune: Very Bad Luck'},
        {color: 0xD302A7, title: 'Your fortune: Godly Luck'}
      ][Math.floor(Math.random() * 13)]
    }
    message.channel.send('', {embed: output})
  }
}
