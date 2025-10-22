"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = validateFileType;

var _globalCode = require("@sub/utils/globalCode.js");

var _antDesignVue = require("ant-design-vue");

var _constants = _interopRequireDefault(require("@sub/utils/constants.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

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
function validateFileType(fileObj, despatchType, freightPayType, contractTemplate, coalType, platformType, transType) {
  var typeArr = [];

  if (Array.isArray(fileObj)) {
    typeArr = fileObj.map(function (item) {
      return +item.type;
    });
  }

  if (transType === _constants["default"].transportModeDict.AUTOMOBILE_AND_TRAIN) {
    // 选择非自有平台时，屏蔽附件上传入口
    if (platformType != 99 && despatchType === _constants["default"].despatchModeDict.AUTOMOBILE) return true; // 当发运方式为“汽运”时，以下几种场景中，发货附件信息运输凭证类型为选填项，保存时不做必填项校验，提交时需校验是否上传运输凭证附件
    // - 当煤种为“动力煤”，且运输支付方式为“下游支付”或“其他”时
    // - 当煤种为“动力煤”，且合同模板为“动力煤合同模板006”（代采购）时
    // - 当煤种为“焦炭”，且运输支付方式为“下游支付”或“其他”时
    // 当发运方式为“火运”时，以下几种场景中，发货附件信息运输凭证类型为选填项，保存时不做必填项校验，提交时需校验是否上传运输凭证附件
    // - 当煤种为“动力煤”，且运输支付方式为“下游支付”或“其他”时
    // - 当煤种为“动力煤”，且合同模板为“动力煤合同模板006”（代采购）时
    // - 当煤种为“焦炭”，且运输支付方式为“下游支付”或“其他”时
    // - 当煤种为“焦炭”，且合同模板为“焦炭合同模板006”时

    var needValidate;

    if (despatchType == _constants["default"].despatchModeDict.AUTOMOBILE) {
      if ((coalType == _constants["default"].coalTypeDict.COKE || coalType == _constants["default"].coalTypeDict.COKING_COAL) && freightPayType != (0, _globalCode.filterCodeByTextName)('对方支付', 'freightPayTypeDict') && freightPayType != (0, _globalCode.filterCodeByTextName)('我方支付', 'freightPayTypeDict')) {
        needValidate = false;
      } else {
        needValidate = true;
      }

      if (needValidate) {
        // 兼容善美保理汽运发货申请修改
        if (Array.isArray(fileObj)) {
          if (typeArr.includes('YSPZ')) {
            return true;
          } else {
            _antDesignVue.message.error("请上传发货对应的运输凭证附件");

            return false;
          }
        }
      } else {
        return true;
      }
    }

    if (despatchType == _constants["default"].despatchModeDict.TRAIN) {
      if ((coalType == _constants["default"].coalTypeDict.COKE || coalType == _constants["default"].coalTypeDict.COKING_COAL) && freightPayType != (0, _globalCode.filterCodeByTextName)('对方支付', 'freightPayTypeDict') && freightPayType != (0, _globalCode.filterCodeByTextName)('我方支付', 'freightPayTypeDict')) {
        needValidate = false;
      } else if (coalType == _constants["default"].coalTypeDict.COKE && contractTemplate == _constants["default"].contractTemplateDict.COKING_006) {
        needValidate = false;
      } else {
        needValidate = true;
      } // 兼容善美保理火运发货申请修改


      if (needValidate) {
        if (coalType == _constants["default"].coalTypeDict.STEAM_COAL) {
          //动力煤26-大票；27-车号表；0-其他附件非必填；
          if (Array.isArray(fileObj)) {
            if (typeArr.includes('DP')) {
              if (typeArr.includes('CHB')) {
                return true;
              } else {
                _antDesignVue.message.error("请上传发货对应的车号表附件");

                return false;
              }

              return true;
            } else {
              _antDesignVue.message.error("请上传发货对应的大票附件");

              return false;
            }
          }
        } else {
          // 其他煤种必填情况下校验运输凭证
          if (typeArr.includes('YSPZ')) {
            return true;
          } else {
            _antDesignVue.message.error("请上传发货对应的运输凭证附件");

            return false;
          }
        }
      } else {
        return true;
      }
    }
  }

  if (transType === _constants["default"].transportModeDict.AUTOMOBILE) {
    // 选择非自有平台时，屏蔽附件上传入口
    if (platformType != '99') return true;

    var _needValidate;

    if ((coalType == _constants["default"].coalTypeDict.COKE || coalType == _constants["default"].coalTypeDict.COKING_COAL) && freightPayType != (0, _globalCode.filterCodeByTextName)('对方支付', 'freightPayTypeDict') && freightPayType != (0, _globalCode.filterCodeByTextName)('我方支付', 'freightPayTypeDict')) {
      _needValidate = false;
    } else {
      _needValidate = true;
    }

    if (_needValidate) {
      // 兼容善美保理汽运发货申请修改
      if (Array.isArray(fileObj)) {
        if (typeArr.includes('YSPZ')) {
          return true;
        } else {
          _antDesignVue.message.error("请上传发货对应的运输凭证附件");

          return false;
        }
      }
    } else {
      return true;
    }
  }

  if (transType === _constants["default"].transportModeDict.TRAIN) {
    var _needValidate2;

    if ((coalType == _constants["default"].coalTypeDict.COKE || coalType == _constants["default"].coalTypeDict.COKING_COAL) && freightPayType != (0, _globalCode.filterCodeByTextName)('对方支付', 'freightPayTypeDict') && freightPayType != (0, _globalCode.filterCodeByTextName)('我方支付', 'freightPayTypeDict')) {
      _needValidate2 = false;
    } else if (coalType == _constants["default"].coalTypeDict.COKE && contractTemplate == _constants["default"].contractTemplateDict.COKING_006) {
      _needValidate2 = false;
    } else {
      _needValidate2 = true;
    } // 兼容善美保理火运发货申请修改


    if (_needValidate2) {
      if (coalType == _constants["default"].coalTypeDict.STEAM_COAL) {
        //动力煤26-大票；27-车号表；0-其他附件非必填；
        if (Array.isArray(fileObj)) {
          if (typeArr.includes(26)) {
            if (typeArr.includes(27)) {
              return true;
            } else {
              _antDesignVue.message.error("请上传发货对应的车号表附件");

              return false;
            }
          } else {
            _antDesignVue.message.error("请上传发货对应的大票附件");

            return false;
          }
        }
      } else {
        // 其他煤种必填情况下校验运输凭证
        if (typeArr.includes('YSPZ')) {
          return true;
        } else {
          _antDesignVue.message.error("请上传发货对应的运输凭证附件");

          return false;
        }
      }
    } else {
      return true;
    }
  }

  if (transType === _constants["default"].transportModeDict.SHIP) {
    var _needValidate3;

    if (coalType == _constants["default"].coalTypeDict.COKING_COAL && freightPayType != (0, _globalCode.filterCodeByTextName)('对方支付', 'freightPayTypeDict') && freightPayType != (0, _globalCode.filterCodeByTextName)('我方支付', 'freightPayTypeDict')) {
      _needValidate3 = false;
    } else {
      _needValidate3 = true;
    } // 兼容善美保理船运发货申请修改


    if (_needValidate3) {
      if (typeArr.includes('YSPZ')) {
        // 运输凭证必填
        return true;
      } else {
        _antDesignVue.message.error("请上传发货对应的运输凭证附件");

        return false;
      }
    } else {
      return true;
    }
  }
}