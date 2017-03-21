'use strict';var _yargs = require('yargs');var _yargs2 = _interopRequireDefault(_yargs);
var _bluebird = require('bluebird');var _bluebird2 = _interopRequireDefault(_bluebird);
var _shellHelper = require('shell-helper');var _shellHelper2 = _interopRequireDefault(_shellHelper);

var _config = require('../config');var _config2 = _interopRequireDefault(_config);
var _gd = require('./gd');var _gd2 = _interopRequireDefault(_gd);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}require('babel-runtime/core-js/promise').default = _bluebird2.default;

module.exports = function (command) {
  var argv = _yargs2.default.argv;
  var config = _config2.default.getByKey("_gd_setting_");

  var COMMANDS = [
  { cmd: 'createDocument', desc: 'Create a new document from a link.' },
  { cmd: 'openDocument', desc: 'List all inbox documents and open a document.' }];


  var getCommand = function getCommand() {return _bluebird2.default.resolve(command);};
  if (!command) {
    getCommand = function getCommand() {return _shellHelper2.default.pickList('What to do? ', COMMANDS.map(function (x) {return '[' + x.cmd + '] ' + x.desc;})).
      then(function (index) {return COMMANDS[index].cmd;});};
  }

  if (argv.reset) {
    Object.keys(config).forEach(function (k) {return delete config[k];});
    _config2.default.write();
    console.log('Cleared local configuration for gd');
  }

  console.log('Current configuration\n=================');
  Object.keys(_gd.ConfigKey).forEach(function (k) {
    console.log('  ' + k.yellow + ' : ' + config[_gd.ConfigKey[k]]);
  });
  console.log('=================');
  var sash = (0, _gd2.default)(config);

  _bluebird2.default.resolve(getCommand()).
  then(function (x) {
    console.log(x);
    return x;
  }).
  then(function (command) {return sash[command]();}).finally(function () {
    _config2.default.write();
  });
};

if (require.main === module) {
  module.exports();
}