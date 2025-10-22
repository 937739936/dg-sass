<template>
	<div class="slMain">
		<a-card :bordered="false">
			<span
				slot="title"
				class="slTitle"
			>
				物流轨迹
			</span>
			<div>
				<!-- 查询区域 -->
				<SlFormNew
					:list="searchList"
					layout="inline"
					@change="handleChange"
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
						<div :class="`delivery-status status-${status}`">{{ item.statusDesc }}</div>
					</div>
				</a-table>
				<i-pagination
					:pagination="pagination"
					size="small"
					@change="getList"
				/>
			</div>
			<ShipList ref="shipList" />
		</a-card>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
import { filterCodeByValueName } from '@sub/utils/globalCode.js';
import { ListMixin } from '@/v2/components/mixin/ListMixin';
import { trajectoryColumns } from './columns/columns.js';
import { API_DELIVERYRECORDLIST, deliver, API_getRouteInfo } from '@/v2/center/trade/api/receive';
import tipConfig from '@/v2/center/logisticSupervise/views/receive/tableTooltip';
import ShipList from '@/v2/center/logisticSupervise/views/receive/components/ShipList';
import Tabs from './components/Tabs';

const searchList = [
	{
		decorator: ['serialNo'],
		addonBeforeTitle: '运输合同编号',
		type: 'input',
		placeholder: '请输入运输合同编号'
	},
	{
		decorator: ['batchNo'],
		addonBeforeTitle: '批次号',
		type: 'input',
		placeholder: '请输入发货批次号'
	},
	{
		decorator: ['deliverDate'],
		addonBeforeTitle: '发货日期',
		type: 'rangePicker',
		allowClear: true,
		valueFormat: 'YYYY-MM-DD',
		format: 'YYYY-MM-DD',
		realKey: ['deliverDateBegin', 'deliverDateEnd']
	},
	{
		decorator: ['companyName'],
		addonBeforeTitle: '企业名称',
		type: 'input',
		placeholder: '请输入承运人或托运人名称'
	}
];

const statusData = [
	{
		text: '全部',
		value: ''
	},
	{
		text: '火运',
		value: 'TRAIN'
	},
	{
		text: '船运',
		value: 'SHIP'
	}
];
export default {
	mixins: [ListMixin],
	data() {
		return {
			searchList,
			statusData,
			columns: trajectoryColumns(this),
			url: {
				list: API_DELIVERYRECORDLIST
			},
			defaultParams: {
				productCode: 'LOGIC_DELIVER' // 作为接口区分标识
			},
			tipShowText: '',
			visibleTipText: false
		};
	},
	components: {
		Tabs,
		ShipList
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
		//操作栏
		actionMinList(item) {
			let actionList = [
				{
					text: '运输轨迹',
					incident: 'handleView',
					auth: 'logicDeliverMonitor:deliverManager:logisticsTrack:track'
				}
			];
			return actionList;
		},
		handleChange(data) {
			this.searchParams = { ...data, transportMode: this.searchParams.transportMode };
			this.changeSearch(this.searchParams);
		},
		tabChange(val) {
			this.searchParams.transportMode = val;
			this.pagination.pageNo = 1;
			this.getList();
		},
		handleView(record) {
			// 判断是否有多条运输轨迹
			// 判断运输方式,如果是火运，直接打开，如果是船运，按照船舶打开
			switch (record.despatchType) {
				case 'TRAIN':
					this.jumpToTail(record.waybillId);
					break;
				case 'SHIP':
					this.$refs.shipList.showModal(record.id);
					break;
			}
		},
		jumpToTail(waybillId) {
			API_getRouteInfo({ id: waybillId }).then(res => {
				if (res.success) {
					let hasPath = false;
					if (res.data) {
						for (let i = 0; i < res.data.length; i++) {
							if (res.data[i].waybillPhaseTraceInfoVO.length) {
								hasPath = true;
								break;
							}
						}
					}
					if (!hasPath) {
						this.$message.error('该运单暂无轨迹');
					} else {
						window.open('/logistics/LogisticsDetailTrainNew?waybillId=' + waybillId);
					}
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
