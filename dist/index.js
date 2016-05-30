var cachedModules=[];
cachedModules[5204]={exports:{}};
(function(module,exports) {'use strict';

/**
 * Created by roger on 29/05/16.
 */

var fs = require('fs');

var me = {

	// Checks if a file exists

	exists: function exists(path) {
		try {
			fs.accessSync(path, fs.F_OK);
		} catch (e) {
			return false;
		}
		return true;
	},


	// Checks if a path points to a directory
	isDirectory: function isDirectory(path) {
		return me.exists(path) && fs.lstatSync(path).isDirectory();
	}
};
module.exports = me;}).call(this,cachedModules[5204],cachedModules[5204].exports);
cachedModules[6881]={exports:{}};
(function(module,exports) {'use strict';

/**
 * Created by roger on 29/05/16.
 */

module.exports = {

	// Checks if a object is an Array

	isArray: function isArray(obj) {
		var compatibilityMode = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

		if (Array.isArray && !compatibilityMode) {
			return Array.isArray(obj);
		} else {
			return toString.call(obj) === '[object Array]';
		}
	},


	// Checks if an object is a Loopback Model (dirty check)
	isLoopbackModel: function isLoopbackModel(obj) {
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
		return !!(obj && typeof obj == 'function' && obj.hasOwnProperty('definition') && obj.hasOwnProperty('settings'));
	},


	// Checks if an object is a Loopback App (dirty check)
	isLoopbackApp: function isLoopbackApp(obj) {
		return !!(obj && typeof obj == 'function' && obj.hasOwnProperty('models'));
	},


	// Checks if a path points to a file that can be resolved by require
	isRequerible: function isRequerible(path) {
		try {
			require.resolve(path);
		} catch (e) {
			return false;
		}
		return true;
	}
};}).call(this,cachedModules[6881],cachedModules[6881].exports);
cachedModules[1017]={exports:{}};
(function(module,exports) {'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

/**
 * Created by roger on 29/05/16.
 */

var utils = cachedModules[6881].exports;
var path = require('path');

var demoExtension = {
	name: 'demoExtension',
	func: function func(Model, options) {
		return Model.demoProperty = options;
	}
};

var me = {

	extensionFolder: null,

	// Sets the folder where we search extensions
	setExtensionFolder: function setExtensionFolder(extensionFolder) {
		me.extensionFolder = extensionFolder;
	},


	// Checks if a object is an Array
	normalizeExtensions: function normalizeExtensions(extensions) {

		extensions = me._anyFormat2Object(extensions);
		var excluded = me._getExcluded(extensions);
		extensions = me._removeExcluded(extensions, excluded);
		extensions = me._findFunctions(extensions);

		return extensions;
	},


	// Runs all the extensions. Needs normalized format.
	runExtensions: function runExtensions(Model, extensions) {

		if (!utils.isLoopbackModel(Model)) {
			throw new Error('Method core.runExtensions needs first argument to be a Loopback model.');
		}
		if (!utils.isArray(extensions)) {
			throw new Error('Method core.runExtensions needs second argument to be an Array.');
		}

		extensions.forEach(function (extension) {
			return extension && extension.func && extension.func(Model, extension.options || {});
		});
	},


	// Adds the functions to the extensions
	_findFunctions: function _findFunctions(extensions) {

		if (!utils.isArray(extensions)) {
			throw new Error('Method core._findFunctions needs first argument to be an Array.');
		}

		return extensions.map(function (extension) {
			if (!extension.func && extension.name) {
				extension.func = me._getExtensionFunction(extension.name);
			}
			return extension;
		});
	},


	// Removes extensions that are excluded
	_removeExcluded: function _removeExcluded(extensions, excluded) {

		if (!utils.isArray(extensions)) {
			throw new Error('Method core._removeExcluded needs first argument to be an Array.');
		}
		if (!utils.isArray(excluded)) {
			throw new Error('Method core._removeExcluded needs second argument to be an Array.');
		}

		return extensions.filter(function (extension) {
			return !extension.name || ! ~excluded.indexOf(extension.name);
		});
	},


	// Returns an Array with excluded extensions. Need normalized to obj array.
	_getExcluded: function _getExcluded(extensions) {

		if (!utils.isArray(extensions)) {
			throw new Error('Method core._getExcluded needs first argument to be an Array.');
		}

		return extensions.reduce(function (excluded, current) {

			if ((typeof current === 'undefined' ? 'undefined' : _typeof(current)) != 'object' || !current.hasOwnProperty('isDelete') || !current.hasOwnProperty('name')) {
				throw new Error('Method core._getExcluded needs object format.');
			}
			if (current.isDelete) {
				excluded.push(current.name);
			}
			return excluded;
		}, []);
	},
	_anyFormat2Object: function _anyFormat2Object(extensions) {

		if (!utils.isArray(extensions)) {
			throw new Error('Method core._anyFormat2Object needs first argument to be an Array.');
		}

		return extensions.map(function (extension) {

			// String
			if (typeof extension == 'string') {
				var isDelete = extension.charAt(0) === '!';
				var name = isDelete ? extension.substring(1) : extension;
				return {
					name: name,
					options: null,
					isDelete: isDelete,
					func: null
				};
			}

			// Function
			if (typeof extension == 'function') {
				return {
					name: null,
					options: null,
					isDelete: false,
					func: extension
				};
			}

			// Object
			if ((typeof extension === 'undefined' ? 'undefined' : _typeof(extension)) == 'object' && extension.name) {
				var _isDelete = extension.isDelete || extension.name.charAt(0) === '!';
				var _name = extension.name.charAt(0) === '!' ? extension.name.substring(1) : extension.name;
				return {
					name: _name,
					options: extension.options || {},
					isDelete: _isDelete,
					func: extension.func || null
				};
			}

			throw new Error('Unknown extension format.');
		});
	},
	_getExtensionFunction: function _getExtensionFunction(extensionName) {
		var extensionPath = false;
		if (me.extensionFolder) {
			extensionPath = path.resolve(me.extensionFolder, extensionName);
		}
		var func = null;
		if (extensionPath && utils.isRequerible(extensionPath)) {
			func = require(extensionPath);
		} else if (extensionName == demoExtension.name) {
			func = demoExtension.func;
		}

		if (func) {
			if (typeof func == 'function') {
				return func;
			} else {
				throw Error('Extension "' + extensionName + '" invalid.');
			}
		}

		throw Error('Extension "' + extensionName + '" not found.');
	}
};
module.exports = me;}).call(this,cachedModules[1017],cachedModules[1017].exports);'use strict';

/**
 * Created by roger on 29/05/16.
 */

var file = cachedModules[5204].exports;
var utils = cachedModules[6881].exports;
var core = cachedModules[1017].exports;

module.exports = function () {
	var extensionFolder = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];


	// Check extension folder
	if (typeof extensionFolder != 'string') {
		throw new Error('First argument must be a String.');
	} else if (extensionFolder) {
		if (!file.exists(extensionFolder)) {
			throw new Error('Extension folder unreachable.');
		} else if (!file.isDirectory(extensionFolder)) {
			throw new Error('Extension folder does not seem to be a folder.');
		}
		core.setExtensionFolder(extensionFolder);
	}

	// Return service
	var me = extendApp;
	me.extend = extend;
	me.extendApp = extendApp;
	return me;

	function extend(Model, extensions) {

		if (!Model || !utils.isLoopbackModel(Model)) {
			throw new Error('Method "extend" requires first argument to be a Loopback Model.');
		}

		if (!extensions || !utils.isArray(extensions)) {
			throw new Error('Method "extend" requires second argument to be an Array.');
		}

		extensions = core.normalizeExtensions(extensions);
		core.runExtensions(Model, extensions);
	}

	function extendApp(app) {

		if (!app || !utils.isLoopbackApp(app)) {
			throw new Error('Method "extendApp" requires first argument to be a Loopback App.');
		}

		for (var i in app.models) {
			if (!app.models.hasOwnProperty(i)) return;

			var Model = app.models[i];

			if (!app || !utils.isLoopbackModel(Model)) {
				throw new Error('Found a model that isn\'t a Loopback Model.');
			}

			var extensions = Model.settings.extends || [];
			extend(Model, extensions);
		}
	}
};