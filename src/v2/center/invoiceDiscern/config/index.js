export const listColumns = [
	{ title: '发票代码', dataIndex: 'code' },
	{ title: '发票号码', dataIndex: 'no' },
	{ title: '开票日期', dataIndex: 'issuedDate' },
	{ title: '购买方', dataIndex: 'buyerName' },
	{ title: '销售方', dataIndex: 'sellerName' },
	{ title: '数量', dataIndex: 'quantity' },
	{ title: '金额', dataIndex: 'amount' },
	{ title: '税率', dataIndex: 'taxRate', customRender: text => (text ? `${text * 100}%` : '') },
	{ title: '税额', dataIndex: 'tax' },
	{ title: '价税合计', dataIndex: 'totalAmount' },
	{ title: '发票状态', dataIndex: 'stateDesc' },
	{ title: '上传用户', dataIndex: 'createName' },
	{ title: '上传时间', dataIndex: 'createTime' },

	{ key: 'action', fixed: 'right', with: 200, scopedSlots: { customRender: 'action' }, title: '操作' }
];
export const listColumns2 = [
	{ title: '发票代码', dataIndex: 'code', width: 150 },
	{ title: '发票号码', dataIndex: 'no', width: 150 },
	{ title: '开票日期', dataIndex: 'issuedDate', width: 150 },
	{ title: '购买方', dataIndex: 'buyerName', width: 250 },
	{ title: '销售方', dataIndex: 'sellerName', width: 250 },
	{ title: '数量', dataIndex: 'quantity', width: 150 },
	{ title: '金额', dataIndex: 'amount', width: 150 },
	{ title: '税率', dataIndex: 'taxRate', width: 150, customRender: text => (text ? `${text * 100}%` : '') },
	{ title: '税额', dataIndex: 'tax', width: 150 },
	{ title: '价税合计', dataIndex: 'totalAmount', width: 150 },
	{ title: '发票状态', dataIndex: 'stateDesc', width: 150 },
	{ title: '上传用户', dataIndex: 'createName', width: 150 }
];
export const listDetailColumns = [
	{ title: '发票代码', dataIndex: 'code' },
	{ title: '发票号码', dataIndex: 'no' },
	{ title: '开票日期', dataIndex: 'issuedDate' },
	{ title: '购买方', dataIndex: 'buyerName' },
	{ title: '销售方', dataIndex: 'sellerName' },
	{ title: '货物(劳务)名称', dataIndex: 'name' },
	{ title: '规格型号', dataIndex: 'spec' },
	{ title: '单位', dataIndex: 'unit' },
	{ title: '数量', dataIndex: 'quantity' },
	{ title: '单价', dataIndex: 'unitPrice' },
	{ title: '金额', dataIndex: 'amount' },
	{ title: '税率', dataIndex: 'taxRate', customRender: text => (text ? `${text * 100}%` : '') },
	{ title: '税额', dataIndex: 'tax' },
	{ title: '价税合计', dataIndex: 'totalAmount' },
	{ title: '发票状态', dataIndex: 'stateDesc' },
	{ title: '上传用户', dataIndex: 'createName' },
	{ title: '上传时间', dataIndex: 'createDate' },

	{ key: 'action', fixed: 'right', with: 100, scopedSlots: { customRender: 'action' }, title: '操作' }
];
export const listDetailColumns2 = [
	{ title: '发票代码', dataIndex: 'code', width: 150 },
	{ title: '发票号码', dataIndex: 'no', width: 150 },
	{ title: '开票日期', dataIndex: 'issuedDate', width: 150 },
	{ title: '购买方', dataIndex: 'buyerName', width: 250 },
	{ title: '销售方', dataIndex: 'sellerName', width: 250 },
	{ title: '货物(劳务)名称', dataIndex: 'name', width: 200 },
	{ title: '规格型号', dataIndex: 'spec', width: 200 },
	{ title: '单位', dataIndex: 'unit', width: 150 },
	{ title: '数量', dataIndex: 'quantity', width: 150 },
	{ title: '单价', dataIndex: 'unitPrice', width: 150 },
	{ title: '金额', dataIndex: 'amount', width: 150 },
	{ title: '税率', dataIndex: 'taxRate', width: 150, customRender: text => (text ? `${text * 100}%` : '') },
	{ title: '税额', dataIndex: 'tax', width: 150 },
	{ title: '价税合计', dataIndex: 'totalAmount', width: 150 },
	{ title: '发票状态', dataIndex: 'stateDesc', key: 'stateDesc', width: 150 },
	{ title: '上传用户', dataIndex: 'createName', width: 150 }
];
