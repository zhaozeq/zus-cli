"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = send;
exports.RESTART = exports.STARTING = exports.DONE = void 0;

var debug = require('debug')('zus:send');

var DONE = 'DONE';
exports.DONE = DONE;
var STARTING = 'STARTING';
exports.STARTING = STARTING;
var RESTART = 'RESTART';
exports.RESTART = RESTART;

function send(message) {
  if (process.send) {
    debug("send ".concat(JSON.stringify(message)));
    process.send(message);
  }
}