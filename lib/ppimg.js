'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _regenerator = require('babel-runtime/regenerator');var _regenerator2 = _interopRequireDefault(_regenerator);var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);exports.default =








ImagePostProcessor;var _bluebird = require('bluebird');var _bluebird2 = _interopRequireDefault(_bluebird);var _shellHelper = require('shell-helper');var _shellHelper2 = _interopRequireDefault(_shellHelper);var _fs = require('fs');var _fs2 = _interopRequireDefault(_fs);var _os = require('os');var _os2 = _interopRequireDefault(_os);var _path = require('path');var _path2 = _interopRequireDefault(_path);var _yargs = require('yargs');var _yargs2 = _interopRequireDefault(_yargs);var _common = require('./common');function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}require('babel-runtime/core-js/promise').default = _bluebird2.default;function ImagePostProcessor() {var downsizeImage = function () {var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(














    function _callee(size, srcPath, dstPath) {var sizeOption;return _regenerator2.default.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:
              sizeOption = size <= 0 ? '' : '-Z ' + size;return _context.abrupt('return',
              (0, _common.exec)('sips -s format jpeg ' + sizeOption + ' "' + srcPath + '" --out "' + dstPath + '"', { doNotAsk: true }));case 2:case 'end':return _context.stop();}}}, _callee, this);}));return function downsizeImage(_x, _x2, _x3) {return _ref.apply(this, arguments);};}();var process = function () {var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(


    function _callee2() {var options, argv, n, size, files, dsts, lpad, i, f, src, dst;return _regenerator2.default.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:
              options = {};
              argv = _yargs2.default.argv;if (!

              argv.i) {_context2.next = 19;break;}_context2.next = 5;return (

                _shellHelper2.default.getAnswer('How many recent captures? '));case 5:n = _context2.sent;_context2.next = 8;return (
                _shellHelper2.default.getAnswer('Target size (0 for original)? '));case 8:size = _context2.sent;
              options.num = parseInt(n, 10);_context2.next = 12;return (
                _shellHelper2.default.askYesNo('Remove original images? '));case 12:options.removeAfter = _context2.sent;
              options.size = parseInt(size, 10);_context2.next = 16;return (
                _shellHelper2.default.askYesNo('Copy to clipboard instead of file? '));case 16:options.clipboard = _context2.sent;_context2.next = 20;break;case 19:
              if (argv.o) {
                options.num = 1;
                options.removeAfter = false;
                options.size = 0;
                options.clipboard = false;
              } else if (argv.c) {
                options.num = 1;
                options.removeAfter = false;
                options.size = 0;
                options.clipboard = true;
              } else {
                options.num = 1;
                options.removeAfter = false;
                options.size = 640;
                options.clipboard = false;
              }case 20:

              files = getLatestNScreenCaptures(options.num);
              dsts = [];
              lpad = function lpad(str, len) {return ('0'.repeat(len) + str).substring(Math.min(str.length, len));};
              i = 0;case 24:if (!(i < files.length)) {_context2.next = 41;break;}
              f = files[i];
              src = _path2.default.join(desktop, f);
              dst = _path2.default.join(desktop, files.length == 1 ? 'screen.jpg' : 'screen_' + lpad(i + 1, 2) + '.jpg');_context2.next = 30;return (
                downsizeImage(options.size, src, dst));case 30:if (!
              options.removeAfter) {_context2.next = 33;break;}_context2.next = 33;return (
                (0, _common.exec)('rm -f ' + src, { doNotAsk: true }));case 33:if (!


              options.clipboard) {_context2.next = 37;break;}
              console.log('Copying to clipboard.');_context2.next = 37;return (
                (0, _common.exec)('impbcopy ' + dst, { doNotAsk: true }));case 37:

              dsts.push(dst);case 38:i++;_context2.next = 24;break;case 41:return _context2.abrupt('return',


              (0, _common.exec)('open -R ' + dsts.map(function (s) {return '"' + s + '"';}).join(' '), { doNotAsk: true }));case 42:case 'end':return _context2.stop();}}}, _callee2, this);}));return function process() {return _ref2.apply(this, arguments);};}();var desktop = _path2.default.join(_os2.default.homedir(), 'Desktop');function getLatestNScreenCaptures(num) {var files = _fs2.default.readdirSync(desktop);return files.filter(function (s) {return s.endsWith('.png');}).map(function (f) {return [f, _fs2.default.statSync(_path2.default.join(desktop, f))];}).sort(function (a, b) {return b[1].ctime - a[1].ctime;}).map(function (f) {return f[0];}).slice(0, num);}


  return {
    getLatestNScreenCaptures: getLatestNScreenCaptures,
    process: process };

}