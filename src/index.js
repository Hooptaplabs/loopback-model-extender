/**
 * Created by roger on 29/05/16.
 */

let file	= require('./services/file');
let utils	= require('./services/utils');
let core	= require('./services/core');

module.exports = (extensionFolder = '') => {

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
	let me = extendApp;
	me.extend		= extend;
	me.extendApp	= extendApp;
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

		for (let i in app.models) {
			if (!app.models.hasOwnProperty(i)) return;

			let Model = app.models[i];

			if (!app || !utils.isLoopbackModel(Model)) {
				throw new Error('Found a model that isn\'t a Loopback Model.');
			}

			let extensions = Model.settings.extends || [];
			extend(Model, extensions);
		}


	}

};
