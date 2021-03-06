"use strict";

var SockJS = require('sockjs-client');

var _require = require('./patchConnection'),
    connectServer = _require.connectServer,
    showLoading = _require.showLoading;

var retries = 0;
var sock = null;

var socket = function initSocket(url, handlers) {
  sock = new SockJS(url);

  sock.onopen = function onopen() {
    retries = 0;
  };

  sock.onmessage = handlers.onmessage;

  sock.onclose = function onclose() {
    if (retries === 0) {
      handlers.onclose();
    } // Try to reconnect.


    sock = null; // After 10 retries stop trying, to prevent logspam.

    if (retries < 1) {
      // Exponentially increase timeout to reconnect.
      // Respectfully copied from the package `got`.
      // eslint-disable-next-line no-mixed-operators, no-restricted-properties
      var retryInMs = 1000 * Math.pow(2, retries) + Math.random() * 100;
      retries += 1;
      setTimeout(function () {
        socket(url, handlers);
      }, retryInMs);
    } else {
      showLoading();
      connectServer(function () {
        console.log(window, 'window2');
        window.location.reload();
      });
    }
  };
};

module.exports = socket;