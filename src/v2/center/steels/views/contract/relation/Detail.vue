<template>
	<div style="margin: -10px -20px -20px -20px;min-height: 100%">
		<div class="s-card">
			<div class="top-box">
				<div class="s-card-title">采销合同关联详情</div>
				<div class="s-card-content">
					<a-row
						v-if="relationContractDetail"
						style="position: relative"
					>
						<a-col
							:span="6"
							class="mt8"
						>
							<div
								:class="contractType === 0 ? 'active' : ''"
								@click="changeContractType(0)"
							>
								<div class="upstream stream">
									<strong style="width: 30px; display: block">上游</strong>
									<template>
										<a-tooltip>
											<template slot="title"> {{ relationContractDetail.upCompanyName }}</template>
											<div
												class="ellipsis"
												style="font-family: PingFangSC-Medium; width: calc(100% - 42px); line-height: 30px"
											>
												{{ relationContractDetail.upCompanyName }}
											</div>
										</a-tooltip>
									</template>
								</div>
							</div>
						</a-col>
						<a-col
							:span="12"
							class="mt8"
						>
							<div class="stream">
								<i class="line"></i>
								<div>
									<a-tooltip>
										<template slot="title">{{ relationContractDetail.currentCompanyName }}</template>
										<em>{{ relationContractDetail.currentCompanyName }}</em>
									</a-tooltip>
								</div>
							</div>
						</a-col>
						<a-col
							:span="6"
							class="mt8"
						>
							<div
								:class="contractType === 1 ? 'active' : ''"
								@click="changeContractType(1)"
							>
								<div class="downstream stream">
									<strong>下游</strong>
									<template>
										<a-tooltip>
											<template slot="title">{{ relationContractDetail.downCompanyName }}</template>
											<div
												class="ellipsis"
												style="font-family: PingFangSC-Medium; width: calc(100% - 42px); line-height: 30px"
											>
												{{ relationContractDetail.downCompanyName }}
											</div>
										</a-tooltip>
									</template>
								</div>
							</div>
						</a-col>
					</a-row>
				</div>
			</div>
			<div class="bottom-box">
				<a-tabs :activeKey="contractType">
					<a-tab-pane
						:key="0"
						:tab="0"
					>
						<div class="upstream-content">
							<RelationContract
								:key="0"
								v-if="contractType == 0"
								:contractType="contractType"
								:relationContractDetail="upstreamDetail"
							>
							</RelationContract>
						</div>
					</a-tab-pane>
					<a-tab-pane
						:key="1"
						:tab="1"
					>
						<div
							class="downstream-content"
							:key="1"
						>
							<RelationContract
								:key="1"
								v-if="contractType == 1"
								:contractType="contractType"
								:relationContractDetail="downstreamDetail"
							>
							</RelationContract>
						</div>
					</a-tab-pane>
				</a-tabs>
			</div>
		</div>
	</div>
</template>
<script>
import { API_SteelsRelationContractDetail } from '@/v2/center/steels/api/contract.js';
import RelationContract from './components/RelationContract';

export default {
	name: 'MonitoringDynamicMonitoringDetail',
	components: {
		RelationContract
	},

	data() {
		return {
			activeKey: 0,
			contractType: +this.$route.query.contractType,
			upstreamDetail: {}, // 上游详情
			downstreamDetail: {}, // 上游详情
			relationContractDetail: {} // 详情信息
		};
	},
	created() {
		this.getRelationContractDetail();
	},
	methods: {
		// 获取业务线详情数据
		getRelationContractDetail() {
			API_SteelsRelationContractDetail({ id: this.$route.query.id }).then(res => {
				if (res.success) {
					this.relationContractDetail = res.data || {};
					this.upstreamDetail = res.data.purchaseContract || {};
					this.downstreamDetail = res.data.salesContract || {};
				}
			});
		},
		// 切换合同类型
		changeContractType(type) {
			this.contractType = +type;
			this.$router.push({
				path: '/center/steels/relation/detail',
				query: {
					...this.$route.query,
					contractType: type,
					cashTabIndex: type
				}
			});
		}
	}
};
</script>
<style lang="less" scoped>
.bottom-box {
	::v-deep > div.ant-tabs > div.ant-tabs-top-bar {
		display: none;
	}
}
.s-card {
	font-family: PingFangSC-Regular;
	font-size: 12px;
	color: #141517;
}
.top-box {
	overflow: hidden;
	border-radius: 8px;
	background-color: #fff;
}
.top-box .s-card-title {
	margin-left: 16px;
	font-size: 16px;
	font-family: PingFangSC-Medium;
	line-height: 24px;
}
.top-box .s-card-content {
	border-top: 1px solid #eef0f2;
}
.top-box .ant-row {
	padding: 12px 25px;
}
.stream {
	padding: 16px 0 16px 14px;
	height: 64px;
	border: 1px solid transparent;
	cursor: pointer;
	position: relative;
}
.stream .line {
	display: inline-block;
	width: 100%;
	height: 1px;
	background: @primary-color;
}
.stream em {
	font-style: normal;
	color: #9ba0aa;
	position: relative;
	width: 100%;
	display: inline-block;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	line-height: 32px;
	font-size: 12px;
	text-align: center;
	color: @primary-color;
}
.stream span {
	font-family: PingFangSC-Medium;
	display: inline-block;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	flex: 38px 1;
	margin-top: -2px;
	font-size: 12px;
}
.stream p {
	font-size: 10px;
	color: #9ba0aa;
	position: absolute;
	top: 31px;
	left: 52px;
}
.upstream,
.downstream {
	display: flex;
}
.active .stream {
	border-color: rgba(0, 83, 219, 0.14);
	border-radius: 8px;
}
.active .stream span {
	color: @primary-color;
}
.anticon-down {
	position: relative;
	top: -3px;
}
.stream strong {
	display: inline-block;
	width: 30px;
	height: 30px;
	line-height: 26px;
	text-align: center;
	font-size: 10px;
	font-weight: normal;
	color: #fff;
	border-radius: 4px;
	background: rgba(39, 143, 255, 0.5);
	border: 2px solid #278fff;
	margin-right: 8px;
}
.downstream strong {
	background: rgba(0, 174, 157, 0.75);
	border: 2px solid #00ae9d;
}
.stream-info {
	padding: 16px;
	text-align: center;
}
.stream-info span {
	font-size: 16px;
	color: #383a3f;
	letter-spacing: 0;
	line-height: 24px;
}
.stream-info p {
	font-family: Rubik-Medium;
	font-size: 30px;
	color: #f24e4d;
	letter-spacing: 0;
}

.bottom-box {
	width: 100%;
	background-color: #fff;
	border-radius: 8px;
	margin-top: 8px;
}
.bottom-box > div {
	width: 100%;
}
.bottom-box .upstream-content,
.bottom-box .downstream-content {
	width: 100%;
	padding: 24px 16px 24px 25px;
}
.rejectBox p {
	margin-bottom: 8px;
	font-size: 14px;
}
</style>
