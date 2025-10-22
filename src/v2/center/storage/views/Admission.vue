<template>
	<div class="center-storage-admission">
		<div class="title-wrapper">
			<div class="title-text">港口入场登记</div>
			<div>
				<a-button
					type="primary"
					@click="handleAddInfo"
					>新增入港信息</a-button
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
						@confirm="() => handleDeleteConfirm(record)"
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

		<CFDAdmissionAdd
			@addConfirm="updateTableData"
			@updateConfirm="updateTableData"
			ref="CFDAdmissionAdd"
		/>
	</div>
</template>
<script>
import CFDAdmissionAdd from '../components/CFDAdmissionAdd';
import iPagination from "@sub/components/iPagination";
import { filterCodeByValueName } from '@sub/utils/globalCode.js';
import { API_postWarehouseHarborInDelete, API_getWarehouseHarborInListHncf } from '@/v2/center/storage/api';
export default {
	name: 'CenterStorageAdmission',
	data() {
		return {
			columns: [
				{
					title: '公司名称',
					width: 150,
					dataIndex: 'companyName',
					key: 'companyName'
				},
				{ title: '进港时间', width: 120, dataIndex: 'inDate', key: 'inDate' },
				{
					title: '作业方式',
					dataIndex: 'operateType',
					key: 'operateType',
					width: 120,
					customRender(text) {
						return filterCodeByValueName(text + '', 'harbor_operate_type');
					}
				},
				{
					title: '车次/船名',
					dataIndex: 'shipName',
					key: 'shipName',
					width: 120
				},
				{
					title: '首车号',
					dataIndex: 'firstTrainNo',
					key: 'firstTrainNo',
					width: 100
				},
				{
					title: '尾车号',
					dataIndex: 'lastTrainNo',
					key: 'lastTrainNo',
					width: 100
				},
				{
					title: '存放垛位号',
					dataIndex: 'stackNo',
					key: 'stackNo',
					width: 120
				},
				{ title: '煤种', dataIndex: 'category', key: 'category', width: 80 },
				{
					title: '吨数',
					dataIndex: 'weightTons',
					key: 'weightTons',
					width: 80
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
				pageSize: 10,
				total: 0, // 总条数
				pageNo: 1
			}
		};
	},
	components: {
		iPagination,
		CFDAdmissionAdd
	},
	mounted() {
		this.getList();
	},
	methods: {
		// 新增
		handleAddInfo() {
			this.$refs.CFDAdmissionAdd.init(false);
		},
		// 修改
		handleEdit(record) {
			this.$refs.CFDAdmissionAdd.init(true, record);
		},
		// 删除出港
		handleDeleteConfirm(record) {
			API_postWarehouseHarborInDelete({
				id: record.id
			}).then(resp => {
				if (resp.success) {
					this.updateTableData();
					this.$message.success('删除成功');
				}
			});
		},
		// 更新数据，回到第一页
		updateTableData() {
			this.pagination.pageNo = 1;
			this.getList();
		},
		// 获取数据
		getList() {
			let params = {
				pageNo: this.pagination.pageNo,
				pageSize: this.pagination.pageSize,
				harborType: 2 // 2-曹妃甸
			};
			API_getWarehouseHarborInListHncf(params).then(resp => {
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
.center-storage-admission {
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
