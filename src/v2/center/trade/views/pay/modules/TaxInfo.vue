<template>
	<div
		class="info-item"
		style="margin-bottom: 10px"
	>
		<i class="title_icon"></i>
		<p class="title">税务信息</p>

		<a-table
			rowKey="id"
			:scroll="{ x: true }"
			:columns="taxColumns"
			:dataSource="taxDataSource"
			:pagination="false"
		>
			<span
				slot="action"
				slot-scope="text, record"
			>
				<a-space>
					<a @click="goDetail('view', record)">查看</a>
					<a
						@click="goDetail('down', record)"
						v-if="type == 'edit'"
						>下载</a
					>
					<a-popconfirm
						title="确认删除?"
						v-if="type == 'edit' && !record.checked"
						ok-text="是"
						cancel-text="否"
						@confirm="goDel(record)"
					>
						<a><span style="color: red">删除</span></a>
					</a-popconfirm>
				</a-space>
			</span>
		</a-table>
		<p
			v-if="type == 'edit'"
			class="add-wrap"
			@click="addTaxInfo"
		>
			<i>+</i>新增纳税附件
		</p>

		<a-modal
			title="新增纳税申报表"
			:visible="visible"
			width="700px"
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
				:form="formModalData"
				:label-col="{ span: 6 }"
				:wrapper-col="{ span: 14 }"
			>
				<a-form-item label="税种">
					<a-select
						disabled
						v-decorator="[
							'taxCategory',
							{
								rules: [{ required: false, message: '请选择税种' }],
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
				<a-form-item label="税款所属期间">
					<a-range-picker
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
				<a-form-item label="实缴(退)金额">
					<a-input-number
						:formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
						:precision="2"
						:min="0"
						v-decorator="[
							'amount',
							{
								rules: [
									{
										required: false,
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
				<a-form-item
					label="上传纳税申报表"
					v-if="bankPayConfig.taxReturnUpConfig"
				>
					<i-upload
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
						<span>点击选择</span>
					</i-upload>
				</a-form-item>
				<a-form-item
					label="上传完税证明"
					v-if="bankPayConfig.taxPaymentUpConfig"
				>
					<i-upload
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
						<span>点击选择</span>
					</i-upload>
				</a-form-item>
				<div class="file-notice">
					<p>附件上传要求：</p>
					<p>1.可支持格式为{{ myallowFormat }}的附件，单个附件大小不得超过100M的文件。</p>

					<p>
						2.请核心企业代为上传对应上游供应商最新月份<span style="color: red"
							>（付款日期前{{ count == 3 ? '3' : '1-2' }}个月）</span
						>的纳税凭证。
					</p>
					<!-- <p style="color: red">
                        3.若因特殊原因，暂无最新月份的纳税凭证，请上传“文字版的解释说明文件”，税款所属期间请填写文件说明日期。
                    </p> -->
				</div>
			</a-form>
		</a-modal>
		<image-viewer ref="imageViewer" />
	</div>
</template>

<script>
import { API_COMPANYCUSTOMERTAX, API_COMPANYCUSTOMERTAXADD, API_COMPANYCUSTOMERTAXDEL } from '@/v2/api/account';
import iUpload from '@/v2/components/upload.vue';

import { API_UPLOAD_FILE } from '@/v2/center/person/api';

import { API_GETCURRENTENV, API_getCommonDownload } from '@/v2/center/trade/api/pay';
import comDownload from '@sub/utils/comDownload.js';
import imageViewer from '@/v2/components/imageViewer.vue';
import { filePreview } from '@/v2/utils/file';
import moment from 'moment';

export default {
	components: {
		iUpload,
		imageViewer
	},
	name: 'TaxInfo',

	props: ['type', 'uscc', 'bankPayConfig', 'date', 'count', 'taxDataList'], // type=edit是编辑状态
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
					title: '文件名',
					align: 'center',
					dataIndex: 'fileName'
				},
				{
					title: '纳税所属期间',
					align: 'center',
					dataIndex: 'taxPeriodStart',
					customRender: (r, o) => r + '~' + o.taxPeriodEnd
				},
				{
					title: '实缴（退）金额（元）',
					align: 'center',
					dataIndex: 'amount'
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
			myallowFormat: '.png,.jpeg,.jpg,.gif,.pdf,.doc,.docx,.xlsx,.xls,.rar,.zip',
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
		getTaxDetail() {
			//加载纳税详情
			API_COMPANYCUSTOMERTAX({
				date: moment(this.date).format('YYYY-MM-DD'),
				creditCode: this.uscc,
				count: this.count
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
		goDel(r) {
			API_COMPANYCUSTOMERTAXDEL({ id: r.fileId }).then(res => {
				if (res.success) {
					this.$message.success('操作成功');
					this.getTaxDetail();
				}
			});
		},
		goDetail(type, record) {
			if (type == 'view') {
				//判断文件是否为图片
				let url = record.filePath;
				let ext = url.substr(url.lastIndexOf('.') + 1);
				let zip = ['zip', 'rar'].indexOf(ext.toLowerCase()) !== -1;
				if (zip) {
					API_getCommonDownload(record.filePath).then(res => {
						comDownload(res, null, record.fileName);
					});
				} else {
					filePreview(API_GETCURRENTENV(url), this.$refs.imageViewer.show);
				}
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
<style scoped lang="less">
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
</style>
