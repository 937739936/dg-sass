<template>
	<div class="slMain">
		<a-card :bordered="false">
			<div class="methods-wrap">
				<span
					slot="title"
					class="slTitle"
					>退款管理</span
				>
				<a-button
					type="primary"
					v-auth="'dgChain:recPay:refund:add'"
					@click="refundAdd"
					class="add-btn"
				>
					<span>新增退款</span>
				</a-button>
			</div>
			<!-- 查询区域 -->
			<SlFormNew
				:list="searchList"
				layout="inline"
				@change="handleChange"
				@resetFunc="resetFunc"
			></SlFormNew>
			<div class="tabs-box">
				<Tabs
					v-if="statusData && tabNumFlag"
					:statusData="statusData"
					:tabNum="tabNum"
					@callback="tabChange"
					ref="Tabs"
				/>
				<div
					class="export-box"
					@click="exportFunc"
				>
					<ExportIcon class="export-icon"></ExportIcon>
					<span class="export-text">数据导出</span>
				</div>
			</div>
			<!-- 表格 -->
			<div :class="'table-box ' + (pagination.total > 10 ? 'fixedBottom' : '')">
				<a-table
					:columns="columns"
					class="new-table"
					:bordered="false"
					rowKey="id"
					:dataSource="dataSource"
					:pagination="false"
					:loading="loading"
					:scroll="{ x: true }"
				>
					<template
						slot="refundAmount"
						slot-scope="text"
					>
						<span v-if="text">{{ text | formatMoney(2) }}</span>
						<span v-else>{{ text }}</span>
					</template>
					<template
						slot="status"
						slot-scope="text, items"
					>
						<div v-if="['RISK_REJECT', 'OPERATION_REJECT'].includes(items.status)">
							<a-tooltip
								placement="top"
								trigger="hover"
								overlayClassName="bondLetter-status-tooltips"
								:destroyTooltipOnHide="true"
								@visibleChange="e => visibleChange(e, items)"
								:getPopupContainer="getPopupContainer"
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
									<p class="fz12">{{ tipShowText }}</p>
								</template>
								<p
									:class="'refund-status ' + items.status"
									style="cursor: pointer"
								>
									<span class="text">{{ items.statusDesc }}</span>
								</p>
							</a-tooltip>
						</div>
						<div v-else>
							<p :class="'refund-status ' + items.status">
								<span class="text">{{ items.statusDesc }}</span>
							</p>
						</div>
					</template>
					<div
						slot="action"
						slot-scope="action, items"
					>
						<!-- 平台运营驳回/平台风控驳回 -->
						<a
							href="javascript:void(0)"
							v-auth="'dgChain:recPay:refund:edit'"
							@click="goEdit(items, 'edit')"
							v-if="['OPERATION_REJECT', 'RISK_REJECT'].includes(items.status)"
						>
							修改
						</a>
						<a
							href="javascript:void(0)"
							v-auth="'dgChain:recPay:refund:view'"
							@click="goDetail(items.id)"
						>
							详情
						</a>
						<!-- 平台运营驳回/平台风控驳回/OA审核驳回 -->
						<a
							href="javascript:void(0)"
							v-auth="'dgChain:recPay:refund:cancel'"
							@click="cancel(items)"
							v-if="['OPERATION_REJECT', 'RISK_REJECT', 'OA_REJECT'].includes(items.status)"
						>
							作废
						</a>
					</div>
				</a-table>
			</div>
			<i-pagination
				:pagination="pagination"
				size="small"
				v-show="pageSize < pagination.total"
				@change="getList"
			/>
			<CancelModal
				ref="cancelModal"
				title="作废"
				tips="驳回后，如再需终止合同则需要重新走流程，如确需驳回，请继续操作！"
				v-on:clickOk="clickCancelOk"
			/>
			<ChooseContract
				ref="chooseContract"
				:orderLineType="orderLineType"
				@detail="getContractDetail"
			/>
		</a-card>
	</div>
</template>

<script>
import { API_REFUNDDISCARD, API_REFUNDLIST, API_RefundExport, API_RefundCountEachTabStateNum } from '@/v2/center/trade/api/pay';
import { ListMixin } from '@/v2/components/mixin/ListMixin';
import { mapGetters } from 'vuex';
import { filterCodeByKey } from '@sub/utils/globalCode.js';
import { GetCurrentDate, getPopupContainer } from '@/v2/utils/factory.js';
import { isEqual } from 'lodash';
import CancelModal from '@/v2/center/trade/views/contract/components/CancelModal.vue';
import Tabs from './components/Tabs';
import ChooseContract from './components/ChooseContract';
import comDownload from '@sub/utils/comDownload.js';
import { ExportIcon } from '@sub/components/svg'
const contractTypeList = [
	{
		name: '采购合同',
		value: 'BUY'
	},
	{
		name: '销售合同',
		value: 'SELL'
	}
];
const searchList = [
	{
		decorator: ['searchNo'],
		addonBeforeTitle: '编号',
		type: 'input',
		placeholder: '请输入订单、合同、资金流水号'
	},
	{
		decorator: ['companyName'],
		addonBeforeTitle: '企业名称',
		type: 'input',
		placeholder: '请输入企业名称'
	},
	{
		decorator: ['contractType'],
		addonBeforeTitle: '合同类型',
		type: 'select',
		allowClear: true,
		placeholder: '请选择合同类型',
		options: contractTypeList.map(item => {
			return { value: item.value, label: item.name };
		})
	},
	{
		decorator: ['issuedDate'],
		addonBeforeTitle: '退款日期',
		type: 'rangePicker',
		allowClear: true,
		realKey: ['startRefundTime', 'endRefundTime']
	},
	{
		decorator: ['businessType'],
		addonBeforeTitle: '业务类型',
		type: 'select',
		allowClear: true,
		placeholder: '请选择业务类型',
		options: filterCodeByKey('orderBusinessTypeDescMap')
			.map(item => {
				return { value: item.value, label: item.text };
			})
			.filter(item => item.value != 'DISCOUNT_WAREHOUSE_PLEDGE')
	}
];
const columns = [
	{ title: '合同类型', dataIndex: 'contractType' },
	{ title: '合同编号', dataIndex: 'contractNo' },
	{ title: '退款方', dataIndex: 'payerName' },
	{ title: '收款方', dataIndex: 'receiverName' },
	{ title: '退款金额(元)', dataIndex: 'refundAmount', scopedSlots: { customRender: 'refundAmount' } },
	{ title: '退款日期', dataIndex: 'refundDate' },
	{ title: '退款状态', dataIndex: 'statusDesc', scopedSlots: { customRender: 'status' } },
	{ title: '操作', key: 'action', fixed: 'right', scopedSlots: { customRender: 'action' } }
];
export default {
	mixins: [ListMixin],
	data() {
		return {
			url: {
				list: API_REFUNDLIST
			},
			getPopupContainer,
			contractTypeList,
			columns,
			searchList,
			dataSource: [],
			operationId: '', //操作数据的id
			tipShowText: '',
			statusData: filterCodeByKey('refundFrontStatus'),
			tabNum: {}, // 不同状态的数据统计
			tabNumFlag: false,
			orderLineType: 'ONLINE'
		};
	},
	components: {
		CancelModal,
		Tabs,
		ChooseContract,
		ExportIcon
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		})
	},
	created() {
		this.getNum(); // 获取数据统计数
	},
	methods: {
		resetFunc() {
			this.defaultParams.summaryStatus = 'ALL';
			this.$refs.Tabs.status = 'ALL';
		},
		tabChange(val) {
			this.defaultParams.summaryStatus = val;
			this.pagination.pageNo = 1;
			this.getNum();
			this.getList();
		},
		// 获取数据统计数
		getNum() {
			const params = {
				...this.defaultParams,
				...this.searchParams
			};
			API_RefundCountEachTabStateNum(params).then(res => {
				if (res.success) {
					let dataArr = res.data || [];
					if (dataArr.length) {
						dataArr.forEach((item, index) => {
							this.$set(this.tabNum, item.tabType, item.stateNum);
							if (index === dataArr.length - 1) {
								this.tabNumFlag = true;
							}
						});
					}
				}
			});
		},
		handleChange(data) {
			if (isEqual(data, this.searchParams)) {
				return;
			}
			this.searchParams = data;
			this.changeSearch(data);
		},
		visibleChange(visible, items) {
			let text = '';
			if (items.comments) {
				text = '驳回原因：' + items?.comments;
			}
			this.tipShowText = text;
		},
		// 去往详情和编辑
		goDetail(id, type) {
			this.$router.push({
				path: '/center/fund/refund/detail',
				query: { id, type }
			});
		},
		// 去往详情和编辑
		goEdit(items, view) {
			let { id, orderId, orderLineType } = items;
			this.$router.push({
				path: '/center/fund/refund/add',
				query: { id, view, orderId, orderLineType }
			});
		},
		//新增退款
		refundAdd() {
			this.$refs.chooseContract.showModal();
		},
		getContractDetail(data) {
			this.$router.push({
				path: '/center/fund/refund/add',
				query: {
					orderId: data.orderId,
					orderLineType: data.orderLineType,
					orderType: data.contractType,
					paidAmount: data.paidAmount
				}
			});
		},
		//关闭作废原因
		cancel(items) {
			this.operationId = items.id;
			this.$refs.cancelModal.show();
		},
		async clickCancelOk(reason) {
			let data = { comments: reason, id: this.operationId };
			let res = await API_REFUNDDISCARD(data);
			if (res.success) {
				this.$message.success('作废成功');
				this.getList();
			}
		},
		exportFunc() {
			let currentDate = GetCurrentDate(); // 获取当前日期
			API_RefundExport({
				...this.defaultParams,
				...this.searchParams
			})
				.then(res => {
					comDownload(res, undefined, '退款数据-' + this.VUEX_ST_COMPANYSUER.companyName + '-' + currentDate + '.xls');
				})
				.finally(() => {});
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
	.add-btn {
		padding: 0 30px;
		height: 38px;
		line-height: 38px;
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
	.refund-status {
		border-radius: 4px;
		height: 20px;
		line-height: 20px;
		padding: 0 5px;
		font-family:
			PingFangSC-Regular,
			PingFang SC;
		text-align: center;
		width: auto;
		display: inline-block;
		margin-bottom: 0;
		.text {
			font-size: 12px;
			position: relative;
			top: -1px;
		}
	}
	.WAITING_OPERATION,
	.WAITING_RISK,
	.WAITING_OA {
		background-color: #ffdac8;
		color: #ff7937;
	}
	.OPERATION_REJECT,
	.RISK_REJECT,
	.OA_REJECT {
		background: #f2d0d0;
		color: #dd4444;
	}
	.COMPLETE {
		background: #c5ecdd;
		color: #3eb384;
	}
	.DISCARD {
		background: #e0e0e0;
		color: rgba(0, 0, 0, 0.25);
	}
	.fz12 {
		font-size: 14px;
		zoom: 0.86;
		line-height: 24px;
	}
	.tooltipColor {
		color: rgba(255, 255, 255, 0.5);
	}
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
.action {
	& > a {
		display: inline-block;
	}
}
</style>
