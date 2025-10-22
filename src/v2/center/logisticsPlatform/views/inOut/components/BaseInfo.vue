<template>
	<div>
		<a-form
			:form="form"
			class="slFormDetail"
			:colon="false"
			v-if="type == 'IN'"
		>
			<a-row>
				<a-col :span="8">
					<a-row type="flex">
						<a-form-item :label="`${str}库数量(吨)`">
							<a-input
								placeholder="请输入数量"
								:min="0.0001"
								:precision="4"
								:max="99999999.9999"
								@change="calculateTotalPrice"
								v-decorator="[
									`weight`,
									{
										rules: [
											{ required: true, message: `${str}库数量必填` },
											{ pattern: /^\d+(\.\d{0,4})?$/, message: '数量为非负数，最多四位小数' },
											{ validator: checkWeight }
										]
									}
								]"
							/>
						</a-form-item>
					</a-row>
				</a-col>
				<template v-if="!isManager && logisticsPlatformCenter">
					<a-col :span="8">
						<a-row>
							<a-form-item :label="`${str}库单价(元/吨)`">
								<a-input-number
									:placeholder="`请输入${str}库单价`"
									:min="0"
									:precision="2"
									:max="99999999.99"
									@change="calculateTotalPrice"
									v-decorator="[
										`price`,
										{
											rules: [{ required: true, message: `请填写${str}库单价` }]
										}
									]"
								/>
							</a-form-item>
						</a-row>
					</a-col>
					<a-col
						:span="8"
						v-if="logisticsPlatformCenter"
					>
						<a-row>
							<a-form-item :label="`${str}库货值`">
								<a-input
									placeholder=""
									:min="0"
									:precision="2"
									:disabled="true"
									v-decorator="[`tempTotalPrice`]"
								/>
							</a-form-item>
						</a-row>
					</a-col>
				</template>
				<a-col :span="8">
					<a-row
						type="flex"
						justify="center"
					>
						<a-form-item
							:label="`${str}库日期`"
							:colon="false"
						>
							<a-date-picker
								style="width: 100%"
								placeholder="请选择日期"
								:allowClear="false"
								valueFormat="YYYY-MM-DD"
								v-decorator="[
									'storageDate',
									{
										initialValue: moment().format('yyyy-MM-DD'),
										rules: [{ required: true, message: `${str}库日期必填` }]
									}
								]"
							>
								<span
									slot="suffixIcon"
									class="calendar"
								></span>
							</a-date-picker>
							<span
								slot="extra"
								v-if="execDateDevMax"
							>
								<span
									style="font-size: 12px"
									v-if="execDateDevMax"
								>
									{{ this.type == 'IN' ? '入' : '出' }}库日期与当前日期偏差较多，如果实际如此，请忽略提示
								</span>
							</span>
						</a-form-item>
					</a-row>
				</a-col>
				<a-col
					:span="8"
					v-if="logisticsPlatformCenter"
				>
					<a-row
						type="flex"
						justify="end"
					>
						<a-form-item label="坑/矿口">
							<a-auto-complete
								placeholder="请输入坑/矿口"
								:data-source="historyHoleList"
								:getPopupContainer="getPopupContainer"
								:maxLength="200"
								:filterOption="filterOption"
								v-decorator="[
									'originPlace',
									{
										rules: [{ required: !isManager, message: '坑/矿口必填' }, { validator: checkLength }]
									}
								]"
							>
							</a-auto-complete>
						</a-form-item>
					</a-row>
				</a-col>
				<a-col :span="8">
					<a-row type="flex">
						<a-form-item label="品名">
							<a-auto-complete
								placeholder="请输入品名"
								:data-source="historyGoodList"
								:getPopupContainer="getPopupContainer"
								:maxLength="200"
								:filterOption="filterOption"
								v-decorator="[
									'goodsName',
									{
										rules: [{ required: true, message: '品名必填' }, { validator: checkLength }]
									}
								]"
							>
							</a-auto-complete>
						</a-form-item>
					</a-row>
				</a-col>
				<a-col :span="8">
					<a-row
						type="flex"
						justify="center"
					>
						<a-form-item
							label="发货单位"
							v-if="!isManager"
						>
							<a-input
								style="width: 100%"
								:maxLength="100"
								placeholder="请输入发货单位"
								:disabled="disableCompany('delivery')"
								@blur="getDeliveryInfo"
								v-decorator="[
									'deliveryCompanyName',
									{
										rules: [{ required: true, message: `发货单位必填` }],
										validateTrigger: ['blur']
									}
								]"
							/>
						</a-form-item>
						<a-form-item
							label="发货单位"
							v-else
						>
							<a-select
								mode="tags"
								class="tag-selectet"
								placeholder="请选择发货单位"
								v-decorator="['deliveryCompanyUscc', { rules: [{ required: true, message: '请选择发货单位' }] }]"
								showSearch
								@change="onDeliverOrReceive('delivery', $event)"
								:filterOption="filterOption"
							>
								<a-select-option
									v-for="item in deliveryCompanyList"
									:value="item.creditCode"
									:key="item.creditCode"
									>{{ item.name }}</a-select-option
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
							label="收货单位"
							v-if="!isManager"
						>
							<a-input
								style="width: 100%"
								:maxLength="100"
								placeholder="请输入收货单位"
								:disabled="disableCompany('receive')"
								@blur="getReceivingInfo"
								v-decorator="[
									'receivingCompanyName',
									{
										rules: [{ required: true, message: `收货单位必填` }],
										validateTrigger: ['blur']
									}
								]"
							/>
						</a-form-item>
						<a-form-item
							label="收货单位"
							v-else
						>
							<a-select
								placeholder="请选择收货单位"
								v-decorator="['receivingCompanyUscc', { rules: [{ required: true, message: '请选择收货单位' }] }]"
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
						</a-form-item>
					</a-row>
				</a-col>
				<a-col
					:span="8"
					v-if="logisticsPlatformCenter"
				>
					<a-row type="flex">
						<a-form-item label="运输方式">
							<a-radio-group
								name="radioGroup"
								v-decorator="[
									`transportMode`,
									{
										rules: [{ required: true, message: `运输方式必选` }]
									}
								]"
							>
								<a-radio
									v-for="(items, index) in transportModeList"
									:key="index"
									:value="items.value"
									>{{ items.label }}</a-radio
								>
							</a-radio-group>
						</a-form-item>
					</a-row>
				</a-col>
				<a-col
					:span="8"
					v-if="form.getFieldValue('transportMode') != 'SHIP' && logisticsPlatformCenter"
				>
					<a-row
						type="flex"
						justify="center"
					>
						<a-form-item label="入库车数">
							<a-input-number
								placeholder="请输入入库车数"
								:min="1"
								:precision="0"
								:max="9999999999"
								v-decorator="[
									`carsNumber`,
									{
										rules: [{ required: true, message: `入库车数必填` }]
									}
								]"
							/>
						</a-form-item>
					</a-row>
				</a-col>
				<a-col :span="8">
					<a-row
						type="flex"
						:justify="form.getFieldValue('transportMode') != 'SHIP' ? 'end' : 'center'"
					>
						<a-form-item label="仓房&货位">
							<a-tree-select
								v-decorator="[`warehouseList`]"
								style="width: 100%"
								class="goods"
								:tree-data="treeData"
								tree-checkable
								:searchValue="null"
								:showSearch="false"
								:treeCheckStrictly="true"
								:replaceFields="{ children: 'goodsAllocations', title: 'name', key: 'id', value: 'id' }"
								search-placeholder="请选择"
							/>
						</a-form-item>
					</a-row>
				</a-col>
			</a-row>
			<a-row v-if="!isEdit">
				<a-form-item
					label="备注"
					style="width: 100%"
				>
					<a-textarea
						style="height: 80px"
						v-decorator="[`remark`]"
						:maxLength="200"
						placeholder="请输入200字以内的文字信息..."
					/>
				</a-form-item>
			</a-row>
		</a-form>
		<!-- 出库 -->
		<a-form
			:form="form"
			class="slFormDetail"
			:colon="false"
			v-if="type == 'OUT'"
		>
			<a-row>
				<a-col :span="8">
					<a-row type="flex">
						<a-form-item :label="`${str}库数量(吨)`">
							<a-input
								placeholder="请输入数量"
								:min="0.0001"
								:max="99999999.9999"
								:precision="4"
								@change="calculateTotalPrice"
								v-decorator="[
									`weight`,
									{
										rules: [
											{ required: true, message: `${str}库数量必填` },
											{ pattern: /^\d+(\.\d{0,4})?$/, message: '数量为非负数，最多四位小数' },
											{ validator: checkWeight }
										]
									}
								]"
							/>
						</a-form-item>
					</a-row>
				</a-col>
				<template v-if="!isManager && logisticsPlatformCenter">
					<a-col :span="8">
						<a-row>
							<a-form-item :label="`${str}库单价(元/吨)`">
								<a-input-number
									:placeholder="`请输入${str}库单价`"
									:min="0"
									:precision="2"
									:max="99999999.99"
									@change="calculateTotalPrice"
									v-decorator="[
										`price`,
										{
											rules: [{ required: true, message: `请填写${str}库单价` }]
										}
									]"
								/>
							</a-form-item>
						</a-row>
					</a-col>
					<a-col
						:span="8"
						v-if="logisticsPlatformCenter"
					>
						<a-row>
							<a-form-item :label="`${str}库货值`">
								<a-input
									placeholder=""
									:min="0"
									:precision="2"
									:disabled="true"
									v-decorator="[`tempTotalPrice`]"
								/>
							</a-form-item>
						</a-row>
					</a-col>
				</template>
				<a-col :span="8">
					<a-row
						type="flex"
						justify="center"
					>
						<a-form-item
							:label="`${str}库日期`"
							:colon="false"
						>
							<a-date-picker
								style="width: 100%"
								placeholder="请选择日期"
								:allowClear="false"
								valueFormat="YYYY-MM-DD"
								v-decorator="[
									'storageDate',
									{
										initialValue: moment().format('yyyy-MM-DD'),
										rules: [{ required: true, message: `${str}库日期必填` }]
									}
								]"
							>
								<span
									slot="suffixIcon"
									class="calendar"
								></span>
							</a-date-picker>
							<span
								slot="extra"
								v-if="execDateDevMax"
							>
								<span
									style="font-size: 12px"
									v-if="execDateDevMax"
								>
									{{ this.type == 'IN' ? '入' : '出' }}库日期与当前日期偏差较多，如果实际如此，请忽略提示
								</span>
							</span>
						</a-form-item>
					</a-row>
				</a-col>
				<a-col :span="8">
					<a-row
						type="flex"
						justify="end"
					>
						<a-form-item label="品名">
							<a-auto-complete
								placeholder="请输入品名"
								:data-source="historyGoodList"
								:getPopupContainer="getPopupContainer"
								:maxLength="200"
								:filterOption="filterOption"
								v-decorator="[
									'goodsName',
									{
										rules: [{ required: true, message: '品名必填' }, { validator: checkLength }]
									}
								]"
							>
							</a-auto-complete>
						</a-form-item>
					</a-row>
				</a-col>
				<a-col :span="8">
					<a-row type="flex">
						<a-form-item
							label="发货单位"
							v-if="!isManager"
						>
							<a-input
								style="width: 100%"
								:maxLength="100"
								placeholder="请输入发货单位"
								:disabled="disableCompany('delivery')"
								@blur="getDeliveryInfo"
								v-decorator="[
									'deliveryCompanyName',
									{
										rules: [{ required: true, message: `发货单位必填` }],
										validateTrigger: ['blur']
									}
								]"
							/>
						</a-form-item>
						<a-form-item
							label="发货单位"
							v-else
						>
							<a-select
								placeholder="请选择发货单位"
								v-decorator="['deliveryCompanyUscc', { rules: [{ required: true, message: '请选择发货单位' }] }]"
								showSearch
								:filterOption="filterOption"
							>
								<a-select-option
									v-for="item in deliveryCompanyList"
									:value="item.creditCode"
									:key="item.creditCode"
									>{{ item.name }}</a-select-option
								>
							</a-select>
						</a-form-item>
					</a-row>
				</a-col>
				<a-col :span="8">
					<a-row
						type="flex"
						justify="center"
					>
						<a-form-item
							label="收货单位"
							v-if="!isManager"
						>
							<a-input
								style="width: 100%"
								:maxLength="100"
								placeholder="请输入收货单位"
								:disabled="disableCompany('receive')"
								@blur="getReceivingInfo"
								v-decorator="[
									'receivingCompanyName',
									{
										rules: [{ required: true, message: `收货单位必填` }],
										validateTrigger: ['blur']
									}
								]"
							/>
						</a-form-item>
						<a-form-item
							label="收货单位"
							v-else
						>
							<a-select
								mode="tags"
								class="tag-selectet"
								placeholder="请选择收货单位"
								v-decorator="['receivingCompanyUscc', { rules: [{ required: true, message: '请选择收货单位' }] }]"
								showSearch
								:filterOption="filterOption"
								@change="onDeliverOrReceive('receive', $event)"
							>
								<a-select-option
									v-for="item in receivingCompanyList"
									:value="item.creditCode"
									:key="item.creditCode"
									>{{ item.name }}</a-select-option
								>
							</a-select>
						</a-form-item>
					</a-row>
				</a-col>
				<a-col
					:span="8"
					v-if="logisticsPlatformCenter"
				>
					<a-row
						type="flex"
						justify="end"
					>
						<a-form-item label="运输方式">
							<a-select
								placeholder="请选择运输方式"
								@change="handleTransportModeChange"
								v-decorator="[
									`transportMode`,
									{
										rules: [{ required: true, message: `运输方式必选` }]
									}
								]"
							>
								<a-select-option
									v-for="(item, index) in transportModeList"
									:key="index"
									:value="item.value"
									>{{ item.label }}</a-select-option
								>
							</a-select>
						</a-form-item>
					</a-row>
				</a-col>
				<a-col
					:span="8"
					v-if="form.getFieldValue('transportMode') != 'SHIP' && logisticsPlatformCenter"
				>
					<a-row type="flex">
						<a-form-item label="出库车数">
							<a-input-number
								placeholder="请输入出库车数"
								:min="1"
								:precision="0"
								:max="9999999999"
								v-decorator="[
									`carsNumber`,
									{
										rules: [{ required: true, message: `出库车数必填` }]
									}
								]"
							/>
						</a-form-item>
					</a-row>
				</a-col>
				<a-col :span="8">
					<a-row
						type="flex"
						:justify="form.getFieldValue('transportMode') != 'SHIP' ? 'center' : 'start'"
					>
						<a-form-item label="仓房&货位">
							<a-tree-select
								v-decorator="[`warehouseList`]"
								style="width: 100%"
								class="goods"
								:tree-data="treeData"
								tree-checkable
								:treeCheckStrictly="true"
								:searchValue="null"
								allow-clear
								:replaceFields="{ children: 'goodsAllocations', title: 'name', key: 'id', value: 'id' }"
								searchPlaceholder="请选择"
							/>
						</a-form-item>
					</a-row>
				</a-col>
				<a-col
					:span="8"
					v-if="getWarehouseReceivable()"
				>
					<a-row
						type="flex"
						:justify="form.getFieldValue('transportMode') != 'SHIP' ? 'end' : 'center'"
					>
						<a-form-item label="实际提货单位">
							<a-input
								:disabled="true"
								placeholder="请输入实际提货单位"
								v-decorator="[
									'actualLadingUnit',
									{
										rules: [{ required: true, message: '实际提货单位必填' }]
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
					<a-row
						type="flex"
						:justify="form.getFieldValue('transportMode') != 'SHIP' ? 'start' : 'end'"
					>
						<a-form-item label="实际收货单位">
							<a-input
								:disabled="true"
								placeholder="请输入实际收货单位"
								v-decorator="[
									'actualReceivingUnit',
									{
										rules: [{ required: true, message: '实际收货单位必填' }]
									}
								]"
							/>
						</a-form-item>
					</a-row>
				</a-col>
				<a-col
					:span="8"
					v-if="form.getFieldValue('transportMode') == 'AUTOMOBILE'"
				>
					<a-row
						type="flex"
						:justify="getWarehouseReceivable() ? 'center' : 'end'"
					>
						<a-form-item label="收货地址">
							<a-tooltip>
								<a-select
									showArrow
									showSearch
									class="receive-address"
									placeholder="请选择收货地址"
									v-decorator="[
										'receivingAddress',
										{
											rules: [{ required: isRelation, message: '请选择收货地址' }]
										}
									]"
									:filterOption="filterOption"
									@change="handleReceivingAddressChanged"
								>
									<span
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
					</a-row>
				</a-col>
			</a-row>
			<a-row v-if="!isEdit">
				<a-form-item
					label="备注"
					style="width: 100%"
				>
					<a-textarea
						style="height: 80px"
						v-decorator="[`remark`]"
						:maxLength="200"
						placeholder="请输入200字以内的文字信息..."
					/>
				</a-form-item>
			</a-row>
		</a-form>
		<a-row
			class="textarea-box"
			v-if="isEdit"
		>
			<a-form-item
				label="备注"
				style="width: 100%"
				v-for="(item, i) in remarkList"
				:key="i"
			>
				<div class="textarea">
					<p>{{ item.createdDate }}</p>
					<a-textarea
						style="height: 50px; border: 0"
						v-model="item.remark"
						:maxLength="200"
						placeholder="请输入200字以内的文字信息..."
					/>
				</div>
			</a-form-item>
		</a-row>
		<AddressCheckPort
			ref="checkPort"
			@selectPort="selectPort"
		/>
	</div>
</template>

<script>
import { getPopupContainer } from '@/v2/utils/factory.js';
import { getInOutHistoryList } from '@/v2/center/logisticsPlatform/api/inout.js';
import { searchCompany } from '@/v2/center/logisticsPlatform/api/contract';
import reg from '@sub/utils/reg.js';
import { mapGetters } from 'vuex';
import moment from 'moment';
import { debounce } from 'lodash';
import { getHouseListNew } from '@/v2/center/logisticsPlatform/api/selectData';
import { getDeliveryCompanyList, getReceivingCompanyList, getStationReceiveAddress } from '@/v2/center/logisticsPlatform/api';
import AddressCheckPort from '@/v2/center/logisticsPlatform/components/coalPlan/AddressCheckPort';

// 处理银行卡分为
export default {
	props: {
		type: {
			default: 'IN'
		},
		isCoreCompany: { type: Boolean, default: () => true },
		isManager: { type: Boolean, default: () => false },
		// 是否关联合同
		isRelation: {},
		// 关联的合同详情
		selectContractInfo: {},
		// 放货指令信息
		releaseInstructData: {},
		logisticsPlatformCenter: { type: Boolean, default: () => false }
	},
	components: { AddressCheckPort },

	data() {
		return {
			form: this.$form.createForm(this, { onValuesChange: this.onValuesChange }),
			info: {},
			/** 银行号处理 unit */
			bankNoShow: false,
			unit: '',
			execDateDevMax: false,
			// 金额
			priceShow: false,
			priceUnit: '',
			// 历史品名列表
			historyGoodList: [],
			moment,
			// 历史 坑位列表
			historyHoleList: [],
			transportModeList: [
				{ value: 'AUTOMOBILE', label: '汽运' },
				{ value: 'TRAIN', label: '火运' },
				{ value: 'SHIP', label: '船运' }
			],
			treeData: [],
			remarkList: [],
			receivingInfo: [],
			deliveryInfo: [],
			receivingCompanyList: [],
			deliveryCompanyList: [],
			addressInfo: null,
			receivingAddressList: []
		};
	},
	computed: {
		...mapGetters('config', {
			VUEX_ST_ALLCODE: 'VUEX_ST_ALLCODE'
		}),
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER',
			VUEX_CURRENT_PLATEFORM: 'VUEX_CURRENT_PLATEFORM'
		}),
		// 编辑
		isEdit() {
			return !!this.$route.query.id;
		},
		str() {
			return this.type == 'IN' ? '入' : '出';
		}
	},
	watch: {
		releaseInstructData: {
			deep: true,
			immediate: true,
			handler(val) {
				if (val) {
					if (this.getWarehouseReceivable()) {
						this.$nextTick(() => {
							this.form.setFieldsValue({
								actualLadingUnit: val.actualLadingUnit,
								actualReceivingUnit: val.actualReceivingUnit
							});
						});
					}
				}
			}
		},
		isRelation: {
			handler(val) {
				// 如果第一次编辑
				if (this.selectContractInfo.firstEdit) {
					return;
				}
				if (this.isManager) {
					return;
				}
				if (val) {
					/** 设置收货单位和发货单位 */
					this.$nextTick(() => {
						const obj = {};
						if (this.type == 'IN') {
							obj.deliveryCompanyName = this.selectContractInfo.sellerName;
							obj.receivingCompanyName = this.VUEX_ST_COMPANYSUER.companyName;
						} else {
							obj.deliveryCompanyName = this.VUEX_ST_COMPANYSUER.companyName;
							obj.receivingCompanyName = this.selectContractInfo.buyerName;
						}
						this.form.setFieldsValue(obj);
						this.getDeliveryInfo(obj.deliveryCompanyName);
						this.getReceivingInfo(obj.receivingCompanyName);
					});
					// 并且 运输方式 不是 汽运+火运
					if (
						!['NONE', 'AUTOMOBILE_AND_TRAIN'].includes(this.selectContractInfo.transType) &&
						!['NONE', 'AUTOMOBILE_AND_TRAIN'].includes(this.selectContractInfo.transportMode)
					) {
						//  默认选择合同的运输方式
						this.$nextTick(() => {
							this.form.setFieldsValue({
								transportMode: this.selectContractInfo.transType || this.selectContractInfo.transportMode
							});
						});
					} else {
						this.$nextTick(() => {
							this.form.setFieldsValue({ transportMode: undefined });
						});
					}
				} else {
					this.$nextTick(() => {
						const obj = {
							transportMode: undefined
						};
						if (this.type == 'IN') {
							obj.receivingCompanyName = this.VUEX_ST_COMPANYSUER.companyName;
							obj.deliveryCompanyName = undefined;
						} else {
							obj.deliveryCompanyName = this.VUEX_ST_COMPANYSUER.companyName;
							obj.receivingCompanyName = undefined;
						}
						this.form.setFieldsValue(obj);
						this.getDeliveryInfo(obj.deliveryCompanyName);
						this.getReceivingInfo(obj.receivingCompanyName);
					});
				}
			},
			deep: true,
			immediate: true
		}
	},

	mounted() {
		if (this.isManager) {
			this.getDeliveryCompanyList();
			this.getReceivingCompanyList();
		}
		this.getInOutHistoryList();
		this.getReceivingAddressList();
		if (!this.$route.query.id) {
			this.getHouseList();
		}
	},
	methods: {
		handleTransportModeChange(val, e) {
			if (this.getWarehouseReceivable() && this.releaseInstructData) {
				this.$nextTick(() => {
					this.form.setFieldsValue({
						actualLadingUnit: this.releaseInstructData.actualLadingUnit,
						actualReceivingUnit: this.releaseInstructData.actualReceivingUnit
					});
				});
			}
		},
		getWarehouseReceivable() {
			return this.type == 'OUT' && this.selectContractInfo.warehouseToReceivable && this.releaseInstructData;
		},
		getPopupContainer,
		filterOption(input, option) {
			return option.componentOptions.children[0].text.toUpperCase().indexOf(input.toUpperCase()) >= 0;
		},
		disableCompany(type) {
			if (this.isManager) {
				return false;
			}
			if (type == 'delivery') {
				return (this.isRelation && this.type == 'IN') || this.type == 'OUT';
			}
			return (this.isRelation && this.type == 'OUT') || this.type == 'IN';
		},
		disabledDate(current) {
			return current && current > moment().endOf('day');
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
		getReceivingAddressList() {
			getStationReceiveAddress().then(({ success, data }) => {
				if (!success) {
					return;
				}
				this.receivingAddressList = data;
			});
		},

		// 发货公司列表
		getDeliveryInfo: debounce(function (e) {
			if (!e) return;
			const name = e.target ? e.target.value : e;
			if (!name) return;
			if (this.isManager && !reg.hanZi.test(name)) {
				this.$message.error('请输入至少两个汉字且以汉字结尾');
				return;
			}
			searchCompany({
				name,
				t: Math.random()
			}).then(res => {
				if (res.success) {
					if (!res.data || !res.data?.creditCode) {
						this.form.setFieldsValue({ deliveryCompanyName: undefined });
						this.$message.error('未查询到当前企业');
					}
					this.deliveryInfo = res.data;
				}
			});
		}, 200),
		// 收货公司列表
		getReceivingInfo: debounce(function (e) {
			if (!e) return;
			const name = e.target ? e.target.value : e;
			if (!name) return;
			if (this.isManager && !reg.hanZi.test(name)) {
				this.$message.error('请输入至少两个汉字且以汉字结尾');
				return;
			}
			searchCompany({
				name: name,
				t: Math.random()
			}).then(res => {
				if (res.success) {
					if (!res.data || !res.data?.creditCode) {
						this.form.setFieldsValue({ receivingCompanyName: undefined });
						this.$message.error('未查询到当前企业');
					}
					this.receivingInfo = res.data;
				}
			});
		}, 200),
		openAddress() {
			// receiveArea	string
			// 收货所在地区
			// receiveAddress	string
			// 收货详细地址
			// receiveLongitude	string
			// 收货地址经度
			// receiveLatitude	string
			// 收货地址纬度
			// receiveElectronicFenceRadius
			this.$refs.checkPort.show(this.addressInfo, true);
		},
		selectPort(res) {
			let { address, area, lat, lon, radius, name } = res;
			this.addressInfo = {
				receiveArea: area,
				receiveAddress: address,
				receiveAddressKeywords: name,
				receiveLongitude: lon,
				receiveLatitude: lat,
				receiveElectronicFenceRadius: radius
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
					// receivingAddress: `${lat}${lon}${radius}`
					receivingAddress: name ?? address
				});
			});
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

		async init(info) {
			this.form.setFieldsValue(info);
			this.info = info;
			this.remarkList = info.remarkList;
			if (!info.remarkList.length) {
				this.remarkList = [{ remark: '' }];
			}
			/** 附件 */
			this.getHouseList();
		},
		// 获取历史坑/矿口历史记录
		async getInOutHistoryList() {
			const params = {
				stationId: this.VUEX_CURRENT_PLATEFORM.stationId,
				type: ['HOLE', 'GOODS']
			};
			const res = await getInOutHistoryList(params);
			this.historyGoodList = res.data.filter(el => el.type == 'GOODS').map(el => el.name);
			this.historyHoleList = res.data.filter(el => el.type == 'HOLE').map(el => el.name);
		},

		async checkLength(rule, value, callback) {
			if (value && value.length > 200) {
				callback('长度需在 1-200 字之间');
			} else {
				callback();
			}
		},
		async checkWeight(rule, value, callback) {
			if (!value) {
				callback();
			} else {
				if (!/^\d+(\.\d{0,4})?$/.test(value)) {
					callback();
				}
				var lastChar = value.charAt(value.length - 1);
				if (lastChar == '.') {
					callback('请输入0.0001 - 99999999.9999的数字');
				}
				if (value > 99999999.9999 || value < 0.0001) {
					callback('请输入0.0001 - 99999999.9999的数字');
				}

				// ● 出库数量（吨）字段新增校验：如选择放货指令，填写的出库数量（吨）需小于等于放货数量
				if (
					this.type == 'OUT' &&
					this.releaseInstructData?.releaseQuantity &&
					value > this.releaseInstructData?.releaseQuantity
				) {
					callback(`放货数量${this.releaseInstructData?.releaseQuantity}吨，出库数量需小于等于放货数量`);
				}

				callback();
			}

			// checkWeight

			// if(value && value.length > 200) {
			//    callback("长度需在 1-200 字之间");
			// } else {
			//   callback()
			// }
		},
		// 检测是否未数字
		checkNumber(rule, value, callback) {
			if (!value) {
				callback();
			} else {
				if (value.length < 5) {
					callback('长度需要在 5 和 50之间');
				} else if (!/^[1-9]\d{4,49}$/.test(value)) {
					callback('请输入正确银行账号');
				} else {
					callback();
				}
			}
		},
		onValuesChange(props, values) {
			if (values.hasOwnProperty('storageDate')) {
				//当选择签订日期与当前系统日期偏差大于30天时，提示
				if (Math.abs(moment(values.storageDate).diff(moment(), 'days')) > 30) {
					this.execDateDevMax = true;
				} else {
					this.execDateDevMax = false;
				}
			}
			// 推送运输方式
			if (values.hasOwnProperty('transportMode')) {
				this.$emit('sendTransportMode', values.transportMode);
			}
		},
		// 获取仓房列表
		async getHouseList() {
			const res = await getHouseListNew();
			const list = res.data || [];
			list.forEach(el => {
				el.isGoods = true;
				el.goodsAllocations.forEach(el2 => {
					el2.isGoods = true;
					el2.realId = el2.id;
					el2.id = `${el.id}-${el2.id}`;

					el2.name = `${el.name}&${el2.name}`;
				});
			});
			this.treeData = list;
			// 编辑
			if (this.$route.query.id && this.info.warehouseList.length) {
				let warehouseList = this.info.warehouseList;
				this.$nextTick(() => {
					const list = [];
					warehouseList.forEach(el => {
						const item = this.treeData.find(el2 => el2.id == el.warehouseId) || {};

						if (!el.goodsAllocationList.length) {
							list.push({ label: item.name, value: item.id });
						} else {
							el.goodsAllocationList.forEach(el2 => {
								const childItem = item.goodsAllocations.find(el3 => el3.realId == el2) || {};
								list.push({ label: childItem.name, value: childItem.id });
							});
						}
					});
					// 测试用
					this.form.setFieldsValue({
						warehouseList: list
					});
				});
			}
		},
		save() {
			return new Promise(resolve => {
				this.form.validateFieldsAndScroll((err, values) => {
					if (!err) {
						let list = [];
						// 获取父级
						if (values.warehouseList) {
							this.treeData.forEach(el => {
								// 货位
								const flag = values.warehouseList.some(el2 => el2.value.includes(el.id) && el2.value.includes('-'));
								const flag1 = values.warehouseList.some(el2 => el2.value == el.id);
								let isExist = list.some(el2 => el2.warehouseId);
								if ((flag && !isExist) || flag1) {
									list.push({
										warehouseId: el.id,
										goodsAllocationIdList: []
									});
								}
							});
							//  }
							const newWarehouseList = values.warehouseList.filter(el => el.value.includes('-'));
							newWarehouseList.forEach(el => {
								const arr = el.value.split('-');
								list.forEach(el2 => {
									if (el2.warehouseId == arr[0]) {
										el2.goodsAllocationIdList.push(arr[1]);
									}
								});
							});
						}
						const companyInfo = {
							deliveryCompanyUscc: values.deliveryCompanyUscc,
							receivingCompanyUscc: values.receivingCompanyUscc
						};
						if (!this.isManager) {
							companyInfo.deliveryCompanyUscc = this.deliveryInfo.creditCode;
							companyInfo.receivingCompanyUscc = this.receivingInfo.creditCode;
						} else {
							companyInfo.deliveryCompanyName = this.deliveryCompanyList.find(
								item => item.creditCode == values.deliveryCompanyUscc
							)?.name;
							companyInfo.receivingCompanyName = this.receivingCompanyList.find(
								item => item.creditCode == values.receivingCompanyUscc
							)?.name;

							if (!companyInfo.deliveryCompanyName) {
								companyInfo.deliveryCompanyName = this.handleUscc(values.deliveryCompanyUscc);
								companyInfo.deliveryCompanyUscc = '';
							} else {
								companyInfo.deliveryCompanyUscc = this.handleUscc(values.deliveryCompanyUscc);
							}
							if (!companyInfo.receivingCompanyName) {
								companyInfo.receivingCompanyName = this.handleUscc(values.receivingCompanyUscc);
								companyInfo.receivingCompanyUscc = '';
							} else {
								companyInfo.receivingCompanyUscc = this.handleUscc(values.receivingCompanyUscc);
							}
						}
						let address = this.addressInfo ?? {};
						resolve({ ...values, warehouseList: list, remarkList: this.remarkList, ...companyInfo, ...address });
					} else {
						resolve(false);
					}
				});
			});
		},
		handleUscc(uscc) {
			if (Array.isArray(uscc)) {
				return uscc[0];
			}
			return uscc;
		},
		onDeliverOrReceive(type, code) {
			let field = '';
			if (type == 'delivery') {
				field = 'deliveryCompanyUscc';
			} else {
				field = 'receivingCompanyUscc';
			}
			if (!field) {
				return;
			}

			const timer = setTimeout(() => {
				clearTimeout(timer);
				this.form.setFieldsValue({
					[field]: Array.isArray(code) ? code.slice(-1) : [code]
				});
			}, 10);
		},
		// 计算货值
		calculateTotalPrice() {
			if (this.isManager) {
				return;
			}
			this.$nextTick(() => {
				const { weight, price } = this.form.getFieldsValue();
				const weightNumber = Number(weight);
				const priceNumber = Number(price);
				if (isNaN(weightNumber) || isNaN(priceNumber)) {
					return;
				}
				if (weightNumber && priceNumber) {
					let tempTotalPrice = weightNumber * priceNumber;
					// 保留两位小数
					tempTotalPrice = tempTotalPrice.toFixed(2);
					this.form.setFieldsValue({ tempTotalPrice });
				}
			});
		}
	}
};
</script>

<style scoped lang="less">
.slFormDetail {
	.ant-row {
		.ant-col-8:nth-child(3n + 1) {
			display: flex;
			justify-content: left;
		}
		.ant-col-8:nth-child(3n + 2) {
			display: flex;
			justify-content: center;
		}
		.ant-col-8:nth-child(3n) {
			display: flex;
			justify-content: right;
		}
	}
}
/deep/ .ant-form-extra {
	padding-top: 0;
}

.ant-col {
	height: 82px;
	// margin-bottom: 10px
}

.col-height.ant-col {
	height: inherit;
}

.ant-form-item {
	width: 364px;
	margin-bottom: 0;
}

.calendar,
.select {
	width: 20px;
	height: 20px;
	display: inline-block;
	vertical-align: middle;
	background: url(~assets/imgs/newInvoice/calendar.png) no-repeat;
	background-size: contain;
	line-height: 38px !important;
	top: 40%;
}

.goods {
	/deep/ .ant-select-selection {
		height: auto;
	}
}

.textarea-box {
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
