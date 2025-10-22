<template>
	<div class="slMain">
		<Breadcrumb />
		<a-card :bordered="false">
			<div
				class="methods-wrap"
				slot="title"
			>
				<span class="slTitle">还款申请详情</span>
			</div>
			<div class="slTitleAssis">审核信息</div>
			<a-table
				rowKey="id"
				class="new-table"
				style="margin-top: 30px"
				:columns="auditColumn"
				:dataSource="auditLogDataSource"
				:pagination="false"
				:defaultExpandAllRows="true"
				:locale="{ emptyText: '暂无数据' }"
			>
			</a-table>
			<div class="slTitleAssis">融资信息</div>
			<a-descriptions
				bordered
				:column="3"
				size="middle"
			>
				<a-descriptions-item label="融资编号">
					{{ fangkuanData.financingSerialNo }}
				</a-descriptions-item>
				<a-descriptions-item label="融资方">
					{{ fangkuanData.financier }}
				</a-descriptions-item>
				<a-descriptions-item label="出资机构">
					{{ fangkuanData.bankName }}
				</a-descriptions-item>
				<a-descriptions-item label="应收账款流水号">
					{{ fangkuanData.receivableSerialNo }}
				</a-descriptions-item>
				<a-descriptions-item label="拟融资金额">
					<span style="color: #f46332">¥{{ formatMoney(fangkuanData.planFinancingAmount) }}</span>
				</a-descriptions-item>
				<a-descriptions-item label="放款金额">
					<span style="color: #f46332">¥{{ formatMoney(fangkuanData.finAmount) }}</span>
				</a-descriptions-item>
				<a-descriptions-item label="融资利率"> {{ fangkuanData.rate }}% </a-descriptions-item>
				<a-descriptions-item label="逾期利率"> {{ fangkuanData.overdueRate }}% </a-descriptions-item>
				<a-descriptions-item label="融资起息日">
					{{ fangkuanData.beginDate }}
				</a-descriptions-item>
				<a-descriptions-item label="融资到期日">
					{{ fangkuanData.endDate }}
				</a-descriptions-item>
			</a-descriptions>
			<div class="slTitleAssis">还款申请信息</div>
			<a-descriptions
				bordered
				:column="3"
				size="middle"
			>
				<a-descriptions-item label="本次还款本金">
					<span style="color: #f46332">¥{{ formatMoney(fangkuanData.repayPrincipal) }} </span>
				</a-descriptions-item>
				<a-descriptions-item label="还款日期">
					{{ fangkuanData.repayDate }}
				</a-descriptions-item>
				<a-descriptions-item label="收款方账号">
					{{ fangkuanData.receiveAccNo }}
				</a-descriptions-item>
				<a-descriptions-item label="未还本金"
					><span style="color: #f46332">¥{{ formatMoney(fangkuanData.unPayPrincipal) }} </span>
				</a-descriptions-item>
				<a-descriptions-item
					label="收款方开户行"
					style="margin-top: 40px"
				>
					{{ fangkuanData.receiveAccBank }}
				</a-descriptions-item>
				<a-descriptions-item
					label="收款方开户名"
					style="margin-top: 40px"
				>
					{{ fangkuanData.receiveAccName }}
				</a-descriptions-item>
			</a-descriptions>
			<div class="butSub">
				<a-button
					type="primary"
					ghost
					@click="$router.back()"
					style="margin-right: 30px"
					>返回</a-button
				>
			</div>
		</a-card>
	</div>
</template>

<script>
import { formatMoney } from '@sub/filters';
import { API_GetLoanApplyDetail } from '@/v2/center/financing/api/index.js';
import { getPopupContainer } from '@/untils/factory.js';
import Breadcrumb from '@/v2/components/breadcrumb/index';

export default {
	name: 'LoanApplyDetail',
	data() {
		return {
			getPopupContainer,
			formatMoney,
			auditLogDataSource: [],
			fangkuanData: {},
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
					dataIndex: 'auditTypeText'
				},
				{
					title: '操作人',
					dataIndex: 'auditerName',
					customRender: function (t, r) {
						let s = r.auditerCompany ? '+' + r.auditerCompany : '';
						return (r.auditerName || '') + s;
					}
				},
				{
					title: '操作时间',
					dataIndex: 'auditTime'
				},
				{
					title: '结果',
					dataIndex: 'auditResultText'
				},
				{
					title: '审核意见',
					dataIndex: 'auditOpinion'
				}
			]
		};
	},
	components: { Breadcrumb },
	computed: {},
	mounted() {
		this.loanId = this.$route.query.id || 'xx';
		this.getDetail();
	},
	methods: {
		getDetail() {
			API_GetLoanApplyDetail({ loanId: this.loanId }).then(res => {
				if (res.success) {
					this.fangkuanData = res.data;
					this.auditLogDataSource = res.data.auditList || [];
				}
			});
		}
	}
};
</script>

<style lang="less" scoped>
@import url('~@sub/style/table-cover.less');
</style>
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
