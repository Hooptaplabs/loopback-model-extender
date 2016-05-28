
var _ = require('lodash');
var path = require('path');
var npmScript	= process.env.npm_lifecycle_event;
var ES6Allowed	= /^[6-9].*/.test(process.versions.node);

var service = null;
if(npmScript == 'test-watch' && !ES6Allowed) {
	console.log('ERROR: You have node version ' + process.versions.node + ' and "test-watch" script needs >= 6.0.0');
} else {
	service = require(ES6Allowed ? '../src/index' : '../dist/index');
}

describe('Constructor', function () {

	it('must be a function', function () {
		expect(typeof service).toBe('function');
	});

	it('not throwing errors', function () {
		expect(service).not.toThrow();
	});

	it('not throwing errors running twice', function () {
		expect(service).not.toThrow();
	});

	it('add slash when needed', function () {
		var options = { folder : './hello' };
		service(options);
		expect(options.folder).toBe('./hello/');
	});

	it('don\'add slash when not needed', function () {
		var options = { folder : './hello/' };
		service(options);
		expect(options.folder).toBe('./hello/');
	});

});

describe('Extender [basics]', function () {

	var extender;
	beforeEach(function () {
		extender = service();
	});

	it('must be a function', function () {
		expect(typeof extender).toBe('function');
	});

	it('requires model as first argument', function () {
		expect(function () { extender() }).toThrow(Error('Must include the model as first argument.'));
	});

	it('requires list as second argument', function () {
		expect(function () { extender(Function) }).toThrow(Error('Must include the list as second argument.'));
	});

	it('requires second argument be an Array', function () {
		expect(function () { extender(Function, Object) }).toThrow(Error('Second argument list must be an Array.'));
	});

});

describe('Extender [usage of helloworld]', function () {

	var extender, Model, options, listAdvanced;
	beforeEach(function () {
		extender	= service();
		Model		= function (){};
		options		= {};
		listAdvanced= [{
			from: 'helloworld',
			options: options
		}];
	});

	it('must add keys to extended models', function () {
		extender(Model, ['helloworld']);
		expect(typeof Model.helloworldWorks).toBe('object');
	});

	it('object must be the options passed', function () {
		extender(Model, listAdvanced);
		expect(Model.helloworldWorks).toBe(options);
	});

	it('don\'t extend model if ignored with "!"', function () {
		extender(Model, ['helloworld', '!helloworld']);
		expect(typeof Model.helloworldWorks).toBe('undefined');
	});

});

describe('Extension of app models [helloworld]', function () {

	var extender, options, Model, app;
	beforeEach(function () {
		Model = {
			settings: {
				extends: ['helloworld']
			}
		};
		app = {
			models: [Model]
		};
		options = {
			app: app
		}
	});

	it('don\'t touch app models if they doesn\'t have extends', function () {
		delete Model.settings.extends;
		var appCopy = _.cloneDeep(app);
		service(options);
		expect(app).toEqual(appCopy)
	});

	it('run the extension function on model', function () {
		service(options);
		expect(typeof Model.helloworldWorks).toBe('object');
	});

	it('have object as value', function () {
		var opts = {};
		Model.settings.extends = [{
			from: 'helloworld',
			options: opts
		}];
		service(options);
		expect(Model.helloworldWorks).toBe(opts);
	});

	it('throw exception if dependency unknown', function () {
		Model.settings.extends = ['unknownName'];
		expect(function() { service(options); }).toThrow(Error('Extension "unknownName" isn\'t a function.'));
	})

});

describe('Extension of app models [folder]', function () {

	var Model, app, options;
	beforeEach(function () {
		Model	= function () {};
		Model.settings = { };
		app		= {
			models: [Model]
		};
		options = {
			app: app,
			folder: path.resolve(__dirname, './extensionsMock')
		}
	});

	it('not throw nothing', function () {
		expect(function () { service(options) }).not.toThrow();
	});

	it('helloworld still working', function () {
		var opts = {};
		Model.settings.extends = [{
			from: 'helloworld',
			options: opts
		}];
		service(options);
		expect(Model.helloworldWorks).toBe(opts);
	});

	it('validExtension work with simple config', function () {
		Model.settings.extends = ['validExtension'];
		service(options);
		expect(typeof Model.validExtension).not.toBe('undefined');
	});

	it('validExtension work with advanced config', function () {
		var opts = {};
		Model.settings.extends = [{
			from: 'validExtension',
			options: opts
		}];
		service(options);
		expect(Model.validExtension).toBe(opts);
	});

	it('invalid extension throw', function () {
		Model.settings.extends = ['invalidExtension'];
		expect(function () { service(options) }).toThrow(Error('Extension "invalidExtension" isn\'t a function.'))
	});

	it('undefined extension throw', function () {
		Model.settings.extends = ['undefinedExtension'];
		expect(function () { service(options) }).toThrow(Error('Extension "undefinedExtension" isn\'t a function.'))
	});







});


