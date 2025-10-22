<template>
	<div class="slMain">
		<div class="slTitleAssis">法定代表人身份信息</div>
		<div class="tips-info-wrap">系统将校验法定代表人的姓名、身份证及手机号是否一致，如不一致，请上传说明函（需加盖公章）</div>
		<div class="form-wrap">
			<a-form
				:form="form"
				:colon="false"
				formLayout="vertical"
				v-if="$route.query.type !== 'edit'"
				:initialValues="defaultCompanyInfo"
			>
				<a-row type="flex">
					<a-col
						span="24"
						v-if="legalPersonCardImgVisible"
					>
						<a-form-item label="">
							<div class="file-upload-wrap">
								<i-upload
									list-type="picture-card"
									:accept="accept"
									:action="action"
									:showUploadList="true"
									:limit="true"
									:size="100"
									:defaultFileList="fileListlegalPersonCardImg"
									v-decorator="['legalPersonCardImg', { rules: [{ required: true, message: '请上传法定代表人身份证复印件' }] }]"
									:showDesc="false"
									ref="legalPersonCardUpload"
								>
									<div class="card-image"></div>
								</i-upload>
								<div class="upload-desc">
									<div
										class="text-decoration cursor-pointer"
										@click="handlePreview('idcardImg')"
									>
										查看示例
									</div>
									<div>支持bmp、jpg、png、pdf等格式，文件大小不超过100M（需加盖公章）</div>
								</div>
							</div>
						</a-form-item>
					</a-col>
					<a-col span="8">
						<a-row
							type="flex"
							justify="start"
						>
							<a-form-item label="姓名">
								<a-input
									class="form-item-wrap"
									placeholder="请输入法定代表人姓名"
									:maxLength="10"
									:disabled="disabledInput"
									v-decorator="[
										`legalPersonName`,
										{
											rules: [
												{
													required: true,
													message: `法定代表人姓名必填`
												}
											]
										}
									]"
								/>
							</a-form-item>
						</a-row>
					</a-col>
					<a-col span="8">
						<a-row
							type="flex"
							justify="center"
						>
							<a-form-item label="身份证号码">
								<a-input
									class="form-item-wrap"
									placeholder="请输入法定代表人身份证号码"
									:maxLength="18"
									:disabled="disabledInput"
									v-decorator="[
										`legalPersonCardNo`,
										{
											rules: [
												{
													required: true,
													message: `法定代表人身份证号码必填`,
													whitespace: true
												},
												{
													max: 18,
													message: `法定代表人身份证号长度不能超过18个字符`
												},
												{ validator: validIdCard }
											]
										}
									]"
								/>
							</a-form-item>
						</a-row>
					</a-col>
					<a-col span="8">
						<a-row
							type="flex"
							justify="end"
						>
							<a-form-item label="手机号">
								<a-input
									class="form-item-wrap"
									placeholder="请输入手机号"
									:maxLength="11"
									:disabled="disabledInput"
									v-decorator="[
										`legalPersonMobile`,
										{
											rules: [
												{
													required: true,
													message: `请输入正确手机号`,
													whitespace: true,
													pattern: /^1[3456789]\d{9}$/
												}
											],
											validateTrigger: 'blur'
										}
									]"
								/>
							</a-form-item>
						</a-row>
					</a-col>
					<a-col span="8">
						<a-row
							type="flex"
							justify="start"
						>
							<a-form-item label="身份证有效期（起）">
								<a-date-picker
									style="width: 364px"
									:allowClear="false"
									type="date"
									format="YYYY-MM-DD"
									placeholder="请选择身份证有效期（起）"
									v-decorator="[
										`legalPersonCardValidTimeStart`,
										{
											rules: [
												{
													required: true,
													message: `身份证有效期必填`
												}
											]
										}
									]"
								/>
							</a-form-item>
						</a-row>
					</a-col>
					<a-col span="8">
						<a-row
							type="flex"
							justify="center"
							style="padding-left: 0px"
						>
							<a-form-item label="身份证有效期（止）">
								<a-date-picker
									style="width: 254px"
									type="date"
									:allowClear="false"
									placeholder="请选择身份证有效期（止）"
									format="YYYY-MM-DD"
									:disabled="form.getFieldValue('legalPersonCardIsLongValid')"
									v-decorator="[
										`legalPersonCardValidTimeEnd`,
										{
											rules: [
												{
													required: form.getFieldValue('legalPersonCardIsLongValid') ? false : true,
													message: `身份证有效期必填`
												}
											]
										}
									]"
								/>
								<a-checkbox
									style="margin-left: 20px"
									v-decorator="[
										'legalPersonCardIsLongValid',
										{
											initialValue: false,
											rules: [{ required: false }],
											valuePropName: 'checked'
										}
									]"
									@change="onChangeLegalPersonCardIsLongValid"
									>长期有效</a-checkbox
								>
							</a-form-item>
						</a-row>
					</a-col>
					<a-col span="8" v-if="baseInfoFormValues.agentIsLegalPerson">
						<a-row
							type="flex"
							justify="end"
						>
							<a-form-item>
								<span
									slot="label"
									class="diy-label-wrap"
								>
									授权期限（起）&nbsp;
									<a-tooltip title="企业管理员授权期限默认3年，到期后需要进行续期">
										<span class="tips-icon"></span>
									</a-tooltip>
								</span>
								<a-date-picker
									style="width: 364px"
									:allowClear="false"
									placeholder="请选择授权期限（起）"
									v-decorator="[
										`adminAuthValidTimeStart`,
										{
											rules: [
												{
													required: true,
													message: `授权期限必填`
												}
											]
										}
									]"
									@change="onChangeAdminAuthValidTimeStart"
								/>
							</a-form-item>
						</a-row>
					</a-col>
					<a-col span="8" v-if="baseInfoFormValues.agentIsLegalPerson">
						<a-row
							type="flex"
							justify="start"
						>
							<a-form-item>
								<span
									slot="label"
									class="diy-label-wrap"
								>
									授权期限（止）
								</span>
								<a-date-picker
									style="width: 364px"
									:allowClear="false"
									disabled
									v-decorator="[
										`adminAuthValidTimeEnd`,
										{
											rules: [
												{
													required: true,
													message: `授权期限必填`
												}
											]
										}
									]"
								/>
							</a-form-item>
						</a-row>
					</a-col>
				</a-row>
			</a-form>
			<a-form
				:form="form"
				:colon="false"
				formLayout="vertical"
				v-if="['COMPANY_NAME_CHANGE'].includes(companyChangeTypeDesc) && $route.query.type === 'edit'"
				:initialValues="defaultCompanyInfo"
			>
				<a-row type="flex">
					<a-col
						span="24"
					>
						<a-form-item label="">
							<div class="file-upload-wrap">
								<i-upload
									list-type="picture-card"
									:accept="accept"
									:action="action"
									:showUploadList="true"
									:limit="true"
									:size="100"
									:defaultFileList="fileListlegalPersonCardImg"
									v-decorator="['legalPersonCardImg', { rules: [{ required: true, message: '请上传法定代表人身份证复印件' }] }]"
									:showDesc="false"
								>
									<div class="card-image"></div>
								</i-upload>
								<div class="upload-desc">
									<div
										class="text-decoration cursor-pointer"
										@click="handlePreview('idcardImg')"
									>
										查看示例
									</div>
									<div>支持bmp、jpg、png、pdf等格式，文件大小不超过100M（需加盖公章）</div>
								</div>
							</div>
						</a-form-item>
					</a-col>
					<a-col span="8">
						<a-row
							type="flex"
							justify="start"
						>
							<a-form-item label="法定代表人">
								<a-input
									:disabled="true"
									class="form-item-wrap"
									placeholder="请输入法定代表人姓名"
									:maxLength="10"
									v-decorator="[
										`legalPersonName`,
										{
											rules: [
												{
													required: true,
													message: `法定代表人姓名必填`
												}
											]
										}
									]"
								/>
							</a-form-item>
						</a-row>
					</a-col>
					<a-col span="8">
						<a-row
							type="flex"
							justify="center"
						>
							<a-form-item label="身份证号码">
								<a-input
									:disabled="true"
									class="form-item-wrap"
									placeholder="请输入法定代表人身份证号码"
									:maxLength="18"
									v-decorator="[
										`legalPersonCardNo`,
										{
											rules: [
												{
													required: true,
													message: `法定代表人身份证号码必填`,
													whitespace: true
												},
												{
													max: 18,
													message: `法定代表人身份证号长度不能超过18个字符`
												},
												{ validator: validIdCard }
											]
										}
									]"
								/>
							</a-form-item>
						</a-row>
					</a-col>
					<a-col span="8">
						<a-row
							type="flex"
							justify="end"
						>
							<a-form-item label="手机号">
								<a-input
									:disabled="true"
									class="form-item-wrap"
									placeholder="请输入手机号"
									:maxLength="11"
									v-decorator="[
										`legalPersonMobile`,
										{
											rules: [
												{
													required: true,
													message: `请输入正确手机号`,
													whitespace: true,
													pattern: /^1[3456789]\d{9}$/
												}
											],
											validateTrigger: 'blur'
										}
									]"
								/>
							</a-form-item>
						</a-row>
					</a-col>
					<a-col span="8">
						<a-row
							type="flex"
							justify="start"
						>
							<a-form-item label="身份证有效期（起）">
								<a-date-picker
									style="width: 364px"
									:allowClear="false"
									type="date"
									format="YYYY-MM-DD"
									placeholder="请选择身份证有效期（起）"
									v-decorator="[
										`legalPersonCardValidTimeStart`,
										{
											rules: [
												{
													required: true,
													message: `身份证有效期必填`
												}
											]
										}
									]"
								/>
							</a-form-item>
						</a-row>
					</a-col>
					<a-col span="8">
						<a-row
							type="flex"
							justify="center"
							style="padding-left: 0"
						>
							<a-form-item label="身份证有效期（止）">
								<a-date-picker
									style="width: 254px"
									:allowClear="false"
									type="date"
									placeholder="请选择身份证有效期（止）"
									format="YYYY-MM-DD"
									:disabled="form.getFieldValue('legalPersonCardIsLongValid')"
									v-decorator="[
										`legalPersonCardValidTimeEnd`,
										{
											rules: [
												{
													required: form.getFieldValue('legalPersonCardIsLongValid') ? false : true,
													message: `身份证有效期必填`
												}
											]
										}
									]"
								/>
								<a-checkbox
									style="margin-left: 20px"
									v-decorator="[
										'legalPersonCardIsLongValid',
										{
											initialValue: false,
											rules: [{ required: false }],
											valuePropName: 'checked'
										}
									]"
									@change="onChangeLegalPersonCardIsLongValid"
									>长期有效</a-checkbox
								>
							</a-form-item>
						</a-row>
					</a-col>
				</a-row>
			</a-form>
			<a-form
				:form="form"
				:colon="false"
				formLayout="vertical"
				v-if="['COMPANY_NAME_AND_LEGAL_PERSON_CHANGE', 'LEGAL_PERSON_CHANGE', 'NO_CHANGE', null].includes(companyChangeTypeDesc) && $route.query.type === 'edit'"
				:initialValues="defaultCompanyInfo"
			>
				<a-row type="flex">
					<a-col
						span="24"
					>
						<a-form-item label="">
							<div class="file-upload-wrap">
								<i-upload
									list-type="picture-card"
									:accept="accept"
									:action="action"
									:showUploadList="true"
									:limit="true"
									:size="100"
									:defaultFileList="fileListlegalPersonCardImg"
									v-decorator="['legalPersonCardImg', { rules: [{ required: true, message: '请上传法定代表人身份证复印件' }] }]"
									:showDesc="false"
								>
									<div class="card-image"></div>
								</i-upload>
								<div class="upload-desc">
									<div
										class="text-decoration cursor-pointer"
										@click="handlePreview('idcardImg')"
									>
										查看示例
									</div>
									<div>支持bmp、jpg、png、pdf等格式，文件大小不超过100M（需加盖公章）</div>
								</div>
							</div>
						</a-form-item>
					</a-col>
					<a-col span="8">
						<a-row
							type="flex"
							justify="start"
						>
							<a-form-item label="原法定代表人">
								<a-input
									:disabled="true"
									class="form-item-wrap"
									placeholder="请输入法定代表人姓名"
									:maxLength="10"
									v-decorator="[
										`legalPersonNameOld`,
										{
											rules: [
												{
													required: true,
													message: `法定代表人姓名必填`
												}
											]
										}
									]"
								/>
							</a-form-item>
						</a-row>
					</a-col>
					<a-col span="8">
						<a-row
							type="flex"
							justify="center"
						>
							<a-form-item label="现法定代表人">
								<a-input
									class="form-item-wrap"
									placeholder="请输入法定代表人姓名"
									:maxLength="10"
									v-decorator="[
										`legalPersonName`,
										{
											rules: [
												{
													required: true,
													message: `法定代表人姓名必填`
												}
											]
										}
									]"
								/>
							</a-form-item>
						</a-row>
					</a-col>
					<a-col span="8">
						<a-row
							type="flex"
							justify="end"
						>
							<a-form-item label="身份证号码">
								<a-input
									class="form-item-wrap"
									placeholder="请输入法定代表人身份证号码"
									:maxLength="18"
									v-decorator="[
										`legalPersonCardNo`,
										{
											rules: [
												{
													required: true,
													message: `法定代表人身份证号码必填`,
													whitespace: true
												},
												{
													max: 18,
													message: `法定代表人身份证号长度不能超过18个字符`
												},
												{ validator: validIdCard }
											]
										}
									]"
								/>
							</a-form-item>
						</a-row>
					</a-col>
					<a-col span="8">
						<a-row
							type="flex"
							justify="start"
						>
							<a-form-item label="手机号">
								<a-input
									class="form-item-wrap"
									placeholder="请输入手机号"
									:maxLength="11"
									v-decorator="[
										`legalPersonMobile`,
										{
											rules: [
												{
													required: true,
													message: `请输入正确手机号`,
													whitespace: true,
													pattern: /^1[3456789]\d{9}$/
												}
											],
											validateTrigger: 'blur'
										}
									]"
								/>
							</a-form-item>
						</a-row>
					</a-col>
					<a-col span="8">
						<a-row
							type="flex"
							justify="center"
						>
							<a-form-item label="身份证有效期（起）">
								<a-date-picker
									style="width: 364px"
									:allowClear="false"
									type="date"
									format="YYYY-MM-DD"
									placeholder="请选择身份证有效期（起）"
									v-decorator="[
										`legalPersonCardValidTimeStart`,
										{
											rules: [
												{
													required: true,
													message: `身份证有效期必填`
												}
											]
										}
									]"
								/>
							</a-form-item>
						</a-row>
					</a-col>
					<a-col span="8">
						<a-row
							type="flex"
							justify="end"
						>
							<a-form-item label="身份证有效期（止）">
								<a-date-picker
									style="width: 274px;"
									:allowClear="false"
									type="date"
									format="YYYY-MM-DD"
									:disabled="form.getFieldValue('legalPersonCardIsLongValid')"
									placeholder="请选择身份证有效期（止）"
									v-decorator="[
										`legalPersonCardValidTimeEnd`,
										{
											rules: [
												{
													required: form.getFieldValue('legalPersonCardIsLongValid') ? false : true,
													message: `身份证有效期必填`
												}
											]
										}
									]"
								/>
								<a-checkbox
									style="position: relative; left: 10px"
									v-decorator="[
										'legalPersonCardIsLongValid',
										{
											initialValue: false,
											rules: [{ required: false }],
											valuePropName: 'checked'
										}
									]"
									@change="onChangeLegalPersonCardIsLongValid"
									>长期有效</a-checkbox
								>
							</a-form-item>
						</a-row>
					</a-col>
				</a-row>
			</a-form>
		</div>
		<image-viewer ref="imageViewer" />
		<LetterModal
			ref="letterModal"
			:clickConfirm="clickConfirm"
		/>
	</div>
</template>

<script>
import moment from 'moment';
import { cloneDeep } from 'lodash';
import { API_UPLOAD, API_THREE_ELEMENTS } from '@/v2/center/person/api';
import iUpload from '@/v2/components/upload.vue';
import { encryptedData } from '@/v2/utils/factory';
import { checkID } from 'untils/factory.js';
import { filePreview } from '@/v2/utils/file';
import imageViewer from '@/v2/components/imageViewer.vue';
import systemConfig from '@/v2/config/common';
import LetterModal from './LetterModal.vue';

export default {
	props: {
		fileListlegalPersonCardImg: {
			type: Array,
			default: () => []
		},
		companyType: {
			type: String,
			default: ''
		},
		companyChangeType: {
			type: String,
			default: ''
		},
		baseInfoFormValues: {
			type: Object,
			default() {
				return {};
			}
		}
	},
	data() {
		return {
			idcardImg: systemConfig.accountInfo.idcardImgExample,
			accept: '.bmp,.jpg,.png,.gif,.pdf',
			form: this.$form.createForm(this, { name: 'legalPersonForm', onValuesChange: this.onValuesChange }),
			action: API_UPLOAD,
			threeMetaCheckErrorExplainFilepath: {},
			defaultCompanyInfo: {}
		};
	},
	components: {
		iUpload,
		imageViewer,
		LetterModal
	},
	computed: {
		disabledInput() {
			return this.baseInfoFormValues.agentIsLegalPerson;
		},
		legalPersonCardImgVisible() {
			const typeArr = ['CORE_COMPANY', 'TRADER', 'FINANCIAL_ORG', 'WAREHOUSE', 'LOGISTICS'];
			return typeArr.includes(this.$route.query.type) || typeArr.includes(this.companyType);
		},
		companyChangeTypeDesc() {
			return this.companyChangeType;
		}
	},
	methods: {
		validIdCard(rule, value, callback) {
			if (!value) {
				callback();
				return;
			}
			if (!checkID(value)) {
				callback('请输入有效的身份证号');
			}
			callback();
		},
		onValuesChange(props, values) {
			if (Object.keys(values).length === 0) {
				return;
			}
			this.$nextTick(() => {
				this.$emit('onValuesLegalInfoChange', this.form.getFieldsValue());
			});
		},
		onChangeAdminAuthValidTimeStart(e) {
			const adminAuthValidTimeStart = e.format('YYYY-MM-DD');
			this.form.setFieldsValue({
				adminAuthValidTimeEnd: moment(adminAuthValidTimeStart).add(3, 'years').format('YYYY-MM-DD')
			});
		},
		clickConfirm(values) {
			this.threeMetaCheckErrorExplainFilepath = values;
			this.$refs.letterModal.handleCancel();
			this.$nextTick(() => {
				this.$emit('submit', 0);
			});
		},
		initFieldsValue(values) {
			this.defaultCompanyInfo = values;
			this.$nextTick(() => {
				this.form.setFieldsValue({
					...values,
					adminAuthValidTimeStart: values.adminAuthValidTimeStart ? moment(values.adminAuthValidTimeStart).format('YYYY-MM-DD') : null,
					adminAuthValidTimeEnd: values.adminAuthValidTimeEnd ? moment(values.adminAuthValidTimeEnd).format('YYYY-MM-DD') : null
				});
			});
		},
		resetFormValues() {
			this.$nextTick(() => {
				this.form.resetFields();
				this.$refs.legalPersonCardUpload?.resetFileList();
			});
		},
		getFormValues() {
			return this.form.getFieldsValue();
		},
		onChangeLegalPersonCardIsLongValid() {
			this.form.resetFields(['legalPersonCardValidTimeEnd']);
		},
		submit(flag) {
			return new Promise((resolve, reject) => {
				this.form.validateFieldsAndScroll(async (errors, values) => {
					if (!errors) {
						if (flag) {
							// await this.submitThreeElements();
						}
						const cloneValues = cloneDeep(values);
						cloneValues.legalPersonCardValidTimeStart = cloneValues.legalPersonCardValidTimeStart ? moment(cloneValues.legalPersonCardValidTimeStart).format('YYYY-MM-DD') : null;
						cloneValues.legalPersonCardValidTimeEnd = cloneValues.legalPersonCardValidTimeEnd ? moment(cloneValues.legalPersonCardValidTimeEnd).format('YYYY-MM-DD') : null;
						resolve({
							...cloneValues,
							...this.threeMetaCheckErrorExplainFilepath
						});
					}
					reject(errors);
				});
			});
		},
		handleNullValue(value) {
			if (!value) {
				return true;
			}
			// 过滤纯空格的情况
			if (value.match(/^[ ]*$/)) {
				return true;
			}
		},
		// 三要素验证
		async submitThreeElements() {
			return new Promise(async (resolve, reject) => {
				const { legalPersonName, legalPersonCardNo, legalPersonMobile } = this.form.getFieldsValue();
				if (
					!this.handleNullValue(legalPersonName) &&
					!this.handleNullValue(legalPersonCardNo) &&
					!this.handleNullValue(legalPersonMobile)
				) {
					API_THREE_ELEMENTS({
						name: legalPersonName,
						idCard: await encryptedData(legalPersonCardNo),
						mobile: legalPersonMobile
					})
						.then(res => {
							if (res.data.result) {
								resolve(true);
							} else {
								// this.$message.error(`三要素验证失败，错误信息：${res.data.message}`);
								this.$refs.letterModal.showModal();
								reject(res.data.message);
							}
						})
						.catch(() => {
							reject('三要素验证失败');
						});
				}
			});
		},
		handlePreview(type) {
			filePreview(this[type], this.$refs.imageViewer.show, true);
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/tips-wrap.less');
@import url('~@/v2/style/form-reset.less');
</style>
<style lang="less" scoped>
.slMain {
	background: #fff;
	padding: 0 30px;
	padding-bottom: 10px;
	box-sizing: border-box;
	/deep/ .ant-form-explain {
		margin-top: 4px;
	}
}
.file-upload-wrap {
	display: flex;
	align-items: center;

	/deep/.upload-file-box {
		height: 112px;
		.ant-upload-select-picture-card {
			margin: 0;
			border: none;
		}

		.ant-upload {
			padding: 0;
		}
		.ant-upload-list-picture-card-container {
			width: 192px;
			height: 112px;
			margin: 0;
		}
		.ant-upload-list-item-list-type-picture-card {
			width: 192px;
			height: 112px;
			margin: 0;
		}
		.ant-upload-list-item-thumbnail img {
			object-fit: contain;
		}
	}
}

.card-image {
	width: 192px;
	height: 112px;
	background-image: url('~@/v2/assets/imgs/person/legal-person.png');
	background-size: contain;
}

.upload-desc {
	margin-left: 20px;
	font-size: 14px;

	div {
		height: 20px;
		line-height: 20px;
	}

	color: rgba(0, 0, 0, 0.4);

	div:nth-child(2) {
		margin-top: 9px;
	}
}
.tips-info-wrap {
	margin-top: 30px;
}
.form-wrap {
	margin-top: 30px;
}
.form-item-wrap {
	width: 364px;
}
.tips-icon {
	width: 14px;
	height: 14px;
	display: inline-block;
	background-image: url('~@/v2/assets/imgs/person/tips.png');
	background-size: 14px 14px;
	position: relative;
	top: 2px;
	cursor: pointer;
}
</style>