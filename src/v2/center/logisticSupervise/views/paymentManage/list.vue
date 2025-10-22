<template>
	<div class="slMain">
		<a-spin :spinning="actionloading">
			<a-card :bordered="false">
				<div class="methods-wrap">
					<span
						slot="title"
						class="slTitle"
						>付款管理</span
					>
					<div
						class="action-box"
						@click="clickTooltipButton"
						v-auth="'logicDeliverMonitor:paymentManager:paymentRecord:add'"
					>
						<span class="button-text">新增付款</span>
					</div>
				</div>
				<SlFormNew
					ref="searchForm"
					:list="searchList"
					layout="inline"
					@change="changeSearch"
				></SlFormNew>
				<CountTabs
					:tabPanes="tabPanes"
					:exporting="exporting"
					@tabChange="tabChange"
					@exportClick="exportData"
				>
				</CountTabs>
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
						<template
							slot-scope="text, record"
							slot="payAmount"
						>
							<NumberFormatView
								:value="record.payAmount"
								:isShowMoneyTip="true"
							></NumberFormatView>
						</template>
						<template
							slot="paymentStatusDesc"
							slot-scope="text, item"
						>
							<PaymentStatusTag
								:statusDes="item.paymentStatusDesc"
								:status="item.paymentStatus"
								:paymentNo="item.paymentNo"
							/>
						</template>
					</a-table>
				</div>
				<i-pagination
					:pagination="pagination"
					@change="getList"
				/>
			</a-card>
		</a-spin>
		<StartAddPaymentModel ref="startAddPaymentModel" />
		<ConfirmModal ref="confirmModal"></ConfirmModal>
	</div>
</template>

<script>
import { ListMixin } from '@/v2/components/mixin/ListMixin';
import StartAddPaymentModel from './components/StartAddPaymentModel.vue';
import {
	API_GetPaymentList,
	API_GetPaymenAllStatusCount,
	API_PaymentListExport,
	API_DeletePaymentRecord
} from '@/v2/center/trade/api/pay';
import CountTabs from '@/v2/center/trade/views/pay/payManage/components/CountTabs';
import comDownload from '@sub/utils/comDownload.js';
import ConfirmModal from 'v2/components/modal/ConfirmModal';
import NumberFormatView from '@sub/trade/pay/components/NumberFormatView';
import PaymentStatusTag from './components/PaymentStatusTag';

export default {
	mixins: [ListMixin],
	components: {
		StartAddPaymentModel,
		CountTabs,
		ConfirmModal,
		NumberFormatView,
		PaymentStatusTag
	},
	data() {
		return {
			actionloading: false, // 是否正在加载数据(目前 重新编辑、获取追加付款编辑信息时使用)
			exporting: false, // 是否正在导出
			tabPanes: TabPanes, // 状态列表
			searchList: DefaultSearchList,
			columns: columns(this),
			url: {
				list: API_GetPaymentList
			},
			defaultParams: {
				paymentDisplayStatus: TabPanes[0].key, // 默认显示全部
				subSystemCode: 'LOGIC_MONITOR'
			}
		};
	},
	computed: {},
	watch: {
		dataSource: {
			deep: true,
			handler() {
				// 监听列表变化后进行状态统计
				this.getTabStatusCount();
			}
		}
	},
	mounted() {},
	methods: {
		// 获取所有状态的统计数量
		getTabStatusCount() {
			const params = {
				...this.defaultParams,
				...this.searchParams,
				...this.pagination,
				...this.pageSize
			};
			API_GetPaymenAllStatusCount(params).then(res => {
				if (res.success) {
					let statusCountList = res.data ?? [];
					let tabPanes = this.tabPanes;
					tabPanes.map(item => {
						if (item.key === 'NEW' || item.key === 'REJECT') {
							item.count = statusCountList.find(countItem => countItem.displayStatus === item.key)?.count || '';
						}
					});
					this.tabPanes = tabPanes;
				}
			});
		},
		// 点击Tab切换
		tabChange(activeKey) {
			this.defaultParams.paymentDisplayStatus = activeKey;
		},
		// 点击悬浮按钮
		clickTooltipButton() {
			this.$refs.startAddPaymentModel.showModal();
		},
		// 数据导出
		exportData() {
			// TODO: 导出功能待实现
			const params = {
				...this.defaultParams,
				...this.searchParams
			};
			this.exporting = true;
			API_PaymentListExport(params)
				.then(res => {
					comDownload(res.data, undefined, res.name);
				})
				.finally(() => {
					this.exporting = false;
				});
		},
		actionMinList(record) {
			let operateSet = record.operateSet || [];
			let operatorVo = {
				canEdit: operateSet.includes('SAVE'),
				canAgainSubmit: operateSet.includes('REPEAT_SUBMIT'),
				canDelete: operateSet.includes('DELETE'),
				canDetail: true
			};
			return [
				{
					text: '修改',
					key: 'edit',
					condition: operatorVo.canEdit,
					auth: 'logicDeliverMonitor:paymentManager:paymentRecord:edit',
					incident: 'paymentEdit'
				},
				{
					text: '重新提交',
					key: 'reSubmit',
					condition: operatorVo.canAgainSubmit,
					auth: 'logicDeliverMonitor:paymentManager:paymentRecord:repeatSubmit',
					incident: 'paymentResubmit'
				},
				{
					text: '删除',
					key: 'delete',
					condition: operatorVo.canDelete,
					auth: 'logicDeliverMonitor:paymentManager:paymentRecord:delete',
					incident: 'paymentDelete'
				},
				{
					text: '详情',
					key: 'detail',
					condition: operatorVo.canDetail,
					incident: 'pushToDetail',
					auth: 'logicDeliverMonitor:paymentManager:paymentRecord:detail'
				}
			];
		},
		// 付款编辑
		paymentEdit(record) {
			this.$router.push({
				path: '/center/logisticSupervise/paymentManage/add',
				query: {
					type: 'edit',
					id: record.id,
					contractType: 'TRANSPORT',
					serialNo: record.serialNo,
					productCode: record.productCode
				}
			});
		},
		// 付款重新提交
		paymentResubmit(record) {
			this.$router.push({
				path: '/center/logisticSupervise/paymentManage/add',
				query: {
					type: 'reSubmit',
					id: record.id,
					contractType: 'TRANSPORT',
					serialNo: record.serialNo,
					productCode: record.productCode,
					actionType: 'RESUBMIT_PAYMENT'
				}
			});
		},
		// 付款删除
		paymentDelete(record) {
			this.$refs.confirmModal.showModal({
				modalTitle: '确认删除',
				modalText: '确认要删除该付款吗，删除后无法恢复',
				confirm: () => {
					API_DeletePaymentRecord({ paymentNo: record.paymentNo }).then(res => {
						if (res.success) {
							this.$message.success('删除成功');
							this.getList();
						}
					});
				}
			});
		},
		// 跳转到详情页
		pushToDetail(record) {
			// 详情
			this.$router.push({
				path: '/center/logisticSupervise/paymentManage/detail',
				query: {
					id: record.id,
					contractType: 'TRANSPORT',
					serialNo: record.serialNo,
					productCode: record.productCode
				}
			});
		}
	}
};

// 所有的状态列表
const TabPanes = [
	{
		tab: '全部',
		key: 'ALL',
		count: ''
	},
	{
		tab: '待提交',
		key: 'NEW',
		count: ''
	},
	{
		tab: '驳回',
		key: 'REJECT',
		count: ''
	},
	{
		tab: '审批中',
		key: 'AUDITING',
		count: ''
	},

	{
		tab: '已付款',
		key: 'PAYED',
		count: ''
	},
	{
		tab: '无效',
		key: 'INVALID',
		count: ''
	}
];

// 默认搜索表单数据
const DefaultSearchList = [
	{
		decorator: ['serialNo'],
		addonBeforeTitle: '编号',
		type: 'input',
		placeholder: '请输入合同、资金流水号'
	},
	{
		decorator: ['sellerName'],
		addonBeforeTitle: '企业名称',
		type: 'input',
		placeholder: '请输入收款方名称'
	},
	{
		decorator: ['paymentType'],
		addonBeforeTitle: '付款类型',
		type: 'select',
		placeholder: '请选择付款类型',
		options: [
			{ value: 'PRE_SETTLEMENT', label: '预结算付款' },
			{ value: 'SETTLEMENT', label: '结算付款' }
		]
	},
	{
		decorator: ['planPayDate'],
		addonBeforeTitle: '付款日期',
		type: 'rangePicker',
		realKey: ['planPayDateBegin', 'planPayDateEnd']
	}
];

const customRender = text => text || '-';
const columns = function (that) {
	return [
		{
			title: '合同编号',
			dataIndex: 'contractNo',
			customRender
		},
		{
			title: '收款方', //卖方企业名称
			dataIndex: 'sellerName',
			customRender
		},
		{
			title: '付款类型',
			dataIndex: 'paymentTypeDesc',
			customRender
		},
		{
			title: '资金来源', // 资金类型
			dataIndex: 'payTypeName',
			customRender
		},
		{
			title: '付款金额(元)',
			dataIndex: 'payAmount',
			scopedSlots: { customRender: 'payAmount' }
			// customRender
		},
		{
			title: '付款日期',
			dataIndex: 'planPayDate',
			customRender
		},
		{
			title: '资金流水号',
			dataIndex: 'paymentNo', // 付款单号
			customRender
		},
		{
			title: '创建时间',
			dataIndex: 'createTime',
			customRender
		},
		{
			title: '付款状态',
			dataIndex: 'paymentStatusDesc',
			scopedSlots: {
				customRender: 'paymentStatusDesc'
			},
			fixed: 'right'
		},
		{
			key: 'action',
			title: '操作',
			fixed: 'right',
			customRender: (text, record) => {
				return that.actionMinDiv(record);
			}
		}
	];
};
</script>

<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less" scoped>
.slMain {
	margin-top: -10px;
	.action-box {
		background: @primary-color;
		height: 32px;
		padding: 0 14px;
		border-radius: 4px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		.button-icon {
			width: 14px;
			height: 14px;
		}
		.button-text {
			margin-left: 4px;
			color: #fff;
			font-size: 14px;
		}
	}
	.statusDes {
		display: inline-block;
		padding: 0 6px;
		height: 20px;
		border-radius: 4px;
		font-size: 12px;
		line-height: 20px;
		background: #c1d7ff;
		color: #4682f3;
		cursor: pointer;
		&.status-1 {
			// 待提交
			background: #c1d7ff;
			color: #4682f3;
		}
		&.status-2 {
			// 已生效
			background: #c5ecdd;
			color: #3eb384;
		}
		&.status-3 {
			// 审核
			background: #ffdbc8;
			color: #ff7937;
		}
		&.status-4 {
			// 驳回
			background: #f2d0d0;
			color: #dd4444;
		}
	}
}
</style>
