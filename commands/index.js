import dabsStruct from './dabs/struct.js'
import dabsAction from './dabs/action.js'
import fortuneStruct from './fortune/struct.js'
import fortuneAction from './fortune/action.js'
import haahStruct from './haah/struct.js'
import haahAction from './haah/action.js'
import imagesearchStruct from './image-search/struct.js'
import imagesearchAction from './image-search/action.js'
import lastfmStruct from './last-fm/struct.js'
import lastfmAction from './last-fm/action.js'
/*
import rollStruct from './roll/struct.js'
import rollAction from './roll/action.js'
import timezoneStruct from './timezone/struct.js'
import timezoneAction from './timezone/action.js'
import urbandictionaryStruct from './urban-dictionary/struct.js'
import urbandictionaryAction from './urban-dictionary/action.js'
import youtubesearchStruct from './youtube-search/struct.js'
import youtubesearchAction from './youtube-search/action.js'
*/
export default [
  { name: 'dabs', struct: dabsStruct, action: dabsAction },
  { name: 'fortune', struct: fortuneStruct, action: fortuneAction },
  { name: 'haah', struct: haahStruct, action: haahAction },
  { name: 'image-search', struct: imagesearchStruct, action: imagesearchAction },
  { name: 'last-fm', struct: lastfmStruct, action: lastfmAction }
  /*
  { name: 'roll', struct: rollStruct, action: rollAction },
  { name: 'timezone', struct: timezoneStruct, action: timezoneAction },
  { name: 'urban-dictionary', struct: urbandictionaryStruct, action: urbandictionaryAction },
  { name: 'youtube-search', struct: youtubesearchStruct, action: youtubesearchAction },
  */
]
