<template>
	<div class="slMain">
		<Breadcrumb />
		<WarehouseReceiptDetail
			:type="type"
			:detailData="detailData"
			:informationFlowApi="API_warehouseReceiptGetInformationFlow"
			:chainListApi="getBlockChainList"
			:downBlockChainCer="downBlockChainCer"
			:chainDetailApi="getBlockChainDetail"
			@previewReceipt="previewReceipt"
			@viewPDF="handlePreview"
			@download="download"
			@downloadAll="downloadAll"
		/>
		<a-modal
			class="slModal slModal2"
			:visible="previewVisible"
			:width="1174"
			@cancel="previewVisible = false"
			title="仓单预览"
			:footer="null"
			:forceRender="true"
			:destroyOnClose="true"
		>
			<div>
				<pdf-preview :url="currentPdf"></pdf-preview>
			</div>
		</a-modal>
		<image-viewer ref="imageViewer" />
	</div>
</template>

<script>
import {
	API_getWarehouseReceiptDetail,
	API_warehouseReceiptGetInformationFlow,
	getBlockChainList,
	getBlockChainDetail,
	downBlockChainCer,
	API_warehouseReceiptDownload
} from '@/v2/center/logisticsPlatform/api/warehouseReceipt.js';
import { API_getCommonDownload } from '@/v2/center/person/api';

import WarehouseReceiptDetail from '@sub/logisticsPlatform/warehouseReceipt/warehouseReceiptQuery/Detail';
import Breadcrumb from '@/v2/components/breadcrumb/index';
import { filePreview } from '@/v2/utils/file';
import imageViewer from '@/v2/components/imageViewer.vue';
import comDownload from '@sub/utils/comDownload';
import ENV from '@/v2/config/env';
import PdfPreview from '@sub/components/pdf/index.vue';

export default {
	data() {
		return {
			type: 'rest',
			detailData: {},
			previewVisible: false,
			currentPdf: ''
		};
	},
	mounted() {
		this.getDetail();
	},
	methods: {
		API_warehouseReceiptGetInformationFlow,
		getBlockChainList,
		getBlockChainDetail,
		downBlockChainCer,
		async getDetail() {
			let id = this.$route.query.id;
			if (!id) {
				return;
			}
			const res = await API_getWarehouseReceiptDetail({ id });
			this.detailData = res.data || {};
		},
		// 查看文件
		handlePreview(items) {
			filePreview(items.fileUrl || items.path, this.$refs.imageViewer.show);
		},
		async download(item) {
			const res = await API_getCommonDownload(item.path);
			comDownload(res, undefined, item.name);
		},
		async downloadAll() {
			const res = await API_warehouseReceiptDownload({ id: this.$route.query.id });
			comDownload(res.data, undefined, res.name);
		},
		// 仓单预览
		previewReceipt(item) {
			this.currentPdf = item;
			this.previewVisible = true;
		}
	},
	components: {
		WarehouseReceiptDetail,
		Breadcrumb,
		PdfPreview,
		imageViewer
	}
};
</script>

<style scoped lang="less">
.slModal2 {
	/deep/ .ant-modal-body {
		max-height: inherit;
	}
}
</style>
