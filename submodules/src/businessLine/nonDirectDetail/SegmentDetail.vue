<template>
	<div class="segment-detail">
		<div class="segment-detail-left">
			<a-timeline>
				<a-timeline-item
					v-for="item in segmentItemsNotEmpty"
					:key="item.value"
					@click="selectedSegment(item)"
				>
					<span
						class="name"
						:class="{ active: segmentType == item.value }"
						>{{ item.label }}</span
					>
					<component
						:is="getSegmentIcons(item.value)"
						slot="dot"
					></component>
				</a-timeline-item>
			</a-timeline>
		</div>
		<a-spin
			:spinning="contentLoading"
			class="segment-detail-right-content"
		>
			<div>
				<slot></slot>
			</div>
		</a-spin>
	</div>
</template>

<script>
import {
	BusinessContract,
	BusinessContractSelect,
	BusinessFundSelect,
	BusinessFund,
	BusinessGoods,
	BusinessGoodsSelect,
	BusinessInvoice,
	BusinessInvoiceSelect,
	BusinessSettle,
	BusinessSettleSelect,
	BusinessTrading,
	BusinessTradingSelect,
	BusinessReturned,
	BusinessReturnedSelect
} from '@sub/components/svg';
import { init } from 'echarts';
export default {
	name: 'SegmentDetail',
	props: {
		segmentItems: {
			type: Array,
			default: () => []
		},
		contentLoading: {
			type: Boolean,
			default: false
		},
		// 初始化的segmentType
		segmentType: {
			type: String,
			default: 'contract'
		}
	},
	data() {
		return {
			// segmentType: this.initSegmentType || 'contract'
		};
	},
	computed: {
		segmentItemsNotEmpty() {
			return this.segmentItems || [];
		}
	},
	methods: {
		selectedSegment(item) {
			this.$emit('segmentTypeChange', item.value);
		},
		getSegmentIcons(value) {
			let icon = BusinessContract;
			let iconActive = BusinessContractSelect;
			switch (value) {
				case 'contract':
					icon = BusinessContract;
					iconActive = BusinessContractSelect;
					break;
				case 'goods':
					icon = BusinessGoods;
					iconActive = BusinessGoodsSelect;
					break;
				case 'fund':
					icon = BusinessFund;
					iconActive = BusinessFundSelect;
					break;
				case 'settle':
					icon = BusinessSettle;
					iconActive = BusinessSettleSelect;
					break;
				case 'invoice':
					icon = BusinessInvoice;
					iconActive = BusinessInvoiceSelect;
					break;
				case 'trading':
					icon = BusinessTrading;
					iconActive = BusinessTradingSelect;
					break;
				case 'returned':
					icon = BusinessReturned;
					iconActive = BusinessReturnedSelect;
					break;
				default:
					break;
			}
			if (value == this.segmentType) {
				return iconActive;
			}
			return icon;
		}
	}
};
</script>

<style lang="less" scoped>
.segment-detail {
	display: flex;
	flex-direction: row;
	padding: 30px;
	background: #fff;
	border-radius: 4px;
	.segment-detail-right-content {
		flex: 1;
		// background: red;
		overflow: hidden;
		white-space: nowrap;
	}
	.segment-detail-left {
		min-width: 160px;
		margin-top: 14px;
		::v-deep .ant-timeline {
			font-size: 14px;
			line-height: 20px;
		}
		::v-deep .ant-timeline-item {
			padding: 0 0 28px;
			cursor: pointer;
		}
		::v-deep .ant-timeline-item-tail {
			border-left: 1px solid rgba(229, 230, 235, 1);
			position: absolute;
			top: 20px;
			left: 8px;
			height: 19px;
			// left: 4px;
			height: calc(100% - 20px);
		}

		::v-deep .ant-timeline-item-head-custom {
			padding: 1px 0;
			width: 18px;
			height: 20px;
			transform: none;
			top: 0;
			left: 0;
		}
		::v-deep .ant-timeline-item-content {
			margin-left: 30px;
			top: 0;
		}
		.name {
			color: var(--text-80, rgba(0, 0, 0, 0.8));
			font-family: PingFang SC;
			font-size: 14px;
			cursor: pointer;
			&.active {
				color: @primary-color;
				font-weight: 500;
			}
		}
	}
}
</style>