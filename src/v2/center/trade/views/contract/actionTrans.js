import store from '@/store';
// 获取合同操作按钮
export function getContractAction(items, type, COMPANYSUER) {
	// items数据，type合同类型，COMPANYSUER企业信息
	const roles = store.getters['user/VUEX_ST_USERAUTH'];
	let actionList = [
		{
			text: '合同修改',
			auth: true,
			condition: roles.includes('dgChain:contract:transportContract:edit'),
			incident: 'eidtContract'
		},
		{
			text: '合同详情',
			auth: true,
			condition: roles.includes('dgChain:contract:transportContract:detail'),
			incident: 'contractDetail'
		},
		{
			text: '发起付款',
			auth: true,
			condition: ['EXECUTING'].includes(items.status) && roles.includes('dgChain:contract:transportContract:initiatePayment'),
			incident: 'toPay'
		},
		{
			text: '补录结算单',
			auth: true,
			condition: ['EXECUTING'].includes(items.status) && roles.includes('dgChain:contract:transportContract:transSettleBl'),
			incident: 'toSettle'
		},
		{
			text: '上传发票',
			auth: true,
			condition: ['EXECUTING'].includes(items.status) && roles.includes('dgChain:contract:transportContract:uploadInvoice'),
			incident: 'toInvoice'
		},
		{
			text: '修改关联业务线',
			auth: true,
			condition: ['EXECUTING'].includes(items.status) && roles.includes('dgChain:contract:transportContract:updateBusinessLine'),
			incident: 'changeBusinessLine'
		},
		{
			text: '下载',
			auth: true,
			condition: ['EXECUTING'].includes(items.status) && roles.includes('dgChain:contract:transportContract:download'),
			incident: 'downloadFile'
		},
		{
			text: '删除',
			auth: true,
			condition: roles.includes('dgChain:contract:transportContract:delete'),
			incident: 'cancelContract'
		}
	];
	let action = actionList.filter(item => {
		return item.condition;
	});
	return action;
}
