<template>
	<div>
		<a-row v-if="result">
			<spin-component
				:active="signLoading"
				text="合同签署中，请稍后..."
			></spin-component>
			<pdf-preview
				v-if="result.pdfPath"
				:url="result.pdfPath"
			></pdf-preview>
			<a-row
				type="flex"
				justify="center"
				style="margin: 20px 0"
			>
				<a-checkbox
					v-model="commitChecked"
					v-if="result.commitmentLetterPdfPath || result.bothSidesAgreementPdf || serviceFeeInfo.url"
				>
					已阅读并同意
					<router-link
						v-if="result.commitmentLetterPdfPath"
						:to="{
							path: '/center/steels/contract/preview',
							query: { url: result.commitmentLetterPdfPath }
						}"
					>
						《购销合同补充承诺函》
					</router-link>
					<span v-if="result.bothSidesAgreementPdf">
						和
						<router-link
							:to="{
								path: '/center/steels/contract/preview',
								query: { url: result.bothSidesAgreementPdf }
							}"
						>
							《两方协议》
						</router-link>
					</span>
					<span v-if="serviceFeeInfo.url">
						和
						<router-link
							:to="{
								path: '/center/steels/contract/preview',
								query: { url: serviceFeeInfo.url }
							}"
						>
							《{{ systemConfig.name }}两方服务费协议》
						</router-link>
					</span>
				</a-checkbox>
			</a-row>
			<a-row
				type="flex"
				justify="center"
				style="margin: 50px 0"
			>
				<a-button
					type="primary"
					@click.native="sign"
					:disabled="disabledClick || disabled"
					>确认</a-button
				>
				<a-button
					type="primary"
					style="margin: 0 50px"
					@click.native="visible = true"
					>驳回合同</a-button
				>
				<a-button
					type="primary"
					@click.native="$router.go(-1)"
					>返回</a-button
				>
			</a-row>

			<a-modal
				:visible="visible"
				okText="确定"
				cancelText="取消"
				width="400px"
				@ok="rejectContract"
				@cancel="
					() => {
						visible = false;
					}
				"
			>
				<a-input
					style="width: 90%; margin: 0 auto"
					placeholder="请输入驳回原因"
					v-model="rejectReason"
				></a-input>
			</a-modal>
		</a-row>
		<SignModal ref="signModal"></SignModal>
		<ChooseStamp
			ref="chooseStamp"
			@submit="submitSign"
			type="electronic"
		/>
	</div>
</template>

<script>
import PdfPreview from '@sub/components/pdf/index.vue';
import { sign } from '@/v2/utils/sign.js';
import SignModal from '@/v2/components/signModal/index';
import { mapGetters } from 'vuex';
import SpinComponent from '@/v2/components/common/SpinComponent.vue';
import {
	API_SteelsContractDetail,
	API_SteelsSealUkey,
	API_SteelsSealAuto,
	API_SteelsSignAfterConfirm,
	API_SteelsReject
} from '@/v2/center/steels/api/contract.js';
import { autoSignature, confirmToSeal, getServiceFeeInfo } from '@/v2/center/financeCenter/api';
import ChooseStamp from '@/v2/components/signModal/chooseStamp';
import systemConfig from '@/v2/config/common';

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
			serviceFeeInfo: {},
			cfcaSealList: [],
			systemConfig
		};
	},
	components: {
		SpinComponent,
		PdfPreview,
		SignModal,
		ChooseStamp
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		disabledClick() {
			let result = true;
			if (
				this.result.pdfPath &&
				!this.commitChecked &&
				(this.result.commitmentLetterPdfPath || this.result.bothSidesAgreementPdf || this.serviceFeeInfo.url)
			) {
				result = false;
			}
			return !result;
		},
		completedRoute() {
			if (this.$route.query.origin == 'sell') {
				return '/center/steels/contract/sell/list';
			}
			return '/center/steels/contract/buy/list';
		}
	},
	created() {
		this.getConfirmDetail();
		this.getServiceFeeInfo();
	},
	methods: {
		async autoSignature() {
			this.signLoading = true;
			try {
				const res = await API_SteelsSealAuto({
					id: this.$route.query.id,
					cfcaSealList: this.cfcaSealList
				});
				await this.step2();
				if (this.serviceFeeInfo.url) {
					await autoSignature({ serialNo: this.serviceFeeInfo.serialNo });
				}
				this.signLoading = false;
				this.$message.success({
					content: '盖章完成',
					duration: 5
				});
				this.$router.push(this.completedRoute);
			} catch (error) {
				this.signLoading = false;
			}
		},
		// 确认合同
		sign() {
			let obj = {
				id: this.$route.query.id,
				moduleSealType: 7 // 模块编码 7
			};
			this.$refs.chooseStamp.showModal(obj, true);
		},
		// 盖章相关
		submitSign(cfcaSealList, certModel) {
			this.cfcaSealList = cfcaSealList;
			if (certModel == 'TRUST') {
				this.$refs.signModal.showModal(this.autoSignature);
			} else {
				const that = this;
				const isOrderModule = true;
				sign.call(that, that.step1, that.step2, that.freeUkeySign, isOrderModule);
			}
		},
		step1(obj) {
			return API_SteelsSealUkey(
				Object.assign(
					{
						id: this.$route.query.id,
						cert: window.CryptoAgent.GetSignCertInfo('CertContent'),
						cfcaSealList: this.cfcaSealList
					},
					obj
				)
			);
		},
		step2(obj) {
			return API_SteelsSignAfterConfirm(
				Object.assign(
					{
						id: this.$route.query.id
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
			this.$message.success({
				content: '盖章完成',
				duration: 5
			});
			this.$router.push(this.completedRoute);
		},
		async getServiceFeeInfo() {
			if (this.VUEX_ST_COMPANYSUER.companyType != 'TRADER') return;
			const res = await getServiceFeeInfo({ orderNo: this.$route.query.contractNo, industryType: 'STEEL' });
			this.serviceFeeInfo = res.data;
		},
		// 驳回合同
		rejectContract() {
			if (!this.rejectReason) {
				this.$message.error('请填写驳回原因！');
				return;
			}
			API_SteelsReject({ id: this.$route.query.id, rejectReason: this.rejectReason }).then(res => {
				if (res.success) {
					this.$router.go(-1);
					this.$message.success('操作成功');
				} else {
					this.$message.error(res.message);
				}
			});
		},
		// 获取确认合同详情
		getConfirmDetail() {
			// 先获取pdf
			API_SteelsContractDetail(this.$route.query.id).then(res => {
				if (res.success) {
					this.result = res.data;
				}
			});
		}
	}
};
</script>

<style lang="stylus" scoped>
.name-items
  width 100%
  height 40px
  .name
    font-size 16px
    color #333
    margin-left 20px
</style>
