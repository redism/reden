'use strict';Object.defineProperty(exports, "__esModule", { value: true });exports.ConfigKey = undefined;var _regenerator = require('babel-runtime/regenerator');var _regenerator2 = _interopRequireDefault(_regenerator);var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);exports.default =



























GDSash;var _path = require('path');var _path2 = _interopRequireDefault(_path);var _fs = require('fs');var _fs2 = _interopRequireDefault(_fs);var _shellHelper = require('shell-helper');var _shellHelper2 = _interopRequireDefault(_shellHelper);var _common = require('../common');function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var ConfigKey = exports.ConfigKey = { GoogleDriveLocalPath: 'GoogleDriveLocalPath' };function ensureDirectory(path) {var stat = _fs2.default.lstatSync(path);console.log(stat);}function isDirectory(path) {if (!_fs2.default.existsSync(path)) {return false;}try {var stat = _fs2.default.lstatSync(path);return stat.isDirectory();} catch (ex) {console.error(ex);return false;}}function GDSash(config) {var init = function () {var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(

    function _callee() {var msg, rootDir;return _regenerator2.default.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:
              console.log('init');
              msg = 'Please specify local directory path synced by google drive : ';
              rootDir = config[ConfigKey.GoogleDriveLocalPath];case 3:if (


              isDirectory(rootDir)) {_context.next = 12;break;}_context.next = 6;return (
                _shellHelper2.default.getAnswer(msg));case 6:rootDir = _context.sent;if (!
              isDirectory(rootDir)) {_context.next = 10;break;}
              config[ConfigKey.GoogleDriveLocalPath] = rootDir;return _context.abrupt('break', 14);case 10:_context.next = 13;break;case 12:return _context.abrupt('break', 14);case 13:if (





              true) {_context.next = 3;break;}case 14:case 'end':return _context.stop();}}}, _callee, this);}));return function init() {return _ref.apply(this, arguments);};}();var createDocument = function () {var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(


    function _callee2(link) {return _regenerator2.default.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:_context2.next = 2;return (
                init());case 2:
              console.log(45);case 3:case 'end':return _context2.stop();}}}, _callee2, this);}));return function createDocument(_x) {return _ref2.apply(this, arguments);};}();


  // const TemplatePath = path.join(config.GoogleDriveLocalPath, "Templates")
  // const InboxPath = path.join(config.GoogleDriveLocalPath, "Inbox")
  // const ArchivePath = path.join(config.GoogleDriveLocalPath, "Archives")

  return {
    init: init,
    createDocument: createDocument };

}