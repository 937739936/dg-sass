<template>
	<!-- -->
	<div v-if="items.style.display == 'block'">
		<!-- "input" 类型  -->
		<a-form-item
			label=""
			:colon="false"
			v-if="items.widget == 'input'"
		>
			<template v-if="items.label != 'basePriceDesc'">
				<a-input
					:maxLength="items.maxLength"
					:placeholder="items.placeholder"
					@blur="e => getNewInfo(e, items, items.label)"
					v-decorator="[
						items.label,
						{ rules: [{ required: items.required, whitespace: true, message: `${items.title}必填` }, { validator }] }
					]"
					style="width: 100%"
				/>
			</template>

			<template v-else>
				<a-tooltip
					placement="topLeft"
					:visible="priceShow && !!unit"
				>
					<template slot="title">
						{{ unit }}
					</template>
					<div class="columns-title">
						<a-input-number
							:min="0.01"
							:max="9999.99"
							@focus="showPrice"
							@change="showPrice"
							:precision="2"
							@blur="e => getNewInfo(e, items, items.label)"
							:placeholder="items.placeholder"
							v-decorator="[items.label, { rules: [{ required: items.required, message: `${items.title}必填` }, { validator }] }]"
							style="flex: 1"
						/>
						<!-- 基准价格显示 后缀 -->
						<span style="line-height: 40px; margin-left: 10px"> 元/吨 </span>
					</div>
				</a-tooltip>
			</template>
		</a-form-item>

		<a-form-item
			label=""
			:colon="false"
			v-if="items.widget == 'input-number'"
		>
			<a-tooltip
				placement="topLeft"
				:visible="priceShow && !!unit"
			>
				<template slot="title">
					{{ unit }}
				</template>
				<div class="columns-title">
					<a-input-number
						:min="items.min"
						:max="items.max"
						@focus="showPrice"
						@change="showPrice"
						:precision="items.precision"
						@blur="e => getNewInfo(e, items, items.label)"
						:placeholder="items.placeholder"
						v-decorator="[items.label, { rules: [{ required: items.required, message: `${items.title}必填` }, { validator }] }]"
						style="flex: 1"
					/>
					<!-- 基准价格显示 后缀 -->
					<span
						v-if="items.label === 'basePrice'"
						style="line-height: 40px; margin-left: 10px"
					>
						元/吨
					</span>
				</div>
			</a-tooltip>
		</a-form-item>

		<div
			v-if="items.widget == 'input-quality'"
			class="columns-title"
		>
			<div
				v-for="(child, index) in items.list"
				:key="index"
				class="columns-title"
			>
				<a-form-item
					style="flex: 1"
					label=""
					:colon="false"
				>
					<a-tooltip
						placement="topLeft"
						:visible="priceShow && !!unit && index == 0"
					>
						<template slot="title">
							{{ unit }}
						</template>
						<a-input-number
							:placeholder="child.placeholder"
							@focus="showPrice"
							@change="showPrice"
							:min="child.min"
							@blur="e => getNewInfo(e, items, items.label)"
							v-if="child.widget == 'input-quality'"
							:precision="child.precision"
							:max="child.max"
							v-decorator="[child.label, { rules: [{ required: child.required, message: `${child.title}必填` }, { validator }] }]"
						/>
					</a-tooltip>
				</a-form-item>

				<span
					v-if="index == 0"
					style="line-height: 40px; margin: 0 10px"
				>
					吨 +/-
				</span>

				<a-form-item
					label=""
					:colon="false"
					style="width: 88px"
					v-if="index !== 0"
				>
					<a-input-number
						@blur="e => getNewQualityInfo(e, child, child.label, items)"
						:min="child.min"
						:placeholder="child.placeholder"
						:precision="child.precision"
						:max="child.max"
						v-decorator="[child.label, { rules: [{ required: child.required, message: child.placeholder }] }]"
					/>
				</a-form-item>

				<span
					style="margin-left: 10px"
					v-if="index !== 0"
					>%</span
				>
			</div>
		</div>
		<div v-if="items.widget === 'select' && items.label != 'transportMode'">
			<a-form-item
				label=""
				:colon="false"
			>
				<a-select
					:placeholder="items.placeholder"
					@change="e => changeSpecial(e, items)"
					v-decorator="[
						items.label,
						{
							rules: [{ required: items.required, message: `${items.title}必填` }, { validator }],
							validateTrigger: 'change'
						}
					]"
				>
					<a-select-option
						v-for="(j, index) in items.options"
						:key="index"
						:value="j.value"
					>
						{{ j.label }}
					</a-select-option>
				</a-select>
			</a-form-item>
		</div>
		<div v-if="otherInfo[CHANGE_MAP_OTHER[items.label]] && !transportMode">
			<a-form-item
				style="margin-top: 10px"
				label=""
				:colon="false"
			>
				<a-input
					:maxLength="otherInfo[CHANGE_MAP_OTHER[items.label]].maxLength"
					@blur="
						e =>
							getNewQualityInfo(
								e,
								otherInfo[CHANGE_MAP_OTHER[items.label]],
								otherInfo[CHANGE_MAP_OTHER[items.label]].label,
								items
							)
					"
					:placeholder="otherInfo[CHANGE_MAP_OTHER[items.label]].placeholder"
					v-decorator="[
						otherInfo[CHANGE_MAP_OTHER[items.label]].label,
						{
							rules: [
								{
									whitespace: true,
									required: otherInfo[CHANGE_MAP_OTHER[items.label]].required,
									message: `${otherInfo[CHANGE_MAP_OTHER[items.label]].title}必填`
								},
								{ validator }
							]
						}
					]"
					style="width: 100%"
				/>
			</a-form-item>
		</div>

		<a-form-item
			label=""
			:colon="false"
			v-if="items.widget === 'input-search'"
		>
			<a-select
				:placeholder="items.placeholder"
				showSearch
				:showArrow="false"
				mode="multiple"
				class="input-search"
				:filterOption="false"
				@search="fetchPlace"
				@focus="placeData = null"
				@change="e => changeNewInfo(e, items, items.label)"
				:notFoundContent="placeData ? '暂无数据' : ''"
				:defaultActiveFirstOption="false"
				v-decorator="[
					items.label,
					{
						rules: [{ required: true, message: `${items.title}必填` }, { validator }],
						validateTrigger: 'change'
					}
				]"
			>
				<a-select-option
					v-for="(j, index) in placeData"
					:key="index"
					:value="j.name"
				>
					{{ j.name }}
				</a-select-option>
			</a-select>
		</a-form-item>

		<a-form-item
			label=""
			:colon="false"
			v-if="items.widget === 'select-multiple'"
		>
			<a-select
				mode="tags"
				:placeholder="items.placeholder || '请输入'"
				:filterOption="false"
				@change="e => changeNewInfo(e, items, items.label)"
				:defaultActiveFirstOption="false"
				style="width: 100%"
				v-decorator="[
					items.label,
					{
						rules: [{ required: items.required, message: `${items.title}必填` }, { validator }],
						validateTrigger: 'change'
					}
				]"
			>
			</a-select>
		</a-form-item>

		<a-form-item
			class="form-item-normal select-bank"
			v-if="items.widget === 'select-bank'"
		>
			<a-select
				class="item"
				:notFoundContent="!items.optionsBank || !items.optionsBank.length ? '加载中...' : null"
				:placeholder="items.placeholder"
				@change="e => changeNewInfo(e, items, items.label)"
				v-decorator="[items.label, { rules: [{ required: items.required, message: `${items.title}必填` }, { validator }] }]"
			>
				<a-select-option
					v-for="bank in items.optionsBank"
					:key="bank.accountNo"
					:value="bank.id"
				>
					<p class="select-bank-content">{{ bank.bankName }}/{{ bank.accountTypeText }}</p>
					<p class="select-bank-content small">{{ bank.accountNo }}</p>
				</a-select-option>
			</a-select>
		</a-form-item>

		<a-form-item
			label=""
			:colon="false"
			v-if="items.widget == 'range-picker'"
		>
			<a-range-picker
				class="item"
				v-bind="items"
				:allowClear="false"
				@change="e => changeNewInfo(e, items, items.label)"
				:showTime="items.showTime ? Boolean(+items.showTime) : false"
				format="YYYY-MM-DD"
				v-decorator="[items.label, { rules: [{ required: items.required, message: `${items.title}必填` }, { validator }] }]"
			/>
			<span
				slot="extra"
				v-if="execDateDevMax || execDateLengthMax"
			>
				<span v-if="execDateDevMax"> 交货期限与当前系统日期偏差较多，请确认合同有效期是否无误，如果正确，请忽略提示。 </span>
				<span v-if="execDateLengthMax"> 交货期限过长，请确定是否填写无误，如果正确，请忽略提示。 </span>
			</span>
		</a-form-item>
	</div>
</template>

<script>
import moment from 'moment';
import { debounce, delay } from 'lodash';

const CHANGE_MAP_OTHER = {
	transportResponsibility: 'transportResponsibilityOther', // 运输负责方
	deliveryMode: 'deliveryGoodsClause', // 交货方式
	freightPayMode: 'freightPayModeOther' // 运费支付方式
};
import { API_STATION } from '@/v2/center/trade/api/contract';
import Template from '@/v2/center/steels/views/takeGoods/order/template.vue';

export default {
	props: {
		items: {
			default: () => {
				return {};
			}
		},
		contractDetail: {
			default: () => {
				return {};
			}
		},
		transportMode: {
			default: ''
		}
	},

	data() {
		return {
			transportModeItem: [],
			placeData: [],
			otherInfo: {},
			CHANGE_MAP_OTHER,
			priceShow: false,
			unit: '',
			execDateDevMax: false, //合同有效期偏差较大时展示
			execDateLengthMax: false //合同有效期偏差较大时展示
		};
	},
	computed: {
		formList() {
			return this.$store.state.supple.formList['transportation'];
		},
		tplInfo() {
			return this.$store.state.supple.tplInfo;
		}
	},
	watch: {
		items: {
			handler(info) {
				if (CHANGE_MAP_OTHER[info.label]) {
					/** 获取 value */

					const itemDetails = info.changeItem?.itemDetails || [];

					const item = itemDetails.find(el => el.itemName == info.label) || {};

					if (item.value) {
						this.changeSpecial(item.value, info);
					}
				}
				/** 重置 交货方式 */

				if (info.label == 'deliveryMode' && !this.transportMode) {
					this.changeTransportMode(this.contractDetail.transportMode);
				}
			},
			deep: true,
			immediate: true
		},
		transportMode: {
			handler(val) {
				this.changeTransportMode(val);
			},
			deep: true,
			immediate: true
		}
	},
	methods: {
		validator(rule, value, callback) {
			this.$emit('validator', rule, value, callback, this.transportMode);
		},
		fetchPlace: debounce(function (data) {
			if (!data) {
				return;
			}
			API_STATION({
				keywords: encodeURIComponent(data)
			}).then(res => {
				if (res.code != 200) {
					this.$message.error(res.message);
					return;
				}
				this.placeData = res.result;
			});
		}, 300),

		changeSpecial(val, item) {
			const key = CHANGE_MAP_OTHER[item.label];

			this.otherInfo[key] = null;

			if (['其他', 'OTHER'].includes(val) && key) {
				const otherItem = this.formList.find(el => el.label == key);
				/** 如果是 在运输方式里面 */
				/** 把对应的formlist 的 display 调成 block */
				if (this.transportMode) {
					otherItem.style.display = 'block';
				} else {
					const item = this.formList.find(el => el.label == key);

					const obj = { ...item };

					// obj.style.display = 'block'

					this.otherInfo[key] = obj;
				}
			} else {
				const otherItem = this.formList.find(el => el.label == key);
				if (otherItem) {
					otherItem.style.display = 'none';
				}
			}
			this.changeNewInfo(val, item, item.label);
		},
		getNewInfo(e, items, key) {
			this.priceShow = false;

			this.$emit('blur', e, items, key);
		},
		getNewQualityInfo(e, child, key, items) {
			this.$emit('quality', e, child, key, items);
		},
		changeNewInfo(e, items, key) {
			if (key == 'deliveryDate') {
				if (Math.abs(moment(e[0]).diff(moment(), 'days')) > 30 || Math.abs(moment(e[1]).diff(moment(), 'days')) > 30) {
					this.execDateDevMax = true;
				} else {
					this.execDateDevMax = false;
				}
				if (moment(e[1]).diff(moment(e[0]), 'days') > 60) {
					this.execDateLengthMax = true;
				} else {
					this.execDateLengthMax = false;
				}
			}

			this.$emit('change', e, items, key);
		},
		computeUnit(val) {
			this.unit = '';
			if (val >= 1000 && val < 10000) {
				this.unit = '千';
			} else if (val > 10000 && val <= 100000) {
				this.unit = '万';
			} else if (val > 100000 && val <= 1000000) {
				this.unit = '十万';
			} else if (val > 1000000 && val <= 10000000) {
				this.unit = '百万';
			} else if (val > 10000000 && val <= 100000000) {
				this.unit = '千万';
			} else if (val > 100000000 && val <= 1000000000) {
				this.unit = '亿';
			} else if (val > 1000000000 && val <= 10000000000) {
				this.unit = '十亿';
			} else if (val > 10000000000) {
				this.unit = '百亿';
			}
		},
		showPrice(e) {
			if (!e) {
				this.priceShow = false;
				this.unit = '';
				return;
			}
			const value = e.target ? e.target.value : e;
			this.priceShow = true;
			this.computeUnit(value);
		},
		changeTransportMode(val) {
			const optList = this.tplInfo.transportMode;
			const obj = this.tplInfo.transportMode.find(el => el.value == val) || {};
			if (this.items.label == 'deliveryMode' && val) {
				this.items.options = obj.deliveryMode;
			}
		},
		getOptList() {}
	},
	components: {
		Template
	}
};
</script>

<style scoped lang="less">
.columns-title {
	display: flex;
	align-items: center;
}
.form-item-normal {
	// width: 364px;
	// height: 82px;
	margin-bottom: 0;
	padding-bottom: 0;
}
.select-bank {
	margin-bottom: 0px !important;
	::v-deep.ant-select-selection__rendered {
		height: 56px;
		padding: 8px 0;
	}
	::v-deep.ant-select-dropdown {
		.ant-select-dropdown-menu {
			padding: 0 !important;
			.ant-select-dropdown-menu-item {
				height: 64px;
				padding: 10px 12px !important;
			}
			.select-bank-content.small {
				font-size: 14px;
				zoom: 0.85;
				color: rgba(0, 0, 0, 0.4);
				margin-top: 8px;
			}
		}
	}
	.select-bank-content {
		height: 20px;
		line-height: 20px;
		font-family: 'PingFang SC';
		font-weight: 400;
		font-size: 14px;
		color: rgba(0, 0, 0, 0.8);
	}
	.select-bank-content.small {
		font-size: 14px;
		zoom: 0.85;
		color: rgba(0, 0, 0, 0.4);
		margin-top: 2px;
	}
	::v-deep.ant-select-selection {
		height: 56px;
	}
}
/deep/ .input-search .ant-select-selection {
	height: inherit;
}
/deep/ .ant-select-selection {
	height: inherit;
}
/deep/ .ant-input {
	background: #fff;
}
</style>
