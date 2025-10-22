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
					>贷后补录</span
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
					<!-- <a-row class="row" :gutter="40" style="margin-left:20px;margin-bottom:20px;">
                        <span style="font-size:20px;">当前状态：{{filterCodeByValueName(detailData.receivalVO.status,'receivableStatusDict')}}</span>
                    </a-row>
                    <a-row class="row" :gutter="40" style="margin-left:20px;margin-bottom:20px;" v-if="detailData.receivalVO.message">
                        <span >作废原因：{{detailData.receivalVO.message}}</span>
                    </a-row> -->
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
			>
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
							<div @click="tabChange(1)" :class="activeIndex == 1 ? 'blue' : ''">
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
							<div @click="tabChange(2)" :class="activeIndex == 2 ? 'blue' : ''">
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
							<div @click="tabChange(3)" :class="activeIndex == 3 ? 'blue' : ''">
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
							<div @click="tabChange(8)" :class="activeIndex == 8 ? 'blue' : ''">
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
						<!-- 合同 -->
						<contract
							v-show="activeIndex == 0"
							:editFlag="false"
							:showEditorRadio="true"
							:contractInfo="detailData.manualTerminalContract"
							:editFile="true"
							ref="contract"
						></contract>
						<!-- 运输凭证 -->
						<transport-document
							v-show="activeIndex == 1"
							:editFlag="false"
							:deliverInfo="detailData.manualDeliver"
							:editFile="true"
							:contractInfo="detailData.contractInfo"
							ref="transport"
						></transport-document>
						<!-- 数质量凭证 -->
						<quality-document
							v-show="activeIndex == 2"
							:editFlag="false"
							:recvInfo="detailData.manualReceive"
							:editFile="true"
							:contractInfo="detailData.contractInfo"
							ref="quality"
							:receivalVO="detailData.receivalVO"
						></quality-document>
						<!-- 货转凭证 -->
						<goods-transfer-document
							v-show="activeIndex == 3"
							:editFlag="false"
							:goodTransferInfo="detailData.manualTransfer"
							:editFile="true"
							:contractInfo="detailData.contractInfo"
							ref="transfer"
							:deliverInfo="detailData.deliverInfo"
						></goods-transfer-document>
						<!-- 核算表 -->
						<accounts-table
							v-show="activeIndex == 4"
							:editFlag="false"
							:accountInfo="detailData.manualAccount"
							:editFile="true"
							ref="accounts"
						></accounts-table>
						<!-- 确认函 -->
						<!-- <confirm-letter v-show="activeIndex == 5" :confirmLetterInfo="detailData.confirmLetterInfo" ref="confirm"></confirm-letter> -->
						<!-- 发票 -->
						<invoice
							v-if="activeIndex == 6"
							:contractInfo="detailData.manualTerminalContract"
							:invoiceInfo="detailData.manualInvoice"
							:editFlag="detailData.receivalVO.type == 'PROOF'"
							:isDai="true"
						></invoice>
						<!-- 其他材料 -->
						<other-files
							v-show="activeIndex == 7"
							:editFlag="false"
							:otherInfo="detailData.manualOther"
							:editFile="true"
							:receivalVO="detailData.receivalVO"
							ref="other"
						></other-files>
						<!-- 结算单 -->
						<settles-files
							v-show="activeIndex == 8"
							:editFlag="true"
							:settlesInfo="detailData.manualStatement"
							:editFile="false"
							:receivalVO="detailData.receivalVO"
							ref="settle"
						></settles-files>
					</a-col>
				</a-row>
			</div>
			<div class="btn-box">
				<div class="btn-wrap">
					<a-button
						@click="$router.push('/center/assets/receivable/list')"
						type="primary"
						ghost
						>取消</a-button
					>
					<a-button
						type="primary"
						@click="getSubmitData('save')"
						>保存</a-button
					>
				</div>
			</div>
		</a-card>
	</div>
</template>
<script>
import { filterCodeByValueName } from '@sub/utils/globalCode.js';
import { API_GetAccountsManualDetail, API_EditAccountsManualPayable } from '@/v2/center/assets/api/index.js';
import Contract from '@/v2/center/assets/components/manual/contract.vue';
import TransportDocument from '@/v2/center/assets/components/manual/TransportDocument.vue';
import QualityDocument from '@/v2/center/assets/components/manual/QualityDocument.vue';
import GoodsTransferDocument from '@/v2/center/assets/components/manual/GoodsTransferDocument.vue';
import AccountsTable from '@/v2/center/assets/components/manual/AccountsTable.vue';
// import ConfirmLetter from "@/v2/center/assets/components/manual/ConfirmLetter.vue"
import Invoice from '@/v2/center/assets/components/manual/Invoice.vue';
import OtherFiles from '@/v2/center/assets/components/manual/OtherFiles.vue';
import SettlesFiles from '@/v2/center/assets/components/manual/SettlesFiles.vue';
import Breadcrumb from '@/v2/components/breadcrumb/index';

export default {
	data() {
		return {
			filterCodeByValueName: filterCodeByValueName,
			activeIndex: this.$route.query.activeIndex,
			detailData: '' // 详情数据
		};
	},
	components: {
		Contract,
		TransportDocument,
		QualityDocument,
		GoodsTransferDocument,
		AccountsTable,
		// ConfirmLetter,
		Invoice,
		OtherFiles,
		SettlesFiles,
		Breadcrumb
	},
	mounted: function () {
		this.tabChange(this.$route.query.activeIndex);
		API_GetAccountsManualDetail({ id: this.$route.query.id }).then(res => {
			if (res.success) {
				this.detailData = res.data;
			}
		});
	},
	methods: {
		tabChange(index) {
			// 下游数据tabs切换
			this.activeIndex = index;
		},
		getSubmitData() {
			let manualAssetReceivable = this.detailData.receivalVO;

			let { manualTerminalContract, manualTransfer, manualReceive, manualDeliver, manualAccount, manualStatement, manualOther } =
				this.detailData;

			manualTerminalContract.list = this.$refs.contract.onSubmitList();

			manualDeliver.list = this.$refs.transport.onSubmitList();
			manualAccount.list = this.$refs.accounts.onSubmitList();
			manualStatement.list = this.$refs.settle.onSubmitList();
			manualOther.list = this.$refs.other.onSubmitList();
			manualReceive.list = this.$refs.quality.onSubmitList();

			let obj = {
				manualAssetReceivable,
				manualTerminalContract,
				manualDeliver,
				manualTransfer,
				manualReceive,
				manualStatement,
				manualOther,
				manualAccount
			};
			obj.downTerminalContractModify = obj.manualTerminalContract.downTerminalContractModify;
			obj.submitType = '3';
			this.doSubmit(obj);
		},
		doSubmit(obj) {
			if (obj) {
				API_EditAccountsManualPayable(obj).then(res => {
					if (res.success) {
						this.$message.success('操作成功');
						this.$router.push('/center/assets/receivable');
					}
				});
			}
		},
		judgeColor() {}
		// judgeColor(index) {
		// 	// 项下各必备附件存在数据时，标记绿色
		// 	// 项下附件存在数据时，标记桔色
		// 	// 项下附件无数据时，标记红色
		// 	//0-合同 1-运输凭证 2-数质量凭证 3-货转凭证 4-核算表 5-确认函 6-发票 7-其他材料
		// 	if (!this.detailData) return
		// 	if (index == 0) { // 合同
		// 		if ((this.detailData.contractInfo.downContract && this.detailData.contractInfo.downContract.list.length>0) || (this.detailData.contractInfo.tradeContract && this.detailData.contractInfo.tradeContract.list.length>0) || (this.detailData.contractInfo.upContract && this.detailData.contractInfo.upContract.list.length>0)) {
		// 			if ((this.detailData.contractInfo.downContract && this.detailData.contractInfo.downContract.list.length>0) && (this.detailData.contractInfo.upContract && this.detailData.contractInfo.upContract.list.length>0)) {
		// 				return 'green'
		// 			} else {
		// 				return 'orange'
		// 			}
		// 		} else {
		// 			return 'red'
		// 		}
		// 	} else if (index == 1) { // 运输凭证
		// 		if (this.detailData.deliverInfo.attachList && this.detailData.deliverInfo.attachList.length>0) {
		// 			return 'green'
		// 		} else {
		// 			return 'red'
		// 		}
		// 	} else if (index == 2) { // 数质量凭证
		// 		if (this.detailData.recvInfo.attachList && this.detailData.recvInfo.attachList.length>0) {
		// 			return 'green'
		// 		} else {
		// 			return 'red'
		// 		}
		// 	} else if (index == 3) { // 货转凭证
		// 		if (this.detailData.goodTransferInfo.list && this.detailData.goodTransferInfo.list.length>0) {
		// 			return 'orange'
		// 		} else {
		// 			return 'red'
		// 		}
		// 	} else if (index == 4) { // 核算表凭证
		// 		if (this.detailData.accountInfo.list && this.detailData.accountInfo.list.length>0) {
		// 			return 'green'
		// 		} else {
		// 			return 'red'
		// 		}
		// 	} else if (index == 5) { // 确认函
		// 		if (this.detailData.confirmLetterInfo.list && this.detailData.confirmLetterInfo.list.length>0) {
		// 			return 'orange'
		// 		} else {
		// 			return 'red'
		// 		}
		// 	} else if (index == 6) { // 发票
		// 		if (this.detailData.invoiceInfo.list && this.detailData.invoiceInfo.list.length>0) {
		// 			return 'orange'
		// 		} else {
		// 			return 'red'
		// 		}
		// 	} else if (index == 7) { // 其他材料
		// 		if (this.detailData.otherInfo.list && this.detailData.otherInfo.list.length>0) {
		// 			return 'orange'
		// 		} else {
		// 			return 'red'
		// 		}
		// 	}
		// }
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
</style>
