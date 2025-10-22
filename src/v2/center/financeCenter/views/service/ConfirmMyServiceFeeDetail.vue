<template>
	<div class="slMain">
		<Breadcrumb />
		<a-card :bordered="false">
			<div class="methods-wrap">
				<span class="slTitle">服务费结算单确认盖章</span>
			</div>
			<a-row class="content-box">
				<spin-component
					:active="signLoading"
					text="服务费结算单盖章中，请稍后..."
				></spin-component>
				<pdf-preview
					v-if="result"
					:url="result"
				></pdf-preview>
			</a-row>
			<ChooseStamp
				ref="chooseStamp"
				@submit="submitSign"
			/>
			<SignModal ref="signModal"></SignModal>
		</a-card>
		<div class="slDetailBottom">
			<a-row
				type="flex"
				justify="center"
				style="margin-top: 20px"
				v-if="serviceFeeInfo.url && isShowFreeUrl"
			>
				<a-checkbox v-model="agreementChecked">
					已阅读并同意
					<router-link
						:to="{
							path: '/center/financeCenter/service/serviceFeeAgreementPdf',
							query: { url: serviceFeeInfo.url }
						}"
					>
						《{{ systemConfig.name }}两方服务费协议》
					</router-link>
				</a-checkbox>
			</a-row>
			<a-row
				type="flex"
				justify="center"
				style="margin: 20px 0"
			>
				<a-space :size="30">
					<a-button
						type="primary"
						@click.native="confirmServiceFee"
						:disabled="disabledClick || disabled"
						>盖章</a-button
					>
					<a-button
						type="primary"
						@click.native="$router.go(-1)"
						>返回</a-button
					>
				</a-space>
			</a-row>
		</div>
	</div>
</template>

<script>
import PdfPreview from '@sub/components/pdf/index.vue';
import {
	API_ServiceFeeStatementPreviewContract,
	API_ServiceFeeDetailNew,
	API_CfcaServicefeeConfirmAutoSignature,
	API_ServiceFeeStatementGetSigList,
	API_ServiceFeeStatementSave,
	autoSignature,
	getPdfHashList,
	confirmToSeal,
	getServiceFeeInfo
} from './../../api';
import { sign } from 'untils/sign.js';
import { mapGetters } from 'vuex';
import SpinComponent from '@/v2/components/common/SpinComponent.vue';
import SignModal from 'components/signModal/index';
import ChooseStamp from '@/v2/components/signModal/chooseStamp';
import Breadcrumb from '@/v2/components/breadcrumb/index';
import systemConfig from '@/v2/config/common';

export default {
	data() {
		return {
			result: '',
			autoFocus: false,
			rejectReason: '',
			disabled: false,
			signLoading: false,
			// 服务协议是否签约
			info: {},
			agreementChecked: false,
			serviceFeeInfo: {},
			systemConfig
		};
	},
	components: {
		SpinComponent,
		PdfPreview,
		SignModal,
		ChooseStamp,
		Breadcrumb
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		disabledClick() {
			let result = true;
			if (this.serviceFeeInfo.url && !this.agreementChecked) {
				result = false;
			}
			return !result;
		},
		// 是否展示服务费url
		isShowFreeUrl() {
			return !!this.$route.query.orderNo;
		}
	},
	created() {
		this.getConfirmDetail();
	},
	props: {
		type: {
			required: false,
			default: 'old',
			type: String
		}
	},
	methods: {
		async autoSignature() {
			this.signLoading = true;
			try {
				await API_CfcaServicefeeConfirmAutoSignature({ serviceFeeId: this.$route.query.id });
				if (this.serviceFeeInfo.url) {
					await autoSignature({ serialNo: this.serviceFeeInfo.serialNo });
				}
				this.$message.success('签署完成');
				this.$router.go(-1);
			} catch (error) {
			} finally {
				this.signLoading = false;
			}
		},
		// 确认服务费结算单
		async confirmServiceFee() {
			// 如果不是一般贸易商 并且 服务费没有签约
			if (!this.info.serviceFeeAgreementUrl && this.VUEX_ST_COMPANYSUER.companyType !== 'TRADER' && this.isShowFreeUrl) {
				this.$message.error('请先完成服务费协议签章');
				return;
			}
			let obj = {};
			this.$refs.chooseStamp.showModal(obj);
		},
		submitSign(cfcaSealList, certModel) {
			if (certModel == 'TRUST') {
				this.$refs.signModal.showModal(this.autoSignature);
			} else {
				sign.call(this, this.step1.bind(this), this.step2.bind(this), '/center/financeCenter/service/myServiceFee', true);
			}
		},
		step1(obj) {
			return API_ServiceFeeStatementGetSigList({
				serviceFeeId: this.$route.query.id,
				cert: obj.cert
			});
		},
		step2() {
			return API_ServiceFeeStatementSave({
				serviceFeeId: this.$route.query.id
			});
		},
		// 服务费协议盖章
		freeStep1(obj) {
			return getPdfHashList(
				Object.assign(
					{
						serialNo: this.serviceFeeInfo.serialNo,
						cert: obj.cert
					},
					obj
				)
			);
		},
		freeStep2(obj) {
			return confirmToSeal(
				Object.assign(
					{
						serialNo: this.serviceFeeInfo.serialNo
					},
					obj
				)
			);
		},
		// 服务费 ukey盖章
		async freeUkeySign() {
			if (this.serviceFeeInfo.url) {
				await confirmToSeal({ serialNo: this.serviceFeeInfo.serialNo });
			}
			this.$message.success('签署完成');
			this.$router.go(-1);
		},
		// 获取确认订单详情
		async getConfirmDetail() {
			if (this.$route.query.isNew == 'true' || this.type == 'new') {
				const res = await API_ServiceFeeDetailNew({ id: this.$route.query.id });
				this.info = res.data;
				this.result = res.data.pdfPath;
				// 如果没有订单编号 就不走服务费签约逻辑 和展示
				if (!res.data.serviceFeeAgreementUrl && this.isShowFreeUrl) {
					const res2 = await getServiceFeeInfo({ id: this.$route.query.id });
					this.serviceFeeInfo = res2.data;
				}
			} else {
				API_ServiceFeeStatementPreviewContract({
					serviceFeeId: this.$route.query.id
				}).then(res => {
					this.result = res.data.ticketPdfUrl;
				});
			}
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
	.methods-wrap {
		border-bottom: none;
	}
	.ant-card {
		padding: 20px 30px 0 30px;
		.content-box {
			position: relative;
			border: 1px solid #e5e6eb;
			border-bottom: none;
		}
	}
	.slDetailBottom {
		width: 100%;
		min-width: 1186px;
		border-top: 1px solid #e5e6eb;
		box-sizing: border-box;
		position: sticky;
		bottom: 0;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
}
</style>
