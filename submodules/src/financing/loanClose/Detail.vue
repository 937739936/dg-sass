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
				<span>贷后结清详情</span>
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
									>结</em
								>
								<div
									@mouseenter="copyVisible = true"
									@mouseleave="copyVisible = false"
								>
									<span
										class="cur"
										style="margin-right: 10px"
										>结清协议编号：{{ detailData.settlementAgreementVO.serialNo }}</span
									>
									<Copy
										class="cur"
										v-show="!copyVisible"
									></Copy>
									<span
										v-show="copyVisible"
										v-clipboard:success="onCopy"
										v-clipboard:error="onError"
										v-clipboard:copy="detailData.settlementAgreementVO.serialNo"
									>
										<CopyNow class="cur"></CopyNow>
									</span>
								</div>
								<span
									class="text status"
									:class="detailData.settlementAgreementVO.status"
									>{{ detailData.settlementAgreementVO.statusDesc }}</span
								>
							</a-space>
						</div>
					</div>
				</a-col>
			</a-row>
			<a-row class="supple-info">
				<div class="titleInfoItem titleInfoItem2">
					<span
						class="label"
						style="width: 80px"
						>融资方：</span
					>
					<span class="omit">
						<a-tooltip>
							<template slot="title">
								{{ detailData.settlementAgreementVO.financier }}
							</template>
							{{ detailData.settlementAgreementVO.financier }}
						</a-tooltip>
					</span>
				</div>
				<div class="titleInfoItem titleInfoItem2">
					<span
						class="label"
						style="width: 80px"
						>出资机构：</span
					>
					<span class="omit">
						<a-tooltip>
							<template slot="title">
								{{ detailData.settlementAgreementVO.bankName }}
							</template>
							{{ detailData.settlementAgreementVO.bankName }}
						</a-tooltip>
					</span>
				</div>
				<div class="titleInfoItem">
					<span
						class="label"
						style="width: 80px"
						>签订时间：</span
					>
					<span>{{ detailData.settlementAgreementVO.signDate }}</span>
				</div>
				<div class="titleInfoItem dflex">
					<span
						class="label"
						style="width: 80px"
						>融资编号：</span
					>
					<div class="financing-box">
						<a
							href="javascript:;"
							class="financing-box-item"
							v-for="(item, i) in detailData.settlementAgreementVO.settlementAgreementFinancingApplyRelList"
							:key="i"
						>
							<span @click="goFinancingDetail(item)">{{ item.financingApplyNo }}</span>
							<span
								v-clipboard:success="onCopy"
								v-clipboard:error="onError"
								v-clipboard:copy="item.financingApplyNo"
							>
								<Copy></Copy>
							</span>
						</a>
					</div>
				</div>
				<div class="titleInfoItem">
					<span
						class="label"
						style="width: 80px"
						>合同编号：</span
					>
					<a
						href="javascript:;"
						v-if="detailData.settlementAgreementVO.contractNo && detailData.settlementAgreementVO.contractUrl "
						@click="openAgr"
						>{{ detailData.settlementAgreementVO.contractNo }}</a
					>
          <span v-else>{{ detailData.settlementAgreementVO.contractNo }}</span>
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
					tab="结清信息"
				>
					<div style="width: 100%">
						<div
							class="slTitleAssis"
							style="margin-bottom: 20px"
						>
							还款信息
						</div>
						<div class="returned-info-top">
							<div class="returned-info-top-item">
								<p class="c4 ft14 fw600">放款金额合计</p>
								<p
									class="c8 ft20 fw600"
									v-if="detailData.settlementAgreementVO.finAmount"
								>
									￥{{ formatMoney(detailData.settlementAgreementVO.finAmount) }}
								</p>
								<p
									class="c8 ft20 fw600"
									v-else
								>
									-
								</p>
							</div>
							<div class="returned-info-top-item common">
								<p class="c4 ft14 fw600">已还本金合计</p>
								<p
									class="c8 ft20 fw600"
									v-if="totalMoneyInfo.repayPrincipal"
								>
									￥{{ formatMoney(totalMoneyInfo.repayPrincipal) }}
								</p>
								<p
									class="c8 ft20 fw600"
									v-else
								>
									-
								</p>
							</div>
							<div class="returned-info-top-item common2">
								<p class="c4 ft14 fw600">已还利息合计</p>
								<p
									class="c8 ft20 fw600"
									v-if="totalMoneyInfo.repayInterest"
								>
									￥{{ formatMoney(totalMoneyInfo.repayInterest) }}
								</p>
								<p
									class="c8 ft20 fw600"
									v-else
								>
									-
								</p>
							</div>
							<div class="returned-info-top-item common">
								<p class="c4 ft14 fw600">已还款总额</p>
								<p
									class="c8 ft20 fw600"
									v-if="totalMoneyInfo.repayAmount"
								>
									￥{{ formatMoney(totalMoneyInfo.repayAmount) }}
								</p>
								<p
									class="c8 ft20 fw600"
									v-else
								>
									-
								</p>
							</div>
						</div>
						<a-table
							rowKey="name"
							class="new-table"
							style="margin-top: 30px"
							:columns="columns"
							:dataSource="detailData.repayList"
							:pagination="false"
							:defaultExpandAllRows="true"
							:locale="{ emptyText: '暂无数据' }"
						>
							<div
								slot="repayAmount"
								slot-scope="text"
							>
								<a-tooltip>
									<template
										slot="title"
										v-if="text"
										>{{ convertCurrency(text) }}
									</template>

									<span v-if="text">￥</span> {{ formatMoney(text) || '-' }}
								</a-tooltip>
							</div>
							<div
								slot="repayPrincipal"
								slot-scope="text"
							>
								<a-tooltip>
									<template
										slot="title"
										v-if="text"
										>{{ convertCurrency(text) }}
									</template>

									<span v-if="text">￥</span> {{ formatMoney(text) || '-' }}
								</a-tooltip>
							</div>
							<div
								slot="serviceCharge"
								slot-scope="text"
							>
								<a-tooltip>
									<template
										slot="title"
										v-if="text"
										>{{ convertCurrency(text) }}
									</template>

									<span v-if="text">￥</span> {{ formatMoney(text) || '-' }}
								</a-tooltip>
							</div>
							<div
								slot="repayInterest"
								slot-scope="text"
							>
								<a-tooltip>
									<template
										slot="title"
										v-if="text"
										>{{ convertCurrency(text) }}
									</template>

									<span v-if="text">￥</span> {{ formatMoney(text) || '-' }}
								</a-tooltip>
							</div>
						</a-table>
						<div
							class="slTitleAssis"
							style="margin-bottom: 20px"
						>
							结清协议
						</div>
						<a-table
							rowKey="name"
							class="new-table"
							:columns="fileColumns"
							:dataSource="fileList"
							:pagination="false"
							:defaultExpandAllRows="true"
							:locale="{ emptyText: '暂无数据' }"
						>
							<div
								slot="statusText"
								slot-scope="text"
							>
								<span class="status">{{ text }}</span>
							</div>
							<div
								slot="action"
								slot-scope="text, record"
							>
								<a-space>
									<a
										href="javascript:;"
										@click="viewPDF(record)"
										>查看</a
									>
									<a
										href="javascript:;"
										style="margin-left: 24px"
										@click="download(record)"
										>下载</a
									>
								</a-space>
							</div>
						</a-table>
					</div>
				</a-tab-pane>

				<a-tab-pane
					key="log"
					tab="操作记录"
				>
					<Log
						:list="detailData.operationLogVoList"
						:viewHandleColumns="viewHandleColumns"
					></Log>
				</a-tab-pane>
			</a-tabs>
		</a-card>
	</div>
</template>

<script>
import { Copy, CopyNow } from '@sub/components/svg/index';
import Log from '@sub/financing/Log';

import moment from 'moment';

import { formatMoney } from '@sub/filters';

const viewHandleColumns = [
	{ title: '操作类型', key: 'operationType', dataIndex: 'operationType' },
	{ title: '操作人员', key: 'personalName', dataIndex: 'personalName' },
	{ title: '所属公司', key: 'companyName', dataIndex: 'companyName', customRender: t => t || '-' },
	{ title: '操作内容', key: 'comments', dataIndex: 'comments' },
	{ title: '操作时间', key: 'operationTime', dataIndex: 'operationTime', fixed: 'right' }
];
const columns = [
	{
		title: '序号',
		dataIndex: '',
		key: 'rowIndex',
		width: 80,
		align: 'left',
		customRender: function (t, r, index) {
			return parseInt(index) + 1;
		}
	},
	{ title: '融资编号', dataIndex: 'financingApplyNo' },
	{ title: '还款日期', dataIndex: 'repayDate' },
	{ title: '还款总额', dataIndex: 'repayAmount', scopedSlots: { customRender: 'repayAmount' } },
	{ title: '还款本金', dataIndex: 'repayPrincipal', scopedSlots: { customRender: 'repayPrincipal' } },
	{ title: '还款利息', dataIndex: 'repayInterest', scopedSlots: { customRender: 'repayInterest' } },
	{ title: '其他费用', dataIndex: 'serviceCharge', scopedSlots: { customRender: 'serviceCharge' } }
];
const fileColumns = [
	{ title: '文件类型', dataIndex: 'fileTypeDesc' },
	{ title: '文件名称', dataIndex: 'fileName' },
	{ title: '文件编号', dataIndex: 'fileNo' },
	{ title: '签订日期', dataIndex: 'signDate' },

	{ title: '操作', key: 'action', scopedSlots: { customRender: 'action' }, width: 160 }
];
import { filterCodeByValueName, filterCodeByKey, convertCurrency } from '@sub/utils/globalCode.js';
export default {
	props: {
		type: {
			default: 'rest'
		},
		detailData: {
			default: () => {
				return {
					settlementAgreementVO: {}
				};
			}
		}
	},
	data() {
		return {
			copyVisible: false,
			viewHandleColumns,
			columns,
			fileColumns
		};
	},
	computed: {
		VUEX_ST_COMPANYSUER() {
			if (this.$store.state.user) {
				return this.$store.state.user.VUEX_ST_COMPANYSUER || {};
			}
			return {};
		},
		// 已还款本金 已还款利息 已还款 总额
		totalMoneyInfo() {
			let repayPrincipal = 0;
			let repayInterest = 0;
			let repayAmount = 0;
			let list = this.detailData.repayList || [];
			list.forEach(el => {
				repayPrincipal += el.repayPrincipal || 0;
				repayInterest += el.repayInterest || 0;
				repayAmount += el.repayAmount || 0;
			});
			return {
				repayPrincipal,
				repayInterest,
				repayAmount
			};
		},
		fileList() {
			return [
				{
					fileTypeDesc: this.detailData.settlementAgreementVO.fileTypeDesc,
					fileName: this.detailData.settlementAgreementVO.fileName,
					fileNo: this.detailData.settlementAgreementVO.fileNo,
					signDate: this.detailData.settlementAgreementVO.signDate
				}
			];
		}
	},
	methods: {
		formatMoney,
		convertCurrency,
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
			this.$emit('viewPDF', this.detailData.settlementAgreementVO);
		},
		download(item) {
			this.$emit('download', this.detailData.settlementAgreementVO);
		},
		goFinancingDetail(item) {
			if(this.type == 'admin') {
				window.open(`/financing/financingDetail?id=${item.financingApplyId}`)
			} else {
				window.open(`/center/financing/financingDetail?id=${item.financingApplyId}&handleType=detail`)
			}
			
		},
		openAgr() {
      const item = {
        ...this.detailData.settlementAgreementVO,
        fileUrl: this.detailData.settlementAgreementVO.contractUrl
      }
			this.$emit('viewPDF', item);
		}
	},
	components: {
		Copy,
		CopyNow,
		Log
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
				// width: calc(100% - 80px);
				color: rgba(0, 0, 0, 0.8);
			}
		}
		.titleInfoItem2 {
			display: flex;
			.omit {
				flex: 1;
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
	background: #d3dffb;
	color: #4682f3;
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
	vertical-align: middle;
}
.BANK_OA_AUDITING {
	background: #ffdac8;
	color: #ff7937;
}
.EFFECTIVE {
	background: #c5ecdd;
	color: #3eb384;
}
.WAIT_TO_SEAL {
	background: #c9d9ff;
	color: #596fa0;
}
.INVALID {
	background: #e0e0e0;
	color: rgba(0, 0, 0, 0.25);
}
.BANK_OA_REJECT {
	background: #f2d0d0;
	color: #dd4444;
}
.returned-info-top {
	width: 100%;
	row-gap: 20px;
	display: flex;
	justify-content: space-between;
	align-items: center;

	&-item {
		// width: 188px;
		height: 100px;
		flex-shrink: 0;
		padding: 20px 12px;
		box-sizing: border-box;
		border-radius: 6px;
		background: #f0f8ff;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		margin-right: 20px;
		flex: 1;
		&.common {
			background: #ebfaef;
		}
		&.common2 {
			background: #fff9e9;
		}
		&:last-child {
			margin-right: 0;
		}
	}
}
.returned-info-left {
	display: flex;
	align-items: center;
}
.c4 {
	color: rgba(0, 0, 0, 0.4);
}
.c8 {
	color: rgba(0, 0, 0, 0.8);
}
.ft14 {
	font-size: 14px;
}
.ft20 {
	font-size: 20px;
}
.fw600 {
	font-weight: 600;
}
.dflex {
	display: flex !important;
	// overflow: hidden;
}
.financing-box {
	// text-overflow: ellipsis;
	flex: 1;
	// white-space: nowrap;
	// overflow: hidden;
	display: inline-block;
	vertical-align: middle;
	word-break: break-all;

	&-item {
		margin-right: 5px;
		span {
			margin-right: 4px;
			word-break: break-all;
		}
		svg {
			position: relative;
			top: 2px;
		}
	}
}
</style>
