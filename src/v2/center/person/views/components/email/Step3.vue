<template>
	<div class="content">
		<div class="icon"></div>
		<div class="desc">恭喜您，邮箱{{ title.indexOf('修改') >= 0 ? '修改' : '绑定'}}成功！</div>
	</div>
</template>

<script>
export default {
	props: {
		title: {
			type: String,
			default: ''
		}
	},
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
	width: 64px;
	height: 64px;
	background-image: url('~v2/assets/imgs/person/success-l.png');
	background-size: 64px 64px;
}
.desc {
	margin-top: 20px;
	color: rgba(0, 0, 0, 0.8);
}
.desc-tips {
	color: rgba(0, 0, 0, 0.4);
	margin-top: 12px;
}
</style>