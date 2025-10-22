/**
 * TODO 目前只把汽运和火运的校验附件逻辑单写出来，后续会把收发货所有发货类型的校验都写在这里
 * @param fileObj 文件对象
 * @param despatchType  发运方式
 * @param freightPayType 运费支付方式
 * @param contractTemplate 合同id
 * @param coalType 煤种
 * @param platformType 是否是自营平台，只有发运方式是汽运时，需要
 * @returns {boolean}
 */
/**
 * 发货附件 start-
    汽运--动力煤--运输凭证--必填
    汽运--焦炭、焦煤--运输凭证--必填（运费下游支付、其他为非必填）
    汽运--兰炭、无烟煤、喷吹煤--运输凭证--必填

    火运--动力煤--大票（必填）、车号表 （必填）、其他凭证（非必填）
    火运--焦炭--运输凭证--必填（运费下游支付、其他、焦炭006为非必填）
    火运--焦煤--运输凭证---必填（运费下游支付、其他为非必填）
    火运--兰炭、无烟煤、喷吹煤--运输凭证--必填

    汽运和火运--汽运--动力煤--运输凭证--必填
    汽运和火运--火运--动力煤--大票（必填）、车号表 （必填）、其他凭证（非必填）

    船运--动力煤--港航货物交接清单（必填）、水路货物运单 （必填）、化验报告（必填）
    船运--焦炭--运输凭证（非必填）、称重凭证（非必填）
    船运--焦煤--运输凭证必填（运费下游支付、其他为非必填）、称重凭证（非必填）
    船运--兰炭、无烟煤、喷吹煤--运输凭证--必填

    船运--动力煤--运输凭证（必填）、化验报告（非必填）、其他凭证（非必填）
    船运--焦炭---运输凭证（必填）、称重凭证（非必填）、其他凭证（非必填）
    船运--焦煤---运输凭证（必填、运费下游支付、其他方式为非必填）、其他凭证（非必填）
    船运--兰炭、无烟煤、喷吹煤---运输凭证（必填）、其他凭证（非必填）
    **发货附件
end*/
import {filterCodeByTextName} from '@sub/utils/globalCode.js'
import {message} from 'ant-design-vue'
import CONSTANTS from '@sub/utils/constants.js'
export default function validateFileType(fileObj,despatchType, freightPayType, contractTemplate, coalType, platformType, transType){
  let typeArr = []
  if (Array.isArray(fileObj)) {
    typeArr = fileObj.map((item) => {
      return +item.type
    })
  }

  if (transType === CONSTANTS.transportModeDict.AUTOMOBILE_AND_TRAIN) {
    // 选择非自有平台时，屏蔽附件上传入口
    if (platformType != 99 && despatchType === CONSTANTS.despatchModeDict.AUTOMOBILE) return true

    // 当发运方式为“汽运”时，以下几种场景中，发货附件信息运输凭证类型为选填项，保存时不做必填项校验，提交时需校验是否上传运输凭证附件
    // - 当煤种为“动力煤”，且运输支付方式为“下游支付”或“其他”时
    // - 当煤种为“动力煤”，且合同模板为“动力煤合同模板006”（代采购）时
    // - 当煤种为“焦炭”，且运输支付方式为“下游支付”或“其他”时

    // 当发运方式为“火运”时，以下几种场景中，发货附件信息运输凭证类型为选填项，保存时不做必填项校验，提交时需校验是否上传运输凭证附件
    // - 当煤种为“动力煤”，且运输支付方式为“下游支付”或“其他”时
    // - 当煤种为“动力煤”，且合同模板为“动力煤合同模板006”（代采购）时
    // - 当煤种为“焦炭”，且运输支付方式为“下游支付”或“其他”时
    // - 当煤种为“焦炭”，且合同模板为“焦炭合同模板006”时

    let needValidate ;
    if(despatchType == CONSTANTS.despatchModeDict.AUTOMOBILE){
      if((coalType == CONSTANTS.coalTypeDict.COKE || coalType == CONSTANTS.coalTypeDict.COKING_COAL) && (freightPayType != filterCodeByTextName('对方支付', 'freightPayTypeDict') && freightPayType != filterCodeByTextName('我方支付', 'freightPayTypeDict'))){
        needValidate = false
      }else{
        needValidate = true
      }
      if(needValidate){
        // 兼容善美保理汽运发货申请修改
        if (Array.isArray(fileObj)) {
          if (typeArr.includes(5)) {
            return true
          } else {
            message.error("请上传发货对应的运输凭证附件");
            return false
          }
        }
      }else{
        return true;
      }
    }
    if(despatchType == CONSTANTS.despatchModeDict.TRAIN){
      if((coalType == CONSTANTS.coalTypeDict.COKE || coalType == CONSTANTS.coalTypeDict.COKING_COAL) && (freightPayType != filterCodeByTextName('卖方支付', 'freightPayTypeDict') && freightPayType != filterCodeByTextName('买方支付', 'freightPayTypeDict'))){
        needValidate = false
      }else if(coalType == CONSTANTS.coalTypeDict.COKE && contractTemplate== CONSTANTS.contractTemplateDict.COKING_006){
        needValidate = false
      }else{
        needValidate = true
      }
      // 兼容善美保理火运发货申请修改
    if (needValidate) {
      if (coalType == CONSTANTS.coalTypeDict.STEAM_COAL) { //动力煤26-大票；27-车号表；0-其他附件非必填；
        if (Array.isArray(fileObj)) {
          if (typeArr.includes('DP')) {
            if (typeArr.includes('CHB')) {
              return true
            } else {
              message.error("请上传发货对应的车号表附件");
              return false
            }
            return true
          } else {
            message.error("请上传发货对应的大票附件");
            return false
          }
        }
      } else { // 其他煤种必填情况下校验运输凭证
        if (typeArr.includes(5)) {
          return true
        } else {
          message.error("请上传发货对应的运输凭证附件");
          return false
        }
      }
    } else{
      return true;
    }
    }

  }
  if (transType === CONSTANTS.transportModeDict.AUTOMOBILE) {
    // 选择非自有平台时，屏蔽附件上传入口
    if (platformType != '99') return true

    let needValidate ;
    if((coalType == CONSTANTS.coalTypeDict.COKE || coalType == CONSTANTS.coalTypeDict.COKING_COAL) && (freightPayType != filterCodeByTextName('对方支付', 'freightPayTypeDict') && freightPayType != filterCodeByTextName('我方支付', 'freightPayTypeDict'))){
      needValidate = false
    }else{
      needValidate = true
    }

    if(needValidate){
      // 兼容善美保理汽运发货申请修改
      if (Array.isArray(fileObj)) {
        if (typeArr.includes(5)) {
          return true
        } else {
          message.error("请上传发货对应的运输凭证附件");
          return false
        }
      }
    }else{
      return true;
    }
  }
  if (transType === CONSTANTS.transportModeDict.TRAIN) {
    let needValidate ;
    if((coalType == CONSTANTS.coalTypeDict.COKE || coalType == CONSTANTS.coalTypeDict.COKING_COAL) && (freightPayType != filterCodeByTextName('对方支付', 'freightPayTypeDict') && freightPayType != filterCodeByTextName('我方支付', 'freightPayTypeDict'))){
      needValidate = false
    }else if(coalType == CONSTANTS.coalTypeDict.COKE && contractTemplate== CONSTANTS.contractTemplateDict.COKING_006){
      needValidate = false
    }else{
      needValidate = true
    }

    // 兼容善美保理火运发货申请修改
    if (needValidate) {
      if(Array.isArray(fileObj)) {
        if (!typeArr.includes('DP')) {
          message.error("请上传发货对应的大票附件");
          return false;
        } else {
          return true;
        }
      }
    } else{
      return true;
    }

  }
  if (transType === CONSTANTS.transportModeDict.SHIP) {
    let needValidate ;
    if(coalType == CONSTANTS.coalTypeDict.COKING_COAL && (freightPayType != filterCodeByTextName('对方支付', 'freightPayTypeDict') && freightPayType != filterCodeByTextName('我方支付', 'freightPayTypeDict'))){
      needValidate = false
    }else{
      needValidate = true
    }
    // 兼容善美保理船运发货申请修改
    if (needValidate) {
      if (typeArr.includes('YSPZ')) { // 运输凭证必填
        return true
      } else {
        message.error("请上传发货对应的运输凭证附件");
        return false
      }
    } else{
      return true;
    }
  }
}
