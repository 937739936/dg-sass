<template>
	<div class="custom-main-content-inner">
		<div class="page-title">
			<span>结算单管理</span>
		</div>
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
						<a-form-item label="结算单编号">
							<a-input
								placeholder="请输入结算单编号"
								v-model="search.serialNo"
							/>
						</a-form-item>
					</a-col>
					<a-col :span="8">
						<a-form-item label="结算日期">
							<a-range-picker
								style="width: 100%"
								v-model="statementTime"
								@change="dateChange('statementTime', $event)"
							/>
						</a-form-item>
					</a-col>
				</a-row>
				<a-row :gutter="[20, 10]">
					<a-col :span="8">
						<a-form-item label="企业名称">
							<a-input
								placeholder="请输入企业名称"
								v-model="search.companyName"
							/>
						</a-form-item>
					</a-col>
					<a-col :span="8">
						<a-form-item label="结算单状态">
							<a-select
								placeholder="请选择结算单状态"
								v-model="search.status"
							>
								<a-select-option
									v-for="item in VUEX_ST_ALLCODE.terminalStatementStatusDict"
									:value="item.value"
									:key="item.value"
									>{{ item.text }}</a-select-option
								>
							</a-select>
						</a-form-item>
					</a-col>
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
								style="margin-left: 20px"
								@click="doReset"
								>重置</a-button
							>
						</a-form-item>
					</a-col>
				</a-row>
			</a-form>
			<a-table
				:bordered="false"
				:columns="columns"
				:rowKey="record => record.id"
				:dataSource="dataSource"
				:pagination="false"
				:scroll="{ x: true }"
			>
				<!-- 现在没有数据 等有数据了在调这一块 -->
				<template
					slot="action"
					slot-scope="action, record"
				>
					<a
						v-if="record.status == 'WAI_CONFIRM'"
						@click.prevent="goDetail(record.id, 'edit')"
						v-auth="'coalMineDgChain:settlement:settlement:confirm'"
						>结算单确认</a
					>
					<a
						style="padding-left: 10px"
						@click.prevent="goDetail(record.id)"
						v-auth="'coalMineDgChain:settlement:settlement:detail'"
						>查看</a
					>
					<a
						style="padding-left: 10px"
						@click.prevent="download(record)"
						v-auth="'coalMineDgChain:settlement:settlement:download'"
						>下载</a
					>
				</template>
			</a-table>
			<i-pagination
				:pagination="pagination"
				@change="doFetch"
			/>
		</a-card>
	</div>
</template>
<script>
import iPagination from '@sub/components/iPagination';
import { getStatementList, downloadStatementAttachment } from '@/v2/center/trade/api/coal';
import comDownload from '@sub/utils/comDownload.js';
import { mapGetters } from 'vuex';
const columns = [
	{
		title: '结算单类型',
		key: 'statementTypeDesc',
		dataIndex: 'statementTypeDesc'
	},
	{
		title: '结算单编号',
		key: 'serialNo',
		dataIndex: 'serialNo'
	},
	{
		title: '合同编号',
		key: 'paperContractNo',
		dataIndex: 'paperContractNo'
	},
	{
		title: '卖方企业名称',
		key: 'sellerName',
		dataIndex: 'sellerName'
	},
	{
		title: '买方企业名称',
		key: 'buyerName',
		dataIndex: 'buyerName'
	},
	{
		title: '结算日期',
		key: 'statementTime',
		dataIndex: 'statementTime'
	},
	{
		title: '本次结算金额',
		key: 'settleAmount',
		dataIndex: 'settleAmount'
	},
	{
		title: '本次结算数量',
		key: 'settleQuantity',
		dataIndex: 'settleQuantity'
	},
	{
		title: '本次结算单价',
		key: 'settleUnitPrice',
		dataIndex: 'settleUnitPrice'
	},
	{
		title: '结算单状态',
		key: 'statusDesc',
		dataIndex: 'statusDesc'
	},
	{
		title: '创建人',
		key: 'creatorName',
		dataIndex: 'creatorName'
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
			dataSource: [],
			search: {},
			statementTime: null,
			tableLoading: false,
			pagination: {
				total: 0, // 总条数
				pageNo: 1
			}
		};
	},
	mounted() {
		this.doFetch();
	},
	methods: {
		doSearch() {
			this.doFetch(1);
		},
		doReset() {
			this.search = {};
			this.statementTime = null;
			this.doFetch(1);
		},
		doFetch(pageNo = this.pagination.pageNo, pageSize = 10) {
			this.tableLoading = true;
			getStatementList({ ...this.search, pageNo, pageSize }).then(res => {
				let data = res.data;
				this.dataSource = data.records;
				this.pagination.total = data.total;
				this.pagination.pageNo = pageNo;
				this.tableLoading = false;
			});
		},
		dateChange(field, [start, end]) {
			this.search[`${field}Start`] = start.format('YYYY-MM-DD');
			this.search[`${field}End`] = end.format('YYYY-MM-DD');
		},
		download(record) {
			downloadStatementAttachment({ statementId: record.id }).then(res => {
				comDownload(res.data, null, res.name);
			});
		},
		goDetail(id, edit) {
			this.$router.push({ path: '/center/coal/statement/detail', query: { id: id, edit: edit } });
		}
	}
};
</script>
