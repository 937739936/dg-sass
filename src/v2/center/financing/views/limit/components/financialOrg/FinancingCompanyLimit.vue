<template>
	<div>
		<div class="sub-title">融资企业额度</div>
		<ul
			class="grid-wrap"
			style="padding: 0; margin-bottom: 30px"
		>
			<li>
				<span class="label"> 项目在途比例（%） </span>
				<span>
					{{ detailInfo.transitQuotaPercentage }}
				</span>
			</li>
		</ul>
		<div class="table-box">
			<a-table
				:columns="columns"
				class="new-table"
				:scroll="{ x: true }"
				:dataSource="detailInfo.subCreditLineList"
				:pagination="false"
			>
				<template
					slot="status"
					slot-scope="text, record"
				>
					<div :class="`status status-${text}`">{{ record.statusText }}</div>
				</template>
				<template
					slot="creditLineLevel"
					slot-scope="text"
				>
					<div :class="`status status-${text}`">
						{{ text ? '是' : '否' }}
					</div>
				</template>
			</a-table>
		</div>
	</div>
</template>

<script>
const customRender = text => text.toLocaleString();

const columns = [
	{ title: '企业名称', dataIndex: 'companyName', customRender },
	{ title: '授信额度（元）', dataIndex: 'totalAmount', customRender },
	{ title: '在途总额度（元）', dataIndex: 'transitTotalAmount', customRender },
	{ title: '冻结额度（元）', dataIndex: 'frozenAmount', customRender },
	{ title: '已用额度（元）', dataIndex: 'usedAmount', customRender },
	{
		title: '在途可用额度（元）',
		dataIndex: 'transitAvailableAmount',
		customRender
	},
	{ title: '剩余额度（元）', dataIndex: 'availableAmount', customRender },
	{ title: '起始日期', dataIndex: 'beginDate', customRender },
	{ title: '到期日期', dataIndex: 'endDate', customRender },
	{
		title: '额度是否循环',
		dataIndex: 'recycle',
		customRender: text => {
			return text ? '是' : '否';
		}
	},
	{
		title: '额度状态',
		dataIndex: 'status',
		scopedSlots: { customRender: 'status' }
	}
];
export default {
	props: ['detailInfo'],
	name: 'FinancingCompanyLimit',
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
.table-box {
	width: 100%;
	/deep/ .ant-table {
		td,
		th {
			white-space: nowrap;
		}
	}
}
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
	cursor: pointer;
}

.status-EFFECTIVE,
.status-true {
	background: #c5ecdd;
	color: #3eb384;
}

.status-INVALID,
.status-false {
	background: #ffdbdb;
	color: #dd4444;
}
</style>
