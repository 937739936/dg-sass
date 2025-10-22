<template>
	<div class="slMain mt-10">
		<a-card :bordered="false">
			<div class="methods-wrap">
				<span
					slot="title"
					class="slTitle"
					><span>云票开立申请</span></span
				>
			</div>
			<SlFormNew
				:list="searchList"
				layout="inline"
				@change="handleChange"
				ref="SlFormNew"
			></SlFormNew>
			<div :class="'table-box ' + (pagination.total > 10 ? 'fixedBottom' : '')">
				<a-table
					class="new-table"
					:pagination="false"
					:columns="columns"
					:data-source="dataSource"
					:scroll="{ x: true }"
					rowKey="serialNo"
					:loading="loading"
				>
					<div
						slot="action"
						slot-scope="text, record"
					>
						<a
							href="javascript:;"
							v-auth="'shanmeiBillCenter:issu:issu:save'"
							@click="$router.push('/center/counterfoil/open/apply?id=' + record.id)"
							>开立云票</a
						>
					</div>
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
const columns = [
	{ title: '应付账款流水号', fixed: 'left', dataIndex: 'serialNo', key: 'serialNo' },
	{ title: '卖方名称', dataIndex: 'sellerName', key: 'sellerName' },
	{ title: '合同编号', dataIndex: 'contractNo', key: 'contractNo' },
	{ title: '应付账款金额', dataIndex: 'amount', key: 'amount' },
	{ title: '应付账款起始日期', dataIndex: 'beginDate', key: 'beginDate' },
	{ title: '应付账款到期日期', dataIndex: 'endDate', key: 'endDate' },
	{ title: '操作', key: 'action', fixed: 'right', scopedSlots: { customRender: 'action' } }
];
const searchList = [
	{
		decorator: ['contractNo'],
		addonBeforeTitle: '合同编号',
		type: 'input',
		placeholder: '请输入合同编号'
	},
	{
		decorator: ['serialNo'],
		addonBeforeTitle: '应付账款流水号',
		type: 'input',
		placeholder: '请输入应付账款流水号'
	},
	{
		decorator: ['sellerName'],
		addonBeforeTitle: '卖方名称',
		type: 'input',
		placeholder: '请输入卖方名称'
	},
	{
		decorator: ['beginDate'],
		addonBeforeTitle: '应付账款起始日期',
		type: 'rangePicker',
		realKey: ['beginDateStart', 'beginDateEnd']
	},
	{
		decorator: ['endDate'],
		addonBeforeTitle: '应付账款到期日期',
		type: 'rangePicker',
		realKey: ['endDateStart', 'endDateEnd']
	}
];
import { API_GetCounterfoilApplyList } from '@/v2/center/counterfoil/api/index.js';
import iPagination from "@sub/components/iPagination";
import { getPopupContainer } from '@/untils/factory.js';
import { mapGetters } from 'vuex';
import { ListMixin } from '@/v2/components/mixin/ListMixin';

export default {
	mixins: [ListMixin],
	data() {
		return {
			getPopupContainer,
			columns,
			searchList,
			selfLoad: true,
			url: {
				list: API_GetCounterfoilApplyList
			},
			defaultParams: {
				buyerUscc: '',
				status: 'COUNTERFOIL_TODO'
			}
		};
	},
	components: {
		iPagination
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		})
	},
	mounted() {
		this.initData();
	},
	methods: {
		initData() {
			return new Promise(async resolve => {
				this.defaultParams = {
					buyerUscc: this.VUEX_ST_COMPANYSUER.companyUscc,
					status: 'COUNTERFOIL_TODO'
				};
				this.getList();
				resolve(true);
			});
		},
		handleChange(data) {
			this.defaultParams = {
				buyerUscc: this.VUEX_ST_COMPANYSUER.companyUscc,
				status: 'COUNTERFOIL_TODO'
			};
			this.changeSearch(data);
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
