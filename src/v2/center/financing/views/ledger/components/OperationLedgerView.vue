<template>
	<div class="operation-ledger-view">
		<BoxTab
			:tabList="tabList"
			@onTabChange="handleTabChange"
		/>
		<CustomerBusinessDataList
			v-show="activeKey === 'CustomerBusinessData'"
			:date="date"
			ref="customerBusinessDataList"
		/>
		<DebtorQuotaDataList
			v-show="activeKey === 'DebtorQuotaData'"
			:date="date"
			ref="debtorQuotaDataList"
		/>
	</div>
</template>

<script>
import BoxTab from './BoxTab.vue';
import CustomerBusinessDataList from './CustomerBusinessDataList.vue';
import DebtorQuotaDataList from './DebtorQuotaDataList.vue';

export default {
	name: 'OperationLedgerView',
	components: {
		BoxTab,
		CustomerBusinessDataList,
		DebtorQuotaDataList
	},
	props: {
		date: {
			type: String,
			required: true
		}
	},
	data() {
		return {
			tabList: [
				{ key: 'CustomerBusinessData', label: '保理客户业务数据' },
				{ key: 'DebtorQuotaData', label: '保理债务人额度数据' }
			],
			activeKey: 'CustomerBusinessData'
		};
	},
	methods: {
		handleTabChange(key) {
			this.activeKey = key;
			switch (key) {
				case 'CustomerBusinessData':
					this.$refs.customerBusinessDataList.getList();
					break;
				case 'DebtorQuotaData':
					this.$refs.debtorQuotaDataList.getList();
					break;
				default:
					break;
			}
		},
		refreshData() {
			this.handleTabChange(this.activeKey);
		},
		getActiveTabType() {
			return this.activeKey;
		}
	}
};
</script>

<style lang="less" scoped>
.operation-ledger-view {
	padding: 20px 0;
	width: 100%;
	height: 100%;
}
</style>