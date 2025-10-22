<template>
	<div>
		<!-- 查询区域 -->
		<SlFormNew
			:list="searchList"
			layout="inline"
			@change="handleChange"
			@resetFunc="resetFunc"
		></SlFormNew>
		<!-- tabs -->
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
					slot="status"
					slot-scope="text, items"
				>
					<div v-if="['RECEIVER_REJECT', 'RECEIVER_CANCEL', 'INITIATOR_CANCEL', 'WAIT_ISSUE'].includes(items.status)">
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
								<p
									class="fz12 tooltipColor"
									v-if="tipShowText && items.status === 'RECEIVER_REJECT'"
								>
									驳回原因：
								</p>
								<p
									class="fz12 tooltipColor"
									v-if="tipShowText && ['RECEIVER_CANCEL', 'INITIATOR_CANCEL'].includes(items.status)"
								>
									作废原因：
								</p>
								<p class="fz12">{{ tipShowText }}</p>
							</template>
							<p
								:class="'contract-status ' + items.status"
								style="cursor: pointer"
							>
								<span class="text">{{ items.statusDesc }}</span>
							</p>
						</a-tooltip>
					</div>
					<div v-else>
						<p :class="'contract-status ' + items.status">
							<span class="text">{{ items.statusDesc }}</span>
						</p>
					</div>
				</template>
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
			v-on:clickOk="clickCancelOk"
		/>
	</div>
</template>

<script>
import { filterCodeByKey } from '@sub/utils/globalCode.js';
import { ListMixin } from '@/v2/components/mixin/ListMixin';
import {
	API_GetBondLetterPage,
	API_GetCountEachTabStateNum,
	API_ExportExcel,
	API_GetStatusTip,
	API_BondLetterCancel,
	API_DownLoadFile
} from '@/v2/center/trade/api/bondLetter';
import { mapGetters } from 'vuex';
import { GetCurrentDate, getPopupContainer } from '@/v2/utils/factory.js';
import comDownload from '@sub/utils/comDownload.js';
import { getOnlineAction } from '../action';
import Tabs from '../components/Tabs';
import { isEqual } from 'lodash';
import CancelModal from '@/v2/center/trade/views/contract/components/CancelModal.vue';
import { ExportIcon, Arrow } from '@sub/components/svg'
const searchList = [
	{
		decorator: ['serialNo'],
		addonBeforeTitle: '编号',
		type: 'input',
		placeholder: '订单、合同、追保函编号'
	},
	{
		decorator: ['companyName'],
		addonBeforeTitle: '企业名称',
		type: 'input',
		placeholder: '请输入企业名称'
	},
	{
		decorator: ['signTime'],
		addonBeforeTitle: '签发日期',
		placeholder: '请选择签发日期',
		type: 'rangePicker',
		realKey: ['signTimeStart', 'signTimeEnd']
	}
];
const onlineContractColumns = [
	{ title: '合同编号', dataIndex: 'contractNo' },
	{ title: '卖方企业', dataIndex: 'sellerName' },
	{ title: '买方企业', dataIndex: 'buyerName' },
	{ title: '追保金额（元）', dataIndex: 'recoveryAmountThousandth' },
	{ title: '追保截止日期', dataIndex: 'recoveryDeadline' },
	{ title: '签发日期', dataIndex: 'signTime' },
	{ title: '追保函编号', dataIndex: 'serialNo' },
	{ title: '创建时间', dataIndex: 'createDate' },
	{ title: '追保函状态', dataIndex: 'status', fixed: 'right', scopedSlots: { customRender: 'status' } }
];

export default {
	mixins: [ListMixin],
	data() {
		return {
			onlineContractColumns,
			getPopupContainer,
			url: {
				list: API_GetBondLetterPage
			},
			defaultParams: {
				type: 'ONLINE'
			},
			columns: [],
			searchList,
			dataSource: [],
			statusData: filterCodeByKey('bondLetterTabTypeEnum').filter(
				item =>
					!['TAB_WAIT_RECEIVER_CONFIRM', 'TAB_WAIT_INITIATOR_SEAL', 'TAB_WAIT_RECEIVER_SEAL', 'TAB_INITIATOR_CANCEL'].includes(
						item.value
					)
			),
			status: 'TAB_ALL',
			tipShowText: '', // 合同状态文案
			cancelId: null, // 作废合同id
			tabNum: {}, // 不同状态的数据统计
			tabNumFlag: false,
			clientWidth: null, //浏览器尺寸
			detailData: {}
		};
	},
	created() {
		this.showAction();
		this.getNum(); // 获取数据统计数
	},
	components: {
		Tabs,
		CancelModal,
		ExportIcon,
		Arrow
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER',
			VUEX_ST_USERAUTH: 'VUEX_ST_USERAUTH'
		}),
		currentCompanyUscc() {
			return this.VUEX_ST_COMPANYSUER.company.uscc;
		}
	},
	methods: {
		// 操作列的宽度
		showAction() {
			let arr = [
				{
					title: '操作',
					key: 'action',
					align: 'left',
					fixed: 'right',
					customRender: (text, items) => {
						return this.actionDiv(items);
					}
				}
			];
			this.columns = this.onlineContractColumns.concat(arr);
		},
		handleChange(data) {
			if (isEqual(data, this.searchParams)) {
				return;
			}
			this.searchParams = data;
			this.getNum();
			this.changeSearch(data);
		},
		// 获取数据统计数
		getNum() {
			const params = {
				...this.defaultParams,
				...this.searchParams
			};
			API_GetCountEachTabStateNum(params).then(res => {
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
		tabChange(val) {
			this.defaultParams.tabType = val;
			this.pagination.pageNo = 1;
			this.getNum();
			this.getList();
		},
		// 操作列
		actionDiv(items) {
			let t = this;
			let actionList = getOnlineAction(items, this.VUEX_ST_COMPANYSUER, this.VUEX_ST_USERAUTH);
			let action = actionList.filter(item => {
				return item.condition;
			});
			let actionVnode = [],
				dropdownList = [];
			let h = t.$createElement;
			action.map((item, index) => {
				let aVnode = h('a', {
					style: {
						marginRight: '10px'
					},
					domProps: {
						innerHTML: item.text
					},
					on: {
						click: function () {
							t.clickFn(item.incident, items);
						}
					}
				});
				if (action.length > 3 && index > 1) {
					dropdownList.push(h('a', null, [aVnode]));
				} else {
					actionVnode.push(aVnode);
				}
			});
			if (dropdownList.length) {
				actionVnode.push(
					h(
						'a-tooltip',
						{
							attrs: {
								placement: 'left',
								overlayClassName: 'more-btn-tooltips',
								trigger: 'hover',
								getPopupContainer: getPopupContainer
							}
						},
						[
							h('a', [h('span', {}, '更多'), h('Arrow', { attrs: { class: 'right-arrow' } })]),
							h('template', { slot: 'title' }, dropdownList)
						]
					)
				);
			}
			return h('div', actionVnode);
		},
		// 操作函数
		clickFn(func, items) {
			this.detailData = items;
			let that = this;
			that[func]();
		},
		// 回调查询
		searchSubmit() {
			this.searchParams.pageNo = this.pagination.pageNo;
			this.changeSearch(this.searchParams);
		},

		exportFunc() {
			let currentDate = GetCurrentDate(); // 获取当前日期
			API_ExportExcel({
				...this.defaultParams,
				...this.searchParams
			})
				.then(res => {
					comDownload(res, undefined, '追保函-' + currentDate + '.xls');
				})
				.finally(() => {});
		},
		visibleChange(visible, items) {
			// 合同状态文案
			if (visible) {
				API_GetStatusTip({
					bondLetterId: items.id
				}).then(res => {
					this.tipShowTextMethods(items, res.data);
				});
			} else {
				this.tipShowText = '';
			}
		},
		tipShowTextMethods(row, data) {
			// 合同状态文案展示
			let text = '';
			if (row.status == 'RECEIVER_REJECT' && data?.rejectReason) {
				text = data?.rejectReason;
			}
			if ((row.status == 'RECEIVER_CANCEL' || row.status == 'INITIATOR_CANCEL') && data?.cancelReason) {
				text = data?.cancelReason;
			}
			if (row.status == 'WAIT_ISSUE') {
				text = '煤炭价格下跌，风控后台生成追保函，请确认并开具';
			}
			this.tipShowText = text;
		},
		resetFunc() {
			this.defaultParams.tabType = 'TAB_ALL';
			this.$refs.Tabs.status = 'TAB_ALL';
		},
		viewDetail() {
			this.$router.push({
				path: '/center/bondLetter/online/detail',
				query: {
					bondLetterId: this.detailData.id
				}
			});
		},
		toSign() {
			this.$router.push({
				path: '/center/bondLetter/online/stamp',
				query: {
					url: this.detailData.pdfPath,
					serialNo: this.detailData.serialNo,
					bondLetterId: this.detailData.id
				}
			});
		},
		confirm() {
			this.$router.push({
				path: '/center/bondLetter/online/confirm',
				query: {
					bondLetterId: this.detailData.id
				}
			});
		},
		// 作废
		cancel() {
			this.$refs.cancelModal.show();
		},
		clickCancelOk(cancelReason) {
			API_BondLetterCancel({
				bondLetterId: this.detailData.id,
				reason: cancelReason
			}).then(res => {
				if (res.success) {
					this.$message.success('作废成功');
					this.searchSubmit();
				}
			});
		},
		download() {
			API_DownLoadFile({ bondLetterId: this.detailData.id }).then(res => {
				comDownload(res, undefined, this.detailData.serialNo + '.pdf');
			});
		},
		edit() {
			this.$router.push({
				path: '/center/bondLetter/online/add',
				query: {
					type: 'ONLINE',
					view: 'edit',
					orderContractId: this.detailData.orderContractId,
					contractType: this.detailData.contractType,
					bondLetterId: this.detailData.id
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
	.sl-form {
		margin-bottom: 36px;
	}
}
.new-table {
	::v-deep .ant-table-tbody > tr > td {
		font-size: 14px;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: rgba(0, 0, 0, 0.8);
		line-height: 14px;
		padding: 10px 20px;
		position: relative;
	}
	::v-deep .ant-table-thead > tr > th {
		padding: 10px 20px;
	}
	::v-deep .ant-table-tbody > tr > td:last-child {
		padding-right: 10px;
	}
	.contract-status {
		border-radius: 4px;
		height: 20px;
		line-height: 20px;
		padding: 0 5px;
		font-family: PingFangSC-Regular, PingFang SC;
		text-align: center;
		width: auto;
		display: inline-block;
		.text {
			font-size: 14px;
			zoom: 0.85;
			position: relative;
			top: -1px;
		}
	}
	.WAIT_RECEIVER_SEAL,
	.WAIT_INITIATOR_SEAL,
	.WAIT_RECEIVER_CONFIRM {
		background-color: #c9daff;
		color: #596fa0;
	}
	.RECEIVER_REJECT {
		background: #f2d0d0;
		color: #dd4444;
	}
	.RECEIVER_CANCEL,
	.INITIATOR_CANCEL {
		color: #a8a8a8;
		background: #e0e0e0;
	}
	.COMPLETED {
		background: #c5ecdd;
		color: #3eb384;
	}
	.WAIT_ISSUE {
		background: #d3dffb;
		color: #4682f3;
	}
	.right-arrow {
		display: inline-block;
		width: 10px;
		height: 10px;
		background: url('~@/v2/assets/imgs/contract/right_more_icon.png') no-repeat 100% / cover;
		margin-left: 2px;
	}
	::v-deep.ant-table-fixed-right {
		overflow: inherit;
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
			font-family: PingFangSC-Regular, PingFang SC;
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
		left: 228px;
	}
}
.fz12 {
	font-size: 14px;
	zoom: 0.86;
	line-height: 24px;
}
.tooltipColor {
	color: rgba(255, 255, 255, 0.5);
}
</style>
<style lang="less">
.more-btn-tooltips {
	z-index: 100;
	.ant-tooltip-inner {
		padding: 10px 0;
		background-color: #fff;
		& > a {
			font-family: PingFangSC-Regular, PingFang SC;
			color: @primary-color;
			line-height: 32px;
			display: block;
			height: 32px;
			padding: 0 15px;
			text-align: center;
		}
		a {
			margin-bottom: 0 !important;
		}
		& > a:active {
			background-color: #e4ebf4;
		}
		& > a:hover {
			background-color: #e4ebf4;
		}
	}
	.ant-tooltip-arrow::before {
		background-color: #fff;
	}
}
.bondLetter-status-tooltips {
	.ant-tooltip-inner {
		width: 240px;
		background: #1f2329;
	}
}
.bondLetter-status-tooltips-small {
	.ant-tooltip-inner {
		width: 120px;
		background: #1f2329;
	}
}
</style>
