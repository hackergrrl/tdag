#! /usr/bin/env node

var fs = require('fs')
var path = require('path')

if (process.argv.length <= 2) {
  exit(1)
}

function exit (code) {
  fs.createReadStream(path.join(__dirname, 'USAGE')).pipe(process.stdout)
  process.stdout.on('end', function () {
    process.exit(code)
  })
}

// tdag
//   lists all top-level items
// tdag add "fix hyperlog dataset issues"
//   insert todo at root, print ID
// tdag add-dep ID "regen waoroni log /wo corruption"
//   add todo that is a dep of todo ID

