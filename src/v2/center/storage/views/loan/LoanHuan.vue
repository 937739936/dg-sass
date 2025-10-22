<template>
	<div class="slMain mt-10 LoanHuan">
		<a-card :bordered="false">
			<div class="methods-wrap">
				<span
					slot="title"
					class="slTitle"
					>还款登记</span
				>
			</div>
			<div class="rz-content">
				<div class="title">合同信息</div>
				<a-row>
					<a-col
						:span="12"
						class="row"
					>
						<a-form-item label="合同编号">{{ financingData.contractNo }}</a-form-item>
						<a-form-item label="买方企业">{{ financingData.buyerName }}</a-form-item>
						<a-form-item label="合同签订日期">{{ financingData.contractSignDate }}</a-form-item>
					</a-col>
					<a-col
						:span="12"
						class="row"
					>
						<a-form-item label="卖方企业">{{ financingData.sellerName }}</a-form-item>
						<a-form-item label="合同期限"
							>{{ financingData.contractBeginDate }} ~ {{ financingData.contractEndDate }}</a-form-item
						>
					</a-col>
				</a-row>
			</div>
			<div class="rz-content">
				<div class="title">放款信息</div>
				<a-row>
					<a-col
						:span="12"
						class="row"
					>
						<a-form-item label="放款编号">{{ financingData.serialNo }}</a-form-item>
						<a-form-item label="放款日期">{{ financingData.loanDate }}</a-form-item>
					</a-col>
					<a-col
						:span="12"
						class="row"
					>
						<a-form-item label="放款金额（元）">{{ financingData.finAmount }}</a-form-item>
						<a-form-item label="到期日">{{ financingData.endDate }}</a-form-item>
					</a-col>
				</a-row>
			</div>
			<div class="rz-content">
				<div class="title">还款登记</div>
				<a-form :form="applyForm">
					<a-row>
						<a-col
							:span="12"
							class="row"
						>
							<a-form-item label="还款日期">
								<a-date-picker
									:getCalendarContainer="getPopupContainer"
									:disabled-date="disabledDate"
									v-decorator="[
										`repayDate`,
										{
											rules: [{ required: true, message: `请选择还款日期` }],
											validateTrigger: 'change'
										}
									]"
								></a-date-picker>
							</a-form-item>
						</a-col>
						<a-col
							:span="12"
							class="row"
						>
							<a-form-item label="还款本金（元）">
								<a-input
									placeholder="请输入还款本金"
									v-decorator="[
										`principal`,
										{
											rules: [
												{ required: true, message: `还款本金必填` },
												{ pattern: numberReg, message: '请输入数字，最多两位小数' }
											],
											validateTrigger: 'change'
										}
									]"
								/>
							</a-form-item>
						</a-col>
						<a-col
							:span="12"
							class="row"
						>
							<a-form-item label="还款利息（元）">
								<a-input
									placeholder="请输入还款利息"
									v-decorator="[
										`repayInterest`,
										{
											rules: [
												{ required: true, message: `还款利息必填` },
												{ pattern: numberReg, message: '请输入数字，最多两位小数' }
											],
											validateTrigger: 'change'
										}
									]"
							/></a-form-item>
						</a-col>
						<a-col
							:span="12"
							class="row"
						>
							<a-form-item label="还款总额（元）">
								{{ accAdd(applyForm.getFieldValue('repayInterest') || 0, applyForm.getFieldValue('principal') || 0) }}
							</a-form-item>
						</a-col>
					</a-row>
					<div style="text-align: center; margin-top: 30px">
						<a-button
							type="primary"
							ghost
							@click="$router.back()"
							style="margin-right: 30px"
							>返回</a-button
						>
						<a-button
							type="primary"
							@click="save"
							>提交</a-button
						>
					</div>
				</a-form>
			</div>
		</a-card>
	</div>
</template>

<script>
import num from '@/v2/utils/num';
import { API_GrainFinancingRepayRegister, API_GrainGetLoanHuanDetail } from '@/v2/center/storage/api';
import moment from 'moment';
import { getPopupContainer } from '@/v2/utils/factory';

export default {
	name: 'LoanHuanHn',
	data() {
		return {
			getPopupContainer,
			applyForm: this.$form.createForm(this),
			accAdd: num.accAdd,
			numberReg: /^(\d+)(\.\d{1,2})?$/,
			financingData: {},
			huanfix: '' // 本次还款利息
		};
	},
	components: {},
	computed: {},
	mounted() {
		this.loanId = this.$route.query.id || 'xx';
		this.getLoanHuanDetail();
	},

	methods: {
		getLoanHuanDetail() {
			API_GrainGetLoanHuanDetail({ loanId: this.loanId }).then(res => {
				if (res.success) {
					this.financingData = res.data;
				}
			});
		},
		disabledDate(value) {
			// 还款日期不能早于放款日期
			var start = moment(this.financingData.loanDate).valueOf() > value;
			return start;
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
						var repayDate = this.applyForm.getFieldValue('repayDate').format('YYYY-MM-DD');
						API_GrainFinancingRepayRegister({
							...values,
							loanId: this.loanId,
							repayDate: repayDate
						}).then(res => {
							if (res.data) {
								this.$message.success('还款登记成功');
								this.$router.back();
							}
						});
					}
					// onCancel() {}
				});
			});
		}
	}
};
</script>

<style lang="less" scoped>
.LoanHuan {
	.red-color {
		color: red;
	}
	.title-content {
		height: 55px;
		background-color: #fff;
		padding-top: 16px;
		padding-left: 20px;
		border-bottom: 1px solid rgb(238, 240, 242);
	}
	.ant-form-item {
		display: flex;
		margin-bottom: 15px;
	}
	form .ant-form-item:not(.ant-form-item-with-help) {
		margin-bottom: 24px;
	}
	form .ant-form-item.ant-form-item-with-help {
		margin-bottom: 5px;
	}
	background-color: #f4f5f8;
	.rz-content {
		padding: 20px 0;
		background-color: #fff;
		margin-bottom: 10px;
	}

	.title {
		font-size: 15px;
		padding: 14px 0;
	}
	.ant-form-item-control {
		input,
		textarea {
			width: 254px;
		}
	}
	.textarea-wrap {
		textarea {
			width: 720px;
			text-align: left !important;
		}
	}
	.ant-form-item-label {
		label {
			font-size: 14px;
			color: rgba(0, 0, 0, 0.75);
			width: 120px;
			margin-right: 15px;
			display: inline-block;
			text-align: right;
		}
	}
}
</style>
