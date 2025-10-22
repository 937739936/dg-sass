<template>
	<a-form :form="form">
		<a-row>
			<h3
				v-if="!notShowTitle"
				style="margin: 30px 0"
			>
				基本信息
			</h3>
			<a-row>
				<a-col
					:span="12"
					v-for="item in baseInfoData"
					:key="item.value"
				>
					<a-form-item
						v-if="item.type != 'range'"
						:label="item.label"
						:label-col="{
							span: 9
						}"
						:wrapper-col="{
							span: 15
						}"
					>
						<a-input
							v-if="item.type == 'input'"
							:disabled="disabled"
							:maxLength="item.maxLength || Infinity"
							:placeholder="item.placeholder"
							v-decorator="[
								`${item.value}`,
								{
									rules: [{ required: item.require, message: `${item.label}必填` }],
									validateTrigger: 'blur'
								}
							]"
						/>
						<a-select
							:getPopupContainer="getPopupContainer"
							mode="tags"
							:filterOption="false"
							:token-separators="[',']"
							:defaultActiveFirstOption="false"
							:disabled="disabled"
							v-if="item.type == 'selectTag'"
							style="width: 100%"
							:placeholder="item.placeholder"
							v-decorator="[
								`${item.value}`,
								{
									rules: [{ required: item.require, message: `${item.label}必填` }],
									validateTrigger: 'blur'
								}
							]"
						>
						</a-select>
						<a-select
							v-if="item.type == 'selectKeyValue'"
							:getPopupContainer="getPopupContainer"
							:disabled="disabled"
							@change="getBzjValue"
							v-decorator="[
								`${item.value}`,
								{
									rules: [{ required: item.require, message: `${item.label}必填` }],
									validateTrigger: 'blur'
								}
							]"
						>
							<a-select-option
								:value="items.id"
								v-for="(items, index) in item.data"
								:key="index"
								>{{ items.name }}</a-select-option
							>
						</a-select>
						<a-select
							:getPopupContainer="getPopupContainer"
							showSearch
							mode="multiple"
							:showArrow="false"
							:filterOption="false"
							:defaultActiveFirstOption="false"
							:disabled="disabled"
							v-if="item.type == 'search'"
							style="width: 100%"
							@search="fetchPlace"
							@focus="placeData = null"
							:notFoundContent="placeData ? '暂无数据' : ''"
							placeholder="请输入内容进行查询"
							v-decorator="[
								`${item.value}`,
								{
									rules: [{ required: item.require, message: `${item.label}必填` }],
									validateTrigger: 'blur'
								}
							]"
						>
							<a-select-option
								v-for="(items, index) in placeData"
								:key="index"
								:value="items.name"
								>{{ items.name }}</a-select-option
							>
						</a-select>
						<a-select
							v-if="item.type == 'select'"
							:getPopupContainer="getPopupContainer"
							@change="$parent.getBIYSFSvalue($event, item)"
							:disabled="item.value == 'transportMode' ? disabled || shipFormFieldDisabled || Boolean(OAData) : disabled"
							v-decorator="[
								`${item.value}`,
								{
									rules: [{ required: item.require, message: `${item.label}必填` }],
									validateTrigger: 'blur'
								}
							]"
						>
							<a-select-option
								:value="items.value"
								v-for="(items, index) in item.data"
								:key="index"
								>{{ items.text }}</a-select-option
							>
						</a-select>

						<a-input-number
							:disabled="disabled"
							style="width: 100%"
							v-if="item.type == 'number'"
							:max="item.max"
							:placeholder="item.placeholder"
							v-decorator="[
								`${item.value}`,
								{
									rules: [
										{ required: item.require, message: `${item.label}必填` },
										item.value == 'basePrice' || item.value == 'depositAmount' ? { validator: judgeBasePrice } : ''
									],
									validateTrigger: 'blur'
								}
							]"
						/>
						<a-range-picker
							v-if="item.type == 'dateRange'"
							:disabled="disabled"
							format="YYYY-MM-DD"
							:placeholder="['开始时间', '结束时间']"
							v-decorator="[
								`${item.value}`,
								{
									rules: [
										{
											type: 'array',
											required: item.require,
											message: `${item.label}必填`
										}
									]
								}
							]"
						/>
						<a-date-picker
							style="width: 100%"
							v-if="item.type == 'datePicker'"
							placeholder="请输入保证金收款日期"
							:disabled="disabled"
							format="YYYY-MM-DD"
							v-decorator="[
								`${item.value}`,
								{
									rules: [{ required: item.require, message: `${item.label}必填` }]
								}
							]"
						/>
						<!--线下合同模板收货人要从下拉列表里选-->
						<a-select
							v-decorator="[
								`${item.value}`,
								{
									rules: [{ required: item.require, message: `${item.label}必填` }],
									validateTrigger: 'blur'
								}
							]"
							:getPopupContainer="getPopupContainer"
							:disabled="disabled"
							show-search
							placeholder="请输入内容搜索"
							v-if="item.type == 'xianxia_BI_SHR'"
							:default-active-first-option="false"
							:show-arrow="false"
							:filter-option="false"
							:not-found-content="null"
							@search="getSHRForOFFLINE"
						>
							<a-select-option
								v-for="items in receiverList"
								:key="items.id"
								>{{ items.name }}</a-select-option
							>
						</a-select>
						<!--运费支付方式-->
						<a-select
							:getPopupContainer="getPopupContainer"
							v-if="item.type == 'yfzf'"
							@change="getFreightPayMode"
							:disabled="disabled || shipFormFieldDisabled"
							v-decorator="[
								'freightPayMode', //item.value也可
								{
									rules: [{ required: item.require, message: '运费支付方式必填' }],
									validateTrigger: 'blur'
								}
							]"
						>
							<a-select-option
								:value="items.value"
								v-for="(items, index) in filterDownPay(item.data)"
								:key="index"
								>{{ items.text }}</a-select-option
							>
						</a-select>
						<!--资金来源-->
						<a-select
							:getPopupContainer="getPopupContainer"
							v-if="item.type == 'fuwufzf'"
							:disabled="disabled || (OAData && Boolean(!OAData.canEdit))"
							v-decorator="[
								'bankProductCode', //item.value也可
								{
									rules: [{ required: item.require, message: '资金来源必填' }],
									validateTrigger: 'blur'
								}
							]"
						>
							<a-select-option
								v-for="(items, index) in serviceFeePayModeData"
								:key="index"
								:value="items.code"
								>{{ items.name }}</a-select-option
							>
						</a-select>
					</a-form-item>
					<a-row v-if="item.type == 'range'">
						<a-col span="17">
							<a-form-item
								:label="item.label"
								:label-col="{
									span: 12
								}"
								:wrapper-col="{
									span: 12
								}"
							>
								<a-col span="20">
									<a-input-number
										style="width: 100%"
										:placeholder="item.placeholder"
										:disabled="disabled"
										:min="item.first.min"
										:max="item.first.max"
										v-decorator="[
											`${item.first_value}`,
											{
												rules: [
													{
														required: item.require,
														message: `${item.label}必填`
													}
												],
												validateTrigger: 'blur'
											}
										]"
									/>
								</a-col>
								<a-col
									span="1"
									offset="1"
									>至</a-col
								>
							</a-form-item>
						</a-col>
						<a-col span="7">
							<a-form-item>
								<a-input-number
									style="width: 100%"
									:disabled="disabled"
									:min="item.last.min"
									:max="item.last.max"
									:placeholder="item.placeholder"
									v-decorator="[
										`${item.last_value}`,
										{
											rules: [
												{
													required: item.require,
													message: `${item.label}必填`
												}
											],
											validateTrigger: 'blur'
										}
									]"
								/>
							</a-form-item>
						</a-col>
					</a-row>
				</a-col>

				<a-col
					:span="12"
					v-if="isShowfreightPayMode"
				>
					<a-form-item
						label="其他运费支付方式"
						:label-col="{
							span: 9
						}"
						:wrapper-col="{
							span: 15
						}"
					>
						<a-textarea
							:disabled="disabled"
							v-decorator="[
								'freightPayModeOther',
								{
									rules: [
										{ required: true, message: '其他支付条款必填' },
										{ max: 200, message: '其他支付条款不能超过200个字' }
									],
									validateTrigger: 'blur'
								}
							]"
						>
						</a-textarea>
					</a-form-item>
				</a-col>
			</a-row>
		</a-row>
	</a-form>
</template>

<script>
import { mapGetters } from 'vuex';
import moment from 'moment';
import { API_STATION, API_getReceiverList, API_GETBANKPRODUCTITEM } from '@/v2/center/trade/api/contract';
import { getPopupContainer } from '@/v2/utils/factory.js';
export default {
	name: 'Form',
	props: ['baseInfoData', 'disabled', 'resultDetail', 'OAData', 'notShowTitle', 'fromDetail'],
	computed: {
		...mapGetters('user', {
			VUEX_ST_PERSONALLINFO: 'VUEX_ST_PERSONALLINFO'
		}),
		...mapGetters('order', {
			VUEX_ST_ORDERCREATEINFO: 'VUEX_ST_ORDERCREATEINFO'
		})
	},
	created() {},
	watch: {},
	mounted() {
		// oa走这里逻辑
		if (this.resultDetail) {
			this.setMainFormData(this.resultDetail);
		}
		this.getMoneySource();
	},
	methods: {
		moment,
		filterDownPay(list) {
			return list.filter(item => item.value != 'DOWN_STREAM');
		},
		setMainFormData(contractInfoData, type = '') {
			if (contractInfoData) {
				this.contract = contractInfoData.contract;

				this.contractTemplate = contractInfoData.contract?.contractTemplateName;
				if (this.contractTemplate == this.CONSTANTS.contractTemplateDict.OFFLINE) {
					this.getSHRForOFFLINE('');
				}
				let contract = contractInfoData.contract;
				let contractDelivery = contractInfoData.contractDelivery;
				const hasPayMode = this.baseInfoData.findIndex(item => item.type == 'yfzf');
				if (contractDelivery?.freightPayMode?.toUpperCase() == 'OTHER' && hasPayMode >= 0) {
					this.isShowfreightPayMode = true;
				}
				if (contractDelivery?.freightPayMode == 'DOWN_STREAM') {
					contractDelivery.freightPayMode = '';
				}
				if (type == 'add') {
					this.$nextTick(() => {
						this.form.setFieldsValue({
							...contractDelivery
						});
					});
				} else {
					this.$nextTick(() => {
						// 设置所有值
						this.form.setFieldsValue({
							...contract,
							...contractDelivery,
							consigneeCompanyName: contractDelivery.consigneeCompanyName ? contractDelivery.consigneeCompanyName.split(',') : [],
							consigneeShortName: contractDelivery.consigneeShortName ? contractDelivery.consigneeShortName.split(',') : [],

							shipDischargingPortName: contractDelivery.shipDischargingPortName
								? contractDelivery.shipDischargingPortName.split(',')
								: [],
							shipLoadingPortName: contractDelivery.shipLoadingPortName ? contractDelivery.shipLoadingPortName.split(',') : [],
							deliveryPlace: contractDelivery.deliveryPlace ? contractDelivery.deliveryPlace.split(',') : [],
							trainSendStationName: contractDelivery.trainSendStationName ? contractDelivery.trainSendStationName.split(',') : [],
							trainArriveStationName: contractDelivery.trainArriveStationName
								? contractDelivery.trainArriveStationName.split(',')
								: [],
							deliveryDate: [moment(contractDelivery.deliveryStartDate), moment(contractDelivery.deliveryEndDate)]
						});
					});
				}
			}
		},
		judgeBasePrice(rule, value, callback) {
			// 判断基准价格、保证金
			if (value !== '' && value != null) {
				if (rule.field == 'basePrice') {
					if (!/^(\d{1,4})(.\d{0,2})?$/.test(value)) {
						callback('请输入为小于10000且最多两位小数的数字');
					} else if (value > 10000 || value <= 0) {
						callback('请输入为小于10000且最多两位小数的数字');
					} else {
						callback();
					}
				} else {
					if (!/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(value)) {
						callback('请输入为非负数的数字');
					} else if (!/^(-?)\d+(\.\d{0,2})?$/.test(value)) {
						callback('请输入最多两位小数的数字');
					} else {
						callback();
					}
				}
			}
			callback();
		},

		getFreightPayMode(data) {
			if (data == 'OTHER') {
				this.isShowfreightPayMode = true;
			} else {
				this.isShowfreightPayMode = false;
			}
		},
		// 获取出发站数据
		fetchPlace(data) {
			if (!data) return;
			API_STATION({
				keywords: encodeURIComponent(data)
			}).then(res => {
				if (res.code != 200) {
					this.$message.error(res.message);
					return;
				}
				this.placeData = res.result;
			});
		},
		getBzjValue(data) {
			if (data == 'collected' || data == 'unCollected') {
				this.$parent.hasDeposit = data;
			}
		},

		// 线下合同模板收货人要从下拉列表里选
		getSHRForOFFLINE(v) {
			API_getReceiverList(v).then(res => {
				this.receiverList = res.result || [];
			});
		},
		// 获取资金来源
		getMoneySource() {
			let companyId = null;
			let bankProductCode = null;
			if (this.contract.sellerCompanyId) {
				// 从回显的数据里取
				companyId = this.contract.sellerCompanyId;
				bankProductCode = this.contract.bankProductCode;
			}
			// 从上一步的数据取,获取业务类型，业务类型为其他，资金来源只能选择自有资金
			let businessType = '';
			if (this.VUEX_ST_ORDERCREATEINFO.data && this.VUEX_ST_ORDERCREATEINFO.data.contract) {
				// 卖方双方id均存在
				if (
					this.VUEX_ST_ORDERCREATEINFO.data.contract.sellerCompanyId &&
					this.VUEX_ST_ORDERCREATEINFO.data.contract.buyerCompanyId
				) {
					companyId =
						this.VUEX_ST_ORDERCREATEINFO.data.contract.sellerCompanyId === this.VUEX_ST_PERSONALLINFO.curCompanyId
							? this.VUEX_ST_ORDERCREATEINFO.data.contract.buyerCompanyId
							: this.VUEX_ST_ORDERCREATEINFO.data.contract.sellerCompanyId;
				} else {
					//只存在卖方双方一方时，也就是新建订单，不复制不关联的情况
					companyId =
						this.VUEX_ST_ORDERCREATEINFO.data.contract.sellerCompanyId ||
						this.VUEX_ST_ORDERCREATEINFO.data.contract.buyerCompanyId;
				}
				businessType = this.VUEX_ST_ORDERCREATEINFO.data.contract.businessType;
			}

			if (!companyId) return;

			// 如果资金来源没有匹配到 设置bankProductCode空
			let filter = '1';

			if (this.fromDetail) {
				filter = '0';
			}
			API_GETBANKPRODUCTITEM({
				filter: filter,
				coreCompanyId: this.VUEX_ST_PERSONALLINFO.curCompanyId,
				companyId: companyId
			}).then(res => {
				let data = res.data || [];

				if (businessType == 'OTHER') {
					this.serviceFeePayModeData = data.filter(item => {
						return item.financingType == 'NONE';
					});
				} else {
					this.serviceFeePayModeData = data;
				}
				// 回显资金来源时，两次调用接口，接口响应速度不一样，导致bankProductCode最终为‘’,故bankProductCode为null时，不判断赋值
				if (!bankProductCode) {
					return;
				}
				let flag = false;
				this.serviceFeePayModeData.forEach(item => {
					if (item.code == bankProductCode) {
						flag = true;
					}
				});

				if (!flag) {
					this.form.setFieldsValue({
						bankProductCode: ''
					});
				} else {
					this.form.setFieldsValue({
						bankProductCode: bankProductCode
					});
				}
			});
		}
	},
	data() {
		return {
			form: this.$form.createForm(this),
			isShowfreightPayMode: false,
			shipFormFieldDisabled: false,
			serviceFeePayModeData: [],
			contractTemplate: '',
			placeData: null,
			contract: {},
			receiverList: [],
			getPopupContainer
		};
	}
};
</script>

<style scoped>
h3 {
	font-size: 18px;
}
::v-deep.ant-calendar-picker {
	width: 100%;
}
</style>
