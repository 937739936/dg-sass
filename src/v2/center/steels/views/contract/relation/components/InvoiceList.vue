<template>
	<div>
		<p class="tab-title">发票信息</p>
		<p
			class="mb8"
			v-if="invoiceStatisticsData"
		>
			<span class="mr16"> 发票数量：{{ invoiceStatisticsData.invoiceCount }} </span>
			<span class="mr16"> 归属本合同发票总额：{{ invoiceStatisticsData.invoiceTotalAmount }}元 </span>
		</p>
		<a-tabs default-active-key="0">
			<a-tab-pane
				key="0"
				tab="贸易发票"
			>
				<div style="width: 100%">
					<a-table
						:pagination="false"
						:columns="tradeInvoiceColumns"
						:data-source="tradeInvoiceList"
						rowKey="id"
						:scroll="{ x: true }"
					>
						<div
							slot="action"
							slot-scope="record"
						>
							<a
								@click="
									jumpPage('/center/steels/invoice/' + (record.invoiceForm === 'BUYER_INVOICE' ? 'buy' : 'sell') + 'detail', {
										id: record.id,
										type: 'detail',
										title: '贸易发票'
									})
								"
								>查看</a
							>
						</div>
					</a-table>
				</div>
			</a-tab-pane>
			<a-tab-pane
				key="1"
				tab="运费发票"
			>
				<div style="width: 100%">
					<a-table
						:pagination="false"
						:columns="freightInvoiceColumns"
						:data-source="freightInvoiceList"
						rowKey="id"
						:scroll="{ x: true }"
					>
						<div
							slot="action"
							slot-scope="record"
						>
							<a
								@click="
									jumpPage('/center/steels/invoice/freightdetail', {
										id: record.id,
										type: 'detail',
										title: '运费发票'
									})
								"
								>查看</a
							>
						</div>
					</a-table>
				</div>
			</a-tab-pane>
		</a-tabs>
	</div>
</template>

<script>
const columns = [
	{ title: '发票类型', dataIndex: 'invoiceTypeDesc' },
	{ title: '发票代码', dataIndex: 'code' },
	{ title: '发票号码', dataIndex: 'no' },
	{ title: '卖方名称', dataIndex: 'sellerName' },
	{ title: '买方名称', dataIndex: 'buyerName' },
	{ title: '开票日期', dataIndex: 'issuedDate' },
	{ title: '不含税金额(元)', dataIndex: 'taxExcludedAmount' },
	{ title: '税额(元)', dataIndex: 'taxAmount', align: 'center' },
	{ title: '价税合计(元)', dataIndex: 'totalAmount', customRender: text => text && text.toLocaleString() }
];

export default {
	name: 'InvoiceList',
	data() {
		return {
			tradeInvoiceColumns: [],
			freightInvoiceColumns: [],
			invoiceStatisticsData: {},
			tradeInvoiceList: [],
			freightInvoiceList: []
		};
	},
	props: ['contractData'],
	watch: {
		contractData: function (data) {
			this.invoiceStatisticsData = data.invoiceInfo.invoiceStatistics;
			this.tradeInvoiceList = data.invoiceInfo.tradeInvoiceList;
			this.freightInvoiceList = data.invoiceInfo.freightInvoiceList;
		}
	},
	created() {
		this.tradeInvoiceColumns = [
			...columns,
			{ title: '拆分到本合同金额(元)', dataIndex: 'splitAmount' },
			{ title: '发票状态', dataIndex: 'statusDesc' },
			{ title: '操作', key: 'action', fixed: 'right', slots: { title: 'customTitle' }, scopedSlots: { customRender: 'action' } }
		];
		this.freightInvoiceColumns = [
			...columns,
			{ title: '是否包含印花税(元)', dataIndex: 'stampTaxFlagDesc', align: 'center' },
			{ title: '印花税税额(元)', dataIndex: 'stampTaxFlagAmount', align: 'center' },
			{ title: '含印花税合计(元)', align: 'center', dataIndex: 'stampTaxFlagTotalAmount' },
			{ title: '发票状态', dataIndex: 'statusDesc' },
			{ title: '操作', key: 'action', fixed: 'right', slots: { title: 'customTitle' }, scopedSlots: { customRender: 'action' } }
		];
		this.invoiceStatisticsData = this.contractData.invoiceInfo ? this.contractData.invoiceInfo.invoiceStatistics : {};
		this.tradeInvoiceList = this.contractData.invoiceInfo ? this.contractData.invoiceInfo.tradeInvoiceList : [];
		this.freightInvoiceList = this.contractData.invoiceInfo ? this.contractData.invoiceInfo.freightInvoiceList : [];
	},
	methods: {
		jumpPage(path, query) {
			const { href } = this.$router.resolve({
				path,
				query
			});
			window.open(href);
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
