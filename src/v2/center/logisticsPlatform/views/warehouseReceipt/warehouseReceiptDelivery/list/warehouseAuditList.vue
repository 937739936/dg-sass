<template>
	<div class="slMain">
		<a-card :bordered="false">
			<span
				slot="title"
				class="slTitle"
				>仓单提货审核</span
			>
			<DeliveryListView
				:listApi="API_getWarehouseReceiptDeliveryList"
				:statisticsApi="API_getWarehouseReceiptDeliveryStatistics"
				@handleViewDetail="handleViewDetail"
				@handleDelete="handleDelete"
				@gotoSign="gotoSign"
				@gotoAudit="gotoAudit"
			></DeliveryListView>
		</a-card>
	</div>
</template>

<script>
import DeliveryListView from '@sub/logisticsPlatform/warehouseReceipt/warehouseReceiptDelivery/List.vue';

import {
	API_getWarehouseReceiptDeliveryList,
	API_getWarehouseReceiptDeliveryStatistics
} from '@/v2/center/logisticsPlatform/api/warehouseReceipt.js';
export default {
	data() {
		return {};
	},
	computed: {},
	methods: {
		API_getWarehouseReceiptDeliveryList,
		API_getWarehouseReceiptDeliveryStatistics,
		handleViewDetail(record) {
			let path = '/center/logisticsPlatform/warehouseReceipt/warehouseReceiptDelivery/auditDetail';
			this.$router.push({
				path,
				query: {
					id: record.id
				}
			});
		},
		// 审核
		gotoAudit(record) {
			let path = '/center/logisticsPlatform/warehouseReceipt/delivery/warehouseAudit';
			this.$router.push({
				path,
				query: {
					id: record.id
				}
			});
		},

		// 签章
		gotoSign(record) {
			let path = '/center/logisticsPlatform/warehouseReceipt/delivery/sign';
			this.$router.push({
				path,
				query: {
					id: record.id
				}
			});
		}
	},

	components: {
		DeliveryListView
	}
};
</script>
<style lang="less" scoped>
.slMain {
	margin-top: -10px;
}
</style>
