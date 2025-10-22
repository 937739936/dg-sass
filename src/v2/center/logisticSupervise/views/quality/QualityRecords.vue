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
					class="new-table"
					:bordered="false"
					rowKey="id"
					:dataSource="dataSource"
					:pagination="false"
					:loading="tableLoading"
					:scroll="{ x: true }"
				>
					<div
						slot="action"
						slot-scope="text, record"
					>
						<a-space>
							<a @click.prevent="pushToDetail(record)" >详情</a>
							<a
								v-if="record.analysisReportUrl"
								@click.prevent="openReportPDF(record.analysisReportUrl)"
								>化验报告</a
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
		<ImageViewer ref="viewer" />
	</div>
</template>

<script>
import { ListMixin } from '@/v2/components/mixin/ListMixin';
import { mapGetters } from 'vuex';
import { getQualityRecords } from '@/v2/center/logisticSupervise/api';
import ImageViewer from "@/v2/components/imageViewer.vue";
import {filePreview} from "@/v2/utils/file";
const columns = [
	{ title: '质检任务编号', dataIndex: 'serialNo', key: 'serialNo' },
	{ title: '创建时间', dataIndex: 'createDate', key: 'createDate' },
	{ title: '仓库名称', dataIndex: 'stationName', key: 'stationName' },
	{ title: '货主名称', dataIndex: 'companyName', key: 'companyName' },
	{ title: '船名', dataIndex: 'shipName', key: 'shipName' },
	{ title: '装船日期', dataIndex: 'shipDate', key: 'shipDate' },
	{ title: '质检人员', dataIndex: 'createdName', key: 'createdName' },
	{
		title: '操作',
		dataIndex: '操作',
		key: '操作',
		width: 140,
		scopedSlots: { customRender: 'action' },
		fixed: 'right'
	}
];
export default {
	mixins: [ListMixin],
	components: {ImageViewer},
	data() {
		return {
			columns,
			tableLoading: false,
			downloading: false,
			url: {
				list: getQualityRecords
			},
			searchList: [
				{
					decorator: ['stationName'],
					addonBeforeTitle: '仓库名称',
					type: 'input',
					placeholder: '请输入',
					allowClear: true
				},
				{
					decorator: ['companyName'],
					addonBeforeTitle: '货主名称',
					type: 'input',
					placeholder: '请输入',
					allowClear: true
				},
				{
					decorator: ['createDate'],
					addonBeforeTitle: '创建日期',
					realKey: ['createDateStart', 'createDateEnd'],
					type: 'rangePicker',
					placeholder: ['开始日期', '结束日期'],
					allowClear: true
				},
				{
					decorator: ['shipDate'],
					addonBeforeTitle: '装船日期',
					realKey: ['shipDateStart', 'shipDateEnd'],
					type: 'rangePicker',
					placeholder: ['开始日期', '结束日期'],
					allowClear: true
				},
				{
					decorator: ['shipName'],
					addonBeforeTitle: '船名',
					type: 'input',
					placeholder: '请输入',
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
	created() {},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		isCoreCompany() {
			return this.VUEX_ST_COMPANYSUER.companyType == 'CORE_COMPANY';
		},
	},
	methods: {
		handleChange(data) {
			this.searchParams = data;
			this.pagination.pageNo = 1;
			this.changeSearch(this.searchParams);
		},
		pushToDetail(data) {
			this.$router.push({
				path: '/center/logisticSupervise/quality/records/detail',
				query: {
					id: data.id
				}
			});
		},
		openReportPDF(url) {
			filePreview(url,(urls) => {
				this.$refs.viewer.show(urls)
			})
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');

.slMain {
	margin-top: -10px;
	
}

.slMain {
	margin-top: -10px;

	.table-box {
		position: relative;
		margin-top: 30px;

		.actions-box {
			text-align: right;
			margin-bottom: 20px;
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
