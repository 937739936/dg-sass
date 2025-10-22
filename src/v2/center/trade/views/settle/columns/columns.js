// import {filterCodeByValueName} from '@sub/utils/globalCode.js';
const customRender = text => text || '-'; //空数据用-代替
export const SettleOnlineListColumns = function (that) {
	return [
		{
			title: '结算单号',
			dataIndex: 'serialNo',
			customRender
		},
		{
			title: '合同编号',
			dataIndex: 'contractNo',
			customRender
		},
		{
			title: '卖方企业',
			dataIndex: 'sellerName',
			customRender
		},
		{
			title: '买方企业',
			dataIndex: 'buyerName',
			customRender
		},
		{
			title: '结算金额(元)',
			dataIndex: 'currentSettleAmount',
			scopedSlots: { customRender: 'Amount' }
		},
		{
			title: '结算数量(吨)',
			dataIndex: 'settleQuantity',
			scopedSlots: { customRender: 'Quantity' }
		},
		{
			title: '结算单价(元/吨)',
			dataIndex: 'settleUnitPrice',
			scopedSlots: { customRender: 'Amount' }
		},
		{
			title: '结算日期',
			dataIndex: 'settleTime',
			customRender
		},
		{
			title: '结算单状态',
			dataIndex: 'statusDesc',
			fixed: 'right',
			scopedSlots: { customRender: 'invalidStatusDesc' }
		},
		{
			key: 'action',
			fixed: 'right',
			title: '操作',
			customRender: (text, items) => {
				return that.actionMinDiv(items);
			}
		}
	];
};
export const SettleOfflineListColumns = function (that) {
	return [
		{
			title: '合同编号',
			dataIndex: 'paperContractNo',
			customRender
		},
		{
			title: '卖方企业',
			dataIndex: 'sellerName',
			customRender
		},
		{
			title: '买方企业',
			dataIndex: 'buyerName',
			customRender
		},
		{
			title: '结算日期',
			dataIndex: 'statementTime',
			customRender
		},
		{
			title: '结算金额(元)',
			dataIndex: 'settleAmount',
			scopedSlots: { customRender: 'Amount' }
		},
		{
			title: '结算数量(吨)',
			dataIndex: 'settleQuantity',
			scopedSlots: { customRender: 'Quantity' }
		},
		{
			title: '结算单价(元/吨)',
			dataIndex: 'settleUnitPrice',
			scopedSlots: { customRender: 'Amount' }
		},
		{
			title: '结算单状态',
			dataIndex: 'statusDesc',
			fixed: 'right',
			scopedSlots: { customRender: 'statusDesc' }
		},
		{
			title: '操作',
			fixed: 'right',
			customRender: (text, items) => {
				return that.actionMinDiv(items);
			}
		}
	];
};
// 选择电子合同弹窗
export const selectOnlineContractColumns = [
	{ title: '合同编号', dataIndex: 'contractNo', fixed: 'left', customRender },
	{
		title: '卖方企业',
		dataIndex: 'sellerName',
		customRender
	},
	{
		title: '买方企业',
		dataIndex: 'buyerName',
		customRender
	},
	{ title: '收货人', dataIndex: 'receiverName', customRender },
	{
		title: '交货期限',
		dataIndex: 'deliveryStartDate',
		scopedSlots: { customRender: 'deliveryStartDate' }
	},
	{ title: '签订日期', dataIndex: 'signTime', customRender },
	{ title: '运输方式', dataIndex: 'transportModeDesc', customRender },
	{ title: '数量(吨)', dataIndex: 'quantity', scopedSlots: { customRender: 'Quantity' } },
	{ title: '基准价格(元/吨)', dataIndex: 'basePrice', scopedSlots: { customRender: 'basePrice' } },
	{ title: '品名', dataIndex: 'goodsName', customRender },
	{ title: '煤种', dataIndex: 'coalTypeDesc', customRender },
	{ title: '订单编号', dataIndex: 'orderNo', customRender }
];
// 选择线下合同弹窗
export const selectOfflineContractColumns = [
	{ title: '合同编号', dataIndex: 'paperContractNo', fixed: 'left', customRender },
	{
		title: '卖方企业',
		dataIndex: 'sellerName',
		customRender
	},
	{
		title: '买方企业',
		dataIndex: 'buyerName',
		customRender
	},
	{ title: '收货人', dataIndex: 'receiverName', customRender },
	{
		title: '交货期限',
		dataIndex: 'deliveryStartDate',
		scopedSlots: { customRender: 'deliveryStartDate' }
	},
	{ title: '签订日期', dataIndex: 'contractSignTime', customRender },
	{ title: '运输方式', dataIndex: 'transTypeDesc', customRender },
	{ title: '数量(吨)', dataIndex: 'contractQuantity', scopedSlots: { customRender: 'Quantity' } },
	{ title: '基准价格(元/吨)', dataIndex: 'contractPrice', scopedSlots: { customRender: 'contractPrice' } },
	{ title: '品名', dataIndex: 'goodsName', customRender }
];
//发运信息table colums
export const deliverDtoColumns = [
	{ title: '发货批次号', dataIndex: 'batchNo', scopedSlots: { customRender: 'batchNo' } },
	{ title: '运输方式', dataIndex: 'despatchTypeDesc', customRender },
	{ title: '发货数量(吨)', dataIndex: 'deliverQuantity', scopedSlots: { customRender: 'Quantity' } },
	{ title: '收货数量(吨)', dataIndex: 'receiveQuantity', scopedSlots: { customRender: 'Quantity' } },
	{ title: '发货日期', dataIndex: 'deliverDate', customRender },
	{ title: '最后收货日期', dataIndex: 'recentReceiveDate', customRender },
	{ title: '状态', dataIndex: 'status', scopedSlots: { customRender: 'status' } }
];
//货转信息table colums
export const goodsTransferColumns = [
	{ title: '货转编号', dataIndex: 'no', scopedSlots: { customRender: 'goodsTransferNo' } },
	{ title: '发运方式', dataIndex: 'transportModeDesc', customRender },
	{ title: '货转数量(吨)', dataIndex: 'goodsTransferQuantity', scopedSlots: { customRender: 'Quantity' } },
	{ title: '货转日期', dataIndex: 'signDate', customRender },
	{ title: '收货人', dataIndex: 'receiverName', customRender },
	{ title: '状态', dataIndex: 'status', scopedSlots: { customRender: 'status' } }
];
//附件展示信息
export const filesColumns = [
	{ title: '文件类型', dataIndex: 'typeDesc' },
	{ title: '文件名称', dataIndex: 'fileName' },
	{ title: '文件编号', dataIndex: 'no' },
	{ title: '签订日期', dataIndex: 'signTime' },
	{ title: '操作', dataIndex: 'action', scopedSlots: { customRender: 'action' }, align: 'center', fixed: 'right' }
];
//操作日志展示信息
export const auditLogListColumns = [
	{ title: '操作类型', dataIndex: 'operationType', customRender },
	{
		title: '操作人',
		dataIndex: 'operationByuser',
		customRender: (text, items) => {
			return items.operationBy ? items.operationBy.slice(0, items.operationBy.lastIndexOf('-')) : '-';
		}
	},
	{
		title: '所属公司',
		dataIndex: 'operationBy',
		customRender: (text, items) => {
			return items.operationBy ? items.operationBy.slice(items.operationBy.lastIndexOf('-') + 1) : '-';
		}
	},
	{ title: '操作内容', dataIndex: 'comments', customRender },
	{ title: '操作时间', dataIndex: 'operationTime', customRender }
];
