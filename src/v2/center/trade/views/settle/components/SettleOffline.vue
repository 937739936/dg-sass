<template>
	<a-form
		:form="form"
		:colon="false"
		class="slFormDetail"
	>
		<a-row>
			<a-col :span="8">
				<a-form-item label="结算单号">
					<a-input
						placeholder="请输入结算单号"
						:maxLength="50"
						:disabled="disabledFlg"
						v-decorator="['serialNo', { rules: [{ validator: statementTime }] }]"
					/>
				</a-form-item>
			</a-col>
			<a-col :span="8">
				<a-row
					type="flex"
					justify="center"
				>
					<a-form-item label="结算日期">
						<a-date-picker
							placeholder="请选择结算日期"
							valueFormat="YYYY-MM-DD"
							:disabled-date="disabledDate"
							:getPopupContainer="getPopupContainer"
							style="width: 100%"
							:disabled="disabledFlg"
							v-decorator="[
								'statementTime',
								{
									rules: [{ required: true, message: '请选择结算日期' }]
								}
							]"
						>
							<span
								slot="suffixIcon"
								class="calendar"
							></span>
						</a-date-picker>
					</a-form-item>
				</a-row>
			</a-col>
			<a-col :span="8">
				<a-row
					type="flex"
					justify="end"
				>
					<a-form-item label="供货周期">
						<a-range-picker
							:placeholder="['供货开始日期', '供货终止日期']"
							valueFormat="YYYY-MM-DD"
							:getPopupContainer="getPopupContainer"
							style="width: 100%"
							:disabled="disabledFlg"
							v-decorator="[
								'date',
								{
									rules: [{ required: true, message: '请选择供货周期' }]
								}
							]"
						>
							<span
								slot="suffixIcon"
								class="calendar"
							></span>
						</a-range-picker>
					</a-form-item>
				</a-row>
			</a-col>
			<a-col :span="8">
				<a-form-item label="结算金额(元)">
					<a-input-number
						placeholder="请输入结算金额(元)"
						:disabled="disabledFlg"
						v-decorator="[
							'settleAmount',
							{
								rules: [
									{ required: true, message: '请输入结算金额' },
									{
										validator: (rule, value, callback) =>
											validateLeftFieldsError(value, callback, {
												length: 2
											})
									}
								]
							}
						]"
						:min="0.01"
						:max="9999999999"
					/>
				</a-form-item>
			</a-col>
			<a-col :span="8">
				<a-row
					type="flex"
					justify="center"
				>
					<a-form-item label="结算数量(吨)">
						<a-input-number
							placeholder="请输入结算数量(吨)"
							:disabled="disabledFlg"
							v-decorator="[
								'settleQuantity',
								{
									rules: [
										{ required: true, message: '请输入结算数量' },
										{
											validator: (rule, value, callback) =>
												validateLeftFieldsError(value, callback, {
													length: 4
												})
										}
									]
								}
							]"
							:min="0.0001"
							:max="99999999"
						/>
					</a-form-item>
				</a-row>
			</a-col>
			<a-col :span="8">
				<a-row
					type="flex"
					justify="end"
				>
					<a-form-item>
						<span slot="label">
							结算单价(元/吨)
							<a-tooltip>
								<template slot="title"> 结算单价 = 结算金额/结算数量 </template>
								<a-icon type="question-circle" />
							</a-tooltip>
						</span>
						<a-input
							placeholder="-"
							disabled
							v-decorator="[
								'settleUnitPrice',
								{
									rules: [{ required: true, message: '' }]
								}
							]"
						/>
					</a-form-item>
				</a-row>
			</a-col>
			<a-col :span="8">
				<a-form-item label="签章状态">
					<a-select
						placeholder="请选择签章状态"
						v-decorator="[
							`signStatus`,
							{
								rules: [
									{ required: true, message: `签章状态必填` },
								]
							}
						]"
					>
						<a-select-option value="SINGLE_SIGN">单签</a-select-option>
						<a-select-option value="DOUBLE_SIGN">双签</a-select-option>
					</a-select>
				</a-form-item>
			</a-col>
		</a-row>
		<a-row
			type="flex"
			justify="space-between"
		>
			<a-col span="16">
				<a-form-item label="备注" style="width: 728px;">
					<a-textarea
						placeholder="请输入备注"
						:maxLength="200"
						:autoSize="{ minRows: 2 }"
						v-decorator="['remark']"
					/>
				</a-form-item>
			</a-col>
		</a-row>
	</a-form>
</template>
<script>
import moment from 'moment';
import { API_JudgeStatementDate } from '@/v2/center/trade/api/settle';
import { getPopupContainer, myFixed } from '@/v2/utils/factory.js';
export default {
	props: {
		//合同信息，主要用来控制时间选择
		contractInfo: {
			type: Object,
			default: () => {
				return {};
			}
		}
	},
	components: {},
	data() {
		return {
			form: this.$form.createForm(this, {
				onValuesChange: this.onValuesChange
			})
		};
	},
	watch: {},
	computed: {
		disabledFlg() {
			return this.$route.query.type === 'edit'
		}
	},
	async created() {},
	async mounted() {},
	methods: {
		getPopupContainer,
		initFormData(data) {
			this.$nextTick(() => {
				this.form.setFieldsValue({
					serialNo: data?.serialNo,
					statementTime: data?.statementTime,
					date: [data?.execDateStart, data?.execDateEnd],
					settleAmount: data?.settleAmount,
					settleQuantity: data?.settleQuantity,
					settleUnitPrice: data?.settleUnitPrice,
					signStatus: data?.signStatus,
					remark: data?.remark
				});
			});
		},
		//不可选结算日期
		disabledDate(current) {
			// 合同签订日期之前时间不可选
			return current < moment(this.contractInfo.contractSignTime).endOf('day');
		},
		//本次结算值交易规则
		validateLeftFieldsError(value, callback, item) {
			if (this.isNull(value)) {
				callback();
			} else {
				if (value.toString()?.split('.')[1]?.length > item.length) {
					callback(`小数点后最多${item.length}位数字`);
					return;
				}
				callback();
			}
		},
		isNull(val) {
			if (val === 0) return false;
			if (!val) return true;
			return false;
		},
		//表单值变化
		onValuesChange(props, values) {
			this.$nextTick(() => {
				//如果结算日期修改
				if (values.hasOwnProperty('statementTime')) {
					if (this.$route.query.type === 'edit') return
					let val = values.statementTime;
					//当修改结算日期与当前系统日期偏差大于30天时，提示
					if (Math.abs(moment(val).diff(moment(), 'days')) > 30) {
						this.$message.warning('结算日期与当前日期偏差较多，如果实际如此，请忽略提示');
						//如果有值,对结算单号做校验
						if (val) {
							this.form.validateFields(['statementTime'], () => {});
						}
					}
				}
				//修改供货周期
				if (values.hasOwnProperty('date')) {
					if (this.$route.query.type === 'edit') return
					let val = values.date;
					//当选择签订日期与当前系统日期偏差大于30天时，提示
					if (Math.abs(moment(val[0]).diff(moment(), 'days')) > 30) {
						this.$message.warning('交货期限与当前日期偏差较多，如果实际如此，请忽略提示');
					}
					if (moment(val[1]).diff(moment(val[0]), 'days') > 60) {
						this.$message.warning('交货期限过长，如果实际如此，请忽略提示');
					}
				}
				//如果是结算金额或结算数量修改，计算结算单价
				if (values.hasOwnProperty('settleAmount') || values.hasOwnProperty('settleQuantity')) {
					if (this.$route.query.type === 'edit') return
					let settleAmount = this.form.getFieldValue('settleAmount');
					let settleQuantity = this.form.getFieldValue('settleQuantity');
					let settleUnitPrice = '';
					if (settleAmount && settleQuantity) {
						settleUnitPrice = myFixed(settleAmount / settleQuantity, 2);
					}
					this.form.setFieldsValue({ settleUnitPrice });
				}
			});
			//值变化，返回时阻止
			this.selectChange();
		},
		//结算日期校验
		statementTime(rule, value, callback) {
			let statementTime = this.form.getFieldValue('statementTime'),
				serialNo = value,
				contractId = this.contractInfo.id;
			//contractId合同ID，statementTime结算日期，serialNo结算单号，statementId结算单ID
			if (contractId && statementTime && serialNo) {
				API_JudgeStatementDate({
					contractId,
					statementTime,
					serialNo
				}).then(res => {
					if (res.success && res.data) {
						callback('该合同已存在此结算日期的结算单');
					} else {
						callback();
					}
				});
			} else {
				callback();
			}
		},
		//表单值发生了变化
		selectChange() {
			if (this.$listeners.selectChange) {
				this.$emit('selectChange');
			}
		},
		//表单校验
		validateFields() {
			return new Promise(resolve => {
				// 因存在不定必填项，force重新校验所有字段
				this.form.validateFieldsAndScroll({ force: true }, (error, values) => {
					if (!error) {
						let params = {
							supplyDateStart: values.date[0],
							supplyDateEnd: values.date[1]
						};
						delete values.date;
						params = {
							...params,
							...values
						};
						resolve(params);
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
	.ant-form-item {
		width: 364px;
	}
</style>
