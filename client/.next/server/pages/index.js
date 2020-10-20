module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = require('../ssr-module-cache.js');
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete installedModules[moduleId];
/******/ 		}
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./pages/index.tsx");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./pages/index.tsx":
/*!*************************!*\
  !*** ./pages/index.tsx ***!
  \*************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\nvar _jsxFileName = \"/home/chris/projects/udemy/ticketing/client/pages/index.tsx\";\nvar __jsx = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement;\n\n\n// @ts-ignore\nconst LandingPage = ({\n  currentUser\n}) => {\n  return currentUser ? __jsx(\"h1\", {\n    __self: undefined,\n    __source: {\n      fileName: _jsxFileName,\n      lineNumber: 11,\n      columnNumber: 26\n    }\n  }, \"You are signed in\") : __jsx(\"h1\", {\n    __self: undefined,\n    __source: {\n      fileName: _jsxFileName,\n      lineNumber: 11,\n      columnNumber: 55\n    }\n  }, \"You are not signed in\");\n}; // @ts-ignore\n\n\nLandingPage.getInitialProps = async (context, client, currentUser) => {\n  return {};\n};\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (LandingPage);//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9wYWdlcy9pbmRleC50c3g/ZGI3NiJdLCJuYW1lcyI6WyJMYW5kaW5nUGFnZSIsImN1cnJlbnRVc2VyIiwiZ2V0SW5pdGlhbFByb3BzIiwiY29udGV4dCIsImNsaWVudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFFQTs7QUFNQTtBQUNBLE1BQU1BLFdBQXVDLEdBQUcsQ0FBQztBQUFFQztBQUFGLENBQUQsS0FBdUM7QUFDbkYsU0FBT0EsV0FBVyxHQUFHO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEseUJBQUgsR0FBZ0M7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSw2QkFBbEQ7QUFDSCxDQUZELEMsQ0FJQTs7O0FBQ0FELFdBQVcsQ0FBQ0UsZUFBWixHQUE4QixPQUFPQyxPQUFQLEVBQWdCQyxNQUFoQixFQUF3QkgsV0FBeEIsS0FBd0M7QUFDbEUsU0FBTyxFQUFQO0FBQ0gsQ0FGRDs7QUFJZUQsMEVBQWYiLCJmaWxlIjoiLi9wYWdlcy9pbmRleC50c3guanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYXhpb3MsIHsgQXhpb3NSZXNwb25zZSB9IGZyb20gJ2F4aW9zJztcbmltcG9ydCB7IE5leHRQYWdlIH0gZnJvbSAnbmV4dCc7XG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgYnVpbGRDbGllbnQgfSBmcm9tICcuLi9hcGkvYnVpbGQtY2xpZW50JztcbmltcG9ydCB7IEFwcEdsb2JhbFByb3BzIH0gZnJvbSAnLi9fYXBwJztcblxuaW50ZXJmYWNlIExhbmRpbmdQYWdlUHJvcHMgZXh0ZW5kcyBBcHBHbG9iYWxQcm9wcyB7fVxuXG4vLyBAdHMtaWdub3JlXG5jb25zdCBMYW5kaW5nUGFnZTogTmV4dFBhZ2U8TGFuZGluZ1BhZ2VQcm9wcz4gPSAoeyBjdXJyZW50VXNlciB9OiBMYW5kaW5nUGFnZVByb3BzKSA9PiB7XG4gICAgcmV0dXJuIGN1cnJlbnRVc2VyID8gPGgxPllvdSBhcmUgc2lnbmVkIGluPC9oMT4gOiA8aDE+WW91IGFyZSBub3Qgc2lnbmVkIGluPC9oMT47XG59O1xuXG4vLyBAdHMtaWdub3JlXG5MYW5kaW5nUGFnZS5nZXRJbml0aWFsUHJvcHMgPSBhc3luYyAoY29udGV4dCwgY2xpZW50LCBjdXJyZW50VXNlcikgPT4ge1xuICAgIHJldHVybiB7fTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IExhbmRpbmdQYWdlO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./pages/index.tsx\n");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"react\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJyZWFjdFwiPzU4OGUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEiLCJmaWxlIjoicmVhY3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJyZWFjdFwiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///react\n");

/***/ })

/******/ });