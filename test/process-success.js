'use strict';

var assert = require('assert'),
    vows = require('vows'),
    childProcessTest = require('./lib/childprocess-object.js');

var suite = vows.describe('Successful spawn handling');

suite.addBatch({
	'When we require the module': {
		topic: function() {
			return require('../index.js');
		},
		'it works': function(spawn) {
			assert.isFunction(spawn);
		},
		'and spawn the `true` binary': {
			topic: function(spawn) {
				var callback = this.callback;
				var childProcess = spawn('true', [], process.cwd(), function(err, stdout) {
					callback(childProcess, err, stdout);
				});
			},
			'a `ChildProcess` object is returned': childProcessTest,
			'there\'s no error': function(childProcess, err, stdout) {
				assert.ifError(err);
			},
			'the result is the empty string': function(childProcess, err, stdout) {
				assert.equal(stdout, '');
			}
		}
	}
});

suite['export'](module);
