const columnsInTable = [
	{
		title: '开票日期',
		dataIndex: 'issuedDate',
		key: 'issuedDate',
		width: 120
	},
	{
		title: '编号',
		dataIndex: 'no',
		width: 100
	},
	{
		title: '账务主体',
		dataIndex: 'mainPartName',
		width: 150
	},
	{
		title: '购买方',
		dataIndex: 'buyerName',
		width: 150,
		sorter: (a, b) => a.date - b.date
	},
	{
		title: '商品名称',
		dataIndex: 'itemNameListStr',
		width: 150
	},
	{
		title: '数量',
		dataIndex: 'totalQuantity',
		width: 100
	},
	{
		title: '单位',
		dataIndex: 'itemUnitListStr',
		width: 100
	},
	{
		title: '不含税金额(元)',
		dataIndex: 'totalAmount',
		width: 150
	},
	{
		title: '税额(元)',
		dataIndex: 'totalTax',
		width: 100
	},
	{
		title: '价税合计(元)',
		dataIndex: 'totalTotalAmount',
		width: 150
	},
	{
		title: '登记日期',
		dataIndex: 'createDate',
		width: 120
	},
	{
		title: '业务线名称',
		dataIndex: 'businessLineNameList',
		width: 200,
		scopedSlots: { customRender: 'businessLineNameList' }
	},
	{
		title: '上游合同编号',
		dataIndex: 'upContractNoList',
		width: 200,
		scopedSlots: { customRender: 'upContractNoList' }
	},
	{
		title: '上游供应商名称',
		dataIndex: 'upCompanyNameList',
		width: 200,
		scopedSlots: { customRender: 'upCompanyNameList' }
	},
	{
		title: '下游合同编号',
		dataIndex: 'downContractNoList',
		width: 200,
		scopedSlots: { customRender: 'downContractNoList' }
	},
	{
		title: '下游客户名称',
		dataIndex: 'downCompanyNameList',
		width: 200,
		scopedSlots: { customRender: 'downCompanyNameList' }
	},
	{
		title: '关联至业务线数量',
		dataIndex: 'splitQuantityList',
		width: 200,
		scopedSlots: { customRender: 'splitQuantityList' }
	},
	{
		title: '关联至业务线金额(价税合计，元)',
		dataIndex: 'splitAmountList',
		width: 250,
		scopedSlots: { customRender: 'splitAmountList' }
	},
	{
		title: '操作',
		key: 'action',
		scopedSlots: { customRender: 'action' },
		fixed: 'right',
		width: 200
	}
];

const columnsInvoice = [
	{
		title: '货物或应税劳务服务名称',
		dataIndex: 'name',
		key: 'name',
		scopedSlots: { customRender: 'name' },
		width: 230
	},
	{
		title: '规格型号',
		dataIndex: 'spec',
		key: 'spec',
		scopedSlots: { customRender: 'spec' },
		width: 120
	},
	{
		title: '计量单位',
		key: 'unit',
		dataIndex: 'unit',
		scopedSlots: { customRender: 'unit' },
		width: 120
	},
	{
		title: '数量',
		key: 'quantity',
		dataIndex: 'quantity',
		scopedSlots: { customRender: 'quantity' },
		width: 120
	},
	{
		title: '单价',
		key: 'unitPrice',
		dataIndex: 'unitPrice',
		scopedSlots: { customRender: 'unitPrice' },
		width: 120
	},
	{
		title: '金额',
		key: 'amount',
		dataIndex: 'amount',
		scopedSlots: { customRender: 'amount' },
		width: 120
	},
	{
		title: '税率（%）',
		key: 'taxRate',
		dataIndex: 'taxRate',
		scopedSlots: { customRender: 'taxRate' },
		width: 120
	},
	{
		title: '税额',
		key: 'tax',
		dataIndex: 'tax',
		scopedSlots: { customRender: 'tax' },
		width: 120
	},
	{
		title: '价税合计',
		key: 'totalAmount',
		dataIndex: 'totalAmount',
		scopedSlots: { customRender: 'totalAmount' },
		width: 120
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

const columnsLine = [
	{
		title: '序号',
		dataIndex: 'key',
		key: 'key',
		width: 80
	},
	{
		title: '业务线',
		dataIndex: 'businessLineName',
		key: 'businessLineName',
		scopedSlots: { customRender: 'businessLineName' }
	},
	{
		title: '上游采购合同编号',
		dataIndex: 'upContractNo',
		key: 'upContractNo',
		scopedSlots: { customRender: 'upContractNo' }
	},
	{
		title: '上游供应商名称',
		dataIndex: 'upCompanyName',
		key: 'upCompanyName',
		scopedSlots: { customRender: 'upCompanyName' }
	},
	{
		title: '下游销售合同编号',
		dataIndex: 'downContractNo',
		key: 'downContractNo',
		scopedSlots: { customRender: 'downContractNo' }
	},
	{
		title: '下游客户名称',
		dataIndex: 'downCompanyName',
		key: 'downCompanyName',
		scopedSlots: { customRender: 'downCompanyName' }
	},
	{
		title: '开票货物数量',
		dataIndex: 'splitQuantity',
		key: 'splitQuantity',
		scopedSlots: { customRender: 'splitQuantity' }
	},
	{
		title: '开票金额(价税合计，元)',
		dataIndex: 'splitAmount',
		key: 'splitAmount',
		scopedSlots: { customRender: 'splitAmount' }
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

export { columnsInTable, columnsInvoice, columnsLine };
