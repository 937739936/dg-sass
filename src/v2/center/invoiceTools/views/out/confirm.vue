<template>
	<div class="wrap">
		<a-form
			:form="form"
			:label-col="{ span: 4 }"
			:wrapper-col="{ span: 12 }"
			labelAlign="left"
		>
			<div>
				<p class="title">发票信息</p>
				<a-row>
					<a-col span="8">
						<a-form-item label="开票日期">
							<a-date-picker
								style="width: 100%"
								:format="monthFormat"
								v-decorator="[
									'issuedDate',
									{
										rules: [{ required: true, message: '开票日期必填!' }]
									}
								]"
							/>
						</a-form-item>
					</a-col>
					<a-col span="8">
						<a-form-item label="编号">
							<a-input
								v-decorator="[
									'no',
									{
										rules: [{ required: false, message: '编号必填!' }]
									}
								]"
								:maxLength="60"
							/>
						</a-form-item>
					</a-col>
					<a-col span="8">
						<a-form-item label="开票主体">
							<a-input
								v-decorator="[
									'mainPartName',
									{
										rules: [{ required: true, message: '开票主体必填!' }]
									}
								]"
								:maxLength="60"
							/>
						</a-form-item>
					</a-col>
					<a-col span="8">
						<a-form-item label="购买方">
							<a-input
								@input="changeBuyerName"
								@change="changeBuyerName"
								v-decorator="[
									'buyerName',
									{
										rules: [{ required: true, message: '购买方必填!' }]
									}
								]"
								:maxLength="60"
							/>
						</a-form-item>
					</a-col>
				</a-row>
				<p class="count">
					<span>数量合计：{{ formateNumber(qualityGoods, 4) }} {{ unit }}</span>
					<span class="margin-left-20px">价税合计：{{ formateNumber(amountGoods, 2) }} 元</span>
				</p>
				<div class="new-table">
					<a-table
						:columns="columnsInvoice"
						:data-source="invoiceData.commissionItemList"
						:pagination="false"
						rowKey="id"
						:scroll="{ x: 1200, y: 300 }"
						id="goods-table"
					>
						<span
							slot="name"
							slot-scope="text, scoped"
						>
							<a-form-item>
								<a-input
									v-decorator="[
										'name_' + scoped.id,
										{
											rules: [
												{
													required: true,
													message: '货物或应税劳务服务名称必填!'
												}
											]
										}
									]"
									:maxLength="60"
								/>
							</a-form-item>
						</span>
						<span
							slot="spec"
							slot-scope="text, scoped"
						>
							<a-form-item>
								<a-input
									style="width: 100%"
									v-decorator="[
										'spec_' + scoped.id,
										{
											rules: [
												{
													required: false,
													message: '规格型号必填!'
												}
											]
										}
									]"
									:maxLength="60"
								/>
							</a-form-item>
						</span>
						<span
							slot="unit"
							slot-scope="text, scoped"
						>
							<a-form-item>
								<a-input
									:disabled="!enabledUnit(scoped)"
									@input="getInputUnit"
									v-decorator="[
										'unit_' + scoped.id,
										{
											rules: [
												{
													required: false,
													message: '计量单位必填!'
												}
											]
										}
									]"
									:maxLength="10"
								/>
							</a-form-item>
						</span>
						<span
							slot="quantity"
							slot-scope="text, scoped"
						>
							<a-form-item>
								<a-input-number
									:precision="4"
									:step="0.0001"
									@change="amountAndQuality"
									v-decorator="[
										'quantity_' + scoped.id,
										{
											rules: [
												{
													required: true,
													message: '数量必填!'
												},
												{
													validator: (rule, value, cb) => (value <= 0 ? cb('数量必须大于0!') : cb())
												}
											]
										}
									]"
								/>
							</a-form-item>
						</span>
						<span
							slot="unitPrice"
							slot-scope="text, scoped"
						>
							<a-form-item>
								<a-input-number
									:precision="4"
									:step="0.0001"
									v-decorator="[
										'unitPrice_' + scoped.id,
										{
											rules: [
												{
													required: true,
													message: '单价必填!'
												},
												{
													validator: (rule, value, cb) => (value <= 0 ? cb('单价必须大于0!') : cb())
												}
											]
										}
									]"
								/>
							</a-form-item>
						</span>
						<span
							slot="amount"
							slot-scope="text, scoped"
						>
							<a-form-item>
								<a-input-number
									:precision="2"
									:step="0.01"
									v-decorator="[
										'amount_' + scoped.id,
										{
											rules: [
												{
													required: true,
													message: '金额必填!'
												},
												{
													validator: (rule, value, cb) => (value <= 0 ? cb('金额必须大于0!') : cb())
												}
											]
										}
									]"
								/>
							</a-form-item>
						</span>
						<span
							slot="taxRate"
							slot-scope="text, scoped"
						>
							<a-form-item>
								<a-input-number
									:precision="2"
									:step="0.01"
									v-decorator="[
										'taxRate_' + scoped.id,
										{
											rules: [
												{
													required: true,
													message: '税率必填!'
												},
												{
													validator: (rule, value, cb) => (value <= 0 ? cb('税率必须大于0!') : cb())
												}
											]
										}
									]"
								/>
							</a-form-item>
						</span>
						<span
							slot="tax"
							slot-scope="text, scoped"
						>
							<a-form-item>
								<a-input-number
									:precision="2"
									:step="0.01"
									v-decorator="[
										'tax_' + scoped.id,
										{
											rules: [
												{
													required: true,
													message: '税额必填!'
												},
												{
													validator: (rule, value, cb) => (value <= 0 ? cb('税额必须大于0!') : cb())
												}
											]
										}
									]"
								/>
							</a-form-item>
						</span>
						<span
							slot="totalAmount"
							slot-scope="text, scoped"
						>
							<a-form-item>
								<a-input-number
									:precision="2"
									:step="0.01"
									@change="amountAndQuality"
									v-decorator="[
										'totalAmount_' + scoped.id,
										{
											rules: [
												{
													required: true,
													message: '价税合计必填!'
												},
												{
													validator: (rule, value, cb) => (value <= 0 ? cb('税价合计必须大于0!') : cb())
												}
											]
										}
									]"
								/>
							</a-form-item>
						</span>
						<span
							slot="action"
							slot-scope="text, scoped"
						>
							<a-button
								type="link"
								@click="deleteItem(scoped, 'commissionItemList')"
								>删除</a-button
							>
						</span>
					</a-table>
					<p class="add-btn-wrap">
						<a-button
							icon="plus"
							type="link"
							@click="addInvoice"
							style="color: #8b9db8"
							>新增行</a-button
						>
					</p>
				</div>
			</div>
			<div class="content-line">
				<p class="title">关联合同及业务线信息</p>
				<p class="count">
					<span>数量合计：{{ formateNumber(qualityLine, 4) }} {{ unit }}</span>
					<span class="margin-left-20px">价税合计：{{ formateNumber(amountLine, 2) }} 元</span>
				</p>
				<div class="new-table">
					<a-table
						:columns="columnsLine"
						:data-source="invoiceData.commissionBusinessLineSplitList"
						:pagination="false"
						rowKey="id"
						:scroll="{ x: 1200, y: 300 }"
						id="business-line-table"
					>
						<span
							slot="businessLineName"
							slot-scope="text, scoped"
						>
							<a-form-item>
								<a-input
									v-decorator="[
										'businessLineName_' + scoped.id,
										{
											rules: [
												{
													required: true,
													message: '业务线必填!'
												}
											]
										}
									]"
									:maxLength="100"
								/>
							</a-form-item>
						</span>
						<span
							slot="upContractNo"
							slot-scope="text, scoped"
						>
							<a-form-item>
								<a-input
									v-decorator="[
										'upContractNo_' + scoped.id,
										{
											rules: [
												{
													required: true,
													message: '上游采购合同编号必填!'
												},
												{ validator: (rule, value, callback) => validateContract(rule, value, callback, '上游采购') }
											],
											trigger: 'change'
										}
									]"
									:maxLength="60"
								/>
							</a-form-item>
						</span>
						<span
							slot="upCompanyName"
							slot-scope="text, scoped"
						>
							<a-form-item>
								<a-input
									v-decorator="[
										'upCompanyName_' + scoped.id,
										{
											rules: [
												{
													required: true,
													message: '上游供应商名称必填!'
												}
											]
										}
									]"
									:maxLength="60"
								/>
							</a-form-item>
						</span>
						<span
							slot="downContractNo"
							slot-scope="text, scoped"
						>
							<a-form-item>
								<a-input
									v-decorator="[
										'downContractNo_' + scoped.id,
										{
											rules: [
												{
													required: true,
													message: '下游销售合同编号必填!'
												},
												{ validator: (rule, value, callback) => validateContract(rule, value, callback, '下游销售') }
											],
											trigger: 'change'
										}
									]"
									:maxLength="60"
								/>
							</a-form-item>
						</span>
						<span
							slot="downCompanyName"
							slot-scope="text, scoped"
						>
							<a-form-item>
								<a-input
									disabled
									v-decorator="[
										'downCompanyName_' + scoped.id,
										{
											rules: [
												{
													required: true,
													message: '下游客户名称必填!'
												}
											]
										}
									]"
								/>
							</a-form-item>
						</span>
						<span
							slot="splitQuantity"
							slot-scope="text, scoped"
						>
							<a-form-item>
								<a-input-number
									:precision="4"
									:step="0.0001"
									@change="amountAndQuality"
									v-decorator="[
										'splitQuantity_' + scoped.id,
										{
											rules: [
												{
													required: true,
													message: '开票货物数量必填!'
												},
												{
													validator: (rule, value, cb) => (value <= 0 ? cb('开票货物数量必须大于0!') : cb())
												}
											]
										}
									]"
								/>
							</a-form-item>
						</span>
						<span
							slot="splitAmount"
							slot-scope="text, scoped"
						>
							<a-form-item>
								<a-input-number
									:precision="2"
									:step="0.01"
									@change="amountAndQuality"
									v-decorator="[
										'splitAmount_' + scoped.id,
										{
											rules: [
												{
													required: true,
													message: '开票金额必填!'
												},
												{
													validator: (rule, value, cb) => (value <= 0 ? cb('开票金额必须大于0!') : cb())
												}
											]
										}
									]"
								/>
							</a-form-item>
						</span>
						<span
							slot="action"
							slot-scope="text, scoped"
						>
							<a-button
								type="link"
								@click="deleteItem(scoped, 'commissionBusinessLineSplitList')"
								>删除</a-button
							>
						</span>
					</a-table>
					<p class="add-btn-wrap">
						<a-button
							icon="plus"
							type="link"
							@click="addLine"
							style="color: #8b9db8"
							>新增业务线</a-button
						>
					</p>
				</div>
			</div>
		</a-form>
		<div class="footer-wrap">
			<a-button
				class="width126px-height44px-button"
				type=""
				@click="cancel"
				>上一步</a-button
			>
			<a-button
				class="width126px-height44px-button"
				type="primary"
				style="margin-left: 20px"
				@click="next"
				>保存</a-button
			>
		</div>
	</div>
</template>

<script lang="jsx">
import moment from 'moment';
import { columnsInvoice, columnsLine } from './table';
import storage from "@sub/utils/storage";
import { API_INVOICE_OUT_SAVE } from '@/v2/center/invoiceTools/api';
import { cloneDeep } from 'lodash';
import { formateNumber } from '@/v2/utils/index';

export default {
	data() {
		return {
			form: this.$form.createForm(this, { name: 'coordinated' }),
			columnsInvoice,
			columnsLine,
			invoiceData: {},
			monthFormat: 'YYYY年MM月DD日',
			qualityGoods: 0,
			amountGoods: 0,
			qualityLine: 0,
			amountLine: 0,
			unit: ''
		};
	},
	computed: {},
	methods: {
		formateNumber,
		changeBuyerName(value) {
			this.$nextTick(() => {
				this.invoiceData.commissionBusinessLineSplitList.forEach(item => {
					this.form.setFieldsValue({
						[`downCompanyName_${item.id}`]: value?.target?._value
					});
				});
			});
		},
		enabledUnit(scoped) {
			const ids = this.invoiceData.commissionItemList.map(item => item.id).sort();
			return scoped.id == ids[0];
		},
		getInputUnit(value) {
			this.$nextTick(() => {
				this.unitComputed(value);
				this.changeUnit(value?.target?._value);
			});
		},
		unitComputed(value) {
			this.unit = value?.target?._value || '';
		},
		amountAndQuality() {
			this.$nextTick(() => {
				const formValues = this.form.getFieldsValue();
				let qualityGoods = 0;
				let amountGoods = 0;
				let amountLine = 0;
				let qualityLine = 0;
				for (const key in formValues) {
					if (key.indexOf('quantity') >= 0 && formValues[key]) {
						qualityGoods += Number(formValues[key]);
					}
					if (key.indexOf('totalAmount') >= 0 && formValues[key]) {
						amountGoods += Number(formValues[key]);
					}
					if (key.indexOf('splitQuantity') >= 0 && formValues[key]) {
						qualityLine += Number(formValues[key]);
					}
					if (key.indexOf('splitAmount') >= 0 && formValues[key]) {
						amountLine += Number(formValues[key]);
					}
				}
				this.qualityGoods = qualityGoods;
				this.amountGoods = amountGoods;
				this.qualityLine = qualityLine;
				this.amountLine = amountLine;
			});
		},
		getSameValueLength() {
			const tempArrUp = [];
			const tempArrDown = [];
			const resultArr = [];
			const formValues = this.form.getFieldsValue();
			for (const key in formValues) {
				if (key.indexOf('upContractNo_') >= 0) {
					tempArrUp.push(formValues[key]);
				}
				if (key.indexOf('downContractNo_') >= 0) {
					tempArrDown.push(formValues[key]);
				}
			}
			tempArrUp.forEach((item, index) => {
				resultArr.push(item + tempArrDown[index]);
			});
			return resultArr.length > Array.from(new Set(resultArr)).length;
		},
		validateContract(rule, value, callback, type) {
			if (this.getSameValueLength()) {
				callback(type + '合同编号重复!');
			} else {
				callback();
			}
		},
		deleteItem(item, list) {
			let key = -1;
			for (let i = 0; i < this.invoiceData[list].length; i++) {
				if (this.invoiceData[list][i].id == item.id) {
					key = i;
				}
			}
			if (key >= 0) {
				this.invoiceData[list].splice(key, 1);
			}
			if (list === 'commissionItemList' && this.invoiceData[list].length == 0) {
				this.addInvoice();
			}
			if (list === 'commissionBusinessLineSplitList' && this.invoiceData[list].length == 0) {
				this.addLine();
			}
			this.amountAndQuality();
		},
		computedDataList(list, item) {
			if (this.invoiceData[list]) {
				return this.invoiceData[list].reduce((pre, cur) => {
					return pre + cur[item];
				}, 0);
			} else {
				return 0;
			}
		},
		addLine() {
			let key = this.invoiceData.commissionBusinessLineSplitList.length;
			const addItem = {
				id: key,
				key: ++key,
				businessLineName: '',
				upContractNo: '',
				upCompanyName: '',
				downContractNo: '',
				downCompanyName: '',
				splitAmount: '',
				splitQuantity: ''
			};
			this.invoiceData.commissionBusinessLineSplitList.push(addItem);
			this.$nextTick(() => {
				const index = this.invoiceData.commissionBusinessLineSplitList?.length;
				if (index == 1) {
					this.form.setFieldsValue({
						['businessLineName_0']: '',
						['upContractNo_0']: '',
						['upCompanyName_0']: '',
						['downContractNo_0']: '',
						['splitAmount_0']: '',
						['splitQuantity_0']: ''
					});
					this.form.setFieldsValue({
						['downCompanyName_' + addItem.id]: this.form.getFieldValue('buyerName')
					});
				}
				this.form.setFieldsValue({
					['downCompanyName_' + addItem.id]: this.form.getFieldValue('buyerName')
				});
				const parentElem = document.querySelector('#business-line-table');
				const tableElem = parentElem.querySelector('.ant-table-body');
				tableElem.scrollTop = tableElem.scrollHeight;
			});
		},
		addInvoice() {
			let key = this.invoiceData.commissionItemList.length;
			this.invoiceData.commissionItemList.push({
				id: ++key,
				name: '',
				spec: '',
				unit: '',
				quantity: '',
				unitPrice: '',
				amount: '',
				taxRate: '',
				tax: '',
				totalAmount: ''
			});
			this.$nextTick(() => {
				const index = this.invoiceData.commissionItemList?.length;
				if (index == 1) {
					this.form.setFieldsValue({
						['name_0']: '',
						['spec_0']: '',
						['unit_0']: '',
						['quantity_0']: '',
						['unitPrice_0']: '',
						['amount_0']: '',
						['taxRate_0']: '',
						['tax_0']: '',
						['totalAmount_0']: ''
					});
					this.getInputUnit({});
				}
				this.changeUnit();
				const parentElem = document.querySelector('#goods-table');
				const tableElem = parentElem.querySelector('.ant-table-body');
				tableElem.scrollTop = tableElem.scrollHeight;
			});
		},
		changeUnit(value = '') {
			if (this.invoiceData.commissionItemList?.length > 1) {
				const unitOnce = value || this.form.getFieldValue('unit_1') || '';
				this.invoiceData.commissionItemList.forEach((item, index) => {
					this.form.setFieldsValue({
						[`unit_${++index}`]: unitOnce
					});
				});
			}
		},
		cancel() {
			this.$router.back();
		},
		next() {
			this.form.validateFieldsAndScroll((err, values) => {
				if (!err) {
					let cloneData = cloneDeep(this.invoiceData);
					cloneData.commissionBusinessLineSplitList.forEach(item => {
						item.name = values[`businessLineName_${item.id}`];
						item.upContractNo = values[`upContractNo_${item.id}`];
						item.upCompanyName = values[`upCompanyName_${item.id}`];
						item.downContractNo = values[`downContractNo_${item.id}`];
						item.downCompanyName = values[`downCompanyName_${item.id}`];
						item.splitAmount = values[`splitAmount_${item.id}`];
						item.splitQuantity = values[`splitQuantity_${item.id}`];
						delete item.downCompanyName;
					});
					cloneData.commissionItemList.forEach(item => {
						item.name = values[`name_${item.id}`];
						item.spec = values[`spec_${item.id}`];
						item.unit = values[`unit_${item.id}`];
						item.quantity = values[`quantity_${item.id}`];
						item.unitPrice = values[`unitPrice_${item.id}`];
						item.amount = values[`amount_${item.id}`];
						item.taxRate = values[`taxRate_${item.id}`] / 100;
						item.tax = values[`tax_${item.id}`];
						item.totalAmount = values[`totalAmount_${item.id}`];
					});
					API_INVOICE_OUT_SAVE({
						commission: {
							id: cloneData.commission.no,
							issuedDate: moment(values.issuedDate).format('YYYY-MM-DD'),
							no: values.no,
							mainPartName: values.mainPartName,
							buyerName: values.buyerName,
							attachment: cloneData.commission.attachment
						},
						commissionItemList: cloneData.commissionItemList,
						commissionBusinessLineSplitList: cloneData.commissionBusinessLineSplitList
					}).then(res => {
						if (res.success) {
							if (res.data.success) {
								this.$message.success('保存成功');
								this.$router.replace('/center/admin/invoice/out/list');
							} else {
								const h = this.$createElement;
								const messageObj = res.data.errorMsg;
								let messageHtml = [];
								for (const key in messageObj) {
									messageHtml.push(h('p', `${key}:${messageObj[key]}`));
								}
								this.$warning({
									title: '提示',
									content: h('div', {}, messageHtml)
								});
							}
						}
					});
				}
			});
		},
		computedData() {
			this.invoiceData = storage.session.get('outExcelList');
			this.invoiceData.commissionBusinessLineSplitList.forEach((item, index) => {
				item.id = index;
				item.key = ++index;
			});
			this.invoiceData.commissionItemList.forEach((item, index) => {
				item.id = index;
				item.key = ++index;
			});
			this.$nextTick(() => {
				const { buyerName, issuedDate, mainPartName, mainPartUscc, no } = this.invoiceData.commission;
				this.form.setFieldsValue({
					no,
					buyerName,
					issuedDate,
					mainPartName,
					mainPartUscc
				});
				this.invoiceData.commissionBusinessLineSplitList.forEach((item, index) => {
					this.form.setFieldsValue({
						[`downContractNo_${index}`]: item.downContractNo,
						[`splitAmount_${index}`]: item.splitAmount,
						[`name_${index}`]: item.name,
						[`splitQuantity_${index}`]: item.splitQuantity,
						[`upCompanyName_${index}`]: item.upCompanyName,
						[`upContractNo_${index}`]: item.upContractNo,
						[`downCompanyName_${index}`]: this.invoiceData.commission.buyerName,
						[`businessLineName_${index}`]: item.name
					});
				});
				this.invoiceData.commissionItemList.forEach((item, index) => {
					if (index === 0) {
						this.unit = item.unit || '';
					}
					this.form.setFieldsValue({
						[`amount_${index}`]: item.amount,
						[`name_${index}`]: item.name,
						[`quantity_${index}`]: item.quantity,
						[`spec_${index}`]: item.spec,
						[`tax_${index}`]: item.tax,
						[`taxRate_${index}`]: item.taxRate * 100,
						[`totalAmount_${index}`]: item.totalAmount,
						[`unit_${index}`]: this.unit,
						[`unitPrice_${index}`]: item.unitPrice
					});
				});
			});
			this.amountAndQuality();
		}
	},
	mounted() {
		this.computedData();
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
	.count {
		width: 100%;
		height: 50px;
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		align-items: center;
	}
	.footer-wrap {
		width: 100%;
		height: 50px;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		margin-top: 50px;
	}
	.add-btn-wrap {
		width: 100%;
		height: 40px;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}
	.content-line {
		margin-top: 20px;
	}
	.new-table {
		/deep/ .ant-col-12 {
			width: 100%;
		}
		.ant-form-item {
			margin-bottom: 0;
		}
	}
	.margin-left-20px {
		margin-left: 20px;
	}
}
</style>
<style lang="less" scoped>
@import url('~@/v2/style/invoiceTools/common.less');
</style>
