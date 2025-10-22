<template>
	<div>
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
</template>

<script>
export default {
	name: 'InspectQuantityInfoView',
	props: {
		detailInfo: Object
	},
	data() {
		return {};
	},

	computed: {
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
	methods: {}
};
</script>

<style lang="less" scoped>
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
</style>