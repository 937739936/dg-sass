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
				<a-button
					type="primary"
					@click.native="sign"
					>确认</a-button
				>
				<a-button
					type="primary"
					@click.native="invalid"
					style="margin-left: 10px"
					>作废</a-button
				>
				<a-button
					type="primary"
					@click.native="$router.go(-1)"
					style="margin-left: 10px"
					>返回</a-button
				>
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
import { mapGetters } from 'vuex';
import SignModal from '@/v2/components/signModal/index';
import SpinComponent from '@/v2/components/common/SpinComponent.vue';
import ChooseStamp from '@/v2/components/signModal/chooseStamp';
import {
	bondLetterSealAuto,
	bondLetterSealUkey,
	bondLetterSignAfterConfirm,
	invalidBondLetter
} from '@/v2/center/steels/api/additionalMargin.js';

export default {
	data() {
		return {
			result: {},
			visible: false,
			disabled: false,
			signLoading: false,
			serviceFeeInfo: {},
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
			return '/center/steels/additionalMargin/additionalMargin/list';
		}
	},
	mounted() {
		this.result = this.$route.query;
	},
	methods: {
		async autoSignature() {
			this.signLoading = true;
			try {
				const res = await bondLetterSealAuto({
					id: this.$route.query.id,
					cfcaSealList: this.cfcaSealList
				});
				await this.step2();
				this.$message.success({
					content: '盖章完成',
					duration: 5
				});
				this.signLoading = false;
				setTimeout(() => {
					this.$router.push(this.completedRoute);
				}, 1000);
			} catch (error) {
				this.signLoading = false;
			}
		},
		// 确认
		sign() {
			let obj = {
				id: this.$route.query.id,
				moduleSealType: 14 // 模块编码 14
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
			return bondLetterSealUkey(
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
			return bondLetterSignAfterConfirm(
				Object.assign(
					{
						id: this.$route.query.id
					},
					obj
				)
			);
		},
		// 作废
		async invalid() {
			const params = {
				id: this.$route.query.id
			};
			this.$confirm({
				centered: true,
				title: '您确定作废当前追保函吗？',
				okText: '确定',
				cancelText: '取消',
				onOk: async () => {
					await invalidBondLetter(params);
					this.$message.success('操作成功');
					this.$router.go(-1);
				},
				onCancel() {}
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
