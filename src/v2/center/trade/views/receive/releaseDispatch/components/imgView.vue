<template>
	<div>
		<a-modal
			v-if="imgs.length"
			class="new-modal"
			:visible="visible"
			width="505px"
			height="76%"
			:footer="null"
			:title="imgs[activeIndex].name"
			@cancel="handleCancel"
		>
			<div class="img-box">
				<img
					class="img-self"
					:src="imgs[activeIndex].url"
					alt=""
				/>
				<i
					class="img-prev"
					@click="prev()"
					v-if="imgs.length > 1"
				></i>
				<i
					class="img-next"
					@click="next()"
					v-if="imgs.length > 1"
				></i>
			</div>
		</a-modal>
	</div>
</template>

<script>
export default {
	name: 'imgiew',
	data() {
		return {
			imgs: [],
			visible: false,
			activeIndex: 0
		};
	},
	created() {},
	methods: {
		// 预览图片
		viewPic(img) {
			this.imgs = img;
			this.visible = true;
		},
		// 查看前一张图片
		prev() {
			if (this.activeIndex > 0) {
				this.activeIndex--;
			}
		},
		// 查看后一张图片
		next() {
			if (this.activeIndex < this.imgs.length - 1) {
				this.activeIndex++;
			}
		},
		handleCancel() {
			this.imgs = [];
			this.visible = false;
		}
	}
};
</script>

<style lang="less" scoped>
.new-modal {
	border-radius: 10px;
	::v-deep.ant-modal-header {
		height: 58px;
		background: #f5f7fa;
		border-radius: 8px 8px 0px 0px;
		border-bottom: none;
		padding: 16px 35px 16px 10px;
		.ant-modal-title {
			height: 26px;
			font-size: 18px;
			font-family:
				PingFangSC-Medium,
				PingFang SC;
			font-weight: 500;
			color: rgba(0, 0, 0, 0.8);
			line-height: 26px;
			width: 100%;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}
	::v-deep.ant-modal-body {
		padding: 15px;
	}
	.img-box {
		position: relative;
		.img-self {
			width: 100%;
			height: 100%;
		}
		.img-prev {
			display: inline-block;
			width: 34px;
			height: 34px;
			background: url(~@/v2/assets/imgs/receive/img-prev.png) no-repeat;
			position: absolute;
			left: 15px;
			top: 50%;
			margin-top: -17px;
			cursor: pointer;
		}
		.img-next {
			display: inline-block;
			width: 34px;
			height: 34px;
			background: url(~@/v2/assets/imgs/receive/img-next.png) no-repeat;
			position: absolute;
			right: 15px;
			top: 50%;
			margin-top: -17px;
			cursor: pointer;
		}
	}
}
</style>
