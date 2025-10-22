const columnsInTable = [
	{
		title: '采购合同编号',
		dataIndex: 'upContractNo',
		key: 'upContractNo',
		scopedSlots: { customRender: 'upContractNo' },
		width: 150
	},
	{
		title: '合同卖方',
		dataIndex: 'sellerName',
		key: 'sellerName',
		width: 200
	},
	{
		title: '合同买方',
		key: 'buyerName',
		dataIndex: 'buyerName',
		width: 200
	},
	{
		title: '关联进项发票数量',
		key: 'totalTradeInvoiceSplitQuantity',
		dataIndex: 'totalTradeInvoiceSplitQuantity',
		width: 160
	},
	{
		title: '关联进项发票金额(价税合计，元)',
		key: 'totalTradeInvoiceSplitAmount',
		dataIndex: 'totalTradeInvoiceSplitAmount',
		width: 250
	},
	{
		title: '关联运费发票金额',
		key: 'totalDeliverInvoiceSplitAmount',
		dataIndex: 'totalDeliverInvoiceSplitAmount',
		width: 160
	},
	{
		title: '下游开具销项发票数量',
		key: 'totalCommissionSplitQuantity',
		dataIndex: 'totalCommissionSplitQuantity',
		width: 200
	},
	{
		title: '下游开具销项发票金额(价税合计，元)',
		key: 'totalCommissionSplitAmount',
		dataIndex: 'totalCommissionSplitAmount',
		width: 300
	},
	{
		title: '进销项数量差',
		key: 'splitQuantityDiff',
		dataIndex: 'splitQuantityDiff',
		width: 130
	},
	{
		title: '进销项金额差(价税合计，元)',
		key: 'splitAmountDiff',
		dataIndex: 'splitAmountDiff',
		width: 250
	},
	{
		title: '关联销售合同编号',
		key: 'downContractNoList',
		dataIndex: 'downContractNoList',
		width: 200,
		scopedSlots: { customRender: 'downContractNoList' }
	},
	{
		title: '销售合同对应销项发票数量',
		key: 'downContractSplitQuantityList',
		dataIndex: 'downContractSplitQuantityList',
		width: 210,
		scopedSlots: { customRender: 'downContractSplitQuantityList' }
	},
	{
		title: '销售合同对应销项发票金额(价税合计，元)',
		key: 'downContractSplitAmountList',
		dataIndex: 'downContractSplitAmountList',
		width: 310,
		scopedSlots: { customRender: 'downContractSplitAmountList' }
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

const columnsInvoice = [
	{
		title: '序号',
		dataIndex: 'key',
		key: 'key'
	},
	{
		title: '发票代码',
		dataIndex: 'no',
		key: 'no'
	},
	{
		title: '发票号码',
		dataIndex: 'code',
		key: 'code'
	},
	{
		title: '销售方',
		dataIndex: 'sellerName',
		key: 'sellerName'
	},
	{
		title: '采购方',
		dataIndex: 'buyerName',
		key: 'buyerName'
	},
	{
		title: '数量',
		dataIndex: 'totalQuantity',
		key: 'totalQuantity'
	},
	{
		title: '价税合计(元)',
		dataIndex: 'totalAmount',
		key: 'totalAmount'
	},
	{
		title: '关联至该合同数量',
		dataIndex: 'splitQuantity',
		key: 'splitQuantity'
	},
	{
		title: '关联至该合同金额(价税合计，元)',
		dataIndex: 'splitAmount',
		key: 'splitAmount'
	},
	{
		title: '操作',
		dataIndex: 'action',
		scopedSlots: { customRender: 'action' }
	}
];

const columnsInvoiceOut = [
	{
		title: '序号',
		dataIndex: 'key',
		key: 'key'
	},
	{
		title: '开票日期',
		dataIndex: 'issuedDate',
		key: 'issuedDate'
	},
	{
		title: '编号',
		dataIndex: 'no',
		key: 'no'
	},
	{
		title: '销售方',
		dataIndex: 'mainPartName',
		key: 'mainPartName'
	},
	{
		title: '采购方',
		dataIndex: 'buyerName',
		key: 'buyerName'
	},
	{
		title: '数量',
		dataIndex: 'totalQuantity',
		key: 'totalQuantity'
	},
	{
		title: '价税合计(元)',
		dataIndex: 'totalAmount',
		key: 'totalAmount'
	},
	{
		title: '关联至该合同数量',
		dataIndex: 'splitQuantity',
		key: 'splitQuantity'
	},
	{
		title: '关联至该合同金额(元)',
		dataIndex: 'splitAmount',
		key: 'splitAmount'
	},
	{
		title: '操作',
		dataIndex: 'action',
		scopedSlots: { customRender: 'action' }
	}
];

const columnsInvoiceTrans = [
	{
		title: '序号',
		dataIndex: 'key',
		key: 'key'
	},
	{
		title: '发票代码',
		dataIndex: 'no',
		key: 'no'
	},
	{
		title: '发票号码',
		dataIndex: 'code',
		key: 'code'
	},
	{
		title: '销售方',
		dataIndex: 'sellerName',
		key: 'sellerName'
	},
	{
		title: '采购方',
		dataIndex: 'buyerName',
		key: 'buyerName'
	},
	{
		title: '价税合计(元)',
		dataIndex: 'totalAmount',
		key: 'totalAmount'
	},
	{
		title: '含印花税合计(元)',
		dataIndex: 'stampTaxFlagTotalAmount',
		key: 'stampTaxFlagTotalAmount'
	},
	{
		title: '关联至合同金额（含印花税，元）',
		dataIndex: 'splitAmount',
		key: 'splitAmount'
	},
	{
		title: '操作',
		dataIndex: 'action',
		scopedSlots: { customRender: 'action' }
	}
];

const columnsInvoiceSell = [
	{
		title: '序号',
		dataIndex: 'key',
		key: 'key'
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
		title: '操作',
		dataIndex: 'action',
		scopedSlots: { customRender: 'action' }
	}
];

const columnsInvoiceDown = [
	{
		title: '序号',
		dataIndex: 'key',
		key: 'key'
	},
	{
		title: '开票日期',
		dataIndex: 'issuedDate',
		key: 'issuedDate'
	},
	{
		title: '编号',
		dataIndex: 'no',
		key: 'no'
	},
	{
		title: '销售方',
		dataIndex: 'mainPartName',
		key: 'mainPartName'
	},
	{
		title: '采购方',
		dataIndex: 'buyerName',
		key: 'buyerName'
	},
	{
		title: '数量',
		dataIndex: 'totalQuantity',
		key: 'totalQuantity'
	},
	{
		title: '价税合计(元)',
		dataIndex: 'totalAmount',
		key: 'totalAmount'
	},
	{
		title: '关联至该合同数量',
		dataIndex: 'splitQuantity',
		key: 'splitQuantity'
	},
	{
		title: '关联至该合同金额(价税合计，元)',
		dataIndex: 'splitAmount',
		key: 'splitAmount'
	},
	{
		title: '操作',
		dataIndex: 'action',
		scopedSlots: { customRender: 'action' }
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
		title: '关联至合同数量',
		key: 'splitAmount',
		dataIndex: 'splitAmount',
		scopedSlots: { customRender: 'splitAmount' },
		width: 300
	},
	{
		title: '关联至合同金额（价税合计，元）',
		key: 'splitQuantity',
		dataIndex: 'splitQuantity',
		scopedSlots: { customRender: 'splitQuantity' },
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

const columnsInTableSell = [
	{
		title: '销售合同编号',
		dataIndex: 'downContractNo',
		key: 'downContractNo',
		width: 300
	},
	{
		title: '合同卖方',
		dataIndex: 'sellerName',
		key: 'sellerName',
		width: 200
	},
	{
		title: '合同买方',
		key: 'buyerName',
		dataIndex: 'buyerName',
		width: 200
	},
	{
		title: '关联销项发票数量',
		key: 'splitQuantity',
		dataIndex: 'splitQuantity',
		width: 200
	},
	{
		title: '关联销项发票金额(价税合计，元)',
		key: 'splitAmount',
		dataIndex: 'splitAmount',
		width: 230
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

export {
	columnsInTable,
	columnsInvoice,
	columnsInvoiceOut,
	columnsInvoiceTrans,
	columnsInvoiceSell,
	columnsInvoiceDown,
	columnsInvoiceRelationContract,
	columnsInTableSell
};
