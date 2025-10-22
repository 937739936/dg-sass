<template>
	<div class="slMain">
		<breadcrumb />
		<LinkContract></LinkContract>
	</div>
</template>

<script>
import LinkContract from './components/LinkContract.vue';
import breadcrumb from '@/v2/components/breadcrumb/index';
export default {
	data() {
		return {};
	},
	methods: {},
	components: {
		LinkContract,
		breadcrumb
	}
};
</script>

<style scoped lang="less"></style>
