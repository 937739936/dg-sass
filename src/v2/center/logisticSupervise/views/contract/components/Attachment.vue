<template>
	<div class="attachment">
		<a-spin
			tip="上传中..."
			v-if="beginUpload"
			class="loading"
		/>
		<div
			class="tips"
			v-if="tipsList[0]"
		>
			<p class="handle">
				<span>{{ tipsList[0] && tipsList[0].tip }}</span>
			</p>
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
		<ImageViewer ref="imageViewer" />
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
						<img
							src="@sub/assets/imgs/trade/warning.png"
							style="width: 20px"
							alt=""
						/>
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
	{ title: '单据类型', dataIndex: 'label', scopedSlots: { customRender: 'label' }, width: 240 },
	{ title: '文件名称', dataIndex: 'fileList', scopedSlots: { customRender: 'fileList' } }
];
import { mapGetters } from 'vuex';
import { commonUpload } from '@/v2/center/logisticSupervise/api/settle';

import moment from 'moment';
import cloneDeep from 'lodash/cloneDeep';
import ImageViewer from '@sub/components/viewer/image.vue';

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
			tipsList: []
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
			// 当前只允许有多张图片 或一张pdf
			return item.accept || '.jpg,.jpeg,.png,.bmp,.pdf';
		}
	},
	watch: {
		list: {
			handler(arr) {
				const dataSource = cloneDeep(this.dataSource);
				this.tipsList = arr.filter(el => el.tip);
				const contractAttachment = arr || [];
				const newArr = [];
				this.$nextTick(() => {
					contractAttachment.forEach(el => {
						const item = dataSource.find(el2 => el2.key == el.key);
						console.log('this.dataSource', this.dataSource, item);
						if (!item) {
							newArr.push({
								...el,
								fileList: []
							});
						} else {
							newArr.push(item);
						}
					});
					this.dataSource = cloneDeep(newArr);
				});
			},
			immediate: true
		},
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
			const contractAttachment = list || [];

			this.$nextTick(() => {
				contractAttachment.forEach(el => {
					el.fileUrl = el.fileUrl || el.url;
					el.name = el.fileName || el.name;
					const item = this.dataSource.find(el2 => el2.key == el.type);

					if (item) {
						item.fileList.push(el);
					}
				});
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
			const formData = new FormData();
			formData.append('file', file);
			formData.append('terminalContractId', '');

			try {
				const res = await commonUpload(formData);

				const obj = res.data;

				const item = this.dataSource.find(el => el.key == this.type) || {};
				obj.uploadTime = moment().format('YYYY-MM-DD HH:mm:ss');

				item.fileList.push(obj);

				this.$forceUpdate();
			} catch (err) {
				console.log(err, 1111);

				const tip = err?.data?.error?.message ? `上传失败${JSON.stringify(err?.data?.error?.message)},请重试` : '上传失败,请重试';
				this.$message.error(tip);
			} finally {
				this.fileImgList = [];
				this.beginUpload = false;
			}
		},
		fileChange(info) {
			// console.log(info)
		},
		save() {
			// 判断当前是否有必填项
			return new Promise(resolve => {
				const item = this.dataSource.find(el => el.required && !el.fileList.length);
				if (item) {
					this.$message.error(`缺少${item.label}附件`);
					resolve(false);
				}
				let newAttachList = [];
				this.dataSource.forEach(el => {
					el.fileList &&
						el.fileList.forEach(el2 => {
							newAttachList.push({
								...el2,
								type: el.key,
								url: el2.url || el2.fileUrl,
								path: el2.path,
								name: el2.name || el2.fileName,
								uploadTime: el2.uploadTime,
								dataSource: 1,
								md5Hex: el2.md5Hex
							});
						});
				});
				resolve(newAttachList);
			});
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
			this.$refs.imageViewer.showFile(url);
		}
	},
	components: {
    ImageViewer
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
		color: @primary-color;
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
	/deep/ .ant-table-tbody > tr > td:nth-child(2) {
		border-right: 1px solid #e5e6eb;
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
