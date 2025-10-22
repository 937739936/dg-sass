import { filterCodeByValueName } from '@sub/utils/globalCode.js';
const customRender = text => text || '-'; //空数据用-代替
export const releaseRecordColumns = function (that) {
	return [
		{ title: '发货批次号', dataIndex: 'batchNo' },
		{ title: '运输合同编号', dataIndex: 'contractNo' },
		{ title: '承运人', dataIndex: 'sellerName' },
		{ title: '托运人', dataIndex: 'buyerName' },
		{ title: '发货日期', dataIndex: 'deliverDate' },
		{ title: '发货数量(吨)', dataIndex: 'deliverQuantity' },
		{ title: '收货日期', dataIndex: 'receiveDate', key: 'receiveDate', customRender },
		{ title: '收货数量(吨)', dataIndex: 'receiveQuantity', key: 'receiveQuantity' },
		{
			title: '运输方式',
			dataIndex: 'despatchType',
			key: 'despatchType',
			customRender: text => {
				return filterCodeByValueName(text, 'despatchTypeDict') || text;
			}
		},
		{ title: '状态', dataIndex: 'status', key: 'status', scopedSlots: { customRender: 'status' }, width: 150 },
		{ title: '创建人', dataIndex: 'createName' },
		{ title: '创建时间', dataIndex: 'createTime' },
		{
			title: '操作',
			fixed: 'right',
			customRender: (text, items) => {
				return that.actionMinDiv(items);
			}
		}
	];
};
export const trajectoryColumns = function (that) {
	return [
		{ title: '发货批次号', dataIndex: 'batchNo' },
		{ title: '运输合同编号', dataIndex: 'contractNo' },
		{ title: '承运人', dataIndex: 'sellerName' },
		{ title: '托运人', dataIndex: 'buyerName' },
		{ title: '发货日期', dataIndex: 'deliverDate' },
		{ title: '发货数量(吨)', dataIndex: 'deliverQuantity' },
		{
			title: '运输方式',
			dataIndex: 'despatchType',
			key: 'despatchType',
			customRender: text => {
				return filterCodeByValueName(text, 'despatchTypeDict') || text;
			}
		},
		{ title: '状态', dataIndex: 'status', key: 'status', scopedSlots: { customRender: 'status' }, width: 150 },
		{
			title: '操作',
			fixed: 'right',
			customRender: (text, items) => {
				return that.actionMinDiv(items);
			}
		}
	];
};

export const deliverColumns = [
	{ title: '发货批次号', dataIndex: 'deliverNo' },
	{
		title: '发运类型',
		dataIndex: 'transInfo',
		scopedSlots: { customRender: 'deliveryDespatchType' }
	},
	{ title: '发货数量(吨)', dataIndex: 'transInfo.deliverQuantity' },
	{
		title: '已收货数量(吨)',
		dataIndex: 'receiveQuantity',
		customRender: text => {
			return text || 0;
		}
	},
	{ title: '发货日期', dataIndex: 'transInfo.deliverDate' },
	{ title: '', dataIndex: 'action', key: 'action', align: 'right' }
];
// 确认收货页面 已收货table  receivedColumns
export const receivedColumns = [
	{ title: '收货编号', dataIndex: 'receiveNo', key: 'receiveNo', scopedSlots: { customRender: 'receiveNo' } },
	{
		title: '关联发货批次',
		dataIndex: 'deliverNo',
		key: 'deliverNo',
		scopedSlots: { customRender: 'deliverNo' }
	},
	{
		title: '收货方式',
		dataIndex: 'receiveType',
		key: 'receiveType',
		scopedSlots: { customRender: 'receiveType' }
	},
	{ title: '收货数量(吨)', dataIndex: 'receiveQuantity', key: 'receiveQuantity' },
	{ title: '收货日期', dataIndex: 'receiveDate', key: 'receiveDate' },
	{
		title: '附件',
		dataIndex: 'fileInfoList',
		key: 'fileInfoList',
		width: 300,
		scopedSlots: { customRender: 'fileInfoList' }
	}
];

// 船舶信息列表
export const shipColumns = [
	{ title: '船舶MMSI', dataIndex: 'mmsi', customRender },
	{ title: '船舶名称', dataIndex: 'shipName', customRender },
	{ title: '装货量（吨）', dataIndex: 'deliverQuantity', scopedSlots: { customRender: 'Amount' } },
	{ title: '航次号', dataIndex: 'voyageNo', customRender },
	{ title: '始发港', dataIndex: 'originPortName', customRender },
	{ title: '到达始发港时间', dataIndex: 'originPortInTime', customRender },
	{ title: '目的港', dataIndex: 'destinationPortName', customRender },
	{ title: '到达目的港时间', dataIndex: 'destinationPortTime', customRender },
	{ title: '操作', fixed: 'right', scopedSlots: { customRender: 'action' } }
];

// 普通业务类型收货
export const shCommonColumns = [
	{ title: '收货编号', dataIndex: 'receiveNo', key: 'receiveNo' },
	{
		title: '关联发货批次',
		dataIndex: 'deliverNo',
		key: 'deliverNo',
		scopedSlots: { customRender: 'deliverNo' }
	},
	{
		title: '收货方式',
		dataIndex: 'receiveType',
		key: 'receiveType',
		scopedSlots: { customRender: 'receiveType' }
	},
	{ title: '收货数量(吨)', dataIndex: 'receiveQuantity', key: 'receiveQuantity' },
	{ title: '收货日期', dataIndex: 'receiveDate', key: 'receiveDate' },
	{ title: '收货化验热值(kcal/kg)', dataIndex: 'receiveDynamicsFields.receiveCheckCalorificValue', customRender },
	{
		title: '附件',
		dataIndex: 'fileInfoList',
		key: 'fileInfoList',
		width: 300,
		scopedSlots: { customRender: 'fileInfoList' }
	}
];
