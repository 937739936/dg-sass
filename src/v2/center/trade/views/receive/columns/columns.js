import { filterCodeByValueName } from '@sub/utils/globalCode.js';
const customRender = text => text || '-'; //空数据用-代替
export const releaseRecordColumns = [
	{ title: '合同编号', dataIndex: 'contractNo', key: 'contractNo', scopedSlots: { customRender: 'contractNo' } },
	{ title: '发货批次号', dataIndex: 'batchNo', key: 'batchNo' },
	{ title: '买方企业', dataIndex: 'buyerName', key: 'buyerName', scopedSlots: { customRender: 'buyerName' } },
	{ title: '收货人', dataIndex: 'consigneeName', key: 'consigneeName', scopedSlots: { customRender: 'consigneeName' } },
	{ title: '发货日期', dataIndex: 'deliverDate', key: 'deliverDate' },
	{
		title: '发货数量(吨)',
		dataIndex: 'deliverQuantity',
		key: 'deliverQuantity',
		customRender: text => {
			if (!text && text !== 0) {
				return '-';
			}
			return text;
		}
	},
	{
		title: '运输方式',
		dataIndex: 'transType',
		key: 'transType',
		customRender: text => {
			return filterCodeByValueName(text, 'despatchTypeDict') || text;
		}
	},
	{
		title: '货转开具标识',
		dataIndex: 'goodsTransferFlag',
		key: 'goodsTransferFlag',
		customRender: text => {
			return text ? (text == 1 ? '部分开具' : '已开具') : '未开具';
		}
	},
	{ title: '状态', dataIndex: 'status', key: 'status', scopedSlots: { customRender: 'status' }, width: 150 },
	{ title: '操作', fixed: 'right', scopedSlots: { customRender: 'action' } }
];

export const receiveRecordColumnsWait = function (that) {
	return [
		{ title: '合同编号', dataIndex: 'contractNo', key: 'contractNo' },
		{ title: '发货批次号', dataIndex: 'batchNo', key: 'batchNo' },
		{ title: '收货编号', dataIndex: 'receiveNoList', key: 'receiveNoList', scopedSlots: { customRender: 'receiveNoList' } },
		{ title: '卖方企业', dataIndex: 'sellerName', key: 'sellerName' },
		{ title: '收货人', dataIndex: 'consigneeName', key: 'consigneeName', scopedSlots: { customRender: 'consigneeName' } },
		{ title: '发货日期', dataIndex: 'deliverDate', key: 'deliverDate' },
		{ title: '最新收货日期', dataIndex: 'recentReceiveDate', key: 'recentReceiveDate' },
		{ title: '发货数量(吨)', dataIndex: 'deliverQuantity', key: 'deliverQuantity' },
		{ title: '累计收货(吨)', dataIndex: 'receiveQuantity', key: 'receiveQuantity' },
		{
			title: '运输方式',
			dataIndex: 'transType',
			key: 'transType',
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

export const receiveRecordColumnsReady = function (that) {
	return [
		{ title: '合同编号', dataIndex: 'contractNo', key: 'contractNo' },
		{ title: '收货编号', dataIndex: 'receiveNo', key: 'receiveNo' },
		{ title: '关联发货批次', dataIndex: 'batchNoList', key: 'batchNoList' },
		{ title: '卖方企业', dataIndex: 'sellerName', key: 'sellerName' },
		{ title: '收货人', dataIndex: 'consigneeName', key: 'consigneeName', scopedSlots: { customRender: 'consigneeName' } },
		{ title: '收货日期', dataIndex: 'receiveDate', key: 'receiveDate' },
		{ title: '发货数量(吨)', dataIndex: 'deliverQuantity', key: 'deliverQuantity' },
		{ title: '收货数量(吨)', dataIndex: 'receiveQuantity', key: 'receiveQuantity' },
		{
			title: '运输方式',
			dataIndex: 'transType',
			key: 'transType',
			customRender: text => {
				return filterCodeByValueName(text, 'despatchTypeDict') || text;
			}
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

export const deliverColumns = [
	{ title: '发货批次号', dataIndex: 'deliverNo' },
	{ title: '发货数量(吨)', dataIndex: 'transInfo.deliverQuantity' },
	{
		title: '已收货数量(吨)',
		dataIndex: 'receiveQuantity',
		customRender: text => {
			return text || 0;
		}
	},
	{ title: '发货日期', dataIndex: 'transInfo.deliverDate' },
	{
		title: '收货完成时间',
		dataIndex: 'transInfo.receiveCompleteDate',
		customRender: text => {
			return text || '-';
		}
	},
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
