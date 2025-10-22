<template>
	<a-modal
		:visible="visible"
		:footer="null"
		centered
		@cancel="handleCancel"
		:width="800"
		:title="null"
		destroyOnClose
	>
		<div class="title">船舶列表</div>
		<div style="padding: 20px 20px 34px">
			<a-table
				:columns="shipColumns"
				class="new-table"
				:bordered="false"
				rowKey="batchId"
				:scroll="{ x: true }"
				:dataSource="dataSource"
				:pagination="false"
				:loading="loading"
			>
				<span
					slot="Amount"
					slot-scope="text"
				>
					{{ text | formatMoney(2) }}</span
				>
				<a-space
					slot="action"
					slot-scope="text, record"
				>
					<a
						href="javascript:;"
						@click="jumpToShipTail(record)"
						>轨迹查询</a
					>
					<a
						href="javascript:;"
						@click="jumpToMonitor(record)"
						>监控查询</a
					>
				</a-space>
			</a-table>
		</div>
	</a-modal>
</template>

<script>
import { API_GetShipTrackFlag, API_DEVICESHIPLIST } from '@/v2/center/trade/api/receive';
import { shipColumns } from '../columns/columns.js';
export default {
	data() {
		return {
			visible: false,
			loading: false,
			dataSource: [],
			shipColumns
		};
	},
	components: {},
	mounted() {},
	methods: {
		handleCancel() {
			this.visible = false;
		},
		showModal(batchId) {
			this.loading = true;
			this.dataSource = [];
			this.visible = true;
			API_DEVICESHIPLIST({ batchId })
				.then(res => {
					if (res.success) this.dataSource = res.data;
				})
				.finally(() => {
					this.loading = false;
				});
		},
		//轨迹查询
		jumpToShipTail(record) {
			API_GetShipTrackFlag({
				deliveryId: record.batchId,
				mmsi: record.mmsi
			}).then(res => {
				if (res.success) {
					window.open(
						'/logistics/LogisticsDetailShip?mmsi=' +
							record.mmsi +
							'&shipName=' +
							record.shipName +
							'&deliveryId=' +
							record.batchId +
							'&type=historyLocation'
					);
				} else {
					this.$message.error(res.message || '');
				}
			});
		},
		//监控查询
		jumpToMonitor(record) {
			window.open('/logistics/monitoringShip?mmsi=' + record.mmsi + '&deliveryId=' + record.batchId + '&shipId=' + record.shipId);
		}
	}
};
</script>
<style lang="less" scoped>
.title {
	font-family: 'PingFang SC';
	font-style: normal;
	font-weight: 500;
	font-size: 18px;
	line-height: 58px;
	color: rgba(0, 0, 0, 0.8);
	background: #f3f5f6;
	padding-left: 20px;
	border-radius: 8px 8px 0px 0px;
}
/deep/ .ant-modal-body {
	padding: 0;
}
/deep/ .ant-modal-close-x {
	background: url('~@/v2/assets/imgs/receive/icon_delete.png') no-repeat;
	background-size: cover;
	.ant-modal-close-icon {
		display: none;
	}
}

.ant-table td {
	white-space: nowrap;
}
</style>
