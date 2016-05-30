
let _		= require('lodash');
let path	= require('path');
let expect	= require('chai').expect;

var extensionsMockPath	= path.resolve(__dirname, './extensionsMock');
var loopbackModel		= function() {};
loopbackModel.definition	= {};
loopbackModel.settings		= {};
let createLoopbackModel	= () => {
	let r = function() {};
	r.definition	= {};
	r.settings		= {};
	return r;
};

let service	= require('../src/services/core');


describe('Service "core"', () => {

	it('is an object', () => {
		expect(service).to.be.an('object');
	});

	it('extension folder can be set', () => {
		let extensionFoler = './example/extension/folder';
		expect(service.setExtensionFolder).to.be.a('function');
		service.setExtensionFolder(extensionFoler);
		expect(service.extensionFolder).to.equal(extensionFoler);
	});


	describe('method "_getExtensionFunction"', () => {

		let method = service._getExtensionFunction;
		beforeEach(() => {
			service.setExtensionFolder(extensionsMockPath);
		});
		after(() => {
			service.setExtensionFolder(null);
		});

		it('is a function', () => {
			expect(method).to.be.a('function');
		});

		it('find extensions on defined folder', () => {
			expect(method('validExtension')).to.be.a('function');
		});

		it('detects if unknown extension', () => {
			expect(() => method('nope')).to.throw('Extension "nope" not found.');
		});

		it('detects if invalid extension', () => {
			expect(() => method('invalidExtension')).to.throw('Extension "invalidExtension" invalid.');
		});

		it('ships with a demo extension called "demoExtension"', () => {
			expect(method('demoExtension')).to.be.a('function');
		});

		it('demo extension returns the options', () => {
			var Model	= function() {};
			var opts	= {};
			method('demoExtension')(Model, opts);
			expect(Model.demoProperty).to.equal(opts);
		});

	});


	describe('method "_anyFormat2Object"', () => {

		let ToObject = service._anyFormat2Object;

		it('is a function', () => {
			expect(ToObject).to.be.a('function');
		});

		it('only allows Array as first argument', () => {
			expect(() => ToObject({})).to.throw('Method core._anyFormat2Object needs first argument to be an Array.');
		});

		it('converts string format to object format', () => {
			expect(ToObject(['demoException']))
				.to.deep.equal(
				[{
					name: 'demoException',
					options: null,
					isDelete: false,
					func: null
				}]);
			expect(ToObject(['!demoException']))
				.to.deep.equal(
				[{
					name: 'demoException',
					options: null,
					isDelete: true,
					func: null
				}]);
		});

		it('converts function format to object format', () => {
			var func = () => {};
			expect(ToObject([func]))
				.to.deep.equal(
				[{
					name: null,
					options: null,
					isDelete: false,
					func: func
				}]);
		});

		it('needs the name on object format', () => {
			expect(() => ToObject([{}])).to.throw('Unknown extension format.');
			expect(() => ToObject([{name: 'validExtender'}])).to.not.throw();
		});

		it('sets default options if not present', () => {
			expect(ToObject(
				[{
					name: 'validExtender'
				}])[0].options).to.deep.equal({});
		});

		it('allows set property "isDelete" or exclamation', () => {
			expect(ToObject(
				[{
					name: '!validExtender'
				}])[0].isDelete).to.equal(true);
			expect(ToObject(
				[{
					name: 'validExtender',
					isDelete: true
				}])[0].isDelete).to.equal(true);
		});

	});


	describe('method "_getExcluded"', () => {

		let n			= service._anyFormat2Object;
		let getExcluded	= service._getExcluded;

		it('is a function', () => {
			expect(getExcluded).to.be.a('function');
		});

		it('only allow first argument to be an Array', () => {
			expect(() => getExcluded({})).to.throw('Method core._getExcluded needs first argument to be an Array.');
			expect(() => getExcluded()).to.throw('Method core._getExcluded needs first argument to be an Array.');
			expect(() => getExcluded([])).to.not.throw();
		});

		it('only allow normalized input', () => {
			let err = 'Method core._getExcluded needs object format.';
			expect(() => getExcluded(['hello'])).to.throw(err);
			expect(() => getExcluded([() => {}])).to.throw(err);
			expect(() => getExcluded([{}])).to.throw(err);
			expect(() => getExcluded([{isDelete: true}])).to.throw(err);
			expect(() => getExcluded([{name: 'asd'}])).to.throw(err);
			expect(() => getExcluded(n(['hello']))).to.not.throw();
		});

		it('returns an Array', () => {
			expect(getExcluded(n(['hello']))).to.be.an('array');
			expect(getExcluded(n([]))).to.be.an('array');
		});

		it('exclude extensions', () => {
			expect(getExcluded(n(['hello']))).to.deep.equal([]);
			expect(getExcluded(n(['!hello']))).to.deep.equal(['hello']);
			expect(getExcluded(n(['hello', '!hello']))).to.deep.equal(['hello']);
		});

	});


	describe('method "_removeExcluded"', () => {

		let removeExcluded	= service._removeExcluded;

		it('is a function', () => {
			expect(removeExcluded).to.be.a('function');
		});

		it('only allow Array as first argument', () => {
			let err = 'Method core._removeExcluded needs first argument to be an Array.';
			expect(() => removeExcluded({})).to.throw(err);
			expect(() => removeExcluded()).to.throw(err);
			expect(() => removeExcluded([])).to.not.throw(err);
		});

		it('only allow Array as second argument', () => {
			let err = 'Method core._removeExcluded needs second argument to be an Array.';
			expect(() => removeExcluded([], {})).to.throw(err);
			expect(() => removeExcluded([], [])).to.not.throw();
		});

		it('not removed if not excluded', () => {
			let extensions = [{name: 'hello'}];
			expect(removeExcluded(extensions, [])).to.deep.equal(extensions);
		});

		it('removed if excluded', () => {
			let extensions = [{name: 'hello'}];
			expect(removeExcluded(extensions, ['hello'])).to.deep.equal([]);
		});

		it('ignores invalid extension format', () => {
			let extensions = [{name: 'hello'}, 'nope'];
			expect(removeExcluded(extensions, [])).to.deep.equal(extensions);
			expect(removeExcluded(extensions, ['hello'])).to.deep.equal(['nope']);
		});

	});


	describe('method "normalizeExtensions"', () => {

		let normalize	= service.normalizeExtensions;
		beforeEach(() => {
			service.setExtensionFolder(extensionsMockPath);
		});

		it('is a function', () => {
			expect(normalize).to.be.a('function');
		});

		it('allows string format', () => {
			expect(normalize(['demoExtension']).length).to.equal(1);
		});

		it('allows function format', () => {
			expect(normalize([() => {}]).length).to.equal(1);
		});

		it('allows object format', () => {
			expect(normalize([{name: 'demoExtension'}]).length).to.equal(1);
		});

	});


	describe('method "runExtensions"', () => {

		let n	= service.normalizeExtensions;
		let run = service.runExtensions;

		it('is a function', () => {
			expect(run).to.be.a('function');
		});

		it('only allow Loopback Model as first argument', () => {
			let err = 'Method core.runExtensions needs first argument to be a Loopback model.';
			expect(() => run({})).to.throw(err);
			expect(() => run()).to.throw(err);
			expect(() => run(createLoopbackModel())).to.not.throw(err);
		});

		it('only allow Array as second argument', () => {
			let err = 'Method core.runExtensions needs second argument to be an Array.';
			expect(() => run(createLoopbackModel(), {})).to.throw(err);
			expect(() => run(createLoopbackModel(), [])).to.not.throw();
		});

		it('extends the model with functions', () => {
			let extensions	= [
				{func: model => model.works = true},
				{func: model => model.other = 32}
			];
			let Model = createLoopbackModel();
			console.log(typeof Model);
			run(Model, extensions);
			expect(Model.works).to.equal(true);
			expect(Model.other).to.equal(32);
		});

	});


	describe('method "_findFunctions"', () => {

		let n	= service.normalizeExtensions;
		let find = service._findFunctions;

		it('is a function', () => {
			expect(find).to.be.a('function');
		});

		it('only allow Array as first argument', () => {
			let err = 'Method core._findFunctions needs first argument to be an Array.';
			expect(() => find({})).to.throw(err);
			expect(() => find([])).to.not.throw();
		});

		it('fills with functions', () => {
			let extensions = [{name: 'demoExtension'}];
			extensions = find(extensions);
			expect(extensions[0].func).to.be.a('function');
		});

	});


});
