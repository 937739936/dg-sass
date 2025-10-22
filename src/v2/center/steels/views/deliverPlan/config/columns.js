const trainColumns = [
	{
		title: '序号',
		dataIndex: '',
		key: 'rowIndex',
		align: 'center',
		width: 80,
		customRender: function (t, r, index) {
			return parseInt(index) < 9 ? '0' + (parseInt(index) + 1) : parseInt(index) + 1;
		}
	},
	{ title: '品名', dataIndex: 'materialName', scopedSlots: { customRender: 'materialName' } },
	{ title: '材质', dataIndex: 'materialTexture', scopedSlots: { customRender: 'materialTexture' } },
	{ title: '规格', dataIndex: 'specs', scopedSlots: { customRender: 'specs' } },
	{ title: '捆包号', dataIndex: 'baleNo', scopedSlots: { customRender: 'baleNo' } },
	{ title: '发货数量', dataIndex: 'shipmentAmount', scopedSlots: { customRender: 'shipmentAmount' } },
	{ title: '发货重量(吨)', dataIndex: 'shipmentQuantity', scopedSlots: { customRender: 'shipmentQuantity' } },
	{ title: '备注', dataIndex: 'remark', scopedSlots: { customRender: 'remark' } },
	{ title: '操作', scopedSlots: { customRender: 'operation' }, width: 100, dataIndex: 'operation', fixed: 'right' }
];
const trucksColumns = [
	{
		title: '序号',
		dataIndex: '',
		key: 'rowIndex',
		align: 'center',
		width: 80,
		customRender: function (t, r, index) {
			return parseInt(index) < 9 ? '0' + (parseInt(index) + 1) : parseInt(index) + 1;
		}
	},
	{ title: '品名', dataIndex: 'materialName', scopedSlots: { customRender: 'materialName' } },
	{ title: '材质', dataIndex: 'materialTexture', scopedSlots: { customRender: 'materialTexture' } },
	{ title: '规格', dataIndex: 'specs', scopedSlots: { customRender: 'specs' } },
	{ title: '捆包号', dataIndex: 'baleNo', scopedSlots: { customRender: 'baleNo' } },
	{ title: '发货数量', dataIndex: 'shipmentAmount', scopedSlots: { customRender: 'shipmentAmount' } },
	{ title: '发货重量(吨)', dataIndex: 'shipmentQuantity', scopedSlots: { customRender: 'shipmentQuantity' } },
	{ title: '车牌号', dataIndex: 'plateNumber', scopedSlots: { customRender: 'plateNumber' } },
	{ title: '车辆出厂日期', dataIndex: 'startDate', scopedSlots: { customRender: 'startDate' } },
	{ title: '备注', dataIndex: 'remark', scopedSlots: { customRender: 'remark' } },
	{ title: '操作', scopedSlots: { customRender: 'operation' }, width: 100, dataIndex: 'operation', fixed: 'right' }
];
const trucksUpdateColumns = [
	{
		title: '序号',
		dataIndex: '',
		key: 'rowIndex',
		align: 'center',
		width: 80,
		customRender: function (t, r, index) {
			return parseInt(index) < 9 ? '0' + (parseInt(index) + 1) : parseInt(index) + 1;
		}
	},
	{ title: '品名', dataIndex: 'materialName', scopedSlots: { customRender: 'materialName' } },
	{ title: '材质', dataIndex: 'materialTexture', scopedSlots: { customRender: 'materialTexture' } },
	{ title: '规格', dataIndex: 'specs', scopedSlots: { customRender: 'specs' } },
	{ title: '捆包号', dataIndex: 'baleNo', scopedSlots: { customRender: 'baleNo' } },
	{ title: '发货数量', dataIndex: 'shipmentAmount', scopedSlots: { customRender: 'shipmentAmount' } },
	{ title: '发货重量(吨)', dataIndex: 'shipmentQuantity', scopedSlots: { customRender: 'shipmentQuantity' } },
	{ title: '车牌号', dataIndex: 'plateNumber', scopedSlots: { customRender: 'plateNumber' } },
	{ title: '车辆出厂日期', dataIndex: 'startDate', scopedSlots: { customRender: 'startDate' } },
	{ title: '到库状态', dataIndex: 'arriveStatusDesc', scopedSlots: { customRender: 'arriveStatusDesc' }, width: 100 },
	{ title: '备注', dataIndex: 'remark', scopedSlots: { customRender: 'remark' } },
	{ title: '操作', scopedSlots: { customRender: 'operation' }, width: 100, dataIndex: 'operation', fixed: 'right' }
];

export { trainColumns, trucksColumns, trucksUpdateColumns };
