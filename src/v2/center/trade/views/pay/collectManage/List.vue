<template>
	<div class="slMain">
		<a-card :bordered="false">
			<div class="methods-wrap">
				<span
					slot="title"
					class="slTitle"
					>收款管理</span
				>
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
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
import { ListMixin } from '@/v2/components/mixin/ListMixin';
import CountTabs from '@/v2/center/trade/views/pay/payManage/components/CountTabs';
import NumberFormatView from '@sub/trade/pay/components/NumberFormatView';
import PaymentStatusTag from '../components/PaymentStatusTag';
import {
	API_GetCollectList,
	API_GetCollectAllStatusCount,
	API_GetCollectAllPayTypeList,
	API_CollectListExport
} from '@/v2/center/trade/api/pay';
import comDownload from '@sub/utils/comDownload.js';
import { filterCodeByKey } from '@sub/utils/globalCode.js';

export default {
	mixins: [ListMixin],
	components: {
		CountTabs,
		NumberFormatView,
		PaymentStatusTag
	},
	data() {
		return {
			exporting: false, // 是否正在导出
			searchList: DefaultSearchList,
			columns: columns(this),
			tabPanes: TabPanes, // 状态列表
			url: {
				list: API_GetCollectList
			},
			defaultParams: {
				paymentDisplayStatus: TabPanes[0].key // 默认显示全部
			}
		};
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		companyType() {
			return this.VUEX_ST_COMPANYSUER?.companyType;
		}
	},
	mounted() {
		this.initPageConfigInfo();
	},
	watch: {
		dataSource: {
			deep: true,
			handler() {
				// 监听列表变化后进行状态统计
				this.getTabStatusCount();
			}
		}
	},
	methods: {
		// 初始化页面配置信息
		initPageConfigInfo() {
			this.getPayTypeList();
		},
		// 点击Tab切换
		tabChange(activeKey) {
			this.defaultParams.paymentDisplayStatus = activeKey;
		},
		// 获取所有资金类型列表
		getPayTypeList() {
			API_GetCollectAllPayTypeList().then(res => {
				if (res.success) {
					let payTypeList = res.data ?? [];
					let options = payTypeList.map(item => {
						return {
							value: item.payType,
							label: item.payTypeName
						};
					});
					this.searchList.forEach(item => {
						if (item.decorator[0] === 'payType') {
							item.options = options;
						}
					});
				}
			});
		},
		// 获取所有状态的统计数量
		getTabStatusCount() {
			const params = {
				...this.defaultParams,
				...this.searchParams,
				...this.pagination,
				...this.pageSize
			};
			API_GetCollectAllStatusCount(params).then(res => {
				if (res.success) {
					let statusCountList = res.data ?? [];
					let tabPanes = this.tabPanes;
					tabPanes.map(item => {
						if (item.key === 'WAIT_REPAY_CONFIRM') {
							item.count = statusCountList.find(countItem => countItem.displayStatus === item.key)?.count || '';
						}
					});
					this.tabPanes = tabPanes;
				}
			});
		},
		// 数据导出
		exportData() {
			const params = {
				...this.defaultParams,
				...this.searchParams
			};
			this.exporting = true;
			API_CollectListExport(params)
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
				canConfirm: operateSet.includes('REPAY_CONFIRM_APPROVE'),
				canDetail: true
			};
			return [
				{
					text: '收款确认',
					key: 'confirm',
					incident: 'pushToConfirm',
					condition: operatorVo.canConfirm,
					auth: ['dgChain:recPay:recRecord:confirm', 'coalMineDgChain:receive:receive:confirm']
				},
				{
					text: '详情',
					key: 'detail',
					incident: 'pushToDetail',
					condition: operatorVo.canDetail,
					auth: ['dgChain:recPay:recRecord:view', 'coalMineDgChain:receive:receive:detail']
				}
			];
		},
		pushToConfirm(record) {
			let path = '/center/fund/collect/confirm';
			if (this.companyType === 'COAL_MINE') {
				path = '/center/pay/collectRecordList/confirm';
			}
			this.$router.push({
				path,
				query: {
					id: record.id
				}
			});
		},
		pushToDetail(record) {
			let path = '/center/fund/collect/detail';
			if (this.companyType === 'COAL_MINE') {
				path = '/center/pay/collectRecordList/detail';
			}
			this.$router.push({
				path,
				query: {
					id: record.id
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
		tab: '待收款确认',
		key: 'WAIT_REPAY_CONFIRM',
		count: ''
	},
	{
		tab: '已付款',
		key: 'PAYED',
		count: ''
	},
	{
		tab: '驳回',
		key: 'CUSTOM_REJECT', // 客户退回
		count: ''
	}
];

// 默认搜索表单数据
const DefaultSearchList = [
	{
		decorator: ['serialNo'],
		addonBeforeTitle: '编号',
		type: 'input',
		placeholder: '请输入订单、合同、资金流水号'
	},
	{
		decorator: ['companyName'],
		addonBeforeTitle: '企业名称',
		type: 'input',
		placeholder: '请输入企业名称'
	},
	{
		decorator: ['paymentType'],
		addonBeforeTitle: '付款类型',
		type: 'select',
		placeholder: '请选择付款类型',
		options: [
			{ value: 'PRE_PAYMENT', label: '预付款' },
			{ value: 'PRE_SETTLEMENT', label: '预结算付款' },
			{ value: 'SETTLEMENT', label: '结算付款' }
		]
	},
	{
		decorator: ['planPayDate'],
		addonBeforeTitle: '付款日期',
		type: 'rangePicker',
		realKey: ['planPayDateBegin', 'planPayDateEnd']
	},
	{
		decorator: ['payType'],
		addonBeforeTitle: '资金来源',
		type: 'select',
		placeholder: '请选择资金来源',
		options: []
	},
	{
		decorator: ['orderBusinessType'],
		addonBeforeTitle: '业务类型',
		type: 'select',
		placeholder: '请选择业务类型',
		options: filterCodeByKey('orderBusinessTypeDescMap')
			.map(item => {
				return { value: item.value, label: item.text };
			})
			.filter(item => item.value != 'DISCOUNT_WAREHOUSE_PLEDGE')
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
			title: '付款方', //取买方企业名称
			dataIndex: 'buyerName',
			customRender
		},
		{
			title: '付款类型',
			dataIndex: 'paymentTypeDesc',
			customRender
		},
		{
			title: '资金来源',
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
