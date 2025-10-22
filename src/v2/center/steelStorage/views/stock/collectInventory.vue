<template>
	<div
		class="slMain"
		style="margin: 0px"
	>
		<a-card :bordered="false">
			<div style="display: flex; justify-content: space-between">
				<span class="slTitle">汇总库存查询</span>
			</div>
			<div class="divider"></div>
			<SlFormNew
				:list="searchList"
				layout="inline"
				:isShowReset="false"
				@change="changeSearch"
				@resetFunc="resetFunc"
			></SlFormNew>
			<div class="export-box">
				<a-button
					type="primary"
					class="export"
					@click="exportFile('汇总库存.xlsx')"
					>导出</a-button
				>
			</div>
			<a-table
				class="new-table"
				:columns="columns"
				:data-source="dataSource"
				:scroll="{ x: true }"
				:rowKey="record => record.id"
				style="margin: 20px 0"
				:pagination="false"
				:loading="loading"
			>
			</a-table>
			<i-pagination
				v-show="pagination.total >= pageSize"
				:pagination="pagination"
				@change="getList"
			/>
		</a-card>
	</div>
</template>

<script>
import { ListMixin } from '@/v2/components/mixin/ListMixin';
import moment from 'moment';
import { filterSteelsCodeByKey } from '@sub/utils/globalCode.js';

import { getAllWarehouseList } from '../../api';
import { getSummaryPageList, summaryExport } from '../../api/stock.js';
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
		title: '货主',
		dataIndex: 'companyName'
	},
	{
		title: '品名',
		dataIndex: 'materialName'
	},
	// {
	//   title: "规格",
	//   dataIndex: "specs",
	// },
	// {
	//   title: "厂家",
	//   dataIndex: "placeOfOrigin",
	// },
	// {
	//   title: "材质",
	//   dataIndex: "materialTexture",
	// },
	// {
	//   title: "捆包号",
	//   dataIndex: "baleNo",
	//   customRender:(text) => text || '-'
	// },
	{
		title: '入库数量',
		dataIndex: 'inboundQuantity'
	},
	{
		title: '入库重量(吨)',
		dataIndex: 'inboundWeight'
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
		title: '实提数量',
		dataIndex: 'extractQuantity'
	},
	{
		title: '实提重量(吨)',
		dataIndex: 'extractWeight'
	},
	{
		title: '理论数量',
		dataIndex: 'theoryQuantity',
		fixed: 'right'
	},
	{
		title: '理论重量(吨)',
		dataIndex: 'theoryWeight',
		fixed: 'right'
	},
	{
		title: '实际库存数量',
		dataIndex: 'actualQuantity',
		fixed: 'right'
	},
	{
		title: '实际库存重量(吨)',
		dataIndex: 'actualWeight',
		fixed: 'right'
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
		decorator: ['companyName'],
		addonBeforeTitle: '货主',
		type: 'input',
		placeholder: '请输入货主'
	},
	{
		decorator: ['materialName'],
		addonBeforeTitle: '品名',
		type: 'input',
		placeholder: '请输入品名'
	},
	{
		decorator: ['date', { initialValue: moment().format('YYYY-MM-DD') }],
		addonBeforeTitle: '日期',
		type: 'datePicker',
		placeholder: '请选择',
		allowClear: false
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
				list: getSummaryPageList,
				export: summaryExport
			},
			defaultParams: {
				date: moment().format('YYYY-MM-DD')
			},
			searchParams: {}
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
				path: '/center/steelStorage/inStorage/detail',
				query: {
					id: item.id
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
		goOutList() {
			this.$router.push({
				path: '/center/steelStorage/realExtract/outList'
			});
		},
		goAdd() {
			this.$router.push({
				path: '/center/steelStorage/outStorage/add'
			});
		}
	},
	components: {}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style scoped lang="less">
/deep/ .ant-card {
	padding: 0px;
	padding-top: 20px;
}
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

.new-table {
	/deep/ tr td {
		padding-top: 8px !important;
		padding-bottom: 8px !important;
	}
}
/deep/ .ant-btn {
	padding: 0 10px;
}

/deep/ .ant-table-column-title {
	font-weight: 600;
}
.export-box {
	display: flex;
	align-items: center;
	justify-content: flex-end;
	margin-top: 30px;
}
.export {
	color: @primary-color;
	background: #ffffff;
	border: 1px solid @primary-color;
	border-radius: 4px;
	width: 88px;
}
</style>
