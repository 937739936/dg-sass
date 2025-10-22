const columns = [
	{
		title: '合同编号',
		dataIndex: 'contractNo',
		key: 'contractNo',
		scopedSlots: { customRender: 'contractNo' }
	},
	{
		title: '卖方名称',
		dataIndex: 'sellCompanyName',
		key: 'sellCompanyName',
		scopedSlots: { customRender: 'sellCompanyName' }
	},
	{
		title: '合同数量(吨)',
		dataIndex: 'quantity',
		key: 'quantity',
		scopedSlots: { customRender: 'quantity' }
	},
	{
		title: '已开具货转数量(吨)',
		dataIndex: 'total',
		key: 'total',
		scopedSlots: { customRender: 'total' }
	},
	{
		title: '合同期限',
		dataIndex: 'effectiveStartDate',
		key: 'effectiveStartDate',
		scopedSlots: { customRender: 'effectiveStartDate' }
	}
];

export { columns };
