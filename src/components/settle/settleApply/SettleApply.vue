<template>
	<div>
		<div class="steps-wrap">
			<a-steps :current="currentStep">
				<a-step
					v-for="item in steps"
					:key="item.title"
					:title="item.title"
				/>
			</a-steps>
		</div>
		<div class="settle-apply-form">
			<div class="title"><i class="title_icon"></i>收货信息</div>
			<div class="table-wrap">
				<a-table
					:rowSelection="{ selectedRowKeys: settleSelectedRowKeys, onChange: onSelectReceiveChange }"
					:columns="receiveColumns"
					:rowKey="record => record.id"
					:dataSource="receiveData"
					:pagination="false"
					:locale="{ emptyText: '暂无数据' }"
				/>
			</div>

			<!-- 基础信息 -->
			<div class="title"><i class="title_icon"></i>基础信息</div>
			<BasicInfo
				ref="basicInfo"
				:data="settleApplyForm"
			/>

			<!-- 品质奖罚 -->
			<div class="title"><i class="title_icon"></i>品质奖罚</div>
			<component
				ref="qualityInfo"
				:is="coalFormMap[coalType]"
				:data="settleApplyForm"
				:ifDisabledReward="ifDisabledReward"
				:ifNeedValid="ifNeedValid"
			/>

			<ExpenseItem
				ref="expenseInfo"
				v-if="isNeedExpense"
				:data="expenseData"
				:disabled="false"
			/>

			<!-- 结算信息 -->
			<div class="title"><i class="title_icon"></i>结算信息</div>
			<SettleInfo
				ref="settleInfo"
				:data="settleApplyForm"
			/>

			<div class="btn-wrap">
				<a-button @click="$router.go(-1)">返回</a-button>
				<a-button @click="submitSettleForm('save')">保存</a-button>
				<a-button
					type="primary"
					@click="submitSettleForm('submit')"
					>提交</a-button
				>
			</div>
		</div>
		<a-modal
			centered
			title="文件"
			v-model="modalPdfIsShow"
			:mask="true"
			:maskClosable="false"
			class="modal-pdf"
		>
			<template slot="footer">
				<a-button
					@click.native="modalPdfIsShow = false"
					style="margin: 0 10px"
					>取消</a-button
				>
				<a-button
					type="primary"
					icon="download"
					@click="downPdf(BASE_NET + pdfUrl)"
					style="margin: 0 10px"
					>下载</a-button
				>
				<a-button
					type="primary"
					key="back"
					@click="modalPdfSubmit"
					style="margin: 0 10px"
					>确定</a-button
				>
			</template>
			<pdf-preview
				v-if="pdfUrl"
				:url="pdfUrl"
			></pdf-preview>
		</a-modal>
	</div>
</template>

<script>
import PdfPreview from '@sub/components/pdf/index.vue';
import ExpenseItem from 'components/settle/apply/edit/ExpenseItem.vue';
import {
	API_GETSETTLEGOODSINFO,
	API_GETSETTLECONTRACTINFO,
	API_GETSETTLESAVE,
	API_GETSETTLEDETAIL,
	API_GETSETTLESUBMIT,
	API_GETSETTLESUBMITCONFIRM,
	API_HasNonTerminalStatement,
	API_DOWNLPREVIEWTE
} from 'api';
import { mapMutations } from 'vuex';
import ENV from 'api/env.js';
import comDownload from '@sub/utils/comDownload.js';

import SettleInfo from './sellteInfo';
import BasicInfo from './basicInfo';
import QualityInfo1 from './qualityInfo1';
import QualityInfo3 from './qualityInfo3';
import QualityInfo4 from './qualityInfo4';

export default {
	name: 'SettleApply',
	components: {
		PdfPreview,
		ExpenseItem,
		SettleInfo,
		BasicInfo,
		QualityInfo1,
		QualityInfo3,
		QualityInfo4
	},
	data() {
		return {
			currentStep: 1,
			steps: [{ title: '选择订单' }, { title: '填写结算信息' }, { title: '完成' }],
			settleApplyForm: {},
			// 收货信息
			receiveColumns: [],
			receiveColumnsDefault: [
				{
					title: '合同号',
					dataIndex: 'contractNo'
				},
				{
					title: '订单编号',
					dataIndex: 'serialNo',
					width: '100px'
				},
				{
					title: '批次号',
					dataIndex: 'batchNo',
					width: '100px'
				},
				{
					title: '卖方',
					dataIndex: 'sellerName',
					width: '350px'
				},
				{
					title: '买方',
					dataIndex: 'buyerName',
					width: '350px'
				},
				{
					title: '运输方式',
					dataIndex: 'transType',
					width: '100px'
				},
				{
					title: '车数',
					dataIndex: 'trainNum',
					width: '50px'
				},
				{
					title: '发货数量(吨)',
					dataIndex: 'deliverQuantity',
					width: '100px'
				},
				{
					title: '收货数量(吨)',
					dataIndex: 'receiveQuantity',
					width: '100px'
				},
				{
					title: '收货日期',
					dataIndex: 'recentReceiveDate',
					width: '100px'
				}
			],
			receiveColumnsShip: [
				{
					title: '订单编号',
					dataIndex: 'serialNo',
					width: '100px'
				},
				{
					title: '合同号',
					dataIndex: 'contractNo'
				},

				{
					title: '批次号',
					dataIndex: 'batchNo',
					width: '100px'
				},
				{
					title: '卖方',
					dataIndex: 'sellerName',
					width: '350px'
				},
				{
					title: '运输方式',
					dataIndex: 'transType',
					width: '100px'
				},
				{
					title: '装货数量(吨)',
					dataIndex: 'deliverQuantity',
					width: '100px'
				},
				{
					title: '收货数量(吨)',
					dataIndex: 'receiveQuantity',
					width: '100px'
				},
				{
					title: '收货日期',
					dataIndex: 'recentReceiveDate',
					width: '100px'
				}
			],
			receiveData: [],
			settleSelectedRowKeys: [],
			deliveryIds: '',
			pdfUrl: '',
			modalPdfIsShow: false,
			signLoading: false,
			coalType: 0,
			ifNeedValid: true,
			contractTemplate: '',
			ifDisabledReward: false,
			BASE_NET: ENV.BASE_NET,
			// defaultTicketPdfUrl: [],
			ticketPdfUrl: '',
			salesManInfo: [],
			bodyObj: {},
			expenseData: {}, // // 北港平仓采购和北港接列业务需要
			hasNonTermal: null,
			isNeedExpense: false,
			coalFormMap: {
				1: 'QualityInfo1',
				3: 'QualityInfo3',
				4: 'QualityInfo4'
			},
			isEdit: false // 是否是修改页面
		};
	},
	mounted() {
		this.getReceiveData(); // 获取收货信息
		this.isEdit = !!this.$route.query.id;
		// 修改页面
		if (this.isEdit) {
			API_GETSETTLEDETAIL({ statementId: this.$route.query.id }).then(res => {
				if (res.success) {
					this.settleApplyForm = res.result || {};
					this.dealDetailData();
				}
			});
		} else {
			/**
			 *结算单开具——填写结算信息
			 */
			API_GETSETTLECONTRACTINFO({
				orderId: this.$route.query.orderId
			}).then(res => {
				if (res.success) {
					this.settleApplyForm = res.result || {};
					this.dealDetailData();
				}
			});
		}
	},
	methods: {
		// 收货信息
		getReceiveData() {
			API_GETSETTLEGOODSINFO({ orderId: this.$route.query.orderId }).then(res => {
				if (res.success) {
					this.receiveData = res.result || {};
				}
			});
		},
		dealDetailData() {
			this.receiveColumns =
				this.settleApplyForm.transType === this.CONSTANTS.transportModeDict.SHIP
					? [].concat(this.receiveColumnsShip)
					: [].concat(this.receiveColumnsDefault);
			this.coalType = this.settleApplyForm.coalType;
			this.contractTemplate = this.settleApplyForm.contractTemplate;
			this.isNeedExpense = false; // 这个具体是用来判断啥的我也不知道，只是把这几个参数提成一个变量
			this.ifNeedValid = !(
				this.contractTemplate == this.CONSTANTS.contractTemplateDict.COKING_001 ||
				this.contractTemplate == this.CONSTANTS.contractTemplateDict.COKING_002
			);
			this.ifDisabledReward = false;
			let salesManData = undefined;
			if (this.settleApplyForm.oaUserName && this.settleApplyForm.oaMobile) {
				salesManData = {
					label: this.settleApplyForm.oaUserName,
					key: this.settleApplyForm.oaMobile
				};
			}

			if (this.isEdit) {
				if (this.contractTemplate == this.CONSTANTS.contractTemplateDict.STEAM_COAL_003) {
					this.receiveColumns.filter(item => {
						return item.dataIndex != 'transType';
					});
				}

				this.settleApplyForm.salesMan = salesManData;
				this.settleSelectedRowKeys = this.detailData.deliveryIdList || [];
				this.deliveryIds = this.detailData.deliveryIdList && this.detailData.deliveryIdList.join(',');
			} else {
				this.settleApplyForm = {
					...this.settleApplyForm,
					contractNo: this.settleApplyForm.no,
					contractPrice: this.settleApplyForm.basicPrice,
					basicSulfurContent: this.settleApplyForm.sulfur,
					basicWaterContent: this.settleApplyForm.water,
					salesMan: salesManData,
					basicAshContent: this.settleApplyForm.ash,
					basicVolatileContent: this.settleApplyForm.vad,
					basicHeatingValMin: this.settleApplyForm.heatMin,
					basicHeatingValMax: this.settleApplyForm.heatMax,
					basicVolatileContentMin: this.settleApplyForm.vadMin,
					basicVolatileContentMax: this.settleApplyForm.vadMax
				};
			}
		},
		// 选择的收货信息条目变化时
		onSelectReceiveChange(selectedRowKeys, selectedRows) {
			this.settleSelectedRowKeys = selectedRowKeys;
			let trainNumSum = 0;
			let receiveQuantitySum = 0;
			let deliverQuantitySum = 0;
			const deliveryIds = [];
			selectedRows.forEach(item => {
				trainNumSum = trainNumSum + item.trainNum;
				receiveQuantitySum = receiveQuantitySum + item.receiveQuantity;
				deliverQuantitySum = deliverQuantitySum + item.deliverQuantity;
				deliveryIds.push(item.id);
			});

			if (this.settleApplyForm.transType != this.CONSTANTS.transportModeDict.SHIP) {
				this.settleApplyForm = Object.assign({}, this.settleApplyForm, {
					trainNum: trainNumSum,
					receiveQuantity: receiveQuantitySum.toFixed(2),
					deliverQuantity: deliverQuantitySum.toFixed(2),
					settleQuantity: receiveQuantitySum.toFixed(2)
				});
			} else {
				this.$set(this.settleApplyForm, 'settleQuantity', receiveQuantitySum.toFixed(2));
			}
			this.deliveryIds = deliveryIds.join(',');

			if (this.isNeedExpense) {
				// 勾选发货申请时，校验该发货申请的货转开具标识，如为“货转凭证未开具”，弹出提示框提示“您选择的发货申请尚未开具线上货转”
				if (selectedRows.length) {
					let result = selectedRows.some(item => {
						return item.goodsTransferFlag == 0;
					});
					if (result) {
						this.$message.info('您选择的发货申请尚未开具线上货转');
					}
				}
			}
		},
		submitSettleForm(type) {
			if (!this.deliveryIds) {
				this.$message.error('请选择收货信息');
				return;
			}
			this.$refs.basicInfo.$refs.form.validate(valid1 => {
				this.$refs.qualityInfo.$refs.form.validate(valid2 => {
					this.$refs.settleInfo.$refs.form.validate(valid3 => {
						if (this.isNeedExpense) {
							this.$refs.expenseInfo.$refs.form.validate(valid4 => {
								if (valid1 && valid2 && valid3 && valid4) {
									const values = {
										...this.$refs.basicInfo.detailData,
										...this.$refs.qualityInfo.detailData,
										...this.$refs.expenseInfo.detailData,
										...this.$refs.settleInfo.detailData
									};
									this.bodyObj = this.getParams(values);
									this.setNonTermal(values.currentSettleAmount);
									this.submit(type);
								}
							});
						} else if (valid1 && valid2 && valid3) {
							const values = {
								...this.$refs.basicInfo.detailData,
								...this.$refs.qualityInfo.detailData,
								...this.$refs.settleInfo.detailData
							};
							this.bodyObj = this.getParams(values);
							this.setNonTermal(values.currentSettleAmount);
							this.submit(type);
						}
					});
				});
			});
		},
		setNonTermal(currentSettleAmount) {
			this.hasNonTermal = new Promise(resolve => {
				if (+currentSettleAmount > 0) {
					API_HasNonTerminalStatement({
						orderId: this.$route.query.orderId,
						statementId: this.$route.query.id
					}).then(res => {
						if (res.success) {
							if (res.result) {
								const t = this;
								t.$error({
									title: '出错',
									content: '当前订单已有未双签或者冻结中的结算单，暂时无法创建新的结算单',
									okText: '确定',
									onOk() {
										t.$router.push({ path: '/center/settle/mine/list' });
									}
								});
							} else {
								resolve({
									success: true,
									result: false
								});
							}
						}
					});
				} else {
					this.$message.error('本次结算金额需大于0');
				}
			});
		},
		submit(type) {
			if (type == 'save') {
				this.hasNonTermal.then(r => {
					if (r.success && !r.result) {
						API_GETSETTLESAVE(this.bodyObj).then(res => {
							if (res.success) this.$router.push({ path: '/center/settle/apply/success' });
						});
					}
				});
			}
			if (type == 'submit') {
				this.hasNonTermal.then(r => {
					if (r.success && !r.result) {
						if (this.contractTemplate == this.CONSTANTS.contractTemplateDict.OFFLINE) {
							this.modalPdfSubmit();
						} else {
							API_GETSETTLESUBMIT(this.bodyObj).then(res => {
								if (res.success) {
									this.modalPdfIsShow = true;
									this.pdfUrl = res.result;
								}
							});
						}
					}
				});
			}
		},
		getParams(values) {
			let bodyObj = {
				basicHeatingValMin: values.basicHeatingValMin,
				basicHeatingValMax: values.basicHeatingValMax,
				basicSulfurContent: values.basicSulfurContent,
				basicVolatileContentMin: values.basicVolatileContentMin,
				basicVolatileContentMax: values.basicVolatileContentMax,
				basicWaterContent: values.basicWaterContent,
				comments: values.comments,
				contractNo: values.contractNo,
				contractPrice: values.contractPrice,
				deliverQuantity: values.deliverQuantity,
				deliveryIds: this.deliveryIds,
				id: this.$route.query.id,
				offsetHeatingVal: values.offsetHeatingVal,
				offsetOther: values.offsetOther,
				offsetSulfurContent: values.offsetSulfurContent,
				offsetTotal: values.offsetTotal,
				offsetVolatileContent: values.offsetVolatileContent,
				offsetWaterContent: values.offsetWaterContent,
				orderId: this.$route.query.orderId,
				quantity: values.quantity,
				realHeatingVal: values.realHeatingVal,
				realSulfurContent: values.realSulfurContent,
				realVolatileContent: values.realVolatileContent,
				realWaterContent: values.realWaterContent,
				receiveQuantity: values.receiveQuantity,
				settleTotalAmount: values.settleTotalAmount,
				settleOtherPart1: values.settleOtherPart1,
				settleOtherPart2: values.settleOtherPart2,
				settleQuantity: values.settleQuantity,
				settleTotalPrice: values.settleTotalPrice,
				settleUnitPrice: values.settleUnitPrice,
				trainNum: values.trainNum,
				transType: values.transType,
				currentSettleAmount: values.currentSettleAmount,
				settledAmount: values.settledAmount,
				finishSettleQuantity: values.finishSettleQuantity, // 已结算数量
				totalSettleQuantity: values.totalSettleQuantity, // 总结算数量
				finishPayAmount: values.finishPayAmount, // 已付款金额
				basicAshContent: values.basicAshContent,
				basicVolatileContent: values.basicVolatileContent,
				realAshContent: values.realAshContent,
				offsetAshContent: values.offsetAshContent,
				oaUserName: values.salesMan.label,
				oaMobile: values.salesMan.key
			};
			if (this.isNeedExpense) {
				// 北港平仓采购和北港接列业务需要
				this.expenseData = {
					freightFee: values.freightFee,
					dispatchFee: values.dispatchFee,
					portConstructionFee: values.portConstructionFee,
					otherFee: values.otherFee,
					taxDifference: values.taxDifference,
					feeTotal: values.feeTotal
				};
			}
			if (this.contractTemplate == this.CONSTANTS.contractTemplateDict.OFFLINE) {
				if (typeof values.ticketPdfUrl != 'string') {
					if (values.ticketPdfUrl.fileList[0]) {
						values.ticketPdfUrl = values.ticketPdfUrl.fileList[0].response.result;
					} else {
						this.$message.error('请上传附件');
						return;
					}
				}
			}
			// 焦煤有四个新增字段
			if (this.coalType === this.CONSTANTS.coalTypeDict.COKING_COAL) {
				bodyObj.realGContent = values.realGContent; // 本次结算G
				bodyObj.realYContent = values.realYContent; // 本次结算Y
				bodyObj.realYxContent = values.realYxContent; // 本次结算岩相
				bodyObj.realRqdContent = values.realRqdContent; // 本次结算热强度
			}
			return bodyObj;
		},
		modalPdfSubmit() {
			var that = this;
			this.$confirm({
				centered: true,
				title: '请确认结算单信息无误并提交审批？',
				okText: '确定',
				cancelText: '取消',
				onOk() {
					let result = {};
					if (that.contractTemplate == this.CONSTANTS.contractTemplateDict.OFFLINE) {
						// 用户上传pdf
						result = that.bodyObj;
					} else {
						// 自动生成pdf
						Object.assign(result, that.bodyObj, {
							ticketPdfUrl: that.pdfUrl
						});
					}
					API_GETSETTLESUBMITCONFIRM(result).then(res => {
						// 盖章成功保存结算单申请信息
						if (res.code != 200) {
							that.$message.error(res.message);
							return;
						}
						that.$message.success('提交成功，等待审批！').then(() => that.$router.push({ path: '/center/settle/apply/success' }));
					});
				},
				onCancel() {}
			});
		},
		// 下载
		downPdf(url) {
			API_DOWNLPREVIEWTE(url).then(res => {
				comDownload(res, url);
			});
		}
	}
};
</script>

<style lang="less">
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
		.ant-select {
			width: 200px;
		}
		.salesman-select.ant-select {
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
	.ant-form-item-label {
		label {
			font-size: 16px;
			color: rgba(0, 0, 0, 0.75);
			width: 130px;
			margin-right: 46px;
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
	.ant-form-inline .ant-form-item-with-help,
	.m0 {
		margin: 0;
	}
}
</style>
