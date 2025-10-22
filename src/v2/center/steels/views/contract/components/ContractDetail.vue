<template>
	<div
		class="order-detail-buy new-detail"
		:class="isOa ? 'oa-wrapper' : ''"
	>
		<a-row class="new-detail-content detail-form">
			<h2>合同详情</h2>
			<a-row class="normal">创建时间：{{ resultDetail.createDate }}</a-row>
			<a-row style="margin-top: 10px">
				<a-col
					class="normal"
					span="12"
					>买方：{{ resultDetail.buyCompanyName }}</a-col
				>
				<a-col
					class="normal"
					span="12"
					>卖方：{{ resultDetail.sellCompanyName }}</a-col
				>
			</a-row>
		</a-row>
		<div class="new-detail-content detail-form">
			<h2>合同进度</h2>
			<a-row>
				<a-steps
					progressDot
					:current="showSteps"
				>
					<a-step
						v-for="(items, index) in resultDetail.timeLines"
						:key="index"
						:title="items.nodeName"
					/>
				</a-steps>
			</a-row>
		</div>
		<!-- 草稿	合同信息、发票
    审批中DRAFT	合同信息、发票、电子合同、操作历史
    待确认TO_BE_CONFIRMED	合同信息、发票、电子合同、操作历史
    待签约TO_BE_SIGN_UP	合同信息、发票、电子合同、操作历史
    执行中IN_EXECUTION	合同信息、发票、电子合同、操作历史、收发货、付款记录、附件信息
    已完成FINISHED	合同信息、发票、电子合同、操作历史、收发货、付款记录、附件信息
    驳回REJECTED	合同信息、电子合同 -->
		<a-row style="margin-top: 30px">
			<a-tabs defaultActiveKey="1">
				<a-tab-pane
					tab="合同信息"
					key="1"
				>
					<BuyDetail
						:info="resultDetail"
						v-if="type == 'buy'"
					></BuyDetail>
					<SellDetail
						:info="resultDetail"
						v-if="type == 'sell'"
					></SellDetail>
				</a-tab-pane>
				<template v-if="!isOa">
					<a-tab-pane
						tab="电子合同"
						key="2"
						forceRender
						v-if="resultDetail.status !== 'DRAFT'"
					>
						<ElectronicContract :info="resultDetail"></ElectronicContract>
					</a-tab-pane>
					<!-- 成品钢 002 销售合同001模板 模板 不展示收发货记录 -->
					<a-tab-pane
						tab="收发货信息"
						key="3"
						v-if="['IN_EXECUTION', 'FREEZING', 'FINISHED'].includes(resultDetail.status) && handleType != 3"
					>
						<ReceiveAndDeliver :info="resultDetail"></ReceiveAndDeliver>
					</a-tab-pane>
					<a-tab-pane
						tab="付款记录"
						key="4"
						v-if="['IN_EXECUTION', 'FREEZING'].includes(resultDetail.status)"
					>
						<PaymentRecord
							:info="resultDetail"
							:type="type"
						></PaymentRecord>
					</a-tab-pane>
					<a-tab-pane
						tab="操作历史"
						key="5"
						v-if="resultDetail.status !== 'DRAFT'"
					>
						<Log :logList="resultDetail.contractOperationList"></Log>
					</a-tab-pane>
					<a-tab-pane
						tab="附件信息"
						key="6"
						forceRender
						v-if="['IN_EXECUTION', 'FREEZING', 'FINISHED'].includes(resultDetail.status)"
					>
						<AttachmentRecord :info="resultDetail"></AttachmentRecord>
					</a-tab-pane>
					<a-tab-pane
						tab="发票"
						forceRender
						key="7"
						v-if="resultDetail.status !== 'REJECTED'"
					>
						<InvoiceInfo :info="resultDetail"></InvoiceInfo>
					</a-tab-pane>
					<!-- v-if="resultDetail.contractTemplate == 'FINISHED_STEEL_SELL_005'" -->
					<a-tab-pane
						tab="追保信息"
						forceRender
						key="8"
						v-if="resultDetail.contractTemplate == 'FINISHED_STEEL_SELL_005'"
					>
						<MarginMarket
							:ENV="ENV"
							type="rest"
							:bondLetterList="resultDetail.bondLetterList"
							:info="resultDetail.bondLetterSettings"
						></MarginMarket>
					</a-tab-pane>
				</template>
			</a-tabs>
		</a-row>
	</div>
</template>

<script>
import BuyDetail from '@sub/components/steels/BuyDetail.vue';
import SellDetail from '@sub/components/steels/SellDetail.vue';
import ElectronicContract from '../components/ElectronicContract.vue';
import ReceiveAndDeliver from '../components/ReceiveAndDeliver.vue';
import PaymentRecord from '@sub/components/steels/PaymentRecord.vue';
import AttachmentRecord from '../components/AttachmentRecord.vue';
import InvoiceInfo from '@sub/components/steels/InvoiceInfo.vue';
import MarginMarket from '@sub/components/steels/MarginMarket.vue';
import Log from '@/v2/center/steels/components/Log.vue';
import ENV from '@/v2/config/env';
import { getBondLetterForCollection } from '@/v2/center/steels/api/funds.js';
export default {
	props: {
		resultDetail: {
			default: () => {}
		},
		isOa: {
			default: false
		},
		type: {
			default: 'buy'
		}
	},
	data() {
		return {
			ENV,
			bondLetterList: []
		};
	},
	mounted() {},
	components: {
		Log,
		BuyDetail,
		SellDetail,
		ElectronicContract,
		ReceiveAndDeliver,
		PaymentRecord,
		AttachmentRecord,
		InvoiceInfo,
		MarginMarket
	},
	computed: {
		showSteps() {
			if (this.resultDetail && this.resultDetail.timeLines && this.resultDetail.timeLines.length) {
				let index = 0;
				this.resultDetail.timeLines.map((el, idx) => {
					if (el.checked) index = idx;
				});
				return index;
			}
			return 0;
		},
		// 判断废钢 采购合同001 其他 三类
		handleType() {
			// 废钢
			if (this.resultDetail.contractTemplate == 'SCRAP_STEEL_001') {
				return 1;
			}
			// 应收蓉欧
			if (this.resultDetail.contractTemplate == 'STEEL_PROFILE') {
				return 2;
			}
			return 3;
		}
	},
	mounted() {
		// this.getBondLetterForCollection()
	},
	methods: {
		async getBondLetterForCollection() {
			const params = {
				contractId: this.$route.query.contractId
			};
			const res = await getBondLetterForCollection(params);

			this.bondLetterList = res.data;
		}
	}
};
</script>
<style lang="less" scoped>
.oa-wrapper {
	padding: 20px;
}
</style>
