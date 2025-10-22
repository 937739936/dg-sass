<template>
	<div>
		<div
			class="slTitleAssis"
			style="margin-top: 0px"
		>
			补协签订日期
		</div>
		<a-form
			ref="ruleForm"
			class="slFormDetail"
			:form="form"
			:colon="false"
		>
			<a-row>
				<a-form-item
					label="补协签订日期"
					:colon="false"
					prop="signDate"
				>
					<a-date-picker
						style="width: 364px"
						:getPopupContainer="getPopupContainer"
						:allowClear="false"
						@change="handleSignDate"
						v-decorator="[
							`signDate`,
							{
								rules: [{ required: true, message: '请选择补协签订日期' }, { validator: validatorDate }]
							}
						]"
						format="YYYY-MM-DD"
						valueFormat="YYYY-MM-DD"
					>
						<span
							slot="suffixIcon"
							class="calendar"
						></span>
					</a-date-picker>
					<!-- 签订日期不能小于”YYYYMMDD“ -->

					<div
						slot="extra"
						v-if="contractSignTimeDevMax"
					>
						<p v-if="contractSignTimeDevMax">补协签订日期与当前日期偏差较多，如果实际如此，请忽略提示</p>
					</div>
				</a-form-item>
			</a-row>
			<div
				class="slTitleAssis"
				style="margin-bottom: 30px; margin-top: 6px"
			>
				对原合同价格、数量、发站、托运人等补充约定
				<span class="slTitleAssis-tip">（对原合同价格、数量、发站、托运人等补充约定）</span>
			</div>
			<!-- <a-checkbox-group @change="changeQuality"  v-model="selectQuality">

      </a-checkbox-group> -->
			<a-checkbox-group
				@change="changeQuality"
				v-model="selectQuality"
			>
				<a-row
					class="change-box"
					style="margin-bottom: 0"
				>
					<span class="change-box-title">基础信息：</span>
					<a-checkbox
						v-for="item in changeTplInfo.quality"
						:key="item.label"
						:value="item.label"
					>
						{{ item.title }}
					</a-checkbox>
				</a-row>
				<a-row
					class="change-box"
					style="display: flex"
				>
					<span
						class="change-box-title"
						style="margin-top: 20px"
						>运输信息：</span
					>
					<div style="flex: 1">
						<a-checkbox
							v-for="item in changeTplInfo.transportation"
							:disabled="item.disabled"
							:key="item.label"
							:value="item.label"
							style="margin-top: 20px"
						>
							{{ item.title }}
						</a-checkbox>
					</div>
				</a-row>
				<a-row class="change-box">
					<span class="change-box-title">银行账号：</span>
					<a-checkbox
						v-for="item in changeTplInfo.bankInfo"
						:key="item.label"
						:value="item.label"
					>
						{{ item.title }}
					</a-checkbox>
				</a-row>
			</a-checkbox-group>
			<a-table
				:columns="columns"
				:rowKey="(text, record, index) => index"
				:scroll="{ x: true }"
				v-if="changeData.length"
				:dataSource="changeData"
				:pagination="false"
				style="margin-top: 10px"
				class="new-table"
			>
				<div
					class="columns-title"
					slot="regulationTitle"
				>
					<span class="red">*</span>
					<span>所属原合同条款</span>
					<a-tooltip>
						<template slot="title"> 请填写该字段在原合同中的哪个条款中，如：第一条、第2.1条 </template>
						<img
							class="img-icon"
							src="@/v2/assets/imgs/contract/question.png"
							alt=""
						/>
					</a-tooltip>
				</div>
				<div
					slot="regulation"
					slot-scope="text, items, index"
				>
					<a-form-item
						label=""
						:colon="false"
					>
						<a-input
							style="width: 152px"
							placeholder="请输入原合同条款"
							:maxLength="20"
							@blur="e => getNewInfo(e, items, 'regulation')"
							v-decorator="[
								`regulation${items.label}`,
								{
									rules: [{ required: true, message: '请输入原合同条款' }]
								}
							]"
						/>
					</a-form-item>
				</div>

				<div
					class="columns-title"
					slot="customTitle"
					slot-scope="text, items"
				>
					<span>{{ text }}</span>
					<span v-if="items.label === 'deliveryDate'">
						<div
							v-show="typeConfirmed"
							class="LONG_TERM_CONTRACT"
						>
							<span class="text">长协</span>
						</div>
					</span>
				</div>

				<!-- 旧数据 -->
				<template
					slot="oldFileValue"
					slot-scope="text, items, index"
				>
					<span v-if="items.label === 'basePrice'">{{ contractDetail.basePrice }} 元/吨</span>

					<span v-else-if="items.label === 'basePriceDesc'">{{ contractDetail.basePriceDesc }} 元/吨</span>

					<span v-else-if="items.label === 'quantity'">
						{{ contractDetail.quantity }} 吨<template v-if="contractDetail.quantityOffset">
							+/- {{ contractDetail.quantityOffset }} %</template
						>
					</span>

					<span v-else-if="items.label === 'deliveryDate'">
						{{ moment(contractDetail.deliveryStartDate).format('LL') }} -
						{{ moment(contractDetail.deliveryEndDate).format('LL') }}
					</span>

					<div v-else-if="items.label === 'transportMode'">
						<p
							style="line-height: 42px"
							v-for="item in oldDeliveryModeItem"
						>
							{{ item.title }}：{{ item.value }}
						</p>
					</div>

					<div
						v-else-if="items.widget == 'select-bank'"
						v-html="getBankInfo(contractDetail[items.label], items.optionsBank)"
					></div>

					<span v-else-if="items.widget == 'select'">
						<template v-if="items.label == 'deliveryMode'">
							{{ getDeliveryModeLabel(contractDetail[items.label]) }}
						</template>
						<template v-else>
							{{ getLabel(contractDetail[items.label], items.allOptions || items.options) }}
						</template>
					</span>

					<span v-else>
						{{ contractDetail[items.label] }}
					</span>
				</template>

				<div
					class="columns-title"
					slot="newFileValueTitle"
				>
					<span class="red">*</span>
					<span>变更后内容</span>
				</div>
				<div
					slot="newFileValue"
					slot-scope="text, items, index"
				>
					<FormConfig
						:items="items"
						:contractDetail="contractDetail"
						@validator="validator"
						@blur="getNewInfo"
						@quality="getNewQualityInfo"
						@change="changeNewInfo"
						v-if="items.label != 'transportMode'"
					>
					</FormConfig>
					<div v-else>
						<a-form-item :colon="false">
							<div class="columns-title">
								<label style="width: 120px"> <span class="red">*</span> 运输方式</label>
								<a-select
									style="flex: 1"
									:placeholder="items.placeholder"
									@change="value => changeNewTrans(value, items, items.label, index)"
									v-decorator="[
										items.label,
										{
											rules: [{ required: true, message: items.placeholder }, { validator }],
											validateTrigger: 'change'
										}
									]"
								>
									<a-select-option
										:value="trans.value"
										v-for="(trans, index) in tplInfo.transportMode"
										:key="index"
									>
										{{ trans.label }}
									</a-select-option>
								</a-select>
							</div>
						</a-form-item>
						<div
							v-for="(trans, i) in formList"
							:key="i"
							v-if="form.getFieldValue('transportMode')"
						>
							<div
								v-if="trans.style.display == 'block' && trans.label != 'transportMode'"
								class="columns-title"
								style="margin-top: 10px"
							>
								<label style="width: 120px">
									<span
										v-if="trans.required"
										style="color: #f5222d"
										>*</span
									>
									<span
										v-else
										style="opacity: 0"
										>*</span
									>

									{{ trans.title }}
								</label>
								<FormConfig
									:items="trans"
									:transportMode="form.getFieldValue('transportMode')"
									@validator="validator"
									@blur="getTransInfo"
									:contractDetail="contractDetail"
									@quality="getTransInfo"
									@change="getTransInfo"
									style="flex: 1"
								>
								</FormConfig>
							</div>
						</div>
					</div>
				</div>

				<div
					slot="description"
					slot-scope="text, items, index"
				>
					<a-form-item
						label=""
						:colon="false"
					>
						<a-input
							style="width: 100%"
							placeholder="非必填，请输入变更说明"
							:maxLength="200"
							@blur="e => getNewInfo(e, items, 'description')"
							v-decorator="[`description${items.label}`]"
						/>
					</a-form-item>
				</div>
			</a-table>

			<div
				class="slTitleAssis marginTopLoss"
				style="margin-bottom: 30px; margin-top: 30px"
			>
				<span>对其他事项的补充约定</span>
				<span
					class="tip1"
					style="margin-left: 12px"
					>（如果涉及第一条中未包含的变更，请在此输入，如无变更，可不填）</span
				>
				<span
					class="tip2"
					style="margin-left: 12px"
					>注：请注意条款中甲乙方与买卖方对应关系，建议统一用买方、卖方进行描述。</span
				>
			</div>
			<div
				class="sensitive"
				v-if="sensitiveWordsList"
			>
				存在敏感词: {{ sensitiveWordsList }}
			</div>
			<Editor
				:content="signContent"
				placeholder="对其他事项的补充约定"
				:sensitiveWordsList="sensitiveWordsList"
				@change="validateFieldsError"
				@blur="getWordsCheck"
			/>
		</a-form>
		<TipModal
			title="提示"
			tip="合同有效期超过31天，请确认合同类型是否为长协合同？"
			@save="confirmContractType(true)"
			@cancel="confirmContractType(false)"
			ref="tipModal"
			cancelBtnText="否，月度合同"
			okBtnText="是，长协合同"
			v-bind:closable="false"
		></TipModal>
	</div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import { API_getTempleteByCode } from '@/v2/api/diy';
import { getPopupContainer } from '@/v2/utils/factory.js';
import { filterCodeByKey } from '@sub/utils/globalCode.js';
import { getBaseInfoData1 } from '@/v2/utils/order/getBaseInfoData.js';
import { debounce, delay } from 'lodash';
import Editor from './Editor.vue';
import moment from 'moment';
import TipModal from './TipModal';

import { getCompleted } from '@/v2/center/trade/api/suppleAgreement';
import { API_SensitiveWordsCheck } from '@/v2/center/trade/api/contract';
import { API_COMPANYACCOUNTLIST } from '@/v2/center/assets/api';

import FormConfig from './formConfig.vue';

import { cloneDeep } from 'lodash';

const CHANGE_MAP_OTHER = {
	transportResponsibility: 'transportResponsibilityOther', // 运输负责方
	deliveryMode: 'deliveryGoodsClause', // 交货方式
	freightPayMode: 'freightPayModeOther' // 运费支付方式
};
const TRANS_TYPE_LIST = [
	'trainSendStationName', // 发站
	'trainArriveStationName', // 到站
	'shipLoadingPortName', // 装货港
	'shipDischargingPortName', // 卸货港
	'sendGoodsAddress', // 发货地
	'shipperName', // 发货人
	'consignorCompanyName' // 托运人
];

const columns = [
	{
		title: '序号',
		dataIndex: '',
		key: 'rowIndex',
		width: 70,
		align: 'center',
		customRender: function (t, r, index) {
			return parseInt(index) + 1;
		}
	},
	{ title: '字段名称', dataIndex: 'title', scopedSlots: { customRender: 'customTitle' }, width: 150 },
	{ dataIndex: 'regulation', slots: { title: 'regulationTitle' }, scopedSlots: { customRender: 'regulation' }, width: 180 },
	{ title: '变更前内容', dataIndex: 'oldFileValue', scopedSlots: { customRender: 'oldFileValue' }, width: 300 },
	{ dataIndex: 'newFileValue', slots: { title: 'newFileValueTitle' }, scopedSlots: { customRender: 'newFileValue' }, width: 304 },
	{ title: '变更说明', dataIndex: 'description', scopedSlots: { customRender: 'description' } }
];

export default {
	data() {
		return {
			form: this.$form.createForm(this, {
				onValuesChange: this.onValuesChange
			}),
			columns,
			moment,
			getPopupContainer,
			// 合同模板信息
			tplInfo: {},
			// 变更项模板信息
			changeTplInfo: {},
			// 更改的 数据
			changeData: [],
			contractDetail: {},
			despatchTypeDict: {},

			oldDeliveryModeItem: [],
			contractTemplate: '',
			// 地址列表
			placeData: [],
			/** 选择的基础信息 */
			selectQuality: [],
			selectTrans: [],
			selectBank: [],
			// 敏感词
			sensitiveWordsList: '',
			changeItems: [],
			// 签订日期提示
			contractSignTimeDevMax: false,
			// 补协详情
			suppleDetail: {},
			signContent: '',
			// 最大日期
			maxDate: '',
			/*** 缓存数据 */
			cacheChangeTplInfo: {},
			// 交货期限 是否显示 "长协" 标签
			typeConfirmed: null
		};
	},
	computed: {
		...mapGetters('contract', {
			VUEX_GET_FORM_SCHEMA: 'VUEX_GET_FORM_SCHEMA'
		}),
		formList() {
			return this.$store.state.supple.formList.transportation;
		},
		isEdit() {
			return !!this.$route.query.id;
		}
	},
	mounted() {
		filterCodeByKey('despatchTypeDict').forEach(item => {
			this.despatchTypeDict[item.value] = item.text;
		});
	},

	methods: {
		confirmContractType(isLongTerm) {
			if (isLongTerm === null) {
				// 取消交货期限勾选 清空长协状态
				const termType = this.contractDetail.contractTermType;
				if (termType === 'LONG_TERM_CONTRACT') {
					this.typeConfirmed = true;
				} else if (termType === 'MONTHLY_CONTRACT') {
					this.typeConfirmed = false;
				} else {
					this.typeConfirmed = null;
				}
				this.$store.commit('supple/updateContractTermType', null);
			} else {
				this.typeConfirmed = isLongTerm;
				this.$store.commit('supple/updateContractTermType', isLongTerm ? 'LONG_TERM_CONTRACT' : 'MONTHLY_CONTRACT');
			}
			this.$refs.tipModal.close();
		},
		// 获取变更项枚举值
		async API_getTempleteByCode(obj, suppleDetail) {
			this.selectQuality = [];
			this.selectTrans = [];
			this.selectBank = [];

			this.contractDetail = obj;
			this.suppleDetail = suppleDetail || {};

			// 交货期限长协初始状态
			const termType = this.suppleDetail.contractTermType ?? this.contractDetail.contractTermType;
			if (termType === 'LONG_TERM_CONTRACT') {
				this.typeConfirmed = true;
			} else if (termType === 'MONTHLY_CONTRACT') {
				this.typeConfirmed = false;
			} else {
				this.typeConfirmed = null;
			}

			this.$store.commit('supple/updateContract', obj);

			this.contractTemplate = this.contractDetail.contractTemplateName;
			const transportMode = this.contractDetail.transportMode;

			const params = {
				templateCode: this.contractDetail.contractTemplateName
				// type: 'contractInfo'
			};
			const res = await API_getTempleteByCode(params);

			this.tplInfo = res.data;
			this.$store.commit('supple/tplInfo', this.tplInfo);
			const templateJson = {
				formList: {}
			};
			const info = JSON.parse(this.tplInfo.templateJson || JSON.stringify(templateJson));

			this.cacheChangeTplInfo = cloneDeep(info.formList);

			const { quality = [], transportation = [], bankInfo = [] } = info.formList;
			transportation.forEach(el => {
				if (el.label == 'freightPayMode') {
					el.options = el.options.filter(el2 => el2.value != 'DOWN_STREAM');
				}
			});

			this.$store.commit('supple/updateFormList', info.formList);

			/** 有值才渲染 */
			// 基础信息
			quality.forEach((el, i, arr) => {
				const key = el.label;
				el.hasOldValue = this.contractDetail[key];
				if (key == 'deliveryDate' && this.contractDetail.deliveryStartDate) {
					el.hasOldValue = [this.contractDetail.deliveryStartDate, this.contractDetail.deliveryEndDate];
				}
				if (this.isEdit) {
					const newArr = this.suppleDetail.changeItems;
					const changeItem = newArr.find(el2 => el2.fieldName == el.label);

					el.changeItem = changeItem || {};
					// if(changeItem) {
					//   this.selectQuality.push(el.label)
					//   this.changeData.push(el)
					// }
				}
			});

			// 运输信息
			// transportation
			transportation.forEach((el, i, arr) => {
				const key = el.label;
				el.hasOldValue = this.contractDetail[key];
				/** 判断当前是否是火运 */

				if (this.isEdit) {
					const newArr = this.suppleDetail.changeItems;
					const changeItem = newArr.find(el2 => el2.fieldName == el.label);

					el.changeItem = changeItem || {};
					// if(changeItem) {
					//   this.selectQuality.push(el.label)
					//   this.changeData.push(el)
					// }
				}
			});

			// 银行账号
			for (let i = 0; i < bankInfo.length; i++) {
				let item = bankInfo[i];
				if (item.widget == 'select-bank') {
					// 卖方账号
					if (item.label == 'sellerBankAccountId') {
						item.optionsBank = await this.getBankList(this.contractDetail.sellerCompanyUscc);
					} else {
						item.optionsBank = await this.getBankList(this.contractDetail.buyCompanyUscc);
					}
				}
			}
			// bankInfo
			bankInfo.forEach((el, i, arr) => {
				const key = el.label;
				el.hasOldValue = this.contractDetail[key];
				if (this.isEdit) {
					const newArr = this.suppleDetail.changeItems;
					const changeItem = newArr.find(el2 => el2.fieldName == el.label);
					el.changeItem = changeItem || {};
				}
			});

			/** 初始化 运输信息 */

			this.$store.commit('supple/initUpdateTrans', { value: this.contractDetail.transportMode, list: transportation });

			const initTransportation = this.$store.state.supple.initTransportation;

			this.changeTplInfo = {
				bankInfo: bankInfo.filter(el => el.hasOldValue && el.style.display == 'block'),
				quality: quality.filter(el => el.hasOldValue && el.style.display == 'block' && el.label!=='signTime'),
				transportation: initTransportation.filter(el => el.hasOldValue && el.style.display == 'block')
			};
			this.$store.commit('supple/changeTplInfo', this.changeTplInfo);

			/** 赋值 */
			if (this.isEdit) {
				/** 处理勾选项 */
				if (transportation.length && this.changeTplInfo.transportation.length) {
					transportation.forEach(pro=> {
						this.changeTplInfo.transportation.forEach(tar => {
							if (pro.label === tar.label) {
								pro.style = tar.style
							}
						})
					})
				}
				const newArr = this.suppleDetail.changeItems;
				this.selectQuality = newArr.map(el => el.fieldName);
				const newConfigArr = [...quality, ...transportation, ...bankInfo];
				this.selectQuality.forEach(el => {
					const item = newConfigArr.find(el2 => el2.label == el);
					if (item) {
						this.changeData.push(item);
					}
				});

				this.$nextTick(() => {
					this.form.setFieldsValue({ signDate: suppleDetail.signDate });

					this.handleSignDate(suppleDetail.signDate);

					this.signContent = suppleDetail.signContent;
					this.validateFieldsError(suppleDetail.signContent);
					// /transportMode
					// 判断当前是是否有运输方式

					this.suppleDetail.changeItems.forEach(el => {
						const obj = {};
						let key1 = `regulation${el.fieldName}`;
						let key2 = `description${el.fieldName}`;

						obj[key1] = el.regulation;
						obj[key2] = el.description;

						let transItem = this.changeTplInfo.transportation.find(el2 => el2.label == el.fieldName);

						this.$nextTick(() => {
							const itemDetails = el.itemDetails || [];
							itemDetails.forEach(el2 => {
								if (el.fieldName == 'transportMode') {
									transItem = info.formList.transportation.find(el3 => el3.label == el2.itemName);
									if (el2.itemName == 'transportMode') {
										this.$store.commit('supple/updateTrans', { field: 'transportation', values: { transportMode: el2.value } });
									}

									/** 特殊处理的  */
									if (['transportResponsibility', 'deliveryMode', 'freightPayMode'].includes(el2.itemName)) {
										const tplItem = info.formList.transportation.find(el3 => el3.label == el2.itemName);

										tplItem.changeItem = {
											itemDetails: [el2]
										};

										this.$store.commit('supple/updateFormListTrans', info.formList.transportation);
									}
								}
								if (el.fieldName == 'deliveryDate') {
									obj.deliveryDate = [itemDetails[0].value, itemDetails[1].value];
								} else {
									if (transItem && transItem.widget == 'select-multiple') {
										obj[el2.itemName] = el2.value.split(',');
									} else {
										obj[el2.itemName] = el2.value;
									}
								}

								if (['transportResponsibility', 'deliveryMode', 'freightPayMode'].includes(el2.itemName)) {
									// 涉及到其他选择
									this.$nextTick(() => {
										this.$nextTick(() => {
											this.form.setFieldsValue(obj);
										});
									});
								}
								this.$nextTick(() => {
									this.form.setFieldsValue(obj);
								});
							});
						});
					});
				});

				this.changeTrans(this.selectQuality);
				this.$store.commit('supple/updateChangeData', this.changeData);
			}

			/** 获取旧的 运输方式 数据 */
			// transportMode
			this.oldDeliveryModeItem = [];
			this.changeTplInfo.transportation.forEach(el => {
				let value = '';
				if (el.widget == 'select') {
					if (el.label == 'transportMode') {
						value = this.getLabel(this.contractDetail[el.label], this.tplInfo.transportMode);
					} else {
						value = this.getLabel(this.contractDetail[el.label], el.options);
					}
				} else {
					value = this.contractDetail[el.label];
				}
				const obj = { title: el.title, value };

				this.oldDeliveryModeItem.push(obj);
			});

			this.$store.commit('supple/oldDeliveryMode', this.oldDeliveryModeItem);

			// 获取签订时间
			this.getCompleted();
		},
		validatorDate(rule, value, callback) {
			const d = moment(value).diff(moment(this.maxDate), 'days');
			if (d < 0) {
				const tipDate = moment(this.maxDate).format('YYYY-MM-DD');
				callback(`签订日期不能小于${tipDate}`);
			} else {
				callback();
			}
		},
		changeQuality(list) {
			this.changeData = [];
			this.selectQuality = list;
			this.changeTrans(list);
			const labelMaps = this.changeData.map(el2 => el2.label);
			const info = this.form.getFieldsValue();
			list.forEach(el => {
				/** 先判断 当前 数组 是否存在 当前选择的元素 */
				const item =
					this.changeTplInfo.quality.find(el2 => el2.label == el) ||
					this.changeTplInfo.transportation.find(el2 => el2.label == el) ||
					this.changeTplInfo.bankInfo.find(el2 => el2.label == el);
				// 当前数据没有值 清空 旧的数据
				if (info[item.label] === null || info[item.label] === undefined) {
					item.changeItem = item.changeItem || {};
					item.changeItem.itemDetails = [];
				}

				this.changeData.push(item);
			});

			// 去除当前 多余的数据
			this.$nextTick(() => {
				this.form.setFieldsValue(info);
				this.$nextTick(() => {
					this.form.setFieldsValue(info);
				});
			});
			this.$store.commit('supple/updateChangeData', this.changeData);
			// 取消对交货期限的修改时，将值恢复为原合同的类型
			if (!this.selectQuality.includes('deliveryDate')) {
				this.confirmContractType(null);
			}
		},

		changeTrans(list) {
			const newTableList = cloneDeep(this.changeData);

			const isTrans = list.includes('transportMode');

			const flag = this.changeTplInfo.transportation.some(el => el.label != 'transportMode' && list.includes(el.label));

			// 并且选中了 其他的运输信息

			// /** 判断当前 label 在数组里面 是否存在 */
			this.changeTplInfo.transportation.forEach(el => {
				el.disabled = false;
				if (el.label != 'transportMode' && isTrans) {
					el.disabled = true;
				}
				if (!isTrans && el.label == 'transportMode' && flag) {
					el.disabled = true;
				}
			});
		},

		onValuesChange(props, values) {
			if (values.hasOwnProperty('signDate')) {
				//当选择签订日期与当前系统日期偏差大于30天时，提示
				if (Math.abs(moment(values.signDate).diff(moment(), 'days')) > 30) {
					this.contractSignTimeDevMax = true;
				} else {
					this.contractSignTimeDevMax = false;
				}
			}
		},
		getNewInfo(e, item, key) {
			const index = this.changeData.findIndex(el => el.label == item.label);

			const currentItem = this.changeData.find(el => el.label == item.label);

			let obj = currentItem.changeItem || {};

			obj.serialNumber = index + 1;

			obj.fieldName = currentItem.label;

			obj.fieldCName = currentItem.title;
			// 旧数据描述

			if (['description', 'regulation'].includes(key)) {
				obj[key] = e.target.value;
			} else {
				obj.itemDetails = obj.itemDetails || [];
				const handleItem = obj.itemDetails.find(el => el.itemName == key);
				if (handleItem) {
					handleItem.value = e.target.value;
				} else {
					obj.itemDetails.push({
						itemName: item.label,
						itemCName: item.title,
						oldValue: this.contractDetail[item.label],
						value: e.target.value
					});
				}
			}

			currentItem.changeItem = obj;

			this.$set(this.changeData, index, currentItem);

			this.$store.commit('supple/updateChangeData', this.changeData);
			this.$forceUpdate();
		},
		getNewQualityInfo(e, child, key, items) {
			const index = this.changeData.findIndex(el => el.label == items.label);
			const currentItem = this.changeData.find(el => el.label == items.label);

			let obj = currentItem.changeItem || {};

			obj.serialNumber = index + 1;

			obj.fieldName = currentItem.label;

			obj.fieldCName = currentItem.title;
			obj.itemDetails = obj.itemDetails || [];

			const handleItem = obj.itemDetails.find(el2 => el2.itemName == key);
			// 判断当前是否存在
			if (handleItem) {
				handleItem.value = e.target.value;
			} else {
				obj.itemDetails.push({
					itemName: child.label,
					itemCName: child.title,
					oldValue: this.contractDetail[key],
					value: e.target.value
				});
			}

			// 获取描述

			currentItem.changeItem = obj;
			this.$set(this.changeData, index, currentItem);
			this.$store.commit('supple/updateChangeData', this.changeData);
			this.$forceUpdate();
		},
		changeNewInfo(value, item, key) {
			const index = this.changeData.findIndex(el => el.label == item.label);

			const currentItem = this.changeData.find(el => el.label == item.label);

			let obj = currentItem.changeItem || {};

			obj.serialNumber = index + 1;

			obj.fieldName = currentItem.label;

			obj.fieldCName = currentItem.title;

			obj.itemDetails = obj.itemDetails || [];

			const handleItem = obj.itemDetails.find(el2 => el2.itemName == key);
			// 判断当前是否存在
			if (handleItem) {
				handleItem.value = value;
			} else {
				obj.itemDetails.push({
					itemName: item.label,
					itemCName: item.title,
					oldValue: this.contractDetail[key],
					value
				});
			}

			// 判断 是否是 日期
			if (item.widget == 'range-picker') {
				obj.itemDetails = [
					{
						itemName: 'deliveryStartDate',
						itemCName: '交货期限开始',
						oldValue: this.contractDetail.deliveryStartDate,
						value: moment(value[0]).format('YYYY-MM-DD')
					},
					{
						itemName: 'deliveryEndDate',
						itemCName: '交货期限结束',
						oldValue: this.contractDetail.deliveryEndDate,
						value: moment(value[1]).format('YYYY-MM-DD')
					}
				];

				const startDate = moment(value[0]);
				const endDate = moment(value[1]);
				const daysBetween = endDate.diff(startDate, 'days');
				if (daysBetween >= 31) {
					this.$refs.tipModal.open();
				} else {
					this.confirmContractType(false);
				}
			}
			currentItem.changeItem = obj;
			this.$set(this.changeData, index, currentItem);
			this.$store.commit('supple/updateChangeData', this.changeData);
			this.$forceUpdate();
		},
		getTransInfo(e, item, key) {
			let value = e.target ? e.target.value : e;

			const index = this.changeData.findIndex(el => el.label == 'transportMode');
			const currentItem = this.changeData.find(el => el.label == 'transportMode');

			const handleItem = currentItem.changeItem.itemDetails.find(el => el.itemName == key);

			if (handleItem) {
				handleItem.value = value;
			} else {
				currentItem.changeItem.itemDetails.push({
					itemName: item.label,
					itemCName: item.title,
					oldValue: this.contractDetail[key],
					value
				});
			}

			/** 判断当前 是否是其他值 */

			const handleItem2 = currentItem.changeItem.itemDetails.find(el => el.itemName == key);
			const otherKey = CHANGE_MAP_OTHER[handleItem2.itemName];
			if (!['OTHER', '其他'].includes(handleItem2.value) && otherKey) {
				// 删除qi对应的 other数据
				// otherKey
				currentItem.changeItem.itemDetails.forEach((el, i, arr) => {
					if (el.itemName == otherKey) {
						arr.splice(i, 1);
					}
				});
			}

			this.$set(this.changeData, index, currentItem);
			this.$store.commit('supple/updateChangeData', this.changeData);

			this.$forceUpdate();
		},

		handleSignDate(value) {
			this.$store.commit('supple/updateSignDate', value);
		},
		validator(rule, value, callback, isTrans) {
			if (!value) {
				callback();
				return;
			}
			const text = '变更前与变更后数据不能一致，请重新填写';
			if (rule.field === 'deliveryDate') {
				if (
					this.contractDetail.deliveryStartDate === moment(value[0]).format('YYYY-MM-DD') &&
					this.contractDetail.deliveryEndDate === moment(value[1]).format('YYYY-MM-DD')
				) {
					callback(text);
				}
				callback();
				return;
			}
			if (rule.field === 'transportMode') {
				if (this.contractDetail.transportMode == value) {
					callback(text);
				}
				callback();
				return;
			}
			// if (this.multiValueField.includes(rule.field)) {
			//   if (this.contractDetail[rule.field] === value.join(",")) {
			//     callback(text);
			//   }
			//   callback();
			//   return;
			// }

			if (this.contractDetail[rule.field] == value && !isTrans) {
				callback(text);
			}
			callback();
		},
		// 反查label
		getLabel(val, list = []) {
			const item = list.find(el => el.value == val) || {};
			return item.label || '';
		},
		getDeliveryModeLabel(val) {
			const transportationList = this.cacheChangeTplInfo.transportation;
			const deliveryModeItem = transportationList.find(el => el.label == 'deliveryMode') || { options: [] };
			const item = deliveryModeItem.options.find(el => el.value == val) || {};
			return item.label || '';
		},
		getBankInfo(val, list) {
			const item = list.find(el => el.id == val) || {};

			return `<p>${item.bankName}/${item.accountTypeText}</p> <p>${item.accountNo}</p>`;
		},

		// 获取银行账号列表
		async getBankList(uscc) {
			const params = {
				uscc
			};
			const res = await API_COMPANYACCOUNTLIST(params);
			this.$store.commit('supple/bankList', res.data);
			return res.data;
		},

		changeNewTrans(value, item, key, index) {
			// 其他项 值 重置成 none
			this.formList.forEach(el => {
				el.changeItem = el.changeItem || {};
				el.changeItem.itemDetails = [];
				if (['deliveryGoodsClause', 'transportResponsibilityOther', 'freightPayModeOther'].includes(el.label)) {
					el.style.display = 'none';
				}
			});
			this.$store.commit('supple/updateFormListTrans', this.formList);

			this.$store.commit('supple/updateTrans', { field: 'transportation', values: { transportMode: value } });

			let obj = item.changeItem || {};

			obj.serialNumber = index + 1;

			obj.fieldName = item.label;

			obj.fieldCName = item.title;

			obj.itemDetails = [
				{
					itemName: item.label,
					itemCName: item.title,
					oldValue: this.contractDetail[key],
					value
				}
			];
			item.changeItem = obj;
			/*** 运输方式放生变化 */
		},
		validateFieldsError(value) {
			this.$store.commit('supple/updateSignContent', value);
		},
		getWordsCheck(value) {
			if (!value) {
				return;
			}

			API_SensitiveWordsCheck({
				content: value.split(','),
				title: ''
			})
				.then(res => {
					if (res.success && res.data.length) {
						this.sensitiveWordsList = res.data.join('，');
					} else {
						this.sensitiveWordsList = '';
					}
					this.$emit('send', this.sensitiveWordsList);
				})
				.finally(() => {});
		},

		async getCompleted() {
			const params = {
				contractNo: this.contractDetail.contractNo
			};
			const res = await getCompleted(params);
			const info = res.data;
			/** 获取最大时间 */
			let dateList = info.agreementList.map(el => el.signDate);
			dateList = [...dateList, info.contractSignDate];
			// 获取最大时间
			dateList.sort((a, b) => {
				return moment(b).diff(moment(a), 'days');
			});
			this.maxDate = dateList[0];
		},
		// 进入页面显示的运输信息
		initUpdateTrans(payload) {
			const { value, list } = payload;

			const cloneList = cloneDeep(list);

			if (!cloneList) return;
			// 汽运
			if (value === 'AUTOMOBILE') {
				cloneList.forEach(item => {
					if (TRANS_TYPE_LIST.includes(item.label)) {
						item.style.display = 'none';
					}
					if (['sendGoodsAddress'].includes(item.label)) {
						item.style.display = 'block';
					}
					if (['consigneeCompanyName', 'shipperName'].includes(item.label)) {
						item.style.display = 'block';
						item.required = true;
					}
					if (['transportResponsibility'].includes(item.label)) {
						item.style.display = 'block';
					}
					if (['shipperName'].includes(item.label)) {
						item.style.display = 'block';
					}
					// 采购--动力煤000通用,焦煤000通用,焦炭000通用，兰炭000通用 展示产地
					if (
						['COKING_COAL_000', 'STEAM_COAL_012', 'COKING_000', 'SEMI_COKE_000'].includes(
							state.contractData.contract?.contractTemplateName
						)
					) {
						if (['originPlace'].includes(item.label)) {
							item.style.display = 'block';
						}
					}
					if (['STEAM_COAL_014'].includes(state.contractData.contract?.contractTemplateName)) {
						if (['consignorCompanyName'].includes(item.label)) {
							item.style.display = 'none';
						}
					}
				});
			}
			// 船运
			if (value === 'SHIP') {
				cloneList.forEach(item => {
					if (TRANS_TYPE_LIST.includes(item.label)) {
						item.style.display = 'none';
					}
					if (['shipLoadingPortName', 'shipDischargingPortName'].includes(item.label)) {
						item.style.display = 'block';
					}
					if (['shipperName', 'consigneeCompanyName'].includes(item.label)) {
						item.style.display = 'block';
						item.required = false;
					}
					if (['transportResponsibility'].includes(item.label)) {
						item.style.display = 'block';
					}
					if (['shipperName'].includes(item.label)) {
						item.style.display = 'block';
					}
					// 采购--动力煤000通用,焦煤000通用,焦炭000通用，兰炭000通用 展示产地
					if (
						['COKING_COAL_000', 'STEAM_COAL_012', 'COKING_000', 'SEMI_COKE_000'].includes(
							state.contractData.contract?.contractTemplateName
						)
					) {
						if (['originPlace'].includes(item.label)) {
							item.style.display = 'block';
						}
					}
					if (['STEAM_COAL_014'].includes(state.contractData.contract?.contractTemplateName)) {
						if (['consignorCompanyName'].includes(item.label)) {
							item.style.display = 'none';
						}
					}
				});
			}
			// 火运
			if (value === 'TRAIN') {
				cloneList.forEach(item => {
					if (TRANS_TYPE_LIST.includes(item.label)) {
						item.style.display = 'none';
					}
					if (['trainSendStationName', 'trainArriveStationName'].includes(item.label)) {
						item.style.display = 'block';
					}
					if (['consignorCompanyName', 'consigneeCompanyName'].includes(item.label)) {
						item.style.display = 'block';
						item.required = true;
					}
					if (['transportResponsibility'].includes(item.label)) {
						item.style.display = 'block';
					}
					if (['shipperName'].includes(item.label)) {
						item.style.display = 'none';
					}
					// 采购--动力煤000通用,焦煤000通用,焦炭000通用，兰炭000通用 展示产地
					if (
						['COKING_COAL_000', 'STEAM_COAL_012', 'COKING_000', 'SEMI_COKE_000'].includes(
							state.contractData.contract?.contractTemplateName
						)
					) {
						if (['originPlace'].includes(item.label)) {
							item.style.display = 'block';
						}
					}
					if (['STEAM_COAL_014'].includes(state.contractData.contract?.contractTemplateName)) {
						if (['consignorCompanyName'].includes(item.label)) {
							item.style.display = 'block';
						}
					}
				});
				// cloneListCommitment.forEach(item => {
				//   if(['shipTransportCompanyName', 'shipTransportProtocolNo'].includes(item.label)) {
				//     item.style.display = 'none';
				//   }
				// });
			}
			// 汽运和火运
			if (value === 'AUTOMOBILE_AND_TRAIN') {
				cloneList.forEach(item => {
					if (TRANS_TYPE_LIST.includes(item.label)) {
						item.style.display = 'none';
					}
					if (['sendGoodsAddress'].includes(item.label)) {
						item.style.display = 'block';
					}
					if (['trainSendStationName', 'trainArriveStationName'].includes(item.label)) {
						item.style.display = 'block';
					}
					if (['consignorCompanyName', 'consigneeCompanyName', 'shipperName'].includes(item.label)) {
						item.style.display = 'block';
						item.required = true;
					}
					if (['transportResponsibility'].includes(item.label)) {
						item.style.display = 'block';
					}
					if (['shipperName'].includes(item.label)) {
						item.style.display = 'block';
					}
					// 采购--动力煤000通用,焦煤000通用,焦炭000通用，兰炭000通用 展示产地
					if (
						['COKING_COAL_000', 'STEAM_COAL_012', 'COKING_000', 'SEMI_COKE_000'].includes(
							state.contractData.contract?.contractTemplateName
						)
					) {
						if (['originPlace'].includes(item.label)) {
							item.style.display = 'block';
						}
					}
					if (['STEAM_COAL_014'].includes(state.contractData.contract?.contractTemplateName)) {
						if (['sendGoodsAddress', 'consignorCompanyName'].includes(item.label)) {
							item.style.display = 'block';
						}
					}
				});
				// cloneListCommitment.forEach(item => {
				//   if(['shipTransportCompanyName', 'shipTransportProtocolNo'].includes(item.label)) {
				//     item.style.display = 'none';
				//   }
				// });
			}
			// 无运输方式
			if (value === 'NONE') {
				cloneList.forEach(item => {
					if (
						[
							'freightPayMode',
							'freightPayModeOther',
							'trainSendStationName',
							'trainArriveStationName',
							'shipLoadingPortName',
							'shipDischargingPortName',
							'sendGoodsAddress',
							'consignorCompanyName',
							'consigneeCompanyName'
						].includes(item.label)
					) {
						item.style.display = 'none';
					}
					if (['transportResponsibility'].includes(item.label)) {
						item.style.display = 'none';
					}
					// 采购--动力煤000通用,焦煤000通用,焦炭000通用，兰炭000通用 不展示产地
					if (
						[
							'COKING_COAL_000',
							'STEAM_COAL_012',
							'COKING_000',
							'SEMI_COKE_000',
							'SMOKELESS_COAL_000',
							'INJECTION_COAL_000'
						].includes(state.contractData.contract?.contractTemplateName)
					) {
						if (['originPlace'].includes(item.label)) {
							item.style.display = 'none';
						}
					}
					if (['SMOKELESS_COAL_000', 'INJECTION_COAL_000'].includes(state.contractData.contract?.contractTemplateName)) {
						if (['consigneeCompanyName', 'shipperName'].includes(item.label)) {
							item.style.display = 'none';
						}
					}
				});
			}
			return cloneList;
		},
		save() {
			return new Promise((reslove, reject) => {
				this.form.validateFieldsAndScroll((err, values) => {
					if (err) {
						reslove(false);
						return;
					}
					reslove(true);
				});
			});
		}
	},
	components: {
		FormConfig,
		Editor,
		TipModal
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style scoped lang="less">
.calendar {
	width: 14px;
	height: 14px;
	display: inline-block;
	vertical-align: middle;
	background: url(~@/v2/assets/imgs/common/calendar.png) no-repeat 100% 100%;
	background-size: contain;
	line-height: 38px !important;
	top: 16px;
}
.slTitleAssis-tip {
	color: var(--vi, #ff800f);
	font-family: PingFang SC;
	font-size: 12px;
	font-style: normal;
	font-weight: 500;
	line-height: normal;
}
.change-box {
	margin-bottom: 20px;
	&-title {
		color: rgba(0, 0, 0, 0.49);
		margin-right: 20px;
		display: inline-block;
		width: 70px;
	}
	/deep/ .ant-checkbox-wrapper + .ant-checkbox-wrapper {
		margin-left: 0;
	}
	/deep/ .ant-checkbox + span {
		padding: 0 10px;
		padding-right: 0;
		display: inline-block;
		width: 140px;
	}
	/deep/ .ant-checkbox-inner {
		border-radius: 4px;
	}
}
.red {
	color: #d44;
}
.img-icon {
	width: 12px;
	height: 12px;
	margin-left: 10px;
}
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
.tip1 {
	color: var(--vi, #ff800f);
	font-family: PingFang SC;
	font-size: 12px;
	font-style: normal;
	font-weight: 500;
	line-height: normal;
}
.tip2 {
	color: rgba(0, 0, 0, 0.4);
	font-family: PingFang SC;
	font-size: 12px;
	font-style: normal;
	font-weight: 400;
	line-height: normal;
}
.sensitive {
	margin-block: 10px;
	color: #d44;
	font-size: 12px;
}
.LONG_TERM_CONTRACT {
	position: relative;
	margin-left: 10px;
	border-radius: 4px;
	border: 1px solid @primary-color;
	height: 20px;
	line-height: 20px;
	padding: 0 5px;
	font-family:
		PingFangSC-Regular,
		PingFang SC;
	.text {
		text-align: center;
		font-size: 14px;
		zoom: 0.85;
		position: relative;
		top: -2px;
		color: @primary-color;
	}
}
</style>
