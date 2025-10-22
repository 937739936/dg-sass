<template>
	<div>
		<a-table
			:columns="columns"
			:rowKey="record => record.detectTime"
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
import { API_GrainSituationPage } from '@/v2/center/storage/api';
import iPagination from "@sub/components/iPagination";

const baseColumns = [
	{
		title: '检测时间',
		fixed: 'left',
		dataIndex: 'detectTime',
		width: 120
	},
	{
		title: '外部温度(℃)',
		dataIndex: 'outTemp',
		width: 130
	},
	{
		title: '内部温度(℃)',
		dataIndex: 'inTemp',
		width: 130
	},
	{
		title: '外部湿度(%)',
		dataIndex: 'outHumidity',
		width: 130
	},
	{
		title: '内部湿度(%)',
		dataIndex: 'inHumidity',
		width: 130
	},
	{
		title: '仓库最高温(℃)',
		dataIndex: 'depotTempMax',
		width: 130
	},
	{
		title: '仓库平均温(℃)',
		dataIndex: 'depotTempAverage',
		width: 130
	},
	{
		title: '仓库最低温(℃)',
		dataIndex: 'depotTempMin',
		width: 130
	}
	// {
	//   title: '层1最高温(℃)',
	//   dataIndex: 'test.test',
	//   width: 150
	// },
	// {
	//   title: '层1平均温(℃)',
	//   dataIndex: 'layerTempJson[0].layer1TempHigh',
	//   width: 150
	// },
	// {
	//   title: '层1最低温(℃)',
	//   dataIndex: 'layerTempJson[1].layer1TempHigh',
	//   width: 150
	// },
];

export default {
	name: 'FoodData',

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
			columns: [],
			form: this.$form.createForm(this),
			dataSource: [
				{
					test: {
						test: 123
					},
					layerTempJson: [
						{
							layerTempHigh: 1,
							layerTempLow: 1,
							layerTempAverage: 1
						},
						{
							layerTempHigh: 2
						}
					]
				}
			],
			params: {
				tradeNo: ''
			},
			pagination: {
				type: '',
				total: 0, // 总条数
				pageNo: 1
			}
		};
	},

	created() {
		// this.getList();
		// setTimeout(() => {
		//   const arr = [];
		//   [1, 2, 3].forEach((item, index) => {
		//     arr.push(
		//       {
		//         title: `层${index + 1}最高温(℃)`,
		//         dataIndex: `layerTempJson[${index}].layerTempHigh`,
		//         width: 150
		//       },
		//       {
		//         title: `层${index + 1}平均温(℃)`,
		//         dataIndex: `layerTempJson[${index}].layerTempAverage`,
		//         width: 150
		//       },
		//       {
		//         title: `层${index + 1}最低温(℃)`,
		//         dataIndex: `layerTempJson[${index}].layerTempLow`,
		//         width: 150
		//       },
		//     )
		//   })
		//   this.columns = [
		//     ...baseColumns,
		//     ...arr
		//   ]
		// }, 1000)
	},

	computed: {},

	methods: {
		getList(pageNo = this.pagination.pageNo, pageSize = 10) {
			this.pagination.pageNo = pageNo;
			this.params.pageNo = pageNo;
			this.params.pageSize = pageSize;

			API_GrainSituationPage({
				...this.params,
				...this.dateObj,
				storehouseId: this.$route.query.id,
				coreCompanyId: this.coreCompanyId,
				batchId: this.$route.query.batchId
			}).then(res => {
				if (res.success) {
					this.dataSource = res.data.list;
					if (this.dataSource.length <= 0) {
						this.columns = [...baseColumns];
						return;
					}
					this.dataSource.forEach(item => {
						item.layerTempJson = (item.layerTempJson && JSON.parse(item.layerTempJson)) || {};
					});
					const arr = [];
					const tempData = new Array(Object.keys(this.dataSource[0].layerTempJson).length / 3).fill(0);
					tempData.forEach((item, index) => {
						arr.push(
							{
								title: `层${index + 1}最高温(℃)`,
								dataIndex: `layerTempJson.layer${index + 1}TempHigh`,
								width: 135
							},
							{
								title: `层${index + 1}平均温(℃)`,
								dataIndex: `layerTempJson.layer${index + 1}TempAverage`,
								width: 135
							},
							{
								title: `层${index + 1}最低温(℃)`,
								dataIndex: `layerTempJson.layer${index + 1}TempLow`,
								// fixed: index + 1 >= tempData.length ? 'right' : false,
								width: 135
							}
						);
					});
					/* this.dataSource.layerTempJson || [].forEach((item, index) => {
              arr.push(
                {
                  title: `层${index + 1}最高温(℃)`,
                  dataIndex: `layerTempJson[${index}].layerTempHigh`,
                  width: 150
                },
                {
                  title: `层${index + 1}平均温(℃)`,
                  dataIndex: `layerTempJson[${index}].layerTempAverage`,
                  width: 150
                },
                {
                  title: `层${index + 1}最低温(℃)`,
                  dataIndex: `layerTempJson[${index}].layerTempLow`,
                  width: 150
                },
              )
            }) */
					this.columns = [...baseColumns, ...arr];
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
