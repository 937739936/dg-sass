<template>
	<div class="FinancingAuditSign slMain">
		<Breadcrumb></Breadcrumb>
		<a-card :bordered="false">
			<div
				slot="title"
				class="slTitle"
			>
				<span>盖章</span>
			</div>
			<spin-component
				:active="signLoading"
				text="相关资料申请盖章中，请稍后..."
			></spin-component>
			<a-tabs
				@change="changeContract"
				style="margin-top: 10px"
			>
				<a-tab-pane
					:key="index"
					v-for="(item, index) in signList"
					:tab="item.name"
				></a-tab-pane>
			</a-tabs>
			<div
				class="content"
				v-if="signList.length"
			>
				<pdf-preview
					:url="currentPdf"
					v-if="currentPdf"
				></pdf-preview>
			</div>
		</a-card>
		<div class="slDetailBottom">
			<div>
				<span
					class="bot-2"
					v-if="signList.length >= 2"
					>点击“盖章/作废”按钮，以上附件将全部盖章或作废</span
				>
				<a-checkbox v-model="ischeck">
					<span class="bot-1">我已经认真阅读并知悉上述融资相关协议文件的内容，自愿承担融资相关协议文件的义务和风险。</span>
				</a-checkbox>
			</div>
			<div style="margin-top: 20px">
				<a-space>
					<a-button
						type="primary"
						ghost
						@click="$router.back()"
						style="margin-right: 30px"
						>返回</a-button
					>
					<a-button
						type="primary"
						ghost
						@click="downAll"
						style="margin-right: 30px"
						>下载</a-button
					>
					<a-button
						type="primary"
						ghost
						@click="visible = true"
						style="margin-right: 30px"
						>作废</a-button
					>
					<a-button
						type="primary"
						class="btn"
						@click="signApply"
						:disabled="!ischeck"
						v-debounceclick
						>盖章</a-button
					>
				</a-space>
			</div>
		</div>
		<a-modal
			class="slModal cancel-modal"
			:visible="visible"
			:width="460"
			@cancel="visible = false"
			title="作废"
		>
			<a-textarea
				v-model="reason"
				placeholder="请输入作废原因,最多200字"
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

		<ChooseStamp
			ref="chooseStamp"
			@submit="submitSign"
		/>
		<SignModal ref="signModal"></SignModal>
	</div>
</template>

<script>
import PdfPreview from '@sub/components/pdf/index.vue';
import SignModal from 'components/signModal/index';
import ChooseStamp from '@/v2/components/signModal/chooseStamp';
import SpinComponent from '@/v2/components/common/SpinComponent.vue';
import { sign } from 'untils/sign.js';
import Breadcrumb from '@/v2/components/breadcrumb/index';
import comDownload from '@sub/utils/comDownload.js';
import {
	API_FinancingAdvanceAuditSignList,
	API_FinancingAdvanceMAINGetSigList,
	API_CfcaFinAdvanceAutoSignature,
	API_CfcaFinAdvanceMAutoSignature,
	API_FinancingAdvanceMAINSignSave,
	API_FinancingAdvanceMSignSave,
	API_FinancingAdvanceMGetSigList,
	API_FinancingDetaildownloadFileAll,
	API_FinancingAdvanceinvalid,
	API_FinancingAdvanceDouDetail
} from '@/v2/center/financing/api/index.js';

import { mapGetters } from 'vuex';

export default {
	data() {
		return {
			signList: [],
			currentPdf: '',
			signLoading: false,
			ischeck: false,
			reason: '',
			visible: false
		};
	},
	components: {
		PdfPreview,
		SignModal,
		Breadcrumb,
		SpinComponent,
		ChooseStamp
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		})
	},
	mounted() {
		this.financingApplyId = this.$route.query.id || '';
		this.auditOpinion = this.$route.query.auditOpinion || '';
		this.type = this.$route.query.type || '';
		this.getDetail();

		API_FinancingAdvanceAuditSignList({ financingApplyId: this.financingApplyId }).then(res => {
			this.signList = res.data || [];

			this.currentPdf = this.signList.length ? this.signList[0].url : '';
		});
	},
	methods: {
		changeContract(index) {
			const item = this.signList[index];
			this.currentPdf = item.url;
		},
		async getDetail() {
			const res = await API_FinancingAdvanceDouDetail({ financingApplyId: this.$route.query.id });
			this.detailData = res.data || {};
		},

		autoSignature() {
			this.signLoading = true;
			let func = this.type == 'main' ? API_CfcaFinAdvanceAutoSignature : API_CfcaFinAdvanceMAutoSignature;
			func({ financingApplyId: this.financingApplyId, auditOpinion: this.auditOpinion })
				.then(res => {
					if (res.success) {
						this.$message.success('签署完成').then(() => this.$router.push('/center/financing/financingAdvanceList'));
						this.signLoading = false;
					} else {
						this.$message.error('签署失败，请联系管理员');
					}
				})
				.finally(() => {
					this.signLoading = false;
				});
		},
		step1(obj) {
			let func = this.type == 'main' ? API_FinancingAdvanceMAINGetSigList : API_FinancingAdvanceMGetSigList;
			return func({
				financingApplyId: this.financingApplyId,
				cert: obj.cert
			});
		},
		step2() {
			let func = this.type == 'main' ? API_FinancingAdvanceMAINSignSave : API_FinancingAdvanceMSignSave;
			return func({
				financingApplyId: this.financingApplyId,
				auditOpinion: this.auditOpinion
			});
		},
		downAll() {
			API_FinancingDetaildownloadFileAll({
				financingApplyId: this.$route.query.id
			}).then(res => {
				const name = `${this.detailData.loanerName}-${this.detailData.bankName}-${this.detailData.serialNo}.zip`;
				comDownload(res, undefined, name);
			});
		},
		signApply() {
			let obj = {};
			this.$refs.chooseStamp.showModal(obj);
		},
		async confirmCancel() {
			if (!this.reason) {
				this.$message.error('请输入作废原因');
				return;
			}
			const params = {
				auditOpinion: this.reason,
				financingApplyId: this.financingApplyId
			};
			const res = await API_FinancingAdvanceinvalid(params);
			this.$message.success('作废成功');
			this.$router.push({ path: '/center/financing/financingAdvanceList' });
		},
		submitSign(cfcaSealList, certModel) {
			if (certModel == 'TRUST') {
				this.$refs.signModal.showModal(this.autoSignature);
			} else {
				sign.call(this, this.step1.bind(this), this.step2.bind(this), '/center/financing/financingAdvanceList', true);
			}
		}
	}
};
</script>

<style lang="less" scoped>
.FinancingAuditSign {
	background-color: #fff;

	.top-nav {
		width: 100%;
		display: flex;
		background-color: #fff;
		height: 40px;
		justify-content: center;
		border-bottom: 1px solid #eef0f2;
		font-size: 14px;
	}
	.content {
		background-color: #fff;
	}
	.nav-item {
		width: 200px;
		text-align: center;
		line-height: 40px;
		position: relative;
		cursor: pointer;
		&.active {
			color: #0053db;
		}
		&.active:after {
			content: '';
			width: 50%;
			height: 2px;
			position: absolute;
			background-color: #0053db;
			bottom: 0;
			left: 25%;
		}
	}
	.title-content {
		height: 55px;
		background-color: #fff;
		padding-top: 16px;
		padding-left: 20px;
		border-bottom: 1px solid rgb(238, 240, 242);
	}

	margin: -20px;
	padding-bottom: 20px;
	.rz-content {
		padding: 20px;
		background-color: #fff;
		margin-bottom: 10px;
	}
}

.slDetailBottom {
	width: calc(100% - 254px);
	min-width: 1186px;
	height: 102px;
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
</style>
