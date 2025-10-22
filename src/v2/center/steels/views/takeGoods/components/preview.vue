<!--
 * @Author: liupengbo liupengbo@shdatalink.com
 * @Date: 2022-06-26 16:19:15
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-07-04 13:55:19
 * @FilePath: /dg-trade-frontend/src/views/center/takeGoods/order/template.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
	<a-modal
		title="提单预览"
		centered
		:visible="visible"
		@ok="handleOk"
		@cancel="onCancel"
		:closable="false"
		width="60%"
		okText="下载pdf"
		cancelText="我知道了"
	>
		<div>
			<PdfPreview
				:url="url"
				:type="type"
			></PdfPreview>
			<!-- <iframe :src="previewUrl" frameborder="0"></iframe> -->
		</div>
	</a-modal>
</template>

<script>
import comDownload from '@sub/utils/comDownload.js';
import PdfPreview from '@sub/components/pdf/index.vue';
import ENV from '@/v2/config/env';
import { getPopupContainer, down } from '@/v2/utils/factory.js';
import { API_SteelsDownloadFilesPath } from '@/v2/center/steels/api/orderApply';
export default {
	props: {
		type: {
			default: null
		}
	},
	data() {
		return {
			visible: false,
			url: '',
			info: {}
		};
	},
	computed: {
		previewUrl() {
			return `${ENV.BASE_GANG_API}/${this.url}#toolbar=0`;
		}
	},
	methods: {
		show(url, info) {
			this.visible = true;
			this.url = url;
			this.info = info;
		},

		async handleOk() {
			let name = `提单(${this.info.sellCompanyName}-${this.info.buyCompanyName}).pdf`;
			if (this.info.serialNo) {
				name = `提单(${this.info.sellCompanyName}-${this.info.buyCompanyName})-${this.info.serialNo}.pdf`;
			}
			if (this.type == 'base64') {
				down(`data:application/pdf;base64,${this.url}`, name);
				return;
			}
			const fileFormat = this.url.split('?')[0].split('.').pop().toLowerCase();
			const arr = ['png', 'jpeg', 'jpg', 'gif', 'pdf', 'doc', 'docx', 'xlsx', 'xls', 'rar', 'zip'];
			const res = await API_SteelsDownloadFilesPath({ filePath: this.url });
			comDownload(res, null, name);
		},
		onCancel() {
			this.visible = false;
		}
	},
	components: {
		PdfPreview
	}
};
</script>

<style lang="less" scoped>
table {
	width: 100%;
	height: auto;
	border-collapse: collapse;
}
tr {
	width: 100%;
	height: 30px;
}
.iframe-wrap {
	width: 100%;
	height: 600px;
	overflow: scroll;
}
iframe {
	width: 100%;
	height: 100%;
}
/deep/ .ant-modal-footer {
	width: 100%;
	display: flex;
	flex-direction: row;
	justify-content: center;
}
</style>
