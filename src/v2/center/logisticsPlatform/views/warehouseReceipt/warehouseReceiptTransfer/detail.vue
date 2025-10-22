<template>
	<div class="slMain">
		<Breadcrumb></Breadcrumb>
		<WarehouseReceiptTransferDetail
			:type="type"
			:detailData="detailData"
			@viewPDF="handlePreview"
			@viewCarousel="openCarousel"
			@download="download"
			@downloadAll="downloadAll"
			:chainListApi="getBlockChainList"
			:downBlockChainCer="downBlockChainCer"
			:chainDetailApi="getBlockChainDetail"
		></WarehouseReceiptTransferDetail>
		<ImageViewer ref="imageViewer" />
		<ViewCarousel
			:list="previewList"
			ref="viewCarousel"
			@ok="download"
			:isShowFooter="false"
		></ViewCarousel>
	</div>
</template>

<script>
import WarehouseReceiptTransferDetail from '@sub/logisticsPlatform/warehouseReceipt/warehouseReceiptTransfer/Detail';
import Breadcrumb from '@/v2/components/breadcrumb/index';
import ViewCarousel from '../components/viewCarousel';
import { API_FinancingDetail } from '@/v2/center/financing/api/index.js';
import comDownload from '@sub/utils/comDownload';
import { API_getCommonDownload } from '@/v2/center/person/api';
import { API_GETCURRENTENV, API_GetDownloadRAR } from 'api';
import ENV from '@/v2/config/env';
import {
	getWarehouseReceiptTransferDetail,
	downloadWarehouseReceiptTransfer,
	getBlockChainList,
	getBlockChainDetail,
	downBlockChainCer
} from '@/v2/center/logisticsPlatform/api/warehouseReceipt';
import ImageViewer from '@sub/components/viewer/image.vue';
export default {
	data() {
		return {
			type: 'rest',
			detailData: {
				auditChainAndOperator: {}
			},
			previewImg: '',
			previewList: []
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
			// getWarehouseReceiptTransferDetail
			const res = await getWarehouseReceiptTransferDetail(params);
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
		async downloadAll(type) {
			const params = {
				id: this.$route.query.id,
				type
			};
			const res = await downloadWarehouseReceiptTransfer(params);
			comDownload(res.data, undefined, res.name);
		},
		openCarousel(list, index) {
			// this.previewList = list;
			this.$refs.viewCarousel.show(index);
		}
	},
	components: {
		WarehouseReceiptTransferDetail,
		Breadcrumb,
		ViewCarousel,
		ImageViewer
	}
};
</script>

<style scoped lang="less"></style>
