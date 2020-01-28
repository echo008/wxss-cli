#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const program = require('commander')
const chalk = require('chalk')
const watch = require('../lib/watch.js')

program
  .version(require('../package').version)
  .usage('<path> [other-path...]')

program
  .arguments('<path> [other-path...]')
  .action((frist, others) => {
    const dirs = [frist, ...(others || [])];
    dirs.forEach(dir => {
      fs.stat(dir, (err, stats) => {
        if (err) console.log(chalk.yellow(err))
        else {
          console.log(chalk.white(`watching ${dir} ... `))
          watch(dir)
        }
      })
    });
    console.log(chalk.bgMagenta.white(' wxss is running... '))
  })

program
  .on('--help', () => {
    console.log()
    console.log(`  Run ${chalk.cyan(`wxss <command> --help`)} for detailed usage of given command.`)
    console.log()
  })

program.parse(process.argv)
