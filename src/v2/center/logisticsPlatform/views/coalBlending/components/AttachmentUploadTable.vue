<template>
	<div>
		<div class="tip-box">
			<div
				class="spread-box"
				v-if="isShowSpread"
			>
				<span
					v-show="!isSpread"
					class="spread-btn"
					@click="isSpread = true"
					>展开
					<img
						class="icon"
						src="@/v2/assets/imgs/contract/arrow-down.png"
						alt=""
					/>
				</span>
				<span
					v-show="isSpread"
					class="spread-btn"
					@click="isSpread = false"
				>
					收起
					<img
						class="icon"
						src="@/v2/assets/imgs/contract/arrow-up.png"
						alt=""
					/>
				</span>
			</div>
			<div v-if="tip">
				<p>
					{{ tip }}
				</p>
			</div>
			<div v-else>
				<p
					v-for="(item, index) in tipList"
					:key="index"
				>
					<span class="tip-title">{{ item.title }}:</span> {{ item.tip }}
				</p>
			</div>
		</div>
		<!-- 附件表格 -->
		<div class="table-box">
			<a-table
				:columns="columns"
				class="new-table"
				bordered
				:rowKey="(record, index) => String(index)"
				:dataSource="attachmentDataSource"
				:pagination="false"
			>
				<div
					slot="typeName"
					slot-scope="typeName, record, index"
					class="typeName"
				>
					<div style="margin-right: 20px; line-height: 24px">
						<span
							class="red"
							:style="{ color: record.required ? 'red' : 'transparent' }"
							>*</span
						>
						<span>{{ typeName }}</span>
					</div>
					<a-upload
						:headers="headers"
						:beforeUpload="(file, fileList) => beforeUpload(file, fileList, index)"
						:accept="
							record.acceptFile
								.map(item => {
									return `.${item}`;
								})
								.toString()
						"
						:action="action"
						:data="uploadParams"
						:showUploadList="false"
						:multiple="true"
						:fileList="record.uploadingFileList"
						@change="e => fileChange(e, record, index)"
						name="file"
					>
						<a-button
							type="primary"
							ghost
							size="small"
							class="upload"
							:disabled="record.isUploading"
						>
							{{ record.isUploading ? '上传中' : '上传' }}
						</a-button>
					</a-upload>
				</div>
				<div
					class="nameMain"
					slot="name"
					slot-scope="name, record, index"
				>
					<a-tooltip
						v-for="(item, fileIndex) in record.attachmentList"
						:key="fileIndex"
					>
						<template slot="title"> 上传时间：{{ item.createTime }} </template>
						<div class="nameEdit">
							<span @click="filePreview(item)">{{ item.name }}</span>
							<a-popconfirm
								title="确认删除？"
								@confirm="toDelete(item, record, index)"
							>
								<img
									class="del"
									src="@sub/assets/imgs/trade/del-icon.png"
									alt=""
								/>
							</a-popconfirm>
						</div>
						<!-- <div class="name">
              <span @click="fileLook(item)">{{
                item.name || item.fileName
              }}</span>
            </div> -->
					</a-tooltip>
				</div>
				<template
					slot="active"
					slot-scope="active, record"
				>
					<a @click="download(record)">下载</a>
				</template>
			</a-table>
		</div>
		<ImageViewer ref="imageViewer" />
	</div>
</template>

<script>
import moment from 'moment';
import { API_UPLOAD_WATER_MARk } from '@/v2/api/upload';
import { mapGetters } from 'vuex';
import ImageViewer from '@sub/components/viewer/image.vue';

const defaultAcceptFiles = ['jpg', 'jpeg', 'png', 'pdf'];
export default {
	name: 'AttachmentUploadTable',
	components: { ImageViewer },
	props: {
		isShowTip: Boolean, // 是否显示tip
		uploadModule: String, // 附件上传的模块
		// 提醒文案
		tip: {
			type: String,
			default: ''
		},
		uploadUrl: {
			type: String,
			default: undefined
		},
		dataSource: {
			type: Array,
			default: () => {
				/*
          type: 81,
          typeName: "付款回单",
          required: true,
          acceptFile: ["jpg", "jpeg", "png", "pdf"],
          maxSize: 100,
          attachmentList: [], // 附件列表
          multiple: true, // 是否运行多文件上传
        */
				return [];
			}
		}
	},
	data() {
		return {
			uploadParams: {
				module: this.uploadModule
			},
			isSpread: true,
			attachmentDataSource: []
			// fileDateTree: fileDateTree,
			// fileUploadStatusTree: fileUploadStatusTree,
		};
	},
	computed: {
		//附件地址
		action() {
			return this.uploadUrl || API_UPLOAD_WATER_MARk;
		},
		...mapGetters('user', {
			VUEX_ST_TOKEN: 'VUEX_ST_TOKEN'
		}),
		headers() {
			return {
				Authorization: this.VUEX_ST_TOKEN,
				Source: 'PC'
			};
		},
		propsDataSource() {
			let list = this.dataSource.map(item => {
				// type: 81,
				//   typeName: "付款回单",
				//   acceptFile: ["jpg", "jpeg", "png", "pdf"],
				//   required: true,
				//   maxSize: 100,
				//   attachmentList: [], // 附件列表
				//   multiple: true, // 是否运行多文件上传
				return {
					type: item.type,
					typeName: item.typeName,
					acceptFile: item.acceptFile ?? defaultAcceptFiles,
					required: item.required ?? false,
					maxSize: item.maxSize ?? 100, // 最大大小（M）
					attachmentList: item.attachmentList ?? [], // 已上传列表
					uploadingFileList: [], //正上传的列表
					isUploading: false
				};
			});
			return list;
		},
		//表头
		columns() {
			let columns = [
				{
					title: '单据类型',
					dataIndex: 'typeName',
					width: 210,
					scopedSlots: { customRender: 'typeName' }
				},
				{
					title: '文件名称',
					dataIndex: 'name',
					align: 'left',
					scopedSlots: { customRender: 'name' }
				}
			];
			return columns;
		},
		// 是否展示展开收起按钮
		isShowSpread() {
			if (this.attachmentDataSource.length > 1) {
				return true;
			}
			return false;
		},
		// tip 提醒列表
		tipList() {
			let list = [];
			for (let index = 0; index < this.attachmentDataSource.length; index++) {
				const element = this.attachmentDataSource[index];
				let title = element.typeName;
				let isRequerd = element.required ? '必填' : '非必填';
				let acceptText = element.acceptFile.join('，');
				let maxSize = element.maxSize + 'M';
				let tip = `${isRequerd}，可支持格式为${acceptText}的附件，单个附件大小不超过${maxSize}的文件`;
				list.push({
					title: title,
					tip: tip
				});
				if (index == 0 && !this.isSpread) {
					break;
				}
			}
			return list;
		},
		attachmentList() {
			let list = [];
			this.attachmentDataSource.map(fileRow => {
				let attachmentList = fileRow.attachmentList ?? [];
				list = list.concat(attachmentList);
			});
			return list;
		}
	},
	watch: {
		propsDataSource: {
			immediate: true,
			handler(newList) {
				this.attachmentDataSource = newList;
			}
		}
	},
	methods: {
		//上传前校验
		beforeUpload(file, fileList, index) {
			const t = this;
			let record = this.attachmentDataSource[index];
			// 文件大小校验
			let maxSize = record.maxSize ?? 100;
			function fileTypeJudge() {
				if (file.size / 1024 / 1024 > maxSize) {
					t.$message.error(`单个附件大小不得超过${maxSize}M`);
					return true;
				}
				if (file.name.indexOf('/') > 0 || file.name.indexOf('\\') > 0 || file.name.indexOf('%') > 0) {
					t.$message.error('文件名不要包含特殊符号');
					return true;
				}
			}

			let ifOverSize = fileTypeJudge();
			if (ifOverSize) {
				return false;
			}

			// 文件类型校验
			const allowFormat = record.acceptFile;
			let errMsg = '';
			let ext = file.name.split('.')[file.name.split('.').length - 1].toLowerCase();
			if (allowFormat.indexOf(ext) == -1) {
				allowFormat.forEach(item => {
					errMsg += item + ' ';
				});
				t.$message.error(`请上传${errMsg}类型的文件`);
				return false;
			}

			let uploadingFileList = record.uploadingFileList;
			uploadingFileList.push(file);
			this.$set(record, 'isUploading', true);
			this.$set(record, 'uploadingFileList', uploadingFileList);
			return true;
		},
		//文件上传
		fileChange(e, record, index) {
			let { file, fileList } = e;
			let uploadingList = fileList ?? [];
			let isContainUploading = uploadingList.some(item => {
				return item.status == 'uploading';
			});
			if (file.status == 'done') {
				// 上传成功
				let attachmentList = this.attachmentDataSource[index].attachmentList ?? [];
				// let fileData = file.response;
				let fileData = file.response.data; // 更换原有上传接口需要展示名称

				let newFile = {
					...fileData,
					name: fileData.fileName || fileData.name, // 更换原有上传接口需要展示名称
					createTime: fileData.createTime ?? moment().format('YYYY-MM-DD HH:mm:ss'),
					type: record.type,
					typeName: record.typeName
				};
				attachmentList.push(newFile);
				this.$set(this.attachmentDataSource[index], 'attachmentList', attachmentList);
			}
			let isContainNoStatus = uploadingList.some(item => {
				if (item.status) {
					return false;
				}
				return true;
			});
			if (isContainNoStatus || isContainUploading) {
				return;
			}
			if (!isContainUploading) {
				// 不包含上传状态时 改变按钮状态
				let errorNames = [];
				let doneFileList = [];
				uploadingList.map(item => {
					if (item.status == 'error') {
						errorNames.push(item.name);
					}
					if (item.status == 'done') {
						let fileData = item.response;
						let newFile = {
							createDate: moment().format('YYYY-MM-DD HH:mm:ss'),
							...fileData,
							name: fileData.fileName || fileData.name, // 更换原有上传接口需要展示名称
							type: record.type,
							typeName: record.typeName
						};
						doneFileList.push(newFile);
					}
				});
				if (errorNames.length > 0) {
					let errorNameString = errorNames.join('，');
					this.$message.error(`${record.typeName}: ${errorNameString}上传失败！`);
				}
				this.$set(this.attachmentDataSource[index], 'isUploading', false);
				this.$set(this.attachmentDataSource[index], 'uploadingFileList', []);
			}
		},
		//查看附件
		filePreview(data) {
			let url = data?.fileUrl || data?.path || data?.url
			if (!url) return
			this.$refs.imageViewer.showFile(url);
		},
		//删除附件
		toDelete(data, record, index) {
			let fileList = this.attachmentDataSource[index].attachmentList;
			if (data.uid) {
				//表示当前文件为新上传删除
				fileList = fileList.filter(item => item.uid !== data.uid);
			} else if (data.id) {
				fileList = fileList.filter(item => item.id !== data.id);
			} else if (data.fileUrl) {
				fileList = fileList.filter(item => item.fileUrl !== data.fileUrl);
			}
			// this.$set(this.attachmentDataSource[index], "attachmentList", fileList);
			this.$set(this.attachmentDataSource[index], 'attachmentList', fileList);
		},
		//下载
		download(data) {
			// this.$refs.fileLook.fileDown(data);
			//判断是否有下载函数
			if (this.$listeners.download) {
				this.$emit('download', data);
				return;
			}
			this.$refs.fileLook.fileDown(data.fileList[0]);
		},
		//获取数据校验
		validateAttachmentFiels() {
			return new Promise((resolve, reject) => {
				for (let index = 0; index < this.attachmentDataSource.length; index++) {
					const item = this.attachmentDataSource[index];
					if (item.required && !item.attachmentList?.length) {
						let message = `请上传${item.typeName}`;
						this.$message.error(message);
						reject(message);
						return;
					}
					if (item.isUploading) {
						let message = `${item.typeName}正在上传中请稍后`;
						this.$message.error(message);
						reject(message);
					}
				}
				resolve(this.attachmentList);
			});
		}
	}
};
</script>

<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
.tip-box {
	display: flex;
	flex-direction: column;
	padding: 10px;
	border-radius: 4px;
	border: 1px solid #d0dfff;
	background: #e1eafe;
	color: rgba(0, 0, 0, 0.8);
	font-size: 12px;
	line-height: 22px;
	margin-top: 20px;
	position: relative;
	overflow: hidden;

	.spread-box {
		position: absolute;
		right: 10px;
		top: 10px;
		cursor: pointer;
		font-size: 12px;
		color: #4682f3;
		spread-btn {
			font-size: 12px;
			color: #4682f3;
		}
		.icon {
			color: #4682f3;
			font-size: 12px;
			width: 12px;
			height: 12px;
			margin-bottom: 2px;
			// vertical-align: sub;
			img {
				width: 12px;
				height: 12px;
			}
		}
	}
	.tip-title {
		font-weight: 600;
	}
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
}

.typeName {
	display: flex;
	align-items: center;
	justify-content: space-between;
	font-size: 14px;
	color: rgba(0, 0, 0, 0.8);
	.red {
		color: red;
		vertical-align: middle;
		margin-right: 5px;
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
}

.nameMain {
	white-space: normal;
	color: @primary-color;
	font-size: 14px;
	font-style: normal;
	font-weight: 400;
	line-height: 14px; /* 100% */
	.nameEdit {
		background: #f3f5f6;
		display: inline-block;
		margin: 2px 8px;
		border-radius: 4px;
		padding: 6px;
		span {
			cursor: pointer;
			vertical-align: middle;
		}
		.del {
			width: 14px;
			cursor: pointer;
			vertical-align: middle;
			margin-left: 8px;
		}
	}
	.name {
		display: inline-block;
		border-left: 1px solid #e9effc;
		padding: 0px 14px;
		line-height: 14px;
		margin: 6px 0;
		&:first-child {
			border: 0;
		}
	}
}
</style>
