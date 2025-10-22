"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var logisticsPlatform = {
  namespaced: true,
  state: {
    // 新增电子仓单管理协议
    agreeManageInfo: {
      signArea: '',
      serialNo: '',
      effectiveStartDate: '',
      storageCompanyAddress: '',
      stationLeaseContractNo: '',
      templateType: 'WAREHOUSE_RECEIPT_MANAGE_AGREEMENT_001'
    },
    // 当前站台的信息
    storageCompanyInfo: {}
  },
  mutations: {
    initAgreeManageInfo: function initAgreeManageInfo(state, info) {
      if (!info) {
        state.agreeManageInfo = {
          signArea: '',
          serialNo: '',
          effectiveStartDate: '',
          storageCompanyAddress: '',
          stationLeaseContractNo: '',
          templateType: 'WAREHOUSE_RECEIPT_MANAGE_AGREEMENT_001'
        };
        return;
      }

      for (var key in state.agreeManageInfo) {
        if (info[key]) {
          state.agreeManageInfo[key] = info[key] || '';
        }
      }
    },
    // 更新签署地点
    updateAgreeManageInfoArea: function updateAgreeManageInfoArea(state, payload) {
      state.agreeManageInfo.signArea = payload;
    },
    // 更新签订日期
    updateAgreeManageInfoSignDate: function updateAgreeManageInfoSignDate(state, payload) {
      state.agreeManageInfo.effectiveStartDate = payload;
    },
    updateStorageCompanyInfo: function updateStorageCompanyInfo(state, payload) {
      state.storageCompanyInfo = payload;
    },
    updateStorageCompanyAddress: function updateStorageCompanyAddress(state, payload) {
      state.agreeManageInfo.storageCompanyAddress = payload;
    },
    updateStationLeaseContractNo: function updateStationLeaseContractNo(state, payload) {
      state.agreeManageInfo.stationLeaseContractNo = payload;
    },
    updateTemplateType: function updateTemplateType(state, payload) {
      state.agreeManageInfo.templateType = payload;
    }
  },
  actions: {}
};
var _default = logisticsPlatform;
exports["default"] = _default;