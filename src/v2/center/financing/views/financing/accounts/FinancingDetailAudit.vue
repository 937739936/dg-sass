<template>
	<div class="slMain">
		<Breadcrumb></Breadcrumb>
		<a-card
			:bordered="false"
			style="padding-bottom: 20px"
		>
			<FinancingDetailTop
				:detailData="detailData"
				handleType="audit"
				:API_GetFinancingStatusTip="API_GetFinancingStatusTip"
			></FinancingDetailTop>
		</a-card>
		<div class="line"></div>
		<a-card
			:bordered="false"
			style="padding-top: 10px"
		>
			<FinancingBaseInfo
				:detailData="detailData"
				:operatorInfo="operatorInfo"
				@downAll="downAll"
				@downPDF="downPDF"
				@viewPDF="viewPDF"
			>
			</FinancingBaseInfo>
		</a-card>
		<a-modal
			class="slModal cancel-modal"
			:visible="visible"
			:width="460"
			@cancel="visible = false"
			title="驳回"
		>
			<a-textarea
				v-model="reason"
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
			ref="tipModal"
			@ok="saveConfirm"
			title="通过确认"
		>
			<div class="tip-box">
				<p>您确定要审核通过吗？</p>
				<p>
					拟融资金额：<span style="margin-right: 50px">￥{{ formatMoney(detailData.planFinancingAmount) }}元</span>
					融资利率：<span>{{ formatMoney(detailData.rate) }}%</span>
				</p>
			</div>
		</TipModal>
		<TipModal
			ref="signModal"
			@ok="confirmSign"
			@cancel="cancelSign"
			title="盖章"
			cancelBtnText="稍后盖章"
			okBtnText="立即盖章"
		>
			<div class="tip-box">
				<p>是否需要立即盖章？</p>
			</div>
		</TipModal>
		<div class="slDetailBottom">
			<div>
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
						@click="visible = true"
						style="margin-right: 30px"
						>驳回</a-button
					>
					<a-button
						type="primary"
						class="btn"
						v-debounceclick
						@click="openConfirm"
						>通过</a-button
					>
				</a-space>
			</div>
		</div>
	</div>
</template>

<script>
import Breadcrumb from '@/v2/components/breadcrumb/index';
import FinancingDetailTop from '@sub/financing/financingDetailTop';
import FinancingBaseInfo from '@sub/financing/financingBaseInfo';
import TipModal from '@sub/components/DelModal.vue';
import {
	API_FinancingDetail,
	API_FinancingDetaildownloadFileAll,
	API_FinancingDetaildownloadFile,
	API_GetFinancingStatusTip,
	API_FinancingMAINAudit,
	API_FinancingMAINOnlySignSave
} from '@/v2/center/financing/api/index.js';

import { formatMoney } from '@sub/filters';
import comDownload from '@sub/utils/comDownload.js';
import { mapGetters } from 'vuex';
export default {
	data() {
		return {
			detailData: {},
			operatorInfo: {},
			sendAndPayInfo: {},
			visible: false,
			reason: ''
		};
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		// 判断当前是否是金融机构
		isBank() {
			return this.VUEX_ST_COMPANYSUER.companyType == 'FINANCIAL_ORG';
		},
		// 是否有盖章权限
		isSignAuth() {
			return (
				this.VUEX_ST_COMPANYSUER.companyUserRoles.includes('admin') ||
				this.VUEX_ST_COMPANYSUER.companyUserRoles.includes('signer')
			);
		}
	},
	mounted() {
		this.financingApplyId = this.$route.query.id;
		this.getDetail();
	},
	methods: {
		formatMoney,
		API_GetFinancingStatusTip,
		async getDetail() {
			const res = await API_FinancingDetail({ financingApplyId: this.$route.query.id });
			this.detailData = res.data || {};
			// this.rongziDataSource = [res.data];
			// this.xieyiDataSource = res.data.contractList || [];
			/** 获取审批流程 */
			this.operatorInfo = {};
			if (this.detailData.auditChainAndOperator) {
				this.operatorInfo = this.detailData.auditChainAndOperator.operatorInfo[0];
			}
		},

		tabChange() {},
		downAll() {
			API_FinancingDetaildownloadFileAll({
				financingApplyId: this.$route.query.id
			}).then(res => {
				const name = `${this.detailData.loanerName}-${this.detailData.bankName}-${this.detailData.serialNo}.zip`;
				comDownload(res, undefined, name);
			});
		},
		downPDF(record) {
			API_FinancingDetaildownloadFile({
				contractFileId: record.id
			}).then(res => {
				const fileFormat = record.url.split('?')[0].split('.').pop().toLowerCase();
				const name = `${record.name}-${this.detailData.serialNo}.${fileFormat}`;
				comDownload(res, '', name);
			});
		},
		viewPDF(record) {
			window.open(record.url, '_blank');
		},
		async confirmCancel() {
			if (!this.reason) {
				this.$message.error('请输入驳回原因');
				return;
			}
			const params = {
				financingApplyId: this.financingApplyId,
				auditOpinion: this.reason
			};
			const res = await API_FinancingMAINAudit(params);
			this.$message.success('操作成功');
			this.$router.back();
		},
		openConfirm() {
			this.$refs.tipModal.open();
		},
		async saveConfirm() {
			const params = {
				id: this.financingApplyId,
				financingApplyId: this.financingApplyId
			};
			const res = await API_FinancingMAINOnlySignSave(params);
			this.$refs.tipModal.close();
			// 判断是否是金融机构
			if (!this.isBank) {
				if (this.isSignAuth) {
					// 获取最新的融资状态
					await this.getDetail();
					if (this.detailData.status === 'CORE_COMPANY_TO_BE_SIGNED') {
						this.$refs.signModal.open();
					} else {
						this.$router.go(-1);
					}
				} else {
					this.$router.go(-1);
				}
			} else {
				if (this.isSignAuth) {
					this.$refs.signModal.open();
				} else {
					this.$router.go(-1);
				}
			}

			/** 判断是否签章 */

			// 有签章权限
		},
		confirmSign() {
			this.$router.push({
				path: '/center/financing/financingAuditSign',
				query: {
					id: this.$route.query.id,
					type: this.isBank ? 'jr' : 'main'
				}
			});
		},
		cancelSign() {
			this.$router.go(-1);
		}
	},
	components: {
		Breadcrumb,
		FinancingDetailTop,
		FinancingBaseInfo,
		TipModal
	}
};
</script>

<style scoped lang="less">
.line {
	background: #f3f5f6;
	height: 20px;
}
.slDetailBottom {
	width: 100%;
	min-width: 1186px;
	height: 64px;
	display: flex;
	flex-direction: row;
	justify-content: center;
	flex-direction: column;
	align-items: center;
	border-top: 1px solid #e5e6eb;
	box-sizing: border-box;
	position: sticky;
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
