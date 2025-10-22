<template>
	<div>
		<a-table
			:columns="columns"
			:rowKey="record => record.id"
			:dataSource="dataSource"
			:pagination="false"
			:scroll="{ x: 1000 }"
		>
			<span
				slot="receiverName"
				slot-scope="receiverName"
			>
				{{ receiverName || '-' }}
			</span>
		</a-table>
		<i-pagination
			:pagination="pagination"
			@change="getList"
		/>
	</div>
</template>

<script>
import { API_GrainSituationGasReport } from '@/v2/center/storage/api';
import iPagination from "@sub/components/iPagination";

const columns = [
	{
		title: '检测时间',
		fixed: 'left',
		dataIndex: 'detectTime',
		width: 200
	},
	{
		title: '氧气含量(%)',
		dataIndex: 'o2Content',
		width: 135
	},
	{
		title: '氮气含量(%)',
		dataIndex: 'n2Content',
		width: 135
	},
	{
		title: '二氧化碳含量(PPM)',
		dataIndex: 'co2Content',
		width: 150
	},
	{
		title: '磷化氢含量(mg/m³)',
		dataIndex: 'ph3Content',
		width: 160
	},
	{
		title: '一氧化碳含量(PPM)',
		dataIndex: 'coContent',
		fixed: 'right',
		width: 160
	}
];

export default {
	name: 'GasReport',

	props: {
		dateObj: {
			type: Object,
			default: () => {}
		},
		coreCompanyId: {
			type: String,
			default: ''
		}
	},

	components: {
		iPagination
	},

	data() {
		return {
			columns,
			form: this.$form.createForm(this),
			dataSource: [],
			params: {},
			pagination: {
				type: '',
				total: 0, // 总条数
				pageNo: 1
			}
		};
	},

	methods: {
		getList(pageNo = this.pagination.pageNo, pageSize = 10) {
			this.pagination.pageNo = pageNo;
			this.params.pageNo = pageNo;
			this.params.pageSize = pageSize;
			API_GrainSituationGasReport({
				...this.params,
				...this.dateObj,
				storehouseId: this.$route.query.id,
				coreCompanyId: this.coreCompanyId,
				batchId: this.$route.query.batchId
			}).then(res => {
				if (res.success) {
					this.dataSource = res.data.list;
					this.pagination.total = res.data.total;
				}
			});
		},

		search() {
			this.pagination.pageNo = 1;
			this.getList();
		}
	}
};
</script>
