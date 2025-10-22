const previewColumns = [
	{
		title: '序号',
		dataIndex: 'index',
		ckey: 'index',
		calign: 'center',
		customRender: function (t, r, index) {
			return parseInt(index) + 1;
		}
	},
	// 品名
	{ key: 'materialName', dataIndex: 'materialName', title: '品名', with: 100 },
	{ key: 'specs', dataIndex: 'specs', title: '规格', with: 100 },
	{ key: 'materialTexture', dataIndex: 'materialTexture', title: '材质', with: 100 },
	// 产地
	{ key: 'placeOfOrigin', dataIndex: 'placeOfOrigin', title: '产地', with: 200 },
	// 件数
	// { key: "pieceQuantity", dataIndex: "pieceQuantity", title: "件数" },
	// 捆包号
	{ key: 'baleNo', dataIndex: 'baleNo', title: '捆包号', with: 100 },
	// 理重
	// { key: "theoreticalWeight", dataIndex: "theoreticalWeight", title: "理重（吨）" },
	// 计量方式
	// { key: "metrologyWay", dataIndex: "metrologyWay", title: "计量方式", with: 200 },
	// 数量
	{ key: 'quantity', dataIndex: 'quantity', title: '数量（吨）', with: 200 },
	// 仓库
	// 含税单价
	// { key: "presetUnitPrice", dataIndex: "presetUnitPrice", title: "含税单价（元/吨）", with: 300 },
	// 不含税单价
	// { key: 'excludingTaxUnitAmount', dataIndex: 'excludingTaxUnitAmount', title: '不含税单价（元/吨）', with: 300 },
	// 含税金额
	// { key: 'taxAmount', dataIndex: 'taxAmount', title: '含税金额（元）', with: 200 },
	// { key: 'scanStatus', dataIndex: 'scanStatus', title: '文件上传结果' , with: 400},
	{ key: 'scanResult', dataIndex: 'scanResult', title: '文件上传结果', with: 300, scopedSlots: { customRender: 'scanResult' } },
	{
		key: 'position',
		dataIndex: 'position',
		title: '位置',
		with: 100,
		customRender: function (t, r, index) {
			return r.scanStatus == 'FAILURE' ? t : '';
		}
	}
];

const columnsNormal = [
	{
		title: '序号',
		dataIndex: 'index',
		ckey: 'index',
		calign: 'center',
		customRender: function (t, r, index) {
			return parseInt(index) + 1;
		}
	},
	// 品名
	{ key: 'materialName', slots: { title: 'customTitles1' }, scopedSlots: { customRender: 'materialName' } },
	// 材质
	{ key: 'materialTextureName', slots: { title: 'customTitles2' }, scopedSlots: { customRender: 'materialTextureName' } },
	// 规格
	{ key: 'specsName', slots: { title: 'customTitles3' }, scopedSlots: { customRender: 'specsName' } },
	{ key: 'specs', slots: { title: 'customTitles2' }, scopedSlots: { customRender: 'specs' } }
];

const columnsSpec = [
	{
		title: '序号',
		dataIndex: 'index',
		ckey: 'index',
		calign: 'center',
		customRender: function (t, r, index) {
			return parseInt(index) + 1;
		}
	},
	// 品名
	{ key: 'materialName', slots: { title: 'customTitlesMaterialName' }, scopedSlots: { customRender: 'materialName' } },
	// 材质
	{ key: 'materialTexture', slots: { title: 'customTitlesMaterialTexture' }, scopedSlots: { customRender: 'materialTexture' } },
	// 规格
	{ key: 'specs', slots: { title: 'customTitlesAppointSpec' }, scopedSlots: { customRender: 'specs' } }
];

const columnsCommon = [
	// 产地
	{ key: 'placeOfOrigin', slots: { title: 'customTitles4' }, scopedSlots: { customRender: 'placeOfOrigin' }, width: 300 },
	// 捆包号
	{ key: 'baleNo', slots: { title: 'customTitles11' }, scopedSlots: { customRender: 'baleNo' } },
	// 数量
	{ key: 'quantity', slots: { title: 'customTitles5' }, scopedSlots: { customRender: 'quantity' } },

	{ title: '操作', dataIndex: 'action', key: 'action', fixed: 'right', scopedSlots: { customRender: 'action' }, width: 100 }
];

export { previewColumns, columnsNormal, columnsSpec, columnsCommon };
