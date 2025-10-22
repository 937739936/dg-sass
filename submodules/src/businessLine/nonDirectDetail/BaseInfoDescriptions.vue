
<template>
	<div class="base-info-descriptions">
		<div
			v-if="title"
			class="slTitleAssis"
		>
			{{ title }}
		</div>
		<div v-if="displayItems.length > 0">
			<a-row
				v-if="bordered"
				type="flex"
				class="base-info-table"
			>
				<a-col
					v-for="(item, index) in displayItems"
					:key="index"
					:span="getItemSpan(index)"
					class="base-info-item"
				>
					<div class="base-info-item-label">
						<TextOverflowTooltip :tipText="item.label">
							<span>
								{{ item.label }}
							</span>
						</TextOverflowTooltip>
					</div>
					<div
						:class="`base-info-item-value ` + (item.click ? 'link-text' : 'normal-text')"
						:style="item.style || {}"
					>
						<TextOverflowTooltip
							:isNotShowOverflowTooltip="item.isNotShowOverflowTooltip"
							:tipText="item.tipText || item.value"
						>
							<slot
								v-if="item.scopedSlots && item.scopedSlots.customRender"
								:name="item.scopedSlots.customRender"
								:value="item.value"
								:item="item"
							>
							</slot>
							<span
								v-else
								@click="item.click && item.click()"
							>
								{{ item.value }}
							</span>
						</TextOverflowTooltip>
						<div
							v-if="item.isNeedCopy"
							class="copy-icon"
							v-clipboard:copy="item.value"
							v-clipboard:success="onCopy"
							v-clipboard:error="onError"
						></div>
					</div>
				</a-col>
			</a-row>
			<a-row
				v-else
				class="base-info-no-border"
				type="flex"
				:gutter="[20, 20]"
			>
				<a-col
					v-for="(item, index) in displayItems"
					:key="index"
					:span="getItemSpan(index)"
				>
					<div class="info-no-border-item">
						<span class="info-no-border-item-label">{{ item.label }}：</span>
						<div
							:class="`info-no-border-item-value ` + (item.click ? 'link-text' : 'normal-text')"
							:style="item.style || {}"
						>
							<TextOverflowTooltip
								:isNotShowOverflowTooltip="item.isNotShowOverflowTooltip"
								:tipText="item.tipText || item.value"
							>
								<slot
									v-if="item.scopedSlots && item.scopedSlots.customRender"
									:name="item.scopedSlots.customRender"
									:value="item.value"
									:item="item"
								>
								</slot>
								<span
									v-else
									@click="item.click && item.click()"
								>
									{{ item.value }}
								</span>
							</TextOverflowTooltip>
							<div
								v-if="item.isNeedCopy"
								class="copy-icon"
								v-clipboard:copy="item.value"
								v-clipboard:success="onCopy"
								v-clipboard:error="onError"
							></div>
						</div>
					</div>
				</a-col>
			</a-row>
		</div>
		<div v-else></div>
	</div>
</template>

<script>
import TextOverflowTooltip from './TextOverflowTooltip';

export default {
	name: 'BaseInfoDescriptions',
	components: {
		TextOverflowTooltip
	},
	props: {
		// 标题（可选），不为空时显示在最上方左侧
		title: {
			type: String,
			default: ''
		},
		// 信息项数组
		dataSource: {
			type: Array,
			default: () => []
		},
		// 每行的列数
		columnsCountOneRow: {
			type: Number,
			default: 3
		},
		bordered: {
			type: Boolean,
			default: false
		}
	},
	computed: {
		displayItems() {
			let list = this.dataSource ?? [];
			return list;
		},
		normalItemSpan() {
			return 24 / this.columnsCountOneRow;
		}
	},
	methods: {
		// 获取每行item的span
		getItemSpan(index) {
			let itemLength = this.displayItems.length;
			if (itemLength <= this.columnsCountOneRow) {
				// 总个数小于等于每行个数，则每行都显示个数平均span
				return 24 / itemLength;
			}
			let span = this.normalItemSpan;
			let remainder = itemLength % this.columnsCountOneRow;
			if (remainder != 0 && index == itemLength - 1) {
				// 最后一行，最后一个元素
				let needExpandCount = this.columnsCountOneRow - remainder + 1;
				span = needExpandCount * span;
			}
			return span;
		},
		// 复制到粘贴板
		onCopy() {
			this.$message.success('复制成功');
		},
		// 复制失败
		onError() {
			this.$message.error('复制失败');
		}
	}
};
</script>

<style lang="less" scoped>
.base-info-descriptions {
	width: 100%;
	.slTitleAssis {
		margin-bottom: 20px;
	}
	.link-text {
		color: @primary-color;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
		cursor: pointer;
	}
	.normal-text {
		color: #000000cc;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}
	.copy-icon {
		flex-shrink: 0;
		margin-left: 12px;
		width: 14px;
		height: 14px;
		background: url(~@sub/assets/imgs/common/copy_icon.png) no-repeat center;
		background-size: 100% 100%;
		cursor: pointer;
	}
	.copy-icon:hover {
		background: url(~@sub/assets/imgs/common/copy_active_icon.png) no-repeat center;
		background-size: 100% 100%;
	}
	.base-info-table {
		border-top: 1px solid #e5e6eb;
		border-left: 1px solid #e5e6eb;
		border-radius: 3px;
		overflow: hidden;
		.base-info-item {
			height: 48px;
			display: flex;
			flex-direction: row;
			align-items: center;
			font-size: 14px;
			.base-info-item-label {
				width: 104px;
				height: 100%;
				padding: 0 12px;
				display: flex;
				justify-content: flex-start;
				align-items: center;
				background: #f3f5f6;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #77889d;
				border-right: 1px solid #e5e6eb;
				border-bottom: 1px solid #e5e6eb;
			}
			.base-info-item-value {
				flex: 1;
				height: 100%;
				padding: 0 12px;
				display: flex;
				justify-content: flex-start;
				align-items: center;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				color: #000000cc;
				border-right: 1px solid #e5e6eb;
				border-bottom: 1px solid #e5e6eb;
			}
		}
		.base-info-item:last-child {
			.base-info-item-value:last-child {
				border-bottom-right-radius: 3px;
			}
		}
	}
	.base-info-no-border {
		.info-no-border-item {
			display: flex;
			flex-direction: row;
			align-items: flex-start;
			font-size: 14px;
			.info-no-border-item-label {
				color: #00000066;
				flex-shrink: 0;
			}
			.info-no-border-item-value {
				flex: 1;
				display: flex;
				flex-direction: row;
				align-items: center;
				overflow: hidden;
				font-size: 14px;
			}
		}
	}
}
</style>