
// 新版业务线 选择合同信息

const businessLine = {
  namespaced: true,
  state: {
    // 选择的采购合同信息
    buySelectList: [],
    sellSelectList: [],
    buyContractInfo: {},
    // 选择的销售合同信息
    sellContractInfo: {},
  },
  mutations: {

   updateBuyContract(state, payload) {
    state.buyContractInfo = payload
   },

   updateSellContract(state, payload) {

    state.sellSelectList = payload

   }

  },
  actions: {},

};

export default businessLine;
