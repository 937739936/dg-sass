const columnsInTable = [
	{
		title: '发票号码',
		dataIndex: 'no',
		key: 'no',
		width: 100
	},
	{
		title: '发票代码',
		dataIndex: 'code',
		width: 110
	},
	{
		title: '发票类型',
		dataIndex: 'invoiceTypeDesc',
		width: 130
	},
	{
		title: '开票日期',
		dataIndex: 'issuedDate',
		width: 120,
		sorter: (a, b) => a.date - b.date
	},
	{
		title: '销售方',
		dataIndex: 'sellerName',
		width: 150
	},
	{
		title: '财务主体',
		dataIndex: 'buyerName',
		width: 150
	},
	{
		title: '商品名称',
		dataIndex: 'invoiceItemName',
		width: 150
	},
	{
		title: '不含税金额（元）',
		dataIndex: 'taxExcludedAmount',
		width: 150
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
		title: '是否包含印花税',
		dataIndex: 'includeStampTaxFlag',
		width: 170,
		customRender: text => {
			return text ? '是' : '否';
		}
	},
	{
		title: '印花税税额（元）',
		dataIndex: 'stampTaxFlagAmount',
		width: 170
	},
	{
		title: '含印花税合计（元）',
		dataIndex: 'stampTaxFlagTotalAmount',
		width: 170
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
		title: '关联至合同金额（含印花税，元）',
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
		width: 80,
		fixed: 'right'
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
		title: '关联至合同金额（含印花税，元）',
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
		title: '开票单位',
		dataIndex: 'sellerName',
		key: 'sellerName',
		width: 200
	},
	{
		title: '账务主体',
		dataIndex: 'buyerName',
		key: 'buyerName',
		width: 200
	},
	{
		title: '采购合同编号',
		dataIndex: 'contractNo',
		key: 'contractNo',
		width: 200
	},
	{
		title: '开票日期',
		dataIndex: 'issuedDateStr',
		key: 'issuedDateStr',
		width: 260
	},
	{
		title: '发票类型',
		dataIndex: 'invoiceTypeListStr',
		key: 'invoiceTypeListStr',
		width: 150
	},
	{
		title: '不含税金额(元)',
		dataIndex: 'totalTaxExcludeAmount',
		key: 'totalTaxExcludeAmount',
		width: 150
	},
	{
		title: '税率',
		dataIndex: 'taxRateListStr',
		key: 'taxRateListStr',
		width: 150
	},
	{
		title: '税额(元)',
		dataIndex: 'totalTaxAmount',
		key: 'totalTaxAmount',
		width: 150
	},
	{
		title: '价税合计(元)',
		dataIndex: 'totalTotalAmount',
		key: 'totalTotalAmount',
		width: 150
	},
	{
		title: '印花税税额(元)',
		dataIndex: 'totalStampTaxFlagAmount',
		key: 'totalStampTaxFlagAmount',
		width: 150
	},
	{
		title: '含印花税合计(元)',
		dataIndex: 'totalStampTaxFlagTotalAmount',
		key: 'totalStampTaxFlagTotalAmount',
		width: 150
	},
	{
		title: '备注',
		dataIndex: 'remark',
		key: 'remark',
		width: 200
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
		title: '购买方',
		dataIndex: 'buyerName',
		key: 'buyerName'
	},
	{
		title: '价税合计（元）',
		dataIndex: 'totalAmount',
		key: 'totalAmount'
	},
	{
		title: '含印花税合计（元）',
		dataIndex: 'stampTaxFlagTotalAmount',
		key: 'stampTaxFlagTotalAmount'
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
		title: '购买方',
		dataIndex: 'buyerName',
		key: 'buyerName'
	},
	{
		title: '不含税金额（元）',
		dataIndex: 'taxExcludedAmount',
		key: 'taxExcludedAmount'
	},
	{
		title: '价税合计（元）',
		dataIndex: 'totalAmount',
		key: 'totalAmount'
	},
	{
		title: '含印花税合计（元）',
		dataIndex: 'stampTaxFlagTotalAmount',
		key: 'stampTaxFlagTotalAmount'
	}
];

const columnsRelation = [
	{
		title: '序号',
		dataIndex: 'id',
		key: 'id',
		width: 70
	},
	{
		title: '发票代码',
		dataIndex: 'code',
		key: 'code'
	},
	{
		title: '发票号码',
		dataIndex: 'no',
		key: 'no',
		ellipsis: true
	},
	{
		title: '销售方',
		dataIndex: 'sellerName',
		key: 'sellerName'
	},
	{
		title: '价税合计（元）',
		dataIndex: 'totalAmount',
		key: 'totalAmount',
		width: 130
	},
	{
		title: '含印花税金额（元）',
		dataIndex: 'stampTaxFlagTotalAmount',
		key: 'stampTaxFlagTotalAmount',
		scopedSlots: { customRender: 'stampTaxFlagTotalAmount' },
		width: 150
	},
	{
		title: '关联至合同金额（含印花税，元）',
		dataIndex: 'splitAmount',
		key: 'splitAmount',
		scopedSlots: { customRender: 'splitAmount' },
		width: 180
	},
	{
		title: '操作',
		dataIndex: 'action',
		scopedSlots: { customRender: 'action' }
	}
];

export {
	columnsInTable,
	columnsInvoiceRelationContract,
	columnsGoods,
	columnsContract,
	columnsEntryTable,
	columnsEntryInvoiceList,
	columnsEntryInvoiceEditList,
	columnsRelation
};
