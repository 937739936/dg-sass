<template>
	<div class="checkForm">
		<a-form :form="form">
			<a-table
				v-for="(item, index) in selected"
				:key="index"
				:columns="item.columns"
				:scroll="{ x: true }"
				:dataSource="item.itemList"
				:pagination="false"
				rowKey="id"
				:class="editable ? '' : 'disabled'"
			>
				<!-- 表格首项 热值变化区间，含硫、水分等百分比-->
				<template
					slot="content"
					slot-scope="text, record"
				>
					<a-form-item :validate-status="getFieldStatus('BHQJ_TREND', record, errorShow).validStatus">
						<a-select
							v-model.trim="record.BHQJ_TREND"
							placeholder="请选择"
							style="width: 82px; margin-right: 2px"
							:disabled="!editable"
							@change="trendChange(record)"
							@blur="itemChange('BHQJ_TREND', record)"
							:showArrow="editable"
						>
							<a-select-option :value="1">介于</a-select-option>
							<a-select-option :value="2">大于</a-select-option>
							<a-select-option :value="3">大于等于</a-select-option>
							<a-select-option :value="4">小于</a-select-option>
							<a-select-option :value="5">小于等于</a-select-option>
						</a-select>
					</a-form-item>
					<template v-if="record.BHQJ_TREND == 1">
						<a-form-item
							:validate-status="getFieldStatus('minValue', record, errorShow).validStatus"
							style="width: 44px; margin-right: 2px"
						>
							<a-input
								v-model.trim="record.minValue"
								:disabled="!editable"
								:key="record.id"
								@blur="itemChange('minValue', record)"
							></a-input>
						</a-form-item>
						<a-form-item :validate-status="getFieldStatus('BHQJ_SIGN1', record, errorShow).validStatus">
							<a-select
								v-model.trim="record.BHQJ_SIGN1"
								style="margin-right: 2px; width: 44px"
								:disabled="!editable"
								@change="itemChange('BHQJ_SIGN1', record)"
								:showArrow="editable"
							>
								<a-select-option :value="3">&lt;</a-select-option>
								<a-select-option :value="4">&lt;=</a-select-option>
							</a-select>
						</a-form-item>
						<a-form-item v-if="item.type == 1">
							<span style="display: inline-block; margin-right: 2px">Qnet,ar</span>
						</a-form-item>
						<a-form-item v-else>
							<a-select
								style="width: 72px; margin-right: 2px"
								:disabled="!editable"
								v-model.trim="record.indicatorName"
								:showArrow="editable"
							>
								<a-select-option
									:value="items.name"
									:key="items.key"
									v-for="items in item.indexArr"
									>{{ items.name }}</a-select-option
								>
							</a-select>
						</a-form-item>
						<a-form-item :validate-status="getFieldStatus('BHQJ_SIGN2', record, errorShow).validStatus">
							<a-select
								v-model.trim="record.BHQJ_SIGN2"
								:disabled="!editable"
								@change="itemChange('BHQJ_SIGN2', record)"
								:showArrow="editable"
								style="width: 44px; margin-right: 2px"
							>
								<a-select-option :value="3">&lt;</a-select-option>
								<a-select-option :value="4">&lt;=</a-select-option>
							</a-select>
						</a-form-item>
						<a-form-item
							:validate-status="getFieldStatus('maxValue', record, errorShow).validStatus"
							style="width: 44px"
						>
							<a-input
								v-model.trim="record.maxValue"
								:disabled="!editable"
								@blur="itemChange('maxValue', record)"
							></a-input>
						</a-form-item>
					</template>
					<template v-if="record.BHQJ_TREND != 1 && record.BHQJ_TREND != undefined">
						<a-form-item v-if="item.type == 1">
							<span style="display: inline-block; margin-right: 2px">Qnet,ar</span>
						</a-form-item>
						<a-form-item v-else>
							<a-select
								style="width: 72px; margin-right: 2px"
								:disabled="!editable"
								v-model.trim="record.indicatorName"
								:showArrow="editable"
							>
								<a-select-option
									:value="items.name"
									:key="items.key"
									v-for="items in item.indexArr"
									>{{ items.name }}</a-select-option
								>
							</a-select>
						</a-form-item>
						<a-form-item :validate-status="getFieldStatus('BHQJ_SIGN', record, errorShow).validStatus">
							<a-select
								v-model.trim="record.BHQJ_SIGN"
								disabled
								@blur="itemChange('BHQJ_SIGN', record)"
								:showArrow="editable"
								style="width: 44px; margin-right: 2px"
							>
								<a-select-option :value="1">></a-select-option>
								<a-select-option :value="2">>=</a-select-option>
								<a-select-option :value="3">&lt;</a-select-option>
								<a-select-option :value="4">&lt;=</a-select-option>
							</a-select>
						</a-form-item>
						<a-form-item
							:validate-status="getFieldStatus('BHQJ_VALUE', record, errorShow).validStatus"
							style="width: 44px"
						>
							<a-input
								v-model.trim="record.BHQJ_VALUE"
								:disabled="!editable"
								@blur="itemChange('BHQJ_VALUE', record)"
							></a-input>
						</a-form-item>
					</template>
				</template>
				<!-- 增减基准-->
				<template
					slot="changeBase"
					slot-scope="text, record"
				>
					<a-form-item :validate-status="getFieldStatus('changeBase', record, errorShow).validStatus">
						<a-input
							v-model.trim="record.changeBase"
							:disabled="!editable"
							@blur="itemChange('changeBase', record)"
							style="padding: 4px 8px"
						></a-input>
					</a-form-item>
				</template>
				<!-- 变化幅度-->
				<template
					slot="changeRange"
					slot-scope="text, record"
				>
					<a-form-item :validate-status="getFieldStatus('changeRange', record, errorShow).validStatus">
						<a-input
							v-model.trim="record.changeRange"
							:disabled="!editable"
							@blur="itemChange('changeRange', record)"
							style="padding: 4px 8px"
						></a-input>
					</a-form-item>
				</template>
				<!-- 基准价格 （热值模式2，3，4）-->
				<template
					slot="basePriceBox"
					slot-scope="text, record"
					v-if="item.type == 1 && (item.templateId == '2' || item.templateId == '3' || item.templateId == '4')"
				>
					<a-form-item
						:validate-status="getFieldStatus('basePrice', record, errorShow).validStatus"
						style="width: 60px; margin-right: 2px"
					>
						<a-input
							v-model.trim="record.basePrice"
							:disabled="!editable"
							@blur="itemChange('basePrice', record)"
						></a-input>
					</a-form-item>
					<a-form-item :validate-status="getFieldStatus('basePriceUnit', record, errorShow).validStatus">
						<a-select
							v-model.trim="record.basePriceUnit"
							style="width: 150px"
							placeholder="请选择单位"
							:disabled="!editable"
							@blur="itemChange('basePriceUnit', record)"
							:showArrow="editable"
						>
							<a-select-option
								:value="1"
								v-if="item.templateId == '3' || item.templateId == '4'"
								>元/吨</a-select-option
							>
							<a-select-option
								:value="2"
								v-if="item.templateId == '2' || item.templateId == '4'"
								>元/[(千卡/千克)*吨]</a-select-option
							>
						</a-select>
					</a-form-item>
				</template>
				<!-- 不足时计算方式-->
				<template
					slot="computeMethod"
					slot-scope="text, record"
					v-if="item.type == 1 && item.templateId != 2"
				>
					<a-form-item :validate-status="getFieldStatus('computeMethod', record, errorShow).validStatus">
						<a-select
							v-model.trim="record.computeMethod"
							style="width: 100px; margin-right: 5px"
							placeholder="请选择计算方式"
							:disabled="!editable"
							@blur="itemChange('computeMethod', record)"
							:showArrow="editable"
							:allowClear="true"
						>
							<a-select-option :value="1">补足</a-select-option>
							<a-select-option :value="2">按比例计算</a-select-option>
						</a-select>
					</a-form-item>
				</template>
				<!-- 价格增减额-->
				<template
					slot="priceChange"
					slot-scope="text, record"
				>
					<a-form-item :validate-status="getFieldStatus('priceChangeType', record, errorShow).validStatus">
						<a-select
							v-model.trim="record.priceChangeType"
							style="width: 55px; margin-right: 2px"
							:disabled="!editable"
							@blur="itemChange('priceChangeType', record)"
							:showArrow="editable"
							:allowClear="true"
							class="more"
						>
							<a-select-option :value="1">增</a-select-option>
							<a-select-option :value="2">扣</a-select-option>
						</a-select>
					</a-form-item>
					<a-form-item
						:validate-status="getFieldStatus('priceChangeAmount', record, errorShow).validStatus"
						style="width: 60px"
					>
						<a-input
							v-model.trim="record.priceChangeAmount"
							:disabled="!editable"
							@blur="itemChange('priceChangeAmount', record)"
						></a-input>
					</a-form-item>
					<a-form-item :validate-status="getFieldStatus('priceChangeUnit', record, errorShow).validStatus">
						<a-select
							v-model.trim="record.priceChangeUnit"
							style="width: 150px; margin-left: 2px"
							:disabled="!editable"
							@blur="itemChange('priceChangeUnit', record)"
							:showArrow="editable"
							:allowClear="true"
						>
							<a-select-option :value="1">元/吨</a-select-option>
							<a-select-option :value="2">元/[(千卡/千克)*吨]</a-select-option>
						</a-select>
					</a-form-item>
				</template>
				<!-- 加权方式-->
				<template
					slot="weightMethod"
					slot-scope="text, record"
				>
					<a-form-item :validate-status="getFieldStatus('weightMethod', record, errorShow).validStatus">
						<a-select
							v-model.trim="record.weightMethod"
							placeholder="请选择"
							style="width: 180px"
							:disabled="!editable"
							@blur="itemChange('weightMethod', record)"
							:showArrow="editable"
						>
							<a-select-option :value="1">合同周期加权</a-select-option>
							<a-select-option :value="2">单批次结算(指标加权)</a-select-option>
							<a-select-option :value="3">单批次结算(指标不加权)</a-select-option>
						</a-select>
					</a-form-item>
				</template>
				<template
					slot="action"
					slot-scope="text, record, index"
					v-if="editable"
				>
					<a-form-item>
						<span
							class="actionBtn"
							@click="addRow(index, item)"
							>增加</span
						>
						<span
							class="actionBtn"
							v-if="index != 0"
							@click="removeRow(index, item.itemList)"
							>删除</span
						>
					</a-form-item>
				</template>
			</a-table>
		</a-form>
	</div>
</template>

<script>
const tempAll = [
	'BHQJ_TREND',
	'minValue',
	'BHQJ_SIGN1',
	'BHQJ_SIGN2',
	'maxValue',
	'BHQJ_SIGN',
	'BHQJ_VALUE',
	'changeBase',
	'changeRange',
	'basePrice',
	'basePriceUnit',
	'priceChangeType',
	'priceChangeAmount',
	'priceChangeUnit',
	'computeMethod',
	'weightMethod',
	'indicatorName'
]; //全部字段
const tempNeed = [
	'BHQJ_TREND',
	'minValue',
	'BHQJ_SIGN1',
	'BHQJ_SIGN2',
	'maxValue',
	'BHQJ_SIGN',
	'BHQJ_VALUE',
	'basePrice',
	'basePriceUnit',
	'weightMethod',
	'indicatorName'
]; // 变化区间、加权方式、基准价格
const tempNum = ['minValue', 'maxValue', 'BHQJ_VALUE', 'changeBase', 'changeRange', 'basePrice', 'priceChangeAmount']; // 校验输入框数字大于等于0
import { getColumns, getIndexName } from '@/v2/utils/order/checkIndex.js';
import { mapGetters } from 'vuex';
export default {
	name: 'CheckForm',
	data() {
		return {
			indexArr: [], // 内容参数名
			form: this.$form.createForm(this, { name: 'form' }),
			tempAll, // 全部字段
			tempNeed, // 热值必填字段
			tempNum, // 数字校验字段
			tempValid: [], // 校验字段
			saveData: [], // 保存提交的数据
			errorShow: false, // 展示错误信息
			checkContinue: true // 区间是否连续
		};
	},
	props: {
		selected: {
			// 被选中的指标
			type: Array,
			required: false,
			default: function () {
				return [];
			}
		},
		editable: {
			// 是否可编辑
			type: Boolean
		}
	},
	watch: {
		selected: {
			handler(v) {
				this.updateData(v);
			}
		}
	},
	computed: {
		...mapGetters('business', {
			sdValue: 'sdValue'
		})
	},
	created() {
		this.updateData(this.selected);
	},
	methods: {
		updateData(data) {
			// 时刻更新选中数据
			data.forEach((item, index) => {
				item.itemList.forEach((pro, i) => {
					this.tempValid[pro.id] = [
						'BHQJ_TREND',
						'minValue',
						'BHQJ_SIGN1',
						'BHQJ_SIGN2',
						'maxValue',
						'BHQJ_SIGN',
						'BHQJ_VALUE',
						'basePrice',
						'basePriceUnit',
						'weightMethod',
						'indicatorName'
					];
				});
				item.columns = getColumns('check', item.type, item.templateId);
				item.indexArr = getIndexName('check', item.type);
				if (item.itemList.length == 0) {
					this.addRow(0, item); // 新增一行
				} else {
					item.itemList.forEach((obj, index) => {
						// 回显数据
						if (obj.maxValue != null && obj.minValue != null) {
							obj.BHQJ_TREND = 1;
							obj.BHQJ_SIGN1 = obj.containMin ? 4 : 3;
							obj.BHQJ_SIGN2 = obj.containMax ? 4 : 3;
						} else {
							if (obj.maxValue != null) {
								obj.BHQJ_TREND = obj.containMax ? 5 : 4;
								obj.BHQJ_SIGN = obj.containMax ? 4 : 3;
								obj.BHQJ_VALUE = obj.maxValue;
							}
							if (obj.minValue != null) {
								obj.BHQJ_TREND = obj.containMin ? 3 : 2;
								obj.BHQJ_SIGN = obj.containMin ? 2 : 1;
								obj.BHQJ_VALUE = obj.minValue;
							}
						}
					});
				}
			});
		},
		//删除行
		removeRow(index, data) {
			data.splice(index, 1);
		},
		//添加行
		addRow(index = 0, item) {
			let items = item.itemList;
			let type = ''; // 获取参数名取值(2、8--硫分，3、9--水分，4、10--挥发分，5、11--灰分，6、12--灰熔点）
			if (item.type == 1) {
				type = 'rz';
			} else if (item.type == 2) {
				type = 'lf';
			} else if (item.type == 3) {
				type = 'sf';
			} else if (item.type == 4) {
				type = 'hff';
			} else if (item.type == 5) {
				type = 'hf';
			} else if (item.type == 6) {
				type = 'hrd';
			}
			let emptyRow = {
				id: new Date().getTime(),
				BHQJ_TREND: undefined,
				minValue: undefined,
				BHQJ_SIGN1: undefined,
				indicatorName: this.sdValue[type],
				maxValue: undefined,
				BHQJ_SIGN2: undefined,
				BHQJ_VALUE: undefined,
				BHQJ_SIGN: undefined,
				computeMethod: '',
				changeBase: '',
				changeRange: '',
				basePrice: undefined,
				basePriceUnit: undefined,
				priceChangeType: '',
				priceChangeAmount: '',
				priceChangeUnit: '',
				weightMethod: '',
				dirty: {
					//验证项是否验证标记（脏值）
					BHQJ_TREND: 1,
					minValue: 1,
					BHQJ_SIGN1: 1,
					indicatorName: 1,
					maxValue: 1,
					BHQJ_SIGN2: 1,
					BHQJ_VALUE: 1,
					BHQJ_SIGN: 1,
					weightMethod: 1,
					basePrice: 1,
					basePriceUnit: 1
				}
			};
			items.splice(index + 1, 0, emptyRow);
			this.tempValid[emptyRow.id] = JSON.parse(JSON.stringify(this.tempNeed));
		},
		checkMinMax(record) {
			// 校验最小值最大值
			let flag = Boolean(
				record.minValue &&
					record.maxValue &&
					(record.BHQJ_SIGN1 == 4 && record.BHQJ_SIGN2 == 4
						? Number(record.maxValue) < Number(record.minValue)
						: Number(record.maxValue) <= Number(record.minValue))
			);
			if (flag) {
				this.$message.error('请输入连续的区间值！');
				this.getFieldStatus('minValue', record, this.errorShow);
				this.getFieldStatus('maxValue', record, this.errorShow);
			}
			this.checkContinue = !flag;
		},
		//修改表单项脏值
		itemChange(name, record) {
			if (record.hasOwnProperty('dirty')) {
				record.dirty[name] = 0;
			}
			if (tempNum.indexOf(name) != -1) {
				let regst = /^\d+$|^\d*\.\d+$/g;
				if (record[name] && !regst.test(record[name])) {
					record[name] = null;
					this.$message.error('请输入大于等于0的数字');
				} else {
					if (name == 'minValue' || name == 'maxValue') {
						// 最大值最小值比较
						this.errorShow = true;
						this.checkMinMax(record);
					}
				}
			}
			if (name == 'BHQJ_SIGN1') {
				// 介于--左边符号
				this.checkMinMax(record);
				record.containMin = record.BHQJ_SIGN1 == 4 ? 1 : 0;
			} else if (name == 'BHQJ_SIGN2') {
				// 介于--右边符号
				this.checkMinMax(record);
				record.containMax = record.BHQJ_SIGN2 == 4 ? 1 : 0;
			} else if (name == 'BHQJ_VALUE') {
				// 非介于情况下，给最大、最小值赋值
				record.minValue = record.BHQJ_TREND == 2 || record.BHQJ_TREND == 3 ? record.BHQJ_VALUE : record.minValue;
				record.maxValue = record.BHQJ_TREND == 4 || record.BHQJ_TREND == 5 ? record.BHQJ_VALUE : record.maxValue;
			}
			this.$forceUpdate();
		},
		trendChange(record) {
			// 修改变化区间的大小符号
			record.minValue = null;
			record.maxValue = null;
			record.BHQJ_VALUE = null;
			record.containMin = record.BHQJ_TREND == 3 ? 1 : 0;
			record.containMax = record.BHQJ_TREND == 5 ? 1 : 0;
			record.BHQJ_SIGN1 = record.containMin ? 4 : 3;
			record.BHQJ_SIGN2 = record.containMax ? 4 : 3;
			record.BHQJ_SIGN = record.BHQJ_TREND - 1;
			this.$forceUpdate();
		},
		getFieldStatus(name, record, errorShow) {
			// 校验表格字段
			const validFn = {
				required() {
					// 必填校验
					return {
						validStatus: record[name] || record[name] === 0 ? 'success' : errorShow ? 'error' : ''
					};
				},
				check() {
					// 最大值最小值校验
					let flag = Boolean(
						record.minValue &&
							record.maxValue &&
							(record.BHQJ_SIGN1 == 4 && record.BHQJ_SIGN2 == 4
								? Number(record.maxValue) < Number(record.minValue)
								: Number(record.maxValue) <= Number(record.minValue))
					);
					return {
						validStatus: flag ? (errorShow ? 'error' : '') : 'success'
					};
				}
			};
			if (name == 'minValue' || name == 'maxValue') {
				this.checkContinue = !(record[name] && validFn['check']().validStatus && validFn['check']().validStatus != 'success'); // 最大值最小值取值不正确
				return validFn['required']().validStatus == 'success' ? validFn['check']() : validFn['required']();
			}
			let temp =
				record.changeRange != null && record.changeRange != undefined && record.changeRange != 0
					? JSON.parse(JSON.stringify(this.tempAll))
					: JSON.parse(JSON.stringify(this.tempValid[record.id])); // 当变化幅度不为0和空时，校验所有数据
			if (temp.indexOf(name) != -1) {
				if (validFn['required']) {
					if (record.dirty && record.dirty[name]) {
						return {
							validStatus: 'success'
						};
					} else {
						return validFn['required']();
					}
				}
			} else {
				return {
					validStatus: 'success'
				};
			}
		},
		save(flag) {
			// 外部父组件保存调用 errorShow-false不展示错误，true展示校验错误
			this.errorShow = flag;
			this.saveData = [];
			this.selected.forEach((item, index) => {
				item.itemList.forEach((project, index) => {
					project.dirty = {
						//验证项是否验证标记（脏值）
						BHQJ_TREND: 0,
						minValue: 0,
						BHQJ_SIGN1: 0,
						indicatorName: 0,
						maxValue: 0,
						BHQJ_SIGN2: 0,
						BHQJ_VALUE: 0,
						BHQJ_SIGN: 0,
						weightMethod: 0,
						basePrice: 0,
						basePriceUnit: 0
					};
					if ((item.type == 1 && project.templateId == 2) || item.type != 1) {
						// 热值模式2和非热值情况下不校验computeMethod
						delete project.computeMethod;
					}
				});
				item.itemList.type = item.type;
				item.itemList.templateId = item.templateId;
				this.saveData.push(item.itemList);
			});
			//服务项表单验证
			let isPass = true;
			for (let project of this.saveData) {
				for (let item of project) {
					if (project.type == 1) {
						item.indicatorName = 'Qnet,ar';
					}
					this.tempValid[item.id] =
						item.changeRange != null && item.changeRange != undefined && item.changeRange != 0
							? JSON.parse(JSON.stringify(this.tempAll))
							: JSON.parse(JSON.stringify(this.tempNeed));
					for (let x in item) {
						let bol =
							item.BHQJ_TREND == 1
								? x != 'BHQJ_VALUE' && x != 'BHQJ_SIGN'
								: x != 'BHQJ_SIGN1' && x != 'minValue' && x != 'BHQJ_SIGN2' && x != 'maxValue'; // 区分变化区间是介于还是非介于
						if (bol) {
							if (x == 'basePrice' || x == 'basePriceUnit') {
								if (project.type == 1 && (project.templateId == 2 || project.templateId == 3 || project.templateId == 4)) {
									if (this.getFieldStatus(x, item, this.errorShow).validStatus !== 'success') {
										isPass = false;
										break;
									}
								}
							} else {
								// 增减基准和价格增减额其中一项填写，另一项也必填写
								let need = ['priceChangeType', 'priceChangeAmount', 'priceChangeUnit', 'changeBase'];
								let priceChange = ['priceChangeType', 'priceChangeAmount', 'priceChangeUnit'];
								if (need.indexOf(x) != -1) {
									if (x == 'changeBase') {
										let priceChangeAllFlag = true; // 增减额字段均有值
										priceChange.forEach(element => {
											if (item[element]) {
											} else {
												priceChangeAllFlag = false;
											}
										});
										if ((item['changeRange'] && Number(item['changeRange']) !== 0) || item['changeBase'] || priceChangeAllFlag) {
											// 变化幅度不为0或空，增减基准本身有值，增减额均有值时，必校验
											if (this.tempValid[item.id].indexOf(x) == -1) {
												// 字段不包含
												this.tempValid[item.id].push('changeBase');
											}
											if (this.getFieldStatus(x, item, this.errorShow).validStatus !== 'success') {
												isPass = false;
												break;
											}
										} else {
											// 不校验
											if (this.tempValid[item.id].indexOf(x) != -1) {
												// 包含字段则去除
												this.tempValid[item.id].forEach((ele, i) => {
													if (ele == x) {
														this.tempValid[item.id].splice(i, 1);
													}
												});
											}
										}
									} else {
										let priceChangeHasFlag = false; // 增减额字段至少有一个值
										priceChange.forEach(element => {
											if (item[element]) {
												priceChangeHasFlag = true;
											}
										});
										if ((item['changeRange'] && Number(item['changeRange']) !== 0) || item['changeBase'] || priceChangeHasFlag) {
											// 变化幅度不为0或空，增减基准有值，有值 必校验
											priceChange.forEach(element => {
												if (this.tempValid[item.id].indexOf(element) == -1) {
													// 字段不包含
													this.tempValid[item.id].push(element);
												}
												if (this.getFieldStatus(element, item, this.errorShow).validStatus !== 'success') {
													isPass = false;
												}
											});
											if (!isPass) break;
										} else {
											priceChange.forEach(element => {
												if (this.tempValid[item.id].indexOf(element) != -1) {
													// 字段包含需去除
													this.tempValid[item.id].forEach((ele, i) => {
														if (ele == element) {
															this.tempValid[item.id].splice(i, 1);
														}
													});
												}
											});
										}
									}
								} else {
									if (this.getFieldStatus(x, item, this.errorShow).validStatus !== 'success') {
										isPass = false;
										break;
									}
								}
							}
						}
					}
				}
			}

			this.saveData = JSON.parse(JSON.stringify(this.selected));
			this.saveData.forEach((item, index) => {
				let obj = item;
				delete obj.columns;
				delete obj.indexArr;
				obj.itemList.forEach((project, index) => {
					delete project.BHQJ_SIGN;
					delete project.BHQJ_SIGN1;
					delete project.BHQJ_SIGN2;
					delete project.BHQJ_TREND;
					delete project.BHQJ_VALUE;
					delete project.dirty;
				});
			});
			return {
				data: this.saveData,
				isPass: isPass,
				errorMsg: this.checkContinue
					? '该订单信息中勾选的考核指标对应的区间值未录入完整，请修改并补充完整订单信息！'
					: '请输入连续的区间值！'
			};
		}
	}
};
</script>

<style lang="less" scoped>
::v-deep form {
	.ant-input-number-handler-wrap {
		z-index: 0;
	}
}
::v-deep.ant-table {
	margin-bottom: 20px;
	.ant-table-thead {
		th {
			font-weight: bold;
		}
	}
	.ant-table-tbody {
		tr {
			td {
				padding: 12px 10px;
			}
			td:first-child {
				padding: 12px 0;
			}
		}
	}
	.actionBtn {
		display: inline-block;
		color: #0053db;
		font-size: 14px;
		margin-left: 10px;
		cursor: pointer;
	}
	.ant-select-selection,
	.ant-input {
		border-radius: 2px;
	}
	.ant-select-selection-selected-value {
		margin-left: 6px;
	}
	.ant-input {
		padding: 4px;
	}
	.ant-select {
		.ant-select-selection__rendered {
			margin-left: 6px;
			margin-right: 12px;
		}
		.ant-select-arrow {
			right: 4px;
		}
		.ant-select-selection-selected-value {
			margin-left: 0;
		}
	}
	.ant-select.more {
		.ant-select-selection__rendered {
			margin-left: 12px;
		}
	}
	.ant-select-selection__clear {
		right: 3px;
	}
	.ant-table-fixed-right {
		z-index: 10;
	}
}
::v-deep.ant-btn-icon-only {
	width: 26px;
	height: 26px;
}
.checkForm {
	margin-bottom: 20px;
	.ant-row {
		display: inline-block;
		margin-bottom: 0;
	}
	.contentRZ {
		width: 90px !important;
	}
	::v-deep.ant-table-wrapper.disabled {
		.ant-table-fixed-right,
		.ant-table-fixed-columns-in-body {
			display: none;
		}
	}
}
</style>
