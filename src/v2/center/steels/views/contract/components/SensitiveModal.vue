<template>
	<div>
		<a-modal
			title="敏感词提示"
			:visible="problemVisible"
			@cancel="problemVisible = false"
		>
			<p style="margin-bottom: 24px">
				您提交的数据中存在以下敏感词，建议您进行修改，如不修改，可能影响您合同后续的执行或融资，建议您线下先和平台运营或风控做好确认。
			</p>
			<p>敏感词列表：</p>
			<p>
				{{ problemList.join('、') }}
			</p>
			<div slot="footer">
				<a-button @click="continueNext">继续执行下一步</a-button>
				<a-button
					type="primary"
					@click="problemVisible = false"
					>返回修改</a-button
				>
			</div>
		</a-modal>
	</div>
</template>

<script>
export default {
	props: {
		problemList: {
			default: () => []
		}
	},
	data() {
		return {
			problemVisible: false
		};
	},
	methods: {
		continueNext() {
			this.problemVisible = false;
			this.$emit('continueNext');
		}
	},
	components: {}
};
</script>

<style scoped></style>
