<template>
	<div class="freight-transport-view">
		<a-tabs
			:animated="false"
			@change="changeTab"
		>
			<a-tab-pane
				key="deliver"
				:tab="deliverTab"
			>
			</a-tab-pane>
			<a-tab-pane
				key="goodsTransfer"
				:tab="goodsTransferTab"
			>
			</a-tab-pane>
		</a-tabs>
		<GoodsBatchTable
			v-if="currentTabKey === 'deliver'"
			:dataSource="deliverBatchList"
			:API_GetShipTrackFlag="API_GetShipTrackFlag"
			:API_getRouteInfo="API_getRouteInfo"
		/>
		<GoodsTransferTable
			v-if="currentTabKey === 'goodsTransfer'"
			:dataSource="goodsTransList"
			@downloadGoodsTransferFile="downloadGoodsTransferFile"
		/>
	</div>
</template>

<script>
import GoodsBatchTable from './GoodsBatchTable.vue';
import GoodsTransferTable from './GoodsTransferTable.vue';

export default {
	name: 'FreightTransportView',
	components: {
		GoodsBatchTable,
		GoodsTransferTable
	},
	props: {
		// 发运列表
		deliverBatchList: {
			type: Array,
			default: () => []
		},
		// 货转列表
		goodsTransList: {
			type: Array,
			default: () => []
		},
		API_GetShipTrackFlag: {},
		API_getRouteInfo: {}
	},
	computed: {
		deliverTab() {
			let tab = '发运信息';
			if (this.deliverBatchList.length > 0) {
				tab = '发运信息(' + this.deliverBatchList.length + ')';
			}
			return tab;
		},
		goodsTransferTab() {
			let tab = '货转信息';
			if (this.goodsTransList.length > 0) {
				tab = '货转信息(' + this.goodsTransList.length + ')';
			}
			return tab;
		}
	},
	data() {
		return {
			currentTabKey: 'deliver'
		};
	},
	methods: {
		changeTab(key) {
			this.currentTabKey = key;
		},
		downloadGoodsTransferFile(record) {
			this.$emit('downloadGoodsTransferFile', record);
		}
	}
};
</script>

<style lang="less" scoped>
.freight-transport-view {
	margin-top: -14px;
}
</style>