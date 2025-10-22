<template>
	<div class="sub-table-container">
		<div class="table-box">
			<a-table
				:columns="columns"
				class="new-table"
				:bordered="false"
				rowKey="operationTime"
				:dataSource="dataSource"
				:pagination="false"
				:loading="loading"
				:scroll="{ x: false }"
			>
				<template
					slot="comments"
					slot-scope="text"
				>
					<div class="comments-container">
						<TextOverflowTooltip :tipText="text">
							<span>{{ text }}</span>
						</TextOverflowTooltip>
					</div>
				</template>
			</a-table>
		</div>
	</div>
</template>

<script>
import TextOverflowTooltip from '@sub/components/base/TextOverflowTooltip';
export default {
	name: 'OperationRecordTable',
	props: {
		// 数据源
		dataSource: {
			type: Array,
			default: () => []
		}
	},
	components: {
		TextOverflowTooltip
	},
	data() {
		return {
			loading: false,
			columns: columns
		};
	},
	mounted() {},
	methods: {}
};

// 数据为空时，显示的表头
const customRender = text => text || '-';
const columns = [
	{
		title: '操作类型',
		dataIndex: 'operationTypeDesc',
		width: '15%',
		customRender
	},
	{
		title: '操作人员',
		dataIndex: 'operationBy',
		width: '15%',
		customRender
	},
	{
		title: '所属公司',
		dataIndex: 'operationByCompany',
		width: '15%',
		customRender
	},
	{
		title: '操作内容',
		dataIndex: 'comments',
		width: '40%',
		scopedSlots: {
			customRender: 'comments'
		}
	},
	{
		title: '操作时间',
		dataIndex: 'operationTime',
		width: '15%',
		customRender
	}
];
</script>

<style lang="less" scoped>
@import url('~@sub/style/table-cover.less');
</style>
<style lang="less" scoped>
.sub-table-container {
	width: 100%;
	.table-box {
		margin-top: 30px;
	}
	.comments-container {
		// max-width: 90%;
		max-width: 500px;
		text-overflow: ellipsis;
		overflow: hidden;
		word-wrap: break-word;
		word-break: break-all;
		white-space: nowrap;
	}
	/deep/ .ant-table {
		td,
		th {
			white-space: nowrap;
			// text-overflow: ellipsis;
			// overflow: hidden;
		}
	}
}
</style>