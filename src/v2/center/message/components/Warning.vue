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
		decorator: ['messageContent'],
		addonBeforeTitle: '预警内容',
		type: 'input',
		placeholder: '请输入预警内容'
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
		decorator: ['typeBelong'],
		addonBeforeTitle: '预警类型',
		type: 'select',
		allowClear: true,
		placeholder: '请选择',
		options: []
	},
	{
		decorator: ['industryType'],
		addonBeforeTitle: '业务品种',
		type: 'select',
		allowClear: true,
		placeholder: '请选择',
		options: [
			{
				label: '煤炭',
				value: 'COAL'
			},
			{
				label: '钢材',
				value: 'STEEL'
			}
		]
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
			status: '',
			columns: [
				{
					title: '预警内容',
					width: '400px',
					dataIndex: 'alertContent',
					customRender: (text, record) => (
						<a-tooltip
							placement="topLeft"
							title={record.alertContent}
						>
							<a
								class="col-sql"
								onClick={() => {
									this.jumpPage(record);
								}}
								title={text}
							>
								<span class="coaltype">{record.industry === 'STEEL' ? '钢材' : '煤炭'}</span>
								{text}
							</a>
						</a-tooltip>
					)
				},
				{ title: '预警时间', dataIndex: 'alertDate' },
				{ title: '风险等级', dataIndex: 'riskLevel', scopedSlots: { customRender: 'riskLevel' }, width: 100 },
				{ title: '状态', dataIndex: 'alertStatus', scopedSlots: { customRender: 'alertStatus' }, width: 120 },
				{
					title: '合同编号',
					dataIndex: 'contractNo',
					customRender: v => {
						return v || '-';
					}
				},
				{
					title: '业务线名称',
					dataIndex: 'businessLineName',
					customRender: v => {
						return v || '-';
					}
				},
				{ title: '预警流水号', dataIndex: 'serialNo' }
			],
			url: {
				list: API_GetWarningList
			},
			loading: false
		};
	},
	created() {
		this.getTypeBelong();
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
		if (this.$route.query.contractNo) {
			this.$nextTick(() => {
				let data = [{ name: '合同编号', value: this.$route.query.contractNo, key: 'contractNo', type: 'input' }];
				this.$refs.SlFormNew.searchArr = data;
				this.$refs.SlFormNew.form.setFieldsValue({
					contractNo: this.$route.query.contractNo
				});
			});
			this.handleChange({ contractNo: this.$route.query.contractNo });
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
			this.searchParams.alertStatus = this.status;
			this.changeSearch(data);
			this.$emit('getCount', data);
		},
		resetFunc() {
			this.status = '';
		},
		getTypeBelong() {
			API_GetAlertTypeBelongList().then(res => {
				if (res.success) {
					res.result.map(item => {
						item.label = item.text;
					});
					this.searchList[4].options = res.result;
				}
			});
		},
		tabChange(val) {
			this.searchParams.alertStatus = val;
			this.pagination.pageNo = 1;
			this.getList();
		},
		jumpPage(record) {
			if (['YJGS0001', 'YJGS0002'].includes(record.ruleNo)) {
				// 企业名称 和法定代表人变更
				if (this.VUEX_ST_COMPANYSUER.companyUserRoles.includes('admin')) {
					this.$router.push({
						path: '/center/account/company/info/change'
					});
				} else {
					this.$router.push({
						path: '/center/message/index'
					});
				}
			} else {
				if (['YJSF0016', 'YJSF0017'].includes(record.ruleNo)){ 
					// 陕煤物流监管-预警
					this.$router.push({
						path: '/center/message/riskControlLogisticSuperviseDetail',
						query: {
							id: record.id,
							ruleNo:  record.ruleNo,
						}
					});
				} else {
					this.$router.push({
						path: record.alertType === 'YJZS' ? '/center/message/riskControlCertDetail' : '/center/message/riskControlDetail',
						query: {
							id: record.id,
							orderType: record.buyerUscc === this.VUEX_ST_COMPANYSUER.companyUscc ? 'buy' : 'sell'
						}
					});
				}
			}
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
