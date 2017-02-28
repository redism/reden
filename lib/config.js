'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);var _createClass2 = require('babel-runtime/helpers/createClass');var _createClass3 = _interopRequireDefault(_createClass2);var _assert = require('assert');var _assert2 = _interopRequireDefault(_assert);
var _fs = require('fs');var _fs2 = _interopRequireDefault(_fs);
var _path = require('path');var _path2 = _interopRequireDefault(_path);
var _os = require('os');var _os2 = _interopRequireDefault(_os);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var

Config = function () {
  function Config() {(0, _classCallCheck3.default)(this, Config);
    this._config = null;
    this._configPath = _path2.default.join(_os2.default.homedir(), '.eden.json');
  }(0, _createClass3.default)(Config, [{ key: 'initConfig', value: function initConfig()

    {
      var configPath = this._configPath;
      if (_fs2.default.existsSync(configPath)) {
        var stat = _fs2.default.statSync(configPath);
        (0, _assert2.default)(stat.isFile(), 'config file is not a file.');
        this._config = require(configPath);
      } else {
        this._config = {};
      }
    } }, { key: 'write', value: function write()

    {
      _fs2.default.writeFileSync(this._configPath, global.JSON.stringify(this._config));
    } }, { key: 'getByKey', value: function getByKey(

    key) {
      if (!this._config[key]) {
        this._config[key] = {};
      }
      return this._config[key];
    } }]);return Config;}();exports.default = Config;


if (require.main === module) {
  var c = new Config();
  c.initConfig();
  c.write();
}