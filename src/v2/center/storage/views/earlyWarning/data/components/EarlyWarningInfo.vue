<template>
	<div class="slMain mt-10">
		<a-card :bordered="false">
			<div class="methods-wrap">
				<span
					slot="title"
					class="slTitle"
					>预警数据 - 详情页</span
				>
				<a-button
					ghost
					type="primary"
					@click="$router.go(-1)"
				>
					返回
				</a-button>
			</div>
			<div class="info">
				<div class="info-item">
					<a-descriptions
						title="预警信息"
						:column="2"
					>
						<a-descriptions-item label="预警流水号">
							{{ warning.serialNo }}
						</a-descriptions-item>
						<a-descriptions-item label="仓储企业">
							{{ warning.storageCompany }}
						</a-descriptions-item>
						<a-descriptions-item label="预警日期">
							{{ warning.createDate }}
						</a-descriptions-item>
						<a-descriptions-item label="预警类型">
							{{ warning.warningType }}
						</a-descriptions-item>
						<a-descriptions-item label="库点">
							{{ warning.depotPoint }}
						</a-descriptions-item>
						<a-descriptions-item label="预警等级">
							{{ warning.level }}
						</a-descriptions-item>
						<a-descriptions-item label="仓房">
							<!-- 核心企业有跳转权限 -->
							<template v-if="VUEX_ST_COMPANYSUER.companyType == 'CORE_COMPANY'">
								<a
									@click="
										jumpPage('/center/storageCenter/storehouse/detail', {
											id: warning.depotId,
											coreCompanyId: VUEX_ST_COMPANYSUER.companyId,
											batchId: warning.batchId
										})
									"
									>{{ warning.storehouse }}</a
								>
							</template>
							<template v-else>
								{{ warning.storehouse }}
							</template>
						</a-descriptions-item>
						<a-descriptions-item label="商品名称">
							{{ warning.grainName }}
						</a-descriptions-item>
						<a-descriptions-item
							label="预警内容"
							:span="2"
						>
							<a-alert
								class="a-alert"
								type="info"
								show-icon
								v-if="warning.warningContent"
							>
								<template slot="message">
									{{ warning.warningContent }}
								</template>
							</a-alert>
						</a-descriptions-item>
					</a-descriptions>
				</div>
				<div class="info-item">
					<a-descriptions
						title="预警跟踪"
						:column="2"
					>
					</a-descriptions>
					<a-table
						:columns="columns"
						rowKey="id"
						:dataSource="warningTrackings || []"
						:pagination="false"
					>
					</a-table>
				</div>
			</div>
		</a-card>
	</div>
</template>

<script>
import { API_GrainSituationGetEarlyWarningDetail } from '@/v2/center/storage/api';
import { mapGetters } from 'vuex';

const columns = [
	{
		title: '处理时间',
		dataIndex: 'createDate',
		align: 'center'
	},
	{
		title: '处理人',
		dataIndex: 'manager',
		align: 'center'
	},
	{
		title: '备注',
		dataIndex: 'content',
		align: 'center'
	}
];

export default {
	name: 'EarlyWarningInfo',
	props: {
		title: {
			type: String,
			default: ''
		},
		frequency: {
			type: String | Number,
			default: 1
		}
	},

	data() {
		return {
			columns,
			warning: {},
			warningTrackings: [],
			id: ''
		};
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		})
	},
	watch: {
		frequency() {
			//数据发生变化，刷新详情数据
			this.getDetail();
		}
	},
	methods: {
		jumpPage(path, data) {
			// 跳转页面
			this.$router.push({
				path,
				query: data
			});
		},
		//加载详情
		getDetail() {
			API_GrainSituationGetEarlyWarningDetail(this.id).then(res => {
				if (res.success) {
					this.warningTrackings = res.data.warningTrackings;
					this.warning = res.data.warning;
				}
			});
		}
	},
	created() {
		this.id = this.$route.query.id;
		if (this.id) {
			this.getDetail();
		} else {
			//如果没有id为异常，返回列表
			this.$router.push('/center/storageCenter/earlywarning/data');
		}
	}
};
</script>
<style lang="less" scoped>
.a-alert {
	display: inline-block;
	font-size: 12px;
	color: #383a3f;
	letter-spacing: 0;
	line-height: 18px;
	background: rgba(0, 83, 219, 0.1);
	border: 1px solid rgba(0, 83, 219, 0.5);
	border-radius: 4px;
}
.add {
	position: absolute;
	top: 12px;
	right: 24px;
}
.info {
	background: #ffffff;
	.info-item {
		margin-bottom: 16px;
		::v-deep .ant-descriptions-item-label {
			text-align: right;
			font-size: 14px;
			color: #999999;
			min-width: 130px;
		}
		::v-deep .ant-descriptions-item-content {
			font-size: 14px;
			color: rgba(0, 0, 0, 0.85);
			text-align: left;
			max-width: calc(100% - 130px);
		}
	}
}
</style>
