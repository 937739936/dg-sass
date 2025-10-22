<template>
	<a-tooltip
		overlayClassName="tip-content"
		placement="right"
	>
		<template slot="title">
			<p
				v-for="(item, index) in columns"
				:key="index"
			>
				<span class="title">{{ item.label }}：</span>
				<span
					v-if="item.dataIndex === 'status'"
					:class="'statusDes ' + 'status-' + receipt.status"
					>{{ receipt.statusDesc }}</span
				>
				<span
					v-else
					class="content"
					>{{ receipt[item.dataIndex] | formatMoney }}
				</span>
			</p>
		</template>
		<div>{{ level == 'current' ? '当前' : '' }}仓单编号:{{ receipt.serialNo }}</div>
	</a-tooltip>
</template>
<script>
import { getPopupContainer } from '@sub/utils/factory.js';

export default {
	props: {
		receipt: {
			default: {}
		},
		level: {}
	},
	computed: {
		columns() {
			const { type } = this.receipt;
			let arr = [];
			switch (type) {
				case 'OUTBOUND':
					// 提货
					arr = [
						{
							label: '提货方',
							dataIndex: 'deliveryCompanyName'
						}
					];
					break;
				case 'TRANSFER':
					// 过户
					arr = [
						{
							label: '转让方',
							dataIndex: 'transferorName'
						},
						{
							label: '接收方',
							dataIndex: 'receiverName'
						}
					];
					break;
				default:
					break;
			}

			const cols = [
				{
					label: '存货人',
					dataIndex: 'bailorCompanyName'
				},
				...arr,
				{
					label: '仓储企业',
					dataIndex: 'warehouseCompanyName'
				},
				{
					label: '仓库名称',
					dataIndex: 'stationName'
				},
				{
					label: '货物名称',
					dataIndex: 'goodsName'
				},
				{
					label: '仓单数量',
					dataIndex: 'quantity'
				},
				{
					label: '仓单状态',
					dataIndex: 'status'
				}
			];
			return cols;
		}
	},
	methods: {
		getPopupContainer
	}
};
</script>
<style lang="less">
.tip-content {
	.ant-tooltip-arrow {
		display: none;
	}
	.ant-tooltip-inner {
		min-width: 330px;
		border-radius: 4px;
		background-color: #fff;
		box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.13);
		padding: 8px;
		position: relative;
		z-index: 1000;
	}
	p {
		padding: 8px;
	}
	.title {
		color: #00000066 !important;
		font-size: 14px;
	}
	.content {
		color: black;
		font-size: 14px;
	}
	.statusDes {
		display: inline-block;
		font-size: 12px;
		color: #4682f3;
		cursor: pointer;
		&.status-WAIT_SELLER_AUDITING,
		&.status-TO_STORAGE_SIGN,
		&.status-TO_STORAGE_AUDITING {
			color: #596fa0;
		}
		&.status-OUTBOUND {
			color: #3eb384;
		}
		&.status-REJECT {
			color: #dd4444;
		}

		&.status-CANCEL {
			color: rgba(0, 0, 0, 0.25);
		}
	}
}
</style>
