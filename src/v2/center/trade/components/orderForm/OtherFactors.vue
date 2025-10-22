<template>
	<div class="otherForm">
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
							v-model="record.BHQJ_TREND"
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
								v-model="record.minValue"
								:disabled="!editable"
								:key="record.id"
								@blur="itemChange('minValue', record)"
							></a-input>
						</a-form-item>
						<a-form-item :validate-status="getFieldStatus('BHQJ_SIGN1', record, errorShow).validStatus">
							<a-select
								v-model="record.BHQJ_SIGN1"
								style="margin-right: 2px; width: 44px"
								:disabled="!editable"
								@blur="itemChange('BHQJ_SIGN1', record)"
								:showArrow="editable"
							>
								<a-select-option :value="3">&lt;</a-select-option>
								<a-select-option :value="4">&lt;=</a-select-option>
							</a-select>
						</a-form-item>
						<a-form-item v-if="item.type == 7">
							<span style="display: inline-block; margin-right: 2px">Qnet,ar</span>
						</a-form-item>
						<a-form-item v-else>
							<a-select
								style="width: 72px; margin-right: 2px"
								:defaultValue="1"
								:disabled="!editable"
								v-model="record.indicatorName"
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
								v-model="record.BHQJ_SIGN2"
								:disabled="!editable"
								@blur="itemChange('BHQJ_SIGN2', record)"
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
								v-model="record.maxValue"
								:disabled="!editable"
								@blur="itemChange('maxValue', record)"
							></a-input>
						</a-form-item>
					</template>
					<template v-if="record.BHQJ_TREND != 1 && record.BHQJ_TREND != undefined">
						<a-form-item v-if="item.type == 7">
							<span style="display: inline-block; margin-right: 2px">Qnet,ar</span>
						</a-form-item>
						<a-form-item v-else>
							<a-select
								style="width: 72px; margin-right: 2px"
								:defaultValue="1"
								:disabled="!editable"
								v-model="record.indicatorName"
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
								v-model="record.BHQJ_SIGN"
								disabled
								@blur="itemChange('BHQJ_SIGN', record)"
								:showArrow="editable"
								style="width: 44px; margin-right: 2px"
							>
								<a-select-option :value="1">&gt;</a-select-option>
								<a-select-option :value="2">&gt;=</a-select-option>
								<a-select-option :value="3">&lt;</a-select-option>
								<a-select-option :value="4">&lt;=</a-select-option>
							</a-select>
						</a-form-item>
						<a-form-item
							:validate-status="getFieldStatus('BHQJ_VALUE', record, errorShow).validStatus"
							style="width: 44px"
						>
							<a-input
								v-model="record.BHQJ_VALUE"
								:disabled="!editable"
								@blur="itemChange('BHQJ_VALUE', record)"
							></a-input>
						</a-form-item>
					</template>
				</template>
				<!-- 增扣金额-->
				<template
					slot="priceChange"
					slot-scope="text, record, index"
				>
					<a-form-item :validate-status="getFieldStatus('priceChangeType', record, errorShow).validStatus">
						<a-select
							v-model="record.priceChangeType"
							class="more"
							style="width: 60px; margin-right: 2px"
							:disabled="!editable"
							@blur="itemChange('priceChangeType', record)"
							:showArrow="editable"
						>
							<a-select-option :value="1">增</a-select-option>
							<a-select-option :value="2">扣</a-select-option>
						</a-select>
					</a-form-item>
					<a-form-item :validate-status="getFieldStatus('priceChangeAmount', record, errorShow).validStatus">
						<a-input
							v-model="record.priceChangeAmount"
							style="width: 80px"
							:disabled="!editable"
							@blur="itemChange('priceChangeAmount', record)"
						></a-input>
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
const temp1 = [
	'BHQJ_TREND',
	'minValue',
	'BHQJ_SIGN1',
	'BHQJ_SIGN2',
	'maxValue',
	'BHQJ_SIGN',
	'BHQJ_VALUE',
	'priceChangeType',
	'priceChangeAmount',
	'indicatorName'
]; //全部字段
const tempNum = ['minValue', 'maxValue', 'BHQJ_VALUE', 'priceChangeAmount']; // 输入框校验数字大于等于0
import { getColumns, getIndexName } from '@/v2/utils/order/checkIndex.js';
import { mapGetters } from 'vuex';
export default {
	name: 'OtherForm',
	data() {
		return {
			indexArr: [], // 内容参数名
			form: this.$form.createForm(this, { name: 'form' }),
			temp1,
			tempNum,
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
				item.columns = getColumns('other', item.type, item.templateId);
				item.indexArr = getIndexName('other', item.type);
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
			if (item.type == 7) {
				type = 'rz';
			} else if (item.type == 8) {
				type = 'lf';
			} else if (item.type == 9) {
				type = 'sf';
			} else if (item.type == 10) {
				type = 'hff';
			} else if (item.type == 11) {
				type = 'hf';
			} else if (item.type == 12) {
				type = 'hrd';
			}
			let emptyRow = {
				id: new Date().getTime(),
				BHQJ_TREND: undefined,
				minValue: undefined,
				BHQJ_SIGN1: undefined,
				BHQJ_NAME: 1,
				indicatorName: this.sdValue[type],
				maxValue: undefined,
				BHQJ_SIGN2: undefined,
				BHQJ_VALUE: undefined,
				BHQJ_SIGN: undefined,
				priceChangeType: undefined,
				priceChangeAmount: undefined,
				dirty: {
					//验证项是否验证标记（脏值）
					BHQJ_TREND: 1,
					minValue: 1,
					BHQJ_SIGN1: 1,
					BHQJ_NAME: 1,
					maxValue: 1,
					BHQJ_SIGN2: 1,
					BHQJ_VALUE: 1,
					BHQJ_SIGN: 1,
					priceChangeType: 1,
					priceChangeAmount: 1,
					indicatorName: ''
				}
			};
			items.splice(index + 1, 0, emptyRow);
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
				this.checkContinue = false;
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
				this.checkContinue = !(record[name] && validFn['check']().validStatus && validFn['check']().validStatus != 'success');
				return validFn['required']().validStatus == 'success' ? validFn['check']() : validFn['required']();
			}
			if (temp1.indexOf(name) != -1) {
				if (validFn['required']) {
					if (record.dirty && record.dirty[name]) {
						return {
							validStatus: 'success',
							msg: ''
						};
					} else {
						return validFn['required']();
					}
				}
			} else {
				return {
					validStatus: 'success',
					msg: ''
				};
			}
		},
		save(errorShow) {
			// 外部父组件保存调用 errorShow-false不展示错误，true展示校验错误
			this.errorShow = errorShow;
			this.saveData = [];
			this.selected.forEach((item, index) => {
				item.itemList.forEach((project, index) => {
					project.dirty = {
						//验证项是否验证标记（脏值）
						BHQJ_TREND: 0,
						minValue: 0,
						BHQJ_SIGN1: 0,
						BHQJ_NAME: 0,
						maxValue: 0,
						BHQJ_SIGN2: 0,
						BHQJ_VALUE: 0,
						BHQJ_SIGN: 0,
						priceChangeType: 0,
						priceChangeAmount: 0,
						indicatorName: 0
					};
				});
				item.itemList.type = item.type;
				item.itemList.templateId = item.templateId;
				this.saveData.push(item.itemList);
			});
			//服务项表单验证
			let isPass = true;
			for (let project of this.saveData) {
				for (let item of project) {
					if (project.type == 7) {
						item.indicatorName = 'Qnet,ar';
					}
					for (let x in item) {
						let bol =
							item.BHQJ_TREND == 1
								? x != 'BHQJ_VALUE' && x != 'BHQJ_SIGN'
								: x != 'BHQJ_SIGN1' && x != 'minValue' && x != 'BHQJ_SIGN2' && x != 'maxValue'; // 区分变化区间是介于还是非介于
						if (bol) {
							if (this.getFieldStatus(x, item, this.errorShow).validStatus !== 'success') {
								isPass = false;
								break;
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
	.more .ant-select-selection-selected-value {
		margin-left: 12px;
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
	::v-deep.ant-select-dropdown-menu-item {
		padding: 5px 8px;
	}
	.ant-input {
		padding: 4px;
	}
}
::v-deep.ant-btn-icon-only {
	width: 26px;
	height: 26px;
}
.otherForm {
	width: 80%;
	margin: 0 auto 20px;
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
	.actionBtn {
		display: inline-block;
		color: #0053db;
		font-size: 14px;
		margin-left: 10px;
		cursor: pointer;
	}
}
</style>
