<template>
	<div class="slMain">
		<breadcrumb></breadcrumb>
		<a-card :bordered="false">
			<div
				slot="title"
				class="slTitle"
			>
				<span>{{ $route.meta.title }}</span>
			</div>
			<a-tabs @change="changeTab">
				<a-tab-pane
					key="1"
					tab="贸易合同"
				>
				</a-tab-pane>
				<a-tab-pane
					key="2"
					tab="承诺函"
					v-if="result.commitmentLetterPdfPath"
				>
				</a-tab-pane>
				<a-tab-pane
					key="3"
					tab="服务费协议"
					v-if="serviceFeeInfo.url"
				>
				</a-tab-pane>
			</a-tabs>
			<div
				v-if="result"
				class="content-box"
			>
				<spin-component
					:active="signLoading"
					text="合同签署中，请稍后..."
				></spin-component>
				<pdf-preview
					v-if="url"
					:url="url"
				></pdf-preview>
			</div>
			<div v-else>
				<p class="loading-pic"><a-spin></a-spin></p>
				<p class="loading-wrap">合同正在生成中，请稍后...</p>
			</div>
		</a-card>
		<div class="slDetailBottom">
			<div>
				<a-space :size="30">
					<a-button
						type="primary"
						ghost
						@click.native="$router.go(-1)"
						>返回</a-button
					>
					<a-button
						type="primary"
						ghost
						@click.native="downPdf()"
						>下载文件</a-button
					>
					<a-button
						type="primary"
						@click="reject"
						>驳回合同</a-button
					>
					<a-button
						type="primary"
						@click.native="openConfirmModal()"
						>确认合同</a-button
					>
				</a-space>
			</div>
		</div>
		<a-modal
			:maskClosable="false"
			title="合同确认"
			:visible="visibleConfirm"
			@ok="handleContractStopOk"
			@cancel="visibleConfirm = false"
			class="contract-stop"
			:closable="false"
			width="460px"
		>
			<p class="model-title">
				<span class="tip-wrap">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 20 20"
						fill="none"
					>
						<path
							d="M10 20C4.47715 20 0 15.5228 0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20ZM9 13V15H11V13H9ZM9 5V11H11V5H9Z"
							fill="var(--primary-color)"
						/>
					</svg>
					<span>合同确认</span>
				</span>
				<span
					class="close-icon"
					@click="visibleConfirm = false"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="22"
						height="22"
						viewBox="0 0 22 22"
						fill="none"
					>
						<path
							d="M16.5913 5.4087C17.1362 5.95364 17.1362 6.83716 16.5913 7.3821L12.9727 10.9993L16.5913 14.6179C17.1362 15.1628 17.1362 16.0464 16.5913 16.5913C16.0464 17.1362 15.1628 17.1362 14.6179 16.5913L10.9993 12.9727L7.3821 16.5913C6.83716 17.1362 5.95364 17.1362 5.4087 16.5913C4.86377 16.0464 4.86377 15.1628 5.4087 14.6179L9.02594 10.9993L5.4087 7.3821C4.86377 6.83716 4.86377 5.95364 5.4087 5.4087C5.95364 4.86377 6.83716 4.86377 7.3821 5.4087L10.9993 9.02594L14.6179 5.4087C15.1628 4.86377 16.0464 4.86377 16.5913 5.4087Z"
							fill="#C3C3C3"
						/>
					</svg>
				</span>
			</p>
			<p class="tip-wrap-desc">您确定要进行合同确认吗？</p>
		</a-modal>
		<a-modal
			:maskClosable="false"
			title=""
			:visible="visibleConfirmSubmit"
			@ok="handleContractStopSubmit"
			@cancel="visibleConfirmSubmit = false"
			class="contract-stop"
			:closable="false"
			width="460px"
			:footer="null"
		>
			<p class="model-title">
				<span class="tip-wrap">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 20 20"
						fill="none"
					>
						<path
							d="M10 20C4.47715 20 0 15.5228 0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20ZM9 13V15H11V13H9ZM9 5V11H11V5H9Z"
							fill="var(--primary-color)"
						/>
					</svg>
					<span>确认提交</span>
				</span>
				<span
					class="close-icon"
					@click="handleContractStopSubmit"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="22"
						height="22"
						viewBox="0 0 22 22"
						fill="none"
					>
						<path
							d="M16.5913 5.4087C17.1362 5.95364 17.1362 6.83716 16.5913 7.3821L12.9727 10.9993L16.5913 14.6179C17.1362 15.1628 17.1362 16.0464 16.5913 16.5913C16.0464 17.1362 15.1628 17.1362 14.6179 16.5913L10.9993 12.9727L7.3821 16.5913C6.83716 17.1362 5.95364 17.1362 5.4087 16.5913C4.86377 16.0464 4.86377 15.1628 5.4087 14.6179L9.02594 10.9993L5.4087 7.3821C4.86377 6.83716 4.86377 5.95364 5.4087 5.4087C5.95364 4.86377 6.83716 4.86377 7.3821 5.4087L10.9993 9.02594L14.6179 5.4087C15.1628 4.86377 16.0464 4.86377 16.5913 5.4087Z"
							fill="#C3C3C3"
						/>
					</svg>
				</span>
			</p>
			<p class="tip-wrap-desc">合同已确认，请联系签章员对合同终止进行盖章</p>
			<p
				class="tip-wrap-desc"
				v-if="roleData.signerUserVOList && roleData.signerUserVOList.length"
			>
				签章员：
				<span
					v-for="item in roleData.signerUserVOList"
					:key="item.personalId"
					>{{ item.personalName }}({{ item.mobile }})</span
				>
			</p>
			<p
				class="tip-wrap-desc"
				v-else
			>
				管理员：
				<span
					v-for="item in roleData.adminUserVOList"
					:key="item.personalId"
					>{{ item.personalName }}({{ item.mobile }})</span
				>
			</p>
		</a-modal>
		<a-modal
			title="确认提交"
			:maskClosable="false"
			:visible="visibleSigner"
			:confirm-loading="confirmLoading"
			@ok="goStamp"
			okText="立即盖章"
			cancelText="稍后盖章"
			@cancel="returnPage"
			class="visible-signer-modal"
		>
			<p class="model-title">
				<span class="tip-wrap">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 20 20"
						fill="none"
					>
						<path
							d="M10 20C4.47715 20 0 15.5228 0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20ZM9 13V15H11V13H9ZM9 5V11H11V5H9Z"
							fill="var(--primary-color)"
						/>
					</svg>
					<span>确认提交</span>
				</span>
				<span
					class="close-icon"
					@click="visibleSigner = false"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="22"
						height="22"
						viewBox="0 0 22 22"
						fill="none"
					>
						<path
							d="M16.5913 5.4087C17.1362 5.95364 17.1362 6.83716 16.5913 7.3821L12.9727 10.9993L16.5913 14.6179C17.1362 15.1628 17.1362 16.0464 16.5913 16.5913C16.0464 17.1362 15.1628 17.1362 14.6179 16.5913L10.9993 12.9727L7.3821 16.5913C6.83716 17.1362 5.95364 17.1362 5.4087 16.5913C4.86377 16.0464 4.86377 15.1628 5.4087 14.6179L9.02594 10.9993L5.4087 7.3821C4.86377 6.83716 4.86377 5.95364 5.4087 5.4087C5.95364 4.86377 6.83716 4.86377 7.3821 5.4087L10.9993 9.02594L14.6179 5.4087C15.1628 4.86377 16.0464 4.86377 16.5913 5.4087Z"
							fill="#C3C3C3"
						/>
					</svg>
				</span>
			</p>
			<p class="tips">合同已确认，需要盖章，是否现在进行盖章？</p>
		</a-modal>
		<RefuseModal
			ref="refuseModal"
			@confirm="rejectConfirm"
		></RefuseModal>
		<WorkFlowModal
			desc="你的企业已对接OA，请确认流程发起人，提交后将推送OA审核。"
			ref="workFlowModal"
			v-on:submit="submitOa"
			:orderId="$route.query.id"
			:auditChainAndOperator="auditChainAndOperator"
			:showTip="true"
			bizType="CONTRACT"
		/>
	</div>
</template>

<script>
import PdfPreview from '@sub/components/pdf/index.vue';
import RefuseModal from '@/v2/center/trade/views/contract/components/RefuseModal';
import {
	API_DOWNLPREVIEWTEBatchDownLoad,
	API_DOWNLPREVIEWTE,
	orderConfirmToSeal,
	API_COMPANYOACHECK,
	API_getConfirmInfo,
	API_orderConfirmReject,
	API_contract_receive_repeat_oa,
	API_receiveOrderAuditChainRel
} from '@/v2/center/trade/api/contract';
import { API_GET_COMPANY_ROLE_LIST } from '@/v2/api/common';
import { getServiceFeeInfo } from '@/v2/center/financeCenter/api';
import { mapGetters } from 'vuex';
import SpinComponent from '@/v2/components/common/SpinComponent.vue';
import comDownload from '@sub/utils/comDownload.js';
import moment from 'moment';
import ENV from '@/v2/config/env';
import breadcrumb from '@/v2/components/breadcrumb/index';
import WorkFlowModal from '@/v2/center/trade/components/WorkFlowModal.vue';
export default {
	data() {
		return {
			result: {},
			autoFocus: false,
			commitChecked: false,
			agreementChecked: false,
			bipartiteAgreementChecked: false,
			buyBipartiteAgreementChecked: false,
			sellBipartiteAgreementChecked: false,
			rejectReason: '',
			visible: false,
			disabled: false,
			signLoading: false,
			completedRoute: this.$route.query.type === 'BUY' ? '/center/contract/buy/list' : '/center/contract/sell/list',
			// 服务费协议
			serviceFeeInfo: {},
			cfcaSealList: [], // 印模集合
			url: '',
			BASE_NET: ENV.BASE_NET,
			isOa: false,
			roleData: {},
			visibleConfirmSubmit: false,
			visibleConfirm: false,
			action: API_contract_receive_repeat_oa,
			confirmLoading: false,
			visibleSigner: false
		};
	},
	components: {
		SpinComponent,
		PdfPreview,
		RefuseModal,
		breadcrumb,
		WorkFlowModal
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		isInitiator() {
			return this.VUEX_ST_COMPANYSUER.companyUscc == this.$route.query.initiatorUscc;
		},
		auditChainAndOperator() {
			if (this.isContractinitiator) {
				return this.contractInfo?.auditChainAndOperator || {};
			}
			return this.contractInfo?.receiveAuditChainAndOperator || {};
		}
	},
	created() {
		this.getConfirmDetail();
		this.getServiceFeeInfo();
		this.checkIsOa();
		this.getCurrentCompanyRolesInfo();
	},
	methods: {
		goStamp() {
			const type = this.$route.query.type.toLowerCase();
			this.$router.push({
				path: `/center/contract/${type}/confirm/stamp`,
				query: {
					...this.$route.query
				}
			});
		},
		returnPage() {
			this.$router.back();
		},
		submitOa(oaConfig) {
			this.confirmToStopContract(oaConfig);
		},
		confirmToStopContract(oaConfig) {
			API_receiveOrderAuditChainRel({
				orderId: this.$route.query.id,
				auditChainAndOperator: oaConfig,
				offlineApproval: this.$refs?.workFlowModal?.form?.getFieldValue('offlineApproval') || false
			}).then(res => {
				if (res.success) {
					const type = this.$route.query.type.toLowerCase();
					this.$message.success('提交成功');
					if (this.isOa) {
						this.$router.replace({
							path: `/center/contract/${type}/list`
						});
						return;
					}
				}
			});
		},
		handleContractStopSubmit() {
			const type = this.$route.query.type.toLowerCase();
			this.visibleConfirmSubmit = false;
			this.$router.replace({
				path: `/center/contract/${type}/list`
			});
		},
		getCurrentCompanyRolesInfo() {
			API_GET_COMPANY_ROLE_LIST().then(res => {
				if (res.success) {
					this.roleData = res.data;
				}
			});
		},
		handleContractStopOk() {
			if (this.isOa) {
				this.$refs.workFlowModal.showModal();
				this.visibleConfirm = false;
				return;
			}
			this.confirm();
		},
		checkIsOa() {
			API_COMPANYOACHECK({
				uscc: this.VUEX_ST_COMPANYSUER.companyUscc,
				_t: new Date().getTime()
			}).then(res => {
				if (res.success) {
					this.isOa = res.result;
				}
			});
		},
		/** 打开确认合同页面 待确认 */
		openConfirmModal() {
			this.visibleConfirm = true;
		},
		// 驳回合同
		rejectContract() {
			if (!this.rejectReason) {
				this.$message.error('驳回原因必填');
				return;
			}
			API_orderConfirmReject({
				orderId: this.$route.query.id,
				rejectReason: this.rejectReason
			}).then(res => {
				if (res.success) {
					this.$router.go(-1);
					this.$message.success('操作成功');
				} else {
					this.$message.error(res.message);
				}
			});
		},
		// 获取确认订单详情
		getConfirmDetail() {
			API_getConfirmInfo({
				orderId: this.$route.query.id
			}).then(res => {
				this.result = res.data;
				this.url = this.result.contractPdfPath;
			});
		},
		async getServiceFeeInfo() {
			const res = await getServiceFeeInfo({
				orderNo: this.$route.query.serialNo
			});
			this.serviceFeeInfo = res.data;
		},
		reject() {
			//   this.close()
			this.$refs.refuseModal.show({
				id: this.$route.query.id,
				type: this.$route.query.type
			});
		},
		rejectConfirm() {
			this.$router.go(-1);
		},
		changeTab(e) {
			if (e == 1) {
				this.url = this.result.contractPdfPath;
			} else if (e == 2) {
				this.url = this.result.commitmentLetterPdfPath;
			} else if (e == 3) {
				this.url = this.serviceFeeInfo.url;
			}
		},
		// 下载
		downPdf() {
			let url = this.BASE_NET + this.result.contractPdfPath;
			if (this.result.commitmentLetterPdfPath || this.serviceFeeInfo.url) {
				API_DOWNLPREVIEWTEBatchDownLoad({
					contractPdfPath: this.result.contractPdfPath,
					commitmentLetterPdfPath: this.result.commitmentLetterPdfPath,
					serviceFeeAgreementPdfPath: this.serviceFeeInfo.url
				}).then(res => {
					comDownload(
						res,
						'',
						`${this.VUEX_ST_COMPANYSUER.companyName}煤炭买卖合同 ${moment(new Date()).format('YYYY-MM-DD')}.zip`
					);
				});
			} else {
				API_DOWNLPREVIEWTE(url).then(res => {
					comDownload(res, url, `${this.VUEX_ST_COMPANYSUER.companyName}煤炭买卖合同.pdf`);
				});
			}
		},
		confirm() {
			const rolesList = this.VUEX_ST_COMPANYSUER.roles.map(item => item.code);
			orderConfirmToSeal(this.$route.query.id).then(res => {
				if (res.success) {
					this.$message.success('确认成功');
					// 如果没有对接oa
					if (rolesList.includes('ADMIN') || rolesList.includes('SIGNER')) {
						// 如果有签章员
						this.visibleSigner = true;
					} else {
						// 如果没有签章员
						this.visibleConfirmSubmit = true;
					}
				}
			});
		}
	}
};
</script>

<style lang="less" scoped>
.slMain {
	font-family:
		PingFangSC-Regular,
		PingFang SC;
	margin-bottom: -40px;
	.ant-card {
		padding: 30px 30px 0 30px;
		.content-box {
			position: relative;
			border: 1px solid #e5e6eb;
			border-bottom: none;
		}
	}
	.slDetailBottom {
		width: 100%;
		min-width: 1186px;
		height: 64px;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		border-top: 1px solid #e5e6eb;
		box-sizing: border-box;
		position: sticky;
		bottom: 0;
	}
}
.reject-modal,
.contract-stop,
.visible-signer-modal {
	/deep/ .ant-modal-header {
		display: none;
	}
	/deep/.ant-modal-close {
		display: none;
	}
	/deep/ .ant-modal-body {
		padding: 20px;
	}
	.model-title {
		width: 100%;
		height: 26px;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		span {
			font-family: PingFang SC;
			font-size: 20px;
			font-weight: 500;
			line-height: 28px;
		}
	}
	/deep/.ant-modal-footer {
		border-top: none;
		.ant-btn {
			width: 88px;
		}
	}
	.close-icon {
		width: 22px;
		height: 22px;
		display: inline-block;
		cursor: pointer;
	}
	.tip-wrap {
		span {
			height: 26px;
			display: inline-block;
			font-size: 18px;
			font-style: normal;
			font-weight: 500;
		}
		width: 140px;
		height: 26px;
		display: flex;
		justify-content: space-between;
		flex-direction: row;
		align-items: center;
	}
}
.reject-tips {
	color: rgba(0, 0, 0, 0.4);
	font-size: 14px;
	font-style: normal;
	font-weight: 400;
	line-height: normal;
	margin-top: 14px;
}
.reject-textarea {
	width: 450px;
	height: 150px;
	resize: none;
	margin-top: 14px;
	background: rgba(129, 145, 169, 0.1);
}
.contract-stop {
	.tip-wrap {
		width: 100px;
	}
	.tip-wrap-desc {
		font-size: 14px;
		font-style: normal;
		font-weight: 400;
		line-height: 22px;
		color: rgba(0, 0, 0, 0.5);
		margin-top: 19px;
	}
}
.visible-signer-modal {
	.tip-wrap {
		width: 106px;
	}
	.tips {
		width: 406px;
		font-size: 14px;
		font-style: normal;
		font-weight: 400;
		line-height: 24px;
		color: rgba(0, 0, 0, 0.5);
		margin-top: 18px;
	}
}
</style>
