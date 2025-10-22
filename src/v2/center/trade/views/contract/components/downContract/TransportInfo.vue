<template>
	<div>
		<a-form
			:form="form"
			class="slFormDetail"
			:colon="false"
		>
			<a-row>
				<a-col :span="8">
					<a-row type="flex">
						<a-form-item label="运输方式">
							<a-select
								:getPopupContainer="getPopupContainer"
								v-decorator="[
									`transportMode`,
									{
										rules: [
											{
												required: true,
												message: `运输方式必填`
											}
										]
									}
								]"
							>
								<a-select-option
									v-for="(items, index) in transportMode"
									:key="index"
									:value="items.value"
								>
									{{ items.name }}
								</a-select-option>
							</a-select>
						</a-form-item>
					</a-row>
				</a-col>
				<template v-if="form.getFieldValue('transportMode') == 'AUTOMOBILE_AND_TRAIN'">
					<a-col :span="8">
						<a-row
							type="flex"
							justify="center"
						>
							<a-form-item
								label="发站"
								:colon="false"
							>
								<a-select
									showSearch
									mode="multiple"
									:showArrow="false"
									:filterOption="false"
									:defaultActiveFirstOption="false"
									@search="fetchPlace"
									:getPopupContainer="getPopupContainer"
									placeholder="请输入内容进行查询"
									v-decorator="[
										`trainSendStationName`,
										{
											rules: [
												{
													required: contractType == 'buy',
													message: `发站必填`
												}
											]
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
							</a-form-item>
						</a-row>
					</a-col>
					<a-col :span="8">
						<a-row
							type="flex"
							justify="end"
						>
							<a-form-item
								label="到站"
								:colon="false"
							>
								<a-select
									showSearch
									mode="multiple"
									:showArrow="false"
									:filterOption="false"
									:defaultActiveFirstOption="false"
									@search="fetchPlace"
									:getPopupContainer="getPopupContainer"
									placeholder="请输入内容进行查询"
									v-decorator="[
										`trainArriveStationName`,
										{
											rules: [
												{
													required: true,
													message: `到站必填`
												}
											]
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
							</a-form-item>
						</a-row>
					</a-col>
				</template>
				<template v-if="form.getFieldValue('transportMode') == 'SHIP'">
					<a-col :span="8">
						<a-row
							type="flex"
							justify="center"
						>
							<a-form-model-item
								label="装货港"
								:colon="false"
							>
								<a-select
									v-bind="selectTagsProps"
									:getPopupContainer="getPopupContainer"
									placeholder="请输入装货港"
									v-decorator="[
										`shipLoadingPortName`,
										{
											rules: [
												{
													required: true,
													message: `装货港必填`
												}
											]
										}
									]"
								>
								</a-select>
							</a-form-model-item>
						</a-row>
					</a-col>
					<a-col :span="8">
						<a-row
							type="flex"
							justify="end"
						>
							<a-form-item
								label="卸货港"
								:colon="false"
							>
								<a-select
									v-bind="selectTagsProps"
									:getPopupContainer="getPopupContainer"
									placeholder="请输入卸货港"
									v-decorator="[
										`shipDischargingPortName`,
										{
											rules: [
												{
													required: true,
													message: `卸货港必填`
												}
											]
										}
									]"
								>
								</a-select>
							</a-form-item>
						</a-row>
					</a-col>
				</template>
				<template v-if="form.getFieldValue('transportMode') == 'TRAIN'">
					<a-col :span="8">
						<a-row
							type="flex"
							justify="center"
						>
							<a-form-item
								label="发站"
								:colon="false"
							>
								<a-select
									showSearch
									mode="multiple"
									:showArrow="false"
									:filterOption="false"
									:defaultActiveFirstOption="false"
									@search="fetchPlace"
									:getPopupContainer="getPopupContainer"
									placeholder="请输入内容进行查询"
									v-decorator="[
										`trainSendStationName`,
										{
											rules: [
												{
													required: contractType == 'buy',
													message: `发站必填`
												}
											]
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
							</a-form-item>
						</a-row>
					</a-col>
					<a-col :span="8">
						<a-row
							type="flex"
							justify="end"
						>
							<a-form-item
								label="到站"
								:colon="false"
							>
								<a-select
									showSearch
									mode="multiple"
									:showArrow="false"
									:filterOption="false"
									:defaultActiveFirstOption="false"
									@search="fetchPlace"
									:getPopupContainer="getPopupContainer"
									placeholder="请输入内容进行查询"
									v-decorator="[
										`trainArriveStationName`,
										{
											rules: [
												{
													required: true,
													message: `到站必填`
												}
											]
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
							</a-form-item>
						</a-row>
					</a-col>
				</template>
				<template v-if="form.getFieldValue('transportMode') == 'AUTOMOBILE'">
					<a-col :span="8">
						<a-row
							type="flex"
							justify="center"
						>
							<a-form-item
								label="发货地址"
								:colon="false"
							>
								<a-input
									placeholder="请输入发货地址"
									:maxLength="50"
									v-decorator="[
										`sendGoodsAddress`,
										{
											rules: [
												{
													required: contractType == 'buy',
													message: `发货地址必填`
												}
											]
										}
									]"
								>
								</a-input>
							</a-form-item>
						</a-row>
					</a-col>
					<a-col :span="8">
						<a-row
							type="flex"
							justify="end"
						>
							<a-form-item
								label="收货地址"
								:colon="false"
							>
								<a-input
									placeholder="请输入收货地址"
									:maxLength="50"
									v-decorator="[
										`receiveGoodsAddress`,
										{
											rules: [
												{
													required: true,
													message: `收货地址必填`
												}
											]
										}
									]"
								>
								</a-input>
							</a-form-item>
						</a-row>
					</a-col>
				</template>
			</a-row>
			<a-row
				v-if="form.getFieldValue('transportMode') == 'AUTOMOBILE_AND_TRAIN'"
				style="margin-bottom: 0px"
			>
				<a-col
					:span="8"
					style="height: inherit"
				>
					<a-form-item
						label="托运人"
						:colon="false"
					>
						<a-select
							placeholder="请输入托运人"
							v-bind="selectTagsProps"
							class="tag-height"
							:getPopupContainer="getPopupContainer"
							:maxLength="50"
							v-decorator="[
								`consignorCompanyName`,
								{
									rules: [
										{
											required: contractType == 'buy',
											message: `托运人必填`
										}
									]
								}
							]"
						>
						</a-select>
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-row
						type="flex"
						justify="center"
					>
						<a-form-item
							label="发货地址"
							:colon="false"
						>
							<a-input
								placeholder="请输入发货地址"
								:maxLength="50"
								v-decorator="[
									`sendGoodsAddress`,
									{
										rules: [
											{
												required: contractType == 'buy',
												message: `发货地址必填`
											}
										]
									}
								]"
							>
							</a-input>
						</a-form-item>
					</a-row>
				</a-col>
				<a-col :span="8">
					<a-row
						type="flex"
						justify="end"
					>
						<a-form-model-item
							label="收货地址"
							:colon="false"
						>
							<a-input
								placeholder="请输入收货地址"
								:maxLength="50"
								v-decorator="[
									`receiveGoodsAddress`,
									{
										rules: [
											{
												required: true,
												message: `收货地址必填`
											}
										]
									}
								]"
							>
							</a-input>
						</a-form-model-item>
					</a-row>
				</a-col>
			</a-row>
			<a-row
				v-if="form.getFieldValue('transportMode') == 'AUTOMOBILE_AND_TRAIN'"
				style="margin-bottom: 20px"
			>
				<a-col
					:span="8"
					style="height: inherit"
				>
					<a-form-item
						label="收货人名称"
						:colon="false"
					>
						<a-select
							v-bind="selectTagsProps"
							placeholder="请输入收货人名称"
							class="tag-height"
							:getPopupContainer="getPopupContainer"
							v-decorator="[
								`consigneeCompanyName`,
								{
									rules: [
										{
											required: true,
											message: `收货人名称必填`
										}
									]
								}
							]"
						>
						</a-select>
					</a-form-item>
				</a-col>
			</a-row>
			<a-row
				style="margin-bottom: 20px"
				v-if="form.getFieldValue('transportMode') == 'SHIP'"
			>
				<a-col
					:span="8"
					style="height: inherit"
				>
					<a-row type="flex">
						<a-form-item
							label="收货人名称"
							:colon="false"
						>
							<a-select
								v-bind="selectTagsProps"
								class="tag-height"
								:getPopupContainer="getPopupContainer"
								placeholder="请输入收货人名称"
								v-decorator="[
									`consigneeCompanyName`,
									{
										rules: [
											{
												required: true,
												message: `收货人必填`
											}
										]
									}
								]"
							>
							</a-select>
						</a-form-item>
					</a-row>
				</a-col>
			</a-row>
			<a-row
				style="margin-bottom: 20px"
				v-if="form.getFieldValue('transportMode') == 'TRAIN'"
			>
				<a-col
					:span="8"
					style="height: inherit"
				>
					<a-form-item
						label="托运人"
						:colon="false"
					>
						<a-select
							placeholder="请输入托运人"
							v-bind="selectTagsProps"
							class="tag-height"
							:getPopupContainer="getPopupContainer"
							v-decorator="[
								`consignorCompanyName`,
								{
									rules: [
										{
											required: contractType == 'buy',
											message: `托运人必填`
										}
									]
								}
							]"
							:maxLength="50"
						>
						</a-select>
					</a-form-item>
				</a-col>
				<a-col
					:span="8"
					style="height: inherit"
				>
					<a-row
						type="flex"
						justify="center"
					>
						<a-form-item
							label="收货人名称"
							:colon="false"
						>
							<a-select
								v-bind="selectTagsProps"
								class="tag-height"
								:getPopupContainer="getPopupContainer"
								placeholder="请输入收货人名称"
								v-decorator="[
									`consigneeCompanyName`,
									{
										rules: [
											{
												required: true,
												message: `收货人必填`
											}
										]
									}
								]"
							>
							</a-select>
						</a-form-item>
					</a-row>
				</a-col>
			</a-row>
			<a-row
				style="margin-bottom: 20px"
				v-if="form.getFieldValue('transportMode') == 'AUTOMOBILE'"
			>
				<a-col
					:span="8"
					style="height: inherit"
				>
					<a-form-item
						label="收货人名称"
						:colon="false"
					>
						<a-select
							v-bind="selectTagsProps"
							class="tag-height"
							:getPopupContainer="getPopupContainer"
							placeholder="请输入收货人名称"
							v-decorator="[
								`consigneeCompanyName`,
								{
									rules: [
										{
											required: true,
											message: `收货人名称必填`
										}
									]
								}
							]"
						>
						</a-select>
					</a-form-item>
				</a-col>
			</a-row>
		</a-form>
	</div>
</template>

<script>
import { getPopupContainer } from '@/v2/utils/factory.js';
import { API_STATION } from '@/v2/center/trade/api/contract';
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
			form: this.$form.createForm(this, { name: 'transportInfo' }),
			getPopupContainer,
			placeData: [], //站点信息
			selectTagsProps: {
				mode: 'tags',
				filterOption: false,
				// tokenSeparators:[',','.'],
				defaultActiveFirstOption: false
			},
			contractType: 'buy'
		};
	},
	computed: {
		transportMode() {
			if (this.isBuyContract) {
				return [
					{ name: '汽运和火运', value: 'AUTOMOBILE_AND_TRAIN' },
					{ name: '汽运', value: 'AUTOMOBILE' },
					{ name: '火运', value: 'TRAIN' },
					{ name: '船运', value: 'SHIP' },
					{ name: '无', value: 'NONE' }
				];
			}
			return [
				{ name: '汽运和火运', value: 'AUTOMOBILE_AND_TRAIN' },
				{ name: '汽运', value: 'AUTOMOBILE' },
				{ name: '火运', value: 'TRAIN' },
				{ name: '船运', value: 'SHIP' }
			];
		}
	},
	mounted() {
		this.contractType = this.$route.query.type;
	},
	methods: {
		init(info) {
			let terminalDelivery = info.terminalDelivery;
			this.form.setFieldsValue(info.terminalDelivery);
			this.$nextTick(() => {
				switch (terminalDelivery?.transportMode) {
					case 'AUTOMOBILE_AND_TRAIN':
						//汽运和火运
						this.form.setFieldsValue({
							trainSendStationName: terminalDelivery.trainSendStationName ? terminalDelivery.trainSendStationName.split(',') : [], //发站
							trainArriveStationName: terminalDelivery.trainArriveStationName
								? terminalDelivery.trainArriveStationName.split(',')
								: [], //到站
							consignorCompanyName: terminalDelivery.consignorCompanyName ? terminalDelivery.consignorCompanyName.split(',') : [], //托运人
							sendGoodsAddress: terminalDelivery.sendGoodsAddress, //发货地址
							receiveGoodsAddress: terminalDelivery.receiveGoodsAddress, //收货地址
							consigneeCompanyName: terminalDelivery.consigneeCompanyName ? terminalDelivery.consigneeCompanyName.split(',') : [] //收货人
						});
						break;
					case 'AUTOMOBILE':
						//汽运
						this.form.setFieldsValue({
							sendGoodsAddress: terminalDelivery.sendGoodsAddress, //发货地址
							receiveGoodsAddress: terminalDelivery.receiveGoodsAddress, //收货地址
							consigneeCompanyName: terminalDelivery.consigneeCompanyName ? terminalDelivery.consigneeCompanyName.split(',') : [] //收货人
						});
						break;
					case 'TRAIN':
						//火运
						this.form.setFieldsValue({
							trainSendStationName: terminalDelivery.trainSendStationName ? terminalDelivery.trainSendStationName.split(',') : [], //发站
							trainArriveStationName: terminalDelivery.trainArriveStationName
								? terminalDelivery.trainArriveStationName.split(',')
								: [], //到站
							consignorCompanyName: terminalDelivery.consignorCompanyName ? terminalDelivery.consignorCompanyName.split(',') : [], //托运人
							consigneeCompanyName: terminalDelivery.consigneeCompanyName ? terminalDelivery.consigneeCompanyName.split(',') : [] //收货人
						});
						break;
					case 'SHIP':
						//船运
						this.form.setFieldsValue({
							shipLoadingPortName: terminalDelivery.shipLoadingPortName ? terminalDelivery.shipLoadingPortName.split(',') : [], //装货港
							shipDischargingPortName: terminalDelivery.shipDischargingPortName
								? terminalDelivery.shipDischargingPortName.split(',')
								: [], //卸货港
							consigneeCompanyName: terminalDelivery.consigneeCompanyName ? terminalDelivery.consigneeCompanyName.split(',') : [] //收货人
						});
						break;
				}
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
		}
	},
	components: {}
};
</script>

<style lang="less" scoped>
.ant-checkbox-wrapper {
	height: 32px;
	line-height: 32px;
}
.relation-order {
	/deep/ .ant-form-item-control {
		text-align: right;
	}
	/deep/ .ant-checkbox-wrapper {
		span:nth-child(2) {
			padding-right: 0;
		}
	}
	/deep/ .ant-form-explain {
		text-align: left;
	}
}
.ant-col {
	height: 82px;
}
.ant-form-item {
	width: 364px;
	margin-bottom: 0;
}
#thymeleaf-content {
	width: 0;
	height: 0;
	display: none;
}
.df {
	display: flex;
	align-items: center;
}
.symbol {
	background: #f3f5f6;
	border: 1px solid #e5e6eb;
	border-radius: 0px 4px 4px 0px;
	width: 32px;
	height: 32px;
	display: flex;
	align-items: center;
	justify-content: center;
}
.quantity-offset {
	border-right: 0;
	border-radius: 4px 0px 0 4px;
}
.quantity-box {
	/deep/ .ant-form-item-label {
		opacity: 0;
	}
}
.marginBottom0 {
	margin-bottom: 0;
	min-height: 64px;
}
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
.tag-height {
	/deep/ .ant-select-selection {
		height: inherit;
	}
}
.NONE {
	margin-bottom: 0;
}
.TRAIN,
.AUTOMOBILE,
.AUTOMOBILE_AND_TRAIN,
.SHIP {
	margin-bottom: 0px;
}
</style>
