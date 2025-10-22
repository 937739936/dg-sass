<template>
	<a-modal
		width="875px"
		:visible="visible"
		:footer="null"
		:title="null"
		centered
		@cancel="triggerVisible"
		destroyOnClose
	>
		<div class="title">货权转移证明预览</div>
		<div style="padding: 20px">
			<div class="pdfPri">
				<pdf-preview
					id="pdf-preview-print"
					v-if="pdfUrl"
					:url="pdfUrl"
				></pdf-preview>
			</div>
			<div class="footer">
				<a-button
					type="primary"
					ghost
					@click="triggerVisible"
				>
					返回
				</a-button>
				<a-button
					type="primary"
					:loading="loading"
					@click="download"
				>
					下载
				</a-button>
			</div>
		</div>
	</a-modal>
</template>
<script>
import PdfPreview from '@sub/components/pdf/index.vue';
import { API_getCommonDownload } from '@/v2/center/trade/api/goodsTransfer';
import comDownload from '@sub/utils/comDownload.js';
import { mapGetters } from 'vuex';
export default {
	data() {
		return {
			visible: false,
			loading: false,
			pdfUrl: {}
		};
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		})
	},
	components: {
		PdfPreview
	},
	methods: {
		show(url) {
			this.pdfUrl = url;
			this.triggerVisible();
		},
		//下载附件
		download() {
			API_getCommonDownload(this.pdfUrl).then(res => {
				comDownload(res, null, `${this.VUEX_ST_COMPANYSUER.companyName}货权转移证明.pdf`);
			});
		},
		triggerVisible() {
			this.visible = !this.visible;
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less" scoped>
.title {
	font-family: 'PingFang SC';
	font-style: normal;
	font-weight: 500;
	font-size: 18px;
	line-height: 58px;
	color: rgba(0, 0, 0, 0.8);
	background: #f3f5f6;
	padding-left: 20px;
	border-radius: 8px 8px 0px 0px;
	span {
		display: inline-block;
		font-family: 'PingFang SC';
		font-style: normal;
		font-weight: 400;
		font-size: 16px;
		margin-right: 30px;
		cursor: pointer;
		position: relative;
		&.active {
			font-weight: 500;
			&::after {
				position: absolute;
				bottom: 0;
				left: 0;
				width: 100%;
				height: 2px;
				background: @primary-color;
				border-radius: 1px;
				content: '';
			}
		}
	}
}

/deep/ .ant-modal-body {
	padding: 0;
	.pdfPri {
		height: calc(79vh - 136px);
		overflow-y: scroll;
	}
}
/deep/ .ant-modal-close-x {
	background: url('~@/v2/assets/imgs/receive/icon_delete.png') no-repeat;
	background-size: cover;
	.ant-modal-close-icon {
		display: none;
	}
}

.footer {
	padding: 10px 0;
	text-align: center;
	.ant-btn {
		margin: 0 10px;
		width: 114px;
		height: 38px;
		line-height: 38px;
	}
}
</style>
