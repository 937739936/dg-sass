<template>
	<div class="attachment">
		<a-spin
			tip="上传中..."
			v-if="beginUpload"
			class="loading"
		/>
		<div class="slTitleAssis">
			附件信息
			<!-- <a-button type="primary" ghost class="slBtn" style="margin-left: 30px;" @click="downFile">一键下载</a-button> -->
		</div>
		<div
			class="tips"
			v-if="transInfo.transType == 3"
		>
			<p class="handle">
				<span
					>上传附件格式要求：可支持上传jpg,jpeg,png,bmp,pdf的附件,单个附件大小不超过100M，装船付业务货转开具需提交【化验报告】、【称重凭证】</span
				>
			</p>
		</div>

		<div class="table-box">
			<a-table
				:columns="filesColumns"
				border
				class="new-table"
				:bordered="false"
				rowKey="fileUrl"
				:dataSource="dataSource"
				:pagination="false"
			>
				<div
					slot="typeName"
					slot-scope="text, record"
				>
					<div
						@click="upload(record.type)"
						class="type"
					>
						<div class="df">
							<span>{{ record.typeName }}</span>
						</div>

						<a-upload
							:headers="headers"
							v-if="!record.disabled && deliverInfo.canUploadAttachment"
							:beforeUpload="beforeUpload"
							:accept="accept"
							:action="action"
							:multiple="true"
							:fileList="fileList"
							name="file"
						>
							<a-button
								type="primary"
								class="upload"
								:disabled="beginUpload"
							>
								{{ '上传' }}
							</a-button>
						</a-upload>
					</div>
				</div>
				<template
					slot="fileList"
					slot-scope="text, record"
				>
					<div class="name-box">
						<a-tooltip
							v-for="(item, i) in record.fileList"
							:key="i"
							class="name"
						>
							<template slot="title"> 上传时间：{{ item.uploadTime || item.createTime || item.createDate }} </template>
							<a
								href="javascript:;"
								class="preview"
								@click="handlePreview(item)"
							>
								{{ item.name || item.transferName }}
							</a>
							<img
								class="del"
								@click="del(record, i)"
								v-if="item.isCanDel || item.enableDirectDelete"
								src="~@sub/assets/imgs/trade/del-icon.png"
								alt=""
							/>
						</a-tooltip>
					</div>
				</template>
				<template
					slot="action"
					slot-scope="text, items"
				>
					<a
						href="javascript:;"
						v-if="items.fileList.length"
						@click="download(items)"
						>下载</a
					>
				</template>
			</a-table>
		</div>
		<a-modal
			class="del-modal slModal"
			:visible="delVisible"
			:width="460"
			@cancel="delVisible = false"
			title=""
		>
			<div class="title-box">
				<ConfirmIcon></ConfirmIcon>
				<span class="title">确认删除</span>
			</div>
			<div class="tip">确认要删除该附件吗，删除后无法恢复</div>
			<template slot="footer">
				<a-button
					key="back"
					@click="delVisible = false"
					class="cancel-btn"
					>取消</a-button
				>
				<a-button
					type="primary"
					@click="saveDel"
					style="margin-left: 20px"
					>确定</a-button
				>
			</template>
		</a-modal>
		<img
			:src="previewImg"
			style="display: none"
			ref="viewer"
			v-viewer
		/>
	</div>
</template>

<script>
import ENV from '@/v2/config/env';
import comDownload from '@sub/utils/comDownload.js';
import { mapGetters } from 'vuex';
import { API_UPLOAD_WATER_MARk } from 'api';
import moment from 'moment';
import { GetCurrentDate } from '@/v2/utils/factory';
import { sendDownloadAttach, sendDeleteAttach, sendAddAttach, commonUpload } from '@/v2/center/trade/api/receive';
import { ConfirmIcon } from '@sub/components/svg';
import { API_GetDownloadRAR } from '@/v2/api';
const filesColumns = [
	{ title: '单据类型', dataIndex: 'typeName', width: '20%', scopedSlots: { customRender: 'typeName' } },
	{ title: '文件名称', dataIndex: 'fileList', scopedSlots: { customRender: 'fileList' } },
	{ title: '操作', dataIndex: 'action', scopedSlots: { customRender: 'action' }, width: '15%', align: 'center' }
];
const keyInfo = {
	CZPZ: 'CZPZ',
	HYPZ: 'HYPZ'
};
export default {
	props: {
		list: {
			default: () => {
				return [];
			}
		},
		transInfo: {
			type: Object,
			default: () => {
				return {};
			}
		},
		deliverInfo: {
			type: Object,
			default: () => {
				return {};
			}
		}
	},
	data() {
		return {
			filesColumns,
			previewImg: '',
			BASE_NET: ENV.BASE_NET,
			type: '',
			currentIndex: 0,
			currentItem: {},
			dataSource: [],
			delVisible: false,
			action: API_UPLOAD_WATER_MARk,
			beginUpload: false,
			fileList: [],
			uploadFileList: []
		};
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_TOKEN: 'VUEX_ST_TOKEN'
		}),
		headers() {
			return {
				Authorization: this.VUEX_ST_TOKEN,
				Source: 'PC'
			};
		},

		accept() {
			const item = this.dataSource.find(el => el.type == this.type) || {};
			return item.accept || '.jpg,.jpeg,.png,.bmp,.pdf';
		}
	},
	watch: {
		list: {
			handler(arr) {
				this.dataSource = [];
				arr.forEach(el => {
					this.dataSource.push({
						...el
					});
				});
			},
			immediate: true
		},
		uploadFileList(val) {
			if (val.length) {
				this.handleUpload(val);

				// val.forEach(el => {
				//   this.handleUpload(el)
				// })
			}
		}
	},
	methods: {
		handlePreview(data) {
			let url = data.fileUrl || data.url;
			this.previewImg = url;
			if (this.previewImg.indexOf('.pdf') != -1 || this.previewImg.indexOf('.PDF') != -1) {
				window.open(this.previewImg, '_blank');
				return;
			}
			if (
				this.previewImg.indexOf('.doc') > -1 ||
				this.previewImg.indexOf('.docx') > -1 ||
				this.previewImg.indexOf('.xlsx') > -1 ||
				this.previewImg.indexOf('.xls') > -1
			) {
				const jumpUrl = 'https://view.officeapps.live.com/op/view.aspx?src=' + encodeURIComponent(url);
				window.open(jumpUrl, '_blank');
				return;
			}
			if (this.previewImg.indexOf('.rar') > -1 || this.previewImg.indexOf('.zip') > -1) {
				if (data.attachId) {
					API_GetDownloadRAR(data.attachId).then(res => {
						comDownload(res, undefined, data.name + '.zip');
					});
				} else {
					window.open(this.previewImg, '_blank');
				}
				return;
			}
			//判断视频
			if (
				this.previewImg.indexOf('.avi') > -1 ||
				this.previewImg.indexOf('.3gp') > -1 ||
				this.previewImg.indexOf('.mp4') > -1 ||
				this.previewImg.indexOf('.mkv') > -1
			) {
				this.videoVisible = true;
				window.open(this.previewImg);
				return;
			}
			this.$refs.viewer.$viewer.show();
		},
		async download(record) {
			const params = {
				deliverId: this.$route.query.deliverId,
				attachTypeEnum: record.type
			};
			const res = await sendDownloadAttach(params);
			let fileFormat = '.zip';
			let name = `${this.deliverInfo.deliverNo}-${record.typeName}-${moment().format('yyyy-MM-DD')}.zip`;
			if (record.fileList.length == 1) {
				fileFormat = `.${record.fileList[0].url.split('?')[0].split('.').pop().toLowerCase()}`;
				const item = record.fileList[0];
				name = `${item.name || item.fileName}`;
			}
			comDownload(res, null, `${name}`);
		},
		//上传前校验
		beforeUpload(file) {
			// let fileType = this.fileType;
			const fileFormat = file.name.split('.').pop().toLowerCase();
			const flag = this.accept.includes(fileFormat);
			// 获取当前上传的单据类型

			let isAllowFormat = false;
			if (!flag) {
				this.$message.error('当前文件格式不支持');
				return;
			}

			// 只能上传一份PDF文件，或者图片（可多张）

			const t = this;
			if (file.size / 1024 / 1024 > 100) {
				t.$message.error('单个附件大小不得超过100M');
				return true;
			}
			if (file.name.indexOf('/') > 0 || file.name.indexOf('\\') > 0 || file.name.indexOf('%') > 0) {
				t.$message.error('文件名不要包含特殊符号');
				return true;
			}
			this.uploadFileList.push(file);

			return false;
		},
		// 1.上传
		async handleUpload(files, t) {
			this.beginUpload = true;
			const formData = new FormData();
			formData.append('deliverId', this.$route.query.deliverId);

			formData.append('attachTypeEnum', keyInfo[this.type]);

			files.forEach(file => {
				formData.append('files', file);
			});

			try {
				const res = await commonUpload(formData);
				const list = res.data;

				const obj = res.data;

				const item = this.dataSource.find(el => el.type == this.type) || {};

				list.forEach(el => {
					el.uploadTime = moment().format('YYYY-MM-DD HH:mm:ss');
					el.name = el.fileName;
					el.isCanDel = true;
					el.url = el.fileUrl;
				});

				item.fileList = [...item.fileList, ...list];

				this.$forceUpdate();
			} catch (err) {
				const tip = err?.data?.error?.message ? `上传失败${JSON.stringify(err?.data?.error?.message)},请重试` : '上传失败,请重试';
				this.$message.error(tip);
			} finally {
				this.fileImgList = [];
				this.beginUpload = false;
			}
		},
		// 上传的附件类型
		upload(type) {
			this.uploadFileList = [];
			this.type = type;
		},
		del(item, index) {
			this.delVisible = true;
			this.currentIndex = index;
			this.currentItem = item;
		},
		async saveDel() {
			const item = this.dataSource.find(el => el.type == this.currentItem.type) || {};
			const current = item.fileList[this.currentIndex];
			const params = {
				deliverId: this.$route.query.deliverId,
				id: current.id
			};
			await sendDeleteAttach(params);

			const list = item.fileList || [];
			list.forEach((el, index, arr) => {
				if (index == this.currentIndex) {
					arr.splice(index, 1);
				}
			});
			this.$message.success('删除成功');
			this.$forceUpdate();
			this.delVisible = false;
		}
	},
	components: {
		ConfirmIcon
	}
};
</script>

<style scoped lang="less">
.attachment {
	position: relative;
	.title {
		margin-top: 20px;
		margin-bottom: 16px;
		color: #77889d;
	}
	.tips {
		padding: 10px 12px;
		background: #e1eafe;
		border: 1px solid #d0dfff;
		border-radius: 4px;
		font-size: 12px;
		line-height: 22px;
		position: relative;
		margin-top: 20px;
	}
}
</style>
<style scoped lang="less">
.attachment {
	position: relative;
	.title {
		margin-top: 20px;
		margin-bottom: 16px;
		color: #77889d;
	}
	.tips {
		padding: 10px 12px;
		background: #e1eafe;
		border: 1px solid #d0dfff;
		border-radius: 4px;
		font-size: 12px;
		line-height: 22px;
		position: relative;
	}
	.handle {
		display: flex;
		align-items: center;
		justify-content: space-between;
		color: #000;
	}
	.btn {
		color: #4682f3;
		cursor: pointer;
	}
	.red {
		color: red;
		vertical-align: middle;
		margin-right: 5px;
	}
	.df {
		display: flex;
		align-items: center;
	}
	.name-box {
		display: flex;
		flex-wrap: wrap;
	}
	.name {
		background: #f3f5f6;
		border-radius: 4px;
		padding: 6px;
		display: flex;
		align-items: center;
		color: @primary-color;
		margin-right: 14px;
		margin-bottom: 10px;
	}
	.del {
		width: 14px;
		cursor: pointer;
		margin-left: 8px;
	}
}
.title-box {
	display: flex;
	align-items: center;
	.icon {
		color: @primary-color;
		font-size: 20px;
	}
	.title {
		color: rgba(0, 0, 0, 0.8);
		font-weight: 500;
		font-size: 20px;
		margin-left: 5px;
	}
}
.tip {
	font-size: 14px;
	color: rgba(0, 0, 0, 0.5);
	display: flex;
	margin-top: 20px;
}
.icon {
	width: 16px;
	height: 16px;
	vertical-align: sub;
	img {
		width: 16px;
		height: 16px;
	}
}
.upload {
	color: @primary-color;
	background: #fff;
	border: 1px solid @primary-color;
	height: 24px;
	width: 64px;
}
.type {
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.preview {
	cursor: pointer;
}
/deep/ .ant-modal-body {
	padding-top: 30px;
}
/deep/ .ant-modal-footer {
	border-top: 0;
	padding-top: 0;
}
.new-table {
	/deep/ .ant-table-tbody > tr:nth-child(2n) {
		background: #fff;
	}
	/deep/ .ant-table-tbody > tr > td {
		border-bottom: 1px solid #e5e6eb;
		padding: 8px 12px;
	}
	/deep/ .ant-table-tbody > tr > td:nth-child(1) {
		border-right: 1px solid #e5e6eb;
	}
}
.loading {
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translateX(-50%) translateY(-50%);
	z-index: 999;
}
</style>
