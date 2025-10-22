<template>
	<div style="width: 100%">
		<h3>查看合同</h3>
		<div
			v-if="result"
			class="view-box"
		>
			<a-button
				type="primary"
				@click.native="downFile"
				class="down-btn"
				>一键下载</a-button
			>
			<a-tabs
				:defaultActiveKey="key"
				@change="callback"
			>
				<a-tab-pane
					v-for="(item, index) in result"
					:key="item.id"
					:tab="item.type"
				>
					<pdf-preview
						v-if="item.path && key === item.id"
						:url="item.path"
					></pdf-preview>
				</a-tab-pane>
			</a-tabs>
		</div>
		<!-- <img :src="previewImg" style="display: none" ref="viewer" v-viewer /> -->
		<a-row
			type="flex"
			justify="center"
			v-if="!this.$route.query.newTab"
		>
			<a-button @click.native="$router.go(-1)">返回</a-button>
		</a-row>
	</div>
</template>

<script>
import PdfPreview from '@sub/components/pdf/index.vue';
import comDownload from '@sub/utils/comDownload.js';
import { API_SteelsGoodstransferDetail } from '@/v2/center/steels/api/goodsTransfer.js';
import { API_getCommonBatchDownload, API_DOWNLPREVIEWTE } from '@/v2/api';
import { API_downloadAllContractAttachment } from '@/v2/center/trade/api/contract';

export default {
	data() {
		return {
			result: [],
			key: this.$route.query.no || '' // 获取tabs选中的key
		};
	},
	created() {
		this.getConfirmDetail();
	},
	computed: {},
	methods: {
		callback(key) {
			this.key = key;
			// 替换url上tabs选中的key
			// const path = '/center/steels/goodsTransfer/detail';
			// this.$router.push({
			//   path,
			//   query: {
			//     ...this.$route.query,
			//     no: key,
			//   },
			// });
		},
		// 获取确认订单详情
		getConfirmDetail() {
			API_SteelsGoodstransferDetail({
				id: this.$route.query.id
			}).then(res => {
				if (res.success) {
					this.result = res.data.attachmentFileVO || [];
					// 获取tabs选中的key 若url上无，则初始化选中第一个附件
					this.key = this.$route.query.no || (this.result.length > 0 ? this.result[0].id : 0);
				}
			});
		},

		downFile() {
			//压缩包命名规则：【原合同编号】-【卖方企业】-【买方企业】
			API_downloadAllContractAttachment({ orderId: this.$route.query.contractId }).then(res => {
				comDownload(res, undefined, this.$route.query.zipFileName);
			});
		},
		downloadPdf(url) {
			if (url.indexOf(',') == -1) {
				API_DOWNLPREVIEWTE(url).then(res => {
					comDownload(res, url);
				});
			} else {
				API_getCommonBatchDownload({
					zipFileName: '货转证明',
					files: url
				}).then(res => {
					comDownload(res.data, undefined, res.name);
				});
			}
		}
	},
	components: {
		PdfPreview
	}
};
</script>

<style lang="stylus" scoped>
::v-deep.ant-tabs-bar {
  width: 90%
}
.view-box {
  position: relative;
  margin-bottom: 30px;
  .down-btn {
    position: absolute;
    right: 5px;
    top: 2px;
    z-index: 10;
  }
}
</style>
