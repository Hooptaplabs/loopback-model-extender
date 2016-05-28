/**
 * Created by roger on 26/05/16.
 */

module.exports = {

	isArray(obj) {
		return obj instanceof Array;
	},

	addTrailingSlash(text = '') {
		return text.substr(-1) == '/' ? text : text + '/';
	}

};
