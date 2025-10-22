<template>
	<a-card
		class="wrapper"
		title="变更管理员授权期限"
		:bordered="false"
		style="margin: -20px; margin-top: -10px"
	>
		<StepList
			:activeIndex="activeIndex"
			:stepList="stepList"
		/>
		<template v-if="activeIndex === 0">
			<div class="tips-info-wrap">
				<p>管理员授权有效期时限为三年，请上传授权委托书（加盖公章）</p>
				<p>系统将根据您录入的管理员授权期限自动生成管理员变更申请书，请确保盖章附件与系统录入的期限一致</p>
			</div>
			<div class="slMain">
				<div class="slTitleAssis">管理员信息</div>
				<div class="form-wrap">
					<a-form
						:form="form"
						formLayout="vertical"
						:colon="false"
					>
						<a-row type="flex">
							<a-col span="8">
								<a-row
									type="flex"
									justify="start"
								>
									<a-form-item label="管理员姓名">
										<a-input
											class="form-item-wrap"
											v-decorator="['name', { rules: [{ required: true }] }]"
											disabled
										/>
									</a-form-item>
								</a-row>
							</a-col>
							<a-col span="8">
								<a-row
									type="flex"
									justify="center"
								>
									<a-form-item label="管理员身份证号">
										<a-input
											class="form-item-wrap"
											v-decorator="['idCard', { rules: [{ required: true }] }]"
											disabled
										/>
									</a-form-item>
								</a-row>
							</a-col>
							<a-col span="8">
								<a-row
									type="flex"
									justify="end"
								>
									<a-form-item label="管理员手机号">
										<a-input
											class="form-item-wrap"
											v-decorator="['mobile', { rules: [{ required: true }] }]"
											disabled
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
											原管理员授权期限
										</span>
										<a-input
											v-if="!companyInfo.adminAuthValidTimeStart"
											class="form-item-wrap"
											v-decorator="['adminAuthValidTimeOld', { rules: [{ required: true }] }]"
											disabled
										/>
										<a-range-picker
											v-else
											style="width: 364px"
											disabled
											v-decorator="[
												`adminAuthValidTimeOld`,
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
							<a-col span="8">
								<a-row
									type="flex"
									justify="center"
								>
									<a-form-item>
										<span
											slot="label"
											class="diy-label-wrap"
										>
											新管理员授权期限（起）&nbsp;
											<a-tooltip title="企业管理员授权期限默认3年，到期后需要进行续期">
												<span class="tips-icon"></span>
											</a-tooltip>
										</span>
										<a-date-picker
											style="width: 364px"
											:allowClear="false"
											v-decorator="[
												`adminAuthValidTimeStartNew`,
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
									justify="end"
								>
									<a-form-item>
										<span
											slot="label"
											class="diy-label-wrap"
										>
											新管理员授权期限（止）
										</span>
										<a-date-picker
											style="width: 364px"
											:disabled="true"
											:allowClear="false"
											v-decorator="[
												`adminAuthValidTimeEndNew`,
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
							<a-col
								span="8"
								style="display: none"
							>
								<a-row
									type="flex"
									justify="end"
								>
									<a-form-item>
										<span
											slot="label"
											class="diy-label-wrap"
										>
											授权期限(止)&nbsp;
											<a-tooltip title="企业管理员授权期限默认3年，到期后需要进行续期">
												<span class="tips-icon"></span>
											</a-tooltip>
										</span>
										<a-date-picker
											style="width: 364px"
											v-decorator="[
												`adminAuthValidTimeEndNew`,
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
				<AuthorizeFormFile
					ref="AuthorizeFormFile"
					:formValues="form.getFieldsValue()"
				/>
			</div>
			<a-row
				class="footer"
				type="flex"
				justify="center"
				align="middle"
			>
				<a-button
					type="primary"
					@click="submitAll"
					:loading="loading"
					>提交</a-button
				>
			</a-row>
		</template>
		<template v-if="activeIndex == 1">
			<SubmitSuccess title="管理员授权期限审核已提交" />
		</template>
	</a-card>
</template>

<script>
import { mapGetters } from 'vuex';
import { API_GetAdminUserDetail, API_GetAdminModifyValidity } from '@/v2/api/account';
import { API_COMPANYDETAIL } from '@/v2/api/account';
import StepList from './components/StepList';
import AuthorizeFormFile from './components/AuthorizeFormFile';
import SubmitSuccess from './components/SubmitSuccess';
import moment from 'moment';
import { cloneDeep } from 'lodash';

export default {
	data() {
		return {
			activeIndex: 0,
			operatorList: [],
			form: this.$form.createForm(this, { name: 'ChangeOperator' }),
			emptyVisible: false,
			hasChangeOperatorSelectName: false,
			model: {},
			curAdmin: {},
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
			companyInfo: {},
			loading: false,
			companyDetail: {}
		};
	},
	components: {
		StepList,
		AuthorizeFormFile,
		SubmitSuccess
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		})
	},
	mounted() {
		this.getCompanyDetail();
		this.getRecentCompanyDetail();
	},
	watch: {
		companyInfo: {
			handler(val) {
				if (val.adminAuthValidTimeStart) {
					this.form.setFieldsValue({
						...val,
						adminAuthValidTimeOld: [moment(val.adminAuthValidTimeStart), moment(val.adminAuthValidTimeEnd)],
						adminAuthValidTime: undefined
					});
				} else {
					this.form.setFieldsValue({
						...val,
						adminAuthValidTimeOld: '长期有效',
						adminAuthValidTime: undefined
					});
				}
			},
			deep: true,
			immediate: true
		}
	},
	methods: {
		async getRecentCompanyDetail() {
			const { data } = await API_COMPANYDETAIL();
			this.companyDetail = data;
		},
		onChangeAdminAuthValidTimeStart(e) {
			const adminAuthValidTimeStart = e.format('YYYY-MM-DD');
			this.form.setFieldsValue({
				adminAuthValidTimeEndNew: moment(adminAuthValidTimeStart).add(3, 'years').format('YYYY-MM-DD')
			});
		},
		async getCompanyDetail() {
			const { data } = await API_GetAdminUserDetail();
			this.companyInfo = data;
		},
		submitAll() {
			this.$refs.AuthorizeFormFile.submit();
			this.form.validateFieldsAndScroll(async (err, values) => {
				// 替换文件地址
				if (!err) {
					const filePath = await this.$refs.AuthorizeFormFile.submit();
					const cloneValue = cloneDeep(values);
					cloneValue.adminAuthValidTimeStart = cloneValue.adminAuthValidTimeStartNew ? moment(cloneValue.adminAuthValidTimeStartNew).format('YYYY-MM-DD') : null;
					cloneValue.adminAuthValidTimeEnd = cloneValue.adminAuthValidTimeEndNew ? moment(cloneValue.adminAuthValidTimeEndNew).format('YYYY-MM-DD') : null;
					this.loading = true;
					API_GetAdminModifyValidity({
						id: this.companyDetail?.companyAdminAuthValidTimeModifyLog?.id,
						...cloneValue,
						...filePath
					})
						.then(res => {
							if (res.success) {
								this.$message.success('提交成功');
								this.activeIndex++;
							}
						})
						.finally(() => {
							this.loading = false;
						});
				}
			});
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
.tips-info-wrap {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	padding-top: 10px;
	padding-bottom: 10px;
	margin-top: 30px;
}
.slMain {
	background: #fff;
	margin-top: 30px;
	padding: 0 30px;
	box-sizing: border-box;
}
.form-wrap {
	margin-top: 20px;
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