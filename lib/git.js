'use strict';var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);var _regenerator = require('babel-runtime/regenerator');var _regenerator2 = _interopRequireDefault(_regenerator);var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);var exec = function () {var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(




















  function _callee(command) {var silent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;var doNotAsk = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;var ret, r;return _regenerator2.default.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:if (!(
            !doNotAsk && askBeforeRunCommand)) {_context.next = 5;break;}_context.next = 3;return (
              _shellHelper2.default.askYesNo(command));case 3:ret = _context.sent;
            (0, _assert2.default)(ret, 'Cancelled by user.');case 5:


            console.log(command);
            r = _shelljs2.default.exec(command, { silent: silent });if (!(
            r.code !== 0)) {_context.next = 10;break;}
            console.error(r.stderr);throw (
              new Error('Command [' + command + '] exited with non-zero ' + r.code));case 10:return _context.abrupt('return',

            r.stdout);case 11:case 'end':return _context.stop();}}}, _callee, this);}));return function exec(_x) {return _ref.apply(this, arguments);};}();var iterateRemote = function () {var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(











  function _callee2(fn) {var remoteNames, i;return _regenerator2.default.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:_context2.next = 2;return (
              query('git remote'));case 2:_context2.t0 = function (s) {return s.trim().length > 0;};remoteNames = _context2.sent.split('\n').filter(_context2.t0);
            i = 0;case 5:if (!(i < remoteNames.length)) {_context2.next = 11;break;}_context2.next = 8;return (
              _bluebird2.default.resolve(fn(remoteNames[i])));case 8:i++;_context2.next = 5;break;case 11:case 'end':return _context2.stop();}}}, _callee2, this);}));return function iterateRemote(_x5) {return _ref2.apply(this, arguments);};}();var iterateLocalBranches = function () {var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(



  function _callee3(fn) {var branches, i;return _regenerator2.default.wrap(function _callee3$(_context3) {while (1) {switch (_context3.prev = _context3.next) {case 0:
            branches = query('git branch -a').split('\n').
            map(function (s) {return s.trim();}).
            filter(function (s) {return s.length > 0;}).
            filter(function (s) {return !s.startsWith('*');}).
            filter(function (s) {return !s.startsWith('remotes');}).
            filter(function (s) {return !s.startsWith('develop');}).
            filter(function (s) {return !s.startsWith('master');});

            i = 0;case 2:if (!(i < branches.length)) {_context3.next = 8;break;}_context3.next = 5;return (
              _bluebird2.default.resolve(fn(branches[i])));case 5:i++;_context3.next = 2;break;case 8:case 'end':return _context3.stop();}}}, _callee3, this);}));return function iterateLocalBranches(_x6) {return _ref3.apply(this, arguments);};}();var getRemoteNameToSync = function () {var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(



  function _callee4(config) {var remoteNames;return _regenerator2.default.wrap(function _callee4$(_context4) {while (1) {switch (_context4.prev = _context4.next) {case 0:if (
            config[ConfigKey.syncRemote]) {_context4.next = 9;break;}_context4.next = 3;return (
              query('git remote'));case 3:_context4.t0 = function (s) {return s.trim().length > 0;};remoteNames = _context4.sent.split('\n').filter(_context4.t0);_context4.next = 7;return (
              _shellHelper2.default.pickList('Which remote do you want to synchronize? ', remoteNames));case 7:_context4.t1 = _context4.sent;config[ConfigKey.syncRemote] = remoteNames[_context4.t1];case 9:return _context4.abrupt('return',

            config[ConfigKey.syncRemote]);case 10:case 'end':return _context4.stop();}}}, _callee4, this);}));return function getRemoteNameToSync(_x7) {return _ref4.apply(this, arguments);};}();var getLocalBranchToSync = function () {var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(


  function _callee5(config) {return _regenerator2.default.wrap(function _callee5$(_context5) {while (1) {switch (_context5.prev = _context5.next) {case 0:if (
            config[ConfigKey.syncBranch]) {_context5.next = 4;break;}_context5.next = 3;return (
              pickLocalBranch('Which branch do you want to sync? '));case 3:config[ConfigKey.syncBranch] = _context5.sent;case 4:return _context5.abrupt('return',

            config[ConfigKey.syncBranch]);case 5:case 'end':return _context5.stop();}}}, _callee5, this);}));return function getLocalBranchToSync(_x8) {return _ref5.apply(this, arguments);};}();var getMasterRepoInfo = function () {var _ref6 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(


  function _callee6(config) {var remoteName, comps;return _regenerator2.default.wrap(function _callee6$(_context6) {while (1) {switch (_context6.prev = _context6.next) {case 0:_context6.next = 2;return (
              getRemoteNameToSync(config));case 2:remoteName = _context6.sent;_context6.next = 5;return (
              query('git remote get-url ' + remoteName));case 5:_context6.t0 = function (s) {return s.trim();};comps = _context6.sent.split(':')[1].split('/').map(_context6.t0);return _context6.abrupt('return',
            [comps[0], comps[1].substring(0, comps[1].length - 4)]);case 8:case 'end':return _context6.stop();}}}, _callee6, this);}));return function getMasterRepoInfo(_x9) {return _ref6.apply(this, arguments);};}();var pickLocalBranch = function () {var _ref7 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(


  function _callee7(msg) {var branches;return _regenerator2.default.wrap(function _callee7$(_context7) {while (1) {switch (_context7.prev = _context7.next) {case 0:
            branches = query('git branch -a').split('\n').
            map(function (s) {return s.substring(2);}).
            map(function (s) {return s.trim();}).
            filter(function (s) {return s.length > 0;}).
            filter(function (s) {return !s.startsWith('remotes');});_context7.next = 3;return (
              _shellHelper2.default.pickList(msg, branches));case 3:_context7.t0 = _context7.sent;return _context7.abrupt('return', branches[_context7.t0]);case 5:case 'end':return _context7.stop();}}}, _callee7, this);}));return function pickLocalBranch(_x10) {return _ref7.apply(this, arguments);};}();var createAndOpenPullRequest = function () {var _ref8 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(










  function _callee8(config) {var branchName, accountName, _ref9, _ref10, masterAccount, masterRepo, syncBranch;return _regenerator2.default.wrap(function _callee8$(_context8) {while (1) {switch (_context8.prev = _context8.next) {case 0:
            branchName = query('git branch | grep "^*" | cut -d" " -f 2').trim();
            accountName = getOriginAccountName();_context8.next = 4;return (
              getMasterRepoInfo(config));case 4:_ref9 = _context8.sent;_ref10 = (0, _slicedToArray3.default)(_ref9, 2);masterAccount = _ref10[0];masterRepo = _ref10[1];_context8.next = 10;return (
              getLocalBranchToSync(config));case 10:syncBranch = _context8.sent;_context8.next = 13;return (
              exec('git push --set-upstream origin ' + branchName));case 13:_context8.next = 15;return (
              exec('open https://github.com/' + masterAccount + '/' + masterRepo + '/compare/' + syncBranch + '...' + accountName + ':' + branchName + '?expand=0'));case 15:case 'end':return _context8.stop();}}}, _callee8, this);}));return function createAndOpenPullRequest(_x11) {return _ref8.apply(this, arguments);};}();var synchronizeSpecificBranch = function () {var _ref11 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(


  function _callee10(config) {var _this = this;return _regenerator2.default.wrap(function _callee10$(_context10) {while (1) {switch (_context10.prev = _context10.next) {case 0:return _context10.abrupt('return',
            stashDecorator((0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee9() {var remoteName, localBranch;return _regenerator2.default.wrap(function _callee9$(_context9) {while (1) {switch (_context9.prev = _context9.next) {case 0:_context9.next = 2;return (
                        getRemoteNameToSync(config));case 2:remoteName = _context9.sent;_context9.next = 5;return (
                        getLocalBranchToSync(config));case 5:localBranch = _context9.sent;

                      console.log('Checking out ' + localBranch.yellow + ' and merging from ' + remoteName.yellow);_context9.next = 9;return (
                        exec('git checkout ' + localBranch));case 9:_context9.next = 11;return (
                        exec('git pull ' + remoteName + ' ' + localBranch + ' --ff-only'));case 11:_context9.next = 13;return (
                        exec('git remote prune origin'));case 13:case 'end':return _context9.stop();}}}, _callee9, _this);}))));case 1:case 'end':return _context10.stop();}}}, _callee10, this);}));return function synchronizeSpecificBranch(_x12) {return _ref11.apply(this, arguments);};}();var stashDecorator = function () {var _ref13 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(



  function _callee11(fn) {var hasStash;return _regenerator2.default.wrap(function _callee11$(_context11) {while (1) {switch (_context11.prev = _context11.next) {case 0:
            hasStash = hasSomethingToStash();if (!
            hasStash) {_context11.next = 5;break;}
            console.log('You have local changes. Let\'s stash first.');_context11.next = 5;return (
              exec('git stash'));case 5:_context11.prev = 5;_context11.next = 8;return (



              _bluebird2.default.resolve(fn()));case 8:_context11.next = 14;break;case 10:_context11.prev = 10;_context11.t0 = _context11['catch'](5);

            if (hasStash) {
              console.error('Action threw error!');
              console.error(_context11.t0.stack);
              console.error('You have stashed changes. But I won\'t pop it. Do it at your will.');
            }throw _context11.t0;case 14:if (!



            hasStash) {_context11.next = 17;break;}_context11.next = 17;return (
              exec('git stash pop'));case 17:case 'end':return _context11.stop();}}}, _callee11, this, [[5, 10]]);}));return function stashDecorator(_x13) {return _ref13.apply(this, arguments);};}();var mergeDevelopToMasterAndPush = function () {var _ref14 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(



  function _callee13(config) {var _this2 = this;return _regenerator2.default.wrap(function _callee13$(_context13) {while (1) {switch (_context13.prev = _context13.next) {case 0:return _context13.abrupt('return',
            stashDecorator((0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee12() {var remoteName;return _regenerator2.default.wrap(function _callee12$(_context12) {while (1) {switch (_context12.prev = _context12.next) {case 0:_context12.next = 2;return (
                        getRemoteNameToSync(config));case 2:remoteName = _context12.sent;
                      console.log('Fast-forwarding ' + 'develop'.yellow + ' branch.');_context12.next = 6;return (
                        exec('git checkout develop'));case 6:_context12.next = 8;return (
                        exec('git pull ' + remoteName + ' develop --ff-only'));case 8:
                      console.log('Fast-forwarding ' + 'master'.yellow + ' branch.');_context12.next = 11;return (
                        exec('git checkout master'));case 11:_context12.next = 13;return (
                        exec('git pull ' + remoteName + ' master --ff-only'));case 13:
                      console.log('Merging ' + 'develop'.yellow + ' into ' + 'master'.yellow + '.');_context12.next = 16;return (
                        exec('git merge develop'));case 16:
                      console.log('Pushing master\'s change to ' + remoteName);_context12.next = 19;return (
                        exec('git push ' + remoteName + ' master'));case 19:
                      console.log('Checking out ' + 'develop'.yellow);_context12.next = 22;return (
                        exec('git checkout develop'));case 22:case 'end':return _context12.stop();}}}, _callee12, _this2);}))));case 1:case 'end':return _context13.stop();}}}, _callee13, this);}));return function mergeDevelopToMasterAndPush(_x14) {return _ref14.apply(this, arguments);};}();var pruneFromAllRemotes = function () {var _ref16 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(



  function _callee15() {var _this3 = this;return _regenerator2.default.wrap(function _callee15$(_context15) {while (1) {switch (_context15.prev = _context15.next) {case 0:return _context15.abrupt('return',
            iterateRemote(function () {var _ref17 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee14(remoteName) {return _regenerator2.default.wrap(function _callee14$(_context14) {while (1) {switch (_context14.prev = _context14.next) {case 0:
                        console.log('Pruning from ' + remoteName);_context14.next = 3;return (
                          exec('git remote prune ' + remoteName));case 3:case 'end':return _context14.stop();}}}, _callee14, _this3);}));return function (_x15) {return _ref17.apply(this, arguments);};}()));case 1:case 'end':return _context15.stop();}}}, _callee15, this);}));return function pruneFromAllRemotes() {return _ref16.apply(this, arguments);};}();var removeRebasedBranches = function () {var _ref18 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(














  function _callee18(config) {var _this4 = this;return _regenerator2.default.wrap(function _callee18$(_context18) {while (1) {switch (_context18.prev = _context18.next) {case 0:_context18.next = 2;return (
              synchronizeSpecificBranch(config));case 2:return _context18.abrupt('return',
            stashDecorator((0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee17() {return _regenerator2.default.wrap(function _callee17$(_context17) {while (1) {switch (_context17.prev = _context17.next) {case 0:return _context17.abrupt('return',
                      iterateLocalBranches(function () {var _ref20 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee16(branch) {var branchToSync, ancestorSha1, branchSha1, logsBranch, developSha1, logsDev, isDevContainsAllLogsOfBranch;return _regenerator2.default.wrap(function _callee16$(_context16) {while (1) {switch (_context16.prev = _context16.next) {case 0:_context16.next = 2;return (
                                    getLocalBranchToSync(config));case 2:branchToSync = _context16.sent;
                                  ancestorSha1 = query('git merge-base ' + branchToSync + ' ' + branch).trim();
                                  branchSha1 = getSha1Of(branch);
                                  logsBranch = getLogOnelinerBetween(ancestorSha1, branchSha1);

                                  developSha1 = getSha1Of(branchToSync);
                                  logsDev = getLogOnelinerBetween(ancestorSha1, developSha1);

                                  isDevContainsAllLogsOfBranch = logsBranch.every(function (log) {return logsDev.indexOf(log) >= 0;});if (!
                                  isDevContainsAllLogsOfBranch) {_context16.next = 13;break;}
                                  console.log('Local branch [' + branch + '] seems to have been rebased to ' + branchToSync + '.');_context16.next = 13;return (
                                    exec('git branch -D ' + branch));case 13:case 'end':return _context16.stop();}}}, _callee16, _this4);}));return function (_x17) {return _ref20.apply(this, arguments);};}()));case 1:case 'end':return _context17.stop();}}}, _callee17, _this4);}))));case 3:case 'end':return _context18.stop();}}}, _callee18, this);}));return function removeRebasedBranches(_x16) {return _ref18.apply(this, arguments);};}();var _bluebird = require('bluebird');var _bluebird2 = _interopRequireDefault(_bluebird);var _yargs = require('yargs');var _yargs2 = _interopRequireDefault(_yargs);var _assert = require('assert');var _assert2 = _interopRequireDefault(_assert);var _shelljs = require('shelljs');var _shelljs2 = _interopRequireDefault(_shelljs);var _shellHelper = require('shell-helper');var _shellHelper2 = _interopRequireDefault(_shellHelper);var _config = require('./config');var _config2 = _interopRequireDefault(_config);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}require('babel-runtime/core-js/promise').default = _bluebird2.default; // BRANCH_NAME=`git branch | grep "^* " | cut -d" " -f 2`
// git push --set-upstream origin $BRANCH_NAME
// open https://github.com/taggledev/peeper/compare/develop...redism:$BRANCH_NAME?expand=0
require('colors');var askBeforeRunCommand = true;var ConfigKey = { askBeforeRunCommand: 'askBeforeRunCommand', syncBranch: 'syncBranch', syncRemote: 'syncRemote' };function query(command) {var silent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;var r = _shelljs2.default.exec(command, { silent: silent });if (r.code !== 0) {console.error(r.stderr);throw new Error('Command [' + command + '] exited with non-zero ' + r.code);}return r.stdout;}function getOriginAccountName() {return query('git remote get-url origin').split(':')[1].split('/')[0];}function hasSomethingToStash() {return query('git diff').trim() !== '';}function getSha1Of(name) {return query('git rev-parse ' + name).trim();}function getLogOnelinerBetween(s1, s2) {return query('git log ' + s1 + '..' + s2 + ' --oneline').split('\n').map(function (s) {return s.trim();}).filter(function (s) {return s.length > 0;}).map(function (s) {return s.split(' ').slice(1).join(' ');});}


if (require.main === module) {
  var argv = _yargs2.default.argv;
  var fn = function fn() {return _bluebird2.default.resolve();};

  var db = new _config2.default();
  db.initConfig();
  var gitRoot = query('git rev-parse --show-toplevel').trim();
  var config = db.getByKey(gitRoot);

  if (argv.reset) {
    Object.keys(config).forEach(function (k) {return delete config[k];});
    db.write();
    console.log('Cleared configuration for git root [' + gitRoot.yellow + ']');
  }

  if (argv.y) {
    config[ConfigKey.askBeforeRunCommand] = false;
  } else if (config[ConfigKey.askBeforeRunCommand] === undefined) {
    config[ConfigKey.askBeforeRunCommand] = true;
  }

  askBeforeRunCommand = !!config[ConfigKey.askBeforeRunCommand];

  console.log('Current configuration\n=================');
  Object.keys(ConfigKey).forEach(function (k) {
    console.log('  ' + k.yellow + ' : ' + config[ConfigKey[k]]);
  });
  console.log('=================');

  if (argv.pr) {
    fn = createAndOpenPullRequest;
  } else if (argv.sync) {
    fn = synchronizeSpecificBranch;
  } else if (argv.master) {
    fn = mergeDevelopToMasterAndPush;
  } else if (argv.prune) {
    fn = pruneFromAllRemotes;
  } else if (argv.pp) {
    fn = removeRebasedBranches;
  } else {
    console.log('Usage.\n\n  pr     : create a pull request from current local branch.\n  sync   : pull (fast-forward) from main remote.\n  master : fast-forward develop and master branches, and merge develop into master.\n  prune  : prune from all remotes.\n  pp     : sync and remove rebased local branches. (compared by commit message)\n  reset  : reset configuration for current git-root.\n  y      : (yes) don\'t ask before command. (will be saved to configuration)\n');








  }

  fn(config).finally(function () {
    db.write();
  });
}