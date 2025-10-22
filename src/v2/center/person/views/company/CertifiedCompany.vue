<template>
	<a-card
		class="wrapper"
		:title="title"
		:bordered="false"
		style="margin: -20px; margin-top: -10px"
	>
		<StepList
			:activeIndex="activeIndex"
			:stepList="stepList"
		/>
		<div
			class="tips-warn-wrap"
			v-if="activeIndex === 0 && $route.query.type === 'edit'"
		>
			{{ tipsEnum[companyChangeType] }}
		</div>
		<div v-if="activeIndex === 0">
			<BaseInfoForm
				ref="BaseInfoForm"
				v-on:onValuesBaseInfoChange="onValuesBaseInfoChange"
				v-on:updateCompanyInfo="updateCompanyInfo"
				:companyChangeType="companyChangeType"
				:fileListbizLicenseImg="fileListbizLicenseImg"
			/>
			<AgentPersonForm
				ref="AgentPersonForm"
				v-if="
					['agentPerson', false, undefined, null].includes(baseInfoFormValues.agentIsLegalPerson) && $route.query.type !== 'edit'
				"
				:companyType="companyInfo.companyType"
				:companyChangeType="companyChangeType"
				:baseInfoFormValues="baseInfoFormValues"
				v-on:onValuesAgentInfoChange="onValuesAgentInfoChange"
				:fileListagentIdCardImg="
					companyInfo.agentPersonCardImg
						? [
								{
									name: ' ',
									url: companyInfo.agentPersonCardImg
								}
						  ]
						: []
				"
			/>
			<LegalPersonForm
				ref="LegalPersonForm"
				:companyType="companyInfo.companyType"
				:companyChangeType="companyChangeType"
				:baseInfoFormValues="baseInfoFormValues"
				v-on:onValuesLegalInfoChange="onValuesLegalInfoChange"
				:fileListlegalPersonCardImg="fileListlegalPersonCardImg()"
				v-on:submit="submitNoValidate(0)"
			/>
			<OtherModifyFormFile
				ref="OtherModifyFormFile"
				v-if="$route.query.type === 'edit'"
				:downloadTemplate="downloadTemplate"
			/>
			<OtherFormFile
				v-else
				ref="OtherFormFile"
				:baseInfoFormValues="baseInfoFormValues"
				:agentInfoFormValues="agentInfoFormValues"
				:legalInfoFormValues="legalInfoFormValues"
				:fileListauthLicenseImg="
					companyInfo.authLicenseImg
						? [
								{
									name: ' ',
									url: companyInfo.authLicenseImg
								}
						  ]
						: []
				"
				:fileListauthWayLicenseImg="
					companyInfo.franchiseLicenseImg
						? [
								{
									name: ' ',
									url: companyInfo.franchiseLicenseImg
								}
						  ]
						: []
				"
			/>
			<a-row
				class="footer"
				type="flex"
				justify="center"
				align="middle"
			>
				<a-button
					type="primary"
					@click="submitForm(1)"
					:loading="loading"
					>提交</a-button
				>
			</a-row>
		</div>
		<div v-if="activeIndex === 1">
			<SubmitSuccess />
		</div>
	</a-card>
</template>

<script>
import {
	API_COMPANYMODIFYDOWNLOADCOMPANYINFOMODIFYTEMPLATE,
	API_COMPANYMODIFYAPPLY,
	API_COMPANYAUTHAPPLY,
	API_GetCompanyInfoChangeType,
	API_GetCompanyInfoByChangeType,
	API_USERCENTERGETAPPLYCOMPANYAUTH
} from '@/v2/api/account';
import moment from 'moment';
import { down } from '@/v2/utils/factory';
import { mapGetters } from 'vuex';
import StepList from './components/StepList';
import BaseInfoForm from './components/BaseInfoForm';
import LegalPersonForm from './components/LegalPersonForm';
import AgentPersonForm from './components/AgentPersonForm';
import OtherFormFile from './components/OtherFormFile';
import OtherModifyFormFile from './components/OtherModifyFormFile';
import SubmitSuccess from './components/SubmitSuccess';

export default {
	data() {
		return {
			baseInfoFormValues: {},
			activeIndex: 0,
			companyInfo: {},
			loading: false,
			companyChangeType: null,
			tipsEnum: {
				COMPANY_NAME_AND_LEGAL_PERSON_CHANGE:
					'系统检测到您的企业名称、法定代表人发生变更：请您重新上传营业执照复印件（加盖公章）、法定代表人身份证复印件（加盖公章）、工商变更证明（加盖公章）、企业信息变更申请表（加盖公章）',
				LEGAL_PERSON_CHANGE:
					'系统检测到您的法定代表人发生变更：请您重新上传营业执照复印件（加盖公章）、法定代表人身份证复印件（加盖公章）、工商变更证明（加盖公章）、企业信息变更申请表（加盖公章）',
				COMPANY_NAME_CHANGE:
					'系统检测到您的企业名称发生变更：请您重新上传营业执照复印件（加盖公章）、工商变更证明（加盖公章）、企业信息变更申请表（加盖公章）',
				NO_CHANGE: '系统检未检测到您的企业名称、法定代表人发生变更，请确认是否进行变更'
			},
			agentInfoFormValues: {},
			legalInfoFormValues: {},
			hasAuthInfo: false
		};
	},
	components: {
		StepList,
		BaseInfoForm,
		LegalPersonForm,
		AgentPersonForm,
		OtherFormFile,
		SubmitSuccess,
		OtherModifyFormFile
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_PERSONALLINFO: 'VUEX_ST_PERSONALLINFO',
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		isComponents() {
			if (this.$route.query.type === 'edit') {
				return ['LegalPersonForm'];
			}
			if (Object.keys(this.baseInfoFormValues).length === 0) {
				return ['LegalPersonForm', 'AgentPersonForm'];
			}
			if (['legalPerson', true, undefined, null].includes(this.baseInfoFormValues.agentIsLegalPerson)) {
				return ['LegalPersonForm'];
			}
			return ['LegalPersonForm', 'AgentPersonForm'];
		},
		title() {
			if (this.$route.query.type === 'edit') {
				return '变更企业信息';
			}
			return '企业认证';
		},
		stepList() {
			if (this.$route.query.type === 'edit') {
				return [
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
				];
			}
			return [
				{
					id: 1,
					title: '基本信息'
				},
				{
					id: 2,
					title: '系统审核'
				},
				{
					id: 3,
					title: '认证完成'
				}
			];
		},
		fileListbizLicenseImg() {
			if (this.$route.query.type === 'edit') {
				return [];
			}
			return this.companyInfo.usccImg
				? [
						{
							name: ' ',
							url: this.companyInfo.usccImg
						}
					]
				: [];
		}
	},
	mounted() {
		this.getCompanyAuthDetail();
		if (this.$route.query.type === 'edit') {
			this.getCompanyChangeType();
		}
	},
	methods: {
		fileListlegalPersonCardImg() {
			if (this.$route.query.type === 'edit' && this.$route.query.changeType === 'NO_CHANGE') {
				return [];
			}
			return this.companyInfo.legalPersonCardImg
				? [
						{
							name: ' ',
							url: this.companyInfo.legalPersonCardImg
						}
					]
				: [];
		},
		updateCompanyInfo(data) {
			if (['COMPANY_NAME_AND_LEGAL_PERSON_CHANGE', 'NO_CHANGE'].includes(this.companyChangeType)) {
				this.$refs.LegalPersonForm.initFieldsValue({
					...data,
					legalPersonName: data.operName
				});
			}
		},
		// 查询认证记录信息
		async getCompanyAuthDetail() {
			try {
				const { data } = await API_USERCENTERGETAPPLYCOMPANYAUTH();
				if (data) {
					this.companyInfo = data;
					this.hasAuthInfo = true;
					if (this.$refs.BaseInfoForm) {
						this.$refs.BaseInfoForm.initFieldsValue({
							...data,
							area: data.area && data.area.split('/'),
							agentIsLegalPerson: data.agentPersonCardNo ? false : true,
							bizLicenseNo: data.uscc
						});
					}
					if (this.$refs.AgentPersonForm) {
						this.$refs.AgentPersonForm.initFieldsValue({
							...data
						});
					}
					if (this.$refs.LegalPersonForm) {
						this.$refs.LegalPersonForm.initFieldsValue({
							...data
						});
					}
					if (this.$refs.OtherFormFile) {
						this.$refs.OtherFormFile.initFieldsValue({
							...data
						});
					}
				}
			} catch (err) {
				console.info('获取认证信息失败');
			}
		},
		async getCompanyChangeType() {
			const result = await API_GetCompanyInfoChangeType();
			if (result.success) {
				this.companyChangeType = result?.data || 'NO_CHANGE';
				this.getCompanyDetail(result.data || null);
			}
		},
		// 企业模版变更模版
		async downloadTemplate() {
			const formList = this.generateFormPromise(0);
			const result = await Promise.all(formList);
			let values = {};
			result.forEach(item => {
				values = { ...values, ...item };
			});
			const newObj = {
				authCompanyType: this.$route.query.type,
				...values,
				name: values.name,
				uscc: values.bizLicenseNo,
				legalPersonName: values.legalPersonName,
				legalPersonCardNo: values.legalPersonCardNo,
				area: values.area?.join('/'),
				address: values.address,
				legalPersonMobile: values.legalPersonMobile,
				legalPersonCardValidTimeEnd: values.legalPersonCardValidTimeEnd ? moment(values.legalPersonCardValidTimeEnd).format('YYYY-MM-DD') : null,
				legalPersonCardValidTimeStart: moment(values.legalPersonCardValidTimeStart).format('YYYY-MM-DD'),
				legalPersonCardIsLongValid: values.legalPersonCardIsLongValid,
				abbreviation: values.abbreviation,
				abbreviationSpell: values.abbrPinYin
			};
			const hide = this.$message.loading('下载中...');
			API_COMPANYMODIFYDOWNLOADCOMPANYINFOMODIFYTEMPLATE(newObj).then(res => {
				down(`data:application/pdf;base64,${res}`, '企业信息变更申请表.pdf');
			});
			hide();
		},
		async getCompanyDetail(type = this.companyChangeType) {
			const { data } = await API_GetCompanyInfoByChangeType({
				changeType: type
			});
			this.companyInfo = data;
			this.$nextTick(() => {
				this.$refs.BaseInfoForm.initFieldsValue({
					...data,
					bizLicenseNo: data.uscc,
					area: data.area && data.area.split('/'),
					agentIsLegalPerson: data.agentPersonCardNo ? false : true,
					nameOld: data.companyName,
					name: ['LEGAL_PERSON_CHANGE'].includes(type) ? data.companyName : null,
					abbreviation: ['COMPANY_NAME_CHANGE', 'COMPANY_NAME_AND_LEGAL_PERSON_CHANGE', null].includes(type)
						? null
						: data.abbreviation,
					abbreviationSpell: ['COMPANY_NAME_CHANGE', 'COMPANY_NAME_AND_LEGAL_PERSON_CHANGE', null].includes(type)
						? null
						: data.abbreviationSpell,
						usccImg: null
				});
				if (this.$refs.AgentPersonForm) {
					this.$refs.AgentPersonForm.initFieldsValue({
						...data,
						legalPersonCardImg: ['COMPANY_NAME_CHANGE'].includes(type) ? data.legalPersonCardImg : null
					});
				}
				if (this.$refs.LegalPersonForm) {
					this.$refs.LegalPersonForm.initFieldsValue({
						...data,
						legalPersonNameOld: data.legalPersonName,
						legalPersonName: ['COMPANY_NAME_CHANGE'].includes(type)
							? data.legalPersonName
							: null,
						legalPersonCardValidTimeStart: ['COMPANY_NAME_CHANGE', 'COMPANY_NAME_AND_LEGAL_PERSON_CHANGE'].includes(type)
							? null
							: data.legalPersonCardValidTimeStart,
						legalPersonCardValidTimeEnd: ['COMPANY_NAME_CHANGE', 'COMPANY_NAME_AND_LEGAL_PERSON_CHANGE'].includes(type)
							? null
							: data.legalPersonCardValidTimeEnd
					});
				}
			});
		},
		onValuesBaseInfoChange(values) {
			const { name, mobile, idCardNotDesensitize } = this.VUEX_ST_PERSONALLINFO;
			this.$nextTick(() => {
				if (values.agentIsLegalPerson === this.baseInfoFormValues.agentIsLegalPerson) {
					return;
				}
				this.baseInfoFormValues = {
					...this.baseInfoFormValues,
					...values
				};
				// 申请方式变更
				this.$nextTick(() => {
					if (!values.agentIsLegalPerson) {
						this.$refs.AgentPersonForm.resetFormValues();
						// this.companyInfo.agentPersonCardImg = '';
						this.$refs.AgentPersonForm.initFieldsValue({
							...this.companyInfo,
							agentPersonName: name,
							agentPersonCardNo: idCardNotDesensitize,
							agentPersonMobile: mobile
						});
					} else {
						this.$refs.LegalPersonForm.resetFormValues();
						// this.companyInfo.legalPersonCardImg = '';
						this.$refs.LegalPersonForm.initFieldsValue({
							...this.companyInfo,
							legalPersonName: name,
							legalPersonCardNo: idCardNotDesensitize,
							legalPersonMobile: mobile
						});
					}
				});
			});
		},
		onValuesAgentInfoChange(values) {
			this.$nextTick(() => {
				this.agentInfoFormValues = {
					...this.baseInfoFormValues,
					...values
				};
			});
		},
		onValuesLegalInfoChange(values) {
			this.$nextTick(() => {
				this.legalInfoFormValues = {
					...this.legalInfoFormValues,
					...values
				};
			});
		},
		generateFormPromise(type, validator) {
			const validatorAll = [this.$refs.BaseInfoForm.submit(validator)];
			this.isComponents.forEach(item => {
				validatorAll.push(this.$refs[item].submit(validator));
			});
			if (this.$refs.OtherModifyFormFile && type === 1) {
				validatorAll.push(this.$refs.OtherModifyFormFile.submit(validator));
			}
			if (this.$refs.OtherFormFile) {
				validatorAll.push(this.$refs.OtherFormFile.submit(validator));
			}
			return validatorAll;
		},
		submitNoValidate(type) {
			this.submitForm(type);
		},
		async submitForm(type) {
			try {
				const result = await Promise.all(this.generateFormPromise(1, type));
				let values = {};
				result.forEach(item => {
					values = { ...values, ...item };
				});
				const params = {
					...values,
					adminAuthValidTimeStart: moment(values.adminAuthValidTimeStart).format('YYYY-MM-DD'),
					authCompanyType: this.$route.query.type,
					uscc: values.bizLicenseNo,
					area: values.area?.join('/'),
					usccImage: values.usccImg
				};
				if (values.legalRepresentative && values.legalPersonName?.trim() !== values.legalRepresentative?.trim()) {
					this.$message.warning('法定代表人信息不一致');
					return;
				}
				params.changeType = 3;
				if (this.$route.query.type === 'edit') {
					if (type && ['NO_CHANGE', 'LEGAL_PERSON_CHANGE', 'COMPANY_NAME_AND_LEGAL_PERSON_CHANGE'].includes(this.$route.query.changeType)) {
						await this.$refs.LegalPersonForm.submitThreeElements();
					}
				} else {
					if (this.$refs.AgentPersonForm && type && !['TERMINAL', 'COAL_MINE', 'SUPERVISING'].includes(this.$route.query.type)) {
						await this.$refs.LegalPersonForm.submitThreeElements();
					}
				}
				this.loading = true;
				const API = this.$route.query.type === 'edit' ? API_COMPANYMODIFYAPPLY : API_COMPANYAUTHAPPLY;
				API(params)
					.then(res => {
						if (res.success) {
							this.$message.success('提交成功');
							this.activeIndex += 1;
						}
					})
					.finally(() => {
						this.loading = false;
					});
			} catch (error) {
				throw new Error(error);
			}
		}
	}
};
</script>

<style lang="less" scoped>
@import url('~@/v2/style/tips-wrap.less');
</style>
<style lang="less" scoped>
.wrapper {
	padding-bottom: 64px;
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

.tips-warn-wrap {
	margin-top: 20px;
}
</style>