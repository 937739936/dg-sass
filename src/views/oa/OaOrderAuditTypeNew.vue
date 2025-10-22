<template>
	<div class="oaOrderAudit">
		<div
			class="wrap-center"
			v-if="OAData.OAResultDetail"
		>
			<h3>订单信息</h3>
			<p class="slTitleAssis">买卖方</p>
			<Buy
				v-if="OAData.OAResultDetail.contract.orderType == 'BUY'"
				:isBuyContract="true"
				:isOa="true"
				:orderType="OAData.OAResultDetail.contract.orderType"
				v-on:companyChange="companyChange"
				v-on:loading="isLoadingBuyOrSellData"
				ref="buyAndSell"
			/>
			<!-- 目前销售订单有动力煤1001、焦炭007 -->
			<Sell
				v-else
				:isBuyContract="false"
				:isOa="true"
				:orderType="OAData.OAResultDetail.contract.orderType"
				v-on:companyChange="companyChange"
				v-on:loading="isLoadingBuyOrSellData"
				ref="buyAndSell"
			/>
			<p class="slTitleAssis">基本信息</p>
			<BaseInfo
				:isOa="true"
				:isBuyContract="true"
				:orderType="OAData.OAResultDetail.contract.orderType"
				:canEdit="OAData.canEdit"
				v-on:loading="isLoadingBaseData"
				v-on:setTempleteJsonSuccess="setTempleteJsonSuccess"
				ref="baseInfo"
			/>
			<DiyForm
				:isOa="true"
				:showDiyForm="showDiyForm"
				v-on:clickItem="getClickItem"
				:formSchema="VUEX_GET_FORM_SCHEMA"
				ref="diyForm"
				class="oa-diy-form-wrap"
			/>
			<template v-if="OAData.OAResultDetail.contractPdfUrl">
				<p class="slTitleAssis">附件</p>
				<div style="width: 100px">
					<img
						class="cp"
						style="display: inline-block; width: 100%"
						src="@/assets/imgs/pdf.png"
						@click="openPdf(OAData.OAResultDetail.contractPdfUrl)"
					/>
					<p class="tc mt8">煤炭买卖合同</p>
				</div>
			</template>
			<div
				style="text-align: center"
				v-if="OAData.OAResultDetail.contract.status !== 'AUDITING_RECEIVE'"
			>
				<a-button
					:loading="loadingPreview"
					type="primary"
					@click.native="previewContract"
					style="width: 120px; height: 40px; margin-left: 50px"
					>合同预览</a-button
				>
				<a-button
					:loading="loadingSave"
					type="primary"
					@click.native="handleSubmit"
					style="width: 120px; height: 40px; margin-left: 50px"
					>保存</a-button
				>
			</div>
		</div>
		<div
			v-if="loadingData"
			class="loading-wrap"
		>
			<a-spin />
		</div>
	</div>
</template>
<!-- url路径oAOrderAuditType1?orderId= &companyUserId= -->

<script>
import { mapMutations, mapGetters, mapActions } from 'vuex';
import {
	API_GETOADETAIL,
	API_GETLOGINBYMOBILE,
	API_getPreviewContract,
	API_GETOASUBMITCONTRACT
} from '@/v2/center/trade/api/contract';
import { getPersonalDetail } from '@/v2/utils/factory.js';
import ENV from '@/v2/config/env.js';
import Buy from '@/v2/center/trade/views/contract/components/Buy.vue';
import Sell from '@/v2/center/trade/views/contract/components/Sell.vue';
import BaseInfo from '@/v2/center/trade/views/contract/components/BaseInfo.vue';
import DiyForm from '@/v2/center/trade/views/contract/diy/diyForm.vue';
import getConfigData from '@/v2/center/trade/views/contract/diy/api';
import { cloneDeep } from 'lodash';

export default {
	name: 'OaOrderAudit',
	data() {
		return {
			OAData: {
				canEdit: false, //在oa嵌入的时候，canEdit为true代表财务，可编辑
				updateOAFlag: '', //用于后台判断是否调oa,空不调用，有值就调用
				OAResultDetail: null
			},
			type: '',
			btnDisabled: false,
			isLoadingBuyOrSell: false,
			isLoadingBase: false,
			showDiyForm: false,
			loadingPreview: false,
			loadingSave: false
		};
	},
	created() {
		this.VUEX_AT_GETALLCODE_V2();
		this.VUEX_ST_ORDERCREATEINFO.flag = 'edit';
		//判断是否是财务负责人canEdit，是否调用oaupdateOAFlag
		if (location.href.indexOf('updateOAFlag') != '-1') {
			if (location.href.indexOf('editFlag=') != '-1') {
				let iHref = location.href.split('editFlag=')[1];
				this.OAData.updateOAFlag = iHref.split('&updateOAFlag=')[1];
				this.OAData.canEdit = iHref.split('&updateOAFlag=')[0] == 1 ? true : false;
			}
		} else {
			if (location.href.indexOf('editFlag=') != '-1') {
				this.OAData.canEdit = location.href.split('editFlag=')[1] == 1 ? true : false;
			}
		}
		let orderId = this.$route.query.orderId;
		let companyUserId = this.$route.query.companyUserId;
		if (orderId) {
			API_GETLOGINBYMOBILE({
				orderId,
				companyUserId
			}).then(res => {
				this.VUEX_MU_USERTOKEN(res.token);
				getPersonalDetail(this.getDetail);
			});
		}
	},
	mounted() {
		this.$nextTick(() => {
			document.getElementsByClassName('searchDeliverTrain')[0].style.display = 'none'; // 查询轨迹按钮不展示
		});
	},
	computed: {
		...mapGetters('config', {
			VUEX_ST_ALLCODE: 'VUEX_ST_ALLCODE'
		}),
		...mapGetters('order', {
			VUEX_ST_ORDERCREATEINFO: 'VUEX_ST_ORDERCREATEINFO'
		}),
		...mapGetters('contract', {
			VUEX_GET_FORM_SCHEMA: 'VUEX_GET_FORM_SCHEMA',
			VUEX_GET_CONTRACT_DATA: 'VUEX_GET_CONTRACT_DATA'
		}),
		loadingData() {
			return this.isLoadingBase || this.isLoadingBuyOrSell || !this.showDiyForm;
		}
	},
	components: {
		Buy,
		Sell,
		BaseInfo,
		DiyForm
	},
	methods: {
		...mapActions({
			VUEX_AT_GETALLCODE_V2: 'config/VUEX_AT_GETALLCODE'
		}),
		...mapMutations({
			VUEX_MU_USERTOKEN: 'user/VUEX_MU_USERTOKEN',
			VUEX_MU_ORDERCREATEINFO: 'order/VUEX_MU_ORDERCREATEINFO',
			VUEX_SET_CONTRACT_OTHER_DATA: 'contract/VUEX_SET_CONTRACT_OTHER_DATA'
		}),
		formatArrayToString(obj) {
			for (const key in obj) {
				if (obj[key] && Array.isArray(obj[key])) {
					obj[key] = obj[key].join(',');
				}
			}
		},
		setTempleteJsonSuccess(val) {
			this.showDiyForm = true;
			this.$refs.diyForm && this.$refs.diyForm.initFormData();
		},
		isLoadingBaseData(flag) {
			this.isLoadingBase = flag;
		},
		isLoadingBuyOrSellData(flag) {
			this.isLoadingBuyOrSell = flag;
		},
		checkValues() {
			const tempList = [this.$refs.buyAndSell.handleSubmit(), this.$refs.baseInfo.handleSubmit(), this.$refs.diyForm.submit()];
			return Promise.all(tempList);
		},
		getClickItem(item) {
			getConfigData(item);
		},
		companyChange(id) {
			this.$nextTick(() => {
				this.$refs.baseInfo.getBankDataList(id);
			});
		},
		openPdf(url) {
			window.open(url, '_blank');
		},
		getDetail() {
			this.isLoadingBaseData(true);
			API_GETOADETAIL({ orderId: this.$route.query.orderId }).then(res => {
				if (res.success) {
					res.data.contract.upstreamSignCompanyName = res.data.contract.downstreamSignCompanyName;
					res.data.contractExtension.downstreamSignCompanyName = res.data.contract.downstreamSignCompanyName;
					res.data.contractDelivery.deliveryDate = [
						res.data.contractDelivery.deliveryStartDate,
						res.data.contractDelivery.deliveryEndDate
					];
					// res.data.productIndicator = res.data.productIndicatorObj;
					const productIndicator = {};
					(res.data.orderIndicators || []).forEach(item => {
						item.excludeTaxBasePrice = (item.excludeTaxBasePrice / 1.13).toFixed(2);
						if (item.productIndicatorList) {
							item.productIndicatorList.forEach(items => {
								if (items.inputType == 'RANGE') {
									items.valueList = {
										[`${items.indicatorCode}_value1`]: items.value1,
										[`${items.indicatorCode}_value2`]: items.value2
									};
								} else {
									items.valueList = {
										[`${items.indicatorCode}_symbol`]: items.symbol,
										[`${items.indicatorCode}_value1`]: items.value1
									};
								}
							});
						}
					});
					res.data.productIndicator = { ...productIndicator };
					[
						'trainSendStationName',
						'trainArriveStationName',
						'shipLoadingPortName',
						'shipDischargingPortName',
						'consignorCompanyName',
						'consigneeCompanyName',
						'shipperName'
					].forEach(key => {
						const value = res.data.contractDelivery[key];
						res.data.contractDelivery[key] = value ? value.split(',') : [];
					});

					if (!res.data.contract.linkOrderNo) {
						res.data.contract.relateOrder = true;
					}
					this.OAData.OAResultDetail = res.data;
					this.VUEX_SET_CONTRACT_OTHER_DATA(res.data);
					this.$nextTick(async () => {
						await this.$refs.buyAndSell.initFormData();
						await this.$refs.baseInfo.initFormData();
						this.$refs.diyForm.initFormData();
					});
				}
			});
		},
		formateOrderIndicators(orderIndicators) {
			let cloneObj = cloneDeep(orderIndicators);
			cloneObj.forEach(item => {
				if (item.productIndicatorList) {
					item.productIndicatorList.forEach(items => {
						if (items.inputType == 'RANGE') {
							items.value1 = items.valueList[items.indicatorCode + '_value1'];
							items.value2 = items.valueList[items.indicatorCode + '_value2'];
						} else {
							// items.value2 = items.symbol == '无符号' ? null : items.symbol;
							items.value1 = items.valueList[items.indicatorCode + '_value1'];
						}
					});
				}
			});
			return cloneObj;
		},
		async handleSubmit() {
			// 提交
			const res = await this.checkValues();
			if (res.flat().includes(false)) return;
			this.loadingSave = true;
			this.type = 'submit';
			const clone_VUEX_GET_CONTRACT_DATA = cloneDeep(this.VUEX_GET_CONTRACT_DATA);
			this.formatArrayToString(clone_VUEX_GET_CONTRACT_DATA.contractDelivery);
			API_GETOASUBMITCONTRACT({
				orderId: this.VUEX_GET_CONTRACT_DATA.contract.id,
				...clone_VUEX_GET_CONTRACT_DATA,
				contract: {
					orderType: this.$route.query.type,
					...clone_VUEX_GET_CONTRACT_DATA?.acceptUser,
					...clone_VUEX_GET_CONTRACT_DATA?.contract
				},
				contractDelivery: {
					...clone_VUEX_GET_CONTRACT_DATA?.contract,
					...clone_VUEX_GET_CONTRACT_DATA?.contractDelivery
				},
				orderIndicators: this.formateOrderIndicators(clone_VUEX_GET_CONTRACT_DATA.orderIndicators)
				// productIndicatorJsonStr: clone_VUEX_GET_CONTRACT_DATA?.productIndicator ? JSON.stringify(clone_VUEX_GET_CONTRACT_DATA?.productIndicator) : null
			})
				.then(res => {
					if (res.success) {
						this.$message.success('操作成功');
					}
				})
				.finally(() => {
					this.loadingSave = false;
				});
		},
		async previewContract() {
			// 预览合同
			await this.$refs.buyAndSell.handleSubmit();
			await this.$refs.baseInfo.handleSubmit();
			await this.$refs.diyForm.submit();
			this.loadingPreview = true;
			const clone_VUEX_GET_CONTRACT_DATA = cloneDeep(this.VUEX_GET_CONTRACT_DATA);
			this.formatArrayToString(clone_VUEX_GET_CONTRACT_DATA.contractDelivery);
			API_getPreviewContract({
				orderId: this.VUEX_GET_CONTRACT_DATA.contract.id,
				...clone_VUEX_GET_CONTRACT_DATA,
				contract: {
					orderType: this.$route.query.type,
					...clone_VUEX_GET_CONTRACT_DATA.acceptUser,
					...clone_VUEX_GET_CONTRACT_DATA.contract
				},
				contractDelivery: {
					...clone_VUEX_GET_CONTRACT_DATA.contract,
					...clone_VUEX_GET_CONTRACT_DATA.contractDelivery
				},
				orderIndicators: this.formateOrderIndicators(clone_VUEX_GET_CONTRACT_DATA.orderIndicators)
				// productIndicatorJsonStr: this.VUEX_GET_CONTRACT_DATA.productIndicator ? JSON.stringify(this.VUEX_GET_CONTRACT_DATA.productIndicator) : null
			})
				.then(res => {
					if (res.success) {
						window.open(`${res.data.contractPdfPath}`, '_blank');
					}
				})
				.finally(() => {
					this.loadingPreview = false;
				});
		},
		btnFlag(data) {
			this.btnDisabled = data;
		}
	}
};
</script>

<style lang="less">
::-webkit-scrollbar {
	width: 6px;
	height: 6px;
}
.oaOrderAudit {
	width: 100vw;
	overflow: hidden;
	position: relative;
	.loading-wrap {
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		position: absolute;
		top: 0;
		left: 0;
	}
	.wrap-center {
		width: 1200px;
		margin: 30px auto;
		border: 1px solid #ddd;
		padding: 20px 30px;
		box-sizing: border-box;
		.slTitleAssis {
			margin: 20px 0;
			font-size: 16px;
			font-family:
				PingFangSC-Medium,
				PingFang SC;
			font-weight: 500;
			color: rgba(0, 0, 0, 0.8);
			line-height: 24px;
			padding-left: 16px;
			position: relative;
		}
		.slTitleAssis::before {
			position: absolute;
			content: '';
			width: 2px;
			height: 16px;
			top: 0;
			bottom: 0;
			margin: auto;
			border-radius: 2px 0 0 2px;
			left: 0px;
			background: #4682f3;
		}
		h3 {
			margin: 30px 0px;
			border-left: 2px solid rgb(24, 144, 255);
			padding-left: 10px;
		}
	}
	.input-quality-percent {
		padding-top: 30px;
	}
}
.oa-diy-form-wrap {
	.slFormDetailDiy {
		.form-item-normal {
			.ant-form-item-children {
				.ant-select-selection--multiple {
					height: 32px !important;
					.ant-select-selection__rendered {
						height: 32px !important;
					}
				}
			}
		}
	}
}
#app {
	width: 100vw;
	height: 100vh;
	overflow: hidden;
	overflow-y: auto;
}
#wangeditor {
	overflow: hidden;
}
</style>
