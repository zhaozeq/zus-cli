"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _dev = _interopRequireDefault(require("../../dev"));

var closed = false; // kill(2) Ctrl + C

process.once('SIGINT', function () {
  return onSignal('SIGINT');
}); // kill(3) Ctrl + \

process.once('SIGQUIT', function () {
  return onSignal('SIGQUIT');
}); // kill(15) default

process.once('SIGTERM', function () {
  return onSignal('SIGTERM');
});

function onSignal() {
  // console.log(signal)
  if (closed) return;
  closed = true;
  process.exit(0);
}

process.env.NODE_ENV = 'development';
(0, _dev["default"])({});