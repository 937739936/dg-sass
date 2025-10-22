<template>
	<span>
		<a-tooltip
			placement="top"
			trigger="hover"
			overlayClassName="financing_inner"
			@visibleChange="e => visibleChange(e, item)"
			:overlayStyle="{ zIndex: 9999 }"
		>
			<template slot="title">
				<a-spin v-if="!tipShowText">
					<a-icon
						slot="indicator"
						type="sync"
						style="font-size: 16px; color: #fff"
						spin
					/>
				</a-spin>
				<span
					v-else
					v-html="tipShowText"
				>
				</span>
			</template>
			<!-- <a-icon type="question-circle" theme="filled" /> -->
			<span
				class="status"
				:class="item.status"
				>{{ item.statusText || filterCodeByValueName(item.status, 'financingStatusDict') || item.status }}</span
			>
		</a-tooltip>
	</span>
</template>

<script>
const tableTooltip = {
	TO_BE_SIGNED: '该融资申请已提交，待【融资申请企业-签章员】进行盖章',
	TRADER_AUDIT: '该融资申请待【融资发起方对应卖方企业】进行审核',
	TRADER_REJECT: '该融资申请被【融资发起方对应卖方企业】驳回',
	TRADER_TO_BE_SIGNED: '该融资申请待【融资发起方对应卖方企业-签章员】进行盖章',
	CORE_COMPANY_AUDIT: '该融资申请待【买方企业】进行审核',
	CORE_COMPANY_REJECT: '该融资申请被【买方企业】驳回',
	CORE_COMPANY_TO_BE_SIGNED: '该融资申请待【买方企业-签章员】进行盖章',
	OA_AUDIT: '该融资申请正处于【审批流程】流程',
	OA_REJECT: '该融资申请【审批流程】流程未通过',
	BANK_AUDIT: '该融资申请待【金融机构】进行审核',
	BANK_REJECT: '该融资申请被【金融机构】驳回',
	BANK_TO_BE_SIGNED: '该融资申请待【金融机构-签章员】进行盖章',
	WAITING_LOAN: '该融资申请待【金融机构】放款',
	LOANED: '该融资申请【金融机构】已放款',
	PART_REPAY: '该融资已完成部分还款',
	CLEARED: '该融资已全部结清',
	INVALID: '该融资申请已被【操作方名称】作废，<p class="tip">作废原因：【作废原因】</p>',
	PUSH_FAIL: '该融资推送资方系统失败，待平台风控进行处理'
};

import { filterCodeByValueName } from '@sub/utils/globalCode.js';

import { API_GetFinancingStatusTip } from '@/v2/center/financing/api/index.js';
export default {
	name: 'FinancingTipInfo',
	data() {
		return {
			filterCodeByValueName,
			tipShowText: ''
		};
	},
	props: {
		item: {
			type: Object,
			default: () => {}
		},
		pre: {
			type: Boolean,
			default: false
		}
	},
	methods: {
		visibleChange(visible, items) {
			if (visible) {
				this.tipShowText = '';
				API_GetFinancingStatusTip({
					applyNo: items.serialNo || items.financingApplySerialNo
				}).then(res => {
					this.tipShowTextMethods(items, res.data);
				});
			}
		},
		tipShowTextMethods(row, data) {
			let text = '';
			text = tableTooltip[row.status] || '';
			if (!text) {
				this.tipShowText = row.statusText;
				return;
			}

			if (this.pre) {
				text = text
					.replace('【融资发起方对应卖方企业-签章员】', data.sellerAbbreviation + '-' + data.sellerSignerNames)
					.replace('【融资发起方对应卖方企业】', data.sellerAbbreviation || '')
					.replace('【融资申请企业-签章员】', data.initAbbreviation + '-' + data.initSignerNames)
					.replace('【审批流程】', data.auditDesc || '')
					.replace('【金融机构】', data.bankAbbreviation || '')
					.replace('【金融机构-签章员】', data.bankAbbreviation + '-' + data.bankSignerNames)
					.replace('【操作方名称】', data.operator || '')
					.replace('【买方企业】', data.sellerUpAbbreviation || '')
					.replace('【买方企业-签章员】', data.sellerUpAbbreviation + '-' + data.sellerUpSignerNames)
					.replace('【作废原因】', data.cancelReason || '');
			} else {
				text = text
					.replace('【融资发起方对应卖方企业】', data.sellerAbbreviation || '')
					.replace('【融资申请企业-签章员】', data.initAbbreviation + '-' + data.initSignerNames)
					.replace('【审批流程】', data.auditDesc || '')
					.replace('【金融机构】', data.bankAbbreviation || '')
					.replace('【金融机构-签章员】', data.bankAbbreviation + '-' + data.bankSignerNames)
					.replace('【操作方名称】', data.operator || '')
					.replace('【买方企业】', data.buyerAbbreviation || '')
					.replace('【买方企业-签章员】', data.buyerAbbreviation + '-' + data.buyerSignerNames)
					.replace('【作废原因】', data.cancelReason || '');
			}

			this.tipShowText = text;
		}
	}
};
</script>
<style lang="less">
.financing_inner {
	font-size: 12px;
	.tip {
		color: rgba(255, 255, 255, 0.5);
	}
}
</style>
<style lang="less" scoped>
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
	background: #c9daff;
	color: #596fa0;
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
	vertical-align: middle;
	cursor: pointer;
}
.LOANED {
	background: #c5ecdd;
	color: #3eb384;
}
.INVALID {
	background: #e0e0e0;
	color: #a8a8a8;
}
.BANK_TO_BE_SIGNED,
.TO_BE_SIGNED,
.TRADER_TO_BE_SIGNED,
.CORE_COMPANY_TO_BE_SIGNED {
	background: #ffdac8;
	color: #ff7937;
}
.OA_REJECT,
.CORE_COMPANY_REJECT,
.BANK_REJECT {
	background: #f2d0d0;
	color: #dd4444;
}
</style>
