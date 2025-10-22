<template>
	<div>
		<div class="s-title">
			<span>{{ type == 'add' ? '新增' : '' }}补录结算单</span>
		</div>
		<div class="steps-wrap">
			<a-steps :current="currentStep">
				<a-step
					v-for="item in steps"
					:key="item.title"
					:title="item.title"
				/>
			</a-steps>
		</div>
		<div class="pay-apply-form">
			<a-form layout="inline">
				<div class="title"><i class="title_icon"></i>基础信息</div>
				<a-row>
					<a-col
						:span="12"
						class="row"
					>
						<a-form-item
							label="合同编号"
							:colon="false"
							style="width: 100%"
						>
							<a-input
								style="width: 300px"
								v-model="contract.contractNo"
								disabled
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
							style="width: 100%"
						>
							<a-input
								style="width: 300px"
								v-model="contract.quantity"
								disabled
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
							style="width: 100%"
						>
							<a-input
								style="width: 300px"
								v-model="contract.steelTypeDesc"
								disabled
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
							style="width: 100%"
						>
							<a-input
								style="width: 300px"
								v-model="contract.businessTypeDesc"
								disabled
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
								style="width: 300px"
								v-model="contract.appointSpecDesc"
								disabled
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
							style="width: 100%"
						>
							<a-input
								style="width: 300px"
								v-model="contract.transportModeDesc"
								disabled
							></a-input>
						</a-form-item>
					</a-col>
				</a-row>
			</a-form>
			<a-form
				:form="settleApplyForm"
				layout="inline"
			>
				<!-- 合同货物明细 -->
				<div class="title"><i class="title_icon"></i>合同货物明细</div>
				<div class="table-wrap">
					<a-table
						:rowSelection="rowSelection"
						:columns="columns"
						:rowKey="record => record.purchaseId"
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
							<a
								href="javascript:void(0)"
								@click="downloadGoodsTransfer(item.pdfPath)"
								>下载</a
							>
						</div>
					</a-table>
				</div>
				<!-- 结算明细 -->
				<div class="title"><i class="title_icon"></i>结算信息</div>
				<a-row>
					<div class="table-wrap">
						<a-table
							:columns="jsColumns"
							:dataSource="statementParticularList"
							:scroll="{ x: true }"
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
										:disabled="['view', 'submit', 'confirm'].includes(type) || contract.appointSpec === 1"
										v-decorator="[
											`materialName${index}`,
											{
												rules: [{ required: true, message: '品名必填' }],
												initialValue: text
											}
										]"
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
										:disabled="['view', 'submit', 'confirm'].includes(type)"
										@change="e => handleChangeQuantity(e.target.value, index, 'materialTexture')"
										v-decorator="[
											`materialTexture${index}`,
											{
												rules: [{ required: true, message: '材质必填' }],
												initialValue: text
											}
										]"
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
										:disabled="['view', 'submit', 'confirm'].includes(type)"
										@change="e => handleChangeQuantity(e.target.value, index, 'specs')"
										v-decorator="[
											`specs${index}`,
											{
												rules: [{ required: true, message: '规格必填' }],
												initialValue: text
											}
										]"
									/>
								</a-form-item>
							</template>
							<!-- 产地 -->
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
										:disabled="['view', 'submit', 'confirm'].includes(type)"
										@change="e => handleChangeContract(e.target.value, index, 'placeOfOrigin')"
										v-decorator="[
											`placeOfOrigin${index}`,
											{
												rules: [{ required: true, message: '产地必填' }],
												initialValue: text
											}
										]"
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
											:disabled="['view', 'submit', 'confirm'].includes(type)"
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
										:disabled="['view', 'submit', 'confirm'].includes(type)"
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
									<a-input
										v-model.trim="record.currentSettleNoAvePrice"
										:disabled="['view', 'submit', 'confirm'].includes(type)"
									></a-input>
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
									<a-input
										v-model.trim="record.currentSettleAvePrice"
										:disabled="['view', 'submit', 'confirm'].includes(type)"
									></a-input>
								</a-form-item>
							</template>
							<template
								slot="currentSettleAmount"
								slot-scope="text, record, index"
							>
								<div v-if="record.transferQuantity == '总计'">
									<a-form-item>
										<a-input
											:disabled="['view', 'submit', 'confirm'].includes(type)"
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
										:disabled="['view', 'submit', 'confirm'].includes(type)"
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
									/>
								</a-form-item>
							</template>
							<template
								slot="action"
								slot-scope="text, record, index"
								v-if="!['view', 'submit', 'confirm'].includes(type) && index != statementParticularList.length - 1"
							>
								<span @click="addRow(index)">
									<a-icon
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
				<a-row style="margin-top: 20px">
					<!-- <a-col
						:span="12"
						class="row"
					>
						<a-form-item
							label="结算数量（吨）"
							:colon="false"
						>
							<a-input-number
								style="width: 300px"
								:min="0.0"
								:precision="2"
								:disabled="['view', 'submit', 'confirm'].includes(this.type)"
								v-decorator="[
									'particularQuantity',
									{
										rules: [{ required: true, message: '结算数量必填' }]
									}
								]"
							>
							</a-input-number>
						</a-form-item>
					</a-col> -->
					<a-col
						:span="12"
						class="row"
					>
						<a-form-item
							label="结算日期"
							:colon="false"
						>
							<a-date-picker
								type="date"
								format="YYYY-MM-DD"
								style="width: 300px"
								:disabled="['view', 'submit', 'confirm'].includes(this.type)"
								valueFormat="YYYY-MM-DD"
								placeholder="请输入"
								v-decorator="[`settleTime`, { rules: [{ required: true, message: `请输入` }] }]"
							/>
						</a-form-item>
					</a-col>
					<!-- <a-col
						:span="12"
						class="row"
					>
						<a-form-item
							label="总结算金额（元）"
							:colon="false"
						>
							<a-input-number
								:max="99999999999999"
								:precision="2"
								:disabled="['view', 'submit', 'confirm'].includes(this.type)"
								style="width: 300px"
								:min="0.0"
								v-decorator="[
									'totalSettleAmount',
									{
										rules: [{ required: true, message: '总结算金额必填' }]
									}
								]"
							>
							</a-input-number>
						</a-form-item>
					</a-col> -->
				</a-row>
				<a-row class="row textarea-wrap">
					<a-col :span="24">
						<a-form-item
							label="备注"
							:colon="false"
						>
							<a-textarea
								v-decorator="['remark']"
								:disabled="['view', 'submit'].includes(this.type)"
								placeholder="请输入内容，最多输入1000个字符"
								:maxLength="1000"
							></a-textarea>
						</a-form-item>
					</a-col>
				</a-row>
				<div class="title"><i class="title_icon"></i>附件信息</div>
				<div class="upload-wrap">
					<div class="upload-block">
						<CustomUpload
							:isNeedRotate="true"
							:columns="fileColumns"
							:ifEditable="!['view', 'submit'].includes(type)"
							@uploadFiles="getUploadFiles"
							:fileDataSource="fileDataSource"
							:type="'settleAdditional'"
						/>
					</div>
				</div>
				<div
					class="btn-wrap"
					v-if="!['view', 'confirm'].includes(type)"
				>
					<a-button @click="$router.go(-1)">返回</a-button>
					<template>
						<!-- <a-button
							v-if="!['view', 'submit'].includes(type)"
							@click="save('save')"
							>保存</a-button
						> -->
						<a-button
							type="primary"
							@click="save('submit')"
							>提交</a-button
						>
					</template>
				</div>
			</a-form>
		</div>
	</div>
</template>

<script>
import {
	API_SteelsStatementNextStep,
	getSupplStatementNextStep,
	API_SteelsStatementDetail,
	saveSupplStatement,
	submitSupplStatement
} from '@/v2/center/steels/api/settle.js';
import { cloneDeep } from 'lodash';
import CustomUpload from '@/v2/center/steels/components/upload/CustomUpload';
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
import { appJsColumns, noAppJsColumns } from './components/config.js';
export default {
	data() {
		return {
			steps: [
				{
					title: '选择合同'
				},
				{
					title: '填写结算信息'
				},
				{
					title: '完成'
				}
			],
			currentStep: 1,
			disabled: true,
			isShowGoodsValue: false,
			attachmentTypeList: [
				{
					label: '保证金打款凭证',
					value: 'DEPOSIT_PAYMENT'
				}
			],
			fileDataSource: [],
			info: { contract: {} },
			contract: {},
			fileColumns,
			settleApplyForm: this.$form.createForm(this),
			goodsTransferColumns: [
				// 货转信息table列
				{ key: 'materialName', dataIndex: 'materialName', title: '品名', with: 100 },
				{ key: 'specs', dataIndex: 'specs', title: '规格', with: 100 },
				{ key: 'materialTexture', dataIndex: 'materialTexture', title: '材质', with: 100 },
				// 产地
				{ key: 'placeOfOrigin', dataIndex: 'placeOfOrigin', title: '产地', with: 200 },
				// 件数
				{ key: 'pieceQuantity', dataIndex: 'pieceQuantity', title: '件数' },
				// 捆包号
				{ key: 'baleNo', dataIndex: 'baleNo', title: '捆包号', with: 100 },
				{ key: 'quantity', dataIndex: 'quantity', title: '重量(吨)', with: 100 },

				// 计量方式
				{ key: 'metrologyWay', dataIndex: 'metrologyWay', title: '计量方式', with: 200 }
			],
			goodsTransferColumnsBUY002: [
				// 货转信息table列
				{ key: 'materialName', dataIndex: 'materialName', title: '品名', with: 100 },
				{ key: 'specs', dataIndex: 'specs', title: '规格', with: 100 },
				{ key: 'materialTexture', dataIndex: 'materialTexture', title: '材质', with: 100 },
				// 产地
				{ key: 'placeOfOrigin', dataIndex: 'placeOfOrigin', title: '产地', with: 200 },
				{ key: 'quantity', dataIndex: 'quantity', title: '数量(吨)', with: 100 },
				{ key: 'presetUnitPrice', dataIndex: 'presetUnitPrice', title: '单价（元/吨）', with: 100 },
				{ key: 'deliveryDeadline', title: '交货期限', dataIndex: 'deliveryDeadline' },
				{ key: 'remark', title: '备注', dataIndex: 'deliveryDeadline' }
			],
			transferIds: [], //选中的货转id
			goodsTransferData: [],
			// 结算单列表
			statementParticularList: [],
			numberReg: /^(\d+)(\.\d{1,4})?$/,
			// 本次结算数量总和
			particularQuantity: 0
		};
	},
	watch: {
		contract: {
			handler(v) {
				console.log('v', v);
			}
		},
		statementParticularList: {
			handler(v) {
				if (!v || !v?.length) return;
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
	computed: {
		//  新增  add 编辑 edit  详情 view  提交 submit 确认 confirm
		type() {
			return this.$route.query.type;
		},
		rowSelection() {
			if (['view', 'submit', 'confirm'].includes(this.type)) {
				return null;
			}
			if (this.contract?.appointSpec === 0) {
				return null;
			}
			return {
				selectedRowKeys: this.transferIds,
				onChange: this.onSelectGoodsTransferChange
			};
		},
		jsColumns() {
			if (this.contract.appointSpec === 1) {
				return appJsColumns;
			}
			return noAppJsColumns;
		},
		columns() {
			if (this.$route.query.contractTemplate === 'RECEIVABLE_STEEL_BUY_002') {
				return this.goodsTransferColumnsBUY002;
			}
			return this.goodsTransferColumns;
		}
	},
	mounted() {
		this.getDetail();
		if (this.$route.query.statementId) {
			this.getEditDetail();
		} else {
			// this.getDetail()
		}
	},
	methods: {
		computedTotal(flag) {
			const numberReg = /^(\d+)(\.\d{1,4})?$/;
			const lastItem = this.statementParticularList[this.statementParticularList.length - 1];
			let currentSettleQuantity = 0;
			this.statementParticularList.forEach((el, i, arr) => {
				if (i != arr.length - 1) {
					if (el.currentSettleQuantity !== '/' && numberReg.test(el.currentSettleQuantity)) {
						currentSettleQuantity += +(el.currentSettleQuantity || 0);
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
					if (el.currentSettleAmount !== '/' && numberReg.test(el.currentSettleAmount)) {
						currentSettleAmount += +(el.currentSettleAmount || 0);
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
		async getDetail() {
			const params = {
				id: this.$route.query.contractId,
				contractType: this.$route.query.contractType,
				takeDeliverSerialNos: ''
			};
			// getSupplStatementNextStep
			// 判断是否是补录
			const fn =
				this.$route.query.generateWay == 'ARTIFICIAL_COLLECTION' ? getSupplStatementNextStep : API_SteelsStatementNextStep;

			const res = await getSupplStatementNextStep(params);
			this.info.contract = res.data.contract;
			this.contract = res.data.contract || res.data;
			// this.contract.appointSpec = 1
			this.contract.transportModeDesc = this.contract.transportModeDesc || '-';
			// 合同明细
			let contractPurchaseList = res.data.contractPurchaseList || [];
			contractPurchaseList.forEach(el => {
				el.pieceQuantity = el.pieceQuantity || '/';
			});
			this.goodsTransferData = res.data.contractPurchaseList;
			// 如果是不指定规格
			if (this.contract.appointSpec == 0) {
				this.statementParticularList = [
					{
						id: (Math.random() * 100 + 12).toFixed(0),
						purchaseId: '',
						materialName: '', //物资名称
						placeOfOrigin: '', //产地
						currentSettleQuantity: '', //本次结算数量
						currentSettleNoAvePrice: '', //本次结算不含税单价
						currentSettleAvePrice: '', //结算含税单价
						currentSettleAmount: '' //贷款价税合计
					}
				];
			}
		},
		getUploadFiles(data) {
			this.fileInfos = data;
		},
		// 获取结算单详情
		async getEditDetail() {
			const res = await API_SteelsStatementDetail({ id: this.$route.query.statementId });
			this.info = res.data;
			this.contract = res.data.contract;
			this.transferIds = res.data.contractPurchaseId || [];

			this.contract.transportModeDesc = this.contract.transportModeDesc || '-';
			this.$nextTick(() => {
				this.settleApplyForm.setFieldsValue({
					totalSettleAmount: res.data.totalSettleAmount,
					particularQuantity: res.data.particularQuantity,
					settleTime: res.data.settleTime,
					remark: res.data.remark
				});
			});
			const statementAttachList = res.data.statementAttachList || [];
			statementAttachList.forEach(el => {
				el.typeName = '线下结算单';
				el.url = el.filePath;
			});
			this.fileDataSource = statementAttachList;
			this.fileInfos = statementAttachList;

			this.statementParticularList = res.data.statementParticularList;
			this.$forceUpdate();
		},
		onSelectGoodsTransferChange(selectedRowKeys, selectedRow) {
			this.transferIds = selectedRowKeys;
			this.settleSelectedRowKeysGoodTransfer = selectedRow;
			if (!this.settleSelectedRowKeysGoodTransfer.length) {
				this.statementParticularList = [];
				return;
			}
			const list = cloneDeep(selectedRow); //
			list.forEach((el, i) => {
				const obj = {};
				obj[`currentSettleQuantity${i}`] = el.currentSettleQuantity || '';
				obj[`currentSettleAmount${i}`] = el.currentSettleAmount || '';
				obj[`materialName${i}`] = el.materialName || '';
				this.settleApplyForm.setFieldsValue(obj);
			});
			this.statementParticularList = list;
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
		//添加结算信息
		addRow(index = 0) {
			/** 判断当前必填项是否都已经填完  */
			// 校验捆包号 是否是必填
			let newSelectedArr = this.statementParticularList;
			if (this.hasKeyInArrayOfObjects(this.statementParticularList, 'transferQuantity')) {
				newSelectedArr = this.statementParticularList.slice(0, this.statementParticularList.length - 1);
			}
			const flag2 = newSelectedArr.every(el => {
				if (
					el.materialName &&
					el.placeOfOrigin &&
					el.currentSettleQuantity &&
					el.currentSettleNoAvePrice &&
					el.currentSettleAvePrice &&
					el.currentSettleAmount
				) {
					return true;
				}
			});
			if (!flag2) {
				this.$message.error('请完成当前明细的必填项');
				return;
			}
			let emptyRow = {
				id: (Math.random() * 100 + 12).toFixed(0),
				materialName: '', //物资名称
				placeOfOrigin: '', //产地
				currentSettleQuantity: '', //本次结算数量
				currentSettleNoAvePrice: '', //本次结算不含税单价
				currentSettleAvePrice: '', //结算含税单价
				currentSettleAmount: '' //贷款价税合计
			};

			this.statementParticularList.splice(index + 1, 0, emptyRow);
		},
		removeRow(index) {
			this.statementParticularList.forEach((el, i, arr) => {
				if (i == index) {
					arr.splice(i, 1);
				}
			});
		},
		// 计算单价
		handleChangeQuantity(value, index, key, flag) {
			//flag为true，代表可修改结算数量
			this.statementParticularList[index][key] = value;
			let particularQuantity = 0;
			let newSelectedArr = cloneDeep(this.statementParticularList);
			if (this.hasKeyInArrayOfObjects(newSelectedArr, 'transferQuantity')) {
				newSelectedArr = this.statementParticularList.slice(0, this.statementParticularList.length - 1);
			}
			newSelectedArr = this.statementParticularList.slice(0, this.statementParticularList.length - 1);
			newSelectedArr.map((el, i) => {
				if (el.currentSettleQuantity) {
					el.currentSettleAvePrice = el.currentSettleAmount ? (el.currentSettleAmount / el.currentSettleQuantity).toFixed(2) : 0;
					el.currentSettleNoAvePrice = (el.currentSettleAvePrice / 1.13).toFixed(2);
				} else {
					el.currentSettleAvePrice = 0;
					el.currentSettleNoAvePrice = 0;
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
		// 计算合同
		handleChangeContract(value, i, key, flag) {
			//flag为true，代表可修改货款价税合计
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
			this.statementParticularList.forEach((el, i, arr) => {
				if (el.currentSettleQuantity) {
					el.currentSettleAvePrice = el.currentSettleAmount ? (el.currentSettleAmount / el.currentSettleQuantity).toFixed(2) : 0;
					el.currentSettleNoAvePrice = (el.currentSettleAvePrice / 1.13).toFixed(2);
				} else {
					el.currentSettleAvePrice = 0;
					el.currentSettleNoAvePrice = 0;
				}
			});
			this.$forceUpdate();
		},
		// 判断数组对象中是否含有某个key
		hasKeyInArrayOfObjects(array, key) {
			return array.some(obj => obj.hasOwnProperty(key));
		},
		save(type) {
			this.settleApplyForm.validateFields(async (err, values) => {
				if (!err) {
					if (!this.fileInfos.length) {
						this.$message.error('请上传附件');
						return;
					}
					this.fileInfos.forEach(el => {
						el.fileId = el.fileId ? el.fileId : el.id;
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
					const params = {
						contractId: this.contract.id,
						id: this.$route.query.statementId || '',
						statementAttachList: this.fileInfos,
						contractPurchaseId: this.transferIds,
						statementParticularList: newSelectedArr,
						...values,
						currentSettleQuantityTotal: currentSettleQuantityTotal,
						currentSettleAmountTotal: currentSettleAmountTotal,
						particularQuantity: this.particularQuantity
					};
					if (type == 'save') {
						await saveSupplStatement(params);
						this.$message.success('操作成功');
						this.$router.go(-1);
						return;
					}
					this.$confirm({
						centered: true,
						title: `请确认结算单信息无误并提交审批？`,
						okText: '确定',
						cancelText: '取消',
						onOk: async () => {
							await submitSupplStatement(params);
							this.$message.success('操作成功');
							this.$router.go(-1);
						},
						onCancel() {}
					});
				}
			});
		}
	},
	components: {
		CustomUpload
	}
};
</script>

<style scoped lang="less">
::v-deep .ant-form-item-label label {
	font-size: 16px;
	color: rgba(0, 0, 0, 0.75);
	width: 84px;
	margin-right: 66px;
	display: inline-block;
	text-align: left;
}
.pay-apply-form {
	padding-bottom: 60px;
	.invo-box {
		display: flex;
		margin-bottom: 15px;

		.text {
			font-size: 18px;
		}
		.box-inner {
			height: 100px;
			width: 300px;
			background: #fafafa;
			margin: 20px;
			text-align: center;
			.stitle {
				margin-top: 20px;
			}
		}
	}

	.title {
		border-bottom: 1px solid #d8d8d8;
		font-size: 18px;
		padding: 14px 0;
		margin-bottom: 30px;

		.title_icon {
			width: 12px;
			height: 16px;
			display: inline-block;
			vertical-align: middle;
			margin: 0 14px;
			background: url(~assets/imgs/menu/titleIcon.png) no-repeat right center;
		}
	}

	.ant-form-item-control {
		input {
			width: 150px;
		}

		.ant-select {
			width: 100px;
		}
	}

	.pay-account-wrap {
		.ant-select {
			width: 420px;
		}
	}

	.row {
		padding-left: 30px;
		height: 60px;
		.detail-wrapper {
			width: fit-content;
			position: absolute;
			top: 10px;
			right: 0px;
		}
		::v-deep.has-error,
		.has-success {
			.ant-form-explain {
				position: absolute;
			}
		}
	}

	.ant-form-item-label {
		label {
			font-size: 16px;
			color: rgba(0, 0, 0, 0.75);
			width: 84px;
			margin-right: 66px;
			display: inline-block;
			text-align: left;
		}
	}

	.textarea-wrap {
		textarea {
			width: 704px;
			text-align: left !important;
		}
	}

	.hidden-wrap {
		margin-bottom: 30px;
	}

	.add-wrap {
		width: 100%;
		margin-top: 30px;
		background: #f9f9f9;
		border-top: 1px dashed #ddd;
		border-bottom: 1px dashed #ddd;
		text-align: center;
		padding: 10px 0;

		i {
			font-size: 20px;
			display: inline-block;
			vertical-align: middle;
			margin-right: 10px;
			position: relative;
			top: -2px;
		}

		&:hover {
			opacity: 0.8;
			cursor: pointer;
		}
	}

	.ant-form-inline .ant-form-item-with-help {
		margin: 0;
	}

	th[key='selection-column'] {
		span {
			display: none;
		}
	}
}

.modal-invoice-info {
	width: 80% !important;

	.search-btn {
		margin-right: 10px;
	}
}
::v-deep.ant-calendar-picker {
	width: 240px;
}
</style>
<style lang="less">
.oa-wrapper {
	padding: 20px;
}
.anticon-exclamation-circle {
	font-size: 20px;
	color: @primary-color;
	cursor: pointer;
	position: relative;
	left: 10px;
	top: 2px;
}
.bgc_tooltip {
	.ant-tooltip-inner {
		background: #fff;
		color: #333;
	}
	.ant-tooltip {
		color: #fff;
	}
	.ant-tooltip-arrow::before {
		background-color: #fff;
	}
}
.edit-btn {
	color: @primary-color;
}
</style>
