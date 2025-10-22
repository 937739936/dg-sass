<template>
	<div>
		<p class="mb8">
			<span class="mr16"> 发票数量：{{ invoiceStatisticsData.currentContractInvoiceCount }} </span>
			<span class="mr16"> 归属本合同发票总额：{{ invoiceStatisticsData.currentContractSplitAmountTotal }}元 </span>
		</p>
		<a-tabs default-active-key="1">
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
							<!-- <a v-if="(dynamicMonitoringDetail.terminalDirectorId == VUEX_ST_COMPANYSUER.companyUserId || VUEX_ST_COMPANYSUER.companyUserRoles.indexOf('admin') != -1) && (dynamicMonitoringDetail.downstreamDataStatus.cnname !='已完结') && (dynamicMonitoringDetail.downstreamDataStatus.cnname !='待审核')" href="javascript:;" @click="goDetail('edit',record)"  v-auth="'monitor:dynamic:terminalInvoice:edit'">编辑</a> -->
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
} from '@/v2/center/monitoring/api';
import { getTransInvoiceList, getTransInvoiceStatistics } from '../api/transportBusiness.js';
import { mapGetters } from 'vuex';
import iPagination from "@sub/components/iPagination";
import dataStatusDict from '../config/dataStatusDict';
import { getOfficeFileViewUrl } from '@/v2/utils/factory';
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
			previewImg: '',
			businessLineType: ''
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
		'belongContractType',
		'transContractNo'
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
	},
	mounted() {
		this.getInvoiceData();
	},
	methods: {
		getInvoiceData() {
			this.businessLineType = this.$route.query.businessLineType;
			this.getUpstreamTransInvoiceList();
			this.getUpstreamInvoiceStatistics();
		},
		// 上游发票统计
		getUpstreamInvoiceStatistics() {
			const params = {
				contractNo: this.transContractNo
			};

			getTransInvoiceStatistics(params).then(res => {
				if (res.success) {
					this.invoiceStatisticsData = res.data;
				}
			});
		},

		// 上游运费发票列表
		getUpstreamTransInvoiceList(pageNo = this.transInvoicePagination.pageNo, pageSize = 10) {
			this.transInvoicePagination.pageNo = pageNo;
			const params = {
				contractNo: this.transContractNo,
				pageNo,
				pageSize
			};
			getTransInvoiceList(params).then(res => {
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
