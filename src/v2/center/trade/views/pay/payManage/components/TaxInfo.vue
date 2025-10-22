<template>
	<div>
		<div class="slTitleAssis">
			税务凭证
			<a-button
				class="relBtn"
				@click="addTaxInfo"
				type="primary"
				ghost
				>上传凭证</a-button
			>
		</div>
		<a-table
			rowKey="id"
			:scroll="{ x: true }"
			:columns="taxColumns"
			:dataSource="taxDataSource"
			:pagination="false"
			class="new-table"
		>
			<span
				slot="fileName"
				slot-scope="text, record, index"
			>
				<a @click="goDetail('view', record)">{{ text }}</a>
			</span>
			<span
				slot="action"
				slot-scope="text, record, index"
			>
				<a-space>
					<a @click="goDetail('down', record)">下载</a>
					<a @click="goDel(index)">删除</a>
				</a-space>
			</span>
		</a-table>

		<a-modal
			class="slModal"
			title="上传税务凭证"
			:visible="visible"
			width="920px"
			destroyOnClose
			:confirmLoading="confirmLoading"
			@ok="handleOk"
			@cancel="
				() => {
					visible = false;
				}
			"
		>
			<a-form
				class="slFormDetail"
				:form="formModalData"
			>
				<a-row>
					<a-col span="8">
						<a-form-item label="税种">
							<a-select
								disabled
								v-decorator="[
									'taxCategory',
									{
										rules: [{ required: true, message: '请选择税种' }],
										validateTrigger: 'change',
										initialValue: 'VALUE_ADDED_TAX'
									}
								]"
								placeholder="请选择税种"
							>
								<a-select-option
									v-for="item in taxCategoryDictList"
									:value="item.value"
									:key="item.value"
									>{{ item.text }}</a-select-option
								>
							</a-select>
						</a-form-item>
					</a-col>
					<a-col span="8">
						<a-form-item label="税款所属期间">
							<a-range-picker
								:disabled-date="disabledDate"
								v-decorator="[
									'taxPeriod',
									{
										rules: [
											{
												required: true,
												message: '请选择税款所属期间'
											}
										]
									}
								]"
								style="width: 100%"
							/>
						</a-form-item>
					</a-col>
					<a-col span="8">
						<a-form-item label="实缴(退)金额">
							<a-input-number
								:precision="2"
								:min="-9999999999"
								:max="9999999999"
								v-inputTip
								placeholder="请输入实缴(退)金额"
								v-decorator="[
									'amount',
									{
										rules: [
											{
												required: true,
												message: '请输入实缴(退)金额'
											}
										]
									}
								]"
								:step="0.01"
								style="width: 100%"
								:parser="value => value.replace(/\￥\s?|(,*)/g, '')"
							/>
						</a-form-item>
					</a-col>
				</a-row>
				<a-form-item
					class="specialItem"
					label="上传纳税申报表"
					v-if="bankPayConfig.taxReturnUpConfig"
				>
					<i-upload
						class="slUpload"
						listType="picture-card"
						:showDesc="false"
						:action="action"
						:accept="myallowFormat"
						:limit="true"
						:showUploadList="true"
						v-on:upload="taxTableFileUpload"
						:size="100"
						v-decorator="[
							'taxTable',
							{
								rules: [
									{
										required: true,
										message: '上传纳税申报表'
									}
								],
								validateTrigger: 'change'
							}
						]"
					>
						<div>
							<img
								src="@/v2/assets/imgs/storage/steel/upload.png"
								alt=""
							/>
						</div>
					</i-upload>
				</a-form-item>
				<a-form-item
					class="specialItem"
					label="上传完税证明"
					v-if="bankPayConfig.taxPaymentUpConfig"
				>
					<i-upload
						class="slUpload"
						listType="picture-card"
						:size="100"
						:showDesc="false"
						:action="action"
						:accept="myallowFormat"
						:limit="true"
						:showUploadList="true"
						v-on:upload="taxPaidProofFileUpload"
						v-decorator="[
							'taxPaidProof',
							{
								rules: [
									{
										required: true,
										message: '上传完税证明'
									}
								]
							}
						]"
					>
						<div>
							<img
								src="@/v2/assets/imgs/storage/steel/upload.png"
								alt=""
							/>
						</div>
					</i-upload>
				</a-form-item>
				<div class="file-notice">
					<p>1.可支持格式为jpg，jpeg，png，gif，pdf，docx，xls，xlsx的附件，单个附件大小不得超过100M的文件。</p>
					<p>2.代为上传对应上游供应商最新月份（付款日期前{{ count == 3 ? '3' : '1-2' }}个月）的纳税凭证。</p>
				</div>
			</a-form>
		</a-modal>
		<image-viewer ref="imageViewer" />
		<ConfirmModal
			ref="confirmModal"
			@confirm="confirmFunc"
		/>
	</div>
</template>

<script>
import { API_COMPANYCUSTOMERTAXADD } from '@/v2/api/account';
import iUpload from '@/v2/components/upload.vue';
import { API_UPLOAD_FILE } from '@/v2/center/person/api';
import { API_GETCURRENTENV, API_getCommonDownload, API_PaymentCreateTax } from '@/v2/center/trade/api/pay';
import comDownload from '@sub/utils/comDownload.js';
import imageViewer from '@/v2/components/imageViewer.vue';
import { filePreview } from '@/v2/utils/file';
import moment from 'moment';
import ConfirmModal from '@/v2/components/modal/ConfirmModal';

export default {
	components: {
		iUpload,
		imageViewer,
		ConfirmModal
	},
	name: 'TaxInfo',

	props: ['uscc', 'bankPayConfig', 'count', 'paymentType', 'date'], // type=edit是编辑状态
	data() {
		return {
			taxDataSource: [],
			confirmLoading: false,
			taxColumns: [
				{
					title: '类型',
					align: 'center',
					dataIndex: 'fileType'
				},
				{
					title: '税种',
					align: 'center',
					dataIndex: 'taxCategoryDesc'
				},
				{
					title: '税款所属期间',
					align: 'center',
					dataIndex: 'taxPeriodStart',
					customRender: (r, o) => r + '~' + o.taxPeriodEnd
				},
				{
					title: '实缴(退)金额(元)',
					align: 'center',
					dataIndex: 'amount'
				},
				{
					title: '附件',
					align: 'center',
					dataIndex: 'fileName',
					scopedSlots: { customRender: 'fileName' }
				},
				{
					title: '操作',
					dataIndex: 'action',
					align: 'center',
					width: 200,
					fixed: 'right',
					scopedSlots: { customRender: 'action' }
				}
			],
			visible: false,
			formModalData: this.$form.createForm(this),
			action: API_UPLOAD_FILE,
			myallowFormat: '.png,.jpeg,.jpg,.gif,.pdf,.doc,.docx,.xlsx,.xls,',
			taxTableFileList: [],
			taxPaidProofFileList: [],
			taxCategoryDictList: [{ text: '增值税', value: 'VALUE_ADDED_TAX' }] // 写死增值税
		};
	},

	watch: {
		uscc: {
			immediate: true,
			handler(v) {
				if (v) {
					this.getTaxDetail();
				}
			}
		},
		date: {
			handler(v) {
				if (v) {
					this.getTaxDetail();
				}
			}
		}
	},

	methods: {
		edit(taxVOList) {
			this.taxDataSource = taxVOList.filter(i => {
				if (this.bankPayConfig.taxPaymentUpConfig && i.fileTypeCode == 'TAX_PAID_PROOF') {
					return true;
				}
				if (this.bankPayConfig.taxReturnUpConfig && i.fileTypeCode == 'TAX_TABLE') {
					return true;
				}
				return false;
			});
		},
		disabledDate(current) {
			return current && current > moment().startOf('month');
		},
		getTaxDetail() {
			if (!this.date) return
			API_PaymentCreateTax({
				planPayDate: moment(this.date).format('YYYY-MM-DD'),
				payType: this.bankPayConfig?.payType,
				serialNo: this.$route.query.serialNo,
				contractType: this.$route.query.contractType,
				paymentType: this.paymentType
			}).then(res => {
				if (res.success) {
					this.taxDataSource = res.data.filter(i => {
						if (this.bankPayConfig.taxPaymentUpConfig && i.fileTypeCode == 'TAX_PAID_PROOF') {
							return true;
						}
						if (this.bankPayConfig.taxReturnUpConfig && i.fileTypeCode == 'TAX_TABLE') {
							return true;
						}
						return false;
					});
				}
			});
		},
		addTaxInfo() {
			this.visible = true;
		},
		goDel(index) {
			this.currentIndex = index;
			const modalObj = {
				modalTitle: '确认删除',
				modalText: '本次付款确定不使用该税务凭证吗？',
				modalTextNext: '注：本操作不会删除该税务凭证，仅在本次付款时不关联此税务凭证'
			};
			this.$refs.confirmModal.showModal(modalObj);
		},
		confirmFunc() {
			this.taxDataSource.splice(this.currentIndex, 1);
		},
		goDetail(type, record) {
			if (type == 'view') {
				//判断文件是否为图片
				let url = record.filePath;
				let ext = url.substr(url.lastIndexOf('.') + 1);
				filePreview(API_GETCURRENTENV(url), this.$refs.imageViewer.show);
			} else {
				API_getCommonDownload(record.filePath).then(res => {
					comDownload(res, null, record.fileName);
				});
			}
		},
		handleOk() {
			this.formModalData.validateFields((err, values) => {
				if (!err) {
					const flagArr = this.taxTableFileList.concat(this.taxPaidProofFileList).map(item => item?.status);
					if (flagArr.includes('uploading')) {
						this.$message.warning('请等待文件上传完成');
						return;
					}
					if (flagArr.includes('error')) {
						this.$message.warning('文件上传失败请重试');
						return;
					}
					let param = Object.assign({}, values);
					param.taxPeriodStart = values.taxPeriod[0].format('YYYY-MM-DD');
					param.taxPeriodEnd = values.taxPeriod[1].format('YYYY-MM-DD');
					param.taxTable = this.taxTableFileList;
					param.taxPaidProof = this.taxPaidProofFileList;
					param.companyCreditCode = this.uscc;
					delete param.taxPeriod;
					this.confirmLoading = true;
					API_COMPANYCUSTOMERTAXADD(param)
						.then(res => {
							if (res.success && res.data) {
								this.$message.success('添加成功');
								this.visible = false;
								this.getTaxDetail();
							}
						})
						.finally(e => {
							this.confirmLoading = false;
						});
				}
			});
		},
		taxTableFileUpload(file) {
			this.taxTableFileList = [];
			file.forEach(item => {
				this.taxTableFileList.push({
					fileName: item.fileName,
					fileUrl: item.url,
					md5Hex: item.md5Hex,
					status: item.status
				});
			});
		},
		taxPaidProofFileUpload(file) {
			this.taxPaidProofFileList = [];
			file.forEach(item => {
				this.taxPaidProofFileList.push({
					fileName: item.fileName,
					fileUrl: item.url,
					md5Hex: item.md5Hex,
					status: item.status
				});
			});
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style scoped lang="less">
.new-table {
	margin-top: 20px;
}
.title_icon {
	width: 12px;
	height: 16px;
	float: left;
	vertical-align: middle;
	margin: 0 14px;
	margin-top: 21px;
	background: url(~assets/imgs/menu/titleIcon.png) no-repeat right center;
}
.add-wrap {
	width: 100%;
	margin-top: 30px;
	background: #f9f9f9;
	border-top: 1px dashed #ddd;
	border-bottom: 1px dashed #ddd;
	text-align: center;
	padding: 10px 0;
	font-size: 14px;
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
.specialItem {
	height: auto !important;
	label {
		color: rgba(0, 0, 0, 0.8) !important;
	}
}
::v-deep .ant-upload {
	width: 60px;
	height: 60px;
	box-sizing: border-box;
}
::v-deep.ant-form-item {
	width: 280px;
}
.slUpload {
	::v-deep.ant-upload-list-picture-card-container,
	::v-deep.ant-upload-list-item-list-type-picture-card {
		width: 60px !important;
		height: 60px !important;
	}
	::v-deep.ant-upload-list-picture-card {
		.ant-upload-list-item {
			width: 60px !important;
			height: 60px !important;
			box-sizing: border-box;
		}
	}
	::v-deep.ant-upload-list-item-name {
		display: none !important;
	}
}
.file-notice {
	color: rgba(0, 0, 0, 0.4);
	line-height: 18px;
}
.relBtn {
	margin-left: 30px;
}
</style>
