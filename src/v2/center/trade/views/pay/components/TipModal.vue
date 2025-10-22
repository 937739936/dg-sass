<template>
	<div>
		<a-modal
			:title="title"
			v-model="visible"
			:footer="null"
			class="pay-custom-tip-modal"
			width="400px"
		>
			<p>付款时选择非自有资金时，需要先完善销售合同信息</p>
			<div class="btn-wrapper">
				<a-button @click="visible = false">关闭</a-button>
				<!-- <a-button v-if="isNeedCompete" type="primary" @click="handleCompete">去完善</a-button> -->
			</div>
		</a-modal>
	</div>
</template>
<script>
export default {
	name: 'PayCustomModal',
	data() {
		return {
			title: '您还没有完善销售合同信息',
			visible: false,
			isNeedCompete: false,
			data: {}
		};
	},
	methods: {
		init(isNeedCompete, data) {
			this.visible = true;
			this.isNeedCompete = isNeedCompete;
			this.data = data;
		}
	}
};
</script>
<style lang="less" scoped>
.pay-custom-tip-modal {
	.btn-wrapper {
		text-align: center;
		margin-top: 40px;
		button + button {
			margin-left: 50px;
		}
	}
}
</style>
