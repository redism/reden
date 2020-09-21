'use strict';var _bluebird = require('bluebird');var _bluebird2 = _interopRequireDefault(_bluebird);
var _yargs = require('yargs');var _yargs2 = _interopRequireDefault(_yargs);
var _common = require('./common');
var _config = require('./config');var _config2 = _interopRequireDefault(_config);
var _git = require('./git');var _git2 = _interopRequireDefault(_git);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

require('babel-runtime/core-js/promise').default = _bluebird2.default;

var argv = _yargs2.default.argv;

var gitRoot = (0, _common.query)('git rev-parse --show-toplevel').trim();
var config = _config2.default.getByKey(gitRoot);

if (argv.reset) {
  Object.keys(config).forEach(function (k) {return delete config[k];});
  _config2.default.write();
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

var commandMap = {
  pr: 'createAndOpenPullRequest',
  sync: 'synchronizeSpecificBranch',
  master: 'mergeDevelopToMasterAndPush',
  prune: 'pruneFromAllRemotes',
  pp: 'removeRebasedBranches',
  open: 'openRepository' };


module.exports = function (command) {
  var fn = commandMap[command];
  if (!fn) {
    console.log('Usage.\n\n  pr     : create a pull request from current local branch.\n  sync   : pull (fast-forward) from main remote.\n  master : fast-forward develop and master branches, and merge develop into master.\n  pa     : prune from all remotes.\n  pp     : sync and remove rebased local branches. (compared by commit message)\n  reset  : reset configuration for current git-root.\n  open   : open related github repository.\n  y      : (yes) don\'t ask before command. (will be saved to configuration)\n');









  } else {
    var sash = (0, _git2.default)(config);

    sash[fn](argv._).finally(function () {
      _config2.default.write();
    });
  }
};