<template>
	<div class="slMain">
		<a-card :bordered="false">
			<div class="methods-wrap">
				<span class="slTitle">{{ isWarehouse ? '仓单开立审核' : '仓单开立'}}</span>
				<a-space
					style="text-align: right"
					v-auth="'logisticsStorageCenter:warehouseReceiptManage:receiptApply:apply'"
					v-if="!isWarehouse && type != 'admin'"
				>
					<a-button
						type="primary"
						@click="goApply"
						>仓单开立申请</a-button
					>
				</a-space>
			</div>
			<SlFormNew
				:list="searchList"
				layout="inline"
				style="margin: 10px 0"
				@change="handleChange"
				@resetFunc="resetFunc"
			></SlFormNew>
			<Tab
				:statusData="statusData"
				:currentStatus="status"
				@callback="changeTab"
				:isExport="false"
			></Tab>
			<div :class="'table-box ' + (pagination.total > 10 ? 'fixedBottom' : '')">
				<a-table
					class="new-table"
					:pagination="false"
					:columns="columns"
					:data-source="listDataSource"
					:scroll="{ x: true }"
					rowKey="id"
					:loading="loading"
				>
					<div slot="inStorageNos" slot-scope="text, record">
						<a-tooltip placement="left">
              <template slot="title"> {{record.inStorageNos}} </template>
								<span class="omit" >	{{record.inStorageNos}}</span>
            </a-tooltip>

					</div>
					<div
						slot="status"
						slot-scope="text, record"
					>
						<span class="status" :class="record.status">{{ record.statusDesc }}</span>
					</div>
					<template
						slot="action"
						slot-scope="text, record"
					>
					
						<!-- 核心企业 -->
						<template v-if="!isWarehouse && type == 'rest'">
							<a-space class="space">
								<!-- 核心企业端 -->
								<a
									href="javascript:;"
									@click="gotoDetail(record)"
									>查看</a
								>
								<a
									href="javascript:;"
									v-if="record.status == 'TO_SUBMIT'"
									@click="gotoEdit(record)"
									>编辑</a
								>
								<a
									v-if="record.status == 'TO_SUBMIT'"
									href="javascript:;"
									v-auth="'logisticsStorageCenter:warehouseReceiptManage:receiptApply:delete'"
									@click="del(record)"
									>删除</a
								>
							</a-space>
						</template>
						<!-- 仓储企业 -->
						<template v-if="isWarehouse">
							<a-space class="space">
								<a
									href="javascript:;"
									@click="gotoDetail(record)"
									>查看</a
								>
								<!-- 待仓储方审核 -->
								<a
									href="javascript:;"
									v-if="record.status == 'TO_STORAGE_AUDITING'"
									v-auth="'logisticsStorageCenter:warehouseReceiptManage:receiptApplyAudit:audit'"
									@click="gotoAudit(record)"
								>
									审核</a
								>
								<!-- 待仓储方盖章 -->
								<a
									href="javascript:;"
									v-auth="'logisticsStorageCenter:warehouseReceiptManage:receiptApplyAudit:sign'"
									v-if="record.status == 'TO_STORAGE_SIGN'"
									@click="gotoSign(record)"
								>
									盖章</a
								>
							</a-space>
						</template>
						<!-- admin -->
						<template v-if="type == 'admin'">
							<a-space>
								<a
									href="javascript:;"
									@click="gotoDetail(record)"
									>查看</a
								>
							</a-space>
						</template>
					</template>
				</a-table>
			</div>
			<i-pagination
				:pagination="pagination"
				@change="getList"
			/>
			<TipModal
				ref="delModal"
				@ok="confirmDel"
			>
				<div class="del-tip">确认要删除该申请吗，删除后无法恢复</div>
			</TipModal>
		</a-card>
	</div>
</template>

<script>
import { formatMoney } from '@sub/filters';
import iPagination from '@sub/components/iPagination';
import Tab from '@sub/logisticsPlatform/warehouseReceipt/warehouseReceiptAgreement/Tab.vue';
import SlFormNew from '@sub/components/ui-new/Form/sl-form';
import { filterCodeByValueName, filterCodeByKey, convertCurrency } from '@sub/utils/globalCode.js';
import { getPopupContainer } from '@sub/utils/factory.js';
import comDownload from '@sub/utils/comDownload';
import moment from 'moment';
import TipModal from '@sub/components/DelModal.vue';
const customRender = t => t || '-';

// 核心企业的 一般贸易商的
const coreColumns = [
	{ title: '货物名称', dataIndex: 'goodsName' },
	{ title: '仓单数量(吨)', dataIndex: 'quantity', customRender: t =>  formatMoney(t)},
	{ title: '仓储企业', dataIndex: 'warehouseCompanyName' },
	{ title: '仓库名称', dataIndex: 'stationName' },
	{ title: '仓单编号', dataIndex: 'warehouseReceiptNo' },
	{ title: '采购合同编号', dataIndex: 'contractNo' },
	{ title: '入库编号', dataIndex: 'inStorageNos' ,scopedSlots: { customRender: 'inStorageNos' }, width: 200, ellipsis:true },
	{ title: '仓单申请日期', dataIndex: 'createDate' },
	{ title: '开立申请流水号', dataIndex: 'serialNo' },
	{ title: '流程状态', dataIndex: 'status', fixed: 'right', scopedSlots: { customRender: 'status' } },
	{ title: '操作', key: 'action', fixed: 'right', scopedSlots: { customRender: 'action' } }
];
// 仓储的
const warehouseColumns = [
	{ title: '仓单编号', dataIndex: 'warehouseReceiptNo' },
	{ title: '存货人', dataIndex: 'bailorCompanyName' },
	{ title: '货物名称', dataIndex: 'goodsName' },
	{ title: '仓单数量(吨)', dataIndex: 'quantity', customRender: t =>  formatMoney(t)},
	{ title: '仓库名称', dataIndex: 'stationName' },
	{ title: '入库编号', dataIndex: 'inStorageNos', scopedSlots: { customRender: 'inStorageNos' }, width: 200 ,ellipsis:true },
	{ title: '仓单申请日期', dataIndex: 'createDate' },
	{ title: '开立申请流水号', dataIndex: 'serialNo' },
	{ title: '流程状态', dataIndex: 'status', fixed: 'right', scopedSlots: { customRender: 'status' } },
	{ title: '操作', key: 'action', fixed: 'right', scopedSlots: { customRender: 'action' } }
];
// admin端
const adminColumns = [
	{ title: '仓单编号', dataIndex: 'warehouseReceiptNo' },
	{ title: '存货人', dataIndex: 'bailorCompanyName' },
	{ title: '货物名称', dataIndex: 'goodsName' },
	{ title: '仓单数量(吨)', dataIndex: 'quantity', customRender: t =>  formatMoney(t)},
	{ title: '仓储企业', dataIndex: 'warehouseCompanyName' },
	{ title: '仓库名称', dataIndex: 'stationName' },
	{ title: '采购合同编号', dataIndex: 'contractNo' },
	{ title: '入库编号', dataIndex: 'inStorageNos',scopedSlots: { customRender: 'inStorageNos' }, width: 200,ellipsis:true  },
	{ title: '仓单申请日期', dataIndex: 'createDate' },
	{ title: '开立申请流水号', dataIndex: 'serialNo' },
	{ title: '流程状态', dataIndex: 'statusText', fixed: 'right', scopedSlots: { customRender: 'status' } },
	{ title: '操作', key: 'action', fixed: 'right', scopedSlots: { customRender: 'action' } }
];
export default {
	props: {
		listApi: {},
		statisticsApi: {},
		exportApi: {},
		delApi: {},

		type: {
			default: 'rest'
		}
	},
	data() {
		return {
			pagination: {
				pageNo: 1,
				total: 0
			},
			pageSize: 10,
			listDataSource: [],
			status: '',
			searchParams: {},
			loading: false,
			visible: false,
			currentItem: {},
		};
	},
	components: {
		iPagination,
		Tab,
		SlFormNew,
		TipModal
	},
	computed: {
		VUEX_ST_COMPANYSUER() {
			if (this.$store.state.user) {
				return this.$store.state.user.VUEX_ST_COMPANYSUER || {};
			}
			return {};
		},
		// 仓储企业
		isWarehouse() {
			return this.VUEX_ST_COMPANYSUER.companyType == 'WAREHOUSE';
		},
		// 判断核心企业
		isCoreCompany() {
			return this.VUEX_ST_COMPANYSUER.companyType == 'CORE_COMPANY';
		},
		statusData() {
			if(this.isWarehouse) {
				return [
					{ label: '全部', value: 'TAB_ALL_WAREHOUSE',num: 0},
					{ label: '待我方审核', value: 'TAB_MY_AUDITING', num: 0},
					{ label: '待我方盖章', value: 'TAB_MY_SIGN_SEAL', num: 0},
					{ label: '已开立', value: 'TAB_OPENED',num: 0},
					{ label: '无效', value: 'TAB_INVALID',num: 0}

				]
			}
			return [
					{ label: '全部', value: 'TAB_ALL',num: 0},
					{ label: '待提交', value: 'TAB_TO_SUBMIT',num: 0},
					{ label: '待仓储方审核', value: 'TAB_AUDITING',num: 0},
					{ label: '待仓储方盖章', value: 'TAB_STORAGE_SIGN',num: 0},
					{ label: '已开立', value: 'TAB_OPENED',num: 0},
					{ label: '无效', value: 'TAB_INVALID',num: 0}

			]
		},
		columns() {
			if (this.type == 'admin') {
				return adminColumns;
			}
			if (this.isWarehouse) {
				return warehouseColumns;
			}
			return coreColumns;
		},
		searchList() {
			if (this.type == 'admin') {
				return [
					{ decorator: ['serialNo'], addonBeforeTitle: '编号', type: 'input', placeholder: '请输入申请流水号、合同编号、入库编号或仓单编号' },
					{ decorator: ['bailorCompanyName'], addonBeforeTitle: '存货人', type: 'input', placeholder: '请输入存货人' },
					{ decorator: ['warehouseCompanyName'], addonBeforeTitle: '仓储企业', type: 'input', placeholder: '请输入仓储企业' },
					{ decorator: ['stationName'], addonBeforeTitle: '仓库名称', type: 'input', placeholder: '请输入仓库名称' },
					{ decorator: ['goodsName'], addonBeforeTitle: '货物名称', type: 'input', placeholder: '请输入货物名称' },
					{
						decorator: ['time'],
						addonBeforeTitle: '仓单申请日期',
						type: 'rangePicker',
						realKey: ['beginDate', 'endDate']
					}
				];
			}
			if (this.isWarehouse) {
				return [
					{ decorator: ['serialNo'], addonBeforeTitle: '编号', type: 'input', placeholder: '请输入申请流水号、合同编号、入库编号或仓单编号' },
					{ decorator: ['bailorCompanyName'], addonBeforeTitle: '存货人', type: 'input', placeholder: '请输入存货人' },
					{ decorator: ['goodsName'], addonBeforeTitle: '货物名称', type: 'input', placeholder: '请输入货物名称' },
					{
						decorator: ['time'],
						addonBeforeTitle: '仓单申请日期',
						type: 'rangePicker',
						realKey: ['beginDate', 'endDate']
					}
				];
			}
			if(this.isCoreCompany) {
				return [
						{ decorator: ['serialNo'], addonBeforeTitle: '编号', type: 'input', placeholder: '请输入申请流水号、合同编号、入库编号或仓单编号' },
						{ decorator: ['goodsName'], addonBeforeTitle: '货物名称', type: 'input', placeholder: '请输入货物名称' },
						{
							decorator: ['time'],
							addonBeforeTitle: '仓单申请日期',
							type: 'rangePicker',
							realKey: ['beginDate', 'endDate']
						}
				]
			}

			return [
				{ decorator: ['serialNo'], addonBeforeTitle: '编号', type: 'input', placeholder: '请输入申请流水号、合同编号、入库编号或仓单编号' },
				{ decorator: ['warehouseCompanyName'], addonBeforeTitle: '仓储企业', type: 'input', placeholder: '请输入仓储企业' },
				{ decorator: ['stationName'], addonBeforeTitle: '仓库名称', type: 'input', placeholder: '请输入仓库名称' },
				{ decorator: ['goodsName'], addonBeforeTitle: '货物名称', type: 'input', placeholder: '请输入货物名称' },
				{
					decorator: ['time'],
					addonBeforeTitle: '仓单申请日期',
					type: 'rangePicker',
					realKey: ['beginDate', 'endDate']
				}
			];
		}
	},
	mounted() {
		this.status = this.isWarehouse ? 'TAB_ALL_WAREHOUSE' : 'TAB_ALL'
		this.getList();
		if(this.isWarehouse) {
			this.getTabStatistics();
		}
	
	},
	methods: {
		formatMoney,
		getPopupContainer,
		resetFunc() {
			this.searchParams = {};
			this.status = this.isWarehouse ? 'TAB_ALL_WAREHOUSE' : 'TAB_ALL'
			this.pagination.pageNo = 1;
			this.pageSize = 10;
			this.getTabStatistics();
		},
		handleChange(data) {
			this.searchParams = data;
			this.getTabStatistics();
			this.getList();
		},
		async getList(pageNo = this.pagination.pageNo, pageSize = this.pageSize) {
			this.pagination.pageNo = pageNo;
			this.loading = true;
			this.pageSize = pageSize;
			const params = {
				...this.pagination,
				pageSize: this.pageSize,
				...this.searchParams,
				tabType: this.status
			};
			if(params.beginDate) {
				params.beginDate = params.beginDate +  ' 00:00:00'
				params.endDate = params.endDate +  ' 23:59:59'

			}
			try {
				const res = await this.listApi(params);
				this.loading = false;

				this.listDataSource = res.data.records;
				this.pagination.total = res.data.total;
			} catch (error) {
				this.loading = false;
			}
		},
		goApply() {
			this.$emit('goApply');
		},
		gotoDetail(record) {
			let path =
				this.type == 'admin'
					? '/logisticsPlatform/warehouseReceipt/warehouseReceiptOpen/detail'
					: '/center/logisticsPlatform/warehouseReceipt/warehouseReceiptOpen/detail';
			this.$router.push({
				path,
				query: {
					id: record.id
				}
			});
		},
		gotoAudit(record) {
			this.$router.push({
				path: '/center/logisticsPlatform/warehouseReceipt/warehouseReceiptOpen/audit',
				query: {
					id: record.id
				}
			});
		},
		gotoEdit(record) {
			this.$router.push({
				path: '/center/logisticsPlatform/warehouseReceipt/warehouseReceiptOpen/apply',
				query: {
					id: record.id
				}
			});
		},
		// 切换tab
		changeTab(val) {
			this.status = val;
			this.getTabStatistics();
			this.getList(1, 10);
		},
		// 签章
		gotoSign(record) {
			this.$router.push({
				path: '/center/logisticsPlatform/warehouseReceipt/warehouseReceiptOpen/sign',
				query: {
					id: record.id
				}
			});
		},
		// 获取统计
		async getTabStatistics() {
			if (this.type == 'admin') return;
			if (!this.statisticsApi) return;
			if(!this.isWarehouse) return
			const params = {
				...this.searchParams,
				tabType: this.status
			};
			if(params.beginDate) {
				params.beginDate = params.beginDate +  ' 00:00:00'
				params.endDate = params.endDate +  ' 23:59:59'

			}
			const res = await this.statisticsApi(params);
			const list = res.data || [];
			this.statusData.forEach(el => {

				const item = list.find(el2 => el2.tabType == el.value) || {};
				if(el.value == 'TAB_MY_AUDITING') {
					el.num = item.stateNum;
				}
				if(el.value == 'TAB_MY_SIGN_SEAL') {
					el.num = item.stateNum;
				}
				
			});
			this.$forceUpdate();
		},
		del(item) {
			this.currentItem = item;
			this.$refs.delModal.open();
		},
		// 确认删除
		async confirmDel() {
			const params = {
				id: this.currentItem.id,
			}
			await this.delApi(params)
			this.$refs.delModal.close();
			this.pagination.pageNo = 1;
			this.getList();
		}

	},
	filters: {
		filterCodeByValueName
	}
};
</script>
<style lang="less" scoped>
@import url('~@sub/style/table-cover.less');
</style>
<style lang="less" scoped>
.slMain {
	margin-top: -10px;
}
.omit {
	width: 200px;
	display: inline-block;
	white-space: nowrap; /* 确保文本在一行内显示 */
  overflow: hidden; /* 隐藏溢出的内容 */
  text-overflow: ellipsis; 

}
.status {
	display: inline-block;
	padding: 1px 6px;
	align-items: flex-start;
	gap: 10px;
	text-align: center;
	border-radius: 4px;
	font-family: PingFang SC;
	font-size: 12px;
	margin-left: 4px;
	background: #D3DFFB;
	color: #4682F3;
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
	vertical-align: middle;
}
.AUDITING {
	background:#FFDAC8;
	color: #FF7937;
}
.TO_STORAGE_SIGN, .OPENED {
	background: #C5ECDD;
	color: #3EB384;
}
.TO_STORAGE_AUDITING {
	background: #C9D9FF;
	color: #596FA0;
}
.EXPIRE {
	background: #E0E0E0;
	color: rgba(0, 0, 0, 0.25);
}
.REJECT,.CANCEL {
	background: #F2D0D0;
	color: #DD4444;
}

.more-btn-tooltips {
	z-index: 100;
	.ant-tooltip-inner {
		padding: 10px 0;
		background-color: #fff;
		& > a {
			font-family:
				PingFangSC-Regular,
				PingFang SC;
			color: @primary-color;
			line-height: 32px;
			display: block;
			height: 32px;
			padding: 0 15px;
			text-align: center;
		}
		a {
			margin-bottom: 0 !important;
		}
		& > a:active {
			background-color: #e4ebf4;
		}
		& > a:hover {
			background-color: #e4ebf4;
		}
	}
	.ant-tooltip-arrow::before {
		background-color: #fff;
	}
}
.space {
	/deep/ .ant-space-item {
		margin-right: 12px !important;
	}
	.ant-space-item:last-child {
		margin-right: 0 !important;
	}

}
</style>
