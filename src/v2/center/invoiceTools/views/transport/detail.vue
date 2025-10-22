<template>
	<div class="wrap">
		<div class="info-desc">
			<p class="title">发票基本信息</p>
			<div class="info-wrap">
				<p>发票号码：{{ invoiceData.no }}</p>
				<p>发票代码：{{ invoiceData.code }}</p>
				<p>不含税金额：{{ invoiceData.taxExcludedAmount }}</p>
				<p>开票日期：{{ invoiceData.issuedDate }}</p>
				<p>发票校验码：{{ invoiceData.checkCode }}</p>
				<p>发票类型：{{ invoiceData.invoiceTypeDesc }}</p>
				<p>是否包含印花税：{{ invoiceData.includeStampTaxFlag ? '是' : '否' }}</p>
				<p>印花税税额：{{ invoiceData.stampTaxFlagAmount }}</p>
				<p>含印花税合计：{{ invoiceData.stampTaxFlagTotalAmount }}</p>
			</div>
		</div>
		<div class="info-desc marin-top30">
			<p class="title">购买方信息</p>
			<div class="info-wrap">
				<p>对方名称：{{ invoiceData.buyerName }}</p>
				<p>纳税人识别号：{{ invoiceData.buyerUscc }}</p>
				<p>地址、电话：{{ invoiceData.purchaserAddressAndPhone }}</p>
				<p>开户行及账号：{{ invoiceData.purchaserBankAndNumber }}</p>
			</div>
		</div>
		<div class="info-desc marin-top30">
			<p class="title">销售方信息</p>
			<div class="info-wrap">
				<p>对方名称：{{ invoiceData.sellerName }}</p>
				<p>纳税人识别号：{{ invoiceData.sellerUscc }}</p>
				<p>地址、电话：{{ invoiceData.purchaserAddressAndPhone }}</p>
				<p>开户行及账号：{{ invoiceData.salerBankAndNumber }}</p>
			</div>
		</div>
		<div class="info-desc marin-top30">
			<p class="title">货物信息</p>
			<div class="info-table">
				<a-table
					:columns="columnsGoods"
					:data-source="invoiceData.invoiceItemList"
					:pagination="false"
					rowKey="id"
				></a-table>
				<!-- <p class="count">
          <span>合计：￥{{computedData('invoiceItemList', 'amount')}}</span>
          <span>价税合计(小写)：￥{{computedData('invoiceItemList', 'tax')}}</span>
        </p> -->
			</div>
		</div>
		<div class="info-desc marin-top30">
			<p class="title">关联合同信息</p>
			<div class="info-table">
				<a-table
					:columns="columnsContract"
					:data-source="invoiceData.invoiceContractRelList"
					:pagination="false"
					rowKey="id"
				></a-table>
				<p class="count">
					<span>价税合计：{{ formateNumber(invoiceData.totalAmount, 2) }}元</span>
					<span>含印花税合计：￥{{ formateNumber(invoiceData.stampTaxFlagTotalAmount, 2) }}</span>
					<span
						>已关联至合同金额合计（含印花税，元）：{{
							formateNumber(computedData('invoiceContractRelList', 'splitAmount'), 2)
						}}元</span
					>
				</p>
			</div>
		</div>
		<div
			class="info-desc marin-top30"
			v-if="invoiceData.attachment"
		>
			<p class="title">发票附件</p>
			<div class="info-file">
				<img
					:src="ENV.BASE_NET + invoiceData.attachment"
					@click="previewInvoice"
				/>
			</div>
		</div>
		<div class="btn-wrap">
			<a-button
				type="primary"
				ghost
				@click="back"
				>返回</a-button
			>
		</div>
		<image-viewer ref="imageViewer" />
	</div>
</template>

<script>
import { columnsGoods, columnsContract } from './table';
import imageViewer from '@/v2/components/imageViewer.vue';
import { filePreview } from '@/v2/utils/file';
import { API_GET_INVOICE_DETAIL } from '@/v2/center/invoiceTools/api';
import ENV from '@/v2/config/env';
import { formateNumber } from '@/v2/utils/index';

export default {
	data() {
		return {
			ENV,
			columnsGoods,
			columnsContract,
			dataGoods: [],
			dataContract: [],
			invoiceData: {}
		};
	},
	components: {
		imageViewer
	},
	computed: {
		unit() {
			if (this.invoiceData.invoiceItemList) {
				return this.invoiceData.invoiceItemList[0].unit;
			} else {
				return '';
			}
		}
	},
	methods: {
		formateNumber,
		computedData(list, item) {
			if (this.invoiceData[list]) {
				return this.invoiceData[list].reduce((pre, cur) => {
					return pre + cur[item];
				}, 0);
			}
		},
		previewInvoice() {
			filePreview(this.invoiceData.attachment, this.$refs.imageViewer.show);
		},
		back() {
			this.$router.back();
		},
		fetchData() {
			API_GET_INVOICE_DETAIL({
				invoiceId: this.$route.query.id
			}).then(res => {
				if (res.success) {
					this.invoiceData = res.data;
					this.invoiceData.invoiceItemList.forEach((item, index) => {
						item.id = index;
						item.taxRate = item.taxRate * 100 + '%';
					});
					this.invoiceData.invoiceContractRelList.forEach((item, index) => {
						item.id = ++index;
					});
				}
			});
		}
	},
	mounted() {
		this.fetchData();
	}
};
</script>

<style lang="less" scoped>
.title {
	width: 100%;
	height: 24px;
	font-size: 16px;
	font-family:
		PingFangSC-Medium,
		PingFang SC;
	font-weight: 500;
	color: rgba(0, 0, 0, 0.8);
	line-height: 24px;
	padding-left: 16px;
	position: relative;
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
.info-wrap {
	width: 100%;
	min-height: 122px;
	height: auto;
	background: #f5f7fd;
	border-radius: 10px;
	padding: 30px 20px 30px 30px;
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	margin-top: 20px;
	p {
		width: 33.33%;
		font-size: 14px;
		font-family:
			PingFangSC-Regular,
			PingFang SC;
		font-weight: 400;
		color: rgba(0, 0, 0, 0.8);
		line-height: 30px;
	}
}
.marin-top30 {
	margin-top: 30px;
}
.info-table {
	margin-top: 20px;
}
.count {
	width: 100%;
	height: 20px;
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
	align-items: center;
	font-weight: 400;
	color: #8495aa;
	margin-top: 20px;
	span {
		margin-left: 40px;
	}
}
.info-file {
	margin-top: 20px;
	img {
		width: 200px;
		height: 112px;
		display: inline-block;
		object-fit: cover;
		cursor: pointer;
	}
}
.btn-wrap {
	width: 100%;
	height: 44px;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
}
</style>
