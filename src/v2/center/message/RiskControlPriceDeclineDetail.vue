<template>
	<div class="slMain warningDetail">
		<a-card :bordered="false">
			<div class="methods-wrap">
				<span class="slTitle">预警详情</span>
			</div>
			<div class="yj-content">
				<div class="slTitleAssis">基本信息</div>
				<a-row
					class="a-row"
					v-if="detail.baseInfo"
				>
					<a-col
						:span="12"
						class="row"
					>
						<a-form-item label="预警流水号">
							{{ detail.baseInfo.riskAlertRecordNo }}
						</a-form-item>
						<a-form-item label="预警类型">
							{{ detail.baseInfo.assessmentTypeDesc }}
						</a-form-item>
						<a-form-item label="预警状态">
							{{ detail.baseInfo.alertStatusDesc }}
						</a-form-item>
						<a-form-item label="合同编号">
							<a @click="openOrder">{{ detail.baseInfo.contractNo }}</a>
						</a-form-item>
						<a-form-item label="业务线号">
							<a @click="openLine">{{ detail.baseInfo.businessLineNo }}</a>
						</a-form-item>
						<a-form-item label="合同签订日期">
							{{ detail.baseInfo.signDate }}
						</a-form-item>
					</a-col>
					<a-col
						:span="12"
						class="row"
					>
						<a-form-item label="预警日期">
							{{ detail.baseInfo.createDate }}
						</a-form-item>
						<a-form-item label="预警名称">
							{{ detail.baseInfo.name }}
						</a-form-item>
						<a-form-item label="风险等级">
							{{ detail.baseInfo.riskLevelDesc }}
						</a-form-item>
						<a-form-item label="实际业务负责人">
							{{ detail.baseInfo.director }}-{{ detail.baseInfo.directorMobile }}
						</a-form-item>
						<a-form-item label="业务线名称">
							{{ detail.baseInfo.businessLineName }}
						</a-form-item>
						<a-form-item label="下跌幅度阈值"> {{ detail.baseInfo.declineAmplitude * 100 }}% </a-form-item>
					</a-col>
				</a-row>
			</div>

			<div
				class="yj-content"
				v-if="detail.riskAlertDetail"
			>
				<div class="slTitleAssis">
					预警明细
					<span
						>当前合同关联{{ detail.riskAlertDetail.indicatorNum }}个指标，共有{{
							detail.riskAlertDetail.reachAlertConditionNum
						}}个指标达到预警条件</span
					>
				</div>
				<a-table
					:columns="detailColumns"
					:scroll="{ x: true }"
					:pagination="false"
					:dataSource="detail.riskAlertDetail.indicatorDetails"
				>
					<div
						slot="range"
						slot-scope="text, record"
					>
						<div
							v-if="record.fluctuationRange"
							:class="record.fluctuationRangeType ? (record.fluctuationRangeType === 'FALL' ? 'green' : 'red') : 'gray'"
						>
							<span v-if="record.fluctuationRangeType === 'FALL'">-{{ (record.fluctuationRange * 100).toFixed(2) }}%</span>
							<span v-if="record.fluctuationRangeType && record.fluctuationRangeType !== 'FALL'"
								>+{{ (record.fluctuationRange * 100).toFixed(2) }}%</span
							>
							<span v-if="!record.fluctuationRangeType">{{ record.fluctuationRange }}%</span>
						</div>
					</div>
				</a-table>
			</div>

			<div class="yj-content">
				<div class="slTitleAssis">预警处理记录</div>
				<a-table
					:columns="columns"
					rowKey="createTime"
					:dataSource="dataSource"
					:pagination="false"
					:loading="loading"
					:scroll="{ x: true }"
				>
					<div
						slot="attachmentList"
						slot-scope="text, record"
					>
						<p
							v-for="(item, index) in record.attachmentList"
							:key="index"
						>
							<a @click="handlePreview(item)">{{ item.fileName }}</a>
						</p>
					</div>
				</a-table>

				<div
					class="btn-wrapper"
					v-if="!appealFlag"
				>
					<a-button @click="$router.push('/center/message/index')">返回</a-button>
				</div>
			</div>
		</a-card>
		<image-viewer ref="imageViewer" />
	</div>
</template>

<script>
import ENV from '@/v2/config/env';
import { API_GetPriceWarningDetail } from 'api';
import { mapGetters } from 'vuex';
import imageViewer from '@/v2/components/imageViewer.vue';
import { filePreview } from '@/v2/utils/file';
const detailColumns = [
	{ title: '指数名称', dataIndex: 'indexName' },
	{ title: '指标名称', dataIndex: 'indicatorName' },
	{ title: '更新频率', dataIndex: 'updateFrequencyDesc' },
	{ title: '商品种类', dataIndex: 'businessType' },
	{ title: '对应地点', dataIndex: 'location' },
	{ title: '指定日期价格', dataIndex: 'specifyDatePrice' },
	{ title: '触发预警时价格', dataIndex: 'riskTriggerPrice' },
	{ title: '涨跌幅度', dataIndex: 'range', scopedSlots: { customRender: 'range' } }
];
const columns = [
	{ title: '操作时间', dataIndex: 'createTime' },
	{ title: '操作人', dataIndex: 'createName' },
	{ title: '操作类型', dataIndex: 'operationTypeDesc' },
	{ title: '处理意见', dataIndex: 'remark' },
	{ title: '附件', dataIndex: 'attachmentList', scopedSlots: { customRender: 'attachmentList' } }
];

export default {
	data() {
		return {
			detailColumns,
			columns,
			BASE_NET: ENV.BASE_NET,
			dataSource: [],
			loading: false,
			pagination: {
				type: '',
				total: 0,
				pageNo: 1
			},
			params: {},
			detail: {},
			form: {},
			rules: {
				remark: [{ required: true, message: '请输入情况说明', trigger: 'blur' }]
			},
			fileInfos: [], // 从上传子组件传回的数据
			fileDataSource: [], // 从详情接口获取的数据
			appealFlag: false, // 是否申诉
			filesList: []
		};
	},
	components: {
		imageViewer
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		})
	},
	watch: {
		$route(to) {
			this.getDetail();
		}
	},
	mounted() {
		this.getDetail();
	},
	methods: {
		getDetail() {
			API_GetPriceWarningDetail({ id: this.$route.query.id }).then(res => {
				if (res.success) {
					this.detail = res.result || {};
					this.dataSource = res.result ? res.result.processLogs : [];
				}
			});
		},
		openOrder() {
			let path =
				'/center/contract/' +
				this.detail.baseInfo.contractType.toLocaleLowerCase() +
				'/' +
				this.detail.baseInfo.orderType.toLowerCase() +
				'/detail';
			const query = {
				id: this.detail.baseInfo.contractId,
				type: this.detail.baseInfo.contractType
			};
			const { href } = this.$router.resolve({
				path,
				query
			});

			window.open(href, '_new');
		},
		openLine() {
			const { href } = this.$router.resolve({
				path: '/center/monitoring/dynamicMonitoring/detail',
				query: {
					upOrderNo: this.detail.baseInfo.upOrderNo,
					downOrderNo: this.detail.baseInfo.downOrderNo,
					businessLineType: this.detail.baseInfo.businessLineType,
					contractContentActiveIndex: '0',
					cashTabIndex: '0',
					contractType: '0',
					downstreamActiveIndex: '0',
					businessLineNo: this.detail.baseInfo.businessLineNo
				}
			});
			window.open(href, '_new');
		},
		handlePreview(items) {
			filePreview(items.url, this.$refs.imageViewer.show);
		}
	}
};
</script>

<style lang="less" scoped>
.slMain {
	margin-top: -10px;
	.slTitleAssis {
		margin-bottom: 10px;
	}
}
.warningDetail {
	.title-content {
		height: 55px;
		background-color: #fff;
		padding-top: 16px;
		padding-left: 20px;
		border-bottom: 1px solid rgb(238, 240, 242);
	}
	::v-deep .ant-form-item {
		display: flex;
		margin-bottom: 15px;
	}
	background-color: #f4f5f8;
	.yj-content {
		background-color: #fff;
		margin-bottom: 10px;
		position: relative;
		border-radius: 2px;
	}
	.title {
		font-size: 15px;
		padding: 15px 0;
	}
	::v-deep .ant-form-item-label {
		label {
			font-size: 14px;
			color: rgba(0, 0, 0, 0.75);
			min-width: 100px;
			margin-right: 15px;
			display: inline-block;
			text-align: right;
		}
	}
	.btn {
		position: absolute;
		top: 30px;
		right: 30px;
		z-index: 99;
	}
	textarea {
		resize: none;
	}
	.appealBox ::v-deep.ant-form-item-control-wrapper {
		padding: 0 20px;
		width: 100%;
	}
	.tips {
		color: orange;
		a-text {
			margin-left: 5px;
		}
	}
	.btn-wrapper {
		text-align: center;
		margin-top: 40px;
		button + button {
			margin-left: 50px;
		}
	}
	.red {
		color: red;
	}
	.green {
		color: #0ccf0c;
	}
	.gray {
		color: #999;
	}
}
</style>
