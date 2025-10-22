<template>
	<div class="sub-table-container">
		<div class="table-box">
			<a-table
				:columns="columns"
				class="new-table"
				:bordered="false"
				rowKey="id"
				:dataSource="dataSource"
				:pagination="false"
				:loading="loading"
				:scroll="{ x: true }"
			>
				<template slot="customTitle2">
					<span>开具金额(元) </span>
					<a-tooltip>
						<template slot="title"> 不含税 </template>
						<a-icon type="question-circle" style="font-size: 12px" />
					</a-tooltip>
				</template>
				<template slot="fileUrl" slot-scope="text, items">
					<a href="javascript:;" v-if="items.fileName" @click="handlePreview(items)">{{items.fileName}}</a>
				</template>
				<template slot="action" slot-scope="text,items">
					<a href="javascript:;" @click="goInvoiceDetail(items)">详情</a>
				</template>
			</a-table>
		</div>
	</div>
</template>

<script>
import { formatMoney } from '@sub/filters';
export default {
	name: 'FreightInvoiceTable',
	inject: ['platformType'],
	props: {
		title: {
			type: String,
			default: ''
		},
		// 数据源
		dataSource: {
			type: Array,
			default: () => []
		}
	},
	components: {},
	data() {
		return {
			loading: false,
			columns:commonColumns,
		};
	},
	mounted() {
		this.columns=[]
		let list = [...commonColumns]
		if (this.platformType === 'ADMIN') {
			list.push({ title: '操作', dataIndex: 'action', scopedSlots: { customRender: 'action' }, fixed: 'right' })
		}
		this.columns = list
	},
	computed: {

	},
	methods: {
		// 预览附件
		handlePreview(item) {
      this.$emit('handlePreview', item.fileUrl)
    },
		// 发票详情
		goInvoiceDetail(item) {
			let path = `/biz/invoice/detail?id=${item.id}&invoiceType=2&industryType=COAL`
			window.open(path, '_blank')
		}
	}
};

// 数据为空时，显示的表头
const customRender = text => text || '-';
const commonColumns = [
	{ title: '发票代码', dataIndex: 'code', customRender },
	{ title: '发票号码', dataIndex: 'no', customRender },
	{ title: '开票日期', dataIndex: 'issuedDate', customRender },
	// 开具金额
	{ dataIndex: 'taxExcludedAmount', slots: { title: 'customTitle2' }, customRender },
	{ title: '价税合计(元)', dataIndex: 'totalAmount', customRender: t => formatMoney(t) },
	{
		title: '是否包含印花税',
		dataIndex: 'stampTaxFlag',
		customRender: text => {
			return text == 1 ? '否' : '是';
		}
	},
	{
		title: '印花税税额(元)',
		dataIndex: 'stampTaxFlagAmount',
		customRender: text => {
			return `￥${formatMoney(+text)}`;
		}
	},
	{
		title: '含印花税合计(元)',
		dataIndex: 'stampTaxFlagTotalAmount',
		customRender: text => {
			return `￥${formatMoney(+text)}`;
		}
	},
	{ title: '拆分到本合同金额(元)', dataIndex: 'currentContractSplitedAmount', customRender: t => formatMoney(t) },
	{ title: '发票附件', dataIndex: 'fileUrl', scopedSlots: { customRender: 'fileUrl' } },
	{ title: '发票状态', dataIndex: 'stateName' },
];
</script>

<style lang="less" scoped>
@import url('~@sub/style/table-cover.less');
</style>
<style lang="less" scoped>
.sub-table-container {
	width: 100%;
	.slTitleAssis {
		margin-top: 4px;
	}
	/deep/ .ant-table {
		td,
		th {
			white-space: nowrap;
			// text-overflow: ellipsis;
			// overflow: hidden;
		}
	}
	.table-box {
		margin-top: 0px;
	}
}
</style>