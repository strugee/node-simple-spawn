/*
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

'use strict';

var childProcess = require('child_process');
var concatStream = require('concat-stream');

function maybeNewExecError(name, args, stderr, code, existingError) {
	// Returns a new error if all the necessary information is available

	if (typeof stderr === 'string' && typeof code === 'number' && code !== 0) {
		return new Error('Process `' + name + ' ' + args.join(' ') + '` exited with non-zero exit code ' + code + '; stderr is:\n' + stderr);
	} else {
		return undefined;
	}
}

module.exports = function smartSpawn(name, args, targetCwd, callback) {
	// Done here so it gets the right scope
	function maybeFireCallback() {
		// This function is called in any place where we might have completed a task that allows us to fire

		if (callbackFired) return;

		// If everything is ready, we *should* fire the callback, and it hasn't already been fired, then do so
		if (stdoutReady && stderrReady && wantCallback && !callbackFired) {
			callbackFired = true;
			callback(callbackErr, stdout);
		}
	}

	var process = childProcess.spawn(name, args, { cwd: targetCwd });

	// We want all this to synchronize callbacks with when stuff is done buffering, execing, etc.
	var callbackFired = false;
	var wantCallback = false;
	var exitCode;
	var callbackErr;
	var stdoutReady = false;
	var stderrReady = false;

	// Handle spawn errors
	process.on('error', function(err) {
		callbackErr = err;
		wantCallback = true;

		maybeFireCallback();
	});

	// Capture stderr in case we want it for an Error object
	var stderr;
	process.stderr.pipe(concatStream(function(buf) {
		stderr = buf.toString();
		stderrReady = true;

		callbackErr = callbackErr instanceof Error ? callbackErr : maybeNewExecError(name, args, stderr, exitCode, callbackErr);

		maybeFireCallback();
	}));

	// Capture stdout
	var stdout;
	process.stdout.pipe(concatStream(function(buf) {
		stdout = buf.toString();
		stdoutReady = true;

		maybeFireCallback();
	}));

	process.on('exit', function(code, signal) {
		// Handle non-zero exits

		exitCode = code;

		callbackErr = callbackErr instanceof Error ? callbackErr : maybeNewExecError(name, args, stderr, exitCode, callbackErr);

		wantCallback = true;
		maybeFireCallback();
	});

	return process;
};
