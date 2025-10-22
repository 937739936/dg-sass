<!-- 泰州港-存货量 -->
<template>
	<div class="storage-inventory-tzg">
		<a-table
			:rowKey="
				(record, index) => {
					return index;
				}
			"
			:columns="columns"
			:data-source="dataSource"
			:pagination="false"
		/>
	</div>
</template>
<script>
import { API_getWarehouseHarborInventoryListTz } from '@/v2/center/storage/api';
import { filterCodeByValueName } from '@sub/utils/globalCode.js';
export default {
	name: 'StorageInventoryTZG',
	data() {
		return {
			dataSource: [],
			columns: [
				{ title: '公司名称', width: 200, dataIndex: 'companyName', key: 'companyName' },
				{ title: '入场日期', width: 120, dataIndex: 'inDate', key: 'inDate' },
				{
					title: '作业方式',
					dataIndex: 'operateType',
					key: 'operateType',
					width: 110,
					customRender(text) {
						return filterCodeByValueName(text + '', 'harbor_operate_type');
					}
				},
				{ title: '船名', dataIndex: 'shipName', key: 'shipName', width: 90 },
				{ title: '品种', dataIndex: 'category', key: 'category', width: 90 },
				{ title: '过磅吨数', dataIndex: 'weightTons', key: 'weightTons', width: 120 },
				{ title: '堆场', dataIndex: 'yard', key: 'yard', width: 80 },
				{ title: '剩余吨数', dataIndex: 'remainTons', key: 'remainTons', width: 120 }
			]
		};
	},
	mounted() {
		this.getList();
	},
	methods: {
		getList() {
			API_getWarehouseHarborInventoryListTz({
				harborType: 1 // 泰州港-1
			}).then(resp => {
				if (resp.success) {
					this.dataSource = resp.result || [];
				}
			});
		}
	}
};
</script>
<style lang="less" scoped>
.storage-inventory-tzg {
}
</style>
