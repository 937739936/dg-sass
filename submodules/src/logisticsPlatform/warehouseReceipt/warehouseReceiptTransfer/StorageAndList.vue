<template>
	<div class="slMain" >
		<a-card :bordered="false">
			<div class="methods-wrap">
				<span class="slTitle">{{ isWarehouse ? '仓单过户审核' : '仓单过户记录'}}</span>
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
					<div
						slot="status"
						slot-scope="text, record"
					>
										<span
						class="status"
						:class="record.status"
						>{{ record.statusDesc }}</span
					>
					</div>
					<template
						slot="action"
						slot-scope="text, record"
					>
						<!-- 核心企业 -->
						<template v-if="type == 'rest'">
							<a-space class="space">
								<!-- 核心企业端 -->
								<a
									href="javascript:;"
									@click="gotoDetail(record)"
									>查看</a
								>

								<!--  -->
								<a
									href="javascript:;"
									v-if="record.status =='TO_STORAGE_SIGN'"
									v-auth="'logisticsStorageCenter:warehouseReceiptManage:receiptTransferAudit:sign'"
									@click="gotoSign(record)"
								>
									盖章</a
								>
								<a
									href="javascript:;"
									v-auth="'logisticsStorageCenter:warehouseReceiptManage:receiptTransferAudit:audit'"
									v-if="record.status =='TO_STORAGE_AUDITING'"
									@click="gotoAudit(record)"
								>
									审核</a
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
				<div class="del-tip">确认要删除该协议吗，删除后无法恢复</div>
			</TipModal>
			<a-modal
				class="slModal cancel-modal"
				:visible="visible"
				:width="460"
				@cancel="visible = false"
				title="确认作废？"
			>
				<div class="tip"><span class="red">*</span> 请输入作废原因：</div>
				<a-textarea
					v-model="reason"
					placeholder="请输入作废原因,最多200字"
					:maxLength="200"
				/>

				<template slot="footer">
					<a-button
						key="back"
						@click="visible = false"
						class="cancel-btn"
						>取消</a-button
					>
					<a-button
						type="primary"
						@click="confirmCancel"
						style="margin-left: 20px"
						>确定</a-button
					>
				</template>
			</a-modal>
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

// 仓储的
const warehouseColumns = [
	{ title: '原仓单编号', dataIndex: 'oldWarehouseReceiptNo' },
	{ title: '过户子仓单编号', dataIndex: 'transferChildWarehouseReceiptNo' ,customRender: t => t || '-'},
	{ title: '存货子仓单编号', dataIndex: 'inventoryChildWarehouseReceiptNo',customRender: t => t || '-' },
	{ title: '接收方', dataIndex: 'receiverName' },
	{ title: '转让方', dataIndex: 'transferorName' },
	{ title: '货物名称', dataIndex: 'goodsName' },
	{ title: '过户数量(吨)', dataIndex: 'transferQuantity', customRender: t => formatMoney(t,4) },
	{ title: '仓库名称', dataIndex: 'stationName' },
 	{ title: '申请日期', dataIndex: 'createDate' },
 	{ title: '过户申请流水号', dataIndex: 'serialNo' },
	{ title: '流程状态', dataIndex: 'status', fixed: 'right', scopedSlots: { customRender: 'status' },fixed: 'right',  },
	{ title: '操作', key: 'action', fixed: 'right', scopedSlots: { customRender: 'action' } }
];
// admin端
const adminColumns = [
	{ title: '原仓单编号', dataIndex: 'oldWarehouseReceiptNo' },
	{ title: '过户子仓单编号', dataIndex: 'transferChildWarehouseReceiptNo',customRender: t => t || '-' },
	{ title: '存货子仓单编号', dataIndex: 'inventoryChildWarehouseReceiptNo',customRender: t => t || '-' },
	{ title: '接收方', dataIndex: 'receiverName' },
	{ title: '转让方', dataIndex: 'transferorName' },
	{ title: '货物名称', dataIndex: 'goodsName' },
	{ title: '过户数量(吨)', dataIndex: 'transferQuantity', customRender: t => formatMoney(t,4) },
		{ title: '仓储企业', dataIndex: 'warehouseCompanyName' },
	{ title: '仓库名称', dataIndex: 'stationName' },
	{ title: '关联合同编号', dataIndex: 'contractNo' },

 	{ title: '申请日期', dataIndex: 'createDate' },
 	{ title: '过户申请流水号', dataIndex: 'serialNo' },
	{ title: '流程状态', dataIndex: 'status', fixed: 'right', scopedSlots: { customRender: 'status' },fixed: 'right', },
	{ title: '操作', key: 'action', fixed: 'right', scopedSlots: { customRender: 'action' } }
];
const warehouseTabs = [
	{ label: '全部', value: 'TAB_ALL_WAREHOUSE',num:0},
	{ label: '待我方审核', value: 'TAB_MY_AUDITING',num:0 },
	{ label: '待我方盖章', value: 'TAB_MY_SIGN' ,num:0},
	{ label: '已过户', value: 'TAB_TRANSFERRED',num:0 },
	{ label: '无效', value: 'TAB_INVALID',num:0 }
]
const adminTabs = [
	{ label: '全部', value: 'TAB_ALL',num:0},
	{ label: '待提交', value: 'TAB_TO_SUBMIT' },
	{ label: '待接收方确认', value: 'TAB_WAIT_RECEIVER_CONFIRM' },
	{ label: '待仓储方审核', value: 'TAB_MY_AUDITING',num:0 },
	{ label: '待仓储方盖章', value: 'TAB_MY_SIGN' ,num:0},
	{ label: '已过户', value: 'TAB_TRANSFERRED',num:0 },
	{ label: '无效', value: 'TAB_INVALID',num:0 }
]
export default {
	props: {
		listApi: {},
		statisticsApi: {},
		exportApi: {},

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
			statusData: [],
			status: 'TAB_ALL_WAREHOUSE',
			searchParams: {},
			loading: false,
			visible: false,
			currentItem: {},
			reason: ''
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
		columns() {
			if (this.type == 'admin') {
				return adminColumns;
			}
			return warehouseColumns
		},
		searchList() {
			if (this.type == 'admin') {
				return [
					{
						decorator: ['serialNo'],
						addonBeforeTitle: '编号',
						type: 'input',
						placeholder: '请输入申请流水号、合同编号或仓单编号'
					},
					{
						decorator: ['transferorName'],
						addonBeforeTitle: '转让方',
						type: 'input',
						placeholder: '请输入转让方'
					},
					{
						decorator: ['receiverName'],
						addonBeforeTitle: '接收方',
						type: 'input',
						placeholder: '请输入接收方'
					},
					{
						decorator: ['stationName'],
						addonBeforeTitle: '仓库名称',
						type: 'input',
						placeholder: '请输入仓库名称'
					},
					{
						decorator: ['warehouseCompanyName'],
						addonBeforeTitle: '仓储企业',
						type: 'input',
						placeholder: '请输入企业名称'
					},

					{
						decorator: ['time'],
						addonBeforeTitle: '申请日期',
						type: 'rangePicker',
						realKey: ['beginDate', 'endDate']
					}
				];
			}
			return [
				{
					decorator: ['serialNo'],
					addonBeforeTitle: '编号',
					type: 'input',
					placeholder: '请输入申请流水号或仓单编号'
				},
				{
					decorator: ['transferorName'],
					addonBeforeTitle: '转让方',
					type: 'input',
					placeholder: '请输入转让方'
				},
				{
					decorator: ['receiverName'],
					addonBeforeTitle: '接收方',
					type: 'input',
					placeholder: '请输入接收方'
				},
				{
					decorator: ['stationName'],
					addonBeforeTitle: '仓库名称',
					type: 'input',
					placeholder: '请输入企业名称'
				},

				{
					decorator: ['time'],
					addonBeforeTitle: '申请日期',
					type: 'rangePicker',
					realKey: ['beginDate', 'endDate']
				}
			];
		}
	},
	created() {
		this.status = this.type == 'admin' ? 'TAB_ALL' : 'TAB_ALL_WAREHOUSE';
	},
	mounted() {
		this.statusData = this.type == 'admin' ? adminTabs : warehouseTabs
		this.status = this.type == 'admin' ? 'TAB_ALL' : 'TAB_ALL_WAREHOUSE';
		this.getList();
		this.getTabStatistics();
	},
	methods: {
		formatMoney,
		getPopupContainer,
		resetFunc() {
			this.searchParams = {};
			this.status = this.type == 'admin' ? 'TAB_ALL' : 'TAB_ALL_WAREHOUSE';
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
					? '/logisticsPlatform/warehouseReceipt/warehouseReceiptTransfer/detail'
					: '/center/logisticsPlatform/warehouseReceipt/warehouseReceiptTransfer/detail';
			this.$router.push({
				path,
				query: {
					id: record.id
				}
			});
		},
		gotoAudit(record) {
			this.$router.push({
				path: '/center/logisticsPlatform/warehouseReceipt/warehouseReceiptTransfer/audit',
				query: {
					id: record.id
				}
			});
		},
		// 导出
		async exportData() {
			// 仓单管理协议-【当前企业名称】-【导出日期】
			let name = `仓单管理协议-${this.VUEX_ST_COMPANYSUER.companyName}-${moment().format('YYYY-MM-DD')}.xls`;
			if (this.type == 'admin') {
				name = `仓单管理协议-${moment().format('YYYY-MM-DD')}.xls`;
			}
			const res = await this.exportApi({ ...this.searchParams, status: this.status });
			comDownload(res, undefined, name);
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
				path: '/center/logisticsPlatform/warehouseReceipt/warehouseReceiptTransfer/sign',
				query: {
					id: record.id
				}
			});
		},
		gotoConfirm(record) {
			this.$router.push({
				path: '/center/logisticsPlatform/warehouseReceipt/warehouseReceiptTransfer/confirm',
				query: {
					id: record.id
				}
			});
		},
		// 获取统计
		async getTabStatistics() {
			if (this.type == 'admin') return;
			if (!this.statisticsApi) return;
			const params = {
					...this.searchParams,
				...this.pagination,
				pageSize: this.pageSize,
				tabType: this.status,
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
				if(el.value == 'TAB_MY_SIGN') {
					el.num = item.stateNum;
				}
			});
			console.log(this.statusData)
			this.$forceUpdate();
		},
		// 作废
		cancellation(item) {
			this.currentItem = item;
			this.visible = true;
		},

		// 下载
		async download(item) {
			this.currentItem = item;
			// 电子仓单管理协议-协议编号-企业名称简称-仓储企业简称
			let name = `电子仓单管理协议-${item.ser}.xls`;
			const res = await this.exportApi({ ...this.searchParams, status: this.status });
			comDownload(res, undefined, name);
			// this.visible = true
		},
		// 确认作废
		async confirmCancel() {
			if (!this.reason) {
				this.$message.error('请输入作废原因');
				return;
			}
			const params = {
				// financingApplyId: this.financingApplyId,
				auditOpinion: this.reason
			};
			// const res = await API_FinancingMAINAudit(params);
			console.log(1111);
			this.$message.success('操作成功');
			this.pagination.pageNo = 1;
			this.getList();
		},
		del(item) {
			this.currentItem = item;
			this.$refs.delModal.open();
		},
		// 确认删除
		confirmDel() {
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

	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
	vertical-align: middle;
	background: #c9d9ff;
	color: #596fa0;
}
.AUDITING {
	background: #ffdac8;
	color: #ff7937;
}
.TRANSFERRED,
.OPENED {
	background: #c5ecdd;
	color: #3eb384;
}
.TO_STORAGE_SIGN,
.TO_STORAGE_AUDITING {
	background: #d3dffb;
	color: #4682f3;
}
.EXPIRE {
	background: #e0e0e0;
	color: rgba(0, 0, 0, 0.25);
}
.RECEIVER_REJECT,
.CANCEL,
.STORAGE_REJECT {
	background: #f2d0d0;
	color: #dd4444;
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
