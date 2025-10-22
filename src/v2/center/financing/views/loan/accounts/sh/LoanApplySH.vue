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
			<div class="mainList">
				<a-row
					type="flex"
					:gutter="[93, 20]"
				>
					<a-col flex="400px">
						<div class="item item1">
							<p class="title">放款金额</p>
							<p class="num">¥{{ formatMoney(fangkuanData.finAmount) }}</p>
						</div>
					</a-col>
					<a-col flex="400px">
						<div class="item item2">
							<p class="title">已还本金</p>
							<p class="num">¥{{ formatMoney(fangkuanData.totalRepayAmount) }}</p>
						</div>
					</a-col>
					<a-col flex="400px">
						<div class="item item3">
							<p class="title">未还本金</p>
							<p class="num">¥{{ formatMoney(fangkuanData.unPayPrincipal) }}</p>
						</div>
					</a-col>
				</a-row>
			</div>
			<a-form
				:form="applyForm"
				:colon="false"
				class="slFormDetail"
			>
				<a-row>
					<a-col
						:span="8"
						class="row"
					>
						<a-form-item label="本次还款本金(元)">
							<a-input
								disabled
								prefix="￥"
								:value="fangkuanData.finAmount"
							/>
						</a-form-item>
					</a-col>
					<a-col
						:span="24"
						class="row"
					>
						<p class="mustText">说明：上海银行利息已经在放款时扣除，还款后会正式结算利息金额。</p>
					</a-col>
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
import { API_GetLoanDetail, API_RepayAutoRepay } from '@/v2/center/financing/api/index.js';

export default {
	name: 'LoanApplySH',
	data() {
		return {
			formatMoney,
			applyForm: this.$form.createForm(this),
			numberReg: /^(\d+)(\.\d{1,2})?$/,
			fangkuanDataSource: [],
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
		sumbitApply() {
			this.applyForm.validateFields(error => {
				if (error) return;
				this.$confirm({
					centered: true,
					title: '确定提交吗?',
					okText: '确定',
					cancelText: '取消',
					onOk: () => {
						API_RepayAutoRepay({ loanId: this.loanId }).then(res => {
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
			API_GetLoanDetail({ loanId: this.loanId }).then(res => {
				if (res.success) {
					this.fangkuanData = res.data;
					this.fangkuanDataSource = res.data.repayList || [];
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
		padding: 20px 0;
		.item {
			width: 100%;
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
	.butSub {
		margin-top: 30px;
		text-align: center;
		button {
			padding: 0 30px;
		}
	}
}
</style>
