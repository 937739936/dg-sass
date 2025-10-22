<template>
	<div class="attachment">
		<a-spin
			tip="上传中..."
			v-if="beginUpload"
			class="loading"
		/>
		<a-table
			class="new-table"
			:columns="columns"
			:data-source="dataSource"
			:rowKey="(record, index) => record.id"
			style="margin-top: 30px; margin-bottom: 10px"
			:pagination="false"
		>
			<div
				slot="type"
				slot-scope="text, record"
				class="type"
				style="padding-top: 8px"
			>
				<div>
					<span>回款凭证</span>
				</div>
				<a-upload
					:headers="headers"
					:beforeUpload="beforeUpload"
					:accept="accept"
					:action="action"
					:multiple="true"
					:fileList="fileList"
					name="file"
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
								<span>上传时间：{{ item.uploadTime }}</span>
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
import { commonUpload, API_UPLOAD_WATER_MARk } from 'api';
import moment from 'moment';
import { ConfirmIcon } from '@sub/components/svg';

export default {
	props: {},
	data() {
		return {
			isSpread: false,
			columns,
			dataSource: [{ type: 'COLLECTION_DJ', fileList: [] }],
			delVisible: false,
			currentIndex: 0,
			currentItem: {},
			previewImg: '',
			fileList: [],
			beginUpload: false,
			type: null,
			uploadFileList: [],
			action: API_UPLOAD_WATER_MARk,
			editShowDelete: true
		};
	},
	mounted() {},
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
			return '.jpg,.jpeg,.png,.pdf,.JPEG,.PNG,.JPG,.PDF';
		}
	},
	watch: {
		uploadFileList(val) {
			if (val.length) {
				val.forEach(el => {
					this.handleUpload(el);
				});
			}
		}
	},
	methods: {
		init(list) {
			// 线下合同

			this.dataSource[0].fileList = list;
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
		async handleUpload(file, t) {
			this.beginUpload = true;
			const formData = new FormData();
			formData.append('file', file);
			try {
				const res = await commonUpload(formData);

				const obj = res.data;

				const item = this.dataSource[0];
				obj.uploadTime = moment().format('YYYY-MM-DD HH:mm:ss');
				obj.name = obj.fileName;
				obj.type = 'COLLECTION_DJ';

				obj.url = obj.fileUrl;
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
		fileChange(info) {},
		save() {
			return this.dataSource;
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
		margin-top: 8px;
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
		padding-top: 0;
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
