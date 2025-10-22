const columns = [
	{
		title: '序号',
		dataIndex: 'id',
		key: 'id',
		scopedSlots: { customRender: 'id' }
	},
	{
		title: '品种',
		dataIndex: 'materialName',
		key: 'materialName',
		scopedSlots: { customRender: 'materialName' }
	},
	{
		title: '材质',
		dataIndex: 'materialTexture',
		key: 'materialTexture',
		scopedSlots: { customRender: 'materialTexture' }
	},
	{
		title: '规格',
		dataIndex: 'specs',
		key: 'specs',
		scopedSlots: { customRender: 'specs' }
	},
	{
		title: '产地',
		dataIndex: 'placeOfOrigin',
		key: 'placeOfOrigin',
		scopedSlots: { customRender: 'placeOfOrigin' }
	},
	{
		title: '合同件数',
		dataIndex: 'pieceQuantity',
		key: 'pieceQuantity',
		scopedSlots: { customRender: 'pieceQuantity' }
	},
	{
		title: '捆包号',
		dataIndex: 'date4',
		key: 'date4',
		scopedSlots: { customRender: 'date4' }
	},
	{
		title: '合同数量(吨)',
		dataIndex: 'quantity',
		key: 'quantity',
		scopedSlots: { customRender: 'quantity' }
	},
	{
		title: '剩余件数',
		dataIndex: 'surplusPieceQuantity',
		key: 'surplusPieceQuantity',
		scopedSlots: { customRender: 'surplusPieceQuantity' }
	},
	{
		title: '剩余数量(吨)',
		dataIndex: 'surplusQuantity',
		key: 'surplusQuantity',
		scopedSlots: { customRender: 'surplusQuantity' }
	}
];

const columnsTrans = [
	{
		title: '序号',
		dataIndex: 'id',
		key: 'id',
		scopedSlots: { customRender: 'id' }
	},
	{
		dataIndex: 'materialName',
		key: 'materialName',
		slots: { title: 'materialName' },
		scopedSlots: { customRender: '品名' }
	},
	{
		dataIndex: 'materialTexture',
		key: 'materialTexture',
		slots: { title: 'materialTexture' },
		scopedSlots: { customRender: '材质' }
	},
	{
		dataIndex: 'specs',
		key: 'specs',
		slots: { title: 'specs' },
		scopedSlots: { customRender: '规格' }
	},
	{
		dataIndex: 'placeOfOrigin',
		key: 'placeOfOrigin',
		slots: { title: 'placeOfOrigin' },
		scopedSlots: { customRender: '产地' }
	},
	{
		dataIndex: 'pieceQuantity',
		key: 'pieceQuantity',
		slots: { title: 'pieceQuantity' },
		scopedSlots: { customRender: '件数' }
	},
	{
		title: '捆包号',
		dataIndex: 'id1',
		key: 'id1',
		scopedSlots: { customRender: 'i1d' }
	},
	{
		dataIndex: 'quantity',
		key: 'quantity',
		slots: { title: 'quantity' },
		scopedSlots: { customRender: '数量(吨)' }
	},
	{
		title: '计量方式',
		dataIndex: 'id11',
		key: 'id11',
		scopedSlots: { customRender: 'id11' }
	}
];
const columnsProve = [
	{
		title: '类型',
		dataIndex: 'id11',
		key: 'id11',
		scopedSlots: { customRender: 'id11' }
	},
	{
		title: '操作',
		dataIndex: 'id',
		key: 'id',
		scopedSlots: { customRender: 'id' }
	}
];
export { columns, columnsTrans, columnsProve };
