<template>
	<a-modal
		class="slModal"
		:visible="visible"
		:width="388"
		:forceRender="true"
		:destroyOnClose="true"
		@cancel="visible = false"
		title="确认提交"
	>
		<div class="confirm-content">
			<span class="tip-title">请确认以下信息是否有误：</span>
			<div class="info-list">
				<div
					class="info-item"
					v-for="item in infoItems"
					:key="item.label"
				>
					<div class="item-label">{{ item.label }}：</div>
					<a-date-picker
						v-if="item.valueType === 'DateEdit'"
						placeholder="选择付款日期"
						v-model="receiveDate"
					>
						<div class="item-date-edit">
							<div>{{ item.value }}</div>
							<img
								class="triangle-icon"
								src="@/v2/assets/imgs/pay/down_triangle.png"
								alt=""
							/>
						</div>
					</a-date-picker>
					<div
						v-else-if="item.valueType === 'Money'"
						class="item-money"
					>
						{{ item.value }}
					</div>
					<div
						v-else
						class="item-value"
					>
						{{ item.value }}
					</div>
				</div>
			</div>
		</div>
		<template slot="footer">
			<a-button
				key="back"
				@click="visible = false"
				class="modal-cancel-btn"
				>取消</a-button
			>
			<a-button
				type="primary"
				@click="save"
				style="margin-left: 20px"
				>确定</a-button
			>
		</template>
	</a-modal>
</template>

<script>
import { formatMoney } from '@sub/filters';
import { convertCurrency } from '@sub/utils/globalCode.js';
import moment from 'moment';
import { API_ConllectConfirmOrReject } from '@/v2/center/trade/api/pay';

export default {
	name: 'ConfirmModal',
	props: {},
	data() {
		return {
			visible: false,
			detailInfo: {}, // 详情信息
			receiveDate: moment() // 收款日期
		};
	},
	computed: {
		detailInfoNotEmpty() {
			return this.detailInfo || {};
		},
		basicInfo() {
			return this.detailInfoNotEmpty.basicInfo || {};
		},
		contractVO() {
			return this.detailInfoNotEmpty.contractVO || {};
		},
		paymentAmountText() {
			if (this.basicInfo.payAmount == null) {
				return '-';
			}
			let value = this.basicInfo.payAmount || 0;
			let money = '-';
			let tip = '';
			if (value !== null && value !== undefined && value !== '') {
				money = formatMoney(value);
				tip = convertCurrency(value);
				if (money == '0' || money == 0) {
					money = '0';
					tip = '零元整';
				}
			}
			return `${money}元(${tip})`;
		},
		receiveDateString() {
			return this.receiveDate.format('YYYY-MM-DD');
		},
		infoItems() {
			return [
				{
					label: '打款方',
					value: this.contractVO.buyerName || ''
				},
				{
					label: '付款类型',
					value: this.basicInfo.paymentTypeDesc || ''
				},
				{
					label: '资金来源',
					value: this.basicInfo.payTypeName || ''
				},
				{
					label: '收款日期',
					value: this.receiveDateString,
					valueType: 'DateEdit'
				},
				{
					label: '收款金额',
					value: this.paymentAmountText,
					valueType: 'Money'
				}
			];
		}
	},
	methods: {
		showModal(detailInfo) {
			this.detailInfo = detailInfo || {};
			this.receiveDate = moment(this.basicInfo.planPayDate || '');
			this.visible = true;
		},
		close() {
			this.detailInfo = {};
			this.receiveDate = moment();
			this.visible = false;
		},
		save() {
			API_ConllectConfirmOrReject({
				paymentNo: this.detailInfoNotEmpty.paymentNo,
				confirmResult: true,
				receiveDate: this.receiveDateString
			})
				.then(res => {
					if (res.success) {
						this.$message.success('收款已确认');
						this.visible = false;
						this.$router.back();
						// this.$emit('refresh');
					} else {
						this.$message.error('确认操作失败');
					}
				})
				.catch(() => {
					this.$message.error('确认操作失败');
				});
		}
	}
};
</script>

<style scoped lang="less">
/deep/ .ant-modal-body {
	padding-top: 0px;
	padding: 0px 20px;
}
/deep/ .ant-modal-header {
	// background-color: #fff;
	padding: 16px 20px;
}
/deep/ .ant-modal-footer {
	border-top: 1px solid #e8e8e8;
	padding-top: 16px;
	padding-bottom: 16px;
}
.confirm-content {
	margin-top: 30px;
	margin-bottom: 30px;
	.tip-title {
		margin-top: 30px;
		font-size: 14px;
		color: #00000066;
	}
	.info-list {
		margin-top: 10px;
		border: 1px solid #e5e6eb;
		border-radius: 4px;
		.info-item {
			padding: 0 12px;
			min-height: 32px;
			display: flex;
			justify-content: start;
			align-items: center;
			font-size: 14px;
			color: #00000066;
			.item-label {
				min-width: 70px;
				text-align: right;
				color: #00000066;
			}
			.item-value {
				color: #000000cc;
			}
			.item-money {
				color: #dd4444;
			}
			.item-date-edit {
				color: #000000cc;
				display: flex;
				flex-direction: row;
				align-items: center;
				cursor: pointer;
				.triangle-icon {
					width: 14px;
					height: 14px;
					margin-left: 2px;
				}
			}
		}
		.info-item:nth-child(2n) {
			background-color: #f3f5f6;
		}
	}
}
.modal-cancel-btn {
	color: #000000cc;
	width: 88px;
	height: 32px;
}
</style>
