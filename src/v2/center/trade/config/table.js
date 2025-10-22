const tableParams = [
	{
		name: '全年',
		value: ''
	},
	{
		name: '1月',
		value: ''
	},
	{
		name: '2月',
		value: ''
	},
	{
		name: '3月',
		value: ''
	},
	{
		name: '4月',
		value: ''
	},
	{
		name: '5月',
		value: ''
	},
	{
		name: '6月',
		value: ''
	},
	{
		name: '7月',
		value: ''
	},
	{
		name: '8月',
		value: ''
	},
	{
		name: '9月',
		value: ''
	},
	{
		name: '10月',
		value: ''
	},
	{
		name: '11月',
		value: ''
	},
	{
		name: '12月',
		value: ''
	}
];

const modalStatusOneColumns = [
	{
		title: '合同编号',
		dataIndex: 'contractNo',
		fixed: 'left'
	},
	{
		title: '订单编号',
		dataIndex: 'serialNo'
	},
	{
		title: '卖家名称',
		dataIndex: 'sellerName'
	},
	{
		title: '买家名称',
		dataIndex: 'buyerName'
	},
	{
		title: '合同数量',
		dataIndex: 'quantity'
	},
	{
		title: '合同单价',
		dataIndex: 'basicPrice'
	},
	{
		title: '运输方式',
		dataIndex: 'transTypeDesc'
	},
	{
		title: '合同模板',
		dataIndex: 'contractTemplateDesc'
	},
	{
		title: '订单创建日期',
		dataIndex: 'createTime'
	}
];

const modalStatusTwoColumns = [
	{
		title: '合同编号',
		dataIndex: 'contractNo',
		fixed: 'left'
	},
	{
		title: '订单编号',
		dataIndex: 'serialNo'
	},
	{
		title: '卖家名称',
		dataIndex: 'sellerName'
	},
	{
		title: '买家名称',
		dataIndex: 'buyerName'
	},
	{
		title: '数量',
		dataIndex: 'quantity'
	},
	{
		title: '基准价格',
		dataIndex: 'basicPrice'
	},
	{
		title: '运输方式',
		dataIndex: 'transTypeDesc'
	},
	{
		title: '合同模板',
		dataIndex: 'contractTemplateDesc'
	},
	{
		title: '订单创建日期',
		dataIndex: 'createTime'
	},
	{
		title: '操作',
		key: 'operation',
		scopedSlots: {
			customRender: 'operation'
		}
	}
];

export { tableParams, modalStatusOneColumns, modalStatusTwoColumns };
