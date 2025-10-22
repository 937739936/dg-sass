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
				style="margin: 50px 0"
			>
				<a-space>
					<a-button
						type="primary"
						@click.native="sign"
						:disabled="disabled"
						>盖章</a-button
					>
					<a-button
						type="primary"
						@click.native="$router.go(-1)"
						>返回</a-button
					>
				</a-space>
			</a-row>
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
	API_SteelsSealReleaseUkey,
	API_SteelsSealReleaseAuto,
	API_SteelsSignReleaseAfterConfirm,
	API_SteelsGoodstransferReleaseDetail
} from '@/v2/center/steels/api/goodsTransfer.js';
import ChooseStamp from '@/v2/components/signModal/chooseStamp';

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
			cfcaSealList: []
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
			return '/center/steels/goodsTransfer/letterNotice/list';
		}
	},
	created() {
		API_SteelsGoodstransferReleaseDetail({ id: this.$route.query.id }).then(res => {
			if (res.success) {
				this.result = res.data;
			}
		});
	},
	methods: {
		autoSignature() {
			this.signLoading = true;
			API_SteelsSealReleaseAuto({
				id: this.$route.query.id,
				cfcaSealList: this.cfcaSealList
			})
				.then(res => {
					if (res.success) {
						this.$message.success({
							content: '盖章完成',
							duration: 5
						});
						this.$router.push(this.completedRoute);
					} else {
						this.$message.error('签署失败，请联系管理员');
					}
				})
				.finally(() => {
					this.signLoading = false;
				});
		},
		// 盖章相关
		sign() {
			let obj = {
				moduleSealType: 13 // 模块编码
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
				sign.call(that, that.step1, that.step2, that.completedRoute, isOrderModule);
			}
		},
		step1(obj) {
			return API_SteelsSealReleaseUkey(
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
			return API_SteelsSignReleaseAfterConfirm(
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

<style lang="stylus" scoped>
.name-items
  width 100%
  height 40px
  .name
    font-size 16px
    color #333
    margin-left 20px
</style>
