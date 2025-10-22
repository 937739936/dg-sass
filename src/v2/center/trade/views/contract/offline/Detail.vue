<template>
	<div class="slMain">
		<breadcrumb></breadcrumb>
		<a-card
			:bordered="false"
			style="padding-bottom: 12px"
		>
			<div
				class="LONG_TERM_CONTRACT"
				v-if="contractData.contractTermType == 'LONG_TERM_CONTRACT'"
			>
				<div class="mark">
					<div class="text">长协</div>
				</div>
			</div>
			<div
				slot="title"
				class="slTitle"
			>
				<span>线下{{ $route.query.type.toLowerCase() === 'sell' ? '销售' : '采购' }}合同详情</span>
			</div>
			<a-row
				type="flex"
				class="flex-top-box"
			>
				<a-col flex="1">
					<div
						class="titleInfoBox"
						v-if="contractData.contractNo"
					>
						<div class="titleInfoTitle">
							<a-space :size="16">
								<em class="contractTypeSymbol">{{ $route.query.type === 'buy' ? '采' : '销' }}</em>
								<div
									@mouseenter="onMouseOverContractNo()"
									@mouseleave="onMouseOutContractNo()"
								>
									<span style="cursor: pointer">合同编号：{{ contractData.paperContractNo || '-' }}</span>
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
										v-clipboard:copy="contractData.paperContractNo"
										class="copy-contract-icon"
									>
										<CopyNow></CopyNow>
									</span>
								</div>
								<template v-if="['PENDING_AUDITING_REJECT', 'DOUBLE_SIGN_AUDITING_REJECT'].includes(contractData.status)">
									<a-tooltip
										placement="topLeft"
										trigger="hover"
										:destroyTooltipOnHide="true"
										@visibleChange="e => visibleChange(e, contractData)"
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
										<p :class="'contract-status ' + contractData.status">
											<span class="text">{{ contractData.statusDesc }}</span>
										</p>
									</a-tooltip>
								</template>
								<template v-else>
									<p :class="'contract-status ' + contractData.status">
										<span class="text">{{ contractData.statusDesc }}</span>
									</p>
								</template>
							</a-space>
						</div>
						<div class="titleInfoItem">
							<span class="label">卖方企业：</span>
							<TextOverFlow
								v-if="contractData.sellerName"
								:content="contractData.sellerName"
								:maxWidth="maxWidth"
							/>
							<span v-else>-</span>
						</div>
						<div class="titleInfoItem">
							<span class="label">买方企业：</span>
							<TextOverFlow
								v-if="contractData.buyerName"
								:content="contractData.buyerName"
								:maxWidth="maxWidth"
							/>
							<span v-else>-</span>
						</div>
						<div class="titleInfoItem pl85">
							<span class="label w85">业务类型：</span>
							<TextOverFlow
								v-if="contractData.businessTypeDesc"
								:content="contractData.businessTypeDesc || '-'"
								:maxWidth="maxWidth"
							/>
							<span v-else>-</span>
						</div>
						<div class="titleInfoItem">
							<span
								class="label"
								style="width: 120px"
								>业务实际负责人：</span
							>
							<TextOverFlow
								class="name"
								style="left: 112px !important"
								:content="contractData.businessUnitName || '-'"
								:maxWidth="maxWidth"
							/>
						</div>
						<div class="titleInfoItem">
							<span class="label">创建时间：</span>
							<TextOverFlow
								:content="contractData.createTime"
								:maxWidth="maxWidth"
							/>
						</div>
						<div
							class="titleInfoItem"
							v-if="$route.query.type.toUpperCase() === 'BUY' && contractData.inCoalPlanSerialNoList"
						>
							<span class="label">上煤计划：</span>
							<TextOverFlow
								:content="contractData.inCoalPlanSerialNoList.join('、')"
								:maxWidth="maxWidth"
							/>
						</div>
						<div
							class="titleInfoItem"
							v-if="$route.query.type.toUpperCase() === 'SELL' && contractData.outCoalPlanSerialNoList"
						>
							<span class="label">下煤计划：</span>
							<TextOverFlow
								:content="contractData.outCoalPlanSerialNoList.join('、')"
								:maxWidth="maxWidth"
							/>
						</div>
					</div>
				</a-col>
				<a-col flex="0px">
					<div class="right-top-box">
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
									:disabled="!actionNode.length"
									>操作</a-button
								>
							</a-tooltip>
						</template>
					</div>
				</a-col>
			</a-row>
		</a-card>

		<a-card :bordered="false">
			<a-row
				type="flex"
				class="twenty-percent"
			>
				<a-col class="flex-box">
					<img
						v-if="contractData.signStatus == 2"
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
						<p :class="contractData.signStatus == 2 ? '' : 'fontlabel'">
							{{ contractData.signStatus == 2 ? '合同已双签' : '合同未双签' }}
						</p>
					</div>
				</a-col>
				<a-col
					class="flex-box"
					v-if="contractData.contractType == 'UP'"
				>
					<img
						v-if="contractData.paidAmount > 0"
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
						<p v-if="contractData.paidAmount > 0">{{ contractData.paidAmount | formatMoney(2) }}元</p>
						<p
							v-else
							class="fontlabel"
						>
							未付款
						</p>
					</div>
				</a-col>
				<a-col
					class="flex-box"
					v-else
				>
					<img
						v-if="contractData.receivedAmount > 0"
						src="@/v2/assets/imgs/contract/payment_icon.png"
						alt=""
					/>
					<img
						v-else
						src="@/v2/assets/imgs/contract/payment_no_icon.png"
						alt=""
					/>
					<div class="flex-text">
						<p class="label">回款</p>
						<p v-if="contractData.receivedAmount > 0">{{ contractData.receivedAmount | formatMoney(2) }}元</p>
						<p
							v-else
							class="fontlabel"
						>
							未回款
						</p>
					</div>
				</a-col>
				<a-col class="flex-box">
					<img
						v-if="contractData.statementedAmount > 0"
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
						<p v-if="contractData.statementedAmount > 0">
							{{ contractData.statementedQuantity | formatMoney(2) }}吨 | {{ contractData.statementedAmount | formatMoney(2) }}元
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
						v-if="contractData.splitContractAmount > 0"
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
						<p v-if="contractData.splitContractAmount > 0">{{ contractData.splitContractAmount | formatMoney(2) }}元</p>
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
						:data="contractData"
						:type="contractData.contractType == 'UP' ? 'BUY' : 'SELL'"
						:clientWidth="clientWidth"
						:actionBtnDisabled="actionBtnDisabled"
					/>
				</a-tab-pane>
				<a-tab-pane
					key="paymentInfo"
					:tab="'付款信息(' + computedTotal('paymentTabNum') + ')'"
					v-if="contractData.contractType == 'UP'"
				>
					<PaymentInfo
						ref="paymentInfo"
						:contractData="contractData"
						:detail="paymentInfo"
					/>
				</a-tab-pane>

				<a-tab-pane
					key="returnedInfo"
					:tab="'回款信息(' + computedTotal('terminalContractReceivedNum') + ')'"
					v-if="contractData.contractType == 'DOWN'"
				>
					<ReturnInfo
						ref="returnedInfo"
						:contractData="contractData"
						@update="updateReturn"
						:detail="paymentInfo"
					/>
				</a-tab-pane>
				<a-tab-pane
					key="inOutInfo"
					:tab="`${$route.query.type == 'buy' ? '入' : '出'}库信息(${computedTotal('inOutTabNum')})`"
					v-if="contractData.businessType == 'WAREHOUSE_RECEIPTS_PLEDGE'"
				>
					<InOutInfo
						ref="inOutInfo"
						contractType="OFFLINE"
						:type="$route.query.type == 'buy' ? 'IN' : 'OUT'"
						:detailData="contractData"
					/>
				</a-tab-pane>
				<a-tab-pane
					key="statementInfo"
					:tab="'结算信息(' + (computedTotal('statementTabNum') + ')')"
				>
					<StatementInfo
						ref="statementInfo"
						:detail="settleInfo"
					/>
				</a-tab-pane>
				<a-tab-pane
					key="invoiceInfo"
					:tab="'发票信息(' + computedTotal('orderInvoiceTabNum') + ')'"
				>
					<InvoiceInfo
						ref="invoiceInfo"
						:contractData="contractData"
						:detail="invoiceInfo"
						:type="this.$route.query.type"
					/>
				</a-tab-pane>
				<a-tab-pane
					key="contractOperation"
					tab="合同操作记录"
				>
					<ContractOperation
						ref="contractOperation"
						:detail="logInfo"
					/>
				</a-tab-pane>
			</a-tabs>
		</a-card>
		<ContractFun
			ref="contractFun"
			:type="contractType"
		></ContractFun>
	</div>
</template>
<script>
import { filterCodeByValueName } from '@sub/utils/globalCode.js';
import comDownload from '@sub/utils/comDownload.js';
import ENV from '@/v2/config/env';
import { API_GETCURRENTENV, API_DOWNLPREVIEWTE, API_GetDownloadRAR } from '@/v2/center/trade/api/contract';

import breadcrumb from '@/v2/components/breadcrumb/index';
import TextOverFlow from '@sub/components/TextOverflow.vue';
import { getPopupContainer } from '@/v2/utils/factory.js';

import { mapGetters } from 'vuex';

import ContractInfo from '@/v2/center/trade/views/contract/components/downContract/detail/ContractInfo';
import PaymentInfo from '@/v2/center/trade/views/contract/components/downContract/detail/PaymentInfo';
import StatementInfo from '@/v2/center/trade/views/contract/components/downContract/detail/StatementInfo';
import InvoiceInfo from '@/v2/center/trade/views/contract/components/downContract/detail/InvoiceInfo';
import ReturnInfo from '@/v2/center/trade/views/contract/components/downContract/detail/ReturnInfo';
import ContractFun from '@/v2/center/trade/views/contract/components/downContract/ContractFun.vue';
import InOutInfo from '@/v2/center/trade/views/contract/components/detail/InOutInfo';

import ContractOperation from '@/v2/center/trade/views/contract/components/downContract/detail/ContractOperation';

import { getDownContractAction } from '@/v2/center/trade/views/contract/action';
import { Copy, CopyNow } from '@sub/components/svg';
import {
	getBuyDownContractDetail,
	getSellDownContractDetail,
	getWaringDetail,
	getDownContractPayInfo,
	getDownContractSettleInfo,
	getDownContractInvoiceInfo,
	getDownContractLog
} from '@/v2/center/trade/api/downcontract';
import { offlineContractStatusTip, getInOutDetailList } from '@/v2/center/trade/api/contract';

export default {
	data() {
		return {
			contractType: 'buy', //加载补录合同类型
			previewImg: '',
			videoVisible: false,
			contractData: {
				terminalDelivery: {},
				terminalContractExtensionDto: {}
			},
			// new
			getPopupContainer,
			copyContractNoVisible: false, // 复制合同编号icon
			clientWidth: null, //浏览器尺寸
			maxWidth: 0, // 信息文案最大宽度
			actionNode: {}, // 操作节点
			warningNum: 0,
			num: {}, // tab计数
			paymentInfo: {},
			settleInfo: {},
			invoiceInfo: {},
			logInfo: [],
			tipShowText: '' // 合同状态文案
		};
	},
	filters: {
		filterCodeByValueName
	},
	computed: {
		terminalDelivery() {
			return this.contractData.terminalDelivery || {};
		},

		//附件信息
		supplementalInfo() {
			return this.contractData.supplementalInfo || [];
		},
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER',
			VUEX_ST_USERAUTH: 'VUEX_ST_USERAUTH',
			VUEX_CURRENT_PLATEFORM: 'VUEX_CURRENT_PLATEFORM'
		}),
		currentCompanyUscc() {
			return this.VUEX_ST_COMPANYSUER.company.uscc;
		},
		actionBtnDisabled() {
			return ['REJECT', 'APPROVAL_FAIL', 'CANCELLATION', 'FREEZING', 'TERMINATED', 'COMPLETED'].includes(
				this.contractData.status
			);
		}
	},
	created() {
		//判断加载的是采购（上游），还是销售（下游）
		this.contractType = this.$route.query.type || 'buy';

		//加载详情
		this.getDetail();
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
	methods: {
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
		tabChange(key) {
			if (key === 'paymentInfo') {
				this.$nextTick(() => {
					this.$refs[key].init();
				});
			}
		},
		//从补协列表处进入，页面滚动到合同附件模块
		scrollPage() {
			if (this.$route.query.from === 'suppleAgreement') {
				//从补协列表处进入，页面滚动到合同附件模块
				this.$nextTick(() => {
					setTimeout(() => {
						document.getElementById('contractFilesBox').scrollIntoView('smooth');
					});
				});
			}
		},
		async getDetail() {
			let API;
			if (this.contractType == 'sell') {
				API = getSellDownContractDetail; //销售详情
			} else {
				API = getBuyDownContractDetail; //采购详情
			}
			const params = {
				id: this.$route.query.id
			};
			const res = await API(params);
			// 业务负责人
			this.contractData = res.data;
			if (this.contractData.businessOwnershipTeamConfig) {
				this.contractData.businessUnitName = `${this.contractData.businessOwnershipTeamConfig.businessUnitName}-${this.contractData.businessOwnershipTeamConfig.memberName}-${this.contractData.businessOwnershipTeamConfig.memberMobile}`;
			}

			const obj = {};
			this.contractData.contractAttachment.forEach(el => {
				if (!obj[el.type]) {
					obj[el.type] = { fileList: [], typeName: el.typeName, type: el.type };
				}
				obj[el.type].fileList.push(el);
			});
			const contractAttachment = [];
			for (let k in obj) {
				contractAttachment.push(obj[k]);
			}
			this.contractData.contractAttachment = contractAttachment;

			this.actionNode = getDownContractAction(
				this.contractData,
				this.contractType,
				this.VUEX_ST_COMPANYSUER,
				this.VUEX_ST_USERAUTH,
				this.VUEX_CURRENT_PLATEFORM
			);
			this.actionNode = this.actionNode.filter(item => !['下载', '合同详情', '查看'].includes(item.text));

			this.getWarningDetail();

			this.getTabNum();
		},
		//业务线查看详情
		lookDetail(items) {
			this.$router.push({
				path: '/center/monitoring/dynamicMonitoring/detail',
				query: {
					upOrderNo: items.parentOrderNo, // 上游订单号
					downOrderNo: items.orderNo, // 下游订单号
					businessLineType: items.businessLineType, // 业务线类型
					contractType: 0, // 0上游 1下游
					contractContentActiveIndex: 0,
					cashTabIndex: 0,
					id: this.$route.query.id,
					businessLineNo: items.businessLineNo
				}
			});
		},
		//返回
		goback() {
			//判断是否存在上个页面
			if (window.history.length <= 1) {
				//判断是销售还是采购
				if (this.contractType == 'sell') {
					this.$router.push({
						path: '/center/contract/sell/list'
					});
				} else {
					this.$router.push({
						path: '/center/contract/buy/list'
					});
				}
			} else {
				this.$router.back();
			}
		},
		handlePreview(data) {
			let url = data.fileUrl || data.url;
			this.previewImg = url;
			if (this.previewImg.indexOf('.pdf') != -1) {
				window.open(this.previewImg, '_blank');
				return;
			}
			if (
				this.previewImg.indexOf('.doc') > -1 ||
				this.previewImg.indexOf('.docx') > -1 ||
				this.previewImg.indexOf('.xlsx') > -1 ||
				this.previewImg.indexOf('.xls') > -1
			) {
				const jumpUrl = 'https://view.officeapps.live.com/op/view.aspx?src=' + encodeURIComponent(API_GETCURRENTENV(url));
				window.open(jumpUrl, '_blank');
				return;
			}
			if (this.previewImg.indexOf('.rar') > -1 || this.previewImg.indexOf('.zip') > -1) {
				if (data.attachId) {
					API_GetDownloadRAR(data.attachId).then(res => {
						comDownload(res, undefined, data.name + '.zip');
					});
				} else {
					window.open(this.previewImg, '_blank');
				}
				return;
			}
			//判断视频
			if (
				this.previewImg.indexOf('.avi') > -1 ||
				this.previewImg.indexOf('.3gp') > -1 ||
				this.previewImg.indexOf('.mp4') > -1 ||
				this.previewImg.indexOf('.mkv') > -1
			) {
				this.videoVisible = true;
				return;
			}
			this.$refs.viewer.$viewer.show();
		},
		download(record) {
			if (record.type == 'BCXY') {
				// 补充协议附件
				if (record.supplementalFile.length) {
					record.supplementalFile.forEach(item => {
						if (item.attachId) {
							API_GetDownloadRAR(item.attachId).then(res => {
								comDownload(res, undefined, item.name);
							});
						}
					});
				}
			} else {
				if (record.attachId) {
					API_GetDownloadRAR(record.attachId).then(res => {
						comDownload(res, undefined, record.name);
					});
					return;
				}
				let url = record.fileUrl || record.url;
				if (url) {
					let BASE_NET = ENV.BASE_NET;
					API_DOWNLPREVIEWTE(BASE_NET + url).then(res => {
						comDownload(res, null, record.fileName || record.name);
					});
				}
			}
		},
		// 风险预警
		warningFunc() {
			const routeData = this.$router.resolve({
				path: '/center/message/index',
				query: {
					contractNo: this.contractData.contractNo
				}
			});
			window.open(routeData.href, '_blank');
		},
		computedTotal(type) {
			if (this.num[type]) {
				return this.num[type];
			}
			return 0;
		},
		// 获取tabs计数情况
		async getTabNum() {
			let contractNo = this.contractData.contractNo;
			// 收付款 回款
			const res1 = await getDownContractPayInfo({ contractNo });

			this.paymentInfo = res1.data;
			if (this.contractData.contractType == 'UP') {
				this.$set(this.num, 'paymentTabNum', this.paymentInfo.paymentTabNum);
			} else {
				this.$set(this.num, 'terminalContractReceivedNum', this.paymentInfo.terminalContractReceivedNum);
			}

			const res2 = await getDownContractSettleInfo({ contractNo });
			this.settleInfo = res2.data;
			this.$set(this.num, 'statementTabNum', this.settleInfo.statementTabNum);

			const res4 = await getDownContractLog({ contractNo });

			this.logInfo = res4.data;

			const res3 = await getDownContractInvoiceInfo({ contractNo, pageNo: 1, pageSize: 10 });
			this.invoiceInfo = res3.data;
			this.$set(this.num, 'orderInvoiceTabNum', this.invoiceInfo.orderInvoiceTabNum);

			const params = {
				contractNo: this.contractData.contractNo,
				contractType: 'OFFLINE',
				storageRecordType: this.$route.query.type == 'buy' ? 'IN' : 'OUT'
			};
			// 获取 出入库信息 总数
			getInOutDetailList(params).then(res => {
				this.$set(this.num, 'inOutTabNum', res.data.total);
			});
		},
		async updateReturn() {
			let contractNo = this.contractData.contractNo;
			// 收付款 回款
			const res1 = await getDownContractPayInfo({ contractNo });

			this.paymentInfo = res1.data;
			if (this.contractData.contractType == 'UP') {
				this.$set(this.num, 'paymentTabNum', this.paymentInfo.paymentTabNum);
			} else {
				this.$set(this.num, 'terminalContractReceivedNum', this.paymentInfo.terminalContractReceivedNum);
			}
			this.getDetail();
		},
		onMouseOverContractNo() {
			this.copyContractNoVisible = true;
		},
		// 鼠标移出
		onMouseOutContractNo() {
			this.copyContractNoVisible = false;
		},
		// 复制成功 or 失败（提示信息！！！）
		onCopy: function (e) {
			this.$message.success('复制成功');
		},
		onError: function (e) {
			this.$message.error('复制失败');
		},
		// 获取合同信息字段的最小宽度
		getmaxWidth() {
			if (this.clientWidth < 1366) {
				this.maxWidth = 120;
			} else if (this.clientWidth < 1560) {
				this.maxWidth = 150;
			} else if (this.clientWidth < 1920) {
				this.maxWidth = 200;
			} else if (this.clientWidth < 2160) {
				this.maxWidth = 240;
			} else if (this.clientWidth < 3000) {
				this.maxWidth = 280;
			} else {
				this.maxWidth = 320;
			}
		},
		// 获取预警信息详情
		getWarningDetail() {
			const params = {
				contractNo: this.contractData.contractNo
			};
			getWaringDetail(params).then(res => {
				if (res.success) {
					this.warningNum = res.data;
				}
			});
		},
		clickFn(func) {
			this.$refs.contractFun[func](this.contractData);
		}
	},
	components: {
		breadcrumb,
		TextOverFlow,
		ContractInfo,
		PaymentInfo,
		StatementInfo,
		InvoiceInfo,
		ContractOperation,
		ReturnInfo,
		InOutInfo,
		ContractFun,
		Copy,
		CopyNow
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
	.slTitle {
		margin-bottom: 20px;
	}
	.titleInfoBox {
		.titleInfoItem {
			width: 22%;
			margin-right: 1%;
			display: inline-block;
			// padding-left: 112px;
			position: relative;
			height: 40px;
			float: left;
			.label {
				position: absolute;
				left: 0;
				top: 0;
				display: inline-block;
				// width: 112px;
				// text-align: right;
			}
			.w85 {
				width: 85px;
			}
			.pl85 {
				padding-left: 85px;
			}
		}
		.titleInfoItem.more {
			overflow: inherit;
			width: 60%;
		}
		.titleInfoItem.pl85 {
			padding-left: 85px;
			.textOverflow {
				left: 70px !important;
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
		margin-left: 30px;
		position: absolute;
		top: -1px;
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
		top: -1px;
		width: 14px;
		height: 14px;
	}
	.mobile-icon {
		margin: -3px 14px 0 6px;
		cursor: pointer;
		width: 14px;
		height: 14px;
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
		padding: 0 !important;
	}

	.mt32 {
		margin-top: 32px;
	}

	.right-top-box {
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
			width: 25%;
			display: flex;
			flex-direction: row;
			justify-content: flex-start;
			position: relative;
			& > img {
				width: 72px;
				height: 72px;
			}
			.flex-text {
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
		left: 70px !important;
	}
}
// 小于1366 以1300为准
@media screen and (min-width: 1920px) {
	.copy-icon-box {
		left: 250px !important;
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
		left: 250px !important;
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
			background-position: 0 0;
			font-style: normal;
			.text {
				position: relative;
				top: -7px;
				right: -2px;
				font-size: 14px;
				zoom: 0.83;
				display: inline-block;
				width: 40px;
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
.status {
	padding: 3px 5px;
	height: 20px;
	line-height: 20px;
	border-radius: 4px;
	font-size: 14px;
	zoom: 0.85;
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
.DOUBLE_SIGN_AUDITING_REJECT,
.COMPLETED_REJECT {
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
.name {
	/deep/ .titleInfoItem {
		width: 120px;
	}
}
/deep/ .spanItem {
	// font-weight: 500 !important;
	color: rgba(0, 0, 0, 0.8);
}
</style>
