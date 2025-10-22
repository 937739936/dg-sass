<template>
	<div class="receive-wb-proof-module">
		<a-modal
			v-model="visible"
			:title="show ? '查看单据' : '查看货转'"
			@cancel="
				() => {
					visible = false;
				}
			"
			width="650px"
			:footer="null"
		>
			<div v-if="proofList.length > 0">
				<div
					class="proof-wrapper"
					v-for="item in proofList"
					:key="'type_' + item.type"
				>
					<div v-if="item.list.length > 0">
						<div
							class="proof-title"
							v-if="show"
						>
							<span class="com-title">{{ deliveryAttachTypeMap[item.type] }}</span>
							<a-button @click="handleExportProof(item)">下载附件</a-button>
						</div>
						<div class="proof-container">
							<div
								v-for="(inner, index) in item.list"
								:key="item.type + '_' + index"
							>
								<div
									@click="handlePreview(inner)"
									class="proof-item"
								>
									<a-icon
										v-if="
											inner.indexOf('.pdf') > -1 ||
											inner.indexOf('.doc') > -1 ||
											inner.indexOf('.docx') > -1 ||
											inner.indexOf('.xlsx') > -1 ||
											inner.indexOf('.xls') > -1
										"
										type="file"
									/>
									<img
										v-else
										:src="getUrl(inner)"
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div
				v-else
				class="no-res"
			>
				暂无单据信息
			</div>
		</a-modal>
		<a-modal
			width="700px"
			height="700px"
			:visible="previewVisible"
			:footer="null"
			@cancel="handlePreviewCancel"
		>
			<!-- 预览图片可旋转 -->
			<div class="img-wrapper">
				<div id="preview-img-id">
					<a
						:href="previewImage"
						target="_blank"
					>
						<img
							alt="example"
							:src="previewImage"
						/>
					</a>
				</div>
			</div>

			<div style="text-align: center"><a-button @click="handleClick">旋转</a-button></div>
		</a-modal>
	</div>
</template>
<script>
import { API_getCommonBatchDownload, API_GETCURRENTENV } from '@/v2/center/trade/api/lading';
import comDownload from '@sub/utils/comDownload.js';

export default {
	name: 'ReceiveWBProofModule',
	props: {
		// proof——查看单据   yspz-查看运输凭证
		type: {
			type: String,
			default: ''
		},
		list: {
			type: Array,
			default: () => {
				return [];
			}
		},
		show: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			visible: false,
			proofList: [],
			deliveryAttachTypeMap: {
				1: '装货凭证',
				2: '卸货凭证',
				3: '手动上传'
			},
			previewImage: '',
			previewVisible: false,
			deg: 0
		};
	},
	methods: {
		init(urls) {
			this.proofList = [];
			if (this.type === 'proof') {
				this.proofList = [].concat(urls);
			}
			// _loading 代表装车凭证  _receive 代表卸货凭证  其他为手工上传
			if (this.type === 'yspz') {
				let arr = urls.split(',');
				let loading = [];
				let receive = [];
				let others = [];
				arr.forEach(url => {
					let arr = url.split('_');
					if (arr[arr.length - 1].indexOf('loading') === 0) {
						loading.push(url);
					} else if (arr[arr.length - 1].indexOf('receive') === 0) {
						receive.push(url);
					} else {
						others.push(url);
					}
				});
				if (loading.length > 0) {
					this.proofList.push({
						type: 1,
						list: loading
					});
				}
				if (receive.length > 0) {
					this.proofList.push({
						type: 2,
						list: receive
					});
				}
				if (others.length > 0) {
					this.proofList.push({
						type: 3,
						list: others
					});
				}
			}
			//货转凭证
			if (this.type == 'hzzm') {
				let others = [];
				urls.forEach(item => {
					others.push(item.url);
				});
				if (others.length > 0) {
					this.proofList.push({
						type: 3,
						list: others
					});
				}
			}
			this.visible = true;
		},
		getUrl(url) {
			return API_GETCURRENTENV(url);
		},
		// 下载凭证
		handleExportProof(item) {
			API_getCommonBatchDownload({
				zipFileName: this.deliveryAttachTypeMap[item.type],
				files: item.list.join(',')
			}).then(res => {
				comDownload(res.data, undefined, res.name);
			});
		},
		// 预览附件
		handlePreview(file) {
			let jumpUrl = API_GETCURRENTENV(file);
			if (jumpUrl.indexOf('.pdf') > -1) {
				window.open(jumpUrl, '_blank');
			} else if (
				jumpUrl.indexOf('.doc') > -1 ||
				jumpUrl.indexOf('.docx') > -1 ||
				jumpUrl.indexOf('.xlsx') > -1 ||
				jumpUrl.indexOf('.xls') > -1
			) {
				jumpUrl = 'https://view.officeapps.live.com/op/view.aspx?src=' + encodeURIComponent(jumpUrl);
				window.open(jumpUrl, '_blank');
			} else {
				this.previewImage = jumpUrl;
				this.previewVisible = true;
			}
		},
		// 旋转图片
		handleClick() {
			this.deg = (this.deg + 90) % 360;
			let ele = document.getElementById('preview-img-id');
			ele.style.transform = `rotate(${this.deg}deg)`;
		},
		handlePreviewCancel() {
			let ele = document.getElementById('preview-img-id');
			ele.style.transform = `rotate(0deg)`;
			this.deg = 0;
			this.previewVisible = false;
		}
	}
};
</script>
<style lang="less" scoped>
::v-deep.ant-modal-body {
	max-height: 750px;
	overflow: auto;
}
.no-res {
	padding: 50px;
	color: #999;
	text-align: center;
}
.img-wrapper {
	margin: auto;
	position: relative;
	height: 600px;
	width: 600px;
	#preview-img-id {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		user-select: none;
		a {
			user-select: none;
		}
		img {
			max-width: 600px;
			max-height: 600px;
			pointer-events: none;
		}
	}
}
.proof-wrapper {
	.proof-title {
		.com-title {
			display: inline-block;
			height: 30px;
			line-height: 30px;
			background: #eee;
			padding: 0px 20px;
		}
		button {
			margin-left: 30px;
		}
	}
	.proof-container {
		margin: 10px 0px;
		border: 1px solid #eee;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		.proof-item {
			cursor: pointer;
			font-size: 30px;
			color: #40a9ff;
			margin: 13px;
			border: 1px solid #eee;
			width: 120px;
			height: 120px;
			display: flex;
			justify-content: center;
			align-items: center;
			img {
				max-width: 100%;
				max-height: 100%;
			}
		}
	}
}
</style>
