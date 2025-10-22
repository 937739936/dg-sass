<template>
	<div>
		<!-- 查询区域 -->
		<SlFormNew
			:list="searchList"
			layout="inline"
			@change="handleChange"
			:allowClear="false"
			:isShowIcon="false"
			:isShowSearchBox="true"
			@resetFunc="resetFunc"
		></SlFormNew>
		<!-- 表格tabs -->
		<div class="tabs-box">
			<!-- <Tabs v-if="statusData" :statusData="statusData"  @callback="tabChange" ref="Tabs"/> -->
			<Tabs
				:statusData="statusData"
				:tabNum="0"
				@callback="tabChange"
				ref="Tabs"
			/>
			<div
				class="export-box"
				@click="exportFile"
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
			>
				<!-- 合同信息 -->
				<template
					slot="contractInfo"
					slot-scope="contractInfo, items, index"
				>
					<div
						class="LONG_TERM_CONTRACT"
						v-if="items.contractTermType == 'LONG_TERM_CONTRACT'"
					>
						<div class="mark">
							<div class="text">长协</div>
						</div>
					</div>
					<div class="column-flex special">
						<a-space
							:size="12"
							class="column-flex-wrap"
						>
							<div
								class="paper-contract-desc-wrap"
								@mouseenter="onMouseOverContractNo(index)"
								@mouseleave="onMouseOutContractNo(index)"
							>
								<a-tooltip>
									<template slot="title">
										{{ items.paperContractNo }}
									</template>
									<span
										class="paper-contract-no-wrap"
										:style="{ maxWidth: `${wrapWidth}px` }"
										>{{ items.paperContractNo }}</span
									>
								</a-tooltip>
								<span
									v-show="!items.copyContractNoVisible"
									class="copy-icon"
									>
									<Copy></Copy>
								</span>
								<span
									v-show="items.copyContractNoVisible"
									v-clipboard:success="onCopy" 
									v-clipboard:error="onError"  
									v-clipboard:copy="items.paperContractNo"
									class="copy-icon"
									>
									<CopyNow></CopyNow>
								</span>
							</div>
							<template v-if="['PENDING_AUDITING_REJECT', 'DOUBLE_SIGN_AUDITING_REJECT'].includes(items.status)">
								<a-tooltip
									placement="topLeft"
									trigger="hover"
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
										<span v-else>{{ tipShowText }}</span>
									</template>
									<p :class="'contract-status ' + items.status">
										<span class="text">{{ items.statusDesc }}</span>
									</p>
								</a-tooltip>
							</template>
							<template v-else>
								<p :class="'contract-status ' + items.status">
									<span class="text">{{ items.statusDesc }}</span>
								</p>
							</template>
						</a-space>
						<a-row
							type="flex"
							justify="start"
							:gutter="15"
						>
							<a-col :span="14">
								<p v-if="type === 'SELL'">
									<span class="label">买方：</span>
									<TextOverFlow
										:content="items.buyerName || '-'"
										:maxWidth="maxWidth"
									/>
								</p>
								<p v-if="type === 'BUY'">
									<span class="label">卖方：</span>
									<TextOverFlow
										:content="items.sellerName || '-'"
										:maxWidth="maxWidth"
									/>
								</p>
								<p>
									<span class="label">运输方式</span>
									<TextOverFlow
										v-if="items.transTypeDesc && items.transType"
										:content="items.transTypeDesc || '-'"
										:maxWidth="maxWidth"
									/>

									<span v-else>-</span>
								</p>
								<p>
									<span class="label">业务类型：</span>
									<TextOverFlow
										:content="items.businessTypeDesc || '-'"
										:maxWidth="maxWidth"
									/>
								</p>
								<p>
									<span class="label">交货期限：</span>
									<TextOverFlow
										v-if="items.execDateStart"
										:content="(items.execDateStart || '-') + '至' + (items.execDateEnd || '-')"
										:maxWidth="maxWidth"
									/>
									<span v-else>-</span>
								</p>
							</a-col>
							<a-col :span="10">
								<p>
									<span class="label">品名</span>
									<TextOverFlow
										:content="items.goodsName || '-'"
										:maxWidth="maxWidthRight"
									/>
								</p>
								<p>
									<span class="label">合同单价</span>

									<TextOverFlow
										v-if="items.contractPrice == '随行就市'"
										:content="items.contractPrice"
										:maxWidth="maxWidthRight"
									/>
									<TextOverFlow
										v-else-if="items.contractPrice != 0"
										:content="formatMoney(items.contractPrice, 2) + '元/吨'"
										:maxWidth="maxWidthRight"
									/>
									<span v-else>-</span>
								</p>
								<p>
									<span class="label">合同数量</span>
									<TextOverFlow
										:content="items.contractQuantity || '-'"
										:maxWidth="maxWidthRight"
									/>
								</p>
								<p v-if="type === 'BUY' && items.inCoalPlanSerialNoList">
									<span class="label">上煤计划：</span>
									<TextOverFlow
										:content="items.inCoalPlanSerialNoList.join('、')"
										:maxWidth="maxWidthRight"
									/>
								</p>
								<p v-if="type === 'SELL' && items.outCoalPlanSerialNoList">
									<span class="label">下煤计划：</span>
									<TextOverFlow
										:content="items.outCoalPlanSerialNoList.join('、')"
										:maxWidth="maxWidthRight"
									/>
								</p>
							</a-col>
						</a-row>
					</div>
				</template>

				<!-- 已付款 -->
				<template
					slot="paid"
					slot-scope="text, items"
				>
					<div class="column-flex">
						<p
							class="label"
							style="margin-bottom: 5px"
						>
							已付款金额(元):
						</p>
						<p>{{ items.paidAmount | formatMoney(2) }}</p>
					</div>
				</template>
				<!-- 回款信息 -->
				<template
					slot="receivedAmount"
					slot-scope="text, items"
				>
					<div class="column-flex">
						<p
							class="label"
							style="margin-bottom: 5px"
						>
							已回款(元):
						</p>
						<p>{{ items.receivedAmount | formatMoney(2) }}</p>
					</div>
				</template>

				<!-- 已结算 -->
				<template
					slot="settled"
					slot-scope="text, items"
				>
					<div class="column-flex">
						<p
							class="label"
							style="margin-bottom: 5px"
						>
							已结算金额(元):
						</p>
						<p style="margin-bottom: 20px">{{ items.statementedAmount | formatMoney(2) }}</p>
						<p
							class="label"
							style="margin-bottom: 5px"
						>
							已结算数量(吨):
						</p>
						<p>{{ items.statementedQuantity | formatMoney(2) }}</p>
					</div>
				</template>
				<!-- 已开票 -->
				<template
					slot="invoiced"
					slot-scope="text, items"
				>
					<div class="column-flex">
						<p
							class="label"
							style="margin-bottom: 5px"
						>
							发票张数(张):
						</p>
						<p style="margin-bottom: 20px">{{ items.orderInvoiceTabNum || '-' }}</p>
						<p
							class="label"
							style="margin-bottom: 5px"
						>
							拆分到本合同金额(元):
						</p>
						<p>{{ items.splitContractAmount | formatMoney(2) }}</p>
					</div>
				</template>
			</a-table>
			<i-pagination
				:pagination="pagination"
				v-show="pageSize < pagination.total"
				size="small"
				@change="getList"
			/>
			<ContractFun
				ref="contractFun"
				:type="type"
				@searchSubmit="searchSubmit"
			></ContractFun>
		</div>
	</div>
</template>

<script>
import { filterCodeByKey } from '@sub/utils/globalCode.js';
import { ListMixin } from '@/v2/components/mixin/ListMixin';
import { GetCurrentDate, getPopupContainer } from '@/v2/utils/factory.js';
import { getDownContractAction } from '@/v2/center/trade/views/contract/action';
import {
	API_OFFLINESELLERORDERDELETE,
	API_offlineContractExportExcel,
	offlineContractStatusTip
} from '@/v2/center/trade/api/contract';

import { getDownContractList } from '@/v2/center/trade/api/downcontract';
import { mapGetters, mapMutations } from 'vuex';
import comDownload from '@sub/utils/comDownload.js';
import Tabs from '@/v2/center/trade/views/contract/components/Tabs';
import ContractFun from '@/v2/center/trade/views/contract/components/downContract/ContractFun.vue';
import { formatMoney } from '@sub/filters';
const searchList = [
	{
		decorator: ['paperContractNo'],
		addonBeforeTitle: '合同编号',
		type: 'input',
		placeholder: '请输入合同编号'
	},
	{
		decorator: ['companyName'],
		addonBeforeTitle: '企业名称',
		type: 'input',
		placeholder: '请输入企业名称'
	},
	{
		decorator: ['transType'],
		addonBeforeTitle: '运输方式',
		type: 'select',
		allowClear: true,
		placeholder: '请选择',
		options: filterCodeByKey('offlineTransTypeDict').map(item => {
			return { value: item.value, label: item.text };
		})
	},
	{
		decorator: ['businessType'],
		addonBeforeTitle: '业务类型',
		type: 'select',
		placeholder: '请选择',
		options: filterCodeByKey('orderBusinessTypeDescMap')
			.map(item => {
				return { value: item.value, label: item.text };
			})
			.filter(item => item.value != 'DISCOUNT_WAREHOUSE_PLEDGE')
	},
	{
		decorator: ['issuedDate'],
		addonBeforeTitle: '签订日期',
		type: 'rangePicker',
		allowClear: true,
		realKey: ['contractSignTimeStart', 'contractSignTimeEnd']
	},
	{
		decorator: ['issuedDate2'],
		addonBeforeTitle: '交货起始日',
		type: 'rangePicker',
		allowClear: true,
		realKey: ['minExecDateStart', 'maxExecDateStart']
	}
];
const offlineContractColumnsBuy = [
	{ title: '合同信息', dataIndex: 'contractInfo', scopedSlots: { customRender: 'contractInfo' } },
	{ title: '付款进度', dataIndex: 'paid', scopedSlots: { customRender: 'paid' }, ellipsis: true },
	{ title: '结算进度', dataIndex: 'settled', scopedSlots: { customRender: 'settled' } },
	{ title: '开票进度', dataIndex: 'invoiced', scopedSlots: { customRender: 'invoiced' } }
];

const offlineContractColumnsSell = [
	{ title: '合同信息', dataIndex: 'contractInfo', scopedSlots: { customRender: 'contractInfo' } },
	{ title: '回款进度', dataIndex: 'receivedAmount', scopedSlots: { customRender: 'receivedAmount' }, ellipsis: true },
	{ title: '结算进度', dataIndex: 'settled', scopedSlots: { customRender: 'settled' } },
	{ title: '开票进度', dataIndex: 'invoiced', scopedSlots: { customRender: 'invoiced' } }
];

import TextOverFlow from "@sub/components/TextOverflow.vue";
import { ExportIcon, Copy, CopyNow,  Arrow } from '@sub/components/svg'
export default {
	mixins: [ListMixin],
	data() {
		return {
			offlineContractColumnsBuy,
			offlineContractColumnsSell,
			url: {
				list: getDownContractList
			},
			columns: [],
			searchList,
			copyContractNoVisible: false, // 复制合同编号icon
			dataSource: [],
			clientWidth: null, //浏览器尺寸
			maxWidth: 0, // 合同信息左边文案最大宽度
			maxWidthRight: 0, // 合同信息右边文案最大宽度
			actionWidth: 80, // 操作列的宽度
			tabNum: {}, // 不同状态的数据统计
			tabNumFlag: false,
			defaultParams: {
				offlineContractType: 'OFFLINE_BUY'
			},
			getPopupContainer,
			wrapWidth: 190,
			tipShowText: '' // 合同状态文案
		};
	},
	created() {
		this.showAction();
		this.defaultParams.orderType = this.type;
		if (this.type == 'SELL') {
			this.defaultParams.offlineContractType = 'OFFLINE_SELL';
			const searchObj = {
				decorator: ['whetherReceivedAmount'],
				addonBeforeTitle: '是否回款',
				type: 'select',
				placeholder: '请选择',
				options: [
					{ value: 'RECEIVED_AMOUNT', label: '已回款' },
					{ value: 'NOT_RECEIVED_AMOUNT', label: '未回款' }
				]
			};
			this.searchList = [...searchList, searchObj];
		} else {
			this.searchList = [...searchList];
		}
	},
	props: {
		type: {
			default: 'BUY'
		}
	}, // sell销售 buy采购
	components: {
		Tabs,
		TextOverFlow,
		ContractFun,
		ExportIcon,
		Copy,
		CopyNow,
		Arrow 
	},

	watch: {
		clientWidth: {
			handler: function () {
				this.showAction();
				this.getmaxWidth();
			},
			immediate: true
		},
		dataSource: {
			handler: function (data) {
				data.forEach(item => {
					item.copyContractNoVisible = item.copyContractNoVisible || false;
				});
			},
			immediate: true,
			deep: true
		}
	},
	mounted() {
		this.clientWidth = document.body.clientWidth;
		window.onresize = () => {
			//屏幕尺寸变化就重新赋值
			return (() => {
				this.clientWidth = document.body.clientWidth;
			})();
		};
		this.getList();
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER',
			VUEX_ST_USERAUTH: 'VUEX_ST_USERAUTH',
			VUEX_CURRENT_PLATEFORM: 'VUEX_CURRENT_PLATEFORM'
		}),
		currentCompanyUscc() {
			return this.VUEX_ST_COMPANYSUER.company.uscc;
		},
		statusData() {
			if (this.type == 'BUY') {
				return [
					{
						value: 'TAB_ALL',
						text: '全部'
					},
					{
						value: 'TAB_WAIT_CONFIRM',
						text: '待确认'
					},
					{
						value: 'TAB_EXECUTING',
						text: '执行中'
					},
					{
						value: 'TAB_AUDITING',
						text: '审批中'
					},
					{
						value: 'TAB_COMPLETED',
						text: '已完结'
					},
					{
						value: 'TAB_NOT_EFFECTIVE',
						text: '无效'
					}
				];
			}
			return [
				{
					value: 'TAB_ALL',
					text: '全部'
				},
				{
					value: 'TAB_SINGLE_SIGN',
					text: '已单签'
				},
				{
					value: 'TAB_EXECUTING',
					text: '执行中'
				},
				{
					value: 'TAB_AUDITING',
					text: '审批中'
				},
				{
					value: 'TAB_COMPLETED',
					text: '已完结'
				},
				{
					value: 'TAB_NOT_EFFECTIVE',
					text: '无效'
				}
			];
		}
	},
	methods: {
		formatMoney,
		...mapMutations({
			VUEX_setRelationContract: 'business/VUEX_setRelationContract'
		}),
		visibleChange(visible, items) {
			// 合同状态文案
			if (visible) {
				offlineContractStatusTip({
					contractNo: items.contractNo
				}).then(res => {
					if (res.success && res.data) {
						this.tipShowText =
							(res.data.operator ? '操作人：' + res.data.operator + '；' : '') + '驳回原因：' + res.data.rejectReason;
					}
				});
			} else {
				this.tipShowText = '';
			}
		},
		handleChange(data) {
			this.searchParams = data;
			this.changeSearch(data);
		},
		tabChange(val) {
			this.defaultParams.tabType = val;
			this.pagination.pageNo = 1;
			this.getList();
		},
		// 操作列的宽度
		showAction() {
			if (this.clientWidth <= 1440) {
				this.actionWidth = 109;
			} else if (this.clientWidth <= 1920) {
				this.actionWidth = 120;
			} else {
				this.actionWidth = 'auto';
			}
			let arr = [
				{
					title: '操作',
					key: 'action',
					align: 'center',
					customRender: (text, items) => {
						return this.actionDiv(items);
					},
					width: this.actionWidth
				}
			];
			if (this.type == 'SELL') {
				this.columns = this.offlineContractColumnsSell.concat(arr);
			} else {
				this.columns = this.offlineContractColumnsBuy.concat(arr);
			}
		},

		subStr(val, maxWidth) {
			const info = {
				113: 15,
				91: 15,
				150: 15,
				220: 40,
				252: 40,
				463: 40
			};
			if (val) {
				if (val.length < info[maxWidth]) {
					return val;
				}
				return `${val.substring(0, info[maxWidth])}...`;
			}
		},

		// 获取合同信息字段的最小宽度
		getmaxWidth() {
			this.wrapWidth = 190;
			if (this.clientWidth <= 1440) {
				this.maxWidth = 91;
				this.maxWidthRight = 55;
			} else if (this.clientWidth < 1560) {
				this.maxWidth = 113;
				this.maxWidthRight = 65;
			} else if (this.clientWidth < 1920) {
				this.maxWidth = 150;
				this.maxWidthRight = 100;
			} else if (this.clientWidth < 2160) {
				this.maxWidth = 220;
				this.maxWidthRight = 160;
			} else if (this.clientWidth < 3000) {
				this.maxWidth = 252;
				this.maxWidthRight = 200;
			} else {
				this.maxWidth = 463;
				this.maxWidthRight = 320;
			}

			if (this.clientWidth > 1560) {
				this.wrapWidth = 340;
			}
		},
		// 操作列
		actionDiv(items) {
			let t = this;
			let actionList = getDownContractAction(
				items,
				this.type,
				this.VUEX_ST_COMPANYSUER,
				this.VUEX_ST_USERAUTH,
				this.VUEX_CURRENT_PLATEFORM
			);
			let action = actionList.filter(item => {
				return item.condition;
			});
			let actionVnode = [],
				dropdownList = [];
			let h = t.$createElement;
			action.map((item, index) => {
				let aVnode = h('a', {
					style: {
						display: 'block',
						marginBottom: '10px'
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
				if (action.length > 4 && index > 3) {
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
		jumpPage(path, query) {
			this.$router.push({
				path,
				query
			});
		},
		// 操作函数
		clickFn(func, items) {
			this.$refs.contractFun[func](items);
		},

		del(id) {
			this.$confirm({
				centered: true,
				title: '确定要删除当前合同吗？删除后将无法恢复。',
				okText: '确定',
				cancelText: '取消',
				icon: () => {
					return (
						<a-icon
							type="exclamation-circle"
							theme="filled"
						/>
					);
				},
				onOk: () => {
					API_OFFLINESELLERORDERDELETE({ id }).then(res => {
						if (res.success) {
							this.$message.success('删除成功');
							this.getList();
						}
					});
				}
			});
		},
		// 导出附件
		exportFile() {
			let currentDate = GetCurrentDate(); // 获取当前日期
			// 附件名"线下销售合同-"+this.VUEX_ST_COMPANYSUER.companyName +currentDate+ ".xls"
			API_offlineContractExportExcel({
				...this.defaultParams,
				...this.searchParams,
				offlineContractType: this.type === 'SELL' ? 'OFFLINE_SELL' : 'OFFLINE_BUY'
			})
				.then(res => {
					comDownload(
						res,
						undefined,
						'线下' +
							(this.type === 'SELL' ? '销售' : '采购') +
							'合同-' +
							this.VUEX_ST_COMPANYSUER.companyName +
							'-' +
							currentDate +
							'.xls'
					);
				})
				.finally(() => {});
		},
		resetFunc() {
			this.defaultParams.tabType = 'TAB_ALL';
			this.$refs.Tabs.status = 'TAB_ALL';
		},

		// 鼠标移入复制合同编号
		onMouseOverContractNo(index) {
			let obj = {
				...this.dataSource[index],
				copyContractNoVisible: true
			};
			this.$set(this.dataSource, index, obj);
		},
		// 鼠标移出
		onMouseOutContractNo(index) {
			let obj = {
				...this.dataSource[index],
				copyContractNoVisible: false
			};
			this.$set(this.dataSource, index, obj);
		},
		// 复制成功 or 失败（提示信息！！！）
		onCopy: function (e) {
			this.$message.success('复制成功');
		},
		onError: function (e) {
			this.$message.error('复制失败');
		},

		searchSubmit() {
			this.searchParams.pageNo = this.pagination.pageNo;
			this.changeSearch(this.searchParams);
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less" scoped>
.paper-contract-desc-wrap {
	display: flex;
	align-items: center;
}
.paper-contract-no-wrap {
	max-width: 190px;
	width: auto;
	height: 28px;
	line-height: 28px;
	display: inline-block;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
.paper-contract-type-wrap {
	width: 36px;
	height: 20px;
	line-height: 20px;
	display: inline-block;
	text-align: center;
	background: #ffead7;
	border-radius: 4px;
	font-size: 12px;
	color: #ec7b13;
}
.column-flex-wrap {
	height: 28px;
	display: flex;
	align-items: center;
	.contract-status {
		position: relative;
		top: 2px;
	}
}

.status {
	padding: 3px 5px;
	height: 20px;
	line-height: 20px;
	border-radius: 4px;
	font-size: 14px;
	zoom: 0.85;
	font-weight: 400;
}
.WAIT_CONFIRM {
	background: #c9d9ff;
	color: #596fa0;
}
.EXECUTING {
	background: #c1d7ff;
	color: #4682f3;
}
.COMPLETED {
	background: #e0e0e0;
	color: rgba(0, 0, 0, 0.25);
}
.REJECT,
.CANCEL,
.DOUBLE_SIGN_AUDITING_REJECT,
.COMPLETED_REJECT,
.PENDING_AUDITING_REJECT {
	background: #f2d0d0;
	color: #dd4444;
}
.SINGLE_SIGN {
	background: #c5ecdd;
	color: #3eb384;
}
.PENDING_APPROVAL_AUDITING,
.DOUBLE_SIGN_AUDITING,
.COMPLETED_AUDITING {
	background: #ffdac8;
	color: #ff7937;
}
.LONG_TERM_CONTRACT {
	position: absolute;
	top: 0;
	left: 0;
	height: 36px;
	width: 36px;
	overflow: hidden;
	.mark {
		position: absolute; // 绝对定位
		width: 141%;
		height: 48%;
		top: 8%;
		left: -38%;
		background-color: @primary-color; // 背景色
		transform: rotate(-45deg);
		.text {
			font-family:
				PingFangSC-Regular,
				PingFang SC;
			text-align: center; // 文本居中
			color: #fff;
			font-size: 14px;
			zoom: 0.85;
			position: relative;
			top: -2px;
		}
	}
}
</style>

<style lang="less" scoped>
.new-table {
	::v-deep .ant-table-tbody > tr > td {
		font-size: 14px;
		font-family:
			PingFangSC-Regular,
			PingFang SC;
		font-weight: 400;
		color: rgba(0, 0, 0, 0.8);
		padding: 20px;
		line-height: 22px;
		position: relative;
		.column-flex {
			& > p {
				line-height: 22px;
			}
			&::after {
				content: '';
				width: 1px;
				height: 80px;
				background: #e5e6eb;
				position: absolute;
				top: 50%;
				right: 0;
				margin-top: -40px;
			}
			& > .ant-space {
				margin-bottom: 10px;
				& > div {
					cursor: pointer;
					.copy-icon {
						margin-left: 12px;
						// vertical-align: middle;
						cursor: pointer;
						position: relative;
						top: -1px;
						width: 14px;
						height: 14px;
					}
				}
			}
			.ant-col {
				.label {
					width: 70px;
				}
			}
		}
		.column-flex.special {
			p {
				position: relative;
			}
		}
		.label {
			display: inline-block;
			margin-bottom: 10px;
			color: rgba(0, 0, 0, 0.4);
		}
	}
	::v-deep .ant-table-tbody > tr > td:first-child {
		padding-left: 12px;
	}
	::v-deep .ant-table-thead > tr > th {
		padding: 10px 20px;
	}
	::v-deep .ant-table-thead > tr > th:first-child {
		padding-left: 12px;
	}
	.progress-box {
		padding-right: 45px;
		position: relative;
		width: 145px;
		margin-bottom: 16px;
		::v-deep.ant-progress-inner {
			width: 100px;
			background-color: #d8d8d8;
		}
		::v-deep.ant-progress-bg {
			background-color: @primary-color !important;
		}
		::v-deep.ant-progress-status-success .ant-progress-bg {
			background-color: @primary-color !important;
		}
		.percent-bg {
			padding-left: 3px;
			position: absolute;
			right: 0;
			top: 3px;
			font-family:
				PingFangSC-Medium,
				PingFang SC;
			font-weight: 500;
			color: #ffffff;
			line-height: 29px;
			display: inline-block;
			width: 40px;
			height: 16px;
			text-align: center;
			background-position: 0 0;
			font-style: normal;
			.text {
				display: inline-block;
				overflow: hidden;
				position: relative;
				top: -7px;
				font-size: 14px;
				zoom: 0.83;
				text-align: center;
				width: 40px;
				text-overflow: ellipsis;
				white-space: nowrap;
				overflow: hidden;
			}
		}
		.over-percent {
			position: absolute;
			right: 45px;
			top: 2px;
			em {
				display: inline-block;
				width: 4px;
				height: 12px;
				background: @primary-color;
				border-radius: 2px;
			}
			i {
				display: inline-block;
				width: 10px;
				height: 8px;
				background: #f46332;
				border-radius: 0 4px 4px 0;
				position: relative;
				top: -2px;
			}
		}
	}
	.contract-status {
		border-radius: 4px;
		height: 20px;
		line-height: 20px;
		padding: 0 5px;
		font-family:
			PingFangSC-Regular,
			PingFang SC;
		text-align: center;
		.text {
			font-size: 14px;
			zoom: 0.85;
			position: relative;
			top: -1px;
		}
	}
	.right-arrow {
		display: inline-block;
		width: 10px;
		height: 10px;
		margin-left: 2px;
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
		left: 228px;
	}
}

// .AUDITING {
//   background: #FFDAC8;
//   color: #FF7937;
// }
// .EXECUTING {
//   background: #C1D7FF;
//   color: #4682F3;
// }
// .DRAFT {
//   background: #FFDBDB;
//   color: #DD4444;
// }
// .CONFIRM_WAIT_SIGN_SEAL {
//   background: #C5ECDD;
//   color: #3EB384;
// }
// .WAIT_CONFIRM {
//   background: #C9D9FF;
//   color: #596FA0;
// }
// .COMPLETED,.TERMINATED {
//   background: #E0E0E0;
//   color: rgba(0,0,0,0.25);
// }
// .FREEZING {
//   background: #F8DDE8;
//   color: #DB81A5;
// }
// //“驳回”、“退回”、“作废”
// .REJECT, .APPROVAL_FAIL,.CANCELLATION {
//   background: #F2D0D0;
//   color: #DD4444;
// }
// .WAIT_SIGN_SEAL {
//   background: #D3DFFB;
//   color: #4682F3;
// }
// .WAIT_COMPLETE {
//   background: #C2E6FF;
//   color: #649DC7;
// }
.new-table {
	::v-deep .ant-table-tbody > tr {
		td:last-child {
			padding: 0 25px !important;
		}
	}
}
// <=1560
@media screen and (max-width: 1560px) {
	.new-table {
		::v-deep .ant-table-tbody > tr {
			& > td {
				padding: 20px 10px;
			}
			td:first-child {
				width: 440px;
			}
			td:nth-child(5) {
				width: 180px;
			}
		}
		::v-deep .ant-table-thead > tr {
			& > th:last-child {
				padding: 10px 10px;
			}
			th:first-child {
				width: 440px;
			}
			th:nth-child(5) {
				width: 180px;
			}
		}
	}
}
// <=1440
@media screen and (max-width: 1440px) {
	.new-table {
		::v-deep .ant-table-tbody > tr {
			& > td {
				padding: 20px;
				box-sizing: border-box;
			}
			td:nth-child(1) {
				width: 400px;
			}
			td:nth-child(2) {
				width: 185px;
			}
			td:nth-child(3),
			td:nth-child(4) {
				width: 148px;
			}
			td:nth-child(5) {
				width: 190px;
			}
			td:last-child {
				padding: 0 19px !important;
			}
		}
		::v-deep .ant-table-thead > tr {
			& > th {
				padding: 10px 20px !important;
			}
			th:nth-child(1) {
				width: 400px;
				padding-left: 12px !important;
			}
			th:nth-child(2) {
				width: 185px;
			}
			th:nth-child(3),
			td:nth-child(4) {
				width: 148px;
			}
			th:nth-child(5) {
				width: 190px;
			}
		}
	}
}
// >=1560px
@media screen and (min-width: 1560px) {
	.new-table {
		::v-deep .ant-table-tbody > tr {
			td:first-child {
				width: 550px;
			}
			td:nth-child(2) {
				width: 200px;
			}
		}
		::v-deep .ant-table-thead > tr {
			th:first-child {
				width: 550px;
			}
			th:nth-child(2) {
				width: 200px;
			}
		}
	}
}
// >=1920px
@media screen and (min-width: 1920px) {
	.new-table {
		::v-deep .ant-table-tbody > tr {
			& > td {
				padding: 22px 30px !important;
			}
			td {
				width: auto !important;
			}
			td:first-child {
				width: 600px !important;
				padding-left: 12px !important;
			}
			td:last-child {
				width: 120px !important;
			}
		}
		::v-deep .ant-table-thead > tr {
			& > th {
				padding: 10px 30px !important;
			}
			th {
				width: auto !important;
			}
			th:first-child {
				width: 557px !important;
				padding-left: 12px !important;
			}
			th:last-child {
				width: 120px !important;
			}
		}
	}
}
// >=2048px
@media screen and (min-width: 2048px) {
	.new-table {
		::v-deep .ant-table-tbody > tr {
			td:first-child {
				width: 626px !important;
			}
			td:last-child {
				width: auto !important;
			}
		}
		::v-deep .ant-table-thead > tr {
			th:first-child {
				width: 626px !important;
			}
			th:last-child {
				width: auto !important;
			}
		}
	}
}
// >=3000
@media screen and (min-width: 3000px) {
	.new-table {
		::v-deep .ant-table-tbody > tr {
			& > td {
				padding: 30px 50px !important;
			}
			td:first-child {
				width: 1000px !important;
			}
		}
		::v-deep .ant-table-thead > tr {
			& > th {
				padding: 10px 50px !important;
			}
			th:first-child {
				width: 1000px !important;
			}
		}
	}
}
</style>

<style lang="less">
.more-btn-tooltips {
	z-index: 100;
	.ant-tooltip-inner {
		padding: 10px 0;
		background-color: #fff;
		& > a {
			font-family:
				PingFangSC-Regular,
				PingFang SC;
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
.omit-box {
	// display: flex;
	// align-items: center;
	// width: 60%;
	.omit {
		white-space: nowrap;
		overflow: hidden; //文本超出隐藏
		text-overflow: ellipsis; //文本超出省略号替代
		// display: inline-block;
	}
}
</style>
