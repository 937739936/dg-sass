<template>
	<div class="slMain">
		<Breadcrumb />
		<a-card :bordered="false">
			<div class="methods-wrap">
				<span
					slot="title"
					class="slTitle"
					>盖章</span
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
						@click.native="$router.go(-1)"
						ghost
						>返回</a-button
					>
					<a-button
						type="primary"
						@click.native="download"
						ghost
						>下载</a-button
					>
					<a-button
						type="primary"
						@click.native="zuofeiVisible = true"
						ghost
						>作废</a-button
					>
					<a-button
						type="primary"
						v-debounceclick="3000"
						@click="sign"
						>盖章</a-button
					>
				</a-space>
			</div>
		</div>
		<ChooseStamp
			ref="chooseStamp"
			@submit="submitSign"
		/>
		<SignModal ref="signModal"></SignModal>
		<a-modal
			class="slModal cancel-modal"
			:visible="zuofeiVisible"
			:width="460"
			@cancel="zuofeiVisible = false"
			title="确认作废？"
		>
			<div class="tip"><span class="red">*</span> 请输入作废原因：</div>
			<a-textarea
				v-model="reasonName"
				placeholder="请输入资产作废原因，最多200字"
				:maxLength="200"
			/>

			<template slot="footer">
				<a-button
					key="back"
					@click="zuofeiVisible = false"
					class="cancel-btn"
					>取消</a-button
				>
				<a-button
					type="primary"
					@click="submitZ"
					style="margin-left: 20px"
					>确定</a-button
				>
			</template>
		</a-modal>

		<!-- <a-modal
			v-model="zuofeiVisible"
			title="作废原因"
			:width="500"
			@ok="submitZ"
			class="slModal"
		>
			<div
				@click.stop
				style="background: #fff"
				@move.stop
			>
				<a-row> 请输入作废原因： </a-row>
				<a-row>
					<a-textarea
						style="margin: 0 auto; margin-top: 20px"
						:maxLength="100"
						placeholder="作废原因"
						v-model="reasonName"
					></a-textarea>
				</a-row>
			</div>
		</a-modal> -->
	</div>
</template>

<script>
import PdfPreview from '@sub/components/pdf/index.vue';
import comDownload from '@sub/utils/comDownload.js';
import {
	API_GetConfirmLetterUrl,
	API_GetSignList,
	API_SubmitSign,
	API_DOWNLPREVIEWTE,
	// API_AuditReceivableDownload,
	API_AuditReceivableSellerSignDownload,
	API_GetConfirmAutoSignature,
	API_GetAccountsPayableZF
} from '@/v2/center/assets/api/index.js';
import { API_getCommonBatchDownload } from 'api/index';

import { sign } from 'untils/sign.js';
import SignModal from '@/v2/components/signModal/index.vue';
import { mapGetters } from 'vuex';
import SpinComponent from '@/v2/components/common/SpinComponent.vue';
import ENV from '@/v2/config/env';
import ChooseStamp from '@/v2/components/signModal/chooseStamp';
import Breadcrumb from '@/v2/components/breadcrumb/index';
export default {
	data() {
		return {
			zuofeiVisible: false,
			reasonName: '',
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
		API_GetConfirmLetterUrl({ assetId: this.$route.query.id }).then(res => {
			if (res.success) {
				this.relieveContractPdfPath = res.data.pdfUrl;
				// res.data.accountingPdf = 'trade-files/contract/02ab465298594637bf3b4aa48b96db0c/water-mark/煤炭买卖合同(TYYGJ-HNRH-202107-005).pdf'
				this.confirmNo = res.data.confirmNo;
				this.confirmFlag = res.data.confirmFlag;
				this.signList = res.data.confirmVOList || [];
				this.receivableTransferAttachId = res.data.receivableTransferAttachId;

				this.currentPdf = this.signList[0].url;
				this.currentPdfName = this.signList[0].name;
			}
		});
	},
	methods: {
		changeContract(index) {
			let item = this.signList[index];
			this.currentPdf = item.url;
			this.currentPdfName = item.name;
		},
		getRouterType(buyRouter) {
			return buyRouter;
		},
		download() {
			let { serialNo, bankName } = this.$route.query;
			if (this.signList && this.signList.length == 1) {
				let v = this.currentPdf;
				API_DOWNLPREVIEWTE(ENV.BASE_NET + v).then(res => {
					comDownload(res, v, this.currentPdfName + '-' + (serialNo ?? '') + '.pdf');
				});
			}
			if (this.signList && this.signList.length > 1) {
				let array = this.signList.map(e => {
					return e.url;
				});
				let files = array.join(',');
				let zipFileName = `${bankName}-${serialNo}-待盖章材料`;
				API_getCommonBatchDownload({
					zipFileName,
					files
				}).then(res => {
					comDownload(res.data, undefined, res.name);
				});
			}
		},
		autoSignature() {
			this.signLoading = true;
			API_GetConfirmAutoSignature({
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
		// 作废
		submitZ() {
			if (!this.reasonName) {
				this.$message.error('作废原因必填');
				return;
			}
			this.zuofeiVisible = false;
			API_GetAccountsPayableZF({
				message: this.reasonName,
				assetId: this.$route.query.id
			}).then(res => {
				if (res.success) {
					if (res.data) {
						this.$message.success('作废成功');
						// this.getList(1);
						this.$router.go(-1);
					}
				}
			});
		},
		sign() {
			if (this.confirmFlag == 1) {
				this.$confirm({
					centered: true,
					title: '确权提示',
					okText: '确定',
					content: '当前资产数据您已确权过，本次无需重新确权，点击“确定”提交即可',
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
				API_GetSignList,
				API_GetSignList
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
				API_SubmitSign,
				API_SubmitSign
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
	.cancel-modal {
		.tip {
			color: rgba(0, 0, 0, 0.4);
			font-size: 14px;
			margin-bottom: 20px;
		}
		.red {
			color: red;
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
