<template>
	<div
		class="slMain"
		style="margin-top: -10px"
	>
		<a-card :bordered="false">
			<div class="s-title">
				<span
					slot="title"
					class="slTitle"
					>回款管理</span
				>
				<a-button
					type="primary"
					v-auth="'steel:collection:add'"
					@click="jumpPage('/center/steels/funds/collection/claimDetail')"
				>
					<span style="font-size: 14px"> <a-icon type="plus" />新增回款</span>
				</a-button>
			</div>
			<SlFormNew
				:list="searchList"
				layout="inline"
				@change="changeSearch"
				:allowClear="false"
				@resetFunc="resetValues"
				:isShowIcon="false"
				:isShowSearchBox="true"
			></SlFormNew>
			<div class="table-wrap">
				<a-table
					:columns="columns"
					rowKey="id"
					class="new-table"
					:dataSource="dataSource"
					:pagination="false"
					:loading="loading"
					:scroll="{ x: true }"
				>
					<span
						slot="collectionDate"
						slot-scope="collectionDate"
					>
						{{ collectionDate || '-' }}
					</span>
					<template
						slot="collectionAmount"
						slot-scope="collectionAmount"
					>
						<span v-if="collectionAmount">{{ collectionAmount | formatMoney(2) }}</span>
						<span v-else>{{ collectionAmount }}</span>
					</template>
					<template
						slot="claimedAmount"
						slot-scope="claimedAmount"
					>
						<span v-if="claimedAmount">{{ claimedAmount | formatMoney(2) }}</span>
						<span v-else>{{ claimedAmount }}</span>
					</template>
					<template
						slot="claimAmount"
						slot-scope="claimAmount"
					>
						<span v-if="claimAmount">{{ claimAmount | formatMoney(2) }}</span>
						<span v-else>{{ claimAmount }}</span>
					</template>
					<template
						slot="collectionAmount"
						slot-scope="collectionAmount"
					>
						<span v-if="collectionAmount">{{ collectionAmount | formatMoney(2) }}</span>
						<span v-else>{{ collectionAmount }}</span>
					</template>
					<template
						slot="action"
						slot-scope="record"
						@click="onPageState"
					>
						<a-space>
							<a
								v-auth="'steel:collection:view'"
								@click="jumpPage(record, 'detail')"
								>查看</a
							>
							<a
								v-auth="'steel:collection:claim'"
								@click="jumpPage(record, 'view', 'again')"
								v-if="record.status !== 'CLAIMED' && record.ifClaimContinue && record.dataSource == 'MANUAL'"
								>认领</a
							>
							<a
								v-auth="'steel:collection:delete'"
								v-if="record.status === 'UNCLAIMED' && record.dataSource == 'MANUAL'"
								@click="del(record)"
								>删除</a
							>
						</a-space>
					</template>
				</a-table>
				<i-pagination
					:pagination="pagination"
					@change="getList"
				/>
			</div>
		</a-card>

		<invoice-info-modal
			:id="id"
			:type="collectionType"
			:visible="invoiceModalVisible"
			@cancel="toCancel"
		></invoice-info-modal>
	</div>
</template>

<script>
import { API_GetTableSorter } from '@/v2/api';
import { collectionPage, delCollection } from '@/v2/center/steels/api/funds.js';
import iPagination from "@sub/components/iPagination";
import invoiceInfoModal from '../components/invoiceInfoModal';
import { mapMutations, mapGetters } from 'vuex';
import { filterSteelsCodeByKey } from '@sub/utils/globalCode.js';
import { colSpan, formLayout } from '@/v2/config/layoutConfig';
const columns = [
	{ title: '资金流水号', dataIndex: 'serialNo' },
	{ title: '数据来源', dataIndex: 'dataSourceDesc' },
	{ title: '对方户名', dataIndex: 'collectionAccount' },
	{ title: '回款时间', dataIndex: 'collectionDate', scopedSlots: { customRender: 'collectionDate' } },
	{ title: '回款金额(元)', dataIndex: 'collectionAmount', align: 'center', scopedSlots: { customRender: 'collectionAmount' } },
	{ title: '认领状态', dataIndex: 'statusDesc', align: 'center' },
	{ title: '已认领金额(元)', dataIndex: 'claimedAmount', align: 'center', scopedSlots: { customRender: 'claimedAmount' } },
	{ title: '操作', scopedSlots: { customRender: 'action' }, fixed: 'right' }
];
import { ListMixin } from '@/v2/components/mixin/ListMixin';
const searchList = [
	{
		decorator: ['serialNo'],
		addonBeforeTitle: '资金流水号',
		type: 'input',
		placeholder: '请输入资金流水号',
		allowClear: true
	},
	{
		decorator: ['collectionAccount'],
		addonBeforeTitle: '对方户名',
		type: 'input',
		placeholder: '请输入对方户名',
		allowClear: true
	},
	{
		decorator: ['status'],
		addonBeforeTitle: '认领状态',
		type: 'select',
		placeholder: '请选择',
		allowClear: true,
		options: filterSteelsCodeByKey('claimStatus')
	},

	{
		decorator: ['date2'],
		addonBeforeTitle: '回款时间',
		realKey: ['collectionStartDate', 'collectionEndDate'],
		type: 'rangePicker',
		placeholder: ['', ''],
		allowClear: true
	},
	{
		decorator: ['collectionMode'],
		addonBeforeTitle: '回款方式',
		type: 'select',
		placeholder: '请选择',
		allowClear: true,
		options: filterSteelsCodeByKey('collectionMode')
	},
	{
		decorator: ['dataSource'],
		addonBeforeTitle: '数据来源',
		type: 'select',
		placeholder: '请选择',
		allowClear: true,
		options: [
			{
				value: 'CCSOA',
				label: 'OA同步'
			},
			{
				value: 'MANUAL',
				label: '人工录入'
			}
		]
	}
];
export default {
	name: 'CollectionClaimTable',
	components: {
		iPagination,
		invoiceInfoModal
	},
	mixins: [ListMixin],
	data() {
		return {
			columns,
			formLayout,
			colSpan,
			searchList,
			url: {
				list: collectionPage
			},
			claimStatus: filterSteelsCodeByKey('claimStatus'),
			collectionMode: filterSteelsCodeByKey('collectionMode'),
			title: '回款认领',
			form: this.$form.createForm(this),
			dataSource: [],
			isAbnormalCollection: false,
			date: [],
			flag: false,
			sortArr: [],
			menuType: '',
			params: {
				tradeNo: '',
				payer: '',
				collectionDateBegin: '',
				collectionDateEnd: '',
				dateSource: ''
			},
			sourceList: [
				{
					value: 'CCSOA',
					label: 'OA同步'
				},
				{
					value: 'MANUAL',
					label: '人工录入'
				}
			],
			loading: false,
			pagination: {
				total: 0, // 总条数
				pageNo: 1
			},
			radioStyle: {
				display: 'inline-block',
				marginBottom: '15px'
			},
			id: '', // 异常回款查看id
			collectionType: '', // 异常回款查看票面信息的类型
			invoiceModalVisible: false, // 异常回款查看票面信息弹窗visible
			tabsActive: 1 // tabs条选中值
		};
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		})
	},
	mounted() {},

	methods: {
		changeSearch(info) {
			this.pagination.pageNo = 1;
			this.searchParams = info;
			this.getList();
		},
		resetValues() {
			this.pagination.pageNo = 1;
		},
		handleTabsChange(e) {
			// 管理员身份 tabs条切换
			this.tabsActive = e;
			this.tableSort();
		},

		getOrder(data) {
			API_GetTableSorter(data).then(res => {
				if (res.success) {
					if (res.result != null) {
						this.reload(res.result.selected);
					}
				} else {
					this.$message.error('网络异常，请稍后重试！');
				}
			});
		},

		reload(data) {
			let newArr = [];
			for (let i = 0; i < data.length; i++) {
				let item = data[i];
				for (let j = 0; j < this.oldColumns.length; j++) {
					if (item.key == this.oldColumns[j].dataIndex) {
						newArr.push(this.oldColumns[j]);
					}
					if (newArr.length == data.length) {
						newArr.push(this.oldColumns[this.oldColumns.length - 1]);
						if (this.tabsActive == 2) {
							this.abnormalColumns = newArr;
						} else if (this.tabsActive == 3) {
							this.unColumns = newArr;
						} else {
							this.columns = newArr;
						}
						this.getList();
						return;
					}
				}
			}
		},

		sortVal() {
			this.sortArr = [];
			this.flag = true;
			let columnsFinal = [];
			if (this.tabsActive == 2) {
				columnsFinal = this.abnormalColumns;
			} else if (this.tabsActive == 3) {
				columnsFinal = this.unColumns;
			} else {
				columnsFinal = this.columns;
			}
			for (let i = 0; i < columnsFinal.length; i++) {
				if (i < columnsFinal.length - 1) {
					let item = columnsFinal[i];
					let obj = {};
					obj.title = item.title;
					obj.key = item.dataIndex;
					if (this.sortArr.indexOf(obj) == '-1') {
						this.sortArr.push(obj);
					}
				}
			}
		},

		jumpPage(data = {}, type, handleType) {
			let path = '/center/steels/funds/collection/claimDetail';
			// oa同步回款
			if (data.dataSource == 'CCSOA') {
				path = '/center/steels/funds/collection/oaClaimDetail';
			}
			if (data.dataSource == 'RORY_ERP') {
				path = '/center/steels/funds/collection/roClaimDetail';
			}
			this.$router.push({
				path,
				query: {
					id: data.id,
					collectionType: data.collectionType,
					type,
					handleType: handleType || ''
				}
			});
		},
		del(data) {
			delCollection(data.id).then(res => {
				if (res.success) {
					this.$message.success('删除成功');
					this.getList();
				}
			});
		},
		abnormalDetail(item) {
			// 查看异常回款票面信息
			this.id = item.id;
			this.collectionType = item.collectionType;
			this.invoiceModalVisible = true;
		},
		toCancel() {
			// 票面信息弹窗关闭
			this.invoiceModalVisible = false;
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less" scoped>
.search-wrap {
	margin: 15px 0;

	background-color: #fff;
	::v-deep.ant-form-item-label {
		padding-right: 30px;
	}
}
.setting-icon {
	display: inline-block;
	margin-left: 2px;
	font-size: 15px;
}
.s-card {
	font-family: PingFangSC-Regular;
	font-size: 14px;
	color: #141517;
}
.s-card-title {
	margin-left: 16px;
	background-color: #fff;
}
::v-deep.ant-table-wrapper {
	width: 100%;
}
.table-wrap {
	background-color: #fff;
	// padding: 16px 20px;
	margin-top: 30px;
	.ant-btn {
		margin-bottom: 10px;
	}
	::v-deep.ant-pagination {
		margin-top: 0;
	}
}
.ant-tabs-tabpane > div {
	width: 100%;
}
</style>
