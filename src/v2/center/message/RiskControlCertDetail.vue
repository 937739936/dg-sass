<template>
	<div class="slMain warningDetail">
		<a-card :bordered="false">
			<div class="methods-wrap">
				<span class="slTitle">预警详情</span>
			</div>
			<div class="yj-content">
				<div class="slTitleAssis">基本信息</div>
				<a-row class="a-row">
					<a-col
						:span="12"
						class="row"
					>
						<a-form-item label="预警流水号">
							{{ detail.serialNo }}
						</a-form-item>
						<a-form-item label="预警类型">
							{{ detail.alertTypeDesc }}
						</a-form-item>
						<a-form-item label="预警状态">
							{{ detail.alertStatusDesc }}
						</a-form-item>
						<a-form-item label="预警处理企业">
							{{ detail.processCompanyName }}
						</a-form-item>
						<a-form-item label="证书编号">
							{{ detail.businessNo }}
						</a-form-item>
					</a-col>
					<a-col
						:span="12"
						class="row"
					>
						<a-form-item label="预警日期">
							{{ detail.alertDate }}
						</a-form-item>
						<a-form-item label="预警名称">
							{{ detail.ruleName }}
						</a-form-item>
						<a-form-item label="风险等级">
							{{ detail.riskLevelDesc }}
						</a-form-item>
						<a-form-item label="签章员">
							{{ detail.signerInfo }}
						</a-form-item>
						<a-form-item label="证书到期日">
							{{ detail.certEndTime }}
						</a-form-item>
					</a-col>
				</a-row>
			</div>

			<div class="yj-content">
				<div class="slTitleAssis">预警明细</div>
				<a-button
					type="primary"
					class="btn"
					@click="renewal"
					v-if="detail.alertStatus === 'TO_BE_PROCESS' || detail.alertStatus === 'FOLLOWED'"
					>证书续期</a-button
				>
				<a-row class="a-row">
					<a-col
						:span="24"
						class="row"
					>
						<a-form-item label="预警内容">
							{{ detail.alertContent || '' }}
						</a-form-item>
					</a-col>
				</a-row>
				<a-row class="a-row">
					<a-col
						:span="24"
						class="row"
					>
						<a-form-item label="预警明细">
							{{ detail.riskDetail || '' }}
						</a-form-item>
					</a-col>
				</a-row>
			</div>

			<div class="btn-wrapper">
				<a-button @click="$router.push('/center/message/index')">返回</a-button>
			</div>
		</a-card>
	</div>
</template>

<script>
import { API_riskAlertDetail } from '@/v2/center/monitoring/api';

export default {
	data() {
		return {
			loading: false,
			detail: {}
		};
	},
	watch: {
		$route() {
			this.getDetail();
		}
	},
	mounted() {
		this.getDetail();
	},
	methods: {
		getDetail() {
			API_riskAlertDetail({ id: this.$route.query.id }).then(res => {
				if (res.success) {
					this.detail = res.result ? res.result.riskAlertRecordVO : {};
				}
			});
		},
		renewal() {
			this.$router.push({
				path: '/center/account/company/info',
				query: {
					type: 'activateSeal'
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
	}
	textarea {
		resize: none;
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
}
</style>
