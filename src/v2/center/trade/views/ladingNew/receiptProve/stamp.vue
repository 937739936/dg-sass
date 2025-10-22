<template>
	<div>
		<a-row v-if="result">
			<spin-component
				:active="signLoading"
				text="合同签署中，请稍后..."
			></spin-component>
			<pdf-preview
				v-if="result.fileUrl"
				:url="result.fileUrl"
			></pdf-preview>
			<a-row
				type="flex"
				justify="center"
				style="margin: 50px 0"
			>
				<a-space>
					<a-button @click.native="$router.go(-1)">返回</a-button>
					<a-button
						type="primary"
						@click.native="confirmOrder"
						>盖章</a-button
					>
				</a-space>
			</a-row>
		</a-row>
		<ChooseStamp
			ref="chooseStamp"
			@submit="submitSign"
		/>
		<SignModal ref="signModal"></SignModal>
	</div>
</template>

<script>
import PdfPreview from '@sub/components/pdf/index.vue';
import { sign } from '@/v2/utils/sign.js';
import SignModal from '@/v2/components/signModal/index';
import { mapGetters } from 'vuex';
import SpinComponent from '@/v2/components/common/SpinComponent.vue';
import ChooseStamp from '@/v2/components/signModal/chooseStamp';
import {
	API_ReceiptSealReleaseUkey,
	API_ReceiptSealReleaseAuto,
	API_ReceiptSignReleaseAfterConfirm
	// API_getReceiptProveDataById,
} from '@/v2/center/trade/api/lading';
import { API_RECEIPT_DETAIL } from '@/v2/center/trade/api/newLading';
export default {
	data() {
		return {
			result: {},
			visible: false,
			signLoading: false
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
		completedRoute() {
			let modulePath = this.$route.path.includes('/logisticsPlatform/') ? 'logisticsPlatform' : 'ladingbill';
			return `/center/${modulePath}/receipt/list`;
		}
	},
	created() {
		API_RECEIPT_DETAIL({ id: this.$route.query.id }).then(async res => {
			if (res.success) {
				const fileUrl = (res.data.attachVOList || []).filter(r => r.type == 'SHZM')[0].fileUrl;
				this.result = {
					...res.data,
					fileUrl: await this.$RsaDecrypt.generateFileUrl(fileUrl)
				};
			}
		});
	},
	methods: {
		autoSignature() {
			this.signLoading = true;
			API_ReceiptSealReleaseAuto({ id: this.$route.query.id })
				.then(res => {
					if (res.success) {
						this.$message.success('签署完成').then(() => this.$router.push(this.completedRoute));
					} else {
						this.$message.error('签署失败，请联系管理员');
					}
				})
				.finally(() => {
					this.signLoading = false;
				});
		},
		// 判断签章类型
		confirmOrder() {
			let obj = {};
			this.$refs.chooseStamp.showModal(obj);
		},
		submitSign(cfcaSealList, certModel) {
			// 子组件回调盖章
			if (certModel == 'TRUST') {
				this.$refs.signModal.showModal(this.autoSignature);
			} else {
				const that = this;
				const isOrderModule = true;
				sign.call(that, that.step1, that.step2, that.completedRoute, isOrderModule);
			}
		},
		step1(obj) {
			return API_ReceiptSealReleaseUkey(
				Object.assign(
					{
						id: this.$route.query.id,
						cert: window.CryptoAgent.GetSignCertInfo('CertContent')
					},
					obj
				)
			);
		},
		step2(obj) {
			return API_ReceiptSignReleaseAfterConfirm(
				Object.assign(
					{
						id: this.$route.query.id
					},
					obj
				)
			);
		}
	}
};
</script>

<style lang="less" scoped>
.name-items {
	width: 100%;
	height: 40px;
	.name {
		font-size: 16px;
		color: #333;
		margin-left: 20px;
	}
}
</style>
