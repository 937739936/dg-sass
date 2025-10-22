<template>
	<div class="slMain">
		<breadcrumb></breadcrumb>
		<div class="detail-container">
			<div class="basic-info-card">
				<div class="page-title">付款详情</div>
				<div class="pay-base-info-container">
					<div class="payment-num-info">
						<em class="payTypeSymbol">付</em>
						<div
							@mouseenter="copyPaymentNoVisible=true"
							@mouseleave="copyPaymentNoVisible=false">
							<span class="payment-num">付款流水号：{{ paymentNo }}</span>
							<span
								v-show="!copyPaymentNoVisible"
								class="copy-icon"
								>
								<Copy></Copy>
							</span>
							<span
								v-show="copyPaymentNoVisible"
								v-clipboard:success="onCopy" 
								v-clipboard:error="onError"  
								v-clipboard:copy="paymentNo"
								class="copy-icon"
								>
								<CopyNow></CopyNow>
							</span>
						</div>
						<slot name="statusTag">
							<PaymentStatusTag :statusDes="basicInfo.paymentStatusDesc" />
						</slot>
					</div>
					<div class="base-info">
						<BaseInfoDescriptions
							:dataSource="displayItems"
							:columnsCountOneRow="3"
						>
							<template slot="auditChainAndOperator">
								<div class="operator-info">
									<div
										v-for="(operatorInfo, index) in auditChainOperators"
										:key="index"
										class="operator-info-item"
									>
										<span>{{ operatorInfo.systemName }}({{ operatorInfo.operatorName }})</span>
										<a-tooltip placement="top">
											<template
												v-if="operatorInfo.operatorMobile"
												slot="title"
											>
												<div style="white-space: pre-wrap">{{ operatorInfo.operatorMobile }}</div>
											</template>
											<em class="operator-phone-icon">
												<Phone></Phone>
											</em>
										</a-tooltip>
									</div>
								</div>
							</template>
						</BaseInfoDescriptions>
					</div>
					<PaymentSteps
						v-if="processChains.length > 0"
						:style="{marginTop: '30px'}"
						:paymentNo="paymentNo"
						:processChains="processChains"
						:statusTipInfo="statusTipInfo"
						@getStepStatusTip="getStepStatusTip"
					/>
				</div>
			</div>
			<div class="content-card">
				<a-tabs :animated="true">
					<a-tab-pane
						key="PAYMENT_INFO"
						tab="付款信息"
					>
						<div class="payment-info-list">
							<div class="payment-base-info">
								<BaseInfoDescriptions title="付款信息" :dataSource="paymentInfoDesItems" bordered>
									<template slot="receiveAccNo">
										<a-tooltip v-if="receiveAccNo" placement="topRight" :align="{ offset: [12, 0] }">
											<template slot="title" v-if="bankCardTip">
												<div style="white-space: pre-wrap">{{ bankCardTip }}</div>
											</template>
											<div class="description-item-bank-card">
												<span>{{ receiveAccNo || '-' }} </span>
												<div class="bank-card-icon"></div>
											</div>
										</a-tooltip>
										<span v-else> - </span>
									</template>
									<template slot="payAmount" slot-scope="item">
										<span v-if="item.value" class="payAmount">
											<!-- <span class="payAmount-icon">¥ </span> -->
											<NumberFormatView :value="item.value" :isShowMoneyTip="true" :isShowMoneyIcon="true" />
										</span>
										<span v-else class="payAmount"> - </span>
									</template>
								</BaseInfoDescriptions>
							</div>
							<UpSettleTable
								style="margin-top: 26px;"
								v-if="isShowUpSettle"
								title="结算单"
								:dataSource="statementVOList"
								@openNewTabPage="openNewTabPage"
							/>
							<InvoiceInfo
								style="margin-top: 26px;"
								v-if="isShowUpInvoice"
								title="发票"
								ref="invoiceInfo"
								@openNewTabPage="openNewTabPage"
								fromType="detail"
							/>
							<AttachmentTable
								style="margin-top: 26px;"
								v-if="isShowAttachment"
								title="附件"
								:dataSource="fileInfoList"
								@downloadAttachment="downloadAttachment"
							/>
						</div>
					</a-tab-pane>
					<a-tab-pane
						key="OPERATION_RECORD"
						tab="操作记录"
					>
						<OperationRecordTable :dataSource="paymentOperateLogList"></OperationRecordTable>
					</a-tab-pane>
				</a-tabs>
			</div>
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
import PaymentStatusTipMixins from '@/v2/center/trade/views/pay/components/PaymentStatusTipMixins';
import breadcrumb from '@/v2/components/breadcrumb/index';
import PaymentDetailInfo from '@sub/trade/pay/components/payDetail/PaymentDetailInfo';
import PaymentStatusTag from '@/v2/center/trade/views/pay/components/PaymentStatusTag';
import BaseInfoDescriptions from '@sub/components/base/BaseInfoDescriptions';
import PaymentSteps from '@sub/trade/pay/components/payDetail/PaymentSteps';
import NumberFormatView from '@sub/trade/pay/components/NumberFormatView';
import UpSettleTable from '@sub/trade/pay/components/payDetail/UpSettleTable';
import InvoiceInfo from './components/InvoiceInfo';
import AttachmentTable from '@sub/trade/pay/components/payDetail/AttachmentTable';
import OperationRecordTable from '@sub/trade/pay/components/payDetail/OperationRecordTable';
import { formatAccountNumber } from '@sub/utils/factory';
import { API_GetPaymentDetail, API_GetCollectDetail, API_PaymentAttachDownload } from '@/v2/center/trade/api/pay';
import comDownload from '@sub/utils/comDownload.js';
import { Copy, CopyNow, Phone } from '@sub/components/svg'

export default {
	name: 'PayCollectDetail',
	mixins: [PaymentStatusTipMixins],
	components: {
		breadcrumb,
		PaymentDetailInfo,
		PaymentStatusTag,
		BaseInfoDescriptions,
		PaymentSteps,
		NumberFormatView,
		UpSettleTable,
		InvoiceInfo,
		AttachmentTable,
		OperationRecordTable,
		Copy,
		CopyNow,
		Phone,
	},
	data() {
		// 付款详情信息
		let { id } = this.$route.query;
		return {
			paymentId: id,
			loading: false,
			detailInfo: {}, // 付款详情信息
			copyContractNoVisible: false,
			copyPaymentNoVisible: false,
		};
	},
	mounted() {
		this.getDetailInfo();
	},
	provide() {
		return {
			pageType: 'PAY'
		};
	},
	computed: {
		// 非空详情信息
		detailInfoNonEmpty() {
			return this.detailInfo || {};
		},
		// 付款单号
		paymentNo() {
			return this.detailInfoNonEmpty.paymentNo || '';
		},
		// 基本信息
		basicInfo() {
			return this.detailInfoNonEmpty.basicInfo || {};
		},
		// 合同信息
		contractVO() {
			return this.detailInfoNonEmpty.contractVO || {};
		},
			// 流程发起人信息
		auditChainAndOperator() {
			return this.detailInfoNonEmpty.auditChainAndOperator || {};
		},
		// 流程发起人信息列表
		auditChainOperators() {
			return this.auditChainAndOperator.operatorInfo || [];
		},
		// 付款流程链
		processChains() {
			return this.detailInfoNonEmpty.processChains || [];
		},
		// 计算属性，返回当前显示的项
		displayItems() {
			let contractVO = this.contractVO;
			let basicInfo = this.basicInfo;
			let auditChainAndOperator = this.auditChainAndOperator;
			let items = [
				{
					label: '所属合同编号',
					value: contractVO.contractNo,
					click: () => {
						this.openNewTabPage('CONTRACT_DETAIL', contractVO)
					},
					isNeedCopy: true
				}
			];
			items.push({
				label: '付款单位',
				value: contractVO.buyerName || '-'
			});
			items.push({
				label: '收款单位',
				value: contractVO.sellerName || '-'
			});
			items.push({
				label: '创建时间',
				value: basicInfo.createTime || '-'
			});
			if (auditChainAndOperator.needPushOA) {
				// 需要推送OA，则显示流程发起人信息
				items.push({
					label: '流程发起人',
					value: '',
					scopedSlots: {
						customRender: 'auditChainAndOperator'
					}
				});
			}
			return items;
		},
		receiveAccNo() {
      let basicInfo = this.basicInfo ?? {};
      return formatAccountNumber(basicInfo.receiveAccNo);
    },
    paymentInfoDesItems() {
      let basicInfo = this.basicInfo ?? {};
      let items = [
        {
          label: '付款类型',
          value: basicInfo.paymentTypeDesc || '-',
        },
        {
          label: '付款方式',
          value: basicInfo.paymentMethodDesc || '-',
        },
        {
          label: '收款账号',
          value: this.receiveAccNo,
          scopedSlots: {
            customRender: 'receiveAccNo',
          },
        },
        {
          label: '资金来源',
          value: basicInfo.payTypeName || '-', // 资金类型
        },
        {
          label: '付款日期',
          value: basicInfo.planPayDate || '-', // 付款日期
        },
        {
          label: '付款金额',
          value: basicInfo.payAmount, // 付款金额
          scopedSlots: {
            customRender: 'payAmount',
          },
          style: {
            color: '#ff800f',
          },
          isNotShowOverflowTooltip: true,
        },
      ];
      if (basicInfo.comments) {
        items.push({
          label: '备注',
          value: basicInfo.comments, // 备注
					tipText: basicInfo.comments
        });
      }
      return items;
    },
    bankCardTip() {
      let basicInfo = this.basicInfo ?? {};
      let tip = '';
      if (basicInfo.receiveAccName) {
        tip += '名称：' + basicInfo.receiveAccName;
      }
      if (basicInfo.receiveAccBank) {
        if (tip) {
          tip += '\n';
        }
        tip += '开户行：' + basicInfo.receiveAccBank;
      }
      if (this.receiveAccNo) {
        if (tip) {
          tip += '\n';
        }
        tip += '账号：' + this.receiveAccNo;
      }
      return tip;
    },
		// 上游结算单信息
		statementVOList() {
			return this.detailInfo.statementVOList ?? [];
		},
		// 是否显示上游结算单
		isShowUpSettle() {
			// 付款类型： 结算付款
			let isCanShow = this.basicInfo.paymentType === 'SETTLEMENT';
			return isCanShow && this.statementVOList.length > 0;
		},
		isShowUpInvoice() {
			// 上游发票
			let upStreamInvoiceVO = this.detailInfo.upStreamInvoiceVO || {};
			return (
				(upStreamInvoiceVO.storeInvoiceRecordVOList && upStreamInvoiceVO.storeInvoiceRecordVOList.length > 0) ||
				(upStreamInvoiceVO.transInvoiceList && upStreamInvoiceVO.transInvoiceList.length > 0)
			);
		},
		// 是否显示附件信息
		isShowAttachment() {
			return this.fileInfoList.length > 0;
		},
		// 附件信息
		fileInfoList() {
			return this.detailInfo.fileInfoList ?? [];
		},
		// 操作记录列表
		paymentOperateLogList() {
			return this.detailInfo.paymentOperateLogList || [];
		}
	},
	methods: {
		// 获取付款详情信息
		getDetailInfo() {
			API_GetPaymentDetail({
				paymentId: this.paymentId
			})
				.then(res => {
					if (res.success) {
						this.detailInfo = res.data;
						const upStreamInvoiceVO = this.$route.query.productCode === 'WAREHOUSE_RENT' ? (this.detailInfo?.upStreamInvoiceVO?.storeInvoiceRecordVOList || []) : (this.detailInfo?.upStreamInvoiceVO?.transInvoiceList || []);
						this.$nextTick(()=> {
							if (this.$refs.invoiceInfo && upStreamInvoiceVO.length) {
								this.$refs.invoiceInfo.edit(upStreamInvoiceVO);
							}
						})
					}
				})
				.finally(() => {
					this.loading = false;
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
		 * 线上结算单详情'SETTLEMENT_ONLINE_DETAIL'
		 */
		openNewTabPage(businessType, record) {
			switch (businessType) {
				case 'SETTLEMENT_OFFLINE_DETAIL':
					// 线下采购结算单详情（上游）
					this.openNewWindowTabPage(this.$route.query.productCode === 'WAREHOUSE_RENT' ? '/center/logisticSupervise/statement/storage/detail' : '/center/logisticSupervise/statement/transSettle/detail', {
						statementId: record.id
					});
					break;
				case 'CONTRACT_DETAIL':
					this.openNewWindowTabPage(this.$route.query.productCode === 'WAREHOUSE_RENT' ? '/center/logisticSupervise/contract/storage/detail' : '/center/logisticSupervise/contract/transport/detail', {
						id: record.id
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
		},
		onCopy() {
			this.$message.success('复制成功');
		},
		onError() {
			this.$message.error('复制失败');
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
	.detail-container {
		min-height: 100%;
		display: flex;
		flex-direction: column;
		.basic-info-card {
			margin-bottom: 20px;
			padding: 20px 30px;
			background: #fff;
			border-radius: 4px;
		}
		.content-card {
			// flex: 1;
			flex-grow: 1;
			margin-bottom: -4px;
			padding: 15px 30px 20px;
			background: #fff;
			border-radius: 4px;
		}
		.page-title {
			font-size: 24px;
			font-weight: 500;
			font-family: PingFang SC;
			color: #000000cc;
		}
	}
	.payment-num-info {
		margin-top: 20px;
		display: flex;
		flex-direction: row;
		align-items: center;
		.symbol-icon {
			width: 18px;
			height: 18px;
		}
		.payment-num {
			margin-left: 12px;
			font-size: 16px;
			font-weight: 500;
			font-family: PingFang SC;
			color: #000000cc;
		}
		.copy-icon {
			margin-left: 12px;
			margin-right: 20px;
			width: 14px;
			height: 14px;
			cursor: pointer;
		}
	}
	.pay-base-info-container {
		.base-info {
			margin-top: 20px;
			.operator-info {
				display: flex;
				flex-direction: row;
				align-items: flex-start;
				flex-wrap: wrap;
				.operator-info-item {
					margin-right: 14px;
					display: flex;
					flex-direction: row;
					align-items: center;
					font-size: 14px;
					.operator-phone-icon {
						margin-left: 14px;
						width: 10px;
						height: 14px;
						cursor: pointer;
						position: relative;
						top: -2px;
					}
				}
			}
		}
	}
}
.payment-info-list {
	width: 100%;
}
.payment-base-info {
  width: 100%;
  margin-bottom: 50px;
  .description-item-bank-card {
    display: flex;
    align-items: center;
    flex-direction: row;
    span {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
    .bank-card-icon {
      flex-shrink: 0;
      margin-left: 4px;
      width: 14px;
      height: 10px;
      cursor: pointer;
      background: url(~@sub/assets/imgs/trade/pay/bank_card_active.png) no-repeat center;
      background-size: 100% 100%;
    }
  }
  .payAmount {
    color: #ff800f;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    .payAmount-icon {
      font-family: PingFangSC-Regular, PingFang SC;
    }
  }
}
.payTypeSymbol {
	display: inline-block;
	width: 18px;
	height: 18px;
	background:@primary-color;
	color: #fff;
	text-align: center;
	line-height: 18px;
	border-radius: 4px;
	font-style: normal;
	font-size: 14px;
}

</style>