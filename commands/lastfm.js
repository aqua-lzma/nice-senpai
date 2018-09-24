const request = require('request')
const Jimp = require('jimp')
const { RichEmbed } = require('discord.js')

function embedHeader (user) {
  return new Promise((resolve, reject) => {
    const req = [
      'http://ws.audioscrobbler.com/2.0/?method=user.getinfo',
      'format=json',
      `user=${encodeURIComponent(user)}`,
      `api_key=${apiKey}`
    ].join('&')
    request.get(req, (err, res, body) => {
      if (err) return reject(err)
      const json = JSON.parse(body)
      if (json.error) return reject(err)
      resolve(new RichEmbed({
        author: {
          name: json.user.name,
          url: json.user.url,
          icon_url: json.user.image[2]['#text']
        },
        title: `Joined: ${(new Date(Number(json.user.registered.unixtime + '000'))).toDateString()}\nScrobbles: ${json.user.playcount}`
      }))
    })
  })
}

function recentTracks (user) {
  return new Promise((resolve, reject) => {
    embedHeader(user)
      .then(embed => {
        const req = [
          'http://ws.audioscrobbler.com/2.0/?method=user.getRecentTracks',
          'format=json',
          'limit=5',
          `user=${encodeURIComponent(user)}`,
          `api_key=${apiKey}`
        ].join('&')
        request.get(req, (err, res, body) => {
          if (err) reject(err)
          const json = JSON.parse(body)
          for (let track of json.recenttracks.track) {
            const title = track['@attr'] ? 'Now playing' : track['date']['#text']
            const value = [
              `Title: ${track['name']}`,
              `Artist: ${track['artist']['#text']}`,
              `Album: ${track['album']['#text']}`
            ].join('\n')
            embed.addField(title, value)
            resolve(embed)
          }
        })
      })
  })
}

function gen9x9 (urls) {
  return new Promise((resolve, reject) => {
    new Jimp(522, 522, (err, image) => {
      if (err) reject(err)
      const images = []
      for (let url of urls) {
        images.push(Jimp.read(url))
      }
      Promise.all(images).then(images => {
        let x = 0
        let y = 0
        for (let i of images) {
          image.composite(i, x * 174, y * 174)
          x++
          if (x > 2) {
            x = 0
            y++
          }
        }
        image.getBuffer(Jimp.MIME_PNG, (err, buff) => {
          if (err) reject(err)
          request.post({
            url: 'https://api.imgur.com/3/image',
            body: buff,
            headers: {
              'Authorization': 'Client-ID 5433bb1be44d1ba',
              'content-type': 'image/png'
            }
          }, (err, res, body) => {
            if (err) reject(err)
            const json = JSON.parse(body)
            resolve(json.data.link)
          })
        })
      })
    })
  })
}

function topAlbums (user, period) {
  return new Promise((resolve, reject) => {
    embedHeader(user)
      .then(embed => {
        const req = [
          `http://ws.audioscrobbler.com/2.0/?method=user.getTopAlbums`,
          'format=json',
          'limit=9',
          `period=${period}`,
          `user=${encodeURIComponent(user)}`,
          `api_key=${apiKey}`
        ].join('&')
        request.get(req, (err, res, body) => {
          if (err) reject(err)
          const json = JSON.parse(body)
          const urls = []
          for (let album of json.topalbums.album) {
            embed.addField(
              `${album['@attr'].rank}: ${album.artist.name} - ${album.name}`,
              `${album.playcount} listens. [link](${album.url})`
            )
            urls.push(album.image[2]['#text'] ? album.image[2]['#text'] : '../resources/default-album-cover.png')
          }
          gen9x9(urls).then(imgurl => {
            embed.setThumbnail(imgurl)
            resolve(embed)
          })
        })
      })
  })
}

function topArtists (user, period) {
  return new Promise((resolve, reject) => {
    embedHeader(user)
      .then(embed => {
        const req = [
          `http://ws.audioscrobbler.com/2.0/?method=user.getTopArtists`,
          'format=json',
          'limit=9',
          `period=${period}`,
          `user=${encodeURIComponent(user)}`,
          `api_key=${apiKey}`
        ].join('&')
        request.get(req, (err, res, body) => {
          if (err) reject(err)
          const json = JSON.parse(body)
          const urls = []
          for (let artist of json.topartists.artist) {
            embed.addField(
              `${artist['@attr'].rank}: ${artist.name}`,
              `${artist.playcount} listens. [link](${artist.url})`
            )
            urls.push(artist.image[2]['#text'] ? artist.image[2]['#text'] : '../resources/default-artist-art.png')
          }
          gen9x9(urls).then(imgurl => {
            embed.setThumbnail(imgurl)
            resolve(embed)
          })
        })
      })
  })
}

function topTracks (user, period) {
  return new Promise((resolve, reject) => {
    embedHeader(user)
      .then(embed => {
        const req = [
          `http://ws.audioscrobbler.com/2.0/?method=user.getTopTracks`,
          'format=json',
          'limit=9',
          `period=${period}`,
          `user=${encodeURIComponent(user)}`,
          `api_key=${apiKey}`
        ].join('&')
        request.get(req, (err, res, body) => {
          if (err) reject(err)
          const json = JSON.parse(body)
          const urls = []
          for (let track of json.toptracks.track) {
            embed.addField(
              `${track['@attr'].rank}: ${track.artist.name} - ${track.name}`,
              `${track.playcount} listens. [link](${track.url})`
            )
            urls.push(track.image[2]['#text'] ? track.image[2]['#text'] : '../resources/default-album-cover.png')
          }
          gen9x9(urls).then(imgurl => {
            embed.setThumbnail(imgurl)
            resolve(embed)
          })
        })
      })
  })
}

const periods = [
  'overall',
  '7day',
  '1month',
  '3month',
  '6month',
  '12month'
]

let apiKey = ''

module.exports = {
  title: 'Last fm',
  desc: [
    'Look up a users information on last.fm.',
    'Can display their 5 most recently played tracks and what they are currently playing.',
    'Can also show top albums, artists or tracks within a specified time frame.',
    'Also makes a lovely collage of the album covers or artist art.',
    '*Saucybot more like lambebot.* 😈'
  ].join('\n'),
  syntax: [
    '`{prefix}lf <username>` Shows the recently played tracks of a user.',
    '`{prefix}lf recent <username>` Same as above.',
    '`{prefix}lf <albums | artists | tracks> <username>` Shows the top 9 albums, artists or tracks of the user respectively. With a lovely collage.',
    '`{prefix}lf <albums | artists | tracks> <overall | 7day | 1month | 3month | 6month | 12month> <username>` Same as above except for a specific time frame. Default is overall.'
  ].join('\n'),
  alias: ['lf', 'lastfm', 'last.fm'],
  owner_only: false,
  affect_config: false,
  action: function (message, config) {
    apiKey = config.lastfmApiKey
    let content = message.content.toLowerCase().split(' ')
    let user = content[1]
    let period = 'overall'
    let embed
    switch (content[1]) {
      case 'albums':
        user = content[2]
        if (periods.indexOf(content[2]) > -1) { period = content[2]; user = content[3] }
        embed = topAlbums(user, period)
        break
      case 'artists':
        user = content[2]
        if (periods.indexOf(content[2]) > -1) { period = content[2]; user = content[3] }
        embed = topArtists(user, period)
        break
      case 'tracks':
        user = content[2]
        if (periods.indexOf(content[2]) > -1) { period = content[2]; user = content[3] }
        embed = topTracks(user, period)
        break
      case 'recent':
        embed = recentTracks(content[2])
        break
      default:
        embed = recentTracks(user)
    }
    message.channel.startTyping()
    embed.then(embed => {
      message.channel.send('', embed).then(() => message.channel.stopTyping())
    })
  }
}
