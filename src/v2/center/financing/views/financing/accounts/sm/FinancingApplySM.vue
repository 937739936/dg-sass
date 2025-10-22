<template>
	<div>
		<div class="slTitleAssis">融资信息</div>
		<a-form
			class="slFormDetail"
			:form="financingApplyForm"
		>
			<a-row>
				<a-col :span="8">
					<a-form-item label="出资机构">
						{{ fangkuanData.bankName }}
					</a-form-item>
				</a-col>
			</a-row>
			<a-row>
				<a-col :span="8">
					<a-form-item label="融资比例（%）">
						<a-select
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
				</a-col>
				<a-col :span="8">
					<a-form-item label="融资利率（%）">
						<a-select
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
				</a-col>
				<a-col :span="8">
					<a-form-item label="逾期日利率（%）">
						<a-select
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
				</a-col>
			</a-row>
			<a-row>
				<a-form-item label="融资金额（元）">
					<a-input
						placeholder="请输入融资金额"
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
				<a-form-item
					label="利息支付方式"
					v-if="fangkuanData.bankUscc == CONSTANTS.ghblUscc"
				>
					<a-select
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
			<a-row v-if="fangkuanData.productItemType == 'receivable-shanmei-down'">
				<a-col :span="8">
					<a-form-item label="是否出具《延期情况说明》">
						<a-radio-group
							v-decorator="[
								'postponement',
								{
									initialValue: '0',
									rules: [{ required: true, message: `请选择` }],
									validateTrigger: 'change'
								}
							]"
							@change="changePostponement"
						>
							<a-radio value="1"> 是 </a-radio>
							<a-radio value="0"> 否 </a-radio>
						</a-radio-group>
					</a-form-item>
				</a-col>
				<a-col
					:span="8"
					v-if="financingApplyForm.getFieldValue('postponement') == 1"
				>
					<a-form-item label="贸易合同约定付款日期">
						<a-date-picker
							value-format="YYYY-MM-DD"
							format="YYYY-MM-DD"
							:disabled-date="disabledDate"
							v-decorator="[
								`contractSetsPaymentDate`,
								{
									rules: [{ required: true, message: `贸易合同约定付款日期必填` }],
									validateTrigger: 'change'
								}
							]"
						></a-date-picker>
					</a-form-item>
				</a-col>
			</a-row>
			<a-row style="margin-bottom: 20px; margin-top: 20px; border-top: 1px solid #ccc"></a-row>
			<a-row>
				<a-col :span="8">
					<a-form-item label="放款账号">
						<a-select
							class="fangkuan-select"
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
				</a-col>
				<a-col :span="8">
					<a-form-item label="放款账号开户名">
						<a-input
							disabled
							:value="fangkuanData.fangkuanname"
						/>
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-form-item label="放款账号开户行">
						<a-input
							disabled
							:value="fangkuanData.fangkuanhang"
						/>
					</a-form-item>
				</a-col>
			</a-row>
			<a-row>
				<a-col :span="8">
					<a-form-item label="融资还款账号">
						<a-select
							class="fangkuan-select"
							v-decorator="[
								'acctAccountId',
								{
									rules: [{ required: true, message: `回款账号必填` }],
									validateTrigger: 'change'
								}
							]"
							@change="v => selectAccount('h', v)"
							placeholder="请选择融资还款账号"
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
				</a-col>
				<a-col :span="8">
					<a-form-item label="融资还款账号开户名">
						<a-input
							disabled
							:value="fangkuanData.huikuanname"
						/>
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-form-item label="融资还款账号开户行">
						<a-input
							disabled
							:value="fangkuanData.huikuanhang"
						/>
					</a-form-item>
				</a-col>
			</a-row>
			<a-row>
				<a-form-item label="融资说明">
					<a-textarea
						style="width: 600px; height: 80px"
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
import moment from 'moment';
import {
	API_COMPANYACCOUNTLIST,
	API_FinancingApplycompanyCredit,
	API_FinancingApplySave
} from '@/v2/center/financing/api/index.js';
import { filterCodeByKey } from '@sub/utils/globalCode.js';
import { mapGetters } from 'vuex';

export default {
	name: 'FinancingApplySM',
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

			lixiData: filterCodeByKey('financingInterestPayTypeDict')
		};
	},
	props: ['accountNo', 'currentRecord'],
	components: {},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		})
	},
	watch: {
		accountNo: {
			deep: true,
			handler() {
				this.setFangkuan();
			}
		}
	},
	async mounted() {
		this.financingApplyId = this.$route.query.id || 'xx';
		await this.getBankAccount(this.VUEX_ST_COMPANYSUER.companyUscc, 'f');
	},
	methods: {
		disabledDate(current) {
			return current && current > moment(this.currentRecord.endDate).endOf('day');
		},
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
		changePostponement(e) {
			this.$emit('changePostponement', e.target.value);
		},

		setFormData(record) {
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
