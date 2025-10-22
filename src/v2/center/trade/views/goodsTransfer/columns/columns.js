// import {filterCodeByValueName} from '@sub/utils/globalCode.js';
const customRender = text => text || '-'; //空数据用-代替
export const GoodsTransferDOColumns1 = function (that) {
	return [
		{ title: '合同编号', dataIndex: 'contractNo', customRender },
		{ title: '货转编号', dataIndex: 'goodsTransferNo', customRender },
		{ title: '买方企业', dataIndex: 'buyerCompanyName', customRender },
		{ title: '收货人', dataIndex: 'receiverName', customRender },
		{ title: '货转开具日期', dataIndex: 'signDate', customRender },
		{ title: '货转数量(吨)', dataIndex: 'goodsTransferQuantity', scopedSlots: { customRender: 'Amount' } },
		{ title: '发运方式', dataIndex: 'transTypeDesc', customRender },
		{ title: '状态', dataIndex: 'goodsTransferStatusDesc', scopedSlots: { customRender: 'status' } },
		{
			title: '操作',
			fixed: 'right',
			customRender: (text, items) => {
				return that.actionMinDiv(items);
			}
		}
	];
};
export const GoodsTransferDOColumns2 = function (that) {
	return [
		{ title: '合同编号', dataIndex: 'contractNo', customRender },
		{ title: '货转编号', dataIndex: 'goodsTransferNo', customRender },
		{ title: '卖方企业', dataIndex: 'sellerCompanyName', customRender },
		{ title: '收货人', dataIndex: 'receiverName', customRender },
		{ title: '货转开具日期', dataIndex: 'signDate', customRender },
		{ title: '货转数量(吨)', dataIndex: 'goodsTransferQuantity', scopedSlots: { customRender: 'Amount' } },
		{ title: '发运方式', dataIndex: 'transTypeDesc', customRender },
		{ title: '状态', dataIndex: 'goodsTransferStatusDesc', scopedSlots: { customRender: 'status' } },
		{
			title: '操作',
			fixed: 'right',
			customRender: (text, items) => {
				return that.actionMinDiv(items);
			}
		}
	];
};
// 选择合同弹窗
export const selectContractColumns = [
	{ title: '合同编号', dataIndex: 'contractNo', customRender },
	{ title: '买方企业', dataIndex: 'buyerName', customRender },
	{
		title: '收货人',
		dataIndex: 'receiverName',
		customRender
	},
	{ title: '订单数量(吨)', dataIndex: 'quantity', scopedSlots: { customRender: 'Amount' } },
	{
		title: '已发货数量(吨)',
		dataIndex: 'deliverQuantity',
		scopedSlots: { customRender: 'Amount' }
	},
	{ title: '已开具货转数量', dataIndex: 'goodsTransferQuantity', scopedSlots: { customRender: 'Amount' } },
	{
		title: '执行期',
		dataIndex: 'zxq',
		scopedSlots: { customRender: 'zxq' }
	}
];
//火运信息table colums
export const deliverTrainColumns = [
	{ title: '发货批次号', dataIndex: 'batchNo', customRender },
	{ title: '品名', dataIndex: 'goodsName', customRender },
	{ title: '发货数量', dataIndex: 'deliverQuantity', scopedSlots: { customRender: 'Amount' } },
	{ title: '已收货数量', dataIndex: 'receivedQuantity', scopedSlots: { customRender: 'Amount' } },
	{ title: '发货日期', dataIndex: 'deliverDate', customRender },
	{ title: '铁路计划号', dataIndex: 'railwayPlanNo', customRender },
	{ title: '车数', dataIndex: 'trainNum', customRender }
];
//船运信息table colums
export const deliverShipsColumns = [
	{ title: '发货批次号', dataIndex: 'batchNo', scopedSlots: { customRender: 'batchNo' } },
	{ title: '品名', dataIndex: 'goodsName', customRender },
	{ title: '发货数量', dataIndex: 'deliverQuantity', scopedSlots: { customRender: 'Amount' } },
	{ title: '已收货数量', dataIndex: 'receivedQuantity', scopedSlots: { customRender: 'Amount' } },
	{ title: '发货日期', dataIndex: 'deliverDate', customRender },
	{ title: '装货港', dataIndex: 'shipLoadingPortName', customRender },
	{ title: '卸货港', dataIndex: 'shipDischargingPortName', customRender },
	{ title: '船舶信息', scopedSlots: { customRender: 'action' } }
];
//汽运信息table colums
export const deliverTrunksColumns = [
	{ title: '收货编号', dataIndex: 'receiveNo', customRender },
	{ title: '关联发货批次', dataIndex: 'batchNoList', customRender },
	{ title: '品名', dataIndex: 'goodsName', customRender },
	{ title: '收货数量', dataIndex: 'receiveQuantity', scopedSlots: { customRender: 'Amount' } },
	{ title: '收货日期', dataIndex: 'receiveDate', customRender },
	{ title: '车数', dataIndex: 'trainNum', customRender }
];
//货转复用信息table colums
export const referredsColumns = [
	{ title: '货转编号', dataIndex: 'goodsTransferNo', scopedSlots: { customRender: 'goodsTransferNo' } },
	{ title: '货转开具日期', dataIndex: 'signDate', customRender },
	{ title: '货转数量(吨)', dataIndex: 'goodsTransferQuantity', scopedSlots: { customRender: 'Amount' } },
	{ title: '运输方式', dataIndex: 'transTypeDesc', customRender },
	{ title: '合同编号', dataIndex: 'contractNo', customRender },
	{ title: '卖方企业', dataIndex: 'sellerCompanyName', customRender },
	{ title: '买方企业', dataIndex: 'buyerCompanyName', customRender },
	{ title: '货转状态', dataIndex: 'goodsTransferStatusDesc', customRender }
];
