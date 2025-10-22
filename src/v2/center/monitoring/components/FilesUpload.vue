<template>
	<div>
		<div
			class="category-upload-1"
			v-if="type.length > 1 || tabType == 'RiskControalWarning'"
		>
			<a-table
				:dataSource="fileData"
				:columns="tabType == 'RiskControalWarning' ? columnsWarning : columns"
				:pagination="false"
				rowKey="id"
			>
				<span
					slot="dataSource"
					slot-scope="dataSource, items"
				>
					{{ items.dataSource == '1' ? '内部管理系统' : '手动新增' }}
				</span>
				<template
					slot="operation"
					slot-scope="text, record, index"
				>
					<a
						href="javascript:;"
						class="edit-btn"
						@click="watchFileInfo(record, index)"
						>查看</a
					>
					<a-popconfirm
						v-if="fileData.length"
						title="确定删除该附件信息?"
						okText="确定"
						cancelText="取消"
						@confirm="() => onDelete(record)"
					>
						<a
							href="javascript:;"
							class="delete-btn"
							v-if="ifEditable && record.dataSource == 2"
							>删除</a
						>
						<!-- 系统同步的附件只能查看 不能删除 -->
					</a-popconfirm>
				</template>
			</a-table>
			<p
				class="add-wrap"
				@click="addFileType"
				v-if="ifEditable"
			>
				<i>+</i>新增附件
			</p>
		</div>
		<!-- 风控预警详情上传附件类型只有一种，但是遵循表格展示形式 -->
		<div v-if="type.length == 1 && tabType != 'RiskControalWarning'">
			<a-button
				style="width: 100% !important"
				type="primary"
				@click="addFileType"
				ghost
				v-if="ifEditable && fileData.length == 0"
			>
				上传附件
			</a-button>
			<span v-if="fileData.length > 0">
				<a-tooltip
					v-for="(item, index) in fileData"
					:key="index"
					:title="item.fileName"
				>
					<a
						class="ellipsis"
						@click="watchFileInfo(item, 0)"
						style="position: relative; top: 6px; margin-right: 10px;line-height: 20px;"
					>
						{{ item.fileName }}
					</a>
				</a-tooltip>
			</span>
		</div>
		<div class="modal-wrap">
			<a-modal
				title="附件信息"
				centered
				v-model="modalFileWrapIsShow"
				okText="确定"
				cancelText="取消"
				@ok="modalFormSubmit"
				@cancel="modalCancel"
				class="modal-file-info-upload-1"
				destroyOnClose
			>
				<template
					slot="footer"
					v-if="!ifEditable"
				>
					<a-button
						key="submit"
						@click="modalCancel"
					>
						取消
					</a-button>
				</template>
				<a-form
					:form="modalFileForm"
					:label-col="{ span: 6 }"
					:wrapper-col="{ span: 10 }"
				>
					<a-row>
						<!-- <a-col :span="24"> -->
						<a-form-item
							label="附件类型"
							:colon="false"
						>
							<a-select
								style="width: 200px"
								placeholder="请选择"
								labelInValue
								:disabled="!ifEditable"
								v-decorator="['fileType', { rules: [{ required: true, message: '请选择附件类型' }] }]"
							>
								<template v-for="(item, index) in fileTypeList">
									<a-select-option
										:value="item.value"
										:disabled="item.disabled"
										:key="index"
										v-if="item.isShow"
									>
										{{ item.text }}
									</a-select-option>
								</template>
							</a-select>
						</a-form-item>
						<a-form-item
							label="附件"
							:colon="false"
							:class="ifEditable ? '' : 'unEditable'"
							v-decorator="['uploadFiles', { rules: [{ required: true, message: '请上传附件' }] }]"
						>
							<i-upload
								style="width: 200px; display: inline-block"
								list-type="picture-card"
								:accept="accept"
								:showUploadList="true"
								:limit="!ifEditable"
								:showDesc="false"
								:data="{ terminalContractId: contractId }"
								:action="type[0] == 1 ? actionOne : action"
								:multiple="true"
								:disabled="!ifEditable"
								@upload="uploadFile"
								:defaultFileList="fileList"
								:size="100"
							>
								<div v-if="ifEditable && fileList.length < 100">
									<a-icon type="plus" />
									<div class="ant-upload-text">点击选择</div>
								</div>
							</i-upload>
						</a-form-item>
						<div
							class="file-notice"
							v-if="ifEditable"
						>
							<p>附件上传要求：</p>
							<p>可支持格式为jpg，jpeg，png，gif，pdf，docx，doc，xlsx，xls的附件，单个附件大小不得超过100M的文件。</p>
						</div>
					</a-row>
				</a-form>
			</a-modal>
		</div>
		<image-viewer ref="imageViewer" />
	</div>
</template>
<script>
import {
	API_ContractAttachFilesUpload,
	API_DeleteSettlementFiles,
	API_DeleteContractFiles,
	API_DownstreamContractUpload
} from '@/v2/api/upload';
import { mapGetters, mapMutations } from 'vuex';
import iUpload from '@/v2/components/upload.vue';
import { filePreview } from '@/v2/utils/file';
import imageViewer from '@/v2/components/imageViewer.vue';
import { nanoid } from 'nanoid';

const apiObj = {
	settlement: {
		api: API_DeleteSettlementFiles,
		params: 'terminalStatementAttachmentId'
	},
	contract: {
		api: API_DeleteContractFiles,
		params: 'contractId'
	}
};
export default {
	name: 'FilesUpload',
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
			default: []
		},
		tabType: {
			default: ''
		},
		contractId: {
			type: [Number, String],
			default: ''
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
	watch: {
		fileDataSource: {
			immediate: true,
			handler(data) {
				const fileData = [];
				let typeName = '';
				data.forEach(item => {
					const fileList = []; // 编辑时恢复数据
					fileList.push({
						name: item.fileName,
						status: 'done',
						uid: item.id.toString(),
						type: item.ext,
						url: item.url || item.fileUrl,
						response: {
							success: true,
							data: {
								fileName: item.fileName,
								url: item.url || item.fileUrl,
								md5Hex: item.md5Hex
							}
						}
					});
					this.fileTypeList.forEach(i => {
						if (i.value == item.type) {
							typeName = i.text;
						}
					});
					fileData.push({
						uid: item.id.toString(),
						type: item.type,
						fileName: item.fileName,
						typeName,
						md5Hex: item.md5Hex,
						dataSource: item.dataSource,
						name: item.fileName,
						status: 'done',
						url: item.url || item.fileUrl,
						uploadFiles: {
							fileList
						}
					});
				});
				this.fileData = fileData;
				this.sendToFather();
			}
		},
		type() {
			this.filterAttachmentType();
		}
	},
	data() {
		return {
			fileData: [],
			columns: [
				{
					title: '类型',
					dataIndex: 'typeName',
					width: '20%'
				},
				{
					title: '来源',
					dataIndex: 'dataSource',
					key: 'dataSource',
					width: '20%',
					scopedSlots: { customRender: 'dataSource' }
				},
				{
					title: '文件名',
					dataIndex: 'fileName',
					width: '45%'
				},
				{
					title: '操作',
					width: '15%',
					dataIndex: 'operation',
					scopedSlots: { customRender: 'operation' }
				}
			],
			columnsWarning: [
				{
					title: '类型',
					dataIndex: 'typeName',
					width: '20%'
				},
				{
					title: '文件名',
					dataIndex: 'fileName',
					width: '45%'
				},
				{
					title: '操作',
					width: '15%',
					dataIndex: 'operation',
					scopedSlots: { customRender: 'operation' }
				}
			],
			modalFileWrapIsShow: false,
			modalFileForm: this.$form.createForm(this),
			action: API_ContractAttachFilesUpload, // 结算单、发票、回款、合同附件上传
			actionOne: API_DownstreamContractUpload, // 下游合同上传
			previewVisible: false,
			previewImage: '',
			fileList: [],
			ifAddStatus: false,
			modifyIndex: 0,

			// 如果是上游合同 则附件类型为：上游合同补充材料、其他材料
			fileTypeList: [
				// 完善合同附件类型
				{
					value: 'OFFLINE_CONTRACT',
					disabled: false,
					text: '买卖合同',
					isShow: false
				},
				{
					value: 'BCXY',
					disabled: false,
					text: this.$route.query.contractType == '0' ? '上游合同补充协议' : '下游合同补充协议',
					isShow: false
				},
				{
					value: 'JSD',
					disabled: false,
					text: '结算单',
					isShow: false
				},
				{
					value: 'COLLECTION_DJ',
					disabled: false,
					text: '回款单',
					isShow: false
				},
				{
					value: 'COLLECTION_QT',
					disabled: false,
					text: '其他材料',
					isShow: false
				},
				{
					value: 'RISK_ALERT_ZM_CL',
					disabled: false,
					text: '证明材料',
					isShow: false
				},
				{
					value: 'DESCRIPTION',
					disabled: false,
					text: '说明材料',
					isShow: false
				}
			],
			deg: 0,
			accept: '.jpg,.jpeg,.png,.gif,.pdf,.docx,.doc,.xlsx,.xls',
			uploadFileList: []
		};
	},
	components: {
		iUpload,
		imageViewer
	},
	methods: {
		...mapMutations({
			VUEX_MU_LOADING: 'config/VUEX_MU_LOADING'
		}),
		watchFileInfo(item) {
			filePreview(item.url || item.fileUrl, this.$refs.imageViewer.show);
		},
		uploadFile(file) {
			this.uploadFileList = file;
		},
		filterAttachmentType() {
			this.fileTypeList.forEach((item, index) => {
				this.fileTypeList[index].isShow = false;
				if (this.type.includes(item.value)) {
					this.fileTypeList[index].isShow = true;
				}
			});
		},
		editFileInfo(record, index) {
			// 编辑附件
			this.modalFileWrapIsShow = true;
			this.modifyIndex = index;
			this.ifAddStatus = false;
			this.fileList = [];
			this.$nextTick(() => {
				this.modalFileForm.setFieldsValue({
					fileType: { key: record.type, label: record.typeName },
					uploadFiles: record.uploadFiles
				});
			});
			this.fileList = record.uploadFiles.fileList;
			// 风控预警详情上传附件类型只有一种，类型选项可重复，可上传多次
			if (this.tabType === 'RiskControalWarning') return;
			this.repeatOptionJudge();
		},
		repeatOptionJudge() {
			// 类型选项不可重复
			this.fileTypeList.map(i => {
				i.disabled = false;
			});
			this.fileData.forEach(item => {
				if (item.type) {
					this.fileTypeList.map(i => {
						if (i.value == item.type) {
							i.disabled = true;
						}
					});
				}
			});
		},
		modalFormSubmit() {
			this.modalFileForm.validateFields((err, values) => {
				if (!err) {
					const flagArr = this.uploadFileList.map(item => item?.status);
					if (flagArr.includes('uploading')) {
						this.$message.warning('请等待文件上传完成');
						return;
					}
					if (flagArr.includes('error')) {
						this.$message.warning('文件上传失败请重试');
						return;
					}
					this.sendToFather();
					this.modalFileWrapIsShow = false;
					this.modalFileForm.resetFields();
				}
			});
		},
		sendToFather() {
			// 发送父组件
			this.uploadFileList.forEach((item, index) => {
				// 风控预警详情上传附件类型时，增加字段名
				if (this.tabType === 'RiskControalWarning') {
					item.name = item.fileName;
					item.typeName = item.typeName || this.modalFileForm.getFieldValue('fileType').label;
					item.dataSource = 2;
					item.type = item.type || this.modalFileForm.getFieldValue('fileType').key;
				}
			});
			const result = this.fileData.concat(this.uploadFileList);
			result.forEach((item, index) => {
				item.dataSource = 2;
				item.type = item.type || this.modalFileForm.getFieldValue('fileType').key;
				item.typeName = item.typeName || this.modalFileForm.getFieldValue('fileType').label;
				item.id = nanoid(4);
			});
			this.fileData = result;
			this.$emit('uploadFiles', result);
		},
		onDelete(record) {
			if (this.tabType === 'RiskControalWarning') {
				// 预警详情申诉
				const fileData = [...this.fileData];
				const result = fileData.filter(item => item.id !== record.id);
				this.uploadFileList = result;
				this.fileData = [];
				this.sendToFather();
				return;
			}
			const temp = apiObj[this.tabType].api;
			const { params } = apiObj[this.tabType];
			const obj = {};
			obj[params] = record.id;
			if (this.tabType == 'cash') {
				const fileData = [...this.fileData];
				const result = fileData.filter(item => item.id !== record.id);
				this.uploadFileList = result;
				this.fileData = [];
				this.sendToFather();
			} else {
				const fileData = [...this.fileData];
				const result = fileData.filter(item => item.id !== record.id);
				this.uploadFileList = result;
				this.fileData = [];
				this.sendToFather();
			}
		},
		modalCancel() {
			this.fileList = [];
			this.modalFileWrapIsShow = false;
			this.modalFileForm.resetFields();
		},
		handlePreviewCancel() {
			const ele = document.getElementById('preview-img-id');
			ele.style.transform = 'rotate(0deg)';
			this.deg = 0;
			this.previewVisible = false;
		},
		addFileType() {
			this.modalFileWrapIsShow = true;
			this.ifAddStatus = true;
			// 风控预警详情上传附件类型只有一种，类型选项可重复，可上传多次
			if (this.tabType === 'RiskControalWarning') return;
			this.repeatOptionJudge();
			this.filterAttachmentType();
		},
		removeFile() {
			if (!this.ifEditable) {
				this.$message.error('不能删除');
				return false;
			}
			if (this.fileList.length <= 1) {
				this.fileList = [];
			}
		}
	}
};
</script>
<style lang="less" scoped>
::v-deep .has-error .ant-form-explain {
	padding-left: 25%;
}
.category-upload-1 {
	.edit-btn {
		color: #1980ff;
		margin-right: 8px;
	}
	.delete-btn {
		color: #ff2929;
	}
	.line {
		padding: 0 10px;
	}
	.ant-table-placeholder {
		border-bottom: none;
	}
	.ant-table-row {
		td {
			overflow: hidden;
			word-break: break-all;
		}
	}
	.add-wrap {
		width: 100% !important;
		margin-top: 30px;
		background: #f9f9f9;
		border-top: 1px dashed #ddd;
		border-bottom: 1px dashed #ddd;
		text-align: center;
		padding: 10px 0;
		i {
			font-size: 20px;
			display: inline-block;
			vertical-align: middle;
			margin-right: 10px;
			position: relative;
			top: -2px;
		}
		&:hover {
			opacity: 0.8;
			cursor: pointer;
		}
	}
}
.modal-file-info-upload-1 {
	width: 90% !important;
	label {
		width: 100px;
		display: inline-block;
		text-align: left;
	}
	.file_icon {
		margin: 0 auto;
		display: block;
		background: url(~@/v2/assets/imgs/common/file_icon.png) no-repeat right center;
		width: 28px;
		height: 22px;
		margin-bottom: 10px;
	}
	.file-notice {
		color: #333;
		font-size: 14px;
	}
	.unEditable {
		.anticon-delete {
			display: none;
		}
	}
}
.row {
	margin-bottom: 10px;
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
	&:hover .rotate-wrapper {
		display: flex;
	}
	.rotate-wrapper {
		justify-content: center;
		align-items: center;
		position: absolute;
		display: none;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		.rotate-icon {
			font-size: 80px;
			color: rgba(0, 0, 0, 0.3);
			cursor: pointer;
		}
	}
}
</style>
