<template>
	<div class="slMain">
		<breadcrumb />
		<a-card
			:bordered="false"
			class="content"
		>
			<div class="slTitle">
				<span>{{ meta.title }}</span>
			</div>
			<a-tabs>
				<a-tab-pane
					key="1"
					tab="作废协议"
					v-if="result43"
				>
					<pdf-preview
						:url="result43"
						id="43"
					></pdf-preview>
				</a-tab-pane>
				<a-tab-pane
					key="2"
					tab="原结算单"
					v-if="result8"
				>
					<pdf-preview
						:url="result8"
						id="8"
					></pdf-preview>
				</a-tab-pane>
			</a-tabs>
		</a-card>
		<div class="submit-btn">
			<a-button
				type="primary"
				ghost
				@click="back"
			>
				返回
			</a-button>
			<a-button
				type="primary"
				ghost
				@click="download"
			>
				下载
			</a-button>
			<a-button
				type="primary"
				ghost
				@click="receiverReject"
			>
				驳回
			</a-button>
			<a-button
				type="primary"
				@click="receiverConfirm"
			>
				确认
			</a-button>
		</div>
		<modalBack
			ref="modalBack"
			title="确认驳回?"
			width="440px"
			@verify="modalBackOK"
			:loading="modalLoading"
		>
			<div class="modalBack">
				<div class="tip">
					驳回后，作废流程将取消，原结算单仍生效，如需继续作废原结算单，则需要重新走流程，如确需驳回，请继续操作
				</div>
				<a-form :form="form">
					<a-form-item>
						<a-textarea
							:maxLength="200"
							class="textarea"
							placeholder="请输入驳回原因，最多200字"
							v-decorator="[
								'reason',
								{
									rules: [
										{
											required: true,
											message: '驳回原因必填',
											whitespace: true
										}
									]
								}
							]"
						/>
					</a-form-item>
				</a-form>
			</div>
		</modalBack>
		<modalInfo
			ref="modalInfo"
			@verify="modalInfoOK"
			:loading="modalLoading"
			title="结算单作废确认"
			tip="确定要要对结算单进行作废吗？"
		/>
		<WorkFlowModal
			ref="workFlowModal"
			v-if="OAAuditOption.existOA"
			v-on:submit="modalMainOK"
			desc="你的企业已对接OA，请确认流程发起人，提交后将推送OA审批"
			showTip
			:repeatOA="targetOA"
			:auditChainAndOperator="OAAuditOption.auditChainAndOperator"
		/>
		<modalInfo
			ref="modalInfoSeal"
			title="是否进行盖章"
			tip="结算单作废协议已确认，需要盖章，是否现在进行盖章？"
			cancelText="稍后盖章"
			okText="现在去盖章"
			@close="back"
			:loading="modalLoading"
			@verify="modalInfoSeal"
		/>
		<modalInfo
			ref="modalInfoOk"
			:width="283"
			title="提示"
			:tip="tip"
			@close="back"
			:footer="false"
		/>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
import WorkFlowModal from '@/v2/center/trade/components/WorkFlowModal.vue';
import breadcrumb from '@/v2/components/breadcrumb/index';
import PdfPreview from '@sub/components/pdf/index.vue';
import modalInfo from '@/v2/components/modalInfo/info';
import modalBack from '@/v2/components/modalInfo/back';
import {
	API_GETSETTLEINVALIDDETAIL,
	API_GETINVALIDreceiverConfirm,
	API_GETSETDownload,
	API_GETINVALIDreceiverReject
} from '@/v2/center/trade/api/settle';
import comDownload from '@sub/utils/comDownload.js';

export default {
	components: {
		breadcrumb,
		PdfPreview,
		modalInfo,
		modalBack,
		WorkFlowModal
	},
	data() {
		let { meta, query } = this.$route;
		return {
			meta, //获取title
			id: query?.id,
			data: {}, //返回的数据信息
			form: this.$form.createForm(this),
			tip: '', //不是签章员时提示
			modalLoading: false
		};
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		type() {
			//判断采购还是销售
			let { meta } = this;
			return meta?.type || '';
		},
		//附件信息
		attachment() {
			return this.data.attachment || [];
		},
		//提取附件
		result8() {
			let result = '';
			result = this.attachment.find(item => item.type == 'JSD')?.filePath || '';
			return result;
		},
		//作废确认书
		result43() {
			let result = '';
			result = this.attachment.find(item => item.type == 'JSD_INVALID')?.filePath || '';
			return result;
		},
		//对接OA信息
		OAAuditOption() {
			//校验是否对接OA
			let OAAuditOption = {};
			if (this.type == 'buy') {
				OAAuditOption = this.data?.buyerOAAuditOption || {};
			} else if (this.type == 'sell') {
				OAAuditOption = this.data?.sellerOAAuditOption || {};
			}
			return OAAuditOption;
		},
		//判断对方是否对接OA
		targetOAAuditOption() {
			//校验是否对接OA
			let targetOAAuditOption = {};
			if (this.type == 'sell') {
				targetOAAuditOption = this.data?.buyerOAAuditOption || {};
			} else if (this.type == 'buy') {
				targetOAAuditOption = this.data?.sellerOAAuditOption || {};
			}
			return targetOAAuditOption;
		},
		//对手方是否对接OA
		showTip() {
			if (this.targetOAAuditOption?.existOA) {
				return true;
			} else {
				return false;
			}
		},
		//对手方OA流程审批列表
		targetOA() {
			if (this.showTip) {
				return this.targetOAAuditOption.auditChainAndOperator?.operatorInfo || [];
			} else {
				return [];
			}
		}
	},
	created() {
		this.getDetail();
	},
	methods: {
		//获取详情
		async getDetail() {
			if (this.id) {
				let res = await API_GETSETTLEINVALIDDETAIL({ statementId: this.id });
				if (res.success) {
					let data = res.data;
					this.data = data;
				}
			}
		},
		//返回
		back() {
			this.$router.back();
		},
		//返回
		receiverReject() {
			this.$refs.modalBack.open();
		},
		//驳回确认
		modalBackOK() {
			this.form.validateFieldsAndScroll((err, values) => {
				if (!err) {
					this.modalLoading = true;
					API_GETINVALIDreceiverReject({
						statementId: this.id,
						...values
					})
						.then(res => {
							if (res.success) {
								this.$message.success('操作成功');
								this.back();
							}
						})
						.finally(() => {
							this.modalLoading = false;
							this.$refs.modalBack.close();
						});
				}
			});
		},
		//下载
		download() {
			let statementId = this.id;
			API_GETSETDownload({ statementId }).then(res => {
				comDownload(res.data, undefined, res.name);
			});
		},
		//确认
		receiverConfirm() {
			this.$refs.modalInfo.open();
		},
		//结算单确认
		modalInfoOK() {
			//校验是否对接OA
			if (this.OAAuditOption?.existOA) {
				this.$refs.workFlowModal.showModal();
				this.$refs.modalInfo.close();
			} else {
				this.postConfirm();
			}
		},
		//OA提交确认
		modalMainOK(data) {
			let params = {};
			if (data) {
				params.auditChain = data;
				params.skipOAAudit = false;
			} else {
				//跳过OA审批
				params.skipOAAudit = true;
			}
			this.postConfirm(params);
		},
		//确认提交
		async postConfirm(params) {
			this.modalLoading = true;
			let res = await API_GETINVALIDreceiverConfirm({
				statementId: this.id,
				...params
			});
			this.modalLoading = false;
			this.$refs.modalInfo.close();
			//判断是否对接OA
			if (this.OAAuditOption?.existOA) {
				this.$message.success('结算单已提交审核');
				this.back();
			} else {
				let data = res.data;
				//判断是否签章提示
				if (data?.msg) {
					this.tip = data.msg;
					this.$refs.modalInfoOk.open();
				} else {
					this.$refs.modalInfoSeal.open();
				}
			}
		},
		//跳转到盖章
		modalInfoSeal() {
			//replace防止返回时返回详情页
			this.$router.replace({
				path: `/center/settle/${this.type}/onlinecancelseal`,
				query: {
					id: this.id
				}
			});
		}
	}
};
</script>

<style lang="less" scoped>
.slMain {
	.content {
		padding: 20px 20px 0;
		.slTitle {
			color: rgba(0, 0, 0, 0.8);
			font-size: 24px;
			font-style: normal;
			font-weight: 500;
			line-height: normal;
			margin-bottom: 20px;
		}
	}

	.submit-btn {
		position: sticky;
		bottom: 0;
		padding: 20px;
		background: #ffffff;
		border-top: 1px solid #e5e6eb;
		text-align: center;
		z-index: 100;
		.ant-btn {
			margin: 0 15px;
			padding: 0 30px;
			border-radius: 6px;
			border: 1px solid @primary-color;
		}
	}
}
.modalBack {
	.tip {
		color: rgba(0, 0, 0, 0.25);
		font-size: 14px;
		line-height: normal;
		margin-bottom: 16px;
	}
	.textarea {
		width: 450px;
		height: 150px !important;
		font-size: 14px;
		line-height: 20px;
		padding: 16px 14px;
		background: #f3f5f6;
		color: rgba(0, 0, 0, 0.8);

		&::-webkit-input-placeholder {
			color: #8191a9;
		}
	}
}
</style>
