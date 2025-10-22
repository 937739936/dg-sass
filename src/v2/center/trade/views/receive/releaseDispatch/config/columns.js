const columns = [
	{
		title: '派车计划编号',
		dataIndex: 'serialNo',
		key: 'serialNo'
	},
	{
		title: '派车单位',
		dataIndex: 'deliveryCompanyName',
		key: 'deliveryCompanyName'
	},
	{
		title: '装货地',
		dataIndex: 'loadPlace',
		key: 'loadPlace'
	},
	{
		title: '卸货地',
		key: 'destination',
		dataIndex: 'destination'
	},
	{
		title: '收货人名称',
		key: 'consigneeCompanyName',
		dataIndex: 'consigneeCompanyName'
	},
	{
		title: '累计发运车次',
		key: 'shipNumberToatl',
		dataIndex: 'shipNumberToatl',
		width: 130
	},
	{
		title: '在途车次',
		key: 'inTransitToatl',
		dataIndex: 'inTransitToatl',
		width: 100
	},
	{
		title: '累计装车重量（吨）',
		key: 'deliverQuantityTotal',
		dataIndex: 'deliverQuantityTotal',
		width: 170
	},
	{
		title: '累计在途重量（吨）',
		key: 'inTransitQuantityTotal',
		dataIndex: 'inTransitQuantityTotal',
		width: 170
	},
	{
		title: '累计卸车重量（吨）',
		key: 'unloadQuantityTotal',
		dataIndex: 'unloadQuantityTotal',
		width: 170
	},
	{
		title: '累计盈亏重量（吨）',
		key: 'profitQuantityTotal',
		dataIndex: 'profitQuantityTotal',
		width: 170
	},
	{
		title: '发运周期',
		key: 'deliveryDate',
		dataIndex: 'deliveryDate'
	},
	{
		title: '合同编号',
		key: 'contractNo',
		dataIndex: 'contractNo',
		scopedSlots: { customRender: 'contractNo' }
	},
	{
		title: '创建时间',
		key: 'createTime',
		dataIndex: 'createTime'
	},
	{
		title: '操作',
		key: 'action',
		scopedSlots: { customRender: 'action' },
		fixed: 'right'
	}
];

const columnsDetails = [
	{
		title: '车牌号',
		key: 'plateNumber',
		dataIndex: 'plateNumber'
	},
	{
		title: '司机姓名',
		key: 'driverName',
		dataIndex: 'driverName'
	},
	{
		title: '联系方式',
		key: 'driverMobile',
		dataIndex: 'driverMobile'
	},
	{
		title: '收款账号',
		key: 'receivableAccountNo',
		dataIndex: 'receivableAccountNo'
	},
	{
		title: '收款户名',
		key: 'receivableAccountName',
		dataIndex: 'receivableAccountName'
	},
	{
		title: '状态',
		key: 'statusDesc',
		dataIndex: 'statusDesc'
	},
	{
		title: '发车时间',
		key: 'deliverDate',
		dataIndex: 'deliverDate'
	},
	{
		title: '发车位置',
		key: 'departurePosition',
		dataIndex: 'departurePosition'
	},
	{
		title: '到站时间',
		key: 'arriveDate',
		dataIndex: 'arriveDate'
	},
	{
		title: '到站位置',
		key: 'arrivePosition',
		dataIndex: 'arrivePosition'
	},
	{
		title: '装车吨位(净重)',
		key: 'deliverQuantity',
		dataIndex: 'deliverQuantity',
		width: 140
	},
	{
		title: '卸货吨位(净重)',
		key: 'unloadQuantity',
		dataIndex: 'unloadQuantity',
		width: 140
	},
	{
		title: '盈亏吨位',
		key: 'profitQuantity',
		dataIndex: 'profitQuantity'
	},
	{
		title: '关联发货批次号',
		key: 'batchNo',
		dataIndex: 'batchNo',
		width: 150
	},
	{
		title: '操作',
		key: 'action',
		scopedSlots: { customRender: 'action' },
		width: 100,
		fixed: 'right'
	}
];

export { columns, columnsDetails };
