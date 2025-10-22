"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _storage = _interopRequireDefault(require("@sub/utils/storage"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var order = {
  namespaced: true,
  state: {
    VUEX_ST_ORDERCREATEINFO: {
      flag: "add",
      data: null
    },
    VUEX_ST_ORDERCREATESTEP2INFO: {
      flag: "add",
      data: null
    }
  },
  mutations: {
    VUEX_MU_ORDERCREATEINFO: function VUEX_MU_ORDERCREATEINFO(state, data) {
      state.VUEX_ST_ORDERCREATEINFO = data;
    },
    VUEX_MU_ORDERCREATESTEP2INFO: function VUEX_MU_ORDERCREATESTEP2INFO(state, data) {
      state.VUEX_ST_ORDERCREATESTEP2INFO = data;
    },
    VUEX_MU_ORDERCREATESTEP2INFO_CLEAR: function VUEX_MU_ORDERCREATESTEP2INFO_CLEAR(state) {
      state.VUEX_ST_ORDERCREATESTEP2INFO = {
        flag: "add",
        data: null
      };
    }
  },
  actions: {},
  getters: {
    VUEX_ST_ORDERCREATEINFO: function VUEX_ST_ORDERCREATEINFO(state) {
      return state.VUEX_ST_ORDERCREATEINFO;
    },
    VUEX_ST_ORDERCREATESTEP2INFO: function VUEX_ST_ORDERCREATESTEP2INFO(state) {
      return state.VUEX_ST_ORDERCREATESTEP2INFO;
    }
  }
};
var _default = order;
exports["default"] = _default;