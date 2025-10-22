<template>
	<div>
		<a-table
			class="new-table"
			:bordered="false"
			:scroll="{ x: true }"
			:rowSelection="rowSelection"
			:dataSource="list"
			:columns="columns"
			:pagination="false"
			:rowKey="record => record.relationNo"
		>
		</a-table>
	</div>
</template>

<script>
import { getBusinessList } from '@/v2/center/steels/api/funds.js';
export default {
	data() {
		return {
			selectItem: {},
			selectedRowKeys: [],
			columns: [
				{ title: '采销合同编号', dataIndex: 'relationNo' },
				{ title: '业务线名称', dataIndex: 'companyName' },
				{ title: '采购合同编号', dataIndex: 'upContractNo' },
				{ title: '销售合同编号', dataIndex: 'downContractNo' }
			],
			list: []
		};
	},
	computed: {
		rowSelection() {
			const { selectedRowKeys } = this;
			const t = this;
			return {
				type: 'radio',
				selectedRowKeys: selectedRowKeys,

				onSelect: record => {
					t.selectedRowKeys = [record.relationNo];
					t.selectItem = record;
					t.send();
				},
				getCheckboxProps: () => ({
					props: {
						disabled: this.$route.query.type == 'view'
					}
				})
			};
		}
	},
	mounted() {
		this.getBusinessList();
	},
	methods: {
		init(info) {
			this.selectItem = info;
			this.selectedRowKeys = [info.relationNo];

			this.send();
		},
		// 获取业务线列表
		async getBusinessList() {
			const params = {
				contractId: this.$route.query.contractId
			};
			const res = await getBusinessList(params);
			this.list = res.data || [];
			if (this.list.length == 1 && !this.$route.query.id) {
				const item = this.list[0];
				this.selectedRowKeys = [item.relationNo];
				this.selectItem = item;
				this.send();
			}
		},

		send() {
			this.$emit('send', this.selectItem);
		}
	},
	components: {}
};
</script>

<style scoped lang="less"></style>
