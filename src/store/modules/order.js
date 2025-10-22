import storage from "@sub/utils/storage";

const order = {
  namespaced: true,
  state: {
    VUEX_ST_ORDERCREATEINFO: {
      flag: "add",
      data: null,
    },
    VUEX_ST_ORDERCREATESTEP2INFO: {
      flag: "add",
      data: null,
    }
  },
  mutations: {
    VUEX_MU_ORDERCREATEINFO(state, data) {
      state.VUEX_ST_ORDERCREATEINFO = data;
    },
    VUEX_MU_ORDERCREATESTEP2INFO(state, data) {
      state.VUEX_ST_ORDERCREATESTEP2INFO = data;
    },
    VUEX_MU_ORDERCREATESTEP2INFO_CLEAR(state) {
      state.VUEX_ST_ORDERCREATESTEP2INFO = {
        flag: "add",
        data: null,
      };
    }
  },
  actions: {},
  getters: {
    VUEX_ST_ORDERCREATEINFO(state) {
      return state.VUEX_ST_ORDERCREATEINFO;
    },
    VUEX_ST_ORDERCREATESTEP2INFO(state) {
      return state.VUEX_ST_ORDERCREATESTEP2INFO;
    },
  },
};

export default order;
