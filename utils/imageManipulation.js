import { readFileSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

import axios from 'axios'
import canvas from 'canvas'
import GIFEncoder from 'gifencoder'

const rootDir = dirname(dirname(fileURLToPath(import.meta.url)))
const imageDataDir = join(rootDir, 'data', 'image-manipulation')

const config = JSON.parse(readFileSync(join(rootDir, 'config.json'), 'utf8'))

/**
 * Get an image URL map for a given function name
 * - Otherwise write a blank file and return an empty object
 * @param {string} funcName - function name to find map for
 * @returns {{string:string}} Image URL map
 */
function readMap (funcName) {
  const filePath = join(imageDataDir, funcName + '.json')
  try {
    const map = JSON.parse(readFileSync(filePath, 'utf8'))
    return map
  } catch {
    writeFileSync(filePath, '{}', 'utf8')
    return {}
  }
}

/**
 * Save an image URL map for a given function name
 * @param {string} funcName - function name to find map for
 * @param {{string:string}} map - map to save
 */
function saveMap (funcName, map) {
  const filePath = join(imageDataDir, funcName + '.json')
  writeFileSync(filePath, JSON.stringify(map), 'utf8')
}

async function uploadToImgur (buffer, type) {
  try {
    const response = await axios.post('https://api.imgur.com/3/image', buffer, {
      headers: {
        'content-type': type,
        Authorization: `Client-ID ${config.imgurAPIKey}`
      }
    })
    return response.data.data.link
  } catch (error) {
    console.error('Failed to POST image to imgur.')
    console.error(error)
  }
}

/**
 * Animate a gif inverting the colours and flipping vertically
 * @param {string} imageURL - Image URL, `png` or `jpeg` only
 * @returns {string} Image URL to edited image
 */
export async function animInvert (imageURL) {
  const map = readMap('animInvert')
  if (imageURL in map) return map[imageURL]
  const image = await canvas.loadImage(imageURL)
  const cnv = canvas.createCanvas(image.width, image.height)
  const icnv = canvas.createCanvas(image.width, image.height)
  const ctx = cnv.getContext('2d')
  const ictx = icnv.getContext('2d')
  ictx.translate(0, cnv.height)
  ictx.scale(1, -1)
  ictx.drawImage(image, 0, 0)
  ictx.globalCompositeOperation = 'difference'
  ictx.fillStyle = 'white'
  ictx.fillRect(0, 0, image.width, image.height)

  const gif = new GIFEncoder(image.width, image.height)
  const stream = gif.createReadStream()
  gif.start()
  gif.setRepeat(-1)
  gif.setDelay(120)
  for (let i = 0; i < 11; i++) {
    ctx.globalAlpha = 1
    ctx.drawImage(image, 0, 0)
    ctx.globalAlpha = 0.1 * i
    ctx.drawImage(icnv, 0, 0)
    gif.addFrame(ctx)
  }
  gif.finish()
  const newURL = await uploadToImgur(stream.read(), 'image/gif')
  map[imageURL] = newURL
  saveMap('animInvert', map)
  return newURL
}

/**
 * Invert the colours and flip vertically
 * @param {string} imageURL - Image URL, `png` or `jpeg` only
 * @returns {string} Image URL to edited image
 */
export async function flipInvert (imageURL) {
  const map = readMap('flipInvert')
  if (imageURL in map) return map[imageURL]
  const image = await canvas.loadImage(imageURL)
  const cnv = canvas.createCanvas(image.width, image.height)
  const ctx = cnv.getContext('2d')
  ctx.translate(0, cnv.height)
  ctx.scale(1, -1)
  ctx.drawImage(image, 0, 0)
  ctx.globalCompositeOperation = 'difference'
  ctx.fillStyle = 'white'
  ctx.fillRect(0, 0, image.width, image.height)
  const newURL = await uploadToImgur(cnv.toBuffer('image/png'), 'image/png')
  map[imageURL] = newURL
  saveMap('flipInvert', map)
  return newURL
}
