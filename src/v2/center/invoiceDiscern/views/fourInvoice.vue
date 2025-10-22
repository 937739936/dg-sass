<template>
	<div class="add-box">
		<Breadcrumb></Breadcrumb>
		<a-card
			:bordered="false"
			class="add-invoice"
		>
			<div class="invoice-title">发票新增-发票信息确认</div>

			<div class="task">
				<div
					class="top"
					style="margin-bottom: 20px"
				>
					发票信息
				</div>
				<InvoiceInfo :info="detail"></InvoiceInfo>
			</div>
			<div
				class="task"
				v-if="invoiceItemList.length > 8"
			>
				<div
					class="top"
					style="margin-bottom: 20px"
				>
					销售货物或应税劳务、服务清单
				</div>
				<TableInvoice
					type="detail"
					:dataSource="invoiceItemList"
				></TableInvoice>
			</div>
			<!-- 保存 -->
			<div class="save-box">
				<div
					class="btn"
					@click="goBack"
					style="margin-right: 60px"
				>
					上一步
				</div>
				<div
					class="btn btn1"
					@click="save"
				>
					保存
				</div>
			</div>
		</a-card>
		<SaveModal
			ref="saveModal"
			:dataSource="invoiceItemList"
			type="fourEle"
		></SaveModal>
	</div>
</template>

<script>
import InvoiceInfo from '../components/InvoiceInfo.vue';
import Breadcrumb from '../components/Breadcrumb.vue';
import TableInvoice from '../components/TableInvoice.vue';
import SaveModal from '../components/saveModal.vue';

import { getFourFactorDetail, saveFourFactor } from '@/v2/center/invoiceDiscern/api';
export default {
	data() {
		return {
			detail: {
				invoiceVO: {}
			},
			invoiceItemList: []
		};
	},
	mounted() {
		this.getFourFactorDetail();
	},
	methods: {
		goBack() {
			this.$router.go(-1);
		},
		async save() {
			const params = {
				taskId: this.$route.query.taskId
			};
			await saveFourFactor(params);
			// this.$message.success('保存成功')
			this.$refs.saveModal.open();
		},
		async getFourFactorDetail() {
			const params = {
				taskId: this.$route.query.taskId
			};
			const res = await getFourFactorDetail(params);

			this.detail = res.data;

			this.invoiceItemList = res.data.invoiceItemVOList || [];
		}
	},
	components: {
		InvoiceInfo,
		Breadcrumb,
		TableInvoice,
		SaveModal
	}
};
</script>

<style scoped lang="less">
.add-box {
	padding-top: 25px;
	// min-height: calc(100vh - 130px);
	background: #fff;
	position: relative;
	height: 100%;
	box-sizing: border-box;
	padding-bottom: 20px;
}

.add-invoice {
	// margin-top: 6px;
	// min-height: calc(100vh - 135px);

	.invoice-title {
		padding-bottom: 15px;
		border-bottom: 1px solid #e9effc;
		display: flex;
		font-size: 20px;
		color: rgba(0, 0, 0, 0.8);
		font-weight: 600;
		align-items: center;
		justify-content: space-between;
	}

	.upload-box,
	.task {
		margin-top: 30px;

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
				background: #4682f3;
			}
		}
	}

	.btn-box-title {
		display: flex;
		align-items: center;
		margin-top: 20px;

		.btn {
			width: 106px;
			height: 38px;
			border-radius: 4px;
			border: 1px solid #4682f3;
			display: flex;
			justify-content: center;
			align-items: center;
			color: #4682f3;
			font-size: 14px;
			margin-right: 20px;
			cursor: pointer;

			.icon {
				margin-right: 10px;
			}
		}

		.btn1 {
			background: #4682f3;
			color: #fff;
		}
	}

	.tip {
		font-size: 12px;
		font-weight: 400;
		color: #8495aa;
		line-height: 22px;
		margin-top: 20px;
	}

	.task {
		margin-top: 30px;
	}

	.btn-box {
		// min-width: 180px;
		width: 100%;
		display: flex;
		// justify-content: space-around;
		// align-items: left;
		position: relative;
	}

	.del-box {
		width: 22px;
		height: 22px;
		display: none;
		align-items: center;
		justify-content: center;
		position: absolute;
		top: 50%;
		right: 10px;
		border-radius: 4px;
		transform: translateY(-50%);
		cursor: pointer;
	}

	.del-box:hover {
		background: rgba(132, 149, 170, 0.1);
	}

	.del-btn {
		// display:  none;
		font-size: 20px;
		color: #8495aa;

		line-height: inherit;
		line-height: 20px;
	}

	.btn-box:hover {
		.del-box {
			display: flex;
		}

		// .del-btn {
		//   display: inline-block;
		// }
	}
}
.save-box {
	display: flex;
	align-items: center;
	justify-content: center;
	position: sticky;
	width: 100%;
	background: #fff;
	bottom: 0px;

	height: 100px;

	left: 0;
	z-index: 999;
	.btn {
		width: 114px;
		height: 38px;
		border-radius: 4px;
		border: 1px solid #4682f3;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #4682f3;
		font-size: 14px;
		margin-right: 20px;
		cursor: pointer;
		.icon {
			margin-right: 10px;
		}
	}
	.btn1 {
		background: #4682f3;
		color: #fff;
	}
}
</style>
