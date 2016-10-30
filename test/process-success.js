'use strict';

var assert = require('assert'),
    vows = require('vows');

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
				spawn('true', [], process.cwd(), this.callback);
			},
			'the result is the empty string': function(stdout) {
				assert.equal(stdout, '');
			}
		}
	}
});

suite['export'](module);
