<template>
	<div class="slMain">
		<Breadcrumb></Breadcrumb>
		<a-card :bordered="false">
			<div
				slot="title"
				class="slTitle"
			>
				<span>结清协议盖章</span>
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
					:tab="item.serialNo"
				></a-tab-pane>
			</a-tabs>
			<div
				class="content"
				v-if="signList.length"
			>
				<pdf-preview
					:url="currentPdf"
					class="new-warp"
					v-if="currentPdf"
				></pdf-preview>
			</div>

			<ChooseStamp
				ref="chooseStamp"
				@submit="submitSign"
			/>
			<SignModal ref="signModal"></SignModal>
		</a-card>
		<div class="slDetailBottom">
			<!-- <p class="tip2">点击”确认盖章/作废“按钮，以上附件将全部确认盖章/作废</p> -->
			<div class="btn-box">
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
						v-debounceclick
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
						v-debounceclick
						@click="signApply"
						>盖章</a-button
					>
				</a-space>
			</div>
		</div>
		<!-- <TipModal ref="tipModal" @ok='confirmCancel'></TipModal> -->
		<a-modal
			class="slModal cancel-modal"
			:visible="visible"
			:width="460"
			@cancel="visible = false"
			title="作废"
		>
			<div class="tip"><span class="red">*</span> 请输入作废原因：</div>
			<a-textarea
				v-model="reason"
				style="border: 0"
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
					v-debounceclick
					style="margin-left: 20px"
					>确定</a-button
				>
			</template>
		</a-modal>
	</div>
</template>

<script>
import Breadcrumb from '@/v2/components/breadcrumb/index';
import PdfPreview from '@sub/components/pdf/index.vue';
import SignModal from 'components/signModal/index';
import SpinComponent from '@/v2/components/common/SpinComponent.vue';
import ChooseStamp from '@/v2/components/signModal/chooseStamp';
import TipModal from '@sub/components/DelModal.vue';
import { sign } from 'untils/sign.js';
import comDownload from '@sub/utils/comDownload.js';

import {
	getSignList,
	downloadLoanCloseFile,
	invalidLoanClose,
	autoSignLoanClose,
	getSignHashList,
	settlementAgreementSealSyncHandle
} from '@/v2/center/financing/api/loanClose.js';
import { mapGetters } from 'vuex';

export default {
	name: 'FinancingSign',
	data() {
		return {
			signList: [],
			currentPdf: '',
			signLoading: false,
			ischeck: false,
			visible: false,
			reason: '',
			detailData: {}
		};
	},
	components: {
		PdfPreview,
		SignModal,
		SpinComponent,
		ChooseStamp,
		Breadcrumb,
		TipModal
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		// 判断当前是否是金融机构
		isBank() {
			return this.VUEX_ST_COMPANYSUER.companyType == 'FINANCIAL_ORG';
		},
		params() {
			const ids = this.$route.query.id && this.$route.query.id.split(',');
			return {
				settlementAgreementIdList: ids,
				toSealCompanyType: this.isBank ? 1 : 2
			};
		}
	},
	mounted() {
		this.getDetail();
	},
	methods: {
		async getDetail() {
			const res = await getSignList(this.params);
			const list = res.data || [];
			list.forEach(el => {
				el.path = el.fileUrl;
			});
			this.detailData = list;
			this.signList = list;

			this.currentPdf = this.signList.length ? this.signList[0].path : '';
		},
		goBack() {
			this.$router.push('/center/financing/loanClose/list');
		},
		changeContract(index) {
			const item = this.signList[index];

			this.currentPdf = item.path;
		},
		autoSignature() {
			this.signLoading = true;
			autoSignLoanClose(this.params)
				.then(res => {
					if (res.success) {
						this.$message.success('签署完成').then(
							settlementAgreementSealSyncHandle(this.params).then(() => {
								this.$router.push('/center/financing/loanClose/list');
							})
						);
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
			return getSignHashList({
				...this.params,
				cert: obj.cert
			});
		},
		step2() {
			return settlementAgreementSealSyncHandle({
				...this.params
			});
		},
		signApply() {
			let obj = {};
			this.$refs.chooseStamp.showModal(obj);
		},
		submitSign(cfcaSealList, certModel) {
			if (certModel == 'TRUST') {
				this.$refs.signModal.showModal(this.autoSignature);
			} else {
				sign.call(this, this.step1.bind(this), this.step2.bind(this), '/center/financing/loanClose/list', true);
			}
		},
		async downAll() {
			const res = await downloadLoanCloseFile(this.params);
			comDownload(res.data, null, res.name);
		},
		async confirmCancel() {
			if (!this.reason) {
				this.$message.error('请输入作废原因');
				return;
			}
			const params = {
				...this.params,
				invalidReason: this.reason
			};
			const res = await invalidLoanClose(params);
			this.$message.success('作废成功');
			this.goBack();
		}
	}
};
</script>

<style lang="less" scoped>
.content {
	::v-deep .warp {
		color: red;
		max-width: 100%;
		height: auto !important;
	}
}
.new-warp {
	height: auto !important;
	max-width: 100%;
}
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
		// display: flex;
		// flex-direction: row;
		// justify-content: center;
		// flex-direction: column;
		// align-items: center;
		border-top: 1px solid #e5e6eb;
		box-sizing: border-box;
		position: fixed;
		bottom: 0;
		.btn-box {
			display: flex;
			// flex-direction: row;
			justify-content: center;
			// flex-direction: column;
			align-items: center;
			height: 100%;
		}
		.tip2 {
			color: rgba(0, 0, 0, 0.25);
			font-size: 12px;
			padding-left: 20px;
			position: absolute;
			top: 23px;
			// transform: translateX(-50%);
		}
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
</style>
