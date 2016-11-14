'use strict';

var assert = require('assert'),
    vows = require('vows'),
    childProcessTest = require('./lib/childprocess-object.js');

var suite = vows.describe('Non-zero exit handling with complex outputs');

suite.addBatch({
	'When we require the module': {
		topic: function() {
			return require('../index.js');
		},
		'it works': function(spawn) {
			assert.isFunction(spawn);
		},
		'and spawn a process that will fail and output to stdout': {
			topic: function(spawn) {
				var callback = this.callback;
				var childProcess = spawn('test/lib/test-output.js', ['1', 'foo', ''], process.cwd(), function(err, stdout) {
					callback(childProcess, err, stdout);
				});
			},
			'a `ChildProcess` object is returned': childProcessTest,
			'an error is sent to the callback': function(childProcess, err, stdout) {
				assert(err);
				assert.equal(err.toString(), 'Error: Process `test/lib/test-output.js 1 foo ` exited with non-zero exit code 1; stderr is:\n\n');
			},
			'the result is `foo`': function(childProcess, err, stdout) {
				assert.equal(stdout, 'foo\n');
			}
		},
		'and spawn a process that will fail and output to stderr': {
			topic: function(spawn) {
				var callback = this.callback;
				var childProcess = spawn('test/lib/test-output.js', ['1', '', 'bar'], process.cwd(), function(err, stdout) {
					callback(childProcess, err, stdout);
				});
			},
			'a `ChildProcess` object is returned': childProcessTest,
			'an error is sent to the callback': function(childProcess, err, stdout) {
				assert(err);
				assert.equal(err.toString(), 'Error: Process `test/lib/test-output.js 1  bar` exited with non-zero exit code 1; stderr is:\nbar\n');
			},
			'the result is a single newline': function(childProcess, err, stdout) {
				assert.equal(stdout, '\n');
			}
		},
		'and spawn a process that will fail and output to both stdout and stderr': {
			topic: function(spawn) {
				var callback = this.callback;
				var childProcess = spawn('test/lib/test-output.js', ['1', 'foo', 'bar'], process.cwd(), function(err, stdout) {
					callback(childProcess, err, stdout);
				});
			},
			'a `ChildProcess` object is returned': childProcessTest,
			'an error is sent to the callback': function(childProcess, err, stdout) {
				assert(err);
				assert.equal(err.toString(), 'Error: Process `test/lib/test-output.js 1 foo bar` exited with non-zero exit code 1; stderr is:\nbar\n');
			},
			'the result is `foo`': function(childProcess, err, stdout) {
				assert.equal(stdout, 'foo\n');
			}
		}
	}
});

suite['export'](module);
