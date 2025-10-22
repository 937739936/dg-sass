<!--
 * @Author: liupengbo liupengbo@shdatalink.com
 * @Date: 2022-07-01 13:46:04
 * @LastEditors: liupengbo liupengbo@shdatalink.com
 * @LastEditTime: 2022-07-02 10:58:02
 * @FilePath: /dg-trade-frontend/src/views/center/takeGoods/components/viewer.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
	<viewer
		:options="options"
		:images="images"
		@inited="inited"
		class="viewer"
		ref="viewer"
	>
		<template slot-scope="scope">
			<img
				v-for="src in scope.images"
				:src="src"
				:key="src"
			/>
		</template>
	</viewer>
</template>

<script>
import Viewer from 'v-viewer/src/component.vue';
export default {
	components: {
		Viewer
	},
	data() {
		return {
			images: [],
			options: {
				inline: false
			}
		};
	},
	methods: {
		inited(viewer) {
			this.$viewer = viewer;
		},
		show(images) {
			this.images = images;
			this.$viewer.show();
		}
	}
};
</script>

<style lang="less" scoped>
.viewer {
	display: none;
}
</style>
