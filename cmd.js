#! /usr/bin/env node

var fs = require('fs')
var path = require('path')
var args = require('minimist')(process.argv)
var defined = require('defined')
var chalk = require('chalk')

if (process.argv.length <= 2) {
  exit(1)
}

if (args._[2] === 'add') {
  var description = args._.slice(3).join(' ')
  var db = load()
  var idx = db.idx++
  var task = {
    description: description,
    deps: [],
    state: 'todo'
  }

  var pId = defined(args.parent, args.p, undefined)
  if (pId !== undefined) {
    var parent = db.tasks[pId]
    parent.deps.push(idx)
  }

  db.tasks[idx] = task
  save(db)

  console.log(idx + ': ' + description)

  process.exit(0)
}

else if (args._[2] === 'query') {
  var db = load()
  Object.keys(db.tasks).forEach(function (id) {
    var task = db.tasks[id]
    if (getParents(db, id).length === 0) {
      console.log(id + '   ° ' + task.description)
    }
  })

  process.exit(0)
}

else if (args._[2] === 'ready') {
  var db = load()
  var tasks = getTopLevel(db)

  var indent = 0
  tasks.forEach(function (id) {
    indent = 1
    print(id)
  })

  function print (id) {
    var task = db.tasks[id]
    var state = getTaskState(db, id)
    var sigil = getStateSymbol(state)
    var text = getStateTextColorFn(state)(task.description)
    console.log(whitespace(indent) + id + '   ' + sigil + ' ' + text)
    var origIndent = indent + 2
    task.deps.forEach(function (id) {
      indent = origIndent
      print(id)
    })
  }
}

else if (args._.length === 4 && args._[2] === 'done') {
  var id = args._[3]
  var db = load()
  var task = db.tasks[id]
  var state = getTaskState(db, id)
  if (state === 'ready') {
    task.state = 'done'
    save(db)
  } else {
    console.log('Cannot mark DONE: task is blocked!')
  }
}

else {
  // TODO: look up a specific task by its ID
}

function exit (code) {
  fs.createReadStream(path.join(__dirname, 'USAGE')).pipe(process.stdout)
  process.stdout.on('end', function () {
    process.exit(code)
  })
}

function load () {
  if (fs.existsSync('todo.json')) {
    return JSON.parse(fs.readFileSync('todo.json'))
  } else {
    return {
      idx: 0,
      tasks: {}
    }
  }
}

function save (db) {
  fs.writeFileSync('todo.json', JSON.stringify(db, null, 2))
}

function getParents (db, pid) {
  var parents = []
  Object.keys(db.tasks).forEach(function (id) {
    var task = db.tasks[id]
    if (task.deps.indexOf(Number(pid)) !== -1) {
      parents.push(id)
    }
  })
  return parents
}

function getTopLevel (db) {
  var res = []
  Object.keys(db.tasks).forEach(function (id) {
    var task = db.tasks[id]
    if (getParents(db, id).length === 0) {
      res.push(id)
    }
  })
  return res
}

function whitespace (num) {
  var res = ''
  for (var i=0; i < num; i++) {
    res += ' '
  }
  return res
}

function getTaskState (db, id) {
  var task = db.tasks[id]

  function done (id) {
    return db.tasks[id].state === 'done'
  }

  if (task.state === 'todo' && task.deps.every(done)) {
    return 'ready'
  } else if (task.state === 'todo' && !task.deps.every(done)) {
    return 'blocked'
  } else if (task.state === 'done') {
    return 'done'
  } else {
    oops(1)
  }
}

function getStateSymbol (state) {
  if (state === 'ready') return chalk.blue('o')
  else if (state === 'done') return chalk.green('✓')
  else if (state === 'blocked') return chalk.red('✖')
  else oops(2)
}

function getStateTextColorFn (state) {
  if (state === 'ready') return chalk.bold.blue
  else if (state === 'done') return chalk.bold.green
  else if (state === 'blocked') return chalk.bold.red
  else oops(3)
}

function oops (id) {
  throw new Error('oops, I did not consider this case! fix me! id = ' + id)
}
// tdag
//   lists all top-level items
// tdag add "fix hyperlog dataset issues"
//   insert todo at root, print ID
// tdag add-dep ID "regen waoroni log /wo corruption"
//   add todo that is a dep of todo ID

