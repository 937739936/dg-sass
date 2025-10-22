<template>
	<div class="slMain mt-10 LoanFang">
		<a-card :bordered="false">
			<div class="methods-wrap">
				<span
					slot="title"
					class="slTitle"
					>放款登记</span
				>
			</div>
			<div style="margin: 30px auto; width: 80%">
				<a-steps
					:current="current"
					class="steps-tool"
				>
					<a-step
						v-for="item in steps"
						:key="item.title"
						:title="item.title"
					/>
				</a-steps>
			</div>
			<div v-if="current == 1">
				<div class="rz-content">
					<div class="title">合同信息</div>
					<a-row>
						<a-col
							:span="12"
							class="row"
						>
							<a-form-item label="合同编号">{{ financingData.contractNo }}</a-form-item>
							<a-form-item label="买方企业">{{ financingData.buyerName }}</a-form-item>
							<a-form-item label="合同签订日期">{{ financingData.signTime }}</a-form-item>
						</a-col>
						<a-col
							:span="12"
							class="row"
						>
							<a-form-item label="卖方企业">{{ financingData.sellerName }}</a-form-item>
							<a-form-item label="合同期限"
								>{{ financingData.contractStartDate }} ~ {{ financingData.contractEndDate }}</a-form-item
							>
						</a-col>
					</a-row>
				</div>
				<div class="rz-content">
					<div class="title">放款信息</div>
					<a-form :form="applyForm">
						<a-row>
							<a-col
								:span="12"
								class="row"
							>
								<a-form-item label="放款金额">
									<a-input
										placeholder="请输入放款金额"
										v-decorator="[
											`finAmount`,
											{
												rules: [
													{ required: true, message: `放款金额必填` },
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

								<a-form-item label="放款日期">
									<a-date-picker
										:getCalendarContainer="getPopupContainer"
										v-decorator="[
											`loanDate`,
											{
												rules: [{ required: true, message: `请选择放款日期` }],
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
								<a-form-item label="到期日">
									<a-date-picker
										:getCalendarContainer="getPopupContainer"
										format="YYYY-MM-DD"
										v-decorator="[
											`endDate`,
											{
												rules: [{ required: true, message: `请选择到期日` }],
												validateTrigger: 'change'
											}
										]"
									></a-date-picker>
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
			</div>
			<div v-if="current == 2">
				<div class="shenhe-icon"></div>
				<p class="shenheing-text">操作完成</p>
				<div class="shenhe-content">
					<a-button
						class="return-company"
						@click="$router.push('/center/storageCenter/loan/loanList')"
						>返回放还款管理</a-button
					>
				</div>
			</div>
		</a-card>
	</div>
</template>

<script>
import { API_GrainFinancingOrderDetail, API_GrainFinancingLoanRegister } from '@/v2/center/storage/api';
import { getPopupContainer } from '@/v2/utils/factory';

export default {
	name: 'LoanFang',
	data() {
		return {
			getPopupContainer,
			applyForm: this.$form.createForm(this),
			numberReg: /^(\d+)(\.\d{1,2})?$/,
			financingData: {},
			current: 1,
			steps: [
				{
					title: '选择合同'
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
	components: {},
	computed: {},
	mounted() {
		this.loanId = this.$route.query.id || 'xx';
		this.getFinancingDetail();
	},
	methods: {
		getFinancingDetail() {
			API_GrainFinancingOrderDetail({ id: this.loanId }).then(res => {
				if (res.success) {
					this.financingData = res.data;
				}
			});
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
						let loanDate = values.loanDate.format('YYYY-MM-DD');
						if (!(new Date(endDate) >= new Date(loanDate))) {
							this.$message.error('到期日不能早于放款日期');
							return;
						}
						// debugger
						API_GrainFinancingLoanRegister({
							contractNo: this.financingData.contractNo,
							buyerUscc: this.financingData.buyerUscc,
							buyerName: this.financingData.buyerName,
							sellerUscc: this.financingData.sellerUscc,
							sellerName: this.financingData.sellerName,
							contractSignDate: this.financingData.signTime,
							contractBeginDate: this.financingData.contractStartDate,
							contractEndDate: this.financingData.contractEndDate,
							finAmount: values.finAmount,
							loanDate: loanDate,
							endDate: endDate
						}).then(res => {
							if (res.data) {
								this.current = 2;
							}
						});
					}
					// onCancel() {}
				});
			});
		},

		validator(rule, value, callback) {
			value = Number(value);
			var planFinancingAmount = Number(this.financingData.planFinancingAmount);
			if (value < (1 / 10) * planFinancingAmount || value > planFinancingAmount) {
				callback(true);
			}
			callback();
		}
	}
};
</script>

<style lang="less" scoped>
.LoanFang {
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

	background-color: #fff;
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

	.shenhe-icon {
		width: 100px;
		height: 100px;
		background-size: cover;
		margin: 0 auto;
		margin-top: 80px;
		background-image: url('~@/v2/assets/imgs/common/success-icon.png');
	}
	.shenheing-text {
		text-align: center;
		margin-top: 25px;
		font-family: PingFangSC-Regular;
		font-size: 16px;
		color: #383a3f;
	}

	.shenhe-content {
		text-align: center;
		margin-top: 30px;
	}
}
</style>
