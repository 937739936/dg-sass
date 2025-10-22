<template>
	<div class="slMain">
		<a-card :bordered="false">
			<span
				slot="title"
				class="slTitle"
			>
				发货管理
				<a-button
					type="primary"
					class="add-btn"
					@click="add"
					v-auth="'dgChain:recDel:delApply'"
				>
					发货申请
				</a-button>
			</span>
			<div>
				<!-- 查询区域 -->
				<SlFormNew
					:list="searchList"
					layout="inline"
					@change="handleChange"
					:isShowIcon="false"
					:isShowSearchBox="true"
					@resetFunc="resetFunc"
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
			</div>
			<!-- 表格 -->
			<div :class="'table-box ' + (pagination.total > 10 ? 'fixedBottom ' : ' ')">
				<a-table
					:columns="columns"
					class="new-table"
					rowKey="id"
					:scroll="{ x: true }"
					:dataSource="dataSource"
					:pagination="false"
					:loading="loading"
				>
					<template
						slot="contractNo"
						slot-scope="text"
					>
						<span v-if="text">{{ text }}</span>
						<span
							v-else
							style="color: #77889d"
						>
							-
						</span>
					</template>
					<template
						slot="buyerName"
						slot-scope="text"
					>
						<span v-if="text">{{ text }}</span>
						<span
							v-else
							style="color: #77889d"
						>
							-
						</span>
					</template>
					<template
						slot="consigneeName"
						slot-scope="text"
					>
						<span v-if="text">{{ text }}</span>
						<span
							v-else
							style="color: #77889d"
						>
							-
						</span>
					</template>
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
					<div
						slot="action"
						slot-scope="action, i"
					>
						<a-space size="large">
							<a
								v-if="[6, 12, 13].includes(i.status)"
								@click="handleEdit(i)"
								v-auth="'dgChain:recDel:delRecord:edit'"
								>编辑</a
							>
							<a
								v-if="i.status !== 12"
								class="mr0"
								@click.prevent="handleView(i)"
								v-auth="'dgChain:recDel:delRecord:detail'"
								>查看</a
							>
							<a
								v-if="i.canCancel"
								@click="cancelItem(i.id)"
								v-auth="'dgChain:recDel:delRecord:cancel'"
								>作废</a
							>
							<a
								v-if="i.canGoodsTrans"
								@click="issueHz(i)"
								v-auth="'dgChain:recDel:delRecord:transCreate'"
								>开具货转</a
							>
							<a
								v-if="(i.status == 4 || i.status == 2) && i.goodsTransferFlag == 2"
								@click="viewHz(i)"
								v-auth="'dgChain:recDel:delRecord:transDetail'"
								>查看货转</a
							>
						</a-space>
					</div>
				</a-table>
				<i-pagination
					:pagination="pagination"
					size="small"
					v-show="pageSize < pagination.total"
					@change="getList"
				/>
			</div>
			<CancelModal
				ref="cancelModal"
				@ok="getList"
			/>
			<SelectContractModal
				ref="selectContractModal"
				@ok="selectContract"
			/>
			<ConfirmReturn ref="confirmReturn" />
			<ProofModel
				ref="proofModel"
				type="hzzm"
				:show="false"
			/>
		</a-card>
	</div>
</template>

<script>
import { filterCodeByValueName } from '@sub/utils/globalCode.js';
import { ListMixin } from '@/v2/components/mixin/ListMixin';
import { releaseRecordColumns } from './columns/columns.js';
import { API_DELIVERYRECORDLIST, deliver } from '@/v2/center/trade/api/receive';
import { getPopupContainer } from '@/v2/utils/factory.js';
import SelectContractModal from '@/v2/center/trade/views/receive/components/SelectContractModal';
import tipConfig from '@/v2/center/trade/views/receive/tableTooltip';
import CancelModal from '@/v2/center/trade/views/receive/components/CancelModal';
import { mapGetters } from 'vuex';
import ConfirmReturn from '@/v2/center/trade/views/receive/components/ConfirmReturn';
import { API_getGoodsTransfeUrl } from '@/v2/center/trade/api/goodsTransfer';
import ProofModel from '@/v2/center/trade/components/receive/ProofModel';
import Tabs from './components/Tabs';

const searchList = [
	{
		decorator: ['serialNo'],
		addonBeforeTitle: '编号',
		type: 'input',
		placeholder: '请输入订单或合同编号',
		code: 998536
	},
	{
		decorator: ['batchNo'],
		addonBeforeTitle: '发货批次号',
		type: 'input',
		placeholder: '请输入',
		code: 121326
	},
	{
		decorator: ['buyerName'],
		addonBeforeTitle: '买方企业',
		type: 'input',
		placeholder: '请输入',
		code: 952873
	},
	{
		decorator: ['consigneeCompanyName'],
		addonBeforeTitle: '收货人',
		type: 'input',
		placeholder: '请输入',
		code: 655648
	},
	{
		decorator: ['deliverDate'],
		addonBeforeTitle: '发货日期',
		type: 'rangePicker',
		allowClear: true,
		valueFormat: 'YYYY-MM-DD',
		format: 'YYYY-MM-DD',
		realKey: ['deliverDateBegin', 'deliverDateEnd'],
		code: 224756
	},
	{
		decorator: ['goodsTransferFlag'],
		addonBeforeTitle: '货转开具状态',
		type: 'select',
		placeholder: '请选择货转开具状态',
		code: 568688,
		options: [
			{
				label: '全部',
				value: ''
			},
			{
				label: '未开具',
				value: 0
			},
			{
				label: '部分开具',
				value: 1
			},
			{
				label: '已开具',
				value: 2
			}
		]
	}
];

const statusData = [
	{
		text: '全部',
		value: ''
	},
	{
		text: '待关联',
		value: 12
	},
	{
		text: '装货中',
		value: 13
	},
	{
		text: '待收货',
		value: 2
	},
	{
		text: '已收货',
		value: 4
	},
	{
		text: '审批中',
		value: 10
	},
	{
		text: '已驳回',
		value: 6
	},
	{
		text: '已作废',
		value: 8
	}
];
export default {
	mixins: [ListMixin],
	data() {
		return {
			getPopupContainer,
			searchList,
			statusData,
			status: '',
			columns: releaseRecordColumns,
			url: {
				list: API_DELIVERYRECORDLIST
			},
			tipShowText: '',
			visibleTipText: false
		};
	},
	components: {
		SelectContractModal,
		CancelModal,
		ConfirmReturn,
		ProofModel,
		Tabs
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		currentCompanyUscc() {
			return this.VUEX_ST_COMPANYSUER.company.uscc;
		}
	},
	methods: {
		add() {
			this.$refs.selectContractModal.init();
		},
		handleChange(data) {
			this.searchParams = { ...data, status: this.searchParams.status };
			this.changeSearch(this.searchParams);
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
		resetFunc() {
			this.status = '';
		},
		tabChange(val) {
			this.searchParams.status = val;
			this.pagination.pageNo = 1;
			window.reportUtil.reportEvent('115588', {});
			this.getList();
		},
		// 作废
		cancelItem(id) {
			this.$refs.cancelModal.init(id);
		},
		// 查看
		handleView(i) {
			this.$router.push({
				path: '/center/receive/send/detail',
				query: {
					deliverId: i.id
				}
			});
		},
		// 发货申请
		selectContract(orderId) {
			this.$router.push({
				path: '/center/receive/send/apply',
				query: {
					orderId
				}
			});
		},
		// 状态悬浮窗
		visibleChange(visible, items) {
			if (visible) {
				this.dataSource.map(item => {
					item.tipShowText = false;
				});
				deliver({
					deliverBatchId: items.id
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
			let text = '';
			if (data.sellerUscc == this.currentCompanyUscc) {
				text = tipConfig[row.status].a;
			} else {
				text = tipConfig[row.status].b;
			}
			if (row.status == '6' && data?.rejectReason) {
				text += '，驳回原因：' + data?.rejectReason;
			}
			if (row.status == '8' && data?.cancelReason) {
				text += data.updateTime + '作废，作废原因：' + data?.cancelReason;
			}
			text = text.replace('【买方】', data.buyerAbbreviation || '').replace('【卖方】', data.sellerAbbreviation || '');
			this.tipShowText = text;
			row.tipShowText = true;
			this.visibleTipText = true;
			this.$forceUpdate();
		},
		issueHz({ orderNo, orderId }) {
			this.$router.push({
				path: '/center/transfer/goodsTransfer/apply',
				query: {
					serialNo: orderNo,
					orderType: 'ONLINE',
					serialId: orderId
				}
			});
		},
		handleEdit({ orderId, deliverId }) {
			this.$router.push({
				path: '/center/receive/send/apply',
				query: {
					orderId,
					deliverId
				}
			});
		},
		viewHz(item) {
			API_getGoodsTransfeUrl({ no: item.goodsTransferNoList[0] }).then(res => {
				if (res.success) {
					this.$refs.proofModel.init(res.data);
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

.add-btn {
	float: right;
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
</style>
