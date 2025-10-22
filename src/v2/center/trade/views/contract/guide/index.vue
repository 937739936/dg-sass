<template>
	<div class="guide-model-wrap">
		<template v-if="isCoreCompany">
			<Step0
				v-if="current == 0"
				@step="step => changeStep(step, 1)"
			/>
			<Step1
				v-if="current == 1"
				page="1/4"
				@step="step => changeStep(step, 1)"
			/>
			<Step2
				v-if="current == 2"
				page="2/4"
				@step="step => changeStep(step, 1)"
			/>
			<Step3
				v-if="current == 3"
				page="3/4"
				@step="step => changeStep(step, 1)"
			/>
			<Step4
				v-if="current == 4"
				page="4/4"
				@step="step => changeStep(step, 1)"
			/>
		</template>
		<template v-else>
			<Step0
				v-if="current == 0"
				@step="step => changeStep(step, 1)"
			/>
			<Step1
				v-if="current == 1"
				page="1/3"
				@step="step => changeStep(step, 1)"
			/>
			<Step3
				v-if="current == 3"
				page="2/3"
				@step="step => changeStep(step, 1)"
			/>
			<Step4
				v-if="current == 4"
				page="3/3"
				@step="step => changeStep(step, 1)"
			/>
		</template>
		<Contract1
			v-if="current == 5"
			@step="step => changeStep(step, 2)"
		/>
		<Contract2
			v-if="current == 6"
			@step="step => changeStep(step, 2)"
		/>
		<Contract3
			v-if="current == 7"
			@step="step => changeStep(step, 2)"
		/>
		<Contract4
			v-if="current == 8"
			@step="step => changeStep(step, 2)"
		/>
		<Contract5
			v-if="current == 9"
			@step="step => changeStep(step, 2)"
		/>
	</div>
</template>

<script>
import Step0 from './components/step0.vue';
import Step1 from './components/step1.vue';
import Step2 from './components/step2.vue';
import Step3 from './components/step3.vue';
import Step4 from './components/step4.vue';

import Contract1 from './components/contract1.vue';
import Contract2 from './components/contract2.vue';
import Contract3 from './components/contract3.vue';
import Contract4 from './components/contract4.vue';
import Contract5 from './components/contract5.vue';

import { mapGetters } from 'vuex';
export default {
	data() {
		return {
			current: -1
		};
	},
	components: {
		Step0,
		Step1,
		Step2,
		Step3,
		Step4,
		Contract1,
		Contract2,
		Contract3,
		Contract4,
		Contract5
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		isCoreCompany() {
			return this.VUEX_ST_COMPANYSUER.companyType == 'CORE_COMPANY';
		}
	},
	mounted() {
		const path = this.$route.path;
		if (['/center/contract/buy/list', '/center/contract/sell/list'].includes(path)) {
			this.current = localStorage.getItem('contractListGuide');
		}
		if (['/center/contract/buy/online/add/step2', '/center/contract/sell/online/add/step2'].includes(path)) {
			this.current = localStorage.getItem('contractCreateGuide');
		}
	},
	methods: {
		changeStep(flag, type) {
			this.current = flag;
			if (type == 1 && flag == -1) {
				localStorage.setItem('contractListGuide', -1);
				this.$eventBus.$emit('hideGuide', -1);
			}
			if (type == 2 && flag == -1) {
				localStorage.setItem('contractCreateGuide', -1);
				this.$eventBus.$emit('hideGuide', -1);
			}
		}
	}
};
</script>

<style lang="less" scoped>
.guide-model-wrap {
	width: 100vw;
	height: 100vh;
	overflow: hidden;
	position: absolute;
	z-index: 9999;
	top: 0;
	left: 0;
	background: rgba(0, 0, 0, 0.3);
}
</style>
