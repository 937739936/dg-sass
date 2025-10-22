<template>
	<div
		class="slMain"
		style="margin-top: -10px"
	>
		<a-card :bordered="false">
			<div class="s-title">
				<span
					slot="title"
					class="slTitle"
					>查仓报告记录</span
				>
				<a-button
					v-auth="'steel:bondLetter:list:add'"
					type="primary"
					@click="exportFile"
				>
					<span style="font-size: 14px">导出</span>
				</a-button>
			</div>
			<SlForm
				:list="searchList"
				layout="inline"
				@change="changeSearch"
				:isShowIcon="false"
			></SlForm>
			<!-- 表格 -->
			<div class="table-box">
				<a-table
					:columns="columns"
					class="new-table"
					:bordered="false"
					:row-selection="rowSelection"
					rowKey="id"
					:dataSource="list"
					:pagination="false"
					:loading="loading"
					:scroll="{ x: true }"
				>
					<span
						slot="status"
						slot-scope="text, record"
					>
						<span
							v-if="record.checkResult"
							style="color: green"
							>正常</span
						>
						<span
							v-else
							style="color: red"
							>异常</span
						>
					</span>
					<span slot="customTitle"> 操作 </span>
					<div
						slot="action"
						slot-scope="text, record"
					>
						<div class="btn-box">
							<a
								href="javascript:;"
								class="btn"
								@click="goDetail(record)"
								>查看</a
							>
						</div>
					</div>
				</a-table>
			</div>
			<i-pagination
				:pagination="pagination"
				size="small"
				@change="getList"
			/>
		</a-card>
	</div>
</template>

<script>
import SlForm from '@sub/components/ui-new/Form/sl-form';
import iPagination from "@sub/components/iPagination";
import { getCheckWarehouseList, exportCheckWarehouse, downloadAttach } from '../../../api/findWarehouse.js';
import comDownload from '@sub/utils/comDownload.js';
export default {
	data() {
		return {
			searchList: [
				{
					decorator: ['warehouse'],
					addonBeforeTitle: '仓储企业',
					type: 'input',
					placeholder: '请输入仓储企业',
					allowClear: true
				},
				{
					decorator: ['serialNo'],
					addonBeforeTitle: '查仓报告单号',
					type: 'input',
					placeholder: '请输入查仓报告单号',
					allowClear: true
				},
				{
					decorator: ['createdName'],
					addonBeforeTitle: '查仓人员',
					type: 'input',
					placeholder: '请输入查仓人员',
					allowClear: true
				},
				{
					decorator: ['issuedDate'],
					addonBeforeTitle: '查仓日期',
					realKey: ['startDate', 'endDate'],
					type: 'rangePicker',
					placeholder: ['', ''],
					allowClear: true
				},
				{
					decorator: ['status'],
					addonBeforeTitle: '查仓结果',
					type: 'select',
					placeholder: '请选择',
					allowClear: true,
					options: [
						{ value: '', label: '全部' },
						{ value: 0, label: '异常' },
						{ value: 1, label: '正常' }
					]
				}
			],
			excelImport2: require('@/assets/imgs/newInvoice/excel-import2.png'),
			searchParams: {},
			pageSize: 10,
			pagination: {
				total: 0, // 总条数
				pageNo: 1
			},
			columns: [
				{ title: '仓储企业', dataIndex: 'warehouse', key: 'warehouse' },
				{ title: '查仓报告单号', dataIndex: 'serialNo', key: 'serialNo' },
				{ title: '货权所属企业', dataIndex: 'companyName', key: 'companyName' },
				{ title: '货物品名', dataIndex: 'materialName', key: 'materialName' },
				{ title: '查仓结果', dataIndex: 'status', key: 'status', scopedSlots: { customRender: 'status' } },
				{ title: '查仓人员', dataIndex: 'createdName', key: 'createdName' },
				{ title: '查仓日期', dataIndex: 'checkDate', key: 'checkDate' },
				{
					title: '操作',
					key: 'action',
					align: 'center',
					fixed: 'right',
					scopedSlots: { customRender: 'action' }
				}
			],
			list: [],
			loading: false,
			selectedRowKeys: []
		};
	},
	computed: {
		//表格单选
		rowSelection() {
			const t = this;
			const { selectedRowKeys } = this;
			return {
				type: 'checkbox',
				selectedRowKeys,
				onChange: (selectedRowKeys, selectedRows) => {
					this.selectedRowKeys = selectedRowKeys;
				}
			};
		}
	},
	mounted() {
		this.getList();
	},
	methods: {
		changeSearch(info) {
			this.searchParams = info;
			if (info.status === 0) {
				this.searchParams.status = false;
			}
			if (info.status === 1) {
				this.searchParams.status = true;
			}
			this.getList(1, this.pageSize);
		},
		async exportFile() {
			if (!this.selectedRowKeys.length) {
				this.$message.error('请选择');
				return;
			}
			const params = {
				idList: this.selectedRowKeys.join(',')
			};
			const res = await exportCheckWarehouse(params);
			comDownload(res, undefined, `查仓报告材料.zip`);
		},
		async getList(pageNo = this.pagination.pageNo, pageSize = 10) {
			this.pageSize = pageSize;
			this.pagination.pageNo = pageNo;
			const params = {
				...this.searchParams,
				...this.pagination,
				pageSize
			};
			this.loading = true;
			try {
				const res = await getCheckWarehouseList(params);
				this.list = res.data.records;
				this.pagination.total = res.data.total;
				this.loading = false;
			} catch (error) {
				this.loading = false;
			}
		},
		async downloadAttach(item) {
			const params = {
				id: item.id
			};
			const res = await downloadAttach(params);
			comDownload(res, undefined, `查仓报告材料.zip`);
		},
		// 去往详情
		goDetail(item) {
			this.$router.push({
				path: '/center/steelStorage/findWarehouse/report/detail',
				query: {
					id: item.id
				}
			});
		}
	},
	components: {
		SlForm,
		iPagination
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style scoped lang="less">
.page-title {
	display: flex;
}
.icon,
.icon2 {
	width: 18px;
	vertical-align: middle;
	margin-right: 15px;
}
.btn-box-title {
	display: flex;
	align-items: center;
	.btn {
		width: 126px;
		height: 44px;
		border-radius: 4px;
		border: 1px solid @primary-color;
		display: flex;
		justify-content: center;
		align-items: center;
		color: @primary-color;
		font-size: 14px;
		margin-left: 20px;
		font-weight: 400;
		cursor: pointer;
	}
}
.table-box {
	margin-top: 20px;
}
.btn {
	margin-left: 5px;
}
</style>
