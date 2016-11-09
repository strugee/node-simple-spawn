'use strict';

var assert = require('assert'),
    ChildProcess = require('child_process').ChildProcess,
    vows = require('vows');

var suite = vows.describe('Non-zero exit handling');

suite.addBatch({
	'When we require the module': {
		topic: function() {
			return require('../index.js');
		},
		'it works': function(spawn) {
			assert.isFunction(spawn);
		},
		'and spawn the `false` binary': {
			topic: function(spawn) {
				var callback = this.callback;
				var childProcess = spawn('false', [], process.cwd(), function(err, stdout) {
					callback(childProcess, err, stdout);
				});
			},
			'a `ChildProcess` object is returned': function(childProcess, err, stdout) {
				assert.isObject(childProcess);

				try {
					assert(childProcess instanceof ChildProcess);
				} catch (e) {
					// Node 0.10 hack
					if (e instanceof TypeError) {
						assert(childProcess.pid);
					} else {
						throw e;
					}
				}
			},
			'an error is sent to the callback': function(childProcess, err, stdout) {
				assert(err);
				assert.equal(err.toString(), 'Error: Process `false ` exited with non-zero exit code 1; stderr is:\n');
			},
			'the result is the empty string': function(childProcess, err, stdout) {
				assert.equal(stdout, '');
			}
		}
	}
});

suite['export'](module);
