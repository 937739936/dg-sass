<template>
	<div class="slMain">
		<a-card :bordered="false">
			<div class="methods-wrap">
				<span
					slot="title"
					class="slTitle"
					>质检记录</span
				>
			</div>
			<SlFormNew
				:list="searchList"
				layout="inline"
				@change="handleChange"
			></SlFormNew>
			<div :class="'table-box ' + (pagination.total > 10 ? 'fixedBottom' : '')">
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
					:expandedRowKeys="expandedRowKeys"
					:customRow="handleRowClick"
					:expandIcon="expandIcon"
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

					<span
						slot="sampleNameList"
						slot-scope="text, record"
					>
						<a-tooltip placement="topLeft">
							<template
								v-if="text != '-'"
								slot="title"
							>
								<span>{{ text }}</span>
							</template>
							<span>{{ getSimpleSample(text) }}</span>
						</a-tooltip>
					</span>
					<template
						slot="goodsNameList"
						slot-scope="text, record"
					>
						<a-tooltip placement="topLeft">
							<template
								v-if="text != '-'"
								slot="title"
							>
								<span>{{ text }}</span>
							</template>
							<span>{{ getSimpleSample(text) }}</span>
						</a-tooltip>
					</template>
					<div
						slot="contractNo"
						slot-scope="text"
						class="textOverflow"
						style="width: 200px"
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
						slot="blendingCoalNo"
						slot-scope="text"
						class="textOverflow"
						style="width: 200px"
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
					<template
						slot="action"
						slot-scope="text, record"
					>
						<div v-if="record.children == null || record.children.length == 0">
							<a-space>
								<a @click.stop="lookDetail(record)">详情</a>
								<a @click.stop="openReportPDF(record)">化验报告</a>
							</a-space>
						</div>
						<div v-else>
							<div v-if="expandedRowKeys.includes(record.id)">
								<a @click.stop="toggleExpand(record)">{{ '收起' }}</a>
							</div>
							<div v-else>
								<a @click.stop="toggleExpand(record)">{{ '展开' }}</a>
							</div>
						</div>
					</template>
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
import { getTaskList, downloadInspectRecordsReport } from '../../api';
import { mapGetters } from 'vuex';
import contract from '@/v2/center/steels/mixins/contract';
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
	{ title: '质检任务编号', dataIndex: 'serialNo', key: 'serialNo' },
	{ title: '创建时间', dataIndex: 'createDate', key: 'createDate' },
	{ title: '仓库名称', dataIndex: 'stationName', key: 'stationName', scopedSlots: { customRender: 'stationName' } },
	{ title: '货主名称', dataIndex: 'companyName', key: 'companyName' },
	{
		title: '样品名称',
		dataIndex: 'sampleNameList',
		key: 'sampleNameList',
		scopedSlots: { customRender: 'sampleNameList' }
	},

	{
		title: '品类',
		dataIndex: 'goodsNameList',
		key: 'goodsNameList',
		scopedSlots: { customRender: 'goodsNameList' }
	},
	{
		title: '完成时间',
		dataIndex: 'completeDate',
		width: 200,
		key: 'completeDate'
		// scopedSlots: { customRender: 'supervisorReportProcessStatusDesc' },
	},
	{ title: '关联合同编号', dataIndex: 'contractNo', key: 'contractNo', scopedSlots: { customRender: 'contractNo' } },
	{ title: '关联配煤编号', dataIndex: 'blendingCoalNo', key: 'blendingCoalNo', scopedSlots: { customRender: 'blendingCoalNo' } },
	{ title: '质检场景', dataIndex: 'inspectionSceneList', key: 'inspectionSceneList', customRender },
	{
		title: '质检人员',
		dataIndex: 'createdName',
		key: 'createdName',
		scopedSlots: { customRender: 'supervisorUserName' }
	},
	{ title: '操作', key: 'action', scopedSlots: { customRender: 'action' }, fixed: 'right' }
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
			expandedRowKeys: [],
			downloading: false,
			url: {
				list: getTaskList
			},
			searchList: [
				{
					decorator: ['companyName'],
					addonBeforeTitle: '货主名称',
					type: 'input',
					maxLength: 50,
					placeholder: '请输入货主名称'
				},
				{
					decorator: ['createdDate'],
					addonBeforeTitle: '创建日期',
					type: 'rangePicker',
					realKey: ['createDateStart', 'createDateEnd']
				},
				{
					decorator: ['completeDate'],
					addonBeforeTitle: '完成时间',
					type: 'rangePicker',
					realKey: ['completeDateStart', 'completeDateEnd']
				},

				{
					decorator: ['sampleName'],
					addonBeforeTitle: '样品名称',
					type: 'input',
					width: 100,
					maxLength: 50,
					placeholder: '请输入样品名称'
				},
				{
					decorator: ['goodsName'],
					addonBeforeTitle: '品名',
					type: 'input',
					width: 100,
					maxLength: 50,
					placeholder: '请输入品名'
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
	created() {},
	computed: {
		dataSourceTemp() {
			let index = 1;
			let pageNo = this.pagination.pageNo;
			let pageSize = this.pagination.pageSize;
			let count = (pageNo - 1) * pageSize;
			this.dataSource.map(item => {
				item.index = count + index;
				let childs = [];

				if (item.sampleInfoList.length > 1) {
					item.sampleInfoList.forEach(element => {
						childs.push({
							id: element.id,
							completeDate: item.completeDate,
							sampleNameList: element.sampleName,
							inspectionSceneList: element.inspectionSceneDesc,
							goodsNameList: element.goodsName,
							createdName: item.createdName,
							stationName: item.stationName,
							companyName: item.companyName,
							serialNo: '',
							createDate: item.createDate,
							fileUrl: element.fileUrl,
							contractNo: element.contractNo,
							blendingCoalNo: element.blendingCoalNo
						});
					});
				}
				item.children = childs;
				index += 1;
			});
			return this.dataSource;
		}
	},
	methods: {
		openReportPDF(record) {
			let reportUrl;
			if (record.sampleInfoList) {
				reportUrl = record.sampleInfoList[0].fileUrl;
			} else {
				reportUrl = record.fileUrl;
			}

			if (reportUrl == null) return;

			// 查看报告
			window.open(reportUrl, '_blank');
		},
		lookDetail(record) {
			console.log('lookeDetail  ' + JSON.stringify(record));

			let sampleId;
			if (record.sampleInfoList) {
				sampleId = record.sampleInfoList[0].id;
			} else {
				sampleId = record.id;
			}
			console.log('得到的id====' + sampleId);
			this.$router.push({
				path: '/center/logisticsPlatform/qualityRecords/detail',
				query: {
					id: sampleId
				}
			});
		},
		toggleExpand(record) {
			if (!this.expandedRowKeys.includes(record.id)) {
				this.expandedRowKeys.push(record.id);
			} else {
				this.expandedRowKeys = this.expandedRowKeys.filter(function (item) {
					return item != record.id;
				});
			}
		},
		getSimpleSample(text) {
			if (text.length < 10) return text;
			let simple = text.slice(0, 10) + '...';
			return simple;
		},
		expandIcon(props) {
			if (props.record.children && props.record.children.length > 0) {
				if (props.expanded) {
					return <div class="expand-open"></div>;
				} else {
					return <div class="expand-normal"></div>;
				}
			} else {
				<div style="width: 0; height: 0"></div>;
			}
		},
		handleRowClick(record) {
			return {
				on: {
					click: () => {
						if (!this.expandedRowKeys.includes(record.id)) {
							this.expandedRowKeys.push(record.id);
						} else {
							this.expandedRowKeys = this.expandedRowKeys.filter(function (item) {
								return item != record.id;
							});
						}
					}
				}
			};
		},
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
		pushToDetail(data) {
			this.$router.push({
				path: '/center/logisticsPlatform/inspectRecords/detail',
				query: {
					id: data.id
				}
			});
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
