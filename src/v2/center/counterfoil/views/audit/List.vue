<template>
	<div class="slMain mt-10">
		<a-card :bordered="false">
			<div class="methods-wrap">
				<span
					slot="title"
					class="slTitle"
					><span>云票签收审核</span></span
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
						<a-space>
							<a
								v-if="record.status == '7'"
								v-auth="'shanmeiBillCenter:receive:receive:seal'"
								href="javascript:;"
								@click="$router.push('sign?id=' + record.id)"
								>盖章</a
							>
							<a
								v-if="record.status == '6'"
								v-auth="'shanmeiBillCenter:receive:receive:check'"
								href="javascript:;"
								@click="$router.push('audit?id=' + record.id)"
								>审核</a
							>
							<a
								href="javascript:;"
								v-auth="'shanmeiBillCenter:receive:receive:detail'"
								@click="$router.push('detail?id=' + record.id)"
								>查看</a
							>
						</a-space>
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
	{ title: '云票编号', fixed: 'left', dataIndex: 'serialNo', key: 'serialNo' },
	{ title: '云票金额（元）', dataIndex: 'amount', key: 'amount' },
	{ title: '开立方', dataIndex: 'issuerName', key: 'issuerName' },
	{ title: '转让方', dataIndex: 'issuerName', key: 'issuerName1' },
	{ title: '接收方', dataIndex: 'receiverName', key: 'receiverName' },
	{ title: '开立日期', dataIndex: 'issueDate', key: 'issueDate' },
	{ title: '承诺付款日', dataIndex: 'acceptanceDate', key: 'acceptanceDate' },
	{ title: '云票状态', dataIndex: 'statusDesc', key: 'statusDesc' },
	{ title: '操作', key: 'action', fixed: 'right', scopedSlots: { customRender: 'action' } }
];
const searchList = [
	{
		decorator: ['serialNo'],
		addonBeforeTitle: '云票编号',
		type: 'input',
		placeholder: '请输入云票编号'
	},
	{
		decorator: ['issuerName1'],
		addonBeforeTitle: '开立方',
		type: 'input',
		placeholder: '请输入开立方'
	},
	{
		decorator: ['issuerName2'],
		addonBeforeTitle: '转让方',
		type: 'input',
		placeholder: '请输入转让方'
	},
	{
		decorator: ['issueDate'],
		addonBeforeTitle: '开立日期',
		type: 'rangePicker',
		realKey: ['issueDateStart', 'issueDateEnd']
	},
	{
		decorator: ['acceptanceDate'],
		addonBeforeTitle: '承诺付款日',
		type: 'rangePicker',
		realKey: ['acceptanceDateStart', 'acceptanceDateEnd']
	}
];
import { API_GetCounterfoilYunList } from '@/v2/center/counterfoil/api/index.js';
import iPagination from "@sub/components/iPagination";
import { mapGetters } from 'vuex';
import { ListMixin } from '@/v2/components/mixin/ListMixin';

export default {
	mixins: [ListMixin],
	data() {
		return {
			columns,
			searchList,
			selfLoad: true,
			url: {
				list: API_GetCounterfoilYunList
			},
			defaultParams: {
				receiverUscc: '',
				status: '6,7'
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
					receiverUscc: this.VUEX_ST_COMPANYSUER.companyUscc,
					status: '6,7'
				};
				this.searchParams.issuerName = this.searchParams.issuerName1 || this.searchParams.issuerName2;
				this.getList();
				resolve(true);
			});
		},
		handleChange(data) {
			this.defaultParams = {
				receiverUscc: this.VUEX_ST_COMPANYSUER.companyUscc,
				status: '6,7'
			};
			data.issuerName = data.issuerName1 || data.issuerName2;
			this.changeSearch(data);
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
