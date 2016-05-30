
var _		= require('lodash');
var path	= require('path');
var expect	= require('chai').expect;
var extensionsMockPath = path.resolve(__dirname, './extensionsMock');

var service	= require('../src/index');

describe('Constructor', () => {

	it('is a function', () => {
		expect(service).to.be.a('function');
	});

	it('allow not setting the extension folder', () => {
		expect(() => service()).to.not.throw();
	});

	it('require extension folder to be a String', () => {
		expect(() => service(Object)).to.throw('First argument must be a String.');
	});

	it('require the existence of extension folder', () => {
		var pathToNothing	= 'invalid/route';
		let pathToFile		= path.resolve(extensionsMockPath, './validExtension.js');
		let pathToFolder	= path.resolve(extensionsMockPath, '.');
		expect(() => service(pathToNothing)).to.throw('Extension folder unreachable.');
		expect(() => service(pathToFile)).to.throw('Extension folder does not seem to be a folder.');
		expect(() => service(pathToFolder)).not.to.throw();
	});

});

describe('Service', () => {

	var instance;
	beforeEach(() => {
		instance = service();
	});

	it('is a function', () => {
		expect(instance).to.be.a('function');
	});

	it('has the methods "extend" and "extendApp"', () => {
		expect(instance.extend).to.be.a('function');
		expect(instance.extendApp).to.be.a('function');
	});

	it('is an alias of the method "extendApp"', () => {
		expect(instance).to.be.equal(instance.extendApp);
	});

});

describe('Service.extend', () => {

	var extend, Model;
	beforeEach(() => {
		extend = service(extensionsMockPath).extend;
		Model	= {
			settings: {},
			definition: {}
		};
	});

	it('requires first argument to be a loopback model', () => {
		var err		= 'Method "extend" requires first argument to be a Loopback Model.';
		expect(() => extend()).to.throw(err);
		expect(() => extend({})).to.throw(err);
		expect(() => extend({settings: {}})).to.throw(err);
		expect(() => extend({settings: {}, definition: {}})).to.not.throw(err);
	});

	it('requires second argument to be an Array', () => {
		let err = 'Method "extend" requires second argument to be an Array.';
		expect(() => extend(Model)).to.throw(err);
		expect(() => extend(Model, {})).to.throw(err);
		expect(() => extend(Model, [])).to.not.throw();
	});

	it('doesn\'t modify the model if not extensions', () => {
		let copy = _.cloneDeep(Model);
		extend(Model, []);
		expect(Model).to.deep.equal(copy);
	});

	it('modify the model if there are extensions', () => {
		let copy = _.cloneDeep(Model);
		let opts = {};
		extend(Model, [{name: 'demoExtension', options: opts}]);
		expect(Model).to.not.deep.equal(copy);
		expect(Model.demoProperty).to.equal(opts);
	});

});

describe('Service.extendApp', () => {

	var extendApp, Model, App;
	beforeEach(() => {
		extendApp = service(extensionsMockPath).extendApp;
		Model	= {
			settings: {},
			definition: {}
		};
		App = function() {};
		App.models = [Model];
	});

	it('requires first argument to be a loopback app', () => {
		var err		= 'Method "extendApp" requires first argument to be a Loopback App.';
		expect(() => extendApp()).to.throw(err);
		expect(() => extendApp({})).to.throw(err);
		expect(() => extendApp(App)).to.not.throw(err);
	});

	it('checks if all models are valid Loopback models', () => {
		var err		= 'Found a model that isn\'t a Loopback Model.';
		expect(() => extendApp(App)).to.not.throw();
		App.models = [{}];
		expect(() => extendApp(App)).to.throw(err);
	});

	it('can extends models of App with "demoExtension"', () => {
		let opts = {};
		Model.settings.extends = [{name: 'demoExtension', options: opts}];
		extendApp(App);
		expect(Model.demoProperty).to.equal(opts);
	});

	it('can extends models of App with "validExtension"', () => {
		Model.settings.extends = ['validExtension'];
		extendApp(App);
		expect(Model.validExtension).to.be.an('object');
	});

});
