<template>
	<div class="lay-container">
		<HeaderCom class="header"></HeaderCom>
		<div class="main">
			<router-view />
		</div>
	</div>
</template>

<script>
import HeaderCom from '../components/HeaderCom';
import { isShowTool } from '@/v2/center/invoiceDiscern/api';
import { method } from 'lodash';
export default {
	components: {
		HeaderCom
	},
	async created() {
		const flag = await this.isShowTool();
		if (!flag) {
			this.$router.push('/center/workbench/myToDoList');
		}
	},
	mounted() {
		this.$nextTick(() => {
			// var searchDeliverTrain = document.querySelector(".searchDeliverTrain")
			// searchDeliverTrain.style.display = 'none'
			var app = document.querySelector('#app');
			app.style.setProperty('background', '#f3f5f6', 'important');
		});
	},
	methods: {
		async isShowTool() {
			const res = await isShowTool();
			return res.data;
		}
	}
};
</script>

<style lang="less" scoped>
.lay-container {
	height: 100%;
	min-width: 1420px;
	background-color: #f3f5f6 !important;
	.main {
		margin: 0 20px;
		padding-top: 84px;
		// background: #fff;
		height: 100%;
		box-sizing: border-box;
		padding-bottom: 20px;
	}
}
.header {
	position: fixed;
	width: 100%;
	z-index: 999;
}
</style>
