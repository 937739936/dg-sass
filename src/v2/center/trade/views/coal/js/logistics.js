export const columns = {
	train: [
		{
			title: '运单号',
			key: 'transTicketNo',
			dataIndex: 'transTicketNo'
		},
		{
			title: '车种',
			key: 'trainType',
			dataIndex: 'trainType'
		},
		{
			title: '车号',
			key: 'trainNo',
			dataIndex: 'trainNo'
		},
		{
			title: '票重(吨)',
			key: 'deliverQuantity',
			dataIndex: 'deliverQuantity'
		},
		{
			title: '操作',
			key: 'action',
			dataIndex: 'action',
			fixed: 'right',
			scopedSlots: { customRender: 'action' }
		}
	],
	ship: [
		{
			title: '船舶名称',
			key: 'shipName',
			dataIndex: 'shipName'
		},
		{
			title: '航次号',
			key: 'voyageNo',
			dataIndex: 'voyageNo'
		},
		{
			title: 'mmsi',
			key: 'identifierNo',
			dataIndex: 'identifierNo'
		},
		{
			title: '装货量(吨)',
			key: 'deliverQuantity',
			dataIndex: 'deliverQuantity'
		},
		{ title: '始发港', dataIndex: 'originPortName' },
		{ title: '到达始发港时间', dataIndex: 'originPortInTime' },
		{ title: '目的港', dataIndex: 'destinationPortName' },
		{ title: '到达目的港时间', dataIndex: 'destinationPortInTime' },
		{
			title: '操作',
			key: 'action',
			dataIndex: 'action',
			fixed: 'right',
			scopedSlots: { customRender: 'action' }
		}
	],
	automobile: [
		{
			title: '运单号',
			key: 'serialNo',
			dataIndex: 'serialNo'
		},
		{
			title: '车牌号',
			key: 'carNumber',
			dataIndex: 'carNumber'
		},
		{
			title: '发货量',
			key: 'weight',
			dataIndex: 'weight'
		}
	],
	logisticsAutomobile: [
		{
			title: '车牌号',
			dataIndex: 'plateNumber'
		},
		{
			title: '发车时间',
			dataIndex: 'deliverDate'
		},
		{
			title: '到站时间',
			dataIndex: 'arriveDate'
		},
		{
			title: '发货量(吨)',
			dataIndex: 'deliverQuantity'
		},
		{
			title: '运单号',
			dataIndex: 'ticketNo'
		}
	],
	logisticsAttachment: [
		{
			title: '文件类型',
			key: 'typeName',
			dataIndex: 'typeName'
		},
		{
			title: '文件格式',
			key: 'ext',
			dataIndex: 'ext'
		},
		{
			title: '文件名',
			key: 'name',
			dataIndex: 'name'
		},
		{
			title: '操作',
			key: 'action',
			dataIndex: 'action',
			fixed: 'right',
			scopedSlots: { customRender: 'action' }
		}
	],
	attachment: [
		{
			title: '文件类型',
			key: 'typeName',
			dataIndex: 'typeName'
		},
		{
			title: '文件格式',
			key: 'ext',
			dataIndex: 'ext'
		},
		{
			title: '文件名',
			key: 'fileName',
			dataIndex: 'fileName'
		},
		{
			title: '操作',
			key: 'action',
			dataIndex: 'action',
			fixed: 'right',
			scopedSlots: { customRender: 'action' }
		}
	],
	//收货信息
	receiveRecord: [
		{
			title: '收货编号',
			key: 'receiveNo',
			dataIndex: 'receiveNo'
		},
		{
			title: '收货日期',
			key: 'receiveDate',
			dataIndex: 'receiveDate'
		},
		{
			title: '收货数量(吨)',
			key: 'receiveQuantity',
			dataIndex: 'receiveQuantity'
		},
		{
			title: '操作',
			key: 'action',
			dataIndex: 'action',
			fixed: 'right',
			scopedSlots: { customRender: 'action' }
		}
	],
	//操作历史
	operationLog: [
		{
			title: '操作类型',
			key: 'operationType',
			dataIndex: 'operationType'
		},
		{
			title: '操作人-所属公司',
			key: 'operationBy',
			dataIndex: 'operationBy'
		},
		{
			title: '操作内容',
			key: 'comments',
			dataIndex: 'comments'
		},
		{
			title: '操作时间',
			key: 'operationTime',
			dataIndex: 'operationTime'
		}
	]
};

export const attachmentColumns = columns.attachment;
