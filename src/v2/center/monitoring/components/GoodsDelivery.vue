`
<template>
	<div>
		<p
			class="mb8"
			v-if="goodsDeliveryStatistics.remark"
		>
			{{ goodsDeliveryStatistics.remark }}
		</p>
		<div class="mb8">
			<span class="mr16">合同数量：{{ goodsDeliveryStatistics.contractQuantity }}吨</span>
			<span class="mr16">已发货：{{ goodsDeliveryStatistics.deliverQuantity }}吨</span>
			<span class="mr16">已收货：{{ goodsDeliveryStatistics.receiveQuantity }}吨</span>
			<!-- <span class="mr16">待收货：{{ goodsDeliveryStatistics.unReceiveQuantity }}吨</span> -->
		</div>
		<a-table
			:pagination="false"
			:columns="deliveryColumns"
			:data-source="deliveryList"
			:scroll="{ x: true }"
			:rowKey="record => record.id + record.batchNo"
		>
			<template
				slot="action"
				slot-scope="record"
			>
				<a-space>
					<a @click="jumpPage(record)">查看</a>
					<a
						v-if="record.deliverAttachmentInfo && record.deliverAttachmentInfo.length > 0"
						@click="getDeliveryFiles(record)"
						>附件</a
					>
					<!-- 只有船运、火运 -->
					<!-- 当为火运时，补录只有是联运管家返回数据才展示 -->
					<!-- 业务类型为非其他时展示轨迹 -->
					<a
						v-if="
							(record.transType == '船运' ||
								(record.despatchType == 'TRAIN' && (businessLineType !== 'OFFLINE' || record.waybillId))) &&
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
			:pagination="pagination"
			@change="getGoodsDeliveryList"
		/>

		<!-- 货物运输--附件表格弹窗 -->
		<a-modal
			centered
			title="货物运输附件列表"
			class="deliveryAttachmentModal"
			:visible="deliveryAttachmentModalVisible"
			@cancel="
				() => {
					deliveryAttachmentModalVisible = false;
				}
			"
			width="60%"
			:footer="null"
		>
			<a-table
				:columns="deliveryAttachmentColumns"
				:data-source="deliveryAttachmentInfo"
				:scroll="{ x: true }"
				rowKey="id"
			>
				<div
					slot="action"
					slot-scope="action, items"
				>
					<a
						style="display: inline-block; margin-right: 8px"
						@click="viewAttachments(items)"
						>附件</a
					>
				</div>
			</a-table>
		</a-modal>
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
		<!-- 货物运输附件、货物结算附件展示弹窗 -->
		<!-- <div class="modal-wrap"> -->
		<a-modal
			title="附件信息"
			centered
			v-model="modalFileWrapIsShow"
			cancelText="取消"
			@cancel="modalCancel"
		>
			<template slot="footer">
				<a-button
					key="submit"
					@click="modalCancel"
				>
					取消
				</a-button>
			</template>
			<a-form
				:form="modalFileForm"
				:label-col="{ span: 6 }"
				:wrapper-col="{ span: 18 }"
			>
				<a-row class="row">
					<a-col :span="24">
						<a-form-item
							label="附件类型"
							:colon="false"
						>
							<a-select
								style="width: 200px"
								placeholder="请选择"
								labelInValue
								disabled
								v-decorator="['fileType', { rules: [{ required: true, message: '请选择附件类型' }] }]"
							>
								<a-select-option
									:value="item.typeName"
									disabled
									:key="index"
									v-for="(item, index) in fileData"
									>{{ item.typeName }}</a-select-option
								>
							</a-select>
						</a-form-item>
					</a-col>
				</a-row>
				<a-row class="row">
					<a-col :span="24">
						<a-form-item
							label="附件"
							:colon="false"
							v-decorator="['uploadFiles', { rules: [{ required: true, message: '请选择附件' }] }]"
						>
							<a-button
								type="link"
								@click="handlePreview(item)"
								v-for="(item, index) in fileList"
								:key="index"
								style="width: 100%;white-space: wrap;text-align:left;"
								>{{ fileList[0] && fileList[0].fileName }}</a-button
							>
						</a-form-item>
					</a-col>
				</a-row>
			</a-form>
		</a-modal>
		<image-viewer ref="imageViewer" />
	</div>
</template>
<script>
import {
	API_BusinessMonitoringUpstreamDeliverBatchStatistics,
	API_BusinessMonitoringUpstreamDeliverBatchList,
	API_BusinessMonitoringDownstreamDeliverBatchStatistics,
	API_BusinessMonitoringDownstreamDeliverBatchList,
	API_FullBusinessLineDetailDeliverBatchStatistics,
	API_FullBusinessLineDetailDeliverBatchList,
	API_GETTRAINRECORD,
	API_getRouteInfo
} from '@/v2/center/monitoring/api';
import { filterCodeByValueName } from '@sub/utils/globalCode.js';
import iPagination from '@sub/components/iPagination';
import ThirdFinShipInfo from './LogisticsDetailShipInfo';
import { mapGetters } from 'vuex';
import ImageViewer from '@/v2/components/imageViewer.vue';
import { filePreview } from '@/v2/utils/file';

const deliveryColumns = [
	{ title: '批次号', dataIndex: 'batchNo', key: 'batchNo' },
	{ title: '发货日期', dataIndex: 'deliverDate', key: 'deliverDate' },
	{
		title: '运输方式',
		dataIndex: 'despatchType',
		key: 'despatchType',
		customRender: text => {
			return filterCodeByValueName(text, 'despatchTypeDict') || text;
		}
	},
	{
		title: '发货数量(吨)',
		dataIndex: 'deliverQuantity',
		key: 'deliverQuantity'
	},
	{
		title: '收货数量(吨)',
		dataIndex: 'receiveQuantity',
		key: 'receiveQuantity'
	},
	{ title: '发货地', dataIndex: 'deliverPlace', key: 'deliverPlace' },
	{ title: '收货地', dataIndex: 'receivePlace', key: 'receivePlace' },
	{
		title: '状态',
		dataIndex: 'statusDesc',
		key: 'statusDesc'
	},
	{
		title: '操作',
		key: 'action',
		fixed: 'right',
		scopedSlots: { customRender: 'action' },
		width: 180
	}
];
const deliveryAttachmentColumns = [
	{ title: '单据类型', dataIndex: 'typeName', key: 'typeName' },
	{
		title: '操作',
		key: 'action',
		fixed: 'right',
		scopedSlots: { customRender: 'action' }
	}
];

export default {
	name: 'GoodsDelivery',
	components: {
		iPagination,
		ThirdFinShipInfo,
		ImageViewer
	},
	props: {
		// 上游当前选中的合同
		curUpstream: {
			type: [Object, String],
			default: ''
		},
		contractType: {
			type: [Number, String],
			default: 0
		},
		// 下游合同编号
		downOrderNo: {
			type: String,
			default: ''
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
			deliveryAttachmentColumns,
			filterCodeByValueName,
			businessLineType: this.$route.query.businessLineType,
			params: {},
			shipModalVisible: false,
			deliveryAttachmentModalVisible: false,
			modalFileWrapIsShow: false,
			previewVisible: false,
			isNeedRotate: true,
			modalFileForm: this.$form.createForm(this),
			batchNo: '', // 发货批次号
			fileList: [],
			fileData: [],
			deliveryAttachmentInfo: [],
			previewImage: '',
			deliveryList: [],
			fileDataSource: [],
			pagination: {
				total: 0,
				pageNo: 1
			},
			goodsDeliveryStatistics: {}
		};
	},
	watch: {
		fileDataSource: {
			immediate: true,
			handler(data) {
				if (!data) {
					return;
				}
				const fileData = [];
				let key = 1;
				const fileList = [];
				if (data.url) {
					data.url.split(',').forEach(it => {
						fileList.push({
							uid: key++,
							name: it,
							status: 'done',
							url: it,
							fileName: data.name
						});
					});
				}
				fileData.push({
					key: data.type,
					type: data.type,
					typeName: data.typeName,
					uploadFiles: {
						fileList
					}
				});
				this.fileData = fileData;
				this.$nextTick(() => {
					this.modalFileForm.setFieldsValue({
						fileType: { key: fileData[0].key, label: fileData[0].typeName },
						uploadFiles: fileData[0].uploadFiles
					});
				});
				this.fileList = fileData[0].uploadFiles.fileList;
			}
		},
		curUpstream() {
			this.businessLineType = this.$route.query.businessLineType;
			this.getGoodsDelivery();
		},
		downOrderNo() {
			this.businessLineType = this.$route.query.businessLineType;
			this.getGoodsDelivery();
		},
		orderNo() {
			this.businessLineType = this.$route.query.businessLineType;
			this.getGoodsDelivery();
		}
	},
	created() {
		this.businessLineType = this.$route.query.businessLineType;
		this.getGoodsDelivery();
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_TOKEN: 'VUEX_ST_TOKEN'
		}),
		headers() {
			return {
				Authorization: this.VUEX_ST_TOKEN,
				Source: 'PC'
			};
		}
	},
	methods: {
		getGoodsDelivery() {
			// if (!this.curUpstream || !this.downOrderNo) {
			//   return;
			// }
			const params = {
				upOrderNo: this.curUpstream.upOrderNo || '',
				downOrderNo: this.downOrderNo || '',
				businessLineType: this.businessLineType,
				orderNo: this.orderNo,
				contractNo: this.contractNo
			};
			this.getGoodsDeliveryList();
			this.getGoodsDeliveryStatistics(params);
		},
		// 获取收发货信息
		getGoodsDeliveryList() {
			const params = {
				orderNo: this.orderNo,
				upOrderNo: this.curUpstream.upOrderNo || '',
				downOrderNo: this.downOrderNo || '',
				businessLineType: this.businessLineType,
				contractNo: this.contractNo
			};
			const fct = [
				API_BusinessMonitoringUpstreamDeliverBatchList,
				API_BusinessMonitoringDownstreamDeliverBatchList,
				API_FullBusinessLineDetailDeliverBatchList
			][this.contractType];
			fct(params).then(res => {
				if (res.success) {
					this.deliveryList = res.data.records;
					this.pagination.total = res.data.total;
				}
			});
		},
		// 获取收发货信息统计数据
		getGoodsDeliveryStatistics(params) {
			const fct = [
				API_BusinessMonitoringUpstreamDeliverBatchStatistics,
				API_BusinessMonitoringDownstreamDeliverBatchStatistics,
				API_FullBusinessLineDetailDeliverBatchStatistics
			][this.contractType];
			fct(params).then(res => {
				if (res.success) {
					this.goodsDeliveryStatistics = res.data;
				}
			});
		},

		getDeliveryFiles(items) {
			this.deliveryAttachmentInfo = items.deliverAttachmentInfo;
			this.deliveryAttachmentModalVisible = true;
		},

		// 货物运输附件查看--start
		viewAttachments(items) {
			// 货物运输附件查看
			this.modalFileWrapIsShow = true;
			this.fileDataSource = items;
		},

		closePreviewModal() {
			this.previewVisible = false;
			this.ele = null;
		},

		handlePreviewCancel() {
			this.previewVisible = false;
		},

		modalCancel() {
			// 货物运输附件查看弹窗关闭
			this.fileList = [];
			this.fileDataSource = '';
			this.modalFileWrapIsShow = false;
			this.modalFileForm.resetFields();
		},

		handlePreview(file) {
			filePreview(file.url, this.$refs.imageViewer.show);
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
		jumpPage(record) {
			if (['OFFLINE', 'UP'].includes(this.businessLineType)) {
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
		}
	}
};
</script>
<style lang="less" scoped></style>
