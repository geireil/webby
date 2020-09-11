"use strict";

var array = [1, 2, 3];

var y = function y() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return arr.map(function (value, index) {
    return value * args[index];
  });
};

y(2, 4, 5); // 2 8 15