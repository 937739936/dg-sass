<template>
	<div>
		<a-card
			:bordered="false"
			style="padding-bottom: 20px"
		>
			<div
				slot="title"
				class="slTitle"
			>
				<span>电子仓单提货详情</span>
			</div>
			<div class="titleInfoTitle">
				<a-space :size="12">
					<em
						class="contractTypeSymbol"
						style="background: var(--primary-color)"
						>提</em
					>
					<div
						@mouseenter="copyVisible = true"
						@mouseleave="copyVisible = false"
					>
						<span
							class="cur"
							style="margin-right: 10px"
							>提货申请流水号：{{ detailData.serialNo }}</span
						>
						<Copy
							class="cur"
							v-show="!copyVisible"
						></Copy>
						<span
							v-show="copyVisible"
							v-clipboard:success="onCopy"
							v-clipboard:error="onError"
							v-clipboard:copy="detailData.serialNo"
						>
							<CopyNow class="cur"></CopyNow>
						</span>
					</div>
					<span
						v-if="detailData.statusDesc"
						:class="`statusDes status-${detailData.status}`"
						>{{ detailData.statusDesc }}</span
					>
				</a-space>
			</div>
			<a-row class="supple-info">
				<div class="titleInfoItem">
					<span class="label">提货方：</span>
					<span class="omit">
						<a-tooltip>
							<template slot="title">
								{{ detailData.deliveryCompanyName }}
							</template>
							{{ detailData.deliveryCompanyName }}
						</a-tooltip>
					</span>
				</div>
				<div class="titleInfoItem">
					<span class="label">仓储企业：</span>
					<span class="omit">
						<a-tooltip v-if="detailData.warehouseCompanyName">
							<template slot="title">
								{{ detailData.warehouseCompanyName }}
							</template>
							{{ detailData.warehouseCompanyName }}
						</a-tooltip>
						<span v-else>-</span>
					</span>
				</div>
				<div class="titleInfoItem">
					<span class="label">仓库名称：</span>
					<span class="omit">{{ detailData.place }}</span>
				</div>
				<div class="titleInfoItem">
					<span class="label">货物名称：</span>
					<span class="omit">{{ detailData.goodsName }}</span>
				</div>
				<div class="titleInfoItem">
					<span class="label">提货数量合计：</span>
					<span class="omit">{{ detailData.quantity }}吨</span>
				</div>
			</a-row>
		</a-card>
		<a-card
			:bordered="false"
			style="padding-top: 10px"
		>
			<a-tabs>
				<a-tab-pane
					key="info"
					tab="详细信息"
				>
					<BaseInfo
						:detailData="detailData"
						@filePreview="filePreview"
						@download="download"
						:type="type"
					></BaseInfo>
				</a-tab-pane>

				<a-tab-pane
					key="log"
					tab="操作记录"
				>
					<Log :list="detailData.operationLogVOList"></Log>
				</a-tab-pane>
				<a-tab-pane
					key="chain"
					tab="区块链记录"
				>
					<BlockChain
						:chainListApi="chainListApi"
						:chainDetailApi="chainDetailApi"
						:downBlockChainCer="downBlockChainCer"
						chaincode="warehousereceiptmanage"
						:traceCode="detailData.traceCode"
						v-if="!$slots.blockTable"
					></BlockChain>
					<div
						style="margin-top: 20px"
						v-else
					>
						<slot name="blockTable"></slot>
					</div>
				</a-tab-pane>
			</a-tabs>
		</a-card>
	</div>
</template>

<script>
import { Copy, CopyNow } from '@sub/components/svg/index';
import Log from '@sub/logisticsPlatform/warehouseReceipt/warehouseReceiptDelivery/components/Log';
import BaseInfo from '@sub/logisticsPlatform/warehouseReceipt/warehouseReceiptDelivery/components/BaseInfo.vue';
import BlockChain from '@sub/logisticsPlatform/components/BlockChain.vue';
import comDownload from '@sub/utils/comDownload';

export default {
	props: {
		type: {
			default: 'rest'
		},
		detailData: {
			default: {}
		},
		fileDownloadApi: {},
		chainListApi: {},
		chainDetailApi: {},
		downBlockChainCer: {}
	},
	data() {
		return {
			copyVisible: false
		};
	},
	mounted() {},
	methods: {
		// 复制成功 or 失败（提示信息！！！）
		onCopy: function (e) {
			this.$message.success('复制成功');
			console.log('复制成功！', e);
		},
		onError: function (e) {
			this.$message.error('复制失败');
			console.log('复制失败！', e);
		},
		download(item) {
			if (!this.fileDownloadApi | !item) return;
			let type = item.type === 'WAREHOUSE_RECEIPT' ? '2' : '1';
			this.fileDownloadApi({ id: this.detailData.id, type: type })
				.then(result => {
					comDownload(result.data, undefined, result.name);
				})
				.catch(err => {});
		},
		filePreview(item) {
			this.$emit('filePreview', item);
		}
	},
	components: {
		Copy,
		CopyNow,
		Log,
		BaseInfo,
		BlockChain
	}
};
</script>
<style lang="less" scoped>
@import url('~@sub/style/table-cover.less');
</style>
<style scoped lang="less">
.cur {
	cursor: pointer;
}
.slTitle {
	margin-bottom: 20px;
}
.titleInfoTitle {
	margin-bottom: 20px;
	font-size: 16px;
	font-family:
		PingFangSC-Medium,
		PingFang SC !important;
	font-weight: 500;
	line-height: 22px;
}

.supple-info {
	display: flex;
	// justify-content: space-between;
	align-items: center;
	flex-wrap: wrap;
	.titleInfoItem {
		width: 25%;
		display: flex;
		// position: relative;
		height: 40px;
		text-align: left;
		padding-right: 15px;

		.label {
			display: inline-block;
			// width: auto;
			text-align: left;
			color: rgba(0, 0, 0, 0.4);
			white-space: nowrap;
		}
		.omit {
			text-overflow: ellipsis;
			white-space: nowrap;
			overflow: hidden;
			display: inline-block;
			// vertical-align: bottom;
			// width: calc(100% - 80px);
			color: rgba(0, 0, 0, 0.8);
			// flex: 1;
		}
	}
}
.ant-card {
	padding: 20px 30px;
	margin-bottom: 20px;
}
.ant-card:last-child {
	margin-bottom: 0;
}

.contractTypeSymbol {
	display: inline-block;
	width: 18px;
	height: 18px;
	background: var(--vi, #91c7cb);
	color: #fff;
	text-align: center;
	line-height: 18px;
	border-radius: 4px;
	font-style: normal;
	font-size: 14px;
	position: relative;
	top: -1px;
	font-weight: 600;
}

.statusDes {
	display: inline-block;
	padding: 4px 6px;
	border-radius: 4px;
	font-size: 12px;
	line-height: 12px;
	background: #d3dffb;
	color: #4682f3;
	&.status-WAIT_SELLER_AUDITING,
	&.status-TO_STORAGE_SIGN,
	&.status-TO_STORAGE_AUDITING {
		background: #c9d9ff;
		color: #596fa0;
	}
	&.status-OUTBOUND {
		// 已生效
		background: #c5ecdd;
		color: #3eb384;
	}

	&.status-SELLER_REJECT,
	&.status-STORAGE_REJECT {
		background: #f2d0d0;
		color: #dd4444;
	}

	&.status-CANCEL {
		// 已作废
		background: #e0e0e0;
		color: rgba(0, 0, 0, 0.25);
	}
}
</style>
