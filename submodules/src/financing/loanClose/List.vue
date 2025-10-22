<template>
	<div class="slMain">
		<a-card :bordered="false">
			<div class="methods-wrap">
				<span
					slot="title"
					class="slTitle"
					>贷后结清管理</span
				>
			</div>
			<SlFormNew
				:list="searchList"
				layout="inline"
				style="margin: 10px 0"
				@change="handleChange"
				@resetFunc="resetFunc"
			></SlFormNew>
			<div class="tab-box">
				<Tab
					:list="statusData"
					class="tab"
          :tabNum="tabNum"
					@change="changeTab"
				></Tab>
				<a-button
					type="primary"
					class="btn"
					@click="openModal"
					>查看未生成协议融资 <span v-if="unClearTotal">({{unClearTotal}})</span> </a-button
				>
			</div>
			<div :class="'table-box ' + (pagination.total > 10 ? 'fixedBottom' : '')">
				<a-table
					class="new-table"
					:row-selection="rowSelection"
					:pagination="false"
					:columns="columns"
					:data-source="listDataSource"
					:scroll="{ x: true }"
					rowKey="id"
					:loading="loading"
				>
					<template
						slot="status"
						slot-scope="text, record"
					>
						<span
							class="status"
							:class="record.status"
							>{{ record.statusDesc }}</span
						>
					</template>
					<div
						slot="repayAmount"
						slot-scope="text"
					>
						<a-tooltip>
							<template slot="title">{{ convertCurrency(text) }} </template>
							￥{{ formatMoney(text) }}
						</a-tooltip>
					</div>
					<div
						slot="repayInterest"
						slot-scope="text"
					>
						<a-tooltip>
							<template slot="title">{{ convertCurrency(text) }} </template>
							￥{{ formatMoney(text) }}
						</a-tooltip>
					</div>

					<template
						slot="action"
						slot-scope="text, record"
					>
						<template v-if="isBank">
							<a-space>
								<a
									href="javascript:;"
									@click="gotoDetail(record)"
									>详情</a
								>
								<a
									href="javascript:;"
									@click="gotoSign(record)"
									v-auth="'finance:afterLoan:settleAgree:seal'"
									v-if="record.status == 'WAIT_TO_BANK_SEAL'"
								>
									盖章</a
								>
								<a
									href="javascript:;"
                  style="margin-left:14px"
									v-if="!['WAIT_TO_BANK_SEAL'].includes(record.status)"
									@click="download(record)"
									>下载</a
								>
								<a-tooltip
									overlayClassName="more-btn-tooltips"
									placement="left"
									v-if="['WAIT_TO_BANK_SEAL'].includes(record.status)"
									:getPopupContainer="getPopupContainer"
								>
									<template slot="title">
										<a
											href="javascript:;"
											@click="download(record)"
											>下载</a
										>
										<!-- 待接收方盖章 -->
										<a
											href="javascript:;"
											@click="cancellation(record)"
											>作废</a
										>
									</template>
									<a href="javascript:;">
										<span>更多</span>
										<em class="right-arrow"></em>
									</a>
								</a-tooltip>
							</a-space>
						</template>
						<template v-if="!isBank && type == 'rest'">
							<a-space>
								<a
									href="javascript:;"
									@click="gotoDetail(record)"
									>详情</a
								>
								<a
									href="javascript:;"
									@click="gotoSign(record)"
									v-auth="'finance:afterLoan:settleAgree:seal'"
									v-if="record.status == 'WAIT_TO_SEAL'"
								>
									盖章</a
								>
								<a
									href="javascript:;"
                  style="margin-left:14px"
									v-if="!['WAIT_TO_SEAL'].includes(record.status)"
									@click="download(record)"
									>下载</a
								>
								<a-tooltip
									overlayClassName="more-btn-tooltips"
									placement="left"
									v-if="['WAIT_TO_SEAL'].includes(record.status)"
									:getPopupContainer="getPopupContainer"
								>
									<template slot="title">
										<a
											href="javascript:;"
											@click="download(record)"
											>下载</a
										>
										<!-- 待接收方盖章 -->
										<a
											href="javascript:;"
											@click="cancellation(record)"
											>作废</a
										>
									</template>
									<a href="javascript:;">
										<span>更多</span>
										<em class="right-arrow"></em>
									</a>
								</a-tooltip>
							</a-space>
						</template>
						<template v-if="type == 'admin'">
							<a-space>
								<a
									href="javascript:;"
									@click="gotoDetail(record)"
									>详情</a
								>
								<a
									href="javascript:;"
									@click="download(record)"
									>下载</a
								>
							</a-space>
						</template>
					</template>
				</a-table>
			</div>
			<div
				class="batch"
				v-if="selectedRowKeys.length"
			>
				<a-button
					type="primary"
					@click="batchSign"
					class="btn"
					v-auth="'finance:afterLoan:settleAgree:seal'"
					>批量盖章</a-button
				>
				<a-button
					type="primary"
					class="btn"
					@click="batchDownload"
					>批量下载</a-button
				>
			</div>
			<i-pagination
				:pagination="pagination"
				@change="getList"
			/>
		</a-card>
		<a-modal
			class="slModal cancel-modal"
			:visible="visible"
			:width="460"
			@cancel="visible = false"
			title="确认作废？"
		>
			<div class="tip"><span class="red">*</span> 请输入作废原因：</div>
			<a-textarea
				v-model="reason"
				style="border: 0"
				placeholder="请输入作废原因,最多200字"
				:maxLength="200"
			/>

			<template slot="footer">
				<a-button
					key="back"
					@click="visible = false"
					class="cancel-btn"
					>取消</a-button
				>
				<a-button
					type="primary"
					@click="confirmCancel"
					style="margin-left: 20px"
					>确定</a-button
				>
			</template>
		</a-modal>
	</div>
</template>

<script>
import SlFormNew from '@sub/components/ui-new/Form/sl-form';
import IPagination from '@sub/components/iPagination';
import Tab from './Tab.vue';
import { formatMoney } from '@sub/filters';
import { filterCodeByValueName, filterCodeByKey, convertCurrency } from '@sub/utils/globalCode.js';
import comDownload from '@sub/utils/comDownload';
import moment from 'moment';

import { getPopupContainer } from '@sub/utils/factory.js';

const searchList = [
	{
		decorator: ['integrationNo'],
		addonBeforeTitle: '编号',
		type: 'input',
		placeholder: '请输入结清协议编号、融资编号、保理合同编号'
	},
	{
		decorator: ['bankName'],
		addonBeforeTitle: '金融机构',
		type: 'input',
		placeholder: '请输入金融机构'
	},
	{
		decorator: ['endDate'],
		addonBeforeTitle: '签订日期',
		type: 'rangePicker',
		realKey: ['signDateBegin', 'signDateEnd']
	}
];
const searchListBank = [
	{
		decorator: ['integrationNo'],
		addonBeforeTitle: '编号',
		type: 'input',
		placeholder: '请输入结清协议编号、融资编号、保理合同编号'
	},
	{
		decorator: ['financier'],
		addonBeforeTitle: '融资方',
		type: 'input',
		placeholder: '请输入融资方'
	},
	{
		decorator: ['endDate'],
		addonBeforeTitle: '签订日期',
		type: 'rangePicker',
		realKey: ['signDateBegin', 'signDateEnd']
	}
];
const searchListAdmin = [
	{
		decorator: ['integrationNo'],
		addonBeforeTitle: '编号',
		type: 'input',
		placeholder: '请输入结清协议编号、融资编号、保理合同编号'
	},
	{
		decorator: ['bankName'],
		addonBeforeTitle: '金融机构',
		type: 'input',
		placeholder: '请输入金融机构'
	},
	{
		decorator: ['financier'],
		addonBeforeTitle: '融资方',
		type: 'input',
		placeholder: '请输入融资方'
	},
	{
		decorator: ['endDate'],
		addonBeforeTitle: '签订日期',
		type: 'rangePicker',
		realKey: ['signDateBegin', 'signDateEnd']
	}
];
const customRender = t => t || '-';
const columns = [
	{ title: '结清协议编号', dataIndex: 'serialNo', key: 'serialNo' },
	{ title: '融资编号', dataIndex: 'financingApplyNo', key: 'financingApplyNo' },
	{ title: '融资方', dataIndex: 'financier', key: 'financier' },
	{ title: '金融机构', dataIndex: 'bankName', key: 'bankName' },
	{ title: '签订日期', dataIndex: 'signDate', key: 'signDate' },
	{ title: '还款金额', dataIndex: 'repayAmount', key: 'repayAmount', scopedSlots: { customRender: 'repayAmount' } },
	{ title: '还款利息', dataIndex: 'repayInterest', key: 'repayInterest', scopedSlots: { customRender: 'repayInterest' } },
	{ title: '合同编号', dataIndex: 'contractNo', key: 'contractNo' },

	{ title: '状态', key: 'status', dataIndex: 'status', fixed: 'right', scopedSlots: { customRender: 'status' } },
	{ title: '操作', key: 'action', fixed: 'right', scopedSlots: { customRender: 'action' } }
];

export default {
	props: {
		type: {
			default: 'rest'
		},
		listApi: {},
		getLoanCloseStatistics: {},
		batchDownloadApi: {},
		invalidLoanClose: {},
    getUnClearList: {}
		// 未结清接口

		// 生成结清接口

		// 未结清统计
	},
	data() {
		return {
			pagination: {
				pageNo: 1,
				total: 0
			},
			pageSize: 10,
			listDataSource: [],
			tabNum: {},
			status: 'TAB_ALL',
			columns,
			loading: false,
			selectedRowKeys: [],
			currentItem: {},
			visible: false,
			reason: '',
      unClearTotal: 0,
		};
	},
	computed: {
		rowSelection() {
			const itSelf = this;
			const { selectedRowKeys } = this;
			return {
				type: 'checkbox',
				selectedRowKeys: selectedRowKeys,
				onChange: (selectedRowKeys, row) => {
					this.selectedRowKeys = selectedRowKeys;
				}
			};
		},
		VUEX_ST_COMPANYSUER() {
			if (this.$store.state.user) {
				return this.$store.state.user.VUEX_ST_COMPANYSUER || {};
			}
			return {};
		},
		// 判断当前是否是金融机构
		isBank() {
			return this.VUEX_ST_COMPANYSUER.companyType == 'FINANCIAL_ORG';
		},
		searchList() {
			if (this.isBank) {
				return searchListBank;
			}
			if (this.type == 'rest') {
				return searchList;
			}
			return searchListAdmin;
		},
    otherParams() {
      if(this.type == 'admin') {
        return {
          
        }
      }
			if(this.isBank) {
				return {
					pageSettlementAgreementQueryType: 'PAGE_REST_BANK'
				}
			}
			return {
				pageSettlementAgreementQueryType: 'PAGE_REST_RZ'
			};
		},
		statusData() {
			if (this.isBank) {
				return [
					{ value: 'TAB_ALL', label: '全部', isShowNum: false },
					{ value: 'TAB_BANK_OA_AUDITING', label: '待我方审核' },
					{ value: 'TAB_WAIT_TO_BANK_SEAL', label: '待我方盖章' },
					{ value: 'TAB_WAIT_TO_SEAL', label: '待融资方盖章', isShowNum: false  },
					{ value: 'TAB_EFFECTIVE', label: '已生效', isShowNum: false  },
					{ value: 'TAB_NOT_EFFECTIVE', label: '无效' , isShowNum: false }
				];
			}
			if (this.type == 'rest') {
				return [
					{ value: 'TAB_ALL', label: '全部',isShowNum: false  },
					{ value: 'TAB_WAIT_TO_SEAL', label: '待我方盖章' },
					{ value: 'TAB_BANK_OA_AUDITING', label: '待资方盖章',isShowNum: false },
					{ value: 'TAB_EFFECTIVE', label: '已生效', isShowNum: false },
					{ value: 'TAB_NOT_EFFECTIVE', label: '无效', isShowNum: false  }
				];
			}
			return [
				{ value: 'TAB_ALL', label: '全部',isShowNum: false  },
				{ value: 'TAB_WAIT_TO_SEAL', label: '待融资方盖章',isShowNum: false },
				{ value: 'TAB_BANK_OA_AUDITING', label: '待资方审核',isShowNum: false },
				{ value: 'TAB_WAIT_TO_BANK_SEAL', label: '待资方盖章',isShowNum: false},
				{ value: 'TAB_EFFECTIVE', label: '已生效',isShowNum: false },
				{ value: 'TAB_NOT_EFFECTIVE', label: '无效', isShowNum: false }
			];
		}
	},
	mounted() {
		this.getList();
    this.getUnClearTotal()
		this.getTabStatistics();
	},
	methods: {
		formatMoney,
		convertCurrency,
		getPopupContainer,
		resetFunc() {
			this.searchParams = {};
			this.status = 'TAB_ALL';
			this.pagination.pageNo = 1;
			this.pageSize = 10;
			this.getTabStatistics();
		},
		handleChange(data) {
			this.searchParams = data;
			this.getTabStatistics();
			this.getList();
		},
		async getList(pageNo = this.pagination.pageNo, pageSize = this.pageSize) {
			this.pagination.pageNo = pageNo;
			this.loading = true;
			this.pageSize = pageSize;
			const params = {
				...this.pagination,
				pageSize: this.pageSize,
				...this.searchParams,
        ...this.otherParams,
			};
      if(this.type == 'rest') {
        if(this.isBank) {
          params.settlementAgreementBankTabType = this.status
        } else {
           params.settlementAgreementRzTab = this.status
        }
        

      } else {
         params.settlementAgreementAdminTabType = this.status
      }
      

			try {
				const res = await this.listApi(params);
				this.loading = false;

				this.listDataSource = res.data.records;
				this.pagination.total = res.data.total;
			} catch (error) {
				this.loading = false;
			}
		},
		// 切换tab
		changeTab(val) {
			this.status = val;
			this.getTabStatistics();
			this.getList(1, 10);
		},
		async getTabStatistics() {
			if (!this.getLoanCloseStatistics) return;
			const params = {
				...this.searchParams,
         ...this.otherParams,
			};
      if(this.type == 'rest') {
        if(this.isBank) {
          params.settlementAgreementBankTabType = this.status
        } else {
           params.settlementAgreementRzTab = this.status
        }
        

      } else {
         params.settlementAgreementAdminTabType = this.status
      }
      

      


			const res = await this.getLoanCloseStatistics(params);
      const obj = {}
			const list = res.data || [];
			list.forEach(el => {
				obj[el.tabType] = el.stateNum;
			});
      this.tabNum = {...obj}
			this.$forceUpdate();
		},
		// 批量盖章
		batchSign() {
			if (!this.selectedRowKeys.length) {
				this.$message.error('请选择数据');
				return;
			}

			// 判断是否有待盖章的数据
			// 金融机构 判断是否有待我方盖章的数据
			let list = [];
			if (this.isBank) {
				list = this.listDataSource.filter(el => this.selectedRowKeys.includes(el.id));
				const flag = list.some(el => el.status == 'WAIT_TO_BANK_SEAL');
				if (!flag) {
					this.$message.error('当前选择的数据，没有需要盖章的数据');
					return;
				}
				this.$router.push({
					path: '/center/financing/loanClose/sign',
					query: {
						id: list
							.filter(el => el.status == 'WAIT_TO_BANK_SEAL')
							.map(el => el.id)
							.join(',')
					}
				});
			} else {
				list = this.listDataSource.filter(el => this.selectedRowKeys.includes(el.id));
				const flag = list.some(el => el.status == 'WAIT_TO_SEAL');
				if (!flag) {
					this.$message.error('当前选择的数据，没有需要盖章的数据');
					return;
				}
				this.$router.push({
					path: '/center/financing/loanClose/sign',
					query: {
						id: list
							.filter(el => el.status == 'WAIT_TO_SEAL')
							.map(el => el.id)
							.join(',')
					}
				});
			}
		},
		async batchDownload() {
			if (!this.selectedRowKeys.length) {
				this.$message.error('请选择数据');
				return;
			}
			const params = {
				settlementAgreementIdList: this.selectedRowKeys,
				toSealCompanyType: this.isBank ? 1 : 2
			};
			// 电子仓单管理协议-协议编号-企业名称简称-仓储企业简称
			const res = await this.batchDownloadApi(params);
			comDownload(res.data, null, res.name);
		},
		// 下载
		async download(item) {
			this.currentItem = item;
			const params = {
				settlementAgreementIdList: [item.id],
				toSealCompanyType: this.isBank ? 1 : 2
			};
			// 电子仓单管理协议-协议编号-企业名称简称-仓储企业简称
			const res = await this.batchDownloadApi(params);
			comDownload(res.data, null, res.name);
		},
		// 作废
		cancellation(item) {
      this.reason = ''
			this.currentItem = item;
			this.visible = true;
		},
		// 确认作废
		async confirmCancel() {
			if (!this.reason) {
				this.$message.error('请输入作废原因');
				return;
			}

			const params = {
				settlementAgreementIdList: [this.currentItem.id],
				toSealCompanyType: this.isBank ? 1 : 2,
				invalidReason: this.reason
			};
			const res = await this.invalidLoanClose(params);
			this.$message.success('操作成功');
			this.visible = false;
			this.pagination.pageNo = 1;
			this.getList();
			this.getTabStatistics();
		},
		// 签章
		gotoSign(record) {
			this.$router.push({
				path: '/center/financing/loanClose/sign',
				query: {
					id: record.id
				}
			});
		},
		gotoDetail(record) {
      let path = '/center/financing/loanClose/detail'
      if(this.type == 'admin') {
        path = '/data/loanafter/loanClose/detail'
      }
			this.$router.push({
				path,
				query: {
					id: record.id
				}
			});
		},
		openModal() {
			this.$emit('openModal');
		},
    async getUnClearTotal() {
      const params = {
        pageSize: 10,
        pageNo: 1,
      ...this.otherParams,
      }
      
      const res = await this.getUnClearList(params)
      this.unClearTotal = res.data.total || 0
    }
	},
	components: {
		SlFormNew,
		IPagination,
		Tab
	}
};
</script>
<style lang="less" scoped>
@import url('~@sub/style/table-cover.less');
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
</style>
<style scoped lang="less">
.tab-box {
	display: flex;
	justify-content: space-between;
	align-items: center;
	border-bottom: 1px solid #e8e8e8;
	/deep/ .ant-tabs-bar {
		border-color: transparent !important;
	}
	.btn {
		color: @primary-color;
		background: #fff;
	}
}
.batch {
	margin-top: 14px;
	.btn {
		color: @primary-color;
		background: #fff;
		margin-right: 14px;
	}
}
.cancel-modal {
	/deep/ .ant-modal-header {
		background: #fff;
	}
	/deep/ .ant-modal-body {
		padding-top: 0;
		padding-bottom: 10px;

		textarea {
			height: 180px;
			background: rgba(129, 145, 169, 0.1);
			font-size: 14px;
			color: #8191a9;
		}
	}
	/deep/ .ant-modal-footer {
		border-top: 0;
	}
	.cancel-btn {
		border-color: #c6cdd8;
	}
}
.tip {
	color: rgba(0, 0, 0, 0.4);
	font-size: 14px;
	margin-bottom: 20px;
}
.red {
	color: red;
}
.status {
	display: inline-block;
	padding: 1px 6px;
	align-items: flex-start;
	gap: 10px;
	text-align: center;
	border-radius: 4px;
	font-family: PingFang SC;
	font-size: 12px;
	margin-left: 4px;
	background: #d3dffb;
	color: #4682f3;
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
	vertical-align: middle;
}
.BANK_OA_AUDITING {
	background: #ffdac8;
	color: #ff7937;
}
.EFFECTIVE {
	background: #c5ecdd;
	color: #3eb384;
}
.WAIT_TO_SEAL {
	background: #c9d9ff;
	color: #596fa0;
}
.INVALID {
	background: #e0e0e0;
	color: rgba(0, 0, 0, 0.25);
}
.BANK_OA_REJECT {
	background: #f2d0d0;
	color: #dd4444;
}
</style>
