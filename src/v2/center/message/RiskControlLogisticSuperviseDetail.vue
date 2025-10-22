<template>
	<div class="slMain warningDetail">
		<a-card :bordered="false">
			<div class="methods-wrap">
				<span class="slTitle">预警详情</span>
			</div>
			<div class="yj-content">
				<div class="slTitleAssis">基本信息</div>
				<ul class="grid-wrap">
					<li>
						<span class="label">预警日期</span>
						<span>{{ detail.alertDate }}</span>
					</li>
					<li>
						<span class="label">预警流水号</span>
						<span>{{ detail.serialNo }}</span>
					</li>
					<li>
						<span class="label">预警状态</span>
						<span>
							<i :class="`warning-status ${detail.alertStatus}`">
								{{ detail.alertStatusDesc }}
							</i>
						</span>
					</li>
					<li>
						<span class="label">预警内容</span>
						<TextOverFlow
							v-if="detail && detail.alertContent"
							:content="detail.alertContent"
							:maxWidth="maxWidth"
						/>
						<span v-else></span>
					</li>
					<li>
						<span class="label">规则名称</span>
						<TextOverFlow
							v-if="detail && detail.ruleName"
							:content="detail.ruleName"
							:maxWidth="maxWidth"
						/>
						<span v-else></span>
					</li>
					<li>
						<span class="label">合同编号</span>
						<TextOverFlow
							v-if="detail && detail.contractNo"
							:content="detail.contractNo"
							:maxWidth="maxWidth"
						/>
						<span v-else></span>
					</li>
					<li>
						<span class="label">托运人</span>
						<TextOverFlow
							v-if="detail && detail.buyerName"
							:content="detail.buyerName"
							:maxWidth="maxWidth"
						/>
						<span v-else></span>
					</li>
					<li>
						<span class="label">承运人</span>
						<TextOverFlow
							v-if="detail && detail.sellerName"
							:content="detail.sellerName"
							:maxWidth="maxWidth"
						/>
						<span v-else></span>
					</li>
					<li>
						<span class="label"></span>
						<span></span>
					</li>
				</ul>
			</div>
			<div class="yj-content">
				<div class="slTitleAssis">预警明细</div>
				<ul
					class="grid-wrap firstFull"
					v-if="$route.query.ruleNo === 'YJSF0016'"
				>
					<li>
						<span class="label">预警明细</span>
						<span>{{ detail.riskDetail }}</span>
					</li>
					<li>
						<span class="label">发货考核热值(kcal/kg)</span>
						<span>{{ detail.checkCalorificValue }}</span>
					</li>
					<li>
						<span class="label">收货化验热值(kcal/kg)</span>
						<span>{{ detail.receiveCheckCalorificValue }}</span>
					</li>
					<li>
						<span class="label"></span>
						<span></span>
					</li>
				</ul>
				<ul
					class="grid-wrap firstFull"
					v-if="$route.query.ruleNo === 'YJSF0017'"
				>
					<li>
						<span class="label">预警明细</span>
						<span>{{ detail.riskDetail }}</span>
					</li>
					<li>
						<span class="label">发货数量（吨）</span>
						<span>{{ detail.deliverQuantity }}</span>
					</li>
					<li>
						<span class="label">收货数量（吨）</span>
						<span>{{ detail.receiveQuantity }}</span>
					</li>
					<li>
						<span class="label"></span>
						<span></span>
					</li>
				</ul>
			</div>
			<div class="yj-content">
				<div class="slTitleAssis">处理明细</div>
				<a-table
					:columns="columns"
					rowKey="createTime"
					:dataSource="dataSource"
					:pagination="false"
					:loading="loading"
					:scroll="{ x: true }"
				>
				</a-table>
				<div class="btn-wrapper">
					<a-button @click="$router.push('/center/message/index')">返回</a-button>
				</div>
			</div>
		</a-card>
	</div>
</template>

<script>
import { API_riskAlertDetail } from '@/v2/center/monitoring/api';
import { mapGetters } from 'vuex';
import TextOverFlow from '@sub/components/TextOverflow.vue';

export default {
	data() {
		return {
			columns: [
				{ title: '操作时间', dataIndex: 'createTime' },
				{
					title: '操作人',
					dataIndex: 'createName',
					scopedSlots: { customRender: 'createName' }
				},
				{ title: '操作类型', dataIndex: 'operationTypeDesc' },
				{ title: '处理意见', dataIndex: 'remark' }
			],
			dataSource: [],
			loading: false,
			detail: {},
			form: {},
			maxWidth: 0,
			clientWidth: 0
		};
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		})
	},
	watch: {
		$route(to) {
			this.getDetail();
		},
		clientWidth: {
			handler: function () {
				this.getmaxWidth();
			},
			immediate: true
		}
	},
	components: {
		TextOverFlow
	},
	mounted() {
		this.clientWidth = document.body.clientWidth;
		window.onresize = () => {
			//屏幕尺寸变化就重新赋值
			return (() => {
				this.clientWidth = document.body.clientWidth;
			})();
		};
		this.getDetail();
	},
	methods: {
		getmaxWidth() {
			if (this.clientWidth >= 1920) {
				this.maxWidth = 280;
			}
			if (this.clientWidth < 1920) {
				this.maxWidth = 240;
			}
			if (this.clientWidth < 1560) {
				this.maxWidth = 180;
			}
		},
		getDetail() {
			API_riskAlertDetail({ id: this.$route.query.id, ruleNo: this.$route.query.ruleNo }).then(res => {
				if (res.success) {
					this.detail = res.result ? res.result.riskAlertRecordVO : {};
					this.dataSource = res.result ? res.result.processLogList : [];
				}
			});
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
	.grid-wrap {
		margin-top: 20px;
		width: 100%;
		border-radius: 3px;
		height: auto;
		overflow: hidden;
		border-left: 1px solid #e5e6eb;
		li {
			width: 33.3%;
			height: 48px;
			float: left;
			border-bottom: 1px solid #e5e6eb;
			border-right: 1px solid #e5e6eb;
			overflow: hidden;
			position: relative;
			span {
				display: inline-block;
				height: 48px;
				line-height: 48px;
				padding: 0 12px;
			}
			& > span:first-child {
				border-right: 1px solid #e5e6eb;
			}
			.label {
				width: 160px;
				background: #f3f5f6;
				font-family:
					PingFangSC-Regular,
					PingFang SC;
				font-weight: 400;
				color: #77889d;
				position: absolute;
				left: 0;
				top: 0;
			}
			span:last-child {
				width: 100%;
				padding-left: 172px;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
		}
		li:nth-child(1),
		li:nth-child(2),
		li:nth-child(3) {
			border-top: 1px solid #e5e6eb;
		}
		li:nth-child(3) {
			border-radius: 0 3px 0 0;
		}
		li:last-child {
			border-radius: 0 0 3px 0;
		}
		li.special {
			border-radius: 0 3px 3px 0;
		}
	}
	.grid-wrap.firstFull {
		li {
			border-top: none !important;
		}
		li:nth-child(1) {
			width: 100%;
			border-top: 1px solid #e5e6eb !important;
		}
	}
	.textOverflow {
		position: relative;
		top: 12px;
		left: 170px;
		height: 48px;
	}
	.warning-status {
		// display: inline-block;
		padding: 2px 6px;
		border-radius: 4px;
		font-size: 12px;
		background: #c1d7ff;
		color: #4682f3;
		cursor: pointer;
	}
	.warning-status.TO_BE_PROCESS {
		background: #c1d7ff;
		color: #4682f3;
	}
	.warning-status.PROCESSED {
		background: #c5ecdd;
		color: #3eb384;
	}
}
.warningDetail {
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
	.btn-wrapper {
		text-align: center;
		margin-top: 40px;
		button + button {
			margin-left: 50px;
		}
	}
}
</style>
