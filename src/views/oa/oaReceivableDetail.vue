<template>
	<a-card
		v-if="detailData.length"
		style="margin: 0 30px"
	>
		<h2>资产信息</h2>
		<template v-if="currentStatus.status">
			<a-row
				class="row"
				:gutter="40"
				style="margin-left: 0px; margin-bottom: 20px; margin-top: 20px"
			>
				<span style="font-size: 20px">当前状态：{{ filterCodeByValueName(currentStatus.status, 'receivableStatusDict') }}</span>
			</a-row>
			<a-row
				class="row"
				:gutter="40"
				style="margin-left: 0px; margin-bottom: 20px"
				v-if="currentStatus.message"
			>
				<span>作废原因：{{ currentStatus.message }}</span>
			</a-row>
		</template>
		<div
			style="text-align: right; margin-right: 20px"
			v-if="detailData && detailData[0] && detailData[0].receivalVO"
		>
			<a-button
				v-if="detailData[0].receivalVO.auditFile"
				type="primary"
				@click="openPdf(detailData[0].receivalVO.auditFile)"
				>查看审核报告</a-button
			>
		</div>
		<a-tabs :default-active-key="0">
			<a-tab-pane
				tab="审核时间"
				disabled
				v-if="showSTime"
			></a-tab-pane>
			<a-tab-pane
				v-for="(item, index) in detailData"
				:key="index"
				:tab="item.auditInfo && item.auditInfo.audit ? item.auditInfo.audit.auditTime : '资产信息'"
			>
				<div
					class="s-card-content"
					v-if="item.auditInfo && item.auditInfo.audit"
				>
					<h2>审核信息</h2>
					<a-row>
						<a-col :span="4">审核人</a-col>
						<a-col :span="20">{{ item.auditInfo.audit.auditor }}</a-col>
					</a-row>
					<a-row>
						<a-col :span="4">审核结果</a-col>
						<a-col
							:span="20"
							class="red"
							>{{ item.auditInfo.audit.auditResult == 'PASS' ? '通过' : '驳回' }}</a-col
						>
					</a-row>
					<a-row>
						<a-col :span="4">审核意见</a-col>
						<a-col :span="20">{{ item.auditInfo.audit.auditOpinion }}</a-col>
					</a-row>
					<a-row>
						<a-col :span="4">审核时间</a-col>
						<a-col :span="20">{{ item.auditInfo.audit.auditTime }}</a-col>
					</a-row>
				</div>
				<div class="s-card-content">
					<h2>基本信息</h2>
					<a-row
						class="row"
						:gutter="40"
						v-if="item.receivalVO"
					>
						<a-col span="8">
							<a-row :gutter="20">
								<a-col style="width: 140px; float: left">应收账款流水号</a-col>
								<a-col class="overflow">
									<a-tooltip>
										<template slot="title">{{ item.receivalVO.serialNo }}</template>
										<span>{{ item.receivalVO.serialNo }}</span>
									</a-tooltip>
								</a-col>
							</a-row>
							<a-row :gutter="20">
								<a-col style="width: 140px; float: left">卖方名称</a-col>
								<a-col class="overflow">
									<a-tooltip>
										<template slot="title">{{ item.receivalVO.sellerName }}</template>
										<span>{{ item.receivalVO.sellerName }}</span>
									</a-tooltip>
								</a-col>
							</a-row>
							<a-row :gutter="20">
								<a-col style="width: 140px; float: left">买方名称</a-col>
								<a-col class="overflow">
									<a-tooltip>
										<template slot="title">{{ item.receivalVO.buyerName }}</template>
										<span>{{ item.receivalVO.buyerName }}</span>
									</a-tooltip>
								</a-col>
							</a-row>
						</a-col>

						<a-col span="8">
							<a-row :gutter="20">
								<a-col style="width: 140px; float: left">应收账款类型</a-col>
								<a-col>
									<span v-if="item.receivalVO.type == 'PROOF'">凭证结算</span>
									<span v-if="item.receivalVO.type == 'INVOICE'">发票结算</span>
								</a-col>
							</a-row>
							<a-row :gutter="20">
								<a-col style="width: 140px; float: left">应收账款金额</a-col>
								<a-col
									><span class="red">{{ item.receivalVO.amount }}</span
									>&nbsp;元</a-col
								>
							</a-row>
							<a-row :gutter="20">
								<a-col style="width: 140px; float: left">应收账款起始日期</a-col>
								<a-col>{{ item.receivalVO.beginDate }}</a-col>
							</a-row>
							<a-row :gutter="20">
								<a-col style="width: 140px; float: left">应收账款到期日期</a-col>
								<a-col>{{ item.receivalVO.endDate }}</a-col>
							</a-row>
						</a-col>
						<a-col span="8">
							<a-row :gutter="20">
								<a-col style="width: 140px; float: left">金融机构</a-col>
								<a-col>{{ item.receivalVO.bankName }}</a-col>
							</a-row>
							<a-row :gutter="20">
								<a-col style="width: 140px; float: left">拟融资金额</a-col>
								<a-col
									><span class="red">{{ item.receivalVO.planFinancingAmount }}</span
									>&nbsp;元</a-col
								>
							</a-row>
							<a-row :gutter="20">
								<a-col style="width: 140px; float: left">应收账款申请日期</a-col>
								<a-col>{{ item.receivalVO.requestTime }}</a-col>
							</a-row>
							<a-row
								:gutter="20"
								v-if="item.receivalVO.projectNum"
							>
								<a-col style="width: 140px; float: left">项目编号</a-col>
								<a-col>{{ item.receivalVO.projectNum }}</a-col>
							</a-row>
							<a-row
								:gutter="20"
								v-if="item.receivalVO.md5Hex"
							>
								<a-col style="width: 140px; float: left">资产MD5</a-col>
								<a-col>{{ item.receivalVO.md5Hex }}</a-col>
							</a-row>
						</a-col>
					</a-row>
				</div>

				<div
					class="s-card-content"
					style="padding-bottom: 30px"
				>
					<div>
						<h2>单据信息</h2>
					</div>
					<div style="text-align: right; margin-bottom: 10px">
						<a-button
							type="primary"
							@click="downloadAll"
							>一键下载所有文档</a-button
						>
					</div>
					<a-row :gutter="40">
						<a-col
							span="4"
							v-if="item.receivalVO.assetType === 'ACCOUNTS_RECEIVABLE_DOWN_MANUAL'"
							class="down"
						>
							<div class="tabs-bar">
								<div @click="tabChange(0)">
									<div class="tabs-icon">
										<img
											src="@/assets/imgs/monitoring/contract.png"
											alt=""
										/>
										<em></em>
									</div>
									<div class="tabs-text">
										<p :class="activeIndex == 0 ? 'blue' : ''">合同</p>
									</div>
								</div>
								<div @click="tabChange(1)">
									<div class="tabs-icon">
										<img
											src="@/assets/imgs/monitoring/delivery.png"
											alt=""
										/>
										<em></em>
									</div>
									<div class="tabs-text">
										<p :class="activeIndex == 1 ? 'blue' : ''">运输凭证</p>
									</div>
								</div>
								<div @click="tabChange(2)">
									<div class="tabs-icon">
										<img
											src="@/assets/imgs/assets/test.png"
											alt=""
										/>
										<em></em>
									</div>
									<div class="tabs-text">
										<p :class="activeIndex == 2 ? 'blue' : ''">数质量凭证</p>
									</div>
								</div>
								<div
									@click="tabChange(3)"
									v-if="item.receivalVO.paymentType == 'product-huaneng-downReceivable'"
								>
									<div class="tabs-icon">
										<img
											src="@/assets/imgs/assets/goodsTransfer.png"
											alt=""
										/>
										<em></em>
									</div>
									<div class="tabs-text">
										<p :class="activeIndex == 3 ? 'blue' : ''">货转凭证</p>
									</div>
								</div>
								<div @click="tabChange(4)">
									<div class="tabs-icon">
										<img
											src="@/assets/imgs/assets/accounts.png"
											alt=""
										/>
										<em></em>
									</div>
									<div class="tabs-text">
										<p :class="activeIndex == 4 ? 'blue' : ''">核算表</p>
									</div>
								</div>
								<div
									@click="tabChange(3)"
									v-if="item.receivalVO.paymentType == 'product-huaneng-downReceivable'"
								>
									<div class="tabs-icon">
										<img
											src="@/assets/imgs/monitoring/file.png"
											alt=""
										/>
										<em></em>
									</div>
									<div class="tabs-text">
										<p :class="activeIndex == 8 ? 'blue' : ''">结算单</p>
									</div>
								</div>
								<div
									@click="tabChange(3)"
									v-if="item.receivalVO.paymentType == 'product-huaneng-downReceivable'"
								>
									<div class="tabs-icon">
										<img
											src="@/assets/imgs/monitoring/invoice.png"
											alt=""
										/>
										<em></em>
									</div>
									<div class="tabs-text">
										<p :class="activeIndex == 6 ? 'blue' : ''">发票</p>
									</div>
								</div>
								<div @click="tabChange(7)">
									<div class="tabs-icon">
										<img
											src="@/assets/imgs/monitoring/file.png"
											alt=""
										/>
									</div>
									<div class="tabs-text">
										<p :class="activeIndex == 7 ? 'blue' : ''">其他材料</p>
									</div>
								</div>
							</div>
						</a-col>
						<a-col
							span="4"
							v-else
							class="up"
						>
							<LeftTabs
								@tabChange="tabChange"
								:activeIndex="activeIndex.toString()"
								:detailData="item"
							/>
						</a-col>
						<!-- 右侧数据展示模块 -->
						<a-col span="20">
							<!-- 合同 -->

							<template v-if="item.receivalVO.assetType === 'ACCOUNTS_RECEIVABLE_DOWN_MANUAL'">
								<ContractManual
									v-show="activeIndex == 0 && item.receivalVO.poolReuse != 1"
									:editFlag="false"
									:contractInfo="item.contractInfo || item.manualTerminalContract"
									:receivalVO="item.receivalVO"
								></ContractManual>
								<contractpool
									v-show="activeIndex == 0 && item.receivalVO.poolReuse == 1"
									:editFlag="false"
									:contractInfo="item.poolContract"
									:deliverInfo="item.deliverInfo"
									ref="contract"
								></contractpool>
							</template>
							<template>
								<contract
									v-show="activeIndex == 0"
									:editFlag="false"
									:contractInfo="item.contractInfo"
									:receivalVO="item.receivalVO"
								></contract>
							</template>

							<template v-if="item.receivalVO.assetType === 'ACCOUNTS_RECEIVABLE_DOWN_MANUAL'">
								<!-- 运输凭证 -->
								<MTransportDocument
									v-show="activeIndex == 1"
									:editFlag="false"
									:deliverInfo="item.manualDeliver"
									:contractInfo="item.contractInfo"
									ref="transport"
								></MTransportDocument>
								<!-- 数质量凭证 -->
								<MQualityDocument
									v-show="activeIndex == 2"
									:editFlag="false"
									:recvInfo="item.manualReceive"
									:contractInfo="item.contractInfo"
									ref="quality"
									:receivalVO="item.receivalVO"
								></MQualityDocument>
								<!-- 核算表 -->
								<MAccountsTable
									v-show="activeIndex == 4"
									:isPool="true"
									:editFlag="false"
									:accountInfo="item.manualAccount"
									ref="accounts"
								></MAccountsTable>
								<!-- 其他材料 -->
								<MOtherFiles
									v-show="activeIndex == 7"
									:editFlag="false"
									:otherInfo="item.manualOther"
									:receivalVO="item.receivalVO"
									ref="other"
								></MOtherFiles>
							</template>
							<template v-else>
								<!-- 运输凭证 -->
								<transport-document
									v-show="activeIndex == 1"
									:editFlag="false"
									:deliverInfo="item.deliverInfo"
									:contractInfo="item.contractInfo"
									:receivalVO="item.receivalVO"
								></transport-document>
								<!-- 数质量凭证 -->
								<quality-document
									v-show="activeIndex == 2"
									:editFlag="false"
									:recvInfo="item.recvInfo"
									:contractInfo="item.contractInfo"
									:receivalVO="item.receivalVO"
								></quality-document>
								<!-- 货转凭证 -->
								<goods-transfer-document
									v-show="activeIndex == 3"
									:editFlag="false"
									:goodTransferInfo="item.goodTransferInfo"
									:contractInfo="item.contractInfo"
									:deliverInfo="item.deliverInfo"
									:receivalVO="item.receivalVO"
								></goods-transfer-document>
								<!-- 核算表 -->
								<accounts-table
									v-show="activeIndex == 4"
									:editFlag="false"
									:accountInfo="item.accountInfo"
									:receivalVO="item.receivalVO"
								></accounts-table>
								<!-- 确认函 -->
								<confirm-letter
									v-show="activeIndex == 5"
									:confirmLetterInfo="item.confirmLetterInfo"
									:receivalVO="item.receivalVO"
								></confirm-letter>
								<!-- 发票 -->
								<invoice
									v-show="activeIndex == 6"
									:invoiceInfo="item.invoiceInfo"
									:receivalVO="item.receivalVO"
								></invoice>
								<!-- 其他材料 -->
								<other-files
									v-show="activeIndex == 7"
									:editFlag="false"
									:otherInfo="item.otherInfo"
									:receivalVO="item.receivalVO"
								></other-files>
								<!-- 结算单 -->
								<settles-files
									v-show="activeIndex == 8"
									:editFlag="false"
									:settleInfo="item.settlementInfo"
									:receivalVO="item.receivalVO"
								></settles-files>
							</template>
						</a-col>
					</a-row>
				</div>
			</a-tab-pane>
		</a-tabs>
	</a-card>
</template>
<script>
import { API_GetAccountsDetailJR, API_AuditReceivableJRDownload } from '@/v2/center/assets/api/index.js';
import ContractManual from '@/v2/center/assets/components/manual/contract.vue';
import Contractpool from '@/v2/center/assets/components/wwyl/contract.vue';
import Contract from '@/v2/center/assets/components/contract.vue';
import TransportDocument from '@/v2/center/assets/components/TransportDocument.vue';
import QualityDocument from '@/v2/center/assets/components/QualityDocument.vue';
import GoodsTransferDocument from '@/v2/center/assets/components/GoodsTransferDocument.vue';
import AccountsTable from '@/v2/center/assets/components/AccountsTable.vue';
import ConfirmLetter from '@/v2/center/assets/components/ConfirmLetter.vue';
import Invoice from '@/v2/center/assets/components/Invoice.vue';
import OtherFiles from '@/v2/center/assets/components/OtherFiles.vue';
import SettlesFiles from '@/v2/center/assets/components/SettlesFiles.vue';
import LeftTabs from '@/v2/center/assets/components/common/LeftTabs2.vue';
import Cookies from 'js-cookie';

import { filterCodeByValueName } from '@sub/utils/globalCode.js';
import comDownload from '@sub/utils/comDownload.js';
import ENV from '@/v2/config/env';
import { API_loginByCompanyUserIdForAsset } from '@/v2/center/trade/api/contract';
import { mapMutations } from 'vuex';

import MTransportDocument from '@/v2/center/assets/components/manual/TransportDocument.vue';
import MQualityDocument from '@/v2/center/assets/components/manual/QualityDocument.vue';
import MOtherFiles from '@/v2/center/assets/components/manual/OtherFiles.vue';
import MAccountsTable from '@/v2/center/assets/components/manual/AccountsTable.vue';

export default {
	data() {
		return {
			filterCodeByValueName: filterCodeByValueName,
			activeIndex: this.$route.query.activeIndex,
			detailData: [], // 详情数据
			currentStatus: {},
			showSTime: false
		};
	},
	components: {
		Contract,
		TransportDocument,
		QualityDocument,
		GoodsTransferDocument,
		AccountsTable,
		ConfirmLetter,
		Invoice,
		SettlesFiles,
		LeftTabs,
		OtherFiles,
		ContractManual,
		Contractpool,
		MTransportDocument,
		MQualityDocument,
		MAccountsTable,
		MOtherFiles
	},
	mounted: function () {
		let assetId = this.$route.query.assetId;
		let companyUserId = this.$route.query.companyUserId;
		if (companyUserId && assetId) {
			API_loginByCompanyUserIdForAsset({
				assetId,
				companyUserId
			}).then(res => {
				this.VUEX_MU_USERTOKEN(res.token);
				this.getDetail();
			});
		}
		this.$nextTick(() => {
			document.getElementsByClassName('searchDeliverTrain')[0].style.display = 'none'; // 查询轨迹按钮不展示
		});
	},
	created() {
		Cookies.set('assets-tooltip-1', 1, { expires: 99999 });
	},
	methods: {
		...mapMutations({
			VUEX_MU_USERTOKEN: 'user/VUEX_MU_USERTOKEN'
		}),
		openPdf(v) {
			window.open(v, '_blank');
		},
		getDetail() {
			API_GetAccountsDetailJR({ id: this.$route.query.assetId }).then(res => {
				if (res.success) {
					try {
						this.currentStatus = res.data[0].receivalVO || {};
					} catch (e) {
						console.error(e);
					}

					// 默认第一个是实时时间
					if (res.data.length == 1) {
						this.detailData = [res.data[0]];
					} else if (res.data.length > 1) {
						this.detailData = res.data.slice(1);
						this.showSTime = true;
					} else {
						this.detailData = [];
					}
					this.$nextTick(() => {
						this.tabChange(this.$route.query.activeIndex);
					});
				}
			});
		},
		downloadAll() {
			// 一键下载所有文档

			API_AuditReceivableJRDownload({ id: this.$route.query.assetId }).then(res => {
				comDownload(res, null, '资产附件.zip');
			});
		},
		tabChange(index) {
			// 下游数据tabs切换
			this.activeIndex = index;
		}
	}
};
</script>
<style lang="less" scoped>
::v-deep.ant-tabs-tab-disabled {
	color: #333 !important;
}
.ant-tabs-tabpane {
	flex-direction: column;
}
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

.down {
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
	.tabs-bar .tabs-icon {
		margin-right: 10px;
		em {
			display: block;
			width: 1px;
			height: 36px;
			background: #0053db;
			border-radius: 1.5px 1.5px 0 0;
			margin: 5px 0 5px 6px;
		}
		img {
			width: 24px;
			height: 24px;
			margin-left: -5px;
		}
	}
	.tabs-bar .tabs-text {
		p {
			font-family: PingFangSC-Medium;
			color: #383a3f;
			line-height: 22px;
		}
		.blue {
			color: #0053db;
		}
		span {
			font-family: PingFangSC-Regular;
			font-size: 10px;
			color: #9ba0aa;
		}
	}
}
</style>
