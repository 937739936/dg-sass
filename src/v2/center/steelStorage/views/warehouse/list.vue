<template>
	<div
		class="mySettleList slMain"
		style="margin-top: -10px"
	>
		<a-card :bordered="false">
			<div class="s-title">
				<span
					slot="title"
					class="slTitle"
				>
					仓储租赁合同</span
				>
				<a-button
					type="primary"
					@click="add"
					icon="plus"
				>
					<span style="font-size: 14px">新增仓储合同</span>
				</a-button>
			</div>
			<SlFormNew
				:list="searchList"
				layout="inline"
				@change="changeSearch"
				:allowClear="false"
				@resetFunc="resetValues"
				:isShowIcon="false"
				:isShowSearchBox="true"
			></SlFormNew>
			<a-table
				:columns="columns"
				:data-source="dataSource"
				:pagination="false"
				style="margin-top: 30px"
				class="new-table"
				:loading="loading"
				rowKey="id"
			>
				<span
					slot="warehouseType"
					slot-scope="text, record"
				>
					{{ getTypeTextByValue('warehouseType', record.warehouseType) }}
				</span>
				<span
					slot="goodsType"
					slot-scope="text, record"
				>
					{{ getTypeTextByValue('goodsType', record.goodsType) }}
				</span>
				<span
					slot="status"
					slot-scope="text, record"
				>
					{{ getTypeTextByValue('statusType', record.status) }}
				</span>
				<span
					slot="validity"
					slot-scope="text, record"
				>
					{{ record.startDate }}-{{ record.endDate }}
				</span>
				<span
					slot="action"
					slot-scope="text, record"
				>
					<span v-if="[2, 3].includes(record.status)">
						<a-button
							type="link"
							@click="deatils(record)"
							>详情</a-button
						>
					</span>

					<span v-if="[2].includes(record.status)">
						<a-button
							type="link"
							@click="edit(record)"
							>修改</a-button
						>
					</span>

					<span v-if="[1, 3].includes(record.status)">
						<a-button
							type="link"
							@click="deleteItem(record)"
							>删除</a-button
						>
					</span>
					<a-button
						type="link"
						v-if="record.status == '2'"
						@click="changeStatusStop(record)"
						>停用
					</a-button>

					<a-button
						type="link"
						v-if="[1].includes(record.status)"
						@click="changeStatus(record)"
						>启用
					</a-button>
				</span>
			</a-table>
			<div class="take-pagination-wrap">
				<i-pagination
					:pagination="pagination"
					@change="getList"
				/>
			</div>
		</a-card>
	</div>
</template>

<script>
const columns = [
	{
		title: '仓库方',
		dataIndex: 'warehouseParty',
		key: 'warehouseParty'
	},
	{
		title: '仓库简称',
		dataIndex: 'warehouseAbbreviation',
		key: 'warehouseAbbreviation'
	},
	{
		title: '纸质合同编号',
		dataIndex: 'paperContractNo',
		key: 'paperContractNo'
	},
	{
		title: '期限',
		key: 'validity',
		dataIndex: 'validity',
		scopedSlots: { customRender: 'validity' }
	},
	{
		title: '仓库类型',
		key: 'warehouseType',
		dataIndex: 'warehouseType',
		scopedSlots: { customRender: 'warehouseType' }
	},
	{
		title: '存放货物类型',
		key: 'goodsType',
		dataIndex: 'goodsType',
		scopedSlots: { customRender: 'goodsType' }
	},
	{
		title: '状态',
		key: 'status',
		dataIndex: 'status',
		scopedSlots: { customRender: 'status' }
	},
	{
		title: '操作',
		key: 'action',
		scopedSlots: { customRender: 'action' }
	}
];
import {
	warehouseContractList,
	warehouseContractDelete,
	warehouseContractStart,
	warehouseContractStop,
	warehouseContractExport
} from '../../api/warehouse.js';
import { warehouseType, goodsType, statusType } from './config/type';
import comDownload from '@sub/utils/comDownload.js';
import moment from 'moment';
import { ListMixin } from '@/v2/components/mixin/ListMixin';

const searchList = [
	{
		decorator: ['warehouseAbbreviation'],
		addonBeforeTitle: '仓库简称',
		type: 'input',
		placeholder: '请输入仓库简称',
		allowClear: true
	},
	{
		decorator: ['paperContractNo'],
		addonBeforeTitle: '纸质合同编号',
		type: 'input',
		placeholder: '请输入纸质合同编号',
		allowClear: true
	},

	{
		decorator: ['warehouseType'],
		addonBeforeTitle: '仓库类型',
		type: 'select',
		placeholder: '请选择',
		allowClear: true,
		options: [
			{ value: '1', label: '仓库' },
			{ value: '2', label: '站台' },
			{ value: '3', label: '港口' }
		]
	},
	{
		decorator: ['goodsType'],
		addonBeforeTitle: '存放货物类型',
		type: 'select',
		placeholder: '请选择',
		allowClear: true,
		options: [
			{ value: '1', label: '煤炭' },
			{ value: '2', label: '粮食' },
			{ value: '3', label: '钢材' },
			{ value: '4', label: '化工品' }
		]
	},

	{
		decorator: ['status'],
		addonBeforeTitle: '状态',
		type: 'select',
		placeholder: '请选择',
		allowClear: true,
		options: [
			{ value: '1', label: '新建' },
			{ value: '2', label: '启用' },
			{ value: '3', label: '停用' }
		]
	}
];

export default {
	mixins: [ListMixin],
	data() {
		return {
			form: this.$form.createForm(this, { name: 'coordinated' }),
			searchList,
			url: {
				list: warehouseContractList
			},
			data: [],
			columns,
			pageSizeOptions: ['10', '20', '30', '40', '50'],
			total: 0,
			pageSize: 10,
			pageNo: 1,
			loading: false,
			warehouseType,
			goodsType,
			statusType,
			disabledExport: false
		};
	},
	methods: {
		exportList() {
			this.disabledExport = true;
			warehouseContractExport({
				...this.form.getFieldsValue()
			})
				.then(res => {
					comDownload(res, undefined, `${moment().format('YYYYMMDD')}仓储租赁合同.xls`);
				})
				.finally(() => {
					this.disabledExport = false;
				});
		},
		getTypeTextByValue(type, value) {
			for (let i = 0; i < this[type].length; i++) {
				if (this[type][i].value == value) {
					return this[type][i].label;
				}
			}
		},
		changeStatusStop(item) {
			warehouseContractStop({
				id: item.id
			}).then(res => {
				if (res.success) {
					this.$message.success('操作成功');
					this.getList();
				}
			});
		},
		changeStatus(item) {
			warehouseContractStart({
				id: item.id
			}).then(res => {
				if (res.success) {
					this.$message.success('操作成功');
					this.getList();
				}
			});
		},
		deleteItem(item) {
			this.$confirm({
				title: '提示',
				content: '确定要删除吗？',
				cancelText: '取消',
				okText: '确定',
				onOk: () => {
					warehouseContractDelete({
						id: item.id
					}).then(res => {
						if (res.success) {
							this.$message.success('删除成功');
							this.getList();
						}
					});
				},
				onCancel: () => {
					return;
				}
			});
		},
		changeSearch(info) {
			this.pagination.pageNo = 1;
			this.searchParams = info;
			this.getList();
		},
		resetValues() {
			this.pagination.pageNo = 1;
			this.getList();
		},

		edit(item) {
			this.$router.push({
				path: '/center/steelStorage/warehouse/detail',
				query: {
					type: 'edit',
					id: item.id
				}
			});
		},
		deatils(item) {
			this.$router.push({
				path: '/center/steelStorage/warehouse/detail',
				query: {
					type: 'preview',
					id: item.id
				}
			});
		},
		add() {
			this.$router.push({
				path: '/center/steelStorage/warehouse/detail',
				query: {
					type: 'add'
				}
			});
		},
		onChange(page, pageSize) {
			this.pageNo = page;
			this.pageSize = pageSize;
			this.getList();
		},
		onShowSizeChange(current, pageSize) {
			this.pageNo = current;
			this.pageSize = pageSize;
			this.getList();
		}
	},
	mounted() {}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less" scoped>
.take-pagination-wrap {
	width: 100%;
	height: 60px;
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
	align-items: center;
}
</style>
