<template>
	<div class="slMain">
		<Breadcrumb />
		<WarehouseReceiptLadingDetail
			:type="type"
			:detailData="detailData"
			:fileDownloadApi="API_warehouseReceiptDeliveryDownload"
			:chainListApi="getBlockChainList"
			:downBlockChainCer="downBlockChainCer"
			:chainDetailApi="getBlockChainDetail"
			@filePreview="handleFilePreview"
		/>
		<ImageViewer ref="imageViewer" />
	</div>
</template>

<script>
import {
	API_warehouseReceiptDeliveryDetail,
	API_warehouseReceiptDeliveryDownload,
	getBlockChainList,
	getBlockChainDetail,
	downBlockChainCer
} from '@/v2/center/logisticsPlatform/api/warehouseReceipt.js';

import WarehouseReceiptLadingDetail from '@sub/logisticsPlatform/warehouseReceipt/warehouseReceiptDelivery/Detail';
import Breadcrumb from '@/v2/components/breadcrumb/index';
import ImageViewer from '@sub/components/viewer/image.vue';

export default {
	data() {
		return {
			type: 'rest',
			detailData: {}
		};
	},
	mounted() {
		this.getDetail();
	},
	methods: {
		API_warehouseReceiptDeliveryDownload,
		API_warehouseReceiptDeliveryDetail,
		getBlockChainList,
		getBlockChainDetail,
		downBlockChainCer,
		getDetail() {
			const { id } = this.$route.query;
			if (!id) return;
			API_warehouseReceiptDeliveryDetail({ id })
				.then(result => {
					if (result.success) {
						this.detailData = result.data;
					}
				})
				.catch(() => {});
		},
		handleFilePreview(items) {
			// filePreview(items.fileUrl || items.path, this.$refs.imageViewer.show);
			items.fileUrl = items.url || items.path
			this.$refs.imageViewer.showFile(items);
		}
	},
	components: {
		WarehouseReceiptLadingDetail,
		Breadcrumb,
		ImageViewer
	}
};
</script>

<style scoped lang="less"></style>
