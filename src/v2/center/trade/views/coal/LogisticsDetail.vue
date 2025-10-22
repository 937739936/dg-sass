<template>
	<div class="custom-main-content-inner">
		<div class="page-title">
			<span>发货确认</span>
		</div>
		<a-card title="合同信息">
			<template #extra>状态:{{ data.statusDesc }}</template>
			<a-descriptions :column="2">
				<a-descriptions-item label="合同编号">
					<a @click.prevent="constractDetail">{{ data.paperContractNo }}</a>
				</a-descriptions-item>
				<a-descriptions-item label="签订日期">{{ data.contractSignTime }}</a-descriptions-item>
				<a-descriptions-item label="卖方企业名称">{{ data.sellerName }}</a-descriptions-item>
				<a-descriptions-item label="买方企业名称">{{ data.buyerName }}</a-descriptions-item>
				<a-descriptions-item label="煤种">{{ data.coalTypeDesc }}</a-descriptions-item>
				<a-descriptions-item label="品名">{{ data.goodsName }}</a-descriptions-item>
				<a-descriptions-item label="基准价格(元/吨)">{{
					data.followTheMarket ? '随行就市' : data.contractPrice
				}}</a-descriptions-item>
				<a-descriptions-item label="数量(吨)">{{ data.contractQuantity }}</a-descriptions-item>
				<a-descriptions-item label="交货期限"> {{ data.execDateStart }} 至 {{ data.execDateEnd }} </a-descriptions-item>
				<a-descriptions-item label="运输方式">{{ data.transTypeDesc }}</a-descriptions-item>
			</a-descriptions>
		</a-card>
		<template v-if="data.transType == 'TRAIN'">
			<a-card
				title="发运信息"
				style="margin-top: 10px"
			>
				<a-descriptions :column="2">
					<a-descriptions-item label="托运人">{{ data.shipperName }}</a-descriptions-item>
					<a-descriptions-item label="运单号">{{ data.serialNo }}</a-descriptions-item>
					<a-descriptions-item label="发货数量（吨）">
						{{ data.deliverQuantity }}
					</a-descriptions-item>
					<a-descriptions-item label="车数">{{ data.trainNum }}</a-descriptions-item>
					<a-descriptions-item label="发货日期">{{ data.deliverDate }}</a-descriptions-item>
					<a-descriptions-item label="发站">{{ data.deliveryStation }}</a-descriptions-item>
					<a-descriptions-item label="到站">{{ data.arriveStation }}</a-descriptions-item>
					<a-descriptions-item label="铁路计划号">{{ data.railwayPlanNo }}</a-descriptions-item>
				</a-descriptions>
			</a-card>
			<a-card
				title="车皮信息"
				style="margin-top: 10px"
			>
				<a-table
					:bordered="false"
					:columns="columns.train"
					:rowKey="(record, index) => index"
					:dataSource="data.deliveryInfoTrain"
					:pagination="false"
					:scroll="{ x: false }"
				>
					<template
						slot="action"
						slot-scope="action, record"
					>
						<!--handInput
              联运管家返回departureTime为null的情况，用户手动录入发货日期。取值为2
              联运管家返回departureTime不为null的情况，取值为0
              联运管家返回无数据，或者神华外购，属于手动录入 取值为1 -->
						<template v-if="data.handInput != 1">
							<a @click.prevent="viewWaybill(record)">查看运单</a>
							<a
								style="padding-left: 10px"
								@click.prevent="viewCarNumber(record)"
							>
								查看车号表
							</a>
							<!-- 如果是从联运管家收到物流轨迹，则展示“物流轨迹”按钮 -->
							<a
								style="padding-left: 10px"
								@click="handleViewTrack"
							>
								物流轨迹
							</a>
						</template>
					</template>
				</a-table>
			</a-card>
		</template>
		<template v-if="data.transType == 'SHIP'">
			<a-card
				title="发运信息"
				style="margin-top: 10px"
			>
				<a-descriptions :column="2">
					<a-descriptions-item label="装船数量">{{ data.deliverQuantity }}</a-descriptions-item>
					<a-descriptions-item label="装船日期">{{ data.deliverDate }}</a-descriptions-item>
					<a-descriptions-item label="装货港">{{ data.shipLoadingPortName }}</a-descriptions-item>
					<a-descriptions-item label="卸货港">{{ data.shipDischargingPortName }}</a-descriptions-item>
				</a-descriptions>
			</a-card>
			<a-card
				title="船舶信息"
				style="margin-top: 10px"
			>
				<a-table
					:bordered="false"
					:columns="columns.ship"
					:rowKey="(record, index) => index"
					:dataSource="data.deliveryInfoShip"
					:pagination="false"
					:scroll="{ x: true }"
				>
					<template
						slot="action"
						slot-scope="action, record"
						v-if="record.shipTrackExist"
					>
						<a @click.prevent="viewShipTrack(record)">船运轨迹</a>
					</template>
				</a-table>
			</a-card>
		</template>
		<template v-if="data.transType == 'AUTOMOBILE'">
			<a-card
				title="发运信息"
				style="margin-top: 10px"
			>
				<a-descriptions :column="2">
					<a-descriptions-item label="发货数量（吨）">{{ data.deliverQuantity }}</a-descriptions-item>
					<a-descriptions-item label="发货日期">{{ data.deliverDate }}</a-descriptions-item>
					<a-descriptions-item label="发货地址">{{ data.deliverAddr }}</a-descriptions-item>
					<a-descriptions-item label="收货地址">{{ data.receiveAddr }}</a-descriptions-item>
					<a-descriptions-item label="车数">{{ data.trainNum }}</a-descriptions-item>
				</a-descriptions>
			</a-card>
			<a-card
				title="车辆信息"
				style="margin-top: 10px"
			>
				<a-table
					:bordered="false"
					:columns="columns.logisticsAutomobile"
					:rowKey="(record, index) => index"
					:dataSource="data.deliveryInfoTruck"
					:pagination="false"
					:scroll="{ x: false }"
				>
				</a-table>
			</a-card>
		</template>

		<a-card
			title="发货附件"
			style="margin-top: 10px"
		>
			<a-table
				:bordered="false"
				:columns="columns.logisticsAttachment"
				:rowKey="record => record.id"
				:dataSource="data.deliverAttachmentList"
				:pagination="false"
				:scroll="{ x: false }"
			>
				<template
					slot="action"
					slot-scope="action, record"
				>
					<a @click.prevent="handlePreview(record)">查看</a>
					<a
						@click.prevent="download(record)"
						style="padding-left: 10px"
						>下载</a
					>
				</template>
			</a-table>
		</a-card>
		<div style="margin-top: 20px; text-align: center">
			<a-button @click="goback">返回</a-button>
			<template v-if="data.status == 11">
				<a-button
					style="margin-left: 20px"
					@click="rejectModal"
					>驳回</a-button
				>
				<a-button
					type="primary"
					style="margin-left: 20px"
					@click="doConfirm"
					v-auth="'coalMineDgChain:despatch:deliver:confirm'"
					>确认</a-button
				>
			</template>
		</div>
		<a-modal
			title="提示"
			:visible="rejectVisible"
			:destroyOnClose="true"
			@cancel="rejectModal"
			@ok="doReject"
		>
			<a-form>
				<a-form-item
					label="请输入驳回原因(如日期错误、数量错误、单据错误等)"
					required
				>
					<a-textarea
						:auto-size="{ minRows: 4, maxRows: 6 }"
						v-model="rejectReason"
						:maxLength="200"
					></a-textarea>
				</a-form-item>
			</a-form>
		</a-modal>
		<WaybillInfoModal
			ref="waybillModal"
			:modalInfo="modalInfo"
		/>
		<CarNumberTableModal
			ref="carNumberModal"
			:modalInfo="modalInfo"
			:waybillId="data.waybillId"
		/>
		<!-- encodeURI图片地址解决图片地址含有中文及特殊符号无法预览问题 -->
		<img
			:src="previewImg"
			style="display: none"
			ref="viewer"
			v-viewer
		/>
	</div>
</template>
<script>
import { columns } from './js/logistics';
import {
	getLogisticsDetail,
	doLogisticsStatus,
	API_GETCURRENTENV,
	API_DOWNLPREVIEWTE,
	API_GetDownloadRAR,
	API_getRouteInfo
} from '@/v2/center/trade/api/coal';
import ENV from '@/v2/config/env';
import comDownload from '@sub/utils/comDownload.js';
import WaybillInfoModal from './components/WaybillInfoModal.vue';
import CarNumberTableModal from './components/CarNumberTableModal.vue';
export default {
	components: {
		WaybillInfoModal,
		CarNumberTableModal
	},
	data() {
		return {
			batchNo: this.$route.query.batchNo,
			columns,
			dataSource: [],
			data: {},
			API_GETCURRENTENV,
			rejectVisible: false,
			rejectReason: '',
			previewImg: '', //附件预览地址
			modalInfo: {}
		};
	},
	mounted() {
		this.doFetch();
	},
	methods: {
		doFetch() {
			getLogisticsDetail(this.batchNo).then(res => {
				this.data = res.data;
			});
		},

		rejectModal() {
			this.rejectVisible = !this.rejectVisible;
		},
		doReject() {
			let rejectReason = this.rejectReason;
			if (!rejectReason || !rejectReason.replace(/\s/g, '')) {
				this.$message.error('请输入驳回原因');
				return;
			}
			doLogisticsStatus({ batchNo: this.data.batchNo, rejectReason, confirm: false }).then(res => {
				if (!res.success) {
					return;
				}
				this.$message.success('操作成功');
				this.rejectModal();
				this.doFetch();
				this.$router.back();
			});
		},
		doConfirm() {
			this.$confirm({
				title: '提交确认',
				content: '请确认发货信息无误',
				onOk: () => {
					doLogisticsStatus({ batchNo: this.data.batchNo, confirm: true }).then(res => {
						if (!res.success) {
							return Promise.reject();
						}
						this.$message.success('操作成功');
						this.doFetch();
						this.$router.back();
						return Promise.resolve();
					});
				}
			});
		},
		goback() {
			this.$router.back();
		},
		download(record) {
			API_DOWNLPREVIEWTE(API_GETCURRENTENV(record.url)).then(res => {
				comDownload(res, null, record.name);
			});
		},
		constractDetail() {
			this.$router.push({ path: '/center/contract/buy/offline/detail', query: { id: this.data.contractId, type: 'buy' } });
		},
		//查看运单号
		viewWaybill() {
			this.modalInfo = this.data.waybillInfo || {};
			this.$refs.waybillModal.show();
		},
		//查看车号表
		viewCarNumber(record) {
			let data = this.data;
			this.modalInfo =
				data.waybillInfo ||
				Object.assign({}, data, {
					serialNo: record.transTicketNo,
					weight: record.deliverQuantity,
					carNumber: record.trainNo,
					carType: record.trainType,
					departureStation: data.deliveryStation
				});
			this.$refs.carNumberModal.show();
		},
		//船运轨迹
		viewShipTrack(record) {
			let { identifierNo, deliverBatchId, shipName } = record;
			let { coalType, transType } = this.data;
			window.open(
				`/logistics/LogisticsDetailShip?mmsi=${identifierNo}&shipName=${
					shipName || ''
				}&type=historyLocation&deliveryId=${deliverBatchId}&coalType=${coalType}&transType=${transType}`
			);
		},

		//查看火运轨迹
		handleViewTrack() {
			// 查看轨迹
			let waybillId = this.data.waybillId;
			// 联运管家  新数据 火运轨迹
			// 判断是否是神华外购
			API_getRouteInfo({ id: waybillId }).then(res => {
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
						window.open('/logistics/LogisticsDetailTrainNew?waybillId=' + waybillId);
					}
				}
			});
		},
		handlePreview(data) {
			let url = '';
			if (data.response) {
				url = data.response.data.fileUrl;
			}
			if (data.url) {
				url = data.url;
			}
			if (!url) {
				return;
			}
			this.previewImg = url;
			if (this.previewImg.indexOf('.pdf') != -1) {
				window.open(this.previewImg, '_blank');
				return;
			}
			if (
				this.previewImg.indexOf('.doc') > -1 ||
				this.previewImg.indexOf('.docx') > -1 ||
				this.previewImg.indexOf('.xlsx') > -1 ||
				this.previewImg.indexOf('.xls') > -1
			) {
				const jumpUrl = 'https://view.officeapps.live.com/op/view.aspx?src=' + encodeURIComponent(API_GETCURRENTENV(url));
				window.open(jumpUrl, '_blank');
				return;
			}
			if (this.previewImg.indexOf('.rar') > -1 || this.previewImg.indexOf('.zip') > -1) {
				if (data.attachId) {
					API_GetDownloadRAR(data.attachId).then(res => {
						comDownload(res, undefined, data.name);
					});
				} else {
					window.open(this.previewImg, '_blank');
				}
				return;
			}
			this.$refs.viewer.$viewer.show();
		}
	}
};
</script>
<style lang="less" scoped>
.page-title::before {
	background: @primary-color!important;
}
</style>
