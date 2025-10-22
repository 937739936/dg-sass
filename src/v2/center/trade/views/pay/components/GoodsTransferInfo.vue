<template>
	<div
		class="hidden-wrap"
		ref="goodsTransferInfo"
	>
		<div class="title"><i class="title_icon"></i>货转数据</div>
		<!-- // 仓押业务CYFlag=1时，不展示运输方式 -->
		<a-table
			v-if="$route.query.type == 'submit' || $route.query.type == 'overview'"
			rowKey="no"
			:columns="this.$route.query.CYFlag === '1' ? goodsTransferColumnsCY : goodsTransferColumns"
			:dataSource="goodsData"
			:pagination="false"
			:locale="{ emptyText: '暂无数据' }"
		>
			<div
				slot="action"
				slot-scope="action, item"
			>
				<a
					href="javascript:void(0)"
					@click="handleViewDetail(item)"
					style="margin-right: 10px"
					>查看</a
				>
				<a
					href="javascript:void(0)"
					@click.prevent="downloadGoodsTransfer(item)"
					>下载</a
				>
			</div>
		</a-table>
		<a-table
			v-else
			rowKey="no"
			:rowSelection="{
				selectedRowKeys: goodsSelectedRowKeys,
				onSelect: onSelectGoods,
				onChange: onChangeGoods,
				onSelectAll: onSelectAll
			}"
			:columns="this.$route.query.CYFlag === '1' ? goodsTransferColumnsCY : goodsTransferColumns"
			:dataSource="goodsData"
			:pagination="false"
			:locale="{ emptyText: '暂无数据' }"
		>
			<div
				slot="action"
				slot-scope="action, item"
			>
				<a
					href="javascript:void(0)"
					@click="handleViewDetail(item)"
					style="margin-right: 10px"
					>查看</a
				>
				<a
					href="javascript:void(0)"
					@click.prevent="downloadGoodsTransfer(item)"
					>下载</a
				>
			</div>
		</a-table>
		<a-form
			style="margin-top: 30px"
			:form="modalFileForm"
			:labelCol="{ span: 6 }"
			:wrapperCol="{ span: 18 }"
			labelAlign="left"
			id="modalFileForm"
		>
			<template v-if="isShowGoodsValue && (editDetail.isNew ? editDetail.isNew == 1 : true)">
				<a-row v-if="isConfirmGoods == 1 && !isdetail">
					<a-col
						:span="12"
						class="row"
					>
						<a-form-item
							label="计算方式"
							style="width: 100%"
							:colon="false"
						>
							<a-radio-group
								v-model="useType"
								@change="changeData"
							>
								<a-radio value="1"> 使用货值计算功能 </a-radio>
								<a-radio value="2"> 手动输入货值金额 </a-radio>
							</a-radio-group>
						</a-form-item>
					</a-col>
				</a-row>
				<a-row>
					<a-col
						:span="12"
						class="row"
					>
						<a-form-item
							label="货值金额"
							v-if="useType == '2'"
							style="width: 100%"
							:colon="false"
						>
							<a-input
								v-if="useType == '2'"
								:disabled="isdetail && type !== 'additionalPayment'"
								@blur="calcOtherValue"
								v-decorator="[
									'goodsValue',
									{
										rules: [
											{ required: true, message: '货值金额必填，请填写' },
											{ pattern: /^\d+(\.\d{0,2})?$/, message: '金额为非负数，最多两位小数' }
										]
									}
								]"
								placeholder="该合同当前所有已收货货物总值金额"
							>
							</a-input>
							<a-tooltip>
								<template slot="title"> 该合同当前所有已收货货物总值金额 </template>
								<a-icon
									type="exclamation-circle"
									style="margin-left: 10px; cursor: pointer"
								/>
							</a-tooltip>
						</a-form-item>
						<a-form-item
							label="货值金额"
							style="width: 100%"
							v-else
							:colon="false"
						>
							<span style="font-size: 19px; color: red"
								>{{ goodsVData.goodsValue || goodsVData.sumGoodsValue }}
								<a
									style="margin-left: 10px; font-size: 16px"
									@click="openCalc()"
									>计算过程</a
								></span
							>
						</a-form-item>
					</a-col>

					<a-col
						:span="12"
						class="row"
						v-if="!this.$route.query.isAdditionalPaymentCreat"
					>
						<a-form-item
							label="已转让金额"
							:colon="false"
							style="width: 100%"
						>
							{{ goodsVData.transferredAmount || '0' }}
						</a-form-item>
					</a-col>
				</a-row>
				<a-row v-if="!this.$route.query.isAdditionalPaymentCreat">
					<a-col
						:span="24"
						class="row"
					>
						<a-form-item
							label="可转让金额"
							style="width: 100%"
							:labelCol="{ span: 3 }"
							:wrapperCol="{ span: 20 }"
						>
							{{ goodsVData.transferableAmount || '-' }}
							<!-- 资金来源为“工商银行-煤炭”、“工商银行-钢材”时，可转让金额规则变更 -->
							<a-tooltip v-if="['receivable-ICBC-coal', 'receivable-ICBC-steel'].includes(this.source)">
								<template slot="title"
									>可转让金额=
									min【货值金额-已转让金额-累计非融资资金付款金额，合同金额-已转让金额-累计非融资资金付款金额】</template
								>
								<a-icon
									type="exclamation-circle"
									style="margin-left: 10px; cursor: pointer"
								/>
							</a-tooltip>
						</a-form-item>
					</a-col>
				</a-row>

				<template v-if="!this.$route.query.isAdditionalPaymentCreat">
					<a-row v-if="goodsVData.enableGoods == 1 && !isdetail">
						<a-col
							:span="24"
							class="row"
						>
							<a-form-item
								label="货值核算表"
								style="width: 100%"
								:colon="false"
								:labelCol="{ span: 3 }"
								:wrapperCol="{ span: 20 }"
							>
								<a @click="download">货值核算表</a>
							</a-form-item>
						</a-col>
					</a-row>
					<a-row v-if="isdetail && editDetail.status == 1">
						<a-col
							:span="24"
							class="row"
						>
							<a-form-item
								label="货值核算表"
								style="width: 100%"
								:colon="false"
								:labelCol="{ span: 3 }"
								:wrapperCol="{ span: 20 }"
							>
								<a @click="download">货值核算表</a>
							</a-form-item>
						</a-col>
					</a-row>
				</template>
			</template>

			<a-row>
				<a-col
					:span="12"
					class="row"
					v-if="isShowGoodsValue"
				>
					<a-form-item
						label="本次转让金额"
						style="width: 100%"
						:colon="false"
					>
						<a-input
							:disabled="isdetail && type !== 'additionalPayment'"
							v-decorator="[
								'thistransferAmount',
								{
									rules: [
										{ required: true, message: '本次转让金额必填，请填写' },
										{ pattern: /^\d+(\.\d{0,2})?$/, message: '金额为非负数，最多两位小数' }
									]
								}
							]"
							placeholder="请输入本次转让金额"
						>
						</a-input>
					</a-form-item>
				</a-col>
				<a-col
					:span="12"
					class="row"
				>
					<a-form-item
						label="本次付款金额"
						style="width: 100%"
						:colon="false"
					>
						<a-input
							:disabled="isdetail && type !== 'additionalPayment'"
							v-decorator="[
								'payAmount',
								{
									rules: [
										{ required: true, message: '本次付款金额必填，请填写' },
										{ pattern: /^\d+(\.\d{0,2})?$/, message: '金额为非负数，最多两位小数' }
									]
								}
							]"
							placeholder="请输入本次付款金额"
						>
						</a-input>
						<template v-if="isShowGoodsValue">
							<a
								href="#"
								style="margin: 0 4px"
								@click="calculatePayAmount"
								>测算</a
							>
							<a-popover :title="null">
								<template slot="content">
									<p>若选择“有票”，本次付款金额≤本次转让金额*有票融资比例</p>
									<p>若选择“无票”，本次付款金额≤本次转让金额*无票融资比例</p>
								</template>
								<a-icon type="info-circle" />
							</a-popover>
						</template>
					</a-form-item>
				</a-col>
				<a-col
					:span="12"
					class="row"
				>
					<a-form-item
						label="付款日期"
						style="width: 100%"
						:colon="false"
					>
						<a-date-picker
							placeholder="请选择付款日期"
							@change="getTime"
							:disabled="isdetail && type !== 'additionalPayment'"
							v-decorator="['planPayDate', { rules: [{ required: true, message: '付款日期必填，请填写' }] }]"
						/>
					</a-form-item>
				</a-col>
			</a-row>
		</a-form>
		<CalcModel ref="calcModel" />
	</div>
</template>

<script>
import CalcModel from './CalcModel';
import num from '@/v2/utils/num.js';
import moment from 'moment';
import comDownload from '@sub/utils/comDownload.js';
import find from 'lodash/find';
import {
	API_UPLOAD,
	API_PaymentGoodsOrderDetail,
	API_exportGoodsValueByOrderId,
	API_exportGoodsValueByPaymentId,
	API_selectGoodsValueByPaymentId,
	API_paymentApplyCalMaxPayAmount,
	API_paymentAdditionalCalMaxPayAmount
} from '@/v2/center/trade/api/pay';
import { API_goodsTransferBatchDownload } from '@/v2/center/trade/api/goodsTransfer';
import { mapMutations } from 'vuex';
export default {
	name: 'GoodsITransferInfo',

	components: { CalcModel },
	data() {
		return {
			action: API_UPLOAD,
			modalFileForm: this.$form.createForm(this),
			goodsVData: {},
			useType: '2',
			fileList: [],
			isdetail: false,
			isedit: false,
			isadd: false,
			goodsTransferColumns: [
				{ title: '货转编号', dataIndex: 'no' },
				{ title: '货转开具时间', dataIndex: 'signTime' },
				{ title: '货转数量（吨）', dataIndex: 'goodsTransferQuantity' },
				{ title: '品名', dataIndex: 'goodsName' },
				{ title: '运输方式', dataIndex: 'transportModeName' },
				{ title: '状态', dataIndex: 'statusDesc' },
				{ title: '操作', fixed: 'right', scopedSlots: { customRender: 'action' } }
			], // 无收发货信息时，货转信息table列
			goodsTransferColumnsCY: [
				{ title: '货转编号', dataIndex: 'no' },
				{ title: '货转开具时间', dataIndex: 'signTime' },
				{ title: '货转数量（吨）', dataIndex: 'goodsTransferQuantity' },
				{ title: '煤种', dataIndex: 'coalTypeDesc' },
				{ title: '状态', dataIndex: 'statusDesc' },
				{ title: '操作', fixed: 'right', scopedSlots: { customRender: 'action' } }
			], // 无收发货信息时，仓押业务货转信息table列
			isConfirmGoods: false,
			resultDetail: [],
			receiveNoList: [], // 暂存收货编号
			goodsSelectedRowKeys: [],
			goodsReceiveSelectedRowKeys: []
		};
	},
	props: [
		'goodsData',
		'deliveryIds',
		'receiveRecordIds',
		'goodsResultInfo',
		'receiveNoArr',
		'isShowGoodsValue',
		'editDetail',
		'pageState',
		'source',
		'hasInvoice',
		'payTypeList',
		'type',
		'orderDetail'
	],

	mounted() {
		this.isdetail = this.pageState == 'detail';
		this.isedit = this.pageState == 'edit';
		this.isadd = this.pageState == 'add';
		if (this.goodsData) {
			this.goodsDataDup();
		}

		this.getGoodsValueData();

		this.goodsSelectedRowKeys = this.deliveryIds || [];
		this.goodsReceiveSelectedRowKeys = this.receiveRecordIds || [];

		if (this.goodsResultInfo && this.goodsResultInfo.length > 0) {
			this.receiveNoList = this.receiveNoArr || [];
			this.goodsResultInfo.forEach(item => {
				if (item.receiveId) {
					for (let i = 0; i < item.receiveId.split(',').length; i++) {
						this.resultDetail.push({ id: item.receiveId.split(',')[i], deliverBatchId: item.deliveryId });
					}
				} else {
					this.resultDetail.push({ deliverBatchId: item.deliveryId });
				}
			});
		}
	},
	watch: {
		goodsData() {
			this.goodsDataDup();
		},
		useType: {
			handler(v) {
				this.VUEX_hsbUseType(v);
			},
			immediate: true
		},
		source() {
			this.calcOtherValue();
		}
	},
	methods: {
		...mapMutations({
			VUEX_hsbUseType: 'pagination/VUEX_hsbUseType'
		}),
		onSelectAll(selected, selectedRows, changeRows) {
			console.log(selected, selectedRows, changeRows);
			this.goodsSelectedRowKeys = selectedRows.map(el => el.no);
		},
		// disabledDate(current) {
		//   if (this.$route.query.isAdditionalPaymentCreat) {
		//     return current && current < moment().startOf("day");
		//   }
		//   return false;
		// },
		getTime(value, dateString) {
			this.$emit('changeplanPayDate', dateString);
		},
		getInitNoData() {
			if (!this.goodsResultInfo || this.goodsResultInfo.length == 0) return false;
			this.goodsResultInfo.forEach(item => {
				let obj = this.goodsData.find(inner => {
					return item.deliveryId === inner.id;
				});
				if (obj) {
					let arr = obj.receiveRecordsList || [];
					let receiveIdList = (item.receiveId || '').split(',');
					arr.forEach(_item => {
						if (receiveIdList.indexOf(_item.id) > -1) this.receiveNoList.push(_item.receiveNo);
					});
				}
			});
		},
		goodsDataDup() {
			this.goodsData.forEach(item => {
				if (item.goodsTransferFlag == 0) {
					item.goodsTransferFlag = '未开具';
				} else if (item.goodsTransferFlag == 1) {
					item.goodsTransferFlag = '部分开具';
				} else {
					item.goodsTransferFlag = '已开具';
				}
				if (item.receiveRecordsList) {
					item.receiveRecordsList.forEach(it => {
						if (it.goodsTransferFlag == 0) {
							it.goodsTransferFlag = '未开具';
						} else {
							it.goodsTransferFlag = '已开具';
						}
					});
				}
			});
		},
		onChangeGoods(selectedRowKeys) {
			this.goodsSelectedRowKeys = selectedRowKeys;
		},
		onChangeGoodsReceive(selectedRowKeys) {
			this.goodsReceiveSelectedRowKeys = selectedRowKeys;
		},
		onSelectGoods(record, selected) {
			// 切换发货勾选时，获取勾选的收货批次---start
			if (selected) {
				let arr = record.receiveRecordsList || [];
				let list = arr.map(item => {
					return item.receiveNo;
				});
				list.forEach(no => {
					if (this.receiveNoList.indexOf(no) === -1) this.receiveNoList.push(no);
				});
			} else {
				let arr = record.receiveRecordsList || [];
				let list = arr.map(item => {
					return item.receiveNo;
				});
				list.forEach(no => {
					let index = this.receiveNoList.findIndex(item => {
						return item === no;
					});
					if (index > -1) this.receiveNoList.splice(index, 1);
				});
			}
			// this.$emit('selectedChange', this.receiveNoList)
			// 切换发货勾选时，获取勾选的收货批次---end
			// if (!record.yspzUrl){
			//     if (!(record.transType == this.CONSTANTS.transportModeDict.SHIP && this.$route.query.coalType == this.CONSTANTS.coalTypeDict.STEAM_COAL) && !((record.transType == this.CONSTANTS.transportModeDict.TRAIN || record.transType == this.CONSTANTS.transportModeDict.AUTOMOBILE_AND_TRAIN) && this.$route.query.coalType == this.CONSTANTS.coalTypeDict.STEAM_COAL)) { // 非动力煤船运校验 非动力煤火运、汽运和火运中火运
			//         this.$message.info("此批次缺少运输凭证")
			//     }
			// }

			if (record.receiveRecordsList && record.receiveRecordsList.length > 0) {
				if (selected) {
					record.receiveRecordsList.forEach(item => {
						if (this.goodsReceiveSelectedRowKeys.indexOf(item.no) == -1) {
							this.goodsReceiveSelectedRowKeys.push(item.no);
							this.resultDetail.push({ id: item.no, no: item.no });
						}
					});
				} else {
					record.receiveRecordsList.forEach(item => {
						if (this.goodsReceiveSelectedRowKeys.indexOf(item.no) > -1) {
							this.goodsReceiveSelectedRowKeys.splice(this.goodsReceiveSelectedRowKeys.indexOf(item.no), 1);
							this.resultDetail.splice(this.resultDetail.indexOf({ id: item.no, no: item.no }), 1);
						}
					});
				}
			} else {
				if (selected) {
					this.resultDetail.push({ no: record.no });
				} else {
					this.resultDetail.forEach((item, index) => {
						if (item.no == record.no) {
							this.resultDetail.splice(index, 1);
						}
					});
				}
			}

			this.$emit(
				'selectedChange',
				this.receiveNoList,
				this.goodsSelectedRowKeys,
				this.goodsReceiveSelectedRowKeys,
				this.resultDetail
			);
		},
		onSelectGoodsReceive(record, selected, selectedRows) {
			if (selected) {
				this.receiveNoList.push(record.receiveNo);
			} else {
				let index = this.receiveNoList.findIndex(no => {
					return no === record.receiveNo;
				});
				this.receiveNoList.splice(index, 1);
			}

			if (selectedRows.length == 0) {
				this.goodsSelectedRowKeys.splice(this.goodsSelectedRowKeys.indexOf(record.deliverBatchId), 1);
			}
			if (selected) {
				selectedRows.forEach(item => {
					if (this.goodsSelectedRowKeys.indexOf(item.deliverBatchId) == -1) {
						this.goodsSelectedRowKeys.push(item.deliverBatchId);
					}
					this.resultDetail.push({ id: item.id, deliverBatchId: item.deliverBatchId });
				});
			} else {
				this.resultDetail.forEach((item, index) => {
					if (item.id == record.id) {
						this.resultDetail.splice(index, 1);
					}
				});
			}

			this.$emit(
				'selectedChange',
				this.receiveNoList,
				this.goodsSelectedRowKeys,
				this.goodsReceiveSelectedRowKeys,
				this.resultDetail
			);
		},
		jumpToDetail(type, record) {
			const contractTemplate = this.$route.query.contractTemplate;
			// if(!contractTemplate){
			//     return
			// }
			if (type == 'release') {
				window.open('/center/receive/accept/detail?deliverId=' + record.id + '&from=release&showAddFile=no');
			} else {
				window.open('/center/receive/accept/detail?deliverId=' + record.deliverBatchId + '&from=receive&showAddFile=no');
			}
		},
		dealWithGoodsData() {
			this.isConfirmGoods = this.goodsVData.isConfirmGoods;
			const { planPayDate, payAmount } = this.goodsVData;
			let fields = {};
			// 是追加付款创建时不填充
			if (!this.$route.query.isAdditionalPaymentCreat) {
				fields = { planPayDate, payAmount };
			}
			if (this.$route.query.isAdditionalPaymentCreat && this.$route.query.additionalPaymentEdit) {
				fields = { planPayDate, payAmount };
			}

			if (this.goodsVData.enableGoods == 1) {
				this.modalFileForm.setFieldsValue({
					// goodsValue:'11',
					transferredAmount: this.goodsVData.transferredAmount,
					// planPayDate:this.goodsVData.planPayDate,
					// payAmount:this.goodsVData.payAmount,
					thistransferAmount: this.goodsVData.thistransferAmount,
					...fields
				});

				setTimeout(() => {
					this.useType = '1';
				});
			} else {
				this.modalFileForm.setFieldsValue({
					transferredAmount: this.goodsVData.transferredAmount,
					goodsValue: this.goodsVData.sumGoodsValue || this.goodsVData.goodsValue,
					// planPayDate:this.goodsVData.planPayDate,
					// payAmount:this.goodsVData.payAmount,
					thistransferAmount: this.goodsVData.thistransferAmount,
					...fields
				});
				setTimeout(() => {
					this.useType = '2';
				});
			}
		},
		getGoodsValueData() {
			if (this.isdetail || this.isedit) {
				this.goodsVData = this.editDetail;
				let func = API_PaymentGoodsOrderDetail;
				let params = { orderId: this.$route.query.orderId };
				func(params).then(res => {
					this.goodsVData.nonFinanceAmount = res.result.nonFinanceAmount;
					this.dealWithGoodsData();
				});
				return;
			}

			if (this.isadd) {
				let func = API_PaymentGoodsOrderDetail;
				let params = { orderId: this.$route.query.orderId };
				func(params).then(res => {
					// this.isConfirmGoods = res.result.isConfirmGoods
					this.goodsVData = {
						isConfirmGoods: res.result.isConfirmGoods,
						transferredAmount: res.result.transferredAmount,
						nonFinanceAmount: res.result.nonFinanceAmount
					};
					this.dealWithGoodsData();
				});
			}
		},

		openCalc() {
			if (this.isdetail) {
				API_selectGoodsValueByPaymentId({ paymentId: this.$route.query.id }).then(res => {
					let calcData = res.result.calculateVO || {};

					if (calcData) {
						this.$refs.calcModel.init(calcData);
					}
				});
			} else {
				API_PaymentGoodsOrderDetail({ orderId: this.$route.query.orderId }).then(res => {
					let calcData = res.result.calculateVO || {};

					if (calcData) {
						this.$refs.calcModel.init(calcData);
					}
				});
			}
		},
		download() {
			if (this.isdetail) {
				API_exportGoodsValueByPaymentId({
					paymentId: this.$route.query.id
				}).then(res => {
					comDownload(res, null, '货值核算表.xls');
				});
				return;
			}

			this.modalFileForm.validateFieldsAndScroll((err, values) => {
				if (err) return;
				API_exportGoodsValueByOrderId({
					orderId: this.$route.query.orderId,

					transferredAmount: this.goodsVData.transferredAmount,
					thistransferAmount: values.thistransferAmount,

					hasInvoice: this.hasInvoice || '0',
					source: this.source,
					payAmount: values.payAmount
				}).then(res => {
					comDownload(res, null, '货值核算表.xls');
				});
			});
		},
		calcOtherValue() {
			this.calcOtherPrevValue();

			if (this.goodsVData.transferableAmount && this.isadd) {
				this.modalFileForm.setFieldsValue({
					thistransferAmount: parseInt(Number(this.goodsVData.transferableAmount))
				});
				this.calcPaymount();
			}
		},
		calcOtherPrevValue() {
			// 若资金来源为“工商银行-煤炭”、“工商银行-钢材”时：
			// 可转让金额=min【货值金额-已转让金额-累计非融资资金付款金额，合同金额-已转让金额-累计非融资资金付款金额】
			let a = this.modalFileForm.getFieldValue('goodsValue') || this.goodsVData.sumGoodsValue; // 货值金额
			let b = this.goodsVData.transferredAmount || 0; // 已转让金额
			let c = this.goodsVData.nonFinanceAmount || 0; //累计非融资资金付款金额
			let d = Number(this.orderDetail.basePrice * this.orderDetail.quantity).toFixed(2) || 0; //合同金额
			let result = 0;
			if (['receivable-ICBC-coal', 'receivable-ICBC-steel'].includes(this.source)) {
				let min = Math.min(a, d);
				let result1 = num.accSub(min, b);
				result = num.accSub(result1, c);
			} else {
				result = num.accSub(a, b);
			}
			this.goodsVData.transferableAmount = isNaN(result) ? '' : result;
		},
		calcPaymount() {
			if (this.source && this.hasInvoice && this.payTypeList && this.payTypeList.length && this.isadd) {
				let po = find(this.payTypeList, { source: this.source });
				let persent = po[this.hasInvoice == 1 ? 'ticketFinancingPercentage' : 'noTicketFinancingPercentage'];
				this.modalFileForm.setFieldsValue({
					payAmount: Number(Number(this.goodsVData.transferableAmount) * persent).toFixed(2)
				});
			}
		},
		changeData() {
			API_PaymentGoodsOrderDetail({ orderId: this.$route.query.orderId }).then(res => {
				this.goodsVData = res.result || {};

				let thistransferAmount = null;

				if (this.useType == 1) {
					this.goodsVData.enableGoods = 1;
					thistransferAmount = parseInt(Number(this.goodsVData.transferableAmount));

					this.calcPaymount();
				} else {
					this.goodsVData.enableGoods = 0;
					this.goodsVData.transferableAmount = null;
				}

				this.modalFileForm.setFieldsValue({
					...this.goodsVData,
					// planPayDate:this.editDetail.planPayDate,
					// payAmount:this.editDetail.payAmount,'
					thistransferAmount
				});
			});
		},
		validateForm() {
			return new Promise((reslove, reject) => {
				this.modalFileForm.validateFields((err, values) => {
					if (err) {
						reject(err);
					} else {
						let planPayDate =
							typeof values.planPayDate == 'string' ? values.planPayDate : values.planPayDate.format('YYYY-MM-DD');
						if (this.useType == 2) {
							reslove({
								enableGoods: 0,
								goodsValue: values.goodsValue,
								payAmount: values.payAmount,
								planPayDate: planPayDate,
								// goodsFile:this.fileList.length ? this.fileList[0].url :   values.uploadFiles.file.response.result,
								transferredAmount: this.goodsVData.transferredAmount || 0,
								transferableAmount: this.goodsVData.transferableAmount,
								thistransferAmount: values.thistransferAmount
							});
						} else {
							reslove({
								enableGoods: 1,
								goodsValue: this.goodsVData.sumGoodsValue || this.goodsVData.goodsValue,
								payAmount: values.payAmount,
								planPayDate: planPayDate,
								transferredAmount: this.goodsVData.transferredAmount || 0,
								transferableAmount: this.goodsVData.transferableAmount,
								thistransferAmount: values.thistransferAmount
							});
						}
					}
				});
			});
		},
		downloadGoodsTransfer(item) {
			let goodsTransferNo = item.no;
			API_goodsTransferBatchDownload({
				goodsTransferNoList: [goodsTransferNo]
			}).then(res => {
				comDownload(res.data, undefined, res.name);
			});
		},
		// 全业务线基于货转开具结算单---关联的货转信息表格中-查看货转详情
		handleViewDetail(item) {
			let routeUrl = this.$router.resolve({
				path: '/center/transfer/goodsTransfer/detail',
				query: {
					goodsTransferNo: item.no
				}
			});
			window.open(routeUrl.href, '_blank');
		},
		// 测算付款金额
		calculatePayAmount() {
			if (!this.hasInvoice) {
				this.$message.error('请选择是否有票');
				return;
			}
			this.modalFileForm.validateFields(['thistransferAmount'], (error, res) => {
				if (!error) {
					// 追加付款时，接口修改
					if (this.$route.query.additionalPaymentEdit || this.$route.query.isAdditionalPaymentCreat) {
						API_paymentAdditionalCalMaxPayAmount({
							serialNo: this.$route.query.serialNo || this.$route.query.mainPaymentNo,
							thistransferAmount: res.thistransferAmount
						}).then(res => {
							if (res.success) {
								this.maxPayAmount = res.data;
								this.modalFileForm.setFieldsValue({
									payAmount: res.data
								});
							}
						});
					} else {
						API_paymentApplyCalMaxPayAmount({
							payType: this.source,
							hasInvoice: this.hasInvoice,
							thistransferAmount: res.thistransferAmount
						}).then(res => {
							if (res.success) {
								this.maxPayAmount = res.result;
								this.modalFileForm.setFieldsValue({
									payAmount: res.result
								});
							}
						});
					}
				}
				setTimeout(() => {
					document.querySelector('#modalFileForm')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
				}, 100);
			});
		}
	}
};
</script>

<style scoped>
.hidden-wrap {
	margin-bottom: 30px;
}
.title {
	border-bottom: 1px solid #d8d8d8;
	font-size: 18px;
	padding: 14px 0;
	margin-bottom: 30px;
}
.title_icon {
	display: inline-block;
	width: 12px;
	height: 16px;
	vertical-align: middle;
	margin: 0 14px;
	background: url(~assets/imgs/menu/titleIcon.png) no-repeat right center;
}
</style>
