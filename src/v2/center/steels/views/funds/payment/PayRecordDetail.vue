<template>
	<div>
		<div
			class="pay-apply-form"
			style="padding-bottom: 10px"
		>
			<div class="title"><i class="title_icon"></i>合同信息</div>
			<a-form layout="inline">
				<a-row>
					<a-col
						:span="12"
						class="row"
					>
						<a-form-item
							label="订单编号"
							:colon="false"
						>
							<a @click="openOrder()">{{ orderDetail.serialNo }}</a>
						</a-form-item>
					</a-col>
					<a-col
						:span="12"
						class="row"
					>
						<a-form-item
							label="合同编号"
							:colon="false"
						>
							{{ orderDetail.contractNo }}
						</a-form-item>
					</a-col>
				</a-row>
				<a-row>
					<a-col
						:span="12"
						class="row"
					>
						<a-form-item
							label="卖方名称"
							:colon="false"
						>
							{{ orderDetail.sell }}
						</a-form-item>
					</a-col>
					<a-col
						:span="12"
						class="row"
					>
						<a-form-item
							label="买方名称"
							:colon="false"
						>
							{{ orderDetail.buy }}
						</a-form-item>
					</a-col>
				</a-row>
			</a-form>
		</div>
		<div class="pay-apply-form">
			<a-form
				:form="payApplyForm"
				layout="inline"
			>
				<div class="title"><i class="title_icon"></i>付款信息</div>
				<a-row>
					<a-col
						:span="12"
						class="row"
					>
						<a-form-item
							label="付款类型"
							:colon="false"
						>
							<a-select
								disabled
								v-decorator="['type', { rules: [{ required: true, message: '请选择付款类型' }] }]"
								@change="payTypeChange"
								placeholder="请选择付款类型"
							>
								<a-select-option
									v-for="(items, index) in paymentType"
									:key="index"
									:value="items.value"
									>{{ items.text }}</a-select-option
								>
							</a-select>
						</a-form-item>
					</a-col>
					<a-col
						:span="12"
						class="row"
					>
						<a-form-item
							label="是否有票"
							:colon="false"
						>
							<a-select
								disabled
								v-decorator="['hasInvoice', { rules: [{ required: true, message: '请选择是否有票' }] }]"
								placeholder="请选择是否有票"
							>
								<a-select-option value="0"> 无票 </a-select-option>
								<a-select-option value="1"> 有票 </a-select-option>
							</a-select>
						</a-form-item>
					</a-col>
					<a-col
						:span="12"
						class="row"
					>
						<a-form-item
							label="付款方式"
							:colon="false"
						>
							<a-select
								disabled
								v-decorator="['method', { rules: [{ required: true, message: '请选择付款方式' }] }]"
								placeholder="请选择付款方式"
							>
								<a-select-option
									v-for="(items, index) in paymentMethod"
									:key="index"
									:value="items.value"
									>{{ items.text }}</a-select-option
								>
							</a-select>
						</a-form-item>
					</a-col>
					<a-col
						:span="12"
						class="row"
					>
						<a-form-item
							label="收款方"
							:colon="false"
						>
							<a-input
								disabled
								v-decorator="['sellerName', { rules: [{ required: true, message: '收款方' }] }]"
							>
							</a-input>
						</a-form-item>
					</a-col>
				</a-row>
				<a-row>
					<a-col
						:span="12"
						class="row"
					>
						<a-form-item
							label="收款账号"
							:colon="false"
						>
							<a-select
								disabled
								v-decorator="['receiveId', { rules: [{ required: true, message: '请选择收款账号' }] }]"
								placeholder="请选择收款账号"
							>
								<a-select-option
									v-for="(items, index) in payBankInfo"
									:key="index"
									:value="items.id"
								>
									<a-tooltip placement="topLeft">
										<template slot="title">{{ items.bankName }}-{{ items.no }}</template>
										<span>{{ items.bankName }}-{{ items.no }}</span>
									</a-tooltip>
								</a-select-option>
							</a-select>
						</a-form-item>
					</a-col>
					<a-col
						:span="12"
						class="row"
					>
						<a-form-item
							label="收款账户名称"
							:colon="false"
						>
							<a-input
								disabled
								v-decorator="['receiveAccName', { rules: [{ required: true, message: '收款账户名称' }] }]"
							>
							</a-input>
						</a-form-item>
					</a-col>
				</a-row>
				<a-row>
					<a-col
						:span="12"
						class="row"
						v-show="payApplyForm.getFieldValue('type') == 1"
					>
						<a-form-item
							label="付款金额"
							:colon="false"
						>
							<a-input
								disabled
								v-decorator="[
									'payAmount',
									{
										rules: [
											{ required: true, message: '请输入付款金额' },
											{ pattern: /^\d+(\.\d{0,2})?$/, message: '付款金额为非负数，最多两位小数' }
										]
									}
								]"
								placeholder="请输入付款金额"
							>
							</a-input>
						</a-form-item>
					</a-col>
					<!-- <a-col :span="12" class="row" v-if="isShowGoodsValue">
                        <a-form-item label="应付账款金额" :colon=false>
                            <a-input
                                    disabled
                                    v-decorator="[
                                      'goodsValue',
                                      { rules: [
                                        { required: true, message: '应付账款金额必填，请填写' },
                                        { pattern: /^\d+(\.\d{0,2})?$/, message:'应付账款金额非负数，最多两位小数'}
                                        ] },
                                    ]"
                                    placeholder="请输入应付账款金额">
                            </a-input>
                        </a-form-item>
                    </a-col> -->
					<a-col
						:span="12"
						class="row"
						v-if="$route.query.type !== 'overview'"
					>
						<a-form-item
							label="资金来源"
							:colon="false"
						>
							<a-select
								v-decorator="['payType', { rules: [{ required: true, message: '请选择资金来源' }] }]"
								disabled
								placeholder="请选择资金来源"
							>
								<a-select-option
									v-for="(items, index) in payTypeList"
									:key="index"
									:value="items.source"
									>{{ items.sourceName }}
								</a-select-option>
							</a-select>
						</a-form-item>
					</a-col>
					<!-- 付款详情--若资金来源停用，回显不出则直接展示payTypeName -->
					<a-col
						:span="12"
						class="row"
						v-if="$route.query.type === 'overview'"
					>
						<a-form-item
							label="资金来源"
							:colon="false"
						>
							<a-input
								v-decorator="['payTypeName', { rules: [{ required: true, message: '请选择资金来源' }] }]"
								disabled
								placeholder="请选择资金来源"
							/>
						</a-form-item>
					</a-col>
					<a-col
						:span="12"
						class="row"
						v-show="payApplyForm.getFieldValue('type') == 1"
					>
						<a-form-item
							v-if="status == 3"
							:label="payApplyForm.getFieldValue('payType') == '6' ? '应付账款到期日' : '付款日期'"
							:colon="false"
						>
							<a-date-picker
								:placeholder="payApplyForm.getFieldValue('payType') == '6' ? '请输入应付账款到期日' : '请输入付款日期'"
								disabled
								v-decorator="['confirmTime', { rules: [{ required: true, message: '请输入日期' }] }]"
							/>
						</a-form-item>
						<a-form-item
							v-else
							:label="payApplyForm.getFieldValue('payType') == '6' ? '应付账款到期日' : '付款日期'"
							:colon="false"
						>
							<a-date-picker
								:placeholder="payApplyForm.getFieldValue('payType') == '6' ? '请输入应付账款到期日' : '请输入付款日期'"
								disabled
								v-decorator="['planPayDate', { rules: [{ required: true, message: '请输入日期' }] }]"
							/>
						</a-form-item>
					</a-col>
				</a-row>
				<a-row>
					<a-col
						:span="12"
						class="row"
					>
						<a-form-item
							label="是否关联预结算单"
							:colon="false"
						>
							<a-select
								disabled
								v-decorator="['test', { rules: [{ required: true, message: '是否关联预结算单' }] }]"
								placeholder="是否关联预结算单"
							>
								<a-select-option value="1">是 </a-select-option>
								<a-select-option value="2">否 </a-select-option>
							</a-select>
						</a-form-item>
					</a-col>
				</a-row>

				<div
					class="hidden-wrap"
					v-show="payApplyForm.getFieldValue('type') == 1"
				>
					<div class="title"><i class="title_icon"></i>结算单信息</div>
					<a-table
						rowKey="id"
						:columns="billColumns"
						:dataSource="billData"
						:pagination="false"
						:locale="{ emptyText: '暂无数据' }"
					>
						<template
							slot="operation"
							slot-scope="text, record"
						>
							<a
								href="javascript:;"
								@click="jumpToDetail('settle', record.id)"
								>查看</a
							>
						</template>
					</a-table>
				</div>
				<GoodsInfo
					v-if="payApplyForm.getFieldValue('type') == 2"
					:isShowGoodsValue="isShowGoodsValue"
					:editDetail="detail"
					:pageState="'detail'"
					:source="detail.payType"
					:hasInvoice="detail.hasInvoice"
					:goodsData="goodsData"
					:deliveryIds="deliveryIds"
					:receiveRecordIds="receiveRecordIds"
					:goodsResultInfo="goodsResultInfo"
					ref="goodsInfo"
				/>
				<div
					class="hidden-wrap"
					v-if="payApplyForm.getFieldValue('hasInvoice') == 1"
				>
					<div class="title"><i class="title_icon"></i>发票信息</div>
					<div class="invo-box">
						<div class="box-inner">
							<p class="stitle">不含税金额总和（元）</p>
							<p>
								<span class="text">{{ detail.amountSum }}</span>
							</p>
						</div>
						<div class="box-inner">
							<p class="stitle">税额总和（元）</p>
							<p>
								<span class="text">{{ detail.taxAmountSum }}</span>
							</p>
						</div>
						<div class="box-inner">
							<p class="stitle">价税合计总和（元）</p>
							<p>
								<span class="text">{{ detail.totalAmountSum }}</span>
							</p>
						</div>
						<div class="box-inner">
							<p class="stitle">发票分拆金额总和（元）</p>
							<p>
								<span class="text">{{ detail.splitedAmountSum }}</span>
							</p>
						</div>
					</div>
					<a-table
						:columns="invoiceColumns"
						:dataSource="invoiceData"
						:locale="{ emptyText: '暂无数据' }"
					>
					</a-table>
				</div>
				<div class="title"><i class="title_icon"></i>附件信息</div>
				<div class="upload-wrap">
					<div class="upload-block">
						<CustomUpload
							ref="customUpload"
							:isNeedRotate="true"
							:ifEditable="false"
							:fileDataSource="fileDataSource"
							:type="'pay'"
						>
						</CustomUpload>
					</div>
				</div>

				<div class="btn-wrap">
					<a-button
						v-show="!$route.query.nw"
						@click="goToList()"
						>返回</a-button
					>
					<a-button
						type="primary"
						@click="submitPayForm('submit')"
						v-if="$route.query.type == 'submit'"
						>提交</a-button
					>
				</div>
				<!--审批进度 3已付款 4驳回 -->
				<!--                <template v-if="(status== 3 || status == 4) && $route.query.method != 'collect'">-->
				<template v-if="showAudit">
					<div class="title"><i class="title_icon"></i>审批进度</div>
					<audit-records
						:data-source="auditProgressRecord"
						ref="auditRecords"
					/>
				</template>
			</a-form>
		</div>
		<a-modal
			title="发票信息"
			centered
			v-model="modalInvoiceInfoIsShow"
			okText="确定"
			cancelText="取消"
			@ok="modalInvoiceFormSubmit"
			@cancel="modalInvoiceFormCancel"
			class="modal-invoice-info"
		>
			<a-form
				layout="inline"
				class="search-wrap"
			>
				<a-row class="row">
					<a-col :span="24">
						<a-form-item
							label="发票代码"
							class="order-wrap"
						>
							<a-input v-model="params.code"> </a-input>
						</a-form-item>
						<a-form-item
							label="发票号码"
							class="order-wrap"
						>
							<a-input v-model="params.no"> </a-input>
						</a-form-item>
						<a-form-item>
							<a-button
								type="primary"
								html-type="submit"
								class="search-btn"
								@click="searchInvoiceInfo"
							>
								查询
							</a-button>
							<a-button
								html-type="reset"
								@click="resetInvoiceInfo"
							>
								重置
							</a-button>
						</a-form-item>
					</a-col>
				</a-row>
				<a-table
					:rowSelection="{ selectedRowKeys: invoiceSelectedRowKeys, onChange: onSelectInvoiceChange }"
					:columns="modalInvoiceColumns"
					:dataSource="modalInvoiceData"
					:locale="{ emptyText: '暂无数据' }"
				>
				</a-table>
			</a-form>
		</a-modal>
		<DetailModel
			:isSelfLoad="pageType != 'submit'"
			:isView="false"
			ref="detailModel"
		/>
		<TipModal ref="tipModal" />
	</div>
</template>

<script>
import moment from 'moment';
import { filterCodeByKey } from '@sub/utils/globalCode.js';
import CustomUpload from '@/v2/components/upload/CustomUpload';
import {
	API_GETCAPITALSOURCE,
	API_PAYSUBMIT,
	API_GETGOODSINFO,
	API_GETINVOICEINFO,
	API_GETPAYRECORDDETAIL,
	API_JudgeContract,
	API_PaymentApplyOrderDetail,
	API_COMPANYOACHECK
} from '@/v2/center/steels/api/funds.js';
import GoodsInfo from '@/v2/components/pay/GoodsInfo';
import AuditRecords from '@/v2/components/AuditRecords';
import { mapGetters } from 'vuex';
import DetailModel from '@/v2/components/pay/DetailModel.vue';
import TipModal from '@/v2/components/pay/TipModal';

export default {
	name: 'PayApply',
	components: {
		CustomUpload,
		GoodsInfo,
		AuditRecords,
		DetailModel,
		TipModal
	},
	data() {
		return {
			oaflag: false,
			detail: {},
			currentStep: 1,
			steps: [
				{
					title: '选择采购订单'
				},
				{
					title: '填写付款信息'
				},
				{
					title: '完成'
				}
			],
			payApplyForm: this.$form.createForm(this),
			fileDataSource: [],
			fileInfos: [],
			payBankInfo: [],
			payTypeList: [],
			billColumns: [
				{
					title: '结算单号',
					dataIndex: 'serialNo'
				},
				{
					title: '结算金额(元)',
					dataIndex: 'settleAmount'
				},
				{
					title: '结算日期',
					dataIndex: 'confirmTime'
				},
				{
					title: '结算吨数(吨)',
					dataIndex: 'settleQuantity'
				},
				{
					title: '操作',
					scopedSlots: { customRender: 'operation' },
					dataIndex: 'operation'
				}
			],
			modalInvoiceColumns: [
				{
					title: '发票代码',
					dataIndex: 'code'
				},
				{
					title: '发票编号',
					dataIndex: 'no'
				},
				{
					title: '不含税金额',
					dataIndex: 'amount'
				},
				{
					title: '税额',
					dataIndex: 'taxAmount'
				},
				{
					title: '价税合计',
					dataIndex: 'total_amount'
				},
				{
					title: '开票日期',
					dataIndex: 'issued_date'
				}
			],
			invoiceColumns: [
				{
					title: '发票代码',
					dataIndex: 'code'
				},
				{
					title: '发票编号',
					dataIndex: 'no'
				},
				{
					title: '不含税金额',
					dataIndex: 'amount'
				},
				{
					title: '税额',
					dataIndex: 'taxAmount'
				},
				{
					title: '价税合计',
					dataIndex: 'total_amount'
				},
				{
					title: '开票日期',
					dataIndex: 'issued_date'
				}
			],
			goodsData: [],
			billData: [],
			invoiceData: [],
			modalInvoiceData: [],
			selectedRowKeys: [],
			invoiceSelectedRowKeys: [],
			invoiceSelectedIds: '',
			billSelectedRowKeys: [],
			billSelectedIds: '',
			goodsSelectedRowKeys: [],
			goodsSelectedIds: '',
			modalInvoiceInfoIsShow: false,
			params: {
				code: '',
				no: ''
			},
			paymentType: filterCodeByKey('payment_type'),
			paymentMethod: filterCodeByKey('payment_method'),
			approvalColumns: [
				{
					title: '节点名称',
					dataIndex: 'nodeName'
				},
				{
					title: '操作人',
					dataIndex: 'signature'
				},
				{
					title: '审批结果',
					dataIndex: 'operation'
				},
				// {
				//     title: '留言',
				//     dataIndex: 'message',
				// },

				{
					title: '操作时间',
					dataIndex: 'signatureDate'
				}
			],
			auditProgressRecord: [],
			status: '',
			payDate: null,
			goodsResultInfo: '',
			pageType: '',
			amountDetail: {}, // 货值总金额 信息
			/**
			 * goodsAllAmount 总货值 = 加权货值+单批次总货值+调整总金额+额外扣减
			 * 该字段用于页面暂存'调整总金额'为0时的基础货值总金额
			 * 在货值总金额明细页面显示的"调整总金额"为接口返回的"货值总金额"-goodsAllAmount
			 */
			goodsAllAmount: 0, // 初始化货值总金额，此时调整金额为0
			accountingDetail: {}, // 合同核算办法明细数据
			isShowGoodsValue: false,
			orderDetail: {}
		};
	},
	mounted() {
		API_COMPANYOACHECK({ uscc: this.VUEX_ST_COMPANYSUER.companyUscc, industryType: 'STEEL' }).then(res => {
			if (res.success) {
				this.oaflag = res.result;
			}
		});
		this.pageType = this.$route.query.type;
		//  插入默认收款方
		const sellerName = this.$route.query.sellerName;
		this.payApplyForm.setFieldsValue({ sellerName: sellerName });
		this.getOrderDetail();
		// 判断是否是修改
		if (this.$route.query.id) {
			//获取支付详情
			API_GETPAYRECORDDETAIL({ id: this.$route.query.id }).then(res => {
				if (res.success) {
					const r = res.result;
					this.detail = res.result || {};
					this.isShowGoodsValue = this.detail ? this.CONSTANTS.isShowGoodsValue.indexOf(this.detail.financingType) > -1 : false;
					this.payBankInfo = [];
					//回款账号列表
					let payBankObj = {};
					payBankObj.id = r.receiveId;
					payBankObj.no = r.receiveAccNo;
					payBankObj.name = r.receiveAccName;
					payBankObj.bankName = r.receiveAccBank;
					payBankObj.uscc = r.sellerUscc;
					this.payBankInfo.push(payBankObj);
					// 获取资金来源
					API_GETCAPITALSOURCE({ sellerUscc: r.sellerUscc, buyerUscc: this.VUEX_ST_COMPANYSUER.companyUscc }).then(res => {
						if (res.success) {
							this.payTypeList = res.result;
						}
					});
					this.$nextTick(() => {
						this.payApplyForm.setFieldsValue({
							// "comments": r.comments,
							hasInvoice: r.hasInvoice,
							method: r.method,
							payAmount: r.payAmount,
							goodsValue: r.goodsValue == 0 ? '-' : r.goodsValue, //应付账款金额
							receiveId: r.receiveId,
							receiveAccName: r.receiveAccName,
							sellerName: r.sellerName,
							type: r.type,
							payType: r.payType,
							totalAmount: r.totalAmount,
							goodsAmount: r.goodsAmount,
							changeExplain: r.changeExplain,
							payTypeName: r.payTypeName
						});
						let data;
						// 设置结算单信息
						if (r.type == '1') {
							this.billData = r.paymentTypePoList;
							data = this.billData;
							this.billSelectedRowKeys = r.statementIds;
							this.billSelectedIds = r.statementIds.join(',');
						}
						if (r.statementIds) {
							let result = [];
							data.forEach(item => {
								r.statementIds.forEach(it => {
									if (it == item.id) {
										result.push(item);
									}
								});
							});
							if (r.type == '1') {
								this.billData = result;
							}
						}
						// if (this.isShowAccounting) {
						//   this.payApplyForm.setFieldsValue({
						//     "goodsValueTotalAmount": r.goodsValueTotalAmount,
						//     "goodsValueThisAmount":r.goodsValueThisAmount,
						//     "goodsValueAdjustExplain":r.goodsValueAdjustExplain
						//   })
						//   if(this.pageType == 'submit'){
						//     this.getAccountingDetail()
						//     this.getTemplateDetail()
						//   }
						// }

						// 设置货物信息
						if (r.type == '2') {
							this.deliveryIds = r.deliveryIds ? r.deliveryIds.split(',') : [];
							this.receiveRecordIds = r.receiveRecordIds ? r.receiveRecordIds.split(',') : [];
							this.goodsData = r.preStatementDeliveryDtoList;
							this.goodsResultInfo = r.goodsInfo ? JSON.parse(r.goodsInfo) : '';
						}

						// 设置附件信息
						this.fileDataSource = r.paymentAttachmentInfo;

						// 发票数据
						if (r.invoiceList) {
							r.invoiceList.forEach((item, index) => {
								r.invoiceList[index]['key'] = item.id;
							});
							this.invoiceData = r.invoiceList;
							this.invoiceSelectedRowKeys = r.invoiceIds;
							this.invoiceSelectedIds = r.invoiceIds.join(',');
						}

						// 设置审批记录
						this.status = r.status;

						// 状态不同，对应付款日期字段不同
						setTimeout(() => {
							if (this.status == 3) {
								this.payApplyForm.setFieldsValue({
									confirmTime: r.confirmTime ? moment(r.confirmTime) : null
								});
								this.payDate = r.confirmTime;
							} else {
								this.payApplyForm.setFieldsValue({
									planPayDate: r.planPayDate ? moment(r.planPayDate) : null
								});
								this.payDate = r.planPayDate;
							}
						}, 500);
						if (r.auditProgress) {
							this.auditProgressRecord = JSON.parse(r.auditProgress);
						}
					});
				}
			});
		}
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		showAudit() {
			if (this.VUEX_ST_COMPANYSUER.companyType === 'CORE_COMPANY') {
				//核心企业，审批记录为空 不展示栏目
				return this.auditProgressRecord.length > 0;
			} else {
				//一般贸易商，没有风控审批记录 不展示栏目
				return this.auditProgressRecord.filter(item => item.source === '易煤风控').length > 0;
			}
		}
		//   isShowAccounting(){
		//       return (this.VUEX_ST_COMPANYSUER.companyUscc==='91410100MA45CKY3XX' || this.detail.buyerUscc === '91410100MA45CKY3XX') && this.detail.coalType == this.CONSTANTS.coalTypeDict.STEAM_COAL && !!this.detail.terminalCompanyId
		//   }
	},
	methods: {
		moment,
		// 打开合同详情页
		openOrder() {
			let routerData = this.$router.resolve({
				path: '/center/contract/buy/online/detail',
				query: {
					id: this.$route.query.orderId,
					type: 'BUY'
				}
			});
			window.open(routerData.href, '_blank');
		},
		goToList() {
			this.$router.go(-1);
		},
		getOrderDetail() {
			API_PaymentApplyOrderDetail({ orderId: this.$route.query.orderId }).then(res => {
				if (res.success) {
					this.orderDetail = res.result || {};
				}
			});
		},
		payTypeChange(value, filterIds) {
			API_GETGOODSINFO({ orderId: this.$route.query.orderId, paytype: value }).then(res => {
				if (res.success) {
					let data;
					if (value == '1') {
						// 结算信息
						this.billData = res.result;
						data = this.billData;
					}
					if (filterIds) {
						let result = [];
						data.forEach(item => {
							filterIds.forEach(it => {
								if (it == item.id) {
									result.push(item);
								}
							});
						});
						if (value == 1) {
							this.billData = result;
						}
					}
				}
			});
		},
		/**
		 * 动力煤
		 * 汽运、船运——代发证明（非必填）、委托函（非必填）
		 * 火运——代发证明（必填）、委托函（必填）
		 * 火运、汽运核算表（当使用中原银行资金和善美-供应链资金时，必填；当使用善美-自有和自有资金非必填）；
		 * 非动力煤
		 * 汽运、船运、火运——代发证明（非必填）、委托函（非必填）
		 */
		validateFileType(fileObj) {
			let typeArr = this.fileDataSource.map(item => {
				return +item.type;
			});
			typeArr = [...new Set(typeArr)];
			if (this.$route.query.coalType == this.CONSTANTS.coalTypeDict.STEAM_COAL) {
				if (this.$route.query.transType == this.CONSTANTS.transportModeDict.TRAIN) {
					if (!typeArr.includes(6)) {
						this.$message.error('请上传收货对应的代发证明附件');
						return false;
					}
					if (
						this.payApplyForm.getFieldValue('payType') == '91610139MA6U8HA76Y' ||
						this.payApplyForm.getFieldValue('payType') == '9141000031741675X6'
					) {
						if (!typeArr.includes(28)) {
							this.$message.error('请上传收货对应的核算表附件');
							return false;
						}
					} //中原银行资金和善美-供应链资金必填
					if (!typeArr.includes('WTJSH')) {
						this.$message.error('请上传收货对应的委托结算函附件');
						return false;
					}
					return true;
				} else {
					if (
						this.payApplyForm.getFieldValue('payType') == '91610139MA6U8HA76Y' ||
						this.payApplyForm.getFieldValue('payType') == '9141000031741675X6'
					) {
						if (!typeArr.includes(28)) {
							this.$message.error('请上传收货对应的核算表附件');
							return false;
						}
						return true;
					} //中原银行资金和善美-供应链资金必填
					return true;
				}
			} else {
				if (this.$route.query.transType == this.CONSTANTS.transportModeDict.SHIP) {
					if (
						this.payApplyForm.getFieldValue('payType') == '91610139MA6U8HA76Y' ||
						this.payApplyForm.getFieldValue('payType') == '9141000031741675X6'
					) {
						if (!typeArr.includes(28)) {
							this.$message.error('请上传收货对应的核算表附件');
							return false;
						}
						return true;
					} //中原银行资金和善美-供应链资金必填
					return true;
				}
				return true;
			}
		},
		submitPayForm(type) {
			this.payApplyForm.validateFields((err, values) => {
				if (!err) {
					// 如果付款类型为1，则结算单信息不能为空,如果为2，则货物信息不能为空
					if (values.type == '1') {
						if (this.billSelectedIds == '') {
							this.$message.error('结算单信息不能为空');
							return;
						}
					}
					if (values.type == '2') {
						if (!this.$refs.goodsInfo.goodsSelectedRowKeys) {
							this.$message.error('货物信息不能为空');
							return;
						}
					}
					// 如果选择有票，发票信息不能为空
					if (values.hasInvoice == '1') {
						if (this.invoiceSelectedIds == '') {
							this.$message.error('发票信息不能为空');
							return;
						}
					}

					// 主体信息
					let bodyObj = {
						// "comments": values.comments,
						deliveryBatchIds: this.goodsSelectedIds,
						hasInvoice: values.hasInvoice,
						id: this.$route.query.id,
						invoiceIds: this.invoiceSelectedIds,
						method: values.method,
						orderId: this.$route.query.orderId,
						payAmount: this.detail.payAmount,
						goodsValue: this.detail.goodsValue, //应付账款金额
						planPayDate: this.payDate || '',
						confirmTime: this.payDate || '',
						receiveId: values.receiveId,
						receiveAccName: values.receiveAccName,
						saveType: type == 'save' ? 1 : 2,
						sellerName: this.$route.query.sellerName,
						settmentIds: this.billSelectedIds,
						type: values.type,
						payType: values.payType,
						payDateFlag: new Date().getTime() > new Date(this.payDate + ' 23:59:59').getTime() ? 0 : 1,
						goodsInfo: JSON.stringify(this.goodsResultInfo),
						enableGoods: this.detail.enableGoods,
						thistransferAmount: this.detail.thistransferAmount,
						totalAmountSum: this.detail.totalAmountSum,
						transferableAmount: this.detail.transferableAmount,
						transferredAmount: this.detail.transferredAmount
					};

					// if (this.isShowAccounting) {
					//   bodyObj = {
					//     ...bodyObj,
					//     goodsValueTotalAmount: values.goodsValueTotalAmount,
					//     goodsValueThisAmount: values.goodsValueThisAmount,
					//     goodsValueAdjustExplain: values.goodsValueAdjustExplain
					//   }
					// }

					if (this.status == 3) {
						delete bodyObj.planPayDate;
					} else {
						delete bodyObj.confirmTime;
					}

					// 附件信息
					var fileObj = {};
					this.fileDataSource.forEach((item, index) => {
						Object.assign(fileObj, this.fileDataSource[index]);
					});

					// Object.assign(bodyObj,fileObj);
					bodyObj.fileInfoList = this.fileDataSource;
					if (type == 'submit') {
						if (!this.validateFileType(this.fileDataSource)) return;
						// 付款时选择非自有资金需要判断销售合同是否完善
						API_JudgeContract({ orderSerialNo: this.$route.query.orderNo }).then(res => {
							if (res.success) {
								if (!res.data) return;
								if (!this.detail.terminalContractId && this.detail.payType != '0') {
									/**
									 * terminalModel
									 *  -模式1 是瑞茂通模式，通过上游订单查询下游合同信息；
									 *  -模式2 是调用各自平台数据查询下游合同信息模式；
									 *  -模式3 纯手动录入
									 */
									switch (this.detail.terminalModel + '') {
										case '1':
										case '3':
											// 云控推过来的数据，无法完善，只给出提示
											this.$refs.tipModal.init(true, this.detail);
											return;
										case '2':
											// 暂时没有这种情况，不处理
											break;
										// 需要完善
									}
								}

								const t = this;
								t.$confirm({
									centered: true,
									title: t.oaflag ? '请确认付款信息无误并提交审批？' : '请确认付款信息无误并线下已付款成功？',
									okText: '确定',
									cancelText: '取消',
									onOk() {
										API_PAYSUBMIT(bodyObj).then(res => {
											if (res.success) {
												t.$router.push('success');
											}
										});
									}
								});
							}
						});
					}
				}
			});
		},
		addInvoice() {
			this.modalInvoiceInfoIsShow = true;
			this.getInvoiceInfo();
		},
		getInvoiceInfo(params) {
			API_GETINVOICEINFO(params).then(res => {
				if (res.success) {
					this.modalInvoiceData = [];
					res.result.records.forEach(item => {
						this.modalInvoiceData.push({
							key: item.id,
							amount: item.amount,
							code: item.code,
							id: item.id,
							issued_date: item.issued_date,
							no: item.no,
							taxAmount: item.taxAmount,
							total_amount: item.total_amount
						});
					});
				}
			});
		},
		modalInvoiceFormSubmit() {
			this.modalInvoiceInfoIsShow = false;
		},
		modalInvoiceFormCancel() {
			this.modalInvoiceInfoIsShow = false;
		},
		searchInvoiceInfo() {
			this.getInvoiceInfo(this.params);
		},
		resetInvoiceInfo() {
			this.params = {
				code: '',
				no: ''
			};
			this.getInvoiceInfo();
		},
		onSelectInvoiceChange(selectedRowKeys, selectedRows) {
			this.invoiceSelectedRowKeys = selectedRowKeys;
			// 插入发票选中数据
			this.invoiceData = selectedRows;
			this.getInvoiceIds();
		},
		getInvoiceIds() {
			const selectIds = [];
			this.invoiceData.forEach(item => {
				selectIds.push(item.id);
			});
			this.invoiceSelectedIds = selectIds.join(',');
		},
		onSelectBillChange(selectedRowKeys, selectedRows) {
			this.billSelectedRowKeys = selectedRowKeys;
			const selectIds = [];
			selectedRows.forEach(item => {
				selectIds.push(item.id);
			});
			this.billSelectedIds = selectIds.join(',');
		},
		onDeleteInvoice(key) {
			const invoiceData = [...this.invoiceData];
			const keys = [];
			this.invoiceData = invoiceData.filter(item => item.key !== key);
			this.$message.success('删除成功');
			this.invoiceData.forEach(item => {
				keys.push(item.key);
			});
			this.invoiceSelectedRowKeys = keys;
			this.getInvoiceIds();
		},
		jumpToDetail(type, id) {
			if (type == 'settle') {
				window.open('/center/settle/settleApplyDetail?orderId=' + this.$route.query.orderId + '&id=' + id);
			}
		},
		// // 获取合同核算办法明细
		// async getAccountingDetail(){
		//   let resp = await API_GetIndicatorTemplateAccountingDetail({
		//     orderId: this.$route.query.orderId
		//   })
		//   if (resp.success)this.accountingDetail = resp.data || {}
		// },
		// 获取贷款总金额明细
		// async getTemplateDetail(){
		//   let resp = await API_GetIndicatorTemplateAddDetail({
		//     orderId: this.$route.query.orderId,
		//     // totalAmount: this.detail.goodsValueTotalAmount
		//     totalAmount: 0
		//   })
		//   if (resp.success){
		//     this.amountDetail = resp.data || {}
		//     this.goodsAllAmount = 0
		//     let obj = this.amountDetail.goodsItemVO || {}
		//     Object.keys(obj).forEach(key => {return this.goodsAllAmount += Number(obj[key]||0)})
		//     this.goodsAllAmount = Number(this.goodsAllAmount.toFixed(6))

		//     if(!isNaN(Number(this.detail.goodsValueTotalAmount))){
		//       this.amountDetail = {
		//         ...this.amountDetail,
		//         goodsItemVO: {
		//           ...obj,
		//           adjustTotalAmount: Number((this.detail.goodsValueTotalAmount-this.goodsAllAmount).toFixed(6))
		//         }
		//       }
		//     }

		//   }
		// },

		handleViewDetail() {
			if (this.pageType == 'submit') {
				this.$refs.detailModel.init(this.accountingDetail, this.amountDetail);
			} else {
				this.$refs.detailModel.init();
			}
		}
	}
};
</script>

<style lang="less">
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
			width: 240px;
		}
		.ant-select {
			width: 240px;
		}
	}
	.pay-account-wrap {
		.ant-select {
			width: 420px;
		}
	}
	.row {
		padding-left: 40px;
		.detail-wrapper {
			width: fit-content;
			position: absolute;
			top: 10px;
			right: 0px;
		}
		::v-deep.has-error .ant-form-explain {
			position: absolute;
		}
	}
	.ant-form-item-label {
		label {
			font-size: 16px;
			color: rgba(0, 0, 0, 0.75);
			width: 74px;
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
	.upload-wrap {
		margin-bottom: 30px;
	}
}
.modal-invoice-info {
	width: 80% !important;
	.search-btn {
		margin-right: 10px;
	}
}
</style>
