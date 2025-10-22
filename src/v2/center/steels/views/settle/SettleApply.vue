<template>
	<div>
		<div
			class="s-title"
			v-if="isAdditional"
		>
			<span>新增补录结算单</span>
		</div>
		<div class="steps-wrap">
			<a-steps :current="currentStep">
				<a-step
					v-for="item in steps"
					:key="item.title"
					:title="item.title"
				/>
			</a-steps>
		</div>
		<div
			class="settle-apply-form"
			v-if="handleType == 1"
		>
			<ScrapSteel ref="scrapSteel"></ScrapSteel>
		</div>
		<div v-if="handleType == 2">
			<YuShen
				ref="yuShen"
				:isAdditional="isAdditional"
			></YuShen>
		</div>
		<div
			class="settle-apply-form"
			v-if="handleType == 3"
		>
			<LadingBill
				:contract="contract"
				:info="info"
			></LadingBill>
		</div>
		<div v-if="handleType == 4">
			<OtherMiddle
				v-if="contract.appointSpec == 1"
				:info="info"
			/>
			<OtherMiddleAppointSpec0
				v-else
				:info="info"
			/>
		</div>
	</div>
</template>

<script>
import PreviewModal from './components/PreviewModal.vue';
import { API_SteelsStatementNextStep, API_SteelsStatementDetail } from '@/v2/center/steels/api/settle.js';
import { mapGetters } from 'vuex';
import LadingBill from './components/LadingBill.vue';
import ScrapSteel from './components/ScrapSteel.vue';
import YuShen from './components/YuShen.vue';
import OtherMiddle from './components/OtherMiddle.vue';
import OtherMiddleAppointSpec0 from './components/OtherMiddleAppointSpec0.vue';
export default {
	name: 'SettleApply',
	components: {
		LadingBill,
		PreviewModal,
		YuShen,
		ScrapSteel,
		OtherMiddle,
		OtherMiddleAppointSpec0
	},
	data() {
		return {
			qualityData: [], // 品质奖罚数据
			currentStep: 1,
			steps: [
				{
					title: '选择合同'
				},
				{
					title: '填写结算信息'
				},
				{
					title: '完成'
				}
			],
			// 所以信息
			info: {},
			contract: {},
			numberReg: /^(\d+)(\.\d{1,3})?$/
		};
	},
	mounted() {
		if (this.$route.query.statementId) {
			this.getEditDetail();
		} else {
			this.getDetail();
		}
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		handleType() {
			if (this.$route.query.contractType == 'BUY') {
				// 采购-应收（废钢）--依据货转开具结算单--线上结算单 返回1
				if (['ACCOUNT_RECEIVABLE'].includes(this.$route.query.businessType) && this.$route.query.steelType === 'SCRAP_STEEL') {
					return 1;
				}
				// 采购-业务类型为应收（非废钢）、代采+仓押、仓押、联营（“是否入库”选择为入库）时，依据货转开具结算单--补录结算单 返回2
				if (
					(['ACCOUNT_RECEIVABLE'].includes(this.$route.query.businessType) && this.$route.query.steelType !== 'SCRAP_STEEL') ||
					['WAREHOUSE_RECEIPTS_PLEDGE', 'SOURCING_AGENT_WAREHOUSE_PLEDGE'].includes(this.$route.query.businessType) ||
					(['AFFILIATED_BUSINESS'].includes(this.$route.query.businessType) && this.contract.deliveryMode == 'WAREHOUSING')
				) {
					return 2;
				}
				// 采购-应收（榆神）--依据货转开具结算单，和依据代采+仓押业务开具结算单页面类似，无结算金额字段--电子结算单
				if (['ACCOUNT_RECEIVABLE_OTHER'].includes(this.$route.query.businessType)) {
					return 2;
				}
				// 采购-业务类型为其他（中间）--依据放货通知单开具结算单--电子结算单
				if (['OTHER_MIDDLE'].includes(this.$route.query.businessType)) {
					return 4;
				}
			}
			// 基于销售合同
			if (this.$route.query.contractType == 'SELL') {
				//销售-线上合同&业务类型为其他（中间），依据放货通知单开具结算单
				if (
					['OTHER_MIDDLE'].includes(this.$route.query.businessType) &&
					['SYSTEM_COLLECTION'].includes(this.$route.query.generateWay)
				) {
					return 4;
				}
				// 线上合同&业务类型为"代采+仓押、仓押、代采"时，依据提单开具结算单--电子结算单
				// 线上合同&业务类型为购销时，需要穿透业务线，找到其业务线对应的提单开具结算单。提单信息栏目展示字段、交互方
				if (
					['WAREHOUSE_RECEIPTS_PLEDGE', 'SOURCING_AGENT_WAREHOUSE_PLEDGE', 'SOURCING_AGENT', 'PURCHASE_AND_SALE'].includes(
						this.$route.query.businessType
					) &&
					['SYSTEM_COLLECTION'].includes(this.$route.query.generateWay)
				) {
					return 3;
				}
			}
			return 2;
		},
		/** 判断是采购合同 且是  选择的采购合同  代采+仓押、仓押、联营（入库）*/
		isAdditional() {
			if (this.$route.query.contractType == 'BUY') {
				// 采购-业务类型为应收（非废钢）、代采+仓押、仓押、联营（“是否入库”选择为入库）时，依据货转开具结算单--补录结算单 返回2
				if (
					(['ACCOUNT_RECEIVABLE'].includes(this.$route.query.businessType) && this.$route.query.steelType !== 'SCRAP_STEEL') ||
					['WAREHOUSE_RECEIPTS_PLEDGE', 'SOURCING_AGENT_WAREHOUSE_PLEDGE'].includes(this.$route.query.businessType) ||
					(['AFFILIATED_BUSINESS'].includes(this.$route.query.businessType) && this.contract.deliveryMode == 'WAREHOUSING')
				) {
					return true;
				}
			}
			return false;
		}
	},
	methods: {
		// 首次开具回显详情
		async getDetail() {
			const res = await API_SteelsStatementNextStep({
				id: this.$route.query.contractId,
				contractType: this.$route.query.contractType,
				takeDeliverSerialNos: ''
			});
			this.contract = res.data.contract;
			this.info = res.data;
		},
		async getEditDetail() {
			const res = await API_SteelsStatementDetail({ id: this.$route.query.statementId });
			this.info = res.data;
			this.contract = res.data.contract;
		}
	}
};
</script>

<style lang="less">
.settle-apply-form {
	padding-bottom: 60px;

	.table-wrap {
		margin-bottom: 30px;

		table {
			white-space: nowrap;
		}

		.ant-table-body {
			overflow: auto;
		}
	}

	.title {
		border-bottom: 1px solid #d8d8d8;
		font-size: 18px;
		padding: 14px 0;
		margin-bottom: 30px;

		.title_icon {
			width: 12px;
			height: 16px;
			display: inline-block;
			vertical-align: middle;
			margin: 0 14px;
			background: url(~assets/imgs/menu/titleIcon.png) no-repeat right center;
		}
	}

	.ant-form-item-control {
		input {
			width: 220px;
		}

		.ant-select {
			width: 200px;
		}
	}

	.range-input {
		input {
			width: 98px;
		}

		.range-text {
			display: inline-block;
			padding: 0 5px;
		}
	}

	.pay-account-wrap {
		.ant-select {
			width: 400px;
		}
	}

	.row {
		min-height: 60px;
		padding-left: 40px;
		margin: 0 !important;
	}

	.ant-form-item-label {
		label {
			font-size: 16px;
			color: rgba(0, 0, 0, 0.75);
			width: 140px;
			white-space: normal;
			line-height: 22px;
			margin-right: 26px;
			display: inline-block;
			text-align: left;
		}
	}

	.textarea-wrap {
		textarea {
			width: 684px;
			text-align: left !important;
		}
	}

	.btn-wrap {
		margin-top: 30px;
		padding-left: 40px;

		.ant-btn {
			width: 96px;
			height: 34px;
			margin-right: 30px;
		}
	}

	.ant-form-inline .ant-form-item-with-help {
		margin: 0;
	}

	.m0 {
		margin: 0;
	}

	.has-error .ant-form-explain,
	.has-error .ant-form-split {
		white-space: nowrap;
		position: absolute;
	}

	.white-space .ant-form-item-label label {
		white-space: pre-wrap;
		line-height: 18px;
	}
}
</style>
