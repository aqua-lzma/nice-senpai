module.exports = function (liveStruct, targetStruct) {
  // Names should match already

  console.log(`Comparing ${liveStruct.name} command structs . . .`)
  if (liveStruct.type !== targetStruct.type) {
    console.log("Type doesn't match")
    console.log(`Live: ${liveStruct.type} - Target: ${targetStruct.type}`)
    return false
  }
  if (liveStruct.description !== targetStruct.description) {
    console.log("Description doesn't match")
    console.log(`Live: ${liveStruct.description} - Target: ${targetStruct.description}`)
    return false
  }
  if (liveStruct.options == null && targetStruct.options != null) {
    console.log('Live version is missing options')
    return false
  }
  if (liveStruct.options != null && targetStruct.options == null) {
    console.log('Live version has unecessary options')
    return false
  }
  if (targetStruct.options != null) {
    if (liveStruct.options.length !== targetStruct.options.length) {
      console.log("Number of options doesn't match")
      console.log(`Live: ${liveStruct.option.length} - Target: ${targetStruct.option.length}`)
      return false
    }
    for (let targetOption of targetStruct.options) {
      let liveOption = liveStruct.options.find(option => option.name === targetOption.name)
      if (liveOption == null) {
        console.log(`Missing option ${targetOption.name}`)
        return false
      }
    }
  }
  return true
}
