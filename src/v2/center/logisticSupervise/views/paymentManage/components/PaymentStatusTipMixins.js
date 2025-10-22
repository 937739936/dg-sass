import { API_GetPaymentStatusTip } from '@/v2/center/trade/api/pay';
export default {
	data() {
		return {
			statusTipInfo: {
				status: '', // 状态
				isTipLoading: false, // 是否正在获取状态提示
				statusTip: '' // 状态提示
			} // 状态提示信息
		};
	},
	computed: {
		// 需要提示的列表付款状态
		listNeedTipStatus() {
			return [
				'PLATFORM_AUDITING_REJECT', // 平台运营驳回
				'RISK_CONTROL_REJECT', // 平台风控驳回
				'REJECT', // OA驳回
				'CUSTOM_REJECT', // 客户退回
				'ASSET_ARRANGING', // 资产整理中
				'FIN_FINANCING' // 融资放款中
			];
		},
		// 需要提示的步骤付款状态
		stepNeedTipStatus() {
			let list = this.listNeedTipStatus;
			list.push('CANCEL'); // 资产作废
			return list;
		},
		// 需要提示的操作步骤
		stepNeedTipOperations() {
			return [
				'PLATFORM_AUDITING_REJECT', // 平台运营驳回
				'RISK_CONTROL_REJECT', // 平台风控驳回
				'OA_REJECT', // OA驳回
				'REPAY_CONFIRM_REJECT', // 收款确认驳回(收款方客户退回)
				'ASSET_CANCEL', // 资产作废
				'ASSET_ARRANGED', // 资产整理完成
				'FIN_FINANCED' // 融资放款完成
			];
		}
	},
	methods: {
		// 是否需要提示
		currentIsNeedTip(query) {
			let { businessOperation, paymentStatus, isSteps } = query;
			if (isSteps) {
				return this.stepNeedTipStatus.includes(paymentStatus) || this.stepNeedTipOperations.includes(businessOperation);
			}
			return this.listNeedTipStatus.includes(paymentStatus);
		},
		// 获取状态提示
		getPaymentStatusTip(visible, query) {
			if (!visible) {
				return;
			}
			let { businessOperation, paymentStatus, paymentNo } = query;
			if (!paymentStatus && !businessOperation) {
				return;
			}
			if (!this.currentIsNeedTip(query)) {
				return;
			}
			this.statusTipInfo = {
				status: paymentStatus,
				isTipLoading: true,
				statusTip: ''
			};
			API_GetPaymentStatusTip({
				paymentNo: paymentNo,
				paymentStatus: paymentStatus,
				paymentOperate: businessOperation
			})
				.then(res => {
					if (res.success) {
						let tipInfo = res.data;
						let tip = '';
						if (businessOperation) {
							tip = this.formatOperationTip(tipInfo, businessOperation);
						} else {
							tip = this.formatStatusTip(tipInfo, paymentStatus);
						}
						this.statusTipInfo = { ...this.statusTipInfo, statusTip: tip };
					} else {
						this.$set(this.statusTipInfo, 'statusTip', '获取状态提示失败');
					}
				})
				.catch(() => {
					this.$set(this.statusTipInfo, 'statusTip', '获取状态提示失败');
				})
				.finally(() => {
					this.$set(this.statusTipInfo, 'isTipLoading', false);
				});
		},
		formatOperationTip(tipInfo, operator) {
			let tip = '';
			let result = tipInfo.result || '';
			let reason = tipInfo.reason || '';
			let platformName = tipInfo.platformName || '';
			let operateTime = tipInfo.operateTime || '';
			let personName = tipInfo.personName || '';
			let assetSerialNo = tipInfo.assetSerialNo || '';
			if (operator == 'PLATFORM_AUDITING_REJECT' || operator == 'RISK_CONTROL_REJECT') {
				// 平台运营驳回 或平台风控驳回
				tip = '审核结果：' + result + '\n';
				tip += '审核时间：' + operateTime + '\n';
				tip += '审核人：' + personName + '\n';
				tip += '驳回原因：' + reason;
			} else if (operator == 'OA_REJECT') {
				// OA驳回
				tip = '审核结果：' + result + '\n';
				tip += '审核时间：' + operateTime + '\n';
				tip += '审核平台：' + platformName + '\n';
			} else if (operator == 'REPAY_CONFIRM_REJECT') {
				// 收款确认驳回(收款方客户退回)
				tip = '确认结果：' + result + '\n';
				tip += '确认时间：' + operateTime + '\n';
				tip += '退回原因：' + reason;
			} else if (operator == 'ASSET_CANCEL' || operator == 'ASSET_ARRANGED') {
				// 资产作废 资产整理完成
				tip = '资产编号：' + assetSerialNo + '\n';
				tip += '资产状态：' + this.receivableStatusTip(tipInfo.receivableStatus, tipInfo.statusDesc, tipInfo.assetStatusTipVO);
			} else if (operator == 'FIN_FINANCED') {
				// 融资放款完成
				tip = '融资编号：' + assetSerialNo + '\n';
				tip += '融资状态：' + this.finStatusTip(tipInfo.financingStatus, tipInfo.statusDesc, tipInfo.finStatusTipVO);
			}
			return tip;
		},
		// 设置状态提示
		formatStatusTip(tipInfo, status) {
			/**
				{ 
					result: 审核结果、确认结果
					operateTime:审核时间、确认时间
					platformName:平台名字 审核平台
					personName: 操作人 审核人
					reason: 驳回原因 退回原因
					assetSerialNo: 资产编号/融资编号
					assetStatusTip: 资产状态提示语
					receivableStatus: 资产状态
					financingStatus: 融资状态
					statusDesc: 状态描述
					assetStatusTipVO: 资产状态提示语对应参数
					finStatusTipVO: 融资状态提示语对应参数
				}
			*/

			let tip = '';
			let result = tipInfo.result || '';
			let reason = tipInfo.reason || '';
			let platformName = tipInfo.platformName || '';
			let operateTime = tipInfo.operateTime || '';
			let personName = tipInfo.personName || '';
			let assetSerialNo = tipInfo.assetSerialNo || '';

			// 平台运营驳回 或平台风控驳回
			if (status == 'PLATFORM_AUDITING_REJECT' || status == 'RISK_CONTROL_REJECT') {
				tip = '审核结果：' + result + '\n';
				tip += '审核时间：' + operateTime + '\n';
				tip += '审核人：' + personName + '\n';
				tip += '驳回原因：' + reason;
			} else if (status == 'REJECT') {
				// OA驳回
				tip = '审核结果：' + result + '\n';
				tip += '审核时间：' + operateTime + '\n';
				tip += '审核平台：' + platformName + '\n';
			} else if (status == 'CUSTOM_REJECT') {
				// 客户退回
				tip = '确认结果：' + result + '\n';
				tip += '确认时间：' + operateTime + '\n';
				tip += '退回原因：' + reason;
			} else if (status == 'ASSET_ARRANGING' || status == 'CANCEL') {
				// 资产整理中 资产作废
				tip = '资产编号：' + assetSerialNo + '\n';
				tip += '资产状态：' + this.receivableStatusTip(tipInfo.receivableStatus, tipInfo.statusDesc, tipInfo.assetStatusTipVO);
			} else if (status == 'FIN_FINANCING') {
				// 融资放款中
				tip = '融资编号：' + assetSerialNo + '\n';
				tip += '融资状态：' + this.finStatusTip(tipInfo.financingStatus, tipInfo.statusDesc, tipInfo.finStatusTipVO);
			}
			return tip;
		},
		// 资产状态提示语
		receivableStatusTip(status, statusDes, assetStatusTipVO) {
			let statusTip = AssetStatusTooltip[status] || '';
			let data = assetStatusTipVO || {};
			statusTip = statusTip
				.replace('【资产编辑企业】', data.initAbbreviation || '')
				.replace('【资产编辑企业-签章员】', data.initAbbreviation + '-' + data.signerNames)
				.replace('【资产上游卖方企业-签章员】', data.initAbbreviation + '-' + data.signerNames)
				.replace('【审批流程】', data.auditDesc || '')
				.replace('【金融机构】', data.bankAbbreviation || '')
				.replace('【操作方】', data.operator || '')
				.replace('【作废原因】', data.cancelReason || '');
			let tip = statusDes || '';
			if (statusTip) {
				tip += '(' + statusTip + ')';
			}
			return tip;
		},
		finStatusTip(status, statusDes, finStatusTipVO) {
			let statusTip = FinStatusTooltip[status] || '';
			let data = finStatusTipVO || {};
			statusTip = statusTip
				.replace('【融资发起方对应卖方企业】', data.sellerAbbreviation || '')
				.replace('【融资申请企业-签章员】', data.initAbbreviation + '-' + data.initSignerNames)
				.replace('【审批流程】', data.auditDesc || '')
				.replace('【金融机构】', data.bankAbbreviation || '')
				.replace('【金融机构-签章员】', data.bankAbbreviation + '-' + data.bankSignerNames)
				.replace('【操作方名称】', data.operator || '')
				.replace('【买方企业】', data.buyerAbbreviation || '')
				.replace('【买方企业-签章员】', data.buyerAbbreviation + '-' + data.buyerSignerNames)
				.replace('【作废原因】', data.cancelReason || '');
			// let pre = true;
			// if (pre) {
			// 	// 预融资
			// 	statusTip = statusTip
			// 		.replace('【融资发起方对应卖方企业-签章员】', data.sellerAbbreviation + '-' + data.sellerSignerNames)
			// 		.replace('【融资发起方对应卖方企业】', data.sellerAbbreviation || '')
			// 		.replace('【融资申请企业-签章员】', data.initAbbreviation + '-' + data.initSignerNames)
			// 		.replace('【审批流程】', data.auditDesc || '')
			// 		.replace('【金融机构】', data.bankAbbreviation || '')
			// 		.replace('【金融机构-签章员】', data.bankAbbreviation + '-' + data.bankSignerNames)
			// 		.replace('【操作方名称】', data.operator || '')
			// 		.replace('【买方企业】', data.sellerUpAbbreviation || '')
			// 		.replace('【买方企业-签章员】', data.sellerUpAbbreviation + '-' + data.sellerUpSignerNames)
			// 		.replace('【作废原因】', data.cancelReason || '');
			// }
			let tip = statusDes || '';
			if (statusTip) {
				tip += '(' + statusTip + ')';
			}
			return tip;
		}
	}
};
// 资产状态的提示信息，
const AssetStatusTooltip = {
	TO_BE_VERIFY: '该资产已生成，待【资产编辑企业】编辑后提交',
	TO_BE_CONFIRM: '该资产待【资产编辑企业-签章员】进行盖章',
	PLATFORM_AUDIT: '该资产已被【资产编辑企业】提交，正处于平台风控审核流程',
	PLATFORM_REJECT: '该资产已被平台风控驳回，待【资产编辑企业】编辑后提交',
	OA_AUDIT: '该资产正处于【审批流程】流程',
	OA_REJECT: '该资产【审批流程】流程未通过',
	BANK_PUSH_FAIL: '该资产推送资方系统失败，待平台风控进行处理',
	BANK_AUDIT: '该资产待【金融机构】进行审核',
	TODO: '该资产可发起融资申请',
	DOING: '该资产正处于融资提款流程中',
	BANK_REJECT: '该资产被【金融机构】审核驳回，待平台风控进行批注',
	COMMENTED: '该资产平台风控已批注，待【资产编辑企业】编辑后提交',
	FUNDED: '该资产已完成融资',
	CANCEL: '该资产已被【操作方】作废，作废原因：【作废原因】',
	INVALID: '该资产已超过资产到期日',
	IN_POOL: '该资产入池申请已通过',
	OUT_POOL: '该资产已出应收账款保理池',
	BANK_TO_BE_VERIFY: '该资产已推送到资方系统，请【资产编辑企业】登录【金融机构】系统进行后续操作',
	COUNTERFOIL_DOING: '该资产正在开立云票中',
	COUNTERFOIL_DONE: '该资产已成功开立云票',
	COUNTERFOIL_TODO: '该资产待【资产编辑企业】进行开立云票',
	TO_BE_SIGN: '该资产待【资产上游卖方企业-签章员】进行盖章'
};

// 融资状态的提示信息
const FinStatusTooltip = {
	TO_BE_SIGNED: '该融资申请已提交，待【融资申请企业-签章员】进行盖章',
	TRADER_AUDIT: '该融资申请待【融资发起方对应卖方企业】进行审核',
	TRADER_REJECT: '该融资申请被【融资发起方对应卖方企业】驳回',
	TRADER_TO_BE_SIGNED: '该融资申请待【融资发起方对应卖方企业-签章员】进行盖章',
	CORE_COMPANY_AUDIT: '该融资申请待【买方企业】进行审核',
	CORE_COMPANY_REJECT: '该融资申请被【买方企业】驳回',
	CORE_COMPANY_TO_BE_SIGNED: '该融资申请待【买方企业-签章员】进行盖章',
	OA_AUDIT: '该融资申请正处于【审批流程】流程',
	OA_REJECT: '该融资申请【审批流程】流程未通过',
	BANK_AUDIT: '该融资申请待【金融机构】进行审核',
	BANK_REJECT: '该融资申请被【金融机构】驳回',
	BANK_TO_BE_SIGNED: '该融资申请待【金融机构-签章员】进行盖章',
	WAITING_LOAN: '该融资申请待【金融机构】放款',
	LOANED: '该融资申请【金融机构】已放款',
	PART_REPAY: '该融资已完成部分还款',
	CLEARED: '该融资已全部结清',
	INVALID: '该融资申请已被【操作方名称】作废，作废原因：【作废原因】',
	PUSH_FAIL: '该融资推送资方系统失败，待平台风控进行处理'
};
