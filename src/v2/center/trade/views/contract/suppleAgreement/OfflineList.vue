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
				v-if="statusData"
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
				:columns="onlineSuppColumns"
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
					<div class="column-flex special">
						<a-space :size="12">
							<div
								@mouseenter="onMouseOverContractNo(index, 'copyContractNoVisible')"
								@mouseleave="onMouseOutContractNo(index, 'copyContractNoVisible')"
							>
								<em
									class="contractTypeSymbol"
									:class="[items.currentContractType.includes('销') ? 'SELL' : '']"
									>{{ items.currentContractType.includes('采') ? '采' : '销' }}</em
								>
								<span>合同编号：{{ items.paperContractNo || '-' }}</span>
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
						</a-space>
						<a-row
							type="flex"
							justify="start"
							:gutter="15"
						>
							<a-col :span="24">
								<p v-if="VUEX_ST_COMPANYSUER.companyUscc == items.buyerCompanyUscc">
									<span class="label">卖方：</span>
									<TextOverFlow
										:content="items.sellerCompanyName || '-'"
										:maxWidth="maxWidth"
									/>
								</p>
								<p v-else>
									<span class="label">买方：</span>
									<TextOverFlow
										:content="items.buyerCompanyName || '-'"
										:maxWidth="maxWidth"
									/>
								</p>
								<p>
									<span class="label">运输方式：</span>
									<TextOverFlow
										v-if="items.offlineTransType"
										:content="items.offlineTransTypeDesc || '-'"
										:maxWidth="maxWidth"
									/>
									<TextOverFlow
										v-else
										:content="items.offlineTransTypeDesc || '-'"
										:maxWidth="maxWidth"
									/>
								</p>

								<p>
									<span class="label">交货期限：</span>
									<TextOverFlow
										v-if="items.deliveryDateStart"
										:content="(items.deliveryDateStart || '-') + '至' + (items.deliveryDateEnd || '-')"
										:maxWidth="maxWidth"
									/>
									<span v-else>-</span>
								</p>
							</a-col>
						</a-row>
					</div>
				</template>
				<!-- 补协信息 -->
				<template
					slot="suppInfo"
					slot-scope="contractInfo, items, index"
				>
					<div class="column-flex special">
						<a-space :size="12">
							<div
								@mouseenter="onMouseOverContractNo(index, 'serialNoVisible')"
								@mouseleave="onMouseOutContractNo(index, 'serialNoVisible')"
							>
								<span>补协编号：{{ items.paperSupplementalAgreementNo || '-' }}</span>
								<span
									v-show="!items.serialNoVisible"
									class="copy-icon"
									>
									<Copy></Copy>
								</span>
								<span
									v-show="items.serialNoVisible"
									v-clipboard:success="onCopy" 
									v-clipboard:error="onError"  
									v-clipboard:copy="items.paperSupplementalAgreementNo"
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
								<p class="sup-item">
									<span>变更项：</span>
									<a-tooltip v-if="items.changeItemDesc">
										<template slot="title">
											{{ items.changeItemDesc }}
										</template>
										<span
											class="omit"
											v-if="items.changeItemDesc"
											>{{ items.changeItemDesc }}</span
										>
									</a-tooltip>
									<span v-else> - </span>
								</p>
								<p class="sup-item">
									<span>签章状态：</span>
									<span>{{ items.signStatusDesc }}</span>
								</p>
								<p class="sup-item">
									<span>执行期：</span>
									<span v-if="items.execDateStart">{{ items.execDateStart }} 至 {{ items.execDateEnd }} </span>
									<span v-else> - </span>
								</p>
							</a-col>
						</a-row>
					</div>
				</template>

				<template
					slot="signDate"
					slot-scope="text, items"
				>
					<div class="column-flex">
						<!-- <p class="label" style="margin-bottom: 5px;">已付款金额(元):</p> -->
						<p>{{ items.signDate }}</p>
					</div>
				</template>

				<template
					slot="action"
					slot-scope="text, items"
				>
					<div class="column-flex column-flex2">
						<div @click="goDetail(items)"><a>补协详情</a></div>
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
	</div>
</template>

<script>
import { filterCodeByKey } from '@sub/utils/globalCode.js';
import { ListMixin } from '@/v2/components/mixin/ListMixin';

import {
	getOfflineSupAgreementList,
	exportOfflineXls,
	downloadAllSup,
	downloadCurrentSup
} from '@/v2/center/trade/api/suppleAgreement';
import comDownload from '@sub/utils/comDownload.js';

import { mapGetters, mapMutations } from 'vuex';

import { GetCurrentDate, getPopupContainer } from '@/v2/utils/factory.js';

import TextOverFlow from '@sub/components/TextOverflow.vue';

import ContractFunc from '../components/ContractFunc.vue';
import { getContractAction } from '../action';

import reportCode from '@/v2/config/reportCode';

import Tabs from '../components/suppleAgreement/Tabs.vue';
import { isEqual } from 'lodash';
import {ExportIcon, Copy, CopyNow} from '@sub/components/svg'

const searchList = [
	{
		decorator: ['no'],
		addonBeforeTitle: '编号',
		type: 'input',
		placeholder: '请输入订单、合同、补协编号'
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
		placeholder: '请选择',
		options: [
			{ value: 'BUY', label: '采购合同' },
			{ value: 'SELL', label: '销售合同' }
		]
	},
	{
		decorator: ['issuedDate2'],
		addonBeforeTitle: '合同日期',
		type: 'rangePicker',
		realKey: ['contractSignDateStart', 'contractSignDateEnd']
	},
	{
		decorator: ['issuedDate'],
		addonBeforeTitle: '补协日期',
		type: 'rangePicker',
		realKey: ['signDateStart', 'signDateEnd']
	}
];
const onlineSuppColumns = [
	{ title: '合同信息', dataIndex: 'contractInfo', scopedSlots: { customRender: 'contractInfo' } },
	{ title: '补协信息', dataIndex: 'suppInfo', scopedSlots: { customRender: 'suppInfo' }, ellipsis: true },
	{ title: '补协签订日期', dataIndex: 'signDate', scopedSlots: { customRender: 'signDate' } },
	{ title: '操作', dataIndex: 'action', scopedSlots: { customRender: 'action' } }
];
export default {
	mixins: [ListMixin],
	data() {
		return {
			onlineSuppColumns,
			getPopupContainer,
			url: {
				list: getOfflineSupAgreementList
			},
			columns: [],
			searchList,
			//排序参数
			isorter: {
				column: 'createTime',
				order: 'desc'
			},
			dataSource: [],
			statusData: [{ value: 'TAB_ALL', text: '全部' }, ...filterCodeByKey('TerminalSupplementalAgreementTabStatus')],
			offlineStatus: '',
			copyContractNoVisible: false, // 复制合同编号icon
			// 补协编号
			serialNoVisible: false,

			tipShowText: '', // 合同状态文案
			maxWidth: 0, // 合同信息左边文案最大宽度
			maxWidthRight: 0, // 合同信息右边文案最大宽度
			actionWidth: 80, // 操作列的宽度
			tabNum: {}, // 不同状态的数据统计
			clientWidth: null, //浏览器尺寸
			detailData: {},

			radioValue: 0,
			// 操作的对象
			currentItem: {}
		};
	},
	created() {
		this.defaultParams.orderType = this.type;
		this.defaultParams.offlineStatus = '';
	},
	props: ['type'], // SELL销售 BUY采购
	components: {
		TextOverFlow,
		ContractFunc,
		Tabs,
		ExportIcon,
		Copy,
		CopyNow
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		currentCompanyUscc() {
			return this.VUEX_ST_COMPANYSUER.company.uscc;
		}
	},
	watch: {
		clientWidth: {
			handler: function () {
				this.getmaxWidth();
			},
			immediate: true
		},
		dataSource: {
			handler: function (data) {
				data.forEach(item => {
					item.copyContractNoVisible = item.copyContractNoVisible || false;
					item.serialNoVisible = item.serialNoVisible || false;
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
		// 获取合同信息字段的最小宽度
		getmaxWidth() {
			if (this.clientWidth <= 1440) {
				this.maxWidth = 200;
			} else if (this.clientWidth < 1560) {
				this.maxWidth = 200;
			} else if (this.clientWidth < 1920) {
				this.maxWidth = 250;
			} else if (this.clientWidth < 2160) {
				this.maxWidth = 400;
			} else if (this.clientWidth < 3000) {
				this.maxWidth = 400;
			} else {
				this.maxWidth = 463;
			}
		},
		handleChange(data) {
			if (isEqual(data, this.searchParams)) {
				return;
			}
			this.searchParams = data;
			this.changeSearch(data);
		},

		tabChange(val) {
			this.defaultParams.offlineStatus = val;
			if (val == 'TAB_ALL') {
				this.defaultParams.offlineStatus = '';
			}
			this.pagination.pageNo = 1;

			this.getList();
		},

		exportFunc() {
			let currentDate = GetCurrentDate(); // 获取当前日期
			exportOfflineXls({
				...this.defaultParams,
				...this.searchParams,
				supplementAgreementType: 'OFFLINE'
			})
				.then(res => {
					comDownload(res, undefined, `线下补协-${this.VUEX_ST_COMPANYSUER.companyName}-${currentDate}.xls`);
				})
				.finally(() => {});
		},
		goDetail(items) {
			this.$router.push({
				path: '/center/contract/agreement/downSuppleDetail',
				query: {
					id: items.id,
					suppleType: 'off'
				}
			});
		},

		// 鼠标移入复制合同编号
		onMouseOverContractNo(index, key) {
			let obj = {
				...this.dataSource[index]
			};
			obj[key] = true;
			this.$set(this.dataSource, index, obj);
		},
		// 鼠标移出
		onMouseOutContractNo(index, key) {
			let obj = {
				...this.dataSource[index]
			};
			obj[key] = false;
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
			this.defaultParams.offlineStatus = '';
			this.$refs.Tabs.status = 'TAB_ALL';
		},
		openDel(item) {
			this.currentItem = item;
			this.$refs.del.open();
		},
		openDownload(items) {
			this.currentItem = items;
			this.$refs.download.open();
		},
		async saveConfirm() {
			const Api = this.radioValue == 0 ? downloadAllSup : downloadCurrentSup;

			const params = {
				id: this.currentItem.id,
				supplementAgreementType: 'OFFLINE'
			};
			const res = await Api(params);
			if (this.radioValue === 0) {
				const name = `${this.currentItem.currentContractType}-${this.currentItem.sellerCompanyName}-${this.currentItem.buyerCompanyName}-${this.currentItem.contractNo}-${this.currentItem.signDate}.zip`;
				comDownload(res, '', name);
			} else {
				const name = `线下补充协议-${this.currentItem.serialNo}-${this.currentItem.sellerCompanyName}-${this.currentItem.buyerCompanyName}.pdf`;
				comDownload(res, '', name);
			}
			this.$refs.download.close();
		},

		async saveDel() {
			const params = {
				id: this.currentItem.id
			};
			await delOnlineSupp(params);
			this.$message.success('删除成功');
			this.$refs.del.close();
			this.getList();
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
		.column-flex2::after {
			content: '';
			opacity: 0;
		}
		.label {
			display: inline-block;
			margin-bottom: 10px;
			color: rgba(0, 0, 0, 0.4);
		}
	}
	/deep/ .ant-table-thead > tr {
		background: #f3f5f6;
	}
	::v-deep .ant-table-tbody > tr > td:first-child {
		padding-left: 12px;
	}
	::v-deep .ant-table-tbody > tr > td:nth-child(2) {
		padding-left: 12px;
	}
	::v-deep .ant-table-thead > tr > th {
		padding: 10px 20px;
	}
	::v-deep .ant-table-thead > tr > th:first-child {
		padding-left: 12px;
	}
	::v-deep .ant-table-thead > tr > td:nth-child(2) {
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
.sup-item {
	display: flex;
	align-items: center;
	margin-bottom: 10px;
	color: rgba(0, 0, 0, 0.8);
	span:first-child {
		display: inline-block;
		color: rgba(0, 0, 0, 0.4);
	}
}
.opacity {
	opacity: 0;
}
.radio-box {
	color: rgba(0, 0, 0, 0.8);

	/deep/ .ant-radio-inner::after {
		background: #fff;
	}
	/deep/ .ant-radio-checked .ant-radio-inner {
		background: @primary-color;
	}
}

.AUDITING {
	background: #ffdac8 !important;
	color: #ff7937 !important;
}
.EXECUTING {
	background: #c1d7ff !important;
	color: #4682f3 !important;
}
.DRAFT {
	background: #ffdbdb !important;
	color: #dd4444 !important;
}
.CONFIRM_WAIT_SIGN_SEAL,
.SINGLE_SIGN,
.PENDING_APPROVAL_AUDITING,
.DOUBLE_SIGN_AUDITING,
.COMPLETED {
	background: #c5ecdd !important;
	color: #3eb384 !important;
}
.WAIT_CONFIRM {
	background: #c9d9ff !important;
	color: #596fa0 !important;
}
.TERMINATED {
	background: #e0e0e0 !important;
	color: rgba(0, 0, 0, 0.25) !important;
}

.FREEZING {
	background: #f8dde8 !important;
	color: #db81a5 !important;
}
//“驳回”、“退回”、“作废”
.REJECT,
.CANCEL,
.PENDING_AUDITING_REJECT,
.DOUBLE_SIGN_AUDITING_REJECT,
.APPROVAL_FAIL,
.CANCELLATION,
.INITIATOR_CANCEL,
.RECEIVER_REJECT {
	background: #f2d0d0 !important;
	color: #dd4444 !important;
}
.WAIT_SIGN_SEAL,
.AUDITING_RECEIVE {
	background: #d3dffb !important;
	color: #4682f3 !important;
}
.WAIT_COMPLETE {
	background: #c2e6ff !important;
	color: #649dc7 !important;
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
				width: 300px;
			}
			td:nth-child(2) {
				width: 360px;
			}
			td:nth-child(3) {
				width: 148px;
			}
			td:nth-child(4) {
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
			th:nth-child(3) {
				width: 148px;
			}
			th:nth-child(4) {
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
				width: 315px;
			}
			td:nth-child(2) {
				width: 370px;
			}
			td:nth-child(3),
			td:nth-child(4) {
				width: 148px;
			}
			td:nth-child(3) {
				width: 148px;
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
				width: 315px;
				padding-left: 12px !important;
			}
			th:nth-child(2) {
				width: 370px;
				padding-left: 12px !important;
			}

			th:nth-child(3) {
				width: 148px;
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
				width: 500px !important;
			}
			td:nth-child(3) {
				width: 148px;
			}
		}
		::v-deep .ant-table-thead > tr {
			th:first-child {
				width: 400px;
			}
			th:nth-child(2) {
				width: 500px !important;
			}
			th:nth-child(3) {
				width: 148px;
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
			td:first-child,
			td:nth-child(2) {
				width: 600px !important;
				padding-left: 12px !important;
			}
			td:last-child {
				width: auto !important;
				// width: 148px!important;
			}
			td:nth-child(3) {
				width: auto !important;

				// width: 148px ! important;
			}
		}
		::v-deep .ant-table-thead > tr {
			& > th {
				padding: 10px 30px !important;
			}
			th {
				width: auto !important;
			}
			th:first-child,
			th:nth-child(2) {
				width: 600px !important;
				padding-left: 12px !important;
			}
			th:last-child {
				// width: 148px!important;
				width: auto !important;
			}
			th:nth-child(3) {
				width: auto !important;
				// width: 148px !important;
			}
		}
	}
}
// >=2048px
@media screen and (min-width: 2048px) {
	.new-table {
		::v-deep .ant-table-tbody > tr {
			td:first-child,
			td:nth-child(2) {
				width: 800px !important;
			}
			td:last-child,
			td:nth-child(2) {
				width: auto !important;
			}
		}
		::v-deep .ant-table-thead > tr {
			th:first-child,
			th:nth-child(2) {
				width: 800 !important;
			}

			th:last-child,
			th:nth-child(3) {
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
			td:first-child,
			td:nth-child(2) {
				width: 1000px !important;
			}
		}
		::v-deep .ant-table-thead > tr {
			& > th {
				padding: 10px 50px !important;
			}
			th:first-child,
			th:nth-child(2) {
				width: 1000px !important;
			}
		}
	}
}
.contractTypeSymbol {
	display: inline-block;
	width: 18px;
	height: 18px;
	background: @primary-color;
	color: #fff;
	text-align: center;
	line-height: 18px;
	border-radius: 4px;
	font-style: normal;
	font-size: 14px;
	position: relative;
	top: 0px;
	margin-right: 12px;
}
.contractTypeSymbol.SELL {
	background: #ff800f;
}
.omit {
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
	display: inline-block;
	vertical-align: bottom;
}
</style>
