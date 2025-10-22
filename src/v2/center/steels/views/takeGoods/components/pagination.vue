<!--
 * @Author: liupengbo liupengbo@shdatalink.com
 * @Date: 2022-06-23 14:44:07
 * @LastEditors: liupengbo liupengbo@shdatalink.com
 * @LastEditTime: 2022-06-30 09:37:12
 * @FilePath: /dg-trade-frontend/src/views/center/takeGoods/components/pagination.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
	<div class="take-pagination-wrap">
		<a-pagination
			:show-total="total => `共 ${total} 条`"
			:total="total"
			:current="current"
			show-size-changer
			:page-size-options="pageSizeOptions"
			@change="onChange"
			@showSizeChange="onShowSizeChange"
		>
		</a-pagination>
	</div>
</template>

<script>
export default {
	props: {
		total: {
			type: Number,
			default: 0
		},
		current: {
			type: Number,
			default: 1
		},
		pageSize: {
			type: Number,
			default: 10
		}
	},
	data() {
		return {
			pageSizeOptions: ['10', '20', '30', '40', '50']
		};
	},
	methods: {
		onChange(page, pageSize) {
			this.$emit('page-change', {
				current: page,
				pageSize
			});
		},
		onShowSizeChange(current, pageSize) {
			this.$emit('page-change', {
				current,
				pageSize
			});
		}
	}
};
</script>

<style lang="less" scoped>
.take-pagination-wrap {
	width: 100%;
	height: 60px;
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
	align-items: center;
}
</style>
