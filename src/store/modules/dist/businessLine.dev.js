"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
// 新版业务线 选择合同信息
var businessLine = {
  namespaced: true,
  state: {
    // 选择的采购合同信息
    buySelectList: [],
    sellSelectList: [],
    buyContractInfo: {},
    // 选择的销售合同信息
    sellContractInfo: {}
  },
  mutations: {
    updateBuyContract: function updateBuyContract(state, payload) {
      state.buyContractInfo = payload;
    },
    updateSellContract: function updateSellContract(state, payload) {
      state.sellSelectList = payload;
    }
  },
  actions: {}
};
var _default = businessLine;
exports["default"] = _default;