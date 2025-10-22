import contract from '../../../mixins/contract';

const columns = [
	{
		title: '提货申请单号',
		dataIndex: 'serialNo',
		key: 'serialNo',
		width: 290
	},
	{
		title: '申请提货企业',
		dataIndex: 'createCompanyName',
		key: 'createCompanyName',
		width: 190
	},
	{
		title: '申请提货总件数',
		dataIndex: 'pieceQuantityTotal',
		key: 'pieceQuantityTotal',
		width: 150
	},
	{
		title: '申请提货总数量(吨)',
		dataIndex: 'quantityTotal',
		key: 'quantityTotal',
		width: 170
	},
	{
		title: '钢材品类',
		dataIndex: 'steelType',
		key: 'steelType',
		width: 150,
		scopedSlots: { customRender: 'steelType' }
	},
	{
		title: '提货方式',
		dataIndex: 'takeType',
		key: 'takeType',
		width: 120,
		slots: { title: 'takeType' },
		scopedSlots: { customRender: 'takeType' }
	},
	{
		title: '预计提货日期',
		dataIndex: 'expectTakeDate',
		key: 'expectTakeDate',
		width: 120
	},
	{
		title: '提货申请创建时间',
		dataIndex: 'createdDate',
		key: 'createdDate',
		width: 200
	},
	{
		title: '合同编号',
		dataIndex: 'contractNo',
		key: 'contractNo',
		width: 290
	}
];
const contractStep1Columns = [
	{
		title: '合同编号',
		dataIndex: 'contractNo',
		width: 250
	},
	{
		title: '卖方名称',
		dataIndex: 'sellCompanyName',
		width: 200
	},
	{
		title: '买方名称',
		dataIndex: 'buyCompanyName',
		width: 200
	},
	{
		title: '合同数量(吨)',
		dataIndex: 'quantity',
		width: 160
	},
	{
		title: '已开具提单数量(吨)',
		dataIndex: 'takeDeliveryQuantity',
		width: 160
	},
	{
		title: '合同期限',
		dataIndex: 'effectiveDate',
		slots: { title: 'effectiveDate' },
		scopedSlots: { customRender: 'effectiveDate' },
		width: 240
	}
];

export { columns, contractStep1Columns };
