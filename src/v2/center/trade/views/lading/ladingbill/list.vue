<template>
	<div class="slMain">
		<a-card :bordered="false">
			<div class="methods-wrap">
				<span
					slot="title"
					class="slTitle"
					>提货单管理</span
				>
				<div v-auth="'dgChain:lading:lading:apply'">
					<a-button
						type="primary"
						@click="goSelectContract"
					>
						<span style="font-size: 14px">提货申请</span>
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
						<!-- 待提交 -->
						<template>
							<a-space>
								<a
									href="javascript:void(0)"
									v-auth="'dgChain:lading:lading:view'"
									@click="handleViewDetail(item)"
									>查看</a
								>
								<a
									href="javascript:void(0)"
									v-auth="'dgChain:lading:lading:edit'"
									@click="handleModify(item)"
									v-if="item.status == 'OA_REJECT'"
									>编辑</a
								>
								<a
									href="javascript:void(0)"
									v-auth="'dgChain:lading:lading:download'"
									@click="downloadPdf(item)"
									v-if="item.status == 'OA_AUDIT' || item.status == 'EFFECTIVE'"
									>下载</a
								>
								<a
									href="javascript:void(0)"
									v-auth="'dgChain:lading:lading:seal'"
									@click="goStamp(item)"
									v-if="item.status == 'TO_BE_SIGN'"
									>盖章</a
								>
								<a
									href="javascript:void(0)"
									v-auth="'dgChain:lading:lading:cancel'"
									@click="invalid(item.id)"
									v-if="item.status == 'EFFECTIVE' && item.canCancel == 1"
									>作废</a
								>
								<a
									href="javascript:void(0)"
									v-auth="'dgChain:lading:lading:delete'"
									@click="cancelGoodsTransfer(item.id)"
									v-if="item.status == 'OA_REJECT' || item.status == 'TO_BE_SIGN'"
									>删除</a
								>
							</a-space>
						</template>
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
import { API_getLadingList, API_DownLoadLadingFile, API_QuitLading } from '@/v2/center/trade/api/lading';
import iPagination from '@sub/components/iPagination';
import { filterCodeByValueName } from '@sub/utils/globalCode.js';
import { colSpan, formLayout } from '@/v2/config/layoutConfig';
import comDownload from '@sub/utils/comDownload.js';
import { isEqual } from 'lodash';
import { ListMixin } from '@/v2/components/mixin/ListMixin';

const tabList = [
	{
		name: 'OA审批中',
		status: 'OA_AUDIT'
	},
	{
		name: '待签约',
		status: 'TO_BE_SIGN'
	},
	{
		name: 'OA审批驳回',
		status: 'OA_REJECT'
	},
	{
		name: '已作废',
		status: 'CANCEL'
	},
	{
		name: '已生效',
		status: 'EFFECTIVE'
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
		decorator: ['ladingNo'],
		addonBeforeTitle: '提货单编号',
		type: 'input',
		placeholder: '请输入提货单编号'
	},
	{
		decorator: ['buyerName'],
		addonBeforeTitle: '提货单开具方',
		type: 'input',
		placeholder: '请输入提货单开具方'
	},
	{
		decorator: ['sellerName'],
		addonBeforeTitle: '提货单接收方',
		type: 'input',
		placeholder: '请输入提货单接收方'
	},
	{
		decorator: ['ladingDate'],
		addonBeforeTitle: '提货时间',
		type: 'rangePicker',
		realKey: ['ladingDateStart', 'ladingDateEnd']
	},
	{
		decorator: ['transportMode'],
		addonBeforeTitle: '状态',
		type: 'select',
		placeholder: '请选择状态',
		options: tabList.map(item => {
			return { value: item.status, label: item.name };
		})
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
					title: '提货单编号',
					dataIndex: 'ladingNo',
					width: 150
				},
				{
					title: '合同编号',
					dataIndex: 'contractNo',
					width: 150
				},
				{
					title: '提货单开具方',
					dataIndex: 'buyerName',
					width: 150
				},
				{
					title: '提货单接收方',
					dataIndex: 'sellerName',
					width: 150
				},
				{
					title: '提货数量（吨）',
					dataIndex: 'quantity',
					width: 150
				},
				{
					title: '提货时间',
					dataIndex: 'beginDate',
					customRender: (v, r) => r.beginDate + '~' + r.endDate,
					width: 150
				},

				{
					title: '提货单状态',
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
					width: 200,
					scopedSlots: {
						customRender: 'action'
					},
					fixed: 'right'
				}
			],
			status: '',
			tabList,
			params: {
				pageSize: 10
			},

			receiveDate: null,
			recordList: [],

			modalPdfIsShow: false,
			visible: false,
			// 作废
			invalidParams: {
				id: '',
				remark: ''
			},
			pagination: {
				type: 'GoodsTransferReceiveList',
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
		resetFunc() {},
		handleChange(data) {
			if (isEqual(data, this.searchParams)) {
				return;
			}
			this.searchParams = data;
			this.changeSearch(data);
		},
		async downloadPdf(item) {
			const res = await API_DownLoadLadingFile({ id: item.id });
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
		receiveDateGetTime(value, dateString) {
			this.params.createDateBegin = dateString[0];
			this.params.createDateEnd = dateString[1];
		},
		resetValues() {
			this.params = {
				contractNo: null,
				createDateBegin: null,
				createDateEnd: null
			};
			this.pagination.pageNo = 1;
			(this.receiveDate = null), this.getList();
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
			API_getLadingList(params)
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
				path: `/center/ladingbill/lading/detail`,
				query: {
					id: item.id
				}
			});
		},
		// 修改
		handleModify(item) {
			this.$router.push({
				path: '/center/ladingbill/lading/add',
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
				path: '/center/ladingbill/lading/stamp',
				query: {
					id: item.id
				}
			});
		},
		// 新增
		goSelectContract() {
			this.$router.push({
				path: '/center/ladingbill/lading/contract'
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
				API_QuitLading({
					...this.invalidParams,
					type: 'CANCEL'
				}).then(res => {
					this.$message.success('作废成功！');
					this.visible = false;
					this.getList();
				});
			} else {
				this.$message.error('请输入作废原因！');
			}
		},
		// 删除
		cancelGoodsTransfer(id) {
			var t = this;
			this.$confirm({
				centered: true,
				title: '确认取消该放货通知吗？',
				okText: '确定',
				cancelText: '取消',
				onOk: () => {
					API_QuitLading({ id: id, type: 'DELETE' }).then(res => {
						if (res.success) {
							t.$message.success('删除成功');
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
.flatten-nav {
	width: 100%;
	display: flex;
	background-color: #fff;
	height: 30px;
	justify-content: flex-start;
	font-size: 14px;
	margin-top: 4px;
	label {
		color: rgba(0, 0, 0, 0.85);
		font-size: 14px;
		line-height: 30px;
	}
	.nav-item {
		min-width: 70px;
		padding-left: 15px;
		padding-right: 15px;
		text-align: center;
		line-height: 30px;
		position: relative;
		cursor: pointer;
		&.active {
			background-color: #4682f3;
			color: #fff;
		}
	}
}
.record-list {
	margin-top: 20px;
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
}
::v-deep.ant-input {
	width: 250px;
}
</style>
