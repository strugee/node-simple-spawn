'use strict';

var assert = require('assert'),
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
				spawn('false', [], process.cwd(), this.callback);
			},
			'an error is returned': function(err, stdout) {
				assert(err);
				assert.equal(err.toString(), 'Error: Process `false ` exited with non-zero exit code 1; stderr is:\n');
			},
			'the result is undefined': function(err, stdout) {
				assert.equal(stdout, undefined);
			}
		}
	}
});

suite['export'](module);
