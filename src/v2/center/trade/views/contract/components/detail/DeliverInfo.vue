<template>
	<div class="tabs-content">
		<!-- 发运信息 -->
		<a-row
			type="flex"
			:gutter="20"
		>
			<a-col span="21">
				<div id="deliver">
					<a-row
						type="flex"
						:gutter="30"
					>
						<a-col>
							<div class="slTitleAssis">发运信息</div>
						</a-col>
						<a-col class="mt32">
							<span class="label">已发货：</span>
							<span>{{ detail.deliveredQuantity | formatMoney(2) }}吨</span>
						</a-col>
						<a-col class="mt32">
							<span class="label">已收货：</span>
							<span>{{ detail.receivedQuantity | formatMoney(2) }}吨</span>
						</a-col>
						<a-col class="mt32">
							<span class="label">待收货：</span>
							<span>{{ detail.toReceiveQuantity | formatMoney(2) }}吨</span>
						</a-col>
					</a-row>
					<div class="table-box">
						<a-table
							:columns="deliverColumns"
							class="new-table"
							:bordered="false"
							rowKey="id"
							:dataSource="detail.dispatchInfoDtoList"
							:pagination="false"
							:scroll="{ x: true }"
						>
							<template
								slot="storageRecordList"
								slot-scope="text, record"
							>
								<div v-if="record.storageRecordList && record.storageRecordList.length">
									<div
										v-for="(item, index) in record.storageRecordList"
										:key="index"
									>
										<a
											v-if="authFlag"
											href="javascript:;"
											@click="jumpStorehouseDetail(item.storageRecordId)"
											>{{ item.storageRecordSerialNo }}</a
										>
										<span v-else>{{ item.storageRecordSerialNo }}</span>
									</div>
								</div>
								<span v-else>-</span>
							</template>
							<template
								slot="deliverQuantity"
								slot-scope="text"
							>
								<span>{{ text | formatMoney(2) }}</span>
							</template>
							<template
								slot="receiveQuantity"
								slot-scope="text"
							>
								<span>{{ text | formatMoney(2) }}</span>
							</template>
							<!--
              DELIVERED(2, "已发货"),
              RECEIVE_PART(3, "部分收货"),
              RECEIVED(4, "已收货"),-->
							<template
								slot="action"
								slot-scope="text, items"
							>
								<a-space>
									<a
										v-if="[2, 3, 4].includes(items.status)"
										@click="viewDeliver(items)"
										>查看</a
									>
									<a
										v-if="[2, 3].includes(items.status) && data.contract.buyCompanyUscc === VUEX_ST_COMPANYSUER.company.uscc"
										@click="receiverConfirm(items)"
										>{{ items.status === 2 ? '确认收货' : '继续收货' }}</a
									>
									<!-- <a v-if="items.tansType !== 'AUTOMOBILE'" @click="travel()">轨迹</a> -->
								</a-space>
							</template>
						</a-table>
					</div>
				</div>
				<div id="goodsTransfer">
					<a-row
						type="flex"
						:gutter="30"
					>
						<a-col>
							<div class="slTitleAssis">货转信息</div>
						</a-col>
						<a-col class="mt32">
							<span class="label">货转数量：</span>
							<span>{{ detail.goodsTransferQuantity | formatMoney(2) }}吨</span>
						</a-col>
					</a-row>
					<div class="table-box">
						<a-table
							:columns="goodsTransferColumns"
							class="new-table"
							:bordered="false"
							rowKey="id"
							:dataSource="detail.goodsTransferDtoList"
							:pagination="false"
							:scroll="{ x: true }"
						>
							<template
								slot="goodsTransferQuantity"
								slot-scope="text"
							>
								<span>{{ text | formatMoney(2) }}</span>
							</template>
							<template
								slot="action"
								slot-scope="text, items"
							>
								<a-space>
									<a @click="viewDetail(items)">查看</a>
									<a @click="download(items)">下载</a>
								</a-space>
							</template>
						</a-table>
					</div>
				</div>
			</a-col>
			<a-col span="3">
				<div class="anchorPointBox">
					<div class="anchorPointItem">
						<AnchorIcon v-if="anchor === '#deliver'" class="anchorPointIcon"></AnchorIcon>
						<p
							:class="anchor === '#deliver' ? 'blue' : ''"
							@click.stop="goAnchor('#deliver')"
						>
							<em class="dot"></em>
							发运信息
						</p>
					</div>
					<div class="anchorPointItem">
						<AnchorIcon v-if="anchor === '#goodsTransfer'" class="anchorPointIcon"></AnchorIcon>
						<p
							:class="anchor === '#goodsTransfer' ? 'blue' : ''"
							@click.stop="goAnchor('#goodsTransfer')"
						>
							<em class="dot"></em>
							货转信息
						</p>
					</div>
				</div>
			</a-col>
		</a-row>
	</div>
</template>

<script>
const deliverColumns = [
	{ title: '批次号', dataIndex: 'batchNo' },
	{ title: '发货日期', dataIndex: 'deliverDate' },
	{ title: '运输方式', dataIndex: 'despatchTypeText' },
	{ title: '发货数量(吨)', dataIndex: 'deliverQuantity', scopedSlots: { customRender: 'deliverQuantity' } },
	{ title: '收货数量(吨)', dataIndex: 'receiveQuantity', scopedSlots: { customRender: 'receiveQuantity' } },
	{ title: '发货地', dataIndex: 'deliveryStation' },
	{ title: '收货地', dataIndex: 'arriveStation' },
	{ title: '状态', dataIndex: 'statusDesc' },
	{ title: '操作', dataIndex: 'action', scopedSlots: { customRender: 'action' }, fixed: 'right' }
];
const goodsTransferColumns = [
	{ title: '货转编号', dataIndex: 'no' },
	{ title: '货转开具时间', dataIndex: 'signTime' },
	{ title: '货转数量(吨)', dataIndex: 'goodsTransferQuantity', scopedSlots: { customRender: 'goodsTransferQuantity' } },
	{ title: '品名', dataIndex: 'goodsName' },
	{ title: '运输方式', dataIndex: 'transportModeName' },
	{ title: '状态', dataIndex: 'statusDesc' },
	{ title: '操作', dataIndex: 'action', scopedSlots: { customRender: 'action' }, fixed: 'right' }
];
import { API_getOrderDispatchAndGoodsTransferResp } from '@/v2/center/trade/api/contract';
import { API_goodsTransferBatchDownload } from '@/v2/center/trade/api/goodsTransfer';
import { API_getRouteInfo, API_GETTRAINRECORD, API_GetShipTrackFlag } from '@/v2/center/trade/api/receive';
import comDownload from '@sub/utils/comDownload.js';
import { mapGetters } from 'vuex';
import { subsystemOptionsEdit } from '@/v2/center/logisticsPlatform/api';
import { AnchorIcon } from '@sub/components/svg';

export default {
	data() {
		return {
			deliverColumns,
			goodsTransferColumns,
			detail: {},
			anchor: '#deliver'
		};
	},
	props: ['data'],
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER',
			VUEX_ST_USERAUTH: 'VUEX_ST_USERAUTH'
		}),
		authFlag() {
			return (
				this.VUEX_ST_USERAUTH.includes('logisticsStorageCenter') &&
				this.VUEX_ST_USERAUTH.includes('logisticsStorageCenter:inManage:storage')
			);
		}
	},
	components: {
		AnchorIcon
	},
	methods: {
		async init() {
			let res = await API_getOrderDispatchAndGoodsTransferResp({ orderId: this.data.contract.id });
			if (res.success) {
				this.detail = res.data;
			}
			if (!this.detail.hasInOutGenDeliver) return;
			let arr = this.deliverColumns.filter(items => {
				return items.title == '入库单号';
			});
			if (!arr.length) {
				let obj = { title: '入库单号', dataIndex: 'storageRecordList', scopedSlots: { customRender: 'storageRecordList' } };
				this.deliverColumns.splice(1, 0, obj);
			}
		},
		viewDeliver(items) {
			let routerData = this.$router.resolve({
				path: '/center/receive/accept/detail',
				query: {
					deliverId: items.deliverBatchId,
					from: 'release'
				}
			});
			window.open(routerData.href, '_blank');
		},
		travel(items) {
			if (items.despatchType === 'SHIP') {
				// 船运轨迹优化，收货前后均可查看物流轨迹
				API_GetShipTrackFlag({
					deliveryId: items.id,
					mmsi: items.identifierNo
				}).then(res => {
					if (res.success) {
						let routerData = this.$router.resolve({
							path: '/logistics/LogisticsDetailShip',
							query: {
								mmsi: items.mmsi,
								shipName: items.shipName,
								deliveryId: items.id,
								type: 'historyLocation'
							}
						});
						window.open(routerData.href, '_blank');
					} else {
						this.$message.error(res.message || '');
					}
				});
			} else {
				// 火运
				if (items.waybillId) {
					// 新数据  联运管家 传运单号
					// 判断是否是神华外购
					API_getRouteInfo({ id: items.waybillId }).then(res => {
						if (res.success) {
							let hasPath = false;
							if (res.data) {
								for (let i = 0; i < res.data.length; i++) {
									if (res.data[i].waybillPhaseTraceInfoVO.length) {
										hasPath = true;
										break;
									}
								}
							}
							if (!hasPath) {
								this.$message.error('该运单暂无轨迹');
							} else {
								let routerData = this.$router.resolve({
									path: '/logistics/logisticsDetailNew',
									query: {
										id: items.waybillId
									}
								});
								window.open(routerData.href, '_blank');
							}
						}
					});
				} else {
					// 老数据 传批次号
					API_GETTRAINRECORD({ deliverBatchNo: items.batchNo }).then(res => {
						if (res.success) {
							if (res.result.records.length == 0) {
								this.$message.error('该运单暂无轨迹');
								return;
							} else {
								if (items.despatchType == this.CONSTANTS.despatchModeDict.TRAIN) {
									let routerData = this.$router.resolve({
										path: '/logistics/logisticsDetailNew',
										query: {
											deliverBatchNo: items.batchNo
										}
									});
									window.open(routerData.href, '_blank');
								}
							}
						}
					});
				}
			}
		},
		// 货转详情
		viewDetail(item) {
			let goodsTransferNo = item.no;
			let routerData = this.$router.resolve({
				path: '/center/transfer/goodsTransfer/detail',
				query: {
					goodsTransferNo
				}
			});
			window.open(routerData.href, '_blank');
		},
		//下载
		download(item) {
			let goodsTransferNo = item.no;
			API_goodsTransferBatchDownload({
				goodsTransferNoList: [goodsTransferNo]
			}).then(res => {
				comDownload(res.data, undefined, res.name);
			});
		},
		receiverConfirm(record) {
			let routerData = this.$router.resolve({
				path: '/center/receive/accept/confirm',
				query: {
					deliverId: record.deliverBatchId,
					from: 'receive',
					first: record.status == 2 ? true : undefined
				}
			});
			window.open(routerData.href, '_blank');
		},
		goAnchor(selector) {
			/*参数selector是id选择器（#anchor14）*/
			this.anchor = selector;
			this.$nextTick(() => {
				setTimeout(() => {
					document.querySelector(selector).scrollIntoView({
						behavior: 'smooth'
					});
				});
			});
		},
		jumpStorehouseDetail(id) {
			// 入库详情
			const { stationId, stationCompanyUscc } = this.data.contract;
			subsystemOptionsEdit({
				stationId: stationId,
				companyCreditCode: stationCompanyUscc
			});
			let routerData = this.$router.resolve({
				path: '/center/logisticsPlatform/IN/records/detail',
				query: {
					id
				}
			});
			window.open(routerData.href, '_blank');
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less" scoped>
.slTitleAssis {
	margin-top: 30px;
}
.tabs-content {
	width: 100%;
	& > ::v-deep.ant-row-flex {
		width: 100%;
	}
}
.anchorPointBox {
	font-family:
		PingFangSC-Regular,
		PingFang SC;
	font-weight: 400;
	color: #77889d;
	line-height: 20px;
	margin: 27px 0;
	border-left: 1px solid #e9effc;
	cursor: pointer;
	.anchorPointItem {
		height: 48px;
		padding-left: 20px;
		position: relative;
		line-height: 20px;
		.anchorPointIcon {
			width: 8px;
			height: 12px;
			position: absolute;
			left: 0;
			top: 4px;
		}
	}
	.blue {
		color: @primary-color;
		.dot {
			background-color: @primary-color;
		}
	}
	.dot {
		display: inline-block;
		width: 4px;
		height: 4px;
		border-radius: 50%;
		background: #77889d;
		margin-right: 3px;
		position: relative;
		top: -2px;
	}
}
.mt32 {
	margin-top: 32px;
}
</style>
