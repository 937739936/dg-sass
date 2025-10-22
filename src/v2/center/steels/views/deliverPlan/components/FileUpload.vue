<template>
	<div>
		<div>
			<a-table
				class="new-table-file"
				:dataSource="fileData"
				:columns="newColumns"
				:rowKey="record => record.fileId"
				:pagination="false"
			>
				<template
					slot="operation"
					slot-scope="text, record"
				>
					<a-space :size="24">
						<a @click.prevent="download(record)">下载</a>
						<a @click.prevent="handlePreview(record)">查看</a>
						<a-popconfirm
							title="是否删除该附件信息?"
							okText="确定"
							cancelText="取消"
							@confirm="() => onDelete(record)"
						>
							<a
								href="javascript:;"
								class="delete-btn"
								v-if="ifEditable"
								>删除</a
							>
						</a-popconfirm>
					</a-space>
				</template>
			</a-table>
		</div>
		<div class="modal-wrap">
			<a-modal
				title="附件信息"
				centered
				v-model="modalFileWrapIsShow"
				okText="确定"
				cancelText="取消"
				:maskClosable="false"
				@ok="modalFormSubmit"
				@cancel="modalCancel"
				width="404px"
				class="slModal"
			>
				<template
					slot="footer"
					v-if="!ifEditable"
				>
					<a-button
						key="submit"
						@click="modalCancel"
						>取消</a-button
					>
				</template>
				<a-form
					:form="modalFileForm"
					class="slFormDetail"
				>
					<a-row class="row">
						<a-col :span="24">
							<a-form-item
								label="附件类型"
								:colon="false"
								style="height: 82px"
							>
								<a-select
									style="width: 364px"
									placeholder="请选择附件类型"
									@change="handleFileTypeChange"
									labelInValue
									:disabled="!ifEditable"
									v-decorator="['attachmentType', { rules: [{ required: true, message: '请选择附件类型' }] }]"
								>
									<!-- 发货计划 -->
									<template v-if="type == 'deliverPlan'">
										<a-select-option
											value="RAILWAY_TICKET"
											v-if="transType === 'TRAIN'"
											>大票</a-select-option
										>
										<a-select-option value="SHIPMENT_PLAN_PARTICULARS">钢厂发货计划清单</a-select-option>
										<a-select-option value="OTHER">其他</a-select-option>
									</template>
								</a-select>
							</a-form-item>
						</a-col>
					</a-row>
					<a-row class="row">
						<a-col :span="24">
							<a-form-item
								label="附件"
								:colon="false"
								:class="ifEditable ? '' : 'unEditable'"
							>
								<a-upload
									:headers="headers"
									v-decorator="['uploadFiles', { rules: [{ required: true, message: '请选择附件' }] }]"
									:beforeUpload="beforeUpload"
									:action="action"
									:multiple="true"
									listType="picture-card"
									:fileList="fileList"
									@preview="handlePreview"
									@change="fileChange"
									name="file"
									:remove="removeFile"
								>
									<div v-if="ifEditable && fileList.length < 100">
										<i class="file_icon"></i>
									</div>
								</a-upload>
							</a-form-item>
							<div
								:class="fileList.length > 1 ? 'file-notice mt0' : 'file-notice'"
								v-if="ifEditable"
							>
								<p>附件上传要求：</p>
								<!-- 发货计划 -->
								<div v-if="type === 'deliverPlan'">
									<div v-if="transType === 'TRAIN'">
										<p>1.铁路大票必须是图片（jpg、jpeg、png、pdf）。</p>
										<p>2.钢厂发货清单可支持格式为png、jpeg、jpg、pdf、doc、docx、xlsx、xls的附件。</p>
										<p>3.其他类型附件可支持格式为png、jpeg、jpg、pdf、doc、docx、xlsx、xls的附件。</p>
										<p>4. 单个附件大小不得超过100M。</p>
									</div>
									<div v-else>
										<p>1.钢厂发货清单可支持格式为png、jpeg、jpg、pdf、doc、docx、xlsx、xls的附件。</p>
										<p>2.其他类型附件可支持格式为png、jpeg、jpg、pdf、doc、docx、xlsx、xls的附件。</p>
										<p>3. 单个附件大小不得超过100M。</p>
									</div>
								</div>
							</div>
						</a-col>
					</a-row>
				</a-form>
			</a-modal>
		</div>
		<!-- encodeURI图片地址解决图片地址含有中文及特殊符号无法预览问题 -->
		<img
			:src="previewImg"
			style="display: none"
			ref="viewer"
			v-viewer
		/>
	</div>
</template>
<script>
import { API_GETCURRENTENV, API_GetDownloadRAR } from '@/v2/api';
import { API_SteelsUploadFileWaterMark } from '@/v2/center/steels/api';
import comDownload from '@sub/utils/comDownload.js';
import { mapGetters, mapMutations } from 'vuex';
import { API_getCommonDownload } from '@/v2/center/trade/api/goodsTransfer';
const columns = [
	{
		title: '类型',
		dataIndex: 'attachmentTypeDesc',
		width: '40%'
	},
	{
		title: '文件名称',
		dataIndex: 'name',
		width: '30%'
	},
	{
		title: '操作',
		dataIndex: 'operation',
		scopedSlots: { customRender: 'operation' },
		width: '30%'
	}
];
export default {
	name: 'FileUpload',
	props: {
		ifEditable: {
			required: true,
			default: false
		},
		fileDataSource: {
			default() {
				return [];
			}
		},
		type: {
			required: true,
			default: ''
		},
		// 运输方式 汽运|火运|汽运和火运｜船运
		transType: {
			default: ''
		}
	},
	watch: {
		fileDataSource: {
			handler(val) {
				this.init();
			},
			deep: true,
			immediate: true
		}
	},
	data() {
		return {
			myallowFormat: {
				RAILWAY_TICKET: ['jpg', 'jpeg', 'png', 'pdf', 'pdf'],
				SHIPMENT_PLAN_PARTICULARS: ['png', 'jpeg', 'jpg', 'pdf', 'doc', 'docx', 'xlsx', 'xls'],
				OTHER: ['png', 'jpeg', 'jpg', 'pdf', 'doc', 'docx', 'xlsx', 'xls']
			},
			fileData: [],
			previewImg: '',
			modalFileWrapIsShow: false,
			modalFileForm: this.$form.createForm(this),
			action: API_SteelsUploadFileWaterMark,
			fileList: [],
			ifAddStatus: false,
			modifyIndex: 0,
			resultData: [],
			allowFormat: []
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
		newColumns() {
			if (this.columns) {
				return this.columns;
			}
			return columns;
		}
	},
	methods: {
		...mapMutations({
			VUEX_MU_LOADING: 'config/VUEX_MU_LOADING'
		}),
		handleFileTypeChange(value) {
			this.allowFormat = this.myallowFormat[value.key];
		},
		handlePreview(data) {
			let url = '';
			if (data.response) {
				url = data.response.data.path;
			}
			if (data.attachmentPath) {
				url = data.attachmentPath;
			}
			if (!url) {
				return;
			}
			this.previewImg = url;
			const fileFormat = this.previewImg.split('?')[0].split('.').pop().toLowerCase();
			if (['pdf'].includes(fileFormat)) {
				window.open(this.previewImg, '_blank');
				return;
			}
			if (['doc', 'docx', 'xlsx', 'xls'].includes(fileFormat)) {
				const jumpUrl = 'https://view.officeapps.live.com/op/view.aspx?src=' + encodeURIComponent(API_GETCURRENTENV(url));
				window.open(jumpUrl, '_blank');
				return;
			}
			if (['rar', 'zip'].includes(fileFormat)) {
				if (data.attachId) {
					API_GetDownloadRAR(data.attachId).then(res => {
						comDownload(res, undefined, data.name);
					});
				} else {
					window.open(this.previewImg, '_blank');
				}
				return;
			}
			this.$refs.viewer.$viewer.show();
		},
		init() {
			this.fileData = this.fileDataSource;
			var key = 1;
			this.fileDataSource.forEach(item => {
				const fileList = [];
				item.attachmentPath.split(',').forEach(it => {
					fileList.push({
						uid: key++,
						name: it,
						status: 'done',
						attachmentPath: API_GETCURRENTENV(it)
					});
				});
			});
			this.sendToFather();
		},
		editFileInfo(record, index) {
			this.modalFileWrapIsShow = true;
			this.modifyIndex = index;
			this.ifAddStatus = false;
			this.fileList = [];
			this.$nextTick(() => {
				this.modalFileForm.setFieldsValue({
					attachmentType: { key: record.type, label: record.attachmentTypeDesc },
					uploadFiles: record.uploadFiles
				});
			});
			this.fileList = record.uploadFiles.fileList;
		},
		modalFormSubmit() {
			this.modalFileForm.validateFields((err, values) => {
				if (!err) {
					if (this.fileList.length == 0) {
						this.$message.error('请上传文件');
						return;
					}
					if (this.beginUpload) return; //如果有正在上传的文件 不能点击确定关闭
					// 判断是新增还是修改
					if (this.ifAddStatus) {
						this.$message.success('添加成功');
						values.uploadFiles.fileList.forEach(item => {
							this.fileData.push({
								fileId: item.response.data.id,
								key: values.attachmentType.key,
								attachmentType: values.attachmentType.key,
								attachmentTypeDesc: values.attachmentType.label,
								dataSource: 1, // 来源，（1-交易上传；2-OA回传， 3-资产审核上传）
								name: item.response.data.name,
								attachmentPath: item.response.data.path,
								md5Hex: item.response.data.md5Hex,
								...item.response
							});
						});
					} else {
						// 无用代码
						if (this.ifEditable) {
							this.$message.success('修改成功');
							this.fileData.splice(this.modifyIndex, 1, {
								key: values.attachmentType.key,
								attachmentType: values.attachmentType.key,
								attachmentTypeDesc: values.attachmentType.label,
								uploadFiles: values.uploadFiles
							});
						}
					}
					this.fileList = [];
					this.modalFileWrapIsShow = false;
					this.modalFileForm.resetFields();
					this.sendToFather();
				}
			});
		},
		sendToFather() {
			this.resultData = [];
			let attachmentType = [];
			this.fileData.forEach(item => {
				attachmentType.push(item.attachmentType);
			});
			attachmentType = [...new Set(attachmentType)];

			attachmentType.forEach(item => {
				let arr = [];
				const obj = {};
				this.fileData.forEach(i => {
					if (item == i.attachmentType) {
						arr = [...arr, i.attachmentPath];
					}
				});
				obj[item] = arr.join(',');
				this.resultData.push(obj);
			});
			this.$emit('uploadFiles', this.fileData);
		},

		toDelete(data) {
			const fileData = [...this.fileData];
			this.fileData = fileData.filter(item => item.attachmentPath !== data.attachmentPath);
			this.sendToFather();
		},

		onDelete(data) {
			this.toDelete(data);
		},
		modalCancel() {
			this.fileList = [];
			this.modalFileWrapIsShow = false;
			this.modalFileForm.resetFields();
		},

		fileChange({ fileList, event, file }) {
			this.fileList = fileList;
			this.beginUpload = true;
			this.VUEX_MU_LOADING(true);
			if (!fileList.length) {
				this.VUEX_MU_LOADING(false);
				this.beginUpload = false;
			}
			if (fileList.length && fileList[fileList.length - 1].status == 'done') {
				this.VUEX_MU_LOADING(false);
				this.beginUpload = false;
			}
		},
		beforeUpload(file) {
			const allowFormat = this.allowFormat;
			let isAllowFormat = false;
			if (allowFormat.indexOf(file.name.split('.')[file.name.split('.').length - 1].toLowerCase()) == -1) {
				this.$message.error('仅支持' + allowFormat.join('，') + '的格式');
				isAllowFormat = false;
			} else {
				isAllowFormat = true;
			}

			const t = this;
			function fileTypeJudge() {
				if (
					(file.name.indexOf('.jpg') > 0 ||
						file.name.indexOf('.jpeg') > 0 ||
						file.name.indexOf('.png') > 0 ||
						file.name.indexOf('.gif') > 0 ||
						file.name.indexOf('.pdf') > 0 ||
						file.name.indexOf('.docx') > 0 ||
						file.name.indexOf('.doc') > 0 ||
						file.name.indexOf('.xls') > 0 ||
						file.name.indexOf('.xlsx') > 0 ||
						file.name.indexOf('.rar') > 0 ||
						file.name.indexOf('.zip') > 0) &&
					file.size / 1024 / 1024 > 100
				) {
					// t.$message.error("该格式附件不能大于10M，请重新选择");
					t.$message.error('单个附件大小不得超过100M');
					return true;
				}
				if (file.name.indexOf('/') > 0 || file.name.indexOf('\\') > 0 || file.name.indexOf('%') > 0) {
					t.$message.error('文件名不要包含特殊符号');
					return true;
				}
			}

			let ifOverSize = fileTypeJudge();

			return new Promise((resolve, reject) => {
				if (isAllowFormat && !ifOverSize) {
					return setTimeout(() => {
						resolve(file);
					}, 1);
				} else {
					return setTimeout(() => {
						reject(file);
					}, 1);
				}
			});
		},
		addFileType() {
			this.modalFileWrapIsShow = true;
			this.ifAddStatus = true;
		},
		removeFile() {
			if (!this.ifEditable) {
				this.$message.error('不能删除');
				return false;
			} else {
				if (this.fileList.length <= 1) {
					this.fileList = [];
				}
			}
		},
		download(items) {
			// 下载
			API_getCommonDownload(items.attachmentPath).then(res => {
				comDownload(res, null, items.name);
			});
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less" scoped>
.slModal {
	/deep/.ant-modal-body {
		padding: 20px;
		max-height: 100% !important;
	}
	.slFormDetail {
		padding: 0;
		.ant-form-item {
			height: auto;
		}
	}
	label {
		width: 100px;
		display: inline-block;
		text-align: left;
	}
	.file_icon {
		margin: 0 auto;
		display: block;
		background: url(~@/v2/assets/imgs/upload/upload_files_icon.png) no-repeat center center;
		width: 32px;
		height: 32px;
	}
	.file-notice {
		font-size: 14px;
		line-height: 20px;
		zoom: 0.85;
		color: rgba(0, 0, 0, 0.4);
		margin-top: 10px;
	}
	.file-notice.mt0 {
		margin-top: 0;
	}
	.unEditable {
		.anticon-delete {
			display: none;
		}
	}
	/deep/.ant-upload.ant-upload-select-picture-card {
		width: 60px;
		height: 60px;
		background: #f3f5f6;
		/* 元素/Line */
		border: 1px dashed #e5e6eb;
		margin-bottom: 0px;
	}
	/deep/.ant-upload-picture-card-wrapper {
		margin-bottom: 10px;
	}
	/deep/.ant-upload-list-picture-card-container,
	/deep/.ant-upload-list-picture-card .ant-upload-list-item {
		width: 60px;
		height: 60px;
		margin-bottom: 10px;
	}
	/deep/.ant-upload-list-item-name {
		display: none;
	}
	/deep/.ant-upload-list-item-uploading-text {
		display: none !important;
	}
}
</style>
