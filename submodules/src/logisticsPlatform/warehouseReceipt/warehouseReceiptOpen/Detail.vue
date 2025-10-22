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
				<span>电子仓单开立详情</span>
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
									>仓</em
								>
								<div
									@mouseenter="copyVisible = true"
									@mouseleave="copyVisible = false"
								>
									<span
										class="cur"
										style="margin-right: 10px"
										>仓单编号：{{ detailData.serialNo }}</span
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
								<span class="text status" :class="detailData.status">{{detailData.statusDesc}}</span>
							</a-space>
						</div>
					</div>
				</a-col>
			</a-row>
			<a-row class="supple-info">
				<div class="titleInfoItem">
					<span class="label">存货人：</span>
					<span class="omit">
						<a-tooltip>
							<template slot="title">
								{{ detailData.bailorCompanyName }}
							</template>
							{{ detailData.bailorCompanyName  }}
						</a-tooltip>
					</span>
				</div>
				<div class="titleInfoItem">
					<span
						class="label"
						style="width: 80px"
						>仓储企业：</span
					>
					<span class="omit">
						<a-tooltip>
							<template slot="title">
								{{ detailData.warehouseCompanyName }}
							</template>
							{{ detailData.warehouseCompanyName }}
						</a-tooltip>
					</span>
				</div>
        <div class="titleInfoItem">
					<span
						class="label"
						style="width: 80px"
						>仓库名称：</span
					>
					<span>{{ detailData.stationName }}</span>
				</div>
				<div class="titleInfoItem">
					<span
						class="label"
						style="width: 80px"
						>货物名称：</span
					>
					<span>{{ detailData.goodsName }}</span>
				</div>
        <div class="titleInfoItem">
					<span
						class="label"
						style="width: 80px"
						>仓单数量：</span
					>
					<span>{{ detailData.quantity | formatMoney }}吨</span>
				</div>
        <div class="titleInfoItem">
					<span
						class="label"
						style="width: 80px"
						>创建时间：</span
					>
					<span>{{ detailData.createDate }}</span>
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
					tab="详情信息"
				>
        <BaseInfo :detailData='detailData' @viewPDF='viewPDF' @download='download' @downloadAll='downloadAll' :type='type'></BaseInfo>
				</a-tab-pane>

				<a-tab-pane
					key="log"
					tab="操作记录"
				>
					<Log
						:list="detailData.operationLogVOList"
						:viewHandleColumns="viewHandleColumns"
					></Log>
				</a-tab-pane>
        <a-tab-pane
					key="log1"
					tab="区块链记录"
				>
					<BlockChain
						:chainListApi="chainListApi"
						:chainDetailApi='chainDetailApi'
						:downBlockChainCer='downBlockChainCer'
						chaincode="warehousereceipt" 
						:traceCode="detailData.traceCode"
						 v-if="!$slots.blockTable"
					></BlockChain>
					<div  style="margin-top:20px" v-else>
						<slot name="blockTable"></slot>
					</div>
					
				</a-tab-pane>
			</a-tabs>
		</a-card>
	</div>
</template>

<script>
import { Copy, CopyNow } from '@sub/components/svg/index';
import Log from '@sub/financing/Log';
import BaseInfo from '@sub/logisticsPlatform/warehouseReceipt/warehouseReceiptOpen/BaseInfo.vue';
import BlockChain from '@sub/logisticsPlatform/components/BlockChain.vue';

import moment from 'moment';
import {formatMoney } from '@sub/filters'
const viewHandleColumns = [
	{ title: '操作类型', key: 'optType', dataIndex: 'optType' },
	{ title: '操作人员', key: 'optName', dataIndex: 'optName' },
	{ title: '所属公司', key: 'optCompanyName', dataIndex: 'optCompanyName', customRender: t => t || '-' },
	{ title: '操作内容', key: 'remark', dataIndex: 'remark' },
	{ title: '操作时间', key: 'optTime', dataIndex: 'optTime', fixed: 'right' }
];
export default {
	props: {
		type: {
			default: 'rest'
		},
		detailData: {
			default: () => {
				return { auditChainAndOperator: {} };
			}
		},
		chainListApi: {},
		chainDetailApi: {},
		downBlockChainCer: {},

	},
	data() {
		return {
			copyVisible: false,
			viewHandleColumns
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
		},
		viewPDF(item) {
			this.$emit('viewPDF', item);
		},
		download(item) {
			this.$emit('download', item);
		},
		downloadAll() {
			this.$emit('downloadAll');
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
			width: 25%;
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
				width: calc(100% - 80px);
				color: rgba(0, 0, 0, 0.8);
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
	background: #f3f5f6;
	height: 20px;
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
	display: inline-block;
	padding: 1px 6px;
	align-items: flex-start;
	gap: 10px;
	text-align: center;
	border-radius: 4px;
	font-family: PingFang SC;
	font-size: 12px;
	margin-left: 4px;
	background: #D3DFFB;
	color: #4682F3;
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
	vertical-align: middle;
}
.AUDITING {
	background:#FFDAC8;
	color: #FF7937;
}
.TO_STORAGE_SIGN, .OPENED {
	background: #C5ECDD;
	color: #3EB384;
}
.TO_STORAGE_AUDITING {
	background: #C9D9FF;
	color: #596FA0;
}
.EXPIRE {
	background: #E0E0E0;
	color: rgba(0, 0, 0, 0.25);
}
.REJECT,.CANCEL {
	background: #F2D0D0;
	color: #DD4444;
}
.special {
	/deep/ span {
		padding: 0 !important;
	}
}
</style>
