<!--
 * @Author: liupengbo liupengbo@shdatalink.com
 * @Date: 2022-06-22 16:05:11
 * @LastEditors: liupengbo liupengbo@shdatalink.com
 * @LastEditTime: 2022-06-23 10:43:31
 * @FilePath: /dg-trade-frontend/src/views/center/steels/goodsTransfer/repairEntry/index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
	<div>
		<a-steps :current="currentStep">
			<a-step title="选择待开具货转的合同信息" />
			<a-step title="选择对应货物信息" />
			<a-step title="完成" />
		</a-steps>
		<step1
			v-on:next="next"
			v-show="currentStep == 0"
		/>
		<step2
			v-on:next="next"
			v-show="currentStep == 1"
			:generateWay="generateWay"
			:contractNo="contractNo"
		/>
		<step3
			v-on:next="next"
			v-show="currentStep == 2"
		/>
	</div>
</template>

<script>
import Step1 from './step1.vue';
import Step2 from './step2.vue';
import Step3 from './step3.vue';

export default {
	data() {
		return {
			currentStep: 0,
			generateWay: '',
			contractNo: ''
		};
	},
	components: {
		Step1,
		Step2,
		Step3
	},
	methods: {
		next(item) {
			this.currentStep = item.view || 1;
			this.generateWay = item.generateWay || '';
			this.contractNo = item.contractNo || '';
		}
	}
};
</script>

<style lang="less" scoped></style>
