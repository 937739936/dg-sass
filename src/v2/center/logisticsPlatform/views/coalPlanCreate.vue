<template>
	<div class="slMain">
		<Breadcrumb :type="type" />
		<a-card :bordered="false" style="padding-bottom: 70px;">
			<div class="methods-wrap">
				<span class="slTitle">{{ id ? '编辑' : '创建' }}汽运{{ type == 'IN' ? '上煤' : '下煤' }}计划</span>
			</div>
			<template v-if="VUEX_ST_COMPANYSUER.companyType == 'CORE_COMPANY'">
				<div class="slTitleAssis">合同信息</div>
				<ContractInfo
					:type="type"
					@sendRelationFlag="getRelation"
					ref="contractInfo"
					:querySource="'COAL_PALN'"
					:operationType="getOperationType()"
				></ContractInfo>
				<div v-show="!!isRelation">
					<BusinessLine
						ref="businessLine"
						:type="type"
						@change="onSelectedBusinessLine"
					/>
				</div>
				<div
					v-show="
						(selected.businessType == 'WAREHOUSE_RECEIPTS_PLEDGE' || selected.warehouseToReceivable) &&
						type == 'OUT' &&
						!!isRelation
					"
				>
					<ReleaseInstruct
						ref="releaseInstruct"
						:type="type"
						@change="onSelectedReleaseInstruct"
					/>
				</div>
			</template>
			<div class="slTitleAssis">{{ type == 'IN' ? '上煤' : '下煤' }}计划信息</div>
			<a-form
				:form="form"
				:colon="false"
				class="slFormDetail"
			>
				<a-row>
					<a-col :span="8">
						<a-form-item label="发货单位">
							<div class="row">
								<a-input
									v-if="getWarehouseReceivable()"
									showSearch
									:disabled="true"
									placeholder="请选择发货单位"
									v-decorator="[
										'deliveryCompanyName',
										{
											rules: [{ required: true, message: '请选择发货单位' }]
										}
									]"
								/>
								<a-select
									v-else-if="isManager && type == 'IN'"
									showSearch
									mode="tags"
									class="tag-selectet"
									:disabled="!!id"
									placeholder="请选择发货单位"
									@change="getHouseList('delivery', $event)"
									v-decorator="[
										'deliveryCompanyCreditCode',
										{
											rules: [
												{ required: true, message: '请选择发货单位' }
												// { validator: validCompanyName, trigger: 'blur' }
											]
										}
									]"
									:filterOption="filterOption"
								>
									<a-select-option
										v-for="item in deliveryCompanyList"
										:value="item.creditCode"
										:key="`${item.creditCode}-${item.linkmanMobile}`"
										>{{ item.name }}</a-select-option
									>
								</a-select>
								<a-select
									v-else
									showSearch
									:disabled="!!id"
									placeholder="请选择发货单位"
									@change="getHouseList('delivery', $event)"
									v-decorator="[
										'deliveryCompanyCreditCode',
										{
											rules: [
												{ required: true, message: '请选择发货单位' },
												{ validator: validCompanyName, trigger: 'blur' }
											]
										}
									]"
									:filterOption="filterOption"
								>
									<template slot="tagRender"> dd </template>
									<a-select-option
										v-for="item in deliveryCompanyList"
										:value="item.creditCode"
										:key="item.creditCode"
										>{{ item.name }}</a-select-option
									>
								</a-select>
								<a
									class="addbtn"
									@click.prevent="openAddCustomerModal"
									v-if="type == 'IN' && !id && !isManager"
									>添加</a
								>
							</div>
						</a-form-item>
					</a-col>
					<a-col :span="8">
						<a-row type="flex">
							<a-form-item label="收货单位">
								<div class="row">
									<a-select
										v-if="isManager && type == 'OUT'"
										showSearch
										mode="tags"
										class="tag-selectet"
										placeholder="请选择收货单位"
										:disabled="!!id"
										@change="getHouseList('receive', $event)"
										v-decorator="[
											'receivingCompanyCreditCode',
											{
												rules: [
													{ required: true, message: '请选择收货单位' },
													{ validator: validCompanyName, trigger: 'blur' }
												]
											}
										]"
										:filterOption="filterOption"
									>
										<a-select-option
											v-for="item in receivingCompanyList"
											:value="item.creditCode"
											:key="item.creditCode"
											>{{ item.name }}</a-select-option
										>
									</a-select>
									<a-select
										v-else
										placeholder="请选择收货单位"
										:disabled="!!id"
										@change="getHouseList('receive', $event)"
										v-decorator="[
											'receivingCompanyCreditCode',
											{
												rules: [
													{ required: true, message: '请选择收货单位' },
													{ validator: validCompanyName, trigger: 'blur' }
												]
											}
										]"
										showSearch
										:filterOption="filterOption"
									>
										<a-select-option
											v-for="item in receivingCompanyList"
											:value="item.creditCode"
											:key="item.creditCode"
											>{{ item.name }}</a-select-option
										>
									</a-select>
									<a
										class="addbtn"
										@click.prevent="openAddCustomerModal"
										v-if="type == 'OUT' && !id && !isManager"
										>添加</a
									>
								</div>
							</a-form-item>
						</a-row>
					</a-col>
					<a-col :span="8">
						<a-form-item label="煤种">
							<a-select
								placeholder="请选择煤种"
								@change="coalTypeChange"
								:disabled="!!id"
								v-decorator="['coalType', { rules: [{ required: true, message: '请选择煤种' }] }]"
							>
								<a-select-option
									v-for="item in coalTypeAllList"
									:value="item.name"
									:key="item.id"
									>{{ item.name }}</a-select-option
								>
							</a-select>
						</a-form-item>
					</a-col>
					<a-col :span="8">
						<a-row type="flex">
							<a-form-item label="仓房">
								<a-select
									placeholder="请选择仓房"
									v-decorator="['houseId', { rules: [{ required: true, message: '请选择仓房' }] }]"
									showSearch
									:filterOption="filterOption"
									:disabled="!!id"
								>
									<a-select-option
										v-for="item in houseList"
										:value="item.id"
										:key="item.id"
										>{{ item.name }}</a-select-option
									>
								</a-select>
							</a-form-item>
						</a-row>
					</a-col>
					<a-col :span="8">
						<a-row type="flex">
							<a-form-item label="货位">
								<a-select
									placeholder="请选择货位"
									v-decorator="['goodsAllocationId', { rules: [{ required: true, message: '请选择货位' }] }]"
									showSearch
									:filterOption="filterOption"
									:disabled="!!id"
								>
									<a-select-option
										v-for="item in goodsAllocationMap[form.getFieldValue('houseId')] || []"
										:value="item.id"
										:key="item.id"
										>{{ item.name }}</a-select-option
									>
								</a-select>
							</a-form-item>
						</a-row>
					</a-col>
					<a-col :span="8">
						<a-form-item label="货主电话">
							<a-input
								:disabled="!!id"
								placeholder="请输入货主电话"
								v-decorator="[
									'shipperMobile',
									{
										rules: [
											{ required: true, message: '请输入货主电话' },
											{ max: 20, message: '不能超过20个字符' }
										]
									}
								]"
							/>
						</a-form-item>
					</a-col>
					<a-col :span="8">
						<a-row type="flex">
							<a-form-item :label="type == 'IN' ? '发站' : '到站'">
								<a-input
									:disabled="!!id"
									:placeholder="'请输入' + (type == 'IN' ? '发站' : '到站')"
									v-decorator="[
										'sendStation',
										{
											rules: [
												{
													validator: (rule, value, callback) => {
														if (!value) {
															callback();
															return;
														}
														if (value.length > 30) {
															callback('最多30个字符');
															return;
														}
														callback();
													}
												}
											]
										}
									]"
								/>
							</a-form-item>
						</a-row>
					</a-col>
					<a-col :span="8">
						<a-row type="flex">
							<a-form-item label="计划吨数">
								<a-input-number
									:max="999999.9999"
									:min="0.0001"
									style="width: 100%"
									:disabled="!!id"
									placeholder="请输入计划吨数"
									v-decorator="[
										'planWeight',
										{
											rules: [
												{ required: releaseInstructInfo != null, message: '请输入计划吨数' },
												{
													validator: (rule, value, callback) => {
														if (!value) {
															callback();
															return;
														}
														value = Number(value);
														if (isNaN(value)) {
															callback('请输入数字');
															return;
														}
														if (value <= 0) {
															callback('必须大于0');
															return;
														}
														if (!/^\d{1,}(\.\d{1,4})?$/.test(value)) {
															callback('最多4位小数');
															return;
														}
														if (value > 999999.9999) {
															callback('最大999999.9999');
															return;
														}
														// 如选择放货指令，填写的计划吨数需小于等于放货数量
														if (releaseInstructInfo) {
															if (value > releaseInstructInfo.releaseQuantity) {
																callback(`放货数量${releaseInstructInfo.releaseQuantity}吨，计划吨数需小于等于放货数量`);
																return;
															}
														}
														callback();
													}
												}
											]
										}
									]"
								/>
							</a-form-item>
						</a-row>
					</a-col>
					<a-col
						:span="8"
						v-if="getWarehouseReceivable()"
					>
						<a-form-item label="实际提货单位">
							<a-input
								:disabled="true"
								v-decorator="[
									'actualLadingUnit',
									{
										rules: [{ required: true, message: '实际提货单位必填' }]
									}
								]"
							/>
						</a-form-item>
					</a-col>
					<a-col
						:span="8"
						v-if="getWarehouseReceivable()"
					>
						<a-form-item label="实际收货单位">
							<a-input
								:disabled="true"
								v-decorator="[
									'actualReceivingUnit',
									{
										rules: [{ required: true, message: '实际收货单位必填' }]
									}
								]"
							/>
						</a-form-item>
					</a-col>
					<a-col
						:span="8"
						v-if="type == 'OUT'"
					>
						<a-form-item label="收货地址">
							<a-tooltip>
								<a-select
									showArrow
									showSearch
									:disabled="!addressInfoEditable"
									class="receive-address"
									placeholder="请添加收货地址"
									v-decorator="[
										'receivingAddress',
										{
											rules: [{ required: !!isRelation, message: '请添加收货地址' }]
										}
									]"
									:filterOption="filterOption"
									@change="handleReceivingAddressChanged"
								>
									<span
										v-if="addressInfoEditable"
										slot="suffixIcon"
										class="edit"
										@click.stop="openAddress"
									>
									</span>
									<a-select-option
										v-for="item in receivingAddressList"
										:value="`${item.receiveLongitude}${item.receiveLatitude}${item.receiveElectronicFenceRadius}`"
										:key="`${item.receiveLongitude}${item.receiveLatitude}${item.receiveElectronicFenceRadius}`"
										>{{ item.receiveAddressKeywords || item.receiveAddress }}</a-select-option
									>
								</a-select>
								<template
									slot="title"
									v-if="addressInfo && addressInfo.receiveAddress"
								>
									{{ addressInfo.receiveAddress || addressInfo.receiveAddressKeywords }}
								</template>
							</a-tooltip>
						</a-form-item>
					</a-col>
				</a-row>
				<a-row>
					<a-col
						:span="24"
						style="height: auto"
					>
						<a-form-item
							label="描述"
							style="width: 100%"
						>
							<a-textarea
								placeholder="请输入内容描述"
								:rows="4"
								:disabled="!!id"
								v-decorator="[
									'remark',
									{
										rules: [
											{
												validator: (rule, value, callback) => {
													if (!value) {
														callback();
														return;
													}
													if (value.length > 100) {
														callback('最多输入100个字符');
														return;
													}
													callback();
												}
											}
										]
									}
								]"
							/>
						</a-form-item>
					</a-col>
				</a-row>

				<div class="slDetailBottom">
					<a-space :size="20">
						<a-button
							type="primary"
							@click="cancel"
							:loading="saveLoading"
							ghost
							>取消</a-button
						>
						<a-button
							type="primary"
							@click="save"
							:loading="saveLoading"
							>{{ id ? '保存' : '提交' }}</a-button
						>
					</a-space>
				</div>
			</a-form>
		</a-card>
		<AddCustomerModal
			:visible="visible"
			:typeList="typeList"
			:ok="addCustomerOk"
			:cancel="addCustomerCancel"
		/>
		<ConfirmModal
			ref="backRef"
			@confirm="backOk"
		/>
		<AddressCheckPort
			ref="checkPort"
			@selectPort="selectPort"
		/>
	</div>
</template>

<script>
import AddCustomerModal from '@/v2/center/person/components/AddCustomerModal.vue';
import { mapGetters } from 'vuex';
import {
	getDeliveryCompanyList,
	getReceivingCompanyList,
	getStationReceiveAddress,
	getCoalTypeAllList,
	getStationHouseByShipper,
	coalPlanAdd,
	getCoalPlanDetail,
	coalPlanEdit
} from '../api';

import { API_COMPANYCUSTOMERTYPE } from 'api/account';

import Breadcrumb from '@/v2/components/breadcrumb/index';
import ContractInfo from './inOut/components/contractInfo.vue';
import BusinessLine from '../components/coalPlan/BusinessLine.vue';
import ReleaseInstruct from '../components/coalPlan/ReleaseInstruct.vue';
import ConfirmModal from '@/v2/components/modal/ConfirmModal';
import AddressCheckPort from '@/v2/center/logisticsPlatform/components/coalPlan/AddressCheckPort';

export default {
	components: {
		AddCustomerModal,
		Breadcrumb,
		ContractInfo,
		BusinessLine,
		ReleaseInstruct,
		ConfirmModal,
		AddressCheckPort
	},
	data() {
		let { type } = this.$route.params;
		const { serialNo, id } = this.$route.query;
		return {
			id,
			type,
			serialNo,
			deliveryCompanyList: [],
			receivingCompanyList: [],
			coalTypeAllList: [],
			houseList: [],
			goodsAllocationMap: {},
			form: this.$form.createForm(this),
			saveLoading: false,
			visible: false,
			typeList: [],
			selected: '',
			isRelation: null,
			businessLineNo: null,
			businessLineName: null,
			releaseInstructNo: null,
			releaseInstructInfo: null,
			addressInfo: null,
			receivingAddressList: [],
			detail: {},
			validCompanyName: (rule, value, callback) => {
				let deliveryCompanyCreditCode = this.form.getFieldValue('deliveryCompanyCreditCode'),
					receivingCompanyCreditCode = this.form.getFieldValue('receivingCompanyCreditCode');
				if (deliveryCompanyCreditCode == receivingCompanyCreditCode) {
					callback('发货单位与收货单位相同，请核验');
					return;
				}
				this.form.setFields({
					deliveryCompanyCreditCode: { value: deliveryCompanyCreditCode, errors: false },
					receivingCompanyCreditCode: { value: receivingCompanyCreditCode, errors: false }
				});
				callback();
			}
		};
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER',
			VUEX_ST_PERSONALLINFO: 'VUEX_ST_PERSONALLINFO',
			VUEX_COMPANY_SERVICES: 'VUEX_COMPANY_SERVICES'
		}),
		isCoreCompany() {
			return this.VUEX_ST_COMPANYSUER.companyType == 'CORE_COMPANY';
		},
		//是否是站台管理服务
		isManager() {
			return this.VUEX_COMPANY_SERVICES.includes('LOGISTICS_STATION_MANAGE');
		},
		addressInfoEditable() {
			//  return !this.id || (!!this.id && this.isRelation && !this.addressInfo);
			return true;
		}
	},
	created() {},
	mounted() {
		this.getDeliveryCompanyList();
		this.getReceivingCompanyList();
		this.getReceivingAddressList();
		this.getCoalTypeAllList();
		this.getType();

		if (!this.isManager) {
			this.form.setFieldsValue({
				shipperMobile: this.VUEX_ST_PERSONALLINFO.mobile,
				relatedContract: true
			});
		}

		if (this.id) {
			this.getDetail();
		}
	},

	methods: {
		openAddress() {
			this.$refs.checkPort.show(this.addressInfo, true);
		},
		selectPort(res) {
			let { address, area, lat, lon, radius, name } = res;
			console.log(res);
			this.addressInfo = {
				receiveArea: area,
				receiveAddress: address,
				receiveLongitude: lon,
				receiveLatitude: lat,
				receiveElectronicFenceRadius: radius,
				receiveAddressKeywords: name
			};

			if (
				!this.receivingAddressList.some(
					item => `${item.receiveLongitude}${item.receiveLatitude}${item.receiveElectronicFenceRadius}` == `${lon}${lat}${radius}`
				)
			) {
				this.receivingAddressList.unshift(this.addressInfo);
			}

			this.$nextTick(() => {
				this.form.setFieldsValue({
					receivingAddress: name ?? address
				});
			});
		},
		getOperationType() {
			return this.type == 'OUT' ? (this.id ? 'OUT_COAL_PLAN_MODIFY_CONTRACT' : 'ADD_OUT_COAL_PLAN') : '';
		},
		handleReceivingAddressChanged(val) {
			let res = this.receivingAddressList.filter(
				item => `${item.receiveLongitude}${item.receiveLatitude}${item.receiveElectronicFenceRadius}` == val
			);
			if (res && res.length) {
				this.addressInfo = res[0];
			} else {
				this.addressInfo = {};
			}
		},
		getWarehouseReceivable() {
			return this.type == 'OUT' && this.selected.warehouseToReceivable && this.releaseInstructInfo;
		},
		getDetail() {
			getCoalPlanDetail({ id: this.id }).then(({ success, data }) => {
				if (!success) {
					return;
				}
				const deliveryCompanyCreditCode = data.deliveryCompanyCreditCode;
				if (deliveryCompanyCreditCode) {
					this.getHouseList('delivery', deliveryCompanyCreditCode);
				}
				const receivingCompanyCreditCode = data.receivingCompanyCreditCode;
				if (receivingCompanyCreditCode) {
					this.getHouseList('receive', receivingCompanyCreditCode);
				}
				let {
					receiveArea,
					receiveAddress,
					receiveLongitude,
					receiveLatitude,
					receiveElectronicFenceRadius,
					receiveAddressKeywords
				} = data;
				if (receiveLongitude && receiveLatitude) {
					this.addressInfo = {
						receiveArea,
						receiveAddress,
						receiveLongitude,
						receiveLatitude,
						receiveElectronicFenceRadius,
						receiveAddressKeywords
					};
				}

				this.form.setFieldsValue({
					deliveryCompanyCreditCode,
					receivingCompanyCreditCode,
					coalType: data.coalType,
					houseId: data.houseId,
					goodsAllocationId: data.goodsAllocationId,
					shipperMobile: data.shipperMobile,
					sendStation: data.sendStation,
					planWeight: data.planWeight,
					remark: data.remark,
					receivingAddress: this.addressInfo?.receiveAddress ?? ''
				});
				if (data.businessLineNo) {
					this.$refs.businessLine.selectedRowKeys = [data.businessLineNo];
				}
				if (data.releaseInstructNo) {
					this.$refs.releaseInstruct.selectedRowKeys = [data.releaseInstructNo];
				}

				this.businessLineNo = data.businessLineNo;
				this.releaseInstructNo = data.releaseInstructNo;

				// this.detail = data;
				// this.detail.copyContractNoVisible = false;
			});
		},
		addCustomerOk() {
			this.visible = false;
			this.getDeliveryCompanyList();
			this.getReceivingCompanyList();
		},
		addCustomerCancel() {
			this.visible = false;
		},
		openAddCustomerModal() {
			this.visible = true;
		},
		//客户类型
		getType() {
			API_COMPANYCUSTOMERTYPE().then(res => {
				let data = res.data;
				this.typeList = data;
			});
		},
		//发货单位
		getDeliveryCompanyList() {
			// this.form.getFieldsValue('')
			getDeliveryCompanyList({ type: this.type }).then(({ success, data }) => {
				if (!success) {
					return;
				}
				this.deliveryCompanyList = data;
			});
		},
		//收货单位
		getReceivingCompanyList() {
			getReceivingCompanyList({ type: this.type }).then(({ success, data }) => {
				if (!success) {
					return;
				}
				this.receivingCompanyList = data;
			});
		},
		// 收货地址
		getReceivingAddressList() {
			getStationReceiveAddress().then(({ success, data }) => {
				if (!success) {
					return;
				}
				this.receivingAddressList = data;
			});
		},

		//煤种
		getCoalTypeAllList() {
			getCoalTypeAllList().then(({ success, data }) => {
				if (!success) {
					return;
				}
				this.coalTypeAllList = data;
			});
		},
		getStationHouseByShipper(shipperCreditCode) {
			getStationHouseByShipper({ shipperCreditCode }).then(({ success, data }) => {
				if (!success) {
					return;
				}
				let goodsAllocationMap = {};
				this.houseList = data.map(item => {
					goodsAllocationMap[item.id] = item.goodsAllocations;
					return {
						id: item.id,
						name: item.name
					};
				});
				this.goodsAllocationMap = goodsAllocationMap;
			});
		},

		getHouseList(companyType, shipperCreditCode) {
			if (companyType == 'receive') {
				if (this.isManager && this.type == 'OUT') {
					const timer = setTimeout(() => {
						clearTimeout(timer);
						this.form.setFieldsValue({
							receivingCompanyCreditCode: Array.isArray(shipperCreditCode) ? shipperCreditCode.slice(-1) : [shipperCreditCode]
						});
					}, 10);
				}
			}
			if (companyType == 'delivery') {
				if (this.isManager && this.type == 'IN') {
					const timer = setTimeout(() => {
						clearTimeout(timer);
						this.form.setFieldsValue({
							deliveryCompanyCreditCode: Array.isArray(shipperCreditCode) ? shipperCreditCode.slice(-1) : [shipperCreditCode]
						});
					}, 10);
				}
				this.form.setFieldsValue({
					shipperMobile: this.deliveryCompanyList.find(item => item.creditCode == shipperCreditCode)?.linkmanMobile
				});
			}
			if ((this.type == 'IN' && companyType == 'receive') || (this.type == 'OUT' && companyType == 'delivery')) {
				this.getStationHouseByShipper(shipperCreditCode);
				return;
			}
		},
		cancel() {
			this.$refs.backRef.showModal({
				modalTitle: '取消',
				modalText: '点击取消后，该页面信息将不会保存，是否继续取消？'
			});
		},
		backOk() {
			this.$router.go(-1);
		},
		async editUpdate() {
			const noRelation = this.$refs.contractInfo.relationForm.getFieldValue('noRelation');
			if (noRelation === false && !this.selected.serialNo) {
				this.$message.error('请选择合同');
				return;
			}
			if (this.selected.serialNo && !this.businessLineNo) {
				this.$message.error('请至少选择一条业务线');
				return;
			}
			// [创建下煤]
			// 当且仅当用户选择 标准仓押合同
			// ● 当合同选择时，放货指令必选，未选择放货指令时，错误提示：“请至少选择一条放货指令”
			// 仓押转应收下的应收合同（A1）进行出库需选择放货指令
			if (
				this.selected.serialNo &&
				!this.releaseInstructNo &&
				(this.selected.businessType == 'WAREHOUSE_RECEIPTS_PLEDGE' || this.selected.warehouseToReceivable) &&
				this.type == 'OUT'
			) {
				this.$message.error('请至少选择一条放货指令');
				return;
			}

			await this.form.validateFields();

			const params = {
				bid: this.id,
				contractNo: this.selected.contractNo,
				contractType: this.selected.contractType,
				...this.addressInfo ?? {}
			};
			if (this.businessLineNo) {
				params.businessLineNo = this.businessLineNo;
				params.businessLineName = this.businessLineName;
			}
			if (this.releaseInstructInfo) {
				params.releaseInstructId = this.releaseInstructInfo?.id;
				params.releaseInstructNo = this.releaseInstructInfo?.serialNo;
			}
			if (this.selected.contractType === 'OFFLINE') {
				params.contractNo = this.selected.paperContractNo;
				params.contractSerialNo = this.selected.serialNo;
			} else {
				params.orderNo = this.selected.serialNo;
			}

			this.saveLoading = true;
			coalPlanEdit(params)
				.then(({ success }) => {
					this.saveLoading = false;
					if (!success) {
						return;
					}
					this.$message.success('操作成功');
					this.$router.go(-1);
				})
				.catch(() => {
					this.saveLoading = false;
				});
		},
		handleArrayData(data) {
			return Array.isArray(data) ? data[0] : data;
		},
		save() {
			if (this.id) {
				this.editUpdate();
				return;
			}
			// const isCoreCompany = this.VUEX_ST_COMPANYSUER.companyType == 'CORE_COMPANY'
			let dataObj = {};
			if (!this.isManager) {
				const noRelation = this.$refs.contractInfo.relationForm.getFieldValue('noRelation');
				if (noRelation === false && !this.selected.serialNo) {
					this.$message.error('请选择合同');
					return;
				}
				if (this.selected.serialNo && !this.businessLineNo) {
					this.$message.error('请至少选择一条业务线');
					return;
				}
				dataObj = {
					contractNo: this.selected.contractNo,
					orderNo: this.selected.serialNo,
					contractType: this.selected.contractType,
					businessLineNo: this.businessLineNo,
					businessLineName: this.businessLineName
				};
				if (this.selected.contractType === 'OFFLINE') {
					dataObj.contractNo = this.selected.paperContractNo;
					dataObj.contractSerialNo = this.selected.serialNo;
				}
				if (
					this.selected.serialNo &&
					!this.releaseInstructNo &&
					(this.selected.businessType == 'WAREHOUSE_RECEIPTS_PLEDGE' || this.selected.warehouseToReceivable) &&
					this.type == 'OUT'
				) {
					this.$message.error('请至少选择一条放货指令');
					return;
				}
				if (this.releaseInstructInfo) {
					dataObj.releaseInstructId = this.releaseInstructInfo?.id;
					dataObj.releaseInstructNo = this.releaseInstructInfo?.serialNo;
				}

				if (this.selected.contractType === 'OFFLINE') {
					dataObj.contractNo = this.selected.paperContractNo;
					dataObj.contractSerialNo = this.selected.serialNo;
				}
			}

			this.form.validateFields((error, values) => {
				if (error) {
					return;
				}
				let deliveryCompanyName = '';
				if (this.getWarehouseReceivable()) {
					deliveryCompanyName = this.selected.sellerName;
					values.deliveryCompanyCreditCode = this.selected.sellerUscc;
				} else {
					deliveryCompanyName = this.deliveryCompanyList.filter(item => item.creditCode == values.deliveryCompanyCreditCode)[0]
						?.name;
				}
				let receivingCompanyName = this.receivingCompanyList.filter(
					item => item.creditCode == values.receivingCompanyCreditCode
				)[0]?.name;

				if (this.isManager) {
					if (!deliveryCompanyName) {
						deliveryCompanyName = this.handleArrayData(values.deliveryCompanyCreditCode);
						values.deliveryCompanyCreditCode = '';
					} else {
						values.deliveryCompanyCreditCode = this.handleArrayData(values.deliveryCompanyCreditCode);
					}
					if (!receivingCompanyName) {
						receivingCompanyName = this.handleArrayData(values.receivingCompanyCreditCode);
						values.receivingCompanyCreditCode = '';
					} else {
						values.receivingCompanyCreditCode = this.handleArrayData(values.receivingCompanyCreditCode);
					}
				}

				this.saveLoading = true;

				coalPlanAdd({
					...values,
					coalType: values.coalType,
					deliveryCompanyName,
					receivingCompanyName,
					type: this.type,
					...dataObj,
					...this.addressInfo
				})
					.then(result => {
						this.saveLoading = false;
						if (!result.success) {
							return;
						}
						this.$message.success('操作成功');
						this.$router.go(-1);
					})
					.catch(() => {
						this.saveLoading = false;
					});
			});
		},
		coalTypeChange(values) {
			let timer = setTimeout(() => {
				clearTimeout(timer);
				this.form.setFieldsValue({
					// coalType:values.slice(-1)
					coalType: values
				});
			}, 1);
		},
		filterOption(input, option) {
			return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0;
		},
		onSelectedBusinessLine(no, data) {
			const timer = setTimeout(() => {
				clearTimeout(timer);
				this.businessLineNo = no;
				this.businessLineName = data.businessLineName;
			}, 100);
		},
		onSelectedReleaseInstruct(no, data) {
			const timer = setTimeout(() => {
				clearTimeout(timer);
				this.releaseInstructNo = no;
				this.releaseInstructInfo = data;
				if (this.getWarehouseReceivable()) {
					this.getHouseList('delivery', this.selected.sellerUscc);
					this.$nextTick(() => {
						this.form.setFieldsValue({
							deliveryCompanyName: this.selected.sellerName,
							actualLadingUnit: data.actualLadingUnit,
							actualReceivingUnit: data.actualReceivingUnit
						});
					});
				}
			}, 100);
		},
		getRelation(flag, info) {
			this.isRelation = flag;
			this.selected = info;
			this.businessLineNo = null;
			this.businessLineName = null;
			this.releaseInstructNo = null;
			this.releaseInstructInfo = null;
			this.$refs.businessLine.selectedRowKeys = [];
			this.$refs.businessLine.setData(info.businessLineList || []);
			this.$refs.releaseInstruct.selectedRowKeys = [];
			this.$refs.releaseInstruct.setData(info.releaseInstructList || []);
		}
	}
};
</script>
<style lang="less" scoped>
.row {
	display: flex;
	align-items: center;
	.addbtn {
		flex-shrink: 0;
		margin-left: 5px;
	}
}
/deep/.ant-checkbox-wrapper {
	height: 32px;
	line-height: 32px;
}
textarea {
	height: 110px !important;
	resize: none;
}
.ant-col {
	height: 82px;
}
.ant-form-item {
	width: 364px;
	margin-bottom: 0;
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
.slDetailBottom {
	width: calc(100vw - 254px);
	min-width: 1186px;
	height: 64px;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	box-sizing: border-box;
	position: fixed;
	bottom: 0;
	left: 228px;
	z-index: 999;
}
.tag-selectet {
	::v-deep {
		.ant-select-selection__choice {
			padding-left: 5px !important;
			padding-right: 5px !important;
			background-color: transparent !important;
			.ant-select-selection__choice__remove {
				display: none;
				pointer-events: none;
			}
		}
	}
}
.receive-address {
	::v-deep {
		.ant-select-selection {
			.ant-select-arrow {
				background: none;
			}
			.ant-select-arrow {
				transform: rotate(0deg);
			}
		}
	}
	.edit {
		// flex-shrink: 0;
		// margin-left: 12px;
		width: 14px;
		height: 14px;
		background-image: url('~v2/assets/imgs/logisticsPlatform/map_icon.png');
		background-size: 100%;
		background-position: center;
		background-repeat: no-repeat;
	}
}
</style>
