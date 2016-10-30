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

var childProcess = require('child_process');
var concatStream = require('concat-stream');

module.exports = function smartSpawn(name, args, targetCwd, callback) {
	// Done here so it gets the right scope
	function maybeFireCallback() {
		// This function is called in any place where we might have completed a task that allows us to fire

		if (callbackFired || callbackFiredErr) return;

		// If everything is ready, we *should* fire the callback, and it hasn't already been fired, then do so
		if (stdoutReady && stderrReady && wantCallback && !callbackFired) {
			callbackFired = true;
			callback(null, stdout);
		}

		// Ditto for the callback with an error argument
		if (stdoutReady && stderrReady && wantCallbackError && !callbackFiredErr) {
			callbackFiredErr = true;
			callback(callbackErr);
		}
	}

	var process = childProcess.spawn(name, args, { cwd: targetCwd });

	// We need all this to synchronize callbacks with when stuff is done buffering, execing, etc.
	var callbackFired = false;
	var callbackFiredErr = false;
	var wantCallback = false;
	var wantCallbackError = false;
	var callbackErr;
	var stdoutReady = false;
	var stderrReady = false;

	// Handle spawn errors
	process.on('error', function(err) {
		callbackErr = err;
		wantCallbackError = true;

		maybeFireCallback();
	});

	// Capture stderr in case we need it for an Error object
	var stderr;
	process.stderr.pipe(concatStream(function(buf) {
		stderr = buf.toString();
		stderrReady = true;

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
		if (code !== 0) {
			callbackErr = new Error('Process `' + name + ' ' + args.join(' ') + '` exited with non-zero exit code' + code + '; stderr is:\n' + stderr);
			wantCallbackError = true;

			maybeFireCallback();

			return;
		}

		wantCallback = true;
		maybeFireCallback();
	});

	return process;
};
