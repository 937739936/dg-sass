<template>
	<div class="slMain">
		<a-card :bordered="false">
			<div
				slot="title"
				class="slTitle"
				>{{$route.meta.title}}
        <div class="btn-box-title">
          <div
            class="btn"
            @click="add"
						v-auth="'logicDeliverMonitor:contractManager:deliver:add'"
          >
            <img
              class="icon"
              src="@/v2/assets/imgs/contract/add_contract_icon.png"
              alt=""
            />
            <span>新增运输合同</span>
          </div>
        </div>
      </div>
        
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
									<span>{{ items.paperContractNo || '-' }}</span>
									<Copy class="copy-icon" v-show="!items.copyContractNoVisible"></Copy>
									<span
										v-show="items.copyContractNoVisible"
										v-clipboard:success="onCopy" 
										v-clipboard:error="onError"  
										v-clipboard:copy="items.paperContractNo"
										class="copy-icon"
										>
										<CopyNow ></CopyNow>
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
                class="contract-info-desc"
              >
                <a-col :span="24">
                  <p>
                    <span class="label">托运人：</span>
                    <TextOverFlow
                      :content="items.buyerName || '-'"
                      :maxWidth="maxWidth"
                    />
                  </p>
                  <p>
                    <span class="label">承运人</span>
                    <TextOverFlow
                      :content="items.sellerName || '-'"
                      :maxWidth="maxWidth"
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
          v-show="pagination.total > 10"
          @change="getList"
        />
      </div>
    </a-card>
	</div>
</template>

<script>
import { ListMixin } from '@/v2/components/mixin/ListMixin';
import { 
	API_contractlist,
	API_contractListExport,
	API_contract_Amount,
	API_contract_delete,
	API_downloadAllTransContractAttachment
} from '@/v2/center/trade/api/transportContract';
import { mapGetters, mapMutations } from 'vuex';
import { getPopupContainer } from '@/v2/utils/factory.js';
import TextOverFlow from "@sub/components/TextOverflow.vue";
import comDownload from '@sub/utils/comDownload.js';
import { getContractAction } from '@/v2/center/logisticSupervise/views/contract/action';
import Tabs from '@/v2/center/trade/views/contract/components/Tabs';
import { isEqual } from 'lodash';
import { formatMoney } from '@sub/filters';
import { ExportIcon, Copy, CopyNow, Arrow } from '@sub/components/svg'
const searchList = [
	{
		decorator: ['paperContractNo'],
		addonBeforeTitle: '运输合同编号',
		type: 'input',
		placeholder: '请输入运输合同编号'
	},
	{
		decorator: ['contractSignTime'],
		addonBeforeTitle: '签订日期',
		type: 'rangePicker',
		placeholder: '请选择签订日期',
    realKey: ['contractSignTimeStart', 'contractSignTimeEnd']
	},
	{
		decorator: ['execDate'],
		addonBeforeTitle: '合同有效期',
		type: 'rangePicker',
		placeholder: '请选择合同有效期',
    realKey: ['execDateStart', 'execDateEnd']
	},
	{
		decorator: ['transportMode'],
		addonBeforeTitle: '运输方式',
		type: 'select',
		placeholder: '请选择运输方式',
		options: [
			{ label: '火运', value: 'TRAIN' },
			{ label: '汽运', value: 'AUTOMOBILE' },
			{ label: '船运', value: 'SHIP' }
		]
	},
  {
		decorator: ['companyName'],
		addonBeforeTitle: '企业名称',
		type: 'input',
		placeholder: '请输入承运人或托运人名称'
	},
];
const contractColumns = [
	{ title: '合同信息', dataIndex: 'contractInfo', scopedSlots: { customRender: 'contractInfo' } },
	{ title: '付款进度', dataIndex: 'paid', scopedSlots: { customRender: 'paid' }, ellipsis: true },
	{ title: '结算进度', dataIndex: 'settled', scopedSlots: { customRender: 'settled' } },
	{ title: '开票进度', dataIndex: 'invoiced', scopedSlots: { customRender: 'invoiced' } }
];

export default {
	mixins: [ListMixin],
	data() {
		return {
			contractColumns,
			getPopupContainer,
			url: {
				list: API_contractlist
			},
			columns: [],
			searchList,
			defaultParams: {
				productCode: 'LOGIC_DELIVER'
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
			cancelId: null, // 作废合同id
			maxWidth: 0, // 合同信息左边文案最大宽度
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
	components: {
		TextOverFlow,
		Tabs,
		ExportIcon, Copy, CopyNow, Arrow 
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
			this.columns = this.contractColumns.concat(arr);
		},
		// 获取合同信息字段的最小宽度
		getmaxWidth() {
			if (this.clientWidth <= 1440) {
				this.maxWidth = 200;
			} else if (this.clientWidth < 1560) {
				this.maxWidth = 223;
			} else if (this.clientWidth < 1920) {
				this.maxWidth = 260;
			} else if (this.clientWidth < 2160) {
				this.maxWidth = 330;
			} else if (this.clientWidth < 3000) {
				this.maxWidth = 362;
			} else {
				this.maxWidth = 573;
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
			let actionList = getContractAction(
				items,
				this.VUEX_ST_COMPANYSUER,
				this.VUEX_ST_USERAUTH
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
			let that = this
			setTimeout(() => {
				if(typeof that[func] == "function"){
					that[func](items);
				}
			}, 500);
		},
		// 回调查询
		searchSubmit() {
			this.searchParams.pageNo = this.pagination.pageNo;
			this.changeSearch(this.searchParams);
		},

		exportFunc() {
			const params = {
				...this.defaultParams,
				...this.searchParams
			};
			params.statusList = params.statusList?.join(',');
			API_contractListExport(params)
				.then(res => {
					comDownload(
						res,
						undefined,
						'运输合同-' +
							this.VUEX_ST_COMPANYSUER.companyName +
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
		resetFunc() {
			this.defaultParams.tabType = '';
			this.defaultParams.statusList = null
			this.$refs.Tabs.status = 'TAB_ALL';
		},
    add() {
      this.$router.push('/center/logisticSupervise/contract/transport/add')
    },
		contractDetail(items) {
			this.$router.push({
				path: '/center/logisticSupervise/contract/transport/detail',
				query: {
					id: items.id
				}
			})
		},
		eidtContract(items) {
			this.$router.push({
				path: '/center/logisticSupervise/contract/transport/add',
				query: {
					id: items.id
				}
			})
		},
		cancelContract(items) {
			this.$confirm({
        content: "确定要删除当前合同吗？删除后将无法恢复。",
        onOk: () => {
          API_contract_delete({
            id: items.id,
          }).then((res) => {
            if (res.success && res.data) {
              this.$message.success("删除成功");
              this.getList();
            }
          });
        },
      });
		},
		downloadContractFile(items) {
			let zipFileName =
				items.sellerName +
				'_' +
				items.buyerName +
				'_' +
				items.paperContractNo +
				'_' +
				items.contractSignTime +
				'.zip';
			//压缩包命名规则：承运人_托运人_合同编号_签订日期
			API_downloadAllTransContractAttachment({ id: items.id }).then(res => {
				comDownload(res, undefined, zipFileName);
			});
		},
		toPay(items) {
			this.$router.push({
				path: '/center/logisticSupervise/paymentManage/add',
				query: {
					type: 'add',
					serialNo: items.contractNo,
					contractId: items.contractId,
					productCode: items.productCode,
					contractType: 'TRANSPORT'
				}
			})
		},
		toSettle(items) {
			this.$router.push({
				path: '/center/logisticSupervise/statement/transSettle/add',
				query: {
					contractId: items.id,
				}
			})
		},
		toInvoice(items) {
			this.$router.push({
				path: '/center/logisticSupervise/invoice/freight/add',
				query: {
					type: 'freight',
					orderNo: items.contractNo
				}
			})
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
	/deep/ .ant-card-head .ant-card-head-title {
		border-bottom: 1px solid #e5e6eb;
		padding-bottom: 20px;
	}
}
.btn-box-title {
  display: flex;
  align-items: center;
  float: right;
  & > .btn {
    height: 32px;
    background: @primary-color;
    border-radius: 4px;
    font-size: 14px;
    font-family:
      PingFangSC-Regular,
      PingFang SC;
    font-weight: 400;
    color: #ffffff;
    line-height: 22px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 10px;
    .icon {
      width: 18px;
      vertical-align: middle;
      margin-right: 10px;
    }
  }
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
						top: 1px;
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
		::v-deep.ant-progress-status-success .ant-progress-bg {
			background-color: #1890ff !important;
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
			background: url('~@/v2/assets/imgs/contract/percent_bg.png') no-repeat 100% / cover;
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
				width: 340px;
			}
		}
		::v-deep .ant-table-thead > tr {
			& > th:last-child {
				padding: 10px 10px;
			}
			th:first-child {
				width: 340px;
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
				width: 320px;
			}
		}
		::v-deep .ant-table-thead > tr {
			& > th {
				padding: 10px 20px !important;
			}
			th:nth-child(1) {
				width: 320px;
				padding-left: 12px !important;
			}
		}
	}
}
// >=1560px
@media screen and (min-width: 1560px) {
	.new-table {
		::v-deep .ant-table-tbody > tr {
			td:first-child {
				width: 380px;
			}
		}
		::v-deep .ant-table-thead > tr {
			th:first-child {
				width: 380px;
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
				padding-left: 12px !important;
			}
		}
		
		::v-deep .ant-table-thead > tr {
			& > th {
				padding: 10px 30px !important;
			}
			th {
				width: auto !important;
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
