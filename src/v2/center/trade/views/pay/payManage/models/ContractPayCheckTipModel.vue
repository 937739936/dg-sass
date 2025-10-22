<template>
	<a-modal
		:visible="visible"
		@cancel="close"
		width="60%"
		class="slModal"
	>
		<template slot="title">
			<div class="title">
				<div class="name">{{ title }}</div>
			</div>
		</template>
		<a-spin :spinning="spinning">
			<div
				class="content"
				v-if="tipInfo.result === true"
			>
				<div class="empty">
					<img src="@/v2/assets/imgs/person/msg-no.png" />
					<span class="empty_tip">没有提示</span>
				</div>
			</div>
			<div
				v-else
				class="content"
			>
				<div class="tip-view">
					<div v-html="highlightTipText"></div>
				</div>
				<a-tabs :animated="false">
					<a-tab-pane
						v-if="tipInfo.existContractUnFinish === true"
						key="1"
						tab="未完结合同"
					>
						<UnFinishContractTable :payContractInfo="payContractInfoNotEmpty" />
					</a-tab-pane>
					<a-tab-pane
						v-if="tipInfo.existServiceFeeUnPay === true"
						key="2"
						tab="未结清服务费结算单"
					>
						<UnPayServiceFeeTable :payContractInfo="payContractInfoNotEmpty" />
					</a-tab-pane>
					<template slot="tabBarExtraContent">
						<ExportButton
							:exporting="exporting"
							@exportClick="exportData"
						></ExportButton>
					</template>
				</a-tabs>
			</div>
		</a-spin>
		<template slot="footer">
			<a-space :size="20">
				<div
					class="footer-btn cancel-btn"
					@click="close"
				>
					返回
				</div>
				<div
					v-if="tipInfo.canPayment === true"
					class="footer-btn confirm-btn"
					@click="confirmBtnClick"
				>
					继续付款
				</div>
			</a-space>
		</template>
	</a-modal>
</template>

<script>
/*
// 提示信息对象字段
tipInfo: {
  result: false,// 校验结果是否弹窗
  placeholder: '提示信息',// 提示信息
  highlightPlaceHolder: '提示',// 高亮提示信息
  existContractUnFinish: true,// 是否存在超期未完结合同	
  existServiceFeeUnPay: true,// 是否存在未结清服务费结算单	
  canPayment: true,// 是否可以进行支付	
}
*/
import ExportButton from '@/v2/components/common/ExportButton';
import UnFinishContractTable from './components/UnFinishContractTable';
import UnPayServiceFeeTable from './components/UnPayServiceFeeTable';
import { API_CheckResultExport } from '@/v2/center/trade/api/pay';
import comDownload from '@sub/utils/comDownload.js';

export default {
	name: 'ContractPayCheckTipModel',
	components: {
		ExportButton,
		UnFinishContractTable,
		UnPayServiceFeeTable
	},
	data() {
		return {
			title: '提示',
			exporting: false,
			visible: false,
			spinning: false,
			tipInfo: {}, // 提示信息
			payContractInfo: {} // 支付信息
		};
	},
	computed: {
		highlightTipText() {
			if (!this.tipInfo.placeholder) {
				return '';
			}
			let highlightText = this.tipInfo.placeholder.replace(
				new RegExp(this.tipInfo.highlightPlaceHolder, 'gi'),
				'<span style="color: #ff800f;">$&</span>'
			);
			return highlightText;
		},
		payContractInfoNotEmpty() {
			return this.payContractInfo || {};
		}
	},
	methods: {
		/**
		 * 显示弹窗
		 * @param {Object} tipInfo 提示信息对象
		 * @param {Object} payContractInfo 支付合同信息
		 */
		showModal(tipInfo, payContractInfo) {
			this.tipInfo = tipInfo || {};
			// let { serialNo, contractType, id, actionType } = payContractInfo;
			this.payContractInfo = payContractInfo;
			this.visible = true;
		},
		close() {
			this.tipInfo = {};
			this.payContractInfo = {};
			this.visible = false;
		},
		selectedChange(checkedValue) {
			this.selectCoalTypes = checkedValue;
		},
		exportData() {
			this.exporting = true;
			API_CheckResultExport({
				serialNo: this.payContractInfoNotEmpty.serialNo,
				contractType: this.payContractInfoNotEmpty.contractType,
				existContractUnFinish: this.tipInfo.existContractUnFinish,
				existServiceFeeUnPay: this.tipInfo.existServiceFeeUnPay
			})
				.then(res => {
					comDownload(res.data, undefined, res.name);
				})
				.finally(() => {
					this.exporting = false;
				});
		},
		confirmBtnClick() {
			this.$emit('nextStepClick', this.payContractInfoNotEmpty);
		}
	}
};
</script>

<style lang="less" scoped>
.slModal {
	.title {
		display: flex;
		align-items: center;
		height: 100%;
		.name {
			font-size: 18px;
			color: rgba(#000, 0.8);
			font-weight: 500;
		}
	}
	.footer-btn {
		height: 32px;
		width: 90px;
		line-height: 32px;
		border-radius: 4px;
		padding: 0 !important;
		cursor: pointer;
		text-align: center;
	}
	.cancel-btn {
		border: 1px solid #e5e6eb;
		border-color: #c3c3c3;
	}
	.cancel-btn:hover {
		color: @primary-color;
		border-color:  @primary-color;
	}
	.confirm-btn {
		background: @primary-color;
		color: white;
	}

	.content {
		.tip-view {
			padding: 10px 12px;
			margin-bottom: 8px;
			border-radius: 4px;
			background: #e1eafe;
			border: 1px solid #d0dfff;
			font-size: 12px;
			font-weight: 500;
			color: #000000cc;
			font-family: PingFang SC;
		}
		.highlight {
			color: #ff800f;
		}
	}
	.empty {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
		align-items: center;
		justify-content: center;
		img {
			width: 66px;
			height: 66px;
		}
		.empty_tip {
			margin-top: 20px;
			color: rgba(0, 0, 0, 0.25);
			font-size: 14px;
		}
	}
}
</style>