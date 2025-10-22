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
			<div class="slTitleAssis">放款信息</div>
			<div class="mainList mainList333">
				<div class="item item1">
					<p class="title">融资金额</p>
					<p class="num">¥{{ formatMoney(fangkuanData.applyAmount) }}</p>
				</div>
				<div class="item item2">
					<p class="title">放款金额</p>
					<p class="num">¥{{ formatMoney(fangkuanData.finAmount) }}</p>
				</div>
				<div class="item item3">
					<p class="title">融资放款日</p>
					<p class="num">{{ fangkuanData.loanDate }}</p>
				</div>
				<div class="item item1">
					<p class="title">融资到期日</p>
					<p class="num">{{ fangkuanData.endDate }}</p>
				</div>
			</div>
			<a-descriptions
				bordered
				:column="3"
				size="middle"
			>
				<a-descriptions-item label="融资编号">
					{{ fangkuanData.financingApplySerialNo }}
				</a-descriptions-item>
				<a-descriptions-item label="出资机构">
					{{ fangkuanData.bankName }}
				</a-descriptions-item>
				<a-descriptions-item label="融资方">
					{{ fangkuanData.financier }}
				</a-descriptions-item>
				<a-descriptions-item label="融资利率"> {{ fangkuanData.rate }}% </a-descriptions-item>
				<a-descriptions-item label="逾期利率"> {{ fangkuanData.overdueRate }}% </a-descriptions-item>
				<a-descriptions-item label="放款类型">
					{{ fangkuanData.loanTypeText }}
				</a-descriptions-item>
			</a-descriptions>

			<template v-if="fangkuanData.assetBillVO">
				<div class="slTitleAssis">融单信息</div>
				<a-descriptions
					bordered
					:column="3"
					size="middle"
				>
					<a-descriptions-item label="融单编号">
						{{ fangkuanData.assetBillVO.bankBillNo }}
					</a-descriptions-item>
					<a-descriptions-item label="融单金额">
						<span style="color: #f46332">¥{{ formatMoney(fangkuanData.assetBillVO.billAmount) }}</span>
					</a-descriptions-item>
					<a-descriptions-item label="开立方">
						{{ fangkuanData.assetBillVO.issuerName }}
					</a-descriptions-item>
					<a-descriptions-item label="接收方">
						{{ fangkuanData.assetBillVO.receiverName }}
					</a-descriptions-item>
					<a-descriptions-item label="开立日期">
						{{ fangkuanData.assetBillVO.issueDate }}
					</a-descriptions-item>
					<a-descriptions-item label="承诺付款日">
						{{ fangkuanData.assetBillVO.acceptanceDate }}
					</a-descriptions-item>
					<a-descriptions-item label="贴现日期">
						{{ fangkuanData.assetBillVO.discountedDate }}
					</a-descriptions-item>
				</a-descriptions>
			</template>
			<div class="slTitleAssis">还款信息</div>
			<div class="mainList mainList280">
				<div class="item item1">
					<p class="title">到期合计金额</p>
					<p class="num">¥{{ formatMoney(fangkuanData.dueTotalAmount) }}</p>
				</div>
				<div class="item item2">
					<p class="title">已还款合计金额</p>
					<p class="num">¥{{ formatMoney(fangkuanData.totalRepayAmount) }}</p>
				</div>
				<div class="item item3">
					<p class="title">本次还款本金</p>
					<p class="num">¥{{ formatMoney(fangkuanData.thisPrincipal) }}</p>
				</div>
				<div class="item item2">
					<p class="title">本次还款利息</p>
					<p class="num">¥{{ formatMoney(fangkuanData.interest) }}</p>
				</div>
				<div class="item item1">
					<p class="title">本次还款总额</p>
					<p class="num">¥{{ formatMoney(fangkuanData.thisRepayAmount) }}</p>
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
						>提交</a-button
					>
				</div>
			</a-form>
		</a-card>
	</div>
</template>

<script>
import { formatMoney } from '@sub/filters';
import Breadcrumb from '@/v2/components/breadcrumb/index';
import { API_GetAdvanceLoanDetail, API_LoanAdvanceApplySave } from '@/v2/center/financing/api/index.js';
import moment from 'moment';
import { getPopupContainer } from '@/untils/factory.js';

export default {
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
		disabledDate(value) {
			// 时间限制在承诺付款日期(包含)之后
			var start = moment(this.fangkuanData.assetBillVO.acceptanceDate).valueOf() > value;
			// var end = moment(this.fangkuanData.endDate).add(1,'d').valueOf() < value
			return start;
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
						var repayDate = this.applyForm.getFieldValue('repayDate').format('YYYY-MM-DD');
						API_LoanAdvanceApplySave({
							loanId: this.loanId,
							repayDate: repayDate,
							amount: this.fangkuanData.thisPrincipal
						}).then(res => {
							if (res.data) {
								this.$message.success('还款申请成功');
								this.$router.back();
							}
						});
					},
					onCancel() {}
				});
			});
		},
		getDetail() {
			API_GetAdvanceLoanDetail({ loanId: this.loanId }).then(res => {
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
				background: rgba(255, 249, 233, 1);
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
@media screen and (min-width: 1808px) {
	.slMain {
		.mainList280 {
			.item {
				flex: 0 0 280px;
			}
		}
	}
}
</style>
