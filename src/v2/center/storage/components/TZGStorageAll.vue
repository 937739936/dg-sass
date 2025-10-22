<!-- 我的仓储-泰州港-出入场记录 -->
<template>
	<div class="storage-all-tzg">
		<a-table
			:rowKey="
				(record, index) => {
					return index;
				}
			"
			:columns="columns"
			:data-source="dataSource"
			:pagination="false"
			:rowClassName="
				record => {
					if (record.rowType === 'in') return 'row-in-class';
				}
			"
		>
			<template
				slot="date"
				slot-scope="text, record"
			>
				<span v-if="record.rowType === 'in'">{{ record.inDate }}</span>
				<span v-if="record.rowType === 'out'">{{ record.outDate }}</span>
			</template>
		</a-table>
		<i-pagination
			v-if="pagination.total > 10"
			:pagination="pagination"
			@change="handleTableChange"
		/>
	</div>
</template>
<script>
import iPagination from "@sub/components/iPagination";
import { API_getWarehouseHarborMyListTzInOut, API_getWarehouseHarborMyInOutExportXls } from '@/v2/center/storage/api';
import { filterCodeByValueName } from '@sub/utils/globalCode.js';

export default {
	name: 'StorageAllTZG',
	data() {
		return {
			dataSource: [],
			columns: [
				{ title: '公司名称', width: 180, dataIndex: 'companyName', key: 'companyName' },
				{ title: '日期', width: 120, dataIndex: 'date', key: 'date', scopedSlots: { customRender: 'date' } },
				{
					title: '作业方式',
					dataIndex: 'operateType',
					key: 'operateType',
					width: 120,
					customRender(text) {
						return filterCodeByValueName(text + '', 'harbor_operate_type');
					}
				},
				{ title: '船名', dataIndex: 'shipName', key: 'shipName', width: 90 },
				{ title: '品种', dataIndex: 'category', key: 'category', width: 90 },
				{ title: '过磅吨数', dataIndex: 'weightTons', key: 'weightTons', width: 120 },
				{ title: '堆场', dataIndex: 'yard', key: 'yard', width: 90 },
				{ title: '剩余吨数', dataIndex: 'remainTons', key: 'remainTons', width: 120 }
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
			API_getWarehouseHarborMyListTzInOut(this.params).then(resp => {
				if (resp.success) {
					let obj = resp.result || {};
					this.dealList(obj.records || []);
					this.pagination.total = obj.total || 0;
					this.$emit('update', this.params, this.pagination.total);
				}
			});
		},
		dealList(list) {
			let arr = [];
			list.forEach(item => {
				arr.push({
					...item,
					rowType: 'in',
					warehouseHarborOutDOList: []
				});
				let innerList = item.warehouseHarborOutDOList || [];
				innerList.forEach(innerItem => {
					arr.push({
						...innerItem,
						rowType: 'out'
					});
				});
			});
			this.dataSource = [].concat(arr);
		},
		reset(data) {
			this.pagination.pageNo = 1;
			this.getList(data);
		},
		exportXls(data) {
			return {
				func: API_getWarehouseHarborMyInOutExportXls(data),
				name: '泰州港出入场详情'
			};
		}
	}
};
</script>
<style lang="less" scoped>
.storage-all-tzg {
	::v-deep.row-in-class {
		tr,
		td {
			color: #1890ff !important;
		}
	}
}
</style>
