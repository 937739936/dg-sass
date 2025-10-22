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
						<a @click.prevent="viewShipTrack(record)">轨迹查询</a>
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
					>
						下载
					</a>
				</template>
			</a-table>
		</a-card>
		<!-- 收货信息确认 -->
		<template v-if="receiveType == 'receive'">
			<a-card
				title="收货信息"
				style="margin-top: 10px"
			>
				<p>
					本批次发运数量:{{ data.deliverQuantity }}吨,累计已收货数量:{{ data.receiveQuantityTotal }}吨,预估剩余可收货数量:{{
						data.receiveQuantityRemain
					}}吨
				</p>

				<a-form
					:form="releaseForm"
					layout="inline"
				>
					<a-row>
						<a-col
							:span="12"
							class="row"
						>
							<a-form-item
								label="收货数量(吨)"
								:colon="false"
							>
								<a-input
									placeholder="收货数量(吨)"
									v-decorator="[
										'receiveQuantity',
										{
											rules: [
												{ required: true, message: '请输入收货数量' },
												{
													pattern: /^\d+(\.\d{0,3})?$/,
													message: '收货数量为数字且不允许为负数，最多三位小数'
												}
											],
											validateTrigger: 'blur'
										}
									]"
								/>
								<span
									slot="extra"
									v-if="receiveQuantityDevMax"
								>
									本次收货数量可能存在偏差，请确认收货数量，如果无误，请忽视该提示
								</span>
							</a-form-item>
						</a-col>
						<a-col
							:span="12"
							class="row"
						>
							<a-form-item
								label="收货日期"
								:colon="false"
							>
								<a-date-picker
									placeholder="收货日期"
									format="YYYY-MM-DD"
									valueFormat="YYYY-MM-DD"
									:disabled-date="disabledDate"
									v-decorator="['receiveDate', { rules: [{ required: true, message: '请输入收货日期' }] }]"
								/>
								<span
									slot="extra"
									v-if="receiveDateDevMax"
									style="display: inline-block; width: 240px"
								>
									收货日期与当前系统日期偏差较大，请确认收货日期是否无误，如果正确，请忽略提示
								</span>
							</a-form-item>
						</a-col>
					</a-row>
				</a-form>
			</a-card>
			<a-card
				title="收货附件(称重凭证必须上传)"
				style="margin-top: 10px"
			>
				<CustomUpload
					:ifEditable="true"
					@uploadFiles="getUploadFiles"
					:fileDataSource="fileInfos"
					:type="'offlineConsig'"
				/>
			</a-card>
			<a-modal
				title="请选择收货方式"
				v-model="receiveConfirmModal"
				@ok="handleOk"
				okText="确定"
				cancelText="取消"
			>
				<a-radio-group v-model="receiveConfirmValue">
					<a-radio value="1">部分收货</a-radio>
					<a-radio value="2">全部收货</a-radio>
				</a-radio-group>
				<div style="padding: 10px 0; color: red">
					<p>注释</p>
					<p>部分收货：指选择的发货批次（非订单）只有部分数量进行了收货，该批次并没有进行全部收货。</p>
					<p>全部收货：指选择的发货批次（非订单）已经全部收货完成。</p>
				</div>
			</a-modal>
			<div style="margin-top: 20px; text-align: center">
				<a-button @click="goback">返回</a-button>
				<a-button
					type="primary"
					style="margin-left: 20px"
					@click="doConfirm"
					>确认</a-button
				>
			</div>
		</template>
		<template v-else>
			<a-card
				title="收货信息"
				style="margin-top: 10px"
			>
				<p>累计已收货数量{{ data.receiveQuantityTotal }}吨</p>
				<a-table
					:bordered="false"
					:columns="columns.receiveRecord"
					:rowKey="record => record.receiveNo"
					:dataSource="data.receiveRecordInfoList"
					:pagination="false"
					:scroll="{ x: false }"
				>
					<template
						slot="action"
						slot-scope="action, record"
					>
						<a
							@click.prevent="lookReceiveRecord(record.receiveAttachmentList)"
							target="_blank"
							>查看附件</a
						>
						<a
							@click.prevent="downloadAll(record)"
							style="padding-left: 10px"
							>下载附件</a
						>
					</template>
				</a-table>
			</a-card>
			<a-card
				title="操作日志"
				style="margin-top: 10px"
			>
				<a-table
					:bordered="false"
					:columns="columns.operationLog"
					:rowKey="record => record.id"
					:dataSource="data.logList"
					:pagination="false"
					:scroll="{ x: false }"
				>
				</a-table>
			</a-card>
			<div style="margin-top: 20px; text-align: center">
				<a-button @click="goback">返回</a-button>
			</div>
		</template>
		<WaybillInfoModal
			ref="waybillModal"
			:modalInfo="modalInfo"
		/>
		<CarNumberTableModal
			ref="carNumberModal"
			:modalInfo="modalInfo"
			:waybillId="data.waybillId"
		/>
		<ReceiveTableModal
			ref="receiveTableModal"
			:dataList="dataList"
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
	getLogisticsReceive,
	getLogisticsDownloadAll,
	API_GETCURRENTENV,
	API_DOWNLPREVIEWTE,
	API_GetDownloadRAR,
	API_getRouteInfo
} from '@/v2/center/trade/api/coal';
import ENV from '@/v2/config/env';
import comDownload from '@sub/utils/comDownload.js';
import WaybillInfoModal from './components/WaybillInfoModal.vue';
import CarNumberTableModal from './components/CarNumberTableModal.vue';
import ReceiveTableModal from './components/ReceiveTableModal.vue';
import CustomUpload from '@/v2/components/CustomUpload';
import moment from 'moment';
export default {
	components: {
		WaybillInfoModal,
		CarNumberTableModal,
		ReceiveTableModal,
		CustomUpload
	},
	data() {
		return {
			batchNo: this.$route.query.batchNo,
			columns,
			dataSource: [],
			data: {},
			API_GETCURRENTENV,
			rejectReason: '',
			modalInfo: {},
			dataList: [],
			receiveType: this.$route.query.type,
			releaseForm: this.$form.createForm(this, {
				onValuesChange: this.onValuesChange
			}),
			receiveDateDevMax: false, //收货日期过小时提示
			receiveQuantityDevMax: false, //收货数量过大时提示
			fileInfos: [], //附件信息
			previewImg: '', //附件预览地址
			receiveConfirmModal: false,
			receiveFrom: {},
			receiveConfirmValue: '' //收货方式
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
		goback() {
			this.$router.back();
		},
		download(record) {
			API_DOWNLPREVIEWTE(API_GETCURRENTENV(record.url)).then(res => {
				comDownload(res, null, record.name);
			});
		},
		constractDetail() {
			this.$router.push({
				path: '/center/contract/buy/offline/detail',
				query: { id: this.data.contractId, type: 'buy' }
			});
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
		//查看收货信息附件
		lookReceiveRecord(data) {
			this.dataList = data;
			this.$refs.receiveTableModal.show();
		},

		disabledDate(current) {
			// 收货日期大于等于该批次的发货日期且小于等于当天日期
			// Can not select days before today and today
			return current && (current <= moment(this.data.deliverDate) || current > moment().endOf('day'));
		},
		onValuesChange(props, values) {
			//收货日期变化
			if (values.hasOwnProperty('receiveDate')) {
				//当选择收货日期日期与当前系统日期偏差大于30天时，提示
				if (Math.abs(moment(values.receiveDate).diff(moment(), 'days')) > 30) {
					this.receiveDateDevMax = true;
				} else {
					this.receiveDateDevMax = false;
				}
			}
			//收货数量
			if (values.hasOwnProperty('receiveQuantity')) {
				//当选择收货日期日期与当前系统日期偏差大于30天时，提示
				if (Number(values.receiveQuantity) > Number(this.data.receiveQuantityRemain) * 1.2) {
					this.receiveQuantityDevMax = true;
				} else {
					this.receiveQuantityDevMax = false;
				}
			}
		},
		getUploadFiles(data) {
			this.fileInfos = data;
		},
		//收货确认
		doConfirm() {
			this.validateFileType();
			this.releaseForm.validateFieldsAndScroll((err, value) => {
				if (!err) {
					this.receiveFrom = { ...value };
					if (this.validateFileType()) {
						this.receiveConfirmModal = true;
					}
				}
			});
		},
		//提交
		handleOk() {
			if (this.receiveConfirmValue == '') {
				this.$message.error('请选择收货方式');
				return;
			} else {
				if (this.receiveConfirmValue == '2') {
					//全部收货
					// 校验发货量
					//发货数量*80%“＜累计收货数量”（包含本次收货数量）＜发货数量*120%；如果不在该区间，则提示：该批次的收货数量与发运数量偏差较大，可能存在问题，如果您确认无误，请忽略该提示。
					let receiveQuantityTotal = Number(this.receiveFrom.receiveQuantity) + Number(this.data.receiveQuantityTotal);
					if (
						receiveQuantityTotal <= Number(this.data.deliverQuantity) * 0.8 ||
						receiveQuantityTotal >= Number(this.data.deliverQuantity) * 1.2
					) {
						this.$confirm({
							centered: true,
							title: '提示',
							content: '该批次的收货数量与发运数量偏差较大，可能存在问题，如果您确认无误，请忽略该提示。',
							okText: '确定',
							cancelText: '取消',
							onOk: () => {
								this.postReceive();
							},
							onCancel() {}
						});
					} else {
						this.postReceive();
					}
				} else {
					//部分收货
					this.postReceive();
				}
			}
		},
		postReceive() {
			let allReceive = this.receiveConfirmValue == '2';
			let receiveFrom = {
				...this.receiveFrom,
				batchNo: this.batchNo,
				allReceive: allReceive,
				fileInfoList: this.fileInfos
			};
			getLogisticsReceive(receiveFrom).then(res => {
				if (res.success) {
					this.$message.success('收货成功').then(() => this.$router.go(-1));
				}
			});
		},
		//附件验证
		validateFileType() {
			let typeArr = this.fileInfos.map(item => {
				return item.type;
			});
			typeArr = [...new Set(typeArr)];
			//CZPZ称重凭证（必填）、4化验凭证（非必填）、0其他凭证（非必填）
			if (!typeArr.includes('CZPZ')) {
				this.$message.error('请上传收货对应的称重凭证附件');
				return false;
			} else {
				return true;
			}
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
		//收货信息下载附件
		downloadAll(record) {
			this.$confirm({
				centered: true,
				title: '确认下载附件吗?',
				okText: '确定',
				cancelText: '取消',
				onOk() {
					getLogisticsDownloadAll(record.receiveNo).then(res => {
						if (record.receiveAttachmentList.length > 1) {
							comDownload(res, undefined, record.receiveNo + '.zip');
						} else {
							comDownload(res, undefined, record.receiveAttachmentList[0].name);
						}
					});
				},
				onCancel() {}
			});
		},
		//查看附件
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
::v-deep .ant-form-extra {
	width: 240px;
}
.page-title::before {
	background: @primary-color!important;
}
</style>
