const customRender = text => text || '-';
// 选择电子合同弹窗
export const commonColumns = [
	{ title: '合同编号', dataIndex: 'contractNo', fixed: 'left', customRender },
	{
		title: '卖方企业名称',
		dataIndex: 'sellerName',
		customRender
	},
	{ title: '收货人', dataIndex: 'consigneeCompanyName', customRender },
	{
		title: '交货期限',
		dataIndex: 'deliveryStartDate',
		customRender: (text, row) => {
			return `${row.deliveryStartDate || ''}-${row.deliveryEndDate || ''}`;
		}
	}
];

// 选择电子合同弹窗
const onLineOnlyColumns = [
	{ title: '合同编号', dataIndex: 'contractNo', fixed: 'left', customRender },
	{
		title: '卖方企业名称',
		dataIndex: 'sellerName',
		customRender
	},
	{ title: '收货人', dataIndex: 'consigneeCompanyName', customRender },
	{
		title: '交货期限',
		dataIndex: 'deliveryStartDate',
		customRender: (text, row) => {
			return `${row.deliveryStartDate || ''}—${row.deliveryEndDate || ''}`;
		}
	},
	{ title: '签订日期', dataIndex: 'signTime', customRender },
	{ title: '运输方式', dataIndex: 'transportModeDesc', customRender },
	{
		title: '数量(吨)',
		dataIndex: 'quantity',
		scopedSlots: { customRender: 'quantity' }
	},
	{
		title: '基准价格(元/吨)',
		dataIndex: 'basePrice',
		scopedSlots: { customRender: 'basePrice' }
	},
	{ title: '品名', dataIndex: 'goodsName', customRender },
	{ title: '煤种', dataIndex: 'coalTypeDesc', customRender }
];

// 线下合同特有
const offLineOnlyColumns = [
	{ title: '合同编号', dataIndex: 'paperContractNo', fixed: 'left', customRender },
	{
		title: '卖方企业名称',
		dataIndex: 'sellerName',
		customRender
	},
	{ title: '收货人', dataIndex: 'consigneeCompanyName', customRender },
	{
		title: '交货期限',
		dataIndex: 'deliveryStartDate',
		customRender: (text, row) => {
			return `${row.deliveryStartDate || ''}—${row.deliveryEndDate || ''}`;
		}
	},
	{ title: '签订日期', dataIndex: 'contractSignTime', customRender },
	{ title: '运输方式', dataIndex: 'transportModeDesc', customRender },
	{
		title: '合同数量(吨)',
		dataIndex: 'contractQuantity',
		scopedSlots: { customRender: 'quantity' }
	},
	{
		title: '合同单价(元/吨)',
		dataIndex: 'contractPrice',
		scopedSlots: { customRender: 'contractPrice' }
	},
	{ title: '品名', dataIndex: 'goodsName', customRender }
];

// 运输合同特有
export const transportationColumns = [
	{ title: '合同编号', dataIndex: 'paperContractNo', fixed: 'left', customRender },
	{
		title: '承运人',
		dataIndex: 'consigneeCompanyName',
		customRender: (text, row) => {
			return `${row.consigneeCompanyName || row.sellerName}`;
		}
	},
	{
		title: '合同有效期',
		dataIndex: 'execDateStart',
		customRender: (text, row) => {
			return `${row.execDateStart || ''}—${row.execDateEnd || ''}`;
		}
	},
	{ title: '签订日期', dataIndex: 'contractSignTime', customRender },
	{ title: '运输方式', dataIndex: 'transportModeDesc', customRender },
	{ title: '起运地', dataIndex: 'origin', customRender },
	{ title: '目的地', dataIndex: 'destination', customRender },
	{ title: '合同价格(元/吨)', dataIndex: 'contractPrice', scopedSlots: { customRender: 'contractPrice' } },
	{ title: '运输吨数(吨)', dataIndex: 'contractQuantity', scopedSlots: { customRender: 'quantity' } }
];

// contractType: ONLINE / OFFLINE /TRANSPORT
export const contractColumns = contractType => {
	switch (contractType) {
		case 'ONLINE':
			return onLineOnlyColumns;
		case 'OFFLINE': {
			return offLineOnlyColumns;
		}
		case 'TRANSPORT':
			return transportationColumns;
		default:
			break;
	}
};
