var cachedModules=[];
cachedModules[8750]={exports:{}};
(function(module,exports) {"use strict";

/**
 * Created by roger on 26/05/16.
 */

module.exports = {
	throwError: function throwError(msg) {
		throw new Error(msg);
	}
};}).call(this,cachedModules[8750],cachedModules[8750].exports);
cachedModules[4210]={exports:{}};
(function(module,exports) {'use strict';

/**
 * Created by roger on 26/05/16.
 */

module.exports = {
	isArray: function isArray(obj) {
		return obj instanceof Array;
	},
	addTrailingSlash: function addTrailingSlash() {
		var text = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];

		return text.substr(-1) == '/' ? text : text + '/';
	}
};}).call(this,cachedModules[4210],cachedModules[4210].exports);
cachedModules[495]={exports:{}};
(function(module,exports) {'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

/**
 * Created by roger on 26/05/16.
 */

var path = require('path');
var inform = cachedModules[8750].exports;
var utils = cachedModules[4210].exports;

module.exports = function (options) {

	var helloworldExtension = function helloworldExtension(model, options) {
		model.helloworldWorks = options;
	};

	var me = {
		requireExtension: function requireExtension(extensionName) {
			var func = null;
			if (options.folder) {
				var dependencyPath = path.resolve(options.folder, extensionName);
				try {
					require.resolve(dependencyPath);
					func = require(dependencyPath);
				} catch (e) {}
			}
			if (!func && extensionName == 'helloworld') {
				func = helloworldExtension;
			}

			return func;
		},
		anyInputType2ObjectType: function anyInputType2ObjectType(input) {

			if (utils.isArray(input)) {
				return input.map(me.anyInputType2ObjectType);
			}

			var result = {
				from: null,
				function: null,
				options: {},
				isDelete: false
			};

			if (typeof input === 'string') {
				var isDelete = input.charAt(0) === '!';
				var from = isDelete ? input.substring(1) : input;

				result.from = from;
				result.function = me.requireExtension(from);
				result.function = me.requireExtension(from);
				result.options = {};
				result.isDelete = isDelete;
			} else if (typeof input === 'function') {
				result.from = false;
				result.function = input;
				result.options = {};
				result.isDelete = false;
			} else if ((typeof input === 'undefined' ? 'undefined' : _typeof(input)) === 'object') {
				result.from = input.from;
				result.function = me.requireExtension(input.from);
				result.options = input.options || {};
				result.isDelete = false;
			}

			return result;
		},
		removeExcludedItems: function removeExcludedItems(list) {
			var excluded = me.getExcludeList(list);
			return me.removeExcluded(list, excluded);
		},
		getExcludeList: function getExcludeList(input) {

			if (utils.isArray(input)) {
				return input.filter(me.getExcludeList).map(function (item) {
					return item.from;
				});
			}

			if (input && input.from && input.isDelete) {
				return true;
			}

			return false;
		},
		removeExcluded: function removeExcluded(list, excluded) {

			if (utils.isArray(list)) {
				return list.filter(function (item) {
					return me.removeExcluded(item, excluded);
				});
			}

			if (!list || !list.from) {
				return false;
			}
			if (list.isDelete) {
				return false;
			}
			if (~excluded.indexOf(list.from)) {
				return false;
			}

			return true;
		},
		runFunctions: function runFunctions(model, obj) {

			if (utils.isArray(obj)) {
				obj.forEach(function (item) {
					return me.runFunctions(model, item);
				});
				return;
			}

			if (obj.from === null) {
				return;
			} else if (obj.isDelete) {
				return;
			} else if (!obj.function || typeof obj.function != 'function') {
				inform.throwError('Extension "' + obj.from + '" isn\'t a function.');
			}

			obj.function(model, obj.options);
		}
	};
	return me;
};}).call(this,cachedModules[495],cachedModules[495].exports);'use strict';

/**
 * Created by roger on 25/05/16.
 */

var inform = cachedModules[8750].exports;
var utils = cachedModules[4210].exports;
var Core = cachedModules[495].exports;

module.exports = function () {
	var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];


	// Prepare
	var app = options.app || false;
	var core = Core(options);
	options.folder = utils.addTrailingSlash(options.folder);

	// Extend models of the app if available
	if (app && app.models) {
		extendAppModels(app);
	}

	// Return function if you want launch extender manually
	return extend;

	/*	Functions
  ---------------------------------------------------------------------------------*/

	function extendAppModels(app) {
		for (var k in app.models) {
			if (!app.models.hasOwnProperty(k)) return;

			var model = app.models[k];
			var extensions = !!model && !!model.settings && model.settings.extends || [];

			extend(model, extensions);
		}
	}

	function extend(model, list) {

		// Checks if inputs are valid
		checkInputs(model, list);

		// Transform any form of input to object
		list = core.anyInputType2ObjectType(list);

		// Remove the excluded list
		list = core.removeExcludedItems(list);

		// Load one by one all extensions
		core.runFunctions(model, list);
	}

	function checkInputs(model, list) {
		if (!model) {
			inform.throwError('Must include the model as first argument.');
		}
		if (!list) {
			inform.throwError('Must include the list as second argument.');
		}
		if (!utils.isArray(list)) {
			inform.throwError('Second argument list must be an Array.');
		}
	}
};