<!-- 我的仓储-泰州港-出入场记录 -->
<template>
	<div class="storage-all-cfd">
		<a-table
			style="width: 100%"
			:rowKey="
				(record, index) => {
					return index;
				}
			"
			:columns="columns"
			:data-source="dataSource"
			:pagination="false"
		/>
		<i-pagination
			v-if="pagination.total > 10"
			:pagination="pagination"
			@change="handleTableChange"
		/>
	</div>
</template>
<script>
import iPagination from "@sub/components/iPagination";
import {
	API_getWarehouseHarborHncfListHncfStore,
	API_getWarehouseHarborHncfStoreInventoryExportXls
} from '@/v2/center/storage/api';
export default {
	name: 'StorageAllCFD',
	data() {
		return {
			dataSource: [],
			columns: [
				{ title: '公司名称', width: 400, dataIndex: 'companyName', key: 'companyName' },
				{ title: '垛位号', width: 200, dataIndex: 'stackNo', key: 'stackNo' },
				{ title: '煤种', dataIndex: 'category', key: 'category', width: 150 },
				{ title: '吨数', dataIndex: 'remainTons', key: 'remainTons', width: 200 }
			],
			pagination: {
				total: 0, // 总条数
				pageNo: 1,
				pageSize: 10
			},
			params: {}
		};
	},
	components: { iPagination },
	methods: {
		// 切换分页
		handleTableChange(page, size) {
			this.pagination.pageNo = page;
			this.pagination.pageSize = size;
			this.getList();
		},
		getList(data) {
			if (data) this.params = Object.assign({}, data);
			this.params = Object.assign({}, this.params, {
				pageNo: this.pagination.pageNo,
				pageSize: this.pagination.pageSize
			});
			API_getWarehouseHarborHncfListHncfStore(this.params).then(resp => {
				if (resp.success) {
					let obj = resp.result || {};
					this.dataSource = obj.records || [];
					this.pagination.total = obj.total;
					this.$emit('update', this.params, this.pagination.total);
				}
			});
		},
		reset(data) {
			this.pagination.pageNo = 1;
			this.getList(data);
		},
		exportXls(data) {
			return {
				func: API_getWarehouseHarborHncfStoreInventoryExportXls(data),
				name: '华能曹妃甸港当前货存详情'
			};
		}
	}
};
</script>
<style lang="less" scoped>
.storage-all-cfd {
}
</style>
