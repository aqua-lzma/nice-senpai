import { readFileSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

import canvas from 'canvas'
import axios from 'axios'

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
  const buffer = cnv.toBuffer('image/png')
  try {
    const response = await axios.post('https://api.imgur.com/3/image', buffer, {
      headers: {
        'content-type': 'image/png',
        Authorization: `Client-ID ${config.imgurAPIKey}`
      }
    })
    const newURL = response.data.data.link
    map[imageURL] = newURL
    saveMap('flipInvert', map)
    return newURL
  } catch (error) {
    console.error('Failed to POST image to imgur.')
    console.error(error)
  }
}
