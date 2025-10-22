const transportationSearchList = [
	{
		decorator: ['serialNo'],
		addonBeforeTitle: '运输合同编号',
		type: 'input',
		placeholder: '请输入运输合同编号'
	},
	{
		decorator: ['companyName'],
		addonBeforeTitle: '企业名称',
		type: 'input',
		placeholder: '请输入承运人或托运人名称'
	},
	{
		decorator: ['transportMode'],
		addonBeforeTitle: '运输方式',
		type: 'select',
		allowClear: true,
		placeholder: '请选择运输方式',
		options: [
			{ label: '火运', value: 'TRAIN' },
			{ label: '汽运', value: 'AUTOMOBILE' },
			{ label: '船运', value: 'SHIP' }
		]
	},
	{
		decorator: ['issuedDate'],
		addonBeforeTitle: '签订日期',
		type: 'rangePicker',
		allowClear: true,
		realKey: ['signTimeStart', 'signTimeEnd']
	}
];
const warehouseSearchList = [
	{
		decorator: ['serialNo'],
		addonBeforeTitle: '仓储合同编号',
		type: 'input',
		placeholder: '请输入仓储合同编号'
	},
	{
		decorator: ['companyName'],
		addonBeforeTitle: '企业名称',
		type: 'input',
		placeholder: '请输入仓储方或者承租方'
	},
	{
		decorator: ['warehouseId'],
		addonBeforeTitle: '仓库名称',
		type: 'select',
		allowClear: true,
		placeholder: '请选择仓库',
		options: []
	},
	{
		decorator: ['issuedDate'],
		addonBeforeTitle: '签订日期',
		type: 'rangePicker',
		allowClear: true,
		realKey: ['signTimeStart', 'signTimeEnd']
	}
];

// contractType:LOGIC_DELIVER WAREHOUSE_RENT
export const contractSearchList = contractType => {
	switch (contractType) {
		case 'LOGIC_DELIVER':
			return transportationSearchList;
		case 'WAREHOUSE_RENT':
			return warehouseSearchList;
		default:
			return [];
	}
};
