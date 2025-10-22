"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBaseInfoData1 = getBaseInfoData1;
exports.getOtherInfoData1 = getOtherInfoData1;
exports.getBaseInfoData4 = getBaseInfoData4;
exports.getBaseInfoData8 = getBaseInfoData8;

var _store = _interopRequireDefault(require("store"));

var _constants = _interopRequireDefault(require("@sub/utils/constants"));

var _globalCode = require("@sub/utils/globalCode.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

// 对应创建订单(顶部)
var _CONSTANTS$contractTe = _constants["default"].contractTemplateDict,
    STEAM_COAL_013 = _CONSTANTS$contractTe.STEAM_COAL_013,
    COKING_COAL_005 = _CONSTANTS$contractTe.COKING_COAL_005,
    COKING_008 = _CONSTANTS$contractTe.COKING_008,
    SEMI_COKE_002 = _CONSTANTS$contractTe.SEMI_COKE_002,
    INJECTION_COAL_002 = _CONSTANTS$contractTe.INJECTION_COAL_002,
    SMOKELESS_COAL_002 = _CONSTANTS$contractTe.SMOKELESS_COAL_002,
    STEAM_COAL_1004 = _CONSTANTS$contractTe.STEAM_COAL_1004,
    COKING_COAL_1004 = _CONSTANTS$contractTe.COKING_COAL_1004,
    COKING_1004 = _CONSTANTS$contractTe.COKING_1004,
    SEMI_COKE_1004 = _CONSTANTS$contractTe.SEMI_COKE_1004,
    INJECTION_COAL_1004 = _CONSTANTS$contractTe.INJECTION_COAL_1004,
    SMOKELESS_COAL_1004 = _CONSTANTS$contractTe.SMOKELESS_COAL_1004,
    STEAM_COAL_1003 = _CONSTANTS$contractTe.STEAM_COAL_1003,
    COKING_COAL_1003 = _CONSTANTS$contractTe.COKING_COAL_1003,
    COKING_1003 = _CONSTANTS$contractTe.COKING_1003,
    SEMI_COKE_1003 = _CONSTANTS$contractTe.SEMI_COKE_1003,
    INJECTION_COAL_1003 = _CONSTANTS$contractTe.INJECTION_COAL_1003,
    SMOKELESS_COAL_1003 = _CONSTANTS$contractTe.SMOKELESS_COAL_1003,
    SMOKELESS_COAL_000 = _CONSTANTS$contractTe.SMOKELESS_COAL_000,
    INJECTION_COAL_000 = _CONSTANTS$contractTe.INJECTION_COAL_000,
    SEMI_COKE_003 = _CONSTANTS$contractTe.SEMI_COKE_003,
    SMOKELESS_COAL_003 = _CONSTANTS$contractTe.SMOKELESS_COAL_003,
    INJECTION_COAL_003 = _CONSTANTS$contractTe.INJECTION_COAL_003; // 采购订单仓押--动力煤012-仓押、焦煤004-仓押、焦炭008-仓押、兰炭002-仓押、无烟煤002-仓押、喷吹煤002-仓押

var BUY_PRESSURE_LIST = [STEAM_COAL_013, COKING_COAL_005, COKING_008, SEMI_COKE_002, INJECTION_COAL_002, SMOKELESS_COAL_002]; // 销售订单仓押--动力煤1004-仓押、焦煤动力煤1004-仓押、焦炭动力煤1004-仓押、兰炭动力煤1004-仓押、无烟煤动力煤1004-仓押、喷吹煤动力煤1004-仓押

var SELL_PRESSURE_LIST = [STEAM_COAL_1004, COKING_COAL_1004, COKING_1004, SEMI_COKE_1004, INJECTION_COAL_1004, SMOKELESS_COAL_1004]; // 销售订单代采--动力煤1003-代采、焦煤动力煤1003-代采、焦炭动力煤1003-代采、兰炭动力煤1003-代采、无烟煤动力煤1003-代采、喷吹煤动力煤1003-代采

var SELL_PURCHASE_LIST = [STEAM_COAL_1003, COKING_COAL_1003, COKING_1003, SEMI_COKE_1003, INJECTION_COAL_1003, SMOKELESS_COAL_1003]; // 

var COMMON_AGENT_LIST = [SMOKELESS_COAL_000, INJECTION_COAL_000, SEMI_COKE_003, SMOKELESS_COAL_003, INJECTION_COAL_003];

function getBaseInfoData1(data, coalType, contractTemplate) {
  var isTransportMode = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  var selectOther = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
  var temp = [],
      Train = [],
      // 火运
  Automobile = [],
      // 汽运
  Ship = [],
      // 船运
  CarAndTrain = []; // 汽运和火运

  var result = [];

  if (COMMON_AGENT_LIST.includes(contractTemplate)) {
    temp = [{
      label: "品名",
      type: "input",
      value: "goodsName",
      require: true
    }, {
      label: "基准价格(元/吨)",
      type: "number",
      min: 0,
      max: 9999.99,
      value: "basePrice",
      require: true
    }, {
      label: "数量(吨)",
      type: "number",
      min: 0,
      max: 9999.99,
      value: "quantity",
      require: true
    }, {
      label: "交货期限",
      type: "dateRange",
      value: "deliveryDate",
      require: true
    }, {
      label: "运输方式",
      type: "select",
      value: "transportMode",
      require: true,
      data: (0, _globalCode.filterCodeByKey)("transportModeDict" + contractTemplate)
    }];
    Train = [{
      label: "发站",
      type: "search",
      value: "trainSendStationName",
      require: true
    }, {
      label: "到站",
      type: "search",
      value: "trainArriveStationName",
      require: true
    }, {
      label: "托运人",
      type: "selectTag",
      value: "consignorCompanyName",
      require: true
    }, {
      label: "收货人",
      type: "selectTag",
      value: "consigneeCompanyName",
      require: true
    }, {
      label: "产地",
      type: "input",
      value: "originPlace",
      require: true
    }];
    Automobile = [{
      label: "发货点",
      type: "input",
      value: "sendGoodsAddress",
      require: true
    }, {
      label: "发货人",
      type: "selectTag",
      value: "shipperName",
      require: true
    }, {
      label: "收货人",
      type: "selectTag",
      value: "consigneeCompanyName",
      require: true
    }, {
      label: "产地",
      type: "input",
      value: "originPlace",
      require: true
    }];
    Ship = [{
      label: "装货港",
      type: "selectTag",
      value: "shipLoadingPortName",
      require: true
    }, {
      label: "卸货港",
      type: "selectTag",
      value: "shipDischargingPortName",
      require: true
    }, {
      label: "发货人",
      type: "selectTag",
      value: "shipperName",
      require: false
    }, {
      label: "收货人",
      type: "selectTag",
      value: "consigneeCompanyName",
      require: false
    }, {
      label: "产地",
      type: "input",
      value: "originPlace",
      require: true
    }];
    CarAndTrain = [{
      label: "发站",
      type: "search",
      value: "trainSendStationName",
      require: true
    }, {
      label: "到站",
      type: "search",
      value: "trainArriveStationName",
      require: true
    }, {
      label: "发货点",
      type: "input",
      value: "sendGoodsAddress",
      require: true
    }, {
      label: "发货人",
      type: "selectTag",
      value: "shipperName",
      require: true
    }, {
      label: "托运人",
      type: "selectTag",
      value: "consignorCompanyName",
      require: true
    }, {
      label: "收货人",
      type: "selectTag",
      value: "consigneeCompanyName",
      require: true
    }, {
      label: "产地",
      type: "input",
      value: "originPlace",
      require: true
    }];
  }

  if (BUY_PRESSURE_LIST.includes(contractTemplate)) {
    //采购订单仓押
    temp = [{
      label: "基准价格(元/吨)",
      type: "number",
      min: 0,
      max: 9999.99,
      value: "basePrice",
      require: true
    }, {
      label: "结算类型",
      type: "select",
      value: "settleMode",
      require: true,
      data: (0, _globalCode.filterCodeByKey)("settleModeDict")
    }, {
      label: "交（提）货地点",
      type: "input",
      value: "deliveryPickUpPlace",
      maxLength: 50,
      require: true
    }, {
      label: "交货期限",
      type: "dateRange",
      value: "deliveryDate",
      require: true
    }, {
      label: "运输方式",
      type: "select",
      value: "transportMode",
      require: true,
      data: (0, _globalCode.filterCodeByKey)("transportModeDict" + contractTemplate)
    }, {
      label: "使用资金来源",
      type: "fuwufzf",
      value: "bankProductCode",
      require: true
    }, {
      label: "运输负责方",
      type: "select",
      value: "transportResponsibility",
      require: true,
      data: _constants["default"].transportResponsibilityList
    }, {
      label: "请输入运输负责方",
      type: "input",
      value: "transportResponsibilityOther",
      maxLength: 50,
      require: true
    }, {
      label: "运费支付方式",
      type: "yfzf",
      value: "freightPayMode",
      require: true,
      data: (0, _globalCode.filterCodeByKey)("freightPayTypeDict")
    }];
    Ship = [{
      label: "装货港",
      type: "selectTag",
      value: "shipLoadingPortName",
      require: false
    }, {
      label: "卸货港",
      type: "selectTag",
      value: "shipDischargingPortName",
      require: false
    }, {
      label: "托运人",
      type: "input",
      value: "consignorCompanyName",
      require: false
    }, {
      label: "收货人名称",
      type: "selectTag",
      value: "consigneeCompanyName",
      require: false
    }], Train = [{
      label: "发站",
      type: "search",
      value: "trainSendStationName",
      require: false
    }, {
      label: "到站",
      type: "search",
      value: "trainArriveStationName",
      require: false
    }, {
      label: "托运人",
      type: "input",
      value: "consignorCompanyName",
      require: false
    }, {
      label: "收货人名称",
      type: "selectTag",
      value: "consigneeCompanyName",
      require: false
    }], Automobile = [{
      label: "发货点",
      type: "input",
      value: "sendGoodsAddress",
      require: false
    }, {
      label: "收货人名称",
      type: "selectTag",
      value: "consigneeCompanyName",
      require: false
    }], CarAndTrain = [{
      label: "发站",
      type: "search",
      value: "trainSendStationName",
      require: false
    }, {
      label: "到站",
      type: "search",
      value: "trainArriveStationName",
      require: false
    }, {
      label: "托运人",
      type: "input",
      value: "consignorCompanyName",
      require: false
    }, {
      label: "收货人名称",
      type: "selectTag",
      value: "consigneeCompanyName",
      require: false
    }, {
      label: "发货点",
      type: "input",
      value: "sendGoodsAddress",
      require: false
    }];
  }

  if (SELL_PRESSURE_LIST.includes(contractTemplate)) {
    //销售订单仓押
    temp = [{
      label: "基准价格(元/吨)",
      type: "number",
      min: 0,
      max: 9999.99,
      value: "basePrice",
      require: true
    }, {
      label: "结算类型",
      type: "select",
      value: "settleMode",
      require: true,
      data: (0, _globalCode.filterCodeByKey)("settleModeDict")
    }, {
      label: "交（提）货地点",
      type: "input",
      value: "deliveryPickUpPlace",
      maxLength: 50,
      require: true
    }, {
      label: "交货期限",
      type: "dateRange",
      value: "deliveryDate",
      require: true
    }, {
      label: "保证金/违约金(元)",
      type: "number",
      min: 0,
      max: 9999999999.99,
      value: "depositAmount",
      require: true
    }, {
      label: "运输方式",
      type: "select",
      value: "transportMode",
      require: true,
      data: (0, _globalCode.filterCodeByKey)("transportModeDict" + contractTemplate)
    }, {
      label: "使用资金来源",
      type: "fuwufzf",
      value: "bankProductCode",
      require: true
    }, {
      label: "运输负责方",
      type: "select",
      value: "transportResponsibility",
      require: true,
      data: _constants["default"].transportResponsibilityList
    }, {
      label: "请输入运输负责方",
      type: "input",
      value: "transportResponsibilityOther",
      maxLength: 50,
      require: true
    }, {
      label: "运费支付方式",
      type: "yfzf",
      value: "freightPayMode",
      require: true,
      data: (0, _globalCode.filterCodeByKey)("freightPayTypeDict")
    }];
    Ship = [{
      label: "装货港",
      type: "selectTag",
      value: "shipLoadingPortName",
      require: false
    }, {
      label: "卸货港",
      type: "selectTag",
      value: "shipDischargingPortName",
      require: false
    }, {
      label: "托运人",
      type: "input",
      value: "consignorCompanyName",
      require: false
    }, {
      label: "收货人名称",
      type: "selectTag",
      value: "consigneeCompanyName",
      require: false
    }], Train = [{
      label: "发站",
      type: "search",
      value: "trainSendStationName",
      require: false
    }, {
      label: "到站",
      type: "search",
      value: "trainArriveStationName",
      require: false
    }, {
      label: "托运人",
      type: "input",
      value: "consignorCompanyName",
      require: false
    }, {
      label: "收货人名称",
      type: "selectTag",
      value: "consigneeCompanyName",
      require: false
    }], Automobile = [{
      label: "发货点",
      type: "input",
      value: "sendGoodsAddress",
      require: false
    }, {
      label: "收货人名称",
      type: "selectTag",
      value: "consigneeCompanyName",
      require: false
    }], CarAndTrain = [{
      label: "发站",
      type: "search",
      value: "trainSendStationName",
      require: false
    }, {
      label: "到站",
      type: "search",
      value: "trainArriveStationName",
      require: false
    }, {
      label: "托运人",
      type: "input",
      value: "consignorCompanyName",
      require: false
    }, {
      label: "收货人名称",
      type: "selectTag",
      value: "consigneeCompanyName",
      require: false
    }, {
      label: "发货点",
      type: "input",
      value: "sendGoodsAddress",
      require: false
    }];
  }

  if (SELL_PURCHASE_LIST.includes(contractTemplate)) {
    //销售订单代采
    temp = [{
      label: "基准价格(元/吨)",
      type: "number",
      min: 0,
      max: 9999.99,
      value: "basePrice",
      require: true
    }, {
      label: "结算类型",
      type: "select",
      value: "settleMode",
      require: true,
      data: (0, _globalCode.filterCodeByKey)("settleModeDict")
    }, {
      label: "交（提）货地点",
      type: "input",
      value: "deliveryPickUpPlace",
      maxLength: 50,
      require: true
    }, {
      label: "交货期限",
      type: "dateRange",
      value: "deliveryDate",
      require: true
    }, {
      label: "保证金/违约金(元)",
      type: "number",
      min: 0,
      max: 9999999999.99,
      value: "depositAmount",
      require: true
    }, {
      label: "产地",
      type: "input",
      value: "originPlace",
      require: true
    }, {
      label: "运输方式",
      type: "select",
      value: "transportMode",
      require: true,
      data: (0, _globalCode.filterCodeByKey)("transportModeDict" + contractTemplate)
    }, {
      label: "使用资金来源",
      type: "fuwufzf",
      value: "bankProductCode",
      require: true
    }, {
      label: "运输负责方",
      type: "select",
      value: "transportResponsibility",
      require: true,
      data: _constants["default"].transportResponsibilityList
    }, {
      label: "请输入运输负责方",
      type: "input",
      value: "transportResponsibilityOther",
      maxLength: 50,
      require: true
    }, {
      label: "运费支付方式",
      type: "yfzf",
      value: "freightPayMode",
      require: true,
      data: (0, _globalCode.filterCodeByKey)("freightPayTypeDict")
    }];
    Ship = [{
      label: "装货港",
      type: "selectTag",
      value: "shipLoadingPortName",
      require: false
    }, {
      label: "卸货港",
      type: "selectTag",
      value: "shipDischargingPortName",
      require: false
    }, {
      label: "托运人",
      type: "input",
      value: "consignorCompanyName",
      require: false
    }, {
      label: "收货人名称",
      type: "selectTag",
      value: "consigneeCompanyName",
      require: false
    }], Train = [{
      label: "发站",
      type: "search",
      value: "trainSendStationName",
      require: false
    }, {
      label: "到站",
      type: "search",
      value: "trainArriveStationName",
      require: false
    }, {
      label: "托运人",
      type: "input",
      value: "consignorCompanyName",
      require: false
    }, {
      label: "收货人名称",
      type: "selectTag",
      value: "consigneeCompanyName",
      require: false
    }], Automobile = [{
      label: "发货点",
      type: "input",
      value: "sendGoodsAddress",
      require: false
    }, {
      label: "收货人名称",
      type: "selectTag",
      value: "consigneeCompanyName",
      require: false
    }], CarAndTrain = [{
      label: "发站",
      type: "search",
      value: "trainSendStationName",
      require: false
    }, {
      label: "到站",
      type: "search",
      value: "trainArriveStationName",
      require: false
    }, {
      label: "托运人",
      type: "input",
      value: "consignorCompanyName",
      require: false
    }, {
      label: "收货人名称",
      type: "selectTag",
      value: "consigneeCompanyName",
      require: false
    }, {
      label: "发货点",
      type: "input",
      value: "sendGoodsAddress",
      require: false
    }];
  }

  if (contractTemplate == _constants["default"].contractTemplateDict.STEAM_COAL_003) {
    // 动力煤003
    temp = [{
      label: "基准价格(元/吨)",
      type: "number",
      min: 0,
      max: 9999.99,
      value: "basePrice",
      require: true
    }, {
      label: "结算类型",
      type: "select",
      value: "settleMode",
      require: true,
      data: (0, _globalCode.filterCodeByKey)("settleModeDict")
    }, {
      label: "运输方式",
      type: "select",
      value: "transportMode",
      require: true,
      data: (0, _globalCode.filterCodeByKey)("transportModeDict" + contractTemplate)
    }, {
      label: "交货期限",
      type: "dateRange",
      value: "deliveryDate",
      require: true
    }, {
      label: "运费支付方式",
      type: "yfzf",
      value: "freightPayMode",
      require: true,
      data: (0, _globalCode.filterCodeByKey)("freightPayTypeDict")
    }, {
      label: "使用资金来源",
      type: "fuwufzf",
      value: "bankProductCode",
      require: true
    }];
    Ship = [{
      label: "装货港",
      type: "selectTag",
      value: "shipLoadingPortName",
      require: true
    }, {
      label: "卸货港",
      type: "selectTag",
      value: "shipDischargingPortName",
      require: true
    }, {
      label: "收货人名称",
      type: "selectTag",
      value: "consigneeCompanyName",
      require: false
    }, {
      label: "收货人简称",
      type: "selectTag",
      value: "consigneeShortName",
      require: false
    }, {
      label: "托运人",
      type: "input",
      value: "consignorCompanyName",
      require: false
    }];
    Train = [{
      label: "收货人简称",
      type: "selectTag",
      value: "consigneeShortName",
      require: true
    }, {
      label: "发站",
      type: "search",
      value: "trainSendStationName",
      require: true
    }, {
      label: "到站",
      type: "search",
      value: "trainArriveStationName",
      require: true
    }, {
      label: "托运人",
      type: "input",
      value: "consignorCompanyName",
      require: true
    }, {
      label: "收货人名称",
      type: "selectTag",
      value: "consigneeCompanyName",
      require: true
    }, {
      label: "产地",
      type: "input",
      value: "originPlace",
      require: true
    }];
    Automobile = [{
      label: "收货人简称",
      type: "selectTag",
      value: "consigneeShortName",
      require: true
    }, {
      label: "发货点",
      type: "input",
      value: "sendGoodsAddress",
      require: true
    }, {
      label: "托运人",
      type: "input",
      value: "consignorCompanyName",
      require: true
    }, {
      label: "收货人名称",
      type: "selectTag",
      value: "consigneeCompanyName",
      require: true
    }, {
      label: "产地",
      type: "input",
      value: "originPlace",
      require: true
    }];
    CarAndTrain = [{
      label: "收货人简称",
      type: "selectTag",
      value: "consigneeShortName",
      require: true
    }, {
      label: "发站",
      type: "search",
      value: "trainSendStationName",
      require: true
    }, {
      label: "到站",
      type: "search",
      value: "trainArriveStationName",
      require: true
    }, {
      label: "托运人",
      type: "input",
      value: "consignorCompanyName",
      require: true
    }, {
      label: "产地",
      type: "input",
      value: "originPlace",
      require: true
    }, {
      label: "发货点",
      type: "input",
      value: "sendGoodsAddress",
      require: true
    }, {
      label: "收货人名称",
      type: "selectTag",
      value: "consigneeCompanyName",
      require: true
    }];
  }

  if (contractTemplate == _constants["default"].contractTemplateDict.STEAM_COAL_001 || contractTemplate == _constants["default"].contractTemplateDict.STEAM_COAL_011 || contractTemplate == _constants["default"].contractTemplateDict.STEAM_COAL_002 || contractTemplate == _constants["default"].contractTemplateDict.STEAM_COAL_012 || contractTemplate == _constants["default"].contractTemplateDict.STEAM_COAL_004) {
    // 动力煤001 002 010 000 004
    temp = [{
      label: "基准价格(元/吨)",
      type: "number",
      min: 0,
      max: 9999.99,
      value: "basePrice",
      require: true
    }, {
      label: "结算类型",
      type: "select",
      value: "settleMode",
      require: true,
      data: (0, _globalCode.filterCodeByKey)("settleModeDict")
    }, {
      label: "运输方式",
      type: "select",
      value: "transportMode",
      require: true,
      data: (0, _globalCode.filterCodeByKey)("transportModeDict" + contractTemplate)
    }, {
      label: "交货期限",
      type: "dateRange",
      value: "deliveryDate",
      require: true
    }, {
      label: "保证金/违约金(元)",
      type: "number",
      min: 0,
      max: 9999999999.99,
      value: "depositAmount",
      require: true
    }, {
      label: "运费支付方式",
      type: "yfzf",
      value: "freightPayMode",
      require: true,
      data: (0, _globalCode.filterCodeByKey)("freightPayTypeDict")
    }, {
      label: "使用资金来源",
      type: "fuwufzf",
      value: "bankProductCode",
      require: true
    }];
    Train = [{
      label: "收货人简称",
      type: "selectTag",
      value: "consigneeShortName",
      require: true
    }, {
      label: "发站",
      type: "search",
      value: "trainSendStationName",
      require: true
    }, {
      label: "到站",
      type: "search",
      value: "trainArriveStationName",
      require: true
    }, {
      label: "托运人",
      type: "input",
      value: "consignorCompanyName",
      require: true
    }, {
      label: "收货人名称",
      type: "selectTag",
      value: "consigneeCompanyName",
      require: true
    }, {
      label: "产地",
      type: "input",
      value: "originPlace",
      require: true
    }];
    Automobile = [{
      label: "收货人简称",
      type: "selectTag",
      value: "consigneeShortName",
      require: true
    }, {
      label: "发货点",
      type: "input",
      value: "sendGoodsAddress",
      require: true
    }, {
      label: "托运人",
      type: "input",
      value: "consignorCompanyName",
      require: true
    }, {
      label: "收货人名称",
      type: "selectTag",
      value: "consigneeCompanyName",
      require: true
    }, {
      label: "产地",
      type: "input",
      value: "originPlace",
      require: true
    }];
    Ship = [{
      label: "装货港",
      type: "selectTag",
      value: "shipLoadingPortName",
      require: true
    }, {
      label: "卸货港",
      type: "selectTag",
      value: "shipDischargingPortName",
      require: true
    }, {
      label: "收货人名称",
      type: "selectTag",
      value: "consigneeCompanyName",
      require: false
    }, {
      label: "收货人简称",
      type: "selectTag",
      value: "consigneeShortName",
      require: false
    }, {
      label: "托运人",
      type: "input",
      value: "consignorCompanyName",
      require: false
    }];
    CarAndTrain = [{
      label: "收货人简称",
      type: "selectTag",
      value: "consigneeShortName",
      require: true
    }, {
      label: "发站",
      type: "search",
      value: "trainSendStationName",
      require: true
    }, {
      label: "到站",
      type: "search",
      value: "trainArriveStationName",
      require: true
    }, {
      label: "托运人",
      type: "input",
      value: "consignorCompanyName",
      require: true
    }, {
      label: "产地",
      type: "input",
      value: "originPlace",
      require: true
    }, {
      label: "发货点",
      type: "input",
      value: "sendGoodsAddress",
      require: true
    }, {
      label: "收货人名称",
      type: "selectTag",
      value: "consigneeCompanyName",
      require: true
    }];
  }

  if (contractTemplate == _constants["default"].contractTemplateDict.STEAM_COAL_005) {
    // 动力煤、005
    temp = [{
      label: "基准价格(元/吨)",
      type: "number",
      min: 0,
      max: 9999.99,
      value: "basePrice",
      require: true
    }, {
      label: "结算类型",
      type: "select",
      value: "settleMode",
      require: true,
      data: (0, _globalCode.filterCodeByKey)("settleModeDict")
    }, {
      label: "运输方式",
      type: "select",
      value: "transportMode",
      require: true,
      data: (0, _globalCode.filterCodeByKey)("transportModeDict" + contractTemplate)
    }, {
      label: "交货期限",
      type: "dateRange",
      value: "deliveryDate",
      require: true
    }, {
      label: "保证金/违约金(元)",
      type: "number",
      min: 0,
      max: 9999999999.99,
      value: "depositAmount",
      require: true
    }, // {
    //     label: '收货人简称',
    //     type: 'selectTag',
    //     value: 'consigneeShortName',
    //     require: true
    // },
    {
      label: "运费支付方式",
      type: "yfzf",
      value: "freightPayMode",
      require: true,
      data: (0, _globalCode.filterCodeByKey)("freightPayTypeDict")
    }, {
      label: "使用资金来源",
      type: "fuwufzf",
      value: "bankProductCode",
      require: true
    }];
    Train = [{
      label: "发站",
      type: "search",
      value: "trainSendStationName",
      require: true
    }, {
      label: "到站",
      type: "search",
      value: "trainArriveStationName",
      require: true
    }, {
      label: "托运人",
      type: "input",
      value: "consignorCompanyName",
      require: true
    }, {
      label: "收货人名称",
      type: "selectTag",
      value: "consigneeCompanyName",
      require: true
    }, {
      label: "收货人简称",
      type: "selectTag",
      value: "consigneeShortName",
      require: true
    }, {
      label: "产地",
      type: "input",
      value: "originPlace",
      require: true
    }];
    Automobile = [{
      label: "发货点",
      type: "input",
      value: "sendGoodsAddress",
      require: true
    }, {
      label: "托运人",
      type: "input",
      value: "consignorCompanyName",
      require: true
    }, {
      label: "收货人名称",
      type: "selectTag",
      value: "consigneeCompanyName",
      require: true
    }, {
      label: "收货人简称",
      type: "selectTag",
      value: "consigneeShortName",
      require: true
    }, {
      label: "产地",
      type: "input",
      value: "originPlace",
      require: true
    }];
    CarAndTrain = [{
      label: "发站",
      type: "search",
      value: "trainSendStationName",
      require: true
    }, {
      label: "到站",
      type: "search",
      value: "trainArriveStationName",
      require: true
    }, {
      label: "托运人",
      type: "input",
      value: "consignorCompanyName",
      require: true
    }, {
      label: "产地",
      type: "input",
      value: "originPlace",
      require: true
    }, {
      label: "发货点",
      type: "input",
      value: "sendGoodsAddress",
      require: true
    }, {
      label: "收货人名称",
      type: "selectTag",
      value: "consigneeCompanyName",
      require: true
    }, {
      label: "收货人简称",
      type: "selectTag",
      value: "consigneeShortName",
      require: true
    }];
  }

  if (contractTemplate == _constants["default"].contractTemplateDict.SEMI_COKE_001 || contractTemplate == _constants["default"].contractTemplateDict.INJECTION_COAL_001 || contractTemplate == _constants["default"].contractTemplateDict.SMOKELESS_COAL_001 || contractTemplate == _constants["default"].contractTemplateDict.COKING_001 || contractTemplate == _constants["default"].contractTemplateDict.COKING_002 || contractTemplate == _constants["default"].contractTemplateDict.COKING_004 || contractTemplate == _constants["default"].contractTemplateDict.COKING_005) {
    // 焦炭001、002、004、005、000  兰炭001   无烟煤001  喷吹煤001
    temp = [{
      label: "基准价格(元/吨)",
      type: "number",
      min: 0,
      max: 9999.99,
      value: "basePrice",
      require: true
    }, {
      label: "结算类型",
      type: "select",
      value: "settleMode",
      require: true,
      data: (0, _globalCode.filterCodeByKey)("settleModeDict")
    }, {
      label: "运输方式",
      type: "select",
      value: "transportMode",
      require: true,
      data: (0, _globalCode.filterCodeByKey)("transportModeDict" + contractTemplate)
    }, {
      label: "交货期限",
      type: "dateRange",
      value: "deliveryDate",
      require: true
    }, {
      label: "运费支付方式",
      type: "yfzf",
      value: "freightPayMode",
      require: true,
      data: (0, _globalCode.filterCodeByKey)("freightPayTypeDict")
    }, {
      label: "使用资金来源",
      type: "fuwufzf",
      value: "bankProductCode",
      require: true
    }, {
      label: "保证金/违约金(元)",
      type: "number",
      min: 0,
      max: 9999999999.99,
      value: "depositAmount",
      require: true
    } // {
    //     label: '产地',
    //     type: 'input',
    //     value: 'originPlace',
    //     require: true
    // },
    // {
    //     label: '交货地',
    //     type: 'selectTag',
    //     value: 'deliveryPlace',
    //     require: true
    // },
    ];
    Train = [{
      label: "发站",
      type: "search",
      value: "trainSendStationName",
      require: true
    }, {
      label: "到站",
      type: "search",
      value: "trainArriveStationName",
      require: true
    }, {
      label: "产地",
      type: "input",
      value: "originPlace",
      require: true
    }, {
      label: "交货地",
      type: "selectTag",
      value: "deliveryPlace",
      require: true
    }, {
      label: "托运人",
      type: "input",
      value: "consignorCompanyName",
      require: true
    }, {
      label: "收货人名称",
      type: "selectTag",
      value: "consigneeCompanyName",
      require: true
    }, {
      label: "收货人简称",
      type: "selectTag",
      value: "consigneeShortName",
      require: true
    }];
    Automobile = [{
      label: "发货点",
      type: "input",
      value: "sendGoodsAddress",
      require: true
    }, {
      label: "产地",
      type: "input",
      value: "originPlace",
      require: true
    }, {
      label: "交货地",
      type: "selectTag",
      value: "deliveryPlace",
      require: true
    }, {
      label: "托运人",
      type: "input",
      value: "consignorCompanyName",
      require: true
    }, {
      label: "收货人名称",
      type: "selectTag",
      value: "consigneeCompanyName",
      require: true
    }, {
      label: "收货人简称",
      type: "selectTag",
      value: "consigneeShortName",
      require: true
    }];
    Ship = [{
      label: "产地",
      type: "input",
      value: "originPlace",
      require: true
    }, {
      label: "交货地",
      type: "selectTag",
      value: "deliveryPlace",
      require: true
    }, {
      label: "卸货地",
      type: "input",
      value: "unloadGoodsPlace",
      require: true
    }, {
      label: "收货人名称",
      type: "selectTag",
      value: "consigneeCompanyName",
      require: true
    }, {
      label: "收货人简称",
      type: "selectTag",
      value: "consigneeShortName",
      require: true
    }];
    CarAndTrain = [{
      label: "发站",
      type: "search",
      value: "trainSendStationName",
      require: true
    }, {
      label: "到站",
      type: "search",
      value: "trainArriveStationName",
      require: true
    }, {
      label: "产地",
      type: "input",
      value: "originPlace",
      require: true
    }, {
      label: "交货地",
      type: "selectTag",
      value: "deliveryPlace",
      require: true
    }, {
      label: "托运人",
      type: "input",
      value: "consignorCompanyName",
      require: true
    }, {
      label: "发货点",
      type: "input",
      value: "sendGoodsAddress",
      require: true
    }, {
      label: "收货人名称",
      type: "selectTag",
      value: "consigneeCompanyName",
      require: true
    }, {
      label: "收货人简称",
      type: "selectTag",
      value: "consigneeShortName",
      require: true
    }];
  }

  if (contractTemplate == _constants["default"].contractTemplateDict.COKING_003 || contractTemplate == _constants["default"].contractTemplateDict.COKING_006) {
    // 焦炭003、006
    temp = [{
      label: "基准价格(元/吨)",
      type: "number",
      min: 0,
      max: 9999.99,
      value: "basePrice",
      require: true
    }, {
      label: "结算类型",
      type: "select",
      value: "settleMode",
      require: true,
      data: (0, _globalCode.filterCodeByKey)("settleModeDict")
    }, {
      label: "运输方式",
      type: "select",
      value: "transportMode",
      require: true,
      data: (0, _globalCode.filterCodeByKey)("transportModeDict" + contractTemplate)
    }, {
      label: "交货期限",
      type: "dateRange",
      value: "deliveryDate",
      require: true
    }, {
      label: "使用资金来源",
      type: "fuwufzf",
      value: "bankProductCode",
      require: true
    } // {
    //     label: '产地',
    //     type: 'input',
    //     value: 'originPlace',
    //     require: true
    // },
    // {
    //     label: '交货地',
    //     type: 'selectTag',
    //     value: 'deliveryPlace',
    //     require: true
    // },
    // {
    //     label: '收货人简称',
    //     type: 'selectTag',
    //     value: 'consigneeShortName',
    //     require: true
    // },
    ];
    Train = [{
      label: "发站",
      type: "search",
      value: "trainSendStationName",
      require: true
    }, {
      label: "到站",
      type: "search",
      value: "trainArriveStationName",
      require: true
    }, {
      label: "产地",
      type: "input",
      value: "originPlace",
      require: true
    }, {
      label: "交货地",
      type: "selectTag",
      value: "deliveryPlace",
      require: true
    }, {
      label: "托运人",
      type: "input",
      value: "consignorCompanyName",
      require: true
    }, {
      label: "收货人名称",
      type: "selectTag",
      value: "consigneeCompanyName",
      require: true
    }, {
      label: "收货人简称",
      type: "selectTag",
      value: "consigneeShortName",
      require: true
    }];
    Automobile = [{
      label: "发货点",
      type: "input",
      value: "sendGoodsAddress",
      require: true
    }, {
      label: "产地",
      type: "input",
      value: "originPlace",
      require: true
    }, {
      label: "交货地",
      type: "selectTag",
      value: "deliveryPlace",
      require: true
    }, {
      label: "托运人",
      type: "input",
      value: "consignorCompanyName",
      require: true
    }, {
      label: "收货人名称",
      type: "selectTag",
      value: "consigneeCompanyName",
      require: true
    }, {
      label: "收货人简称",
      type: "selectTag",
      value: "consigneeShortName",
      require: true
    }];
    Ship = [{
      label: "产地",
      type: "input",
      value: "originPlace",
      require: true
    }, {
      label: "交货地",
      type: "selectTag",
      value: "deliveryPlace",
      require: true
    }, {
      label: "卸货地",
      type: "input",
      value: "unloadGoodsPlace",
      require: true
    }, {
      label: "收货人名称",
      type: "selectTag",
      value: "consigneeCompanyName",
      require: true
    }, {
      label: "收货人简称",
      type: "selectTag",
      value: "consigneeShortName",
      require: true
    }];

    if (!isTransportMode) {
      Ship = [].concat(_toConsumableArray(Ship), [{
        label: "保证金/违约金(元)",
        type: "number",
        min: 0,
        max: 9999999999.99,
        value: "depositAmount",
        require: true
      }]);
    }

    CarAndTrain = [{
      label: "发站",
      type: "search",
      value: "trainSendStationName",
      require: true
    }, {
      label: "到站",
      type: "search",
      value: "trainArriveStationName",
      require: true
    }, {
      label: "产地",
      type: "input",
      value: "originPlace",
      require: true
    }, {
      label: "交货地",
      type: "selectTag",
      value: "deliveryPlace",
      require: true
    }, {
      label: "托运人",
      type: "input",
      value: "consignorCompanyName",
      require: true
    }, {
      label: "发货点",
      type: "input",
      value: "sendGoodsAddress",
      require: true
    }, {
      label: "收货人名称",
      type: "selectTag",
      value: "consigneeCompanyName",
      require: true
    }, {
      label: "收货人简称",
      type: "selectTag",
      value: "consigneeShortName",
      require: true
    }];
  }

  if (contractTemplate == _constants["default"].contractTemplateDict.COKING_COAL_001 || contractTemplate == _constants["default"].contractTemplateDict.COKING_COAL_003) {
    // 焦煤001、003
    temp = [{
      label: "基准价格(元/吨)",
      type: "number",
      min: 0,
      max: 9999.99,
      value: "basePrice",
      require: true
    }, {
      label: "结算类型",
      type: "select",
      value: "settleMode",
      require: true,
      data: (0, _globalCode.filterCodeByKey)("settleModeDict")
    }, {
      label: "运输方式",
      type: "select",
      value: "transportMode",
      require: true,
      data: (0, _globalCode.filterCodeByKey)("transportModeDict" + contractTemplate)
    }, {
      label: "交货期限",
      type: "dateRange",
      value: "deliveryDate",
      require: true
    }, {
      label: "保证金/违约金(元)",
      type: "number",
      min: 0,
      max: 9999999999.99,
      value: "depositAmount",
      require: true
    }, {
      label: "产地",
      type: "input",
      value: "originPlace",
      require: true
    }, // {
    //     label: '交货地',
    //     type: 'selectTag',
    //     value: 'deliveryPlace',
    //     require: true
    // },
    {
      label: "收货人简称",
      type: "selectTag",
      value: "consigneeShortName",
      require: true
    }, {
      label: "运费支付方式",
      type: "yfzf",
      value: "freightPayMode",
      require: true,
      data: (0, _globalCode.filterCodeByKey)("freightPayTypeDict")
    }, {
      label: "使用资金来源",
      type: "fuwufzf",
      value: "bankProductCode",
      require: true
    }];
    Train = [{
      label: "交货地",
      type: "selectTag",
      value: "deliveryPlace",
      require: true
    }, {
      label: "发站",
      type: "search",
      value: "trainSendStationName",
      require: true
    }, {
      label: "到站",
      type: "search",
      value: "trainArriveStationName",
      require: true
    }, {
      label: "托运人",
      type: "input",
      value: "consignorCompanyName",
      require: true
    }, {
      label: "收货人名称",
      type: "selectTag",
      value: "consigneeCompanyName",
      require: true
    }];
    Automobile = [{
      label: "交货地",
      type: "selectTag",
      value: "deliveryPlace",
      require: true
    }, {
      label: "发货点",
      type: "input",
      value: "sendGoodsAddress",
      require: true
    }, {
      label: "托运人",
      type: "input",
      value: "consignorCompanyName",
      require: true
    }, {
      label: "收货人名称",
      type: "selectTag",
      value: "consigneeCompanyName",
      require: true
    }];
    Ship = [{
      label: "交货地",
      type: "selectTag",
      value: "deliveryPlace",
      require: true
    }, {
      label: "卸货地",
      type: "input",
      value: "unloadGoodsPlace",
      require: true
    }, {
      label: "收货人名称",
      type: "selectTag",
      value: "consigneeCompanyName",
      require: true
    }];
    CarAndTrain = [{
      label: "交货地",
      type: "selectTag",
      value: "deliveryPlace",
      require: true
    }, {
      label: "发货点",
      type: "input",
      value: "sendGoodsAddress",
      require: true
    }, {
      label: "发站",
      type: "search",
      value: "trainSendStationName",
      require: true
    }, {
      label: "到站",
      type: "search",
      value: "trainArriveStationName",
      require: true
    }, {
      label: "托运人",
      type: "input",
      value: "consignorCompanyName",
      require: true
    }, {
      label: "收货人",
      type: "selectTag",
      value: "consigneeCompanyName",
      require: true
    }];
  } else if (contractTemplate == _constants["default"].contractTemplateDict.COKING_COAL_000 || contractTemplate == _constants["default"].contractTemplateDict.SEMI_COKE_000 || contractTemplate == _constants["default"].contractTemplateDict.COKING_000) {
    temp = [{
      label: "基准价格(元/吨)",
      type: "number",
      min: 0,
      max: 9999.99,
      value: "basePrice",
      require: true
    }, {
      label: "结算类型",
      type: "select",
      value: "settleMode",
      require: true,
      data: (0, _globalCode.filterCodeByKey)("settleModeDict")
    }, {
      label: "运输方式",
      type: "select",
      value: "transportMode",
      require: true,
      data: (0, _globalCode.filterCodeByKey)("transportModeDict" + contractTemplate)
    }, {
      label: "交货期限",
      type: "dateRange",
      value: "deliveryDate",
      require: true
    }, {
      label: "运输负责方",
      type: "select",
      value: "transportResponsibility",
      require: true,
      data: _constants["default"].transportResponsibilityList
    }, {
      label: "请输入运输负责方",
      type: "input",
      value: "transportResponsibilityOther",
      maxLength: 50,
      require: true
    }, {
      label: "运费支付方式",
      type: "yfzf",
      value: "freightPayMode",
      require: true,
      data: (0, _globalCode.filterCodeByKey)("freightPayTypeDict")
    }, {
      label: "使用资金来源",
      type: "fuwufzf",
      value: "bankProductCode",
      require: true
    }, {
      label: "保证金/违约金(元)",
      type: "number",
      min: 0,
      max: 9999999999.99,
      value: "depositAmount",
      require: true
    }, {
      label: "交提货地点",
      type: "input",
      value: "deliveryPickUpPlace",
      maxLength: 50,
      require: true
    }];
    Train = [{
      label: "发站",
      type: "search",
      value: "trainSendStationName",
      require: true
    }, {
      label: "到站",
      type: "search",
      value: "trainArriveStationName",
      require: true
    }, {
      label: "托运人",
      type: "input",
      value: "consignorCompanyName",
      require: true
    }, {
      label: "收货人名称",
      type: "selectTag",
      value: "consigneeCompanyName",
      require: true
    }];
    Automobile = [{
      label: "发货点",
      type: "input",
      value: "sendGoodsAddress",
      require: true
    }, {
      label: "发货人名称",
      type: "input",
      value: "consignorCompanyName",
      require: true
    }, {
      label: "收货人名称",
      type: "selectTag",
      value: "consigneeCompanyName",
      require: true
    }, {
      label: "矿点",
      type: "input",
      value: "originPlace",
      require: true
    }];
    Ship = [{
      label: "装货港",
      type: "selectTag",
      value: "shipLoadingPortName",
      require: true
    }, {
      label: "卸货港",
      type: "selectTag",
      value: "shipDischargingPortName",
      require: true
    }, {
      label: "托运人",
      type: "input",
      value: "consignorCompanyName",
      require: true
    }, {
      label: "收货人名称",
      type: "selectTag",
      value: "consigneeCompanyName",
      require: true
    }];
    CarAndTrain = [{
      label: "发货点",
      type: "input",
      value: "sendGoodsAddress",
      require: true
    }, {
      label: "矿点",
      type: "input",
      value: "originPlace",
      require: true
    }, {
      label: "发站",
      type: "search",
      value: "trainSendStationName",
      require: true
    }, {
      label: "到站",
      type: "search",
      value: "trainArriveStationName",
      require: true
    }, {
      label: "托运人",
      type: "input",
      value: "consignorCompanyName",
      require: true
    }, {
      label: "收货人名称",
      type: "selectTag",
      value: "consigneeCompanyName",
      require: true
    }];
  }

  if (contractTemplate == _constants["default"].contractTemplateDict.COKING_COAL_004) {
    // 焦煤004
    temp = [{
      label: "基准价格(元/吨)",
      type: "number",
      min: 0,
      max: 9999.99,
      value: "basePrice",
      require: true
    }, {
      label: "结算类型",
      type: "select",
      value: "settleMode",
      require: true,
      data: (0, _globalCode.filterCodeByKey)("settleModeDict")
    }, {
      label: "运输方式",
      type: "select",
      value: "transportMode",
      require: true,
      data: (0, _globalCode.filterCodeByKey)("transportModeDict" + contractTemplate)
    }, {
      label: "交货期限",
      type: "dateRange",
      value: "deliveryDate",
      require: true
    }, {
      label: "产地",
      type: "input",
      value: "originPlace",
      require: true
    }, // {
    //     label: '船名',
    //     type: 'input',
    //     value: 'shipName',
    //     require: true
    // },
    // {
    //     label: '交货地',
    //     type: 'selectTag',
    //     value: 'deliveryPlace',
    //     require: true
    // },
    {
      label: "使用资金来源",
      type: "fuwufzf",
      value: "bankProductCode",
      require: true
    }];
    Ship = [{
      label: "船名",
      type: "input",
      value: "shipName",
      require: true
    }, {
      label: "交货地",
      type: "selectTag",
      value: "deliveryPlace",
      require: true
    }];
  }

  if (contractTemplate == _constants["default"].contractTemplateDict.OFFLINE) {
    // 线下合同模板
    temp = [{
      label: "基准价格(元/吨)",
      type: "number",
      min: 0,
      max: 9999.99,
      value: "basePrice",
      require: true
    }, {
      label: "结算类型",
      type: "select",
      value: "settleMode",
      require: true,
      data: (0, _globalCode.filterCodeByKey)("settleModeDict")
    }, {
      label: "运输方式",
      type: "select",
      value: "transportMode",
      require: true,
      data: (0, _globalCode.filterCodeByKey)("transportModeDict" + contractTemplate)
    }, {
      label: "交货期限",
      type: "dateRange",
      value: "deliveryDate",
      require: true
    }];
    Train = [{
      label: "发站",
      type: "search",
      value: "trainSendStationName",
      require: true
    }, {
      label: "到站",
      type: "search",
      value: "trainArriveStationName",
      require: true
    }, {
      label: "托运人",
      type: "input",
      value: "consignorCompanyName",
      require: true
    }, {
      label: "收货人名称",
      type: "xianxia_BI_SHR",
      value: "terminalCompanyId",
      require: true
    }];
    Automobile = [{
      label: "发货点",
      type: "input",
      value: "sendGoodsAddress",
      require: true
    }, {
      label: "托运人",
      type: "input",
      value: "consignorCompanyName",
      require: true
    }, {
      label: "收货人名称",
      type: "xianxia_BI_SHR",
      value: "terminalCompanyId",
      require: true
    }];
    CarAndTrain = [{
      label: "发站",
      type: "search",
      value: "trainSendStationName",
      require: true
    }, {
      label: "到站",
      type: "search",
      value: "trainArriveStationName",
      require: true
    }, {
      label: "发货点",
      type: "input",
      value: "sendGoodsAddress",
      require: true
    }, {
      label: "托运人",
      type: "input",
      value: "consignorCompanyName",
      require: true
    }, {
      label: "收货人名称",
      type: "xianxia_BI_SHR",
      value: "terminalCompanyId",
      require: true
    }];
    Ship = [{
      label: "装货港",
      type: "selectTag",
      value: "shipLoadingPortName",
      require: true
    }, {
      label: "卸货港",
      type: "selectTag",
      value: "shipDischargingPortName",
      require: true
    }, {
      label: "收货人名称",
      type: "xianxia_BI_SHR",
      value: "terminalCompanyId",
      require: true
    }, {
      label: "托运人",
      type: "input",
      value: "consignorCompanyName",
      require: false
    }];
  }

  if (contractTemplate == _constants["default"].contractTemplateDict.STEAM_COAL_006) {
    // 动力煤006(和辉与铁投专用)
    temp = [{
      label: "基准价格(元/吨)",
      type: "number",
      min: 0,
      max: 9999.99,
      value: "basePrice",
      require: true
    }, {
      label: "结算类型",
      type: "select",
      value: "settleMode",
      require: true,
      data: (0, _globalCode.filterCodeByKey)("settleModeDict")
    }, {
      label: "运输方式",
      type: "select",
      value: "transportMode",
      require: true,
      data: (0, _globalCode.filterCodeByKey)("transportModeDict" + contractTemplate)
    }, {
      label: "交货期限",
      type: "dateRange",
      value: "deliveryDate",
      require: true
    }, {
      label: "使用资金来源",
      type: "fuwufzf",
      value: "bankProductCode",
      require: true
    }, {
      label: "保证金/违约金(元)",
      type: "number",
      min: 0,
      max: 9999999999.99,
      value: "depositAmount",
      require: true
    }, {
      label: "运费支付方式",
      type: "yfzf",
      value: "freightPayMode",
      require: true,
      data: (0, _globalCode.filterCodeByKey)("freightPayTypeDict")
    }];
    Ship = [{
      label: "装货港",
      type: "selectTag",
      value: "shipLoadingPortName",
      require: true
    }, {
      label: "卸货港",
      type: "selectTag",
      value: "shipDischargingPortName",
      require: true
    }, {
      label: "托运人",
      type: "input",
      value: "consignorCompanyName",
      require: true
    }, {
      label: "收货人",
      type: "selectTag",
      value: "consigneeCompanyName",
      require: true
    }];
  }

  if (contractTemplate == _constants["default"].contractTemplateDict.STEAM_COAL_007) {
    // 动力煤合同模板007(晋和与铁投专用)
    temp = [{
      label: "基准价格(元/吨)",
      type: "number",
      min: 0,
      max: 9999.99,
      value: "basePrice",
      require: true
    }, {
      label: "结算类型",
      type: "select",
      value: "settleMode",
      require: true,
      data: (0, _globalCode.filterCodeByKey)("settleModeDict")
    }, {
      label: "运输方式",
      type: "select",
      value: "transportMode",
      require: true,
      data: (0, _globalCode.filterCodeByKey)("transportModeDict" + contractTemplate)
    }, {
      label: "交货期限",
      type: "dateRange",
      value: "deliveryDate",
      require: true
    }, {
      label: "使用资金来源",
      type: "fuwufzf",
      value: "bankProductCode",
      require: true
    }, {
      label: "保证金/违约金(元)",
      type: "number",
      min: 0,
      max: 9999999999.99,
      value: "depositAmount",
      require: true
    }, {
      label: "运费支付方式",
      type: "yfzf",
      value: "freightPayMode",
      require: true,
      data: (0, _globalCode.filterCodeByKey)("freightPayTypeDict")
    }];
    Ship = [{
      label: "装货港",
      type: "selectTag",
      value: "shipLoadingPortName",
      require: true
    }, {
      label: "卸货港",
      type: "selectTag",
      value: "shipDischargingPortName",
      require: true
    }, {
      label: "托运人",
      type: "input",
      value: "consignorCompanyName",
      require: true
    }, {
      label: "收货人",
      type: "selectTag",
      value: "consigneeCompanyName",
      require: true
    }];
    Train = [{
      label: "发站",
      type: "search",
      value: "trainSendStationName",
      require: true
    }, {
      label: "到站",
      type: "search",
      value: "trainArriveStationName",
      require: true
    }, {
      label: "托运人",
      type: "input",
      value: "consignorCompanyName",
      require: true
    }, {
      label: "收货人",
      type: "selectTag",
      value: "consigneeCompanyName",
      require: true
    }];
  }

  if (contractTemplate == _constants["default"].contractTemplateDict.COKING_007) {
    // 焦炭合同模板007(泰佳翔与铁投专用)
    temp = [{
      label: "基准价格(元/吨)",
      type: "number",
      min: 0,
      max: 9999.99,
      value: "basePrice",
      require: true
    }, {
      label: "结算类型",
      type: "select",
      value: "settleMode",
      require: true,
      data: (0, _globalCode.filterCodeByKey)("settleModeDict")
    }, {
      label: "运输方式",
      type: "select",
      value: "transportMode",
      require: true,
      data: (0, _globalCode.filterCodeByKey)("transportModeDict" + contractTemplate)
    }, {
      label: "交货期限",
      type: "dateRange",
      value: "deliveryDate",
      require: true
    }, {
      label: "使用资金来源",
      type: "fuwufzf",
      value: "bankProductCode",
      require: true
    }, {
      label: "保证金/违约金(元)",
      type: "number",
      min: 0,
      max: 9999999999.99,
      value: "depositAmount",
      require: true
    }, {
      label: "运费支付方式",
      type: "yfzf",
      value: "freightPayMode",
      require: true,
      data: (0, _globalCode.filterCodeByKey)("freightPayTypeDict")
    }];
    Ship = [{
      label: "装货港",
      type: "selectTag",
      value: "shipLoadingPortName",
      require: true
    }, {
      label: "卸货港",
      type: "selectTag",
      value: "shipDischargingPortName",
      require: true
    }, {
      label: "托运人",
      type: "input",
      value: "consignorCompanyName",
      require: true
    }, {
      label: "收货人",
      type: "selectTag",
      value: "consigneeCompanyName",
      require: true
    }, {
      label: "运输负责人",
      type: "input",
      value: "transportDirector",
      require: true
    }];
    Train = [{
      label: "发站",
      type: "search",
      value: "trainSendStationName",
      require: true
    }, {
      label: "到站",
      type: "search",
      value: "trainArriveStationName",
      require: true
    }, {
      label: "托运人",
      type: "input",
      value: "consignorCompanyName",
      require: true
    }, {
      label: "收货人",
      type: "selectTag",
      value: "consigneeCompanyName",
      require: true
    }];
    Automobile = [{
      label: "装货地",
      type: "selectTag",
      value: "deliveryPlace",
      require: true
    }, {
      label: "卸货地",
      type: "input",
      value: "unloadGoodsPlace",
      require: true
    }, {
      label: "发货人",
      type: "input",
      value: "consignorCompanyName",
      require: true
    }, {
      label: "收货人",
      type: "selectTag",
      value: "consigneeCompanyName",
      require: true
    }, {
      label: "运输负责人",
      type: "input",
      value: "transportDirector",
      require: true
    }];
  }

  if (contractTemplate == _constants["default"].contractTemplateDict.STEAM_COAL_008) {
    // 动力煤合同模板008
    temp = [{
      label: "基准价格(元/吨)",
      type: "number",
      min: 0,
      max: 9999.99,
      value: "basePrice",
      require: true
    }, {
      label: "结算类型",
      type: "select",
      value: "settleMode",
      require: true,
      data: (0, _globalCode.filterCodeByKey)("settleModeDict")
    }, {
      label: "运输方式",
      type: "select",
      value: "transportMode",
      require: true,
      data: (0, _globalCode.filterCodeByKey)("transportModeDict" + contractTemplate)
    }, {
      label: "交货期限",
      type: "dateRange",
      value: "deliveryDate",
      require: true
    }, {
      label: "使用资金来源",
      type: "fuwufzf",
      value: "bankProductCode",
      require: true
    }, {
      label: "保证金/违约金(元)",
      type: "number",
      min: 0,
      max: 9999999999.99,
      value: "depositAmount",
      require: true
    }, {
      label: "运费支付方式",
      type: "yfzf",
      value: "freightPayMode",
      require: true,
      data: (0, _globalCode.filterCodeByKey)("freightPayTypeDict")
    }];
    Ship = [{
      label: "装货港",
      type: "selectTag",
      value: "shipLoadingPortName",
      require: true
    }, {
      label: "卸货港",
      type: "selectTag",
      value: "shipDischargingPortName",
      require: true
    }, {
      label: "托运人",
      type: "input",
      value: "consignorCompanyName",
      require: true
    }, {
      label: "收货人",
      type: "selectTag",
      value: "consigneeCompanyName",
      require: true
    }];
    Train = [{
      label: "收货人简称",
      type: "selectTag",
      value: "consigneeShortName",
      require: true
    }, {
      label: "发站",
      type: "search",
      value: "trainSendStationName",
      require: true
    }, {
      label: "到站",
      type: "search",
      value: "trainArriveStationName",
      require: true
    }, {
      label: "托运人",
      type: "input",
      value: "consignorCompanyName",
      require: true
    }, {
      label: "收货人",
      type: "selectTag",
      value: "consigneeCompanyName",
      require: true
    }];
    Automobile = [{
      label: "发货点",
      type: "input",
      value: "sendGoodsAddress",
      require: true
    }, {
      label: "发货人名称",
      type: "input",
      value: "consignorCompanyName",
      require: true
    }, {
      label: "收货人",
      type: "selectTag",
      value: "consigneeCompanyName",
      require: true
    }, {
      label: "矿点",
      type: "input",
      value: "originPlace",
      require: true
    }];
    CarAndTrain = [{
      label: "发站",
      type: "search",
      value: "trainSendStationName",
      require: true
    }, {
      label: "到站",
      type: "search",
      value: "trainArriveStationName",
      require: true
    }, {
      label: "托运人",
      type: "input",
      value: "consignorCompanyName",
      require: true
    }, {
      label: "收货人名称",
      type: "selectTag",
      value: "consigneeCompanyName",
      require: true
    }, {
      label: "发货点",
      type: "input",
      value: "sendGoodsAddress",
      require: true
    }, {
      label: "矿点",
      type: "input",
      value: "originPlace",
      require: true
    }];
  }

  if (contractTemplate == _constants["default"].contractTemplateDict.STEAM_COAL_009 || contractTemplate == _constants["default"].contractTemplateDict.STEAM_COAL_010) {
    // 动力煤合同模板009 010
    temp = [{
      label: "基准价格(元/吨)",
      type: "number",
      min: 0,
      max: 9999.99,
      value: "basePrice",
      require: true
    }, {
      label: "结算类型",
      type: "select",
      value: "settleMode",
      require: true,
      data: (0, _globalCode.filterCodeByKey)("settleModeDict")
    }, {
      label: "运输方式",
      type: "select",
      value: "transportMode",
      require: true,
      data: (0, _globalCode.filterCodeByKey)("transportModeDict" + contractTemplate)
    }, {
      label: "交货期限",
      type: "dateRange",
      value: "deliveryDate",
      require: true
    }, {
      label: "使用资金来源",
      type: "fuwufzf",
      value: "bankProductCode",
      require: true
    }];
    Ship = [{
      label: "装货港",
      type: "selectTag",
      value: "shipLoadingPortName",
      require: true
    }, {
      label: "卸货港",
      type: "selectTag",
      value: "shipDischargingPortName",
      require: true
    }, {
      label: "托运人",
      type: "input",
      value: "consignorCompanyName",
      require: true
    }, {
      label: "收货人",
      type: "selectTag",
      value: "consigneeCompanyName",
      require: true
    }];
  }

  if (contractTemplate == _constants["default"].contractTemplateDict.STEAM_COAL_1001) {
    // 动力煤合同模板1001(销售)
    temp = [{
      label: "基准价格(元/吨)",
      type: "number",
      min: 0,
      max: 9999.99,
      value: "basePrice",
      require: true
    }, {
      label: "结算类型",
      type: "select",
      value: "settleMode",
      require: true,
      data: (0, _globalCode.filterCodeByKey)("settleModeDict")
    }, {
      label: "运输方式",
      type: "select",
      value: "transportMode",
      require: true,
      data: (0, _globalCode.filterCodeByKey)("transportModeDict" + contractTemplate)
    }, {
      label: "交货期限",
      type: "dateRange",
      value: "deliveryDate",
      require: true
    }, {
      label: "使用资金来源",
      type: "fuwufzf",
      value: "bankProductCode",
      require: true
    }];
    Automobile = [{
      label: "装货地",
      type: "selectTag",
      value: "deliveryPlace",
      require: true
    }, {
      label: "卸货地",
      type: "input",
      value: "unloadGoodsPlace",
      require: true
    }, {
      label: "发货人",
      type: "input",
      value: "consignorCompanyName",
      require: true
    }, {
      label: "收货人",
      type: "selectTag",
      value: "consigneeCompanyName",
      require: true
    }, {
      label: "仓储中转地",
      type: "input",
      value: "warehouseTransferArea",
      require: true
    }];
    Train = [{
      label: "发站",
      type: "search",
      value: "trainSendStationName",
      require: true
    }, {
      label: "到站",
      type: "search",
      value: "trainArriveStationName",
      require: true
    }, {
      label: "托运人",
      type: "input",
      value: "consignorCompanyName",
      require: true
    }, {
      label: "收货人",
      type: "selectTag",
      value: "consigneeCompanyName",
      require: true
    }, {
      label: "仓储中转地",
      type: "input",
      value: "warehouseTransferArea",
      require: true
    }];
    Ship = [{
      label: "装货港",
      type: "selectTag",
      value: "shipLoadingPortName",
      require: true
    }, {
      label: "卸货港",
      type: "selectTag",
      value: "shipDischargingPortName",
      require: true
    }, {
      label: "托运人",
      type: "input",
      value: "consignorCompanyName",
      require: true
    }, {
      label: "收货人名称",
      type: "selectTag",
      value: "consigneeCompanyName",
      require: true
    }, {
      label: "仓储中转地",
      type: "input",
      value: "warehouseTransferArea",
      require: true
    }];
  } //筛选不展示的项


  if (!selectOther.transportResponsibilityOther) {
    temp = temp.filter(function (item) {
      return item.value != "transportResponsibilityOther";
    });
  }

  if (data == _constants["default"].transportModeDict.TRAIN) {
    result = temp.concat(Train);
  } else if (data == _constants["default"].transportModeDict.AUTOMOBILE) {
    result = temp.concat(Automobile);
  } else if (data == _constants["default"].transportModeDict.SHIP) {
    result = temp.concat(Ship);
  } else if (data == _constants["default"].transportModeDict.AUTOMOBILE_AND_TRAIN) {
    result = temp.concat(CarAndTrain);
  } else {
    result = temp;
  }

  if (isTransportMode) {
    var _transportFormField;

    var transportFormField = (_transportFormField = {}, _defineProperty(_transportFormField, _constants["default"].transportModeDict.TRAIN, Train), _defineProperty(_transportFormField, _constants["default"].transportModeDict.AUTOMOBILE, Automobile), _defineProperty(_transportFormField, _constants["default"].transportModeDict.SHIP, Ship), _defineProperty(_transportFormField, _constants["default"].transportModeDict.AUTOMOBILE_AND_TRAIN, CarAndTrain), _transportFormField);
    var otherFormField = temp;
    return {
      transportFormField: transportFormField[data],
      otherFormField: otherFormField
    };
  } // 动力煤004、005、焦炭004 005 006 去掉运费支付方式


  if (contractTemplate == _constants["default"].contractTemplateDict.STEAM_COAL_004 || contractTemplate == _constants["default"].contractTemplateDict.STEAM_COAL_005 || contractTemplate == _constants["default"].contractTemplateDict.COKING_004 || contractTemplate == _constants["default"].contractTemplateDict.COKING_005 || contractTemplate == _constants["default"].contractTemplateDict.COKING_006) {
    result = result.filter(function (item) {
      return item.type !== 'yfzf';
    });
  }

  return result;
} // 对应创建订单(底部)


function getOtherInfoData1(contractTemplate) {
  var otherInfo = {
    qualityIndexHtmlStr: false,
    //基准质量指标 动力煤1001特有
    qualityExamineWayHtmlStr: true,
    //质量和数量验收标准及方法
    makePriceWayHtmlStr: true,
    //合同定价办法
    settleWayHtmlStr: true,
    //结算付款方式
    otherAppointHtmlStr: true,
    //其他约定
    commitmentHtmlStr: true,
    //承诺函信息
    goodsPayMethod: false,
    //贷款支付方式 COKING_007焦炭007才有
    downstreamSignHtmlStr: true,
    ////下游签约信息描述  downstreamSignCompanyName下游直接签约企业downstreamSignCompanyName shipTransportCompanyName运输公司 shipTransportProtocolNo运输协议编号
    //销售订单仓押独有-- 承诺函-第一条款 downstreamSignCompanyName上游直接签约企业
    contactform: true,
    huozhi: false,
    // 货值计算模块暂时隐藏不使用
    customHtmlStr: false,
    //动力煤000（其他类型）
    customCount: true,
    downstreamOtherAppointHtml: false // 销售订单仓押独有-- 承诺函-其他事项

  };

  if (BUY_PRESSURE_LIST.includes(contractTemplate)) {
    // 采购订单-仓押,质量和数量验收、合同价格、结算及付款方式、其他约定、联系人信息
    otherInfo.commitmentHtmlStr = false;
    otherInfo.downstreamSignHtmlStr = false;
  }

  if (SELL_PRESSURE_LIST.includes(contractTemplate) || SELL_PURCHASE_LIST.includes(contractTemplate)) {
    //销售订单-仓押、代采,质量和数量验收、合同价格、结算及付款方式、其他约定、承诺函信息,承诺函-第一条款，承诺函-其他事项，联系人信息
    otherInfo.downstreamOtherAppointHtml = true;
  }

  if (contractTemplate == _constants["default"].contractTemplateDict.STEAM_COAL_003 || contractTemplate == _constants["default"].contractTemplateDict.COKING_003 || contractTemplate == _constants["default"].contractTemplateDict.COKING_006) {
    otherInfo.qualityExamineWayHtmlStr = false;
    otherInfo.otherAppointHtmlStr = false;
    otherInfo.commitmentHtmlStr = false;
    otherInfo.downstreamSignHtmlStr = false;
    otherInfo.contactform = false;
  }

  if (contractTemplate == _constants["default"].contractTemplateDict.COKING_COAL_003) {
    otherInfo.qualityExamineWayHtmlStr = false;
    otherInfo.contactform = false;
    otherInfo.otherAppointHtmlStr = false;
    otherInfo.commitmentHtmlStr = false;
    otherInfo.downstreamSignHtmlStr = false;
  }

  if (contractTemplate == _constants["default"].contractTemplateDict.STEAM_COAL_006 || contractTemplate == _constants["default"].contractTemplateDict.STEAM_COAL_007) {
    //动力煤合同模板006(和辉与铁投专用)\ 动力煤合同模板007(晋和与铁投专用 没有承诺函和下游
    otherInfo.commitmentHtmlStr = false;
    otherInfo.downstreamSignHtmlStr = false;
  }

  if (contractTemplate == _constants["default"].contractTemplateDict.COKING_007) {
    //焦炭合同模板007(泰佳翔与铁投专用)
    otherInfo.makePriceWayHtmlStr = false;
    otherInfo.settleWayHtmlStr = false;
    otherInfo.commitmentHtmlStr = false;
    otherInfo.downstreamSignHtmlStr = false;
    otherInfo.contactform = false;
    otherInfo.goodsPayMethod = true;
  }

  if (contractTemplate == _constants["default"].contractTemplateDict.COKING_COAL_004) {
    //焦煤合同模板004
    otherInfo.qualityExamineWayHtmlStr = false;
    otherInfo.makePriceWayHtmlStr = false;
    otherInfo.settleWayHtmlStr = false;
    otherInfo.otherAppointHtmlStr = false;
    otherInfo.commitmentHtmlStr = false;
    otherInfo.downstreamSignHtmlStr = false;
    otherInfo.contactform = true;
    otherInfo.contractDeliverDateHtmlStr = true;
    otherInfo.measureStandardHtmlStr = true;
    otherInfo.deliverPosAndTransportFeeHtmlStr = true;
    otherInfo.loanSettlementAndPaymentHtmlStr = true;
  }

  if (contractTemplate == _constants["default"].contractTemplateDict.STEAM_COAL_008) {
    //动力煤合同模板008
    otherInfo.qualityExamineWayHtmlStr = false;
    otherInfo.settleWayHtmlStr = false;
    otherInfo.otherAppointHtmlStr = false;
    otherInfo.commitmentHtmlStr = false;
    otherInfo.downstreamSignHtmlStr = false;
    otherInfo.contactform = false;
  }

  if (contractTemplate == _constants["default"].contractTemplateDict.STEAM_COAL_009) {
    //动力煤合同模板009
    otherInfo.otherAppointHtmlStr = false;
    otherInfo.commitmentHtmlStr = false;
    otherInfo.downstreamSignHtmlStr = false;
  }

  if (contractTemplate == _constants["default"].contractTemplateDict.STEAM_COAL_010) {
    //动力煤合同模板010
    otherInfo.qualityExamineWayHtmlStr = true;
    otherInfo.settleWayHtmlStr = true;
    otherInfo.otherAppointHtmlStr = false;
    otherInfo.commitmentHtmlStr = false;
    otherInfo.downstreamSignHtmlStr = false;
    otherInfo.contactform = false;
    otherInfo.transRiskHtmlStr = true;
    otherInfo.rightDutyHtmlStr = true;
    otherInfo.forceMajeureHtmlStr = true;
    otherInfo.disputeResolutionHtmlStr = true;
  }

  if (contractTemplate == _constants["default"].contractTemplateDict.STEAM_COAL_012) {
    //动力煤000（其他类型）012
    otherInfo.qualityExamineWayHtmlStr = false;
    otherInfo.makePriceWayHtmlStr = false;
    otherInfo.settleWayHtmlStr = false;
    otherInfo.otherAppointHtmlStr = false;
    otherInfo.commitmentHtmlStr = false;
    otherInfo.downstreamSignHtmlStr = false;
    otherInfo.contactform = false;
    otherInfo.customHtmlStr = true;
  } else if (contractTemplate == _constants["default"].contractTemplateDict.COKING_000 || contractTemplate == _constants["default"].contractTemplateDict.COKING_COAL_000 || contractTemplate == _constants["default"].contractTemplateDict.SEMI_COKE_000) {
    ///焦炭000（通用）/焦煤000（通用）/兰炭000（通用）
    otherInfo.qualityExamineWayHtmlStr = false;
    otherInfo.makePriceWayHtmlStr = false;
    otherInfo.settleWayHtmlStr = false;
    otherInfo.otherAppointHtmlStr = false;
    otherInfo.commitmentHtmlStr = false;
    otherInfo.downstreamSignHtmlStr = false;
    otherInfo.contactform = false;
    otherInfo.customHtmlStr = true;
  }

  if (contractTemplate == _constants["default"].contractTemplateDict.STEAM_COAL_1001) {
    //动力煤合同模板1001--基准质量指标、质量和数量验收标准及方法、合同价格、结算方式、其他事项
    otherInfo.qualityIndexHtmlStr = true;
    otherInfo.commitmentHtmlStr = false;
    otherInfo.downstreamSignHtmlStr = false;
    otherInfo.contactform = false;
  }

  if (contractTemplate == _constants["default"].contractTemplateDict.STEAM_COAL_011) {
    //动力煤合同模板011--没有承诺函和下游信息描述
    otherInfo.commitmentHtmlStr = false;
    otherInfo.downstreamSignHtmlStr = false;
  }

  return otherInfo;
} // 对应订单详情页


function getBaseInfoData4(data, resultDetail) {
  var result = [];
  result = getBaseInfoData1(data, resultDetail.type, resultDetail.contractTemplate);
  return result;
} // 对应结算单-品质奖罚
// int是否为整数， decimal小数点后几位， negative是否允许负数， errorStr校验错误提示（奖罚校验小数点），errorRangeStr奖罚数值范围校验错误提示，requireText必填错误提示


function getBaseInfoData8(coalType) {
  var result = [];

  if (coalType == _constants["default"].coalTypeDict.STEAM_COAL) {
    result = [// {
    //   label: "合同基准热值(kcal/kg)",
    //   type: "range",
    //   first_value: "basicHeatingValMin",
    //   last_value: "basicHeatingValMax",
    //   firstData: "",
    //   int: false,
    //   first: {},
    //   placeholder: "",
    //   lastData: "",
    //   last: {},
    //   errorStr: "",
    //   disabled: true,
    //   require: "",
    //   requireText: "",
    // },
    // {
    //   data: "",
    //   label: "合同基准硫分(%)",
    //   type: "number",
    //   value: "basicSulfurContent",
    //   int: false,
    //   min: "",
    //   max: "",
    //   placeholder: "",
    //   errorStr: "",
    //   disabled: true,
    //   require: "",
    //   requireText: "",
    // },
    // {
    //   label: "合同基准挥发分(%)",
    //   type: "range",
    //   first_value: "basicVolatileContentMin",
    //   last_value: "basicVolatileContentMax",
    //   firstData: "",
    //   int: false,
    //   first: {},
    //   placeholder: "",
    //   lastData: "",
    //   last: {},
    //   errorStr: "",
    //   disabled: true,
    //   require: "",
    //   requireText: "",
    // },
    // {
    //   data: "",
    //   label: "合同基准水分(%)",
    //   type: "number",
    //   value: "basicWaterContent",
    //   int: true,
    //   min: "",
    //   max: "",
    //   placeholder: "",
    //   errorStr: "",
    //   disabled: true,
    //   require: "",
    //   requireText: "",
    // },
    {
      data: "",
      label: "本次结算热值(kcal/kg)",
      type: "number",
      value: "realHeatingVal",
      "int": false,
      // 是否是整数
      decimal: "2",
      // 小数点后几位
      negative: false,
      // 是否允许负数
      min: "1000",
      max: "7500",
      placeholder: "请输入1000-7500之间的值，支持输入最多两位小数",
      errorStr: "请输入1000-7500之间的数字，最多两位小数",
      disabled: false,
      require: false,
      requireText: "请输入1000-7500之间的数字，最多两位小数"
    }, {
      data: "",
      label: "本次结算硫分(%)",
      type: "number",
      value: "realSulfurContent",
      "int": false,
      decimal: 2,
      negative: false,
      min: "0",
      max: "10",
      placeholder: "请输入0-10之间的值",
      errorStr: "请填写0到10间的数字，最多两位小数",
      disabled: false,
      require: true,
      requireText: "结算硫分必填，请填写"
    }, {
      data: "",
      label: "本次结算挥发分(%)",
      type: "number",
      value: "realVolatileContent",
      "int": false,
      decimal: 2,
      negative: false,
      min: "0",
      max: "60",
      placeholder: "请输入0-60之间的值",
      errorStr: "请填写0到60间的数字，最多两位小数",
      disabled: false,
      require: true,
      requireText: "结算挥发分必填，请填写"
    }, {
      data: "",
      label: "本次结算水分(%)",
      type: "number",
      value: "realWaterContent",
      "int": false,
      decimal: 2,
      negative: false,
      min: "0",
      max: "50",
      placeholder: "请输入0-50之间的值",
      errorStr: "请填写0到50间的数字，最多两位小数",
      disabled: false,
      require: true,
      requireText: "结算水分必填，请填写"
    }, {
      data: "",
      label: "本次热值奖罚(元/吨)",
      type: "number",
      value: "offsetHeatingVal",
      "int": false,
      decimal: 2,
      negative: true,
      min: "-99999999",
      max: "99999999",
      placeholder: "可输入负数",
      errorStr: "请填写数字，最多两位小数",
      errorRangeStr: "超出范围",
      disabled: false,
      require: true,
      requireText: "热值奖罚必填，请填写"
    }, {
      data: "",
      label: "本次硫分奖罚(元/吨)",
      type: "number",
      value: "offsetSulfurContent",
      "int": false,
      decimal: 2,
      negative: true,
      min: "-99999999",
      max: "99999999",
      placeholder: "可输入负数",
      errorStr: "请填写数字，最多两位小数",
      errorRangeStr: "超出范围",
      disabled: false,
      require: true,
      requireText: "硫分奖罚必填，请填写"
    }, {
      data: "",
      label: "本次挥发分奖罚(元/吨)",
      type: "number",
      value: "offsetVolatileContent",
      "int": false,
      decimal: 2,
      negative: true,
      min: "-99999999",
      max: "99999999",
      placeholder: "可输入负数",
      errorStr: "请填写数字，最多两位小数",
      errorRangeStr: "超出范围",
      disabled: false,
      require: true,
      requireText: "挥发分奖罚必填，请填写"
    }, {
      data: "",
      label: "本次水分奖罚(元/吨)",
      type: "number",
      value: "offsetWaterContent",
      "int": false,
      decimal: 2,
      negative: true,
      min: "-99999999",
      max: "99999999",
      placeholder: "可输入负数",
      errorStr: "请填写数字，最多两位小数",
      errorRangeStr: "超出范围",
      disabled: false,
      require: true,
      requireText: "水分奖罚必填，请填写"
    }, {
      data: "",
      label: "本次其他奖罚(元/吨)",
      type: "number",
      value: "offsetOther",
      "int": false,
      decimal: 2,
      negative: true,
      min: "-99999999",
      max: "99999999",
      placeholder: "可输入负数",
      errorStr: "请填写数字，最多两位小数",
      errorRangeStr: "超出范围",
      disabled: false,
      require: true,
      requireText: "其他奖罚必填，请填写"
    }, {
      data: "",
      label: "本次奖罚小计(元/吨)",
      type: "number",
      value: "offsetTotal",
      "int": false,
      min: "",
      max: "",
      placeholder: "",
      errorStr: "奖罚小计不能为空",
      disabled: true,
      require: "",
      requireText: ""
    }];
  } else if (coalType == _constants["default"].coalTypeDict.COKE) {
    result = [// {
    //   data: "",
    //   label: "合同基准灰分(%)",
    //   type: "number",
    //   value: "basicAshContent",
    //   int: false,
    //   require: "",
    //   min: "",
    //   max: "",
    //   placeholder: "",
    //   errorStr: "",
    //   disabled: true,
    //   requireText: "",
    // },
    // {
    //   data: "",
    //   label: "合同基准硫分(%)",
    //   type: "number",
    //   value: "basicSulfurContent",
    //   int: false,
    //   require: "",
    //   min: "",
    //   max: "",
    //   placeholder: "",
    //   errorStr: "",
    //   disabled: true,
    //   requireText: "",
    // },
    // {
    //   data: "",
    //   label: "合同基准挥发分(%)",
    //   type: "number",
    //   value: "basicVolatileContent",
    //   int: false,
    //   require: "",
    //   min: "",
    //   max: "",
    //   placeholder: "",
    //   errorStr: "",
    //   disabled: true,
    //   requireText: "",
    // },
    // {
    //   data: "",
    //   label: "合同基准水分(%)",
    //   type: "number",
    //   value: "basicWaterContent",
    //   int: true,
    //   require: "",
    //   min: "",
    //   max: "",
    //   placeholder: "",
    //   errorStr: "",
    //   disabled: true,
    //   requireText: "",
    // },
    {
      data: "",
      label: "本次结算灰分(%)",
      type: "number",
      value: "realAshContent",
      "int": false,
      decimal: 4,
      negative: false,
      min: "8",
      max: "20",
      placeholder: "请输入8-20之间的值",
      errorStr: "请填写8到20间的数字，最多四位小数",
      disabled: false,
      require: "",
      requireText: "结算灰分必填，请填写"
    }, {
      data: "",
      label: "本次结算硫分(%)",
      type: "number",
      value: "realSulfurContent",
      "int": false,
      decimal: 2,
      negative: false,
      min: "0",
      max: "3",
      placeholder: "请输入0-3之间的值",
      errorStr: "请填写0到3间的数字，最多两位小数",
      disabled: false,
      require: "",
      requireText: "结算硫分必填，请填写"
    }, {
      data: "",
      label: "本次结算挥发分(%)",
      type: "number",
      value: "realVolatileContent",
      "int": false,
      decimal: 2,
      negative: false,
      min: "0",
      max: "3",
      placeholder: "请输入0-3之间的值",
      errorStr: "请填写0到3间的数字，最多两位小数",
      disabled: false,
      require: "",
      requireText: "结算挥发分必填，请填写"
    }, {
      data: "",
      label: "本次结算水分(%)",
      type: "number",
      value: "realWaterContent",
      "int": false,
      decimal: 2,
      negative: false,
      min: "0",
      max: "30",
      placeholder: "请输入0-30之间的值",
      errorStr: "请填写0到30间的数字，最多两位小数",
      disabled: false,
      require: "",
      requireText: "结算水分必填，请填写"
    }, {
      data: "",
      label: "本次灰分奖罚(元/吨)",
      type: "number",
      value: "offsetAshContent",
      "int": false,
      decimal: 2,
      negative: true,
      min: "-99999999",
      max: "99999999",
      placeholder: "可输入负数",
      errorStr: "请填写数字，最多两位小数",
      errorRangeStr: "超出范围",
      disabled: false,
      require: "",
      requireText: "本次灰分奖罚必填，请填写"
    }, {
      data: "",
      label: "本次硫分奖罚(元/吨)",
      type: "number",
      value: "offsetSulfurContent",
      "int": false,
      decimal: 2,
      negative: true,
      min: "-99999999",
      max: "99999999",
      placeholder: "可输入负数",
      errorStr: "请填写数字，最多两位小数",
      errorRangeStr: "超出范围",
      disabled: false,
      require: "",
      requireText: "硫分奖罚必填，请填写"
    }, {
      data: "",
      label: "本次挥发分奖罚(元/吨)",
      type: "number",
      value: "offsetVolatileContent",
      "int": false,
      decimal: 2,
      negative: true,
      min: "-99999999",
      max: "99999999",
      placeholder: "可输入负数",
      errorStr: "请填写数字，最多两位小数",
      errorRangeStr: "超出范围",
      disabled: false,
      require: "",
      requireText: "挥发分奖罚必填，请填写"
    }, {
      data: "",
      label: "本次水分奖罚(元/吨)",
      type: "number",
      value: "offsetWaterContent",
      "int": false,
      decimal: 2,
      negative: true,
      min: "-99999999",
      max: "99999999",
      placeholder: "可输入负数",
      errorStr: "请填写数字，最多两位小数",
      errorRangeStr: "超出范围",
      disabled: false,
      require: "",
      requireText: "水分奖罚必填，请填写"
    }, {
      data: "",
      label: "本次其他奖罚(元/吨)",
      type: "number",
      value: "offsetOther",
      "int": false,
      decimal: 2,
      negative: true,
      min: "-99999999",
      max: "99999999",
      placeholder: "可输入负数",
      errorStr: "请填写数字，最多两位小数",
      errorRangeStr: "超出范围",
      disabled: false,
      require: "",
      requireText: "其他奖罚必填，请填写"
    }, {
      data: "",
      label: "本次奖罚小计(元/吨)",
      type: "number",
      value: "offsetTotal",
      "int": false,
      min: "",
      max: "",
      placeholder: "",
      errorStr: "奖罚小计不能为空",
      disabled: true,
      require: "",
      requireText: ""
    }];
  } else if (coalType == _constants["default"].coalTypeDict.COKING_COAL) {
    result = [{
      data: "",
      label: "本次结算灰分(Ad)(≤)(%)",
      type: "number",
      value: "realAshContent",
      "int": false,
      decimal: 4,
      negative: false,
      min: "0",
      max: "25",
      placeholder: "请输入0-25之间的值",
      errorStr: "请填写0到25间的数字，最多四位小数",
      disabled: false,
      require: "",
      requireText: "结算灰分必填，请填写"
    }, {
      data: "",
      label: "本次结算硫分(St,d)(≤)(%)",
      type: "number",
      value: "realSulfurContent",
      "int": false,
      decimal: 4,
      negative: false,
      min: "0.1",
      max: "6",
      placeholder: "请输入0.1-6之间的值",
      errorStr: "请填写0.1到6间的数字，最多四位小数",
      disabled: false,
      require: "",
      requireText: "结算硫分必填，请填写"
    }, {
      data: "",
      label: "本次结算挥发分(Vdaf)(≤)(%)",
      type: "number",
      value: "realVolatileContent",
      "int": false,
      decimal: 4,
      negative: false,
      min: "1",
      max: "40",
      placeholder: "请输入1-40之间的值",
      errorStr: "请填写1到40间的数字，最多四位小数",
      disabled: false,
      require: "",
      requireText: "结算挥发分必填，请填写"
    }, {
      data: "",
      label: "本次结算水分(Mt)(≤)(%)",
      type: "number",
      value: "realWaterContent",
      "int": false,
      decimal: 4,
      negative: false,
      min: "0",
      max: "25",
      placeholder: "请输入0-25之间的值",
      errorStr: "请填写0到25间的数字，最多四位小数",
      disabled: false,
      require: "",
      requireText: "结算水分必填，请填写"
    }, {
      data: "",
      label: "本次结算G(≥)",
      type: "number",
      value: "realGContent",
      "int": false,
      decimal: 4,
      negative: false,
      min: "0",
      max: "95",
      placeholder: "请输入0-95之间的值",
      errorStr: "请填写0到95间的数字，最多四位小数",
      disabled: false,
      require: "",
      requireText: ""
    }, {
      data: "",
      label: "本次结算Y(≥)(mm)",
      type: "number",
      value: "realYContent",
      "int": false,
      decimal: 4,
      negative: false,
      min: "0",
      max: "40",
      placeholder: "请输入0-40之间的值",
      errorStr: "请填写0到40间的数字，最多四位小数",
      disabled: false,
      require: "",
      requireText: ""
    }, {
      data: "",
      label: "本次结算岩相",
      type: "number",
      value: "realYxContent",
      "int": false,
      decimal: 4,
      negative: false,
      min: "0.1",
      max: "1",
      placeholder: "请输入0.1-1之间的值",
      errorStr: "请填写0.1到1间的数字，最多四位小数",
      disabled: false,
      require: "",
      requireText: ""
    }, {
      data: "",
      label: "本次结算热强度(≥)",
      type: "number",
      value: "realRqdContent",
      "int": false,
      decimal: 4,
      negative: false,
      min: "1",
      max: "90",
      placeholder: "请输入1-90之间的值",
      errorStr: "请填写1到90间的数字，最多四位小数",
      disabled: false,
      require: "",
      requireText: ""
    }];
  } else if (coalType == _constants["default"].coalTypeDict.INJECTION_COAL) {
    // 喷吹煤
    result = [{
      data: "",
      label: "本次结算水分(Mt)(≤)(%)",
      type: "number",
      value: "realWaterContent",
      "int": false,
      decimal: 4,
      negative: false,
      min: "0",
      max: "20",
      placeholder: "请输入0-20之间的值",
      errorStr: "请填写0到20间的数字，最多四位小数",
      disabled: false,
      require: "",
      requireText: "结算水分必填，请填写"
    }, {
      data: "",
      label: "本次结算灰分(Ad)(≤)(%)",
      type: "number",
      value: "realAshContent",
      "int": false,
      decimal: 4,
      negative: false,
      min: "0",
      max: "20",
      placeholder: "请输入0-20之间的值",
      errorStr: "请填写0到20间的数字，最多四位小数",
      disabled: false,
      require: "",
      requireText: "结算灰分必填，请填写"
    }, {
      data: "",
      label: "本次结算硫分(St,d)(≤)(%)",
      type: "number",
      value: "realSulfurContent",
      "int": false,
      decimal: 4,
      negative: false,
      min: "0",
      max: "3",
      placeholder: "请输入0-3之间的值",
      errorStr: "请填写0到3间的数字，最多四位小数",
      disabled: false,
      require: "",
      requireText: "结算硫分必填，请填写"
    }, {
      data: "",
      label: "本次结算挥发分(Vdaf)(≤)(%)",
      type: "number",
      value: "realVolatileContent",
      "int": false,
      decimal: 4,
      negative: false,
      min: "0",
      max: "40",
      placeholder: "请输入0-40之间的值",
      errorStr: "请填写0到40间的数字，最多四位小数",
      disabled: false,
      require: "",
      requireText: "结算挥发分必填，请填写"
    }, {
      data: "",
      label: "本次结算哈氏可磨系数(HGI)",
      type: "number",
      value: "realHgiContent",
      "int": false,
      decimal: 4,
      negative: false,
      min: "30",
      max: "110",
      placeholder: "请输入30-110之间的值",
      errorStr: "请填写30到110间的数字，最多四位小数",
      disabled: false,
      require: "",
      requireText: "结算哈氏可磨系数必填，请填写"
    }, {
      data: "",
      label: "本次结算干基热量(大卡)",
      type: "number",
      value: "realHeatContent",
      "int": false,
      decimal: 4,
      negative: false,
      min: "6100",
      max: "7800",
      placeholder: "请输入6100-7800之间的值",
      errorStr: "请填写6100到7800间的数字，最多四位小数",
      disabled: false,
      require: "",
      requireText: "结算干基热量必填，请填写"
    }];
  } else if (coalType == _constants["default"].coalTypeDict.SMOKELESS_COAL) {
    // 无烟煤
    result = [{
      data: "",
      label: "本次结算灰分(Ad)(≤)(%)",
      type: "number",
      value: "realAshContent",
      "int": false,
      decimal: 4,
      negative: false,
      min: "2",
      max: "20",
      placeholder: "请输入2-20之间的值",
      errorStr: "请填写2到20间的数字，最多四位小数",
      disabled: false,
      require: "",
      requireText: "结算灰分必填，请填写"
    }, {
      data: "",
      label: "本次结算挥发分(Vdaf)(≤)(%)",
      type: "number",
      value: "realVolatileContent",
      "int": false,
      decimal: 4,
      negative: false,
      min: "5",
      max: "15",
      placeholder: "请输入5-15之间的值",
      errorStr: "请填写5到15间的数字，最多四位小数",
      disabled: false,
      require: "",
      requireText: "结算挥发分必填，请填写"
    }, {
      data: "",
      label: "本次结算硫分(St,d)(≤)(%)",
      type: "number",
      value: "realSulfurContent",
      "int": false,
      decimal: 4,
      negative: false,
      min: "0",
      max: "4",
      placeholder: "请输入0-4.0之间的值",
      errorStr: "请填写0到4.0间的数字，最多四位小数",
      disabled: false,
      require: "",
      requireText: "结算硫分必填，请填写"
    }, {
      data: "",
      label: "本次结算粒度(mm)",
      type: "number",
      value: "realSizeContent",
      "int": false,
      decimal: 4,
      negative: false,
      min: "0",
      max: "50",
      placeholder: "请输入0-50之间的值",
      errorStr: "请填写0到50间的数字，最多四位小数",
      disabled: false,
      require: "",
      requireText: "结算粒度必填，请填写"
    }, {
      data: "",
      label: "本次结算哈氏可磨系数(HGI)",
      type: "number",
      value: "realHgiContent",
      "int": false,
      decimal: 4,
      negative: false,
      min: "30",
      max: "110",
      placeholder: "请输入30-110之间的值",
      errorStr: "请填写30到110间的数字，最多四位小数",
      disabled: false,
      require: "",
      requireText: "结算哈氏可磨系数必填，请填写"
    }, {
      data: "",
      label: "本次结算高位发热值(Qgr)(kcal/kg)",
      type: "number",
      value: "realQgrContent",
      "int": false,
      decimal: 4,
      negative: false,
      min: "5800",
      max: "8000",
      placeholder: "请输入5800-8000之间的值",
      errorStr: "请填写5800到8000间的数字，最多四位小数",
      disabled: false,
      require: "",
      requireText: "结算高位发热值必填，请填写"
    }, {
      data: "",
      label: "本次结算水分(Mt)(≤)(%)",
      type: "number",
      value: "realWaterContent",
      "int": false,
      decimal: 4,
      negative: false,
      min: "0",
      max: "20",
      placeholder: "请输入0-20之间的值",
      errorStr: "请填写0到20间的数字，最多四位小数",
      disabled: false,
      require: "",
      requireText: "结算水分必填，请填写"
    }, {
      data: "",
      label: "本次结算固定碳(%)",
      type: "number",
      value: "realFcContent",
      "int": false,
      decimal: 2,
      negative: false,
      min: "60",
      max: "90",
      placeholder: "请输入60-90之间的值",
      errorStr: "请填写60到90间的数字，最多两位小数",
      disabled: false,
      require: "",
      requireText: "结算固定碳必填，请填写"
    }, {
      data: "",
      label: "本次结算收到基低位发热量(MJ/kg)",
      type: "number",
      value: "realMjContent",
      "int": false,
      decimal: 4,
      negative: false,
      min: "5000",
      max: "7000",
      placeholder: "请输入5000-7000之间的值",
      errorStr: "请填写5000到7000间的数字，最多四位小数",
      disabled: false,
      require: "",
      requireText: "结算收到基低位发热量必填，请填写"
    }, {
      data: "",
      label: "本次结算干基热量(大卡)",
      type: "number",
      value: "realHeatContent",
      "int": false,
      decimal: 4,
      negative: false,
      min: "6000",
      max: "7800",
      placeholder: "请输入6000-7800之间的值",
      errorStr: "请填写6000到7800间的数字，最多四位小数",
      disabled: false,
      require: "",
      requireText: "结算干基热量必填，请填写"
    }];
  } else if (coalType == _constants["default"].coalTypeDict.SEMI_COKE) {
    // 兰炭
    result = [{
      data: "",
      label: "本次结算灰分(Ad)(≤)(%)",
      type: "number",
      value: "realAshContent",
      "int": false,
      decimal: 4,
      negative: false,
      min: "5",
      max: "16",
      placeholder: "请输入5-16之间的值",
      errorStr: "请填写5到16间的数字，最多四位小数",
      disabled: false,
      require: "",
      requireText: "结算灰分必填，请填写"
    }, {
      data: "",
      label: "本次结算挥发分(Vdaf)(≤)(%)",
      type: "number",
      value: "realVolatileContent",
      "int": false,
      decimal: 4,
      negative: false,
      min: "5",
      max: "18",
      placeholder: "请输入5-18之间的值",
      errorStr: "请填写5到18间的数字，最多四位小数",
      disabled: false,
      require: "",
      requireText: "结算挥发分必填，请填写"
    }, {
      data: "",
      label: "本次结算硫分(St,d)(≤)(%)",
      type: "number",
      value: "realSulfurContent",
      "int": false,
      decimal: 4,
      negative: false,
      min: "0",
      max: "3",
      placeholder: "请输入0-3之间的值",
      errorStr: "请填写0到3间的数字，最多四位小数",
      disabled: false,
      require: "",
      requireText: "结算硫分必填，请填写"
    }, {
      data: "",
      label: "本次结算水分(Mt)(≤)(%)",
      type: "number",
      value: "realWaterContent",
      "int": false,
      decimal: 4,
      negative: false,
      min: "0",
      max: "25",
      placeholder: "请输入0-25之间的值",
      errorStr: "请填写0到25间的数字，最多四位小数",
      disabled: false,
      require: "",
      requireText: "结算水分必填，请填写"
    }, {
      data: "",
      label: "本次结算哈氏可磨系数(HGI)",
      type: "number",
      value: "realHgiContent",
      "int": false,
      decimal: 4,
      negative: false,
      min: "40",
      max: "90",
      placeholder: "请输入40-90之间的值",
      errorStr: "请填写40到90间的数字，最多四位小数",
      disabled: false,
      require: "",
      requireText: "结算哈氏可磨系数必填，请填写"
    }, {
      data: "",
      label: "本次结算收到基低位发热量(MJ/kg)",
      type: "number",
      value: "realMjContent",
      "int": false,
      decimal: 4,
      negative: false,
      min: "5000",
      max: "6800",
      placeholder: "请输入5000-6800之间的值",
      errorStr: "请填写5000到6800间的数字，最多四位小数",
      disabled: false,
      require: "",
      requireText: "结算收到基低位发热量必填，请填写"
    }, {
      data: "",
      label: "本次结算粒度(mm)",
      type: "number",
      value: "realSizeContent",
      "int": false,
      decimal: 4,
      negative: false,
      min: "0",
      max: "100",
      placeholder: "请输入0-100之间的值",
      errorStr: "请填写0到100间的数字，最多四位小数",
      disabled: false,
      require: "",
      requireText: "结算粒度必填，请填写"
    }, {
      data: "",
      label: "本次磷含量(P)(%)",
      type: "number",
      value: "realPContent",
      "int": false,
      decimal: 4,
      negative: false,
      min: "0",
      max: "1",
      placeholder: "请输入0-1之间的值",
      errorStr: "请填写0到1间的数字，最多四位小数",
      disabled: false,
      require: "",
      requireText: "结算磷含量必填，请填写"
    }, {
      data: "",
      label: "本次结算钠钾总量(K+Na)(%)",
      type: "number",
      value: "realKnaContent",
      "int": false,
      decimal: 4,
      negative: false,
      min: "0",
      max: "1",
      placeholder: "请输入0-1之间的值",
      errorStr: "请填写0到1间的数字，最多四位小数",
      disabled: false,
      require: "",
      requireText: "结算钠钾总量必填，请填写"
    }, {
      data: "",
      label: "本次结算N含量(%)",
      type: "number",
      value: "realNContent",
      "int": false,
      decimal: 4,
      negative: false,
      min: "0",
      max: "1.5",
      placeholder: "请输入0-1.5之间的值",
      errorStr: "请填写0到1.5间的数字，最多四位小数",
      disabled: false,
      require: "",
      requireText: "结结算N含量必填，请填写"
    }];
  }

  return result;
}