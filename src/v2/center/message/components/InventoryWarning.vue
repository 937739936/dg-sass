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
				style="margin-top: 20px"
				:scroll="{ x: true }"
				:dataSource="dataSource"
				:pagination="false"
				:loading="loading"
			>
				<div
					slot="riskLevel"
					slot-scope="text, record"
				>
					<div @click="jumpPage(record)">
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
import { API_GetWarningList, API_GetAlertTypeBelongList, API_GetInventoryList, API_GetInventoryRuleNoList } from 'api';
import { mapGetters } from 'vuex';

const searchList = [
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
		decorator: ['contractNo'],
		addonBeforeTitle: '合同编号',
		type: 'input',
		placeholder: '请输入'
	},
	{
		decorator: ['sellerName'],
		addonBeforeTitle: '卖方名称',
		type: 'input',
		placeholder: '请输入卖方名称'
	},
	{
		decorator: ['buyerName'],
		addonBeforeTitle: '买方名称',
		type: 'input',
		placeholder: '请输入买方名称'
	},
	{
		decorator: ['ruleNo'],
		addonBeforeTitle: '规则名称',
		type: 'select',
		allowClear: true,
		placeholder: '请选择',
		options: []
	},
	{
		decorator: ['serialNo'],
		addonBeforeTitle: '预警流水号',
		type: 'input',
		placeholder: '请输入预警流水号'
	}
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
			searchParams: {
				ruleTypeList: 'INVENTORY'
			},
			status: '',
			columns: [
				{ title: '预警日期', dataIndex: 'alertDate' },
				{
					title: '预警内容',
					dataIndex: 'alertContent',
					customRender: (text, record) => (
						<a-tooltip
							placement="topLeft"
							title={record.alertContent}
						>
							<a
								href="javascript:;"
								class="col-sql"
								title={text}
								onClick={() => this.jumpPage(record)}
							>
								{text}
							</a>
						</a-tooltip>
					)
				},
				{ title: '规则名称', dataIndex: 'ruleName' },
				{ title: '预警流水号', dataIndex: 'serialNo' },
				{ title: '风险等级', dataIndex: 'riskLevel', scopedSlots: { customRender: 'riskLevel' } },
				{
					title: '下游合同',
					dataIndex: 'contractNo',
					customRender: v => {
						return v || '-';
					}
				},
				{
					title: '站台名称',
					dataIndex: 'stationName',
					customRender: v => {
						return v || '-';
					}
				},
				{
					title: '卖方名称',
					dataIndex: 'sellerName',
					customRender: v => {
						return v || '-';
					}
				},
				{
					title: '买方名称',
					dataIndex: 'buyerName',
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
				list: API_GetInventoryList
			},
			loading: false
		};
	},
	created() {
		this.getRuleNoList();
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
			this.searchParams.ruleTypeList = 'INVENTORY';
			this.changeSearch(data);
			this.$emit('getCount', data);
		},
		getRuleNoList() {
			API_GetInventoryRuleNoList({ ruleTypeList: 'INVENTORY' }).then(res => {
				if (res.success) {
					res.result.forEach(item => {
						item.label = item.ruleName;
						item.value = item.ruleNo;
					});
					this.searchList[5].options = res.result;
				}
			});
		},
		resetFunc() {
			this.status = '';
		},
		tabChange(val) {
			this.searchParams.status = val;
			this.pagination.pageNo = 1;
			this.getList();
		},
		jumpPage(record) {
			let path = '/center/message/inventoryDetail';
			if (record.ruleNo == 'YJKC006' || record.ruleNo == 'YJKC005') {
				// 放货指令 临额|超额
				path = '/center/message/instructDetail';
			}
			this.$router.push({
				path: path,
				query: {
					id: record.id,
					orderType: record.buyerUscc === this.VUEX_ST_COMPANYSUER.companyUscc ? 'buy' : 'sell'
				}
			});
		}
		// goDetail(record) {
		//   let path = '/center/message/inventoryDetail'
		//   this.$router.push({
		//     path,
		//     query: {
		//       id: record.id
		//     }
		//   });
		// }
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

.col-sql {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	display: inline-block;
	width: 300px;
}
</style>
