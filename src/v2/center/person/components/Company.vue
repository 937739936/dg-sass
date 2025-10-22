<template>
	<div class="background-wrapper slMain">
		<a-card :bordered="false" style="padding-bottom: 0;">
			<div style="min-height: 136px; border-radius: 2px; padding-bottom: 20px;">
				<div class="title-page">企业信息</div>
				<div class="tips-warn-wrap" v-if="(tipsEnum[expireWarnEnum] && tipsEnum[expireWarnEnum].text)">
					<span>{{ tipsEnum[expireWarnEnum].text.replace('yyyy-mm-dd', endDate) }}</span>
					<span class="click-btn" @click="$router.push(tipsEnum[expireWarnEnum].link)">{{ tipsEnum[expireWarnEnum].btn }}</span>
				</div>
				<div class="tips-warn-wrap" v-if="(tipsEnum[expireWarnEnum2] && tipsEnum[expireWarnEnum2].text)">
					<span>{{ tipsEnum[expireWarnEnum2].text.replace('yyyy-mm-dd', endDate) }}</span>
					<span class="click-btn" @click="$router.push(tipsEnum[expireWarnEnum2].link)">{{ tipsEnum[expireWarnEnum2].btn }}</span>
				</div>
				<p class="company-name-wrap">
					<span class="company-name">{{ companyInfo.name }}</span>
					<span
						class="status o"
						v-if="companyInfo.status == 'FREEZE'"
						>企业被冻结</span
					>
					<template v-else>
						<a-popover
							title=""
							:getPopupContainer="
								e => {
									return e.parentNode;
								}
							"
							:visible="true"
							v-if="companyInfo.companyAuditLog && companyInfo.companyAuditLog.status == 'EDIT'"
							placement="right"
						>
							<template slot="content">
								<p style="color: #ff693a; font-size: 15px; font-weight: bold">企业认证审核未通过</p>
								<span
									class="p10 maxWidth"
									style="color: #ff693a; font-size: 15px"
									>{{ companyInfo.companyAuditLog.auditOpinion }}</span
								>
							</template>
							<span
								class="status r"
								style="position: relative"
								v-if="isAdmin"
								>审核未通过</span
							>
						</a-popover>

						<a-popover
							title=""
							v-if="companyModifyStatus === 'EDIT' || adminModifyStatus === 'EDIT' || adminMobileModifyStatus === 'EDIT'"
							placement="bottom"
						>
							<template slot="content">
								<p v-if="companyModifyStatus === 'EDIT'">企业信息变更审核未通过</p>
								<p v-if="adminModifyStatus === 'EDIT'">企业管理员变更审核未通过</p>
								<p v-if="adminMobileModifyStatus === 'EDIT'">企业管理员手机号变更审核未通过</p>
								<span class="p10 maxWidth">
									<template v-if="companyModifyStatus == 'EDIT'">
										<span style="width: 200px;display: inline-block">
											信息变更审核未通过原因：{{
												companyInfo.companyModifyLog && companyInfo.companyModifyLog.auditOpinion
											}} </span
										><br />
									</template>
									<template v-if="adminModifyStatus == 'EDIT'">
										<span style="width: 200px;display: inline-block">
											管理员变更审核未通过原因：{{
												companyInfo.companyAdminModifyLog && companyInfo.companyAdminModifyLog.auditOpinion
											}} </span
										><br />
									</template>
									<template v-if="adminMobileModifyStatus == 'EDIT'">
										<span style="width: 200px;display: inline-block">
											管理员手机号变更审核未通过原因：{{
												companyInfo.companyAdminMobileModifyLog && companyInfo.companyAdminMobileModifyLog.auditOpinion
											}} </span
										><br />
									</template>
								</span>
							</template>
							<span class="status r" v-if="isAdmin">审核未通过</span>
						</a-popover>
						<span
							class="status b"
							v-if="
								companyAuthStatus == 'WAIT_AUDIT' ||
								companyModifyStatus == 'WAIT_AUDIT' ||
								adminModifyStatus == 'WAIT_AUDIT' ||
								adminMobileModifyStatus == 'WAIT_AUDIT'
							"
							>审核中</span
						>
						<span
							class="status y"
							v-if="companyInfo.status == 'NORMAL'"
							>已认证</span
						>
					</template>
				</p>
				<div class="desc-wrap">
					<p>
						<span>统一社会信用代码：</span>
						<span>{{ companyInfo.uscc }}</span>
					</p>
					<p>
						<span>公司法定代表人：</span>
						<span>{{ companyInfo.legalPersonName }}</span>
					</p>
					<p>
						<span>企业管理员：</span>
						<span>{{ companyInfo.adminName }}</span>
					</p>
					<p>
						<span>认证时间：</span>
						<span>{{ companyInfo.joinDate || '-' }}</span>
					</p>
				</div>
				<div
					class="button-wrapper"
					v-if="Object.keys(companyInfo).length > 0"
				>
					<a-button
						v-if="companyInfo.companyAuditLog && companyInfo.companyAuditLog.status == 'EDIT'"
						class="button"
						type="primary"
						@click="submit"
					>
						重新提交企业审核
					</a-button>
				</div>
			</div>
			<div class="grid-line"></div>
			<a-tabs
				:default-active-key="activeKey"
				@change="onChange"
				v-if="tabList.length > 0"
			>
				<a-tab-pane
					:key="item.value"
					v-for="item in tabList"
				>
					<span slot="tab">
						{{ item.label }}
						<em
							class="redDot"
							v-if="item.flag"
						></em>
					</span>
				</a-tab-pane>
			</a-tabs>
		</a-card>
		<div
			class="info-content"
			:bordered="false"
		>
			<BaseInfo
				v-if="activeKey == 1"
				:companyInfo="companyInfo"
				:companyModifyStatus="companyModifyStatus"
				:handleMenuClick="handleMenuClick"
				:adminModifyStatus="adminModifyStatus"
				:adminMobileModifyStatus="adminMobileModifyStatus"
				v-on:update="updateCompanyInfo"
			></BaseInfo>
			<template v-if="this.VUEX_ST_PERSONALLINFO.curCompanyId">
				<CertCard v-if="activeKey == 2"></CertCard>
				<BankAccountCard
					v-if="activeKey == 3"
					@reload="init()"
				></BankAccountCard>
				<BillingInfo
					v-if="activeKey == 4"
					@reload="init()"
				></BillingInfo>
				<ContactPerson
					v-if="activeKey == 5"
					@reload="init()"
				></ContactPerson>
				<CompanyEmployees v-if="activeKey == 6"></CompanyEmployees>
				<CompanySignPlace v-if="activeKey == 7"></CompanySignPlace>
			</template>
		</div>

		<CompanyTypeModal ref="companyTypeModal"></CompanyTypeModal>

		<!-- 错误信息提示 -->
		<div
			class="ant-message"
			v-if="messageVisible"
		>
			<span>
				<div class="ant-message-notice">
					<div class="ant-message-notice-content">
						<div class="ant-message-custom-content ant-message-info">
							<a-icon
								type="exclamation-circle"
								theme="filled"
							/>
							<span>{{ messageContent }}</span>
							<a-icon
								type="close"
								@click="
									() => {
										messageVisible = false;
									}
								"
							/>
						</div>
					</div>
				</div>
			</span>
		</div>
	</div>
</template>

<script>
import BaseInfo from './BaseInfo';
import CertCard from './CertCard';
import BankAccountCard from './BankAccountCard';
import BillingInfo from './BillingInfo';
import ContactPerson from './ContactPerson';
import CompanyEmployees from './CompanyEmployees';
import CompanySignPlace from './CompanySignPlace';
import { mapGetters } from 'vuex';
import CompanyTypeModal from './CompanyTypeModal.vue';
import { hasAuth } from '@/v2/utils/checkAuth.js';
import { filterCodeByKey } from '@sub/utils/globalCode.js';
import {
	API_CompanyInfolossWarn,
	API_CheckBeforeEachApply,
	API_AdminExpireOrFreezeRemind,
	API_GetCompanyInfoChangeType
} from '@/v2/api/account';

export default {
	name: 'Company',
	components: {
		BaseInfo,
		CertCard,
		BankAccountCard,
		BillingInfo,
		ContactPerson,
		CompanyEmployees,
		CompanyTypeModal,
		CompanySignPlace
	},
	props: {
		companyInfo: {
			type: Object,
			default: () => {
				return {};
			}
		}
	},
	data() {
		return {
			hasAuth,
			companyStatusDict: filterCodeByKey('companyStatusDict'),
			activeKey: this.$route.query.type == 'activateSeal' ? 2 : 1,
			tabList: [],
			companyAuthStatus: '', // 企业认证审核状态
			companyModifyStatus: '', // 企业信息变更审核状态
			adminModifyStatus: '', // 管理员变更审核状态
			adminMobileModifyStatus: '', //管理员手机号变更审核状态
			messageVisible: false,
			messageContent: '',
			expireWarnEnum: '',
			expireWarnEnum2: '',
			endDate: null,
			tipsEnum: {
				COMPANY_NAME_CHANGE: {
					text: '系统检测到您的企业名称发生变更，请点击',
					btn: '变更企业信息',
					link: '/center/account/company/info/certified?type=edit&changeType=COMPANY_NAME_CHANGE'
				},
				LEGAL_PERSON_CHANGE: {
					text: '系统检测到您的法定代表人发生变更，请点击',
					btn: '变更法定代表人',
					link: '/center/account/company/info/certified?type=edit&changeType=LEGAL_PERSON_CHANGE'
				},
				COMPANY_NAME_AND_LEGAL_PERSON_CHANGE: {
					text: '系统检测到您的企业名称、法定代表人发生变更，请点击',
					btn: '变更企业信息',
					link: '/center/account/company/info/certified?type=edit&changeType=COMPANY_NAME_AND_LEGAL_PERSON_CHANGE'
				},
				ABOUT_TO_EXPIRE: {
					text: '您的管理员授权期限即将在yyyy-mm-dd过期，如未及时续期，您企业下的账号将被冻结，点击',
					btn: '续期',
					link: '/center/account/company/user/ChangeOperatorAuthorizationPeriod'
				},
				EXPIRE: {
					text: '您的管理员授权期限已在yyyy-mm-dd过期，您企业下的账号已被冻结，点击',
					btn: '续期',
					link: '/center/account/company/user/ChangeOperatorAuthorizationPeriod'
				},
				NORMAL: {
					text: '',
					btn: '',
					link: ''
				}
			}
		};
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_PERSONALLINFO: 'VUEX_ST_PERSONALLINFO',
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER',
		}),
		isAdmin() {
			return this.VUEX_ST_COMPANYSUER.companyUserRoles?.includes('admin')
		}
	},
	created() {
		// this.companyInfo = this.companyInfo || {};
		this.setStatus();
		this.getCompanyStatus();
	},
	watch: {
		companyInfo: {
			handler() {
				this.init();
			},
			deep: true,
			immediate: true
		}
	},
	methods: {
		updateCompanyInfo() {
			this.$emit('update', true);
		},
		async getCompanyStatus() {
			const statusAll = [API_GetCompanyInfoChangeType(), API_AdminExpireOrFreezeRemind()]
			const result = await Promise.all(statusAll);
			if (result[0].success && result[0].data) {
				this.expireWarnEnum = result[0].data;
			}
			if (result[1].success) {
				this.expireWarnEnum2 = result[1].data.expireWarnEnum;
				this.endDate = result[1].data.endDate;
			}
		},
		setStatus() {
			// 获取企业认证、企业信息变更、管理员变更、管理员手机号变更的审核状态
			let arr = [
				{ key: 'companyModifyLog', title: 'companyModifyStatus' },
				{ key: 'companyAdminModifyLog', title: 'adminModifyStatus' },
				{ key: 'companyAdminMobileModifyLog', title: 'adminMobileModifyStatus' },
				{ key: 'companyAuditLog', title: 'companyAuthStatus' }
			];
			arr.forEach(element => {
				switch (this.companyInfo[element.key] && this.companyInfo[element.key].status) {
					case 'WAIT_AUDIT':
						this[element.title] = 'WAIT_AUDIT';
						break;
					case 'WAIT_LAST_AUDIT':
						this[element.title] = 'WAIT_AUDIT';
						break;
					default:
						this[element.title] = this.companyInfo[element.key] && this.companyInfo[element.key].status;
				}
			});
		},
		init() {
			if (this.companyInfo.status === 'NORMAL') {
				API_CompanyInfolossWarn().then(res => {
					if (res.data) {
						if (this.VUEX_ST_PERSONALLINFO.curCompanyId) {
							this.tabList = [
								{
									label: '基本信息',
									value: 1,
									flag: false
								},
								{
									label: '电子签章',
									value: 2,
									flag: res.data.certFlag
								},
								{
									label: '银行账户信息',
									value: 3,
									flag: res.data.accountFlag
								},
								{
									label: '开票信息',
									value: 4,
									flag: res.data.invoiceFlag
								},
								{
									label: '合同签约地',
									value: 7,
									flag: res.data.invoiceFlag
								},
								{
									label: '联系人信息',
									value: 5,
									flag: res.data.linkManFlag
								},
								{
									label: '企业员工',
									value: 6,
									flag: false
								}
							];
							//煤炭没有电子签章
							if (this.companyInfo.companyType == 'COAL_MINE') {
								this.tabList = this.tabList.filter(item => {
									return item.value != 2;
								});
							}
							if (res.data.certFlag || res.data.accountFlag || res.data.invoiceFlag || res.data.linkManFlag) {
								this.$message.warning({
									content: '当前企业信息有缺失，为保证交易正常，请补全企业信息',
									duration: 5
								});
							}
						} else {
							this.tabList = [
								{
									label: '基本信息',
									value: 1,
									flag: false
								}
							];
						}
					}
				});
			}
		},
		onChange(key) {
			this.activeKey = key;
		},
		async handleMenuClick(v) {
			if (v.key === 'changeCompanyInfo') {
				// 变更企业信息与证书相关审核流程不能同时进行
				let res = await API_CheckBeforeEachApply();
				if (res.data.boo) {
					this.$router.push({ path: '/center/account/company/info/change', params: { companyId: this.id } });
				} else {
					this.messageVisible = true;
					this.messageContent = res.data.msg;
					setTimeout(() => {
						this.messageVisible = false;
					}, 5000);
				}
			} else {
				this.$router.push({ path: v.key, params: { companyId: this.id } });
			}
		},

		submit() {
			this.$refs.companyTypeModal.showModal(this.companyInfo.uscc);
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/tips-wrap.less');
</style>
<style lang="less" scoped>
.slMain {
	margin-top: -10px;
}
.company-name-wrap {
	font-size: 14px;
	font-weight: 500;
	color: #141517;
	letter-spacing: 0;
	line-height: 22px;
	margin-bottom: 10px;
	display: flex;
	align-items: center;
	.status {
		width: auto;
		height: 20px;
		line-height: 20px;
		text-align: center;
		padding: 0 6px;
		box-sizing: border-box;
		font-size: 12px;
		border-radius: 4px;
		margin-left: 12px;
	}
	.r {
		background: #fdebe3;
		color: #ff693a;
	}
	.o {
		background: #fdf4ea;
		color: #ee9b49;
	}
	.b {
		background: #e6edfa;
		color: #1f5ecf;
	}
	.y {
		background: #e8f5f5;
		color: #4cab9d;
	}
}
.maxWidth {
	max-width: 500px;
}
.button-wrapper {
	position: absolute;
	right: 20px;
	bottom: 40px;
	z-index: 1;
	border-radius: 4px;
	color: #ffffff;
	.button {
		padding: 0 34px;
		height: 32px;
		float: right;
		margin-right: 20px;
	}
}

::v-deep {
	.ant-descriptions {
		padding-top: 20px !important;
	}
	.ant-descriptions .ant-descriptions-row .ant-descriptions-item {
		padding-bottom: 8px !important;
	}
	.ant-modal-wrap {
		z-index: 100000;
	}
}

.redDot {
	display: inline-block;
	width: 6px;
	height: 6px;
	background: red;
	border-radius: 50%;
	position: relative;
	top: -8px;
}

.ant-message {
	z-index: 10000;
}
.ant-message-notice-content {
	background: #e7f0ff;
	border: 1px solid #d1e1fb;
	padding: 8px 15px;
}
.ant-message-info .anticon-close {
	color: #999;
	display: inline-block;
	margin-left: 10px;
	cursor: pointer;
	font-size: 16px;
	font-weight: bold;
	margin-right: 0;
}
.ant-message-info .anticon-exclamation-circle {
	margin-right: 0;
}
.content {
	margin-top: 20px;
}
.info-content {
	background: #fff;
	padding: 0 30px;
	padding-top: 30px;
}
/deep/ .ant-tabs-ink-bar {
	bottom: 2px;
}
.title-page {
	font-size: 24px;
	font-weight: 500;
	color: rgba(0, 0, 0, 0.8);
	font-family: PingFang SC;
}
.company-name-wrap {
	display: flex;
	margin-top: 20px;
}
.company-name {
	font-size: 16px;
	font-weight: 500;
	font-family: PingFang SC;
}
.desc-wrap {
	display: flex;
	margin-top: 20px;
	p {
		width: 403px;
		text-align: left;
		span:nth-child(1) {
			color: rgba(0, 0, 0, 0.4);
		}
		span:nth-child(2) {
			color: rgba(0, 0, 0, 0.8);
		}
	}
}
.grid-line {
	width: calc(100% + 60px);
	height: 20px;
	background: #f3f5f6;
	position: relative;
	left: -30px;
}
.tips-warn-wrap {
	margin-top: 20px;
}
.click-btn {
	font-size: 14px;
	color: @primary-color;
	cursor: pointer;
}
</style>
