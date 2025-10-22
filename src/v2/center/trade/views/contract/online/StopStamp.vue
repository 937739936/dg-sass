<template>
	<div>
		<a-row>
			<spin-component
				:active="signLoading"
				text="合同签署中，请稍后..."
			></spin-component>
			<pdf-preview
				v-if="relieveContractPdfPath"
				:url="relieveContractPdfPath"
			></pdf-preview>
			<a-row
				type="flex"
				justify="center"
				style="margin: 50px 0"
			>
				<a-button
					type="primary"
					@click.native="sign"
					style="margin-right: 50px"
					>盖章</a-button
				>
				<a-button
					type="primary"
					@click.native="$router.go(-1)"
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
import {
	API_STOPBUYORDERGETTOSIGLIST,
	API_SUBMITTOCONFIRMSTOPBUYORDER,
	API_CfcaStopOrderAutoSignature
} from '@/v2/center/trade/api/contract';
import { sign } from '@/v2/utils/sign.js';
import SignModal from '@/v2/components/signModal/index';
import { mapGetters } from 'vuex';
import SpinComponent from '@/v2/components/common/SpinComponent.vue';
import ChooseStamp from '@/v2/components/signModal/chooseStamp';
export default {
	data() {
		return {
			signLoading: false,
			relieveContractPdfPath: this.$route.query.relieveContractPdfPath,
			cfcaSealList: [], // 印模集合
			fromPageName: ''
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
		})
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
			API_CfcaStopOrderAutoSignature({
				orderSerialNo: this.$route.query.serialNo,
				terminalContractZzLogId: this.$route.query.logId,
				ccsFlag: this.VUEX_ST_COMPANYSUER.companyType === 'CORE_COMPANY',
				cfcaSealList: this.cfcaSealList
			})
				.then(res => {
					if (res.success) {
						this.step2()
							.then(() => {
								this.$message.success({
									content: '盖章完成',
									duration: 5
								});
								if (this.fromPageName === 'orderSellStop') {
									this.$router.push('/center/contract/sell/list');
								} else if (this.fromPageName === 'orderBuyStop') {
									this.$router.push('/center/contract/buy/list');
								} else {
									this.$router.go(-1);
								}
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
			let obj = {
				industryType: 'COAL', // 行业 COAL代表煤块
				moduleSealType: 3, //模块编码 3代表合同终止模块
				moduleSealTypeDetail: 1 //1盖章 2确定盖章
			};
			this.$refs.chooseStamp.showModal(obj);
		},
		// 盖章订单
		submitSign(cfcaSealList, certModel) {
			this.cfcaSealList = cfcaSealList;
			if (certModel == 'TRUST') {
				this.$refs.signModal.showModal(this.autoSignature);
			} else {
				const that = this;
				if (this.fromPageName === 'orderSellStop') {
					this.completedRoute = '/center/contract/sell/list';
				} else if (this.fromPageName === 'orderBuyStop') {
					this.completedRoute = '/center/contract/buy/list';
				}
				const isOrderModule = true;
				sign.call(that, that.step1, that.step2, that.completedRoute, isOrderModule);
			}
		},
		step1(obj) {
			return this.getRouterType(
				API_STOPBUYORDERGETTOSIGLIST,
				API_STOPBUYORDERGETTOSIGLIST
			)(
				Object.assign(
					{
						orderId: this.$route.query.orderId,
						terminalContractZzLogId: this.$route.query.logId,
						cert: obj.cert,
						cfcaSealList: this.cfcaSealList
					},
					obj
				)
			);
		},
		step2(obj) {
			return this.getRouterType(
				API_SUBMITTOCONFIRMSTOPBUYORDER,
				API_SUBMITTOCONFIRMSTOPBUYORDER
			)(
				Object.assign(
					{
						orderId: this.$route.query.orderId,
						logId: this.$route.query.logId
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
