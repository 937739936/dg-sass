<template>
	<div class="slMain">
		<Breadcrumb></Breadcrumb>
		<a-card :bordered="false">
			<div
				slot="title"
				class="slTitle"
			>
				<span>电子仓单服务协议确认</span>
			</div>
			<spin-component
				:active="signLoading"
				text="加载中，请稍后..."
			></spin-component>
			<a-tabs
				@change="changeContract"
				style="margin-top: 10px"
			>
				<a-tab-pane
					:key="index"
					v-for="(item, index) in signList"
					:tab="item.attachmentTypeText"
				></a-tab-pane>
			</a-tabs>
			<div
				class="content"
				v-if="signList.length"
			>
				<pdf-preview :url="currentPdf"></pdf-preview>
			</div>
		</a-card>
		<div class="slDetailBottom">
			<div>
				<a-space>
					<a-button
						type="primary"
						ghost
						@click="goBack"
						style="margin-right: 30px"
						>返回</a-button
					>
					<a-button
						type="primary"
						ghost
						@click="downAll"
						style="margin-right: 30px"
						>下载文件</a-button
					>
					<a-button
						type="primary"
						ghost
						@click="visible = true"
						style="margin-right: 30px"
						>驳回</a-button
					>
					<a-button
						type="primary"
						class="btn"
						@click="confirm"
						>确认</a-button
					>
				</a-space>
			</div>
		</div>
		<a-modal
			class="slModal cancel-modal"
			:visible="visible"
			:width="460"
			@cancel="visible = false"
			title="确认驳回？"
		>
			<div class="tip"><span class="red">*</span> 请输入驳回原因：</div>
			<a-textarea
				v-model="reason"
				style="border: 0"
				placeholder="请输入驳回原因,最多200字"
				:maxLength="200"
			/>

			<template slot="footer">
				<a-button
					key="back"
					@click="visible = false"
					class="cancel-btn"
					>取消</a-button
				>
				<a-button
					type="primary"
					@click="confirmCancel"
					style="margin-left: 20px"
					>确定</a-button
				>
			</template>
		</a-modal>
		<TipModal
			ref="submitModal"
			@ok="confirmSubmit"
			@cancel="closeModal"
			title="确认提交"
			cancelBtnText="取消"
			okBtnText="提交"
		>
			<div class="tip-box">
				<p>确定要进行协议确认吗？</p>
			</div>
		</TipModal>
		<TipModal
			ref="signModal"
			@ok="confirmSign"
			@cancel="goBack"
			title="提示"
			cancelBtnText="稍后盖章"
			okBtnText="现在去盖章"
		>
			<div class="tip-box">
				<p>补充协议已确认，需要盖章，是否现在进行盖章？</p>
			</div>
		</TipModal>
		<TipModal
			ref="signNeedModal"
			@ok="goBack"
			@cancel="goBack"
			title="确认提交"
		>
			<div class="tip-box">
				<p>协议已确认，请联系签章员或管理员进行盖章。</p>
				<p
					class="tip-wrap-desc"
					v-if="roleData.signerUserVOList && roleData.signerUserVOList.length"
				>
					签章员：
					<span
						style="margin-left: 5px"
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
						style="margin-left: 5px"
						v-for="item in roleData.adminUserVOList"
						:key="item.personalId"
						>{{ item.personalName }}({{ item.mobile }})</span
					>
				</p>
			</div>
		</TipModal>
		<SelectApprovalProcess
			ref="selectApprovalProcess"
			@updateFunc="getApproval"
		/>
	</div>
</template>

<script>
import ENV from '@/v2/config/env';
import PdfPreview from '@sub/components/pdf/index.vue';
import comDownload from '@sub/utils/comDownload';
import TipModal from '@sub/components/DelModal.vue';
import SpinComponent from '@/v2/components/common/SpinComponent.vue';
import { API_COMPANYOACHECKV2 } from '@/v2/center/trade/api/goodsTransfer';
import { API_GET_COMPANY_ROLE_LIST } from '@/v2/api/common';
import Breadcrumb from '@/v2/components/breadcrumb/index';
import SelectApprovalProcess from '../components/SelectApprovalProcess.vue';
import { mapGetters } from 'vuex';
import {
	handleWarehouseReceiptAgreementServe,
	getWarehouseReceiptAgreementServeDetail,
	downloadWarehouseReceiptServeManage,
	confirmAgreementServe
} from '@/v2/center/logisticsPlatform/api/warehouseReceipt';

export default {
	name: 'FinancingAuditSign',
	data() {
		return {
			signList: [],
			BASE_NET: ENV.BASE_NET,
			currentPdf: '',
			signLoading: false,
			ischeck: false,
			visible: false,
			reason: '',
			detailData: {},
			roleData: {},
			isOa: false,
			hasAudit: false
		};
	},
	components: {
		PdfPreview,
		Breadcrumb,
		TipModal,
		SpinComponent,
		SelectApprovalProcess
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		// 是否有盖章权限
		isSignAuth() {
			return (
				this.VUEX_ST_COMPANYSUER.companyUserRoles.includes('admin') ||
				this.VUEX_ST_COMPANYSUER.companyUserRoles.includes('signer')
			);
		}
	},
	mounted() {
		this.financingApplyId = this.$route.query.id || '';
		this.checkIsOa();
		this.getDetail();
		this.getCurrentCompanyRolesInfo();
	},
	methods: {
		async checkIsOa() {
			const res = await API_COMPANYOACHECKV2({ bizType: 'WAREHOUSE_SERVICE_AGREEMENT' });
			this.isOa = res.result;
		},
		goBack() {
			this.$router.push('/center/logisticsPlatform/warehouseReceipt/warehouseReceiptAgreement/list');
		},
		getCurrentCompanyRolesInfo() {
			API_GET_COMPANY_ROLE_LIST().then(res => {
				if (res.success) {
					this.roleData = res.data;
				}
			});
		},
		closeModal() {
			this.$refs.submitModal.close();
			this.$refs.signModal.close();
			this.$refs.signNeedModal.close();
		},
		changeContract(index) {
			const item = this.signList[index];
			this.currentPdf = item.url;
		},
		async getDetail() {
			const params = {
				id: this.$route.query.id
			};
			const res = await getWarehouseReceiptAgreementServeDetail(params);
			this.detailData = res.data || {};
			this.signList = res.data.attachments || [];
			this.currentPdf = this.signList.length ? this.signList[0].path : '';
		},
		signApply() {
			let obj = {};
			this.$refs.chooseStamp.showModal(obj);
		},
		async downAll() {
			const res = await downloadWarehouseReceiptServeManage({ id: this.$route.query.id });
			comDownload(res.data, null, res.name);
		},
		confirm() {
			if (this.isOa) {
				this.$refs.selectApprovalProcess.show({ id: '', initiatorUscc: '' });
			} else {
				this.$refs.submitModal.open();
			}
		},
		confirmSign() {
			this.$router.push({
				path: '/center/logisticsPlatform/warehouseReceipt/warehouseReceiptAgreement/signServeAgree',
				query: this.$route.query
			});
		},
		async confirmSubmit() {
			const params = {
				id: this.$route.query.id
			};
			const res = await confirmAgreementServe(params);
			this.$refs.submitModal.close();
			if (this.isSignAuth) {
				this.$refs.signModal.open();
			} else {
				this.$refs.signNeedModal.open();
			}
		},
		async confirmCancel() {
			if (!this.reason) {
				this.$message.error('请输入驳回原因');
				return;
			}
			const params = {
				remark: this.reason,
				id: this.$route.query.id,
				operatorType: 'REJECT'
			};
			const res = await handleWarehouseReceiptAgreementServe(params);
			this.$message.success('驳回成功');
			this.goBack();
		},
		confirmAgreementServe() {},
		// 获取审批流
		async getApproval(info, flag, isCheck) {
			this.auditChainAndOperator = info;
			this.hasAudit = !isCheck;
			const params = {
				hasAudit: !isCheck,
				auditChainAndOperator: info,
				id: this.$route.query.id
			};
			await confirmAgreementServe(params);
			this.$message.success('操作成功');
			this.$router.push('/center/logisticsPlatform/warehouseReceipt/warehouseReceiptAgreement/list');
			// this.offlineApprovalFlag = isCheck;

			// this.$refs.selectApprovalProcess.close();
			// this.isSame = flag;
			// this.receiverAuditChainAndOperator = info;

			// if (isCheck) {
			// 	// this.$refs.confirm.open()
			// 	this.saveConfirm();
			// } else {
			// 	if (flag) {
			// 		// this.$refs.confirm.open()
			// 		this.saveConfirm();
			// 	} else {
			// 		await this.submit();
			// 		this.$message.success('操作成功');
			// 		this.$router.go(-1);
			// 	}
			// }
		}
	}
};
</script>

<style lang="less" scoped>
.slMain {
	.content {
		background-color: #fff;
		/deep/ .warp {
			max-width: 100%;
		}
	}
	.slDetailBottom {
		width: calc(100% - 254px);
		min-width: 1186px;
		height: 64px;
		display: flex;
		flex-direction: row;
		justify-content: center;
		flex-direction: column;
		align-items: center;
		border-top: 1px solid #e5e6eb;
		box-sizing: border-box;
		position: fixed;
		bottom: 0;
		.bot-1 {
			font-size: 12px;
			color: rgba(0, 0, 0, 0.25);
		}
		.bot-2 {
			position: absolute;
			left: 20px;
			font-size: 12px;
			vertical-align: middle;
			margin-top: 2px;
			color: red;
		}
		/deep/ .ant-checkbox-inner {
			width: 14px;
			height: 14px;
			border-radius: 4px;
		}
	}
	.btn {
		border: 0;
	}
}
.cancel-modal {
	/deep/ .ant-modal-header {
		background: #fff;
	}
	/deep/ .ant-modal-body {
		padding-top: 0;
		padding-bottom: 10px;

		textarea {
			height: 180px;
			background: rgba(129, 145, 169, 0.1);
			font-size: 14px;
			color: #8191a9;
		}
	}
	/deep/ .ant-modal-footer {
		border-top: 0;
	}
	.cancel-btn {
		border-color: #c6cdd8;
	}
}
textarea::-webkit-input-placeholder {
	color: #8191a9;
	font-size: 14px;
}

textarea::-webkit-input-placeholder {
	color: #8191a9;
	font-size: 14px;
}
textarea::-moz-placeholder {
	color: #8191a9;
	font-size: 14px;
}
textarea:-ms-input-placeholder {
	color: #8191a9;
	font-size: 14px;
}
textarea::placeholder {
	color: #8191a9;
	font-size: 14px;
}
.tip {
	color: rgba(0, 0, 0, 0.4);
	font-size: 14px;
	margin-bottom: 20px;
}
.del-tip {
	color: rgba(0, 0, 0, 0.5);
	margin-top: 20px;
	margin-bottom: 10px;
}
.red {
	color: red;
}
.tip-box {
	font-size: 14px;
	color: rgba(0, 0, 0, 0.5);
	margin-top: 15px;
	line-height: 24px;
	span {
		color: rgba(0, 0, 0, 0.8);
	}
}
</style>
