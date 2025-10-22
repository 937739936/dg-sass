<template>
	<a-cascader
		:options="options"
		:load-data="loadData"
		placeholder=""
		change-on-select
		@change="onChange"
		style="width: 100%"
		:default-value="defaultValue"
		:value="defaultValue"
		:disabled="disabled"
	/>
</template>

<script>
import {
	API_BIZCOUNTRYLIST,
	API_BIZPROVINCELIST,
	API_BIZCITYLIST,
	API_BIZSITELIST,
	API_BIZAREALIST
} from '@/v2/center/trade/api/contract';
import { cloneDeep } from 'lodash';

export default {
	props: {
		resultDetail: {
			type: Object,
			default: () => {}
		},
		disabled: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			options: [],
			fetchUrl: {
				0: API_BIZCOUNTRYLIST,
				1: API_BIZPROVINCELIST,
				2: API_BIZCITYLIST,
				3: API_BIZSITELIST,
				4: API_BIZAREALIST
			},
			defaultValue: [],
			selectedOptions: []
		};
	},
	watch: {
		resultDetail: {
			async handler(value) {
				this.defaultValue = [];
				if (value?.contractDelivery) {
					const {
						deliveryCountryCode,
						deliveryCountryName,
						deliveryProvinceCode,
						deliveryProvinceName,
						deliveryCityCode,
						deliveryCityName,
						deliverySiteCode,
						deliverySiteName
					} = value.contractDelivery;
					const splitArea = value?.contractDelivery?.splitArea || [];
					const fetchData = [];
					if (deliveryCountryCode) {
						fetchData.push({
							label: deliveryCountryName,
							value: splitArea.length ? splitArea[0] : deliveryCountryCode
						});
					}
					if (deliveryProvinceCode) {
						fetchData.push({
							label: deliveryProvinceName,
							value: splitArea.length ? splitArea[1] : deliveryProvinceCode
						});
					}
					if (deliveryCityCode) {
						fetchData.push({
							label: deliveryCityName,
							value: splitArea.length ? splitArea[2] : deliveryCityCode
						});
					}
					if (deliverySiteCode) {
						fetchData.push({
							label: deliverySiteName,
							value: splitArea.length ? splitArea[3] : deliverySiteCode
						});
					}
					this.selectedOptions = fetchData;
					this.defaultValue = fetchData.map(item => item.value);
					await this.fetchCountryData();
					if (fetchData[0]) {
						await this.fetchProvinceData(fetchData[0].value == '1' ? 1 : 3);
						await this.fetchCityData();
						await this.fetchAreaData();
					}
				} else {
					this.fetchCountryData();
				}
			},
			deep: true,
			immediate: true
		},
		options: {
			handler() {}
		}
	},
	methods: {
		onChange(value) {
			if (value[0] == '1') {
				if (value.length >= 4) {
					this.defaultValue = value;
					this.$emit('change', value);
				}
			} else {
				if (value.length >= 2) {
					this.defaultValue = value;
					this.$emit('change', value);
				}
			}
		},
		async loadData(selectedOptions) {
			this.selectedOptions = selectedOptions;
			if (selectedOptions[0].value == '1') {
				this.fetchProvinceData(1);
			} else {
				this.fetchProvinceData(3);
			}
			if (selectedOptions.length >= 2) {
				this.fetchCityData();
			}
			if (selectedOptions.length >= 3) {
				this.fetchAreaData();
			}
			if (selectedOptions.length >= 4) {
				this.fetchStreetData();
			}
		},
		formateResultList(list, flag) {
			const result = list;
			if (result?.length) {
				result.forEach(item => {
					item.label = item.name;
					item.value = item.code;
					item.isLeaf = flag;
				});
			}
			return result;
		},
		getIndexByCode(value) {
			return this.options.findIndex(item => item.value == value);
		},
		async fetchCountryData() {
			const { result } = await this.fetchUrl[0]({ t: new Date().getTime() });
			this.options = this.formateResultList(result, false);
		},
		async fetchProvinceData(id) {
			const targetOption = this.selectedOptions[0];
			if (targetOption?.children) {
				return;
			}
			targetOption.loading = true;
			const { result } = await this.fetchUrl[id]({
				countryCode: this.selectedOptions[0].value,
				t: new Date().getTime()
			});
			targetOption.loading = false;
			let cloneList = cloneDeep(this.options);
			for (let i = 0; i < this.options.length; i++) {
				if (cloneList[i].value == this.selectedOptions[0].value) {
					cloneList[i].children = this.formateResultList(result, this.selectedOptions[0].label == '中国' ? false : true);
					break;
				}
			}
			this.options = cloneList;
		},
		async fetchCityData() {
			const targetOption = this.selectedOptions[1];
			if (targetOption?.children) {
				return;
			}
			targetOption.loading = true;
			const { result } = await this.fetchUrl[2]({
				provinceCode: this.selectedOptions[1].value,
				t: new Date().getTime()
			});
			targetOption.loading = false;
			let cloneList = cloneDeep(this.options);
			for (let i = 0; i < cloneList.length; i++) {
				if (cloneList[i].value == this.selectedOptions[0].value) {
					for (let j = 0; j < cloneList[i]?.children?.length; j++) {
						if (cloneList[i].children[j].value == this.selectedOptions[1].value) {
							cloneList[i].children[j].children = this.formateResultList(result, false);
						}
					}
				}
			}
			this.options = cloneList;
		},
		async fetchAreaData() {
			const targetOption = this.selectedOptions[2];
			if (!targetOption || targetOption?.children) {
				return;
			}
			targetOption.loading = true;
			const { result } = await this.fetchUrl[3]({
				countryCode: this.selectedOptions[0].value,
				cityCode: this.selectedOptions[2].value,
				t: new Date().getTime()
			});
			targetOption.loading = false;
			let cloneList = cloneDeep(this.options);
			for (let i = 0; i < cloneList.length; i++) {
				if (cloneList[i].value == this.selectedOptions[0].value) {
					for (let j = 0; j < cloneList[i]?.children?.length; j++) {
						if (cloneList[i].children[j].value == this.selectedOptions[1].value) {
							for (let k = 0; k < cloneList[i]?.children[j]?.children?.length; k++) {
								if (cloneList[i].children[j].children[k].value == this.selectedOptions[2].value) {
									cloneList[i].children[j].children[k].children = this.formateResultList(result, true);
								}
							}
						}
					}
				}
			}
			this.options = cloneList;
		},
		async fetchStreetData() {
			const { result } = await this.fetchUrl[4]({
				cityCode: this.selectedOptions[2].value,
				t: new Date().getTime()
			});
			let cloneList = cloneDeep(this.options);
			for (let i = 0; i < cloneList.length; i++) {
				if (cloneList[i].value == this.selectedOptions[0].value) {
					for (let j = 0; j < cloneList[i].children.length; j++) {
						if (cloneList[i].children[j].value == this.selectedOptions[1].value) {
							for (let k = 0; k < cloneList[i].children[j].children.length; k++) {
								if (cloneList[i].children[j].children[k].value == this.selectedOptions[2].value) {
									cloneList[i].children[j].children[k].children = this.formateResultList(result);
									for (let l = 0; l < cloneList[i].children[j].children[k].children.length; l++) {
										cloneList[i].children[j].children[k].children[l].children = this.formateResultList(result, true);
									}
								}
							}
						}
					}
				}
			}
			this.options = cloneList;
		}
	},
	mounted() {
		// this.loadData();
	}
};
</script>

<style></style>
