export default {
	computed: {
		tipList() {
			let result = [];
			const tempList = [];
			this.VUEX_GET_FORM_SCHEMA?.formList?.contractExtension?.forEach(item => {
				tempList.push(item.label);
			});
			this.VUE_SET_FORM_LIST_SORT.forEach(item => {
				const current = this.VUEX_GET_FORM_SCHEMA.formList[item];
				if (item == 'contractExtension') {
					result = result.concat(tempList);
				} else {
					if (current && current.length) {
						result.push(item);
					}
				}
			});
			return result;
		},
		tipListMap() {
			const map = this.VUEX_GET_FORM_SCHEMA.mapConfig;
			this.VUEX_GET_FORM_SCHEMA?.formList?.contractExtension?.forEach(item => {
				map[item.label] = item.title;
			});
			return map;
		}
	}
};
