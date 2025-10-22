<template>
	<a-modal
		title="批量关联"
		:visible="visible"
		@ok="handleOk"
		@cancel="handleCancel"
		width="1200px"
		:maskClosable="false"
		destroyOnClose
		class="new-modal"
	>
		<p>
			<a-form
				:form="form"
				:label-col="{ span: 2 }"
				:wrapper-col="{ span: 6 }"
				labelAlign="left"
			>
				<a-form-item label="合同编号">
					<a-input
						v-decorator="[
							'contractNo',
							{
								rules: [{ required: true, message: '请输入合同编号!' }]
							}
						]"
					/>
				</a-form-item>
				<div>
					<a-table
						:columns="columns"
						:data-source="invoiceList"
						:pagination="false"
						rowKey="id"
						:scroll="{ x: true, y: 300 }"
						class="new-table"
					>
						<a
							slot="action"
							slot-scope="text, record"
							@click="deleteItem(record)"
							v-if="invoiceList.length > 1"
							>删除</a
						>
						<span
							slot="splitAmount"
							slot-scope="text, record"
						>
							<a-form-item :wrapper-col="{ span: 24 }">
								<a-input-number
									style="width: 100%"
									:min="0"
									v-decorator="[
										'splitAmount_' + record.id,
										{
											rules: [
												{ required: true, message: '关联至该合同数量必填!' },
												{ validator: (rule, value, cb) => (value <= 0 ? cb('数量必须大于0!') : cb()) }
											]
										}
									]"
								/>
							</a-form-item>
						</span>
						<span
							slot="splitQuantity"
							slot-scope="text, record"
						>
							<a-form-item :wrapper-col="{ span: 24 }">
								<a-input-number
									style="width: 100%"
									:min="0"
									:precision="2"
									:step="0.01"
									v-decorator="[
										'splitQuantity_' + record.id,
										{
											rules: [
												{ required: true, message: '关联至该合同金额必填!' },
												{ validator: (rule, value, cb) => (value <= 0 ? cb('金额必须大于0!') : cb()) }
											]
										}
									]"
								/>
							</a-form-item>
						</span>
					</a-table>
				</div>
			</a-form>
		</p>
	</a-modal>
</template>

<script>
const columnsList = [
	{
		title: '序号',
		dataIndex: 'id',
		key: 'id',
		width: 70
	},
	{
		title: '发票代码',
		dataIndex: 'code',
		key: 'code',
		width: 100
	},
	{
		title: '发票号码',
		dataIndex: 'no',
		key: 'no',
		width: 100
	},
	{
		title: '销售方',
		dataIndex: 'sellerName',
		key: 'sellerName'
	},
	{
		title: '数量',
		dataIndex: 'quantity',
		key: 'quantity'
	},
	{
		title: '价税合计（元）',
		dataIndex: 'stampTaxFlagTotalAmount',
		key: 'stampTaxFlagTotalAmount',
		width: 150
	},
	{
		title: '关联至该合同数量',
		dataIndex: 'splitQuantity',
		key: 'splitQuantity',
		scopedSlots: { customRender: 'splitQuantity' },
		width: 180
	},
	{
		title: '关联至该合同金额（价税合计，元）',
		dataIndex: 'splitAmount',
		key: 'splitAmount',
		scopedSlots: { customRender: 'splitAmount' },
		width: 270
	},
	{
		title: '操作',
		dataIndex: 'action',
		scopedSlots: { customRender: 'action' }
	}
];
import { cloneDeep } from 'lodash';
import { formateNumber } from '@/v2/utils/index';

export default {
	data() {
		return {
			visible: false,
			confirmLoading: false,
			form: this.$form.createForm(this, { name: 'invoiceList' }),
			invoiceList: [],
			listComplete: []
		};
	},
	props: {
		columns: {
			type: Array,
			default: () => columnsList
		}
	},
	methods: {
		handleConfirm() {},
		computedList(index, item) {
			if (this.listComplete[index]) {
				return this.listComplete[index].list.reduce((pre, cur) => {
					return pre + cur[item];
				}, 0);
			}
		},
		showModal(list) {
			this.visible = true;
			list.forEach(item => {
				item.myInvoiceDO.quantity = formateNumber(this.computedAmount(item.list, 'quantity'), 4);
				item.myInvoiceDO.quantityNormal = this.computedAmount(item.list, 'quantity');
			});
			this.listComplete = list;
			this.invoiceList = cloneDeep(list).map(item => item.myInvoiceDO);
			this.invoiceList.forEach((item, index) => {
				item.id = ++index;
			});
			this.visible = true;
			this.setInitValue();
		},
		setInitValue() {
			this.$nextTick(() => {
				this.invoiceList.forEach((item, index) => {
					this.form.setFieldsValue({
						[`splitAmount_${item.id}`]: (
							item.stampTaxFlagTotalAmount - this.computedAmount(this.listComplete[index].invoiceContractSplitList, 'splitAmount')
						).toFixed(3),
						[`splitQuantity_${item.id}`]: (
							item.quantityNormal - this.computedAmount(this.listComplete[index].invoiceContractSplitList, 'splitQuantity')
						).toFixed(2)
					});
				});
			});
		},
		computedAmount(list, item) {
			return list.reduce((pre, cur) => {
				return pre + (cur[item] || 0);
			}, 0);
		},
		handleOk() {
			this.form.validateFields((err, values) => {
				if (!err) {
					this.invoiceList.forEach(item => {
						const key = item.id;
						item.contractNo = values.contractNo;
						item.splitAmount = values[`splitAmount_${key}`];
						item.splitQuantity = values[`splitQuantity_${key}`];
					});
					this.$emit('select', this.invoiceList);
					this.visible = false;
				}
			});
		},
		handleCancel() {
			this.visible = false;
		},
		deleteItem(item) {
			for (let i = 0; i < this.invoiceList.length; i++) {
				if (this.invoiceList[i].id == item.id) {
					this.invoiceList.splice(i, 1);
				}
			}
		}
	}
};
</script>

<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less" scoped>
.new-table {
	::v-deep.ant-table-scroll {
		.ant-table-header {
			overflow: auto !important;
			border-left: 1px solid #e5e6eb;
			border-right: 1px solid #e5e6eb;
			border-radius: 4px 4px 0 0;
		}
	}
}
</style>
