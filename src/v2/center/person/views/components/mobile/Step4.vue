<template>
	<div class="content">
		<div class="icon"></div>
		<div class="desc">实名认证审核已提交</div>
		<div class="desc-tips">您的信息已经提交审核，平台审核将在1-3个工作日内完成，请耐心等待</div>
	</div>
</template>

<script>
export default {
	data() {
		return {};
	},
	methods: {}
};
</script>
<style lang="less" scoped>
.flex-center {
	display: flex;
	flex-direction: row;
	align-items: center;
}

.content {
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding-top: 40px;
	box-sizing: border-box;
}
.icon {
	width: 218px;
	height: 136px;
	background-image: url('~v2/assets/imgs/person/authing.png');
	background-size: 218px 136px;
}
.desc {
	margin-top: 20px;
	color: rgba(0, 0, 0, 0.8);
}
.desc-tips {
	color: rgba(0, 0, 0, 0.4);
	margin-top: 14px;
}
</style>