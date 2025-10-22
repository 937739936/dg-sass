// 当前日期



// 融资

const financing = {
  namespaced: true,
  state: {
    // 融资申请选择的资产
    receivableInfo: {},
    // 预付融资选择的资产
    advanceInfo: {}
  },
  mutations: {
    updateReceivable(state, info) {
      state.receivableInfo = info
    },
    updateAdvance(state, info) {
      state.advanceInfo = info
    },


  },
  actions: {},
};

export default financing;
