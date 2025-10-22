<template>
	<div class="deliver-info-com">
		<a-form
			:form="deliverForm"
			layout="inline"
		>
			<a-row class="receivingInfoBox">
				<a-col
					:span="12"
					class="row"
				>
					<a-form-item
						label="收货数量(吨)"
						:colon="false"
					>
						<a-input
							:disabled="disabled"
							placeholder="收货数量(吨)"
							v-decorator="[
								'deliverQuantity',
								{
									rules: [
										{ required: true, message: '请输入收货数量' },
										{ pattern: /^\d+(\.\d{0,2})?$/, message: '收货数量为数字且不允许为负数，最多两位小数' }
									],
									validateTrigger: 'blur'
								}
							]"
						/>
					</a-form-item>
				</a-col>
				<a-col
					:span="12"
					class="row"
				>
					<a-form-item
						label="收货日期"
						:colon="false"
					>
						<a-date-picker
							:disabled="disabled"
							placeholder="收货日期"
							format="YYYY-MM-DD"
							@change="getTime"
							v-decorator="['deliverDate', { rules: [{ required: true, message: '请输入收货日期' }] }]"
						/>
					</a-form-item>
				</a-col>
				<template v-if="params.coalType == CONSTANTS.coalTypeDict.STEAM_COAL">
					<div class="receivingInfoBox">
						<!--质量指标-->
						<order-form
							:baseNumData="baseNumData"
							:noExpand="true"
							:noHeader="true"
							:disabled="disabled"
							ref="quantityForm"
						></order-form>
					</div>
				</template>
			</a-row>
		</a-form>
	</div>
</template>
<script>
import orderForm from '@/v2/center/trade/components/orderForm/BasicInfoForm';
import coalTypeData from '@/v2/utils/order/coalTypeData.js';

export default {
	name: 'DeliverInfoCom',
	components: {
		orderForm
	},
	props: {
		params: {
			type: Object,
			default: () => {
				return {};
			}
		},
		disabled: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			deliverDate: '',
			baseNumData: [],
			deliverForm: this.$form.createForm(this)
		};
	},
	computed: {},
	mounted() {
		this.init();
	},
	methods: {
		init() {
			this.$nextTick(() => {
				let data = Object.assign({}, this.params);
				this.deliverDate = data.deliverDate;
				this.deliverForm.setFieldsValue({
					deliverDate: data.deliverDate,
					deliverQuantity: data.deliverQuantity
				});
				// 设置质量指标
				this.baseNumData = coalTypeData['receive'][data.coalType];

				this.$refs.quantityForm.setBasicInfoFormData(JSON.parse(data.cokeIndexInfo));
			});
		},
		/*
		 * 验证并获取基准质量指标数据
		 */
		validQuantity() {
			let result = false;
			this.$refs.quantityForm.qualityForm.validateFieldsAndScroll((e, v) => {
				let obj = {};
				for (let key in v) {
					if (v[key]) {
						obj[key] = parseFloat(v[key]);
					} else {
						obj[key] = null;
					}
				}
				this.qualityData = obj;
				if (e) {
					result = false;
				} else {
					result = true;
				}
			});
			return result;
		},
		getTime(value, dateString) {
			this.deliverDate = dateString;
		},

		validateDeliverData() {
			// let that = this
			// let defaultObj = (this.params.linkReceiveRecordRespList && this.params.linkReceiveRecordRespList[0]) || {}
			// let obj = this.getData()
			// if (obj.heatingVal !== defaultObj.heatingVal
			//   || obj.deliverDate !== defaultObj.receiveDate
			//   || obj.deliverQuantity !== defaultObj.receiveQuantity
			//   || obj.sulfurContent !== defaultObj.sulfurContent
			//   || ((obj.volatileContent || defaultObj.volatileContent) && obj.volatileContent !== defaultObj.volatileContent)
			//   || ((obj.waterContent || defaultObj.waterContent) && obj.waterContent !== defaultObj.waterContent)
			//   || ((obj.ashContent || defaultObj.ashContent) && obj.ashContent !== defaultObj.ashContent)
			//   || ((obj.meltContent || defaultObj.meltContent) && obj.meltContent !== defaultObj.meltContent)) {
			//   that.$confirm({
			//     centered:true,
			//     title: "修改后的数据与关联的发货记录不一致，是否确认提交？",
			//     okText: '确定',
			//     cancelText: '取消',
			//     onOk() {
			//       that.$emit('confirm')
			//     },
			//     onCancel() {}
			//   });
			// } else {

			// }
			this.$emit('confirm');
		},
		getData() {
			let params = {
				// qualityData:this.qualityData,
				deliverDate: this.deliverDate,
				deliverQuantity: this.deliverForm.getFieldValue('deliverQuantity')
			};

			// 质量指标
			if (!this.validQuantity()) {
				return;
			}
			params.cokeIndexInfo = JSON.stringify(this.qualityData);
			return params;
		}
	},
	watch: {
		params: {
			deep: true,
			handler() {
				this.init();
			}
		}
	}
};
</script>
<style lang="less">
.receivingInfoBox {
	label {
		width: 130px !important;
		white-space: pre-wrap;
		line-height: 18px;
		&:after {
			display: none;
		}
		font-size: 15px !important;
		margin-right: 30px !important;
	}
	.range {
		.ant-col-10 {
			width: 100px;
			min-height: 60px;
		}
		.ant-form-item-control {
			width: 240px;
		}
		.range-inner {
			.ant-form-item-control {
				width: 100px;
			}
		}

		input {
			width: 100px !important;
		}
	}
	.ant-form-item-control {
		width: 240px;
		min-height: 60px;
		input {
			width: 240px;
		}
	}
}
.deliver-info-com {
	::v-deep.ant-form-item-control.has-error {
		position: absolute !important;
		white-space: nowrap;
	}
}
</style>
