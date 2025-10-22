const columns = [
	{
		title: '卖方名称',
		dataIndex: '卖方名称'
	},
	{
		title: '货物分类',
		dataIndex: '货物分类'
	},
	{
		title: '品名',
		dataIndex: '品名'
	},
	{
		title: '材质',
		dataIndex: '材质'
	},
	{
		title: '规格',
		dataIndex: '规格'
	},
	{
		title: '产地',
		dataIndex: '产地'
	},
	{
		title: '库存数量(吨)',
		dataIndex: '库存数量(吨)'
	},
	{
		title: '库存件数',
		dataIndex: '库存件数'
	},
	{
		title: '捆包号',
		dataIndex: '捆包号'
	},
	{
		title: '本次提货件数',
		dataIndex: '本次提货件数',
		slots: { title: '本次提货件数' },
		scopedSlots: { customRender: '本次提货件数' }
	},
	{
		title: '本次提货数量',
		dataIndex: '本次提货数量',
		slots: { title: '本次提货数量' },
		scopedSlots: { customRender: '本次提货数量' }
	}
];

export { columns };
