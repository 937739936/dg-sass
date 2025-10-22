// 入库
export const inColumns = [
	{
		title: '序号',
		dataIndex: 'index',
		ckey: 'index',
		calign: 'center',
		customRender: function (t, r, index) {
			return parseInt(index) + 1;
		},
		width: 70
	},
	{ key: 'materialName', slots: { title: 'materialNameTitle' }, scopedSlots: { customRender: 'materialName' }, width: 204 },
	{
		key: 'materialTexture',
		slots: { title: 'materialTextureTitle' },
		scopedSlots: { customRender: 'materialTexture' },
		width: 266
	},
	{ key: 'specs', slots: { title: 'specsTitle' }, scopedSlots: { customRender: 'specs' }, width: 266 },
	{ key: 'placeOfOrigin', slots: { title: 'placeOfOriginTitle' }, scopedSlots: { customRender: 'placeOfOrigin' }, width: 212 },
	{ key: 'quantity', slots: { title: 'pieceQuantityTitle' }, scopedSlots: { customRender: 'quantity' }, width: 116 },
	{ key: 'weight', slots: { title: 'quantityTitle' }, scopedSlots: { customRender: 'weight' }, width: 164 },
	{ key: 'baleNo', slots: { title: 'baleNoTitle' }, scopedSlots: { customRender: 'baleNo' }, width: 266 },
	{ key: 'operateDate', slots: { title: 'operateDateTitle' }, scopedSlots: { customRender: 'operateDate' }, width: 150 },
	{ key: 'vehicleShipNo', slots: { title: 'vehicleShipNoTitle' }, scopedSlots: { customRender: 'vehicleShipNo' }, width: 116 },
	{ key: 'remark', slots: { title: 'remarkTitle' }, scopedSlots: { customRender: 'remark' }, width: 222 }
];
// 出库
export const outColumns = [
	{
		title: '序号',
		dataIndex: 'cindex',
		ckey: 'cindex',
		calign: 'center',
		customRender: function (t, r, index) {
			return parseInt(index) + 1;
		},
		width: 70
	},
	{ key: 'materialName', slots: { title: 'materialNameTitle' }, scopedSlots: { customRender: 'materialName' }, width: 204 },
	{
		key: 'materialTexture',
		slots: { title: 'materialTextureTitle' },
		scopedSlots: { customRender: 'materialTexture' },
		width: 266
	},
	{ key: 'specs', slots: { title: 'specsTitle' }, scopedSlots: { customRender: 'specs' }, width: 266 },
	{ key: 'placeOfOrigin', slots: { title: 'placeOfOriginTitle' }, scopedSlots: { customRender: 'placeOfOrigin' }, width: 212 },
	{ key: 'quantity', slots: { title: 'pieceQuantityTitle' }, scopedSlots: { customRender: 'quantity' }, width: 116 },
	{ key: 'weight', slots: { title: 'quantityTitle' }, scopedSlots: { customRender: 'weight' }, width: 164 },
	{ key: 'baleNo', slots: { title: 'baleNoTitle' }, scopedSlots: { customRender: 'baleNo' }, width: 266 },
	{
		key: 'inventoryQuantity',
		slots: { title: 'inventoryPieceQuantityTitle' },
		scopedSlots: { customRender: 'inventoryQuantity' },
		width: 132
	},
	{
		key: 'inventoryWeight',
		slots: { title: 'inventoryQuantityTitle' },
		scopedSlots: { customRender: 'inventoryWeight' },
		width: 132
	},
	{ key: 'vehicleShipNo', slots: { title: 'vehicleShipNoTitle' }, scopedSlots: { customRender: 'vehicleShipNo' }, width: 116 },
	{ key: 'remark', slots: { title: 'remarkTitle' }, scopedSlots: { customRender: 'remark' }, width: 222 }
];
// 默认添加的对象
export const defaultObj = {
	// 品名
	materialName: '',
	// 材质
	materialTexture: '',
	// 规格
	specs: '',
	// 产地
	placeOfOrigin: '',
	// 出入库件数
	quantity: '',
	// 出入库重量
	weight: '',
	// 捆包号
	baleNo: '',
	// 理论库存数量
	inventoryQuantity: '',
	// 理论库存重量
	inventoryWeight: '',
	// 操作日期
	operateDate: '',
	// 车船号
	vehicleShipNo: '',
	// 备注
	remark: ''
	// 前端用
	// mainId: '',
};
export const defaultInObj = {
	// 品名
	materialName: { text: '', textRegion: [] },
	// 材质
	materialTexture: { text: '', textRegion: [] },
	// 规格
	specs: { text: '', textRegion: [] },
	// 产地
	placeOfOrigin: { text: '', textRegion: [] },
	// 出入库件数
	quantity: { text: '', textRegion: [] },
	// 出入库重量
	weight: { text: '', textRegion: [] },
	// 捆包号
	baleNo: { text: '', textRegion: [] },
	// 理论库存数量
	inventoryQuantity: { text: '', textRegion: [] },
	// 理论库存重量
	inventoryWeight: { text: '', textRegion: [] },
	// 操作日期
	operateDate: { text: '', textRegion: [] },
	// 车船号
	vehicleShipNo: { text: '', textRegion: [] },
	// 备注
	remark: { text: '', textRegion: [] }
	// 前端用
	// mainId: '',
};
export const tipInfo = {
	materialNameTitle: {
		OUT: '可输入出库单中的品种',
		IN: '可输入入库单中的品种、品名、货物品名'
	},
	materialTextureTitle: {
		OUT: '可输入出库单中的材质',
		IN: '可输入入库单中的钢种、材质'
	},
	specsTitle: {
		OUT: '可输入出库单中的规格',
		IN: '可输入入库单中的规格'
	},
	placeOfOriginTitle: {
		OUT: '可输入出库单中的厂家',
		IN: '可输入入库单中的产地、钢厂'
	},
	pieceQuantityTitle: {
		OUT: '可输入出库单中的出库数量',
		IN: '可输入入库单中的张数/件数、数量/件数、数量、入库数量、件数(件)、数量(件)'
	},
	quantityTitle: {
		OUT: '可输入出库单中的出库重量',
		IN: '可输入入库单中的净重、重量/吨、吨位、入库重量、重量(吨)、重量、入库重量(吨)'
	},
	baleNoTitle: {
		OUT: '可输入出库单中的捆包号',
		IN: '可输入入库单中的捆包号、批次号、钢卷号'
	},
	operateDateTitle: {
		OUT: '',
		IN: '可输入入库单中的验收入库时间、入库时间、日期'
	},
	inventoryPieceQuantityTitle: {
		OUT: '根据您选择品材规厂家，系统自动计算出理论库存数量',
		IN: ''
	},
	inventoryQuantityTitle: {
		OUT: '根据您选择品材规厂家，系统自动计算出理论库存重量',
		IN: ''
	},

	vehicleShipNoTitle: {
		OUT: '可输入出库单中的车船号',
		IN: '可输入入库单中的车号、车船号、船号'
	},
	remarkTitle: {
		OUT: '可输入出库单中的备注',
		IN: '可输入入库单中的备注'
	}
};
