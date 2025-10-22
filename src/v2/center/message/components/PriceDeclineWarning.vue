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
			@searchChange="getMarketIndicatorSelectVo"
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
					v-if="item.text"
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
				<div
					slot="indicatorNameList"
					slot-scope="text, record"
				>
					<span
						v-for="(item, index) in record.indicatorNameList"
						:key="index"
						>{{ item
						}}<em
							v-if="index < text.length - 1"
							style="font-style: normal"
							>；</em
						></span
					>
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
import { API_GetPriceWarningList } from 'api';
import { mapGetters } from 'vuex';
import { API_GetMarketIndicatorSelectVo } from '@/v2/center/trade/api/contract';
import { debounce } from 'lodash';

const searchList = [
	{
		decorator: ['alertDate'],
		addonBeforeTitle: '预警日期',
		type: 'rangePicker',
		allowClear: true,
		valueFormat: 'YYYY-MM-DD',
		format: 'YYYY-MM-DD',
		realKey: ['alertRiskDateStart', 'alertRiskDateEnd']
	},
	{
		decorator: ['indicatorId'],
		addonBeforeTitle: '触发预警指标',
		type: 'selectOptGroup',
		placeholder: '请输入指标名称',
		options: [],
		search: true
	},
	{
		decorator: ['contractNo'],
		addonBeforeTitle: '合同编号',
		type: 'input',
		placeholder: '请输入合同编号'
	}
];
export default {
	mixins: [ListMixin],
	data() {
		return {
			getPopupContainer,
			searchList,
			status: '',
			columns: [
				{
					title: '预警内容',
					width: '400px',
					dataIndex: 'detail',
					customRender: (text, record) => (
						<a-tooltip
							placement="topLeft"
							title={record.detail}
						>
							<a
								class="col-sql"
								onClick={() => {
									this.jumpPage(record);
								}}
								title={text}
							>
								{text}
							</a>
						</a-tooltip>
					)
				},
				{ title: '预警日期', dataIndex: 'createDate' },
				{ title: '风险等级', dataIndex: 'riskLevel', scopedSlots: { customRender: 'riskLevel' } },
				{ title: '预警状态', dataIndex: 'alertStatus', scopedSlots: { customRender: 'alertStatus' } },
				{ title: '触发指标', dataIndex: 'indicatorNameList', scopedSlots: { customRender: 'indicatorNameList' } },
				{ title: '合同编号', dataIndex: 'contractNo' }
			],
			url: {
				list: API_GetPriceWarningList
			},
			loading: false,
			indicatorSelectVo: []
		};
	},
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
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		})
	},
	async mounted() {
		this.initData();
	},
	methods: {
		initData() {
			return new Promise(async resolve => {
				await this.getMarketIndicatorSelectVo();
				resolve(true);
			});
		},
		// 仓押业务-关联盯市指标
		getMarketIndicatorSelectVo: debounce(function (keyword) {
			API_GetMarketIndicatorSelectVo({
				marketIndexTypeEnum: null,
				searchKey: keyword
			}).then(res => {
				if (res.success) {
					this.indicatorSelectVo = res.result || [];
					this.searchList.forEach(item => {
						if (item.decorator[0] === 'indicatorId') {
							item.options = this.indicatorSelectVo;
						}
					});
				}
			});
		}),
		handleChange(data) {
			this.searchParams = data;
			this.searchParams.alertStatus = this.status;
			this.searchParams.status = this.status;
			this.changeSearch(data);
			this.$emit('getCount', data);
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
			this.$router.push({
				path: '/center/message/riskControlPriceDeclineDetail',
				query: {
					id: record.id
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
