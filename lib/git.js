'use strict';Object.defineProperty(exports, "__esModule", { value: true });exports.ConfigKey = undefined;var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);var _regenerator = require('babel-runtime/regenerator');var _regenerator2 = _interopRequireDefault(_regenerator);var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);exports.default =



























GitSash;var _assert = require('assert');var _assert2 = _interopRequireDefault(_assert);var _bluebird = require('bluebird');var _bluebird2 = _interopRequireDefault(_bluebird);var _path = require('path');var _path2 = _interopRequireDefault(_path);var _shellHelper = require('shell-helper');var _shellHelper2 = _interopRequireDefault(_shellHelper);var _common = require('./common');function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}require('babel-runtime/core-js/promise').default = _bluebird2.default; // BRANCH_NAME=`git branch | grep "^* " | cut -d" " -f 2`
// git push --set-upstream origin $BRANCH_NAME
// open https://github.com/taggledev/peeper/compare/develop...redism:$BRANCH_NAME?expand=0
require('colors');var ConfigKey = exports.ConfigKey = { askBeforeRunCommand: 'askBeforeRunCommand', syncBranch: 'syncBranch', syncRemote: 'syncRemote' };function wrapBranchNameSafe(branchName) {var alreadyWrap = branchName[0] === '"' && branchName[branchName.length - 1] === '"';return alreadyWrap ? branchName : '"' + branchName + '"';}function replaceBranchNameForWeb(branchName) {return encodeURIComponent(branchName);}function GitSash(config) {var iterateRemote = function () {var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(fn) {var remoteNames, i;return _regenerator2.default.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:_context.next = 2;return (
                (0, _common.query)('git remote'));case 2:_context.t0 = function (s) {return s.trim().length > 0;};remoteNames = _context.sent.split('\n').filter(_context.t0);
              i = 0;case 5:if (!(i < remoteNames.length)) {_context.next = 11;break;}_context.next = 8;return (
                _bluebird2.default.resolve(fn(remoteNames[i])));case 8:i++;_context.next = 5;break;case 11:case 'end':return _context.stop();}}}, _callee, this);}));return function iterateRemote(_x) {return _ref.apply(this, arguments);};}();var getBranchesToKeep = function () {var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(



    function _callee2() {var names, gitRoot, info;return _regenerator2.default.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:
              names = ['*', 'develop', 'master', 'main'];_context2.prev = 1;

              gitRoot = (0, _common.query)('git rev-parse --show-toplevel');
              info = require(_path2.default.join(gitRoot, './.reden.js'));
              // {
              //   "branchesToKeep": ["qa", "somethingElse"]
              // }
              return _context2.abrupt('return', [].concat(names, [info.branchesToKeep || []]));case 7:_context2.prev = 7;_context2.t0 = _context2['catch'](1);return _context2.abrupt('return',

              names);case 10:case 'end':return _context2.stop();}}}, _callee2, this, [[1, 7]]);}));return function getBranchesToKeep() {return _ref2.apply(this, arguments);};}();var iterateLocalBranches = function () {var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(



    function _callee3(fn) {var branchesToKeep, branches, i;return _regenerator2.default.wrap(function _callee3$(_context3) {while (1) {switch (_context3.prev = _context3.next) {case 0:_context3.next = 2;return (
                getBranchesToKeep());case 2:branchesToKeep = _context3.sent;
              branches = (0, _common.query)('git branch -a').
              split('\n').
              map(function (s) {return s.trim();}).
              filter(function (s) {return s.length > 0;}).
              filter(function (s) {return !s.startsWith('*');}).
              filter(function (s) {return !s.startsWith('remotes');}).
              filter(function (s) {return !branchesToKeep.includes(s);});

              i = 0;case 5:if (!(i < branches.length)) {_context3.next = 11;break;}_context3.next = 8;return (
                _bluebird2.default.resolve(fn(branches[i])));case 8:i++;_context3.next = 5;break;case 11:case 'end':return _context3.stop();}}}, _callee3, this);}));return function iterateLocalBranches(_x2) {return _ref3.apply(this, arguments);};}();var getRemoteNameToSync = function () {var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(



    function _callee4() {var remoteNames;return _regenerator2.default.wrap(function _callee4$(_context4) {while (1) {switch (_context4.prev = _context4.next) {case 0:if (
              config[ConfigKey.syncRemote]) {_context4.next = 9;break;}_context4.next = 3;return (
                (0, _common.query)('git remote'));case 3:_context4.t0 = function (s) {return s.trim().length > 0;};remoteNames = _context4.sent.split('\n').filter(_context4.t0);_context4.next = 7;return (

                _shellHelper2.default.pickList('Which remote do you want to synchronize? ', remoteNames));case 7:_context4.t1 = _context4.sent;config[ConfigKey.syncRemote] = remoteNames[_context4.t1];case 9:return _context4.abrupt('return',

              config[ConfigKey.syncRemote]);case 10:case 'end':return _context4.stop();}}}, _callee4, this);}));return function getRemoteNameToSync() {return _ref4.apply(this, arguments);};}();var getLocalBranchToSync = function () {var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(


    function _callee5() {return _regenerator2.default.wrap(function _callee5$(_context5) {while (1) {switch (_context5.prev = _context5.next) {case 0:if (
              config[ConfigKey.syncBranch]) {_context5.next = 4;break;}_context5.next = 3;return (
                pickLocalBranch('Which branch do you want to sync? '));case 3:config[ConfigKey.syncBranch] = _context5.sent;case 4:return _context5.abrupt('return',

              config[ConfigKey.syncBranch]);case 5:case 'end':return _context5.stop();}}}, _callee5, this);}));return function getLocalBranchToSync() {return _ref5.apply(this, arguments);};}();var getMasterRepoInfo = function () {var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(


    function _callee6() {var remoteName, comps;return _regenerator2.default.wrap(function _callee6$(_context6) {while (1) {switch (_context6.prev = _context6.next) {case 0:_context6.next = 2;return (
                getRemoteNameToSync());case 2:remoteName = _context6.sent;_context6.next = 5;return (
                (0, _common.query)('git remote get-url ' + remoteName));case 5:_context6.t0 =


              function (s) {return s.trim();};comps = _context6.sent.split('://')[1].split('/').map(_context6.t0);return _context6.abrupt('return',
              [comps[1], comps[2].substring(0, comps[2].length - 4)]);case 8:case 'end':return _context6.stop();}}}, _callee6, this);}));return function getMasterRepoInfo() {return _ref6.apply(this, arguments);};}();var pickLocalBranch = function () {var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(


    function _callee7(msg) {var branches;return _regenerator2.default.wrap(function _callee7$(_context7) {while (1) {switch (_context7.prev = _context7.next) {case 0:
              branches = (0, _common.query)('git branch -a').
              split('\n').
              map(function (s) {return s.substring(2);}).
              map(function (s) {return s.trim();}).
              filter(function (s) {return s.length > 0;}).
              filter(function (s) {return !s.startsWith('remotes');});_context7.next = 3;return (
                _shellHelper2.default.pickList(msg, branches));case 3:_context7.t0 = _context7.sent;return _context7.abrupt('return', branches[_context7.t0]);case 5:case 'end':return _context7.stop();}}}, _callee7, this);}));return function pickLocalBranch(_x3) {return _ref7.apply(this, arguments);};}();var createAndOpenPullRequest = function () {var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(










    function _callee8() {var branchName, accountName, _ref9, _ref10, masterAccount, masterRepo, syncBranch;return _regenerator2.default.wrap(function _callee8$(_context8) {while (1) {switch (_context8.prev = _context8.next) {case 0:
              branchName = (0, _common.query)('git branch | grep "^*" | cut -d" " -f 2').trim();
              accountName = getOriginAccountName();_context8.next = 4;return (
                getMasterRepoInfo());case 4:_ref9 = _context8.sent;_ref10 = (0, _slicedToArray3.default)(_ref9, 2);masterAccount = _ref10[0];masterRepo = _ref10[1];_context8.next = 10;return (
                getLocalBranchToSync());case 10:syncBranch = _context8.sent;_context8.next = 13;return (
                exec('git push --set-upstream origin ' + wrapBranchNameSafe(branchName)));case 13:_context8.next = 15;return (
                exec('open https://github.com/' +
                masterAccount + '/' + masterRepo + '/compare/' + replaceBranchNameForWeb(
                syncBranch) + '...' +
                accountName + ':' + replaceBranchNameForWeb(branchName) + '?expand=0'));case 15:case 'end':return _context8.stop();}}}, _callee8, this);}));return function createAndOpenPullRequest() {return _ref8.apply(this, arguments);};}();var synchronizeSpecificBranch = function () {var _ref11 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(



    function _callee10() {var _this = this;return _regenerator2.default.wrap(function _callee10$(_context10) {while (1) {switch (_context10.prev = _context10.next) {case 0:return _context10.abrupt('return',
              stashDecorator((0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9() {var remoteName, localBranch;return _regenerator2.default.wrap(function _callee9$(_context9) {while (1) {switch (_context9.prev = _context9.next) {case 0:_context9.next = 2;return (
                          getRemoteNameToSync());case 2:remoteName = _context9.sent;_context9.t0 =
                        wrapBranchNameSafe;_context9.next = 6;return getLocalBranchToSync();case 6:_context9.t1 = _context9.sent;localBranch = (0, _context9.t0)(_context9.t1);

                        console.log('Checking out ' + localBranch.yellow + ' and merging from ' + remoteName.yellow);_context9.next = 11;return (
                          exec('git checkout ' + localBranch));case 11:_context9.next = 13;return (
                          exec('git pull ' + remoteName + ' ' + localBranch + ' --ff-only'));case 13:_context9.next = 15;return (
                          exec('git remote prune origin'));case 15:case 'end':return _context9.stop();}}}, _callee9, _this);}))));case 1:case 'end':return _context10.stop();}}}, _callee10, this);}));return function synchronizeSpecificBranch() {return _ref11.apply(this, arguments);};}();var stashDecorator = function () {var _ref13 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(



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
                exec('git stash pop'));case 17:case 'end':return _context11.stop();}}}, _callee11, this, [[5, 10]]);}));return function stashDecorator(_x4) {return _ref13.apply(this, arguments);};}();var mergeDevelopToMasterAndPush = function () {var _ref14 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(



    function _callee13() {var _this2 = this;return _regenerator2.default.wrap(function _callee13$(_context13) {while (1) {switch (_context13.prev = _context13.next) {case 0:return _context13.abrupt('return',
              stashDecorator((0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee12() {var remoteName;return _regenerator2.default.wrap(function _callee12$(_context12) {while (1) {switch (_context12.prev = _context12.next) {case 0:_context12.next = 2;return (
                          getRemoteNameToSync());case 2:remoteName = _context12.sent;
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
                          exec('git checkout develop'));case 22:case 'end':return _context12.stop();}}}, _callee12, _this2);}))));case 1:case 'end':return _context13.stop();}}}, _callee13, this);}));return function mergeDevelopToMasterAndPush() {return _ref14.apply(this, arguments);};}();var pruneFromAllRemotes = function () {var _ref16 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(



    function _callee15() {var _this3 = this;return _regenerator2.default.wrap(function _callee15$(_context15) {while (1) {switch (_context15.prev = _context15.next) {case 0:return _context15.abrupt('return',
              iterateRemote(function () {var _ref17 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee14(remoteName) {return _regenerator2.default.wrap(function _callee14$(_context14) {while (1) {switch (_context14.prev = _context14.next) {case 0:
                          console.log('Pruning from ' + remoteName);_context14.next = 3;return (
                            exec('git remote prune ' + remoteName));case 3:case 'end':return _context14.stop();}}}, _callee14, _this3);}));return function (_x5) {return _ref17.apply(this, arguments);};}()));case 1:case 'end':return _context15.stop();}}}, _callee15, this);}));return function pruneFromAllRemotes() {return _ref16.apply(this, arguments);};}();var removeRebasedBranches = function () {var _ref18 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(















    function _callee18() {var _this4 = this;return _regenerator2.default.wrap(function _callee18$(_context18) {while (1) {switch (_context18.prev = _context18.next) {case 0:_context18.next = 2;return (
                synchronizeSpecificBranch());case 2:return _context18.abrupt('return',
              stashDecorator((0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee17() {return _regenerator2.default.wrap(function _callee17$(_context17) {while (1) {switch (_context17.prev = _context17.next) {case 0:return _context17.abrupt('return',
                        iterateLocalBranches(function () {var _ref20 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee16(branch) {var branchToSync, ancestorSha1, branchSha1, logsBranch, developSha1, logsDev, isDevContainsAllLogsOfBranch;return _regenerator2.default.wrap(function _callee16$(_context16) {while (1) {switch (_context16.prev = _context16.next) {case 0:
                                    branch = wrapBranchNameSafe(branch);_context16.t0 =
                                    wrapBranchNameSafe;_context16.next = 4;return getLocalBranchToSync();case 4:_context16.t1 = _context16.sent;branchToSync = (0, _context16.t0)(_context16.t1);
                                    ancestorSha1 = (0, _common.query)('git merge-base ' + branchToSync + ' ' + branch).trim();
                                    branchSha1 = getSha1Of(branch);
                                    logsBranch = getLogOnelinerBetween(ancestorSha1, branchSha1);

                                    developSha1 = getSha1Of(branchToSync);
                                    logsDev = getLogOnelinerBetween(ancestorSha1, developSha1);

                                    isDevContainsAllLogsOfBranch = logsBranch.every(function (log) {return logsDev.indexOf(log) >= 0;});if (!
                                    isDevContainsAllLogsOfBranch) {_context16.next = 16;break;}
                                    console.log('Local branch [' + branch + '] seems to have been rebased to ' + branchToSync + '.');_context16.next = 16;return (
                                      exec('git branch -D ' + branch));case 16:case 'end':return _context16.stop();}}}, _callee16, _this4);}));return function (_x6) {return _ref20.apply(this, arguments);};}()));case 1:case 'end':return _context17.stop();}}}, _callee17, _this4);}))));case 3:case 'end':return _context18.stop();}}}, _callee18, this);}));return function removeRebasedBranches() {return _ref18.apply(this, arguments);};}();var openRepository = function () {var _ref21 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(





    function _callee19(numOrString) {var r, lines, url, comps, command;return _regenerator2.default.wrap(function _callee19$(_context19) {while (1) {switch (_context19.prev = _context19.next) {case 0:_context19.prev = 0;

              r = (0, _common.query)('git remote show origin');
              lines = r.split('\n');
              url = lines[1].split('URL:')[1].trim();
              comps = void 0;
              if (url.indexOf('https') === 0) {
                comps = url.split('github.com/')[1].split('.git')[0].split('/');
              } else {
                comps = url.split('github.com:')[1].split('.git')[0].split('/');
              }
              (0, _assert2.default)(comps.length === 2);
              command = 'open https://github.com/' + comps[0] + '/' + comps[1];if (!(

              numOrString.length === 0)) {_context19.next = 13;break;}_context19.next = 11;return (
                exec(command));case 11:_context19.next = 14;break;case 13:

              numOrString.forEach(function (c) {
                if (c === 'i') {
                  exec(command + '/issues');
                } else if (c === 'p') {
                  exec(command + '/projects');
                } else if (c === 'pr') {
                  exec(command + '/pulls');
                } else {
                  exec(command + '/issues/' + c);
                }
              });case 14:_context19.next = 19;break;case 16:_context19.prev = 16;_context19.t0 = _context19['catch'](0);


              console.error('Failed to find related page. (git remote show origin). FETCH URL, Github Only.');case 19:case 'end':return _context19.stop();}}}, _callee19, this, [[0, 16]]);}));return function openRepository(_x7) {return _ref21.apply(this, arguments);};}();var exec = function exec(command) {return (0, _common.exec)(command, { silent: true, doNotAsk: !config.askBeforeRunCommand });};function getOriginAccountName() {return (0, _common.query)('git remote get-url origin').split('://')[1].split('/')[1];}function hasSomethingToStash() {return (0, _common.query)('git diff --cached').trim() !== '';}function getSha1Of(name) {return (0, _common.query)('git rev-parse ' + wrapBranchNameSafe(name)).trim();}function getLogOnelinerBetween(s1, s2) {return (0, _common.query)('git log ' + s1 + '..' + s2 + ' --oneline').split('\n').map(function (s) {return s.trim();}).filter(function (s) {return s.length > 0;}).map(function (s) {return s.split(' ').slice(1).join(' ');});}



  return {
    pruneFromAllRemotes: pruneFromAllRemotes,
    removeRebasedBranches: removeRebasedBranches,
    createAndOpenPullRequest: createAndOpenPullRequest,
    mergeDevelopToMasterAndPush: mergeDevelopToMasterAndPush,
    synchronizeSpecificBranch: synchronizeSpecificBranch,
    openRepository: openRepository };

}