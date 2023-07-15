const path = require('path')
const fs = require('fs')

const getFiles = source =>
  fs.readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isFile())
    .map(dirent => dirent.name)
    .filter(filename => filename.split('.')[1] == 'js')

let functionsDir = path.join(__dirname, '../functions')
if(!fs.existsSync(functionsDir)){
    fs.mkdirSync(functionsDir)
}
let files = getFiles(functionsDir)

let functions = {}
for(let i = 0; i < files.length; i++){
    let [ name ] = files[i].split('.')
    functions[name] = require(path.join(functionsDir, name))
}

framework.functions = functions
module.exports = functions