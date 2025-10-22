<template>
	<div>
		<!-- 查询区域 -->
		<SlFormNew
			:list="searchList"
			ref="slFormNew"
			layout="inline"
			@change="changeSearch"
		></SlFormNew>
		<div class="tabs-box">
			<div
				class="export-box"
				@click="exportFunc"
			>
				<img
					class="export-icon"
					src="@/v2/assets/imgs/common/export_icon.png"
					alt=""
				/>
				<span class="export-text">数据导出</span>
			</div>
		</div>
		<a-table
			:columns="columns"
			class="new-table"
			:rowSelection="rowSelection"
			:bordered="false"
			rowKey="id"
			:scroll="{ x: true }"
			:dataSource="dataSource"
			:pagination="false"
			:loading="loading"
		>
			<template
				slot="action"
				slot-scope="text, items"
			>
				<div class="column-flex">
					<a
						href="javascript:;"
						@click="goDetail(items)"
						>查看发票</a
					>
				</div>
			</template>
		</a-table>
		<div class="bottom">
			<div
				class="tip-box"
				v-if="isShowStatistics || selectedRowKeys.length"
			>
				<span>共计数量</span>
				<span class="num">{{ statisticsInfo.quantity | formatMoney(2) }}</span>
				<span>共计金额</span>
				<span class="num">￥{{ statisticsInfo.amount | formatMoney(2) }}</span>
				<span>共计税额</span>
				<span class="num">￥{{ statisticsInfo.taxAmount | formatMoney(2) }}</span>
				<span>共计价税合计</span>
				<span class="num">￥{{ statisticsInfo.totalAmount | formatMoney(2) }}</span>
			</div>
			<span v-else></span>

			<i-pagination
				:pagination="pagination"
				v-if="pageSize < pagination.total"
				:defaultPageSize="50"
				:pageSizeOptions="['10', '50', '100', '150', '200']"
				:showTotalMain="showTotal"
				size="small"
				@change="getList"
			/>
		</div>
	</div>
</template>

<script>
import { ListMixin } from '@/v2/components/mixin/ListMixin';
import { mapGetters, mapMutations } from 'vuex';

import { getInvoiceToolsDetailList, exportInvoiceDetailTool, invoiceStatisticsDetail } from '@/v2/center/invoiceDiscern/api';
import comDownload from '@sub/utils/comDownload.js';
import moment from 'moment';
import { listDetailColumns } from '../config';

const columns = [
	{ title: '发票代码', dataIndex: 'code' },
	{ title: '发票号码', dataIndex: 'no' },
	{ title: '开票日期', dataIndex: 'issuedDate' },
	{ title: '购买方', dataIndex: 'buyerName' },
	{ title: '销售方', dataIndex: 'sellerName' },
	{ title: '货物(劳务)名称', dataIndex: 'name' },
	{ title: '规格型号', dataIndex: 'spec' },
	{ title: '单位', dataIndex: 'unit' },
	{ title: '数量', dataIndex: 'quantity' },
	{ title: '单价', dataIndex: 'unitPrice', scopedSlots: { customRender: 'unitPrice' } },
	{ title: '金额', dataIndex: 'amount', scopedSlots: { customRender: 'amount' } },
	{ title: '税率', dataIndex: 'taxRate' },

	{ key: 'action', fixed: 'right', with: 100, scopedSlots: { customRender: 'action' }, title: '操作' }
];

const searchList = [
	{
		decorator: ['sellerName'],
		addonBeforeTitle: '销售方',
		type: 'input',
		placeholder: '输入销售方信息',
		allowClear: true
	},
	{
		decorator: ['buyerName'],
		addonBeforeTitle: '购买方',
		type: 'input',
		placeholder: '输入购买方信息',
		allowClear: true
	},
	{
		decorator: ['code'],
		addonBeforeTitle: '发票代码',
		type: 'input',
		placeholder: '输入发票代码',
		allowClear: true
	},
	{
		decorator: ['no'],
		addonBeforeTitle: '发票号码',
		type: 'input',
		placeholder: '输入发票号码',
		allowClear: true
	},
	{
		decorator: ['issuedDate'],
		addonBeforeTitle: '开票日期',
		realKey: ['issuedDateBegin', 'issuedDateEnd'],
		type: 'rangePicker',
		placeholder: ['', ''],
		allowClear: true
	},

	{
		decorator: ['status'],
		addonBeforeTitle: '状态',
		type: 'select',
		placeholder: '请选择状态',
		allowClear: true,
		options: [
			{ value: 'NORMAL', label: '正常' },
			{ value: 'RED_DASHED', label: '红冲' },
			{ value: 'INVALID', label: '作废' }
		]
	},
	{
		decorator: ['createName'],
		addonBeforeTitle: '上传用户',
		type: 'input',
		placeholder: '输入上传用户',
		allowClear: true
	}
];
export default {
	mixins: [ListMixin],
	data() {
		return {
			searchList,
			url: {
				list: getInvoiceToolsDetailList
			},
			defaultParams: {
				// orderType: 'BUY',
				// industryType: 'STEEL'
			},
			columns: listDetailColumns,
			selectedRowKeys: [],
			pageSize: 50,
			statisticsInfo: {
				quantity: 0
			}
		};
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		rowSelection() {
			let that = this;
			return {
				getCheckboxProps: rescord => {
					return {
						props: {
							disabled: rescord.disabled
						}
					};
				},
				selectedRowKeys: that.selectedRowKeys,
				columnWidth: 30,
				onChange: (selectedRowKeys, selectedRows) => {
					this.selectedRowKeys = selectedRowKeys;
					this.invoiceStatisticsDetail();
				}
			};
		},
		isShowStatistics() {
			let flag = false;
			for (let key in this.searchParams) {
				if (this.searchParams[key]) {
					flag = true;
				}
			}
			return flag;
		},
		showTotal() {
			// 判断是否 勾线 或者有参数
			if (this.isShowStatistics || this.selectedRowKeys.length) {
				return this.$createElement('span', { attrs: { style: 'display:none' } });
			}
			return '';
		}
	},
	mounted() {},
	watch: {
		isShowStatistics(flag) {
			if (flag) {
				this.invoiceStatisticsDetail();
			}
		}
	},
	methods: {
		changeSearch(info) {
			this.searchParams = info;
			this.getList();
			this.invoiceStatisticsDetail();
		},
		exportFunc() {
			exportInvoiceDetailTool({
				...this.defaultParams,
				...this.searchParams,
				idList: this.selectedRowKeys.join(',')
			})
				.then(res => {
					comDownload(
						res,
						undefined,
						'发票明细-' + this.VUEX_ST_COMPANYSUER.companyName + '-' + moment().format('yyyy-MM-DD') + '.xls'
					);
				})
				.finally(() => {});
		},
		// 统计数据
		async invoiceStatisticsDetail() {
			const params = {
				...this.defaultParams,
				...this.searchParams,
				idList: this.selectedRowKeys.join(',')
			};
			const res = await invoiceStatisticsDetail(params);
			this.statisticsInfo = res.data || { quantity: 0 };
		},
		goDetail(item) {
			this.$router.push({
				path: '/invoice/discern/detail',
				query: {
					id: item.invoiceId
				}
			});
		}
	},
	components: {}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style scoped lang="less">
.lay-container {
	height: 100%;
	background-color: #f3f5f6 !important;
	.content {
		margin: 20px;
		padding: 20px 30px;
		background: #fff;
	}
	.tabs-box {
		position: relative;
		margin-bottom: 14px;
		margin-top: 50px;
		display: flex;
		justify-content: flex-end;

		.export-box {
			// position: absolute;
			// right: 0;
			// top: 16px;
			// text-align: right;
			cursor: pointer;
			.export-icon {
				width: 14px;
				height: 14px;
				margin-right: 5px;
				position: relative;
				top: -2px;
			}
			.export-text {
				font-family:
					PingFangSC-Regular,
					PingFang SC;
				color: #4682f3;
				line-height: 20px;
			}
		}
	}
	.bottom {
		display: flex;
		align-items: center;
		justify-content: space-between;
		position: sticky;
		bottom: 0;
		left: 30px;
		// width: calc(100vw - 60px);
		padding: 10px 0;
		box-sizing: border-box;
		z-index: 999;
		background: #fff;
		// padding: 20px;

		/deep/ .slPagination {
			margin: 0;
			left: 0;
			left: 0 !important;
		}
	}
	.tip-box {
		color: var(--text-title, #77889d);
		.num {
			color: #f46332;
			font-family: D-DIN-PRO;
			font-weight: 600;
			margin-right: 20px;
			margin-left: 10px;
		}
	}
}
</style>
