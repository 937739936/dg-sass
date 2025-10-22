<template>
	<div>
		<div class="sub-title">额度细分</div>
		<ul
			class="grid-wrap"
			style="padding: 0; margin-bottom: 30px"
		>
			<li>
				<span class="label"> 是否额度细分 </span>
				<span>
					{{ data.subdivideCreditLine ? '是' : '否' }}
				</span>
			</li>
		</ul>
		<a-table
			:columns="columns"
			class="new-table"
			:scroll="{ x: true }"
			:dataSource="data.subCreditLineList"
			:pagination="false"
		>
			<template
				slot="status"
				slot-scope="text, record"
			>
				<div :class="`status status-${text}`">{{ record.statusText }}</div>
			</template>
			<template
				slot="sharedCreditLine"
				slot-scope="text, record"
			>
				<div :class="`status status-${text}`">
					{{ text ? '是' : '否' }}
				</div>
			</template>
		</a-table>
	</div>
</template>

<script>
const columns = [
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
	{ title: '下属企业名称', dataIndex: 'companyName', scopedSlots: { customRender: 'companyName' } },
	{ title: '额度细分金额（元）', dataIndex: 'totalAmount', scopedSlots: { customRender: 'totalAmount' } },
	{ title: '剩余额度（元）', dataIndex: 'availableAmount', scopedSlots: { customRender: 'availableAmount' } },
	{ title: '冻结额度（元）', dataIndex: 'frozenAmount', scopedSlots: { customRender: 'frozenAmount' } },
	{ title: '已用额度（元）', dataIndex: 'usedAmount', scopedSlots: { customRender: 'usedAmount' } },
	{ title: '在途可用额度（元）', dataIndex: 'transitAvailableAmount', scopedSlots: { customRender: 'transitAvailableAmount' } },
	{ title: '实际剩余额度（元）', dataIndex: 'actualRemainingAmount', scopedSlots: { customRender: 'actualRemainingAmount' } },
	{ title: '是否与集团共享额度', dataIndex: 'sharedCreditLine', scopedSlots: { customRender: 'sharedCreditLine' } },
	{ title: '额度状态', dataIndex: 'status', scopedSlots: { customRender: 'status' } }
];
export default {
	props: ['data'],
	data() {
		return {
			columns,
			dataSource: []
		};
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
.grid-wrap {
	margin-top: 10px;
	width: 100%;
	border-radius: 3px;
	height: auto;
	overflow: hidden;
	border-left: 1px solid #e5e6eb;
	li {
		width: 100%;
		height: 48px;
		float: left;
		border-bottom: 1px solid #e5e6eb;
		border-right: 1px solid #e5e6eb;
		overflow: hidden;
		position: relative;
		span {
			display: inline-block;
			height: 48px;
			line-height: 48px;
			padding: 0 12px;
		}
		& > span:first-child {
			border-right: 1px solid #e5e6eb;
		}
		.label {
			width: 160px;
			background: #f3f5f6;
			font-family:
				PingFangSC-Regular,
				PingFang SC;
			font-weight: 400;
			color: #77889d;
			position: absolute;
			left: 0;
			top: 0;
		}
		span:last-child {
			width: 100%;
			padding-left: 172px;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}
	li:nth-child(1),
	li:nth-child(2),
	li:nth-child(3) {
		border-top: 1px solid #e5e6eb;
	}
	li:nth-child(3) {
		border-radius: 0 3px 0 0;
	}
	li:last-child {
		border-radius: 0 0 3px 0;
	}
	li.special {
		border-radius: 0 3px 3px 0;
	}
}

.sub-title {
	height: 32px;
	font-family: 'PingFang SC';
	font-style: normal;
	font-weight: 500;
	font-size: 16px;
	line-height: 32px;
	color: rgba(0, 0, 0, 0.8);
	position: relative;
	padding-left: 12px;
	margin-bottom: 20px;

	&:before {
		content: '';
		top: 7px;
		position: absolute;
		display: block;
		width: 4px;
		height: 18px;
		left: 0;
		background: @primary-color;
	}
}
.status {
	display: inline-block;
	padding: 4px 6px;
	border-radius: 4px;
	font-size: 12px;
	background: #c1d7ff;
	color: #4682f3;
	cursor: pointer;
}

.status-EFFECTIVE,
.status-1 {
	background: #c5ecdd;
	color: #3eb384;
}

.status-INVALID,
.status-0 {
	background: #ffdbdb;
	color: #dd4444;
}
</style>
