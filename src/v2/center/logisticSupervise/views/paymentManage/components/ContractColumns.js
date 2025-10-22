const customRender = text => text || '-';
// 运输合同特有
export const transportationColumns = [
	{ title: '运输合同编号', dataIndex: 'paperContractNo', fixed: 'left', customRender },
	{
		title: '承运人',
		dataIndex: 'sellerName',
		customRender
	},
	{
		title: '托运人',
		dataIndex: 'buyerName',
		customRender
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
	{ title: '目的地', dataIndex: 'destination', customRender }
];
// 仓储合同
export const warehouseColumns = [
	{ title: '仓储合同编号', dataIndex: 'paperContractNo', fixed: 'left', customRender },
	{ title: '仓库名称', dataIndex: 'stationName',
		customRender: (text, row) => {
			return row.contractDynamicsFields ? `${row.contractDynamicsFields.warehouseName}` : '-';
		}
	},
	{ title: '仓储方名称', dataIndex: 'sellerName', customRender },
	{ title: '承租方名称', dataIndex: 'buyerName', customRender },
	{ title: '合同签订日期', dataIndex: 'contractSignTime', customRender }
];

// contractType: LOGIC_DELIVER WAREHOUSE_RENT
export const contractColumns = contractType => {
	switch (contractType) {
		case 'LOGIC_DELIVER':
			return transportationColumns;
		case 'WAREHOUSE_RENT':
			return warehouseColumns;
		default:
			break;
	}
};
