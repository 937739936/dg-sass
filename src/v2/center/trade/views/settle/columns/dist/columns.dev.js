"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.auditLogListColumns = exports.filesColumns = exports.goodsTransferColumns = exports.deliverDtoColumns = exports.selectOfflineContractColumns = exports.selectOnlineContractColumns = exports.SettleOfflineListColumns = exports.SettleOnlineListColumns = void 0;

// import {filterCodeByValueName} from '@sub/utils/globalCode.js';
var customRender = function customRender(text) {
  return text || '-';
}; //空数据用-代替


var SettleOnlineListColumns = function SettleOnlineListColumns(that) {
  return [{
    title: '结算单号',
    dataIndex: 'serialNo',
    customRender: customRender
  }, {
    title: '合同编号',
    dataIndex: 'contractNo',
    customRender: customRender
  }, {
    title: '卖方企业',
    dataIndex: 'sellerName',
    customRender: customRender
  }, {
    title: '买方企业',
    dataIndex: 'buyerName',
    customRender: customRender
  }, {
    title: '结算金额(元)',
    dataIndex: 'currentSettleAmount',
    scopedSlots: {
      customRender: 'Amount'
    }
  }, {
    title: '结算数量(吨)',
    dataIndex: 'settleQuantity',
    scopedSlots: {
      customRender: 'Quantity'
    }
  }, {
    title: '结算单价(元/吨)',
    dataIndex: 'settleUnitPrice',
    scopedSlots: {
      customRender: 'Amount'
    }
  }, {
    title: '结算日期',
    dataIndex: 'settleTime',
    customRender: customRender
  }, {
    title: '结算单状态',
    dataIndex: 'statusDesc',
    fixed: 'right',
    scopedSlots: {
      customRender: 'invalidStatusDesc'
    }
  }, {
    key: 'action',
    fixed: 'right',
    title: '操作',
    customRender: function customRender(text, items) {
      return that.actionMinDiv(items);
    }
  }];
};

exports.SettleOnlineListColumns = SettleOnlineListColumns;

var SettleOfflineListColumns = function SettleOfflineListColumns(that) {
  return [{
    title: '合同编号',
    dataIndex: 'paperContractNo',
    customRender: customRender
  }, {
    title: '卖方企业',
    dataIndex: 'sellerName',
    customRender: customRender
  }, {
    title: '买方企业',
    dataIndex: 'buyerName',
    customRender: customRender
  }, {
    title: '结算日期',
    dataIndex: 'statementTime',
    customRender: customRender
  }, {
    title: '结算金额(元)',
    dataIndex: 'settleAmount',
    scopedSlots: {
      customRender: 'Amount'
    }
  }, {
    title: '结算数量(吨)',
    dataIndex: 'settleQuantity',
    scopedSlots: {
      customRender: 'Quantity'
    }
  }, {
    title: '结算单价(元/吨)',
    dataIndex: 'settleUnitPrice',
    scopedSlots: {
      customRender: 'Amount'
    }
  }, {
    title: '结算单状态',
    dataIndex: 'statusDesc',
    fixed: 'right',
    scopedSlots: {
      customRender: 'statusDesc'
    }
  }, {
    title: '操作',
    fixed: 'right',
    customRender: function customRender(text, items) {
      return that.actionMinDiv(items);
    }
  }];
}; // 选择电子合同弹窗


exports.SettleOfflineListColumns = SettleOfflineListColumns;
var selectOnlineContractColumns = [{
  title: '合同编号',
  dataIndex: 'contractNo',
  fixed: 'left',
  customRender: customRender
}, {
  title: '卖方企业',
  dataIndex: 'sellerName',
  customRender: customRender
}, {
  title: '买方企业',
  dataIndex: 'buyerName',
  customRender: customRender
}, {
  title: '收货人',
  dataIndex: 'receiverName',
  customRender: customRender
}, {
  title: '交货期限',
  dataIndex: 'deliveryStartDate',
  scopedSlots: {
    customRender: 'deliveryStartDate'
  }
}, {
  title: '签订日期',
  dataIndex: 'signTime',
  customRender: customRender
}, {
  title: '运输方式',
  dataIndex: 'transportModeDesc',
  customRender: customRender
}, {
  title: '数量(吨)',
  dataIndex: 'quantity',
  scopedSlots: {
    customRender: 'Quantity'
  }
}, {
  title: '基准价格(元/吨)',
  dataIndex: 'basePrice',
  scopedSlots: {
    customRender: 'basePrice'
  }
}, {
  title: '品名',
  dataIndex: 'goodsName',
  customRender: customRender
}, {
  title: '煤种',
  dataIndex: 'coalTypeDesc',
  customRender: customRender
}, {
  title: '订单编号',
  dataIndex: 'orderNo',
  customRender: customRender
}]; // 选择线下合同弹窗

exports.selectOnlineContractColumns = selectOnlineContractColumns;
var selectOfflineContractColumns = [{
  title: '合同编号',
  dataIndex: 'paperContractNo',
  fixed: 'left',
  customRender: customRender
}, {
  title: '卖方企业',
  dataIndex: 'sellerName',
  customRender: customRender
}, {
  title: '买方企业',
  dataIndex: 'buyerName',
  customRender: customRender
}, {
  title: '收货人',
  dataIndex: 'receiverName',
  customRender: customRender
}, {
  title: '交货期限',
  dataIndex: 'deliveryStartDate',
  scopedSlots: {
    customRender: 'deliveryStartDate'
  }
}, {
  title: '签订日期',
  dataIndex: 'contractSignTime',
  customRender: customRender
}, {
  title: '运输方式',
  dataIndex: 'transTypeDesc',
  customRender: customRender
}, {
  title: '数量(吨)',
  dataIndex: 'contractQuantity',
  scopedSlots: {
    customRender: 'Quantity'
  }
}, {
  title: '基准价格(元/吨)',
  dataIndex: 'contractPrice',
  scopedSlots: {
    customRender: 'contractPrice'
  }
}, {
  title: '品名',
  dataIndex: 'goodsName',
  customRender: customRender
}]; //发运信息table colums

exports.selectOfflineContractColumns = selectOfflineContractColumns;
var deliverDtoColumns = [{
  title: '发货批次号',
  dataIndex: 'batchNo',
  scopedSlots: {
    customRender: 'batchNo'
  }
}, {
  title: '运输方式',
  dataIndex: 'despatchTypeDesc',
  customRender: customRender
}, {
  title: '发货数量(吨)',
  dataIndex: 'deliverQuantity',
  scopedSlots: {
    customRender: 'Quantity'
  }
}, {
  title: '收货数量(吨)',
  dataIndex: 'receiveQuantity',
  scopedSlots: {
    customRender: 'Quantity'
  }
}, {
  title: '发货日期',
  dataIndex: 'deliverDate',
  customRender: customRender
}, {
  title: '最后收货日期',
  dataIndex: 'recentReceiveDate',
  customRender: customRender
}, {
  title: '状态',
  dataIndex: 'status',
  scopedSlots: {
    customRender: 'status'
  }
}]; //货转信息table colums

exports.deliverDtoColumns = deliverDtoColumns;
var goodsTransferColumns = [{
  title: '货转编号',
  dataIndex: 'no',
  scopedSlots: {
    customRender: 'goodsTransferNo'
  }
}, {
  title: '发运方式',
  dataIndex: 'transportModeDesc',
  customRender: customRender
}, {
  title: '货转数量(吨)',
  dataIndex: 'goodsTransferQuantity',
  scopedSlots: {
    customRender: 'Quantity'
  }
}, {
  title: '货转日期',
  dataIndex: 'signDate',
  customRender: customRender
}, {
  title: '收货人',
  dataIndex: 'receiverName',
  customRender: customRender
}, {
  title: '状态',
  dataIndex: 'status',
  scopedSlots: {
    customRender: 'status'
  }
}]; //附件展示信息

exports.goodsTransferColumns = goodsTransferColumns;
var filesColumns = [{
  title: '文件类型',
  dataIndex: 'typeDesc'
}, {
  title: '文件名称',
  dataIndex: 'fileName'
}, {
  title: '文件编号',
  dataIndex: 'no'
}, {
  title: '签订日期',
  dataIndex: 'signTime'
}, {
  title: '操作',
  dataIndex: 'action',
  scopedSlots: {
    customRender: 'action'
  },
  align: 'center'
}]; //操作日志展示信息

exports.filesColumns = filesColumns;
var auditLogListColumns = [{
  title: '操作类型',
  dataIndex: 'operationType',
  customRender: customRender
}, {
  title: '操作人',
  dataIndex: 'operationByuser',
  customRender: function customRender(text, items) {
    return items.operationBy ? items.operationBy.slice(0, items.operationBy.lastIndexOf('-')) : '-';
  }
}, {
  title: '所属公司',
  dataIndex: 'operationBy',
  customRender: function customRender(text, items) {
    return items.operationBy ? items.operationBy.slice(items.operationBy.lastIndexOf('-') + 1) : '-';
  }
}, {
  title: '操作内容',
  dataIndex: 'comments',
  customRender: customRender
}, {
  title: '操作时间',
  dataIndex: 'operationTime',
  customRender: customRender
}];
exports.auditLogListColumns = auditLogListColumns;