import { API_COMPANYACCOUNTLIST, API_COMPANYLINKMANFINDBYCOMPANYID } from "@/v2/api/account";
import { cloneDeep, merge } from "lodash";

/**
 *    :sellerCompanyUscc="VUEX_ST_ORDERCREATEINFO.data.contract.sellerCompanyUscc"
      :buyerCompanyUscc="VUEX_ST_COMPANYSUER.companyUscc"
*/

const CHANGE_MAP_OTHER = {
  transportResponsibility: "transportResponsibilityOther", // 运输负责方
  deliveryMode: "deliveryGoodsClause", // 交货方式
  freightPayMode: "freightPayModeOther", // 运费支付方式
};

const TRANS_TYPE_LIST = [
  'trainSendStationName', // 发站
  'trainArriveStationName', // 到站
  'shipLoadingPortName', // 装货港
  'shipDischargingPortName', // 卸货港
  'sendGoodsAddress', // 发货地
  'shipperName', // 发货人
  'consignorCompanyName', // 托运人
];

// 运输信息是form中value是Array的
const IS_ARRAY_VALUE = [
  'trainSendStationName', // 发站
  'trainArriveStationName', // 到站
  'shipLoadingPortName', // 装货港
  'shipDischargingPortName', // 卸货港
  'consignorCompanyName', // 托运人
  'consigneeCompanyName', // 收货人
];

// 以下合同模板在运输方式为船运 托运人 收货人 必填
const SHIPPER_AND_CONSIGNEENAME_REQUIRED = [
  'SEMI_COKE_005',
  'SMOKELESS_COAL_005',
  'INJECTION_COAL_005',
  'COKING_COAL_006',
  'COKING_010',
  'STEAM_COAL_015',
  'SEMI_COKE_004',
  'SMOKELESS_COAL_004',
  'INJECTION_COAL_004_001',
  'COKING_COAL_005_001',
  'COKING_009',
  'STEAM_COAL_014_001'
];

/**
 * 运输负责方选择其他 展示其他运输负责方输入框
 * 交货方式选择其他 展示其他交货方式输入框
 * @function changeMapConfig
 * @param {string} key form中的item绑定的值
 * @param {Array} cloneList form模块
 * @param {string} styleDisplay 显示or隐藏
 * @returns {void}
 */
const changeMapConfig = (key, cloneList, styleDisplay) => {
  if (Object.keys(CHANGE_MAP_OTHER).includes(key)) {
    const key2 = CHANGE_MAP_OTHER[key];
    for (let i = 0; i < cloneList.length; i++) {
      if (cloneList[i].label === key2) {
        cloneList[i].style.display = styleDisplay;
        break;
      }
    }
  }
};

const contract = {
  namespaced: true,
  state: {
    formSchema: {}, // form结构
    contractData: {}, // 合同信息
    productIndicator: [],  // 质量指标
    acceptUser: {}, // 买卖方信息
    transportMode: [], // 运输方式 跟合同模板有关
    thymeleafContent: '', // 合同html字符串
    formErrors: {}, // 验证未通过字段
    contractDataOther: {},
    selectProductIndicator: [],
    optionsList: [],
    thymeleafCommitmentContent: '',
    replaceElemList: {},
    formListSort: [],
    bankAndContacts: [],
    productIndicatorObjList: {},
    contractBoolean: {},
  },
  mutations: {
    VUEX_SET_CONTRACT_BOOLEAN(state, payload) {
      state.contractBoolean[payload] = true;
    },
    VUEX_SET_MAP_CONFIG(state) {
      const cloneMap = cloneDeep(state.formSchema);
      delete cloneMap.mapConfig.productIndicator;
      cloneMap.formList.productIndicator = [];
      state.formSchema = cloneMap;
    },
    VUEX_SET_BANK_CONTACTS(state, payload) {
      state.bankAndContacts = state.bankAndContacts.concat(payload);
    },
    VUEX_RESET_PRODUCTION_INDICATOR(state) {
      state.contractData.productIndicator = {};
      state.contractData.productIndicatorObj = {};
    },
    VUEX_UPDATE_CONTRACT_DATA(state, payload) {
      state.contractData = payload;
    },
    VUE_SET_FORM_LIST_SORT(state, payload) {
      state.formListSort = payload;
    },
    VUE_SET_HTML_REPLACE_ATTR(state, payload) {
      state.replaceElemList = payload;
    },
    VUE_SET_CLEAR_FORM_ERROR(state) {
      state.formErrors = {};
    },
    VUE_SET_THYMELEAF_COMMITMENT(state, payload) {
      state.thymeleafCommitmentContent = payload;
    },
    VUE_SET_OPTIONS_LIST_OTHER(state, payload) {
      state.optionsList = state.optionsList.concat(payload);
    },
    VUE_SET_OPTIONS_LIST(state, payload) {
      state.optionsList = payload;
    },
    VUEX_SET_UPDATE_INDICATOR(state, payload) {
      const cloneObj = cloneDeep(state.contractData);
      cloneObj.orderIndicators = payload;
      state.contractData = cloneObj;
    },
    VUEX_CLEAR_CONTRACT_DATA(state) {
      state.formSchema = {};
      state.contractData = {};
      state.productIndicator = [];
      state.acceptUser = {};
      state.transportMode = [];
      state.thymeleafContent = '';
      state.formErrors = {};
      state.contractDataOther = {};
      state.selectProductIndicator = [];
      state.optionsList = [];
      state.thymeleafCommitmentContent = '';
      state.replaceElemList = {};
      state.formListSort = [];
    },
    VUEX_SET_FORM_PRODUCTION_INDICATOR_SELECT(state, payload) {
      state.selectProductIndicator = payload;
    },
    VUEX_SET_FORM_ERRORS(state, payload) {
      state.formErrors = {
        ...state.formErrors,
        ...payload
      };
    },
    VUEX_SET_TRANSPORT_MODE(state, payload) {
      state.transportMode = payload;
      const cloneList = cloneDeep(state.formSchema.formList.transportation);
      for(let i = 0;i < cloneList.length;i ++) {
        if(cloneList[i].label === 'transportMode') {
          cloneList[i].options = payload;
          break;
        }
      }
      state.formSchema.formList.transportation = cloneList;
    },
    VUEX_SET_THYMELEAF_CONTENT(state, payload) {
      state.thymeleafContent = payload;
    },
    VUEX_SET_FORM_SCHEMA_INIT(state, payload) {
      state.formSchema = payload;
    },
    VUEX_SET_CONTRACT_OTHER_DATA(state, payload) {
      // state.contractDataOther = payload;
      state.contractData = payload;
    },
    VUEX_SET_STEP1_CONTRACT_DATA(state, payload) {
      const key = Object.keys(payload)[0];
      const cloneContractData = cloneDeep(state.contractData);
      cloneContractData[key] = {
        ...state.contractData[key],
        ...payload[key]
      };
      state.contractData = cloneContractData;
      const cloneProductIndicatorObjList = cloneDeep(state.contractData.orderIndicators);
      state.productIndicatorObjList = cloneProductIndicatorObjList;
    },
    VUEX_SET_ACCEPT_USER_DATA(state, payload) {
      state.acceptUser = merge(state.acceptUser, payload);
    },
    VUEX_SET_BUYYER_LSIT(state, payload) {
      const { type, field, data } = payload;
      const cloneList = cloneDeep(state.formSchema.formList[field]);
      for (let i = 0; i < cloneList?.length; i++) {
        if (cloneList[i].label === type) {
          cloneList[i].options = data;
          break;
        }
      }
      state.formSchema.formList[field] = cloneList;
    },
    VUEX_SET_PRODUCTION_INDICATOR(state, payload) {
      state.productIndicator = payload;
    },
    VUEX_SET_FORM_SCHEMA(state, payload) {
      const cloneObj = cloneDeep(state.formSchema);
      const cloneList = cloneObj.formList[payload.item.field];
      for (let i = 0; i < cloneList.length; i++) {
        if (cloneList[i].label === payload.item.label) {
          if(payload.item.field === 'bankInfo') {
            delete cloneList[i].options;
            cloneList[i].optionsBank = payload.data;
          } else {
            cloneList[i].options = payload.data;
          }
          break;
        }
      }
      state.formSchema = cloneObj;
    },
    VUEX_UPDATE_FORM_SCHEMA(state, payload) {
      const { values, field } = payload;
      const valuesKey = Object.keys(payload.values)[0];
      const styleDisplay = ["其他", "OTHER"].includes(values[valuesKey]) ? "block" : "none";
      const formList  = state.formSchema?.formList
      if(!formList){
        return;
      }
      const cloneList = cloneDeep(formList[field]);
      const cloneListCommitment = cloneDeep(formList['commitment']);
      if(!cloneList) return;
      changeMapConfig(valuesKey, cloneList, styleDisplay);
      if(field === 'transportation') {
        if(values.transportMode) {
          const transportModeItem = cloneList.filter(item => item.label === 'transportMode')[0];
          const deliveryModeOptions = transportModeItem.options.filter(item => item.value === values.transportMode)[0]?.deliveryMode;
          cloneList.forEach(item => {
            if(['freightPayMode'].includes(item.label)) {
              item.style.display = 'block';
            }
            if(['deliveryMode'].includes(item.label)) {
              item.options = deliveryModeOptions || [];
            }
          });
        }
        if(Object.keys(values)[0] === 'transportMode' && !values.transportMode) {
          cloneList.forEach(item => {
            if(['deliveryMode'].includes(item.label)) {
              item.options = [];
            }
          })
        }
        // 汽运
        if(values.transportMode === 'AUTOMOBILE') {
          cloneList.forEach(item => {
            if(TRANS_TYPE_LIST.includes(item.label)) {
              item.style.display = 'none';
            }
            if(['sendGoodsAddress'].includes(item.label)) {
              item.style.display = 'block';
            }
            if(['consigneeCompanyName', 'shipperName'].includes(item.label)) {
              item.style.display = 'block';
              item.required = true;
            }
            if(['transportResponsibility'].includes(item.label)) {
              item.style.display = 'block';
            }
            if(['shipperName'].includes(item.label)) {
              item.style.display = 'block';
            }
            // 采购--动力煤000通用,焦煤000通用,焦炭000通用，兰炭000通用 展示产地
            if(['COKING_COAL_000','STEAM_COAL_012','COKING_000','SEMI_COKE_000', 'SMOKELESS_COAL_000', 'INJECTION_COAL_000'].includes(state.contractData?.contract?.contractTemplateName)) {
              if(['originPlace'].includes(item.label)) {
                item.style.display = 'block';
              }
            }
            if(['STEAM_COAL_014'].includes(state.contractData?.contract?.contractTemplateName)) {
              if(['consignorCompanyName'].includes(item.label)) {
                item.style.display = 'none';
              }
            }
          })
          cloneListCommitment.forEach(item => {
            if(['shipTransportCompanyName', 'shipTransportProtocolNo'].includes(item.label)) {
              item.style.display = 'none';
            }
          });
        }
        // 船运
        if(values.transportMode === 'SHIP') {
          cloneList.forEach(item => {
            if(TRANS_TYPE_LIST.includes(item.label)) {
              item.style.display = 'none';
            }
            if(['shipLoadingPortName', 'shipDischargingPortName'].includes(item.label)) {
              item.style.display = 'block';
            }
            if(['shipperName', 'consigneeCompanyName'].includes(item.label)) {
              item.style.display = 'block';
              if(SHIPPER_AND_CONSIGNEENAME_REQUIRED.includes(state.contractData?.contract?.contractTemplateName)) {
                item.required = true;
              } else {
                item.required = false;
              }
            }
            if(['transportResponsibility'].includes(item.label)) {
              item.style.display = 'block';
            }
            if(['shipperName'].includes(item.label)) {
              item.style.display = 'block';
            }
            // 采购--动力煤000通用,焦煤000通用,焦炭000通用，兰炭000通用 展示产地
            if(['COKING_COAL_000','STEAM_COAL_012','COKING_000','SEMI_COKE_000', 'SMOKELESS_COAL_000', 'INJECTION_COAL_000'].includes(state.contractData?.contract?.contractTemplateName)) {
              if(['originPlace'].includes(item.label)) {
                item.style.display = 'block';
              }
            }
            if(['STEAM_COAL_014'].includes(state.contractData?.contract?.contractTemplateName)) {
              if(['consignorCompanyName'].includes(item.label)) {
                item.style.display = 'none';
              }
            }
          });
          if(state.thymeleafCommitmentContent) {
            cloneListCommitment.forEach(item => {
              if(['shipTransportCompanyName', 'shipTransportProtocolNo'].includes(item.label)) {
                item.style.display = 'block';
              }
            })
          }
        }
        // 火运
        if(values.transportMode === 'TRAIN') {
          cloneList.forEach(item => {
            if(TRANS_TYPE_LIST.includes(item.label)) {
              item.style.display = 'none';
            }
            if(['trainSendStationName', 'trainArriveStationName'].includes(item.label)) {
              item.style.display = 'block';
            }
            if(['consignorCompanyName', 'consigneeCompanyName'].includes(item.label)) {
              item.style.display = 'block';
              item.required = true;
            }
            if(['transportResponsibility'].includes(item.label)) {
              item.style.display = 'block';
            }
            if(['shipperName'].includes(item.label)) {
              item.style.display = 'none';
            }
            // 采购--动力煤000通用,焦煤000通用,焦炭000通用，兰炭000通用 展示产地
            if(['COKING_COAL_000','STEAM_COAL_012','COKING_000','SEMI_COKE_000', 'SMOKELESS_COAL_000', 'INJECTION_COAL_000'].includes(state.contractData?.contract?.contractTemplateName)) {
              if(['originPlace'].includes(item.label)) {
                item.style.display = 'block';
              }
            }
            if(['STEAM_COAL_014'].includes(state.contractData?.contract?.contractTemplateName)) {
              if(['consignorCompanyName'].includes(item.label)) {
                item.style.display = 'block';
              }
            }
          });
          cloneListCommitment.forEach(item => {
            if(['shipTransportCompanyName', 'shipTransportProtocolNo'].includes(item.label)) {
              item.style.display = 'none';
            }
          });
        }
        // 汽运和火运
        if(values.transportMode === 'AUTOMOBILE_AND_TRAIN') {
          cloneList.forEach(item => {
            if(TRANS_TYPE_LIST.includes(item.label)) {
              item.style.display = 'none';
            }
            if(['sendGoodsAddress'].includes(item.label)) {
              item.style.display = 'block';
            }
            if(['trainSendStationName', 'trainArriveStationName'].includes(item.label)) {
              item.style.display = 'block';
            }
            if(['consignorCompanyName', 'consigneeCompanyName', 'shipperName'].includes(item.label)) {
              item.style.display = 'block';
              item.required = true;
            }
            if(['transportResponsibility'].includes(item.label)) {
              item.style.display = 'block';
            }
            if(['shipperName'].includes(item.label)) {
              item.style.display = 'block';
            }
            // 采购--动力煤000通用,焦煤000通用,焦炭000通用，兰炭000通用 展示产地
            if(['COKING_COAL_000','STEAM_COAL_012','COKING_000','SEMI_COKE_000', 'SMOKELESS_COAL_000', 'INJECTION_COAL_000'].includes(state.contractData?.contract?.contractTemplateName)) {
              if(['originPlace'].includes(item.label)) {
                item.style.display = 'block';
              }
            }
            if(['STEAM_COAL_014'].includes(state.contractData?.contract?.contractTemplateName)) {
              if(['sendGoodsAddress', 'consignorCompanyName'].includes(item.label)) {
                item.style.display = 'block';
              }
            }
          });
          cloneListCommitment.forEach(item => {
            if(['shipTransportCompanyName', 'shipTransportProtocolNo'].includes(item.label)) {
              item.style.display = 'none';
            }
          });
        }
        // 无运输方式
        if(values.transportMode === 'NONE') {
          cloneList.forEach(item => {
            if(['freightPayMode', 'freightPayModeOther', 'trainSendStationName', 'trainArriveStationName', 'shipLoadingPortName', 'shipDischargingPortName', 'sendGoodsAddress', 'consignorCompanyName', 'consigneeCompanyName', 'shipperName'].includes(item.label)) {
              item.style.display = 'none';
            }
            if(['transportResponsibility'].includes(item.label)) {
              item.style.display = 'none';
            }
            // 采购--动力煤000通用,焦煤000通用,焦炭000通用，兰炭000通用 不展示产地
            if(['COKING_COAL_000','STEAM_COAL_012','COKING_000','SEMI_COKE_000', 'SMOKELESS_COAL_000', 'INJECTION_COAL_000'].includes(state.contractData?.contract?.contractTemplateName)) {
              if(['originPlace'].includes(item.label)) {
                item.style.display = 'none';
              }
            }
            if(['SMOKELESS_COAL_000', 'INJECTION_COAL_000'].includes(state.contractData?.contract?.contractTemplateName)) {
              if(['consigneeCompanyName', 'shipperName'].includes(item.label)) {
                item.style.display = 'none';
              }
            }
          });
          cloneListCommitment.forEach(item => {
            if(['shipTransportCompanyName', 'shipTransportProtocolNo'].includes(item.label)) {
              item.style.display = 'none';
            }
          });
        }
        state.formSchema.formList[field] = cloneList;
        state.formSchema.formList['commitment'] = cloneListCommitment;
      }
    },
    VUEX_SET_CONTRACT_DATA(state, payload) {
      const { values, field } = payload;
      const cloneContractData = cloneDeep(state.contractData);
      if(['commitment'].includes(field) || field.indexOf('Html') >= 0) {
        cloneContractData['contractExtension'] = {
          ...cloneContractData['contractExtension'],
          ...values,
        };
        if(['downstreamSignCompanyName', 'upstreamSignCompanyName'].includes(Object.keys(values)[0])) {
          cloneContractData['contract'] = {
            ...cloneContractData['contract'],
            ...values,
          };
        }
      } else if(field === 'transportation') {
        cloneContractData['contractDelivery'] = {
          ...cloneContractData['contractDelivery'],
          ...values,
        };
      } else {
        cloneContractData['contract'] = {
          ...cloneContractData['contract'],
          ...values,
        };
      }
      state.contractData = cloneContractData;
    },
  },
  actions: {
    VUEX_GTE_API_COMPANY_PEOPLE({ commit }, payload) {
      API_COMPANYLINKMANFINDBYCOMPANYID({ companyId: payload.id }).then(res => {
        if(res.success) {
          res.data.map(item => {
            item.label = `${item.contactName}`;
            item.value = item.contactPhone;
          })
          commit('VUEX_SET_BUYYER_LSIT', {data: res.data, type: payload.type, field: 'contacts'});
        }
      })
    },
    VUEX_GTE_API_COMPANYACCOUNTLIST({ commit }, payload) {
      API_COMPANYACCOUNTLIST({ uscc: payload.uscc }).then(res => {
        if(res.success) {
          res.data.map(item => {
            item.label = `${item.bankName}(${item.accountTypeText})`;
            item.value = item.subbranchNo;
          });
          commit('VUEX_SET_BUYYER_LSIT', {data: res.data, type: payload.type, field: 'acceptUser'});
        }
      })
    }
  },
  getters: {
    VUEX_GET_CONTRACT_ORDER_INDICTORS(state) {
      return state.contractData.orderIndicators;
    },
    VUEX_GET_CONTRACT_BOOLEAN(state) {
      return state.contractBoolean;
    },
    VUEX_GET_BANK_CONTACTS(state) {
      return state.bankAndContacts;
    },
    VUE_SET_FORM_LIST_SORT(state) {
      const commitmentIndex = state.formListSort.indexOf('commitment');
      // 承诺函放在最后
      if(commitmentIndex >= 0) {
        state.formListSort.splice(commitmentIndex, 1);
        return state.formListSort.concat(['commitment']);
      }
      return state.formListSort;
    },
    VUE_GET_THYMELEAF_COMMITMENT(state) {
      return state.thymeleafCommitmentContent;
    },
    VUEX_GET_FORM_ERRORS(state) {
      return state.formErrors;
    },
    VUEX_GET_TRANSPORT_MODE(state) {
      return state.transportMode;
    },
    VUEX_GET_THYMELEAF_CONTENT(state) {
      return state.thymeleafContent;
    },
    VUEX_GET_PRODUCTION_INDICATOR(state) {
      return state.productIndicator;
    },
    VUEX_GET_PRODUCTION_INDICATOR_SELECT(state) {
      return state.selectProductIndicator;
    },
    VUEX_GET_FORM_SCHEMA(state) {
      return state.formSchema;
    },
    VUEX_GET_CONTRACT_DATA(state) {
      return state.contractData;
    },
    VUEX_GET_ACCEPT_USER(state) {
      return state.acceptUser;
    },
    VUEX_GET_CONTRACT_OTHER_DATA(state) {
      return state.contractDataOther;
    },
    VUEX_GET_OPTIONS_LIST(state) {
      return state.optionsList;
    },
    VUE_GET_HTML_REPLACE_ATTR(state) {
      return state.replaceElemList;
    },
    VUE_GET_PRODUCT_INDICATOR(state) {
      return state.productIndicatorObjList;
    }
  },
};

export default contract;
