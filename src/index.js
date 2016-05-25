module.exports = function(options = {}) {
	// Defaults
	options.folder = options.folder || './extensions/';

	// Preparing
	options.folder = addTrailingSlash(options.folder);

	// Return function
	return (model, list) => {
		// Checks if inputs are valid
		checkInputs(model, list);

		// Transform any form of input to object
		list = anyInputType2ObjectType(list);

		// Remove the excluded list
		list = removeExcludedItems(list);

		// Load one by one all extensions
		runFunctions(model, list);
	};


	/*	Functions
	 ---------------------------------------------------------------------------------*/

	function checkInputs(model, list) {
		if (!model) {
			throwError('Must include the model as first argument.');
		}
		if (!list) {
			throwError('Must include the list as second argument.');
		}
		if (!isArray(list)) {
			throwError('Second argument list must be an Array.');
		}
	}

	function anyInputType2ObjectType(input) {

		if (isArray(input)) {
			return input.map(anyInputType2ObjectType);
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
			result.function = requireExtension(from);
			result.options  = {};
			result.isDelete = isDelete;
		} else if (typeof input === 'function') {
			result.from     = false;
			result.function = input;
			result.options  = {};
			result.isDelete = false;
		} else if (typeof input === 'object') {
			result.from     = input.from;
			result.function = requireExtension(input.from);
			result.options  = input.options || {};
			result.isDelete = false;
		}

		return result;
	}

	function removeExcludedItems(list, excluded) {
		if (!excluded) {
			excluded = [];
		}
		excluded = getExcludeList(list);
		return removeExcluded(list, excluded);
	}


	function getExcludeList(input) {

		if (isArray(input)) {
			return input.filter(getExcludeList).map(item => item.from);
		}

		if (input && input.from && input.isDelete) {
			return true;
		}

		return false;
	}

	function removeExcluded(list, excluded) {

		if (isArray(list)) {
			return list.filter(item => removeExcluded(item, excluded));
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
	}

	// Handle item as string, function or array
	function runFunctions(model, obj) {

		if (isArray(obj)) {
			obj.forEach(item => runFunctions(model, item));
			return;
		}

		if (obj.from === null) {
			return;
		} else if (obj.isDelete) {
			return;
		}

		obj.function(model, obj.options);
	}

	// Requiring extension dynamically
	function requireExtension(extensionName) {
		return require(options.folder + extensionName);
	}

	// Check if is array
	function isArray(obj) {
		return obj instanceof Array;
	}

	function addTrailingSlash(text) {
		return text.substr(-1) == '/' ? text : text + '/';
	}

	function log(x) {
		console.log(namespace(x));
	}

	function throwError(x) {
		throw new Error(namespace(x));
	}

	function namespace(msg) {
		return 'extender: ' + msg;
	}

};
