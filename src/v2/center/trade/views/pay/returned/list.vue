<template>
	<div class="slMain">
		<a-card :bordered="false">
			<div class="methods-wrap">
				<span
					slot="title"
					class="slTitle"
					>回款管理</span
				>
				<a-button
					type="primary"
					v-if="VUEX_ST_COMPANYSUER.companyType === 'CORE_COMPANY' && isEditAuth"
					@click="add"
				>
					<span style="font-size: 14px">新增回款</span>
				</a-button>
			</div>

			<SlFormNew
				:list="searchList"
				layout="inline"
				style="margin-top: 14px"
				@change="handleChange"
				@resetFunc="resetFunc"
			></SlFormNew>

			<Tabs
				:statusData="statusData"
				@callback="changeTab"
				@export="exportData"
				:info="errorInfo"
				:tabsNum="tabs"
				style="margin-top: 14px"
				:currentStatus="defaultParams.claimResult"
				ref="tab"
				@look="openOaModal"
			></Tabs>
			<div
				:class="'table-box ' + (pagination.total > 10 ? 'fixedBottom' : '')"
				style="margin-top: 20px"
			>
				<a-table
					:columns="columns"
					:rowKey="record => record.id"
					:dataSource="dataSource"
					:pagination="false"
					:loading="loading"
					class="new-table"
					:scroll="{ x: true }"
				>
					<template
						slot="claimResultDesc"
						slot-scope="action, item"
					>
						<span
							class="status-common"
							:class="item.claimResult"
							v-if="item.claimResult"
							>{{ item.claimResultDesc }}</span
						>
						<span v-else>-</span>
					</template>
					<template
						slot="receiveName"
						slot-scope="action, item"
					>
						<div
							class="payment-box"
							v-if="item.receiveName"
						>
							<span class="payment-box-name">{{ item.receiveName }}</span>
							<a-tooltip :overlayStyle="{ maxWidth: 'inherit !important' }">
								<template slot="title">
									<p>
										<span>名称：</span><span>{{ item.receiveName }}</span>
									</p>
									<p>
										<span>开户行：</span><span>{{ item.receiveAccountBank }}</span>
									</p>
									<p>
										<span>账号：</span><span>{{ formatAccountNumber(item.receiveAccount) }}</span>
									</p>
								</template>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="12"
									viewBox="0 0 16 12"
									fill="none"
									style="cursor: pointer"
								>
									<path
										d="M3.55208 5.53125C3.11025 5.53125 2.75208 5.88942 2.75208 6.33125C2.75208 6.77308 3.11025 7.13125 3.55208 7.13125H5.95208C6.3939 7.13125 6.75208 6.77308 6.75208 6.33125C6.75208 5.88942 6.3939 5.53125 5.95208 5.53125H3.55208Z"
										fill="var(--primary-color)"
									/>
									<path
										fill-rule="evenodd"
										clip-rule="evenodd"
										d="M2 0C0.895431 0 0 0.895431 0 2V10C0 11.1046 0.895431 12 2 12H14C15.1046 12 16 11.1046 16 10V2C16 0.895431 15.1046 0 14 0H2ZM14 1.6H2C1.77909 1.6 1.6 1.77909 1.6 2V2.92578H14.4V2C14.4 1.77909 14.2209 1.6 14 1.6ZM1.6 10V4.52578H14.4V10C14.4 10.2209 14.2209 10.4 14 10.4H2C1.77909 10.4 1.6 10.2209 1.6 10Z"
										fill="var(--primary-color)"
									/>
								</svg>
							</a-tooltip>
						</div>
					</template>
					<div
						slot="action"
						slot-scope="action, item"
					>
						<div>
							<a @click="goDetail(item)">详情 </a>
							<!-- 手工录入     企业管理员和业务员可以修改-->
							<a
								@click="goEdit(item)"
								v-if="item.dataSource == 2 && isEditAuth && item.editBtnBoo"
								style="margin-left: 20px"
								>修改
							</a>
							<a
								@click="delModal(item)"
								v-if="item.delBtnBoo"
								style="margin-left: 20px"
								>删除
							</a>
						</div>
					</div>
				</a-table>
				<i-pagination
					:pagination="pagination"
					@change="getList"
					v-show="params.pageSize < pagination.total"
				/>
			</div>
			<OaErrorModal
				ref="oaErrorModal"
				:Fn="getCollectionOaWarmList"
			></OaErrorModal>
			<DelModal
				ref="delModal"
				tip="确认要删除该笔回款流水吗，删除后无法恢复"
				title="确认删除"
				@save="saveDel"
			></DelModal>
		</a-card>
	</div>
</template>

<script>
import { getCollectionOaWarmList } from '@/v2/center/trade/api/collectionFlow';

import {
	getReturnedList,
	getReturnedTabNum,
	exportReturnedData,
	delReturnedData,
	getOaCollectionWarnInfo
} from '@/v2/center/trade/api/pay';

import { colSpan, formLayout } from '@/v2/config/layoutConfig';
import iPagination from "@sub/components/iPagination";
import { getPopupContainer } from '@/v2/utils/factory.js';
import { mapGetters } from 'vuex';
import { ListMixin } from '@/v2/components/mixin/ListMixin';
import { isEqual } from 'lodash';
import moment from 'moment';
import { filterCodeByKey } from '@sub/utils/globalCode.js';

import Tabs from '@sub/trade/pay/Tabs.vue';

import OaErrorModal from '@sub/trade/pay/OaErrorModal.vue';
import comDownload from '@sub/utils/comDownload.js';
import DelModal from '../components/DelModal.vue';
import { formatAccountNumber } from '@sub/utils/factory.js';

import { formatMoney } from '@sub/filters';

const columns = [
	{
		title: '回款编号',
		dataIndex: 'receiveSerialNo'
	},

	{
		title: '回款方',
		dataIndex: 'paymentCompanyName',
		width: 200
	},
	{
		title: '回款日期',
		dataIndex: 'receiveDate',
		customRender: text => {
			return text ? moment(text).format('YYYY-MM-DD') : '-';
		}
	},
	{
		title: '回款金额(元)',
		dataIndex: 'receiveAmount',
		customRender: txt => formatMoney(txt, 2)
	},
	{
		title: '已认领金额(元)',
		dataIndex: 'claimAmount',
		customRender: txt => formatMoney(txt, 2)
	},
	{
		title: '可认领余额(元)',
		dataIndex: 'notClaimedAmount',
		customRender: txt => formatMoney(txt, 2)
	},
	{
		title: '收款账号',
		dataIndex: 'receiveName',
		scopedSlots: { customRender: 'receiveName' },
		width: 250
	},

	{
		title: '认领状态',
		dataIndex: 'claimResultDesc',
		scopedSlots: { customRender: 'claimResultDesc' },
		fixed: 'right'
	},

	{
		title: '操作',
		dataIndex: 'action',
		fixed: 'right',
		scopedSlots: { customRender: 'action' }
	}
];

const searchList = [
	{
		decorator: ['keyNo'],
		addonBeforeTitle: '编号',
		type: 'input',
		placeholder: '请输入订单、合同、业务线、回款编号'
	},
	{
		decorator: ['paymentCompanyName'],
		addonBeforeTitle: '回款方',
		type: 'input',
		placeholder: '请输入回款方'
	},
	{
		decorator: ['receiveName'],
		addonBeforeTitle: '收款账号',
		type: 'input',
		placeholder: '请输入收款账号'
	},
	{
		decorator: ['issuedDate'],
		addonBeforeTitle: '回款日期',
		type: 'rangePicker',
		realKey: ['collectionDateStart', 'collectionDateEnd']
	},
	{
		decorator: ['collectionType'],
		addonBeforeTitle: '回款方式',
		type: 'select',
		placeholder: '请选择回款方式',
		// options: filterCodeByKey('collectionMode'),
		options: filterCodeByKey('collectionTypeDict')
			.filter(item => item.value != 'ERROR')
			.map(item => {
				return { value: item.value, label: item.text };
			})
	},
	{
		decorator: ['dataSource'],
		addonBeforeTitle: '数据来源',
		type: 'select',
		placeholder: '请选择数据来源',
		options: [
			{ label: 'OA同步', value: '1' },
			{ label: '手工录入', value: '2' },
			{ label: '银行同步', value: '3' }
		]
	}
];

export default {
	mixins: [ListMixin],
	name: 'CollectionClaimTable',
	data() {
		return {
			searchList,
			columns,
			colSpan,
			formLayout,
			getPopupContainer,
			form: this.$form.createForm(this),
			dataSource: [],
			params: {
				pageSize: 10
			},
			paramsTwo: {},
			loading: false,
			statusData: [
				{ value: 'ALL', label: '全部' },
				{ value: 'INIT', label: '未认领', stateNum: 0 },
				{ value: 'PART_CLAIM', label: '部分认领', stateNum: 0 },
				{ value: 'CLAIMED', label: '已认领' }
			],
			currentItem: {},
			errorInfo: {},
			tabs: [],
			currentStatus: ''
		};
	},

	components: {
		iPagination,
		Tabs,
		OaErrorModal,
		DelModal
	},

	computed: {
		...mapGetters('config', {
			VUEX_ST_ALLCODE: 'VUEX_ST_ALLCODE'
		}),
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER',
			VUEX_ST_PERSONALLINFO: 'VUEX_ST_PERSONALLINFO'
		}),
		isEditAuth() {
			const { roles } = this.VUEX_ST_COMPANYSUER;
			return roles.some(el => el.code == 'ADMIN' || el.code == 'OPERATOR');
		}
		// VUEX_ST_COMPANYSUER.companyType === 'CORE_COMPANY'
	},
	mounted() {
		this.getOaCollectionWarnInfo();
		this.getReturnedTabNum();
	},

	methods: {
		formatAccountNumber,
		formatMoney,
		getCollectionOaWarmList,
		resetFunc() {
			this.defaultParams.claimResult = 'ALL';
			this.params = {
				pageSize: 10
			};
			this.searchParams = {};
			this.pagination.pageNo = 1;
			this.getList();
			this.getReturnedTabNum();
		},
		handleChange(data) {
			if (isEqual(data, this.searchParams)) {
				return;
			}
			this.searchParams = data;
			this.changeSearch(data);
			this.getReturnedTabNum();
		},
		getList(pageNo = this.pagination.pageNo, pageSize = this.pageSize) {
			this.pageSize = pageSize;
			this.pagination.pageNo = pageNo;
			this.params.pageNo = pageNo;
			this.params.pageSize = pageSize;
			this.loading = true;
			const params = {
				...this.params,
				...this.searchParams,
				...this.defaultParams
			};
			if (params.claimResult == 'ALL') {
				params.claimResult = '';
			}
			getReturnedList(params)
				.then(res => {
					const data = res.result || res.data;
					this.dataSource = data.records;
					this.pagination.total = data.total;
				})
				.finally(() => {
					this.loading = false;
				});
		},
		changeTab(status) {
			this.defaultParams.claimResult = status;
			this.pagination.pageNo = 1;
			this.search();
		},

		async getReturnedTabNum() {
			const params = {
				...this.params,
				...this.pagination,

				...this.searchParams,
				...this.defaultParams
			};
			if (params.claimResult == 'ALL') {
				params.claimResult = '';
			}

			const res = await getReturnedTabNum(params);

			const list = res.data || [];
			let newList = [];
			const info = {
				ALL: '全部',
				INIT: '未认领',
				PART_CLAIM: '部分认领',
				CLAIMED: '已认领'
			};

			newList = list.map(el => {
				return {
					label: info[el.tabType],
					value: el.tabType,
					...el
				};
			});

			this.statusData = newList;

			this.tabs = res.data;

			this.$forceUpdate();
		},
		// 获取异常数据信息
		async getOaCollectionWarnInfo() {
			const res = await getOaCollectionWarnInfo();
			this.errorInfo = res.data;
		},

		search() {
			this.pagination.pageNo = 1;
			this.getList();
		},

		reset() {
			this.params = {
				pageSize: 10
			};
			this.defaultParams.claimResult = 'ALL';
			this.pagination.pageNo = 1;
			this.getList();
		},

		delModal(item) {
			this.currentItem = item;
			this.$refs.delModal.open();
		},
		goDetail(item) {
			this.$router.push({
				path: '/center/fund/returned/detail',
				query: {
					receiveSerialNo: item.receiveSerialNo
				}
			});
		},
		goEdit(item) {
			this.$router.push({
				path: '/center/fund/returned/add',
				query: {
					receiveSerialNo: item.receiveSerialNo,
					id: item.id
				}
			});
		},

		//作废
		async saveDel() {
			const params = {
				receiveSerialNo: this.currentItem.receiveSerialNo
			};
			await delReturnedData(params);
			this.$message.success('删除成功');
			this.$refs.delModal.close();
			this.getList();
			// });
		},
		async exportData() {
			const params = {
				...this.searchParams,
				...this.defaultParams
			};
			const res = await exportReturnedData(params);
			const name = `回款数据-${this.VUEX_ST_COMPANYSUER.companyName}-${moment().format('YYYY-MM-DD')}.xls`;
			comDownload(res, undefined, name);
		},
		openOaModal() {
			this.$refs.oaErrorModal.show();
		},
		add() {
			this.$router.push('/center/fund/returned/add');
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
/deep/ .ant-tooltip {
	max-width: inherit !important;
}
</style>
<style lang="less" scoped>
.search-wrap {
	padding: 20px 0 0 20px;
	margin: 15px 0;
	background-color: #fff;
	::v-deep.ant-form-item-label {
		padding-right: 30px;
	}
}
.setting-icon {
	display: inline-block;
	margin-left: 2px;
	font-size: 15px;
}
.s-card {
	font-family: PingFangSC-Regular;
	font-size: 14px;
	color: #141517;
}
.s-card-title {
	margin-left: 16px;
	background-color: #fff;
}
::v-deep.ant-table-wrapper {
	width: 100%;
}
.table-wrap {
	background-color: #fff;
	padding: 16px 20px;
	.ant-btn {
		margin-bottom: 10px;
	}
	::v-deep.ant-pagination {
		margin-top: 0;
	}
}
.ant-tabs-tabpane > div {
	width: 100%;
}
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
.payment-box {
	display: flex;
	align-items: center;
	&-name {
		max-width: 200px;
		display: inline-block;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		margin-right: 5px;
	}
}
.status-common {
	border-radius: 4px;
	background: #c1d7ff;
	display: inline-flex;
	padding: 1px 6px;
	align-items: flex-start;
	gap: 10px;
	color: #4682f3;
	font-family: PingFang SC;
	font-size: 12px;
	height: inherit !important;
}
.PART_CLAIM {
	background: #ffdac8;
	color: #ff7937;
}
.CLAIMED {
	color: #3eb384;
	background: #c5ecdd;
}
.bank {
	max-width: inherit;
}
</style>
