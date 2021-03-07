import dabsStruct from './dabs/struct.js'
import dabsAction from './dabs/action.js'
import fortuneStruct from './fortune/struct.js'
import fortuneAction from './fortune/action.js'
import haahStruct from './haah/struct.js'
import haahAction from './haah/action.js'
/*
import image_searchStruct from './image-search/struct.js'
import image_searchAction from './image-search/action.js'
import last_fmStruct from './last-fm/struct.js'
import last_fmAction from './last-fm/action.js'
import rollStruct from './roll/struct.js'
import rollAction from './roll/action.js'
import timezoneStruct from './timezone/struct.js'
import timezoneAction from './timezone/action.js'
import urban_dictionaryStruct from './urban-dictionary/struct.js'
import urban_dictionaryAction from './urban-dictionary/action.js'
import youtube_searchStruct from './youtube-search/struct.js'
import youtube_searchAction from './youtube-search/action.js'
*/
export default [
  { name: 'dabs', struct: dabsStruct, action: dabsAction },
  { name: 'fortune', struct: fortuneStruct, action: fortuneAction },
  { name: 'haah', struct: haahStruct, action: haahAction },
  /*
  { name: 'image-search', struct: image_searchStruct, action: image_searchAction },
  { name: 'last-fm', struct: last_fmStruct, action: last_fmAction },
  { name: 'roll', struct: rollStruct, action: rollAction },
  { name: 'timezone', struct: timezoneStruct, action: timezoneAction },
  { name: 'urban-dictionary', struct: urban_dictionaryStruct, action: urban_dictionaryAction },
  { name: 'youtube-search', struct: youtube_searchStruct, action: youtube_searchAction },
  */
]
