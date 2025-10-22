<template>
	<div
		class="slMain"
		style="margin: 0px"
	>
		<a-card :bordered="false">
			<div style="display: flex; justify-content: space-between">
				<span class="slTitle">出库记录查询</span>
				<div
					class="btn"
					@click="goAdd"
				>
					新增出库记录
				</div>
			</div>
			<div class="divider"></div>
			<SlFormNew
				:list="searchList"
				layout="inline"
				@change="changeSearch"
				@resetFunc="resetFunc"
			></SlFormNew>
			<a-table
				class="new-table"
				:columns="columns"
				:data-source="dataSource"
				:scroll="{ x: true }"
				:rowKey="record => record.id"
				style="margin-top: 30px; margin-bottom: 10px"
				:pagination="false"
				:loading="loading"
			>
				<span
					slot="statusDesc"
					slot-scope="text, record"
				>
					<span
						class="statusDesc"
						:class="record.status"
						>{{ record.statusDesc }}</span
					>
				</span>
				<span
					slot="serialNo"
					slot-scope="text, record"
				>
					<a-tooltip>
						<template slot="title">
							{{ record.serialNo }}
						</template>
						<div class="outbound">{{ record.serialNo }}</div>
					</a-tooltip>
				</span>
				<span
					slot="action"
					slot-scope="text, record"
					style="text-align: left"
				>
					<div class="action">
						<!-- 待提交 -->
						<template v-if="record.status == 'DRAFT'">
							<a-button
								type="link"
								@click="goEdit(record)"
								>修改</a-button
							>
							<a-button
								type="link"
								@click="cancel(record)"
								>取消</a-button
							>
						</template>
						<!-- 已出库 -->
						<template v-else-if="record.status == 'DELIVERED'">
							<a-button
								type="link"
								@click="goDetail(record)"
								>查看</a-button
							>
							<a-button
								type="link"
								@click="cancellation(record)"
								>作废</a-button
							>
						</template>
						<!-- 已作废 -->
						<template v-else>
							<a-button
								type="link"
								@click="goDetail(record)"
								>查看</a-button
							>
						</template>
					</div>
				</span>
			</a-table>
			<TipModal
				ref="tipModal"
				tip="您确定作废当前出库记录么？"
				@save="saveCancellation"
			></TipModal>
			<TipModal
				ref="tipModal2"
				tip="您确定取消当前出库记录么？"
				@save="saveCancel"
			></TipModal>
			<i-pagination
				:pagination="pagination"
				v-show="pagination.total >= pageSize"
				@change="getList"
			/>
		</a-card>
	</div>
</template>

<script>
import { ListMixin } from '@/v2/components/mixin/ListMixin';
import moment from 'moment';
import { filterSteelsCodeByKey } from '@sub/utils/globalCode.js';
import TipModal from '../../components/tipModal.vue';

import { getAllWarehouseList, invalidWarehouse, getOutStorageList, deleteWarehouse } from '../../api';

import { mapMutations, mapGetters } from 'vuex';

const filterOption = (input, option) => {
	return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};
const columns = [
	{
		title: '仓库简称',
		dataIndex: 'warehouseAbbr'
	},
	{
		title: '出库单号',
		dataIndex: 'serialNo',
		width: 200,
		scopedSlots: { customRender: 'serialNo' }
	},
	{
		title: '出库日期',
		dataIndex: 'operationDate'
	},
	{
		title: '货权接收方',
		dataIndex: 'customer'
	},
	{
		title: '出库方式',
		dataIndex: 'outboundWayDesc'
	},
	{
		title: '出库数量',
		dataIndex: 'quantity'
	},
	{
		title: '出库重量(吨)',
		dataIndex: 'weight',
		customRender: txt => txt || '-'
	},
	{
		title: '类型',
		dataIndex: 'sourceDesc'
	},
	{
		title: '运输方式',
		dataIndex: 'transportModeDesc'
	},
	{
		title: '运单号',
		dataIndex: 'transportNo',
		customRender: text => text || '-'
	},

	{
		title: '状态',
		dataIndex: 'statusDesc',
		align: 'center',
		scopedSlots: { customRender: 'statusDesc' }
	},
	{
		title: '操作',
		key: 'action',
		fixed: 'right',
		align: 'center',
		scopedSlots: { customRender: 'action' }
	}
];
const searchList = [
	{
		decorator: ['warehouseId'],
		addonBeforeTitle: '仓库简称',
		type: 'select',
		placeholder: '请选择',
		showSearch: true,
		filterOption: filterOption,
		options: []
	},
	{
		decorator: ['serialNo'],
		addonBeforeTitle: '出库单号',
		type: 'input',
		placeholder: '请输入出库单号'
	},
	{
		decorator: ['transportNo'],
		addonBeforeTitle: '运单号',
		type: 'input',
		placeholder: '请输入运单号'
	},

	{
		decorator: ['transportMode'],
		addonBeforeTitle: '运输方式',
		mode: 'multiple',
		type: 'select',
		placeholder: '请选择',
		options: filterSteelsCodeByKey('warehouseTransportMode')
	},
	{
		decorator: ['source'],
		addonBeforeTitle: '类型',
		type: 'select',
		placeholder: '请选择',
		options: filterSteelsCodeByKey('inventorySource')
	},
	{
		decorator: ['status'],
		addonBeforeTitle: '状态',
		type: 'select',
		placeholder: '请选择',
		options: filterSteelsCodeByKey('warehouseOutStatus')
	}
];

export default {
	mixins: [ListMixin],
	data() {
		return {
			columns,
			searchList,
			disabledExport: false,
			url: {
				list: getOutStorageList
			},
			searchParams: {},
			currentItem: {}
		};
	},
	computed: {},
	mounted() {
		this.getStorageList();
	},
	methods: {
		resetFunc() {},
		goDetail(item) {
			this.$router.push({
				path: '/center/steelStorage/outStorage/detail',
				query: {
					id: item.id
				}
			});
		},
		goEdit(item) {
			this.$router.push({
				path: '/center/steelStorage/outStorage/add',
				query: {
					id: item.id,
					type: 'out'
				}
			});
		},
		// 获取仓库列表
		async getStorageList() {
			const res = await getAllWarehouseList({});
			const list = res.data || [];
			this.searchList[0].options = list.map(el => {
				return {
					value: el.warehouseId,
					label: el.warehouseAbbr
				};
			});
		},
		goAdd() {
			this.$router.push({
				path: '/center/steelStorage/outStorage/add'
			});
		},
		// 作废
		cancellation(item) {
			this.currentItem = item;
			this.$refs.tipModal.open();
		},
		// 确认作废
		async saveCancellation() {
			const params = {
				id: this.currentItem.id
			};
			await invalidWarehouse(params);
			this.$message.success('作废成功');
			this.$refs.tipModal.close();
			this.getList();
		},
		// 取消
		cancel(item) {
			this.currentItem = item;
			this.$refs.tipModal2.open();
		},
		// 确认取消
		async saveCancel() {
			const params = {
				id: this.currentItem.id
			};
			await deleteWarehouse(params);
			this.$message.success('取消成功');
			this.$refs.tipModal2.close();
			this.getList();
		}
	},
	components: {
		TipModal
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style scoped lang="less">
.divider {
	margin-top: 30px;
	margin-bottom: 10px;
	background: #e5e6eb;
}
.btn {
	padding: 9px 30px;
	gap: 10px;
	width: 144px;
	height: 38px;
	background: @primary-color;
	border-radius: 4px;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #fff;
	font-size: 14px;
	box-sizing: border-box;
	cursor: pointer;
}
/deep/ .ant-card {
	padding: 0px;
	padding-top: 20px;
}
// 待提交
.statusDesc {
	padding: 2px 6px;
	background: #c1d7ff;
	color: #4682f3;
	font-size: 12px;
	border-radius: 4px;
}
.statusDesc.DELIVERED {
	color: #3eb384;
	background: #c5ecdd;
}
.statusDesc.INVALID {
	color: rgba(0, 0, 0, 0.24995);
	background: #e0e0e0;
}
.statusDesc.IN_EXTRACTING {
	color: #ff7937;
	background: #ffdac8;
}
.statusDesc.FINISHED {
	color: rgba(0, 0, 0, 0.24995);
	background: #e0e0e0;
}
.new-table {
	/deep/ tr td {
		padding-top: 8px !important;
		padding-bottom: 8px !important;
	}
	/deep/ .ant-table-fixed-right tr {
		// height: 42px !important;
	}
}
/deep/ .ant-btn {
	padding: 0 10px;
}

/deep/ .ant-table-column-title {
	font-weight: 600;
}
.action {
	display: flex;
	align-items: flex-start;
}
.outbound {
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	width: 200px;
}
</style>
