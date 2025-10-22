// 本次货转清单columns
// 指定规格
export const appointSpecColumns = [
	{
		title: '仓库名',
		dataIndex: 'warehouse',
		key: 'warehouse',
		customRender: text => (text ? text : '-'),
		width: 100
	},
	{ key: 'materialName', title: '品名', dataIndex: 'materialName', scopedSlots: { customRender: 'materialName' } },
	{ key: 'specs', dataIndex: 'specs', title: '规格', scopedSlots: { customRender: 'specs' } },
	{ key: 'materialTexture', title: '材质', dataIndex: 'materialTexture', scopedSlots: { customRender: 'materialTexture' } },
	{ key: 'placeOfOrigin', title: '产地', dataIndex: 'placeOfOrigin', scopedSlots: { customRender: 'placeOfOrigin' } },
	{
		title: '可提件数',
		dataIndex: 'canTakePieceQuantity',
		key: 'canTakePieceQuantity',
		width: 100
	},
	{
		title: '预提件数',
		dataIndex: 'currentApplyPieceQuantity',
		key: 'currentApplyPieceQuantity',
		scopedSlots: { customRender: 'currentApplyPieceQuantity' },
		width: 150
	},
	{
		title: '理重(吨)',
		dataIndex: 'theoreticalWeight',
		key: 'theoreticalWeight',
		width: 100
	},
	{
		title: '可提数量(吨)',
		dataIndex: 'canTakeQuantity',
		key: 'canTakeQuantity',
		width: 120,
		customRender: (text, record) => (text || text === 0 ? text : '/')
	},
	{
		title: '预提数量(吨)',
		dataIndex: 'currentApplyQuantity',
		key: 'currentApplyQuantity',
		width: 120,
		scopedSlots: { customRender: 'currentApplyQuantity' }
	},
	{
		title: '提货单价(元/吨)',
		dataIndex: 'takeUnitPrice',
		key: 'takeUnitPrice',
		width: 140,
		scopedSlots: { customRender: 'takeUnitPrice' }
	},
	{
		title: '计量方式',
		dataIndex: 'metrologyWay',
		key: 'metrologyWay',
		scopedSlots: { customRender: 'metrologyWay' },
		width: 120
	},
	{
		title: '预提捆包号',
		dataIndex: 'baleNo',
		key: 'baleNo',
		scopedSlots: { customRender: 'baleNo' },
		width: 120
	},
	{
		title: '合同含税单价(元/吨)',
		dataIndex: 'presetUnitPrice',
		key: 'presetUnitPrice',
		customRender: (text, record) => (text || text === 0 ? text : '/'),
		width: 180
	},
	{
		title: '合同不含税单价(元/吨)',
		dataIndex: 'excludingTaxAmount',
		key: 'excludingTaxAmount',
		customRender: (text, record) => (text || text === 0 ? text : '/'),
		width: 180
	},
	{
		title: '预提货物含税金额(元)',
		dataIndex: 'goodTaxMount',
		key: 'goodTaxMount',
		width: 180,
		scopedSlots: { customRender: 'goodTaxMount' }
	},
	{
		title: '库位',
		dataIndex: 'warehouseInfo',
		key: 'warehouseInfo',
		width: 150,
		fixed: 'right',
		scopedSlots: { customRender: 'warehouseInfo' }
	},
	{
		title: '备注',
		dataIndex: 'remark',
		scopedSlots: { customRender: 'remark' },
		key: 'remark',
		width: 150,
		fixed: 'right'
	}
];
// 不指定规格
export const noAppointSpecColumns = [
	{
		title: '仓库名',
		dataIndex: 'warehouse',
		key: 'warehouse',
		customRender: text => '-',
		width: 100
	},
	{ key: 'materialName', title: '品名', dataIndex: 'materialName', scopedSlots: { customRender: 'materialName' } },
	{ key: 'specs', dataIndex: 'specs', title: '规格', scopedSlots: { customRender: 'specs' } },
	{ key: 'materialTexture', title: '材质', dataIndex: 'materialTexture', scopedSlots: { customRender: 'materialTexture' } },
	{ key: 'placeOfOrigin', title: '产地', dataIndex: 'placeOfOrigin', scopedSlots: { customRender: 'placeOfOrigin' } },

	{
		title: '预提件数',
		dataIndex: 'currentApplyPieceQuantity',
		key: 'currentApplyPieceQuantity',
		scopedSlots: { customRender: 'currentApplyPieceQuantity' },
		width: 150
	},
	{
		title: '理重(吨)',
		dataIndex: 'theoreticalWeight',
		key: 'theoreticalWeight',
		width: 100
	},
	{
		title: '预提数量(吨)',
		dataIndex: 'currentApplyQuantity',
		key: 'currentApplyQuantity',
		width: 120,
		scopedSlots: { customRender: 'currentApplyQuantity' }
	},
	{
		title: '提货单价(元/吨)',
		dataIndex: 'takeUnitPrice',
		key: 'takeUnitPrice',
		width: 140,
		scopedSlots: { customRender: 'takeUnitPrice' }
	},
	{
		title: '计量方式',
		dataIndex: 'metrologyWay',
		key: 'metrologyWay',
		scopedSlots: { customRender: 'metrologyWay' },
		width: 120
	},
	{
		title: '预提捆包号',
		dataIndex: 'baleNo',
		key: 'baleNo',
		scopedSlots: { customRender: 'baleNo' },
		width: 120
	},
	{
		title: '合同含税单价(元/吨)',
		dataIndex: 'presetUnitPrice',
		key: 'presetUnitPrice',
		customRender: (text, record) => (text || text === 0 ? text : '/'),
		width: 180
	},
	{
		title: '合同不含税单价(元/吨)',
		dataIndex: 'excludingTaxAmount',
		key: 'excludingTaxAmount',
		customRender: (text, record) => (text || text === 0 ? text : '/'),
		width: 180
	},
	{
		title: '预提货物含税金额(元)',
		dataIndex: 'goodTaxMount',
		key: 'goodTaxMount',
		width: 180,
		scopedSlots: { customRender: 'goodTaxMount' }
	},
	{
		title: '库位',
		dataIndex: 'warehouseInfo',
		key: 'warehouseInfo',
		width: 150,
		fixed: 'right',
		scopedSlots: { customRender: 'warehouseInfo' }
	},
	{
		title: '备注',
		dataIndex: 'remark',
		scopedSlots: { customRender: 'remark' },
		key: 'remark',
		width: 150,
		fixed: 'right'
	},
	{ title: '操作', dataIndex: 'action', key: 'action', fixed: 'right', scopedSlots: { customRender: 'action' }, width: 100 }
];

// 实提 指定规格
export const appointSpecRealColumns = [
	{
		title: '实提件数',
		dataIndex: 'realTakePieceQuantity',
		key: 'realTakePieceQuantity',
		width: 120,
		scopedSlots: { customRender: 'realTakePieceQuantity' }
	},
	{
		title: '实提数量',
		dataIndex: 'realTakeQuantity',
		key: 'realTakeQuantity',
		width: 120,
		scopedSlots: { customRender: 'realTakeQuantity' }
	},

	{
		title: '仓库名',
		dataIndex: 'warehouse',
		key: 'warehouse',
		customRender: text => (text ? text : '-'),
		width: 100
	},
	{ key: 'materialName', title: '品名', dataIndex: 'materialName', scopedSlots: { customRender: 'materialName' } },
	{ key: 'specs', dataIndex: 'specs', title: '规格', scopedSlots: { customRender: 'specs' } },
	{ key: 'materialTexture', title: '材质', dataIndex: 'materialTexture', scopedSlots: { customRender: 'materialTexture' } },
	{ key: 'placeOfOrigin', title: '产地', dataIndex: 'placeOfOrigin', scopedSlots: { customRender: 'placeOfOrigin' } },
	{
		title: '可提件数',
		dataIndex: 'canTakePieceQuantity',
		key: 'canTakePieceQuantity',
		width: 100
	},
	{
		title: '预提件数',
		dataIndex: 'currentApplyPieceQuantity',
		key: 'currentApplyPieceQuantity',
		width: 150
	},
	{
		title: '理重(吨)',
		dataIndex: 'theoreticalWeight',
		key: 'theoreticalWeight',
		width: 100
	},
	{
		title: '可提数量(吨)',
		dataIndex: 'canTakeQuantity',
		key: 'canTakeQuantity',
		width: 120,
		customRender: (text, record) => (text || text === 0 ? text : '/')
	},
	{
		title: '预提数量(吨)',
		dataIndex: 'currentApplyQuantity',
		key: 'currentApplyQuantity',
		width: 120
	},
	{
		title: '提货单价(元/吨)',
		dataIndex: 'takeUnitPrice',
		key: 'takeUnitPrice',
		width: 140
	},
	{
		title: '计量方式',
		dataIndex: 'metrologyWay',
		key: 'metrologyWay',

		width: 120
	},
	{
		title: '预提捆包号',
		dataIndex: 'baleNo',
		scopedSlots: { customRender: 'baleNo' },
		key: 'baleNo',

		width: 120
	},
	{
		title: '合同含税单价(元/吨)',
		dataIndex: 'presetUnitPrice',
		key: 'presetUnitPrice',
		customRender: (text, record) => (text || text === 0 ? text : '/'),
		width: 180
	},
	{
		title: '合同不含税单价(元/吨)',
		dataIndex: 'excludingTaxAmount',
		key: 'excludingTaxAmount',
		customRender: (text, record) => (text || text === 0 ? text : '/'),
		width: 180
	},
	{
		title: '预提货物含税金额(元)',
		dataIndex: 'goodTaxMount',
		key: 'goodTaxMount',
		width: 180
	},
	{
		title: '库位',
		dataIndex: 'warehouseInfo',
		key: 'warehouseInfo',
		width: 150,
		fixed: 'right'
	},
	{
		title: '备注',
		dataIndex: 'remark',
		key: 'remark',
		width: 150,
		fixed: 'right'
	}
];

//实提 不指定规格
export const noAppointSpecRealColumns = [
	{
		title: '实提件数',
		dataIndex: 'realTakePieceQuantity',
		key: 'realTakePieceQuantity',
		width: 120,
		scopedSlots: { customRender: 'realTakePieceQuantity' }
	},
	{
		title: '实提数量',
		dataIndex: 'realTakeQuantity',
		key: 'realTakeQuantity',
		width: 120,
		scopedSlots: { customRender: 'realTakeQuantity' }
	},
	{
		title: '仓库名',
		dataIndex: 'warehouse',
		key: 'warehouse',
		customRender: text => '-',
		width: 100
	},
	{ key: 'materialName', title: '品名', dataIndex: 'materialName', scopedSlots: { customRender: 'materialName' } },
	{ key: 'specs', dataIndex: 'specs', title: '规格', scopedSlots: { customRender: 'specs' } },
	{ key: 'materialTexture', title: '材质', dataIndex: 'materialTexture', scopedSlots: { customRender: 'materialTexture' } },
	{ key: 'placeOfOrigin', title: '产地', dataIndex: 'placeOfOrigin', scopedSlots: { customRender: 'placeOfOrigin' } },

	{
		title: '预提件数',
		dataIndex: 'currentApplyPieceQuantity',
		key: 'currentApplyPieceQuantity',
		scopedSlots: { customRender: 'currentApplyPieceQuantity' },
		width: 150
	},
	{
		title: '理重(吨)',
		dataIndex: 'theoreticalWeight',
		key: 'theoreticalWeight',
		width: 100
	},
	{
		title: '预提数量(吨)',
		dataIndex: 'currentApplyQuantity',
		key: 'currentApplyQuantity',
		scopedSlots: { customRender: 'currentApplyQuantity' },
		width: 120
	},
	{
		title: '提货单价(元/吨)',
		dataIndex: 'takeUnitPrice',
		key: 'takeUnitPrice',
		width: 140
	},
	{
		title: '计量方式',
		dataIndex: 'metrologyWay',
		key: 'metrologyWay',
		width: 120
	},
	{
		title: '预提捆包号',
		dataIndex: 'baleNo',
		scopedSlots: { customRender: 'baleNo' },
		key: 'baleNo',
		width: 120
	},
	{
		title: '合同含税单价(元/吨)',
		dataIndex: 'presetUnitPrice',
		key: 'presetUnitPrice',
		customRender: (text, record) => (text || text === 0 ? text : '/'),
		width: 180
	},
	{
		title: '合同不含税单价(元/吨)',
		dataIndex: 'excludingTaxAmount',
		key: 'excludingTaxAmount',
		customRender: (text, record) => (text || text === 0 ? text : '/'),
		width: 180
	},
	{
		title: '预提货物含税金额(元)',
		dataIndex: 'goodTaxMount',
		key: 'goodTaxMount',
		width: 180
	},
	{
		title: '库位',
		dataIndex: 'warehouseInfo',
		key: 'warehouseInfo',
		width: 150,
		fixed: 'right'
	},
	{
		title: '备注',
		dataIndex: 'remark',
		key: 'remark',
		width: 150,
		fixed: 'right'
	},
	{ title: '操作', dataIndex: 'action', key: 'action', fixed: 'right', scopedSlots: { customRender: 'action' }, width: 100 }
];
