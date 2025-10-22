<template>
	<div>
		<BusinessTransfer
			ref="businessModal"
			@confirm="searchSubmit"
		></BusinessTransfer>
		<DespatchCodeModal ref="despatchCodeModal" />
		<CancelModal
			ref="cancelModal"
			v-on:clickOk="cancelContractSubmit"
		/>
		<UpdateDirector
			ref="updateDirector"
			@updateFunc="searchSubmit"
		/>
		<UpdateApprovalProcess
			ref="updateApprovalProcess"
			@updateFunc="searchSubmit"
		/>
		<TipModal
			title="提示"
			ref="tipModal"
			okBtnText="查看补协"
			@save="goSupple"
		>
			<div class="tip-modal">
				<p>当前合同有正在进行中的补协，只有将此补协作废、删除、或者双签完成才能发起新的补充协议。</p>
				<p>补协编号：{{ contractInfo.supplementalAgreementNo }}</p>
			</div>
		</TipModal>
		<ContractFinish ref="contractFinish" :info="contractFinishInfo" :isLoading="isLoading"></ContractFinish>
		<RelationPlan
			ref="relationPlan"
			:type="type"
			@updateFunc="searchSubmit"
			v-if="stationAuth"
		/>

		<modalInfo
			ref="modalInfoOk"
			title="提示"
			:tip="tip"
			:footer="false"
		/>
		<!-- 发起付款弹窗 -->
		<StartAddPaymentModel ref="startAddPaymentModel" />
	</div>
</template>

<script>
import {
	API_hasSeal,
	API_hasSubmitSeal,
	API_GETSETTLEAPPLYCHECK,
	downloadContractRelatedAllAttachment,
	otherBusinessTypeContractFinish,
	API_contract_cancel
} from '@/v2/center/trade/api/contract';
import comDownload from '@sub/utils/comDownload.js';
import modalInfo from '@/v2/components/modalInfo/info';
import { getSuppleLatest } from '@/v2/center/trade/api/suppleAgreement';
import { subsystemOptionsEdit } from '@/v2/center/logisticsPlatform/api';
import { mapGetters, mapMutations } from 'vuex';

import { getPopupContainer } from '@/v2/utils/factory.js';
import DespatchCodeModal from './DespatchCodeModal';
import BusinessTransfer from './BusinessTransfer';
// import CancelModal from '@/v2/components/cancel/index';
import CancelModal from '@/v2/center/trade/views/contract/components/CancelModal.vue';
import UpdateDirector from './UpdateDirector';
import UpdateApprovalProcess from './UpdateApprovalProcess';
import TipModal from '../suppleAgreement/components/TipModal.vue';
import ContractFinish from './ContractFinish.vue';




import RelationPlan from './RelationPlan';
import StartAddPaymentModel from '@/v2/center/trade/views/pay/payManage/models/StartAddPaymentModel';




export default {
	data() {
		return {
			getPopupContainer,
			cancelId: null, // 作废合同id
			tip: '', //合同选择判断异常提示
			contractInfo: {},
			// 合同完结
			contractFinishInfo: {},
			isLoading: false,

		};
	},
	props: ['detail', 'type'],
	components: {
		DespatchCodeModal,
		BusinessTransfer,
		CancelModal,
		UpdateDirector,
		UpdateApprovalProcess,
		TipModal,
		RelationPlan,
		modalInfo,
		StartAddPaymentModel,
		ContractFinish
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER',
			VUEX_ST_USERAUTH: 'VUEX_ST_USERAUTH',
			VUEX_CURRENT_PLATEFORM: 'VUEX_CURRENT_PLATEFORM'
		}),
		currentCompanyUscc() {
			return this.VUEX_ST_COMPANYSUER.company.uscc;
		},
		stationAuth() {
			return this.type === 'SELL'
				? this.VUEX_ST_USERAUTH.includes('logisticsStorageCenter') &&
						this.VUEX_ST_USERAUTH.includes('logisticsStorageCenter:outManage') &&
						this.VUEX_ST_USERAUTH.includes('logisticsStorageCenter:outManage:outCoalPlan')
				: this.VUEX_ST_USERAUTH.includes('logisticsStorageCenter') &&
						this.VUEX_ST_USERAUTH.includes('logisticsStorageCenter:inManage') &&
						this.VUEX_ST_USERAUTH.includes('logisticsStorageCenter:inManage:inCoalPlan');
		}
	},
	mounted() {},
	methods: {
		...mapMutations({
			VUEX_setRelationContract: 'business/VUEX_setRelationContract'
		}),

		// 合同终止
		// contractTermination() {
		//   this.$router.push({
		//     path: '/center/contract/'+this.type.toLowerCase()+'/stop',
		//     query: {
		//       flag: 'edit',
		//       id : this.detail.id,
		//       type: this.type,
		//       serialNo: this.detail.serialNo
		//     },
		//   });
		// },
		// 合同终止盖章
		contractTerminationStamp() {
			this.$router.push({
				path: '/center/contract/' + this.type.toLowerCase() + '/termination/stamp',
				query: {
					flag: 'edit',
					id: this.detail.id,
					type: this.type,
					serialNo: this.detail.serialNo,
					terminalContractInitiatorUscc: this.detail.terminalContractInitiatorUscc
				}
			});
		},
		// 合同终止确认
		contractTerminationConfirm() {
			this.$router.push({
				path: '/center/contract/' + this.type.toLowerCase() + '/confirm/stop',
				query: {
					flag: 'edit',
					id: this.detail.id,
					type: this.type,
					serialNo: this.detail.serialNo,
					terminalContractInitiatorUscc: this.detail.terminalContractInitiatorUscc,
					initiatorUscc: this.detail.initiatorUscc
				}
			});
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
			} else {
				this.$router.push({
					path: '/center/contract/' + this.type.toLowerCase() + '/online/add/step1',
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
						id: this.detail.id,
						status: this.detail.status
					}
				});
			} else {
				this.$router.push({
					path: '/center/contract/' + this.type.toLowerCase() + '/online/detail',
					query: {
						id: this.detail.id,
						type: this.type,
						initiatorUscc: this.detail.initiatorUscc,
						status: this.detail.status,
						statusDesc: this.detail.statusDesc,
						terminalContractStatus: this.detail.terminalContractStatus,
						terminalContractInitiatorUscc: this.detail.terminalContractInitiatorUscc
					}
				});
			}
		},
		// 盖章
		goToStamp() {
			// 判断是否有权限
			let api = this.type === 'SELL' ? API_hasSeal : API_hasSubmitSeal;
			api({ orderId: this.detail.id }).then(res => {
				if (res.success) {
					this.$router.push({
						path: '/center/contract/' + this.type.toLowerCase() + '/stamp',
						query: {
							id: this.detail.id,
							serialNo: this.detail.serialNo,
							type: this.type,
							initiatorUscc: this.detail.initiatorUscc
						}
					});
				}
			});
		},
		// 确认待盖章状态 跳转到确认盖章
		orderConfirm() {
			this.$router.push({
				path: '/center/contract/' + this.type.toLowerCase() + '/confirm/stamp',
				query: {
					id: this.detail.id,
					serialNo: this.detail.serialNo,
					type: this.type,
					initiatorUscc: this.detail.initiatorUscc
				}
			});
		},
		/** 打开确认合同页面 待确认 */
		openConfirmContract() {
			this.$router.push({
				path: '/center/contract/' + this.type.toLowerCase() + '/confirm/contract',
				query: {
					id: this.detail.id,
					serialNo: this.detail.serialNo,
					type: this.type,
					initiatorUscc: this.detail.initiatorUscc
				}
			});
		},
		// 打开派车计划
		despatchCode() {
			this.$refs.despatchCodeModal.show(this.detail);
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
			this.$refs.cancelModal.show('作废合同');
		},
		cancelContractSubmit(data) {
			API_contract_cancel({
				orderId: this.cancelId,
				cancelReason: data
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
				path: `/center/settle/${this.type?.toLowerCase()}/list`,
				query: {
					contractNo: this.detail.contractNo
				}
			});
		},
		// 去结算
		async toSettle() {
			const orderId = this.detail.id;
			//选中合同校验合同是否可结算
			let res = await API_GETSETTLEAPPLYCHECK({
				orderId
			});
			if (res.success && !res.data) {
				this.$router.push({
					path: `/center/settle/${this.type?.toLowerCase()}/onlineadd`,
					query: {
						orderId
					}
				});
			} else {
				this.tip = '当前合同无有效的发运数据或者货转数据，无法进行结算，请先补充发运数据或货转数据';
				this.$refs.modalInfoOk.open();
			}
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
			this.$refs.startAddPaymentModel.addNewPayment({ serialNo: this.detail.serialNo, contractType: 'ONLINE' });
		},
		// 去上传发票
		toInvoice() {
			this.$router.push({
				path: this.type === 'SELL' ? '/center/invoice/sell/add?type=sell' : '/center/invoice/buy/add?type=buy',
				query: {
					orderNo: this.detail.serialNo
				}
			});
		},
		// 关联合同
		realteContract() {
			this.detail.orderSerialNo = this.detail.serialNo;
			this.VUEX_setRelationContract(this.detail);
			this.$router.push({
				path: '/center/businessline/addAssociation',
				query: {
					type: this.type.toLowerCase(),
					orderType: 'ONLINE',
					source: 'contract'
				}
			});
		},
		// 终止合同
		stopContract() {
			// 订单创建人或该创建人对应企业管理员，且订单下无非作废状态的发货记录可以终止订单
			let { id, serialNo, director, directorMobile, initiatorUscc, status } = this.detail;
			this.$router.push({
				path: '/center/contract/' + this.type.toLowerCase() + '/stop',
				query: {
					id,
					serialNo,
					contacts: director,
					contactsMobile: directorMobile,
					type: this.type,
					initiatorUscc,
					status
				}
			});
		},
		// 完结合同
		finishContract() {
			let that = this;
			
			that.$confirm({
				title: '确认完结该合同吗？',
				content: h => <div style="color:#aaa;">合同完结后，状态无法变更，请谨慎操作。</div>,
				onOk: async () => {
						this.$refs.contractFinish.open()
						this.contractFinishInfo = {validPass: true}
						this.isLoading = true;
						console.log( that.detail)
						// let res = {
						// 	data: {
						// 		validPass: false,
						// 		contractId: 1111,
						// 		// OFFLINE
						// 		contractType: 'ONLINE',
						// 		contractNo: '合同号',
						// 		// SELL
						// 		orderType: 'BUY', 
						// 		validList: [
						// 			{validType: 'CONTRACT', errorType: 'CONTRACT_SELL_NOT_DOUBLE_SIGN', params: {no: 11111}},
						// 			{validType: 'CONTRACT', errorType: 'CONTRACT_BUY_NOT_DOUBLE_SIGN', params: {no: 11111}},
						// 			{validType: 'CONTRACT', errorType: 'CONTRACT_NOT_EXEC_TING', params: {no: 11111}},

						// 			{validType: 'SUPPLEMENT', errorType: 'ONLINE_SUPPLEMENT_SELL_NOT_DOUBLE_SIGN', params: {no: 11111}},
						// 			{validType: 'SUPPLEMENT', errorType: 'ONLINE_SUPPLEMENT_BUY_NOT_DOUBLE_SIGN', params: {no: 11111}},
						// 			{validType: 'SUPPLEMENT', errorType: 'OFFLINE_SUPPLEMENT_NOT_AUDIT_ING', params: {no: 11111}},

						// 			{validType: 'DELIVER', errorType: 'DELIVER_NOT_FINISH', params: {no: 11111}},
						// 			{validType: 'DELIVER', errorType: 'DELIVER_NOT_GOODSTRANSFER', params: {no: 11111}},
						// 			{validType: 'LADING', errorType: 'LADING_NOT_FINISH', params: {no: 11111}},
						// 			{validType: 'RECEIPT', errorType: 'RECEIPT_NOT_FINISH', params: {no: 11111}},
						// 			{validType: 'GOODSTRANSFER', errorType: 'GOODSTRANSFER_NOT_FINISH', params: {no: 11111}},
						// 			{validType: 'PAYMENT', errorType: 'PAYMENT_NOT_FINISH', params: {no: 11111}},
						// 			{validType: 'STATEMENT', errorType: 'STATEMENT_NOT_FINISH', params: {no: 11111}},
						// 			{validType: 'INVOICE', errorType: 'INVOICE_NOT_ATTACH', params: {no: 11111}},
						// 			{validType: 'ASSET', errorType: 'ASSET_NOT_CONSISTENT', params: {no: 11111}},
						// 			{validType: 'AMOUNT', errorType: 'AMOUNT_NOT_CONSISTENT', params: {no: 11111}},
			

						// 		],

						// 	}
						// }
						// setTimeout(() => {
						// 	this.contractFinishInfo = res.data
						// 	this.isLoading = false;
						// }, 2000)
						try {
							const res  = await otherBusinessTypeContractFinish({ orderNo: that.detail.serialNo })
							console.log(res.data)
							
							this.isLoading = false;
							if(res.data.validPass) {
								this.$refs.contractFinish.close()
								that.$message.success('校验通过');
								that.searchSubmit();
				
							} else {
								this.contractFinishInfo = res.data
							}
							
						} catch (error) {
							this.isLoading = false;
							this.$refs.contractFinish.close()
						}



					// const res  = await otherBusinessTypeContractFinish({ orderNo: that.detail.id }).then(res => {
					// 	if (res.success && res.data) {
					// 		that.$message.success('合同完结成功');
					// 		that.searchSubmit();
					// 	}
					// });
				},
				onCancel() {},
				class: 'test'
			});
		},
		// 修改上下游负责人
		updateDirector() {
			this.detail.type = this.type;
			this.$refs.updateDirector.show(this.detail);
		},
		// 修改审批流
		upDateApprovalProcessFunc() {
			this.$refs.updateApprovalProcess.show(this.detail);
		},
		// 新增补协
		async addSupple() {
			const params = {
				contractNo: this.detail.contractNo
			};
			const res = await getSuppleLatest(params);
			if (res.data) {
				this.$refs.tipModal.open();
				this.contractInfo = res.data;
			} else {
				this.$router.push({
					path: '/center/contract/agreement/add',
					query: {
						type: this.type,
						contractId: this.detail.contractId,
						contractNo: this.detail.contractNo,
						orderSerialNo: this.detail.orderSerialNo,
						orderId: this.detail.id
					}
				});
			}
		},
		// 查看补协
		goSupple() {
			this.$refs.tipModal.close();
			this.$router.push({
				path: '/center/contract/agreement/list',
				query: {
					supplementalAgreementNo: this.contractInfo.supplementalAgreementNo
				}
			});
		},
		// 查看监控
		viewVideo() {
			const { stationId, stationCompanyUscc } = this.detail;
			subsystemOptionsEdit({
				stationId: stationId,
				companyCreditCode: stationCompanyUscc
			});
			window.open('/center/logisticsPlatform/monitorList', '_blank');
		},
		// 查看库存
		viewInventory() {
			const { stationId, stationCompanyUscc } = this.detail;
			subsystemOptionsEdit({
				stationId: stationId,
				companyCreditCode: stationCompanyUscc
			});
			window.open(`/center/logisticsPlatform/inventory?stationId=${stationId}&companyCreditCode=${stationCompanyUscc}`, '_blank');
		},
		// 关联上下煤计划
		relatedPlan() {
			this.detail.contractType = 'ONLINE';
			this.$refs.relationPlan.showModal(this.detail);
		},
		// 新增出入库
		goInOut() {
			if (this.VUEX_CURRENT_PLATEFORM?.allStationList?.length == 1) {
				window.open(
					`/center/logisticsPlatform/${this.type == 'BUY' ? 'in' : 'out'}/add?serialNo=${
						this.detail.serialNo
					}&orderTypeEnum=ONLINE`,
					'_blank'
				);
			} else {
				window.open(`/center/logisticsPlatform/coalplan/IN`, '_blank');
			}
		},
		// 下载所有附件
		downloadContractFile() {
			downloadContractRelatedAllAttachment({ orderId: this.detail.id }).then(res => {
				comDownload(res.data, undefined, res.name);
			});
		}
	}
};
</script>

<style lang="less" scoped>
.tip-modal {
	color: rgba(0, 0, 0, 0.5);
	margin-top: 20px;
	p:last-child {
		margin-top: 20px;
	}
}

</style>
