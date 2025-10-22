<template>
	<div
		class="slMain"
		style="margin-top: -10px"
	>
		<a-card :bordered="false">
			<div class="s-title">
				<span
					slot="title"
					class="slTitle"
					>市场价格</span
				>
			</div>
			<SlForm
				:list="searchList"
				ref="formRef"
				layout="inline"
				@change="changeSearch"
				:isShowIcon="false"
			></SlForm>

			<!-- 表格 -->
			<div
				class="table-box"
				style="width: 100%; margin-top: 30px"
			>
				<a-table
					:columns="columns"
					class="new-table new-table2"
					:bordered="false"
					rowKey="id"
					:dataSource="list"
					:pagination="false"
					:loading="loading"
					:scroll="{ x: true }"
				>
					<template
						slot="raise"
						slot-scope="text, record"
					>
						<div
							style="color: #45bf83; font-size: 16px"
							v-if="record.raise < 0"
							s
						>
							<img
								class="up"
								src="@/assets/imgs/storage/down.png"
								alt=""
							/>
							{{ record.raise }}
						</div>
						<div
							style="color: #dd4444; font-size: 16px"
							v-else-if="record.raise > 0"
						>
							<img
								class="up"
								src="@/assets/imgs/storage/up.png"
								alt=""
							/>
							+{{ record.raise }}
						</div>
						<div v-else>-</div>
					</template>
					<div
						slot="tendency"
						slot-scope="text, record"
					>
						<div
							class="btn-box btn-box2"
							@click="goDetail(record)"
						>
							<span class="svg-line">{{ record.tendency }}</span>
						</div>
					</div>
				</a-table>
			</div>
			<i-pagination
				:pagination="pagination"
				size="small"
				:pageSizeOptions="['50', '100', '150', '200']"
				:defaultPageSize="100"
				@change="getList"
			/>
			<svg class="ttt">
				<defs>
					<linearGradient
						id="ttt"
						x1="0"
						x2="0"
						y1="0"
						y2="1"
					>
						<stop
							offset="0"
							stop-color="rgba(109, 156, 244, 0.50)"
						></stop>
						<stop
							offset="1"
							stop-color="rgba(166, 203, 250, 0)"
						></stop>
					</linearGradient>
				</defs>
			</svg>
		</a-card>
	</div>
</template>

<script>
import SlForm from '@sub/components/ui-new/Form/sl-form';
import iPagination from "@sub/components/iPagination";
import { mapGetters, mapMutations } from 'vuex';
// import {getCheckWarehouseList, exportCheckWarehouse, downloadAttach }  from '../../../api/findWarehouse.js'
import { getMarketPriceList, getFilterItem, getEffectiveMaxDate } from '../../../api/statement.js';
import comDownload from '@sub/utils/comDownload.js';
import moment from 'moment';

export default {
	data() {
		return {
			searchList: [
				{
					decorator: [
						'date',
						{
							initialValue: moment().startOf('day').format('YYYY-MM-DD')
						}
					],
					addonBeforeTitle: '日期',
					type: 'datePicker',
					placeholder: '请输入',
					allowClear: false
				},
				{
					decorator: ['area'],
					addonBeforeTitle: '区域',
					type: 'input',
					placeholder: '请输入区域',
					allowClear: true,
					onChange: this.inputOnChange('area')
				},
				{
					decorator: ['steelType'],
					addonBeforeTitle: '钢材种类',
					type: 'input',
					placeholder: '请输入钢材种类',
					allowClear: true,
					onChange: this.inputOnChange('steelType')
				},
				{
					decorator: ['materialName'],
					addonBeforeTitle: '品名',
					type: 'select',
					placeholder: '请输入品名',
					allowClear: true,
					options: [],
					mode: 'tags',
					showSearch: true
				},
				{
					decorator: ['placeOfOrigin'],
					addonBeforeTitle: '钢厂/产地',
					type: 'select',
					placeholder: '请输入钢厂/产地',
					allowClear: true,
					options: [],
					mode: 'tags',
					showSearch: true
				},
				{
					decorator: ['specs'],
					addonBeforeTitle: '规格',
					type: 'input',
					placeholder: '规格',
					allowClear: true
				}
			],
			searchParams: {},
			pagination: {
				total: 0, // 总条数
				pageNo: 1
			},
			columns: [
				{ title: '区域', dataIndex: 'area', key: 'area' },
				{ title: '钢材种类', dataIndex: 'steelType', key: 'steelType' },
				{ title: '品名', dataIndex: 'materialName', key: 'materialName' },
				{ title: '规格', dataIndex: 'specs', key: 'specs' },
				{ title: '材质', dataIndex: 'materialTexture', key: 'materialTexture' },
				{ title: '钢厂/产地', dataIndex: 'placeOfOrigin', key: 'placeOfOrigin' },
				{ title: '价格(元/吨)', dataIndex: 'unitPrice', key: 'unitPrice' },
				{ title: '涨跌(元/吨)', dataIndex: 'raise', key: 'raise', scopedSlots: { customRender: 'raise' } },
				{ title: '更新日期', dataIndex: 'publishDate', key: 'publishDate' },
				{ title: '备注', dataIndex: 'note', key: 'note' },
				{
					title: '7天趋势分析',
					key: 'tendency',
					align: 'center',
					fixed: 'right',

					scopedSlots: { customRender: 'tendency' }
				}
			],
			pageSize: 100,
			list: [],
			loading: false,
			isFirst: false
		};
	},
	computed: {},
	created() {},
	activated() {
		this.getEffectiveMaxDate()
	},
	mounted() {
		this.getFilterItem();
		this.getEffectiveMaxDate()
		
	},
	methods: {
		async getEffectiveMaxDate() {
			const res = await getEffectiveMaxDate()
			const item = this.searchList[0];
			item.decorator[1].initialValue = moment(res.data).format('YYYY-MM-DD');
			this.searchParams.date = moment(res.data).format('YYYY-MM-DD');
			this.getList(1);
		},
		inputOnChange(field) {
			return e => {
				this.searchParams[field] = e.target.value;
				this.getFilterItem();
			};
		},
		getFilterItem() {
			let { area, steelType } = this.searchParams;
			getFilterItem({ area, steelType }).then(({ success, data }) => {
				if (!success) {
					return;
				}
				let { materialNameList, placeOfOriginList } = data;
				this.$refs?.formRef?.form?.setFieldsValue({
					materialName: [],
					placeOfOrigin: []
				});
				this.searchList[3].options = materialNameList.map(val => ({ value: val, label: val }));
				this.searchList[4].options = placeOfOriginList.map(val => ({ value: val, label: val }));
			});
		},
		changeSearch(info) {
			this.searchParams = info;
			this.isFirst = true;
			this.getList(1);
		},
		resetValues() {
			this.pagination.pageNo = 1;
			this.getList();
		},
		async getList(pageNo = this.pagination.pageNo, pageSize = this.pageSize) {
			this.pageSize = pageSize;
			this.pagination.pageNo = pageNo;
			const params = {
				...this.searchParams,
				...this.pagination,
				pageSize,
				distinctPrice: 1
			};
			if (!params.date) {
				params.date = moment().startOf('day').format('YYYY-MM-DD');
			}
			this.loading = true;
			try {
				const res = await getMarketPriceList(params);
				/** 判断当天是否有数据 */
	
				const list = res.data.records || [];
				// if (!list.length && !this.isFirst) {
				// 	item.decorator[1].initialValue = moment(params.date).subtract(1, 'd').format('YYYY-MM-DD');
				// 	item.flag = true;
				// 	this.searchParams.date = moment(params.date).subtract(1, 'd').format('YYYY-MM-DD');
				// 	this.$nextTick(() => {
				// 		this.getList(1);
				// 	});
				// 	return;
				// }

				list.forEach(el => {
					el.tendency = el?.miniCharts?.join();
				});
				this.list = list;
				this.pagination.total = res.data.total;
				this.loading = false;
				this.$nextTick(() => {
					$('.svg-line').peity('line', {
						fill: () => {
							return 'url(#ttt)';
						}
					});
				});
			} catch (error) {
				this.loading = false;
			}
		},
		// 去往详情
		goDetail(item) {
			this.$router.push({
				path: '/center/steels/markMarket/markMarket/detail',
				query: {
					id: item.id
				}
			});
		}
	},

	beforeRouteLeave(to, form, next) {
		this.isFirst = true;
		next();
	},
	components: {
		SlForm,
		iPagination
	}
};
</script>

<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style scoped lang="less">
.ttt {
	position: absolute;
	left: -10000px;
	top: -10000px;
}
/deep/ .ant-table-column-title {
	font-weight: 600;
}
/deep/ .peity {
	border-bottom: 1px solid rgba(153, 167, 185, 0.4);
	padding-bottom: 1px;
}
/deep/ .ant-table-thead > tr > th {
	padding: 12px 16px;
}
/deep/ .ant-table-tbody > tr > td {
	padding: 12px 16px;
}
.page-title {
	display: flex;
	margin-left: 0 !important;
}
.icon,
.icon2 {
	width: 18px;
	vertical-align: middle;
	margin-right: 15px;
}
.btn-box-title {
	display: flex;
	align-items: center;
	.btn {
		width: 126px;
		height: 44px;
		border-radius: 4px;
		border: 1px solid @primary-color;
		display: flex;
		justify-content: center;
		align-items: center;
		color: @primary-color;
		font-size: 14px;
		margin-left: 20px;
		font-weight: 400;
		cursor: pointer;
	}
}
.table-box {
	margin-top: 40px;
}
.new-table2 {
	/deep/ tr > td {
		padding: 0 !important;
		padding-left: 16px !important;
		padding-right: 16px !important;
		padding-top: 0 !important;
		padding-bottom: 0 !important;
		height: 50px;
		line-height: 50px;
		color: rgba(0, 0, 0, 0.8);
	}
}
.up {
	width: 25px;
	height: 25px;
	// background: rgba(231,255,243,0.5);
	border-radius: 7px;
}
.btn {
	margin-left: 5px;
}
.divider {
	margin-bottom: 20px;
}
.btn-box {
	cursor: pointer;
}
.btn-box2 {
	background: inherit !important;
	padding: 0;
	// padding: 0 16px;
}
.ant-table-row-hover {
	background: inherit;
	// background: red !important;
}
</style>
