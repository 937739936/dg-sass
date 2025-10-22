"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _vue = _interopRequireDefault(require("vue"));

var _vuex = _interopRequireDefault(require("vuex"));

var _vuexPersistedstate = _interopRequireDefault(require("vuex-persistedstate"));

var _storage = _interopRequireDefault(require("@sub/utils/storage"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_vue["default"].use(_vuex["default"]);

var modulesFiles = require.context("./modules", true, /\.js$/);

var modules = modulesFiles.keys().reduce(function (modules, modulePath) {
  var moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, "$1");
  var value = modulesFiles(modulePath);
  modules[moduleName] = value["default"];
  return modules;
}, {});
var store = new _vuex["default"].Store({
  modules: modules,
  plugins: [(0, _vuexPersistedstate["default"])({
    storage: window.sessionStorage
  })]
}); // window.addEventListener('storage', () => {
//   try{
//     let vuex_companyId = store.getters['user/VUEX_ST_COMPANYSUER']?.companyId;
//     let vuex_mobile = store.getters['user/VUEX_ST_PERSONALLINFO']?.mobile;
//     let user = JSON.parse(storage.local.get("vuex"))?.user;
//     let local_companyId = user?.VUEX_ST_COMPANYSUER?.companyId;
//     let local_mobile = user?.VUEX_ST_PERSONALLINFO?.mobile;
//     if(local_companyId != vuex_companyId || vuex_mobile != local_mobile){
//       // store.dispatch('user/VUEX_USER_PERSONAL_DETAILS');
//       location.reload();
//     }
//   }catch(e){}
// });

var _default = store;
exports["default"] = _default;