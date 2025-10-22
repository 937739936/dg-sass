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
					>查看预付资产</span
				>
				<a
					href="javascript:;"
					@click="$router.back()"
					>返回</a
				>
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
				<div
					class="s-card-content"
					v-if="detailData.assetBillVO"
				>
					<h2>融单信息</h2>
					<a-row
						class="row"
						:gutter="40"
					>
						<a-col span="8">
							<a-row :gutter="20">
								<a-col span="9">融单编号</a-col>
								<a-col span="15">{{ detailData.assetBillVO.bankBillNo }}</a-col>
							</a-row>
							<a-row :gutter="20">
								<a-col span="9">融单开立方</a-col>
								<a-col span="15">{{ detailData.assetBillVO.issuerName }}</a-col>
							</a-row>
							<a-row :gutter="20">
								<a-col span="9">开立日期</a-col>
								<a-col span="15">{{ detailData.assetBillVO.issueDate }}</a-col>
							</a-row>
							<a-row :gutter="20">
								<a-col span="9">融单状态</a-col>
								<a-col span="15">{{ detailData.assetBillVO.statusDesc }}</a-col>
							</a-row>
						</a-col>
						<a-col span="8">
							<a-row :gutter="20">
								<a-col span="9">融单金额</a-col>
								<a-col span="15">{{ detailData.assetBillVO.amount }}&nbsp;元</a-col>
							</a-row>
							<a-row :gutter="20">
								<a-col span="9">融单接收方</a-col>
								<a-col span="15">{{ detailData.assetBillVO.receiverName }}</a-col>
							</a-row>
							<a-row :gutter="20">
								<a-col span="9">承诺付款日期</a-col>
								<a-col span="15">{{ detailData.assetBillVO.acceptanceDate }}</a-col>
							</a-row>
						</a-col>
					</a-row>
				</div>
				<div
					class="s-card-content"
					v-if="detailData.receivalVO"
				>
					<h2>基本信息</h2>
					<a-row
						class="row"
						:gutter="40"
					>
						<a-col span="8">
							<a-row :gutter="20">
								<a-col span="9">预付账款流水号</a-col>
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
								<a-col span="9">金融机构</a-col>
								<a-col span="15">{{ detailData.receivalVO.bankName }}</a-col>
							</a-row>
						</a-col>
						<a-col span="8">
							<a-row :gutter="20">
								<a-col span="9">预付账款金额</a-col>
								<a-col span="15"
									><span class="red">{{ detailData.receivalVO.amount }}</span
									>&nbsp;元</a-col
								>
							</a-row>

							<a-row :gutter="20">
								<a-col span="9">预付融资申请日期</a-col>
								<a-col span="15">{{ detailData.receivalVO.requestTime }}</a-col>
							</a-row>
							<a-row :gutter="20">
								<a-col span="9">开立日期</a-col>
								<a-col span="15">{{ detailData.receivalVO.planPayDate }}</a-col>
							</a-row>
						</a-col>
						<a-col span="8">
							<a-row :gutter="20">
								<a-col span="9">拟融资金额</a-col>
								<a-col span="15"
									><span class="red">{{ detailData.receivalVO.planFinancingAmount }}</span
									>&nbsp;元</a-col
								>
							</a-row>
							<a-row :gutter="20">
								<a-col span="9">付款类型</a-col>
								<a-col span="15">
									<span>{{ detailData.receivalVO.payTypeDesc }}</span>
								</a-col>
							</a-row>
							<a-row :gutter="20">
								<a-col span="9">承诺付款日期</a-col>
								<a-col span="15">{{ detailData.receivalVO.promisePayDate }}</a-col>
							</a-row>
						</a-col>
					</a-row>
				</div>
			</div>
			<div class="s-card-content">
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
						<div style="min-height: 520px; display: flex; flex-direction: column; justify-content: space-between">
							<!-- 合同 -->
							<contract
								v-show="activeIndex == 0"
								:editFlag="false"
								:isAdvance="true"
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
								:isAdvance="true"
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
						</div>
					</a-col>
				</a-row>
			</div>
		</a-card>
	</div>
</template>
<script>
import { filterCodeByValueName } from '@sub/utils/globalCode.js';
import { API_GetAccountsDetail } from '@/v2/center/assets/api/index.js';
import Contract from '@/v2/center/assets/components/contract.vue';
import TransportDocument from '@/v2/center/assets/components/TransportDocument.vue';
import QualityDocument from '@/v2/center/assets/components/QualityDocument.vue';
import GoodsTransferDocument from '@/v2/center/assets/components/GoodsTransferDocument.vue';
import AccountsTable from '@/v2/center/assets/components/AccountsTable.vue';
import ConfirmLetter from '@/v2/center/assets/components/ConfirmLetter.vue';
import Invoice from '@/v2/center/assets/components/Invoice.vue';
import OtherFiles from '@/v2/center/assets/components/OtherFiles.vue';
import LeftTabs from '@/v2/center/assets/components/common/LeftTabs2.vue';
import Breadcrumb from '@/v2/components/breadcrumb/index';

export default {
	data() {
		return {
			filterCodeByValueName: filterCodeByValueName,
			activeIndex: this.$route.query.activeIndex,
			strMsg: '', // 提交时发票状态错误提示信息内容
			visible: false // 提交时发票状态错误提示信息弹窗
		};
	},
	props: {
		defaultIndex: {
			type: [Number, String],
			default: () => {
				return 0;
			}
		},
		detailData: {
			type: Object,
			default: () => {
				return {};
			}
		}
	},
	watch: {
		defaultIndex(data) {
			this.activeIndex = data;
		}
	},

	components: {
		Contract,
		Invoice,
		OtherFiles,
		ConfirmLetter,
		AccountsTable,
		GoodsTransferDocument,
		QualityDocument,
		TransportDocument,
		LeftTabs,
		Breadcrumb
	},
	computed: {},
	mounted: function () {
		this.tabChange(this.$route.query.activeIndex);
		API_GetAccountsDetail({ id: this.$route.query.id }).then(res => {
			if (res.success) {
				this.detailData = res.data;
			}
		});
	},
	methods: {
		tabChange(index) {
			// 下游数据tabs切换
			this.activeIndex = index;
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
	padding: 20px 16px 24px 16px;
	border-radius: 8px;
	background: #fff;
	margin: 14px 0 0 0;
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
