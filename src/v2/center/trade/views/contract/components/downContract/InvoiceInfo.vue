<template>
	<div id="invoiceInfo">
		<a-form
			:form="form"
			class="slFormDetail"
			style="padding-bottom: 0"
			:colon="false"
		>
			<a-row>
				<a-col :span="8">
					<a-row type="flex">
						<a-form-item label="发票购买方与买方企业名称是否一致">
							<a-radio-group
								@change="changeWhetherSame"
								v-decorator="[
									`whetherSame`,
									{
										initialValue: 'SAME',
										rules: [
											{
												required: true,
												message: `发票购买方与买方企业名称是否一致`
											}
										]
									}
								]"
							>
								<a-radio
									:value="item.value"
									v-for="item in whetherSameList"
									:key="item.value"
								>
									{{ item.text }}
								</a-radio>
							</a-radio-group>
						</a-form-item>
					</a-row>
				</a-col>
			</a-row>
			<a-row v-if="form.getFieldValue('whetherSame') == 'DIFFERENT'">
				<a-col :span="8">
					<a-row type="flex">
						<a-form-item label="购买方">
							<a-select
								:getPopupContainer="getPopupContainer"
								:placeholder="`请输入购买方`"
								@change="validateName"
								show-search
								:show-arrow="false"
								:default-active-first-option="false"
								:filter-option="false"
								:not-found-content="null"
								@search="inputCompany"
								v-decorator="[
									`companyName`,
									{
										rules: [
											{
												required: true,
												message: `请输入购买方`
											}
										]
									}
								]"
							>
								<a-select-option
									v-for="item in companyNameInfo"
									:key="item.name"
								>
									<a-tooltip>
										<template slot="title">{{ item.name }}</template>
										<span>{{ item.name }}</span>
									</a-tooltip>
								</a-select-option>
							</a-select>
							<div
								class="red"
								v-if="tipsFlag"
							>
								开票信息中购买方与合同信息中买方为同一企业，“发票购买方与买方企业名称是否一致”请选择“是”
							</div>
						</a-form-item>
					</a-row>
				</a-col>
				<a-col :span="8">
					<a-row
						type="flex"
						justify="center"
					>
						<a-form-item label="税号">
							<a-input
								placeholder="请输入税号"
								:disabled="true"
								v-decorator="[
									`bizLicenseNo`,
									{
										rules: [
											{
												required: true,
												message: `请输入税号`
											}
										]
									}
								]"
							/>
						</a-form-item>
					</a-row>
				</a-col>
				<a-col :span="8">
					<a-row
						type="flex"
						justify="end"
					>
						<a-form-item label="企业地址">
							<a-input
								placeholder="请输入企业地址"
								:maxLength="200"
								v-decorator="[
									`companyAddress`,
									{
										rules: [
											{
												required: false,
												message: `请输入企业地址`
											}
										]
									}
								]"
							/>
						</a-form-item>
					</a-row>
				</a-col>
				<a-col :span="8">
					<a-row type="flex">
						<a-form-item label="电话号码">
							<a-input
								placeholder="请输入电话号码"
								:maxLength="20"
								v-decorator="[
									`companyPhone`,
									{
										rules: [
											{
												required: false,
												message: `请输入电话号码`
											}
										]
									}
								]"
							/>
						</a-form-item>
					</a-row>
				</a-col>
				<a-col :span="8">
					<a-row
						type="flex"
						justify="center"
					>
						<a-form-item label="开户行">
							<a-input
								:maxLength="200"
								placeholder="请输入开户行"
								v-decorator="[
									`openAccountBank`,
									{
										rules: [
											{
												required: false,
												message: `请输入开户行`
											}
										]
									}
								]"
							/>
						</a-form-item>
					</a-row>
				</a-col>
				<a-col :span="8">
					<a-row
						type="flex"
						justify="end"
					>
						<a-form-item label="银行账户">
							<a-input
								placeholder="请输入银行账户"
								:maxLength="20"
								v-decorator="[
									`accountNo`,
									{
										rules: [
											{
												required: false,
												message: `请输入银行账户`
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
</template>

<script>
import { getPopupContainer } from '@/v2/utils/factory.js';
import { API_GetOfflineSellerBuyerList } from '@/v2/center/trade/api/contract';
import { API_TianYanCha } from '@/v2/center/person/api';
export default {
	props: {
		isBuyContract: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			form: this.$form.createForm(this, { name: 'transportInfo' }),
			getPopupContainer,
			contractType: 'sell',
			companyNameInfo: [],
			whetherSameList: [
				{ value: 'SAME', text: '是' },
				{ value: 'DIFFERENT', text: '否' }
			], // 发票购买方与买方企业名称是否一致
			tipsFlag: false,
			buyerCompanyName: ''
		};
	},

	watch: {
		buyerCompanyName: function () {
			this.verifyBuyer();
		}
	},
	mounted() {
		this.contractType = this.$route.query.type;
	},
	methods: {
		init(info) {
			this.form.setFieldsValue({ whetherSame: info.terminalContractExtensionDto.whetherSame });
			this.$nextTick(() => {
				if (info.terminalContractExtensionDto.whetherSame == 'DIFFERENT') {
					this.inputCompany(info.terminalContractExtensionDto.companyInvoiceInfo.companyName);
					this.form.setFieldsValue(info.terminalContractExtensionDto.companyInvoiceInfo);
				}
			});
		},
		//加载买方企业
		inputCompany(v) {
			API_GetOfflineSellerBuyerList({ keyword: v }).then(res => {
				const arr = res.data || [];
				if (arr.length === 0) {
					this.form.setFieldsValue({ buyerName: v });
					return (this.companyNameInfo = []);
				}
				this.companyNameInfo = arr.map(item => ({
					name: item.name,
					value: item.bizLicenseNo
				}));
			});
		},
		//企业名称校验
		async validateName(e) {
			let value = e;
			this.form.setFieldsValue({
				bizLicenseNo: '', //税号
				companyAddress: '' //企业地址
				// companyPhone: "", //电话号码
				// openAccountBank: "", //开户行
				// accountNo: "", //银行账户
			});
			if (value) {
				await API_TianYanCha({
					keyword: value
				}).then(res => {
					if (res.success) {
						if (res.data && res.data.creditCode) {
							let data = {
								bizLicenseNo: res.data.creditCode, //税号
								companyAddress: res.data.regLocation //企业地址
							};
							this.form.setFieldsValue(data);
							this.verifyBuyer();
						} else {
							this.$message.error('未查询到对应企业信息，请核实“买方企业名称”录入是否正确');
						}
					}
				});
			}
			this.$nextTick(() => {
				//判断选择的开票企业和买方企业关系
				this.$emit('buyerNameValidate');
			});
		},
		changeWhetherSame(e) {
			if (e.target.value === 'SAME') {
				this.tipsFlag = false;
			}
			this.$emit('changeWhetherSame', e.target.value);
		},
		//“开票信息”选择“否”后，开票信息中的“购买方”失去焦点后增加校验
		verifyBuyer(type) {
			if (this.form.getFieldValue('whetherSame') === 'DIFFERENT') {
				this.$emit('getBuyerCompanyName');
				let buyer = this.form.getFieldValue('companyName'); // 购买方
				let buyerCompanyName = this.buyerCompanyName; // 买方企业
				if (buyer === buyerCompanyName) {
					this.tipsFlag = true;
					if (type === 'save') {
						let box = document.getElementById('invoiceInfo');
						box.scrollIntoView({ behavior: 'smooth', block: 'center' });
					}
					return true;
				} else {
					this.tipsFlag = false;
					return false;
				}
			} else {
				this.tipsFlag = false;
				return false;
			}
		},
		save() {
			return new Promise(resolve => {
				this.form.validateFieldsAndScroll((err, values) => {
					let error = err || this.verifyBuyer('save');
					if (!error) {
						resolve(values);
					} else {
						resolve(false);
					}
				});
			});
		}
	}
};
</script>

<style lang="less" scoped>
.ant-checkbox-wrapper {
	height: 32px;
	line-height: 32px;
}
.relation-order {
	/deep/ .ant-form-item-control {
		text-align: right;
	}
	/deep/ .ant-checkbox-wrapper {
		span:nth-child(2) {
			padding-right: 0;
		}
	}
	/deep/ .ant-form-explain {
		text-align: left;
	}
}
.ant-col {
	height: 85px;
}
.ant-form-item {
	width: 364px;
	margin-bottom: 0;
}
#thymeleaf-content {
	width: 0;
	height: 0;
	display: none;
}
.df {
	display: flex;
	align-items: center;
}
.symbol {
	background: #f3f5f6;
	border: 1px solid #e5e6eb;
	border-radius: 0px 4px 4px 0px;
	width: 32px;
	height: 32px;
	display: flex;
	align-items: center;
	justify-content: center;
}
.quantity-offset {
	border-right: 0;
	border-radius: 4px 0px 0 4px;
}
.quantity-box {
	/deep/ .ant-form-item-label {
		opacity: 0;
	}
}
.marginBottom0 {
	margin-bottom: 0;
	min-height: 64px;
}
.calendar {
	width: 14px;
	height: 14px;
	display: inline-block;
	vertical-align: middle;
	background: url(~@/v2/assets/imgs/common/calendar.png) no-repeat 100% 100%;
	background-size: contain;
	line-height: 38px !important;
	top: 16px;
}
.red {
	color: #f5222d;
	margin-top: 2px;
	font-size: 14px;
	zoom: 0.85;
	line-height: 14px;
}
</style>
