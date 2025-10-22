<template>
	<div>
		<a-form
			:form="form"
			:colon="false"
			class="slFormDetail"
		>
			<a-row>
				<a-col :span="8">
					<a-form-item label="放货日期">
						<a-range-picker
							format="YYYY-MM-DD"
							:placeholder="['开始日期', '结束日期']"
							:disabledDate="disabledDate"
							@openChange="onOpenChange"
							@calendarChange="onCalendarChange"
							style="width: 100%"
							v-decorator="[
								`storageDate`,
								{
									rules: [{ required: true, message: '放货日期必填' }, { validator: dateRangeValidator }]
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
						<a-form-item label="放货数量(吨)">
							<a-input-number
								placeholder="请输入放货数量"
								:min="0.0001"
								:max="99999999.9999"
								:formatter="quantityFormate"
								:parser="quantityFormate"
								v-decorator="[
									'quantity',
									{
										rules: [{ required: true, message: '放货数量必填' }, { validator: amountValidator }],
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
						<a-form-item label="仓库名称">
							<a-select
								style="width: 100%"
								:maxLength="50"
								v-decorator="[
									'place',
									{
										rules: [{ required: true, message: `仓库名称必填` }],
										validateTrigger: ['blur']
									}
								]"
								:getPopupContainer="
									triggerNode => {
										return triggerNode.parentNode || document.body;
									}
								"
								placeholder="请输入仓库名称"
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
									:key="item.stationId"
									:value="item.stationId"
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
				<a-col
					:span="8"
					style="height: unset"
				>
					<a-row>
						<a-form-item label="运输方式">
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
			</a-row>
		</a-form>
		<TransportModeTable
			ref="transportModeTable"
			:transportModeInfo="transportModeInfo"
			:showAutomobileTable="false"
		/>
		<a-row class="textarea-box">
			<a-form-item
				label="备注"
				style="width: 100%"
				:colon="false"
			>
				<div class="textarea">
					<a-textarea
						style="height: 80px; border: 0; margin-top: 10px"
						:maxLength="200"
						placeholder="请输入备注，上限200字"
						v-model="remark"
					/>
				</div>
			</a-form-item>
		</a-row>
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
	name: 'DeliveryInfoView',
	props: {
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
			ladingPlaceList: [], // 仓库列表
			currentPlace: {}, // 当前仓库
			// pushFlag: false, //
			fetching: false,
			dates: []
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
				this.form.setFieldsValue({
					storageDate,
					quantity,
					place: stationInfo?.stationName,
					contactName,
					contactMode,
					idNo,
					transType: selectTransportMode
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
		dateRangeValidator(rule, value, callback) {
			// ○ 结束日期只能选择当日及当日之后的日期
			if (value && value.length == 2 && value[1].isBefore(moment().startOf('day'))) {
				callback('结束日期只能选择当日及当日之后的日期');
				return;
			}
			callback();
		},
		// ○ 数据校验：录入数值需小于等于当前站台总库存，超出则高亮提示：放货数量超出站台总库存，站台总库存X吨
		amountValidator(rule, value, callback) {
			if (this.currentPlace && value > this.currentPlace.goodsQuantity) {
				callback(`放货数量超出站台总库存，站台总库存${this.currentPlace.goodsQuantity}吨`);
				return;
			}
			callback();
		},
		onOpenChange(isOpen) {
			if (isOpen) {
				this.dates = [];
			}
		},
		onCalendarChange(val) {
			this.dates.value = val;
		},
		disabledDate(current) {
			if (!this.dates.value || this.dates.value.length === 0) {
				return false;
			}
			return current.isBefore(moment().startOf('day'));
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
								info = {
									...info,
									stationId: this.currentPlace?.stationId,
									place: this.currentPlace?.stationName,
									beginDate: moment(values.storageDate[0]).format('YYYY-MM-DD'),
									endDate: moment(values.storageDate[1]).format('YYYY-MM-DD'),
									remark: this.remark,
									ladingTransInfoList: ladingTransInfoList
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
		handlePlaceSelect(stationid) {
			const fArr = this.ladingPlaceList.filter(function (item) {
				return item.stationId == stationid;
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
				module: 'RELEASE_INSTRUCT',
				orderContractId: this.editableLadingInfo.orderContractId,
				contractType: this.editableLadingInfo.contractType
			}).then(res => {
				if (res.success) {
					this.fetching = false;
					this.ladingPlaceList = res.data || [];
				}
			});
		}
	}
};
</script>

<style lang="less" scoped>
.slFormDetail {
	padding-top: 0px;
}
.ant-col {
	height: 82px;
}
.ant-form-item {
	width: 364px;
	margin-bottom: 0;
}
.textarea-box {
	margin-bottom: 50px;
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
