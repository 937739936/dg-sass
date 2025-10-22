<template>
	<div
		class="hidden-wrap"
		ref="goodsInfo"
	>
		<div class="title"><i class="title_icon"></i>货物信息</div>
		<a-table
			rowKey="shipmentNo"
			:rowSelection="{
				getCheckboxProps: record => ({ props: { disabled: disabled } }),
				selectedRowKeys: goodsSelectedRowKeys,
				onChange: onChangeGoods
			}"
			:columns="goodsColumns"
			:dataSource="pageState === 'view' ? dataSource : goodsData"
			:pagination="false"
			:locale="{ emptyText: '暂无数据' }"
		>
			<template
				slot="operation"
				slot-scope="text, record"
			>
				<a
					href="javascript:;"
					@click="jumpPage(0, record)"
					>查看</a
				>
			</template>

			<a-table
				slot="expandedRowRender"
				slot-scope="record"
				:columns="innerColumns"
				:data-source="record.receiptResp"
				rowKey="id"
				:pagination="false"
			>
				<template
					slot="operation"
					slot-scope=""
				>
					<a
						href="javascript:;"
						@click="jumpPage(1, record)"
						>查看</a
					>
					<!-- <a href="javascript:;"  @click="jumpPage('goods',record)" >查看</a> -->
				</template>
			</a-table>
		</a-table>
	</div>
</template>

<script>
import { getGoodsDataInfoByContractNo } from '@/v2/api/steels.js';
import CalcModel from './CalcModel';
import num from '@/v2/utils/num.js';
import comDownload from '@sub/utils/comDownload.js';
import _ from 'lodash';
import {
	API_UPLOAD,
	API_PaymentGoodsOrderDetail,
	API_exportGoodsValueByOrderId,
	API_exportGoodsValueByPaymentId,
	API_selectGoodsValueByPaymentId
} from '@/v2/api';
import { mapMutations } from 'vuex';
export default {
	name: 'GoodsInfo',

	components: { CalcModel },
	data() {
		return {
			disabled: false,
			goodsData: [],
			action: API_UPLOAD,
			modalFileForm: this.$form.createForm(this),
			goodsVData: {},
			useType: '2',
			fileList: [],
			isdetail: false,
			isedit: false,
			isadd: false,
			goodsColumns: [
				{
					title: '批次号',
					dataIndex: 'shipmentNo'
				},
				{
					title: '运输方式',
					dataIndex: 'transportModeDesc',
					width: '200px'
				},
				{
					title: '发货日期',
					dataIndex: 'shipmentDate'
				},
				{
					title: '发货数量(吨)',
					dataIndex: 'shipmentQuantity'
				},
				{
					title: '操作',
					scopedSlots: { customRender: 'operation' },
					dataIndex: 'operation'
				}
			],
			innerColumns: [
				{
					title: '收货编号',
					dataIndex: 'receiptNo'
				},
				{
					title: '',
					dataIndex: 'aaa',
					width: '200px'
				},
				{
					title: '收货日期',
					dataIndex: 'receiptDate'
				},
				{
					title: '收货数量(吨)',
					dataIndex: 'receiptQuantity'
				},
				{
					title: '操作',
					scopedSlots: { customRender: 'operation' },
					dataIndex: 'operation'
				}
			],
			isConfirmGoods: false,
			resultDetail: [],
			receiveNoList: [], // 暂存收货编号
			goodsSelectedRowKeys: [],
			goodsReceiveSelectedRowKeys: []
		};
	},
	props: [
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
		'contractNo',
		'dataSource'
	],

	created() {
		if (this.pageState === 'view') {
			return;
		}
		this.getGoodsDataInfo();
		return;
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
						this.resultDetail.push({
							id: item.receiveId.split(',')[i],
							deliverBatchId: item.deliveryId
						});
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
		}
	},
	methods: {
		...mapMutations({
			VUEX_hsbUseType: 'pagination/VUEX_hsbUseType'
		}),
		getGoodsDataInfo() {
			getGoodsDataInfoByContractNo(this.contractNo).then(res => {
				this.goodsData = res.data;
				this.goodsData.forEach(item => {
					item.shipmentQuantity = item.quantity;
				});
			});
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
			this.$emit('selectedChange', this.goodsSelectedRowKeys);
		},
		onChangeGoodsReceive(selectedRowKeys) {
			this.goodsReceiveSelectedRowKeys = selectedRowKeys;
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
					this.resultDetail.push({
						id: item.id,
						deliverBatchId: item.deliverBatchId
					});
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

		jumpPage(type, record) {
			const path = ['/center/steels/receive/deliver/detail', '/center/steels/receive/receipt/detail'][type];
			const { href } = this.$router.resolve({
				path,
				query: {
					deliverId: record.id,
					flag: 'view'
				}
			});
			window.open(href);
		},

		dealWithGoodsData() {
			//this.goodsVData.transferredAmount = 10000.22

			this.isConfirmGoods = this.goodsVData.isConfirmGoods;

			if (this.goodsVData.enableGoods == 1) {
				this.modalFileForm.setFieldsValue({
					// goodsValue:'11',
					transferredAmount: this.goodsVData.transferredAmount,
					planPayDate: this.goodsVData.planPayDate,
					payAmount: this.goodsVData.payAmount,
					thistransferAmount: this.goodsVData.thistransferAmount
				});

				setTimeout(() => {
					this.useType = '1';
				});
			} else {
				this.modalFileForm.setFieldsValue({
					transferredAmount: this.goodsVData.transferredAmount,
					goodsValue: this.goodsVData.sumGoodsValue || this.goodsVData.goodsValue,
					planPayDate: this.goodsVData.planPayDate,
					payAmount: this.goodsVData.payAmount,
					thistransferAmount: this.goodsVData.thistransferAmount
				});
				setTimeout(() => {
					this.useType = '2';
				});
			}
		},
		getGoodsValueData() {
			if (this.isdetail || this.isedit) {
				this.goodsVData = this.editDetail;
				this.dealWithGoodsData();
				return;
			}

			if (this.isadd) {
				let func = API_PaymentGoodsOrderDetail;
				let params = { orderId: this.$route.query.orderId };
				func(params).then(res => {
					// this.isConfirmGoods = res.result.isConfirmGoods
					this.goodsVData = {
						isConfirmGoods: res.result.isConfirmGoods,
						transferredAmount: res.result.transferredAmount
					};
					this.dealWithGoodsData();
				});
			}
		},

		openCalc() {
			if (this.isdetail) {
				API_selectGoodsValueByPaymentId({
					paymentId: this.$route.query.id
				}).then(res => {
					let calcData = res.result.calculateVO || {};

					if (calcData) {
						this.$refs.calcModel.init(calcData);
					}
				});
			} else {
				API_PaymentGoodsOrderDetail({
					orderId: this.$route.query.orderId
				}).then(res => {
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
			let a = this.modalFileForm.getFieldValue('goodsValue') || this.goodsVData.sumGoodsValue;
			let b = this.goodsVData.transferredAmount || 0;
			this.goodsVData.transferableAmount = num.accSub(a, b);

			if (this.goodsVData.transferableAmount && this.isadd) {
				this.modalFileForm.setFieldsValue({
					thistransferAmount: parseInt(Number(this.goodsVData.transferableAmount))
				});
				this.calcPaymount();
			}
		},
		calcPaymount() {
			if (this.source && this.hasInvoice && this.payTypeList && this.payTypeList.length && this.isadd) {
				let po = _.find(this.payTypeList, { source: this.source });
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
								transferredAmount: this.goodsVData.transferredAmount,
								transferableAmount: this.goodsVData.transferableAmount,
								thistransferAmount: values.thistransferAmount
							});
						} else {
							reslove({
								enableGoods: 1,
								goodsValue: this.goodsVData.sumGoodsValue || this.goodsVData.goodsValue,
								payAmount: values.payAmount,
								planPayDate: planPayDate,
								transferredAmount: this.goodsVData.transferredAmount,
								transferableAmount: this.goodsVData.transferableAmount,
								thistransferAmount: values.thistransferAmount
							});
						}
					}
				});
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
