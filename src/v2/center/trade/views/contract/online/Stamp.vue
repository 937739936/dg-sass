<template>
	<div class="slMain">
		<breadcrumb></breadcrumb>
		<a-card :bordered="false">
			<div
				slot="title"
				class="slTitle"
			>
				<span>{{ $route.meta.title }}</span>
			</div>
			<a-tabs @change="changeTab">
				<a-tab-pane
					key="1"
					tab="贸易合同"
				>
				</a-tab-pane>
				<a-tab-pane
					key="2"
					tab="承诺函"
					v-if="!isInitiator && result.commitmentLetterPdfPath"
				>
				</a-tab-pane>
				<a-tab-pane
					key="3"
					tab="服务费协议"
					v-if="!isInitiator && serviceFeeInfo.url"
				>
				</a-tab-pane>
			</a-tabs>
			<div
				v-if="result"
				class="content-box"
			>
				<spin-component
					:active="signLoading"
					text="合同签署中，请稍后..."
				></spin-component>
				<pdf-preview
					v-if="result.contractPdfPath"
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
					@click.native="$router.go(-1)"
					>返回</a-button
				>
				<a-button
					type="primary"
					ghost
					@click.native="downPdf()"
					>下载文件</a-button
				>
				<a-button
					type="primary"
					@click.native="cancel()"
					>作废</a-button
				>
				<a-button
					type="primary"
					@click.native="sign()"
					>合同盖章</a-button
				>
			</a-space>
		</div>
		<SignModal ref="signModal" />
		<ChooseStamp
			ref="chooseStamp"
			@submit="submitSign"
			type="electronic"
		/>
		<CancelModal
			ref="cancelModal"
			v-on:clickOk="clickCancelOk"
		/>
	</div>
</template>

<script>
import PdfPreview from '@sub/components/pdf/index.vue';
import { autoSignature, getPdfHashList, confirmToSeal, getServiceFeeInfo } from '@/v2/center/financeCenter/api';
import {
	API_SUBMIT_RECEIVE_SEAL,
	API_SUBMITT_SEND_SEAL,
	API_getConfirmInfo,
	API_contract_cancel,
	API_CfcaOrderAutoSignature,
	API_DOWNLPREVIEWTEBatchDownLoad,
	API_DOWNLPREVIEWTE,
	API_BUYORDERGETTOSIGLIST,
	API_SELLORDERGETTOSIGLIST
} from '@/v2/center/trade/api/contract';
import { sign } from '@/v2/utils/sign.js';
import { mapGetters } from 'vuex';
import SpinComponent from '@/v2/components/common/SpinComponent.vue';
import SaveData from '@sub/utils/storage';
import SignModal from '@/v2/components/signModal/index';
import ChooseStamp from '@/v2/components/signModal/chooseStamp';
import comDownload from '@sub/utils/comDownload.js';
import moment from 'moment';
import ENV from '@/v2/config/env';
import breadcrumb from '@/v2/components/breadcrumb/index';
import CancelModal from '@/v2/center/trade/views/contract/components/CancelModal.vue';

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
			signLoading: false,
			completedRoute: this.$route.query.type === 'BUY' ? '/center/contract/buy/list' : '/center/contract/sell/list',
			// 服务费
			serviceFeeInfo: {},
			cfcaSealList: [], // 印模集合
			BASE_NET: ENV.BASE_NET,
			url: ''
		};
	},
	components: {
		SpinComponent,
		PdfPreview,
		SignModal,
		ChooseStamp,
		breadcrumb,
		CancelModal
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		isInitiator() {
			return this.VUEX_ST_COMPANYSUER.companyUscc === this.$route.query?.initiatorUscc;
		}
	},
	created() {
		this.getRouterType();
		// this.getSubmitDetail();
		this.getServiceFeeInfo();
		this.getConfirmDetail();
	},
	methods: {
		// 作废
		cancel() {
			this.$refs.cancelModal.show();
		},
		clickCancelOk(cancelReason) {
			const type = this.$route.query.type?.toLowerCase();
			API_contract_cancel({
				orderId: this.$route.query.id,
				cancelReason
			}).then(res => {
				if (res.success) {
					this.$message.success('作废成功').then(() => {
						this.$router.replace(`/center/contract/${type}/list`);
					});
				}
			});
		},
		// 获取确认订单详情
		getConfirmDetail() {
			API_getConfirmInfo({
				orderId: this.$route.query.id
			}).then(res => {
				this.result = res.data;
				this.url = this.result.contractPdfPath;
			});
		},
		changeTab(e) {
			if (e == 1) {
				this.url = this.result.contractPdfPath;
			} else if (e == 2) {
				this.url = this.result.commitmentLetterPdfPath;
			} else if (e == 3) {
				this.url = this.serviceFeeInfo.url;
			}
		},
		getRouterType(sendRouter, receiveRouter) {
			let Fun = null;
			if (this.isInitiator) {
				Fun = sendRouter;
			} else {
				Fun = receiveRouter;
			}
			return Fun;
		},
		step1(obj) {
			return this.getRouterType(
				API_BUYORDERGETTOSIGLIST,
				API_SELLORDERGETTOSIGLIST
			)(
				Object.assign(
					{
						orderId: this.$route.query.id,
						cfcaSealList: this.cfcaSealList
					},
					obj
				)
			);
		},
		step2(obj) {
			return this.getRouterType(
				API_SUBMITT_SEND_SEAL,
				API_SUBMIT_RECEIVE_SEAL
			)(Object.assign({ orderId: this.$route.query.id }, obj));
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
		sign() {
			let obj = {
				moduleSealType: 1, //模块编码 1代表贸易合同模块章
				orderSerialNo: this.$route.query.serialNo
			};
			this.$refs.chooseStamp.showModal(obj);
		},
		// 确认订单
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

		// 服务费 ukey盖章
		async freeUkeySign() {
			if (this.serviceFeeInfo.url) {
				await confirmToSeal({ serialNo: this.serviceFeeInfo.serialNo });
			}
			this.$message.success({
				content: '盖章完成',
				duration: 5
			});
			this.$router.go(-1);
		},
		async autoSignature() {
			this.signLoading = true;
			try {
				// 合同盖章
				await API_CfcaOrderAutoSignature({
					orderSerialNo: this.$route.query.serialNo,
					cfcaSealList: this.cfcaSealList
				});
				await this.step2();
				// 服务费盖章
				if (this.serviceFeeInfo.url) {
					await autoSignature({ serialNo: this.serviceFeeInfo.serialNo });
				}
				this.$message.success({
					content: '盖章完成',
					duration: 5
				});
				this.$router.push(this.completedRoute);
			} catch (error) {
			} finally {
				this.signLoading = false;
			}
		},
		// 获取确认订单详情
		getSubmitDetail() {
			const queryId = this.$route.query.id;
			if (SaveData.session.get('contract_' + queryId)) {
				this.result = SaveData.session.get('contract_' + queryId);
			} else {
				return;
				this.getRouterType(
					API_SUBMITT_SEND_SEAL,
					API_SUBMIT_RECEIVE_SEAL
				)({
					orderId: queryId
				}).then(res => {
					this.result = res.data;
					SaveData.session.set('contract_' + queryId, this.result);
				});
			}
		},
		async getServiceFeeInfo() {
			const res = await getServiceFeeInfo({ orderNo: this.$route.query.serialNo });
			this.serviceFeeInfo = res.data;
		},
		// 下载
		downPdf() {
			let url = this.BASE_NET + this.result.contractPdfPath;
			if (this.result.commitmentLetterPdfPath) {
				API_DOWNLPREVIEWTEBatchDownLoad({
					contractPdfPath: this.result.contractPdfPath,
					commitmentLetterPdfPath: this.result.commitmentLetterPdfPath
				}).then(res => {
					comDownload(
						res,
						'',
						`${this.VUEX_ST_COMPANYSUER.companyName}煤炭买卖合同 ${moment(new Date()).format('YYYY-MM-DD')}.zip`
					);
				});
			} else {
				API_DOWNLPREVIEWTE(url).then(res => {
					comDownload(res, url, `${this.VUEX_ST_COMPANYSUER.companyName}煤炭买卖合同.pdf`);
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
