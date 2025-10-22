<template>
	<div class="slMain mt-10">
		<a-card :bordered="false">
			<div class="methods-wrap">
				<span class="slTitle">认领明细</span>
			</div>
			<!-- 线上业务回款-->
			<div v-if="$route.query.financing == 'yes'">
				<div class="slTitleAssis">业务线信息</div>
				<a-row v-if="claimData.businessInfoVO">
					<a-col
						:span="12"
						class="row"
					>
						<a-form-model-item
							label="业务线号"
							:colon="false"
							:label-col="labelCol"
							:wrapper-col="wrapperCol"
						>
							<p>{{ claimData.businessInfoVO.businessLineNo }}</p>
						</a-form-model-item>
					</a-col>
					<a-col
						:span="12"
						class="row"
					>
						<a-form-model-item
							label="上游企业名称"
							:colon="false"
							:label-col="labelCol"
							:wrapper-col="wrapperCol"
						>
							<p style="width: 100%; overflow: hidden">
								{{ claimData.businessInfoVO.upstreamSellerCompany }}
							</p>
						</a-form-model-item>
					</a-col>
					<a-col
						:span="12"
						class="row"
					>
						<a-form-model-item
							label="上游合同编号"
							:colon="false"
							:label-col="labelCol"
							:wrapper-col="wrapperCol"
						>
							<p>{{ claimData.businessInfoVO.upstreamContractNo }}</p>
						</a-form-model-item>
					</a-col>
					<a-col
						:span="12"
						class="row"
					>
						<a-form-model-item
							label="下游合同编号"
							:colon="false"
							:label-col="labelCol"
							:wrapper-col="wrapperCol"
						>
							<p>{{ claimData.businessInfoVO.downstreamContractNo }}</p>
						</a-form-model-item>
					</a-col>
					<a-col
						:span="12"
						class="row"
					>
						<a-form-model-item
							label="回款金额(元)"
							:colon="false"
							:label-col="labelCol"
							:wrapper-col="wrapperCol"
						>
							<p>
								{{ claimData.businessInfoVO.repayTotalAmount | formatMoney(2) }}
							</p>
						</a-form-model-item>
					</a-col>
					<a-col
						:span="12"
						class="row"
					>
						<a-form-model-item
							label="订单状态"
							:colon="false"
							:label-col="labelCol"
							:wrapper-col="wrapperCol"
						>
							<p>{{ claimData.businessInfoVO.orderStatusName }}</p>
						</a-form-model-item>
					</a-col>
				</a-row>
			</div>
			<!-- 线上业务回款、非线上业务回款-->
			<div>
				<div
					class="slTitleAssis"
					style="margin-top: 20px"
				>
					认领历史
				</div>
				<a-table
					:pagination="false"
					:columns="claimRecordsColumns"
					:data-source="claimData.paymentList"
					:rowKey="
						(record, index) => {
							return String(index);
						}
					"
					:scroll="{ x: true }"
					style="width: 100%; padding: 10px 0 20px"
				>
					<span
						slot="receiveAmount"
						slot-scope="receiveAmount"
						>{{ receiveAmount | formatMoney(2) }}</span
					>
				</a-table>
			</div>
			<a-form-model-item
				:wrapper-col="{ span: 14, offset: 4 }"
				class="btn-wrap"
			>
				<a-button
					style="margin-left: 10px"
					@click="$router.go(-1)"
					>返回</a-button
				>
			</a-form-model-item>
		</a-card>
	</div>
</template>

<script>
import {
	API_GetClaimFinanceDetail,
	API_GetClaimUnFinanceDetail,
	API_GetOtherClaimFinanceDetail,
	API_GetOtherClaimUnFinanceDetail
} from 'api';
const claimRecordsColumns = [
	// 认领历史
	{
		title: '序号',
		dataIndex: '',
		key: 'rowIndex',
		customRender: function (t, r, index) {
			return parseInt(index) + 1;
		}
	},
	{ title: '资金流水号', dataIndex: 'receiveSerialNo', key: 'receiveSerialNo' },
	{ title: '回款方式', dataIndex: 'receiveCategory', key: 'receiveCategory' },
	{ title: '回款日期', dataIndex: 'receiveDate', key: 'receiveDate' },
	{
		title: '回款金额',
		dataIndex: 'receiveAmount',
		key: 'receiveAmount',
		scopedSlots: {
			customRender: 'receiveAmount'
		}
	},
	{
		title: '来源',
		dataIndex: 'dataSourceStr',
		key: 'dataSourceStr'
	}
];
import moment from 'moment';
export default {
	name: 'ClaimDetail',
	data() {
		return {
			claimData: '',
			claimRecordsColumns, // 认领历史
			labelCol: { span: 5 },
			wrapperCol: { span: 15, offset: 1 },
			form: {
				receiveSerialNo: '',
				receiveDate: undefined,
				receiveCategory: undefined,
				receiveAmount: '',
				amounts: 0
			}
		};
	},
	created() {
		this.init();
	},
	methods: {
		moment,
		init() {
			//初始化获取数据
			if (this.$route.query.financing == 'yes') {
				let API = this.$route.query.terminalModel == '2' ? API_GetOtherClaimFinanceDetail : API_GetClaimFinanceDetail;
				API({ businessLineNo: this.$route.query.businessLineNo }).then(res => {
					if (res.success) {
						this.claimData = res.data;
					}
				});
			} else {
				let API = this.$route.query.terminalModel == '2' ? API_GetOtherClaimUnFinanceDetail : API_GetClaimUnFinanceDetail;
				API({ terminalContractId: this.$route.query.terminalContractId }).then(res => {
					if (res.success) {
						this.claimData = res.data;
					}
				});
			}
		}
	}
};
</script>

<style lang="less" scoped>
.ant-form-item {
	margin-bottom: 10px;
}
.title {
	margin: 0 40px;
	line-height: 32px;
	padding-bottom: 10px;
	color: #0053db;
	font-size: 16px;
}
.upload-wrap {
	padding: 10px 40px;
}
.claimAmounts {
	padding: 20px 40px;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	span {
		display: inline-block;
		margin-left: 5px;
		color: red;
	}
}
</style>
