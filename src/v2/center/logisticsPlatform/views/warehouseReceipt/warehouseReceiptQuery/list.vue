<template>
	<div>
		<WarehouseReceiptList
			:type="type"
			:houseApi="getHouseListNew"
			:listApi="API_getWarehouseReceiptList"
			:statisticsApi="API_getWarehouseReceiptStatistics"
			:exportApi="API_exportWarehouseList"
			:getQuantityTipApi="API_getWarehouseReceiptQuantityTip"
			:statusTipApi="API_warehouseReceiptStatusTip"
			@goLading="goLading"
			@goDetail="goDetail"
		/>
	</div>
</template>

<script>
import WarehouseReceiptList from '@sub/logisticsPlatform/warehouseReceipt/warehouseReceiptQuery/List.vue';
import {
	API_getWarehouseReceiptList,
	API_getWarehouseReceiptStatistics,
	API_exportWarehouseList,
	API_getWarehouseReceiptQuantityTip,
	API_warehouseReceiptStatusTip
} from '@/v2/center/logisticsPlatform/api/warehouseReceipt';

import { getHouseListNew } from '@/v2/center/logisticsPlatform/api/selectData';
export default {
	data() {
		return {
			type: 'rest'
		};
	},
	computed: {
		VUEX_ST_COMPANYSUER() {
			if (this.$store.state.user) {
				return this.$store.state.user.VUEX_ST_COMPANYSUER;
			}
			return {};
		},
		// 仓储企业
		isWarehouse() {
			return this.VUEX_ST_COMPANYSUER.companyType == 'WAREHOUSE';
		}
	},
	methods: {
		API_getWarehouseReceiptList,
		API_getWarehouseReceiptStatistics,
		API_exportWarehouseList,
		getHouseListNew,
		API_getWarehouseReceiptQuantityTip,
		API_warehouseReceiptStatusTip,
		goLading(item) {
			let path = '/center/logisticsPlatform/warehouseReceipt/warehouseReceiptDelivery/add';
			this.$router.push({
				path,
				query: {
					receiptid: item.id
				}
			});
		},
		goDetail(record) {
			let path = '/center/logisticsPlatform/warehouseReceipt/warehouseReceiptQuery/detail';
			this.$router.push({
				path,
				query: {
					id: record.id
				}
			});
		}
	},
	components: {
		WarehouseReceiptList,
	}
};
</script>

<style scoped lang="less"></style>
