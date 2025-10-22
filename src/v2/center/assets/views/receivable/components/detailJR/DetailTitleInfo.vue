<template>
	<div>
		<div class="titleInfoTitle">
			<a-space :size="12">
				<em
					class="contractTypeSymbol"
					style="background: var(--primary-color)"
				>
					收
				</em>
				<span>应收账款流水号：{{ detailDataReceivalVO.serialNo }}</span>
				<div
					style="margin-right: 10px"
					@mouseenter="copyVisible = true"
					@mouseleave="copyVisible = false"
				>
					<Copy
						class="cur"
						v-show="!copyVisible"
					></Copy>
					<span
						v-show="copyVisible"
						v-clipboard:success="onCopy"
						v-clipboard:error="onError"
						v-clipboard:copy="detailDataReceivalVO.serialNo"
					>
						<CopyNow class="cur"></CopyNow>
					</span>
				</div>
				<span
					v-if="detailDataReceivalVO.statusText"
					:class="`statusDes status-${detailDataReceivalVO.status}`"
					>{{ detailDataReceivalVO.statusText }}</span
				>
			</a-space>
		</div>
		<a-row class="supple-info">
			<div class="titleInfoItem">
				<span class="label">所属合同编号：</span>
				<span class="omit">
					<a-tooltip>
						<template slot="title">
							{{ detailDataReceivalVO.contractNo }}
						</template>
						<span>{{ detailDataReceivalVO.contractNo }}</span>
					</a-tooltip>
				</span>
				<div
					style="margin-left: 10px"
					@mouseenter="copyVisible1 = true"
					@mouseleave="copyVisible1 = false"
				>
					<Copy
						class="cur"
						v-show="!copyVisible1"
					></Copy>
					<span
						v-show="copyVisible1"
						v-clipboard:success="onCopy"
						v-clipboard:error="onError"
						v-clipboard:copy="detailDataReceivalVO.contractNo"
					>
						<CopyNow class="cur"></CopyNow>
					</span>
				</div>
			</div>
			<div class="titleInfoItem">
				<span class="label">卖方企业：</span>
				<span class="omit">
					<a-tooltip v-if="detailDataReceivalVO.sellerName">
						<template slot="title">
							{{ detailDataReceivalVO.sellerName }}
						</template>
						{{ detailDataReceivalVO.sellerName }}
					</a-tooltip>
					<span v-else>-</span>
				</span>
			</div>
			<div class="titleInfoItem">
				<span class="label">买方企业：</span>
				<span class="omit">
					<a-tooltip v-if="detailDataReceivalVO.buyerName">
						<template slot="title">
							{{ detailDataReceivalVO.buyerName }}
						</template>
						{{ detailDataReceivalVO.buyerName }}
					</a-tooltip>
					<span v-else>-</span>
				</span>
			</div>
			<div class="titleInfoItem">
				<span class="label">行业：</span>
				<span class="omit">
					{{ detailDataReceivalVO.industryTypeDesc || '-' }}
				</span>
			</div>
			<div class="titleInfoItem">
				<span class="label">资金类型：</span>
				<span class="omit">
					{{ detailDataReceivalVO.paymentTypeName || '-' }}
				</span>
			</div>
			<div class="titleInfoItem">
				<span class="label">金融机构：</span>
				<span class="omit">
					<a-tooltip v-if="detailDataReceivalVO.bankName">
						<template slot="title">
							{{ detailDataReceivalVO.bankName }}
						</template>
						{{ detailDataReceivalVO.bankName }}
					</a-tooltip>
					<span v-else>-</span>
				</span>
			</div>
			<div class="titleInfoItem">
				<span class="label">应收账款申请日期：</span>
				<span class="omit">
					<a-tooltip v-if="detailDataReceivalVO.requestTime">
						<template slot="title">
							{{ detailDataReceivalVO.requestTime }}
						</template>
						{{ detailDataReceivalVO.requestTime }}
					</a-tooltip>
					<span v-else>-</span>
				</span>
			</div>
		</a-row>
	</div>
</template>
<script>
import { Copy, CopyNow } from '@sub/components/svg/index';

export default {
	props: {
		detailData: {}
	},
	data() {
		return {
			copyVisible: false,
			copyVisible1: false,
			copyVisible2: false
		};
	},
	methods: {
		// 复制成功 or 失败（提示信息！！！）
		onCopy: function (e) {
			this.$message.success('复制成功');
			console.log('复制成功！', e);
		},
		onError: function (e) {
			this.$message.error('复制失败');
			console.log('复制失败！', e);
		}
		// goContract() {
		// 	const type = 'BUY';
		// 	let { contractType, orderId } = this.detailData.receivalVO;
		// 	let path = `/center/contract/${type.toLowerCase()}/${contractType.toLowerCase()}/detail?id=${orderId}&type=${type}`;
		// 	const routeData = this.$router.resolve({
		// 		path
		// 	});
		// 	window.open(routeData.href, '_blank');
		// }
	},
	components: {
		Copy,
		CopyNow
	},
	computed: {
		detailDataReceivalVO() {
			return this.detailData?.receivalVO || {};
		}
	}
};
</script>

<style lang="less" scoped>
.titleInfoTitle {
	margin-bottom: 20px;
	font-size: 16px;
	font-family:
		PingFangSC-Medium,
		PingFang SC !important;
	font-weight: 500;
	line-height: 22px;
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
		cursor: pointer;

		&.status-TO_BE_CONFIRM,
		&.status-TO_BE_SIGN,
		&.status-TO_STORAGE_AUDITING {
			background: #c9d9ff;
			color: #596fa0;
		}

		&.status-COUNTERFOIL_DONE,
		&.status-FUNDED {
			background: #c5ecdd;
			color: #3eb384;
		}

		&.status-PLATFORM_REJECT,
		&.status-OA_REJECT,
		&.status-BANK_REJECT,
		&.status-PLATFORM_OPERATE_REJECT {
			background: #f2d0d0;
			color: #dd4444;
		}

		&.status-INVALID,
		&.status-CANCEL {
			// 已作废
			background: #e0e0e0;
			color: rgba(0, 0, 0, 0.25);
		}
	}
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

.cur {
	cursor: pointer;
}
</style>
