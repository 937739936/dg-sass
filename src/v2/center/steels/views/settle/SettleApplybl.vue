<template>
	<div>
		<div class="s-title">
			<span>新增结算单</span>
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
		<div>
			<div class="settle-apply-form">
				<a-form
					:form="settleApplyForm"
					layout="inline"
				>
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
					<!-- 合同货物明细 -->
					<div class="title"><i class="title_icon"></i>合同货物明细</div>
					<div class="table-wrap">
						<a-table
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
											:disabled="['view', 'submit', 'confirm'].includes(type)"
											@change="e => handleChangeQuantity(e.target.value, index, 'materialName')"
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
											@change="e => handleChangeQuantity(e.target.value, index, 'placeOfOrigin')"
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
					<a-row class="row textarea-wrap">
						<a-col :span="12">
							<a-form-item
								label="结算数量（吨）"
								:colon="false"
							>
								<a-input
									v-decorator="[
										'particularQuantity',
										{
											rules: [{ required: true, message: '结算数量必填' }]
										}
									]"
									style="width: 220px"
									placeholder="请输入"
								>
								</a-input>
							</a-form-item>
						</a-col>
						<a-col :span="12">
							<a-form-item
								label="总结算金额(元)"
								:colon="false"
							>
								<a-input
									v-decorator="[
										'totalSettleAmount',
										{
											rules: [{ required: true, message: '总结算金额必填' }]
										}
									]"
									style="width: 220px"
									placeholder="请输入"
								>
								</a-input>
							</a-form-item>
						</a-col>
						<a-col
							:span="12"
							style="margin-top: 20px"
						>
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
								/>
							</a-form-item>
						</a-col>
					</a-row>
					<a-row class="row textarea-wrap">
						<a-col
							:span="24"
							style="margin-top: 20px"
						>
							<a-form-item
								label="备注"
								:colon="false"
							>
								<a-textarea
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
									:ifEditable="true"
									@uploadFiles="getUploadFiles"
									:fileDataSource="fileDataSource"
									:type="customUploadType"
								/>
							</div>
						</div>
					</div>
					<div class="btn-wrap">
						<a-button @click="$router.go(-1)">返回</a-button>
						<!-- 补录没有预览 -->
						<a-button
							type="primary"
							@click="submitSettleForm()"
							>提交</a-button
						>
					</div>
				</a-form>
			</div>
		</div>
	</div>
</template>

<script>
import {
	API_SteelsStatementNextStep,
	settleImportGoodsInfo,
	getSupplStatementNextStep,
	submitSupplStatement
} from '@/v2/center/steels/api/settle.js';
import CustomUpload from '@/v2/center/steels/components/upload/CustomUpload.vue';

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
const columns = [
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
];
import { appJsColumns, noAppJsColumns } from './components/config.js';
export default {
	data() {
		return {
			settleApplyForm: this.$form.createForm(this),
			settleSelectedRowKeys: [],
			transferIds: [], //选中的货转id
			goodsTransferData: [],
			currentStep: 1,
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
			settleSelectedRowKeysGoodTransfer: [], // 选中的货转数组 Obj
			statementParticularList: [],
			numberReg: /^(\d+)(\.\d{1,4})?$/,
			contract: {},
			info: {},
			publicPath: process.env.BASE_URL,
			fileColumns,
			action: settleImportGoodsInfo,
			fileInfos: [],
			fileDataSource: [],
			columns,
			goodsTransferData: []
		};
	},
	watch: {
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
		customUploadType() {
			return 'settleAdditional';
		},
		jsColumns() {
			if (this.contract.appointSpec == 1) {
				return appJsColumns;
			}
			return noAppJsColumns;
		}
	},
	mounted() {
		this.getDetail();
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
			let fn = API_SteelsStatementNextStep;
			if (this.isAdditional) {
				fn = getSupplStatementNextStep;
			}
			const params = {
				id: this.$route.query.contractId,
				contractType: this.$route.query.contractType,
				takeDeliverSerialNos: ''
			};
			const res = await fn(params);
			// 合同明细
			let contractPurchaseList = res.data.contractPurchaseList || [];
			contractPurchaseList.forEach(el => {
				el.pieceQuantity = el.pieceQuantity || '/';
			});
			this.goodsTransferData = contractPurchaseList;
			this.contract = res.data.contract;
			this.info = res.data;
			this.settleApplyForm.setFieldsValue({
				...this.contract,
				quantity: this.contract.quantity || '-',
				transportModeDesc: this.contract.transportModeDesc,
				amountPaidTotalPrice: this.$route.query.accountPaidAmount
			});
			// 如果是不指定规格
			// if (this.contract.appointSpec == 0) {

			// }
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
		},
		getUploadFiles(data) {
			this.fileInfos = data;
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
			this.statementParticularList.map((el, i) => {
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
			//flag为true，代表可修改结算数量
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
		submitSettleForm() {
			this.settleApplyForm.validateFields(async (err, values) => {
				if (!err) {
					if (this.fileInfos.length) {
						this.fileInfos.forEach(el => {
							el.fileId = el.fileId ? el.fileId : el.id;
						});
					}

					let newSelectedArr = this.statementParticularList;
					let currentSettleQuantityTotal = null;
					let currentSettleAmountTotal = null;
					if (this.hasKeyInArrayOfObjects(this.statementParticularList, 'transferQuantity')) {
						currentSettleQuantityTotal =
							this.statementParticularList[this.statementParticularList.length - 1]?.currentSettleQuantity;
						currentSettleAmountTotal = this.statementParticularList[this.statementParticularList.length - 1]?.currentSettleAmount;
						newSelectedArr = this.statementParticularList.slice(0, this.statementParticularList.length - 1);
					}

					var bodyObj = {
						contract: this.contract, //回传合同详情
						contractId: this.contract.id,
						remark: values.remark, //备注
						contractType: 'SELL',
						generateWay: 'SELL',
						statementAttachList: this.fileInfos,
						particularQuantity: values.particularQuantity,
						totalSettleAmount: values.totalSettleAmount,
						settleTime: values.settleTime,
						statementParticularList: newSelectedArr,
						currentSettleQuantityTotal: currentSettleQuantityTotal,
						currentSettleAmountTotal: currentSettleAmountTotal
					};
					await submitSupplStatement(bodyObj);
					this.$router.push('settleSuccess');
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
.settle-apply-form {
	padding-bottom: 60px;

	.table-wrap {
		margin-bottom: 30px;

		table {
			white-space: nowrap;
		}

		.ant-table-body {
			overflow: auto;
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
			width: 220px;
		}
	}

	.range-input {
		input {
			width: 98px;
		}

		.range-text {
			display: inline-block;
			padding: 0 5px;
		}
	}

	.pay-account-wrap {
		.ant-select {
			width: 400px;
		}
	}

	.row {
		min-height: 60px;
		padding-left: 40px;
		margin: 0 !important;
	}

	/deep/ .ant-form-item-label {
		label {
			font-size: 16px;
			color: rgba(0, 0, 0, 0.75);
			width: 160px;
			white-space: normal;
			line-height: 22px;
			margin-right: 26px;
			display: inline-block;
			text-align: left;
		}
	}

	.textarea-wrap {
		textarea {
			width: 684px;
			text-align: left !important;
		}
	}

	.btn-wrap {
		margin-top: 30px;
		padding-left: 40px;

		.ant-btn {
			width: 96px;
			height: 34px;
			margin-right: 30px;
		}
	}

	.ant-form-inline .ant-form-item-with-help {
		margin: 0;
	}

	.m0 {
		margin: 0;
	}

	.has-error .ant-form-explain,
	.has-error .ant-form-split {
		white-space: nowrap;
		position: absolute;
	}

	.white-space .ant-form-item-label label {
		white-space: pre-wrap;
		line-height: 18px;
	}
	::v-deep.ant-calendar-picker-input {
		width: 220px;
	}
}
</style>
