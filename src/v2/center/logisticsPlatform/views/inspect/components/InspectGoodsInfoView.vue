<template>
	<div>
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
				v-if="goodsDetail.isNormal"
				type="flex"
				class="goods-inspect-content"
			>
				<a-col class="goods-inspect-left-content">
					<InspectGoodsResultView :goodsIndicatorList="goodsDetail.normalIndicatorList" />
				</a-col>
				<a-col class="goods-inspect-right-content">
					<InspectMediaListView
						title="场地照片"
						mediaType="IMAGE"
						:imageList="goodsDetail.goodsImgList"
					/>
					<div style="height: 30px"></div>
					<InspectMediaListView
						title="货物堆放视频"
						mediaType="VIDEO"
						:videoList="goodsDetail.goodsVideoList"
					/>
				</a-col>
			</a-row>
			<div
				v-else
				class="goods-inspect-content"
			>
				<a-row type="flex">
					<a-col class="goods-inspect-left-content">
						<InspectMediaListView
							title="场地照片"
							mediaType="IMAGE"
							:imageList="goodsDetail.goodsImgList"
						/>
						<div style="height: 30px"></div>
					</a-col>
					<a-col class="goods-inspect-right-content">
						<InspectMediaListView
							title="货物堆放视频"
							mediaType="VIDEO"
							:videoList="goodsDetail.goodsVideoList"
						/>
						<div style="height: 30px"></div>
					</a-col>
				</a-row>
				<a-row
					type="flex"
					:gutter="[0, 0]"
				>
					<a-col
						class="goods-inspect-left-content"
						v-if="isExistNormalIndicator(goodsDetail)"
					>
						<InspectGoodsResultView :goodsIndicatorList="goodsDetail.normalIndicatorList" />
					</a-col>
					<a-col class="goods-inspect-right-content">
						<InspectGoodsResultView
							:goodsIndicatorList="goodsDetail.abNormalIndicatorList"
							:isShowTitle="!isExistNormalIndicator(goodsDetail)"
						/>
					</a-col>
				</a-row>
			</div>
		</div>
	</div>
</template>

<script>
import InspectGoodsResultView from './InspectGoodsResultView.vue';
import InspectMediaListView from './InspectMediaListView.vue';

export default {
	name: 'InspectGoodsInfoView',
	components: {
		InspectGoodsResultView,
		InspectMediaListView
	},
	props: {
		detailInfo: Object
	},
	data() {
		return {};
	},
	computed: {
		goodsDetailList() {
			let goodsDetailListTemp = this.detailInfo.goodsDetailList ?? [];
			let isExistOtherExceptionItem = false;
			goodsDetailListTemp.map(goodsDetail => {
				let goodsIndicatorList = goodsDetail.goodsIndicatorList ?? [];
				let normalIndicatorList = [];
				let abNormalIndicatorList = [];
				goodsIndicatorList.map(item => {
					if (item.normal == true) {
						normalIndicatorList.push(item);
					} else {
						abNormalIndicatorList.push(item);
					}
					if (item.code == 'otherException') {
						item.exceptionRemark = goodsDetail.otherExceptionRemark;
						isExistOtherExceptionItem = true;
					}
				});
				if (goodsDetail.otherExceptionRemark && isExistOtherExceptionItem == false) {
					abNormalIndicatorList.push({
						description: '其他异常情况',
						valueDesc: '存在其他异常情况',
						value: '是',
						normal: false,
						exceptionRemark: goodsDetail.otherExceptionRemark,
						exceptionVideoList: []
					});
				}
				if (abNormalIndicatorList.length > 0) {
					goodsDetail.isNormal = false;
				} else {
					goodsDetail.isNormal = true;
				}
				normalIndicatorList.unshift({
					description: '人脸识别',
					valueDesc: '人脸识别',
					value: '通过',
					normal: true,
					exceptionVideoList: []
				});
				goodsDetail.normalIndicatorList = normalIndicatorList;
				goodsDetail.abNormalIndicatorList = abNormalIndicatorList;
			});
			return goodsDetailListTemp;
		}
	},
	methods: {
		isExistNormalIndicator(goodsDetail) {
			if (goodsDetail && goodsDetail.normalIndicatorList.length > 0) {
				return true;
			}
			return false;
		}
	}
};
</script>

<style lang="less" scoped>
.goods-item {
	border: 1px solid #e5e6eb;
	border-radius: 4px;
	margin-bottom: 20px;
	overflow: clip;
	.store-room-name {
		background-color: #f3f5f6;
		height: 48px;
		padding: 0px 19px;
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
		padding: 30px 22px;
		.goods-inspect-left-content {
			width: 32%;
			margin-right: 128px;
		}
		.goods-inspect-right-content {
			min-width: 32%;
			max-width: 512px;
		}
	}
}
</style>