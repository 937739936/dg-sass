<!--
	作者：yuanliwe
	日期：2024-05-16
	版本：1.0.0
	描述：基础信息描述组件
	备注： 两种展示方式：bordered（带边框）、no-border（不带边框）
	更新日志：
		- 2024-05-16 v1.0.0：完成基础信息描述组件
	使用方法：
	1. 引入组件：import BaseInfoDescriptions from '@sub/components/base/BaseInfoDescriptions';
	2. 在template中使用：
		<BaseInfoDescriptions
			:title="title"
			:dataSource="dataSource"
			:bordered="bordered"
			:columnsCountOneRow="columnsCountOneRow"
		/>
	3. dataSource格式：
		[
			{
				label: '标题', // 左侧label
				value: '', // 右侧值内容
				click: () => {}, // 点击事件（可选），不为空时value显示为可点击，点击时触发该事件
				isNeedCopy: true, // 是否需要复制功能，点击时复制value到粘贴板,
				scopedSlots: { customRender: 'index' } // 自定义作用域插槽
				style: {
					color: '#ff800f'
				},
				isNotShowOverflowTooltip: false // 是否不显示该项，默认显示
				tipText: '提示文字' // 鼠标悬停提示文字(可选) 没有时取value作为提示文字
			}
		]
		4. 自定义value作用域插槽：
			scopedSlots: {
				customRender: 'index'
			}
			自定义渲染，index为当前item的索引，可以自定义显示内容，如：
			<template v-slot:customRender="{ value, item }">
				<a href="javascript:;">{{ value }}</a>
			</template>
-->
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
							@mouseenter="onMouseOverContractNo(index)"
							@mouseleave="onMouseOutContractNo(index)">
							<span
								v-show="!copyContractNoVisible[index]"
								class="copy-icon"
								>
								<Copy></Copy>
							</span>
							<span
								v-show="copyContractNoVisible[index]"
								v-clipboard:success="onCopy" 
								v-clipboard:error="onError"  
								v-clipboard:copy="item.value"
								class="copy-icon"
								>
								<CopyNow></CopyNow>
							</span>
						</div>
						
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
								@mouseenter="onMouseOverContractNo(index)"
								@mouseleave="onMouseOutContractNo(index)">
								<span
									v-show="!copyContractNoVisible[index]"
									class="copy-icon"
									>
									<Copy></Copy>
								</span>
								<span
									v-show="copyContractNoVisible[index]"
									v-clipboard:success="onCopy" 
									v-clipboard:error="onError"  
									v-clipboard:copy="item.value"
									class="copy-icon"
									>
									<CopyNow></CopyNow>
								</span>
							</div>
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
import {Copy, CopyNow } from '@sub/components/svg'
export default {
	name: 'BaseInfoDescriptions',
	data() {
		return {
			copyContractNoVisible: [false, false, false]
		}
	},
	components: {
		TextOverflowTooltip,
		Copy,
		CopyNow,
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
		// 鼠标移入复制合同编号
		onMouseOverContractNo(index) {
			let obj = true
			this.$set(this.copyContractNoVisible, index, obj);
		},
		// 鼠标移出
		onMouseOutContractNo(index) {
			let obj = false
			this.$set(this.copyContractNoVisible, index, obj);
		},
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
		cursor: pointer;
		position: relative;
		top: 1px;
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
				width: 160px;
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
				// color: #000000cc;
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