<template>
	<div class="slMain">
		<Breadcrumb />
		<a-card
			:bordered="false"
			v-if="detailData"
		>
			<div class="methods-wrap">
				<span
					slot="title"
					class="slTitle"
					>查看应收账款</span
				>
				<a
					href="javascript:;"
					@click="$router.back()"
					>返回</a
				>
			</div>
			<div class="s-card-content">
				<a-row
					class="row"
					:gutter="40"
					v-if="detailData.receivalVO"
				>
					<a-col span="8">
						<a-row :gutter="20">
							<a-col span="9">应收账款流水号</a-col>
							<a-col
								span="15"
								class="overflow"
							>
								<span>{{ detailData.receivalVO.serialNo }}</span>
							</a-col>
						</a-row>
						<a-row :gutter="20">
							<a-col span="9">金融机构</a-col>
							<a-col span="15">{{ detailData.receivalVO.bankName }}</a-col>
						</a-row>

						<a-row :gutter="20">
							<a-col span="9">卖方名称</a-col>
							<a-col
								span="15"
								class="overflow"
							>
								<span>{{ detailData.receivalVO.sellerName }}</span>
							</a-col>
						</a-row>
						<a-row :gutter="20">
							<a-col span="9">买方名称</a-col>
							<a-col
								span="15"
								class="overflow"
							>
								<span>{{ detailData.receivalVO.buyerName }}</span>
							</a-col>
						</a-row>
						<a-row :gutter="20">
							<a-col span="9">状态</a-col>
							<a-col span="15">
								<span>{{ filterCodeByValueName(detailData.receivalVO.status, 'receivableStatusDict') }}</span>
							</a-col>
						</a-row>
					</a-col>
					<a-col span="8">
						<a-row :gutter="20">
							<a-col span="9">应收账款类型</a-col>
							<a-col span="15">
								<span v-if="detailData.receivalVO.type == 'PROOF'">凭证结算</span>
								<span v-if="detailData.receivalVO.type == 'INVOICE'">发票结算</span>
							</a-col>
						</a-row>

						<a-row :gutter="20">
							<a-col span="9">资金类型</a-col>
							<a-col span="15">{{ detailData.receivalVO.paymentTypeName }}</a-col>
						</a-row>
						<a-row :gutter="20">
							<a-col span="9">应收账款起始日期</a-col>
							<a-col span="15">{{ detailData.receivalVO.beginDate }}</a-col>
						</a-row>
						<a-row :gutter="20">
							<a-col span="9">应收账款到期日期</a-col>
							<a-col span="15">{{ detailData.receivalVO.endDate }}</a-col>
						</a-row>
					</a-col>
					<a-col span="8">
						<a-row :gutter="20">
							<a-col span="9">行业</a-col>
							<a-col span="15">{{ detailData.receivalVO.industryTypeDesc }}</a-col>
						</a-row>
						<a-row :gutter="20">
							<a-col span="9">拟融资金额</a-col>
							<a-col span="15"
								><span class="red">{{ detailData.receivalVO.planFinancingAmount }}</span
								>&nbsp;元</a-col
							>
						</a-row>
						<a-row :gutter="20">
							<a-col span="9">应收账款金额</a-col>
							<a-col span="15"
								><span class="red">{{ detailData.receivalVO.amount }}</span
								>&nbsp;元</a-col
							>
						</a-row>
						<a-row :gutter="20">
							<a-col span="9">应收账款申请日期</a-col>
							<a-col span="15">{{ detailData.receivalVO.requestTime }}</a-col>
						</a-row>
					</a-col>
				</a-row>
			</div>
			<div
				class="s-card-content"
				style="padding-top: 0"
				id="scroll-content"
			>
				<div style="text-align: right; margin-bottom: 10px">
					<a-button
						type="primary"
						@click="downloadAll"
						:loading="loading"
						>一键下载所有文档</a-button
					>
				</div>
				<a-row :gutter="40">
					<a-col span="4">
						<div class="tabs-bar">
							<div @click="tabChange(0)" :class="activeIndex == 0 ? 'blue' : ''">
								<div class="tabs-icon">
									<img
										src="@sub/assets/imgs/assets/contract.png"
										alt=""
									/>
									<em></em>
								</div>
								<div class="tabs-text">
									<p :class="activeIndex == 0 ? 'blue' : ''">合同</p>
								</div>
								<i :class="judgeColor(0)"></i>
							</div>
							<div
								:class="activeIndex == 1 ? 'blue' : ''"
								@click="tabChange(1)"
								v-if="detailData.receivalVO.paymentType != 'receivable-shanmei-down'"
							>
								<div class="tabs-icon">
									<img
										src="@sub/assets/imgs/assets/delivery.png"
										alt=""
									/>
									<em></em>
								</div>
								<div class="tabs-text">
									<p :class="activeIndex == 1 ? 'blue' : ''">运输凭证</p>
								</div>
								<i :class="judgeColor(1)"></i>
							</div>
							<div
								:class="activeIndex == 2 ? 'blue' : ''"
								@click="tabChange(2)"
								v-if="detailData.receivalVO.paymentType != 'receivable-shanmei-down'"
							>
								<div class="tabs-icon">
									<img
										src="@sub/assets/imgs/assets/test.png"
										alt=""
									/>
									<em></em>
								</div>
								<div class="tabs-text">
									<p :class="activeIndex == 2 ? 'blue' : ''">数质量凭证</p>
								</div>
								<i :class="judgeColor(2)"></i>
							</div>
							<div
								:class="activeIndex == 3 ? 'blue' : ''"
								@click="tabChange(3)"
								v-if="['receivable-shanmei-down', 'product-huaneng-downReceivable'].includes(detailData.receivalVO.paymentType)"
							>
								<div class="tabs-icon">
									<img
										src="@sub/assets/imgs/assets/goodsTransfer.png"
										alt=""
									/>
									<em></em>
								</div>
								<div class="tabs-text">
									<p :class="activeIndex == 3 ? 'blue' : ''">货转凭证</p>
								</div>
								<i :class="judgeColor(3)"></i>
							</div>
							<div
								:class="activeIndex == 4 ? 'blue' : ''"
								@click="tabChange(4)"
								v-if="detailData.receivalVO.paymentType != 'receivable-shanmei-down'"
							>
								<div class="tabs-icon">
									<img
										src="@sub/assets/imgs/assets/accounts.png"
										alt=""
									/>
									<em></em>
								</div>
								<div class="tabs-text">
									<p :class="activeIndex == 4 ? 'blue' : ''">核算表</p>
								</div>
								<i :class="judgeColor(4)"></i>
							</div>
							<div
								:class="activeIndex == 8 ? 'blue' : ''"
								@click="tabChange(8)"
								v-if="['receivable-shanmei-down', 'product-huaneng-downReceivable'].includes(detailData.receivalVO.paymentType)"
							>
								<div class="tabs-icon">
									<img
										src="@sub/assets/imgs/assets/confirm.png"
										alt=""
									/>
									<em></em>
								</div>
								<div class="tabs-text">
									<p :class="activeIndex == 8 ? 'blue' : ''">结算单</p>
								</div>
								<i :class="judgeColor(8)"></i>
							</div>
							<div
								:class="activeIndex == 6 ? 'blue' : ''"
								@click="tabChange(6)"
								v-if="detailData.receivalVO.type == 'INVOICE'"
							>
								<div class="tabs-icon">
									<img
										src="@sub/assets/imgs/assets/invoice.png"
										alt=""
									/>
									<em></em>
								</div>
								<div class="tabs-text">
									<p :class="activeIndex == 6 ? 'blue' : ''">发票</p>
								</div>
								<i :class="judgeColor(6)"></i>
							</div>
							<div :class="activeIndex == 7 ? 'blue' : ''" @click="tabChange(7)">
								<div class="tabs-icon">
									<img
										src="@sub/assets/imgs/assets/file.png"
										alt=""
									/>
								</div>
								<div class="tabs-text">
									<p :class="activeIndex == 7 ? 'blue' : ''">其他材料</p>
								</div>
								<i :class="judgeColor(7)"></i>
							</div>
						</div>
					</a-col>
					<!-- 右侧数据展示模块 -->
					<a-col
						span="20"
						v-if="detailData.receivalVO.poolReuse == 1"
					>
						<!-- 合同 -->
						<contractpool
							v-show="activeIndex == 0"
							:editFlag="false"
							:contractInfo="detailData.poolContract"
							:deliverInfo="detailData.deliverInfo"
							ref="contract"
						></contractpool>
						<!-- 运输凭证 -->
						<transport-documentpool
							v-show="activeIndex == 1"
							:editFlag="false"
							:deliverInfo="detailData.deliverInfo"
							:contractInfo="detailData.contractInfo"
							ref="transport"
						></transport-documentpool>
						<!-- 数质量凭证 -->
						<quality-documentpool
							v-show="activeIndex == 2"
							:editFlag="false"
							:recvInfo="detailData.recvInfo"
							:contractInfo="detailData.contractInfo"
							ref="quality"
							:receivalVO="detailData.receivalVO"
						></quality-documentpool>
						<!-- 货转凭证 -->
						<goods-transfer-documentpool
							v-show="activeIndex == 3 && ['product-huaneng-downReceivable'].includes(detailData.receivalVO.paymentType)"
							:editFlag="false"
							:goodTransferInfo="detailData.goodTransferInfo"
							:contractInfo="detailData.contractInfo"
							ref="transfer"
							:deliverInfo="detailData.deliverInfo"
						></goods-transfer-documentpool>
						<TransferInfo
							ref="newTransfer"
							:editFlag="false"
							v-show="activeIndex == 3 && ['receivable-shanmei-down'].includes(detailData.receivalVO.paymentType)"
						></TransferInfo>
						<!-- 结算单 -->
						<SettleInfo
							:editFlag="false"
							:contractInfo="detailData.poolContract"
							:settlesInfo="detailData.manualStatement"
							:receivalVO="detailData.receivalVO"
							v-show="activeIndex == 8"
							ref="settle"
						></SettleInfo>
						<!-- 核算表 -->
						<accounts-tablepool
							v-show="activeIndex == 4"
							:editFlag="false"
							:accountInfo="detailData.accountInfo"
							ref="accounts"
						></accounts-tablepool>
						<!-- 发票 -->
						<invoicepool
							v-if="activeIndex == 6"
							:invoiceInfo="detailData.invoiceInfo"
						></invoicepool>
						<!-- 其他材料 -->
						<other-filespool
							v-show="activeIndex == 7"
							:editFlag="false"
							:otherInfo="detailData.otherInfo"
							:receivalVO="detailData.receivalVO"
							ref="other"
						></other-filespool>
					</a-col>
					<a-col
						span="20"
						v-else
					>
						<!-- 合同 -->
						<contract
							v-show="activeIndex == 0"
							:editFlag="false"
							:contractInfo="detailData.manualTerminalContract"
							ref="contract"
						></contract>
						<!-- 运输凭证 -->
						<transport-document
							v-show="activeIndex == 1"
							:editFlag="false"
							:deliverInfo="detailData.manualDeliver"
							:contractInfo="detailData.contractInfo"
							ref="transport"
						></transport-document>
						<TransferInfo
							ref="newTransfer"
							:editFlag="false"
							v-show="activeIndex == 3 && ['receivable-shanmei-down'].includes(detailData.receivalVO.paymentType)"
						></TransferInfo>
						<!-- 数质量凭证 -->
						<quality-document
							v-show="activeIndex == 2"
							:editFlag="false"
							:recvInfo="detailData.manualReceive"
							:contractInfo="detailData.contractInfo"
							ref="quality"
							:receivalVO="detailData.receivalVO"
						></quality-document>
						<!-- 货转凭证 -->
						<goods-transfer-document
							v-show="activeIndex == 3 && ['product-huaneng-downReceivable'].includes(detailData.receivalVO.paymentType)"
							:editFlag="false"
							:goodTransferInfo="detailData.manualTransfer"
							:contractInfo="detailData.contractInfo"
							ref="transfer"
							:deliverInfo="detailData.deliverInfo"
						></goods-transfer-document>
						<!-- 结算单 -->
						<SettleInfo
							:editFlag="false"
							:contractInfo="contractInfo"
							:settlesInfo="detailData.manualStatement"
							:receivalVO="detailData.receivalVO"
							v-show="activeIndex == 8"
							ref="settle"
						></SettleInfo>
						<!-- 核算表 -->
						<accounts-table
							v-show="activeIndex == 4"
							:isPool="true"
							:editFlag="false"
							:accountInfo="detailData.manualAccount"
							ref="accounts"
						></accounts-table>
						<!-- 发票 -->
						<invoice
							v-show="activeIndex == 6"
							:isPool="true"
							:invoiceInfo="detailData.manualInvoice"
						></invoice>
						<!-- 其他材料 -->
						<other-files
							v-show="activeIndex == 7"
							:editFlag="false"
							:otherInfo="detailData.manualOther"
							:receivalVO="detailData.receivalVO"
							ref="other"
						></other-files>
					</a-col>
				</a-row>
			</div>
			<div class="bottom-box">
				<!-- 只显⽰当前“平台驳回”的审核信息 -->
				<div
					class="s-card-content"
					v-if="
						detailData.receivalVO &&
						detailData.receivalVO.status == 'PLATFORM_REJECT' &&
						detailData.auditInfo &&
						detailData.auditInfo.audit &&
						detailData.auditInfo.audit.auditResult != 'PASS'
					"
				>
					<h2>审核信息</h2>
					<a-row>
						<a-col :span="4">审批人</a-col>
						<a-col :span="20">{{ detailData.auditInfo.audit.auditor }}</a-col>
					</a-row>
					<a-row>
						<a-col :span="4">审核时间</a-col>
						<a-col :span="20">{{ detailData.auditInfo.audit.auditTime }}</a-col>
					</a-row>
					<a-row>
						<a-col :span="4">审核结果</a-col>
						<a-col
							:span="20"
							class="red"
							>驳回</a-col
						>
					</a-row>
					<a-row>
						<a-col :span="4">驳回原因</a-col>
						<a-col :span="20">{{ detailData.auditInfo.audit.auditOpinion }}</a-col>
					</a-row>
				</div>
				<!-- 只显⽰当前“融资失败”且已批注的批注信息-->
				<div
					class="s-card-content"
					v-if="
						detailData.receivalVO &&
						detailData.receivalVO.status == 'COMMENTED' &&
						detailData.commentInfo &&
						detailData.commentInfo.comment
					"
				>
					<h2>批注信息</h2>
					<a-row>
						<a-col :span="4">批注人</a-col>
						<a-col :span="20">{{ detailData.commentInfo.comment.commenter }}</a-col>
					</a-row>
					<a-row>
						<a-col :span="4">批注时间</a-col>
						<a-col :span="20">{{ detailData.commentInfo.comment.createDate }}</a-col>
					</a-row>
					<a-row>
						<a-col :span="4">批注信息</a-col>
						<a-col :span="20">{{ detailData.commentInfo.comment.remark }}</a-col>
					</a-row>
				</div>
			</div>
			<div
				class="s-card-content"
				v-if="detailData.auditChainAndOperator"
			>
				<FinancingLiu
					ref="FinancingLiu"
					bizType="ASSET_RECEIVABLE"
					:data="detailData.auditChainAndOperator || null"
					:disabled="true"
				/>
			</div>
		</a-card>
	</div>
</template>
<script>
import { filterCodeByValueName } from '@sub/utils/globalCode.js';
import { API_GetAccountsManualDetail, API_AuditReceivablePoolDownload } from '@/v2/center/assets/api/index.js';
import FinancingLiu from '@/v2/center/financing/components/FinancingLiu.vue';
// manual
import Contract from '@/v2/center/assets/components/manual/contract.vue';
import TransportDocument from '@/v2/center/assets/components/manual/TransportDocument.vue';
import QualityDocument from '@/v2/center/assets/components/manual/QualityDocument.vue';
import GoodsTransferDocument from '@/v2/center/assets/components/manual/GoodsTransferDocument.vue';
import AccountsTable from '@/v2/center/assets/components/manual/AccountsTable.vue';

import Invoice from '@/v2/center/assets/components/manual/Invoice.vue';
import OtherFiles from '@/v2/center/assets/components/manual/OtherFiles.vue';
import SettlesFiles from '@/v2/center/assets/components/manual/SettlesFiles.vue';

// pool
import Contractpool from '@/v2/center/assets/components/pool/contract.vue';
import TransportDocumentpool from '@/v2/center/assets/components/pool/TransportDocument.vue';
import QualityDocumentpool from '@/v2/center/assets/components/pool/QualityDocument.vue';
import GoodsTransferDocumentpool from '@/v2/center/assets/components/pool/GoodsTransferDocument.vue';
import AccountsTablepool from '@/v2/center/assets/components/pool/AccountsTable.vue';
import Invoicepool from '@/v2/center/assets/components/pool/Invoice.vue';
import OtherFilespool from '@/v2/center/assets/components/pool/OtherFiles.vue';

import comDownload from '@sub/utils/comDownload.js';

import { getPopupContainer } from '@/untils/factory.js';
import Cookies from 'js-cookie';
import Breadcrumb from '@/v2/components/breadcrumb/index';
import SettleInfo from '@/v2/center/assets/views/receivable/components/SettleInfo.vue';
import TransferInfo from '@/v2/center/assets/views/receivable/components/TransferInfo.vue';

export default {
	data() {
		return {
			filterCodeByValueName: filterCodeByValueName,
			activeIndex: this.$route.query.activeIndex,
			loading: false,
			getPopupContainer,
			detailData: '', // 详情数据
			toolTipVisible: false, // 开关
			toolTipVisible1: false, //是否第一次进入这个页面，第一次显示文字提示，以后不展示 存入cookie
			transType: '',
			contractInfo: {}
		};
	},
	components: {
		Contract,
		TransportDocument,
		QualityDocument,
		GoodsTransferDocument,
		AccountsTable,
		Invoice,
		OtherFiles,
		SettlesFiles,
		Contractpool,
		TransportDocumentpool,
		QualityDocumentpool,
		GoodsTransferDocumentpool,
		AccountsTablepool,
		Invoicepool,
		OtherFilespool,
		FinancingLiu,
		Breadcrumb,
		SettleInfo,
		TransferInfo
	},
	mounted: function () {
		this.tabChange(this.$route.query.activeIndex);
		API_GetAccountsManualDetail({ id: this.$route.query.id }).then(res => {
			if (res.success) {
				this.detailData = res.data;
				if (this.detailData?.manualDeliver) {
					this.transType = this.detailData?.manualDeliver?.transType;
					if (!this.transType && this.detailData?.deliverInfo) {
						const deliverInfo = this.detailData?.deliverInfo;
						const deliverList = deliverInfo.deliverList || [];
						const item = deliverList[0] || {};
						this.transType = item.transferType;
					}
				}
				this.$nextTick(() => {
					if (this.detailData.manualStatement) {
						this.$refs.settle && this.$refs.settle.init(this.detailData.manualStatement.list);
					}
					this.$refs.newTransfer &&
						this.$refs.newTransfer.init(this.detailData.manualTransfer?.list || this.detailData?.goodTransferInfo.list);
				});
				// this.transType = this.detailData?.manualDeliver?.transType || this.detailData?.deliverInfo?.deliverList[0].transferType
			}
		});
		if (!Cookies.get('assets-tooltip-1')) {
			this.toolTipVisible = true;
			this.$nextTick(() => {
				this.toolTipVisible1 = true;
			});
		} else {
			this.toolTipVisible1 = false;
		}
		this.toolTipVisible = Cookies.get('assets-tooltip') === 'false' ? false : true;
	},
	methods: {
		toolTipAleady() {
			Cookies.set('assets-tooltip-1', 1, { expires: 99999 });
			this.toolTipVisible1 = false;
		},
		tabChange(index) {
			// 下游数据tabs切换
			this.activeIndex = index;
			this.$nextTick(() => {
				// document.querySelector('#scroll-content').scrollIntoView()
			});
		},
		downloadAll() {
			// 一键下载所有文档
			this.loading = true;
			API_AuditReceivablePoolDownload({ id: this.$route.query.id })
				.then(res => {
					comDownload(res, null, '资产附件.zip');
				})
				.finally(r => {
					this.loading = false;
				});
		},
		judgeColor() {},
		changeToolTipVisible(e) {
			Cookies.set('assets-tooltip', e, { expires: 99999 });
		}
	}
};
</script>
<style lang="less" scoped>
.top-box {
	box-shadow: 0 2px 10px 0 #dddfe4;
	overflow: hidden;
	border-radius: 8px;
	background: #fff;

	.s-card-title {
		margin-left: 20px;
		margin-top: 20px;
		font-family: PingFangSC-Medium;
		color: #141517;
		line-height: 24px;
		justify-content: space-between;
		padding-right: 20px;

		a {
			cursor: pointer;
		}
	}

	.s-card-content .ant-row .ant-col .ant-row .ant-col:first-child {
		color: #6b6f76;
	}

	.s-card-content .ant-row .ant-col .ant-row .ant-col:last-child {
		color: #383a3f;
	}
}

.bottom-box {
	.s-card-content .ant-row .ant-col:first-child {
		color: #6b6f76;
	}

	.s-card-content .ant-row .ant-col:last-child {
		color: #383a3f;
	}
}

.s-card-content {
	padding: 20px 0;
	border-radius: 8px;
	background: #fff;

	.row .ant-col {
		margin-bottom: 8px;
		text-overflow: ellipse;
		white-space: nowrap;
		overflow: hidden;
	}

	.ant-row .ant-col {
		margin-bottom: 8px;
	}

	h2 {
		font-style: normal;
		font-family: PingFangSC-Medium;
		font-size: 14px;
		color: #141517;
		line-height: 22px;
		margin-bottom: 16px;
	}
}

.divider {
	background: #f4f5f8;
	height: 1px;
	margin-top: 20px;
	margin-left: -20px;
	margin-right: -20px;
}

.tabs-bar {
	display: flex;
	flex-direction: column;
	cursor: pointer;
}
.tabs-bar i {
	display: none;
	// display: inline-block;
	width: 10px;
	height: 10px;
	float: right;
	background: red;
	border-radius: 50%;
	margin-top: 8px;
	margin-right: 10px;
}
.tabs-bar > div > div {
	float: left;
}
.tabs-bar > div {
	padding: 14px 0;
		.tabs-icon {
			flex: none;
			font-size: 14px;
			font-weight: 400;
			line-height: 20px;
		img {
			width: 18px;
			height: 18px;
			margin-right: 10px;
		}
		span,
		img {
			vertical-align: middle;
		}
	}
}
.tabs-bar > div.blue {
	img {
		filter: brightness(150%);
	}
}
.tabs-bar .tabs-text {
	p {
		font-family: PingFangSC-Medium;
		color: #383a3f;
		line-height: 22px;
	}
	.blue {
		color: @primary-color;
	}
	span {
		font-family: PingFangSC-Regular;
		font-size: 10px;
		color: #9ba0aa;
	}
}

.red {
	color: #f24e4d !important;
}

.overflow {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.contentBox {
	font-family: PingFangSC-Regular;
}

.green {
	background: #00ae9d !important;
}

.orange {
	background: #ff9726 !important;
}

.red_bg {
	background: #f24e4d !important;
}

.dj-info {
	color: #141517;
	margin-left: 0;
	font-weight: bold;
	margin-top: 0;
	position: relative;
	i {
		position: absolute;
		left: 140px;
		color: #8495aa;
		font-size: 16px;
		top: 4px;
		cursor: pointer;
	}
}

.hidden-text .tabs-text {
	div {
		display: none !important;
	}
}
/deep/ .ant-popover-inner-content {
	background: #4089f8;
	width: 280px;
	border-radius: 6px;
	height: 146px;
	padding: 17px 20px;
	color: #ffffff;
	.pop-title {
		font-family: 'PingFang SC';
		font-style: normal;
		font-weight: 400;
		font-size: 18px;
		line-height: 18px;
		margin-bottom: 14px;
		img {
			width: 18px;
			height: 18px;
			margin-left: 4px;
		}
	}
	.pop-desc {
		font-family: 'PingFang SC';
		font-style: normal;
		font-weight: 400;
		font-size: 14px;
		line-height: 22px;
	}
	.button {
		float: right;
		margin-top: 7px;
		width: 88px;
		height: 32px;
		background: #ffffff;
		border-radius: 4px;
		color: #4089f8;
		cursor: pointer;
		text-align: center;
		line-height: 32px;
	}
}
/deep/ .ant-popover-placement-top > .ant-popover-content > .ant-popover-arrow,
.ant-popover-placement-topLeft > .ant-popover-content > .ant-popover-arrow,
.ant-popover-placement-topRight > .ant-popover-content > .ant-popover-arrow {
	border-right-color: #4089f8;
	border-bottom-color: #4089f8;
}
</style>
