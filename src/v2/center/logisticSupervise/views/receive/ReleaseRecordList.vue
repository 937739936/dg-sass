<template>
	<div class="slMain">
		<a-card :bordered="false">
			<span slot="title" class="slTitle">
				发运记录
				<div class="right-box">
					<a-tooltip placement="bottomRight" trigger="hover" overlayClassName="add-logistic-in-out-tooltips"
						:getPopupContainer="getPopupContainer">
						<template slot="title">
							<div class="btn-box-menu">
								<div class="btn-box-menu-item" @click="add('TRANSFER_DELIVERY')" @mouseover="mouseOver($event)"
									@mouseleave="mouseLeave($event)">
									<div class="btn-box-menu-icon">
										<img class="icon-left" :src="require('@/v2/assets/imgs/warehouse/icon-transfer-despatch.png')"
											alt="" />
										<div style="margin-left: 20px">
											<p class="btn-box-menu-item-title">中转发运</p>
											<p class="btn-box-menu-item-tips">矿到码头进行发货操作</p>
										</div>
									</div>
									<img class="icon-right" src="@/v2/assets/imgs/contract/right_arrow_icon.png" alt="" />
								</div>
								<div class="btn-box-menu-item" @click="add('TERMINAL_DELIVERY')" @mouseover="mouseOver($event)"
									@mouseleave="mouseLeave($event)">
									<div class="btn-box-menu-icon">
										<img class="icon-left" :src="require('@/v2/assets/imgs/warehouse/icon-terminal-despatch.png')"
											alt="" />
										<div style="margin-left: 20px">
											<p class="btn-box-menu-item-title">终端发运</p>
											<p class="btn-box-menu-item-tips">码头到电厂进行发货操作</p>
										</div>
									</div>
									<img class="icon-right" src="@/v2/assets/imgs/contract/right_arrow_icon.png" alt="" />
								</div>
							</div>
						</template>
						<div>
							<a-button type="primary" class="add-btn" v-auth="'logicDeliverMonitor:deliverManager:deliverRecord:add'">
								新增发货
							</a-button>
						</div>
					</a-tooltip>
				</div>
			</span>
			<div>
				<!-- 查询区域 -->
				<SlFormNew :list="searchList" layout="inline" @change="handleChange" :isShowIcon="false" :isShowSearchBox="true"
					@resetFunc="resetFunc"></SlFormNew>
			</div>
			<!-- tabs -->
			<div class="tabs-box">
				<Tabs v-if="statusData" :statusData="statusData" @callback="tabChange" ref="Tabs" />
			</div>
			<!-- 表格 -->
			<div :class="'table-box ' + (pagination.total > 10 ? 'fixedBottom ' : ' ')">
				<a-table :columns="columns" class="new-table" rowKey="id" :scroll="{ x: true }" :dataSource="dataSource"
					:pagination="false" :loading="loading">
					<template slot="buyerName" slot-scope="text">
						<span v-if="text">{{ text }}</span>
						<span v-else style="color: #77889d">
							-
						</span>
					</template>
					<template slot="consigneeName" slot-scope="text">
						<span v-if="text">{{ text }}</span>
						<span v-else style="color: #77889d">
							-
						</span>
					</template>
					<div slot="status" slot-scope="status, item" id="tooltip-parent-id">
						<div :class="`delivery-status status-${status}`">{{ item.statusDesc }}</div>
					</div>
				</a-table>
				<i-pagination :pagination="pagination" size="small" @change="getList" />
			</div>
			<CancelListModal @ok="getList" ref="cancelListModal" />
			<SelectContractModal ref="selectContractModal" @ok="selectContract" />
		</a-card>
		<TipModal ref="tipModal" @ok="saveConfirm" title="确认删除">
			<div class="tip-box">
				<p>确定要删除该发货记录，删除后无法恢复</p>
			</div>
		</TipModal>
	</div>
</template>

<script>
import TipModal from '@sub/components/DelModal.vue';
import { filterCodeByValueName } from '@sub/utils/globalCode.js';
import { ListMixin } from '@/v2/components/mixin/ListMixin';
import { releaseRecordColumns } from './columns/columns.js';
import { API_DELIVERYRECORDLIST, deliver } from '@/v2/center/trade/api/receive';
import { getLogisticsDelete } from '@/v2/center/trade/api/coal';
import { getPopupContainer } from '@/v2/utils/factory.js';
import SelectContractModal from '@/v2/center/logisticSupervise/views/receive/components/SelectContractModal';
import tipConfig from '@/v2/center/logisticSupervise/views/receive/tableTooltip';
import CancelListModal from '@/v2/center/logisticSupervise/views/receive/components/CancelListModal';
import { mapGetters } from 'vuex';
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
		decorator: ['transportMode'],
		addonBeforeTitle: '运输方式',
		type: 'select',
		placeholder: '请选择运输方式',
		options: [
			{
				label: '火运',
				value: 'TRAIN'
			},
			{
				label: '汽运',
				value: 'AUTOMOBILE'
			},
			{
				label: '船运',
				value: 'SHIP'
			}
		]
	},
	{
		decorator: ['companyName'],
		addonBeforeTitle: '企业名称',
		type: 'input',
		placeholder: '请输入承运人或托运人名称'
	},
	{
		decorator: ['deliverDate'],
		addonBeforeTitle: '发货日期',
		type: 'rangePicker',
		allowClear: true,
		valueFormat: 'YYYY-MM-DD',
		format: 'YYYY-MM-DD',
		realKey: ['deliverDateBegin', 'deliverDateEnd']
	}
];

const statusData = [
	{
		text: '全部',
		value: ''
	},
	{
		text: '待收货',
		value: 2
	},
	{
		text: '部分收货',
		value: 3
	},
	{
		text: '已收货',
		value: 4
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
			columns: releaseRecordColumns(this),
			url: {
				list: API_DELIVERYRECORDLIST
			},
			defaultParams: {
				productCode: 'LOGIC_DELIVER' // 作为接口区分标识
			},
			deleteId: '',
			tipShowText: '',
			visibleTipText: false,
			deliveryDespatchType: null
		};
	},
	components: {
		SelectContractModal,
		CancelListModal,
		Tabs,
		TipModal
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
		mouseOver($event) {
			$event.currentTarget.className = 'btn-box-menu-item hover';
		},
		mouseLeave($event) {
			$event.currentTarget.className = 'btn-box-menu-item';
		},
		//操作栏
		actionMinList(item) {
			let actionList = [
				{
					text: '查看',
					incident: 'handleView',
					auth: 'logicDeliverMonitor:deliverManager:deliverRecord:detail'
				},
				{
					text: '确认收货',
					condition: item.status == 2,
					incident: 'goReceive',
					auth: 'logicDeliverMonitor:deliverManager:deliverRecord:confirmReceive'
				},
				{
					text: '继续收货',
					condition: item.status == 3,
					incident: 'goReceive',
					auth: 'logicDeliverMonitor:deliverManager:deliverRecord:resumeReceive'
				},
				{
					text: '删除',
					condition: item.status == 2 && item.canCancel,
					incident: 'getDelete',
					auth: 'logicDeliverMonitor:deliverManager:deliverRecord:delete'
				},
				{
					text: '作废',
					condition: (item.status == 3 || item.status == 4) && item.canCancel,
					incident: 'cancelItem',
					auth: 'logicDeliverMonitor:deliverManager:deliverRecord:cancel'
				}
			];
			return actionList;
		},
		add(type) {
			this.deliveryDespatchType = type;
			this.$refs.selectContractModal.init(type);
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
			this.getList();
		},
		// 查看
		handleView(i) {
			this.$router.push({
				path: '/center/logisticSupervise/receive/send/detail',
				query: {
					deliverId: i.id
				}
			});
		},
		cancelItem(item) {
			this.$refs.cancelListModal.init(item);
		},
		//删除
		getDelete(record) {
			this.deleteId = record.id;
			this.$refs.tipModal.open();
		},
		saveConfirm() {
			let id = this.deleteId;
			this.$refs.tipModal.close();
			getLogisticsDelete(id).then(res => {
				if (res.success) {
					this.$message.success('操作成功');
					this.getList(1);
				}
			});
		},
		goReceive(record) {
			this.$router.push({
				path: '/center/logisticSupervise/receive/send/confirm',
				query: {
					deliverId: record.id,
					from: 'receive',
					first: record.status == 2 ? true : undefined,
					transType: record.transType
				}
			});
		},
		// 发货申请
		selectContract(orderId) {
			this.$router.push({
				path: '/center/logisticSupervise/receive/send/apply',
				query: {
					orderId,
					deliveryDespatchType: this.deliveryDespatchType
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

.right-box {
	position: absolute;
	right: 30px;
	top: 20px;
	cursor: pointer;
	z-index: 10;
	display: flex;
	align-items: center;
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

.tip-box {
	font-size: 14px;
	color: rgba(0, 0, 0, 0.5);
	margin-top: 15px;
	line-height: 24px;
}

.btn-box-menu {
	.btn-box-menu-item {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		cursor: pointer;
		height: 64px;
		margin-bottom: 8px;
		padding: 0 3px 0 12px;
		border-radius: 4px;
		width: 254px;

		.icon-left {
			width: 40px;
			height: 40px;
		}

		.icon-right {
			width: 14px;
			height: 14px;
			vertical-align: middle;
		}

		.btn-box-menu-item-title {
			font-size: 16px;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: rgba(0, 0, 0, 0.8);
			line-height: 22px;
		}

		.btn-box-menu-item-tips {
			font-size: 14px;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #77889d;
			line-height: 20px;
		}
	}

	.btn-box-menu-item:first-child {
		position: relative;

		&> ::after {
			content: '';
			width: 250px;
			height: 1px;
			background: #e5e6eb;
			position: absolute;
			right: -8px;
			bottom: -8px;
		}
	}

	.btn-box-menu-item:last-child {
		margin-top: 16px;
		margin-bottom: 0;
	}

	.btn-box-menu-item.hover {
		background: #e4ebf4;
	}

	.btn-box-menu-icon {
		display: flex;
		align-items: center;
	}
}
</style>
<style lang="less">
.add-logistic-in-out-tooltips {
	z-index: 100;

	.ant-tooltip-arrow {
		display: none;
	}

	.ant-tooltip-inner {
		width: 270px;
		height: 161px;
		border-radius: 4px;
		background-color: #fff;
		box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.13);
		padding: 8px;
		position: relative;
		right: 22px;
		z-index: 1000;
	}
}
</style>