const customRender = text => text || '-'; //空数据用-代替
export const my = function (that) {
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
