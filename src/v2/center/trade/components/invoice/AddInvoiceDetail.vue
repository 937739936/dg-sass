<template>
	<div class="add-invoice-detail">
		<p class="title">发票基本信息</p>
		<a-form-model
			:model="invoiceForm"
			class="invoice-info-form"
			layout="inline"
		>
			<a-row class="row">
				<a-col :span="12">
					<a-form-model-item
						label="发票代码"
						:colon="false"
					>
						<a-input
							disabled
							v-model="invoiceForm.invoiceCode"
						/>
					</a-form-model-item>
				</a-col>
				<a-col :span="12">
					<a-form-model-item
						label="发票号码"
						:colon="false"
					>
						<a-input
							disabled
							v-model="invoiceForm.invoiceNum"
						/>
					</a-form-model-item>
				</a-col>
			</a-row>
			<a-row class="row">
				<a-col :span="12">
					<a-form-model-item
						label="合计金额(不含税)"
						:colon="false"
					>
						<a-input
							disabled
							v-model="invoiceForm.totalAmount"
						/>
					</a-form-model-item>
				</a-col>
				<a-col :span="12">
					<a-form-model-item
						label="开票日期"
						:colon="false"
					>
						<a-input
							disabled
							v-model="invoiceForm.invoiceDate"
						/>
					</a-form-model-item>
				</a-col>
			</a-row>
			<a-row class="row">
				<a-col :span="12">
					<a-form-model-item
						label="发票校验码"
						:colon="false"
					>
						<a-input
							disabled
							v-if="invoiceForm.checkCode"
							v-model="invoiceForm.checkCode"
						/>
						<a-input
							disabled
							v-else
							value="-"
						/>
					</a-form-model-item>
				</a-col>
				<a-col :span="12">
					<a-form-model-item
						label="开票类型"
						:colon="false"
					>
						<a-input
							disabled
							v-model="invoiceForm.invoiceType"
						/>
					</a-form-model-item>
				</a-col>
			</a-row>
		</a-form-model>
		<p class="title title-sub">其他信息</p>
		<div class="other-info">
			<p class="title">购买方信息</p>
			<div class="info-block">
				<a-row class="row">
					<a-col :span="12">名称：{{ invoiceDetail.purchaserName }}</a-col>
					<a-col :span="12">纳税人编号：{{ invoiceDetail.purchaserTaxNo }}</a-col>
				</a-row>
				<a-row class="row">
					<a-col :span="24">地址、电话：{{ invoiceDetail.purchaserAddressPhone }}</a-col>
				</a-row>
				<a-row class="row">
					<a-col :span="24">开户行及账号：{{ invoiceDetail.purchaserBank }}</a-col>
				</a-row>
			</div>
			<p class="title">货物信息</p>
			<div class="info-block">
				<a-table
					rowKey="index"
					:columns="goodsColumns"
					:dataSource="goodsData"
					:pagination="false"
				/>
				<div class="goodsSum">
					<p>
						<span class="sum-title">合计：{{ invoiceDetail.totalAmount }}</span>
						<span class="sum-amount">
							<!--{{invoiceDetail.totalAmount}}-->
						</span>
						<span class="sum-amount"></span>
					</p>
					<p>价税合计(小写)：{{ invoiceDetail.amountTax }}，大写：{{ invoiceDetail.amountTaxCn }}</p>
				</div>
			</div>
			<p class="title">销售方信息</p>
			<div class="info-block">
				<a-row class="row">
					<a-col :span="12">名称：{{ invoiceDetail.salesName }}</a-col>
					<a-col :span="12">纳税人编号：{{ invoiceDetail.salesTaxNo }}</a-col>
				</a-row>
				<a-row class="row">
					<a-col :span="24">地址、电话：{{ invoiceDetail.salesAddressPhone }}</a-col>
				</a-row>
				<a-row class="row">
					<a-col :span="24">开户行及账号：{{ invoiceDetail.salesBank }}</a-col>
				</a-row>
			</div>
			<p class="title">备注信息</p>
			<div class="info-block">
				<a-row>
					<a-col :span="24">
						<div v-html="invoiceDetail.remarks" />
					</a-col>
				</a-row>
			</div>
			<p class="title">发票附件</p>
			<template>
				<div class="upload-wrap">
					<div
						class="upload-left"
						v-if="ifAllowUpload"
					>
						<a-upload
							accept="image/png, image/jpeg, image/jpg, image/gif, image/bmp"
							:multiple="false"
							:fileList="fileList"
							name="file"
							:headers="headers"
							:beforeUpload="beforeUpload"
							@change="handleChange"
							:action="action"
						>
							<a-button><a-icon type="upload" />修改文件</a-button>
						</a-upload>
					</div>
					<div class="upload-right">
						<a-button
							type="primary"
							ghost
							v-if="fileList.length > 0"
							@click="searchFileUrl"
							>查看</a-button
						>
					</div>
				</div>
			</template>
			<picView
				v-if="previewVisible"
				ref="picView"
			/>
		</div>
	</div>
</template>

<script>
import picView from '@/v2/components/picView/Index.vue';
import { API_GETCURRENTENV, API_UPLOAD } from '@/v2/center/trade/api/invoice';
import { mapGetters } from 'vuex';

export default {
	name: 'AddInvoiceDetail',
	props: ['invoiceData', 'ifAllowUpload'],
	watch: {
		invoiceData: {
			handler() {
				this.setValues();
			},
			deep: true
		}
	},
	components: { picView },
	data() {
		return {
			invoiceForm: {},
			goodsColumns: [
				{ title: '货物或应税劳务,服务名称', dataIndex: 'commodityName' },
				{ title: '规格型号', dataIndex: 'specificationModel' },
				{ title: '单位', dataIndex: 'unit' },
				{ title: '数量', dataIndex: 'quantity' },
				{ title: '单价', dataIndex: 'unitPrice' },
				{ title: '税率', dataIndex: 'taxRate' },
				{ title: '金额', dataIndex: 'amount', width: '100px' },
				{ title: '税额', dataIndex: 'tax', width: '100px' }
			],
			invoiceTypeMap: {
				'01': '增值税专用发票',
				'02': '货运运输业增值税专用发票',
				'03': '机动车销售统一发票',
				'04': '增值税普通发票',
				10: '增值税普通发票（电子）',
				11: '增值税普通发票（卷式）',
				14: '增值税普通发票（通行费）'
			},
			goodsData: [],
			invoiceDetail: {},
			fileList: [],
			previewVisible: false,
			previewImage: '',
			action: API_UPLOAD,
			query: {}
		};
	},
	mounted() {
		this.query = this.$route.query || {};
		this.setValues();
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_TOKEN: 'VUEX_ST_TOKEN'
		}),
		headers() {
			return {
				Authorization: this.VUEX_ST_TOKEN,
				Source: 'PC'
			};
		}
	},
	methods: {
		searchFileUrl() {
			this.previewVisible = true;
			if (this.invoiceData.url.indexOf('http') > -1) {
				this.previewImage = this.invoiceData.url;
			} else {
				this.previewImage = API_GETCURRENTENV(this.invoiceData.url);
			}
			this.$nextTick(() => {
				this.$refs.picView.viewPic(this.previewImage);
			});
		},
		setValues() {
			this.invoiceForm =
				(this.invoiceData && this.invoiceData.singleInvoiceResult && this.invoiceData.singleInvoiceResult.invoiceInfo) || {};
			const invoiceZero =
				(this.invoiceData.singleInvoiceResult &&
					this.invoiceData.singleInvoiceResult.resp &&
					this.invoiceData.singleInvoiceResult.resp.invoice &&
					this.invoiceData.singleInvoiceResult.resp.invoice[0]) ||
				{};
			const invoiceObj = invoiceZero.veritem || [];
			const goodsObj = (invoiceZero.invoiceLists && invoiceZero.invoiceLists[0] && invoiceZero.invoiceLists[0].invoiceList) || [];

			let invoiceItem = {},
				goodsItem = {},
				goodsArray = [];

			if (invoiceObj) {
				invoiceObj.forEach(item => {
					invoiceItem[item.name] = item.content;
				});
				invoiceItem.invoiceType = this.invoiceTypeMap[invoiceItem.invoiceType]; // 发票类型
				this.$set(this.invoiceForm, 'invoiceType', invoiceItem.invoiceType);
				this.invoiceDetail = invoiceItem; // 详细信息
			}
			if (goodsObj) {
				goodsObj.forEach(item => {
					item.veritem.forEach((it, index) => {
						goodsItem['index'] = index;
						goodsItem[it.name] = it.content;
					});
					goodsArray.push(goodsItem);
					goodsItem = {};
				});
				this.goodsData = goodsArray;
			}

			// 四要素添加时附件为空，必填
			if (this.invoiceData.url) {
				this.fileList = [
					{
						uid: '-1',
						name: this.invoiceData.url.split('/')[this.invoiceData.url.split('/').length - 1],
						status: 'done',
						url: this.invoiceData.url
					}
				];
			} else {
				this.fileList = [];
			}
		},
		beforeUpload(file) {
			const isIMG =
				file.type === 'image/jpg' ||
				file.type === 'image/jpeg' ||
				file.type === 'image/png' ||
				file.type === 'image/gif' ||
				file.type === 'image/bmp';
			if (!isIMG) {
				this.$message.error('仅支持bmp，jpg，jpeg，png，gif的格式');
				setTimeout(() => {
					this.fileList = [];
				}, 1);
			}
			const isLt = file.size / 1024 / 1024 < 3;
			if (!isLt) {
				this.$message.error('图片不能大于3M');
				setTimeout(() => {
					this.fileList = [];
				}, 1);
			}
			return new Promise((resolve, reject) => {
				if (isIMG && isLt) {
					return setTimeout(() => {
						resolve(file);
					}, 1);
				} else {
					return setTimeout(() => {
						reject(file);
					}, 1);
				}
			});
		},
		handleChange(info) {
			let fileList = [...info.fileList];
			fileList = fileList.slice(-1);
			this.fileList = fileList;
			if (info.file.response && info.file.response.success) {
				this.invoiceData.url = info.file.response.result;
			}
		},
		handleCancel() {
			this.previewVisible = false;
		},
		getParams() {
			let submitObj = {
				attachment: this.invoiceData.url,
				buyerName: this.invoiceDetail.purchaserName,
				buyerUscc: this.invoiceDetail.purchaserTaxNo,
				code: this.invoiceForm.invoiceCode,
				issuedDate: this.invoiceForm.invoiceDate,
				no: this.invoiceForm.invoiceNum,
				remarks: this.invoiceDetail.remarks,
				scan: JSON.stringify(this.invoiceData.singleInvoiceResult),
				sellerName: this.invoiceDetail.salesName,
				sellerUscc: this.invoiceDetail.salesTaxNo,
				taxAmount: this.invoiceDetail.totalTax,
				taxExcludedAmount: this.invoiceDetail.totalAmount,
				totalAmount: this.invoiceDetail.amountTax
			};
			return {
				submitObj: submitObj,
				fileList: this.fileList
			};
		}
	}
};
</script>

<style lang="less" scoped>
.add-invoice-detail {
	padding: 10px 0;
	.title {
		color: #565656;
		font-size: 16px;
		margin-bottom: 20px;
	}
	.title-sub {
		color: #999;
	}
	::v-deep.invoice-info-form {
		.ant-row {
			width: 100%;
			margin-bottom: 10px;
		}
		label {
			color: #666;
			font-size: 16px;
			width: 150px;
			display: inline-block;
			text-align: right;
			padding-right: 10px;
		}
		input {
			width: 250px;
		}
	}
	.other-info {
		padding: 0 16px;
		font-size: 16px;
		color: #666;
		.row {
			margin-bottom: 15px;
		}
		.info-block {
			margin-bottom: 50px;
		}
		.goodsSum {
			padding: 20px 0;
			p {
				margin-bottom: 10px;
				display: flex;
				flex-direction: row;
				.sum-title {
					flex-grow: 1;
				}
				.sum-amount {
					width: 100px;
				}
			}
		}
		.search-btn {
			margin-left: 30px;
		}
	}
	.upload-wrap {
		display: flex;
		flex-direction: row;
		.upload-left {
			width: 300px;
		}
		.upload-right {
			width: 100px;
		}
	}
}
</style>
