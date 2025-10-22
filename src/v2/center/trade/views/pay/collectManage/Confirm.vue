<template>
	<PayCollectDetail :pageType="pageType">
		<template
			slot="bottomActions"
			slot-scope="{ detailInfo }"
		>
			<div class="bottom-confirm-btns">
				<a-space :size="30">
					<a-button
						class="bottom-btn"
						type="primary"
						ghost
						@click="cancel"
						>取消</a-button
					>
					<a-button
						class="bottom-btn"
						type="primary"
						ghost
						@click="reject(detailInfo)"
						>驳回</a-button
					>
					<a-button
						class="bottom-btn"
						type="primary"
						@click="confirm(detailInfo)"
						>确认</a-button
					>
				</a-space>
				<RejectModal ref="rejectModal" />
				<ConfirmModal ref="confirmModal" />
			</div>
		</template>
	</PayCollectDetail>
</template>

<script>
import PayCollectDetail from '../components/PayCollectDetail.vue';
import RejectModal from './components/RejectModal.vue';
import ConfirmModal from './components/ConfirmModal.vue';

export default {
	components: {
		PayCollectDetail,
		RejectModal,
		ConfirmModal
	},
	data() {
		return {
			pageType: 'COLLECT_CONFIRM' // 页面类型：付款'PAY' / 收款'COLLECT' / 收款确认'COLLECT_CONFIRM'
		};
	},
	methods: {
		cancel() {
			this.$router.back();
		},
		reject(detailInfo) {
			this.$refs.rejectModal.showModal(detailInfo.paymentNo);
		},
		confirm(detailInfo) {
			this.$refs.confirmModal.showModal(detailInfo);
		}
	}
};
</script>

<style lang="less" scoped>
.bottom-confirm-btns {
	margin-bottom: 20px;
	height: 64px;
	width: 100%;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	.bottom-btn {
		height: 32px;
		width: 88px;
		line-height: 32px;
		padding: 0 !important;
	}
}
</style>