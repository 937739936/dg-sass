<template>
	<div>
		<a-card :bordered="false">
			<a-form
				layout="inline"
				class="flex-search-wrap"
				:label-col="{ span: 6 }"
				:wrapper-col="{ span: 12 }"
			>
				<a-row :gutter="[20, 10]">
					<a-col :span="8">
						<a-form-item label="合同编号">
							<a-input
								placeholder="请输入合同编号"
								v-model="search.paperContractNo"
							/>
						</a-form-item>
					</a-col>
					<a-col :span="8">
						<a-form-item label="公司名称">
							<a-input
								placeholder="请输入公司名称"
								v-model="search.buyerName"
							/>
						</a-form-item>
					</a-col>
					<a-col :span="8">
						<a-form-item label="运输方式">
							<a-select
								v-model="search.transType"
								placeholder="请选择运输方式"
							>
								<a-select-option
									v-for="item in VUEX_ST_ALLCODE.offlineTransTypeDict"
									:key="item.value"
									:value="item.value"
									>{{ item.text }}</a-select-option
								>
							</a-select>
						</a-form-item>
					</a-col>
				</a-row>
				<a-row :gutter="[20, 10]">
					<a-col :span="8">
						<a-form-item label="签订日期">
							<a-range-picker
								style="width: 100%"
								@change="dateChange('contractSignTime', $event)"
								:value="contractSignTime"
							/>
						</a-form-item>
					</a-col>
					<a-col :span="8">
						<a-form-item label="交货开始日">
							<a-range-picker
								style="width: 100%"
								@change="dateChange('ExecDateStart', $event)"
								:value="ExecDateStart"
							/>
						</a-form-item>
					</a-col>
					<a-col :span="8">
						<a-form-item label="交货到期日">
							<a-range-picker
								style="width: 100%"
								@change="dateChange('ExecDateEnd', $event)"
								:value="ExecDateEnd"
							/>
						</a-form-item>
					</a-col>
				</a-row>
				<a-row :gutter="[20, 10]">
					<a-col :span="8">
						<a-form-item
							label=" "
							:colon="false"
						>
							<a-button
								type="primary"
								@click="doSearch"
								>查询</a-button
							>
							<a-button
								style="margin-left: 10px"
								@click="doReset"
								>重置</a-button
							>
						</a-form-item>
					</a-col>
				</a-row>
			</a-form>
		</a-card>
		<a-card
			:bordered="false"
			:tab-list="tabList"
			size="small"
			:active-tab-key="search.tabType"
			@tabChange="key => onTabChange(key, 'key')"
		>
			<a-table
				:bordered="false"
				:columns="columns"
				:rowKey="record => record.id"
				:dataSource="dataSource"
				:pagination="false"
				:scroll="{ x: 1300 }"
				:loading="tableLoading"
			>
				<template
					slot="contractPrice"
					slot-scope="contractPrice, record"
				>
					{{ record.followTheMarket ? '随行就市' : contractPrice }}
				</template>
				<template
					slot="execDate"
					slot-scope="execDateStart, record"
				>
					{{ execDateStart }}
					<div style="text-align: center">至</div>
					{{ record.execDateEnd }}
				</template>
				<template
					v-if="type == 'seller'"
					slot="action"
					slot-scope="action, record"
				>
					<a
						v-if="['WAIT_CONFIRM'].includes(record.status)"
						@click="goDetail(record)"
						v-auth="'coalMineDgChain:contract:sellContract:confirm'"
						>合同确认</a
					>
					<template v-else>
						<a
							style="padding-left: 10px"
							@click="goDetail(record)"
							v-auth="'coalMineDgChain:contract:sellContract:detail'"
							>查看</a
						>
						<a
							style="padding-left: 10px"
							@click.prevent="download(record)"
							v-auth="'coalMineDgChain:contract:sellContract:download'"
							>下载</a
						>
					</template>
				</template>
			</a-table>
			<i-pagination
				:pagination="pagination"
				@change="getList"
			/>
		</a-card>
	</div>
</template>
<script>
import iPagination from '@sub/components/iPagination';
import { getSellContractList, downloadSellContractAttachment } from '@/v2/center/trade/api/coal';
import { mapGetters } from 'vuex';
import comDownload from '@sub/utils/comDownload.js';
const columns = [
	{
		title: '合同编号',
		key: 'paperContractNo',
		dataIndex: 'paperContractNo'
	},
	{
		title: '买方企业名称',
		key: 'buyerName',
		dataIndex: 'buyerName'
	},
	{
		title: '基准价格（元/吨）',
		key: 'contractPrice',
		dataIndex: 'contractPrice',
		scopedSlots: { customRender: 'contractPrice' }
	},
	{
		title: '数量（吨）',
		key: 'contractQuantity',
		dataIndex: 'contractQuantity'
	},
	{
		title: '交货期限',
		key: 'execDateStart',
		dataIndex: 'execDateStart',
		width: 120,
		scopedSlots: { customRender: 'execDate' }
	},
	{
		title: '签订日期',
		key: 'contractSignTime',
		dataIndex: 'contractSignTime'
	},
	{
		title: '运输方式',
		key: 'transTypeDesc',
		dataIndex: 'transTypeDesc'
	},
	{
		title: '状态',
		key: 'statusDesc',
		dataIndex: 'statusDesc'
	},
	{
		title: '关联合同数',
		key: 'linkContractCount',
		dataIndex: 'linkContractCount'
	},
	{
		title: '创建人',
		key: 'createName',
		dataIndex: 'createName'
	},
	{
		title: '创建时间',
		key: 'createTime',
		dataIndex: 'createTime'
	},
	{
		title: '操作',
		key: 'action',
		dataIndex: 'action',
		align: 'center',
		fixed: 'right',
		scopedSlots: { customRender: 'action' }
	}
];
export default {
	props: ['type'], //type  buyer 买方  seller 卖方
	components: {
		iPagination
	},
	computed: {
		...mapGetters('config', {
			VUEX_ST_ALLCODE: 'VUEX_ST_ALLCODE'
		})
	},
	data() {
		return {
			columns,
			tabList: [
				{ key: 'TAB_ALL', tab: '全部' },
				{ key: 'TAB_WAIT_CONFIRM', tab: '待确认' },
				{ key: 'TAB_EXECUTING', tab: '执行中' },
				{ key: 'TAB_AUDITING', tab: '审批中' },
				{ key: 'TAB_COMPLETED', tab: '已完结' },
				{ key: 'TAB_NOT_EFFECTIVE', tab: '驳回' }
			],
			tableLoading: false,
			search: {
				tabType: 'TAB_ALL'
			},
			dataSource: [],
			pagination: {
				total: 0, // 总条数
				pageNo: 1
			},
			ExecDateEnd: [],
			ExecDateStart: [],
			contractSignTime: []
		};
	},
	created() {},
	mounted() {
		this.getList();
	},
	methods: {
		doSearch() {
			this.getList(1);
		},
		doReset() {
			this.search = {
				tabType: 'TAB_ALL'
			};
			this.ExecDateEnd = [];
			this.ExecDateStart = [];
			this.contractSignTime = [];
			this.getList(1);
		},
		getList(pageNo = this.pagination.pageNo, pageSize = 10) {
			this.tableLoading = true;
			getSellContractList({ ...this.search, pageNo, pageSize }).then(res => {
				let data = res.data;
				this.tableLoading = false;
				this.dataSource = data.records || [];
				this.pagination.total = data.total;
				this.pagination.pageNo = data.current;
			});
		},
		onTabChange(status) {
			this.search.tabType = status;
			this.getList(1);
		},
		dateChange(field, [start, end]) {
			if (start && end) {
				this[field] = [start, end];
			} else {
				this[field] = [];
			}
			start = start?.format('YYYY-MM-DD');
			end = end?.format('YYYY-MM-DD');
			if (field == 'contractSignTime') {
				this.search[`${field}Start`] = start ? start + ' 00:00:00' : '';
				this.search[`${field}End`] = end ? end + ' 23:59:59' : '';
			} else {
				this.search[`min${field}`] = start;
				this.search[`max${field}`] = end;
			}
		},
		download(record) {
			downloadSellContractAttachment(record.id).then(res => {
				comDownload(res.data, null, res.name);
			});
		},
		goDetail(record) {
			this.$router.push({ path: '/center/coal/sellContract/detail', query: { id: record.id } });
		}
	}
};
</script>
<style lang="less" scoped>
/deep/.ant-tabs-nav {
	.ant-tabs-tab {
		padding: 10px;
		font-size: 14px;
	}
}
</style>
