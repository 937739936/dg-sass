<template>
	<div class="slMain">
		<div>
			<slot
				name="topActions"
				:slot-scope="detailInfo"
			>
				<div
					v-if="isShowCollectConfirmTip"
					class="confirm-tip-view"
				>
					<img
						class="tip-icon"
						src="@/v2/assets/imgs/common/warning_tip_icon.png"
						alt=""
					/>
					<span>{{ confirmTipText }}</span
					><a-statistic-countdown
						:value="confirmTimeDeadline"
						format="D天H时m分s秒"
						:valueStyle="{ fontSize: '14px', color: '#f3830d' }"
					/>
				</div>
			</slot>
			<breadcrumb></breadcrumb>
			<a-spin :spinning="loading">
				<PaymentDetailInfo
					:pageType="pageType"
					:detailInfo="detailInfo"
					:statusTipInfo="statusTipInfo"
					@downloadAttachment="downloadAttachment"
					@openNewTabPage="openNewTabPage"
					@getStepStatusTip="getStepStatusTip"
				>
					<template slot="statusTag">
						<PaymentStatusTag
							:statusDes="basicInfo.paymentStatusDesc"
							:status="basicInfo.paymentStatus"
							:paymentNo="detailInfo.paymentNo"
						/>
					</template>
				</PaymentDetailInfo>
			</a-spin>
		</div>
		<div class="pay-detail-bottom">
			<slot
				name="bottomActions"
				:detailInfo="detailInfo"
			></slot>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
import PaymentStatusTipMixins from './PaymentStatusTipMixins';
import breadcrumb from '@/v2/components/breadcrumb/index';
import PaymentDetailInfo from '@sub/trade/pay/components/payDetail/PaymentDetailInfo';
import PaymentStatusTag from './PaymentStatusTag';
import { API_GetPaymentDetail, API_GetCollectDetail, API_PaymentAttachDownload } from '@/v2/center/trade/api/pay';
import moment from 'moment';
import comDownload from '@sub/utils/comDownload.js';

export default {
	name: 'PayCollectDetail',
	mixins: [PaymentStatusTipMixins],
	components: {
		breadcrumb,
		PaymentDetailInfo,
		PaymentStatusTag
	},
	props: {
		pageType: {
			type: String,
			default: 'PAY' // 页面类型：付款'PAY' / 收款'COLLECT' / 收款确认'COLLECT_CONFIRM'
		}
	},
	provide() {
		return {
			pageType: this.pageType
		};
	},
	data() {
		// 付款详情信息
		let { id } = this.$route.query;
		return {
			paymentId: id,
			loading: false,
			detailInfo: {} // 付款详情信息
		};
	},
	mounted() {
		this.getDetailInfo();
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		paymentNo() {
			return this.detailInfo.paymentNo || '';
		},
		basicInfo() {
			return this.detailInfo.basicInfo || {};
		},
		// 是否显示收款确认提示
		isShowCollectConfirmTip() {
			let isShow = false;
			if (!this.paymentNo) {
				// 未获取到付款号(付款详情)，不显示提示
				return false;
			}
			if (
				this.pageType === 'COLLECT_CONFIRM' ||
				(this.pageType === 'PAY' && this.basicInfo.paymentStatus === 'WAIT_REPAY_CONFIRM')
			) {
				// 收款确认页面或付款页面，且状态为待确认收款
				isShow = true;
			}
			return isShow;
		},
		// 收款确认提示倒计时截止日期
		confirmTimeDeadline() {
			let waitRepayConfirmTime = this.basicInfo.waitRepayConfirmTime;
			let receiveConfirmExpireDay = this.basicInfo.receiveConfirmExpireDay;
			return moment(waitRepayConfirmTime).add(receiveConfirmExpireDay, 'days').format('YYYY-MM-DD HH:mm:ss');
		},
		// 收款确认提示文字
		confirmTipText() {
			let receiveConfirmExpireDay = this.basicInfo.receiveConfirmExpireDay;
			if (!receiveConfirmExpireDay) {
				return '';
			}
			let tip = '';
			if (this.pageType === 'COLLECT_CONFIRM') {
				tip = `请及时进行收款确认操作，如果超过${receiveConfirmExpireDay}天仍未操作，系统将自动完成收款确认，目前还剩`;
			} else if (this.pageType === 'PAY' && this.basicInfo.paymentStatus === 'WAIT_REPAY_CONFIRM') {
				tip = `等待收款方进行收款确认，如果超过${receiveConfirmExpireDay}天仍未操作，系统将自动完成收款确认，目前还剩`;
			}
			return tip;
		}
	},
	methods: {
		// 获取付款详情信息
		getDetailInfo() {
			let API_GetDetailInfo = API_GetPaymentDetail;
			if (this.pageType === 'COLLECT_CONFIRM' || this.pageType === 'COLLECT') {
				API_GetDetailInfo = API_GetCollectDetail;
			}
			this.loading = true;
			API_GetDetailInfo({
				paymentId: this.paymentId
			})
				.then(res => {
					if (res.success) {
						this.detailInfo = res.data;
					}
				})
				.finally(() => {
					this.loading = false;
					// this.detailInfo = getTestDetailInfo();
				});
		},
		downloadAttachment(attach) {
			let params = {
				paymentNo: this.paymentNo
			};
			if (attach && attach.type) {
				params.attachType = attach.type;
			}
			this.downloadAttachmenting = true;
			API_PaymentAttachDownload(params)
				.then(res => {
					comDownload(res.data, undefined, res.name);
				})
				.finally(() => {
					this.downloadAttachmenting = false;
				});
		},
		getStepStatusTip(visible, stepInfo) {
			this.getPaymentStatusTip(visible, stepInfo);
		},
		cancel() {},
		reject() {},
		confirm() {},
		/**
		 * 打开新的页面
		 * @param {string} businessType 业务类型
		 * 合同详情'CONTRACT_DETAIL'
		 * 业务线详情'BUSINESSLINE_DETAIL'
		 * 资产详情'ASSET_DETAIL'
		 * 发货详情'GOODS_SEND_DETAIL'
		 * 货转详情'GOODS_TRANSFER_DETAIL'
		 * 回款详情'RETURNED_DETAIL'
		 * 退款详情'REFUND_DETAIL'
		 * 付款详情'PAY_DETAIL'
		 * 线上结算单详情'SETTLEMENT_ONLINE_DETAIL'
		 * 线下结算单详情'SETTLEMENT_OFFLINE_DETAIL'
		 * 线上下游结算单详情'SETTLEMENT_ONLINE_DETAIL_SELL'
		 * 线下下游结算单详情'SETTLEMENT_OFFLINE_DETAIL_SELL'
		 * 运费发票详情'FREIGHT_INVOICE_DETAIL'
		 * 上游贸易发票详情'UP_TRADING_INVOICE_DETAIL'
		 * 下游贸易发票详情'DOWN_TRADING_INVOICE_DETAIL'
		 */
		openNewTabPage(businessType, record) {
			switch (businessType) {
				case 'CONTRACT_DETAIL':
					{
						// 合同详情
						let orderId = record.id;
						let contractType = record.contractType;
						let contractDetailPath = '';
						// 判断采购还是销售
						let { buyerUscc } = record;
						let { companyUscc, companyType } = this.VUEX_ST_COMPANYSUER;
						let type = 'SELL';
						if (buyerUscc === companyUscc) {
							type = 'BUY';
						}
						// 如果是矿方，进入自己地址
						if (companyType === 'COAL_MINE') {
							contractDetailPath = '/center/coal/sellContract/detail';
						} else {
							switch (contractType) {
								case 'ONLINE':
									contractDetailPath =
										type === 'BUY' ? '/center/contract/buy/online/detail' : '/center/contract/sell/online/detail';
									break;
								case 'OFFLINE':
									contractDetailPath =
										type === 'BUY' ? '/center/contract/buy/offline/detail' : '/center/contract/sell/offline/detail';
									break;
								case 'TRANSPORT':
									contractDetailPath = '/center/contract/transport/detail';
									break;
							}
						}
						this.openNewWindowTabPage(contractDetailPath, {
							id: orderId,
							type
						});
					}

					break;
				case 'BUSINESSLINE_DETAIL':
					// 业务线详情
					this.openNewWindowTabPage('/center/businessline/detail', {
						businessLineNo: record.businessLineNo,
						upOrderNo: record.upOrderNo,
						downOrderNo: record.downOrderNo,
						businessLineType: record.businessLineType
					});
					// this.openNewWindowTabPage('/center/monitoring/dynamicMonitoring/detail', {
					// 	businessLineNo: record.businessLineNo,
					// 	upOrderNo: record.upOrderNo,
					// 	downOrderNo: record.downOrderNo,
					// 	businessLineType: record.businessLineType,
					// 	contractType: 0,
					// 	contractContentActiveIndex: 0,
					// 	cashTabIndex: 0,
					// 	downstreamActiveIndex: 0
					// });
					break;
				case 'ASSET_DETAIL': {
					// 资产详情
					let assetType = record.assetType;
					let receivableId = record.receivableId;
					let assetPath = '';
					let activeIndex = 0;
					switch (assetType) {
						case 'PRE_PAYMENT':
							// 预付
							assetPath = '/center/assets/advance/detail';
							break;
						case 'ACCOUNTS_RECEIVABLE':
							// 应付
							assetPath = '/center/assets/payable/manage/detail';
							break;
						case 'ACCOUNTS_RECEIVABLE_MODIFY':
							// 应付账款变更
							assetPath = '/center/assets/payable/change/detail';
							activeIndex = 2;
							break;
						case 'ACCOUNTS_RECEIVABLE_DOWN_MANUAL':
							// 下游应收账款-手动录入
							assetPath = '/center/assets/receivable/manual/detail';
							activeIndex = 0;
							break;
					}
					if (assetPath) {
						this.openNewWindowTabPage(assetPath, {
							id: receivableId,
							activeIndex: activeIndex
						});
					}
					break;
				}
				case 'GOODS_SEND_DETAIL':
					{
						// 发货详情地址
						let detailPath = '/center/receive/send/detail';
						if (this.pageType === 'PAY') {
							// 付款详情点击发货批次跳收货详情
							detailPath = '/center/receive/accept/detail';
						}
						// '发货详情'
						this.openNewWindowTabPage(detailPath, {
							deliverId: record.id
						});
					}
					break;
				case 'GOODS_TRANSFER_DETAIL':
					// this.$router.push({
					// 	path: '/center/transfer/goodsTransfer/detail',
					// 	query: {
					// 		goodsTransferNo
					// 	}
					// });
					// 货转详情
					this.openNewWindowTabPage('/center/transfer/goodsTransfer/detail', {
						goodsTransferNo: record.goodsTransferNo
					});
					break;
				case 'RETURNED_DETAIL':
					// 回款详情-线下合同
					this.openNewWindowTabPage('/center/fund/returned/detail', {
						receiveSerialNo: record.receiveSerialNo
					});
					break;
				case 'REFUND_DETAIL':
					// 退款详情-线上合同
					this.openNewWindowTabPage('/center/fund/refund/detail', {
						id: record.id
					});
					break;
				case 'PAY_DETAIL':
					// 付款详情
					this.openNewWindowTabPage('/center/fund/pay/record/detail', {
						id: record.id
					});
					break;
				case 'SETTLEMENT_ONLINE_DETAIL':
					{
						let path = '/center/settle/buy/onlinedetail';
						let { companyType } = this.VUEX_ST_COMPANYSUER;
						// 如果是矿方，进入自己地址
						if (companyType === 'COAL_MINE') {
							path = '/center/coal/statement/detail';
						}
						// 电子采购结算单详情（上游）
						this.openNewWindowTabPage(path, {
							id: record.id
						});
					}
					break;
				case 'SETTLEMENT_OFFLINE_DETAIL':
					{
						let path = '/center/settle/buy/offlinedetail';
						let { companyType } = this.VUEX_ST_COMPANYSUER;
						// 如果是矿方，进入自己地址
						if (companyType === 'COAL_MINE') {
							path = '/center/coal/statement/detail';
						}
						// 线下采购结算单详情（上游）
						this.openNewWindowTabPage(path, {
							id: record.id
						});
					}
					break;
				case 'SETTLEMENT_ONLINE_DETAIL_SELL':
					{
						let path = '/center/settle/sell/onlinedetail';
						let { companyType } = this.VUEX_ST_COMPANYSUER;
						// 如果是矿方，进入自己地址
						if (companyType === 'COAL_MINE') {
							path = '/center/coal/statement/detail';
						}
						// 电子采购结算单详情（下游）
						this.openNewWindowTabPage(path, {
							id: record.id
						});
					}
					break;
				case 'SETTLEMENT_OFFLINE_DETAIL_SELL':
					{
						let path = '/center/settle/sell/offlinedetail';
						let { companyType } = this.VUEX_ST_COMPANYSUER;
						// 如果是矿方，进入自己地址
						if (companyType === 'COAL_MINE') {
							path = '/center/coal/statement/detail';
						}
						// 线下采购结算单详情（下游）
						this.openNewWindowTabPage(path, {
							id: record.id
						});
					}
					break;
				case 'FREIGHT_INVOICE_DETAIL':
					// 运费发票详情
					this.openNewWindowTabPage('/center/invoice/freight/detail', {
						id: record.id,
						no: record.no,
						type: 'detail',
						invoiceType: 'DELIVER',
						industryType: 'COAL'
					});
					break;
				case 'UP_TRADING_INVOICE_DETAIL':
					// 上游贸易发票详情
					this.openNewWindowTabPage('/center/invoice/buy/detail', {
						id: record.id,
						no: record.no,
						type: 'detail',
						invoiceType: 'INPUT',
						industryType: 'COAL'
					});
					break;
				case 'DOWN_TRADING_INVOICE_DETAIL':
					// 下游贸易发票详情
					this.openNewWindowTabPage('/center/invoice/sell/detail', {
						id: record.id,
						no: record.no,
						type: 'detail',
						invoiceType: 'OUTPUT',
						industryType: 'COAL'
					});
					break;
				default:
					break;
			}
		},
		openNewWindowTabPage(path, query) {
			const { href } = this.$router.resolve({
				path: path,
				query: {
					...query
				}
			});
			window.open(href, '_blank');
		}
	}
};
</script>

<style lang="less" scoped>
.slMain {
	margin-top: -30px;
	min-height: calc(100vh - 44px);
	// padding-bottom: 20px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	// background: blue;
	.pay-detail-bottom {
		// position: sticky;
		// bottom: 0;
		min-height: 24px;
		flex: 1;
		background: #fff;
		z-index: 999;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		border-bottom-left-radius: 4px;
		border-bottom-right-radius: 4px;
	}
	.confirm-tip-view {
		margin-top: 12px;
		background: #fff3e7;
		border-radius: 4px;
		border: 1px solid #ffc279;
		min-height: 44px;
		display: flex;
		align-items: center;
		padding: 14px;
		color: #000000cc;
		font-size: 14px;
		.tip-icon {
			width: 14px;
			height: 14px;
			margin-right: 10px;
		}
		.left-confirm-time {
			color: #f3830d;
		}
	}
}
</style>
