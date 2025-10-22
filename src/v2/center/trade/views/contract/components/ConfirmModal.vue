<template>
	<div>
		<a-modal
			class="slConfirmModal"
			:visible="visible"
			@cancel="close"
			title="提示"
			:maskClosable="false"
		>
			<div>
				<a-icon type="exclamation-circle" />
				确定要进行合同确认吗？
			</div>
			<template slot="footer">
				<a-button
					key="back"
					@click="visible = false"
					class="cancel-btn"
					>取消</a-button
				>
				<a-button
					type="primary"
					@click="confirm"
					>确定</a-button
				>
			</template>
		</a-modal>

		<a-modal
			class="slConfirmModal"
			:visible="stampVisible"
			@cancel="toList"
			v-if="flag"
			title="提示"
			:maskClosable="false"
		>
			<div>
				<a-icon type="exclamation-circle" />
				合同已确认，需要对合同进行盖章，是否现在进行盖章？
			</div>
			<template
				slot="footer"
				v-if="flag"
			>
				<a-button
					key="back"
					@click="toList"
					class="cancel-btn"
					>稍后盖章</a-button
				>
				<a-button
					type="primary"
					@click="toStamp"
					>现在去盖章</a-button
				>
			</template>
		</a-modal>
		<a-modal
			class="slConfirmModal"
			:visible="stampVisible"
			@cancel="toList"
			:footer="null"
			v-if="!flag"
			title="提示"
			:maskClosable="false"
		>
			<div style="margin-bottom: 24px">
				<a-icon type="exclamation-circle" />
				合同已确认，请联系签章员进行盖章。
			</div>
		</a-modal>
		<SelectApprovalProcess ref="selectApprovalProcess" />
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
import { orderConfirmToSeal } from '@/v2/center/trade/api/contract';
import SelectApprovalProcess from './SelectApprovalProcess.vue';
import { API_COMPANYOACHECK } from '@/v2/center/trade/api/goodsTransfer';

export default {
	data() {
		return {
			visible: false,
			info: {},
			stampVisible: false,
			flag: false,
			isOa: false
		};
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		})
	},
	components: {
		SelectApprovalProcess
	},
	mounted() {
		this.checkIsOa();
	},
	methods: {
		checkIsOa() {
			API_COMPANYOACHECK({ uscc: this.VUEX_ST_COMPANYSUER.companyUscc }).then(res => {
				if (res.success) {
					this.isOa = res.result;
				}
			});
		},
		show(info) {
			this.info = info;
			this.visible = true;
		},
		close() {
			this.visible = false;
		},
		async confirm() {
			if (this.isOa) {
				this.$refs.selectApprovalProcess.show({ id: this.info.id, initiatorUscc: this.info.initiatorUscc });
			} else {
				await orderConfirmToSeal(this.info.id);
				this.close();
				// 是否有签章权限
				this.flag = this.VUEX_ST_COMPANYSUER?.roles?.some(el => ['ADMIN', 'SIGNER'].includes(el.code));
				this.stampVisible = true;
			}
		},
		toStamp() {
			this.stampVisible = false;
			this.$router.push({
				path: '/center/contract/' + this.info.type.toLowerCase() + '/confirm/stamp',
				query: {
					id: this.info.id,
					serialNo: this.info.serialNo,
					type: this.info.type,
					initiatorUscc: this.info.initiatorUscc
				}
			});
		},
		toList() {
			this.stampVisible = false;
			this.$router.push({
				path: '/center/contract/' + this.info.type.toLowerCase() + '/list'
			});
		}
	}
};
</script>
<style lang="less" scoped>
.slConfirmModal {
	/deep/ .ant-modal-header {
		background: #f3f5f6;
	}
	/deep/ .ant-modal-title {
		font-weight: 500;
		font-size: 18px;
		color: rgba(0, 0, 0, 0.8);
	}
	/deep/ .ant-modal-body {
		padding: 24px;
	}
	/deep/ .ant-modal-footer {
		height: 64px;
		border-top: 1px solid #e8e8e8;
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		align-items: center;
		padding-bottom: 0;
	}
}
</style>
