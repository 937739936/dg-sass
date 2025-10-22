<template>
	<div class="slMain">
		<a-card :bordered="false">
			<div class="methods-wrap">
				<span
					slot="title"
					class="slTitle"
					>提货管理</span
				>
				<div v-auth="['dgChain:lading:lading:apply', 'logisticsStorageCenter:lading:lading:apply']">
					<a-button
						type="primary"
						@click="ladingApply"
					>
						<span style="font-size: 14px">提货申请</span>
					</a-button>
				</div>
			</div>
			<SlFormNew
				ref="searchForm"
				:list="searchList"
				layout="inline"
				@change="handleSearchChange"
				@resetFunc="resetFunc"
			></SlFormNew>
			<a-tabs
				v-model="defaultParams.issuedFlag"
				@change="issuedFlagChange"
			>
				<a-tab-pane
					key="1"
					tab="已开具"
				>
				</a-tab-pane>
				<a-tab-pane
					key="2"
					tab="已收到"
				>
				</a-tab-pane>
				<template slot="tabBarExtraContent">
					<div
						class="export-box"
						@click="exportData"
					>
						<ExportIcon class="export-icon"></ExportIcon>
						<span class="export-text">数据导出</span>
					</div>
				</template>
			</a-tabs>
			<div :class="'table-box ' + (pagination.total > 10 ? 'fixedBottom' : '')">
				<a-table
					:columns="columns"
					class="new-table"
					:bordered="false"
					rowKey="id"
					:dataSource="dataSource"
					:pagination="false"
					:loading="loading"
					:scroll="{ x: true }"
				>
					<div
						slot="statusDesc"
						slot-scope="text, item"
						:class="`statusDes status-${item.status}`"
					>
						{{ text || '-' }}
					</div>
					<div
						slot="action"
						slot-scope="action, item"
					>
						<!-- 待提交 -->
						<template>
							<a-space :size="24">
								<a
									v-if="item.showSealButton"
									href="javascript:void(0)"
									@click="handleStamp(item)"
								>
									盖章
								</a>
								<a
									href="javascript:void(0)"
									v-auth="['dgChain:lading:lading:view', 'logisticsStorageCenter:lading:lading:view']"
									@click="handleViewDetail(item)"
								>
									查看
								</a>
								<a
									href="javascript:void(0)"
									v-auth="['dgChain:lading:lading:edit', 'logisticsStorageCenter:lading:lading:edit']"
									@click="handleModify(item)"
									v-if="['BUSINESS_REJECT', 'FINANCE_REJECT', 'RISK_CONTROL_REJECT'].includes(item.status)"
									>编辑</a
								>
								<a
									href="javascript:void(0)"
									v-auth="['dgChain:lading:lading:delete', 'logisticsStorageCenter:lading:lading:delete']"
									@click="deleteItem(item)"
									v-if="['BUSINESS_REJECT', 'FINANCE_REJECT', 'RISK_CONTROL_REJECT'].includes(item.status)"
									>删除</a
								>
								<a
									href="javascript:void(0)"
									v-auth="['dgChain:lading:lading:cancel', 'logisticsStorageCenter:lading:lading:cancel']"
									@click="startInvalid(item.id)"
									v-if="
										item.status == 'EFFECTIVE' &&
										defaultParams.issuedFlag == '1' &&
										(item.businessType != 'WAREHOUSE_RECEIPTS_PLEDGE' || item.businessType != 'ACCOUNT_RECEIVABLE')
									"
									>作废</a
								>
							</a-space>
						</template>
					</div>
				</a-table>
				<i-pagination
					:pagination="pagination"
					@change="getList"
				/>
			</div>
		</a-card>
		<SelectContractModal
			ref="selectContractModal"
			@confirmSelectContract="confirmSelectContract"
		/>
		<a-modal
			v-model="isShowInvalidModal"
			title="作废原因"
			@ok="confirmInvalid"
			cancelText="取消"
			okText="确定"
			@cancel="isShowInvalidModal = false"
		>
			<a-input
				v-model.trim="invalidParams.remark"
				placeholder="请输入作废原因"
				:maxLength="255"
			/>
		</a-modal>
		<modalInfo
			ref="deleteModalInfo"
			@verify="confirmDeleteItem"
			:title="'提示信息'"
			:tip="'确认删除该条数据？'"
		/>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
import { ListMixin } from '@/v2/components/mixin/ListMixin';
import modalInfo from '@/v2/components/modalInfo/info';
import SelectContractModal from './contractList';
import { isEqual } from 'lodash';
import { API_getLadingList, API_exportLadingList, API_invalidLading, API_deleteLading } from '@/v2/center/trade/api/newLading';
import comDownload from '@sub/utils/comDownload.js';
import { ExportIcon } from '@sub/components/svg'
export default {
	mixins: [ListMixin],
	components: {
		SelectContractModal,
		modalInfo,
		ExportIcon
	},
	data() {
		return {
			searchList: searchList,
			columns: columns,
			url: {
				list: API_getLadingList
			},
			selfLoad: true,
			// issuedFlag: "1",
			defaultParams: {
				issuedFlag: '1'
			},
			isShowInvalidModal: false,
			invalidParams: {
				id: '',
				remark: ''
			}, // 作废信息
			deleteId: '' // 删除条目id
		};
	},
	computed: {
		...mapGetters('user', {
			VUEX_CURRENT_PLATEFORM: 'VUEX_CURRENT_PLATEFORM'
		}),

		modulePath() {
			let modulePath = this.$route.path.includes('/logisticsPlatform/') ? 'logisticsPlatform' : 'ladingbill';
			return modulePath;
		}
	},
	mounted() {
		if (this.modulePath == 'logisticsPlatform') {
			this.defaultParams.stationId = this.VUEX_CURRENT_PLATEFORM.stationId;
		}
		this.getList();
	},
	methods: {
		resetFunc() {},
		handleSearchChange(data) {
			if (isEqual(data, this.searchParams)) {
				return;
			}
			this.searchParams = data;
			this.changeSearch(data);
		},
		exportData() {
			// 数据导出
			const params = {
				...this.defaultParams,
				...this.searchParams
			};
			this.downloading = true;
			API_exportLadingList(params)
				.then(res => {
					comDownload(res.data, undefined, res.name);
				})
				.finally(() => {
					this.downloading = false;
				});
		},
		ladingApply() {
			// 提货申请
			this.$refs.selectContractModal.showModal();
			// this.confirmSelectContract({});
		},
		issuedFlagChange() {
			// this.defaultParams.issuedFlag = this.issuedFlag;
			this.resetSearchQuery();
		},
		resetSearchQuery() {
			this.searchParams = {};
			this.pagination = {
				total: 0, // 总条数
				pageNo: 1
			};
			this.pageSize = 10;
			this.$refs.searchForm.resetSearchQuery();
		},
		// 盖章
		handleStamp(item) {
			this.$router.push({
				path: `/center/${this.modulePath}/lading/stamp`,
				query: {
					pdfUrl: item.sealFileUrl ?? '',
					id: item.id
				}
			});
		},
		// 查看详情
		handleViewDetail(item) {
			this.$router.push({
				path: `/center/${this.modulePath}/lading/detail`,
				query: {
					id: item.id
				}
			});
		},
		// 修改
		handleModify(item) {
			this.$router.push({
				path: `/center/${this.modulePath}/lading/edit`,
				query: {
					id: item.id
				}
			});
		},
		startInvalid(id) {
			// 开启作废
			this.isShowInvalidModal = true;
			this.invalidRemark = '';
			this.invalidParams.id = id;
		},
		confirmInvalid() {
			// 确认作废
			if (this.invalidParams.remark != null && this.invalidParams.remark != '' && this.invalidParams.remark != undefined) {
				API_invalidLading({
					...this.invalidParams
				}).then(res => {
					this.$message.success('作废成功！');
					this.isShowInvalidModal = false;
					this.getList();
				});
			} else {
				this.$message.error('请输入作废原因！');
			}
		},
		// 删除
		deleteItem(record) {
			this.deleteId = record.id;
			this.$refs.deleteModalInfo.open();
		},
		confirmDeleteItem() {
			API_deleteLading({
				id: this.deleteId
			}).then(res => {
				this.$refs.deleteModalInfo.close();
				this.deleteId = '';
				this.$message.success('删除成功！');
				this.getList();
			});
		},
		confirmSelectContract(contractInfo) {
			this.$router.push({
				path: `/center/${this.modulePath}/lading/add`,
				query: {
					orderContractId: contractInfo.orderContractId,
					contractType: contractInfo.contractType
				}
			});
		}
	}
};
const statusList = [
	{
		label: '待签约',
		value: 'TO_BE_SIGNED'
	},
	{
		label: '业务审批中',
		value: 'BUSINESS_AUDIT'
	},
	{
		label: '业务审批驳回',
		value: 'BUSINESS_REJECT'
	},
	{
		label: '财务审批中',
		value: 'FINANCE_AUDIT'
	},
	{
		label: '财务审批驳回',
		value: 'FINANCE_REJECT'
	},
	{
		label: '风控审批中',
		value: 'RISK_CONTROL_AUDIT'
	},
	{
		label: '风控审批驳回',
		value: 'RISK_CONTROL_REJECT'
	},
	{
		label: '已作废',
		value: 'CANCEL'
	},
	{
		label: '已生效',
		value: 'EFFECTIVE'
	}
];

const searchList = [
	{
		decorator: ['serialNo'],
		addonBeforeTitle: '编号',
		type: 'input',
		trimSpace: true,
		placeholder: '请输入订单、合同或提货编号'
	},
	{
		decorator: ['initiatorName'],
		addonBeforeTitle: '提货开具方',
		type: 'input',
		placeholder: '请输入提货开具方企业名称'
	},
	{
		decorator: ['receiverName'],
		addonBeforeTitle: '提货接收方',
		type: 'input',
		placeholder: '请输入提货接收方企业名称'
	},
	{
		decorator: ['ladingDate'],
		addonBeforeTitle: '提货日期',
		type: 'rangePicker',
		realKey: ['ladingDateStart', 'ladingDateEnd']
	},
	{
		decorator: ['status'],
		addonBeforeTitle: '状态',
		type: 'select',
		placeholder: '请选择状态',
		options: statusList
	}
];
const customRender = text => text || '-';
const columns = [
	{
		title: '合同编号',
		dataIndex: 'contractNo',
		customRender
	},
	{
		title: '提货编号',
		dataIndex: 'ladingNo',
		customRender
	},
	{
		title: '提货开具方',
		dataIndex: 'initiatorName',
		customRender
	},
	{
		title: '提货接收方',
		dataIndex: 'receiverName',
		customRender
	},
	{
		title: '提货日期',
		dataIndex: 'ladingDateStart',
		customRender: (v, r) => {
			let text = '-';
			if (r.ladingDateStart) {
				text = r.ladingDateStart;
			}
			if (r.ladingDateEnd) {
				text += '至';
				text += r.ladingDateEnd;
			}
			return text;
		}
	},
	{
		title: '提货数量（吨）',
		dataIndex: 'quantity',
		// width: 150,
		customRender
	},
	{
		title: '状态',
		dataIndex: 'statusDesc',
		// width: 150,
		scopedSlots: {
			customRender: 'statusDesc'
		}
	},
	{
		title: '最新操作时间',
		dataIndex: 'updateDate'
		// width: 150,
	},
	{
		key: 'action',
		title: '操作',
		// width: 185,
		scopedSlots: {
			customRender: 'action'
		},
		fixed: 'right'
	}
];
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less" scoped>
.slMain {
	margin-top: -10px;
}
.export-box {
	cursor: pointer;
	.export-icon {
		width: 14px;
		height: 14px;
		margin-right: 5px;
		position: relative;
		top: 1px;
	}
	.export-text {
		font-family:
			PingFangSC-Regular,
			PingFang SC;
		color: @primary-color;
		line-height: 20px;
	}
}

.statusDes {
	display: inline-block;
	padding: 4px 6px;
	border-radius: 4px;
	font-size: 12px;
	line-height: 12px;
	background: #c1d7ff;
	color: #4682f3;
	cursor: pointer;
	&.status-RISK_CONTROL_AUDIT,
	&.status-BUSINESS_AUDIT,
	&.status-FINANCE_AUDIT {
		// 业务审批中 财务审批中
		background: #ffdac8;
		color: #ff7937;
	}
	&.status-RISK_CONTROL_REJECT,
	&.status-BUSINESS_REJECT,
	&.status-FINANCE_REJECT {
		// 业务驳回 财务驳回
		background: #f2d0d0;
		color: #d44;
	}
	&.status-CANCEL {
		// 已作废
		background: #e0e0e0;
		color: rgba(0, 0, 0, 0.25);
	}
	&.status-EFFECTIVE {
		// 已生效
		background: #c5ecdd;
		color: #3eb384;
	}
}
</style>
