
//var _		= require('lodash');
var path	= require('path');
var expect	= require('chai').expect;

var service	= require('../src/services/utils');


describe('Service "utils"', () => {

	it('is an object', () => {
		expect(service).to.be.an('object');
	});

	describe('method "isArray"', () => {

		var method;
		beforeEach(() => {
			method = service.isArray;
		});

		it('it\'s a function', () => {
			expect(method).to.be.a('function');
		});

		it('returns true if passing an Array', () => {
			expect(method([])).to.equal(true);
			expect(method(new Array())).to.equal(true); // eslint-disable-line no-array-constructor
		});

		it('returns false if not passing Array', () => {
			expect(method()).to.equal(false);
			expect(method({})).to.equal(false);
			expect(method('')).to.equal(false);
		});

		it('works even when node version < 5.0', () => {
			expect(method({}, true)).to.equal(false);
			expect(method([], true)).to.equal(true);
		});

	});

	describe('method "isRequerible"', () => {

		var method;
		var pathToNothing	= path.resolve(__dirname, './nope');
		var pathToFolder	= __dirname;
		var pathToFile		= path.resolve(__dirname, './extensionsMock/validExtension.js');
		beforeEach(() => {
			method = service.isRequerible;
		});

		it('it\'s a function', () => {
			expect(method).to.be.a('function');
		});

		it('returns true if is requerible', () => {
			expect(method(pathToFile)).to.equal(true);
			expect(method(pathToFolder)).to.equal(true);
		});

		it('returns false if isn\'t requerible', () => {
			expect(method(pathToNothing)).to.equal(false);
		});

	});

	describe('method "isLoopbackModel"', () => {

		var isLoopbackModel;
		beforeEach(() => {
			isLoopbackModel = service.isLoopbackModel;
		});

		it('it\'s a function', () => {
			expect(isLoopbackModel).to.be.a('function');
		});

		it('returns true if is a Loopback model', () => {
			expect(isLoopbackModel({definition: {}, settings: {}})).to.equal(true);
		});

		it('returns false if is not a Loopback model', () => {
			expect(isLoopbackModel(function() {})).to.equal(false);
			expect(isLoopbackModel('')).to.equal(false);
			expect(isLoopbackModel({})).to.equal(false);
			expect(isLoopbackModel({settings: {}})).to.equal(false);
			expect(isLoopbackModel({definition: {}})).to.equal(false);
		});

	});

	describe('method "isLoopbackApp"', () => {

		var isLoopbackApp = service.isLoopbackApp;

		it('it\'s a function', () => {
			expect(isLoopbackApp).to.be.a('function');
		});

		it('returns true if is a Loopback App', () => {
			expect(isLoopbackApp({models: []})).to.equal(true);
		});

		it('returns false if is not a Loopback app', () => {
			expect(isLoopbackApp(function() {})).to.equal(false);
			expect(isLoopbackApp('')).to.equal(false);
			expect(isLoopbackApp({})).to.equal(false);
			expect(isLoopbackApp({nope: {}})).to.equal(false);
		});

	});

});
