<template>
	<div class="warp">
		<div class="invoice-list-methods">
			<p class="btn-wrap">
				<span
					class="batch-relation"
					:disabled="selectItemLength.length == 0"
					@click="batchRelation"
					v-if="invoiceList.length > 1"
					>批量关联</span
				>
			</p>
			<p
				class="select-all"
				v-if="invoiceList.length > 1"
			>
				<a-checkbox
					@change="onChangeSelectAll"
					:checked="checkAll"
				>
					全选
				</a-checkbox>
			</p>
		</div>
		<a-form :form="form">
			<div
				v-for="(item, index) in invoiceList"
				:key="index"
			>
				<div
					class="invoice-content"
					v-if="item.show"
				>
					<a-row class="invoice-item">
						<p class="invoice-title">
							<a-checkbox
								:checked="item.checked"
								:value="item.id"
								class="blod-front"
								@change="e => onChangeSelectItem(e, index)"
								v-if="invoiceList.length > 1"
							>
								{{ item.name }}
							</a-checkbox>
							<span
								class="invoice-list-delete cursor-pointer"
								v-if="invoiceList.length > 1"
								@click="deleteItem(item)"
							></span>
						</p>
						<div class="invoice-desc">
							<div class="invoice-desc-left">
								<p>
									<span>发票号码</span>
									<span class="invoice-attr">{{ item.myInvoiceDO && item.myInvoiceDO.no }}</span>
								</p>
								<p>
									<span>发票代码</span>
									<span class="invoice-attr">{{ item.myInvoiceDO && item.myInvoiceDO.code }}</span>
								</p>
								<p>
									<span>价税合计</span>
									<span class="invoice-attr">{{ item.myInvoiceDO && formateNumber(item.myInvoiceDO.totalAmount, 2) }}元</span>
								</p>
							</div>
							<div class="invoice-desc-right">
								<p>
									<span>含印花税合计</span>
									<span class="relation-count">{{
										item.myInvoiceDO && formateNumber(item.myInvoiceDO.stampTaxFlagTotalAmount, 2)
									}}</span>
									<span class="grid-font-color">元</span>
								</p>
								<p>
									<span>关联至合同金额合计（含印花税，元）</span>
									<span class="relation-amount">{{ formateNumber(qualityAndAmount[`amount_${index}`], 2) || 0 }}</span>
									<span class="grid-font-color">元</span>
								</p>
							</div>
						</div>
						<div class="table-wrap">
							<a-table
								:columns="columnsInvoiceRelationContract"
								:data-source="item.invoiceContractSplitList"
								:pagination="false"
								rowKey="key"
								:scroll="{ x: 1000, y: 300 }"
								id="invoice-list-tarns"
							>
								<span
									slot="contractNo"
									slot-scope="text, record"
								>
									<a-form-item>
										<a-select
											show-search
											:default-active-first-option="false"
											:filter-option="false"
											:show-arrow="false"
											:not-found-content="null"
											v-decorator="[
												'contractNo_' + index + '_' + record.key,
												{ rules: [{ required: true, message: '合同号必填' }] }
											]"
											@search="fetchUser"
											@change="handleChange"
										>
											<a-spin
												v-if="fetching"
												slot="notFoundContent"
												size="small"
											/>
											<a-select-option
												v-for="d in contractNoList"
												:key="d"
											>
												{{ d }}
											</a-select-option>
										</a-select>
									</a-form-item>
								</span>
								<span
									slot="splitAmount"
									slot-scope="text, record"
								>
									<a-form-item>
										<a-input-number
											:precision="2"
											:step="0.01"
											@change="amountAndQuality(index)"
											style="width: 100%"
											v-decorator="[
												'splitAmount_' + index + '_' + record.key,
												{
													rules: [
														{ required: true, message: '关联至合同金额必填!' },
														{ validator: (rule, value, cb) => (value <= 0 ? cb('金额必须大于0') : cb()) }
													]
												}
											]"
										/>
									</a-form-item>
								</span>
								<span slot="customTitle"
									>关联金额(元)
									<a-tooltip placement="top">
										<template slot="title">
											<span>税价合计</span>
										</template>
										<a-icon type="question-circle" />
									</a-tooltip>
								</span>
								<span
									slot="action"
									slot-scope="text, record"
								>
									<a-space>
										<a @click="deleteContractItem(item, index, record)">删除</a>
									</a-space>
								</span>
							</a-table>
							<p class="add-btn-wrap">
								<a-button
									type="link"
									icon="plus"
									@click="relationContractAdd(index)"
									>新增合同</a-button
								>
							</p>
						</div>
					</a-row>
				</div>
			</div>
		</a-form>
		<div class="footer-btn-wrap">
			<a-button
				class="width126px-height44px-button"
				type="primary"
				ghost
				@click="prev"
				>上一步</a-button
			>
			<a-button
				class="width126px-height44px-button"
				type="primary"
				style="margin-left: 60px"
				@click="submit"
				>提交</a-button
			>
		</div>
		<ContractList
			ref="contractList"
			v-on:select="getInvoiceList"
			:columns="columnsRelation"
		/>
	</div>
</template>

<script>
import { columnsInvoiceRelationContract, columnsRelation } from './table';
import { debounce, cloneDeep } from 'lodash';
import ContractList from '../../components/ContractList.vue';
import {
	API_GetListImgScanSuccessData,
	API_InvoiceListExcelScanSuccess,
	API_CONTRACT_SEARCH_LIST,
	API_INVOICE_SAVE
} from '@/v2/center/invoiceTools/api';
import { formateNumber } from '@/v2/utils/index';
import { nanoid } from 'nanoid';

export default {
	data() {
		this.lastFetchId = 0;
		this.fetchUser = debounce(this.fetchUser, 800);
		return {
			columnsInvoiceRelationContract,
			columnsRelation,
			form: this.$form.createForm(this, { name: 'coordinated' }),
			checkAll: false,
			indeterminate: true,
			invoiceList: [],
			contractNoList: [],
			fetching: false,
			qualityAndAmount: {}
		};
	},
	components: {
		ContractList
	},
	computed: {
		selectItemLength() {
			return this.invoiceList.filter(item => item.checked == true);
		}
	},
	methods: {
		formateNumber,
		unit(index) {
			if (this.invoiceList[index]?.list) {
				return this.invoiceList[index]?.list[0]?.unit || '';
			} else {
				return '';
			}
		},
		amountAndQuality(index) {
			this.$nextTick(() => {
				const formValues = this.form.getFieldsValue();
				let result = cloneDeep(this.qualityAndAmount);
				for (let i = 0; i < this.invoiceList.length; i++) {
					if (i == index) {
						result[`amount_${i}`] = 0;
					}
				}
				for (const key in formValues) {
					if (key.indexOf(`splitAmount_${index}`) >= 0 && formValues[key]) {
						result[`amount_${index}`] += Number(formValues[key]);
					}
				}
				this.qualityAndAmount = result;
			});
		},
		handleChange(value) {
			Object.assign(this, {
				value,
				contractNoList: [],
				fetching: false
			});
		},
		fetchUser(word) {
			this.fetching = true;
			this.contractNoList = [];
			this.lastFetchId += 1;
			const fetchId = this.lastFetchId;
			API_CONTRACT_SEARCH_LIST({
				keyword: word
			})
				.then(res => {
					if (res.success) {
						if (fetchId !== this.lastFetchId) {
							return;
						}
						if (!res.data.includes(word)) {
							res.data.unshift(word);
						}
						this.contractNoList = res.data;
					}
				})
				.finally(() => {
					this.fetching = false;
				});
		},
		computedAmount(list, item) {
			return list.reduce((pre, cur) => {
				return pre + cur[item];
			}, 0);
		},
		fetchInvoiceList() {
			if (this.$route.query?.type === 'picture') {
				this.getInvoiceDataList();
			} else {
				this.getInvoiceListExcelScanSucces();
			}
		},
		getInvoiceListExcelScanSucces() {
			API_InvoiceListExcelScanSuccess().then(res => {
				if (res.success) {
					res.data.forEach(item => {
						item.show = true;
						item.invoiceContractSplitList = [
							{
								key: nanoid(4),
								contractNo: '',
								sellerName: item?.myInvoiceDO?.sellerName,
								buyerName: item?.myInvoiceDO?.buyerName,
								splitAmount: this.computedAmount(item.list, 'amount'),
								// splitQuantity: this.computedAmount(item.list, "quantity"),
								singleAdd: true
							}
						];
					});
					this.invoiceList = res.data;
				}
			});
		},
		getInvoiceDataList() {
			API_GetListImgScanSuccessData()
				.then(res => {
					if (res.success) {
						res.data.forEach(item => {
							item.show = true;
							item.invoiceContractSplitList = [
								{
									key: nanoid(4),
									contractNo: '',
									sellerName: item?.myInvoiceDO?.sellerName,
									buyerName: item?.myInvoiceDO?.buyerName,
									splitAmount: this.computedAmount(item.list, 'amount'),
									// splitQuantity: this.computedAmount(item.list, "quantity"),
									singleAdd: true
								}
							];
						});
						this.invoiceList = res.data;
					}
				})
				.catch(() => {
					this.invoiceList = [];
				});
		},
		computedPostList(list, values) {
			let cloneList = cloneDeep(list);
			for (let i = 0; i < cloneList.length; i++) {
				for (let j = 0; j < cloneList[i].invoiceContractSplitList.length; j++) {
					if (cloneList[i].invoiceContractSplitList[j]) {
						cloneList[i].invoiceContractSplitList[j].contractNo =
							values[`contractNo_${i}_${cloneList[i].invoiceContractSplitList[j]['key']}`];
						cloneList[i].invoiceContractSplitList[j].splitAmount =
							values[`splitAmount_${i}_${cloneList[i].invoiceContractSplitList[j]['key']}`];
					}
				}
			}
			return cloneList;
		},
		submit() {
			this.form.validateFields((err, values) => {
				if (!err) {
					let submitList = this.computedPostList(this.invoiceList, values);
					API_INVOICE_SAVE({
						list: submitList.filter(item => item.show)
					}).then(res => {
						if (res.success) {
							if (res.data.success) {
								this.$message.success('提交成功');
								this.$router.replace('/center/admin/invoice/transport/list');
							} else {
								const h = this.$createElement;
								const messageObj = res.data.errorMsg;
								let messageHtml = [];
								for (const key in messageObj) {
									messageHtml.push(h('p', `${key}:${messageObj[key]}`));
								}
								this.$warning({
									title: '提示',
									content: h('div', {}, messageHtml)
								});
							}
						}
					});
				}
			});
		},
		onChangeSelectAll(e) {
			this.checkAll = e.target.checked;
			this.invoiceList.forEach((item, index) => {
				let cloneItem = cloneDeep(item);
				cloneItem.checked = e.target.checked;
				this.$set(this.invoiceList, index, cloneItem);
			});
		},
		onChangeSelectItem(e, index) {
			let cloneItem = cloneDeep(this.invoiceList[index]);
			cloneItem.checked = e.target.checked;
			this.$set(this.invoiceList, index, cloneItem);
		},
		deleteItem(item) {
			item.show = false;
		},
		deleteContractItem(item, index, record) {
			const cloneItem = cloneDeep(item);
			let key = -1;
			for (let i = 0; i < cloneItem.invoiceContractSplitList.length; i++) {
				if (cloneItem.invoiceContractSplitList[i].key == record.key) {
					key = i;
					break;
				}
			}
			if (key >= 0) {
				cloneItem.invoiceContractSplitList.splice(key, 1);
			}
			this.$set(this.invoiceList, index, cloneItem);
			if (this.invoiceList[index].invoiceContractSplitList.length == 0) {
				this.relationContractAdd(index);
			}
			this.amountAndQuality(index);
		},
		batchRelation() {
			const temp = this.computedPostList(this.invoiceList, this.form.getFieldsValue());
			const list = temp.filter(item => item.checked);
			if (!list.length) {
				this.$message.warn('请先勾选发票');
				return;
			}
			this.$refs.contractList.showModal(list.filter(item => item.show));
		},
		relationContractAdd(index) {
			// let preIndex = this.invoiceList[index].invoiceContractSplitList.length;
			let cloneItem = cloneDeep(this.invoiceList[index]);
			cloneItem.invoiceContractSplitList.push({
				key: nanoid(4),
				contractNo: '',
				sellerName: cloneItem?.myInvoiceDO?.sellerName,
				buyerName: cloneItem?.myInvoiceDO?.buyerName,
				splitAmount: '',
				// splitQuantity: "",
				singleAdd: true
			});
			this.$set(this.invoiceList, index, cloneItem);
			this.$nextTick(() => {
				if (this.invoiceList[index].invoiceContractSplitList.length == 1) {
					this.form.setFieldsValue({
						[`contractNo_${index}_0`]: '',
						[`splitAmount_${index}_0`]: ''
						// [`splitQuantity_${index}_0`]: '',
					});
				}
				const parentElem = document.querySelector('#invoice-list-tarns');
				const tableElem = parentElem.querySelector('.ant-table-body');
				tableElem.scrollTop = tableElem.scrollHeight;
			});
			this.amountAndQuality();
		},
		prev() {
			this.$router.back();
		},
		getInvoiceList(list) {
			this.invoiceList = this.computedPostList(this.invoiceList, this.form.getFieldsValue());
			for (let i = 0; i < list.length; i++) {
				for (let j = 0; j < this.invoiceList.length; j++) {
					if (list[i].no === this.invoiceList[j].myInvoiceDO.no) {
						let cloneItem = cloneDeep(this.invoiceList[j]);
						cloneItem.invoiceContractSplitList.push({
							key: nanoid(4),
							contractNo: list[i].contractNo,
							sellerName: list[i].sellerName,
							buyerName: list[i].buyerName,
							splitAmount: list[i].splitAmount
							// splitQuantity: list[i].splitQuantity,
						});

						let obj = {};
						cloneItem.invoiceContractSplitList = cloneItem.invoiceContractSplitList
							.filter(item => item.contractNo)
							.reverse()
							.reduce(function (item, next) {
								obj[next.contractNo] ? '' : (obj[next.contractNo] = true && item.push(next));
								return item;
							}, []);

						this.$set(this.invoiceList, j, cloneItem);
					}
				}
			}
			this.setFormValues();
		},
		setFormValues() {
			this.$nextTick(() => {
				for (let i = 0; i < this.invoiceList.length; i++) {
					for (let j = 0; j < this.invoiceList[i].invoiceContractSplitList.length; j++) {
						let item = this.invoiceList[i].invoiceContractSplitList[j];
						// if(!item.singleAdd) {
						this.form.setFieldsValue({
							[`contractNo_${i}_${item.key}`]: item.contractNo,
							[`sellerName_${i}_${item.key}`]: item.sellerName,
							[`buyerName_${i}_${item.key}`]: item.buyerName,
							[`splitAmount_${i}_${item.key}`]: item.splitAmount
							// [`splitQuantity_${i}_${item.key}`]: item.splitQuantity,
						});
						// }
					}
				}
			});
			this.invoiceList.forEach((item, index) => {
				this.amountAndQuality(index);
			});
		}
	},
	mounted() {
		this.fetchInvoiceList();
	}
};
</script>

<style lang="less" scoped>
.btn-wrap {
	width: 100%;
	height: 32px;
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
	margin-top: 0;
}
.invoice-content {
	width: 100%;
	margin-bottom: 20px;
}
.select-all {
	width: 100%;
	height: 40px;
	margin-bottom: 20px;
	padding: 10px 20px;
	border-bottom: 1px solid #e9effc;
	box-sizing: border-box;
}
.invoice-item {
	width: 100%;
	min-height: 300px;
	background: #ffffff;
	border-radius: 14px;
	border: 1px solid #e9effc;
	overflow: hidden;
}
.invoice-title {
	width: 100%;
	height: 66px;
	background: rgba(70, 130, 243, 0.1);
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	padding: 0 20px;
}
.invoice-desc {
	width: 100%;
	height: 108px;
	display: flex;
	padding: 20px 20px 24px 60px;
	background: #fff;
}
.invoice-desc-left {
	flex: 3;
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	border-right: 1px solid #e9effc;
	p {
		width: 50%;
	}
}
.invoice-desc-right {
	flex: 1;
	padding-left: 40px;
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	justify-content: space-between;
	p {
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}
}
.invoice-attr {
	font-size: 14px;
	font-family:
		PingFangSC-Regular,
		PingFang SC;
	font-weight: 400;
	color: #8495aa;
	line-height: 22px;
	display: inline-block;
	margin-left: 14px;
}
.grid-font-color {
	color: #8495aa;
}
.relation-count,
.relation-amount {
	width: auto;
	height: 26px;
	display: inline-block;
	margin: 0 12px 0 14px;
	line-height: 26px;
	// overflow: hidden;
	// text-overflow: ellipsis;
	// white-space: nowrap;
}
.relation-count {
	font-size: 18px;
	font-family: D-DIN-PRO-Medium, D-DIN-PRO;
	font-weight: 500;
	color: rgba(0, 0, 0, 0.8);
}
.relation-amount {
	font-size: 18px;
	font-family: D-DIN-PRO-Medium, D-DIN-PRO;
	font-weight: 500;
	color: #f46332;
}
.add-btn-wrap {
	width: 100%;
	height: 52px;
	line-height: 52px;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	.ant-btn-link {
		color: #8495aa;
		font-weight: 400;
	}
}
.table-wrap {
	width: 100%;
	padding: 0 20px;
}
.cursor-pointer {
	cursor: pointer;
}
.blod-front {
	font-size: 18px;
	font-weight: 500;
	color: rgba(0, 0, 0, 0.8);
}
.footer-btn-wrap {
	width: calc(100% - 208px);
	height: 84px;
	background: #fff;
	position: fixed;
	bottom: 0;
	right: 0;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
}
.invoice-list-methods {
	position: sticky;
	top: -20px;
	left: 0;
	z-index: 999;
	background: #fff;
}
.invoice-list-delete {
	width: 24px;
	height: 24px;
	display: inline-block;
	background-image: url('~@/v2/assets/imgs/invoicetools/delete.png');
	background-size: 24px 24px;
	background-repeat: no-repeat;
}
.invoice-content:hover {
	box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
	border-radius: 14px;
}
</style>
<style lang="less" scoped>
@import url('~@/v2/style/invoiceTools/common.less');
</style>
