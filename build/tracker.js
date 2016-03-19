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
/***/ function(module, exports) {

	"use strict";

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	// Communicate with the background script, which handles the storage modifications and make it add a new log.
	function addLink(href, title, ref) {
		var data = { href: href, title: title, ref: ref, time: Date.now() };

		var port = chrome.runtime.connect({ name: "adder" });
		port.postMessage({ add: data });
		port.disconnect();
	}

	var config = {
		"news.ycombinator.com": {
			ref: "ycombinator",
			follow: [".athing .title > a"]
		},
		"www.reddit.com": {
			ref: "reddit",
			follow: [".entry > p.title > a.title"]
		}
	};

	// Loaded content script on document_idle no need to wait for document on load before querying or modifiying document elements.
	// Check which page this content script is running on and if we need to follow any links...
	if (config[location.host] != undefined) {
		var cfg = config[location.host];

		// For each css selector to follow...
		for (var f in cfg.follow) {
			// Get every link to be followed in the dom...
			var follow = cfg.follow[f],
			    things = document.querySelectorAll(follow);

			// And add click listeners to them.
			for (var i in things) {
				var thing = things[i];
				if ((typeof thing === "undefined" ? "undefined" : _typeof(thing)) != "object") continue;

				thing.addEventListener("click", function (e) {
					// Add the clicked link to the log history.
					addLink(e.target.href, e.target.innerText, cfg.ref);
				});
			}
		}
	}

/***/ }
/******/ ]);