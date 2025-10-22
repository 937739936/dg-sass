<template>
	<div class="slMain">
		<breadcrumb></breadcrumb>
		<a-card :bordered="false">
			<div
				slot="title"
				class="slTitle"
			>
				<span>{{ $route.meta.title }}</span>
			</div>
			<div
				v-if="result"
				class="view-box"
			>
				<a-tabs
					:defaultActiveKey="key"
					@change="callback"
				>
					<a-tab-pane
						v-for="item in result"
						:key="item.no"
						:tab="item.fileTypeText"
					>
						<div
							v-if="result"
							class="content-box"
						>
							<pdf-preview
								v-if="item.fileUrl && key === item.no"
								:url="item.fileUrl"
							></pdf-preview>
						</div>
					</a-tab-pane>
				</a-tabs>
			</div>
		</a-card>
		<div class="slDetailBottom">
			<a-space :size="30">
				<a-button
					@click.native="$router.go(-1)"
					v-if="!this.$route.query.newTab"
					>返回</a-button
				>
				<a-button
					type="primary"
					@click.native="downFile"
					class="down-btn"
					>下载文件</a-button
				>
			</a-space>
		</div>
	</div>
</template>

<script>
import PdfPreview from '@sub/components/pdf/index.vue';
import comDownload from '@sub/utils/comDownload.js';
import { API_CONTRACTFILEDETAIL, API_downloadAllContractAttachment } from '@/v2/center/trade/api/contract';
import breadcrumb from '@/v2/components/breadcrumb/index';
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
			// const path = this.$route.path;
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
			API_CONTRACTFILEDETAIL({
				contractNo: this.$route.query.contractNo
			}).then(async (res) => {
				if (res.success) {
					if (res.result[0]) {
						res.result[0].fileUrl = await this.$RsaDecrypt.generateFileUrl(res.result[0]?.fileUrl);
					}
					if (res.result[1]) {
						res.result[1].fileUrl = await this.$RsaDecrypt.generateFileUrl(res.result[1]?.fileUrl);
					}
					this.result = res.result || [];
					this.$forceUpdate();
					// 获取tabs选中的key 若url上无，则初始化选中第一个附件
					this.key = this.$route.query.no || (res.result.length > 0 ? res.result[0].no : 0);
				}
			});
		},

		downFile() {
			//压缩包命名规则：【原合同编号】-【卖方企业】-【买方企业】
			API_downloadAllContractAttachment({ orderId: this.$route.query.contractId }).then(res => {
				comDownload(res, undefined, this.$route.query.zipFileName);
			});
		}
	},
	components: {
		PdfPreview,
		breadcrumb
	}
};
</script>

<style lang="less" scoped>
::v-deep.ant-tabs-bar {
	width: 90%;
}
.view-box {
	position: relative;
	.down-btn {
		position: absolute;
		right: 5px;
		top: 2px;
		z-index: 10;
	}
}
.slMain {
	font-family:
		PingFangSC-Regular,
		PingFang SC;
	margin-bottom: -40px;
	.ant-card {
		padding: 30px 30px 0 30px;
		.content-box {
			width: 100%;
			position: relative;
			border: 1px solid #e5e6eb;
			border-bottom: none;
			border-top: none;
		}
	}
	.slDetailBottom {
		width: 100%;
		min-width: 1186px;
		height: 64px;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		border-top: 1px solid #e5e6eb;
		box-sizing: border-box;
		position: sticky;
		bottom: 0;
	}
}
</style>
