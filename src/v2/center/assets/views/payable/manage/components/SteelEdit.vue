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
					>编辑应付账款</span
				>
				<a
					href="javascript:;"
					@click="$router.back()"
					>返回</a
				>
			</div>
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
			<div class="bottom-box">
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
			</div>
			<div class="s-card-content">
				<a-row :gutter="40">
					<a-col span="4">
						<LeftTabs
							@tabChange="tabChange"
							ref="leftTabs"
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
								:lineId="detailData.receivalVO.lineId"
								:editFlag="false"
								:showEditorRadio="true"
								:contractInfo="detailData.contractInfo"
								ref="contract"
								:receivalVO="detailData.receivalVO"
								@changeStatus="changeStatus"
							></contract>
							<!-- 运输凭证 -->
							<transport-document
								v-show="activeIndex == 1"
								:editFlag="true"
								:deliverInfo="detailData.deliverInfo"
								:contractInfo="detailData.contractInfo"
								ref="transport"
								:receivalVO="detailData.receivalVO"
							></transport-document>
							<!-- 数质量凭证 -->
							<quality-document
								v-show="activeIndex == 2"
								:editFlag="true"
								:recvInfo="detailData.recvInfo"
								:contractInfo="detailData.contractInfo"
								ref="quality"
								:receivalVO="detailData.receivalVO"
							></quality-document>
							<!-- 货转凭证 -->
							<goods-transfer-document
								v-show="activeIndex == 3"
								:editFlag="true"
								:goodTransferInfo="detailData.goodTransferInfo"
								:contractInfo="detailData.contractInfo"
								ref="transfer"
								:deliverInfo="detailData.deliverInfo"
								:receivalVO="detailData.receivalVO"
							></goods-transfer-document>
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
								ref="invo"
								:lineId="detailData.receivalVO.lineId"
								:editFlag="true"
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
							<!-- 结算单 -->
							<settles-files
								v-show="activeIndex == 8"
								:editFlag="true"
								:settleInfo="detailData.settlementInfo"
								:receivalVO="detailData.receivalVO"
								ref="settles"
							></settles-files>
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
						@click="$router.push('/center/assets/payable/manage/list')"
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
		<a-modal
			class="modal"
			:header="null"
			:footer="null"
			:visible="visible"
			@cancel="
				() => {
					visible = false;
				}
			"
		>
			<div
				v-html="strMsg"
				style="text-align: center"
			></div>
			<a-button
				type="primary"
				@click="confirmModal"
				style="display: block; margin: 30px auto 0"
				>确定</a-button
			>
		</a-modal>
	</div>
</template>
<script>
import { filterCodeByValueName } from '@sub/utils/globalCode.js';
import { API_EditAccountsPayable } from '@/v2/center/assets/api/index.js';
import Contract from '@/v2/center/assets/components/contract.vue';
import TransportDocument from '@/v2/center/assets/components/TransportDocument.vue';
import QualityDocument from '@/v2/center/assets/components/QualityDocument.vue';
import GoodsTransferDocument from '@/v2/center/assets/components/GoodsTransferDocument.vue';
import AccountsTable from '@/v2/center/assets/components/AccountsTable.vue';
import ConfirmLetter from '@/v2/center/assets/components/ConfirmLetter.vue';
import Invoice from '@/v2/center/assets/components/Invoice.vue';
import OtherFiles from '@/v2/center/assets/components/OtherFiles.vue';
import SettlesFiles from '@/v2/center/assets/components/SettlesFiles.vue';
import { mapGetters } from 'vuex';
import LeftTabs, { checkMenuShow } from '@/v2/center/assets/components/common/LeftTabs2.vue';
import Breadcrumb from '@/v2/components/breadcrumb/index';

export default {
	data() {
		return {
			checkMenuShow,
			filterCodeByValueName: filterCodeByValueName,
			activeIndex: this.$route.query.activeIndex,
			strMsg: '', // 提交时发票状态错误提示信息内容
			visible: false, // 提交时发票状态错误提示信息弹窗
			validateMsgHideShowMIn: false
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
		TransportDocument,
		QualityDocument,
		GoodsTransferDocument,
		AccountsTable,
		ConfirmLetter,
		Invoice,
		SettlesFiles,
		OtherFiles,
		LeftTabs,
		Breadcrumb
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER',
			VUEX_ST_TOKEN: 'VUEX_ST_TOKEN'
		}),
		industryType() {
			let industryType = this.detailData?.receivalVO?.industryType;
			return industryType;
		}
	},
	mounted() {},
	methods: {
		changeStatus(e) {
			this.$refs.leftTabs.downContractStatus = e;
		},
		tabChange(index) {
			// 下游数据tabs切换
			this.activeIndex = index;
		},

		confirmSubmit(obj) {
			var isInAudit = filterCodeByValueName(this.VUEX_ST_COMPANYSUER.companyUscc, 'receivable_confirm_list');
			if (isInAudit) {
				this.$confirm({
					centered: true,
					title: '确定提交',
					okText: '确定',
					content: '系统将提交应付账款进行确权，已核验无误，确认提交?',
					cancelText: '取消',
					onOk: () => {
						this.doSubmit(obj);
					},
					onCancel() {}
				});
			} else {
				this.$confirm({
					centered: true,
					title: '确定提交',
					okText: '确定',
					content: '系统将提交应付账款到平台进行审核，已核验无误，确认提交?',
					cancelText: '取消',
					onOk: () => {
						this.doSubmit(obj);
					},
					onCancel() {}
				});
			}
		},
		getSubmitData(type) {
			let obj = {
				list: []
			};

			obj.id = this.$route.query.id;

			let contractData = this.$refs.contract.onSubmit();
			if (contractData && checkMenuShow('contract', this.detailData)) {
				if (contractData.errorStr) {
					this.$message.error(contractData.errorStr);
					return;
				}
				obj.list = [...obj.list, ...contractData.list];
				obj.terminalContract = Object.assign({}, contractData.downContract);
				obj.downTerminalContractModify = obj.terminalContract.downTerminalContractModify;
				obj.businessLineContract = contractData.businessLineContract;
			}

			let transportData = this.$refs.transport.onSubmit();

			if (transportData && checkMenuShow('transportDocument', this.detailData)) {
				if (transportData.errorStr) {
					this.$message.error(transportData.errorStr);
					return;
				}
				obj.list = [...obj.list, ...transportData.attachList];
			}

			let qualityData = this.$refs.quality.onSubmit();

			if (qualityData && checkMenuShow('qualityDocument', this.detailData)) {
				if (qualityData.errorStr) {
					this.$message.error(qualityData.errorStr);
					return;
				}

				obj.list = [...obj.list, ...qualityData.attachList];
			}

			let transferData = this.$refs.transfer.onSubmit();

			if (transferData && checkMenuShow('goodsTransferDocument', this.detailData)) {
				if (transferData.errorStr) {
					this.$message.error(transferData.errorStr);
					return;
				}

				obj.list = [...obj.list, ...transferData.list];
			}

			if (this.detailData.receivalVO.paymentType !== 'receivable-ICBC-steel') {
				let accountsData = this.$refs.accounts.onSubmit();

				if (accountsData && checkMenuShow('accountsTable', this.detailData)) {
					if (accountsData.errorStr) {
						this.$message.error(accountsData.errorStr);
						return;
					}

					obj.list = [...obj.list, ...accountsData.list];
				}
			}

			let otherData = this.$refs.other.onSubmit();

			if (otherData && checkMenuShow('otherFiles', this.detailData)) {
				if (otherData.errorStr) {
					this.$message.error(otherData.errorStr);
					return;
				}

				obj.list = [...obj.list, ...otherData.list];
			}

			let settlesData = this.$refs.settles.onSubmit();

			if (settlesData && checkMenuShow('settlesFiles', this.detailData)) {
				if (settlesData.errorStr) {
					this.$message.error(settlesData.errorStr);
					return;
				}

				obj.list = [...obj.list, ...settlesData.list];
			}

			let invoData = this.$refs.invo.onSubmit();

			if (invoData && checkMenuShow('invoice', this.detailData)) {
				if (invoData.errorStr) {
					this.$message.error(invoData.errorStr);
					return;
				}
				obj.list = [...obj.list, ...invoData.fileList];
				obj.businessLineInvoice = invoData.otherInvoList;
			}

			if (this.detailData?.invoiceInfo?.bankProductAssetConfigList) {
				let required = 0;
				let hasAttach = 0;
				this.detailData.invoiceInfo.bankProductAssetConfigList.map(i => {
					if (i.item == 'INVOICE_UP_INFO' && i.required) {
						required = 1;
					}
				});
				if (required) {
					this.detailData.invoiceInfo.list.map(item => {
						if (item.hasAttach) {
							hasAttach = 1;
						}
					});
					if (!hasAttach) {
						this.$message.error('发票未存在附件，请在发票版块上传对应发票附件');
						obj = null;
					}
				}
			}

			if (this.industryType === 'STEEL' && this.detailData.receivalVO.bankUscc === '91610139MA6U8HA76Y') {
				const hasBothExtensionsImg = obj.list.some(item => {
					return item.type === 'PAYMENT_ACCOUNTING_TABLE' && /\.(png|jpg|jpeg)$/.test(item.name) && item.delFlag == 0;
				});
				const hasBothExtensionsXls = obj.list.some(item => {
					return item.type === 'PAYMENT_ACCOUNTING_TABLE' && /\.(xls|xlsx)$/.test(item.name) && item.delFlag == 0;
				});
				if (!hasBothExtensionsImg) {
					this.$message.error('核算表截图必传');
					return;
				}
				if (!hasBothExtensionsXls) {
					this.$message.error('Excel版核算表必传');
					return;
				}
			}

			if (
				this.industryType === 'STEEL' &&
				this.detailData.receivalVO.paymentType === 'receivable-ICBC-steel' &&
				this.detailData.receivalVO.generateAssetType == 1 &&
				type == 'submit'
			) {
				const hasDEPOSIT_PAYMENT = obj.list.some(item => {
					return item.type === 'DEPOSIT_PAYMENT' && item.delFlag == 0;
				});
				const hasPROOF_CREDENTIALS = obj.list.some(item => {
					return item.type === 'PROOF_CREDENTIALS' && item.delFlag == 0;
				});
				const hasGOODS_TRANSFER = obj.list.some(item => {
					return item.type === 'GOODS_TRANSFER' && item.delFlag == 0;
				});
				const hasWAREHOUSE_RENTAL_CONTRACT = obj.list.some(item => {
					return item.type === 'WAREHOUSE_RENTAL_CONTRACT';
				});

				if (!hasWAREHOUSE_RENTAL_CONTRACT) {
					this.$message.error('仓储合同必传');
					return;
				}

				if (!hasDEPOSIT_PAYMENT) {
					this.$message.error('保证金支付凭证必传');
					return;
				}

				if (!hasGOODS_TRANSFER && !hasPROOF_CREDENTIALS) {
					this.$message.error('货转凭证必传');
					return;
				}
			}

			return obj;
		},
		onSubmit(type) {
			var obj = this.getSubmitData(type);
			if (obj == null) return;
			if (type == 'save') {
				obj.submitType = '1';
				this.doSubmit(obj);
			} else {
				obj.submitType = '2';
				this.confirmSubmit(obj);
			}
		},
		doSubmit(obj) {
			if (obj) {
				API_EditAccountsPayable(obj).then(res => {
					if (res.success) {
						//应付账款提交  判断当前资产下所有发票的发票状态，是否含有红冲、作废的发票；若包含有红冲、作废的发票，不允许提交审核；
						if (res.data) {
							this.strMsg = res.data;
							this.visible = true;
						} else {
							this.$message.success('操作成功');
							this.$router.push('/center/assets/payable/manage/list');
						}
					}
				});
			}
		},
		confirmModal() {
			// 发票弹窗展示 消失
			this.visible = false;
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
		background: @primary-color;
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
</style>
