/**
 * 列表中使用，统一引入表单，分页，查询，避免重复代码
 */
import SlForm from '@sub/components/ui-new/Form/sl-form.vue';
import SlFormNew from '@sub/components/ui-new/Form/sl-form';
import iPagination from '@sub/components/iPagination';
import comDownload from '@sub/utils/comDownload.js';
import { hasAuth } from '@/v2/utils/checkAuth';
import { mapGetters } from 'vuex';
export const ListMixin = {
	components: {
		iPagination,
		SlForm,
		SlFormNew
	},
	data() {
		return {
			defaultParams: {}, // 默认参数
			searchParams: {}, //查询参数
			/* 排序参数 */
			isorter: {},
			loading: false,
			url: {
				list: null, //列表
				count: null, //数量统计
				export: null //导出
			},
			dataSource: [], //表格数据
			dataCountSource: null, //不同状态数量统计
			pagination: {
				total: 0, // 总条数
				pageNo: 1
			},
			pageSize: 10,
			selfLoad: false
		};
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_TOKEN: 'VUEX_ST_TOKEN'
		})
	},
	watch: {
		defaultParams: {
			deep: true,
			handler() {
				this.getList(1);
			}
		}
	},
	created() {},
	mounted() {
		if (!this.selfLoad) {
			this.getList();
		}
	},

	methods: {
		// 获取数据列表
		async getList(pageNo = this.pagination.pageNo, pageSize = this.pageSize) {
			this.pageSize = pageSize;
			this.pagination.pageSize = pageSize;
			this.pagination.pageNo = pageNo;
			const params = {
				...this.isorter,
				...this.defaultParams,
				...this.searchParams,
				...this.pagination,
				pageSize
			};

			if (this.url?.list) {
				this.loading = true;
				try {
					let res = await this.url.list(params);
					this.dataSource = res.data ? res.data.records || res.data.list : res.result.records;
					this.pagination.total = res.data ? res.data.total : res.result.total;
					this.loading = false;
				} catch (error) {
					this.loading = false;
				}
			}
			//判断是否有加载数量统计
			if (this.url?.count) {
				try {
					const params2 = {
						...params,
						pageNo: 1
					};
					let res = await this.url.count(params2);
					this.dataCountSource = res.data || res.result;
				} catch (error) {
					console.error(error);
				}
			}
		},
		//表单数据发生变化
		changeSearch(data) {
			this.searchParams = data;
			this.getList(this.searchParams.pageNo || 1, this.pageSize);
		},
		// 导出
		async exportFile(name, exportParams = {}) {
			const params = {
				...this.defaultParams,
				...this.searchParams,
				...exportParams
			};
			//判断地址有无后缀，没有默认xls
			if (name.indexOf('.') < 0) {
				name += '.xls';
			}
			const res = await this.url.export(params);
			comDownload(res, undefined, name);
		},
		//计算操作列展示
		//展示列的匹配规则，在使用页面进行配置
		actionMinList() {
			return [];
		},
		// 操作列
		actionMinDiv(items, length = 3) {
			let t = this;
			let actionList = this.actionMinList(items);
			//判断是否满足展示条件
			let action = actionList.filter(item => {
				if (item.hasOwnProperty('condition')) {
					return item.condition;
				} else {
					return true;
				}
			});
			//判断是否满足展示权限
			action = action.filter(item => {
				if (item.hasOwnProperty('auth')) {
					return hasAuth(item.auth);
				} else {
					return true;
				}
			});
			if (!action.length) return;
			let actionVnode = [],
				dropdownList = [];
			let h = t.$createElement;
			action.map((item, index) => {
				let aVnode = h(
					'a',
					{
						on: {
							click: function () {
								t[item.incident](items);
							}
						}
					},
					item.text
				);
				if (action.length > length && index >= length - 1) {
					dropdownList.push(h('a-menu-item', null, [aVnode]));
				} else {
					actionVnode.push(aVnode);
				}
			});
			if (dropdownList.length) {
				actionVnode.push(
					h('a-dropdown', null, [
						h('a', [h('span', {}, '更多'), h('a-icon', { attrs: { type: 'down' } })]),
						h('a-menu', { slot: 'overlay' }, dropdownList)
					])
				);
			}
			return h('a-space', { attrs: { size: 'large' } }, actionVnode);
		}
	}
};
