<template>
	<div
		v-if="flowInfomation"
		class="container"
	>
		<div>
			<div
				class="item"
				@click="previewReceipt(flowInfomation.parentWarehouseReceipt)"
				v-if="flowInfomation.parentWarehouseReceipt"
			>
				<TipContentView
					class="parentWarehouseReceipt label"
					:receipt="flowInfomation.parentWarehouseReceipt"
					level="parent"
				/>
				<div
					v-if="flowInfomation.currentWarehouseReceipt.type"
					class="flow-type bottom"
				>
					{{ typeDesc(flowInfomation.currentWarehouseReceipt.type) }}
				</div>
			</div>
		</div>
		<div class="currentWarehouseReceipt-container">
			<div
				class="line"
				v-if="flowInfomation.childWarehouseReceipt && flowInfomation.childWarehouseReceipt.length >= 2"
			></div>
			<div
				class="item"
				@click="previewReceipt(flowInfomation.currentWarehouseReceipt)"
				v-if="flowInfomation.currentWarehouseReceipt"
			>
				<TipContentView
					class="currentWarehouseReceipt label current"
					:receipt="flowInfomation.currentWarehouseReceipt"
					level="current"
				/>
			</div>
			<div
				class="line"
				v-if="flowInfomation.childWarehouseReceipt && flowInfomation.childWarehouseReceipt.length >= 2"
			></div>
		</div>
		<div
			v-if="flowInfomation.childWarehouseReceipt"
			:class="'childWarehouseContainer ' + `length-${flowInfomation.childWarehouseReceipt.length}`"
		>
			<div
				class="item spacing"
				v-for="(item, index) in flowInfomation.childWarehouseReceipt"
				:key="index"
				@click="previewReceipt(item)"
			>
				<div
					v-if="item.type"
					class="flow-type top"
				>
					{{ typeDesc(item.type) }}
				</div>
				<TipContentView
					class="childWarehouseReceipt label"
					:receipt="item"
					level="child"
				/>
			</div>
		</div>
	</div>
</template>

<script>
import TipContentView from './TipContentView.vue';
export default {
	props: {
		informationFlowApi: {},
		id: {}
	},
	components: {
		TipContentView
	},
	data() {
		return {
			flowInfomation: {}
		};
	},
	mounted() {
		this.getFlowInfomation();
	},
	methods: {
		getFlowInfomation() {
			if (!this.id) return;
			if (!this.informationFlowApi) return;
			this.informationFlowApi({ id: this.id })
				.then(result => {
					this.flowInfomation = result.data;
				})
				.catch(err => {});
		},
		typeDesc(type) {
			let typeDesc = '';
			switch (type) {
				case 'OUTBOUND_INVENTORY':
				case 'TRANSFER_INVENTORY':
					typeDesc = '存货';
					break;
				case 'OUTBOUND':
					typeDesc = '提货';
					break;
				case 'TRANSFER':
					typeDesc = '过户';
					break;
				default:
					break;
			}
			return typeDesc;
		},
		previewReceipt(item) {
			if (!item.fileUrl) {
				return;
			}
			this.$emit('previewReceipt', item.fileUrl);
		}
	}
};
</script>

<style lang="less" scoped>
.container {
	width: 100%;
	min-width: 1200px;
	min-height: 500px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;

	.item {
		position: relative;
		display: flex;
		margin: 30px 0;
		cursor: pointer;
		&.spacing {
			margin: 30px 10px;
		}
	}

	.label {
		padding: 10px;
		flex: 1, 0, auto;
		border: 1px solid;
		border-color: @primary-color;
		border-radius: 4px;
		font-size: 14px;
		color: rgba(0, 0, 0, 0.8);
		width: 260px;
		text-align: center;
	}
	.current {
		background-color: @primary-color;
		color: white;
		z-index: 9;
	}

	.flow-type {
		z-index: 9;
		position: absolute;
		color: @primary-color;
		background: #edf3fe;

		border-radius: 4px;
		padding: 2px 8px;
		font-size: 12px;
	}
	.bottom {
		bottom: -30px;
		left: 50%;
		transform: translate(-50%, 50%);
	}
	.top {
		top: -30px;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	.parentWarehouseReceipt,
	.currentWarehouseReceipt,
	.childWarehouseReceipt {
		position: relative;
	}
	.childWarehouseContainer {
		width: 840px; // 260+20  *3
		position: relative;
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		justify-content: space-between;
		&.length-1 {
			justify-content: center;
		}
	}

	// @common-line-property: {
	// 	background: #e5e6eb;
	// 	z-index: 0
	// };

	.parentWarehouseReceipt::after {
		content: '';
		position: absolute;
		top: (100% + 2px);
		right: 50%;
		// transform: translateX(-50%);
		z-index: 1;
		width: 1px;
		height: 60px;
		background: #e5e6eb;
	}
	.currentWarehouseReceipt-container {
		display: flex;
		// justify-content: center;
		align-items: center;
	}

	.line {
		background: #e5e6eb;
		z-index: 0;
		height: 1px;
		width: 150px;
	}

	// .currentWarehouseReceipt::before {
	// 	content: '';
	// 	position: absolute;
	// 	bottom: 50%;
	// 	right: 100%;
	// 	width: 150px;
	// 	height: 1px;
	// 	background: #e5e6eb;
	// }
	// .currentWarehouseReceipt::after {
	// 	content: '';
	// 	position: absolute;
	// 	bottom: 50%;
	// 	left: 100%;
	// 	width: 150px;
	// 	height: 1px;
	// 	background: #e5e6eb;
	// }
	.childWarehouseReceipt::before {
		content: '';
		position: absolute;
		bottom: (100% + 2px);
		left: 50%;
		width: 1px;
		height: 82px;
		background: #e5e6eb;
		z-index: 0;
	}
}
</style>
