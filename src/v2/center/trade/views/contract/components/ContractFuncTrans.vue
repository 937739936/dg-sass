<template>
	<div>
		<BusinessTransfer
			ref="businessModal"
			@confirm="searchSubmit"
		></BusinessTransfer>
		<DespatchCodeModal ref="despatchCodeModal" />
		<CancelModal
			ref="cancelModal"
			@cancelSubmit="cancelContractSubmit"
		/>
		<UpdateDirector
			ref="updateDirector"
			@updateFunc="searchSubmit"
		/>
		<UpdateApprovalProcess
			ref="updateApprovalProcess"
			@updateFunc="searchSubmit"
		/>
		<BusinessLineModal
			ref="businessLineModal"
			@updateFunc="searchSubmit"
		/>
		<StartAddPaymentModel ref="startAddPaymentModel" />
	</div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import { getPopupContainer } from '@/v2/utils/factory.js';
import DespatchCodeModal from './DespatchCodeModal';
import BusinessTransfer from './BusinessTransfer';
import CancelModal from '@/v2/components/cancel/index';
import UpdateDirector from './UpdateDirector';
import UpdateApprovalProcess from './UpdateApprovalProcess';
import { API_contract_delete } from '@/v2/center/trade/api/transportContract';
import BusinessLineModal from './BusinessLineModal.vue';
import comDownload from '@sub/utils/comDownload.js';
import { API_downloadAllTransContractAttachment } from '@/v2/center/trade/api/transportContract';
import StartAddPaymentModel from '@/v2/center/trade/views/pay/payManage/models/StartAddPaymentModel';

export default {
	data() {
		return {
			getPopupContainer,
			cancelId: null // 作废合同id
		};
	},
	props: ['detail', 'type'],
	components: {
		DespatchCodeModal,
		BusinessTransfer,
		CancelModal,
		UpdateDirector,
		UpdateApprovalProcess,
		BusinessLineModal,
		StartAddPaymentModel
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		currentCompanyUscc() {
			return this.VUEX_ST_COMPANYSUER.company.uscc;
		}
	},
	mounted() {},
	methods: {
		...mapMutations({
			VUEX_setRelationContract: 'business/VUEX_setRelationContract'
		}),
		// 下载合同附件
		downloadFile() {
			let zipFileName =
				this.detail.consigneeCompanyName +
				'_' +
				this.detail.consignorCompanyName +
				'_' +
				this.detail.paperContractNo +
				'_' +
				this.detail.contractSignTime +
				'.zip';
			//压缩包命名规则：承运人_托运人_合同编号_签订日期
			API_downloadAllTransContractAttachment({ id: this.detail.id }).then(res => {
				comDownload(res, undefined, zipFileName);
				this.$message.success('下载成功');
			});
		},
		// 修改业务线
		changeBusinessLine() {
			this.$refs.businessLineModal.showModal(this.detail);
		},
		// 合同修改
		eidtContract(type) {
			if (type == 'transport') {
				this.$router.push({
					path: '/center/contract/transport/add',
					query: {
						flag: 'edit',
						id: this.detail.id,
						type: this.type
					}
				});
			}
		},
		contractDetail(type) {
			if (type == 'transport') {
				this.$router.push({
					path: '/center/contract/transport/detail',
					query: {
						id: this.detail.id
					}
				});
			}
		},
		// 去发货
		toDeliver() {
			this.$router.push({
				path: '/center/receive/send/apply?orderId=' + this.detail.id
			});
		},
		// 去收货
		toReceive() {
			this.$router.push({
				path: '/center/receive/accept/list',
				query: {
					contractNo: this.detail.contractNo,
					from: 'contract'
				}
			});
		},
		// 开具货转
		toGoodsTransfer() {
			this.$router.push({
				path: '/center/transfer/goodsTransfer/apply',
				query: {
					serialNo: this.detail.serialNo,
					orderType: 'ONLINE',
					serialId: this.detail.id
				}
			});
		},
		// 业务转移
		openBusinessModal() {
			this.detail.type = this.type;
			this.$refs.businessModal.show(this.detail);
		},
		// 回调查询
		searchSubmit(data) {
			this.$emit('refresh', data);
		},
		//作废合同
		cancelContract() {
			this.cancelId = this.detail.id;
			this.$confirm({
				content: '确定要删除当前合同吗？删除后将无法恢复。',
				onCancel: () => {
					this.$destroyAll();
				},
				onOk: () => {
					this.cancelContractSubmit();
				}
			});
		},
		cancelContractSubmit() {
			API_contract_delete({
				id: this.cancelId
			}).then(res => {
				if (res.success) {
					this.$message.success('作废成功');
					this.searchSubmit();
				}
			});
		},
		// 结算单确认
		toSettleConfirm() {
			this.$router.push({
				path: '/center/settle/confirm/list',
				query: {
					contractNo: this.detail.contractNo
				}
			});
		},
		// 去结算
		toSettle() {
			const { id } = this.detail;
			this.$router.push({
				path: '/center/settle/transport/add',
				query: {
					contractId: id
				}
			});
		},
		// 收款确认
		toCollectConfirm() {
			this.$router.push({
				path: '/center/fund/collect/record/list',
				query: {
					contractNo: this.detail.contractNo
				}
			});
		},
		// 去付款
		toPay() {
			this.$refs.startAddPaymentModel.addNewPayment({ serialNo: this.detail.contractNo, contractType: 'TRANSPORT' });
		},
		// 去上传发票
		toInvoice() {
			this.$router.push({
				path: '/center/invoice/freight/add',
				query: {
					type: 'freight',
					orderNo: this.detail.contractNo
				}
			});
		},
		// 修改上下游负责人
		updateDirector() {
			this.detail.type = this.type;
			this.$refs.updateDirector.show(this.detail);
		}
	}
};
</script>
