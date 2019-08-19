'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _regenerator = require('babel-runtime/regenerator');var _regenerator2 = _interopRequireDefault(_regenerator);var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);exports.default =








Sash;var _yargs = require('yargs');var _yargs2 = _interopRequireDefault(_yargs);var _bluebird = require('bluebird');var _bluebird2 = _interopRequireDefault(_bluebird);var _config = require('./config');var _config2 = _interopRequireDefault(_config);var _shellHelper = require('shell-helper');var _shellHelper2 = _interopRequireDefault(_shellHelper);var _common = require('./common');function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}require('babel-runtime/core-js/promise').default = _bluebird2.default;require('colors');var PushBullet = require('pushbullet');function Sash(config) {var setup = function () {var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(

    function _callee() {return _regenerator2.default.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:if (
              config.apiKey) {_context.next = 6;break;}_context.next = 3;return (
                (0, _common.exec)('open https://www.pushbullet.com/#settings', { doNotAsk: true }));case 3:_context.next = 5;return (
                _shellHelper2.default.getAnswer('Enter your push bullet access token : '));case 5:config.apiKey = _context.sent;case 6:return _context.abrupt('return',

              new PushBullet(config.apiKey));case 7:case 'end':return _context.stop();}}}, _callee, this);}));return function setup() {return _ref.apply(this, arguments);};}();var devices = function () {var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(


    function _callee2() {var _push, _devices, list, index;return _regenerator2.default.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:if (
              config.device) {_context2.next = 12;break;}_context2.next = 3;return (
                setup());case 3:_push = _context2.sent;_context2.next = 6;return (
                new _bluebird2.default(function (resolve, reject) {
                  _push.devices(function (err, res) {
                    err && reject(err) || resolve(res.devices);
                  });
                }));case 6:_devices = _context2.sent;

              list = _devices.map(function (device) {
                return '[' + device.iden + '] - ' + device.nickname;
              });_context2.next = 10;return (
                _shellHelper2.default.pickList('Pick device to send push : ', list));case 10:index = _context2.sent;
              config.device = _devices[index].iden;case 12:case 'end':return _context2.stop();}}}, _callee2, this);}));return function devices() {return _ref2.apply(this, arguments);};}();var push = function () {var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(



    function _callee3() {var push, id, title, msg;return _regenerator2.default.wrap(function _callee3$(_context3) {while (1) {switch (_context3.prev = _context3.next) {case 0:_context3.next = 2;return (
                setup());case 2:push = _context3.sent;_context3.next = 5;return (
                devices());case 5:id = _context3.sent;_context3.t1 =
              config.title;if (_context3.t1) {_context3.next = 11;break;}_context3.next = 10;return _shellHelper2.default.getAnswer('Please specify push title (default = With ♡) : ');case 10:_context3.t1 = _context3.sent;case 11:_context3.t0 = _context3.t1;if (_context3.t0) {_context3.next = 14;break;}_context3.t0 = 'With ♡';case 14:title = _context3.t0;_context3.t3 =
              config.msg;if (_context3.t3) {_context3.next = 20;break;}_context3.next = 19;return _shellHelper2.default.getAnswer('Please specify push message (default = Task finished) : ');case 19:_context3.t3 = _context3.sent;case 20:_context3.t2 = _context3.t3;if (_context3.t2) {_context3.next = 23;break;}_context3.t2 = 'Task finished';case 23:msg = _context3.t2;

              config.title = title;
              config.msg = msg;_context3.next = 28;return (

                new _bluebird2.default(function (resolve, reject) {
                  push.note(id, title, msg, function (err) {
                    err ? reject(err) : resolve();
                  });
                }));case 28:case 'end':return _context3.stop();}}}, _callee3, this);}));return function push() {return _ref3.apply(this, arguments);};}();


  return {
    push: push };

}

function runPush(command) {
  var configKey = 'push';
  var config = _config2.default.getByKey(configKey);
  var argv = _yargs2.default.argv;

  if (argv.reset) {
    Object.keys(config).forEach(function (k) {return delete config[k];});
    _config2.default.write();
    console.log('Cleared configuration');
  }

  var sash = Sash(config);
  sash[command]().finally(function () {
    _config2.default.write();
  });
}

module.exports = runPush;