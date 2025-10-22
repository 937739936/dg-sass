<template>
	<div>
		<a-form
			v-if="warehouseReceiptDeliveryType == 'NO_WAREHOUSE_RECEIPT'"
			:form="form"
			:colon="false"
			class="slFormDetail"
		>
			<a-row>
				<a-col :span="8">
					<a-form-item label="提货日期">
						<a-range-picker
							format="YYYY-MM-DD"
							:placeholder="['开始日期', '结束日期']"
							style="width: 100%"
							separator="至"
							v-decorator="[
								`storageDate`,
								{
									rules: [{ required: true, message: '提货日期必填' }]
								}
							]"
						>
							<span
								slot="suffixIcon"
								class="calendar"
							></span>
						</a-range-picker>
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-row
						type="flex"
						justify="center"
					>
						<a-form-item label="提货数量(吨)">
							<a-input-number
								placeholder="请输入提货数量"
								:min="0.0001"
								:max="9999999999.9999"
								:formatter="quantityFormate"
								:parser="quantityFormate"
								v-decorator="[
									'quantity',
									{
										rules: [{ required: true, message: '提货数量必填' }, { validator: amountValidator }],
										validateTrigger: ['change']
									}
								]"
							/>
						</a-form-item>
					</a-row>
				</a-col>
				<a-col :span="8">
					<a-row
						type="flex"
						justify="end"
					>
						<a-form-item label="提货地点">
							<a-select
								style="width: 100%"
								:maxLength="50"
								v-decorator="[
									'place',
									{
										rules: [{ required: true, message: `提货地点必填` }],
										validateTrigger: ['blur']
									}
								]"
								:getPopupContainer="
									triggerNode => {
										return triggerNode.parentNode || document.body;
									}
								"
								placeholder="请输入提货地点"
								show-search
								:default-active-first-option="false"
								:show-arrow="false"
								:filter-option="false"
								:not-found-content="fetching ? undefined : '暂无数据'"
								@select="handlePlaceSelect"
								@search="handlePlaceSearch"
								@focus="handlePlaceSearch"
							>
								<a-spin
									v-if="fetching"
									slot="notFoundContent"
									size="small"
								/>
								<a-select-option
									v-for="item in ladingPlaceList"
									:key="item.stationName"
									:value="item.stationName"
									:title="item.stationName"
									>{{ item.stationName }}</a-select-option
								>
							</a-select>
						</a-form-item>
					</a-row>
				</a-col>
			</a-row>
			<a-row>
				<a-col :span="8">
					<a-row type="flex">
						<a-form-item label="提货联系人姓名">
							<a-input
								style="width: 100%"
								:maxLength="32"
								placeholder="请输入提货联系人姓名"
								v-decorator="[
									'contactName',
									{
										rules: [{ required: true, message: `提货联系人姓名必填` }],
										validateTrigger: ['blur']
									}
								]"
							/>
						</a-form-item>
					</a-row>
				</a-col>
				<a-col :span="8">
					<a-row
						type="flex"
						justify="center"
					>
						<a-form-item label="提货人联系方式">
							<a-input
								style="width: 100%"
								:maxLength="255"
								placeholder="请输入提货人联系方式"
								v-decorator="[
									'contactMode',
									{
										rules: [
											{ required: true, message: `提货人联系方式必填` },
											{
												pattern: /^[1-9]\d{10}$/,
												message: '提货人联系方式不正确'
											}
										],
										validateTrigger: ['blur']
									}
								]"
							/>
						</a-form-item>
					</a-row>
				</a-col>
				<a-col :span="8">
					<a-row
						type="flex"
						justify="end"
					>
						<a-form-item
							label="提货联系人身份证号"
							:colon="false"
						>
							<a-input
								style="width: 100%"
								:maxLength="32"
								placeholder="请输入提货联系人身份证号"
								v-decorator="[
									'idNo',
									{
										rules: [{ required: true, message: `提货联系人身份证号必填` }, { validator: checkIDNumber }],
										validateTrigger: ['blur']
									}
								]"
							/>
						</a-form-item>
					</a-row>
				</a-col>
			</a-row>
			<a-row>
				<a-col :span="8">
					<a-row>
						<a-form-item label="提货工具">
							<div style="display: flex; height: 32px; align-items: center">
								<a-radio-group
									@change="onTransTypeChange"
									v-decorator="[
										'transType',
										{
											rules: [{ required: true, message: '运输方式必选' }],
											validateTrigger: ['blur']
										}
									]"
								>
									<a-radio
										v-for="item in transTypeList"
										:key="item.value"
										:value="item.value"
										>{{ item.label }}</a-radio
									>
								</a-radio-group>
							</div>
						</a-form-item>
					</a-row>
				</a-col>
				<a-col
					:span="8"
					v-if="form.getFieldValue('transType') == 'AUTOMOBILE'"
				>
					<a-row
						type="flex"
						justify="center"
					>
						<a-form-item label="车牌号码">
							<a-input
								style="width: 100%"
								:maxLength="100"
								placeholder="请输入批量录入车牌号用“，”隔开"
								@blur="carNumberInputBlur"
								v-decorator="[
									'carNumberInput',
									{
										rules: [],
										validateTrigger: ['blur']
									}
								]"
							/>
						</a-form-item>
					</a-row>
				</a-col>
			</a-row>
		</a-form>
		<a-form
			v-if="warehouseReceiptDeliveryType == 'WAREHOUSE_RECEIPT'"
			:form="form"
			:colon="false"
			class="slFormDetail"
		>
			<a-row>
				<a-col :span="8">
					<a-form-item label="提货日期">
						<a-range-picker
							format="YYYY-MM-DD"
							:placeholder="['开始日期', '结束日期']"
							style="width: 100%"
							separator="至"
							v-decorator="[
								`storageDate`,
								{
									rules: [{ required: true, message: '提货日期必填' }]
								}
							]"
						>
							<span
								slot="suffixIcon"
								class="calendar"
							></span>
						</a-range-picker>
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-row type="flex">
						<a-form-item label="提货联系人姓名">
							<a-input
								style="width: 100%"
								:maxLength="32"
								placeholder="请输入提货联系人姓名"
								v-decorator="[
									'contactName',
									{
										rules: [{ required: true, message: `提货联系人姓名必填` }],
										validateTrigger: ['blur']
									}
								]"
							/>
						</a-form-item>
					</a-row>
				</a-col>
				<a-col :span="8">
					<a-row
						type="flex"
						justify="center"
					>
						<a-form-item label="提货人联系方式">
							<a-input
								style="width: 100%"
								:maxLength="255"
								placeholder="请输入提货人联系方式"
								v-decorator="[
									'contactMode',
									{
										rules: [
											{ required: true, message: `提货人联系方式必填` },
											{
												pattern: /^[1-9]\d{10}$/,
												message: '提货人联系方式不正确'
											}
										],
										validateTrigger: ['blur']
									}
								]"
							/>
						</a-form-item>
					</a-row>
				</a-col>
			</a-row>
			<a-row>
				<a-col :span="8">
					<a-row type="flex">
						<a-form-item
							label="提货联系人身份证号"
							:colon="false"
						>
							<a-input
								style="width: 100%"
								:maxLength="32"
								placeholder="请输入提货联系人身份证号"
								v-decorator="[
									'idNo',
									{
										rules: [{ required: true, message: `提货联系人身份证号必填` }, { validator: checkIDNumber }],
										validateTrigger: ['blur']
									}
								]"
							/>
						</a-form-item>
					</a-row>
				</a-col>
				<a-col :span="8">
					<a-row>
						<a-form-item label="提货工具">
							<div style="display: flex; height: 32px; align-items: center">
								<a-radio-group
									@change="onTransTypeChange"
									v-decorator="[
										'transType',
										{
											rules: [{ required: true, message: '运输方式必选' }],
											validateTrigger: ['blur']
										}
									]"
								>
									<a-radio
										v-for="item in transTypeList"
										:key="item.value"
										:value="item.value"
										>{{ item.label }}</a-radio
									>
								</a-radio-group>
							</div>
						</a-form-item>
					</a-row>
				</a-col>
				<a-col
					:span="8"
					v-if="form.getFieldValue('transType') == 'AUTOMOBILE'"
				>
					<a-row
						type="flex"
						justify="center"
					>
						<a-form-item label="车牌号码">
							<a-input
								style="width: 100%"
								:maxLength="100"
								placeholder="请输入批量录入车牌号用“，”隔开"
								@blur="carNumberInputBlur"
								v-decorator="[
									'carNumberInput',
									{
										rules: [],
										validateTrigger: ['blur']
									}
								]"
							/>
						</a-form-item>
					</a-row>
				</a-col>
			</a-row>
		</a-form>

		<div>
			<TransportModeTable
				ref="transportModeTable"
				:transportModeInfo="transportModeInfo"
			/>
			<a-form
				:colon="false"
				class="slFormDetail"
			>
				<a-row class="textarea-box">
					<a-form-item
						label="备注"
						style="width: 100%"
					>
						<div class="textarea">
							<a-textarea
								style="border: 0; margin-top: 8px"
								:maxLength="200"
								placeholder="请输入备注，上限200字"
								v-model="remark"
								:auto-size="{ minRows: 1, maxRows: 5 }"
							/>
						</div>
					</a-form-item>
				</a-row>
			</a-form>
		</div>
	</div>
</template>

<script>
import { encryptedData } from '@/v2/utils/factory';
import { API_CHECKIDCARD } from '@/v2/api/account';
import { API_getRelStationData } from '@/v2/center/trade/api/instruct';
import moment from 'moment';
import TransportModeTable from './TransportModeTable.vue';
export default {
	components: {
		TransportModeTable
	},
	name: 'LadingInfoView',
	props: {
		warehouseReceiptDeliveryType: {
			// NO_WAREHOUSE_RECEIPT WAREHOUSE_RECEIPT
			default: ''
		},
		editableLadingInfo: Object
	},
	data() {
		let form = this.$form.createForm(this);

		let transTypeList = [
			{ label: '汽运', value: 'AUTOMOBILE' },
			{ label: '火运', value: 'TRAIN' },
			{ label: '船运', value: 'SHIP' }
		];
		return {
			form: form,
			transTypeList: transTypeList,
			transportModeInfo: {
				// 传给运输方式表格的信息
				oldLadingTransInfoList: [],
				selectTransportMode: undefined
			},
			remark: '', // 备注
			ladingPlaceList: [], // 提货地点
			currentPlace: {}, // 当前仓库
			// pushFlag: false, //
			fetching: false
		};
	},
	computed: {
		detailLadingInfo: function () {
			return this.editableLadingInfo;
		}
	},
	watch: {
		detailLadingInfo: {
			immediate: true,
			handler(newValue) {
				let {
					beginDate,
					endDate,
					quantity,
					stationInfo,
					contactName,
					contactMode,
					idNo,
					transType,
					ladingTransInfoList,
					remark
				} = newValue;
				let storageDate;
				if (beginDate && endDate) {
					storageDate = [moment(beginDate), moment(endDate)];
				}
				this.remark = remark;
				let selectTransportMode;
				// 判断外部传入的运输方式是否在三个可选项里面
				this.transTypeList.map(item => {
					if (item.value == transType) {
						// this.form.setFieldsValue({ transType: newValue });
						selectTransportMode = transType;
					}
				});
				// alert(idNo)
				this.$nextTick(() => {
					this.form.setFieldsValue({
						storageDate,
						quantity,
						place: stationInfo?.stationName,
						contactName,
						contactMode,
						idNo,
						transType: selectTransportMode
					});
				});

				this.transportModeInfo = {
					selectTransportMode: selectTransportMode,
					oldLadingTransInfoList: ladingTransInfoList
				};
				this.currentPlace = stationInfo ?? {};
			}
		}
	},
	methods: {
		amountValidator(rule, value, callback) {
			// if (this.currentPlace && this.currentPlace.whetherToInspectInventory == true) {
			// 	if (value > this.currentPlace.goodsQuantity) {
			// 		callback(`提货数量超出站台总库存，站台总库存${this.currentPlace.goodsQuantity}吨`);
			// 	}
			// }
			callback();
		},

		quantityFormate(value) {
			let reg = /^(-)*(\d+)\.(\d\d\d\d).*$/;
			return String(value).replace(reg, '$1$2.$3');
		},
		onTransTypeChange(e) {
			this.form.setFieldsValue({
				transType: e.target.value
			});
			// this.selectTransportMode = e.target.value;
			this.transportModeInfo = {
				selectTransportMode: e.target.value,
				oldLadingTransInfoList: []
			};
		},
		carNumberInputBlur(e) {
			let inputCarNumber = e.target.value;
			if (!inputCarNumber) {
				return;
			}
			this.$refs.transportModeTable.addCarItems(inputCarNumber);
		},
		async checkIDNumber(rule, value, callback) {
			var name = this.form.getFieldValue('contactName');
			if (!value) {
				callback();
				return;
			}
			if (!name) {
				callback('姓名与身份证号校验不通过，请核实并修改');
				return;
			}
			try {
				let idCard = await encryptedData(value);
				let res = await API_CHECKIDCARD({ name, idCard: idCard });
				if (res.data.result) {
					callback();
				} else {
					callback('姓名与身份证号校验不通过，请核实并修改');
				}
			} catch (error) {
				callback('姓名与身份证号校验失败');
			}
		},
		async onValidateInputInfo() {
			return new Promise((reslove, reject) => {
				this.form.validateFieldsAndScroll(
					{
						scroll: { offsetTop: 80 }
					},
					async (err, values) => {
						//
						if (err) {
							reject('存在错误信息！');
							try {
								await this.$refs.transportModeTable.onValidateLadingTransInfoList();
							} catch (e) {
								console.error(e);
							}
						} else {
							try {
								let info = values;
								let ladingTransInfoList = await this.$refs.transportModeTable.onValidateLadingTransInfoList();
								// if (ladingTransInfoList.length == 0) {
								//   reject("运输方式必选！");
								//   return;
								// }
								if (this.currentPlace) {
									info.stationId = this.currentPlace?.stationId;
								}
								Object.keys(info).forEach(key => info[key] === undefined && delete info[key]);

								info = {
									...info,
									beginDate: moment(values.storageDate[0]).format('YYYY-MM-DD'),
									endDate: moment(values.storageDate[1]).format('YYYY-MM-DD'),
									remark: this.remark,
									transInfoList: ladingTransInfoList
								};
								delete info.storageDate;
								reslove(info);
							} catch (error) {
								reject('运输方式必选！');
							}
						}
					}
				);
			});
		},
		handlePlaceSelect(stationName) {
			const fArr = this.ladingPlaceList.filter(function (item) {
				return item.stationName == stationName;
			});
			if (fArr.length > 0) {
				this.currentPlace = fArr[0];
			}
			this.form.validateFields(['quantity']);
		},
		handlePlaceSearch(name) {
			this.ladingPlaceList = [];
			this.fetching = true;

			API_getRelStationData({
				stationName: name,
				module: 'LADING',
				orderContractId: this.editableLadingInfo.orderContractId,
				contractType: this.editableLadingInfo.contractType
			}).then(res => {
				if (res.success) {
					this.fetching = false;
					this.ladingPlaceList = res.data || [];
					if (this.ladingPlaceList.length == 0) {
						let obj = {};
						obj.stationName = name;
						obj.stationId = null;
						// obj.existed = false;
						// obj.new = true;
						this.ladingPlaceList.push(obj);
					} else {
						let sameFlag = false;
						this.ladingPlaceList.forEach(item => {
							if (item.stationName == name) {
								sameFlag = true;
							}
						});
						if (!sameFlag) {
							let obj = {};
							obj.stationName = name;
							obj.stationId = null;
							// obj.existed = false;
							// obj.new = true;
							this.ladingPlaceList.unshift(obj);
						}
					}
				}
			});
		}
	}
};
</script>

<style lang="less" scoped>
.slFormDetail {
	padding: 0 !important;
	margin: 0 !important;
}
.ant-col {
	height: 82px;
}
.ant-form-item {
	width: 364px;
	margin-bottom: 0;
}
.textarea-box {
	margin-top: 0px;
	/deep/ label {
		color: rgba(0, 0, 0, 0.4);
	}
}
.textarea {
	border: 1px solid #e5e6eb;
	border-radius: 5px;
	p {
		padding-left: 10px;
		color: rgba(0, 0, 0, 0.5);
		font-family: PingFang SC;
		font-size: 12px;
	}
	/deep/ .ant-select-selection {
		border: 0;
	}
}
</style>
