"use strict";

var _vue = _interopRequireDefault(require("vue"));

var _App = _interopRequireDefault(require("./App.vue"));

require("ant-design-vue/dist/antd.css");

require("moment/dist/locale/zh-cn");

var _zh_CN = _interopRequireDefault(require("ant-design-vue/lib/locale-provider/zh_CN"));

var _antDesignVue = _interopRequireDefault(require("ant-design-vue"));

var _debounceclick = _interopRequireDefault(require("./directive/debounceclick"));

var _vViewer = _interopRequireDefault(require("v-viewer"));

var _wrapForm = _interopRequireDefault(require("@sub/utils/wrapForm.js"));

var _moment = _interopRequireDefault(require("moment"));

require("./style/detail.less");

require("./style/table.less");

require("./style/style.less");

var _this = void 0;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_moment["default"].locale('zh-cn');

_vue["default"].use(_antDesignVue["default"]);

_vue["default"].use(_debounceclick["default"]);

_vue["default"].use(_vViewer["default"]); // 修改setField方法，避免告警


var oldcreateForm = _vue["default"].prototype.$form.createForm;

_vue["default"].prototype.$form.createForm = function () {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var obj = oldcreateForm.apply(_this, args);
  return (0, _wrapForm["default"])(obj);
};

_vue["default"].config.productionTip = false;
new _vue["default"]({
  data: function data() {
    return {
      locale: _zh_CN["default"]
    };
  },
  render: function render(h) {
    return h(_App["default"]);
  }
}).$mount('#app');