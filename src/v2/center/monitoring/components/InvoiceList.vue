<template>
	<div>
		<template v-if="contractType !== 2">
			<div
				style="text-align: right; margin-bottom: 15px"
				v-auth="'monitor:dynamic:terminalInvoice:add'"
				v-if="
					(contractType === 0 && businessLineType === 'UP') ||
					(contractType === 1 && businessLineType === 'DOWN') ||
					businessLineType === 'OFFLINE'
				"
			>
				<!--  已完善合同 状态未完结未发起审核  才可新建、编辑、删除 -->
				<template
					v-if="
						dynamicMonitoringDetail[curDataStatusKey].cnname != '已完结' &&
						dynamicMonitoringDetail[curDataStatusKey].cnname != '待审核'
					"
				>
					<a-button
						type="primary"
						@click="goCreate(1)"
						class="mr16"
						>新增贸易发票</a-button
					>
					<a-button
						type="primary"
						@click="goCreate(2)"
						>新增运费发票</a-button
					>
				</template>
			</div>
		</template>
		<p class="mb8">
			<span class="mr16"> 发票数量：{{ invoiceStatisticsData.currentContractInvoiceCount }} </span>
			<span class="mr16"> 归属本合同发票总额：{{ invoiceStatisticsData.currentContractSplitAmountTotal }}元 </span>
		</p>
		<a-tabs default-active-key="0">
			<a-tab-pane
				key="0"
				tab="贸易发票"
			>
				<div style="width: 100%">
					<a-table
						:pagination="false"
						:columns="tradeInvoiceColumns"
						:data-source="tradeInvoiceList"
						rowKey="id"
						:scroll="{ x: true }"
					>
						<!-- <span slot="dataSource" slot-scope="dataSource,items">
              {{ +items.dataSource === 1 ? "内部管理系统": "手动新增" }}
            </span> -->
						<div
							slot="attachment"
							slot-scope="attachment, record"
						>
							<a
								v-if="attachment"
								@click="preview(attachment)"
								>有</a
							>
							<span v-else>无</span>
						</div>
						<div
							slot="action"
							slot-scope="record"
						>
							<a
								href="javascript:;"
								@click="goInvoiceDetail(1, record)"
								>查看</a
							>
						</div>
					</a-table>
					<i-pagination
						:pagination="tradeInvoicePagination"
						@change="getUpstreamTradeInvoiceList"
					/>
				</div>
			</a-tab-pane>
			<a-tab-pane
				key="1"
				tab="运费发票"
			>
				<div style="width: 100%">
					<a-table
						:pagination="false"
						:columns="freightInvoiceColumns"
						:data-source="transInvoiceList"
						rowKey="id"
						:scroll="{ x: true }"
					>
						<!-- <span slot="dataSource" slot-scope="dataSource,items">
              {{ items.dataSource == 1 ? '内部管理系统' : '手动新增' }}
            </span> -->
						<div
							slot="attachment"
							slot-scope="attachment, record"
						>
							<a
								v-if="attachment"
								@click="preview(attachment)"
								>有</a
							>
							<span v-else>无</span>
						</div>
						<div
							slot="action"
							slot-scope="record"
							@click="onPageState"
						>
							<a @click="goInvoiceDetail(2, record)">查看</a>
						</div>
					</a-table>
					<i-pagination
						:pagination="transInvoicePagination"
						@change="getUpstreamTransInvoiceList"
					/>
				</div>
			</a-tab-pane>
		</a-tabs>
		<image-viewer ref="imageViewer" />
	</div>
</template>

<script>
import {
	API_InvoiceDelete,
	API_BusinessMonitoringUpstreamInvoiceStatistics,
	API_BusinessMonitoringUpstreamTradeInvoiceList,
	API_BusinessMonitoringUpstreamTransInvoiceList,
	API_BusinessMonitoringDownstreamInvoiceStatistics,
	API_BusinessMonitoringDownstreamTradeInvoiceList,
	API_BusinessMonitoringDownstreamTransInvoiceList,
	API_FullBusinessLineDetailInvoiceStatistics,
	API_FullBusinessLineDetailTransInvoiceList,
	API_FullBusinessLineDetailTradeInvoiceList
} from '@/v2/center/monitoring/api';

import { mapGetters } from 'vuex';
import iPagination from "@sub/components/iPagination";
import dataStatusDict from '../config/dataStatusDict';
import imageViewer from '@/v2/components/imageViewer.vue';
import { filePreview } from '@/v2/utils/file';
const columns = [
	{ title: '发票代码', dataIndex: 'code' },
	{ title: '发票号码', dataIndex: 'no' },
	{ title: '卖方名称', dataIndex: 'sellerName' },
	{ title: '买方名称', dataIndex: 'buyerName' },
	{ title: '开票日期', dataIndex: 'issuedDate' },
	{ title: '不含税金额(元)', dataIndex: 'taxExcludedAmount' },
	{ title: '税额(元)', dataIndex: 'taxAmount', align: 'center' },
	{
		title: '价税合计(元)',
		dataIndex: 'totalAmount',
		customRender: text => text && text.toLocaleString()
	},
	{
		title: '有无发票附件',
		dataIndex: 'attachment',
		scopedSlots: { customRender: 'attachment' }
	}
];

export default {
	name: 'InvoiceList',
	data() {
		return {
			invoiceStatisticsData: {},
			tradeInvoiceColumns: [],
			freightInvoiceColumns: [],
			transInvoiceList: [],
			tradeInvoiceList: [],
			tradeInvoicePagination: {
				total: 0, // 总条数
				pageNo: 1
			},
			transInvoicePagination: {
				total: 0, // 总条数
				pageNo: 1
			},
			params: {},
			previewImg: ''
		};
	},
	components: {
		iPagination,
		imageViewer
	},
	props: [
		'contractId',
		'dynamicMonitoringDetail',
		'contractNo',
		'curUpstream',
		'contractType',
		'downOrderNo',
		'orderNo',
		'belongContractType'
	],
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		curDataStatusKey() {
			return dataStatusDict[this.contractType];
		}
	},
	created() {
		this.tradeInvoiceColumns = [
			...columns,
			{
				title: '拆分到本合同金额(元)',
				dataIndex: 'currentContractSplitedAmount'
			},
			{ title: '发票状态', dataIndex: 'stateName' },
			{
				title: '操作',
				key: 'action',
				fixed: 'right',
				slots: { title: 'customTitle' },
				scopedSlots: { customRender: 'action' }
			}
		];
		this.freightInvoiceColumns = [
			...columns,
			{
				title: '是否包含印花税(元)',
				dataIndex: 'stampTaxFlag',
				align: 'center',
				customRender: text => ['否', '是'][text - 1]
			},
			{
				title: '印花税税额(元)',
				dataIndex: 'stampTaxFlagAmount',
				align: 'center'
			},
			{
				title: '含印花税合计(元)',
				align: 'center',
				dataIndex: 'stampTaxFlagTotalAmount'
			},
			{ title: '发票状态', dataIndex: 'stateName' },
			{
				title: '操作',
				key: 'action',
				fixed: 'right',
				slots: { title: 'customTitle' },
				scopedSlots: { customRender: 'action' }
			}
		];
		this.getInvoiceData();
	},
	watch: {
		curUpstream() {
			this.getInvoiceData();
		},
		orderNo() {
			this.getInvoiceData();
		}
	},
	methods: {
		getInvoiceData() {
			if (this.contractType !== 2) {
				if (this.belongContractType !== this.contractType) {
					return;
				}
			}
			this.businessLineType = this.$route.query.businessLineType;
			this.getUpstreamTransInvoiceList();
			this.getUpstreamTradeInvoiceList();
			this.getUpstreamInvoiceStatistics();
		},
		// 上游发票统计
		getUpstreamInvoiceStatistics() {
			const params = {
				upOrderNo: (this.curUpstream && this.curUpstream.upOrderNo) || '',
				downOrderNo: this.downOrderNo || '',
				orderNo: this.orderNo,
				businessLineType: this.businessLineType
			};
			const fct = [
				API_BusinessMonitoringUpstreamInvoiceStatistics,
				API_BusinessMonitoringDownstreamInvoiceStatistics,
				API_FullBusinessLineDetailInvoiceStatistics
			][this.contractType];
			fct(params).then(res => {
				if (res.success) {
					this.invoiceStatisticsData = res.data;
				}
			});
		},
		// 上游贸易发票列表
		getUpstreamTradeInvoiceList(pageNo = this.tradeInvoicePagination.pageNo, pageSize = 10) {
			this.tradeInvoicePagination.pageNo = pageNo;
			const params = {
				pageNo,
				pageSize,
				upOrderNo: (this.curUpstream && this.curUpstream.upOrderNo) || '',
				downOrderNo: this.downOrderNo || '',
				orderNo: this.orderNo,
				businessLineType: this.businessLineType
			};
			const fct = [
				API_BusinessMonitoringUpstreamTradeInvoiceList,
				API_BusinessMonitoringDownstreamTradeInvoiceList,
				API_FullBusinessLineDetailTradeInvoiceList
			][this.contractType];
			fct(params).then(res => {
				if (res.success) {
					this.tradeInvoiceList = res.data.records;
					this.tradeInvoicePagination.total = res.data.total;
				}
			});
		},
		// 上游运费发票列表
		getUpstreamTransInvoiceList(pageNo = this.transInvoicePagination.pageNo, pageSize = 10) {
			this.transInvoicePagination.pageNo = pageNo;
			const params = {
				pageNo,
				pageSize,
				upOrderNo: (this.curUpstream && this.curUpstream.upOrderNo) || '',
				downOrderNo: this.downOrderNo || '',
				orderNo: this.orderNo,
				businessLineType: this.businessLineType
			};
			const fct = [
				API_BusinessMonitoringUpstreamTransInvoiceList,
				API_BusinessMonitoringDownstreamTransInvoiceList,
				API_FullBusinessLineDetailTransInvoiceList
			][this.contractType];
			fct(params).then(res => {
				if (res.success) {
					this.transInvoiceList = res.data.records;
					this.transInvoicePagination.total = res.data.total;
				}
			});
		},

		goCreate(invoiceType) {
			// 新建
			//判断订单号
			let orderNo,
				contractNo,
				upOrderNo = this.curUpstream && this.curUpstream.upOrderNo,
				downOrderNo = this.downOrderNo;
			switch (this.businessLineType) {
				case 'UP':
					orderNo = upOrderNo;
					contractNo = this.dynamicMonitoringDetail.upContractNo;
					break;
				case 'DOWN':
					orderNo = downOrderNo;
					contractNo = this.dynamicMonitoringDetail.downContractNo;
					break;
				case 'OFFLINE':
					orderNo = +this.contractType === 0 ? upOrderNo : downOrderNo;
					contractNo =
						+this.contractType === 0 ? this.dynamicMonitoringDetail.upContractNo : this.dynamicMonitoringDetail.downContractNo;
					break;
			}
			const query = {
				orderNo,
				contractNo,
				...this.$route.query,
				contractType: +this.contractType === 0 ? 'UP' : 'DOWN',
				invoiceType
			};

			if (invoiceType == 1) {
				// 上游
				if (this.contractType == 0) {
					query.invoiceType = 'INPUT';
				} else {
					// 下游
					query.invoiceType = 'OUTPUT';
				}
			} else {
				query.invoiceType = 'DELIVER';
			}
			let pathInfo = {
				INPUT: '/center/invoice/buy/add?type=buy',
				OUTPUT: '/center/invoice/sell/add?type=sell',
				DELIVER: '/center/invoice/freight/add?type=freight'
			};
			this.$router.push({
				path: pathInfo[query.invoiceType],
				query
			});
			// }
		},

		goInvoiceDetail(invoiceType, item) {
			const query = {
				type: 'detail',
				id: item.id,
				no: item.no,
				industryType: 'COAL'
			};
			if (invoiceType == 1) {
				// 上游
				if (this.contractType == 0) {
					query.invoiceType = 'INPUT';
				} else {
					// 下游
					query.invoiceType = 'OUTPUT';
				}
			} else {
				query.invoiceType = 'DELIVER';
			}
			let pathInfo = {
				INPUT: '/center/invoice/buydetail',
				OUTPUT: '/center/invoice/selldetail',
				DELIVER: '/center/invoice/Freightdetail'
			};
			let path = pathInfo[query.invoiceType];

			this.$router.push({
				path,
				query
			});
		},
		async goDelete(item) {
			// 删除发票
			const res = await API_InvoiceDelete({ id: item.id });
			if (res.success) {
				this.$message.success('删除成功');
				this.getInvoiceData();

				// this.getInvoiceList();
			}
		},
		onPageState() {
			// 点击操作中的按钮，保存分页状态
			// this.VUEX_setListPamars(this.pagination);
		},
		// 预览
		preview(url) {
			filePreview(url, this.$refs.imageViewer.show);
		},
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
