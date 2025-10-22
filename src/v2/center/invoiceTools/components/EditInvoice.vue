<template>
	<a-modal
		:title="title"
		:visible="visible"
		@ok="handleOk"
		@cancel="handleCancel"
		width="1200px"
		destroyOnClose
		:maskClosable="false"
		class="new-modal"
	>
		<div class="edit-invoice-wrap">
			<p class="invoice-info">
				<span>发票号码：{{ invoiceData.no }}</span>
				<span class="invoice-code">发票代码：{{ invoiceData.code }}</span>
			</p>
			<div class="info-warp">
				<p class="title">关联合同信息</p>
				<p class="computed-total">
					<span>
						<span
							style="margin-right: 20px"
							v-if="type == '1'"
							>数量：{{ formateNumber(compotedTotalAmount('invoiceItemList', 'quantity'), 4) }}{{ unit }}</span
						>
						<span>价税合计：{{ formateNumber(invoiceData.totalAmount, 2) }}元</span>
					</span>
					<span>
						<span
							style="margin-right: 20px"
							v-if="type == '1'"
							>已关联至合同的数量：{{ formateNumber(splitQuantityTotal, 4) }}{{ unit }}</span
						>
						<span
							style="margin-right: 20px"
							v-if="type == '2'"
							>含印花税合计：{{ formateNumber(invoiceData.stampTaxFlagTotalAmount, 2) }}元</span
						>
						<span v-if="type == '1'">已关联至合同的金额：{{ formateNumber(splitAmountTotal, 2) }}元</span>
						<span v-if="type == '2'">关联至合同金额合计（含印花税，元）：{{ formateNumber(splitAmountTotal, 2) }}元</span>
					</span>
				</p>
				<a-form :form="form">
					<a-table
						:columns="columns"
						:data-source="invoiceData.invoiceContractRelList"
						:pagination="false"
						rowKey="key"
						:scroll="{ x: true, y: 300 }"
						class="new-table"
					>
						<span slot="splitQuantity">关联至合同数量({{ unit }})</span>
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
									v-decorator="['contractNo_' + record.key, { rules: [{ required: true, message: '合同号必填!' }] }]"
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
									style="width: 100%"
									@change="splitAmountAndsplitQuantity(1)"
									v-decorator="[
										'splitAmount_' + record.key,
										{
											rules: [
												{ required: true, message: '关联至合同金额必填!' },
												{ validator: (rule, value, cb) => (value <= 0 ? cb('金额必须大于0!') : cb()) }
											]
										}
									]"
								/>
							</a-form-item>
						</span>
						<span
							slot="splitQuantity"
							slot-scope="text, record"
						>
							<a-form-item>
								<a-input-number
									:precision="4"
									:step="0.0001"
									@change="splitAmountAndsplitQuantity(1)"
									style="width: 100%"
									v-decorator="[
										'splitQuantity_' + record.key,
										{
											rules: [
												{ required: true, message: '关联至合同数量必填!' },
												{ validator: (rule, value, cb) => (value <= 0 ? cb('数量必须大于0!') : cb()) }
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
							<a-space v-if="invoiceData.invoiceContractRelList.length > 1">
								<a @click="deleteContractItem(record)">删除</a>
							</a-space>
						</span>
					</a-table>
					<p class="add-btn-wrap">
						<a-button
							type="link"
							block
							icon="plus"
							@click="relationContractAdd"
							>新增合同</a-button
						>
					</p>
				</a-form>
			</div>
			<div
				class="info-warp margin-top-none"
				v-if="!invoiceData.attachment"
			>
				<p class="title">发票附件</p>
				<i-upload
					:action="action"
					:accept="accept"
					list-type="picture-card"
					:showDesc="false"
					:showUploadList="true"
					:limit="true"
					v-on:upload="uploadChange"
				>
					<p class="upload-btn"><a-icon type="plus" />上传发票</p>
				</i-upload>
				<p>附件上传要求：</p>
				<p>
					1.支持上传单个附件大小不超过100M的jpg、jpeg、png、pdf、ofd格式发票文件；2.单张图片（jpg、jpeg、png、ofd格式文件）上传不可包含多发票。
				</p>
			</div>
		</div>
	</a-modal>
</template>

<script>
import { columnsInvoiceRelationContract } from '../views/in/table';
import iUpload from '@/v2/components/upload.vue';
import { API_UPLOAD } from '@/v2/center/person/api';
import { API_GET_INVOICE_DETAIL, API_INVOICE_EDIT, API_CONTRACT_SEARCH_LIST } from '@/v2/center/invoiceTools/api';
import { debounce } from 'lodash';
import { formateNumber } from '@/v2/utils/index';

export default {
	data() {
		this.lastFetchId = 0;
		this.fetchUser = debounce(this.fetchUser, 800);
		return {
			action: API_UPLOAD,
			accept: '.jpg,.jpeg,.png,.ofd,.pdf',
			form: this.$form.createForm(this, { name: 'editInvoice' }),
			visible: false,
			invoiceItem: {},
			invoiceData: {},
			attachment: '',
			contractNoList: [],
			fetching: false,
			splitAmountTotal: 0,
			splitQuantityTotal: 0
		};
	},
	props: {
		title: {
			type: String,
			default: '进项发票编辑'
		},
		columns: {
			type: Array,
			default: () => columnsInvoiceRelationContract
		},
		type: {
			type: [String, Number],
			default: ''
		}
	},
	components: {
		iUpload
	},
	computed: {
		unit() {
			if (this.invoiceData?.invoiceItemList) {
				return this.invoiceData?.invoiceItemList[0]?.unit || '';
			} else {
				return '';
			}
		}
	},
	methods: {
		formateNumber,
		compotedTotalAmount(list, item) {
			if (this.invoiceData[list]) {
				return this.invoiceData[list].reduce((pre, cur) => {
					return pre + cur[item];
				}, 0);
			} else {
				return 0;
			}
		},
		splitAmountAndsplitQuantity(type = 1) {
			this.$nextTick(() => {
				const formValues = this.form.getFieldsValue();
				let splitAmountTotal = 0;
				let splitQuantityTotal = 0;
				if (type == 1) {
					for (const key in formValues) {
						if (key.indexOf(`splitQuantity`) >= 0 && formValues[key]) {
							splitQuantityTotal += Number(formValues[key]);
						}
						if (key.indexOf(`splitAmount`) >= 0 && formValues[key]) {
							splitAmountTotal += Number(formValues[key]);
						}
					}
				} else {
					this.invoiceData.invoiceContractRelList.forEach(item => {
						splitAmountTotal += item.splitAmount;
						splitQuantityTotal += item.splitQuantity;
					});
				}
				this.splitAmountTotal = splitAmountTotal;
				this.splitQuantityTotal = splitQuantityTotal;
			});
		},
		deleteContractItem(record) {
			this.invoiceData.invoiceContractRelList.splice(record.key, 1);
			this.splitAmountAndsplitQuantity(1);
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
		uploadChange(file) {
			if (file.length == 0) {
				this.attachment = '';
			}
			if (file[0]?.status === 'done') {
				this.attachment = file[0].url;
			}
		},
		relationContractAdd() {
			let key = this.invoiceData.invoiceContractRelList.length;
			this.invoiceData.invoiceContractRelList.push({
				key: key,
				contractNo: '',
				sellerName: this.invoiceData?.sellerName,
				buyerName: this.invoiceData?.buyerName,
				splitAmount: '',
				splitQuantity: '',
				singleAdd: true
			});
		},
		showModel(item) {
			this.invoiceItem = item;
			this.visible = true;
			this.fetchData();
		},
		handleOk() {
			this.form.validateFields((err, values) => {
				if (!err) {
					this.invoiceData.invoiceContractRelList.forEach(item => {
						item.contractNo = values[`contractNo_${item.key}`];
						item.splitAmount = values[`splitAmount_${item.key}`];
						item.splitQuantity = values[`splitQuantity_${item.key}`];
					});
					API_INVOICE_EDIT({
						invoiceId: this.invoiceItem.id,
						attachment: this.attachment,
						invoiceContractRelList: this.invoiceData.invoiceContractRelList
					}).then(res => {
						if (res.success) {
							if (res.data.success) {
								this.$emit('editOk', true);
								this.$message.success('修改成功');
								this.visible = false;
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
		handleCancel() {
			this.visible = false;
		},
		fetchData() {
			API_GET_INVOICE_DETAIL({
				invoiceId: this.invoiceItem.id
			}).then(res => {
				if (res.success) {
					this.invoiceData = res.data;
					this.invoiceData.invoiceContractRelList.forEach((item, index) => {
						item.key = index;
					});
					this.splitAmountAndsplitQuantity(2);
					this.$nextTick(() => {
						this.invoiceData.invoiceContractRelList.forEach((item, index) => {
							this.form.setFieldsValue({
								['contractNo_' + index]: item.contractNo,
								['splitAmount_' + index]: item.splitAmount,
								['splitQuantity_' + index]: item.splitQuantity
							});
						});
					});
				}
			});
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less" scoped>
.invoice-info {
	width: 100%;
	height: 20px;
	font-weight: 400;
	color: #8495aa;
	line-height: 20px;
}
.invoice-code {
	display: inline-block;
	margin-left: 60px;
}
.title {
	padding-left: 20px;
	font-weight: 500;
	color: #000000;
	position: relative;
	margin-bottom: 20px;
}
.title::before {
	content: '';
	width: 2px;
	height: 16px;
	background: @primary-color;
	display: inline-block;
	position: absolute;
	top: 4px;
	left: 0;
}
.info-warp {
	margin-top: 30px;
}
.add-btn-wrap {
	width: 100%;
	height: 52px;
	line-height: 52px;
	.ant-btn-link {
		color: #8495aa;
		font-weight: 400;
	}
}
.upload-btn {
	display: flex;
	flex-direction: column;
	font-weight: 400;
	color: rgba(0, 0, 0, 0.8);
}
.margin-top-none {
	margin-top: 0;
}
.computed-total {
	width: 100%;
	height: 50px;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
}
.new-table {
	::v-deep.ant-table-scroll {
		.ant-table-header {
			overflow: auto !important;
			border-left: 1px solid #e5e6eb;
			border-right: 1px solid #e5e6eb;
			border-radius: 4px 4px 0 0;
		}
	}
}
</style>
