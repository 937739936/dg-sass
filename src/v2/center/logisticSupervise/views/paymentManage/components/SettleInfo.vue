<template>
	<div>
		<div class="slTitleAssis">选择结算单</div>
		<a-table
			:columns="columns"
			class="new-table"
			:bordered="false"
			:dataSource="settleList"
			:pagination="false"
			rowKey="id"
			:rowSelection="rowSelection"
		>
			<template
				slot="statusDesc"
				slot-scope="text, record"
			>
				<div :class="`status-tag status-${record.status}`">{{ text || '-' }}</div>
			</template>
			<template
				slot="serialNo"
				slot-scope="text, record"
			>
				<a @click="jumpPage(record)">{{ text }}</a>
			</template>
		</a-table>
		<a-space
			v-if="settelTotal.total"
			:size="20"
			class="totalRow"
		>
			<span
				>结算单数量<em>{{ settelTotal.total }}</em></span
			>
			<span
				>已结算数量<em>{{ settelTotal.settelQuantityTotal | formatMoney(2) }}</em
				>&nbsp;吨</span
			>
			<span
				>已结算金额<em>{{ settelTotal.settleAmountTotal | formatMoney(2) }}</em
				>&nbsp;元</span
			>
		</a-space>
	</div>
</template>

<script>
import _ from 'lodash';
import { formatMoney } from '@sub/filters';
import { API_PaymentCreateStatement } from '@/v2/center/trade/api/pay';
const columns = [
	{
		title: '结算单编号',
		dataIndex: 'serialNo',
		scopedSlots: {
			customRender: 'serialNo'
		}
	},
	{ title: '结算金额(元)', dataIndex: 'settleAmount', customRender: (t) => formatMoney(t)  },
	{ title: '结算数量(吨)', dataIndex: 'settleQuantity' , customRender: (t) => formatMoney(t) },
	{ title: '结算单价(元/吨)', dataIndex: 'settleUnitPrice', customRender: (t) => formatMoney(t)  },
	{ title: '结算日期', dataIndex: 'confirmTime' },
	{
		title: '状态',
		dataIndex: 'statusDesc',
		scopedSlots: {
			customRender: 'statusDesc'
		}
	}
];

export default {
	data() {
		return {
			columns,
			formatMoney,
			settleList: [],
			selectedRowKeys: [],
			selectedRows: [],
			settelTotal: {
				total: 0,
				settelQuantityTotal: 0,
				settleAmountTotal: 0,
				trainNumTotal: 0
			},
			contractType: ''
		};
	},
	watch: {
		selectedRows: function () {
			this.computedTotal();
		}
	},
	computed: {
		rowSelection() {
			return {
				type: 'checkbox',
				selectedRowKeys: this.selectedRows.map(i => i.id),
				onSelect: (record, selected, selectedRows) => {
					if (selected) {
						// eslint-disable-next-line vue/no-side-effects-in-computed-properties
						this.selectedRows = _.uniqBy([...this.selectedRows, ...selectedRows], 'id');
					} else {
						// eslint-disable-next-line vue/no-side-effects-in-computed-properties
						this.selectedRows = this.selectedRows.filter(o => o.id != record.id);
					}
				},
				onSelectAll: (selected, selectedRows) => {
					if (selected) {
						// eslint-disable-next-line vue/no-side-effects-in-computed-properties
						this.selectedRows = _.uniqBy([...this.selectedRows, ...selectedRows], 'id');
					} else {
						// eslint-disable-next-line vue/no-side-effects-in-computed-properties
						this.selectedRows = [];
					}
				}
			};
		}
	},
	mounted() {},
	methods: {
		async init() {
			const res = await API_PaymentCreateStatement({
				serialNo: this.$route.query.serialNo,
				contractType: this.$route.query.contractType
			});
			if (!res.success) return;
			this.settleList = res.data || [];
		},
		async edit(statementVOList) {
			await this.init();
			this.selectedRows = statementVOList;
		},
		computedTotal() {
			this.settelTotal.total = this.selectedRows.length;
			if (!this.selectedRows.length) return;
			this.settelTotal.settelQuantityTotal = this.selectedRows.reduce((pre, cur) => {
				return pre + (Number(cur.settleQuantity) || 0);
			}, 0);
			this.settelTotal.settleAmountTotal = this.selectedRows.reduce((pre, cur) => {
				return pre + (Number(cur.settleAmount) || 0);
			}, 0);
		},
		jumpPage(record) {
			const contractType = this.$route.query.contractType.toLowerCase();
			const path =
				this.$route.query.contractType === 'TRANSPORT'
					? `/center/settle/transport/detail`
					: `/center/settle/buy/${contractType}detail`;
			const { href } = this.$router.resolve({
				path: path,
				query: {
					id: record.id,
					statementId: record.id
				}
			});
			window.open(href, '_blank');
		},
		save(type) {
			this.selectedRowKeys = this.selectedRows.map(i => i.id);
			if (type === 'save') {
				return this.selectedRowKeys;
			}
			if (this.settleList.length) {
				if (!this.selectedRowKeys.length) {
					this.$message.error('请选择结算单');
					return false;
				} else {
					return this.selectedRowKeys;
				}
			} else {
				this.$message.error('当前合同缺少有效的结算单，无法进行结算付款');
				return false;
			}
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less" scoped>
.slTitleAssis {
	margin-top: 50px;
	margin-bottom: 20px;
}
.new-table {
	margin-top: 10px;
	::v-deep.ant-empty-image::after {
		content: '当前合同缺少有效的结算单，无法进行结算付款';
		display: flex;
		justify-content: center;
	}
	::v-deep.ant-empty-normal {
		.ant-empty-description {
			display: none;
		}
	}
}
.totalRow {
	display: flex;
	justify-content: flex-end;
	margin-top: 20px;
	span {
		display: inline-block;
		font-size: 14px;
		font-weight: 400;
		line-height: 26px;
		text-align: left;
		color: rgba(119, 136, 157, 1);
		display: inline-block;
		em {
			display: inline-block;
			margin-left: 10px;
			font-style: normal;
			font-family: D-DIN-PRO;
			font-size: 18px;
			font-weight: 500;
			line-height: 26px;
			text-align: left;
			color: rgba(244, 99, 50, 1);
		}
	}
}
.status-tag {
	display: inline-block;
	padding: 0 6px;
	height: 20px;
	border-radius: 4px;
	font-size: 12px;
	line-height: 20px;
	background: #c1d7ff;
	color: #4682f3;
	//待确认
	&.status-RECEIVER_CONFIRM {
		background: #c9daff;
		color: #596fa0;
	}
	//审批中
	&.status-WAIT_ORIGINATOR_INNER_AUDITING {
		background: #ffdbc8;
		color: #ff7937;
	}
	//待签约
	&.status-NEW {
		background: #f8dde8;
		color: #db81a5;
	}
	//已签约
	&.status-EFFECTIVE {
		background: #c5ecdd;
		color: #3eb384;
	}
	//已作废
	&.status-INVALID,
	&.status-ORIGINATOR_CANCEL,
	&.status-RECEIVER_CANCEL {
		background: #e0e0e0;
		color: #a8a8a8;
	}
	//退回
	&.status-FREEZING {
		background: #d2dfea;
		color: #7590b9;
	}
	//驳回
	&.status-ORIGINATOR_INNER_REJECT {
		background: #f2d0d0;
		color: #dd4444;
	}
	//待确认-线下
	&.status-WAI_CONFIRM {
		background: #c9daff;
		color: #596fa0;
	}
	//驳回-线下
	&.status-REJECT {
		background: #f2d0d0;
		color: #dd4444;
	}
}
</style>
