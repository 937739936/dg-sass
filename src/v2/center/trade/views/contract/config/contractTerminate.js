export default {
	// 非交易双方达成一致，解除协议
	NO_RESCISSION_OF_AGREEMENT: {
		// 平台审批中
		INITIATE_APPLY: [
			{
				text: '发起合同终止',
				status: 'INITIATE_APPLY',
				icon: require('@/v2/assets/imgs/termination/termination-avtive.svg')
			},
			{
				text: '平台审批中',
				status: '',
				icon: require('@/v2/assets/imgs/termination/initiator-approval.svg')
			},
			{
				text: '合同终止完成',
				status: '',
				icon: require('@/v2/assets/imgs/termination/contract-terminate.svg')
			}
		],
		// 平台审批通过
		AUDITING_PASS: [
			{
				text: '发起合同终止',
				status: 'INITIATE_APPLY',
				icon: require('@/v2/assets/imgs/termination/termination-avtive.svg')
			},
			{
				text: '平台审批通过',
				status: 'AUDITING_PASS',
				icon: require('@/v2/assets/imgs/termination/initiator-approval-active.svg')
			},
			{
				text: '合同终止完成',
				status: '',
				icon: require('@/v2/assets/imgs/termination/contract-approval-active.svg')
			}
		],
		// 平台审批驳回
		AUDITING_REJECT: [
			{
				text: '发起合同终止',
				status: 'INITIATE_APPLY',
				icon: require('@/v2/assets/imgs/termination/termination-avtive.svg')
			},
			{
				text: '平台审批驳回',
				status: 'AUDITING_REJECT',
				icon: require('@/v2/assets/imgs/termination/accept-stamp-reject.svg')
			},
			{
				text: '合同未终止完成',
				status: '',
				icon: require('@/v2/assets/imgs/termination/contract-approval-active.svg')
			}
		]
	},
	// 交易双方达成一致，解除协议，没有对接oa
	RESCISSION_OF_AGREEMENT: {
		// 发起方审批驳回
		AUDITING_REJECT_1: [
			{
				text: '发起合同终止',
				status: 'WAIT_SIGN_SEAL',
				icon: require('@/v2/assets/imgs/termination/termination-avtive.svg')
			},
			{
				text: '发起方驳回',
				status: 'AUDITING_REJECT',
				icon: require('@/v2/assets/imgs/termination/approval-reject-active.svg')
			},
			{
				text: '合同未终止成功',
				status: '',
				icon: require('@/v2/assets/imgs/termination/contract-approval-active.svg')
			}
		],
		// 待接收方确认
		WAIT_CONFIRM: [
			{
				text: '发起合同终止',
				status: 'WAIT_SIGN_SEAL',
				icon: require('@/v2/assets/imgs/termination/termination-avtive.svg')
			},
			{
				text: '发起方盖章完成',
				status: 'WAIT_CONFIRM',
				icon: require('@/v2/assets/imgs/termination/initiator-stamp-active.svg')
			},
			{
				text: '接收方确认盖章中',
				status: '',
				icon: require('@/v2/assets/imgs/termination/accept-stamp.svg')
			},
			{
				text: '合同终止完成',
				status: '',
				icon: require('@/v2/assets/imgs/termination/contract-terminate.svg')
			}
		],
		// 接收方审批中
		AUDITING_RECEIVE: [
			{
				text: '发起合同终止',
				status: 'WAIT_SIGN_SEAL',
				icon: require('@/v2/assets/imgs/termination/termination-avtive.svg')
			},
			{
				text: '发起方盖章完成',
				status: 'WAIT_CONFIRM',
				icon: require('@/v2/assets/imgs/termination/initiator-stamp-active.svg')
			},
			{
				text: '接收方确认盖章中',
				status: '',
				icon: require('@/v2/assets/imgs/termination/accept-stamp.svg')
			},
			{
				text: '合同终止完成',
				status: '',
				icon: require('@/v2/assets/imgs/termination/contract-terminate.svg')
			}
		],
		// 待发起方盖章
		WAIT_SIGN_SEAL: [
			{
				text: '发起合同终止',
				status: 'WAIT_SIGN_SEAL',
				icon: require('@/v2/assets/imgs/termination/termination-avtive.svg')
			},
			{
				text: '发起方盖章中',
				status: 'WAIT_CONFIRM',
				icon: require('@/v2/assets/imgs/termination/initiator-stamp.svg')
			},
			{
				text: '接收方确认盖章',
				status: '',
				icon: require('@/v2/assets/imgs/termination/accept-stamp.svg')
			},
			{
				text: '合同终止完成',
				status: '',
				icon: require('@/v2/assets/imgs/termination/contract-terminate.svg')
			}
		],
		// 待接收方盖章
		CONFIRM_WAIT_SIGN_SEAL: [
			{
				text: '发起合同终止',
				status: 'WAIT_SIGN_SEAL',
				icon: require('@/v2/assets/imgs/termination/termination-avtive.svg')
			},
			{
				text: '发起方盖章完成',
				status: 'WAIT_CONFIRM',
				icon: require('@/v2/assets/imgs/termination/initiator-stamp-active.svg')
			},
			{
				text: '接收方盖章中',
				status: '',
				icon: require('@/v2/assets/imgs/termination/accept-stamp.svg')
			},
			{
				text: '合同终止完成',
				status: '',
				icon: require('@/v2/assets/imgs/termination/contract-terminate.svg')
			}
		],
		// 接收方驳回
		CONFIRM_REJECT_2: [
			{
				text: '发起合同终止',
				status: 'WAIT_SIGN_SEAL',
				icon: require('@/v2/assets/imgs/termination/termination-avtive.svg')
			},
			{
				text: '发起方盖章完成',
				status: 'WAIT_CONFIRM',
				icon: require('@/v2/assets/imgs/termination/initiator-stamp-active.svg')
			},
			{
				text: '接收方驳回',
				status: 'CONFIRM_REJECT',
				icon: require('@/v2/assets/imgs/termination/approval-reject-active.svg')
			},
			{
				text: '合同未终止成功',
				status: 'CONFIRM_REJECT',
				icon: require('@/v2/assets/imgs/termination/contract-approval-active.svg')
			}
		],
		// 接收方审批驳回
		AUDITING_REJECT_2: [
			{
				text: '发起合同终止',
				status: 'WAIT_SIGN_SEAL',
				icon: require('@/v2/assets/imgs/termination/termination-avtive.svg')
			},
			{
				text: '发起方盖章完成',
				status: 'WAIT_CONFIRM',
				icon: require('@/v2/assets/imgs/termination/initiator-stamp-active.svg')
			},
			{
				text: '接收方驳回',
				status: 'AUDITING_REJECT',
				icon: require('@/v2/assets/imgs/termination/approval-reject-active.svg')
			},
			{
				text: '合同未终止成功',
				status: '',
				icon: require('@/v2/assets/imgs/termination/contract-approval-active.svg')
			}
		],
		// 接收方作废
		CANCELLATION_2: [
			{
				text: '发起合同终止',
				status: 'WAIT_SIGN_SEAL',
				icon: require('@/v2/assets/imgs/termination/termination-avtive.svg')
			},
			{
				text: '发起方盖章完成',
				status: 'WAIT_CONFIRM',
				icon: require('@/v2/assets/imgs/termination/initiator-stamp-active.svg')
			},
			{
				text: '接收方驳回',
				status: 'CANCELLATION',
				icon: require('@/v2/assets/imgs/termination/approval-reject-active.svg')
			},
			{
				text: '合同未终止成功',
				status: 'CANCELLATION',
				icon: require('@/v2/assets/imgs/termination/contract-approval-active.svg')
			}
		],
		// 发起方作废
		CANCELLATION_1: [
			{
				text: '发起合同终止',
				status: 'WAIT_SIGN_SEAL',
				icon: require('@/v2/assets/imgs/termination/termination-avtive.svg')
			},
			{
				text: '发起方作废流程',
				status: 'CANCELLATION',
				icon: require('@/v2/assets/imgs/termination/approval-reject-active.svg')
			},
			{
				text: '合同未终止成功',
				status: 'CANCELLATION',
				icon: require('@/v2/assets/imgs/termination/contract-approval-active.svg')
			}
		],
		// 终止成功
		CONFIRM: [
			{
				text: '发起合同终止',
				status: 'WAIT_SIGN_SEAL',
				icon: require('@/v2/assets/imgs/termination/termination-avtive.svg')
			},
			{
				text: '发起方盖章完成',
				status: 'WAIT_CONFIRM',
				icon: require('@/v2/assets/imgs/termination/initiator-approval-active.svg')
			},
			{
				text: '接收方确认盖章完成',
				status: 'CONFIRM_WAIT_SIGN_SEAL',
				icon: require('@/v2/assets/imgs/termination/initiator-approval-active.svg')
			},
			{
				text: '合同终止成功',
				status: 'CONFIRM',
				icon: require('@/v2/assets/imgs/termination/contract-approval-active.svg')
			}
		]
	},
	// 交易双方达成一致，解除协议 对接oa
	RESCISSION_OF_AGREEMENT_OA: {
		// 发起方审批中
		AUDITING: [
			{
				text: '发起合同终止',
				status: 'AUDITING',
				icon: require('@/v2/assets/imgs/termination/termination-avtive.svg')
			},
			{
				text: '发起方审批中',
				status: 'AUDITING',
				icon: require('@/v2/assets/imgs/termination/initiator-approval.svg')
			},
			{
				text: '发起方盖章',
				status: '',
				icon: require('@/v2/assets/imgs/termination/initiator-stamp.svg')
			},
			{
				text: '接收方确认盖章',
				status: '',
				icon: require('@/v2/assets/imgs/termination/accept-stamp.svg')
			},
			{
				text: '合同终止完成',
				status: '',
				icon: require('@/v2/assets/imgs/termination/contract-terminate.svg')
			}
		],
		// 发起方审批驳回
		AUDITING_REJECT_1: [
			{
				text: '发起合同终止',
				status: 'AUDITING',
				icon: require('@/v2/assets/imgs/termination/termination-avtive.svg')
			},
			{
				text: '发起方审批驳回',
				status: 'AUDITING_REJECT',
				icon: require('@/v2/assets/imgs/termination/approval-reject-active.svg')
			},
			{
				text: '合同未终止成功',
				status: '',
				icon: require('@/v2/assets/imgs/termination/contract-approval-active.svg')
			}
		],
		// 待发起方盖章
		WAIT_SIGN_SEAL: [
			{
				text: '发起合同终止',
				status: 'AUDITING',
				icon: require('@/v2/assets/imgs/termination/termination-avtive.svg')
			},
			{
				text: '发起方审批通过',
				status: 'WAIT_SIGN_SEAL',
				icon: require('@/v2/assets/imgs/termination/initiator-approval-active.svg')
			},
			{
				text: '发起方盖章中',
				status: '',
				icon: require('@/v2/assets/imgs/termination/initiator-stamp.svg')
			},
			{
				text: '接收方确认盖章',
				status: '',
				icon: require('@/v2/assets/imgs/termination/initiator-approval.svg')
			},
			{
				text: '合同终止成功',
				status: '',
				icon: require('@/v2/assets/imgs/termination/contract-approval.svg')
			}
		],
		// 待接收方确认
		WAIT_CONFIRM: [
			{
				text: '发起合同终止',
				status: 'AUDITING',
				icon: require('@/v2/assets/imgs/termination/termination-avtive.svg')
			},
			{
				text: '发起方审批通过',
				status: 'WAIT_SIGN_SEAL',
				icon: require('@/v2/assets/imgs/termination/initiator-approval-active.svg')
			},
			{
				text: '发起方盖章完成',
				status: 'WAIT_CONFIRM',
				icon: require('@/v2/assets/imgs/termination/initiator-stamp-active.svg')
			},
			{
				text: '接收方确认盖章中',
				status: '',
				icon: require('@/v2/assets/imgs/termination/accept-stamp.svg')
			},
			{
				text: '合同终止完成',
				status: '',
				icon: require('@/v2/assets/imgs/termination/contract-terminate.svg')
			}
		],
		// 接收方审批中
		AUDITING_RECEIVE: [
			{
				text: '发起合同终止',
				status: 'AUDITING',
				icon: require('@/v2/assets/imgs/termination/termination-avtive.svg')
			},
			{
				text: '发起方审批通过',
				status: 'WAIT_SIGN_SEAL',
				icon: require('@/v2/assets/imgs/termination/initiator-approval-active.svg')
			},
			{
				text: '发起方盖章完成',
				status: 'WAIT_CONFIRM',
				icon: require('@/v2/assets/imgs/termination/initiator-stamp-active.svg')
			},
			{
				text: '接收方确认盖章中',
				status: '',
				icon: require('@/v2/assets/imgs/termination/accept-stamp.svg')
			},
			{
				text: '合同终止完成',
				status: '',
				icon: require('@/v2/assets/imgs/termination/contract-terminate.svg')
			}
		],
		// 待接收方盖章
		CONFIRM_WAIT_SIGN_SEAL: [
			{
				text: '发起合同终止',
				status: 'AUDITING',
				icon: require('@/v2/assets/imgs/termination/termination-avtive.svg')
			},
			{
				text: '发起方审批通过',
				status: 'WAIT_SIGN_SEAL',
				icon: require('@/v2/assets/imgs/termination/initiator-approval-active.svg')
			},
			{
				text: '发起方盖章完成',
				status: 'WAIT_CONFIRM',
				icon: require('@/v2/assets/imgs/termination/initiator-stamp-active.svg')
			},
			{
				text: '接收方确认盖章中',
				status: '',
				icon: require('@/v2/assets/imgs/termination/accept-stamp.svg')
			},
			{
				text: '合同终止完成',
				status: '',
				icon: require('@/v2/assets/imgs/termination/contract-terminate.svg')
			}
		],
		// 接收方驳回
		CONFIRM_REJECT_2: [
			{
				text: '发起合同终止',
				status: 'AUDITING',
				icon: require('@/v2/assets/imgs/termination/termination-avtive.svg')
			},
			{
				text: '发起方审批通过',
				status: 'WAIT_SIGN_SEAL',
				icon: require('@/v2/assets/imgs/termination/initiator-approval-active.svg')
			},
			{
				text: '发起方盖章完成',
				status: 'WAIT_CONFIRM',
				icon: require('@/v2/assets/imgs/termination/initiator-stamp-active.svg')
			},
			{
				text: '接收方驳回',
				status: 'CONFIRM_REJECT',
				icon: require('@/v2/assets/imgs/termination/approval-reject-active.svg')
			},
			{
				text: '合同未终止成功',
				status: '',
				icon: require('@/v2/assets/imgs/termination/contract-approval-active.svg')
			}
		],
		// 接收方审批驳回
		AUDITING_REJECT_2: [
			{
				text: '发起合同终止',
				status: 'AUDITING',
				icon: require('@/v2/assets/imgs/termination/termination-avtive.svg')
			},
			{
				text: '发起方审批通过',
				status: 'WAIT_SIGN_SEAL',
				icon: require('@/v2/assets/imgs/termination/initiator-approval-active.svg')
			},
			{
				text: '发起方盖章完成',
				status: 'WAIT_CONFIRM',
				icon: require('@/v2/assets/imgs/termination/initiator-stamp-active.svg')
			},
			{
				text: '接收方驳回',
				status: 'AUDITING_REJECT',
				icon: require('@/v2/assets/imgs/termination/approval-reject-active.svg')
			},
			{
				text: '合同未终止成功',
				status: '',
				icon: require('@/v2/assets/imgs/termination/contract-approval-active.svg')
			}
		],
		// 接收方作废
		CANCELLATION_2: [
			{
				text: '发起合同终止',
				status: 'AUDITING',
				icon: require('@/v2/assets/imgs/termination/termination-avtive.svg')
			},
			{
				text: '发起方审批通过',
				status: 'WAIT_SIGN_SEAL',
				icon: require('@/v2/assets/imgs/termination/initiator-approval-active.svg')
			},
			{
				text: '发起方盖章完成',
				status: 'WAIT_CONFIRM',
				icon: require('@/v2/assets/imgs/termination/initiator-stamp-active.svg')
			},
			{
				text: '接收方驳回',
				status: 'CANCELLATION',
				icon: require('@/v2/assets/imgs/termination/approval-reject-active.svg')
			},
			{
				text: '合同未终止成功',
				status: '',
				icon: require('@/v2/assets/imgs/termination/contract-approval-active.svg')
			}
		],
		// 发起方作废
		CANCELLATION_1: [
			{
				text: '发起合同终止',
				status: 'AUDITING',
				icon: require('@/v2/assets/imgs/termination/termination-avtive.svg')
			},
			{
				text: '发起方审批通过',
				status: 'WAIT_SIGN_SEAL',
				icon: require('@/v2/assets/imgs/termination/initiator-approval-active.svg')
			},
			{
				text: '发起方取消合同终止',
				status: 'CANCELLATION',
				icon: require('@/v2/assets/imgs/termination/approval-reject-active.svg')
			},
			{
				text: '合同未终止成功',
				status: '',
				icon: require('@/v2/assets/imgs/termination/contract-approval-active.svg')
			}
		],
		// 终止成功
		CONFIRM: [
			{
				text: '发起合同终止',
				status: 'AUDITING',
				icon: require('@/v2/assets/imgs/termination/termination-avtive.svg')
			},
			{
				text: '发起方审批通过',
				status: 'WAIT_SIGN_SEAL',
				icon: require('@/v2/assets/imgs/termination/initiator-approval-active.svg')
			},
			{
				text: '发起方盖章完成',
				status: 'WAIT_CONFIRM',
				icon: require('@/v2/assets/imgs/termination/initiator-stamp-active.svg')
			},
			{
				text: '接收方确认盖章完成',
				status: 'CONFIRM_WAIT_SIGN_SEAL',
				icon: require('@/v2/assets/imgs/termination/accept-stamp-active.svg')
			},
			{
				text: '合同终止成功',
				status: 'CONFIRM',
				icon: require('@/v2/assets/imgs/termination/contract-approval-active.svg')
			}
		]
	}
};
