<template>
	<div>
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
					slot="statusDesc"
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
					<template>
						<a-space class="space">
							<a
								href="javascript:;"
								@click="gotoDetail(record)"
								>查看</a
							>
							<a
								href="javascript:;"
								v-auth="'logisticsStorageCenter:warehouseReceiptManage:receiptTransfer:confirm'"
								v-if="record.status == 'WAIT_RECEIVER_CONFIRM'"
								@click="gotoConfirm(record)"
								>确认</a
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

const columns = [
	{ title: '转让方', dataIndex: 'transferorName' },
	{ title: '货物名称', dataIndex: 'goodsName' },
	{ title: '过户数量(吨)', dataIndex: 'transferQuantity', customRender: t => formatMoney(t,4) },
	{ title: '原仓单编号', dataIndex: 'oldWarehouseReceiptNo' ,  customRender: t => t || '-'},
	{ title: '过户子仓单编号', dataIndex: 'transferChildWarehouseReceiptNo',  customRender: t => t || '-'},
	{ title: '存货子仓单编号', dataIndex: 'inventoryChildWarehouseReceiptNo', customRender: t => t || '-' },
	{ title: '仓储企业', dataIndex: 'warehouseCompanyName' },
	{ title: '仓库名称', dataIndex: 'stationName' },
	{ title: '采购合同编号', dataIndex: 'contractNo' },
	{ title: '申请日期', dataIndex: 'createDate' },
	{ title: '过户申请流水号', dataIndex: 'serialNo' },

	{ title: '流程状态', dataIndex: 'statusDesc', scopedSlots: { customRender: 'statusDesc' },fixed: 'right',  },

	{ title: '操作', key: 'action', fixed: 'right', scopedSlots: { customRender: 'action' } }
];

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
			columns,
			// constants,
			pagination: {
				pageNo: 1,
				total: 0
			},
			pageSize: 10,
			listDataSource: [],
			statusData: [
				{ label: '全部', value: 'TAB_ALL',num:0 },
				{ label: '待我方确认', value: 'TAB_WAIT_RECEIVER_CONFIRM' ,num:0},
				{ label: '待仓储方审核', value: 'TAB_STORAGE_AUDITING',num:0 },
				{ label: '待仓储方盖章', value: 'TAB_STORAGE_SIGN' ,num:0},
				{ label: '已过户', value: 'TAB_TRANSFERRED' ,num:0},
				{ label: '无效', value: 'TAB_INVALID',num:0 }
			],
			status: 'TAB_ALL',
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
		isCoreCompany() {
			return this.VUEX_ST_COMPANYSUER?.company?.companyType == 'CORE_COMPANY';
		},
		searchList() {
			if (this.isCoreCompany) {
				return [
					{
						decorator: ['serialNo'],
						addonBeforeTitle: '编号',
						type: 'input',
						placeholder: '请输入申请流水号、采购合同编号或仓单编号'
					},
					{
						decorator: ['transferorName'],
						addonBeforeTitle: '转让方',
						type: 'input',
						placeholder: '请输入转让方名称'
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
					placeholder: '请输入申请流水号、采购合同编号或仓单编号'
				},
				{
					decorator: ['transferorName'],
					addonBeforeTitle: '转让方',
					type: 'input',
					placeholder: '请输入转让方名称'
				},
				{
					decorator: ['warehouseCompanyName'],
					addonBeforeTitle: '仓储企业',
					type: 'input',
					placeholder: '请输入仓储企业'
				},

				{
					decorator: ['stationName'],
					addonBeforeTitle: '仓库名称',
					type: 'input',
					placeholder: '请输入仓储企业'
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
	mounted() {
		this.getList();
		this.getTabStatistics();
	},
	methods: {
		formatMoney,
		getPopupContainer,
		resetFunc() {
			this.searchParams = {};
			this.status = 'TAB_ALL';
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
				tabType: this.status,
				transferFlag: 2
			};
			// 判断当前是否有日期查询

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
		gotoDetail(record) {
			console.log(record);
			let path =
				this.type == 'admin'
					? '/logisticsPlatform/warehouseReceipt/warehouseReceiptAgreement/agreeManageDetail'
					: '/center/logisticsPlatform/warehouseReceipt/warehouseReceiptTransfer/detail';
			this.$router.push({
				path,
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
		// 确认
		gotoConfirm(record) {
			const query = {
				id: record.id,
			};
			this.$router.push({
				path: '/center/logisticsPlatform/warehouseReceipt/warehouseReceiptTransfer/confirm',
				query
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
					transferFlag: 2
			};
			if(params.beginDate) {
				params.beginDate = params.beginDate +  ' 00:00:00'
				params.endDate = params.endDate +  ' 23:59:59'

			}
			const res = await this.statisticsApi(params);
			const list = res.data || [];
			this.statusData.forEach(el => {
				const item = list.find(el2 => el2.tabType == el.value) || {};
				if(el.value == 'TAB_WAIT_RECEIVER_CONFIRM') {
					el.num = item.stateNum;
				}
			});
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
<style lang="less">
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
</style>
<style lang="less" scoped>
.right-arrow {
	display: inline-block;
	width: 10px;
	height: 10px;
	background: url('~@sub/assets/right_more_icon.png') no-repeat 100% / cover;
	margin-left: 2px;
}
.cancel-modal {
	/deep/ .ant-modal-header {
		background: #fff;
	}
	/deep/ .ant-modal-body {
		padding-top: 0;
		padding-bottom: 10px;

		textarea {
			height: 180px;
			background: rgba(129, 145, 169, 0.1);
			font-size: 14px;
			color: #8191a9;
		}
	}
	/deep/ .ant-modal-footer {
		border-top: 0;
	}
	.cancel-btn {
		border-color: #c6cdd8;
	}
}
.tip {
	color: rgba(0, 0, 0, 0.4);
	font-size: 14px;
	margin-bottom: 20px;
}
.del-tip {
	color: rgba(0, 0, 0, 0.5);
	margin-top: 20px;
	margin-bottom: 10px;
}
.red {
	color: red;
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
