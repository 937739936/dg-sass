<template>
	<ul class="reference">
		<li>© {{ copyYear }} {{ systemConfig.name }} All rights reserved</li>
		<li>郑州{{ systemConfig.name }}有限公司</li>
		<li>
			<a
				v-if="env == 'staging'"
				style="color: rgba(255, 255, 255, 0.5)"
				href="https://beian.miit.gov.cn"
				target="_blank"
				>{{ systemConfig.filingInformation.stagingNo }}</a
			>
			<a
				v-else
				style="color: rgba(255, 255, 255, 0.5)"
				href="https://beian.miit.gov.cn"
				target="_blank"
				>{{ systemConfig.filingInformation.no }}</a
			>
		</li>
	</ul>
</template>

<script>
import systemConfig from '@/v2/config/common';

export default {
	name: 'Footer.vue',
	data() {
		return {
			copyYear: new Date().getFullYear(),
			env: process.env.VUE_APP_BUILD_ENV,
			systemConfig
		};
	},
	mounted() {},
	watch: {},
	methods: {}
};
</script>

<style scoped lang="less">
.reference {
	display: flex;
	justify-content: center;
	li {
		cursor: pointer;
		padding: 0 12px;
		color: rgba(255, 255, 255, 0.5);
	}
}
</style>
