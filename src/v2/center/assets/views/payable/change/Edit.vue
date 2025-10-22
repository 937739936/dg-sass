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
					>编辑应付账款变更</span
				>
				<a
					href="javascript:;"
					@click="$router.push('/center/assets/payable/change/list')"
					>返回</a
				>
			</div>
			<div class="bottom-box">
				<!-- 只显⽰当前“平台驳回”的审核信息 -->
				<div
					class="s-card-content"
					v-if="detailData.auditInfo && detailData.auditInfo.audit && detailData.auditInfo.audit.auditResult != 'PASS'"
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
					<h2>应付账款变更信息</h2>
					<a-row :gutter="40">
						<a-col span="12">
							<a-row :gutter="20">
								<a-col span="9">变更记录编号</a-col>
								<a-col span="15">{{ detailData.receivalVO.serialNo }}</a-col>
							</a-row>
						</a-col>
						<a-col span="12">
							<a-row :gutter="20">
								<a-col span="9">原应付账款金额</a-col>
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
								<a-col span="9">应付账款变更后金额</a-col>
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
				>
					<h2>应付账款基本信息</h2>
					<a-row
						class="row"
						:gutter="40"
					>
						<a-col span="8">
							<a-row :gutter="20">
								<a-col span="9">应付账款流水号</a-col>
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
								<a-col span="9">应付账款类型</a-col>
								<a-col span="15">
									<span v-if="detailData.originalReceivalVO.type == 'PROOF'">凭证结算</span>
									<span v-if="detailData.originalReceivalVO.type == 'INVOICE'">发票结算</span>
								</a-col>
							</a-row>
							<a-row :gutter="20">
								<a-col span="9">原应付账款金额</a-col>
								<a-col span="15"
									><span class="red1">{{ detailData.originalReceivalVO.amount }}</span
									>&nbsp;元</a-col
								>
							</a-row>
							<a-row :gutter="20">
								<a-col span="9">应付账款起始日期</a-col>
								<a-col span="15">{{ detailData.originalReceivalVO.beginDate }}</a-col>
							</a-row>
							<a-row :gutter="20">
								<a-col span="9">应付账款到期日期</a-col>
								<a-col span="15">{{ detailData.originalReceivalVO.endDate }}</a-col>
							</a-row>
						</a-col>
						<a-col span="8">
							<a-row :gutter="20">
								<a-col span="9">金融机构</a-col>
								<a-col span="15">{{ detailData.originalReceivalVO.bankName }}</a-col>
							</a-row>
							<a-row :gutter="20">
								<a-col span="9">应付账款申请日期</a-col>
								<a-col span="15">{{ detailData.originalReceivalVO.requestTime }}</a-col>
							</a-row>
						</a-col>
					</a-row>
				</div>
			</div>
			<div class="s-card-content">
				<a-row :gutter="40">
					<a-col span="4">
						<div class="tabs-bar">
							<div
								@click="tabChange(2)"
								:class="activeIndex == 2 ? 'blue' : ''"
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
								@click="tabChange(4)"
								:class="activeIndex == 4 ? 'blue' : ''"
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
								@click="tabChange(5)"
								:class="activeIndex == 5 ? 'blue' : ''"
							>
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
							<div
								@click="tabChange(6)"
								:class="activeIndex == 6 ? 'blue' : ''"
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
							<div
								@click="tabChange(7)"
								:class="activeIndex == 7 ? 'blue' : ''"
							>
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
						<div style="min-height: 520px; display: flex; flex-direction: column; justify-content: space-between">
							<!-- 数质量凭证 -->
							<quality-document
								v-show="activeIndex == 2"
								:editFlag="true"
								:showEditorRadio="true"
								:recvInfo="detailData.recvInfo"
								:contractInfo="detailData.contractInfo"
								ref="quality"
								:isChange="true"
								:receivalVO="detailData.receivalVO"
							></quality-document>
							<!-- 核算表 -->
							<accounts-table
								v-show="activeIndex == 4"
								:editFlag="true"
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
								:editFlag="true"
								:otherInfo="detailData.otherInfo"
								:receivalVO="detailData.receivalVO"
								ref="other"
							></other-files>
						</div>
					</a-col>
				</a-row>
			</div>
			<div class="btn-box">
				<div
					class="btn-wrap"
					v-if="detailData"
				>
					<a-button
						@click="$router.push('/center/assets/payable/change/list')"
						type="primary"
						ghost
						>取消</a-button
					>
					<a-button
						type="primary"
						@click="onSubmit('save')"
						>保存</a-button
					>
					<a-button
						type="primary"
						@click="onSubmit('submit')"
						>提交</a-button
					>
				</div>
			</div>
		</a-card>
		<modalMain
			ref="modalMain"
			title="提交确认"
			:width="500"
			@verify="modalMainOK"
		>
			<div class="main">
				<div class="title">请确认以下信息是否有误:</div>
				<div class="mainTable">
					<div
						class="item"
						v-if="needPushOaShow"
					>
						<span class="label required">是否推送OA：</span>
						<a-radio-group
							name="radioGroup"
							v-model="needPushOa"
						>
							<a-radio :value="true"> 推送 </a-radio>
							<a-radio :value="false"> 不推送 </a-radio>
						</a-radio-group>
					</div>
					<div class="item">
						<span class="label">卖方企业：</span>
						<span v-if="detailData.receivalVO">{{ detailData.receivalVO.sellerName || '-' }}</span>
					</div>
					<div class="item">
						<span class="label">资金类型：</span>
						<span v-if="detailData.receivalVO">{{ detailData.receivalVO.paymentTypeName || '-' }}</span>
					</div>
					<div class="item">
						<span class="label">原应付账款金额：</span>
						<span
							v-if="detailData.originalReceivalVO"
							class="red"
						>
							{{ detailData.originalReceivalVO.amount | formatMoney(4) }}元({{
								convertCurrency(detailData.originalReceivalVO.amount)
							}})</span
						>
						<span v-else>-</span>
					</div>
					<div class="item">
						<span class="label">应付账款变更后金额：</span>
						<span
							v-if="detailData.receivalVO"
							class="red"
							>{{ detailData.receivalVO.amount | formatMoney(4) }}元({{ convertCurrency(detailData.receivalVO.amount) }})</span
						>
						<span v-else>-</span>
					</div>
					<div class="item">
						<span class="label">本次拟融资金额：</span>
						<span
							v-if="detailData.receivalVO"
							class="red"
						>
							{{ detailData.receivalVO.planFinancingAmount | formatMoney(4) }}元({{
								convertCurrency(detailData.receivalVO.planFinancingAmount)
							}})
						</span>
						<span v-else>-</span>
					</div>
				</div>
			</div>
		</modalMain>
	</div>
</template>
<script>
import { filterCodeByValueName } from '@sub/utils/globalCode.js';
import { API_GetAccountsDetail, API_EditAccountsPayable, API_COMPANplatformRiskAudit } from '@/v2/center/assets/api/index.js';
import { API_COMPANYOACHECKPOOL } from '@/api/index.js';
import QualityDocument from '@/v2/center/assets/components/change/QualityDocument.vue';
import AccountsTable from '@/v2/center/assets/components/change/AccountsTable.vue';
import ConfirmLetter from '@/v2/center/assets/components/change/ConfirmLetter.vue';
import Invoice from '@/v2/center/assets/components/change/Invoice.vue';
import OtherFiles from '@/v2/center/assets/components/change/OtherFiles.vue';
import Breadcrumb from '@/v2/components/breadcrumb/index';
import modalMain from '@/v2/components/modalInfo/main';
import { convertCurrency } from '@/v2/utils/factory.js';
import { mapGetters } from 'vuex';
export default {
	data() {
		return {
			filterCodeByValueName: filterCodeByValueName,
			activeIndex: this.$route.query.activeIndex,
			detailData: '', // 详情数据
			visible: false, // 提交时发票状态错误提示信息弹窗
			confirmSubmitObj: {},
			convertCurrency,
			platformRiskAudit: true, // 判断是否需要平台风控审核
			needPushOa: true,
			oaflag: false
		};
	},
	components: {
		QualityDocument,
		AccountsTable,
		ConfirmLetter,
		Invoice,
		OtherFiles,
		Breadcrumb,
		modalMain
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER',
		}),
		// 判断是否展示推送OA
		needPushOaShow() {
			// 不需平台风控审核，且对接OA的情况下展示
			// 陕煤系企业无论后端配置什么，都跳过平台风控审核
			return (!this.platformRiskAudit || this.VUEX_ST_COMPANYSUER.belongsShanMei) && this.oaflag;
		}
	},
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
			this.$router.push('/center/assets/payable/change/edit?id=' + this.$route.query.id + '&activeIndex=' + index);
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
		getSubmitData() {
			let obj = {};
			obj.id = this.$route.query.id;
			let newArr2 = [];
			let qualityData = this.$refs.quality.onSubmit();
			// 绑定发货批次
			obj.deliveryBatchList = qualityData.recvList;
			var newArr3 = newArr2.concat(qualityData.attachList);
			let accountsData = this.$refs.accounts.onSubmit();
			var newArr4 = newArr3.concat(accountsData.list);
			let otherData = this.$refs.other.onSubmit();
			var newArr5 = newArr4.concat(otherData.list);

			obj.list = newArr5;
			// if (
			// 	(this.detailData.recvInfo && this.detailData.recvInfo.attachList && this.detailData.recvInfo.attachList.length == 0) ||
			// 	this.$refs.quality.editFilesList.length == 0
			// ) {
			// 	this.$message.error('数质量凭证缺少附件，请补充相关材料');
			// 	return null;
			// }
			// if (
			// 	(this.detailData.accountInfo && this.detailData.accountInfo.list && this.detailData.accountInfo.list.length == 0) ||
			// 	this.$refs.accounts.editFilesList.length == 0
			// ) {
			// 	this.$message.error('核算表缺少附件，请补充相关材料');
			// 	return null;
			// }
			return obj;
		},
		onSubmit(type) {
			var obj = this.getSubmitData();
			if (obj == null) return;
			if (type == 'save') {
				obj.submitType = '1';
				this.doSubmit(obj);
			} else {
				obj.submitType = '2';
				this.confirmSubmit(obj);
			}
		},

		async confirmSubmit(obj) {
			this.confirmSubmitObj = obj;
			// 判断是否需要平台审核，
			let paymentType = this.detailData.receivalVO?.paymentType;
			// 判断是否需要平台审核，
			if (paymentType) {
				let res = await API_COMPANplatformRiskAudit({ payType: paymentType });
				if (res.success) {
					this.platformRiskAudit = res.result;
				}
			}
			// 如果不需要平台审核，判断是否对接OA,
			// 陕煤系企业无论后端配置什么，都跳过平台审核
			if (!this.platformRiskAudit || this.VUEX_ST_COMPANYSUER.belongsShanMei) {
				let res = await API_COMPANYOACHECKPOOL({
					bizType: 'ASSET_RECEIVABLE'
				});
				if (res.success) {
					this.oaflag = res.data;
				}
			}
			this.$refs.modalMain.open();
		},
		modalMainOK() {
			this.$refs.modalMain.close();
			let obj = { ...this.confirmSubmitObj };
			if (this.needPushOaShow) {
				obj.needPushOa = this.needPushOa;
			}
			this.doSubmit(obj);
		},
		openAssets(record) {
			const { href } = this.$router.resolve({
				path: '/center/assets/payable/manage/detail',
				query: {
					id: record.id,
					activeIndex: '0'
				}
			});

			window.open(href, '_new');
		},
		doSubmit(obj) {
			if (obj) {
				API_EditAccountsPayable(obj).then(res => {
					if (res.success) {
						this.$message.success('操作成功');
						// this.$router.back()
						this.$router.push('/center/assets/payable/change/list');
					}
				});
			}
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
	border-radius: 8px;
	padding: 20px 0;
	margin-top: 10px;
}
.btn-box .btn-wrap {
	margin: 0;
}

.main {
	.title {
		color: rgba(0, 0, 0, 0.4);
		font-family: PingFang SC;
		font-size: 14px;
		font-style: normal;
		font-weight: 400;
		line-height: normal;
	}
	.mainTable {
		border-radius: 4px;
		border: 1px solid #e5e6eb;
		margin-top: 10px;
		.item {
			padding: 0 13px;
			color: rgba(0, 0, 0, 0.8);
			font-size: 14px;
			font-style: normal;
			font-weight: 400;
			line-height: 32px;
			&:nth-child(2n) {
				background: #f3f5f6;
			}
			.label {
				text-align: right;
				width: 140px;
				color: rgba(0, 0, 0, 0.4);
				display: inline-block;
				margin-right: 5px;
				&.required {
					position: relative;
					&::after {
						content: '*';
						color: #f5222d;
						position: absolute;
						right: 95px;
					}
				}
			}
			.red {
				color: #d44;
			}
		}
	}
	.footer-title {
		color: rgba(0, 0, 0, 0.8);
		margin-top: 20px;
	}
}
</style>
