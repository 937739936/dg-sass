"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _storage = _interopRequireDefault(require("@sub/utils/storage"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var steelContract = {
  namespaced: true,
  state: {
    list: [],
    money: 0
  },
  mutations: {
    updatedList: function updatedList(state, list) {
      var num = 0;
      list.forEach(function (el) {
        num += Number(el.test4 || 0);
      });
      state.money = num;
    }
  },
  actions: {},
  getters: {}
};
var _default = steelContract;
exports["default"] = _default;