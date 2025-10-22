<template>
	<div class="changeOperator">
		<div class="changeOperator-inner1">
			<div class="s-card">
				<div class="s-card-title">修改企业签章员手机号</div>
			</div>
		</div>
		<div class="changeOperator-inner2">
			<a-steps
				:current="current"
				class="steps-tool"
			>
				<a-step
					v-for="item in steps"
					:key="item.title"
					:title="item.title"
				/>
			</a-steps>
			<div class="steps-content">
				<template v-if="current == 0">
					<a-form
						:form="changeSingerForm"
						:label-col="{ span: 6 }"
						:wrapper-col="{ span: 14 }"
					>
						<strong class="strong">签章员信息</strong>
						<a-row>
							<a-col :span="12">
								<a-form-item
									label="签章员姓名"
									:colon="false"
								>
									<a-input
										v-decorator="['name']"
										disabled
									/>
								</a-form-item>
							</a-col>
							<a-col :span="12">
								<a-form-item
									label="签章员身份证号"
									:colon="false"
								>
									<a-input
										v-decorator="['idCard']"
										disabled
									/>
								</a-form-item>
							</a-col>
							<a-col :span="12">
								<a-form-item
									label="签章员原手机号"
									:colon="false"
								>
									<a-input
										v-decorator="['mobile']"
										disabled
									/>
								</a-form-item>
							</a-col>
						</a-row>
						<a-row>
							<a-col :span="24">
								<a-form-item
									label="签章员新手机号"
									:colon="false"
									:label-col="{ span: 3 }"
									:wrapper-col="{ span: 21 }"
								>
									<a-row>
										<a-col :span="8">
											<a-input
												:maxLength="11"
												placeholder="请输入签章员新的手机号"
												v-decorator="[
													'newMobile',
													{
														rules: [{ required: true, message: `手机号必填`, whitespace: true, pattern: /^1\d{10}$/ }],
														validateTrigger: 'blur'
													}
												]"
											></a-input>
										</a-col>
										<a-col :span="16">
											<div class="input-wrap">
												<a-input
													class="input-code"
													v-model.trim="msgcode"
													:maxLength="6"
												/>
												<div
													class="error-msg"
													v-show="errormsg"
												>
													验证码输入错误
												</div>
												<i
													class="code"
													v-if="disabled"
													>{{ count }}s后重新发送</i
												>
												<i
													class="code"
													v-else
													style="cursor: pointer"
													@click="getNewMobileCode"
													>获取短信验证码</i
												>
											</div>
										</a-col>
									</a-row>
								</a-form-item>
							</a-col>
						</a-row>
						<strong class="strong">上传材料</strong>
						<a-row>
							<a-col
								:span="12"
								class="errorCenter"
								style="margin-left: 30px"
							>
								<a-form-item
									class="upload-box"
									label="上传签章员手机号变更申请书（需加盖公章）"
									:colon="false"
									:label-col="{ span: 24 }"
									:wrapper-col="{ span: 24 }"
								>
									<i-upload
										:action="action"
										:accept="accept"
										:showUploadList="true"
										:defaultFileList="fileListattachment"
										:showDesc="false"
										list-type="picture-card"
										:limit="true"
										v-decorator="['attachment', { rules: [{ required: true, message: '上传签章员手机号变更申请书' }] }]"
									>
										<div>
											<a-icon type="plus" />
										</div>
									</i-upload>
									<p class="support">支持bmp、jpg、png、gif、PDF格式，文件大小不超过10M</p>
									<p class="example">
										<a
											@click="handlePreview('changeSingerMobileImg')"
											class="example-str"
											>示例</a
										>
										<a @click="downloadTemplate">下载模版</a>
									</p>
								</a-form-item>
							</a-col>
						</a-row>
					</a-form>
					<a-space>
						<a-button
							type="primary"
							@click="back()"
							ghost
							>返回上一步</a-button
						>
						<a-button
							type="primary"
							class="next-btn"
							@click="submitAll"
							>提交</a-button
						>
					</a-space>
				</template>
				<template v-if="current == 1">
					<div class="shenhe-icon"></div>
					<p class="shenheing-text">您的签章员手机号变更申请正在审核中</p>
					<a-button
						type="primary"
						class="return-company"
						@click="$router.push('/center/account/company/info')"
						>返回我的企业</a-button
					>
				</template>
				<template v-if="current == 2">
					<p>变更完成</p>
					<a-button
						type="primary"
						@click="$router.push('/center/account/company/info')"
						>返回我的企业</a-button
					>
				</template>
			</div>
		</div>
		<image-viewer ref="imageViewer" />
	</div>
</template>

<script>
import { API_UPLOAD } from '@/v2/center/person/api';
import {
	API_CertSingerModifyMobileCode,
	API_CertSingerModifyMobile,
	API_CertSingerModifyMobileTemplateDownload,
	API_CompanyUserRoleInfo,
	API_ChangeCertOperatorInfo,
	API_idCardAuth3Meta
} from '@/v2/api/account';
import { mapGetters } from 'vuex';
import comDownload from '@sub/utils/comDownload.js';
import { beforeUpload } from '@/v2/utils/factory';
import iUpload from '@/v2/components/upload';
import { filePreview } from '@/v2/utils/file';
import imageViewer from '@/v2/components/imageViewer.vue';
import { tencentCaptcha } from '@/v2/utils/factory';
import systemConfig from '@/v2/config/common';

export default {
	name: 'ChangeOperator',
	components: {
		iUpload,
		imageViewer
	},
	data() {
		return {
			id: '',
			operatorList: [],
			changeSingerMobileImg: systemConfig.accountInfo.changeSingerMobileImg,
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
				removed: '请上传签章员变更申请书'
			},

			changeSingerForm: this.$form.createForm(this),
			msgcode: '',
			count: 0,
			errormsg: '',
			disabled: false,
			model: {}
		};
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER',
			VUEX_ST_TOKEN: 'VUEX_ST_TOKEN'
		}),
		headers() {
			return {
				Authorization: this.VUEX_ST_TOKEN,
				Source: 'PC'
			};
		}
	},
	created() {
		// 设置上传相关字段及方法
		this.uploadKeyList.forEach(item => {
			this[`fileList${item}`] = [];
			this[item] = item;
		});

		this.getSingerDetail();
		this.getApplyInfo();
	},
	methods: {
		getApplyInfo() {
			// 获取申请的信息，获取id
			API_ChangeCertOperatorInfo().then(res => {
				if (res.success && res.data) {
					this.model.id = res.data.id;
				}
			});
		},
		getSingerDetail() {
			//获取签章员个人信息
			API_CompanyUserRoleInfo({
				uscc: this.VUEX_ST_COMPANYSUER.companyUscc,
				role: 'SIGNER'
			}).then(res => {
				if (res.success && res.data) {
					this.model = {
						...res.data
					};
					this.$nextTick(function () {
						this.changeSingerForm.setFieldsValue({
							...this.model
						});
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
			API_CertSingerModifyMobileTemplateDownload().then(res => {
				comDownload(res, undefined, `签章员手机号变更模版.pdf`);
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
		identityCheck(mobile) {
			return API_idCardAuth3Meta({
				idCard: this.model.idCard,
				mobile: mobile,
				name: this.model.name
			});
		},
		getNewMobileCode() {
			// 获取手机号验证码
			this.changeSingerForm.validateFieldsAndScroll(['newMobile'], async (err, values) => {
				if (!err) {
					const res = await this.identityCheck(values.newMobile);
					if (res.success && res.data.result) {
						tencentCaptcha(this.sendSms, values.newMobile);
					} else {
						this.$message.error(res.data.message);
					}
				}
			});
		},
		sendSms({ ticket, randstr }) {
			const mobile = this.changeSingerForm.getFieldValue('newMobile');
			API_CertSingerModifyMobileCode({
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
			// 提交
			this.changeSingerForm.validateFieldsAndScroll((err, values) => {
				if (!err) {
					if (!this.msgcode) {
						this.errormsg = '请输入验证码';
						return;
					}
					const params = {
						mobile: values.newMobile,
						code: this.msgcode,
						attachment: values.attachment
					};
					if (this.model.id) {
						// 驳回后重新申请
						params.id = this.model.id;
					}
					this.loading = true;
					API_CertSingerModifyMobile(params)
						.then(res => {
							if (res.success) {
								this.current++;
							}
						})
						.finally(() => {
							this.loading = false;
						});
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
}
.example-str {
	margin-left: 0;
}
.strong {
	display: block;
	font-size: 16px;
	text-align: left;
	margin-bottom: 8px;
}
// ::v-deep .ant-form-item-label{
//     text-align: left;
// }
</style>
>
<style lang="less">
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
		box-shadow: 0 2px 10px 0 #dddfe4;
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
		margin-right: 20px;
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
</style>
