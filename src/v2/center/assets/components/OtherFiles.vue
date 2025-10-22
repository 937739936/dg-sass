<template>
	<div>
		<!--钢材-->
		<SteelOtherFiles
			v-bind="$props"
			v-if="receivalVO && receivalVO.industryType == 'STEEL'"
			ref="SteelOtherFiles"
		/>

		<!--煤炭-->
		<CoalOtherFiles
			v-bind="$props"
			v-if="receivalVO && receivalVO.industryType == 'COAL'"
			ref="CoalOtherFiles"
			:receivalVO="receivalVO"
		/>
	</div>
</template>
<script>
import SteelOtherFiles from './steel/OtherFiles.vue';
import CoalOtherFiles from './coal/OtherFiles.vue';
export default {
	name: 'OtherFiles',
	props: ['editFlag', 'otherInfo', 'noFileName', 'receivalVO'],
	components: {
		SteelOtherFiles,
		CoalOtherFiles
	},
	methods: {
		onSubmit() {
			// 整体提交
			if (this.$refs.SteelOtherFiles) return this.$refs.SteelOtherFiles.onSubmit();
			if (this.$refs.CoalOtherFiles) return this.$refs.CoalOtherFiles.onSubmit();
		}
	}
};
</script>
