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
		core_1: [
			{
				decorator: ['serialNo'],
				addonBeforeTitle: '编号',
				type: 'input',
				placeholder: '请输入申请、合同、入库或仓单编号'
			},
			{
				decorator: ['holderCompanyName'],
				addonBeforeTitle: '仓单持有人',
				type: 'input',
				placeholder: '请输入企业名称'
			},
			...coreCompanyArr,
			{
				decorator: ['transType'],
				addonBeforeTitle: '提货工具',
				type: 'select',
				placeholder: '请选择提货工具',
				options: [
					{ value: 'AUTOMOBILE', label: '汽运' },
					{ value: 'TRAIN', label: '火运' },
					{ value: 'SHIP', label: '船运' }
				]
			},
			{
				decorator: ['time'],
				addonBeforeTitle: '提货日期',
				type: 'rangePicker',
				realKey: ['beginDate', 'endDate']
			}
		],
		core_2: [
			{
				decorator: ['serialNo'],
				addonBeforeTitle: '编号',
				type: 'input',
				placeholder: '请输入申请、合同、入库或仓单编号'
			},
			{
				decorator: ['deliveryCompanyName'],
				addonBeforeTitle: '提货方',
				type: 'input',
				placeholder: '请输入提货方名称'
			},
			...coreCompanyArr,
			{
				decorator: ['transType'],
				addonBeforeTitle: '提货工具',
				type: 'select',
				placeholder: '请选择提货工具',
				options: [
					{ value: 'AUTOMOBILE', label: '汽运' },
					{ value: 'TRAIN', label: '火运' },
					{ value: 'SHIP', label: '船运' }
				]
			},
			{
				decorator: ['time'],
				addonBeforeTitle: '申请日期',
				type: 'rangePicker',
				realKey: ['beginDate', 'endDate']
			}
		],
		warehouse: [
			{
				decorator: ['serialNo'],
				addonBeforeTitle: '编号',
				type: 'input',
				placeholder: '请输入申请流水号或仓单编号'
			},
			{
				decorator: ['holderCompanyName'],
				addonBeforeTitle: '仓单持有人',
				type: 'input',
				placeholder: '请输入企业名称'
			},
			{
				decorator: ['deliveryCompanyName'],
				addonBeforeTitle: '提货方',
				type: 'input',
				placeholder: '请输入提货方名称'
			},
			{
				decorator: ['transType'],
				addonBeforeTitle: '提货工具',
				type: 'select',
				placeholder: '请选择提货工具',
				options: [
					{ value: 'AUTOMOBILE', label: '汽运' },
					{ value: 'TRAIN', label: '火运' },
					{ value: 'SHIP', label: '船运' }
				]
			},
			{
				decorator: ['time'],
				addonBeforeTitle: '提货日期',
				type: 'rangePicker',
				realKey: ['beginDate', 'endDate']
			}
		],
		admin: [
			{
				decorator: ['serialNo'],
				addonBeforeTitle: '编号',
				type: 'input',
				placeholder: '请输入申请流水号或仓单编号'
			},
			{
				decorator: ['holderCompanyName'],
				addonBeforeTitle: '仓单持有人',
				type: 'input',
				placeholder: '请输入企业名称'
			},
			{
				decorator: ['deliveryCompanyName'],
				addonBeforeTitle: '提货方',
				type: 'input',
				placeholder: '请输入提货方名称'
			},
			{
				decorator: ['warehouseCompanyName'],
				addonBeforeTitle: '仓储企业',
				type: 'input',
				placeholder: '请输入企业名称'
			},
			{
				decorator: ['transType'],
				addonBeforeTitle: '提货工具',
				type: 'select',
				placeholder: '请选择提货工具',
				options: [
					{ value: 'AUTOMOBILE', label: '汽运' },
					{ value: 'TRAIN', label: '火运' },
					{ value: 'SHIP', label: '船运' }
				]
			},
			{
				decorator: ['time'],
				addonBeforeTitle: '提货日期',
				type: 'rangePicker',
				realKey: ['beginDate', 'endDate']
			}
		]
	};
};

export const tabList = function (isCoreCompany) {
	return {
		core_1: [
			{ label: '全部', value: 'TAB_ALL' },
			{ label: '待提交', value: 'TAB_TO_SUBMIT' },
			{ label: '待卖方审核', value: 'TAB_WAIT_SELLER_AUDITING' },
			{ label: '待仓储方审核', value: 'TAB_STORAGE_AUDITING' },
			{ label: '待仓储方盖章', value: 'TAB_STORAGE_SIGN' },
			{ label: '已出库', value: 'TAB_OUTBOUND' },
			{ label: '无效', value: 'TAB_INVALID' }
		],
		core_2: [
			{ label: '全部', value: 'TAB_ALL' },
			{ label: '待我方审核', value: isCoreCompany ? 'TAB_WAIT_SELLER_AUDITING' : 'TAB_MY_AUDITING', num: 0 },
			{ label: '待仓储方审核', value: 'TAB_STORAGE_AUDITING' },
			{ label: '待仓储方盖章', value: 'TAB_STORAGE_SIGN' },
			{ label: '已出库', value: 'TAB_OUTBOUND' },
			{ label: '无效', value: 'TAB_INVALID' }
		],
		warehouse: [
			{ label: '全部', value: 'TAB_ALL_WAREHOUSE' },
			{ label: '待我方审核', value: 'TAB_STORAGE_AUDITING', num: 0 },
			{ label: '待我方盖章', value: 'TAB_STORAGE_SIGN', num: 0 },
			{ label: '已出库', value: 'TAB_OUTBOUND' },
			{ label: '无效', value: 'TAB_INVALID' }
		],
		admin: [
			{ label: '全部', value: 'TAB_ALL' },
			{ label: '待提交', value: 'TAB_TO_SUBMIT' },
			{ label: '待仓储方审核', value: 'TAB_STORAGE_AUDITING' },
			{ label: '待卖方审核', value: 'TAB_WAIT_SELLER_AUDITING' },
			{ label: '待仓储方盖章', value: 'TAB_STORAGE_SIGN' },
			{ label: '已出库', value: 'TAB_OUTBOUND' },
			{ label: '无效', value: 'TAB_INVALID' }
		]
	};
};

export const columns = {
	core_1: [
		{ title: '仓单持有人', dataIndex: 'holderCompanyName', customRender },
		{ title: '货物名称', dataIndex: 'goodsName' },
		{ title: '提货数量（吨）', dataIndex: 'quantity', scopedSlots: { customRender: 'quantity' } },
		{ title: '仓储企业', dataIndex: 'warehouseCompanyName', customRender },
		{ title: '仓库名称', dataIndex: 'stationName', customRender },
		{ title: '出库仓单编号', dataIndex: 'warehouseReceiptNo', scopedSlots: { customRender: 'warehouseReceiptNo' } },
		{ title: '提货工具', dataIndex: 'transTypeDesc' },
		{
			title: '提货日期',
			dataIndex: 'beginDate',
			customRender: (v, r) => {
				let text = '-';
				if (r.beginDate) {
					text = r.beginDate;
				}
				if (r.endDate) {
					text += ' 至 ';
					text += r.endDate;
				}
				return text;
			}
		},
		{ title: '采购合同编号', dataIndex: 'contractNo' },
		{ title: '申请日期', dataIndex: 'createDate' },
		{ title: '提货申请流水号', dataIndex: 'serialNo' },
		{ title: '流程状态', dataIndex: 'statusDesc', fixed: 'right', scopedSlots: { customRender: 'statusDesc' } },
		{ title: '操作', key: 'action', fixed: 'right', scopedSlots: { customRender: 'action' } }
	],
	core_2: [
		{ title: '提货方', dataIndex: 'deliveryCompanyName', customRender },
		{ title: '货物名称', dataIndex: 'goodsName' },
		{ title: '提货数量（吨）', dataIndex: 'quantity', scopedSlots: { customRender: 'quantity' } },
		{ title: '仓储企业', dataIndex: 'warehouseCompanyName', customRender },
		{ title: '仓库名称', dataIndex: 'stationName', customRender },
		{ title: '出库仓单编号', dataIndex: 'warehouseReceiptNo', scopedSlots: { customRender: 'warehouseReceiptNo' } },
		{ title: '提货工具', dataIndex: 'transTypeDesc' },
		{
			title: '提货日期',
			dataIndex: 'beginDate',
			customRender: (v, r) => {
				let text = '-';
				if (r.beginDate) {
					text = r.beginDate;
				}
				if (r.endDate) {
					text += ' 至 ';
					text += r.endDate;
				}
				return text;
			}
		},
		{ title: '销售合同编号', dataIndex: 'contractNo' },
		{ title: '申请日期', dataIndex: 'createDate', customRender },
		{ title: '提货申请流水号', dataIndex: 'serialNo', customRender },
		{ title: '流程状态', dataIndex: 'statusDesc', fixed: 'right', scopedSlots: { customRender: 'statusDesc' } },
		{ title: '操作', key: 'action', fixed: 'right', scopedSlots: { customRender: 'action' } }
	],
	warehouse: [
		{ title: '出库仓单编号', dataIndex: 'warehouseReceiptNo', scopedSlots: { customRender: 'warehouseReceiptNo' } },
		{ title: '货物名称', dataIndex: 'goodsName' },
		{ title: '提货数量（吨）', dataIndex: 'quantity', scopedSlots: { customRender: 'quantity' } },
		{ title: '仓单持有人', dataIndex: 'holderCompanyName', customRender },
		{ title: '提货方', dataIndex: 'deliveryCompanyName', customRender },
		{ title: '仓库名称', dataIndex: 'stationName', customRender },
		{ title: '提货工具', dataIndex: 'transTypeDesc', customRender },
		{
			title: '提货日期',
			dataIndex: 'beginDate',
			customRender: (v, r) => {
				let text = '-';
				if (r.beginDate) {
					text = r.beginDate;
				}
				if (r.endDate) {
					text += ' 至 ';
					text += r.endDate;
				}
				return text;
			}
		},
		{ title: '申请日期', dataIndex: 'createDate' },
		{ title: '提货申请流水号', dataIndex: 'serialNo' },
		{ title: '流程状态', dataIndex: 'statusDesc', fixed: 'right', scopedSlots: { customRender: 'statusDesc' } },
		{ title: '操作', key: 'action', fixed: 'right', scopedSlots: { customRender: 'action' } }
	],
	admin: [
		{ title: '出库仓单编号', dataIndex: 'warehouseReceiptNo', customRender },
		{ title: '货物名称', dataIndex: 'goodsName' },
		{ title: '提货数量（吨）', dataIndex: 'quantity', scopedSlots: { customRender: 'quantity' } },
		{ title: '仓单持有人', dataIndex: 'holderCompanyName' },
		{ title: '提货方', dataIndex: 'deliveryCompanyName' },
		{ title: '仓储企业', dataIndex: 'warehouseCompanyName', customRender },
		{ title: '仓库名称', dataIndex: 'stationName' },
		{ title: '提货工具', dataIndex: 'transTypeDesc' },
		{
			title: '提货日期',
			dataIndex: 'beginDate',
			customRender: (v, r) => {
				let text = '-';
				if (r.beginDate) {
					text = r.beginDate;
				}
				if (r.endDate) {
					text += ' 至 ';
					text += r.endDate;
				}
				return text;
			}
		},
		{ title: '申请日期', dataIndex: 'createDate' },
		{ title: '提货申请流水号', dataIndex: 'serialNo' },
		{ title: '流程状态', dataIndex: 'statusDesc', fixed: 'right', scopedSlots: { customRender: 'statusDesc' } },
		{ title: '操作', key: 'action', fixed: 'right', scopedSlots: { customRender: 'action' } }
	]
};
