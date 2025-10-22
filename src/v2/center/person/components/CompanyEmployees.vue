<template>
	<div
		style="width: 100%; overflow-x: hidden"
		class="center-user"
	>
		<div class="s-card">
			<div class="s-card-content">
				<div style="overflow: hidden"></div>
				<a-table
					:columns="columns"
					:data-source="dataSource"
					:scroll="{ x: true }"
					rowKey="id"
					:pagination="false"
				>
				</a-table>
				<i-pagination
					v-if="pagination.total > 10"
					:pagination="pagination"
					@change="handleTableChange"
				/>
			</div>
		</div>
	</div>
</template>

<script>
import { API_COMPANYUSERPAGE } from '@/v2/api/account';
import iPagination from "@sub/components/iPagination";

const columns = [
	{
		title: '姓名',
		fixed: 'left',
		dataIndex: 'name',
		width: 100,
		customRender: text => {
			return text || '-';
		}
	},
	{
		title: '手机号',
		dataIndex: 'mobile',
		width: 150,
		customRender: text => {
			return text || '-';
		}
	},
	{
		title: '性别',
		dataIndex: 'sex',
		width: 200
		// customRender: (text) => {
		//   switch(text) {
		//     case 1 :
		//       return '男'
		//     case 2 :
		//       return '女'
		//     case 3 :
		//       return '保密'
		//     default:
		//       return '-'
		//   }
		// }
	},
	{
		title: '实名认证',
		dataIndex: 'auth',
		width: 200,
		customRender: text => {
			if (text) {
				return '已认证';
			}
			return '未认证';
		}
	},
	{
		title: '角色',
		dataIndex: 'roles',
		width: 200,
		customRender: text => {
			return text.map(item => item.name).join('、');
		}
	}
];

export default {
	name: 'CompanyEmployees',

	components: {
		iPagination
	},
	data() {
		return {
			type: '',
			visible: false,
			columns: columns,
			pagination: {
				total: 0, // 总条数
				pageNo: 1,
				pageSize: 10
			},
			dataSource: []
		};
	},
	created() {
		this.fetchData();
	},
	computed: {},
	methods: {
		handleTableChange(page, size) {
			this.pagination.pageNo = page;
			this.pagination.pageSize = size;
			this.fetchData();
		},

		async fetchData() {
			const params = {
				pageNo: this.pagination.pageNo,
				pageSize: this.pagination.pageSize
			};
			let res = await API_COMPANYUSERPAGE(params);
			this.dataSource = res.success
				? res.data.content.map(item => {
						return {
							id: item.id,
							...item.personal,
							roles: item.roles
						};
					})
				: [];
			this.pagination.total = res.data?.totalElements;
		}
	}
};
</script>

//
<style lang="less" scoped>
//   .center-user {
//     .control-wrap {
//       a {
//         display: inline-block;
//         padding: 0 6px;
//       }
//     }
//     .ant-table-wrapper {
//       width: 100%;
//     }
//   }
//
</style>
