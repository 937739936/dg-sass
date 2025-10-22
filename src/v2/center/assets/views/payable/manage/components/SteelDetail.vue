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
					>查看应付账款</span
				>
				<a
					href="javascript:;"
					@click="$router.push('/center/assets/payable/manage/list')"
					>返回</a
				>
			</div>
			<div class="s-card-content">
				<a-row
					class="row"
					:gutter="40"
					v-if="detailData.receivalVO"
				>
					<a-row
						class="row"
						:gutter="40"
						style="margin-left: 20px; margin-bottom: 20px"
					>
						<span style="font-size: 20px"
							>当前状态：{{ filterCodeByValueName(detailData.receivalVO.status, 'receivableStatusDict') }}</span
						>
					</a-row>
					<a-row
						class="row"
						:gutter="40"
						style="margin-left: 20px; margin-bottom: 20px"
						v-if="detailData.receivalVO.message"
					>
						<span>作废原因：{{ detailData.receivalVO.message }}</span>
					</a-row>
					<a-col span="8">
						<a-row :gutter="20">
							<a-col span="9">应付账款流水号</a-col>
							<a-col
								span="15"
								class="overflow"
							>
								<a-tooltip>
									<template slot="title">{{ detailData.receivalVO.serialNo }}</template>
									<span>{{ detailData.receivalVO.serialNo }}</span>
								</a-tooltip>
							</a-col>
						</a-row>
						<a-row :gutter="20">
							<a-col span="9">卖方名称</a-col>
							<a-col
								span="15"
								class="overflow"
							>
								<a-tooltip>
									<template slot="title">{{ detailData.receivalVO.sellerName }}</template>
									<span>{{ detailData.receivalVO.sellerName }}</span>
								</a-tooltip>
							</a-col>
						</a-row>
						<a-row :gutter="20">
							<a-col span="9">买方名称</a-col>
							<a-col
								span="15"
								class="overflow"
							>
								<a-tooltip>
									<template slot="title">{{ detailData.receivalVO.buyerName }}</template>
									<span>{{ detailData.receivalVO.buyerName }}</span>
								</a-tooltip>
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
							<a-col span="9">行业</a-col>
							<a-col
								span="15"
								class="overflow"
							>
								<span>{{ detailData.receivalVO.industryTypeDesc }}</span>
							</a-col>
						</a-row>
						<a-row :gutter="20">
							<a-col span="9">应付账款类型</a-col>
							<a-col span="15">
								<span v-if="detailData.receivalVO.type == 'PROOF'">凭证结算</span>
								<span v-if="detailData.receivalVO.type == 'INVOICE'">发票结算</span>
							</a-col>
						</a-row>
						<a-row :gutter="20">
							<a-col span="9">应付账款金额</a-col>
							<a-col span="15"
								><span class="red">{{ detailData.receivalVO.amount }}</span
								>&nbsp;元</a-col
							>
						</a-row>
						<a-row :gutter="20">
							<a-col span="9">应付账款起始日期</a-col>
							<a-col span="15">{{ detailData.receivalVO.beginDate }}</a-col>
						</a-row>
					</a-col>
					<a-col span="8">
						<a-row :gutter="20">
							<a-col span="9">金融机构</a-col>
							<a-col
								span="15"
								class="overflow"
							>
								<a-tooltip>
									<template slot="title">{{ detailData.receivalVO.bankName }}</template>
									<span>{{ detailData.receivalVO.bankName }}</span>
								</a-tooltip>
							</a-col>
						</a-row>
						<a-row :gutter="20">
							<a-col span="9">拟融资金额</a-col>
							<a-col span="15"
								><span class="red">{{ detailData.receivalVO.planFinancingAmount }}</span
								>&nbsp;元</a-col
							>
						</a-row>
						<a-row :gutter="20">
							<a-col span="9">应付账款申请日期</a-col>
							<a-col span="15">{{ detailData.receivalVO.requestTime }}</a-col>
						</a-row>
						<a-row
							:gutter="20"
							v-if="detailData.receivalVO.projectNum"
						>
							<a-col span="9">项目编号</a-col>
							<a-col span="15">{{ detailData.receivalVO.projectNum }}</a-col>
						</a-row>
						<a-row :gutter="20">
							<a-col span="9">应付账款到期日期</a-col>
							<a-col span="15">{{ detailData.receivalVO.endDate }}</a-col>
						</a-row>
					</a-col>
				</a-row>
			</div>
			<div
				class="s-card-content"
				style="padding-top: 0"
			>
				<div style="text-align: right; margin-bottom: 10px">
					<a-space>
						<a-button
							type="primary"
							@click="downSellerSign"
							v-show="detailData.receivalVO.assetSellerSign == 1"
							>下载供应商盖章版材料</a-button
						>
						<a-button
							type="primary"
							@click="downloadAll"
							>一键下载所有文档</a-button
						>
					</a-space>
				</div>
				<a-row :gutter="40">
					<a-col span="4">
						<LeftTabs
							@tabChange="tabChange"
							:activeIndex="activeIndex.toString()"
							:detailData="detailData"
						/>
					</a-col>
					<!-- 右侧数据展示模块 -->
					<a-col span="20">
						<!-- 合同 -->
						<contract
							v-show="activeIndex == 0"
							:editFlag="false"
							:contractInfo="detailData.contractInfo"
							:receivalVO="detailData.receivalVO"
						></contract>
						<!-- 运输凭证 -->
						<transport-document
							v-show="activeIndex == 1"
							:editFlag="false"
							:deliverInfo="detailData.deliverInfo"
							:contractInfo="detailData.contractInfo"
							:receivalVO="detailData.receivalVO"
						></transport-document>
						<!-- 数质量凭证 -->
						<quality-document
							v-show="activeIndex == 2"
							:editFlag="false"
							:recvInfo="detailData.recvInfo"
							:contractInfo="detailData.contractInfo"
							:receivalVO="detailData.receivalVO"
						></quality-document>
						<!-- 货转凭证 -->
						<goods-transfer-document
							v-show="activeIndex == 3"
							:editFlag="false"
							:goodTransferInfo="detailData.goodTransferInfo"
							:contractInfo="detailData.contractInfo"
							:deliverInfo="detailData.deliverInfo"
							:receivalVO="detailData.receivalVO"
						></goods-transfer-document>
						<!-- 核算表 -->
						<accounts-table
							v-show="activeIndex == 4"
							:editFlag="false"
							:accountInfo="detailData.accountInfo"
							:receivalVO="detailData.receivalVO"
						></accounts-table>
						<!-- 确认函 -->
						<confirm-letter
							v-show="activeIndex == 5"
							:confirmLetterInfo="detailData.confirmLetterInfo"
							:receivalVO="detailData.receivalVO"
						></confirm-letter>
						<!-- 发票 -->
						<invoice
							v-show="activeIndex == 6"
							:invoiceInfo="detailData.invoiceInfo"
							:receivalVO="detailData.receivalVO"
						></invoice>
						<!-- 其他材料 -->
						<other-files
							v-show="activeIndex == 7"
							:editFlag="false"
							:otherInfo="detailData.otherInfo"
							:receivalVO="detailData.receivalVO"
						></other-files>
						<!-- 结算单 -->
						<settles-files
							v-show="activeIndex == 8"
							:editFlag="false"
							:settleInfo="detailData.settlementInfo"
							:receivalVO="detailData.receivalVO"
						></settles-files>

						<SellerSign
							v-show="activeIndex == 9"
							:editFlag="false"
							:signAttachInfoVO="detailData.signAttachInfoVO"
							:receivalVO="detailData.receivalVO"
						></SellerSign>
					</a-col>
				</a-row>
			</div>
			<div class="bottom-box">
				<!-- 只显⽰当前“平台驳回”的审核信息 -->
				<div
					class="s-card-content"
					v-if="detailData.receivalVO && detailData.auditInfo && detailData.auditInfo.audit"
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
							>{{ detailData.auditInfo.audit.auditResult == 'PASS' ? '通过' : '驳回' }}</a-col
						>
					</a-row>
					<a-row>
						<a-col :span="4">审核意见</a-col>
						<a-col :span="20">{{ detailData.auditInfo.audit.auditOpinion }}</a-col>
					</a-row>
					<a-row v-if="detailData.auditInfo.audit.validateMsg">
						<a-col :span="4">
							<a-space>
								<span>系统校验错误提示</span>
								<span v-if="detailData.auditInfo.audit.validateMsg.length > 10">
									<a-icon
										type="up"
										v-show="validateMsgHideShowMIn"
										@click="validateMsgHideShowMIn = false"
									/>
									<a-icon
										type="down"
										v-show="!validateMsgHideShowMIn"
										@click="validateMsgHideShowMIn = true"
									/>
								</span>
							</a-space>
						</a-col>
						<a-col :span="20">
							<div
								v-for="its in detailData.auditInfo.audit.validateMsg.slice(0, validateMsgHideShowMIn ? undefined : 10)"
								:key="its"
							>
								{{ its }}
							</div>
						</a-col>
					</a-row>
				</div>
				<div
					class="s-card-content"
					v-if="detailData.bankAuditInfo && detailData.bankAuditInfo.audit"
				>
					<h2>审核信息</h2>
					<a-row>
						<a-col :span="4">审批人</a-col>
						<a-col :span="20">{{ detailData.bankAuditInfo.audit.auditor }}</a-col>
					</a-row>
					<a-row>
						<a-col :span="4">审核时间</a-col>
						<a-col :span="20">{{ detailData.bankAuditInfo.audit.auditTime }}</a-col>
					</a-row>
					<a-row>
						<a-col :span="4">审核结果</a-col>
						<a-col
							:span="20"
							class="red"
							>{{ detailData.bankAuditInfo.audit.auditResult == 'PASS' ? '通过' : '驳回' }}</a-col
						>
					</a-row>
					<a-row>
						<a-col :span="4">审核意见</a-col>
						<a-col :span="20">{{ detailData.bankAuditInfo.audit.auditOpinion }}</a-col>
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
		</a-card>
	</div>
</template>
<script>
import { filterCodeByValueName } from '@sub/utils/globalCode.js';
import {
	API_GetAccountsDetail,
	API_AuditReceivableDownload,
	API_AuditReceivableSellerSignDownload
} from '@/v2/center/assets/api/index.js';
import Contract from '@/v2/center/assets/components/contract.vue';
import TransportDocument from '@/v2/center/assets/components/TransportDocument.vue';
import QualityDocument from '@/v2/center/assets/components/QualityDocument.vue';
import GoodsTransferDocument from '@/v2/center/assets/components/GoodsTransferDocument.vue';
import AccountsTable from '@/v2/center/assets/components/AccountsTable.vue';
import ConfirmLetter from '@/v2/center/assets/components/ConfirmLetter.vue';
import Invoice from '@/v2/center/assets/components/Invoice.vue';
import OtherFiles from '@/v2/center/assets/components/OtherFiles.vue';
import SettlesFiles from '@/v2/center/assets/components/SettlesFiles.vue';
import SellerSign from '@/v2/center/assets/components/SellerSign.vue';
import LeftTabs from '@/v2/center/assets/components/common/LeftTabs2.vue';
import comDownload from '@sub/utils/comDownload.js';
import Breadcrumb from '@/v2/components/breadcrumb/index';

export default {
	props: {
		detailData: {
			type: Object,
			default: () => {
				return {};
			}
		}
	},
	data() {
		return {
			filterCodeByValueName: filterCodeByValueName,
			activeIndex: this.$route.query.activeIndex,
			industryType: 'COAL',
			validateMsgHideShowMIn: false
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
		OtherFiles,
		SettlesFiles,
		LeftTabs,
		Breadcrumb,
		SellerSign
	},
	mounted: function () {
		this.tabChange(this.$route.query.activeIndex);
		// API_GetAccountsDetail({ id: this.$route.query.id }).then(res => {
		// 	if (res.success) {
		// 		this.detailData = res.data;
		// 		this.industryType = this.detailData.receivalVO.industryType;
		// 	}
		// });
	},
	methods: {
		tabChange(index) {
			// 下游数据tabs切换
			this.activeIndex = index;
		},
		downloadAll() {
			// 一键下载所有文档

			API_AuditReceivableDownload({ id: this.$route.query.id }).then(res => {
				comDownload(res, null, '资产附件.zip');
			});
		},
		downSellerSign() {
			// 盖章版材料下载

			API_AuditReceivableSellerSignDownload({ id: this.$route.query.id }).then(res => {
				comDownload(res, null, '供应商盖章版材料.zip');
			});
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
</style>
