import '../typedefs.js'

/**
 * Compare two Application Command Options
 * @param {ApplicationCommandOption} live
 * @param {ApplicationCommandOption} target
 */
function compareOptions (live, target) {
  // Basic properties
  if (live.type !== target.type) {
    console.log('Type mismatch')
    return false
  }
  if (live.description !== target.description) {
    console.log('Description mismatch')
    return false
  }
  if (live.required != target.required) {
    console.log('Required? mismatch')
    return false
  }
  // Choices
  if (
    (live.choices == null && target.choices != null) ||
    (live.choices != null && target.choices == null)
  ) {
    console.log('Choices? mismatch')
    return false
  }
  if (target.choices != null) {
    if (live.choices.length !== target.choices.length) {
      console.log('Choice length mismatch')
      return false
    }
    for (let choice of target.choices) {
      let liveChoice = live.choices.find(c => c.name === choice.name)
      if (liveChoice == null) {
        console.log(`Missing choice ${choice.name}`)
        return false
      }
      if (liveChoice.value !== choice.value) {
        console.log(`Choice ${choice.name} value mismatch`)
        return false
      }
    }
  }
  // Options
  if (
    (live.options == null && target.options != null) ||
    (live.options != null && target.options == null)
  ) {
    console.log('Options? mismatch')
    return false
  }
  if (target.options != null) {
    if (live.options.length !== target.options.length) {
      console.log('Option length mismatch')
      return false
    }
    for (let option of target.options) {
      let liveOption = live.options.find(o => o.name === option.name)
      if (liveOption == null) {
        console.log(`Missing option ${option.name}`)
        return false
      }
      if (!compareOptions(liveOption, option)) {
        console.log(`Option ${option.name} mismatch`)
        return false
      }
    }
  }
  return true
}

/**
 * Compare two Applicaiton Commands
 * @param {ApplicationCommand} live - struct currently on Discord servers
 * @param {ApplicationCommand} target - struct defined in config files
 */
export default function (live, target) {
  // Basic properties
  if (live.description !== target.description) {
    console.log('Description mismatch')
    return false
  }
  if (
    (live.options == null && target.options != null) ||
    (live.options != null && target.options == null)
  ) {
    console.log('Options? mismatch')
    return false
  }
  // Options
  if (target.options != null) {
    if (live.options.length !== target.options.length) {
      console.log('Option length mismatch')
      return false
    }
    for (let option of target.options) {
      let liveOption = live.options.find(o => o.name === option.name)
      if (liveOption == null) {
        console.log(`Missing option ${option.name}`)
        return false
      }
      if (!compareOptions(liveOption, option)) {
        console.log(`Option ${option.name} mismatch`)
        return false
      }
    }
  }
  return true
}
