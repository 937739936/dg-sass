<template>
	<div>
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
						style="width: 100%"
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
						style="width: 100%"
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
						style="width: 100%"
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
						style="width: 100%"
					>
						<a-input
							disabled
							v-decorator="['transportMode']"
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
					</a-table>
				</div>
			</a-row>
			<a-row class="row textarea-wrap" style="margin-top: 20px;">
				<a-col :span="12">
					<a-form-item
						label="结算数量（吨）"
						:colon="false"
					>
						<a-input
							disabled
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
							disabled
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
							disabled
							v-decorator="[
								'settleTime',
								{
									rules: [{ required: true, message: '请选择' }]
								}
							]"
							type="date"
							format="YYYY-MM-DD"
							valueFormat="YYYY-MM-DD"
							style="width: 220px"
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
			<a-row v-if="fileDataSource.length">
				<div class="title"><i class="title_icon"></i>附件信息</div>
				<div class="upload-wrap">
					<div class="upload-block">
						<CustomUpload
							ref="customUpload"
							:isNeedRotate="true"
							:columns="fileColumns"
							:ifEditable="false"
							:fileDataSource="fileDataSource"
							type="settle"
						/>
					</div>
				</div>
			</a-row>
		</a-form>
	</div>
</template>

<script>
import { getTakeDeliverIng, API_SteelsStatementSave } from '@/v2/center/steels/api/settle.js';
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
import { appJsColumns, noAppJsColumns } from '../components/config.js';
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
export default {
	props: {
		info: {
			default: () => {}
		},
		contract: {}
	},
	data() {
		return {
			columns,
			fileColumns,
			statementList: [],
			settleApplyForm: this.$form.createForm(this),
			receiveIds: [],
			fileDataSource: [],
			statementParticularList: [],
			columns,
			goodsTransferData: [],
			numberReg: /^(\d+)(\.\d{1,4})?$/,
		};
	},
	watch: {
		info: {
			handler(newVal) {
				// 合同明细
				let contractPurchaseList = newVal.contractPurchaseList || [];
				contractPurchaseList.forEach(el => {
					el.pieceQuantity = el.pieceQuantity || '/';
				});
				this.goodsTransferData = contractPurchaseList;
				this.statementParticularList = newVal?.statementParticularList || [];
				const statementAttachList = newVal.statementAttachList || [];
				statementAttachList.forEach(el => {
					el.typeName = '线下结算单';
					el.url = el.filePath;
				});
				this.fileDataSource = statementAttachList;
				this.$forceUpdate();
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
						transportMode: val.transportModeDesc || '-',
						remark: this.info.remark,
						appointSpecDesc: val.appointSpecDesc,
						businessTypeDesc: val.businessTypeDesc,
						steelTypeDesc: val.steelTypeDesc,
						particularQuantity: this.info.particularQuantity,
						totalSettleAmount: this.info.totalSettleAmount,
						settleTime: this.info.settleTime,
					});
				});
			},
			deep: true,
			immediate: true
		},
		statementParticularList: {
			handler(v) {
				if (!v || !v.length) return
				let hasTotal = false
				if (this.statementParticularList.length) {
					this.statementParticularList.forEach((item) => {
						hasTotal = hasTotal || item.hasOwnProperty('transferQuantity')
					})
				}
				if (!hasTotal) {
					this.statementParticularList.push({
						transferQuantity: '总计',
						currentSettleQuantity: '', //结算数量
						currentSettleAmount: '', // 价税合计
					});
					// 计算总计
					if (this.statementParticularList.length) {
						this.computedTotal(true);
						this.computedAmountTotal(true)
					} else {
						this.computedTotal();
						this.computedAmountTotal();
					}
					this.$forceUpdate();
				}
			},
			immediate: true,
			deep: true
		},
	},
	computed: {
		type() {
			return this.$route.query.type;
		},
		jsColumns() {
			return appJsColumns;
		},
	},
	mounted() {},
	methods: {
		computedTotal(flag) {
			const numberReg= /^(\d+)(\.\d{1,4})?$/
			const lastItem = this.statementParticularList[this.statementParticularList.length - 1];
			let currentSettleQuantity = 0
			this.statementParticularList.forEach((el, i, arr) => {
				if (i != arr.length - 1) {
					if (el.currentSettleQuantity !== "/" && numberReg.test(Number(el.currentSettleQuantity))) {
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
			const numberReg= /^(\d+)(\.\d{1,2})?$/
			const lastItem = this.statementParticularList[this.statementParticularList.length - 1];
			let currentSettleAmount = 0
			this.statementParticularList.forEach((el, i, arr) => {
				if (i != arr.length - 1) {
					if (el.currentSettleAmount !== "/" && numberReg.test(Number(el.currentSettleAmount))) {
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
			this.$forceUpdate();
		},
		computedContractTotal() {
			const lastItem = this.contractList[this.contractList.length - 1];

			// 计算总数量
			let realTakeQuantity = 0,
				currentSettleAmount = 0;
			/** 获取总共的提单数量 */
			const totalTakeOrderNum = this.statementList[this.statementList.length - 1];

			this.contractList.forEach((el, i, arr) => {
				if (i != arr.length - 1) {
					el.currentSettleAvePrice = el.currentSettleAmount
						? (el.currentSettleAmount / totalTakeOrderNum.realTakeQuantity).toFixed(2)
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
	},
	components: {
		CustomUpload
	}
};
</script>

<style scoped lang="less">
	.settle-apply-form {
		padding-bottom: 20px!important;
	
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
