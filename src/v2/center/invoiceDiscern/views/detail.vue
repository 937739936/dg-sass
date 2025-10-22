<template>
	<div class="detail">
		<Breadcrumb name="发票详情"></Breadcrumb>
		<a-card
			class="link-contract"
			:bordered="false"
		>
			<div class="title">发票新增-发票详情</div>
			<div
				class="task"
				style="margin-top: 30px"
				v-if="detailData.invoiceVO.attachment"
			>
				<div
					class="top"
					style="margin-bottom: 20px"
				>
					发票附件
				</div>
			</div>
			<div
				class="affix"
				@click="handlePreview"
				v-if="detailData.invoiceVO.attachment"
			>
				<img
					src="@/v2/assets/imgs/invoicetools/png-icon.png"
					alt=""
					style="width: 12px; margin-bottom: 2px"
				/>
				{{ detailData.invoiceVO.attachment }}
			</div>
			<!-- <div style="text-align:center;margin-bottom:40px" v-else>
        <img style="width:83px" src="@/assets/imgs/newInvoice/no_file.png" alt="">
        <p class="c8" style="color:#8495AA;margin-top:10px">暂无数据</p>
      </div> -->
			<div
				class="task"
				style="margin-top: 50px"
			>
				<div
					class="top"
					style="margin-bottom: 20px"
				>
					发票信息
				</div>
			</div>
			<InvoiceInfo :info="detailData"></InvoiceInfo>

			<div
				class="task"
				style="margin-top: 50px"
				v-if="detailData.invoiceItemVOList.length > 8"
			>
				<div
					class="top"
					style="margin-bottom: 20px"
				>
					销售货物或应税劳务/服务清单
				</div>
			</div>
			<TableInvoice
				type="detail"
				:dataSource="detailData.invoiceItemVOList"
				v-if="detailData.invoiceItemVOList.length > 8"
			></TableInvoice>
		</a-card>
		<img
			:src="previewImg"
			style="display: none"
			ref="viewer"
			v-viewer
		/>
	</div>
</template>

<script>
import InvoiceInfo from '../components/InvoiceInfo.vue';
import TableInvoice from '../components/TableInvoice.vue';
import Breadcrumb from '../components/Breadcrumb.vue';
import { getInvoiceDetail } from '../api';
import ENV from '@/v2/config/env';
export default {
	data() {
		return {
			detailData: {
				invoiceVO: {},
				invoiceItemVOList: []
			},
			previewImg: '',
			ENV
		};
	},
	mounted() {
		this.getInvoiceDetail();
	},
	methods: {
		handlePreview() {
			this.previewImg = ENV.BASE_NET + this.detailData.invoiceVO.attachment;
			this.$refs.viewer.$viewer.show();
		},
		async getInvoiceDetail() {
			const params = {
				id: this.$route.query.id
			};
			const res = await getInvoiceDetail(params);
			this.detailData = res.data;
			this.detailData.invoiceItemVOList = this.detailData.invoiceItemVOList || [];
		}
	},
	components: {
		InvoiceInfo,
		TableInvoice,
		Breadcrumb
	}
};
</script>

<style scoped lang="less">
.detail {
	padding-top: 20px;
	// background: #fff;
	position: relative;
	padding-bottom: 20px;
	.title {
		padding-bottom: 15px;
		font-size: 20px;
		color: rgba(0, 0, 0, 0.8);
		font-weight: 600;
		border-bottom: 1px solid #e9effc;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-family:
			PingFangSC-Medium,
			PingFang SC,
			PingFangSC-Regular,
			PingFang SC;
	}
	.top {
		font-family: 'PingFang SC';
		height: 32px;
		font-style: normal;
		font-weight: 500;
		font-size: 16px;
		line-height: 32px;
		color: rgba(0, 0, 0, 0.8);
		position: relative;
		padding-left: 12px;

		&:before {
			content: '';
			top: 7px;
			position: absolute;
			display: block;
			width: 4px;
			height: 18px;
			left: 0;
			background: @primary-color;
		}
	}
	.affix {
		font-size: 14px;
		font-family:
			PingFangSC-Regular,
			PingFang SC;
		font-weight: 400;
		color: @primary-color;
		margin-bottom: 50px;
		cursor: pointer;
	}
}
</style>
