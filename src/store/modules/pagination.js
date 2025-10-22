const pagination = {
  namespaced: true,
  state: {
    //页数
    pageSize: 10,
    hsbUseType: null,
    //分页参数
    listParmas: {
      type: "",
      total: 0,
      pageNo: 1,
    },
    params: {},
  },
  mutations: {
    // 初始化列表分页参数
    VUEX_initListParmas(state) {
      state.listParmas = {
        type: "",
        total: 0,
        pageNo: 1,
      };
    },
    // 初始化列表分页参数
    VUEX_initSotre(state) {
      state.listParmas = {
        type: "",
        total: 0,
        pageNo: 1,
      };
      state.pageSize = 10;
    },
    // 修改分页码数
    VUEX_setPageSize(state, pageSize) {
      state.pageSize = pageSize;
    },
    //存储当前分页页数
    VUEX_setListPamars(state, listParmas) {
      const { pagination, params } = listParmas;
      if (pagination) {
        state.listParmas = pagination;
        if (!state.listParmas.type) {
          state.listParmas.type = listParmas.type
        }
        state.params = params;
        return;
      }
      state.listParmas = listParmas;
    },
    VUEX_hsbUseType(state, payload) {
      state.hsbUseType = payload;
    }
  },
  actions: {},
  getters: {
    pageSize(state) {
      return state.pageSize;
    },
    hsbUseType(state) {
      return state.hsbUseType;
    },
    listParmas(state) {
      return state.listParmas;
    },
    vuexParams(state) {
      return state.params;
    },
  },
};

export default pagination;
