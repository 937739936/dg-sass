<template>
	<div id="orderBankForm">
		<a-row>
			<h3 style="margin: 30px 0">银行账户信息</h3>
		</a-row>
		<!-- 线下合同模版firstBankNo==null 无银行信息 默认为true -->
		<a-form-model
			:rules="rules"
			ref="ruleForm"
			:model="bankAccountForm"
			:label-col="{ span: 6 }"
			:wrapper-col="{ span: 16 }"
		>
			<div class="bank">
				<a-row class="seller">
					<a-col :span="24">
						<a-form-model-item
							:label="labelInfo.sellerInfo"
							prop="sellerInfo"
						>
							<a-select
								:disabled="disabled"
								v-model="bankAccountForm.sellerInfo"
								@change="getSellerInfo"
							>
								<a-select-option
									v-for="(items, index) in sellerAccountData"
									:key="index"
									:value="items.accountNo"
								>
									<p>{{ items.accountName }} - {{ items.accountNo }}</p>
								</a-select-option>
							</a-select>
						</a-form-model-item>
					</a-col>
					<a-col
						:span="24"
						class="row"
					>
						<a-form-item label="开户行(卖方)">
							<a-input
								:disabled="true"
								v-model="bankAccountForm.secondBankName"
							/>
						</a-form-item>
					</a-col>
					<a-col
						:span="24"
						class="row"
					>
						<a-form-item label="账号(卖方)">
							<a-input
								:disabled="true"
								v-model="bankAccountForm.secondBankNo"
							/>
						</a-form-item>
					</a-col>
				</a-row>
				<a-row class="buyer">
					<a-col :span="24">
						<a-form-model-item
							:label="labelInfo.buyerInfo"
							prop="buyerInfo"
						>
							<a-select
								:disabled="disabled"
								v-model="bankAccountForm.buyerInfo"
								@change="getBuyerInfo"
							>
								<a-select-option
									v-for="(items, index) in buyerAccountData"
									:key="index"
									:value="items.accountNo"
								>
									<p>{{ items.accountName }} - {{ items.accountNo }}</p>
								</a-select-option>
							</a-select>
						</a-form-model-item>
					</a-col>
					<a-col
						:span="24"
						class="row"
					>
						<a-form-item label="开户行(买方)">
							<a-input
								:disabled="true"
								v-model="bankAccountForm.firstBankName"
							/>
						</a-form-item>
					</a-col>
					<a-col
						:span="24"
						class="row"
					>
						<a-form-item label="账号(买方)">
							<a-input
								:disabled="true"
								v-model="bankAccountForm.firstBankNo"
							/>
						</a-form-item>
					</a-col>
				</a-row>
			</div>
		</a-form-model>
	</div>
</template>

<script>
import { API_COMPANYACCOUNTLISTBYCOMPANYID } from '@/v2/center/steels/api/contract.js';
export default {
	props: {
		disabled: {
			default: false
		},
		type: {
			default: 'BUY'
		}
	},
	data() {
		return {
			bankAccountForm: {
				buyerInfo: '',
				sellerInfo: ''
			},
			rules: {
				sellerInfo: [{ required: true, message: '请选择卖方账号', trigger: 'change' }],
				buyerInfo: [{ required: true, message: '请选择买方账号', trigger: 'change' }]
			},
			// 卖方账号列表
			sellerAccountData: [],
			// 买方账号列表
			buyerAccountData: [],
			/*** 因为销售合同 需要反着来 */
			bankAccountForm2: {
				sellBankAccountId: '',
				buyBankAccountId: ''
			}
		};
	},
	computed: {
		labelInfo() {
			if (this.type == 'BUY') {
				return {
					sellerInfo: '卖方账号',
					buyerInfo: '买方账号'
				};
			}
			return {
				sellerInfo: '买方账号',
				buyerInfo: '卖方账号'
			};
		}
	},
	methods: {
		// 获取数据
		getSellerInfo() {
			const item = this.sellerAccountData.find(el => el.accountNo == this.bankAccountForm.sellerInfo) || {
				accountName: '',
				accountNo: ''
			};
			this.bankAccountForm.secondBankName = item.accountName;
			this.bankAccountForm.secondBankNo = item.accountNo;
			// 采购合同
			this.bankAccountForm.sellBankAccountId = item.id;
			// 销售合同
			this.bankAccountForm2.buyBankAccountId = item.id;
			this.$forceUpdate();
		},
		// 获取数据
		getBuyerInfo() {
			const item = this.buyerAccountData.find(el => el.accountNo == this.bankAccountForm.buyerInfo) || {
				accountName: '',
				accountNo: ''
			};
			this.bankAccountForm.firstBankName = item.accountName;
			this.bankAccountForm.firstBankNo = item.accountNo;
			// 采购合同
			this.bankAccountForm.buyBankAccountId = item.id;
			// 销售合同
			this.bankAccountForm2.sellBankAccountId = item.id;

			this.$forceUpdate();
		},
		async getBuyerAccountData() {
			const params = {
				companyId: this.buyerId
			};
			const res = await API_COMPANYACCOUNTLISTBYCOMPANYID(params);
			this.buyerAccountData = res.data;
		},
		async getSellerAccountData() {
			const params = {
				companyId: this.sellerId
			};
			const res = await API_COMPANYACCOUNTLISTBYCOMPANYID(params);

			this.sellerAccountData = res.data;
		},
		// copy数据
		async copyData(buyerInfo, sellerInfo, buyerId, sellerId) {
			this.buyerId = buyerId;
			this.sellerId = sellerId;
			this.bankAccountForm.buyerInfo = buyerInfo;
			this.bankAccountForm.sellerInfo = sellerInfo;
			await this.getSellerAccountData();
			await this.getBuyerAccountData();
			this.getSellerInfo();
			this.getBuyerInfo();
		},
		// 卖方变化
		async changeSeller(buyerInfo, sellerInfo, buyerId, sellerId) {
			this.sellerId = sellerId;
			this.buyerId = buyerId;
			this.bankAccountForm.sellerInfo = sellerInfo;
			// 判断买方是不是 已经选择
			if (!this.bankAccountForm.buyerInfo) {
				this.bankAccountForm.buyerInfo = buyerInfo;
				await this.getBuyerAccountData();
				this.getBuyerInfo();
			}
			await this.getSellerAccountData();
			this.getSellerInfo();
		},

		save() {
			let flag = false;
			this.$refs.ruleForm.validate(valid => {
				flag = valid;
			});

			if (flag) {
				return this.type == 'BUY' ? this.bankAccountForm : this.bankAccountForm2;
			}
			return flag;
		}
	},
	components: {}
};
</script>

<style scoped lang="less">
/deep/ .ant-select-selection--single {
	height: 60px;
}
.seller,
.buyer {
	display: flex;
	flex-direction: column;
	flex: 1;
}
.bank {
	display: flex;
}
</style>
