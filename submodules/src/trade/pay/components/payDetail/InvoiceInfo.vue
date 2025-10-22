<template>
	<div class="invoice-container">
		<div
			v-if="title"
			class="slTitleAssis"
		>
			{{ title }}
		</div>
		<a-tabs
			v-if="isTradeInvoiceShow && isTransInvoiceShow"
			:animated="false"
		>
			<a-tab-pane
				key="TRADEINVOICE"
				tab="贸易发票"
			>
				<InvoiceTradeTable
					:isUpLine="isUpLine"
					:dataSource="tradeInvoiceList"
					@openNewTabPage="openNewTabPage"
				/>
			</a-tab-pane>
			<a-tab-pane
				key="TRANSPORTINVOICE"
				tab="运费发票"
			>
				<InvoiceTransportTable
					:dataSource="transInvoiceList"
					@openNewTabPage="openNewTabPage"
				/>
			</a-tab-pane>
		</a-tabs>
		<InvoiceTradeTable
			v-else-if="isTradeInvoiceShow"
			:dataSource="tradeInvoiceList"
			:isUpLine="isUpLine"
			@openNewTabPage="openNewTabPage"
		/>
		<InvoiceTransportTable
			v-else-if="isTransInvoiceShow"
			:dataSource="transInvoiceList"
			@openNewTabPage="openNewTabPage"
		/>
		<TableStatisticalInfo
			v-if="statisticsList.length > 0"
			:statisticsList="statisticsList"
		/>
		<div
			v-else
			class="invoice-empty"
		></div>
	</div>
</template>

<script>
import InvoiceTradeTable from './InvoiceTradeTable';
import InvoiceTransportTable from './InvoiceTransportTable';
import TableStatisticalInfo from './TableStatisticalInfo.vue';

export default {
	name: 'InvoiceInfo',
	props: {
		title: {
			type: String,
			default: ''
		},
		invoiceVO: {
			type: Object,
			default: () => {}
		},
		// 是否是上游
		isUpLine: {
			type: Boolean,
			default: true
		}
	},
	components: {
		InvoiceTradeTable,
		InvoiceTransportTable,
		TableStatisticalInfo
	},
	data() {
		return {};
	},
	mounted() {},
	computed: {
		// 贸易发票列表
		tradeInvoiceList() {
			if (!this.invoiceVO) {
				return [];
			}
			return this.invoiceVO.tradeInvoiceList ?? [];
		},
		// 运费发票
		transInvoiceList() {
			if (!this.invoiceVO) {
				return [];
			}
			return this.invoiceVO.transInvoiceList ?? [];
		},
		isTradeInvoiceShow() {
			return this.tradeInvoiceList.length > 0;
		},
		isTransInvoiceShow() {
			return this.transInvoiceList.length > 0;
		},
		statisticsList() {
			if (this.tradeInvoiceList.length === 0 && this.transInvoiceList.length === 0) {
				// 无发票
				return [];
			}
			// 统计信息
			// 发票数量
			let totalCount = this.tradeInvoiceList.length + this.transInvoiceList.length;
			// 不含税金额合计
			let totalTaxExcludedAmount = 0;
			// 价税合计
			let totalAmount = 0;
			// 拆分至本合同金额
			let totalCurrentContractSplitedAmount = 0;
			this.tradeInvoiceList.forEach(item => {
				totalTaxExcludedAmount += Number(item.taxExcludedAmount || 0);
				totalAmount += Number(item.totalAmount || 0);
				totalCurrentContractSplitedAmount += Number(item.currentContractSplitedAmount || 0);
			});
			this.transInvoiceList.forEach(item => {
				totalTaxExcludedAmount += Number(item.taxExcludedAmount || 0);
				totalAmount += Number(item.totalAmount || 0);
				totalCurrentContractSplitedAmount += Number(item.currentContractSplitedAmount || 0);
			});
			return [
				{
					title: '发票数量',
					value: totalCount,
					unit: '张' // 单位
				},
				{
					title: '发票金额合计',
					value: totalTaxExcludedAmount,
					tip: '不含税', // 说明
					isMonetary: true // 是否是货币单位
				},
				{
					title: '价税合计',
					value: totalAmount,
					isMonetary: true // 是否是货币单位
				},
				{
					title: '拆分至本合同金额',
					value: totalCurrentContractSplitedAmount,
					tip: '含税', // 说明
					isMonetary: true // 是否是货币单位
				}
			];
		}
	},
	methods: {
		// 打开新标签页
		openNewTabPage(type, record) {
			this.$emit('openNewTabPage', type, record);
		}
	}
};
</script>

<style lang="less" scoped>
@import url('~@sub/style/table-cover.less');
</style>
<style lang="less" scoped>
.invoice-container {
	width: 100%;
	.slTitleAssis {
		margin-top: 4px;
	}
	.invoice-empty {
		height: 50px;
	}
}
</style>