// 获取合同操作按钮
export function getContractAction(items, COMPANYSUER, USERAUTH) {
	// items数据，COMPANYSUER企业信息
	let actionList = [
		{
			//【草稿】 && 角色权限-企业管理员、业务员、业务员（付款申请）、业务员（付款确认）
			text: '合同修改',
			auth: USERAUTH.includes('logicDeliverMonitor:contractManager:deliver:edit'),
			condition:
				['DRAFT'].includes(items.status) &&
				COMPANYSUER.roles.some(el => ['ADMIN', 'OPERATOR', 'OPERATOR_PAY_APPLY', 'OPERATOR_PAY_CONFIRM'].includes(el.code)),
			incident: 'eidtContract'
		},
		{
			text: '合同详情',
			auth: USERAUTH.includes('logicDeliverMonitor:contractManager:deliver:view'),
			condition: true,
			incident: 'contractDetail'
		},
		{
			//【执行中】托运方 && 角色权限-企业管理员、业务员、业务员（付款申请）、业务员（付款确认）
			text: '发起付款',
			auth: USERAUTH.includes('logicDeliverMonitor:contractManager:deliver:payment'),
			condition:
				['EXECUTING'].includes(items.status) &&
				items.buyerUscc === COMPANYSUER.company.uscc &&
				COMPANYSUER.roles.some(el => ['ADMIN', 'OPERATOR', 'OPERATOR_PAY_APPLY', 'OPERATOR_PAY_CONFIRM'].includes(el.code)),
			incident: 'toPay'
		},
		{
			//【执行中】&& 不是托运方 角色权限-企业管理员、业务员、业务员（付款申请）、业务员（付款确认）
			text: '补录结算单',
			auth: USERAUTH.includes('logicDeliverMonitor:contractManager:deliver:statement'),
			condition:
				['EXECUTING'].includes(items.status) &&
				COMPANYSUER.roles.some(el => ['ADMIN', 'OPERATOR', 'OPERATOR_PAY_APPLY', 'OPERATOR_PAY_CONFIRM'].includes(el.code)),
			incident: 'toSettle'
		},
		{
			//【执行中】 角色权限-企业管理员、业务员、业务员（付款申请）、业务员（付款确认）
			text: '上传发票',
			auth: USERAUTH.includes('logicDeliverMonitor:contractManager:deliver:invoice'),
			condition:
				['EXECUTING'].includes(items.status) &&
				COMPANYSUER.roles.some(el => ['ADMIN', 'OPERATOR', 'OPERATOR_PAY_APPLY', 'OPERATOR_PAY_CONFIRM'].includes(el.code)),
			incident: 'toInvoice'
		},
		{
			text: '下载',
			auth: USERAUTH.includes('logicDeliverMonitor:contractManager:deliver:download'),
			condition:['EXECUTING'].includes(items.status),
			incident: 'downloadContractFile'
		},
		{
			//【草稿】、【执行中】
			text: '删除',
			auth: USERAUTH.includes('logicDeliverMonitor:contractManager:deliver:delete'),
			condition:
				items.supportDel &&
				['DRAFT', 'EXECUTING'].includes(items.status),
			incident: 'cancelContract'
		},
	];
	let action = actionList.filter(item => {
		return item.condition && item.auth;
	});
	return action;
}
// 获取合同操作按钮
export function getStorageContractAction(items, COMPANYSUER, USERAUTH) {
	// items数据，COMPANYSUER企业信息
	let actionList = [
		{
			//【草稿】 && 角色权限-企业管理员、业务员、业务员（付款申请）、业务员（付款确认）
			text: '合同修改',
			auth: USERAUTH.includes('logicDeliverMonitor:contractManager:warehouse:edit'),
			condition:
				['DRAFT'].includes(items.status) &&
				COMPANYSUER.roles.some(el => ['ADMIN', 'OPERATOR', 'OPERATOR_PAY_APPLY', 'OPERATOR_PAY_CONFIRM'].includes(el.code)),
			incident: 'eidtContract'
		},
		{
			text: '合同详情',
			auth: USERAUTH.includes('logicDeliverMonitor:contractManager:warehouse:view'),
			condition: true,
			incident: 'contractDetail'
		},
		{
			//【执行中】托运方 && 角色权限-企业管理员、业务员、业务员（付款申请）、业务员（付款确认）
			text: '发起付款',
			auth: USERAUTH.includes('logicDeliverMonitor:contractManager:warehouse:payment'),
			condition:
				['EXECUTING'].includes(items.status) &&
				COMPANYSUER.roles.some(el => ['ADMIN', 'OPERATOR', 'OPERATOR_PAY_APPLY', 'OPERATOR_PAY_CONFIRM'].includes(el.code)),
			incident: 'toPay'
		},
		{
			//【执行中】&& 不是托运方 角色权限-企业管理员、业务员、业务员（付款申请）、业务员（付款确认）
			text: '补录结算单',
			auth: USERAUTH.includes('logicDeliverMonitor:contractManager:warehouse:statement'),
			condition:
				['EXECUTING'].includes(items.status) &&
				COMPANYSUER.roles.some(el => ['ADMIN', 'OPERATOR', 'OPERATOR_PAY_APPLY', 'OPERATOR_PAY_CONFIRM'].includes(el.code)),
			incident: 'toSettle'
		},
		{
			//【执行中】 角色权限-企业管理员、业务员、业务员（付款申请）、业务员（付款确认）
			text: '上传发票',
			auth: USERAUTH.includes('logicDeliverMonitor:contractManager:warehouse:invoice'),
			condition:
				['EXECUTING'].includes(items.status) &&
				COMPANYSUER.roles.some(el => ['ADMIN', 'OPERATOR', 'OPERATOR_PAY_APPLY', 'OPERATOR_PAY_CONFIRM'].includes(el.code)),
			incident: 'toInvoice'
		},
		{
			text: '下载',
			auth: USERAUTH.includes('logicDeliverMonitor:contractManager:warehouse:download'),
			condition:['EXECUTING'].includes(items.status),
			incident: 'downloadContractFile'
		},
		{
			//【草稿】、【执行中】
			text: '删除',
			auth: USERAUTH.includes('logicDeliverMonitor:contractManager:warehouse:delete'),
			condition:
				items.supportDel &&
				['DRAFT', 'EXECUTING'].includes(items.status),
			incident: 'cancelContract'
		},
	];
	let action = actionList.filter(item => {
		return item.condition && item.auth;
	});
	return action;
}