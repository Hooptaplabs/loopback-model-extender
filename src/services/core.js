/**
 * Created by roger on 29/05/16.
 */

let utils	= require('./utils');
let path	= require('path');

let demoExtension	= {
	name:	'demoExtension',
	func:	(Model, options) => Model.demoProperty = options
};

let me = {

	extensionFolder: null,

	// Sets the folder where we search extensions
	setExtensionFolder(extensionFolder) {
		me.extensionFolder = extensionFolder;
	},

	// Checks if a object is an Array
	normalizeExtensions(extensions) {

		extensions		= me._anyFormat2Object(extensions);
		let excluded	= me._getExcluded(extensions);
		extensions		= me._removeExcluded(extensions, excluded);
		extensions		= me._findFunctions(extensions);

		return extensions;
	},

	// Runs all the extensions. Needs normalized format.
	runExtensions(Model, extensions) {

		if (!utils.isLoopbackModel(Model)) {
			throw new Error('Method core.runExtensions needs first argument to be a Loopback model.');
		}
		if (!utils.isArray(extensions)) {
			throw new Error('Method core.runExtensions needs second argument to be an Array.');
		}

		extensions
			.forEach(extension => extension && extension.func && extension.func(Model, extension.options || {}));
	},

	// Adds the functions to the extensions
	_findFunctions(extensions) {

		if (!utils.isArray(extensions)) {
			throw new Error('Method core._findFunctions needs first argument to be an Array.');
		}

		return extensions.map(extension => {
			if (!extension.func && extension.name) {
				extension.func = me._getExtensionFunction(extension.name);
			}
			return extension;
		});
	},

	// Removes extensions that are excluded
	_removeExcluded(extensions, excluded) {

		if (!utils.isArray(extensions)) {
			throw new Error('Method core._removeExcluded needs first argument to be an Array.');
		}
		if (!utils.isArray(excluded)) {
			throw new Error('Method core._removeExcluded needs second argument to be an Array.');
		}

		return extensions.filter(extension => !extension.name || !~excluded.indexOf(extension.name));
	},

	// Returns an Array with excluded extensions. Need normalized to obj array.
	_getExcluded(extensions) {

		if (!utils.isArray(extensions)) {
			throw new Error('Method core._getExcluded needs first argument to be an Array.');
		}

		return extensions.reduce((excluded, current) => {

			if (typeof current != 'object' ||
				!current.hasOwnProperty('isDelete') ||
				!current.hasOwnProperty('name')) {
				throw new Error('Method core._getExcluded needs object format.');
			}
			if (current.isDelete) {
				excluded.push(current.name);
			}
			return excluded;
		}, []);
	},

	_anyFormat2Object(extensions) {

		if (!utils.isArray(extensions)) {
			throw new Error('Method core._anyFormat2Object needs first argument to be an Array.');
		}

		return extensions.map(extension => {

			// String
			if (typeof extension == 'string') {
				let isDelete	= extension.charAt(0) === '!';
				let name		= isDelete ? extension.substring(1) : extension;
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
			if (typeof extension == 'object' && extension.name) {
				let isDelete	= extension.isDelete || extension.name.charAt(0) === '!';
				let name		= extension.name.charAt(0) === '!' ? extension.name.substring(1) : extension.name;
				return {
					name: name,
					options: extension.options || {},
					isDelete: isDelete,
					func: extension.func || null
				};
			}

			throw new Error('Unknown extension format.');
		});

	},

	_getExtensionFunction(extensionName) {
		let extensionPath = false;
		if (me.extensionFolder) {
			extensionPath = path.resolve(me.extensionFolder, extensionName);
		}
		let func = null;
		if (extensionPath && utils.isRequerible(extensionPath)) {
			func = require(extensionPath);
		} else if (extensionName == demoExtension.name) {
			func = demoExtension.func;
		}

		if (func) {
			if (typeof func == 'function') {
				return func;
			} else {
				throw Error(`Extension "${extensionName}" invalid.`);
			}
		}

		throw Error(`Extension "${extensionName}" not found.`);
	}

};
module.exports = me;
