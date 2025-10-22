<template>
	<div class="slMain">
		<a-card :bordered="false">
			<div class="methods-wrap">
				<span
					slot="title"
					class="slTitle"
					>质检详情</span
				>
				<!-- <div>
            <a-button type="primary" @click="openReportPDF()">查看报告</a-button>
          </div> -->
			</div>

			<a-spin :spinning="baseInfoLoading">
				<div
					class="slTitleAssis"
					style="margin: 30px 0"
				>
					货权信息
				</div>

				<ul class="grid-wrap">
					<li style="width: 33.3%">
						<span class="label">仓库名称</span>
						<span>{{ baseDetailInfo.stationName || '-' }}</span>
					</li>
					<li style="width: 66.6%">
						<span class="label">货主名称</span>
						<span>{{ baseDetailInfo.comoanyName || '-' }}</span>
					</li>
				</ul>

				<div
					class="slTitleAssis"
					style="margin: 30px 0"
				>
					任务概况
				</div>

				<ul class="grid-wrap">
					<li>
						<span class="label">质检人员</span>
						<span>{{ baseDetailInfo.createdName || '-' }}</span>
					</li>
					<li>
						<span class="label">创建时间</span>
						<span>{{ baseDetailInfo.createDate || '-' }}</span>
					</li>
					<li>
						<span class="label">送检时间</span>
						<span>{{ baseDetailInfo.submissionDate || '-' }}</span>
					</li>
					<li style="width: 99.9%">
						<span class="label">完成时间</span>
						<span>{{ baseDetailInfo.completeDate || '-' }}</span>
					</li>
					<li style="width: 99.9%">
						<span class="label">取样定位</span>
						<div
							v-if="baseDetailInfo.samplingLocationAddress"
							class="location"
						>
							<div
								class="address"
								@click="showSampleLocaton"
							>
								{{ baseDetailInfo.samplingLocationAddress }}
							</div>
							<div
								class="location-status"
								v-if="baseDetailInfo.inside"
							>
								<img
									class="address-ok"
									src="@/v2/assets/imgs/logisticsPlatform/indicator_normal.png"
									alt=""
								/>
								<div class="address-status-text">已处于站台围栏内</div>
							</div>
						</div>
						<span v-else>-</span>
					</li>

					<li style="width: 99.9%">
						<span class="label">送检定位</span>
						<div
							v-if="baseDetailInfo.submissionLocationAddress"
							class="location"
						>
							<div
								class="address"
								@click="showLocationModal"
							>
								{{ baseDetailInfo.submissionLocationAddress }}
							</div>
						</div>
						<span v-else>-</span>
					</li>
				</ul>
				<BaseInfoDescriptions
					v-if="baseDetailInfo.contractInfo"
					:title="'合同信息'"
					:dataSource="contractInfoDesItems"
					bordered
				/>
				<div
					class="table-box"
					v-if="inStorageData.length > 0"
				>
					<div
						class="slTitleAssis"
						style="margin: 30px 0"
					>
						入库信息
					</div>
					<a-table
						:columns="inStorageColumns"
						class="new-table"
						:bordered="false"
						rowKey="inStorageId"
						:dataSource="inStorageData"
						:pagination="false"
						:loading="false"
						:scroll="{ x: true }"
					>
						<template
							slot="inStorageNo"
							slot-scope="text, record"
						>
							<a @click="goInStorageDetail(record)">{{ text }}</a>
						</template>
					</a-table>
				</div>
				<BaseInfoDescriptions
					v-if="baseDetailInfo.blendingCoalInfo"
					:title="'配煤信息'"
					:dataSource="blendingCoalInfoDesItems"
					bordered
				/>

				<div
					class="slTitleAssis"
					style="margin: 30px 0"
				>
					样品信息
				</div>

				<ul class="grid-wrap">
					<li>
						<span class="label">样品名称</span>
						<span>{{ baseDetailInfo.sampleName || '-' }}</span>
					</li>
					<li>
						<span class="label">品名</span>
						<span>{{ baseDetailInfo.goodsName || '-' }}</span>
					</li>
					<li>
						<span class="label">质检场景</span>
						<span>{{ baseDetailInfo.inspectionSceneDesc || '-' }}</span>
					</li>
					<li>
						<span class="label">样品照片</span>
						<span>
							<div
								v-if="sampleImages.length > 0"
								class="warehouseDoor"
							>
								<div
									v-for="item in sampleImages"
									:key="item"
								>
									<img
										:src="item"
										alt=""
										class="warehouseDoor-image"
										v-viewer
									/>
								</div>
							</div>
							<div v-else>-</div>
						</span>
					</li>
					<li>
						<span class="label">送检照片</span>
						<span>
							<div
								v-if="inspectUrl"
								class="warehouseDoor"
							>
								<div>
									<img
										:src="inspectUrl"
										alt=""
										class="warehouseDoor-image"
										v-viewer
									/>
								</div>
							</div>
							<div v-else>-</div>
						</span>
					</li>

					<li>
						<span class="label">化验报告</span>
						<span>
							<div
								v-if="reportPdfUrl"
								class="warehouseDoor"
							>
								<div>
									<a @click.stop="openReportPDF()">{{ getReportUrlShowName() }}</a>
								</div>
							</div>
							<div v-else>-</div>
						</span>
					</li>
				</ul>

				<!-- <InspectQuantityInfoView :detailInfo="baseDetailInfo" /> -->
			</a-spin>
			<div class="bottom-btn-box">
				<div class="btn-wrap">
					<a-button
						@click="$router.back()"
						type="primary"
						ghost
						>返回</a-button
					>
				</div>
			</div>
		</a-card>
		<QualityInspectLocationModal ref="inspectLocationModal" />
	</div>
</template>

<script>
import Breadcrumb from '@/v2/components/breadcrumb/index';
import QualityInspectLocationModal from './components/QualityInspectLocationModal';
import BaseInfoDescriptions from '@sub/components/base/BaseInfoDescriptions';
import { getTaskDetail } from '../../api';
import { on } from 'stylus/lib/renderer';
export default {
	components: {
		Breadcrumb,
		QualityInspectLocationModal,
		BaseInfoDescriptions
	},
	data() {
		let { id } = this.$route.query;
		return {
			id, // 记录id
			baseInfoLoading: false, // 基础信息loading
			baseDetailInfo: {}, // 详情
			reportPdfUrl: '',
			reportName: '',
			sampleImages: [],
			inspectUrl: '',
			inStorageColumns: inStorageColumns // 入库信息表格列
		};
	},
	mounted() {
		this.getBaseDetailInfo();
	},
	computed: {
		// 入库信息表格数据
		inStorageData() {
			let data = this.baseDetailInfo.inStorageInfo || [];
			return data;
		},
		// 合同信息描述项
		contractInfoDesItems() {
			let contractInfo = this.baseDetailInfo.contractInfo ?? {};
			let items = [
				{
					label: '合同编号',
					value: contractInfo.contractNo || '-',
					click: () => {
						this.goContractDetail(contractInfo);
					}
				},
				{
					label: '卖方企业',
					value: contractInfo.sellerName || '-'
				},
				{
					label: '运输方式',
					value: contractInfo.transportModeDesc || '-'
				},
				{
					label: '签订日期',
					value: contractInfo.signDate || '-'
				},
				{
					label: '交货期限',
					value: `${contractInfo.deliveryStartDate}至${contractInfo.deliveryEndDate}`
				}
			];
			return items;
		},
		blendingCoalInfoDesItems() {
			let blendingCoalInfo = this.baseDetailInfo.blendingCoalInfo ?? {};
			let items = [
				{
					label: '配煤编号',
					value: blendingCoalInfo.serialNo || '-',
					click: () => {
						this.goCoalBlendingDetail(blendingCoalInfo);
					}
				},
				{
					label: '业务线',
					value: blendingCoalInfo?.businessLine?.businessLineName || '-',
					click: () => {
						this.goBusinessLineDetail(blendingCoalInfo.businessLine);
					}
				},
				{
					label: '配煤日期',
					value: blendingCoalInfo.blendingCoalDate || '-'
				},
				{
					label: '配煤类型',
					value: blendingCoalInfo.blendingCoalTypeDesc || '-'
				},
				{
					label: '出煤品名',
					value: blendingCoalInfo.goodsName || '-'
				},
				{
					label: '出煤总量(吨)',
					value: blendingCoalInfo.coalTotalQuantity || '-'
				}
			];
			return items;
		}
	},
	methods: {
		getReportUrlShowName() {
			if (!this.reportName) return '-';
			const pdfRegex = /^(.+)\.(pdf|PDF)$/;
			const imageRegex = /^(.+)\.(jpg|jpeg|png|gif|bmp|JPG|JPEG|PNG|GIF|BMP)$/;
			if (pdfRegex.test(this.reportName)) {
				return '化验报告.pdf';
			} else {
				return '化验报告.png';
			}
		},
		openReportPDF() {
			// 查看报告
			window.open(this.reportPdfUrl, '_blank');
		},
		getBaseDetailInfo() {
			// 获取基础信息
			this.baseInfoLoading = true;
			getTaskDetail({ id: this.id })
				.then(res => {
					if (!res.success) {
						return;
					}
					this.baseDetailInfo = res.data || {};
					this.baseDetailInfo.attachmentList.forEach(element => {
						if (element.attachmentType == 'SAMPLE_PHOTOS') {
							this.sampleImages.push(element.path);
						} else if (element.attachmentType == 'SUBMISSION_PHOTOS') {
							this.inspectUrl = element.path;
						} else {
							this.reportPdfUrl = element.path;
							this.reportName = element.name;
						}
					});
				})
				.catch(() => {})
				.finally(() => {
					this.baseInfoLoading = false;
				});
		},
		showSampleLocaton() {
			this.$refs.inspectLocationModal.show(this.baseDetailInfo, '取样定位');
		},
		showLocationModal() {
			this.$refs.inspectLocationModal.show(this.baseDetailInfo, '送检定位');
		},
		// 去往入库详情
		goInStorageDetail(item) {
			//  window.open(`/center/logisticsPlatform/in/detail?id=${item.inStorageId}`)
			this.openNewWindowTabPage(`/center/logisticsPlatform/in/detail`, { id: item.inStorageId });
		},
		// 去往合同
		goContractDetail(contractInfo) {
			let id = contractInfo.orderContractId;
			let contractType = contractInfo.contractType;
			let contractDetailPath = '';
			switch (contractType) {
				case 'ONLINE':
					contractDetailPath = '/center/contract/buy/online/detail';
					break;
				case 'OFFLINE':
					contractDetailPath = '/center/contract/buy/offline/detail';
					break;
				case 'TRANSPORT':
					contractDetailPath = '/center/contract/buy/transport/detail';
					break;
			}
			this.openNewWindowTabPage(contractDetailPath, {
				id: id,
				type: 'BUY'
			});
		},
		// 去往配煤详情
		goCoalBlendingDetail(blendingCoalInfo) {
			this.openNewWindowTabPage('/center/logisticsPlatform/coalBlending/detail', {
				id: blendingCoalInfo.id
			});
		},
		// 去往业务线详情
		goBusinessLineDetail(businessLine) {
			this.openNewWindowTabPage('/center/businessline/detail', {
				businessLineNo: businessLine.businessLineNo
				// upOrderNo: businessLine.upOrderNo,
				// downOrderNo: businessLine.downOrderNo,
				// businessLineType: businessLine.businessLineType
			});
		},
		openNewWindowTabPage(path, query) {
			const { href } = this.$router.resolve({
				path: path,
				query: {
					...query
				}
			});
			window.open(href, '_blank');
		}
	}
};

// 数据为空时，显示的表头
const customRender = text => text || '-';
const inStorageColumns = [
	{
		title: '入库编号',
		dataIndex: 'inStorageNo',
		scopedSlots: { customRender: 'inStorageNo' }, // 自定义序号列内容渲染
		width: '20%'
	},
	{
		title: '入库日期',
		dataIndex: 'inStorageDate',
		width: '20%',
		customRender
	},
	{
		title: '品名',
		dataIndex: 'goodsName',
		width: '20%',
		customRender
	},
	{
		title: '入库车数',
		dataIndex: 'carNumber',
		width: '20%',
		customRender
	},
	{
		title: '入库数链(吨)',
		dataIndex: 'weight',
		width: '20%',
		customRender
	}
];
</script>

<style lang="less" scoped>
/deep/ .ant-descriptions-bordered .ant-descriptions-item-label {
	background-color: #f3f5f6;
	color: #77889d;
}

/deep/ .ant-descriptions-item-content {
	color: rgba(0, 0, 0, 0.8);
}

.slMain {
	.empty-tab {
		display: flex;
		flex: 1;
		height: calc(100vh - 350px);
	}
	.abnormalText {
		color: #dd4444;
	}
}
.bottom-btn-box {
	margin-top: 20px;
	background: #ffffff;
	padding: 16px 0px 0;
	border-top: 1px solid #e5e6eb;
}
.bottom-btn-box .btn-wrap {
	margin: 0;
}

.grid-wrap {
	margin-top: 30px;
	width: 100%;
	border-radius: 3px;
	height: auto;
	overflow: hidden;
	border-left: 1px solid #e5e6eb;
	li {
		width: 33.3%;
		height: 48px;
		float: left;
		border-bottom: 1px solid #e5e6eb;
		border-right: 1px solid #e5e6eb;
		overflow: hidden;
		position: relative;
		span {
			display: inline-block;
			height: 48px;
			line-height: 48px;
			padding: 0 12px;
			color: rgba(0, 0, 0, 0.8);
		}
		& > span:first-child {
			border-right: 1px solid #e5e6eb;
		}
		.label {
			width: 160px;
			background: #f3f5f6;
			font-family:
				PingFangSC-Regular,
				PingFang SC;
			font-weight: 400;
			color: #77889d;
			position: absolute;
			left: 0;
			top: 0;
		}
		span:last-child {
			width: 100%;
			padding-left: 172px;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
		.location {
			height: 48px;
			padding-left: 172px;
			display: flex;
			align-items: center;
			.address {
				color: @primary-color;
				cursor: pointer;
			}
			.location-status {
				display: flex;
				flex-direction: row;
				align-items: center;
				height: 22px;
				padding: 0 8px;
				margin-left: 10px;
				background: #dff9de;
				border-radius: 4px;
				.address-ok {
					width: 12px;
					height: 12px;
				}
				.address-status-text {
					margin-left: 8px;
					color: #45c041;
				}
			}
		}
		.warehouseDoor {
			// width: 52px;
			// height: 28px;
			cursor: pointer;
			display: flex;
			flex-direction: row;
			align-items: center;
			// justify-content: center;
		}
		.warehouseDoor-image {
			width: 52px;
			height: 28px;
			border-radius: 4px;
			object-fit: cover;
			margin-right: 10px;
		}
	}
	li:nth-child(1),
	li:nth-child(2),
	li:nth-child(3) {
		border-top: 1px solid #e5e6eb;
	}
	li:nth-child(3) {
		border-radius: 0 3px 0 0;
	}
	li:last-child {
		border-radius: 0 0 3px 0;
	}
	li.special {
		border-radius: 0 3px 3px 0;
	}
}
</style>

<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
