"use strict";

if (typeof module !== 'undefined' && module.exports) {
  var PouchDB = require('../lib');
  var testUtils = require('./test.utils.js');
}

var rfcRegexp = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

test('UUID generation count', 1, function() {
  var count = 10;

  equal(PouchDB.utils.uuids(count).length, count, "Correct number of uuids generated.");
});

test('UUID RFC4122 test', 2, function() {
  var uuid = PouchDB.utils.uuids()[0];
  equal(rfcRegexp.test(PouchDB.utils.uuids()[0]), true,
                       "Single UUID complies with RFC4122.");
  equal(rfcRegexp.test(PouchDB.utils.uuid()), true,
        "Single UUID through Pouch.utils.uuid complies with RFC4122.");
});

test('UUID generation uniqueness', 1, function() {
  var count = 1000;
  var uuids = PouchDB.utils.uuids(count);

  equal(testUtils.eliminateDuplicates(uuids).length, count,
        "Generated UUIDS are unique.");
});

test('Test small uuid uniqness', 1, function() {
  var length = 8;
  var count = 2000;

  var uuids = PouchDB.utils.uuids(count, {length: length});
  equal(testUtils.eliminateDuplicates(uuids).length, count,
        "Generated small UUIDS are unique.");
});

test('Test custom length', 11, function() {
  var length = 32;
  var count = 10;
  var options = {length: length};

  var uuids = PouchDB.utils.uuids(count, options);
  // Test single UUID wrapper
  uuids.push(PouchDB.utils.uuid(options));

  uuids.map(function (uuid) {
    equal(uuid.length, length, "UUID length is correct.");
  });
});

test('Test custom length, redix', 22, function() {
  var length = 32;
  var count = 10;
  var radix = 5;
  var options = {length: length, radix: radix};

  var uuids = PouchDB.utils.uuids(count, options);
  // Test single UUID wrapper
  uuids.push(PouchDB.utils.uuid(options));

  uuids.map(function (uuid) {
    var nums = uuid.split('').map(function(character) {
      return parseInt(character, radix);
    });

    var max = Math.max.apply(Math, nums);
    var min = Math.min.apply(Math, nums);

    equal(max < radix, true, "Maximum character is less than radix");
    equal(min >= 0, true, "Min character is greater than or equal to 0");
  });
});
