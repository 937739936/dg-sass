// 获取合同操作按钮
export function getContractAction(items, type, COMPANYSUER, USERAUTH, STATIONINFO) {
	// items数据，type合同类型，COMPANYSUER企业信息, USERAUTH权限点数组集合 站台详情

	let actionList = [
		//  【待确认】 && 接收方 && 角色权限-企业管理员、业务员、业务员（付款申请）、业务员（付款确认）
		{
			text: '合同终止确认',
			auth: true,
			condition:
				['WAIT_CONFIRM'].includes(items.terminalContractStatus) &&
				items.terminalContractInitiatorUscc !== COMPANYSUER.company.uscc &&
				COMPANYSUER.roles.some(el => ['ADMIN', 'OPERATOR', 'OPERATOR_PAY_APPLY', 'OPERATOR_PAY_CONFIRM'].includes(el.code)),
			incident: 'contractTerminationConfirm'
		},
		// 【确认待盖章】 && 接收方 && 角色权限-签章员、企业管理员
		{
			text: '合同终止盖章',
			auth: true,
			condition:
				['CONFIRM_WAIT_SIGN_SEAL'].includes(items.terminalContractStatus) &&
				items.terminalContractInitiatorUscc !== COMPANYSUER.company.uscc &&
				COMPANYSUER.roles.some(el => ['ADMIN', 'SIGNER'].includes(el.code)),
			incident: 'contractTerminationStamp'
		},
		// 【待盖章】 && 发起方 && 角色权限-签章员、企业管理员
		{
			text: '合同终止盖章',
			auth: true,
			condition:
				['WAIT_SIGN_SEAL'].includes(items.terminalContractStatus) &&
				items.terminalContractInitiatorUscc === COMPANYSUER.company.uscc &&
				COMPANYSUER.roles.some(el => ['ADMIN', 'SIGNER'].includes(el.code)),
			incident: 'contractTerminationStamp'
		},
		{
			//【草稿】 && 合同发起方 && 角色权限-企业管理员、业务员、业务员（付款申请）、业务员（付款确认）
			text: '合同修改',
			auth: true,
			condition:
				['DRAFT'].includes(items.status) &&
				items.initiatorUscc === COMPANYSUER.company.uscc &&
				COMPANYSUER.roles.some(el => ['ADMIN', 'OPERATOR', 'OPERATOR_PAY_APPLY', 'OPERATOR_PAY_CONFIRM'].includes(el.code)),
			incident: 'eidtContract'
		},
		//【待签约】 && 合同发起方 && 角色权限-签章员、企业管理员
		{
			text: '合同盖章',
			auth: true,
			condition:
				['WAIT_SIGN_SEAL'].includes(items.status) &&
				items.initiatorUscc === COMPANYSUER.company.uscc &&
				COMPANYSUER.roles.some(el => ['ADMIN', 'SIGNER'].includes(el.code)),
			incident: 'goToStamp'
		},
		//【确认待盖章】 && 合同接收方 &&  角色权限-签章员、企业管理员
		{
			text: '合同盖章',
			condition:
				['CONFIRM_WAIT_SIGN_SEAL'].includes(items.status) &&
				!(items.initiatorUscc === COMPANYSUER.company.uscc) &&
				COMPANYSUER.roles.some(el => ['ADMIN', 'SIGNER'].includes(el.code)),
			incident: 'orderConfirm'
		},
		//【待确认】 && 合同接收方 &&  角色权限-业务员、企业管理员、业务员（付款申请）、业务员（付款确认）
		{
			text: '合同确认',
			auth: true,
			condition:
				['WAIT_CONFIRM'].includes(items.status) &&
				!(items.initiatorUscc === COMPANYSUER.company.uscc) &&
				COMPANYSUER.roles.some(el => ['ADMIN', 'OPERATOR', 'OPERATOR_PAY_APPLY', 'OPERATOR_PAY_CONFIRM'].includes(el.code)),
			incident: 'openConfirmContract'
		},
		{
			text: '合同详情',
			auth: true,
			condition: true,
			incident: 'contractDetail'
		},

		{
			text: type === 'SELL' ? '新增出库' : '新增入库',
			auth: true,
			condition: items.whetherHaveStorageBoo && STATIONINFO.allStationList?.length,
			incident: 'goInOut'
		},
		{
			//汽运或汽运和火运 &&【草稿】、【审批中】、【待签约】、【待确认】、【确认待盖章】、【执行中】、【接收方审批中】
			text: '派车计划',
			auth: true,
			condition:
				['AUTOMOBILE', 'AUTOMOBILE_AND_TRAIN'].includes(items.transType) &&
				[
					'DRAFT',
					'AUDITING',
					'WAIT_SIGN_SEAL',
					'WAIT_CONFIRM',
					'CONFIRM_WAIT_SIGN_SEAL',
					'EXECUTING',
					'AUDITING_RECEIVE'
				].includes(items.status),
			incident: 'despatchCode'
		},
		{
			//【当前合同有“待收款确认“”状态的付款数据，且需要当前企业进行操作收款确认 && 角色权限-企业管理员、业务员
			text: '收款确认',
			auth: true,
			condition: items.receiveConfirmBoo && COMPANYSUER.roles.some(el => ['ADMIN', 'OPERATOR'].includes(el.code)),
			incident: 'toCollectConfirm'
		},
		{
			//【执行中】买方 && 角色权限-企业管理员、业务员、业务员（付款申请）、业务员（付款确认）
			text: '发起付款',
			auth: true,
			condition:
				['EXECUTING'].includes(items.status) &&
				items.buyerUscc === COMPANYSUER.company.uscc &&
				COMPANYSUER.roles.some(el => ['ADMIN', 'OPERATOR', 'OPERATOR_PAY_APPLY', 'OPERATOR_PAY_CONFIRM'].includes(el.code)),
			incident: 'toPay'
		},
		{
			//【执行中】 && 角色权限-企业管理员、业务员、业务员（付款申请）、业务员（付款确认）
			text: '上传发票',
			auth: true,
			condition:
				['EXECUTING'].includes(items.status) &&
				COMPANYSUER.roles.some(el => ['ADMIN', 'OPERATOR', 'OPERATOR_PAY_APPLY', 'OPERATOR_PAY_CONFIRM'].includes(el.code)),
			incident: 'toInvoice'
		},
		{
			//【草稿】、【审批中】、【待签约】、【待确认】、【确认待盖章】、【执行中】、【接收方审批中】卖方 && 角色权限-企业管理员、业务员、业务员（付款申请）、业务员（付款确认）
			text: '去发货',
			auth: true,
			condition:
				[
					'DRAFT',
					'AUDITING',
					'WAIT_SIGN_SEAL',
					'WAIT_CONFIRM',
					'CONFIRM_WAIT_SIGN_SEAL',
					'EXECUTING',
					'AUDITING_RECEIVE'
				].includes(items.status) &&
				items.sellerUscc === COMPANYSUER.company.uscc &&
				COMPANYSUER.roles.some(el => ['ADMIN', 'OPERATOR', 'OPERATOR_PAY_APPLY', 'OPERATOR_PAY_CONFIRM'].includes(el.code)),
			incident: 'toDeliver'
		},
		{
			//【草稿】、【审批中】、【待签约】、【待确认】、【确认待盖章】、【执行中】、【接收方审批中】 买方 && 角色权限-企业管理员、业务员、业务员（付款申请）、业务员（付款确认）
			text: '去收货',
			auth: true,
			condition:
				[
					'DRAFT',
					'AUDITING',
					'WAIT_SIGN_SEAL',
					'WAIT_CONFIRM',
					'CONFIRM_WAIT_SIGN_SEAL',
					'EXECUTING',
					'AUDITING_RECEIVE'
				].includes(items.status) &&
				items.buyerUscc === COMPANYSUER.company.uscc &&
				COMPANYSUER.roles.some(el => ['ADMIN', 'OPERATOR', 'OPERATOR_PAY_APPLY', 'OPERATOR_PAY_CONFIRM'].includes(el.code)) &&
				items.qshBoo,
			incident: 'toReceive'
		},
		{
			//【草稿】、【审批中】、【待签约】、【待确认】、【确认待盖章】、【执行中】、【接收方审批中】卖方&& 角色权限-企业管理员、业务员、业务员（付款申请）、业务员（付款确认）
			text: '开货转',
			auth: true,
			condition:
				[
					'DRAFT',
					'AUDITING',
					'WAIT_SIGN_SEAL',
					'WAIT_CONFIRM',
					'CONFIRM_WAIT_SIGN_SEAL',
					'EXECUTING',
					'AUDITING_RECEIVE'
				].includes(items.status) &&
				items.sellerUscc === COMPANYSUER.company.uscc &&
				COMPANYSUER.roles.some(el => ['ADMIN', 'OPERATOR', 'OPERATOR_PAY_APPLY', 'OPERATOR_PAY_CONFIRM'].includes(el.code)),
			incident: 'toGoodsTransfer'
		},
		{
			//当前合同有“待确认“”状态的电子结算单，且需要当前企业进行操作确认 && 角色权限-企业管理员、签章员
			text: '结算单确认',
			auth: true,
			condition: items.settleConfirmBoo && COMPANYSUER.roles.some(el => ['ADMIN', 'SIGNER'].includes(el.code)),
			incident: 'toSettleConfirm'
		},
		{
			//【执行中】核心企业 && 角色权限-企业管理员、业务员、业务员（付款申请）、业务员（付款确认）
			text: '发起结算',
			auth: true,
			condition:
				['EXECUTING'].includes(items.status) &&
				COMPANYSUER.companyType === 'CORE_COMPANY' &&
				COMPANYSUER.roles.some(el => ['ADMIN', 'OPERATOR', 'OPERATOR_PAY_APPLY', 'OPERATOR_PAY_CONFIRM'].includes(el.code)),
			incident: 'toSettle'
		},
		{
			//【执行中】合同买卖方 && 角色权限-企业管理员、业务员、业务员（付款申请）、业务员（付款确认）
			text: type === 'SELL' ? '关联采购合同' : '关联销售合同',
			auth: true,
			condition:
				['EXECUTING'].includes(items.status) &&
				COMPANYSUER.roles.some(el => ['ADMIN', 'OPERATOR', 'OPERATOR_PAY_APPLY', 'OPERATOR_PAY_CONFIRM'].includes(el.code)),
			incident: 'realteContract'
		},
		{
			//【执行中】合同买卖方  核心企业 && 角色权限-企业管理员、业务员、业务员（付款申请）、业务员（付款确认）
			text: '新增补协',
			auth: true,
			condition:
				['EXECUTING'].includes(items.status) &&
				COMPANYSUER.companyType === 'CORE_COMPANY' &&
				COMPANYSUER.roles.some(el => ['ADMIN', 'OPERATOR', 'OPERATOR_PAY_APPLY', 'OPERATOR_PAY_CONFIRM'].includes(el.code)),
			incident: 'addSupple'
		},

		{
			//【【待签约】、【待确认】、【确认待盖章】、【执行中】&& 发起方 && 角色权限-企业管理员、业务员、业务员（付款申请）、业务员（付款确认）
			text: '修改实际负责人',
			auth: true,
			condition:
				items.businessType !== 'OTHER' &&
				items.initiatorUscc === COMPANYSUER.company.uscc &&
				['WAIT_SIGN_SEAL', 'WAIT_CONFIRM', 'CONFIRM_WAIT_SIGN_SEAL', 'EXECUTING'].includes(items.status) &&
				COMPANYSUER.roles.some(el => ['ADMIN', 'OPERATOR', 'OPERATOR_PAY_APPLY', 'OPERATOR_PAY_CONFIRM'].includes(el.code)),
			incident: 'updateDirector'
		},
		{
			//【【待签约】、【待确认】、【确认待盖章】、【接收方审批中】、【执行中】 && 发起方 && 是否对接审批 && 角色权限-企业管理员、业务员、业务员（付款申请）、业务员（付款确认）
			text: '修改审批流',
			auth: true,
			condition:
				((['WAIT_CONFIRM', 'AUDITING_RECEIVE'].includes(items.status) && items.initiatorUscc === COMPANYSUER.company.uscc) ||
					['CONFIRM_WAIT_SIGN_SEAL', 'WAIT_SIGN_SEAL', 'EXECUTING'].includes(items.status)) &&
				items.configOA &&
				COMPANYSUER.roles.some(el => ['ADMIN', 'OPERATOR', 'OPERATOR_PAY_APPLY', 'OPERATOR_PAY_CONFIRM'].includes(el.code)),
			incident: 'upDateApprovalProcessFunc'
		},
		{
			//【草稿】、【审批中】、【待签约】、【待确认】、【确认待盖章】、【执行中】、【接收方审批中】&& 角色权限-企业管理员、业务员、业务员（付款申请）、业务员（付款确认）
			text: '业务转移',
			auth: true,
			condition:
				[
					'DRAFT',
					'AUDITING',
					'WAIT_SIGN_SEAL',
					'WAIT_CONFIRM',
					'CONFIRM_WAIT_SIGN_SEAL',
					'EXECUTING',
					'AUDITING_RECEIVE'
				].includes(items.status) &&
				COMPANYSUER.roles.some(el => ['ADMIN', 'OPERATOR', 'OPERATOR_PAY_APPLY', 'OPERATOR_PAY_CONFIRM'].includes(el.code)),
			incident: 'openBusinessModal'
		},
		{
			//【执行中】 && 核心企业 && 发起方 && 该订单下无非作废状态的发货记录或货转记录 && 角色权限-企业管理员、业务员、业务员（付款申请）、业务员（付款确认）
			text: '合同终止',
			auth: true,
			condition:
				COMPANYSUER.companyType === 'CORE_COMPANY' &&
				items.status === 'EXECUTING' &&
				items.terminateButtonShow &&
				COMPANYSUER.roles.some(el => ['ADMIN', 'OPERATOR', 'OPERATOR_PAY_APPLY', 'OPERATOR_PAY_CONFIRM'].includes(el.code)),
			incident: 'stopContract'
		},
		{
			//【执行中】 && 核心企业 && 业务类型为其他 && 角色权限-企业管理员、业务员、业务员（付款申请）、业务员（付款确认）
			text: '合同完结',
			auth: true,
			condition:
				COMPANYSUER.companyType === 'CORE_COMPANY' &&
				items.status === 'EXECUTING' &&
				items.businessType === 'OTHER' &&
				COMPANYSUER.roles.some(el => ['ADMIN', 'OPERATOR', 'OPERATOR_PAY_APPLY', 'OPERATOR_PAY_CONFIRM'].includes(el.code)),
			// condition: true,
			incident: 'finishContract'
		},
		{
			//【草稿】、【待发起方盖章】&& 发起方
			text: '作废',
			auth: true,
			condition: ['DRAFT', 'WAIT_SIGN_SEAL'].includes(items.status) && items.initiatorUscc === COMPANYSUER.company.uscc,
			incident: 'cancelContract'
		},
		{
			//【待接收方盖章】&& 接收方
			text: '作废',
			auth: true,
			condition: ['CONFIRM_WAIT_SIGN_SEAL'].includes(items.status) && items.initiatorUscc !== COMPANYSUER.company.uscc,
			incident: 'cancelContract'
		},
		// 草稿、发起方审批中、待接收方确认、接收方审批中、待接收方盖章、待发起方盖章、执行中“ 业务类型是仓押
		{
			// 已关联了上/下煤计划且有物流仓储中心相关的菜单权限点
			text: '查看监控',
			auth: true,
			condition:
				(items.outCoalPlanSerialNoList || items.inCoalPlanSerialNoList) &&
				USERAUTH.includes('logisticsStorageCenter') &&
				USERAUTH.includes('logisticsStorageCenter:videoSurveillance'),
			incident: 'viewVideo'
		},
		{
			// 已关联了上/下煤计划且有物流仓储中心相关的菜单权限点
			text: '查看库存',
			auth: true,
			condition:
				(items.outCoalPlanSerialNoList || items.inCoalPlanSerialNoList) &&
				USERAUTH.includes('logisticsStorageCenter') &&
				USERAUTH.includes('logisticsStorageCenter:videoSurveillance'),
			incident: 'viewInventory'
		},
		{
			// 汽运、汽运和火运  非冻结中、已终止、无效状态 且有物流仓储中心相关的菜单权限点
			text: type === 'SELL' ? '关联下煤计划' : '关联上煤计划',
			auth: true,
			condition: getRelationPan(items, type, USERAUTH),
			incident: 'relatedPlan'
		},
		{
			text: '附件下载',
			condition: true,
			incident: 'downloadContractFile'
		}
	];
	let action = actionList.filter(item => {
		return item.condition;
	});
	return action;
}

function getRelationPan(items, type, USERAUTH) {
	//whetherHaveCoalPlanBoo 有且仅有一条业务线 true 其他 faslee
	if (!items.whetherHaveCoalPlanBoo) {
		return false;
	}
	// 销售合同-标准仓押合同无法进行下煤计划关联操作 WAREHOUSE_RECEIPTS_PLEDGE
	return (
		!['CANCELLATION', 'APPROVAL_FAIL', 'REJECT', 'FREEZING', 'TERMINATED'].includes(items.status) &&
		['AUTOMOBILE', 'AUTOMOBILE_AND_TRAIN'].includes(items.transType) &&
		(type === 'SELL'
			? USERAUTH.includes('logisticsStorageCenter') &&
				USERAUTH.includes('logisticsStorageCenter:outManage') &&
				USERAUTH.includes('logisticsStorageCenter:outManage:outCoalPlan') &&
				items.businessType != 'WAREHOUSE_RECEIPTS_PLEDGE'
			: USERAUTH.includes('logisticsStorageCenter') &&
				USERAUTH.includes('logisticsStorageCenter:inManage') &&
				USERAUTH.includes('logisticsStorageCenter:inManage:inCoalPlan'))
	);
}
// 获取线下合同操作按钮
export function getDownContractAction(items, type, COMPANYSUER, USERAUTH, STATIONINFO) {
	// items数据，type合同类型，COMPANYSUER企业信息

	type = type || 'buy';
	type = type.toLowerCase();
	let uscc = COMPANYSUER.company.uscc;

	let actionList = [
		{
			text: '合同详情',

			// 买方 或者是 卖方 非待确认的
			// condition: (items.buyerBizNo == uscc || ( items.buyerBizNo != uscc && items.status != 'WAIT_CONFIRM')),
			condition: true,

			incident: 'goDetail'
		},
		{
			text: type === 'buy' ? '新增入库' : '新增出库',
			auth: true,
			condition: items.whetherHaveStorageBoo && STATIONINFO.allStationList?.length,

			incident: 'goInOut'
		},

		{
			text: '编辑合同',
			auth: true,
			condition:
				type === 'sell'
					? [
							'EXECUTING',
							'SINGLE_SIGN',
							'REJECT',
							'DOUBLE_SIGN_AUDITING_REJECT',
							'COMPLETED_REJECT',
							'PENDING_AUDITING_REJECT'
						].includes(items.status) &&
						COMPANYSUER.roles.some(el => ['ADMIN', 'OPERATOR', 'OPERATOR_PAY_APPLY', 'OPERATOR_PAY_CONFIRM'].includes(el.code)) &&
						items.contractType != 'UP'
					: ['EXECUTING', 'REJECT', 'DOUBLE_SIGN_AUDITING_REJECT', 'COMPLETED_REJECT', 'PENDING_AUDITING_REJECT'].includes(
							items.status
						) &&
						COMPANYSUER.roles.some(el => ['ADMIN', 'OPERATOR', 'OPERATOR_PAY_APPLY', 'OPERATOR_PAY_CONFIRM'].includes(el.code)) &&
						items.contractType != 'DOWN',
			// ["SINGLE_SIGN", "DOUBLE_SIGN_AUDITING_REJECT","COMPLETED_REJECT", "EXECUTING"].includes(items.status) :
			// ["SINGLE_SIGN", "DOUBLE_SIGN_AUDITING_REJECT","COMPLETED_REJECT", "EXECUTING","REJECT"].includes(items.status),
			// 执行中  客户驳回 双签审批驳回 完结审批驳回
			// condition: items.buyerBizNo == uscc && ['EXECUTING', 'REJECT', 'DOUBLE_SIGN_AUDITING_REJECT', 'COMPLETED_REJECT'].includes(items.status) &&  COMPANYSUER.roles.some((el) => ["ADMIN","OPERATOR","OPERATOR_PAY_APPLY","OPERATOR_PAY_CONFIRM"].includes(el.code)),

			incident: 'edit'
		},
		{
			//【执行中 完结审批驳回】买方 && 角色权限-企业管理员、业务员、业务员（付款申请）、业务员（付款确认）
			text: '发起付款',

			condition:
				['EXECUTING', 'COMPLETED_REJECT'].includes(items.status) &&
				type === 'buy' &&
				items.contractType != 'DOWN' &&
				COMPANYSUER.roles.some(el => ['ADMIN', 'OPERATOR', 'OPERATOR_PAY_APPLY', 'OPERATOR_PAY_CONFIRM'].includes(el.code)),

			incident: 'toPay'
		},
		{
			//【 完结审批中 已完结】买方 && 角色权限-企业管理员、业务员、业务员（付款申请）、业务员（付款确认）
			text: '登记回款',
			condition:
				!['COMPLETED_AUDITING', 'COMPLETED'].includes(items.status) &&
				type === 'sell' &&
				COMPANYSUER.roles.some(el => ['ADMIN', 'OPERATOR', 'OPERATOR_PAY_APPLY', 'OPERATOR_PAY_CONFIRM'].includes(el.code)) &&
				items.contractType != 'UP',

			incident: 'toReturned'
		},
		{
			//【执行中 完结审批驳回】买方 && 角色权限-企业管理员、业务员、业务员（付款申请）、业务员（付款确认）
			text: '补录结算单',

			condition:
				['EXECUTING', 'COMPLETED_REJECT'].includes(items.status) &&
				COMPANYSUER.roles.some(el => ['ADMIN', 'OPERATOR', 'OPERATOR_PAY_APPLY', 'OPERATOR_PAY_CONFIRM'].includes(el.code)) &&
				!(type === 'sell' && items.contractType == 'UP') &&
				!(type === 'buy' && items.contractType == 'DOWN'),
			incident: 'toSettle'
		},
		{
			//【执行中 完结审批驳回】买方 && 角色权限-企业管理员、业务员、业务员（付款申请）、业务员（付款确认）
			text: '上传发票',

			condition:
				['EXECUTING', 'COMPLETED_REJECT'].includes(items.status) &&
				COMPANYSUER.roles.some(el => ['ADMIN', 'OPERATOR', 'OPERATOR_PAY_APPLY', 'OPERATOR_PAY_CONFIRM'].includes(el.code)) &&
				!(type === 'sell' && items.contractType == 'UP') &&
				!(type === 'buy' && items.contractType == 'DOWN'),
			incident: 'toInvoice'
		},
		{
			text: '新增补协',
			auth: true,
			condition:
				type === 'sell'
					? [
							'EXECUTING',
							'SINGLE_SIGN',
							'REJECT',
							'DOUBLE_SIGN_AUDITING_REJECT',
							'COMPLETED_REJECT',
							'PENDING_AUDITING_REJECT'
						].includes(items.status) &&
						COMPANYSUER.roles.some(el => ['ADMIN', 'OPERATOR', 'OPERATOR_PAY_APPLY', 'OPERATOR_PAY_CONFIRM'].includes(el.code)) &&
						items.contractType != 'UP'
					: ['EXECUTING', 'REJECT', 'DOUBLE_SIGN_AUDITING_REJECT', 'COMPLETED_REJECT', 'PENDING_AUDITING_REJECT'].includes(
							items.status
						) &&
						COMPANYSUER.roles.some(el => ['ADMIN', 'OPERATOR', 'OPERATOR_PAY_APPLY', 'OPERATOR_PAY_CONFIRM'].includes(el.code)) &&
						items.contractType != 'DOWN',
			// ["SINGLE_SIGN", "DOUBLE_SIGN_AUDITING_REJECT","COMPLETED_REJECT", "EXECUTING"].includes(items.status) :
			// ["SINGLE_SIGN", "DOUBLE_SIGN_AUDITING_REJECT","COMPLETED_REJECT", "EXECUTING","REJECT"].includes(items.status),
			// 执行中  客户驳回 双签审批驳回 完结审批驳回
			// condition: items.buyerBizNo == uscc && ['EXECUTING', 'REJECT', 'DOUBLE_SIGN_AUDITING_REJECT', 'COMPLETED_REJECT'].includes(items.status) &&  COMPANYSUER.roles.some((el) => ["ADMIN","OPERATOR","OPERATOR_PAY_APPLY","OPERATOR_PAY_CONFIRM"].includes(el.code)),

			incident: 'edit'
		},
		{
			//【执行中 完结审批驳回】买方 && 角色权限-企业管理员、业务员、业务员（付款申请）、业务员（付款确认）
			text: '修改业务负责人',

			condition:
				['EXECUTING', 'COMPLETED_REJECT'].includes(items.status) &&
				COMPANYSUER.roles.some(el => ['ADMIN', 'OPERATOR', 'OPERATOR_PAY_APPLY', 'OPERATOR_PAY_CONFIRM'].includes(el.code)) &&
				!(type === 'sell' && items.contractType == 'UP') &&
				!(type === 'buy' && items.contractType == 'DOWN'),
			incident: 'updatePrincipal'
			// incident:(t) => {
			//   t.updatePrincipal(items)
			// },
		},
		{
			//【执行中 双签审批驳回】买方 && 角色权限-企业管理员、业务员、业务员（付款申请）、业务员（付款确认）
			text: '修改审批流',

			condition:
				['EXECUTING', 'COMPLETED_REJECT'].includes(items.status) &&
				COMPANYSUER.roles.some(el => ['ADMIN', 'OPERATOR', 'OPERATOR_PAY_APPLY', 'OPERATOR_PAY_CONFIRM'].includes(el.code)) &&
				items.configOa &&
				!(type === 'sell' && items.contractType == 'UP') &&
				!(type === 'buy' && items.contractType == 'DOWN'),
			incident: 'updateApprovalProcess'
		},

		{
			//执行中 双签审批驳回 采购只能关联一个销售，销售可关联多个采购
			text: type === 'sell' ? '关联采购合同' : '关联销售合同',
			auth: true,
			condition:
				['EXECUTING', 'COMPLETED_REJECT', 'SINGLE_SIGN'].includes(items.status) &&
				COMPANYSUER.roles.some(el => ['ADMIN', 'OPERATOR', 'OPERATOR_PAY_APPLY', 'OPERATOR_PAY_CONFIRM'].includes(el.code)) &&
				!(type === 'sell' && items.contractType == 'UP') &&
				!(type === 'buy' && items.contractType == 'DOWN'),

			incident: 'relationContract'
		},
		{
			text: '附件下载',
			condition: true,
			incident: 'downloadContractFile'
		},
		{
			//【已单签】【双签审批驳回】【完结审批驳回】【执行】 采购【驳回】
			text: '删除',
			auth: true,
			condition:
				[
					'EXECUTING',
					'SINGLE_SIGN',
					'REJECT',
					'COMPLETED_REJECT',
					'DOUBLE_SIGN_AUDITING_REJECT',
					'PENDING_AUDITING_REJECT',
					'CANCEL'
				].includes(items.status) &&
				COMPANYSUER.roles.some(el => ['ADMIN', 'OPERATOR', 'OPERATOR_PAY_APPLY', 'OPERATOR_PAY_CONFIRM'].includes(el.code)) &&
				items.showDelButton,
			incident: 'del'
		}
	];

	let action = actionList.filter(item => {
		return item.condition;
	});
	return action;
}
