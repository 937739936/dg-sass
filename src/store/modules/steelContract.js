import storage from "@sub/utils/storage";

const steelContract = {
  namespaced: true,
  state: {
    list: [],
    money: 0,
  },
  mutations: {
    updatedList(state, list) {
      let num = 0
      list.forEach(el => {
        num +=  Number(el.test4 || 0)
      });
      state.money = num
    },
  },
  actions: {},
  getters: {
  },
};

export default steelContract;
