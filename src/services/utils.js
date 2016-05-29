/**
 * Created by roger on 29/05/16.
 */

module.exports = {

	// Checks if a object is an Array
	isArray(obj, compatibilityMode = false) {
		if (Array.isArray && !compatibilityMode) {
			return Array.isArray(obj);
		} else {
			return toString.call(obj) === '[object Array]';
		}
	},

	// Checks if an object is a Loopback Model (dirty check)
	isLoopbackModel(obj) {
		//if (!obj) {
		//	return false;
		//}
		//if (typeof obj != 'object') {
		//	return false;
		//}
		//if (!obj.definition) {
		//	return false;
		//}
		//if (!obj.settings) {
		//	return false;
		//}
		//return true;
		return !!(obj && typeof obj == 'object' && obj.definition && obj.settings);
	},

	// Checks if an object is a Loopback App (dirty check)
	isLoopbackApp(obj) {
		return !!(obj && typeof obj == 'object' && obj.models);
	},

	// Checks if a path points to a file that can be resolved by require
	isRequerible(path) {
		try {
			require.resolve(path);
		} catch (e) {
			return false;
		}
		return true;
	}

};
