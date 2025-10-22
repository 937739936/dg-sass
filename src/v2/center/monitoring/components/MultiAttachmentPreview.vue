<template>
	<div>
		<!-- 货物运输--附件表格弹窗 -->
		<a-modal
			centered
			title="货物运输附件列表"
			class="deliveryAttachmentModal"
			:visible="deliveryAttachmentModalVisible"
			@cancel="deliveryAttachmentModalVisible = false"
			width="60%"
			:footer="null"
		>
			<a-table
				:columns="deliveryAttachmentColumns"
				:data-source="deliveryAttachmentInfo"
				:scroll="{ x: true }"
				rowKey="id"
			>
				<div
					slot="action"
					slot-scope="record"
				>
					<a @click="viewAttachments(record)">附件</a>
				</div>
			</a-table>
		</a-modal>
		<!-- 资金退款--附件表格弹窗 -->
		<a-modal
			centered
			title="资金退款附件列表"
			wrapClassName="slConfirm"
			:visible="refundVisible"
			@cancel="refundVisible = false"
			width="60%"
			:footer="null"
		>
			<FileTable
				:fileData="refundAttachmentInfo"
				:titleShow="false"
				:disabled="true"
			/>
		</a-modal>
		<!-- 货物运输附件、货物结算附件展示弹窗 -->
		<a-modal
			title="附件信息"
			centered
			v-model="modalFileWrapIsShow"
			cancelText="取消"
			@cancel="modalCancel"
		>
			<template slot="footer">
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
				:wrapper-col="{ span: 18 }"
			>
				<a-row class="row">
					<a-col :span="24">
						<a-form-item label="附件类型">
							<a-select
								style="width: 200px"
								placeholder="请选择"
								labelInValue
								disabled
								v-decorator="['fileType', { rules: [{ required: true, message: '请选择附件类型' }] }]"
							>
								<a-select-option
									:value="item.typeName"
									disabled
									:key="index"
									v-for="(item, index) in fileData"
									>{{ item.typeName }}</a-select-option
								>
							</a-select>
						</a-form-item>
					</a-col>
				</a-row>
				<a-row class="row">
					<a-col :span="24">
						<a-form-item label="附件">
							<a-button
								type="link"
								@click="handlePreview(item)"
								v-for="(item, index) in fileList"
								:key="index"
								style="width: 100%; white-space: wrap;text-align:left;"
								>{{ fileList[0] && fileList[0].fileName }}</a-button
							>
						</a-form-item>
					</a-col>
				</a-row>
			</a-form>
		</a-modal>
		<image-viewer ref="imageViewer" />
	</div>
</template>
<script>
import { API_DOWNLPREVIEWTE } from '@/v2/center/monitoring/api';
import FileTable from '@/v2/components/fileTable/FileTable';
import comDownload from '@sub/utils/comDownload.js';
import { mapGetters } from 'vuex';
import ImageViewer from '@/v2/components/imageViewer.vue';
import { filePreview } from '@/v2/utils/file';
const deliveryAttachmentColumns = [
	{ title: '单据类型', dataIndex: 'typeName' },
	{ title: '操作', fixed: 'right', scopedSlots: { customRender: 'action' } }
];
export default {
	name: 'MultiAttachmentPreview',
	components: {
		ImageViewer,
		FileTable
	},
	props: {
		// 上游当前选中的合同
		curUpstream: {
			type: [Object, String],
			default: ''
		},
		// 下游合同编号
		downOrderNo: {
			type: String,
			default: ''
		},
		// 合同类型
		contractType: {
			type: [Number, String],
			default: 0
		},
		contractNo: {
			type: String,
			default: ''
		},
		orderNo: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			deliveryAttachmentColumns,
			isNeedRotate: true,
			previewVisible: false,
			fileData: [],
			fileList: [],
			deliveryAttachmentInfo: [],
			modalFileForm: this.$form.createForm(this),
			modalFileWrapIsShow: false,
			deliveryAttachmentModalVisible: false,
			previewImage: '',
			fileDataSource: [],
			refundAttachmentInfo: [], //退款附件
			refundVisible: false //退款附件弹框
		};
	},
	watch: {
		fileDataSource: {
			immediate: true,
			handler(data) {
				if (!data) {
					return;
				}
				const fileData = [];
				let key = 1;
				const fileList = [];
				if (data.url) {
					data.url.split(',').forEach(it => {
						fileList.push({
							uid: key++,
							name: it,
							status: 'done',
							url: it,
							fileName: data.name
						});
					});
				}
				fileData.push({
					key: data.type,
					type: data.type,
					typeName: data.typeName,
					uploadFiles: {
						fileList
					}
				});
				this.fileData = fileData;
				this.$nextTick(() => {
					this.modalFileForm.setFieldsValue({
						fileType: { key: fileData[0].key, label: fileData[0].typeName },
						uploadFiles: fileData[0].uploadFiles
					});
				});
				this.fileList = fileData[0].uploadFiles.fileList;
			}
		},
		curUpstream() {
			this.getGoodsDelivery();
			this.getGoodsTransfer();
		},
		downOrderNo() {
			this.getGoodsDelivery();
			this.getGoodsTransfer();
		},
		orderNo() {
			this.getGoodsDelivery();
			this.getGoodsTransfer();
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
		showModal(data) {
			this.deliveryAttachmentInfo = data;
			this.deliveryAttachmentModalVisible = true;
		},
		showRefundModal(data) {
			this.refundAttachmentInfo = data;
			this.refundVisible = true;
		},
		closePreviewModal() {
			this.previewVisible = false;
			this.ele = null;
		},
		viewAttachments(items) {
			// 货物运输附件查看
			this.modalFileWrapIsShow = true;
			this.fileDataSource = items;
		},
		handlePreview(file) {
			filePreview(file?.url || file?.response?.result, this.$refs.imageViewer.show);
		},
		modalCancel() {
			// 货物运输附件查看弹窗关闭
			this.fileList = [];
			this.fileDataSource = '';
			this.modalFileWrapIsShow = false;
			this.modalFileForm.resetFields();
		},
		//下载
		downFile(item) {
			// 下载下载
			API_DOWNLPREVIEWTE(item.fileUrl).then(res => {
				if (item.name) {
					comDownload(res, undefined, item.name);
				} else {
					comDownload(res, item.fileUrl);
				}
			});
		}
	}
};
</script>
