<template>
	<div>
		<ContractSelectModel
			ref="contractSelectModel"
			@secondStepOfContractPayCheck="secondStepOfContractPayCheck"
		/>
		<ContractPayCheckTipModel
			ref="contractPayCheckTipModel"
			@nextStepClick="pushToNewPaymentPage"
		/>
	</div>
</template>

<script>
import ContractSelectModel from '@/v2/center/trade/views/pay/payManage/models/ContractSelectModel';
import ContractPayCheckTipModel from '@/v2/center/trade/views/pay/payManage/models/ContractPayCheckTipModel';
import { API_ContractPaymentCheck } from '@/v2/center/trade/api/pay';
// 这里是发起新增付款流程的入口包含第一步和第二步校验合同是否可以进行支付
// ActionType = 'ADD_NEW_PAYMENT' 'EDIT_PAYMENT' 'RESUBMIT_PAYMENT'
export default {
	name: 'StartAddPaymentModel',
	components: {
		ContractSelectModel,
		ContractPayCheckTipModel
	},

	data() {
		return {
			contractId: null
		};
	},
	methods: {
		/**
		 * 开始发起新增付款
		 * @param {*} payContractInfo: {
		 * serialNo: 如果是电子合同，传orderNo；如果是线下合同和运输合同，传contractNo,
		 * contractType: ONLINE :电子 OFFLINE :线下 TRANSPORT :运输
		 * } // 合同信息存在时跳过选择合同步骤，进入第二步合同校验
		 *
		 */
		addNewPayment(payContractInfo) {
			if (payContractInfo && payContractInfo.serialNo && payContractInfo.contractType) {
				let { serialNo, contractType } = payContractInfo;
				this.secondStepOfContractPayCheck({ serialNo, contractType });
			} else {
				this.firstStepOfAddPayment();
			}
		},
		// 新增付款第一步-选择合同
		firstStepOfAddPayment() {
			this.$refs.contractSelectModel.showModal();
		},
		// 新增付款第二步-校验合同，是否可以进行支付
		secondStepOfContractPayCheck(payContractInfo) {
			let { serialNo, contractType } = payContractInfo;
			if (serialNo == null || contractType == null) {
				return;
			}
			if (contractType == 'TRANSPORT') {
				this.pushToNewPaymentPage(payContractInfo);
				return;
			}
			API_ContractPaymentCheck({ serialNo, contractType }).then(res => {
				if (res.success) {
					let tipInfo = res.data;
					if (tipInfo.result) {
						// 校验通过不需要弹窗直接新增付款
						this.pushToNewPaymentPage(payContractInfo);
					} else {
						// 校验不通过弹窗提示,再新增付款
						this.$refs.contractPayCheckTipModel.showModal(tipInfo, payContractInfo);
					}
				} else {
					// this.showContractPayCheckTip(serialNo, contractType, id, actionType);
				}
			});
		},
		// 新增付款第三步-跳转新增付款页面
		pushToNewPaymentPage(payContractInfo) {
			let { serialNo, contractType, id, actionType } = payContractInfo;
			let paymentEditPath = '/center/fund/pay/add';
			if (contractType == 'TRANSPORT') {
				paymentEditPath = '/center/fund/pay/addTrans';
			}
			this.$router.push({
				path: paymentEditPath,
				query: {
					contractType: contractType, // 电子合同传‘ONLINE’, 线下合同传'OFFLINE'
					serialNo: serialNo, //电子合同，传orderNo；如果是线下、运输合同，传contractNo
					id: id,
					actionType: actionType // 新增付款ADD_NEW_PAYMENT、编辑付款EDIT_PAYMENT、重新提交付款RESUBMIT_PAYMENT
				}
			});
			// this.$router.push({
			// 	path: paymentEditPath,
			// 	query: {
			// 		contractType: 'ONLINE', // 电子合同传‘ONLINE’, 线下合同传'OFFLINE'
			// 		serialNo: 'SKOD202307071610100001' //电子合同，传orderNo；如果是线下、运输合同，传contractNo
			// 	}
			// });
			// 运输合同
			// this.$router.push({ path: '/center/fund/pay/addTrans', query: {
			// 	contractType: 'TRANSPORT',
			// 	serialNo: 'SKBT202404160005', //电子合同，传orderNo；如果是线下合同，传contractNo
			// } });
		},
		// 编辑付款
		paymentEdit(payContractInfo) {
			let { serialNo, contractType, id } = payContractInfo;
			this.secondStepOfContractPayCheck({ serialNo, contractType, id, actionType: 'EDIT_PAYMENT' });
		},
		// 付款重新提交
		paymentResubmit(payContractInfo) {
			let { serialNo, contractType, id } = payContractInfo;
			this.secondStepOfContractPayCheck({ serialNo, contractType, id, actionType: 'RESUBMIT_PAYMENT' });
		}
	}
};
</script>

<style lang="less" scoped>
</style>