<!-- 我的仓储-泰州港-出入场记录 -->
<template>
	<div class="storage-exit-tzg">
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
		<i-pagination
			v-if="pagination.total > 10"
			:pagination="pagination"
			@change="handleTableChange"
		/>
	</div>
</template>
<script>
import iPagination from "@sub/components/iPagination";
import { API_getWarehouseHarborMyListTzOut, API_getWarehouseHarborMyOutExportXls } from '@/v2/center/storage/api';
import { filterCodeByValueName } from '@sub/utils/globalCode.js';

export default {
	name: 'StorageExitTZG',
	data() {
		return {
			dataSource: [],
			columns: [
				{ title: '公司名称', width: 200, dataIndex: 'companyName', key: 'companyName' },
				{ title: '出场日期', width: 120, dataIndex: 'outDate', key: 'outDate' },
				{
					title: '作业方式',
					dataIndex: 'operateType',
					key: 'operateType',
					width: 120,
					customRender(text) {
						return filterCodeByValueName(text + '', 'harbor_operate_type');
					}
				},
				{ title: '船名', dataIndex: 'shipName', key: 'shipName', width: 100 },
				{ title: '品种', dataIndex: 'category', key: 'category', width: 100 },
				{ title: '过磅吨数', dataIndex: 'weightTons', key: 'weightTons', width: 100 },
				{ title: '堆场', dataIndex: 'yard', key: 'yard', width: 100 }
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
			API_getWarehouseHarborMyListTzOut(this.params).then(resp => {
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
				func: API_getWarehouseHarborMyOutExportXls(data),
				name: '泰州港出场详情'
			};
		}
	}
};
</script>
<style lang="less" scoped>
.storage-exit-tzg {
}
</style>
