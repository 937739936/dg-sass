<template>
	<div>
		<spin-component
			:active="signLoading"
			text="结算单盖章中，请稍后..."
		></spin-component>
		<div class="settle-apply-form">
			<a-form
				:form="settleApplyForm"
				layout="inline"
			>
				<div v-if="handleType == 1">
					<template>
						<div class="title"><i class="title_icon"></i>货转信息</div>
						<div class="table-wrap">
							<a-table
								:columns="goodsTransferColumns"
								:rowKey="record => record.no"
								:dataSource="goodsTransferData"
								:pagination="false"
								:locale="{ emptyText: '暂无数据' }"
							>
								<div
									slot="action"
									slot-scope="action, item"
								>
									<!-- todo 这是个bug 目前没精力修复 先注释 -->
									<!-- <a href="javascript:void(0)" style="margin-right:15px;"
                    @click="handleViewDetail(item)">查看</a> -->
									<a
										href="javascript:void(0)"
										@click="downloadGoodsTransfer(item)"
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
									v-decorator="['statementType']"
									disabled
									style="width: 220px"
								>
									<a-select-option value="PRE_STAT">预结算单</a-select-option>
									<a-select-option value="STAT">结算单</a-select-option>
								</a-select>
							</a-form-item>
						</a-col>
					</a-row>
					<div class="title"><i class="title_icon"></i>结算信息</div>
					<div class="table-wrap">
						<a-table
							:columns="jsColumns"
							:dataSource="statementParticularList"
							:pagination="false"
							:locale="{ emptyText: '暂无数据' }"
						>
						</a-table>
					</div>
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
									disabled
									v-decorator="['remark']"
								>
								</a-textarea>
							</a-form-item>
						</a-col>
					</a-row>
				</div>
				<div v-if="handleType == 3">
					<LadingBillDetail
						:contract="contract"
						:info="info"
					></LadingBillDetail>
				</div>
				<div v-if="handleType == 2">
					<YuShenDetail
						:contract="contract"
						:info="info"
					></YuShenDetail>
				</div>
				<div v-if="handleType == 4">
					<AdditionalDetail></AdditionalDetail>
				</div>
				<div v-if="handleType == 5">
					<OtherMiddleDetail />
				</div>
				<div class="btn-wrap">
					<a-button @click="$router.push('settleConfirmList')">返回</a-button>
					<a-button
						type="primary"
						@click="confirmSettleForm()"
						>确认</a-button
					>
					<a-button
						type="danger"
						ghost
						@click="commitMsg()"
						>信息有误</a-button
					>
				</div>
			</a-form>
		</div>
		<a-modal
			centered
			title="文件"
			v-model="modalPdfIsShow"
			:mask="true"
			:maskClosable="false"
			okText="确认"
			cancelText="取消"
			@ok="sign"
			class="modal-pdf"
		>
			<pdf-preview
				v-if="pdfUrl"
				:url="pdfUrl"
			></pdf-preview>
		</a-modal>
		<a-modal
			title="信息"
			v-model="rejectModalIsShow"
			@ok="confirmRejectReason"
			okText="确认"
			cancelText="取消"
		>
			<p>
				<a-textarea
					placeholder="请输入驳回原因"
					v-model="rejectReason"
				></a-textarea>
			</p>
		</a-modal>
		<SignModal ref="signModal"></SignModal>
		<ChooseStamp
			ref="chooseStamp"
			@submit="submitSign"
			type="electronic"
		/>
	</div>
</template>

<script>
const noWarehousesColumns = [
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
		dataIndex: 'materialName',
		width: 150
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
		dataIndex: 'currentSettleQuantity'
	},
	{
		title: '本次结算金额（元）',
		dataIndex: 'currentSettleAmount'
	},
	{
		title: '本次结算单价（元/吨）',
		dataIndex: 'currentSettleAvePrice'
	}
];

import PdfPreview from '@sub/components/pdf/index.vue';
import LadingBillDetail from './components/LadingBillDetail.vue';
import AdditionalDetail from './additional.vue';
import { filterCodeByValueName } from '@sub/utils/globalCode.js';
import { sign } from '@/v2/utils/sign.js';
import SignModal from '@/v2/components/signModal/index';
import { mapGetters } from 'vuex';
import { API_GETCURRENTENV } from '@/v2/api';
import SpinComponent from '@/v2/components/SpinComponent.vue';
import YuShenDetail from './components/YuShenDetail.vue';
import { API_getApiGoodsTransferDOGetType, API_GetGoodsTransferDownload } from 'api';
import {
	API_SteelsStatementSealAuto,
	API_SteelsStatementSealUkey,
	API_SteelsStatementSignAfterConfirm,
	API_SteelsStatementStatementOff,
	API_SteelsStatementDetail
} from '@/v2/center/steels/api/settle.js';
import ChooseStamp from '@/v2/components/signModal/chooseStamp';
import OtherMiddleDetail from './components/OtherMiddleDetail.vue';

export default {
	name: 'SettleApply',
	components: {
		PdfPreview,
		SpinComponent,
		SignModal,
		LadingBillDetail,
		YuShenDetail,
		AdditionalDetail,
		ChooseStamp,
		OtherMiddleDetail
	},
	data() {
		return {
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
			statementParticularList: [],
			qualityData: [], // 品质奖罚数据
			currentStep: 1,
			steps: [
				{
					title: '选择订单'
				},
				{
					title: '填写结算信息'
				},
				{
					title: '完成'
				}
			],
			settleApplyForm: this.$form.createForm(this),
			receiveColumns: [
				{
					title: '合同号',
					dataIndex: 'contractNo'
				},
				{
					title: '订单编号',
					dataIndex: 'serialNo',
					width: '10%'
				},
				{
					title: '批次号',
					dataIndex: 'batchNo'
				},
				{
					title: '卖方',
					dataIndex: 'sellerName',
					width: '20%'
				},
				{
					title: '买方',
					dataIndex: 'buyerName',
					width: '20%'
				},
				{
					title: '运输方式',
					dataIndex: 'transTypeDesc',
					width: '10%'
				},
				{
					title: '车数',
					dataIndex: 'trainNum',
					width: '10%'
				},
				{
					title: '发货数量(吨)',
					dataIndex: 'deliverQuantity',
					width: '10%'
				},
				{
					title: '收货数量(吨)',
					dataIndex: 'receiveQuantity',
					width: '10%'
				},
				{
					title: '收货日期',
					dataIndex: 'recentReceiveDate',
					width: '10%'
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
					dataIndex: 'transTypeDesc',
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
			deliveryIds: '',
			pdfShowUrl: '',
			pdfUrl: '',
			modalPdfIsShow: false,
			rejectModalIsShow: false,
			rejectReason: '',
			signLoading: false,
			status: '',
			coalType: 0,
			transType: '',
			contractTemplate: '',
			deliveryType: '',
			goodsTransferData: [], // 货转信息table数据
			goodTransferNos: '', // 货转编号
			settleSelectedRowKeysGoodTransfer: [],
			info: {},
			contract: {},
			cfcaSealList: []
		};
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		handleType() {
			// 判断是否是补录结算单
			if (this.info.source == 'PLATFORM_SUPPLEMENT') {
				// 代采+仓押  走的是 榆神模板 但是 仍然是补录结算单
				if (['WAREHOUSE_RECEIPTS_PLEDGE', 'SOURCING_AGENT_WAREHOUSE_PLEDGE'].includes(this.contract.businessType)) {
					return 2;
				}
				// 联营 入库 代采+仓押  走的是 榆神模板 但是 仍然是补录结算单
				if (['AFFILIATED_BUSINESS'].includes(this.contract.businessType) && this.$route.query.deliveryMode == 'WAREHOUSING') {
					return 2;
				}
				return 4;
			} else {
				// 中间类型
				if (this.contract.businessType == 'OTHER_MIDDLE') {
					return 5;
				}
				// 榆神
				if (this.contract.businessType == 'ACCOUNT_RECEIVABLE_OTHER') {
					return 2;
				}
				if (this.info.contractType == 'BUY') {
					return 1;
				}
				// 基于销售合同
				if (this.info.contractType == 'SELL') {
					return 3;
				}
			}
			return '';
		},
		jsColumns() {
			return noWarehousesColumns;
		}
	},
	mounted() {
		if (this.$route.query.id) {
			this.getDetail();
		}
	},
	methods: {
		getDetail() {
			API_SteelsStatementDetail({ id: this.$route.query.id }).then(res => {
				if (res.success) {
					this.info = res.data;
					this.statementParticularList = res.data.statementParticularList;
					this.contract = {
						...res.data.contract,
						contractType: res.data.contractType,
						attachmentFileVOS: res.data.attachmentFileVOS
					};
					this.goodsTransferData = res.data.goodsTransferList;
					this.$nextTick(() => {
						this.settleApplyForm.setFieldsValue({
							totalSettleAmount: res.data.totalSettleAmount,
							statementType: res.data.type,
							...this.contract,
							remark: res.data.remark,
							// balanceWeight: res.data.balanceWeight,
							// ticketWeight: res.data.ticketWeight,
							amountPaidTotalPrice: res.data.amountPaidTotalPrice,
							quantity: this.contract.quantity || '-',
							transportMode: '汽运'
						});
					});
				}
			});
		},
		confirmSettleForm() {
			const url = this.contract.attachmentFileVOS[0].path;
			this.modalPdfIsShow = true;
			this.pdfShowUrl = API_GETCURRENTENV(url);
			this.pdfUrl = url;
		},
		autoSignature() {
			this.signLoading = true;
			API_SteelsStatementSealAuto({
				id: this.$route.query.id,
				cfcaSealList: this.cfcaSealList
			})
				.then(res => {
					if (res.success) {
						this.step2()
							.then(() => {
								this.$message.success({
									content: '盖章完成',
									duration: 5
								});
								this.$router.push('settleConfirmSuccess');
							})
							.finally(() => {
								this.signLoading = false;
							});
					} else {
						this.$message.error('签署失败，请联系管理员');
					}
				})
				.finally(() => {
					this.signLoading = false;
				});
		},
		// 盖章相关
		sign() {
			let obj = {
				moduleSealType: 10 // 模块编码
			};
			this.$refs.chooseStamp.showModal(obj, true);
		},
		// 盖章相关
		submitSign(cfcaSealList, certModel) {
			this.cfcaSealList = cfcaSealList;
			if (certModel == 'TRUST') {
				this.$refs.signModal.showModal(this.autoSignature);
			} else {
				var that = this;
				const isOrderModule = true;
				this.$confirm({
					centered: true,
					title: '请确认结算单信息无误并进行盖章？',
					okText: '确定',
					cancelText: '取消',
					onOk() {
						sign.call(that, that.step1, that.step2, 'settleConfirmSuccess', isOrderModule);
					},
					onCancel() {}
				});
			}
		},
		step1(obj) {
			return API_SteelsStatementSealUkey({
				id: this.$route.query.id,
				cert: obj.cert,
				cfcaSealList: this.cfcaSealList
			});
		},
		step2() {
			return API_SteelsStatementSignAfterConfirm(this.$route.query.id);
		},
		commitMsg() {
			this.rejectModalIsShow = true;
		},
		confirmRejectReason() {
			if (this.rejectReason == '') {
				this.$message.error('驳回原因不能为空');
				return;
			} else {
				API_SteelsStatementStatementOff({
					reason: this.rejectReason,
					id: this.$route.query.id
				}).then(res => {
					if (res.success) {
						this.$router.push('settleConfirmSuccess');
					}
				});
			}
		},
		// 查看货转详情
		handleViewDetail(item) {
			API_getApiGoodsTransferDOGetType(item.orderNo).then(resp => {
				if (resp.success) {
					let transferType = (resp.result && resp.result.type) || '';
					let routeUrl = this.$router.resolve({
						path: this.$route.query.CYFlag
							? '/center/goodsTransfer/goodsTransferApplyDetailCY'
							: '/center/goodsTransfer/goodsTransferApplyDetailNew',
						query: {
							no: item.no,
							orderNo: item.orderNo,
							hideBack: true
						}
					});
					// 009是动力煤006 007模板，需要走其他页面
					if (transferType === '009') {
						routeUrl = this.$router.resolve({
							path: '/center/goodsTransfer/goodsTransferApplyDetail',
							query: {
								no: item.no,
								orderNo: item.orderNo,
								hideBack: true
							}
						});
					}
					window.open(routeUrl.href, '_blank');
				}
			});
		},

		// 下载货转附件
		downloadGoodsTransfer(item) {
			API_GetGoodsTransferDownload({ no: item.no }).then(res => {
				comDownload(res, undefined, '货转证明.zip');
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
	}

	.ant-table-body {
		overflow: scroll;
	}

	table {
		white-space: nowrap;
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
		margin-bottom: 20px;
		padding-left: 40px;
	}

	.ant-form-item-label {
		label {
			font-size: 16px;
			color: rgba(0, 0, 0, 0.75);
			width: 114px;
			margin-right: 46px;
			display: inline-block;
			text-align: left;
		}
	}

	.textarea-wrap {
		textarea {
			width: 666px;
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

	.white-space .ant-form-item-label label {
		white-space: pre-wrap;
		line-height: 18px;
	}
}
</style>
