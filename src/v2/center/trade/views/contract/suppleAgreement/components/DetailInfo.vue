<template>
	<div class="slMain">
		<breadcrumb v-if="source != 'oa'"></breadcrumb>
		<a-card
			:bordered="false"
			style="padding-bottom: 12px"
		>
			<div
				slot="title"
				class="slTitle"
			>
				<span>{{ ['detail', 'oa'].includes(source) ? '电子补充协议详情' : '电子补充协议确认' }}</span>
			</div>
			<a-row
				type="flex"
				class="flex-top-box"
			>
				<a-col flex="1">
					<div class="titleInfoBox">
						<div class="titleInfoTitle">
							<a-space :size="16">
								<em class="contractTypeSymbol">补</em>
								<div
									@mouseenter="copyContractNoVisible = true"
									@mouseleave="copyContractNoVisible = false"
								>
									<span style="cursor: pointer">补协编号：{{ suppleData.supplementalAgreementNo || '-' }}</span>
									<span
										v-show="!copyContractNoVisible"
										class="copy-contract-icon"
									>
										<Copy></Copy>
									</span>
									<span
										v-show="copyContractNoVisible"
										v-clipboard:success="onCopy"
										v-clipboard:error="onError"
										v-clipboard:copy="suppleData.supplementalAgreementNo"
										class="copy-contract-icon"
									>
										<CopyNow></CopyNow>
									</span>
								</div>
								<p :class="'contract-status ' + suppleData.status">
									<span class="text">{{ suppleData.statusDesc }}</span>
								</p>
							</a-space>
						</div>
					</div>
				</a-col>
			</a-row>
			<a-row class="supple-info">
				<div
					class="titleInfoItem"
					@mouseenter="copyContractNoVisible2 = true"
					@mouseleave="copyContractNoVisible2 = false"
				>
					<span class="label">所属合同号：</span>
					<a-tooltip>
						<template slot="title">{{ suppleData.contractNo }}</template>

						<a
							class="omit"
							v-if="source == 'oa'"
							:style="{ 'max-width': `${maxWidth}px` }"
							>{{ suppleData.contractNo }}</a
						>
						<a
							class="omit"
							v-else
							@click="goContactDetail"
							:style="{ 'max-width': `${maxWidth}px` }"
							>{{ suppleData.contractNo }}</a
						>
					</a-tooltip>
					<span
						v-show="!copyContractNoVisible2"
						class="copy-contract-icon"
					>
						<Copy></Copy>
					</span>
					<span
						v-show="copyContractNoVisible2"
						v-clipboard:success="onCopy"
						v-clipboard:error="onError"
						v-clipboard:copy="suppleData.contractNo"
						class="copy-contract-icon"
					>
						<CopyNow></CopyNow>
					</span>
				</div>
				<div class="titleInfoItem">
					<span class="label">卖方企业：</span>
					<TextOverFlow
						style="left: 85px !important"
						v-if="suppleData.sellerCompanyName"
						:content="suppleData.sellerCompanyName"
						:maxWidth="maxWidth"
					/>
					<span v-else>-</span>
				</div>
				<div class="titleInfoItem">
					<span class="label">买方企业：</span>
					<TextOverFlow
						style="left: 85px !important"
						v-if="suppleData.buyerCompanyName"
						:content="suppleData.buyerCompanyName"
						:maxWidth="maxWidth"
					/>
					<span v-else>-</span>
				</div>
				<div class="titleInfoItem">
					<span
						class="label"
						style="width: 120px"
						>补协签订日期：</span
					>
					<span v-if="suppleData.signDate">{{ suppleData.signDate }}</span>
					<span v-else>-</span>
				</div>
				<div class="titleInfoItem">
					<span class="label">创建时间：</span>
					<span>{{ suppleData.createDate }}</span>
				</div>
				<div
					v-if="operatorList"
					class="titleInfoItem"
					style="width: 70%"
				>
					<span class="label">流程发起人：</span>
					<span
						v-for="(item, i) in operatorList"
						:key="i"
					>
						<span>{{ item.systemName }}：{{ item.operatorName }}</span>
						<a-tooltip :getPopupContainer="getPopupContainer">
							<template slot="title">
								{{ item.operatorMobile }}
							</template>
							<span class="mobile-icon">
								<Phone></Phone>
							</span>
						</a-tooltip>
					</span>
				</div>
			</a-row>
		</a-card>

		<a-card
			:bordered="false"
			class="pt0 bot"
		>
			<!-- tabs -->
			<a-tabs
				v-if="['detail', 'oa'].includes(source)"
				v-model="tab"
			>
				<a-tab-pane
					key="contractInfo"
					tab="补协信息"
				>
					<SuppleInfo
						:detailInfo="suppleData"
						:contractInfo="contractInfo"
					></SuppleInfo>
				</a-tab-pane>
				<a-tab-pane
					key="contractOperation"
					:tab="`补协操作记录(${logList.length})`"
				>
					<LogList :logList="logList"></LogList>
				</a-tab-pane>
			</a-tabs>

			<div v-if="source == 'confirm'">
				<div
					class="slTitleAssis"
					style="margin: 30px 0"
				>
					补协信息
				</div>
				<SuppleInfo :detailInfo="suppleData"></SuppleInfo>
			</div>
			<div v-if="source == 'confirm' || tab == 'contractInfo'">
				<div
					class="slTitleAssis"
					style="margin: 30px 0"
				>
					附件
				</div>
				<AttachmentList
					:list="suppleData.attachVOList"
					:currentItem="suppleData"
					:source="source"
				></AttachmentList>
			</div>
		</a-card>
		<div
			class="slDetailBottom"
			v-if="source == 'confirm'"
		>
			<a-space :size="30">
				<a-button
					type="primary"
					ghost
					@click="reject"
					>驳回</a-button
				>
				<a-button
					type="primary"
					@click="confirm"
					>确认</a-button
				>
			</a-space>
		</div>
		<RejectModal ref="reject"></RejectModal>
		<SignFn
			ref="signFn"
			type="confirm"
			@successSign="successSign"
		></SignFn>
		<TipModal
			title="补充协议确认"
			tip="确定要进行补充协议确认吗？"
			@save="saveConfirm"
			ref="confirm"
		></TipModal>

		<TipModal
			title="提示"
			tip="补充协议已确认，需要盖章，是否现在进行盖章？"
			@save="goSign"
			@cancel="goBack"
			ref="signModal"
			cancelBtnText="稍后盖章"
			okBtnText="确认盖章"
		></TipModal>

		<ConfirmModal
			title="操作提示"
			ref="relationModal"
			@save="goBack"
			@cancel="goBack"
		>
			<div class="relation">
				<p>补充协议已确认，请联系签章员盖章</p>
				<p>签章员：{{ relationInfo.receiveSingerName }}({{ relationInfo.receiveSingerMobile }})</p>
			</div>
		</ConfirmModal>
		<SelectApprovalProcess
			ref="selectApprovalProcess"
			@updateFunc="getApproval"
			:type="type"
		></SelectApprovalProcess>
	</div>
</template>
<script>
import {
	getOnlineSuppleDetail,
	getOfflineSuppleDetail,
	getLogList,
	receiverConfirm,
	getStatusTip
} from '@/v2/center/trade/api/suppleAgreement';

import { filterCodeByValueName } from '@sub/utils/globalCode.js';
import { TableRowSpanFunc } from '@/v2/utils/factory.js';
import comDownload from '@sub/utils/comDownload.js';
import ENV from '@/v2/config/env';
import SuppleInfo from './SuppleInfo.vue';
import LogList from './LogList.vue';

import breadcrumb from '@/v2/components/breadcrumb/index';
import TextOverFlow from '@sub/components/TextOverflow.vue';
import AttachmentList from './AttachmentList.vue';
import RejectModal from './RejectModal.vue';
import SignFn from './SignFn.vue';
import ConfirmModal from './ConfirmModal.vue';

import { getPopupContainer } from '@/v2/utils/factory.js';

import { mapGetters } from 'vuex';
import { API_COMPANYOACHECK } from '@/v2/center/trade/api/contract';
import TipModal from './TipModal.vue';
import SelectApprovalProcess from './SelectApprovalProcess.vue';

import { API_getOrderContractDetailById } from '@/v2/center/trade/api/contract';
import { Copy, CopyNow, Phone } from '@sub/components/svg';

export default {
	props: ['source'],
	data() {
		return {
			getPopupContainer,
			copyContractNoVisible: false, // 复制合同编号icon
			copyContractNoVisible2: false,
			clientWidth: null, //浏览器尺寸
			maxWidth: 0, // 信息文案最大宽度
			maxWidth2: 0,
			actionNode: {}, // 操作节点
			// 详情信息
			suppleData: {},
			logList: [],
			// 流程发起人
			operatorInfo: null,
			// 当前企业 是否对接了 oa
			isOa: false,
			// 发起方是否对接了 OA
			isInitiatorOa: false,
			receiverAuditChainAndOperator: {},
			// 联系人
			relationInfo: {},
			isSame: false,
			// 合同详情
			contractInfo: {},
			tab: 'contractInfo',
			type: 'receiver',
			offlineApprovalFlag: false
		};
	},
	filters: {
		filterCodeByValueName
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		currentCompanyUscc() {
			return this.VUEX_ST_COMPANYSUER.company.uscc;
		},
		// 电子补协 和 线下补协
		isOn() {
			return this.$route.query.suppleType == 'on';
		},
		operatorList() {
			if (!this.operatorInfo) return null;
			return {
				operatorMobile: 12324
			};
			// return this.operatorInfo.operatorInfo;
		}
	},
	created() {},
	mounted() {
		this.id = this.$route.query.id;
		if (this.source != 'oa') {
			this.getDetail();
			this.checkIsOa();
		}

		this.clientWidth = document.body.clientWidth;
		window.onresize = () => {
			//屏幕尺寸变化就重新赋值
			return (() => {
				this.clientWidth = document.body.clientWidth;
			})();
		};
	},
	watch: {
		clientWidth: {
			handler: function () {
				this.getmaxWidth();
			},
			immediate: true
		}
	},
	methods: {
		/** 获取合同详情 */
		async getContractData(orderId) {
			const params = {
				orderId
			};
			const res = await API_getOrderContractDetailById(params);
			this.contractInfo = { ...res.data.contract, ...res.data.contractDelivery, contractPdfUrl: res.data.contractPdfUrl };
		},
		async getDetail() {
			const params = {
				id: this.$route.query.id
			};
			const res = await getOnlineSuppleDetail(params);
			this.suppleData = res.data;
			this.operatorInfo = this.suppleData.initiatorAuditChainAndOperator;
			if (this.$route.query.isInitiator == 'true') {
				this.type = 'initiator';
			} else {
				this.operatorInfo = this.suppleData.receiverAuditChainAndOperator;
				this.type = 'receiver';
			}

			this.isInitiatorCheckOA();
			this.getContractData(this.suppleData.orderId);

			this.getLog();
		},
		// 去往合同详情
		goContactDetail() {
			// center/contract/sell/online/detail?id=2325&type=SELL&initiatorUscc=91610138MA6X3K6K0G
			const type = this.suppleData.contractType.includes('销') ? 'sell' : 'buy';
			this.$router.push({
				path: `/center/contract/${type}/online/detail`,
				query: {
					id: this.suppleData.orderId,
					type: type.toLocaleUpperCase(),
					initiatorUscc: this.suppleData.initiatorUscc
				}
			});
		},
		//返回
		goBack() {
			this.$router.back();
		},
		async checkIsOa() {
			const res = await API_COMPANYOACHECK({ uscc: this.VUEX_ST_COMPANYSUER.companyUscc });
			this.isOa = res.result;
		},
		// 判断发起方 是否 关闭了 对接 OA
		async isInitiatorCheckOA() {
			const res = await API_COMPANYOACHECK({ uscc: this.suppleData.initiatorUscc });
			this.isInitiatorOa = res.result;
		},
		// 获取操作记录
		async getLog() {
			const params = {
				id: this.$route.query.id,
				supplementAgreementType: 'ONLINE'
			};

			const res = await getLogList(params);
			this.logList = res.data;
		},

		handlePreview(data) {
			let url = data.fileUrl || data.url;
			this.previewImg = url;
			if (this.previewImg.indexOf('.pdf') != -1) {
				window.open(this.previewImg, '_blank');
				return;
			}
			if (
				this.previewImg.indexOf('.doc') > -1 ||
				this.previewImg.indexOf('.docx') > -1 ||
				this.previewImg.indexOf('.xlsx') > -1 ||
				this.previewImg.indexOf('.xls') > -1
			) {
				const jumpUrl = 'https://view.officeapps.live.com/op/view.aspx?src=' + encodeURIComponent(API_GETCURRENTENV(url));
				window.open(jumpUrl, '_blank');
				return;
			}
			if (this.previewImg.indexOf('.rar') > -1 || this.previewImg.indexOf('.zip') > -1) {
				if (data.attachId) {
					API_GetDownloadRAR(data.attachId).then(res => {
						comDownload(res, undefined, data.name + '.zip');
					});
				} else {
					window.open(this.previewImg, '_blank');
				}
				return;
			}
			//判断视频
			if (
				this.previewImg.indexOf('.avi') > -1 ||
				this.previewImg.indexOf('.3gp') > -1 ||
				this.previewImg.indexOf('.mp4') > -1 ||
				this.previewImg.indexOf('.mkv') > -1
			) {
				this.videoVisible = true;
				return;
			}
			this.$refs.viewer.$viewer.show();
		},
		download(record) {
			if (record.type == 'BCXY') {
				// 补充协议附件
				if (record.supplementalFile.length) {
					record.supplementalFile.forEach(item => {
						if (item.attachId) {
							API_GetDownloadRAR(item.attachId).then(res => {
								comDownload(res, undefined, item.name);
							});
						}
					});
				}
			} else {
				if (record.attachId) {
					API_GetDownloadRAR(record.attachId).then(res => {
						comDownload(res, undefined, record.name);
					});
					return;
				}
				let url = record.fileUrl || record.url;
				if (url) {
					let BASE_NET = ENV.BASE_NET;
					API_DOWNLPREVIEWTE(BASE_NET + url).then(res => {
						comDownload(res, null, record.fileName || record.name);
					});
				}
			}
		},
		// 复制成功 or 失败（提示信息！！！）
		onCopy: function (e) {
			this.$message.success('复制成功');
		},
		onError: function (e) {
			this.$message.error('复制失败');
		},
		// 获取合同信息字段的最小宽度
		getmaxWidth() {
			if (this.clientWidth < 1366) {
				this.maxWidth = 120;
			} else if (this.clientWidth < 1560) {
				this.maxWidth = 150;
			} else if (this.clientWidth < 1920) {
				this.maxWidth = 200;
			} else if (this.clientWidth < 2160) {
				this.maxWidth = 240;
			} else if (this.clientWidth < 3000) {
				this.maxWidth = 280;
			} else {
				this.maxWidth = 320;
			}
		},
		async getRelation() {
			const res = await getStatusTip({ id: this.$route.query.id });
			this.relationInfo = res.data;
		},
		reject() {
			this.$refs.reject.open();
		},
		// 获取审批流
		async getApproval(info, flag, isCheck) {
			this.offlineApprovalFlag = isCheck;

			this.$refs.selectApprovalProcess.close();
			this.isSame = flag;
			this.receiverAuditChainAndOperator = info;

			if (isCheck) {
				// this.$refs.confirm.open()
				this.saveConfirm();
			} else {
				if (flag) {
					// this.$refs.confirm.open()
					this.saveConfirm();
				} else {
					await this.submit();
					this.$message.success('操作成功');
					this.$router.go(-1);
				}
			}
		},
		confirm() {
			// 对接OA
			if (this.isOa) {
				const info = {
					...this.suppleData,
					isInitiatorOa: this.isInitiatorOa
				};
				this.$refs.selectApprovalProcess.show(info, this.operatorInfo);
				// // 有可能发起方 关闭了对接OA
				// if(this.isInitiatorOa) {
				//    this.$refs.selectApprovalProcess.show(info, this.operatorInfo)
				// } else {

				//   this.$refs.selectApprovalProcess.show(info, null)
				// }
			} else {
				this.$refs.confirm.open();
			}
		},
		goSign() {
			this.$router.push({
				path: '/center/contract/agreement/stamp',
				query: {
					id: this.suppleData.id,
					contractType: 'buy',
					suppleType: 'on',
					isInitiator: this.suppleData.isInitiator
				}
			});
		},

		async saveConfirm() {
			this.$refs.confirm.close();
			// 去确认
			await this.submit();
			this.successSign();

			//  this.$refs.signFn.sign()
		},
		successSign() {
			const flag = this.VUEX_ST_COMPANYSUER?.roles?.some(el => ['ADMIN', 'SIGNER'].includes(el.code));
			if (flag) {
				this.$refs.signModal.open();
			} else {
				this.getRelation();
				this.$refs.relationModal.open();
			}
		},
		async submit() {
			const params = {
				id: this.$route.query.id,
				chainCode: '',
				offlineApprovalFlag: this.offlineApprovalFlag
			};
			if (this.receiverAuditChainAndOperator.chainCode) {
				params.receiverAuditChainAndOperator = this.receiverAuditChainAndOperator;
			}
			const res = await receiverConfirm(params);
			return res;
		}
	},
	components: {
		breadcrumb,
		TextOverFlow,
		SuppleInfo,
		LogList,
		AttachmentList,
		RejectModal,
		SignFn,
		TipModal,
		ConfirmModal,
		SelectApprovalProcess,
		Copy,
		CopyNow,
		Phone
	}
};
</script>
<style lang="less" scoped>
.slMain {
	font-family:
		PingFangSC-Regular,
		PingFang SC;
	.label,
	.fontlabel {
		color: rgba(0, 0, 0, 0.4);
	}
	.slTitle {
		margin-bottom: 20px;
	}
	.titleInfoBox {
		.titleInfoTitle {
			margin-bottom: 20px;
			font-size: 16px;
			font-family:
				PingFangSC-Medium,
				PingFang SC;
			font-weight: 500;
			line-height: 22px;
		}
	}
	.supple-info {
		display: flex;
		// justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		.titleInfoItem {
			width: 25%;
			display: inline-block;
			// padding-left: 112px;
			position: relative;
			height: 40px;
			float: left;
			.label {
				display: inline-block;
				width: 85px;
				text-align: right;
			}
			.omit {
				text-overflow: ellipsis;
				white-space: nowrap;
				overflow: hidden;
				display: inline-block;
				vertical-align: bottom;
			}
		}
	}
	.ant-card {
		padding: 20px 30px;
		margin-bottom: 20px;
	}
	.ant-card:last-child {
		margin-bottom: 0;
	}
	.contractTypeSymbol {
		display: inline-block;
		width: 18px;
		height: 18px;
		background: var(--vi, #45c041);
		color: #fff;
		text-align: center;
		line-height: 18px;
		border-radius: 4px;
		font-style: normal;
		font-size: 14px;
		position: relative;
		top: -1px;
		font-weight: 600;
	}
	.copy-icon {
		width: 14px;
		height: 14px;
		cursor: pointer;
	}
	.copy-icon-box {
		display: inline-block;
		margin-left: 30px;
		position: absolute;
		top: 1px;
	}
	.copy-contract-icon {
		margin-left: 16px;
		cursor: pointer;
		position: relative;
		top: 1px;
		display: inline-block;
		width: 14px;
		height: 14px;
	}
	.mobile-icon {
		margin: 0 14px 0 6px;
		cursor: pointer;
		svg {
			position: relative;
			top: 2px;
		}
	}
	.tabs-content {
		width: 100%;
		& > ::v-deep.ant-row-flex {
			width: 100%;
		}
	}
	::v-deep.ant-descriptions {
		font-weight: 400;
		line-height: 20px;
		padding-top: 10px;
		.ant-descriptions-item-label {
			background-color: rgba(243, 245, 246, 1);
			color: #77889d;
		}
		.ant-descriptions-item-content {
			color: rgba(0, 0, 0, 0.8);
		}
	}

	.slBtn {
		margin-left: 30px;
		padding: 0 !important;
	}

	.mt32 {
		margin-top: 32px;
	}

	.textOverflow {
		left: 70px !important;
	}
}
// 小于1366 以1300为准
@media screen and (min-width: 1920px) {
	.copy-icon-box {
		left: 250px !important;
	}
}
@media screen and (max-width: 1366px) {
	.flex-top-box {
		.ant-col:last-child {
			flex: 0 0 550px !important;
		}
	}
}
@media screen and (max-width: 1919px) {
	.copy-icon-box {
		left: 250px !important;
	}
}
@media screen and (max-width: 1559px) {
	.copy-icon-box {
		left: 220px !important;
	}
}
@media screen and (max-width: 1365px) {
	.copy-icon-box {
		left: 190px !important;
	}
}
</style>
<style lang="less" scoped>
.contract-status {
	border-radius: 4px;
	height: 20px;
	line-height: 20px;
	padding: 0 5px;
	background: #c9d9ff;
	color: #596fa0;
	font-family:
		PingFangSC-Regular,
		PingFang SC;
	text-align: center;
	.text {
		font-size: 14px;
		zoom: 0.85;
		position: relative;
		top: -1px;
	}
}
.AUDITING {
	background: #ffdac8 !important;
	color: #ff7937 !important;
}
.EXECUTING {
	background: #c1d7ff !important;
	color: #4682f3 !important;
}
.DRAFT {
	background: #ffdbdb !important;
	color: #dd4444 !important;
}
.CONFIRM_WAIT_SIGN_SEAL,
.COMPLETED {
	background: #c5ecdd !important;
	color: #3eb384 !important;
}
.WAIT_CONFIRM {
	background: #c9d9ff !important;
	color: #596fa0 !important;
}
.TERMINATED {
	background: #e0e0e0 !important;
	color: rgba(0, 0, 0, 0.25) !important;
}

.FREEZING {
	background: #f8dde8 !important;
	color: #db81a5 !important;
}
//“驳回”、“退回”、“作废”
.REJECT,
.APPROVAL_FAIL,
.CANCELLATION,
.INITIATOR_CANCEL,
.RECEIVER_REJECT {
	background: #f2d0d0 !important;
	color: #dd4444 !important;
}
.WAIT_SIGN_SEAL,
.AUDITING_RECEIVE {
	background: #d3dffb !important;
	color: #4682f3 !important;
}
.WAIT_COMPLETE {
	background: #c2e6ff !important;
	color: #649dc7 !important;
}

.slDetailBottom {
	width: calc(100vw - 254px);
	min-width: 916px;
	height: 64px;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	border-top: 1px solid #e5e6eb;
	box-sizing: border-box;
	position: fixed;
	bottom: 0;
	z-index: 9;
}
.bot {
	margin-bottom: 0px !important;
	padding-bottom: 64px !important;
	padding-top: 0px !important;
	background: #fff !important;
}
.relation {
	color: rgba(0, 0, 0, 0.4);
	line-height: 40px;
}
</style>
