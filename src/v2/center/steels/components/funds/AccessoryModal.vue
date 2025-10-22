<template>
	<div>
		<!-- 货物运输--附件表格弹窗 -->
		<a-modal
			centered
			title="附件列表"
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
					<a
						v-auth="'steel:goodsTransfer:receiveGT:download'"
						@click="downloadPdf(record.path)"
						style="margin-left: 5px"
						>下载</a
					>
				</div>
			</a-table>
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
						<a-form-item
							label="附件类型"
							:colon="false"
						>
							<a-select
								style="width: 200px"
								placeholder="请选择"
								labelInValue
								disabled
								v-decorator="['fileType', { rules: [{ required: true, message: '请选择附件类型' }] }]"
							>
								<template v-for="(item, index) in fileData">
									<a-select-option
										:value="item.typeName"
										disabled
										:key="index"
										>{{ item.typeName }}</a-select-option
									>
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
						>
							<a-upload
								:headers="headers"
								v-decorator="['uploadFiles', { rules: [{ required: true, message: '请选择附件类型' }] }]"
								:multiple="true"
								listType="picture-card"
								:fileList="fileList"
								@preview="handlePreview"
								name="file"
							>
							</a-upload>
						</a-form-item>
					</a-col>
				</a-row>
			</a-form>
		</a-modal>
		<ImageViewer ref="imageViewer" />
	</div>
</template>
<script>
import { API_getCommonBatchDownload, API_DOWNLPREVIEWTE, API_GETCURRENTENV } from '@/v2/center/steels/api';
import { mapGetters } from 'vuex';
import ImageViewer from '@sub/components/viewer/image.vue';
import comDownload from '@sub/utils/comDownload.js';
const deliveryAttachmentColumns = [
	{ title: '单据类型', dataIndex: 'typeName' },
	{ title: '操作', fixed: 'right', scopedSlots: { customRender: 'action' } }
];

export default {
	name: 'MultiAttachmentPreview',
	components: { ImageViewer },
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
			previewVisible: false,
			fileData: [],
			fileList: [],
			deliveryAttachmentInfo: [],
			modalFileForm: this.$form.createForm(this),
			modalFileWrapIsShow: false,
			deliveryAttachmentModalVisible: false,
			previewImage: '',
			fileDataSource: []
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
				const typeName = '';
				const fileList = [];
				if (data.url) {
					data.url.split(',').forEach(it => {
						fileList.push({
							uid: key++,
							name: it,
							status: 'done',
							url: API_GETCURRENTENV(it)
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
			if (file.response?.result) {
				this.$refs.imageViewer.showFile(file.response?.result);
			}
			if (file.url) {
				this.$refs.imageViewer.showFile(file.url);
			}
		},
		modalCancel() {
			// 货物运输附件查看弹窗关闭
			this.fileList = [];
			this.fileDataSource = '';
			this.modalFileWrapIsShow = false;
			this.modalFileForm.resetFields();
		},
		downloadPdf(url) {
			if (url.indexOf(',') == -1) {
				API_DOWNLPREVIEWTE(url).then(res => {
					comDownload(res, url);
				});
			} else {
				API_getCommonBatchDownload({
					zipFileName: '货转证明',
					files: url
				}).then(res => {
					comDownload(res.data, undefined, res.name);
				});
			}
		}
	}
};
</script>
<style lang="less" scoped>
/deep/.anticon-delete {
	display: none;
}
</style>
