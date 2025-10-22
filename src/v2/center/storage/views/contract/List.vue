<template>
	<div class="slMain mt-10">
		<a-card :bordered="false">
			<div class="methods-wrap">
				<span
					slot="title"
					class="slTitle"
					>合同管理</span
				>
				<a-button
					@click="add"
					v-auth="'warehouse:contract:add'"
					class="add"
					type="primary"
				>
					新增
				</a-button>
			</div>
			<SlFormNew
				:list="searchList"
				layout="inline"
				@change="changeSearch"
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
						slot="contractType"
						slot-scope="text"
					>
						{{ text.cname }}
					</template>

					<template
						slot="status"
						slot-scope="text"
					>
						<span :class="setStyle(text.name)">{{ text.cname }}</span>
					</template>

					<template
						slot="action"
						slot-scope="action, record"
					>
						<a
							v-auth="'warehouse:contract:view'"
							style="margin-right: 10px"
							@click="jumpPage('/center/storageCenter/contract/detail', record)"
							>查看</a
						>

						<template v-if="record.status.name === 'EXECUTING'">
							<a
								v-auth="'warehouse:contract:archive'"
								style="margin-right: 10px"
								@click="jumpPage('/center/storageCenter/contract/archive', record)"
								>归档</a
							>
						</template>
						<template v-if="record.status.name === 'EXECUTING' && record.contractType.name === 'DGFR'">
							<a
								v-auth="'warehouse:contract:confirmationAdd'"
								style="margin-right: 10px"
								@click="jumpPage('/center/storageCenter/contract/createConfirmationSlip', record)"
								>开具确认单</a
							>
						</template>
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
import { API_GrainContractPage } from '@/v2/center/storage/api';
import iPagination from "@sub/components/iPagination";
import { contractTypeList, contractStatusList } from '@/v2/center/storage/config/dictionaryConfig';
import { getPopupContainer } from '@/v2/utils/factory';

const columns = [
	{
		title: '合同签订日期',
		fixed: 'left',
		dataIndex: 'signTime'
	},
	{
		title: '合同编号',
		dataIndex: 'contractNo'
	},
	{
		title: '买方',
		dataIndex: 'buyerName'
	},
	{
		title: '卖方',
		dataIndex: 'sellerName'
	},
	{
		title: '商品名称',
		dataIndex: 'productName'
	},
	{
		title: '合同类型',
		dataIndex: 'contractType',
		scopedSlots: { customRender: 'contractType' }
	},
	{
		title: '合同开始日期',
		dataIndex: 'contractStartDate'
	},
	{
		title: '合同结束日期',
		dataIndex: 'contractEndDate'
	},
	{
		title: '交付日期',
		dataIndex: 'deliveryTime'
	},
	{
		title: '合同状态',
		dataIndex: 'status',
		scopedSlots: { customRender: 'status' }
	},
	{
		title: '操作',
		dataIndex: 'action',
		width: 190,
		fixed: 'right',
		scopedSlots: { customRender: 'action' }
	}
];
const searchList = [
	{
		decorator: ['contractNo'],
		addonBeforeTitle: '合同编号',
		type: 'input',
		placeholder: '请输入合同编号'
	},
	{
		decorator: ['signTime'],
		addonBeforeTitle: '合同签订日期',
		type: 'rangePicker',
		realKey: ['signTimeStart', 'signTimeEnd']
	},
	{
		decorator: ['productName'],
		addonBeforeTitle: '商品名称',
		type: 'input',
		placeholder: '请输入商品名称'
	},
	{
		decorator: ['sellerName'],
		addonBeforeTitle: '卖方',
		type: 'input',
		placeholder: '请输入卖方'
	},
	{
		decorator: ['deliveryTime'],
		addonBeforeTitle: '交付日期',
		type: 'rangePicker',
		realKey: ['deliveryTimeStart', 'deliveryTimeEnd']
	},
	{
		decorator: ['contractType'],
		addonBeforeTitle: '合同类型',
		type: 'select',
		placeholder: '请选择合同类型',
		options: contractTypeList.map(item => {
			return { value: item.value, label: item.text };
		})
	},
	{
		decorator: ['status'],
		addonBeforeTitle: '合同状态',
		type: 'select',
		placeholder: '请选择合同状态',
		options: contractStatusList.map(item => {
			return { value: item.value, label: item.text };
		})
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
			loading: false,
			url: {
				list: API_GrainContractPage
			},
			searchList
		};
	},

	methods: {
		add() {
			this.$router.push({
				path: '/center/storageCenter/contract/create'
			});
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
					id: data.id
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
