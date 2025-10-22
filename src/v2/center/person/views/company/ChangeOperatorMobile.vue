<template>
	<a-card
		class="wrapper"
		title="修改企业管理员手机号"
		:bordered="false"
		style="margin: -20px; margin-top: -10px"
	>
		<StepList
			:activeIndex="current"
			:stepList="stepList"
		/>
		<div class="changeOperator-inner2">
			<div class="steps-content slMain">
				<template v-if="current == 0">
					<div class="tips-info-wrap">系统将校验您的姓名、身份证与新手机号是否一致，如不一致，请上传说明函（需加盖公章）</div>
					<div class="slTitleAssis">管理员信息</div>
					<a-form
						:form="newMobileForm"
						formLayout="vertical"
						:colon="false"
						class="form-wrap"
						style="margin-top: 20px"
					>
						<a-row type="flex">
							<a-col :span="8">
								<a-form-item label="管理员姓名">
									<a-input
										v-decorator="['changeOperatorSelectName']"
										disabled
										class="form-item-wrap"
									/>
								</a-form-item>
							</a-col>
							<a-col :span="8">
								<a-row
									type="flex"
									justify="center"
								>
									<a-form-item label="管理员身份证号">
										<a-input
											v-decorator="['changeOperatorSelectIdcard']"
											disabled
											class="form-item-wrap"
										/>
									</a-form-item>
								</a-row>
							</a-col>
							<a-col :span="8">
								<a-row
									type="flex"
									justify="end"
								>
									<a-form-item label="管理员原手机号">
										<a-input
											v-decorator="['changeOperatorSelectMobile']"
											disabled
											class="form-item-wrap"
										/>
									</a-form-item>
								</a-row>
							</a-col>
							<a-col span="8">
								<a-form-item label="管理员新手机号">
									<a-input
										:maxLength="11"
										placeholder="请输入管理员新的手机号"
										class="form-item-wrap"
										v-decorator="[
											'newMobile',
											{
												rules: [{ required: true, message: `手机号必填`, whitespace: true, pattern: /^1\d{10}$/ }],
												validateTrigger: 'blur'
											}
										]"
									></a-input>
								</a-form-item>
							</a-col>
							<a-col :span="8">
								<a-row
									type="flex"
									justify="center"
									align="middle"
								>
									<a-form-item
										label="短信验证码"
										:colon="false"
									>
										<a-input
											class="form-item-wrap"
											v-model.trim="msgcode"
											:maxLength="6"
											v-decorator="[
												'code',
												{
													rules: [{ required: true, message: `验证码必填`, whitespace: true }],
													validateTrigger: 'blur'
												}
											]"
										>
										<div class="code-btn" slot="suffix">
											<i v-if="disabled">{{ count }}s后重新发送</i>
											<i
												v-else
												style="cursor: pointer"
												@click="getNewMobileCode"
												>获取短信验证码</i
											>
										</div>
										</a-input>
									</a-form-item>
									<div
										class="error-msg"
										v-show="errormsg"
									>
										验证码输入错误
									</div>
								</a-row>
							</a-col>
						</a-row>
						<div class="slTitleAssis">上传材料</div>
						<a-row
							type="flex"
							style="margin-top: 30px"
						>
							<div class="file-upload-wrap">
								<a-form-item label="">
									<i-upload
										list-type="picture-card"
										:accept="accept"
										:action="action"
										:showUploadList="true"
										:limit="true"
										:defaultFileList="fileListattachment"
										v-decorator="['attachment', { rules: [{ required: true, message: '请上传管理员手机号变更申请书' }] }]"
										:showDesc="false"
										:size="100"
									>
										<div class="card-image"></div>
									</i-upload>
								</a-form-item>
								<div class="upload-desc">
									<div>
										<span
											class="text-decoration cursor-pointer"
											@click="handlePreview('changeAdminMobile')"
											>查看示例</span
										>
										<span
											class="text-decoration cursor-pointer"
											style="margin-left: 30px"
											@click="downloadTemplate('attachment', '管理员变更申请书')"
											>下载模板</span
										>
									</div>
									<div>支持bmp、jpg、png、pdf等格式，文件大小不超过100M（需加盖公章）</div>
								</div>
							</div>
						</a-row>
					</a-form>
					<a-row
						type="flex"
						justify="center"
						class="footer"
						align="middle"
					>
						<a-space>
							<a-button
								v-if="false"
								type="primary"
								ghost
								@click="back()"
								style="margin-right: 20px"
							>
								返回上一步
							</a-button>
							<a-button
								type="primary"
								:disabled="loading"
								@click="submitAll"
							>
								提交
							</a-button>
						</a-space>
					</a-row>
				</template>
				<template v-if="current == 1">
					<SubmitSuccess title="修改管理员手机号审核已提交" />
				</template>
				<template v-if="current == 2">
					<ChangeSuccess />
				</template>
			</div>
		</div>
		<image-viewer ref="imageViewer" />
		<LetterModal
			ref="letterModal"
			:clickConfirm="clickConfirm"
		/>
	</a-card>
</template>

<script>
import { API_UPLOAD, API_THREE_ELEMENTS } from '@/v2/center/person/api';
import {
	API_ModifyAadminMobileSendCode,
	API_CompanyUserRoleInfo,
	API_ModifyAdminMobileSubmit,
	API_ModifyAdminMobileTemplateDownload,
	API_GetAdminModifyLastEditDetail
} from '@/v2/api/account';
import { mapGetters } from 'vuex';
import comDownload from '@sub/utils/comDownload.js';
import { beforeUpload } from '@/v2/utils/factory';
import iUpload from '@/v2/components/upload.vue';
import { filePreview } from '@/v2/utils/file';
import imageViewer from '@/v2/components/imageViewer.vue';
import { tencentCaptcha } from '@/v2/utils/factory';
import { encryptedData } from 'untils/factory.js';
import systemConfig from '@/v2/config/common';
import StepList from './components/StepList';
import SubmitSuccess from './components/SubmitSuccess';
import ChangeSuccess from './components/ChangeSuccess';
import LetterModal from './components/LetterModal.vue';

export default {
	name: 'ChangeOperatorMobile',
	data() {
		return {
			formData: {},
			id: '',
			operatorList: [],
			changeAdminMobile: systemConfig.accountInfo.changeAdminMobile,
			loading: false,
			previewImg: '',
			accept: '.bmp,.jpg,.png,.gif,.pdf',
			current: 0,
			fileListattachment: [],
			action: API_UPLOAD,
			uploadKeyList: ['attachment'],
			steps: [
				{
					title: '提交信息',
					content: 'First-content'
				},
				{
					title: '系统审核',
					content: 'Second-content'
				},
				{
					title: '变更完成',
					content: 'Last-content'
				}
			],
			errorTip: {
				uploading: '请等待文件上传完成',
				error: '文件上传错误',
				removed: '请上传管理员变更申请书'
			},
			newMobileForm: this.$form.createForm(this),
			msgcode: '',
			count: 0,
			errormsg: '',
			disabled: false,
			model: {},
			stepList: [
				{
					id: 1,
					title: '提交信息'
				},
				{
					id: 2,
					title: '系统审核'
				},
				{
					id: 3,
					title: '变更完成'
				}
			],
			currentForm: {}
		};
	},
	components: {
		iUpload,
		imageViewer,
		StepList,
		SubmitSuccess,
		ChangeSuccess,
		LetterModal
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_TOKEN: 'VUEX_ST_TOKEN',
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		headers() {
			return {
				Authorization: this.VUEX_ST_TOKEN,
				Source: 'PC'
			};
		}
	},
	created() {
		this.uploadKeyList.forEach(item => {
			this[`fileList${item}`] = [];
			this[item] = item;
		});
		this.getDetail();
	},
	methods: {
		clickConfirm(values = {}) {
			const params = {
				mobile: this.currentForm.newMobile,
				code: this.msgcode,
				attachment: this.currentForm.attachment,
				...values
			};
			this.loading = true;
			API_GetAdminModifyLastEditDetail().then(res => {
				this.model.id = res.data ? res.data.id : '';
				if (this.model.id) {
					params.id = this.model.id;
				}
				API_ModifyAdminMobileSubmit(params)
					.then(res => {
						if (res.success) {
							this.$message.success('变更成功');
							this.current++;
							this.$refs.letterModal.handleCancel();
						}
					})
					.finally(() => {
						this.loading = false;
					});
			});
		},
		getDetail() {
			API_CompanyUserRoleInfo({
				uscc: this.VUEX_ST_COMPANYSUER.companyUscc,
				role: 'ADMIN'
			}).then(res => {
				if (res.success && res.data) {
					this.model = {
						...res.data
					};
					this.model = res.data;
					this.newMobileForm.setFieldsValue({
						changeOperatorSelectName: this.model.name,
						changeOperatorSelectMobile: this.model.mobile,
						changeOperatorSelectIdcard: this.model.idCard
					});
				}
			});
		},
		beforeUpload(file) {
			return beforeUpload(file);
		},
		handlePreview(type) {
			filePreview(this[type], this.$refs.imageViewer.show, true);
		},
		downloadTemplate() {
			this.newMobileForm.validateFieldsAndScroll(['newMobile', 'changeOperatorSelectMobile'], (err, values) => {
				if (!err) {
					if (values.changeOperatorSelectMobile == values.newMobile) {
						this.$message.error('新手机号不能和原手机号相同');
						return;
					}
					this.$message.loading('下载中...');
					API_ModifyAdminMobileTemplateDownload({ newMobile: values.newMobile })
						.then(res => {
							comDownload(res, undefined, `管理员手机号变更模版.pdf`);
							if (res.success && res.data) {
								this.$message.success('下载成功！');
							}
						})
						.finally(() => {
							this.$message.destroy();
						});
				}
			});
		},
		countDown() {
			this.count = 60;
			let num = 60;
			if (this.timer) window.clearInterval(this.timer);
			this.timer = window.setInterval(() => {
				if (num <= 0) {
					window.clearInterval(this.timer);
					this.disabled = false;
				}
				num--;
				this.count = num;
			}, 1000);
		},
		// 手机号、姓名、身份证号三要素校验
		async identityCheck() {
			return API_THREE_ELEMENTS({
				idCard: await encryptedData(this.model.idCard),
				mobile: this.currentForm.newMobile,
				name: this.model.name,
				idCardExistsCheck: false,
				mobileExistsCheck: true
			});
		},
		getNewMobileCode() {
			// 发送验证码
			this.newMobileForm.validateFieldsAndScroll(['newMobile'], async (err, values) => {
				if (!err) {
					tencentCaptcha(this.sendSms, values.newMobile);
				}
			});
		},
		sendSms({ ticket, randstr }) {
			const mobile = this.newMobileForm.getFieldValue('newMobile');
			API_ModifyAadminMobileSendCode({
				mobile,
				ticket,
				randstr
			}).then(res => {
				if (!res.success) {
					this.$message.error(res.data);
					return;
				}
				this.$message.success('发送成功');
				this.disabled = true;
				this.countDown();
			});
		},

		submitAll() {
			this.newMobileForm.validateFieldsAndScroll(async (err, values) => {
				// 替换文件地址
				if (!err) {
					if (!this.msgcode) {
						this.errormsg = '请输入验证码';
						return;
					}
					this.currentForm = values;
					const res = await this.identityCheck();
					if (!res.success || !res.data.result) {
						this.$refs.letterModal.showModal(values);
						return;
					}
					this.clickConfirm();
				}
			});
		},
		back() {
			this.$router.push('/center/account/company/info');
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/tips-wrap.less');
@import url('~@/v2/style/form-reset.less');
@import url('~@/v2/style/modal.less');
</style>
<style lang="less" scoped>
.wrapper {
	padding-bottom: 114px;
	box-sizing: border-box;
	margin: 0 !important;
	/deep/ .ant-card-head {
		padding-left: 0;
	}
	/deep/ .ant-card-body {
		padding: 0;
	}
	/deep/ .ant-card-head-title {
		padding: 0;
		padding-top: 10px;
		padding-bottom: 20px;
		font-weight: 500;
		font-family: PingFang SC;
		color: rgba(0, 0, 0, 0.8);
		font-size: 20px;
	}
}
::v-deep .has-error .ant-form-explain {
	text-align: left;
}
.upload-box {
	text-align: left;
}
.support {
	text-align: left;
}
.example {
	width: auto;
	.example-str {
		padding-left: 0;
		margin-left: 0;
	}
}
.strong {
	display: block;
	font-size: 16px;
	text-align: left;
	margin-bottom: 8px;
}
</style>
<style lang="less" scoped>
.tl {
	text-align: center;
	.ant-form-item-label {
		text-align: center;
	}
}
.changeOperator {
	margin: -10px -30px;
	background-color: rgb(244, 245, 248);
	.changeOperator-inner1 {
		padding: 20px;
		border-radius: 4px;
		background-color: #fff;
		.s-card-title {
			margin: 0;
		}
	}
	.changeOperator-inner2 {
		background-color: #fff;
		border-radius: 4px;
		margin-top: 10px;
		padding: 20px;
		padding-top: 50px;
		padding-bottom: 30px;
	}
	.example-str {
		margin-left: -10px;
		font-size: 12px;
	}
	.divider {
		background: #eef0f2;
		height: 1px;
		margin-top: 20px;
		margin-left: -20px;
		margin-right: -20px;
	}
	.return-company {
		width: 228px;
		height: 28px;
		margin-top: 25px;
	}
	.shenhe-icon {
		width: 100px;
		height: 76px;
		background-size: cover;
		margin: 0 auto;
		background-image: url('~assets/imgs/person/pic-shenhe.png');
	}
	.shenheing-text {
		margin-top: 25px;
		font-family: PingFangSC-Regular;
		font-size: 14px;
		color: #383a3f;
	}
	.row {
		margin-bottom: 16px;
	}

	.steps-content {
		margin-top: 16px;
		min-height: 200px;
		text-align: center;
		padding-top: 20px;
	}
	.steps-tool {
		padding-left: 119px;
		padding-right: 120px;
	}
	.change-title {
		text-align: left;
		font-family: PingFangSC-Medium;
		font-size: 13px;
		color: #383a3f;

		margin-bottom: 10px;
	}
	.steps-action {
		margin-top: 44px;
	}
}
.input-wrap {
	width: 330px;
	margin: 0 auto;
	height: 53px;
	margin-left: 20px;
	position: relative;
	.code {
		font-family: PingFangSC-Regular;
		font-size: 12px;
		color: @primary-color;
		position: absolute;
		right: 7px;
		top: 1px;
	}
}
.error-msg {
	color: red;
	text-align: left;
}
.errorCenter {
	.has-error .ant-form-explain {
		text-align: center !important;
	}
}
.tips-info-wrap {
	margin-top: 30px;
}
.slMain {
	padding: 0 30px;
	margin-top: 50px;
	box-sizing: border-box;
	background-color: #fff;
}
.form-item-wrap {
	width: 364px;
}
.code-btn {
	color: @primary-color;
	cursor: pointer;
}
.file-upload-wrap {
	width: 100%;
	height: 112px;
	display: flex;

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
	background-image: url('~@/v2/assets/imgs/person/change-mobile-file.png');
	background-size: contain;
}
.upload-desc {
	margin-left: 20px;
	font-size: 14px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	div {
		height: 20px;
		line-height: 20px;
	}

	color: rgba(0, 0, 0, 0.4);

	div:nth-child(2) {
		margin-top: 9px;
	}
}
.file-upload-wrap {
	width: 100%;
	height: 112px;
	display: flex;

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
.footer {
	width: calc(100% - 254px);
	height: 64px;
	border-top: 1px solid rgba(229, 230, 235, 1);
	background: #fff;
	position: fixed;
	left: 228px;
	bottom: 0;
	z-index: 99;
	/deep/ .ant-btn {
		width: 88px;
	}
}
</style>
