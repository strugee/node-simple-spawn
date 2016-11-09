var assert = require('assert'),
    ChildProcess = require('child_process').ChildProcess;

module.exports = function(childProcess, err, stdout) {
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
};
