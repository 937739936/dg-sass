export default {
	data() {
		return {
			typeListNormal: [],
			pagination: {
				total: 0,
				pageNo: 1,
				pageSize: 10
			}
		};
	},
	watch: {
		formResult: {
			handler(value) {
				this.pagination.pageNo = 1;
				this.fetchData();
			},
			deep: true,
			immediate: true
		}
	},
	computed: {
		showClearAll() {
			let flag = false;
			for (const key in this.formResult) {
				if (this.formResult[key].length) {
					flag = true;
					break;
				}
			}
			return flag;
		}
	},
	methods: {
		// 根据发票类型text获取类型value
		getInvoiceTypeValueByText(text) {
			if (text) {
				return this.typeListNormal.filter(item => item.text == text)[0].value;
			} else {
				return '';
			}
		},
		resetTagSearch() {
			for (const key in this.formResult) {
				this.$refs[key] && this.$refs[key].clear();
			}
		},
		handleTagClose(tag) {
			this.formResult[tag] = [];
			this.$refs[tag] && this.$refs[tag].clear();
		},
		handleTableChange(page, size) {
			this.pagination.pageNo = page;
			this.pagination.pageSize = size;
			this.fetchData();
		},
		resetSearch() {
			for (const key in this.formResult) {
				this.formResult[key] = [];
			}
			this.pagination.pageNo = 1;
			this.resetTagSearch();
		}
	},
	mounted() {}
};
