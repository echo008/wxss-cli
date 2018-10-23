const fs = require('fs')
const path = require('path')
const chokidar = require('chokidar')
const chalk = require('chalk')
const less = require('less')

function convertExt(fpath) {
  return fpath.replace(/(.css|.less)$/, '.wxss')
}

function writeFile(fpath) {
  let content = fs.readFileSync(fpath, 'utf-8')
  less.render(content, {
    filename: path.resolve(fpath)
  }).then(({css}) => {
    fs.writeFileSync(convertExt(fpath), css)
  }).catch(error => {
    console.log()
    console.log(chalk.bgRed.white(error))
  })
}

function log(msg, color) {
  console.log(chalk[color](msg))
}

module.exports = dpath => {
  let len = dpath.length - 1
  if (dpath[len] === '\\') dpath = dpath.substring(0, len)
  const watch = chokidar.watch([`${dpath}/**/*.css`, `${dpath}/**/*.less`])
  watch
    .on('add', fpath => {
      writeFile(fpath)
      log(`Add ${fpath} success!`, 'green')
    })
    .on('change', fpath => {
      writeFile(fpath)
      log(`Change ${fpath} success!`, 'blue')
    })
    .on('unlink', fpath => {
      fs.unlinkSync(convertExt(fpath))
      log(`Unlink ${fpath} success!`, 'red')
    })
}