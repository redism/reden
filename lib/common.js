'use strict';Object.defineProperty(exports, "__esModule", { value: true });exports.exec = undefined;var _regenerator = require('babel-runtime/regenerator');var _regenerator2 = _interopRequireDefault(_regenerator);var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);var exec = exports.exec = function () {var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(




  function _callee(command, options) {var ret, r;return _regenerator2.default.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:
            options = Object.assign({
              silent: true,
              doNotAsk: false },
            options || {});if (

            options.doNotAsk) {_context.next = 6;break;}_context.next = 4;return (
              _shellHelper2.default.askYesNo(command));case 4:ret = _context.sent;
            (0, _assert2.default)(ret, 'Cancelled by user.');case 6:


            console.log(command);
            r = _shelljs2.default.exec(command, { silent: options.silent });if (!(
            r.code !== 0)) {_context.next = 11;break;}
            console.error(r.stderr);throw (
              new Error('Command [' + command + '] exited with non-zero ' + r.code));case 11:return _context.abrupt('return',

            r.stdout);case 12:case 'end':return _context.stop();}}}, _callee, this);}));return function exec(_x, _x2) {return _ref.apply(this, arguments);};}();exports.


query = query;var _shellHelper = require('shell-helper');var _shellHelper2 = _interopRequireDefault(_shellHelper);var _assert = require('assert');var _assert2 = _interopRequireDefault(_assert);var _shelljs = require('shelljs');var _shelljs2 = _interopRequireDefault(_shelljs);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}require('colors');function query(command, options) {
  options = Object.assign({
    silent: true },
  options || {});

  var r = _shelljs2.default.exec(command, { silent: options.silent });
  if (r.code !== 0) {
    console.error(r.stderr);
    throw new Error('Command [' + command + '] exited with non-zero ' + r.code);
  }
  return r.stdout;
}