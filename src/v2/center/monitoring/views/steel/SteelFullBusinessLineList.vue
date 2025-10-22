<template>
	<div
		class="custom-card-title"
		:bordered="false"
	>
		<SlFormNew
			:list="searchList"
			layout="inline"
			@change="handleChange"
			@resetFunc="resetFunc"
		></SlFormNew>
		<div :class="'table-box ' + (pagination.total > 10 ? 'fixedBottom' : '')">
			<a-table
				:columns="columns"
				rowKey="id"
				:dataSource="dataSource"
				:pagination="false"
				:loading="loading"
				:scroll="{ x: true }"
				class="new-table"
			>
				<template
					slot="action"
					slot-scope="record"
				>
					<a @click="jumpPage(record.id)">查看</a>
				</template>
			</a-table>
			<i-pagination
				:pagination="pagination"
				@change="getList"
			/>
		</div>
	</div>
</template>

<script>
import { API_FullBusinessSteelLineList } from '@/v2/center/monitoring/api/index';
import iPagination from "@sub/components/iPagination";
import { filterSteelsCodeByKey } from '@sub/utils/globalCode.js';
import { mapGetters } from 'vuex';
import { getPopupContainer } from '@/v2/utils/factory';
import { ListMixin } from '@/v2/components/mixin/ListMixin';
import { isEqual } from 'lodash';
const searchList = [
	{
		decorator: ['contractNo'],
		addonBeforeTitle: '合同编号',
		type: 'input',
		placeholder: '请输入合同编号'
	},
	{
		decorator: ['companyName'],
		addonBeforeTitle: '企业名称',
		type: 'input',
		placeholder: '请输入企业名称'
	},
	{
		decorator: ['steelType'],
		addonBeforeTitle: '钢材种类',
		type: 'select',
		placeholder: '请选择',
		options: filterSteelsCodeByKey('steelType').map(item => {
			return item;
		})
	}
];
export default {
	mixins: [ListMixin],
	name: 'SteelFullBusinessLineList',
	components: {
		iPagination
	},
	data() {
		return {
			searchList,
			getPopupContainer,
			columns: [
				{ title: '钢材种类', dataIndex: 'steelType' },
				{ title: '交易参与企业', dataIndex: 'companyName', width: 350 },
				{ title: '合同编号', dataIndex: 'contractNo', width: 350 },
				{ title: '操作', scopedSlots: { customRender: 'action' }, fixed: 'right' }
			],
			dataSource: [],
			loading: false,
			pagination: {
				type: '',
				total: 0,
				pageNo: 1
			},
			url: {
				list: API_FullBusinessSteelLineList
			}
		};
	},

	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		})
	},

	methods: {
		handleChange(data) {
			if (isEqual(data, this.searchParams)) {
				return;
			}
			this.searchParams = data;
			this.changeSearch(data);
		},
		resetFunc() {
			this.pagination.pageNo = 1;
			this.getList();
		},

		jumpPage(id) {
			this.$router.push({
				path: '/center/monitoring/fullBusinessLine/steelDetail',
				query: {
					id
				}
			});
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less" scoped>
.custom-card-title {
	width: 100%;
}
.s-card-content {
	background: #fff;
	margin-bottom: 8px;
	.company-name-box {
		::v-deep.ant-select {
			width: 200px;
		}
	}
	ul {
		padding: 46px 0 15px 0;
		& > li {
			width: 20%;
			display: inline-block;
			p {
				font-family: PingFangSC-Regular;
				font-size: 14px;
				color: #383a3f;
				text-align: center;
				margin-bottom: 8px;
			}
			strong {
				display: block;
				font-weight: 500;
				font-family: Rubik-Regular;
				font-size: 24px;
				color: #f24e4d;
				text-align: center;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
		}
	}
}
</style>
