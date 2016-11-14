'use strict';

var assert = require('assert'),
    vows = require('vows'),
    childProcessTest = require('./lib/childprocess-object.js');

var suite = vows.describe('Successful spawn handling with complex outputs');

suite.addBatch({
	'When we require the module': {
		topic: function() {
			return require('../index.js');
		},
		'it works': function(spawn) {
			assert.isFunction(spawn);
		},
		'and spawn a process that will succeed and output to stdout': {
			topic: function(spawn) {
				var callback = this.callback;
				var childProcess = spawn('test/lib/test-output.js', ['0', 'foo', ''], process.cwd(), function(err, stdout) {
					callback(childProcess, err, stdout);
				});
			},
			'a `ChildProcess` object is returned': childProcessTest,
			'there\'s no error': function(childProcess, err, stdout) {
				assert.ifError(err);
			},
			'the result is `foo`': function(childProcess, err, stdout) {
				assert.equal(stdout, 'foo\n');
			}
		},
		'and spawn a process that will succeed and output to stderr': {
			topic: function(spawn) {
				var callback = this.callback;
				var childProcess = spawn('test/lib/test-output.js', ['0', '', 'bar'], process.cwd(), function(err, stdout) {
					callback(childProcess, err, stdout);
				});
			},
			'a `ChildProcess` object is returned': childProcessTest,
			'there\'s no error': function(childProcess, err, stdout) {
				assert.ifError(err);
			},
			'the result is a single newline': function(childProcess, err, stdout) {
				assert.equal(stdout, '\n');
			}
		},
		'and spawn a process that will succeed and output to both stdout and stderr': {
			topic: function(spawn) {
				var callback = this.callback;
				var childProcess = spawn('test/lib/test-output.js', ['0', 'foo', 'bar'], process.cwd(), function(err, stdout) {
					callback(childProcess, err, stdout);
				});
			},
			'a `ChildProcess` object is returned': childProcessTest,
			'there\'s no error': function(childProcess, err, stdout) {
				assert.ifError(err);
			},
			'the result is `foo`': function(childProcess, err, stdout) {
				assert.equal(stdout, 'foo\n');
			}
		}
	}
});

suite['export'](module);
