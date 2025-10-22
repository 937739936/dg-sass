<template>
	<div
		class="thymeleaf-wrap"
		id="thymeleafWrap"
	>
		<p class="line"></p>
		<!-- <p class="title-wrap"><strong v-if="showCoalTitle">{{VUEX_GET_CONTRACT_DATA.contract.contractName}}</strong></p> -->
		<div
			v-html="templeteData"
			id="thymeleafContentWrap"
		></div>
	</div>
</template>

<script>
const tableColumnNum = 6;
const toUpcaseTemplateEnum = [
	'STEAM_COAL_012',
	'COKING_000',
	'COKING_COAL_000',
	'SEMI_COKE_000',
	'SMOKELESS_COAL_000',
	'INJECTION_COAL_000',
	'STEAM_COAL_018', 
	'COKING_COAL_008', 
	'COKING_012', 
	'SEMI_COKE_007', 
	'SMOKELESS_COAL_007', 
	'INJECTION_COAL_007'
];
import { TemplateEngine, StandardDialect } from 'thymeleaf';
import { mapGetters } from 'vuex';
import { throttle, cloneDeep } from 'lodash';
import moment from 'moment';
import { numToCnMap } from '../utils/index';

let templateEngine = new TemplateEngine({
	dialects: [
		new StandardDialect('th', {
			// Enable isomorphic mode with this config object
			prefix: 'thjs'
		})
	]
});
export default {
	props: {
		content: {
			type: String,
			default: ''
		},
		showCoalTitle: {
			type: Boolean,
			default: true
		},
		multiGoodsNameFlag: {
			type: Number,
			default: 0
		}
	},
	data() {
		return {
			templeteData: '',
			str: '',
			customCountAttrList: {},
			replaceElem: {},
			thymeleafContentNode: [],
			thymeleafScrollHeight: 0
		};
	},
	watch: {
		VUEX_GET_CONTRACT_DATA: {
			handler() {
				this.throttleHandler();
			},
			deep: true,
			immediate: true
		},
		VUEX_GET_OPTIONS_LIST: {
			handler() {
				this.throttleHandler();
			},
			deep: true,
			immediate: true
		},
		VUE_GET_PRODUCT_INDICATOR: {
			handler() {
				this.$nextTick(() => {
					if (this.multiGoodsNameFlag) {
						this.scrollIntoView('table-template');
					} else {
						this.scrollIntoView('indicatorList');
					}
				});
			},
			deep: true,
			immediate: true
		}
	},
	computed: {
		...mapGetters('contract', {
			VUEX_GET_CONTRACT_DATA: 'VUEX_GET_CONTRACT_DATA',
			VUEX_GET_THYMELEAF_CONTENT: 'VUEX_GET_THYMELEAF_CONTENT',
			VUEX_GET_PRODUCTION_INDICATOR: 'VUEX_GET_PRODUCTION_INDICATOR',
			VUEX_GET_OPTIONS_LIST: 'VUEX_GET_OPTIONS_LIST',
			VUE_GET_HTML_REPLACE_ATTR: 'VUE_GET_HTML_REPLACE_ATTR',
			VUE_GET_PRODUCT_INDICATOR: 'VUE_GET_PRODUCT_INDICATOR',
			VUEX_GET_CONTRACT_BOOLEAN: 'VUEX_GET_CONTRACT_BOOLEAN',
			VUEX_GET_PRODUCTION_INDICATOR_SELECT: 'VUEX_GET_PRODUCTION_INDICATOR_SELECT'
		}),
		// 是否是华泰专用模版
		isHuaTai() {
			return ['STEAM_COAL_018', 'COKING_COAL_008', 'COKING_012', 'SEMI_COKE_007', 'SMOKELESS_COAL_007', 'INJECTION_COAL_007'].includes(this.VUEX_GET_CONTRACT_DATA?.contract?.contractTemplateName || '');
		}
	},
	mounted() {},
	methods: {
		scrollIntoView(id) {
			// 基准质量指标多品类时，定位特殊处理
			if (this.multiGoodsNameFlag) {
				const elem = document.querySelector(`.${id}`);
				if (elem) {
					const child = elem.children;
					if (child) {
						// index代表第几个品类，type="info","indicator"代表操作的是信息、指标
						const selectProductIndicator = this.VUEX_GET_PRODUCTION_INDICATOR_SELECT;
						const target = child[selectProductIndicator.index];
						if (target && selectProductIndicator) {
							const scrollHeight = selectProductIndicator.type === 'info' ? target.offsetTop - 50 : target.offsetTop + 100;
							if (scrollHeight > 0) {
								document.querySelector('#thymeleafWrap').scrollTop = scrollHeight;
							} else {
								document.querySelector('#thymeleafWrap').scrollTop = document.querySelector('#thymeleafContentWrap').offsetHeight;
							}
						}
					}
				}
			} else {
				const elem = document.querySelector(`#${id}`);
				if (elem) {
					this.$nextTick(() => {
						if (this.isHuaTai && (id === 'basePrice' || id == 'quantity' || id == 'goodsName')) {
							document.querySelector('#thymeleafWrap').scrollTop = 230;
							return;
						}
						if (id == 'signTime') {
							document.querySelector('#thymeleafWrap').scrollTop = 0;
							return;
						}
						if (id == 'goodsName') {
							document.querySelector('#thymeleafWrap').scrollTop = 160;
							return;
						}
						if (id == 'quantity' || id == 'quantityOffset') {
							document.querySelector('#thymeleafWrap').scrollTop = 200;
							return;
						}
						const scrollHeight = elem.offsetTop - 50;
						if (scrollHeight > 0) {
							document.querySelector('#thymeleafWrap').scrollTop = elem.offsetTop - 50;
						} else {
							document.querySelector('#thymeleafWrap').scrollTop = document.querySelector('#thymeleafContentWrap').offsetHeight;
						}
					});
				}
			}
		},
		throttleHandler: throttle(function () {
			this.refreshTemplete(this.content);
		}, 500),
		formatArrayToString(obj) {
			for (const key in obj) {
				if (obj[key] && Array.isArray(obj[key])) {
					obj[key] = obj[key].join(',');
				}
			}
		},
		refreshTemplete(str) {
			const clone_VUEX_GET_CONTRACT_DATA = cloneDeep(this.VUEX_GET_CONTRACT_DATA);
			this.formatArrayToString(clone_VUEX_GET_CONTRACT_DATA.contractDelivery);
			const signDate =
				clone_VUEX_GET_CONTRACT_DATA?.contract?.signTime || clone_VUEX_GET_CONTRACT_DATA?.contractDelivery?.signTime;
			const deliveryStartDate =
				clone_VUEX_GET_CONTRACT_DATA?.contract?.deliveryStartDate ||
				clone_VUEX_GET_CONTRACT_DATA?.contractDelivery?.deliveryStartDate;
			const deliveryEndDate =
				clone_VUEX_GET_CONTRACT_DATA?.contract?.deliveryEndDate ||
				clone_VUEX_GET_CONTRACT_DATA?.contractDelivery?.deliveryEndDate;
			const customCountValue = {};
			const transformBoolean = {};
			for (const key in this.VUE_GET_HTML_REPLACE_ATTR) {
				const numberDefault = key.split('_');
				customCountValue[key] = (clone_VUEX_GET_CONTRACT_DATA?.contractExtension?.customCount || 0) + Number(numberDefault[1]);
				if (this.isHuaTai) {
					customCountValue[key] = (clone_VUEX_GET_CONTRACT_DATA?.contractExtension?.customCount || 1) + Number(numberDefault[1]);
				}
			}
			const targetObj = this.VUEX_GET_CONTRACT_DATA?.contractDelivery || {}
			let keyArr = [] // this.VUEX_GET_CONTRACT_DATA?.contractDelivery中的所有key
			if (JSON.stringify(targetObj) !== "{}") {
				for (const key in targetObj) {
					keyArr.push(key)
				}
			}
			for (const key in this.VUEX_GET_CONTRACT_BOOLEAN) {
				let value = null
				// 判断this.VUEX_GET_CONTRACT_DATA?.contractDelivery中是否有key
				if (keyArr.includes(key)) {
					value = this.VUEX_GET_CONTRACT_DATA?.contractDelivery[key];
				}
				let flag = false;
				if (Array.isArray(value)) {
					if (value.length > 0) {
						flag = true;
					} else {
						flag = false;
					}
				} else {
					flag = value ? true : false;
				}
				transformBoolean[`${key}Boolean`] = flag;
			}
			if (toUpcaseTemplateEnum.includes(this.VUEX_GET_CONTRACT_DATA?.contract?.contractTemplateName)) {
				for (const key in customCountValue) {
					if (key.indexOf('Cn') >= 0) {
						customCountValue[key] = numToCnMap[customCountValue[key]];
					}
				}
			}
			let indicatorList = this.formateIndicatorList();
			templateEngine
				.process(str, {
					isMultiGoodsName: Boolean(this.multiGoodsNameFlag),
					...transformBoolean,
					...customCountValue,
					...clone_VUEX_GET_CONTRACT_DATA,
					...clone_VUEX_GET_CONTRACT_DATA.contractDelivery,
					...clone_VUEX_GET_CONTRACT_DATA.acceptUser,
					...clone_VUEX_GET_CONTRACT_DATA.contract,
					...clone_VUEX_GET_CONTRACT_DATA.contractExtension,
					indicatorList: indicatorList,
					indicatorStr:
						indicatorList
							?.flat()
							?.map(item => item.name + '：' + item.value)
							?.join('，') + ' ',
					indicatorExists: indicatorList.length > 0,
					downstreamSignCompanyName:
						this.VUEX_GET_CONTRACT_DATA?.contractExtension?.downstreamSignCompanyName ||
						this.VUEX_GET_CONTRACT_DATA?.contractExtension?.upstreamSignCompanyName,
					otherAppointHtmlStr:
						this.VUEX_GET_CONTRACT_DATA?.contractExtension?.otherAppointHtmlStr ||
						this.VUEX_GET_CONTRACT_DATA?.contractExtension?.downstreamOtherAppointHtml,
					isQuantityOffsetEmpty: this.VUEX_GET_CONTRACT_DATA?.contract?.quantityOffset ? false : true,
					isTrain: this.VUEX_GET_CONTRACT_DATA?.contractDelivery?.transportMode === 'TRAIN',
					isAutomobile: this.VUEX_GET_CONTRACT_DATA?.contractDelivery?.transportMode === 'AUTOMOBILE',
					isShip: this.VUEX_GET_CONTRACT_DATA?.contractDelivery?.transportMode === 'SHIP',
					isAutomobileAndTrain: this.VUEX_GET_CONTRACT_DATA?.contractDelivery?.transportMode === 'AUTOMOBILE_AND_TRAIN',
					isFreightPayModeOther: this.VUEX_GET_CONTRACT_DATA?.contractDelivery?.freightPayMode === 'OTHER',
					isDeliveryModeOther: this.VUEX_GET_CONTRACT_DATA?.contractDelivery?.deliveryMode === 'OTHER',
					isPlaceGoodsTransfer: this.VUEX_GET_CONTRACT_DATA?.contractDelivery?.deliveryMode === 'PLACE_GOODS_TRANSFER',
					isGroundStorage: this.VUEX_GET_CONTRACT_DATA?.contractDelivery?.deliveryMode === 'GROUND_STORAGE',
					isflatWarehouse: this.VUEX_GET_CONTRACT_DATA?.contractDelivery?.deliveryMode === 'FLAT_WAREHOUSE',
					isPlaceSelf: this.VUEX_GET_CONTRACT_DATA?.contractDelivery?.deliveryMode === 'PLACE_SELF',
					isTransportResponsibilityOther: this.VUEX_GET_CONTRACT_DATA?.contractDelivery?.transportResponsibility === '其他',
					deliveryStartDate: deliveryStartDate ? moment(deliveryStartDate).format('YYYY年M月D日') : '',
					deliveryEndDate: deliveryEndDate ? moment(deliveryEndDate).format('YYYY年M月D日') : '',
					freightPayModeName: this.getModeTextByCode(this.VUEX_GET_CONTRACT_DATA?.contractDelivery?.freightPayMode)?.label,
					transportModeName: this.getModeTextByCode(this.VUEX_GET_CONTRACT_DATA?.contractDelivery?.transportMode)?.label,
					deliveryModeName: this.getModeTextByCode(this.VUEX_GET_CONTRACT_DATA?.contractDelivery?.deliveryMode)?.label,
					settleModeName: this.getModeTextByCode(this.VUEX_GET_CONTRACT_DATA?.contract?.settleMode)?.label,
					signTime: signDate ? moment(signDate).format('YYYY年M月D日') : '',
					buyContactName: this.getModeTextByCode(this.VUEX_GET_CONTRACT_DATA?.contract?.buyerContactsId)?.label,
					buyContactPhone: this.getModeTextByCode(this.VUEX_GET_CONTRACT_DATA?.contract?.buyerContactsId)?.contactPhone,
					buyContactArea: this.getModeTextByCode(this.VUEX_GET_CONTRACT_DATA?.contract?.buyerContactsId)?.contactArea,
					buyContactAddress: this.getModeTextByCode(this.VUEX_GET_CONTRACT_DATA?.contract?.buyerContactsId)?.contactAddress,
					buyContactEmail: this.getModeTextByCode(this.VUEX_GET_CONTRACT_DATA?.contract?.buyerContactsId)?.contactEmail,
					sellerContactName: this.getModeTextByCode(this.VUEX_GET_CONTRACT_DATA?.contract?.sellerContactsId)?.label,
					sellerContactPhone: this.getModeTextByCode(this.VUEX_GET_CONTRACT_DATA?.contract?.sellerContactsId)?.contactPhone,
					sellerContactArea: this.getModeTextByCode(this.VUEX_GET_CONTRACT_DATA?.contract?.sellerContactsId)?.contactArea,
					sellerContactAddress: this.getModeTextByCode(this.VUEX_GET_CONTRACT_DATA?.contract?.sellerContactsId)?.contactAddress,
					sellerContactEmail: this.getModeTextByCode(this.VUEX_GET_CONTRACT_DATA?.contract?.sellerContactsId)?.contactEmail,
					transportResponsibilityOther: this.VUEX_GET_CONTRACT_DATA?.contractDelivery?.transportResponsibilityOther,
					transportResponsibility: this.VUEX_GET_CONTRACT_DATA?.contractDelivery?.transportResponsibility,
					transportModeIsNone: this.VUEX_GET_CONTRACT_DATA?.contractDelivery?.transportMode === 'NONE', // 不涉及运输
					consignorCompanyNameNotNull:
						this.VUEX_GET_CONTRACT_DATA?.contractDelivery?.consignorCompanyName !== undefined &&
						Boolean(this.VUEX_GET_CONTRACT_DATA?.contractDelivery?.consignorCompanyName.length), // 没有托运人
					consigneeCompanyNameNotNull:
						this.VUEX_GET_CONTRACT_DATA?.contractDelivery?.consigneeCompanyName !== undefined &&
						Boolean(this.VUEX_GET_CONTRACT_DATA?.contractDelivery?.consigneeCompanyName.length), // 没有收货人
					sellerCompanyUscc:
						this.VUEX_GET_CONTRACT_DATA?.contractDelivery?.sellerCompanyUscc || this.VUEX_GET_CONTRACT_DATA?.contract?.sellerUscc,
					buyCompanyUscc:
						this.VUEX_GET_CONTRACT_DATA?.contractDelivery?.buyCompanyUscc || this.VUEX_GET_CONTRACT_DATA?.contract?.buyerUscc
				})
				.then(result => {
					this.templeteData = result;
				});
		},
		getModeTextByCode(code) {
			if (code) {
				return this.VUEX_GET_OPTIONS_LIST.filter(item => item.value === code)[0];
			}
			return '';
		},
		isNull(val) {
			if (val === 0) return false;
			if (!val) return true;
			return false;
		},
		arr1to2(arr, number) {
			var arr2 = [];
			let len = arr.length;
			for (let i = 0, j = 0; i < len; i += number, j++) {
				arr2[j] = arr.splice(0, number);
			}
			return arr2;
		},
		setViewList() {
			const valueList = cloneDeep(this.VUEX_GET_CONTRACT_DATA?.orderIndicators);
			if (!valueList) return [];
			valueList.forEach((items, indexs) => {
				items.index = indexs + 1;
				if (items.productIndicatorList) {
					items.productIndicatorList.forEach(item => {
						item.name = item.indicatorName;
						// 华泰专用质量指标拆分名字、单位
						const indicatorName = cloneDeep(item.indicatorName) || ''
						if (this.isHuaTai && indicatorName) {
							const lastIndex = indicatorName.lastIndexOf("(")
							const lastIndex2 = indicatorName.lastIndexOf("（") 
							if (lastIndex != -1) {
								item.nameExcludeUnit = indicatorName.substring(0, lastIndex);
							} else {
								if (lastIndex2 != -1) {
									item.nameExcludeUnit = indicatorName.substring(0, lastIndex2);
								} else {
									item.nameExcludeUnit = indicatorName
								}
							}
							const reg = /^(?:.+)(?:\(|（)(.+)(?:\)|）)$/gi;
							const unitName = reg.exec(indicatorName)
							if (unitName?.length) {
								item.unitName = unitName[1]
							}
						}
						item.width = '16.67%';
						let v1 = item.valueList[item.indicatorCode + '_value1'] || '',
							v2 = item.valueList[`${item.indicatorCode}_value2`] || '';
						if (item.inputType == 'RANGE') {
							if (this.isNull(v1) || this.isNull(v2)) {
								item.value = this.isNull(v1) ? v2 : v1;
							} else {
								const max = Math.max(v1, v2);
								const min = Math.min(v1, v2);
								item.value = min + '-' + max;
							}
						} else {
							if (this.isNull(v1)) {
								v1 = '';
							}
							item.value = (item.symbol == '无符号' ? '' : item.symbol) + v1;
						}
					});
				}
				items.indicatorTableDTOList = this.arr1to2(items.productIndicatorList, 6);
				items.hasIndicator = items.productIndicatorList.length >= 0 ? true : false;
			});
			return valueList;
		},
		formateIndicatorList(indicatorList = this.setViewList()) {
			if (this.multiGoodsNameFlag) {
				return indicatorList;
			}
			const result = [];
			const tempList = [];
			indicatorList.forEach(items => {
				if (items.indicatorTableDTOList) {
					items.indicatorTableDTOList.flat().forEach(item => {
						item.name = item.indicatorName;
						// 华泰专用质量指标拆分名字、单位
						const indicatorName = cloneDeep(item.indicatorName) || ''
						if (this.isHuaTai && indicatorName) {
							const lastIndex = indicatorName.lastIndexOf("(")
							const lastIndex2 = indicatorName.lastIndexOf("（") 
							if (lastIndex != -1) {
								item.nameExcludeUnit = indicatorName.substring(0, lastIndex);
							} else {
								if (lastIndex2 != -1) {
									item.nameExcludeUnit = indicatorName.substring(0, lastIndex2);
								} else {
									item.nameExcludeUnit = indicatorName
								}
							}
							const reg = /^(?:.+)(?:\(|（)(.+)(?:\)|）)$/gi;
							const unitName = reg.exec(indicatorName)
							if (unitName?.length) {
								item.unitName = unitName[1]
							}
						}
						item.width = '16.67%';
						let v1 = item.valueList[item.indicatorCode + '_value1'] || '',
							v2 = item.valueList[`${item.indicatorCode}_value2`] || '';
						if (item.inputType == 'RANGE') {
							if (this.isNull(v1) || this.isNull(v2)) {
								item.value = this.isNull(v1) ? v2 : v1;
							} else {
								const max = Math.max(v1, v2);
								const min = Math.min(v1, v2);
								item.value = min + '-' + max;
							}
						} else {
							if (this.isNull(v1)) {
								v1 = '';
							}
							item.value = (item.symbol == '无符号' ? '' : item.symbol) + v1;
						}
						tempList.push(item);
					});
				}
			});
			const length = Math.ceil(tempList.length / tableColumnNum);
			for (let i = 0; i < length; i++) {
				result.push(tempList.slice(i * tableColumnNum, i * tableColumnNum + tableColumnNum));
			}
			return result
		}
	}
};
</script>

<style lang="less" scoped>
.thymeleaf-wrap {
	width: 100%;
	height: 100%;
	overflow: hidden;
	overflow-y: auto;
	border: 1px solid #eaebed;
	padding: 0 40px;
	padding-top: 20px;
	font-family:
		PingFangSC-Regular,
		PingFang SC;
	.line {
		width: 100%;
		height: 2px;
		background: #000;
		margin: 0 auto;
	}
	.title-wrap {
		width: 100%;
		text-align: center;
	}
}
</style>
