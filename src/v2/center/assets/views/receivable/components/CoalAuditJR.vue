<template>
	<div class="slMain">
		<Breadcrumb />

		<a-card :bordered="false">
			<div
				slot="title"
				class="slTitle"
			>
				<span>应收账款审核</span>
			</div>
			<DetailTitleInfo :detailData="detailData" />
		</a-card>
		<a-card
			:bordered="false"
			style="margin-top: 20px; padding-top: 0px"
		>
			<BaseInfo
				:detailData="detailData"
				:defaultIndex="activeIndex"
			></BaseInfo>
		</a-card>
		<div class="slDetailBottom">
			<a-space>
				<a-button
					type="primary"
					ghost
					@click="goBack"
					style="margin-right: 30px"
					>返回</a-button
				>
				<a-button
					type="primary"
					ghost
					style="margin-right: 30px"
					@click="rejectVisible = true"
					>驳回</a-button
				>
				<a-button
					type="primary"
					class="btn"
					@click="confirm"
					>通过</a-button
				>
			</a-space>
		</div>

		<a-modal
			class="slModal cancel-modal"
			:visible="rejectVisible"
			:width="460"
			@cancel="rejectVisible = false"
			title="确认驳回？"
		>
			<div class="tip"><span class="red">*</span> 请输入驳回原因：</div>
			<a-textarea
				v-model="rejectReason"
				style="border: 0"
				placeholder="请输入驳回原因,最多200字"
				:maxLength="200"
			/>

			<template slot="footer">
				<a-button
					key="back"
					@click="rejectVisible = false"
					class="cancel-btn"
					>取消</a-button
				>
				<a-button
					type="primary"
					@click="confirmCancel"
					v-debounceclick
					style="margin-left: 20px"
					>确定</a-button
				>
			</template>
		</a-modal>
		<TipModal
			ref="submitModal"
			@ok="confirmSubmit"
			title="确认提交"
			cancelBtnText="取消"
			okBtnText="提交"
		>
			<div class="tip-box">
				<p>确定要审核通过吗？</p>
			</div>
		</TipModal>
	</div>
</template>
<script>
import { API_GetAccountsDetailJR, API_AuditReceivableJR, API_AuditReceivableJRDownload } from '@/v2/center/assets/api/index.js';

import { filterCodeByValueName } from '@sub/utils/globalCode.js';
import Breadcrumb from '@/v2/components/breadcrumb/index';
import DetailTitleInfo from './detailJR/DetailTitleInfo.vue';
import BaseInfo from './detailJR/BaseInfo.vue';
import TipModal from '@sub/components/DelModal.vue';

export default {
	props: {
		defaultDetailData: {
			type: Array,
			default: () => {
				return [];
			}
		}
	},
	data() {
		return {
			filterCodeByValueName: filterCodeByValueName,
			activeIndex: this.$route.query.activeIndex,
			detailData: {}, // 详情数据
			currentStatus: {},
			showSTime: false,
			rejectVisible: false,
			rejectReason: ''
		};
	},
	watch: {
		defaultDetailData: {
			immediate: true,
			handler() {
				this.getDetail();
			}
		}
	},
	components: {
		DetailTitleInfo,
		BaseInfo,
		Breadcrumb,
		TipModal
	},
	mounted: function () {
		this.getDetail();
	},
	methods: {
		getDetail() {
			if (this.defaultDetailData?.length) {
				this.detailData = this.defaultDetailData[0];
				this.$nextTick(() => {
					this.tabChange(this.$route.query.activeIndex);
				});
			}
		},
		tabChange(index) {
			// 下游数据tabs切换
			this.activeIndex = index;
		},
		// 驳回
		async confirmCancel() {
			if (!this.rejectReason) {
				this.$message.error('请输入驳回原因');
				return;
			}
			API_AuditReceivableJR({
				assetId: this.$route.query.id,
				auditResult: 'REJECT',
				auditOption: this.rejectReason
			}).then(res => {
				if (res.success && res.data) {
					this.$message.success('驳回成功');
					this.goBack();
				}
			});
		},
		goBack() {
			this.$router.go(-1);
		},
		// 通过
		confirm() {
			this.$refs.submitModal.open();
		},
		async confirmSubmit() {
			this.$refs.submitModal.close();
			API_AuditReceivableJR({
				assetId: this.$route.query.id,
				auditResult: 'PASS',
				auditOption: this.rejectReason
			}).then(res => {
				if (res.success && res.data) {
					this.$message.success('提交审核成功');
					this.goBack();
				}
			});
		}
	}
};
</script>
<style lang="less" scoped>
.slTitle {
	margin-bottom: 20px;
}
.btn-box {
	width: calc(100% + 60px);
	margin-left: -30px;
	height: 64px;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	border-top: 1px solid #e5e6eb;
	background: #fff;
	box-sizing: border-box;
	position: sticky;
	bottom: 0;
	z-index: 9;
}
.btn-box .btn-wrap {
	margin: 0;
	padding: 0;
}
.slDetailBottom {
	width: calc(100vw - 254px);
	min-width: 1186px;
	height: 64px;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	border-top: 1px solid #e5e6eb;
	box-sizing: border-box;
	position: fixed;
	bottom: 0;
	z-index: 9;
}

.cancel-modal {
	/deep/ .ant-modal-header {
		background: #fff;
	}
	/deep/ .ant-modal-body {
		padding-top: 0;
		padding-bottom: 10px;

		textarea {
			border: none;
			height: 150px;
			padding: 14px;
			background: rgba(129, 145, 169, 0.1);
			font-size: 14px;
			color: #8191a9;
		}
	}
	/deep/ .ant-modal-footer {
		border-top: 0;
	}
	.cancel-btn {
		border-color: #c6cdd8;
		color: rgba(0, 0, 0, 0.8);
	}
}
textarea::-webkit-input-placeholder {
	color: #8191a9;
	font-size: 14px;
}

textarea::-webkit-input-placeholder {
	color: #8191a9;
	font-size: 14px;
}
textarea::-moz-placeholder {
	color: #8191a9;
	font-size: 14px;
}
textarea:-ms-input-placeholder {
	color: #8191a9;
	font-size: 14px;
}
textarea::placeholder {
	color: #8191a9;
	font-size: 14px;
}
.tip {
	color: rgba(0, 0, 0, 0.25);
	font-size: 14px;
	margin-bottom: 20px;
}
.red {
	color: #dd4444;
}
.tip-box {
	font-size: 14px;
	color: rgba(0, 0, 0, 0.5);
	margin-top: 15px;
	line-height: 24px;
	span {
		color: rgba(0, 0, 0, 0.8);
	}
}
</style>
