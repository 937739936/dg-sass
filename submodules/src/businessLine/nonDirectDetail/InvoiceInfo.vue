<template>
	<div class="invoice-info">
		<a-tabs
			:animated="false"
			@change="changeTab"
		>
			<a-tab-pane
				key="FREIGHT_INVOICE"
				:tab="freightTab"
			>
			</a-tab-pane>
			<a-tab-pane
				key="TRADE_INVOICE"
				:tab="tradeTab"
			>
			</a-tab-pane>
		</a-tabs>
		<div class="search-box">
			<div
				class="search-box-item"
				:class="{ active: isHasAttachment === item.value }"
				@click="changeSearch(item.value)"
				v-for="item in searchList"
				:key="item.value"
			>
				{{ item.label }}
			</div>
		</div>
		<FreightInvoiceTable
			v-if="invoiceType === 'FREIGHT_INVOICE'"
			:dataSource="freightInvoiceList"
			@handlePreview="handlePreview"
		/>
		<TradeInvoiceTable
			v-if="invoiceType === 'TRADE_INVOICE'"
			:dataSource="tradeInvoiceList"
			@handlePreview="handlePreview"
		/>
	</div>
</template>

<script>
import FreightInvoiceTable from './FreightInvoiceTable';
import TradeInvoiceTable from './TradeInvoiceTable';
export default {
	name: 'InvoiceInfo',
	components: {
		FreightInvoiceTable,
		TradeInvoiceTable
	},
	props: {
		// 贸易发票列表
		tradeInvoiceList: {
			type: Array,
			default: () => []
		},
		// 运费发票列表
		freightInvoiceList: {
			type: Array,
			default: () => []
		}
	},
	data() {
		return {
			invoiceType: 'FREIGHT_INVOICE',
			isHasAttachment: 'All',
			pagination: {
				pageNo: 1,
				pageSize: 100
			}
		};
	},
	computed: {
		freightTab() {
			let tab = '运费发票';
			if (this.freightInvoiceList.length > 0) {
				tab = '运费发票(' + this.freightInvoiceList.length + ')';
			}
			return tab;
		},
		tradeTab() {
			let tab = '贸易发票';
			if (this.tradeInvoiceList.length > 0) {
				tab = '贸易发票(' + this.tradeInvoiceList.length + ')';
			}
			return tab;
		},
		searchList() {
			return [
				{ value: 'All', label: '全部' },
				{ value: '1', label: '有附件' },
				{ value: '2', label: '无附件' }
			];
		},
		searchParams() {
			let hasAttach = true;
			let noAttach = true;
			if (this.isHasAttachment == 'All') {
				hasAttach = true;
				noAttach = true;
			}
			if (this.isHasAttachment == '1') {
				hasAttach = true;
				noAttach = false;
			}
			if (this.isHasAttachment == '2') {
				hasAttach = false;
				noAttach = true;
			}
			const params = {
				hasAttach: hasAttach,
				noAttach: noAttach,
				pageNo: this.pagination.pageNo,
				pageSize: this.pagination.pageSize
			};
			return params;
		}
	},
	methods: {
		changeTab(key) {
			this.invoiceType = key;
			this.changeSearch('All');
		},
		changeSearch(value) {
			this.isHasAttachment = value;
			this.pagination.pageNo = 1;
			this.onInvoiceSearchParamsChange();
		},
		onInvoiceSearchParamsChange() {
			this.$emit('onInvoiceSearchParamsChange', this.searchParams);
		},
		handlePreview(url) {
      this.$emit('handlePreview', url)
    }
	}
};
</script>

<style lang="less" scoped>
.invoice-info {
	margin-top: -14px;
.search-box {
	margin: 20px 0;
	display: flex;
	border-radius: 4px;
	border: 1px solid var(---Line, #e5e6eb);
	padding: 3px 8px;
	width: 320px;
	box-sizing: border-box;
	justify-content: space-around;

	&-item {
		display: flex;
		padding: 1.5px 8px;
		justify-content: space-around;
		align-items: center;
		color: rgba(0, 0, 0, 0.8);
		font-feature-settings: 'clig' off, 'liga' off;
		font-family: PingFang SC;
		font-size: 14px;
		border-radius: 2px;
		width: 96px;
		box-sizing: border-box;
		cursor: pointer;
		&.active {
			background: @primary-color;
			color: #fff;
		}
	}
}
}
</style>