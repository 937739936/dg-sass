<template>
	<div
		class="info-item"
		style="margin-bottom: 10px"
	>
		<template v-if="invoiceType == 'up'">
			<i class="title_icon"></i>
			<p class="title">发票信息</p>
		</template>
		<div class="hidden-wrap">
			<p
				class="inner-title"
				v-if="invoiceType == 'up'"
			>
				进项发票信息（上游）
			</p>
			<p
				class="inner-title"
				v-else
			>
				销项发票信息（下游）
			</p>
			<div class="invo-box">
				<div class="box-inner">
					<p class="stitle">不含税金额总和（元）</p>
					<p>
						<span class="text">{{ editDetail.amountSum }}</span>
					</p>
				</div>
				<div class="box-inner">
					<p class="stitle">税额总和（元）</p>
					<p>
						<span class="text">{{ editDetail.taxAmountSum }}</span>
					</p>
				</div>
				<div class="box-inner">
					<p class="stitle">价税合计总和（元）</p>
					<p>
						<span class="text">{{ editDetail.totalAmountSum }}</span>
					</p>
				</div>
				<div class="box-inner">
					<p class="stitle">发票分拆金额总和（元）</p>
					<p>
						<span class="text">{{ editDetail.splitedAmountSum }}</span>
					</p>
				</div>
			</div>
			<a-table
				:columns="invoiceColumns"
				:dataSource="invoiceData"
				:locale="{ emptyText: '暂无数据' }"
			>
				<template
					slot="operation"
					slot-scope="text, record"
				>
					<a-popconfirm
						v-if="invoiceData.length && type == 'edit'"
						title="确定删除该条发票信息?"
						okText="确定"
						cancelText="取消"
						@confirm="() => onDeleteInvoice(record)"
					>
						<a
							href="javascript:;"
							class="delete-btn"
							>删除</a
						>
					</a-popconfirm>
				</template>
			</a-table>
			<p
				v-if="type == 'edit'"
				class="add-wrap"
				@click="addInvoice"
			>
				<i>+</i>关联发票
			</p>
		</div>
		<ErrorModal
			ref="errorModal2"
			tip="提示"
		>
			<div class="error-msg">
				<p
					v-for="(item, index) in errorInfoList"
					:key="index"
				>
					{{ item }}
				</p>
				<p>无法关联付款,请核实发票状态</p>
			</div>
		</ErrorModal>
		<a-modal
			title="发票信息"
			centered
			v-model="modalInvoiceInfoIsShow"
			width="850"
			okText="确定"
			cancelText="取消"
			@ok="confirmCheck"
			@cancel="modalInvoiceFormCancel"
			class="modal-invoice-info"
		>
			<a-form
				layout="inline"
				class="search-wrap"
			>
				<a-row>
					<a-col
						:span="12"
						class="row"
					>
						<a-form-item
							label="发票代码"
							class="order-wrap"
						>
							<a-input v-model="params.code"> </a-input>
						</a-form-item>
					</a-col>
					<a-col
						:span="12"
						class="row"
					>
						<a-form-item
							label="发票号码"
							class="order-wrap"
						>
							<a-input v-model="params.no"> </a-input>
						</a-form-item>
					</a-col>
					<a-col
						:span="12"
						class="row"
					>
						<a-form-item
							label="开票日期"
							class="order-wrap"
							:colon="false"
						>
							<a-range-picker
								:placeholder="['', '']"
								v-model="issuedDate"
								format="YYYY-MM-DD"
								@change="issuedDateChange"
							/>
						</a-form-item>
					</a-col>
					<a-col
						:span="12"
						class="row"
					>
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
					:rowSelection="{
						selectedRowKeys: invoiceSelectedRowKeys,
						onChange: onSelectInvoiceChange
					}"
					:columns="modalInvoiceColumns"
					:dataSource="modalInvoiceData"
					:pagination="invoicePagination"
					@change="paginationChange"
					:locale="{ emptyText: '暂无数据' }"
				>
					<template
						slot="footer"
						v-if="modalInvoiceData.length"
					>
						<a-checkbox
							:indeterminate="indeterminate"
							:checked="checkAll"
							@change="onCheckAllChange"
						>
							选择全部发票
						</a-checkbox>
					</template>
				</a-table>
			</a-form>
			<template slot="footer">
				<a-button
					type="primary"
					@click.native="confirmCheck"
					>确定</a-button
				>
			</template>
		</a-modal>
	</div>
</template>

<script>
import { API_GETINVOICEINFO, API_PAYAPPinvoLYLIST, payCheckInvoice } from '@/v2/center/trade/api/pay';
import ENV from '@/v2/config/env';
import ErrorModal from './errorModal.vue';

export default {
	components: { ErrorModal },
	name: 'InvoiceInfo',

	props: ['bizLineInfo', 'paymentId', 'invoiceType', 'orderNo', 'type', 'invoiceList', 'bizLineSelectedRowKeys'],
	data() {
		return {
			BASE_NET: ENV.BASE_NET,
			editDetail: {},
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
					dataIndex: 'total_amount',
					customRender: (text, record) => {
						return (+(record.total_amount || record.totalAmount)).toLocaleString();
					}
				},
				{
					title: '开票日期',
					dataIndex: 'issued_date',
					customRender: (text, record) => {
						return record.issued_date || record.issuedDate;
					}
				},
				{
					title: '操作',
					scopedSlots: {
						customRender: 'operation'
					},
					dataIndex: 'operation'
				}
			],
			invoiceData: [],
			modalInvoiceInfoIsShow: false,
			modalInvoiceData: [],
			selectedRowKeys: [],
			invoiceSelectedRowKeys: [],
			invoiceSelectedIds: '',
			params: {
				code: '',
				no: ''
			},
			invoicePagination: {
				pageSize: 10,
				current: 1,
				hideOnSinglePage: false,
				showQuickJumper: true,
				showSizeChanger: true,
				showTotal: function (total) {
					return `共${total}条记录 `;
				}
			},
			issuedDate: null,
			invoiceAllData: [],
			errorInfoList: []
		};
	},
	watch: {
		bizLineInfo: {
			immediate: true,
			handler() {}
		},
		invoiceList: {
			immediate: true,
			deep: true,
			handler(v) {
				if (v && v.length) {
					// 编辑回显
					this.invoiceData = JSON.parse(JSON.stringify(v));
					this.getInvoiceIds();
					this.invoiceSelectedRowKeys = v.map(item => item.id);
				}
			}
		}
	},
	computed: {
		indeterminate() {
			let checkedList = this.invoiceSelectedRowKeys;
			return !!checkedList.length && checkedList.length < this.modalInvoiceData.length;
		},
		checkAll() {
			let checkedList = this.invoiceSelectedRowKeys;
			return !!checkedList.length && checkedList.length == this.modalInvoiceData.length;
		}
	},
	mounted() {
		if (this.type == 'view') {
			this.invoiceColumns.pop();
		}
	},
	methods: {
		//选择全部发票
		onCheckAllChange() {
			if (this.invoiceSelectedRowKeys.length != this.modalInvoiceData.length) {
				this.invoiceSelectedRowKeys = this.modalInvoiceData.map(item => {
					return item.id;
				});
			} else {
				this.invoiceSelectedRowKeys = [];
			}
		},
		paginationChange(data) {
			this.invoicePagination.current = data.current;
			this.invoicePagination.pageSize = data.pageSize;
		},
		issuedDateChange(value, dateString) {
			this.params.issuedDateBegin = dateString[0];
			this.params.issuedDateEnd = dateString[1];
		},
		onDeleteInvoice(record) {
			const invoiceData = [...this.invoiceData];
			const keys = [];
			this.invoiceData = invoiceData.filter(item => item.id !== record.id);
			this.$message.success('删除成功');
			this.invoiceData.forEach(item => {
				keys.push(item.id);
			});
			this.invoiceSelectedRowKeys = keys;
			this.getInvoiceIds();
		},
		addInvoice() {
			this.modalInvoiceInfoIsShow = true;
			//查询数据采用前端分页
			this.params = {
				code: '',
				no: ''
			};
			this.invoicePagination.current = 1;
			this.getInvoiceInfo();
		},
		getInvoiceInfo(params) {
			API_GETINVOICEINFO({
				...params,
				orderNo: this.getOrderNo(),
				// orderId: 772,
				pageSize: 10000,
				orderType: 'ONLINE',
				type: this.invoiceType == 'up' ? 'UP' : 'DOWN',
				paymentId: this.paymentId || null
			}).then(res => {
				if (res.success) {
					this.modalInvoiceData = [];
					res.result.records.forEach(item => {
						this.modalInvoiceData.push({
							key: item.id,
							amount: item.amount,
							code: item.code,
							id: item.id,
							issued_date: item.issuedDate,
							no: item.no,
							taxAmount: item.taxAmount,
							total_amount: item.totalAmount
						});
					});

					// 插入所有发票数据
					this.invoiceAllData = this.invoiceAllData.concat(res.result.records);
					this.invoicePagination.current = 1;
				}
			});
		},
		async confirmCheck() {
			this.invoiceData = [];
			this.invoiceAllData.forEach(item => {
				this.invoiceSelectedRowKeys.forEach(id => {
					if (item.id == id) {
						item['key'] = item.id;
						if (JSON.stringify(this.invoiceData).indexOf(JSON.stringify(item)) == -1) {
							this.invoiceData.push(item);
						}
					}
				});
			});
			if (!this.invoiceSelectedRowKeys.length) {
				this.modalInvoiceFormSubmit();
				return;
			}
			const invoiceIdList = this.invoiceData.map(el => el.id);
			const params = {
				invoiceIdList: invoiceIdList
			};
			const errRes = await payCheckInvoice(params);
			if (errRes.data && errRes.data.length) {
				this.errorInfoList = errRes.data;
				this.$refs.errorModal2.open();
			} else {
				this.modalInvoiceFormSubmit();
			}
		},
		modalInvoiceFormSubmit() {
			// 插入发票选中数据
			// this.invoiceData = [];

			this.getInvoiceIds();
			this.modalInvoiceInfoIsShow = false;
		},
		modalInvoiceFormCancel() {
			this.modalInvoiceInfoIsShow = false;
		},
		searchInvoiceInfo() {
			// this.invoicePagination = {
			//   current: 1,
			// };
			this.getInvoiceInfo(this.params);
		},
		resetInvoiceInfo() {
			this.params = {
				code: '',
				no: '',
				issuedDateBegin: '',
				issuedDateEnd: ''
			};
			this.issuedDate = null;
			this.getInvoiceInfo();
		},
		onSelectInvoiceChange(selectedRowKeys) {
			this.invoiceSelectedRowKeys = selectedRowKeys;
		},
		getOrderNo() {
			let orderNo = null;
			if (this.invoiceType == 'up') {
				orderNo = this.orderNo;
			} else {
				if (this.bizLineInfo && this.bizLineSelectedRowKeys.length) {
					// eslint-disable-next-line no-undef
					let bz = _.find(this.bizLineInfo, { id: this.bizLineSelectedRowKeys[0] });
					if (bz && bz.orderNo) {
						let arr = bz.orderNo.split(',');
						let index = arr.indexOf(this.orderNo) + 1;
						orderNo = arr[index];
					}
				}
			}
			return orderNo;
		},
		getInvoiceIds() {
			const selectIds = [];
			this.invoiceData.forEach(item => {
				selectIds.push(item.id);
			});
			this.invoiceSelectedIds = selectIds.join(',');

			// 实时计算发票汇总
			API_PAYAPPinvoLYLIST({
				invoiceIds: selectIds,
				// orderId: 772,
				orderType: 'ONLINE',
				orderNo: this.getOrderNo()
			}).then(res => {
				if (res.success) {
					this.editDetail = {
						...this.editDetail,
						...res.result
					};
				}
			});
		}
	}
};
</script>
<style scoped lang="less">
.modal-invoice-info .search-wrap ::v-deep .ant-select {
	width: auto;
}
.inner-title {
	margin-left: 10px;
}
.title_icon {
	width: 12px;
	height: 16px;
	float: left;
	vertical-align: middle;
	margin: 0 14px;
	margin-top: 21px;
	background: url(~assets/imgs/menu/titleIcon.png) no-repeat right center;
}
.add-wrap {
	width: 100%;
	margin-top: 30px;
	background: #f9f9f9;
	border-top: 1px dashed #ddd;
	border-bottom: 1px dashed #ddd;
	text-align: center;
	padding: 10px 0;
	font-size: 14px;
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
.invo-box {
	display: flex;
	margin-bottom: 15px;

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
</style>
