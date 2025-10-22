<!--
 * @Author: liupengbo liupengbo@shdatalink.com
 * @Date: 2022-06-22 16:05:11
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-07-11 09:59:22
 * @FilePath: /dg-trade-frontend/src/views/center/takeGoods/order/index.vue
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
				tab="提货申请"
			></a-tab-pane>
			<a-tab-pane
				key="2"
				tab="合同"
			></a-tab-pane>
		</a-tabs>
		<div style="width: 100%">
			<steps
				:currentStep="currentStep"
				:stepList="stepList"
				v-if="stepsShow"
			/>
			<div
				style="margin-top: 20px"
				v-if="tabIndex == 1"
			>
				<step-1
					v-on:next="next"
					v-if="currentStep == 0"
				/>
				<step-2
					v-on:next="next"
					v-show="currentStep == 1"
					v-on:prev="prev"
					:contractId="contractId"
					:serialNo="serialNo"
					:selectItem="selectItem"
				/>
				<step-3
					v-on:next="next"
					v-show="currentStep == 2"
					v-on:prev="prev"
				/>
			</div>
			<div
				style="margin-top: 20px"
				v-else
			>
				<ContractStep1></ContractStep1>
			</div>
		</div>
	</div>
</template>

<script>
import Steps from '../components/steps.vue';
import Step1 from './step1.vue';
import Step2 from './step2.vue';
import Step3 from './step3.vue';
import ContractStep1 from './contract/step1.vue';

export default {
	data() {
		return {
			currentStep: 0,
			stepList: ['选择提货申请', '填写提单信息', '完成'],
			stepListEnum: {
				1: ['选择提货申请', '填写提单信息', '完成'],
				2: ['选择合同', '填写提单信息', '完成']
			},
			stepsShow: true,
			// 预览  填写实提  关联回款 上传提单 编辑 OA
			setp2TypeList: ['preview', 'input', 'relation', 'upload', 'edit', 'oa'],
			contractId: '',
			serialNo: '',
			tabIndex: 1,
			selectItem: {}
		};
	},
	components: {
		Steps,
		Step1,
		Step2,
		Step3,
		ContractStep1
	},

	methods: {
		next(flag) {
			this.currentStep = flag?.view || 0;
			this.contractId = flag?.contractId || '';
			this.serialNo = flag?.serialNo || '';
			this.selectItem = flag.item || {};
		},
		prev(flag) {
			this.currentStep = flag;
		},
		callback(key) {
			this.tabIndex = key;
			this.stepList = this.stepListEnum[key];
		},
		setCurrentView() {
			if (this.setp2TypeList.includes(this.$route.query?.type)) {
				this.currentStep = 1;
				this.stepsShow = false;
			}
			if (this.$route.query.currentStep) {
				this.selectItem = {
					contractId: this.$route.query.contractId,
					serialNo: this.$route.query.serialNo
				};
				this.currentStep = +this.$route.query.currentStep;
			}
		}
	},
	mounted() {
		this.setCurrentView();
	}
};
</script>

<style></style>
