<template>
	<div>
		<div>
			<div class="slTitleAssis">应付账款信息</div>
			<a-form
				:form="paymentForm"
				:colon="false"
				class="slFormDetail"
			>
				<a-row>
					<a-col :span="8">
						<a-row
							type="flex"
							justify="start"
						>
							<a-form-item>
								<div
									slot="label"
									class="tip-item"
								>
									<span>合同货值金额（元）</span>
									<a-tooltip>
										<template slot="title">
											<span>该合同当前所有已收货货物总值金额</span>
										</template>
										<a-icon
											class="cur"
											type="exclamation-circle"
											style="color: #c3c3c3"
										/>
									</a-tooltip>
								</div>
								<a-input-number
									v-inputTip
									:precision="2"
									:min="0.01"
									:max="9999999999"
									placeholder="请输入货值金额"
									@blur="totalGoodsValueChanged"
									v-decorator="[
										`totalGoodsValue`,
										{
											validateTrigger: ['blur'],
											rules: [
												{ required: true, message: `合同货值金额必填` },
												{ pattern: numberReg, message: '请输入数字，最多两位小数' }
											]
										}
									]"
								>
								</a-input-number>
							</a-form-item>
						</a-row>
					</a-col>
					<a-col :span="8">
						<a-row
							type="flex"
							justify="center"
						>
							<a-form-item label="累计已转让金额（元）">
								<a-tooltip>
									<template slot="title"> {{ convertCurrency(paymentForm.getFieldValue('totalAmount')) }}</template>
									<a-input
										placeholder="累计已转让金额"
										disabled
										v-decorator="[`totalAmount`]"
									>
									</a-input>
								</a-tooltip>
							</a-form-item>
						</a-row>
					</a-col>
					<a-col :span="8">
						<a-row
							type="flex"
							justify="end"
						>
							<a-form-item>
								<div
									slot="label"
									class="tip-item"
								>
									<span>可转让金额（元）</span>
									<a-tooltip>
										<template slot="title">
											<span>该合同当前所有已收货货物总值金额</span>
										</template>
										<a-icon
											class="cur"
											type="exclamation-circle"
											style="color: #c3c3c3"
										/>
									</a-tooltip>
								</div>
								<a-tooltip>
									<template slot="title"> {{ convertCurrency(remainAmount) }}</template>
									<a-input
										placeholder="可转让金额（元）"
										disabled
										v-model="remainAmount"
									>
									</a-input>
								</a-tooltip>
							</a-form-item>
						</a-row>
					</a-col>
				</a-row>
				<a-row>
					<a-col :span="8">
						<a-row
							type="flex"
							justify="start"
						>
							<a-form-item label="应付账款类型">
								<a-select
									showSearch
									:filterOption="false"
									:defaultActiveFirstOption="false"
									placeholder="请选择应付账款类型"
									@change="updateMaxPlanFinanceAmount"
									v-decorator="[
										`type`,
										{
											rules: [{ required: true, message: `应付账款类型必选` }]
										}
									]"
								>
									<a-select-option
										key="PROOF"
										value="PROOF"
									>
										凭证结算
									</a-select-option>
									<a-select-option
										key="INVOICE"
										value="INVOICE"
									>
										发票结算
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
							<a-form-item>
								<div
									slot="label"
									class="tip-item"
								>
									<span>应付账款金额（元）</span>
									<a-tooltip>
										<template slot="title">
											<span>本次转让金额</span>
										</template>
										<a-icon
											class="cur"
											type="exclamation-circle"
											style="color: #c3c3c3"
										/>
									</a-tooltip>
								</div>
								<a-input-number
									v-inputTip
									:precision="2"
									:min="0.01"
									:max="Math.max(remainAmount, 0.01)"
									@change="updateMaxPlanFinanceAmount"
									placeholder="请输入本次转让金额"
									:disabled="detailData.receivalVO.amountModifiable == false"
									v-decorator="[
										`amount`,
										{
											validateTrigger: ['blur'],
											rules: [{ required: true, message: `应付账款金额必填` }]
										}
									]"
								>
								</a-input-number>
							</a-form-item>
						</a-row>
					</a-col>
					<a-col :span="8">
						<a-row
							type="flex"
							justify="end"
						>
							<a-form-item>
								<div
									slot="label"
									class="tip-item calculate"
								>
									<div>
										<span>拟融资金额（元）</span>
										<a-tooltip>
											<template slot="title">
												<span>本次拟付款金额</span>
											</template>
											<a-icon
												class="cur"
												type="exclamation-circle"
												style="color: #c3c3c3"
											/>
										</a-tooltip>
									</div>
									<a
										href="javascript:;"
										@click="calculate"
										>测算</a
									>
								</div>
								<a-input-number
									v-inputTip
									:precision="2"
									:min="0.01"
									:max="maxPlanFinanceAmount"
									placeholder="请输入本次拟付款金额"
									:disabled="detailData.receivalVO.amountModifiable == false"
									v-decorator="[
										`planFinancingAmount`,
										{
											validateTrigger: ['blur'],
											rules: [
												{ required: true, message: `拟融资金额必填` },
												{ pattern: numberReg, message: '请输入数字，最多两位小数' }
											]
										}
									]"
								>
								</a-input-number>
							</a-form-item>
						</a-row>
					</a-col>
				</a-row>
				<a-row>
					<a-col :span="8">
						<a-row
							type="flex"
							justify="start"
						>
							<a-form-item label="应付账款起始日期">
								<a-date-picker
									disabled
									value-format="YYYY-MM-DD"
									format="YYYY-MM-DD"
									v-decorator="[`beginDate`]"
								></a-date-picker>
							</a-form-item>
						</a-row>
					</a-col>
					<a-col :span="8">
						<a-row
							type="flex"
							justify="center"
						>
							<a-form-item label="应付账款到期日期">
								<a-date-picker
									:placeholder="endDateHolder"
									:disabled-date="disabledDate"
									:disabled="detailData.receivalVO.endDateType === 'GENERATED'"
									value-format="YYYY-MM-DD"
									format="YYYY-MM-DD"
									v-decorator="[
										`endDate`,
										{
											rules: [{ required: true, message: `应付账款到期日期必填` }],
											validateTrigger: 'blur'
										}
									]"
								></a-date-picker>
							</a-form-item>
						</a-row>
					</a-col>
				</a-row>
			</a-form>
		</div>
		<AssetsFinancingLiu
			ref="FinancingLiu"
			bizType="ASSET_RECEIVABLE"
			:data="detailData.auditChainAndOperator"
		/>
	</div>
</template>

<script>
import moment from 'moment';
import { convertCurrency } from '@sub/utils/factory';
import AssetsFinancingLiu from '@/v2/center/assets/components/AssetsFinancingLiu.vue';

export default {
	props: {
		detailData: {
			type: Object,
			default: undefined
		}
	},
	data() {
		return {
			paymentForm: this.$form.createForm(this, { onValuesChange: this.onValuesChange }),
			numberReg: /(^[1-9](\d+)?(\.\d{1,2})?$)|(^\d\.\d{1,2}$)/,
			remainAmount: 0,
			endDateHolder: '',
			convertCurrency,
			maxPlanFinanceAmount: 9999999999.99
		};
	},
	watch: {
		detailData: {
			immediate: true,
			handler(val) {
				if (!val) return;
				let receivalVO = val.receivalVO;
				let { totalGoodsValue, totalAmount, type, amount, planFinancingAmount, beginDate, endDate, endDateType } = receivalVO;
				this.remainAmount = totalGoodsValue || 0 - totalAmount || 0;
				if (endDateType == 'SELECTED_ALL') {
					this.endDateHolder = '请选择应付账款到期日期';
				} else if (endDateType == 'SELECTED_WORKING') {
					this.endDateHolder = '请选择应付账款到期日期，限工作日';
				}
				let values = {
					totalGoodsValue,
					totalAmount,
					type,
					amount,
					planFinancingAmount,
					beginDate,
					endDate
				};
				for (let key in values) {
					values[key] = { value: values[key] };
				}
				this.$nextTick(() => {
					this.paymentForm.setFields(values);
				});
			}
		}
	},
	mounted() {},
	inject: {
		isNeedNextChangeParent: { form: 'isNeedNextChangeParent', default: null }
	},
	components: { AssetsFinancingLiu },
	methods: {
		// 表单域的值发生改变时的回调
		onValuesChange(props, values) {
			// 主动修改某项值，触发变动
			if (this.isNeedNextChangeParent) {
				this.isNeedNextChangeParent();
			}
			if (values.type) {
				this.$emit('receivalVOChange', values);
			}
		},
		disabledDate(current) {
			// ● 若为人工选择（不限），则应收账款到期日≤起始日期+相应的资金类型的对应期限，可编辑；
			//     ○ 默认提示语：请选择应付账款到期日期
			//     ○ 未填写则报错，提示语为：应付账款到期日期必填
			// ● 若为人工选择（限工作日），则应收账款到期日≤起始日期+相应的资金类型的对应期限，且限定为工作日，可编辑；
			//     ○ 默认提示语：请选择应付账款到期日期，限工作日
			//     ○ 未填写则报错，提示语为：应付账款到期日期必填
			// ● 若为系统生成，应收账款到期日=起始日期+相应的资金类型的对应期限，不可编辑
			// 到期日类型：GENERATED-系统生成，SELECTED_WORKING-人工选择（限工作日），SELECTED_ALL-人工选择（不限工作日）
			let { endDateType, endDate } = this.detailData.receivalVO;
			let disableWeekday = false;
			if (endDateType == 'SELECTED_WORKING') {
				//限工作日
				disableWeekday = moment(current).weekday() == 5 || moment(current).weekday() == 6;
			}

			return (current && current > moment(endDate).endOf('day')) || disableWeekday;
		},
		totalGoodsValueChanged(e) {
			this.remainAmount = e.target.value - this.detailData.receivalVO.totalAmount;
		},
		// 测算
		calculate() {
			// 应收账款金额*有票/无票比例，
			const { type, amount } = this.paymentForm.getFieldsValue(['type', 'amount']);
			if (!amount || !type) {
				this.$message.error('应付账款类型金额和应付账款类型必须有数据');
				return;
			}
			this.updateMaxPlanFinanceAmount();
			this.paymentForm.setFieldsValue({ planFinancingAmount: this.maxPlanFinanceAmount });
		},
		updateMaxPlanFinanceAmount() {
			this.$nextTick(() => {
				const { type, amount } = this.paymentForm.getFieldsValue(['type', 'amount']);
				if (!amount || !type) {
					return;
				}
				// 查询当前选择的资金类型
				let { ticketFinancingPercentage, noTicketFinancingPercentage } = this.detailData.receivalVO;
				if (type == 'INVOICE') {
					this.maxPlanFinanceAmount = Number((amount * ticketFinancingPercentage).toFixed(2));
				} else {
					this.maxPlanFinanceAmount = Number((amount * noTicketFinancingPercentage).toFixed(2));
				}
				this.paymentForm.setFieldsValue({ planFinancingAmount: this.maxPlanFinanceAmount });
			});
		},

		// 提交
		onSubmit() {
			return new Promise((resolve, reject) => {
				this.paymentForm.validateFieldsAndScroll(async (error, value) => {
					let res = {};
					if (error) {
						reject('应付账款信息缺少参数');
						// return;
					} else {
						let { amount, totalGoodsValue, planFinancingAmount, type, beginDate, endDate } = value;
						res = { amount, totalGoodsValue, planFinancingAmount, type, beginDate, endDate };
					}
					// 审批流程
					let auditChainAndOperator = null;
					try {
						auditChainAndOperator = await this.$refs.FinancingLiu.submitCheck();
						res = { ...res, ...{ auditChainAndOperator } };
					} catch (e) {
						auditChainAndOperator = e;
					}
					if (!auditChainAndOperator) {
						reject('审批流程缺少参数');
						return;
					}
					resolve(res);
				});
			});
		}
	}
};
</script>

<style lang="less" scoped>
.slTitleAssis {
	margin-bottom: 20px;
}
.slFormDetail {
	padding: 0;
	margin: 0;
}
.ant-col {
	min-height: 82px;
}
.ant-form-item {
	width: 364px;
	margin-bottom: 0;
}

.tip-item {
	display: inline-flex;
	align-items: center;
	&.calculate {
		width: 354px;
		justify-content: space-between;
	}
}
.cur {
	cursor: pointer;
	margin-left: 5px;
	vertical-align: middle;
}
</style>
