<template>
	<div class="slMain">
		<a-card :bordered="false">
			<div class="methods-wrap">
				<span
					slot="title"
					class="slTitle"
					>{{ title }}</span
				>
			</div>
			<!-- 金融机构的列表兼容 -->
			<FinancingTitle
				v-if="isBank"
				@bankInfo="getBankInfo"
				ref="financingTitle"
			></FinancingTitle>
			<SlFormNew
				:list="searchList"
				layout="inline"
				@change="handleChange"
				@resetFunc="resetFunc"
			></SlFormNew>
			<Tab
				:statusData="statusData"
				@callback="changeTab"
				@export="exportData"
				:noLinkNum="noLinkNum"
				style="margin-top: 14px"
				:currentStatus="defaultParams.businessLineTabStatus"
				ref="tab"
				@look="openOaModal"
			></Tab>
			<a-table
				:pagination="false"
				:columns="columns"
				:data-source="dataSource"
				rowKey="id"
				style="margin-top: 20px"
				:loading="loading"
				class="new-table"
			>
				<!-- 合同信息 -->
				<template
					slot="businessLineNo"
					slot-scope="businessLineNo, items, index"
				>
					<div class="business-box">
						<div class="business-top">
							<a-tooltip  @visibleChange="(e) => visibleChange(e, items)" placement="topLeft">
								<template slot="title">
									<span v-if="items.fullBusinessLineId">{{ items.fullBusinessLineAbbreviation }}</span>
									<span v-else>业务线名称：{{ items.businessLine }}</span>
								</template>
								<span class="title">业务线名称：{{ items.businessLine }}</span>
							</a-tooltip>
							<!-- 一对多 -->
							<a-tooltip  @visibleChange="(e) => visibleChange(e, items)" placement="topLeft">
								<template slot="title">
									<div>
										<p v-if="buyBusinessLineNos" style="word-break: break-all;">当前业务线采购合同关联有其他业务线：{{buyBusinessLineNos}}</p>
										<p v-if="sellBusinessLineNos" style="word-break: break-all;">当前业务线销售合同关联有其他业务线：{{sellBusinessLineNos}}</p>
									</div>
								</template>
								<span class="business-top-icon" v-if="items.businessLineLinkMore == 'ONE_TO_MORE' && !isBank">
									<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
										<g clip-path="url(#clip0_14200_20779)">
										<circle cx="1.6" cy="6.99844" r="1.6" fill="var(--primary-color)"/>
										<circle cx="12.4" cy="6.99844" r="1.6" fill="var(--primary-color)"/>
										<circle cx="12.4" cy="12.3969" r="1.6" fill="var(--primary-color)"/>
										<circle cx="12.4" cy="1.6" r="1.6" fill="var(--primary-color)"/>
										<path d="M4.85834 7L9.13327 7" stroke="var(--primary-color)" stroke-width="1.6" stroke-linecap="round"/>
										<path d="M4.85834 12.3984L9.13327 12.3984" stroke="var(--primary-color)" stroke-width="1.6" stroke-linecap="round"/>
										<path d="M4.85834 1.60156L9.13327 1.60156" stroke="var(--primary-color)" stroke-width="1.6" stroke-linecap="round"/>
										<path d="M4.85834 1.60156L4.85834 12.3984" stroke="var(--primary-color)" stroke-width="1.6" stroke-linecap="round"/>
										</g>
										<defs>
										<clipPath id="clip0_14200_20779">
										<rect width="14" height="14" fill="white"/>
										</clipPath>
										</defs>
									</svg>
								</span>
							</a-tooltip>

							<a-tooltip  @visibleChange="(e) => visibleChange(e, items)" placement="topLeft">
								<template slot="title">
									<div>
										<p v-if="buyBusinessLineNos" style="word-break: break-all;">当前业务线采购合同关联有其他业务线：{{buyBusinessLineNos}}</p>
										<p v-if="sellBusinessLineNos"  style="word-break: break-all;">当前业务线销售合同关联有其他业务线：{{sellBusinessLineNos}}</p>
									</div>
								</template>
								<span class="business-top-icon"  v-if="items.businessLineLinkMore == 'MORE_TO_ONE' && !isBank ">
									<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
											<g clip-path="url(#clip0_14270_22397)">
											<circle cx="1.6" cy="1.6" r="1.6" transform="matrix(-1 0 0 1 14 5.39844)" fill="var(--primary-color)"/>
											<circle cx="1.6" cy="1.6" r="1.6" transform="matrix(-1 0 0 1 3.2 5.39844)" fill="var(--primary-color)"/>
											<circle cx="1.6" cy="1.6" r="1.6" transform="matrix(-1 0 0 1 3.2 10.7969)" fill="var(--primary-color)"/>
											<circle cx="1.6" cy="1.6" r="1.6" transform="matrix(-1 0 0 1 3.2 0)" fill="var(--primary-color)"/>
											<path d="M9.14166 7L4.86673 7" stroke="var(--primary-color)" stroke-width="1.6" stroke-linecap="round"/>
											<path d="M9.14166 12.3984L4.86673 12.3984" stroke="var(--primary-color)" stroke-width="1.6" stroke-linecap="round"/>
											<path d="M9.14166 1.60156L4.86673 1.60156" stroke="var(--primary-color)" stroke-width="1.6" stroke-linecap="round"/>
											<path d="M9.14166 1.60156V12.3984" stroke="var(--primary-color)" stroke-width="1.6" stroke-linecap="round"/>
											</g>
											<defs>
											<clipPath id="clip0_14270_22397">
											<rect width="14" height="14" fill="white" transform="matrix(-1 0 0 1 14 0)"/>
											</clipPath>
											</defs>
										</svg>
								</span>
							</a-tooltip>
							<a-tooltip  @visibleChange="(e) => visibleChange(e, items)" placement="topLeft">
								<template slot="title">
									<div>
										<p v-show="buyBusinessLineNos" style="word-break: break-all;">当前业务线采购合同关联有其他业务线：{{buyBusinessLineNos}}</p>
										<p style="margin-top:10px;word-break: break-all;" v-show="sellBusinessLineNos">当前业务线销售合同关联有其他业务线：{{sellBusinessLineNos}}</p>
									</div>
								</template>
								<span class="business-top-icon"  v-if="items.businessLineLinkMore == 'MORE_TO_MORE' && !isBank">
									<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
										<g clip-path="url(#clip0_14270_22386)">
										<circle cx="12.4" cy="6.99844" r="1.6" fill="var(--primary-color)"/>
										<circle cx="1.6" cy="6.99844" r="1.6" fill="var(--primary-color)"/>
										<circle cx="12.4" cy="12.3969" r="1.6" fill="var(--primary-color)"/>
										<circle cx="1.6" cy="12.3969" r="1.6" fill="var(--primary-color)"/>
										<circle cx="12.4" cy="1.6" r="1.6" fill="var(--primary-color)"/>
										<circle cx="1.6" cy="1.6" r="1.6" fill="var(--primary-color)"/>
										<path d="M4.87703 7L9.11703 7" stroke="var(--primary-color)" stroke-width="1.6" stroke-linecap="round"/>
										<path d="M4.87703 12.3984L9.11703 12.3984" stroke="var(--primary-color)" stroke-width="1.6" stroke-linecap="round"/>
										<path d="M4.87703 1.60156L9.11703 1.60156" stroke="var(--primary-color)" stroke-width="1.6" stroke-linecap="round"/>
										<path d="M7 1.60156L7 12.3984" stroke="var(--primary-color)" stroke-width="1.6" stroke-linecap="round"/>
										</g>
										<defs>
										<clipPath id="clip0_14270_22386">
										<rect width="14" height="14" fill="white"/>
										</clipPath>
										</defs>
									</svg>
								</span>
							</a-tooltip>
		
							<a-tooltip placement="topLeft">
								<template slot="title" >
									<p>{{ items.businessLineDisplayStatusDesc }}</p>
									<p v-if="rejectStatusList.includes(items.businessLineDisplayStatus) && items.upStreamRejectReason">
										上游驳回：{{ items.upStreamRejectReason }}
									</p>
									<p v-if="rejectStatusList.includes(items.businessLineDisplayStatus) && items.downStreamRejectReason">
										下游驳回：{{ items.downStreamRejectReason }}
									</p>
								</template>
								<span
									class="text status"
									:class="items.businessLineDisplayStatus"
									>{{ items.businessLineDisplayStatusDesc }}</span
								>
							</a-tooltip>
						</div>
						<div class="column-flex special">
							<a-row
								type="flex"
								justify="start"
								:gutter="15"
								class="contract-info-desc"
							>
								<a-col :span="14">
									<p>
										<span class="label">业务线号</span>
										<TextOverFlow
											:content="items.businessLineNo || '-'"
											:maxWidth="maxWidth"
										/>
									</p>
									<p>
										<span class="label">采购合同：</span>
										<TextOverFlow
											:content="items.buyerContractNo || '-'"
											:maxWidth="maxWidth"
										/>
									</p>
									<p>
										<span class="label">销售合同：</span>
										<TextOverFlow
											:content="items.sellerContractNo || '-'"
											:maxWidth="maxWidth"
										/>
									</p>
									<p v-if="items.transContractNo && !isBank">
										<span class="label">运输合同：</span>
										<TextOverFlow
											:content="items.transContractNo || '-'"
											:maxWidth="maxWidth"
										/>
									</p>
								</a-col>
								<a-col :span="10">
									<p>
										<span class="label">品名：</span>
										<TextOverFlow
											:content="items.upStreamGoodsName || '-'"
											:maxWidth="maxWidthRight"
										/>
									</p>
									<p>
										<span class="label">交货期限：</span>
										<TextOverFlow
											:content="(items.deliveryDateStart || '-') + '至' + (items.deliveryDateEnd || '-')"
											:maxWidth="maxWidthRight"
										/>
									</p>
									<p>
										<span class="label">业务类型：</span>

										<TextOverFlow
											:content="items.businessTypeDesc"
											:maxWidth="maxWidthRight"
										/>
									</p>
								</a-col>
							</a-row>
						</div>
					</div>
				</template>
				<template
					slot="deliveryQuantity"
					slot-scope="deliveryQuantity, items"
				>
					<!-- 货转数据 -->
					<div
						class="column-flex"
						style="margin: 0"
						v-if="items.deliveryQuantity === 0 && items.deliveryTransType == 'NONE'"
					>
						<div
							class="progress-box"
							:size="5"
						>
							<a-progress
								:percent="items.goodsTransferProgress || 0"
								:show-info="false"
							/>
							<em class="percent-bg">
								<PercentBgIcon></PercentBgIcon>
								<span class="text">{{ items.goodsTransferProgress }}%</span>
							</em>
							<div
								class="over-percent"
								v-if="items.goodsTransferProgress > 100"
							>
								<em></em>
								<i></i>
							</div>
						</div>
						<p><span class="label">合同量：</span>{{ items.contractQuantity | formatMoney(2) }}吨</p>
						<p><span class="label">已开货转：</span>{{ (items.goodsTransferQuantity || 0) | formatMoney(2) }}吨</p>
					</div>
					<!-- 发运数据 -->
					<div
						class="column-flex"
						style="margin: 0"
						v-else
					>
						<div
							class="progress-box"
							:size="5"
						>
							<a-progress
								:percent="items.deliveryProgress || 0"
								:show-info="false"
							/>
							<em class="percent-bg">
								<PercentBgIcon></PercentBgIcon>
								<span class="text">{{ items.deliveryProgress }}%</span>
								</em>
							<div
								class="over-percent"
								v-if="items.deliveryProgress > 100"
							>
								<em></em>
								<i></i>
							</div>
						</div>
						<p><span class="label">合同量：</span>{{ items.contractQuantity | formatMoney(2) }}吨</p>
						<p><span class="label">已发运：</span>{{ items.deliveryQuantity | formatMoney(2) }}吨</p>
						<p
							style="display: flex; align-items: center"
							v-if="items.transType && items.transType !== 'NONE'"
						>
							<span class="label">运输方式：</span>
							<span style="margin-bottom: 5px; display: inline-block">
								<a-tooltip v-if="items.transType && items.transType.includes('AUTOMOBILE')">
									<template slot="title"> 汽运 </template>
									<Car style="margin-left: 5px" />
								</a-tooltip>
								<a-tooltip v-if="items.transType && items.transType.includes('SHIP')">
									<template slot="title"> 船运 </template>
									<Ship style="margin-left: 5px" />
								</a-tooltip>
								<a-tooltip v-if="items.transType && items.transType.includes('TRAIN')">
									<template slot="title"> 火运 </template>

									<Train style="margin-left: 5px" />
								</a-tooltip>
							</span>
						</p>
					</div>
				</template>
				<template
					slot="payAmount"
					slot-scope="payAmount, items"
				>
					<div class="column-flex fund">
						<p class="title">向上游支付：</p>
						<p
							class="money"
							:class="{ 'no-money': !items.payAmount }"
						>
							{{ (items.payAmount || 0) | formatMoney(2) }}
						</p>
						<template v-if="isDown(items.businessLineType)">
							<p
								class="title"
								style="margin-top: 20px"
							>
								业务线回款:
							</p>
							<p
								class="money"
								:class="{ 'no-money': !items.receiveAmount }"
							>
								{{ (items.receiveAmount || 0) | formatMoney(2) }}
							</p>
						</template>
						<template v-else>
							<p
								class="title"
								style="margin-top: 20px"
							>
								下游付款:
							</p>
							<p
								class="money"
								:class="{ 'no-money': !items.receiveAmount }"
							>
								{{ (items.receiveAmount || 0) | formatMoney(2) }}
							</p>
						</template>
					</div>
				</template>
				<template
					slot="upStreamSettleAmount"
					slot-scope="contractNo, items"
				>
					<div class="column-flex fund">
						<p class="title">上游结算:</p>
						<p
							class="money"
							:class="{ 'no-money': !items.upStreamSettleAmount }"
						>
							{{ (items.upStreamSettleAmount || 0) | formatMoney(2) }}
						</p>
						<p
							class="title"
							style="margin-top: 20px"
						>
							下游结算:
						</p>
						<p
							class="money"
							:class="{ 'no-money': !items.downStreamSettleAmount }"
						>
							{{ (items.downStreamSettleAmount || 0) | formatMoney(2) }}
						</p>
					</div>
				</template>
				<template
					slot="upInvoiceAmount"
					slot-scope="contractNo, items"
				>
					<div class="column-flex fund">
						<p class="title">上游开票:</p>
						<p
							class="money"
							:class="{ 'no-money': !items.upInvoiceAmount }"
						>
							{{ (items.upInvoiceAmount || 0) | formatMoney(2) }}
						</p>
						<p
							class="title"
							style="margin-top: 20px"
						>
							下游开票:
						</p>
						<p
							class="money"
							:class="{ 'no-money': !items.downInvoiceAmount }"
						>
							{{ (items.downInvoiceAmount || 0) | formatMoney(2) }}
						</p>
					</div>
				</template>
				<template
					slot="action"
					slot-scope="businessLineNo, items, index"
				>
					<a
						href="javascript:;"
						@click="goDetail(items)"
						>详情</a
					>
				</template>
			</a-table>

			<i-pagination
				:pagination="pagination"
				size="small"
				v-show="pageSize < pagination.total"
				@change="getList"
			/>
			<!-- 查看无关联合同 -->
			<LookNoLinkContract ref="lookNoLinkContract"></LookNoLinkContract>
		</a-card>
	</div>
</template>

<script>
import { filterCodeByKey } from '@sub/utils/globalCode.js';
import { getPopupContainer } from '@/v2/utils/factory.js';
import { ListMixin } from '@/v2/components/mixin/ListMixin';
import SlFormNew from '@sub/components/ui-new/Form/sl-form';
import FinancingTitle from './components/FinancingTitle.vue';
import {
	getCoreBusinessLineList,
	getStatusCount,
	exportCoreBusinessLine,
	getContractCount,
	getNoLinkBusinessContractList,
	// 金融机构
	getBankBusinessLineList,
	exportBankBusinessLine,
	getLinkBusinessList
} from '@/v2/center/trade/api/businessLine';
import Tab from './components/Tab.vue';
import moment from 'moment';
import comDownload from '@sub/utils/comDownload.js';
import { mapMutations, mapGetters } from 'vuex';
import TextOverFlow from "@sub/components/TextOverflow.vue";
import { Car, Ship, Train, PercentBgIcon } from '@sub/components/svg';
import LookNoLinkContract from './components/LookNoLinkContract.vue';
import iPagination from "@sub/components/iPagination";
import { API_GetCCSDynamicMonitoringListCompany } from 'api';

const searchList = [
	{
		decorator: ['keyNo'],
		addonBeforeTitle: '编号',
		type: 'input',
		placeholder: '请输入订单、合同、业务线号'
	},
	{
		decorator: ['keyName'],
		addonBeforeTitle: '企业名称',
		type: 'input',
		placeholder: '请输入企业名称、业务线名称'
	},
	{
		decorator: ['transType'],
		addonBeforeTitle: '运输方式',
		type: 'select',
		placeholder: '请选择运输方式',
		options: filterCodeByKey('onlineTransTypeDict').map(item => {
			return { value: item.value, label: item.text };
		})
	},
	{
		decorator: ['issuedDate'],
		addonBeforeTitle: '签订日期',
		type: 'rangePicker',
		realKey: ['contractSignDateBegin', 'contractSignDateEnd']
	},
	{
		decorator: ['issuedDate2'],
		addonBeforeTitle: '交货起始日',
		type: 'rangePicker',
		allowClear: true,
		realKey: ['deliveryDateBegin', 'deliveryDateEnd']
	},
	{
		decorator: ['businessType'],
		addonBeforeTitle: '业务类型',
		type: 'select',
		placeholder: '请选择业务类型',
		options: filterCodeByKey('orderBusinessTypeDescMap')
			.map(item => {
				return { value: item.value, label: item.text };
			})
			.filter(item => item.value != 'DISCOUNT_WAREHOUSE_PLEDGE')
	},
	{
		decorator: ['businessCollectionFlag'],
		addonBeforeTitle: '业务线回款',
		type: 'select',
		placeholder: '请选择业务线是否回款',
		options: [
			{ value: 1, label: '已回款' },
			{ value: 2, label: '未回款' }
		]
	}
];
const columns = [
	{ title: '业务线信息', dataIndex: 'businessLineNo', scopedSlots: { customRender: 'businessLineNo' } },
	{ title: '货物进度', dataIndex: 'deliveryQuantity', scopedSlots: { customRender: 'deliveryQuantity' } },
	{ title: '资金进度', dataIndex: 'payAmount', scopedSlots: { customRender: 'payAmount' }, ellipsis: true },
	{ title: '结算进度', dataIndex: 'upStreamSettleAmount', scopedSlots: { customRender: 'upStreamSettleAmount' } },
	{ title: '开票进度', dataIndex: 'upInvoiceAmount', scopedSlots: { customRender: 'upInvoiceAmount' } }
];

export default {
	props: {
		title: {
			default: '业务线管理'
		}
	},
	data() {
		return {
			searchList,
			columns: [],
			pagination: {
				total: 0, // 总条数
				pageNo: 1
			},
			pageSize: 10,
			statusData: [
				{ value: 'ALL', label: '全部' },
				{ value: 'EXECUTING', label: '执行中' },
				{ value: 'COMPLETED_AUDIT_ING', label: '完结审批中' },
				{ value: 'COMPLETED_AUDIT_REJECT', label: '完结审批驳回', num: 0 },
				{ value: 'UP_STREAM_COMPLETED', label: '上游已完结' },
				{ value: 'DOWN_STREAM_COMPLETED', label: '下游已完结' },
				{ value: 'COMPLETED_AUDIT_PASS', label: '业务已完结' }
			],
			dataSource: [],
			searchParams: {}, //查询参数
			// 未关联的业务线合同信息
			noLinkNum: 0,
			defaultParams: {
				businessLineTabStatus: 'ALL'
			},
			loading: false,
			maxWidth: 0, // 合同信息左边文案最大宽度
			maxWidthRight: 0, // 合同信息右边文案最大宽度
			actionWidth: 80, // 操作列的宽度
			clientWidth: null, //浏览器尺寸
			// 审批驳回的状态枚举值
			rejectStatusList: [
				'COMPLETED_AUDIT_REJECT',
				'UP_COMPLETED_AUDIT_REJECT_DOWN_COMPLETED_AUDIT_ING',
				'UP_COMPLETED_AUDIT_REJECT_DOWN_COMPLETED_AUDIT_PASS',
				'UP_COMPLETED_AUDIT_REJECT_DOWN_EXECUTING',
				'UP_EXECUTING_DOWN_COMPLETED_AUDIT_REJECT',
				'UP_COMPLETED_AUDIT_PASS_DOWN_COMPLETED_AUDIT_REJECT',
				'UP_COMPLETED_AUDIT_ING_DOWN_COMPLETED_AUDIT_REJECT'
			],
			// 金融机构信息
			bankInfo: {
				coreCompanyUscc: null
			},
			// 当前业务线采购合同关联有其他业务线：；
			buyBusinessLineNos: '',
			// 当前业务线销售合同关联有其他业务线：。
			sellBusinessLineNos: '',

		};
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		// 判断当前是否是金融机构
		isBank() {
			return this.VUEX_ST_COMPANYSUER.companyType == 'FINANCIAL_ORG';
		}
	},
	watch: {
		clientWidth: {
			handler: function () {
				this.showAction();
				this.getmaxWidth();
			},
			immediate: true
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
		this.getAllCompanyList();
		this.getContractNum();
	},
	methods: {
		// 获取金融机构信息的列表
		async getAllCompanyList() {
			if (this.isBank) {
				const res = await API_GetCCSDynamicMonitoringListCompany();
				const list = res.data || [];

				if (!list.length) {
					this.$message.error('请在后台进行数据监控配置！');
					return;
				}

				this.bankInfo = {
					coreCompanyUscc: list[0].uscc
				};
				const infoStr = localStorage.getItem('bankInfo');
				if (infoStr) {
					const newInfo = JSON.parse(infoStr);
					this.bankInfo = {
						coreCompanyUscc: newInfo.capitalCompanyUscc
					};
				}

				this.$nextTick(() => {
					this.$refs.financingTitle.init(list);
				});
				// 没有数据就不调用列表接口
				this.getList();
			} else {
				this.getList();
			}
		},
		// 金融机构的信息
		getBankInfo(info) {
			this.bankInfo = info;
			this.getList();
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
				this.maxWidthRight = 90;
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
					scopedSlots: { customRender: 'action' },
					width: this.actionWidth,
					fixed: 'right'
				}
			];
			this.columns = columns.concat(arr);
		},
		handleChange(data) {
			this.searchParams = data;
			this.pagination.pageNo = 1;
			this.getList();
		},
		resetFunc() {
			this.pagination.pageNo = 1;
			this.defaultParams.businessLineTabStatus = 'ALL';
		},
		// 查询未关联合同业务线
		openOaModal() {
			let m = function (e) {
				e.preventDefault();
			};
			document.body.style.overflow = 'hidden';
			document.body.style.setProperty('height', '100vh', 'important');

			document.addEventListener('touchmove', m, { passive: false }); //禁止页面
			this.$refs.lookNoLinkContract.showRelationOrderList();
		},
		changeTab(status) {
			this.defaultParams.businessLineTabStatus = status;
			this.pagination.pageNo = 1;
			this.getList();
		},
		// 导出数据
		async exportData() {
			const params = {
				...this.searchParams,
				...this.pagination,
				pageSize: this.pageSize,
				...this.defaultParams,
				...this.bankInfo
			};
			let Fn = this.isBank ? exportBankBusinessLine : exportCoreBusinessLine;
			const res = await Fn(params);
			const name = `业务线-${this.VUEX_ST_COMPANYSUER.companyName}-${moment().format('YYYY-MM-DD')}.xls`;
			comDownload(res, undefined, name);
		},
		// 查看详情
		goDetail(item) {
			this.$router.push({
				path: this.isBank ? '/center/monitoring/dynamicMonitoring/detail' : '/center/businessline/detail',
				query: {
					businessLineNo: item.businessLineNo,
					upOrderNo: item.upOrderNo,
					downOrderNo: item.downOrderNo,
					businessLineType: item.businessLineType,
					coreCompanyUscc: this.bankInfo.coreCompanyUscc
				}
			});
		},
		// 获取列表
		async getList(pageNo = this.pagination.pageNo, pageSize = this.pageSize) {
			this.pageSize = pageSize;
			this.pagination.pageSize = pageSize;
			this.pagination.pageNo = pageNo;
			this.loading = true;
			const params = {
				...this.searchParams,
				...this.pagination,
				pageSize: this.pageSize,
				...this.defaultParams,
				...this.bankInfo
			};
			try {
				// 判断一下 当前企业
				let Fn = this.isBank ? getBankBusinessLineList : getCoreBusinessLineList;
				const res = await Fn(params);
				const list = res.data.records || [];

				list.forEach(el => {
					if (el.contractQuantity) {
						/** 发运进度 */
						el.deliveryProgress = Number((((el.deliveryQuantity || 0) / el.contractQuantity) * 100).toFixed(0));
						/** 货转进度 */
						el.goodsTransferProgress = Number((((el.goodsTransferQuantity || 0) / el.contractQuantity) * 100).toFixed(0));
					} else {
						el.deliveryProgress = 0;
						el.goodsTransferProgress = 0;
					}
				});

				this.dataSource = list;
				this.pagination.total = res.data.total;
				this.loading = false;
				this.getStatusCount();
			} catch (error) {
				this.loading = false;
			}
		},
		// 获取当前完结审批驳回的数量 和 查看未关联业务线的合同
		async getContractNum() {
			const res = await getContractCount();

			this.noLinkNum = res.data || 0;
			this.$forceUpdate();
		},

		detail(items) {
			// 查看详情跳转到业务监控详情
			this.$router.push({
				path: '/center/monitoring/dynamicMonitoring/detail',
				query: {
					upOrderNo: items.buyOrder.orderNo, // 上游订单号
					downOrderNo: items.sellOrder.orderNo, // 下游订单号
					businessLineType: items.businessLineType, // 业务线类型
					contractType: 0, // 0上游 1下游
					contractContentActiveIndex: 0,
					cashTabIndex: 0,
					transContractNo: items?.transContract?.contractNo || null,
					businessLineNo: items.businessLineNo
				}
			});
		},
		// 获取状态统计
		async getStatusCount() {
			const params = {
				...this.searchParams,
				...this.pagination,
				pageSize: this.pageSize,
				...this.defaultParams,
				...this.bankInfo
			};
			const res = await getStatusCount(params);
			this.statusData[3].num = res.data.COMPLETED_AUDIT_REJECT;
			this.$forceUpdate();
		},
		// 判断 businessLineType
		// 下游 是电子 还是 线下
		isDown(businessLineType) {
			if (['UP', 'ONLINE'].includes(businessLineType)) {
				return false;
			}
			return true;
		},
		async visibleChange(visible, items) {
				// 判断 businessLineType
      // UP：上游补录、下游电子
      // ONLINE：上游电子、下游电子
      // DOWN：上游电子、下游补录
      // OFFLINE：上游补录、下游补录
				
				if(visible) { 
						this.buyBusinessLineNos = ''
						this.sellBusinessLineNos = ''
						let params = {
							businessNo: items.businessLineNo,
						}
						const res = await getLinkBusinessList(params)
						const info  = res.data || {buyLinked: [], sellLinked: []}
						
						this.buyBusinessLineNos =  info.buyLinked ? info.buyLinked.filter(el => el.businessLineNo != items.businessLineNo).map(el => el.businessLineNo).join(',') : ''
						this.sellBusinessLineNos =info.sellLinked ? info.sellLinked.filter(el => el.businessLineNo != items.businessLineNo).map(el => el.businessLineNo).join(',') : ''
						

				}
		},
	},
	components: {
		Tab,
		TextOverFlow,
		Car,
		Ship,
		Train,
		LookNoLinkContract,
		SlFormNew,
		iPagination,
		FinancingTitle,
		PercentBgIcon
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style scoped lang="less">
.business-top {
	.title {
		color: var(--text-80, rgba(0, 0, 0, 0.8));
		font-size: 14px;
		flex: 1;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
		max-width: 70%;
		display: inline-block;
		vertical-align: middle;
		margin-right: 15px;
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
		background: #ffdac8;
		color: #ff7937;
		width: 15%;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
		vertical-align: middle;
	}
	.business-top-icon {
		position: relative;
		top: 3px;
		margin-right: 15px;
		cursor: pointer;
	}
	.COMPLETED_AUDIT_REJECT,
	.UP_COMPLETED_AUDIT_REJECT_DOWN_COMPLETED_AUDIT_ING,
	.UP_COMPLETED_AUDIT_REJECT_DOWN_COMPLETED_AUDIT_PASS,
	.UP_COMPLETED_AUDIT_REJECT_DOWN_EXECUTING,
	.UP_EXECUTING_DOWN_COMPLETED_AUDIT_REJECT {
		background: #f2d0d0;
		color: #d44;
	}
	.EXECUTING {
		background: #c1d7ff;
		color: var(--VI-, #4682f3);
	}
}
.column-flex {
	margin-top: 20px;
	& > p {
		line-height: 22px;
	}
	&::after {
		content: '';
		width: 1px;
		height: 80%;
		background: #e5e6eb;
		position: absolute;
		top: 50%;
		right: 0;
		transform: translateY(-50%);
	}
	& > .ant-space {
		margin-bottom: 10px;
		& > div {
			cursor: pointer;
			.copy-icon {
				margin-left: 12px;
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
.fund {
	margin-top: 0;
	.title {
		color: var(--text-40, rgba(0, 0, 0, 0.4));
		font-family: PingFang SC;
		font-size: 14px;
		margin-bottom: 8px;
	}
	.money {
		display: inline-flex;
		padding: 4px 12px;
		justify-content: center;
		align-items: center;
		gap: 10px;
		border-radius: 4px;
		background: #d0eed0;
		color: var(--text-80, rgba(0, 0, 0, 0.8));
		font-family: PingFang SC;
		font-size: 14px;
	}
	.no-money {
		color: var(--text-40, rgba(0, 0, 0, 0.4));
		background: #fafafa;
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
		.business-box {
			&::after {
				content: '';
				width: 1px;
				height: 80%;
				background: #e5e6eb;
				position: absolute;
				top: 50%;
				right: 0;

				transform: translateY(-50%);
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
		background-color: @primary-color!important;
	}
	::v-deep.ant-progress-bg {
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
			line-height: 19px;
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
// <=1560
@media screen and (max-width: 1560px) {
	.new-table {
		::v-deep .ant-table-tbody > tr {
			& > td {
				padding: 20px 10px;
			}
			td:first-child {
				width: 380px;
			}
			td:nth-child(5) {
				width: 160px;
			}
		}
		::v-deep .ant-table-thead > tr {
			& > th:last-child {
				padding: 10px 10px;
			}
			th:first-child {
				width: 380px;
			}
			th:nth-child(5) {
				width: 160px;
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
				width: 380px;
			}
			td:nth-child(2) {
				width: 185px;
			}
			td:nth-child(3),
			td:nth-child(4) {
				width: 148px;
			}
			td:nth-child(5) {
				width: 150px;
			}
		}
		::v-deep .ant-table-thead > tr {
			& > th {
				padding: 10px 20px !important;
			}
			th:nth-child(1) {
				width: 380px;
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
				width: 150px;
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
				width: 580px !important;
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
				width: 580px !important;
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
