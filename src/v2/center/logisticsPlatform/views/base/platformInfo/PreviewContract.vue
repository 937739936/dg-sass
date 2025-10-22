<template>
	<div class="slMain">
		<Breadcrumb />
		<a-card :bordered="false">
			<div class="methods-wrap">
				<span class="slTitle">查看线下租赁合同</span>
			</div>
			<div class="pdf-content">
				<pdf-preview
					v-if="url"
					:url="url"
				></pdf-preview>
			</div>
		</a-card>
		<div class="fixed-bottom">
			<a-space :size="20">
				<a-button
					type="primary"
					class="btn"
					@click="back"
					ghost
					>返回</a-button
				>
				<a-button
					v-if="id"
					type="primary"
					class="btn"
					@click="doDownload"
					:loading="downloadLoading"
					>下载</a-button
				>
			</a-space>
		</div>
	</div>
</template>
<script>
import PdfPreview from '@sub/components/pdf/index.vue';
import Breadcrumb from '@/v2/components/breadcrumb/index';
import download from 'v2/utils/download';
import ENV from '@/v2/config/env';
export default {
	components: {
		PdfPreview,
		Breadcrumb
	},
	data() {
		let { id, url } = this.$route.query;
		return {
			url,
			id,
			downloadLoading: false
		};
	},
	created() {},
	methods: {
		back() {
			this.$router.go(-1);
		},
		doDownload() {
			this.downloadLoading = true;
			const url = `${ENV.BASE_STATION_API}/api/station/lease/contract/downloadAttachmentById`;
			download(url, { id: this.id }, 'GET', () => {
				this.downloadLoading = false;
			});
		}
	}
};
</script>
<style lang="less" scoped>
::v-deep {
	.lay-wrapper-normal .lay-content .main-content-inner {
		min-height: calc(100% - 40px);
	}
}

.pdf-content {
	border-width: 0 1px 1px 1px;
	border-style: solid;
	border-color: #e5e6eb;
}
.slMain {
	.fixed-bottom {
		display: flex;
		align-items: center;
		justify-content: center;
		position: fixed;
		left: 228px;
		right: 20px;
		bottom: 0;
		z-index: 10;
		height: 64px;
		border-top: 1px solid #e5e6eb;
		box-sizing: border-box;
		background-color: #fff;
		.btn {
			width: 88px;
		}
	}
}
</style>
