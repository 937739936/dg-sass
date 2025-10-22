<template>
	<div class="slMain">
		<Breadcrumb></Breadcrumb>
		<a-card :bordered="false">
			<div
				slot="title"
				class="slTitle"
			>
				<span>电子仓单管理协议盖章</span>
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
					:tab="item.attachmentTypeText"
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
			<p class="tip2">点击”确认盖章/作废“按钮，以上附件将全部确认盖章/作废</p>
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
import ENV from '@/v2/config/env';
import Breadcrumb from '@/v2/components/breadcrumb/index';
import PdfPreview from '@sub/components/pdf/index.vue';
import SignModal from 'components/signModal/index';
import SpinComponent from '@/v2/components/common/SpinComponent.vue';
import ChooseStamp from '@/v2/components/signModal/chooseStamp';
import TipModal from '@sub/components/DelModal.vue';
import { sign } from 'untils/sign.js';
import comDownload from '@sub/utils/comDownload.js';
import {
	API_FinancingSignList,
	API_FinancingSignSave,
	API_FinancingGetSigList,
	API_CfcaFinAutoSignature,
	API_FinancingDetaildownloadFileAll,
	API_Financinginvalid,
	API_FinancingDetail
} from '@/v2/center/financing/api/index.js';

import {
	downloadWarehouseReceiptAgreementManage,
	handleWarehouseReceiptAgreementManage,
	getWarehouseReceiptAgreementManageDetail,
	signSaveAgreementManage,
	getAgreementManageHashList,
	autoSignAgreementManage
} from '@/v2/center/logisticsPlatform/api/warehouseReceipt';

import { mapGetters } from 'vuex';

export default {
	name: 'FinancingSign',
	data() {
		return {
			signList: [],
			BASE_NET: ENV.BASE_NET,
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
		})
	},
	mounted() {
		this.getDetail();
	},
	methods: {
		async getDetail() {
			const params = {
				id: this.$route.query.id
			};
			const res = await getWarehouseReceiptAgreementManageDetail(params);
			this.detailData = res.data;
			this.signList = res.data.attachments || [];
			this.currentPdf = this.signList.length ? this.signList[0].path : '';
		},
		goBack() {
			this.$router.push('/center/logisticsPlatform/warehouseReceipt/warehouseReceiptAgreement/list');
		},
		changeContract(index) {
			const item = this.signList[index];

			this.currentPdf = item.path;
		},
		autoSignature() {
			this.signLoading = true;
			autoSignAgreementManage({ id: this.$route.query.id })
				.then(res => {
					if (res.success) {
						this.$message
							.success('签署完成')
							.then(() => this.$router.push('/center/logisticsPlatform/warehouseReceipt/warehouseReceiptAgreement/list'));
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
			return getAgreementManageHashList({
				id: this.$route.query.id,
				cert: obj.cert
			});
		},
		step2() {
			return signSaveAgreementManage({
				id: this.$route.query.id
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
				sign.call(
					this,
					this.step1.bind(this),
					this.step2.bind(this),
					'/center/logisticsPlatform/warehouseReceipt/warehouseReceiptAgreement/list',
					true
				);
			}
		},
		async downAll() {
			const res = await downloadWarehouseReceiptAgreementManage({ id: this.$route.query.id });
			comDownload(res.data, null, res.name);
		},
		async confirmCancel() {
			if (!this.reason) {
				this.$message.error('请输入作废原因');
				return;
			}
			const params = {
				remark: this.reason,
				id: this.$route.query.id,
				operatorType: 'CANCEL'
			};
			const res = await handleWarehouseReceiptAgreementManage(params);
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
