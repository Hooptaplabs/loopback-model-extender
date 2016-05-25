
var math = require('../../common/services/math');

describe('math service', function () {

  describe('adder', function () {

    it('must be a function', function () {
      expect(typeof math.add).toBe('function');
    });

    it('2 + 3 = 5', function () {
      expect(math.add(2, 5)).toBe(7);
    })


  })


});
