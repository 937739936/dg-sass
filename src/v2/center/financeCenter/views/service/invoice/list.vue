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
				@click="downloadAll"
				style="display: flex"
			>
				<i
					class="iconfont icon icon-exceldaoru1 export-icon"
					style="color: var(--primary-color); position: relative; top: -1px"
				></i>
				<span class="export-text">批量下载</span>
			</div>
			<div
				class="export-box"
				@click="exportFunc"
				style="margin-left: 10px"
			>
				<ExportIcon class="export-icon"></ExportIcon>
				<span class="export-text">数据导出</span>
			</div>
		</div>
		<a-table
			:columns="columns"
			class="new-table"
			:bordered="false"
			rowKey="id"
			:row-selection="rowSelection"
			:scroll="{ x: true }"
			:dataSource="dataSource"
			:pagination="false"
			:loading="loading"
		>
			<template
				slot="totalAmount"
				slot-scope="text, items"
			>
				<div class="column-flex">
					<p>{{ items.totalAmount | formatMoney(2) }}</p>
				</div>
			</template>
			<template
				slot="taxExcludedAmount"
				slot-scope="text, items"
			>
				<div class="column-flex">
					<p>{{ items.taxExcludedAmount | formatMoney(2) }}</p>
				</div>
			</template>
			<template
				slot="taxAmount"
				slot-scope="text, items"
			>
				<div class="column-flex">
					<p>{{ items.taxAmount | formatMoney(2) }}</p>
				</div>
			</template>
			<template
				slot="action"
				slot-scope="text, items"
			>
				<div v-if="items.attachment">
					<a
						href="javascript:;"
						@click="handlePreview(items)"
						>查看</a
					>
					<a
						href="javascript:;"
						v-if="items.attachment"
						style="margin-left: 24px"
						@click="downloadItem(items)"
						>下载</a
					>
				</div>
			</template>
		</a-table>
		<i-pagination
			:pagination="pagination"
			@change="getList"
		/>
		<img
			:src="previewImg"
			ref="viewer"
			v-viewer
			style="display: none"
		/>
	</div>
</template>

<script>
import { ListMixin } from '@/v2/components/mixin/ListMixin';
import { API_GetDownloadRAR } from '@/v2/api';

import {
	getServiceFeeInvoiceList,
	exportServiceFeeInvoiceXls,
	API_getCommonBatchDownload,
	getSettlementList,
	serviceFeeInvoiceDownload
} from '@/v2/center/financeCenter/api';

import { mapGetters } from 'vuex';

import moment from 'moment';
import { ExportIcon } from '@sub/components/svg';
const listColumns = [
	{
		title: '开票日期',
		align: 'center',
		dataIndex: 'issuedDate'
	},
	{
		title: '价税合计（元）',
		align: 'center',
		dataIndex: 'totalAmount',
		scopedSlots: { customRender: 'totalAmount' }
	},
	{
		title: '开具金额(不含税)(元)',
		align: 'center',
		dataIndex: 'taxExcludedAmount',
		key: 'taxExcludedAmount',
		scopedSlots: { customRender: 'taxExcludedAmount' }
	},
	{ title: '税额', dataIndex: 'taxAmount' },

	{ title: '发票代码', dataIndex: 'code' },
	{ title: '发票号码', dataIndex: 'no' },

	{ title: '销售方', dataIndex: 'settlementCompanyName' },

	{ title: '上传时间', dataIndex: 'createTime' },

	{ key: 'action', fixed: 'right', with: 200, scopedSlots: { customRender: 'action' }, title: '操作' }
];
import comDownload from '@sub/utils/comDownload.js';

const searchList = [
	{
		decorator: ['settlementCompanyUscc'],
		addonBeforeTitle: '销售方',
		type: 'select',
		placeholder: '输选择',
		allowClear: true,
		options: []
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
		realKey: ['startTime', 'endTime'],
		type: 'rangePicker',
		placeholder: ['', ''],
		allowClear: true
	}
];
export default {
	mixins: [ListMixin],
	data() {
		return {
			searchList,
			url: {
				list: getServiceFeeInvoiceList
			},
			defaultParams: {
				// orderType: 'SELL',
				// industryType: 'STEEL'
			},
			columns: listColumns,
			selectedRowKeys: [],
			currentItem: {},
			pageSize: 10,
			statisticsInfo: {
				quantity: 0
			},
			previewImg: ''
		};
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		rowSelection() {
			return {
				selectedRowKeys: this.selectedRowKeys,
				onChange: this.onSelectChange,
				getCheckboxProps: record => ({
					props: {
						disabled: !record.attachment
					}
				})
			};
		}
	},
	mounted() {
		this.getSettlementList();
	},

	methods: {
		onSelectChange(selectedRowKeys) {
			this.selectedRowKeys = selectedRowKeys;
		},
		changeSearch(info) {
			this.searchParams = info;

			this.getList();
		},
		exportFunc() {
			exportServiceFeeInvoiceXls({
				...this.defaultParams,
				...this.searchParams
			}).then(res => {
				comDownload(res, undefined, `服务费发票信息-${moment().format('yyyy-MM-DD')}.xls`);
			});
		},
		downloadAll() {
			if (!this.selectedRowKeys.length) {
				this.$message.info('请先勾选发票');
				return;
			}
			API_getCommonBatchDownload(this.selectedRowKeys).then(res => {
				comDownload(res, undefined, `${this.VUEX_ST_COMPANYSUER.companyName}发票附件-${moment().format('yyyy-MM-DD')}.zip`);
			});
		},
		downloadItem(item) {
			const fileFormat = item.attachment.split('?')[0].split('.').pop().toLowerCase();
			serviceFeeInvoiceDownload({
				invoiceId: item.id
			}).then(res => {
				comDownload(
					res,
					undefined,
					`${this.VUEX_ST_COMPANYSUER.companyName}发票附件-${moment().format('yyyy-MM-DD')}.${fileFormat}`
				);
			});
		},
		async getSettlementList() {
			const res = await getSettlementList();
			const list = res.result || [];
			this.searchList[0].options = list.map(el => {
				return {
					label: el.text,
					...el
				};
			});
		},

		handlePreview(data) {
			let url = data.url || data.fileUrl || data.path || data.attachment;
			if (!url) {
				return;
			}
			this.previewImg = url;
			const fileFormat = this.previewImg.split('?')[0].split('.').pop().toLowerCase();
			if (['pdf'].includes(fileFormat)) {
				window.open(this.previewImg, '_blank');
				return;
			}
			if (['doc', 'docx', 'xlsx', 'xls'].includes(fileFormat)) {
				const jumpUrl = 'https://view.officeapps.live.com/op/view.aspx?src=' + encodeURIComponent(url);
				window.open(jumpUrl, '_blank');
				return;
			}
			if (['rar', 'zip'].includes(fileFormat)) {
				if (data.attachId) {
					API_GetDownloadRAR(data.attachId).then(res => {
						comDownload(res, undefined, data.name);
					});
				} else {
					window.open(this.previewImg, '_blank');
				}
				return;
			}
			this.$refs.viewer.$viewer.show();
		}
	},
	components: {
		ExportIcon
	}
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
	}
	.bottom {
		display: flex;
		// align-items: center;
		// justify-content: space-between;
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
.tips {
	margin-top: 18px;
	color: rgba(0, 0, 0, 0.5);
	line-height: 24px;
}
</style>
