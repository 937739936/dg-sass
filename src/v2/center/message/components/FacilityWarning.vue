<template>
	<div>
		<SlFormNew
			:list="searchList"
			layout="inline"
			ref="SlFormNew"
			@change="handleChange"
			:isShowIcon="false"
			:isShowSearchBox="true"
			@resetFunc="resetFunc"
		></SlFormNew>
		<!-- tabs -->

		<div class="tabs-box">
			<a-tabs
				v-model="status"
				@change="tabChange"
			>
				<a-tab-pane key="">
					<div slot="tab">全部({{ warningTotal }})</div>
				</a-tab-pane>
				<a-tab-pane
					:key="item.value"
					v-for="item in warningTabCountList"
				>
					<div slot="tab">{{ item.text }}({{ item.count }})</div>
				</a-tab-pane>
			</a-tabs>
		</div>
		<!-- 表格 -->
		<div :class="'table-box ' + (pagination.total > 10 ? 'fixedBottom ' : ' ')">
			<a-table
				:columns="columns"
				class="new-table"
				rowKey="id"
				style="margin-top: 50px"
				:scroll="{ x: true }"
				:dataSource="dataSource"
				:pagination="false"
				:loading="loading"
				:customRow="rowClick"
			>
				<div
					slot="riskLevel"
					slot-scope="text, record"
				>
					<img
						src="@/assets/imgs/warning/high.png"
						alt=""
						v-if="text === 'HIGH'"
						style="width: 10px; margin-right: 4px"
					/>
					<img
						src="@/assets/imgs/warning/medium.png"
						alt=""
						v-if="text === 'MEDIUM'"
						style="width: 10px; margin-right: 4px"
					/>
					<img
						src="@/assets/imgs/warning/low.png"
						alt=""
						v-if="text === 'LOW'"
						style="width: 10px; margin-right: 4px"
					/>
					<span :class="text">
						{{ record.riskLevelDesc }}
					</span>
				</div>
				<div
					slot="alertStatus"
					slot-scope="text, record"
				>
					<div :class="`warning-status ${text}`">{{ record.alertStatusDesc }}</div>
				</div>
			</a-table>
			<i-pagination
				:pagination="pagination"
				size="small"
				@change="getList"
			/>
		</div>
	</div>
</template>

<script>
import { ListMixin } from '@/v2/components/mixin/ListMixin';
import { getPopupContainer } from '@/v2/utils/factory.js';
import { API_GetWarningList, API_GetAlertTypeBelongList } from 'api';
import { getSubsystemOptions } from '@/v2/center/logisticsPlatform/api';
import { mapGetters } from 'vuex';

const searchList = [
	{
		decorator: ['ruleNo'],
		addonBeforeTitle: '规则名称',
		type: 'select',
		allowClear: true,
		placeholder: '请选择',
		options: [
			{ value: 'YJSXT0001', label: '摄像头掉线（站台）' }
			// {value: 'YJSXT0002', label: '摄像头被遮挡（站台）'},
		]
	},
	{
		decorator: ['riskLevel'],
		addonBeforeTitle: '风险等级',
		type: 'select',
		allowClear: true,
		placeholder: '请选择',
		options: [
			{
				label: '高',
				value: 'HIGH'
			},
			{
				label: '中',
				value: 'MEDIUM'
			},
			{
				label: '低',
				value: 'LOW'
			}
		]
	},
	{
		decorator: ['stationIdList'],
		addonBeforeTitle: '仓库名称',
		type: 'select',
		allowClear: true,
		placeholder: '请选择',
		options: []
	},
	{
		decorator: ['contacts'],
		addonBeforeTitle: '仓库联系人',
		type: 'input',
		placeholder: '请输入'
	},
	{
		decorator: ['alertDate'],
		addonBeforeTitle: '预警日期',
		type: 'rangePicker',
		allowClear: true,
		valueFormat: 'YYYY-MM-DD',
		format: 'YYYY-MM-DD',
		realKey: ['alertDateStart', 'alertDateEnd']
	},
	{
		decorator: ['recordNo'],
		addonBeforeTitle: '预警流水号',
		type: 'input',
		placeholder: '请输入'
	}
	// {
	//   decorator: ['alertStatus'],
	//   addonBeforeTitle: '预警状态',
	//   type: 'select',
	//   allowClear: true,
	//   placeholder: '请选择',
	//   options: [
	//     {
	//       label: '待处理',
	//       value: 'TO_BE_PROCESS'
	//     },
	//     {
	//       label: '已跟进',
	//       value: 'FOLLOWED'
	//     },
	//     {
	//       label: '已处理',
	//       value: 'PROCESSED'
	//     }
	//   ]
	// }
];
export default {
	mixins: [ListMixin],
	props: {
		warningTabCountList: {
			type: Array,
			default: () => []
		},
		warningTotal: {
			type: Number,
			default: () => {
				return 0;
			}
		}
	},
	data() {
		return {
			getPopupContainer,
			searchList,
			status: '',
			columns: [
				{ title: '预警日期', dataIndex: 'alertDate' },
				{
					title: '预警内容',
					width: '400px',
					dataIndex: 'messageContent',
					customRender: (text, record) => (
						<a-tooltip
							placement="topLeft"
							title={record.messageContent}
						>
							<a
								class="col-sql"
								title={text}
							>
								<span class="coaltype">{record.alertTypeBelong === 'GOODS_VALUE' ? '钢材' : '煤炭'}</span>
								{text}
							</a>
						</a-tooltip>
					)
				},
				{ title: '风险等级', dataIndex: 'riskLevel', scopedSlots: { customRender: 'riskLevel' } },
				{ title: '预警状态', dataIndex: 'alertStatus', scopedSlots: { customRender: 'alertStatus' } },
				{
					title: '规则名称',
					dataIndex: 'ruleName',
					customRender: v => {
						return v || '-';
					}
				},
				{
					title: '仓库名称',
					dataIndex: 'bindingName',
					customRender: v => {
						return v || '-';
					}
				},
				{ title: '仓库联系人', dataIndex: 'contacts', customRender: v => v || '-' },
				{
					title: '最新跟踪时间',
					dataIndex: 'followTime',
					customRender: v => {
						return v || '-';
					}
				},
				{
					title: '预警解除时间',
					dataIndex: 'updateTime',
					customRender: v => {
						return v || '-';
					}
				}
			],
			url: {
				list: API_GetWarningList
			},
			loading: false,
			selfLoad: true
		};
	},
	async created() {
		await this.getSubsystemOptions();
		if (this.$route.query.riskLevel) {
			this.handleChange({ riskLevel: this.$route.query.riskLevel });
			let riskLevelDesc = '';
			switch (this.$route.query.riskLevel) {
				case 'HIGH':
					riskLevelDesc = '高';
					break;
				case 'MEDIUM':
					riskLevelDesc = '中';
					break;
				default:
					riskLevelDesc = '低';
					break;
			}
			let data = [{ name: '风险等级', value: riskLevelDesc, key: 'riskLevel', type: 'select' }];
			this.$nextTick(() => {
				this.$refs.SlFormNew.searchArr = data;
				this.$refs.SlFormNew.form.setFieldsValue({
					riskLevel: {
						key: this.$route.query.riskLevel,
						label: riskLevelDesc
					}
				});
			});
		}
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		})
	},
	methods: {
		handleChange(data) {
			this.searchParams = data;
			this.searchParams.status = this.status;
			this.searchParams.alertStatus = this.status;
			this.searchParams.stationIdList = data.stationIdList || this.defaultParams.stationIdList;
			this.searchParams.ruleType = this.defaultParams.ruleType;
			this.changeSearch(data);
			this.$emit('getCount', data);
		},
		resetFunc() {
			this.status = '';
		},
		tabChange(val) {
			this.searchParams.alertStatus = val;
			this.pagination.pageNo = 1;
			this.getList();
		},
		rowClick(item) {
			return {
				on: {
					click: () => {
						this.$router.push({
							path: '/center/message/facilityDetail',
							query: {
								id: item.id
							}
						});
					}
				}
			};
		},
		// 获取仓库列表
		async getSubsystemOptions() {
			const params2 = {
				t: Math.random()
			};
			const res = await getSubsystemOptions(params2);
			let list = res.data || [];
			let stationId = '';
			list.forEach(el => {
				// 这里由之前的stationId 改为后端新增的id(用于修复stationId错误问题)
				el.value = el.id;
				stationId = el.id;
			});

			if (this.VUEX_ST_COMPANYSUER.companyType == 'WAREHOUSE') {
				list = [
					{
						value: stationId,
						stationId,
						label: this.VUEX_ST_COMPANYSUER.company.abbreviation
					}
				];
			}

			this.searchList[2].options = list;

			this.defaultParams.stationIdList = list.map(el => el.value).join();

			this.defaultParams.ruleType = 'DEVICE';

			this.$emit('getCount', this.defaultParams);
			this.getList(1);
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less" scoped>
.slMain {
	margin-top: -10px;

	/deep/ .ant-card-head .ant-card-head-title {
		border-bottom: 1px solid #e5e6eb;
		padding-bottom: 20px;
		margin-bottom: 10px;
	}
}

/deep/ .ant-tabs {
	// margin-top: 0;
}
.tabs-box {
	position: relative;
	margin-top: 40px;

	::v-deep.ant-tabs-bar {
		padding-right: 90px;
	}
	/deep/ .ant-tabs-tab {
		margin-right: 28px !important;
	}
}

.table-box.fixedBottom {
	.new-table {
		margin-bottom: 2px;
	}

	.slPagination {
		margin-top: 10px;
		width: calc(100% - 254px);
		min-width: 1186px;
		background: #fff;
		padding: 10px 30px;
		position: fixed;
		bottom: 0;
		z-index: 1;
		left: 228px;
	}
}
.col-sql {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	display: inline-block;
	width: 400px;
	cursor: pointer;
}

.warning-status {
	display: inline-block;
	padding: 4px 6px;
	border-radius: 4px;
	font-size: 12px;
	background: #c1d7ff;
	color: #4682f3;
	cursor: pointer;
}
.coaltype {
	display: inline-block;
	padding: 2px 3px;
	border-radius: 4px;
	font-size: 12px;
	background: rgb(230, 239, 252);
	color: #4682f3;
	margin-right: 8px;
}

.warning-status.TO_BE_PROCESS {
	background: #c1d7ff;
	color: #4682f3;
}

.warning-status.DELAY_HANDLE {
	background: #ffdbc8;
	color: #ff7937;
}

.warning-status.TO_BE_APPROVED {
	background: #ffdbc8;
	color: #ff7937;
}

.warning-status.APPROVED_REJECT {
	background: #f8dde8;
	color: #db81a5;
}

.warning-status.PROCESSED {
	background: #c5ecdd;
	color: #3eb384;
}

.warning-status.ARTIFICIAL_PROCESSED {
	background: #c5ecdd;
	color: #3eb384;
}
.HIGH {
	color: #f25f56;
}
.MEDIUM {
	color: #f5822e;
}
.LOW {
	color: #147cf6;
}
.slPagination {
	width: calc(100% - 35px) !important;
	left: 20px !important;
}
</style>
