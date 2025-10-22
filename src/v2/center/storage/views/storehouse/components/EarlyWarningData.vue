<template>
	<div>
		<SlFormNew
			:list="searchList"
			layout="inline"
			@change="changeSearch"
			ref="SlFormNew"
		></SlFormNew>
		<a-table
			class="new-table"
			:columns="columns"
			:rowKey="record => record.id"
			:dataSource="dataSource"
			:pagination="false"
			:loading="loading"
			:scroll="{ x: true }"
		>
		</a-table>
		<i-pagination
			:pagination="pagination"
			@change="getList"
		/>
	</div>
</template>

<script>
import { API_GrainSituationGetEarlyWarningByStorehouseId, API_GrainSituationEarlyWarningType } from '@/v2/center/storage/api';
import iPagination from "@sub/components/iPagination";
import { mapMutations } from 'vuex';
import { getPopupContainer } from '@/v2/utils/factory';
import { ListMixin } from '@/v2/components/mixin/ListMixin';

const columns = [
	{
		title: '预警流水号',
		fixed: 'left',
		dataIndex: 'earlyWarningNo'
	},
	{
		title: '预警日期',
		dataIndex: 'earlyWarningDate'
	},
	{
		title: '预警类型',
		dataIndex: 'earlyWarningType'
	},
	{
		title: '预警内容',
		dataIndex: 'earlyWarningContent'
	}
];

export default {
	mixins: [ListMixin],
	name: 'EarlyWarningData',
	components: {
		iPagination
	},

	data() {
		return {
			columns,
			getPopupContainer,
			earlyWarningType: [],
			dataSource: [],
			url: {
				list: API_GrainSituationGetEarlyWarningByStorehouseId
			},
			selfLoad: true,
			searchList: renderType(),
			defaultParams: {
				storehouseId: this.$route.query.id,
				batchId: this.$route.query.batchId
			}
		};
	},

	computed: {},

	async mounted() {
		this.getList();
		this.initData();
	},

	methods: {
		...mapMutations({
			VUEX_setListPamars: 'pagination/VUEX_setListPamars'
		}),
		initData() {
			return new Promise(async resolve => {
				await this.getType();
				this.getList();
				resolve(true);
			});
		},
		getType() {
			API_GrainSituationEarlyWarningType().then(res => {
				if (res.success) {
					this.earlyWarningType = res.data;
					this.searchList.forEach(item => {
						if (item.decorator[0] === 'earlyWarningType') {
							item.options = this.earlyWarningType.map(item => {
								return { value: item.key, label: item.value };
							});
						}
					});
				}
			});
		}
		// getList(
		//   pageNo = this.pagination.pageNo,
		//   pageSize = 10
		// ) {
		//   this.pagination.pageNo = pageNo;
		//   this.params.pageNo = pageNo;
		//   this.params.pageSize = pageSize;
		//   let params = {
		//     ...this.params,
		//     storehouseId: this.$route.query.id,
		//     batchId: this.$route.query.batchId,
		//   };
		//   if (this.earlyWarningDate && this.earlyWarningDate.length > 0) {
		//     params.earlyWarningStartDate =
		//       this.earlyWarningDate[0].format("YYYY-MM-DD") + " 00:00:00";
		//     params.earlyWarningEndDate =
		//       this.earlyWarningDate[1].format("YYYY-MM-DD") + " 23:59:59";
		//   } else {
		//     delete params.earlyWarningStartDate;
		//     delete params.earlyWarningEndDate;
		//   }
		//   API_GrainSituationGetEarlyWarningByStorehouseId(params).then((res) => {
		//     if (res.success) {
		//       this.dataSource = res.data.list;
		//       this.pagination.total = res.data.total;
		//     }
		//   });
		// },

		// search() {
		//   this.pagination.pageNo = 1;
		//   this.getList();
		// },

		// reset() {
		//   this.earlyWarningDate = [];
		//   this.params = {};
		//   this.pagination.pageNo = 1;
		//   this.getList();
		// },
	}
};
function renderType() {
	return [
		{
			decorator: ['earlyWarningNo'],
			addonBeforeTitle: '预警流水号',
			type: 'input',
			placeholder: '请输入预警流水号'
		},
		{
			decorator: ['earlyWarningDate'],
			addonBeforeTitle: '预警日期',
			type: 'rangePicker',
			realKey: ['earlyWarningStartDate', 'earlyWarningEndDate']
		},
		{
			decorator: ['earlyWarningType'],
			addonBeforeTitle: '预警类型',
			type: 'select',
			placeholder: '请选择预警类型',
			options: []
		}
	];
}
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less" scoped>
::v-deep {
	.ant-card-body {
		padding-top: 0px;
	}
	.ant-card-head-title {
		font-size: 16px;
		color: #141517;
		line-height: 24px;
		position: relative;
		padding-left: 10px;
	}
	.ant-form-item {
		display: block;
		margin-bottom: 14px;
	}
	.ant-form-item-label {
		padding-right: 5px;
	}
	.ant-calendar-picker {
		width: 100%;
	}
}
.search-btn {
	margin-right: 16px;
}
.setting-icon {
	display: inline-block;
	margin-left: 2px;
	font-size: 15px;
}
</style>
