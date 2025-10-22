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
				<template
					slot="action"
					slot-scope="text, items"
				>
					<a-space :size="20">
						<a
							href="javascript:;"
							@click="goFundDetail(items)"
							>详情</a
						>
					</a-space>
				</template>
			</a-table>
		</div>
	</div>
</template>

<script>
import { formatMoney } from '@sub/filters';
export default {
	name: 'FundTable',
	inject: ['platformType'],
	props: {
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
			// columns: columns
		};
	},
	mounted() {
		
	},
	computed: {
		columns() {
			let list = columns;
			if (this.platformType === 'REST') {
				list = list.filter(item => item.dataIndex !== 'payTypeName' && item.dataIndex !== 'action');
			}
			return list;
		}
	},
	methods: {
		goFundDetail(item) {
			// 退款
			if(item.paymentType == 'REFUND') {
				path = `/sys/refund/detail?id=${item.id}`
				window.open(path, '_blank')
				return
			}
			if (item.existRiskContractAudit) {
				const routeData = this.$router.resolve({
					path: '/assets/PaymentAuditFinal',
					query: {
							paymentNo:item.serialNo,
							isEdit:0,
							id: item.id,
							contractSource: item.contractSource,
						}
				});
				window.open(routeData.href, '_blank');
			} else {
				let path = '/sys/payment/detail'
				if(item.contractSource == 'LOGISTICS_CONTRACT_MANUAL') {
					path = '/sys/payment/transDetail'
				}
				const routeData = this.$router.resolve({
					path: path,
					query: {
						id: item.id,
						contractTemplateName: item.contractTemplateName
					}
				});
				window.open(routeData.href, '_blank');
			}
		}
	}
};

// 数据为空时，显示的表头
const customRender = text => text || '-';
const columns = [
	{ title: '资金流水号', dataIndex: 'serialNo', customRender },
	{ title: '付款类型', dataIndex: 'paymentTypeDesc', customRender },
	{ title: '资金来源', dataIndex: 'payTypeName', customRender },
	{
		title: '付款金额(元)',
		dataIndex: 'payAmount',
		customRender: (txt, r) => (r.paymentType == 'REFUND' ? formatMoney(-txt) : formatMoney(txt))
	},
	{ title: '付款日期', dataIndex: 'payDate', customRender },
	{ title: '付款状态', dataIndex: 'statusName', customRender },
	{ title: '操作', dataIndex: 'action', scopedSlots: { customRender: 'action' }, fixed: 'right' }
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
	.status {
		display: inline-block;
		border-radius: 4px;
		background: #c5ecdd;
		padding: 1px 6px;
		color: #3eb384;
		font-family: PingFang SC;
		font-size: 12px;
	}
}
</style>