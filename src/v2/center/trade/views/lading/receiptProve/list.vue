<template>
	<div class="slMain">
		<a-card :bordered="false">
			<div class="methods-wrap">
				<span
					slot="title"
					class="slTitle"
					>收货证明</span
				>
				<div>
					<a-button
						type="primary"
						@click="goSelectContract"
					>
						<span style="font-size: 14px">开具收货证明</span>
					</a-button>
				</div>
			</div>
			<SlFormNew
				:list="searchList"
				layout="inline"
				@change="handleChange"
				@resetFunc="resetFunc"
			></SlFormNew>
			<div :class="'table-box ' + (pagination.total > 10 ? 'fixedBottom' : '')">
				<a-table
					:pagination="false"
					:columns="columns"
					:data-source="recordList"
					rowKey="id"
					:loading="loading"
					class="new-table"
					:scroll="{ x: true }"
				>
					<div
						slot="action"
						slot-scope="action, item"
					>
						<a-space>
							<!-- OA审批中--查看、下载
              待签约--查看、盖章、删除
              已作废--查看
              OA审批驳回--查看、编辑、删除
              已生效--查看、下载、作废 -->
							<a
								href="javascript:void(0)"
								v-auth="'dgChain:lading:receipt:view'"
								@click="handleViewDetail(item)"
								>查看</a
							>
							<a
								href="javascript:void(0)"
								v-auth="'dgChain:lading:receipt:edit'"
								@click="handleModify(item)"
								v-if="item.status == 'OA_REJECT'"
								>编辑</a
							>
							<a
								href="javascript:void(0)"
								v-auth="'dgChain:lading:receipt:seal'"
								@click="goStamp(item)"
								v-if="item.status == 'TO_BE_SIGN'"
								>盖章</a
							>
							<a
								href="javascript:void(0)"
								v-auth="'dgChain:lading:receipt:download'"
								@click="downloadPdf(item)"
								v-if="item.status == 'OA_AUDIT' || item.status == 'EFFECTIVE'"
								>下载</a
							>
							<a
								href="javascript:void(0)"
								v-auth="'dgChain:lading:receipt:cancel'"
								@click="invalid(item.id)"
								v-if="item.status == 'EFFECTIVE'"
								>作废</a
							>
							<a
								href="javascript:void(0)"
								v-auth="'dgChain:lading:receipt:delete'"
								@click="deleteFunc(item.id)"
								v-if="item.status == 'OA_REJECT' || item.status == 'TO_BE_SIGN'"
								>删除</a
							>
						</a-space>
					</div>
				</a-table>
				<i-pagination
					:pagination="pagination"
					@change="getList"
					v-show="params.pageSize < pagination.total"
				/>
			</div>
			<a-modal
				v-model="visible"
				title="作废原因"
				@ok="handleOk"
				cancelText="取消"
				okText="确定"
				@cancel="visible = false"
			>
				<a-input
					v-model.trim="invalidParams.remark"
					placeholder="请输入作废原因"
				/>
			</a-modal>
		</a-card>
	</div>
</template>

<script>
import { API_getReceiptList, API_DownLoadReceiptFile, API_QuitReceipt } from '@/v2/center/trade/api/lading';
import iPagination from "@sub/components/iPagination";
import { colSpan, formLayout } from '@/v2/config/layoutConfig';
import comDownload from '@sub/utils/comDownload.js';
import { isEqual } from 'lodash';
import { ListMixin } from '@/v2/components/mixin/ListMixin';

const tabList = [
	{
		text: 'OA审批中',
		value: 'OA_AUDIT'
	},
	{
		text: '待签约',
		value: 'TO_BE_SIGN'
	},
	{
		text: 'OA审批驳回',
		value: 'OA_REJECT'
	},
	{
		text: '已作废',
		value: 'CANCEL'
	},
	{
		text: '已生效',
		value: 'EFFECTIVE'
	}
];

const searchList = [
	{
		decorator: ['contractNo'],
		addonBeforeTitle: '合同编号',
		type: 'input',
		placeholder: '请输入合同编号'
	},
	{
		decorator: ['receiptNo'],
		addonBeforeTitle: '收货证明编号',
		type: 'input',
		placeholder: '请输入收货证明编号'
	},
	{
		decorator: ['relLadingNo'],
		addonBeforeTitle: '提货单编号',
		type: 'input',
		placeholder: '请输入提货单编号'
	},
	{
		decorator: ['buyerName'],
		addonBeforeTitle: '收货证明开具方',
		type: 'input',
		placeholder: '请输入收货证明开具方'
	},
	{
		decorator: ['sellerName'],
		addonBeforeTitle: '收货证明接收方',
		type: 'input',
		placeholder: '请输入收货证明接收方'
	},
	{
		decorator: ['openDate'],
		addonBeforeTitle: '开具日期',
		type: 'datePicker',
		placeholder: '请选择开具日期'
	}
];

export default {
	mixins: [ListMixin],
	data() {
		return {
			searchList,
			flag: false,
			colSpan,
			formLayout,
			selectedRowKeys: [],
			columns: [
				{
					title: '收货证明编号',
					dataIndex: 'receiptNo',
					width: 150
				},
				{
					title: '提货单编号',
					dataIndex: 'relLadingNo',
					width: 150
				},
				{
					title: '合同编号',
					dataIndex: 'contractNo',
					width: 150
				},
				{
					title: '收货证明开具方',
					dataIndex: 'buyerName',
					width: 150
				},
				{
					title: '收货证明接收方',
					dataIndex: 'sellerName',
					width: 150
				},
				{
					title: '合同数量（吨）',
					dataIndex: 'contractQuantity',
					width: 150
				},
				{
					title: '实际收货数量（吨）',
					dataIndex: 'quantity',
					width: 170
				},
				{
					title: '收货时间',
					dataIndex: 'openDate',
					width: 150
				},
				{
					title: '收货证明状态',
					dataIndex: 'statusDesc',
					width: 150
				},
				{
					title: '最新操作时间',
					dataIndex: 'updateDate',
					width: 150
				},
				{
					key: 'action',
					title: '操作',
					width: 150,
					scopedSlots: {
						customRender: 'action'
					},
					fixed: 'right'
				}
			],
			status: '',
			tabList,
			params: {
				orderNo: '',
				receiptNo: '',
				contractNo: '',
				relLadingNo: '',
				buyerName: '',
				sellerName: '',
				openDate: '',
				status: '',
				pageSize: 10
			},
			recordList: [],
			visible: false,
			// 作废
			invalidParams: {
				id: '',
				reason: ''
			},
			pagination: {
				type: 'receiptProveList',
				total: 0, // 总条数
				pageNo: 1
			},
			loading: false
		};
	},
	components: {
		iPagination
	},
	computed: {},
	mounted() {
		// this.getList();
	},
	methods: {
		handleChange(data) {
			if (isEqual(data, this.searchParams)) {
				return;
			}
			this.searchParams = data;
			this.changeSearch(data);
		},
		resetFunc() {},
		async downloadPdf(item) {
			const res = await API_DownLoadReceiptFile({ id: item.id });
			comDownload(res.data, undefined, res.name);
		},
		resetSearch() {
			this.params = {
				pageSize: 10
			};
			this.status = '';
			this.pagination.pageNo = 1;
			this.search();
		},
		search() {
			this.pagination.pageNo = 1;
			this.getList();
		},
		getList(pageNo = this.pagination.pageNo, pageSize = this.params.pageSize) {
			this.pagination.pageNo = pageNo;
			this.params.pageNo = pageNo;
			this.params.pageSize = pageSize;
			this.loading = true;
			const params = {
				...this.params,
				...this.searchParams
			};
			API_getReceiptList(params)
				.then(res => {
					if (res.success) {
						this.recordList = res.result.records || [];
						this.pagination.total = (res.result && res.result.total) || 0;
					}
				})
				.finally(() => {
					this.loading = false;
				});
		},
		onShowSizeChange(data) {
			this.params.pageNo = data;
			this.getList(this.params);
		},
		// 查看详情
		handleViewDetail(item) {
			this.$router.push({
				path: `/center/ladingbill/receipt/newDetail`,
				query: {
					id: item.id
				}
			});
		},
		// 修改
		handleModify(item) {
			this.$router.push({
				path: '/center/ladingbill/receipt/add',
				query: {
					id: item.id,
					contractType: item.contractType,
					contractId: item.contractId,
					edit: 'edit'
				}
			});
		},
		// 盖章
		goStamp(item) {
			this.$router.push({
				path: '/center/ladingbill/receipt/stamp',
				query: {
					contractTemplate: item.contractTemplate,
					id: item.id
				}
			});
		},
		// 新增
		goSelectContract() {
			this.$router.push({
				path: '/center/ladingbill/receipt/contract'
			});
		},
		// 作废
		invalid(id) {
			this.visible = true;
			this.invalidParams.remark = '';
			this.invalidParams.id = id;
		},
		handleOk() {
			if (this.invalidParams.remark != null && this.invalidParams.remark != '' && this.invalidParams.remark != undefined) {
				API_QuitReceipt({
					...this.invalidParams,
					type: 'CANCEL'
				}).then(res => {
					if (res.success) {
						this.$message.success('作废成功！');
						this.visible = false;
						this.getList();
					}
				});
			} else {
				this.$message.error('请输入作废原因！');
			}
		},
		// 取消、删除
		deleteFunc(id) {
			var t = this;
			this.$confirm({
				centered: true,
				title: '确认删除该条数据?',
				okText: '确定',
				cancelText: '取消',
				onOk: () => {
					API_QuitReceipt({ id: id, type: 'DELETE' }).then(res => {
						if (res.success) {
							t.$message.success('删除成功');
							t.getList();
						}
					});
				}
			});
		}
	}
};
</script>

<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less" scoped>
.slMain {
	margin-top: -10px;
}
.methods-wrap {
	width: 100%;
	height: 48px;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	padding-bottom: 14px;
	box-sizing: border-box;
	border-bottom: 1px solid #e5e6eb;
}
.top-nav {
	width: 100%;
	display: flex;
	background-color: #fff;
	height: 30px;
	justify-content: flex-start;
	font-size: 14px;
	position: relative;
	top: 4px;
}
.nav-item {
	min-width: 100px;
	padding-left: 10px;
	padding-right: 10px;
	text-align: center;
	line-height: 30px;
	position: relative;
	cursor: pointer;
	&.active {
		background: #4682f3;
		color: #fff;
	}
}
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
