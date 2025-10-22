<template>
	<div class="slMain mt-10">
		<a-card :bordered="false">
			<div class="methods-wrap">
				<span
					slot="title"
					class="slTitle"
					>仓房使用历史查询</span
				>
			</div>
			<SlFormNew
				:list="searchList"
				layout="inline"
				@change="handleChange"
			></SlFormNew>

			<div :class="'table-box ' + (pagination.total > 10 ? 'fixedBottom' : '')">
				<a-table
					class="new-table"
					:columns="columns"
					:rowKey="record => record.id"
					:dataSource="dataSource"
					:pagination="false"
					:scroll="{ x: true }"
					:loading="loading"
				>
					<template
						slot="action"
						slot-scope="action, record"
					>
						<a
							style="margin-right: 10px"
							@click="jumpPage('/center/storageCenter/history/detail', record)"
							>使用详情</a
						>
					</template>
				</a-table>
				<i-pagination
					:pagination="pagination"
					@change="getList"
				/>
			</div>
		</a-card>
	</div>
</template>

<script>
import {
	API_GetWarehouseHistoryList,
	API_GetRelBanksList,
	API_GetFundsList,
	API_OutWarehouseReceiptGetStorageCompany
} from '@/v2/center/storage/api';
import iPagination from "@sub/components/iPagination";
import { contractTypeList, contractStatusList } from '@/v2/center/storage/config/dictionaryConfig';
import { getPopupContainer } from '@/v2/utils/factory';
import moment from 'moment';

const columns = [
	{
		title: '仓储企业',
		dataIndex: 'warehouseCompanyName'
	},
	{
		title: '库点',
		dataIndex: 'pointName'
	},
	{
		title: '仓房号',
		dataIndex: 'storehouseNum'
	},
	{
		title: '金融机构',
		dataIndex: 'bankName'
	},
	{
		title: '资金类型',
		dataIndex: 'fundName'
	},
	{
		title: '起止日期',
		dataIndex: 'startTime',
		customRender: (text, record) => {
			return `${text}~${record.endTime}`;
		}
	},
	{
		title: '合同编号',
		dataIndex: 'contractNo'
	},
	{
		title: '操作',
		dataIndex: 'action',
		fixed: 'right',
		scopedSlots: { customRender: 'action' }
	}
];
const searchList = [
	{
		decorator: ['beginTime'],
		addonBeforeTitle: '使用开始日期',
		type: 'rangePicker',
		realKey: ['beginTimeStart', 'beginTimeEnd']
	},
	{
		decorator: ['endTime'],
		addonBeforeTitle: '使用结束日期',
		type: 'rangePicker',
		realKey: ['endTimeStart', 'endTimeEnd']
	},
	{
		decorator: ['warehouseCompanyName'],
		addonBeforeTitle: '仓储企业',
		type: 'input',
		placeholder: '请输入仓储企业'
	},

	{
		decorator: ['depotPointName'],
		addonBeforeTitle: '库点',
		type: 'input',
		placeholder: '请输入库点'
	},
	{
		decorator: ['storehouseNumber'],
		addonBeforeTitle: '仓房号',
		type: 'input',
		placeholder: '请输入仓房号'
	},
	{
		decorator: ['bankName'],
		addonBeforeTitle: '金融机构',
		type: 'input',
		placeholder: '请输入金融机构'
	},
	{
		decorator: ['fundName'],
		addonBeforeTitle: '资金类型',
		type: 'input',
		placeholder: '请输入资金类型'
	},
	{
		decorator: ['contractNo'],
		addonBeforeTitle: '合同编号',
		type: 'input',
		placeholder: '请输入合同编号'
	}
];

import { ListMixin } from '@/v2/components/mixin/ListMixin';
export default {
	mixins: [ListMixin],
	name: 'storageCenterContractList',
	components: {
		iPagination
	},
	data() {
		return {
			getPopupContainer,
			columns,
			contractTypeList,
			contractStatusList,
			dataSource: [],
			beginTime: null,
			endTime: null,
			bankList: [],
			fundsList: [],
			storageCompanyList: [],
			depotPointList: [],
			storehouseList: [],
			curDepotPoint: {},
			curStorehouse: {},
			loading: false,
			url: {
				list: API_GetWarehouseHistoryList
			},
			searchList
		};
	},

	computed: {},

	created() {
		// this.getList();
		// this.getBankList();
		// this.getStorageCompanyList();
	},

	methods: {
		handleChange(data) {
			if (data.beginTimeStart) {
				data.beginTimeStart = data.beginTimeStart + ' 00:00:00';
				data.beginTimeEnd = data.beginTimeEnd + ' 23:59:59';
			}
			if (data.endTimeStart) {
				data.endTimeStart = data.endTimeStart + ' 00:00:00';
				data.endTimeEnd = data.endTimeEnd + ' 23:59:59';
			}
			this.changeSearch(data);
		},
		disabledDate(current) {
			return current > moment().endOf('day');
		},
		setStyle(v) {
			return {
				EXECUTING: 'g',
				ARCHIVED: 'r'
			}[v];
		},
		jumpPage(path, data) {
			this.$router.push({
				path,
				query: {
					batchId: data.batchId,
					id: data.storehouseId,
					coreCompanyId: data.coreCompanyId,
					storehouseId: data.storehouseId
				}
			});
		},
		getBankList() {
			// 获取金融机构
			API_GetRelBanksList().then(res => {
				if (res.success) {
					this.bankList = res.data;
				}
			});
		},
		financialTypeChange(e) {
			// 选择金融机构后获取对应资金类型
			// 当“金融机构”字段选择“无”时，显示“自有资金”选项，当为具体金融机构时，可选项
			API_GetFundsList({ bankId: e }).then(res => {
				if (res.success) {
					this.fundsList = res.data;
				}
			});
		},
		getStorehouseList(depotPoint) {
			this.storehouseList = depotPoint.storehouseList;
			this.curDepotPoint = depotPoint;
			// this.form.resetFields(['storehouseId'])
			this.curStorehouse = {};
		},
		getDepotPointList(storageCompany) {
			this.curStorageCompany = storageCompany;
			this.depotPointList = storageCompany.depotPointList;
			this.storehouseList = storageCompany.depotPointList.storehouseList;
			this.curDepotPoint = {};
			// this.form.resetFields(['depotPointFlag', 'storehouseId'])
		},
		getCurStorehouse(storehouse) {
			this.curStorehouse = storehouse;
		},
		getStorageCompanyList() {
			API_OutWarehouseReceiptGetStorageCompany().then(res => {
				if (res.success) {
					this.storageCompanyList = res.data;
				}
			});
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less" scoped>
.add {
	position: absolute;
	top: 12px;
	right: 24px;
}
.r {
	color: #ff693a;
}
.g {
	color: #4cab9d;
}
</style>
