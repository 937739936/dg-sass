<template>
	<div>
		<div class="methods-wrap">
			<span
				slot="title"
				class="slTitle"
				>个人信息</span
			>
		</div>
		<div style="width: 760px">
			<div class="tips tips-info-wrap">您的个人信息可能会在合同中使用，请确保信息真实完整。</div>
		</div>
		<div class="content">
			<div class="name-wrap">
				<a-upload
					name="file"
					:headers="headers"
					list-type="picture-card"
					class="avatar-uploader"
					:show-upload-list="false"
					:action="API_UPLOAD"
					:before-upload="beforeUpload"
					:file-list="fileList"
					accept=".bmp,.jpg,.png,.gif,.pdf"
					@change="handleChange"
					v-decorator="['note', { rules: [{ required: true, message: '说明函不能为空!' }] }]"
				>
					<div>
						<a-spin v-if="loading" />
						<div>
							<img v-if="this.personalInfo.picUrl" class="avatar" :src="API_GETCURRENTENV(this.personalInfo.picUrl)" />
							<img v-else class="avatar" :src="this.systemConfig.accountInfo.avatarDefault" />
						</div>
						
					</div>
				</a-upload>
				<div class="desc">
					<div class="status-wrap">
						<span class="name">Hi，{{ personalInfo.name }}</span>
						<a-tooltip
							placement="top"
							v-if="['AUDITING', 'REJECTED'].includes(personalInfo.authAuditStatus)"
						>
							<template slot="title">
								<span v-if="personalInfo.authAuditStatus === 'REJECTED'">
									<p>审核结果：不通过</p>
									<p>审核时间：{{ personalInfo.authAuditTime }}</p>
									<p>审核意见：{{ personalInfo.authAuditRemark }}</p>
								</span>
							</template>
							<span :class="[personalInfo.authAuditStatus === 'AUDITING' ? 'tag-info' : 'tag-error']">{{
								personalInfo.authAuditStatus === 'AUDITING' ? '审核中' : '审核驳回'
							}}</span>
						</a-tooltip>
						<span
							class="auth-btn"
							v-if="['REJECTED'].includes(personalInfo.authAuditStatus)"
							@click="$router.push('/center/account/person/info/auth')"
							>实名认证</span
						>
						<span class="status-approve" v-if="personalInfo.auth">已实名认证</span>
					</div>
					<div class="card">
						<span>身份证号：{{ personalInfo.idCard }}</span>
						<template v-if="personalInfo.auth">
							<span style="margin: 0 10px">|</span>
							<span>关联企业：{{ personalInfo.companyName }}</span>
						</template>
						<span
							class="click-btn"
							v-if="
								!personalInfo.companyName &&
								(personalInfo.authAuditStatus === 'APPROVED' || (personalInfo.auth && !personalInfo.authAuditStatus))
							"
							@click="relationCompany"
							>去关联</span
						>
					</div>
				</div>
			</div>
			<div class="status-container">
				<div class="success-icon"></div>
				<div class="info-desc">
					<div class="mobile-title">
						<span>手机号码</span>
					</div>
					<div class="mobile">
						<span>{{ personalInfo.mobile }}</span>
						<span v-if="personalInfo.modifyMobileAuditStatus === 'AUDITING'" :class="[personalInfo.modifyMobileAuditStatus === 'AUDITING' ? 'tag-info' : 'tag-info']">变更审核中</span>
						<a-tooltip placement="top">
							<template slot="title">
								<span>审核时间：{{ personalInfo.modifyMobileAuditTime }}</span><br>
								<span>审核意见：{{ personalInfo.modifyMobileAuditRemark }}</span>
							</template>
							<span v-if="personalInfo.modifyMobileAuditStatus === 'REJECTED'" :class="[personalInfo.modifyMobileAuditStatus === 'REJECTED' ? 'tag-error' : 'tag-error']">变更审核不通过</span>
						</a-tooltip>
					</div>
				</div>
				<div
					class="btn"
					v-if="personalInfo.modifyMobileBtnShow"
					@click="changeMobile"
				>
					修改手机号
				</div>
			</div>
			<div class="status-container margin-top-20px">
				<div
					class="success-warn"
					v-if="!personalInfo.email"
				></div>
				<div
					class="success-icon"
					v-else
				></div>
				<div class="info-desc">
					<div class="mobile-title">邮箱</div>
					<div
						class="mobile"
						v-if="personalInfo.email"
					>
						{{ personalInfo.email }}
					</div>
					<div
						class="mobile"
						v-else
					>
						邮箱是您个人信息的重要组成，可用于接收邮件通知等，请尽快绑定邮箱
					</div>
				</div>
				<div
					class="btn"
					@click="changeEmail"
				>
					{{ personalInfo.email ? '修改邮箱' : '绑定邮箱' }}
				</div>
			</div>
		</div>
		<MobileChangeModal
			ref="MobileChangeModal"
			:personalInfo="personalInfo"
			:title="mobileChangeModalTitle"
			v-on:update="updatePersonalInfo"
		/>
		<EmailChangeModal
			ref="EmailChangeModal"
			:personalInfo="personalInfo"
			:title="emailChangeModalTitle"
			v-on:update="updatePersonalInfo"
		/>
	</div>
</template>

<script>
import { API_UPLOAD, API_GETCURRENTENV } from '@/v2/api';
import { API_PERSONALMODIFY, API_CertApplyInfo } from '@/v2/api/account';
import systemConfig from '@/v2/config/common';
import { mapGetters, mapActions } from 'vuex';
import MobileChangeModal from './MobileChangeModal';
import EmailChangeModal from './EmailChangeModal';

export default {
	props: {
		personalInfo: {
			type: Object,
			default() {
				return {};
			}
		}
	},
	data() {
		return {
			API_UPLOAD,
			formLayout: 'horizontal',
			form: this.$form.createForm(this, { name: 'coordinated' }),
			count: 60,
			disabled: false,
			fileUrl: '',
			fileList: [],
			loading: false,
			mobileChangeModalTitle: '绑定手机号',
			emailChangeModalTitle: '绑定邮箱',
			applyInfo: {},
			systemConfig
		};
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
		},
		isSignAuth() {
			return (
				this.VUEX_ST_COMPANYSUER.companyUserRoles.includes('admin') ||
				this.VUEX_ST_COMPANYSUER.companyUserRoles.includes('signer')
			);
		},
		avatarPic() {
			const style = {
				width: '80px',
				height: '80px',
				borderRadius: '50%',
				backgroundSize: 'cover',
				backgroundRepeat: 'no-repeat',
				backgroundPosition: 'center'
			}
			if (this.personalInfo.picUrl) {
				return {
					...style,
					backgroundImage: 'url(' + API_GETCURRENTENV(this.personalInfo.picUrl) + ')'
				};
			}
			return {
				...style,
				backgroundImage: 'url('+ this.systemConfig.accountInfo.avatarDefault +')',
			};
		}
	},
	components: {
		MobileChangeModal,
		EmailChangeModal
	},
	mounted() {
		this.getInfo();
		this.VUEX_USER_TOKEN();
	},
	methods: {
		API_GETCURRENTENV,
		...mapActions({
			VUEX_USER_TOKEN: 'user/VUEX_USER_TOKEN'
		}),
		relationCompany() {
			window.location.href = '/center/account/company/info';
		},
		async getInfo() {
			let res = await API_CertApplyInfo(); // 获取证书申请信息
			this.applyInfo = res.data;
		},
		updatePersonalInfo() {
			this.$emit('update', true);
		},
		changeMobile() {
			const role = this.VUEX_ST_COMPANYSUER?.companyUserRoles || [];
			if (role.includes('admin') || role.includes('signer')) {
				const modal = this.$confirm({
					title: '提示',
					content: `您当前的身份为${role.includes('admin') ? '管理员' : '签章员'}，请前往【企业管理-我的企业】进行修改`,
					cancelText: '取消',
					okText: '前往修改',
					onOk: () => {
						const path = role.includes('admin') ? '/center/account/company/user/changeOperatorMobile' : `/center/account/company/info/changeSignerMobile?id=${this.applyInfo?.id}`
						this.$router.push(path);
					},
					onCancel: () => {
						modal.destroy();
					}
				});
				return;
			}
			if (this.personalInfo.mobile) {
				this.mobileChangeModalTitle = '修改手机号码';
			}
			this.$refs.MobileChangeModal.showModal();
		},
		changeEmail() {
			if (this.personalInfo.email) {
				this.emailChangeModalTitle = '修改绑定邮箱';
			}
			this.$refs.EmailChangeModal.showModal();
		},
		async handleChange(info) {
			this.fileList = info.fileList;
			if (info.file.status === 'uploading') {
				this.loading = true;
				return;
			}
			if (info.file.status === 'done') {
				this.fileUrl = info.file.response.result;
				const result = await API_PERSONALMODIFY({
					picUrl: info.file.response.result
				});
				if (result.success) {
					this.$message.success('上传成功');
					this.$emit('update', true);
				}
				this.loading = false;
			}
		},
		beforeUpload(file) {
			const isLt2M = file.size / 1024 / 1024 < 2;
			if (!isLt2M) {
				this.$message.error('文件大小不能超过2M!');
			}
			return isLt2M;
		}
	}
};
</script>

<style lang="less" scoped>
@import url('~@/v2/style/tips-wrap.less');
@import url('~@/v2/style/tags.less');
</style>
<style lang="less" scoped>
.flex-center {
	display: flex;
	flex-direction: row;
	align-items: center;
}

.title {
	height: 33px;
	font-size: 24px;
	font-family: PingFangSC-Medium, PingFang SC;
	font-weight: 500;
	color: rgba(0, 0, 0, 0.8);
	line-height: 33px;
	margin-bottom: 30px;
}
.tips {
	margin-top: 30px;
}
.name-wrap {
	width: 100%;
	height: 80px;
	display: flex;
	flex-direction: row;
	align-items: center;
	margin-top: 50px;
}
.avatar {
	width: 80px;
	height: 80px;
	border-radius: 50%;
	position: relative;
	object-fit: contain;
}
.avatar::after {
	content: '';
	width: 24px;
	height: 24px;
	background-image: url('~v2/assets/imgs/person/avatar-upload.png');
	background-size: 24px 24px;
	position: absolute;
	right: 0;
	bottom: 0;
}
.desc {
	margin-left: 30px;
}
.name {
	color: rgba(0, 0, 0, 1);
	font-size: 20px;
	margin-right: 12px;
}
.status-wrap {
	width: auto;
	height: 28px;
	display: flex;
	align-items: center;
}
.card {
	font-size: 14px;
	color: rgba(0, 0, 0, 0.4);
	margin-top: 8px;
}
.success-icon {
	width: 16px;
	height: 16px;
	background-image: url('~v2/assets/imgs/person/success-l.png');
	background-size: 16px 16px;
}
.success-warn {
	width: 16px;
	height: 16px;
	background-image: url('~v2/assets/imgs/person/warning-s.png');
	background-size: 16px 16px;
}
.status-container {
	width: 760px;
	height: 80px;
	margin-top: 50px;
	border: 1px solid rgba(229, 230, 235, 1);
	box-sizing: border-box;
	border-radius: 4px;
	display: flex;
	flex-direction: row;
	align-items: center;
	padding: 0 20px;
	position: relative;
}
.info-desc {
	margin-left: 20px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	font-family: PingFang SC;
	.mobile-title {
		font-size: 16px;
		color: rgba(0, 0, 0, 0.8);
		font-weight: 500;
		display: flex;
		align-items: center;
	}
	.mobile {
		font-size: 14px;
		color: rgba(0, 0, 0, 0.4);
		margin-top: 8px;
	}
}
.margin-top-20px {
	margin-top: 20px;
}
.click-btn {
	color: @primary-color;
	cursor: pointer;
}
.auth-btn {
	color: @primary-color;
	cursor: pointer;
	margin-left: 20px;
	font-size: 14px;
}
.btn {
	font-size: 14px;
	color: @primary-color;
	position: absolute;
	right: 20px;
	cursor: pointer;
}
.avatar-uploader {
	width: 80px;
	height: 80px;
	display: flex;
	/deep/.ant-upload-select-picture-card {
		width: 80px;
		height: 80px;
		margin: 0;
		background-color: #fff;
		border: none;
		.ant-upload {
			padding: 0;
		}
	}
}
.tag-info,.tag-error {
	margin-left: 10px;
	cursor: pointer;
}
.status-approve {
	width: 72px;
	height: 20px;
	display: inline-block;
	background: rgba(197, 236, 221, 1);
	text-align: center;
	font-size: 12px;
	color: rgba(62, 179, 132, 1);
	line-height: 20px;
	border-radius: 4px;
}
</style>
