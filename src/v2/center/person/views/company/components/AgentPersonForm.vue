<template>
	<div class="slMain">
		<div class="slTitleAssis">代理人身份信息</div>
		<div class="tips-info-wrap">成功注册后，代理人将自动变更为企业管理员</div>
		<div class="form-wrap">
			<a-form
				:form="form"
				formLayout="vertical"
				:colon="false"
				:initValues="defaultCompanyInfo"
			>
				<a-row type="flex">
					<a-col
						span="24"
						v-if="agentPersonCardImgVisible"
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
									:defaultFileList="fileListagentIdCardImg"
									v-decorator="['agentPersonCardImg', { rules: [{ required: true, message: '请上传代理人身份证复印件' }] }]"
									:showDesc="false"
									ref="agentIdCardUpload"
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
									placeholder="请输入代理人姓名"
									:maxLength="10"
									:disabled="disabledInput"
									v-decorator="[
										`agentPersonName`,
										{
											rules: [
												{
													required: true,
													message: `代理人姓名必填`
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
									placeholder="请输入代理人身份证号码"
									:maxLength="18"
									:disabled="disabledInput"
									v-decorator="[
										`agentPersonCardNo`,
										{
											rules: [
												{
													required: true,
													message: `代理人身份证号码必填`,
													whitespace: true
												},
												{
													max: 18,
													message: `代理人身份证号长度不能超过18个字符`
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
										`agentPersonMobile`,
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
						<a-form-item label="身份证有效期（起）">
							<a-date-picker
								style="width: 364px"
								:allowClear="false"
								type="date"
								placeholder="请选择身份证有效期（起）"
								format="YYYY-MM-DD"
								v-decorator="[
									`agentPersonCardValidTimeStart`,
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
					</a-col>
					<a-col span="8">
						<a-row
							type="flex"
							justify="center"
						>
							<a-form-item label="身份证有效期（止）">
								<a-date-picker
									style="width: 254px"
									:allowClear="false"
									type="date"
									format="YYYY-MM-DD"
									:disabled="form.getFieldValue('agentPersonCardIsLongValid')"
									v-decorator="[
										`agentPersonCardValidTimeEnd`,
										{
											rules: [
												{
													required: form.getFieldValue('agentPersonCardIsLongValid') ? false : true,
													message: `身份证有效期必填`
												}
											]
										}
									]"
								/>
								<a-checkbox
									style="margin-left: 20px"
									v-decorator="[
										'agentPersonCardIsLongValid',
										{
											initialValue: false,
											rules: [{ required: false }],
											valuePropName: 'checked'
										}
									]"
									@change="onChangeAgentPersonCardIsLongValid"
									>长期有效</a-checkbox
								>
							</a-form-item>
						</a-row>
					</a-col>
					<a-col span="8">
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
					<a-col span="8">
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
		</div>
		<image-viewer ref="imageViewer" />
	</div>
</template>

<script>
import { API_UPLOAD } from '@/v2/center/person/api';
import iUpload from '@/v2/components/upload.vue';
import { filePreview } from '@/v2/utils/file';
import { checkID } from 'untils/factory.js';
import imageViewer from '@/v2/components/imageViewer.vue';
import moment from 'moment';
import { cloneDeep } from 'lodash';
import systemConfig from '@/v2/config/common';

export default {
	props: {
		fileListagentIdCardImg: {
			type: Array,
			default: () => []
		},
		companyType: {
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
			defaultCompanyInfo: {}
		};
	},
	components: {
		iUpload,
		imageViewer
	},
	computed: {
		disabledInput() {
			return !this.baseInfoFormValues.agentIsLegalPerson;
		},
		agentPersonCardImgVisible() {
			const typeArr = ['CORE_COMPANY', 'TRADER', 'FINANCIAL_ORG', 'WAREHOUSE', 'LOGISTICS'];
			return typeArr.includes(this.$route.query.type) || typeArr.includes(this.companyType);
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
		onChangeAdminAuthValidTimeStart(e) {
			const adminAuthValidTimeStart = e.format('YYYY-MM-DD');
			this.form.setFieldsValue({
				adminAuthValidTimeEnd: moment(adminAuthValidTimeStart).add(3, 'years').format('YYYY-MM-DD')
			});
		},
		onValuesChange(props, values) {
			if (Object.keys(values).length === 0) {
				return;
			}
			this.$nextTick(() => {
				this.$emit('onValuesAgentInfoChange', this.form.getFieldsValue());
			});
		},
		resetFormValues() {
			this.$nextTick(() => {
				this.form.resetFields();
				this.$refs.agentIdCardUpload?.resetFileList();
			});
		},
		initFieldsValue(values) {
			this.$nextTick(() => {
				this.defaultCompanyInfo = values;
				this.form.setFieldsValue({
					...values,
					adminAuthValidTimeStart: values.adminAuthValidTimeStart ? moment(values.adminAuthValidTimeStart).format('YYYY-MM-DD') : null,
					adminAuthValidTimeEnd: values.adminAuthValidTimeEnd ? moment(values.adminAuthValidTimeEnd).format('YYYY-MM-DD') : null
				});
			});
		},
		onChangeAgentPersonCardIsLongValid() {
			this.form.resetFields(['agentPersonCardValidTimeEnd']);
		},
		submit() {
			return new Promise((resolve, reject) => {
				this.form.validateFieldsAndScroll((errors, values) => {
					if (!errors) {
						const cloneValues = cloneDeep(values);
						cloneValues.agentPersonCardValidTimeStart = cloneValues.agentPersonCardValidTimeStart ? moment(cloneValues.agentPersonCardValidTimeStart).format('YYYY-MM-DD') : null;
						cloneValues.agentPersonCardValidTimeEnd = cloneValues.agentPersonCardValidTimeEnd ? moment(cloneValues.agentPersonCardValidTimeEnd).format('YYYY-MM-DD') : null;
						cloneValues.adminAuthValidTimeStart = cloneValues.adminAuthValidTimeStart ? moment(cloneValues.adminAuthValidTimeStart).format('YYYY-MM-DD') : null;
						cloneValues.adminAuthValidTimeEnd = cloneValues.adminAuthValidTimeEnd ? moment(cloneValues.adminAuthValidTimeEnd).format('YYYY-MM-DD') : null;
						delete cloneValues.agentAuthValidTime;
						resolve(cloneValues);
					}
					reject(errors);
				});
			});
		},
		handlePreview(type) {
			filePreview(this[type], this.$refs.imageViewer.show, true);
		},
		handleNullValue(value) {
			if (!value) {
				return true;
			}
			// 过滤纯空格的情况
			if (value.match(/^[ ]*$/)) {
				return true;
			}
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
	background-image: url('~@/v2/assets/imgs/person/agent-person.png');
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