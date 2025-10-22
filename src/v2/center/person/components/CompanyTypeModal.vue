<template>
	<a-modal
		v-model="visibleCompany"
		destroyOnClose
		title="企业认证"
		okText="下一步"
		@ok="handleOkCompany"
		@cancel="visibleCompany = false"
		class="company-type-modal-wrap"
	>
		<a-form
			v-if="isGroup"
			:form="form"
			v-bind="formLayout"
		>
			<a-form-item
				label="请选择您要认证的企业"
				:colon="false"
			>
				<a-select
					placeholder="请选择您要认证的企业"
					:options="companyList"
					labelInValue
					@change="companyChange"
					v-decorator="[
						'companyName',
						{
							rules: [{ required: true, message: '公司名称必填' }],
							validateTrigger: 'blur'
						}
					]"
				>
				</a-select>
			</a-form-item>
		</a-form>
		<div class="radio-wrap form-wrap">
			<p>请选择您的企业类型</p>
			<div style="margin-top: 20px">
				<a-radio-group
					:options="authCompanyTypeDict"
					:defaultValue="(authCompanyTypeDict[0] && authCompanyTypeDict[0].value) || ''"
					@change="e => select(e.target.value)"
				/>
			</div>
		</div>
	</a-modal>
</template>
<script>
import { API_COMPANYGROUPNOAUTHLIST, getCompanyBusinessList } from '@/v2/api/account';
import { filterCodeByKey } from '@sub/utils/globalCode.js';
export default {
	name: 'CompanyTypeModal',

	props: {
		isGroup: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			companyList: [],
			curCompany: {},
			visibleCompany: false,
			curAuditType: 'TRADER',
			authCompanyTypeDict: filterCodeByKey('authCompanyTypeDict'),
			businessList: [
				{ value: 'COAL', label: '煤炭', check: true },
				{ value: 'STEEL', label: '钢材', check: false },
				{ value: 'AGR', label: '农产品', check: false }
			],
			uscc: '',
			// auditTypes:[
			//   { label: '贸易商', value: 1 },
			//   { label: '终端', value: 30 },
			//   { label: '金融机构', value: 23 },
			//   { label: '仓储', value: 7 }
			// ],
			form: this.$form.createForm(this),
			formLayout: {
				labelCol: { span: 24 },
				wrapperCol: { span: 24 }
			}
		};
	},

	computed: {
		isShowBusiness() {
			// 贸易商 终端 金融 仓储 煤炭
			// return ["TRADER", 'TERMINAL', "FINANCIAL_ORG", "WAREHOUSE", 'COAL_MINE'].includes(this.curAuditType);
			return !!this.businessList.length;
		}
	},

	methods: {
		companyChange(v) {
			this.curCompany = v;
		},
		showModal(uscc) {
			this.visibleCompany = true;
			this.uscc = uscc;
			this.curAuditType = 'TRADER';
			this.getCompanyBusinessList(this.curAuditType);
			this.form.resetFields(['companyName']);

			if (this.isGroup) {
				API_COMPANYGROUPNOAUTHLIST().then(res => {
					if (res.success) {
						this.companyList = res.data.map(item => {
							return { label: item.name, value: item.uscc };
						});
					}
				});
			}
		},

		select(v) {
			this.curAuditType = v;
			this.getCompanyBusinessList(v);
		},

		handleOkCompany() {
			/** 获取业务类型 */
			const arr = this.businessList.filter(el => el.check).map(el => el.code);
			const businessType = arr.join();
			let query = {
				type: this.curAuditType
			};
			if (this.isGroup) {
				this.form.validateFields(err => {
					if (!err) {
						const { key, label } = this.curCompany;
						query = {
							type: this.curAuditType,
							name: label,
							uscc: key,
							isShowBusiness: this.isShowBusiness,
							businessType
						};
						this.visibleCompany = false;
						this.$router.push({
							path: '/center/account/company/info/certified',
							query
						});
					}
				});
			} else {
				query = {
					type: this.curAuditType,
					isShowBusiness: this.isShowBusiness,
					businessType
				};
				if (this.uscc) {
					query.uscc = this.uscc;
				}
				this.visibleCompany = false;
				this.$router.push({
					path: '/center/account/company/info/certified',
					query
				});
			}
		},
		async getCompanyBusinessList(authCompanyType) {
			const params = {
				authCompanyType
			};
			const res = await getCompanyBusinessList(params);
			const list = res.data || [];
			list.forEach(el => {
				el.check = false;
				if (el.code == 'COAL') {
					el.check = true;
				}
			});
			this.businessList = list;
		},
		// 选择业务
		selectBusiness(item) {
			const arr = this.businessList.filter(el => el.check);
			if (arr.length <= 1 && item.check) {
				this.$message.error('业务类型必选');
				return;
			}
			item.check = !item.check;
			this.$forceUpdate();
		},
		setClass(v) {
			if (this.curAuditType == v) {
				return 'active';
			}
		}
	}
};
</script>

<style lang="less" scoped>
@import url('~@/v2/style/form-reset.less');
</style>
<style lang="less" scoped>
.apply-des {
	padding-bottom: 20px;
}
.audit-type {
	height: 20px;
	padding: 0 20px;
	background: #f4f5f8;
	border-radius: 4px;
	font-size: 10px;
	color: #383a3f;
	text-align: center;
	line-height: 20px;
	display: inline-block;
	margin-right: 10px;
	cursor: pointer;
	margin-bottom: 10px;
}
.active {
	background: #e6edfa;
	color: @primary-color;
}
/deep/ .radio-wrap {
	.ant-radio-group {
		display: flex;
		flex-wrap: wrap;
	}
	.ant-radio-wrapper {
		width: 23%;
		height: 26px;
		display: flex;
		flex-direction: row;
		align-items: center;
	}
}
.company-type-modal-wrap {
	/deep/.ant-modal-content {
		.ant-modal-footer {
			.ant-btn {
				width: 90px;
			}
			.ant-btn:nth-child(2) {
				margin-left: 20px;
			}
		}
	}
	/deep/ .ant-modal-close-x {
		background: url('~@/v2/assets/imgs/common/close-modal.png') no-repeat;
		background-size: 22px 22px;
		background-position: center;
		.ant-modal-close-icon {
			display: none;
		}
	}
}
</style>
