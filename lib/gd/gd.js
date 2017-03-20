'use strict';Object.defineProperty(exports, "__esModule", { value: true });exports.ConfigKey = undefined;var _regenerator = require('babel-runtime/regenerator');var _regenerator2 = _interopRequireDefault(_regenerator);var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);exports.default =


































GDSash;var _path = require('path');var _path2 = _interopRequireDefault(_path);var _lodash = require('lodash');var _lodash2 = _interopRequireDefault(_lodash);var _fs = require('fs');var _fs2 = _interopRequireDefault(_fs);var _shellHelper = require('shell-helper');var _shellHelper2 = _interopRequireDefault(_shellHelper);var _assert = require('assert');var _assert2 = _interopRequireDefault(_assert);var _common = require('../common');function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var ConfigKey = exports.ConfigKey = { GoogleDriveLocalPath: 'GoogleDriveLocalPath' };function ensureDirectory(root, pathComp) {var p = _path2.default.join(root, pathComp);if (!_fs2.default.existsSync(p)) {_fs2.default.mkdirSync(p);} else if (!isDirectory(p)) {throw new Error('Path : ' + p + ' is NOT a directory.');}return p;}function isDirectory(path) {if (!_fs2.default.existsSync(path)) {return false;}try {var stat = _fs2.default.lstatSync(path);return stat.isDirectory();} catch (ex) {console.error(ex);return false;}}function GDSash(config) {var openDB = function () {var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(














    function _callee() {var configPath, stat;return _regenerator2.default.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:
              // read or create .gd-info.json
              configPath = dir.json;
              if (_fs2.default.existsSync(configPath)) {
                stat = _fs2.default.statSync(configPath);
                (0, _assert2.default)(stat.isFile(), 'config file is not a file.');
                db = require(configPath);
              }case 2:case 'end':return _context.stop();}}}, _callee, this);}));return function openDB() {return _ref.apply(this, arguments);};}();var saveDB = function () {var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(


    function _callee2() {return _regenerator2.default.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:
              _fs2.default.writeFileSync(dir.json, global.JSON.stringify(db));case 1:case 'end':return _context2.stop();}}}, _callee2, this);}));return function saveDB() {return _ref2.apply(this, arguments);};}();var init = function () {var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(


    function _callee3() {var msg, rootDir, r;return _regenerator2.default.wrap(function _callee3$(_context3) {while (1) {switch (_context3.prev = _context3.next) {case 0:
              msg = 'Please specify local directory path synced by google drive : ';
              rootDir = config[ConfigKey.GoogleDriveLocalPath];

              // ensuring google drive local path.
            case 2:if (
              isDirectory(rootDir)) {_context3.next = 16;break;}_context3.next = 5;return (
                _shellHelper2.default.getAnswer(msg));case 5:rootDir = _context3.sent;if (
              _fs2.default.existsSync(rootDir)) {_context3.next = 11;break;}_context3.next = 9;return (
                _shellHelper2.default.askYesNo('Path [' + rootDir + '] does not exist. Create one? '));case 9:r = _context3.sent;
              if (r) {
                ensureDirectory(rootDir);
              }case 11:if (!


              isDirectory(rootDir)) {_context3.next = 14;break;}
              config[ConfigKey.GoogleDriveLocalPath] = rootDir;return _context3.abrupt('break', 18);case 14:_context3.next = 17;break;case 16:return _context3.abrupt('break', 18);case 17:if (





              true) {_context3.next = 2;break;}case 18:

              // ensure sub-directory existence.
              dir.root = rootDir;
              dir.template = ensureDirectory(rootDir, 'Templates');
              dir.inbox = ensureDirectory(rootDir, 'Inbox');
              dir.archive = ensureDirectory(rootDir, 'Archive');
              dir.json = _path2.default.join(rootDir, '.gd-info.json');

              console.log('Templates directory : ' + dir.template.yellow);
              console.log('Inbox directory : ' + dir.inbox.yellow);
              console.log('Archive directory : ' + dir.archive.yellow);
              console.log('.gd-info.json location : ' + dir.json.yellow);
              console.log('');_context3.next = 30;return (

                openDB());case 30:case 'end':return _context3.stop();}}}, _callee3, this);}));return function init() {return _ref3.apply(this, arguments);};}();var pickTemplate = function () {var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(


    function _callee4() {var list, r;return _regenerator2.default.wrap(function _callee4$(_context4) {while (1) {switch (_context4.prev = _context4.next) {case 0:
              list = _fs2.default.readdirSync(dir.template).
              filter(function (p) {
                return _fs2.default.lstatSync(_path2.default.join(dir.template, p)).isFile();
              });_context4.next = 3;return (

                _shellHelper2.default.pickList('Pick a template : ', list));case 3:r = _context4.sent;return _context4.abrupt('return',
              _path2.default.join(dir.template, list[r]));case 5:case 'end':return _context4.stop();}}}, _callee4, this);}));return function pickTemplate() {return _ref4.apply(this, arguments);};}();var getLinkToken = function () {var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(


    function _callee5(link) {return _regenerator2.default.wrap(function _callee5$(_context5) {while (1) {switch (_context5.prev = _context5.next) {case 0:return _context5.abrupt('return',
              link);case 1:case 'end':return _context5.stop();}}}, _callee5, this);}));return function getLinkToken(_x) {return _ref5.apply(this, arguments);};}();var createDocument = function () {var _ref6 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(


    function _callee6(link) {var linkToken, existing, templatePath, title, seq, now, titlePrefix, fullFileName, fullPath;return _regenerator2.default.wrap(function _callee6$(_context6) {while (1) {switch (_context6.prev = _context6.next) {case 0:_context6.next = 2;return (
                init());case 2:_context6.t0 =
              getLinkToken;_context6.next = 5;return _shellHelper2.default.getAnswer('Which link do you want to map document to? ');case 5:_context6.t1 = _context6.sent;_context6.next = 8;return (0, _context6.t0)(_context6.t1);case 8:linkToken = _context6.sent;

              existing = db.linkMap[linkToken];if (!

              existing) {_context6.next = 16;break;}
              console.log('Document for given link already exists. Opening the document.');_context6.next = 14;return (
                (0, _common.exec)('open -R "' + existing + '"', { doNotAsk: true }));case 14:_context6.next = 39;break;case 16:_context6.next = 18;return (

                pickTemplate());case 18:templatePath = _context6.sent;
              title = '';case 20:if (!(
              title === '')) {_context6.next = 26;break;}_context6.next = 23;return (
                _shellHelper2.default.getAnswer('Please enter the title : '));case 23:title = _context6.sent;_context6.next = 20;break;case 26:

              seq = db.seq++;
              now = new Date();

              titlePrefix = '' + now.getFullYear() + (now.getMonth() + 1) + now.getDate() + '-' + _lodash2.default.padStart(seq, 5, '0') + ' ' + title;
              fullFileName = '' + titlePrefix + _path2.default.extname(templatePath);
              console.log('Copying [' + fullFileName.yellow + '] to the Inbox.');

              fullPath = _path2.default.join(dir.inbox, fullFileName);_context6.next = 34;return (
                (0, _common.exec)('cp "' + templatePath + '" "' + fullPath + '"', { doNotAsk: true }));case 34:
              // const docData = global.JSON.parse(fs.readFileSync(fullPath))

              db.linkMap[linkToken] = fullPath;_context6.next = 37;return (
                (0, _common.exec)('open -R "' + fullPath + '"', { doNotAsk: true }));case 37:_context6.next = 39;return (
                saveDB());case 39:case 'end':return _context6.stop();}}}, _callee6, this);}));return function createDocument(_x2) {return _ref6.apply(this, arguments);};}();var dir = { root: null, template: null, inbox: null, archive: null, json: null };var db = { seq: 1, linkMap: {} };



  return {
    init: init,
    createDocument: createDocument };

}