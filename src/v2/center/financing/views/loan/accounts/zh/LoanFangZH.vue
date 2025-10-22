<template>
	<div class="slMain">
		<Breadcrumb />
		<a-card :bordered="false">
			<div
				class="methods-wrap"
				slot="title"
			>
				<span class="slTitle">放款登记</span>
			</div>
			<div class="slTitleAssis">融资信息</div>
			<a-descriptions
				bordered
				:column="3"
				size="middle"
			>
				<a-descriptions-item label="融资方">{{ financingData.financier }}</a-descriptions-item>
				<a-descriptions-item label="融资编号">{{ financingData.serialNo }}</a-descriptions-item>
				<a-descriptions-item label="出资机构">{{ financingData.bankName }}</a-descriptions-item>
				<a-descriptions-item label="融资利率（%）">{{ financingData.rate }}</a-descriptions-item>
				<a-descriptions-item label="拟融资金额(元)">
					<span style="color: #f46332"> ¥{{ formatMoney(financingData.planFinancingAmount) }} </span>
				</a-descriptions-item>
				<a-descriptions-item label="逾期利率（%）">{{ financingData.overdueRate }}</a-descriptions-item>
			</a-descriptions>
			<div class="slTitleAssis">放款信息</div>
			<a-form
				:form="applyForm"
				:colon="false"
				class="slFormDetail"
			>
				<a-row>
					<a-col :span="8">
						<a-form-item label="放款金额">
							<a-input
								v-inputTip
								prefix="￥"
								placeholder="请输入放款金额"
								v-decorator="[
									`finAmount`,
									{
										rules: [
											{ required: true, message: `放款金额必填` },
											{ validator: validator },
											{
												pattern: numberReg,
												message: '请输入数字，最多两位小数'
											}
										],
										validateTrigger: 'blur'
									}
								]"
							/>
						</a-form-item>
					</a-col>
					<a-col :span="8">
						<a-form-item label="融资起息日">
							<a-date-picker
								:getCalendarContainer="getPopupContainer"
								format="YYYY-MM-DD"
								v-decorator="[
									`beginDate`,
									{
										rules: [{ required: true, message: `请选择融资起息日` }],
										validateTrigger: 'change'
									}
								]"
							></a-date-picker>
						</a-form-item>
					</a-col>
					<a-col :span="8">
						<a-form-item label="融资到期日期">
							<a-date-picker
								:getCalendarContainer="getPopupContainer"
								v-decorator="[
									`endDate`,
									{
										rules: [{ required: true, message: `请选择融资到期日期` }],
										validateTrigger: 'change'
									}
								]"
							></a-date-picker>
						</a-form-item>
					</a-col>

					<template v-if="financingData.forwardCharge == 1">
						<a-col :span="8">
							<a-form-item label="利息收取方式">
								<a-select
									v-decorator="[
										'interestType',
										{
											rules: [{ required: true, message: `请选择利息收取方式` }],
											validateTrigger: 'change'
										}
									]"
									placeholder="请选择融资比例"
								>
									<a-select-option value="FORWARD_CHARGE"> 前向收费 </a-select-option>
								</a-select>
							</a-form-item>
						</a-col>

						<a-col :span="8">
							<a-form-item label="利息（元）">
								<a-input
									disabled
									:value="
										getLixi(
											applyForm.getFieldValue('beginDate'),
											applyForm.getFieldValue('endDate'),
											applyForm.getFieldValue('finAmount')
										)
									"
								/>
							</a-form-item>
						</a-col>
					</template>
				</a-row>
				<div class="butSub">
					<a-button
						type="primary"
						ghost
						@click="$router.back()"
						style="margin-right: 20px"
						>返回</a-button
					>
					<a-button
						type="primary"
						@click="save"
						>提交</a-button
					>
				</div>
			</a-form>
		</a-card>
	</div>
</template>

<script>
import moment from 'moment';
import { formatMoney } from '@sub/filters';
import { API_FinancingDetail, API_FinancingLoanRegister } from '@/v2/center/financing/api/index.js';
import Breadcrumb from '@/v2/components/breadcrumb/index';
import { getPopupContainer } from '@/untils/factory.js';

export default {
	name: 'LoanFangZH',
	data() {
		return {
			getPopupContainer,
			formatMoney,
			applyForm: this.$form.createForm(this),
			numberReg: /^(\d+)(\.\d{1,2})?$/,
			financingData: {},
			current: 1,
			isBill: false,
			steps: [
				{
					title: '选择融资记录'
				},
				{
					title: '填写放款信息'
				},
				{
					title: '完成放款登记'
				}
			]
		};
	},
	components: { Breadcrumb },
	computed: {},
	mounted() {
		this.loanId = this.$route.query.id || 'xx';
		this.getFinancingDetail();
	},
	methods: {
		getFinancingDetail() {
			API_FinancingDetail({ financingApplyId: this.loanId }).then(res => {
				if (res.success) {
					this.financingData = res.data;
					this.isBill = this.financingData.billDetail;
					this.applyForm.setFieldsValue({
						endDate: moment(this.financingData.endDate)
					});
				}
			});
		},
		getLixi(beginDate, endDate, finAmount) {
			if (beginDate && endDate && finAmount) {
				var dif = moment(endDate).diff(moment(beginDate).subtract(1, 'days'), 'days');
				return ((Number(finAmount) * dif * (this.financingData.rate || 0)) / 360 / 100).toFixed(2);
			}

			return '-';
		},
		save() {
			this.applyForm.validateFields((error, values) => {
				if (error) return;
				this.$confirm({
					centered: true,
					title: '确定提交吗?',
					okText: '确定',
					cancelText: '取消',
					onOk: () => {
						let endDate =
							typeof this.applyForm.getFieldValue('endDate') == 'string'
								? this.applyForm.getFieldValue('endDate')
								: this.applyForm.getFieldValue('endDate').format('YYYY-MM-DD');
						let beginDate = values.beginDate.format('YYYY-MM-DD');
						if (new Date(endDate) <= new Date(beginDate)) {
							this.$message.error('融资到期日不能小于融资起息日，并且不能是同一天');
							return;
						}

						API_FinancingLoanRegister({
							id: this.loanId,
							...values,
							endDate: endDate,
							beginDate: beginDate
						}).then(res => {
							if (res.data) {
								this.$router.back();
							}
						});
					}
					// onCancel() {}
				});
			});
		},

		validator(rule, value, callback) {
			var str = '放款金额不能大于拟融资金额且不小于1/10拟融资金额';
			var planFinancingAmount = Number(this.financingData.planFinancingAmount);
			value = Number(value);
			if (value < (1 / 10) * planFinancingAmount || value > planFinancingAmount) {
				callback(str);
			}
			callback();
		}
	}
};
</script>

<style lang="less" scoped>
.slMain {
	/deep/ .ant-descriptions-bordered .ant-descriptions-item-label {
		background-color: #f3f5f6;
		color: #77889d;
		min-height: 48px;
		padding: 12px;
	}

	/deep/ .ant-descriptions-bordered .ant-descriptions-item-content {
		color: rgba(0, 0, 0, 0.8);
		min-height: 48px;
		padding: 12px;
	}
	/deep/.ant-form-item {
		width: 364px;
		.ant-form-explain {
			font-size: 14px !important;
		}
	}
	.butSub {
		margin-top: 30px;
		text-align: center;
		button {
			padding: 0 30px;
		}
	}
}
</style>
