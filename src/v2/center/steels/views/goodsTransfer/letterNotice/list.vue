<template>
	<div
		class="slMain"
		style="margin-top: -10px"
	>
		<a-card :bordered="false">
			<div class="s-title">
				<span
					slot="title"
					class="slTitle"
					>放货通知单</span
				>
				<div>
					<a-button
						type="primary"
						@click="goSelectContract"
						v-auth="'steel:goodsTransfer:transferRelease:add'"
					>
						<span style="font-size: 14px">新增放货通知</span>
					</a-button>
				</div>
			</div>
			<SlFormNew
				:list="searchList"
				layout="inline"
				@change="searchSubmit"
				:allowClear="false"
				@resetFunc="resetValues"
				:isShowIcon="false"
				:isShowSearchBox="true"
			></SlFormNew>
			<div class="record-list">
				<div class="bulk-download-btn">
					<a-button
						type="primary"
						@click="handleBulkDownload"
						v-auth="'steel:goodsTransfer:transferRelease:batchdownload'"
						>批量下载</a-button
					>
				</div>
				<a-table
					:pagination="false"
					:columns="columns"
					:data-source="dataSource"
					:scroll="{ x: true }"
					rowKey="releaseNo"
					class="new-table"
					:loading="loading"
				>
					<div
						slot="action"
						slot-scope="action, item"
					>
						<!-- 待提交 -->
						<template>
							<a
								href="javascript:void(0)"
								v-auth="'steel:goodsTransfer:transferRelease:edit'"
								@click="handleModify(item)"
								v-if="item.status == 'WAIT_SUBMIT' && item.hasEditRole"
								>修改</a
							>
							<a
								href="javascript:void(0)"
								@click="cancelGoodsTransfer(item.id)"
								v-if="item.status == 'WAIT_SUBMIT' && item.hasEditRole"
								>取消</a
							>
							<a
								href="javascript:void(0)"
								v-auth="'steel:goodsTransfer:transferRelease:view'"
								@click="handleViewDetail(item)"
								>查看</a
							>
							<a
								href="javascript:void(0)"
								@click="downloadPdf(item)"
								v-if="item.status != 'WAIT_SUBMIT'"
								>下载</a
							>
							<a
								href="javascript:void(0)"
								v-auth="'steel:goodsTransfer:transferRelease:cancel'"
								@click="invalid(item.id)"
								v-if="item.status == 'SIGNED' && item.hasEditRole"
								>作废</a
							>
							<a
								href="javascript:void(0)"
								v-auth="'steel:goodsTransfer:transferRelease:sign'"
								@click="goStamp(item)"
								v-if="item.status == 'WAIT_SIGN' && item.hasEditRole"
								>盖章</a
							>
						</template>
					</div>
				</a-table>
			</div>
			<i-pagination
				:pagination="pagination"
				@change="getList"
			/>
		</a-card>

		<a-modal
			v-model="visible"
			title="作废原因"
			@ok="handleOk"
			cancelText="取消"
			okText="确定"
			@cancel="visible = false"
		>
			<a-input
				v-model.trim="invalidParams.reason"
				placeholder="请输入作废原因"
			/>
		</a-modal>
	</div>
</template>

<script>
import {
	API_getCommonDownload,
	API_SteelsReleaseExportDownload,
	API_SteelsGoodstransferReleaseQuit,
	API_SteelsGoodstransferPageRelease
} from '@/v2/center/steels/api/goodsTransfer.js';
import { mapGetters } from 'vuex';
import { filterCodeByValueName } from '@sub/utils/globalCode.js';
import { colSpan, formLayout } from '@/v2/config/layoutConfig';
import comDownload from '@sub/utils/comDownload.js';
import moment from 'moment';
import { ListMixin } from '@/v2/components/mixin/ListMixin';

const searchList = [
	{
		decorator: ['releaseNo'],
		addonBeforeTitle: '放货单号',
		type: 'input',
		placeholder: '请输入放货单号',
		allowClear: true
	},
	{
		decorator: ['contractNo'],
		addonBeforeTitle: '合同编号',
		type: 'input',
		placeholder: '请输入合同编号',
		allowClear: true
	},
	{
		decorator: ['companyName'],
		addonBeforeTitle: '企业名称',
		type: 'input',
		placeholder: '请输入企业名称',
		allowClear: true
	},
	{
		decorator: ['date2'],
		addonBeforeTitle: '开具日期',
		realKey: ['createDateBegin', 'createDateEnd'],
		type: 'rangePicker',
		placeholder: ['', ''],
		allowClear: true
	},
	{
		decorator: ['status'],
		addonBeforeTitle: '状态',
		type: 'select',
		placeholder: '请选择',
		allowClear: true,
		options: []
	}
];
export default {
	mixins: [ListMixin],
	data() {
		return {
			flag: false,
			colSpan,
			url: {
				list: API_SteelsGoodstransferPageRelease
			},
			formLayout,
			selectedRowKeys: [],
			searchList,
			columns: [
				{
					title: '放货单号',
					dataIndex: 'releaseNo'
				},
				{
					title: '合同编号',
					dataIndex: 'contractNo'
				},
				{
					title: '状态',
					dataIndex: 'statusDesc',
					key: 'statusDesc'
				},
				{
					title: '卖方名称',
					dataIndex: 'sellCompanyName'
				},
				{
					title: '买方名称',
					dataIndex: 'buyCompanyName'
				},
				{
					title: '钢材种类',
					dataIndex: 'steelTypeDesc'
				},
				{
					title: '业务类型',
					dataIndex: 'businessTypeDesc'
				},
				{
					title: '放货数量(吨)',
					dataIndex: 'quantity'
				},
				{
					title: '放货通知单开具时间',
					dataIndex: 'createdDate'
				},
				{
					key: 'action',
					title: '操作',
					scopedSlots: {
						customRender: 'action'
					},
					fixed: 'right'
				}
			],
			params: {
				transferProcessTimeBegin: null,
				transferProcessTimeEnd: null
			},
			receiveDate: null,
			recordList: [],
			goodsTransferStatus: [
				{
					label: '待提交',
					value: 'WAIT_SUBMIT'
				},
				{
					label: '待审批',
					value: 'AUDITING'
				},
				{
					label: '待签约',
					value: 'WAIT_SIGN'
				},
				{
					label: '已签约',
					value: 'SIGNED'
				},
				{
					label: '驳回',
					value: 'REJECTED'
				},
				{
					label: '已作废',
					value: 'CANCEL'
				}
				// {
				//     label: "已取消",
				//     value: "CANCELED"
				// },
			],
			pdfUrl: '',
			modalPdfIsShow: false,
			visible: false,
			// 作废
			invalidParams: {
				id: '',
				reason: ''
			},
			pagination: {
				type: 'GoodsTransferReceiveList',
				total: 0, // 总条数
				pageNo: 1
			},
			loading: false
		};
	},
	components: {},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		})
	},
	mounted() {
		this.searchList[4].options = this.goodsTransferStatus;
	},
	methods: {
		async downloadPdf(item) {
			const res = await API_getCommonDownload(item.pdfPath);
			const str = `放货通知单(${item.buyCompanyName}-${item.sellCompanyName})-${item.releaseNo}.pdf`;
			comDownload(res, null, str);
		},

		receiveDateGetTime(value, dateString) {
			this.params.createDateBegin = dateString[0];
			this.params.createDateEnd = dateString[1];
		},
		searchSubmit(info) {
			this.pagination.pageNo = 1;
			this.searchParams = info;
			this.getList();
		},
		resetValues() {
			this.pagination.pageNo = 1;
		},

		// 查看详情
		handleViewDetail(item) {
			this.$router.push({
				path: `/center/steels/goodsTransfer/letterNotice/detail`,
				query: {
					id: item.id,
					type: 'preview'
				}
			});
		},
		// 修改
		handleModify(item) {
			this.$router.push({
				path: '/center/steels/goodsTransfer/letterNotice/add',
				query: {
					id: item.id,
					contractId: item.contractId,
					generateWay: item.generateWay,
					type: 'edit',
					serialNo: item.transferNo
				}
			});
		},
		// 批量下载
		handleBulkDownload() {
			API_SteelsReleaseExportDownload().then(res => {
				let d = moment().format('YYYYMMDD');
				comDownload(res, undefined, '放货通知单-' + d + '.xls');
			});
		},
		// 盖章
		goStamp(item) {
			this.$router.push({
				path: '/center/steels/goodsTransfer/letterNotice/stamp',
				query: {
					contractTemplate: item.contractTemplate,
					id: item.id
				}
			});
		},
		// 新增
		goSelectContract() {
			this.$router.push({
				path: '/center/steels/goodsTransfer/letterNotice/contractList'
			});
		},
		// 作废
		invalid(id) {
			this.visible = true;
			this.invalidParams.reason = '';
			this.invalidParams.id = id;
		},
		handleOk() {
			if (this.invalidParams.reason != null && this.invalidParams.reason != '' && this.invalidParams.reason != undefined) {
				API_SteelsGoodstransferReleaseQuit({
					...this.invalidParams,
					operateType: '2'
				}).then(res => {
					this.$message.success('作废成功！');
					this.visible = false;
					this.getList();
				});
			} else {
				this.$message.error('请输入作废原因！');
			}
		},
		// 取消、删除
		cancelGoodsTransfer(id) {
			var t = this;
			this.$confirm({
				centered: true,
				title: '确认取消该放货通知吗？',
				okText: '确定',
				cancelText: '取消',
				onOk: () => {
					API_SteelsGoodstransferReleaseQuit({ id: id, operateType: '1' }).then(res => {
						if (res.success) {
							t.$message.success('取消成功');
							t.getList();
						}
					});
				}
			});
		}
	},
	filters: {
		filterCodeByValueName
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less" scoped>
.record-list {
	.bulk-download-btn {
		text-align: right;
		margin-bottom: 10px;
	}

	.ant-table-wrapper {
		a {
			display: inline-block;
			margin-right: 8px;

			&:last-child {
				margin-right: 0;
			}
		}
	}
}
</style>
