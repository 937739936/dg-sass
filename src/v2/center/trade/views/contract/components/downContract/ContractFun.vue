<template>
	<div>
		<UpdatePrincipal
			ref="updatePrincipal"
			@updateFunc="searchSubmit"
		></UpdatePrincipal>
		<UpdateApprovalProcess
			ref="updateApprovalProcess"
			@updateFunc="searchSubmit"
		></UpdateApprovalProcess>
		<DelModal
			ref="delModal"
			tip="确认要删除该数据吗，删除后无法恢复"
			@save="saveDel"
		></DelModal>
		<StartAddPaymentModel ref="startAddPaymentModel" />
	</div>
</template>

<script>
import { GetCurrentDate } from '@/v2/utils/factory.js';
import comDownload from '@sub/utils/comDownload.js';
import { mapGetters, mapMutations } from 'vuex';
import { downloadDownContract, delBuyDownContract, delSellDownContract } from '@/v2/center/trade/api/downcontract';

import UpdatePrincipal from './UpdatePrincipal.vue';

import UpdateApprovalProcess from './UpdateApprovalProcess.vue';
import DelModal from './DelModal.vue';
import StartAddPaymentModel from '@/v2/center/trade/views/pay/payManage/models/StartAddPaymentModel';

export default {
	data() {
		return {
			currentItem: {}
		};
	},
	props: {
		type: {
			default: 'BUY'
		}
	},
	computed: {
		...mapGetters('user', {
			VUEX_CURRENT_PLATEFORM: 'VUEX_CURRENT_PLATEFORM'
		})
	},
	methods: {
		...mapMutations({
			VUEX_setRelationContract: 'business/VUEX_setRelationContract'
		}),
		goDetail(items) {
			const type = this.type.toLowerCase();
			this.$router.push({
				path: `/center/contract/${type}/offline/detail`,
				query: {
					id: items.id,
					type
				}
			});
		},
		// 新增出入库
		goInOut(items) {
			if (this.VUEX_CURRENT_PLATEFORM?.allStationList?.length == 1) {
				window.open(
					`/center/logisticsPlatform/${this.type.toLowerCase() == 'buy' ? 'in' : 'out'}/add?serialNo=${
						items.contractNo
					}&orderTypeEnum=OFFLINE`,
					'_blank'
				);
			} else {
				window.open(`/center/logisticsPlatform/coalplan/IN`, '_blank');
			}
		},
		// 下载附件
		downloadContractFile(items) {
			downloadDownContract({ id: items.id }).then(res => {
				comDownload(res.data, undefined, res.name);
			});
			// 下载所有附件
		},
		edit(items) {
			let type = this.type.toLowerCase();
			let { whetherEditAllBoo, whetherHaveRelAuditBoo } = items;
			if (this.$route.query.type) {
				type = this.$route.query.type;
			}
			this.$router.push({
				path: '/center/contract/' + type + '/offline/add',
				query: {
					id: items.id,
					type,
					whetherEditAllBoo: type === 'sell' ? whetherEditAllBoo : undefined,
					whetherHaveRelAuditBoo: type === 'sell' ? whetherHaveRelAuditBoo : undefined
				}
			});
		},
		toPay(items) {
			this.$refs.startAddPaymentModel.addNewPayment({ serialNo: items.contractNo, contractType: 'OFFLINE' });
		},
		// 登记回款
		toReturned(items) {
			//  collectionNo: this.$route.query.collectionNo, //是否又传入收款编号
			// downOrderId: this.$route.query.downOrderId, //是否又传入下游合同编号
			// downCompany: this.$route.query.downCompany, //是否又传入下游合同编号
			this.$router.push({
				path: '/center/collection/stream/add',
				query: {
					downOrderId: items.id,
					downCompany: items.buyerName
				}
			});
		},
		// 补录结算单
		toSettle(items) {
			const type = this.type.toLowerCase();
			this.$router.push({
				path: `/center/settle/${type}/offlineadd`,
				query: {
					contractNo: items.contractNo
				}
			});
		},
		// 去上传发票
		toInvoice() {
			this.$router.push({
				path: this.type === 'SELL' ? '/center/invoice/sell/add?type=sell' : '/center/invoice/buy/add?type=buy'
			});
		},
		// 修改业务负责人
		updatePrincipal(item) {
			this.$refs.updatePrincipal.show(item, this.type);
		},
		// 修改审批流
		updateApprovalProcess(item) {
			this.$refs.updateApprovalProcess.show(item);
		},
		searchSubmit() {
			this.$emit('searchSubmit');
		},
		//关联合同
		relationContract(items) {
			this.VUEX_setRelationContract(items);
			this.$router.push({
				path: '/center/businessline/addAssociation',
				query: {
					type: this.type.toLowerCase(),
					orderType: this.type === 'SELL' ? 'DOWN' : 'UP',
					source: 'contract'
				}
			});
		},
		del(items) {
			this.currentItem = items;
			this.$refs.delModal.open();
		},
		async saveDel() {
			const fn = this.type == 'BUY' ? delBuyDownContract : delSellDownContract;
			const params = {
				id: this.currentItem.id
			};
			await fn(params);
			this.$message.success('删除成功');
			this.$refs.delModal.close();
			this.searchSubmit();
		}
	},
	components: {
		UpdatePrincipal,
		UpdateApprovalProcess,
		DelModal,
		StartAddPaymentModel
	}
};
</script>

<style scoped lang="less"></style>
