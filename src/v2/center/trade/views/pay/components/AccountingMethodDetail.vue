<template>
	<div class="accounting-method-detail">
		<div class="accounting-wrapper">
			<div class="com-title">
				<span class="line" />
				<span class="text">合同定价办法</span>
			</div>
			<div
				class="accounting-content"
				v-html="detail.contractPriceMethod"
			/>
		</div>
		<div class="method-wrapper">
			<div class="com-title">
				<span class="text">质量调整价的核算办法</span>
				<div class="power-plant">
					<label>电厂名称：</label>
					<a-input
						v-model="detail.powerName"
						:disabled="true"
					/>
				</div>
			</div>
			<div class="evaluation-index">
				<span>考核指标勾选：</span>
				<div class="check-item">
					<a-checkbox
						v-for="(item, index) in checkItemList"
						:key="index"
						:checked="item.isChecked"
						:disabled="true"
					>
						{{ item.text }}
					</a-checkbox>
				</div>
			</div>
		</div>
		<check-form
			:selected="selected"
			:editable="false"
			ref="checkFrom"
		/>
		<div v-if="selectedOther && selectedOther.length > 0">
			<div class="method-wrapper">
				<div class="evaluation-index">
					<span>其他因素额外增扣：</span>
					<div class="check-item">
						<a-checkbox
							v-for="(item, index) in checkItemOtherList"
							:key="index"
							:checked="item.isChecked"
							:disabled="true"
						>
							{{ item.text }}
						</a-checkbox>
					</div>
				</div>
			</div>
			<other-factors
				:selected="selectedOther"
				:editable="false"
				ref="otherFrom"
			/>
		</div>
	</div>
</template>
<script>
import CheckForm from '@/v2/center/trade/components/orderForm/CheckForm';
import OtherFactors from '@/v2/center/trade/components/orderForm/OtherFactors';

export default {
	name: 'AccountingMethodDetail',
	data() {
		return {
			checkItemList: [
				{ text: '热值', type: 1 },
				{ text: '硫分', type: 2 },
				{ text: '水分', type: 3 },
				{ text: '挥发分', type: 4 },
				{ text: '灰分', type: 5 },
				{ text: '灰熔点', type: 6 }
			],
			checkItemOtherList: [
				{ text: '热值', type: 7 },
				{ text: '硫分', type: 8 },
				{ text: '水分', type: 9 },
				{ text: '挥发分', type: 10 },
				{ text: '灰分', type: 11 },
				{ text: '灰熔点', type: 12 }
			]
		};
	},
	components: {
		CheckForm,
		OtherFactors
	},
	props: {
		detail: {
			type: Object,
			default: () => {
				return {};
			}
		},
		selected: {
			type: Array,
			default: () => {
				return [];
			}
		},
		selectedOther: {
			type: Array,
			default: () => {
				return [];
			}
		}
	},
	mounted() {
		let checkedList = this.selected.map(item => {
			return item.type;
		});
		this.checkItemList.forEach(item => {
			this.$set(item, 'isChecked', checkedList.indexOf(item.type) > -1);
		});

		let checkedOtherList = this.selectedOther.map(item => {
			return item.type;
		});
		this.checkItemOtherList.forEach(item => {
			this.$set(item, 'isChecked', checkedOtherList.indexOf(item.type) > -1);
		});
	}
};
</script>
<style lang="less" scoped>
.accounting-method-detail {
	width: 98%;
	.accounting-wrapper {
		margin-bottom: 20px;
		.com-title {
			margin-bottom: 10px;
			font-size: 16px;
			font-weight: bold;
			.line {
				display: inline-block;
				width: 4px;
				height: 20px;
				background-color: #0053db;
			}
			.text {
				display: inline-block;
				line-height: 20px;
				vertical-align: top;
				margin-left: 10px;
			}
		}
		.accounting-content {
			cursor: not-allowed;
			padding: 10px;
			width: 100%;
			min-height: 50px;
			max-height: 150px;
			overflow: auto;
			border: 1px solid #e8e8e8;
		}
	}
	.method-wrapper {
		margin-bottom: 20px;
		.com-title {
			.text {
				font-size: 16px;
				font-weight: bold;
			}
			.power-plant {
				display: inline-block;
				width: 400px;
				margin-left: 50px;
				input {
					width: 300px;
				}
			}
		}
		.evaluation-index {
			margin-top: 20px;
			.check-item {
				display: inline-block;
			}
		}
	}
	::v-deep.ant-table,
	::v-deep.method-wrapper {
		.ant-table-thead th {
			font-weight: normal !important;
		}
		.ant-input[disabled],
		.ant-input-number-disabled,
		.ant-select-disabled,
		.ant-select-selection {
			background-color: white;
		}
		.has-error .ant-form-explain,
		.has-error .ant-form-split {
			display: none;
		}
		.has-error .ant-input,
		.has-error .ant-input:hover {
			border-color: inherit !important;
		}
		.ant-input {
			padding: 4px !important;
		}
	}
}
</style>
