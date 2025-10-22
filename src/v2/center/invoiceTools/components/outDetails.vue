<template>
	<a-modal
		title="销项发票详情"
		:visible="visible"
		width="1200px"
		:maskClosable="false"
		destroyOnClose
		:footer="null"
		@cancel="visible = false"
		class="new-modal"
	>
		<p class="title">发票信息</p>
		<a-form
			:form="form"
			:label-col="{ span: 5 }"
			:wrapper-col="{ span: 12 }"
			labelAlign="left"
		>
			<a-row>
				<a-col span="8">
					<a-form-item label="开票日期">
						<a-date-picker
							:disabled="!isEdit"
							:format="dateFormat"
							style="width: 100%"
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
							:disabled="!isEdit"
							v-decorator="[
								'no',
								{
									rules: [{ required: false, message: '编号必填!' }]
								}
							]"
						/>
					</a-form-item>
				</a-col>
				<a-col span="8">
					<a-form-item label="开票主体">
						<a-input
							:disabled="!isEdit"
							v-decorator="[
								'mainPartName',
								{
									rules: [{ required: true, message: '编号必填!' }]
								}
							]"
						/>
					</a-form-item>
				</a-col>
				<a-col span="8">
					<a-form-item label="购买方">
						<a-input
							:disabled="!isEdit"
							@input="changeBuyerName"
							@change="changeBuyerName"
							v-decorator="[
								'buyerName',
								{
									rules: [{ required: true, message: '购买方必填!' }]
								}
							]"
						/>
					</a-form-item>
				</a-col>
			</a-row>
			<p class="count">
				<span>数量合计：{{ formateNumber(qualityGoods, 4) }} {{ unit }}</span>
				<span class="margin-left-20px">价税合计：{{ formateNumber(amountGoods, 2) }} 元</span>
			</p>
			<div>
				<a-table
					:columns="columnsInvoice"
					:data-source="dataDetails.commissionItemList"
					:pagination="false"
					rowKey="id"
					:scroll="{ x: true, y: 300 }"
					id="goods-table-toast"
					class="new-table"
				>
					<span
						slot="name"
						slot-scope="text, scoped"
					>
						<a-form-item>
							<a-input
								:disabled="!isEdit"
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
								:disabled="!isEdit"
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
								:disabled="!enabledUnit(scoped) || !isEdit"
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
								:maxLength="60"
							/>
						</a-form-item>
					</span>
					<span
						slot="quantity"
						slot-scope="text, scoped"
					>
						<a-form-item>
							<a-input-number
								:disabled="!isEdit"
								@change="amountAndQuality"
								:precision="4"
								:step="0.0001"
								v-decorator="[
									'quantity_' + scoped.id,
									{
										rules: [
											{
												required: true,
												message: '数量必填!'
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
								:disabled="!isEdit"
								:precision="4"
								:step="0.0001"
								v-decorator="[
									'unitPrice_' + scoped.id,
									{
										rules: [
											{
												required: true,
												message: '单价必填!'
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
								:disabled="!isEdit"
								:precision="2"
								:step="0.01"
								v-decorator="[
									'amount_' + scoped.id,
									{
										rules: [
											{
												required: true,
												message: '金额必填!'
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
								:disabled="!isEdit"
								:precision="2"
								:step="0.01"
								v-decorator="[
									'taxRate_' + scoped.id,
									{
										rules: [
											{
												required: true,
												message: '税率必填!'
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
								:disabled="!isEdit"
								:precision="2"
								:step="0.01"
								v-decorator="[
									'tax_' + scoped.id,
									{
										rules: [
											{
												required: true,
												message: '税额必填!'
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
								:disabled="!isEdit"
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
				<p
					class="add-btn-wrap"
					v-if="isEdit"
				>
					<a-button
						icon="plus"
						type="link"
						@click="addGoods"
						style="color: #8b9db8"
						>新增行</a-button
					>
				</p>
			</div>
			<div class="wrap-line">
				<p class="title">关联合同及业务线信息</p>
				<p class="count">
					<span>数量合计：{{ formateNumber(qualityLine, 4) }} {{ unit }}</span>
					<span class="margin-left-20px">价税合计：{{ formateNumber(amountLine, 2) }} 元</span>
				</p>
				<div class="new-table">
					<a-table
						:columns="columnsLine"
						:data-source="dataDetails.commissionBusinessLineList"
						:pagination="false"
						rowKey="id"
						:scroll="{ x: 1200, y: 300 }"
						id="business-line-table-toast"
					>
						<span
							slot="businessLineName"
							slot-scope="text, scoped"
						>
							<a-form-item>
								<a-input
									:disabled="!isEdit"
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
								/>
							</a-form-item>
						</span>
						<span
							slot="upContractNo"
							slot-scope="text, scoped"
						>
							<a-form-item>
								<a-input
									:disabled="!isEdit"
									v-decorator="[
										'upContractNo_' + scoped.id,
										{
											rules: [
												{
													required: true,
													message: '上游采购合同编号必填!'
												},
												{
													validator: (rule, value, callback) => validateContract(rule, value, callback, '上游采购')
												}
											],
											trigger: 'change'
										}
									]"
								/>
							</a-form-item>
						</span>
						<span
							slot="upCompanyName"
							slot-scope="text, scoped"
						>
							<a-form-item>
								<a-input
									:disabled="!isEdit"
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
								/>
							</a-form-item>
						</span>
						<span
							slot="downContractNo"
							slot-scope="text, scoped"
						>
							<a-form-item>
								<a-input
									:disabled="!isEdit"
									v-decorator="[
										'downContractNo_' + scoped.id,
										{
											rules: [
												{
													required: true,
													message: '下游销售合同编号必填!'
												},
												{
													validator: (rule, value, callback) => validateContract(rule, value, callback, '下游销售')
												}
											],
											trigger: 'change'
										}
									]"
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
							slot="splitAmount"
							slot-scope="text, scoped"
						>
							<a-form-item>
								<a-input-number
									:disabled="!isEdit"
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
									:disabled="!isEdit"
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
								@click="deleteItem(scoped, 'commissionBusinessLineList')"
								>删除</a-button
							>
						</span>
					</a-table>
					<p
						class="add-btn-wrap"
						v-if="isEdit"
					>
						<a-button
							icon="plus"
							type="link"
							@click="addLine"
							style="color: #8b9db8"
							>新增业务线</a-button
						>
					</p>
				</div>
				<div class="footer-wrap">
					<a-space>
						<div v-if="showEdit">
							<a-button
								type="primary"
								v-auth="'kitInvoice:sellInvoice:list:edit'"
								v-if="!isEdit"
								@click="isEdit = true"
								>编辑</a-button
							>
							<a-button
								type="primary"
								v-else
								@click="save"
								>保存</a-button
							>
						</div>
						<a-button
							@click="close"
							style="margin-left: 18px"
							>关闭</a-button
						>
					</a-space>
				</div>
			</div>
		</a-form>
	</a-modal>
</template>

<script>
import moment from 'moment';
import { columnsInvoice, columnsLine } from '../views/out/table';
import { cloneDeep } from 'lodash';
import { API_GET_OUT_DETAIL, API_GET_OUT_EDIT } from '@/v2/center/invoiceTools/api';
import { formateNumber } from '@/v2/utils/index';

export default {
	props: {
		showEdit: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
			dateFormat: 'YYYY/MM/DD',
			isEdit: false,
			form: this.$form.createForm(this, { name: 'coordinated' }),
			visible: false,
			dataDetails: {},
			currentItem: {},
			qualityGoods: 0,
			amountGoods: 0,
			qualityLine: 0,
			amountLine: 0,
			unit: ''
		};
	},
	computed: {},
	watch: {
		isEdit: {
			handler(value) {
				if (value) {
					this.columnsInvoice = cloneDeep(columnsInvoice);
					this.columnsLine = cloneDeep(columnsLine);
				} else {
					this.columnsInvoice = cloneDeep(columnsInvoice).slice(0, columnsInvoice.length - 1);
					this.columnsLine = cloneDeep(columnsLine).slice(0, columnsLine.length - 1);
				}
			},
			immediate: true
		}
	},
	methods: {
		formateNumber,
		moment,
		changeBuyerName(value) {
			this.$nextTick(() => {
				this.dataDetails.commissionBusinessLineList.forEach((item, index) => {
					this.form.setFieldsValue({
						[`downCompanyName_${index}`]: value?.target?._value
					});
				});
			});
		},
		enabledUnit(scoped) {
			const ids = this.dataDetails.commissionItemList.map(item => item.id).sort();
			return scoped.id == ids[0];
		},
		changeUnit(value = '') {
			if (this.dataDetails.commissionItemList?.length > 1) {
				this.$nextTick(() => {
					const unitOnce = value || this.form.getFieldValue('unit_0') || '';
					this.dataDetails.commissionItemList.forEach((item, index) => {
						this.form.setFieldsValue({
							[`unit_${index}`]: unitOnce
						});
					});
				});
			}
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
		amountAndQualityTotal(item, key) {
			if (this.dataDetails[item]) {
				return this.dataDetails[item].reduce((pre, cur) => {
					return pre + cur[key];
				}, 0);
			} else {
				return 0;
			}
		},
		close() {
			this.visible = false;
			this.isEdit = false;
			this.$emit('update', true);
		},
		deleteItem(item, list) {
			let key = -1;
			for (let i = 0; i < this.dataDetails[list].length; i++) {
				if (this.dataDetails[list][i].id == item.id) {
					key = i;
				}
			}
			if (key >= 0) {
				this.dataDetails[list].splice(key, 1);
			}
			if (list === 'commissionItemList' && this.dataDetails[list].length == 0) {
				this.addGoods();
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
			}
			if (list === 'commissionBusinessLineList' && this.dataDetails[list].length == 0) {
				this.addLine();
				this.form.setFieldsValue({
					['businessLineName_0']: '',
					['upContractNo_0']: '',
					['upCompanyName_0']: '',
					['downContractNo_0']: '',
					['downCompanyName_0']: '',
					['splitAmount_0']: '',
					['splitQuantity_0']: ''
				});
			}
			this.amountAndQuality();
		},
		addLine() {
			let key = this.dataDetails.commissionBusinessLineList.length;
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
			this.dataDetails.commissionBusinessLineList.push(addItem);
			this.$nextTick(() => {
				this.form.setFieldsValue({
					['downCompanyName_' + addItem.id]: this.form.getFieldValue('buyerName')
				});
				const parentElem = document.querySelector('#business-line-table-toast');
				const tableElem = parentElem.querySelector('.ant-table-body');
				tableElem.scrollTop = tableElem.scrollHeight;
			});
		},
		addGoods() {
			let key = this.dataDetails.commissionItemList.length;
			const addItem = {
				id: key,
				name: '',
				spec: '',
				unit: '',
				quantity: '',
				unitPrice: '',
				amount: '',
				taxRate: '',
				tax: '',
				totalAmount: ''
			};
			this.dataDetails.commissionItemList.push(addItem);
			this.changeUnit();
			this.$nextTick(() => {
				if (this.dataDetails.commissionItemList?.length == 1) {
					this.getInputUnit({});
				}
				const parentElem = document.querySelector('#goods-table-toast');
				const tableElem = parentElem.querySelector('.ant-table-body');
				tableElem.scrollTop = tableElem.scrollHeight;
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
		save() {
			this.form.validateFields((err, values) => {
				if (!err) {
					let cloneData = cloneDeep(this.dataDetails);
					cloneData.commissionBusinessLineList.forEach((item, index) => {
						item.businessLineName = values[`businessLineName_${index}`];
						item.upContractNo = values[`upContractNo_${index}`];
						item.upCompanyName = values[`upCompanyName_${index}`];
						item.downContractNo = values[`downContractNo_${index}`];
						item.downCompanyName = values[`downCompanyName_${index}`];
						item.splitAmount = values[`splitAmount_${index}`];
						item.splitQuantity = values[`splitQuantity_${index}`];
						delete item.downCompanyName;
					});
					cloneData.commissionItemList.forEach((item, index) => {
						item.name = values[`name_${index}`];
						item.spec = values[`spec_${index}`];
						item.unit = values[`unit_${index}`];
						item.quantity = values[`quantity_${index}`];
						item.unitPrice = values[`unitPrice_${index}`];
						item.amount = values[`amount_${index}`];
						item.taxRate = values[`taxRate_${index}`] / 100;
						item.tax = values[`tax_${index}`];
						item.totalAmount = values[`totalAmount_${index}`];
					});
					API_GET_OUT_EDIT({
						id: this.currentItem.id,
						issuedDate: moment(values.issuedDate).format('YYYY-MM-DD'),
						no: values.no,
						mainPartName: values.mainPartName,
						buyerName: values.buyerName,
						commissionItemList: cloneData.commissionItemList,
						commissionBusinessLineList: cloneData.commissionBusinessLineList
					}).then(res => {
						if (res.success) {
							if (res.data.success) {
								this.$message.success('保存成功');
								this.isEdit = false;
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
		showModal(item) {
			this.visible = true;
			this.currentItem = item;
			this.fetchData(item.id);
		},
		setFormValues() {
			const { issuedDate, no, mainPartName, buyerName } = this.dataDetails;
			this.form.setFieldsValue({
				issuedDate,
				no,
				mainPartName,
				buyerName
			});
			this.dataDetails.commissionBusinessLineList.forEach((item, index) => {
				this.form.setFieldsValue({
					[`businessLineName_${index}`]: item.businessLineName,
					[`downCompanyName_${index}`]: item.downCompanyName,
					[`downContractNo_${index}`]: item.downContractNo,
					[`splitAmount_${index}`]: item.splitAmount,
					[`splitQuantity_${index}`]: item.splitQuantity,
					[`upCompanyName_${index}`]: item.upCompanyName,
					[`upContractNo_${index}`]: item.upContractNo
				});
			});
			this.dataDetails.commissionItemList.forEach((item, index) => {
				this.form.setFieldsValue({
					[`amount_${index}`]: item.amount,
					[`name_${index}`]: item.name,
					[`quantity_${index}`]: item.quantity,
					[`spec_${index}`]: item.spec,
					[`tax_${index}`]: item.tax,
					[`taxRate_${index}`]: item.taxRate * 100,
					[`totalAmount_${index}`]: item.totalAmount,
					[`unit_${index}`]: item.unit,
					[`unitPrice_${index}`]: item.unitPrice
				});
				if (index === 0) {
					this.unit = item.unit;
				}
			});
			this.$nextTick(() => {
				this.amountAndQuality();
			});
		},
		fetchData(id) {
			API_GET_OUT_DETAIL({
				id
			}).then(res => {
				if (res.success) {
					this.dataDetails = res.data;
					this.dataDetails.commissionBusinessLineList.forEach((item, index) => {
						item.id = index;
						item.key = ++index;
					});
					this.dataDetails.commissionItemList.forEach((item, index) => {
						item.id = index;
						item.key = ++index;
					});
					this.$nextTick(() => {
						this.setFormValues();
					});
				}
			});
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less" scoped>
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
.wrap-line {
	margin-top: 40px;
}
.footer-wrap {
	width: 100%;
	height: 50px;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	margin-top: 10px;
}
.margin-left-20px {
	display: inline-block;
	margin-left: 20px;
}
.new-table {
	/deep/ .ant-col-12 {
		width: 100%;
	}
	::v-deep.ant-table-scroll {
		.ant-table-header {
			overflow: auto !important;
			border-left: 1px solid #e5e6eb;
			border-right: 1px solid #e5e6eb;
			border-radius: 4px 4px 0 0;
		}
	}
}
.add-btn-wrap {
	width: 100%;
	height: 40px;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
}
</style>
