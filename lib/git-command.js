'use strict';var _yargs = require('yargs');var _yargs2 = _interopRequireDefault(_yargs);
var _bluebird = require('bluebird');var _bluebird2 = _interopRequireDefault(_bluebird);

var _config = require('./config');var _config2 = _interopRequireDefault(_config);
var _git = require('./git');function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}require('babel-runtime/core-js/promise').default = _bluebird2.default;










var argv = _yargs2.default.argv;
var fn = function fn() {return _bluebird2.default.resolve();};

var db = new _config2.default();
db.initConfig();
var gitRoot = (0, _git.query)('git rev-parse --show-toplevel').trim();
var config = db.getByKey(gitRoot);

if (argv.reset) {
  Object.keys(config).forEach(function (k) {return delete config[k];});
  db.write();
  console.log('Cleared configuration for git root [' + gitRoot.yellow + ']');
}

if (argv.y) {
  config[_git.ConfigKey.askBeforeRunCommand] = false;
} else if (config[_git.ConfigKey.askBeforeRunCommand] === undefined) {
  config[_git.ConfigKey.askBeforeRunCommand] = true;
}

console.log('Current configuration\n=================');
Object.keys(_git.ConfigKey).forEach(function (k) {
  console.log('  ' + k.yellow + ' : ' + config[_git.ConfigKey[k]]);
});
console.log('=================');

(0, _git.setConfig)(config);

var commandMap = {
  'pr': _git.createAndOpenPullRequest,
  'sync': _git.synchronizeSpecificBranch,
  'master': _git.mergeDevelopToMasterAndPush,
  'prune': _git.pruneFromAllRemotes,
  'pp': _git.removeRebasedBranches };


module.exports = function (command) {
  var fn = commandMap[command];
  if (!fn) {
    console.log('Usage.\n\n  pr     : create a pull request from current local branch.\n  sync   : pull (fast-forward) from main remote.\n  master : fast-forward develop and master branches, and merge develop into master.\n  prune  : prune from all remotes.\n  pp     : sync and remove rebased local branches. (compared by commit message)\n  reset  : reset configuration for current git-root.\n  y      : (yes) don\'t ask before command. (will be saved to configuration)\n');








  } else {
    fn(config).finally(function () {
      db.write();
    });
  }
};