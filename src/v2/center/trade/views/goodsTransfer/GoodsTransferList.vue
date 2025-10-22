<template>
	<div class="slMain">
		<a-card :bordered="false">
			<span
				slot="title"
				class="slTitle"
			>
				货转管理
				<a-button
					type="primary"
					v-auth="'dgChain:goodsTransfer:list:create'"
					class="add-btn"
					@click="add"
				>
					开具货转
				</a-button>
			</span>
			<div>
				<!-- 查询区域 -->
				<SlFormNew
					:list="searchList"
					layout="inline"
					@change="changeSearch"
					:isShowIcon="false"
					:isShowSearchBox="true"
				></SlFormNew>
			</div>
			<!-- tabs -->
			<div class="tabs-box">
				<Tabs
					v-if="statusData"
					:statusData="statusData"
					@callback="tabChange"
					ref="Tabs"
				/>
				<div
					class="export-box"
					@click="exportFunc"
				>
					<ExportIcon class="export-icon"></ExportIcon>
					<span
						v-auth="'dgChain:goodsTransfer:batchDownload'"
						class="export-text"
						>批量下载</span
					>
				</div>
			</div>
			<!-- 表格 -->
			<div :class="'table-box ' + (pagination.total > 10 ? 'fixedBottom ' : ' ')">
				<a-table
					:columns="columns"
					class="new-table"
					:rowKey="key"
					:scroll="{ x: true }"
					:dataSource="dataSource"
					:pagination="false"
					:loading="loading"
					:row-selection="rowSelection"
				>
					<div
						slot="status"
						slot-scope="status, item"
						id="tooltip-parent-id"
					>
						<a-tooltip
							placement="top"
							trigger="hover"
							:visible="item.tipShowText && visibleTipText"
							@visibleChange="e => visibleChange(e, item)"
						>
							<template slot="title">
								<a-spin v-if="!tipShowText">
									<a-icon
										slot="indicator"
										type="sync"
										style="font-size: 16px; color: #fff"
										spin
									/>
								</a-spin>
								<span v-else>{{ tipShowText }}</span>
							</template>
							<div :class="`delivery-status status-${item.goodsTransferStatus}`">
								{{ status || '-' }}
							</div>
						</a-tooltip>
					</div>
				</a-table>
				<i-pagination
					:pagination="pagination"
					:showTotalMain="showTotal"
					@change="getList"
				/>
			</div>
			<SelectContractModal
				ref="selectContractModal"
				@ok="selectContract"
			/>
			<CancelModal
				ref="cancelModal"
				@ok="getList"
			/>
		</a-card>
	</div>
</template>

<script>
import { filterCodeByKey } from '@sub/utils/globalCode.js';
import { ListMixin } from '@/v2/components/mixin/ListMixin';
import { GoodsTransferDOColumns1, GoodsTransferDOColumns2 } from './columns/columns.js';
import {
	API_goodsTransferBatchDownload,
	API_goodsTransferGetStatusTip,
	API_goodsTransferDelete,
	API_goodsTransferList
} from '@/v2/center/trade/api/goodsTransfer';
import { mapGetters } from 'vuex';
import comDownload from '@sub/utils/comDownload.js';
import Tabs from './components/Tabs';
import SelectContractModal from './components/SelectContractModal';
import CancelModal from './components/CancelModal';
import tipConfig from './tableTooltip';
import { ExportIcon } from '@sub/components/svg'

const searchList = [
	{
		decorator: ['serialNo'],
		addonBeforeTitle: '编号',
		type: 'input',
		placeholder: '请输入订单或合同编号'
	},
	{
		decorator: ['goodsTransferNo'],
		addonBeforeTitle: '货转编号',
		type: 'input',
		placeholder: '请输入货转编号'
	},
	{
		decorator: ['buyerCompanyName'],
		addonBeforeTitle: '买方企业',
		type: 'input',
		placeholder: '请输入买方企业'
	},
	{
		decorator: ['sellerCompanyName'],
		addonBeforeTitle: '卖方企业',
		type: 'input',
		placeholder: '请输入卖方企业'
	},
	{
		decorator: ['deliverDate'],
		addonBeforeTitle: '货转开具日期',
		type: 'rangePicker',
		allowClear: true,
		valueFormat: 'YYYY-MM-DD',
		format: 'YYYY-MM-DD',
		realKey: ['signDateBegin', 'signDateEnd']
	},
	{
		decorator: ['status'],
		addonBeforeTitle: '状态',
		type: 'select',
		placeholder: '请选择状态',
		options: filterCodeByKey('goods_transfer_status').map(item => {
			return {
				label: item.text,
				value: item.value
			};
		})
	}
];
const statusData = [
	{
		text: '已开具',
		value: 'GOODS_TRANSFER_ISSUED'
	},
	{
		text: '已收到',
		value: 'GOODS_TRANSFER_RECEIVE'
	}
];
export default {
	mixins: [ListMixin],
	data() {
		return {
			searchList,
			statusData,
			key: 'goodsTransferNo', //键值
			url: {
				list: API_goodsTransferList
			},
			defaultParams: {
				goodsTransferRecordType: 'GOODS_TRANSFER_ISSUED' //默认已开具
			},
			tipShowText: '',
			visibleTipText: false,
			selectedRows: [] //选中
		};
	},
	components: {
		SelectContractModal,
		Tabs,
		CancelModal,
		ExportIcon
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		currentCompanyUscc() {
			return this.VUEX_ST_COMPANYSUER.company.uscc;
		},
		columns() {
			if (this.defaultParams.goodsTransferRecordType == 'GOODS_TRANSFER_ISSUED') {
				return GoodsTransferDOColumns1(this);
			} else {
				return GoodsTransferDOColumns2(this);
			}
		},
		rowSelection() {
			let that = this;
			return {
				columnWidth: 29,
				getCheckboxProps: rescord => {
					return {
						props: {
							disabled: !rescord.operatorVo.canDownLoad
						}
					};
				},
				selectedRowKeys: that.selectedRows,
				onSelect: (record, selected) => {
					if (selected) {
						that.selectedRows.push(record[that.key]);
					} else {
						that.selectedRows = that.selectedRows.filter(item => {
							return item != record[that.key];
						});
					}
				},
				onSelectAll: (selected, selectedRows) => {
					that.selectedRows = selectedRows.map(item => {
						return item[that.key];
					});
				}
			};
		},
		//展示底部不选择
		showTotal() {
			//当有选中数据时，修改底部展示
			let length = this.selectedRows.length,
				that = this;
			if (length) {
				//筛选其中可选项
				let dataList = this.dataSource.filter(item => {
					return item.operatorVo.canDownLoad;
				}).length;
				let h = this.$createElement;
				return h('a-space', { attrs: { size: 12 } }, [
					h(
						'a-checkbox',
						{
							attrs: {
								indeterminate: !!length && length < dataList,
								checked: length == dataList
							},
							on: {
								change: that.onCheckAllChange
							}
						},
						null
					),
					h('span', null, `已选${length}项`)
				]);
			} else {
				return ``;
			}
		}
	},
	watch: {
		dataSource() {
			//表达那数据变化时，清空选中
			this.selectedRows = [];
		}
	},
	methods: {
		onCheckAllChange(e) {
			//如果选中给全部值，否则清空
			let that = this;
			Object.assign(this, {
				selectedRows: e.target.checked
					? that.dataSource
							.filter(item => {
								return item.operatorVo.canDownLoad;
							})
							.map(item => {
								return item[that.key];
							})
					: []
			});
		},
		//操作栏
		actionMinList(item) {
			let operatorVo = item.operatorVo;
			if (!operatorVo) {
				operatorVo = {};
			}
			let actionList = [
				{
					text: '盖章',
					condition: operatorVo.canSign,
					auth: 'dgChain:goodsTransfer:list:sign',
					incident: 'stamp'
				},
				{
					text: '确认',
					condition: operatorVo.canConfirm,
					auth: 'dgChain:goodsTransfer:list:sign',
					incident: 'confirm'
				},
				{
					text: '查看',
					condition: operatorVo.canDetail,
					auth: 'dgChain:goodsTransfer:list:detail',
					incident: 'viewDetail'
				},
				{
					text: '编辑',
					condition: operatorVo.canEdit,
					auth: 'dgChain:goodsTransfer:list:edit',
					incident: 'edit'
				},
				{
					text: '删除',
					condition: operatorVo.canDelete,
					auth: 'dgChain:goodsTransfer:list:delete',
					incident: 'delete'
				},
				{
					text: '作废',
					condition: operatorVo.canCancel,
					auth: 'dgChain:goodsTransfer:list:cancel',
					incident: 'cancel'
				},
				{
					text: '下载',
					condition: operatorVo.canDownLoad,
					auth: 'dgChain:goodsTransfer:list:download',
					incident: 'download'
				}
			];
			return actionList;
		},
		//批量下载
		exportFunc() {
			if (!this.selectedRows?.length) {
				this.$message.error('请先选择一条数据');
			} else {
				API_goodsTransferBatchDownload({
					goodsTransferNoList: this.selectedRows
				}).then(res => {
					comDownload(res.data, undefined, res.name);
				});
			}
		},
		//添加
		add() {
			this.$refs.selectContractModal.init();
		},
		//修改查询类型
		tabChange(val) {
			this.defaultParams.goodsTransferRecordType = val;
		},
		// 状态悬浮窗
		visibleChange(visible, items) {
			this.tipShowText = '';
			if (visible) {
				items.tipShowText = true;
				this.visibleTipText = true;
				API_goodsTransferGetStatusTip({
					goodsTransferNo: items.goodsTransferNo
				}).then(res => {
					this.tipShowTextMethods(items, res.data);
				});
			} else {
				items.tipShowText = false;
				this.visibleTipText = false;
				this.$forceUpdate();
			}
		},
		//状态加载
		tipShowTextMethods(row, data) {
			let text = '';
			text = tipConfig[row.goodsTransferStatus].a;
			if (row.goodsTransferStatus == '8' && data?.rejectReason) {
				text += '，驳回原因：' + data?.rejectReason;
			}
			if (row.goodsTransferStatus == '6' && data?.cancelReason) {
				text += '，作废原因：' + data?.cancelReason;
			}
			text = text
				.replace('【审批部门】', data.auditPerson || '')
				.replace('【买方】', data.buyerAbbreviation || '')
				.replace('【卖方】', data.sellerAbbreviation || '')
				.replace('【卖方签章员】', data.sellerSingerName || '')
				.replace('【买方签章员】', data.buyerSingerName || '')
				.replace('【作废时间】', data.cancelTime || '');
			this.tipShowText = text;
			this.$forceUpdate();
		},
		//开具货转
		selectContract(query) {
			this.$router.push({
				path: '/center/transfer/goodsTransfer/apply',
				query
			});
		},
		//货转编辑
		edit(item) {
			this.$router.push({
				path: '/center/transfer/goodsTransfer/apply',
				query: {
					goodsTransferNo: item.goodsTransferNo,
					orderType: item.contractType,
					serialNo: item.serialNo
				}
			});
		},
		//盖章
		stamp(item) {
			this.$router.push({
				path: '/center/transfer/goodsTransfer/stamp',
				query: {
					pdfUrl: item.pdfPath,
					goodsTransferNo: item.goodsTransferNo
				}
			});
		},
		//确认盖章
		confirm(item) {
			this.$router.push({
				path: '/center/transfer/goodsTransfer/confirm',
				query: {
					pdfUrl: item.pdfPath,
					goodsTransferNo: item.goodsTransferNo
				}
			});
		},
		//详情
		viewDetail(item) {
			let { goodsTransferNo } = item;
			this.$router.push({
				path: '/center/transfer/goodsTransfer/detail',
				query: {
					goodsTransferNo
				}
			});
		},
		//删除
		delete(item) {
			let { goodsTransferNo } = item;
			let that = this;
			this.$confirm({
				centered: true,
				title: `是否删除该货转证明?`,
				okText: '确定',
				cancelText: '取消',
				onOk() {
					API_goodsTransferDelete({ goodsTransferNo }).then(res => {
						if (res.success) {
							that.$message.success('操作成功');
							that.getList();
						}
					});
				},
				onCancel() {}
			});
		},
		//作废
		cancel(item) {
			let { goodsTransferNo } = item;
			this.$refs.cancelModal.init(goodsTransferNo);
		},
		//下载
		download(item) {
			let { goodsTransferNo } = item;
			API_goodsTransferBatchDownload({
				goodsTransferNoList: [goodsTransferNo]
			}).then(res => {
				comDownload(res.data, undefined, res.name);
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
	/deep/ .ant-card-head .ant-card-head-title {
		border-bottom: 1px solid #e5e6eb;
		padding-bottom: 20px;
		margin-bottom: 10px;
	}
}
.tabs-box {
	position: relative;

	::v-deep.ant-tabs-bar {
		padding-right: 90px;
	}
	.export-box {
		position: absolute;
		right: 0;
		top: 16px;
		text-align: right;
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
	::v-deep.ant-tabs-ink-bar {
		bottom: 1.5px;
	}
}

.table-box.fixedBottom {
	.new-table {
		margin-bottom: 2px;
	}
	.slPagination {
		margin-top: 10px;
		width: calc(100% - 254px);
		min-width: 1186px;
		background: #fff;
		padding: 10px 30px;
		position: fixed;
		bottom: 0;
		z-index: 1;
		left: 228px;
	}
}

.add-btn {
	float: right;
}
//默认待提交状态
.delivery-status {
	display: inline-block;
	padding: 4px 6px;
	border-radius: 4px;
	font-size: 12px;
	background: #c1d7ff;
	color: #4682f3;
	cursor: pointer;
}
//待确认
.delivery-status.status-7 {
	background: #c9daff;
	color: #596fa0;
}
//审批中
.delivery-status.status-2 {
	background: #ffdbc8;
	color: #ff7937;
}
//待签约
.delivery-status.status-3 {
	background: #f8dde8;
	color: #db81a5;
}
//已签约
.delivery-status.status-4 {
	background: #c5ecdd;
	color: #3eb384;
}
//已作废
.delivery-status.status-6 {
	background: #e0e0e0;
	color: #a8a8a8;
}
//退回
.delivery-status.status-5 {
	background: #d2dfea;
	color: #7590b9;
}
//驳回
.delivery-status.status-8 {
	background: #f2d0d0;
	color: #dd4444;
}
</style>
