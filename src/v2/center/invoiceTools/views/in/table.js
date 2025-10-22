import moment from 'moment';

const columnsInTable = [
	{
		title: '发票号码',
		dataIndex: 'no',
		width: 100
	},
	{
		title: '发票代码',
		dataIndex: 'code',
		width: 120
	},
	{
		title: '发票类型',
		dataIndex: 'invoiceTypeDesc',
		width: 100
	},
	{
		title: '开票日期',
		dataIndex: 'issuedDate',
		width: 120,
		sorter: (a, b) => moment(a.issuedDate) - moment(b.issuedDate)
	},
	{
		title: '销售方',
		dataIndex: 'sellerName',
		width: 100
	},
	{
		title: '财务主体',
		dataIndex: 'buyerName',
		width: 100
	},
	{
		title: '商品名称',
		dataIndex: 'invoiceItemName',
		width: 100
	},
	{
		title: '规格型号',
		dataIndex: 'invoiceItemSpec',
		width: 100
	},
	{
		title: '开票数量',
		dataIndex: 'totalQuantity',
		width: 100
	},
	{
		title: '不含税金额（元）',
		dataIndex: 'taxExcludedAmount',
		width: 160
	},
	{
		title: '税率',
		dataIndex: 'taxRate',
		width: 100
	},
	{
		title: '税额（元）',
		dataIndex: 'taxAmount',
		width: 120
	},
	{
		title: '价税合计（元）',
		dataIndex: 'totalAmount',
		width: 150
	},
	{
		title: '发票状态',
		dataIndex: 'stateDesc',
		width: 100
	},
	{
		title: '采购合同编号',
		dataIndex: 'contractNo',
		width: 160
	},
	{
		title: '是否有附件',
		dataIndex: 'hasAttachment',
		width: 120,
		scopedSlots: { customRender: 'hasAttachment' }
	},
	{
		title: '登记日期',
		dataIndex: 'createDate',
		width: 150
	},
	{
		title: '操作',
		key: 'action',
		scopedSlots: { customRender: 'action' },
		fixed: 'right',
		width: 200
	}
];

const columnsInvoiceRelationContract = [
	{
		title: '采购合同编号',
		dataIndex: 'contractNo',
		key: 'contractNo',
		scopedSlots: { customRender: 'contractNo' },
		width: 300
	},
	{
		title: '卖方企业',
		dataIndex: 'sellerName',
		key: 'sellerName',
		width: 200
	},
	{
		title: '买方企业',
		key: 'buyerName',
		dataIndex: 'buyerName',
		width: 200
	},
	{
		// title: '关联至合同数量',
		key: 'splitQuantity',
		dataIndex: 'splitQuantity',
		slots: { title: 'splitQuantity' },
		scopedSlots: { customRender: 'splitQuantity' },
		width: 300
	},
	{
		title: '关联至合同金额（价税合计，元）',
		key: 'splitAmount',
		dataIndex: 'splitAmount',
		scopedSlots: { customRender: 'splitAmount' },
		width: 300
	},
	{
		key: 'action',
		title: '操作',
		dataIndex: 'action',
		scopedSlots: { customRender: 'action' },
		width: 80
	}
];

const columnsGoods = [
	{
		title: '货物/应税劳务服务名称',
		dataIndex: 'name',
		key: 'name'
	},
	{
		title: '规格型号',
		dataIndex: 'spec',
		key: 'spec'
	},
	{
		title: '单位',
		dataIndex: 'unit',
		key: 'unit'
	},
	{
		title: '数量',
		dataIndex: 'quantity',
		key: 'quantity'
	},
	{
		title: '单价',
		dataIndex: 'unitPrice',
		key: 'unitPrice'
	},
	{
		title: '税率',
		dataIndex: 'taxRate',
		key: 'taxRate'
	},
	{
		title: '金额',
		dataIndex: 'amount',
		key: 'amount'
	},
	{
		title: '税额',
		dataIndex: 'tax',
		key: 'tax'
	}
];

const columnsContract = [
	{
		title: '序号',
		dataIndex: 'id',
		key: 'id'
	},
	{
		title: '合同编号',
		dataIndex: 'contractNo',
		key: 'contractNo'
	},
	{
		title: '卖方企业',
		dataIndex: 'sellerName',
		key: 'sellerName'
	},
	{
		title: '买方企业',
		dataIndex: 'buyerName',
		key: 'buyerName'
	},
	{
		// title: '关联至合同数量',
		dataIndex: 'splitQuantity',
		key: 'splitQuantity',
		slots: { title: 'splitQuantity' }
	},
	{
		title: '关联至合同金额(元)',
		dataIndex: 'splitAmount',
		key: 'splitAmount'
	}
];

const columnsEntryTable = [
	{
		title: '登记日期',
		dataIndex: 'invoiceCreateDate',
		key: 'invoiceCreateDate',
		width: 150
	},
	{
		title: '入账月份',
		dataIndex: 'recordDate',
		key: 'recordDate',
		width: 150
	},
	{
		title: '凭证号',
		dataIndex: 'no',
		key: 'no',
		width: 150
	},
	{
		title: '结算情况',
		dataIndex: 'statementTypeDesc',
		key: 'statementTypeDesc',
		width: 150
	},
	{
		title: '商品名称',
		dataIndex: 'goodsName',
		width: 250
	},
	{
		title: '开票单位',
		dataIndex: 'sellerName',
		key: 'sellerName',
		width: 150
	},
	{
		title: '账务主体',
		dataIndex: 'buyerName',
		key: 'buyerName',
		width: 150
	},
	{
		title: '采购合同编号',
		dataIndex: 'contractNo',
		key: 'contractNo',
		width: 150
	},
	{
		title: '开票日期',
		dataIndex: 'issuedDateStr',
		key: 'issuedDateStr',
		width: 150
	},
	{
		title: '发票类型',
		dataIndex: 'invoiceTypeListStr',
		key: 'invoiceTypeListStr',
		width: 120
	},
	{
		title: '开票数量',
		dataIndex: 'totalInvoiceItemQuantity',
		key: 'totalInvoiceItemQuantity',
		width: 120
	},
	{
		title: '开票不含税金额(元)',
		dataIndex: 'totalTaxExcludeAmount',
		key: 'totalTaxExcludeAmount',
		width: 170
	},
	{
		title: '税率',
		dataIndex: 'taxRateListStr',
		key: 'taxRateListStr',
		width: 120
	},
	{
		title: '税额(元)',
		dataIndex: 'totalTaxAmount',
		key: 'totalTaxAmount',
		width: 120
	},
	{
		title: '价税合计(元)',
		dataIndex: 'totalTotalAmount',
		key: 'totalTotalAmount',
		width: 150
	},
	{
		title: '备注',
		dataIndex: 'remark',
		key: 'remark',
		width: 150
	},
	{
		title: '操作',
		dataIndex: 'action',
		key: 'action',
		scopedSlots: { customRender: 'action' },
		fixed: 'right',
		width: 200
	}
];

const columnsEntryInvoiceList = [
	{
		title: '序号',
		dataIndex: 'key',
		key: 'key'
	},
	{
		title: '发票代码',
		dataIndex: 'code',
		key: 'code'
	},
	{
		title: '发票号码',
		dataIndex: 'no',
		key: 'no'
	},
	{
		title: '销售方',
		dataIndex: 'sellerName',
		key: 'sellerName'
	},
	{
		title: '数量',
		dataIndex: 'totalQuantity',
		key: 'totalQuantity'
	},
	{
		title: '不含税金额（元）',
		dataIndex: 'taxExcludedAmount',
		key: 'taxExcludedAmount'
	},
	{
		title: '税率',
		dataIndex: 'taxRate',
		key: 'taxRate'
	},
	{
		title: '税额（元）',
		dataIndex: 'taxAmount',
		key: 'taxAmount'
	},
	{
		title: '价税合计（元）',
		dataIndex: 'totalAmount',
		key: 'totalAmount'
	},
	{
		title: '操作',
		dataIndex: 'action',
		key: 'action',
		scopedSlots: { customRender: 'action' }
	}
];

const columnsEntryInvoiceEditList = [
	{
		title: '序号',
		dataIndex: 'key',
		key: 'key',
		width: 100
	},
	{
		title: '发票代码',
		dataIndex: 'code',
		key: 'code',
		width: 150
	},
	{
		title: '发票号码',
		dataIndex: 'no',
		key: 'no',
		width: 150
	},
	{
		title: '销售方',
		dataIndex: 'sellerName',
		key: 'sellerName',
		width: 200
	},
	{
		title: '购买方',
		dataIndex: 'buyerName',
		key: 'buyerName',
		width: 200
	},
	{
		title: '数量',
		dataIndex: 'totalQuantity',
		key: 'totalQuantity',
		width: 150
	},
	{
		title: '不含税金额（元）',
		dataIndex: 'taxExcludedAmount',
		key: 'taxExcludedAmount',
		width: 200
	},
	{
		title: '税额（元）',
		dataIndex: 'taxAmount',
		key: 'taxAmount',
		width: 150
	},
	{
		title: '价税合计（元）',
		dataIndex: 'totalAmount',
		key: 'totalAmount',
		width: 200
	}
];

export {
	columnsInTable,
	columnsInvoiceRelationContract,
	columnsGoods,
	columnsContract,
	columnsEntryTable,
	columnsEntryInvoiceList,
	columnsEntryInvoiceEditList
};
