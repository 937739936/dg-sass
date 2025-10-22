<template>
	<div class="LoanApply">
		<div class="title-content">
			<div
				class="s-card-title"
				style="position: relative; margin-left: 0; margin-top: 0"
			>
				<span>还款申请详情</span>
			</div>
		</div>
		<div class="rz-content">
			<div class="title">审核信息</div>
			<a-row>
				<a-table
					rowKey="id"
					:columns="auditColumn"
					:dataSource="auditLogDataSource"
					:pagination="false"
					:defaultExpandAllRows="true"
					:locale="{ emptyText: '暂无数据' }"
				>
				</a-table>
			</a-row>
		</div>

		<div class="rz-content">
			<div class="title">放款信息</div>
			<a-row>
				<a-col
					:span="12"
					class="row"
				>
					<a-form-item label="融资编号">
						{{ fangkuanData.financingApplySerialNo }}
					</a-form-item>
					<a-form-item label="融资方">
						{{ fangkuanData.financier }}
					</a-form-item>
					<a-form-item label="融资利率（%）">
						{{ fangkuanData.rate }}
					</a-form-item>
					<a-form-item label="融资金额（元）">
						{{ fangkuanData.applyAmount }}
					</a-form-item>
					<a-form-item label="融资放款日期">
						{{ fangkuanData.loanDate }}
					</a-form-item>
				</a-col>
				<a-col
					:span="12"
					class="row"
				>
					<a-form-item label="出资机构">
						{{ fangkuanData.bankName }}
					</a-form-item>
					<a-form-item label="放款类型">
						{{ fangkuanData.loanTypeText }}
					</a-form-item>
					<a-form-item label="逾期利率（%）">
						{{ fangkuanData.overdueRate }}
					</a-form-item>
					<a-form-item label="放款金额（元）">
						{{ fangkuanData.finAmount }}
					</a-form-item>
					<a-form-item label="融资到期日期">
						{{ fangkuanData.endDate }}
					</a-form-item>
				</a-col>
			</a-row>
		</div>
		<div
			class="rz-content"
			v-if="fangkuanData.assetBillVO"
		>
			<div class="title">融单信息</div>
			<a-row>
				<a-col
					:span="12"
					class="row"
				>
					<a-form-item label="融单编号">
						{{ fangkuanData.assetBillVO.bankBillNo }}
					</a-form-item>
					<a-form-item label="开立方">
						{{ fangkuanData.assetBillVO.issuerName }}
					</a-form-item>
					<a-form-item label="开立日期">
						{{ fangkuanData.assetBillVO.issueDate }}
					</a-form-item>
					<a-form-item label="贴现日期">
						{{ fangkuanData.assetBillVO.discountedDate }}
					</a-form-item>
				</a-col>
				<a-col
					:span="12"
					class="row"
				>
					<a-form-item label="融单金额（元）">
						{{ fangkuanData.assetBillVO.billAmount }}
					</a-form-item>
					<a-form-item label="接收方">
						{{ fangkuanData.assetBillVO.receiverName }}
					</a-form-item>
					<a-form-item label="承诺付款日">
						{{ fangkuanData.assetBillVO.acceptanceDate }}
					</a-form-item>
				</a-col>
			</a-row>
		</div>
		<div class="rz-content">
			<div class="title">还款申请信息</div>
			<a-form :form="applyForm">
				<a-row>
					<a-col
						:span="12"
						class="row"
					>
						<a-form-item label="到期合计金额（元）">
							{{ fangkuanData.dueTotalAmount }}
						</a-form-item>

						<a-form-item label="还款日期">
							{{ fangkuanData.repayDate || '-' }}
						</a-form-item>
						<a-form-item label="本次还款利息（元）">
							{{ fangkuanData.interest || '-' }}
						</a-form-item>
					</a-col>

					<a-col
						:span="12"
						class="row"
					>
						<a-form-item label="已还款合计金额（元）">
							{{ fangkuanData.totalRepayAmount }}
						</a-form-item>
						<a-form-item label="本次还款本金（元）">
							{{ fangkuanData.thisPrincipal || '-' }}
						</a-form-item>
						<a-form-item label="本次还款总额（元）">
							{{ fangkuanData.thisRepayAmount || '-' }}
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
				</div>
			</a-form>
		</div>
	</div>
</template>

<script>
import { API_GetAdvanceLoanDetail } from '@/v2/center/financing/api/index.js';
import { getPopupContainer } from '@/untils/factory.js';

export default {
	data() {
		return {
			getPopupContainer,
			applyForm: this.$form.createForm(this),
			numberReg: /^(\d+)(\.\d{1,2})?$/,
			fangkuanData: {},
			huanfix: '', // 本次还款利息
			auditLogDataSource: [],

			auditColumn: [
				{
					title: '序号',
					dataIndex: '',
					key: 'rowIndex',
					width: 60,
					align: 'center',
					customRender: function (t, r, index) {
						return parseInt(index) + 1;
					}
				},
				{
					title: '操作内容',
					dataIndex: 'serialNo'
				},
				{
					title: '操作人',
					dataIndex: 'xxx'
				},
				{
					title: '操作时间',
					dataIndex: 'repayDate'
				},
				{
					title: '结果',
					dataIndex: 'repayAmount'
				},
				{
					title: '审核意见',
					dataIndex: 'repayPrincipal'
				}
			]
		};
	},
	components: {},
	computed: {},
	mounted() {
		this.loanId = this.$route.query.id || 'xx';
		this.getDetail();
	},
	methods: {
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
.LoanApply {
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

	margin: -20px;
	background-color: #f4f5f8;
	.rz-content {
		padding: 20px;
		background-color: #fff;
		margin-bottom: 10px;
	}

	.title {
		font-size: 15px;
		padding: 14px 0;
		margin-bottom: 30px;
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
