<template>
	<div class="center-storage-exit">
		<div class="title-wrapper">
			<div class="title-text">港口出场登记</div>
			<div>
				<a-button
					type="primary"
					@click="handleAddInfo"
					>新增出港信息</a-button
				>
			</div>
		</div>
		<a-table
			:rowKey="
				(record, index) => {
					return index;
				}
			"
			:columns="columns"
			:data-source="dataSource"
			@change="handleTableChange"
			:pagination="false"
			:scroll="{ x: true }"
		>
			<template
				slot="action"
				slot-scope="text, record, index"
			>
				<div class="btn-wrapper">
					<a @click.prevent="handleEdit(record, index)">编辑</a>
					<a-popconfirm
						title="确定删除该条信息?"
						okText="确定"
						cancelText="取消"
						@confirm="() => handleDeleteConfirm(record, index)"
					>
						<a
							class="btn-item"
							href="javascript:;"
							>删除</a
						>
					</a-popconfirm>
				</div>
			</template>
		</a-table>
		<i-pagination
			v-if="pagination.total > 10"
			:pagination="pagination"
			@change="handleTableChange"
		/>

		<CFDExitAdd
			@addConfirm="updateTableData"
			@updateConfirm="updateTableData"
			ref="CFDExitAdd"
		/>
	</div>
</template>
<script>
import CFDExitAdd from '../components/CFDExitAdd';
import iPagination from "@sub/components/iPagination";
import { filterCodeByValueName } from '@sub/utils/globalCode.js';
import { API_postWarehouseHarborOutDelete, API_getWarehouseHarborOutListHncf } from '@/v2/center/storage/api';
export default {
	name: 'CenterStorageExit',
	data() {
		return {
			columns: [
				{
					title: '公司名称',
					width: 150,
					dataIndex: 'companyName',
					key: 'companyName'
				},
				{ title: '出港时间', width: 120, dataIndex: 'outDate', key: 'outDate' },
				{
					title: '作业方式',
					dataIndex: 'operateType',
					key: 'operateType',
					width: 100,
					customRender(text) {
						return filterCodeByValueName(text + '', 'harbor_operate_type');
					}
				},
				{ title: '船名', dataIndex: 'shipName', key: 'shipName', width: 150 },
				{
					title: '取出垛位号',
					dataIndex: 'stackNo',
					key: 'stackNo',
					width: 120
				},
				{ title: '煤种', dataIndex: 'category', key: 'category', width: 150 },
				{
					title: '吨数',
					dataIndex: 'weightTons',
					key: 'weightTons',
					width: 150
				},
				{ title: '备注', dataIndex: 'remark', key: 'remark', width: 150 },
				{
					title: '操作',
					key: 'operation',
					fixed: 'right',
					scopedSlots: { customRender: 'action' }
				}
			],
			dataSource: [],
			pagination: {
				type: '',
				pageSize: 10,
				total: 0, // 总条数
				pageNo: 1
			}
		};
	},
	components: {
		CFDExitAdd,
		iPagination
	},
	mounted() {
		this.getList();
	},
	methods: {
		handleAddInfo() {
			this.$refs.CFDExitAdd.init(false);
		},
		handleEdit(record) {
			this.$refs.CFDExitAdd.init(true, record);
		},
		handleDeleteConfirm(record) {
			API_postWarehouseHarborOutDelete({
				// inId: this.inDetail.id,
				id: record.id
			}).then(resp => {
				if (resp.success) {
					this.updateTableData();
					this.$message.success('删除成功');
				}
			});
		},
		updateTableData() {
			this.pagination.pageNo = 1;
			this.getList();
		},
		getList() {
			let params = {
				pageNo: this.pagination.pageNo,
				pageSize: this.pagination.pageSize,
				harborType: 2 // 2-曹妃甸
			};
			API_getWarehouseHarborOutListHncf(params).then(resp => {
				if (resp.success) {
					let obj = resp.result || {};
					this.dataSource = obj.records || [];
					this.pagination.total = obj.total || 0;
				}
			});
		},
		// 切换分页
		handleTableChange(page, size) {
			this.pagination.pageNo = page;
			this.pagination.pageSize = size;
			this.getList();
		}
	}
};
</script>
<style lang="less" scoped>
.center-storage-exit {
	margin: 20px 0px;
	.title-wrapper {
		display: flex;
		justify-content: space-between;
		padding-bottom: 20px;
		border-bottom: 1px solid #d8d8d8;
		margin-bottom: 40px;
		.title-text {
			font-size: 18px;
			color: rgba(0, 0, 0, 0.65);
		}
		::v-deepbutton {
			font-size: 16px;
		}
	}
	.btn-wrapper {
		.btn-item {
			margin-left: 10px;
		}
	}
}
</style>
