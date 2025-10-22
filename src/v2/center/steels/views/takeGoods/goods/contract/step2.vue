<template>
	<div>
		<p class="title-wrap">基本信息</p>
		<a-form
			:form="form"
			:label-col="{ span: 8 }"
			:wrapper-col="{ span: 16 }"
			labelAlign="left"
			class="ant-advanced-search-form"
		>
			<a-row :gutter="24">
				<a-col :span="8">
					<a-tooltip>
						<template slot="title">
							{{ contractDetails.contractNo }}
						</template>
						<a-form-item label="合同编号">
							<a-input
								v-decorator="['contractNo']"
								:disabled="disabledConstractInput"
							/>
						</a-form-item>
					</a-tooltip>
				</a-col>
				<a-col :span="8">
					<a-form-item label="卖方名称">
						<a-input
							v-decorator="['sellCompanyName']"
							:disabled="disabledConstractInput"
						/>
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-form-item label="钢材种类">
						<a-input
							v-decorator="['steelType']"
							:disabled="disabledConstractInput"
						/>
					</a-form-item>
				</a-col>
			</a-row>
			<a-row :gutter="24">
				<a-col :span="8">
					<a-form-item label="交提货地点">
						<a-input
							v-decorator="['deliveryPlace']"
							:disabled="disabledConstractInput"
						/>
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-form-item label="合同期限">
						<a-input
							v-decorator="['effectiveStartDate']"
							:disabled="disabledConstractInput"
						/>
					</a-form-item>
				</a-col>
				<a-col
					:span="8"
					v-show="contractDetails.steelType == 'FINISHED_STEEL' && businessType == 2"
				>
					<a-form-item label="是否指定规格">
						<a-input
							v-decorator="['appointSpecDesc']"
							:disabled="disabledConstractInput"
						/>
					</a-form-item>
				</a-col>
				<!-- 不指定规格 -->
				<a-col
					:span="8"
					v-show="appointSpec == 0 && [1, 3].includes(businessType)"
				>
					<a-form-item label="可提数量">
						<a-input
							v-model="availableQuantity"
							:disabled="true"
						/>
					</a-form-item>
				</a-col>
				<a-col
					:span="8"
					v-show="appointSpec == 0 && [1, 3].includes(businessType)"
				>
					<a-form-item label="可提件数">
						<a-input
							v-model="availablePieceQuantity"
							:disabled="true"
						/>
					</a-form-item>
				</a-col>
				<a-col
					:span="8"
					v-if="[1, 3].includes(businessType)"
					@change="changeAppointSpec"
				>
					<a-form-item
						label="选择提货方式"
						style="display: flex; align-items: center"
					>
						<a-radio-group
							v-model="appointSpec"
							:disabled="disabledAll"
							style="display: flex; align-items: center"
						>
							<a-radio :value="1"> 指定规格 </a-radio>
							<a-radio :value="0"> 不指定规格</a-radio>
						</a-radio-group>
					</a-form-item>
				</a-col>
			</a-row>
			<!-- v-if='businessLineFullNoList.length > 1' -->
			<a-col
				:span="8"
				v-if="businessLineFullNoList.length > 1 && (businessType == 1 || issueMode == 'CONTRACT')"
			>
				<a-form-item label="选择业务线">
					<a-select
						@change="changeAppointSpec"
						v-model="businessLineFullNo"
						placeholder="请选择业务线"
					>
						<a-select-option
							:value="item.relationNo"
							v-for="item in businessLineFullNoList"
							:key="item.relationNo"
						>
							{{ item.companyName }}
						</a-select-option>
					</a-select>
				</a-form-item>
			</a-col>
		</a-form>
		<div>
			<p class="contract-title">
				<span>{{ businessType == 1 ? '货转信息' : '合同清单' }}</span>
				<a-button
					v-if="businessType == 1"
					type="primary"
					@click="exportDetailsList(2)"
					icon="export"
					:disabled="disabledExport"
					>导出</a-button
				>
				<a-button
					v-else
					type="primary"
					@click="exportDetailsList(1)"
					icon="export"
					:disabled="disabledExport"
					>导出</a-button
				>
			</p>
			<!-- 选择业务线 -->
			<a-table
				:class="[appointSpec == 0 ? '' : 'contract-table-wrap']"
				:row-selection="rowSelection"
				:columns="billColumns"
				:data-source="data"
				:pagination="false"
				:scroll="{ x: 1200, y: 240 }"
				:rowKey="businessType == 1 ? 'mainId' : 'purchaseId'"
			>
			</a-table>
			<!-- <p style="color:red" v-if="(businessType == 1 && appointSpec == 0) && (detailInfo.fromGoodsTransfer || !$route.query.type )">注：该合同下可提货物数量{{availableQuantity}}吨</p> -->
		</div>
		<p class="contract-title">
			<span>申请提货列表</span>
			<span>
				<a-button
					type="default"
					:disabled="templateDownloadBtn"
					@click="templateDownloadMethod"
					v-if="[null, undefined].includes(this.$route.query.type)"
					><a-icon type="download" />模板下载</a-button
				>
				<a-upload
					name="file"
					:multiple="false"
					:action="actionGoods"
					:headers="headers"
					@change="handleChangeGoods"
					style="margin-left: 20px"
					:accept="acceptFormat"
					:data="uploadQuerydata"
					:showUploadList="false"
					v-if="[null, undefined, 'edit'].includes(this.$route.query.type)"
				>
					<a-button type="primary"> <a-icon type="upload" /> 导入提货列表 </a-button>
				</a-upload>
			</span>
		</p>

		<!-- 只有定规格的时候才显示 -->
		<a-table
			bordered
			v-if="appointSpec == 1"
			:columns="columnsSpecifications"
			:data-source="dataList"
			:pagination="false"
			:scroll="{ x: 1000, y: 240 }"
			:rowKey="disabledAll || editAll ? 'id' : 'index'"
		>
			<span slot="materialName"> <span class="table-required">*</span>品名 </span>
			<span slot="materialTexture"> <span class="table-required">*</span>材质 </span>
			<span slot="specs"> <span class="table-required">*</span>规格 </span>
			<span slot="placeOfOrigin"> <span class="table-required">*</span>产地 </span>
			<span slot="metrologyWay"> <span class="table-required">*</span>计量方式 </span>

			<span slot="baleNo"> <span class="table-required">*</span>预提捆包号 </span>
			<span slot="currentApplyPieceQuantity"> <span class="table-required">*</span>预提件数 </span>
			<span slot="theoreticalWeight2"> <span class="table-required">*</span>理重 </span>
			<span slot="currentApplyQuantity"> <span class="table-required">*</span>预提数量 </span>
			<!-- 规格 -->
			<span
				slot="specs"
				slot-scope="text, record"
				v-if="record.materialName != '合计'"
			>
				<!-- 合同不指定规格  并且不能是代采+仓押 仓押业务-->
				<a-input
					v-model="record.specs"
					size="small"
					:disabled="disabledAll"
					placeholder=""
					:maxLength="50"
					v-if="businessType != 1 && businessType != 3"
				/>
				<span v-else>{{ record.specs }}</span>
			</span>
			<!-- 预提件数 -->
			<span
				slot="currentApplyPieceQuantity"
				slot-scope="text, record"
				v-if="record.materialName != '合计'"
			>
				<div v-if="handleType(record) == 1 || typeof record.availablePieceQuantity == 'number'">
					<a-input-number
						v-model="record.currentApplyPieceQuantity"
						:min="1"
						@blur="checkVariable(record, 'currentApplyPieceQuantity', 'number')"
						:step="1"
						:formatter="value => `${value && parseInt(value)}`"
						size="small"
						:disabled="disabledAll"
						placeholder="请输入正整数"
					/>
				</div>
				<div v-else>
					<a-input
						v-model="record.currentApplyPieceQuantity"
						:max="computedAvailable(record, 'availablePieceQuantity')"
						size="small"
						@blur="checkVariable(record, 'currentApplyPieceQuantity')"
						:disabled="disabledAll"
						placeholder="请输入"
					/>
				</div>
			</span>
			<span v-else>{{ computedLastRow.currentApplyPieceQuantityTotal }}</span>
			<span
				slot="theoreticalWeight"
				slot-scope="text, record"
				v-if="record.materialName != '合计'"
			>
				<!-- 理重不可编辑 -->
				<span v-if="handleType(record) == 1">
					{{ record.theoreticalWeight }}
				</span>
				<span v-else>/</span>
			</span>
			<!-- 预提数量不可编辑 -->
			<!-- 
        数量初始值为合同里面数量
        如果数量可编辑 理重 = 数量/件数
        如果数量不可编辑 数量 = 件数*理重
       -->
			<span
				slot="currentApplyQuantity"
				slot-scope="text, record"
				v-if="record.materialName != '合计'"
			>
				<!-- 数量不可编辑 -->
				<!-- <span v-if="handleType(record) == 1">
          {{ Math.round(record.theoreticalWeight * record.currentApplyPieceQuantity * 1000) / 1000 }}
        </span> -->
				<!-- 预提数量可编辑 -->
				<span>
					<!-- :max="computedAvailable(record, 'availableQuantity')" -->
					<a-input-number
						v-model="record.currentApplyQuantity"
						:min="0.0001"
						size="small"
						:key="record.purchaseId"
						:step="0.0001"
						:max="1000000000"
						:disabled="disabledAll"
						@blur="e => formateInputQuantity(e, record)"
					/>
				</span>
			</span>
			<span v-else>{{ computedLastRow.currentApplyQuantityTotal }}</span>
			<span
				slot="metrologyWay"
				slot-scope="text, record"
				v-if="record.materialName != '合计'"
			>
				<a-input
					v-model="record.metrologyWay"
					:maxLength="50"
					size="small"
					:disabled="disabledAll"
				/>
			</span>
			<!-- 预提捆包号 -->
			<span
				slot="baleNo"
				slot-scope="text, record"
				v-if="record.materialName != '合计'"
			>
				<span v-if="handleType(record) == 3 && !record.baleNoDisabled">
					<a-input
						v-model="record.baleNo"
						size="small"
						:disabled="disabledAll"
						placeholder="若无可输入/"
					/>
				</span>
				<span v-else-if="handleType(record) == 3 && record.baleNoDisabled">{{ record.baleNo }}</span>
				<span v-else> /</span>
			</span>
			<span
				slot="warehouseInfo"
				slot-scope="text, record"
				v-if="record.materialName != '合计'"
			>
				<a-input
					v-model="record.warehouseInfo"
					:maxLength="15"
					size="small"
					:disabled="disabledAll"
				/>
			</span>
			<span
				slot="remark"
				slot-scope="text, record"
				v-if="record.materialName != '合计'"
			>
				<a-input
					v-model="record.remark"
					:maxLength="50"
					size="small"
					:disabled="disabledAll"
				/>
			</span>
			<span
				slot="methods"
				slot-scope="text, record"
				v-if="record.materialName != '合计'"
			>
				<a-button
					type="primary"
					shape="circle"
					icon="plus"
					@click="add(record)"
					:disabled="disabledAll"
					v-if="!contractDetails.appointSpec"
				/>
				<a-button
					style="margin-left: 10px"
					type="danger"
					shape="circle"
					icon="minus"
					@click="minus(record)"
					:disabled="disabledAll"
				/>
			</span>
		</a-table>
		<!-- 不指定规格 -->
		<PurchaseDetails
			:editable="!disabledAll"
			:noTitle="false"
			ref="purchaseDetails"
			v-if="appointSpec == 0"
			:businessLineFullNo="businessLineFullNo"
			:contractDetails="contractDetails"
			:selectedData="purchaseDetailList"
			:contractTemplate="contractDetails.contractTemplate"
			:steelType="contractDetails.steelType"
			:materialNameArr="data"
		></PurchaseDetails>
		<p class="contract-title">
			<span>提货方式</span>
		</p>
		<a-form
			:form="formType"
			:label-col="{ span: 8 }"
			:wrapper-col="{ span: 16 }"
			labelAlign="left"
			class="ant-advanced-search-form"
		>
			<a-row :gutter="24">
				<a-col :span="8">
					<a-form-item label="提货方式">
						<a-select
							v-decorator="[
								'takeType',
								{
									rules: [{ required: true, message: '请选择提货方式!' }]
								}
							]"
							placeholder="请选择提货方式"
							@change="handleFormTakeTypeChange"
							:disabled="disabledAll"
						>
							<a-select-option
								:value="item.value"
								v-for="item in takeTypeEnum"
								:key="item.value"
							>
								{{ item.label }}
							</a-select-option>
						</a-select>
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-form-item label="预计提货日期">
						<a-date-picker
							:disabled-date="disabledDate"
							style="width: 100%"
							v-decorator="[
								'expectTakeDate',
								{
									rules: [{ required: true, message: '请选择预计提货日期!' }]
								}
							]"
							placeholder="请选择预计提货日期"
							:disabled="disabledAll"
						/>
					</a-form-item>
				</a-col>
			</a-row>
			<div v-if="showCardInfo">
				<p class="contract-title">
					<span class="card-info"
						>车辆信息录入方式
						<span style="color: #f5222d">(车船号和身份证号至少有一个必须填写)</span>
					</span>
					<span>
						<a-button
							type="default"
							:disabled="templateDownloadApplyBtn || disabledAll"
							@click="templateDownloadApplyMethod"
							><a-icon type="download" />模板下载</a-button
						>
						<a-upload
							name="file"
							:multiple="false"
							:action="action"
							:headers="headers"
							@change="handleApplyChange"
							style="margin-left: 20px"
							:accept="acceptFormat"
							:showUploadList="false"
						>
							<a-button
								type="primary"
								:disabled="disabledAll"
							>
								<a-icon type="upload" /> 批量导入
							</a-button>
						</a-upload>
					</span>
				</p>
				<a-table
					rowKey="id"
					:columns="columnsCar"
					:data-source="dataCar"
					:scroll="{ x: 1000, y: 300 }"
					:pagination="false"
				>
					<span slot="carNumber"> <span class="table-required"></span>车船号 </span>
					<span
						slot="id"
						slot-scope="text, record"
					>
						{{ record.index }}
					</span>
					<span
						slot="carNumber"
						slot-scope="text, record"
					>
						<a-input
							v-model="record.carNumber"
							size="small"
							:disabled="disabledAll"
						/>
					</span>
					<span
						slot="carName"
						slot-scope="text, record"
					>
						<a-input
							v-model="record.carName"
							size="small"
							:disabled="disabledAll"
						/>
					</span>
					<span
						slot="carTel"
						slot-scope="text, record"
					>
						<a-input-number
							v-model="record.carTel"
							size="small"
							:maxLength="11"
							:disabled="disabledAll"
							style="width: 100%"
						/>
					</span>
					<span
						slot="carId"
						slot-scope="text, record"
					>
						<a-input
							v-model="record.carId"
							size="small"
							:maxLength="18"
							:disabled="disabledAll"
						/>
					</span>
					<a
						slot="methods"
						slot-scope="text, record"
					>
						<a-button
							type="primary"
							shape="circle"
							icon="plus"
							@click="addCar(record)"
							:disabled="disabledAll"
						/>
						<a-button
							style="margin-left: 10px"
							v-if="record.id >= 1"
							type="danger"
							shape="circle"
							icon="minus"
							@click="minusCar(record)"
							:disabled="disabledAll"
						/>
					</a>
				</a-table>
			</div>
		</a-form>
		<div v-if="disabledAll">
			<p class="title-wrap">操作历史</p>
			<Log :logList="operationHistory"></Log>
		</div>
		<div class="footer-btn-wrap">
			<p>
				<a-button @click="prev">返回</a-button>
				<!-- 驳回状态不显示按钮 -->
				<a-button
					style="margin-left: 40px"
					@click="save(1)"
					:loading="disabledSubmit"
					v-show="!disabledAll && ![3].includes(detailInfo.takeDeliveryApply.status)"
					>保存</a-button
				>
				<a-button
					type="primary"
					style="margin-left: 40px"
					@click="save(2)"
					:loading="disabledSubmit"
					v-show="!disabledAll"
					>提交</a-button
				>
			</p>
		</div>
	</div>
</template>

<script>
import Pagination from '../../components/pagination.vue';
import {
	columns,
	noAppointColumns,
	transferColumns,
	noAppointTransferColumns,
	columnsSpecifications,
	columnsNoSpecifications,
	columnsCar
} from '../../config/stockStep2';
import { columnsOperation } from '../../config/orderStep2';
import {
	goodsApplySaveOrSubmit,
	getConstractDetailsById,
	getGoodsTransferDetail,
	getShowTakeDeliveryInfo,
	exportContractPurchase,
	templateDownload,
	exportGoodsPurchase,
	API_GetCompanyBusinessLineList
} from '@/v2/center/steels/api/orderApply';

import comDownload from '@sub/utils/comDownload.js';
import { mapGetters } from 'vuex';
import moment from 'moment';
import { cloneDeep } from 'lodash';
import { filterCodeBySteelKey } from '@sub/utils/globalCode.js';
import { customAlphabet } from 'nanoid';
import Log from '@/v2/center/steels/components/Log.vue';
import PurchaseDetails from '../../components/PurchaseDetails.vue';
import ENV from '@/v2/config/env';
const nanoid = customAlphabet('1234567890', 10);
export default {
	name: 'step2',
	props: {
		id: {
			type: [String, Number],
			default: ''
		}
	},
	data() {
		return {
			form: this.$form.createForm(this, { name: 'form' }),
			// 业务线
			form2: this.$form.createForm(this, { name: 'form2' }),
			formType: this.$form.createForm(this, { name: 'formType' }),
			formCar: this.$form.createForm(this, { name: 'formCar' }),
			data: [],
			dataCar: [
				{
					id: 1,
					index: 1,
					carNumber: '',
					carName: '',
					carTel: '',
					carId: ''
				}
			],
			dataList: [],
			columns,
			columnsCar,
			selectedRowKeys: [],
			columnsSpecifications,
			columnsNoSpecifications,
			columnsOperation,
			action: `${ENV.BASE_GANG_API}/takeDeliveryApply/takeModelmportExcel`,
			actionGoods: `${ENV.BASE_GANG_API}/takeDeliveryApply/takeApplyImportExcel`,
			acceptFormat: '.xlsx,.xls',
			filePath: process.env.BASE_URL + 'files/' + '提货申请列表导入模板.xlsx',
			contractDetails: {},
			steelType: filterCodeBySteelKey('steelType'),
			takeTypeEnum: filterCodeBySteelKey('takeType'),
			showCardInfo: false,
			disabledSubmit: false,
			messageList: {
				1: '保存成功',
				2: '提交成功'
			},
			disabledExport: false,
			templateDownloadBtn: false,
			templateDownloadApplyBtn: false,
			publicPath: process.env.BASE_URL,
			detailInfo: {
				takeDeliveryApply: {}
			},
			operationHistory: [],
			// 是否指定规格
			appointSpec: 1,

			// 提货的列表
			purchaseDetailList: [],
			// 全业务线列表
			businessLineFullNoList: [],
			// 业务线号
			businessLineFullNo: '',
			// 合同可提数量
			availableQuantity: 0,
			// 可提件数
			availablePieceQuantity: 0
		};
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_TOKEN: 'VUEX_ST_TOKEN'
		}),
		// issueMode
		// 判断是否是不是废钢 并且未指定规格
		isSpecial() {
			return this.contractDetails.steelType != 'SCRAP_STEEL' && this.appointSpec == 0;
		},
		// 货转GOODS_TRANSFER 合同 CONTRACT
		issueMode() {
			return this.contractDetails.issueMode;
		},
		/** 判断业务类型 */
		businessType() {
			// ○ 代采+仓押业务，本次新增，按上游货转进行提货
			// ○ 仓押业务，原仓押业务按销售合同提货修改为按上游货转进行提货（同代采+仓押）
			// 代采业务
			// 上游货转 改成 业务线

			let businessType =
				this.$route.query.type == 'preview' ? this.detailInfo.originalBusinessType : this.contractDetails.businessType;

			if (['SOURCING_AGENT_WAREHOUSE_PLEDGE', 'WAREHOUSE_RECEIPTS_PLEDGE'].includes(businessType)) {
				// 判断 上游是否是 联营
				if (this.issueMode == 'CONTRACT') {
					return 3;
				}
				return 1;
			}

			if (['SOURCING_AGENT'].includes(businessType)) {
				return 3;
			}

			// 和全业务线的其他
			return 2;
		},
		// 判断合同清单 和 货转清单的columns
		billColumns() {
			if (this.businessType == 1 && this.appointSpec == 1) {
				return transferColumns;
			}
			if (this.businessType == 1 && this.appointSpec == 0) {
				return noAppointTransferColumns;
			}
			if (this.businessType == 3 && this.appointSpec == 0) {
				return noAppointColumns;
			}
			return columns;
		},
		uploadQuerydata() {
			return {
				contractId: this.contractDetails.contractId,
				appleTakeSerialNo: this.$route.query.serialNo || null,
				appointSpec: this.appointSpec,
				businessLineFullNo: this.businessLineFullNo
			};
		},
		headers() {
			return {
				Authorization: this.VUEX_ST_TOKEN,
				Source: 'PC',
				appointSpec: this.appointSpec
			};
		},
		rowSelection() {
			const { selectedRowKeys } = this;
			const obj = {
				selectedRowKeys,
				onChange: this.onSelectChange,
				hideDefaultSelections: true,
				onSelectAll: this.onSelectAll,
				onSelectInvert: this.onSelectInvert,
				type: 'checkbox',
				selections: [],
				onSelect: this.onSelection
			};
			if (this.appointSpec == 0) {
				return null;
			}
			return {
				...obj,
				getCheckboxProps: record => ({
					// 可提数量 或者 不指定规格
					props: {
						disabled: this.disabledAll
					}
				})
			};
		},
		disabledConstractInput() {
			return this.contractDetails.contractNo ? true : false;
		},
		disabledAll() {
			return this.$route.query?.type === 'preview';
		},
		editAll() {
			return this.$route.query?.type === 'edit';
		},
		// 合计行计算
		computedLastRow() {
			// currentApplyPieceQuantity

			const list = this.appointSpec == 1 ? this.dataList : this.$refs && this.$refs.purchaseDetails.save();

			const currentApplyPieceQuantityTotal = list.reduce((prv, cur) => {
				if (cur.currentApplyPieceQuantity == '/') {
					return prv;
				}
				return prv + (Number(cur.currentApplyPieceQuantity) || 0);
			}, 0);
			const flag = list.slice(0, list.length - 1).every(el => el.currentApplyPieceQuantity == '/');
			let currentApplyQuantityTotal = 0;
			list.forEach(item => {
				currentApplyQuantityTotal += Number(item.currentApplyQuantity) || 0;
			});
			return {
				currentApplyPieceQuantityTotal: flag ? '/' : Math.round(currentApplyPieceQuantityTotal * 1000) / 1000,
				currentApplyQuantityTotal: parseFloat(Number(currentApplyQuantityTotal).toFixed(4))
			};
		},
		contarctDetailsComputed() {
			const total = {};
			if (this.$route.query.type == 'preview') {
				total.canTakePieceQuantity = this.dataList.slice(1, this.dataList.length - 1).reduce((pre, cur) => {
					return pre + cur.canTakePieceQuantity;
				}, 0);
				total.canTakeQuantity = this.dataList.slice(1, this.dataList.length - 1).reduce((pre, cur) => {
					return pre + cur.canTakeQuantity;
				}, 0);
			}
			return total;
		}
	},
	watch: {
		id: {
			async handler(newValue) {
				if (newValue) {
					await this.getBusinessLine('', newValue);
					this.getConstractDetails(newValue, []);
				}
			},
			immediate: true
		}
	},
	mounted() {
		this.getDetailsById();
	},
	methods: {
		formateInputQuantity(e, item) {
			let index = null;
			for (let i = 0; i < this.dataList.length; i++) {
				if (this.dataList[i].id == item.id) {
					index = i;
					break;
				}
			}
			item.currentApplyQuantity = e.target.value ? e.target.value : 0.0001;
			let cloneItem = cloneDeep(item);
			cloneItem.currentApplyQuantity = parseFloat(Number(item.currentApplyQuantity).toFixed(4));
			this.$set(this.dataList, index, cloneItem);
		},
		computedAvailable(record, key) {
			let arr = [];
			if (this.businessType == 1) {
			}
			arr = this.data.filter(t => t.purchaseId == record.purchaseId);
			const item = arr[0] || {};
			return item[key];
		},
		// 检测变量
		checkVariable(item, key, type) {
			if (key == 'currentApplyPieceQuantity') {
				let reg = /^[0-9]*[1-9][0-9]*$/;
				const tip = type == 'number' ? '预提件数请输入大于等于1的正整数' : '预提件数请输入/或者大于等于1的正整数';
				if (item.currentApplyPieceQuantity !== '/' && !reg.test(item.currentApplyPieceQuantity)) {
					item.currentApplyPieceQuantity = '';
					this.$message.error(tip);
					return;
				}
				if (item.currentApplyPieceQuantity !== '/' && item.currentApplyPieceQuantity < 1) {
					item.currentApplyPieceQuantity = '';
					this.$message.error(tip);
					return;
				}
			}
		},
		handleChangeGoods(fileObj) {
			if (fileObj) {
				const { file } = fileObj;
				if (file?.response?.success) {
					this.$message.success('导入成功');
					let tempList = [];
					if (this.appointSpec == 1) {
						tempList = file.response.data.concat(this.dataList.pop());
					} else {
						tempList = file.response.data;
					}
					tempList.slice(0, tempList.length - 1).forEach((item, index) => {
						item.index = index;
						item.id = index;
						item.purchaseId = Number(item.purchaseId);
						item.presetUnitPrice = item.includingTaxMount;
						// 为级联准备
						item.mainId = `${item.materialName}_${item.specs}_${item.materialTexture}_${item.placeOfOrigin}`;
						if (this.handleType(item) == 1) {
							item.currentApplyPieceQuantity =
								item.currentApplyPieceQuantity == '/' ? '' : parseInt(item.currentApplyPieceQuantity);
						} else {
							item.currentApplyPieceQuantity =
								item.currentApplyPieceQuantity == '/' ? '/' : parseInt(item.currentApplyPieceQuantity);
						}
						item.currentApplyQuantity =
							item.currentApplyQuantity == '/' ? '/' : Math.round(item.currentApplyQuantity * 1000) / 1000;
					});
					if (this.appointSpec == 1) {
						this.dataList = tempList;
					} else {
						this.purchaseDetailList = tempList;
					}
				}
				if (file?.response?.error) {
					this.$message.error(`导入失败:${file.response.error.message}`);
				}
			}
		},
		handleApplyChange({ file }) {
			const { response } = file;
			if (response && response?.success) {
				this.$message.success('导入成功');
				response.data.forEach((item, index) => {
					const currentIndex = ++index;
					item.id = currentIndex;
					item.index = currentIndex;
				});
				this.dataCar = response.data;
			}
			if (response && response.error) {
				this.$message.error(`导入失败:${response.error.message}`);
			}
		},
		templateDownloadApplyMethod() {
			window.location.href = this.publicPath + 'files/提货申请车船号导入模板.xlsx';
		},
		templateDownloadMethod() {
			this.templateDownloadBtn = true;
			templateDownload({
				contractId: this.contractDetails.contractId,
				applyId: this.$route.query.id,
				businessLineFullNo: this.businessLineFullNo
			})
				.then(res => {
					comDownload(res, null, '提货申请列表导入模板.xls');
				})
				.finally(() => {
					this.templateDownloadBtn = false;
				});
		},
		onClickRow(record) {
			return {
				on: {
					click: () => {
						if (this.selectedRowKeys.includes(record.purchaseId)) {
							for (let i = 0; i < this.selectedRowKeys.length; i++) {
								if (this.selectedRowKeys[i] == record.purchaseId) {
									this.selectedRowKeys.splice(i, 1);
								}
							}
						} else {
							this.selectedRowKeys = [record.purchaseId];
						}
					}
				}
			};
		},
		disabledDate(current) {
			return current < moment().add(-1, 'd').endOf('day') || current > moment().add(3, 'd').endOf('day');
		},
		/**
		 * @function 计算提货数量
		 * @param 当前品类清单详情
		 * @return 当前可提货数量的最大值
		 */
		computedApplyQuantity(record) {
			const temp = record.currentApplyPieceQuantity * record.theoreticalWeight;
			return temp > record.currentApplyQuantity ? record.currentApplyQuantity : temp;
		},
		setListCheckedStatus(list = []) {
			let ids = list.map(item => Number(item.purchaseId));
			if (this.businessType == 1) {
				ids = list.map(item => item.mainId);
			}
			this.selectedRowKeys = ids;
		},
		/**
		 * @function 根据流水id获取提货单详情
		 * @param
		 */
		getDetailsById() {
			const id = this.$route.query.serialNo;
			if (!id) {
				return;
			}
			getShowTakeDeliveryInfo({
				serialNo: id,
				takeSerialNo: ''
			}).then(async res => {
				if (res.success) {
					this.dataList.push({
						id: '合计',
						index: '合计',
						materialName: '合计',
						currentApplyPieceQuantity: 0,
						currentApplyQuantity: 0
					});
					if (res.data.takeDeliveryModelList?.length) {
						res.data.takeDeliveryModelList.forEach((item, index) => {
							item.index = ++index;
						});
						this.dataCar = res.data.takeDeliveryModelList;
					}
					if (this.formType) {
						this.formType.setFieldsValue({
							takeType: res.data.takeType,
							expectTakeDate: moment(res.data.expectTakeDate)
						});
						if (res.data.takeType === 'CARSHIPNO') {
							this.showCardInfo = true;
						}
					}
					this.operationHistory = res.data.operationHistory || [];
					this.detailInfo = res.data;
					this.businessLineFullNo = res.data.takeDeliveryApply.businessLineFullNo || '';

					/*** 获取全业务线列表 */
					await this.getBusinessLine('', res.data.takeDeliveryApply.contractId);
					this.getConstractDetails(res.data.takeDeliveryApply.contractId, res.data.takeDeliveryPurchaseRelList);
				}
			});
		},
		handleFormTakeTypeChange(value) {
			if (value === 'CARSHIPNO') {
				this.showCardInfo = true;
			} else {
				this.showCardInfo = false;
			}
		},
		checkCarNumberOrCarIdIsNull() {
			let flag = false;
			for (let i = 0; i < this.dataCar.length; i++) {
				if (!this.dataCar[i].carNumber && !this.dataCar[i].carId) {
					flag = true;
					break;
				}
			}
			return flag;
		},
		/**
		 * @function 提交or保存
		 * @param {Number} 1:保存 2:提交
		 */
		submitData(type) {
			const { contractNo, steelType, appointSpec, sellCompanyUscc, sellCompanyName, buyCompanyUscc, buyCompanyName } =
				this.contractDetails;
			const carInfo = this.formType.getFieldsValue();
			carInfo.expectTakeDate = moment(carInfo.expectTakeDate).format('YYYY-MM-DD');

			// 数量
			let quantityTotal = 0;
			let takeDeliveryDetailList =
				this.appointSpec == 0 ? cloneDeep(this.$refs.purchaseDetails.save()) : this.filterGoodsList(this.dataList);
			// 件数
			const pieceQuantityTotal = takeDeliveryDetailList.reduce((prv, cur) => {
				if (cur.currentApplyPieceQuantity == '/') {
					return prv;
				}
				return prv + (Number(cur.currentApplyPieceQuantity) || 0);
			}, 0);
			const flag = takeDeliveryDetailList.some((item, i, arr) => {
				if (item.currentApplyPieceQuantity === undefined || item.currentApplyPieceQuantity === '') {
					return true;
				}

				if (item.currentApplyQuantity === undefined || item.currentApplyQuantity === '') {
					return true;
				}

				quantityTotal += Number(item.currentApplyQuantity) || 0;
			});
			if (flag) {
				this.$message.error('请完成当前提货列表必填项');
				return;
			}
			// 转换数据
			if (this.appointSpec == 0) {
				takeDeliveryDetailList.forEach(el => {
					el.currentApplyPieceQuantity = el.currentApplyPieceQuantity == '/' ? null : el.currentApplyPieceQuantity;
					el.currentApplyQuantity = el.currentApplyQuantity == '/' ? null : el.currentApplyQuantity;
					el.theoreticalWeight = el.theoreticalWeight == '/' ? null : el.theoreticalWeight;
				});
			}

			this.disabledSubmit = true;
			goodsApplySaveOrSubmit({
				id: this.$route.query.id || null,
				serialNo: this.$route.query.serialNo || null,
				saveOrSubmit: type,
				sellCompanyUscc,
				sellCompanyName,
				buyCompanyUscc,
				buyCompanyName,
				contractNo,
				steelType,
				purchaseId: this.appointSpec == 1 ? this.selectedRowKeys : [],
				businessLineFullNo: this.businessLineFullNo,
				appointSpec: this.businessType == 2 ? appointSpec : this.appointSpec,
				...carInfo,
				pieceQuantityTotal: Math.round(pieceQuantityTotal * 1000) / 1000,
				quantityTotal: Math.round(quantityTotal * 10000) / 10000,
				takeDeliveryDetailList,
				takeDeliveryModelList: carInfo.takeType == 'DIRECT_TRANSFER' ? null : this.filterCarList(this.dataCar)
			})
				.then(res => {
					if (res.success) {
						this.$message.success({
							content: this.messageList[type],
							onClose: () => {
								this.next();
							}
						});
					}
				})
				.finally(() => {
					this.disabledSubmit = false;
				});
		},
		/**
		 * @function 提货车辆录入信息如果有字段为空修改为null，方便服务端计算
		 * @param {Array} 车船号列表
		 * @param {Array} 车船号列表
		 */
		filterCarList(list) {
			let tempList = cloneDeep(list);
			tempList.forEach(item => {
				item.carNumber ? item.carNumber : (item.carNumber = null);
				item.carName ? item.carName : (item.carName = null);
				item.carTel ? item.carTel : (item.carTel = null);
				item.carId ? item.carId : (item.carId = null);
			});
			return tempList;
		},
		/**
		 * @function 去除货物清单中的id&&index
		 * @param {Array} 货物清单列表
		 * @return {Array} 货物清单列表
		 */
		filterGoodsList(list) {
			let tempList = cloneDeep(list);
			tempList.forEach(item => {
				if (!this.$route.query.type) {
					item.id && delete item.id;
					item.index && delete item.index;
				}
				item.theoreticalWeight = item.theoreticalWeight == '/' ? null : item.theoreticalWeight;
				item.currentApplyPieceQuantity = item.currentApplyPieceQuantity == '/' ? null : item.currentApplyPieceQuantity;
				item.availablePieceQuantity = item.availablePieceQuantity == '/' ? null : item.availablePieceQuantity;
			});
			return tempList.slice(0, tempList.length - 1);
		},
		// 检测捆包号是否重复
		checkBaleNoIsRepeat() {
			let baleNos = this.dataList.map(item => item.baleNo).sort();
			let flag = false;
			for (var i = 0; i < baleNos.length - 1; i++) {
				if (baleNos[i] == baleNos[i + 1]) {
					flag = true;
					break;
				}
			}
			if (flag) {
				this.$message.warning('捆包号不能重复');
			}
		},
		// 验证提货清单中计量方式是否有空
		checkMetrologyWayHasNull() {
			let flag = false;
			const tempList = this.dataList.slice(0, this.dataList.length - 1);
			for (let i = 0; i < tempList.length; i++) {
				if (!tempList[i].metrologyWay) {
					flag = true;
					break;
				}
			}
			return flag;
		},
		/**
		 * @function 提交验证
		 */
		save(type) {
			if (this.selectedRowKeys.length <= 0 && this.businessType == 2) {
				this.$message.warning('请勾选合同清单');
				return;
			}
			if (this.selectedRowKeys.length <= 0 && this.businessType == 1 && this.appointSpec == 1) {
				this.$message.warning('请勾选货物清单');
				return;
			}
			if (this.checkMetrologyWayHasNull()) {
				this.$message.warning('计量方式不能为空');
				return;
			}
			this.formType.validateFields((err, values) => {
				if (!err) {
					if (values.takeType == 'CARSHIPNO' && this.checkCarNumberOrCarIdIsNull()) {
						this.$message.warning('车船号和身份证号至少有一个必须填写');
					} else {
						if (type == 2 && this.contractDetails.appointSpec == 0) {
							this.$confirm({
								title: '提货申请确认',
								content: `您确定预提${this.computedLastRow.currentApplyQuantityTotal}数量的货物么？`,
								cancelText: '取消',
								okText: '确定',
								onCancel: () => {
									return;
								},
								onOk: () => {
									this.submitData(type);
								}
							});
						} else {
							this.submitData(type);
						}
					}
				}
			});
		},
		/**
		 * @function 获取合同详情
		 * @param id {Number} 合同id
		 * @param list {合同清单}
		 * @return void
		 */
		async getConstractDetails(id, list = [], flag) {
			const params = {
				contractId: id,
				isModify: this.$route.query.type == 'preview' ? 0 : 1,
				applyId: this.$route.query.id,
				appointSpec: this.appointSpec,
				businessLineFullNo: this.businessLineFullNo || ''
			};
			const res = await getConstractDetailsById(params);
			const {
				contractNo,
				sellCompanyName,
				steelTypeDesc,
				effectiveStartDate,
				effectiveEndDate,
				deliveryModeDesc,
				appointSpecDesc,
				deliveryPlace
			} = res.data;
			this.form.setFieldsValue({
				contractNo,
				sellCompanyName,
				steelType: steelTypeDesc,
				effectiveStartDate: `${effectiveStartDate}-${effectiveEndDate}`,
				deliveryPlace: deliveryPlace,
				deliveryMode: deliveryModeDesc,
				appointSpecDesc: appointSpecDesc
			});
			// 合同或者 或者清单
			// issueMode
			// 货转GOODS_TRANSFER 合同 CONTRACT
			const purchaseList = res.data.issueMode == 'GOODS_TRANSFER' ? res.data.goodsTransferList : res.data.purchaseList;

			purchaseList.forEach(el => {
				// 捆包号
				el.baleNoDisabled = el.baleNo && el.baleNo != '/';
				// 理重
				el.theoreticalWeight = !el.theoreticalWeight ? '/' : el.theoreticalWeight;
				el.availablePieceQuantity =
					!el.availablePieceQuantity && el.availablePieceQuantity !== 0 ? '/' : el.availablePieceQuantity;
				el.currentApplyPieceQuantity =
					el.currentApplyPieceQuantity === null || el.currentApplyPieceQuantity === undefined
						? '/'
						: el.currentApplyPieceQuantity;
			});

			list.forEach(el => {
				const item = purchaseList.find(el2 => el2.purchaseId == el.purchaseId) || {};
				// 可提件数  主要是为了判断用
				el.mainId = `${el.materialName}_${el.specs}_${el.materialTexture}_${el.placeOfOrigin}__${el.baleNo}`;
				el.availablePieceQuantity = item.availablePieceQuantity || 0;
				el.theoreticalWeight = !el.theoreticalWeight ? '/' : el.theoreticalWeight;
				// 预提件数
				el.currentApplyPieceQuantity =
					el.currentApplyPieceQuantity === null || el.currentApplyPieceQuantity === undefined
						? '/'
						: el.currentApplyPieceQuantity;
			});

			this.setApplyGoodsListOfDetails(list, purchaseList);
			if (this.$route.query.type != 'preview') {
				this.setContractPieceAndQuantity(list, res);
			}
			this.data = purchaseList; //合同清单
			// 未指定规格
			this.purchaseDetailList = list;

			this.contractDetails = res.data;
			// 可提数量
			this.availableQuantity = res.data.availableQuantity;
			// 可提件数
			this.availablePieceQuantity = res.data.availablePieceQuantity || '/';

			// 判断 是走货转还是走合同

			/** 获取货转信息 代采+ 仓押  代采 仓押业务需要读取货转信息 */
			// 获取不到业务线
			// if( !this.businessLineFullNo) return
			// if(this.businessType == 1 &&( this.detailInfo.fromGoodsTransfer || flag)) {
			//   const transferDes = await getGoodsTransferDetail({...params, businessLineFullNo: this.businessLineFullNo})
			//   transferDes.data.goodsTransferList.forEach(el => {
			//      el.mainId =`${el.materialName}_${el.specs}_${el.materialTexture}_${el.placeOfOrigin}__${el.baleNo}`
			//     // 捆包号
			//     el.baleNoDisabled = el.baleNo && el.baleNo != '/'
			//     // 理重
			//     el.theoreticalWeight =  !el.theoreticalWeight ? '/' : el.theoreticalWeight
			//     el.availablePieceQuantity = (!el.availablePieceQuantity && el.availablePieceQuantity !== 0 ) ? '/' :  el.availablePieceQuantity
			//     /** 可提数量 赋值 预提数量  */
			//     el.currentApplyQuantity =  el.availableQuantity && el.availableQuantity !== '/' ? el.availableQuantity : ''
			//   })
			//   this.data = transferDes.data.goodsTransferList
			//   // 不指定规格的显示
			//   // 可提数量
			//   this.availableQuantity = transferDes.data.availableQuantity
			//   // 可提件数
			//   this.availablePieceQuantity = transferDes.data.availablePieceQuantity || '/'

			// }
			// 不能是主动切换
			if ([1, 3].includes(this.businessType) && !flag) {
				this.appointSpec =
					this.detailInfo.takeDeliveryApply.appointSpec || this.detailInfo.takeDeliveryApply.appointSpec === 0
						? this.detailInfo.takeDeliveryApply.appointSpec
						: 1;
			}
			this.$forceUpdate();
			this.setListCheckedStatus(list); //设置合同中的勾选项
		},
		/**
		 * @function setContractPieceAndQuantity
		 * 设置合同中的可提件数和可提数量
		 * 在非查看详情页面(编辑/新建),获取详情时,页面上显示的可提件数和数量=合同中的+当前申请的
		 * @param {Array} list 详情中的货物清单
		 * @param {Object} res 合同中详情
		 */
		setContractPieceAndQuantity(list, res) {
			// 循环计算详情中的货物清单每个品类对应的件数和数量总和
			let tempArrList = list.reduce((total, cur, index) => {
				let hasValue = total.findIndex(item => item.purchaseId == cur.purchaseId);
				hasValue == -1 && total.push(cur);
				if (hasValue != -1) {
					const upCurrentApplyPieceQuantity =
						total[hasValue].currentApplyPieceQuantity == '/' ? 0 : total[hasValue].currentApplyPieceQuantity;
					const currentApplyPieceQuantity = cur.currentApplyPieceQuantity == '/' ? 0 : cur.currentApplyPieceQuantity;
					total[hasValue].currentApplyPieceQuantity = upCurrentApplyPieceQuantity + currentApplyPieceQuantity;
					total[hasValue].currentApplyQuantity = total[hasValue].currentApplyQuantity + cur.currentApplyQuantity;
				}
				return total;
			}, []);
		},
		/**
		 * @function setApplyGoodsListOfDetails
		 * 根据获取到的提货详情设置申请提货列表数据
		 */
		setApplyGoodsListOfDetails(list, purchaseList) {
			// 从合同中找当前
			for (let i = 0; i < list.length; i++) {
				const record = list[i];
				// 如果满足条件 可提数量 是可以编辑的 所以需要置成 ''
				if (
					record.currentApplyPieceQuantity == '/' &&
					(this.handleType(record) == 1 || typeof record.availablePieceQuantity == 'number')
				) {
					if (this.$route.query.type == 'edit') {
						record.currentApplyPieceQuantity = '';
					}
				}
				for (let j = 0; j < purchaseList.length; j++) {
					if (list[i].purchaseId == purchaseList[j].purchaseId) {
						list[i].modifiable = purchaseList[j].modifiable;
						list[i].index = i;
					}
				}
			}

			this.dataList = cloneDeep(list); //提货e清单
			this.dataList.push({
				id: '合计',
				index: '合计',
				materialName: '合计',
				availablePieceQuantity: 0,
				currentApplyPieceQuantity: 0,
				currentApplyQuantity: 0,
				availableQuantity: 0
			});
		},
		/**
		 * @function exportDetailsList
		 * 合同清单货物列表导出
		 */
		exportDetailsList(type) {
			this.disabledExport = true;
			exportContractPurchase({
				contractId: this.contractDetails.contractId,
				applyId: this.$route.query.id,
				isModify: this.$route.query.type == 'preview' ? 0 : 1,
				purchaseIdList: this.selectedRowKeys.join(','),
				appointSpec: this.appointSpec,
				businessLineFullNo: this.businessLineFullNo
			})
				.then(res => {
					let fileName = moment(new Date()).format('YYYYMMDD') + '提货申请合同清单导出.xls';
					if (type == 2) {
						fileName = moment(new Date()).format('YYYYMMDD') + '货转信息导出.xls';
					}

					comDownload(res, null, fileName);
				})
				.finally(() => {
					this.disabledExport = false;
				});
		},
		/**
		 * @function exportGoodsPurchase
		 * 货物清单导出
		 */
		exportGoodsPurchase() {
			this.disabledExport = true;
			exportGoodsPurchase({
				contractId: this.contractDetails.contractId,
				isModify: this.$route.query.type == 'preview' ? 0 : 1,
				applyId: this.$route.query.id,
				appointSpec: this.appointSpec,
				businessLineFullNo: this.businessLineFullNo
			})
				.then(res => {
					const fileName = moment(new Date()).format('YYYYMMDD') + '货转信息导出.xls';
					comDownload(res, null, fileName);
				})
				.finally(() => {
					this.disabledExport = false;
				});
		},
		/**
		 * @function handleChange
		 * 本地导入提货列表
		 * */
		handleChange(info) {},
		/**
		 * @function addCar
		 * 车辆信息录入方式增加
		 */
		addCar() {
			let length = this.dataCar.length;
			let currentIndex = ++length;
			this.dataCar.push({
				id: currentIndex,
				index: currentIndex,
				carNumber: '',
				carName: '',
				carTel: '',
				carId: ''
			});
		},
		/**
		 * @function minusCar
		 * 车辆信息录入方式减少
		 */
		minusCar(item) {
			this.dataCar.splice(--item.index, 1);
		},
		/**
		 * @function add
		 * 无指定规格申请提货列表可以增加行
		 */
		add(item) {
			const index = this.dataList.findIndex(d => d.id == item.id);
			if (index >= 0) {
				let cloneItem = cloneDeep(this.dataList[index]);
				cloneItem.index = nanoid(4);
				cloneItem.id = nanoid(4);
				this.dataList.splice(index, 0, cloneItem);
			}
		},
		/**
		 * @function minus
		 * 无指定规格申请提货列表减少行
		 * */
		minus(item) {
			const index = this.dataList.findIndex(d => d.id == item.id);
			if (index >= 0) {
				this.dataList.splice(index, 1);
				this.checkDataListForData();
			}
		},
		/**
		 * @description: 提货申请列表数据减少，动态修改合同清单勾选状态
		 * @return {*}
		 */
		checkDataListForData() {
			const ids = [];
			this.dataList.forEach(item => {
				if (!ids.includes(item.purchaseId || item.mainId)) {
					ids.push(item.purchaseId);
				}
			});
			this.selectedRowKeys = ids;
		},
		/**
		 * @function prev
		 * 返回上一步
		 */
		prev() {
			if (this.$route.query?.type) {
				this.$router.back();
			} else {
				this.selectedRowKeys = [];
				this.dataList = [];
				this.formType.resetFields();
				this.dataCar = [];
				this.showCardInfo = false;
				this.$emit('prev', 0);
			}
		},
		/**
		 * @function next
		 * 点击提交/保存
		 */
		next() {
			if (this.$route.query?.type) {
				this.$router.back();
			} else {
				this.$emit('next', {
					view: 2,
					id: ''
				});
			}
		},
		/**
		 * @function onSelection
		 * 合同清单行单个选中/取消选择
		 */
		onSelection(record, selected) {
			if (selected) {
				let cloneItem = cloneDeep(record);
				cloneItem.index = nanoid(4);
				cloneItem.id = nanoid(4);
				cloneItem.currentApplyPieceQuantity =
					record.availablePieceQuantity == '/' || record.availablePieceQuantity === 0 ? '' : record.availablePieceQuantity;
				cloneItem.availablePieceQuantity = record.availablePieceQuantity;
				cloneItem.currentApplyQuantity = record.availableQuantity;
				cloneItem.availableQuantity = record.availableQuantity;
				if (this.handleType(cloneItem) != 1) {
					cloneItem.currentApplyQuantity = '';
				}
				this.dataList.splice(this.dataList.length - 1, 0, cloneItem);
			} else {
				if (this.businessType == 1 && this.appointSpec == 1) {
					this.dataList.forEach((item, index) => {
						if (item.mainId == record.mainId) {
							this.dataList.splice(index, 1);
						}
					});
				} else {
					this.dataList.forEach((item, index) => {
						if (item.purchaseId == record.purchaseId) {
							this.dataList.splice(index, 1);
						}
					});
				}
			}
		},
		/**
		 * @function onSelectChange
		 * 合同清单选中行发生改变
		 */
		onSelectChange(selectedRowKeys) {
			this.selectedRowKeys = selectedRowKeys;
			if (!this.dataList.length || this.dataList[this.dataList.length - 1]?.id != '合计') {
				this.dataList.push({
					id: '合计',
					index: '合计',
					materialName: '合计',
					availablePieceQuantity: 0,
					currentApplyPieceQuantity: 0,
					currentApplyQuantity: 0,
					availableQuantity: 0
				});
			}
		},
		/**
		 * @function onSelectAll
		 * 合同清单点击全选/全不选
		 */
		onSelectAll(selected, selectedRows) {
			const dataListIds = this.dataList.map(item => item.mainId || item.purchaseId || item.id);
			if (selected) {
				selectedRows.forEach((item, index) => {
					if (!dataListIds.includes(item.purchaseId || item.mainId)) {
						let cloneItem = cloneDeep(item);
						cloneItem.index = nanoid(4);
						cloneItem.id = nanoid(4);
						if (this.handleType(item) == 1) {
							cloneItem.currentApplyQuantity = item.availableQuantity;
							cloneItem.currentApplyPieceQuantity =
								item.availablePieceQuantity == '/' || item.availablePieceQuantity === 0 ? '' : item.availablePieceQuantity;
						} else {
							cloneItem.currentApplyPieceQuantity = item.availablePieceQuantity === 0 ? '' : item.availablePieceQuantity;
							cloneItem.currentApplyQuantity = '';
						}
						cloneItem.availablePieceQuantity = item.availablePieceQuantity;

						cloneItem.availableQuantity = item.availableQuantity;
						this.dataList.splice(this.dataList.length - 1, 0, cloneItem);
					}
				});
			} else {
				this.dataList = [];
			}
		},
		onSelectInvert(selectedRows) {},
		// 是否指定规格
		async changeAppointSpec() {
			const params = {
				contractId: this.contractDetails.contractId,
				isModify: this.$route.query.type == 'preview' ? 0 : 1,
				applyId: this.$route.query.id,
				appointSpec: this.appointSpec,
				businessLineFullNo: this.businessLineFullNo
			};
			this.purchaseDetailList = [];

			this.getConstractDetails(this.contractDetails.contractId, this.detailInfo.takeDeliveryPurchaseRelList || [], true);

			// this.detailInfo
			// 获取不到业务线
			// if(!this.businessLineFullNo) return
			// const transferDes = await getGoodsTransferDetail(params)
			// transferDes.data.goodsTransferList.forEach(el => {
			//   el.mainId =`${el.materialName}_${el.specs}_${el.materialTexture}_${el.placeOfOrigin}__${el.baleNo}`
			//   // 捆包号
			//   el.baleNoDisabled = el.baleNo && el.baleNo != '/'
			//   // 理重
			//   el.theoreticalWeight =  !el.theoreticalWeight ? '/' : el.theoreticalWeight
			//   // 件数
			//   el.availablePieceQuantity = (!el.availablePieceQuantity && el.availablePieceQuantity !== 0 ) ? '/' :  el.availablePieceQuantity
			//   /** 可提数量 赋值 预提数量  */
			//   el.currentApplyQuantity =  el.availableQuantity
			// })
			// this.data = transferDes.data.goodsTransferList
			// // 不指定规格的显示
			// this.availableQuantity = transferDes.data.availableQuantity
			// this.availablePieceQuantity = transferDes.data.availablePieceQuantity || '/'
		},
		// 判断是否钢材种类 和指定规格
		handleType(item) {
			// 建材 螺纹钢 指定规格
			if (
				this.contractDetails.appointSpec == 1 &&
				item.materialName == '螺纹钢' &&
				this.contractDetails.steelType.split(',').includes('FINISHED_STEEL')
			) {
				return 1;
			}
			// 建材 螺纹钢 不指定规格
			if (
				this.contractDetails.appointSpec == 0 &&
				item.materialName == '螺纹钢' &&
				this.contractDetails.steelType.split(',').includes('FINISHED_STEEL')
			) {
				return 2;
			}
			return 3;
		},
		// 获取业务线列表
		async getBusinessLine(contractNo, contractId = '') {
			const params = {
				applyId: this.$route.query.id || null,
				contractNo: contractNo || this.$route.query.contractNo,
				contractId,
				isModify: this.$route.query.type == 'preview' ? 0 : 1
			};
			const res = await API_GetCompanyBusinessLineList(params);

			this.businessLineFullNoList = res.data;
			/*** 新增的时候 赋值 */
			if (!this.$route.query.type) {
				this.businessLineFullNo = res.data[0]?.relationNo || '';
			}
		}
	},
	components: {
		Pagination,
		Log,
		PurchaseDetails
	}
};
</script>

<style lang="less" scoped>
.footer-btn-wrap {
	width: 100%;
	height: 60px;
	display: flex;
	flex-direction: row;
	justify-content: space-around;
	align-items: center;
}
.title-wrap {
	width: 100%;
	height: 30px;
	display: flex;
	flex-direction: row;
	font-weight: bold;
}
.contract-title {
	width: 100%;
	height: 60px;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	font-weight: bold;
}
.contract-table-wrap {
	::v-deep .ant-table-thead tr:first-child th:first-child {
		padding-left: 0;
	}
}
.table-required {
	color: #f5222d;
}
.card-info::before {
	display: inline-block;
	margin-right: 4px;
	color: #f5222d;
	font-size: 14px;
	font-family: SimSun, sans-serif;
	line-height: 1;
	content: '*';
}
.download-a {
	color: rgba(0, 0, 0, 0.65);
	margin-left: 8px;
}
</style>
