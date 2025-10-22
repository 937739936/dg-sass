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
					v-if="result.commitmentLetterPdfPath"
				>
				</a-tab-pane>
				<a-tab-pane
					key="3"
					tab="服务费协议"
					v-if="serviceFeeInfo.url"
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
					v-if="url"
					:url="url"
				></pdf-preview>
			</div>
			<div v-else>
				<p class="loading-pic"><a-spin></a-spin></p>
				<p class="loading-wrap">合同正在生成中，请稍后...</p>
			</div>
		</a-card>
		<div class="slDetailBottom">
			<p>注：点击”确认盖章/驳回“按钮，以上附件将全部确认盖章/驳回</p>
			<div>
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
						@click="cancel"
						>作废</a-button
					>
					<a-button
						type="primary"
						@click.native="sign()"
						>确认盖章</a-button
					>
				</a-space>
			</div>
		</div>
		<SignModal ref="signModal"></SignModal>
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
import CancelModal from '@/v2/center/trade/views/contract/components/CancelModal.vue';
import {
	API_SELLORDERGETTOSIGLIST,
	API_BUYORDERGETTOCONFIRMSIGLIST,
	API_CfcaOrderConfirmAutoSignature,
	API_DOWNLPREVIEWTEBatchDownLoad,
	API_DOWNLPREVIEWTE,
	orderConfirmToSeal,
	API_getConfirmInfo,
	API_confirmAndSealToConfirm,
	API_orderConfirmReject,
	API_SUBMIT_RECEIVE_SEAL,
	API_SUBMITT_SEND_SEAL,
	API_contract_cancel
} from '@/v2/center/trade/api/contract';
import { autoSignature, confirmToSeal, getServiceFeeInfo } from '@/v2/center/financeCenter/api';
import { sign } from '@/v2/utils/sign.js';
import SignModal from '@/v2/components/signModal/index';
import { mapGetters } from 'vuex';
import SpinComponent from '@/v2/components/common/SpinComponent.vue';
import ChooseStamp from '@/v2/components/signModal/chooseStamp';
import comDownload from '@sub/utils/comDownload.js';
import moment from 'moment';
import ENV from '@/v2/config/env';
import breadcrumb from '@/v2/components/breadcrumb/index';
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
			completedRoute: this.$route.query.type === 'BUY' ? '/center/contract/buy/list' : '/center/contract/sell/list',
			// 服务费协议
			serviceFeeInfo: {},
			cfcaSealList: [], // 印模集合
			url: '',
			BASE_NET: ENV.BASE_NET
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
		this.getConfirmDetail();
		this.getServiceFeeInfo();
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
		getRouterType(buyRouter, sellRouter) {
			let Fun = null;
			const routeType = this.$route.query.type?.toLowerCase();
			if (routeType == 'sell') {
				Fun = sellRouter;
			} else if (routeType == 'buy') {
				Fun = buyRouter;
			} else {
				this.$message.error('参数错误');
				return;
			}
			return Fun;
		},
		async autoSignature() {
			this.signLoading = true;
			try {
				await API_CfcaOrderConfirmAutoSignature({
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
		sign() {
			let obj = {
				moduleSealType: 1, //模块编码 1代表贸易合同模块
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
				var that = this;
				const isOrderModule = true;
				that.$confirm({
					centered: true,
					title: '请确认合同信息无误并进行盖章？',
					okText: '确定',
					cancelText: '取消',
					onOk: () => {
						sign.call(
							that,
							that.step1,
							that.step2,
							that.freeUkeySign, // 盖章后回调router
							isOrderModule
						);
					},
					onCancel() {}
				});
			}
		},
		step1(obj) {
			return this.getRouterType(
				API_BUYORDERGETTOCONFIRMSIGLIST,
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
			if (this.$route.query.confirm) {
				return API_confirmAndSealToConfirm(
					Object.assign(
						{
							orderId: this.$route.query.id
						},
						obj
					)
				);
			} else {
				let stampApi = null;
				if (this.isInitiator) {
					stampApi = API_SUBMITT_SEND_SEAL;
				} else {
					stampApi = API_SUBMIT_RECEIVE_SEAL;
				}
				return stampApi(
					Object.assign(
						{
							orderId: this.$route.query.id
						},
						obj
					)
				);
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
			this.$router.push(this.completedRoute);
		},
		// 驳回合同
		rejectContract() {
			if (!this.rejectReason) {
				this.$message.error('驳回原因必填');
				return;
			}
			API_orderConfirmReject({
				orderId: this.$route.query.id,
				rejectReason: this.rejectReason
			}).then(res => {
				if (res.success) {
					this.$router.go(-1);
					this.$message.success('操作成功');
				} else {
					this.$message.error(res.message);
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
		async getServiceFeeInfo() {
			const res = await getServiceFeeInfo({
				orderNo: this.$route.query.serialNo
			});
			this.serviceFeeInfo = res.data;
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
		// 下载
		downPdf() {
			let url = this.BASE_NET + this.result.contractPdfPath;
			if (this.result.commitmentLetterPdfPath || this.serviceFeeInfo.url) {
				API_DOWNLPREVIEWTEBatchDownLoad({
					contractPdfPath: this.result.contractPdfPath,
					commitmentLetterPdfPath: this.result.commitmentLetterPdfPath,
					serviceFeeAgreementPdfPath: this.serviceFeeInfo.url
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
		},
		async confirm() {
			await orderConfirmToSeal(this.$route.query.id);
			this.$message.success('订单已确认，请企业签章员进行盖章操作');
			let that = this;
			setTimeout(() => {
				that.$router.go(-1);
			}, 1000);
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
		border-top: 1px solid #e5e6eb;
		box-sizing: border-box;
		height: 114px;
		position: sticky;
		bottom: 0;
		& > div {
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
		}
		& > p {
			color: #e8372b;
			margin: 20px 0;
			text-align: left;
			padding-left: 30px;
		}
	}
}
</style>
