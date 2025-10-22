<template>
	<div
		class="slMain"
		style="margin: 0px"
	>
		<a-card :bordered="false">
			<div style="display: flex; justify-content: space-between">
				<span class="slTitle">实提记录查询</span>
				<div
					class="btn"
					@click="goOutList"
				>
					新增实提
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
				style="margin-top: 30px; margin-bottom: 20px"
				:pagination="false"
				:loading="loading"
			>
				<span
					slot="outboundNo"
					slot-scope="text, record"
				>
					<a-tooltip>
						<template slot="title">
							{{ record.outboundNo }}
						</template>
						<div class="outbound">{{ record.outboundNo }}</div>
					</a-tooltip>
				</span>
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
					slot="action"
					slot-scope="text, record"
				>
					<div class="action">
						<a-button
							type="link"
							@click="goDetail(record)"
							>查看</a-button
						>
						<a-button
							type="link"
							v-if="record.status == 'PART_EXTRACT'"
							@click="goAgain(record, 'again')"
							>新增实提</a-button
						>
						<a-button
							type="link"
							v-if="record.status != 'INVALID'"
							@click="cancellation(record)"
							>作废</a-button
						>
					</div>
				</span>
			</a-table>
			<TipModal
				ref="tipModal"
				tip="作废实提单，会将该实提单所有实提记录全部作废，您确定作废实提单么?"
				@save="saveCancellation"
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
import TipModal from '../../components/tipModal.vue';
import { filterSteelsCodeByKey } from '@sub/utils/globalCode.js';
import { getContractList } from '@/v2/center/steels/api/contract.js';
import { getAllWarehouseList, getActualExtractList, invalidActualExtract } from '../../api';

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
		title: '实提单号',
		dataIndex: 'serialNo'
	},
	{
		title: '出库单号',
		dataIndex: 'outboundNo',
		ellipsis: true,
		width: 200,
		scopedSlots: { customRender: 'outboundNo' }
	},
	{
		title: '出库数量',
		dataIndex: 'outboundQuantity'
	},
	{
		title: '出库重量(吨)',
		dataIndex: 'outboundWeight'
	},
	{
		title: '实提总数量',
		dataIndex: 'quantity',
		width: 200
	},
	{
		title: '实提总重量(吨)',
		dataIndex: 'weight'
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
		align: 'center',
		fixed: 'right',
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
		addonBeforeTitle: '实提单号',
		type: 'input',
		placeholder: '请输入实提单号'
	},
	{
		decorator: ['outboundNo'],
		addonBeforeTitle: '出库单号',
		type: 'input',
		placeholder: '请输入出库单号'
	},
	{
		decorator: ['status'],
		addonBeforeTitle: '状态',
		type: 'select',
		placeholder: '请选择',
		options: filterSteelsCodeByKey('actualExtractStatus')
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
				list: getActualExtractList
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
		handleChange(data) {
			this.searchParams = data;
			this.changeSearch();
		},
		resetFunc() {},
		goDetail(item) {
			this.$router.push({
				path: '/center/steelStorage/realExtract/detail',
				query: {
					id: item.id
				}
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
			await invalidActualExtract(params);
			this.$message.success('作废成功');
			this.$refs.tipModal.close();
			this.getList();
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
		goOutList() {
			this.$router.push({
				path: '/center/steelStorage/realExtract/outList'
			});
		},
		goAgain(item) {
			this.$router.push({
				path: '/center/steelStorage/realExtract/add',
				query: {
					realId: item.id
				}
			});
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
// 待提交
.statusDesc {
	padding: 2px 6px;
	background: #c1d7ff;
	color: #4682f3;
	font-size: 12px;
	border-radius: 4px;
}

.statusDesc.INVALID {
	color: rgba(0, 0, 0, 0.24995);
	background: #e0e0e0;
}
.statusDesc.PART_EXTRACT {
	color: #ff7937;
	background: #ffdac8;
}
/deep/ .ant-card {
	padding: 0px;
	padding-top: 20px;
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
