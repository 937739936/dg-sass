<template>
	<div style="padding-bottom: 100px">
		<div class="slTitleAssis">
			<span>
				<span>基本信息</span>
				<a-tooltip placement="top">
					<template slot="title">
						<span v-if="companyInfo.companyModifyLog">
							<span>申请时间：{{ companyInfo.companyModifyLog.optTime }}</span
							><br />
							<span>申请意见：{{ companyInfo.companyModifyLog.auditOpinion }}</span>
						</span>
					</template>
					<span
						class="audit-status-reject"
						v-if="companyInfo.companyModifyLog && companyInfo.companyModifyLog.status === 'EDIT'"
						>变更审核不通过</span
					>
				</a-tooltip>
				<span
					class="audit-status-ing"
					v-if="companyInfo.companyModifyLog && companyInfo.companyModifyLog.status === 'WAIT_AUDIT'"
					>变更审核中</span
				>
			</span>
			<span
				class="button-click"
				v-if="modifyBtn"
				@click="$router.push('/center/account/company/info/certified?type=edit&changeType=NO_CHANGE')"
				>变更企业信息</span
			>
		</div>
		<a-descriptions
			bordered
			class="descriptions-wrap"
		>
			<a-descriptions-item label="企业名称">
				{{ companyInfo.name }}
			</a-descriptions-item>
			<a-descriptions-item label="统一社会信息用代码">
				{{ companyInfo.uscc }}
			</a-descriptions-item>
			<a-descriptions-item label="法定代表人">
				{{ companyInfo.legalPersonName }}
			</a-descriptions-item>
			<a-descriptions-item label="企业简称">
				<span>{{ companyInfo.abbreviation }}</span>
				<em
					v-if="infoEditAuth"
					@click="updateCompanyName('base')"
				>
					<Edit class="info-edit"></Edit>
				</em>
			</a-descriptions-item>
			<a-descriptions-item label="企业简称首字母缩写">
				{{ companyInfo.abbreviationSpell }}
			</a-descriptions-item>
			<a-descriptions-item label="成立日期">
				{{ companyInfo.establishDate || '-' }}
			</a-descriptions-item>
			<a-descriptions-item label="营业期限（止）">
				{{ companyInfo.licenseEndDateIsLongValid == 1 ? '长期有效' : companyInfo.licenceEndDate }}
			</a-descriptions-item>
			<a-descriptions-item label="注册地址"> {{ companyInfo.area }} {{ companyInfo.address }} </a-descriptions-item>
			<a-descriptions-item
				label="注册地址"
				v-if="companyInfo.bizLicenseImg"
			>
				<img
					:src="companyInfo.bizLicenseImg"
					v-if="handleImg(companyInfo.bizLicenseImg)"
					v-viewer
				/>
				<img
					src="@/v2/assets/imgs/common/pdf.png"
					v-else
					@click="handlePreview(companyInfo.bizLicenseImg)"
				/>
			</a-descriptions-item>
		</a-descriptions>
		<div>
			<div class="slTitleAssis margin-top-30px">
				<span>法定代表人信息</span>
				<span
					class="button-click"
					@click="$router.push('/center/account/company/info/certified?type=edit&changeType=NO_CHANGE')"
					v-if="modifyBtn"
					>变更法定代表人</span
				>
			</div>
			<a-descriptions
				bordered
				class="descriptions-wrap"
			>
				<a-descriptions-item label="姓名">
					{{ companyInfo.legalPersonName || '-' }}
				</a-descriptions-item>
				<a-descriptions-item
					label="身份证号"
					v-if="companyInfo.legalPersonCardNo"
				>
					{{ companyInfo.legalPersonCardNo || '-' }}
				</a-descriptions-item>
				<a-descriptions-item
					label="手机号"
					v-if="companyInfo.legalPersonMobile"
				>
					{{ companyInfo.legalPersonMobile || '-' }}
				</a-descriptions-item>
				<a-descriptions-item
					label="身份证有效期"
					v-if="companyInfo.legalPersonCardValidTimeStart"
				>
					<span v-if="!companyInfo.legalPersonCardValidTimeEnd"
						>{{ companyInfo.legalPersonCardValidTimeStart }} ～ 长期有效
					</span>
					<span v-else>{{ companyInfo.legalPersonCardValidTimeStart }} ～ {{ companyInfo.legalPersonCardValidTimeEnd }}</span>
					<em
						v-if="infoEditAuth"
						@click="showUpdateLegalCard"
					>
						<Edit class="info-edit"></Edit>
					</em>
				</a-descriptions-item>
			</a-descriptions>
		</div>
		<div>
			<div class="slTitleAssis margin-top-30px">
				<span>
					<span>企业管理员信息</span>
					<!-- 管理员变更 -->
					<a-tooltip placement="top">
						<template slot="title">
							<span v-if="companyInfo.companyAdminModifyLog">
								<span>申请时间：{{ companyInfo.companyAdminModifyLog.optTime }}</span
								><br />
								<span>申请意见：{{ companyInfo.companyAdminModifyLog.auditOpinion }}</span>
							</span>
						</template>
						<span
							class="audit-status-reject"
							v-if="companyInfo.companyAdminModifyLog && companyInfo.companyAdminModifyLog.status === 'EDIT'"
							>变更审核不通过</span
						>
					</a-tooltip>
					<span
						class="audit-status-ing"
						v-if="companyInfo.companyAdminModifyLog && companyInfo.companyAdminModifyLog.status === 'WAIT_AUDIT'"
						>变更审核中</span
					>
					<!-- 手机号变更 -->
					<a-tooltip placement="top">
						<template slot="title">
							<span v-if="companyInfo.companyAdminMobileModifyLog">
								<span>申请时间：{{ companyInfo.companyAdminMobileModifyLog.optTime }}</span
								><br />
								<span>申请意见：{{ companyInfo.companyAdminMobileModifyLog.auditOpinion }}</span>
							</span>
						</template>
						<span
							class="audit-status-reject"
							v-if="companyInfo.companyAdminMobileModifyLog && companyInfo.companyAdminMobileModifyLog.status === 'EDIT'"
							>手机号修改审核不通过</span
						>
					</a-tooltip>
					<span
						class="audit-status-ing"
						v-if="companyInfo.companyAdminMobileModifyLog && companyInfo.companyAdminMobileModifyLog.status === 'WAIT_AUDIT'"
						>手机号修改审核中</span
					>
					<!-- 授权期限变更 -->
					<a-tooltip placement="top">
						<template slot="title">
							<span v-if="companyInfo.companyAdminAuthValidTimeModifyLog">
								<span>申请时间：{{ companyInfo.companyAdminAuthValidTimeModifyLog.optTime }}</span
								><br />
								<span>申请意见：{{ companyInfo.companyAdminAuthValidTimeModifyLog.auditOpinion }}</span>
							</span>
						</template>
						<span
							class="audit-status-reject"
							v-if="
								companyInfo.companyAdminAuthValidTimeModifyLog && companyInfo.companyAdminAuthValidTimeModifyLog.status === 'EDIT'
							"
							>变更授权期限审核不通过</span
						>
					</a-tooltip>
					<span
						class="audit-status-ing"
						v-if="
							companyInfo.companyAdminAuthValidTimeModifyLog &&
							companyInfo.companyAdminAuthValidTimeModifyLog.status === 'WAIT_AUDIT'
						"
						>变更授权期限审核中</span
					>
				</span>
				<span
					class="button-click"
					v-if="companyModifyStatus !== 'WAIT_AUDIT'"
				>
					<span
						key="user/changeOperator"
						@click="handleMenuClick({ key: 'user/changeOperator' })"
						v-if="adminChangeBtnVisible"
						>变更企业管理员</span
					>
					<span
						style="margin-left: 20px"
						v-if="mobileChangeBtnVisible"
						@click="handleMenuClick({ key: 'user/changeOperatorMobile' })"
						>修改手机号</span
					>
					<span
						style="margin-left: 20px"
						v-if="authValidTimeBtnVisible"
						key="user/ChangeOperatorAuthorizationPeriod"
						@click="handleMenuClick({ key: 'user/ChangeOperatorAuthorizationPeriod' })"
						>变更授权期限</span
					>
				</span>
			</div>
			<a-descriptions
				bordered
				class="descriptions-wrap"
			>
				<a-descriptions-item label="姓名">
					{{ companyInfo.adminName || '-' }}
				</a-descriptions-item>
				<a-descriptions-item label="身份证号">
					{{ companyInfo.adminIdCard || '-' }}
				</a-descriptions-item>
				<a-descriptions-item label="手机号">
					{{ companyInfo.adminMobile || '-' }}
				</a-descriptions-item>
				<a-descriptions-item label="身份证有效期">
					<!-- 历史数据 -->
					<span
						v-if="!companyInfo.adminCardValidTimeStart && !companyInfo.adminCardValidTimeEnd && !companyInfo.adminCardIsLongValid"
						>-</span
					>
					<!-- 开始&&结束 -->
					<span v-if="companyInfo.adminCardValidTimeStart && companyInfo.adminCardValidTimeEnd"
						>{{ companyInfo.adminCardValidTimeStart }} ～ {{ companyInfo.adminCardValidTimeEnd }}</span
					>
					<!-- 长期有效 -->
					<span v-if="companyInfo.adminCardIsLongValid"> {{ companyInfo.adminCardValidTimeStart }} ～ 长期有效</span>
					<em
						v-if="infoEditAuth"
						@click="showUpdateAgentCard"
					>
						<Edit class="info-edit"></Edit>
					</em>
				</a-descriptions-item>
				<a-descriptions-item label="管理员授权期限">
					<span v-if="!companyInfo.adminAuthValidTimeStart && !companyInfo.adminAuthValidTimeEnd"> 长期 </span>
					<span v-if="companyInfo.adminAuthValidTimeStart && companyInfo.adminAuthValidTimeEnd">
						{{ companyInfo.adminAuthValidTimeStart }} ～ {{ companyInfo.adminAuthValidTimeEnd }}
					</span>
				</a-descriptions-item>
			</a-descriptions>
		</div>
		<!-- 修改弹窗 -->
		<a-modal
			class="modal-wrap"
			:title="titleMap[updateType]"
			:visible="visible"
			:width="480"
			@cancel="
				() => {
					visible = false;
				}
			"
			@ok="submitUpdate()"
		>
			<a-form
				:form="updateForm"
				style="padding: 30px 20px"
				class="modal-form"
				formLayout="vertical"
				:colon="false"
			>
				<a-row v-if="updateType == 'base'">
					<a-row>
						<a-col :span="24">
							<a-form-item label="企业简称">
								<a-input
									@blur="getAbbrPinYin"
									:maxLength="20"
									v-decorator="[
										`abbreviation`,
										{
											rules: [
												{
													required: true,
													message: `企业简称必填`,
													type: 'string'
												}
											]
										}
									]"
								>
								</a-input>
							</a-form-item>
						</a-col>
						<a-col
							:span="24"
							style="margin-top: 20px"
						>
							<a-form-item label="企业简称首字母缩写">
								<a-input
									:maxLength="20"
									v-decorator="[
										'abbreviationSpell',
										{
											rules: [
												{ required: true, message: `企业简称首字母缩写必填` },
												{
													pattern: /^[A-Z]+$/,
													message: '企业简称首字母缩写只能输入大写字母'
												}
											],
											validateTrigger: 'blur'
										}
									]"
								>
								</a-input>
							</a-form-item>
						</a-col>
					</a-row>
				</a-row>
			</a-form>
		</a-modal>
		<ValidityPeriodAdminModal
			ref="ValidityPeriodAdminModalRef"
			:companyInfo="companyInfo"
			v-on:update="update"
		/>
		<ValidityPeriodLegalModal
			ref="ValidityPeriodLegalModalRef"
			:companyInfo="companyInfo"
			v-on:update="update"
		/>
	</div>
</template>

<script>
import { getPopupContainer } from '@/v2/utils/factory';
import {
	API_COMPANYMODIFYABBREVIATIONSPELL,
	API_COMPANYAUTHGETABBREVIATIONSPELL,
	API_COMPANYMODIFYABBREVIATIONLEGAL,
	API_COMPANYMODIFYABBREVIATIONAGENT,
	API_ModifyAdminIdCardValidity
} from '@/v2/api/account';
import { mapGetters } from 'vuex';
import ENV from '@/v2/config/env';
import moment from 'moment';
import { cloneDeep } from 'lodash';
import ValidityPeriodAdminModal from './ValidityPeriodAdminModal';
import ValidityPeriodLegalModal from './ValidityPeriodLegalModal';
import { Edit } from '@sub/components/svg';
export default {
	name: 'BaseInfo',
	props: {
		companyInfo: {
			type: Object,
			default: () => {
				return {};
			}
		},
		companyModifyStatus: {
			type: String,
			default: ''
		},
		handleMenuClick: {
			type: Function,
			default: () => {
				return {};
			}
		},
		adminMobileModifyStatus: {
			type: String,
			default: ''
		},
		adminModifyStatus: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			ENV,
			updateType: '',
			titleMap: {
				base: '编辑企业简称',
				legal: '修改法人信息',
				agent: '修改代理人信息'
			},
			abbr: '', // 简称拼音
			updateForm: this.$form.createForm(this), // 修改企业简称
			updateFormAgent: this.$form.createForm(this),
			visible: false,
			popoverVisible: false,
			popoverVisibleAdmin: false
		};
	},
	watch: {},
	components: {
		ValidityPeriodAdminModal,
		ValidityPeriodLegalModal,
		Edit
	},
	created() {},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER',
			VUEX_ST_USERAUTH: 'VUEX_ST_USERAUTH'
		}),
		adminChangeBtnVisible() {
			if (!this.VUEX_ST_USERAUTH.includes('company:adminEdit')) {
				return false;
			}
			return (
				this.adminModifyStatus !== 'WAIT_AUDIT' &&
				this.adminMobileModifyStatus !== 'WAIT_AUDIT' &&
				this.companyInfo?.companyAdminAuthValidTimeModifyLog?.status !== 'WAIT_AUDIT'
			);
		},
		mobileChangeBtnVisible() {
			if (!this.VUEX_ST_USERAUTH.includes('company:managerEdit')) {
				return false;
			}
			if (this.adminModifyStatus === 'WAIT_AUDIT') {
				return false;
			}
			if (this.companyInfo?.companyAdminAuthValidTimeModifyLog?.status === 'WAIT_AUDIT') {
				return false;
			}
			return (
				!this.companyInfo?.companyAdminMobileModifyLog ||
				(this.companyInfo?.companyAdminMobileModifyLog && this.companyInfo?.companyAdminMobileModifyLog?.status !== 'WAIT_AUDIT')
			);
		},
		authValidTimeBtnVisible() {
			if (!this.VUEX_ST_USERAUTH.includes('company:adminAuthTimeEdit')) {
				return false;
			}
			if (this.adminModifyStatus === 'WAIT_AUDIT') {
				return false;
			}
			if (this.adminMobileModifyStatus === 'WAIT_AUDIT') {
				return false;
			}
			return (
				!this.companyInfo?.companyAdminAuthValidTimeModifyLog ||
				(this.companyInfo?.companyAdminAuthValidTimeModifyLog &&
					this.companyInfo?.companyAdminAuthValidTimeModifyLog?.status !== 'WAIT_AUDIT')
			);
		},
		modifyBtn() {
			if (!this.VUEX_ST_USERAUTH.includes('company:infoEdit')) {
				return false;
			}
			return (
				!this.companyInfo.companyModifyLog ||
				(this.companyInfo.companyModifyLog && this.companyInfo.companyModifyLog.status !== 'WAIT_AUDIT')
			);
		},
		infoEditAuth() {
			if (!this.VUEX_ST_USERAUTH.includes('company:infoEdit')) {
				return false;
			}
			return true;
		}
	},
	methods: {
		getPopupContainer,
		showUpdateAgentCard() {
			this.$refs.ValidityPeriodAdminModalRef.showModal(this.companyInfo);
		},
		showUpdateLegalCard() {
			this.$refs.ValidityPeriodLegalModalRef.showModal(this.companyInfo);
		},
		disabledDate(current) {
			return current && current > moment().endOf('day');
		},
		handleImg(v) {
			if (v.indexOf('.pdf') != -1) {
				return false;
			}
			return true;
		},
		handlePreview(v) {
			window.open(v, '_blank');
		},
		getAbbrPinYin(e) {
			//根据企业简称获取简称拼音
			let value = e.target.value;
			if (!value) {
				return;
			}
			API_COMPANYAUTHGETABBREVIATIONSPELL({ abbreviation: value }).then(res => {
				if (res.success) {
					this.updateForm.setFieldsValue({
						abbreviationSpell: res.data
					});
				}
			});
		},
		updateCompanyName(type) {
			this.visible = true;
			this.updateType = type;
			this.$nextTick(() => {
				if (type == 'base') {
					this.updateForm.setFieldsValue({
						abbreviation: this.companyInfo.abbreviation,
						abbreviationSpell: this.companyInfo.abbreviationSpell
					});
				}
			});
		},
		onChangeLegalPersonCardIsLongValid() {
			this.updateForm.resetFields(['legalPersonCardValidTimeEnd']);
		},
		update() {
			this.$emit('update');
		},
		updateLegalCard() {
			this.updateForm.validateFields((err, values) => {
				if (!err) {
					const cloneValues = cloneDeep(values);
					cloneValues.legalPersonCardValidTimeStart = cloneValues.legalPersonCardValidTimeStart
						? moment(cloneValues.legalPersonCardValidTimeStart).format('YYYY-MM-DD')
						: null;
					cloneValues.legalPersonCardValidTimeEnd = values.legalPersonCardValidTimeEnd
						? moment(values.legalPersonCardValidTimeEnd).format('YYYY-MM-DD')
						: null;
					API_COMPANYMODIFYABBREVIATIONLEGAL({
						companyId: this.VUEX_ST_COMPANYSUER.companyId,
						legalPersonMobile: this.companyInfo.legalPersonMobile,
						...cloneValues
					}).then(res => {
						if (res.success) {
							this.visible = false;
							this.$message.success('修改成功！');
							this.popoverVisible = false;
							this.$emit('update', true);
						}
					});
				}
			});
		},
		updateAgentCard() {
			this.updateFormAgent.validateFields((err, values) => {
				if (!err) {
					const cloneValues = cloneDeep(values);
					cloneValues.cardValidTimeStart = values.adminCardValidTimeStart
						? moment(values.adminCardValidTimeStart).format('YYYY-MM-DD')
						: null;
					cloneValues.cardValidTimeEnd = values.adminCardValidTimeEnd
						? moment(values.adminCardValidTimeEnd).format('YYYY-MM-DD')
						: null;
					cloneValues.cardIsLongValid = values.adminCardIsLongValid;
					delete cloneValues.adminCardIsLongValid;
					delete cloneValues.adminCardValidTimeStart;
					delete cloneValues.adminCardValidTimeEnd;
					API_ModifyAdminIdCardValidity({
						companyId: this.VUEX_ST_COMPANYSUER.companyId,
						agentPersonMobile: this.companyInfo.agentPersonMobile,
						...cloneValues
					}).then(res => {
						if (res.success) {
							this.visible = false;
							this.popoverVisibleAdmin = false;
							this.$message.success('修改成功！');
							this.$emit('update', true);
						}
					});
				}
			});
		},
		submitUpdate() {
			this.updateForm.validateFields((err, values) => {
				if (!err) {
					if (this.updateType == 'agent') {
						if (values.agentPersonCardValidTimeEnd && values.agentPersonCardValidTimeStart) {
							if (moment(values.agentPersonCardValidTimeEnd).isSameOrBefore(values.agentPersonCardValidTimeStart, 'day')) {
								this.$message.error('代理人身份信息日期不合法');
								return;
							}
						}
						API_COMPANYMODIFYABBREVIATIONAGENT({
							companyId: this.VUEX_ST_COMPANYSUER.companyId,
							...values,
							agentPersonCardValidTimeStart: values.agentPersonCardValidTimeStart
								? moment(values.agentPersonCardValidTimeStart).format('YYYY-MM-DD')
								: null,
							agentPersonCardValidTimeEnd: values.agentPersonCardValidTimeEnd
								? moment(values.agentPersonCardValidTimeEnd).format('YYYY-MM-DD')
								: null
						}).then(res => {
							if (res.success) {
								this.visible = false;
								this.$message.success('修改成功！');
								this.companyInfo.agentPersonCardValidTimeStart = moment(values.agentPersonCardValidTimeStart).format(
									'YYYY-MM-DD'
								);
								this.companyInfo.agentPersonCardValidTimeEnd =
									values.adminCardIsLongValid == true ? null : moment(values.agentPersonCardValidTimeEnd).format('YYYY-MM-DD');
								this.companyInfo.adminCardIsLongValid = values.adminCardIsLongValid;
								this.companyInfo.agentPersonMobile = values.agentPersonMobile;
							}
						});
					}

					if (this.updateType == 'base') {
						API_COMPANYMODIFYABBREVIATIONSPELL({
							companyId: this.VUEX_ST_COMPANYSUER.companyId,
							...values
						}).then(res => {
							if (res.success) {
								this.visible = false;
								this.$message.success('修改成功！');
								this.companyInfo.abbreviationSpell = values.abbreviationSpell;
								this.companyInfo.abbreviation = values.abbreviation;
							}
						});
					}
				}
			});
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/modal.less');
@import url('~@/v2/style/modal-form.less');
@import url('~@/v2/style/popover-reset.less');
</style>
<style lang="less">
@import url('~@/v2/style/popover-reset.less');
</style>
<style lang="less" scoped>
.edit-btn {
	margin-bottom: 15px;
	margin-left: 20px;
}
p {
	color: #383a3f;
	line-height: 32px;
	padding-bottom: 10px;
	font-weight: 600;
}
.row {
	padding-bottom: 22px;
}
.flex-box {
	display: flex;
	> div {
		padding-right: 10px;
		color: #6b6f76;
		line-height: 18px;
	}
	.name {
		width: 150px;
	}
	.value {
		flex: 1;
		color: #383a3f;
	}
}
.row.abbr {
	div {
		line-height: 24px;
	}
	::v-deep.ant-btn {
		margin-left: 20px;
		height: 24px;
		line-height: 24px;
		span {
			position: relative;
			top: -1px;
		}
	}
}
.license {
	width: 135px;
	cursor: pointer;
	img {
		width: 100%;
		height: 172px;
		margin-bottom: 12px;
	}
	span {
		display: block;
		width: 100%;
		text-align: center;
		color: #383a3f;
		text-align: center;
		line-height: 18px;
	}
}
.slTitleAssis {
	margin-top: 0;
}
.info-edit {
	width: 14px;
	height: 14px;
	display: inline-block;
	background-size: contain;
	margin-left: 12px;
	position: relative;
	top: 2px;
	cursor: pointer;
}
.margin-top-30px {
	margin-top: 30px;
}
.slTitleAssis {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
}
.button-click {
	color: @primary-color;
	font-size: 14px;
	font-weight: 400;
	cursor: pointer;
	font-family: PingFang SC;
}
.a-popconfirm-form {
	/deep/.ant-form-item {
		// height: 32px;
		margin-bottom: 0;
	}
	.btn {
		width: 52px;
		height: 24px;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		font-size: 14px;
	}
	.btn:nth-child(2) {
		margin-left: 20px;
	}
}
.audit-status-ing {
	min-width: 48px;
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
/deep/ .descriptions-wrap {
	.ant-descriptions-item-label {
		width: 180px;
		display: inline-block;
	}
	.ant-descriptions-item-content {
		min-width: 210px;
	}
}
</style>
