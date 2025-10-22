<template>
	<div>
		<a-form
			:form="form"
			class="slFormDetail"
			:colon="false"
		>
			<a-row>
				<a-col :span="8">
					<a-form-item label="快递公司">
						<a-select
							:disabled="editDisabled"
							v-decorator="['expressMailType', { rules: [{ required: true, message: '请选择快递公司' }] }]"
							:getPopupContainer="getPopupContainer"
							placeholder="请选择"
						>
							<a-select-option
								:value="item.value"
								v-for="item in expressList"
								:key="item.value"
							>
								{{ item.text }}
							</a-select-option>
						</a-select>
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-row
						type="flex"
						justify="center"
					>
						<a-form-item label="快递单号">
							<a-input
								:disabled="editDisabled"
								:maxLength="50"
								v-decorator="[
									`expressOrderNo`,
									{
										rules: [{ required: true, message: `请输入快递单号` }, { validator: validator.validLetterAndNumber }]
									}
								]"
								placeholder="请输入快递单号"
							/>
						</a-form-item>
					</a-row>
				</a-col>
			</a-row>
			<a-row>
				<a-col :span="8">
					<a-form-item label="寄件人姓名">
						<a-input
							:disabled="editDisabled"
							:maxLength="50"
							v-decorator="[
								`senderName`,
								{
									rules: [{ required: true, message: `请输入寄件人姓名` }, { validator: validator.validLetterOrNumberOrHanzi }]
								}
							]"
							placeholder="请输入寄件人姓名"
						/>
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-row
						type="flex"
						justify="center"
					>
						<a-form-item label="寄件人电话">
							<a-input
								:disabled="editDisabled"
								:maxLength="20"
								v-decorator="[
									`senderMobile`,
									{
										rules: [{ required: true, message: `请输入寄件人电话` }, { validator: validator.validIdTel }]
									}
								]"
								placeholder="请输入寄件人电话"
							/>
						</a-form-item>
					</a-row>
				</a-col>
				<a-col :span="8">
					<a-row
						type="flex"
						justify="end"
					>
						<a-col>
							<a-form-item
								label="寄件地址"
								style="width: 130px"
							>
								<a-cascader
									:disabled="editDisabled"
									:getPopupContainer="getPopupContainer"
									:options="options"
									:load-data="loadData"
									placeholder="选择省市区"
									v-decorator="[
										`sendA`,
										{
											rules: [{ required: true, message: `选择省市区` }]
										}
									]"
								/>
							</a-form-item>
						</a-col>
						<a-col style="margin-left: 10px">
							<a-form-item
								label="寄件地址"
								style="width: 224px"
								class="quantity-box"
							>
								<a-input
									:disabled="editDisabled"
									:maxLength="50"
									v-decorator="[
										`sendDetailAddress`,
										{
											rules: [{ required: true, message: `请输入详细地址` }]
										}
									]"
									placeholder="请输入详细地址"
								/>
							</a-form-item>
						</a-col>
					</a-row>
				</a-col>
				<a-col :span="8">
					<a-form-item label="收件人姓名">
						<a-input
							:disabled="editDisabled"
							:maxLength="50"
							v-decorator="[
								`receiverName`,
								{
									rules: [{ required: true, message: `请输入收件人姓名` }, { validator: validator.validLetterOrNumberOrHanzi }]
								}
							]"
							placeholder="请输入收件人姓名"
						/>
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-row
						type="flex"
						justify="center"
					>
						<a-form-item label="收件人电话">
							<a-input
								:disabled="editDisabled"
								:maxLength="20"
								v-decorator="[
									`receiverMobile`,
									{
										rules: [{ required: true, message: `请输入收件人电话` }, { validator: validator.validIdTel }]
									}
								]"
								placeholder="请输入收件人电话"
							/>
						</a-form-item>
					</a-row>
				</a-col>
				<a-col :span="8">
					<a-row
						type="flex"
						justify="end"
					>
						<a-col>
							<a-form-item
								label="收件地址"
								style="width: 130px"
							>
								<a-cascader
									:disabled="editDisabled"
									:getPopupContainer="getPopupContainer"
									:options="options"
									:load-data="loadData"
									placeholder="选择省市区"
									v-decorator="[
										`receiveA`,
										{
											rules: [{ required: true, message: `选择省市区` }]
										}
									]"
								/>
							</a-form-item>
						</a-col>
						<a-col style="margin-left: 10px">
							<a-form-item
								label="寄件地址"
								style="width: 224px"
								class="quantity-box"
							>
								<a-input
									:disabled="editDisabled"
									:maxLength="50"
									v-decorator="[
										`receiveDetailAddress`,
										{
											rules: [{ required: true, message: `请输入详细地址` }]
										}
									]"
									placeholder="请输入详细地址"
								/>
							</a-form-item>
						</a-col>
					</a-row>
				</a-col>
			</a-row>
		</a-form>
	</div>
</template>

<script>
import { getPopupContainer } from '@/v2/utils/factory.js';
import { API_BIZPROVINCELIST, API_BIZCITYLIST, API_BIZAREALIST } from '@/v2/center/trade/api/contract';
import { filterCodeByKey } from '@sub/utils/globalCode.js';
import { validIdTel, validLetterOrNumberOrHanzi, validLetterAndNumber } from '@/v2/utils/validForm';
export default {
	props: {
		isBuyContract: {
			type: Boolean,
			default: false
		},
		orderType: {
			type: String,
			default: ''
		},
		isOa: {
			type: Boolean,
			default: false
		},
		canEdit: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			form: this.$form.createForm(this, {
				onValuesChange: this.onValuesChange
			}),
			getPopupContainer,
			contractType: 'buy',
			signWayList: filterCodeByKey('offlineContractSignWayEnum'), // 签订过程留痕信息-合同签订方式
			expressList: filterCodeByKey('expressMailEnum'),
			validator: {
				validLetterOrNumberOrHanzi,
				validIdTel,
				validLetterAndNumber
			},
			options: [],
			editDisabled: false
		};
	},
	mounted() {
		this.contractType = this.$route.query.type;
		this.getProvinceData();

		// 销售合同 编辑
		if (this.$route.query.id && this.$route.query.type === 'sell') {
			if (this.$route.query.whetherEditAllBoo === 'false' && !(this.$route.query.whetherHaveRelAuditBoo === 'true')) {
				this.editDisabled = true;
			}
		}
	},
	methods: {
		async init(info) {
			let terminalContractSignLhDto = info.terminalContractExtensionDto.terminalContractSignLhDto;
			this.form.setFieldsValue(terminalContractSignLhDto.expressMailInfo);
			await this.getProvinceData();
			this.$nextTick(() => {
				this.form.setFieldsValue({
					sendA: [
						terminalContractSignLhDto.expressMailInfo.sendProvince,
						terminalContractSignLhDto.expressMailInfo.sendCity,
						terminalContractSignLhDto.expressMailInfo.sendArea
					],
					receiveA: [
						terminalContractSignLhDto.expressMailInfo.receiveProvince,
						terminalContractSignLhDto.expressMailInfo.receiveCity,
						terminalContractSignLhDto.expressMailInfo.receiveArea
					]
				});
			});
		},
		save() {
			return new Promise(resolve => {
				this.form.validateFieldsAndScroll((err, value) => {
					if (!err) {
						resolve(value);
					} else {
						resolve(false);
					}
				});
			});
		},
		//监听表单值的变化
		async onValuesChange(props, values) {
			//地址变化,反向渲染
			if (values.hasOwnProperty('sendA')) {
				let option = this.options.filter(item => {
					return item.value == values.sendA[0];
				});
				if (!option[0].children) {
					await this.loadData(option);
				}
				let options = option[0].children.filter(item => {
					return item.value == values.sendA[1];
				});
				if (!options[0].children) {
					await this.loadData(options);
				}
			}
			if (values.hasOwnProperty('receiveA')) {
				let option = this.options.filter(item => {
					return item.value == values.receiveA[0];
				});
				if (!option[0].children) {
					await this.loadData(option);
				}
				let options = option[0].children.filter(item => {
					return item.value == values.receiveA[1];
				});
				if (!options[0].children) {
					await this.loadData(options);
				}
			}
		},
		async loadData(selectedOptions) {
			const targetOption = selectedOptions[selectedOptions.length - 1];

			targetOption.loading = true;
			let children = [];
			if (targetOption.hierarchy == 1) {
				//选择省
				children = await this.getCityData(targetOption.value);
			} else if (targetOption.hierarchy == 2) {
				//选择市
				children = await this.getAreaData(targetOption.value);
			}
			if (children.length) {
				targetOption.children = children;
			} else {
				targetOption.isLeaf = true;
			}
			targetOption.loading = false;
			this.options = [...this.options];
		},

		// 获取省
		async getProvinceData() {
			let res = await API_BIZPROVINCELIST({ countryCode: 1, containsAll: true, t: Math.random() });
			if (res.success) {
				this.options = res.result.map(item => {
					return {
						value: item.code,
						label: item.name,
						hierarchy: 1,
						isLeaf: false
					};
				});
			}
		},
		// 获取市
		async getCityData(provinceCode) {
			let options = [];
			let res = await API_BIZCITYLIST({ provinceCode, containsAll: true });
			if (res.success) {
				options = res.result.map(item => {
					return {
						value: item.code,
						label: item.name,
						hierarchy: 2,
						isLeaf: false
					};
				});
			}
			return options;
		},
		// 获取区县
		async getAreaData(cityCode) {
			let options = [];
			let res = await API_BIZAREALIST({ cityCode, containsAll: true });
			if (res.success) {
				options = res.result
					.filter(item => {
						return item;
					})
					.map(item => {
						return {
							value: item?.code,
							label: item?.name
						};
					});
			}
			return options;
		}
	},
	components: {}
};
</script>

<style lang="less" scoped>
/deep/ .ant-radio-inner::after {
	background: #fff;
}
/deep/ .ant-radio-checked .ant-radio-inner {
	background: @primary-color;
}
.ant-col {
	height: 82px;
}
.ant-form-item {
	width: 364px;
	margin-bottom: 0;
}
.quantity-box {
	/deep/ .ant-form-item-label {
		opacity: 0;
	}
}
/deep/ .ant-cascader-picker {
	.ant-cascader-picker-arrow {
		display: inline-block;
		width: 14px;
		height: 14px;
		background: url(~@/v2/assets/imgs/common/drop_down_icon.png) no-repeat 100% / cover;
		& > svg {
			display: none;
		}
	}
}
</style>
