<template>
	<div>
		<a-modal
			class="slModal"
			:visible="visible"
			title=""
			width="352px"
			@cancel="visible = false"
		>
			<div class="tip">
				<ConfirmIcon />
				<p>{{ tip }}</p>
			</div>
			<template slot="footer">
				<a-button
					key="back"
					@click="visible = false"
					class="cancel-btn"
				>
					取消
				</a-button>
				<a-button
					key="submit"
					style="margin-left: 20px"
					type="primary"
					@click="save"
				>
					确定
				</a-button>
			</template>
		</a-modal>
	</div>
</template>

<script>
import { ConfirmIcon } from '@sub/components/svg'
export default {
	props: {
		tip: {
			default: ''
		}
	},
	data() {
		return {
			visible: false
		};
	},
	methods: {
		open() {
			this.visible = true;
		},
		close() {
			this.visible = false;
		},
		save() {
			this.$emit('save');
		}
	},
	components: {
		ConfirmIcon
	}
};
</script>

<style scoped lang="less">
.tip {
	font-size: 14px;
	line-height: 20px;
	color: rgba(0, 0, 0, 0.8);
	display: flex;
	p {
		margin-left: 12px;
	}
}
.icon {
	width: 16px;
	height: 16px;
	img {
		width: 16px;
		height: 16px;
	}
}
/deep/ .ant-modal-body {
	padding-top: 60px;
}
/deep/ .ant-modal-footer {
	border-top: 0;
	padding-top: 0;
}
</style>
