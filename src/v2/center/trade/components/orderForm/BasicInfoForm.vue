<template>
	<a-row>
		<h3
			v-show="!noHeader"
			style="margin: 30px 0"
			@click="isClick = true"
		>
			基准质量指标
		</h3>
		<div v-if="isClick">
			<a-form
				:form="qualityForm"
				:label-col="{ span: 9 }"
				:wrapper-col="{ span: 15 }"
			>
				<a-row>
					<template v-for="(item, index) in baseNumData">
						<a-col
							:span="12"
							:key="index"
							v-show="
								(VUEX_ST_ORDERCREATEINFO.flag == 'submit' && (item.firstData || item.lastData || item.data)) ||
								(VUEX_ST_ORDERCREATEINFO.flag != 'submit' && (item.show || isLoad))
							"
						>
							<a-form-item
								:label="item.label"
								v-if="item.type == 'range'"
								class="range"
							>
								<a-col span="10">
									<a-form-item
										style="margin-bottom: -20px"
										class="range-inner"
									>
										<a-input-number
											:disabled="disabled"
											:placeholder="noPlaceHolder ? '' : item.placeholder"
											style="width: 100%"
											step="1"
											v-decorator="[
												`${item.first_value}`,
												{
													rules: [{ validator: validateIndex, orignItem: item }],
													validateTrigger: 'blur'
												}
											]"
										/>
									</a-form-item>
								</a-col>
								<a-col
									span="4"
									style="text-align: center"
									>至</a-col
								>
								<a-col span="10">
									<a-form-item
										style="margin-bottom: -20px"
										class="range-inner"
									>
										<a-input-number
											:disabled="disabled"
											:placeholder="noPlaceHolder ? '' : item.placeholder"
											style="width: 100%"
											v-decorator="[
												`${item.last_value}`,
												{
													rules: [{ validator: validateIndex, orignItem: item }],
													validateTrigger: 'blur'
												}
											]"
										/>
									</a-form-item>
								</a-col>
							</a-form-item>
							<a-form-item
								:label="item.label"
								v-if="item.type == 'number'"
							>
								<div style="display: flex">
									<a-form-item style="margin-bottom: -20px; margin-right: 10px">
										<a-select
											v-if="item.symbol"
											placeholder="请选择"
											style="width: 55px"
											v-decorator="[
												`${item.value}3`,
												{
													rules: [{ retuire: true }],
													validateTrigger: 'change'
												}
											]"
											:showArrow="!disabled"
											:disabled="disabled"
										>
											<a-select-option
												:value="item"
												v-for="(item, index) in item.symbolList.split(',')"
												:key="index"
												>{{ item }}</a-select-option
											>
										</a-select>
									</a-form-item>
									<a-form-item style="margin-bottom: -20px; width: 100%">
										<a-input-number
											:disabled="disabled"
											:placeholder="noPlaceHolder ? '' : item.placeholder"
											style="width: 100%"
											step="1"
											@change="sdvalChange"
											v-decorator="[
												`${item.value}`,
												{
													rules: [{ validator: validateIndex, orignItem: item }],
													validateTrigger: 'blur'
												}
											]"
										/>
									</a-form-item>
								</div>
							</a-form-item>
						</a-col>
					</template>
				</a-row>
			</a-form>
			<a-row
				type="flex"
				justify="end"
				v-if="!noExpand"
				><a-button
					type="primary"
					@click="isLoad = !isLoad"
					>{{ isLoad ? '收起' : '展开' }}</a-button
				></a-row
			>
		</div>
	</a-row>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex';
import { getVal } from '@/v2/utils/order/checkVal.js';

export default {
	data() {
		return {
			qualityForm: this.$form.createForm(this),
			isLoad: this.noExpand,
			isClick: true
		};
	},
	props: ['baseNumData', 'disabled', 'noPlaceHolder', 'noExpand', 'noHeader'],
	computed: {
		...mapGetters('order', {
			VUEX_ST_ORDERCREATEINFO: 'VUEX_ST_ORDERCREATEINFO'
		})
	},
	watch: {
		baseNumData: function (data) {
			// 给符号赋值初始化
			if (data && data.length > 0) {
				for (let i = 0; i < data.length; i++) {
					if (data[i].symbol) {
						let name = data[i].value + '3';
						this.$nextTick(() => {
							setTimeout(() => {
								this.qualityForm.setFieldsValue({
									[(() => name)()]: data[i].symbol
								});
							});
						});
					}
				}
			}
		}
	},
	mounted() {},
	methods: {
		...mapMutations({
			VUEX_setSDVALUE: 'business/VUEX_setSDVALUE'
		}),
		setBasicInfoFormData(productIndicator) {
			this.$nextTick(() => {
				setTimeout(() => {
					this.qualityForm.setFieldsValue(productIndicator);
					this.sdvalChange();
				}, 1000);
			});
		},
		sdvalChange() {
			this.VUEX_setSDVALUE(getVal(this.qualityForm.getFieldsValue()));
		},
		validateIndex(rule, value, callback) {
			// 配置了错误信息的逻辑 走这里

			if (rule.orignItem && rule.orignItem.errorStr) {
				if (rule.orignItem.type == 'number') {
					// 数值类型
					if (value) {
						let int = rule.orignItem.int ? !this.ifInt(value) : false;
						if (!this.ifRange(value, rule.orignItem.min, rule.orignItem.max, rule.orignItem.decimalPlace) || int) {
							callback(rule.orignItem.errorStr);
						}
					}
				} else if (rule.orignItem.type == 'range') {
					// 区间值类型
					if (value) {
						let checkIsFirst = rule.field == rule.orignItem.first_value; // 判断当前的值是前还是后
						let max = checkIsFirst ? rule.orignItem.first.max : rule.orignItem.last.max; // 取区间值的最大和最小
						let min = checkIsFirst ? rule.orignItem.first.min : rule.orignItem.last.min; // 取区间值的最大和最小
						let int = rule.orignItem.int ? !this.ifInt(value) : false;
						let checkFit =
							this.qualityForm.getFieldValue(rule.orignItem.first_value) &&
							this.qualityForm.getFieldValue(rule.orignItem.last_value); // 判断是否校验前后值
						let fit = checkFit ? !this.ifFit1(rule.orignItem) : false;
						if (int || !this.ifRange(value, min, max) || fit) {
							callback(rule.orignItem.errorStr);
						} else {
							if (!checkIsFirst) {
								this.qualityForm.setFields({
									[rule.orignItem.first_value]: {
										value: this.qualityForm.getFieldValue(rule.orignItem.first_value),
										errors: null
									}
								});
							} else {
								this.qualityForm.setFields({
									[rule.orignItem.last_value]: {
										value: this.qualityForm.getFieldValue(rule.orignItem.last_value),
										errors: null
									}
								});
							}
						}
					}
				}

				callback();
			}
			callback();
		},
		ifInt(value) {
			if (/^([1-9]\d*|[0]{1,1})$/.test(value)) {
				return true;
			} else {
				return false;
			}
		},
		ifRange(value, value1, value2, decimalPlace) {
			// 最多两位小数
			let reg = /^(\d+)(.\d{0,2})?$/;
			// 最多四位小数
			if (decimalPlace == 4) {
				reg = /^(\d+)(.\d{0,4})?$/;
			}
			if (!reg.test(value)) return false;
			if (value >= value1 && value <= value2) {
				return true;
			} else {
				return false;
			}
		},
		ifFit1(item) {
			if (
				parseFloat(this.qualityForm.getFieldValue(item.last_value)) > parseFloat(this.qualityForm.getFieldValue(item.first_value))
			) {
				return true;
			}
			return false;
		}
	}
};
</script>
<style lang="stylus" scoped>
h3 {
  font-size: 18px;
}

.s-form {
  margin-bottom: 24px;
  height: 40px;
  line-height: 40px;

  .s-label {
    text-align: right;
    padding-right: 10px;
    font-size: 14px;
  }
}
</style>
