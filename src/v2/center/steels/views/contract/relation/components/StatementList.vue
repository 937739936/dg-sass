<template>
	<div>
		<a-tabs default-active-key="0">
			<a-tab-pane
				key="0"
				tab="预结算单"
			>
				<div style="width: 100%">
					<p
						class="mb8"
						v-if="true"
					>
						<span class="mr16"> 预结算单数量：{{ statisticsShipment.count }} </span>
						<span class="mr16"> 已结算数量：{{ statisticsShipment.quantitySum }} 吨 </span>
						<span class="mr16"> 已结算金额：{{ statisticsShipment.amountSum }}元 </span>
					</p>
					<a-table
						:pagination="false"
						:columns="yjsColumns"
						:data-source="shipmentList"
						rowKey="id"
						:scroll="{ x: true }"
					>
						<div
							slot="action"
							slot-scope="text, record"
						>
							<a @click="open(record.pdfPath)">附件</a>
						</div>
					</a-table>
				</div>
			</a-tab-pane>
			<a-tab-pane
				key="1"
				tab="结算单"
			>
				<div style="width: 100%">
					<p
						class="mb8"
						v-if="true"
					>
						<span class="mr16"> 结算单数量：{{ goodsTransfer.count }} </span>
						<span class="mr16"> 已结算数量：{{ goodsTransfer.quantitySum }}吨 </span>
						<span class="mr16"> 已结算金额：{{ goodsTransfer.amountSum }}元 </span>
					</p>
					<a-table
						:pagination="false"
						:columns="jsColumns"
						:data-source="goodsTransferList"
						rowKey="id"
						:scroll="{ x: true }"
					>
						<div
							slot="action"
							slot-scope="text, record"
						>
							<a @click="open(record.pdfPath)">附件</a>
						</div>
					</a-table>
				</div>
			</a-tab-pane>
		</a-tabs>
	</div>
</template>

<script>
const columns = [
	{
		title: '结算日期',
		dataIndex: 'settleTime'
	},
	{
		title: '结算数量(吨)',
		dataIndex: 'quantity'
	},
	{
		title: '结算金额(元)',
		dataIndex: 'amount',
		scopedSlots: {
			customRender: 'amount'
		}
	},
	{
		title: '状态',
		dataIndex: 'status'
	},

	{ title: '附件', fixed: 'right', scopedSlots: { customRender: 'action' } }
];

export default {
	name: 'StatementList',
	data() {
		return {
			yjsColumns: [],
			jsColumns: [],
			invoiceStatisticsData: {},
			tradeInvoiceList: [],
			freightInvoiceList: [],
			statisticsShipment: {},
			goodsTransfer: {},
			shipmentList: [],
			goodsTransferList: []
		};
	},
	props: ['contractData'],
	watch: {
		contractData: function (data) {
			this.statisticsShipment = this.contractData.preStatement ? this.contractData.preStatement : {};
			this.shipmentList = this.contractData.preStatement ? this.contractData.preStatement.statementList : [];

			this.goodsTransfer = this.contractData.statement ? this.contractData.statement : {};
			this.goodsTransferList = this.contractData.statement ? this.contractData.statement.statementList : [];
		}
	},
	created() {
		this.yjsColumns = [
			{
				title: '预结算单编号',
				dataIndex: 'statementNo'
			},
			...columns
		];
		this.jsColumns = [
			{
				title: '结算单编号',
				dataIndex: 'statementNo'
			},
			...columns
		];

		this.statisticsShipment = this.contractData.preStatement ? this.contractData.preStatement : {};
		this.shipmentList = this.contractData.preStatement ? this.contractData.preStatement.statementList : [];

		this.goodsTransfer = this.contractData.statement ? this.contractData.statement : {};
		this.goodsTransferList = this.contractData.statement ? this.contractData.statement.statementList : [];
	},
	methods: {
		jumpPage(path, query) {
			const { href } = this.$router.resolve({
				path,
				query
			});
			window.open(href);
		},
		open(url) {
			window.open(`${url}`, '_blank');
		}
	}
};
</script>

<style lang="less" scoped>
.ant-table-tbody {
	td {
		div > a {
			display: inline-blok;
			margin-right: 8px;
		}
		div > a:last-child {
			margin-right: 0;
		}
	}
}
.tab-title {
	font-size: 16px;
	font-weight: bold;
	border-bottom: 1px solid #efefef;
	margin-bottom: 20px;
	padding-bottom: 6px;
}
</style>
