<template>
	<div class="slMain">
		<Breadcrumb />
		<a-card :bordered="false">
			<div
				class="methods-wrap"
				slot="title"
			>
				<span class="slTitle">还款申请</span>
			</div>
			<div class="slTitleAssis">融资信息</div>
			<a-descriptions
				bordered
				:column="3"
				size="middle"
			>
				<a-descriptions-item label="融资编号">
					{{ fangkuanData.financingApplySerialNo || '-' }}
				</a-descriptions-item>
				<a-descriptions-item label="拟融资金额">
					<span style="color: #f46332"> ¥{{ formatMoney(fangkuanData.planFinancingAmount) }} </span>
				</a-descriptions-item>
				<a-descriptions-item label="放款金额">
					<span style="color: #f46332"> ¥{{ formatMoney(fangkuanData.finAmount) }} </span>
				</a-descriptions-item>
				<a-descriptions-item label="融资方">
					{{ fangkuanData.financier || '-' }}
				</a-descriptions-item>
				<a-descriptions-item label="融资利率"> {{ fangkuanData.rate || '-' }}% </a-descriptions-item>
				<a-descriptions-item label="逾期利率"> {{ fangkuanData.overdueRate || '-' }}% </a-descriptions-item>
				<a-descriptions-item label="出资机构">
					{{ fangkuanData.bankName || '-' }}
				</a-descriptions-item>
				<a-descriptions-item label="融资起息日">
					{{ fangkuanData.beginDate || '-' }}
				</a-descriptions-item>
				<a-descriptions-item label="融资到期日">
					{{ fangkuanData.endDate || '-' }}
				</a-descriptions-item>
				<a-descriptions-item label="应收账款流水号">
					{{ fangkuanData.receivableSerialNo || '-' }}
				</a-descriptions-item>
			</a-descriptions>
			<div class="slTitleAssis">还款信息</div>
			<div class="mainList mainList333">
				<div class="item item1">
					<p class="title">到期合计金额</p>
					<p class="num">¥{{ formatMoney(fangkuanData.dueTotalAmount) }}</p>
				</div>
				<div class="item item2">
					<p class="title">已还款合计金额</p>
					<p class="num">¥{{ formatMoney(fangkuanData.totalRepayAmount) }}</p>
				</div>
				<div class="item item3">
					<p class="title">本次还款利息</p>
					<p class="num">¥{{ formatMoney(fangkuanData.forwardCharge == 1 ? 0 : huanfix || '-') }}</p>
				</div>
				<div class="item item4">
					<p class="title">本次还款总额</p>
					<p class="num">
						¥{{ formatMoney(huanfix ? accAdd(Number(huanfix), Number(applyForm.getFieldValue('amount'))) : '-') }}
					</p>
				</div>
			</div>
			<a-form
				:form="applyForm"
				:colon="false"
				class="slFormDetail"
			>
				<a-row>
					<a-col :span="8">
						<a-form-item label="还款日期">
							<a-date-picker
								:getCalendarContainer="getPopupContainer"
								:disabled-date="disabledDate"
								@change="repayDateChange"
								:allowClear="false"
								v-decorator="[
									`repayDate`,
									{
										rules: [{ required: true, message: `还款日期` }],
										validateTrigger: 'change'
									}
								]"
							></a-date-picker>
						</a-form-item>
					</a-col>

					<a-col :span="8">
						<a-form-item label="本次还款本金（元）">
							<a-input
								v-inputTip
								prefix="￥"
								placeholder="请输入本次还款本金"
								@change="amountChange"
								v-decorator="[
									`amount`,
									{
										rules: [
											{ required: true, message: `本次还款本金必填` },
											{ pattern: numberReg, message: '请输入数字，最多两位小数' }
										],
										validateTrigger: 'change'
									}
								]"
							/>
						</a-form-item>
					</a-col>
				</a-row>
				<div class="butSub">
					<a-button
						type="primary"
						ghost
						@click="$router.back()"
						style="margin-right: 30px"
						>返回</a-button
					>
					<a-button
						type="primary"
						@click="sumbitApply"
						v-debounceclick
						>提交</a-button
					>
				</div>
			</a-form>
		</a-card>
	</div>
</template>

<script>
import { formatMoney } from '@sub/filters';
import { API_GetLoanDetail, API_LoanApplySave } from '@/v2/center/financing/api/index.js';
import moment from 'moment';
import Breadcrumb from '@/v2/components/breadcrumb/index';
import { getPopupContainer } from '@/untils/factory.js';

export default {
	name: 'LoanApply',
	data() {
		return {
			getPopupContainer,
			formatMoney,
			applyForm: this.$form.createForm(this),
			numberReg: /^(\d+)(\.\d{1,2})?$/,
			fangkuanData: {},
			huanfix: '' // 本次还款利息
		};
	},
	components: { Breadcrumb },
	computed: {},
	mounted() {
		this.loanId = this.$route.query.id || 'xx';
		this.getDetail();
	},
	methods: {
		amountChange(e) {
			var v = e.target.value;
			let repayDate = this.applyForm.getFieldValue('repayDate');

			this.calchuanfix(repayDate, v);
		},
		repayDateChange(e) {
			this.calchuanfix(e?.format('YYYY-MM-DD'), this.applyForm.getFieldValue('amount'));
		},
		accAdd(arg1, arg2) {
			var r1, r2, m;
			try {
				r1 = arg1.toString().split('.')[1].length;
			} catch (e) {
				r1 = 0;
			}
			try {
				r2 = arg2.toString().split('.')[1].length;
			} catch (e) {
				r2 = 0;
			}
			m = Math.pow(10, Math.max(r1, r2));
			return (arg1 * m + arg2 * m) / m;
		},

		calchuanfix(repayDate, amount) {
			var a = moment(repayDate);
			var b = moment(this.fangkuanData.beginDate);
			var count = a.diff(b, 'd');

			if (this.numberReg.test(amount) && count > 0) {
				//本次还款利息 = 本次还款本金*(融资利率/360)*(付款日期-起息日)
				let val = Number(amount) * (this.fangkuanData.rate / 100 / 360) * count;
				this.huanfix = Number(val).toFixed(2);
			}
		},

		disabledDate(value) {
			// 时间限制在融资起息日和融资到期日之间
			let start = moment(this.fangkuanData.beginDate).valueOf() > value;
			let end = moment(this.fangkuanData.endDate).add(1, 'd') <= value;
			return end || start;
		},
		sumbitApply() {
			this.applyForm.validateFields(error => {
				if (error) return;
				this.$confirm({
					centered: true,
					title: '确定提交吗?',
					okText: '确定',
					cancelText: '取消',
					onOk: () => {
						var repayDate = this.applyForm.getFieldValue('repayDate')?.format('YYYY-MM-DD');
						API_LoanApplySave({ loanId: this.loanId, repayDate: repayDate, amount: this.applyForm.getFieldValue('amount') }).then(
							res => {
								if (res.data) {
									this.$message.success('还款申请成功');
									this.$router.back();
								}
							}
						);
					},
					onCancel() {}
				});
			});
		},
		getDetail() {
			API_GetLoanDetail({ loanId: this.loanId }).then(res => {
				if (res.success) {
					this.fangkuanData = res.data;
				}
			});
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
	.mainList {
		padding: 20px 0 0;
		margin: -10px;
		display: flex;
		justify-content: space-between;
		.item {
			margin: 10px;
			flex: 1;
			height: 88px;
			border-radius: 6px;
			padding: 14px 12px;
			.title {
				font-family: PingFang SC;
				font-size: 14px;
				font-weight: 400;
				line-height: 20px;
				letter-spacing: 0px;
				text-align: left;
				color: rgba(0, 0, 0, 0.4);
				margin-bottom: 12px;
			}
			.num {
				font-family: PingFang SC;
				font-size: 20px;
				font-weight: 500;
				line-height: 28px;
				letter-spacing: 0px;
				text-align: left;
				color: rgba(0, 0, 0, 0.8);
			}
			&.item1 {
				background: #f0f8ff;
			}
			&.item2 {
				background: rgba(255, 249, 240, 1);
			}
			&.item3 {
				background: rgba(235, 250, 239, 1);
			}
			&.item4 {
				background: rgba(240, 248, 255, 1);
				.num {
					color: rgba(27, 117, 223, 1);
				}
			}
		}
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

	@media screen and (min-width: 1720px) {
		.slMain {
			.mainList333 {
				.item {
					flex: 0 0 333px;
				}
			}
		}
	}
}
</style>
