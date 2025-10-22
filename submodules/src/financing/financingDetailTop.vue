<template>
	<div>
		<div
			slot="title"
			class="slTitle"
		>
			<span>{{ title }}</span>
		</div>
		<a-row
			type="flex"
			class="flex-top-box"
		>
			<a-col flex="1">
				<div class="titleInfoBox">
					<div class="titleInfoTitle">
						<a-space :size="12">
							<em
								class="contractTypeSymbol"
								style="background: var(--primary-color)"
								>融</em
							>
							<div
								@mouseenter="copyVisible = true"
								@mouseleave="copyVisible = false"
							>
								<span
									class="cur"
									style="margin-right: 10px"
									>融资编号：{{ detailData.serialNo }}</span
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
							<slot v-if="$slots.default"></slot>
							<FinancingTipInfo
								v-else
								:item="detailData"
								:API_GetFinancingStatusTip="API_GetFinancingStatusTip"
							></FinancingTipInfo>
						</a-space>
					</div>
				</div>
			</a-col>
		</a-row>
		<a-row class="supple-info">
			<div class="titleInfoItem">
				<span class="label">资金类型：</span>
				<span class="omit">
					<a-tooltip>
						<template slot="title">
							{{ detailData.name || detailData.productItemName }}
						</template>
						{{ detailData.name || detailData.productItemName }}
					</a-tooltip>
				</span>
				<!-- <span v-else>-</span> -->
			</div>
			<div class="titleInfoItem">
				<span
					class="label"
					style="width: 80px"
					>出资机构：</span
				>
				<span class="omit">
					<a-tooltip>
						<template slot="title">
							{{ detailData.bankName }}
						</template>
						{{ detailData.bankName }}
					</a-tooltip>
				</span>
			</div>
			<div class="titleInfoItem">
				<span
					class="label"
					style="width: 130px"
					>融资申请创建时间：</span
				>
				<span>{{ detailData.createDate }}</span>
			</div>
		</a-row>
	</div>
</template>

<script>
import { Copy, CopyNow } from '@sub/components/svg/index';
import { formatMoney } from '@sub/filters';
import { formatAccountNumber } from '@sub/utils/factory.js';
import FinancingTipInfo from '@sub/financing/FinancingTipInfo.vue';

import moment from 'moment';
export default {
	props: {
		handleType: {
			default: 'detail'
		},
		detailData: {
			default: () => {
				return {};
			}
		},
		type: {
			default: 'rest'
		},
		API_GetFinancingStatusTip: {},
		filterCodeByValueNameAdmin: {}
	},
	computed: {
		title() {
			if (this.handleType == 'detail') {
				return '融资详情';
			}
			return '审核';
		}
	},
	data() {
		return {
			copyVisible: false
		};
	},
	methods: {
		formatMoney,
		moment,
		formatAccountNumber,
		// 复制成功 or 失败（提示信息！！！）
		onCopy: function (e) {
			this.$message.success('复制成功');
			console.log('复制成功！', e);
		},
		onError: function (e) {
			this.$message.error('复制失败');
			console.log('复制失败！', e);
		},
		handlePreview(item) {
			this.$emit('handlePreview', item);
		},
		goBusinessLine(item) {
			this.$emit('goBusinessLine', item);
		},
		goSellContract(item) {
			this.$emit('goSellContract', item);
		},
		download(item) {
			this.$emit('download', item);
		}
	},
	components: {
		Copy,
		CopyNow,
		FinancingTipInfo
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
.slMain {
	font-family:
		PingFangSC-Regular,
		PingFang SC;
	.label,
	.fontlabel {
		color: rgba(0, 0, 0, 0.4);
	}
	.slTitle {
		margin-bottom: 20px;
	}
	.titleInfoBox {
		.titleInfoTitle {
			margin-bottom: 20px;
			font-size: 16px;
			font-family:
				PingFangSC-Medium,
				PingFang SC;
			font-weight: 500;
			line-height: 22px;
		}
	}
	.supple-info {
		display: flex;
		// justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		.titleInfoItem {
			width: 33%;
			display: inline-block;
			// padding-left: 112px;
			position: relative;
			height: 40px;
			float: left;
			.label {
				display: inline-block;
				width: 80px;
				text-align: left;
			}
			.omit {
				text-overflow: ellipsis;
				white-space: nowrap;
				overflow: hidden;
				display: inline-block;
				vertical-align: bottom;
				color: rgba(0, 0, 0, 0.8);
				width: calc(100% - 80px);
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
}
.contract-status {
	border-radius: 4px;
	height: 20px;
	line-height: 20px;
	padding: 0 5px;
	background: #c9d9ff;
	color: #596fa0;
	font-family:
		PingFangSC-Regular,
		PingFang SC;
	text-align: center;
	.text {
		font-size: 14px;
		zoom: 0.85;
		position: relative;
		top: -1px;
	}
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
.bot {
	margin-bottom: 0px !important;
	padding-bottom: 64px !important;
	padding-top: 0px !important;
	background: #fff !important;
}
.grid-wrap {
	margin-top: 10px;
	width: 100%;
	border-radius: 3px;
	padding: 0;
	height: auto;
	overflow: hidden;
	border-left: 1px solid #e5e6eb;
	li {
		width: 33.3%;
		height: 48px;
		float: left;
		border-bottom: 1px solid #e5e6eb;
		border-right: 1px solid #e5e6eb;
		overflow: hidden;
		position: relative;
		span {
			display: inline-block;
			height: 48px;
			line-height: 48px;
			padding: 0 12px;
		}
		& > span:first-child {
			border-right: 1px solid #e5e6eb;
		}
		.label {
			width: 160px;
			background: #f3f5f6;
			font-family:
				PingFangSC-Regular,
				PingFang SC;
			font-weight: 400;
			color: #77889d;
			position: absolute;
			left: 0;
			top: 0;
		}
		span:last-child {
			width: 100%;
			padding-left: 172px;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}
	li:nth-child(1),
	li:nth-child(2),
	li:nth-child(3) {
		border-top: 1px solid #e5e6eb;
	}
	li:nth-child(3) {
		border-radius: 0 3px 0 0;
	}
	li:last-child {
		border-radius: 0 0 3px 0;
	}
	li.special {
		border-radius: 0 3px 3px 0;
	}
}
.transportBox {
	.textOverflow {
		height: 48px;
		line-height: 48px;
		left: 160px;
		padding: 0 10px;
	}
}
.preview-box {
}
.line {
}
.money-box {
	display: flex;
	margin-bottom: 30px;
	&-item {
		width: 250px;
		height: 88px;
		flex-shrink: 0;
		border-radius: 6px;
		background: #f0f8ff;
		margin-right: 30px;
		padding: 14px 0;
		padding-left: 20px;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		color: var(--text-40, rgba(0, 0, 0, 0.4));
		p:last-child {
			color: var(--text-80, rgba(0, 0, 0, 0.8));
			font-family: PingFang SC;
			font-size: 20px;
			font-weight: 600;
		}
	}
}
.business-box {
	p {
		color: var(--text-40, rgba(0, 0, 0, 0.4));
		font-family: PingFang SC;
		font-size: 12px;
	}
	P:first-child {
		color: var(--text-80, rgba(0, 0, 0, 0.8));
		margin-bottom: 10px;
		font-size: 14px;
		display: flex;
		align-items: center;
	}
}
.business-box2 {
	color: var(--text-40, rgba(0, 0, 0, 0.4));
	font-size: 14px;
}
.status {
	border-radius: 4px;
	background: #c1d7ff;
	display: inline-flex;
	padding: 1px 6px;
	align-items: flex-start;
	gap: 10px;
	color: #4682f3;
	font-family: PingFang SC;
	font-size: 12px;
}
.PART_CLAIM {
	background: #ffdac8;
	color: #ff7937;
}
.CLAIMED {
	color: #3eb384;
	background: #c5ecdd;
}
.special {
	/deep/ span {
		padding: 0 !important;
	}
}
</style>
