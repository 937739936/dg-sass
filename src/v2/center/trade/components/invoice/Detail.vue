<template>
	<div class="invoice-detail">
		<p class="title">发票基本信息</p>
		<a-form-model
			class="invoice-info-form"
			ref="invoiceForm2"
			:labelCol="{ span: 8 }"
			:wrapperCol="{ span: 13 }"
			:colns="false"
		>
			<a-row>
				<a-col :span="12">
					<a-form-model-item
						label="发票代码"
						prop="code"
					>
						<a-input
							v-model="invoiceForm.code"
							disabled
						></a-input>
					</a-form-model-item>
				</a-col>
				<a-col :span="12">
					<a-form-model-item
						label="发票号码"
						prop="no"
					>
						<a-input
							v-model="invoiceForm.no"
							disabled
						></a-input>
					</a-form-model-item>
				</a-col>
				<a-col :span="12">
					<a-form-model-item
						label="发票金额(不含税)"
						prop="taxExcludeAmount"
					>
						<a-input
							v-model="invoiceForm.taxExcludedAmount"
							disabled
						></a-input>
					</a-form-model-item>
				</a-col>
				<a-col :span="12">
					<a-form-model-item
						label="开票日期"
						prop="issuedDate"
					>
						<a-input
							v-model="invoiceForm.issuedDate"
							disabled
						></a-input>
					</a-form-model-item>
				</a-col>
				<a-col :span="12">
					<a-form-model-item
						label="发票校验码"
						prop="checkCode"
					>
						<a-input
							v-model="invoiceForm.checkCode"
							disabled
						></a-input>
					</a-form-model-item>
				</a-col>
				<a-col :span="12">
					<a-form-model-item
						label="开票类型"
						prop="invoiceType"
					>
						<a-input
							v-model="invoiceForm.invoiceTypeDesc"
							disabled
						></a-input>
					</a-form-model-item>
				</a-col>
				<!-- <a-col :span="12">
					<a-form-model-item label="发票类型" >
						<a-input v-model="invoiceForm.invoiceType" disabled></a-input>
					</a-form-model-item>
				</a-col> -->
			</a-row>
		</a-form-model>
		<template v-if="this.invoiceData">
			<p class="title title-sub">其他信息</p>
			<div class="other-info">
				<p class="title">购买方信息</p>
				<div class="info-block">
					<a-row class="row">
						<a-col :span="12"> 名称：{{ invoiceData.buyerName }} </a-col>
						<a-col :span="12"> 纳税人编号：{{ invoiceData.buyerUscc }} </a-col>
					</a-row>
					<a-row class="row">
						<a-col :span="24"> 地址、电话：{{ invoiceData.purchaserAddressAndPhone }} </a-col>
					</a-row>
					<a-row class="row">
						<a-col :span="24"> 开户行及账号：{{ invoiceData.purchaserBankAndNumber }} </a-col>
					</a-row>
				</div>
				<p class="title">货物信息</p>
				<div class="info-block">
					<a-table
						:rowKey="(record, index) => index"
						:columns="goodsColumns"
						:dataSource="invoiceData.invoiceItemList"
						:pagination="false"
						:locale="{ emptyText: '暂无数据' }"
					/>
					<div class="goodsSum">
						<p class="sum-title">合计：{{ invoiceData.totalAmount }}</p>
						<p>价税合计(小写)：{{ invoiceData.amountTax }}，大写：{{ invoiceData.amountTaxCn }}</p>
					</div>
				</div>
				<p class="title">销售方信息</p>
				<div class="info-block">
					<a-row class="row">
						<a-col :span="12"> 名称：{{ invoiceData.sellerName }} </a-col>
						<a-col :span="12"> 纳税人编号：{{ invoiceData.sellerUscc }} </a-col>
					</a-row>
					<a-row class="row">
						<a-col :span="24"> 地址、电话：{{ invoiceData.salerAddressAndPhone }} </a-col>
					</a-row>
					<a-row class="row">
						<a-col :span="24"> 开户行及账号：{{ invoiceData.salerBankAndNumber }} </a-col>
					</a-row>
				</div>
				<p class="title">备注信息</p>
				<div class="info-block">
					<a-row>
						<a-col :span="24">
							<!-- <div v-html="invoiceDetail.remarks || '-'"/> -->
							<div>
								{{ invoiceData.remarks || '-' }}
							</div>
						</a-col>
					</a-row>
				</div>
				<p class="title">发票附件</p>
				<div class="upload-wrap">
					<a-upload
						:headers="headers"
						v-if="isModify"
						:multiple="false"
						:fileList="fileList"
						name="file"
						:beforeUpload="beforeUpload"
						@change="handleChange"
						@preview="viewPic"
						:action="action"
					>
						<a-button>
							<a-icon type="upload" />
							修改文件
						</a-button>
					</a-upload>
					<a-button
						style="margin-top: 10px"
						type="primary"
						ghost
						v-if="fileList.length"
						@click="viewPic"
						>查看</a-button
					>
				</div>
				<picPreview ref="picPreview"></picPreview>

				<div class="link-order">
					<a-row
						type="flex"
						justify="space-between"
					>
						<a-col><p class="title">关联订单</p></a-col>
						<a-col v-if="isModify"
							><a-button
								type="primary"
								@click="addLinkOrder"
								><a-icon type="plus"></a-icon> 新增关联订单</a-button
							></a-col
						>
					</a-row>
					<a-table
						id="link-order-table"
						:scroll="{ x: true }"
						style="margin-top: 16px"
						:columns="orderColumns"
						:dataSource="linkOrders"
						rowKey="orderId"
					>
						<span
							slot="money"
							slot-scope="text, record"
						>
							<a-input
								v-if="isModify"
								placeholder="请输入大于零的金额"
								:disabled="record.hasPayment"
								class="edit-input"
								v-model="record.splitAmount"
							></a-input>
							<p v-else>{{ (+text).toLocaleString() }}</p>
						</span>
						<span
							slot="action"
							slot-scope="text, record, index"
						>
							<a-space>
								<a
									href="javascript:;"
									v-if="isModify && linkOrders.length > 1"
									@click="deleteLink(record, index)"
									>删除关联</a
								>
								<a
									href="javascript:;"
									@click="openOrder(record)"
									>详情</a
								>
							</a-space>
						</span>
					</a-table>
					<LinkOrder
						ref="linkOrder"
						@update="linkUpdate"
					></LinkOrder>
				</div>
			</div>
		</template>
		<div
			class="btn-wrap"
			v-if="!(hidePageFooter === true)"
		>
			<a-button
				type="primary"
				ghost
				@click="submitInvoiceInfo"
				v-if="isModify"
				>确定</a-button
			>
			<a-button @click="$router.go(-1)">返回</a-button>
		</div>
	</div>
</template>

<script lang="jsx">
import { API_INVOICESAVE, API_UPLOAD, API_ORDER_HAS_PAYMENT } from '@/v2/center/trade/api/invoice';
import picPreview from '@/v2/components/picView/Index';
import LinkOrder from './LinkOrder';
import { filterCodeByValueName } from '@sub/utils/globalCode.js';
import { mapGetters } from 'vuex';

const invoiceMap = {
	'01': '增值税专用发票',
	'02': '货运运输业增值税专用发票',
	'03': '机动车销售统一发票',
	'04': '增值税普通发票',
	10: '增值税普通发票（电子）',
	11: '增值税普通发票（卷式）',
	14: '增值税普通发票（通行费）'
};
export default {
	components: { picPreview, LinkOrder },
	name: 'InvoiceDetail',
	props: ['invoiceData', 'ifAllowUpload', 'hidePageFooter'],
	created() {
		//当前是否为编辑模式
		this.isModify = this.$route.query.type === 'modify';
		//订单详情下弹窗查看 移除操作列
		if (this.hidePageFooter === true) {
			this.orderColumns.pop();
		}
	},
	data() {
		return {
			invoiceForm: {
				code: undefined,
				no: 0,
				taxExcludeAmount: undefined,
				issuedDate: undefined,
				checkCode: undefined,
				invoiceType: undefined
			},
			goodsColumns: [
				{
					title: '货物或应税劳务,服务名称',
					dataIndex: 'name'
				},
				{
					title: '规格型号',
					dataIndex: 'spec'
				},
				{
					title: '单位',
					dataIndex: 'unit'
				},
				{
					title: '数量',
					dataIndex: 'quantity'
				},
				{
					title: '单价',
					dataIndex: 'unitPrice'
				},
				{
					title: '税率',
					dataIndex: 'taxRate'
				},
				{
					title: '金额',
					dataIndex: 'amount',
					width: '100px'
				},
				{
					title: '税额',
					dataIndex: 'tax',
					width: '100px'
				}
			],
			goodsData: [],
			invoiceDetail: {},
			fileList: [],
			action: API_UPLOAD,
			orderColumns: [
				{
					align: 'center',
					title: '订单编号',
					dataIndex: 'orderNo'
				},
				{
					align: 'center',
					title: '买方名称',
					dataIndex: 'buyerName'
				},
				{
					align: 'center',
					title: '卖方名称',
					dataIndex: 'sellerName'
				},
				{
					align: 'center',
					title: '订单数量(吨)',
					dataIndex: 'quantity',
					customRender: text => {
						return (+text).toLocaleString();
					}
				},
				{
					align: 'center',
					title: '结算类型',
					width: 100,
					dataIndex: 'settlementType',
					customRender: text => {
						return filterCodeByValueName(text, 'settleModeDict');
					}
				},
				{
					align: 'center',
					title: '价税合计（元）',
					dataIndex: 'totalAmount',
					customRender: text => {
						return (+text).toLocaleString();
					}
				},
				{
					align: 'center',
					title: '发票拆分金额(含税)(元)',
					dataIndex: 'splitAmount',
					scopedSlots: {
						customRender: 'money'
					}
				},
				{
					align: 'center',
					title: '操作',
					fixed: 'right',
					scopedSlots: {
						customRender: 'action'
					}
				}
			],
			linkOrders: [],
			isModify: false
		};
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
		// 打开合同详情页
		openOrder(item) {
			let routerData = this.$router.resolve({
				path: '/center/contract/' + item.orderType.toLowerCase() + '/online/detail',
				query: {
					id: item.orderId,
					type: item.orderType
				}
			});
			window.open(routerData.href, '_blank');
		},
		viewPic() {
			this.$refs.picPreview.viewPic(this.invoiceData.url);
		},
		setValues() {
			const { result } = this?.invoiceData;
			// if (!result) {
			// 	return this.$message.error("无识别信息");
			// }

			// 发票信息
			// const invoiceInfo =result.invoiceInfo;
			// const invoiceObj =result.resp.invoice[0].veritem;
			// const goodsObj = result.resp.invoice[0].invoiceLists[0].invoiceList;

			// let invoiceItem = {},
			//     goodsItem = {},
			//     goodsArray = [];

			//            if(invoiceObj){
			//                invoiceObj.forEach(item=>{
			// 	invoiceItem[item.name] = item.content;
			//                });
			//                // 发票类型
			// invoiceItem.invoiceType=invoiceMap[invoiceItem.invoiceType]

			//                // 详细信息
			//                this.invoiceDetail=invoiceItem;
			//            }
			//            if(goodsObj){
			//                goodsObj.forEach(item=>{
			//                    item.veritem.forEach(item=>{
			// 		goodsItem[item.name] = item.content;
			//                    })
			//                    goodsArray.push(goodsItem)
			//                    goodsItem = {}
			//                })
			//                this.goodsData = goodsArray;
			//            }

			// 四要素添加时附件为空，必填
			if (this.invoiceData.url) {
				let pathArr = this.invoiceData.url.split('/');
				this.fileList = [
					{
						uid: '-1',
						name: pathArr.pop(),
						status: 'done',
						url: this.invoiceData.url
					}
				];
			} else {
				this.fileList = [];
			}

			this.invoiceForm = {
				...this.invoiceData
				// code:invoiceInfo.invoiceCode,
				// no:invoiceInfo.invoiceNum,
				// taxExcludeAmount:invoiceInfo.totalAmount,
				// issuedDate:invoiceInfo.invoiceDate,
				// checkCode:invoiceInfo.checkCode ? invoiceInfo.checkCode : '-',
				// invoiceType:invoiceItem.invoiceType,
			};
			//关联订单
			this.linkOrders = this.invoiceData.linkOrders;
		},
		submitInvoiceInfo() {
			if (!this.fileList.length) {
				this.$message.error('请上传发票附件');
				return;
			}
			const invoiceDetail = this.invoiceDetail;

			//拆分信息合法性校验
			let isInValid = this.linkOrders.some(item => {
				let splitAmount = Number(item.splitAmount);
				return isNaN(splitAmount) || splitAmount <= 0;
			});

			if (isInValid) {
				this.$message.error('发票拆分金额请输入大于0的数字');
				return;
			}
			const senData = {
				id: this.$route.query.id ?? null,
				attachment: this.invoiceData.url,
				// scan: JSON.stringify(this.invoiceData.result),
				code: this.invoiceForm.code,
				issuedDate: this.invoiceForm.issuedDate,
				no: this.invoiceForm.no,
				buyerName: invoiceDetail.purchaserName,
				buyerUscc: invoiceDetail.purchaserTaxNo,
				remarks: invoiceDetail.remarks,
				sellerName: invoiceDetail.salesName,
				sellerUscc: invoiceDetail.salesTaxNo,
				taxAmount: invoiceDetail.totalTax,
				taxExcludedAmount: invoiceDetail.totalAmount,
				totalAmount: invoiceDetail.amountTax,
				invoiceOrderRelVOList: this.linkOrders,
				invoiceType: this.invoiceData.invoiceType,
				status: this.invoiceData.status,
				scanStatus: this.invoiceData.scanStatus
			};

			API_INVOICESAVE(senData).then(res => {
				if (res.success) {
					this.$message.success('保存成功');
					this.$router.push('myInvoiceList');
				}
			});
		},
		beforeUpload(file) {
			const isIMG = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp'].includes(file.type);
			if (!isIMG) {
				this.$message.error('仅支持bmp，jpg，png，gif的格式');
				this.fileList = [];
			}
			const isLt3M = file.size / 1024 / 1024 < 3;
			if (!isLt3M) {
				this.$message.error('图片不能大于3M');
				this.fileList = [];
			}
			return isIMG && isLt3M;
		},
		handleChange(info) {
			let fileList = [...info.fileList];
			fileList = fileList.slice(-1);
			this.fileList = fileList;
			if (info.file.response?.success) {
				this.invoiceData.url = info.file.response.result;
			}
		},

		//添加关联
		addLinkOrder() {
			let selected = this.linkOrders.map(item => item);
			this.$refs.linkOrder.init(selected);
		},
		//	删除关联订单
		async deleteLink(record, index) {
			//判断订单是否关联到了付款
			let hasPay = await API_ORDER_HAS_PAYMENT({
				orderSerialNo: record.orderSerialNo,
				code: this.invoiceForm.code,
				no: this.invoiceForm.no
			});

			this.$confirm({
				title: '操作确认',
				content: () => {
					if (hasPay.result) {
						return (
							<div>
								<p style="color:red">
									该笔订单{record.orderSerialNo}下的发票代码为{this.invoiceForm.code}已关联付款不允许删除！
								</p>
							</div>
						);
					} else {
						return (
							<div>
								<p>
									确定删除发票代码{this.invoiceForm.code}与订单{record.orderSerialNo}的关联关系么？
								</p>
							</div>
						);
					}
				},
				onOk: async () => {
					if (hasPay.result == false) {
						this.linkOrders.splice(index, 1);
					}
				},
				okButtonProps: {
					display: 'none'
				}
			});
		},
		//	更新关联
		linkUpdate(data) {
			this.linkOrders = data.map(item => {
				let _data = this.linkOrders.filter(item2 => item2.orderId === item.orderId);
				if (_data.length) {
					return _data[0];
				}
				item.totalAmount = this.invoiceDetail.amountTax;
				item.orderAmount = item.orderAmount ?? item.quantity;
				item.splitAmount = item.splitAmount ?? undefined;
				return item;
			});
		}
	},
	watch: {
		invoiceData() {
			this.setValues();
		}
	}
};
</script>

<style lang="less" scoped>
.invoice-detail {
	padding: 10px 0;
	.title {
		color: #565656;
		font-size: 16px;
		margin-bottom: 20px;
	}
	.title-sub {
		color: #999;
	}
	.invoice-info-form {
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
	.link-order {
		margin-top: 30px;
		.edit-input {
			border: none;
		}
	}
	::v-deep #link-order-table {
		td,
		th {
			white-space: nowrap !important;
		}
	}
}
</style>
