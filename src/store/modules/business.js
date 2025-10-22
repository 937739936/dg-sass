// 当前日期
let myDate = new Date();
myDate.setDate(myDate.getDate());
myDate = myDate.toLocaleDateString()

const business = {
  namespaced: true,
  state: {
    VUEX_RELATION_CONTRACT: {},
    VUEX_MANUAL_ASSET_OBJ: {
      transportMode: "",
      contractSignTime: "",
      buyerName: "",
      disabledCopy: false,
    },
    VUEX_POOL_ASSET_OBJ:{},
    VUEX_ST_APPLYBOOK: {}, // 证书申请资料存储
    // 回款认领企业 卓鼎(91410100MA45CKY3XX) 中平(914101000689293263) 江苏刚瑞(91321200MA1WQF4X6M)
    collectionCompany: ["914101000689293263", "91410100MA45CKY3XX", "91321200MA1WQF4X6M"],
    zpCompany: ["914101000689293263"],
    // 对接SAP的企业 卓鼎(91410100MA45CKY3XX)
    sapCompany: [],
    // 硫分预填写值
    sdValue: 1,
    VUEX_browserFalg: false,
    VUEX_closeBrowserTime: myDate
  },
  mutations: {
    VUEX_setRelationContract(state, data) {
      state.VUEX_RELATION_CONTRACT = data;
    },
    VUEX_SET_MANUAL_ASSET_OBJ(state, data) {
      state.VUEX_MANUAL_ASSET_OBJ = {
        ...state.VUEX_MANUAL_ASSET_OBJ,
        ...data,
      };
    },
    VUEX_SET_POOL_ASSET_OBJ(state, data) {
        state.VUEX_POOL_ASSET_OBJ = {
          ...state.VUEX_POOL_ASSET_OBJ,
          ...data,
        };
    },
    VUEX_MU_APPLYBOOK(state, data) {
      state.VUEX_ST_APPLYBOOK = data;
    },
    // 设置硫分预填写值
    VUEX_setSDVALUE(state, v) {
      state.sdValue = v;
    },
    // 浏览器提示是否展示
    VUEX_setBrowserFalg(state, v) {
      state.VUEX_browserFalg = v;
    },
    // 关闭浏览器提示的时间
    VUEX_setCloseBrowserTime(state, v) {
      state.VUEX_closeBrowserTime = v;
    },
  },
  actions: {},
  getters: {
    VUEX_RELATION_CONTRACT(state) {
      return state.VUEX_RELATION_CONTRACT;
    },
    VUEX_MANUAL_ASSET_OBJ(state) {
      return state.VUEX_MANUAL_ASSET_OBJ;
    },
    VUEX_POOL_ASSET_OBJ(state) {
      return state.VUEX_POOL_ASSET_OBJ;
    },
    VUEX_ST_APPLYBOOK(state) {
      return state.VUEX_ST_APPLYBOOK;
    },
    collectionCompany(state) {
      return state.collectionCompany;
    },
    zpCompany(state) {
      return state.zpCompany;
    },
    sdValue(state) {
      return state.sdValue;
    },
    sapCompany(state) {
      return state.sapCompany;
    },
    // 下载谷歌浏览器的提示是否展示
    VUEX_browserFalg(state) {
      return state.VUEX_browserFalg;
    },
    // 关闭浏览器提示的时间
    VUEX_closeBrowserTime(state) {
      return state.VUEX_closeBrowserTime;
    }
  },
};

export default business;
