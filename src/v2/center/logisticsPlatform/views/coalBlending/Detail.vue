<template>
	<div class="slMain">
		<Breadcrumb />
		<a-card
			:bordered="false"
			class="content"
		>
			<div class="methods-wrap">
				<span
					slot="title"
					class="slTitle"
					>配煤详情
				</span>
			</div>
			<a-spin :spinning="loading">
				<template v-if="detailInfo.dataSource == 'STATION'">
					<div class="slTitleAssis">货主信息</div>
					<ShipperInfo
						:enableeEdit="false"
						:shipperList="[]"
						:shipperInfo="shipperInfo"
					/>
				</template>
				<template v-else>
					<div class="slTitleAssis">业务线信息</div>
					<BusinessLineInfo
						:enableeEdit="false"
						:businessLineDetail="detailInfo.businessLine"
						@handleBusinessLineClick="handleBusinessLineClick"
					/>
				</template>
				<div class="slTitleAssis">配煤信息</div>
				<CoalBlendingDetailInfo :detailInfo="detailInfo" :isManager="detailInfo.dataSource == 'STATION'" />
				<div class="remark-title">备注</div>
				<a-textarea
					class="remark-input"
					:disabled="true"
					v-model="detailInfo.remarks"
					placeholder="请输入备注信息，最多500字..."
				/>
				<div class="slTitleAssis">附件</div>
				<AttachmentTable :dataSource="detailInfo.attachments || []" />
			</a-spin>
			<div class="bottom-btn-box">
				<div class="btn-wrap">
					<a-button
						@click="$router.back()"
						type="primary"
						ghost
						>返回</a-button
					>
				</div>
			</div>
		</a-card>
	</div>
</template>

<script>
import Breadcrumb from '@/v2/components/breadcrumb/index';
import ShipperInfo from '@sub/logisticsPlatform/coalBlending/components/ShipperInfo';
import BusinessLineInfo from '@sub/logisticsPlatform/coalBlending/components/BusinessLineInfo';
import CoalBlendingDetailInfo from '@sub/logisticsPlatform/coalBlending/components/CoalBlendingDetailInfo';
import AttachmentTable from '@sub/logisticsPlatform/coalBlending/components/AttachmentTable';

import { getCoalBlendingeDetail } from '@/v2/center/logisticsPlatform/api/coalBlending';

export default {
	components: {
		Breadcrumb,
		ShipperInfo,
		BusinessLineInfo,
		CoalBlendingDetailInfo,
		AttachmentTable
	},
	data() {
		let { id } = this.$route.query;
		return {
			id,
			loading: false,
			detailInfo: {} // 配煤详情
		};
	},
	computed: {
		shipperInfo() {
			let { ownerCompanyUscc, ownerCompanyName } = this.detailInfo;
			let info = {
				ownerCompanyUscc,
				ownerCompanyName
			};
			return info;
		}
	},
	mounted() {
		this.getDetail();
	},
	methods: {
		// 获取配煤详情
		getDetail() {
			if (!this.id) {
				return;
			}
			this.loading = true;
			getCoalBlendingeDetail(this.id)
				.then(res => {
					if (!res.success) {
						return;
					}
					this.detailInfo = res.data;
				})
				.finally(() => {
					this.loading = false;
				});
		},
		// 点击业务线跳转到详情页
		handleBusinessLineClick(businessLineNo) {
			let routerData = this.$router.resolve({
				path: '/center/businessline/detail',
				query: {
					businessLineNo: businessLineNo
				}
			});
			window.open(routerData.href, '_blank');
		}
	}
};
</script>

<style lang="less" scoped>
.slMain {
	.ant-card {
		padding-bottom: 20px;
	}
	.slTitleAssis {
		margin: 30px 0 20px;
	}
	.remark-title {
		font-size: 14px;
		color: #00000066;
		margin-bottom: 10px;
		margin-top: 20px;
	}
	.remark-input {
		min-height: 96px;
		padding: 10px 14px;
		background: #ffffff;
	}
	.bottom-btn-box {
		margin-top: 100px;
		background: #ffffff;
		padding-top: 16px;
		// border-top: 1px solid #e5e6eb;
	}
	.bottom-btn-box .btn-wrap {
		margin: 0;
	}
}
</style>