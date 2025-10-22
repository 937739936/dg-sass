<template>
	<router-view :key="key" />
</template>

<script>
export default {
	computed: {
		key() {
			// 只要保证 key 唯一性就可以了，保证不同页面的 key 不相同
			return this.$route.fullPath;
		}
	}
};
</script>

<style></style>
