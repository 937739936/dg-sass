<template>
	<div>
		<div class="settle-apply-form">
			<a-form
				:form="settleApplyForm"
				layout="inline"
			>
				<template>
					<div class="title"><i class="title_icon"></i>提单信息</div>
					<div class="table-wrap">
						<a-table
							:columns="billColumns"
							:rowSelection="rowSelection"
							:rowKey="record => record.serialNo"
							:dataSource="billList"
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
									@click="goTakeOrder(item)"
									>查看</a
								>
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
								v-decorator="['transportMode']"
							></a-input>
						</a-form-item>
					</a-col>
				</a-row>
				<div
					class="title"
					style="display: flex; justify-content: space-between; align-items: center"
				>
					<div><i class="title_icon"></i>结算信息</div>
					<div style="display: flex; align-items: center">
						<a
							:href="publicPath + 'files/货物明细模板（结算单）.xlsx'"
							v-if="!btnDisabled"
							class="downloadTemplate"
							style="margin-right: 10px; font-size: 10px"
							>模板下载</a
						>
						<a-button
							type="link"
							v-else
							@click="downloadTemplate"
							class="downloadTemplate"
							style="font-size: 10px"
							>模板下载</a-button
						>
						<FileUpload
							:action="action"
							:btnDisabled="btnDisabled"
							:paramsData="paramsData"
							@uploadFiles="getUploadFiles2"
						></FileUpload>
					</div>
				</div>
				<a-row>
					<div class="table-wrap">
						<a-table
							:columns="jsColumns"
							:dataSource="statementList"
							:scroll="{ x: true }"
							:pagination="false"
							:locale="{ emptyText: '暂无数据' }"
						>
							<!-- 规格 -->
							<template
								slot="specs"
								slot-scope="text, record, index"
							>
								<a-form-item
									:colon="false"
									v-if="record.transferQuantity !== '总计'"
								>
									<a-input
										style="margin: -5px 0"
										@blur="e => handleChange(e.target.value, index, 'specs')"
										v-decorator="[
											`specs${index}`,
											{
												rules: [{ required: true, message: '请输入规格' }],
												initialValue: text
											}
										]"
									/>
								</a-form-item>
							</template>
							<!-- 材质 -->
							<template
								slot="materialTexture"
								slot-scope="text, record, index"
							>
								<a-form-item
									:colon="false"
									v-if="record.transferQuantity !== '总计'"
								>
									<a-input
										style="margin: -5px 0"
										@blur="e => handleChange(e.target.value, index, 'materialTexture')"
										v-decorator="[
											`materialTexture${index}`,
											{
												rules: [{ required: true, message: '请输入材质' }],
												initialValue: text
											}
										]"
									/>
								</a-form-item>
							</template>
							<!-- 实提数量 -->
							<template
								slot="realTakeQuantity"
								slot-scope="text, record, index"
							>
								<div v-if="record.transferQuantity == '总计'">{{ text }}</div>
								<a-form-item
									:colon="false"
									v-else
								>
									<a-input-number
										:min="1"
										style="margin: -5px 0"
										@blur="e => handleChange(e.target.value, index, 'realTakeQuantity')"
										v-decorator="[
											`realTakeQuantity${index}`,
											{
												rules: [
													{ required: true, message: '实提数量必填' },
													{ pattern: numberReg, message: '请输入数字，最多三位小数' }
												],
												initialValue: text
											}
										]"
									/>
								</a-form-item>
							</template>
							<!-- 单价 -->
							<template
								slot="unitPrice"
								slot-scope="text, record, index"
							>
								<div v-if="record.transferQuantity == '总计'">{{ text }}</div>
								<a-form-item
									:colon="false"
									v-else
								>
									<a-input
										style="margin: -5px 0"
										:maxLength="14"
										@blur="e => handleChange(e.target.value, index, 'unitPrice')"
										v-decorator="[
											`unitPrice${index}`,
											{
												rules: [
													{ required: true, message: '单价必填' },
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
							<!-- 操作 -->
							<template
								slot="action"
								slot-scope="text, record, index"
								v-if="index != statementList.length - 1"
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
				<div class="title"><i class="title_icon"></i>合同信息</div>
				<a-row>
					<div class="table-wrap">
						<a-table
							:columns="contractColumns"
							:dataSource="contractList"
							:pagination="false"
							:locale="{ emptyText: '暂无数据' }"
						>
							<template
								slot="currentSettleAmount"
								slot-scope="text, record, index"
							>
								<div v-if="record.transferQuantity == '总计'">{{ text }}</div>
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
									/>
								</a-form-item>
							</template>
							<!-- 物料描述 -->
							<template
								slot="materialName"
								slot-scope="text, record, index"
							>
								<a-form-item
									:colon="false"
									v-if="record.transferQuantity !== '总计'"
								>
									<a-input
										style="margin: -5px 0"
										@blur="e => handleChangeContract(e.target.value, index, 'materialName')"
										v-decorator="[
											`materialName${index}`,
											{
												rules: [{ required: true, message: '请输入物料描述' }],
												initialValue: text
											}
										]"
									/>
								</a-form-item>
							</template>
							<!-- 实提数量 -->
							<template
								slot="realTakeQuantity"
								slot-scope="text, record, index"
							>
								<div v-if="record.transferQuantity == '总计'">{{ text }}</div>
								<a-form-item
									:colon="false"
									v-else
								>
									<a-input-number
										:min="0"
										style="margin: -5px 0"
										@blur="e => handleChangeContract(e.target.value, index, 'realTakeQuantity')"
										v-decorator="[
											`conRealTakeQuantity${index}`,
											{
												rules: [
													{ required: true, message: '请输入实提数量' },
													{ pattern: numberReg, message: '请输入数字，最多三位小数' }
												],
												initialValue: text
											}
										]"
									/>
								</a-form-item>
							</template>
						</a-table>
					</div>
				</a-row>
				<a-row class="row textarea-wrap">
					<a-col :span="24">
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
								:type="'settle'"
							/>
						</div>
					</div>
				</div>
				<div class="btn-wrap">
					<a-button @click="$router.go(-1)">返回</a-button>
					<!-- <a-button @click="save('save')">保存</a-button> -->
					<a-button
						type="primary"
						@click="save('preview')"
						>提交</a-button
					>
				</div>
			</a-form>
		</div>
		<PreviewModal
			ref="previewModal"
			@save="save('submit')"
		></PreviewModal>
	</div>
</template>

<script>
import {
	getTakeDeliverIng,
	settleImportGoodsInfo,
	exportSettleTpl,
	API_SteelsStatementSave,
	API_SteelsStatementSubmit1,
	previewStatement,
	API_SteelsStatementNextStep
} from '@/v2/center/steels/api/settle.js';
import PreviewModal from './PreviewModal.vue';
import FileUpload from '@/v2/center/steels/components/upload/FileUpload.vue';
const jsColumns = [
	{
		title: '序号',
		dataIndex: 'index',
		key: 'index',
		align: 'center',
		customRender: function (t, r, index) {
			return r.transferQuantity != '总计' ? parseInt(index) + 1 : '总计';
		}
	},
	{
		title: '品名',
		dataIndex: 'materialName'
	},
	{
		title: '规格',
		dataIndex: 'specs',
		scopedSlots: {
			customRender: 'specs'
		}
	},
	{
		title: '材质',
		dataIndex: 'materialTexture',
		scopedSlots: {
			customRender: 'materialTexture'
		}
	},
	{
		title: '产地',
		dataIndex: 'placeOfOrigin'
	},
	{
		title: '结算单实提数量（吨）',
		dataIndex: 'realTakeQuantity',
		scopedSlots: {
			customRender: 'realTakeQuantity'
		}
	},
	{
		title: '单价（元）',
		dataIndex: 'unitPrice',
		scopedSlots: {
			customRender: 'unitPrice'
		}
	},
	{
		title: '金额',
		dataIndex: 'mount'
	},
	{ title: '操作', dataIndex: 'action', key: 'action', fixed: 'right', scopedSlots: { customRender: 'action' }, width: 100 }
];
const billColumns = [
	{
		title: '提单号',
		dataIndex: 'serialNo'
	},
	{
		title: '提单开具时间',
		dataIndex: 'issueDate'
	},
	{
		title: '状态',
		dataIndex: 'statusDesc'
	},
	{
		title: '提单申请数量（吨）',
		dataIndex: 'quantityTotal'
	},
	{
		title: '实提数量（吨）',
		dataIndex: 'totalRealTakeQuantity'
	},
	{
		title: '操作',
		dataIndex: 'action',
		scopedSlots: {
			customRender: 'action'
		}
	}
];
const contractColumns = [
	{
		title: '序号',
		dataIndex: 'index',
		key: 'index',
		align: 'center',
		customRender: function (t, r, index) {
			return r.transferQuantity != '总计' ? parseInt(index) + 1 : '总计';
		}
	},
	{
		title: '物料描述',
		dataIndex: 'materialName',
		scopedSlots: {
			customRender: 'materialName'
		}
	},
	{
		title: '产地',
		dataIndex: 'placeOfOrigin'
	},
	{
		title: '实提数量(吨)',
		dataIndex: 'realTakeQuantity',
		scopedSlots: {
			customRender: 'realTakeQuantity'
		}
	},
	{
		title: '结算不含税单价（元）',
		dataIndex: 'currentSettleNoAvePrice'
	},
	{
		title: '结算含税单价（元）',
		dataIndex: 'currentSettleAvePrice'
	},
	{
		title: '货款价税合计',
		dataIndex: 'currentSettleAmount',
		scopedSlots: {
			customRender: 'currentSettleAmount'
		}
	}
];
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
import CustomUpload from '@/v2/center/steels/components/upload/CustomUpload.vue';
import comDownload from '@sub/utils/comDownload.js';
export default {
	props: {
		info: {
			default: () => {}
		},
		contract: {}
	},
	computed: {
		rowSelection() {
			const that = this;
			return {
				selectedRowKeys: this.receiveIds,
				onChange: (selectedRowKeys, selectedRows) => {
					that.selectList = selectedRows;
					that.receiveIds = selectedRowKeys;
					// 是否是勾选
					this.getOtherInfo(selectedRowKeys, true);
				},
				getCheckboxProps: record => ({
					props: {
						disabled: record.beAssociated
					}
				})
			};
		},
		/** 是否指定规格 */
		// 判断是否是建材 并且未指定规格
		isSpecial() {
			return this.contract.steelType !== 'SCRAP_STEEL' && this.contract.appointSpec == 1;
		},
		btnDisabled() {
			return this.receiveIds.length != 0;
		},
		paramsData() {
			return {
				contractId: this.$route.query.contractId,
				takeDeliverSerialNos: this.receiveIds.join(',')
			};
		}
	},
	data() {
		return {
			jsColumns,
			billColumns,
			fileColumns,
			statementList: [],
			billList: [],
			contractColumns,
			contractList: [],
			settleApplyForm: this.$form.createForm(this),
			modalPdfIsShow: false,
			pdfUrl: '',
			receiveIds: [],
			numberReg: /^(\d+)(\.\d{1,3})?$/,
			selectList: [],
			publicPath: process.env.BASE_URL,
			action: settleImportGoodsInfo,
			fileInfos: [],
			fileDataSource: []
		};
	},
	watch: {
		info: {
			handler(val) {
				const info = JSON.parse(JSON.stringify(val)) || {};
				this.billList = info.takeDeliveries || [];
				/** 判断是修改 */
				if (this.$route.query.statementId) {
					this.selectList = this.billList.filter(el => el.detailCheck);
					this.receiveIds = [];
					this.billList.forEach(el => {
						if (el.detailCheck) {
							this.receiveIds.push(el.serialNo);
						}
					});
					this.computedOtherInfo(info);
					const statementAttachList = info.statementAttachList || [];
					statementAttachList.forEach(el => {
						el.typeName = '货物变更佐证材料';
						el.url = el.filePath;
					});
					this.fileDataSource = statementAttachList;
					this.fileInfos = statementAttachList;
				}
			},
			deep: true,
			immediate: true
		},
		contract: {
			handler(val) {
				// 更新合同信息
				this.$nextTick(() => {
					this.settleApplyForm.setFieldsValue({
						contractNo: val.contractNo,
						quantity: val.quantity,
						transportMode: val.transportModeDesc,
						remark: this.info.remark,
						appointSpecDesc: val.appointSpecDesc,
						businessTypeDesc: val.businessTypeDesc,
						steelTypeDesc: val.steelTypeDesc
					});
				});
			},
			deep: true,
			immediate: true
		}
	},
	methods: {
		// 计算结算单12
		handleChange(value, i, key) {
			const item = this.statementList[i];
			item[key] = value;
			/** 计算金额  */
			// 当key 是实提数量的时候
			if (item.realTakeQuantity && item.unitPrice) {
				item.mount = (item.realTakeQuantity * item.unitPrice).toFixed(2);
			}
			this.computedSettleTotal();
			this.$forceUpdate();
		},
		computedSettleTotal() {
			// 计算所有的实提数量和  金额
			const lastItem = this.statementList[this.statementList.length - 1];
			// 计算总数量
			let totalNum = 0,
				totalMoney = 0,
				quantity = 0,
				applyQuantity = 0;

			this.statementList.forEach((el, i, arr) => {
				if (i != arr.length - 1) {
					totalNum += +(el.realTakeQuantity || 0);
					totalMoney += +(el.mount || 0);
					quantity += +(el.quantity || 0);
					applyQuantity += +(el.applyQuantity || 0);
				}
			});
			lastItem.realTakeQuantity = totalNum.toFixed(3);
			lastItem.mount = totalMoney.toFixed(2);
			lastItem.quantity = quantity.toFixed(3);
			lastItem.applyQuantity = applyQuantity.toFixed(3);
			this.$forceUpdate();
		},
		// 计算合同
		handleChangeContract(value, i, key) {
			const item = this.contractList[i];
			item[key] = value;
			// 计算所有的实提数量和  金额
			this.computedContractTotal();
		},
		computedContractTotal() {
			const lastItem = this.contractList[this.contractList.length - 1];
			// 计算总数量
			let realTakeQuantity = 0,
				currentSettleAmount = 0;
			/** 获取总共的提单数量 */
			this.contractList.forEach((el, i, arr) => {
				if (i != arr.length - 1) {
					el.currentSettleAvePrice = el.currentSettleAmount
						? (el.currentSettleAmount / (el.realTakeQuantity || 1)).toFixed(2)
						: 0;
					el.currentSettleNoAvePrice = (el.currentSettleAvePrice / 1.13).toFixed(2);
					realTakeQuantity += +(el.realTakeQuantity || 0);
					currentSettleAmount += +(el.currentSettleAmount || 0);
				}
			});
			lastItem.realTakeQuantity = realTakeQuantity.toFixed(3);
			lastItem.currentSettleAmount = currentSettleAmount.toFixed(2);
			this.$forceUpdate();
		},
		// 去往提单
		goTakeOrder(item) {
			let path = '/center/take/order/step';
			if (item.issueMode == 'CONTRACT') {
				path = '/center/take/order/contract/stepTwo';
			}
			this.$router.push({
				path,
				query: {
					contractId: this.contract.id,
					serialNo: item.applyTakeSerialNo,
					id: item.serialNo,
					num: item.id,
					type: 'preview'
				}
			});
		},
		// 获取提单相关的结算信息 和 合同信息
		async getOtherInfo(takeDeliverSerialNos) {
			const params = {
				id: this.$route.query.contractId,
				contractType: this.$route.query.contractType,
				takeDeliverSerialNos: takeDeliverSerialNos.join()
			};
			const res = await API_SteelsStatementNextStep(params);
			const info = res.data;
			this.computedOtherInfo(info, true);
		},
		computedOtherInfo(info, flag) {
			// 结算单
			this.statementList = [];

			this.statementList = info.statementTakeDeliverDetails || [];
			this.statementList.forEach((el, index) => {
				if (this.isSpecial) {
					el.mainId = `${el.materialName}${el.specs}${el.materialTexture}${el.placeOfOrigin}`;
				} else {
					el.mainId = `${el.materialName}${el.materialTexture}${el.placeOfOrigin}`;
				}

				if (!this.$route.query.statementId) {
					el.applyQuantity = el.realTakeQuantity;
				}
				const obj = {};
				/** 用户重新勾选 */
				/** 区分修改和新增 */
				if (this.$route.query.statementId && !flag) {
					obj[`realTakeQuantity${index}`] = el.realTakeQuantity || '';
					obj[`unitPrice${index}`] = el.unitPrice;
					obj[`specs${index}`] = el.specs;
					obj[`materialTexture${index}`] = el.materialTexture;
				} else {
					obj[`realTakeQuantity${index}`] = el.realTakeQuantity || '';
					obj[`unitPrice${index}`] = '';
					obj[`specs${index}`] = el.specs;
					obj[`materialTexture${index}`] = el.materialTexture;
				}

				this.$nextTick(() => {
					this.settleApplyForm.setFieldsValue(obj);
				});
			});
			this.$nextTick(() => {
				if (this.statementList.length) {
					this.statementList.push({ transferQuantity: '总计' });
					// 计算总计
					this.computedSettleTotal();
				}
			});

			// 合同信息列表
			this.contractList = [];
			this.contractList = info.statementContractRels || [];
			this.contractList.forEach((el, index) => {
				const obj = {};
				if (this.isSpecial) {
					el.mainId = `${el.material}${el.specs}${el.materialTexture}${el.placeOfOrigin}`;
				} else {
					el.mainId = `${el.material}${el.materialTexture}${el.placeOfOrigin}`;
				}
				// 区分修改和新增
				if (this.$route.query.statementId) {
					obj[`currentSettleAmount${index}`] = el.currentSettleAmount;
					obj[`materialName${index}`] = el.materialName;
					obj[`conRealTakeQuantity${index}`] = el.realTakeQuantity;
				} else {
					obj[`currentSettleAmount${index}`] = '';
					obj[`materialName${index}`] = el.materialName;
					obj[`conRealTakeQuantity${index}`] = el.realTakeQuantity;
				}
				this.$nextTick(() => {
					this.settleApplyForm.setFieldsValue(obj);
				});
			});
			if (this.contractList.length) {
				this.contractList.push({ transferQuantity: '总计' });
				// 计算总计
				this.computedContractTotal();
			}
		},
		/** 添加结算信息 */
		addRow(index) {
			const lastItem = this.statementList[this.statementList.length - 2];
			this.statementList.splice(-1, 0, JSON.parse(JSON.stringify(lastItem)));
			this.computedSettleTotal();
		},
		// 删除结算信息
		removeRow(index) {
			this.statementList.splice(index, 1);
		},
		getUploadFiles(data) {
			this.fileInfos = data;
		},
		async save(type) {
			this.settleApplyForm.validateFields(async (err, values) => {
				if (!err) {
					// 校验实提数量不能为0
					if (!this.statementList.length || !this.contractList.length) {
						this.$message.error('实提数量总和不能为0，请再次确认后提交');
						return;
					}
					if (!this.receiveIds.length) {
						this.$message.error('请勾选提单信息');
						return;
					}

					// realTakeQuantity
					// 实提数量
					let total = 0;
					// 结算基恩
					let settleAmount = 0;
					this.statementList.forEach((el, i, arr) => {
						total += el.realTakeQuantity || 0;
						if (i != arr.length - 1) {
							settleAmount += Number(el.realTakeQuantity * el.unitPrice);
						}
					});
					if (total <= 0) {
						this.$message.error('实提数量总和不能为0，请再次确认后提交');
						return;
					}

					// 结算信息中所有钢材品类金额合计 = 合同信息中所有钢材品类货款价税合计金额
					let currentSettleAmount = 0;
					this.contractList.forEach((el, i, arr) => {
						if (i != arr.length - 1) {
							currentSettleAmount += Number(el.currentSettleAmount);
						}
					});
					if (settleAmount.toFixed(1) != currentSettleAmount.toFixed(1)) {
						this.$message.error(
							`结算信息总金额：${settleAmount.toFixed(1)} ≠ 合同信息价税合计总结额：${currentSettleAmount.toFixed(1)}，请再次确认！`
						);
						return;
					}
					if (this.fileInfos.length && this.fileInfos.length >= 2) {
						this.$message.error('只能最多上传一个附件');
						return;
					}
					this.fileInfos.forEach(el => {
						el.fileId = el.fileId ? el.fileId : el.id;
					});
					/**校验结算信息 四要素不能相同 */
					const tplList = JSON.parse(JSON.stringify(this.statementList));
					const newList = tplList.splice(1, this.statementList.length - 1);
					const mapNewList = newList.map(el => `${el.materialName}${el.specs}${el.materialTexture}${el.placeOfOrigin}`);
					const repeatList = Array.from(new Set(mapNewList));
					if (mapNewList.length != repeatList.length) {
						this.$message.error('结算信息品名规格材质产地不能重复');
						return;
					}

					// 校验在途
					const res = await getTakeDeliverIng(this.$route.query.contractNo);
					if (res.data && res.data.length) {
						const item = res.data[0];
						this.$message.error(`${item.serialNo}提单尚未完结，请先作废/完成提单`);
						return;
					}
					// 获取统计
					const lastItem = this.statementList[this.statementList.length - 1];
					const lastContractItem = this.contractList[this.contractList.length - 1];
					const params = {
						takeDeliveries: this.selectList,
						statementAttachList: this.fileInfos,
						statementTakeDeliverDetails: [...this.statementList],
						statementContractRels: [...this.contractList],
						// 结算-合同总数量
						takeDeliverTotalQuantity: lastItem.quantity,
						// 结算-提单总数量
						takeDeliverApplyTotalQuantity: lastItem.applyQuantity,
						// 结算-实提总数量
						realTakeTotalQuantity: lastItem.realTakeQuantity,
						// 结算-金额
						takeDeliverApplySettleAmount: lastItem.mount,
						//  合同-实提总数量
						contractRealTakeTotalQuantity: lastContractItem.realTakeQuantity,
						// 合同 -金额
						totalSettleAmount: lastContractItem.currentSettleAmount,
						remark: values.remark, //备注
						contractType: this.$route.query.contractType || 'BUY',
						generateWay: this.$route.query.generateWay || 'SYSTEM_COLLECTION',
						contract: this.contract, //回传合同详情
						statementAttachList: this.fileInfos
					};
					if (this.$route.query.statementId) {
						params.id = this.$route.query.statementId;
					}
					// 删除总计
					params.statementTakeDeliverDetails.splice(-1, 1);
					params.statementContractRels.splice(-1, 1);
					if (type == 'save') {
						await API_SteelsStatementSave(params);
						this.$message.success('操作成功');
						this.$router.go(-1);
					}
					if (type == 'submit') {
						await API_SteelsStatementSubmit1(params);
						this.$message.success('操作成功');
						this.$router.go(-1);
					}
					if (type == 'preview') {
						const res = await previewStatement(params);
						this.$refs.previewModal.visible = true;
						this.$refs.previewModal.url = res.data.pdfPath;
					}
				}
			});
		},
		getUploadFiles2(data) {
			this.statementList = data || [];
			this.statementList.forEach((el, index) => {
				const obj = {};
				obj[`realTakeQuantity${index}`] = el.realTakeQuantity || '';
				obj[`unitPrice${index}`] = el.unitPrice;
				obj[`specs${index}`] = el.specs;
				obj[`materialTexture${index}`] = el.materialTexture;
				this.$nextTick(() => {
					this.settleApplyForm.setFieldsValue(obj);
				});
			});
			this.statementList.push({ transferQuantity: '总计' });
			this.computedSettleTotal();
		},
		// 下载模板
		async downloadTemplate() {
			const params = {
				takeDeliverSerialNos: this.receiveIds.join(),
				contractId: this.$route.query.contractId
			};
			const res = await exportSettleTpl(params);
			comDownload(res, undefined, '货物明细模板（结算单）.xlsx');
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

		// 判断正整数
		ifInteger(rule, value, cb) {
			if (value) {
				if (/^[0-9]+$/.test(value)) {
					return true;
				} else {
					return false;
				}
			} else {
				cb();
			}
		},
		ifTwelveDecimal(value) {
			if (/^\d+(\.\d{0,12})?$/.test(value)) {
				return true;
			} else {
				return false;
			}
		},
		ifThreeDecimal(value) {
			if (/^(\d+)(\.\d{1,3})?$/.test(value)) {
				return true;
			} else {
				return false;
			}
		},
		ifTwoDecimalNegative(value) {
			if (/^(-?)\d+(\.\d{0,2})?$/.test(value)) {
				return true;
			} else {
				return false;
			}
		}
	},
	components: {
		PreviewModal,
		FileUpload,
		CustomUpload
	}
};
</script>

<style scoped lang="less"></style>
