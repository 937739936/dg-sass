// 获取线上操作按钮
export function getOnlineAction(items, COMPANYSUER, USERAUTH) {
	// items数据，COMPANYSUER企业信息, USERAUTH权限点数组集合
	let actionList = [
		//【待发起方盖章】 && 发起方 && 角色权限-企业管理员、业务员、业务员（付款申请）、业务员（付款确认）
		{
			text: '修改',
			auth: true,
			condition:
				['WAIT_INITIATOR_SEAL'].includes(items.status) &&
				items.sellerUscc === COMPANYSUER.company.uscc &&
				USERAUTH.includes('dgChain:bondLetterManage:online:addEdit') &&
				((items.contractType === 'ONLINE' && items.sellBusinessAcceptUser) ||
					(items.contractType === 'OFFLINE' && items.belongToCurrentUser)),
			incident: 'edit'
		},
		//【待接收方确认】 && 接收方 && 角色权限-企业管理员、业务员、业务员（付款申请）、业务员（付款确认)
		{
			text: '确认',
			auth: true,
			condition:
				['WAIT_RECEIVER_CONFIRM'].includes(items.status) &&
				items.sellerUscc !== COMPANYSUER.company.uscc &&
				USERAUTH.includes('dgChain:bondLetterManage:online:confirm') &&
				((items.contractType === 'ONLINE' && items.buyBusinessAcceptUser) ||
					(items.contractType === 'OFFLINE' && items.belongToCurrentUser)),
			incident: 'confirm'
		},
		//【待发起方盖章、待接收方盖章】&& 角色权限-企业管理员、签章员
		{
			text: '盖章',
			auth: true,
			condition:
				((['WAIT_INITIATOR_SEAL'].includes(items.status) && items.sellerUscc === COMPANYSUER.company.uscc) ||
					(['WAIT_RECEIVER_SEAL'].includes(items.status) && items.sellerUscc !== COMPANYSUER.company.uscc)) &&
				USERAUTH.includes('dgChain:bondLetterManage:online:sign'),
			incident: 'toSign'
		},
		//【待开具、待发起方盖章 、待接收方确认、待接收方盖章】&& 角色权限-企业管理员、业务员、业务员（付款申请）、业务员（付款确认) 发起方
		{
			text: '作废',
			auth: true,
			condition:
				['WAIT_ISSUE', 'WAIT_INITIATOR_SEAL', 'WAIT_RECEIVER_SEAL', 'WAIT_RECEIVER_CONFIRM'].includes(items.status) &&
				items.sellerUscc === COMPANYSUER.company.uscc &&
				USERAUTH.includes('dgChain:bondLetterManage:online:cancel') &&
				((items.contractType === 'ONLINE' && items.sellBusinessAcceptUser) ||
					(items.contractType === 'OFFLINE' && items.belongToCurrentUser)),
			incident: 'cancel'
		},
		//[待开具]、角色权限：企业管理员、业务员、当前企业为电子追保函发起方
		{
			text: '确认开具',
			auth: true,
			condition:
				['WAIT_ISSUE'].includes(items.status) &&
				items.sellerUscc === COMPANYSUER.company.uscc &&
				COMPANYSUER.roles.some(el => ['ADMIN', 'OPERATOR', 'OPERATOR_PAY_APPLY', 'OPERATOR_PAY_CONFIRM'].includes(el.code)),
			incident: 'edit'
		},

		//【除待开具状态外】&& 角色权限-企业管理员、业务员、业务员（付款申请）、业务员（付款确认)观察员、财务员、签章员
		{
			text: '详情',
			auth: true,
			condition: !['WAIT_ISSUE'].includes(items.status) && USERAUTH.includes('dgChain:bondLetterManage:online:detail'),
			incident: 'viewDetail'
		},
		//【除待开具状态外】&& 角色权限-企业管理员、业务员、业务员（付款申请）、业务员（付款确认)观察员、财务员、签章员
		{
			text: '下载',
			auth: true,
			condition: !['WAIT_ISSUE'].includes(items.status) && USERAUTH.includes('dgChain:bondLetterManage:online:downloadFile'),
			incident: 'download'
		}
	];
	let action = actionList.filter(item => {
		return item.condition;
	});
	return action;
}
// 获取线下操作按钮
export function getOfflineAction(items, COMPANYSUER, USERAUTH) {
	// items数据，COMPANYSUER企业信息, USERAUTH权限点数组集合
	let actionList = [
		//【已生效】 && 发起方 && 角色权限-企业管理员、业务员、业务员（付款申请）、业务员（付款确认）
		{
			text: '修改',
			auth: true,
			condition:
				['COMPLETED'].includes(items.status) &&
				items.sellerUscc === COMPANYSUER.company.uscc &&
				USERAUTH.includes('dgChain:bondLetterManage:offline:addEdit') &&
				((items.contractType === 'ONLINE' && items.sellBusinessAcceptUser) ||
					(items.contractType === 'OFFLINE' && items.belongToCurrentUser)),
			incident: 'edit'
		},
		//【已生效】 && 发起方 && 角色权限-企业管理员、业务员、业务员（付款申请）、业务员（付款确认）
		{
			text: '作废',
			auth: true,
			condition:
				['COMPLETED'].includes(items.status) &&
				items.sellerUscc === COMPANYSUER.company.uscc &&
				USERAUTH.includes('dgChain:bondLetterManage:offline:cancel') &&
				((items.contractType === 'ONLINE' && items.sellBusinessAcceptUser) ||
					(items.contractType === 'OFFLINE' && items.belongToCurrentUser)),
			incident: 'cancel'
		},
		// 角色权限-企业管理员、业务员、观察员、财务员、签章员
		{
			text: '详情',
			auth: true,
			condition: USERAUTH.includes('dgChain:bondLetterManage:offline:detail'),
			incident: 'viewDetail'
		}
	];
	let action = actionList.filter(item => {
		return item.condition;
	});
	return action;
}
