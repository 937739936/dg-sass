import { fillDecimal } from 'untils/factory.js';
import { filterCodeByValueName} from '@sub/utils/globalCode.js'
// 运费
export const freightColumns = [
  { title: "发票代码", dataIndex: "code", key: "code", },
  { title: "发票号码", dataIndex: "no", key: "no", },
  { title: "开票日期", dataIndex: "issuedDate", key: "issuedDate", },
  { title: "价税合计(元)", dataIndex: "totalAmount", key: "totalAmount",
    customRender: (text) => {
      return `￥${fillDecimal((+text).toLocaleString())}`
    }
  },
  { title: "是否包含印花税", dataIndex: "stampTaxFlag",  key: "stampTaxFlag",
    customRender: (text) => {
      return text == 1 ? '否' : '是'
    }
  },
  { title: "印花税税额(元)", dataIndex: "stampTaxFlagAmount", key: "stampTaxFlagAmount",
    customRender: (text) => {
      return `￥${fillDecimal((+text).toLocaleString())}`
    }
  },
  { title: "含印花税合计(元)", dataIndex: "stampTaxFlagTotalAmount", key: "stampTaxFlagTotalAmount",
    customRender: (text) => {
      return `￥${fillDecimal((+text).toLocaleString())}`
    }
  },
  {dataIndex: "taxExcludedAmount",  slots: { title: 'customTitle2' },
    customRender: (text) => {
      return `￥${fillDecimal((+text).toLocaleString())}`
    }
  },
  { dataIndex: "notSplitAmount", key: "notSplitAmount",
    slots: { title: 'notSplitAmount' },
    customRender: (text) => {
      return `￥${fillDecimal((+text).toLocaleString())}`
    }
  },
  { 
    // title: "发票状态",
    slots: { title: 'invoiceStatusTitle' }, dataIndex: "stateDesc", key: "stateDesc", },
  { title: "是否包含附件", dataIndex: "whetherHasAttachment", key: "whetherHasAttachment", },
  { title: "合同编号", dataIndex: "invoiceContractVOList.contractNo", scopedSlots: { customRender: "contractNo" }, key: "contractNo" },
  { title: "销售方", dataIndex: "sellerName", key: "sellerName", },
  { title: "购买方", dataIndex: "buyerName", key: "buyerName", },
  { title: "上传时间", dataIndex: "createTime",  key: "createTime" },
  { key: "action", fixed: "right", slots: { title: "customTitle" }, scopedSlots: { customRender: "action" } }
];
// 进项
export const buyColumns = [
  { title: "发票代码", dataIndex: "code", key: "code", },
  { title: "发票号码", dataIndex: "no", key: "no", },
  { title: "开票日期", dataIndex: "issuedDate", key: "issuedDate", },
  { title: "价税合计(元)", dataIndex: "totalAmount", key: "totalAmount",
    customRender: (text) => {
      return `￥${fillDecimal((+text).toLocaleString())}`
    }
  },
  {dataIndex: "taxExcludedAmount", key: "taxExcludedAmount",  slots: { title: 'customTitle2' },
    customRender: (text) => {
      return `￥${fillDecimal((+text).toLocaleString())}`
    }},
  { dataIndex: "notSplitAmount", key: "notSplitAmount",
    slots: { title: 'notSplitAmount' },
    customRender: (text) => {
      return `￥${fillDecimal((+text).toLocaleString())}`
    }
  },
  { 
    // title: "发票状态", 
    slots: { title: 'invoiceStatusTitle' },
    dataIndex: "stateDesc", key: "stateDesc", },
  { title: "是否包含附件", dataIndex: "whetherHasAttachment", key: "whetherHasAttachment", },
  { title: "合同编号", dataIndex: "invoiceContractVOList.contractNo", scopedSlots: { customRender: "contractNo" }, key: "contractNo" },
  { title: "销售方", dataIndex: "sellerName", key: "sellerName", },
  { title: "购买方", dataIndex: "buyerName", key: "buyerName", },
  { title: "上传时间", dataIndex: "createTime", key: "createTime" },
  { key: "action", fixed: "right",  with: 200, slots: { title: "customTitle" }, scopedSlots: { customRender: "action" } }
]
// 销项
export let sellColumns = buyColumns
// 运费
// export let freightColumns = tradeColumns
// 上传任务列表

export const uploadTaskColumns = [
  { title: "上传时间", dataIndex: "createDate", scopedSlots: { customRender: "createDate" },  width: 200, },
  { title: "上传发票总数", dataIndex: "invoiceUploadTotal", customRender: (text) => {
    return (text == undefined || text == null) ? '-' : text
  } },
  { title: "验证成功发票数量", dataIndex: "checkTrueCount",  customRender: (text) => {
    return (text == undefined || text == null) ? '-' : text
  }},
  { title: "验证失败发票数量", dataIndex: "checkFalseCount", children: [
    { title: "未通过校验", dataIndex: "checkFalseCount",  customRender: (text) => {
      return (text == undefined || text == null) ? '-' : text
    }},
    { title: "识别失败数", dataIndex: "ocrFalseCount", scopedSlots: { customRender: "ocrFalseCount" } },
  ] },
  { title: "任务进度", dataIndex: "uploadProgress",  scopedSlots: { customRender: "uploadProgress" }, width:300 },
  { title: "操作", key: "action",  width: 150, scopedSlots: { customRender: "action" } }

]


/** 图片上传关联合同 进项 */
export const pictureBuyColumns = [
  {
    title: '发票代码',
    dataIndex: 'myInvoiceDO.code',



  },
  {
    title: '发票号码',
    dataIndex: 'myInvoiceDO.no',
    with: 100,
  },
  {
    title: '价税合计（元）',
    dataIndex: 'myInvoiceDO.totalAmount',
    customRender: (text) => {
      return `￥${fillDecimal((+text).toLocaleString())}`
    },
    with: 100,
  },
  {
    title: '卖方名称',
    dataIndex: 'myInvoiceDO.sellerName',
    with: 100,
  },
  {
    title: '买方名称',
    dataIndex: 'myInvoiceDO.buyerName',
    with: 100,
  },
  {
    title: '开票日期',
    dataIndex: 'myInvoiceDO.issuedDate',
    with: 100,
  },

  {
    title: '关联合同编号',
    dataIndex: 'contractNo',
    with: 100,
  },
  {
    dataIndex: 'splitAmount',
    slots: { title: 'splitAmount' },
    scopedSlots: { customRender: 'splitAmount2' },
    with: 400,
  },
  {
    title: '操作',
    dataIndex: 'action',
    with: 450,
    fixed: 'right',
    scopedSlots: { customRender: 'action' }
  },
]
/** 图片上传关联合同 销项 */
export const pictureSellColumns = pictureBuyColumns
/** 图片上传关联合同  运费*/
export const pictureFreightColumns = [
  {
    title: '发票代码',
    dataIndex: 'myInvoiceDO.code',
    with: 100,
  },
  {
    title: '发票号码',
    dataIndex: 'myInvoiceDO.no',
    with: 100,
  },
  {
    title: '价税合计（元）',
    dataIndex: 'myInvoiceDO.totalAmount',
    customRender: (text) => {
      return `￥${fillDecimal((+text).toLocaleString())}`
    },
    with: 100,
  },
  {
    title: '印花税税额（元）',
    dataIndex: 'myInvoiceDO.stampTaxFlagAmount',
    customRender: (text) => {
      return `￥${fillDecimal((+text).toLocaleString())}`
    },
    with: 100,
  },
  {
    title: '卖方名称',
    dataIndex: 'myInvoiceDO.sellerName',
    with: 200,
  },
  {
    title: '买方名称',
    dataIndex: 'myInvoiceDO.buyerName',
  },
  {
    title: '开票日期',
    dataIndex: 'myInvoiceDO.issuedDate',
  },
  {
    title: '关联合同编号',
    dataIndex: 'contractNo',
    with:200,
  },
  {
    dataIndex: 'splitAmount',
    slots: { title: 'splitAmount' },
    width:300,
    scopedSlots: { customRender: 'splitAmount2' },
  },
  {
    title: '操作',
    dataIndex: 'action',
    fixed: 'right',
    with:150,
    scopedSlots: { customRender: 'action' }
  },
]
// excel上传关联合同
export const excelColumns = [
  {
    title: '发票代码',
    dataIndex: 'myInvoiceDO.code',
  },
  {
    title: '发票号码',
    dataIndex: 'myInvoiceDO.no',
  },
  {
    title: '验证结果',
    dataIndex: 'scanReason',
    // fixed: 'right',
    scopedSlots: { customRender: 'scanReason' }
  },
  {
    title: '开票日期',
    dataIndex: 'myInvoiceDO.issuedDate',
  },
  {
    slots: { title: '发票金额' },
    dataIndex: 'myInvoiceDO.taxExcludedAmount',
    customRender: (text) => {
      return `￥${fillDecimal((+text).toLocaleString())}`
    },
  },
  {
    title: '价税合计(元)',
    dataIndex: 'myInvoiceDO.totalAmount',
    customRender: (text) => {
      return `￥${fillDecimal((+text).toLocaleString())}`
    },
  },

  {

    dataIndex: 'splitAmount',
    slots: { title: 'splitAmount' },
      customRender: (text) => {
      return `￥${fillDecimal((+text).toLocaleString())}`
    },
    // fixed: 'right',
  },

  {
    title: '合同编号',
    dataIndex: 'contractNo',
    // fixed: 'right',
  },
  {
    title: '操作',
    dataIndex: 'action',
    fixed: 'right',
    scopedSlots: { customRender: 'action' }
  },
]
export const  detailColumns = [
  {
    title: '合同编号',
    dataIndex: 'contractNo'
  },
  {
    title: '卖方名称',
    dataIndex: 'sellerName'
  },
  {
    title: '买方名称',
    dataIndex: 'buyerName'
  },
  // {
  //   title: '合同数量（吨）',
  //   dataIndex: 'quantity',
  //   customRender: (text) => {
  //     return (+text).toLocaleString()
  //   }
  // },

  {
    slots: { title: "splitAmountTitle" },
    scopedSlots: { customRender: 'splitAmount' },
  },
]
export const  editColumns = [
  {
    title: '合同编号',
    dataIndex: 'contractNo'
  },
  {
    title: '卖方名称',
    dataIndex: 'sellerName'
  },
  {
    title: '买方名称',
    dataIndex: 'buyerName'
  },
  // {
  //   title: '合同数量（吨）',
  //   dataIndex: 'quantity',
  //   customRender: (text) => {
  //     return (+text).toLocaleString()
  //   }
  // },

  {
    slots: { title: "splitAmountTitle" },
    scopedSlots: { customRender: 'splitAmount' },
  },
  {
    title: '操作',
    dataIndex: 'action',
    // fixed: 'right',
    with:165,
    scopedSlots: { customRender: 'action' }
  },
]

