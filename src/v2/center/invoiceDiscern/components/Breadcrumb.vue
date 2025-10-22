<template>
	<div class="breadcrumb">
		<span @click="goBack">发票识别</span>
		<span style="margin: 0 3px">/</span>
		<span>{{ name }} </span>
	</div>
</template>

<script>
export default {
	props: {
		name: {
			default: '发票新增'
		}
	},
	data() {
		return {};
	},
	methods: {
		goBack() {
			this.$router.push({
				path: '/invoice/discern/list'
			});
		}
	},
	components: {}
};
</script>

<style scoped lang="less">
.breadcrumb {
	position: fixed;
	top: 64px;
	left: 20px;
	width: 100%;
	z-index: 999;
	padding: 15px 0;
	background: #f3f5f6;
	span {
		color: var(--unnamed, #77889d);
	}
	span:first-child {
		cursor: pointer;
	}
	span:last-child {
		color: var(--unnamed, rgba(0, 0, 0, 0.8));
	}
}
</style>
