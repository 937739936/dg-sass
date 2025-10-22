<template>
	<div>
		<a-form
			:form="form"
			:colon="false"
			class="slFormDetail"
			v-if="!disabled || (disabled && !contractInfo.contractNo)"
		>
			<a-form-item
				label="选择销售合同"
				required
			>
				<a-input
					readOnly
					style="width: 364px"
					:disabled="checkBox"
					:placeholder="checkBox ? '' : '请点击选择该发货批次归属的销售合同'"
					@click="clickContractInput"
					v-decorator="[
						'contractNo',
						{
							rules: [
								{
									required: true,
									message: '选择销售合同',
									whitespace: true
								}
							]
						}
					]"
				/>
				<a-checkbox
					style="width: 20%; margin-left: 14px"
					v-model="checkBox"
					@change="changeCheckBox"
					:disabled="disabled"
				>
					暂不关联
				</a-checkbox>
			</a-form-item>
		</a-form>
		<a-descriptions
			bordered
			style="padding: 0; margin-bottom: 30px"
			v-if="form.getFieldValue('contractNo') || (disabled && contractInfo.contractNo)"
			class="specialItem"
		>
			<a-descriptions-item label="合同编号">
				<div
					@mouseenter="()=>{this.copyContractNoVisible = true}"
					@mouseleave="()=>{this.copyContractNoVisible = false}"
				>
					<a
						class="contractNo"
						href="javascript:;"
						@click="goContractDetail"
					>
						{{ contractInfo.contractNo }}</a
					>
					<span
						v-show="!copyContractNoVisible"
						class="copy-icon"
						>
						<Copy></Copy>
					</span>
					<span
						v-show="copyContractNoVisible"
						v-clipboard:success="onCopy" 
						v-clipboard:error="onError"  
						v-clipboard:copy="contractInfo.contractNo"
						class="copy-icon"
						>
						<CopyNow></CopyNow>
					</span>
				</div>
				<!-- <img src="~@/v2/assets/imgs/receive/contract-icon.png" alt="" style="width: 14px;margin-left: 4px;cursor: pointer" @click="goContractDetail"> -->
			</a-descriptions-item>
			<a-descriptions-item label="订单编号">
				{{ contractInfo.orderSerialNo }}
			</a-descriptions-item>
			<a-descriptions-item label="基准价格">
				<TextOverFlow
					v-if="contractInfo.basePriceDesc"
					:content="contractInfo.basePriceDesc"
					:maxWidth="160"
				/>
				<TextOverFlow
					v-else-if="contractInfo.basePrice"
					:content="contractInfo.basePrice + '元/吨'"
					:maxWidth="160"
				/>
				<span v-else>-</span>
			</a-descriptions-item>
			<a-descriptions-item label="数量">
				{{ contractInfo.quantity }} 吨 <span v-if="contractInfo.quantityOffset">（±{{ contractInfo.quantityOffset }}%）</span>
			</a-descriptions-item>
			<a-descriptions-item label="交货期限">
				{{ contractInfo.deliveryStartDate }} ~ {{ contractInfo.deliveryEndDate }}
			</a-descriptions-item>
			<a-descriptions-item label="运输方式">
				{{ contractInfo.transType | filterCodeByValueName('despatchTypeDict') }}
			</a-descriptions-item>
			<a-descriptions-item label="交货方式">
				{{ contractInfo.deliveryType | filterCodeByValueName('order_delivery_type') }}
			</a-descriptions-item>
			<a-descriptions-item
				label="产地"
				v-if="contractInfo.originPlace"
			>
				{{ contractInfo.originPlace }}
			</a-descriptions-item>
			<a-descriptions-item
				label="发货点"
				v-if="contractInfo.sendGoodsAddress"
			>
				{{ contractInfo.sendGoodsAddress }}
			</a-descriptions-item>
			<template v-if="contractInfo.transType == 'SHIP'">
				<a-descriptions-item
					label="装货港"
					v-if="contractInfo.shipLoadingPortName"
				>
					{{ contractInfo.shipLoadingPortName }}
				</a-descriptions-item>
				<a-descriptions-item
					label="卸货港"
					v-if="contractInfo.shipDischargingPortName"
				>
					{{ contractInfo.shipDischargingPortName }}
				</a-descriptions-item>
			</template>
			<template v-if="contractInfo.transType == 'TRAIN' || contractInfo.transType == 'AUTOMOBILE_AND_TRAIN'">
				<a-descriptions-item
					label="发站"
					v-if="contractInfo.deliveryStationList"
				>
					{{ contractInfo.deliveryStationList }}
				</a-descriptions-item>
				<a-descriptions-item
					label="到站"
					v-if="contractInfo.arriveStationList"
				>
					{{ contractInfo.arriveStationList }}
				</a-descriptions-item>
			</template>
			<a-descriptions-item
				label="托运人"
				v-if="contractInfo.consignorCompanyName"
			>
				{{ contractInfo.consignorCompanyName }}
			</a-descriptions-item>
			<a-descriptions-item
				label="收货人"
				v-if="contractInfo.consigneeCompanyName"
			>
				{{ contractInfo.consigneeCompanyName }}
			</a-descriptions-item>
			<a-descriptions-item
				label="运费支付方式"
				v-if="contractInfo.freightPayMode"
			>
				{{ contractInfo.freightPayMode | filterCodeByValueName('freightPayTypeDict') }}
			</a-descriptions-item>
			<a-descriptions-item
				label="其他运费支付方式"
				v-if="contractInfo.freightPayModeOther"
			>
				{{ contractInfo.freightPayModeOther }}
			</a-descriptions-item>
		</a-descriptions>
		<SelectContractModal
			ref="selectContractModal"
			@ok="selectContract"
		/>
	</div>
</template>

<script>
import SelectContractModal from '@/v2/center/trade/views/receive/components/SelectContractModal';
import { API_getSelectContractDetail } from '@/v2/center/trade/api/receive';
import { filterCodeByValueName } from'@sub/utils/globalCode.js';
import { mapGetters } from 'vuex';
import TextOverFlow from "@sub/components/TextOverflow.vue";
import { Copy, CopyNow } from '@sub/components/svg'
export default {
	props: {
		disabled: {
			type: Boolean,
			default: () => {
				return false;
			}
		},
		contractVo: {
			type: Object,
			default: () => {
				return {};
			}
		},
		deliverInfo: {
			type: Object,
			default: () => {
				return {};
			}
		}
	},
	data() {
		return {
			form: this.$form.createForm(this),
			checkBox: false,
			orderId: '',
			contractInfo: {},
			copyContractNoVisible: false,
		};
	},
	watch: {
		contractVo(data) {
			this.contractInfo = data;
		}
	},
	components: {
		SelectContractModal,
		TextOverFlow,
		Copy,
		CopyNow
	},
	filters: {
		filterCodeByValueName
	},
	...mapGetters('contract', {
		VUEX_GET_FORM_SCHEMA: 'VUEX_GET_FORM_SCHEMA'
	}),
	mounted() {
		if (this.$route.query.orderId) {
			this.orderId = this.$route.query.orderId;
			this.getSelectDetail();
		} else {
			this.checkBox = true;
		}
	},
	methods: {
		getSelectDetail() {
			API_getSelectContractDetail({ orderId: this.orderId }).then(res => {
				if (res.success) {
					this.contractInfo = res.result;
					this.form.setFieldsValue({
						contractNo: this.contractInfo.contractNo
					});
					this.$router.push({
						path: '/center/receive/send/apply',
						query: {
							orderId: this.contractInfo.orderId,
							deliverId: this.$route.query.deliverId
						}
					});
					this.$emit('select', this.contractInfo);
					this.$emit('change', this.contractInfo.contractNo);
				}
			});
		},
		clickContractInput() {
			this.$refs.selectContractModal.init();
		},
		changeCheckBox(e) {
			if (e) {
				this.$router.push({
					path: '/center/receive/send/apply',
					query: this.$route.query
				});
				this.form.setFieldsValue({
					contractNo: ''
				});
				this.$emit('change', '');
			}
		},
		selectContract(orderId) {
			if (orderId) {
				this.form.setFieldsValue({
					contractNo: ''
				});
				this.orderId = orderId;
				this.getSelectDetail();
			} else {
				this.changeCheckBox(true);
				this.checkBox = true;
			}
		},
		// 复制成功 or 失败（提示信息！！！）
		onCopy: function (e) {
			this.$message.success('复制成功');
		},
		onError: function (e) {
			this.$message.error('复制失败');
		},
		goContractDetail() {
			window.open(`/center/contract/sell/online/detail?type=SELL&id=${this.contractInfo.orderId}`);
		}
	}
};
</script>
<style lang="less" scoped>
/deep/ .ant-descriptions-bordered .ant-descriptions-item-label {
	background-color: #f3f5f6;
	color: #77889d;
}

/deep/ .ant-descriptions-item-content {
	color: rgba(0, 0, 0, 0.8);
}
.contractNo:hover {
	text-decoration: underline;
}
.copy-icon {
	width: 14px;
	margin-left: 4px;
	cursor: pointer;
	position: relative;
	top: 2px;
}
.specialItem {
	.textOverflow {
		position: relative;
		top: 0px;
		left: 0;
	}
}
</style>
