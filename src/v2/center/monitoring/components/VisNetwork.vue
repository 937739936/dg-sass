<template>
	<div
		class="vis-network-wrapper"
		ref="visNetworkWrapper"
	>
		<div
			v-if="isFullscreen"
			class="fullscreen-icon"
			@click="toggle"
			:class="fullscreen ? 'is-fullscreen' : ''"
		>
			<a-tooltip
				placement="bottom"
				overlayClassName="test123123123"
				:getPopupContainer="getPopupContainer"
				:title="fullscreen ? '退出全屏' : '全屏'"
			>
				<a-icon :type="fullscreen ? 'fullscreen-exit' : 'fullscreen'" />
			</a-tooltip>
		</div>
		<div
			ref="myNetwork"
			class="vis-network"
		></div>
	</div>
</template>
<script>
import { Network } from 'vis-network';
import { DataSet } from 'vis-data';
import { api as fullscreen } from 'vue-fullscreen';
import { debounce } from 'lodash';
import { getPopupContainer } from '@/v2/utils/factory';

export default {
	name: 'VisNetwork',
	props: {
		data: {
			type: String,
			default: () => {}
		},
		graphData: {
			type: Array,
			default: () => []
		},
		graphRelation: {
			type: Array,
			default: () => []
		},
		isFullscreen: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
			getPopupContainer,
			fullscreen: false,
			network: null
		};
	},

	beforeDestroy() {
		window.removeEventListener('resize', this.resizeHanlder);
	},
	created() {
		const nodes = new DataSet(this.graphData);

		const edges = new DataSet(this.graphRelation);
		this.networkData = {
			nodes,
			edges
		};
		// 全局配置
		this.options = {
			autoResize: true, // 网络将自动检测其容器的大小调整，并相应地重绘自身
			interaction: {
				dragNodes: false
			},
			layout: {
				hierarchical: {
					direction: 'LR' // UD:上下 DU:下上 LR:左右 RL:右左
				} // 层级结构显示
			},
			// // 边线配置
			edges: {
				arrows: { to: true }
				// 箭头指向to
			},
			nodes: {
				margin: 10,
				widthConstraint: 80,
				color: {
					background: '#ffffff' // 节点背景颜色
				},
				font: {
					size: 10 // px
				},
				shape: 'box',
				shapeProperties: {
					borderRadius: 5 // only for box shape
				}
			}
		};
	},
	mounted() {
		this.container = this.$refs.myNetwork;
		this.network = new Network(this.container, this.networkData, this.options);
	},
	methods: {
		toggle() {
			fullscreen.toggle(this.$refs.visNetworkWrapper, {
				teleport: this.teleport,
				callback: isFullscreen => {
					this.fullscreen = isFullscreen;
					setTimeout(() => {
						this.network = new Network(this.container, this.networkData, this.options);
					}, 300);
				}
			});
		},
		bindEvent() {
			this.resizeHanlder = debounce(() => {
				if (this.network) {
					this.network.fit();
				}
			}, 300);
			window.addEventListener('resize', this.resizeHanlder);
		}
	}
};
</script>
<style lang="less" scoped>
.vis-network-wrapper {
	width: 100%;
	height: 100%;
	position: relative;
	::v-deep .fullscreen-icon {
		position: absolute;
		z-index: 1;
		right: 5px;
		top: 5px;
		font-size: 18px;
		cursor: pointer;
		padding: 3px 7px;
		&:hover {
			background: #f5f5f5;
		}
		> div {
			width: 100px !important;
		}
	}
	.vis-network {
		position: relative;
		overflow: hidden;
		touch-action: pan-y;
		user-select: none;
		-webkit-user-drag: none;
		-webkit-tap-highlight-color: rgba(0, 0, 0, 0);
		width: 100%;
		height: 100%;
		background: #ffffff;
	}
	.fullscreen-icon.is-fullscreen {
		top: 25px;
		right: 25px;
	}
}
</style>
