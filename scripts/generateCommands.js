import { readdirSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const script = fileURLToPath(import.meta.url)
const scriptsDir = dirname(script)
const rootDir = dirname(scriptsDir)
const commandsDir = join(rootDir, 'commands')
const commandFiles = readdirSync(commandsDir)
const commandList = commandFiles.filter(a => a !== 'index.js' && a !== 'template')

let indexString = ''
for (const commandDir of commandList) {
  const varName = commandDir.split('-').join('_')
  indexString += `import ${varName}Struct from './${commandDir}/struct.js'\n`
  indexString += `import ${varName}Action from './${commandDir}/action.js'\n`
}
indexString += 'export default [\n'
for (const commandDir of commandList) {
  const varName = commandDir.split('-').join('_')
  indexString += `  { name: '${commandDir}', struct: ${varName}Struct, action: ${varName}Action },\n`
}
indexString += ']\n'

const commandsIndex = join(commandsDir, 'index.js')
writeFileSync(commandsIndex, indexString, 'utf8')
