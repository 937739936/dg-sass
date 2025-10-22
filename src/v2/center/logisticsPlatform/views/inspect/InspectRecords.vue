<template>
	<div class="slMain">
		<a-card :bordered="false">
			<div class="methods-wrap">
				<span
					slot="title"
					class="slTitle"
					>巡库记录</span
				>
			</div>
			<SlFormNew
				:list="searchList"
				layout="inline"
				@change="handleChange"
			></SlFormNew>
			<div :class="'table-box ' + (pagination.total > 10 ? 'fixedBottom' : '')">
				<!-- <div class="actions-box">
					<a-button
						type="primary"
						ghost
						@click="downloadReport"
						:loading="downloading"
						>下载报告</a-button
					>
				</div> -->
				<a-table
					:columns="columns"
					class="new-table new-table2"
					:bordered="false"
					rowKey="id"
					:dataSource="dataSourceTemp"
					:pagination="false"
					:loading="tableLoading"
					:scroll="{ x: true }"
					:indentSize="0"
					:expandRowByClick="true"
				>
					<template
						slot="expandIcon"
						slot-scope="props"
					>
						<div
							v-if="props.record.children && props.record.children.length > 0"
							:class="props.expanded ? 'expand-open' : 'expand-normal'"
						></div>
						<div
							v-else
							style="width: 0; height: 0"
						></div>
					</template>
					<template slot="expandIndex"> </template>
					<template
						slot="index"
						slot-scope="text, record, index"
					>
						<span v-if="record.children">{{ (pagination.pageNo - 1) * pagination.pageSize + Number(index) + 1 }}</span>
					</template>
					<template
						slot="warehouseName"
						slot-scope="text"
					>
						<a-tooltip placement="topLeft">
							<template
								v-if="text && text != '-'"
								slot="title"
							>
								<span> {{ text }} </span>
							</template>
							<span class="warehouseName"> {{ text || '-' }} </span>
						</a-tooltip>
					</template>
					<div
						slot="supervisorUserName"
						slot-scope="text"
						class="textOverflow"
						style="width: 80px"
					>
						<a-tooltip placement="topLeft">
							<template
								v-if="text != '-'"
								slot="title"
							>
								<span> {{ text }} </span>
							</template>
							<span> {{ text }} </span>
						</a-tooltip>
					</div>
					<div
						slot="advancedSupervisorUserName"
						slot-scope="text"
						class="textOverflow"
						style="width: 150px"
					>
						<a-tooltip placement="topLeft">
							<template
								v-if="text != '-'"
								slot="title"
							>
								<span> {{ text }} </span>
							</template>
							<span> {{ text }} </span>
						</a-tooltip>
					</div>

					<div
						slot="supervisorReportResultStatusDesc"
						slot-scope="text, record"
					>
						<span :class="record.supervisorReportResultStatus == 'EXCEPTION' ? 'abnormalText' : ''">{{ text }}</span>
					</div>
					<template
						slot="supervisorReportProcessStatusDesc"
						slot-scope="text, record"
					>
						<span :class="record.supervisorReportProcessStatus == 'UNSOLVED' ? 'abnormalText' : ''">{{ text }}</span>
					</template>
					<div
						slot="action"
						slot-scope="text, record"
					>
						<a-space>
							<a
								v-if="record.children == null || record.children.length == 0"
								@click.stop="pushToDetail(record)"
								>详情</a
							>
							<a
								v-if="record.reportPdfUrl"
								@click.stop="openReportPDF(record)"
								>查看报告</a
							>
							<a
								v-if="record.reportPdfUrl"
								@click.stop="downloadSingleReport(record)"
								>下载报告</a
							>
						</a-space>
					</div>
				</a-table>
				<i-pagination
					:pagination="pagination"
					size="small"
					:pageSizeOptions="['10', '50', '100', '150', '200']"
					:defaultPageSize="10"
					@change="getList"
				/>
			</div>
		</a-card>
		<router-view />
	</div>
</template>

<script>
// import ENV from 'api/env.js'
import iPagination from '@sub/components/iPagination';
import { ListMixin } from '@/v2/components/mixin/ListMixin';
import comDownload from '@sub/utils/comDownload.js';
import { getInspectRecordsList, downloadInspectRecordsReport } from '../../api';
import { mapGetters } from 'vuex';
import {
	API_DOWNLPREVIEWTE
} from 'api';
const customRender = text => {
	if (text == 0) {
		return '0';
	}
	return text || '-';
};
const columns = [
	{
		title: '',
		dataIndex: 'expandIndex',
		key: 'expandIndex',
		fixed: 'left'
	},
	{ title: '序号', dataIndex: 'index', key: 'index', scopedSlots: { customRender: 'index' }, fixed: 'left' },
	{ title: '仓库名称', dataIndex: 'stationName', key: 'stationName', customRender },
	{ title: '仓房', dataIndex: 'warehouseName', key: 'warehouseName', scopedSlots: { customRender: 'warehouseName' } },
	{ title: '货主', dataIndex: 'goodsCompanyName', key: 'goodsCompanyName' },
	{ title: '巡库时间', dataIndex: 'supervisorDate', key: 'supervisorDate', customRender },
	{
		title: '巡库结果',
		dataIndex: 'supervisorReportResultStatusDesc',
		key: 'supervisorReportResultStatusDesc',
		scopedSlots: { customRender: 'supervisorReportResultStatusDesc' }
	},
	{
		title: '处理状态',
		dataIndex: 'supervisorReportProcessStatusDesc',
		key: 'supervisorReportProcessStatusDesc',
		scopedSlots: { customRender: 'supervisorReportProcessStatusDesc' }
	},
	{ title: '处理时间', dataIndex: 'exceptionResultDealTime', key: 'exceptionResultDealTime', customRender },
	{
		title: '巡库人员',
		dataIndex: 'supervisorUserName',
		key: 'supervisorUserName',
		scopedSlots: { customRender: 'supervisorUserName' }
	},
	{
		title: '监管负责人',
		dataIndex: 'advancedSupervisorUserName',
		key: 'advancedSupervisorUserName',
		scopedSlots: { customRender: 'advancedSupervisorUserName' }
	},
	{ title: '报告生成时间', dataIndex: 'reportCreatedTime', key: 'reportCreatedTime', customRender },
	{ title: '操作', dataIndex: '操作', key: '操作',  scopedSlots: { customRender: 'action' }, fixed: 'right' }
];
export default {
	mixins: [ListMixin],
	components: {
		iPagination
	},
	data() {
		return {
			columns,
			tableLoading: false,
			downloading: false,
			url: {
				list: getInspectRecordsList
			},
			searchList: [
				{
					decorator: ['supervisorReportResultStatus'],
					addonBeforeTitle: '巡库结果',
					type: 'select',
					placeholder: '请选择',
					allowClear: true,
					options: [
						{
							value: 'NORMAL',
							label: '正常'
						},
						{
							value: 'EXCEPTION',
							label: '异常'
						}
					]
				},
				{
					decorator: ['supervisorReportProcessStatus'],
					addonBeforeTitle: '处理状态',
					type: 'select',
					placeholder: '请选择',
					allowClear: true,
					options: [
						{
							value: 'NORMAL',
							label: '-'
						},
						{
							value: 'UNSOLVED',
							label: '未解决'
						},
						{
							value: 'SOLVED',
							label: '已解决'
						}
					]
				},
				{
					decorator: ['createDate'],
					addonBeforeTitle: '巡库时间',
					realKey: ['supervisorStartDate', 'supervisorEndDate'],
					type: 'rangePicker',
					placeholder: ['开始日期', '结束日期'],
					allowClear: true
				}
			],
			pagination: {
				total: 0, // 总条数
				pageNo: 1,
				pageSize: 10
			},
			expandedRowKeys: []
		};
	},
	created() {
		if (!this.isCoreCompany) {
			this.searchList.unshift({
				decorator: ['companyName'],
				addonBeforeTitle: '货主',
				type: 'input',
				placeholder: '请输入货主名称',
				allowClear: true
			});
		}
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		isCoreCompany() {
			return this.VUEX_ST_COMPANYSUER.companyType == 'CORE_COMPANY';
		},
		dataSourceTemp() {
			let index = 1;
			let pageNo = this.pagination.pageNo;
			let pageSize = this.pagination.pageSize;
			let count = (pageNo - 1) * pageSize;
			this.dataSource.map(item => {
				item.index = count + index;
				// TODO: 接口联调
				item.children = item.supervisorRecordList ?? [];
				index += 1;
			});
			return this.dataSource;
		}
	},
	methods: {
		handleChange(data) {
			this.searchParams = data;
			this.pagination.pageNo = 1;
			this.changeSearch(this.searchParams);
		},
		downloadReport() {
			// 下载报告
			const params = {
				...this.defaultParams,
				...this.searchParams
			};
			this.downloading = true;
			downloadInspectRecordsReport(params)
				.then(res => {
					comDownload(res.data, undefined, res.name);
				})
				.finally(() => {
					this.downloading = false;
				});
		},
		async downloadSingleReport(record) {
			// 下载单个报告
			var reportPdfUrl = record.reportPdfUrl;
			var pdfName = ''
			if (record.supervisorDate) {
				pdfName += record.supervisorDate;
			}
			if (record.stationName) {
				pdfName += '_'
				pdfName += record.stationName;
			}
			pdfName += '_巡库报告.pdf';
			const url = await this.$RsaDecrypt.generateFileUrl(reportPdfUrl);
			API_DOWNLPREVIEWTE(url).then((res) => {
        comDownload(res, null, pdfName);
      });
		},
		pushToDetail(data) {
			this.$router.push({
				path: '/center/logisticsPlatform/inspectRecords/detail',
				query: {
					id: data.id
				}
			});
		},
		openReportPDF(data) {
			// 查看报告
			window.open(data.reportPdfUrl, '_blank');
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
.slMain {
	margin-top: -10px;
	.table-box {
		.new-table {
			// 表格标题第一列间距调整
			/deep/ .ant-table-thead > tr > th:first-child {
				padding: 10px 12px;
			}
			// 表格内容第一列间距调整
			/deep/ .ant-table-tbody > tr > td:first-child {
				padding: 10px 12px;
			}
			// 表格标题第二列间距调整
			/deep/ .ant-table-thead > tr > th:nth-child(2) {
				padding: 10px 20px 10px 0px;
			}
			// 表格内容第二列间距调整
			/deep/ .ant-table-tbody > tr > td:nth-child(2) {
				padding: 10px 20px 10px 0px;
			}
			// 右侧悬浮表格标题第一列间距恢复（上面的调整会影响这里所以需要恢复）
			/deep/ .ant-table-fixed-right .ant-table-thead > tr > th:first-child {
				padding: 10px 20px;
			}
			// 右侧悬浮表格内容第一列间距恢复（上面的调整会影响这里所以需要恢复）
			/deep/ .ant-table-fixed-right .ant-table-tbody > tr > td:first-child {
				padding: 10px 20px;
			}

			/deep/ .ant-table-tbody > tr > td {
				border-bottom: 1px solid #e5e6eb;
			}
			/deep/ .ant-table-tbody > tr:nth-child(2n) {
				background: none;
			}
			/deep/ .ant-table-tbody > tr.ant-table-row-level-1 {
				background: #f3f5f6;
			}
		}
	}
}
</style>

<style lang="less" scoped>
.slMain {
	margin-top: -10px;
	.table-box {
		position: relative;
		margin-top: 30px;
		.actions-box {
			text-align: right;
			margin-bottom: 20px;
		}
		.expand-normal {
			width: 16px;
			height: 16px;
			background-image: url('~@/assets/imgs/table_expand_normal.png');
			background-size: 100%;
			background-position: center;
			background-repeat: no-repeat;
		}
		.expand-open {
			width: 16px;
			height: 16px;
			background-image: url('~@/assets/imgs/table_expand_open.png');
			background-size: 100%;
			background-position: center;
			background-repeat: no-repeat;
		}
		.warehouseName {
			text-overflow: ellipsis;
			overflow: hidden;
			white-space: nowrap;
			min-width: 50px;
			max-width: 200px;
			display: block;
		}
	}
	.abnormalText {
		color: #dd4444;
	}
	.textOverflow {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
}
</style>
