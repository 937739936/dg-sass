<template>
	<div class="slMain">
		<Breadcrumb />
		<a-card
			:bordered="false"
			class="content"
		>
			<div class="methods-wrap">
				<span
					slot="title"
					class="slTitle"
					>巡库详情
				</span>
			</div>
			<a-spin :spinning="baseInfoLoading">
				<div
					v-if="!baseDetailInfo"
					style="height: 300px"
				></div>
				<div v-else>
					<ul class="grid-wrap">
						<li>
							<span class="label">仓库名称</span>
							<span>{{ baseDetailInfo.stationVO.name || '-' }}</span>
						</li>
						<li>
							<span class="label">巡库时间</span>
							<span>{{ baseDetailInfo.supervisorTime || '-' }}</span>
						</li>
						<li>
							<span class="label">货主</span>
							<span>{{ baseDetailInfo.goodsCompanyName || '-' }}</span>
						</li>
						<li>
							<span class="label">巡库人员</span>
							<span>{{ baseDetailInfo.supervisorUserName || '-' }}</span>
						</li>
						<li>
							<span class="label">巡库结果</span>
							<span :class="baseDetailInfo.supervisorReportResultStatus == 'EXCEPTION' ? 'abnormalText' : ''">
								{{ baseDetailInfo.supervisorReportResultStatusDesc || '-' }}</span
							>
						</li>
						<li>
							<span class="label">处理状态</span>
							<span :class="baseDetailInfo.supervisorResultProcessStatus == 'UNSOLVED' ? 'abnormalText' : ''">{{
								baseDetailInfo.supervisorResultProcessStatusDesc || '-'
							}}</span>
						</li>
						<li style="width: 99.9%">
							<span class="label">巡库定位</span>
							<div
								v-if="baseDetailInfo.supervisorLocationAddress"
								class="location"
							>
								<div
									class="address"
									@click="showLocationModal"
								>
									{{ baseDetailInfo.supervisorLocationAddress }}
								</div>
								<div class="location-status">
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
							<span class="label">仓库门头照片</span>
							<span>
								<div
									v-if="baseDetailInfo.warehouseDoorUrl"
									class="warehouseDoor"
								>
									<img
										:src="baseDetailInfo.warehouseDoorUrl"
										alt=""
										class="warehouseDoor-image"
										v-viewer
									/>
								</div>
								<div v-else>-</div>
							</span>
						</li>
					</ul>
					<InspectGoodsInfoView :detailInfo="baseDetailInfo" />
					<InspectQuantityInfoView :detailInfo="baseDetailInfo" />
				</div>
			</a-spin>
		</a-card>
		<InspectLocationModal ref="inspectLocationModal" />
	</div>
</template>

<script>
import Breadcrumb from '@/v2/components/breadcrumb/index';
import { getInspectRecordsDetailByTime } from '@/v2/center/logisticsPlatform/api';
import InspectGoodsInfoView from './components/InspectGoodsInfoView';
import InspectLocationModal from './components/InspectLocationModal';
import InspectQuantityInfoView from './components/InspectQuantityInfoView';
export default {
	components: {
		Breadcrumb,
		InspectGoodsInfoView,
		InspectQuantityInfoView,
		InspectLocationModal
	},
	data() {
		let { id } = this.$route.query;
		return {
			id, // 记录id
			baseInfoLoading: false, // 基础信息loading
			baseDetailInfo: undefined // 详情
		};
	},
	mounted() {
		this.getBaseDetailInfo();
	},
	methods: {
		getBaseDetailInfo() {
			// 获取基础信息
			this.baseInfoLoading = true;
			getInspectRecordsDetailByTime({ id: this.id })
				.then(res => {
					if (!res.success) {
						return;
					}
					this.baseDetailInfo = res.data || {};
				})
				.catch(() => {})
				.finally(() => {
					this.baseInfoLoading = false;
				});
		},
		showLocationModal() {
			this.$refs.inspectLocationModal.show(this.baseDetailInfo);
		}
	}
};
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
	background: #ffffff;
	padding: 16px 0;
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
			width: 52px;
			height: 28px;
			cursor: pointer;
		}
		.warehouseDoor-image {
			width: 52px;
			height: 28px;
			border-radius: 4px;
			object-fit: cover;
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
