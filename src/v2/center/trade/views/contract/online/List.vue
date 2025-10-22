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
							class="contract-info-list"
							:size="12"
						>
							<div
								@mouseenter="onMouseOverContractNo(index)"
								@mouseleave="onMouseOutContractNo(index)"
							>
								<span>{{ items.contractNo || '-' }}</span>
								<Copy class="copy-icon" v-show="!items.copyContractNoVisible"></Copy>
								<span
									v-show="items.copyContractNoVisible"
									v-clipboard:success="onCopy" 
									v-clipboard:error="onError"  
									v-clipboard:copy="items.contractNo"
									class="copy-icon"
									>
									<CopyNow ></CopyNow>
								</span>
							</div>
							<a-tooltip
								placement="top"
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
							<!-- 冻结中 或者 驳回/拒绝但是没有发运相关数据 -->
							<span
								v-if="
									items.status == 'FREEZING' ||
									(['AUDITING_REJECT', 'CONFIRM_REJECT', 'CANCELLATION'].includes(items.terminalContractStatus) &&
										!items.hasDeliveryPayData)
								"
								class="contract-termination-icon"
								>合同终止:{{ items.terminalContractStatusDesc }}</span
							>
						</a-space>
						<a-row
							type="flex"
							justify="start"
							:gutter="15"
							class="contract-info-desc"
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
									<span class="label">收货人：</span>
									<TextOverFlow
										:content="items.receiverName || '-'"
										:maxWidth="maxWidth"
									/>
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
										:content="(items.deliveryDateBegin || '-') + '至' + (items.deliveryDateEnd || '-')"
										:maxWidth="maxWidth"
									/>
								</p>
							</a-col>
							<a-col :span="10">
								<p>
									<span class="label">运输方式：</span>
									<TextOverFlow
										:content="items.transTypeDesc || '-'"
										:maxWidth="maxWidthRight"
									/>
								</p>
								<p>
									<span class="label">交货方式：</span>
									<TextOverFlow
										:content="items.deliveryTypeDesc || '-'"
										:maxWidth="maxWidthRight"
									/>
								</p>
								<p>
									<span class="label">基准价格：</span>
									<TextOverFlow
										v-if="items.basePrice"
										:content="formatMoney(items.basePrice, 2) + '元/吨'"
										:maxWidth="maxWidthRight"
									/>
									<TextOverFlow
										v-else-if="items.basePriceDesc"
										:content="items.basePriceDesc"
										:maxWidth="maxWidthRight"
									/>
									<span v-else>-</span>
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

				<!-- 发运进度 -->
				<template
					slot="deliverProgress"
					slot-scope="deliverProgress, items"
				>
					<div class="column-flex">
						<div
							class="progress-box"
							:size="5"
						>
							<a-progress
								:percent="items.dispatchRate || 0"
								:show-info="false"
							/>
							<em class="percent-bg">
								<PercentBgIcon></PercentBgIcon>
								<span class="text">{{ items.dispatchRate }}%</span>
							</em>
							<div
								class="over-percent"
								v-if="items.dispatchRate > 100"
							>
								<em></em>
								<i></i>
							</div>
						</div>
						<p><span class="label">合同量：</span>{{ items.quantity | formatMoney(2) }}吨</p>
						<p><span class="label">已发运：</span>{{ items.deliverQuantity | formatMoney(2) }}吨</p>
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
						<p style="margin-bottom: 20px">{{ items.orderInvoiceTabNum }}</p>
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
				size="small"
				v-show="pageSize < pagination.total"
				@change="getList"
			/>
		</div>
		<ContractFunc
			ref="contractFunc"
			:type="type"
			:detail="detailData"
			@refresh="searchSubmit"
		/>
	</div>
</template>

<script>
import { filterCodeByKey } from '@sub/utils/globalCode.js';
import { ListMixin } from '@/v2/components/mixin/ListMixin';
import {
	API_pageOrderContractList,
	API_contractExportExcel,
	API_countEachTabStateNum,
	getOrderStatus
} from '@/v2/center/trade/api/contract';
import { mapGetters, mapMutations } from 'vuex';
import { GetCurrentDate, getPopupContainer } from '@/v2/utils/factory.js';
import TextOverFlow from "@sub/components/TextOverflow.vue";
import tableTooltipSell from '@/v2/center/trade/views/contract/tableTooltipSell';
import comDownload from '@sub/utils/comDownload.js';
import ContractFunc from '@/v2/center/trade/views/contract/components/ContractFunc.vue';
import { getContractAction } from '@/v2/center/trade/views/contract/action';
import reportCode from '@/v2/config/reportCode';
import Tabs from '@/v2/center/trade/views/contract/components/Tabs';
import { isEqual } from 'lodash';
import { formatMoney } from '@sub/filters';
import { ExportIcon, Copy, CopyNow, PercentBgIcon, Arrow } from '@sub/components/svg'
const searchList = [
	{
		decorator: ['orderContractSerialNo'],
		addonBeforeTitle: '编号',
		type: 'input',
		placeholder: '请输入订单或合同编号'
	},
	{
		decorator: ['companyName'],
		addonBeforeTitle: '企业名称',
		type: 'input',
		placeholder: '请输入企业名称'
	},
	{
		decorator: ['receiverName'],
		addonBeforeTitle: '收货人',
		type: 'input',
		placeholder: '请输入收货人名称'
	},
	{
		decorator: ['transType'],
		addonBeforeTitle: '运输方式',
		type: 'select',
		placeholder: '请选择',
		options: filterCodeByKey('onlineTransTypeDict').map(item => {
			return { value: item.value, label: item.text };
		})
	},
	{
		decorator: ['coalType'],
		addonBeforeTitle: '煤种',
		type: 'select',
		placeholder: '请选择',
		options: filterCodeByKey('goods_type').map(item => {
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
		realKey: ['signTimeBeginStr', 'signTimeEndStr']
	}
];
const onlineContractColumns = [
	{ title: '合同信息', dataIndex: 'contractInfo', scopedSlots: { customRender: 'contractInfo' } },
	{ title: '发运进度', dataIndex: 'deliverProgress', scopedSlots: { customRender: 'deliverProgress' } },
	{ title: '付款进度', dataIndex: 'paid', scopedSlots: { customRender: 'paid' }, ellipsis: true },
	{ title: '结算进度', dataIndex: 'settled', scopedSlots: { customRender: 'settled' } },
	{ title: '开票进度', dataIndex: 'invoiced', scopedSlots: { customRender: 'invoiced' } }
];

export default {
	mixins: [ListMixin],
	data() {
		return {
			onlineContractColumns,
			getPopupContainer,
			url: {
				list: API_pageOrderContractList
			},
			columns: [],
			searchList,
			//排序参数
			isorter: {
				column: 'createTime',
				order: 'desc'
			},
			dataSource: [],
			statusData: filterCodeByKey('orderTabTypeDict').filter(
				item => !['TAB_BUY_CONFIRM', 'TAB_BUY_SIGN_SEAL', 'TAB_SELL_SIGN_SEAL', 'TAB_SELL_CONFIRM'].includes(item.value)
			),
			status: 'TAB_ALL',
			copyContractNoVisible: false, // 复制合同编号icon
			tipShowText: '', // 合同状态文案
			cancelId: null, // 作废合同id
			maxWidth: 0, // 合同信息左边文案最大宽度
			maxWidthRight: 0, // 合同信息右边文案最大宽度
			actionWidth: 80, // 操作列的宽度
			tabNum: {}, // 不同状态的数据统计
			tabNumFlag: false,
			clientWidth: null, //浏览器尺寸
			detailData: {}
		};
	},
	created() {
		this.showAction();
		this.defaultParams.orderType = this.type;
		this.getNum(); // 获取数据统计数
	},
	props: ['type'], // SELL销售 BUY采购
	components: {
		TextOverFlow,
		ContractFunc,
		Tabs,
		ExportIcon,
		Copy,
		CopyNow,
		PercentBgIcon,
		Arrow
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER',
			VUEX_ST_USERAUTH: 'VUEX_ST_USERAUTH',
			VUEX_CURRENT_PLATEFORM: 'VUEX_CURRENT_PLATEFORM'
		}),
		currentCompanyUscc() {
			return this.VUEX_ST_COMPANYSUER.company.uscc;
		}
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
	},
	methods: {
		formatMoney,
		...mapMutations({
			VUEX_setRelationContract: 'business/VUEX_setRelationContract'
		}),
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
			this.columns = this.onlineContractColumns.concat(arr);
		},
		// 获取合同信息字段的最小宽度
		getmaxWidth() {
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
		},
		handleChange(data) {
			if (isEqual(data, this.searchParams)) {
				return;
			}
			this.searchParams = data;
			this.getNum();
			this.changeSearch(data);
			try {
				const values = [];
				for (const key in data) {
					values.push(data[key]);
				}
				const flag = values.filter(item => item);
				if (flag.length) {
					const code = reportCode.contract[this.type.toLowerCase()].search;
					window.reportUtil.reportEvent(code, data);
				}
			} catch (error) {
				console.error(error);
			}
		},
		// 获取数据统计数
		getNum() {
			const params = {
				...this.defaultParams,
				...this.searchParams
			};
			API_countEachTabStateNum(params).then(res => {
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
			let actionList = getContractAction(
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
		// 操作函数
		clickFn(func, items) {
			this.detailData = items;
			let that = this;
			try {
				const code = reportCode.contract[this.type.toLowerCase()][func];
				window.reportUtil.reportEvent(code, items);
			} catch (error) {
				console.error(error);
			}
			setTimeout(() => {
				if(that.$refs.contractFunc && typeof that.$refs.contractFunc[func] == "function"){
					that.$refs.contractFunc[func]();
				}
			}, 500);
		},
		// 回调查询
		searchSubmit() {
			this.searchParams.pageNo = this.pagination.pageNo;
			this.changeSearch(this.searchParams);
		},

		exportFunc() {
			let currentDate = GetCurrentDate(); // 获取当前日期
			API_contractExportExcel({
				...this.defaultParams,
				...this.searchParams
			})
				.then(res => {
					comDownload(
						res,
						undefined,
						'电子' +
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
		visibleChange(visible, items) {
			// 合同状态文案
			if (visible) {
				getOrderStatus({
					orderId: items.id
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
			if (data.initiatorUscc == this.currentCompanyUscc) {
				text = tableTooltipSell[row.status].a;
			} else {
				text = tableTooltipSell[row.status].b;
			}
			if (row.status == 'REJECT' && data?.rejectReason) {
				text += '，驳回原因：' + data?.rejectReason;
			}
			if (row.status == 'CANCELLATION' && data?.cancelReason) {
				text += '，作废原因：' + data?.cancelReason;
			}
			if (row.status == 'CONFIRM_WAIT_SIGN_SEAL' && row.receiveConfigOA) {
				text = text.replace('该合同已被【接收方】确认', '该合同由【接收方】审核通过');
			}
			if (data.initSingerName && data.initManagerName) {
				if (data.initSingerName == data.initManagerName) {
					text = text.replace('【发起方签章员】', '');
				} else {
					text = text.replace('【发起方签章员】', '【发起方签章员】或');
				}
			}
			if (data.receiveSingerName && data.receiveManagerName) {
				if (data.receiveSingerName == data.receiveManagerName) {
					text = text.replace('【接收方签章员】', '');
				} else {
					text = text.replace('【接收方签章员】', '【接收方签章员】或');
				}
			}
			text = text
				.replace('【审批部门】', data.auditDesc || '')
				.replace('【发起方】', data.initAbbreviation || '')
				.replace('【接收方】', data.receiveAbbreviation || '')
				.replace('【发起方签章员】', `（${data.initSingerName}-${data.initSingerMobile}）` || '')
				.replace('【发起方企业管理员】', `（${data.initManagerName}-${data.initManagerMobile}）` || '')
				.replace('【接收方签章员】', `（${data.receiveSingerName}-${data.receiveSingerMobile}）` || '')
				.replace('【接收方企业管理员】', `（${data.receiveManagerName}-${data.receiveManagerMobile}）` || '');
			this.tipShowText = text;
		},
		resetFunc() {
			this.defaultParams.tabType = 'TAB_ALL';
			this.$refs.Tabs.status = 'TAB_ALL';
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
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
						cursor: pointer;
						position: relative;
						top: 2px;
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
			background-color: @primary-color!important;
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
			font-style: normal;
			svg {
				position: absolute;
				top: 0;
				left: 0;
			}
			.text {
				display: inline-block;
				overflow: hidden;
				position: absolute;
				top: 0;
				left: 3px;
				z-index: 10;
				font-size: 14px;
				zoom: 0.86;
				width: 47px;
				height: 19px;
				line-height: 20px;
				text-align: center;
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

.AUDITING {
	background: #ffdac8;
	color: #ff7937;
}
.EXECUTING {
	background: #c1d7ff;
	color: #4682f3;
}
.DRAFT {
	background: #ffdbdb;
	color: #dd4444;
}
.CONFIRM_WAIT_SIGN_SEAL {
	background: #c5ecdd;
	color: #3eb384;
}
.WAIT_CONFIRM {
	background: #c9d9ff;
	color: #596fa0;
}
.COMPLETED,
.TERMINATED {
	background: #e0e0e0;
	color: rgba(0, 0, 0, 0.25);
}
.FREEZING {
	background: #f8dde8;
	color: #db81a5;
}
//“驳回”、“退回”、“作废”
.REJECT,
.APPROVAL_FAIL,
.CANCELLATION {
	background: #f2d0d0;
	color: #dd4444;
}
.WAIT_SIGN_SEAL,
.AUDITING_RECEIVE {
	background: #d3dffb;
	color: #4682f3;
}
.WAIT_COMPLETE {
	background: #c2e6ff;
	color: #649dc7;
}
.new-table {
	::v-deep .ant-table-tbody > tr {
		td:last-child {
			padding: 0 0px !important;
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
				width: 360px;
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
				width: 360px;
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
				width: 340px;
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
		}
		::v-deep .ant-table-thead > tr {
			& > th {
				padding: 10px 20px !important;
			}
			th:nth-child(1) {
				width: 340px;
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
				width: 400px;
			}
			td:nth-child(2) {
				width: 200px;
			}
		}
		::v-deep .ant-table-thead > tr {
			th:first-child {
				width: 400px;
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
				width: 557px !important;
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

<style lang="less" scoped>
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
.contract-termination-icon {
	width: auto;
	overflow: hidden;
	height: 20px;
	padding: 0 6px;
	display: inline-block;
	border-radius: 4px;
	line-height: 20px;
	background: #ffdac8;
	font-size: 12px;
	color: #ff7937;
	position: absolute !important;
	top: 1px;
}
.wait-stamp {
	color: #596fa0;
	background: #c9d9ff;
}
.contract-info-list {
	width: 600px;
	height: 22px;
	position: absolute;
	top: 0;
	left: 0;
	display: flex;
	flex-direction: row;
	align-items: center;
	margin: 20px 0 17px 10px;
	z-index: 99;
}
.contract-info-desc {
	margin-top: 32px;
}
</style>
