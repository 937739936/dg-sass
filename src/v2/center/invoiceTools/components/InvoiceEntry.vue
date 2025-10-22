<template>
	<div>
		<a-modal
			:title="title"
			:visible="visible"
			@ok="handleOk"
			@cancel="handleCancel"
			width="1200px"
			destroyOnClose
			:maskClosable="false"
			class="new-modal"
		>
			<div class="wrap">
				<div>
					<p class="title">入账信息</p>
					<a-form
						:form="form"
						:label-col="{ span: 6 }"
						:wrapper-col="{ span: 16 }"
						labelAlign="left"
					>
						<a-row>
							<a-col :span="12">
								<a-form-item label="凭证号">
									<a-input
										v-decorator="[
											'no',
											{
												rules: [{ required: true, message: '凭证号必填!' }]
											}
										]"
									/>
								</a-form-item>
							</a-col>
							<a-col :span="12">
								<a-form-item label="入账月份">
									<a-month-picker
										style="width: 100%"
										:format="monthFormat"
										v-decorator="[
											'recordDate',
											{
												rules: [{ required: true, message: '入账月份必填!' }]
											}
										]"
									/>
								</a-form-item>
							</a-col>
							<a-col :span="12">
								<a-form-item label="结算情况">
									<a-radio-group
										name="radioGroup"
										v-decorator="[
											'statementType',
											{
												rules: [{ required: true, message: '结算情况必填!' }]
											}
										]"
										:options="plainOptions"
									>
									</a-radio-group>
								</a-form-item>
							</a-col>
							<a-col :span="12">
								<a-form-item label="备注">
									<a-textarea
										v-decorator="[
											'remark',
											{
												rules: [{ required: false, message: '备注必填!' }]
											}
										]"
									/>
								</a-form-item>
							</a-col>
						</a-row>
					</a-form>
				</div>
				<div class="invoice-desc">
					<p class="title">发票信息</p>
					<p>登记日期：{{ registerDate }}</p>
				</div>
				<div>
					<a-table
						:columns="columns"
						:data-source="dataInvoiceList"
						:pagination="false"
						rowKey="key"
						:rowClassName="fixedTop"
						:scroll="{ x: true, y: 290 }"
						class="new-table"
					>
					</a-table>
				</div>
			</div>
		</a-modal>
	</div>
</template>

<script>
import moment from 'moment';
import { columnsEntryInvoiceEditList } from '../views/in/table';
import { API_GET_INVOICE_ENTRY_SUBMIT, API_INVOICE_ENTRY_ONCE, API_GET_INVOICE_ENTRY_DETAIL } from '@/v2/center/invoiceTools/api';
import { formateNumber } from '@/v2/utils/index';

export default {
	data() {
		return {
			visible: false,
			form: this.$form.createForm(this, { name: 'invoiceEntry' }),
			monthFormat: 'YYYY年MM月',
			plainOptions: ['预开票', '尾票', '全票'],
			dataInvoiceList: [],
			title: '',
			plainOptionsEumn: {
				预开票: 'PRE',
				尾票: 'TAIL',
				全票: 'FULL'
			},
			invoiceList: [],
			registerDate: null
		};
	},
	props: {
		columns: {
			type: Array,
			default: () => columnsEntryInvoiceEditList
		},
		invoiceType: {
			type: [Number, String],
			default: 1
		}
	},
	methods: {
		moment,
		formateNumber,
		fixedTop(record) {
			if (record.key == '合计') {
				return 'fixedTr';
			}
		},
		showModal(invoice, type, invoiceType) {
			if (type === 'add') {
				this.title = '进项发票入账';
			} else {
				this.title = '入账信息编辑';
			}
			this.invoiceList = Array.isArray(invoice) ? invoice : [invoice];
			if (this.invoiceList.length > 1) {
				const tempArr = this.invoiceList.sort((pre, cur) => {
					return pre.invoiceCreateDate - cur.invoiceCreateDate;
				});
				this.registerDate = tempArr[tempArr.length - 1].invoiceCreateDate + '~' + tempArr[0].invoiceCreateDate;
			} else {
				this.registerDate = this.invoiceList[0].invoiceCreateDate;
			}
			this.visible = true;
			const API = this.invoiceList[0].id ? API_GET_INVOICE_ENTRY_DETAIL : API_INVOICE_ENTRY_ONCE;
			const params = this.invoiceList[0].id
				? { id: this.invoiceList[0].id }
				: { invoiceType: this.invoiceType, list: this.invoiceList };
			API(params).then(res => {
				if (res.success) {
					this.dataInvoiceList = res.data.invoiceList;
					this.dataInvoiceList.forEach((item, index) => {
						item.key = ++index;
					});
					this.dataInvoiceList.push({
						key: '合计',
						totalQuantity: this.formateNumber(this.computedList('totalQuantity'), 4),
						taxExcludedAmount: this.formateNumber(this.computedList('taxExcludedAmount'), 2),
						taxAmount: this.formateNumber(this.computedList('taxAmount'), 2),
						totalAmount: this.formateNumber(this.computedList('totalAmount'), 2),
						stampTaxFlagTotalAmount: this.formateNumber(this.computedList('stampTaxFlagTotalAmount'), 2)
					});
					if (this.invoiceList[0].id) {
						const { no, recordDate, statementType, remark } = res.data;
						this.form.setFieldsValue({
							no,
							recordDate,
							statementType: this.setStatementTypeDesc(statementType),
							remark
						});
					} else {
						this.form.setFieldsValue({
							recordDate: moment(),
							statementType: '预开票'
						});
					}
				}
			});
		},
		setStatementTypeDesc(value) {
			for (const key in this.plainOptionsEumn) {
				if (this.plainOptionsEumn[key] == value) {
					return key;
				}
			}
		},
		computedList(item) {
			return this.dataInvoiceList.reduce((pre, cur) => {
				return pre + cur[item];
			}, 0);
		},
		handleOk() {
			this.form.validateFields((err, values) => {
				if (!err) {
					API_GET_INVOICE_ENTRY_SUBMIT({
						id: this.invoiceList[0].id,
						list: this.invoiceList,
						invoiceType: this.invoiceType,
						...values,
						recordDate: moment(values.recordDate).format('YYYY-MM-DD'),
						statementType: this.plainOptionsEumn[values.statementType]
					}).then(res => {
						if (res.success) {
							this.$message.success('入账成功');
							this.visible = false;
							this.$emit('entry', true);
						}
					});
				}
			});
		},
		handleCancel() {
			this.visible = false;
		}
	}
};
</script>

<style lang="less" scoped>
.wrap {
	.title {
		padding-left: 20px;
		font-weight: 500;
		color: #000000;
		position: relative;
		margin-bottom: 20px;
	}
	.title::before {
		content: '';
		width: 2px;
		height: 16px;
		background: #4682f3;
		display: inline-block;
		position: absolute;
		top: 4px;
		left: 0;
	}
	.invoice-desc {
		margin-bottom: 20px;
	}
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
}
</style>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
@import url('~@/v2/style/invoiceTools/common.less');
</style>
