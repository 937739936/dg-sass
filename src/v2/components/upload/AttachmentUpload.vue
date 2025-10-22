<template>
	<div class="attachment">
		<a-spin
			tip="上传中..."
			v-if="beginUpload"
			class="loading"
		/>
		<div
			v-if="showTip"
			class="tips"
		>
			<p class="handle">
				<span>{{ tips }}</span>
			</p>
		</div>
		<a-table
			class="new-table"
			:columns="columns"
			:data-source="dataSource"
			:rowKey="(record, index) => record.id"
			:pagination="false"
		>
			<div
				slot="type"
				slot-scope="text, record"
				class="type"
			>
				<div style="margin-right: 20px; line-height: 24px">
					<span
						class="red"
						v-if="required"
						>*</span
					>
					<span>{{ record.typeName }}</span>
				</div>
				<a-upload
					:headers="headers"
					:beforeUpload="beforeUpload"
					:accept="accept"
					:multiple="multiple"
					:fileList="fileList"
					name="file"
					v-if="editFlag"
				>
					<a-button
						type="primary"
						@click="upload(record.type)"
						class="upload"
						:disabled="beginUpload"
					>
						{{ beginUpload ? '上传中' : '上传' }}
					</a-button>
				</a-upload>
			</div>
			<div
				slot="fileList"
				slot-scope="text, record"
			>
				<div class="name-box">
					<div
						v-for="(item, index) in record.fileList"
						:key="index"
						class="name"
					>
						<a-tooltip>
							<template slot="title">
								<span>上传时间：{{ item.uploadTime || item.createTime }}</span>
							</template>
							<span
								class="preview"
								@click="handlePreview(item)"
							>
								{{ item.name }}</span
							>
							<img
								class="del"
								@click="del(record, index)"
								src="@sub/assets/imgs/trade/del-icon.png"
								alt=""
								v-if="editFlag"
							/>
						</a-tooltip>
					</div>
				</div>
			</div>
		</a-table>
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
const columns = [
	{ title: '单据类型', dataIndex: 'type', scopedSlots: { customRender: 'type' }, width: 210 },
	{ title: '文件名称', dataIndex: 'fileList', scopedSlots: { customRender: 'fileList' } }
];
import ENV from '@/v2/config/env';
import { mapGetters } from 'vuex';
import { commonUpload, commonFileUpload } from 'api';
import moment from 'moment';
import { ConfirmIcon } from '@sub/components/svg';

export default {
	props: {
		showTip: {
			default: true
		},
		accept: {
			default: ''
		},
		editFlag: {
			default: true
		},
		required: {
			default: true
		},
		dataSource: {
			default: []
		},
		tips: {
			default: ''
		},
		multiple: {
			default: true
		},
		// 接口是否返回id
		actionReturnId: {
			default: false
		}
	},
	data() {
		return {
			isSpread: false,
			columns,
			delVisible: false,
			currentIndex: 0,
			currentItem: {},
			previewImg: '',
			fileList: [],
			beginUpload: false,
			type: null,
			uploadFileList: []
		};
	},
	mounted() {},
	watch: {
		uploadFileList(val) {
			if (val.length) {
				val.forEach(el => {
					this.handleUpload(el);
				});
			}
		},
		beginUpload(val) {
			this.$emit('beginUpload', val);
		}
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
		}
	},
	methods: {
		init(info) {
			// 线下合同
			const contractAttachment = info || [];
			this.$nextTick(() => {
				contractAttachment.forEach(el => {
					el.name = el.fileName || el.name;
					el.url = el.fileUrl || el.url || el.path;
					const item = this.dataSource.find(el2 => el2.type == el.type);
					if (item) {
						item.fileList.push(el);
					}
				});
			});
		},
		//上传前校验
		beforeUpload(file) {
			const fileFormat = file.name.split('.').pop().toLowerCase();
			const flag = this.accept.includes(fileFormat);
			// 获取当前上传的单据类型
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
		async handleUpload(file, t) {
			this.beginUpload = true;
			const formData = new FormData();
			formData.append('file', file);
			try {
				const API = this.actionReturnId ? commonFileUpload : commonUpload;
				const res = await API(formData);
				const obj = res.data || res.result;
				const item = this.dataSource.find(el => el.type == this.type) || {};
				obj.uploadTime = obj.createTime ? obj.createTime : moment().format('YYYY-MM-DD HH:mm:ss');
				obj.name = obj.fileName || obj.name;
				obj.url = obj.fileUrl || obj.path;
				item.fileList.push(obj);
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
		saveDel() {
			const item = this.dataSource.find(el => el.type == this.currentItem.type) || {};
			const list = item.fileList || [];
			list.forEach((el, index, arr) => {
				if (index == this.currentIndex) {
					arr.splice(index, 1);
				}
			});
			this.$forceUpdate();
			this.delVisible = false;
		},
		handlePreview(data) {
			let url = data.fileUrl || data.url;
			if (!url) {
				return;
			}
			this.previewImg = url;
			if (this.previewImg.indexOf('.pdf') != -1) {
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
			const rule = '.mp4,.avi,.3gp,.mkv';
			const fileFormat = url.split('?')[0].split('.').pop().toLowerCase();
			if (rule.includes(fileFormat)) {
				window.open(this.previewImg, '_blank');
				return;
			}
			this.$refs.viewer.$viewer.show();
		}
	},
	components: {
		ConfirmIcon
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style scoped lang="less">
.attachment {
	position: relative;
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
		margin-bottom: 8px;
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
	span {
		display: inline-block;
		line-height: 24px;
	}
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
	margin-top: 20px;
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
	/deep/ .ant-table-tbody > tr > td:nth-child(2) {
		padding-bottom: 0;
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
