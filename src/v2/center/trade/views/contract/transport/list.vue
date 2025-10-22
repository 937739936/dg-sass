<template>
	<div class="slMain">
		<a-card :bordered="false">
			<p class="methods-wrap">
				<span
					slot="title"
					class="slTitle"
					>运输合同</span
				>
				<a-button
					type="primary"
					class="add-btn"
					@click="add"
					v-if="!IS_LOGISTICS_COMPANY"
					v-auth="'dgChain:contract:transportContract:edit'"
					><span class="btn-text">新增运输合同</span></a-button
				>
			</p>
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
								:size="12"
								class="column-flex-wrap"
							>
								<div
									@mouseenter="onMouseOverContractNo(index, 'contract')"
									@mouseleave="onMouseOutContractNo(index, 'contract')"
									class="paper-contract-desc-wrap"
								>
									<span class="paper-contract-no-wrap">{{ items.paperContractNo || '-' }}</span>
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
								<p :class="'contract-status ' + items.status">
									<span class="text">{{ items.statusDesc }}</span>
								</p>
							</a-space>
							<a-row
								type="flex"
								justify="start"
								:gutter="15"
							>
								<a-col :span="24">
									<div class="paper-contract-desc-wrap paper-businessline-desc-wrap">
										<span
											class="label label-businessline"
											style="width: 112px"
											>已关联业务线号：</span
										>
										<span
											class="label-businessline-wrap"
											@mouseenter="onMouseOverContractNo(index, 'businessLine')"
											@mouseleave="onMouseOutContractNo(index, 'businessLine')"
										>
											<span class="paper-contract-no-wrap cursor-pointer">{{ items.businessLineNo || '-' }}</span>
											<span
												v-show="!items.copyBusinessLineNoVisible"
												class="copy-icon"
												>
												<Copy></Copy>
											</span>
											<span
												v-show="items.copyBusinessLineNoVisible"
												v-clipboard:success="onCopy" 
												v-clipboard:error="onError"  
												v-clipboard:copy="items.businessLineNo"
												class="copy-icon"
												>
												<CopyNow></CopyNow>
											</span>
										</span>
									</div>
									<p>
										<span
											class="label"
											style="width: 112px"
											>承运人：</span
										>
										<TextOverFlow
											:content="items.sellerName || '-'"
											:maxWidth="maxWidth"
											style="left: 112px"
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
							<p>{{ items.paidAmount }}</p>
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
							<p style="margin-bottom: 20px">
								{{ items.statementedAmount }}
							</p>
							<p
								class="label"
								style="margin-bottom: 5px"
							>
								已结算数量(吨):
							</p>
							<p>{{ items.statementedQuantity }}</p>
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
			<ContractFuncTrans
				ref="contractFunc"
				:type="type"
				:detail="detailData"
				@refresh="searchSubmit"
			/>
		</a-card>
	</div>
</template>

<script>
import { filterCodeByKey } from '@sub/utils/globalCode.js';
import { ListMixin } from '@/v2/components/mixin/ListMixin';
import { mapGetters, mapMutations } from 'vuex';
import { GetCurrentDate, getPopupContainer } from '@/v2/utils/factory.js';
import TextOverFlow from "@sub/components/TextOverflow.vue";
import comDownload from '@sub/utils/comDownload.js';
import ContractFuncTrans from '../components/ContractFuncTrans.vue';
import { getContractAction } from '../actionTrans';
import Tabs from '../components/Tabs';
import { isEqual } from 'lodash';
import { API_contractlist, API_contractListExport, API_contract_Amount } from '@/v2/center/trade/api/transportContract';
import {ExportIcon, Copy, CopyNow, Arrow} from '@sub/components/svg'

const searchList = [
	{
		decorator: ['paperContractNo'],
		addonBeforeTitle: '合同编号',
		type: 'input',
		placeholder: '请输入合同编号'
	},
	{
		decorator: ['contractSignTime'],
		addonBeforeTitle: '签订日期',
		type: 'rangePicker',
		realKey: ['contractSignTimeStart', 'contractSignTimeEnd']
	},
	{
		decorator: ['execDate'],
		addonBeforeTitle: '合同有效期',
		type: 'rangePicker',
		realKey: ['execDateStart', 'execDateEnd']
	},
	{
		decorator: ['transportMode'],
		addonBeforeTitle: '运输方式',
		type: 'select',
		placeholder: '请选择',
		options: filterCodeByKey('transportModeDictSTEAM_COAL_001').map(item => {
			return { value: item.value, label: item.text };
		})
	},
	{
		decorator: ['companyName'],
		addonBeforeTitle: '企业名称',
		type: 'input',
		placeholder: '请输入企业名称'
	}
];
const onlineContractColumns = [
	{
		title: '合同信息',
		dataIndex: 'contractInfo',
		scopedSlots: { customRender: 'contractInfo' }
	},
	{
		title: '付款进度',
		dataIndex: 'paid',
		scopedSlots: { customRender: 'paid' },
		ellipsis: true
	},
	{
		title: '结算进度',
		dataIndex: 'settled',
		scopedSlots: { customRender: 'settled' }
	},
	{
		title: '开票进度',
		dataIndex: 'invoiced',
		scopedSlots: { customRender: 'invoiced' }
	}
];

export default {
	mixins: [ListMixin],
	data() {
		return {
			onlineContractColumns,
			getPopupContainer,
			columns: [],
			searchList,
			//排序参数
			isorter: {
				column: 'createTime',
				order: 'desc'
			},
			dataSource: [],
			statusData: [
				{
					value: 'TAB_ALL',
					text: '全部',
					status: ''
				},
				{
					value: 'waitSubmitNum',
					text: '待提交',
					status: 'DRAFT'
				},
				{
					value: 'executingNum',
					text: '执行中',
					status: 'EXECUTING'
				}
			],
			copyContractNoVisible: false, // 复制合同编号icon
			tipShowText: '', // 合同状态文案
			cancelId: null, // 作废合同id
			maxWidth: 0, // 合同信息左边文案最大宽度
			maxWidthRight: 0, // 合同信息右边文案最大宽度
			actionWidth: 80, // 操作列的宽度
			tabNum: {}, // 不同状态的数据统计
			tabNumFlag: true,
			clientWidth: null, //浏览器尺寸
			detailData: {},
			numMap: {
				allNum: '',
				executingNum: 'EXECUTING',
				waitSubmitNum: 'DRAFT'
			}
		};
	},
	created() {
		this.showAction();
		this.getNum(); // 获取数据统计数
	},
	props: ['type'], // SELL销售 BUY采购
	components: {
		TextOverFlow,
		ContractFuncTrans,
		Tabs,
		ExportIcon,
		Copy,
		CopyNow,
		Arrow
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		currentCompanyUscc() {
			return this.VUEX_ST_COMPANYSUER.company.uscc;
		},
		IS_LOGISTICS_COMPANY() {
			return this.VUEX_ST_COMPANYSUER.companyType === 'LOGISTICS';
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
					item.copyBusinessLineNoVisible = item.copyBusinessLineNoVisible || false;
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
		...mapMutations({
			VUEX_setRelationContract: 'business/VUEX_setRelationContract'
		}),
		add() {
			this.$router.push('/center/contract/transport/add');
		},
		getList(pageNo = this.pagination.pageNo, pageSize = 10) {
			this.pageSize = pageSize;
			this.pagination.pageNo = pageNo;
			this.loading = true;
			const params = {
				...this.defaultParams,
				...this.searchParams,
				...this.pagination
			};
			delete params.total;
			API_contractlist({
				...params,
				pageSize: this.pageSize
			})
				.then(res => {
					if (res.success) {
						this.pagination.total = res.data.total;
						this.dataSource = res.data.records;
					}
				})
				.finally(() => {
					this.loading = false;
				});
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
		},
		// 获取数据统计数
		getNum() {
			const params = {
				...this.defaultParams,
				...this.searchParams
			};
			API_contract_Amount(params).then(res => {
				if (res.success) {
					this.tabNum = {
						...res.data,
						TAB_ALL: res.data.allNum
					};
				}
			});
		},
		tabChange(val) {
			this.defaultParams.tabType = this.numMap[val];
			this.defaultParams.statusList = this.numMap[val]?.split(',');
			this.pagination.pageNo = 1;
			this.getNum();
			this.getList();
		},
		// 操作列
		actionDiv(items) {
			let t = this;
			let actionList = getContractAction(items, this.type, this.VUEX_ST_COMPANYSUER);
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
			setTimeout(() => {
				if(typeof that.$refs.contractFunc[func] == 'function'){
					that.$refs.contractFunc[func]('transport');
				}
			}, 500);
		},
		// 回调查询
		searchSubmit() {
			this.searchParams.pageNo = this.pagination.pageNo;
			this.changeSearch(this.searchParams);
			this.getNum();
		},
		exportFunc() {
			let currentDate = GetCurrentDate(); // 获取当前日期
			const params = {
				...this.defaultParams,
				...this.searchParams
			};
			params.statusList = params.statusList?.join(',');
			API_contractListExport(params)
				.then(res => {
					comDownload(res, undefined, '线下运输合同' + '-' + this.VUEX_ST_COMPANYSUER.companyName + '-' + currentDate + '.xls');
				})
				.finally(() => {});
		},

		// 鼠标移入复制合同编号
		onMouseOverContractNo(index, type) {
			let obj = {
				...this.dataSource[index]
			};
			if (type == 'contract') {
				obj.copyContractNoVisible = true;
			} else {
				obj.copyBusinessLineNoVisible = true;
			}
			this.$set(this.dataSource, index, obj);
		},
		// 鼠标移出
		onMouseOutContractNo(index, type) {
			let obj = {
				...this.dataSource[index],
				copyContractNoVisible: false
			};
			if (type == 'contract') {
				obj.copyContractNoVisible = false;
			} else {
				obj.copyBusinessLineNoVisible = false;
			}
			this.$set(this.dataSource, index, obj);
		},
		// 复制成功 or 失败（提示信息！！！）
		onCopy: function (e) {
			this.$message.success('复制成功');
		},
		onError: function (e) {
			this.$message.error('复制失败');
		},
		resetFunc() {
			this.defaultParams.tabType = '';
			this.defaultParams.statusList = null
			this.$refs.Tabs.status = 'TAB_ALL';
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
.add-btn {
	height: 32px;
	overflow: hidden;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	padding: 0 10px;
	overflow: hidden;
}
.btn-text {
	display: flex;
	align-items: center;
}
.btn-text::before {
	width: 18px;
	height: 32px;
	content: '';
	display: inline-block;
	background: url('~@/v2/assets/imgs/contract/add_contract_icon.png') no-repeat;
	background-size: 18px 18px;
	background-position: center;
	margin-right: 10px;
}
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
		background: url('~@/v2/assets/imgs/contract/right_more_icon.png') no-repeat 100% / cover;
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
.WAIT_SIGN_SEAL {
	background: #d3dffb;
	color: #4682f3;
}
.WAIT_COMPLETE {
	background: #c2e6ff;
	color: #649dc7;
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
			td:last-child {
				padding: 0 19px !important;
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
				width: 468px !important;
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
.paper-contract-desc-wrap {
	display: flex;
	align-items: center;
}
.paper-contract-no-wrap {
	// max-width: 190px;
	width: auto;
	height: 28px;
	line-height: 28px;
	display: inline-block;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
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
.copy-icon {
	width: 14px;
	height: 14px;
	display: inline-block;
	margin-left: 12px;
	cursor: pointer;
	position: relative;
	top: -1px;
	width: 14px;
	height: 14px;
}
.paper-businessline-desc-wrap {
	margin-bottom: 10px;
}
.label-businessline {
	height: 28px;
	line-height: 28px;
	margin-bottom: 0 !important;
}
.cursor-pointer {
	cursor: pointer;
}
.label-businessline-wrap {
	height: 28px;
	display: flex;
	align-items: center;
}
</style>
