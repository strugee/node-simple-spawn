#!/usr/bin/env node

var exitCode = process.argv[2],
    stdoutText = process.argv[3],
    stderrText = process.argv[4];

console.log(stdoutText);
console.error(stderrText);

process.exitCode = exitCode;
