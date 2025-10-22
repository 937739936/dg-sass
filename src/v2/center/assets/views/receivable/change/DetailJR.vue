<template>
	<div class="slMain">
		<Breadcrumb />
		<a-card
			:bordered="false"
			v-if="detailData"
		>
			<div class="methods-wrap">
				<span
					v-if="$route.query.isAudit == '1'"
					slot="title"
					class="slTitle"
					>应收账款变更审核</span
				>
				<span
					v-else
					slot="title"
					class="slTitle"
					>应收账款变更详情</span
				>
				<a
					href="javascript:;"
					@click="$router.back()"
					>返回</a
				>
			</div>
			<a-tabs :default-active-key="0">
				<a-tab-pane
					v-for="(detailData, index) in detailDataList"
					:key="index"
					:tab="
						detailData && detailData.auditInfo && detailData.auditInfo.audit ? detailData.auditInfo.audit.auditTime : '当前信息'
					"
				>
					<div class="bottom-box">
						<div
							class="s-card-content"
							v-if="detailData.auditInfo && detailData.auditInfo.audit"
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
						</div>
						<div
							class="s-card-content"
							v-if="detailData.commentInfo && detailData.commentInfo.comment"
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
					<div class="bottom-box">
						<div
							class="s-card-content"
							v-if="detailData.receivalVO"
						>
							<h2>应收账款变更信息</h2>
							<a-row :gutter="40">
								<a-col span="12">
									<a-row :gutter="20">
										<a-col span="9">变更记录编号</a-col>
										<a-col span="15">{{ detailData.receivalVO.serialNo }}</a-col>
									</a-row>
								</a-col>
								<a-col span="12">
									<a-row :gutter="20">
										<a-col span="9">原应收账款金额</a-col>
										<a-col span="15"
											>{{ (detailData.originalReceivalVO && detailData.originalReceivalVO.amount) || '-' }}&nbsp;元</a-col
										>
									</a-row>
								</a-col>
								<a-col span="12">
									<a-row :gutter="20">
										<a-col span="9">拟融资金额</a-col>
										<a-col span="15">{{ detailData.receivalVO.planFinancingAmount }}&nbsp;元</a-col>
									</a-row>
								</a-col>
							</a-row>
							<a-row :gutter="40">
								<a-col span="12">
									<a-row :gutter="20">
										<a-col span="9">变更记录状态</a-col>
										<a-col span="15">{{ detailData.receivalVO.statusText }}</a-col>
									</a-row>
								</a-col>
								<a-col span="12">
									<a-row :gutter="20">
										<a-col span="9">应收账款变更后金额</a-col>
										<a-col span="15">{{ detailData.receivalVO.amount }}&nbsp;元</a-col>
									</a-row>
								</a-col>
								<a-col span="12">
									<a-row :gutter="20">
										<a-col span="9">变更申请日期</a-col>
										<a-col span="15">{{ detailData.receivalVO.requestTime }}</a-col>
									</a-row>
								</a-col>
							</a-row>
						</div>
						<div
							class="s-card-content"
							v-if="detailData.originalReceivalVO"
							style="padding-top: 0"
						>
							<h2>应收账款基本信息</h2>
							<a-row
								class="row"
								:gutter="40"
							>
								<a-col span="8">
									<a-row :gutter="20">
										<a-col span="9">应收账款流水号</a-col>
										<a-col
											span="15"
											class="overflow"
										>
											<a-tooltip>
												<template slot="title">{{ detailData.originalReceivalVO.serialNo }}</template>
												<a @click="openAssets(detailData.originalReceivalVO)">{{ detailData.originalReceivalVO.serialNo }}</a>
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
												<template slot="title">{{ detailData.originalReceivalVO.sellerName }}</template>
												<span>{{ detailData.originalReceivalVO.sellerName }}</span>
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
												<template slot="title">{{ detailData.originalReceivalVO.buyerName }}</template>
												<span>{{ detailData.originalReceivalVO.buyerName }}</span>
											</a-tooltip>
										</a-col>
									</a-row>
									<a-row :gutter="20">
										<a-col span="9">状态</a-col>
										<a-col span="15">
											<span>{{ filterCodeByValueName(detailData.originalReceivalVO.status, 'receivableStatusDict') }}</span>
										</a-col>
									</a-row>
								</a-col>
								<a-col span="8">
									<a-row :gutter="20">
										<a-col span="9">应收账款类型</a-col>
										<a-col span="15">
											<span v-if="detailData.originalReceivalVO.type == 'PROOF'">凭证结算</span>
											<span v-if="detailData.originalReceivalVO.type == 'INVOICE'">发票结算</span>
										</a-col>
									</a-row>
									<a-row :gutter="20">
										<a-col span="9">原应收账款金额</a-col>
										<a-col span="15"
											><span class="red1">{{ detailData.originalReceivalVO.amount }}</span
											>&nbsp;元</a-col
										>
									</a-row>
									<a-row :gutter="20">
										<a-col span="9">应收账款起始日期</a-col>
										<a-col span="15">{{ detailData.originalReceivalVO.beginDate }}</a-col>
									</a-row>
									<a-row :gutter="20">
										<a-col span="9">应收账款到期日期</a-col>
										<a-col span="15">{{ detailData.originalReceivalVO.endDate }}</a-col>
									</a-row>
								</a-col>
								<a-col span="8">
									<a-row :gutter="20">
										<a-col span="9">金融机构</a-col>
										<a-col span="15">{{ detailData.originalReceivalVO.bankName }}</a-col>
									</a-row>
									<a-row :gutter="20">
										<a-col span="9">应收账款申请日期</a-col>
										<a-col span="15">{{ detailData.originalReceivalVO.requestTime }}</a-col>
									</a-row>
								</a-col>
							</a-row>
						</div>
					</div>
					<div
						class="s-card-content"
						style="padding: 0 0 0 8px"
					>
						<div style="text-align: right; margin-bottom: 10px">
							<a-button
								type="primary"
								@click="downloadAll"
								>一键下载所有文档</a-button
							>
						</div>
						<a-row :gutter="40">
							<a-col span="4">
								<div class="tabs-bar">
									<div @click="tabChange(2)">
										<div class="tabs-icon" :class="activeIndex == 2 ? 'blue' : ''">
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

									<div @click="tabChange(4)" :class="activeIndex == 4 ? 'blue' : ''">
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
									<div @click="tabChange(5)" :class="activeIndex == 5 ? 'blue' : ''">
										<div class="tabs-icon">
											<img
												src="@sub/assets/imgs/assets/confirm.png"
												alt=""
											/>
											<em></em>
										</div>
										<div class="tabs-text">
											<p :class="activeIndex == 5 ? 'blue' : ''">确认函</p>
										</div>
										<i :class="judgeColor(5)"></i>
									</div>
									<div @click="tabChange(6)" :class="activeIndex == 6 ? 'blue' : ''">
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
									<div @click="tabChange(7)" :class="activeIndex == 7 ? 'blue' : ''">
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
							<a-col span="20">
								<div style="min-height: 420px; display: flex; flex-direction: column; justify-content: space-between">
									<!-- 数质量凭证 -->
									<quality-document
										v-show="activeIndex == 2"
										:editFlag="false"
										:recvInfo="detailData.recvInfo"
										:contractInfo="detailData.contractInfo"
										ref="quality"
										:receivalVO="detailData.receivalVO"
									></quality-document>
									<!-- 核算表 -->
									<accounts-table
										v-show="activeIndex == 4"
										:editFlag="false"
										:accountInfo="detailData.accountInfo"
										ref="accounts"
										:receivalVO="detailData.receivalVO"
									></accounts-table>
									<!-- 确认函 -->
									<confirm-letter
										v-show="activeIndex == 5"
										:confirmLetterInfo="detailData.confirmLetterInfo"
										ref="confirm"
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
										ref="other"
									></other-files>
								</div>
							</a-col>
						</a-row>
					</div>
				</a-tab-pane>
			</a-tabs>
			<div
				class="bottom-box"
				v-if="isAudit"
			>
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
								style="text-align: center"
							>
								<a-button
									type="primary"
									@click="$router.push('/center/assets/receivable/change/listJR')"
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
import { filterCodeByValueName } from '@sub/utils/globalCode.js';
import { API_GetAccountsDetailJR, API_AuditReceivableJR, API_AuditReceivableJRDownload } from '@/v2/center/assets/api/index.js';
import QualityDocument from '@/v2/center/assets/components/change/QualityDocument.vue';
import AccountsTable from '@/v2/center/assets/components/change/AccountsTable.vue';
import ConfirmLetter from '@/v2/center/assets/components/change/ConfirmLetter.vue';
import Invoice from '@/v2/center/assets/components/change/Invoice.vue';
import OtherFiles from '@/v2/center/assets/components/change/OtherFiles.vue';
import comDownload from '@sub/utils/comDownload.js'
import Breadcrumb from '@/v2/components/breadcrumb/index';

export default {
	data() {
		return {
			auditForm: {
				auditResult: 'PASS',
				auditOption: ''
			},
			isAudit: false,
			detailDataList: [],
			auditRules: {
				auditResult: [{ required: true, message: '审核结果不能为空', trigger: 'change' }],
				auditOption: [{ required: true, message: '审核意见不能为空', trigger: 'change' }],
				auditOptionOth: [{ required: false, message: '', trigger: 'change' }]
			},
			showTime: false,
			filterCodeByValueName: filterCodeByValueName,
			activeIndex: this.$route.query.activeIndex,
			detailData: '', // 详情数据
			visible: false // 提交时发票状态错误提示信息弹窗
		};
	},
	components: {
		QualityDocument,
		AccountsTable,
		ConfirmLetter,
		Invoice,
		OtherFiles,
		Breadcrumb
	},
	computed: {},
	mounted: function () {
		this.tabChange(this.$route.query.activeIndex);
		this.isAudit = this.$route.query.isAudit;
		API_GetAccountsDetailJR({ id: this.$route.query.id }).then(res => {
			if (res.success) {
				// // 默认第一个是实时时间
				// if (res.data.length == 1) {
				//     this.detailData = [res.data[0]]
				// } else if (res.data.length > 1){
				//     this.detailData = res.data.slice(1)
				//     this.showSTime = true

				// } else {
				//     this.detailData = []
				// }
				if (res.data && res.data.length) {
					this.detailData = res.data[0];
					this.detailDataList = res.data || [];
					// this.detailData.originalReceivalVO = res.data[0] || {}
				}
			}
		});
	},
	methods: {
		tabChange(index) {
			// 下游数据tabs切换
			this.activeIndex = index;
		},
		judgeColor(index) {
			// 项下各必备附件存在数据时，标记绿色
			// 项下附件存在数据时，标记桔色
			// 项下附件无数据时，标记红色
			//0-合同 1-运输凭证 2-数质量凭证 3-货转凭证 4-核算表 5-确认函 6-发票 7-其他材料
			if (!this.detailData) return;
			if (index == 2) {
				// 数质量凭证
				if (this.detailData.recvInfo.attachList && this.detailData.recvInfo.attachList.length > 0) {
					return 'green';
				} else {
					return 'red';
				}
			} else if (index == 4) {
				// 核算表凭证
				if (this.detailData.accountInfo.list && this.detailData.accountInfo.list.length > 0) {
					return 'green';
				} else {
					return 'red';
				}
			} else if (index == 5) {
				// 确认函
				if (this.detailData.confirmLetterInfo.list && this.detailData.confirmLetterInfo.list.length > 0) {
					return 'orange';
				} else {
					return 'red';
				}
			} else if (index == 6) {
				// 发票
				if (this.detailData.invoiceInfo.list && this.detailData.invoiceInfo.list.length > 0) {
					return 'orange';
				} else {
					return 'red';
				}
			} else if (index == 7) {
				// 其他材料
				if (this.detailData.otherInfo.list && this.detailData.otherInfo.list.length > 0) {
					return 'orange';
				} else {
					return 'red';
				}
			}
		},
		openAssets(record) {
			const { href } = this.$router.resolve({
				path: '/center/assets/receivable/JR/detail',
				query: {
					id: record.id,
					activeIndex: '0'
				}
			});

			window.open(href, '_new');
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
.ant-tabs {
	background: #fff;
}
.top-box {
	overflow: hidden;
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
.ant-tabs-tabpane {
	flex-direction: column;
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
	display: inline-block;
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
.btn-box {
	background: #ffffff !important;
	border-radius: 8px;
	padding: 20px 0;
	margin-top: 20px;
}
.btn-box .btn-wrap {
	margin: 0;
}
</style>
