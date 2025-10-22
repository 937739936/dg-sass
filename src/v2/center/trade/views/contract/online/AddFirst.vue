<template>
	<div class="slMain">
		<breadcrumb></breadcrumb>
		<a-card
			:bordered="false"
			class="content"
		>
			<div
				slot="title"
				class="slTitle"
			>
				<span>{{ this.typeName }}</span>
				<span
					class="slTitleButton"
					@click="copyContract"
					>复制合同</span
				>
			</div>
			<!-- 二级标题 -->
			<div>
				<div class="slTitleAssis">买卖方</div>
				<Buy
					v-if="isBuyContract"
					ref="buyAndSell"
					:isBuyContract="true"
					v-on:companyChange="companyChange"
					v-on:loading="isLoadingBuyOrSellData"
					@getRequiredFlag="getRequiredFlag"
				/>
				<Sell
					v-else
					ref="buyAndSell"
					:isBuyContract="false"
					v-on:companyChange="companyChange"
					v-on:loading="isLoadingBuyOrSellData"
					@getRequiredFlag="getRequiredFlag"
				/>
				<div
					class="slTitleAssis"
					style="margin-top: 10px"
				>
					基本信息
				</div>
				<BaseInfo
					ref="baseInfo"
					:isBuyContract="isBuyContract"
					v-on:loading="isLoadingBaseData"
					:orderType="$route.query.type"
					v-on:businessTypeChange="businessTypeChange"
					:requiredFlag="requiredFlag"
				/>
				<template v-if="isOa">
					<div class="slTitleAssis">审批流</div>
					<WorkFlow ref="workFlow" />
				</template>
			</div>
			<div
				v-if="loadingData"
				class="loading-wrap"
			>
				<a-spin />
			</div>
			<div class="slDetailBottom">
				<a-space :size="30">
					<a-button
						type="primary"
						ghost
						@click="cancel"
						>取消</a-button
					>
					<a-button
						type="primary"
						:disabled="loadingData"
						:loading="loadingNext"
						@click="next"
						>下一步</a-button
					>
				</a-space>
			</div>
			<!-- 复制合同 -->
			<CopyContract
				ref="copyContract"
				v-on:rowSelect="id => getContractDetails(1, id)"
				:contractNo="contractNo"
			/>
			<BaseModal
				title="创建合同失败!"
				ref="baseModal"
				:reasons="reasons"
			></BaseModal>
		</a-card>
	</div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import breadcrumb from '@/v2/components/breadcrumb/index';
import Buy from '@/v2/center/trade/views/contract/components/Buy.vue';
import Sell from '@/v2/center/trade/views/contract/components/Sell.vue';
import BaseInfo from '@/v2/center/trade/views/contract/components/BaseInfo.vue';
import WorkFlow from '@/v2/center/trade/views/contract/components/WorkFlow.vue';
import CopyContract from '@/v2/center/trade/views/contract/components/CopyContract.vue';
import { API_COMPANYOACHECK } from '@/v2/center/trade/api/goodsTransfer';
import { API_getModifyInfo, checkCompanyChange } from '@/v2/center/trade/api/contract';
import { cloneDeep } from 'lodash';
import BaseModal from '@/v2/components/signModal/BaseModal.vue';
import { convertCurrency } from '@/v2/utils/factory.js';

export default {
	name: 'ContractOnLineAddFirst',
	data() {
		return {
			contractType: this.$route.query.type, //补录合同类型，
			isOa: false,
			isLoadingBuyOrSell: false,
			isLoadingBase: false,
			isLoadingCopyData: false,
			customCount: undefined,
			loadingNext: false,
			requiredFlag: false,
			reasons: []
		};
	},
	components: {
		breadcrumb,
		Buy,
		Sell,
		BaseInfo,
		WorkFlow,
		CopyContract,
		BaseModal
	},
	async created() {},
	mounted() {
		this.checkIsOa();
		if (this.routeType === 'edit') {
			this.getContractDetails(2, this.$route.query.id);
		}
		this.handleScroll();
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		...mapGetters('contract', {
			VUEX_GET_CONTRACT_DATA: 'VUEX_GET_CONTRACT_DATA',
			VUEX_GET_FORM_SCHEMA: 'VUEX_GET_FORM_SCHEMA',
			VUEX_GET_PRODUCTION_INDICATOR: 'VUEX_GET_PRODUCTION_INDICATOR'
		}),
		contractNo() {
			return this.$route.query.contractNo || '';
		},
		//合同名称
		typeName() {
			const editType = this.$route.query.id ? '编辑' : '新增';
			const orderType = this.contractType?.toUpperCase() === 'BUY' ? '采购' : '销售';
			return `${editType}电子${orderType}合同`;
		},
		isBuyContract() {
			return this.contractType?.toUpperCase() === 'BUY';
		},
		routeType() {
			return this.$route.query.flag;
		},
		loadingData() {
			return this.isLoadingBase || this.isLoadingBuyOrSell || this.isLoadingCopyData;
		},
		isHuaTai() {
			return ['STEAM_COAL_018', 'COKING_COAL_008', 'COKING_012', 'SEMI_COKE_007', 'SMOKELESS_COAL_007', 'INJECTION_COAL_007'].includes(this.VUEX_GET_CONTRACT_DATA?.contract?.contractTemplateName || '');
		}
	},
	methods: {
		convertCurrency,
		getRequiredFlag(data) {
			this.requiredFlag = data;
		},
		businessTypeChange(type) {
			this.$refs.buyAndSell?.updateBusinessType(type);
		},
		getConfigProductIndicatorRequired() {
			const tempList = this.VUEX_GET_PRODUCTION_INDICATOR.filter(item => item.nullable);
			const valuesObj = {};
			tempList.forEach(item => {
				if (item.inputType == 'RANGE') {
					valuesObj[`${item.indicatorCode}_value2`] = null;
					valuesObj[`${item.indicatorCode}_value1`] = null;
				} else {
					valuesObj[`${item.indicatorCode}_value1`] = null;
					if (item.symbolList) {
						valuesObj[`${item.indicatorCode}_symbol`] = item.symbol || undefined;
					}
				}
			});
			const tempObj = cloneDeep(this.VUEX_GET_CONTRACT_DATA);
			if (tempObj.productIndicator) {
				for (const key in valuesObj) {
					if (!tempObj.productIndicator[key]) {
						tempObj.productIndicator[key] = undefined;
					}
				}
			}
			this.VUEX_SET_CONTRACT_OTHER_DATA(tempObj);
		},
		// fixed随页面滚动
		handleScroll() {
			this.$nextTick(() => {
				var thead = document.querySelector('.slDetailBottom');
				var lw = document.querySelector('#app');
				lw.addEventListener('scroll', function () {
					var sl = 228 - lw.scrollLeft;
					thead.style.left = sl + 'px';
				});
			});
		},
		...mapMutations({
			VUEX_SET_CONTRACT_OTHER_DATA: 'contract/VUEX_SET_CONTRACT_OTHER_DATA',
			VUEX_SET_PRODUCTION_INDICATOR: 'contract/VUEX_SET_PRODUCTION_INDICATOR',
			VUEX_UPDATE_CONTRACT_DATA: 'contract/VUEX_UPDATE_CONTRACT_DATA',
			VUEX_SET_MAP_CONFIG: 'contract/VUEX_SET_MAP_CONFIG',
			VUEX_SET_CONTRACT_DATA: 'contract/VUEX_SET_CONTRACT_DATA',
			VUEX_SET_UPDATE_INDICATOR: 'contract/VUEX_SET_UPDATE_INDICATOR'
		}),
		isLoadingBuyOrSellData(flag) {
			this.isLoadingBuyOrSell = flag;
		},
		isLoadingBaseData(flag) {
			this.isLoadingBase = flag;
		},
		companyChange(id) {
			this.$nextTick(() => {
				this.$refs.baseInfo.getBankDataList(id);
			});
		},
		//表单数据变化
		onValuesChange(props, values) {
			console.error(props, values);
		},
		cancel() {
			if (this.isBuyContract) {
				this.$router.replace({
					path: '/center/contract/buy/list'
				});
			} else {
				this.$router.replace({
					path: '/center/contract/sell/list'
				});
			}
		},
		async next() {
			const tempList = [this.$refs.buyAndSell.handleSubmit(), this.$refs.baseInfo.handleSubmit()];

			this.loadingNext = true;

			if (this.$refs.workFlow) {
				tempList.push(this.$refs.workFlow.handleSubmit());
			}
			Promise.all(tempList)
				.then(async res => {
					if (!res.includes(false)) {
						const params = {
							customer:
								this.$route.query.type == 'BUY'
									? this.VUEX_GET_CONTRACT_DATA.contract.sellerCompanyUscc
									: this.VUEX_GET_CONTRACT_DATA.contract.buyCompanyUscc
						};
						const checkRes = await checkCompanyChange(params);
						this.reasons = checkRes.data.reasons || [];

						if (!checkRes.data.result) {
							this.$refs.baseModal.showModal();
							return;
						}
						// 该模板没有基准质量指标
						if (['STEAM_COAL_1001'].includes(this.VUEX_GET_CONTRACT_DATA.contract.contractTemplateName)) {
							this.VUEX_SET_MAP_CONFIG();
						}
						this.getConfigProductIndicatorRequired();
						// 复制合同
						if (this.VUEX_GET_CONTRACT_DATA.contract.copyFlag || this.routeType === 'edit') {
							// 当前合同模版是否支持多品类
							let currentMultiGoodsNameSupportFlag = Boolean(this.VUEX_GET_CONTRACT_DATA.contract.multiGoodsNameSupportFlag);
							// 之前的合同模版指标是否是多品类
							let beforeMultiGoodsNameFlag = Boolean(this.VUEX_GET_CONTRACT_DATA.contract?.multiGoodsNameFlag);
							// 复制合同指标为多品类，当前合同模版不支持单/多切换，则不复制指标。
							if (beforeMultiGoodsNameFlag && !currentMultiGoodsNameSupportFlag) {
								this.VUEX_SET_CONTRACT_DATA({
									field: 'contract',
									values: {
										multiGoodsNameFlag: 0
									}
								});
								this.VUEX_SET_UPDATE_INDICATOR([]);
							}
							//  复制合同指标为单品类或不支持单/多切换，当前合同模版支持单/多切换，则不复制指标。
							if (!beforeMultiGoodsNameFlag && currentMultiGoodsNameSupportFlag) {
								this.VUEX_SET_UPDATE_INDICATOR([]);
							}
						}
						// multiGoodsNameFlag默认值为0
						this.VUEX_SET_CONTRACT_DATA({
							field: 'contract',
							values: {
								multiGoodsNameFlag: this.VUEX_GET_CONTRACT_DATA.contract?.multiGoodsNameFlag || 0
							}
						});
						// 是否是华泰专用模版
						let quantityVal = this.VUEX_GET_CONTRACT_DATA?.contract?.quantity || 0
						let basePriceVal = this.VUEX_GET_CONTRACT_DATA?.contract?.basePrice || 0
						if (this.isHuaTai && quantityVal && basePriceVal) {
							this.VUEX_SET_CONTRACT_DATA({
								field: 'contract',
								values: {
									unitPriceExcludeTax: (basePriceVal / 1.13).toFixed(2),
									totalAmountExcludeTax: (basePriceVal * quantityVal / 1.13).toFixed(2),
									totalAmountExcludeTaxChinese: convertCurrency((basePriceVal * quantityVal / 1.13).toFixed(2)),
									totalAmountIncludeTax: (basePriceVal * quantityVal).toFixed(2),
									totalAmountIncludeTaxChinese: convertCurrency((basePriceVal * quantityVal).toFixed(2))
								}
							})
						}
		
						this.$router.push({
							path: `/center/contract/${this.$route.query?.type?.toLowerCase()}/online/add/step2`,
							query: {
								type: this.$route.query.type,
								flag: this.$route.query.flag,
								id: this.$route.query.id
							}
						});
					}
				})
				.finally(() => {
					this.loadingNext = false;
				});
		},
		// 复制合同，修改模板，需要对返回值过滤
		formDataValuesFilters() {
			const formData = cloneDeep(this.VUEX_GET_CONTRACT_DATA);
			const formList = this.VUEX_GET_FORM_SCHEMA.formList;
			const contractExtensionKeys = formList.contractExtension.map(item => item.label);
			const commitmentKeys = formList.commitment.map(item => item.label);
			const qualityKeys = formList.quality.map(item => item.label);
			const transportationKeys = formList.transportation.map(item => item.label);
			const qualityKeysAndTransportationKeys = qualityKeys.concat(transportationKeys);
			const commitmentKeysAndcontractExtensionKeys = commitmentKeys.concat(contractExtensionKeys);
			for (const key in formData.contractExtension) {
				if (!commitmentKeysAndcontractExtensionKeys.includes(key)) {
					delete formData.contractExtension[key];
				}
			}
			const keys = ['depositAmount'];
			keys.forEach(item => {
				if (!qualityKeysAndTransportationKeys.includes(item)) {
					delete formData.contract[item];
				}
			});
			if (formData.contractExtension) {
				formData.contractExtension.customCount = this.VUEX_GET_CONTRACT_DATA.contractExtension?.customCount || this.customCount;
			}
			this.VUEX_UPDATE_CONTRACT_DATA(formData);
		},
		// 复制合同
		copyContract() {
			this.$refs.copyContract.showModal();
		},
		checkIsOa() {
			API_COMPANYOACHECK({ uscc: this.VUEX_ST_COMPANYSUER.companyUscc }).then(res => {
				if (res.success) {
					this.isOa = res.result;
				}
			});
		},
		getContractDetails(type, id) {
			if (!id) return;
			this.isLoadingCopyData = true;
			API_getModifyInfo({
				orderId: id,
				orderType: 'ONLINE'
			})
				.then(res => {

					if (res.success) {
						if ((type == 1 && res.data?.contract?.auditChainAndOperator) || !this.isOa) {
							delete res.data.contract.auditChainAndOperator;
						}
						// 复制合同删除字段
						if (type == 1) {
							delete res?.data?.contract?.contractBothSignTime;
							delete res?.data?.contract?.completeDate;
							delete res?.data?.contract?.contractTermType;
							res.data.contract.copyFlag = true;
						} else {
							res.data.contract.copyFlag = false;
						}

						this.businessTypeChange(res.data.contract?.businessType);
						res.data.contract.upstreamSignCompanyName = res.data.contract.downstreamSignCompanyName;
						res.data.contract.depositAmount = res.data.contract.depositAmount || 0;
						// res.data.contractExtension.upstreamSignCompanyName = res.data.contract.downstreamSignCompanyName;
						res.data.contractExtension.downstreamSignCompanyName = res.data.contract.downstreamSignCompanyName;
						const productIndicator = {};
						(res.data.orderIndicators || []).forEach(item => {
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
						const contractDelivery = res.data.contractDelivery;
						res.data.contractDelivery.deliveryDate = [contractDelivery.deliveryStartDate, contractDelivery.deliveryEndDate];
						[
							'trainSendStationName',
							'trainArriveStationName',
							'shipLoadingPortName',
							'shipDischargingPortName',
							'consignorCompanyName',
							'consigneeCompanyName',
							'shipperName'
						].forEach(key => {
							const value = contractDelivery[key];
							res.data.contractDelivery[key] = value ? value.split(',') : [];
						});

						// delete res.data.productIndicatorObj;
						if (type == 1) {
							delete res.data?.contract?.id;
							delete res.data?.acceptUser?.id;
							// 复制合同默认 是不关联业务线
							res.data.contract.relateOrderNo = null;
							res.data.contract.relatedContractReqList = []
						}
						if (!res.data?.contract?.relatedContractReqList || !res.data?.contract?.relatedContractReqList?.length) {
							res.data.contract.relateOrder = true;
						} else  {
							res.data.contract.relateOrder = false;
						}

						if (!res.data?.contractExtension?.customCount) {
							res.data.contractExtension.customCount = undefined;
						}
						// 如果不是从创建订单第二步返回的 或者是复制订单
						if (!this.$route.query.back || type == 1) {
							
							this.VUEX_SET_CONTRACT_OTHER_DATA(res.data);
						}
						this.$refs.baseInfo.initFormData(type);
						this.$refs.buyAndSell.initFormData();
						if (this.$refs.workFlow) {
							this.$refs.workFlow.getOaDataList();
						}
						this.customCount = res.data.contractExtension?.customCount;
					}
				})
				.finally(() => {
					this.isLoadingCopyData = false;
				});
		}
	}
};
</script>
<style lang="less" scoped>
.slMain {
	position: relative;
	min-height: calc(100vh - 64px);
	background: #fff;
}
.mb0 {
	margin-bottom: 0;
}
.loading-wrap {
	width: 100%;
	// height: 694px;
	display: flex;
	justify-content: center;
	align-items: center;
	position: absolute;
	padding-top: 200px;
	top: 0;
	left: 0;
}
// .content {
//   height: 694px;
// }
.slDetailBottom {
	width: calc(100vw - 254px);
	min-width: 1186px;
	height: 64px;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	border-top: 1px solid #e5e6eb;
	box-sizing: border-box;
	position: fixed;
	bottom: 0;
	left: 228px;
}
</style>
