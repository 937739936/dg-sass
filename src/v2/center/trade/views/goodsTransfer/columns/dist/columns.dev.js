"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.referredsColumns = exports.deliverTrunksColumns = exports.deliverShipsColumns = exports.deliverTrainColumns = exports.selectContractColumns = exports.GoodsTransferDOColumns2 = exports.GoodsTransferDOColumns1 = void 0;

// import {filterCodeByValueName} from '@sub/utils/globalCode.js';
var customRender = function customRender(text) {
  return text || '-';
}; //空数据用-代替


var GoodsTransferDOColumns1 = function GoodsTransferDOColumns1(that) {
  return [{
    title: '合同编号',
    dataIndex: 'contractNo',
    customRender: customRender
  }, {
    title: '货转编号',
    dataIndex: 'goodsTransferNo',
    customRender: customRender
  }, {
    title: '买方企业',
    dataIndex: 'buyerCompanyName',
    customRender: customRender
  }, {
    title: '收货人',
    dataIndex: 'receiverName',
    customRender: customRender
  }, {
    title: '货转开具日期',
    dataIndex: 'signDate',
    customRender: customRender
  }, {
    title: '货转数量(吨)',
    dataIndex: 'goodsTransferQuantity',
    scopedSlots: {
      customRender: 'Amount'
    }
  }, {
    title: '发运方式',
    dataIndex: 'transTypeDesc',
    customRender: customRender
  }, {
    title: '状态',
    dataIndex: 'goodsTransferStatusDesc',
    scopedSlots: {
      customRender: 'status'
    }
  }, {
    title: '操作',
    fixed: 'right',
    customRender: function customRender(text, items) {
      return that.actionMinDiv(items);
    }
  }];
};

exports.GoodsTransferDOColumns1 = GoodsTransferDOColumns1;

var GoodsTransferDOColumns2 = function GoodsTransferDOColumns2(that) {
  return [{
    title: '合同编号',
    dataIndex: 'contractNo',
    customRender: customRender
  }, {
    title: '货转编号',
    dataIndex: 'goodsTransferNo',
    customRender: customRender
  }, {
    title: '卖方企业',
    dataIndex: 'sellerCompanyName',
    customRender: customRender
  }, {
    title: '收货人',
    dataIndex: 'receiverName',
    customRender: customRender
  }, {
    title: '货转开具日期',
    dataIndex: 'signDate',
    customRender: customRender
  }, {
    title: '货转数量(吨)',
    dataIndex: 'goodsTransferQuantity',
    scopedSlots: {
      customRender: 'Amount'
    }
  }, {
    title: '发运方式',
    dataIndex: 'transTypeDesc',
    customRender: customRender
  }, {
    title: '状态',
    dataIndex: 'goodsTransferStatusDesc',
    scopedSlots: {
      customRender: 'status'
    }
  }, {
    title: '操作',
    fixed: 'right',
    customRender: function customRender(text, items) {
      return that.actionMinDiv(items);
    }
  }];
}; // 选择合同弹窗


exports.GoodsTransferDOColumns2 = GoodsTransferDOColumns2;
var selectContractColumns = [{
  title: '合同编号',
  dataIndex: 'contractNo',
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
  title: '订单数量(吨)',
  dataIndex: 'quantity',
  scopedSlots: {
    customRender: 'Amount'
  }
}, {
  title: '已发货数量(吨)',
  dataIndex: 'deliverQuantity',
  scopedSlots: {
    customRender: 'Amount'
  }
}, {
  title: '已开具货转数量',
  dataIndex: 'goodsTransferQuantity',
  scopedSlots: {
    customRender: 'Amount'
  }
}, {
  title: '执行期',
  dataIndex: 'zxq',
  scopedSlots: {
    customRender: 'zxq'
  }
}]; //火运信息table colums

exports.selectContractColumns = selectContractColumns;
var deliverTrainColumns = [{
  title: '发货批次号',
  dataIndex: 'batchNo',
  customRender: customRender
}, {
  title: '品名',
  dataIndex: 'goodsName',
  customRender: customRender
}, {
  title: '发货数量',
  dataIndex: 'deliverQuantity',
  scopedSlots: {
    customRender: 'Amount'
  }
}, {
  title: '已收货数量',
  dataIndex: 'receivedQuantity',
  scopedSlots: {
    customRender: 'Amount'
  }
}, {
  title: '发货日期',
  dataIndex: 'deliverDate',
  customRender: customRender
}, {
  title: '铁路计划号',
  dataIndex: 'railwayPlanNo',
  customRender: customRender
}, {
  title: '车数',
  dataIndex: 'trainNum',
  customRender: customRender
}]; //船运信息table colums

exports.deliverTrainColumns = deliverTrainColumns;
var deliverShipsColumns = [{
  title: '发货批次号',
  dataIndex: 'batchNo',
  scopedSlots: {
    customRender: 'batchNo'
  }
}, {
  title: '品名',
  dataIndex: 'goodsName',
  customRender: customRender
}, {
  title: '发货数量',
  dataIndex: 'deliverQuantity',
  scopedSlots: {
    customRender: 'Amount'
  }
}, {
  title: '已收货数量',
  dataIndex: 'receivedQuantity',
  scopedSlots: {
    customRender: 'Amount'
  }
}, {
  title: '发货日期',
  dataIndex: 'deliverDate',
  customRender: customRender
}, {
  title: '装货港',
  dataIndex: 'shipLoadingPortName',
  customRender: customRender
}, {
  title: '卸货港',
  dataIndex: 'shipDischargingPortName',
  customRender: customRender
}, {
  title: '船舶信息',
  scopedSlots: {
    customRender: 'action'
  }
}]; //汽运信息table colums

exports.deliverShipsColumns = deliverShipsColumns;
var deliverTrunksColumns = [{
  title: '收货编号',
  dataIndex: 'receiveNo',
  customRender: customRender
}, {
  title: '关联发货批次',
  dataIndex: 'batchNoList',
  customRender: customRender
}, {
  title: '品名',
  dataIndex: 'goodsName',
  customRender: customRender
}, {
  title: '收货数量',
  dataIndex: 'receiveQuantity',
  scopedSlots: {
    customRender: 'Amount'
  }
}, {
  title: '收货日期',
  dataIndex: 'receiveDate',
  customRender: customRender
}, {
  title: '车数',
  dataIndex: 'trainNum',
  customRender: customRender
}]; //货转复用信息table colums

exports.deliverTrunksColumns = deliverTrunksColumns;
var referredsColumns = [{
  title: '货转编号',
  dataIndex: 'goodsTransferNo',
  scopedSlots: {
    customRender: 'goodsTransferNo'
  }
}, {
  title: '货转开具日期',
  dataIndex: 'signDate',
  customRender: customRender
}, {
  title: '货转数量(吨)',
  dataIndex: 'goodsTransferQuantity',
  scopedSlots: {
    customRender: 'Amount'
  }
}, {
  title: '运输方式',
  dataIndex: 'transTypeDesc',
  customRender: customRender
}, {
  title: '合同编号',
  dataIndex: 'contractNo',
  customRender: customRender
}, {
  title: '卖方企业',
  dataIndex: 'sellerCompanyName',
  customRender: customRender
}, {
  title: '买方企业',
  dataIndex: 'buyerCompanyName',
  customRender: customRender
}, {
  title: '货转状态',
  dataIndex: 'goodsTransferStatusDesc',
  customRender: customRender
}];
exports.referredsColumns = referredsColumns;