<template>
	<div class="settle-apply-form">
		<a-form
			:form="settleApplyForm"
			layout="inline"
		>
			<template>
				<div class="title"><i class="title_icon"></i>货转信息</div>
				<div class="table-wrap">
					<a-table
						:rowSelection="{ selectedRowKeys: transferIds, onChange: onSelectGoodsTransferChange }"
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
							<a
								href="javascript:void(0)"
								@click="downloadGoodsTransfer(item.pdfPath)"
								>下载</a
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
						label="运输方式"
						:colon="false"
					>
						<a-input
							disabled
							v-decorator="['transportMode']"
						></a-input>
					</a-form-item>
				</a-col>
				<a-col
					:span="12"
					class="row"
				>
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
						>
							<a-select-option value="PRE_STAT">预结算单</a-select-option>
							<a-select-option value="STAT">结算单</a-select-option>
						</a-select>
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
							slot="currentSettleQuantity"
							slot-scope="text, record, index"
						>
							<div v-if="record.transferQuantity == '总计'">{{ text }}</div>
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
									@change="e => handleChangeQuantity(e.target.value, index)"
								/>
							</a-form-item>
						</template>
						<template
							slot="currentSettleAmount"
							slot-scope="text, record, index"
						>
							<div v-if="record.transferQuantity == '总计'">
								{{ text }}
							</div>
							<a-form-item
								:colon="false"
								v-else
							>
								<a-input
									style="margin: -5px 0"
									v-decorator="[
										`currentSettleAmount${index}`,
										{
											rules: [
												{ required: true, message: '结算金额必填' },
												{
													validator: ifTwoDecimal,
													message: '请输入2位小数'
												}
											],
											initialValue: text
										}
									]"
									@change="e => handleChangeAmount(e.target.value, index)"
								/>
							</a-form-item>
						</template>
					</a-table>
				</div>
			</a-row>
			<a-row class="row textarea-wrap">
				<a-col :span="12">
					<a-form-item
						label="总结算金额（元）"
						:colon="false"
					>
						<a-input
							v-decorator="[
								'totalSettleAmount',
								{
									initialValue: '0.00'
								}
							]"
							disabled
						></a-input>
					</a-form-item>
				</a-col>
				<a-col :span="12">
					<a-form-item
						label="已付款金额（元）"
						:colon="false"
					>
						<a-input
							v-decorator="[
								'amountPaidTotalPrice',
								{
									initialValue: '0.00'
								}
							]"
							disabled
						></a-input>
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
							v-decorator="['remark']"
							placeholder="请输入内容，最多输入1000个字符"
							:maxLength="1000"
						></a-textarea>
					</a-form-item>
				</a-col>
			</a-row>
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
	API_SteelsStatementDetailParticular,
	API_SteelsStatementDetail,
	previewStatement,
	API_SteelsStatementSave,
	API_SteelsStatementSubmit1,
	API_SteelsStatementSubmit3
} from '@/v2/center/steels/api/settle.js';
import comDownload from '@sub/utils/comDownload.js';
import PreviewModal from './PreviewModal.vue';
export default {
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
					title: '货转编号',
					dataIndex: 'transferNo'
				},
				{
					title: '货转开具时间',
					dataIndex: 'createdDate'
				},
				{
					title: '货转数量（吨）',
					dataIndex: 'transferQuantity'
				},
				{
					title: '运输方式',
					dataIndex: 'transportMode',
					customRender: text => {
						return filterCodeByValueName(text, 'transportMode');
					}
				},
				{
					title: '状态',
					dataIndex: 'status',
					customRender: text => {
						return filterCodeByValueName(text, 'goodsTransferStatus');
					}
				},
				{
					title: '操作',
					dataIndex: 'action',
					scopedSlots: {
						customRender: 'action'
					}
				}
			],
			jsColumns: [
				// 货转信息table列
				{
					title: '序号',
					dataIndex: 'index',
					key: 'index',
					align: 'center',
					customRender: function (t, r, index) {
						return r.transferQuantity != '总计' ? parseInt(index) + 1 : '';
					}
				},
				{
					title: '品种',
					dataIndex: 'materialName'
				},
				{
					title: '货转总数量（吨）',
					dataIndex: 'transferQuantity'
				},
				{
					title: '已结算数量（吨）',
					dataIndex: 'settledQuantity'
				},
				{
					title: '已结算金额（元）',
					dataIndex: 'settledAmount'
				},
				{
					title: '本次结算数量（吨）',
					dataIndex: 'currentSettleQuantity',
					scopedSlots: {
						customRender: 'currentSettleQuantity'
					}
				},
				{
					title: '本次结算金额（元）',
					dataIndex: 'currentSettleAmount',
					scopedSlots: {
						customRender: 'currentSettleAmount'
					}
				},
				{
					title: '本次结算单价（元/吨）',
					dataIndex: 'currentSettleAvePrice'
				}
			],
			particularQuantity: 0, // 本次结算数量总和
			settleSelectedRowKeysGoodTransfer: [], // 选中的货转数组 Obj
			statementParticularList: [],
			numberReg: /^(\d+)(\.\d{1,4})?$/,
			contract: {},
			info: {}
		};
	},
	mounted() {
		if (this.$route.query.statementId) {
			this.getEditDetail();
		} else {
			this.getDetail();
		}
	},
	methods: {
		// 首次开具回显详情
		async getDetail() {
			const res = await API_SteelsStatementNextStep({
				id: this.$route.query.contractId,
				contractType: this.$route.query.contractType,
				takeDeliverSerialNos: ''
			});
			this.goodsTransferData = res.data.goodsTransferList;
			this.contract = res.data.contract;
			this.info = res.data;
			this.settleApplyForm.setFieldsValue({
				...this.contract,
				quantity: this.contract.quantity || '-',
				transportMode: '汽运',
				amountPaidTotalPrice: this.$route.query.accountPaidAmount
			});
		},
		async getEditDetail() {
			const res = await API_SteelsStatementDetail({ id: this.$route.query.statementId });
			this.info = res.data;
			let amountPaidTotalPrice = res.data.amountPaidTotalPrice;
			this.statementParticularList = res.data.statementParticularList;
			res.data.goodsTransferList.map(i => {
				this.transferIds.push(i.id);
			});
			this.contract = res.data.contract;
			this.particularQuantity = res.data.particularQuantity;
			const nextRes = await API_SteelsStatementNextStep({ id: this.contract.id, takeDeliverSerialNos: '' });
			this.goodsTransferData = nextRes.data.goodsTransferList;
			this.$nextTick(() => {
				this.settleApplyForm.setFieldsValue({
					totalSettleAmount: res.data.totalSettleAmount,
					statementType: res.data.type,
					remark: res.data.remark,
					amountPaidTotalPrice,
					...this.contract,
					quantity: this.contract.quantity || '-',
					transportMode: '汽运'
				});
			});
		},
		onSelectGoodsTransferChange(selectedRowKeys, selectedRow) {
			this.transferIds = selectedRowKeys;
			if (selectedRowKeys.length) {
				this.settleSelectedRowKeysGoodTransfer = [].concat(selectedRow);
			} else {
				this.settleSelectedRowKeysGoodTransfer = [];
			}
			if (!this.settleSelectedRowKeysGoodTransfer.length) {
				this.statementParticularList = [];
				this.settleApplyForm.setFieldsValue({
					totalSettleAmount: null
				});
				return;
			}

			API_SteelsStatementDetailParticular({
				transferList: this.transferIds,
				contractId: this.contract.id
			}).then(res => {
				res.data.forEach((el, i) => {
					const obj = {};
					obj[`currentSettleQuantity${i}`] = '';
					obj[`currentSettleAmount${i}`] = '';
					obj[`currentSettleNumber${i}`] = '';
					obj[`currentSettleAvePrice${i}`] = '';
					this.settleApplyForm.setFieldsValue(obj);
				});
				this.statementParticularList = res.data;
				this.$forceUpdate();
			});
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
		handleChangeQuantity(value, index) {
			this.statementParticularList[index].currentSettleQuantity = value;
			if (this.statementParticularList[index].currentSettleAmount) {
				this.statementParticularList[index].currentSettleAvePrice = (
					this.statementParticularList[index].currentSettleAmount / this.statementParticularList[index].currentSettleQuantity
				).toFixed(2);
			}

			let particularQuantity = 0;
			this.statementParticularList.map(i => {
				particularQuantity = particularQuantity + (i.currentSettleQuantity ? i.currentSettleQuantity / 1 : 0);
			});
			this.particularQuantity = particularQuantity;
		},
		handleChangeAmount(value, index) {
			this.statementParticularList[index].currentSettleAmount = value;
			if (this.statementParticularList[index].currentSettleQuantity) {
				this.statementParticularList[index].currentSettleAvePrice = (
					this.statementParticularList[index].currentSettleAmount / this.statementParticularList[index].currentSettleQuantity
				).toFixed(2);
			}
			let totalSettleAmount = 0;
			this.statementParticularList.map(i => {
				totalSettleAmount = totalSettleAmount + (i.currentSettleAmount ? i.currentSettleAmount / 1 : 0);
			});
			this.settleApplyForm.setFieldsValue({
				totalSettleAmount: totalSettleAmount.toFixed(2)
			});
		},
		// 全业务线基于货转开具结算单---下载货转附件
		downloadGoodsTransfer(url) {
			API_DOWNLPREVIEWTE(url).then(res => {
				comDownload(res, url);
			});
		},
		// 全业务线基于货转开具结算单---查看货转详情
		handleViewDetail(item) {
			let routeUrl = this.$router.resolve({
				name: 'SteelsGoodsTransferApplyDetail',
				query: {
					id: item.id
				}
			});
			window.open(routeUrl.href, '_blank');
		},
		submitSettleForm(type) {
			if (!this.transferIds.length) {
				this.$message.error('请选择货转信息');
				return;
			}

			this.settleApplyForm.validateFields(async (err, values) => {
				if (!err) {
					let nameStr = '';
					let flag = false;
					this.statementParticularList.forEach((el, i, arr) => {
						if (Number(el.currentSettleQuantity) + Number(el.settledQuantity) > el.transferQuantity) {
							flag = true;
							if (i == arr.length - 1) {
								nameStr += `${el.materialName}`;
							} else {
								nameStr += `${el.materialName}/`;
							}
						}
					});
					var bodyObj = {
						transferIds: this.transferIds, //货转列表
						totalSettleAmount: values.totalSettleAmount, // 总结算金额
						amountPaidTotalPrice: values.amountPaidTotalPrice, // 已付款金额
						statementType: values.statementType, //结算单类型
						id: this.$route.query.statementId, //编辑 提交 id
						particularQuantity: this.particularQuantity,
						contract: this.contract, //回传合同详情
						remark: values.remark, //备注
						statementParticularList: this.statementParticularList, // 结算单列表
						contractType: this.$route.query.contractType || 'SYSTEM_COLLECTION',
						generateWay: this.$route.query.generateWay || 'BUY'
					};
					// 提交
					if (+values.totalSettleAmount <= 0) {
						this.$message.error('本次结算金额需大于0');
					}

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
		PreviewModal
	}
};
</script>

<style scoped></style>
