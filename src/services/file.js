/**
 * Created by roger on 29/05/16.
 */

var fs = require('fs');

var me = {

	// Checks if a file exists
	exists(path) {
		try {
			fs.accessSync(path, fs.F_OK);
		} catch (e) {
			return false;
		}
		return true;
	},

	// Checks if a path points to a directory
	isDirectory(path) {
		return me.exists(path) && fs.lstatSync(path).isDirectory();
	}
};
module.exports = me;
