# tdag

> Manage tasks as a directed acyclic graph.

<center><img src="https://github.com/hackergrrl/tdag/raw/master/screenshot.png"/></center>

## Table of Contents

- [Background](#background)
- [Install](#install)
- [Usage](#usage)
- [Maintainers](#maintainers)
- [Contribute](#contribute)
- [License](#license)

## Stability: Experimental

I'm still experimenting regularly with tdag: its current state may not reflect
its future state much at all. Use with caution: commands or underlying database
structure may change without warning!

## Background

So many task management systems structure tasks as lists, or, in the better
case, as trees. However, neither accurately captures the aspect of multiple
parents. What we really need is a *directed acyclic graph* (DAG) to express the
more complex relationships that tasks tend to have.

I like modeling my problems as potentially deep graphs that capture the
top-level problem statement, all the way down to the discrete concrete tasks I
need to do to work up one level of abstraction to the next layer of tasks.
Oftentimes completing one task ought to free up multiple tasks all over my task
set, which a graph captures well.

tdag offers the `tg` command, which provides quick command line access to your
task graph. `tg` wants to be really good at understanding task blockages and
dependencies, in order to excel at answering the question, "What things can I
work on *now*?".

## Install

```
npm install -g tdag
```

## Usage

```
USAGE: tg

  tg
    print all top-level tasks

  tg ID
    print the dependency tree rooted at ID

  tg add "fix hyperlog dataset issues"
    insert task at root

  tg add ID "regenerate corrupted indexes"
    add task that is a dependency of todo #ID

  tg ready
    print all tasks that are ready to be worked on

  tg done ID
    mark a task as done

  tg block ID
  tg unblock ID
    mark a task as blocked or unblocked
```

## Example Use

TODO: expand on this!

```
sww@figure8 $ tg ready
0   ° Try to use tdag for a real project
  1   » foo
    2   ✓ bar
  2   ✓ bar
  3   » finish readme

sww@figure8 $ tg done 3

sww@figure8 $ tg ready
0   ° Try to use tdag for a real project
  1   » foo
    2   ✓ bar
  2   ✓ bar
  3   ✓ finish readme

```

## Background: Operation

`tg` manipulates a file named `todo.json` in your current directory. This is
nice for easy per-project use, but might not always be desirable and may change
in the future.

`tg` operates on a plain JSON file. This is convenient right now, but may change
in the future. However, tdag will always operate on *human readable text
formats*!

## License

MIT
