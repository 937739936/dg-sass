<template>
	<div>
		<a-result
			status="success"
			title="操作完成"
			sub-title=""
		>
			<template #extra>
				<a-button
					key="console"
					type="primary"
					@click="again"
				>
					再次申请提单
				</a-button>
				<a-button
					key="buy"
					@click="record"
				>
					查看提单记录
				</a-button>
			</template>
		</a-result>
	</div>
</template>

<script>
export default {
	methods: {
		again() {
			this.$emit('next', 0);
		},
		record() {
			this.$router.back();
		}
	}
};
</script>

<style></style>
