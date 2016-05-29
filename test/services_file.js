
//var _		= require('lodash');
var path	= require('path');
var expect	= require('chai').expect;
var pathToFile		= path.resolve(__dirname, './index.js');
let pathToNothing	= path.resolve(__dirname, './nope');
let pathToFolder	= __dirname;

var service	= require('../src/services/file');


describe('Service "file"', () => {

	it('is an object', () => {
		expect(service).to.be.an('object');
	});

	describe('method "exists"', () => {

		var exists = service.exists;

		it('is a function', () => {
			expect(exists).to.be.a('function');
		});

		it('returns false if file doesn\'t exists', () => {
			expect(exists()).to.equal(false);
			expect(exists(pathToNothing)).to.equal(false);
		});

		it('returns true if file exists', () => {
			expect(exists(pathToFile)).to.equal(true);
			expect(exists(pathToFolder)).to.equal(true);
		});

	});

	describe('method "isDirectory"', () => {

		var isDirectory = service.isDirectory;

		it('is a function', () => {
			expect(isDirectory).to.be.a('function');
		});

		it('returns false if path is not a directory', () => {
			expect(isDirectory()).to.equal(false);
			expect(isDirectory(pathToNothing)).to.equal(false);
			expect(isDirectory(pathToFile)).to.equal(false);
		});

		it('returns true if is a folder', () => {
			expect(isDirectory(pathToFolder)).to.equal(true);
		});

	});

});
