<template>
	<div>
		<div class="slTitleAssis">预付账款信息</div>
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
								<span>预付账款金额（元）</span>
								<a-tooltip>
									<template slot="title">
										<span>本次预付款金额</span>
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
								placeholder="请输入应付账款金额"
								@change="amountChanged"
								:disabled="!detailData.receivalVO.amountModifiable"
								v-decorator="[
									`amount`,
									{
										validateTrigger: ['blur'],
										rules: [
											{ required: true, message: `预付账款金额必填` },
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
						<a-form-item>
							<div
								slot="label"
								class="tip-item"
							>
								<div>
									<span>拟融资金额（元）</span>
									<a-tooltip>
										<template slot="title">
											<span>预付账款金额</span>
										</template>
										<a-icon
											class="cur"
											type="exclamation-circle"
											style="color: #c3c3c3"
										/>
									</a-tooltip>
								</div>
							</div>
							<a-input
								disabled
								v-model="planFinancingAmount"
							>
							</a-input>
						</a-form-item>
					</a-row>
				</a-col>
				<a-col :span="8">
					<a-row
						type="flex"
						justify="end"
					>
						<a-form-item label="预付账款类型">
							<a-select
								showSearch
								:filterOption="false"
								:defaultActiveFirstOption="false"
								placeholder="请选择应预账款类型"
								v-decorator="[
									`type`,
									{
										rules: [{ required: true, message: `预付账款类型必选` }]
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
			</a-row>
			<a-row>
				<a-col :span="8">
					<a-row
						type="flex"
						justify="start"
					>
						<a-form-item label="开立日期">
							<a-date-picker
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
						<a-form-item label="承诺付款日">
							<a-date-picker
								:disabled-date="disabledDate"
								placeholder="请选择承诺付款日"
								value-format="YYYY-MM-DD"
								format="YYYY-MM-DD"
								v-decorator="[
									`promisePayDate`,
									{
										rules: [{ required: true, message: `承诺付款日必填` }],
										validateTrigger: 'change'
									}
								]"
							></a-date-picker>
						</a-form-item>
					</a-row>
				</a-col>
			</a-row>
		</a-form>
		<AssetsFinancingLiu
			ref="FinancingLiu"
			bizType="ASSET_RECEIVABLE"
			:data="detailData.auditChainAndOperator"
		/>
	</div>
</template>

<script>
import moment from 'moment';
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
			planFinancingAmount: 0, //拟融资金额
			currentBeginDate: undefined
		};
	},
	watch: {
		detailData: {
			immediate: true,
			handler(val) {
				if (!val) return;
				let receivalVO = val.receivalVO;
				let { type, amount, planFinancingAmount, beginDate, promisePayDate } = receivalVO;
				this.planFinancingAmount = planFinancingAmount;
				let values = {
					type,
					amount,
					planFinancingAmount,
					beginDate,
					promisePayDate
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
	inject: {
		isNeedNextChangeParent: { form: 'isNeedNextChangeParent', default: null }
	},
	mounted() {},
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
			let beginDate = this.paymentForm.getFieldValue('beginDate');

			if (beginDate) {
				return current && current <= moment(beginDate).endOf('day');
			}
			return false;
		},
		amountChanged(e) {
			this.planFinancingAmount = e;
		},
		// 提交
		onSubmit() {
			return new Promise((resolve, reject) => {
				this.paymentForm.validateFieldsAndScroll(async (error, value) => {
					if (error) {
						reject('预付账款信息缺少参数');
						return;
					}
					let { amount, type, beginDate, promisePayDate } = value;
					let res = { amount, type, beginDate, promisePayDate, planFinancingAmount: this.planFinancingAmount };
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
}
.cur {
	cursor: pointer;
	margin-left: 5px;
	vertical-align: middle;
}
</style>
