<template>
	<div class="slMain mt-10 wrapper">
		<a-card :bordered="false">
			<div class="methods-wrap">
				<span
					slot="title"
					class="slTitle"
					>出仓单管理</span
				>
				<a-button
					@click="jumpPage('/center/storageCenter/out/receipt/create')"
					v-auth="'warehouse:outManage:outWarehouseReceipt:add'"
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
					rowKey="id"
					:dataSource="dataSource"
					:pagination="false"
					:scroll="{ x: true }"
					:loading="loading"
				>
					<template
						slot="statusDesc"
						slot-scope="text, record"
					>
						<span :class="setStyle(record.status)">{{ text }}</span>
					</template>

					<template
						slot="action"
						slot-scope="action, record"
					>
						<a
							v-auth="'warehouse:outManage:outWarehouseReceipt:view'"
							style="margin-right: 10px"
							@click="jumpPage('/center/storageCenter/out/receipt/detail', record.id)"
							>查看</a
						>
						<a
							v-if="record.status === 'WAIT_SIGN_SEAL'"
							v-auth="'warehouse:outManage:outWarehouseReceipt:seal'"
							style="margin-right: 10px"
							@click="jumpPage('/center/storageCenter/out/receipt/create', record.id)"
							>签章</a
						>
						<template v-if="record.status === 'IN_EXECUTION'">
							<a
								v-auth="'warehouse:outManage:outWarehouseReceipt:finish'"
								style="margin-right: 10px"
								@click="jumpPage('/center/storageCenter/out/receipt/finish', record.id)"
								>完结</a
							>
						</template>
						<!-- 带签章、已开具、执行中都可作废 -->
						<template
							v-if="record.status === 'ISSUED' || record.status === 'WAIT_SIGN_SEAL' || record.status === 'WAIT_EXECUTION'"
						>
							<a
								v-auth="'warehouse:outManage:outWarehouseReceipt:cancel'"
								style="margin-right: 10px"
								@click="jumpPage('/center/storageCenter/out/receipt/void', record.id)"
								>作废</a
							>
						</template>
						<a
							v-if="record.status === 'ISSUED'"
							v-auth="'warehouse:outManage:outWarehouseReceipt:audit'"
							style="margin-right: 10px"
							@click="jumpPage('/center/storageCenter/out/receipt/audit', record.id)"
							>审核</a
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
	API_OutWarehouseReceiptPage,
	API_OutWarehouseReceiptFinancialOrg,
	API_OutWarehouseReceiptStorageCompany,
	API_OutWarehouseReceiptDeliveryStatus,
	API_OutWarehouseReceiptDepotPointList,
	API_OutWarehouseReceiptCoreCompany
} from '@/v2/center/storage/api';
import iPagination from "@sub/components/iPagination";
import { mapGetters } from 'vuex';
import { getPopupContainer } from '@/v2/utils/factory';

const columns = [
	{
		title: '出仓单编号',
		fixed: 'left',
		dataIndex: 'deliveryNum'
	},
	{
		title: '开具日期',
		dataIndex: 'createDate'
	},
	{
		title: '仓储方',
		dataIndex: 'storageCompany'
	},
	{
		title: '金融机构',
		dataIndex: 'bankName'
	},
	{
		title: '提货人',
		dataIndex: 'consignee'
	},
	{
		title: '库点',
		dataIndex: 'depotPoint'
	},
	{
		title: '仓房',
		dataIndex: 'storehouse'
	},
	{
		title: '粮食品种',
		dataIndex: 'grainName'
	},
	{
		title: '出仓单数量（吨）',
		dataIndex: 'deliveryAmount',
		customRender: text => {
			return text && text.toLocaleString();
		}
	},
	{
		title: '已执行数量（吨）',
		dataIndex: 'issuedWeight',
		customRender: text => {
			return text && text.toLocaleString();
		}
	},
	{
		title: '状态',
		dataIndex: 'statusDesc',
		scopedSlots: { customRender: 'statusDesc' }
	},
	{
		title: '操作',
		dataIndex: 'action',
		fixed: 'right',
		scopedSlots: { customRender: 'action' }
	}
];
import { ListMixin } from '@/v2/components/mixin/ListMixin';
export default {
	mixins: [ListMixin],
	components: {
		iPagination
	},
	data() {
		return {
			getPopupContainer,
			statusList: [
				{
					value: 'DONE_ISSUED',
					text: '已开具'
				},
				{
					value: 'WAREHOUSING_COMPLETED',
					text: '仓储已签'
				},
				{
					value: 'COMPLETED',
					text: '已双签'
				}
			],
			columns,
			loading: false,
			date: [],
			financialOrgtList: [],
			storageCompanyList: [],
			deliveryStatusList: [],
			depotPointList: [],
			coreCompanyList: [],
			formLayout: {
				labelCol: { span: 5 },
				wrapperCol: { span: 15 }
			},
			colSpan: 8,
			form: this.$form.createForm(this),
			dataSource: [],
			params: {},
			pagination: {
				type: '',
				total: 0, // 总条数
				pageNo: 1
			},
			url: {
				list: API_OutWarehouseReceiptPage
			},
			searchList: [],
			selfLoad: true
		};
	},
	async created() {
		this.searchList = this.renderType(this.VUEX_ST_COMPANYSUER.companyType);
		this.initData();
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),

		confirmText() {
			return this.VUEX_ST_COMPANYSUER.companyType == 'CORE_COMPANY' ? '盖章' : '确认';
		}
	},
	methods: {
		initData() {
			return new Promise(async resolve => {
				if (this.VUEX_ST_COMPANYSUER.companyType == 'CORE_COMPANY') {
					await this.getDepotPointList();
					await this.getDeliveryStatusList();
					await this.getFinancialOrgtList();
					await this.getStorageCompanyList();
				}
				if (this.VUEX_ST_COMPANYSUER.companyType == 'WAREHOUSE') {
					await this.getFinancialOrgtList();
					await this.getCoreCompanyList();
				}
				if (this.VUEX_ST_COMPANYSUER.companyType == 'FINANCIAL_ORG') {
					await this.getFinancialOrgtList();
					await this.getStorageCompanyList();
					await this.getCoreCompanyList();
				}
				this.getList();
				resolve(true);
			});
		},
		renderType(companyType) {
			return [
				{
					decorator: ['deliveryNum'],
					addonBeforeTitle: '出仓单编号',
					type: 'input',
					placeholder: '请输入出仓单编号'
				},
				{
					decorator: ['createDate'],
					addonBeforeTitle: '开具日期',
					type: 'rangePicker',
					realKey: ['createStartDate', 'createEndDate']
				},
				{
					decorator: ['storageCompanyId'],
					addonBeforeTitle: '仓储方',
					type: 'select',
					placeholder: '请选择仓储方',
					options: [],
					isShow: companyType == 'CORE_COMPANY' || companyType == 'FINANCIAL_ORG'
				},
				{
					decorator: ['coreCompanyId'],
					addonBeforeTitle: '货权方',
					type: 'select',
					placeholder: '请选择货权方',
					options: [],
					isShow: companyType == 'WAREHOUSE' || companyType == 'FINANCIAL_ORG'
				},
				{
					decorator: ['bankId'],
					addonBeforeTitle: '金融机构',
					type: 'select',
					placeholder: '请选择金融机构',
					options: [],
					isShow: companyType == 'CORE_COMPANY' || companyType == 'WAREHOUSE'
				},
				{
					decorator: ['status'],
					addonBeforeTitle: '状态',
					type: 'select',
					placeholder: '请选择状态',
					options: [],
					isShow: companyType == 'CORE_COMPANY'
				},
				{
					decorator: ['depotPointFlag'],
					addonBeforeTitle: '库点',
					type: 'select',
					placeholder: '请选择库点',
					options: [],
					isShow: companyType == 'CORE_COMPANY'
				},
				{
					decorator: ['storehouse'],
					addonBeforeTitle: '仓房',
					type: 'input',
					placeholder: '请输入仓房'
				},
				{
					decorator: ['consignee'],
					addonBeforeTitle: '提货人',
					type: 'input',
					placeholder: '请输入提货人',
					isShow: companyType == 'CORE_COMPANY' || companyType == 'WAREHOUSE'
				}
			];
		},
		handleChange(data) {
			if (data.createStartDate) {
				data.createStartDate = data.createStartDate + ' 00:00:00';
				data.createEndDate = data.createEndDate + ' 23:59:59';
			}
			this.changeSearch(data);
		},
		setStyle(v) {
			/* WAIT_SIGN_SEAL(0, "待签章"),
        ISSUED(1, "已开具"),
        IN_EXECUTION(2, "执行中"),
        REVIEW_REJECTED(4, "审核拒绝"),
        CANCELLED(5, "已作废"),
        COMPLETED(6, "已完结"),
        WAIT_EXECUTION(7, "待执行"), */
			return (
				{
					REVIEW_REJECTED: 'r',
					CANCELLED: 'r'
				}[v] || 'g'
			);
		},
		jumpPage(path, id) {
			const query = {};
			if (id) {
				query.id = id;
			}
			this.$router.push({
				path,
				query
			});
		},
		getFinancialOrgtList() {
			API_OutWarehouseReceiptFinancialOrg().then(res => {
				this.financialOrgtList = res.data;
				this.searchList.forEach(item => {
					if (item.decorator[0] === 'bankId') {
						item.options = this.financialOrgtList;
					}
				});
			});
		},
		getStorageCompanyList() {
			API_OutWarehouseReceiptStorageCompany().then(res => {
				this.storageCompanyList = res.data;
				this.searchList.forEach(item => {
					if (item.decorator[0] === 'storageCompanyId') {
						item.options = this.storageCompanyList.map(item => {
							return { value: item.id, label: item.name };
						});
					}
				});
			});
		},
		getDeliveryStatusList() {
			API_OutWarehouseReceiptDeliveryStatus().then(res => {
				this.deliveryStatusList = res.data;
				this.searchList.forEach(item => {
					if (item.decorator[0] === 'status') {
						item.options = this.deliveryStatusList;
					}
				});
			});
		},
		getDepotPointList() {
			API_OutWarehouseReceiptDepotPointList().then(res => {
				this.depotPointList = res.data;
				this.searchList.forEach(item => {
					if (item.decorator[0] === 'depotPointFlag') {
						item.options = this.depotPointList;
					}
				});
			});
		},
		getCoreCompanyList() {
			API_OutWarehouseReceiptCoreCompany().then(res => {
				this.coreCompanyList = res.data;
				this.searchList.forEach(item => {
					if (item.decorator[0] === 'coreCompanyId') {
						item.options = this.coreCompanyList;
					}
				});
			});
		}
	}
};
</script>

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
