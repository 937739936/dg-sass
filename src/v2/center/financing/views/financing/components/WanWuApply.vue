<template>
	<div>
		<a-form
			class="slFormDetail"
			:form="financingApplyForm"
			style="padding-top: 0px"
		>
			<a-row>
				<a-col :span="8">
					<a-row type="flex">
						<a-form-item label="资金类型">
							<a-input
								style="width: 364px"
								:disabled="true"
								placeholder="资金类型"
								v-decorator="[
									`productItemType`,
									{
										initialValue: receivableInfo.productItemName,
										rules: [{ required: true, message: `请输入买方企业名称` }]
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
						<a-form-item label="出资机构">
							<a-input
								style="width: 364px"
								:disabled="true"
								placeholder="资金类型"
								v-decorator="[
									`bankName`,
									{
										initialValue: receivableInfo.bankName
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
						<a-form-item label="预计融资到期日">
							<a-input
								style="width: 364px"
								:disabled="true"
								v-decorator="[
									`endDate`,
									{
										initialValue: receivableInfo.endDate
									}
								]"
							/>
						</a-form-item>
					</a-row>
				</a-col>
			</a-row>
			<a-row>
				<a-col :span="8">
					<a-row type="flex">
						<a-form-item label="融资比例（%）">
							<template v-if="fangkuanData.assetType === 'ACCOUNTS_RECEIVABLE_MODIFY'">
								<a-input
									style="width: 364px"
									placeholder="请输入融资比例（%）"
									v-decorator="[
										`financingRatio`,
										{
											rules: [
												{ required: true, message: `融资比例必填` },
												{
													pattern: /^(?:[1-9][0-9]?|100)$/,
													message: '请输入1到100之间的整数',
													trigger: 'change'
												}
											]
										}
									]"
								/>
							</template>
							<a-select
								v-else
								style="width: 364px"
								v-decorator="[
									'financingRatio',
									{
										rules: [{ required: true, message: `融资比例必填` }],
										validateTrigger: 'change'
									}
								]"
								placeholder="请选择融资比例"
							>
								<a-select-option
									v-for="(items, index) in biliData"
									:key="index"
									:value="items.value"
									>{{ items.text }}</a-select-option
								>
							</a-select>
						</a-form-item>
					</a-row>
				</a-col>
				<a-col :span="8">
					<a-row
						type="flex"
						justify="center"
					>
						<a-form-item label="融资利率（%）">
							<a-select
								style="width: 364px"
								v-decorator="[
									'rate',
									{
										rules: [{ required: true, message: `融资利率必填` }],
										validateTrigger: 'change'
									}
								]"
								placeholder="请选择融资利率"
							>
								<a-select-option
									v-for="(items, index) in lilvData"
									:key="index"
									:value="items.value"
									>{{ items.text }}</a-select-option
								>
							</a-select>
						</a-form-item>
					</a-row>
				</a-col>
				<a-col :span="8">
					<a-row
						type="flex"
						justify="end"
					>
						<a-form-item label="逾期日利率（%）">
							<a-select
								style="width: 364px"
								v-decorator="[
									'overdueRate',
									{
										rules: [{ required: true, message: `逾期日利率必填` }],
										validateTrigger: 'change'
									}
								]"
								placeholder="请选择逾期日利率"
							>
								<a-select-option
									v-for="(items, index) in yuqiData"
									:key="index"
									:value="items.value"
									>{{ items.text }}</a-select-option
								>
							</a-select>
						</a-form-item>
					</a-row>
				</a-col>
			</a-row>
			<a-row>
				<a-col :span="8">
					<a-row type="flex">
						<a-form-item label="融资金额（元）">
							<a-input
								v-inputTip
								placeholder="请输入融资金额"
								style="width: 364px"
								prefix="￥"
								v-decorator="[
									`amount`,
									{
										rules: [
											{ required: true, message: `融资金额必填` },
											{
												type: 'number',
												message: `请输入数字`,
												transform: v => Number(v)
											},
											{ validator: amountvalidator }
										],
										validateTrigger: 'blur'
									}
								]"
							/>
						</a-form-item>
					</a-row>
				</a-col>
				<a-col
					:span="8"
					v-if="fangkuanData.bankUscc == CONSTANTS.ghblUscc"
				>
					<a-row
						type="flex"
						justify="center"
					>
						<a-form-item label="利息支付方式">
							<a-select
								style="width: 364px"
								v-decorator="[
									'interestPayType',
									{
										rules: [{ required: true, message: `利息支付方式必填` }],
										validateTrigger: 'change'
									}
								]"
								placeholder="请选择利息支付方式"
							>
								<a-select-option
									v-for="(items, index) in lixiData"
									:key="index"
									:value="items.value"
									><div
										style="white-space: normal"
										class="lixi-item"
									>
										{{ items.text }}
									</div></a-select-option
								>
							</a-select>
						</a-form-item>
					</a-row>
				</a-col>
			</a-row>
			<a-row>
				<a-col :span="8">
					<a-row type="flex">
						<a-form-item label="放款账号">
							<a-select
								style="width: 364px"
								:class="financingApplyForm.getFieldValue('loanAccountId') ? 'fangkuan-select' : ''"
								v-decorator="[
									'loanAccountId',
									{
										rules: [{ required: true, message: `放款账号必填` }],
										validateTrigger: 'change'
									}
								]"
								@change="v => selectAccount('f', v)"
								placeholder="请选择放款账号"
							>
								<a-select-option
									v-for="(items, index) in fangkuanAccountList"
									:key="index"
									:value="items.value"
								>
									<p>{{ items.bankName }}</p>
									<p>{{ items.bankNo }}</p>
								</a-select-option>
							</a-select>
						</a-form-item>
					</a-row>
				</a-col>
				<a-col :span="8">
					<a-row
						type="flex"
						justify="center"
					>
						<a-form-item label="放款账号开户名">
							<a-input
								disabled
								style="width: 364px"
								:value="fangkuanData.fangkuanname"
							/>
						</a-form-item>
					</a-row>
				</a-col>
				<a-col :span="8">
					<a-row
						type="flex"
						justify="end"
					>
						<a-form-item label="放款账号开户行">
							<a-input
								disabled
								style="width: 364px"
								:value="fangkuanData.fangkuanhang"
							/>
						</a-form-item>
					</a-row>
				</a-col>
			</a-row>
			<a-row>
				<a-col :span="8">
					<a-row type="flex">
						<a-form-item label="资金方收款账号">
							<a-select
								:class="financingApplyForm.getFieldValue('acctAccountId') ? 'fangkuan-select' : ''"
								style="width: 364px"
								v-decorator="[
									'acctAccountId',
									{
										rules: [{ required: true, message: `回款账号必填` }],
										validateTrigger: 'change'
									}
								]"
								@change="v => selectAccount('h', v)"
								placeholder="请选择资金方收款账号"
							>
								<a-select-option
									v-for="(items, index) in huikuanAccountList"
									:key="index"
									:value="items.value"
								>
									<p>{{ items.bankName }}</p>
									<p>{{ items.bankNo }}</p>
								</a-select-option>
							</a-select>
						</a-form-item>
					</a-row>
				</a-col>
				<a-col :span="8">
					<a-row
						type="flex"
						justify="center"
					>
						<a-form-item label="资金方收款账号开户名">
							<a-input
								disabled
								style="width: 364px"
								:value="fangkuanData.huikuanname"
							/>
						</a-form-item>
					</a-row>
				</a-col>
				<a-col :span="8">
					<a-row
						type="flex"
						justify="end"
					>
						<a-form-item label="资金方收款开户行">
							<a-input
								disabled
								style="width: 364px"
								:value="fangkuanData.huikuanhang"
							/>
						</a-form-item>
					</a-row>
				</a-col>
			</a-row>
			<a-row
				v-if="
					fangkuanData.assetType == 'ACCOUNTS_RECEIVABLE_DOWN_MANUAL' || fangkuanData.productItemType === 'receivable-anbaoli'
				"
			>
				<a-col :span="8">
					<a-row type="flex">
						<a-form-item label="资金监管账号">
							<a-select
								style="width: 364px"
								:class="financingApplyForm.getFieldValue('fundAccountId') ? 'fangkuan-select' : ''"
								v-decorator="[
									'fundAccountId',
									{
										rules: [
											{
												required: true,
												message: `资金监管账号必填`
											}
										],
										validateTrigger: 'change'
									}
								]"
								@change="v => selectAccount('j', v)"
								placeholder="请选择资金监管账号"
							>
								<a-select-option
									v-for="(items, index) in fangkuanAccountList"
									:key="index"
									:value="items.value"
								>
									<p>{{ items.bankName }}</p>
									<p>{{ items.bankNo }}</p>
								</a-select-option>
							</a-select>
						</a-form-item>
					</a-row>
				</a-col>
				<a-col :span="8">
					<a-row
						type="flex"
						justify="center"
					>
						<a-form-item label="监管账号开户名">
							<a-input
								disabled
								style="width: 364px"
								:value="fangkuanData.jianname"
							/>
						</a-form-item>
					</a-row>
				</a-col>
				<a-col :span="8">
					<a-row
						type="flex"
						justify="end"
					>
						<a-form-item label="监管账号开户行">
							<a-input
								disabled
								style="width: 364px"
								:value="fangkuanData.jianhang"
							/>
						</a-form-item>
					</a-row>
				</a-col>
			</a-row>
			<a-row>
				<a-form-item label="融资说明">
					<a-textarea
						style="width: 100%; height: 80px"
						placeholder="请输入融资说明(不超过100字)"
						:maxLength="100"
						v-decorator="[
							`remark`,
							{
								rules: [{ required: false, message: `` }],
								validateTrigger: 'blur'
							}
						]"
					/>
				</a-form-item>
			</a-row>
		</a-form>
	</div>
</template>

<script>
import ENV from '@/v2/config/env';
import {
	API_COMPANYACCOUNTLIST,
	API_FinancingApplycompanyCredit,
	API_FinancingApplySave
} from '@/v2/center/financing/api/index.js';
import { filterCodeByKey } from '@sub/utils/globalCode.js';

export default {
	name: 'FinancingApplyWwyl',
	data() {
		return {
			financingApplyForm: this.$form.createForm(this),
			numberReg: /^100$|^(\d|[1-9]\d)(\.\d{1,2})?$/,
			receivableListVisible: false,
			receivableListDataSource: [],
			receivableDataSource: [],
			modalPdfIsShow: false,
			xieyiDataSource: [],
			modalPdfUrl: '',
			BASE_NET: ENV.BASE_NET,
			fangkuanData: {},
			biliData: [],
			lilvData: [],
			yuqiData: [],

			fangkuanAccountList: [],
			huikuanAccountList: [],

			lixiData: filterCodeByKey('financingInterestPayTypeDict'),
			quantityShow: false
		};
	},
	components: {},
	computed: {
		receivableInfo() {
			return this.$store.state.financing.receivableInfo;
		},
		VUEX_ST_COMPANYSUER() {
			if (this.$store.state.user) {
				return this.$store.state.user.VUEX_ST_COMPANYSUER;
			}
			return {};
		}
	},
	watch: {
		receivableInfo: {
			handler() {
				this.setFormData();
			},
			deep: true,
			immediate: true
		}
	},
	async mounted() {
		this.financingApplyId = this.$route.query.id || 'xx';
		await this.getBankAccount(this.VUEX_ST_COMPANYSUER.companyUscc, 'f');
	},
	methods: {
		getBankAccount(companyUscc, type) {
			API_COMPANYACCOUNTLIST({ uscc: companyUscc }).then(res => {
				let data = res.data || [];
				let _array = [];
				data.forEach(item => {
					_array.push({
						bankName: item.subbranchName,
						bankNo: item.accountNo,
						value: item.id,
						bankAccountName: item.accountName
					});
				});
				if (type == 'f') {
					this.fangkuanAccountList = _array;
					this.setFangkuan();
				} else {
					this.huikuanAccountList = _array;
				}
			});
		},
		selectAccount(type, c) {
			var currentObj = {};
			if (type == 'f') {
				this.fangkuanAccountList.forEach(item => {
					if (item.value == c) {
						currentObj = item;
					}
				});

				this.fangkuanData.fangkuanhang = currentObj.bankName;
				this.fangkuanData.fangkuanname = currentObj.bankAccountName;
			} else if (type == 'j') {
				this.fangkuanAccountList.forEach(item => {
					if (item.value == c) {
						currentObj = item;
					}
				});

				this.fangkuanData.jianhang = currentObj.bankName;
				this.fangkuanData.jianname = currentObj.bankAccountName;
			} else {
				this.huikuanAccountList.forEach(item => {
					if (item.value == c) {
						currentObj = item;
					}
				});
				this.fangkuanData.huikuanhang = currentObj.bankName;
				this.fangkuanData.huikuanname = currentObj.bankAccountName;
			}
		},
		changeQuantity(e) {
			let val = e.target ? e.target.value : e;
			this.quantityShow = false;
			if (val >= 1000) {
				this.quantityShow = true;
			}
		},
		changeQuantityFocus(e) {
			const val = e.target.value;
			this.quantityShow = false;
			if (val >= 1000) {
				this.quantityShow = true;
			}
		},
		amountvalidator(rule, value, callback) {
			if (
				this.receivableDataSource &&
				this.receivableDataSource.length &&
				value > this.receivableDataSource[0].planFinancingAmount
			) {
				callback('融资金额不能大于拟融资金额');
				return;
			}
			callback();
		},

		setFormData() {
			let record = this.receivableInfo;
			this.financingApplyForm.resetFields();

			this.financingApplyForm.setFieldsValue({
				receivableSerialNo: record.serialNo,
				amount: record.planFinancingAmount
			});

			// 回显融资信息数据
			this.getRongZiDetail(record);

			this.fangkuanData = record;
			this.getBankAccount(record.bankUscc, 'h');
			this.setFangkuan();
		},
		// 根据accountNo设置放款账号
		setFangkuan() {
			let accountNo = this.accountNo;
			if (!accountNo) return;
			let currentObj = this.fangkuanAccountList.find(item => item.bankNo == accountNo);
			if (currentObj) {
				this.financingApplyForm.setFieldsValue({
					loanAccountId: currentObj.value
				});
				this.fangkuanData.fangkuanhang = currentObj.bankName;
				this.fangkuanData.fangkuanname = currentObj.bankAccountName;
			}
		},
		getRongZiDetail(record) {
			API_FinancingApplycompanyCredit({ receivableId: record.id }).then(res => {
				if (res.success) {
					let data = res.data || {};
					//INVOICE(“发票结算”),PROOF(“无票结算”);
					let bili = record.type == 'INVOICE' ? data.ticketFinancingPercentage : data.noTicketFinancingPercentage;
					this.biliData = [
						{
							text: bili,
							value: bili
						}
					];
					this.lilvData = [
						{
							text: data.rate,
							value: data.rate
						}
					];
					this.yuqiData = [
						{
							text: data.overdueRate,
							value: data.overdueRate
						}
					];
				}
			});
		},
		getApplySaveData() {
			return new Promise((resolve, reject) => {
				this.financingApplyForm.validateFieldsAndScroll((error, values) => {
					if (error) {
						reject(error);
						return;
					}
					resolve({
						func: API_FinancingApplySave,
						...this.fangkuanData,
						receivableId: this.fangkuanData.id,
						...values
					});
				});
			});
		}
	}
};
</script>

<style lang="less" scoped>
::v-deep .lixi-item {
	height: 30px;
	text-overflow: ellipsis;
	overflow: hidden;
	width: 265px;
	white-space: nowrap !important;
}
</style>
