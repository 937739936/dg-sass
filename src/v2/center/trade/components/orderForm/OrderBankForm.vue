<template>
	<div id="orderBankForm">
		<a-row>
			<h3 style="margin: 30px 0">银行账户信息</h3>
		</a-row>
		<!-- 线下合同模版firstBankNo==null 无银行信息 默认为true -->
		<a-form
			:form="bankAccountForm"
			onValuesChange="fieldsChange"
			v-if="firstBankNo"
		>
			<a-row>
				<a-col
					:span="12"
					class="rowH"
				>
					<a-form-item
						label="卖方账号"
						:label-col="{
							span: 9
						}"
						:wrapper-col="{
							span: 15
						}"
					>
						<a-select
							:disabled="disabled"
							@change="sellerAccountChange"
							placeholder="请输入卖方账号"
							v-decorator="[
								`sellerInfo`,
								{
									rules: [{ required: true, message: `卖方账号必填` }]
								}
							]"
						>
							<a-select-option
								v-for="(items, index) in sellerAccountData"
								:key="index"
								:value="items.bankNo"
							>
								<p>{{ items.bankName }}({{ items.accountTypeText }})</p>
								<p>{{ items.bankNo }}</p>
							</a-select-option>
						</a-select>
					</a-form-item>
				</a-col>
				<a-col
					:span="12"
					class="rowH"
				>
					<a-form-item
						label="买方账号"
						:label-col="{
							span: 9
						}"
						:wrapper-col="{
							span: 15
						}"
					>
						<a-select
							:disabled="disabled"
							placeholder="请输入买方账号"
							@change="buyerAccountChange"
							v-decorator="[
								`buyerInfo`,
								{
									rules: [{ required: true, message: `买方账号必填` }]
								}
							]"
						>
							<a-select-option
								v-for="(items, index) in buyerAccountData"
								:key="index"
								:value="items.bankNo"
							>
								<p>{{ items.bankName }}({{ items.accountTypeText }})</p>
								<p>{{ items.bankNo }}</p>
							</a-select-option>
						</a-select>
					</a-form-item>
				</a-col>
				<a-col
					:span="12"
					class="row"
				>
					<a-form-item
						label="开户行"
						:label-col="{
							span: 9
						}"
						:wrapper-col="{
							span: 15
						}"
					>
						<a-input
							:disabled="true"
							labelInValue
							v-decorator="[`secondBankName`]"
						/>
					</a-form-item>
				</a-col>
				<a-col
					:span="12"
					class="row"
				>
					<a-form-item
						label="开户行"
						:label-col="{
							span: 9
						}"
						:wrapper-col="{
							span: 15
						}"
					>
						<a-input
							:disabled="true"
							v-decorator="[`firstBankName`]"
						/>
					</a-form-item>
				</a-col>
				<a-col
					:span="12"
					class="row"
				>
					<a-form-item
						label="账号"
						:label-col="{
							span: 9
						}"
						:wrapper-col="{
							span: 15
						}"
					>
						<a-input
							:disabled="true"
							labelInValue
							v-decorator="[`secondBankNo`]"
						/>
					</a-form-item>
				</a-col>
				<a-col
					:span="12"
					class="row"
				>
					<a-form-item
						label="账号"
						:label-col="{
							span: 9
						}"
						:wrapper-col="{
							span: 15
						}"
					>
						<a-input
							:disabled="true"
							labelInValue
							v-decorator="[`firstBankNo`]"
						/>
					</a-form-item>
				</a-col>
			</a-row>
		</a-form>
	</div>
</template>

<script>
import { API_COMPANYACCOUNTLIST } from '@/v2/api/account';

export default {
	name: 'OrderBankForm',
	data() {
		return {
			bankAccountForm: this.$form.createForm(this, {
				onValuesChange: this.fieldsChange
			}),
			sellerAccountData: [],
			buyerAccountData: [],
			sellerAccountObj: {},
			buyerAccountObj: {},
			defaultFirstBankNo: '',
			defaultSecondBankNo: ''
		};
	},
	computed: {},
	props: {
		buyerCompanyUscc: {
			type: String,
			required: true
		},
		sellerCompanyUscc: {
			type: String,
			required: true
		},
		disabled: {},
		firstBankNo: {
			default: true
		},
		//判断是否是详情页使用该组件，默认不是详情页
		isDetail: {
			type: Boolean,
			default: false
		}
	},
	mounted() {},
	watch: {
		buyerCompanyUscc: {
			immediate: true,
			handler(data) {
				if (data) {
					API_COMPANYACCOUNTLIST({ uscc: data }).then(res => {
						if (res.success) {
							this.buyerAccountData = res.data.map(item => {
								return {
									bankNo: item.accountNo,
									bankName: item.bankName,
									id: item.id,
									accountTypeText: item.accountTypeText
								};
							});
							const result = this.buyerAccountData.some(item => {
								return item.bankNo == this.defaultFirstBankNo;
							});
							if (!result && this.defaultFirstBankNo && !this.isDetail) {
								this.$message.error('银行账户信息不存在！');
								this.$nextTick(() => {
									this.bankAccountForm.setFieldsValue({
										buyerInfo: '',
										firstBankName: '',
										firstBankNo: ''
									});
								});
							}
							if (this.bankAccountForm.getFieldValue('firstBankNo')) {
								this.buyerAccountChange(this.bankAccountForm.getFieldValue('firstBankNo'));
							}
						}
					});
				}
			}
		},
		sellerCompanyUscc: {
			immediate: true,
			handler(data) {
				if (data) {
					API_COMPANYACCOUNTLIST({ uscc: data }).then(res => {
						if (res.success) {
							this.sellerAccountData = res.data.map(item => {
								return {
									bankNo: item.accountNo,
									bankName: item.bankName,
									id: item.id,
									accountTypeText: item.accountTypeText
								};
							});
							const result = this.sellerAccountData.some(item => {
								return item.bankNo == this.defaultSecondBankNo;
							});
							if (!result && this.defaultSecondBankNo && !this.isDetail) {
								this.$message.error('银行账户信息不存在！');
								this.$nextTick(() => {
									this.bankAccountForm.setFieldsValue({
										sellerInfo: '',
										secondBankName: '',
										secondBankNo: ''
									});
								});
							}
							if (this.bankAccountForm.getFieldValue('secondBankNo')) {
								this.sellerAccountChange(this.bankAccountForm.getFieldValue('secondBankNo'));
							}
						}
					});
				}
			}
		}
	},
	methods: {
		setBankData(data, type = '') {
			if (data) {
				let contract = data.contract;
				if (type == 'add') {
					this.bankAccountForm.setFieldsValue({
						...contract
					});
				} else {
					this.bankAccountForm.setFieldsValue({
						buyerInfo: contract.buyBankNo,
						firstBankName: contract.buyBankName,
						firstBankNo: contract.buyBankNo,
						sellerInfo: contract.sellerBankNo,
						secondBankName: contract.sellerBankName,
						secondBankNo: contract.sellerBankNo
					});
				}
				this.$nextTick(() => {
					if (this.bankAccountForm.getFieldValue('firstBankNo')) {
						this.buyerAccountChange(this.bankAccountForm.getFieldValue('firstBankNo'));
					}
					if (this.bankAccountForm.getFieldValue('secondBankNo')) {
						this.sellerAccountChange(this.bankAccountForm.getFieldValue('secondBankNo'));
					}
				});
			}
		},
		fieldsChange(props, fields) {
			this.defaultFirstBankNo = this.bankAccountForm.getFieldValue('firstBankNo');
			this.defaultSecondBankNo = this.bankAccountForm.getFieldValue('secondBankNo');
		},
		sellerAccountChange(data) {
			const bankNo = data;
			this.sellerAccountObj = this.sellerAccountData.filter(item => {
				return bankNo == item.bankNo;
			});

			if (this.sellerAccountObj.length) {
				this.bankAccountForm.setFieldsValue({
					secondBankName: this.sellerAccountObj[0].bankName,
					secondBankNo: this.sellerAccountObj[0].bankNo
				});
			}
			this.sellerAccountObj = this.dealData(this.sellerAccountObj[0], 'sell');
		},
		buyerAccountChange(data) {
			const bankNo = data;
			this.buyerAccountObj = this.buyerAccountData.filter(item => {
				return bankNo == item.bankNo;
			});

			if (this.buyerAccountObj.length) {
				this.bankAccountForm.setFieldsValue({
					firstBankName: this.buyerAccountObj[0].bankName,
					firstBankNo: this.buyerAccountObj[0].bankNo
				});
			}
			this.buyerAccountObj = this.dealData(this.buyerAccountObj[0], 'buy');
		},
		dealData(data, type) {
			var newData = {};
			if (type == 'buy') {
				for (let key in data) {
					if (key == 'companyName') {
						newData['firstCompanyName'] = data['companyName'];
					}
					if (key == 'address') {
						newData['firstAddress'] = data['address'];
					}
					if (key == 'personName') {
						newData['firstPersonName'] = data['personName'];
					}
					if (key == 'bankName') {
						newData['firstBankName'] = data['bankName'];
					}
					if (key == 'bankNo') {
						newData['firstBankNo'] = data['bankNo'];
					}
					if (key == 'companyUscc') {
						newData['firstCompanyUscc'] = data['companyUscc'];
					}
					if (key == 'id') {
						newData['buyerBankAccountId'] = data['id'];
					}
				}
			}
			if (type == 'sell') {
				for (let key in data) {
					if (key == 'companyName') {
						newData['secondCompanyName'] = data['companyName'];
					}
					if (key == 'address') {
						newData['secondAddress'] = data['address'];
					}
					if (key == 'personName') {
						newData['secondPersonName'] = data['personName'];
					}
					if (key == 'bankName') {
						newData['secondBankName'] = data['bankName'];
					}
					if (key == 'bankNo') {
						newData['secondBankNo'] = data['bankNo'];
					}
					if (key == 'companyUscc') {
						newData['secondCompanyUscc'] = data['companyUscc'];
					}
					if (key == 'id') {
						newData['sellerBankAccountId'] = data['id'];
					}
				}
			}
			return newData;
		}
	}
};
</script>

<style lang="less">
#orderBankForm {
	h3 {
		font-size: 18px;
	}
	.row {
		height: 60px;
	}
	.rowH {
		height: 90px;
	}
	.ant-select-selection--single {
		height: 60px;
	}
	.ant-select-selection__rendered {
		line-height: 60px;
	}
	.ant-select-selection-selected-value {
		p {
			line-height: 30px;
		}
	}
	label[for='sellerInfo'] {
		line-height: 60px;
	}
	label[for='buyerInfo'] {
		line-height: 60px;
	}
}
</style>
