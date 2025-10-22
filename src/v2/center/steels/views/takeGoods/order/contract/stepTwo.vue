<template>
	<div>
		<p class="title-wrap">合同基本信息</p>
		<a-form
			:form="form"
			:label-col="{ span: labelCol }"
			:wrapper-col="{ span: 15 }"
			labelAlign="left"
			class="ant-advanced-search-form"
		>
			<a-row :gutter="24">
				<a-col :span="8">
					<a-form-item label="合同编号">
						<a-input
							v-decorator="['contractNo']"
							:disabled="disabledForm || disabledAll"
						/>
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-form-item label="买方名称">
						<a-input
							v-decorator="['buyCompanyName']"
							:disabled="disabledForm || disabledAll"
						/>
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-form-item label="钢材种类">
						<a-input
							v-decorator="['steelTypeDesc']"
							:disabled="disabledForm || disabledAll"
						/>
					</a-form-item>
				</a-col>
			</a-row>
			<a-row :gutter="24">
				<a-col :span="8">
					<a-form-item label="交提货地点">
						<a-input
							v-decorator="['deliveryPlace']"
							:disabled="disabledForm || disabledAll"
						/>
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-form-item label="合同期限">
						<a-input
							v-decorator="['effectiveStartDate']"
							:disabled="disabledForm || disabledAll"
						/>
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-form-item label="交提货方式">
						<a-input
							v-decorator="['deliveryModeDesc']"
							:disabled="disabledForm || disabledAll"
						/>
					</a-form-item>
				</a-col>
				<!-- <a-col :span="8" >
          <a-form-item label="选择的提货方式">
            <a-input v-decorator="['appointSpecDesc']" :disabled="disabledForm || disabledAll" />
          </a-form-item>
        </a-col> -->
				<a-col
					:span="8"
					v-show="appointSpec != 1"
				>
					<a-form-item label="合同可提件数">
						<a-input
							v-decorator="['availablePieceQuantity']"
							:disabled="true"
						/>
					</a-form-item>
				</a-col>
				<a-col
					:span="8"
					v-show="appointSpec != 1"
				>
					<a-form-item label="合同可提数量">
						<a-input
							v-decorator="['availableQuantity']"
							:disabled="true"
						/>
					</a-form-item>
				</a-col>
				<a-col
					:span="8"
					@change="changeAppointSpec"
				>
					<a-form-item
						label="选择提货方式"
						style="display: flex; align-items: center; height: 40px"
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
				<a-col
					:span="8"
					v-if="businessLineFullNoList.length > 1"
				>
					<a-form-item label="选择业务线">
						<a-select
							@change="changeBusinessLine"
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
			</a-row>
		</a-form>
		<!-- 区分合同 厂提 -->
		<!-- FACTORY_MENTION -->
		<!-- 合同货物明细和申请提货清单，合同货物明细展示上游联营合同中的货物明细 -->
		<div>
			<!-- 同货物明细 -->
			<FactoryBill
				ref="factoryBill"
				:businessLineFullNo="businessLineFullNo"
				:appointSpec="appointSpec"
				:list="purchaseList"
				:uploadIds="[]"
				:contractDetails="contractDetails"
				:upDeliveryMode="contractDetails.upDeliveryMode"
				@sendWarehouse="sendWarehouse"
				:realTakeStatusNo="realTakeStatusNo"
			>
			</FactoryBill>
		</div>
		<p class="contract-title">
			<span>提单基本信息</span>
		</p>
		<a-form
			:form="formType"
			:label-col="{ span: labelCol }"
			:wrapper-col="{ span: 15 }"
			labelAlign="left"
			class="ant-advanced-apply-form"
		>
			<a-row :gutter="24">
				<a-col :span="8">
					<a-form-item label="提货方式(生成提单)">
						<a-input
							v-decorator="[
								'takeType',
								{
									rules: [{ required: true, message: '请选择提货方式!' }]
								}
							]"
							placeholder="请选择提货方式"
							:disabled="disabledAll"
						/>
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-form-item label="提单有效期">
						<a-range-picker
							style="width: 100%"
							v-decorator="[
								'validity',
								{
									rules: [{ required: true, message: '请选择提单有效期!' }]
								}
							]"
							:disabled="disabledAll"
						/>
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-form-item label="结算方式">
						<a-input
							v-decorator="[
								'takeStatement',
								{
									rules: [{ required: false, message: '请输入结算方式!' }]
								}
							]"
							placeholder="请输入结算方式"
							:disabled="disabledAll"
						/>
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-form-item label="制单员">
						<a-input
							:disabled="disabledAll"
							v-if="['preview'].includes(typeModel)"
							v-decorator="[
								'makePaperName',
								{
									rules: [{ required: true, message: '请选择制单员!' }]
								}
							]"
						></a-input>
						<a-select
							v-else
							show-search
							v-decorator="[
								'makePaperId',
								{
									rules: [{ required: true, message: '请选择制单员!' }]
								}
							]"
							placeholder="请选择制单员"
							:disabled="disabledAll"
						>
							<a-select-option
								:value="item.makePaperId"
								v-for="item in makePaperInfoList"
								:key="item.makePaperId"
							>
								{{ item.makePaperName }}
							</a-select-option>
						</a-select>
					</a-form-item>
				</a-col>
				<!-- ，仓库简称置“厂提”，不允许修改； -->
				<!-- ○ 入库  指定规格，仓库简称取申请提货记录中勾选的仓库名称，不允许修改-->
				<a-col :span="8">
					<a-form-item label="仓库简称">
						<a-select
							label-in-value
							show-search
							:default-active-first-option="false"
							:show-arrow="false"
							:filter-option="false"
							:not-found-content="null"
							@search="handleWarehouseContractSearch"
							@change="handleWarehouseContractSearch"
							@dropdownVisibleChange="handleWarehouseContractSearchShow"
							v-decorator="[
								'warehouseLessorId',
								{
									rules: [{ required: true, message: '请选择制仓库简称!' }]
								}
							]"
							placeholder="请选择仓库简称"
							:disabled="disabledAll || appointSpec == 1"
						>
							<a-select-option
								:value="item.warehouseLessorId"
								v-for="item in warehouseList"
								:key="item.warehouseLessorId"
							>
								{{ item.warehouseShortName }}
							</a-select-option>
						</a-select>
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-row
						:gutter="24"
						style="position: relative"
					>
						<a-col :span="!isOaPage ? 24 : 24">
							<a-form-item label="提单样式模板">
								<a-select
									:style="{ width: !isOaPage && !previewBtnDisabled ? '60%' : '100%' }"
									:disabled="previewBtnDisabled || disabledAll"
									v-decorator="[
										'takeTemplate',
										{
											rules: [
												{
													required: !previewBtnDisabled,
													message: '请选择制提单样式模板!'
												}
											]
										}
									]"
									placeholder="请选择提单样式模板"
									@change="templateChange"
								>
									<a-select-option
										:value="item.value"
										v-for="item in takeDeliveryTemplate"
										:key="item.value"
									>
										{{ item.label }}
									</a-select-option>
								</a-select>
							</a-form-item>
						</a-col>
						<a-col
							v-if="!isOaPage"
							:span="8"
							style="position: absolute; right: -20px; margin: 4px 0 0 0"
						>
							<a-button
								v-if="!previewBtnDisabled"
								class="preview-btn"
								type="primary"
								:disabled="disabledAll"
								@click="templatePreview"
								v-show="templatePreviewBtn"
								>预览样式</a-button
							>
						</a-col>
					</a-row>
				</a-col>
				<a-col :span="8">
					<a-form-item label="备注">
						<a-input
							v-decorator="[
								'remark',
								{
									rules: [{ required: false, message: '请输入备注!' }]
								}
							]"
							placeholder="请输入结算方式"
							:disabled="disabledAll"
						/>
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-form-item label="是否关联回款">
						<a-select
							v-decorator="[
								'isRelationCollection',
								{
									rules: [{ required: true, message: '请选择制是否关联回款!' }]
								}
							]"
							placeholder="请选择是否关联回款"
							@change="isRelationCollectionChange"
							:disabled="disabledAll"
						>
							<a-select-option value="1"> 关联回款 </a-select-option>
							<a-select-option value="2"> 暂不关联回款 </a-select-option>
						</a-select>
					</a-form-item>
				</a-col>
			</a-row>
		</a-form>
		<!-- 关联回款 -->
		<div v-if="formType.getFieldValue('isRelationCollection') == 1">
			<RelationCollection
				ref="relationCollection"
				:dataPayment="dataPayment"
				:selectedKeys="selectedRowKeys"
				:data="$refs.factoryBill.selectData"
			></RelationCollection>
		</div>
		<!-- /** 提单方式 */ -->
		<CardInfo
			ref="cardInfo"
			:list="dataCar"
		></CardInfo>
		<!-- 判断是否对接仓库 -->
		<div
			style="display: flex"
			v-if="['preview'].includes(typeModel) && takeDelivery.warehouseIsDocking"
		>
			<p
				class="contract-title"
				style="justify-content: flex-start"
			>
				<span>三方仓储运单明细</span>
				<a-button
					@click="openOutBound"
					type="link"
					>三方仓储提货明细</a-button
				>
			</p>
		</div>
		<div v-if="['upload', 'oa'].includes(typeModel) || currentStatus == '7'">
			<p class="contract-title">
				<span>提单附件</span>
				<a-button
					v-if="['oa'].includes(typeModel)"
					type="primary"
					@click="zipdownload"
					icon="download"
					>批量下载</a-button
				>
			</p>
			<a-table
				class="contract-table-wrap"
				:columns="columnsEnclosure"
				:pagination="false"
				:scroll="{ x: 1200, y: 240 }"
				:data-source="dataFileList"
				rowKey="fileId"
			>
				<span
					slot="methods"
					slot-scope="text, record"
				>
					<a-button
						type="link"
						@click="details(record)"
						v-if="false"
						>查看</a-button
					>
					<a-button type="link">
						<a
							href="javascript:;"
							@click="jumpDownload(record)"
							>下载</a
						>
					</a-button>
				</span>
			</a-table>
			<a-button
				type="dashed"
				block
				@click="showModal"
				v-if="['upload'].includes(typeModel)"
			>
				<a-icon type="plus" />新增附件
			</a-button>
		</div>
		<div v-if="['preview'].includes(typeModel)">
			<p class="contract-title">操作历史</p>
			<!-- 日志 -->
			<Log :logList="operationHistory"></Log>
		</div>

		<div class="footer-btn-wrap">
			<p>
				<a-button
					@click="preview"
					v-if="showPreviewBtn"
					>提单预览</a-button
				>
				<a-button
					@click="prev"
					style="margin-left: 40px"
					v-if="!isOaPage"
					>返回</a-button
				>

				<a-button
					style="margin-left: 40px"
					v-if="!isOaPage && !['input', 'upload', 'relation', 'preview', 'oa'].includes(typeModel)"
					@click="checkIsRelation(1)"
					:loading="disabledSubmit"
					>保存</a-button
				>
				<a-button
					type="primary"
					v-if="!isOaPage && !['preview', 'oa'].includes(typeModel)"
					style="margin-left: 40px"
					@click="checkIsRelation(2)"
					:loading="disabledSubmit"
					>提交</a-button
				>
			</p>
		</div>
		<upload
			ref="upload"
			:fileTypeList="fileTypeList"
			v-on:add-file="addFile"
			:acceptFormat="acceptFormat"
		/>
		<template-modal ref="template" />
		<preview
			ref="preview"
			type="base64"
		/>
		<void-dialog
			:fn="fn"
			label="驳回"
			paramsKey="remark"
			ref="voidDialog"
			v-on:update="prev"
		/>
		<OutboundModal ref="outboundModal"></OutboundModal>
	</div>
</template>

<script>
import VoidDialog from '../../components/voidDialog.vue';
import Pagination from '../../components/pagination.vue';
import Upload from '../../components/upload.vue';
import OutboundModal from '../../components/outboundModal.vue';
import FactoryBill from './components/FactoryBill.vue';
import RelationCollection from './components/RelationCollection.vue';
import CardInfo from './components/CardInfo.vue';

import moment from 'moment';
import ENV from '@/v2/config/env';
import { columns, columnsCar, relationPayment, columnsEnclosure, columnsPut, columnsOperation } from '../../config/orderStep2';
import {
	getShowTakeDeliveryInfo, //提货单查看详情
	getStartByLessor, //仓库简称下拉
	getMakePaperInfo, //查看该企业下制单员的信息
	takeDeliveryPreview, //提单预览
	takeDeliverySaveOrSubmit, //保存or提交
	findCollectionByContractNo, //查看回款信息
	checkCollection, //校验回款信息是否双签
	showTakeDeliveryInfo, //提货单查看详情
	realTake, //实提
	uploadAttach, //提单上传附件
	addCollection, //添加回款（审核、待提交状态）
	checkBusinessLine, //验证是否关联采购合同
	downloadRealTakeTemplate, //实提模板下载
	takePurchaseExport, //提单中货物清单导出
	batchDownload, //提单OA批量下载附件
	takeSelectPurchaseExport, //提单导出勾选的提货明细信息
	getBatchAttachList, //提单OA附件列表
	rejectTakeGoods,
	API_SteelsDownloadFilesPath,
	API_GETLOGINBYMOBILE,
	getTakeDeliveryBusinessLineList,
	getTakeDeliveryContractDetail
} from '@/v2/center/steels/api/orderApply';
import { debounce } from 'lodash';
import { filterCodeBySteelKey } from '@sub/utils/globalCode.js';
import TemplateModal from '../template.vue';
import Preview from '../../components/preview.vue';
import { nanoid } from 'nanoid';
import { mapMutations, mapGetters } from 'vuex';
import comDownload from '@sub/utils/comDownload.js';
import { cloneDeep } from 'lodash';
import Log from '@/v2/center/steels/components/Log.vue';
export default {
	name: 'step2',
	props: {
		labelCol: {
			type: Number,
			default: 9
		},
		isOaPage: {
			type: Boolean,
			default: false
		},
		selectItem: {
			type: Object,
			default: () => {}
		}
	},
	data() {
		return {
			form: this.$form.createForm(this, { name: 'form' }),
			formType: this.$form.createForm(this, { name: 'formType' }),
			data: [],
			dataList: [],
			columnsEnclosure,
			columnsOperation,
			// 选择的回款
			selectedRowKeys: [],
			// 合同明细
			purchaseList: [],
			// 回款
			dataPayment: [],
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
			// 仓库简称
			warehouseList: [],
			// 是否预览样式
			previewBtnDisabled: false,
			// 制单员列表
			makePaperInfoList: [],
			// 附件列表
			dataFileList: [],
			// 制提单样式模板
			takeDeliveryTemplate: filterCodeBySteelKey('takeDeliveryTemplate'),

			fundType: filterCodeBySteelKey('fundType'),
			messageList: {
				1: '保存成功',
				2: '提交成功'
			},
			contractDetails: [],
			takeDeliveryApply: {},
			disabledSubmit: false,
			fileTypeList: [
				{
					value: 'BILL_OF_LADING',
					text: '提货单(已盖章)'
				}
			],
			templatePreviewBtn: false,
			realTakeStatusNo: true, //没有实提
			takeDelivery: {},
			showPreviewBtn: true,
			acceptFormat: '.png,.jpeg,.jpg,.gif',
			action: `${ENV.BASE_GANG_API}/takeDelivery/realTakeImport`,
			acceptFormatReal: '.xlsx,.xls',
			selectedRowKeysGoods: [],
			fn: rejectTakeGoods,
			// 操作日志
			operationHistory: [],
			outboundRecords: [],
			// 业务线
			businessLineFullNoList: [],
			// 业务线号
			businessLineFullNo: '',
			// 是否指定规格
			appointSpec: 1
		};
	},
	mounted() {
		this.oaDetails();
	},
	watch: {
		data: {
			async handler(newValue) {
				if (newValue.length) {
					this.computedTotalAmount(newValue);
				}
			},
			deep: true
		}
	},
	computed: {
		isCoreAndGeneral() {
			return this.VUEX_ST_COMPANYSUER.companyType == 'CORE_COMPANY';
		},
		...mapGetters('user', {
			VUEX_ST_TOKEN: 'VUEX_ST_TOKEN',
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		uploadQuerydata() {
			return {
				contractId: this.$route.query.contractId,
				appleTakeSerialNo: this.$route.query.serialNo
			};
		},
		headers() {
			return {
				Authorization: this.VUEX_ST_TOKEN,
				Source: 'PC'
			};
		},
		typeModel() {
			return this.$route.query.type;
		},
		disabledForm() {
			return this.selectItem?.contractId || this.$route.query.contractId ? true : false;
		},
		disabledApplyInfo() {
			return this.selectItem?.serialNo || this.$route.query.serialNo ? true : false;
		},
		disabledAll() {
			return ['preview', 'upload', 'input', 'relation', 'oa'].includes(this.$route.query.type);
		},
		// 计算实提数量累加
		computedTotalReal() {
			const computedDataList = this.data.slice(0, this.data.length - 1);
			// 实提数量
			const realTakeQuantityTotal = computedDataList.reduce((pre, cur) => {
				return pre + (Number(cur.realTakeQuantity) || 0);
			}, 0);
			// 可提件数
			const availablePieceQuantityTotal = computedDataList.reduce((pre, cur) => {
				return pre + (+cur.availablePieceQuantity || 0);
			}, 0);
			// 预提件数
			const currentApplyPieceQuantityTotal = computedDataList.reduce((pre, cur) => {
				return pre + (+cur.currentApplyPieceQuantity || 0);
			}, 0);
			// 可提数量
			const availableQuantityTotal = computedDataList.reduce((pre, cur) => {
				return pre + (+cur.availableQuantity || 0);
			}, 0);
			// 预提数量
			const currentApplyQuantityTotal = computedDataList.reduce((pre, cur) => {
				return pre + (+cur.currentApplyQuantity || 0);
			}, 0);
			// 预提货物含税金
			const goodTaxMountTotal = computedDataList.reduce((pre, cur) => {
				return pre + (+cur.goodTaxMount || 0);
			}, 0);
			return {
				realTakeQuantityTotal: Math.round(realTakeQuantityTotal * 1000) / 1000,
				availablePieceQuantityTotal,
				currentApplyPieceQuantityTotal,
				availableQuantityTotal,
				currentApplyQuantityTotal: Math.round(currentApplyQuantityTotal * 1000) / 1000,
				goodTaxMountTotal
			};
		},
		currentStatus() {
			return this.$route.query.status || '';
		}
	},
	methods: {
		...mapMutations({
			VUEX_MU_USERTOKEN: 'user/VUEX_MU_USERTOKEN'
		}),
		jumpDownload(record) {
			// 单一附件信息下载附件
			const fileFormat = record.fileUrl.split('?')[0].split('.').pop().toLowerCase();
			API_SteelsDownloadFilesPath({ filePath: record.fileUrl }).then(res => {
				comDownload(res, null, `${record.fileName}.${fileFormat}`);
			});
		},
		formateInputRealPieceOrQuantity(item, type, e) {
			let index = null;
			for (let i = 0; i < this.data.length; i++) {
				if (this.data[i].id == item.id) {
					index = i;
					break;
				}
			}

			let cloneItem = cloneDeep(item);
			/** 判断 实提件数 是否是 / */
			if (type == 'realTakePieceQuantity' && item.realTakePieceQuantity != '/') {
				let reg = /^[0-9]*[1-9][0-9]*$/;
				if (item.realTakePieceQuantity < 0 || item.realTakePieceQuantity > 99999999999999) {
					item.realTakePieceQuantity = '';
					this.$message.error('件数请输入/或者大于等于1的小于99999999999999正整数');
					return;
				}
			}
			if (type == 'realTakePieceQuantity' && item.realTakePieceQuantity == '/') {
				cloneItem[type] = '/';
			} else {
				cloneItem[type] = Math.round(item[type] * 1000) / 1000;
			}

			if (type == 'realTakeQuantity') {
				cloneItem.realTakeQuantity = e.target.value;
			}
			this.$set(this.data, index, cloneItem);
		},
		onSelectChangeGoods(keys) {
			this.selectedRowKeysGoods = keys;
		},
		zipdownload() {
			batchDownload({
				contractId: this.contractDetails.contractId,
				serialNo: this.$route.query.id
			}).then(res => {
				comDownload(res, null, `${moment().format('YYYYMMDD')}提单附件.rar`);
			});
		},
		goodsListExport() {
			if (this.selectedRowKeysGoods.length) {
				takeSelectPurchaseExport({
					serialNo: this.$route.query.id || '',
					idList: this.selectedRowKeysGoods.join(',')
				}).then(res => {
					comDownload(res, null, `${moment().format('YYYYMMDD')}提货单中申请提货清单导出.xls`);
				});
			} else {
				takePurchaseExport({
					appleTakeSerialNo: this.$route.query.serialNo || this.selectItem.serialNo,
					serialNo: this.$route.query.id || ''
				}).then(res => {
					comDownload(res, null, `${moment().format('YYYYMMDD')}提货单中申请提货清单导出.xls`);
				});
			}
		},
		handleApplyChange({ file }) {
			if (file) {
				const { response } = file;
				if (response?.success) {
					this.$message.success('导入成功');
					const tempData = file.response.data;
					const currentData = cloneDeep(this.data);
					for (let j = 0; j < currentData.length; j++) {
						for (let i = 0; i < tempData.length; i++) {
							if (currentData[j].purchaseId == tempData[i].purchaseId) {
								if (tempData[i].realTakePieceQuantity) {
									if (typeof tempData[i].realTakePieceQuantity == 'number') {
										currentData[j].realTakePieceQuantity = Math.round(tempData[i].realTakePieceQuantity * 1000) / 1000;
									} else {
										currentData[j].realTakePieceQuantity = tempData[i].realTakePieceQuantity;
									}
								}
								if (tempData[i].realTakeQuantity) {
									currentData[j].realTakeQuantity = Math.round(tempData[i].realTakeQuantity * 1000) / 1000;
								}
							}
						}
					}
					this.data = currentData;
				}
				if (response?.error) {
					this.$message.error(`导入失败:${file.response.error.message}`);
				}
			}
		},
		downloadRealTakeTemplateMethod() {
			downloadRealTakeTemplate({
				serialNo: this.$route.query.id
			}).then(res => {
				comDownload(res, null, `${moment().format('YYYYMMDD')}提货单中申请提货清单导出.xls`);
			});
		},
		// 模板选择改变
		templateChange(type) {
			if (type == 'OTHER') {
				this.templatePreviewBtn = false;
				this.showPreviewBtn = false;
			} else {
				this.templatePreviewBtn = true;
				this.showPreviewBtn = true;
			}
		},
		// 提单模板预览
		templatePreview() {
			this.$refs.template.show();
		},
		// 回款添加
		collectionAdd() {
			addCollection({
				serialNo: this.$route.query.id,
				takeCollectionList: this.getRelationCollectionList()
			}).then(res => {
				if (res.success) {
					this.$message.success('关联回款完成');
					this.$router.back();
				}
			});
		},
		// 添加文件列表
		addFile(item) {
			this.fileTypeList.forEach(el => {
				if (el.value == item.type) {
					item.typeDesc = el.text;
				}
			});
			this.dataFileList.push(item);
		},
		// 提单上传附件
		takeUploadFile() {
			this.disabledSubmit = true;
			const { num, id } = this.$route.query;
			uploadAttach({
				id: num,
				takeSerialNo: id,
				attachList: this.dataFileList
			})
				.then(res => {
					if (res.success) {
						this.$message.success('上传成功');
						this.$router.back();
					}
				})
				.finally(() => {
					this.disabledSubmit = false;
				});
		},
		// 实提
		relaTakeData() {
			const realTakeList = this.computedGoodTaxMount(this.$refs.factoryBill.selectData);
			let realTakeQuantity = 0;
			realTakeList.forEach(el => {
				realTakeQuantity += el.realTakeQuantity || 0;
			});
			if (realTakeQuantity <= 0) {
				this.$message.warning('实提数量总和不能为0');
				return;
			}
			if (!this.$refs.factoryBill.save()) {
				return;
			}
			this.disabledSubmit = true;
			const { num, serialNo } = this.$route.query;
			const purchaseRelList = this.computedGoodTaxMount(this.$refs.factoryBill.selectData);
			const newPurchaseRelList = JSON.parse(JSON.stringify(purchaseRelList));
			newPurchaseRelList.forEach(el => {
				el.realTakePieceQuantity = el.realTakePieceQuantity == '/' ? null : el.realTakePieceQuantity;
				el.excludingTaxAmount = el.excludingTaxAmount == '/' ? null : el.excludingTaxAmount;
				el.presetUnitPrice = el.presetUnitPrice == '/' ? null : el.presetUnitPrice;
				el.takeUnitPrice = el.takeUnitPrice == '/' ? null : el.takeUnitPrice;
				el.canTakePieceQuantity = el.canTakePieceQuantity == '/' ? null : el.canTakePieceQuantity;
				el.currentApplyPieceQuantity = el.currentApplyPieceQuantity == '/' ? null : el.currentApplyPieceQuantity;
				el.pieceQuantity = el.pieceQuantity == '/' ? null : el.pieceQuantity;
			});
			realTake({
				id: num,
				serialNo: serialNo,
				purchaseRelList: newPurchaseRelList
			})
				.then(res => {
					if (res.success) {
						this.$message.success('实提成功');
						this.$router.back();
					}
				})
				.finally(() => {
					this.disabledSubmit = false;
				});
		},
		// 查看提单详情
		detailsInfo() {
			return showTakeDeliveryInfo({
				serialNo: this.$route.query.id
			}).then(res => {
				if (res.success) {
					const {
						takeType,
						takeStartDate,
						takeEndDate,
						takeStatement,
						makePaperId,
						warehouseLessorId,
						takeTemplate,
						remark,
						isRelationCollection,
						realTakeStatus,
						warehouseShortName,
						makePaperName
					} = res.data.takeDelivery;
					this.operationHistory = res.data.operationHistory || [];
					this.appointSpec = res.data.appointSpec;
					this.takeDelivery = res.data.takeDelivery;
					// 出库记录
					this.outboundRecords = res.data.outboundRecords || [];
					if (this.takeDelivery.takeTemplate != 'TAKE_DELIVERY_TEMPLAT_1') {
						this.showPreviewBtn = false;
					} else {
						if (['1', '2', '5'].includes(this.$route.query.status)) {
							this.showPreviewBtn = true;
						} else {
							this.showPreviewBtn = false;
						}
					}
					let takeDeliveryApply = res.data.takeDeliveryApply || {};
					this.takeDeliveryApply = takeDeliveryApply;
					// 理重
					// theoreticalWeight
					this.formType.setFieldsValue({
						takeType,
						validity: [moment(takeStartDate), moment(takeEndDate)],
						takeStatement,
						makePaperId: makePaperId,
						makePaperName,
						warehouseLessorId: {
							key: warehouseLessorId,
							label: warehouseShortName
						},
						takeTemplate,
						remark,
						isRelationCollection: isRelationCollection.toString()
					});

					res.data.takeDeliveryPurchaseRelList.forEach(el => {
						// 理重
						el.theoreticalWeight = el.theoreticalWeight || '/';
						// 预提件数
						el.currentApplyPieceQuantity = el.currentApplyPieceQuantity || '/';
						el.mainId = `${el.materialName}_${el.specs}_${el.materialTexture}_${el.placeOfOrigin}_${el.baleNo}_${el.warehouse}`;
					});
					let takeDeliveryPurchaseRelList = res.data.takeDeliveryPurchaseRelList || [];
					// 回款
					this.data = this.computedGoodsListTotal(takeDeliveryPurchaseRelList);
					// 计算勾选的合同明细
					const contractPurchaseId = [];
					this.purchaseList.forEach((el, i) => {
						let flag = false;
						// 有素材ID 代表走的合同明细
						if (el.purchaseId) {
							flag = takeDeliveryPurchaseRelList.find(el2 => el2.purchaseId == el.purchaseId);
							flag && contractPurchaseId.push(el.purchaseId);
						} else {
							// 货转明细
							flag = takeDeliveryPurchaseRelList.find(el2 => el2.mainId == el.mainId);
							flag && contractPurchaseId.push(el.mainId);
						}
					});
					this.$refs.factoryBill &&
						this.$refs.factoryBill.init(contractPurchaseId, takeDeliveryPurchaseRelList, this.purchaseList);
					/** 提货方式 */
					this.$refs.cardInfo.init(res.data.takeDelivery.applyTakeType);

					// 车船号
					if (res.data.takeDeliveryModelList && res.data.takeDeliveryModelList.length) {
						this.dataCar = res.data.takeDeliveryModelList;
					} else {
						this.dataCar = [{ id: 1, index: 1, carNumber: '', carName: '', carTel: '', carId: '' }];
					}

					//  获取当前有木有实提
					this.realTakeStatusNo = realTakeStatus == 'NO_SUBMIT';
					// 回款
					if (isRelationCollection == 1) {
						this.templatePreviewBtn = true;
						this.selectedRowKeys = [];
						res.data.collectionList.forEach(item => {
							item.availableCollectionAmount = (item.availableCollectionAmount || 0) + (item.currentUseAmount || 0);
							if (item.exists) {
								this.selectedRowKeys.push(item.claimRecordId);
							}
						});
						this.dataPayment = res.data.collectionList;
						//  预览 情况 只展示 选择的
						if (this.typeModel == 'preview') {
							this.dataPayment = res.data.collectionList.filter(el => el.exists);
						}
					}
					this.getAttachListOfOa(res.data);
					if (res.data.takeDelivery.pdfPath) {
						this.dataFileList.push({
							type: '提单',
							typeDesc: '提单',
							fileId: String((Math.random() * 1000 + 1000).toFixed(0)),
							fileName: '提单标准模板',
							fileUrl: `${res.data.takeDelivery.pdfPath}`
						});
					}
					if (isRelationCollection == 2 && this.typeModel == 'relation') {
						this.formType.setFieldsValue({
							isRelationCollection: '1'
						});
					}
				}
			});
		},
		// 驳回
		reject() {
			this.$refs.voidDialog.showModal(this.selectItem);
		},
		// oa获取附件列表
		getAttachListOfOa(data) {
			if (this.$route.query.type == 'oa') {
				getBatchAttachList({
					contractId: this.contractDetails.contractId,
					serialNo: this.$route.query.id
				}).then(res => {
					if (res.success) {
						const tempList = [];
						res.data.forEach(item => {
							tempList.push({
								type: item.fileType,
								fileId: nanoid(4),
								fileName: item.fileName,
								fileUrl: `${item.filePath}`,
								typeDesc: '提货单(已盖章)'
							});
						});
						this.dataFileList = tempList;
					}
				});
			} else {
				this.dataFileList = data?.attachList || [];
			}
			this.dataFileList.forEach(el => {
				const item = this.fileTypeList.find(el2 => el2.value == el.type);
				if (item) {
					el.typeDesc = item.text;
				}
			});
		},
		// 根据保证金类型返回保证金类型文案
		getFundTypeText(value) {
			for (let i = 0; i < this.fundType.length; i++) {
				if (this.fundType[i].value == value) {
					return this.fundType[i].label;
				}
			}
		},
		// 验证是否关联采购合同
		checkRelationContract() {
			return checkBusinessLine({
				contractNo: this.contractDetails.contractNo,
				id: this.$route.query.contractId
			});
		},
		// 校验是否双签
		async checkCollectionResult(type) {
			let res = await checkCollection({
				contractNo: this.contractDetails.contractNo,
				takeCollectionList: this.getRelationCollectionList(),
				contractId: parseInt(this.$route.query.contractId) || parseInt(this.contractDetails?.contractId)
			});
			if (res.data.checkResult) {
				this.save(type);
			} else {
				res = await this.checkRelationContract();
				if (res.data) {
					if (this.typeModel == 'relation') {
						this.collectionAdd();
					} else {
						this.save(type);
					}
				} else {
					this.$message.warning('当前合同没有关联采购合同,请先关联采购合同');
				}
			}
		},
		// 查看回款信息
		async getFindCollectionByContractNo() {
			const params = {
				contractId: this.$route.query.contractId,
				businessLineFullNo: this.businessLineFullNo || '',
				takeDeliveryId: this.$route.query.num || '',
				isModify: this.typeModel == 'edit' ? 1 : 0
			};
			const res = await findCollectionByContractNo(params);
			res.data.forEach((item, index) => {
				item.id = index.toString();
			});
			this.dataPayment = res.data;
			return res;
		},
		// 预提货物含税金额(元)
		computedTotalAmount(list) {
			const total = list.slice(0, list.length - 1).reduce((prv, cur) => {
				return prv + (cur.currentApplyQuantity || 0) * (cur.takeUnitPrice || 0);
			}, 0);
			this.computedTotalAmountNumber = Math.round(total * 100) / 100;
		},
		// 获取提单员
		getMakePaperList() {
			getMakePaperInfo({}).then(res => {
				if (res.success) {
					this.makePaperInfoList = res.data;
				}
			});
		},
		handleWarehouseContractSearchShow(value) {
			if (value) {
				getStartByLessor({
					warehouseShortName: ''
				}).then(res => {
					if (res.success) {
						this.warehouseList = res.data;
					}
				});
			}
		},
		// 获取仓库简称
		handleWarehouseContractSearch: debounce(function (value) {
			if (value.key == 0) {
				this.previewBtnDisabled = true;
				this.showPreviewBtn = false;
				this.formType.setFieldsValue({
					takeTemplate: 'OTHER'
				});
			} else {
				this.previewBtnDisabled = false;
				this.showPreviewBtn = true;
				this.formType.setFieldsValue({
					takeTemplate: ''
				});
			}
			getStartByLessor({
				warehouseShortName: value || value?.label?.replace(/\n/g, '')?.trim()
			}).then(res => {
				if (res.success) {
					this.warehouseList = res.data;
				}
			});
		}, 300),
		// reduce计算求和
		addTotal(type, list) {
			return list.reduce((prv, cur) => {
				let num = cur[type] || 0;
				num = num == '/' ? 0 : Number(num);
				return prv + num;
			}, 0);
		},
		// 计算货物清单table统计行
		computedGoodsListTotal(list) {
			// 可提件数
			const availablePieceQuantityTotal = this.addTotal('availablePieceQuantity', list);
			// 预提件数
			const currentApplyPieceQuantityTotal = this.addTotal('currentApplyPieceQuantity', list);
			// 可提数量(吨)
			const availableQuantityTotal = this.addTotal('availableQuantity', list);
			// 预提数量(吨)
			const currentApplyQuantityTotal = this.addTotal('currentApplyQuantity', list);
			return list;
		},
		// 获取提提交post传参
		getPostData() {
			const formTypeValues = this.formType.getFieldsValue();
			if (formTypeValues.validity?.length) {
				formTypeValues.takeStartDate = moment(formTypeValues.validity[0]).format('YYYY-MM-DD');
				formTypeValues.takeEndDate = moment(formTypeValues.validity[1]).format('YYYY-MM-DD');
			}
			delete formTypeValues.validity;
			formTypeValues.warehouseShortName = formTypeValues?.warehouseLessorId?.label?.replace(/\n/g, '')?.trim();
			formTypeValues.warehouseLessorId = formTypeValues?.warehouseLessorId?.key;
			const makePaperInfo = this.getMakePaperNameById();
			return {
				...formTypeValues,
				buyCompanyUscc: this.contractDetails.buyCompanyUscc,
				buyCompanyName: this.contractDetails.buyCompanyName,
				contractNo: this.contractDetails.contractNo,
				pieceQuantityTotal: this.addTotal(
					'currentApplyPieceQuantity',
					this.computedGoodTaxMount(this.$refs.factoryBill.selectData)
				),
				quantityTotal: this.addTotal('availableQuantity', this.computedGoodTaxMount(this.$refs.factoryBill.selectData)),
				// 制单员
				makePaperName: makePaperInfo.makePaperName,
				makePaperPhone: makePaperInfo.mobile,
				makePaperEmail: makePaperInfo.email,
				contractTakeType: this.contractDetails.deliveryMode || ''
			};
			// return {
			//   ...formTypeValues,
			// pieceQuantityTotal: this.data[this.data.length - 1].currentApplyPieceQuantity,
			//   quantityTotal: this.data[this.data.length - 1].currentApplyQuantity,
			//   contractTakeType: this.contractDetails.deliveryMode,
			//   makePaperName: this.getMakePaperNameById(),
			//   contractNo: this.contractDetails.contractNo,
			//   buyCompanyUscc: this.contractDetails.buyCompanyUscc,
			//   buyCompanyName: this.contractDetails.buyCompanyName,
			//   applyCompanyName: this.takeDeliveryApply.createCompanyName,
			// };
		},
		// 获取制单员名称
		getMakePaperNameById() {
			const id = this.formType.getFieldValue('makePaperId');
			const item = this.makePaperInfoList.find(el => el.makePaperId == id) || {};
			return item;
			// for (let i = 0; i < this.makePaperInfoList.length; i++) {
			//   if (id == this.makePaperInfoList[i].makePaperId) {
			//     return this.makePaperInfoList[i].makePaperName;
			//   }
			// }
		},
		// 获取关联回款
		getRelationCollectionList() {
			if (this.$refs.relationCollection) {
				return this.$refs.relationCollection.getRelationCollectionList();
			}
			return [];
		},
		// 是否是关联回款和勾选保证金类型
		checkIsRelation(t) {
			if (this.typeModel == 'upload') {
				this.takeUploadFile();
				return;
			}
			if (this.typeModel == 'input') {
				this.relaTakeData();
				return;
			}
			const list = this.getRelationCollectionList();
			const types = list.map(item => item.fundType);
			const type = this.formType.getFieldValue('isRelationCollection');
			const flagList = list.map(item => item.currentUseAmount);
			if (type == 1 && list.length <= 0) {
				this.$message.warning('请勾选要关联的回款信息');
				return;
			}
			if (flagList.includes(undefined) || flagList.includes(null)) {
				this.$message.warning('本次使用回款金额不能为空');
				return;
			}
			if (type == 1 && types.includes('BOND')) {
				this.checkCollectionResult(t);
			} else {
				if (this.typeModel == 'relation') {
					this.collectionAdd();
				} else {
					this.save(t);
				}
			}
		},
		// 计算含税金额record.currentApplyQuantity * record.takeUnitPrice
		computedGoodTaxMount(list) {
			let tempList = cloneDeep(list);
			tempList.forEach(item => {
				item.goodTaxMount =
					item.currentApplyQuantity * (item.takeUnitPrice && (item.takeUnitPrice != '/' ? item.takeUnitPrice : 0));
				item.realTakePieceQuantity = item.realTakePieceQuantity == '/' ? null : item.realTakePieceQuantity;
				item.presetUnitPrice = item.presetUnitPrice == '/' ? null : item.presetUnitPrice;
				item.excludingTaxAmount = item.excludingTaxAmount == '/' ? null : item.excludingTaxAmount;
				// ；理重
				item.theoreticalWeight = item.theoreticalWeight == '/' ? null : item.theoreticalWeight;
				item.pieceQuantity = item.pieceQuantity == '/' ? null : item.pieceQuantity;
				item.currentApplyPieceQuantity = item.currentApplyPieceQuantity == '/' ? null : item.currentApplyPieceQuantity;
			});
			return tempList;
		},
		// 保存or提交
		save(type) {
			this.formType.validateFields(async (err, values) => {
				if (!err) {
					if (!this.$refs.factoryBill.save()) {
						return;
					}
					if (!this.$refs.cardInfo.save()) {
						this.$message.error('请选择提货方式');
						return;
					}

					// 是否是关联回款和勾选保证金类型
					this.disabledSubmit = true;
					const params = {
						serialNo: this.$route.query.id,
						id: this.$route.query.num || null,
						appointSpec: this.appointSpec,
						saveOrSubmit: type,
						...this.getPostData(),
						// 货物明细
						takeDeliveryPurchaseRelList: this.computedGoodTaxMount(this.$refs.factoryBill.selectData),
						// 回款
						takeCollectionList: this.getRelationCollectionList(),
						// 勾选的合同货物明细id
						contractPurchaseId: this.$refs.factoryBill.ids,
						// 提货方式
						applyTakeType: this.$refs.cardInfo.save().takeType,
						// 提发货 方式 船运
						takeDeliveryModelList: this.$refs.cardInfo.save().dataCar || [],
						// 业务线号
						businessLineFullNo: this.businessLineFullNo,
						contractId: this.$route.query.contractId || this.contractDetails?.contractId
					};
					try {
						await takeDeliverySaveOrSubmit(params);
						this.disabledSubmit = false;
						this.$message.success({
							content: this.messageList[type],
							onClose: () => {
								this.next();
							}
						});
					} catch (error) {
						this.disabledSubmit = false;
					}
				}
			});
		},
		// 根据是否关联回款显示预览样式
		isRelationCollectionChange(value) {
			if (value == 1) {
				this.isRelationCollectionShow = true;
			} else {
				this.isRelationCollectionShow = false;
			}
		},
		// 获取合同详情
		async getContractDetails() {
			const params = {
				takeDeliveryId: this.$route.query.num || '',
				contractId: this.$route.query.contractId,
				isModify: this.$route.query.type == 'add' ? 0 : 1,
				businessLineFullNo: this.businessLineFullNo,
				takeSerialNo: this.$route.query.id
			};
			const res = await getTakeDeliveryContractDetail(params);
			if (res.success) {
				const {
					contractNo,
					buyCompanyName,
					steelTypeDesc,
					deliveryPlace,
					effectiveStartDate,
					effectiveEndDate,
					deliveryModeDesc,
					appointSpecDesc
				} = res.data;
				this.form.setFieldsValue({
					contractNo,
					buyCompanyName,
					steelTypeDesc,
					deliveryPlace,
					effectiveStartDate: `${effectiveStartDate}-${effectiveEndDate}`,
					deliveryModeDesc,
					appointSpecDesc,
					availableQuantity: res.data.availableQuantity,
					availablePieceQuantity: res.data.availablePieceQuantity
				});

				const purchaseList = res.data.purchaseList || res.data.goodsTransferList;
				purchaseList.forEach(el => {
					el.mainId = `${el.materialName}_${el.specs}_${el.materialTexture}_${el.placeOfOrigin}_${el.baleNo}__${el.warehouse}`;
					// 预提货物含税金额=提货单价(元/吨)*预提货数量(吨) 提货单价 默认“合同含税单价（元/吨）” 预提货数量(吨) 默认等于可提数量
					el.goodTaxMount = ((el.presetUnitPrice || 0) * (el.availableQuantity || 0)).toFixed(6);
					// 可提数量
					el.canTakeQuantity = el.availableQuantity;
					// 合同件数
					el.pieceQuantity = el.pieceQuantity || '/';
					// 可提件数
					el.canTakePieceQuantity = el.availablePieceQuantity;
				});
				this.contractDetails = res.data;
				this.purchaseList = purchaseList;
				// 货物明细
				this.changeAppointSpec();

				/** 提单基本信息赋值 */
				// 仓库           // 判断是否是厂提
				if (res.data.upDeliveryMode == 'FACTORY_MENTION') {
					this.formType.setFieldsValue({
						warehouseLessorId: {
							key: 0,
							label: '厂提'
						}
					});
					this.handleWarehouseContractSearch({ key: 0, label: '厂提' });
				}
			}
		},
		showModal() {
			this.$refs.upload.show();
		},
		next() {
			this.$router.push({
				path: '/center/take/goods/list'
			});
			//  this.$router.back();
		},
		preview() {
			this.formType.validateFields((err, values) => {
				if (!err) {
					const takeDeliveryModelList =
						this.$refs.cardInfo.save().takeType == 'CARSHIPNO' ? this.$refs.cardInfo.save().dataCar : [];
					takeDeliveryPreview({
						...this.getPostData(),
						...this.contractDetails,
						takeDeliveryPurchaseRelList: this.computedGoodTaxMount(this.$refs.factoryBill.selectData),
						serialNo: this.$route.query.id || null,
						takeDeliveryModelList,
						makePaperId: this.takeDelivery.makePaperId,
						applyTakeType: this.$refs.cardInfo.save().takeType
					}).then(res => {
						if (res.success) {
							this.$refs.preview.show(res.data, this.contractDetails);
						}
					});
				}
			});
		},
		prev() {
			this.$router.back();
		},
		// 查看详情
		async addNewItemOrDetails() {
			// 获取业务线
			await this.getBusinessLine();
			// 获取制单员列表
			this.getMakePaperList();
			//  回款列表
			this.getFindCollectionByContractNo();
			//  获取合同详情
			await this.getContractDetails();
			if (['preview', 'edit', 'input', 'relation', 'oa', 'upload'].includes(this.typeModel)) {
				// 提单详情
				await this.detailsInfo();
			}
		},
		oaDetails() {
			if (this.$route.query.type == 'oa') {
				const { contractId, companyUserId } = this.$route.query;
				API_GETLOGINBYMOBILE({
					contractId,
					companyUserId
				}).then(res => {
					this.VUEX_MU_USERTOKEN(res.token);
					this.addNewItemOrDetails();
				});
			} else {
				this.addNewItemOrDetails();
			}
		},
		openOutBound() {
			this.$refs.outboundModal.init(this.outboundRecords);
		},
		// 获取业务线列表
		async getBusinessLine() {
			const params = {
				takeDeliveryId: this.$route.query.num || null,
				contractId: this.$route.query.contractId,
				isModify: this.$route.query.type == 'preview' ? 0 : 1
			};
			const res = await getTakeDeliveryBusinessLineList(params);
			this.businessLineFullNoList = res.data;
			this.businessLineFullNo = res.data[0].relationNo || '';
			/*** 新增的时候 赋值 */
			if (this.typeModel == 'add') {
				this.businessLineFullNo = res.data[0].relationNo || '';
			}
		},
		// 是否指定规格
		async changeAppointSpec() {
			/** 判断是否是指定规格 */
			if (this.appointSpec == 0) {
				const tpl = [
					{
						mainId: String(new Date().getTime()),
						materialName: '', //物资名称
						specs: undefined, //规格
						materialTexture: undefined, //材质
						placeOfOrigin: '',
						baleNo: '',
						metrologyWay: ''
					}
				];
				this.$refs.factoryBill && this.$refs.factoryBill.init([], tpl, this.purchaseList);
			} else {
				this.$refs.factoryBill && this.$refs.factoryBill.init([], [], this.purchaseList);
			}
		},
		// 更改业务线
		changeBusinessLine() {
			this.getContractDetails();
			this.getFindCollectionByContractNo();
		},
		// 获取仓库
		sendWarehouse(info) {
			if (this.appointSpec == 1) {
				this.formType.setFieldsValue({
					warehouseLessorId: {
						key: info.warehouseId,
						label: info.warehouse
					}
				});
			}
		}
	},
	components: {
		Pagination,
		Upload,
		TemplateModal,
		Preview,
		VoidDialog,
		OutboundModal,
		Log,
		FactoryBill,
		RelationCollection,
		CardInfo
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
.apply-title-wrap {
	width: 100%;
	height: auto;
	display: flex;
	justify-content: space-between;
	position: relative;
}
.contract-table-wrap {
	width: 100%;
	margin-bottom: 15px;
}
.preview-btn {
	width: 80px;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
}
/deep/ .ant-table-thead {
	.ant-table-selection-column-custom {
		.ant-table-selection {
			margin-right: 0;
		}
	}
}
</style>
