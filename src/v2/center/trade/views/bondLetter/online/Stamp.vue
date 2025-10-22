<template>
	<div class="slMain">
		<Breadcrumb />
		<a-card :bordered="false">
			<div
				slot="title"
				class="slTitle"
			>
				<span>{{ $route.meta.title }}</span>
			</div>
			<div
				v-if="url"
				class="content-box"
			>
				<spin-component
					:active="signLoading"
					text="合同签署中，请稍后..."
				></spin-component>
				<pdf-preview
					v-if="url"
					:url="url"
				>
				</pdf-preview>
			</div>
			<div v-else>
				<p class="loading-pic"><a-spin></a-spin></p>
				<p class="loading-wrap">合同正在生成中，请稍后...</p>
			</div>
		</a-card>
		<div class="slDetailBottom">
			<a-space :size="30">
				<a-button
					type="primary"
					ghost
					@click.native="$router.push('/center/bondLetter/online/list')"
					>返回</a-button
				>
				<a-button
					type="primary"
					ghost
					@click.native="downPdf()"
					>下载</a-button
				>
				<a-button
					type="primary"
					ghost
					@click.native="cancel()"
					>作废</a-button
				>
				<a-button
					type="primary"
					@click.native="sign()"
					>盖章</a-button
				>
			</a-space>
		</div>
		<SignModal ref="signModal"></SignModal>
		<ChooseStamp
			ref="chooseStamp"
			@submit="submitSign"
		/>
		<CancelModal
			ref="cancelModal"
			v-on:clickOk="clickCancelOk"
			tips="作废后，如再需开追保函，则需要重新走流程，如确需作废，请继续操作"
		/>
	</div>
</template>

<script>
import PdfPreview from '@sub/components/pdf/index.vue';
import {
	API_DownLoadFile,
	API_BondLetterCancel,
	API_BondLetterAfterAutoSignature,
	API_GetBondLetterPdfHashList,
	API_BondLetterSealToConfirm
} from '@/v2/center/trade/api/bondLetter';
import { sign } from '@/v2/utils/sign.js';
import SignModal from '@/v2/components/signModal/index';
import { mapGetters } from 'vuex';
import SpinComponent from '@/v2/components/common/SpinComponent.vue';
import ChooseStamp from '@/v2/components/signModal/chooseStamp';
import CancelModal from '@/v2/center/trade/views/contract/components/CancelModal.vue';
import Breadcrumb from '@/v2/components/breadcrumb/index';
import comDownload from '@sub/utils/comDownload.js';
export default {
	data() {
		return {
			signLoading: false,
			url: '',
			cfcaSealList: [], // 印模集合
			fromPageName: '',
		};
	},
	components: {
		SpinComponent,
		PdfPreview,
		SignModal,
		ChooseStamp,
		CancelModal,
		Breadcrumb
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		})
	},
	async mounted() {
		this.url = await this.$RsaDecrypt.generateFileUrl(this.$route.query.url);
	},
	beforeRouteEnter(to, from, next) {
		next(vm => {
			vm.fromPageName = from.name;
		});
	},
	methods: {
		getRouterType(buyRouter) {
			return buyRouter;
		},
		autoSignature() {
			this.signLoading = true;
			API_BondLetterAfterAutoSignature({
				bondLetterId: this.$route.query.bondLetterId
			})
				.then(res => {
					if (res.success) {
						this.$message.success({
							content: '盖章完成',
							duration: 5
						});
						this.$router.push('/center/bondLetter/online/list');
					} else {
						this.$message.error('签署失败，请联系管理员');
					}
				})
				.finally(() => {
					this.signLoading = false;
				});
		},
		sign() {
			let obj = {};
			this.$refs.chooseStamp.showModal(obj);
		},
		// 盖章订单
		submitSign(cfcaSealList, certModel) {
			this.cfcaSealList = cfcaSealList;
			if (certModel == 'TRUST') {
				this.$refs.signModal.showModal(this.autoSignature);
			} else {
				const that = this;
				this.completedRoute = '/center/bondLetter/online/list';
				const isOrderModule = true;
				sign.call(that, that.step1, that.step2, that.completedRoute, isOrderModule);
			}
		},
		step1(obj) {
			return this.getRouterType(API_GetBondLetterPdfHashList)(
				Object.assign(
					{
						bondLetterId: this.$route.query.bondLetterId,
						cert: obj.cert
					},
					obj
				)
			);
		},
		step2(obj) {
			return this.getRouterType(API_BondLetterSealToConfirm)(
				Object.assign(
					{
						bondLetterId: this.$route.query.bondLetterId
					},
					obj
				)
			);
		},
		downPdf() {
			API_DownLoadFile({ bondLetterId: this.$route.query.bondLetterId }).then(res => {
				comDownload(res, undefined, this.$route.query.serialNo + '.pdf');
			});
		},
		// 作废
		cancel() {
			this.$refs.cancelModal.show();
		},
		clickCancelOk(cancelReason) {
			API_BondLetterCancel({
				bondLetterId: this.$route.query.bondLetterId,
				reason: cancelReason
			}).then(res => {
				if (res.success) {
					if (res.data) {
						this.$message.success('作废成功');
						this.$router.push('/center/bondLetter/online/list?active=online');
					}
				}
			});
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
	.slTitle {
		margin-bottom: 20px;
	}
	.ant-card {
		padding: 20px 30px 0 30px;
		.content-box {
			position: relative;
			border-top: 1px solid #e5e6eb;
		}
	}
	.slDetailBottom {
		width: 100%;
		min-width: 1186px;
		height: 64px;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		border-top: 1px solid #e5e6eb;
		box-sizing: border-box;
		position: sticky;
		bottom: 0;
	}
}
</style>
