<template>
	<div>
		<div class="mb8 tr">
			<!-- 下游负责人  已完善合同 状态未完结未发起审核 才可新建、编辑、删除 -->
			<template v-if="isUpstreamOrDownstream">
				<a-button
					type="primary"
					@click="goCreate('add', '')"
					v-auth="'monitor:dynamic:terminalStatement:add'"
					>新增结算单</a-button
				>
			</template>
		</div>
		<p class="mb8">
			<span class="mr16"> 结算单数量：{{ dataSource.length }}</span>
			<span class="mr16"> 已结算数量：{{ statementStatistics.settledQuantity }}吨</span>
			<span class="mr16"> 已结算金额：{{ statementStatistics.settledAmount }}元</span>
		</p>
		<a-table
			:pagination="false"
			:columns="columns"
			:data-source="dataSource"
			rowKey="id"
			:scroll="{ x: true }"
		>
			<span
				slot="dataSource"
				slot-scope="text"
			>
				{{ text == 1 ? '内部管理系统' : '手动新增' }}
			</span>
			<div
				slot="action"
				slot-scope="record"
			>
				<a @click="goCreate('detail', record)">查看</a>
				<a
					v-if="record.ticketPdfUrl"
					@click="downFile(record.ticketPdfUrl)"
					>下载</a
				>
			</div>
		</a-table>
		<i-pagination
			:pagination="pagination"
			@change="getUpstreamSettlementList"
		/>
	</div>
</template>

<script>
import {
	API_ContractSettlementList,
	API_BusinessMonitoringUpstreamStatementStatistics,
	API_BusinessMonitoringUpstreamStatementList,
	API_BusinessMonitoringDownstreamStatementStatistics,
	API_BusinessMonitoringDownstreamStatementList,
	API_FullBusinessLineDetailStatementStatistics,
	API_FullBusinessLineDetailStatementList,
	API_DOWNLPREVIEWTE
} from 'api';
import iPagination from "@sub/components/iPagination";
import comDownload from '@sub/utils/comDownload.js';
import dataStatusDict from '../config/dataStatusDict';

const columns = [
	{ title: '结算单编号', dataIndex: 'serialNo' },
	{ title: '结算日期', dataIndex: 'confirmTime' },
	{ title: '结算单价(元/吨)', dataIndex: 'settleUnitPrice' },
	{ title: '结算数量(吨)', dataIndex: 'settleQuantity' },
	{ title: '结算金额(元)', dataIndex: 'settleAmount' }
];
export default {
	name: 'SettlementList',
	components: {
		iPagination
	},
	props: [
		'contractId',
		'dynamicMonitoringDetail',
		'curUpstream',
		'contractType',
		'downOrderNo',
		'downOrderId',
		'contractNo',
		'orderNo',
		'belongContractType',
		'isElectronicContract' //是不是电子合同
	],
	data() {
		return {
			columns: [],
			businessLineType: '',
			statementStatistics: {},
			dataSource: [],
			pagination: {
				type: 'contractSettlement',
				total: 0, // 总条数
				pageNo: 1
			},
			params: {}
		};
	},
	computed: {
		isUpstreamOrDownstream() {
			//  已完善合同 状态未完结未发起审核 才可新建、编辑、删除
			if (
				((this.contractType === 0 && this.businessLineType === 'UP') ||
					(this.contractType === 1 && this.businessLineType === 'DOWN') ||
					this.businessLineType === 'OFFLINE') &&
				this.dynamicMonitoringDetail[this.curDataStatusKey] &&
				this.dynamicMonitoringDetail[this.curDataStatusKey].cnname != '已完结' &&
				this.dynamicMonitoringDetail[this.curDataStatusKey].cnname != '待审核'
			) {
				return true;
			}
			return false;
		},
		curDataStatusKey() {
			return dataStatusDict[this.contractType] || dataStatusDict[+this.$route.query.activedCoverIndex];
		}
	},
	watch: {
		curUpstream() {
			this.getSettlementData();
		},
		orderNo() {
			this.handleColumns();
			this.getSettlementData();
		}
	},
	created() {
		this.handleColumns();
		this.getSettlementData();
	},
	methods: {
		handleColumns() {
			const { businessLineType } = this.$route.query;
			this.columns = [
				...columns,
				{
					title: '操作',
					fixed: 'right',
					scopedSlots: { customRender: 'action' }
				}
			];

			if (this.contractType === 2) {
				if (businessLineType === 'ONLINE') {
					this.columns = [
						...columns,
						{ title: '状态', dataIndex: 'statusName' },
						{
							title: '操作',
							fixed: 'right',
							scopedSlots: { customRender: 'action' }
						}
					];
				}
				return;
			}

			if ((businessLineType === 'UP' && this.contractType !== 0) || (businessLineType === 'DOWN' && this.contractType !== 1)) {
				this.columns = [
					...columns,
					{ title: '状态', dataIndex: 'statusName' },
					{
						title: '操作',
						fixed: 'right',
						scopedSlots: { customRender: 'action' }
					}
				];
			}
		},
		getSettlementData() {
			if (this.contractType !== 2) {
				if (this.belongContractType !== this.contractType) {
					return;
				}
			}
			this.businessLineType = this.$route.query.businessLineType;
			this.getUpstreamSettlementList();
			this.getUpstreamSettlementStatistics();
		},
		getUpstreamSettlementList(pageNo = this.pagination.pageNo, pageSize = 10) {
			this.pagination.pageNo = pageNo;
			const params = {
				pageNo,
				pageSize,
				downOrderNo: this.downOrderNo || '',
				upOrderNo: (this.curUpstream && this.curUpstream.upOrderNo) || '',
				businessLineType: this.businessLineType,
				orderNo: this.orderNo,
				contractNo: this.contractNo
			};
			const fct = [
				API_BusinessMonitoringUpstreamStatementList,
				API_BusinessMonitoringDownstreamStatementList,
				API_FullBusinessLineDetailStatementList
			][this.contractType];
			fct(params).then(res => {
				if (res.success) {
					this.dataSource = res.data.records;
					this.pagination.total = res.total;
				}
			});
		},
		getUpstreamSettlementStatistics() {
			const params = {
				downOrderNo: this.downOrderNo || '',
				upOrderNo: (this.curUpstream && this.curUpstream.upOrderNo) || '',
				businessLineType: this.businessLineType,
				orderNo: this.orderNo,
				contractNo: this.contractNo
			};
			const fct = [
				API_BusinessMonitoringUpstreamStatementStatistics,
				API_BusinessMonitoringDownstreamStatementStatistics,
				API_FullBusinessLineDetailStatementStatistics
			][this.contractType];
			fct(params).then(res => {
				if (res.success) {
					this.statementStatistics = res.data;
				}
			});
		},
		// 编辑
		goCreate(type, data) {
			//判断采购或是销售订单
			let { id } = data;
			if (!this.isElectronicContract) {
				if (['add'].includes(type)) {
					//上下游均为补录新增结算单,跳转到线下结算单新增、编辑页
					this.settleAdd();
				}
				if (type === 'detail') {
					//上下游均为补录新增结算单,跳转到线下结算单详情页
					this.settleDetail(id);
				}
			} else {
				const { id } = data;
				let type = this.$route.query.contractType == '1' ? 'sell' : 'buy';
				let route = {
					path: `/center/settle/${type}/onlinedetail`,
					query: { id }
				};
				this.$router.push(route);
			}
		},
		downFile(url) {
			API_DOWNLPREVIEWTE(`${url}`)
				.then(res => {
					comDownload(res, url);
				})
				.catch(() => {
					this.$message.error('文件下载失败');
				});
		},
		// 获取结算单列表
		async getSettlementList(pageNo = this.pagination.pageNo, pageSize = 10) {
			this.pagination.pageNo = pageNo;
			this.params.pageNo = pageNo;
			this.params.pageSize = pageSize;
			this.params.terminalContractId = this.curUpstream.upOrderId;
			const res = await API_ContractSettlementList(this.params);
			if (res.success) {
				this.settlementData = res.data.records;
				this.pagination.total = res.data.total;
			}
		},
		// onPageState(){ //点击操作中的按钮，保存分页状态
		//     this.VUEX_setListPamars(this.pagination)
		// }
		// 补录线下结算单，
		// 可以不加类型参数，页面会判断
		settleAdd() {
			let type = this.$route.query.contractType == '1' ? 'sell' : 'buy';
			this.$router.push({
				path: `/center/settle/${type}/offlineadd`,
				query: {
					contractNo: this.$route.query.contractType == '1' ? this.$route.query.downOrderNo : this.$route.query.upOrderNo
				}
			});
		},
		// 跳转到线下结算单详情
		settleDetail(id) {
			// 可以不加类型参数，页面会判断
			let type = this.$route.query.contractType == '1' ? 'sell' : 'buy';
			this.$router.push({
				path: `/center/settle/${type}/offlinedetail`,
				query: {
					id
				}
			});
		}
	}
};
</script>

<style lang="less" scoped>
.ant-table-tbody {
	td {
		div > a {
			display: inline-blok;
			margin-right: 8px;
		}
		div > a:last-child {
			margin-right: 0;
		}
	}
}
</style>
