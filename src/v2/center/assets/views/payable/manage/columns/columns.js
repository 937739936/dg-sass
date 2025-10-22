import { filterCodeByKey } from '@sub/utils/globalCode.js';

const customRender = text => text || '-'; //空数据用-代替
export const searchList = [
	{
		decorator: ['integrationNo'],
		addonBeforeTitle: '编号',
		type: 'input',
		placeholder: '请输入合同编号、应付账款流水号、付款单号'
	},
	{
		decorator: ['sellerName'],
		addonBeforeTitle: '卖方名称',
		type: 'input',
		placeholder: '请输入企业名称'
	},
	{
		decorator: ['bankName'],
		addonBeforeTitle: '金融机构',
		type: 'input',
		placeholder: '请输入金融机构'
	},
	{
		decorator: ['paymentTypeStr'],
		addonBeforeTitle: '资金类型',
		type: 'input',
		placeholder: '请输入资金类型'
	},
	{
		decorator: ['type'],
		addonBeforeTitle: '应付账款类型',
		type: 'select',
		placeholder: '请选择应付账款类型',
		options: [
			{ value: 'PROOF', label: '凭证结算' },
			{ value: 'INVOICE', label: '发票结算' }
		]
	},
	{
		decorator: ['transportMode'],
		addonBeforeTitle: '运输方式',
		type: 'select',
		placeholder: '请选择运输方式',
		options: filterCodeByKey('despatchTypeDict')
			.filter(item => item.value != 'TRAIN_ONESELF')
			.map(item => {
				return { value: item.value, label: item.text };
			})
	},
	{
		decorator: ['industryType'],
		addonBeforeTitle: '行业类型',
		type: 'select',
		placeholder: '请选择行业类型',
		options: [
			{ value: 'COAL', label: '煤炭' },
			{ value: 'STEEL', label: '钢材' }
		]
	}
];

export const tabList = [
	{ label: '全部', value: 'TAB_ALL' },
	{ label: '待确认', value: 'TAB_WAIT_CONFIRM', num: 0 },
	{ label: '平台驳回', value: 'TAB_RISK_CONTROL_REJECTION', num: 0 },
	{ label: '待盖章', value: 'TAB_SINGLE_SIGN', num: 0 },
	{ label: '审批中', value: 'TAB_AUDITING' },
	{ label: '可融资', value: 'TAB_FUND_ABLE' },
	{ label: '融资中', value: 'TAB_FUNDING' },
	{ label: '已融资', value: 'TAB_FUNDED' },
	{ label: '无效', value: 'TAB_NOT_EFFECTIVE' }
];

export const columns = [
	{ title: '金融机构', dataIndex: 'bankName', key: 'bankName' },
	{ title: '合同编号', dataIndex: 'contractNo', key: 'contractNo' },
	{ title: '卖方名称', dataIndex: 'sellerName', key: 'sellerName' },
	{ title: '应付账款金额(元)', dataIndex: 'amount', key: 'amount', scopedSlots: { customRender: 'amount' }},
	{
		title: '拟融资金额(元)',
		dataIndex: 'planFinancingAmount',
		key: 'planFinancingAmount',
		scopedSlots: { customRender: 'planFinancingAmount' }
	},
	{ title: '应付账款类型', dataIndex: 'typeText', key: 'typeText' },
	{ title: '应付账款起始日期', dataIndex: 'beginDate', key: 'beginDate' },
	{ title: '应付账款到期日期', dataIndex: 'endDate', key: 'endDate' },
	{ title: '运输方式', dataIndex: 'transportModeDesc', key: 'transportModeDesc' },
	{ title: '行业', dataIndex: 'industryTypeDesc', key: 'industryTypeDesc' },
	{ title: '资金类型', dataIndex: 'paymentTypeName', key: 'paymentTypeName', customRender },
	{ title: '应付账款流水号', dataIndex: 'serialNo', key: 'serialNo' },
	{ title: '状态', dataIndex: 'status', key: 'status', fixed: 'right', scopedSlots: { customRender: 'status' } },
	{ title: '操作', key: 'action', fixed: 'right', scopedSlots: { customRender: 'action' } }
];
