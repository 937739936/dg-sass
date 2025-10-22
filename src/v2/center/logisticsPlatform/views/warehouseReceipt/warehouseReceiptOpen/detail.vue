<template>
	<div class="slMain">
		<Breadcrumb></Breadcrumb>
		<WarehouseReceiptOpenDetail
			:type="type"
			:detailData="detailData"
			:chainListApi="getBlockChainList"
			:downBlockChainCer="downBlockChainCer"
			:chainDetailApi="getBlockChainDetail"
			@viewPDF="handlePreview"
			@download="download"
			@downloadAll="downloadAll"
		></WarehouseReceiptOpenDetail>
		<ImageViewer ref="imageViewer" />
	</div>
</template>

<script>
import {
	getWarehouseReceiptOpenDetail,
	downloadWarehouseReceiptOpenFiles,
	getBlockChainList,
	getBlockChainDetail,
	downBlockChainCer
} from '@/v2/center/logisticsPlatform/api/warehouseReceipt';
import WarehouseReceiptOpenDetail from '@sub/logisticsPlatform/warehouseReceipt/warehouseReceiptOpen/Detail';
import Breadcrumb from '@/v2/components/breadcrumb/index';
import { API_FinancingDetail } from '@/v2/center/financing/api/index.js';
import comDownload from '@sub/utils/comDownload';
import ENV from '@/v2/config/env';
import { API_getCommonDownload } from '@/v2/center/person/api';
import { API_GETCURRENTENV, API_GetDownloadRAR } from '@/v2/api';
import ImageViewer from '@sub/components/viewer/image.vue';

export default {
	data() {
		return {
			type: 'rest',
			detailData: {},
			previewImg: ''
		};
	},
	mounted() {
		this.getDetail();
	},
	methods: {
		getBlockChainList,
		getBlockChainDetail,
		downBlockChainCer,
		async getDetail() {
			const params = {
				id: this.$route.query.id
			};
			const res = await getWarehouseReceiptOpenDetail(params);
			this.detailData = res.data || {};
		},
		handlePreview(data) {
			let url = data.url || data.fileUrl || data.path;
			if (!url) {
				return;
			}
			this.previewImg = url;
			const front_url = url.split('?')[0]
			const fileFormat = front_url.split('.').pop().toLowerCase();
			if (['rar', 'zip'].includes(fileFormat)) {
				if (data.attachId) {
					API_GetDownloadRAR(data.attachId).then(res => {
						comDownload(res, undefined, data.name);
					});
				} else {
					window.open(this.previewImg, '_blank');
				}
				return;
			}
			this.$refs.imageViewer.showFile(url);
		},
		async download(item) {
			const res = await API_getCommonDownload(item.path);
			comDownload(res, undefined, item.name);
		},
		async downloadAll() {
			const res = await downloadWarehouseReceiptOpenFiles({ id: this.$route.query.id });
			comDownload(res.data, undefined, res.name);
		}
	},
	components: {
		WarehouseReceiptOpenDetail,
		Breadcrumb,
		ImageViewer
	}
};
</script>

<style scoped lang="less"></style>
