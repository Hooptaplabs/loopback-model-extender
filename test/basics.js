
var _ = require('lodash');
var path = require('path');
//var npmScript	= process.env.npm_lifecycle_event;
//var ES6Allowed	= /^[6-9].*/.test(process.versions.node);
//
//var service = null;
//if(npmScript == 'test-watch' && !ES6Allowed) {
//	console.log('ERROR: You have node version ' + process.versions.node + ' and "test-watch" script needs >= 6.0.0');
//} else {
//	service = require(ES6Allowed ? '../src/index' : '../dist/index');
//}

var service = require('../src/index');
var expect = require('chai').expect;

describe('Constructor', function() {

	it('must be a function', function() {
		expect(typeof service).to.equal('function');
	});

	it('not throwing errors', function() {
		expect(service).not.to.throw();
	});

	it('not throwing errors running twice', function() {
		expect(service).not.to.throw();
	});

	it('add slash when needed', function() {
		var options = {folder: './hello'};
		service(options);
		expect(options.folder).to.equal('./hello/');
	});

	it('don\'add slash when not needed', function() {
		var options = {folder: './hello/'};
		service(options);
		expect(options.folder).to.equal('./hello/');
	});

});

describe('Extender [basics]', function() {

	var extender;
	beforeEach(function() {
		extender = service();
	});

	it('must be a function', function() {
		expect(typeof extender).to.equal('function');
	});

	it('requires model as first argument', function() {
		expect(function() { extender(); }).to.throw('Must include the model as first argument.');
	});

	it('requires list as second argument', function() {
		expect(function() { extender(Function); }).to.throw('Must include the list as second argument.');
	});

	it('requires second argument be an Array', function() {
		expect(function() { extender(Function, Object); }).to.throw('Second argument list must be an Array.');
	});

});

describe('Extender [usage of helloworld]', function() {

	var extender, Model, options, listAdvanced;
	beforeEach(function() {
		extender		= service();
		Model			= function() {};
		options			= {};
		listAdvanced	= [{
			from: 'helloworld',
			options: options
		}];
	});

	it('must add keys to extended models', function() {
		extender(Model, ['helloworld']);
		expect(typeof Model.helloworldWorks).to.equal('object');
	});

	it('object must be the options passed', function() {
		extender(Model, listAdvanced);
		expect(Model.helloworldWorks).to.equal(options);
	});

	it('don\'t extend model if ignored with "!"', function() {
		extender(Model, ['helloworld', '!helloworld']);
		expect(typeof Model.helloworldWorks).to.equal('undefined');
	});

});

describe('Extension of app models [helloworld]', function() {

	var extender, options, Model, app;
	beforeEach(function() {
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
		};
	});

	it('don\'t touch app models if they doesn\'t have extends', function() {
		delete Model.settings.extends;
		var appCopy = _.cloneDeep(app);
		service(options);
		expect(app).to.deep.equal(appCopy);
	});

	it('run the extension function on model', function() {
		service(options);
		expect(typeof Model.helloworldWorks).to.equal('object');
	});

	it('have object as value', function() {
		var opts = {};
		Model.settings.extends = [{
			from: 'helloworld',
			options: opts
		}];
		service(options);
		expect(Model.helloworldWorks).to.equal(opts);
	});

	it('throw exception if dependency unknown', function() {
		Model.settings.extends = ['unknownName'];
		expect(function() { service(options); }).to.throw('Extension "unknownName" isn\'t a function.');
	});

});

describe('Extension of app models [folder]', function() {

	var Model, app, options;
	beforeEach(function() {
		Model	= function() {};
		Model.settings = {};
		app		= {
			models: [Model]
		};
		options = {
			app: app,
			folder: path.resolve(__dirname, './extensionsMock')
		};
	});

	it('not throw nothing', function() {
		expect(function() { service(options); }).not.to.throw();
	});

	it('helloworld still working', function() {
		var opts = {};
		Model.settings.extends = [{
			from: 'helloworld',
			options: opts
		}];
		service(options);
		expect(Model.helloworldWorks).to.equal(opts);
	});

	it('validExtension work with simple config', function() {
		Model.settings.extends = ['validExtension'];
		service(options);
		expect(typeof Model.validExtension).not.to.equal('undefined');
	});

	it('validExtension work with advanced config', function() {
		var opts = {};
		Model.settings.extends = [{
			from: 'validExtension',
			options: opts
		}];
		service(options);
		expect(Model.validExtension).to.equal(opts);
	});

	it('invalid extension throw', function() {
		Model.settings.extends = ['invalidExtension'];
		expect(function() { service(options); }).to.throw('Extension "invalidExtension" isn\'t a function.');
	});

	it('undefined extension throw', function() {
		Model.settings.extends = ['undefinedExtension'];
		expect(function() { service(options); }).to.throw('Extension "undefinedExtension" isn\'t a function.');
	});

});


