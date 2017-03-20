'use strict';

var assert = require('assert'),
    vows = require('vows'),
    childProcessTest = require('./lib/childprocess-object.js');

var suite = vows.describe('Process exec error handling');

suite.addBatch({
	'When we require the module': {
		topic: function() {
			return require('../index.js');
		},
		'it works': function(spawn) {
			assert.isFunction(spawn);
		},
		'and try to run a binary that doesn\'t exist': {
			topic: function(spawn) {
				var callback = this.callback;
				var childProcess = spawn('nonexistant', [], process.cwd(), function(err, stdout) {
					callback(childProcess, err, stdout);
				});
			},
			'a `ChildProcess` object is returned': childProcessTest,
			'an error is sent to the callback': function(childProcess, err, stdout) {
				assert(err);
			},
			'the result is the null string': function(childProcess, err, stdout) {
				assert.equal(stdout, '');
			}
		}
	}
});

suite['export'](module);
