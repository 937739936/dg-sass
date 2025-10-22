<template>
	<div class="CertifiedDes">
		<div class="title">我的企业</div>
		<div class="step">
			<div class="person-left">
				<img
					src="../../../assets/imgs/person/autonym.png"
					alt=""
				/>
				<span class="finish">个人实名认证</span>
				<span
					class="unfinished"
					v-if="!VUEX_ST_PERSONALLINFO.name"
				>
					（未实名）
				</span>
				<span
					class="finish"
					v-else
				>
					（已实名）
					<img
						src="../../../assets/imgs/person/success-s.png"
						alt=""
						style="width: 16px; height: 16px; margin-left: 10px"
					/>
				</span>
			</div>
			<div class="company-right">
				<img
					src="../../../assets/imgs/person/company-unverified.png"
					alt=""
				/>
				<span class="unfinished">企业认证（未认证）</span>
			</div>
		</div>
		<a-row :gutter="30">
			<a-col :span="12">
				<div class="company-join">
					<img
						src="../../../assets/imgs/person/qyrz-1-l.png"
						alt=""
					/>
					<div class="desc">
						<div class="title">
							<span>认证企业</span>
							<a-tooltip placement="top">
								<template slot="title">
									<span v-if="companyInfo.auditStatus === 'WAIT_AUDIT'">
										<span>认证企业：{{ companyInfo.name }}</span>
										<br />
										<span v-if="companyInfo.companyAuditLog">提交时间：{{ companyInfo.companyAuditLog.optTime }}</span>
									</span>
									<span v-else>
										<span>审核结果：不通过</span><br />
										<span v-if="companyInfo.companyAuditLog">审核时间：{{ companyInfo.companyAuditLog.optTime }}</span>
										<br />
										<span v-if="companyInfo.companyAuditLog">审核意见：{{ companyInfo.companyAuditLog.auditOpinion }}</span>
									</span>
								</template>
								<span
									:class="[companyInfo.auditStatus === 'WAIT_AUDIT' ? 'audit-status-ing' : 'audit-status-reject']"
									v-if="companyInfo.auditStatus"
								>
									{{ companyInfo.auditStatus === 'WAIT_AUDIT' ? '审核中' : '审核不通过' }}
								</span>
							</a-tooltip>
						</div>
						<div class="about">
							如果您的企业还未在{{ systemConfig.name }}注册认证， <br />
							您可提供相关材料（材料要求如下）进行企业认证，认证成功后，您将成为该企业管理员
						</div>
						<a-button
							type="primary"
							style="width: 130px; box-shadow: none"
							@click="verified('companyTypeModal')"
							:disabled="companyInfo.auditStatus === 'WAIT_AUDIT' || applyInfo.status === 'DEFAULT'"
						>
							认证新企业
						</a-button>
					</div>
				</div>
			</a-col>
			<a-col :span="12">
				<div class="company-join">
					<img
						src="../../../assets/imgs/person/qyrz-2-l.png"
						alt=""
					/>
					<div class="desc">
						<div class="title">
							<span>加入企业</span>
							<a-tooltip placement="top">
								<template slot="title">
									<span v-if="applyInfo.status === 'DEFAULT'">
										<span>申请加入企业：{{ applyInfo.companyName }}</span
										><br />
										<span v-if="applyInfo.optTime">提交时间：{{ applyInfo.optTime }}</span>
									</span>
									<span v-else>
										<span>审核结果：不通过</span><br />
										<span>申请加入企业：{{ applyInfo.companyName }}</span
										><br />
										<span v-if="applyInfo.optTime">审核时间：{{ applyInfo.optTime }}</span>
									</span>
								</template>
								<span
									class="audit-status-ing"
									v-if="applyInfo && applyInfo.status === 'DEFAULT'"
									>企业管理员审核中</span
								>
								<span
									class="audit-status-reject"
									v-if="applyInfo && applyInfo.status === 'REJECTED'"
									>企业管理员审核未通过</span
								>
							</a-tooltip>
						</div>
						<div class="about">
							如果您的企业已在{{ systemConfig.name }}完成认证， <br />
							公司管理员邀请您加入企业或申请加入企业
						</div>
						<a-button
							type="primary"
							ghost
							style="width: 88px; box-shadow: none"
							@click="verified('applyJoinCompany')"
							:disabled="companyInfo.auditStatus === 'WAIT_AUDIT' || applyInfo.status === 'DEFAULT'"
						>
							申请加入
						</a-button>
						<a-button
							type="primary"
							style="width: 130px; margin-left: 30px; box-shadow: none"
							@click="verified('verifyJoinCompany')"
							:disabled="companyInfo.auditStatus === 'WAIT_AUDIT' || applyInfo.status === 'DEFAULT'"
							>验证并加入</a-button
						>
					</div>
				</div>
			</a-col>
		</a-row>
		<div class="tip">
			<img
				src="../../../assets/imgs/person/tip.png"
				alt=""
			/>
			以下所需材料，在企业入驻审核通过后，请在十日内将纸质资料邮寄到我司进行备案
		</div>
		<div class="materials">
			<div class="item">
				<div style="display: flex">
					<img
						src="../../../assets/imgs/person/company-item-1.png"
						alt=""
					/>
					<div style="padding-top: 33px">
						<div class="title">贸易商、金融机构、仓储企业认证所需材料</div>
						<div class="desc">
							营业执照（须加盖公章）、法人身份证（正反面）、代理人身份证（正反面）（法人申请时，无须提供）、《企业管理员授权书》
						</div>
					</div>
				</div>
				<a-button
					type="primary"
					@click="down(systemConfig.accountInfo.adminAuthorizationLetter, '企业管理员授权书')"
					style="box-shadow: none"
				>
					下载模板
				</a-button>
			</div>
			<div class="item">
				<div style="display: flex">
					<img
						src="../../../assets/imgs/person/company-item-2.png"
						alt=""
					/>
					<div style="padding-top: 33px">
						<div class="title">终端企业认证所需材料</div>
						<div class="desc">《授权委托书》</div>
					</div>
				</div>
				<a-button
					type="primary"
					@click="down(systemConfig.accountInfo.companyAuth, '授权委托书')"
					style="box-shadow: none"
				>
					下载模板
				</a-button>
			</div>
			<div class="item">
				<div style="display: flex">
					<img
						src="../../../assets/imgs/person/company-item-2.png"
						alt=""
					/>
					<div style="padding-top: 33px">
						<div class="title">物流企业认证所需材料</div>
						<div class="desc">
							营业执照（须加盖公章）、法人身份证（正反面）、代理人身份证（正反面）（法人申请时，无须提供）《道路运输经营许可证》、《企业管理员授权书》
						</div>
					</div>
				</div>
				<a-button
					type="primary"
					@click="down(systemConfig.accountInfo.adminAuthorizationLetter, '企业管理员授权书')"
					style="box-shadow: none"
				>
					下载模板
				</a-button>
			</div>
			<div class="item">
				<div style="display: flex">
					<img
						src="../../../assets/imgs/person/company-item-3.png"
						alt=""
					/>
					<div style="padding-top: 33px">
						<div class="title">电子证书开通所需材料</div>
						<div class="desc">《数字证书申请表》、《数字证书申请和使用授权书》、签章员身份证（正反面）</div>
					</div>
				</div>
				<a-button
					type="primary"
					@click="downloadTemplate"
					style="box-shadow: none"
				>
					下载模板
				</a-button>
			</div>
			<div class="item">
				<div style="display: flex">
					<img
						src="../../../assets/imgs/person/company-item-4.png"
						alt=""
					/>
					<div style="padding-top: 13px">
						<div class="title">收件地址</div>
						<div class="desc">
							收件地址：河南省郑州市金水区中华保险大厦21楼数链科技 <br />
							收件人： 数科认证部 <br />
							联系电话：13676976042 邮编：450008 <br />
						</div>
					</div>
				</div>
			</div>
		</div>
		<ApplyJoinCompany
			ref="applyJoinCompany"
			v-on:refresh="refresh"
		/>
		<VerifyJoinCompany ref="verifyJoinCompany" />
		<CompanyTypeModal ref="companyTypeModal" />
		<personValid ref="personValidModel" />
		<a-modal
			v-model="unverifiedVisible"
			title="温馨提示"
			width="408px"
			@ok="unverifiedVisible = true"
		>
			<div class="desc">请先完成个人实名认证，再进行企业认证</div>
			<template slot="footer">
				<a-button
					type="primary"
					style="width: 90px"
					@click="showModel"
					>去实名</a-button
				>
			</template>
		</a-modal>
	</div>
</template>

<script lang="jsx">
import { API_JOINCOMPANYBYINVITECODE, API_SEACHCOMPANYLIST, API_JOINCOMPANYBYAPPLY } from '@/v2/center/person/api';
import { API_PERSONALDETAIL, API_GetApplyJoinLatestRecord, API_SystemConfigFile } from '@/v2/api/account';
import { mapActions, mapGetters } from 'vuex';
import CompanyTypeModal from './CompanyTypeModal.vue';
import { down } from '@/v2/utils/factory';
import personValid from '@/v2/components/personValid';
import systemConfig from '@/v2/config/common';
import comDownload from '@sub/utils/comDownload.js';
import VerifyJoinCompany from './VerifyJoinCompany.vue';
import ApplyJoinCompany from './ApplyJoinCompany.vue';

export default {
	name: 'CertifiedDes',
	props: {
		companyInfo: {
			type: Object,
			default() {
				return {};
			}
		}
	},
	components: {
		personValid,
		CompanyTypeModal,
		VerifyJoinCompany,
		ApplyJoinCompany
	},
	data() {
		return {
			down,
			// certTemplate,
			formApply: this.$form.createForm(this),
			// formVerified: this.$form.createForm(this),
			formLayout: {
				labelCol: {
					span: 5
				},
				wrapperCol: {
					span: 10
				}
			},
			visible: false,
			visibleApply: false,
			visibleVerified: false,
			visibleCompany: false,
			unverifiedVisible: false,
			applyInfo: {},
			systemConfig
		};
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER',
			VUEX_ST_PERSONALLINFO: 'VUEX_ST_PERSONALLINFO'
		})
	},
	mounted() {
		this.getCompanyJoinDetail();
	},
	methods: {
		...mapActions({
			VUEX_USER_LOGOUT: 'user/VUEX_USER_LOGOUT'
		}),
		async downloadTemplate() {
			API_SystemConfigFile({
				codes: ['CFCA_APPLY_AND_AUTH_TEMPLATE', 'CFCA_APPLY_TEMPLATE'],
				zipName: '电子证书开通所需材料.zip'
			}).then(res => {
				comDownload(res, undefined, '电子证书开通所需材料.zip');
			});
		},
		refresh() {
			this.$emit('refresh');
		},
		async getCompanyJoinDetail() {
			const { data } = await API_GetApplyJoinLatestRecord();
			if (data) {
				this.applyInfo = data;
			}
		},
		joinedCompany() {
			if (this.VUEX_ST_COMPANYSUER.id) {
				this.$message.error('您已加入了企业，不可以再加入其他企业');
			}
			return Boolean(this.VUEX_ST_COMPANYSUER.id);
		},
		// 验证实名认证
		verified(v) {
			API_PERSONALDETAIL().then(res => {
				if (res.data && res.data.personal && res.data.personal.auth) {
					this.$refs[v].showModal();
				} else {
					this.unverifiedVisible = true;
				}
			});
		},

		// 邀请码加入
		handleOkVerified() {
			this.formVerified.validateFields((err, values) => {
				if (!err) {
					API_JOINCOMPANYBYINVITECODE({ inviteCode: values.code }).then(res => {
						if (res.code != 200) {
							this.$message.error(res.message);
							return;
						}
						this.$message.success('恭喜您，验证通过，请退出后重新登录。');
						this.visibleVerified = false;
						this.VUEX_USER_LOGOUT();
					});
				}
			});
		},

		// 企业名称加入
		handleOkApply() {
			this.formApply.validateFields((err, values) => {
				if (!err) {
					API_SEACHCOMPANYLIST({
						searchKeys: encodeURIComponent(values.companyName)
					}).then(res => {
						if (res.code != 200) {
							this.$message.error(res.message);
							return;
						}
						if (!res.result || !res.result.length) {
							this.$message.error('没有找到对应企业，请确认企业名是否存在');
							return;
						}
						API_JOINCOMPANYBYAPPLY({ companyName: values.companyName }).then(res => {
							if (!res.success) {
								this.$message.error(res.message);
								return;
							}
							this.$message.success('申请成功，请耐心等待企业管理员审核');
							this.visibleApply = false;
						});
					});
				}
			});
		},
		showModel() {
			this.unverifiedVisible = false;
			this.$router.push({
				path: '/center/account/person/info/auth'
			});
		}
	}
};
</script>
<style lang="less" scoped>
.CertifiedDes {
	padding: 20px 3px;
	.title {
		height: 33px;
		font-size: 24px;
		font-family:
			PingFangSC-Medium,
			PingFang SC;
		font-weight: 500;
		color: rgba(0, 0, 0, 0.8);
		line-height: 33px;
		margin-bottom: 30px;
	}
	.step {
		display: flex;
		margin-bottom: 30px;
		div {
			padding-left: 30px;
			img {
				width: 32px;
				height: 32px;
				margin-right: 16px;
			}
		}
		.person-left {
			width: 320px;
			height: 56px;
			line-height: 56px;
			background: url('~@/v2/assets/imgs/person/person-left-bg.png') no-repeat;
			background-size: cover;
		}
		.company-right {
			width: 320px;
			height: 56px;
			line-height: 56px;
			background: url('~@/v2/assets/imgs/person/person-right-bg.png') no-repeat;
			background-size: cover;
		}
		.finish {
			color: #4682f3;
			font-family:
				PingFangSC-Medium,
				PingFang SC;
			font-weight: 500;
		}
		.unfinished {
			color: rgba(0, 0, 0, 0.4);
			font-family:
				PingFangSC-Medium,
				PingFang SC;
			font-weight: 500;
		}
	}
	.company-join {
		height: 192px;
		background: #ffffff;
		border-radius: 4px;
		border: 1px solid #e5e6eb;
		padding-top: 30px;
		padding-left: 30px;
		display: flex;
		margin-bottom: 30px;
		img {
			width: 56px;
			height: 56px;
			margin-right: 20px;
		}
		.desc {
			.title {
				height: 22px;
				font-size: 16px;
				font-family:
					PingFangSC-Medium,
					PingFang SC;
				font-weight: 500;
				color: rgba(0, 0, 0, 0.8);
				line-height: 22px;
				margin-bottom: 8px;
			}
			.about {
				height: 40px;
				font-size: 14px;
				font-family:
					PingFangSC-Regular,
					PingFang SC;
				font-weight: 400;
				color: rgba(0, 0, 0, 0.4);
				line-height: 20px;
				margin-bottom: 30px;
			}
		}
	}
	.tip {
		height: 40px;
		background: #f3f7ff;
		border-radius: 4px;
		border: 1px solid #e5e6eb;
		font-size: 14px;
		font-family:
			PingFangSC-Regular,
			PingFang SC;
		font-weight: 400;
		color: rgba(0, 0, 0, 0.8);
		line-height: 40px;
		margin-bottom: 30px;
		img {
			width: 16px;
			height: 16px;
			margin: 0 12px;
			vertical-align: sub;
		}
	}
	.materials {
		// height: 464px;
		border-radius: 4px;
		border: 1px solid #e5e6eb;
		.item {
			display: flex;
			height: 116px;
			justify-content: space-between;
			padding: 0 30px;
			img {
				width: 32px;
				height: 32px;
				margin-right: 28px;
				margin-top: 42px;
			}
			.title {
				height: 22px;
				font-size: 16px;
				font-family:
					PingFangSC-Medium,
					PingFang SC;
				font-weight: 500;
				color: rgba(0, 0, 0, 0.8);
				line-height: 22px;
				margin-bottom: 8px;
			}
			.desc {
				height: 20px;
				font-size: 14px;
				font-family:
					PingFangSC-Regular,
					PingFang SC;
				font-weight: 400;
				color: rgba(0, 0, 0, 0.4);
				line-height: 20px;
				margin-bottom: 0;
			}
			&:nth-child(2n + 2) {
				background: #f3f5f6;
			}
			button {
				margin-top: 42px;
			}
		}
	}
}
::v-deep {
	.ant-card-head-title {
		font-size: 16px;
		color: #141517;
		line-height: 24px;
		position: relative;
		padding-left: 10px;
	}
	.ant-card-head-title:before {
		position: absolute;
		content: '';
		display: block;
		width: 2px;
		height: 15px;
		background: @primary-color;
		top: 21px;
		left: 0;
	}
}
.display-box {
	display: flex;
}
.icon {
	width: 47px;
	height: 47px;
	margin-right: 20px;
}
.add-button {
	padding: 0 30px;
}
.tc {
	text-align: center;
}
.add-button {
	width: 215px;
	margin-bottom: 16px;
}
.title {
	font-size: 16px;
	color: #141517;
	line-height: 24px;
}
.divider {
	float: left;
	height: 100%;
	width: 2px;
}
p {
	color: #383a3f;
	letter-spacing: 0;
	font-weight: 600;
	margin-bottom: 15px;
	margin-top: 10px;
}
pre {
	line-height: 25px;
}
.des {
	color: #6b6f76;
	letter-spacing: 0;
}
.remark {
	font-size: 10px;
	color: #f24e4d;
	letter-spacing: 0;
	line-height: 20px;
	display: inline-block;
	margin-top: 24px;
}
.apply-des {
	font-size: 10px;
	color: #9ba0aa;
	margin-bottom: 15px;
}
/deep/ .ant-modal-header {
	height: 58px;
	background: #f3f5f6;
	.ant-modal-title {
		font-size: 18px;
		font-family:
			PingFangSC-Medium,
			PingFang SC;
		font-weight: 500;
		color: rgba(0, 0, 0, 0.8);
	}
}
/deep/ .ant-modal-footer {
	padding: 17px 30px;
}
.audit-status-ing {
	min-width: 48px;
	width: auto;
	height: 20px;
	line-height: 20px;
	display: inline-block;
	text-align: center;
	background: rgba(255, 218, 200, 1);
	color: rgba(255, 121, 55, 1);
	font-size: 12px;
	border-radius: 4px;
	margin-left: 12px;
	padding: 0 6px;
	box-sizing: border-box;
	cursor: pointer;
}
.audit-status-reject {
	min-width: 48px;
	height: 20px;
	line-height: 20px;
	display: inline-block;
	text-align: center;
	background: rgba(242, 208, 208, 1);
	color: rgba(221, 68, 68, 1);
	font-size: 12px;
	border-radius: 4px;
	margin-left: 12px;
	padding: 0 6px;
	box-sizing: border-box;
	cursor: pointer;
}
</style>
