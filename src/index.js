/**
 * Created by roger on 25/05/16.
 */

var inform		= require('./services/inform');
var utils		= require('./services/utils');
var Core		= require('./services/core');

module.exports = function(options = {}) {

	// Prepare
	var app			= options.app || false;
	var core		= Core(options);
	options.folder	= utils.addTrailingSlash(options.folder);

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

			let model       = app.models[k];
			let extensions  = (!!model && !!model.settings && model.settings.extends) || [];

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
