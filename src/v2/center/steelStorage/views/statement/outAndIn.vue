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
					出入库统计查询</span
				>
			</div>
			<SlFormNew
				:list="searchList"
				layout="inline"
				@change="changeSearch"
				:allowClear="false"
				@resetFunc="reset"
				:isShowIcon="false"
				:isShowSearchBox="true"
			></SlFormNew>
			<a-table
				:columns="columns"
				:data-source="dataSource"
				:scroll="{ x: true }"
				class="new-table"
				:rowKey="record => record.id"
				style="margin-top: 30px"
				:pagination="false"
				:loading="loading"
			>
			</a-table>
			<i-pagination
				v-show="pagination.total >= pagination.pageSize"
				:pagination="pagination"
				@change="getList"
			/>
		</a-card>
	</div>
</template>

<script>
import { getPopupContainer } from '@/untils/factory.js';
import iPagination from "@sub/components/iPagination";
import comDownload from '@sub/utils/comDownload.js';
import moment from 'moment';
import WarehouseInput from '../../components/warehouseInput.vue';
import { filterSteelsCodeByKey } from '@sub/utils/globalCode.js';
import { exportOutAndIn, getOutAndIn, getStorageAbbreviationList, getAllWarehouseList } from '../../api';
import { ListMixin } from '@/v2/components/mixin/ListMixin';
const columns = [
	{
		title: '仓库简称',
		dataIndex: 'warehouseAbbr'
	},
	{
		title: '三方仓库单据',
		dataIndex: 'serialNo'
	},
	{
		title: '货主',
		dataIndex: 'companyName'
	},
	// {
	//   title: '采购合同号',
	//   dataIndex: 'purchaseContractNo',
	//   with:150
	// },
	{
		title: '货权接收方',
		dataIndex: 'customer'
	},
	// {
	//   title: '销售合同号',
	//   dataIndex: 'sellContractNo'
	// },
	{
		title: '作业日期',
		dataIndex: 'operateDate'
	},
	{
		title: '品名',
		dataIndex: 'materialName'
	},
	{
		title: '规格',
		dataIndex: 'specs'
	},
	{
		title: '材质',
		dataIndex: 'materialTexture'
	},
	{
		title: '厂家',
		dataIndex: 'placeOfOrigin'
	},

	{
		title: '捆包号',
		dataIndex: 'baleNo'
	},
	{
		title: '单据类型',
		dataIndex: 'workTypeDesc'
	},
	{
		title: '数量',
		dataIndex: 'quantity'
	},
	{
		title: '重量（吨）',
		dataIndex: 'weight'
	},
	{
		title: '状态',
		dataIndex: 'statusDesc',
		fixed: 'right'
	}
];

const searchList = [
	{
		decorator: ['warehouseId'],
		addonBeforeTitle: '仓库简称',
		type: 'select',
		placeholder: '请选择',
		allowClear: true,
		options: []
	},
	{
		decorator: ['serialNo'],
		addonBeforeTitle: '三方仓库单据',
		type: 'input',
		placeholder: '请输入三方仓库单据',
		allowClear: true
	},

	{
		decorator: ['date2'],
		addonBeforeTitle: '作业日期',
		realKey: ['operationDateStart', 'operationDateEnd'],
		type: 'rangePicker',
		placeholder: ['', ''],
		initialValue: [moment().format('yyyy-MM-DD'), moment().format('yyyy-MM-DD')],
		allowClear: true
	},

	{
		decorator: ['workType'],
		addonBeforeTitle: '单据类型',
		type: 'select',
		placeholder: '请选择',
		allowClear: true,
		options: filterSteelsCodeByKey('warehouseInoutReceiptType')
	},

	{
		decorator: ['status'],
		addonBeforeTitle: '状态',
		type: 'select',
		placeholder: '请选择',
		allowClear: true,
		options: filterSteelsCodeByKey('warehouseInoutAnalysisStatus')
	}
];
export default {
	mixins: [ListMixin],
	data() {
		return {
			form: this.$form.createForm(this),
			searchList,
			url: {
				list: getOutAndIn
			},
			getPopupContainer,
			pagination: {
				total: 50, // 总条数
				pageNo: 1,
				pageSize: 10
			},
			loading: false,
			columns,
			// searchParams: {
			//   warehouseAbbreviation: '',
			//   date: [moment().format('yyyy-MM-DD'), moment().format('yyyy-MM-DD')]
			// },
			list: [],
			statusList: filterSteelsCodeByKey('warehouseInoutAnalysisStatus'),
			workTypeList: filterSteelsCodeByKey('warehouseInoutReceiptType'),
			disabledExport: false,
			storageList: []
		};
	},
	mounted() {
		this.getStorageList();
	},
	methods: {
		search() {
			this.pagination.pageNo = 1;
			this.getList();
		},
		reset() {
			this.pagination.pageNo = 1;
			// this.searchParams = {
			//   warehouseAbbreviation: '',
			//   date: [moment().format('yyyy-MM-DD'), moment().format('yyyy-MM-DD')]
			// }
		},
		changeSearch(info) {
			this.pagination.pageNo = 1;
			this.searchParams = info;
			this.getList();
		},

		getPage(value) {
			this.pagination.pageNo = value;
			this.getList();
		},
		async getList(pageNo = this.pagination.pageNo, pageSize = this.pageSize) {
			if (this.url?.list) {
				this.pageSize = pageSize;
				this.pagination.pageNo = pageNo;
				const params = {
					...this.isorter,
					...this.defaultParams,
					...this.searchParams,
					...this.pagination,
					pageSize
				};
				delete params.issuedDate;
				this.loading = true;

				if (!params.operationDateStart) {
					params.operationDateStart = moment().format('yyyy-MM-DD');
					params.operationDateEnd = moment().format('yyyy-MM-DD');
				}
				try {
					const res = await this.url.list(params);
					this.dataSource = res.data ? res.data.records : res.result.records;
					this.pagination.total = res.data ? res.data.total : res.result.total;
					this.loading = false;
				} catch (error) {
					this.loading = false;
				}
			}
		},
		async exportList() {
			const params = {
				...this.searchParams
			};

			// if(!params.date || !params.date.length) {
			//   this.$message.error('请选择时间')
			//   return
			// }
			if (params.date && params.date.length) {
				params.operationDateStart = params.date[0];
				params.operationDateEnd = params.date[1];
				delete params.date;
			}
			let operationDateStart = moment(params.operationDateStart).format('yyyyMMDD');
			let operationDateEnd = moment(params.operationDateEnd).format('yyyyMMDD');
			this.disabledExport = true;
			try {
				const res = await exportOutAndIn(params);
				if (params.warehouseAbbreviation) {
					comDownload(
						res,
						undefined,
						`${operationDateStart}-${operationDateEnd}${params.warehouseAbbreviation}出入库查看报表.xls`
					);
				} else {
					comDownload(res, undefined, `${operationDateStart}-${operationDateEnd}出入库查看报表.xls`);
				}

				this.disabledExport = false;
			} catch (error) {
				this.disabledExport = false;
			}
		},
		async getStorageList() {
			const res = await getAllWarehouseList({});
			const list = res.data || [];
			this.storageList = list.map(el => {
				return {
					value: el.warehouseId,
					label: el.warehouseAbbr
				};
			});
			this.searchList[0].options = this.storageList;
		}
	},
	components: {
		iPagination,
		WarehouseInput
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style scoped></style>
