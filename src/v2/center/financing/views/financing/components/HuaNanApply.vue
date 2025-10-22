<template>
	<!-- 华能云成组件 -->
	<div>
		<a-form
			:form="financingApplyForm"
			class="slFormDetail"
			:colon="false"
			style="padding-top: 0"
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
						<a-form-item label="计息规则">
							<a-input
								disabled
								style="width: 364px"
								:value="receivableInfo.productItemType == 'product-huaneng-downReceivable' ? '按照360天计息' : '按照365天计息'"
							/>
						</a-form-item>
					</a-row>
				</a-col>
				<a-col :span="8">
					<a-row
						type="flex"
						justify="center"
					>
						<a-form-item label="利息收取方式">
							<a-input
								disabled
								style="width: 364px"
								value="一次性还本付息"
							/>
						</a-form-item>
					</a-row>
				</a-col>
				<a-col :span="8">
					<a-row
						type="flex"
						justify="end"
					>
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
			</a-row>
			<!-- 华能云成 -->
			<template>
				<a-row>
					<a-col :span="8">
						<a-row type="flex">
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
										v-for="(items, index) in rateList"
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
										v-for="(items, index) in overdueList"
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
							<a-form-item label="预计融资起息日">
								<a-date-picker
									style="width: 364px"
									placeholder="请选择"
									valueFormat="YYYY-MM-DD"
									format="YYYY-MM-DD"
									v-decorator="[
										`beginDate`,
										{
											rules: [{ required: true, message: `请选择预计融资起息日` }],
											validateTrigger: 'change'
										}
									]"
								></a-date-picker>
							</a-form-item>
						</a-row>
					</a-col>
				</a-row>
				<a-row>
					<a-col :span="8">
						<a-row type="flex">
							<a-form-item label="可提前还款日">
								<a-date-picker
									style="width: 364px"
									placeholder="请选择"
									valueFormat="YYYY-MM-DD"
									format="YYYY-MM-DD"
									v-decorator="[
										`prepaymentDate`,
										{
											rules: [{ required: true, message: `请选择可提前还款日` }],
											validateTrigger: 'change'
										}
									]"
								></a-date-picker>
							</a-form-item>
						</a-row>
					</a-col>
				</a-row>
				<a-row> </a-row>
				<!-- 融资收款账号 -->
				<a-row>
					<a-col :span="8">
						<a-row type="flex">
							<a-form-item label="融资收款账号">
								<a-select
									style="width: 364px"
									:class="financingApplyForm.getFieldValue('loanAccountId') ? 'fangkuan-select' : ''"
									v-decorator="[
										'loanAccountId',
										{ rules: [{ required: true, message: `融资收款账号必填` }], validateTrigger: 'change' }
									]"
									@change="v => selectAccount('f', v)"
									placeholder="请选择融资收款账号"
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
							<a-form-item label="融资收款账号开户名">
								<a-input
									style="width: 364px"
									disabled
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
							<a-form-item label="融资收款账号开户行">
								<a-input
									style="width: 364px"
									disabled
									:value="fangkuanData.fangkuanhang"
								/>
							</a-form-item>
						</a-row>
					</a-col>
				</a-row>
				<!-- 监管账号 -->
				<a-row>
					<a-col :span="8">
						<a-row type="flex">
							<a-form-item label="资金监管账号">
								<a-select
									style="width: 364px"
									:class="financingApplyForm.getFieldValue('fundAccountId') ? 'fangkuan-select' : ''"
									v-decorator="[
										'fundAccountId',
										{ rules: [{ required: true, message: `资金监管账号必填` }], validateTrigger: 'change' }
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
							<a-form-item label="资金监管账号开户名">
								<a-input
									style="width: 364px"
									disabled
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
							<a-form-item label="资金监管账号开户行">
								<a-input
									style="width: 364px"
									disabled
									:value="fangkuanData.jianhang"
								/>
							</a-form-item>
						</a-row>
					</a-col>
				</a-row>
				<!-- 回款账号 -->
				<a-row>
					<a-col :span="8">
						<a-row type="flex">
							<a-form-item label="资金方收款账号">
								<a-select
									style="width: 364px"
									:class="financingApplyForm.getFieldValue('acctAccountId') ? 'fangkuan-select' : ''"
									v-decorator="[
										'acctAccountId',
										{ rules: [{ required: true, message: `资金方收款账号必填` }], validateTrigger: 'change' }
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
									style="width: 364px"
									disabled
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
							<a-form-item label="资金方收款账号开户行">
								<a-input
									style="width: 364px"
									disabled
									:value="fangkuanData.huikuanhang"
								/>
							</a-form-item>
						</a-row>
					</a-col>
				</a-row>
				<!-- 融资说明 -->
				<a-row>
					<a-col :span="24">
						<a-row type="flex">
							<a-form-item
								label="融资说明"
								style="flex: 1"
							>
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
					</a-col>
				</a-row>

				<!-- /** 费用明细 */ -->
				<div
					class="slTitleAssis"
					style="margin-top: 10px"
				>
					费用明细
				</div>
				<a-table
					rowKey="name"
					class="new-table cost-table"
					style="margin-top: 20px"
					:columns="costColumns"
					:dataSource="feeList"
					:pagination="false"
					:defaultExpandAllRows="true"
					:locale="{ emptyText: '暂无数据' }"
				>
					<span slot="customTitles1"><i class="symbol">*</i>费率(%)</span>
					<span slot="customTitles2"><i class="symbol">*</i>收取方式</span>
					<template
						slot="rate"
						slot-scope="text, record"
					>
						<a-form-item>
							<a-input-number
								placeholder="请输入费率"
								:min="0.01"
								:precision="2"
								:max="9999.99"
								v-decorator="[
									record.rate,
									{
										rules: [{ required: true, message: `费率必填` }],
										validateTrigger: 'blur'
									}
								]"
							/>
						</a-form-item>
					</template>
					<template
						slot="collectionMethod"
						slot-scope="text, record"
					>
						<a-form-item>
							<a-radio-group
								v-decorator="[
									record.collectionMethod,
									{
										rules: [
											{
												required: true,
												message: `收取方式必填`
											}
										],
										validateTrigger: 'change'
									}
								]"
								placeholder="请选择收取方式"
							>
								<a-radio
									:value="items.value"
									v-for="(items, index) in financingApplyFeeCollectionData"
									:key="index"
								>
									{{ items.text }}
								</a-radio>
							</a-radio-group>
						</a-form-item>
					</template>
					<template
						slot="incomeByDayText"
						slot-scope="text, record, index"
					>
						{{
							index == 0 && financingApplyForm.getFieldValue('FACTORING_INTEREST_collectionMethod') == 'BACKWARD_CHARGE'
								? '是'
								: ''
						}}
						{{
							index == 1 && financingApplyForm.getFieldValue('FACTORING_SERVICE_FEE_collectionMethod') == 'BACKWARD_CHARGE'
								? '是'
								: ''
						}}
						{{
							index == 2 && financingApplyForm.getFieldValue('FACTORING_FEE_collectionMethod') == 'BACKWARD_CHARGE' ? '是' : ''
						}}
						{{
							index == 3 && financingApplyForm.getFieldValue('INFO_SERVICE_FEE_collectionMethod') == 'BACKWARD_CHARGE' ? '是' : ''
						}}
					</template>
				</a-table>
			</template>
		</a-form>
	</div>
</template>

<script>
import {
	API_FinancingApplycompanyCredit,
	API_FinancingApplySaveHN,
	API_COMPANYACCOUNTLIST
} from '@/v2/center/financing/api/index.js';
const costColumns = [
	{ title: '费用明细', dataIndex: 'feeTypeText' },
	{ title: '计息方式', dataIndex: 'feeModeText' },
	{ slots: { title: 'customTitles1' }, dataIndex: 'rate', scopedSlots: { customRender: 'rate' } },
	{ slots: { title: 'customTitles2' }, dataIndex: 'collectionMethod', scopedSlots: { customRender: 'collectionMethod' } },
	{ title: '是否按日计息', dataIndex: 'incomeByDayText', scopedSlots: { customRender: 'incomeByDayText' } }
];
import { filterCodeByKey } from '@sub/utils/globalCode.js';
import moment from 'moment';

export default {
	props: {},

	data() {
		return {
			financingApplyForm: this.$form.createForm(this, {
				onValuesChange: this.onValuesChange
			}),
			// 融资利率列表
			rateList: [],
			// 逾期
			overdueList: [],
			// 放款
			fangkuanAccountList: [],
			// 监管
			jianguanAccountList: [],
			// 回款
			huikuanAccountList: [],
			// 选择的 放还款 监控的数据
			fangkuanData: {},
			// 费用明细
			costColumns,
			feeList: [
				{
					feeTypeText: '保理利息',
					feeModeText: '按本金比例',
					rate: 'FACTORING_INTEREST_rate',
					collectionMethod: 'FACTORING_INTEREST_collectionMethod'
				},
				{
					feeTypeText: '保理服务费',
					feeModeText: '按本金比例',
					rate: 'FACTORING_SERVICE_FEE_rate',
					collectionMethod: 'FACTORING_SERVICE_FEE_collectionMethod'
				},
				{
					feeTypeText: '保理手续费',
					feeModeText: '按本金比例',
					rate: 'FACTORING_FEE_rate',
					collectionMethod: 'FACTORING_FEE_collectionMethod'
				},
				{
					feeTypeText: '信息咨询服务费',
					feeModeText: '按本金比例',
					rate: 'INFO_SERVICE_FEE_rate',
					collectionMethod: 'INFO_SERVICE_FEE_collectionMethod'
				}
			],
			financingApplyFeeCollectionData: filterCodeByKey('financingApplyFeeCollectionDict'),
			numberReg: /^100$|^(\d|[1-9]\d)(\.\d{1,2})?$/,
			quantityShow: false
		};
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
	mounted() {
		this.getBankAccount(this.VUEX_ST_COMPANYSUER.companyUscc, 'f');
	},
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
	methods: {
		onValuesChange() {},
		setFormData() {
			this.$nextTick(() => {
				this.financingApplyForm.resetFields();
				this.financingApplyForm.setFieldsValue({
					receivableSerialNo: this.receivableInfo.serialNo,
					amount: this.receivableInfo.planFinancingAmount
				});

				// 回显融资信息数据
				this.getRongZiDetail();

				this.getBankAccount(this.receivableInfo.bankUscc, 'h');
				this.setFangkuan();
			});
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
		// 检测融资金额
		amountvalidator(rule, value, callback) {
			if (value > this.receivableInfo.planFinancingAmount) {
				callback('融资金额不能大于拟融资金额');
				return;
			}
			callback();
		},
		// 获取融资率 逾期
		async getRongZiDetail() {
			if (!this.receivableInfo.id) return;
			const params = {
				receivableId: this.receivableInfo.id
			};
			const res = await API_FinancingApplycompanyCredit(params);
			let info = res.data || {};
			this.rateList = [{ text: info.rate, value: info.rate }];
			this.overdueList = [{ text: info.overdueRate, value: info.overdueRate }];
		},
		// 获取账户 回款 和 收款
		async getBankAccount(uscc, type) {
			const params = {
				uscc
			};
			const res = await API_COMPANYACCOUNTLIST(params);
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
			if (type == 'f' || type == 'j') {
				this.fangkuanAccountList = _array;
				this.jianguanAccountList = _array;
				this.setFangkuan();
			} else {
				this.huikuanAccountList = _array;
			}
		},
		selectAccount(type, c) {
			var currentObj = {};
			if (type == 'f') {
				currentObj = this.fangkuanAccountList.find(el => el.value == c) || {};
				this.fangkuanData.fangkuanhang = currentObj.bankName;
				this.fangkuanData.fangkuanname = currentObj.bankAccountName;
			} else if (type == 'j') {
				currentObj = this.jianguanAccountList.find(el => el.value == c) || {};
				this.fangkuanData.jianhang = currentObj.bankName;
				this.fangkuanData.jianname = currentObj.bankAccountName;
			} else {
				currentObj = this.huikuanAccountList.find(el => el.value == c) || {};
				this.fangkuanData.huikuanhang = currentObj.bankName;
				this.fangkuanData.huikuanname = currentObj.bankAccountName;
			}
		},
		// 根据accountNo设置放款账号
		setFangkuan() {
			let accountNo = this.receivableInfo.accountNo;
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
		getApplySaveData() {
			return new Promise((resolve, reject) => {
				this.financingApplyForm.validateFieldsAndScroll((error, values) => {
					if (error) {
						reject(error);
						return;
					}
					/*- - feeType	是	string	费用类型
            - - feeMode	是	string	计费方式
            - - collectionMethod	是	string	收取方式
            - - rate	是	string	费率
            - - amount	是	string	费用
            - - incomeByDay	是	string	是否按日计息*/
					let feeList = [
						{
							feeType: 'FACTORING_FEE',
							feeMode: 'PRINCIPAL_RATIO',
							collectionMethod: values.FACTORING_FEE_collectionMethod,
							rate: values.FACTORING_FEE_rate,
							incomeByDay: values.FACTORING_FEE_collectionMethod == 'BACKWARD_CHARGE' ? 'YES' : null
						},
						{
							feeType: 'FACTORING_INTEREST',
							feeMode: 'PRINCIPAL_RATIO',
							collectionMethod: values.FACTORING_INTEREST_collectionMethod,
							rate: values.FACTORING_INTEREST_rate,
							incomeByDay: values.FACTORING_INTEREST_collectionMethod == 'BACKWARD_CHARGE' ? 'YES' : null
						},
						{
							feeType: 'FACTORING_SERVICE_FEE',
							feeMode: 'PRINCIPAL_RATIO',
							collectionMethod: values.FACTORING_SERVICE_FEE_collectionMethod,
							rate: values.FACTORING_SERVICE_FEE_rate,
							incomeByDay: values.FACTORING_SERVICE_FEE_collectionMethod == 'BACKWARD_CHARGE' ? 'YES' : null
						},
						{
							feeType: 'INFO_SERVICE_FEE',
							feeMode: 'PRINCIPAL_RATIO',
							collectionMethod: values.INFO_SERVICE_FEE_collectionMethod,
							rate: values.INFO_SERVICE_FEE_rate,
							incomeByDay: values.INFO_SERVICE_FEE_collectionMethod == 'BACKWARD_CHARGE' ? 'YES' : null
						}
					];

					resolve({
						func: API_FinancingApplySaveHN,
						...this.fangkuanData,
						...values,
						receivableId: this.receivableInfo.id,
						feeList,
						// financingRatio:1,
						beginDate: moment(values.beginDate).format('YYYY-MM-DD'),
						prepaymentDate: moment(values.prepaymentDate).format('YYYY-MM-DD'),
						// 写死
						incomeRuleType: this.receivableInfo.productItemType == 'product-huaneng-downReceivable' ? 'IN_360' : 'IN_365', //计息规则:按365天计息
						incomeChargeType: 'ONE_REPAY' //利息收取方式:一次性还本付息
					});
				});
			});
		}
	},
	components: {}
};
</script>
<style lang="less" scoped>
@import url('~@sub/style/table-cover.less');
</style>
<style scoped lang="less">
.symbol {
	display: inline-block;
	color: red;
	margin-right: 10px;
	position: relative;
	top: 2px;
}
.cost-table {
	/deep/ .ant-table-thead {
		tr th {
			border-left: 1px solid #e5e6eb;
			border-bottom: 1px solid #e5e6eb;
		}
		tr th:first-child {
			background: #f3f5f6;
			border-left: 0;
		}
	}
	/deep/ tbody {
		tr td {
			border-left: 1px solid #e5e6eb;
			border-bottom: 1px solid #e5e6eb !important;
		}
		tr td:first-child {
			border-left: 0;
			background: #f3f5f6;
		}
		tr:last-child td {
			// border-bottom: 0 !important;
		}
		tr:nth-child(2n) {
			background: #fff !important;
		}
	}
}
</style>
