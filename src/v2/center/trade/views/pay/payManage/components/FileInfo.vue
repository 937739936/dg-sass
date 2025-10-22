<template>
	<div class="attachment">
		<a-spin
			tip="上传中..."
			v-if="beginUpload"
			class="loading"
		/>
		<div
			class="slTitleAssis"
			style="margin-bottom: 30px"
		>
			附件信息
		</div>
		<div
			class="tips"
			v-if="tipsList[0]"
		>
			<p class="handle">
				<span>{{ tipsList[0] && tipsList[0].tip }}</span>
				<span
					v-show="!isSpread && tipsList.length > 1"
					class="btn"
					@click="isSpread = true"
					>展开
					<img
						class="icon"
						src="@/v2/assets/imgs/contract/arrow-down.png"
						alt=""
					/>
				</span>
				<span
					v-show="isSpread && tipsList.length > 1"
					class="btn"
					@click="isSpread = false"
				>
					收起
					<img
						class="icon"
						src="@/v2/assets/imgs/contract/arrow-up.png"
						alt=""
					/>
				</span>
			</p>
			<div
				v-show="isSpread"
				style="color: #000"
			>
				<div
					v-for="(item, i) in tipsList"
					:key="i"
				>
					<p v-if="i != 0">{{ item.tip }}</p>
				</div>
			</div>
		</div>
		<a-table
			class="new-table"
			:columns="columns"
			:data-source="dataSource"
			rowKey="key"
			style="margin-top: 30px; margin-bottom: 10px"
			:pagination="false"
		>
			<div
				slot="label"
				slot-scope="text, record"
			>
				<div
					@click="upload(record.key)"
					class="type"
				>
					<div class="df">
						<span
							v-if="record.required"
							class="red"
							>*</span
						>
						<span
							v-else
							class="red"
							style="opacity: 0"
							>*</span
						>
						<span>{{ record.label }}</span>
						<a-tooltip v-if="record.tooltip">
							<template #title>{{ record.tooltip }}</template>
							<i
								class="iconfont icon-liebiaobiaotou-shuoming"
								style="font-size: 12px"
							></i>
						</a-tooltip>
					</div>

					<a-upload
						:headers="headers"
						:beforeUpload="beforeUpload"
						:accept="record.accept"
						:multiple="true"
						:fileList="fileList"
						name="file"
					>
						<a-button
							type="primary"
							class="upload"
							:disabled="beginUpload"
						>
							上传
						</a-button>
					</a-upload>
				</div>
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
								<span>上传时间：{{ item.uploadTime || item.createTime || item.createDate }}</span>
							</template>
							<span
								class="preview"
								@click="handlePreview(item)"
							>
								{{ item.fileName || item.name }}</span
							>
							<img
								class="del"
								@click="del(record, index)"
								src="@sub/assets/imgs/trade/del-icon.png"
								alt=""
								v-if="editShowDelete || !item.typeName || item.type == 1"
							/>
						</a-tooltip>
					</div>
				</div>
			</div>
		</a-table>
		<img
			:src="previewImg"
			style="display: none"
			ref="viewer"
			v-viewer
		/>
		<div
			class="del-modal slModal"
			v-if="delVisible"
		>
			<div class="mask">
				<div class="content">
					<span
						class="ant-modal-close-x del-icon"
						@click="delVisible = false"
					></span>
					<div class="title-box">
						<ConfirmIcon></ConfirmIcon>
						<span class="title">确认删除</span>
					</div>
					<div class="tip">确认要删除该附件吗，删除后无法恢复</div>
					<div class="footer">
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
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
const columns = [
	{ title: '单据类型', dataIndex: 'label', scopedSlots: { customRender: 'label' }, width: 210 },
	{ title: '文件名称', dataIndex: 'fileList', scopedSlots: { customRender: 'fileList' } }
];
import ENV from '@/v2/config/env';
import { mapGetters } from 'vuex';

import { commonUpload } from 'api';
import moment from 'moment';
import { GetCurrentDate } from '@/v2/utils/factory';
import { getOfficeFileViewUrl } from '@/v2/utils/factory';
import { ConfirmIcon } from '@sub/components/svg';
export default {
	props: {
		list: {
			default: () => {
				return [];
			}
		}
	},
	data() {
		return {
			isSpread: false,
			columns,
			dataSource: [],
			delVisible: false,
			currentIndex: 0,
			currentItem: {},
			previewImg: '',
			fileList: [],
			beginUpload: false,
			type: null,
			uploadFileList: [],
			editShowDelete: true,
			// 提示
			tipsList: [
				{
					tip: '可支持格式为png，jpeg，jpg，gif，pdf，doc，docx，xlsx，xls的附件，单个附件大小不得超过100M的文件'
				}
			]
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
			const item = this.dataSource.find(el => el.key == this.type) || {};
			return item.accept || '';
		}
	},
	watch: {
		list: {
			handler(arr) {
				this.dataSource = [];
				arr.forEach(el => {
					this.dataSource.push({
						...el,
						fileList: []
					});
				});
			},
			immediate: true
		},
		uploadFileList(val) {
			if (val.length) {
				const item = this.dataSource.find(el => el.key == this.type) || {};
				const list = item.fileList;

				val.forEach(el => {
					this.handleUpload(el);
				});
			}
		}
	},
	methods: {
		init(list) {
			// 线下合同
			const contractAttachment = list || [];

			this.$nextTick(() => {
				contractAttachment.forEach(el => {
					el.fileUrl = el.url;
					el.fileName = el.name;
					const item = this.dataSource.find(el2 => el2.key == el.type);

					if (item) {
						item.fileList.push(el);
					}
				});
			});
		},
		clearData() {
			this.dataSource.forEach(el => {
				el.fileList = [];
			});
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
			this.$emit('loading', true);
			const formData = new FormData();
			formData.append('file', file);
			try {
				const res = await commonUpload(formData);

				const obj = res.data;

				const item = this.dataSource.find(el => el.key == this.type) || {};
				obj.uploadTime = moment().format('YYYY-MM-DD HH:mm:ss');
				obj.name = obj.fileName;

				obj.url = obj.fileUrl;
				item.fileList.push(obj);

				this.$forceUpdate();
			} catch (err) {
				console.log(err);

				const tip = err?.data?.error?.message ? `上传失败${JSON.stringify(err?.data?.error?.message)},请重试` : '上传失败,请重试';
				this.$message.error(tip);
			} finally {
				this.fileImgList = [];
				this.$emit('loading', false);
				this.beginUpload = false;
			}
		},
		fileChange(info) {
			// console.log(info)
		},
		save(type) {
			// 判断当前是否有必填项
			const item = this.dataSource.find(el => el.required && !el.fileList.length);
			if (type !== 'save' && item) {
				this.$message.error(`请上传${item.label}`);
				return false;
			}

			let newAttachList = [];
			this.dataSource.forEach(el => {
				el.fileList &&
					el.fileList.forEach(el2 => {
						newAttachList.push({
							type: el.key,
							url: el2.url || el2.fileUrl,
							name: el2.name,
							uploadTime: el2.uploadTime,
							dataSource: 1,
							md5Hex: el2.md5Hex,
							id: el2.id || undefined
						});
					});
			});

			return newAttachList;
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
			//
		},
		saveDel() {
			const item = this.dataSource.find(el => el.key == this.currentItem.key) || {};
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
			let url = data.fileUrl || data.url || data.path;

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
			if (['doc', 'docx', 'xlsx', 'xls'].includes(fileFormat)) {
				window.open(getOfficeFileViewUrl(url), '_blank');
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
		// margin-top: 20px;
		// margin-bottom: 16px;
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
.del-modal {
	position: relative;
	.mask {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		z-index: 9999;
	}
	.content {
		position: absolute;
		top: 50%;
		left: 50%;
		background: #fff;
		transform: translateX(-50%) translateY(-50%);
		width: 460px;
		border: 0;
		border-radius: 4px;
		padding: 20px;
		padding-top: 30px;
		.del-icon {
			position: absolute;
			top: 0;
			right: 0;
			cursor: pointer;
		}
		.footer {
			margin-top: 20px;
			display: flex;
			justify-content: flex-end;
			align-items: center;
		}
	}
}
</style>
