<template>
	<div class="slMain">
		<Breadcrumb />
		<a-card :bordered="false">
			<div class="methods-wrap">
				<span
					slot="title"
					class="slTitle"
					>确权盖章</span
				>
			</div>
			<a-tabs @change="changeContract">
				<a-tab-pane
					:tab="item.name"
					v-for="(item, index) in signList"
					:key="index"
				>
				</a-tab-pane>
			</a-tabs>
			<div class="content-box">
				<spin-component
					:active="signLoading"
					text="合同签署中，请稍后..."
				></spin-component>
				<pdf-preview
					v-if="currentPdf"
					:url="currentPdf"
				></pdf-preview>
			</div>
		</a-card>
		<div class="slDetailBottom">
			<div>
				<a-space :size="30">
					<a-button
						type="primary"
						icon="download"
						@click.native="download"
						style="margin-right: 50px"
						>下载文件</a-button
					>
					<a-button
						type="primary"
						@click.native="$router.go(-1)"
						style="margin-right: 50px"
						ghost
						>取消</a-button
					>
					<a-button
						type="primary"
						v-debounceclick="3000"
						@click="sign"
						style="margin-right: 50px"
						>确定</a-button
					>
				</a-space>
			</div>
		</div>
		<ChooseStamp
			ref="chooseStamp"
			@submit="submitSign"
		/>
		<SignModal ref="signModal"></SignModal>
	</div>
</template>

<script>
import PdfPreview from '@sub/components/pdf/index.vue';
import comDownload from '@sub/utils/comDownload.js';
import {
	API_GetConfirmLetterSellerUrl,
	API_GetSignSellList,
	API_SubmitSellSign,
	API_DOWNLPREVIEWTE,
	API_GetConfirmAutoSellSignature
} from '@/v2/center/assets/api/index.js';
import { sign } from 'untils/sign.js';
import SignModal from '@/v2/components/signModal/index.vue';
import { mapGetters } from 'vuex';
import SpinComponent from '@/v2/components/common/SpinComponent.vue';
import ChooseStamp from '@/v2/components/signModal/chooseStamp';
import Breadcrumb from '@/v2/components/breadcrumb/index';
export default {
	data() {
		return {
			signLoading: false,
			relieveContractPdfPath: '',
			completedRoute: '/center/assets/ConfirmRights',
			confirmNo: '',
			currentPdf: '',
			signList: []
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
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER',
			VUEX_ST_TOKEN: 'VUEX_ST_TOKEN'
		})
	},
	created() {
		API_GetConfirmLetterSellerUrl({ assetId: this.$route.query.id }).then(res => {
			if (res.success) {
				this.relieveContractPdfPath = res.data.pdfUrl;
				// res.data.accountingPdf = 'trade-files/contract/02ab465298594637bf3b4aa48b96db0c/water-mark/煤炭买卖合同(TYYGJ-HNRH-202107-005).pdf'
				this.confirmNo = res.data.confirmNo;
				this.confirmFlag = res.data.confirmFlag;
				this.signList = res.data || [];
				this.receivableTransferAttachId = res.data.receivableTransferAttachId;

				this.currentPdf = this.signList[0].path;
				this.currentPdfName = this.signList[0].name;
			}
		});
	},
	methods: {
		changeContract(index) {
			let item = this.signList[index];
			this.currentPdf = item.path;
			this.currentPdfName = item.name;
		},
		getRouterType(buyRouter) {
			return buyRouter;
		},
		download() {
			let v = this.currentPdf;
			API_DOWNLPREVIEWTE(v).then(res => {
				comDownload(res, v, this.currentPdfName + '.pdf');
			});
		},
		autoSignature() {
			this.signLoading = true;
			API_GetConfirmAutoSellSignature({
				assetId: this.$route.query.id,
				pdfUrl: this.relieveContractPdfPath
			})
				.then(res => {
					if (res.success) {
						this.step2()
							.then(() => {
								this.$message.success('签署完成').then(() => this.$router.go(-1));
							})
							.finally(() => {
								this.signLoading = false;
							});
					} else {
						this.$message.error('签署失败，请联系管理员');
					}
				})
				.finally(() => {
					this.signLoading = false;
				});
		},
		sign() {
			if (this.confirmFlag == 1) {
				this.$confirm({
					centered: true,
					title: '确权提示',
					okText: '确定',
					content: '当前资产数据您已确权过，本次无需重新确权，点击“确定”后，资产数据将推送资方系统直接进行审核',
					cancelText: '取消',
					onOk: () => {
						this.step2()
							.then(() => {
								this.$message.success('签署完成').then(() => this.$router.go(-1));
							})
							.finally(() => {
								this.signLoading = false;
							});
					},
					onCancel() {}
				});
			} else {
				let obj = {};
				this.$refs.chooseStamp.showModal(obj);
			}
		},
		// 盖章确权
		submitSign(cfcaSealList, certModel) {
			if (certModel == 'TRUST') {
				this.$refs.signModal.showModal(this.autoSignature);
			} else {
				const that = this;
				const isOrderModule = true;
				sign.call(that, that.step1, that.step2, that.completedRoute, isOrderModule);
			}
		},
		step1(obj) {
			return this.getRouterType(
				API_GetSignSellList,
				API_GetSignSellList
			)(
				Object.assign(
					{
						assetId: this.$route.query.id,
						pdfUrl: this.relieveContractPdfPath
					},
					obj
				)
			);
		},
		step2(obj) {
			return this.getRouterType(
				API_SubmitSellSign,
				API_SubmitSellSign
			)(
				Object.assign(
					{
						assetId: this.$route.query.id,
						confirmNo: this.confirmNo,
						receivableTransferAttachId: this.receivableTransferAttachId,
						pdfUrl: this.relieveContractPdfPath
					},
					obj
				)
			);
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
	.ant-card {
		padding: 20px 30px 0 30px;
		.content-box {
			position: relative;
			border: 1px solid #e5e6eb;
			border-bottom: none;
			height: 100%;
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
