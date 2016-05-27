
var service = require('../dist/index');

describe('math service', function () {

  describe('adder', function () {

    it('must be a function', function () {
      expect(typeof math).toBe('undefined');
    });

    it('2 + 3 = 5', function () {
      expect(2+2).toBe(4);
    })

	  
  })


});
