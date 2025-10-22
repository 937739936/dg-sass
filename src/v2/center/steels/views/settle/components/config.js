// 结算信息 指定规格
export const appJsColumns = [
	{
		title: '序号',
		dataIndex: 'index',
		key: 'index',
		align: 'center',
		customRender: function (t, r, index) {
			return r.transferQuantity != '总计' ? parseInt(index) + 1 : '总计';
		},
		width: 80
	},
	{
		title: '品名',
		dataIndex: 'materialName',
		scopedSlots: {
			customRender: 'materialName'
		}
	},
	{
		title: '材质',
		dataIndex: 'materialTexture',
		scopedSlots: {
			customRender: 'materialTexture'
		}
	},
	{
		title: '规格',
		dataIndex: 'specs',
		scopedSlots: {
			customRender: 'specs'
		}
	},
	{
		title: '产地',
		dataIndex: 'placeOfOrigin',
		width: 100,
		scopedSlots: {
			customRender: 'placeOfOrigin'
		}
	},
	{
		title: '本次结算数量（吨）',
		dataIndex: 'currentSettleQuantity',
		scopedSlots: {
			customRender: 'currentSettleQuantity'
		},
		width: 120
	},
	{
		title: '结算不含税单价（元）',
		dataIndex: 'currentSettleNoAvePrice',
		scopedSlots: {
			customRender: 'currentSettleNoAvePrice'
		},
		width: 120
	},
	{
		title: '结算含税单价（元）',
		dataIndex: 'currentSettleAvePrice',
		scopedSlots: {
			customRender: 'currentSettleAvePrice'
		},
		width: 120
	},
	{
		title: '货款价税合计',
		dataIndex: 'currentSettleAmount',
		scopedSlots: {
			customRender: 'currentSettleAmount'
		},
		width: 120
	}
];
// 结算单不指定规格
export const noAppJsColumns = [
	{
		title: '序号',
		dataIndex: 'index',
		key: 'index',
		align: 'center',
		customRender: function (t, r, index) {
			return r.transferQuantity != '总计' ? parseInt(index) + 1 : '总计';
		},
		width: 80
	},
	{
		title: '品名',
		dataIndex: 'materialName',
		scopedSlots: {
			customRender: 'materialName'
		}
	},
	{
		title: '材质',
		dataIndex: 'materialTexture',
		scopedSlots: {
			customRender: 'materialTexture'
		}
	},
	{
		title: '规格',
		dataIndex: 'specs',
		scopedSlots: {
			customRender: 'specs'
		}
	},
	{
		title: '产地',
		dataIndex: 'placeOfOrigin',
		scopedSlots: {
			customRender: 'placeOfOrigin'
		},
		width: 100
	},
	{
		title: '本次结算数量（吨）',
		dataIndex: 'currentSettleQuantity',
		scopedSlots: {
			customRender: 'currentSettleQuantity'
		}
	},
	{
		title: '结算不含税单价（元）',
		dataIndex: 'currentSettleNoAvePrice',
		scopedSlots: {
			customRender: 'currentSettleNoAvePrice'
		},
		width: 120
	},
	{
		title: '结算含税单价（元）',
		dataIndex: 'currentSettleAvePrice',
		scopedSlots: {
			customRender: 'currentSettleAvePrice'
		},
		width: 120
	},
	{
		title: '货款价税合计',
		dataIndex: 'currentSettleAmount',
		scopedSlots: {
			customRender: 'currentSettleAmount'
		},
		width: 120
	},
	{
		title: '操作',
		dataIndex: 'action',
		fixed: 'right',
		scopedSlots: {
			customRender: 'action'
		}
	}
];
