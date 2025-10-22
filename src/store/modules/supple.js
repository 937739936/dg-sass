

import { cloneDeep } from "lodash";
import moment from "moment";


const CHANGE_MAP_OTHER = {
  transportResponsibility: "transportResponsibilityOther", // 运输负责方
  deliveryMode: "deliveryGoodsClause", // 交货方式
  freightPayMode: "freightPayModeOther", // 运费支付方式
};

const getLabel = (val, list=[]) =>{
  const item  = list.find(el => el.value == val) || {}
  return item.label || ''
}
const getBankInfo = (val, list) => {
  
  const item  = list.find(el => el.id == val)
  if(!item) {
    return ``
  }
  return `${item.bankName}/${item.accountTypeText}     ${item.accountNo}`
 
}

const TRANS_TYPE_LIST = [
  'trainSendStationName', // 发站
  'trainArriveStationName', // 到站
  'shipLoadingPortName', // 装货港
  'shipDischargingPortName', // 卸货港
  'sendGoodsAddress', // 发货地
  'shipperName', // 发货人
  'consignorCompanyName', // 托运人
];
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
// 补充协议
const supple = {
  namespaced: true,
  state: {
    contractData: {},
    formList: {},
    signDate: '',
    changeData: [],
    signContent: [],
    // 变更的内容
    // 旧的运输方式
    oldDeliveryModeItem: [],
    /** 全部配置项 */
    tplInfo: {},
    // 部分配置
    changeTplInfo: {},
    // 银行列表
    bankList: [],
    initTransportation: []


  },
  mutations: {
    updateContract(state, payload) {
      state.contractData = payload
    },
    updateContractTermType(state, payload) {
      state.contractTermType = payload
    },

    updateFormList(state, payload) {
      state.formList = payload
    },
    updateFormListTrans(state, payload) {
      state.formList['transportation'] = payload
    },
    // 更新运输信息
    updateTrans(state, payload) {
      const { values, field } = payload;

      const valuesKey = Object.keys(payload.values)[0];
      
      const cloneList = cloneDeep(state.formList[field]);

      const styleDisplay = ["其他", "OTHER"].includes(values[valuesKey]) ? "block" : "none";


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
            // if(['deliveryMode'].includes(item.label)) {
            //   item.options = deliveryModeOptions || [];
            // }
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
            if(['COKING_COAL_000','STEAM_COAL_012','COKING_000','SEMI_COKE_000'].includes(state.contractData?.contractTemplateName)) {
              if(['originPlace'].includes(item.label)) {
                item.style.display = 'block';
              }
            }
            if(['STEAM_COAL_014'].includes(state.contractData?.contractTemplateName)) {
              if(['consignorCompanyName'].includes(item.label)) {
                item.style.display = 'none';
              }
            }
          })
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
              item.required = false;
            }
            if(['transportResponsibility'].includes(item.label)) {
              item.style.display = 'block';
            }
            if(['shipperName'].includes(item.label)) {
              item.style.display = 'block';
            }
            // 采购--动力煤000通用,焦煤000通用,焦炭000通用，兰炭000通用 展示产地
            if(['COKING_COAL_000','STEAM_COAL_012','COKING_000','SEMI_COKE_000'].includes(state.contractData?.contractTemplateName)) {
              if(['originPlace'].includes(item.label)) {
                item.style.display = 'block';
              }
            }
            if(['STEAM_COAL_014'].includes(state.contractData?.contractTemplateName)) {
              if(['consignorCompanyName'].includes(item.label)) {
                item.style.display = 'none';
              }
            }
          });

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
            if(['COKING_COAL_000','STEAM_COAL_012','COKING_000','SEMI_COKE_000'].includes(state.contractData?.contractTemplateName)) {
              if(['originPlace'].includes(item.label)) {
                item.style.display = 'block';
              }
            }
            if(['STEAM_COAL_014'].includes(state.contractData?.contractTemplateName)) {
              if(['consignorCompanyName'].includes(item.label)) {
                item.style.display = 'block';
              }
            }
          });
          // cloneListCommitment.forEach(item => {
          //   if(['shipTransportCompanyName', 'shipTransportProtocolNo'].includes(item.label)) {
          //     item.style.display = 'none';
          //   }
          // });
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
            if(['COKING_COAL_000','STEAM_COAL_012','COKING_000','SEMI_COKE_000'].includes(state.contractData?.contractTemplateName)) {
              if(['originPlace'].includes(item.label)) {
                item.style.display = 'block';
              }
            }
            if(['STEAM_COAL_014'].includes(state.contractData?.contractTemplateName)) {
              if(['sendGoodsAddress', 'consignorCompanyName'].includes(item.label)) {
                item.style.display = 'block';
              }
            }
          });
          // cloneListCommitment.forEach(item => {
          //   if(['shipTransportCompanyName', 'shipTransportProtocolNo'].includes(item.label)) {
          //     item.style.display = 'none';
          //   }
          // });
        }
        // 无运输方式
        if(values.transportMode === 'NONE') {
          cloneList.forEach(item => {
            if(['freightPayMode', 'freightPayModeOther', 'trainSendStationName', 'trainArriveStationName', 'shipLoadingPortName', 'shipDischargingPortName', 'sendGoodsAddress', 'consignorCompanyName', 'consigneeCompanyName'].includes(item.label)) {
              item.style.display = 'none';
            }
            if(['transportResponsibility'].includes(item.label)) {
              item.style.display = 'none';
            }
            // 采购--动力煤000通用,焦煤000通用,焦炭000通用，兰炭000通用 不展示产地
            if(['COKING_COAL_000','STEAM_COAL_012','COKING_000','SEMI_COKE_000', 'SMOKELESS_COAL_000', 'INJECTION_COAL_000'].includes(state.contractData?.contractTemplateName)) {
              if(['originPlace'].includes(item.label)) {
                item.style.display = 'none';
              }
            }
            if(['SMOKELESS_COAL_000', 'INJECTION_COAL_000'].includes(state.contractData?.contractTemplateName)) {
              if(['consigneeCompanyName', 'shipperName'].includes(item.label)) {
                item.style.display = 'none';
              }
            }
          });
        }
        state.formList[field] = cloneList;
      }
    },
    // 进入页面显示的运输信息
    initUpdateTrans(state, payload) {
      const { value, list } = payload;

      
      const cloneList = cloneDeep(list);


      if(!cloneList) return;
        // 汽运
        if(value === 'AUTOMOBILE') {
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
            if(['COKING_COAL_000','STEAM_COAL_012','COKING_000','SEMI_COKE_000'].includes(state.contractData?.contractTemplateName)) {
              if(['originPlace'].includes(item.label)) {
                item.style.display = 'block';
              }
            }
            if(['STEAM_COAL_014'].includes(state.contractData?.contractTemplateName)) {
              if(['consignorCompanyName'].includes(item.label)) {
                item.style.display = 'none';
              }
            }
          })
        }
        // 船运
        if(value === 'SHIP') {
          cloneList.forEach(item => {
            if(TRANS_TYPE_LIST.includes(item.label)) {
              item.style.display = 'none';
            }
            if(['shipLoadingPortName', 'shipDischargingPortName'].includes(item.label)) {
              item.style.display = 'block';
            }
            if(['shipperName', 'consigneeCompanyName'].includes(item.label)) {
              item.style.display = 'block';
              item.required = false;
            }
            if(['transportResponsibility'].includes(item.label)) {
              item.style.display = 'block';
            }
            if(['shipperName'].includes(item.label)) {
              item.style.display = 'block';
            }
            // 采购--动力煤000通用,焦煤000通用,焦炭000通用，兰炭000通用 展示产地
            if(['COKING_COAL_000','STEAM_COAL_012','COKING_000','SEMI_COKE_000'].includes(state.contractData?.contractTemplateName)) {
              if(['originPlace'].includes(item.label)) {
                item.style.display = 'block';
              }
            }
            if(['STEAM_COAL_014'].includes(state.contractData?.contractTemplateName)) {
              if(['consignorCompanyName'].includes(item.label)) {
                item.style.display = 'none';
              }
            }
          });

        }
        // 火运
        if(value === 'TRAIN') {
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
            if(['COKING_COAL_000','STEAM_COAL_012','COKING_000','SEMI_COKE_000'].includes(state.contractData?.contractTemplateName)) {
              if(['originPlace'].includes(item.label)) {
                item.style.display = 'block';
              }
            }
            if(['STEAM_COAL_014'].includes(state.contractData?.contractTemplateName)) {
              if(['consignorCompanyName'].includes(item.label)) {
                item.style.display = 'block';
              }
            }
          });
          // cloneListCommitment.forEach(item => {
          //   if(['shipTransportCompanyName', 'shipTransportProtocolNo'].includes(item.label)) {
          //     item.style.display = 'none';
          //   }
          // });
        }
        // 汽运和火运
        if(value === 'AUTOMOBILE_AND_TRAIN') {
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
            if(['COKING_COAL_000','STEAM_COAL_012','COKING_000','SEMI_COKE_000'].includes(state.contractData?.contractTemplateName)) {
              if(['originPlace'].includes(item.label)) {
                item.style.display = 'block';
              }
            }
            if(['STEAM_COAL_014'].includes(state.contractData?.contractTemplateName)) {
              if(['sendGoodsAddress', 'consignorCompanyName'].includes(item.label)) {
                item.style.display = 'block';
              }
            }
          });
          // cloneListCommitment.forEach(item => {
          //   if(['shipTransportCompanyName', 'shipTransportProtocolNo'].includes(item.label)) {
          //     item.style.display = 'none';
          //   }
          // });
        }
        // 无运输方式
        if(value === 'NONE') {
          cloneList.forEach(item => {
            if(['freightPayMode', 'freightPayModeOther', 'trainSendStationName', 'trainArriveStationName', 'shipLoadingPortName', 'shipDischargingPortName', 'sendGoodsAddress', 'consignorCompanyName', 'consigneeCompanyName'].includes(item.label)) {
              item.style.display = 'none';
            }
            if(['transportResponsibility'].includes(item.label)) {
              item.style.display = 'none';
            }
            // 采购--动力煤000通用,焦煤000通用,焦炭000通用，兰炭000通用 不展示产地
            if(['COKING_COAL_000','STEAM_COAL_012','COKING_000','SEMI_COKE_000', 'SMOKELESS_COAL_000', 'INJECTION_COAL_000'].includes(state.contractData?.contractTemplateName)) {
              if(['originPlace'].includes(item.label)) {
                item.style.display = 'none';
              }
            }
            if(['SMOKELESS_COAL_000', 'INJECTION_COAL_000'].includes(state.contractData.contractTemplateName)) {
              if(['consigneeCompanyName', 'shipperName'].includes(item.label)) {
                item.style.display = 'none';
              }
            }
          });
        }
        state.initTransportation = cloneList

      
    },
    updateSignDate(state, payload) {
      state.signDate = payload
    },
    updateChangeData(state, list) {


      
       // 遍历
      const optList = state.formList['transportation']

      const newTpl = list || []
      newTpl.forEach(el => {

        const changItem = el.changeItem || {}

        const itemDetails = changItem.itemDetails || []

        const currentItem = itemDetails.find(el2 => el2.itemName == el.label) || {}
        // 默认
        el.des = `原合同第${changItem.regulation || ''}条中的${changItem.fieldCName || ''}为：${currentItem.oldValue || ''},现变更为：${ Array.isArray(currentItem.value) ? currentItem.value.join('，' )  : currentItem.value || ''} `


        // 下拉查询的 需要获取 name值
        if(el.widget == 'select') {
          el.des = `原合同第${changItem.regulation || ''}条中的${changItem.fieldCName || ''}为：${getLabel(currentItem.oldValue, el.options) || ''},现变更为：${getLabel(currentItem.value, el.options) || ''} `
        }
        // 价格
        if(el.label == 'basePrice') {
        
          el.des = `原合同第${changItem.regulation || ''}条中的基准价格为：${currentItem.oldValue || ''}元/吨,现变更为：${ currentItem.value || '' }元/吨 `
        }
        if(el.label == 'basePriceDesc') {
        
          el.des = `原合同第${changItem.regulation || ''}条中的基准价格为：${currentItem.oldValue || ''}元/吨,现变更为：${ currentItem.value || '' }元/吨 `
        }
      // 违约金
        if(el.label == 'depositAmount') {
              
          el.des = `原合同第${changItem.regulation || ''}条中的保证金/违约金为：${currentItem.oldValue || ''}元,现变更为：${ currentItem.value || '' }元 `
        }
        // 数量
        if(el.label=== 'quantity') {
          // 后缀
          const offsetItem = itemDetails.find(el2 => el2.itemName == 'quantityOffset') || {}

          el.des = `原合同第${changItem.regulation || ''}条中的数量为：${currentItem.oldValue || ''}吨（±${offsetItem.oldValue || ''}%）,现变更为：${currentItem.value || ''}吨（±${offsetItem.value || ''}%） `
        }

        // 日期

        if(el.label=== 'deliveryDate') {

          const start =  itemDetails[0] || {}

          const end =  itemDetails[1] || {}

          const date1 = start.oldValue ?   moment(start.oldValue).format('LL') + '-' + moment(end.oldValue).format('LL')  : ''

          const date2 =  start.oldValue ?    moment(start.value).format('LL')  + '-' +   moment(end.value).format('LL')  : ''

      
          el.des = `原合同第${changItem.regulation || ''}条中的${changItem.fieldCName || ''}为：${date1},现变更为：${date2} `

        }
        // 运输方式
        if(el.label === 'transportMode') {

          const oldTransValue = []
          state.oldDeliveryModeItem.forEach(el2 => {
            oldTransValue.push(`${el2.title}：${el2.value || ''}`)
          })
          const newTransValue = []
        
          itemDetails.forEach(el2 => {
            if(el2.itemName == 'transportMode') {

              newTransValue.push(`${el2.itemCName}：${getLabel(el2.value, state.tplInfo.transportMode) || ''}`)

            }else if( ['deliveryMode', 'freightPayMode', 'transportResponsibility'].includes(el2.itemName)) {

              const transItem = optList.find(el3 => el3.label == el2.itemName )
    
              newTransValue.push(`${el2.itemCName}：${ getLabel(el2.value, transItem.options) || ''}`)

            }  else {

              newTransValue.push(`${el2.itemCName}：${ Array.isArray(el2.value) ? el2.value.join('，') : el2.value}`)
            }

          })

          el.des = `原合同第${changItem.regulation || ''}条中的${changItem.fieldCName || ''}为：${oldTransValue.join('，')},现变更为：${newTransValue.join('，')} `

        }

        // 包含隐藏 字段 其他的

        if(['deliveryMode', 'freightPayMode', 'transportResponsibility'].includes(el.label)) {
  
          const otherItem = itemDetails[1]

          el.des = `原合同第${changItem.regulation || ''}条中的${changItem.fieldCName || ''}为：${ getLabel(currentItem.oldValue, el.options)},现变更为：${getLabel(currentItem.value, el.options)} `
          if(otherItem) {
            el.des += `${otherItem.itemCName}：${otherItem.value}`
          }

        

        }
        // 银行
        if(["sellerBankAccountId", "buyerBankAccountId"].includes(el.label)) {
          el.des = `原合同第${changItem.regulation || ''}条中的${changItem.fieldCName || ''}为：${ getBankInfo(currentItem.oldValue,  el.optionsBank)},现变更为：${getBankInfo(currentItem.value,  el.optionsBank)}`
        }

      
      

        


        if(changItem.description) {
          
          el.des+= `，${changItem.description}`
        }


      })

      state.changeData = list

    },
    updateSignContent(state, payload) {
      state.signContent = payload

    },
    oldDeliveryMode(state, payload) {
      state.oldDeliveryModeItem = payload
    },
    tplInfo(state, payload) {
      state.tplInfo = payload
    },
    bankList(state, payload) {
      state.bankList = payload

    },
    changeTplInfo(state, payload) {
      state.changeTplInfo = payload
    },
    resetChange(state) {
      state.changeInfo = {}
    }
  },
  actions: {
  
  },
  getters: {

  }
   
};

export default supple;
