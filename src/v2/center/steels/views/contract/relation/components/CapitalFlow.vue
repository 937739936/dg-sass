<template>
	<div>
		<p class="tab-title">资金流水</p>
		<p
			class="mb8"
			v-if="paymentTypeList && paymentTypeList.length > 0"
		>
			<span
				class="mr16"
				:key="index"
				v-for="(item, index) in paymentTypeList"
			>
				{{ item.capitalSource }}：{{ item.payAmount }}元
			</span>
		</p>
		<a-table
			:pagination="false"
			:columns="capitalFlowColumns"
			:data-source="paymentList"
			:scroll="{ x: true }"
			rowKey="id"
		>
			<template
				slot="action"
				slot-scope="record"
			>
				<a @click="jumpPage(record)">查看</a>
			</template>
		</a-table>
	</div>
</template>
<script>
const capitalFlowColumns = [
	{ title: '资金流水号', dataIndex: 'serialNo' },
	{ title: '付款日期', dataIndex: 'paymentDate' },
	{ title: '付款类型', dataIndex: 'typeDesc' },
	{ title: '资金来源', dataIndex: 'capitalSource' },
	{ title: '付款金额(元)', dataIndex: 'payAmount' },
	{ title: '付款状态', dataIndex: 'statusDesc' },
	{ title: '操作', scopedSlots: { customRender: 'action' }, width: 135, fixed: 'right' }
];
export default {
	name: 'CapitalFlow',
	props: ['contractData'],
	watch: {
		contractData: function (data) {
			this.paymentTypeList = data.paymentInfo.paymentTypeList;
			this.paymentList = data.paymentInfo.paymentList;
		}
	},
	data() {
		return {
			capitalFlowColumns,
			paymentTypeList: [],
			paymentList: []
		};
	},
	created() {
		this.paymentTypeList = this.contractData.paymentInfo ? this.contractData.paymentInfo.paymentTypeList : [];
		this.paymentList = this.contractData.paymentInfo ? this.contractData.paymentInfo.paymentList : [];
	},
	methods: {
		jumpPage(record) {
			const { href } = this.$router.resolve({
				path: '/center/steels/funds/payment/paymentApplyTwoStep',
				query: {
					id: record.id,
					type: 'view',
					contractTemplate: this.contractData.contractTemplate,
					contractNo: this.contractData.contractNo,
					contractId: this.contractData.contractId,
					companyName:
						this.contractData.contractType == 'BUY' ? this.contractData.sellCompanyName : this.contractData.buyCompanyName,
					companyId: this.contractData.contractType == 'BUY' ? this.contractData.sellCompanyId : this.contractData.buyCompanyId,
					companyUscc:
						this.contractData.contractType == 'BUY' ? this.contractData.sellCompanyUscc : this.contractData.buyCompanyUscc,
					generateWay: this.contractData.generateWay,
					steelType: this.contractData.steelType,
					contractType: this.contractData.contractType,
					businessType: this.contractData.businessType
				}
			});
			window.open(href);
		}
	}
};
</script>
<style scoped>
.tab-title {
	font-size: 16px;
	font-weight: bold;
	border-bottom: 1px solid #efefef;
	margin-bottom: 20px;
	padding-bottom: 6px;
}
</style>
