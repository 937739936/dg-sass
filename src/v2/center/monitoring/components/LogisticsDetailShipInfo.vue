<template>
	<div class="third-fin-ship-info">
		<div class="ship-info-container">
			<div class="train-times-wrap">
				<a-table
					:dataSource="dataSource"
					:columns="columnsShip"
					:pagination="false"
					:locale="{ emptyText: '暂无数据' }"
				>
					<a-space
						slot="operation"
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
		</div>
	</div>
</template>
<script>
/**
 * 给云控使用的船舶信息页面
 */
import { API_GetShipTrackFlag, API_GetShipDeliverInfoShips } from '@/v2/center/monitoring/api';

export default {
	name: 'ThirdFinShipInfo',
	data() {
		return {
			deliverId: '', // 发货批次id
			batchNo: '', // 发货批次号
			dataSource: [],
			columnsShip: [
				{ title: '船舶名称', dataIndex: 'shipName' },
				{ title: '航次号', dataIndex: 'voyageNo' },
				{ title: 'mmsi', dataIndex: 'identifierNo' },
				{ title: '装货量（吨）', dataIndex: 'deliverQuantity' },
				{
					title: '操作',
					key: 'operation',
					scopedSlots: { customRender: 'operation' }
				}
			]
		};
	},
	props: ['deliverBatchNo'],
	watch: {
		deliverBatchNo: function () {
			this.init();
		}
	},
	mounted() {
		this.init();
	},
	methods: {
		init() {
			this.batchNo = this.deliverBatchNo || '';
			if (this.batchNo) {
				this.getDetail();
			} else {
				this.$message.error('缺少相关参数');
			}
		},
		getDetail() {
			API_GetShipDeliverInfoShips(this.batchNo, { batchNo: this.batchNo }).then(res => {
				if (!res.success) {
					this.$message.error(res.message);
					return false;
				}
				this.dataSource = res.data || [];
			});
		},
		jumpToShipTail(record) {
			this.deliverId = record.deliverBatchId;
			API_GetShipTrackFlag({
				deliveryId: this.deliverId,
				mmsi: record.identifierNo
			}).then(res => {
				if (res.success) {
					window.open(
						'/logistics/LogisticsDetailShip?mmsi=' +
							record.identifierNo +
							'&shipName=' +
							record.shipName +
							'&type=historyLocation&deliveryId=' +
							this.deliverId
					);
				} else {
					this.$message.error(res.message || '');
				}
			});
		},
		//监控查询
		jumpToMonitor(record) {
			window.open(
				'/logistics/monitoringShip?mmsi=' + record.identifierNo + '&deliveryId=' + record.deliverBatchId + '&shipId=' + record.id
			);
		}
	}
};
</script>
<style lang="less" scoped>
.third-fin-ship-info {
	width: 100%;
	.ship-info-container {
		width: 800px;
		margin: auto;
	}
	.train-times-wrap {
		margin-bottom: 30px;
	}
}
</style>
<style>
html,
body,
#app,
.lay-container {
	min-width: 800px;
}
</style>
