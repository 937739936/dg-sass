<template>
	<div>
		<!--钢材-->
		<SteelContract
			v-bind="$props"
			v-if="receivalVO && receivalVO.industryType == 'STEEL'"
			ref="SteelContract"
		/>
		<!--煤炭-国宏(电子合同)-->
		<GhContract
			v-bind="$props"
			v-if="receivalVO && receivalVO.industryType == 'COAL' && contractInfo && contractInfo.isOnlineContract == 1"
			ref="GhContract"
		/>
		<!--煤炭-->
		<CoalContract
			v-bind="$props"
			@changeStatus="changeStatus"
			v-if="
				receivalVO && receivalVO.industryType == 'COAL' && contractInfo && (contractInfo.isOnlineContract == 0 || !contractInfo.isOnlineContract)
			"
			ref="CoalContract"
		/>
	</div>
</template>
<script>
import SteelContract from './steel/contract.vue';
import GhContract from './gh/contract.vue';
import CoalContract from './coal/contract.vue';
export default {
	name: 'Contract',
	props: ['showEditorRadio', 'editFlag', 'contractInfo', 'noFileName', 'lineId', 'isAdvance', 'receivalVO'],
	components: {
		SteelContract,
		GhContract,
		CoalContract
	},
	methods: {
		changeStatus(e) {
			this.$emit('changeStatus', e);
		},
		onSubmit() {
			// 整体提交
			if (this.$refs.GhContract) return this.$refs.GhContract.onSubmit();
			if (this.$refs.SteelContract) return this.$refs.SteelContract.onSubmit();
			if (this.$refs.CoalContract) return this.$refs.CoalContract.onSubmit();
		}
	}
};
</script>
