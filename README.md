# `smart-spawn`

[![Build Status](https://travis-ci.org/strugee/node-smart-spawn.svg?branch=master)](http://travis-ci.org/strugee/node-smart-spawn)
[![Coverage Status](https://coveralls.io/repos/github/strugee/node-smart-spawn/badge.svg?branch=master)](https://coveralls.io/github/strugee/node-smart-spawn?branch=master)
[![npm](https://img.shields.io/npm/v/smart-spawn.svg)](https://npmjs.com/package/smart-spawn)
[![Greenkeeper badge](https://badges.greenkeeper.io/strugee/node-smart-spawn.svg)](https://greenkeeper.io/)

Spawn an async process and get back stdout, handling errors

## Installation

    npm install smart-spawn

## Usage

You need Node 6+. It'll probably run on 0.10, 0.12 and 4 too, but the test suite doesn't cover those versions, so you're on your own. And you should upgrade anyway because those are horribly insecure.

```js
var smartSpawn = require('smart-spawn');

var process = smartSpawn('ls', ['-l'], process.cwd(), function(err, stdout) {
	if (err) throw err;

	console.log(stdout);
}
```

## Arguments

Arguments are, in order: the name of the process to spawn, arguments passed to the subprocess, the subprocess' working directory, and a callback function.

The callback receives two arguments. The first is an `Error` object which is passed if the process couldn't be spawned or if it exited with a nonzero exit code, otherwise it's `undefined`. The second is the process' stdout upon its completion (regardless of any errors that may have occured).

## Return value

`smart-spawn` will return an instance of [`ChildProcess`][1] representing the spawned subprocess.

## License

LGPL 3.0+

## Author

AJ Jordan <alex@strugee.net>

 [1]: https://nodejs.org/api/child_process.html#child_process_class_childprocess
