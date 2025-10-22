<!-- 泰州港-出入港 -->
<template>
	<div class="center-storage-admission-and-exit-table">
		<a-table
			v-if="dataSource.length > 0"
			:rowKey="
				(record, index) => {
					return index;
				}
			"
			:columns="columns"
			:data-source="dataSource"
			:scroll="{ x: true }"
			:pagination="false"
		>
			<template
				slot="date"
				slot-scope="text, record, index"
			>
				<span v-if="index === 0">{{ record.inDate }}</span>
				<span v-else>{{ record.outDate }}</span>
			</template>
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
							v-if="(index === 0 && dataSource.length === 1) || index !== 0"
							href="javascript:;"
							>删除</a
						>
					</a-popconfirm>
					<a
						class="btn-item"
						v-if="index === 0"
						@click.prevent="handleAddExit(record)"
						>录入出港数据</a
					>
				</div>
			</template>
		</a-table>
		<i-pagination
			v-if="pagination.total > 10"
			:pagination="pagination"
			@change="handleTableChange"
		/>
		<!-- 新增入港 -->
		<TZGAdmissionAdd
			@updateConfirm="updateInDetail"
			ref="admissionAddTZG"
		/>
		<!-- 新增出港 -->
		<TZGExitAdd
			@addConfirm="handleAddExitConfirm"
			@updateConfirm="getList"
			ref="exitAddTZG"
		/>
	</div>
</template>
<script>
import { filterCodeByValueName } from '@sub/utils/globalCode.js';
import TZGExitAdd from './TZGExitAdd';
import TZGAdmissionAdd from './TZGAdmissionAdd';
import iPagination from "@sub/components/iPagination";
import {
	API_getWarehouseHarborInGet,
	API_getWarehouseHarborOutListPage,
	API_postWarehouseHarborInDelete,
	API_postWarehouseHarborOutDelete
} from '@/v2/center/storage/api';
export default {
	name: 'CenterStorageAdmissionAndExitTable',
	props: {
		data: {
			type: Object,
			default: () => {
				return {};
			}
		}
	},
	data() {
		return {
			columns: [
				{ title: '公司名称', width: 150, dataIndex: 'companyName', key: 'companyName' },
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
				{ title: '过磅吨数', dataIndex: 'weightTons', key: 'weightTons', width: 100 },
				{ title: '堆场', dataIndex: 'yard', key: 'yard', width: 90 },
				{ title: '剩余吨数', dataIndex: 'remainTons', key: 'remainTons', width: 100 },
				{
					title: '操作',
					width: 195,
					key: 'operation',
					fixed: 'right',
					scopedSlots: { customRender: 'action' }
				}
			],
			pagination: {
				type: '',
				total: 0, // 总条数
				pageNo: 1,
				pageSize: 10
			},
			detail: {},
			dataSource: [],
			inDetail: {} // 入港信息
		};
	},
	components: {
		TZGExitAdd,
		TZGAdmissionAdd,
		iPagination
	},
	methods: {
		init(data) {
			this.detail = Object.assign({}, data);
			this.inDetail = this.detail.warehouseHarborInDO || {};

			let pageObj = this.detail.page || {};
			this.dataSource = pageObj.records || [];
			this.pagination.total = pageObj.total || 0;
			this.dataSource.unshift(this.inDetail);
		},
		// 切换分页
		handleTableChange(page, size) {
			this.pagination.pageNo = page;
			this.pagination.pageSize = size;
			this.getList();
		},
		// 更新入港信息
		updateInDetail() {
			API_getWarehouseHarborInGet({
				id: this.inDetail.id
			}).then(resp => {
				if (resp.success) {
					this.inDetail = resp.result || {};
					this.dataSource.splice(0, 1, this.inDetail); // 单独更新入港信息
				}
			});
		},
		updateTableData() {
			this.pagination.pageNo = 1;
			this.getList();
		},
		// 更新table数据
		getList() {
			API_getWarehouseHarborOutListPage({
				inId: this.inDetail.id,
				harborType: 1, // 1-泰州港
				pageNo: this.pagination.pageNo,
				pageSize: this.pagination.pageSize
			}).then(resp => {
				if (resp.success) {
					let detail = resp.result || {};
					this.pagination.total = detail.total;
					this.dataSource = detail.records || [];
					this.dataSource.unshift(this.inDetail); // 入港数据永远在第一条
				}
			});
		},
		/**
		 * 编辑入港/出港
		 * @param record
		 * @param index index===0代表编辑入港数据
		 */
		handleEdit(record, index) {
			if (index === 0) {
				// 修改入港
				this.$refs.admissionAddTZG.init(true, record);
			} else {
				// 修改出港
				this.$refs.exitAddTZG.init(true, record, this.inDetail.id);
			}
		},
		// 新增出港信息
		handleAddExit(record) {
			this.$refs.exitAddTZG.init(false, record, this.inDetail.id);
		},
		// 添加出港信息确认
		handleAddExitConfirm() {
			this.pagination.pageNo = 1;
			this.getList();
		},
		// 删除数据确认
		handleDeleteConfirm(record, index) {
			if (index === 0) {
				// 删除入港信息
				API_postWarehouseHarborInDelete({
					id: this.inDetail.id
				}).then(resp => {
					if (resp.success) {
						this.$emit('deleteInConfirm');
						this.$message.success('删除成功');
					}
				});
			} else {
				// 删除出港信息
				API_postWarehouseHarborOutDelete({
					// inId: this.inDetail.id,
					id: record.id
				}).then(resp => {
					if (resp.success) {
						this.updateTableData();
						this.$message.success('删除成功');
					}
				});
			}
		}
	},
	watch: {
		data: {
			immediate: true,
			handler(val) {
				this.init(val);
			}
		}
	}
};
</script>
<style lang="less" scoped>
.center-storage-admission-and-exit-table {
	margin-top: 40px;
	.btn-wrapper {
		.btn-item {
			margin-left: 10px;
		}
	}
	::v-deep.ant-table-tbody {
		.ant-table-row[data-row-key='0'] {
			tr,
			td {
				color: #1890ff !important;
			}
		}
	}
	::v-deep.ant-row {
		margin-top: 10px !important;
	}
}
</style>
