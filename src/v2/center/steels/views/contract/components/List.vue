<template>
	<div class="slMain">
		<a-card :bordered="false">
			<div class="top-box">
				<span
					slot="title"
					class="slTitle"
					>{{ title }}</span
				>
				<div>
					<slot name="titleAction"></slot>
				</div>
			</div>
			<div class="divider"></div>
			<SlForm
				:list="searchList"
				layout="inline"
				@change="changeSearch"
				:allowClear="false"
				:isShowIcon="false"
				:isShowSearchBox="true"
				@resetFunc="resetFunc"
			></SlForm>
			<div class="tabs-box">
				<Tabs
					:statusData="tabData"
					:tabNum="0"
					@callback="tabChange"
					ref="Tabs"
				/>
			</div>

			<!-- <a-row type="flex" justify="space-between" align="middle" class="order-tab">
        <ul>
          <li :class="searchParams.status == '' ? 'active' : ''" @click="tabChange({value:''})">
            <p>全部</p>
          </li>
          <li @click="tabChange(items)" :class="[searchParams.status == items.value ? 'active' : '']" v-for="(items, index) in tabData" :key="index">
            <p>{{items.label}}</p>
          </li>
        </ul>
      </a-row> -->
			<!-- 表格 -->
			<div>
				<a-table
					:pagination="false"
					:columns="columns"
					class="new-table"
					:data-source="list"
					:scroll="{ x: true }"
					rowKey="id"
					@change="handleTableSort"
					:loading="loading"
				>
					<span
						slot="deliveryDateEnd"
						slot-scope="deliveryType, items"
					>
						<p v-if="items.effectiveEndDate">{{ items.effectiveStartDate }}～{{ items.effectiveEndDate }}</p>
					</span>
					<div
						slot="action"
						slot-scope="action, items"
						style="display: flex"
					>
						<slot
							name="action"
							:action="action"
							:items="items"
						></slot>
					</div>
				</a-table>
				<IPagination
					:pagination="pagination"
					@change="getList"
				/>
			</div>
		</a-card>
	</div>
</template>

<script>
import SlForm from '@sub/components/ui-new/Form/sl-form';
import IPagination from "@sub/components/iPagination";
import { filterSteelsCodeByKey } from '@sub/utils/globalCode.js';
import Tabs from '@/v2/center/steels/components/Tabs.vue';
import { mapMutations, mapGetters } from 'vuex';
export default {
	props: {
		columns: {
			default: () => []
		},
		loading: {
			default: false
		},
		type: {
			default: 'BUY'
		}
	},
	data() {
		return {
			searchList: [
				{
					decorator: ['contractNo'],
					addonBeforeTitle: '合同编号',
					type: 'input',
					placeholder: '请输入合同编号',
					allowClear: true
				},
				{
					addonBeforeTitle: '合同总数量',
					decorator: ['total'],
					type: 'input-group',
					realKey: ['quantityLower', 'quantityUpper'],
					children: [
						{
							decorator: ['quantityLower'],
							addonBeforeTitle: '合同总数量',
							type: 'input',
						},
						{
							decorator: ['quantityUpper'],
							type: 'input',
						}
					],
					midfix: '至',
					placeholder: '请输入',
					allowClear: true
				},
				{
					decorator: ['sellCompanyName'],
					addonBeforeTitle: '卖方',
					type: 'input',
					isShow: () => this.type == 'BUY',
					placeholder: '输入卖方信息',
					allowClear: true
				},
				{
					decorator: ['buyCompanyName'],
					addonBeforeTitle: '买方',
					type: 'input',
					isShow: () => this.type == 'SELL',
					placeholder: '输入买方信息',
					allowClear: true
				},
				{
					decorator: ['startTime'],
					addonBeforeTitle: '合同起始日',
					realKey: ['effectiveStartStartDate', 'effectiveStartEndDate'],
					type: 'rangePicker',
					placeholder: ['', ''],
					allowClear: true
				},
				{
					decorator: ['endTime'],
					addonBeforeTitle: '合同到期日',
					realKey: ['effectiveEndStartDate', 'effectiveEndEndDate'],
					type: 'rangePicker',
					placeholder: ['', ''],
					allowClear: true
				},
				{
					decorator: ['steelType'],
					addonBeforeTitle: '钢材种类',
					type: 'select',
					placeholder: '请选择',
					allowClear: true,
					options: filterSteelsCodeByKey('steelType')
				},
				{
					decorator: ['generateWay'],
					addonBeforeTitle: '合同生成方式',
					type: 'select',
					placeholder: '请选择',
					allowClear: true,
					options: filterSteelsCodeByKey('generateWay')
				}
			],
			tabData: [
				{
					value: '',
					text: '全部'
				},
				...filterSteelsCodeByKey('contractStatus')
			],
			searchParams: {
				status: ''
			},
			status: '',
			pagination: {
				type: 'stellsBuyContract',
				total: 0, // 总条数
				pageNo: 1
			},
			list: [],
			pageSize: 10
		};
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		// ...mapGetters('pagination', {
		//   listParmas: 'listParmas',
		//   pageSize: 'pageSize'
		// }),
		title() {
			if (this.type == 'BUY') {
				return '采购合同列表';
			}
			return '销售合同列表';
		}
	},
	methods: {
		changeSearch(info) {
			this.pagination.pageNo = 1;
			this.searchParams = info;
			// Object.assign(this.searchParams, info)
			this.getList();
		},
		tabChange(status) {
			this.status = status;
			this.searchParams.status = status;
			this.pagination.pageNo = 1;
			this.getList();
		},
		// 获取合同列表
		getList(pageNo = this.pagination.pageNo, pageSize = this.pageSize) {
			this.pagination.pageNo = pageNo;
			this.pageSize = pageSize;

			this.searchParams.pageNo = pageNo;
			this.searchParams.pageSize = pageSize;
			this.searchParams.status = this.status;

			this.$emit('send', this.searchParams);
		},
		resetFunc() {
			this.pagination.pageNo = 1;
			this.status = '';
			this.$refs.Tabs.status = '';
		},
		handleTableSort(pagination, filters, sorter) {
			// 名称字段排序
			this.searchParams.field = sorter.field;
			this.searchParams.orderBy = sorter.order ? sorter.order.split('end')[0] : '';
			this.getList();
		},
		init(list, pagination = {}) {
			this.list = list;
			Object.assign(this.pagination, pagination);
		}
	},
	components: {
		SlForm,
		IPagination,
		Tabs
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style scoped lang="less">
.slMain {
	margin-top: -10px;
}
.tabs-box {
	margin-top: 20px;
	margin-bottom: 20px;
}
.top-box {
	display: flex;
	justify-content: space-between;
	align-items: center;
}
ul {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	height: 48px;
	li {
		width: 96px;
		height: 48px;
		text-align: center;
		line-height: 48px;
		cursor: pointer;
	}
}

.active {
	border-bottom: 2px solid @primary-color;
	height: 46px;
	line-height: 46px;
}
</style>
