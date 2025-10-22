<template>
	<div class="slMain">
		<Breadcrumb />
		<a-card
			:bordered="false"
			v-if="detailData.length"
		>
			<div class="methods-wrap">
				<span
					slot="title"
					class="slTitle"
					>应收账款审核</span
				>
			</div>
			<a-tabs :default-active-key="0">
				<a-tab-pane
					v-for="(item, index) in detailData"
					:key="index"
					:tab="item.auditInfo && item.auditInfo.audit ? item.auditInfo.audit.auditTime : '当前信息'"
				>
					<div
						class="s-card-content"
						v-if="item.auditInfo && item.auditInfo.audit"
					>
						<h2>审核信息</h2>
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
							<a-col :span="4">审核人</a-col>
							<a-col :span="20">{{ item.auditInfo.audit.auditor }}</a-col>
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
									<a-col span="9">应收账款流水号</a-col>
									<a-col
										span="15"
										class="overflow"
									>
										<a-tooltip>
											<template slot="title">{{ item.receivalVO.serialNo }}</template>
											<span>{{ item.receivalVO.serialNo }}</span>
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
											<template slot="title">{{ item.receivalVO.sellerName }}</template>
											<span>{{ item.receivalVO.sellerName }}</span>
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
											<template slot="title">{{ item.receivalVO.buyerName }}</template>
											<span>{{ item.receivalVO.buyerName }}</span>
										</a-tooltip>
									</a-col>
								</a-row>
								<a-row :gutter="20">
									<a-col span="9">状态</a-col>
									<a-col span="15">
										<span>{{ filterCodeByValueName(item.receivalVO.status, 'receivableStatusDict') }}</span>
									</a-col>
								</a-row>
							</a-col>

							<a-col span="8">
								<a-row :gutter="20">
									<a-col span="9">应收账款类型</a-col>
									<a-col span="15">
										<span v-if="item.receivalVO.type == 'PROOF'">凭证结算</span>
										<span v-if="item.receivalVO.type == 'INVOICE'">发票结算</span>
									</a-col>
								</a-row>
								<a-row :gutter="20">
									<a-col span="9">应收账款金额</a-col>
									<a-col span="15"
										><span class="red">{{ item.receivalVO.amount }}</span
										>&nbsp;元</a-col
									>
								</a-row>
								<a-row :gutter="20">
									<a-col span="9">应收账款起始日期</a-col>
									<a-col span="15">{{ item.receivalVO.beginDate }}</a-col>
								</a-row>
								<a-row :gutter="20">
									<a-col span="9">应收账款到期日期</a-col>
									<a-col span="15">{{ item.receivalVO.endDate }}</a-col>
								</a-row>
							</a-col>
							<a-col span="8">
								<a-row :gutter="20">
									<a-col span="9">金融机构</a-col>
									<a-col span="15">{{ item.receivalVO.bankName }}</a-col>
								</a-row>
								<a-row :gutter="20">
									<a-col span="9">拟融资金额</a-col>
									<a-col span="15"
										><span class="red">{{ item.receivalVO.planFinancingAmount }}</span
										>&nbsp;元</a-col
									>
								</a-row>
								<a-row :gutter="20">
									<a-col span="9">应收账款申请日期</a-col>
									<a-col span="15">{{ item.receivalVO.requestTime }}</a-col>
								</a-row>
								<a-row
									:gutter="20"
									v-if="item.receivalVO.projectNum"
								>
									<a-col span="9">项目编号</a-col>
									<a-col span="15">{{ item.receivalVO.projectNum }}</a-col>
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
							<a-col span="4">
								<LeftTabs
									@tabChange="tabChange"
									:activeIndex="activeIndex.toString()"
									:detailData="item"
								/>
							</a-col>
							<!-- 右侧数据展示模块 -->
							<a-col span="20">
								<!-- 合同 -->
								<contract
									v-show="activeIndex == 0"
									:editFlag="false"
									:contractInfo="item.contractInfo"
									:receivalVO="item.receivalVO"
								></contract>
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
							</a-col>
						</a-row>
					</div>
				</a-tab-pane>
			</a-tabs>
			<div class="bottom-box">
				<div class="s-card-content">
					<h2>审核</h2>
					<a-form-model
						ref="auditForm"
						:model="auditForm"
						:rules="auditRules"
					>
						<a-row>
							<a-col
								:span="24"
								class="row"
							>
								<a-form-model-item
									ref="auditResult"
									label="审核结果"
									prop="auditResult"
									:colon="false"
									:label-col="{ span: 3 }"
									:wrapper-col="{ span: 20 }"
								>
									<a-radio-group v-model="auditForm.auditResult">
										<a-radio value="PASS">通过</a-radio>
										<a-radio value="REJECT">驳回</a-radio>
									</a-radio-group>
								</a-form-model-item>
							</a-col>
							<a-col
								:span="24"
								class="row"
								v-if="auditForm.auditResult == 'REJECT'"
							>
								<a-form-model-item
									ref="auditOption"
									label="审核意见"
									prop="auditOption"
									:colon="false"
									:label-col="{ span: 3 }"
									:wrapper-col="{ span: 20 }"
								>
									<a-textarea
										v-model="auditForm.auditOption"
										placeholder="请输入内容，最多输入1000个字符"
										:maxLength="1000"
									></a-textarea>
								</a-form-model-item>
							</a-col>
							<a-col
								:span="24"
								class="row"
								v-else
							>
								<a-form-model-item
									ref="auditOptionOth"
									label="审核意见"
									prop="auditOptionOth"
									:colon="false"
									:label-col="{ span: 3 }"
									:wrapper-col="{ span: 20 }"
								>
									<a-textarea
										v-model="auditForm.auditOption"
										placeholder="请输入内容，最多输入1000个字符"
										:maxLength="1000"
									></a-textarea>
								</a-form-model-item>
							</a-col>
							<a-col
								:span="24"
								class="row btn-group"
							>
								<a-button
									type="primary"
									@click="$router.back()"
									ghost
									>取消</a-button
								>
								<a-button
									type="primary"
									class="submit_btn"
									@click="handleSubmit"
									>确定</a-button
								>
							</a-col>
						</a-row>
					</a-form-model>
				</div>
			</div>
		</a-card>
	</div>
</template>
<script>
import { API_GetAccountsDetailJR, API_AuditReceivableJR, API_AuditReceivableJRDownload } from '@/v2/center/assets/api/index.js';
import Contract from '@/v2/center/assets/components/contract.vue';
import TransportDocument from '@/v2/center/assets/components/TransportDocument.vue';
import QualityDocument from '@/v2/center/assets/components/QualityDocument.vue';
import GoodsTransferDocument from '@/v2/center/assets/components/GoodsTransferDocument.vue';
import AccountsTable from '@/v2/center/assets/components/AccountsTable.vue';
import ConfirmLetter from '@/v2/center/assets/components/ConfirmLetter.vue';
import Invoice from '@/v2/center/assets/components/Invoice.vue';
import OtherFiles from '@/v2/center/assets/components/OtherFiles.vue';
import SettlesFiles from '@/v2/center/assets/components/SettlesFiles.vue';
import Breadcrumb from '@/v2/components/breadcrumb/index';

import comDownload from '@sub/utils/comDownload.js';
import { filterCodeByValueName } from '@sub/utils/globalCode.js';
import LeftTabs from '@/v2/center/assets/components/common/LeftTabs2.vue';

export default {
	props: {
		detailData: {
			type: Array,
			default: () => {
				return [];
			}
		}
	},

	data() {
		return {
			filterCodeByValueName: filterCodeByValueName,
			activeIndex: this.$route.query.activeIndex,
			numberTwoReg: /^(\d+)(\.\d{1,2})?$/,
			// zongzhiForm:this.$form.createForm(this),
			auditForm: {
				auditResult: 'PASS',
				auditOption: ''
			},
			auditRules: {
				auditResult: [{ required: true, message: '审核结果不能为空', trigger: 'change' }],
				auditOption: [{ required: true, message: '审核意见不能为空', trigger: 'change' }],
				auditOptionOth: [{ required: false, message: '', trigger: 'change' }]
			}
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
		Breadcrumb
	},
	mounted: function () {
		this.getDetail();
	},
	methods: {
		getDetail() {
			this.$nextTick(() => {
				this.tabChange(this.$route.query.activeIndex);
			});

			// API_GetAccountsDetailJR({ id: this.$route.query.id }).then(res => {
			// 	if (res.success) {
			// 		this.detailData = res.data || [];
			// 		this.$nextTick(() => {
			// 			this.tabChange(this.$route.query.activeIndex);
			// 		});
			// 	}
			// });
		},
		tabChange(index) {
			// 下游数据tabs切换
			this.activeIndex = index;
		},

		downloadAll() {
			// 一键下载所有文档

			API_AuditReceivableJRDownload({ id: this.$route.query.id }).then(res => {
				comDownload(res, null, '资产附件.zip');
			});
		},
		handleSubmit() {
			this.$refs.auditForm.validate(valid => {
				if (valid) {
					API_AuditReceivableJR({
						assetId: this.$route.query.id,
						auditResult: this.auditForm.auditResult,
						auditOption: this.auditForm.auditOption
					}).then(res => {
						if (res.success && res.data) {
							this.$message.success('提交审核成功');
							this.$router.go(-1);
						}
					});
				}
			});
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

.btn-group {
	text-align: right;
	margin-top: 16px;
	button {
		width: 104px;
	}
	.submit_btn {
		margin-left: 16px;
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

::v-deep .ant-form-item-label {
	text-align: left;
}
</style>
