<template>
	<div class="tab-content">
		<a-spin :spinning="loading">
			<div
				v-if="hasData == false"
				class="empty-view"
			>
				<a-empty :image="emptyImage" />
			</div>
			<div v-else>
				<ul class="grid-wrap">
					<li>
						<span class="label">巡库人员</span>
						<span> {{ detailInfo.supervisorUserName }} </span>
					</li>
					<li>
						<span class="label">巡库时间</span>
						<span> {{ detailInfo.supervisorTime }}</span>
					</li>
					<li>
						<span class="label">巡库定位</span>
						<a-tooltip>
							<template
								v-if="detailInfo.supervisorLocationAddress != null"
								slot="title"
							>
								<span> {{ detailInfo.supervisorLocationAddress }} </span>
							</template>
							<span>
								{{ detailInfo.supervisorLocationAddress }}
							</span>
						</a-tooltip>
					</li>
					<li>
						<span class="label">巡库结果</span>
						<span :class="detailInfo.supervisorReportResultStatus == 'EXCEPTION' ? 'abnormalText' : ''">
							{{ detailInfo.supervisorReportResultStatusDesc }}</span
						>
					</li>
					<li>
						<span class="label">巡库建议</span>
						<a-tooltip>
							<template
								v-if="detailInfo.supervisorSuggest != null"
								slot="title"
							>
								<span> {{ detailInfo.supervisorSuggest }} </span>
							</template>
							<span> {{ detailInfo.supervisorSuggest == null ? '-' : detailInfo.supervisorSuggest }} </span>
						</a-tooltip>
					</li>
					<li>
						<span class="label">异常处理备注</span>
						<a-tooltip>
							<template
								v-if="detailInfo.supervisorResultExceptionRemark != null"
								slot="title"
							>
								<span> {{ detailInfo.supervisorResultExceptionRemark }} </span>
							</template>
							<span v-if="detailInfo.supervisorResultExceptionRemark == null">-</span>
							<span
								v-else
								class="abnormalText"
							>
								{{ detailInfo.supervisorResultExceptionRemark }}</span
							>
						</a-tooltip>
					</li>
				</ul>
				<div
					class="slTitleAssis"
					style="margin: 30px 0"
				>
					货物信息
				</div>
				<div
					class="goods-item"
					v-for="goodsDetail in goodsDetailList"
					:key="goodsDetail.warehouseName"
				>
					<a-row
						class="store-room-name"
						:gutter="[10, 0]"
						type="flex"
					>
						<a-col>
							<img
								class="room-icon"
								src="@/v2/assets/imgs/logisticsPlatform/storeroom_icon.png"
								alt=""
							/>
						</a-col>
						<a-col flex="1">{{ goodsDetail.warehouseName }}</a-col>
					</a-row>
					<a-row
						type="flex"
						class="goods-inspect-content"
					>
						<a-col flex="1">
							<div class="goods-inspect-info">
								<a-row
									:gutter="[0, 16]"
									type="flex"
								>
									<a-col
										v-for="indicator in goodsDetail.goodsIndicatorList"
										:key="indicator.description"
										:span="24"
									>
										<a-row type="flex">
											<a-col
												flex="1"
												:class="indicator.normal ? 'goods-indicator-title' : 'goods-indicator-error'"
											>
												{{ indicator.description }}
											</a-col>
											<a-col>
												<a-row
													type="flex"
													:class="indicator.normal ? 'goods-indicator-value' : 'goods-indicator-error'"
													style="align-items: center; margin-left: 20px"
												>
													<a-col>
														{{ indicator.value }}
													</a-col>
													<a-col>
														<img
															class="goods-indicator-icon"
															v-if="indicator.normal"
															src="@/v2/assets/imgs/logisticsPlatform/indicator_normal.png"
															alt=""
														/>
														<img
															class="goods-indicator-icon"
															v-else
															src="@/v2/assets/imgs/logisticsPlatform/indicator_error.png"
															alt=""
														/>
													</a-col>
												</a-row>
											</a-col>
										</a-row>
									</a-col>
									<a-col
										:span="24"
										class="goods-indicator-title"
									>
										{{ '其他异常情况' }}
									</a-col>
									<a-col :span="24">
										<div
											v-if="goodsDetail.otherExceptionRemark"
											class="goods-other-error"
										>
											{{ goodsDetail.otherExceptionRemark }}
										</div>
										<div
											v-else
											class="goods-other-error-empty"
										>
											{{ '无' }}
										</div>
									</a-col>
								</a-row>
							</div>
						</a-col>
						<a-col flex="2">
							<a-row
								:gutter="[10, 0]"
								type="flex"
							>
								<a-col class="goods-indicator-title">货物照片: </a-col>
								<a-col flex="1">
									<span v-if="goodsDetail.goodsImgList == null || goodsDetail.goodsImgList.length == 0">-</span>
									<a-row
										v-else
										:gutter="[20, 20]"
										type="flex"
									>
										<a-col
											v-for="(goodsImage, index) in goodsDetail.goodsImgList"
											:key="index"
										>
											<a>
												<div class="goods-image-item">
													<img
														:src="goodsImage"
														alt=""
														class="goods-image-bg"
														v-viewer
													/>
												</div>
											</a>
										</a-col>
									</a-row>
								</a-col>
							</a-row>
							<a-row
								:gutter="[10, 0]"
								type="flex"
								style="margin-top: 30px"
							>
								<a-col class="goods-indicator-title">货物视频: </a-col>
								<a-col flex="1">
									<span v-if="goodsDetail.goodsVideoList == null || goodsDetail.goodsVideoList.length == 0">-</span>
									<a-row
										v-else
										:gutter="[20, 20]"
										type="flex"
									>
										<a-col
											v-for="(goodsVideo, index) in goodsDetail.goodsVideoList"
											:key="index"
										>
											<a>
												<div
													class="goods-video-item"
													@click="playVideo(goodsVideo.url)"
												>
													<img
														:src="goodsVideo.previewUrl"
														alt=""
														class="goods-image-bg"
													/>
													<div class="goods-video-cover"></div>
													<img
														src="@/v2/assets/imgs/logisticsPlatform/video_play.png"
														alt=""
														class="goods-video-play"
													/>
													<span class="video-duration">{{ goodsVideo.duration }}</span>
												</div>
											</a>
										</a-col>
									</a-row>
								</a-col>
							</a-row>
						</a-col>
					</a-row>
				</div>
				<div
					class="slTitleAssis"
					style="margin: 30px 0"
				>
					数量信息
				</div>
				<a-row
					type="flex"
					:gutter="[20, 20]"
					style="margin-bottom: 50px"
				>
					<a-col
						v-for="(countDesItem, index) in quantityInfoList"
						:key="index"
					>
						<div
							class="count-item"
							:style="{ backgroundColor: countDesItem.backgroundColor }"
						>
							<a-row
								type="flex"
								justify="space-between"
								class="count-title-row"
								:gutter="[10, 32]"
							>
								<a-col>
									{{ countDesItem.title + '（吨）' }}
								</a-col>
								<a-col>
									{{ countDesItem.quantity }}
								</a-col>
							</a-row>
							<a-row
								v-for="(storeroomCountItem, index) in countDesItem.storeroomCountList"
								:key="index"
								type="flex"
								justify="space-between"
								class="count-storeroom-row"
								:gutter="[10, 20]"
							>
								<a-col>
									{{ storeroomCountItem.warehouseName + '（吨）' }}
								</a-col>
								<a-col>
									{{ storeroomCountItem.quantity }}
								</a-col>
							</a-row>
						</div>
					</a-col>
				</a-row>
			</div>
		</a-spin>
		<InspectVideoPlayer ref="videoPlayer"></InspectVideoPlayer>
	</div>
</template>

<script>
import { getInspectRecordsDetailByTime } from '../../../api';
import InspectVideoPlayer from './InspectVideoPlayer';
import { Empty } from 'ant-design-vue';
export default {
	name: 'InspectTimeTabDetail',
	components: {
		InspectVideoPlayer
	},
	props: {
		id: String, // 巡库记录id
		hasData: Boolean // 是否有数据
	},
	data() {
		return {
			loading: false, // 详细巡库信息loading
			emptyImage: Empty.PRESENTED_IMAGE_SIMPLE,
			detailInfo: {
				// supervisorUserName: "", //巡库员名称(也可以叫监管员名称)
				// supervisorTime: "@datetime", //巡库时间
				// supervisorLocationAddress: "", //巡库定位
				// supervisorReportResultStatus: "", // 巡库报告结果NORMAL :正常 EXCEPTION :异常
				// supervisorReportResultStatusDesc: "", //巡库报告结果描述
				// supervisorSuggest: "", //巡库建议
				// supervisorResultExceptionRemark: "", //异常处理备注
				// goodsDetailList: [],
				// goodsNumberTotal: { // 数量信息汇总
				//     goodsQuantity: 0.0, //当前总库存(吨)
				//     goodsYesterdayStorageQuantity: 0.0, //昨日库房入库(吨)
				//     goodsYesterdayDeliveryQuantity: 0.0 //昨日库房出库(吨)
				// },
				// goodsNumberDetailList: [], // 数量信息列表
			}
		};
	},
	computed: {
		// 货物信息列表
		goodsDetailList: function () {
			var goodsList = this.detailInfo?.goodsDetailList ?? [];
			return goodsList;
		},
		// 数量信息统计信息
		quantityInfoList: function () {
			// 当前库存仓库列表
			var currentQuantityList = [];
			// 入库仓库列表
			var storageQuantityList = [];
			// 出库仓库列表
			var deliveryQuantityList = [];
			var goodsNumberDetailList = this.detailInfo?.goodsNumberDetailList ?? [];
			goodsNumberDetailList.forEach(goodsNumberItem => {
				var warehouseName = goodsNumberItem.warehouseName ?? '';
				currentQuantityList.push({
					warehouseName: warehouseName,
					quantity: goodsNumberItem.goodsQuantity ?? 0.0
				});
				storageQuantityList.push({
					warehouseName: warehouseName,
					quantity: goodsNumberItem.goodsYesterdayStorageQuantity ?? 0.0
				});
				deliveryQuantityList.push({
					warehouseName: warehouseName,
					quantity: goodsNumberItem.goodsYesterdayDeliveryQuantity ?? 0.0
				});
			});
			var quantityList = [
				{
					title: '当前总库存',
					quantity: this.detailInfo?.goodsNumberTotal?.goodsQuantity ?? 0.0,
					backgroundColor: '#f3f5f6',
					storeroomCountList: currentQuantityList
				},
				{
					title: '昨日入库',
					quantity: this.detailInfo?.goodsNumberTotal?.goodsYesterdayStorageQuantity ?? 0.0,
					backgroundColor: '#fff9e9',
					storeroomCountList: storageQuantityList
				},
				{
					title: '昨日出库',
					quantity: this.detailInfo?.goodsNumberTotal?.goodsYesterdayDeliveryQuantity ?? 0.0,
					backgroundColor: '#ebfaef',
					storeroomCountList: deliveryQuantityList
				}
			];
			return quantityList;
		}
	},
	mounted() {
		this.getInspectDetailInfo();
	},
	methods: {
		getInspectDetailInfo() {
			// 获取详细信息（根据不同巡库时间）
			if (this.id == null) {
				return;
			}
			this.loading = true;
			getInspectRecordsDetailByTime({ id: this.id })
				.then(res => {
					if (!res.success) {
						return;
					}
					this.detailInfo = res.data || {};
				})
				.finally(() => {
					this.loading = false;
				});
		},
		// 播放视频
		playVideo(src) {
			// 查看视频
			window.open(src, '_blank');
		}
	}
};
</script>

<style lang="less" scoped>
.tab-content {
	width: 100%;
	.abnormalText {
		color: #dd4444;
	}
	.empty-view {
		margin-top: 100px;
	}
	.goods-item {
		border: 1px solid #e5e6eb;
		border-radius: 4px;
		margin-bottom: 20px;
		overflow: clip;
		.store-room-name {
			background-color: #f3f5f6;
			height: 48px;
			padding: 0px 16px;
			align-items: center;
			font-size: 16px;
			font-weight: 600;
			color: rgba(0, 0, 0, 0.8);
			.room-icon {
				width: 20px;
				height: 20px;
				display: block;
			}
		}
		.goods-inspect-content {
			padding: 30px;
		}
		.goods-inspect-info {
			border-radius: 4px;
			background-color: #f5fcff;
			padding: 20px;
			// margin: 25px;
			margin-right: 30px;
		}
		.goods-indicator-title {
			font-size: 14px;
			color: rgba(0, 0, 0, 0.4);
		}
		.goods-indicator-error {
			font-size: 14px;
			color: #dd4444;
		}
		.goods-indicator-value {
			align-items: center;
			margin-left: 20px;
			font-size: 14px;
			color: rgba(0, 0, 0, 0.8);
		}
		.goods-indicator-icon {
			width: 16px;
			height: 16px;
			margin-left: 10px;
			display: block;
		}
		.goods-other-error-empty {
			border-radius: 4px;
			border: 1px solid #e5e6eb;
			margin-top: -6px;
			padding: 10px 12px;
			min-height: 40px;
			font-size: 14px;
			color: rgba(0, 0, 0, 0.25);
		}
		.goods-other-error {
			border-radius: 4px;
			border: 1px solid #e5e6eb;
			// margin: 10px 0px;
			margin-top: -6px;
			padding: 12px;
			min-height: 83px;
			font-size: 14px;
			color: rgba(0, 0, 0, 0.8);
		}
		.goods-image-item {
			height: 80px;
			width: 144px;
			border-radius: 4px;
			// background-color: aquamarine;
			overflow: clip;
		}
		.goods-image-bg {
			position: absolute;
			top: 10px;
			left: 10px;
			height: 80px;
			width: 144px;
			border-radius: 4px;
			z-index: 1;
			object-fit: cover;
		}
		.goods-video-item {
			height: 80px;
			width: 144px;
			border-radius: 4px;
			overflow: clip;
			// background-color:blueviolet;
			.goods-video-cover {
				position: absolute;
				border-radius: 4px;
				left: 10px;
				right: 10px;
				top: 10px;
				bottom: 10px;
				z-index: 2;
				background-color: #16171b;
				opacity: 0.3;
			}
			.goods-video-play {
				position: absolute;
				width: 24px;
				height: 24px;
				left: 0;
				right: 0;
				top: 0;
				bottom: 0;
				margin: auto;
				z-index: 2;
			}
			.video-duration {
				position: absolute;
				right: 18px;
				bottom: 12px;
				font-size: 14px;
				color: #fff;
				text-align: left;
				z-index: 3;
			}
		}
	}
	.count-item {
		border-radius: 4px;
		min-height: 128px;
		width: 328px;
		padding: 20px;
	}
	.count-title-row {
		font-size: 16px;
		font-weight: bold;
		color: rgba(0, 0, 0, 0.8);
	}
	.count-storeroom-row {
		font-size: 14px;
		font-family: 'PingFang SC';
		color: rgba(0, 0, 0, 0.4);
	}
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
