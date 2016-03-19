/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {"use strict";

	/*
		An instance of a worker to hold the state of the current log history(logs) and logs to append to this history(queue)
		This worker is coded so we can have a persistent history while getting request of log adds from multiple content scripts
	*/
	var worker = new function Worker() {
		var logs = null,
		    onStorageLoad = [],
		    queue = [],
		    working = false;

		chrome.storage.local.get("history", function (data) {
			if (data == null || "history" in data == false) logs = {};else logs = data["history"] || {};

			(function call(i) {
				if (typeof onStorageLoad[i] == "function") onStorageLoad[i](logs, function () {
					call(i + 1);
				});
			})(0);
		});

		function work(_, next) {
			// If we get a request of `log add` before we finish retrieving history from the chrome storage, wait for the retrieving to finish.
			if (logs == null) {
				if (onStorageLoad.indexOf(work) == -1) onStorageLoad.push(work);
				return;
			}

			// Set working true while processing the `log add` requests. So only one work function will be executed when we recieve multiple add requests.
			working = true;
			(function process() {
				if (queue.length == 0) {
					working = false;
					if (typeof next == "function") next();
					return;
				}

				var data = queue.pop();

				logs[data.href] = data;
				// Store the updated log history and process the next `log add` request by calling the process function when storing completes.
				chrome.storage.local.set({ "history": logs }, process);
			})();
		}

		// Clear the log history.
		Worker.prototype.clear = function (_, next) {
			// If we get a `clear` request before we retrieve the log history, wait for the retrieving to finish and then clear the history.
			if (logs == null) {
				// Make sure the clear function is the first to be called after the retrieving of the log history completes.
				if (onStorageLoad[0] != this.clear) onStorageLoad.unshift(this.clear);
				return;
			}

			logs = {};
			chrome.storage.local.set({ history: {} }, next);
		};

		// Push `log add` request to the queue and call the work function for processing if it isn't working already.
		Worker.prototype.add = function (data) {
			queue.push(data);
			if (working == false) work();
		};
	}();

	// Wait for a port to be opened between this script and a content/options page script.
	chrome.runtime.onConnect.addListener(function (port) {
		port.onMessage.addListener(function (request) {
			// Check if we got a `log add` or `clear` request.
			if (request.add != undefined) worker.add(request.add);else if (request.clear == true) worker.clear();
		});
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	// shim for using process in browser

	var process = module.exports = {};
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = setTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while (len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    clearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        setTimeout(drainQueue, 0);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () {
	    return '/';
	};
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function () {
	    return 0;
	};

/***/ }
/******/ ]);