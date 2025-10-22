<template>
	<span>
		<span>{{ filterCodeByValueName(item.status, 'receivableStatusDict') || item.status }}</span>
		<a-tooltip
			placement="top"
			trigger="click"
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
				<span v-else>{{ tipShowText }}</span>
			</template>
			<a-icon
				type="question-circle"
				theme="filled"
				class="statusIcon"
			/>
		</a-tooltip>
	</span>
</template>

<script>
const tableTooltip = {
	TO_BE_VERIFY: '该资产已生成，待【资产编辑企业】编辑后提交',
	TO_BE_CONFIRM: '该资产待【资产编辑企业-签章员】进行盖章',
	PLATFORM_AUDIT: '该资产已被【资产编辑企业】提交，正处于平台风控审核流程',
	PLATFORM_REJECT: '该资产已被平台风控驳回，待【资产编辑企业】编辑后提交',
	OA_AUDIT: '该资产正处于【审批流程】流程',
	OA_REJECT: '该资产【审批流程】流程未通过',
	BANK_PUSH_FAIL: '该资产推送资方系统失败，待平台风控进行处理',
	BANK_AUDIT: '该资产待【金融机构】进行审核',
	TODO: '该资产可发起融资申请',
	DOING: '该资产正处于融资提款流程中',
	BANK_REJECT: '该资产被【金融机构】审核驳回，待平台风控进行批注',
	COMMENTED: '该资产平台风控已批注，待【资产编辑企业】编辑后提交',
	FUNDED: '该资产已完成融资',
	CANCEL: '该资产已被【操作方】作废，作废原因：【作废原因】',
	INVALID: '该资产已超过资产到期日',
	IN_POOL: '该资产入池申请已通过',
	OUT_POOL: '该资产已出应收账款保理池',
	BANK_TO_BE_VERIFY: '该资产已推送到资方系统，请【资产编辑企业】登录【金融机构】系统进行后续操作',
	COUNTERFOIL_DOING: '该资产正在开立云票中',
	COUNTERFOIL_DONE: '该资产已成功开立云票',
	COUNTERFOIL_TODO: '该资产待【资产编辑企业】进行开立云票',
	TO_BE_SIGN: '该资产待【资产上游卖方企业-签章员】进行盖章'
};
import { filterCodeByValueName, filterCodeByKey } from '@sub/utils/globalCode.js';

import { API_GetAssetsStatusTip } from '@/v2/center/assets/api/index.js';
export default {
	name: 'AssetsTipInfo',
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
				API_GetAssetsStatusTip({
					assetNo: items.serialNo
				}).then(res => {
					this.tipShowTextMethods(items, res.data);
				});
			}
		},
		tipShowTextMethods(row, data) {
			let text = '';
			text = tableTooltip[row.status] || '';
			if (!text) {
				this.tipShowText = text || row.statusText;
				return;
			}
			text = text
				.replace('【资产编辑企业】', data.initAbbreviation || '')
				.replace('【资产编辑企业-签章员】', data.initAbbreviation + '-' + data.signerNames)
				.replace('【资产上游卖方企业-签章员】', data.initAbbreviation + '-' + data.signerNames)
				.replace('【审批流程】', data.auditDesc || '')
				.replace('【金融机构】', data.bankAbbreviation || '')
				.replace('【操作方】', data.operator || '')
				.replace('【作废原因】', data.cancelReason || '');
			this.tipShowText = text;
		}
	}
};
</script>
<style lang="less" scoped>
.statusIcon:hover {
	cursor: pointer;
}
</style>
