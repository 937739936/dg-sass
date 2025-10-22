<template>
	<a-form
		:form="form"
		:label-col="{ span: 6 }"
		:wrapper-col="{ span: 16 }"
	>
		<a-row>
			<a-col :span="12">
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
				</a-form-item>
			</a-col>
			<a-col :span="12">
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
			</a-col>
			<a-col :span="12">
				<a-form-item label="企业地址">
					<a-input
						placeholder="请输入企业地址"
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
			</a-col>
			<a-col :span="12">
				<a-form-item label="电话号码">
					<a-input
						placeholder="请输入电话号码"
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
			</a-col>
			<a-col :span="12">
				<a-form-item label="开户行">
					<a-input
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
			</a-col>
			<a-col :span="12">
				<a-form-item label="银行账户">
					<a-input
						placeholder="请输入银行账户"
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
			</a-col>
		</a-row>
	</a-form>
</template>

<script>
import { API_GetOfflineSellerBuyerList } from '@/v2/center/trade/api/contract';
import { getPopupContainer } from '@/v2/utils/factory.js';
import { API_TianYanCha } from '@/v2/center/person/api';
export default {
	name: 'BillingInformation',
	data() {
		return {
			getPopupContainer,
			form: this.$form.createForm(this),
			companyNameInfo: [] //买方企业列表
		};
	},
	async created() {},
	methods: {
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
		}
	}
};
</script>

<style></style>
