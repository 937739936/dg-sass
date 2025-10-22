<template>
	<div>
		<p class="title">发票与订单关联信息</p>
		<a-row
			style="margin-bottom: 15px"
			type="flex"
			justify="space-between"
		>
			<a-col>
				发票张数<span style="padding-left: 50px">{{ total }} 张</span>
			</a-col>
			<a-col>
				价税合计总额<span style="padding-left: 50px">{{ fillDecimal(sum).toLocaleString() }}</span>
			</a-col>
			<a-col>
				含印花税合计总额<span style="padding-left: 50px">{{ fillDecimal(sum + sumyhs).toLocaleString() }}</span>
			</a-col>
			<a-col>
				<a-button
					type="primary"
					@click="showBatchRelation(1, {})"
					>批量关联合同</a-button
				>
			</a-col>
		</a-row>
		<a-form :form="form">
			<a-table
				:columns="columns"
				:dataSource="dataSourceCopy"
				:pagination="false"
				:scroll="{ x: true }"
				:loading="loadingTableData"
				:row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
				:rowKey="record => record.key"
			>
				<template
					slot="splitAmount"
					slot-scope="text, records"
				>
					<a-form-item
						:label="false"
						:colon="false"
					>
						<a-input-number
							:min="0"
							:precision="2"
							style="width: 150px"
							@focus="handleFocusSplitAmount(records)"
							@change="handleChangeSplitAmount"
							placeholder="请输入"
							v-decorator="[
								setDecoratorName(records, 'splitAmount'),
								{
									initialValue: text,
									rules: [{ required: true, message: '发票拆分金额必填' }]
								}
							]"
						/>
					</a-form-item>
					<!-- <template v-else>{{ text }}</template> -->
				</template>

				<template
					slot="action"
					slot-scope="action, item"
				>
					<a
						style="margin-right: 8px"
						@click="del(item)"
						>删除发票</a
					>
					<template v-if="!isOrderNo">
						<a
							v-if="item.orderNo && !item.invoice"
							style="margin-right: 8px"
							@click="deleContract(item)"
							>删除关联</a
						>
					</template>
					<a
						@click="showBatchRelation(0, item)"
						v-if="!isOrderNo"
						>关联合同</a
					>
				</template>
			</a-table>
		</a-form>

		<div
			class="tc"
			style="margin-top: 20px"
		>
			<a-button
				ghost
				type="primary"
				style="margin-right: 16px"
				@click="cancel"
				>取消</a-button
			>
			<a-button
				type="primary"
				:disabled="loading"
				@click="save"
				>保存</a-button
			>
		</div>
		<ContractList
			ref="contractList"
			:type="type"
			@getContract="getContract"
			:selectCheckType="selectCheckType"
		></ContractList>
		<a-modal
			class="modal"
			:header="null"
			:visible="visible"
			@cancel="
				() => {
					visible = false;
				}
			"
		>
			<div
				v-html="strMsg"
				style="text-align: center"
			></div>
			<a-button
				type="primary"
				@click="confirmModal"
				style="display: block; margin: 30px auto 0"
				>确定</a-button
			>
		</a-modal>
		<a-modal
			class="modal"
			title="提示"
			:visible="errorVisible"
			@ok="
				() => {
					errorVisible = false;
				}
			"
			@cancel="
				() => {
					errorVisible = false;
				}
			"
		>
			<div>
				<p
					v-for="(item, index) in errorInfoList"
					:key="index"
				>
					#<span
						v-for="(item2, index2) in item.codeList"
						:key="index2"
					>
						{{ item2 }}
						<span v-if="!(index2 == item.codeList.length - 1)">,</span> </span
					>#
					<span>{{ item.message }}</span>
				</p>
			</div>
		</a-modal>
		<a-modal
			title="批量关联信息"
			:visible="visibleBatch"
			@ok="handleBatchOk"
			@cancel="visibleBatch = false"
			destroyOnClose
		>
			<a-form
				:form="formBatch"
				:label-col="{ span: 8 }"
				:wrapper-col="{ span: 12 }"
			>
				<a-form-item label="关联合同">
					<a-input
						v-decorator="['contract', { rules: [{ required: true, message: '请选择关联合同!' }] }]"
						@click="popContractList(1, {})"
					/>
				</a-form-item>
				<a-form-item
					label="订单号"
					style="display: none"
				>
					<a-input v-decorator="['orderNo', { rules: [{ required: false, message: '' }] }]" />
				</a-form-item>
				<a-form-item
					label="合同类型"
					style="display: none"
				>
					<a-input v-decorator="['contractType', { rules: [{ required: false, message: '' }] }]" />
				</a-form-item>
				<a-form-item label="发票拆分金额(含税)(元)">
					<a-input-number
						style="width: 100%"
						:min="0"
						:precision="2"
						v-decorator="[
							'amount',
							{
								rules: [{ required: false, message: '' }]
							}
						]"
						placeholder="发票拆分金额(含税)(元)"
					>
					</a-input-number>
				</a-form-item>
			</a-form>
		</a-modal>
	</div>
</template>

<script lang="jsx">
import { fillDecimal } from 'untils/factory.js';
import ContractList from './ContractList.vue';
import { API_InvoiceBatchSave, batchInvoiceCheck } from 'api';
import { cloneDeep } from 'lodash';
import { mapGetters } from 'vuex';
import { filterCodeByValueName } from '@sub/utils/globalCode.js';

const tradeColumns = [
	{
		title: '发票代码',
		dataIndex: 'myInvoiceDO.code'
	},
	{
		title: '发票号码',
		dataIndex: 'myInvoiceDO.no'
	},
	{
		title: '价税合计（元）',
		dataIndex: 'myInvoiceDO.totalAmount'
		// customRender: (text) => {
		//   return (+text).toLocaleString()
		// }
	},
	{
		title: '卖方名称',
		dataIndex: 'myInvoiceDO.sellerName'
	},
	{
		title: '买方名称',
		dataIndex: 'myInvoiceDO.buyerName'
	},
	{
		title: '开票日期',
		dataIndex: 'myInvoiceDO.issuedDate'
	},
	{
		title: '发票类型',
		dataIndex: 'myInvoiceDO.invoiceType',
		customRender: text => {
			return filterCodeByValueName(text, 'invoice_type') || text;
		},
		fixed: 'right'
	},
	{
		title: '关联合同编号',
		dataIndex: 'contractNo',
		fixed: 'right'
	},
	{
		title: '发票拆分金额(含税)(元)',
		dataIndex: 'splitAmount',
		scopedSlots: { customRender: 'splitAmount' },
		fixed: 'right'
	},
	{
		title: '操作',
		dataIndex: 'action',
		fixed: 'right',
		scopedSlots: { customRender: 'action' }
	}
];

const freightColumns = [
	{
		title: '发票代码',
		dataIndex: 'myInvoiceDO.code'
	},
	{
		title: '发票号码',
		dataIndex: 'myInvoiceDO.no'
	},
	{
		title: '价税合计（元）',
		dataIndex: 'myInvoiceDO.totalAmount'
		// customRender: (text) => {
		//   return (+text).toLocaleString()
		// }
	},
	{
		title: '印花税税额（元）',
		dataIndex: 'myInvoiceDO.stampTaxFlagAmount'
	},
	{
		title: '卖方名称',
		dataIndex: 'myInvoiceDO.sellerName'
	},
	{
		title: '买方名称',
		dataIndex: 'myInvoiceDO.buyerName'
	},
	{
		title: '开票日期',
		dataIndex: 'myInvoiceDO.issuedDate'
	},
	{
		title: '发票类型',
		dataIndex: 'myInvoiceDO.invoiceType',
		customRender: text => {
			return filterCodeByValueName(text, 'invoice_type') || text;
		},
		fixed: 'right'
	},
	{
		title: '关联合同编号',
		dataIndex: 'contractNo',
		fixed: 'right'
	},
	{
		title: '发票拆分金额(含税)(元)',
		dataIndex: 'splitAmount',
		scopedSlots: { customRender: 'splitAmount' },
		fixed: 'right'
	},
	{
		title: '操作',
		dataIndex: 'action',
		fixed: 'right',
		scopedSlots: { customRender: 'action' }
	}
];

export default {
	props: {
		type: {
			type: String,
			default: ''
		},
		isBatch: {
			type: Boolean,
			default: false
		},
		dataSource: {
			type: Array,
			default: () => {
				return [];
			}
		},
		invoiceImgList: {
			type: Array,
			default: () => {
				return [];
			}
		}
	},
	components: {
		ContractList
	},
	data() {
		return {
			fillDecimal,
			step: 2,
			tradeColumns,
			freightColumns,
			columns: [],
			loading: false,
			total: 0,
			form: this.$form.createForm(this),
			dataSourceCopy: [],
			orderNoList: [],
			isOrderNo: false,
			curChangeInvoiceTypeData: '',
			curChangeInvoiceSplitAmountData: '',
			sum: 0,
			sumyhs: 0,
			strMsg: '', // 保存时发票状态错误提示信息内容
			visible: false, // 保存时发票状态错误提示信息弹窗
			errorVisible: false,
			errorInfoList: [],
			selectedRowKeys: [],
			selectCheckType: 0,
			visibleBatch: false,
			formBatch: this.$form.createForm(this, { name: 'formBatch' }),
			selectItemBatch: [],
			loadingTableData: false
		};
	},
	watch: {
		dataSource: {
			handler(value) {
				if (!value) {
					this.loadingTableData = true;
				} else {
					this.loadingTableData = false;
				}
				this.dataSourceCopy = cloneDeep(this.dataSource);
				this.dataSourceCopy.forEach(item => {
					item.key = item.myInvoiceDO.no + '&&' + item.orderNo || 'null';
					item.contractNo = item.contractNo || '';
				});
				if (this.isOrderNo) {
					this.dataSourceCopy.forEach(item => {
						item.orderNo = this.$route.query.orderNo;
						item.contractNo = this.$route.query.contractNo;
						item.contractType = this.$route.query.contractType;
					});
				}
			},
			deep: true,
			immediate: true
		},
		dataSourceCopy: {
			deep: true,
			handler(value, old) {
				this.calcInvoiceData();
				if (value?.length != old?.length) {
					this.updateSelectRowKeys();
				}
			}
		}
	},
	created() {
		this.columns = this.type == 'freight' ? this.freightColumns : this.tradeColumns;
		this.dataSourceCopy = cloneDeep(this.dataSource);
		if (this.$route.query.orderNo) {
			this.isOrderNo = true;
			this.dataSourceCopy.forEach(item => {
				item.orderNo = this.$route.query.orderNo;
				item.contractType = this.$route.query.contractType;
			});
		}
	},
	computed: {
		...mapGetters('config', {
			VUEX_ST_ALLCODE: 'VUEX_ST_ALLCODE'
		})
	},
	methods: {
		updateSelectRowKeys() {
			const ids = this.dataSourceCopy.map(item => item.key);
			this.selectedRowKeys.forEach((item, index) => {
				if (!ids.includes(item)) {
					this.selectedRowKeys.splice(index, 1);
				}
			});
		},
		uniqueArr(arr, uniId) {
			const res = new Map();
			let tempArr = [];
			tempArr = arr.filter(item => !res.has(item[uniId]) && res.set(item[uniId], 1));
			let spliceArr = [];
			let result = [];
			tempArr.forEach((item, index) => {
				if (this.selectedRowKeys.includes(item.key) && !item.contractNo) {
					spliceArr.push(index);
				}
			});
			tempArr.forEach((item, index) => {
				if (!spliceArr.includes(index)) {
					result.push(item);
				}
			});
			return result;
		},
		getSelectItemByKey(key) {
			return this.dataSourceCopy.filter(item => item.key == key)[0];
		},
		findIndex(key) {
			for (let i = 0; i < this.dataSourceCopy.length; i++) {
				if (this.dataSourceCopy[i].key == key) {
					return i;
				}
			}
		},
		setSelectList() {
			let cloneList = cloneDeep(this.dataSourceCopy);
			this.dataSourceCopy.forEach(item => {
				if (this.selectedRowKeys.includes(item.key)) {
					let cloneItem = cloneDeep(this.getSelectItemByKey(item.key));
					cloneItem.contractNo = this.selectItemBatch[0].contractNo;
					cloneItem.splitAmount = this.formBatch.getFieldValue('amount');
					cloneItem.orderNo = this.formBatch.getFieldValue('orderNo');
					cloneItem.contractType = this.formBatch.getFieldValue('contractType');
					cloneItem.key = item.myInvoiceDO.no + '&&' + this.formBatch.getFieldValue('orderNo');
					cloneList.splice(this.findIndex(item.key), 0, cloneItem);
				}
			});

			this.dataSourceCopy = this.uniqueArr(cloneList, 'key');
			this.selectedRowKeys = [];
			this.visibleBatch = false;
		},
		handleBatchOk() {
			const total = this.formBatch.getFieldValue('amount');
			this.$confirm({
				centered: true,
				title: '确定提交关联信息',
				content: `发票号码【${this.getInvoiceIds()}】,关联合同编号【${this.selectItemBatch[0].contractNo}】,发票拆分金额(含税)(元):${total ? total?.toFixed(2) : '无'}`,
				okText: '确定',
				cancelText: '取消',
				icon: () => {
					return (
						<a-icon
							type="question-circle"
							theme="filled"
						/>
					);
				},
				onOk: () => {
					return new Promise((resolve, reject) => {
						this.setSelectList();
						setTimeout(() => {
							resolve();
						}, 1000);
					});
				}
			});
		},
		getInvoiceIds() {
			const tempArr = [];
			this.selectedRowKeys.forEach(item => {
				tempArr.push(item?.split('&&')[0]);
			});
			return [...new Set(tempArr)].join(',');
		},
		onSelectChange(selectedRowKeys) {
			this.selectedRowKeys = selectedRowKeys;
		},
		getCheckboxProps(record) {
			return {
				props: {
					disabled: !record.invoice
				}
			};
		},
		setDecoratorName(records, str) {
			return records.orderNo ? str + records.orderNo + records.myInvoiceDO.no : str + records.myInvoiceDO.no;
		},

		getContract(selectedOrderNoList, selectedOrderNoData, type) {
			this.selectItemBatch = selectedOrderNoData;
			if (type == 1) {
				this.formBatch.setFieldsValue({
					contract: selectedOrderNoData[0].contractNo,
					orderNo: selectedOrderNoData[0].orderNo,
					contractType: selectedOrderNoData[0].contractType
				});
				return;
			}
			// 先剔除数据中本次取消的合同
			// this.dataSourceCopy.forEach((item, index) => {
			//   if (this.curInvoice?.myInvoiceDO?.no === item.myInvoiceDO.no) {
			//     if (!selectedOrderNoList.includes(item.orderNo) && item.orderNo) {
			//       this.dataSourceCopy.splice(index, 1)
			//     }
			//   }
			// })

			const tempArr = [];
			const selectedOrderNoListCopy = [...selectedOrderNoList];
			// 剔除之前绑定的合同，只处理新增的
			selectedOrderNoList.forEach(item => {
				if (this.orderNoList.includes(item)) {
					selectedOrderNoListCopy.splice(
						selectedOrderNoListCopy.findIndex(i => item === i),
						1
					);
				}
			});
			selectedOrderNoList = selectedOrderNoListCopy;

			// data = [...new Set([...data, ...this.orderNoList])]
			selectedOrderNoList.forEach(item => {
				let contractType = '',
					contractNo = '';
				selectedOrderNoData.forEach(i => {
					if (i.orderNo === item) {
						contractType = i.contractType;
						contractNo = i.contractNo;
					}
				});
				tempArr.push({
					...cloneDeep(this.curInvoice),
					orderNo: item,
					contractNo,
					contractType,
					splitAmount: '',
					key: this.curInvoice.myInvoiceDO.no + '&&' + item
				});
			});

			const splitAmount = this.curInvoice.splitAmount;
			if (splitAmount && !this.curInvoice.orderNo) {
				tempArr[tempArr.length - 1].splitAmount = splitAmount;
			}

			const dataSource = cloneDeep(this.dataSourceCopy);
			let firstItemIndex = -1;
			this.dataSourceCopy.forEach((item, index) => {
				if (this.curInvoice?.myInvoiceDO?.no === item.myInvoiceDO.no) {
					if (this.orderNoList.length <= 0) {
						dataSource.splice(
							dataSource.findIndex(item => item.myInvoiceDO.no === this.curInvoice.myInvoiceDO.no),
							1,
							...tempArr
						);
					} else {
						if (firstItemIndex < 0) {
							firstItemIndex = index;
							dataSource.splice(firstItemIndex, 0, ...tempArr);
						}
					}
				}
			});
			this.dataSourceCopy = dataSource;
		},

		save() {
			this.form.validateFieldsAndScroll(async err => {
				let isOrderNo = true;
				const existList = this.invoiceImgList.filter(el => el.result == 'PASS' && el.id);
				if (!existList.length) {
					if (!this.dataSourceCopy.length) {
						this.$message.info('发票数据为空');
						return;
					}
					this.dataSourceCopy.forEach(item => {
						if (!item.orderNo) {
							isOrderNo = false;
						}
					});
					if (!isOrderNo) {
						this.$message.info('发票必须关联合同');
						return;
					}
					let item = this.dataSourceCopy.find(el => !el.splitAmount);
					if (item) {
						this.$message.error(`合同编号：${item.contractNo}发票拆分金额必须大于0,请核实`);
						return;
					}
					const splitAmountList = this.dataSourceCopy.map(el => el.splitAmount);
					// 总拆分金额
					const totalSplitAmount = splitAmountList.reduce((sum, current) => {
						return (sum += Number(current));
					}, 0);
					// 是否有印花税税额
					// 印花税税额
					// const stampTaxFlagTotalAmount = this.fillDecimal(this.sum+this.sumyhs)
					// if(this.type =='freight' && stampTaxFlagTotalAmount > 0) {

					//   if(totalSplitAmount > stampTaxFlagTotalAmount ) {
					//     this.$message.error(`拆分金额不能大于含印花税合计,请核实`)
					//     return
					//   }
					// }
				}
				if (!err) {
					const params = {
						splitList: this.dataSourceCopy,
						existList
					};
					const errRes = await batchInvoiceCheck(params);
					if (errRes.data && errRes.data.length) {
						this.errorInfoList = errRes.data.map(el => {
							const obj = {};
							for (let key in el) {
								obj.message = key;
								obj.codeList = [...new Set(el[key])];
							}
							return obj;
						});
						this.errorVisible = true;
						return;
					}
					this.loading = true;

					API_InvoiceBatchSave(params)
						.then(res => {
							if (res.success) {
								if (res.data) {
									this.dataSourceCopy.forEach(item => {
										if (item.myInvoiceDO.state == 'INVALID') {
											this.strMsg += '<p>发票号码' + item.myInvoiceDO.no + '的发票，已作废，存入【异常发票记录】</p>';
										}
										if (item.myInvoiceDO.state == 'RED_DASHED') {
											this.strMsg += '<p>发票号码' + item.myInvoiceDO.no + '的发票，已红冲，存入【异常发票记录】</p>';
										}
									});
									if (this.strMsg) {
										this.visible = true;
									} else {
										this.$message.success('保存成功');
										if (this.isOrderNo) {
											if (this.$route.query.manuaId) {
												this.$router.push({
													path: '/center/assets/' + this.$route.query.ref,
													query: {
														id: this.$route.query.manuaId,
														activeIndex: 6
													}
												});
												return;
											}
											let { upOrderNo, downOrderNo, businessLineType, contractType, contractContentActiveIndex, cashTabIndex } =
												this.$route.query;
											contractType = contractType == 'UP' ? 0 : 1;
											this.$router.push({
												path: '/center/monitoring/dynamicMonitoring/detail',
												query: {
													upOrderNo,
													downOrderNo,
													businessLineType,
													contractType,
													contractContentActiveIndex,
													cashTabIndex,
													businessLineNo: this.$route.query.businessLineNo
												}
											});
											return;
										}
										this.$router.go(-1);
									}
								} else {
									this.$message.error('保存失败');
								}
							}
						})
						.finally(() => {
							this.loading = false;
						});
				}
			});
		},
		confirmModal() {
			this.visible = false;
			if (this.isOrderNo) {
				// const { orderNo, activeIndex, downstreamActiveIndex } = this.$route.query
				this.$router.push({
					path: '/center/monitoring/dynamicMonitoring/detail',
					query: {
						...this.$route.query
					}
				});
				return;
			}
			this.$router.go(-1);
		},

		del(data) {
			this.$confirm({
				centered: true,
				title: '确认提示',
				content: '确认删除此条发票吗？',
				okText: '确定',
				cancelText: '取消',
				icon: () => {
					return (
						<a-icon
							type="exclamation-circle"
							theme="filled"
						/>
					);
				},
				onOk: () => {
					if (data.orderNo) {
						if (
							this.dataSourceCopy.findIndex(item => item.myInvoiceDO.no === data.myInvoiceDO.no) > -1 &&
							this.dataSourceCopy.findIndex(item => item.orderNo === data.orderNo) > -1
						) {
							this.dataSourceCopy.splice(
								this.dataSourceCopy.findIndex(item => item.myInvoiceDO.no === data.myInvoiceDO.no),
								1
							);
						}
						return;
					}

					if (this.dataSourceCopy.findIndex(item => item.myInvoiceDO.no === data.myInvoiceDO.no) > -1) {
						this.dataSourceCopy.splice(
							this.dataSourceCopy.findIndex(item => item.myInvoiceDO.no === data.myInvoiceDO.no),
							1
						);
					}
				},
				onCancel() {}
			});
		},

		// 计算发票张数和价税合计总额
		calcInvoiceData() {
			let invoiceNoList = [];
			this.total = 0;
			this.sum = 0;
			this.sumyhs = 0;
			this.dataSourceCopy.forEach(item => {
				if (!invoiceNoList.includes(item.myInvoiceDO.no)) {
					invoiceNoList.push(item.myInvoiceDO.no);
					this.total += 1;
					this.sum += +item.myInvoiceDO.totalAmount || 0;
					this.sumyhs += +item.myInvoiceDO.stampTaxFlagAmount || 0;
				}
			});
		},

		cancel() {
			this.$confirm({
				centered: true,
				title: '确认提示',
				content: '系统可能不会保存您所做的更改，确定要离开吗？',
				okText: '确定',
				cancelText: '取消',
				icon: () => {
					return (
						<a-icon
							type="exclamation-circle"
							theme="filled"
						/>
					);
				},
				onOk: () => {
					this.$emit('changeStep', 1);
					// this.$router.go(-1)
				},
				onCancel() {}
			});
		},

		handleFocus(v) {
			this.curChangeInvoiceTypeData = v;
		},

		handleChange(v) {
			const tempDataSource = cloneDeep(this.dataSourceCopy);
			const fields = {};
			tempDataSource.forEach(item => {
				if (this.curChangeInvoiceTypeData.myInvoiceDO.no == item.myInvoiceDO.no) {
					item.myInvoiceDO.invoiceType = v;
					fields[this.setDecoratorName(item, 'invoiceType')] = v;
				}
			});
			this.form.setFieldsValue(fields);
			this.dataSourceCopy = tempDataSource;
		},

		handleFocusSplitAmount(v) {
			this.curChangeInvoiceSplitAmountData = v;
		},

		handleChangeSplitAmount(v) {
			this.dataSourceCopy.forEach(item => {
				if (this.curChangeInvoiceSplitAmountData.orderNo) {
					if (
						this.curChangeInvoiceSplitAmountData.orderNo === item.orderNo &&
						this.curChangeInvoiceSplitAmountData.myInvoiceDO.no == item.myInvoiceDO.no
					) {
						item.splitAmount = v;
					}
				} else {
					if (this.curChangeInvoiceSplitAmountData.myInvoiceDO.no == item.myInvoiceDO.no) {
						item.splitAmount = v;
					}
				}
			});
		},
		showBatchRelation(type, data = {}) {
			if (type == 1) {
				if (!this.selectedRowKeys.length) {
					this.$message.warn('请先勾选要关联的发票');
				} else {
					this.visibleBatch = true;
				}
			} else {
				this.popContractList(type, data);
			}
		},
		popContractList(type, data = {}) {
			this.selectCheckType = type;
			this.curInvoice = {
				...data
			};
			this.orderNoList = [];
			this.dataSourceCopy.forEach(item => {
				if (data.myInvoiceDO && data.myInvoiceDO.no == item.myInvoiceDO.no && item.orderNo) {
					this.orderNoList.push(item.orderNo);
				}
			});
			this.$refs.contractList.showModal(this.orderNoList);
		},
		deleContract(data) {
			this.$confirm({
				centered: true,
				title: '确认提示',
				content: '确认删除此条关联吗？',
				okText: '确定',
				cancelText: '取消',
				icon: () => {
					return (
						<a-icon
							type="exclamation-circle"
							theme="filled"
						/>
					);
				},
				onOk: () => {
					const ids = this.dataSourceCopy.filter(item => item.myInvoiceDO.no == data.myInvoiceDO.no);
					if (ids.length > 1) {
						for (let i = 0; i < this.dataSourceCopy.length; i++) {
							if (this.dataSourceCopy[i].key == data.key) {
								this.dataSourceCopy.splice(i, 1);
							}
						}
					} else {
						let cloneItem = cloneDeep(data);
						let cloneIndex = this.dataSourceCopy.findIndex(item => item.key == data.key);
						cloneItem.contractNo = '';
						cloneItem.splitAmount = '';
						cloneItem.orderNo = '';
						cloneItem.key = cloneItem.myInvoiceDO.no + '&&' + 'null';
						this.$set(this.dataSourceCopy, cloneIndex, cloneItem);
					}
				},
				onCancel() {}
			});
		},
		next() {
			this.step = 2;
		}
	}
};
</script>
<style lang="less" scoped>
::v-deep {
	.ant-form-item {
		margin-bottom: 0;
	}
}
.r {
	color: #f24e4d;
}
.wrapper {
	background-color: #f4f5f8;
	margin: -10px -20px;
}
.title {
	font-size: 12px;
	color: #383a3f;
	text-align: left;
	line-height: 18px;
	padding-bottom: 15px;
}
.modal ::v-deep.ant-modal-close {
	display: none;
}
</style>
