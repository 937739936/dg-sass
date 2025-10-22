<template>
	<div>
		<div class="file-box">
			<div class="slTitleAssis">融资协议</div>
			<a-button
				type="primary"
				class="btn"
				ghost
				@click="viewPDF({}, 'all')"
			>
				一键下载
			</a-button>
		</div>
		<a-table
			rowKey="name"
			class="new-table"
			:columns="fileColumns"
			:dataSource="list"
			:pagination="false"
			:defaultExpandAllRows="true"
			:locale="{ emptyText: '暂无数据' }"
		>
			<div
				slot="statusText"
				slot-scope="text, record"
			>
				<span class="status">{{ text }}</span>
			</div>
			<div
				slot="action"
				slot-scope="text, record"
			>
				<a-space>
					<a
						href="javascript:;"
						style="margin-right: 10px"
						@click="viewPDF(record, 'view')"
						>查看
					</a>
					<a
						href="javascript:;"
						@click="viewPDF(record, 'down')"
						>下载</a
					>
				</a-space>
			</div>
		</a-table>
	</div>
</template>

<script>
const fileColumns = [
	{
		title: '序号',
		dataIndex: '',
		key: 'rowIndex',
		width: 80,
		align: 'center',
		customRender: function (t, r, index) {
			return parseInt(index) + 1;
		}
	},
	{
		title: '合同名称',
		dataIndex: 'name'
	},
	{
		title: '状态',
		dataIndex: 'statusText',
		scopedSlots: { customRender: 'statusText' }
	},
	{
		title: '操作',
		key: 'action',
		scopedSlots: { customRender: 'action' },
		width: 140
	}
];
export default {
	props: ['list'],
	data() {
		return {
			fileColumns
		};
	},
	methods: {
		viewPDF(record, type) {
			this.$emit('viewPDF', record, type);
		}
	},
	components: {}
};
</script>
<style lang="less" scoped>
@import url('~@sub/style/table-cover.less');
</style>
<style scoped lang="less">
.status {
	display: inline-block;
	padding: 1px 6px;
	align-items: flex-start;
	gap: 10px;
	text-align: center;
	border-radius: 4px;
	font-family: PingFang SC;
	font-size: 12px;
	margin-left: 4px;
	background: #ffdbc8;
	color: #ff7937;
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
	vertical-align: middle;
}
.file-box {
	display: flex;
	margin-bottom: 20px;
	margin-top: 30px;
	align-items: center;
	.slTitleAssis {
		margin-top: 0;
		margin-right: 20px;
	}
	.btn {
		height: 28px;
		width: 88px;
	}
}
</style>
