

const scroll = {
  namespaced: true,
  state: {
    isTop: false,
    isShowTopBtn: false,
    // 滚动的距离
    scrollDistance:0 ,
  },
  mutations: {
    setTop(state, flag) {
      state.isTop = flag
    },
    setTopBtn(state, flag) {
      state.isShowTopBtn = flag
    },
    setDistance(state, num) {
      state.scrollDistance = num
    }

  },
  actions: {},
  getters: {
    isTop(state) {
      return state.isTop;
    },
  },
};

export default scroll;
