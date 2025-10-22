<template>
	<div>
		<p class="slTitleAssis">
			基准质量指标
			<a-space
				v-if="multiple"
				style="margin-left: 20px"
				:size="20"
			>
				<a-switch
					checked-children="多品类"
					un-checked-children="单品类"
					@change="categoryChange"
					:checked="categoryType === 'MULTIPLE'"
					v-show="!ShanMeiCangyaTemplate"
				/>
				<a-button
					@click="addCategory()"
					class="btn128"
					type="primary"
					ghost
					v-if="categoryType === 'MULTIPLE' && orderIndicators.length < 50"
					>添加新品类</a-button
				>
				<a-button
					v-if="categoryType === 'SINGLE'"
					@click="chooseTarget(0)"
					class="chooseBtn"
					type="primary"
					ghost
					>选择考核指标</a-button
				>
			</a-space>
			<a-button
				style="margin-left: 20px"
				v-else
				@click="chooseTarget(0)"
				class="chooseBtn"
				type="primary"
				ghost
				>选择考核指标</a-button
			>
		</p>
		<div v-if="orderIndicators && orderIndicators.length">
			<div
				v-for="(formItem, formIndex) in orderIndicators"
				:key="formIndex"
				:class="multiple && categoryType === 'MULTIPLE' ? 'indicatorBox' : ''"
			>
				<a-space
					:size="20"
					class="indicatorTitle"
					v-if="multiple && categoryType === 'MULTIPLE'"
				>
					<span>品类{{ formIndex + 1 }}</span>
					<a-button
						@click="chooseTarget(formIndex)"
						class="chooseBtn"
						type="primary"
						ghost
						>选择考核指标</a-button
					>
					<a-tooltip
						v-if="orderIndicators.length > 1"
						placement="top"
						overlayClassName="del-tooltips"
						:getPopupContainer="getPopupContainer"
					>
						<template slot="title">删除该品类</template>
						<div
							class="delImg"
							@click="deleteItem(formIndex)"
						>
							<img
								src="@/v2/assets/imgs/common/trash_blue_icon.png"
								alt=""
							/>
						</div>
					</a-tooltip>
				</a-space>
				<a-form
					class="slFormDetail"
					:form="formList['productIndicatorForm_' + formIndex]"
					@submit="handleSubmit"
					:layout="formLayout.layout"
					:labelAlign="formLayout.labelAlign"
				>
					<a-row
						:gutter="[40, 0]"
						v-if="multiple && categoryType === 'MULTIPLE'"
					>
						<a-col :span="8">
							<a-form-item
								label="品名"
								:required="true"
							>
								<a-input
									style="width: 100%"
									placeholder="请输入品名"
									@change="e => valueChange(e, formIndex, 'goodsName')"
									v-bind="VUEX_FORM_LIST_GOODSNAME"
									v-decorator="[
										`goodsName`,
										{
											rules: [
												{
													required: true,
													message: `品名必填`
												}
											],
											validateTrigger: 'blur'
										}
									]"
								/>
							</a-form-item>
						</a-col>
						<a-col :span="8">
							<a-form-item
								label="基准价格(含税)(元/吨)"
								:required="true"
							>
								<a-input-number
									style="width: 100%"
									v-bind="VUEX_FORM_LIST_BASEPRICE"
									placeholder="请输入基准价格(含税)(元/吨)"
									@blur="e => valueChange(e, formIndex, 'basePrice')"
									:step="1 / Math.pow(10, VUEX_FORM_LIST_BASEPRICE.precision)"
									:formatter="value => value && parseFloat(value)"
									v-decorator="[
										`basePrice`,
										{
											rules: [
												{ required: true, message: `基准价格(含税)(元/吨)必填` },
												{ validator: (rule, value, callback) => validPrice(rule, value, callback, formIndex) }
											],
											validateTrigger: 'blur'
										}
									]"
								/>
							</a-form-item>
						</a-col>
						<a-col :span="8">
							<a-form-item
								label="基准价格(不含税)(元/吨)"
								:required="true"
							>
								<a-input-number
									style="width: 100%"
									v-bind="VUEX_FORM_LIST_EXCLUDETAXBASEPRICE"
									placeholder="请输入基准价格(不含税)(元/吨)"
									@change="e => valueChange(e, formIndex, 'excludeTaxBasePrice')"
									:step="1 / Math.pow(10, VUEX_FORM_LIST_EXCLUDETAXBASEPRICE.precision)"
									:formatter="value => value && parseFloat(value)"
									v-decorator="[
										`excludeTaxBasePrice`,
										{
											rules: [
												{ required: true, message: `基准价格(含税)(元/吨)必填` },
												{ validator: (rule, value, callback) => validPrice(rule, value, callback, formIndex) }
											],
											validateTrigger: 'blur'
										}
									]"
								/>
							</a-form-item>
						</a-col>
					</a-row>
					<a-row :gutter="[40, 0]">
						<a-col
							:span="8"
							v-for="(item, index) in formItem.productIndicatorList"
							:key="index"
							style="height: 92px"
						>
							<div
								label=""
								v-if="item.inputType == 'RANGE'"
								:required="true"
							>
								<a-input-group compact>
									<div class="code-label">
										<div class="label">
											<span class="code-required">*</span>
											<span
												class="code-name"
												v-html="item.indicatorName"
											></span>
										</div>
										<div class="extra">
											<a-radio-group
												@change="onSwitch(formIndex, index, $event)"
												:value="item.inputType"
											>
												<a-radio-button value="RANGE">区间值</a-radio-button>
												<a-radio-button value="SINGLE">单个值</a-radio-button>
											</a-radio-group>
										</div>
									</div>
									<a-row
										type="flex"
										class="a-input-group-flex"
									>
										<a-col flex="46%">
											<a-form-item class="mb0 pb0">
												<a-input-number
													style="width: 100%"
													:disabled="item.disabled"
													:placeholder="item.errorMsg"
													v-bind="item"
													:max="item.columnMax"
													:min="item.columnMin"
													@change="e => inputValueChange(e, formIndex, index, `${item.indicatorCode}_value1`)"
													v-decorator="[
														`${item.indicatorCode}_value1`,
														{
															rules: [
																{
																	required: true,
																	message: `${item.indicatorName}必填`
																},
																{
																	validator: (rule, value, callback) =>
																		validateLeftFieldsError(rule, value, callback, item, formIndex, index)
																}
															],
															validateTrigger: 'change'
														}
													]"
												/>
											</a-form-item>
										</a-col>
										<a-col
											flex="8%"
											class="middle-symbol"
											>-</a-col
										>
										<a-col flex="46%">
											<a-form-item class="mb0 pb0">
												<a-input-number
													style="width: 100%"
													:disabled="item.disabled"
													:placeholder="item.errorMsg"
													v-bind="item"
													:max="item.columnMax"
													:min="item.columnMin"
													@change="e => inputValueChange(e, formIndex, index, `${item.indicatorCode}_value2`)"
													v-decorator="[
														`${item.indicatorCode}_value2`,
														{
															rules: [
																{
																	required: true,
																	message: `${item.indicatorName}必填`
																},
																{
																	validator: (rule, value, callback) =>
																		validateRightFieldsError(rule, value, callback, item, formIndex, index)
																}
															],
															validateTrigger: 'change'
														}
													]"
												/>
											</a-form-item>
										</a-col>
									</a-row>
								</a-input-group>
							</div>
							<div
								label=""
								v-else
								:required="true"
							>
								<div class="code-label">
									<div class="label">
										<span class="code-required">*</span>
										<span
											class="code-name"
											v-html="item.indicatorName"
										></span>
									</div>
									<div class="extra">
										<a-radio-group
											@change="onSwitch(formIndex, index, $event)"
											:value="item.inputType"
										>
											<a-radio-button value="RANGE">区间值</a-radio-button>
											<a-radio-button value="SINGLE">单个值</a-radio-button>
										</a-radio-group>
									</div>
								</div>
								<a-row
									type="flex"
									justify="space-between"
								>
									<a-input-group
										compact
										style="display: flex"
									>
										<a-col
											flex="88px"
											v-if="item.symbolList"
											style="margin-right: 20px"
										>
											<a-form-item>
												<a-select
													placeholder="请选择"
													style="width: 88px"
													@change="e => inputValueChange(e, formIndex, index, `${item.indicatorCode}_symbol`)"
													v-decorator="[
														`${item.indicatorCode}_symbol`,
														{
															initialValue: item.symbol,
															rules: [
																{
																	required: true,
																	message: `${item.indicatorName}必填`
																}
															],
															validateTrigger: 'change'
														}
													]"
													:showArrow="!item.disabled"
													:disabled="item.disabled"
												>
													<a-select-option
														:value="item"
														v-for="(item, index) in (item.symbolList || '').split(',')"
														:key="index"
														>{{ item }}</a-select-option
													>
												</a-select>
											</a-form-item>
										</a-col>
										<a-col flex="1">
											<a-form-item>
												<a-input-number
													style="width: 100%"
													:disabled="item.disabled"
													:placeholder="item.errorMsg"
													v-bind="item"
													:max="item.columnMax"
													:min="item.columnMin"
													@change="e => inputValueChange(e, formIndex, index, `${item.indicatorCode}_value1`)"
													v-decorator="[
														`${item.indicatorCode}_value1`,
														{
															rules: [
																{
																	required: true,
																	message: `${item.indicatorName}必填`
																},
																{
																	validator: (rule, value, callback) =>
																		validateFieldsSingle(rule, value, callback, item, formIndex, index)
																}
															],
															validateTrigger: 'blur'
														}
													]"
												/>
											</a-form-item>
										</a-col>
									</a-input-group>
								</a-row>
							</div>
						</a-col>
					</a-row>
				</a-form>
			</div>
		</div>
		<a-modal
			class="slModal"
			:visible="visible"
			title="选择指标"
			width="920px"
			@cancel="
				() => {
					this.visible = false;
				}
			"
			@ok="chooseSubmit()"
			okText="保存"
			destroyOnClose
		>
			<a-row>
				<a-checkbox-group v-model="checkedList">
					<a-col
						:span="6"
						:key="index"
						v-for="(item, index) in VUEX_GET_PRODUCTION_INDICATOR"
					>
						<a-checkbox :value="item.indicatorCode">
							<span v-html="item.indicatorName"></span>
						</a-checkbox>
					</a-col>
				</a-checkbox-group>
			</a-row>
		</a-modal>
	</div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import { cloneDeep, merge } from 'lodash';
import { getPopupContainer } from '@/untils/factory.js';

export default {
	props: {
		formLayout: {
			type: Object,
			default: () => {}
		}
	},
	data() {
		return {
			getPopupContainer,
			form: null,
			visible: false,
			checkedList: [],
			selectList: [],
			categoryType: 'SINGLE', // 多品类MULTIPLE，单品类SINGLE
			// orderIndicators: [],
			formList: {},
			currentFormIndex: -1
		};
	},
	watch: {},
	computed: {
		...mapGetters('contract', {
			VUEX_GET_PRODUCTION_INDICATOR: 'VUEX_GET_PRODUCTION_INDICATOR',
			VUEX_GET_CONTRACT_DATA: 'VUEX_GET_CONTRACT_DATA',
			VUEX_GET_CONTRACT_ORDER_INDICTORS: 'VUEX_GET_CONTRACT_ORDER_INDICTORS',
			VUEX_GET_FORM_SCHEMA: 'VUEX_GET_FORM_SCHEMA',
			VUEX_GET_FORM_ERRORS: 'VUEX_GET_FORM_ERRORS'
		}),
		...mapGetters('config', {
			VUEX_ST_ORDERZHIBIAOCODE: 'VUEX_ST_ORDERZHIBIAOCODE'
		}),
		multiple() {
			// 是否支持单多品类切换
			return this.VUEX_GET_CONTRACT_DATA.contract.multiGoodsNameSupportFlag;
		},
		ShanMeiCangyaTemplate() {
			// 是否是陕煤专用的仓牙模板， 如果是 默认显示多品类，且隐藏多单切换按钮
			const Buy = [
				'STEAM_COAL_016',
				'COKING_COAL_007',
				'COKING_011',
				'SEMI_COKE_006',
				'SMOKELESS_COAL_006',
				'INJECTION_COAL_006'
			];
			const Sell = [
				'STEAM_COAL_1005',
				'COKING_COAL_1005',
				'COKING_1005',
				'SEMI_COKE_1005',
				'SMOKELESS_COAL_1005',
				'INJECTION_COAL_1005'
			];
			return Buy.concat(Sell).includes(this.VUEX_GET_CONTRACT_DATA.contract.contractTemplateName);
		},
		orderIndicators() {
			return this.VUEX_GET_CONTRACT_DATA.orderIndicators || [];
		},
		// 表单中品名的自定义规则
		VUEX_FORM_LIST_GOODSNAME() {
			const data = this.VUEX_GET_FORM_SCHEMA.formList.quality.filter(item => {
				return item.label === 'goodsName';
			});
			return data;
		},
		// 表单中基准价格的自定义规则
		VUEX_FORM_LIST_BASEPRICE() {
			const data = this.VUEX_GET_FORM_SCHEMA.formList.quality.filter(item => {
				return item.label === 'basePrice';
			});
			return data;
		},
		// 表单中基准价格的自定义规则
		VUEX_FORM_LIST_EXCLUDETAXBASEPRICE() {
			const data = this.VUEX_GET_FORM_SCHEMA.formList.quality.filter(item => {
				return item.label === 'basePrice';
			});
			data.label = 'excludeTaxBasePrice';
			return data;
		}
	},
	mounted() {
		if (!this.orderIndicators.length) {
			// 陕煤仓押模板默认多品类
			if (this.ShanMeiCangyaTemplate) {
				this.categoryType = 'MULTIPLE';
				this.categoryChange('MULTIPLE');
				// 非陕煤仓押模板
			} else {
				this.addCategory();
			}
			return;
		}
		this.categoryType = this.orderIndicators.length > 1 || this.ShanMeiCangyaTemplate ? 'MULTIPLE' : 'SINGLE';
		this.updateFormItemList();
		this.initFormData();
	},
	methods: {
		...mapMutations({
			VUEX_SET_STEP1_CONTRACT_DATA: 'contract/VUEX_SET_STEP1_CONTRACT_DATA',
			VUEX_SET_FORM_ERRORS: 'contract/VUEX_SET_FORM_ERRORS',
			VUEX_SET_FORM_PRODUCTION_INDICATOR_SELECT: 'contract/VUEX_SET_FORM_PRODUCTION_INDICATOR_SELECT',
			VUEX_SET_UPDATE_INDICATOR: 'contract/VUEX_SET_UPDATE_INDICATOR',
			VUEX_SET_CONTRACT_DATA: 'contract/VUEX_SET_CONTRACT_DATA'
		}),
		formateOrderIndicators(orderIndicators) {
			let cloneObj = cloneDeep(orderIndicators);
			cloneObj.forEach(item => {
				if (item.productIndicatorList) {
					item.productIndicatorList.forEach(items => {
						if (items.inputType == 'RANGE') {
							items.value1 = items.valueList[items.indicatorCode + '_value1'];
							items.value2 = items.valueList[items.indicatorCode + '_value2'];
						} else {
							// items.value2 = items.symbol == '无符号' ? null : items.symbol;
							items.value1 = items.valueList[items.indicatorCode + '_value1'];
						}
					});
				}
			});
			return cloneObj;
		},
		valueChange(e, formIndex, type) {
			const current = cloneDeep(this.orderIndicators[formIndex]);
			current[type] = e?.target?.value || e;
			if (type == 'basePrice') {
				const computedValue = e?.target?.value || 0;
				current['excludeTaxBasePrice'] = (Number(computedValue) / 1.13).toFixed(2);
				this.formList['productIndicatorForm_' + formIndex].setFieldsValue({
					excludeTaxBasePrice: current['excludeTaxBasePrice']
				});
			}
			this.$set(this.orderIndicators, formIndex, current);
			this.VUEX_SET_UPDATE_INDICATOR(this.formateOrderIndicators(this.orderIndicators));
			this.VUEX_SET_STEP1_CONTRACT_DATA({ productIndicator: this.formateOrderIndicators(this.orderIndicators) });
			// 存储当前操作的多品类的序号和类型，方便合同预览定位
			this.VUEX_SET_FORM_PRODUCTION_INDICATOR_SELECT({
				index: formIndex,
				type: 'info'
			});
		},
		inputValueChange(value, formIndex, index, code) {
			if (code.indexOf('_symbol') >= 0) {
				const currentSymbol = this.orderIndicators[formIndex].productIndicatorList[index];
				currentSymbol.symbol = value;
			} else {
				const current = this.orderIndicators[formIndex].productIndicatorList[index].valueList;
				current[code] = value;
			}
			this.VUEX_SET_UPDATE_INDICATOR(this.formateOrderIndicators(this.orderIndicators));
			this.VUEX_SET_STEP1_CONTRACT_DATA({ productIndicator: this.formateOrderIndicators(this.orderIndicators) });
			// 存储当前操作的多品类的序号和类型，方便合同预览定位
			this.VUEX_SET_FORM_PRODUCTION_INDICATOR_SELECT({
				index: formIndex,
				type: 'indicator'
			});
		},
		deleteItem(index) {
			this.orderIndicators.splice(index, 1);
			delete this.formList['productIndicatorForm_' + index];
			this.VUEX_SET_UPDATE_INDICATOR(this.orderIndicators);
			this.VUEX_SET_STEP1_CONTRACT_DATA({ productIndicator: this.orderIndicators });
			this.updateFormItemList();
			this.initFormData();
		},
		updateFormItemList() {
			this.orderIndicators.forEach((item, index) => {
				this.formList['productIndicatorForm_' + index] = this.$form.createForm(this, { name: 'productIndicator_' + index });
			});
		},
		addCategory() {
			const index = this.orderIndicators?.length || 0;
			const cloneProductIndicatorList = index > 0 ? cloneDeep(this.orderIndicators[index - 1]?.productIndicatorList) || [] : [];
			cloneProductIndicatorList.forEach(item => {
				if (item.valueList) {
					const keys = Object.keys(item.valueList);
					item.valueList[keys[0]] = null;
					item.valueList[keys[1]] = null;
					if (item.inputType === 'SINGLE') {
						item.valueList[item.indicatorCode + '_symbol'] = item.symbol;
					}
				}
			});
			this.orderIndicators.push({
				goodsName: '',
				excludeTaxBasePrice: '',
				basePrice: '',
				productIndicatorList: cloneProductIndicatorList
			});
			this.formList['productIndicatorForm_' + index] = this.$form.createForm(this, { name: 'productIndicator_' + index });
			this.VUEX_SET_UPDATE_INDICATOR(this.orderIndicators);
			this.VUEX_SET_STEP1_CONTRACT_DATA({ productIndicator: this.orderIndicators });
		},
		categoryChange(e) {
			this.categoryType = e ? 'MULTIPLE' : 'SINGLE';
			this.VUEX_SET_UPDATE_INDICATOR([]);
			this.VUEX_SET_STEP1_CONTRACT_DATA({ productIndicator: this.orderIndicators });
			this.checkedList = [];
			// 单多品类切换
			this.VUEX_SET_CONTRACT_DATA({
				field: 'contract',
				values: {
					multiGoodsNameFlag: e ? 1 : 0
				}
			});
			// 初始化
			this.addCategory();
			this.VUEX_SET_FORM_ERRORS({
				productIndicator: {}
			});
		},
		onSwitch(formIndex, index, e) {
			const value = e.target.value;
			const cloneItem = cloneDeep(this.orderIndicators[formIndex]);
			cloneItem.productIndicatorList[index].inputType = value;
			this.$set(this.orderIndicators, formIndex, cloneItem);
			this.VUEX_SET_UPDATE_INDICATOR(this.orderIndicators);
			this.VUEX_SET_STEP1_CONTRACT_DATA({ productIndicator: this.orderIndicators });
		},
		validateFieldsSingle(rule, value, callback, item, formIndex, index) {
			if (this.isNull(value)) {
				callback();
			} else {
				if (value < item.columnMin || value > item.columnMax) {
					callback(`请输入${item.columnMin}-${item.columnMax}之间的数`);
					return;
				}
				if (value.toString()?.split('.')[1]?.length > item.length) {
					callback(`小数点后最多${item.length}位数字`);
					return;
				}
				callback();
			}
		},
		validateLeftFieldsError(rule, value, callback, item, formIndex, index) {
			const current = this.orderIndicators[formIndex].productIndicatorList[index].valueList;
			const rightValue = current[`${item.indicatorCode}_value2`];
			if (this.isNull(value)) {
				callback();
				this.formList['productIndicatorForm_' + formIndex].validateFields([`${item.indicatorCode}_value2`]);
			} else {
				if (value < item.columnMin || value > item.columnMax) {
					callback(`请输入${item.columnMin}-${item.columnMax}之间的数`);
					return;
				}
				if (value.toString()?.split('.')[1]?.length > item.length) {
					callback(`小数点后最多${item.length}位数字`);
					return;
				}
				if (this.isNull(rightValue)) {
					callback();
					this.formList['productIndicatorForm_' + formIndex].validateFields([`${item.indicatorCode}_value2`]);
					return;
				}
				if (Number(value) >= Number(rightValue)) {
					callback(`左区间必须小于右区间值`);
					return;
				}
				callback();
			}
		},
		isNull(val) {
			if (val === 0) return false;
			if (!val) return true;
			return false;
		},
		validateRightFieldsError(rule, value, callback, item, formIndex, index) {
			const current = this.orderIndicators[formIndex].productIndicatorList[index].valueList;
			const leftValue = current[`${item.indicatorCode}_value1`];
			if (this.isNull(value)) {
				callback();
				this.formList['productIndicatorForm_' + formIndex].validateFields([`${item.indicatorCode}_value1`]);
			} else {
				if (value < item.columnMin || value > item.columnMax) {
					callback(`请输入${item.columnMin}-${item.columnMax}之间的数`);
					return;
				}
				if (value.toString()?.split('.')[1]?.length > item.length) {
					callback(`小数点后最多${item.length}位数字`);
					return;
				}
				if (this.isNull(leftValue)) {
					callback();
					this.formList['productIndicatorForm_' + formIndex].validateFields([`${item.indicatorCode}_value1`]);
					return;
				}
				if (Number(value) <= Number(leftValue)) {
					callback(`右区间必须大于左区间值`);
					return;
				}
				callback();
			}
		},
		initFormData() {
			this.$nextTick(() => {
				this.orderIndicators.forEach((item, index) => {
					let tempValueObj = {};
					if (item.productIndicatorList) {
						item.productIndicatorList.forEach(items => {
							tempValueObj = {
								...tempValueObj,
								...items.valueList
							};
						});
					}
					tempValueObj.basePrice = item.basePrice;
					tempValueObj.excludeTaxBasePrice = item.excludeTaxBasePrice;
					tempValueObj.goodsName = item.goodsName;
					setTimeout(() => {
						this.formList['productIndicatorForm_' + index].setFieldsValue({
							...tempValueObj
						});
					}, 500);
				});
			});
		},
		handleSubmit() {
			const resultArr = [];
			return new Promise(resolve => {
				let errorObj = this.VUEX_GET_FORM_ERRORS.productIndicator || {};
				for (const key in this.formList) {
					this.formList[key].validateFieldsAndScroll(err => {
						errorObj[key] = err;
						this.VUEX_SET_FORM_ERRORS({
							productIndicator: errorObj
						});
						if (!err) {
							// 多品类时最少两个品类
							if (this.categoryType === 'MULTIPLE' && this.orderIndicators.length < 2 && !this.ShanMeiCangyaTemplate) {
								this.$message.error('品类至少需要2个');
								resultArr.push(false);
							} else if (this.orderIndicators.length < 1 && this.ShanMeiCangyaTemplat) {
								this.$message.error('品类至少需要1个');
								resultArr.push(false);
							} else {
								resultArr.push(true);
							}
						} else {
							resultArr.push(false);
						}
					});
				}
				if (resultArr.includes(false)) {
					resolve(false);
				} else {
					this.VUEX_SET_UPDATE_INDICATOR(this.orderIndicators);
					this.VUEX_SET_STEP1_CONTRACT_DATA({ productIndicator: this.orderIndicators });
					resolve(true);
				}
			});
		},
		// 选择指标
		chooseTarget(index) {
			this.visible = true;
			this.currentFormIndex = index;
			this.setModalChecked();
		},
		// 设置弹窗指标选中效果
		setModalChecked() {
			this.checkedList = this.orderIndicators[this.currentFormIndex]?.productIndicatorList.map(item => item.indicatorCode);
		},
		chooseSubmit() {
			const result = this.VUEX_GET_PRODUCTION_INDICATOR.filter(item => this.checkedList.includes(item.indicatorCode));
			let checkedResult = cloneDeep(result);
			let cloneItem = cloneDeep(this.orderIndicators[this.currentFormIndex]);
			const currentList = cloneItem.productIndicatorList;
			checkedResult.forEach((item, index) => {
				currentList.forEach(pro => {
					if (pro.indicatorCode === item.indicatorCode) {
						this.$set(checkedResult, index, pro);
					}
				});
			});
			cloneItem.productIndicatorList = checkedResult;
			cloneItem.hasIndicator = cloneItem.productIndicatorList.length >= 0 ? true : false;
			this.$set(this.orderIndicators, this.currentFormIndex, cloneItem);
			this.visible = false;
		},
		// 校验基准价格
		validPrice(rule, value, callback, formIndex) {
			let price =
				rule.field === 'basePrice' ? value : this.formList['productIndicatorForm_' + formIndex].getFieldValue('basePrice');
			let excludePrice =
				rule.field === 'excludeTaxBasePrice'
					? value
					: this.formList['productIndicatorForm_' + formIndex].getFieldValue('excludeTaxBasePrice');
			if (Number(excludePrice) >= Number(price)) {
				callback('含税价格需大于不含税价格');
			}
			callback();
		}
	}
};
</script>

<style lang="less" scoped>
.slTitleAssis {
	margin-bottom: 18px;
	height: 52px;
	display: flex;
	align-items: center;
	margin-top: 0;
}
.ant-checkbox-group {
	width: 100%;
}
::v-deep.ant-checkbox-wrapper {
	// width: 25%;
	margin-bottom: 25px;
}
::v-deep.ant-checkbox-wrapper + .ant-checkbox-wrapper {
	margin-left: 0 !important;
}
.select-list-no-data {
	color: #f5222d;
	display: inline-block;
	margin-bottom: 20px;
}
.a-input-group-flex {
	width: 100%;
	display: flex;
}
.mb0 {
	margin-bottom: 0 !important;
}
.pb0 {
	padding-bottom: 0 !important;
}
.middle-symbol {
	height: 32px;
	line-height: 32px;
	text-align: center;
}
.slFormDetail {
	padding: 0;
	& > .ant-row > .ant-col {
		& > .ant-form-item {
			height: 82px;
		}
	}
	::v-deep.ant-form-item {
		margin-bottom: 0;
		height: 85px !important;
	}
}
.code-label {
	display: flex;
	align-items: center;
	justify-content: space-around;
	width: 100%;
	height: 20px;
	line-height: 20px;
	margin-bottom: 10px;
	.label {
		flex: 1;
	}
	.extra {
		flex-shrink: 0;
		/deep/.ant-radio-group {
			height: 24px;
			.ant-radio-button-wrapper {
				height: 24px;
				padding: 0 6px;
				font-size: 12px;
				line-height: 22px;
			}
		}
	}
}
.code-required {
	display: inline-block;
	margin-right: 4px;
	color: #f5222d;
	font-size: 14px;
	line-height: 1;
}
.code-name {
	color: rgba(0, 0, 0, 0.4);
}
#productIndicatorForm {
	margin: 0 -6px 0 -6px;
}
.indicatorBox {
	border: 1px solid #e5e6eb;
	border-radius: 4px;
	width: 100%;
	margin-bottom: 20px;
	.indicatorTitle {
		width: 100%;
		height: 50px;
		background: #f3f5f6;
		border-radius: 4px 4px 0 0;
		padding-left: 6px;
		span {
			font-family: PingFang SC;
			font-size: 14px;
			font-weight: 500;
			line-height: 20px;
		}
		.delImg {
			padding: 3px;
			margin-left: 10px;
			cursor: pointer;
			width: 22px;
			height: 22px;
			img {
				width: 16px;
				height: 16px;
				position: relative;
				top: -3px;
			}
		}
		.delImg:hover {
			background: rgba(#77889d, 0.1);
			border-radius: 2px;
		}
		.chooseBtn {
			background: #fff;
			padding: 6px 7px;
			height: 32px;
		}
	}
	.slFormDetail {
		margin-top: 20px;
		padding: 0 6px;
	}
}
</style>
<style lang="less">
.del-tooltips {
	cursor: none;
	.ant-tooltip-inner {
		background: #1f2329;
	}
	.ant-tooltip-arrow::before {
		background: #1f2329;
	}
}
</style>
