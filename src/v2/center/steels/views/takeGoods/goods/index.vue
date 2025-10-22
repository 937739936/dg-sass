<!--
 * @Author: liupengbo liupengbo@shdatalink.com
 * @Date: 2022-06-22 16:05:11
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-07-11 10:02:13
 * @FilePath: /dg-trade-frontend/src/views/center/takeGoods/goods/index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
	<div>
		<a-tabs
			default-active-key="1"
			@change="callback"
			v-show="currentStep == 0"
		>
			<a-tab-pane
				key="1"
				tab="按合同提货"
			></a-tab-pane>
			<!-- <a-tab-pane key="2" tab="按库存提货"></a-tab-pane> -->
		</a-tabs>
		<div style="width: 100%">
			<steps
				:currentStep="currentStep"
				:stepList="stepList"
				v-if="pageType !== 'preview'"
			/>
			<div
				style="margin-top: 20px"
				v-if="tabIndex == 1"
			>
				<contract-step-1
					v-on:next="next"
					v-if="currentStep == 0"
				/>
				<contract-step-2
					v-on:next="next"
					v-show="currentStep == 1"
					v-on:prev="prev"
					:id="selectConstractId"
				/>
				<contract-step-3
					v-on:next="next"
					v-show="currentStep == 2"
					v-on:prev="prev"
				/>
			</div>
			<div
				style="margin-top: 20px"
				v-else
			>
				<stock-step-1
					v-on:next="next"
					v-if="currentStep == 0"
				/>
				<stock-step-2
					v-on:next="next"
					v-show="currentStep == 1"
					v-on:prev="prev"
				/>
				<stock-step-3
					v-on:next="next"
					v-show="currentStep == 2"
					v-on:prev="prev"
				/>
			</div>
		</div>
	</div>
</template>

<script>
import Steps from '../components/steps.vue';
import contractStep1 from './contract/step1.vue';
import contractStep2 from './contract/step2.vue';
import contractStep3 from './contract/step3.vue';
import stockStep1 from './stock/step1.vue';
import stockStep2 from './stock/step2.vue';
import stockStep3 from './stock/step3.vue';

export default {
	data() {
		return {
			currentStep: 0,
			stepList: [],
			stepListEnum: {
				1: ['选择待开具提货申请的合同', '选择对应货物信息', '完成'],
				2: ['选择库存', '选择对应货物信息', '完成']
			},
			tabIndex: 1,
			selectConstractId: ''
		};
	},
	computed: {
		pageType() {
			return this.$route.query?.type || '';
		},
		currentId() {
			return this.$route.query?.id || '';
		}
	},
	components: {
		Steps,
		contractStep1,
		contractStep2,
		contractStep3,
		stockStep1,
		stockStep2,
		stockStep3
	},
	methods: {
		setCurrentView() {
			const type = this.$route.query?.type;
			if (type === 'preview' || type === 'edit') {
				this.currentStep = 1;
			}
			if (this.$route.query.contractId) {
				this.selectConstractId = this.$route.query.contractId;
			}
			if (this.$route.query.currentStep) {
				this.currentStep = +this.$route.query.currentStep;
			}
		},
		callback(key) {
			this.tabIndex = key;
			this.stepList = this.stepListEnum[key];
		},
		next(flag) {
			this.currentStep = flag?.view || 0;
			this.selectConstractId = flag?.id || '';
		},
		prev(flag) {
			this.currentStep = flag;
		}
	},
	mounted() {
		this.stepList = this.stepListEnum[1];
		this.setCurrentView();
	}
};
</script>

<style></style>
