<template>
	<div>
		<a-table
			bordered
			class="contract-table-wrap"
			:columns="relationPayment"
			:pagination="false"
			:scroll="{ x: 1200, y: 240 }"
			:data-source="dataPayment"
			rowKey="claimRecordId"
			:row-selection="rowSelection"
		>
			<span
				slot="fundType"
				slot-scope="text, record"
			>
				<span v-if="text == '合计'">合计</span>
				<span v-else>{{ getFundTypeText(record.fundType || record.collectionType) }}</span>
			</span>
			<span
				slot="currentUseAmount"
				slot-scope="text, record"
			>
				<span v-if="record.claimRecordId == '合计'">{{ collectionTotal.currentUseAmountTotal }}</span>
				<a-input-number
					v-else
					v-model="record.currentUseAmount"
					:max="record.availableCollectionAmount"
					:min="0"
					size="small"
					:disabled="!selectedRowKeys.includes(record.claimRecordId) || (disabledAll && !['relation'].includes(typeModel))"
				/>
			</span>
			<span
				slot="availableCollectionAmount"
				slot-scope="text, record"
			>
				<span v-if="record.claimRecordId == '合计'">{{ collectionTotal.availableCollectionAmountTotal }}</span>
				<span v-else>{{ record.ifRefund ? '0(已退款)' : text }}</span>
			</span>
			<span
				slot="collectionAmount"
				slot-scope="text, record"
			>
				<span v-if="record.claimRecordId == '合计'">{{ collectionTotal.collectionAmountTotal }}</span>
				<span v-else>{{ text }}</span>
			</span>
		</a-table>
		<a-alert
			style="margin: 20px 0"
			:message="computedTotal"
			type="info"
		/>
	</div>
</template>

<script>
import { relationPayment } from '../../../config/orderStep2';
import { filterCodeBySteelKey } from '@sub/utils/globalCode.js';
export default {
	props: {
		dataPayment: {
			default: () => []
		},
		data: {
			default: () => []
		},
		selectedKeys: {
			default: () => []
		}
	},
	data() {
		return {
			relationPayment,
			selectedRowKeys: [],
			fundType: filterCodeBySteelKey('fundType')
		};
	},
	computed: {
		rowSelection() {
			const { selectedRowKeys } = this;
			return {
				selectedRowKeys,
				onChange: this.onSelectChange,
				hideDefaultSelections: true,
				type: 'checkbox',
				selections: [],
				onSelection: this.onSelection,
				getCheckboxProps: record => ({
					props: {
						disabled: ['preview', 'input', 'oa'].includes(this.$route.query.type) || record.fundType == '合计' || record.ifRefund
					}
				})
			};
		},
		typeModel() {
			return this.$route.query.type;
		},
		disabledAll() {
			return ['preview', 'upload', 'input', 'relation', 'oa'].includes(this.$route.query.type);
		},
		// 回款信息计算
		collectionTotal() {
			const tempList = this.dataPayment.slice(0, this.dataPayment.length - 1);
			// 回款金额
			const collectionAmountTotal = tempList.reduce((pre, cur) => {
				return pre + (this.selectedRowKeys.includes(cur.claimRecordId) ? cur.collectionAmount || 0 : 0);
			}, 0);
			// 可使用回款金额
			const availableCollectionAmountTotal = tempList.reduce((pre, cur) => {
				return pre + (this.selectedRowKeys.includes(cur.claimRecordId) ? cur.availableCollectionAmount || 0 : 0);
			}, 0);
			// 本次使用回款金额
			const currentUseAmountTotal = tempList.reduce((pre, cur) => {
				return (
					pre +
					(this.selectedRowKeys.includes(cur.claimRecordId) ? (cur.currentUseAmount <= 0 ? 0 : cur.currentUseAmount) || 0 : 0)
				);
			}, 0);
			return {
				collectionAmountTotal: Math.round(collectionAmountTotal * 100) / 100,
				availableCollectionAmountTotal: Math.round(availableCollectionAmountTotal * 100) / 100,
				currentUseAmountTotal: Math.round(currentUseAmountTotal * 100) / 100
			};
		},
		computedTotal() {
			// 本次使用回款金额
			const collectionAmountTotal = this.dataPayment.reduce((pre, cur) => {
				return (
					pre +
					(this.selectedRowKeys.includes(cur.claimRecordId) ? (cur.currentUseAmount <= 0 ? 0 : cur.currentUseAmount) || 0 : 0)
				);
			}, 0);
			// 预提货物含税金额
			const taxAmountTotal = this.data.reduce((pre, cur) => {
				return pre + (cur.currentApplyQuantity || 0) * (cur.takeUnitPrice && cur.takeUnitPrice !== '/' ? cur.takeUnitPrice : 0);
			}, 0);
			return `本次使用回款金额 - 预提货物含税金额 = ${Math.round(collectionAmountTotal * 100) / 100} - ${Math.round(taxAmountTotal * 100) / 100} = ${
				Math.round((collectionAmountTotal - taxAmountTotal) * 100) / 100
			}`;
		}
	},
	watch: {
		selectedKeys: {
			handler(val) {
				this.selectedRowKeys = val;
			},
			deep: true,
			immediate: true
		}
	},
	methods: {
		onSelectChange(selectedRowKeys) {
			this.selectedRowKeys = selectedRowKeys;
		},
		// 根据保证金类型返回保证金类型文案
		getFundTypeText(value) {
			for (let i = 0; i < this.fundType.length; i++) {
				if (this.fundType[i].value == value) {
					return this.fundType[i].label;
				}
			}
		},
		// 获取勾选的回款列表
		getRelationCollectionList() {
			let result = [];
			this.dataPayment.forEach(item => {
				if (this.selectedRowKeys.includes(item.claimRecordId)) {
					result.push(item);
				}
			});
			return result;
		}
	},
	components: {}
};
</script>

<style scoped></style>
