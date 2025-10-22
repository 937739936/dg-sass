<template>
	<div class="supple-info-box">
		<a-table
			:columns="agreementColumns"
			class="new-table"
			:bordered="false"
			rowKey="id"
			:dataSource="list"
			:pagination="false"
			:scroll="{ x: true }"
		>
			<template
				slot="itemDetailsOld"
				slot-scope="text, record"
			>
				<span
					v-for="(item, index) in record.itemDetails"
					:key="index"
				>
					<span v-if="item.itemName == 'QUANTITY'"> {{ item.oldValueDesc }}吨</span>
					<span v-else-if="item.itemName == 'BASE_PRICE'">{{ item.oldValueDesc }}元/元</span>
					<span v-else>{{ item.oldValueDesc }}</span>
				</span>
			</template>
			<template
				slot="itemDetails"
				slot-scope="text, record"
			>
				<span
					v-for="(item, index) in record.itemDetails"
					:key="index"
				>
					<span v-if="item.itemName == 'QUANTITY'"> {{ item.valueDesc }}吨</span>
					<span v-else-if="item.itemName == 'BASE_PRICE'">{{ item.valueDesc }}元/元</span>
					<span v-else>{{ item.valueDesc }}</span>
				</span>
			</template>
		</a-table>
	</div>
</template>

<script>
const agreementColumns = [
	{ title: '序号', dataIndex: 'serialNumber', fixed: 'left', customRender: (text, record, index) => index + 1 },
	{ title: '变更项', dataIndex: 'fieldCName' },
	{ title: '变更前', dataIndex: 'itemDetailsOld', scopedSlots: { customRender: 'itemDetailsOld' } },
	{ title: '变更后', dataIndex: 'itemDetails', scopedSlots: { customRender: 'itemDetails' } }
];
export default {
	props: {
		list: {
			default: () => {
				return [];
			}
		}
	},
	data() {
		return {
			agreementColumns
		};
	},
	methods: {},
	components: {}
};
</script>

<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style scoped lang="less">
.supple-info-box {
	width: 100%;
	.title {
		color: rgba(0, 0, 0, 0.8);
		font-size: 14px;
		font-weight: 600;
		margin-top: 30px;
		margin-bottom: 10px;
	}
	.other-info,
	.other-info2 {
		border-radius: 4px;
		border: 1px solid var(--line, #e5e6eb);
		background: #fff;
		padding: 12px;
		color: var(--text-80, rgba(0, 0, 0, 0.8));
		box-sizing: border-box;
		min-height: 124px;
	}
	.other-info2 {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		color: var(--character-disabled-placeholder-25, rgba(0, 0, 0, 0.25));
		img {
			width: 64px;
		}
	}
	.new-table {
		/deep/ .ant-table-thead > tr {
			background: #f3f5f6;
		}
	}
}
</style>
