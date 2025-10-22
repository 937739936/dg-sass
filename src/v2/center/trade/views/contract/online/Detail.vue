<template>
	<div
		class="slMain"
		v-if="detailData"
	>
		<breadcrumb></breadcrumb>
		<a-card
			:bordered="false"
			style="padding-bottom: 12px"
		>
			<div
				class="LONG_TERM_CONTRACT"
				v-if="detailData.contract.contractTermType == 'LONG_TERM_CONTRACT'"
			>
				<div class="mark">
					<div class="text">长协</div>
				</div>
			</div>
			<div
				slot="title"
				class="slTitle"
			>
				<span>电子{{ $route.query.type.toUpperCase() === 'SELL' ? '销售' : '采购' }}合同详情</span>
			</div>
			<a-row
				type="flex"
				class="flex-top-box"
			>
				<a-col flex="1">
					<div
						class="titleInfoBox"
						v-if="detailData.contract"
					>
						<div class="titleInfoTitle">
							<a-space :size="16">
								<em class="contractTypeSymbol">{{ $route.query.type === 'BUY' ? '采' : '销' }}</em>
								<div
									@mouseenter="onMouseOverContractNo()"
									@mouseleave="onMouseOutContractNo()"
								>
									<span style="cursor: pointer">合同编号：{{ detailData.contractNo || '-' }}</span>
									<span
										v-show="!copyContractNoVisible"
										class="copy-contract-icon"
									>
										<Copy></Copy>
									</span>
									<span
										v-show="copyContractNoVisible"
										v-clipboard:success="onCopy"
										v-clipboard:error="onError"
										v-clipboard:copy="detailData.contractNo"
										class="copy-contract-icon"
									>
										<CopyNow></CopyNow>
									</span>
								</div>
								<span
									v-if="QRIconVisible"
									class="QR-code-icon"
									@click="despatchCode()"
								>
									<DeliverCodeIcon></DeliverCodeIcon>
								</span>
								<span
									:class="'status-frozen ' + contractStatus"
									v-if="detailData.contract"
									>{{ detailData.contract.statusDesc }}</span
								>
								<span
									:class="'status-frozen-desc '"
									v-if="isFREEZING || (cancelTerminateStatus && !isHasTransData)"
									>合同终止:
									<span v-if="contractTerminationList[contractTerminationList.length - 1]">{{
										contractTerminationList[contractTerminationList.length - 1].statusDesc
									}}</span>
								</span>
							</a-space>
						</div>
						<div
							class="titleInfoItem pl85"
							@mouseenter="onMouseOverOrderNo()"
							@mouseleave="onMouseOutOrderNo()"
						>
							<span class="label w85">订单编号：</span>
							<TextOverFlow
								v-if="detailData.contract.serialNo"
								:content="detailData.contract.serialNo"
								:maxWidth="maxWidth"
							/>
							<span v-else>-</span>
							<div
								class="copy-icon-box"
								v-show="!copyOrderNoVisible"
							>
								<Copy></Copy>
							</div>
							<div
								class="copy-icon-box"
								v-show="copyOrderNoVisible"
								v-clipboard:copy="detailData.contract.serialNo"
								v-clipboard:success="onCopy"
								v-clipboard:error="onError"
							>
								<CopyNow></CopyNow>
							</div>
						</div>
						<div class="titleInfoItem">
							<span class="label">卖方企业：</span>
							<TextOverFlow
								v-if="detailData.contract.sellerCompanyName"
								:content="detailData.contract.sellerCompanyName"
								:maxWidth="maxWidth"
							/>
							<span v-else>-</span>
						</div>
						<div class="titleInfoItem">
							<span class="label">买方企业：</span>
							<TextOverFlow
								v-if="detailData.contract.buyerCompanyName"
								:content="detailData.contract.buyerCompanyName"
								:maxWidth="maxWidth"
							/>
							<span v-else>-</span>
						</div>
						<div class="titleInfoItem">
							<span class="label">煤种：</span>
							<TextOverFlow
								v-if="detailData.contract.coalType"
								:content="filterCoalTypeContent(detailData.contract.coalType)"
								:maxWidth="maxWidth"
							/>
							<span v-else>-</span>
						</div>
						<div class="titleInfoItem pl85">
							<span class="label w85">业务类型：</span>
							<TextOverFlow
								v-if="detailData.contract.businessTypeDesc"
								:content="detailData.contract.businessTypeDesc"
								:maxWidth="maxWidth"
							/>
							<span v-else>-</span>
						</div>
						<div class="titleInfoItem">
							<span class="label">资金来源：</span>
							<TextOverFlow
								v-if="detailData.contract.bankProductName"
								:content="detailData.contract.bankProductName"
								:maxWidth="maxWidth"
							/>
							<span v-else>-</span>
						</div>
						<div class="titleInfoItem">
							<span class="label">业务账号：</span>
							<TextOverFlow
								v-if="detailData.businessNo"
								:content="detailData.businessNo"
								:maxWidth="maxWidth"
							/>
							<span v-else>-</span>
						</div>
						<div class="titleInfoItem">
							<span class="label">创建时间：</span>
							<TextOverFlow
								v-if="detailData.contract.createDate"
								:content="detailData.contract.createDate"
								:maxWidth="maxWidth"
							/>
							<span v-else>-</span>
						</div>
						<div
							class="titleInfoItem"
							v-if="type === 'BUY' && detailData.contract.inCoalPlanSerialNoList"
						>
							<span class="label">上煤计划：</span>
							<TextOverFlow
								:content="detailData.contract.inCoalPlanSerialNoList.join('、')"
								:maxWidth="maxWidth"
							/>
						</div>
						<div
							class="titleInfoItem"
							v-if="type === 'SELL' && detailData.contract.outCoalPlanSerialNoList"
						>
							<span class="label">下煤计划：</span>
							<TextOverFlow
								:content="detailData.contract.outCoalPlanSerialNoList.join('、')"
								:maxWidth="maxWidth"
							/>
						</div>

						<!-- 仅针对合同创建方展示该字段，合同接收方不展示  -->
						<template
							v-if="
								VUEX_ST_COMPANYSUER.companyUscc == detailData.contract.createByCompanyUscc &&
								detailData.contract.businessType != 'OTHER'
							"
						>
							<div class="titleInfoItem">
								<span class="label">上游实际负责人：</span>
								<TextOverFlow
									v-if="directorBusiness"
									:content="directorBusiness"
									:maxWidth="maxWidth"
								/>
								<template v-else>-</template>
							</div>
							<div class="titleInfoItem">
								<span class="label">下游实际负责人：</span>
								<TextOverFlow
									v-if="terminalDirectorBusiness"
									:content="terminalDirectorBusiness"
									:maxWidth="maxWidth"
								/>
								<template v-else>-</template>
							</div>
						</template>
						<template>
							<div
								:class="`titleInfoItem ${detailData.contract.auditChainAndOperator ? 'pl85 more' : 'more'}`"
								v-if="isBuyerInitiator && detailData.contract.auditChainAndOperator"
							>
								<span :class="{ label: true, w130: detailData.contract.auditChainAndOperator }">流程发起人：</span>
								<span
									v-for="(pro, index) in detailData.contract.auditChainAndOperator.operatorInfo"
									:key="index"
								>
									{{ pro.systemName }}-{{ pro.operatorName }}
									<a-tooltip
										:getPopupContainer="getPopupContainer"
										v-if="pro.operatorMobile"
									>
										<template slot="title">
											{{ pro.operatorMobile }}
										</template>
										<span class="mobile-icon">
											<Phone></Phone>
										</span>
									</a-tooltip>
								</span>
							</div>
							<div
								:class="`titleInfoItem ${detailData.contract.auditChainAndOperator ? 'pl85 more' : 'more'}`"
								v-if="!isBuyerInitiator && detailData.contract.receiveAuditChainAndOperator"
							>
								<span :class="{ label: true, w130: detailData.contract.receiveAuditChainAndOperator }">流程发起人：</span>
								<span
									v-for="(pro, index) in detailData.contract.receiveAuditChainAndOperator.operatorInfo"
									:key="index"
								>
									{{ pro.systemName }}-{{ pro.operatorName }}
									<a-tooltip
										:getPopupContainer="getPopupContainer"
										v-if="pro.operatorMobile"
									>
										<template slot="title">
											{{ pro.operatorMobile }}
										</template>
										<span class="mobile-icon">
											<Phone></Phone>
										</span>
									</a-tooltip>
								</span>
							</div>
						</template>
					</div>
				</a-col>
				<a-col flex="100px">
					<div class="right-top-box">
						<!-- v-if="!actionBtnDisabled" -->
						<template>
							<a-tooltip
								placement="left"
								overlayClassName="white-bg-tooltips"
								:getPopupContainer="getPopupContainer"
							>
								<template slot="title">
									<a
										v-for="(pro, index) in actionNode"
										:key="index"
										@click="clickFn(pro.incident)"
									>
										{{ pro.text }}
									</a>
								</template>
								<a-button
									class="slBtn"
									type="primary"
									>操作</a-button
								>
							</a-tooltip>
						</template>
						<!-- <template v-else>
							<a-button
								class="slBtn"
								type="primary"
								disabled
								>操作</a-button
							>
						</template> -->

						<div
							class="warning-box"
							@click="warningFunc()"
						>
							<p class="warning-title">风险预警</p>
							<p class="warning-num">{{ warningNum }}</p>
						</div>
					</div>
				</a-col>
			</a-row>
		</a-card>

		<a-card
			:bordered="false"
			v-if="isShowTerminateProcess || (!isHasTransData && contractTerminationList.length)"
		>
			<a-row
				type="flex"
				justify="space-around"
				class="twenty-percent"
			>
				<a-col
					class="flex-box"
					v-for="(item, index) in contractTerminationStatus"
					:key="index"
				>
					<!-- <img v-if="detailData.contract.contractBothSignTime" src="@/v2/assets/imgs/contract/contract_icon.png" alt=""> -->
					<img
						:src="item.icon"
						alt=""
					/>
					<div class="flex-text">
						<p class="label">{{ item.createTime || '-' }}</p>
						<p>
							<span>{{ item.text }}</span>
							<span
								v-if="
									['AUDITING_REJECT', 'CANCELLATION', 'CONFIRM_REJECT'].includes(item.status) &&
									++index != contractTerminationStatus.length
								"
							>
								<a-tooltip placement="topLeft">
									<template slot="title">
										<span>{{ item.rejectReason }}</span>
									</template>
									<a-icon
										style="margin-left: 5px"
										type="question-circle"
										theme="filled"
									/>
								</a-tooltip>
							</span>
						</p>
					</div>
				</a-col>
			</a-row>
		</a-card>
		<a-card
			:bordered="false"
			v-else
		>
			<a-row
				type="flex"
				class="twenty-percent"
			>
				<a-col class="flex-box">
					<img
						v-if="detailData.contract.contractBothSignTime"
						src="@/v2/assets/imgs/contract/contract_icon.png"
						alt=""
					/>
					<img
						v-else
						src="@/v2/assets/imgs/contract/contract_no_icon.png"
						alt=""
					/>
					<div class="flex-text">
						<p class="label">合同</p>
						<p :class="detailData.contract.contractBothSignTime ? '' : 'fontlabel'">
							{{ detailData.contract.contractBothSignTime ? '合同已双签' : '合同未双签' }}
						</p>
					</div>
				</a-col>
				<a-col class="flex-box">
					<img
						v-if="detailData.contract.deliverQuantity > 0"
						src="@/v2/assets/imgs/contract/deliver_icon.png"
						alt=""
					/>
					<img
						v-else
						src="@/v2/assets/imgs/contract/deliver_no_icon.png"
						alt=""
					/>
					<div class="flex-text">
						<p class="label">发运</p>
						<p v-if="detailData.contract.deliverQuantity > 0">
							{{ detailData.contract.deliverQuantity | formatMoney(2) }}吨
							<a-tooltip
								placement="bottom"
								overlayClassName="progress-bar-tooltips"
								:getPopupContainer="getPopupContainer"
							>
								<template slot="title">
									<a-progress
										:percent="detailData.contract.dispatchRate"
										:show-info="false"
									/>
									<em class="percent-bg">
										<PercentBgIcon></PercentBgIcon>
										<span class="text">{{ detailData.contract.dispatchRate }}%</span>
									</em>
									<div
										class="over-percent"
										v-if="detailData.contract.dispatchRate > 100"
									>
										<em></em>
										<i></i>
									</div>
								</template>
								<span class="progress-icon">
									<DeliverProgressIcon></DeliverProgressIcon>
								</span>
							</a-tooltip>
						</p>
						<p
							v-else
							class="fontlabel"
						>
							未发运
						</p>
					</div>
				</a-col>
				<a-col class="flex-box">
					<img
						v-if="detailData.contract.payAmount > 0"
						src="@/v2/assets/imgs/contract/payment_icon.png"
						alt=""
					/>
					<img
						v-else
						src="@/v2/assets/imgs/contract/payment_no_icon.png"
						alt=""
					/>
					<div class="flex-text">
						<p class="label">付款</p>
						<p v-if="detailData.contract.payAmount > 0">{{ detailData.contract.payAmount | formatMoney(2) }}元</p>
						<p
							v-else
							class="fontlabel"
						>
							未付款
						</p>
					</div>
				</a-col>
				<a-col class="flex-box">
					<img
						v-if="detailData.contract.settledAmount > 0"
						src="@/v2/assets/imgs/contract/settlement_icon.png"
						alt=""
					/>
					<img
						v-else
						src="@/v2/assets/imgs/contract/settlement_no_icon.png"
						alt=""
					/>
					<div class="flex-text">
						<p class="label">结算</p>
						<p v-if="detailData.contract.settledAmount > 0">
							{{ detailData.contract.settledQuantity | formatMoney(2) }}吨 |
							{{ detailData.contract.settledAmount | formatMoney(2) }}元
						</p>
						<p
							v-else
							class="fontlabel"
						>
							未结算
						</p>
					</div>
				</a-col>
				<a-col class="flex-box">
					<img
						v-if="detailData.contract.invoiceAmount > 0"
						src="@/v2/assets/imgs/contract/invoice_icon.png"
						alt=""
					/>
					<img
						v-else
						src="@/v2/assets/imgs/contract/invoice_no_icon.png"
						alt=""
					/>
					<div class="flex-text">
						<p class="label">发票</p>
						<p v-if="detailData.contract.invoiceAmount > 0">{{ detailData.contract.invoiceAmount | formatMoney(2) }}元</p>
						<p
							v-else
							class="fontlabel"
						>
							未开票
						</p>
					</div>
				</a-col>
			</a-row>
		</a-card>

		<a-card
			:bordered="false"
			class="pt0"
		>
			<!-- tabs -->
			<a-tabs @change="tabChange">
				<a-tab-pane
					key="contractInfo"
					tab="合同信息"
				>
					<ContractInfo
						ref="contractInfo"
						:data="detailData"
						:type="this.$route.query.type"
						:clientWidth="clientWidth"
						:actionBtnDisabled="actionBtnDisabled"
						:contractTerminationList="contractTerminationList"
						:showStopContent="computedTotal('contractStopTabNum')"
					/>
				</a-tab-pane>
				<a-tab-pane
					key="deliverInfo"
					:tab="'发运信息(' + computedTotal('dispatchAndGoodsTransferTabNum') + ')'"
				>
					<DeliverInfo
						ref="deliverInfo"
						:data="detailData"
					/>
				</a-tab-pane>
				<a-tab-pane
					key="inOutInfo"
					:tab="`${type == 'SELL' ? '出' : '入'}库信息(${computedTotal('inOutTabNum')})`"
					v-if="detailData.contract.businessType == 'WAREHOUSE_RECEIPTS_PLEDGE'"
				>
					<InOutInfo
						ref="inOutInfo"
						:type="type == 'SELL' ? 'OUT' : 'IN'"
						:detailData="detailData"
					/>
				</a-tab-pane>
				<a-tab-pane
					key="paymentInfo"
					:tab="'付款信息(' + computedTotal('paymentTabNum') + ')'"
				>
					<PaymentInfo
						ref="paymentInfo"
						:data="detailData"
					/>
				</a-tab-pane>

				<a-tab-pane
					key="statementInfo"
					:tab="'结算信息(' + (computedTotal('statementTabNum') + ')')"
				>
					<StatementInfo
						ref="statementInfo"
						:data="detailData"
					/>
				</a-tab-pane>
				<a-tab-pane
					key="invoiceInfo"
					:tab="'发票信息(' + computedTotal('orderInvoiceTabNum') + ')'"
				>
					<InvoiceInfo
						ref="invoiceInfo"
						:data="detailData"
						:type="this.$route.query.type"
					/>
				</a-tab-pane>
				<a-tab-pane
					key="contractOperation"
					tab="合同操作记录"
				>
					<ContractOperation
						ref="contractOperation"
						:data="detailData"
					/>
				</a-tab-pane>
			</a-tabs>
		</a-card>
		<DespatchCodeModal ref="despatchCodeModal" />
		<!-- 合同操作函数组件 -->
		<ContractFunc
			ref="contractFunc"
			:type="$route.query.type"
			:detail="detailData.contract"
			@refresh="init"
		/>
	</div>
</template>

<script>
import breadcrumb from '@/v2/components/breadcrumb/index';
import DespatchCodeModal from '@/v2/center/trade/views/contract/components/DespatchCodeModal';
import TextOverFlow from '@sub/components/TextOverflow.vue';
import { getPopupContainer } from '@/v2/utils/factory.js';
import ContractInfo from '@/v2/center/trade/views/contract/components/detail/ContractInfo';
import DeliverInfo from '@/v2/center/trade/views/contract/components/detail/DeliverInfo';
import PaymentInfo from '@/v2/center/trade/views/contract/components/detail/PaymentInfo';
import StatementInfo from '@/v2/center/trade/views/contract/components/detail/StatementInfo';
import InvoiceInfo from '@/v2/center/trade/views/contract/components/detail/InvoiceInfo';
import InOutInfo from '@/v2/center/trade/views/contract/components/detail/InOutInfo';

import ContractStop from '@/v2/center/trade/views/contract/components/detail/ContractStop';
import ContractOperation from '@/v2/center/trade/views/contract/components/detail/ContractOperation';
import { filterCodeByKey } from '@sub/utils/globalCode.js';
import {
	API_getOrderContractDetailById,
	API_ccountOrderContractRiskAlertById,
	API_getOrderDispatchAndGoodsTransferResp,
	API_getOrderPaymentResp,
	API_getOrderStatementResp,
	API_getOrderInvoiceInfoResp,
	API_listOrderTerminateLog,
	API_CONTRACT_TERMINATE_LIST,
	API_COMPANYOACHECK,
	getInOutDetailList
} from '@/v2/center/trade/api/contract';
import { mapGetters } from 'vuex';
import { getContractAction } from '@/v2/center/trade/views/contract/action';
import ContractFunc from '@/v2/center/trade/views/contract/components/ContractFunc.vue';
import contractTerminationEnum from '@/v2/center/trade/views/contract/config/contractTerminate';
import { cloneDeep } from 'lodash';
import { Copy, CopyNow, PercentBgIcon, DeliverProgressIcon, DeliverCodeIcon, Phone } from '@sub/components/svg';

export default {
	name: 'ContractOnLineDetail',
	data() {
		return {
			getPopupContainer,
			copyContractNoVisible: false, // 复制合同编号icon
			copyOrderNoVisible: false, // 复制订单编号icon
			detailData: {
				contract: {},
				contractDelivery: {}
			},
			warningNum: '', // 预警信息数
			num: {}, // tab计数
			clientWidth: null, //浏览器尺寸
			maxWidth: 0, // 信息文案最大宽度
			coalTypeData: filterCodeByKey('goods_type'),
			actionNode: {}, // 操作节点
			type: this.$route.query.type,
			optionsList: [],
			contractTerminationStatus: [],
			isShowTerminate: -1,
			contractTerminationList: [],
			isOa: false
		};
	},
	components: {
		breadcrumb,
		DespatchCodeModal,
		TextOverFlow,
		ContractInfo,
		DeliverInfo,
		PaymentInfo,
		StatementInfo,
		InvoiceInfo,
		ContractStop,
		ContractOperation,
		ContractFunc,
		InOutInfo,
		CopyNow,
		Copy,
		PercentBgIcon,
		DeliverProgressIcon,
		DeliverCodeIcon,
		Phone
	},
	watch: {
		num: function (data) {
			this.num = data;
		},
		clientWidth: {
			handler: function () {
				this.getmaxWidth();
			},
			immediate: true
		}
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER',
			VUEX_ST_USERAUTH: 'VUEX_ST_USERAUTH',
			VUEX_CURRENT_PLATEFORM: 'VUEX_CURRENT_PLATEFORM'
		}),
		contractStatus() {
			return this.$route.query?.status || this.detailData?.contract?.status;
		},
		cancelTerminateStatus() {
			return ['AUDITING_REJECT', 'CONFIRM_REJECT', 'CANCELLATION'].includes(
				this.$route.query?.terminalContractStatus || this.detailData?.contract?.terminalContractStatus
			);
		},
		isShowTerminateProcess() {
			return ['TERMINATED', 'FREEZING'].includes(this.$route.query?.status || this.detailData?.contract?.status);
		},
		isFREEZING() {
			return ['FREEZING'].includes(this.$route.query?.status || this.detailData?.contract?.status);
		},
		isBuyerInitiator() {
			return this.VUEX_ST_COMPANYSUER.companyUscc === this.detailData.contract.buyCompanyUscc;
		},
		// 派车计划icon--//汽运或汽运和火运 &&【草稿】、【审批中】、【待签约】、【待确认】、【确认待盖章】、【执行中】
		QRIconVisible() {
			return (
				['AUTOMOBILE', 'AUTOMOBILE_AND_TRAIN'].includes(this.detailData.contract.transType) &&
				['DRAFT', 'AUDITING', 'WAIT_SIGN_SEAL', 'WAIT_CONFIRM', 'CONFIRM_WAIT_SIGN_SEAL', 'EXECUTING'].includes(
					this.detailData.contract.status
				)
			);
		},
		// 操作按钮disabled【驳回】、【退回】、【作废】、【冻结中】、【已终止】、【已完成】
		actionBtnDisabled() {
			return ['REJECT', 'APPROVAL_FAIL', 'CANCELLATION', 'FREEZING', 'TERMINATED', 'COMPLETED'].includes(
				this.detailData.contract.status
			);
		},
		//上游负责人
		directorBusiness() {
			let contract = this.detailData.contract;
			if (contract) {
				let { directorBusinessUnitName, director, directorMobile } = contract;
				return `${
					directorBusinessUnitName ? directorBusinessUnitName + '-' : ''
				}${director ? director + '-' : ''}${directorMobile || ''}`;
			} else {
				return '';
			}
		},
		//下游负责人
		terminalDirectorBusiness() {
			let contract = this.detailData.contract;
			if (contract) {
				let { terminalDirectorBusinessUnitName, terminalDirectorName, terminalDirectorMobile } = contract;
				return `${terminalDirectorBusinessUnitName ? terminalDirectorBusinessUnitName + '-' : ''}${
					terminalDirectorName ? terminalDirectorName + '-' : ''
				}${terminalDirectorMobile || ''}`;
			} else {
				return '';
			}
		},
		isHasTransData() {
			return (
				this.computedTotal('dispatchAndGoodsTransferTabNum') ||
				this.computedTotal('paymentTabNum') ||
				this.computedTotal('statementTabNum') ||
				this.computedTotal('orderInvoiceTabNum')
			);
		}
	},
	async created() {
		this.init();
		this.checkIsOa();
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
		// 判断是否需要对接OA，文案不同
		checkIsOa() {
			API_COMPANYOACHECK({ uscc: this.VUEX_ST_COMPANYSUER.companyUscc }).then(res => {
				if (res.success) {
					this.isOa = res.result;
				}
			});
		},
		async init(data) {
			//进行业务转移后，tips提示“操作成功”，然后判断当前账号是否为企业管理员，如果是，继续停留在当前页面；如果不是，应该返回到对应的合同列表页
			if (data && data === 'BusinessTransfer' && !this.VUEX_ST_COMPANYSUER.companyUserRoles.includes('admin')) {
				this.$router.push({
					path: '/center/contract/' + this.$route.query.type.toLocaleLowerCase() + '/list'
				});
				return;
			}
			await this.getDetail();
			await this.getContractTerminateInfo();
			await this.getWarningDetail();
			await this.getTabNum();
		},
		computedTotal(type) {
			if (this.num[type]) {
				return this.num[type];
			}
			return 0;
		},
		filterCoalTypeContent(code) {
			return this.coalTypeData.filter(item => item.value === code)[0].text;
		},
		// 获取合同终止信息
		getContractTerminateInfo() {
			let id = this.$route.query.id;
			return API_listOrderTerminateLog({ orderId: id }).then(resp => {
				if (resp.success) {
					this.$set(this.num, 'contractStopTabNum', resp.data?.length);
					const statusRejectReason = {};
					if (resp.data.length) {
						resp.data.forEach(item => {
							if (!statusRejectReason[item.status]) {
								statusRejectReason[item.status] = item.rejectReason;
							}
						});
						this.isShowTerminate = 1;
						API_CONTRACT_TERMINATE_LIST({
							orderId: id
						}).then(res => {
							if (res.success) {
								this.contractTerminationList = res.data.list;
								const lastStatus = cloneDeep(res.data.list).pop();
								const statusApplyDate = {};
								res.data.list?.forEach(item => {
									statusApplyDate[item.status] = item.createTime;
								});
								// 终止类型为非交易双方达成一致
								if (lastStatus && lastStatus.terminateType != 'RESCISSION_OF_AGREEMENT') {
									this.contractTerminationStatus = cloneDeep(
										contractTerminationEnum['NO_RESCISSION_OF_AGREEMENT'][lastStatus.status]
									);
									this.contractTerminationStatus?.forEach(item => {
										if (res.data.initiatorCompanyName) {
											item.text = item.text.replace('发起合同终止', res.data.initiatorCompanyName + '发起合同终止');
											item.text = item.text.replace('发起方', res.data.initiatorCompanyName);
										}
										if (res.data.receiveCompanyName) {
											item.text = item.text.replace('接收方', res.data.receiveCompanyName);
										}
										if (statusApplyDate[item.status]) {
											item.createTime = statusApplyDate[item.status];
											item.rejectReason = statusRejectReason[item.status];
										}
									});
									// 终止类型为交易双方达成一致
								} else {
									let type = '';
									if (
										['TWO_SIDES_DOCKING', 'ONLY_INITIATE_DOCKING'].includes(this.detailData?.contract?.terminalContractDockedOA)
									) {
										type = 'RESCISSION_OF_AGREEMENT_OA';
									} else {
										type = 'RESCISSION_OF_AGREEMENT';
									}
									if (['CANCELLATION', 'AUDITING_REJECT', 'CONFIRM_REJECT'].includes(lastStatus.status)) {
										if (res.data.initiatorRejectCancellation) {
											this.contractTerminationStatus = cloneDeep(contractTerminationEnum[type][`${lastStatus.status}_1`]);
										} else {
											this.contractTerminationStatus = cloneDeep(contractTerminationEnum[type][`${lastStatus.status}_2`]);
										}
									} else {
										this.contractTerminationStatus = cloneDeep(contractTerminationEnum[type][lastStatus.status]);
									}
									this.contractTerminationStatus?.forEach(item => {
										if (res.data.initiatorCompanyName) {
											item.text = item.text.replace('发起合同终止', res.data.initiatorCompanyName + '发起合同终止');
											item.text = item.text.replace('发起方', res.data.initiatorCompanyName);
										}
										if (res.data.receiveCompanyName) {
											item.text = item.text.replace('接收方', res.data.receiveCompanyName);
										}
										if (statusApplyDate[item.status]) {
											item.createTime = statusApplyDate[item.status];
											item.rejectReason = statusRejectReason[item.status];
										}
									});
								}
								const cloneItem = this.contractTerminationStatus[this.contractTerminationStatus.length - 1];
								cloneItem.createTime = this.contractTerminationStatus[this.contractTerminationStatus.length - 2].createTime;
								this.$set(this.contractTerminationStatus, this.contractTerminationStatus.length - 1, cloneItem);
							}
						});
					} else {
						this.isShowTerminate = 0;
					}
				}
			});
		},
		// 获取tabs计数情况
		getTabNum() {
			let id = this.$route.query.id;
			API_getOrderDispatchAndGoodsTransferResp({ orderId: id }).then(res => {
				if (res.success) {
					this.$set(this.num, 'dispatchAndGoodsTransferTabNum', res.data.dispatchAndGoodsTransferTabNum);
				}
			});
			API_getOrderPaymentResp({ orderId: id }).then(res1 => {
				if (res1.success) {
					this.$set(this.num, 'paymentTabNum', res1.data.paymentTabNum);
				}
			});
			API_getOrderStatementResp({ orderId: id }).then(res2 => {
				if (res2.success) {
					this.$set(this.num, 'statementTabNum', res2.data.statementTabNum);
				}
			});
			API_getOrderInvoiceInfoResp({ orderId: id }).then(res3 => {
				if (res3.success) {
					this.$set(this.num, 'orderInvoiceTabNum', res3.data.orderInvoiceTabNum);
				}
			});
			const params = {
				contractNo: this.detailData.contract.serialNo,
				contractType: 'ONLINE',
				storageRecordType: this.type == 'SELL' ? 'OUT' : 'IN'
			};
			// 获取 出入库信息 总数
			getInOutDetailList(params).then(res => {
				this.$set(this.num, 'inOutTabNum', res.data.total);
			});
		},
		// 获取预警信息详情
		getWarningDetail() {
			API_ccountOrderContractRiskAlertById({ orderId: this.$route.query.id }).then(res => {
				if (res.success) {
					this.warningNum = res.data;
				}
			});
		},
		// 获取详情
		getDetail() {
			return API_getOrderContractDetailById({ orderId: this.$route.query.id }).then(res => {
				if (res.success) {
					this.detailData = res.data;
					// 业务账号字段--businessNo
					if (this.detailData.acceptUser) {
						let str = '';
						str =
							this.$route.query.type === 'BUY'
								? this.detailData.acceptUser.buyerUserName
								: this.detailData.acceptUser.sellerUserName;
						this.detailData.businessNo = this.detailData.acceptUser ? str : '-';
					}
					// 获取操作按钮
					this.detailData.contract.buyerUscc = this.detailData.contract.buyCompanyUscc;
					this.detailData.contract.sellerUscc = this.detailData.contract.sellerCompanyUscc;
					// 关联合同需要的参数
					this.detailData.contract.transType = this.detailData.contractDelivery.transportMode;
					this.detailData.contract.deliveryDateBegin = this.detailData.contractDelivery.deliveryStartDate;
					this.detailData.contract.deliveryDateEnd = this.detailData.contractDelivery.deliveryEndDate;
					this.detailData.contract.coalTypeDesc = this.filterCoalTypeContent(this.detailData.contract.coalType);
					this.detailData.contract.contractId = this.detailData.contractId;
					this.detailData.contract.terminalDirector = this.detailData.contract.terminalDirectorName;

					this.actionNode = getContractAction(
						this.detailData.contract,
						this.type,
						this.VUEX_ST_COMPANYSUER,
						this.VUEX_ST_USERAUTH,
						this.VUEX_CURRENT_PLATEFORM
					);
					this.actionNode = this.actionNode.filter(item => item.text !== '合同详情');
				}
			});
		},
		// 获取合同信息字段的最小宽度
		getmaxWidth() {
			if (this.clientWidth < 1366) {
				this.maxWidth = 80;
			} else if (this.clientWidth < 1560) {
				this.maxWidth = 80;
			} else if (this.clientWidth < 1920) {
				this.maxWidth = 200;
			} else if (this.clientWidth < 2160) {
				this.maxWidth = 210;
			} else if (this.clientWidth < 3000) {
				this.maxWidth = 280;
			} else {
				this.maxWidth = 320;
			}
		},
		tabChange(key) {
			this.$nextTick(() => {
				this.$refs[key].init();
			});
		},
		// 鼠标移入复制合同编号
		onMouseOverContractNo() {
			this.copyContractNoVisible = true;
		},
		// 鼠标移出
		onMouseOutContractNo() {
			this.copyContractNoVisible = false;
		},
		// 鼠标移入复制合同编号
		onMouseOverOrderNo() {
			this.copyOrderNoVisible = true;
		},
		// 鼠标移出
		onMouseOutOrderNo() {
			this.copyOrderNoVisible = false;
		},
		// 复制成功 or 失败（提示信息！！！）
		onCopy: function (e) {
			this.$message.success('复制成功');
		},
		onError: function (e) {
			this.$message.error('复制失败');
		},
		// 打开派车计划
		despatchCode() {
			this.$refs.despatchCodeModal.show(this.detailData.contract);
		},
		// 风险预警
		warningFunc() {
			const routeData = this.$router.resolve({
				path: '/center/message/index',
				query: {
					contractNo: this.detailData.contract.contractNo
				}
			});
			window.open(routeData.href, '_blank');
		},
		// 操作函数
		clickFn(func) {
			if (!this.$refs.contractFunc) {
				return;
			}
			if (typeof this.$refs.contractFunc[func] == 'function') {
				this.$refs.contractFunc[func] && this.$refs.contractFunc[func]();
			}
		}
	}
};
</script>
<style lang="less" scoped>
.slMain {
	font-family:
		PingFangSC-Regular,
		PingFang SC;
	.label,
	.fontlabel {
		color: rgba(0, 0, 0, 0.4);
	}
	.slTitle {
		margin-bottom: 20px;
	}
	.titleInfoBox {
		.titleInfoItem {
			width: 22%;
			margin-right: 3%;
			display: inline-block;
			padding-left: 130px;
			position: relative;
			height: 40px;
			float: left;
			.label {
				position: absolute;
				left: 0;
				top: 0;
				display: inline-block;
				width: 130px;
				text-align: right;
			}
			.w85 {
				width: 130px;
			}
			.pl85 {
				padding-left: 130px;
			}
			.w130 {
				width: 130px;
			}
		}
		.titleInfoItem.more {
			overflow: inherit;
			width: 44%;
		}
		// .more-margin-left {
		//   margin-left: -5px;
		// }
		.titleInfoItem.pl85 {
			padding-left: 130px;
			.textOverflow {
				left: 130px !important;
			}
		}
		.titleInfoTitle {
			margin-bottom: 20px;
			font-size: 16px;
			font-family:
				PingFangSC-Medium,
				PingFang SC;
			font-weight: 500;
			line-height: 22px;
		}
	}
	.ant-card {
		padding: 20px 30px;
		margin-bottom: 20px;
	}
	.ant-card:last-child {
		margin-bottom: 0;
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
		top: -1px;
	}
	.copy-icon {
		width: 14px;
		height: 14px;
		cursor: pointer;
	}
	.copy-icon-box {
		display: inline-block;
		padding-left: 10px;
		position: absolute;
		top: 1px;
	}
	.copy-contract-icon {
		margin-left: 16px;
		cursor: pointer;
		position: relative;
		top: 1px;
		display: inline-block;
		width: 14px;
		height: 14px;
	}
	.QR-code-icon {
		cursor: pointer;
		position: relative;
		top: 1px;
		width: 14px;
		height: 14px;
	}
	.mobile-icon {
		margin: 0 14px 0 6px;
		cursor: pointer;
		svg {
			position: relative;
			top: 2px;
		}
	}
	.pt0 {
		padding-top: 0;
	}
	.tabs-content {
		width: 100%;
		& > ::v-deep.ant-row-flex {
			width: 100%;
		}
	}
	::v-deep.ant-descriptions {
		font-weight: 400;
		line-height: 20px;
		padding-top: 10px;
		.ant-descriptions-item-label {
			background-color: rgba(243, 245, 246, 1);
			color: #77889d;
		}
		.ant-descriptions-item-content {
			color: rgba(0, 0, 0, 0.8);
		}
	}

	.slBtn {
		margin-left: 30px;
	}

	.mt32 {
		margin-top: 32px;
	}

	.right-top-box {
		// display: flex;
		// flex-direction: row;
		// justify-content: flex-end;
		.slBtn {
			margin-left: 0;
			width: 88px;
		}
		.warning-box {
			width: 88px;
			height: 101px;
			background: #dae0e6;
			border-radius: 6px;
			padding: 4px;
			margin-top: 10px;
			cursor: pointer;
			.warning-title {
				font-size: 14px;
				font-family:
					PingFangSC-Medium,
					PingFang SC;
				font-weight: 500;
				color: #ffffff;
				line-height: 24px;
				width: 80px;
				height: 24px;
				background: #ff800f;
				border-radius: 4px;
				text-align: center;
			}
			.warning-num {
				width: 80px;
				height: 65px;
				background: #ffffff;
				border-radius: 4px;
				font-size: 40px;
				font-family:
					PingFangSC-Regular,
					PingFang SC;
				font-weight: 400;
				color: rgba(0, 0, 0, 0.8);
				line-height: 65px;
				margin-top: 4px;
				text-align: center;
			}
		}
	}

	.twenty-percent {
		.flex-box {
			width: 20%;
			display: flex;
			flex-direction: row;
			justify-content: flex-start;
			align-items: center;
			position: relative;
			& > img {
				width: 72px;
				height: 72px;
			}
			.flex-text {
				width: 50%;
				display: inline-block;
				font-size: 14px;
				font-family:
					PingFangSC-Medium,
					PingFang SC;
				font-weight: 500;
				color: rgba(0, 0, 0, 0.8);
				line-height: 20px;
				margin-left: 16px;
				.label {
					font-size: 16px;
					color: rgba(0, 0, 0, 0.25);
					line-height: 22px;
					margin: 5px 0 10px 0;
				}
			}
			.progress-icon {
				width: 14px;
				height: 14px;
				cursor: pointer;
				top: 1px;
			}
			&::after {
				content: '';
				width: 1px;
				height: 32px;
				background: #e5e6eb;
				position: absolute;
				right: 16px;
				top: 20px;
			}
		}
		.flex-box:last-child {
			&::after {
				display: none;
			}
		}
	}

	.textOverflow {
		left: 130px !important;
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
				// top: -1px;
			}
		}
	}
	.status-frozen {
		width: auto;
		height: 20px;
		line-height: 20px;
		display: inline-block;
		padding: 1px 6px;
		border-radius: 4px;
		background: #f8dde8;
		color: #db81a5;
		font-size: 12px;
	}
	.status-frozen-desc {
		width: auto;
		height: 20px;
		display: inline-block;
		line-height: 20px;
		padding: 1px 6px;
		border-radius: 4px;
		background: #ffdac8;
		font-size: 12px;
		color: #ff7937;
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
}
// 小于1366 以1300为准
@media screen and (min-width: 1920px) {
	.copy-icon-box {
		left: 310px !important;
	}
}
@media screen and (max-width: 1366px) {
	.flex-top-box {
		.ant-col:last-child {
			flex: 0 0 88px !important;
		}
	}
}
@media screen and (max-width: 1919px) {
	.copy-icon-box {
		left: 310px !important;
	}
}
@media screen and (max-width: 1559px) {
	.copy-icon-box {
		left: 220px !important;
	}
}
@media screen and (max-width: 1365px) {
	.copy-icon-box {
		left: 190px !important;
	}
}
</style>
<style lang="less">
.white-bg-tooltips {
	a {
		display: block;
		margin: 5px 0;
		line-height: 22px;
	}
	.ant-tooltip-inner {
		background: #fff;
		padding: 10px 20px;
	}
	.ant-tooltip {
		color: #fff;
	}
	.ant-tooltip-arrow::before {
		background-color: #fff;
	}
}
.progress-bar-tooltips {
	.ant-progress-status-success .ant-progress-bg {
		background-color: @primary-color !important;
	}
	.ant-progress-bg {
		background-color: @primary-color!important;
	}
	.ant-tooltip-inner {
		position: relative;
		.ant-progress {
			padding-right: 40px;
		}
		.ant-progress-inner {
			width: 100px;
		}
		.percent-bg {
			position: absolute;
			right: 3px;
			top: 8px;
			font-size: 12px;
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
			right: 47px;
			top: 8px;
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
}
</style>
