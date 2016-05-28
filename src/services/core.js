/**
 * Created by roger on 26/05/16.
 */

var path = require('path');
var inform = require('./inform');
var utils = require('./utils');

module.exports = function(options) {

	var helloworldExtension = (model, options) => {
		model.helloworldWorks = options;
	};

	var me = {

		requireExtension(extensionName) {
			let func = null;
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

		anyInputType2ObjectType(input) {

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

				result.from     = from;
				result.function = me.requireExtension(from);
				result.function = me.requireExtension(from);
				result.options  = {};
				result.isDelete = isDelete;
			} else if (typeof input === 'function') {
				result.from     = false;
				result.function = input;
				result.options  = {};
				result.isDelete = false;
			} else if (typeof input === 'object') {
				result.from     = input.from;
				result.function = me.requireExtension(input.from);
				result.options  = input.options || {};
				result.isDelete = false;
			}

			return result;
		},


		removeExcludedItems(list) {
			var excluded = me.getExcludeList(list);
			return me.removeExcluded(list, excluded);
		},

		getExcludeList(input) {

			if (utils.isArray(input)) {
				return input.filter(me.getExcludeList).map(item => item.from);
			}

			if (input && input.from && input.isDelete) {
				return true;
			}

			return false;
		},

		removeExcluded(list, excluded) {

			if (utils.isArray(list)) {
				return list.filter(item => me.removeExcluded(item, excluded));
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

		runFunctions(model, obj) {

			if (utils.isArray(obj)) {
				obj.forEach(item => me.runFunctions(model, item));
				return;
			}

			if (obj.from === null) {
				return;
			} else if (obj.isDelete) {
				return;
			} else if (!obj.function || typeof obj.function != 'function') {
				inform.throwError(`Extension "${obj.from}" isn't a function.`);
			}

			obj.function(model, obj.options);
		}

	};
	return me;
};
