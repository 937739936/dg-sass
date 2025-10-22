import { myFixed } from '@/v2/utils/factory.js';
// 退款管理-列表
export const refundColumns = [
	{ title: '合同类型', dataIndex: 'contractType' },
	{ title: '合同编号', dataIndex: 'contractNo' },
	{ title: '资金流水号', dataIndex: 'serialNo' },
	{ title: '退款发起方', dataIndex: 'payerName' },
	{ title: '退款接收方', dataIndex: 'receiverName' },
	{ title: '业务类型', dataIndex: 'businessTypeDesc' },
	{
		title: '退款金额(元)',
		dataIndex: 'refundAmount',
		customRender: text => {
			return myFixed(text, 2);
		}
	},
	{ title: '退款日期', dataIndex: 'refundDate' },
	{ title: '状态', dataIndex: 'statusDesc', scopedSlots: { customRender: 'status' } },
	{ title: '创建时间', dataIndex: 'createTime' },
	{ title: '操作', key: 'action', fixed: 'right', scopedSlots: { customRender: 'action' } }
];
// 退款管理-选择合同
export const refundContractColumns = [
	{ title: '合同类型', dataIndex: 'contractType' },
	{ title: '合同编号', dataIndex: 'contractNo' },
	{ title: '卖方企业', dataIndex: 'sellerName' },
	{ title: '买方企业', dataIndex: 'buyerName' },
	{ title: '煤种', dataIndex: 'coalTypeDesc' },
	{ title: '运输方式', dataIndex: 'transportModeDesc' },
	{ title: '业务类型', dataIndex: 'businessTypeDesc' },
	{ title: '合同总数量(吨)', dataIndex: 'quantity' },
	{ title: '已发货数量(吨)', dataIndex: 'deliverQuantity' },
	{
		title: '已付款金额(元)',
		dataIndex: 'payAmount',
		customRender: text => {
			return myFixed(text, 2);
		}
	},
	{ title: '收货人', dataIndex: 'receiverName' },
	{ title: '签订日期', dataIndex: 'signTime' },
	{ title: '操作', key: 'action', fixed: 'right', scopedSlots: { customRender: 'action' } }
];
