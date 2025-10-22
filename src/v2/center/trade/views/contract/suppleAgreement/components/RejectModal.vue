<template>
	<a-modal
		class="del-modal slModal"
		:visible="delVisible"
		:width="490"
		@cancel="delVisible = false"
		:title="info.title"
	>
		<p
			class="tip"
			v-if="type == 'reject'"
		>
			{{ info.text }}后，如再需签订补充协议，则需要重新走流程，如确需{{ info.text }}，请继续操作。
		</p>
		<p
			class="tip"
			v-else
		>
			作废后，如再需签订补充协议，则需要重新走流程，如确需作废，请继续操作。
		</p>

		<a-textarea
			class="textarea"
			v-model="remark"
			:placeholder="info.placeholder"
			:maxLength="200"
		/>

		<template slot="footer">
			<a-button
				key="back"
				@click="delVisible = false"
				class="cancel-btn"
				>{{ cancelBtnText }}</a-button
			>
			<a-button
				type="primary"
				@click="save"
				style="margin-left: 20px"
				>{{ okBtnText }}</a-button
			>
		</template>
	</a-modal>
</template>

<script>
import { receiverReject, receiverCancel } from '@/v2/center/trade/api/suppleAgreement';
export default {
	props: {
		title: {
			default: '确认删除'
		},
		tip: {
			default: ''
		},
		cancelBtnText: {
			default: '取消'
		},
		okBtnText: {
			default: '确定'
		},
		type: {
			default: 'reject'
		}
	},
	computed: {
		info() {
			if (this.type == 'reject') {
				return {
					title: ' 确认驳回？',
					text: '驳回',
					success: '驳回成功',
					placeholder: '请输入驳回原因，最多200字'
				};
			}
			return {
				title: ' 确认作废？',
				text: '作废',
				success: '作废成功',
				placeholder: '请输入作废原因，最多200字'
			};
		}
	},
	data() {
		return {
			delVisible: false,
			remark: ''
		};
	},
	methods: {
		open() {
			this.delVisible = true;
		},
		close() {
			this.delVisible = false;
		},
		async save() {
			if (!this.remark) {
				this.$message.error('请输入原因');
				return;
			}
			const params = {
				id: this.$route.query.id,
				remark: this.remark,
				isInitiator: this.$route.query.isInitiator == 'true' ? true : false
			};
			const Fn = this.type == 'reject' ? receiverReject : receiverCancel;

			const res = await Fn(params);
			this.delVisible = false;
			this.$message.success(this.info.success);
			// this.$router.go(-1)
			this.$router.push({
				path: '/center/contract/agreement/list'
			});
			this.$emit('save');
		}
	},
	components: {}
};
</script>

<style scoped lang="less">
/deep/ .ant-modal-body {
	padding-top: 0px;
	padding: 0px 20px;
}
/deep/ .ant-modal-header {
	background-color: #fff;
	padding: 16px 20px;
}
/deep/ .ant-modal-footer {
	border-top: 0;
	padding-top: 0;
}
.tip {
	color: var(--vi, #ff800f);
	font-family: PingFang SC;
	font-size: 14px;
}
.textarea {
	height: 150px;
	flex-shrink: 0;
	border-radius: 4px;
	background: rgba(129, 145, 169, 0.1);
	margin-top: 14px;
	margin-bottom: 20px;
	/deep/ .ant-input {
		height: 100%;
	}
}
</style>
