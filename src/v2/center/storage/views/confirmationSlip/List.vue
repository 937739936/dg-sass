<template>
	<div class="slMain mt-10">
		<a-card :bordered="false">
			<div class="methods-wrap">
				<span
					slot="title"
					class="slTitle"
					>商品确认单</span
				>
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
						slot="status"
						slot-scope="text, record"
					>
						<span :class="setStyle(text.name)">{{ text.cname }}</span>
					</template>

					<template
						slot="action"
						slot-scope="action, record"
					>
						<a
							v-auth="'warehouse:confirmation:view'"
							style="margin-right: 10px"
							@click="jumpPage('/center/storageCenter/confirmationSlip/detail', record)"
							>查看</a
						>
						<template v-if="VUEX_ST_COMPANYSUER.companyType == 'CORE_COMPANY' && record.status.name === 'WAREHOUSING_COMPLETED'">
							<a
								v-auth="'warehouse:confirmation:confirm'"
								@click="jumpPage('/center/storageCenter/confirmationSlip/confirm', record)"
							>
								确认
							</a>
						</template>
						<template v-if="VUEX_ST_COMPANYSUER.companyType == 'WAREHOUSE' && record.status.name === 'DONE_ISSUED'">
							<a
								v-auth="'warehouse:confirmation:seal'"
								@click="jumpPage('/center/storageCenter/confirmationSlip/confirm', record)"
							>
								盖章
							</a>
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
import { API_GrainConfirmationShipList } from '@/v2/center/storage/api';
import iPagination from "@sub/components/iPagination";
import { mapGetters } from 'vuex';
import { getPopupContainer } from '@/v2/utils/factory';
import { ListMixin } from '@/v2/components/mixin/ListMixin';
const columns = [
	{
		title: '开具日期',
		fixed: 'left',
		dataIndex: 'createDate'
	},
	{
		title: '合同编号',
		dataIndex: 'contractNo'
	},
	{
		title: '商品确认单编号',
		dataIndex: 'confirmationNo'
	},
	{
		title: '库点',
		dataIndex: 'depotPointName'
	},
	{
		title: '本次确权数量',
		dataIndex: 'clearingWeight',
		customRender: text => {
			return text && text.toLocaleString();
		}
	},
	/*{
      title: '库存均价（元/吨）',
      dataIndex: 'stockAveragePrice'
    },*/
	{
		title: '本次确权金额',
		dataIndex: 'clearingTotalAmount',
		customRender: text => {
			return text && text.toLocaleString();
		}
	},
	{
		title: '状态',
		dataIndex: 'status',
		scopedSlots: { customRender: 'status' }
	},
	{
		title: '操作',
		dataIndex: 'action',
		width: 120,
		fixed: 'right',
		scopedSlots: { customRender: 'action' }
	}
];
export default {
	mixins: [ListMixin],
	name: 'confirmationSlipList',
	components: {
		iPagination
	},
	data() {
		return {
			getPopupContainer,
			columns: [],
			dataSource: [],
			loading: false,
			url: {
				list: API_GrainConfirmationShipList
			},
			selfLoad: true,
			searchList: []
		};
	},

	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		})
	},

	created() {
		this.searchList = this.renderType(this.VUEX_ST_COMPANYSUER.companyType);
		let columnsItem = {
			title: '买方',
			dataIndex: 'buyerName'
		};
		if (this.VUEX_ST_COMPANYSUER.companyType == 'CORE_COMPANY') {
			columnsItem = {
				title: '卖方',
				dataIndex: 'sellerName'
			};
		}
		this.columns = [...columns];
		this.columns.splice(3, 0, columnsItem);

		this.getList();
	},

	methods: {
		setStyle(v) {
			return {
				DONE_ISSUED: 'g',
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
		},
		renderType(companyType) {
			return [
				{
					decorator: ['contractNo'],
					addonBeforeTitle: '合同编号',
					type: 'input',
					placeholder: '请输入合同编号'
				},
				{
					decorator: ['date'],
					addonBeforeTitle: '开具日期',
					type: 'rangePicker',
					realKey: ['dateStart', 'dateStart']
				},
				{
					decorator: ['buyerName'],
					addonBeforeTitle: '买方',
					type: 'input',
					placeholder: '请输入买方',
					isShow: companyType == 'WAREHOUSE'
				},
				{
					decorator: ['sellerName'],
					addonBeforeTitle: '卖方',
					type: 'input',
					placeholder: '请输入卖方',
					isShow: companyType == 'CORE_COMPANY'
				},
				{
					decorator: ['confirmationNo'],
					addonBeforeTitle: '商品确认单编号',
					type: 'input',
					placeholder: '请输入商品确认单编号'
				},
				{
					decorator: ['status'],
					addonBeforeTitle: '状态',
					type: 'select',
					placeholder: '请选择状态',
					options: [
						{
							value: 'DONE_ISSUED',
							label: '已开具'
						},
						{
							value: 'WAREHOUSING_COMPLETED',
							label: '仓储已签'
						},
						{
							value: 'COMPLETED',
							label: '已双签'
						}
					]
				}
			];
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
