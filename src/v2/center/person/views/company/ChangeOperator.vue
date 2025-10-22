<template>
	<a-card
		class="wrapper"
		title="变更企业管理员"
		:bordered="false"
		style="margin: -20px; margin-top: -10px"
	>
		<StepList
			:activeIndex="activeIndex"
			:stepList="stepList"
		/>
		<template v-if="activeIndex == 0">
			<div class="tips-info-wrap">
				<p>
					新管理员需加入企业并完成个人实名认证，变更新管理员授权有效期时限为三年，请上传管理员变更申请书(需加盖公章)、新管理员身份证(需加盖公章)
				</p>
				<p>系统将根据您录入的管理员授权期限自动生成管理员变更申请书，请确保盖章附件与系统录入的期限一致</p>
			</div>
			<div class="slMain">
				<div class="slTitleAssis">管理员信息</div>
				<div class="form-wrap">
					<a-form
						:form="changeOperatorForm"
						formLayout="vertical"
						:colon="false"
					>
						<a-row type="flex">
							<a-col span="8">
								<a-form-item label="新管理员">
									<a-select
										class="form-item-wrap"
										showSearch
										:notFoundContent="operatorList ? '' : '加载中...'"
										:filterOption="false"
										:defaultActiveFirstOption="false"
										placeholder="请选择新管理员账号"
										labelInValue
										@dropdownVisibleChange="operatorJudge"
										v-decorator="[
											'newAdminIds',
											{
												rules: [{ required: true, message: `新管理员账号必填` }, { validator: identityCheck }]
											}
										]"
									>
										<a-select-option
											@click="operatorChange(items)"
											v-for="(items, index) in operatorList"
											:key="index"
											:value="items.id"
											>{{ items.personalUserName }}</a-select-option
										>
									</a-select>
								</a-form-item>
							</a-col>
							<a-col span="8" style="display: none">
								<a-row
									type="flex"
									justify="center"
								>
									<a-form-item label="姓名">
										<a-input
											class="form-item-wrap"
											v-decorator="[
												'adminName',
												{
													rules: [{ required: true, message: `` }]
												}
											]"
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
									<a-form-item label="手机号">
										<a-input
											class="form-item-wrap"
											v-decorator="[
												'adminMobile',
												{
													rules: [{ required: true, message: `` }]
												}
											]"
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
									<a-form-item label="身份证号">
										<a-input
											class="form-item-wrap"
											v-decorator="[
												'idcard',
												{
													rules: [{ required: true, message: `` }]
												}
											]"
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
											授权期限（起）&nbsp;
											<a-tooltip title="企业管理员授权期限默认3年，到期后需要进行续期">
												<span class="tips-icon"></span>
											</a-tooltip>
										</span>
										<a-date-picker
											style="width: 364px"
											@change="onChangeAdminAuthValidTimeStart"
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
											授权期限（止）
										</span>
										<a-date-picker
											style="width: 364px"
											:disabled="true"
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
				<OperatorFormFile
					ref="OperatorFormFile"
					:formValues="formValues"
				/>
			</div>
		</template>
		<template v-if="activeIndex == 1">
			<SubmitSuccess title="变更企业管理员审核已提交" />
		</template>
		<a-row
			class="footer"
			type="flex"
			justify="center"
			align="middle"
			v-if="activeIndex === 0"
		>
			<a-button
				type="primary"
				@click="submitAll"
				:loading="loading"
				>提交</a-button
			>
		</a-row>
		<a-modal
			class="modal-wrap"
			title="提示"
			:visible="emptyVisible"
			@ok="emptyGo"
			@cancel="emptyVisible = false"
		>
			<p style="padding: 30px 20px">当前企业仅有一位员工，请前往【企业账号管理】处添加员工</p>
		</a-modal>
	</a-card>
</template>

<script>
import {
	API_COMPANYADMINMODIFYTOMODIFY,
	API_COMPANYADMINMODIFYMODIFYADMINUSER,
	API_GetAdminModifyLastEditDetail,
	API_idCardAuth3Meta,
	API_GetAdminUserDetail
} from '@/v2/api/account';
import { mapGetters } from 'vuex';
import moment from 'moment';
import StepList from './components/StepList';
import OperatorFormFile from './components/OperatorFormFile';
import SubmitSuccess from './components/SubmitSuccess';

export default {
	data() {
		return {
			activeIndex: 0,
			operatorList: [],
			changeOperatorForm: this.$form.createForm(this, { name: 'ChangeOperator', onValuesChange: this.onValuesChange }),
			emptyVisible: false,
			hasChangeOperatorSelectName: false,
			model: {},
			curAdmin: {},
			loading: false,
			formValues: {},
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
			]
		};
	},
	components: {
		StepList,
		OperatorFormFile,
		SubmitSuccess
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		})
	},
	mounted() {
		this.getOperatorList();
		// this.initData();
	},
	methods: {
		onChangeAdminAuthValidTimeStart(e) {
			const adminAuthValidTimeStart = e.format('YYYY-MM-DD');
			this.changeOperatorForm.setFieldsValue({
				adminAuthValidTimeEnd: moment(adminAuthValidTimeStart).add(3, 'years').format('YYYY-MM-DD')
			});
		},
		onValuesChange(props, values) {
			this.formValues = {
				...this.formValues,
				...values
			};
		},
		async initData() {
			const result = await API_GetAdminUserDetail();
			if (result.success) {
				this.changeOperatorForm.setFieldsValue({
					...result.data,
					idcard: result.data.agentPersonCardNo || result.data.legalPersonCardNo
				});
			}
		},
		identityCheck(rule, value, callback) {
			if (!this.curAdmin.personalUserIdcard) {
				callback(new Error(' '));
				return;
			}
			API_idCardAuth3Meta({
				idCard: this.curAdmin.personalUserIdcard,
				mobile: this.curAdmin.personalUserMobile,
				name: this.curAdmin.personalUserName
			}).then(res => {
				if (res.success) {
					if (res.data.result) {
						callback();
					} else {
						callback(res.data.message);
					}
				}
			});
		},
		operatorJudge() {
			//如果下拉框打开，没有用户时提示
			if (!this.operatorList.length) {
				this.emptyVisible = true;
			}
		},
		operatorChange(value) {
			this.curAdmin = value;
			if (!value.auth) {
				this.hasChangeOperatorSelectName = 'noauth';
			} else {
				this.hasChangeOperatorSelectName = 'hasname';
				setTimeout(() => {
					this.changeOperatorForm.setFieldsValue({
						adminName: value.personalUserName,
						adminMobile: value.personalUserMobile,
						identType: '身份证',
						idcard: value.personalUserIdcard
					});
				}, 200);
			}
		},
		//前往添加员工
		emptyGo() {
			this.$router.push('/center/account/company/user');
		},
		submitAll() {
			if (this.hasChangeOperatorSelectName == 'noauth') {
				return;
			}
			this.changeOperatorForm.validateFieldsAndScroll(async (err, values) => {
				// 替换文件地址
				this.$refs.OperatorFormFile.submit();
				if (!err) {
					const fileResult = await this.$refs.OperatorFormFile.submit();
					values.newAdminId = values.newAdminIds.key.split(',')[1];
					values.loginName = values.newAdminIds.label;
					// delete values.newAdminIds;
					values.msgCode = this.msgCode;
					values.identType = '身份证';
					const { id, account, personalUserName, personalUserMobile, personalUserIdcard } = this.curAdmin;
					const params = {
						newAdminId: id,
						account,
						adminName: personalUserName,
						adminMobile: personalUserMobile,
						idcard: personalUserIdcard,
						...fileResult,
						adminAuthValidTimeStart: moment(values.adminAuthValidTimeStart).format('YYYY-MM-DD'),
						adminAuthValidTimeEnd: moment(values.adminAuthValidTimeEnd).format('YYYY-MM-DD')
					};
					API_GetAdminModifyLastEditDetail().then(res => {
						this.model.id = res.data ? res.data.id : '';
						if (this.model.id) {
							params.id = this.model.id;
						}
						this.loading = true;
						API_COMPANYADMINMODIFYMODIFYADMINUSER(params)
							.then(res => {
								if (res.success) {
									this.activeIndex++;
								}
							})
							.finally(() => {
								this.loading = false;
							});
					});
				}
			});
		},
		getOperatorList() {
			API_COMPANYADMINMODIFYTOMODIFY({
				uscc: this.VUEX_ST_COMPANYSUER.companyUscc
			}).then(res => {
				if (res.success) {
					//员工中要排除当前管理员角色
					let companyUserList = res.data.filter(item => {
						let SIGNER = item.roles.some(items => {
							return items.code == 'ADMIN';
						});
						if (!SIGNER) {
							return true;
						}
					});
					this.operatorList = companyUserList.map(item => {
						const { address, area, idCard, mobile, name, auth } = item.personal;
						return {
							address,
							area,
							account: item.account,
							id: item.id,
							personalUserIdcard: idCard,
							personalUserMobile: mobile,
							personalUserName: name,
							auth
						};
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
/deep/ .modal-wrap {
	.ant-modal-mask {
		z-index: 1050;
	}
}
</style>