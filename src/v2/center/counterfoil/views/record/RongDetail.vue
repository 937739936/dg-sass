<template>
	<div class="slMain">
		<Breadcrumb />
		<a-card :bordered="false">
			<div class="methods-wrap">
				<span class="slTitle">票据详情</span>
			</div>
			<div class="rz-content">
				<div class="slTitleAssis">票据开立信息</div>
				<a-row>
					<a-col
						:span="12"
						class="row"
					>
						<a-form-item label="票据号">
							{{ detailData.serialNo }}
						</a-form-item>
						<a-form-item label="票据金额（元）">
							{{ detailData.billAmount }}
						</a-form-item>
						<a-form-item label="票据开立方">
							{{ detailData.issuerName }}
						</a-form-item>
						<a-form-item label="开立日期">
							<div style="max-width: 400px">
								{{ detailData.issueDate }}
							</div>
						</a-form-item>
						<a-form-item label="票据生成时间">
							{{ detailData.updateDate }}
						</a-form-item>
					</a-col>
					<a-col
						:span="12"
						class="row"
					>
						<a-form-item label="票据类型">
							{{ detailData.billTypeDesc }}
						</a-form-item>
						<a-form-item label="单据号">
							{{ detailData.bankBillNo }}
						</a-form-item>
						<a-form-item label="票据接收方">
							{{ detailData.receiverName }}
						</a-form-item>
						<a-form-item label="承诺付款日">
							{{ detailData.acceptanceDate }}
						</a-form-item>
						<a-form-item label="备注">
							{{ detailData.remark }}
						</a-form-item>
					</a-col>
				</a-row>
			</div>
			<div class="rz-content">
				<div class="slTitleAssis">票据流转信息</div>
				<a-row>
					<a-table
						class="new-table"
						:pagination="false"
						:columns="liuzhuanColumn"
						:data-source="liuzhuanDataSource"
						:scroll="{ x: true }"
						rowKey="id"
					></a-table>
				</a-row>
			</div>
			<div class="rz-content">
				<div class="slTitleAssis">票据贴现信息</div>
				<a-row>
					<a-table
						class="new-table"
						:pagination="false"
						:columns="tiexianColumn"
						:data-source="tiexianDataSource"
						:scroll="{ x: true }"
						rowKey="id"
					></a-table>
				</a-row>
			</div>
			<div class="rz-content">
				<div class="slTitleAssis">票据还款信息</div>
				<a-row>
					<a-table
						class="new-table"
						:pagination="false"
						:columns="fangkuanColumn"
						:data-source="fangkuanDataSource"
						:scroll="{ x: true }"
						rowKey="id"
					></a-table>
				</a-row>
			</div>
		</a-card>
	</div>
</template>

<script>
import Breadcrumb from '@/v2/components/breadcrumb/index';
import { API_CounterfoilDetail } from '@/v2/center/counterfoil/api/index.js';

export default {
	data() {
		return {
			liuzhuanDataSource: [],
			tiexianDataSource: [],
			fangkuanDataSource: [],
			detailData: {},
			liuzhuanColumn: [
				{
					title: '流转编号',
					dataIndex: 'channelNo'
				},
				{
					title: '流转金额',
					dataIndex: 'amount'
				},
				{
					title: '流转方',
					dataIndex: 'transferName'
				},
				{
					title: '接收方',
					dataIndex: 'receiverName'
				},
				{
					title: '流转发起时间',
					dataIndex: 'transferDate'
				}
			],
			tiexianColumn: [
				{
					title: '贴现编号',
					dataIndex: 'channelNo'
				},
				{
					title: '贴现金额',
					dataIndex: 'amount'
				},
				{
					title: '贴现方',
					dataIndex: 'discountedName'
				},
				{
					title: '贴现金融机构',
					dataIndex: 'bankName'
				},
				{
					title: '贴现发起时间',
					dataIndex: 'discountedDate'
				},
				{
					title: '利息',
					dataIndex: 'interest'
				}
			],
			fangkuanColumn: [
				{
					title: '还款时间',
					dataIndex: 'repayDate'
				},
				{
					title: '还款总额',
					dataIndex: 'repayAmount'
				},
				{
					title: '还款本金',
					dataIndex: 'repayPrincipal'
				},
				{
					title: '还款利息',
					dataIndex: 'repayInterest'
				},
				{
					title: '还款发起方',
					dataIndex: 'financier'
				},
				{
					title: '收款方',
					dataIndex: 'bankName'
				}
			]
		};
	},
	components: {
		Breadcrumb
	},
	computed: {},
	mounted() {
		this.getDetail();
	},
	methods: {
		getDetail() {
			API_CounterfoilDetail({
				id: this.$route.query.id
			}).then(res => {
				if (res.success) {
					this.detailData = res.data.assetBillVO || {};
					this.liuzhuanDataSource = res.data.assetBillTransferVOList || [];
					this.tiexianDataSource = res.data.assetBillDiscountedVOList || [];
					this.fangkuanDataSource = res.data.financingRepayVO || [];
				}
			});
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less" scoped>
.slMain {
	.slTitleAssis {
		margin: 30px 0;
	}
}
.downbtn {
	margin-bottom: 14px;
}
.ant-tabs-bar {
	background-color: #fff;
	margin-bottom: 0;
	border: none;
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

.rz-content {
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
</style>
