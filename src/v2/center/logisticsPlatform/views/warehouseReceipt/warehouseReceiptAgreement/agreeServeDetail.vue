<template>
	<div class="slMain">
		<Breadcrumb></Breadcrumb>
		<AgreeServeDetail
			:type="type"
			:detailData="detailData"
			@viewPDF="handlePreview"
			@download="download"
			@downSupplePDF="downSupplePDF"
		></AgreeServeDetail>
		<ImageViewer ref="imageViewer" />
	</div>
</template>

<script>
import AgreeServeDetail from '@sub/logisticsPlatform/warehouseReceipt/warehouseReceiptAgreement/AgreeServeDetail';
import Breadcrumb from '@/v2/components/breadcrumb/index';
import { API_FinancingDetail } from '@/v2/center/financing/api/index.js';
import comDownload from '@sub/utils/comDownload';
import { API_getCommonDownload } from '@/v2/center/person/api';
import ENV from '@/v2/config/env';
import {
	getWarehouseReceiptAgreementServeDetail,
	downloadWarehouseReceiptServeManage
} from '@/v2/center/logisticsPlatform/api/warehouseReceipt';
import ImageViewer from '@sub/components/viewer/image.vue';

export default {
	data() {
		return {
			type: 'rest',
			detailData: {
				auditChainAndOperator: {}
			},
			previewImg: ''
		};
	},
	mounted() {
		this.getDetail();
	},
	methods: {
		async getDetail() {
			const params = {
				id: this.$route.query.id
			};
			// getWarehouseReceiptAgreementServeDetail
			const res = await getWarehouseReceiptAgreementServeDetail(params);
			this.detailData = res.data || {};
			/** 获取审批流程 */
			this.operatorInfo = {};
			if (this.detailData.auditChainAndOperator) {
				this.operatorInfo = this.detailData.auditChainAndOperator.operatorInfo[0];
			}
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
			console.log(item);
			// 电子仓单管理协议-协议编号-企业名称简称-仓储企业简称
			// let name = `电子仓单管理协议-${item.ser}.xls`
			// const res = await this.exportApi({...this.searchParams,  status: this.status})
			// comDownload(res, undefined, name);
			const res = await API_getCommonDownload(item.path);
			// const name = `${this.detailData.loanerName}-${this.detailData.bankName}-${this.detailData.serialNo}.zip`;
			comDownload(res, undefined, item.name);
		},
		async downSupplePDF() {
			const res = await downloadWarehouseReceiptServeManage({ id: this.$route.query.id });
			comDownload(res.data, null, res.name);
		}
	},
	components: {
		AgreeServeDetail,
		Breadcrumb,
		ImageViewer
	}
};
</script>

<style scoped lang="less"></style>
