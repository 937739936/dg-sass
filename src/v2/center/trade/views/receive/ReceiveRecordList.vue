<template>
	<div class="slMain">
		<a-card :bordered="false">
			<span
				slot="title"
				class="slTitle"
			>
				收货管理
			</span>
			<div>
				<!-- 查询区域 -->
				<SlFormNew
					ref="SlFormNew"
					:list="searchList"
					layout="inline"
					@change="handleChange"
					:isShowIcon="false"
					:isShowSearchBox="true"
				></SlFormNew>
			</div>
			<!-- tabs -->
			<div class="tabs-box">
				<a-tabs
					v-model="status"
					@change="tabChange"
				>
					<a-tab-pane
						v-for="item in statusData"
						:key="item.value"
					>
						<span slot="tab">
							{{ item.text }}
						</span>
					</a-tab-pane>
				</a-tabs>
			</div>
			<!-- 表格 -->
			<div :class="'table-box ' + (pagination.total > 10 ? 'fixedBottom ' : ' ')">
				<a-table
					:columns="columns"
					class="new-table"
					:bordered="false"
					rowKey="id"
					:scroll="{ x: true }"
					:dataSource="dataSource"
					:pagination="false"
					:loading="loading"
				>
					<span
						slot="receiveNoList"
						slot-scope="receiveNoList"
					>
						<span v-if="receiveNoList">
							<div
								v-for="item in receiveNoList.split(',')"
								:key="item"
							>
								{{ item }}
							</div>
						</span>
						<span
							v-else
							style="color: #77889d"
						>
							-
						</span>
					</span>
					<span
						slot="receiverName"
						slot-scope="receiverName"
					>
						{{ receiverName || '-' }}
					</span>
					<div
						slot="status"
						slot-scope="status, item"
						id="tooltip-parent-id"
					>
						<a-tooltip
							placement="top"
							:visible="item.tipShowText && visibleTipText"
							trigger="hover"
							@visibleChange="e => visibleChange(e, item)"
						>
							<template slot="title">
								<div>{{ tipShowText }}</div>
							</template>
							<div :class="`delivery-status status-${status}`">{{ item.statusDesc }}</div>
						</a-tooltip>
					</div>
				</a-table>
				<i-pagination
					:pagination="pagination"
					size="small"
					v-show="pageSize < pagination.total"
					@change="getList"
				/>
			</div>
			<CancelListModal
				@ok="getList"
				ref="cancelListModal"
			/>
			<CancelModalAccept
				@ok="getList"
				ref="cancelModalAccept"
			/>
			<ShipList ref="shipList" />
		</a-card>
	</div>
</template>

<script>
import { ListMixin } from '@/v2/components/mixin/ListMixin';
import { receiveRecordColumnsWait, receiveRecordColumnsReady } from './columns/columns.js';
import {
	API_RECEIVERECORDLISTWait,
	API_RECEIVERECORDLISTReady,
	API_deliverQuantityStatistics
} from '@/v2/center/trade/api/receive';
import { getPopupContainer } from '@/v2/utils/factory.js';
import CancelListModal from '@/v2/center/trade/views/receive/components/CancelListModal';
import CancelModalAccept from '@/v2/center/trade/views/receive/components/CancelModalAccept';
import ShipList from '@/v2/center/trade/views/receive/components/ShipList';

const searchList = [
	{
		decorator: ['serialNo'],
		addonBeforeTitle: '编号',
		type: 'input',
		placeholder: '请输入订单或合同编号',
		code: 979899
	},
	{
		decorator: ['batchNo'],
		addonBeforeTitle: '发货批次号',
		type: 'input',
		placeholder: '请输入发货批次号',
		code: 518141
	},
	{
		decorator: ['receiveNo'],
		addonBeforeTitle: '收货编号',
		type: 'input',
		placeholder: '请输入收货编号',
		code: 757392
	},
	{
		decorator: ['sellerName'],
		addonBeforeTitle: '卖方企业',
		type: 'input',
		placeholder: '请输入卖方企业',
		code: 812425
	},
	{
		decorator: ['receiverName'],
		addonBeforeTitle: '收货人',
		type: 'input',
		placeholder: '请输入收货人名称',
		code: 224966
	},
	{
		decorator: ['deliverDate'],
		addonBeforeTitle: '发货日期',
		type: 'rangePicker',
		allowClear: true,
		valueFormat: 'YYYY-MM-DD',
		format: 'YYYY-MM-DD',
		realKey: ['deliverDateBegin', 'deliverDateEnd'],
		code: 625142
	},
	{
		decorator: ['receiveDate'],
		addonBeforeTitle: '收货日期',
		type: 'rangePicker',
		allowClear: true,
		valueFormat: 'YYYY-MM-DD',
		format: 'YYYY-MM-DD',
		realKey: ['receiveDateBegin', 'receiveDateEnd'],
		code: 292863
	},
	{
		decorator: ['status'],
		addonBeforeTitle: '状态',
		type: 'select',
		placeholder: '请选择状态',
		code: 487588,
		options: [
			{
				label: '待收货',
				value: 2
			},
			{
				label: '部分收货',
				value: 3
			},
			{
				label: '已收货',
				value: 4
			}
		]
	}
];

const statusData = [
	{
		text: '待收货',
		value: 'wait'
	},
	{
		text: '已收货',
		value: 'ready'
	}
];
export default {
	mixins: [ListMixin],
	data() {
		return {
			getPopupContainer,
			searchList,
			statusData,
			status: 'wait',
			columns: receiveRecordColumnsWait(this),
			url: {
				list: API_RECEIVERECORDLISTWait
			},
			tipShowText: '',
			visibleTipText: false
		};
	},
	components: {
		CancelListModal,
		CancelModalAccept,
		ShipList
	},
	created() {
		// 从合同模块跳转进入时，要初始化数据
		if (this.$route.query.contractNo && this.$route.query.from === 'contract') {
			this.$nextTick(() => {
				let data = [{ name: '编号', value: this.$route.query.contractNo, key: 'serialNo', type: 'input' }];
				this.$refs.SlFormNew.initDefault('serialNo', data);
			});
			this.handleChange({ serialNo: this.$route.query.contractNo });
		}
	},
	methods: {
		//操作栏
		actionMinList(item) {
			let actionList = [
				{
					text: '查看',
					incident: 'viewDetail',
					auth: 'dgChain:recDel:recRecord:detail'
				},
				{
					text: '确认收货',
					condition: item.status == 2,
					incident: 'goReceive',
					auth: 'dgChain:recDel:recConfirm'
				},
				{
					text: '继续收货',
					condition: item.status == 3,
					incident: 'goReceive',
					auth: 'dgChain:recDel:recConfirm:continue'
				},
				{
					text: '作废',
					condition: (item.status == 3 || item.status == 4) && item.canCancel,
					incident: 'cancelItem',
					auth: 'dgChain:recDel:recRecord:cancel'
				},
				{
					text: '监控',
					condition: item.transType == 'SHIP' && item.status != 4,
					incident: 'monitor'
				}
			];
			return actionList;
		},
		handleChange(data) {
			this.searchParams = data;
			this.changeSearch(data);
			this.monitorData();
		},
		monitorData() {
			let mointorCodeAry = [];
			for (const dataKey in this.searchParams) {
				this.searchList.map(item => {
					if (dataKey.includes(item.decorator[0]) && !dataKey.includes('End')) {
						mointorCodeAry.push(item.code);
						window.reportUtil.reportEvent(item.code, {});
					}
				});
			}
		},
		tabChange(val) {
			this.url.list = val === 'wait' ? API_RECEIVERECORDLISTWait : API_RECEIVERECORDLISTReady;
			this.columns = val === 'wait' ? receiveRecordColumnsWait(this) : receiveRecordColumnsReady(this);
			this.status = val;
			this.pagination.pageNo = 1;
			this.getList();
		},
		viewDetail(record) {
			if (this.status == 'wait') {
				this.$router.push({
					path: '/center/receive/accept/detail',
					query: {
						deliverId: record.id,
						from: 'receive'
					}
				});
			} else {
				this.$router.push({
					path: '/center/receive/accept/detail',
					query: {
						receiveId: record.id,
						from: 'receive'
					}
				});
			}
		},
		goReceive(record) {
			this.$router.push({
				path: '/center/receive/accept/confirm',
				query: {
					deliverId: record.id,
					from: 'receive',
					first: record.status == 2 ? true : undefined,
					transType: record.transType
				}
			});
		},
		cancelItem(item) {
			if (this.status == 'wait') {
				this.$refs.cancelListModal.init(item);
			} else {
				this.$refs.cancelModalAccept.init(item);
			}
		},

		// 状态悬浮窗
		visibleChange(visible, items) {
			if (visible) {
				this.dataSource.map(item => {
					item.tipShowText = false;
				});
				API_deliverQuantityStatistics({
					orderId: items.orderId
				}).then(res => {
					this.tipShowTextMethods(items, res.result);
				});
			} else {
				items.tipShowText = false;
				this.visibleTipText = false;
				this.$forceUpdate();
			}
		},
		tipShowTextMethods(row, data) {
			if (row.status == 3) {
				this.tipShowText = `该销售合同累计已收货${data.receivedQuantity}(吨)`;
			} else if (row.status == 2) {
				this.tipShowText = `该销售合同待收货，累计已发货${data.deliverQuantity}(吨)`;
			}
			row.tipShowText = true;
			this.visibleTipText = true;
			this.$forceUpdate();
		},
		//点击监控弹出所有船舶信息列表
		monitor(item) {
			this.$refs.shipList.showModal(item.batchId);
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

.delivery-status {
	display: inline-block;
	padding: 4px 6px;
	border-radius: 4px;
	font-size: 12px;
	background: #c1d7ff;
	color: #4682f3;
	cursor: pointer;
}

.delivery-status.status-1 {
	background: #c9daff;
	color: #596fa0;
}

.delivery-status.status-2 {
	background: #ffdbc8;
	color: #ff7937;
}

.delivery-status.status-3 {
	background: #f8dde8;
	color: #db81a5;
}

.delivery-status.status-4 {
	background: #c5ecdd;
	color: #3eb384;
}

.delivery-status.status-5 {
	background: #e0e0e0;
	color: #a8a8a8;
}
.slMain /deep/ .ant-card-head .ant-card-head-title {
	border-bottom: 1px solid #e5e6eb;
	padding-bottom: 20px;
	margin-bottom: 10px;
}
/deep/.ant-table-placeholder {
	border: none !important;
}
</style>
