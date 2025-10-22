<template>
	<div class="sub-table-container">
		<div class="table-box">
			<a-table
				:columns="columns"
				class="new-table"
				:bordered="false"
				rowKey="id"
				:dataSource="dataSource"
				:pagination="false"
				:loading="loading"
				:scroll="{ x: true }"
			>
				<template
					slot="statusDesc"
					slot-scope="text, record"
				>
					<div :class="`status-tag status-${record.status}`">{{ text || '-' }}</div>
				</template>
				<template
					slot="action"
					slot-scope="text, items"
				>
					<a-space :size="20">
						<a
							v-if="platformType === 'ADMIN'"
							href="javascript:;"
							@click="goSendDetail(items)"
							>详情</a
						>
						<a
							href="javascript:;"
							v-if="['TRAIN', 'SHIP'].includes(items.despatchType)"
							@click="goTrack(items)"
							>轨迹</a
						>
					</a-space>
				</template>
			</a-table>
		</div>
		<a-modal
			class="del-modal slModal"
			:visible="trackVisible"
			:width="720"
			@cancel="trackVisible = false"
			title="轨迹"
			:footer="null"
		>
			<a-table
				:columns="trackColumns"
				class="new-table"
				style="margin-bottom: 20px"
				:bordered="false"
				rowKey="no"
				:scroll="{ x: true }"
				:dataSource="trackList"
				:pagination="false"
			>
				<template
					slot="action"
					slot-scope="text, items"
				>
					<a-space>
						<a
							href="javascript:;"
							@click="goShip(items)"
							>轨迹查询</a
						>
						<!-- <a
							href="javascript:;"
							v-if="items.shipMonitorButton"
							@click="jumpToMonitor(items)"
							>监控查询</a
						> -->
					</a-space>
				</template>
			</a-table>
		</a-modal>
	</div>
</template>

<script>
import { formatMoney } from '@sub/filters';
export default {
	name: 'GoodsBatchTable',
	inject: ['platformType'],
	components: {},
	props: {
		// 数据源
		dataSource: {
			type: Array,
			default: () => []
		},
		API_GetShipTrackFlag: {},
		API_getRouteInfo: {}
	},
	data() {
		return {
			columns: columns,
			loading: false,
			trackVisible: false,
			trackType: '',
			// 当前发运信息
			currentItem: {},
			trackList: [],
			trackColumns: trackColumns
		};
	},
	mounted() {},
	computed: {},
	methods: {
		formatMoney,
		openDetail(record) {
			this.$emit('openNewTabPage', 'GOODS_SEND_DETAIL', record);
		},
		// 获取监控按钮权限
		isMonitoringAuth(item) {
			if (item.shipDetailDtos) {
				if (item.shipDetailDtos.length == 1) {
					const firstItem = item.shipDetailDtos[0];
					return firstItem.shipMonitorButton;
				} else {
					return item.shipDetailDtos.some(el => el.shipMonitorButton);
				}
			}
			return false;
		},
		// 去往发货详情
		goSendDetail(item) {
			if (this.type == 'rest') {
				return;
			} else {
				window.open(`/biz/deliver/deliverDetail?deliverId=${item.id}`);
			}
		},
		// 去往轨迹
		goTrack(items) {
			this.currentItem = items;
			this.trackType = 'track';
			if (items.despatchType == 'SHIP') {
				/** 判断当前船运 shipDetailDtos 是不是多个 */
				if (items.shipDetailDtos.length == 1) {
					const firstItem = items.shipDetailDtos[0];
					this.goShip(firstItem);
				} else {
					this.trackVisible = true;
					this.trackList = items.shipDetailDtos;
				}
			} else {
				this.API_getRouteInfo({ id: items.waybillId }).then(res => {
					let hasPath = false;
					let info = res.result || res.data;
					if (info) {
						for (let i = 0; i < info.length; i++) {
							if (info[i].waybillPhaseTraceInfoVO.length) {
								hasPath = true;
								break;
							}
						}
					}
					if (!hasPath) {
						this.$message.error('该运单暂无轨迹');
					} else {
						if (this.platformType == 'REST') {
							window.open('/logistics/LogisticsDetailTrainNew?waybillId=' + items.waybillId);
						} else {
							window.open('/logistics/logisticsDetailNew?id=' + items.waybillId);
						}
					}
				});
			}
		},
		// 去往船运轨迹
		goShip(items) {
			this.API_GetShipTrackFlag({
				deliveryId: this.currentItem.id,
				mmsi: items.identifierNo
			}).then(res => {
				if (res.success) {
					if (this.platformType == 'REST') {
						window.open(
							'/logistics/LogisticsDetailShip?mmsi=' +
								items.identifierNo +
								'&shipName=' +
								items.shipName +
								'&type=historyLocation&deliveryId=' +
								this.currentItem.id +
								'&from=yunkong&coalType=COKING_COAL&transType=SHIP'
						);
						return;
					}
					window.open(
						'/logistics/shipTrail?mmsi=' +
							items.identifierNo +
							'&shipName=' +
							items.shipName +
							'&type=2&deliverId=' +
							this.currentItem.id +
							''
					);
				} else {
					this.$message.error(res.message || '');
				}
			});
		}
	}
};

// 数据为空时，显示的表头
const customRender = text => text || '-';
const columns = [
	{ title: '批次号', dataIndex: 'batchNo', customRender },
	{ title: '发货日期', dataIndex: 'deliverDate', customRender },
	{ title: '运输方式', dataIndex: 'despatchTypeDesc', customRender },
	{ title: '发货数量(吨)', dataIndex: 'deliverQuantity', customRender: t => formatMoney(t) },
	{ title: '收货数量(吨)', dataIndex: 'receiveQuantity', customRender: t => formatMoney(t) },
	{
		title: '状态',
		dataIndex: 'statusDesc',
		scopedSlots: {
			customRender: 'statusDesc'
		}
	},
	{ title: '发货地', dataIndex: 'deliverPlace', customRender },
	{ title: '收货地', dataIndex: 'receivePlace', customRender },
	{ title: '操作', dataIndex: 'action', scopedSlots: { customRender: 'action' }, fixed: 'right' }
];

const trackColumns = [
	{ title: '船舶名称', dataIndex: 'shipName', customRender },
	{ title: '航次号', dataIndex: 'voyageNo', customRender },
	{ title: 'MMSI', dataIndex: 'identifierNo', customRender },
	{ title: '发货量', dataIndex: 'deliverQuantity', customRender },
	{ title: '操作', dataIndex: 'action', scopedSlots: { customRender: 'action' }, width: 150 }
];
</script>

<style lang="less" scoped>
@import url('~@sub/style/table-cover.less');
</style>
<style lang="less" scoped>
.sub-table-container {
	width: 100%;
	.slTitleAssis {
		margin-top: 4px;
	}
	/deep/ .ant-table {
		td,
		th {
			white-space: nowrap;
			// text-overflow: ellipsis;
			// overflow: hidden;
		}
	}
	.status-tag {
		display: inline-block;
		padding: 0 6px;
		height: 20px;
		border-radius: 4px;
		font-size: 12px;
		line-height: 20px;
		background: #c1d7ff;
		color: #4682f3;
		// cursor: pointer;
		&.status-1 {
			background: #c9daff;
			color: #596fa0;
		}
		&.status-2 {
			background: #ffdbc8;
			color: #ff7937;
		}
		&.status-3 {
			background: #f8dde8;
			color: #db81a5;
		}
		&.status-4 {
			background: #c5ecdd;
			color: #3eb384;
		}
		&.status-5 {
			background: #e0e0e0;
			color: #a8a8a8;
		}
	}
}
</style>