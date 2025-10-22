const customRender = text => text || '-'; //空数据用-代替
export const searchList = function (isCoreCompany) {
	const coreCompanyArr = isCoreCompany
		? []
		: [
				{
					decorator: ['warehouseCompanyName'],
					addonBeforeTitle: '仓储企业',
					type: 'input',
					placeholder: '请输入企业名称'
				},
				{
					decorator: ['stationName'],
					addonBeforeTitle: '仓库名称',
					type: 'input',
					placeholder: '请输入仓库名称'
				}
			];

	return {
		core: [
			{ decorator: ['serialNo'], addonBeforeTitle: '仓单编号', type: 'input', placeholder: '请输入仓单编号' },
			...coreCompanyArr,
			{
				decorator: ['warehouseId'],
				addonBeforeTitle: '仓房',
				type: 'select',
				placeholder: '请选择仓房',
				options: []
			},
			{
				decorator: ['goodsAllocationId'],
				addonBeforeTitle: '货位',
				type: 'select',
				placeholder: '请选择货位',
				options: []
			},
			{
				decorator: ['time'],
				addonBeforeTitle: '开立日期',
				type: 'rangePicker',
				realKey: ['beginDate', 'endDate']
			}
		],
		warehouse: [
			{ decorator: ['serialNo'], addonBeforeTitle: '仓单编号', type: 'input', placeholder: '请输入仓单编号' },
			{ decorator: ['bailorCompanyName'], addonBeforeTitle: '存货人', type: 'input', placeholder: '请输入存货人' },
			{ decorator: ['stationName'], addonBeforeTitle: '仓库名称', type: 'input', placeholder: '请输入仓库名称' },
			{
				decorator: ['warehouseId'],
				addonBeforeTitle: '仓房',
				type: 'select',
				placeholder: '请选择仓房',
				options: []
			},
			{
				decorator: ['goodsAllocationId'],
				addonBeforeTitle: '货位',
				type: 'select',
				placeholder: '请选择货位',
				options: []
			},
			{
				decorator: ['time'],
				addonBeforeTitle: '开立日期',
				type: 'rangePicker',
				realKey: ['beginDate', 'endDate']
			}
		],
		admin: [
			{ decorator: ['serialNo'], addonBeforeTitle: '仓单编号', type: 'input', placeholder: '请输入仓单编号' },
			{ decorator: ['bailorCompanyName'], addonBeforeTitle: '存货人', type: 'input', placeholder: '请输入存货人' },
			{ decorator: ['warehouseCompanyName'], addonBeforeTitle: '仓储企业', type: 'input', placeholder: '请输入企业名称' },
			{ decorator: ['stationName'], addonBeforeTitle: '仓库名称', type: 'input', placeholder: '请输入仓库名称' },
			{
				decorator: ['stationId'],
				addonBeforeTitle: '站台',
				type: 'select',
				placeholder: '请选择站台',
				options: []
			},
			{
				decorator: ['warehouseId'],
				addonBeforeTitle: '仓房',
				type: 'select',
				placeholder: '请选择仓房',
				options: []
			},
			{
				decorator: ['goodsAllocationId'],
				addonBeforeTitle: '货位',
				type: 'select',
				placeholder: '请选择货位',
				options: []
			},
			{
				decorator: ['time'],
				addonBeforeTitle: '开立日期',
				type: 'rangePicker',
				realKey: ['beginDate', 'endDate']
			}
		]
	};
};

const cTabList = [
	{ label: '全部', value: 'TAB_ALL' },
	{ label: '生效中', value: 'TAB_EFFECTIVE', num: 0 },
	{ label: '出库中', value: 'TAB_OUTBOUND_IN_PROGRESS' },
	{ label: '已出库', value: 'TAB_OUTBOUND' },
	{ label: '过户中', value: 'TAB_TRANSFER_IN_PROGRESS' },
	{ label: '已核销', value: 'TAB_VERIFIED' },
	{ label: '待仓储方盖章', value: 'TAB_TO_STORAGE_SIGN' },
	{ label: '无效', value: 'TAB_INVALID' }
];
export const tabList = {
	core: cTabList,
	warehouse: cTabList,
	admin: cTabList
};

const cCols = [
	{ title: '仓单编号', dataIndex: 'serialNo' },
	{ title: '货物名称', dataIndex: 'goodsName' },
	{ title: '仓单数量（吨）', dataIndex: 'quantity', scopedSlots: { customRender: 'amount' } },
	{ title: '存货人', dataIndex: 'bailorCompanyName' },
	{ title: '仓储企业', dataIndex: 'warehouseCompanyName' },
	{ title: '仓库名称', dataIndex: 'stationName' },
	{ title: '仓房-货位', dataIndex: 'warehouseGoodsAllocationName' },
	{ title: '仓单开立日期', dataIndex: 'createDateStr' },
	{ title: '仓单状态', dataIndex: 'statusDesc', fixed: 'right', scopedSlots: { customRender: 'status' } },
	{ title: '操作', key: 'action', fixed: 'right', scopedSlots: { customRender: 'action' } }
];
export const columns = {
	core: cCols,
	warehouse: cCols,
	admin: cCols
};
