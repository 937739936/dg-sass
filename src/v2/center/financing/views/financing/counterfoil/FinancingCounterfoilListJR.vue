<template>
	<div class="slMain">
		<a-card :bordered="false">
			<div class="methods-wrap">
				<span
					slot="title"
					class="slTitle"
					>票据融资管理</span
				>
			</div>
			<SlFormNew
				:list="searchList"
				layout="inline"
				@change="handleChange"
				@resetFunc="resetFunc"
			></SlFormNew>
			<a-table
				style="margin-top: 20px"
				class="new-table"
				:pagination="false"
				:columns="columns"
				:data-source="listDataSource"
				:scroll="{ x: true }"
				rowKey="id"
			>
				<div
					slot="action"
					slot-scope="text, record"
				>
					<a-space>
						<a
							href="javascript:;"
							v-auth="'finance:audit:bill:check'"
							v-if="record.status == 'BANK_AUDIT'"
							@click="$router.push('financingCounterfoilDetailAudit?id=' + record.id + '&type=mai')"
							>审核</a
						>
						<a
							href="javascript:;"
							v-auth="'finance:audit:bill:seal'"
							v-if="record.status == 'BANK_TO_BE_SIGNED'"
							@click="$router.push('financingCounterfoilAuditSign?id=' + record.id)"
							>盖章</a
						>
						<a
							href="javascript:;"
							@click="$router.push('financingCounterfoilDetail?id=' + record.id + '')"
							>详情</a
						>
					</a-space>
				</div>
				<div
					slot="status"
					slot-scope="text, record"
				>
					<FinancingTipInfo
						:item="record"
						:pre="false"
					/>
				</div>
			</a-table>
			<i-pagination
				:pagination="pagination"
				@change="getList"
			/>
		</a-card>
	</div>
</template>

<script>
import { filterCodeByValueName } from '@sub/utils/globalCode.js';
import { API_FinancingCounterfoilListJR, API_FinancingbankList } from '@/v2/center/financing/api/index.js';
import iPagination from "@sub/components/iPagination";
import { getPopupContainer } from '@/untils/factory.js';
import FinancingTipInfo from '@/v2/center/financing/views/financing/common/FinancingTipInfo.vue';
import { ListMixin } from '@/v2/components/mixin/ListMixin';
import { isEqual } from 'lodash';

const searchList = [
	{
		decorator: ['serialNo'],
		addonBeforeTitle: '融资编号',
		type: 'input',
		placeholder: '请输入融资编号'
	},
	{
		decorator: ['financier'],
		addonBeforeTitle: '融资方',
		type: 'input',
		placeholder: '请输入融资方'
	},
	{
		decorator: ['billNo'],
		addonBeforeTitle: '云票编号',
		type: 'input',
		placeholder: '请输入云票编号'
	},
	{
		decorator: ['issuerName'],
		addonBeforeTitle: '开立方',
		type: 'input',
		placeholder: '请输入开立方'
	},
	{
		decorator: ['beginDate'],
		addonBeforeTitle: '融资申请日期',
		type: 'rangePicker',
		realKey: ['beginDateStart', 'beginDateEnd']
	}
];
const columns = [
	{ title: '融资编号', dataIndex: 'serialNo', key: 'serialNo' },
	{ title: '融资方', dataIndex: 'financier', key: 'financier' },
	{ title: '开立方', dataIndex: 'issuerName', key: 'issuerName' },
	{ title: '拟融资金额(元)', dataIndex: 'planFinancingAmount', key: 'planFinancingAmount' },
	{ title: '放款金额(元)', dataIndex: 'finAmount', key: 'finAmount' },
	{ title: '融资利率（%）', dataIndex: 'rate', key: 'rate', align: 'center' },
	{ title: '融资申请日', dataIndex: 'beginDate', key: 'beginDate' },
	{ title: '云票编号', dataIndex: 'billNo', key: 'billNo' },
	{ title: '云票金额（元）', dataIndex: 'billAmount', key: 'billAmount', align: 'right' },
	{ title: '融资状态', fixed: 'right', dataIndex: 'statusText', key: 'statusText' },
	{ title: '操作', key: 'action', fixed: 'right', scopedSlots: { customRender: 'action' } }
];

export default {
	mixins: [ListMixin],
	data() {
		return {
			columns,
			getPopupContainer,
			searchList,
			chuziData: [],
			params: {
				pageSize: 10,
				pageNo: 1
			},
			listDataSource: [],
			pagination: {
				type: 'buy',
				total: 0, // 总条数
				pageNo: 1
			}
		};
	},
	components: {
		iPagination,
		FinancingTipInfo
	},
	created() {},
	mounted() {
		this.getList();
		API_FinancingbankList().then(res => {
			var list = res.data || [];
			list.forEach(item => {
				this.chuziData.push({
					text: item.name,
					value: item.bizLicenseNo
				});
			});
		});
	},
	computed: {},
	methods: {
		resetFunc() {},
		handleChange(data) {
			if (isEqual(data, this.searchParams)) {
				return;
			}
			this.searchParams = data;
			this.changeSearch(data);
		},
		getList(pageNo = this.pagination.pageNo, pageSize = 10) {
			this.pagination.pageNo = pageNo;
			this.params.pageNo = pageNo;
			this.params.pageSize = pageSize;
			API_FinancingCounterfoilListJR({
				...this.params,
				time: null
				// status:'BANK_AUDIT'
			}).then(res => {
				this.listDataSource = res.data.records;
				this.pagination.total = res.data.total;
			});
		},
		gotoSign(record, type) {
			this.$router.push({
				name: 'financingAdvanceAuditSign',
				params: {
					auditOpinion: '通过',
					type: type,
					id: record.id
				}
			});
		},
		searchSubmit() {
			this.pagination.pageNo = 1;
			delete this.params.pageNo;
			this.getList();
		},
		resetValues() {
			this.params = {
				pageSize: 10,
				pageNo: 1
			};
			this.pagination.pageNo = 1;

			this.getList();
		},
		// 获取申请日
		getTimeEnd(value, dateString) {
			this.params.beginDateStart = dateString[0];
			this.params.beginDateEnd = dateString[1];
		}
	},
	filters: {
		filterCodeByValueName
	},
	beforeRouteLeave(to, from, next) {
		// sessionStorage.setItem('buyTab', this.params.tabType)
		next();
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less" scoped>
.slMain {
	margin-top: -10px;

	/deep/ .ant-card-head .ant-card-head-title {
		border-bottom: 1px solid #e5e6eb;
		padding-bottom: 20px;
		margin-bottom: 10px;
	}
}
.title-content {
	height: 55px;
	background-color: #fff;
	padding-top: 16px;
	padding-left: 10px;
	border-bottom: 1px solid #eef0f2;
}
</style>
