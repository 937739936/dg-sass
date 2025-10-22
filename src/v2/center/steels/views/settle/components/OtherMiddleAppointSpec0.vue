<template>
	<div class="settle-apply-form">
		<a-form
			:form="settleApplyForm"
			layout="inline"
		>
			<template>
				<div class="title"><i class="title_icon"></i>放货通知单</div>
				<div class="table-wrap">
					<a-table
						:columns="goodsTransferColumns"
						:rowKey="record => record.id"
						:dataSource="goodsTransferData"
						:pagination="false"
						:locale="{ emptyText: '暂无数据' }"
					>
						<div
							slot="action"
							slot-scope="action, item"
						>
							<a
								href="javascript:void(0)"
								style="margin-right: 15px"
								@click="handleViewDetail(item)"
								>查看</a
							>
							<!-- <a href="javascript:void(0)" @click="downloadGoodsTransfer(item.pdfPath)">下载</a> -->
						</div>
					</a-table>
				</div>
			</template>

			<div class="title"><i class="title_icon"></i>基础信息</div>
			<a-row>
				<a-col
					:span="12"
					class="row"
				>
					<a-form-item
						label="合同编号"
						:colon="false"
					>
						<a-input
							disabled
							v-decorator="['contractNo']"
						></a-input>
					</a-form-item>
				</a-col>
				<a-col
					:span="12"
					class="row"
				>
					<a-form-item
						label="合同数量（吨）"
						:colon="false"
					>
						<a-input
							disabled
							v-decorator="['quantity']"
						></a-input>
					</a-form-item>
				</a-col>
				<a-col
					:span="12"
					class="row"
				>
					<a-form-item
						label="钢材种类"
						:colon="false"
					>
						<a-input
							disabled
							v-decorator="['steelTypeDesc']"
						></a-input>
					</a-form-item>
				</a-col>
				<a-col
					:span="12"
					class="row"
				>
					<a-form-item
						label="业务类型"
						:colon="false"
					>
						<a-input
							disabled
							v-decorator="['businessTypeDesc']"
						></a-input>
					</a-form-item>
				</a-col>
				<a-col
					:span="12"
					class="row"
				>
					<a-form-item
						label="是否指定规格"
						:colon="false"
					>
						<a-input
							disabled
							v-decorator="['appointSpecDesc']"
						></a-input>
					</a-form-item>
				</a-col>
				<a-col
					:span="12"
					class="row"
				>
					<a-form-item
						label="运输方式"
						:colon="false"
					>
						<a-input
							disabled
							v-decorator="['transportModeDesc']"
						></a-input>
					</a-form-item>
				</a-col>
			</a-row>
			<div class="title"><i class="title_icon"></i>结算信息</div>
			<a-row>
				<div class="table-wrap">
					<a-table
						:columns="jsColumns"
						:dataSource="statementParticularList"
						:pagination="false"
						:locale="{ emptyText: '暂无数据' }"
					>
						<template
							slot="materialName"
							slot-scope="text, record, index"
						>
							<div v-if="record.transferQuantity == '总计'"></div>
							<a-form-item
								:colon="false"
								v-else
							>
								<a-input
									style="margin: -5px 0"
									@change="e => handleChangeQuantity(e.target.value, index, 'materialName')"
									:maxLength="50"
									v-decorator="[
										`materialName${index}`,
										{
											rules: [{ required: true, message: '品名必填' }],
											initialValue: text
										}
									]"
									:disabled="hasStatementId"
									v-if="record.index != '合计'"
								/>
							</a-form-item>
						</template>
						<template
							slot="specs"
							slot-scope="text, record, index"
						>
							<div v-if="record.transferQuantity == '总计'"></div>
							<a-form-item
								:colon="false"
								v-else
							>
								<a-input
									style="margin: -5px 0"
									@change="e => handleChangeQuantity(e.target.value, index, 'specs')"
									:maxLength="50"
									v-decorator="[
										`specs${index}`,
										{
											rules: [{ required: true, message: '规格必填' }],
											initialValue: text
										}
									]"
									:disabled="hasStatementId"
									v-if="record.index != '合计'"
								/>
							</a-form-item>
						</template>
						<template
							slot="materialTexture"
							slot-scope="text, record, index"
						>
							<div v-if="record.transferQuantity == '总计'"></div>
							<a-form-item
								:colon="false"
								v-else
							>
								<a-input
									style="margin: -5px 0"
									@change="e => handleChangeQuantity(e.target.value, index, 'materialTexture')"
									:maxLength="50"
									v-decorator="[
										`materialTexture${index}`,
										{
											rules: [{ required: true, message: '品质必填' }],
											initialValue: text
										}
									]"
									:disabled="hasStatementId"
									v-if="record.index != '合计'"
								/>
							</a-form-item>
						</template>
						<template
							slot="placeOfOrigin"
							slot-scope="text, record, index"
						>
							<div v-if="record.transferQuantity == '总计'"></div>
							<a-form-item
								:colon="false"
								v-else
							>
								<a-input
									style="margin: -5px 0"
									v-decorator="[
										`placeOfOrigin${index}`,
										{
											rules: [{ required: true, message: '产地必填' }],
											initialValue: text
										}
									]"
									@change="e => handleChangeQuantity(e.target.value, index, 'placeOfOrigin')"
									:maxLength="50"
									:disabled="hasStatementId"
									v-if="record.index != '合计'"
								/>
							</a-form-item>
						</template>
						<template
							slot="currentSettleQuantity"
							slot-scope="text, record, index"
						>
							<div v-if="record.transferQuantity == '总计'">
								<a-form-item>
									<a-input
										v-model.trim="record.currentSettleQuantity"
										@change="e => handleChangeQuantity(e.target.value, index, 'currentSettleQuantity', true)"
									>
									</a-input>
								</a-form-item>
							</div>
							<a-form-item
								:colon="false"
								v-else
							>
								<a-input
									style="margin: -5px 0"
									v-decorator="[
										`currentSettleQuantity${index}`,
										{
											rules: [
												{ required: true, message: '结算数量必填' },
												{ pattern: numberReg, message: '请输入数字，最多四位小数' }
											],
											initialValue: text
										}
									]"
									@change="e => handleChangeQuantity(e.target.value, index, 'currentSettleQuantity')"
									:disabled="hasStatementId"
								/>
							</a-form-item>
						</template>
						<template
							slot="currentSettleNoAvePrice"
							slot-scope="text, record, index"
						>
							<div v-if="record.transferQuantity == '总计'"></div>
							<a-form-item
								:colon="false"
								v-else
							>
								<a-input v-model.trim="record.currentSettleNoAvePrice"></a-input>
							</a-form-item>
						</template>
						<template
							slot="currentSettleAvePrice"
							slot-scope="text, record, index"
						>
							<div v-if="record.transferQuantity == '总计'"></div>
							<a-form-item
								:colon="false"
								v-else
							>
								<a-input v-model.trim="record.currentSettleAvePrice"></a-input>
							</a-form-item>
						</template>
						<template
							slot="currentSettleAmount"
							slot-scope="text, record, index"
						>
							<div v-if="record.transferQuantity == '总计'">
								<a-form-item>
									<a-input
										v-model.trim="record.currentSettleAmount"
										@blur="e => handleChangeContract(e.target.value, index, 'currentSettleAmount', true)"
									>
									</a-input>
								</a-form-item>
							</div>
							<a-form-item
								:colon="false"
								v-else
							>
								<a-input
									:maxLength="14"
									style="margin: -5px 0"
									@blur="e => handleChangeContract(e.target.value, index, 'currentSettleAmount')"
									v-decorator="[
										`currentSettleAmount${index}`,
										{
											rules: [
												{ required: true, message: '价税合计必填' },
												{
													validator: ifTwoDecimal,
													message: '请输入2位小数'
												}
											],
											initialValue: text
										}
									]"
									:disabled="hasStatementId"
									v-if="record.index != '合计'"
								/>
							</a-form-item>
						</template>
						<template
							slot="action"
							slot-scope="text, record, index"
							v-if="index != statementParticularList.length - 1"
						>
							<span @click="addRow(index)"
								><a-icon
									type="plus-circle"
									style="color: var(--primary-color); font-size: 20px; margin-right: 15px; cursor: pointer"
							/></span>
							<span
								v-if="index > 0"
								@click="removeRow(index)"
								><a-icon
									type="minus-circle"
									style="color: red; font-size: 20px; cursor: pointer"
							/></span>
						</template>
					</a-table>
				</div>
			</a-row>
			<a-row class="row textarea-wrap">
				<a-col :span="12">
					<a-form-item
						label="结算日期"
						:colon="false"
					>
						<a-date-picker
							v-decorator="[
								'settleTime',
								{
									rules: [{ required: true, message: '请选择' }]
								}
							]"
							type="date"
							format="YYYY-MM-DD"
							valueFormat="YYYY-MM-DD"
							style="width: 100%"
							placeholder="请选择"
							:disabled="hasStatementId"
						/>
					</a-form-item>
				</a-col>
				<a-col :span="12">
					<a-form-item
						label="结算单类型"
						:colon="false"
					>
						<a-select
							v-decorator="[
								'statementType',
								{
									rules: [{ required: true, message: '结算单类型必填' }]
								}
							]"
							style="width: 220px"
							placeholder="请选择"
							:disabled="hasStatementId"
						>
							<a-select-option value="PRE_STAT">预结算单</a-select-option>
							<a-select-option value="STAT">结算单</a-select-option>
						</a-select>
					</a-form-item>
				</a-col>
			</a-row>
			<a-row class="row textarea-wrap">
				<a-col :span="24">
					<a-form-item
						label="备注"
						:colon="false"
					>
						<a-textarea
							:disabled="hasStatementId"
							v-decorator="['remark']"
							placeholder="请输入内容，最多输入1000个字符"
							:maxLength="1000"
						></a-textarea>
					</a-form-item>
				</a-col>
			</a-row>
			<div>
				<div class="title"><i class="title_icon"></i>附件信息</div>
				<div class="upload-wrap">
					<div class="upload-block">
						<CustomUpload
							:isNeedRotate="true"
							:columns="fileColumns"
							:ifEditable="!hasStatementId"
							@uploadFiles="getUploadFiles"
							:fileDataSource="fileDataSource"
							:type="'yuShenSettle'"
							:businessType="'OTHER_MIDDLE'"
						/>
					</div>
				</div>
			</div>
			<div class="btn-wrap">
				<a-button @click="$router.go(-1)">返回</a-button>
				<!-- <a-button @click="submitSettleForm('save')">保存</a-button> -->
				<a-button
					type="primary"
					@click="submitSettleForm('preview')"
					>提交</a-button
				>
			</div>
		</a-form>
		<PreviewModal
			ref="previewModal"
			@save="submitSettleForm('submit2')"
		></PreviewModal>
	</div>
</template>

<script>
import { API_DOWNLPREVIEWTE } from '@/v2/center/steels/api';
import { filterCodeByValueName } from '@sub/utils/globalCode.js';
import {
	API_SteelsStatementNextStep,
	previewStatement,
	API_SteelsStatementSave,
	API_SteelsStatementSubmit1,
	API_SteelsStatementSubmit3,
	settleImportGoodsInfo
} from '@/v2/center/steels/api/settle.js';
import comDownload from '@sub/utils/comDownload.js';
import PreviewModal from './PreviewModal.vue';
import CustomUpload from '@/v2/center/steels/components/upload/CustomUpload.vue';
import { cloneDeep } from 'lodash';
import { noAppJsColumns } from './config.js';

const fileColumns = [
	{
		title: '类型',
		dataIndex: 'typeName'
	},
	{
		title: '操作',
		dataIndex: 'operation',
		scopedSlots: { customRender: 'operation' }
	}
];
export default {
	props: {
		info: {
			type: Object,
			default: () => {}
		}
	},
	data() {
		return {
			settleApplyForm: this.$form.createForm(this),
			settleSelectedRowKeys: [],
			transferIds: [], //选中的货转id
			goodTransferNos: '', // 货转编号
			goodsTransferData: [],
			goodsTransferColumns: [
				// 货转信息table列
				{
					title: '放货单号',
					dataIndex: 'releaseNo'
				},
				{
					title: '放货通知单开具时间',
					dataIndex: 'createdDate'
				},
				{
					title: '放货数量（吨）',
					dataIndex: 'totalQuantity'
				},
				{
					title: '状态',
					dataIndex: 'status',
					customRender: text => {
						return filterCodeByValueName(text, 'goodsTransferStatus');
					}
				},
				{
					title: '买方名称',
					dataIndex: 'buyCompanyName'
				},
				{
					title: '操作',
					dataIndex: 'action',
					scopedSlots: {
						customRender: 'action'
					}
				}
			],
			particularQuantity: 0, // 本次结算数量总和
			settleSelectedRowKeysGoodTransfer: [], // 选中的货转数组 Obj
			statementParticularList: [],
			numberReg: /^(\d+)(\.\d{1,4})?$/,
			contract: {},
			publicPath: process.env.BASE_URL,
			fileColumns,
			action: settleImportGoodsInfo,
			fileInfos: [],
			fileDataSource: []
		};
	},
	watch: {
		info: {
			handler(val) {
				if (Object.keys(val).length) {
					if (this.$route.query.statementId) {
						this.getEditDetail(cloneDeep(val));
					} else {
						this.getDetail(cloneDeep(val));
					}
				}
			},
			deep: true,
			immediate: true
		},
		statementParticularList: {
			handler(v) {
				if (!v || !v.length) return;
				let hasTotal = false;
				if (this.statementParticularList.length) {
					this.statementParticularList.forEach(item => {
						hasTotal = hasTotal || item.hasOwnProperty('transferQuantity');
					});
				}
				if (!hasTotal) {
					this.statementParticularList.push({
						transferQuantity: '总计',
						currentSettleQuantity: '', //结算数量
						currentSettleAmount: '' // 价税合计
					});
					// 计算总计
					if (this.statementParticularList.length) {
						this.computedTotal(true);
						this.computedAmountTotal(true);
					} else {
						this.computedTotal();
						this.computedAmountTotal();
					}
					this.$forceUpdate();
				}
			},
			immediate: true,
			deep: true
		}
	},
	mounted() {},
	computed: {
		hasStatementId() {
			return false;
		},
		jsColumns() {
			return noAppJsColumns;
		}
	},
	methods: {
		computedTotal(flag) {
			const numberReg = /^(\d+)(\.\d{1,4})?$/;
			const lastItem = this.statementParticularList[this.statementParticularList.length - 1];
			let currentSettleQuantity = 0;
			this.statementParticularList.forEach((el, i, arr) => {
				if (i != arr.length - 1) {
					if (el.currentSettleQuantity !== '/' && numberReg.test(Number(el.currentSettleQuantity))) {
						currentSettleQuantity += +(Number(el.currentSettleQuantity) || 0);
					}
				}
			});
			lastItem.currentSettleQuantity = currentSettleQuantity.toFixed(4);
			if (this.info?.currentSettleQuantityTotal && flag) {
				lastItem.currentSettleQuantity = this.info?.currentSettleQuantityTotal.toFixed(4);
			}
			this.$forceUpdate();
		},
		computedAmountTotal(flag) {
			const numberReg = /^(\d+)(\.\d{1,2})?$/;
			const lastItem = this.statementParticularList[this.statementParticularList.length - 1];
			let currentSettleAmount = 0;
			this.statementParticularList.forEach((el, i, arr) => {
				if (i != arr.length - 1) {
					if (el.currentSettleAmount !== '/' && numberReg.test(Number(el.currentSettleAmount))) {
						currentSettleAmount += +(Number(el.currentSettleAmount) || 0);
					}
				}
			});
			lastItem.currentSettleAmount = currentSettleAmount.toFixed(2);
			if (this.info?.currentSettleAmountTotal && flag) {
				lastItem.currentSettleAmount = this.info?.currentSettleAmountTotal.toFixed(2);
			}
			this.$forceUpdate();
		},

		// 首次开具回显详情
		async getDetail(data) {
			this.goodsTransferData = data.transferReleaseList || [];
			this.contract = data.contract;
			if (this.goodsTransferData.length) {
				this.goodsTransferData.map(i => {
					this.transferIds.push(i.id);
				});
			}
			this.$nextTick(() => {
				this.settleApplyForm.setFieldsValue({
					...data.contract,
					quantity: this.contract.quantity || '-',
					transportModeDesc: this.contract.transportModeDesc,
					amountPaidTotalPrice: this.$route.query.accountPaidAmount
				});
			});
			this.statementParticularList.push({
				index: 1,
				materialName: '',
				placeOfOrigin: '',
				currentSettleQuantity: '',
				currentSettleNoAvePrice: '',
				currentSettleAvePrice: '',
				currentSettleAmount: ''
			});
		},
		async getEditDetail(data) {
			let amountPaidTotalPrice = data.amountPaidTotalPrice;
			data.statementParticularList.forEach(el => {
				el.currentSettleAmount = el.currentSettleAmount;
				el.currentSettleAvePrice = el.currentSettleAmount ? (el.currentSettleAmount / el.currentSettleQuantity).toFixed(2) : 0;
				el.currentSettleNoAvePrice = (el.currentSettleAvePrice / 1.13).toFixed(2);
			});
			this.statementParticularList = data.statementParticularList;
			data.transferReleaseList.map(i => {
				this.transferIds.push(i.id);
			});
			this.contract = data.contract;
			this.particularQuantity = data.particularQuantity;
			// 货转信息
			const nextRes = await API_SteelsStatementNextStep({ id: this.contract.id, takeDeliverSerialNos: '' });
			this.goodsTransferData = nextRes.data.transferReleaseList;
			// 基础信息
			this.$nextTick(() => {
				this.settleApplyForm.setFieldsValue({
					statementType: data.type,
					amountPaidTotalPrice,
					...this.contract,
					remark: data.remark,
					settleTime: data.settleTime,
					quantity: this.contract.quantity || '-',
					transportModeDesc: this.contract.transportModeDesc
				});
			});
			// 附件
			const statementAttachList = data.statementAttachList || [];
			const obj = {
				statementAttachType: '货物变更佐证材料',
				OTHER: '其他',
				OFFLINE_STATEMENT: '线下结算单',
				PAYMENT_TICKET: '打款凭证'
			};
			statementAttachList.forEach(el => {
				el.typeName = obj[el.type];
				el.url = el.filePath;
			});
			this.fileDataSource = statementAttachList;
			this.fileInfos = statementAttachList;
		},
		onSelectGoodsTransferChange(selectedRowKeys, selectedRow) {
			this.transferIds = selectedRowKeys;
			this.settleSelectedRowKeysGoodTransfer = selectedRow;
			if (!this.settleSelectedRowKeysGoodTransfer.length) {
				this.statementParticularList = [];
				return;
			}
		},
		getCheckboxProps() {
			return {
				props: {
					disabled: false
				}
			};
		},
		// 计算合同
		handleChangeContract(value, i, key, flag) {
			const item = this.statementParticularList[i];
			item[key] = value;
			// 计算所有的实提数量和  金额
			this.computedContractTotal();
			if (['currentSettleAmount'].includes(key)) {
				if (flag) {
					this.$forceUpdate();
					return;
				}
				this.computedAmountTotal();
			}
		},
		computedContractTotal() {
			// 计算含税和不含税单价
			this.statementParticularList.forEach(el => {
				if (el.currentSettleQuantity) {
					el.currentSettleAvePrice = el.currentSettleAmount ? (el.currentSettleAmount / el.currentSettleQuantity).toFixed(2) : 0;
					el.currentSettleNoAvePrice = (el.currentSettleAvePrice / 1.13).toFixed(2);
				}
				if (el.index == '合计') {
					el.currentSettleAvePrice = '';
					el.currentSettleNoAvePrice = '';
				}
			});
			this.$forceUpdate();
		},
		// 判断是否两位小数
		ifTwoDecimal(rule, value, cb) {
			if (value == 0) {
				return false;
			}
			if (value) {
				if (/^\d+(\.\d{0,2})?$/.test(value)) {
					return true;
				} else {
					return false;
				}
			} else {
				cb();
			}
		},
		handleChangeQuantity(value, index, key, flag) {
			this.statementParticularList[index][key] = value;
			let particularQuantity = 0;
			let newSelectedArr = cloneDeep(this.statementParticularList);
			if (this.hasKeyInArrayOfObjects(newSelectedArr, 'transferQuantity')) {
				newSelectedArr = this.statementParticularList.slice(0, this.statementParticularList.length - 1);
			}
			newSelectedArr.map(el => {
				if (el.currentSettleQuantity) {
					el.currentSettleAvePrice = el.currentSettleAmount ? (el.currentSettleAmount / el.currentSettleQuantity).toFixed(2) : 0;
					el.currentSettleNoAvePrice = (el.currentSettleAvePrice / 1.13).toFixed(2);
				}
				if (el.index == '合计') {
					el.currentSettleAvePrice = '';
					el.currentSettleNoAvePrice = '';
				}
				particularQuantity = particularQuantity + (el.currentSettleQuantity ? el.currentSettleQuantity / 1 : 0);
			});
			this.particularQuantity = particularQuantity;
			if (['currentSettleQuantity'].includes(key)) {
				if (flag) {
					this.$forceUpdate();
					return;
				}
				this.computedTotal();
			}
		},
		getUploadFiles(data) {
			this.fileInfos = data;
		},
		// 更新索引
		updateIndex() {
			this.$nextTick(() => {
				const tempList = cloneDeep(this.statementParticularList);
				tempList.forEach((item, key) => {
					if (item.index != '合计') {
						let changeIndex = ++key;
						item.index = changeIndex;
					}
				});
				this.statementParticularList = tempList;
			});
		},
		// 添加
		addRow(index) {
			const tempIndex = index + 1;
			const tempObj = {
				index: this.statementParticularList.length,
				materialName: '',
				placeOfOrigin: '',
				currentSettleQuantity: '',
				currentSettleNoAvePrice: '',
				currentSettleAvePrice: '',
				currentSettleAmount: ''
			};
			this.statementParticularList.splice(tempIndex, 0, tempObj);
			this.updateIndex();
		},
		// 删除
		removeRow(index) {
			this.statementParticularList.forEach((el, i, arr) => {
				if (i == index) {
					arr.splice(i, 1);
				}
			});
			this.updateIndex();
		},
		// 全业务线基于货转开具结算单---下载货转附件
		downloadGoodsTransfer(url) {
			API_DOWNLPREVIEWTE(url).then(res => {
				comDownload(res, url);
			});
		},
		// 全业务线基于货转开具结算单---查看货转详情
		handleViewDetail(item) {
			let routeUrl = null;
			if (this.contract.businessType == 'OTHER_MIDDLE') {
				routeUrl = this.$router.resolve({
					path: '/center/steels/goodsTransfer/letterNotice/detail',
					query: {
						id: item.id,
						hideBack: false
					}
				});
			} else {
				routeUrl = this.$router.resolve({
					name: 'SteelsGoodsTransferApplyDetail',
					query: {
						id: item.id,
						hideBack: false
					}
				});
			}
			window.open(routeUrl?.href, '_blank');
		},
		// 判断数组对象中是否含有某个key
		hasKeyInArrayOfObjects(array, key) {
			return array.some(obj => obj.hasOwnProperty(key));
		},
		submitSettleForm(type) {
			this.settleApplyForm.validateFields(async (err, values) => {
				if (!err) {
					let nameStr = '';
					let flag = false;
					this.statementParticularList.forEach((el, i, arr) => {
						delete el.id;
						if (Number(el.currentSettleQuantity) + Number(el.settledQuantity) > el.transferQuantity) {
							flag = true;
							if (i == arr.length - 1) {
								nameStr += `${el.materialName}`;
							} else {
								nameStr += `${el.materialName}/`;
							}
						}
						el.currentSettleAmount = el.currentSettleAmount;
						el.currentSettleAvePrice = el.currentSettleAvePrice;
						el.currentSettleNoAvePrice = el.currentSettleNoAvePrice;
					});
					let newSelectedArr = this.statementParticularList;
					let currentSettleQuantityTotal = null;
					let currentSettleAmountTotal = null;
					if (this.hasKeyInArrayOfObjects(this.statementParticularList, 'transferQuantity')) {
						currentSettleQuantityTotal =
							this.statementParticularList[this.statementParticularList.length - 1]?.currentSettleQuantity;
						currentSettleAmountTotal = this.statementParticularList[this.statementParticularList.length - 1]?.currentSettleAmount;
						newSelectedArr = this.statementParticularList.slice(0, this.statementParticularList.length - 1);
					}

					if (this.fileInfos.length) {
						this.fileInfos.forEach(el => {
							el.fileId = el.fileId ? el.fileId : el.id;
						});
					}

					var bodyObj = {
						transferReleaseIds: this.transferIds, //货转列表
						amountPaidTotalPrice: values.amountPaidTotalPrice, // 已付款金额
						statementType: values.statementType, //结算单类型
						settleTime: values.settleTime,
						id: this.$route.query.statementId, //编辑 提交 id
						particularQuantity: this.particularQuantity,
						contract: this.contract, //回传合同详情
						remark: values.remark, //备注
						statementParticularList: newSelectedArr, // 结算单列表
						contractType: this.$route.query.contractType || 'SYSTEM_COLLECTION',
						generateWay: this.$route.query.generateWay || 'BUY',
						statementAttachList: this.fileInfos,
						currentSettleQuantityTotal: currentSettleQuantityTotal,
						currentSettleAmountTotal: currentSettleAmountTotal
					};
					if (type == 'submit2') {
						const Fetch = this.$route.query.type == 'edit' ? API_SteelsStatementSubmit3 : API_SteelsStatementSubmit1;
						await Fetch(bodyObj);
						this.$router.push('settleSuccess');
						return;
					}
					if (flag) {
						this.$confirm({
							centered: true,
							title: `${nameStr}本次结算数量超过货转数量，请确认后再提交`,
							okText: '确定',
							cancelText: '取消',
							onOk: async () => {
								if (type == 'preview') {
									const res = await previewStatement(bodyObj);
									this.$refs.previewModal.visible = true;
									this.$refs.previewModal.url = res.data.pdfPath;
								}

								if (type == 'save') {
									await API_SteelsStatementSave(bodyObj);
									this.$router.push('settleSuccess');
								}

								if (type == 'submit') {
									const Fetch = this.$route.query.type == 'edit' ? API_SteelsStatementSubmit3 : API_SteelsStatementSubmit1;
									await Fetch(bodyObj);
									this.$router.push('settleSuccess');
								}
							},
							onCancel() {}
						});
					} else {
						if (type == 'preview') {
							const res = await previewStatement(bodyObj);
							this.$refs.previewModal.visible = true;
							this.$refs.previewModal.url = res.data.pdfPath;
						}

						if (type == 'save') {
							await API_SteelsStatementSave(bodyObj);
							this.$router.push('settleSuccess');
						}

						if (type == 'submit') {
							const Fetch = this.$route.query.type == 'edit' ? API_SteelsStatementSubmit3 : API_SteelsStatementSubmit1;
							await Fetch(bodyObj);
							this.$router.push('settleSuccess');
						}
					}
				}
			});
		}
	},
	components: {
		PreviewModal,
		CustomUpload
	}
};
</script>

<style scoped></style>
