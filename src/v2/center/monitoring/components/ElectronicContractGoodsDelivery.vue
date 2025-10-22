<template>
	<div>
		<a-tabs default-active-key="0">
			<a-tab-pane
				key="0"
				tab="收发货信息"
			>
				<div style="width: 100%">
					<p
						class="mb8"
						v-if="goodsDeliveryStatistics.remark"
					>
						{{ goodsDeliveryStatistics.remark }}
					</p>
					<div class="mb8">
						<span class="mr16">合同数量：{{ goodsDeliveryStatistics.contractQuantity }}</span>
						<span class="mr16">已发货：{{ goodsDeliveryStatistics.deliverQuantity }}吨</span>
						<span class="mr16">已收货：{{ goodsDeliveryStatistics.receiveQuantity }}吨</span>
						<!-- <span class="mr16">待收货：{{ goodsDeliveryStatistics.unReceiveQuantity }}吨</span> -->
					</div>
					<a-table
						:pagination="false"
						:columns="deliveryColumns"
						:data-source="deliveryList"
						:scroll="{ x: true }"
						rowKey="id"
					>
						<template
							slot="action"
							slot-scope="record"
						>
							<a-space>
								<a @click="jumpPage(record)">查看</a>
								<a
									v-if="record.deliverAttachmentInfo && record.deliverAttachmentInfo.length > 0"
									@click="$refs.multiAttachmentPreview.showModal(record.deliverAttachmentInfo)"
									>附件</a
								>
								<!-- 只有船运、火运 -->
								<!-- 业务类型为非其他时展示轨迹 -->
								<a
									v-if="
										(record.transType == '船运' || record.despatchType == 'TRAIN') &&
										(record.status == 2 || record.status == 3 || record.status == 4) &&
										record.businessType != 'OTHER'
									"
									@click="handleViewTrack(record)"
								>
									<template v-if="record.transType == '船运'">轨迹&监控</template>
									<template v-else>轨迹</template>
								</a>
							</a-space>
						</template>
					</a-table>
					<iPagination
						:pagination="goodsDeliveryPagination"
						@change="getGoodsDeliveryList"
					/>
					<!-- 货物运输--船运轨迹弹窗 -->
					<a-modal
						centered
						class="shipInfoModal"
						:visible="shipModalVisible"
						@cancel="
							() => {
								shipModalVisible = false;
							}
						"
						width="900px"
						:footer="null"
					>
						<third-fin-ship-info :deliverBatchNo="batchNo"></third-fin-ship-info>
						<!-- <iframe
              :src="'/logistics/LogisticsDetailShipInfo?deliverBatchNo='+batchNo" frameborder="0" style="width:100%;height:100%"></iframe> -->
					</a-modal>
				</div>
			</a-tab-pane>
			<a-tab-pane
				key="1"
				tab="货转"
			>
				<div style="width: 100%">
					<div class="mb8">
						<span class="mr16">货转次数：{{ goodsTransferList.length }}</span>
						<span>货转总数量：{{ goodsTransferStatistics.goodsTransferQuantity }}吨</span>
					</div>
					<a-table
						:pagination="false"
						:columns="goodsTransferColumns"
						:data-source="goodsTransferList"
						:scroll="{ x: true }"
						rowKey="goodsTransferNo"
					>
						<span
							slot="status"
							slot-scope="text"
						>
							<template>
								{{ filterCodeByValueName(text, 'deliver_status') }}
							</template>
						</span>
						<template
							slot="action"
							slot-scope="record"
						>
							<a-space>
								<a @click="jumpGoodsTransferPage(record)">查看</a>
								<a @click="downFile(record.goodsTransferNo)">下载</a>
							</a-space>
						</template>
					</a-table>
					<iPagination
						:pagination="goodsTransferPagination"
						@change="getGoodsTransferList"
					/>
				</div>
			</a-tab-pane>
		</a-tabs>
		<MultiAttachmentPreview ref="multiAttachmentPreview" />
	</div>
</template>
<script>
import {
	API_BusinessMonitoringUpstreamDeliverBatchStatistics,
	API_BusinessMonitoringUpstreamDeliverBatchList,
	API_BusinessMonitoringUpstreamGoodsTransferStatistics,
	API_BusinessMonitoringUpstreamGoodsTransferList,
	API_BusinessMonitoringDownstreamDeliverBatchStatistics,
	API_BusinessMonitoringDownstreamDeliverBatchList,
	API_BusinessMonitoringDownstreamGoodsTransferStatistics,
	API_BusinessMonitoringDownstreamGoodsTransferList,
	API_FullBusinessLineDetailDeliverBatchStatistics,
	API_FullBusinessLineDetailGoodsTransferList,
	API_FullBusinessLineDetailGoodsTransferStatistics,
	API_FullBusinessLineDetailDeliverBatchList,
	API_getRouteInfo,
	API_GETTRAINRECORD,
	API_goodsTransferBatchDownload
} from '@/v2/center/monitoring/api';
import { filterCodeByValueName } from '@sub/utils/globalCode.js';
import iPagination from '@sub/components/iPagination';
import ThirdFinShipInfo from './LogisticsDetailShipInfo';
import MultiAttachmentPreview from './MultiAttachmentPreview';
import comDownload from '@sub/utils/comDownload.js';

const deliveryColumns = [
	{ title: '批次号', dataIndex: 'batchNo' },
	{ title: '发货日期', dataIndex: 'deliverDate' },
	{
		title: '运输方式',
		dataIndex: 'despatchType',
		customRender: text => {
			return filterCodeByValueName(text, 'despatchTypeDict') || text;
		}
	},
	{ title: '发货数量(吨)', dataIndex: 'deliverQuantity' },
	{ title: '收货数量(吨)', dataIndex: 'receiveQuantity' },
	{ title: '发货地', dataIndex: 'deliverPlace' },
	{ title: '收货地', dataIndex: 'receivePlace' },
	{
		title: '状态',
		dataIndex: 'statusDesc'
	},
	{
		title: '操作',
		fixed: 'right',
		scopedSlots: { customRender: 'action' },
		width: 180
	}
];
const goodsTransferColumns = [
	{ title: '货转编号', dataIndex: 'goodsTransferNo' },
	{ title: '货转开具时间', dataIndex: 'createTime' },
	{ title: '货转数量(吨)', dataIndex: 'goodsTransferQuantity' },
	{ title: '品名', dataIndex: 'goodsName' },
	{ title: '运输方式', dataIndex: 'transactionTypeName' },
	{ title: '状态', dataIndex: 'statusName' },
	{
		title: '操作',
		fixed: 'right',
		scopedSlots: { customRender: 'action' },
		width: 100
	}
];
export default {
	name: 'ElectronicContractGoodsDelivery',
	components: {
		iPagination,
		ThirdFinShipInfo,
		MultiAttachmentPreview
	},
	props: {
		// 上游当前选中的合同
		curUpstream: {
			type: [Object, String],
			default: ''
		},
		// 下游合同编号
		downOrderNo: {
			type: String,
			default: ''
		},
		// 合同类型
		contractType: {
			type: [Number, String],
			default: 0
		},
		contractNo: {
			type: String,
			default: ''
		},
		orderNo: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			deliveryColumns,
			filterCodeByValueName,
			goodsTransferColumns,
			deliveryList: [],
			goodsTransferList: [],
			goodsDeliveryStatistics: {},
			goodsTransferStatistics: {},
			params: {},
			shipModalVisible: false,
			batchNo: '', // 发货批次号
			goodsTransferPagination: {
				total: 0,
				pageNo: 1
			},
			goodsDeliveryParams: {},
			goodsTransferParams: {},
			goodsDeliveryPagination: {
				total: 0,
				pageNo: 1
			}
		};
	},
	watch: {
		curUpstream() {
			this.getGoodsDelivery();
			this.getGoodsTransfer();
		},
		orderNo() {
			this.getGoodsDelivery();
			this.getGoodsTransfer();
		}
	},
	created() {
		this.getGoodsDelivery();
		this.getGoodsTransfer();
	},
	methods: {
		getGoodsDelivery() {
			// if (!this.curUpstream || !this.downOrderNo) {
			//   return;
			// }
			const { businessLineType } = this.$route.query;
			this.goodsDeliveryParams = {
				upOrderNo: this.curUpstream.upOrderNo || '',
				downOrderNo: this.downOrderNo || '',
				businessLineType,
				orderNo: this.orderNo,
				contractNo: this.contractNo
			};
			this.getGoodsDeliveryList();
			this.getGoodsDeliveryStatistics();
		},
		// 获取收发货信息
		getGoodsDeliveryList(pageNo = this.goodsDeliveryPagination.pageNo, pageSize = 10) {
			const fct = [
				API_BusinessMonitoringUpstreamDeliverBatchList,
				API_BusinessMonitoringDownstreamDeliverBatchList,
				API_FullBusinessLineDetailDeliverBatchList
			][this.contractType];
			fct({ ...this.goodsDeliveryParams, pageNo, pageSize }).then(res => {
				if (res.success) {
					this.deliveryList = res.data.records;
					this.goodsDeliveryPagination.total = res.data.total;
				}
			});
		},
		// 获取收发货信息统计数据
		getGoodsDeliveryStatistics() {
			const fct = [
				API_BusinessMonitoringUpstreamDeliverBatchStatistics,
				API_BusinessMonitoringDownstreamDeliverBatchStatistics,
				API_FullBusinessLineDetailDeliverBatchStatistics
			][this.contractType];
			fct(this.goodsDeliveryParams).then(res => {
				if (res.success) {
					this.goodsDeliveryStatistics = res.data;
				}
			});
		},
		getGoodsTransfer() {
			if (this.contractType !== 2) {
				// if (!this.curUpstream || !this.downOrderNo) {
				// if (!this.curUpstream) {
				//   return;
				// }
			}
			const { businessLineType } = this.$route.query;
			this.goodsTransferParams = {
				businessLineType,
				upOrderNo: (this.curUpstream && this.curUpstream.upOrderNo) || '',
				downOrderNo: this.downOrderNo || '',
				orderNo: this.orderNo,
				contractNo: this.contractNo
			};
			this.getGoodsTransferList();
			this.getGoodsTransferStatistics();
		},
		// 获取货转信息
		getGoodsTransferList(pageNo = this.goodsTransferPagination.pageNo, pageSize = 10) {
			const fct = [
				API_BusinessMonitoringUpstreamGoodsTransferList,
				API_BusinessMonitoringDownstreamGoodsTransferList,
				API_FullBusinessLineDetailGoodsTransferList
			][this.contractType];
			fct({ ...this.goodsTransferParams, pageNo, pageSize }).then(res => {
				if (res.success) {
					this.goodsTransferList = res.data.records;
					this.goodsTransferPagination.total = res.data.total;
				}
			});
		},
		// 获取货转信息统计数据
		getGoodsTransferStatistics() {
			const fct = [
				API_BusinessMonitoringUpstreamGoodsTransferStatistics,
				API_BusinessMonitoringDownstreamGoodsTransferStatistics,
				API_FullBusinessLineDetailGoodsTransferStatistics
			][this.contractType];
			fct(this.goodsTransferParams).then(res => {
				if (res.success) {
					this.goodsTransferStatistics = res.data;
				}
			});
		},

		handleViewTrack(record) {
			// 查看轨迹
			if (record.transType == '火运' || record.despatchType == 'TRAIN') {
				if (record.waybillId) {
					// 联运管家  新数据 火运轨迹
					// 判断是否是神华外购
					API_getRouteInfo({ id: record.waybillId }).then(res => {
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
								window.open('/logistics/LogisticsDetailTrainNew?waybillId=' + record.waybillId);
							}
						}
					});
				} else {
					// 老数据数据 火运轨迹
					API_GETTRAINRECORD({ deliverBatchNo: record.batchNo }).then(res => {
						if (res.success) {
							if (res.result.records.length == 0) {
								this.$message.error('该运单暂无轨迹');
							} else {
								window.open('/logistics/LogisticsDetailTrain?deliverBatchNo=' + record.batchNo);
							}
						}
					});
				}
			} else if (record.transType == '船运') {
				this.shipModalVisible = true;
				this.batchNo = record.batchNo;
			}
		},
		downFile(goodsTransferNo) {
			API_goodsTransferBatchDownload({
				goodsTransferNoList: [goodsTransferNo]
			}).then(res => {
				comDownload(res.data, undefined, res.name);
			});
		},

		jumpPage(record) {
			const { businessLineType } = this.$route.query;
			if (['OFFLINE', 'UP'].includes(businessLineType)) {
				//上下均为补录，点击查看，打开对应发运详情
				let routeUrl = this.$router.resolve({
					path: '/center/receive/coal/logistics/detail/two',
					query: {
						batchNo: record.batchNo
					}
				});
				window.open(routeUrl.href, '_blank');
			} else {
				if (record.status == 4 || record.status == 3) {
					this.$router.push({
						path: '/center/receive/accept/detail',
						query: {
							from: 'receive',
							deliverId: record.id
						}
					});
				} else {
					this.$router.push({
						path: '/center/receive/send/detail',
						query: {
							deliverId: record.id
						}
					});
				}
			}
		},

		jumpGoodsTransferPage(data) {
			const { goodsTransferNo } = data;
			this.$router.push({
				path: '/center/transfer/goodsTransfer/detail',
				query: {
					goodsTransferNo
				}
			});
		}
	}
};
</script>
<style lang="less" scoped></style>
